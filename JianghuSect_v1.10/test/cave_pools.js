'use strict';
const assert = require('assert');
const { SIM, U, CULT, HC, EXPLORE: EX, EXPED: X } = require('./load');

// Catches accidentally restoring shared band encounters, exhaustive rolls, or mutable pools.
assert(Array.isArray(EX.CAVE_FLOORS), 'ten authored cave floors must be available to the real resolver');
assert.strictEqual(EX.CAVE_FLOORS.length, 10);
assert.strictEqual(typeof EX.sampleCaveFloor, 'function');
const kinds = new Set(['fight', 'gather', 'hazard', 'treasure', 'lore', 'rest', 'trial', 'npc']);
const names = new Set(), allEntries = new Set();
for (let f = 1; f <= 10; f++) {
  const floor = EX.CAVE_FLOORS[f - 1];
  assert.strictEqual(floor.floor, f);
  assert(!names.has(floor.nameTh), 'floor themes must differ'); names.add(floor.nameTh);
  assert(floor.pools.length >= 2 && floor.pools.length <= 3);
  const floorTexts = new Set();
  for (const pool of floor.pools) {
    assert(pool.weight > 0 && pool.nameTh);
    assert(pool.entries.length >= 3, 'each subpool needs alternatives');
    assert(pool.loot.length >= 2, 'encounter rewards must have a thematic choice');
    for (const enc of pool.entries) {
      assert(kinds.has(enc[0]) && enc[1] > 0 && enc[2]);
      assert(enc.id && !allEntries.has(enc.id), 'encounter IDs must be globally unique'); allEntries.add(enc.id);
      assert(!floorTexts.has(enc[2]), 'repeated text would defeat within-floor variety'); floorTexts.add(enc[2]);
    }
    assert(pool.loot.every(loot => EX.bandOf(f).loot.includes(loot)), 'reuse the balanced reward tiers');
  }
  const observed = new Set(), signatures = new Set(), before = JSON.stringify(floor);
  let singles = 0, doubles = 0;
  for (let seed = 0; seed < 120; seed++) {
    const rng = new U.RNG('cave-pool-' + f + '-' + seed), twin = new U.RNG('cave-pool-' + f + '-' + seed);
    let calls = 0; const next = rng.next.bind(rng); rng.next = () => { calls++; return next(); };
    const sample = EX.sampleCaveFloor(f, rng);
    assert.deepStrictEqual(sample, EX.sampleCaveFloor(f, twin), 'seeded samples must replay exactly');
    assert.strictEqual(sample.floor, f);
    assert(sample.encounters.length >= 1 && sample.encounters.length <= 2, 'preserve the 1–2 encounter budget');
    assert(sample.encounters.length < floor.pools.length, 'an expedition cannot visit every pool');
    assert.strictEqual(new Set(sample.encounters.map(e => e.poolId)).size, sample.encounters.length, 'selected pools cannot repeat');
    assert.strictEqual(new Set(sample.encounters.map(e => e.id)).size, sample.encounters.length, 'selected encounters cannot repeat');
    assert(calls <= 5, 'sampling must have a fixed small cost');
    for (const chosen of sample.encounters) {
      const pool = floor.pools.find(p => p.id === chosen.poolId);
      assert(pool && pool.entries.includes(chosen.enc));
      assert.strictEqual(chosen.loot, pool.loot);
      observed.add(chosen.id);
    }
    signatures.add(sample.encounters.map(e => e.id).join(','));
    if (sample.encounters.length === 1) singles++; else doubles++;
  }
  assert(observed.size >= 6 && signatures.size >= 10, 'different expeditions must reveal different contents on floor ' + f);
  assert(singles > 20 && doubles > 35, 'both encounter budgets should occur naturally');
  assert.strictEqual(JSON.stringify(floor), before, 'sampling cannot consume the authored pools');
}
for (const badFloor of [0, 11, -1, 1.5, NaN, Infinity]) {
  const rng = new U.RNG('invalid-floor'), before = rng.getState();
  assert.throws(() => EX.sampleCaveFloor(badFloor, rng), RangeError);
  assert.deepStrictEqual(rng.getState(), before, 'invalid floor must not consume RNG');
}

// Exercises an actual ten-floor expedition, its visible journal, save/resume, and settlement.
const W = SIM.create('cave-floors-integration');
const party = W.npcs.slice();
for (const n of party) {
  n.cult.stage = CULT.maxStage(n); HC.touch(n);
  n.h.state.hp = CULT.hpMax(n); n.h.state.energy = 100;
}
const ex = EX.depart(W, party, 'delve'); ex.target = 10;
const pending = SIM.serialize(W);
X.resolve(W, ex, party);
assert(ex.done && ex.settlement && ex.settlement.state === 'settled');
assert.strictEqual(ex.caveFloors.length, 10, 'the strong party reaches every floor');
assert.strictEqual(W.explore.cave.maxDepth, 10);
assert(W.explore.cave.guard[5] && W.explore.cave.guard[10], 'guardian milestones still settle');
assert.strictEqual(W.explore.cave.cap, 10);
assert.strictEqual(W.explore.cave.fresh, 0.7, 'a delve still uses one replenishment budget');
assert(W.explore.relics.includes('bell') && W.explore.relics.includes('qistone'));
const journal = ex.journal.join('\n');
for (const visit of ex.caveFloors) {
  const floor = EX.CAVE_FLOORS[visit.floor - 1];
  assert(journal.includes(visit.nameTh), 'the floor theme must be visible in the expedition journal');
  assert(visit.encounters.length >= 1 && visit.encounters.length <= 2);
  const met = new Set(visit.encounters.map(e => e.id));
  assert.strictEqual(met.size, visit.encounters.length);
  assert.strictEqual(visit.pools.length, visit.encounters.length);
  for (const encounter of visit.encounters) {
    assert(journal.includes(encounter.poolNameTh) && journal.includes(encounter.text), 'only performed encounters get journal metadata');
  }
  for (const pool of floor.pools) for (const enc of pool.entries) {
    if (!met.has(enc.id)) assert(!journal.includes(enc[2]), 'unvisited alternatives must remain undisclosed');
  }
}
const L = SIM.deserialize(pending), resumed = L.world.expeds.find(e => e.id === ex.id);
X.resolve(L, resumed, resumed.party.map(id => L.byId[id]));
assert.deepStrictEqual(resumed.caveFloors, ex.caveFloors, 'save/resume preserves encounter selection');
assert.deepStrictEqual(resumed.out, ex.out, 'save/resume preserves actual rewards');
assert.deepStrictEqual(L.rng.getState(), W.rng.getState());
for (const world of [W, SIM.deserialize(SIM.serialize(W))]) {
  const settled = world.world.expeds.find(e => e.id === ex.id), before = SIM.serialize(world);
  X.resolve(world, settled, settled.party.map(id => world.byId[id]));
  assert.strictEqual(SIM.serialize(world), before, 'settled expedition must never reroll or pay twice');
  settled.done = false;
  const receiptProtected = SIM.serialize(world);
  X.resolve(world, settled, settled.party.map(id => world.byId[id]));
  assert.strictEqual(SIM.serialize(world), receiptProtected, 'the payout receipt also blocks a stale done flag');
}
assert(Object.keys(W.explore.codex.found).every(id => /^c[123]:\d+$/.test(id)), 'cave rewards keep the existing codex IDs');
console.log('PASS ten cave themes, weighted bounded subsets, seeded variety, actual expedition journal, save/resume, guardians and replay protection');
