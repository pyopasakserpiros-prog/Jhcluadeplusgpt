'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, WILD, MAP } = G;

console.log('--- Testing Bounded Wildlife Batches & Safe Belt Isolation ---');

assert(WILD, 'WILD module must exist');

const W = SIM.create('wild-batch-test');
W.wildlife = { beasts: [], nextId: 1, lastLegendaryRollDay: -1 };

// 1. Initial refill batches when active count < 10
assert.strictEqual(W.wildlife.beasts.length, 0);

// Advance tick to trigger spawn refill
W.t += 60; // 1 hour
WILD.tick(W);

const firstBatchCount = W.wildlife.beasts.length;
assert(firstBatchCount >= 1 && firstBatchCount <= 3, `Refill batch must spawn 1..3 beasts, got ${firstBatchCount}`);
console.log(`PASS initial batch refill spawned ${firstBatchCount} beasts (within 1..3 bounds)`);

// 2. Cap testing: Active count never exceeds 12
for (let i = 0; i < 20; i++) {
  W.t += 60;
  WILD.tick(W);
}
assert(W.wildlife.beasts.length <= 12, `Active beasts count (${W.wildlife.beasts.length}) must not exceed hard cap 12`);
console.log(`PASS hard cap 12 respected over multiple ticks (count: ${W.wildlife.beasts.length})`);

// 3. Zone distribution: beasts are distributed across exterior zones
const zonesPresent = new Set(W.wildlife.beasts.map(b => b.zone));
assert(zonesPresent.size >= 2, `Refills must be distributed across multiple zones (got ${zonesPresent.size} zones)`);
console.log('PASS refills distributed across least-populated exterior zones');

// 4. Safe collection belt isolation:
// A) Aggressive or tier >= 3 beasts never spawn in safe belt
for (let i = 0; i < 200; i++) {
  const b = WILD.spawn(W, 'meadow');
  if (b) {
    if (MAP.isInSafeBelt(b.x, b.y)) {
      assert(!b.aggressive, `Beast ${b.id} spawned in safe belt must not be aggressive`);
      assert(b.tier < 3, `Beast ${b.id} spawned in safe belt must be low tier (< 3), got tier ${b.tier}`);
    }
  }
}
console.log('PASS aggressive and tier >= 3 beasts excluded from spawning in safe belt');

// B) Aggressive beasts cannot initiate fight inside safe belt
const aggroBeast = {
  id: 9999,
  name: 'เสือดำดุร้าย',
  tier: 4,
  aggressive: true,
  x: 100, // inside safe belt
  y: 140,
  hp: 200,
  hpMax: 200
};
const gatherer = W.npcs[0];
gatherer.x = 100;
gatherer.y = 140;

const fightStarted = WILD.startFight(W, gatherer, aggroBeast);
assert(!fightStarted, 'Aggressive beast must not initiate fight inside safe collection belt');
console.log('PASS aggressive beasts blocked from initiating combat inside safe belt');

// C) Safe belt boundary: aggressive beasts do not wander into or chase into safe belt
// Place an aggressive beast just outside safe belt (e.g. y = 133 or x = 79)
const beast2 = {
  id: 9998,
  zone: 'meadow',
  x: 78,
  y: 140,
  tier: 3,
  aggressive: true,
  hp: 100,
  hpMax: 100
};
W.wildlife.beasts = [beast2];

// Target gatherer inside safe belt (x: 100, y: 140)
gatherer.x = 100;
gatherer.y = 140;

// Run tick wander logic
W.t += 15 - (W.t % 15);
WILD.tick(W);

// Beast should NOT have entered safe belt
assert(!MAP.isInSafeBelt(beast2.x, beast2.y), `Aggressive beast must not wander or chase into safe belt (at ${beast2.x}, ${beast2.y})`);
console.log('PASS aggressive beasts wander and aggro boundary excludes safe belt');

// 5. Legendary spawn preservation: 1 roll per hour, cap <= 1
// Clear beasts and simulate legendary check
W.wildlife.beasts = [];
W.wildlife.lastLegendaryRollDay = -1;

// If a legendary is already active:
const activeLegend = {
  id: 8888,
  zone: 'legend',
  legendary: true,
  x: 50,
  y: 150,
  hp: 500,
  hpMax: 500
};
W.wildlife.beasts.push(activeLegend);

// Force an hourly tick where legendary roll would otherwise occur
W.t += 60;
WILD.tick(W);

const legendaryCount = W.wildlife.beasts.filter(b => b.legendary).length;
assert.strictEqual(legendaryCount, 1, 'Active legendary beasts must never exceed 1');
console.log('PASS legendary cap <= 1 strictly preserved');

console.log('ALL Bounded Wildlife Batches & Safe Belt Isolation tests PASSED.');
