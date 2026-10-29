'use strict';
const assert = require('assert');
const path = require('path');
const G = require('./load');
const { SIM, WILD_RES, WILD, MAP, ECO, SECT, CPE, CULT, HC, AI } = G;

console.log('=== Running Long Ecology & World Rank Simulation (90 Game Days) ===');

const W = SIM.create('long-sim-rank-resources');
assert(W.wildResources, 'wildResources must be initialized');

// Metrics collectors
const metrics = {
  nodeSpawns: { total: 0, BASIC_HERB: 0, OTHER_HERB: 0, ORE: 0, OTHER: 0 },
  nodeHarvests: { totalUnits: 0, actionsCompleted: 0 },
  donations: { totalUnits: 0, cpEarned: 0 },
  privateRetains: 0,
  basicPillsCrafted: 0,
  pillsPurchased: 0,
  pillsConsumed: 0,
  wildlifeBatches: { 1: 0, 2: 0, 3: 0 },
  wildlifeRefills: 0,
  legendarySpawns: 0,
  maxActiveWildlife: 0,
  fortuneByRank: { 1: 0, 2: 0, 3: 0, 4: 0 },
  realmByRank: { 1: 0, 2: 0, 3: 0, 4: 0 }
};

// Hook logging / events
const origLog = W.log;
W.log = function (type, text, ids) {
  if (text.includes('ปรากฏตัวใน') && text.includes('★')) {
    metrics.legendarySpawns++;
  }
  if (type === 'explore' && text.includes('กลับจากภารกิจ「วาสนาเร้นลับ」')) {
    // Check party world ranks
  }
  return origLog.call(this, type, text, ids);
};

// Hook WILD_RES.spawnBatch to record spawn batch stats
const origSpawnBatch = WILD_RES.spawnBatch;
WILD_RES.spawnBatch = function (world, count) {
  const before = (world.wildResources && world.wildResources.nodes.length) || 0;
  origSpawnBatch.call(this, world, count);
  const after = (world.wildResources && world.wildResources.nodes.length) || 0;
  const spawned = after - before;
  if (spawned > 0) {
    metrics.nodeSpawns.total += spawned;
    // Categorize latest nodes
    world.wildResources.nodes.slice(-spawned).forEach(n => {
      if (n.category === 'BASIC_HERB') metrics.nodeSpawns.BASIC_HERB++;
      else if (n.category === 'OTHER_HERB') metrics.nodeSpawns.OTHER_HERB++;
      else if (n.category === 'ORE') metrics.nodeSpawns.ORE++;
      else metrics.nodeSpawns.OTHER++;
    });
  }
};

// Observe donateMat
const origDonateMat = SECT.donateMat;
SECT.donateMat = function (world, npc, matId, qty) {
  const res = origDonateMat.call(this, world, npc, matId, qty);
  if (res && res.qty > 0) {
    metrics.donations.totalUnits += res.qty;
    metrics.donations.cpEarned += (res.reward || 0);
  }
  return res;
};

// Observe expedition departures
const origXDepart = G.EXPED.depart;
G.EXPED.depart = function (world, party, kind, region) {
  const ex = origXDepart.call(this, world, party, kind, region);
  if (ex && ex.partyRank) {
    const r = Math.min(4, Math.max(1, Math.round(ex.partyRank)));
    if (kind === 'fortune') metrics.fortuneByRank[r]++;
  }
  return ex;
};

const origEXDepart = G.EXPLORE.depart;
G.EXPLORE.depart = function (world, party, kind) {
  const ex = origEXDepart.call(this, world, party, kind);
  if (ex && ex.partyRank) {
    const r = Math.min(4, Math.max(1, Math.round(ex.partyRank)));
    if (kind === 'realm') metrics.realmByRank[r]++;
  }
  return ex;
};

const SIM_DAYS = 90;
const TOTAL_TICKS = SIM_DAYS * 1440;
let currentW = W;

console.log(`Simulating ${SIM_DAYS} game days (${TOTAL_TICKS} ticks)...`);
const startTime = Date.now();

