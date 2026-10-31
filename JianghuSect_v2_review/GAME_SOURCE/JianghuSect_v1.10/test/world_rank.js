'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, CULT, EXPED, EXPLORE } = G;

console.log('--- Testing World Rank & Rank-Based Pools ---');

// 1. Authoritative integer mapping for mortals and all 5 cultivation paths
const W = SIM.create('world-rank-test');
const mortal = W.makeNpc({ rank: 0 });
mortal.cult = null;
assert.strictEqual(CULT.worldRank(mortal), 0, 'Mortals must have world rank 0');

// Paths and their expected rank arrays for stages 1..S
const expectedMappings = {
  XIAN: [1, 1, 1, 2, 2, 3, 3, 3, 4],
  DEMON: [1, 1, 1, 2, 2, 3, 3, 3, 4],
  HEART_SOUL: [1, 1, 1, 2, 2, 3, 3, 3, 4],
  BODY: [1, 1, 2, 3, 4],
  GOD: [1, 2, 3, 4]
};

for (const [pathKey, expectedRanks] of Object.entries(expectedMappings)) {
  const pathObj = CULT.PATHS[pathKey];
  const S = Array.isArray(pathObj.stages) ? pathObj.stages.length : (pathObj.stages || 9);
  assert.strictEqual(S, expectedRanks.length, `Stage count for ${pathKey} must match expected length`);
  let lastRank = 0;
  for (let s = 1; s <= S; s++) {
    const testNpc = W.makeNpc({ rank: 1 });
    testNpc.cult = { path: pathKey, stage: s, prog: 0 };
    const r = CULT.worldRank(testNpc);
    assert.strictEqual(r, expectedRanks[s - 1], `Path ${pathKey} stage ${s} must map to rank ${expectedRanks[s - 1]}, got ${r}`);
    assert(r >= lastRank, `World rank must be monotonic for ${pathKey}`);
    lastRank = r;
  }
}
console.log('PASS monotonic mapping across all 5 paths and all stages');

// 2. Rational arithmetic boundary rounding (> 0.75 remainder rounds up)
assert.strictEqual(CULT.worldRankFromRaw(1.0), 1);
assert.strictEqual(CULT.worldRankFromRaw(1.74), 1);
assert.strictEqual(CULT.worldRankFromRaw(1.75), 1);
assert.strictEqual(CULT.worldRankFromRaw(1.7501), 2);
assert.strictEqual(CULT.worldRankFromRaw(2.0), 2);
assert.strictEqual(CULT.worldRankFromRaw(2.74), 2);
assert.strictEqual(CULT.worldRankFromRaw(2.75), 2);
assert.strictEqual(CULT.worldRankFromRaw(2.750001), 3);
assert.strictEqual(CULT.worldRankFromRaw(2.8), 3);
assert.strictEqual(CULT.worldRankFromRaw(3.0), 3);
assert.strictEqual(CULT.worldRankFromRaw(3.75), 3);
assert.strictEqual(CULT.worldRankFromRaw(3.750001), 4);
assert.strictEqual(CULT.worldRankFromRaw(4.0), 4);
console.log('PASS rational arithmetic boundary rounding (> 0.75 remainder)');

// 3. Invariance: gear, temporary buffs, injured HP, emotional state, CP do NOT alter world rank
const testNpc = W.makeNpc({ rank: 2 });
testNpc.cult = { path: 'XIAN', stage: 5, prog: 50 }; // Stage 5 -> Rank 2
assert.strictEqual(CULT.worldRank(testNpc), 2);

// Add extreme gear
testNpc.equip = {
  WEAPON: { id: 'test_god_sword', tier: 6, q: 2.0, atk: 99999 },
  ARMOR: { id: 'test_god_armor', tier: 6, q: 2.0, def: 99999 }
};
assert.strictEqual(CULT.worldRank(testNpc), 2, 'Equipped gear must not alter world rank');

// Add temporary buffs
testNpc.buffs = [{ id: 'divine_might', stat: 'atk', val: 500, until: W.t + 1000 }];
assert.strictEqual(CULT.worldRank(testNpc), 2, 'Temporary buffs must not alter world rank');

// Cripple HP
testNpc.h.state.hp = 1;
assert.strictEqual(CULT.worldRank(testNpc), 2, 'Injured HP must not alter world rank');

// Stress / Mood / Heart demon
testNpc.h.state.stress = 100;
testNpc.h.state.mood = -50;
testNpc.h.state.heartDemon = 80;
assert.strictEqual(CULT.worldRank(testNpc), 2, 'Mental state must not alter world rank');
console.log('PASS gear/buff/HP/mental invariance of world rank');

