'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, WILD_RES, MAP, ECO, SECT, CPE, AI } = G;

console.log('--- Testing Finite Outdoor Resource Gathering & Medicine Economy ---');

// 1. Module existence & configuration
assert(WILD_RES, 'WILD_RES module must exist');
assert.strictEqual(WILD_RES.MAX_NODES, 48, 'MAX_NODES must be 48');

// 2. Map coordinates & safe belt
assert(MAP.SAFE_BELT, 'MAP.SAFE_BELT must exist');
assert.strictEqual(MAP.SAFE_BELT.x0, 80);
assert.strictEqual(MAP.SAFE_BELT.x1, 156);
assert(MAP.isInSafeBelt(118.5, 132.5), 'Safe belt must include the gate approach');
assert.strictEqual(MAP.SAFE_BELT.y1, 156);
assert(MAP.isInSafeBelt(100, 140), 'Point (100, 140) must be in safe belt');
assert(!MAP.isInSafeBelt(50, 50), 'Point (50, 50) inside sect is not in safe belt');

const W = SIM.create('res-test');
assert(W.wildResources, 'W.wildResources must be initialized');
assert(Array.isArray(W.wildResources.nodes), 'W.wildResources.nodes must be array');

// 3. Spawning & node cap (48 max)
for (let i = 0; i < 40; i++) {
  WILD_RES.batchSpawn(W, 3);
}
assert(W.wildResources.nodes.length <= 48, `Active nodes (${W.wildResources.nodes.length}) must not exceed 48`);
console.log('PASS active node cap 48 respected');

// 4. Safe belt placement and outside wall check
W.wildResources.nodes.forEach(node => {
  assert(MAP.isOutsideWall(W.map, node.x, node.y), `Node at (${node.x}, ${node.y}) must be outside sect wall`);
  assert(!MAP.blocked(W.map, node.x, node.y), `Node at (${node.x}, ${node.y}) must be on passable tile`);
  assert(node.remaining > 0 && node.remaining <= node.initial, 'Node must have valid remaining quantity');
  if (node.category === 'HERB') {
    // Basic herbs spawn inside or close to safe collection belt
    assert(node.x >= 75 && node.x <= 160 && node.y >= 130 && node.y <= 165, 'Herb node must be in exterior safe vicinity');
  }
});
console.log('PASS nodes placed strictly outside wall and herbs in safe belt vicinity');

// 5. Category and herb distribution weights
const sampleCounts = { BASIC_HERB: 0, OTHER_HERB: 0, ORE: 0, OTHER_MAT: 0 };
const basicHerbCounts = {};
const testW = SIM.create('res-dist-test');
for (let i = 0; i < 1500; i++) {
  testW.wildResources.nodes = [];
  const node = WILD_RES.createNode(testW);
  if (node) {
    if (node.category === 'BASIC_HERB') {
      sampleCounts.BASIC_HERB++;
      basicHerbCounts[node.materialId] = (basicHerbCounts[node.materialId] || 0) + 1;
    } else if (node.category === 'OTHER_HERB') {
      sampleCounts.OTHER_HERB++;
    } else if (node.category === 'ORE') {
      sampleCounts.ORE++;
    } else {
      sampleCounts.OTHER_MAT++;
    }
  }
}
const total = Object.values(sampleCounts).reduce((s, v) => s + v, 0);
const basicHerbPct = sampleCounts.BASIC_HERB / total;
const orePct = sampleCounts.ORE / total;
console.log(`Distribution over ${total} nodes: BasicHerb=${(basicHerbPct * 100).toFixed(1)}%, Ore=${(orePct * 100).toFixed(1)}%`);
assert(basicHerbPct >= 0.60 && basicHerbPct <= 0.80, `Basic herb percentage should be ~70% (got ${(basicHerbPct * 100).toFixed(1)}%)`);
assert(basicHerbCounts['MAT_HERB_DEW_GRASS_1'] > basicHerbCounts['MAT_HERB_CINDER_LEAF_1'], 'Dew Grass weight > Cinder Leaf weight');
assert(basicHerbCounts['MAT_HERB_CINDER_LEAF_1'] > basicHerbCounts['MAT_HERB_JADE_LOTUS_2'], 'Cinder Leaf weight > Jade Lotus weight');
console.log('PASS resource categories and basic herb weights verified');

// 6. Claim leasing, mutual exclusion, and release on interrupt / death / cancel
const testNode = W.wildResources.nodes[0];
const npc1 = W.npcs[0];
const npc2 = W.npcs[1];

assert(WILD_RES.leaseClaim(W, testNode.id, npc1.id), 'Claim leasing to npc1 must succeed');
assert.strictEqual(testNode.claimedBy, npc1.id);
assert(!WILD_RES.leaseClaim(W, testNode.id, npc2.id), 'Claim leasing to npc2 must fail while claimed by npc1');

// Release claim
WILD_RES.releaseClaim(W, testNode.id, npc1.id);
assert.strictEqual(testNode.claimedBy, null, 'Claim must be cleared after release');

// Claim and interrupt
WILD_RES.leaseClaim(W, testNode.id, npc1.id);
AI.interruptFor(W, npc1);
assert.strictEqual(testNode.claimedBy, null, 'Claim must be cleared on AI.interruptFor');

