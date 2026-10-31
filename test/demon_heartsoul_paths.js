'use strict';
const assert = require('assert');
const G = require('./load.js');
G.document = { getElementById() { return { querySelectorAll() { return []; }, style: {}, classList: { add() {}, remove() {} } }; } };
require('../js/ui.js');
const { U, HC, CULT, STATS, SK, COMBAT, AI, BN, CPE, ECO, SIM, UI, JD } = G;

console.log('Testing Priority P3: Native DEMON and HEART_SOUL paths (v1.10.8)...');

// 1. Path & Subpath Catalog Integrity
assert(CULT.PATHS.DEMON, 'DEMON path must be registered in CULT.PATHS');
assert(CULT.PATHS.HEART_SOUL, 'HEART_SOUL path must be registered in CULT.PATHS');
assert.strictEqual(CULT.PATHS.DEMON.maxStage, 9, 'DEMON must have 9 stages');
assert.strictEqual(CULT.PATHS.HEART_SOUL.maxStage, 9, 'HEART_SOUL must have 9 stages');
assert.strictEqual(CULT.PATHS.DEMON.stages.length, 9);
assert.strictEqual(CULT.PATHS.HEART_SOUL.stages.length, 9);
assert.strictEqual(CULT.THRESH.DEMON.length, 8);
assert.strictEqual(CULT.THRESH.HEART_SOUL.length, 8);

const demonSubs = ['SHADOW_ASSASSIN', 'VENOM_GU_SOVEREIGN', 'NETHER_GHOST_KING', 'HEAVEN_DEVOURING_DEMON'];
const soulSubs = ['ZEN_VOID_MIND', 'CALLIGRAPHY_PAINTING_SAGE', 'DREAM_ILLUSION_WEAVER', 'MIND_SWORD_TELEKINESIS'];
for (const subId of demonSubs) {
  const s = CULT.subInfo('DEMON', subId);
  assert(s && s.id === subId, 'DEMON subpath must exist: ' + subId);
}
for (const subId of soulSubs) {
  const s = CULT.subInfo('HEART_SOUL', subId);
  assert(s && s.id === subId, 'HEART_SOUL subpath must exist: ' + subId);
}
console.log('PASS 1: Native DEMON and HEART_SOUL major paths (9 stages, 4 subpaths each) registered');

