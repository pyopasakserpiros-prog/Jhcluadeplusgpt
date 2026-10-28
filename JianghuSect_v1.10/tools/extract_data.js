/* Extract a trimmed, game-ready data set from the Jianghu Universal Game Data Pack.
 * Usage: node tools/extract_data.js <path-to-unzipped-pack-root>
 * Output: data/*.js  (classic scripts that populate globalThis.JD) */
'use strict';
const fs = require('fs'), path = require('path');
const root = process.argv[2] || '/home/claude/pack_src/Jianghu_Universal_Game_Data_Pack_v1';
const core = path.join(root, '01_CORE_GAME_DATA');
const out = path.join(__dirname, '..', 'data');
const req = f => require(path.join(core, f));

function emit(file, key, obj, note) {
  const body = `/* ${note} — สกัดจาก Jianghu Universal Game Data Pack v1 (Jianghu Cloud Sea v1.22.2) */\n(function(g){g.JD=g.JD||{};g.JD.${key}=${JSON.stringify(obj)};})(typeof globalThis!=='undefined'?globalThis:this);\n`;
  fs.writeFileSync(path.join(out, file), body);
  console.log(file, (body.length / 1024).toFixed(1) + ' KB');
}

// ---------- CORE (NPC foundation) ----------
const nc = req('jianghu_npc_core_data.js');
const cult = req('jianghu_cultivation_data.js');
const curatedNames = {};
cult.CURATED_TRAITS.forEach(t => curatedNames[t.id] = t);
const curated = {};
Object.keys(nc.CURATED_TRAIT_RULES).forEach(id => {
  const r = nc.CURATED_TRAIT_RULES[id];
  const meta = curatedNames[id] || {};
  curated[id] = { id, nameTh: meta.nameTh || id, category: meta.category || r.originType, tier: meta.tier || 3, isCurse: !!meta.isCurse, descTh: meta.descTh || '', conflictsWith: r.conflictsWith || [], maxLevel: r.maxLevel || 1, modifiers: r.modifiers, behaviorMods: r.behaviorMods || null };
});
const extra = nc.EXTRA_CORE_TRAITS.map(t => ({ id: t.id, nameTh: t.nameTh, category: t.category, tier: t.tier, isCurse: !!t.isCurse, descTh: t.descTh, conflictsWith: t.conflictsWith, maxLevel: t.maxLevel, modifiers: t.modifiers, behaviorMods: t.behaviorMods || null }));
const procCat = cult.TRAITS_CATALOG.filter(t => /^TR_GEN_/.test(t.id)).map(t => ({ id: t.id, nameTh: t.nameTh, category: t.category, tier: t.tier, isCurse: !!t.isCurse, prefixIndex: t.prefixIndex, elementIndex: t.elementIndex }));
emit('data_core.js', 'CORE', {
  schema: nc.NPC_CORE_SCHEMA_VERSION,
  personality14: nc.PERSONALITY_AXES_14.map(a => ({ id: a.id, nameTh: a.nameTh, group: a.group, def: a.defaultVal, descTh: a.descTh })),
  values8: nc.VALUE_DIMENSIONS_8.map(a => ({ id: a.id, nameTh: a.nameTh, def: a.defaultVal, descTh: a.descTh })),
  aptitudes6: nc.APTITUDE_DOMAINS_6.map(a => ({ id: a.id, nameTh: a.nameTh, def: a.defaultVal, descTh: a.descTh })),
  affinityKeys: nc.AFFINITY_KEYS,
  rootGrades: nc.SPIRIT_ROOT_GRADES_5,
  constitutions: nc.CONSTITUTION_REGISTRY_12,
  archetypes: nc.JIANGHU_ARCHETYPES_10,
  curatedTraits: curated,
  extraTraits: extra,
  procTraits: procCat,
  elementList20: nc.PROCEDURAL_ELEMENT_LIST_20,
  prefixGroups18: nc.PROCEDURAL_PREFIX_GROUPS_18
}, 'NPC core foundation');

