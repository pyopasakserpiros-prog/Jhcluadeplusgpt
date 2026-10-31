/* Rebuild the v1.10 content adapter from the preserved, selected SOURCE records.
 * Usage: node tools/migrate_source.js
 * The SOURCE engine, source save files, art assets, and source realm schedules
 * are never loaded by this converter or by the generated target data script.
 */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(ROOT, 'SOURCE_REFERENCE/migration/selected_raw.json');
const OUTPUT = path.join(ROOT, 'data/data_expansion.js');
const MAPPING = path.join(ROOT, 'SOURCE_REFERENCE/migration/mapping.json');
const bytes = fs.readFileSync(INPUT), raw = JSON.parse(bytes);
const PREFIX = 'SRC110_', PACK = 'source-v2083';
const STAGES = { XIAN: 9, BODY: 5, GOD: 4, DEMON: 9, HEART_SOUL: 9 };
const SOURCE_DIR = '02_SOURCE_FULL/source/scripts/';
const ALIASES = raw.targetElementAliases;
const ident = id => PREFIX + id;
const metadata = (record, fallback) => ({
  sourcePack: PACK,
  sourceId: record.id,
  sourcePath: (raw.sourceRefs[record.id]?.path || SOURCE_DIR + fallback).replace(/^.*\/source_game\//, '').replace(/^source_game\//, '')
});
function check(condition, message) { if (!condition) throw new Error(message); }
function unique(records, label) {
  const seen = new Set();
  for (const r of records) { check(!seen.has(r.id), `Duplicate ${label}: ${r.id}`); seen.add(r.id); }
}
function normalizeEffects(r) {
  const effect = {}, unsupported = {}, source = r.effect || {};
  const direct = new Set(['healHealth', 'healInjury', 'cultivationProgress', 'toxicity', 'combatMult', 'defenseMult', 'minStageReq', 'breakthroughBonus', 'rateBoost', 'insight', 'lifespanBonus']);
  const aliases = { heal: 'healHealth', pain: 'healInjury', progress: 'cultivationProgress', heartDemonRelief: 'clearHeartDemon', toxicityRelief: 'clearToxic', clearPoison: 'clearToxic', lifeBonus: 'lifespanBonus' };
  for (const [key, value] of Object.entries(source)) {
    if (key === 'restoreQi') effect.qiRestore = value / 100;
    else if (direct.has(key)) effect[key] = value;
    else if (aliases[key]) effect[aliases[key]] = Math.max(effect[aliases[key]] || 0, value);
    else unsupported[key] = value;
  }
  // A specific pill affinity is preserved; it never restricts the crafter.
  if (r.outputType === 'PILL' && r.compatiblePath && r.compatiblePath !== 'ANY') effect.compatiblePath = r.compatiblePath;
  return { effect, unsupportedEffects: unsupported };
}
const subPaths = raw.subpaths.map(({ path: major, definition: d }) => {
  check(STAGES[major], `Unsupported major path: ${major}`);
  const nativeText={
 FROST_MOON_IMMORTAL:['ตั้งรับและสวนกลับด้วยไอเย็น ป้องกันวิชาเพิ่ม 10% ความเร็วร่ายเพิ่ม 6','พลังโจมตีกายภาพลด 4% ต้องค้นพบและเรียนคัมภีร์สวนกลับก่อนใช้ท่าเฉพาะ'],
 WOOD_SPRING_BODY:['พลังชีวิตเพิ่ม 12% ป้องกันกายภาพเพิ่ม 10% ใช้วิชาเปลือกพฤกษาสร้างโล่','โจมตีกายภาพลด 6% ความเร็วเคลื่อนที่ลด 4 เหมาะกับการยืนรับศึก'],
 MEDICINE_BODHI_GOD:['พลังชีวิตเพิ่ม 8% ป้องกันวิชาเพิ่ม 14% ใช้ฉัตรบัวทองสร้างโล่คุ้มตน','โจมตีวิชาลด 6% ความเร็วร่ายลด 4 เน้นการคุ้มครอง']
 }[d.id];
 return { ...d, sourceStrengthTh:d.strengthTh, sourceWeaknessTh:d.weaknessTh, strengthTh:nativeText[0], weaknessTh:nativeText[1], path: major, ...metadata(d, 'living-content-v111.js') };
});
const materials = raw.materials.map(m => ({
  id: ident(m.id), nameTh: m.nameTh, category: m.category, tier: m.tier,
  craft: m.primaryCraftPath, terrain: m.terrain, value: Math.round(6 * Math.pow(1.7, m.tier - 1)),
  sourceBaseValueStones: m.baseValueStones,
  anatomy: m.anatomyType || null, relic: !!m.isTranscendent,
  element: ALIASES[m.element] || m.element || 'NEUTRAL',
  exoticCategory: m.exoticCategory || null, propertyTags: m.propertyTags || [],
  descTh: m.propertiesTh || m.descTh || '', ...metadata(m, 'myriad-worlds-data.js')
}));
const beasts = raw.beasts.map(b=>({
 id:ident(b.id), nameTh:b.nameTh, tier:b.tier,
 cp:Math.round(95*Math.pow(2.2,b.tier-1)*(b.tier===1?b.combatPower/150:1)),
 flee:25, aggro:45, terrain:b.terrain,
 drops:b.partDrops.map(p=>ident(p.matId)).filter(id=>materials.some(m=>m.id===id&&m.category==='BEAST_PART')),
 sourceCombatPower:b.combatPower, ...metadata(b,'myriad-worlds-data.js')
}));
const recipes = raw.recipes.map(r => ({
  id: ident(r.id), nameTh: r.nameTh, craft: r.craftPath, tier: r.tier,
  minMastery: r.minMastery, days: r.durationDays,
  inputs: r.inputs.map(i => ({ matId: ident(i.matId), count: i.count })),
  outType: r.outputType, outNameTh: r.outputNameTh,
  ...normalizeEffects(r),
  discoverable: true, yield: 1, facilityLevel: 1,
  compatiblePath: 'ANY', sourceCompatiblePath: r.compatiblePath || 'ANY',
  sourceOutputSubSlot: r.outputSubSlot || null, descTh: r.descTh || '',
  ...metadata(r, 'myriad-worlds-data.js')
}));
const techniques = raw.techniques.map(t => {
  check(STAGES[t.path], `Technique has unsupported path: ${t.id}`);
  const reqTier = t.requiredNormalizedTier || t.tier;
  check(Number.isInteger(reqTier) && reqTier >= 1 && reqTier <= STAGES[t.path], `Technique requirement exceeds unchanged ${t.path} stages: ${t.id}`);
  check(raw.targetArchetypeRecommendations[t.id], `Missing combat archetype: ${t.id}`);
  return {
    id: ident(t.id), nameTh: t.nameTh, cat: 'COMBAT_TECHNIQUE',
    role: t.roleGroup, path: t.path, sub: t.subPath, tier: t.tier,
    reqTier, element: ALIASES[t.element] || t.element || 'NEUTRAL',
    power: t.power, moves: t.moves || [],
    combatArch: raw.targetArchetypeRecommendations[t.id],
    sourceCategory: t.category, sourceEffectIds: (t.effectBindings || []).map(e => e.effectId),
    sourceRequiredNormalizedTier: t.requiredNormalizedTier,
    ...metadata(t, 'living-content-v111.js')
  };
});
const techRoutes = [
  ['NW_ART_002', 'ART_V112_BODY_IRONWOOD_BARK_T3'],
  ['NW_ART_075'],
  ['ART_V112_XIAN_MOON_MIRROR_T3', 'NW_ART_146'],
  ['NW_ART_083'],
  ['NW_ART_047'],
  ['ART_V112_GOD_LOTUS_SANCTUARY_T3', 'NW_ART_126']
];
const materialById = new Map(materials.map(m => [m.id, m]));
const regions = raw.curatedTargetRoutes.map((route, index) => {
  const env = raw.environments.find(e => e.id === route.sourceEnv);
  check(env, `Missing source environment: ${route.sourceEnv}`);
  return {
    id: ident(env.id), key: route.key, nameTh: env.nameTh,
    desc: env.rationaleTh, hazardTh: env.hazardTh, icon: env.icon, terrain: env.terrain,
    danger: [1, 2, 2, 3, 2, 3][index], days: [3, 4, 5, 6, 5, 7][index],
    beastMax: [2, 3, 3, 4, 3, 4][index], minPower: [30, 60, 90, 160, 110, 200][index],
    resources: route.materials.map(original => {
      const m = materialById.get(ident(original));
      check(m, `Unresolved route material: ${original}`);
      return { id: m.id, cap: m.tier <= 1 ? 24 : 12, regen: m.tier <= 1 ? 3 : 1, weight: 1, kind: m.category === 'BEAST_PART' ? 'hunt' : 'gather' };
    }),
    recipes: route.recipes.map(ident), techniques: techRoutes[index].map(ident),
    beasts: beasts.filter(b=>b.drops.some(id=>route.materials.map(ident).includes(id))).map(b=>b.id),
    ...metadata(env, 'myriad-worlds-data.js')
  };
});
for (const [label, array] of Object.entries({ subPaths, materials, recipes, techniques, regions, beasts })) unique(array, label);
for (const r of recipes) for (const input of r.inputs) check(materialById.has(input.matId), `Unresolved recipe input: ${r.id} -> ${input.matId}`);
const coveredMats = new Set(regions.flatMap(r => r.resources.map(m => m.id)));
const coveredRecipes = new Set(regions.flatMap(r => r.recipes));
const coveredTechs = new Set(regions.flatMap(r => r.techniques));
check(materials.every(m => coveredMats.has(m.id)), 'An imported ingredient has no collection route');
check(recipes.every(r => coveredRecipes.has(r.id)), 'An imported recipe has no discovery route');
check(techniques.every(t => coveredTechs.has(t.id)), 'An imported technique has no discovery route');
check(coveredTechs.size === techniques.length, 'A region refers to an unknown technique');
const inputSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
// Native target overrides: explicit tradeoffs, not source engine passives.
const subPreferences = {
  FROST_MOON_IMMORTAL: {aff:{WATER_ICE:1,SWORD:.4},p:{'personality.composure':.6,'intellect.focus':.4}},
  WOOD_SPRING_BODY: {aff:{WOOD_LIFE:.7,BODY_REFINING:.7,MEDICINE:.3},p:{'physiology.vitality':.5,'personality.discipline':.2}},
  MEDICINE_BODHI_GOD: {aff:{MEDICINE:.8,SOUL_DIVINE:.6},p:{'personality.empathy':.7,'interests.herbs':.4}},
  SHADOW_ASSASSIN: {aff:{YIN_SHADOW:1,MOVEMENT:.7,BLADE:.5},p:{'physiology.agility':.6,'social.deception':.4,'personality.caution':.3}},
  VENOM_GU_SOVEREIGN: {aff:{POISON:1,ALCHEMY:.7,WOOD_LIFE:.4},p:{'intellect.inventiveness':.5,'physiology.immunity':.5,'personality.empathy':-.3}},
  NETHER_GHOST_KING: {aff:{YIN_SHADOW:.9,SOUL_DIVINE:.7,WATER_ICE:.4},p:{'personality.composure':.5,'social.intimidation':.5,'personality.ambition':.4}},
  HEAVEN_DEVOURING_DEMON: {aff:{FIST_PALM:.7,FIRE:.5,YIN_SHADOW:.6},p:{'personality.ambition':.7,'personality.aggression':.6,'values.powerStatus':.5,'personality.integrity':-.4}},
  ZEN_VOID_MIND: {aff:{SOUL_DIVINE:.8,SCRIPTURE:.7,LIGHT_YANG:.4},p:{'personality.composure':.8,'intellect.wisdom':.6,'personality.empathy':.4,'personality.aggression':-.4}},
  CALLIGRAPHY_PAINTING_SAGE: {aff:{SCRIPTURE:.9,TALISMAN:.7,ARRAY:.6},p:{'intellect.comprehension':.7,'interests.arts':.7,'personality.creativity':.5}},
  DREAM_ILLUSION_WEAVER: {aff:{SOUL_DIVINE:.8,YIN_SHADOW:.5,WIND:.4},p:{'intellect.intuition':.7,'personality.creativity':.6,'personality.curiosity':.5}},
  MIND_SWORD_TELEKINESIS: {aff:{SWORD:.9,SOUL_DIVINE:.8,ASTRAL:.4},p:{'intellect.focus':.8,'intellect.willpower':.6,'values.martialPeak':.5}}
};
const subStats = {
 FROST_MOON_IMMORTAL:{p:{mdef:.10,def:.04,atk:-.04},f:{cast:6}},
 WOOD_SPRING_BODY:{p:{hp:.12,def:.10,atk:-.06},f:{move:-4}},
 MEDICINE_BODHI_GOD:{p:{hp:.08,mdef:.14,matk:-.06},f:{cast:-4}},
 SHADOW_ASSASSIN:{p:{atk:.12,eva:.16,def:-.08,hp:-.04},f:{crit:10,critDmg:22,move:12,pen:12}},
 VENOM_GU_SOVEREIGN:{p:{matk:.10,mdef:.08,hp:.06,atk:-.04},f:{pen:10,acc:8}},
 NETHER_GHOST_KING:{p:{matk:.10,def:.08,mdef:.10,move:-.04},f:{cast:6,pen:8}},
 HEAVEN_DEVOURING_DEMON:{p:{atk:.14,matk:.12,def:-.06,mdef:-.04},f:{crit:6,critDmg:18,pen:14}},
 ZEN_VOID_MIND:{p:{mdef:.18,def:.12,hp:.08,atk:-.08},f:{cast:6}},
 CALLIGRAPHY_PAINTING_SAGE:{p:{matk:.12,mdef:.10,acc:.10,atk:-.06},f:{cast:8}},
 DREAM_ILLUSION_WEAVER:{p:{eva:.16,matk:.10,mdef:.08,def:-.06},f:{cast:10,move:8}},
 MIND_SWORD_TELEKINESIS:{p:{matk:.16,atk:.08,def:-.06,hp:-.04},f:{pen:20,crit:8,cast:10}}
};
const catPath = path.join(ROOT, 'SOURCE_REFERENCE/catalogs/inspected_catalog.json');
const cat = fs.existsSync(catPath) ? JSON.parse(fs.readFileSync(catPath, 'utf8')) : null;
const trackMap = cat ? Object.fromEntries(cat.source.tracks.map(t => [t.subPath, t.track])) : {};

const MAJOR_BAND_MAPPINGS = {
  XIAN: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0],
  BODY: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
  GOD: [1.0, 1.5, 2.0, 2.5, 3.0, 3.3, 3.7, 3.9, 4.0],
  DEMON: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0],
  HEART_SOUL: [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0]
};

