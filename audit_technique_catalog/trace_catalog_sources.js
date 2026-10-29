'use strict';
const path = require('path');
const fs = require('fs');

const snapshotRoot = path.join(__dirname, 'snapshot/JianghuSect_v1.10');

// Create a clean globalThis environment and trace each file loading
const g = {};
global.globalThis = g;
g.window = g;

console.log('=== STEP-BY-STEP TRACING OF CATALOG POPULATION ===');

function requireSnapshot(relPath) {
  const fullPath = path.join(snapshotRoot, relPath);
  delete require.cache[require.resolve(fullPath)];
  require(fullPath);
}

// 1. data_core
requireSnapshot('data/data_core.js');
console.log('After data_core: JD keys =', Object.keys(g.JD || {}));

// 2. data_cult
requireSnapshot('data/data_cult.js');
console.log('After data_cult: JD keys =', Object.keys(g.JD || {}));

// 3. data_items
requireSnapshot('data/data_items.js');

// 4. data_bt, data_cb, data_cp
requireSnapshot('data/data_bt.js');
requireSnapshot('data/data_cb.js');
requireSnapshot('data/data_cp.js');

// 5. data_tech
requireSnapshot('data/data_tech.js');
const baseTechCount = g.JD.TECH.techniques.length;
const baseMantraCount = g.JD.TECH.mantras.length;
console.log(`After data_tech.js: techniques = ${baseTechCount}, mantras = ${baseMantraCount}`);

// 6. data_beasts
requireSnapshot('data/data_beasts.js');

// 7. data_expansion
requireSnapshot('data/data_expansion.js');
const expTechCount = g.JD.TECH.techniques.length;
const expMantraCount = g.JD.TECH.mantras.length;
console.log(`After data_expansion.js: techniques = ${expTechCount} (diff: +${expTechCount - baseTechCount}), mantras = ${expMantraCount} (diff: +${expMantraCount - baseMantraCount})`);
if (g.JD.EXPANSION && g.JD.EXPANSION.techniques) {
  console.log(`g.JD.EXPANSION.techniques count: ${g.JD.EXPANSION.techniques.length}`);
}

// 8. data_martial
requireSnapshot('data/data_martial.js');
const martialTechCount = g.JD.TECH.techniques.length;
const martialMantraCount = g.JD.TECH.mantras.length;
console.log(`After data_martial.js: techniques = ${martialTechCount} (diff: +${martialTechCount - expTechCount}), mantras = ${martialMantraCount} (diff: +${martialMantraCount - expMantraCount})`);
if (g.JD.MARTIAL) {
  console.log('JD.MARTIAL curriculum count:', (g.JD.MARTIAL.curriculum || []).length);
  console.log('JD.MARTIAL techniques count:', (g.JD.MARTIAL.techniques || []).length);
}

// 9. data_ecology
requireSnapshot('data/data_ecology.js');
const ecoTechCount = g.JD.TECH.techniques.length;
const ecoMantraCount = g.JD.TECH.mantras.length;
console.log(`After data_ecology.js: techniques = ${ecoTechCount}, mantras = ${ecoMantraCount}`);

// Now load remaining JS files
const remaining = [
  'js/util.js','js/human_core.js','js/world_map.js','js/cultivation.js',
  'js/economy.js','js/sect.js','js/ai.js','js/combat.js','js/expedition.js',
  'js/explore.js','js/bottleneck.js','js/skills.js','js/stats.js','js/cpeco.js',
  'js/external_market.js','js/content.js','js/martial.js','js/proficiency.js',
  'js/knowledge.js','js/retraining.js','js/cognition.js','js/wildlife.js',
  'js/wild_resources.js','js/sim.js'
];

remaining.forEach(f => {
  const beforeT = g.JD.TECH.techniques.length;
  const beforeM = g.JD.TECH.mantras.length;
  requireSnapshot(f);
  const afterT = g.JD.TECH.techniques.length;
  const afterM = g.JD.TECH.mantras.length;
  if (afterT !== beforeT || afterM !== beforeM) {
    console.log(`File ${f} modified catalog! Tech: ${beforeT} -> ${afterT}, Mantras: ${beforeM} -> ${afterM}`);
  }
});

console.log('Final loaded techniques count:', g.JD.TECH.techniques.length);
console.log('Final loaded mantras count:', g.JD.TECH.mantras.length);

// Save source breakdown
const breakdown = {
  baseFromDataTech: { techniques: baseTechCount, mantras: baseMantraCount },
  fromDataExpansion: { techniques: expTechCount - baseTechCount, mantras: expMantraCount - baseMantraCount },
  fromDataMartial: { techniques: martialTechCount - expTechCount, mantras: martialMantraCount - expMantraCount },
  total: { techniques: g.JD.TECH.techniques.length, mantras: g.JD.TECH.mantras.length }
};

fs.writeFileSync(path.join(__dirname, 'CATALOG_SOURCES_BREAKDOWN.json'), JSON.stringify(breakdown, null, 2) + '\n');
console.log('Wrote CATALOG_SOURCES_BREAKDOWN.json');
console.log(JSON.stringify(breakdown, null, 2));