// ---------- CULTIVATION ----------
const base = JSON.parse(fs.readFileSync(path.join(root, '02_SYSTEM_REFERENCE', 'CURRENT_CULTIVATION_BASELINE.json'), 'utf8'));
const paths = {};
Object.keys(base.paths).forEach(k => {
  const p = base.paths[k];
  paths[k] = {
    id: p.id, nameTh: p.nameTh, shortTh: p.shortTh, icon: p.icon, color: p.color, maxStage: p.maxStage,
    resourceUsed: p.resourceUsed, coreMechanicTh: p.coreMechanicTh, supremeRiskTh: p.supremeRiskTh,
    stages: p.stages.map(s => ({ stage: s.stage, nameTh: s.nameTh, lifespanMax: s.lifespanMax, combatPower: s.combatPower, breakthroughBaseChance: s.breakthroughBaseChance, tribulationLayers: s.tribulationLayers, resourceReq: s.resourceReq })),
    subPaths: Object.values(p.subPaths).map(s => ({ id: s.id, nameTh: s.nameTh, resourceTh: s.resourceTh, strengthTh: s.strengthTh, weaknessTh: s.weaknessTh, combatBonus: s.combatBonus, defenseBonus: s.defenseBonus, breakthroughMod: s.breakthroughMod }))
  };
});
const p140 = req('jianghu_patch140_data.js');
emit('data_cult.js', 'CULT', { paths, pills: cult.PILLS_CATALOG, craftPaths: p140.CRAFT_PATHS_5.map(c => ({ id: c.id, nameTh: c.nameTh, icon: c.icon, minMasteryByTier: c.minMasteryByTier })), currencyTh: p140.CURRENCY_NAME_TH }, 'Cultivation paths/stages');

// ---------- ITEMS ----------
const it = req('jianghu_items190_data.js');
const mats = p140.MATERIALS_REGISTRY_V140.map(m => ({ id: m.id, nameTh: m.nameTh, category: m.category, tier: m.tier, craft: m.primaryCraftPath, terrain: m.terrain, value: m.baseValueStones, anatomy: m.anatomyType || null, relic: !!m.isTranscendent }));
const items = it.NEW_ITEMS_72.map(x => ({ id: x.id, recipeId: x.recipeId, nameTh: x.nameTh, cat: x.itemCategory, out: x.outputType, slot: x.slot, tier: x.tier, element: x.element, value: x.baseValueStones, craft: x.craftPath, minStage: x.minStageReq, durability: x.durability, charges: x.consumableCharges, effects: (x.effectBindings || []).map(e => ({ effectId: e.effectId, params: e.parameters })) }));
const recipes = [];
p140.STARTER_RECIPES_V140.forEach(r => recipes.push({ id: r.id, nameTh: r.nameTh, craft: r.craftPath, tier: r.tier, minMastery: r.minMastery, days: r.durationDays, inputs: r.inputs, outType: r.outputType, outNameTh: r.outputNameTh, effect: r.effect, descTh: r.descTh, starter: true }));
it.NEW_ITEM_RECIPES_72.forEach(r => recipes.push({ id: r.id, nameTh: r.nameTh, craft: r.craftPath, tier: r.tier, minMastery: r.minMastery, days: r.durationDays, inputs: r.inputs, outType: r.outputType, outItemId: r.outputItemId, outNameTh: r.outputNameTh, yield: r.yieldCount || 1, effect: r.effect }));
// materials referenced by recipes but absent from registry (formation parts etc.) – keep placeholder names so nothing is undefined
const known = new Set(mats.map(m => m.id));
const missing = new Set();
recipes.forEach(r => r.inputs.forEach(i => { if (!known.has(i.matId)) missing.add(i.matId); }));
const MAT_TH = { MAT_HERB_ANCIENT_MIST_FERN_3: 'เฟิร์นหมอกโบราณ', MAT_ORE_THUNDER_SCORCH_COPPER_3: 'ทองแดงอสนีไหม้', MAT_HERB_MERIDIAN_FLOWER_3: 'ดอกบานเปิดชีพจร', MAT_ORE_THUNDER_JADE_4: 'หยกอสนีคราม', MAT_ORE_QUICKSAND_SPIRIT_GOLD_4: 'ทองวิญญาณทรายดูด' };
const FORM_TH = { SPIRIT_INK_SAND: 'ทรายหมึกวิญญาณ', ARRAY_CORE_basic: 'แกนค่ายกลพื้นฐาน', BLANK_ARRAY_FLAG: 'ธงค่ายกลเปล่า', BLOOD_FIEND_CRYSTAL: 'ผลึกอสูรโลหิต', EARTH_ARRAY_CORE: 'แกนค่ายกลปฐพี', LIGHTNING_CRYSTAL: 'ผลึกอสนี', EARTH_FLAME_CORE: 'แกนเพลิงพิภพ', SOUL_WOOD_PILLAR: 'เสาไม้วิญญาณ', FAITH_INCENSE_PEARL: 'ไข่มุกธูปศรัทธา', SKY_LEVITATION_CORE: 'แกนลอยฟ้า', SWORD_TALISMAN: 'ยันต์กระบี่', YIN_CRYSTAL: 'ผลึกหยิน' };
missing.forEach(id => {
  const m = id.match(/^MAT_([A-Z]+)_(.+)_(\d)$/);
  const tier = m ? +m[3] : 2;
  const key = m ? m[2] : id;
  const th = MAT_TH[id] || FORM_TH[key] || key.replace(/_/g, ' ');
  mats.push({ id, nameTh: th, category: m && m[1] === 'FORM' ? 'FORMATION_PART' : (m ? m[1] : 'MISC'), tier, craft: 'ARRAY', terrain: 'mountain', value: Math.round(6 * Math.pow(1.7, tier)), anatomy: null, relic: false, derived: true });
});
emit('data_items.js', 'ITEMS', { materials: mats, items, recipes }, 'Items, materials, recipes');