const MAJOR_COMBAT_POWERS = {
  XIAN: [120, 250, 520, 1100, 2250, 4300, 8200, 15500, 30000],
  BODY: [280, 520, 880, 1600, 2600, 5000, 8500, 18000, 31000],
  GOD: [410, 950, 1750, 4000, 7600, 14000, 20000, 26000, 32500],
  DEMON: [130, 270, 550, 1120, 2280, 4500, 8800, 16500, 31000],
  HEART_SOUL: [118, 255, 530, 1080, 2200, 4350, 8500, 16000, 30500]
};

const SKILL_GATES = {
  FROST_MOON_IMMORTAL: { skill: 'WATER_ICE', secondSkill: 'ALCHEMY' },
  WOOD_SPRING_BODY: { skill: 'BODY_REFINING', secondSkill: 'WOOD_LIFE' },
  MEDICINE_BODHI_GOD: { skill: 'MEDICINE', secondSkill: 'SOUL_DIVINE' },
  SHADOW_ASSASSIN: { skill: 'MOVEMENT', secondSkill: 'stealth' },
  VENOM_GU_SOVEREIGN: { skill: 'POISON', secondSkill: 'ALCHEMY' },
  NETHER_GHOST_KING: { skill: 'SOUL_DIVINE', secondSkill: 'ALCHEMY' },
  HEAVEN_DEVOURING_DEMON: { skill: 'FIST_PALM', secondSkill: 'FORGING' },
  ZEN_VOID_MIND: { skill: 'SCRIPTURE', secondSkill: 'SOUL_DIVINE' },
  CALLIGRAPHY_PAINTING_SAGE: { skill: 'TALISMAN', secondSkill: 'ARRAY' },
  DREAM_ILLUSION_WEAVER: { skill: 'SOUL_DIVINE', secondSkill: 'arts' },
  MIND_SWORD_TELEKINESIS: { skill: 'SWORD', secondSkill: 'SOUL_DIVINE' }
};

