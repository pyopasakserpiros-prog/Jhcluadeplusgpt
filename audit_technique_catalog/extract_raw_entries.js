'use strict';
const path = require('path');
const fs = require('fs');

const snapshotRoot = path.join(__dirname, 'snapshot/JianghuSect_v1.10');
const G = require(path.join(snapshotRoot, 'test/load.js'));
const { JD, CULT, SK, MARTIAL, EXPED, EXPLORE, CONTENT } = G;

console.log('=== EXTRACTING RAW CATALOG DATA ===');

const allEntries = [];

// 1. Process JD.TECH.techniques
JD.TECH.techniques.forEach((t, idx) => {
  allEntries.push({
    rawRegistry: 'techniques',
    rawIndex: idx,
    id: t.id,
    nameTh: t.nameTh,
    cat: t.cat,
    role: t.role,
    path: t.path,
    sub: t.sub || null,
    tier: t.tier,
    reqTier: t.reqTier != null ? t.reqTier : t.tier,
    element: t.element || 'NEUTRAL',
    power: t.power || 0,
    weaponTypes: t.weaponTypes || null,
    armorTypes: t.armorTypes || null,
    moves: t.moves || [],
    passive: t.passive || null,
    combatArch: t.combatArch || null,
    sourceCategory: t.sourceCategory || null,
    martialBootstrap: !!t.martialBootstrap,
    martialRare: !!t.martialRare
  });
});

// 2. Process JD.TECH.mantras
JD.TECH.mantras.forEach((m, idx) => {
  allEntries.push({
    rawRegistry: 'mantras',
    rawIndex: idx,
    id: m.id,
    nameTh: m.nameTh,
    cat: m.cat,
    role: m.role || 'CULTIVATION_MANUAL',
    path: m.path,
    sub: m.sub || null,
    tier: m.tier,
    reqTier: m.reqTier != null ? m.reqTier : m.tier,
    element: m.element || 'NEUTRAL',
    power: m.power || 0,
    weaponTypes: m.weaponTypes || null,
    armorTypes: m.armorTypes || null,
    moves: m.moves || [],
    passive: m.passive || null,
    combatArch: m.combatArch || null,
    sourceCategory: m.sourceCategory || null,
    martialBootstrap: false,
    martialRare: false
  });
});

console.log('Total extracted entries:', allEntries.length);

// Check if any ID is duplicated
const byId = new Map();
allEntries.forEach(e => {
  if (byId.has(e.id)) {
    console.error('DUPLICATE ID DETECTED:', e.id, byId.get(e.id), e);
  } else {
    byId.set(e.id, e);
  }
});

console.log('Unique ID count:', byId.size);

// Save raw extracted data
fs.writeFileSync(path.join(__dirname, 'raw_catalog_entries.json'), JSON.stringify(allEntries, null, 2) + '\n');
console.log('Wrote raw_catalog_entries.json');
