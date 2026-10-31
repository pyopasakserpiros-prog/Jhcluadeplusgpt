'use strict';
// Observe successful production transactions, not UI text or hypothetical APIs.
const assert = require('assert'), fs = require('fs');
const G = require('./load');
const { SIM, WILD_RES: R, WILD, EXPED, EXPLORE, ECO, SECT, CPE, JD, MAP } = G;
const days = Number(process.argv[2] || 90), seed = process.argv[3] || 'long-sim-rank-resources';
assert(Number.isSafeInteger(days) && days > 0);
const basic = new Set(JD.CP.BASIC.map(r => r.outItemId || 'P:' + r.id));
const metrics = {
  seed, days, nodeSpawns: {}, harvestActions: 0, harvestedUnits: 0, privateRetains: 0,
  donations: { units: 0, cp: 0 }, basicPillsCrafted: 0, pillsPurchased: 0, pillsConsumed: 0,
  wildlifeBatches: { 1: 0, 2: 0, 3: 0 }, legendarySpawns: 0, maxActiveWildlife: 0,
  fortuneByRank: { 1: 0, 2: 0, 3: 0, 4: 0 }, realmByRank: { 1: 0, 2: 0, 3: 0, 4: 0 }, snapshots: []
};
const count = (obj, key, qty = 1) => { obj[key] = (obj[key] || 0) + qty; };
function observe(obj, key, after) {
  const original = obj[key];
  obj[key] = function (...args) { const result = original.apply(this, args); after(result, args); return result; };
}
observe(R, 'spawnNode', node => { if (node) count(metrics.nodeSpawns, node.category); });
observe(R, 'harvestNode', res => { if (res.ok) { metrics.harvestActions++; metrics.harvestedUnits += res.qty; } });
observe(SECT, 'donateMat', res => { if (res.ok) { metrics.donations.units += res.qty; metrics.donations.cp += res.reward; } });
const act = G.AI.ACTS.gatherWildResource, originalDone = act.done;
act.done = function (n, W, ctx) {
  const key = W.wildResources.nodes.find(node => node.id === ctx.nodeId)?.materialId;
  const before = n.inv.mats?.[key] || 0;
  const result = originalDone(n, W, ctx);
  if (key) metrics.privateRetains += Math.max(0, (n.inv.mats?.[key] || 0) - before);
  return result;
};
observe(ECO, 'finishCraft', res => { if (res.ok && basic.has(res.key)) metrics.basicPillsCrafted += res.n; });
observe(CPE, 'buy', (ok, [, , quote]) => { if (ok && quote.kind === 'pill') metrics.pillsPurchased++; });
observe(ECO, 'applyPill', (ok, [, , key]) => { if (ok && ECO.isPill(key)) metrics.pillsConsumed++; });
observe(WILD, 'spawn', beast => { if (beast?.legendary) metrics.legendarySpawns++; });
observe(EXPED, 'depart', ex => { if (ex?.kind === 'fortune') count(metrics.fortuneByRank, ex.partyRank); });
observe(EXPLORE, 'depart', ex => { if (ex?.kind === 'realm') count(metrics.realmByRank, ex.partyRank); });
let W = SIM.create(seed);
const started = Date.now();
console.log('Simulating ' + days + ' native game days: ' + seed);
for (let i = 0; i < days * 1440; i++) {
  const oldIds = new Set(W.wildlife?.beasts.map(b => b.id));
  SIM.tick(W);
  const active = W.wildlife.beasts.filter(b => !b.gone && !b.dead);
  const ordinaryNew = active.filter(b => !b.legendary && !oldIds.has(b.id)).length;
  if (ordinaryNew) count(metrics.wildlifeBatches, ordinaryNew);
  metrics.maxActiveWildlife = Math.max(metrics.maxActiveWildlife, active.length);
  assert(active.length <= 12 && active.filter(b => b.legendary).length <= 1);
  assert(W.wildResources.nodes.length <= 48);
  for (const b of active) if ((b.aggressive || b.tier >= 3) && !b.fighting) assert(!MAP.isInSafeBelt(b.x, b.y), 'unsafe beast in safe belt');
  if (i + 1 === Math.floor(days / 2) * 1440) {
    const nodes = JSON.stringify(W.wildResources), state = JSON.stringify(W.rng.getState());
    W = SIM.deserialize(SIM.serialize(W));
    assert.strictEqual(JSON.stringify(W.wildResources), nodes);
    assert.strictEqual(JSON.stringify(W.rng.getState()), state);
  }
  if ((i + 1) % (30 * 1440) === 0 || i + 1 === days * 1440) {
    const living = W.npcs.filter(n => !n.dead);
    for (const n of living) {
      assert(Number.isFinite(n.cp) && n.cp >= 0 && Number.isFinite(n.h.state.hp));
      for (const qty of Object.values(n.inv.mats || {})) assert(Number.isSafeInteger(qty) && qty >= 0);
    }
    for (const qty of Object.values(W.sect.stock)) assert(Number.isFinite(qty) && qty >= 0);
    const cps = living.map(n => n.cp || 0).sort((a, b) => a - b);
    const meanCp = cps.length ? Math.round((cps.reduce((s, v) => s + v, 0) / cps.length) * 10) / 10 : 0;
    const medianCp = cps.length ? (cps.length % 2 === 1 ? cps[Math.floor(cps.length / 2)] : Math.round(((cps[cps.length / 2 - 1] + cps[cps.length / 2]) / 2) * 10) / 10) : 0;
    const cpS = CPE.S(W);
    const snapshot = {
      day: (i + 1) / 1440, population: living.length, stones: W.sect.stones,
      meals: ECO.count(W, 'meal'), cp: living.reduce((s, n) => s + n.cp, 0),
      meanHoldings: meanCp, medianHoldings: medianCp, priceIndex: Math.round((cpS.price || 1) * 100) / 100,
      totalMinted: Math.round(cpS.minted * 10) / 10, totalBurned: Math.round(cpS.burned * 10) / 10,
      circulation: cpS.circulation,
      nodes: W.wildResources.nodes.length, harvestActions: metrics.harvestActions,
      privateRetains: metrics.privateRetains, basicPillsCrafted: metrics.basicPillsCrafted,
      pillsPurchased: metrics.pillsPurchased, pillsConsumed: metrics.pillsConsumed
    };
    metrics.snapshots.push(snapshot); console.log(JSON.stringify(snapshot));
  }
}
metrics.elapsedMs = Date.now() - started;
assert(metrics.harvestActions > 0, 'natural NPC harvesting must be observed');
assert(metrics.donations.units > 0, 'natural donation must be observed');
assert(metrics.basicPillsCrafted > 0, 'natural basic medicine production must be observed');
if (process.argv[4]) fs.writeFileSync(process.argv[4], JSON.stringify(metrics, null, 2) + '\n');
console.log(JSON.stringify(metrics, null, 2));
console.log('PASS native simulation, finite resources, inventories, safety, population and save/load invariants');