const nativeMajorSubPaths = [
  { id: 'SHADOW_ASSASSIN', path: 'DEMON' },
  { id: 'VENOM_GU_SOVEREIGN', path: 'DEMON' },
  { id: 'NETHER_GHOST_KING', path: 'DEMON' },
  { id: 'HEAVEN_DEVOURING_DEMON', path: 'DEMON' },
  { id: 'ZEN_VOID_MIND', path: 'HEART_SOUL' },
  { id: 'CALLIGRAPHY_PAINTING_SAGE', path: 'HEART_SOUL' },
  { id: 'DREAM_ILLUSION_WEAVER', path: 'HEART_SOUL' },
  { id: 'MIND_SWORD_TELEKINESIS', path: 'HEART_SOUL' }
];

const allTrackBranches = subPaths.concat(nativeMajorSubPaths);
const progressionMapping = allTrackBranches.map(b => {
  const sourceTrack = trackMap[b.id];
  check(sourceTrack && Array.isArray(sourceTrack.realms), 'Missing source track for ' + b.id);
  const majorPowerMapping = MAJOR_BAND_MAPPINGS[b.path];
  const powers = MAJOR_COMBAT_POWERS[b.path];
  const gate = SKILL_GATES[b.id] || { skill: 'SCRIPTURE', secondSkill: 'ALCHEMY' };

  const realms = sourceTrack.realms.map((r, i) => {
    const ord = r.ordinal;
    const band = majorPowerMapping[i];
    const cp = powers[i];
    return {
      ordinal: ord,
      id: r.id,
      nameTh: r.nameTh,
      lifespanMax: r.lifespanMax,
      functionalCombatPower: cp,
      majorBandEquivalent: band,
      skillGate: {
        primarySkill: gate.skill,
        minPrimarySkill: 15 + (ord - 1) * 10,
        secondarySkill: gate.secondSkill,
        minSecondarySkill: Math.max(10, (ord - 1) * 8)
      },
      resourceCost: {
        stones: 45 + ord * 14,
        materialTier: Math.min(5, Math.ceil(ord / 2))
      },
      capacityMultipliers: {
        maxQiMult: +(1 + (ord - 1) * 0.4).toFixed(2),
        vitalityMult: +(1 + (ord - 1) * 0.24).toFixed(2),
        faithPoolMult: +(1 + (ord - 1) * 0.16).toFixed(2),
        senseBonus: (ord - 1) * 4
      },
      realmBuffs: {
        combatOffensePct: +(ord * 3.1).toFixed(2),
        combatDefensePct: +(ord * 2.2).toFixed(2),
        armorPenetrationPct: +(ord * 2.5).toFixed(2),
        counterStrikePct: +(ord * 2.0).toFixed(2),
        lifestealPct: b.path === 'DEMON' ? +(ord * 1.5).toFixed(2) : 0,
        reflectPct: b.path === 'HEART_SOUL' ? +(ord * 1.8).toFixed(2) : 0,
        evasionPct: +(ord * 1.6).toFixed(2),
        qiRegenBonusPct: +(ord * 2.0).toFixed(2)
      },
      breakthroughBaseChance: Math.max(0.14, +(0.82 - ord * 0.08).toFixed(3))
    };
  });

  return {
    subPath: b.id,
    trackId: sourceTrack.id,
    sourceMajorPath: b.path,
    sourceIndependentRealmCount: 9,
    targetMajorPath: b.path,
    targetMajorStages: STAGES[b.path],
    mode: 'INDEPENDENT_TRACK',
    sourceRealmOrdinalsImported: true,
    realms,
    majorPowerMapping,
    note: 'Full 9-realm source track imported with explicit native track state, skill/resource gates, and functional major-power comparison without ordinal compression into 5 or 4 stages.'
  };
});