for (let tick = 0; tick < TOTAL_TICKS; tick++) {
  SIM.tick(currentW);

  // Track max active wildlife
  if (currentW.wildlife && currentW.wildlife.beasts) {
    const activeBeasts = currentW.wildlife.beasts.filter(b => !b.gone && !b.dead).length;
    if (activeBeasts > metrics.maxActiveWildlife) metrics.maxActiveWildlife = activeBeasts;
  }

  // Mid-simulation save/load test at Day 45
  if (tick === 45 * 1440) {
    console.log('Day 45: Verifying mid-simulation save/load round-trip...');
    const serialized = SIM.serialize(currentW);
    assert(serialized && serialized.length > 100, 'Serialized snapshot must not be empty');
    currentW = SIM.deserialize(serialized);
    assert(currentW.wildResources, 'wildResources must restore on load');
    assert(currentW.wildResources.nodes.length <= 48, 'Nodes cap must hold on load');
  }

  // Periodic health check every 30 days
  if ((tick + 1) % (30 * 1440) === 0) {
    const day = (tick + 1) / 1440;
    const activeNodes = currentW.wildResources ? currentW.wildResources.nodes.length : 0;
    const activeBeasts = currentW.wildlife ? currentW.wildlife.beasts.filter(b => !b.gone && !b.dead).length : 0;
    console.log(`Day ${day}: Active Nodes=${activeNodes}/48, Active Beasts=${activeBeasts}/12, Sect Stones=${currentW.sect.stones}`);
  }
}

const elapsedMs = Date.now() - startTime;
console.log(`Simulation finished in ${elapsedMs}ms (${(TOTAL_TICKS / (elapsedMs / 1000)).toFixed(0)} ticks/sec)`);

// Final verification of invariants
assert(currentW.wildResources.nodes.length <= 48, 'Final nodes must not exceed cap 48');
const finalActiveBeasts = currentW.wildlife.beasts.filter(b => !b.gone && !b.dead).length;
assert(finalActiveBeasts <= 12, 'Final active wildlife must not exceed cap 12');
assert(metrics.maxActiveWildlife <= 12, 'Peak active wildlife must not exceed cap 12');

// Verify that NPCs have valid states and no NaN
currentW.npcs.forEach(n => {
  assert(!isNaN(n.h.state.hp), `NPC ${n.id} HP must not be NaN`);
  assert(!isNaN(n.cp), `NPC ${n.id} CP must not be NaN`);
  assert(n.cp >= 0, `NPC ${n.id} CP must not be negative`);
  if (n.inv && n.inv.mats) {
    Object.entries(n.inv.mats).forEach(([m, q]) => {
      assert(!isNaN(q) && q >= 0, `Mat ${m} quantity must be non-negative integer`);
    });
  }
});

console.log('\n--- Simulation Metrics Report ---');
console.log(`Total Resource Nodes Spawned: ${metrics.nodeSpawns.total}`);
console.log(`  Basic Recovery Herbs: ${metrics.nodeSpawns.BASIC_HERB} (${(metrics.nodeSpawns.BASIC_HERB / (metrics.nodeSpawns.total || 1) * 100).toFixed(1)}%)`);
console.log(`  Other Herbs: ${metrics.nodeSpawns.OTHER_HERB} (${(metrics.nodeSpawns.OTHER_HERB / (metrics.nodeSpawns.total || 1) * 100).toFixed(1)}%)`);
console.log(`  Ores: ${metrics.nodeSpawns.ORE} (${(metrics.nodeSpawns.ORE / (metrics.nodeSpawns.total || 1) * 100).toFixed(1)}%)`);
console.log(`  Other Materials: ${metrics.nodeSpawns.OTHER} (${(metrics.nodeSpawns.OTHER / (metrics.nodeSpawns.total || 1) * 100).toFixed(1)}%)`);
console.log(`Total Material Donations: ${metrics.donations.totalUnits} units, CP Minted: ${metrics.donations.cpEarned}`);
console.log(`Peak Wildlife On-Screen: ${metrics.maxActiveWildlife} / 12`);
console.log(`Legendary Beast Spawns: ${metrics.legendarySpawns}`);
console.log('Fortune Expeditions by Party Rank:', JSON.stringify(metrics.fortuneByRank));
console.log('Myriad Worlds (Realm) Expeditions by Party Rank:', JSON.stringify(metrics.realmByRank));
console.log('\n=== LONG SIMULATION VERIFICATION PASSED ===\n');
