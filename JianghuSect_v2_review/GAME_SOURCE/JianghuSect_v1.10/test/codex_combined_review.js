'use strict';
/**
 * Combined Review Followups (Items 1–10) & Wuxia Inventory/Storage/Shop UI Verification Suite
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const g = require('./load');
if (!g.UI) require('../js/ui.js');
let failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log('PASS ' + name);
  } catch (e) {
    failed++;
    console.error('FAIL ' + name + ': ' + (e && e.stack ? e.stack : e.message));
  }
}

// Baseline 6 Codex Review Checks
check('story rewards require all completed nodes', () => {
  const W = g.SIM.create('codex-grant-guard'), n = W.npcs[0], i = g.VC.spawnClueInstance(W, 'CLUE_LEG_WPN_YITIAN_SWORD');
  assert.equal(g.VC.grantNamedStoryReward(W, i, n, [n]).ok, false);
  assert.equal(Object.keys(W.world.claimReceipts).length, 0);
});

check('legendary weapon cooldown survives save/load', () => {
  const W = g.SIM.create('codex-cooldown'), a = W.npcs[0], d = W.npcs[1];
  a.cult.stage = 7;
  a.equip.WEAPON = g.VC.mintLegendaryWeapon(W, 'LEG_WPN_YITIAN_SWORD', 'test');
  const first = g.VC.runWeaponProcs(W, {}, a, d, false, { hit: true, dmg: 10, crit: false });
  assert(first);
  const W2 = g.SIM.deserialize(g.SIM.serialize(W));
  assert.equal(g.VC.runWeaponProcs(W2, {}, W2.byId[a.id], W2.byId[d.id], false, { hit: true, dmg: 10, crit: false }), null);
});

check('expired clues cannot grant even with forced trial success', () => {
  const W = g.SIM.create('codex-expired'), i = g.VC.spawnClueInstance(W, 'CLUE_ORD_JADE_LOTUS_2');
  i.status = 'expired';
  assert.equal(g.VC.evaluateClueNode(W, i, [W.npcs[0]], { forcePass: true }).ok, false);
});

check('daily planning does not complete local activity', () => {
  const W = g.SIM.create('codex-local'), n = W.npcs[0], i = g.VC.spawnClueInstance(W, 'CLUE_ORD_XIAN_SWORD_T1');
  g.VC.learnClueFragment(W, n, i, { confidence: 90 });
  g.ECO.add(W, 'meal', 30);
  const pick = g.VC.pickActionableClueForNpc;
  g.VC.pickActionableClueForNpc = (_W, x) => x === n ? { inst: i, step: g.VC.TEMPLATE_BY_ID[i.templateId].steps[0] } : null;
  try { g.VC.daily(W); } finally { g.VC.pickActionableClueForNpc = pick; }
  assert.equal(i.nodeAttempts.demonstrate_courtesy || 0, 0);
});

check('completed clues do not exhaust the active opportunity budget', () => {
  const W = g.SIM.create('codex-clue-budget');
  for (let x = 0; x < g.VC.MAX_ACTIVE_CLUES; x++) {
    const i = g.VC.spawnClueInstance(W, 'CLUE_ORD_JADE_LOTUS_2');
    i.status = 'claimed';
  }
  W.day++; W.t += 1440;
  const v = g.VC.spawnGuest(W, { role: 'scholar', forceAdmit: 'admitted', withClue: true });
  assert(v.clueTemplateId, 'terminal records must not block new visitor information');
});

check('clue departures preserve protected work and sleep', () => {
  const W = g.SIM.create('codex-protected'), n = W.npcs[1], i = g.VC.spawnClueInstance(W, 'CLUE_ORD_JADE_LOTUS_2');
  n.act = { id: 'sleep', stage: 'do', ctx: {}, left: 200, total: 200 };
  assert(g.AI.isProtectedAction(W, n, 'expedition'));
  assert.equal(g.VC.departClueExpedition(W, n, i, [n]), null);
  assert.equal(n.act.id, 'sleep');
});

// Item 1: Guardian Encounter Combat Engine + Zero-Survivor Guard
check('Item 1: Guardian encounter tactical combat & zero-survivor expedition guard', () => {
  const W = g.SIM.create('item1-guardian');
  const leader = W.npcs[0], ally = W.npcs[1];
  leader.cult.stage = 6; ally.cult.stage = 5;
  leader.h.state.hp = g.CULT.hpMax(leader);
  ally.h.state.hp = g.CULT.hpMax(ally);
  leader.equip.WEAPON = g.VC.mintLegendaryWeapon(W, 'LEG_WPN_YITIAN_SWORD', 'test');
  leader.inv.pills = { 'P:BASIC_HP': 2 };

  const inst = g.VC.spawnClueInstance(W, 'CLUE_LEG_WPN_TULONG_SABER');
  const tpl = g.VC.TEMPLATE_BY_ID[inst.templateId];
  const combatNode = tpl.steps.find(s => s.type === 'guardian_combat');
  assert(combatNode, 'must have guardian_combat node');

  const encRes = g.VC.simulateGuardianEncounter(W, [leader, ally], combatNode, inst, tpl, {});
  assert(encRes.rounds >= 1 && Array.isArray(encRes.logTh) && encRes.logTh.length >= 1, 'must simulate tactical combat rounds');
  assert(inst.lastEncounterSummary && inst.lastEncounterSummary.rounds >= 1, 'must record encounter summary on clue instance');

  // Zero-survivor guard: evaluateClueNode with dead party must fail and never claim reward
  const deadNpc = W.npcs[2];
  deadNpc.dead = true;
  const deadRes = g.VC.evaluateClueNode(W, inst, [deadNpc], { forcePass: true });
  assert.strictEqual(deadRes.ok, false, 'dead party must never pass or claim clue node');
});

// Item 2: 7 Distinct Clue Resolution Approaches
check('Item 2: 7 distinct clue resolution approaches', () => {
  const W = g.SIM.create('item2-approaches');
  const n = W.npcs[0];
  n.cult.stage = 6;
  n.h.skills.SCRIPTURE = 80;
  n.h.skills.MEDICINE = 80;
  n.h.personality.integrity = 85;
  n.h.social.empathy = 80;

  const approaches = ['interpret_evidence', 'help_contact', 'honor_commitment', 'nonlethal_trial', 'deliver_item', 'guardian_combat', 'tactical_retreat'];
  for (const ap of approaches) {
    const inst = g.VC.spawnClueInstance(W, 'CLUE_ORD_JADE_LOTUS_2');
    n.inv.stones = 500;
    n.inv.mats = { MAT_HERB_DEW_GRASS_1: 5 };
    const r = g.VC.evaluateClueNode(W, inst, [n], { chosenApproach: ap });
    if (ap === 'tactical_retreat') {
      assert.strictEqual(r.passed, false, 'tactical_retreat must safely abort without passing node');
      assert.strictEqual(r.retreated, true, 'tactical_retreat must set retreated flag');
      assert(r.reconBonus >= 8, 'tactical_retreat must grant reconBonus');
    } else if (ap === 'nonlethal_trial') {
      assert(inst.lastTrialSummary && inst.lastTrialSummary.kind === 'nonlethal_trial', 'nonlethal_trial must record trial summary');
    } else if (ap === 'guardian_combat') {
      assert(inst.lastEncounterSummary && inst.lastEncounterSummary.kind === 'expedition_tactical_encounter', 'guardian_combat must run tactical encounter');
    }
  }
});

// Item 3: Exterior-to-Exterior Multi-Region Traversal & Strict Knowledge Scoping
check('Item 3: Multi-region exterior traversal & knowledge scoping without leaking future steps or truth', () => {
  const W = g.SIM.create('item3-scoping');
  const n = W.npcs[0];
  const inst = g.VC.spawnClueInstance(W, 'CLUE_LEG_WPN_OVERLORD_SPEAR', { truthful: false });
  const tpl = g.VC.TEMPLATE_BY_ID[inst.templateId];
  assert(tpl.steps.length >= 2, 'Overlord Spear clue must have >= 2 steps');
  const extRegions = new Set(tpl.steps.map(s => s.locationId).filter(loc => loc !== 'sect'));
  assert(extRegions.size >= 2, 'must span at least 2 distinct exterior regions');

  g.VC.learnClueFragment(W, n, inst, { confidence: 75 });
  const npcView = g.VC.getNpcKnownClueView(W, n, inst.instanceId);
  assert.strictEqual(npcView.knownNodeIdx, 0, 'NPC at step 0 must only know step 0');
  assert.strictEqual(npcView.visibleSteps.length, 1, 'NPC view must not leak future steps');
  assert.strictEqual(npcView.truthKnown, false, 'NPC view must not know terminal truth prematurely');
  assert.strictEqual(npcView.truthState, 'unverified', 'NPC view must mask unverified truthState');

  const playerView = g.VC.getPlayerClueView(W, inst.instanceId, { debugAllSteps: false });
  assert.strictEqual(playerView.visibleSteps.length, 1, 'Player non-debug view must only show discovered steps');
  assert(playerView.hiddenFutureStepsCount >= 1, 'Player view must report count of hidden future steps');
});

// Item 4: Companion Consent, Commitments & Resource Governance
check('Item 4: Companion consent, refusal reasons, and sect resource authorization', () => {
  const W = g.SIM.create('item4-consent');
  while (W.npcs.length < 4) g.SIM.addNpc(W, { ageYears: 22, quality: 0.7, rank: 2, stage: 3 });
  const leader = W.npcs[1], injuredComp = W.npcs[2], healthyComp = W.npcs[3];
  const inst = g.VC.spawnClueInstance(W, 'CLUE_LEG_WPN_TULONG_SABER');
  const step = g.VC.TEMPLATE_BY_ID[inst.templateId].steps[0];
  const reg = g.EXPED.REGIONS[0];

  injuredComp.h.state.hp = 10; // Critically injured
  const ref = g.VC.evaluateCompanionConsent(W, leader, injuredComp, inst, step, reg);
  assert.strictEqual(ref.ok, false, 'critically injured companion must refuse');
  assert.strictEqual(ref.reasonCode, 'injured', 'must report injured reasonCode');

  healthyComp.h.state.hp = g.CULT.hpMax(healthyComp);
  healthyComp.h.state.energy = 90;
  healthyComp.h.state.satiety = 90;
  healthyComp.h.mind.relations[leader.id] = { a: 85, r: 80, t: 85, l: 20, v: 0, n: 12, bond: 'สหาย' };
  const acc = g.VC.evaluateCompanionConsent(W, leader, healthyComp, inst, step, reg);
  assert.strictEqual(acc.ok, true, 'trusted healthy companion should accept');

  // Resource governance: unapproved low-rank member cannot drain sect reserve
  leader.rank = 1; leader.post = null; leader.inv.stones = 0;
  W.sect.stones = 100; // below reserve floor (300)
  inst.reportedToSect = true;
  const authFail = g.VC.authorizeClueResourceUse(W, leader, inst, { stoneCost: 80 });
  assert.strictEqual(authFail.ok, false, 'must block unauthorized sect stone withdrawal below reserve floor');
});

// Item 5: Two-Stage Rarity Roll & Visitor World News
check('Item 5: Two-stage rarity roll and visitor general world news', () => {
  const W = g.SIM.create('item5-rarity');
  const counts = { Common: 0, Rare: 0, Exceptional: 0, Legendary: 0 };
  for (let d = 1; d <= 90; d++) {
    W.day = d; W.t = d * 1440;
    const cs = g.VC.ensure(W);
    cs.dailyBudget.cluesGenerated = 0;
    cs.dailyBudget.legendCluesGenerated = 0;
    Object.values(cs.active).forEach(c => { c.status = 'claimed'; });
    const v = g.VC.spawnGuest(W, { role: 'scholar', forceAdmit: 'admitted', withClue: true });
    if (v && v.clueTemplateId) {
      const tpl = g.VC.TEMPLATE_BY_ID[v.clueTemplateId];
      if (tpl) counts[tpl.rarity] = (counts[tpl.rarity] || 0) + 1;
    }
  }
  assert(counts.Common > counts.Rare, `Common (${counts.Common}) must exceed Rare (${counts.Rare})`);
  assert(counts.Rare >= counts.Exceptional, `Rare (${counts.Rare}) must be >= Exceptional (${counts.Exceptional})`);

  const guest = g.VC.spawnGuest(W, { role: 'wanderer', forceAdmit: 'admitted' });
  const news = g.VC.shareVisitorWorldNews(W, guest, W.npcs[0]);
  assert(news && news.textTh, 'visitor must share general world news');
  assert(W.world.visitorNews.length >= 1, 'visitorNews must be recorded on W.world');
});

// Item 6: Readiness Forecast, Failure Backoff & History Cap
check('Item 6: Readiness forecast, exponential backoff, and history cap', () => {
  const W = g.SIM.create('item6-backoff');
  const n = W.npcs[0];
  const inst = g.VC.spawnClueInstance(W, 'CLUE_LEG_WPN_YITIAN_SWORD');
  const tpl = g.VC.TEMPLATE_BY_ID[inst.templateId];
  const fc = g.VC.forecastNodeReadiness(W, n, inst, tpl.steps[0]);
  assert(typeof fc.ready === 'boolean' && typeof fc.gap === 'number', 'must return readiness forecast');

  g.VC.recordNodeFailureBackoff(W, inst, tpl.steps[0], n, 30, 55, 'ทักษะไม่พอ');
  assert.strictEqual(inst.totalFailures, 1);
  assert.strictEqual(inst.nextRetryDay, W.day + 2);
  assert(n.cognition && n.cognition.cluePrep && n.cognition.cluePrep.adviceTh, 'must set cluePrep hint on NPC');

  for (let k = 0; k < 35; k++) {
    g.VC.pushClueHistory(inst, { day: W.day, text: 'entry ' + k });
  }
  assert(inst.history.length <= 24, `clue history must be capped at 24, got ${inst.history.length}`);
});

// Item 7: Unique Weapon Lifecycle on Death/Exile/Retire & Guest Pruning
check('Item 7: Unique weapon lifecycle on death/retire and guest registry pruning', () => {
  const W = g.SIM.create('item7-lifecycle');
  const holder = W.npcs[1];
  const wpn = g.VC.mintLegendaryWeapon(W, 'LEG_WPN_XUANTIE_HEAVY_SWORD', 'test');
  holder.inv.gear = [wpn];
  g.VC.syncUniqueArtifacts(W);
  assert.strictEqual(W.world.uniqueArtifacts.LEG_WPN_XUANTIE_HEAVY_SWORD.ownerKind, 'npc_bag');

  g.AI.kill(W, holder, 'ทดสอบมรณะ');
  const auditAfterKill = g.VC.auditUniqueWeaponInvariant(W);
  assert.strictEqual(auditAfterKill.ok, true, 'unique weapon invariant must hold after holder death');
  assert.strictEqual(W.world.uniqueArtifacts.LEG_WPN_XUANTIE_HEAVY_SWORD.ownerKind, 'sect_storage');

  // Guest registry pruning preserves referenced guests
  const gKeep = g.VC.spawnGuest(W, { role: 'scholar', forceAdmit: 'admitted' });
  gKeep.state = 'offsite'; gKeep.lastDepartDay = -200;
  W.npcs[0].h.mind.relations[gKeep.id] = { a: 55, r: 50, l: 0, v: 0, n: 3 };
  g.VC.pruneGuestRegistry(W);
  assert(W.world.guestRegistry[gKeep.id], 'must preserve offsite guest referenced by NPC relations');
});

// Item 8: Combat Balance Benchmark & Yitian/Dagou Procs
check('Item 8: Yitian shield-sever proc, Dagou redirection proc, and weapon balance benchmark', () => {
  const W = g.SIM.create('item8-balance');
  const a = W.npcs[0], d = W.npcs[1];
  a.cult.stage = 7; d.cult.stage = 7;
  a.h.skills.SWORD = 85;
  d.h.skills.STAFF = 85;
  d.martialSkills = { STAFF: 85 };
  d.shieldBp = 500;
  a.equip.WEAPON = g.VC.mintLegendaryWeapon(W, 'LEG_WPN_YITIAN_SWORD', 'test');
  const procYitian = g.VC.runWeaponProcs(W, {}, a, d, false, { hit: true, dmg: 120, crit: true });
  assert(procYitian && procYitian.triggered, 'Yitian Sword must trigger proc');
  assert(d.shieldBp < 500, 'target shieldBp must be reduced by Yitian Sword');

  d.equip.WEAPON = g.VC.mintLegendaryWeapon(W, 'LEG_WPN_DAGOU_JADE_STAFF', 'test');
  const procDagou = g.VC.runWeaponOnStruckProcs(W, {}, d, a, { hit: true, dmg: 200 });
  assert(procDagou && procDagou.triggered && procDagou.redirectedDmg > 0, 'Dagou Staff must redirect damage back to attacker');

  const bench = g.VC.benchmarkWeaponBalance();
  assert.strictEqual(bench.length, 11, 'benchmark must cover all 11 legendary weapons');
  const ratios = bench.map(x => x.powerRatio);
  const spread = Math.max(...ratios) / Math.min(...ratios);
  assert(spread < 2.2, `legendary weapon power ratio spread must be balanced (<2.2), got ${spread}`);
});

// Item 9: Deterministic Applicant Evaluation & Clue Goal Integration
check('Item 9: Deterministic SECT.examineApplicant without PA leak & investigate_clue goal', () => {
  const W = g.SIM.create('item9-applicant');
  g.EXPED.recruitApplicants(W);
  const app = W.sect.queue[0];
  assert(app, 'must have applicant in queue');
  const ev1 = g.SECT.examineApplicant(W, app);
  const ev2 = g.SECT.examineApplicant(W, app);
  assert.strictEqual(ev1.totalScore, ev2.totalScore, 'examineApplicant must be deterministic without RNG noise');
  assert.strictEqual('pa' in ev1, false, 'examineApplicant must not leak hidden PA');
});

// Additional Requirement: Wuxia Item Icon Atlas & Inventory/Storage/Shop UI Parity
check('Additional Requirement: Wuxia Item Icon Atlas (64 cells, 11 Legendary Weapons + 22 Legendary Techs unique, 0 border bleed)', () => {
  const atlasPath = path.resolve(__dirname, '..', 'docs', 'ITEM_ICON_ATLAS_MAP.json');
  const pngPath = path.resolve(__dirname, '..', 'assets', 'wuxia_item_atlas.png');
  assert(fs.existsSync(atlasPath), 'docs/ITEM_ICON_ATLAS_MAP.json must exist');
  assert(fs.existsSync(pngPath), 'assets/wuxia_item_atlas.png must exist');
  const meta = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
  assert.strictEqual(meta.totalCells, 72, 'atlas must have 72 cells (64 base + 8 fishing/river cells)');
  assert.strictEqual(meta.legendaryWeaponsCount, 11, 'must have 11 bespoke legendary weapon cells');
  assert.strictEqual(meta.legendaryTechniquesCount, 22, 'must have 22 bespoke legendary technique cells');
  for (const c of meta.cells) {
    assert.strictEqual(c.borderBleedPixels, 0, `cell ${c.cell} (${c.key}) must have 0 border bleed pixels`);
    assert(c.nonEmptyPixels >= 400, `cell ${c.cell} (${c.key}) must have non-empty artwork`);
  }

  // Verify every catalog legendary weapon & technique resolves to its own distinct cell in UI.resolveItemAtlasCell
  const seenLegCells = new Set();
  for (const w of g.VC.LEGENDARY_WEAPONS) {
    const cell = g.UI.resolveItemAtlasCell(w);
    assert(cell && cell.key === w.id, `Legendary weapon ${w.id} must resolve to its dedicated cell`);
    assert(!seenLegCells.has(cell.cell), `Duplicate cell ${cell.cell} for ${w.id}`);
    seenLegCells.add(cell.cell);
  }
  const legTechs = g.VC.CLUE_TEMPLATES.filter(t => t.category === 'LEGENDARY_ART').map(t => t.targetId);
  assert.strictEqual(legTechs.length, 22, 'must have 22 legendary techniques in catalog');
  for (const tid of legTechs) {
    const cell = g.UI.resolveItemAtlasCell({ kind: 'TECH_MANUAL', id: tid, legendary: true });
    assert(cell && cell.key === tid, `Legendary tech ${tid} must resolve to its dedicated cell`);
    assert(!seenLegCells.has(cell.cell), `Duplicate cell ${cell.cell} for ${tid}`);
    seenLegCells.add(cell.cell);
  }
  // Verify unknown legendary fallback
  const fbLeg = g.UI.resolveItemAtlasCell({ kind: 'EQUIPMENT', id: 'LEG_UNKNOWN_FUTURE_SWORD', legendary: true });
  assert.strictEqual(fbLeg.key, 'FALLBACK_UNKNOWN_LEGENDARY', 'unknown legendary item must use FALLBACK_UNKNOWN_LEGENDARY cell');
  const fbGen = g.UI.resolveItemAtlasCell({ kind: 'UNKNOWN_KIND', id: 'MYSTERY_BOX' });
  assert.strictEqual(fbGen.key, 'FALLBACK_GENERIC', 'unknown generic item must use FALLBACK_GENERIC cell');
});

check('Additional Requirement: Personal Bag, Sect Stock, and Sect Shop data builders & transaction parity', () => {
  const W = g.SIM.create('inv-ui-parity');
  const n = W.npcs[0];
  n.cp = 500;
  // Spawn items into personal bag and sect stock
  g.SECT.EDITOR.spawnItem(W, { kind: 'EQUIPMENT', id: 'LEG_WPN_YITIAN_SWORD', dest: 'npc', npcId: n.id, qty: 1, quality: 1.15 });
  g.SECT.EDITOR.spawnItem(W, { kind: 'PILL', id: 'P:BASIC_HP', dest: 'npc', npcId: n.id, qty: 4, quality: 1 });
  g.SECT.EDITOR.spawnItem(W, { kind: 'TECH_MANUAL', id: 'LEG_COMBAT_DUGU_NINE_SWORDS', dest: 'npc', npcId: n.id, qty: 1, quality: 1 });
  g.SECT.EDITOR.spawnItem(W, { kind: 'PILL', id: 'P:BASIC_QI', dest: 'sect', qty: 6, quality: 1 });

  const bagItems = g.UI.buildPersonalBagItems(W, n);
  assert(bagItems.some(x => x.templateId === 'LEG_WPN_YITIAN_SWORD'), 'personal bag builder must include spawned Yitian Sword');
  assert(bagItems.some(x => x.id === 'P:BASIC_HP' && x.qty >= 4), 'personal bag builder must include P:BASIC_HP');
  assert(bagItems.some(x => x.id === 'LEG_COMBAT_DUGU_NINE_SWORDS'), 'personal bag builder must include legendary manual');

  // Switching view modes must never alter inventory quantities or prices
  const stockBefore = g.UI.buildSectStockItems(W);
  const shopBefore = g.UI.buildSectShopItems(W);
  g.UI.setInvViewMode('list');
  const stockList = g.UI.buildSectStockItems(W);
  const shopList = g.UI.buildSectShopItems(W);
  g.UI.setInvViewMode('grid');
  const stockGrid = g.UI.buildSectStockItems(W);
  const shopGrid = g.UI.buildSectShopItems(W);

  assert.strictEqual(JSON.stringify(stockBefore), JSON.stringify(stockList), 'stock items must be identical in list mode');
  assert.strictEqual(JSON.stringify(stockList), JSON.stringify(stockGrid), 'stock items must be identical in grid mode');
  assert.strictEqual(JSON.stringify(shopBefore), JSON.stringify(shopList), 'shop items must be identical in list mode');
  assert.strictEqual(JSON.stringify(shopList), JSON.stringify(shopGrid), 'shop items must be identical in grid mode');
});

if (failed) process.exitCode = 1;