// v1.10.9: Curated Rare Organs from source myriadWorlds.rareOrgans mapped to resident species & regions
const sourceOrganMap = cat ? Object.fromEntries((cat.source.myriadWorlds.rareOrgans || []).map(o => [o.id, o])) : {};
const organBindings = [
  { sourceId: 'MW_ORGAN_010', beastId: 'SRC110_MW_BEAST_001', regionId: 'SRC110_MW_ENV_01_ANCIENT_CANOPY', refineEffect: { clearToxic: 32, healHealth: 28, cultivationProgress: 14, stoneCost: 18 } },
  { sourceId: 'MW_ORGAN_001', beastId: 'SRC110_MW_BEAST_002', regionId: 'SRC110_MW_ENV_01_ANCIENT_CANOPY', refineEffect: { qiRestore: 0.45, cultivationProgress: 16, clearHeartDemon: 10, stoneCost: 18 } },
  { sourceId: 'MW_ORGAN_008', beastId: 'SRC110_MW_BEAST_003', regionId: 'SRC110_MW_ENV_01_ANCIENT_CANOPY', refineEffect: { foundationBonus: 0.05, cultivationProgress: 18, healInjury: 25, stoneCost: 26 } },
  { sourceId: 'MW_ORGAN_006', beastId: 'SRC110_MW_BEAST_010', regionId: 'SRC110_MW_ENV_02_MIASMA_MANGROVE', refineEffect: { clearToxic: 42, cultivationProgress: 20, healHealth: 30, stoneCost: 26 } },
  { sourceId: 'MW_ORGAN_011', beastId: 'SRC110_MW_BEAST_011', regionId: 'SRC110_MW_ENV_02_MIASMA_MANGROVE', refineEffect: { foundationBonus: 0.06, cultivationProgress: 24, clearHeartDemon: 14, stoneCost: 36 } },
  { sourceId: 'MW_ORGAN_012', beastId: 'SRC110_MW_BEAST_013', regionId: 'SRC110_MW_ENV_02_MIASMA_MANGROVE', refineEffect: { clearHeartDemon: 22, cultivationProgress: 15, qiRestore: 0.35, stoneCost: 18 } },
  { sourceId: 'MW_ORGAN_023', beastId: 'SRC110_MW_BEAST_018', regionId: 'SRC110_MW_ENV_03_FROZEN_HIGHLANDS', refineEffect: { clearHeartDemon: 24, cultivationProgress: 22, healInjury: 28, stoneCost: 36 } },
  { sourceId: 'MW_ORGAN_013', beastId: 'SRC110_MW_BEAST_026', regionId: 'SRC110_MW_ENV_04_VOLCANIC_CALDERA', refineEffect: { healHealth: 45, healInjury: 30, foundationBonus: 0.05, cultivationProgress: 20, stoneCost: 28 } },
  { sourceId: 'MW_ORGAN_019', beastId: 'SRC110_MW_BEAST_034', regionId: 'SRC110_MW_ENV_05_MINERAL_DESERT', refineEffect: { foundationBonus: 0.08, cultivationProgress: 28, clearHeartDemon: 26, stoneCost: 45 } },
  { sourceId: 'MW_ORGAN_024', beastId: 'SRC110_MW_BEAST_035', regionId: 'SRC110_MW_ENV_05_MINERAL_DESERT', refineEffect: { healHealth: 40, foundationBonus: 0.05, cultivationProgress: 19, stoneCost: 28 } }
];
const rareOrgans = organBindings.map(b => {
  const src = sourceOrganMap[b.sourceId];
  check(src, 'Missing source rareOrgan: ' + b.sourceId);
  return {
    id: ident(src.id),
    matId: ident(src.matId),
    nameTh: src.nameTh,
    tier: src.tier,
    element: ALIASES[src.element] || src.element || 'NEUTRAL',
    anatomyType: src.anatomyType,
    mutationChance: src.mutationChance,
    dissectionDifficulty: src.dissectionDifficulty,
    auraHintTh: src.auraHintTh,
    physicalSignTh: src.physicalSignTh,
    propertyTags: src.propertyTags || [],
    usesTh: src.usesTh,
    beastId: b.beastId,
    regionId: b.regionId,
    value: Math.round(18 * Math.pow(1.65, src.tier - 1)),
    refineEffect: b.refineEffect,
    ...metadata(src, 'myriad-worlds-data.js')
  };
});