// ---------- TECHNIQUES ----------
const tq = req('jianghu_techniques190_data.js');
const techs = tq.NEW_TECHNIQUES_240.map(t => ({ id: t.id, nameTh: t.nameTh, cat: t.category, role: t.roleGroup, path: t.path, sub: t.subPath, tier: t.tier, reqTier: t.requiredNormalizedTier, element: t.element, power: t.power, moves: (t.moves || []).slice(0, 3) }));
const mantras = cult.MARTIAL_ARTS_CATALOG.map(t => ({ id: t.id, nameTh: t.nameTh, cat: t.category, path: t.path, tier: t.tier, element: t.element, power: t.power, moves: (t.moves || []).slice(0, 2) }));
emit('data_tech.js', 'TECH', { techniques: techs, mantras }, 'Techniques');

// ---------- BEASTS ----------
const bd = req('jianghu_beast_abilities190_data.js');
const p140b = {}; p140.BEAST_SPECIES_V140.forEach(b => p140b[b.id] = b);
const beasts = bd.BEAST_PROFILES_20.map(b => ({ id: b.speciesId, nameTh: b.nameTh, tier: b.tier, cp: b.combatPower, flee: b.wildBehaviorPolicy && b.wildBehaviorPolicy.fleeBelowHealthPct, aggro: b.wildBehaviorPolicy && b.wildBehaviorPolicy.territorialAggression, drops: (b.partDrops || []).map(d => d.matId), terrain: (p140b[b.speciesId] || {}).terrain || 'forest' }));
emit('data_beasts.js', 'BEASTS', { species: beasts, kings: p140.BEAST_KINGS_V140.map(k => ({ id: k.id, nameTh: k.nameTh, species: k.speciesId, tier: k.tier, cp: k.combatPower, drops: k.guaranteedDrops })) }, 'Beasts');
console.log('materials missing placeholders:', [...missing].length);
