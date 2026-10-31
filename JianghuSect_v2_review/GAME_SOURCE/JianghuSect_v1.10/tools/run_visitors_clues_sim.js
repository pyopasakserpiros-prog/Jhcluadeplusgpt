'use strict';
const fs = require('fs');
const path = require('path');
const g = require('../test/load.js');

const ROOT = path.resolve(__dirname, '..');

function buildCatalogJson() {
  const weapons = g.VC.LEGENDARY_WEAPONS.map(w => ({
    id: w.id,
    nameTh: w.nameTh,
    chineseName: w.chineseName,
    provenanceType: w.provenanceType,
    literarySource: w.literarySource,
    gearType: w.gearType,
    visualSubtype: w.visualSubtype,
    visualKey: w.visualKey,
    presentationMode: w.presentationMode,
    tier: w.tier,
    minStage: w.minStage,
    reqStrength: w.reqStrength || 0,
    compatiblePath: w.compatiblePath,
    preferredSubs: w.preferredSubs,
    fixedStats: w.fixedStats,
    effects: w.effects,
    status: 'implemented'
  }));

  const clues = g.VC.CLUE_TEMPLATES.map(t => ({
    templateId: t.templateId,
    titleTh: t.titleTh,
    category: t.category,
    targetKind: t.targetKind,
    targetId: t.targetId,
    tier: t.tier,
    rarity: t.rarity,
    unique: !!t.unique,
    cooldownDays: t.cooldownDays || (t.unique ? null : 24),
    expiresAfterDays: t.expiresAfterDays || null,
    regionId: t.regionId,
    visitorRoles: t.visitorRoles,
    stepCount: t.steps.length,
    steps: t.steps.map((s, idx) => ({
      stepIndex: idx + 1,
      nodeId: s.nodeId,
      type: s.type,
      titleTh: s.titleTh,
      locationId: s.locationId,
      scope: s.scope || 'party_any',
      skill: s.skill || null,
      statPath: s.statPath || null,
      minVal: s.minVal || null,
      stoneCost: s.stoneCost || 0,
      guardianNameTh: s.guardianNameTh || null,
      guardianPower: s.guardianPower || null,
      onPass: s.onPass,
      onFail: s.onFail
    })),
    status: 'implemented'
  }));

  return {
    schemaVersion: '1.0.0',
    patchVersion: '1.12.1',
    generatedAt: new Date().toISOString(),
    counts: {
      totalClueTemplates: clues.length,
      ordinaryMaterialLeads: clues.filter(c => (c.category === 'ORDINARY_MATERIAL' || c.category === 'HERITAGE_MATERIAL')).length,
      ordinaryEquipmentLeads: clues.filter(c => c.category === 'ORDINARY_EQUIPMENT').length,
      ordinaryTechniqueLeads: clues.filter(c => (c.category === 'ORDINARY_TECHNIQUE' || c.category === 'ORDINARY_TECH')).length,
      legendaryArtLeads: clues.filter(c => c.category === 'LEGENDARY_ART').length,
      legendaryWeaponLeads: clues.filter(c => c.category === 'LEGENDARY_WEAPON').length,
      legendaryWeapons: weapons.length
    },
    legendaryWeapons: weapons,
    clueTemplates: clues
  };
}

function runSimulations() {
  const seeds = ['vc-180d-seed1', 'vc-180d-seed2', 'vc-180d-seed3'];
  const runs = [];

  for (const seed of seeds) {
    const t0 = Date.now();
    const W = g.SIM.create(seed);
    // Run 180 game days (180 * 1440 = 259,200 ticks)
    const totalDays = 180;
    let peakActiveGuests = 0;
    let memberCapViolations = 0;
    let guestInNpcsViolations = 0;

    for (let d = 0; d < totalDays; d++) {
      for (let m = 0; m < 1440; m++) {
        g.SIM.tick(W);
      }
      const ag = g.VC.activeGuests(W).length;
      if (ag > peakActiveGuests) peakActiveGuests = ag;
      if (W.npcs.some(n => n.kind === 'guest' || n.kind === 'visitor')) guestInNpcsViolations++;
      const cap = g.SECT.housingCapacity(W);
      const occ = g.SECT.memberOccupancy(W);
      if (occ > cap || occ > 100) memberCapViolations++;
    }

    const cs = g.VC.ensure(W);
    const elapsedMs = Date.now() - t0;
    runs.push({
      seed,
      daysSimulated: totalDays,
      elapsedMs,
      finalPopulation: W.npcs.filter(n => !n.dead && !n.exiled).length,
      housingCapacity: g.SECT.housingCapacity(W),
      peakActiveGuests,
      totalRegisteredGuests: Object.keys(W.world.guestRegistry || {}).length,
      visitorHistoryEntries: (W.world.visitorHistory || []).length,
      traderVisits: (W.world.marketStats && W.world.marketStats.visits) || 0,
      funnel: Object.assign({}, cs.funnel),
      activeCluesCount: Object.keys(cs.active || {}).length,
      claimedReceiptsCount: Object.keys(W.world.claimReceipts || {}).length,
      uniqueArtifactsClaimed: Object.keys(W.world.uniqueArtifacts || {}),
      invariants: {
        guestInNpcsViolations,
        memberCapViolations
      }
    });
    console.log(`Completed 180d run [${seed}] in ${elapsedMs}ms: guests=${Object.keys(W.world.guestRegistry || {}).length}, rumors=${cs.funnel.rumorsSpawned}, investigations=${cs.funnel.investigationsStarted}, claimed=${cs.funnel.rewardsClaimed}`);
  }

  const catalog = buildCatalogJson();
  const catPath = path.join(ROOT, 'docs/CLUE_SOURCE_CATALOG.json');
  fs.mkdirSync(path.dirname(catPath), { recursive: true });
  fs.writeFileSync(catPath, JSON.stringify(catalog, null, 2) + '\n');

  const outPath = path.join(ROOT, 'test/results/visitors_clues_180d.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    patchVersion: '1.12.1',
    catalogSummary: catalog.counts,
    naturalRuns180d: runs
  }, null, 2) + '\n');
  console.log('Wrote', catPath, 'and', outPath);
}

if (require.main === module) {
  runSimulations();
}
module.exports = { buildCatalogJson, runSimulations };