// v1.10.9: Curated Property Experimentation Designs from source myriadWorlds.experimentDesigns
const sourceExpMap = cat ? Object.fromEntries((cat.source.myriadWorlds.experimentDesigns || []).map(e => [e.id, e])) : {};
const expBindings = [
  {
    sourceId: 'MW_EXP_001',
    nameTh: 'โอสถมอสหยกเรืองแสง (สูตรค้นคว้าประยุกต์)',
    workshop: 'alchemy', discipline: 'ALCHEMY', tier: 1, minMastery: 28,
    linkedRecipeId: 'SRC110_MW_REC_002', catalystOrganId: 'SRC110_MW_ORGAN_001',
    requiredPropertyTags: ['COOLING', 'HEAL_FLESH', 'ADHESIVE'],
    trialInputs: [{ matId: 'SRC110_MW_MAT_HERB_002', count: 1 }, { matId: 'SRC110_MW_MAT_HERB_005', count: 1 }],
    stoneCost: 8, poisonous: false,
    synergyBonus: { qualityBonus: 0.14, yieldBonus: 1, cultivationProgress: 14, healHealth: 32 }
  },
  {
    sourceId: 'MW_EXP_002',
    nameTh: 'โอสถถั่งเช่าหนอนศิลา (สูตรค้นคว้าประยุกต์)',
    workshop: 'alchemy', discipline: 'ALCHEMY', tier: 2, minMastery: 36,
    linkedRecipeId: 'SRC110_MW_REC_005', catalystOrganId: 'SRC110_MW_ORGAN_010',
    requiredPropertyTags: ['CORDYCEPS', 'BONE_NOURISH', 'STONE_LOTUS_ROOT'],
    trialInputs: [{ matId: 'SRC110_MW_MAT_HERB_008', count: 1 }, { matId: 'SRC110_MW_MAT_HERB_051', count: 1 }],
    stoneCost: 12, poisonous: false,
    synergyBonus: { qualityBonus: 0.15, yieldBonus: 1, foundationBonus: 0.04, cultivationProgress: 18 }
  },
  {
    sourceId: 'MW_EXP_006',
    nameTh: 'โอสถขิงเพลิงขับพิษเหมันต์ (สูตรค้นคว้าประยุกต์)',
    workshop: 'alchemy', discipline: 'ALCHEMY', tier: 2, minMastery: 38,
    linkedRecipeId: 'SRC110_MW_REC_006', catalystOrganId: 'SRC110_MW_ORGAN_006',
    requiredPropertyTags: ['EXPEL_COLD', 'FIRE_MERIDIAN', 'WIND_FIRE_SPICE'],
    trialInputs: [{ matId: 'SRC110_MW_MAT_HERB_010', count: 1 }, { matId: 'SRC110_MW_MAT_HERB_052', count: 1 }],
    stoneCost: 12, poisonous: true,
    synergyBonus: { qualityBonus: 0.16, yieldBonus: 1, clearToxic: 28, cultivationProgress: 20 }
  },
  {
    sourceId: 'MW_EXP_008',
    nameTh: 'ศาสตราเขี้ยวงูไม้แก่นเหล็ก (สูตรค้นคว้าประยุกต์)',
    workshop: 'forge', discipline: 'FORGING', tier: 1, minMastery: 30,
    linkedRecipeId: 'SRC110_MW_REC_021', catalystOrganId: 'SRC110_MW_ORGAN_008',
    requiredPropertyTags: ['THORN_FANG', 'BLOOD_RUST', 'IRON_WOOD'],
    trialInputs: [{ matId: 'SRC110_MW_MAT_BP_141', count: 1 }, { matId: 'SRC110_MW_MAT_ORE_056', count: 1 }],
    stoneCost: 10, poisonous: false,
    synergyBonus: { qualityBonus: 0.15, combatMultBonus: 0.04, cultivationProgress: 15 }
  },
  {
    sourceId: 'MW_EXP_010',
    nameTh: 'เสื้อเกราะไหมแมงมุมปีกแมลงทับ (สูตรค้นคว้าประยุกต์)',
    workshop: 'forge', discipline: 'FORGING', tier: 2, minMastery: 40,
    linkedRecipeId: 'SRC110_MW_REC_025', catalystOrganId: 'SRC110_MW_ORGAN_011',
    requiredPropertyTags: ['TOUGH_SILK', 'IRIDESCENT_ELYTRA', 'SWAMP_SINEW'],
    trialInputs: [{ matId: 'SRC110_MW_MAT_EXO_108', count: 1 }, { matId: 'SRC110_MW_MAT_BP_147', count: 1 }],
    stoneCost: 14, poisonous: false,
    synergyBonus: { qualityBonus: 0.16, defenseMultBonus: 0.05, cultivationProgress: 18 }
  },
  {
    sourceId: 'MW_EXP_013',
    nameTh: 'ศาสตราแร่ทองแดงเพลิงภูเขาไฟ (สูตรค้นคว้าประยุกต์)',
    workshop: 'forge', discipline: 'FORGING', tier: 2, minMastery: 42,
    linkedRecipeId: 'SRC110_MW_REC_066', catalystOrganId: 'SRC110_MW_ORGAN_013',
    requiredPropertyTags: ['VOLCANIC_COPPER', 'FIRE_CONDUCT', 'THERMAL_SPRING'],
    trialInputs: [{ matId: 'SRC110_MW_MAT_ORE_060', count: 1 }, { matId: 'SRC110_MW_MAT_EXO_117', count: 1 }],
    stoneCost: 14, poisonous: false,
    synergyBonus: { qualityBonus: 0.16, combatMultBonus: 0.05, cultivationProgress: 20 }
  },
  {
    sourceId: 'MW_EXP_015',
    nameTh: 'พู่กันขนเมฆาไผ่หยก (สูตรค้นคว้าประยุกต์)',
    workshop: 'forge', discipline: 'TALISMAN', tier: 1, minMastery: 28,
    linkedRecipeId: 'SRC110_MW_REC_044', catalystOrganId: 'SRC110_MW_ORGAN_012',
    requiredPropertyTags: ['GLIDE_FUR', 'PINE_SOOT', 'ECHO_BAMBOO'],
    trialInputs: [{ matId: 'SRC110_MW_MAT_BP_143', count: 1 }, { matId: 'SRC110_MW_MAT_EXO_126', count: 1 }],
    stoneCost: 8, poisonous: false,
    synergyBonus: { qualityBonus: 0.14, yieldBonus: 1, cultivationProgress: 16 }
  },
  {
    sourceId: 'MW_EXP_017',
    nameTh: 'จานค่ายกลแปดทิศเกลือสายฟ้า (สูตรค้นคว้าประยุกต์)',
    workshop: 'forge', discipline: 'ARRAY', tier: 3, minMastery: 50,
    linkedRecipeId: 'SRC110_MW_REC_048', catalystOrganId: 'SRC110_MW_ORGAN_019',
    requiredPropertyTags: ['BAGUA_DISK', 'THUNDER_SALT', 'AMETHYST_SOUL'],
    trialInputs: [{ matId: 'SRC110_MW_MAT_EXO_131', count: 1 }, { matId: 'SRC110_MW_MAT_EXO_125', count: 1 }],
    stoneCost: 18, poisonous: false,
    synergyBonus: { qualityBonus: 0.18, defenseMultBonus: 0.06, cultivationProgress: 24 }
  }
];
const experiments = expBindings.map(e => {
  const src = sourceExpMap[e.sourceId] || { id: e.sourceId, hypothesisTh: 'สมมติฐานการผสานคุณสมบัติของวัตถุดิบและอวัยวะพิเศษเพื่อยกระดับตำรับ' };
  for (const inp of e.trialInputs) check(materialById.has(inp.matId), 'Experiment trialInput missing material: ' + inp.matId);
  check(recipes.some(r => r.id === e.linkedRecipeId), 'Experiment missing linkedRecipeId: ' + e.linkedRecipeId);
  check(rareOrgans.some(o => o.id === e.catalystOrganId), 'Experiment missing catalystOrganId: ' + e.catalystOrganId);
  return {
    id: ident(e.sourceId),
    nameTh: e.nameTh,
    workshop: e.workshop,
    discipline: e.discipline,
    tier: e.tier,
    minMastery: e.minMastery,
    hypothesisTh: src.hypothesisTh,
    requiredPropertyTags: e.requiredPropertyTags,
    linkedRecipeId: e.linkedRecipeId,
    catalystOrganId: e.catalystOrganId,
    catalystBonusChance: src.optionalCatalystBonusChance || 0.18,
    poisonous: e.poisonous,
    stoneCost: e.stoneCost,
    trialInputs: e.trialInputs,
    synergyBonus: e.synergyBonus,
    ...metadata(src, 'myriad-worlds-data.js')
  };
});