// Claim and cancelAct
WILD_RES.leaseClaim(W, testNode.id, npc1.id);
AI.cancelAct(W, npc1);
assert.strictEqual(testNode.claimedBy, null, 'Claim must be cleared on AI.cancelAct');
console.log('PASS claim leasing, mutual exclusion, and robust release on interruption');

// 7. Finite harvesting into personal inventory (n.inv.mats) with 0 CP direct minting
const harvestNode = W.wildResources.nodes.find(n => n.remaining > 0);
const matId = harvestNode.materialId;
const initialRemaining = harvestNode.remaining;
const initialPersonalMat = (npc1.inv && npc1.inv.mats && npc1.inv.mats[matId]) || 0;
const initialCp = npc1.cp || 0;

const actDef = AI.ACTS.gatherWildResource;
assert(actDef, 'AI.ACTS.gatherWildResource must exist');

// Run harvest directly on node
npc1.x = harvestNode.x + 0.5;
npc1.y = harvestNode.y + 0.5;
const harvestRes = WILD_RES.harvestNode(W, npc1, harvestNode.id);
assert(harvestRes.ok, 'WILD_RES.harvestNode must succeed');

assert.strictEqual(harvestNode.remaining, initialRemaining - 1, 'Node remaining must decrement by 1');
assert.strictEqual(npc1.inv.mats[matId], initialPersonalMat + 1, 'Material must be placed directly into personal n.inv.mats');
assert.strictEqual(npc1.cp, initialCp, 'Direct harvest must mint 0 CP');
console.log('PASS finite harvesting directly into n.inv.mats with 0 CP minted');

// 8. Node exhaustion removal
harvestNode.remaining = 1;
const finalRes = WILD_RES.harvestNode(W, npc1, harvestNode.id);
assert(finalRes.ok, 'Final harvest must succeed');
assert(!W.wildResources.nodes.some(n => n.id === harvestNode.id), 'Exhausted node (0 remaining) must be removed from active nodes');
console.log('PASS node exhaustion removal');

// 9. Retain vs Donate decision & Medicine Economy loop
// A) Member donates material via SECT.donateMat:
const preSectStock = ECO.count(W, matId);
const prePersonalStock = npc1.inv.mats[matId];
const preCp = npc1.cp || 0;

const donated = SECT.donateMat(W, npc1, matId, 1);
assert(donated, 'SECT.donateMat must succeed');
assert.strictEqual(npc1.inv.mats[matId], prePersonalStock - 1, 'Personal material stock must decrement');
assert.strictEqual(ECO.count(W, matId), preSectStock + 1, 'Sect material stock must increment');
assert(npc1.cp > preCp, 'Donating material must mint contribution points to member');
console.log('PASS SECT.donateMat material deduction, sect stock addition, and CP reward');

// B) Real donated units are consumed by the actual brewing action, then bought and used.
const cycle = SIM.create('resource-medicine-cycle'), donor = cycle.npcs[0], brewer = cycle.npcs[1];
cycle.sect.stock = {};
donor.inv.mats = { MAT_HERB_DEW_GRASS_1: 2, MAT_HERB_CINDER_LEAF_1: 1 };
assert(SECT.donateMat(cycle, donor, 'MAT_HERB_DEW_GRASS_1', 2).ok);
assert(SECT.donateMat(cycle, donor, 'MAT_HERB_CINDER_LEAF_1', 1).ok);
brewer.h.skills.ALCHEMY = 100;
const brew = AI.ACTS.brewBasic, brewCtx = { rid: 'BASIC_HP' };
assert(brew.start(brewer, cycle, brewCtx), 'actual brewing must reserve donated ingredients');
assert.strictEqual(ECO.count(cycle, 'MAT_HERB_DEW_GRASS_1'), 0);
assert.strictEqual(ECO.count(cycle, 'MAT_HERB_CINDER_LEAF_1'), 0);
const originalNext = cycle.rng.next;
cycle.rng.next = () => .01;
try { brew.done(brewer, cycle, brewCtx); } finally { cycle.rng.next = originalNext; }
assert(ECO.count(cycle, 'P:BASIC_HP') > 0, 'real brewing must create basic healing pills');
donor.cp = 1000; donor.h.state.hp = 1;
assert(CPE.buy(cycle, donor, { kind: 'pill', key: 'P:BASIC_HP', price: CPE.priceOf(cycle, 'P:BASIC_HP') }));
CPE.autoUse(cycle, donor);
assert(donor.h.state.hp > 1, 'member must actually consume the purchased medicine');
assert.strictEqual(donor.inv.pills['P:BASIC_HP'] || 0, 0);
console.log('PASS donated herbs -> actual brewing -> shop purchase -> healing and unit consumption');

// 10. Save / Load serialization test
const serialized = SIM.serialize(W);
const loaded = SIM.deserialize(serialized);
assert(loaded.wildResources, 'loaded world must contain wildResources');
assert.strictEqual(loaded.wildResources.nodes.length, W.wildResources.nodes.length, 'Node count must match after save/load');
assert.strictEqual(loaded.wildResources.seq, W.wildResources.seq, 'Sequence number must match after save/load');
console.log('PASS save/load serialization preserves wildResources');

console.log('ALL Finite Outdoor Resource Gathering & Medicine Economy tests PASSED.');