// 2. Independent 9-Realm Tracks for all 8 DEMON & HEART_SOUL Subpaths
for (const subId of demonSubs.concat(soulSubs)) {
  const tr = CULT.trackDef(subId);
  assert(tr, 'Independent 9-realm track must exist for ' + subId);
  assert.strictEqual(tr.mode, 'INDEPENDENT_TRACK');
  assert.strictEqual(tr.realms.length, 9, 'Track must have 9 realms for ' + subId);
  assert.deepStrictEqual(tr.realms.map(r => r.ordinal), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const r5 = tr.realms[4];
  if (demonSubs.includes(subId)) {
    assert.strictEqual(tr.targetMajorPath, 'DEMON');
    assert(r5.realmBuffs.lifestealPct > 0, 'DEMON track realm must define lifestealPct');
  } else {
    assert.strictEqual(tr.targetMajorPath, 'HEART_SOUL');
    assert(r5.realmBuffs.reflectPct > 0, 'HEART_SOUL track realm must define reflectPct');
  }
}
console.log('PASS 2: All 8 DEMON and HEART_SOUL subpaths have 9-realm independent tracks with lifestealPct/reflectPct');

// 3. Autonomous Path Scoring & Awakening
const W = SIM.create('demon-soul-test-seed');
const nDemon = SIM.addNpc(W, { ageYears: 20, quality: 0.9, stage: 0 });
nDemon.h.personality.ambition = 95;
nDemon.h.personality.aggression = 92;
nDemon.h.personality.integrity = 12;
nDemon.h.personality.empathy = 15;
nDemon.h.values.powerStatus = 95;
nDemon.h.affinities.POISON = 95;
nDemon.h.affinities.YIN_SHADOW = 92;
nDemon.h.affinities.ALCHEMY = 85;
nDemon.h.physiology.immunity = 88;
HC.bump(nDemon);

const demonScores = CULT.pathScores(nDemon);
assert.strictEqual(demonScores[0].path, 'DEMON', 'High ambition/aggression/poison/shadow low-integrity NPC prefers DEMON path');
CULT.awaken(nDemon, new U.RNG('awaken-demon'), { VENOM_GU_SOVEREIGN: 30 }, W.day);
assert.strictEqual(nDemon.cult.path, 'DEMON');
assert.strictEqual(nDemon.cult.sub, 'VENOM_GU_SOVEREIGN');
assert(nDemon.cult.track && nDemon.cult.track.subPath === 'VENOM_GU_SOVEREIGN' && nDemon.cult.track.ordinal === 1);
assert(nDemon.cult.mantra && CULT.tech(nDemon.cult.mantra).cat === 'DEMON_MANTRA', 'DEMON awakens with DEMON_MANTRA');

const nSoul = SIM.addNpc(W, { ageYears: 20, quality: 0.9, stage: 0 });
nSoul.h.intellect.comprehension = 96;
nSoul.h.intellect.intuition = 94;
nSoul.h.intellect.wisdom = 92;
nSoul.h.personality.composure = 96;
nSoul.h.personality.aggression = 10;
nSoul.h.affinities.SOUL_DIVINE = 96;
nSoul.h.affinities.SCRIPTURE = 94;
nSoul.h.aptitudes.comprehension = 95;
nSoul.h.interests.meditation = 92;
HC.bump(nSoul);

const soulScores = CULT.pathScores(nSoul);
assert.strictEqual(soulScores[0].path, 'HEART_SOUL', 'High comprehension/composure/soul/scripture NPC prefers HEART_SOUL path');
CULT.awaken(nSoul, new U.RNG('awaken-soul'), { ZEN_VOID_MIND: 30 }, W.day);
assert.strictEqual(nSoul.cult.path, 'HEART_SOUL');
assert.strictEqual(nSoul.cult.sub, 'ZEN_VOID_MIND');
assert(nSoul.cult.track && nSoul.cult.track.subPath === 'ZEN_VOID_MIND' && nSoul.cult.track.ordinal === 1);
assert(nSoul.cult.mantra && CULT.tech(nSoul.cult.mantra).cat === 'SOUL_MANTRA', 'HEART_SOUL awakens with SOUL_MANTRA');
console.log('PASS 3: Autonomous path selection and awakening for DEMON and HEART_SOUL');

// 4. Distinct Strategic Training Costs, Risks & Rate Mechanics
nDemon.h.state.heartDemon = 0;
nDemon.cult.toxic = 0;
const demonRate0 = CULT.rate(nDemon, 1);
nDemon.h.state.heartDemon = 50; // Moderate heart demon channeled by DEMON
const demonRate50 = CULT.rate(nDemon, 1);
assert(demonRate50 > demonRate0 * 1.12, 'DEMON channels moderate heartDemon (<=60) for higher cultivation rate');
nDemon.h.state.heartDemon = 90; // Excessive heart demon causes backlash penalty
const demonRate90 = CULT.rate(nDemon, 1);
assert(demonRate90 < demonRate0, 'DEMON suffers rate drop when heartDemon exceeds safe threshold (>60)');

// Poison/Pill toxicity tolerance comparison
nDemon.h.state.heartDemon = 0;
nDemon.cult.toxic = 50;
const demonToxRatio = CULT.rate(nDemon, 1) / demonRate0;
nSoul.h.state.heartDemon = 0;
nSoul.h.state.stress = 10;
nSoul.cult.toxic = 0;
const soulRateClean = CULT.rate(nSoul, 1);
nSoul.cult.toxic = 50;
const soulToxRatio = CULT.rate(nSoul, 1) / soulRateClean;
assert(demonToxRatio > soulToxRatio + 0.15, 'DEMON (especially VENOM_GU_SOVEREIGN) has much higher toxicity tolerance');

// HEART_SOUL Zen Clarity bonus vs turmoil penalty
nSoul.cult.toxic = 0;
nSoul.h.state.heartDemon = 5;
nSoul.h.state.stress = 10;
const soulRateZen = CULT.rate(nSoul, 1);
nSoul.h.state.heartDemon = 45;
nSoul.h.state.stress = 75;
const soulRateTurmoil = CULT.rate(nSoul, 1);
assert(soulRateZen > soulRateTurmoil * 1.45, 'HEART_SOUL gains Zen Clarity when calm and suffers heavily under mental turmoil');

// Breakthrough supreme risks on failure
nDemon.cult.prog = CULT.threshold(nDemon);
nDemon.h.state.heartDemon = 20;
nDemon.h.state.hp = CULT.hpMax(nDemon);
const btFailDemon = CULT.breakthrough(W, nDemon, { pill: -2.0 });
assert.strictEqual(btFailDemon.ok, false);
assert.strictEqual(btFailDemon.supremeRisk, 'DEMONIC_BACKLASH_FRENZY', 'DEMON failure triggers DEMONIC_BACKLASH_FRENZY');

nSoul.cult.prog = CULT.threshold(nSoul);
nSoul.h.state.qi = CULT.qiMax(nSoul);
nSoul.h.state.rest = 80;
const btFailSoul = CULT.breakthrough(W, nSoul, { pill: -2.0 });
assert.strictEqual(btFailSoul.ok, false);
assert.strictEqual(btFailSoul.supremeRisk, 'SOUL_SHATTER_ILLUSION_LOST', 'HEART_SOUL failure triggers SOUL_SHATTER_ILLUSION_LOST');
assert.strictEqual(nSoul.h.state.qi, 0, 'SOUL_SHATTER_ILLUSION_LOST shatters qi to 0');

// AI station selection and cultivate tick behavior
const stDemon = AI.ACTS.cultivate.where(W, nDemon);
const stSoul = AI.ACTS.cultivate.where(W, nSoul);
assert(stDemon && stDemon.st, 'AI.ACTS.cultivate.where finds valid station for DEMON');
assert(stSoul && stSoul.st, 'AI.ACTS.cultivate.where finds valid station for HEART_SOUL');

nDemon.h.state.energy = 90;
nDemon.h.state.rest = 90;
nDemon.h.state.heartDemon = 10;
const hdBefore = nDemon.h.state.heartDemon;
const poisonBefore = nDemon.h.skills.POISON || 0;
for (let i = 0; i < 60; i++) { W.t++; AI.ACTS.cultivate.tick(nDemon, W, { mult: 1.4 }); }
assert(nDemon.h.state.heartDemon > hdBefore, 'DEMON cultivation gradually builds heartDemon');
assert((nDemon.h.skills.POISON || 0) > poisonBefore, 'VENOM_GU_SOVEREIGN practices POISON during cultivation');

nSoul.h.state.energy = 90;
nSoul.h.state.rest = 90;
nSoul.h.state.heartDemon = 25;
const soulHdBefore = nSoul.h.state.heartDemon;
const soulDivBefore = nSoul.h.skills.SOUL_DIVINE || 0;
for (let i = 0; i < 60; i++) { W.t++; AI.ACTS.cultivate.tick(nSoul, W, { mult: 1.4 }); }
assert(nSoul.h.state.heartDemon < soulHdBefore, 'HEART_SOUL cultivation purifies heartDemon');
assert((nSoul.h.skills.SOUL_DIVINE || 0) > soulDivBefore, 'HEART_SOUL practices SOUL_DIVINE during cultivation');
console.log('PASS 4: Distinct strategic training costs, risks, and cultivation tick mechanics verified');

// 5. Stats, Mantras, Techniques, Profiles & Bottleneck Pills/Treasures
STATS.dirty(nDemon);
STATS.dirty(nSoul);
const fastDemon = STATS.get(nDemon), expDemon = STATS.explain(nDemon).v;
const fastSoul = STATS.get(nSoul), expSoul = STATS.explain(nSoul).v;
for (const k of STATS.KEYS) {
  assert.strictEqual(fastDemon[k], expDemon[k], 'DEMON fast stats must match explain stats for ' + k);
  assert.strictEqual(fastSoul[k], expSoul[k], 'HEART_SOUL fast stats must match explain stats for ' + k);
}

// Verify bottleneck pills and treasures for DEMON and HEART_SOUL
for (let st = 1; st <= 8; st++) {
  const pkD = BN.pillKey({ path: 'DEMON', stage: st });
  const pkS = BN.pillKey({ path: 'HEART_SOUL', stage: st });
  assert(ECO.pillInfo(pkD), 'Bottleneck pill must exist: ' + pkD);
  assert(ECO.pillInfo(pkS), 'Bottleneck pill must exist: ' + pkS);
  if (st >= 3) {
    assert(BN.treasureOf({ path: 'DEMON', stage: st }), 'Major bottleneck treasure must exist for DEMON:' + st);
    assert(BN.treasureOf({ path: 'HEART_SOUL', stage: st }), 'Major bottleneck treasure must exist for HEART_SOUL:' + st);
  }
}

// Verify learnable techniques and skill profiles across all 8 subpaths
const allTechIds = JD.TECH.techniques.map(t => t.id);
for (const subId of demonSubs) {
  nDemon.cult.sub = subId;
  nDemon.cult.stage = 3;
  nDemon.cult.techs = [];
  const learnable = CULT.learnable(nDemon, allTechIds);
  assert(learnable.length >= 3, 'DEMON subpath ' + subId + ' must have learnable techniques');
  learnable.forEach(id => {
    const prof = SK.profile(CULT.tech(id));
    assert(prof && prof.arch, 'Technique ' + id + ' must generate a valid combat profile');
  });
}
for (const subId of soulSubs) {
  nSoul.cult.sub = subId;
  nSoul.cult.stage = 3;
  nSoul.cult.techs = [];
  const learnable = CULT.learnable(nSoul, allTechIds);
  assert(learnable.length >= 3, 'HEART_SOUL subpath ' + subId + ' must have learnable techniques');
  learnable.forEach(id => {
    const prof = SK.profile(CULT.tech(id));
    assert(prof && prof.arch, 'Technique ' + id + ' must generate a valid combat profile');
  });
}
const ghostSummon = SK.profile(CULT.tech('ART_C117_INNATE_NETHER_GHOST_KING'));
assert.strictEqual(ghostSummon.arch, 'summon');
assert.strictEqual(ghostSummon.summon.nameSuffix, 'ภูตยมโลก');
const dreamSummon = SK.profile(CULT.tech('ART_V112_SOUL_SEVEN_EMOTION_MIRAGE_T4'));
assert.strictEqual(dreamSummon.arch, 'summon');
assert.strictEqual(dreamSummon.summon.nameSuffix, 'ร่างมายาฝัน');
console.log('PASS 5: Stats parity, mantras, bottleneck pills/treasures, and skill profiles verified');

// 6. Combat Passives: DEMON Lifesteal & Blood Harvest, HEART_SOUL Reflection & Spar Tempering
nDemon.cult.sub = 'HEAVEN_DEVOURING_DEMON';
nDemon.cult.track = CULT.initTrack('HEAVEN_DEVOURING_DEMON', 4, W.day);
nSoul.cult.sub = 'ZEN_VOID_MIND';
nSoul.cult.track = CULT.initTrack('ZEN_VOID_MIND', 4, W.day);
STATS.dirty(nDemon);
STATS.dirty(nSoul);

nDemon.h.state.hp = Math.round(CULT.hpMax(nDemon) * 0.5);
nSoul.h.state.hp = CULT.hpMax(nSoul);
const f = COMBAT.startFight(W, [nDemon.id], [nSoul.id], 'duel', { serious: false });
const strikeRes = COMBAT.strike(W, f, nDemon, nSoul, { M: 1.2, type: 'm', forced: true, noCounter: true });
assert.strictEqual(strikeRes.hit, true);
assert(strikeRes.lifesteal > 0, 'DEMON strike triggers lifesteal healing');
assert(strikeRes.reflected > 0, 'HEART_SOUL defender reflects damage back onto attacker');

// Test DEMON blood-qi harvest on slay
const dummyFoe = { id: 'foe_test_1', name: 'โจรภูเขา', foe: true, tier: 2, hp: 10, hpMax: 100, x: nDemon.x, y: nDemon.y };
W.foeById[dummyFoe.id] = dummyFoe;
const progBeforeSlay = nDemon.cult.prog;
COMBAT.slay(W, f, nDemon, dummyFoe);
assert(nDemon.cult.prog > progBeforeSlay, 'DEMON harvests cultivation progress on slay');
assert(nDemon.stats.demonHarvest > 0, 'DEMON records demonHarvest stat');

// Test HEART_SOUL spar tempering
nSoul.h.state.heartDemon = 20;
nSoul.h.state.stress = 30;
COMBAT.sparEnd(W, nSoul, nDemon, { rounds: 6, sc: { a: 4, b: 2 } });
assert(nSoul.h.state.heartDemon < 20, 'HEART_SOUL tempers heartDemon after spar');
assert(nSoul.h.state.stress < 30, 'HEART_SOUL reduces stress after spar');
f.over = true;
COMBAT.conclude(W, f);
console.log('PASS 6: Combat lifesteal, reflection, blood harvest, and spar tempering verified');

// 7. UI Rendering & Save/Load Compatibility
UI.G = { W, R: { opts: {} }, opts: {} };
UI.tab = 'over';
const sectHtml = UI.rSect();
assert(sectHtml.includes('มารอสูร'), 'Sect overview displays DEMON count');
assert(sectHtml.includes('จิต·เซน'), 'Sect overview displays HEART_SOUL count');

const contentHtml = UI.rContent();
assert(contentHtml.includes('สายนักฆ่าเงาไร้ลักษณ์'), 'Content tab renders DEMON specialization tracks');
assert(contentHtml.includes('สายปราชญ์เซนสุญตา'), 'Content tab renders HEART_SOUL specialization tracks');

UI.npcId = nDemon.id;
UI.tab = 'ov';
const demonNpcHtml = UI.rNpc();
assert(demonNpcHtml.includes('มารอสูร'), 'NPC sheet renders DEMON path info');

const saved = SIM.serialize(W);
const W2 = SIM.deserialize(saved);
const nDemon2 = W2.byId[nDemon.id];
const nSoul2 = W2.byId[nSoul.id];
assert.strictEqual(nDemon2.cult.path, 'DEMON');
assert.strictEqual(nDemon2.cult.track.subPath, 'HEAVEN_DEVOURING_DEMON');
assert.strictEqual(nDemon2.cult.track.ordinal, 4);
assert.strictEqual(nSoul2.cult.path, 'HEART_SOUL');
assert.strictEqual(nSoul2.cult.track.subPath, 'ZEN_VOID_MIND');
assert.strictEqual(nSoul2.cult.track.ordinal, 4);
console.log('PASS 7: UI rendering and save/load roundtrip verified');

console.log('ALL DEMON AND HEART_SOUL PATH CHECKS PASSED (v1.10.8).');