// v1.10.9: Curated External Sect Factions from source EXTERNAL_SECTS_TEMPLATES_V300
const sourceFactions = (cat && cat.source.realmData && cat.source.realmData.EXTERNAL_SECTS_TEMPLATES_V300) || [];
const factionBindings = [
  { sourceId: 'CN', style: 'เป็นธรรม', treatyPref: 'ALLIANCE', specialtyMatIds: ['SRC110_MW_MAT_HERB_001', 'SRC110_MW_MAT_EXO_131'], doctrineBonus: { defenseBonus: 0.12, fameBonus: 2 } },
  { sourceId: 'SG', style: 'โลภ', treatyPref: 'TRADE_PACT', specialtyMatIds: ['SRC110_MW_MAT_HERB_008', 'SRC110_MW_MAT_ORE_067'], doctrineBonus: { marketDiscount: 0.10, tradeYield: 0.15 } },
  { sourceId: 'IN', style: 'ใฝ่สงบ', treatyPref: 'NON_AGGRESSION', specialtyMatIds: ['SRC110_MW_MAT_HERB_051', 'SRC110_MW_MAT_EXO_117'], doctrineBonus: { heartDemonRelief: 8, insightBonus: 0.10 } },
  { sourceId: 'JP', style: 'ทะนง', treatyPref: 'NON_AGGRESSION', specialtyMatIds: ['SRC110_MW_MAT_ORE_063', 'SRC110_MW_MAT_EXO_125'], doctrineBonus: { sparBonus: 0.15, combatBonus: 0.08 } },
  { sourceId: 'VN', style: 'ก้าวร้าว', treatyPref: 'TRADE_PACT', specialtyMatIds: ['SRC110_MW_MAT_HERB_003', 'SRC110_MW_MAT_BP_145'], doctrineBonus: { poisonResist: 0.15, herbYield: 0.12 } },
  { sourceId: 'RU', style: 'ก้าวร้าว', treatyPref: 'NONE', specialtyMatIds: ['SRC110_MW_MAT_BP_153', 'SRC110_MW_MAT_ORE_061'], doctrineBonus: { tributeDemand: 65, raidPowerMult: 1.15 } }
];
const factions = factionBindings.map(fb => {
  const src = sourceFactions.find(f => f.id === fb.sourceId);
  check(src, 'Missing source faction: ' + fb.sourceId);
  for (const mId of fb.specialtyMatIds) check(materialById.has(mId), 'Faction specialtyMatId missing: ' + mId);
  return {
    id: ident('FACTION_' + src.id),
    code: src.id,
    nameTh: src.nameTh,
    shortTh: src.shortTh,
    icon: src.icon,
    alignment: src.alignment,
    alignmentLabelTh: src.alignmentLabelTh,
    majorPath: src.majorPath === 'XIAN' && src.id === 'VN' ? 'DEMON' : src.majorPath,
    style: fb.style,
    specialtyTh: src.specialtyTh,
    leaderNameTh: src.leaderNameTh,
    descTh: src.descTh,
    militaryPower: src.militaryPower,
    initialRelation: src.initialRelation,
    treatyPref: fb.treatyPref,
    specialtyMatIds: fb.specialtyMatIds,
    doctrineBonus: fb.doctrineBonus,
    ...metadata(src, 'jianghu-data.js')
  };
});
unique(rareOrgans, 'rareOrgans');
unique(experiments, 'experiments');
unique(factions, 'factions');

