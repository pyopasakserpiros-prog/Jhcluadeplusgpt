'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const G = require('./load.js');
const { SIM, ECO, CPE, EXT, WILD, CULT, SECT, JD, STATS } = G;

const days = +(process.argv[2] || 90);
const seed = process.argv[3] || 'ecology-sim-seed-' + days;
const outputFile = process.argv[4] || null;

console.log(`Starting Living Beast & Craft Ecology Simulation for ${days} days (seed: ${seed})...`);

const W = SIM.create(seed);
WILD.init(W);
EXT.init ? EXT.init(W) : EXT.ensure(W);

const startT = W.t;
const endT = startT + days * 1440;
const startedAt = Date.now();

// Trackers
const drops = {};
const production = {};
const consumption = {};
const purchases = {};
const sectSurplusSales = {};
const memberTrades = { buy: {}, sell: {}, sellPill: {} };
const monthlySnapshots = [];

const count = (obj, key, n = 1) => {
  obj[key] = (obj[key] || 0) + n;
};

// Intercept WILD.finish for drops
const origWildFinish = WILD.finish;
WILD.finish = (w, fight, winner) => {
  if (w === W && fight && !fight.wildSettled && winner === 'A') {
    const hunter = fight.ctx && (w.byId[fight.ctx.hunterId] || w.npcs.find(n => n.id === fight.ctx.hunterId));
    const beast = fight.ctx && (w.foeById[fight.ctx.beastId] || (w.wildlife && w.wildlife.beasts.find(b => b.id === fight.ctx.beastId)));
    if (hunter && beast && beast.speciesId) {
      const sp = (JD.BEASTS.species || []).find(s => s.id === beast.speciesId);
      if (sp && sp.drops) {
        sp.drops.forEach(d => {
          if (String(d).startsWith('ECO2_')) count(drops, d, 1);
        });
      }
    }
  }
  return origWildFinish(w, fight, winner);
};

// Intercept ECO.finishCraft for production
const origFinishCraft = ECO.finishCraft;
ECO.finishCraft = (w, n, r, ctx) => {
  const res = origFinishCraft(w, n, r, ctx);
  if (w === W && res && res.ok && r && String(r.id).startsWith('ECO2_')) {
    count(production, r.id, res.n || 1);
  }
  return res;
};

// Intercept ECO.applyPill & applyQualityPill for consumption
const origApplyPill = ECO.applyPill;
ECO.applyPill = (w, n, key) => {
  const res = origApplyPill(w, n, key);
  if (w === W && res && String(key).includes('ECO2_')) {
    count(consumption, key, 1);
  }
  return res;
};

// Intercept CPE.buy for purchases
const origCpeBuy = CPE.buy;
CPE.buy = (w, n, p) => {
  const res = origCpeBuy(w, n, p);
  if (w === W && res) {
    const k = p.key || (p.gear && p.gear.id) || '';
    if (String(k).includes('ECO2_')) {
      count(purchases, k, 1);
    }
  }
  return res;
};

// Intercept EXT.tradeSect for external surplus sales
const origTradeSect = EXT.tradeSect;
EXT.tradeSect = (w, v) => {
  const stockBefore = {};
  if (w === W && v) {
    for (const k of Object.keys(w.sect.stock)) {
      if (k.startsWith('ECO2_') || k.startsWith('P:ECO2_')) stockBefore[k] = w.sect.stock[k];
    }
  }
  const res = origTradeSect(w, v);
  if (w === W && v) {
    for (const k of Object.keys(stockBefore)) {
      const cur = w.sect.stock[k] || 0;
      if (cur < stockBefore[k]) {
        count(sectSurplusSales, k, stockBefore[k] - cur);
      }
    }
  }
  return res;
};

// Intercept EXT.tradeMember
const origTradeMember = EXT.tradeMember;
EXT.tradeMember = (w, n, quote) => {
  const res = origTradeMember(w, n, quote);
  if (w === W && res && quote && String(quote.itemId).includes('ECO2_')) {
    if (quote.side === 'buy') count(memberTrades.buy, quote.itemId, quote.qty || 1);
    else if (quote.side === 'sell') count(memberTrades.sell, quote.itemId, quote.qty || 1);
    else if (quote.side === 'sell-pill') count(memberTrades.sellPill, quote.itemId, quote.qty || 1);
  }
  return res;
};

let lastDay = W.day;
let tickCount = 0;