// 4. Retraining stage reset updates world rank
testNpc.cult.stage = 1; // reset on retraining or path switch
assert.strictEqual(CULT.worldRank(testNpc), 1, 'Stage reset to 1 drops world rank to 1');
console.log('PASS retraining stage reset updates world rank');

// 5. Party rank snapshot at departure
const n1 = W.makeNpc({ rank: 1 }); n1.cult = { path: 'XIAN', stage: 1, techs: [] }; // Rank 1
const n2 = W.makeNpc({ rank: 2 }); n2.cult = { path: 'XIAN', stage: 4, techs: [] }; // Rank 2
const n3 = W.makeNpc({ rank: 3 }); n3.cult = { path: 'XIAN', stage: 8, techs: [] }; // Rank 3
const party = [n1, n2, n3];

const partyRank = Math.max(...party.map(CULT.worldRank));
assert.strictEqual(partyRank, 3, 'Party rank snapshot must be maximum of member world ranks (3)');

// Test X.depart records snapshot partyRank and committed site/pool
const reg = EXPED.REGIONS.find(r => r.terrain === 'mountain') || EXPED.REGIONS[0];
const exp = EXPED.depart(W, party, 'fortune', reg);
assert.strictEqual(exp.partyRank, 3, 'expedition must record partyRank snapshot');
assert(exp.siteId, 'expedition must commit siteId');
assert(exp.poolId, 'expedition must commit poolId');
assert(exp.fortuneSite, 'expedition must commit fortuneSite data');
assert.strictEqual(exp.fortuneSite.rank, 3, 'committed fortuneSite must match partyRank 3');
console.log('PASS party departure snapshots partyRank and commits site/pool');

// 6. Fortune registry verification
assert(EXPED.FORTUNE_REGISTRY, 'FORTUNE_REGISTRY must exist');
for (let r = 1; r <= 4; r++) {
  const sites = EXPED.FORTUNE_REGISTRY[r];
  assert(Array.isArray(sites) && sites.length >= 3, `Rank ${r} must have at least 3 site themes`);
  sites.forEach(site => {
    assert.strictEqual(site.rank, r, `Site rank must be ${r}`);
    assert(site.id && site.nameTh && site.icon && site.desc, 'Site must have metadata');
    assert(Array.isArray(site.pools) && site.pools.length === 2, 'Site must have 2 distinct selectable pools');
    site.pools.forEach(pool => {
      assert(pool.id && pool.nameTh && pool.skill && pool.diff, 'Pool must have id, name, skill, diff');
      assert(pool.stones || pool.herbs || pool.ore || pool.pill || pool.gearTier || pool.techTier || pool.spring || pool.insight, 'Pool must have real rewards');
    });
  });
}
console.log('PASS Fortune registry data-driven 4 ranks x 3 themes x 2 pools');

// 7. Myriad Worlds rank areas & static calibrated foe power
assert.strictEqual(EXPLORE.RANK_FOE_POWER[1], 95);
assert.strictEqual(EXPLORE.RANK_FOE_POWER[2], 480);
assert.strictEqual(EXPLORE.RANK_FOE_POWER[3], 2800);
assert.strictEqual(EXPLORE.RANK_FOE_POWER[4], 18500);

assert.strictEqual(EXPLORE.WORLDS.length, 12, 'Must have 12 Myriad Worlds');
EXPLORE.WORLDS.forEach(world => {
  assert(world.areas, `World ${world.id} must have areas definition`);
  for (let r = 1; r <= 4; r++) {
    const area = world.areas[r];
    assert(area, `World ${world.id} must have area for rank ${r}`);
    assert.strictEqual(area.rank, r);
    assert.strictEqual(area.foePower, EXPLORE.RANK_FOE_POWER[r], `Area rank ${r} foePower must match static calibrated reference`);
    assert(Array.isArray(area.enc) && area.enc.length >= 4, `Area rank ${r} must have encounters`);
    assert(Array.isArray(area.loot) && area.loot.length >= 4, `Area rank ${r} must have loot`);
  }
});
console.log('PASS Myriad Worlds 12 worlds x 4 ranked areas with static calibrated reference foe power');

// 8. Gate / Realm departure records partyRank
EXPLORE.init(W);
W.explore.gate.open = true;
W.explore.gate.world = 'eden';
W.explore.gate.until = W.day + 10;
W.explore.gate.tide = 0;
const realmExp = EXPLORE.depart(W, party, 'realm');
assert.strictEqual(realmExp.partyRank, 3, 'Realm expedition must snapshot partyRank 3');
assert.strictEqual(realmExp.rankArea, 3, 'Realm expedition must snapshot rankArea 3');
assert(realmExp.placeTh.includes('Rank 3'), 'Realm expedition placeTh must include Rank 3');
console.log('PASS Myriad Worlds departure records partyRank and rankArea');

console.log('ALL World Rank & Rank-Based Pools tests PASSED.');
