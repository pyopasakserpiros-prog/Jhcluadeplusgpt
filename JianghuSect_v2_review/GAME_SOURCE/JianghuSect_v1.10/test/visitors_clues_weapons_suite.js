'use strict';
const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const g = require('./load.js');

const ROOT = path.resolve(__dirname, '..');

function runVisitorsCluesWeaponsSuite() {
  console.log('=== Running Visitors, Living Clues & Legendary Weapons Suite ===');

  // 0. Hard Invariant: human_core.js byte-for-byte SHA-256 lock
  const hcBytes = fs.readFileSync(path.join(ROOT, 'js/human_core.js'));
  const hcSha = crypto.createHash('sha256').update(hcBytes).digest('hex');
  assert.strictEqual(
    hcSha,
    'a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542',
    'human_core.js must remain byte-for-byte identical'
  );
  assert.strictEqual(g.HC.FINGERPRINT, '155:2f9c9dd7', 'HC.FINGERPRINT must remain 155:2f9c9dd7');

  // 1. Catalog Validation (11 Legendary Weapons across 7 Families + 41 Clue Templates)
  assert(g.VC && g.VC.VERSION === 1, 'VC module loaded');
  const catErrs = g.VC.validateCatalog();
  assert.deepStrictEqual(catErrs, [], 'Catalog validation errors: ' + catErrs.join('; '));
  assert.strictEqual(g.VC.LEGENDARY_WEAPONS.length, 11, 'Must have 11 authored legendary weapons');
  assert.strictEqual(g.VC.CLUE_TEMPLATES.length, 41, 'Must have 41 authored clue templates');

  const families = new Set(g.VC.LEGENDARY_WEAPONS.map(w => w.gearType));
  ['SWORD', 'BLADE', 'SPEAR', 'STAFF', 'FIST', 'BOW', 'FOCUS'].forEach(fam => {
    assert(families.has(fam), 'Legendary weapons must cover weapon family ' + fam);
  });

  // 2. Outsider / Visitor Lifecycle & Strict Non-Member Isolation
  {
    const W = g.SIM.create('vc-visitor-lifecycle');
    const popBefore = W.npcs.length;
    const occBefore = g.SECT.memberOccupancy(W);

    // Spawn an admitted scholar guest with a clue
    const v1 = g.VC.spawnGuest(W, {
      role: 'scholar',
      notable: true,
      forceAdmit: 'admitted',
      withClue: true,
      clueTemplateId: 'CLUE_LEG_WPN_YITIAN_SWORD'
    });
    assert(v1 && v1.kind === 'guest', 'Guest spawned with kind=guest');
    assert.strictEqual(W.npcs.length, popBefore, 'Guest must NEVER be added to W.npcs');
    assert.strictEqual(g.SECT.memberOccupancy(W), occBefore, 'Guest must NEVER count toward memberOccupancy / 100-bed cap');
    assert(!W.byId[v1.id], 'Guest must not pollute W.byId member index');
    assert(g.VC.activeGuests(W).some(x => x.id === v1.id), 'Guest is listed in VC.activeGuests(W)');
    assert(!g.EXT.activeVisitors(W).some(x => x.id === v1.id), 'Guest does not pollute EXT.activeVisitors trader list');

    // Restricted visitor cannot enter scripture pavilion or inner halls
    const vRestr = g.VC.spawnGuest(W, { role: 'wanderer', forceAdmit: 'restricted' });
    assert.strictEqual(vRestr.state, 'restricted');
    assert.strictEqual(g.VC.canVisitorAccessBuilding(vRestr, 'plaza'), true, 'Restricted visitor allowed in plaza');
    assert.strictEqual(g.VC.canVisitorAccessBuilding(vRestr, 'scripture'), false, 'Restricted visitor barred from scripture pavilion');
    assert.strictEqual(g.VC.canVisitorAccessBuilding(vRestr, 'vault'), false, 'Restricted visitor barred from vault');

    // Rejected visitor under hostile/closed gate
    const vRej = g.VC.spawnGuest(W, { role: 'wanderer', forceAdmit: 'rejected' });
    assert.strictEqual(vRej.state, 'rejected');

    // Host interaction with v1 transfers the clue to the member
    const host = W.byId[W.sect.masterId];
    const okMeet = g.VC.interactWithVisitor(W, host, v1);
    assert.strictEqual(okMeet, true, 'Member interaction with guest succeeded');
    assert(Array.isArray(host.knownClues) && host.knownClues.includes(v1.clueInstanceId), 'Host learned clue from visitor');

    // Departure cleans up visitor and stores recurring record in W.world.guestRegistry
    const guestId = v1.id;
    g.VC.departVisitor(W, v1, 'เดินทางกลับหลังสนทนา');
    assert.strictEqual(v1.state, 'offsite');
    assert(W.world.guestRegistry[guestId], 'Departed guest preserved in W.world.guestRegistry for return visits');
    assert.strictEqual(g.VC.findVisitor(W, guestId).id, guestId, 'VC.findVisitor resolves departed guest from registry');

    // Returning guest reuses identity and increments visit count
    const vReturn = g.VC.spawnGuest(W, { returningId: guestId, forceAdmit: 'admitted' });
    assert.strictEqual(vReturn.id, guestId, 'Returning guest reuses persistent visitor id');
    assert(vReturn.visits >= 2, 'Returning guest increments visits counter');
  }

  // 3. Rumor Provenance (rootRumorId), Sharing, and False Rumor Disproof
  {
    const W = g.SIM.create('vc-rumor-provenance');
    const a = W.npcs[0], b = W.npcs[1], c = W.npcs[2];
    const inst = g.VC.spawnClueInstance(W, 'CLUE_ORD_JADE_LOTUS_2', { sourceKind: 'visitor', forceTruth: 'true_lead' });
    assert(inst && inst.rootRumorId, 'Clue instance has a rootRumorId');

    // Member A learns from original root rumor
    g.VC.learnClueFragment(W, a, inst, { rootRumorId: inst.rootRumorId, confidence: 60 });
    const confA0 = inst.knownBy[a.id].confidence;
    assert.strictEqual(inst.corroboratingRoots.length, 1, '1 root rumor recorded');

    // Member A shares with B, and B shares back with A (same rootRumorId!)
    g.VC.learnClueFragment(W, b, inst, { fromId: a.id, rootRumorId: inst.rootRumorId });
    g.VC.learnClueFragment(W, a, inst, { fromId: b.id, rootRumorId: inst.rootRumorId });
    assert.strictEqual(inst.corroboratingRoots.length, 1, 'Repeating hearsay from same rootRumorId MUST NOT inflate corroboratingRoots');
    assert.strictEqual(inst.knownBy[a.id].confidence, confA0, 'Repeating same rootRumorId MUST NOT inflate confidence');

    // Now an independent second root rumor corroborates the lead
    g.VC.learnClueFragment(W, a, inst, { rootRumorId: 'rumor_independent_2' });
    assert.strictEqual(inst.corroboratingRoots.length, 2, 'Independent rootRumorId increments corroboratingRoots');
    assert(inst.knownBy[a.id].confidence > confA0, 'Independent corroboration increases confidence');

    // False rumor disproof test
    const falseInst = g.VC.spawnClueInstance(W, 'CLUE_ORD_METEOR_IRON_5', { sourceKind: 'visitor', forceTruth: 'false_rumor' });
    const resFalse = g.VC.evaluateClueNode(W, falseInst, [a, b]);
    assert.strictEqual(resFalse.ok, false, 'False rumor does not grant reward');
    assert.strictEqual(resFalse.disproven, true, 'False rumor is cleanly disproven on investigation');
    assert.strictEqual(falseInst.status, 'disproven', 'False rumor status marked disproven');
  }

  // 4. Personal vs Party Trial Scope Enforcement & Guardian Combat
  {
    const W = g.SIM.create('vc-trial-scopes');
    const weakClaimant = W.npcs[1];
    const strongEscort = W.npcs[0];

    // Give weakClaimant low strength (32) and strongEscort high strength (85)
    g.SECT.EDITOR.applyCharacterEdit(W, weakClaimant.id, { physiology: { strength: 28 } });
    g.SECT.EDITOR.applyCharacterEdit(W, strongEscort.id, { physiology: { strength: 85 } });

    // Spawn Xuantie Heavy Sword clue and advance to Step 2 (wield_heavy_iron_trial: scope = 'personal', minVal = 64)
    const xuanInst = g.VC.spawnClueInstance(W, 'CLUE_LEG_WPN_XUANTIE_HEAVY_SWORD', { forceTruth: 'true_lead' });
    xuanInst.completedNodes.push(g.VC.TEMPLATE_BY_ID[xuanInst.templateId].steps[0].nodeId);
    xuanInst.currentNodeIdx = 1; // Step 2: personal body_trial requiring physiology.strength >= 64

    // Attempt with weakClaimant as primary claimant + strongEscort in party: MUST FAIL because scope is 'personal'!
    const failPersonal = g.VC.evaluateClueNode(W, xuanInst, [weakClaimant, strongEscort]);
    assert.strictEqual(failPersonal.ok, false, 'Strong escort MUST NOT pass a personal inheritance trial on behalf of a weak claimant');
    assert.notStrictEqual(xuanInst.status, 'claimed', 'Clue remains unclaimed when personal trial fails');

    // Now test with strongEscort as the personal claimant: MUST PASS and claim Xuantie Heavy Sword!
    const passPersonal = g.VC.evaluateClueNode(W, xuanInst, [strongEscort, weakClaimant]);
    assert.strictEqual(passPersonal.ok, true, 'Qualified claimant passes personal trial');
    assert.strictEqual(xuanInst.status, 'claimed', 'Xuantie Heavy Sword clue marked claimed');
    assert(W.world.uniqueArtifacts['LEG_WPN_XUANTIE_HEAVY_SWORD'], 'Xuantie Heavy Sword registered in uniqueArtifacts');
  }

  // 5. Replay / Race Idempotency & Save/Load Integrity for Named Story Rewards
  {
    const W = g.SIM.create('vc-idempotency');
    const m = W.byId[W.sect.masterId];
    const inst = g.VC.spawnClueInstance(W, 'CLUE_LEG_WPN_YITIAN_SWORD', { forceTruth: 'true_lead' });
    const cpBefore = m.cp || 0;

    // Controlled receipt test: mark prerequisites explicitly; bypass rejection is checked separately.
    inst.completedNodes = g.VC.TEMPLATE_BY_ID[inst.templateId].steps.map(s => s.nodeId);
    const grant1 = g.VC.grantNamedStoryReward(W, inst, [m], {});
    assert.strictEqual(grant1.ok, true, 'First grant succeeds');
    const cpAfter1 = m.cp || 0;
    const gearCount1 = W.sect.gear.filter(x => x && x.id === 'LEG_WPN_YITIAN_SWORD').length +
      W.npcs.reduce((acc, n) => acc + ((n.equip && n.equip.WEAPON && n.equip.WEAPON.id === 'LEG_WPN_YITIAN_SWORD') ? 1 : 0) + ((n.inv && n.inv.gear || []).filter(g2 => g2.id === 'LEG_WPN_YITIAN_SWORD').length), 0);
    assert.strictEqual(gearCount1, 1, 'Exactly 1 Yitian Sword exists after first grant');

    // Replay grantNamedStoryReward on same clue / target
    const grant2 = g.VC.grantNamedStoryReward(W, inst, [m], {});
    assert.strictEqual(grant2.ok, false, 'Second duplicate grant is blocked by receipt');
    assert.strictEqual(m.cp || 0, cpAfter1, 'Duplicate grant does not pay duplicate CP');

    // Save/load round-trip preserves uniqueArtifacts, claimReceipts, visitors, and clue state
    const saved = g.SIM.serialize(W);
    const W2 = g.SIM.deserialize(saved);
    assert(W2.world.uniqueArtifacts['LEG_WPN_YITIAN_SWORD'], 'uniqueArtifacts preserved across save/load');
    const grantAfterLoad = g.VC.grantNamedStoryReward(W2, W2.world.clues.active[inst.instanceId], [W2.byId[W2.sect.masterId]], {});
    assert.strictEqual(grantAfterLoad.ok, false, 'Duplicate grant still blocked after save/load');
  }

  // 6. All 11 Legendary Weapons: Minting, q/quality Canonical Accessor, Suitability, and Real Combat Procs
  {
    const W = g.SIM.create('vc-11-weapons-combat');
    const a = W.npcs[0], b = W.npcs[1];
    g.SECT.EDITOR.applyCharacterEdit(W, a.id, { physiology: { strength: 85 }, personality: { courage: 80 } });
    if (!a.cult) g.SIM.awaken(W, W.rng, a, 5);
    else a.cult.stage = 5;
    if (!b.cult) g.SIM.awaken(W, W.rng, b, 5);
    else b.cult.stage = 5;

    for (const wDef of g.VC.LEGENDARY_WEAPONS) {
      const item = g.VC.mintLegendaryWeapon(W, wDef.id, 'test');
      assert(item && item.id === wDef.id, 'Minted ' + wDef.id);
      assert.strictEqual(item.q, item.quality, 'Canonical q and quality fields match on ' + wDef.id);
      assert.strictEqual(g.VC.gearQuality(item), item.q, 'VC.gearQuality returns canonical quality');

      // Equip on `a` and verify STATS.explain does not double-scale fixedStats and reflects weapon
      a.equip = a.equip || {};
      a.equip.WEAPON = item;
      const st = g.STATS.explain(a).v;
      assert(st.atk > 400, wDef.id + ' contributes real combat stats (atk=' + st.atk + ')');

      // Reset proc cooldowns and trigger offensive proc on `b`
      a._legProcCd = {};
      b._legProcCd = {};
      b.h.state.hp = g.CULT.hpMax(b);
      b.shield = 200;
      a.h.state.qi = g.CULT.qiMax(a);
      const f = { id: 1, kind: 'spar', serious: false, A: [a.id], B: [b.id] };
      const procRes = g.VC.runWeaponProcs(W, f, a, b, 120, false);
      assert(procRes && procRes.triggered, 'Offensive combat proc triggered for ' + wDef.id + ' (' + (procRes && procRes.effectId) + ')');

      // Verify ICD prevents immediate re-trigger on the exact same tick
      const procResSameTick = g.VC.runWeaponProcs(W, f, a, b, 120, false);
      assert.strictEqual(procResSameTick, null, 'ICD blocks immediate repeat proc on same tick for ' + wDef.id);
    }

    // Verify suitability check: low-strength disciple declines Xuantie Heavy Sword
    const frail = W.npcs[2];
    g.SECT.EDITOR.applyCharacterEdit(W, frail.id, { physiology: { strength: 28 } });
    if (!frail.cult) g.SIM.awaken(W, W.rng, frail, 5);
    else frail.cult.stage = 5;
    const xuantie = g.VC.mintLegendaryWeapon(W, 'LEG_WPN_XUANTIE_HEAVY_SWORD', 'test-frail');
    assert.strictEqual(g.MARTIAL.gearUsable(frail, xuantie), false, 'Frail disciple (strength < 58) cannot wield Xuantie Heavy Sword');
    const clsFrail = g.MARTIAL.classifyGearForNpc(W, frail, xuantie, 0);
    assert.notStrictEqual(clsFrail.category, 'useful-now', 'Frail disciple does not classify Xuantie Heavy Sword as useful-now');
  }

  // 7. Controlled Reachability of All 41 Clue Templates (8 Ordinary + 22 Legendary Arts + 11 Legendary Weapons)
  {
    const W = g.SIM.create('vc-all-41-reachability');
    W.sect.stones = 50000;
    const hero = W.byId[W.sect.masterId];
    const comp1 = W.npcs[1], comp2 = W.npcs[2];
    [hero, comp1, comp2].forEach(n => {
      if (!n.cult) g.SIM.awaken(W, W.rng, n, 5);
      else n.cult.stage = g.CULT.maxStage(n);
      n.inv.stones = 25000;
      g.HC.STAT_DEFS.forEach(sd => {
        const [lyr, k] = sd.path.split('.');
        if (n.h[lyr]) n.h[lyr][k] = 90;
        n.h.innate[sd.path] = 90;
      });
      Object.keys(n.h.skills || {}).forEach(sk => { n.h.skills[sk] = 90; });
      ['SWORD', 'BLADE', 'SPEAR', 'STAFF', 'FIST_PALM', 'BOW', 'DAGGER', 'MOVEMENT', 'BODY_REFINING', 'SOUL_DIVINE', 'POISON', 'ARRAY', 'SCRIPTURE', 'ALCHEMY', 'FORGING', 'HERBALISM', 'MINING', 'BEAST', 'survival', 'construction', 'scholarship', 'governance', 'medicine', 'cooking'].forEach(sk => {
        n.h.skills[sk] = 90;
      });
      n.martialSkills = { BOW: 90, STAFF: 90, FOCUS: 90 };
      g.HC.touch(n);
      g.CULT.refreshLifespan(n);
      n.h.state.hp = g.CULT.hpMax(n);
      n.h.state.qi = g.CULT.qiMax(n);
      n.h.state.energy = 100;
    });

    let completedCount = 0;
    for (const tpl of g.VC.CLUE_TEMPLATES) {
      [hero, comp1, comp2].forEach(n => {
        n.inj = [];
        g.HC.touch(n);
        n.h.state.hp = g.CULT.hpMax(n);
        n.h.state.qi = g.CULT.qiMax(n);
        n.inv.stones = 25000;
      });
      const inst = g.VC.spawnClueInstance(W, tpl.templateId, { forceTruth: 'true_lead' });
      assert(inst, 'Spawned clue instance for ' + tpl.templateId);
      let guard = 0;
      while (inst.status !== 'claimed' && guard++ < 12) {
        const res = g.VC.evaluateClueNode(W, inst, [hero, comp1, comp2], { forcePass: true });
        assert.strictEqual(res.ok, true, 'Step failed in ' + tpl.templateId + ': ' + inst.lastActionReasonTh);
      }
      assert.strictEqual(inst.status, 'claimed', 'Completed all steps and claimed reward for ' + tpl.templateId);
      completedCount++;
    }
    assert.strictEqual(completedCount, 41, 'All 41 clue templates are reachable and completable end-to-end');
    assert.strictEqual(Object.keys(W.world.uniqueArtifacts).length, 11, 'All 11 legendary weapons claimed and registered in uniqueArtifacts');
  }


  // 8. Rendering Determinism, Read-Only Purity & Visitor Hit-Testing across All 11 Legendary Weapons
  {
    function makeMockCtx() {
      return {
        canvas: { width: 800, height: 600 },
        save() {}, restore() {}, setTransform() {}, scale() {}, translate() {}, rotate() {},
        beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, quadraticCurveTo() {}, bezierCurveTo() {},
        arc() {}, ellipse() {}, rect() {}, roundRect() {}, fill() {}, stroke() {}, clip() {},
        fillRect() {}, strokeRect() {}, clearRect() {}, fillText() {}, strokeText() {},
        drawImage() {}, setLineDash() {},
        measureText(s) { return { width: String(s || '').length * 6 }; },
        createLinearGradient() { return { addColorStop() {} }; },
        createRadialGradient() { return { addColorStop() {} }; }
      };
    }
    globalThis.document = globalThis.document || {
      createElement() {
        return { width: 256, height: 256, style: {}, getContext() { return makeMockCtx(); } };
      }
    };
    require(path.join(ROOT, 'js/render.js'));

    const W = g.SIM.create('vc-render-purity');
    const guest = g.VC.spawnGuest(W, { role: 'scholar', notable: true, forceAdmit: 'admitted', withClue: true });
    guest.x = 118; guest.y = 70;
    const m = W.byId[W.sect.masterId];
    m.x = 119; m.y = 70;
    m.cult.stage = g.CULT.maxStage(m);
    g.SECT.EDITOR.applyCharacterEdit(W, m.id, { physiology: { strength: 88 } });

    const cv = { width: 824, height: 1720, clientWidth: 412, clientHeight: 860, style: {}, getContext() { return makeMockCtx(); } };
    const R = g.Render.create(cv);
    R.setWorld(W);
    R.resize();
    R.focus(118, 70, 1.5);

    // Verify picking the physical visitor on the map returns { kind: 'visitor', id: guest.id }
    const scr = R.w2s(guest.x * 16, (guest.y - 0.5) * 16);
    const hit = R.pickAt(scr.x, scr.y);
    assert(hit && hit.kind === 'visitor' && hit.id === guest.id, 'R.pickAt hits physical visitor on sect map');

    // Equip each of the 11 legendary weapons and verify R.draw + R.portrait never mutate SIM.serialize(W) or W.rng.s
    for (const wDef of g.VC.LEGENDARY_WEAPONS) {
      m.equip.WEAPON = g.VC.mintLegendaryWeapon(W, wDef.id, 'render-test');
      R.invalidate();
      const rngBefore = W.rng.s;
      const serBefore = g.SIM.serialize(W);
      const ap = R.appearance(m);
      assert.strictEqual(ap.weaponVisualKey, wDef.visualKey, 'R.appearance reflects visualKey for ' + wDef.id);
      R.draw(1000);
      g.Render.portrait({ width: 64, height: 64, style: {}, getContext() { return makeMockCtx(); } }, m, 64);
      assert.strictEqual(W.rng.s, rngBefore, 'R.draw/portrait must not advance W.rng.s for ' + wDef.id);
      assert.strictEqual(g.SIM.serialize(W), serBefore, 'R.draw/portrait must not mutate serialized world state for ' + wDef.id);
    }
  }

  console.log('PASS visitors_clues_weapons_suite: 41/41 clue chains, 11/11 legendary weapons, outsider isolation, provenance & idempotency verified');
}

if (require.main === module) {
  runVisitorsCluesWeaponsSuite();
}
module.exports = runVisitorsCluesWeaponsSuite;
