'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../GAME_SOURCE/JianghuSect_v1.10');
global.window = global;
global.JD = {};
for (const f of ['core','cult','items','bt','cb','cp','tech','beasts','expansion','martial','ecology']) require(path.join(root, 'data/data_' + f + '.js'));
for (const f of ['util','human_core','world_map','cultivation','economy','sect','ai','combat','expedition','explore','bottleneck','skills','stats','cpeco','external_market','content','martial','proficiency','knowledge','retraining','cognition','wildlife','wild_resources','sim','visitors_clues']) require(path.join(root, 'js/' + f + '.js'));
const rows = [];
const elementTags = new Map();
const idOccurrences = new Map();
function collectEffectKeys(x, out = new Set(), depth = 0) {
  if (!x || typeof x !== 'object' || depth > 5) return [...out];
  if (Array.isArray(x)) { for (const v of x) collectEffectKeys(v, out, depth + 1); return [...out]; }
  for (const [k,v] of Object.entries(x)) {
    if (/effect|fx|passive|modifier|bonus|proc/i.test(k)) {
      if (v && typeof v === 'object') {
        if (!Array.isArray(v)) for (const kk of Object.keys(v)) out.add(kk);
        else for (const item of v) if (item && typeof item === 'object') for (const kk of Object.keys(item)) out.add(kk);
      }
    }
    if (v && typeof v === 'object') collectEffectKeys(v, out, depth + 1);
  }
  return [...out].sort();
}
function add(registry, sourceFile, kind, rec, fallbackId) {
  if (!rec || typeof rec !== 'object') return;
  const id = rec.id || rec.code || fallbackId;
  if (!id) return;
  const rawElementFields = {};
  for (const k of ['element','elements','elementTags','elementTag','affinity','affinities']) {
    if (rec[k] !== undefined && rec[k] !== null) {
      rawElementFields[k] = rec[k];
      const vals = Array.isArray(rec[k]) ? rec[k] : [rec[k]];
      for (const val of vals) {
        const tag = typeof val === 'string' ? val : JSON.stringify(val);
        elementTags.set(tag, (elementTags.get(tag) || 0) + 1);
      }
    }
  }
  const row = {
    sourceRegistry: registry,
    sourceFile,
    recordType: kind,
    id: String(id),
    nameTh: rec.nameTh || rec.name || rec.labelTh || rec.code || String(id),
    category: rec.category || rec.cat || rec.kind || rec.role || null,
    path: rec.path || null,
    sub: rec.sub || rec.subpath || rec.subPath || null,
    tier: rec.tier ?? rec.reqTier ?? null,
    grade: rec.grade || null,
    rarity: rec.rarity || null,
    legendary: !!(rec.legendary || rec.overhaulLegendary || rec.grade === 'Legendary' || rec.rarity === 'Legendary'),
    slot: rec.slot || null,
    gearType: rec.gearType || null,
    weaponTypes: rec.weaponTypes || null,
    armorTypes: rec.armorTypes || null,
    requiresWeapon: rec.requiresWeapon ?? null,
    rawElementFields,
    fxKind: rec.fxKind || null,
    effectId: rec.effectId || (rec.effect && rec.effect.effectId) || null,
    effectKeys: collectEffectKeys({fx:rec.fx,effects:rec.effects,effect:rec.effect,passive:rec.passive,modifiers:rec.modifiers,bonus:rec.bonus}),
    description: rec.descTh || rec.effectTh || rec.summary || null
  };
  rows.push(row);
  idOccurrences.set(row.id, (idOccurrences.get(row.id) || 0) + 1);
}
function addArray(registry, sourceFile, kind, arr) { if (Array.isArray(arr)) arr.forEach(r => add(registry, sourceFile, kind, r)); }
function addObject(registry, sourceFile, kind, obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const [k,v] of Object.entries(obj)) add(registry, sourceFile, kind, v, k);
}
const JD = global.JD;
// Core identity, root grades, constitutions and trait registries.
for (const k of ['personality14','values8','aptitudes6','rootGrades','constitutions','archetypes','extraTraits','procTraits']) addArray('JD.CORE.'+k,'data/data_core.js',k,JD.CORE[k]);
addObject('JD.CORE.curatedTraits','data/data_core.js','curatedTrait',JD.CORE.curatedTraits);
addArray('JD.CORE.elementList20','data/data_core.js','elementTraitSeed',JD.CORE.elementList20);
// Cultivation paths and subpaths.
for (const [pid,p] of Object.entries(JD.CULT.paths || {})) {
  add('JD.CULT.paths','data/data_cult.js','cultivationPath',p,pid);
  addArray('JD.CULT.paths.'+pid+'.subPaths','data/data_cult.js','cultivationSubpath',p.subPaths);
}
addArray('JD.CULT.pills','data/data_cult.js','cultivationPill',JD.CULT.pills);
addArray('JD.CULT.craftPaths','data/data_cult.js','craftPath',JD.CULT.craftPaths);
// Techniques and mantras.
addArray('JD.TECH.techniques','data/data_tech.js','technique',JD.TECH.techniques);
addArray('JD.TECH.mantras','data/data_tech.js','mantra',JD.TECH.mantras);
// Items and crafting.
for (const k of ['materials','items','recipes']) addArray('JD.ITEMS.'+k,'data/data_items.js',k,JD.ITEMS[k]);
// Martial-specific systems and all unique content families.
for (const k of ['items','recipes','techniques','curriculum','overhaulPassives','legendaryTechniques','legendaryMantras','SYNERGIES','innateTechniques']) addArray('JD.MARTIAL.'+k,'data/data_martial.js',k,JD.MARTIAL[k]);
// Expansion registries.
for (const k of ['nativeMajorSubPaths','subPaths','materials','recipes','techniques','regions','beasts','rareOrgans','experiments','factions']) addArray('JD.EXPANSION.'+k,'data/data_expansion.js',k,JD.EXPANSION[k]);
// Ecology / beasts / consumable / breakthrough registries.
for (const k of ['species','kings']) addArray('JD.BEASTS.'+k,'data/data_beasts.js',k,JD.BEASTS[k]);
for (const k of ['species','materials','recipes','items']) addArray('JD.ECOLOGY.'+k,'data/data_ecology.js',k,JD.ECOLOGY[k]);
addArray('JD.BT.PILL_RECIPES','data/data_bt.js','breakthroughRecipe',JD.BT.PILL_RECIPES);
addObject('JD.BT.TREASURES','data/data_bt.js','breakthroughTreasure',JD.BT.TREASURES);
addArray('JD.CB.RECIPES','data/data_cb.js','combatConsumableRecipe',JD.CB.RECIPES);
addArray('JD.CP.BASIC','data/data_cp.js','basicPillRecipe',JD.CP.BASIC);
addObject('JD.CP.RECOVERY','data/data_cp.js','recoveryPill',JD.CP.RECOVERY);
// Runtime-registered unique legendary weapons and Edit Hub's actual descriptor catalog.
addArray('VC.LEGENDARY_WEAPONS','js/visitors_clues.js','legendaryWeapon',global.VC.LEGENDARY_WEAPONS);
let editHubCatalog = [];
try { editHubCatalog = global.SECT.EDITOR.catalog({},{}); } catch (e) {}
addArray('SECT.EDITOR.catalog','js/sect.js','editHubCatalogDescriptor',editHubCatalog);
const uniqueIds = new Set(rows.map(r => r.id));
const tagRows = [...elementTags.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([tag,count])=>({tag,fieldOccurrences:count}));
const byRegistry = {};
for (const r of rows) byRegistry[r.sourceRegistry] = (byRegistry[r.sourceRegistry] || 0) + 1;
const summary = {
  generatedAt: '2026-10-31',
  baseline: 'JianghuSect main-1 v1.12.4 Small Logic Hotfix',
  sourceRoot: 'GAME_SOURCE/JianghuSect_v1.10/',
  recordOccurrences: rows.length,
  uniqueIdsAcrossAllRegistries: uniqueIds.size,
  duplicateIdOccurrencesBeyondFirst: rows.length - uniqueIds.size,
  recordsByRegistry: byRegistry,
  elementalAffinityKeys: JD.CORE.affinityKeys.ELEMENT,
  nonElementalAffinityKeys: [...JD.CORE.affinityKeys.CRAFT,...JD.CORE.affinityKeys.MARTIAL],
  totalAffinityKeys: [...JD.CORE.affinityKeys.CRAFT,...JD.CORE.affinityKeys.MARTIAL,...JD.CORE.affinityKeys.ELEMENT].length,
  coreElementIds: JD.CORE.affinityKeys.ELEMENT,
  specialElements: ['ASTRAL','BLOOD_DEMON'],
  runtimeSkillElementIds: global.SK ? Object.keys(global.SK.ELEM) : [],
  rootGrades: JD.CORE.rootGrades,
  curatedTraitCount: Object.keys(JD.CORE.curatedTraits).length,
  extraTraitCount: JD.CORE.extraTraits.length,
  procTraitCount: JD.CORE.procTraits.length,
  legendaryWeaponCount: global.VC.LEGENDARY_WEAPONS.length,
  legendaryTechniqueCount: JD.TECH.techniques.filter(x=>x.legendary || x.grade==='Legendary' || String(x.id).startsWith('LEG_')).length,
  legendaryMantraCount: JD.TECH.mantras.filter(x=>x.legendary || x.grade==='Legendary' || String(x.id).startsWith('LEG_')).length,
  editHubCatalogCount: editHubCatalog.length,
  editHubLegendaryManualCount: editHubCatalog.filter(x=>x.grade==='Legendary' || String(x.id).startsWith('LEG_')).length,
  editHubLegendaryWeaponCount: editHubCatalog.filter(x=>global.VC.LEGENDARY_WEAPON_BY_ID[x.id]).length,
  editHubFirst60LegendaryManualCount: editHubCatalog.slice(0,60).filter(x=>x.grade==='Legendary' || String(x.id).startsWith('LEG_')).length,
  editHubSearchLegendaryCount: global.SECT.EDITOR.catalog({}, {search:'Legendary'}).length,
  editHubSearchLegIdCount: global.SECT.EDITOR.catalog({}, {search:'LEG_'}).length,
  rawElementTagOccurrences: tagRows,
  note: 'This is a source-derived inventory and raw-tag extraction, not the final semantic classification. Gemini must classify every occurrence as intrinsic, weighted multi-element, link-only, special, explicit non-elemental, or unknown requiring review.'
};
const out = {summary, records: rows};
fs.writeFileSync(path.join(__dirname,'CONTENT_AUDIT_MANIFEST.json'), JSON.stringify(out,null,2));
fs.writeFileSync(path.join(__dirname,'CONTENT_AUDIT_TAGS.json'), JSON.stringify(tagRows,null,2));
console.log(JSON.stringify(summary,null,2));