while (W.t < endT) {
  SIM.tick(W);
  tickCount++;

  if (W.day !== lastDay) {
    lastDay = W.day;

    // Invariant checks
    // 1. Sect stock non-negative
    for (const [id, q] of Object.entries(W.sect.stock)) {
      assert(Number.isFinite(q) && q >= 0, `Sect stock ${id} must be non-negative: ${q}`);
    }
    // 2. Sect stones non-negative
    assert(Number.isFinite(W.sect.stones) && W.sect.stones >= 0, `Sect stones must be non-negative: ${W.sect.stones}`);

    // 3. Wildlife invariants
    if (W.wildlife && W.wildlife.beasts) {
      const active = W.wildlife.beasts.filter(b => !b.gone && !b.dead);
      assert(active.length <= 12, `Active beasts must not exceed 12: ${active.length}`);
      const legCount = active.filter(b => b.legendary).length;
      assert(legCount <= 1, `Active legendary beasts must not exceed 1: ${legCount}`);
      // Zero aquatic beasts on sect map
      for (const b of active) {
        const sp = (JD.BEASTS.species || []).find(s => s.id === b.speciesId);
        if (sp) {
          assert(sp.terrain !== 'water' && sp.archetype !== 'AQUATIC', `Aquatic beast on map: ${b.speciesId}`);
        }
      }
    }

    // 4. Member invariants
    for (const n of W.npcs) {
      if (n.dead) continue;
      assert(Number.isFinite(n.cp || 0) && (n.cp || 0) >= 0, `Member CP ${n.id} must be >= 0`);
      if (n.inv) {
        for (const bag of [n.inv.mats, n.inv.pills, n.inv.organs]) {
          if (!bag) continue;
          for (const [k, q] of Object.entries(bag)) {
            assert(Number.isFinite(q) && q >= 0, `Member ${n.id} bag item ${k} negative: ${q}`);
          }
        }
      }
    }

    // 5. Monthly snapshot
    if (W.day % 30 === 0) {
      const eco2StockCount = Object.entries(W.sect.stock)
        .filter(([k]) => k.startsWith('ECO2_') || k.startsWith('P:ECO2_'))
        .reduce((sum, [, v]) => sum + v, 0);

      monthlySnapshots.push({
        day: W.day,
        population: W.npcs.filter(n => !n.dead).length,
        stones: Math.round(W.sect.stones),
        cpCirculation: Math.round(CPE.S(W).circulation || 0),
        eco2StockUnits: eco2StockCount,
        eco2DropsTotal: Object.values(drops).reduce((a, b) => a + b, 0),
        eco2ProductionTotal: Object.values(production).reduce((a, b) => a + b, 0),
        eco2ConsumptionTotal: Object.values(consumption).reduce((a, b) => a + b, 0),
        eco2PurchasesTotal: Object.values(purchases).reduce((a, b) => a + b, 0),
        eco2SectSalesTotal: Object.values(sectSurplusSales).reduce((a, b) => a + b, 0)
      });
    }
  }
}

const elapsedMs = Date.now() - startedAt;

// Collect final ECO2 stock in sect
const finalEco2Stock = {};
for (const [k, v] of Object.entries(W.sect.stock)) {
  if ((k.startsWith('ECO2_') || k.startsWith('P:ECO2_')) && v > 0) {
    finalEco2Stock[k] = v;
  }
}

const summary = {
  status: 'PASS',
  days,
  seed,
  ticks: tickCount,
  elapsedMs,
  population: W.npcs.filter(n => !n.dead).length,
  deaths: W.deaths || 0,
  sectStones: Math.round(W.sect.stones),
  cpStats: {
    minted: Math.round(CPE.S(W).minted || 0),
    burned: Math.round(CPE.S(W).burned || 0),
    circulation: Math.round(CPE.S(W).circulation || 0),
    priceIndex: Math.round((CPE.S(W).price || 1) * 100) / 100
  },
  eco2Totals: {
    dropsRecorded: Object.values(drops).reduce((a, b) => a + b, 0),
    productionRecorded: Object.values(production).reduce((a, b) => a + b, 0),
    consumptionRecorded: Object.values(consumption).reduce((a, b) => a + b, 0),
    purchasesRecorded: Object.values(purchases).reduce((a, b) => a + b, 0),
    sectSurplusSalesRecorded: Object.values(sectSurplusSales).reduce((a, b) => a + b, 0),
    memberBuyRecorded: Object.values(memberTrades.buy).reduce((a, b) => a + b, 0),
    memberSellRecorded: Object.values(memberTrades.sell).reduce((a, b) => a + b, 0) + Object.values(memberTrades.sellPill).reduce((a, b) => a + b, 0),
    finalStockUnits: Object.values(finalEco2Stock).reduce((a, b) => a + b, 0)
  },
  eco2Details: {
    drops,
    production,
    consumption,
    purchases,
    sectSurplusSales,
    memberTrades,
    finalEco2Stock
  },
  monthlySnapshots
};

console.log('=== SIMULATION SUMMARY ===');
console.log(JSON.stringify({
  status: summary.status,
  days: summary.days,
  seed: summary.seed,
  ticks: summary.ticks,
  elapsedMs: summary.elapsedMs,
  population: summary.population,
  sectStones: summary.sectStones,
  cpStats: summary.cpStats,
  eco2Totals: summary.eco2Totals
}, null, 2));

if (outputFile) {
  try {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2) + '\n');
    console.log(`Detailed metrics written to ${outputFile}`);
  } catch (err) {
    console.error('Failed to write output file:', err);
  }
}