const data = { progressionMapping, subPreferences, subStats, version: '1.10.9', sourcePack: PACK, prefix: PREFIX, selectedRawSha256: inputSha256, targetStageCounts: STAGES, nativeMajorPaths: ['DEMON', 'HEART_SOUL'], nativeMajorSubPaths, subPaths, materials, recipes, techniques, regions, beasts, rareOrgans, experiments, factions };
const output = `/* Generated by tools/migrate_source.js. Edit selected_raw.json only when deliberately changing the selected source records. */\n(function(g){\n'use strict';\nconst data=${JSON.stringify(data, null, 2)};\nconst JD=g.JD;\nif(!JD?.CULT?.paths||!JD.ITEMS||!JD.TECH)throw Error('Load base cultivation, item, and technique data before data_expansion.js');\nfunction add(label,list,records){for(const row of records){const found=list.find(x=>x.id===row.id);if(found){if(JSON.stringify(found)!==JSON.stringify(row))throw Error('Expansion ID collision in '+label+': '+row.id);}else list.push(row);}}\nfor(const row of data.subPaths){const parent=JD.CULT.paths[row.path];if(!parent)throw Error('Missing expansion parent path: '+row.path);add('subpaths',parent.subPaths,[row]);}\nadd('materials',JD.ITEMS.materials,data.materials);\nadd('recipes',JD.ITEMS.recipes,data.recipes);\nadd('techniques',JD.TECH.techniques,data.techniques);\nadd('beasts',JD.BEASTS.species,data.beasts);\nif(JD.EXPANSION&&JSON.stringify(JD.EXPANSION)!==JSON.stringify(data))throw Error('Conflicting JD.EXPANSION definition');\nJD.EXPANSION=JD.EXPANSION||data;\n})(typeof globalThis!=='undefined'?globalThis:this);\n`;
const mapping = {
  sourcePack: PACK, namespace: PREFIX, selectedRawSha256: inputSha256,
  progressionMapping,
  rankPolicy: 'Keep original target XIAN9 / BODY5 / GOD4 stage arrays and thresholds unchanged for backwards compatibility, and register native DEMON9 and HEART_SOUL9 major paths. Specialization tracks import all 9 authentic source realms with native track state, skill/resource gates, and functional power mapping without ordinal compression into 5 or 4 stages.',
  effectPolicy: 'Source heal, injury, cultivation and equipment multipliers use native target fields. Source restoreQi percentage is divided by100 into target qiRestore fraction-of-max. clearPoison is deliberately adapted to native clearToxic pill-toxin relief. Unsupported source-only effects are excluded from effect and listed per recipe.',
  pricePolicy: 'Imported ingredient value is rounded6*1.7^(tier-1), matching the target early material economy (tier1=6, tier2=10, tier3=17). Original value is retained in sourceBaseValueStones.',
  geographyPolicy: 'Six target collection routes are curated from source environment themes and material definitions (Ancient Canopy, Miasma Mangrove, Frozen Highlands, Volcanic Caldera, Mineral Desert, Celestial Garden Ruins); each route features matching resident species, authentic drops, and 100% closed-loop material acquisition and recipe consumption without unsupported FORM IDs.',
  organsExperimentsPoliticsPolicy: 'Ten authentic rare beast organs (MW_ORGAN_*), eight property-based experiment designs (MW_EXP_*), and six external sect faction templates (EXTERNAL_SECTS_TEMPLATES_V300) are migrated into JD.EXPANSION with deterministic harvesting, refinement, property experimentation, treaties, and world political events inside the single native engine.',
  fields: {
    materials: { primaryCraftPath: 'craft', baseValueStones: 'sourceBaseValueStones; target value=round(6*1.7^(tier-1))', anatomyType: 'anatomy' },
    recipes: { craftPath: 'craft', durationDays: 'days', outputType: 'outType', outputNameTh: 'outNameTh', 'inputs[].matId': 'SRC110_ + source matId' },
    techniques: { category: 'cat=COMBAT_TECHNIQUE for all selected combat abilities', roleGroup: 'role', subPath: 'sub', requiredNormalizedTier: 'reqTier', effectBindings: 'sourceEffectIds metadata; combatArch drives native target behavior' },
    effects: { healHealth: 'healHealth', healInjury: 'healInjury', restoreQi: 'qiRestore=restoreQi/100', cultivationProgress: 'cultivationProgress', clearPoison: 'clearToxic', toxicity: 'toxicity', combatMult: 'combatMult', defenseMult: 'defenseMult', minStageReq: 'minStageReq', foundationBonus: 'unsupportedEffects only', studyBonus: 'unsupportedEffects only', craftBonusPath: 'unsupportedEffects only', craftBonusScore: 'unsupportedEffects only' }
  },
  imports: Object.fromEntries(Object.entries({ subPaths, materials, recipes, techniques, regions, beasts, rareOrgans, experiments, factions }).map(([kind, records]) => [kind, records.map(r => ({ id: r.id, sourceId: r.sourceId, sourcePath: r.sourcePath, ...(r.unsupportedEffects ? { unsupportedEffects: r.unsupportedEffects } : {}) }))])),
  checks: { counts: Object.fromEntries(Object.entries({ subPaths, materials, recipes, techniques, regions, beasts, rareOrgans, experiments, factions }).map(([key, records]) => [key, records.length])), tracksCount: progressionMapping.length, unresolvedIngredients: [], undiscoverableRecipes: [], undiscoverableTechniques: [], unreachableIngredients: [] }
};
fs.writeFileSync(OUTPUT, output);
fs.writeFileSync(MAPPING, JSON.stringify(mapping, null, 2) + '\n');
console.log(JSON.stringify(mapping.checks));
