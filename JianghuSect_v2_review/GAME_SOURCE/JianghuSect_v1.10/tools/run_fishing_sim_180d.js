'use strict';
/**
 * 3x180-Day Parallel Natural Simulation & Telemetry Runner for Southern River, Fishing,
 * Mysterious Containers, Fish Utilization, and NPC Economy/Cognition Integration.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const g = require('../test/load.js');
const { SIM, ECO, VC, FISHING } = g;

const SEEDS = ['fishing-natural-seed-1', 'fishing-natural-seed-2', 'fishing-natural-seed-3'];
const DAYS = 180;
const TICKS_PER_DAY = 1440;

if (process.argv[2] === '--worker') {
  const seed = process.argv[3];
  const t0 = Date.now();
  const W = SIM.create(seed);
  const startDay = W.day;
  let dutyTicks = 0, practiceTicks = 0, craftTicks = 0, fishTicks = 0, sleepTicks = 0, eatTicks = 0;

  for (let d = 0; d < DAYS; d++) {
    for (let m = 0; m < TICKS_PER_DAY; m++) {
      SIM.tick(W);
      if (m % 60 === 0) {
        for (const n of W.npcs) {
          if (!n || n.dead || n.away) continue;
          const aid = n.act && n.act.id;
          if (aid === 'duty') dutyTicks++;
          else if (aid === 'practice' || aid === 'cultivate' || aid === 'meditate') practiceTicks++;
          else if (aid === 'brew' || aid === 'forge' || aid === 'cook' || aid === 'farm' || aid === 'mine') craftTicks++;
          else if (aid === 'riverFish' || (aid === 'leisure' && n.act.ctx && n.act.ctx.mode === 'fish')) fishTicks++;
          else if (aid === 'sleep') sleepTicks++;
          else if (aid === 'eat') eatTicks++;
        }
      }
    }
  }

  const wallSec = +((Date.now() - t0) / 1000).toFixed(2);
  const alive = W.npcs.filter(n => !n.dead && !n.exiled);
  const uniqueAudit = VC.auditUniqueWeaponInvariant(W);
  const f = W.fishing;

  const runRecord = {
    seed,
    startDay,
    endDay: W.day,
    wallTimeSec: wallSec,
    livingNpcs: alive.length,
    deaths: W.deaths || 0,
    avgSatiety: +((alive.reduce((s, n) => s + n.h.state.satiety, 0) / Math.max(1, alive.length)).toFixed(2)),
    avgMood: +((alive.reduce((s, n) => s + n.h.state.mood, 0) / Math.max(1, alive.length)).toFixed(2)),
    sectStones: Math.round(W.sect.stones),
    sectMeals: ECO.count(W, 'meal'),
    sectGrain: ECO.count(W, 'grain'),
    hourlySampleActivityShare: {
      dutySamples: dutyTicks,
      practiceCultivateSamples: practiceTicks,
      productionSamples: craftTicks,
      fishingSamples: fishTicks,
      sleepSamples: sleepTicks,
      eatSamples: eatTicks
    },
    fishingStats: Object.assign({}, f.stats),
    finalZoneStocks: Object.fromEntries(Object.entries(f.zones).map(([k, z]) => [k, { stock: z.stock, maxStock: z.maxStock, totalCaught: z.totalCaught }])),
    uniqueArtifactAuditOk: uniqueAudit.ok,
    uniqueArtifactsCount: Object.keys(uniqueAudit.counts).length
  };
  process.stdout.write(JSON.stringify(runRecord) + '\n');
  process.exit(0);
}

(async () => {
  console.log('Running 3x180-day parallel natural simulations...');
  const _unused = (seed => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [__filename, '--worker', seed], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.on('close', code => {
      if (code !== 0) return reject(new Error(`Worker ${seed} failed (${code}): ${err}`));
      const lines = out.trim().split('\n');
      resolve(JSON.parse(lines[lines.length - 1]));
    });
  }));

  const runs = [];
  for (const seed of SEEDS) {
    const rec = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [__filename, "--worker", seed], { stdio: ["ignore", "pipe", "pipe"] });
      let out = "", err = "";
      child.stdout.on("data", d => { out += d; });
      child.stderr.on("data", d => { err += d; });
      child.on("close", code => {
        if (code !== 0) return reject(new Error("Worker " + seed + " failed (" + code + "): " + err));
        const lines = out.trim().split("\n");
        resolve(JSON.parse(lines[lines.length - 1]));
      });
    });
    runs.push(rec);
    console.log("Finished " + seed + " in " + rec.wallTimeSec + "s");
  }
  runs.forEach(r => {
    const f = r.fishingStats;
    console.log(`[SIM 180d] ${r.seed}: wall=${r.wallTimeSec}s, alive=${r.livingNpcs}, catches=${f.successfulCatches} (fish=${f.fishCaught}, boxes=${f.containersCaught}), opened=${f.containersOpened} (trash=${f.trashOpened}, ord=${f.ordinaryOpened}, leg=${f.legendaryOpened}), mealsFromFish=${f.fishCookedMeals}, dishes=${f.fishDishesCooked}, eaten=${f.fishDishesEaten}, donated=${f.fishDonated}, uniqueOk=${r.uniqueArtifactAuditOk}`);
  });

  const summary = {
    version: FISHING.VERSION,
    daysPerRun: DAYS,
    ticksPerRun: DAYS * TICKS_PER_DAY,
    runs
  };

  const outPath = path.join(__dirname, '..', 'test', 'results', 'fishing_river_180d_3seeds.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));

  const catalogAndProbs = {
    generatedAt: new Date().toISOString(),
    version: FISHING.VERSION,
    mapDimensions: { width: g.MAP.W, height: g.MAP.H, baseHeightBeforeExtension: g.MAP.H_BASE, exit: g.MAP.EXIT },
    zones: FISHING.ZONES,
    fishSpeciesCatalog: FISHING.SPECIES,
    specialItems: FISHING.SPECIAL_ITEMS,
    fishDishesCatalog: FISHING.FISH_DISHES,
    fishAlchemyRecipes: FISHING.ALCHEMY_FISH_RECIPES,
    probabilityTables: FISHING.getFullProbabilitySpec(),
    naturalSimulations180d: summary
  };
  const docJsonPath = path.join(__dirname, '..', 'docs', 'FISHING_LOOT_CATALOG_AND_PROBABILITIES.json');
  fs.writeFileSync(docJsonPath, JSON.stringify(catalogAndProbs, null, 2));
  console.log('Saved telemetry and probability catalog to:', outPath, 'and', docJsonPath);
})();
