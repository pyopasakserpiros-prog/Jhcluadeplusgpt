'use strict';
const assert = require('assert');
const { CULT, STATS, SIM, HC, ECO, JD } = require('./load.js');

console.log('Testing independent specialization tracks (v1.10.3)...');

// 1. Catalog & Track Registry Integrity
const tracks = ['FROST_MOON_IMMORTAL', 'WOOD_SPRING_BODY', 'MEDICINE_BODHI_GOD'];
for (const sub of tracks) {
  const def = CULT.trackDef(sub);
  assert(def, 'Track definition must exist for ' + sub);
  assert.strictEqual(def.sourceIndependentRealmCount, 9, 'Source independent realm count must be 9 for ' + sub);
  assert.strictEqual(def.realms.length, 9, 'Track must contain exactly 9 authentic realms for ' + sub);
  assert.strictEqual(def.mode, 'INDEPENDENT_TRACK', 'Track mode must be INDEPENDENT_TRACK');
  assert.strictEqual(def.sourceRealmOrdinalsImported, true, 'sourceRealmOrdinalsImported must be true');

  // Verify all 9 ordinals are preserved (1..9)
  const ordinals = def.realms.map(r => r.ordinal);
  assert.deepStrictEqual(ordinals, [1, 2, 3, 4, 5, 6, 7, 8, 9], 'All 9 ordinals must be preserved without compression');

  // Verify non-destructive major power mapping
  assert.strictEqual(def.majorPowerMapping.length, 9, 'Major power mapping must have 9 points');
  if (sub === 'FROST_MOON_IMMORTAL') {
    assert.deepStrictEqual(def.majorPowerMapping, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  } else if (sub === 'WOOD_SPRING_BODY') {
    assert.deepStrictEqual(def.majorPowerMapping, [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]);
    assert.strictEqual(def.targetMajorStages, 5, 'Target major stages for BODY must remain 5');
  } else if (sub === 'MEDICINE_BODHI_GOD') {
    assert.deepStrictEqual(def.majorPowerMapping, [1.0, 1.5, 2.0, 2.5, 3.0, 3.3, 3.7, 3.9, 4.0]);
    assert.strictEqual(def.targetMajorStages, 4, 'Target major stages for GOD must remain 4');
  }

  // Verify realms have authentic Thai names, skill gates, resource costs, buffs
  def.realms.forEach(r => {
    assert(r.nameTh && r.nameTh.length > 2, 'Realm must have authentic Thai name: ' + r.id);
    assert(r.lifespanMax > 70, 'Lifespan must be greater than mortal: ' + r.id);
    assert(r.functionalCombatPower > 50, 'Functional combat power must be positive: ' + r.id);
    assert(r.skillGate && r.skillGate.primarySkill, 'Realm must have primary skill gate: ' + r.id);
    assert(r.resourceCost && r.resourceCost.stones > 0, 'Realm must have stone cost: ' + r.id);
    assert(r.realmBuffs && r.realmBuffs.combatOffensePct != null, 'Realm must have realmBuffs: ' + r.id);
  });
}
console.log('PASS 1: Catalog & Track registry preserves all 9 ordinals without position compression');

// 2. Track State & Initialization
const W = SIM.create('track_test_1');
const n = W.npcs[0];
n.cult = { path: 'BODY', sub: 'WOOD_SPRING_BODY', stage: 1, prog: 0, mantra: null, techs: [], learning: null, toxic: 0, lifeBonus: 0 };
assert.strictEqual(CULT.trackOf(n), null, 'Legacy character has no track by default');

const tr = CULT.ensureTrack(n, 10);
assert(tr, 'ensureTrack must initialize track');
assert.strictEqual(tr.subPath, 'WOOD_SPRING_BODY');
assert.strictEqual(tr.ordinal, 1);
assert.strictEqual(tr.realmNameTh, 'เพาะเมล็ดพันธุ์ชีวิต');
assert.strictEqual(tr.prog, 0);
assert.strictEqual(tr.history.length, 1);
assert.strictEqual(tr.history[0].atDay, 10);
assert.strictEqual(CULT.trackOf(n), tr, 'trackOf returns track');

// Verify CULT.awaken initializes track for track-enabled specializations
const nNew = W.npcs[1];
nNew.cult = null;
CULT.awaken(nNew, W.rng, { WOOD_SPRING_BODY: 1000 }, 15);
assert(nNew.cult, 'NPC awakened');
if (nNew.cult.sub === 'WOOD_SPRING_BODY') {
  assert(nNew.cult.track, 'Awakened specialization NPC must receive initialized track');
  assert.strictEqual(nNew.cult.track.ordinal, 1);
}
console.log('PASS 2: Track state initialization and awakening lifecycle');

// 3. Dual Progression & Thresholds
n.cult.prog = 0;
n.cult.track.prog = 0;
const majorTh = CULT.threshold(n);
const trackTh = CULT.trackThreshold(n);
assert(trackTh > 0 && trackTh < Infinity, 'Track threshold must be positive finite number');

CULT.gain(n, 100);
assert.strictEqual(n.cult.prog, 100, 'Major stage gains progress');
assert.strictEqual(n.cult.track.prog, 100, 'Track gains progress concurrently');
assert.strictEqual(n.cult.stage, 1, 'Major stage remains 1 during gain');
assert.strictEqual(n.cult.track.ordinal, 1, 'Track ordinal remains 1 during gain');

// Max ordinal threshold is Infinity
assert.strictEqual(CULT.trackThreshold('WOOD_SPRING_BODY', 9), Infinity, 'Threshold for ordinal 9 is Infinity');
console.log('PASS 3: Dual progression and thresholds');

// 4. Skill & Resource Gates
n.cult.track.prog = trackTh;
assert.strictEqual(CULT.trackReady(n), true, 'Track is ready when prog >= threshold');

// Realm 2 requires BODY_REFINING >= 25 and stones >= 73
n.h.skills.BODY_REFINING = 10; // Below gate
n.inv.stones = 100;
let gate = CULT.checkTrackGates(W, n);
assert.strictEqual(gate.ok, false, 'Gate must fail when skill is insufficient');
assert.strictEqual(gate.skillOk, false, 'skillOk must be false');
assert(gate.reason.includes('BODY_REFINING'), 'Reason must mention failing skill');

// Raise skill to meet gate
n.h.skills.BODY_REFINING = 30;
n.h.skills.WOOD_LIFE = 20;
n.inv.stones = 5; // Insufficient stones
W.sect.stones = 0;
gate = CULT.checkTrackGates(W, n);
assert.strictEqual(gate.ok, false, 'Gate must fail when stones are insufficient');
assert.strictEqual(gate.skillOk, true, 'skillOk must be true');
assert.strictEqual(gate.resourceOk, false, 'resourceOk must be false');
assert(gate.reason.includes('ศิลาวิญญาณ'), 'Reason must mention spirit stones');

// Meet both gates
n.inv.stones = 150;
gate = CULT.checkTrackGates(W, n);
assert.strictEqual(gate.ok, true, 'Gate passes when all criteria met');
assert.strictEqual(gate.skillOk, true);
assert.strictEqual(gate.resourceOk, true);
assert.strictEqual(gate.stonesSource, 'personal');
console.log('PASS 4: Explicit skill and resource gates validation');

// 5. Breakthrough Resolution (Success & Failure)
// Test breakthrough failure when blocked by gate
n.h.skills.BODY_REFINING = 5;
let res = CULT.trackBreakthrough(W, n);
assert.strictEqual(res.ok, false, 'Breakthrough blocked when gate not met');
assert.strictEqual(res.blockedByGate, true);

// Meet gates and execute successful breakthrough
n.h.skills.BODY_REFINING = 35;
n.inv.stones = 200;
const stonesBefore = n.inv.stones;
res = CULT.trackBreakthrough(W, n, { guarantee: true });
assert.strictEqual(res.ok, true, 'Guaranteed breakthrough succeeds');
assert.strictEqual(res.fromOrdinal, 1);
assert.strictEqual(res.toOrdinal, 2);
assert.strictEqual(n.cult.track.ordinal, 2, 'Track ordinal advanced to 2');
assert.strictEqual(n.cult.track.realmNameTh, 'เส้นเลือดเถาวัลย์หยก');
assert.strictEqual(n.cult.stage, 1, 'Major path stage remains unchanged at 1!');
assert.strictEqual(n.cult.track.prog, 0, 'Track prog resets to 0 after breakthrough');
assert(n.inv.stones < stonesBefore, 'Stones deducted for breakthrough');
assert.strictEqual(n.cult.track.history.length, 2, 'History updated with breakthrough');

// Test breakthrough failure behavior
n.cult.track.prog = CULT.trackThreshold(n);
n.h.skills.BODY_REFINING = 50;
n.inv.stones = 300;
res = CULT.trackBreakthrough(W, n, { guarantee: false, force: true, bonus: -1.0 }); // force 0% chance
assert.strictEqual(res.ok, false, 'Breakthrough fails on low roll');
assert.strictEqual(n.cult.track.ordinal, 2, 'Ordinal unchanged on failure');
assert(n.cult.track.prog > 0, 'Progression retreats to partial threshold on failure');
console.log('PASS 5: Breakthrough resolution, cost deduction, and failure retreat');

// 6. Functional Combat Power & Cross-Path Comparison
const pWood5 = CULT.trackFunctionalPower('WOOD_SPRING_BODY', 5);
assert.strictEqual(pWood5, 2600, 'WOOD_SPRING_BODY Ordinal 5 has 2600 functional CP');

const pFrost5 = CULT.trackFunctionalPower('FROST_MOON_IMMORTAL', 5);
assert.strictEqual(pFrost5, 2250, 'FROST_MOON_IMMORTAL Ordinal 5 has 2250 functional CP');

const pGod4 = CULT.trackFunctionalPower('MEDICINE_BODHI_GOD', 4);
assert.strictEqual(pGod4, 4000, 'MEDICINE_BODHI_GOD Ordinal 4 has 4000 functional CP');

// Compare WOOD_SPRING_BODY Ordinal 5 (2600 CP, Band 3.0) with Major BODY Stage 3 (2600 CP, Stage 3)
const cmpEqual = CULT.compareFunctionalPower(
  { subPath: 'WOOD_SPRING_BODY', ordinal: 5 },
  { path: 'BODY', stage: 3 }
);
assert.strictEqual(cmpEqual.powerA, 2600);
assert.strictEqual(cmpEqual.powerB, 2600);
assert.strictEqual(cmpEqual.ratio, 1.0);
assert.strictEqual(cmpEqual.bandDelta, 0.0);
assert(cmpEqual.assessmentTh.includes('สูสีทัดเทียม'), 'Should assess as equal match');

// Compare WOOD_SPRING_BODY Ordinal 5 (2600 CP) with Major XIAN Stage 5 (2250 CP)
const cmpAdv = CULT.compareFunctionalPower(
  { subPath: 'WOOD_SPRING_BODY', ordinal: 5 },
  { path: 'XIAN', stage: 5 }
);
assert.strictEqual(cmpAdv.powerA, 2600);
assert.strictEqual(cmpAdv.powerB, 2250);
assert(cmpAdv.ratio > 1.1, 'Ratio must show advantage');
assert(cmpAdv.assessmentTh.includes('ได้เปรียบ'), 'Should assess as advantageous');
console.log('PASS 6: Functional combat power and cross-path power comparison');

// 7. Stats & Realm Buffs Application
const statsBase = STATS.get(n);
// Advance track to Ordinal 6 (higher buffs)
n.cult.track.ordinal = 6;
n.cult.track.realmNameTh = CULT.trackRealm(n).nameTh;
STATS.dirty(n);
const statsBuffed = STATS.get(n);
assert(statsBuffed.atk > statsBase.atk, 'Combat offense buff must increase physical attack');
assert(statsBuffed.def > statsBase.def, 'Combat defense buff must increase physical defense');
assert(statsBuffed.pen > statsBase.pen, 'Armor penetration buff must increase pen');
console.log('PASS 7: Specialization track realm buffs applied to combat stats');

// 8. Save/Load Roundtrip & Backward Compatibility
const serialized = SIM.serialize(W);
const W_loaded = SIM.deserialize(serialized);
const n_loaded = W_loaded.byId[n.id];
assert(n_loaded.cult.track, 'Track state survives serialization');
assert.strictEqual(n_loaded.cult.track.subPath, n.cult.track.subPath);
assert.strictEqual(n_loaded.cult.track.ordinal, n.cult.track.ordinal);
assert.strictEqual(n_loaded.cult.track.realmNameTh, n.cult.track.realmNameTh);
assert.strictEqual(n_loaded.cult.track.history.length, n.cult.track.history.length);

console.log('PASS 8: Serialization and save compatibility');
console.log('ALL SPECIALIZATION TRACK CHECKS PASSED.');
