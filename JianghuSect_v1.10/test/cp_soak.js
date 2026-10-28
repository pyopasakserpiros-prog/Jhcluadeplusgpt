'use strict';
// Economy-focused long simulation. Usage: node test/cp_soak.js [days=180] [seed=cp-soak-1] [masterIdx=0]
const assert = require('assert');
const G = require('./load.js');
const { SIM, CPE, ECO } = G;
const days = Math.max(1, +process.argv[2] || 180), seed = process.argv[3] || 'cp-soak-1', masterIdx = +process.argv[4] || 0;
const W = SIM.create(seed, { masterIdx }), end = W.t + days * 1440, started = Date.now();
const mintBy = {}, burnBy = {};
const oldMint = CPE.mint, oldSpend = CPE.spend;
CPE.mint = function (world, npc, amount, why) { const paid = oldMint.apply(this, arguments); if (paid > 0) mintBy[why] = (mintBy[why] || 0) + paid; return paid; };
CPE.spend = function (world, npc, amount, why) { const ok = oldSpend.apply(this, arguments); if (ok) burnBy[why] = (burnBy[why] || 0) + amount; return ok; };
let lastDay = W.day, checks = 0;
while (W.t < end) {
  try { SIM.tick(W); } catch (err) { console.error('CRASH', seed, 'day', W.day, err.stack); process.exit(1); }
  if (W.day !== lastDay) {
    lastDay = W.day;
    if (W.day % 30 === 0) {
      checks++;
      const alive = W.npcs.filter(n => !n.dead && !n.exiled);
      for (const n of alive) {
        assert(Number.isFinite(n.cp || 0) && (n.cp || 0) >= 0, 'invalid contribution points for ' + n.id);
        for (const v of Object.values(n.h.state)) if (typeof v === 'number') assert(Number.isFinite(v), 'NaN state for ' + n.id);
      }
      for (const [id, qty] of Object.entries(W.sect.stock)) assert(qty >= 0 && Number.isFinite(qty), 'invalid stock ' + id);
    }
  }
}
CPE.mint = oldMint; CPE.spend = oldSpend;
const alive = W.npcs.filter(n => !n.dead && !n.exiled), cps = alive.map(n => n.cp || 0).sort((a, b) => a - b);
const pillStock = Object.entries(W.sect.stock).filter(([k, v]) => ECO.isPill(k) && v > 0).reduce((s, [, v]) => s + v, 0);
const premiumPills = Object.entries(W.sect.stock).filter(([k, v]) => ECO.isPill(k) && !k.startsWith('P:BASIC_') && v > 0).reduce((s, [, v]) => s + v, 0);
const summary = {
  seed, masterIdx, days, elapsedMs: Date.now() - started, checks,
  population: alive.length,
  contribution: {
    minted: Math.round(CPE.S(W).minted), burned: Math.round(CPE.S(W).burned),
    ratio: +(CPE.S(W).minted / Math.max(1, CPE.S(W).burned)).toFixed(2),
    heldTotal: Math.round(cps.reduce((s, v) => s + v, 0)), average: Math.round(cps.reduce((s, v) => s + v, 0) / Math.max(1, cps.length)),
    median: Math.round(cps[cps.length >> 1] || 0), p90: Math.round(cps[Math.floor(cps.length * 0.9)] || 0),
    priceIndex: +CPE.S(W).price.toFixed(2), purchases: CPE.S(W).sales, paidStudy: Math.round(CPE.S(W).techSales), guidanceServices: CPE.S(W).studyServices || 0, guidanceFees: Math.round(CPE.S(W).studyFees || 0), trainingServices: CPE.S(W).trainingServices || 0, trainingFees: Math.round(CPE.S(W).trainingFees || 0)
  },
  stock: { pillUnits: pillStock, premiumPillUnits: premiumPills, gear: W.sect.gear.length, library: W.sect.library.length },
  topMintSources: Object.entries(mintBy).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([why, v]) => [why, Math.round(v)]),
  topBurnSources: Object.entries(burnBy).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([why, v]) => [why, Math.round(v)])
};
assert(CPE.S(W).price >= 0.6 && CPE.S(W).price <= 4, 'price index out of bounds');
console.log(JSON.stringify(summary, null, 2));
