'use strict';
const path = require('path');
const fs = require('fs');

const snapshotRoot = path.join(__dirname, 'snapshot/JianghuSect_v1.10');
const G = require(path.join(snapshotRoot, 'test/load.js'));
const { JD, CULT, EXPED, EXPLORE, CONTENT, SIM } = G;

console.log('=== MAPPING ACQUISITION ROUTES FOR ALL 370 TECHNIQUES & MANTRAS ===');

const acquisitionMap = {};

// Initialize for all 370 IDs
JD.TECH.techniques.forEach(t => { acquisitionMap[t.id] = new Set(); });
JD.TECH.mantras.forEach(m => { acquisitionMap[m.id] = new Set(); });

// 1. Starter Sect Library
const sampleW = SIM.create('sample-acq');
(sampleW.sect.library || []).forEach(id => {
  if (acquisitionMap[id]) acquisitionMap[id].add('starter_sect_library');
});

// 2. Martial Curriculum (Bootstrap Fundamentals)
if (JD.MARTIAL && JD.MARTIAL.curriculum) {
  JD.MARTIAL.curriculum.forEach(t => {
    if (acquisitionMap[t.id]) acquisitionMap[t.id].add('martial_curriculum_bootstrap');
  });
}

// 3. Rare Martial Techniques
if (JD.MARTIAL && JD.MARTIAL.techniques) {
  JD.MARTIAL.techniques.forEach(t => {
    if (acquisitionMap[t.id]) acquisitionMap[t.id].add('martial_rare_curriculum');
  });
}

// 4. Expansion Techniques
if (JD.EXPANSION && JD.EXPANSION.techniques) {
  JD.EXPANSION.techniques.forEach(t => {
    if (acquisitionMap[t.id]) acquisitionMap[t.id].add('expansion_curriculum');
  });
}

// 5. Content Regions
if (CONTENT && CONTENT.regions) {
  CONTENT.regions.forEach(r => {
    (r.techniques || []).forEach(id => {
      if (acquisitionMap[id]) acquisitionMap[id].add(`content_region:${r.id}`);
    });
  });
}

// 6. Fortune Registry (Expeditions)
if (EXPED && EXPED.FORTUNE_REGISTRY) {
  Object.entries(EXPED.FORTUNE_REGISTRY).forEach(([rank, sites]) => {
    sites.forEach(s => {
      (s.pools || []).forEach(p => {
        (p.loot || []).forEach(l => {
          if (l.kind === 'tech' && l.techId && acquisitionMap[l.techId]) {
            acquisitionMap[l.techId].add(`expedition_fortune:r${rank}_${p.id}`);
          }
          if (l.kind === 'manual' && l.techId && acquisitionMap[l.techId]) {
            acquisitionMap[l.techId].add(`expedition_fortune_manual:r${rank}_${p.id}`);
          }
        });
      });
    });
  });
}

// 7. Myriad Worlds (Explore)
if (EXPLORE && EXPLORE.WORLDS) {
  EXPLORE.WORLDS.forEach(w => {
    Object.entries(w.areas || {}).forEach(([rank, ar]) => {
      (ar.subpools || []).forEach(sp => {
        (sp.loot || []).forEach(l => {
          if (typeof l === 'string') {
            if (acquisitionMap[l]) acquisitionMap[l].add(`myriad_world:${w.id}_r${rank}_${sp.id}`);
            // Check if stripped prefix matches
            const stripped = l.replace(/^(TECH_|M_|MANUAL_)/, '');
            if (acquisitionMap[stripped]) acquisitionMap[stripped].add(`myriad_world:${w.id}_r${rank}_${sp.id}`);
          }
        });
      });
    });
  });
}

// 8. Knowledge Discovery Pool (M.rollDiscovery)
// M.rollDiscovery filters: (reqTier || tier) <= tier && !t.martialBootstrap && !/MANTRA|FORBIDDEN/.test(t.cat)
JD.TECH.techniques.forEach(t => {
  if (!t.martialBootstrap && !/MANTRA|FORBIDDEN/.test(t.cat)) {
    acquisitionMap[t.id].add('martial_roll_discovery_pool');
  }
});

// 9. Cultivation Mantra Pool (CULT.mantraPool)
Object.keys(CULT.PATHS).forEach(pathKey => {
  const pool = CULT.mantraPool(pathKey);
  pool.forEach(m => {
    if (acquisitionMap[m.id]) acquisitionMap[m.id].add(`cultivation_mantra_pool:${pathKey}`);
  });
});

// Summarize acquisition coverage
let zeroAcquisitionCount = 0;
const zeroAcquisitionList = [];
for (const [id, routes] of Object.entries(acquisitionMap)) {
  if (routes.size === 0) {
    zeroAcquisitionCount++;
    zeroAcquisitionList.push(id);
  }
}

console.log('Techniques/Mantras with 0 explicit acquisition routes:', zeroAcquisitionCount);
if (zeroAcquisitionCount > 0) {
  console.log('Sample unreachable entries:', zeroAcquisitionList.slice(0, 15));
}

const formattedAcq = {};
for (const [id, routes] of Object.entries(acquisitionMap)) {
  formattedAcq[id] = Array.from(routes);
}

fs.writeFileSync(path.join(__dirname, 'ACQUISITION_MAP.json'), JSON.stringify(formattedAcq, null, 2) + '\n');
console.log('Wrote ACQUISITION_MAP.json');
