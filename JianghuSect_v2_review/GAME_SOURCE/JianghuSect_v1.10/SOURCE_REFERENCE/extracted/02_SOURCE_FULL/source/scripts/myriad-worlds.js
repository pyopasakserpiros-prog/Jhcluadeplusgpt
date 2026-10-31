/* Jianghu Ascension v2.00 — Myriad Worlds (แดนหมื่นภพ) Runtime Engine & Adapters
 * Implements:
 * 1. Species vs. Encounter Individual generation (age, sex, injuries, temperament variation, accumulated energy, lineage, persistent rare anatomy/mutations, carried possessions, encounter history).
 * 2. Deliberate Anatomical Harvesting (anatomical presence, fire/crush damage penalties, precision dissection vs heavy cleave, rare organ detection/recovery, non-rerollable corpse state, transactional personal/warehouse/deferred/ground-drop settlement).
 * 3. Property-Based Recipe Experimentation & Multi-Route Recipe Knowledge Acquisition (hypotheses, progressive property revelation, optional rare-organ catalysts, incomplete notes/fragments, city merchant/envoy recipe trade, corpse/inheritance recovery on death).
 * 4. 3-Stage Seeded Myriad Worlds Realm (แดนหมื่นภพ) Generator across 5 Physical Entrances (shared probability law: Stage 1 Environment -> Stage 2 Coherent Pool -> Stage 3 Encounters/Resources/Manuscripts/Events) with persisted instances and anti-reroll guarantees.
 * 5. Autonomous NPC Decision Integration (ingredient hunting, rumor vs observation vs inference, non-combat encounter affordances: observe, avoid, offering, intimidate, harvest shed, rescue, tame, track, combat).
 * Leaves Human Foundation (source/scripts/human.js) 100% untouched.
 */
(function(root){
'use strict';

const H = root.HumanCore || (typeof require === 'function' ? require('./human') : null);
const E = root.World2026Engine || (typeof require === 'function' ? require('./legacy/src/engine') : null);
const MWD = root.JianghuMyriadWorldsData || (typeof require === 'function' ? require('./myriad-worlds-data') : null);

const alive = n => !!n && n.alive && n.health > 0;
const clamp = (x, a = 0, b = 100) => Math.max(a, Math.min(b, x));
const dist = (a, b) => Math.hypot((a?.x || 0) - (b?.x || 0), (a?.y || 0) - (b?.y || 0));
const copy = x => JSON.parse(JSON.stringify(x));

// Register new autonomous activities with HumanCore using existing 68-axis descriptors (never modifying human.js)
const MW_ACTIVITIES = [
  ['enterMyriadWorlds', 'เข้าสำรวจแดนหมื่นภพ', 'prepareExpedition', {
    skillDomain: 'expedition',
    valueWeights: { freedom: 0.25, knowledgeCraft: 0.30, martialPeak: 0.25, wealthResource: 0.20 },
    interestWeights: { exploration: 0.50, risk: 0.25, analysis: 0.15, nature: 0.10 },
    cognitiveWeights: { planning: 0.30, spatialReasoning: 0.30, attention: 0.25, metacognition: 0.15 }
  }],
  ['departMyriadWorlds', 'ก้าวเข้าสู่ทางเชื่อมแดนหมื่นภพ', 'prepareExpedition', {}],
  ['returnMyriadWorlds', 'เดินทางกลับจากแดนหมื่นภพ', 'prepareExpedition', {}],
  ['dissectBeastCorpse', 'ชำแหละและตรวจค้นกายวิภาคอสูร', 'hunt', {
    skillDomain: 'anatomyDissection',
    valueWeights: { knowledgeCraft: 0.35, wealthResource: 0.30 },
    interestWeights: { analysis: 0.45, nature: 0.35, creation: 0.20 },
    cognitiveWeights: { attention: 0.40, spatialReasoning: 0.30, reasoning: 0.30 },
    bodyWeights: { dexterity: 0.55, senseAcuity: 0.45 }
  }],
  ['experimentPropertyRecipe', 'ตั้งสมมติฐานทดลองคุณสมบัติตัวยาและแร่', 'alchemy', {
    skillDomain: 'formulaResearch',
    valueWeights: { knowledgeCraft: 0.45, honorLegacy: 0.20, wealthResource: 0.15 },
    interestWeights: { analysis: 0.45, creation: 0.35, exploration: 0.20 },
    personalityWeights: { curiosity: 0.35, rationality: 0.30, creativity: 0.30 }
  }],
  ['studyRecipeManuscript', 'ขบคิดตีความบันทึกตำรับโบราณ', 'discussDao', {
    skillDomain: 'formulaResearch',
    valueWeights: { knowledgeCraft: 0.45, sectDuty: 0.20 },
    interestWeights: { analysis: 0.50, practice: 0.30, tranquility: 0.20 }
  }],
  ['claimDeferredLoot', 'เบิกของตกค้างจากหีบฝากแดนหมื่นภพ', 'deposit', {
    skillDomain: 'logistics',
    valueWeights: { wealthResource: 0.35, sectDuty: 0.30 }
  }],
  ['recoverFallenBelongings', 'เก็บกู้มรดกและสัมภาระศิษย์ผู้ล่วงลับ', 'honorAncestors', {
    skillDomain: 'remembrance',
    valueWeights: { familyClan: 0.40, honorLegacy: 0.35, sectDuty: 0.25 },
    personalityWeights: { loyalty: 0.35, empathy: 0.35, integrity: 0.30 }
  }]
];

if (H?.registerActivity) {
  for (const [id, label, basis, extra] of MW_ACTIVITIES) {
    const baseDesc = H.activities?.[basis] || H.descriptor(basis);
    H.registerActivity({ ...baseDesc, id, label, ...extra });
  }
}

// Deterministic seeded PRNG helper (Mulberry32) so individual anatomy, rare organs, and 3-stage Myriad Worlds rolls are 100% reproducible and decoupled from unrelated counters
function makeSeededGenerator(seedInt) {
  let state = (Number(seedInt) >>> 0) || 0x13579bdf;
  return {
    get state() { return state; },
    set state(v) { state = (Number(v) >>> 0) || 1; },
    next() {
      state = (state + 0x6D2B79F5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(min, max) {
      if (max <= min) return min;
      return min + Math.floor(this.next() * (max - min + 1));
    },
    chance(p) {
      return this.next() < p;
    },
    fork(salt) {
      let h = state ^ 0x811c9dc5;
      const s = String(salt);
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
      }
      return makeSeededGenerator(h || 0x2468ace1);
    }
  };
}

function weightedPick(items, weightFn, rng) {
  if (!items || !items.length) return null;
  let total = 0;
  const weights = items.map(item => {
    const w = Math.max(0, Number(weightFn(item)) || 0);
    total += w;
    return w;
  });
  if (total <= 0) return items[0];
  let roll = rng.next() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

function weightedSampleWithoutReplacement(items, count, weightFn, rng) {
  const pool = [...items];
  const out = [];
  const k = Math.min(count, pool.length);
  for (let i = 0; i < k; i++) {
    const picked = weightedPick(pool, weightFn, rng);
    if (!picked) break;
    out.push(picked);
    const idx = pool.indexOf(picked);
    if (idx >= 0) pool.splice(idx, 1);
  }
  return out;
}

class MyriadWorldsSystem {
  constructor(game) {
    this.g = game;
    MWD?.registerCatalogs?.();
    this.ensureState();
  }

  get state() {
    return this.g.s.myriadWorlds;
  }

  ensureState() {
    const g = this.g;
    if (!g.s.myriadWorlds) {
      g.s.myriadWorlds = {
        schemaVersion: 1,
        nextSeq: 1,
        realmSeed: ((Number(g.s.seed) || 8821) * 2654435761) >>> 0,
        activeExpeditions: [],
        completedExpeditions: [],
        corpses: [],
        fallenRemains: [],
        deferredClaims: [],
        rumors: [],
        discoveredBeasts: {},
        discoveredMaterials: {},
        discoveredOrgans: {},
        discoveredEnvironments: {},
        discoveredPools: {},
        propertyKnowledge: {},
        recipeManuscripts: {},
        firstDiscoveries: {},
        stats: {
          entrancesUsed: {},
          environmentsRolled: {},
          poolsRolled: {},
          beastsEncountered: 0,
          nonCombatResolutions: 0,
          combatResolutions: 0,
          organsDiscovered: 0,
          organsRecovered: 0,
          organsDamaged: 0,
          manuscriptsFound: 0,
          recipesExperimented: 0,
          eventsResolved: 0
        }
      };
    }
    const mw = g.s.myriadWorlds;
    if (!mw.stats) mw.stats = { entrancesUsed: {}, environmentsRolled: {}, poolsRolled: {}, beastsEncountered: 0, nonCombatResolutions: 0, combatResolutions: 0, organsDiscovered: 0, organsRecovered: 0, organsDamaged: 0, manuscriptsFound: 0, recipesExperimented: 0, eventsResolved: 0 };
    if (!Array.isArray(mw.activeExpeditions)) mw.activeExpeditions = [];
    if (!Array.isArray(mw.completedExpeditions)) mw.completedExpeditions = [];
    if (!Array.isArray(mw.corpses)) mw.corpses = [];
    if (!Array.isArray(mw.fallenRemains)) mw.fallenRemains = [];
    if (!Array.isArray(mw.deferredClaims)) mw.deferredClaims = [];
    if (!Array.isArray(mw.rumors)) mw.rumors = [];
    if (!mw.discoveredBeasts) mw.discoveredBeasts = {};
    if (!mw.discoveredMaterials) mw.discoveredMaterials = {};
    if (!mw.discoveredOrgans) mw.discoveredOrgans = {};
    if (!mw.discoveredEnvironments) mw.discoveredEnvironments = {};
    if (!mw.discoveredPools) mw.discoveredPools = {};
    if (!mw.propertyKnowledge) mw.propertyKnowledge = {};
    if (!mw.recipeManuscripts) mw.recipeManuscripts = {};
    if (!mw.firstDiscoveries) mw.firstDiscoveries = {};

    // Ensure all 5 physical entrances are registered in FrontierData.LOCS for map rendering & pathfinding
    if (root.FrontierData?.LOCS && MWD?.entrances) {
      for (const ent of MWD.entrances) {
        if (!root.FrontierData.LOCS.some(l => l.id === ent.id)) {
          root.FrontierData.LOCS.push({
            id: ent.id,
            name: ent.shortTh,
            x: ent.x,
            y: ent.y,
            icon: ent.icon,
            isMyriadEntrance: true
          });
        }
      }
    }

    // Ensure all 165 new recipes are registered in world.jianghu.systemsV140.recipes.registry
    this.registerAllExpansionRecipesInWorld();
    return mw;
  }

  nextId(prefix) {
    return `${prefix}-${this.state.nextSeq++}`;
  }

  registerAllExpansionRecipesInWorld() {
    const w = this.g.world;
    const reg = w?.jianghu?.systemsV140?.recipes?.registry;
    if (!reg || !MWD?.newRecipes) return;
    for (const tpl of MWD.newRecipes) {
      if (!reg[tpl.id]) {
        reg[tpl.id] = {
          id: tpl.id,
          nameTh: tpl.nameTh,
          craftPath: tpl.craftPath,
          tier: tpl.tier,
          minMastery: tpl.minMastery,
          durationDays: tpl.durationDays,
          inputs: copy(tpl.inputs),
          outputType: tpl.outputType,
          outputSubSlot: tpl.outputSubSlot || null,
          outputNameTh: tpl.outputNameTh,
          compatiblePath: tpl.compatiblePath || 'ANY',
          effect: copy(tpl.effect || {}),
          descTh: tpl.descTh,
          isPartial: false,
          missingFragments: 0,
          isTranscendent: !!tpl.isTranscendent,
          heritageOnly: false,
          originatorId: null,
          originatorNameTh: 'ตำรับโบราณแดนหมื่นภพ',
          createdYear: Number(w.year) || 2026,
          creationReasonTh: 'ค้นพบจากแดนหมื่นภพและการวิจัยคุณสมบัติ',
          parentRecipeId: null,
          branchType: 'ORIGINAL',
          tradeoffId: 'STANDARD',
          variants: [],
          recipeSeed: 140000 + Number(String(tpl.id).replace(/\D/g, '') || 1),
          generatorVersion: 200,
          status: 'ACTIVE',
          scrollHolders: [],
          knowers: [],
          rightsOwner: { ownerType: 'PRIVATE_DISCOVERY', ownerId: null, minMeritOrTrust: tpl.tier * 8 },
          authorizedLearners: [],
          transmissionV160: { secrecy: 'PERSONAL', heirId: null, teacherIds: [], lastPolicyTick: -1 }
        };
      }
      // Make Tier 1-2 starter Myriad recipes available to sect artisans so low-tier materials are immediately craftable via commissions too
      if (tpl.tier <= 2) {
        const artisan = tpl.craftPath === 'ALCHEMY' || tpl.craftPath === 'BEAST_TAMING' ? this.g.alchemist : this.g.smith;
        if (artisan?.jianghu) {
          artisan.jianghu.knownRecipeIdsV140 = artisan.jianghu.knownRecipeIdsV140 || [];
          if (!artisan.jianghu.knownRecipeIdsV140.includes(tpl.id)) artisan.jianghu.knownRecipeIdsV140.push(tpl.id);
          const r = reg[tpl.id];
          if (!r.knowers.includes(artisan.id)) r.knowers.push(artisan.id);
          if (!r.authorizedLearners.includes(artisan.id)) r.authorizedLearners.push(artisan.id);
        }
        if (Array.isArray(this.g.recipes) && !this.g.recipes.some(x => x.id === tpl.id)) {
          this.g.recipes.push(reg[tpl.id]);
        }
      }
    }
  }

  // ============================================================================
  // PHASE 1: SPECIES VS INDIVIDUAL GENERATION, RARE ORGANS & DELIBERATE HARVESTING
  // ============================================================================
  resolveSpecies(speciesId) {
    const cat = E?.PATCH140_DATA?.BEAST_SPECIES_V140 || [];
    return cat.find(s => s.id === speciesId) || MWD?.beastMap?.get(speciesId) || null;
  }

  resolveMaterial(matId) {
    const cat = E?.PATCH140_DATA?.MATERIALS_REGISTRY_V140 || [];
    return cat.find(m => m.id === matId) || MWD?.materialMap?.get(matId) || null;
  }

  generateBeastIndividual(speciesOrId, seedSalt, opts = {}) {
    const species = typeof speciesOrId === 'string' ? this.resolveSpecies(speciesOrId) : speciesOrId;
    if (!species) return null;
    const rng = makeSeededGenerator(this.state.realmSeed).fork(`ind:${species.id}:${seedSalt}`);

    const ageClasses = [
      { id: 'JUVENILE', labelTh: 'วัยเยาว์', hpMult: 0.82, powerMult: 0.80, ageYears: rng.int(1, 15) },
      { id: 'ADULT', labelTh: 'โตเต็มวัย', hpMult: 1.00, powerMult: 1.00, ageYears: rng.int(16, 120) },
      { id: 'ELDER', labelTh: 'ชราตบะแก่กล้า', hpMult: 1.24, powerMult: 1.22, ageYears: rng.int(121, 800) },
      { id: 'ANCIENT', labelTh: 'บรรพกาลพันปี', hpMult: 1.48, powerMult: 1.45, ageYears: rng.int(801, 5000) }
    ];
    const ageWeights = species.tier >= 5 ? [5, 45, 35, 15] : (species.tier >= 3 ? [15, 60, 20, 5] : [25, 65, 10, 0]);
    const agePick = weightedPick(ageClasses.map((a, i) => ({ ...a, w: ageWeights[i] })), x => x.w, rng);
    const sex = species.bodyPlan in { CONSTRUCT: 1, SPIRIT_CONSTRUCT: 1, SPIRIT_ENTITY: 1 }
      ? 'NONE'
      : (rng.chance(0.5) ? 'MALE' : 'FEMALE');

    const temperaments = ['CAUTIOUS', 'TERRITORIAL', 'AGGRESSIVE', 'DOCILE', 'CUNNING', 'PROUD', 'PROTECTIVE'];
    const baseTemp = species.temperament || 'TERRITORIAL';
    const individualTemp = rng.chance(0.72) ? baseTemp : temperaments[rng.int(0, temperaments.length - 1)];

    // Pre-existing injury or battle scar
    const hasPriorInjury = rng.chance(0.18);
    const injuryDescTh = hasPriorInjury
      ? ['มีรอยแผลเก่าจากคมกระบี่ที่สีข้าง', 'เกล็ดด้านซ้ายร้าวจากการต่อสู้แย่งถิ่น', 'เขี้ยวข้างหนึ่งบิ่นแต่แฝงไอสังหารเข้มข้น'][rng.int(0, 2)]
      : null;

    // Rare organ / individual mutation roll (persistent & deterministic under seed)
    const eligibleOrgans = (species.eligibleRareOrgans || [])
      .map(id => MWD?.organMap?.get(id))
      .filter(Boolean);
    let rareOrgan = null;
    if (eligibleOrgans.length > 0) {
      const candidate = eligibleOrgans[rng.int(0, eligibleOrgans.length - 1)];
      const mutChance = clamp((candidate.mutationChance || 0.06) * (agePick.id === 'ANCIENT' ? 2.2 : agePick.id === 'ELDER' ? 1.5 : 1.0) * (opts.mutationBoost || 1.0), 0.02, 0.65);
      if (rng.chance(mutChance) || opts.forceRareOrgan) {
        const chosenOrgan = opts.forceRareOrganId ? (MWD?.organMap?.get(opts.forceRareOrganId) || candidate) : candidate;
        rareOrgan = {
          organId: chosenOrgan.id,
          matId: chosenOrgan.matId,
          nameTh: chosenOrgan.nameTh,
          anatomyType: chosenOrgan.anatomyType,
          dissectionDifficulty: chosenOrgan.dissectionDifficulty,
          auraHintTh: chosenOrgan.auraHintTh,
          physicalSignTh: chosenOrgan.physicalSignTh,
          propertyTags: copy(chosenOrgan.propertyTags || []),
          detected: false,
          harvested: false,
          damaged: false
        };
      }
    }

    // Anatomical presence generated once at individual creation (never rerolled on reopen/reload)
    const generatedParts = [];
    for (const d of (species.partDrops || [])) {
      const minQ = Array.isArray(d.baseQty) ? d.baseQty[0] : 1;
      const maxQ = Array.isArray(d.baseQty) ? d.baseQty[1] : (species.tier <= 2 ? 2 : 1);
      const presentQty = rng.int(minQ, maxQ) + (agePick.id === 'ANCIENT' ? 1 : 0);
      generatedParts.push({
        matId: d.matId,
        anatomyType: d.anatomyType || 'BEAST_PART',
        presentQty,
        remainingQty: presentQty,
        harvestMethod: d.harvestMethod || 'STANDARD_CUT',
        fragile: !!d.fragile,
        damagedByFire: d.damagedByFire ?? (d.anatomyType === 'HIDE_PELT' || d.anatomyType === 'SPIRIT_HAIR_FEATHER'),
        damagedByCrush: d.damagedByCrush ?? (d.anatomyType === 'HEART_GALL' || d.anatomyType === 'VENOM_GLAND' || d.anatomyType === 'BEAST_CORE'),
        condition: 'INTACT'
      });
    }

    // Carried possessions (e.g., an apex beast that swallowed a predecessor's pouch or herb)
    const carriedItems = [];
    if (rng.chance(0.14 + species.tier * 0.03)) {
      const herbPool = (MWD?.newMaterials || []).filter(m => m.category === 'HERB' && m.tier <= species.tier);
      if (herbPool.length) {
        const pickedHerb = herbPool[rng.int(0, herbPool.length - 1)];
        carriedItems.push({ kind: 'MATERIAL', matId: pickedHerb.id, count: 1, reasonTh: 'ติดอยู่ตามขน/กระเพาะของอสูร' });
      }
    }

    const baseHp = Math.round((58 + (species.tier || 1) * 32) * agePick.hpMult * (hasPriorInjury ? 0.88 : 1.0));
    const power = Math.round((species.combatPower || 150) * agePick.powerMult * (rareOrgan ? 1.15 : 1.0));

    return {
      individualId: `ind-${species.id}-${seedSalt}`,
      speciesId: species.id,
      nameTh: species.nameTh,
      tier: species.tier || 1,
      element: species.element || 'EARTH',
      ecologicalRole: species.ecologicalRole || 'WILD_BEAST',
      bodyPlan: species.bodyPlan || 'BEAST',
      ageClass: agePick.id,
      ageLabelTh: agePick.labelTh,
      ageYears: agePick.ageYears,
      sex,
      sexLabelTh: sex === 'MALE' ? 'เพศผู้' : sex === 'FEMALE' ? 'เพศเมีย' : 'ไร้เพศสภาพ',
      temperament: individualTemp,
      hostile: individualTemp in { AGGRESSIVE: 1, FEROCIOUS: 1, BLOODTHIRSTY: 1, RUTHLESS: 1, FRENZIED: 1, HOSTILE: 1 } || (species.hostile !== false && individualTemp !== 'DOCILE'),
      accumulatedQi: Math.round(power * 0.35),
      lineageTag: rareOrgan ? 'MUTATED_BLOODLINE' : (agePick.id === 'ANCIENT' ? 'PRIMORDIAL_LINEAGE' : 'COMMON_LINEAGE'),
      hasPriorInjury,
      injuryDescTh,
      health: baseHp,
      maxHP: baseHp,
      power,
      affordances: copy(species.affordances || ['OBSERVE', 'AVOID', 'COMBAT']),
      behaviorTags: copy(species.behaviorTags || []),
      combatHooks: copy(species.combatHooks || {}),
      anatomyParts: generatedParts,
      rareOrgan,
      carriedItems,
      damageHistory: { fireDamage: 0, crushDamage: 0, slashDamage: 0, poisonDamage: 0 },
      harvested: false,
      encounterHistory: []
    };
  }

  attachIndividualToMapBeast(beast, seedSalt = null) {
    if (beast?.individualId && Array.isArray(beast.anatomyParts)) return beast;
    if (!beast || beast.individual) return beast?.individual || null;
    const salt = seedSalt || `${beast.id}-${Math.round(beast.x || 0)}-${Math.round(beast.y || 0)}`;
    const ind = this.generateBeastIndividual(beast.speciesId, salt, {
      mutationBoost: beast.variantId && beast.variantId !== 'NORMAL' ? 2.5 : 1.0
    });
    if (ind) {
      beast.individual = ind;
      if (ind.rareOrgan) {
        beast.auraHintTh = ind.rareOrgan.auraHintTh;
      }
    }
    return ind;
  }

  recordDamageTypeOnBeast(beast, attacker, moveRoleOrElement = null, damageAmount = null) {
    const ind = beast?.individual || (beast?.individualId && Array.isArray(beast.anatomyParts) ? beast : this.attachIndividualToMapBeast(beast));
    if (!ind) return;
    const art = moveRoleOrElement && typeof moveRoleOrElement === 'object' ? moveRoleOrElement : null;
    const mechanics = art && this.g.combatSystem?.mechanics?.(art);
    const elem = art ? [art.id, art.subPath, art.element, ...(mechanics?.tags || [])].filter(Boolean).join(' ').toUpperCase() : String(moveRoleOrElement || attacker?.jianghu?.path || 'SLASH').toUpperCase();
    ind.damageHistory = ind.damageHistory || { fireDamage: 0, crushDamage: 0, slashDamage: 0, poisonDamage: 0 };
    const measured=Number.isFinite(damageAmount)?Math.max(0,damageAmount):null;
    if (/FIRE|SOLAR|FLAME|EMBER/.test(elem)) ind.damageHistory.fireDamage += measured??15;
    else if (/BODY|EARTH|STAR|METEOR|CRUSH|GRAVITY/.test(elem)) ind.damageHistory.crushDamage += measured??15;
    else if (/VENOM|POISON|DEMON|YIN/.test(elem)) ind.damageHistory.poisonDamage += measured??15;
    else ind.damageHistory.slashDamage += measured??10;
  }

  // Deliberate anatomical harvesting: separates presence, damage state, dissection skill, tool bonus, and transactional storage settlement
  harvestIndividualCorpse(npc, individualOrBeast, opts = {}) {
    const ind = individualOrBeast?.individual || individualOrBeast;
    if (!ind || ind.harvested) {
      return { ok: false, reason: 'ซากอสูรนี้ถูกชำแหละและเก็บกู้ชิ้นส่วนไปแล้ว', items: [], organResult: null };
    }
    ind.harvested = true; // Lock immediately so reopening or re-issuing harvest never rerolls or duplicates drops!

    const species = this.resolveSpecies(ind.speciesId);
    const rng = makeSeededGenerator(this.state.realmSeed).fork(`harvest:${ind.individualId}`);

    // Record species discovery in Bestiary
    this.recordBeastDiscovery(npc, ind, 'HARVEST');

    // Compute NPC dissection & observation capability
    const dex = npc?.core?.human ? H.effective(npc, 'body', 'dexterity') : 55;
    const sense = npc?.core?.human ? H.effective(npc, 'body', 'senseAcuity') : 55;
    const attention = npc?.core?.human ? H.effective(npc, 'cognition', 'attention') : 55;
    const eqItems = npc?.jianghu?.ledgerV140?.equipmentItems || [];
    const equippedIds = Object.values(npc?.jianghu?.equipmentV140 || {});
    const toolBonus = eqItems
      .filter(it => equippedIds.includes(it.id))
      .reduce((s, it) => s + (Number(it.dissectionBonus) || 0), 0);
    const knownBeastLore = this.state.discoveredBeasts[ind.speciesId]?.harvestCount || 0;
    const dissectionSkill = clamp((dex * 0.35 + sense * 0.30 + attention * 0.35) + toolBonus + Math.min(18, knownBeastLore * 3), 20, 125);

    const fireDmg = ind.damageHistory?.fireDamage || (opts.killedByFire ? 45 : 0);
    const crushDmg = ind.damageHistory?.crushDamage || (opts.killedByCrush ? 45 : 0);
    const careless = opts.method === 'QUICK_CLEAVE' || (npc?.personality?.caution ?? 50) < 28;

    const settledDrops = [];
    for (const part of (ind.anatomyParts || [])) {
      if (part.remainingQty <= 0) continue;
      let quality = 'STANDARD';
      let qty = part.remainingQty;
      let damagedReasonTh = null;

      if (part.damagedByFire && fireDmg >= 30) {
        quality = 'DAMAGED';
        if (qty > 1) qty = qty - 1;
        damagedReasonTh = 'เปลวไฟจากการต่อสู้เผาไหม้ผิวหนัง/ขนบางส่วน';
      } else if (part.damagedByCrush && crushDmg >= 30) {
        quality = 'DAMAGED';
        damagedReasonTh = 'แรงกระแทกหนักทำให้โครงสร้างภายในช้ำ';
      } else if (part.fragile && careless && dissectionSkill < 65) {
        quality = 'DAMAGED';
        damagedReasonTh = 'การชำแหละอย่างเร่งรีบทำให้ชิ้นส่วนเปราะบางฉีกขาด';
      } else if (dissectionSkill >= 82 && rng.chance(0.45)) {
        quality = 'PERFECT';
      } else if (dissectionSkill >= 62) {
        quality = 'GOOD';
      }

      part.remainingQty = 0;
      part.condition = quality;
      if (qty > 0) {
        const settlement = this.settleMaterialReward(npc, part.matId, qty, {
          quality,
          sourceLabel: `ชำแหละ${ind.nameTh}`,
          originType: opts.originType || 'BEAST_HARVEST',
          originId: opts.originId || ind.speciesId
        });
        settledDrops.push({
          matId: part.matId,
          nameTh: this.resolveMaterial(part.matId)?.nameTh || part.matId,
          anatomyType: part.anatomyType,
          quantity: qty,
          quality,
          damagedReasonTh,
          settlementStatus: settlement.status,
          personalAdded: settlement.personal,
          warehouseAdded: settlement.warehouse,
          deferredAdded: settlement.deferred
        });
      }
    }

    // Carried items on the beast
    for (const c of (ind.carriedItems || [])) {
      if (c.kind === 'MATERIAL' && c.matId) {
        const s = this.settleMaterialReward(npc, c.matId, c.count || 1, {
          quality: 'STANDARD',
          sourceLabel: `พบในซาก${ind.nameTh}`,
          originType: opts.originType || 'BEAST_HARVEST',
          originId: opts.originId || ind.speciesId
        });
        settledDrops.push({
          matId: c.matId,
          nameTh: this.resolveMaterial(c.matId)?.nameTh || c.matId,
          anatomyType: 'CARRIED_ITEM',
          quantity: c.count || 1,
          quality: 'STANDARD',
          settlementStatus: s.status
        });
      }
    }

    // Rare Organ / Individual Mutation resolution
    let organResult = null;
    if (ind.rareOrgan && !ind.rareOrgan.harvested) {
      const ro = ind.rareOrgan;
      this.state.stats.organsDiscovered++;
      const severeCorpseDamage = (fireDmg >= 50 && ro.anatomyType === 'SPIRIT_HAIR_FEATHER') || (crushDmg >= 50 && ro.anatomyType === 'HEART_GALL');
      const recoveryChance = severeCorpseDamage
        ? 0.15
        : clamp(0.35 + (dissectionSkill - ro.dissectionDifficulty) * 0.012 - (careless ? 0.25 : 0), 0.12, 0.96);
      const roll = rng.next();
      ro.detected = true;
      ro.harvested = true;

      if (roll < recoveryChance || opts.guaranteeOrganRecovery) {
        const organQuality = dissectionSkill >= ro.dissectionDifficulty + 15 ? 'PERFECT' : 'GOOD';
        const settlement = this.settleMaterialReward(npc, ro.matId, 1, {
          quality: organQuality,
          sourceLabel: `ผ่าเก็บอวัยวะพิเศษจาก${ind.nameTh}`,
          originType: this.resolveMaterial(ro.matId)?.isTranscendent ? 'HERITAGE_SITE' : 'RARE_MUTATION',
          originId: this.resolveMaterial(ro.matId)?.isTranscendent ? 'LEG_MYRIAD_WORLDS' : ro.organId
        });
        this.state.stats.organsRecovered++;
        this.recordOrganDiscovery(npc, ro, ind.speciesId, true);
        organResult = {
          recovered: true,
          organId: ro.organId,
          matId: ro.matId,
          nameTh: ro.nameTh,
          quality: organQuality,
          auraHintTh: ro.auraHintTh,
          physicalSignTh: ro.physicalSignTh,
          settlementStatus: settlement.status
        };
      } else {
        ro.damaged = true;
        this.state.stats.organsDamaged++;
        this.recordOrganDiscovery(npc, ro, ind.speciesId, false);
        organResult = {
          recovered: false,
          organId: ro.organId,
          matId: ro.matId,
          nameTh: ro.nameTh,
          reasonTh: severeCorpseDamage
            ? 'ซากอสูรบอบช้ำรุนแรงจากการปะทะ ทำให้อวัยวะกลายพันธุ์เสียหายก่อนเก็บกู้'
            : 'ความซับซ้อนของเส้นประสาทปราณสูงเกินความชำนาญชำแหละในครั้งนี้ ทำให้อวัยวะพิเศษสลายตัวไปน่าเสียดาย'
        };
      }
    }

    return { ok: true, items: settledDrops, organResult, dissectionSkill: Math.round(dissectionSkill) };
  }

  // Transactional material settlement: Personal Bag -> Sect Warehouse -> Deferred Claim / Ground Drop (Zero silent deletion!)
  settleMaterialReward(npc, matId, qty, opts = {}) {
    const g = this.g;
    const def = this.resolveMaterial(matId);
    if (!def || qty <= 0) return { ok: false, quantity: 0, personal: 0, warehouse: 0, deferred: 0, status: 'INVALID' };

    const isTrans = !!(def.isTranscendent || opts.isTranscendent);
    const quality = ['PERFECT', 'GOOD', 'STANDARD', 'DAMAGED'].includes(opts.quality) ? opts.quality : 'STANDARD';
    const originType = isTrans ? 'HERITAGE_SITE' : (opts.originType || 'MYRIAD_WORLDS');
    const originId = isTrans ? (opts.heritageLegacyId || 'LEG_MYRIAD_WORLDS') : (opts.originId || 'MW_REALM');
    const originLabelTh = opts.sourceLabel || 'แดนหมื่นภพ';

    // Ensure higherRealmLegacies contains originId if transcendent
    if (isTrans && g.world?.jianghu) {
      g.world.jianghu.higherRealmLegacies = g.world.jianghu.higherRealmLegacies || [];
      if (!g.world.jianghu.higherRealmLegacies.some(x => x.id === originId)) {
        g.world.jianghu.higherRealmLegacies.push({ id: originId, nameTh: originLabelTh, tier: def.tier || 6 });
      }
    }

    let personalAdded = 0;
    let warehouseAdded = 0;
    let deferredAdded = 0;

    if (npc && alive(npc) && npc.core?.human && !g.isSectStorage?.(npc)) {
      const freeCarry = Math.max(0, H.carryLimit(npc) - H.load(npc));
      const tryPersonal = Math.min(qty, freeCarry);
      if (tryPersonal > 0) {
        const r = g.add(npc, matId, tryPersonal, originLabelTh, {
          quality,
          isTranscendent: isTrans,
          originType,
          originId,
          originLabelTh
        });
        if (r.ok) personalAdded = tryPersonal;
      }
    }

    const remAfterPersonal = qty - personalAdded;
    if (remAfterPersonal > 0 && g.bank) {
      const rb = g.add(g.bank, matId, remAfterPersonal, originLabelTh, {
        quality,
        isTranscendent: isTrans,
        originType,
        originId,
        originLabelTh
      });
      if (rb.ok) warehouseAdded = remAfterPersonal;
    }

    const remAfterBank = qty - personalAdded - warehouseAdded;
    if (remAfterBank > 0) {
      // Never silently delete overflow! Place into deferredClaims (or groundDrops if on map)
      deferredAdded = remAfterBank;
      this.state.deferredClaims.push({
        id: this.nextId('claim'),
        ownerNpcId: npc?.id || null,
        matId,
        nameTh: def.nameTh,
        count: remAfterBank,
        quality,
        isTranscendent: isTrans,
        originType,
        originId,
        originLabelTh,
        createdAt: g.s.t
      });
      if (opts.onMap && npc?.stageLocal) {
        g.s.groundDrops.push({
          id: 'drop' + g.s.nextId++,
          matId,
          count: remAfterBank,
          quality,
          x: npc.stageLocal.x,
          y: npc.stageLocal.y,
          source: originLabelTh,
          expiresAt: g.s.t + 900
        });
      }
    }

    this.recordMaterialDiscovery(npc, matId, originLabelTh);

    return {
      ok: true,
      material: matId,
      nameTh: def.nameTh,
      quantity: personalAdded + warehouseAdded + deferredAdded,
      personal: personalAdded,
      warehouse: warehouseAdded,
      deferred: deferredAdded,
      quality,
      isTranscendent: isTrans,
      originId,
      status: personalAdded === qty
        ? 'PERSONAL'
        : (personalAdded + warehouseAdded === qty ? 'WAREHOUSE_OVERFLOW' : 'DEFERRED_CLAIM')
    };
  }

  claimDeferredItems(npc = null) {
    const g = this.g;
    const claims = this.state.deferredClaims;
    if (!claims.length) return { ok: false, moved: 0, reason: 'ไม่มีสิ่งของตกค้างรอเบิก' };
    let movedTotal = 0;
    const remaining = [];
    for (const c of claims) {
      if (c.item) {
        const key = c.kind === 'EQUIPMENT' ? 'equipmentItems' : 'scrolls';
        const cap = key === 'scrolls' ? 24 : 12;
        const personal = npc && alive(npc) && (!c.ownerNpcId || c.ownerNpcId === npc.id) && npc.jianghu.ledgerV140[key].length < cap;
        const target = personal ? npc : g.bank;
        if (target?.jianghu?.ledgerV140?.[key]?.length < (personal ? cap : 120)) {
          c.item.custodianNpcId = target.id;
          target.jianghu.ledgerV140[key].push(c.item);
          movedTotal += c.item.count || 1;
        } else remaining.push(c);
        continue;
      }
      const targetOwner = (npc && alive(npc) && (!c.ownerNpcId || c.ownerNpcId === npc.id) && (H.carryLimit(npc) - H.load(npc) >= c.count))
        ? npc
        : g.bank;
      const r = g.add(targetOwner, c.matId, c.count, c.originLabelTh, {
        quality: c.quality,
        isTranscendent: c.isTranscendent,
        originType: c.originType,
        originId: c.originId,
        originLabelTh: c.originLabelTh,
        allowTransferFromExistingHeritageStack: true
      });
      if (r.ok) {
        movedTotal += c.count;
      } else {
        remaining.push(c);
      }
    }
    this.state.deferredClaims = remaining;
    return { ok: movedTotal > 0, moved: movedTotal, claimed: movedTotal, remainingCount: remaining.length };
  }

  claimDeferredRewards(npc = null) {
    return this.claimDeferredItems(npc);
  }

  // ============================================================================
  // DISCOVERY & ENCYCLOPEDIA TRACKING (GROUNDED IN ACTUAL KNOWLEDGE)
  // ============================================================================
  recordBeastDiscovery(npc, indOrSpecies, how = 'ENCOUNTER') {
    const sid = indOrSpecies.speciesId || indOrSpecies.id;
    const sp = this.resolveSpecies(sid);
    if (!sp) return;
    let rec = this.state.discoveredBeasts[sid];
    const isGlobalFirst = !rec;
    if (!rec) {
      rec = this.state.discoveredBeasts[sid] = {
        speciesId: sid,
        nameTh: sp.nameTh,
        tier: sp.tier || 1,
        firstDiscovererId: npc?.id || null,
        firstDiscovererName: npc?.name || 'สำนักเมฆาคราม',
        discoveredAt: this.g.s.t,
        encounterCount: 0,
        harvestCount: 0,
        nonCombatCount: 0,
        knownParts: [],
        knownOrgans: [],
        observedBehaviors: []
      };
      this.recordGlobalFirst('BEAST', sid, sp.nameTh, npc);
    }
    rec.encounterCount++;
    if (how === 'HARVEST') {
      rec.harvestCount++;
      for (const d of (sp.partDrops || [])) {
        if (!rec.knownParts.includes(d.matId)) rec.knownParts.push(d.matId);
      }
    } else if (how !== 'COMBAT') {
      rec.nonCombatCount++;
    }
    for (const tag of (sp.behaviorTags || [])) {
      if (!rec.observedBehaviors.includes(tag)) rec.observedBehaviors.push(tag);
    }
  }

  recordOrganDiscovery(npc, organObj, speciesId, recovered = true) {
    const oid = organObj.organId || organObj.id;
    let rec = this.state.discoveredOrgans[oid];
    if (!rec) {
      rec = this.state.discoveredOrgans[oid] = {
        organId: oid,
        matId: organObj.matId,
        nameTh: organObj.nameTh,
        firstDiscovererId: npc?.id || null,
        firstDiscovererName: npc?.name || 'สำนักเมฆาคราม',
        discoveredAt: this.g.s.t,
        speciesIds: [],
        recoveredCount: 0,
        damagedCount: 0,
        knownTags: copy(organObj.propertyTags || [])
      };
      this.recordGlobalFirst('RARE_ORGAN', oid, organObj.nameTh, npc);
    }
    if (speciesId && !rec.speciesIds.includes(speciesId)) rec.speciesIds.push(speciesId);
    if (recovered) rec.recoveredCount++;
    else rec.damagedCount++;
    if (this.state.discoveredBeasts[speciesId] && !this.state.discoveredBeasts[speciesId].knownOrgans.includes(oid)) {
      this.state.discoveredBeasts[speciesId].knownOrgans.push(oid);
    }
  }

  recordMaterialDiscovery(npc, matId, sourceLabel = '') {
    const def = this.resolveMaterial(matId);
    if (!def) return;
    let rec = this.state.discoveredMaterials[matId];
    if (!rec) {
      rec = this.state.discoveredMaterials[matId] = {
        matId,
        nameTh: def.nameTh,
        category: def.category,
        tier: def.tier || 1,
        firstDiscovererId: npc?.id || null,
        firstDiscovererName: npc?.name || 'สำนักเมฆาคราม',
        discoveredAt: this.g.s.t,
        sources: [],
        revealedProperties: copy(def.propertyTags || []).slice(0, 1)
      };
    }
    if (sourceLabel && !rec.sources.includes(sourceLabel) && rec.sources.length < 6) {
      rec.sources.push(sourceLabel);
    }
  }

  recordGlobalFirst(category, entityId, nameTh, npc) {
    const key = `${category}:${entityId}`;
    if (this.state.firstDiscoveries[key]) return false;
    this.state.firstDiscoveries[key] = {
      key,
      category,
      entityId,
      nameTh,
      npcId: npc?.id || null,
      npcName: npc?.name || 'สำนักเมฆาคราม',
      at: this.g.s.t
    };
    return true;
  }

  // ============================================================================
  // PHASE 2: MULTI-ROUTE RECIPE MANUSCRIPTS, EXPERIMENTATION & DEATH INHERITANCE
  // ============================================================================
  grantRecipeManuscript(npc, recipeId, routeKind, originLabelTh, opts = {}) {
    const g = this.g;
    const reg = g.world?.jianghu?.systemsV140?.recipes?.registry;
    const rec = reg?.[recipeId] || MWD?.recipeMap?.get(recipeId) || g.progression?.recipe(recipeId);
    if (!rec || !npc?.jianghu?.ledgerV140) return null;

    const isFragment = !!opts.isFragment;
    const msId = this.nextId('manuscript');
    const scrollObj = {
      id: msId,
      kind: isFragment ? 'RECIPE_FRAGMENT' : 'RECIPE_MANUSCRIPT',
      recipeId: rec.id,
      formulaId: rec.id,
      nameTh: (isFragment ? 'เศษบันทึกตำรับ: ' : 'คัมภีร์ตำรับ: ') + (rec.nameTh || rec.name || rec.outputNameTh),
      tier: rec.tier || 1,
      discipline: rec.craftPath || rec.workshop || 'ALCHEMY',
      isFragment,
      fragmentProgress: isFragment ? (opts.fragmentPct || 50) : 100,
      understanding: 0,
      routeKind: routeKind || 'FIELD_MANUSCRIPT',
      originLabelTh: originLabelTh || 'ค้นพบในแดนหมื่นภพ',
      finderNpcId: npc.id,
      ownerNpcId: npc.id,
      custodianNpcId: npc.id,
      rights: 'PERSONAL',
      canRedistribute: true,
      discoveredAt: g.s.t,
      provenance: [{
        kind: routeKind || 'DISCOVERY',
        at: g.s.t,
        npcId: npc.id,
        origin: originLabelTh || 'แดนหมื่นภพ'
      }],
      count: 1
    };

    this.state.recipeManuscripts[msId] = scrollObj;
    this.state.stats.manuscriptsFound++;

    if (npc.jianghu.ledgerV140.scrolls.length < 24) {
      npc.jianghu.ledgerV140.scrolls.push(scrollObj);
    } else if (g.bank?.jianghu?.ledgerV140?.scrolls?.length < 120) {
      scrollObj.custodianNpcId = g.bank.id;
      g.bank.jianghu.ledgerV140.scrolls.push(scrollObj);
    } else {
      scrollObj.custodianNpcId = null;
      this.state.deferredClaims.push({ id: this.nextId('claim'), kind: 'SCROLL', ownerNpcId: npc.id, item: scrollObj, createdAt: g.s.t });
    }
    return scrollObj;
  }

  studyRecipeManuscript(npc, scrollId) {
    const g = this.g;
    if (!npc?.alive || !npc.jianghu?.ledgerV140) return { ok: false, reason: 'ไม่พบผู้ศึกษา' };
    const ownScrolls = npc.jianghu.ledgerV140.scrolls;
    let scroll = ownScrolls.find(s => s.id === scrollId || s.recipeId === scrollId);
    if (!scroll && ownScrolls.length < 24) {
      const bankScrolls = g.bank?.jianghu?.ledgerV140?.scrolls || [];
      const matches = s => s.ownerNpcId === npc.id && (s.id === scrollId || s.recipeId === scrollId);
      const bankIndex = bankScrolls.findIndex(matches);
      if (bankIndex >= 0) scroll = bankScrolls.splice(bankIndex, 1)[0];
      else {
        const claimIndex = this.state.deferredClaims.findIndex(c => c.item && c.ownerNpcId === npc.id && matches(c.item));
        if (claimIndex >= 0) scroll = this.state.deferredClaims.splice(claimIndex, 1)[0].item;
      }
      if (scroll) { scroll.custodianNpcId = npc.id; ownScrolls.push(scroll); }
    }
    if (!scroll || !scroll.recipeId) return { ok: false, reason: 'ไม่พบบันทึกตำรับในสัมภาระ' };

    const reg = g.world?.jianghu?.systemsV140?.recipes?.registry;
    const rec = reg?.[scroll.recipeId] || MWD?.recipeMap?.get(scroll.recipeId) || g.progression?.recipe(scroll.recipeId);
    if (!rec) return { ok: false, reason: 'ไม่พบข้อมูลตำรับ' };

    const activity = (rec.craftPath === 'ALCHEMY' || rec.workshop === 'alchemy' || rec.craftPath === 'BEAST_TAMING') ? 'alchemy' : 'forging';
    const cap = H.capacity(npc, activity).total;
    const gain = Math.round(28 + cap * 0.45);

    if (scroll.isFragment && (scroll.fragmentProgress || 50) < 100) {
      // Combine with another fragment or deduce the missing half through property insight
      scroll.fragmentProgress = Math.min(100, (scroll.fragmentProgress || 50) + Math.round(25 + cap * 0.35));
      if (scroll.fragmentProgress >= 100) {
        scroll.isFragment = false;
        scroll.kind = 'RECIPE_MANUSCRIPT';
        scroll.nameTh = scroll.nameTh.replace('เศษบันทึกตำรับ: ', 'คัมภีร์ตำรับฉบับสมบูรณ์: ');
      } else {
        return { ok: true, completed: false, progress: scroll.fragmentProgress, reasonTh: 'ปะติดปะต่อเศษบันทึกตำรับคืบหน้า ' + scroll.fragmentProgress + '%' };
      }
    }

    scroll.understanding = Math.min(100, (scroll.understanding || 0) + gain);
    if (scroll.understanding < 100) {
      return { ok: true, completed: false, understanding: scroll.understanding };
    }

    // Completed understanding -> register in NPC's personal known recipes (NOT omnisciently added to all disciples!)
    npc.jianghu.knownRecipeIdsV140 = npc.jianghu.knownRecipeIdsV140 || [];
    if (!npc.jianghu.knownRecipeIdsV140.includes(rec.id)) {
      npc.jianghu.knownRecipeIdsV140.push(rec.id);
    }
    if (npc.stageLocal?.growth) {
      npc.stageLocal.growth.knownRecipes = npc.stageLocal.growth.knownRecipes || [];
      if (!npc.stageLocal.growth.knownRecipes.includes(rec.id)) {
        npc.stageLocal.growth.knownRecipes.push(rec.id);
      }
      npc.stageLocal.growth.hasResearchExperience = true;
    }
    if (reg?.[rec.id]) {
      const r = reg[rec.id];
      if (!r.knowers.includes(npc.id)) r.knowers.push(npc.id);
      if (!r.authorizedLearners.includes(npc.id)) r.authorizedLearners.push(npc.id);
      if (!r.originatorId) {
        r.originatorId = npc.id;
        r.originatorNameTh = npc.name;
      }
    }
    this.recordGlobalFirst('RECIPE', rec.id, rec.nameTh || rec.name, npc);
    g.note(`${npc.name} ตีความ «${rec.nameTh || rec.name}» จนเข้าใจถ่องแท้และบันทึกเป็นความรู้ส่วนตัว`, npc);
    return { ok: true, completed: true, recipeId: rec.id };
  }

  // Handle permanent death consequences for unique manuscripts, personal knowledge, and carried possessions
  onNpcDeath(npc) {
    if (!npc?.jianghu?.ledgerV140) return;
    const l = npc.jianghu.ledgerV140;
    const scrolls = [...(l.scrolls || [])];
    const equipments = [...(l.equipmentItems || [])];
    const bankLedger = this.g.bank?.jianghu?.ledgerV140;
    if (bankLedger && this.g.bank.id !== npc.id) {
      for (const [key, items] of [['scrolls', scrolls], ['equipmentItems', equipments]]) {
        const owned = bankLedger[key].filter(item => item.ownerNpcId === npc.id);
        items.push(...owned);
        bankLedger[key] = bankLedger[key].filter(item => item.ownerNpcId !== npc.id);
      }
    }
    this.state.deferredClaims = this.state.deferredClaims.filter(c => {
      if (!c.item || c.ownerNpcId !== npc.id) return true;
      (c.kind === 'EQUIPMENT' ? equipments : scrolls).push(c.item);
      return false;
    });
    const materials = [...(l.materialStacks || [])].filter(m => m.count > 0);
    if (!scrolls.length && !equipments.length && !materials.length) return;

    const pos = npc.stageLocal || { x: 1100, y: 2180 };
    const remainRecord = {
      id: this.nextId('remains'),
      deceasedNpcId: npc.id,
      deceasedName: npc.name,
      diedAt: this.g.s.t,
      x: clamp(pos.x || 1100, 220, 3780),
      y: clamp(pos.y || 2180, 220, 2780),
      claimed: false,
      claimedByNpcId: null,
      scrolls: scrolls.map(s => {
        s.provenance = s.provenance || [];
        s.provenance.push({ kind: 'OWNER_DECEASED', from: npc.id, at: this.g.s.t });
        return s;
      }),
      equipmentItems: equipments,
      materialStacks: materials
    };
    l.scrolls = [];
    l.equipmentItems = [];
    l.materialStacks = [];
    npc.jianghu.equipmentV140 = {};
    E.syncLegacyArraysFromLedgerV140?.(npc);
    this.state.fallenRemains.push(remainRecord);
  }

  recoverFallenRemains(actor, remainId) {
    const g = this.g;
    const rem = this.state.fallenRemains.find(r => r.id === remainId && !r.claimed);
    if (!rem || !alive(actor)) return { ok: false, reason: 'ไม่พบร่องรอยสัมภาระผู้ล่วงลับ' };
    let recoveredScrolls = 0, moved = 0;
    rem.scrolls = rem.scrolls.filter(sc => {
      const loanOwner = sc.loan && g.world.npcs[sc.loan.ownerNpcId];
      const target = alive(loanOwner) && loanOwner.jianghu.ledgerV140.scrolls.length < 24 ? loanOwner
        : actor.jianghu.ledgerV140.scrolls.length < 24 ? actor
        : g.bank.jianghu.ledgerV140.scrolls.length < 120 ? g.bank : null;
      if (!target) return true;
      if (!sc.loan) sc.ownerNpcId = actor.id;
      sc.custodianNpcId = target.id;
      sc.provenance = sc.provenance || [];
      sc.provenance.push({ kind: 'INHERITED_FROM_FALLEN', from: rem.deceasedNpcId, to: actor.id, at: g.s.t });
      target.jianghu.ledgerV140.scrolls.push(sc);
      if (sc.loan) {
        const loan = g.s.growth.bookLoans.find(l => l.bookId === sc.id && l.sessionId === sc.loan.sessionId);
        if (target.id === sc.loan.ownerNpcId) {
          delete sc.loan; sc.rights = 'OWNER'; sc.ownerNpcId = target.id;
          if (loan) { loan.status = 'RETURNED'; loan.returnedAt = g.s.t; }
        } else {
          sc.loan.borrowerNpcId = target.id;
          if (loan) { loan.borrowerNpcId = target.id; loan.status = 'PENDING_RETURN'; loan.dueAt = g.s.t; }
          if (loan) g.academy?.returnLoan(loan);
        }
      }
      recoveredScrolls++; moved++; return false;
    });
    rem.equipmentItems = rem.equipmentItems.filter(eq => {
      const target = actor.jianghu.ledgerV140.equipmentItems.length < 12 ? actor : g.bank.jianghu.ledgerV140.equipmentItems.length < 120 ? g.bank : null;
      if (!target) return true;
      eq.ownerNpcId = actor.id; eq.custodianNpcId = target.id;
      target.jianghu.ledgerV140.equipmentItems.push(eq); moved++; return false;
    });
    rem.materialStacks = rem.materialStacks.filter(st => {
      const r = this.settleMaterialReward(actor, st.matId, st.count, {
        quality: st.quality,
        isTranscendent: st.isTranscendent,
        originType: st.originType,
        originId: st.originId,
        sourceLabel: `มรดกของ ${rem.deceasedName}`
      });
      if (r.ok) moved += st.count;
      return !r.ok;
    });
    rem.claimed = !rem.scrolls.length && !rem.equipmentItems.length && !rem.materialStacks.length;
    if (moved) { rem.claimedByNpcId = actor.id; rem.claimedAt = g.s.t; }
    E.syncLegacyArraysFromLedgerV140?.(actor);
    E.syncLegacyArraysFromLedgerV140?.(g.bank);
    if (moved) g.note(`${actor.name} เก็บกู้มรดกและคัมภีร์ของ ${rem.deceasedName} กลับคืนสู่สำนัก (${recoveredScrolls} ม้วน)`, actor);
    return { ok: moved > 0 || rem.claimed, recoveredScrolls, complete: rem.claimed };
  }

  // ============================================================================
  // PHASE 3: THE MYRIAD WORLDS REALM (แดนหมื่นภพ) 3-STAGE RANDOMIZATION ENGINE
  // ============================================================================
  // Stage 1: Choose Environment -> Stage 2: Choose Coherent Pool -> Stage 3: Resolve Encounters, Resources, Manuscripts & Events
  // CRITICAL INVARIANT: All 5 physical entrances use the EXACT SAME probability model, environment catalogue, and pool catalogue!
  rollMyriadWorldsInstance(entranceId, actor, visitSalt = null) {
    const g = this.g;
    const ent = (MWD?.entrances || []).find(e => e.id === entranceId) || MWD?.entrances?.[0];
    if (!ent) return null;

    // Seed depends on realmSeed + unique visit sequence (NOT entranceId modulo or entity counter modulo!)
    const instanceSeq = this.state.nextSeq++;
    const seedKey = visitSalt !== null ? `visit:${visitSalt}` : `instance:${instanceSeq}:t:${Math.round(g.s.t * 10)}`;
    const rngStage1 = makeSeededGenerator(this.state.realmSeed).fork(`${seedKey}:stage1`);
    const rngStage2 = makeSeededGenerator(this.state.realmSeed).fork(`${seedKey}:stage2`);
    const rngStage3 = makeSeededGenerator(this.state.realmSeed).fork(`${seedKey}:stage3`);

    // STAGE 1: Choose Environment using identical global weights across all entrances
    const chosenEnv = weightedPick(MWD.environments, e => e.weight, rngStage1);

    // STAGE 2: Choose Coherent Pool belonging to chosenEnv
    const eligiblePools = MWD.pools.filter(p => p.environmentId === chosenEnv.id);
    const chosenPool = weightedPick(eligiblePools, p => p.weight, rngStage2);

    // STAGE 3: Generate Encounters, Resources, Manuscripts, and Events from within chosenPool
    const [minEnc, maxEnc] = chosenPool.encounterBudget || [2, 4];
    const encounterCount = rngStage3.int(minEnc, maxEnc);
    const catW = chosenPool.categoryWeights || { BEAST: 0.35, RESOURCE: 0.35, EVENT: 0.18, MANUSCRIPT: 0.12 };
    const categories = [
      { id: 'BEAST', w: catW.BEAST },
      { id: 'RESOURCE', w: catW.RESOURCE },
      { id: 'EVENT', w: catW.EVENT },
      { id: 'MANUSCRIPT', w: catW.MANUSCRIPT }
    ];

    const encounters = [];
    const usedBeastIds = new Set();
    const usedMatIds = new Set();
    const usedEventIds = new Set();

    for (let step = 0; step < encounterCount; step++) {
      const stepRng = rngStage3.fork(`step:${step}`);
      const catPick = weightedPick(categories, c => c.w, stepRng).id;

      if (catPick === 'BEAST') {
        // Check for rare rift anomaly first
        const isAnomaly = chosenPool.anomaly && stepRng.chance(chosenPool.anomaly.chance || 0.035);
        let beastCandidates = chosenPool.residentBeasts
          .filter(id => !usedBeastIds.has(id))
          .map(id => this.resolveSpecies(id))
          .filter(Boolean);
        if (!beastCandidates.length) {
          beastCandidates = chosenPool.residentBeasts.map(id => this.resolveSpecies(id)).filter(Boolean);
        }
        // Higher tier creatures are rarer: weight inversely by tier^1.45
        const pickedSpecies = isAnomaly
          ? (this.resolveSpecies(chosenPool.anomaly.displacedBeastId) || beastCandidates[0])
          : weightedPick(beastCandidates, b => 100 / Math.pow(Math.max(1, b.tier || 1), 1.45), stepRng);

        if (pickedSpecies) {
          usedBeastIds.add(pickedSpecies.id);
          const ind = this.generateBeastIndividual(pickedSpecies, `${seedKey}:b:${step}`, {
            mutationBoost: chosenPool.themeCode === 'ESSENCE_PHENOMENON' ? 2.2 : 1.0
          });
          encounters.push({
            stepIndex: step + 1,
            type: 'BEAST_ENCOUNTER',
            isAnomaly,
            anomalyReasonTh: isAnomaly ? chosenPool.anomaly.reasonTh : null,
            individual: ind,
            resolved: false,
            outcome: null
          });
        }
      } else if (catPick === 'RESOURCE') {
        let matCandidates = chosenPool.resourceEntries
          .filter(id => !usedMatIds.has(id))
          .map(id => this.resolveMaterial(id))
          .filter(Boolean);
        if (!matCandidates.length) {
          matCandidates = chosenPool.resourceEntries.map(id => this.resolveMaterial(id)).filter(Boolean);
        }
        const pickedMat = weightedPick(matCandidates, m => 100 / Math.pow(Math.max(1, m.tier || 1), 1.4), stepRng);
        if (pickedMat) {
          usedMatIds.add(pickedMat.id);
          const qtyRng = stepRng.fork('qty');
          const qualRng = stepRng.fork('qual');
          const baseQty = pickedMat.tier <= 2 ? qtyRng.int(1, 3) : (pickedMat.tier <= 4 ? qtyRng.int(1, 2) : 1);
          const qualRoll = qualRng.next();
          const quality = qualRoll < 0.15 ? 'PERFECT' : (qualRoll < 0.50 ? 'GOOD' : 'STANDARD');
          encounters.push({
            stepIndex: step + 1,
            type: 'RESOURCE_NODE',
            matId: pickedMat.id,
            nameTh: pickedMat.nameTh,
            tier: pickedMat.tier || 1,
            category: pickedMat.category,
            quantity: baseQty,
            quality,
            resolved: false
          });
        }
      } else if (catPick === 'EVENT') {
        const evCandidates = chosenPool.eventIds
          .filter(id => !usedEventIds.has(id))
          .map(id => MWD.eventMap.get(id))
          .filter(Boolean);
        const pickedEv = evCandidates.length
          ? weightedPick(evCandidates, e => e.weight || 15, stepRng)
          : MWD.explorationEvents[stepRng.int(0, MWD.explorationEvents.length - 1)];
        if (pickedEv) {
          usedEventIds.add(pickedEv.id);
          encounters.push({
            stepIndex: step + 1,
            type: 'EXPLORATION_EVENT',
            eventId: pickedEv.id,
            nameTh: pickedEv.nameTh,
            descTh: pickedEv.descTh,
            choices: copy(pickedEv.choices),
            resolved: false
          });
        }
      } else if (catPick === 'MANUSCRIPT') {
        const msKind = stepRng.chance(0.55) ? 'RECIPE' : 'MARTIAL_ART';
        const recList = chosenPool.recipeManuscripts || [];
        const pickedRecipeId = recList.length
          ? recList[stepRng.int(0, recList.length - 1)]
          : MWD.newRecipes[stepRng.int(0, MWD.newRecipes.length - 1)].id;
        encounters.push({
          stepIndex: step + 1,
          type: 'MANUSCRIPT_DISCOVERY',
          manuscriptKind: msKind,
          recipeId: msKind === 'RECIPE' ? pickedRecipeId : null,
          isFragment: stepRng.chance(0.35),
          mediumTh: ['ม้วนไม้ไผ่โบราณในค่ายร้าง', 'จารึกบนแผ่นหยกข้างโครงกระดูก', 'ภาพจิตรกรรมฝาผนังถ้ำ', 'บันทึกสนามของนักปรุงยาพเนจร'][stepRng.int(0, 3)],
          resolved: false
        });
      }
    }

    return {
      instanceId: `mw-exp-${instanceSeq}`,
      seedKey,
      entranceId: ent.id,
      entranceNameTh: ent.shortTh,
      environmentId: chosenEnv.id,
      environmentNameTh: chosenEnv.nameTh,
      environmentIcon: chosenEnv.icon,
      environmentHazardTh: chosenEnv.hazardTh,
      poolId: chosenPool.id,
      poolNameTh: chosenPool.nameTh,
      poolShortTh: chosenPool.shortTh,
      poolTheme: chosenPool.themeCode,
      dangerBase: chosenPool.dangerBase,
      npcId: actor?.id || null,
      createdAt: g.s.t,
      phase: 'PREPARED',
      encounters,
      logEntries: [],
      rewards: [],
      manuscripts: [],
      organsRecovered: [],
      unresolvedLeads: [],
      hpBefore: actor?.health || 100,
      hpAfter: actor?.health || 100,
      resourcesSpent: { stones: ent.fee, food: ent.food, herbsUsed: 0 },
      resolved: false
    };
  }

  // Execute & resolve a committed Myriad Worlds expedition instance using the NPC's 68-axis identity, capabilities, and needs
  resolveExpeditionInstance(npc, inst) {
    if (!inst || inst.resolved) return inst;
    const g = this.g;
    inst.resolved = true;
    inst.hpBefore = npc.health;

    // Record statistics & environment/pool discoveries
    this.state.stats.entrancesUsed[inst.entranceId] = (this.state.stats.entrancesUsed[inst.entranceId] || 0) + 1;
    this.state.stats.environmentsRolled[inst.environmentId] = (this.state.stats.environmentsRolled[inst.environmentId] || 0) + 1;
    this.state.stats.poolsRolled[inst.poolId] = (this.state.stats.poolsRolled[inst.poolId] || 0) + 1;

    if (!this.state.discoveredEnvironments[inst.environmentId]) {
      this.state.discoveredEnvironments[inst.environmentId] = {
        id: inst.environmentId,
        nameTh: inst.environmentNameTh,
        firstDiscovererId: npc.id,
        firstDiscovererName: npc.name,
        at: g.s.t,
        visits: 0
      };
      this.recordGlobalFirst('ENVIRONMENT', inst.environmentId, inst.environmentNameTh, npc);
    }
    this.state.discoveredEnvironments[inst.environmentId].visits++;

    if (!this.state.discoveredPools[inst.poolId]) {
      this.state.discoveredPools[inst.poolId] = {
        id: inst.poolId,
        environmentId: inst.environmentId,
        nameTh: inst.poolNameTh,
        firstDiscovererId: npc.id,
        firstDiscovererName: npc.name,
        at: g.s.t,
        visits: 0
      };
    }
    this.state.discoveredPools[inst.poolId].visits++;

    const rng = makeSeededGenerator(this.state.realmSeed).fork(`resolve:${inst.seedKey}`);
    const caution = npc.personality?.caution ?? 50;
    const courage = npc.personality?.courage ?? 50;
    const empathy = npc.personality?.empathy ?? 50;
    const curiosity = npc.personality?.curiosity ?? 50;
    const ambition = npc.personality?.ambition ?? 50;

    for (const enc of inst.encounters) {
      if (!alive(npc)) break;
      // Retreat check if severely injured mid-expedition
      if (npc.health < 28 + (caution - 50) * 0.25) {
        inst.logEntries.push({
          step: enc.stepIndex,
          kind: 'RETREAT',
          titleTh: 'ตัดสินใจถอนตัวเพื่อรักษาชีวิต',
          reasonTh: `บาดเจ็บเหลือพลังชีวิต ${Math.round(npc.health)} หน่วย และความระมัดระวัง (${Math.round(caution)}) เตือนไม่ให้ฝืนสำรวจต่อ`,
          outcomeTh: 'บันทึกเบาะแสตำแหน่งที่ยังไม่ได้สำรวจไว้กลับมาตั้งหลัก'
        });
        inst.unresolvedLeads.push(`ยังไม่ได้สำรวจขั้นตอนที่ ${enc.stepIndex} ใน ${inst.poolShortTh}`);
        break;
      }

      if (enc.type === 'BEAST_ENCOUNTER') {
        const ind = enc.individual;
        this.state.stats.beastsEncountered++;
        this.recordBeastDiscovery(npc, ind, 'ENCOUNTER');

        const npcPower = g.power(npc);
        const beastPower = g.combatSystem?.rating ? g.combatSystem.rating(ind) : ind.power;
        const powerRatio = npcPower / Math.max(80, beastPower);
        const wantsBeastPart = this.npcNeedsBeastPartsFrom(npc, ind);

        // Choose interaction affordance based on NPC 68-axis traits, relative power, beast temperament, and crafting needs
        let chosenAffordance = 'COMBAT';
        let choiceReasonTh = '';

        if (powerRatio < 0.62 && ind.affordances.includes('AVOID')) {
          chosenAffordance = 'AVOID';
          choiceReasonTh = `ประเมินพบว่า ${ind.nameTh} (${ind.ageLabelTh} · กำลังรบ ${beastPower}) แข็งแกร่งเกินตัว จึงใช้ความระมัดระวัง (${Math.round(caution)}) เร้นกายหลบเลี่ยง`;
        } else if (!ind.hostile && empathy >= 56 && !wantsBeastPart && ind.affordances.includes('OFFERING') && g.count(npc, 'MAT_HERB_DEW_GRASS_1') > 0) {
          chosenAffordance = 'OFFERING';
          choiceReasonTh = `เห็นว่า ${ind.nameTh} ไม่มีจิตมุ่งร้ายและผู้สำรวจมีเมตตา (${Math.round(empathy)}) จึงยื่นสมุนไพรผูกไมตรี`;
        } else if (!ind.hostile && curiosity >= 58 && !wantsBeastPart && ind.affordances.includes('OBSERVE')) {
          chosenAffordance = 'OBSERVE';
          choiceReasonTh = `ใช้ความใฝ่รู้ (${Math.round(curiosity)}) เฝ้าสังเกตนิเวศและเก็บคราบ/วัตถุดิบที่ผลัดตกโดยไม่สังหาร`;
        } else if (powerRatio >= 1.45 && caution >= 55 && !wantsBeastPart && ind.affordances.includes('INTIMIDATE')) {
          chosenAffordance = 'INTIMIDATE';
          choiceReasonTh = `แผ่ตบะที่เหนือกว่าข่มขวัญให้ ${ind.nameTh} ถอยหนีไปเพื่อประหยัดปราณศึก`;
        } else {
          chosenAffordance = 'COMBAT';
          choiceReasonTh = wantsBeastPart
            ? `ต้องการชิ้นส่วนของ ${ind.nameTh} ตามแผนหลอมสร้าง จึงตัดสินใจลงมือล่า`
            : `ความกล้าหาญ (${Math.round(courage)}) และตบะพร้อมรับมือ จึงเข้าปะทะกับ ${ind.nameTh}`;
        }

        enc.chosenAffordance = chosenAffordance;
        enc.resolved = true;

        if (chosenAffordance === 'AVOID') {
          this.state.stats.nonCombatResolutions++;
          const slipChance = clamp(0.65 + (H.effective(npc, 'body', 'agility') - 50) * 0.006, 0.35, 0.95);
          if (rng.chance(slipChance)) {
            E.recordTrackDaoEvidenceV1200(g.world, npc, 'EXPLORATION', 3);
            inst.logEntries.push({
              step: enc.stepIndex,
              kind: 'BEAST_AVOID',
              titleTh: `เร้นกายหลบเลี่ยง ${ind.nameTh} (${ind.ageLabelTh})`,
              reasonTh: choiceReasonTh,
              outcomeTh: `หลบพ้นรัศมีของอสูรได้อย่างปลอดภัย${ind.rareOrgan ? ' · สังเกตเห็นลางปราณพิเศษ: ' + ind.rareOrgan.auraHintTh : ''}`
            });
          } else {
            const glanceDmg = Math.round(6 + beastPower / Math.max(120, npcPower) * 10);
            g.damage(npc, glanceDmg, null);
            inst.logEntries.push({
              step: enc.stepIndex,
              kind: 'BEAST_AVOID_GRAZED',
              titleTh: `ถอนตัวจาก ${ind.nameTh} อย่างฉิวเฉียด`,
              reasonTh: choiceReasonTh,
              outcomeTh: `ถูกคลื่นปราณเฉี่ยวชนบาดเจ็บ ${glanceDmg} หน่วย แต่สลัดหลุดออกมาได้`
            });
          }
        } else if (chosenAffordance === 'OFFERING' || chosenAffordance === 'OBSERVE' || chosenAffordance === 'INTIMIDATE') {
          this.state.stats.nonCombatResolutions++;
          if (chosenAffordance === 'OFFERING') {
            g.consume(npc, 'MAT_HERB_DEW_GRASS_1', 1);
            inst.resourcesSpent.herbsUsed++;
          }
          E.recordTrackDaoEvidenceV1200(g.world, npc, 'EXPLORATION', 5);
          // Harvest shed remains or receive peaceful gift
          const shedDrop = ind.anatomyParts?.[0];
          let shedRewardText = 'ได้รับความเข้าใจในท่วงท่าธรรมชาติของอสูร';
          if (shedDrop) {
            const s = this.settleMaterialReward(npc, shedDrop.matId, 1, {
              quality: 'GOOD',
              sourceLabel: `เก็บคราบ/ของขวัญจาก${ind.nameTh}`,
              originType: 'MYRIAD_SHED_HARVEST',
              originId: inst.poolId
            });
            inst.rewards.push(s);
            shedRewardText = `ได้ ${s.nameTh} ×1 (${s.quality}) โดยไม่ต้องฆ่า`;
          }
          inst.logEntries.push({
            step: enc.stepIndex,
            kind: `BEAST_${chosenAffordance}`,
            titleTh: `${chosenAffordance === 'OFFERING' ? 'ผูกไมตรีแลกเปลี่ยนกับ' : chosenAffordance === 'INTIMIDATE' ? 'แผ่ปราณข่มขวัญ' : 'เฝ้าสังเกตและเก็บคราบ'} ${ind.nameTh}`,
            reasonTh: choiceReasonTh,
            outcomeTh: shedRewardText
          });
        } else {
          // COMBAT & DELIBERATE ANATOMICAL HARVEST (Integrated with Combat v1.17 Loadout, Combos & Beast Hooks)
          this.state.stats.combatResolutions++;
          const csSys = g.combatSystem;
          const activeEntries = csSys?.activeArts ? csSys.activeArts(npc) : [];
          const csState = csSys?.ensure(npc);
          const attackEntries = activeEntries.filter(e => ['attack', 'control', 'forbidden'].includes(e.role) && (!csSys?.ready || csSys.ready(npc,e,csState)));
          const hasFireSensitivePart = (ind.anatomyParts || []).some(p => p.damagedByFire) || ind.rareOrgan?.anatomyType === 'SPIRIT_HAIR_FEATHER';
          const hasCrushSensitivePart = (ind.anatomyParts || []).some(p => p.damagedByCrush) || ind.rareOrgan?.anatomyType === 'HEART_GALL';
          const carefulHarvester = caution >= 52 || H.effective(npc, 'cognition', 'attention') >= 58;

          // Select tactical technique from equipped v1.17 loadout (avoiding corpse-damaging fire/crush techniques if carefulHarvester has an alternative!)
          let chosenEntry = attackEntries[0] || null;
          if (carefulHarvester && attackEntries.length > 1) {
            const safeEntry = attackEntries.find(e => {
              const m = csSys?.mechanics ? csSys.mechanics(e.art) : {};
              const idStr = (e.art.id || '') + ' ' + (e.art.subPath || '') + ' ' + (e.art.element || '');
              const isFire = m.tags?.includes('FIRE') || /FIRE|FLAME|BURN|SOLAR/i.test(idStr);
              const isCrush = /TITAN|TIGER|VAJRA|METEOR|BLUNT/i.test(idStr);
              return (!hasFireSensitivePart || !isFire) && (!hasCrushSensitivePart || !isCrush);
            });
            if (safeEntry) chosenEntry = safeEntry;
          }

          // Check combo synergy & counter-hooks in active loadout
          const setups = new Set(), consumes = new Set();
          for (const e of activeEntries) {
            const m = csSys?.mechanics ? csSys.mechanics(e.art) : {};
            if (m.setup) setups.add(m.setup);
            if (m.consume) consumes.add(m.consume);
          }
          const hasActiveCombo = [...setups].some(tag => consumes.has(tag));
          const tacticalBonus = Math.min(0.14, attackEntries.length * 0.02 + (hasActiveCombo ? 0.06 : 0));

          const preview = csSys?.encounterPreview?.(npc,ind,chosenEntry);
          const winChance = preview ? clamp(preview.winChance+tacticalBonus*.5,0.12,0.96) : clamp(0.52+(powerRatio-1)*.38+tacticalBonus,0.15,0.96);
          if(chosenEntry&&csState&&csSys.applyResourceCost(npc,chosenEntry,csState)){
            csState.lastArtId=chosenEntry.art.id;csState.lastRole=chosenEntry.role;csState.lastMoveName=csSys.moveName(chosenEntry,csState);csState.lastMoveAt=g.s.t;
            csState.cooldowns[chosenEntry.art.id]=g.s.t+csSys.cooldownSeconds(chosenEntry.art);csState.globalReadyAt=g.s.t+csSys.cadence(npc);
            csState.moveCount++;csState.movesUsed++;
            csState.history.push({t:g.s.t,artId:chosenEntry.art.id,name:csState.lastMoveName,role:chosenEntry.role,targetId:ind.individualId,qi:csState.qi,reason:'ปะทะจริงในแดนหมื่นภพ',offmap:true});
            csState.history=csState.history.slice(-32);
          }
          enc.combat201={npcPower,beastPower,winChance,artId:chosenEntry?.art?.id||null,npcStats:preview?.npc,beastStats:preview?.beast};
          const won = rng.chance(winChance);
          const rawDmg = won
            ? Math.round(clamp(preview ? preview.expectedConditionDamage*.65 : 5+(beastPower/Math.max(100,npcPower))*8.5,3,24))
            : Math.round(clamp(preview ? preview.expectedConditionDamage*1.25 : 14+(beastPower/Math.max(100,npcPower))*16,10,36));
          // Disciples use emergency talisman/lightness retreat before fatal blow unless cornered at <12 HP
          const dmgTaken = npc.health > 18 ? Math.min(rawDmg, Math.max(4, Math.floor(npc.health - 14))) : rawDmg;

          g.damage(npc, dmgTaken, null, true, {combat201:true,type:'encounter'});
          if (!alive(npc)) {
            inst.logEntries.push({
              step: enc.stepIndex,
              kind: 'DEATH_IN_COMBAT',
              titleTh: `พ่ายแพ้และสิ้นชีพในการปะทะกับ ${ind.nameTh}`,
              reasonTh: choiceReasonTh,
              outcomeTh: 'บาดเจ็บเกินขีดจำกัดและสิ้นชีพในแดนหมื่นภพ'
            });
            break;
          }

          if (won) {
            g.s.stats.kills++;
            E.recordTrackDaoEvidenceV1200(g.world, npc, 'COMBAT', 7);
            let dmgTag = 'SLASH';
            if (chosenEntry?.art) {
              const m = csSys?.mechanics ? csSys.mechanics(chosenEntry.art) : {};
              const idStr = (chosenEntry.art.id || '') + ' ' + (chosenEntry.art.subPath || '') + ' ' + (chosenEntry.art.element || '');
              if (m.tags?.includes('FIRE') || /FIRE|FLAME|BURN|SOLAR/i.test(idStr)) dmgTag = 'FIRE';
              else if (/TITAN|TIGER|VAJRA|METEOR|BLUNT/i.test(idStr)) dmgTag = 'CRUSH';
              else if (/VENOM|POISON|DEMON/i.test(idStr)) dmgTag = 'POISON';
              for (const eqId of new Set([chosenEntry.art.id, ...(npc.jianghu?.attackArtIds || [])])) {
                const k = npc.jianghu?.knowledgeV190?.[eqId];
                if (k && k.stage >= 4) {
                  k.mastery = Math.min(100, (k.mastery || 8) + (eqId === chosenEntry.art.id ? 2.5 : 1.2));
                  k.stage = k.mastery >= 60 ? 6 : k.mastery >= 30 ? 5 : 4;
                  npc.jianghu.artMasteryV150[eqId] = k.mastery;
                }
              }
            }
            this.recordDamageTypeOnBeast(ind, npc, dmgTag, preview?.skillDamage);
            const harvestRes = this.harvestIndividualCorpse(npc, ind, {
              originType: 'MYRIAD_BEAST_HUNT',
              originId: inst.poolId
            });
            for (const item of harvestRes.items) {
              inst.rewards.push(item);
            }
            if (harvestRes.organResult) {
              inst.organsRecovered.push(harvestRes.organResult);
            }
            const organNote = harvestRes.organResult
              ? (harvestRes.organResult.recovered
                  ? ` · 🌟 ผ่าพบอวัยวะกลายพันธุ์หายาก «${harvestRes.organResult.nameTh}»!`
                  : ` · พบร่องรอยอวัยวะพิเศษแต่${harvestRes.organResult.reasonTh}`)
              : '';
            inst.logEntries.push({
              step: enc.stepIndex,
              kind: 'BEAST_HUNT_SUCCESS',
              titleTh: `ปราบและชำแหละ ${ind.nameTh} (${ind.ageLabelTh})`,
              reasonTh: choiceReasonTh,
              outcomeTh: `บาดเจ็บ ${dmgTaken} หน่วย · ชำแหละได้ชิ้นส่วน ${harvestRes.items.length} รายการ (ทักษะชำแหละ ${harvestRes.dissectionSkill})${organNote}`
            });
          } else {
            inst.logEntries.push({
              step: enc.stepIndex,
              kind: 'BEAST_HUNT_SETBACK',
              titleTh: `ปะทะกับ ${ind.nameTh} แล้วต้องล่าถอย`,
              reasonTh: choiceReasonTh,
              outcomeTh: `บาดเจ็บ ${dmgTaken} หน่วย อสูรแข็งแกร่งเกินคาดจึงต้องถอยร่น`
            });
            inst.unresolvedLeads.push(`${ind.nameTh} (${ind.ageLabelTh}) ยังคงครองพื้นที่ใน ${inst.poolShortTh}`);
          }
        }
      } else if (enc.type === 'RESOURCE_NODE') {
        enc.resolved = true;
        const settlement = this.settleMaterialReward(npc, enc.matId, enc.quantity, {
          quality: enc.quality,
          sourceLabel: `เก็บเกี่ยวจาก${inst.poolShortTh}`,
          originType: 'MYRIAD_RESOURCE_NODE',
          originId: inst.poolId
        });
        inst.rewards.push(settlement);
        E.recordTrackDaoEvidenceV1200(g.world, npc, 'RESOURCE_GATHERING', 4);
        inst.logEntries.push({
          step: enc.stepIndex,
          kind: 'RESOURCE_GATHER',
          titleTh: `ค้นพบแหล่งทรัพยากร: ${enc.nameTh}`,
          reasonTh: `สำรวจพบใน ${inst.poolShortTh} และใช้ความชำนาญเก็บเกี่ยวอย่างระมัดระวัง`,
          outcomeTh: `ได้รับ ${enc.nameTh} ×${enc.quantity} (${enc.quality} · ${settlement.status})`
        });
      } else if (enc.type === 'MANUSCRIPT_DISCOVERY') {
        enc.resolved = true;
        if (enc.manuscriptKind === 'RECIPE' && enc.recipeId) {
          const ms = this.grantRecipeManuscript(npc, enc.recipeId, 'MYRIAD_POOL_MANUSCRIPT', `${enc.mediumTh} ใน ${inst.poolShortTh}`, {
            isFragment: enc.isFragment
          });
          if (ms) {
            inst.manuscripts.push({ id: ms.id, nameTh: ms.nameTh, kind: ms.kind, recipeId: ms.recipeId });
            inst.logEntries.push({
              step: enc.stepIndex,
              kind: 'RECIPE_MANUSCRIPT_FOUND',
              titleTh: `ค้นพบ${ms.nameTh}`,
              reasonTh: `สังเกตเห็น${enc.mediumTh}ซ่อนอยู่ใน ${inst.poolShortTh}`,
              outcomeTh: `เก็บเข้าสัมภาระส่วนตัวของ ${npc.name} เพื่อรอขบคิดตีความ`
            });
          }
        } else {
          const scroll = g.progression?.grantScroll(npc, `${enc.mediumTh} ใน ${inst.environmentNameTh}`, npc, {
            danger: inst.dangerBase
          });
          if (scroll) {
            inst.manuscripts.push({ id: scroll.id, nameTh: scroll.nameTh, kind: 'MARTIAL_SCROLL', artId: scroll.artId, rarityBadgeTh: scroll.rarityBadgeTh });
            inst.logEntries.push({
              step: enc.stepIndex,
              kind: 'MARTIAL_MANUSCRIPT_FOUND',
              titleTh: `ค้นพบคัมภีร์ยุทธ์ «${scroll.nameTh}»`,
              reasonTh: `ค้นพบจาก${enc.mediumTh} ด้วยความช่างสังเกต`,
              outcomeTh: `ได้รับคัมภีร์ระดับ${scroll.rarityBadgeTh || 'สามัญ'} เป็นมรดกส่วนตัว`
            });
          }
        }
      } else if (enc.type === 'EXPLORATION_EVENT') {
        enc.resolved = true;
        this.state.stats.eventsResolved++;
        // Score event choices using NPC's personality & value traits
        const choices = enc.choices || [];
        let bestChoice = choices[0];
        let bestScore = -999;
        for (const ch of choices) {
          let sc = 50;
          for (const [k, w] of Object.entries(ch.traitBias || {})) {
            const val = npc.personality?.[k] ?? npc.core?.values?.[k] ?? 50;
            sc += (val - 50) * w;
          }
          if (sc > bestScore) {
            bestScore = sc;
            bestChoice = ch;
          }
        }
        const evRes = this.executeExplorationEventOutcome(npc, inst, enc, bestChoice, rng);
        inst.logEntries.push({
          step: enc.stepIndex,
          kind: 'EVENT_RESOLVED',
          titleTh: `เหตุการณ์สำรวจ: ${enc.nameTh}`,
          reasonTh: `เลือก «${bestChoice.labelTh}» ตามอุปนิสัยและค่านิยมของ ${npc.name}`,
          outcomeTh: evRes.summaryTh
        });
      }
    }

    inst.hpAfter = npc.health;
    inst.phase = alive(npc) ? 'RETURNING' : 'DEAD';
    return inst;
  }

  executeExplorationEventOutcome(npc, inst, enc, choice, rng) {
    const g = this.g;
    const pool = MWD.poolMap.get(inst.poolId) || MWD.pools[0];
    const out = choice?.outcome || 'GAIN_MATERIALS';

    if (out === 'GAIN_FRAGMENT_AND_RUMOR' || out === 'SAFE_RECIPE_FRAGMENT') {
      const recId = pool.recipeManuscripts?.[0] || MWD.newRecipes[rng.int(0, MWD.newRecipes.length - 1)].id;
      const ms = this.grantRecipeManuscript(npc, recId, 'ABANDONED_CAMP_NOTE', `บันทึกจาก${enc.nameTh}`, { isFragment: true, fragmentPct: 60 });
      this.spawnMyriadRumor(npc, inst.environmentId, `เบาะแสจาก${enc.nameTh}`);
      return { summaryTh: `ได้${ms ? ms.nameTh : 'เศษบันทึกโบราณ'} และเบาะแสข่าวลือของ${inst.environmentNameTh}` };
    }
    if (out === 'GAIN_RECIPE_SCROLL' || out === 'GAIN_FORGE_RECIPE' || out === 'GAIN_RECIPE_AND_HERBS') {
      const recId = pool.recipeManuscripts?.[rng.int(0, Math.max(0, (pool.recipeManuscripts?.length || 1) - 1))] || MWD.newRecipes[rng.int(0, MWD.newRecipes.length - 1)].id;
      const ms = this.grantRecipeManuscript(npc, recId, 'RUIN_INSCRIPTION', `${enc.nameTh} ใน ${inst.environmentNameTh}`, { isFragment: false });
      if (ms) inst.manuscripts.push({ id: ms.id, nameTh: ms.nameTh, kind: ms.kind, recipeId: ms.recipeId });
      return { summaryTh: `คัดลอกและกู้คืน «${ms?.nameTh || 'ตำรับโบราณ'}» สำเร็จ` };
    }
    if (out === 'RARE_ORGAN_HARVEST' || out === 'GIFT_RARE_ORGAN_OR_SCROLL' || out === 'RARE_FUNGUS_AND_ORGAN') {
      const organ = MWD.rareOrgans[rng.int(0, MWD.rareOrgans.length - 1)];
      const s = this.settleMaterialReward(npc, organ.matId, 1, {
        quality: 'PERFECT',
        sourceLabel: `${enc.nameTh}`,
        originType: organ.tier >= 6 ? 'HERITAGE_SITE' : 'EVENT_REWARD',
        originId: organ.tier >= 6 ? 'LEG_MYRIAD_WORLDS' : inst.poolId
      });
      inst.rewards.push(s);
      this.recordOrganDiscovery(npc, organ, pool.residentBeasts?.[0] || 'MW_BEAST_001', true);
      this.state.stats.organsRecovered++;
      return { summaryTh: `ได้รับอวัยวะพิเศษหายาก «${organ.nameTh}» ในสภาพสมบูรณ์!` };
    }
    if (out === 'GAIN_MANUAL_OR_FOUNDATION' || out === 'UNLOCK_PAVILION_SCROLL' || out === 'GAIN_COMPLETE_INHERITANCE') {
      const sc = g.progression?.grantScroll(npc, `${enc.nameTh} (${inst.environmentNameTh})`, npc, { danger: inst.dangerBase + 15 });
      if (sc) inst.manuscripts.push({ id: sc.id, nameTh: sc.nameTh, kind: 'MARTIAL_SCROLL', artId: sc.artId });
      E.recordTrackDaoEvidenceV1200(g.world, npc, 'STUDY', 8);
      return { summaryTh: sc ? `ได้รับการถ่ายทอด «${sc.nameTh}» และหลักฐานความเข้าใจเต๋า` : 'ซึมซับเจตจำนงปรมาจารย์โบราณ เพิ่มพูนหลักฐานเต๋า' };
    }
    if (out === 'HEAL_AND_QI_RESTORE' || out === 'MASSIVE_CULTIVATION_GAIN' || out === 'BODY_AND_QI_BOOST') {
      npc.health = Math.min(100, npc.health + 24);
      const cs = g.combatSystem?.ensure(npc);
      const qiRestored = cs ? Math.min(24, Math.max(0, cs.maxQi - cs.qi)) : 0;
      if (cs) {
        cs.qi += qiRestored;
        npc.jianghu.currentQiV190 = cs.qi;
        npc.jianghu.maxQiV190 = cs.maxQi;
      }
      E.applyNpcCultivationProgressGain(g.world, npc, 6.5);
      E.recordTrackDaoEvidenceV1200(g.world, npc, 'PRACTICE', 6);
      return { summaryTh: `ฟื้นฟูพลังชีวิต +24 · ปราณ +${Math.round(qiRestored)} และเพิ่มพูนตบะจากกระแสปราณธรรมชาติ` };
    }

    // Default material/stone reward from pool
    const matId = pool.resourceEntries?.[rng.int(0, Math.max(0, (pool.resourceEntries?.length || 1) - 1))] || 'MW_MAT_HERB_001';
    const s = this.settleMaterialReward(npc, matId, 2, {
      quality: 'GOOD',
      sourceLabel: `${enc.nameTh}`,
      originType: 'MYRIAD_EVENT',
      originId: inst.poolId
    });
    inst.rewards.push(s);
    E.addSpiritStonesV140(npc, 18);
    return { summaryTh: `ได้รับ ${s.nameTh} ×2 และศิลาวิญญาณ 18 ก้อน` };
  }

  spawnMyriadRumor(npc, envId, sourceLabel = 'คำบอกเล่าจากผู้กลับจากแดนหมื่นภพ') {
    const env = MWD.environmentMap.get(envId) || MWD.environments[0];
    if (!env) return null;
    const r = {
      id: this.nextId('mw-rumor'),
      npcId: npc?.id || null,
      environmentId: env.id,
      environmentNameTh: env.nameTh,
      source: sourceLabel,
      createdAt: this.g.s.t,
      expiresAt: this.g.s.t + 600,
      hintTh: `มีผู้พบเห็นร่องรอยของ ${env.nameTh} และสมุนไพร/อสูรธาตุ${env.element}`
    };
    this.state.rumors.unshift(r);
    this.state.rumors.splice(40);
    return r;
  }

  npcNeedsBeastPartsFrom(npc, ind) {
    const q = npc?.stageLocal?.growth;
    if (!q) return false;
    const r = this.g.progression?.recipe(q.plan?.targetId) || this.g.progression?.recipe(q.careerPlan?.targetId);
    if (!r) return false;
    const neededIds = new Set(r.inputs.filter(i => this.g.count(npc, i.matId) < i.count).map(i => i.matId));
    return (ind.anatomyParts || []).some(p => neededIds.has(p.matId));
  }

  // ============================================================================
  // AUTONOMOUS NPC DECISION OPTIONS & ACTION LIFECYCLE
  // ============================================================================
  options(npc, add) {
    const g = this.g;
    const p = npc.stageLocal;
    if (!alive(npc) || !p || p.offmap || p.journey || p.action === 'seclusion' || p.mode === 'combat') return;
    if (g.nearestEnemy(npc, 450) || npc.health < 62 || p.needs.hunger > 68 || (npc.core?.condition?.fatigue || 0) > 65) return;

    const hall = g.built('hall');
    const school = g.built('shrine') || g.built('training') || hall;

    // 1. Recover fallen disciple belongings if any exist on the map
    const unclaimedRemains = this.state.fallenRemains.find(r => !r.claimed);
    if (unclaimedRemains) {
      add('recoverFallenBelongings', 56 + (npc.personality?.loyalty || 50) * 0.15, {
        id: unclaimedRemains.id,
        x: unclaimedRemains.x,
        y: unclaimedRemains.y
      }, 6, { loyalty: 0.35, empathy: 0.30 }, {
        mwTargetId: unclaimedRemains.id,
        reason: `เก็บกู้สัมภาระและคัมภีร์ของ ${unclaimedRemains.deceasedName} ไม่ให้สูญหาย`
      });
    }

    // 2. Claim deferred overflow items when space is available
    if (this.state.deferredClaims.length > 0 && hall && (H.carryLimit(npc) - H.load(npc) >= 2)) {
      add('claimDeferredLoot', 46, g.endpoint(hall), 4, { discipline: 0.25 }, {
        reason: `เบิกวัตถุดิบตกค้างจากแดนหมื่นภพ (${this.state.deferredClaims.length} รายการ)`
      });
    }

    // 3. Study unread Recipe Manuscript in personal bag
    const carriedScrolls = npc.jianghu.ledgerV140?.scrolls || [];
    const storedScrolls = carriedScrolls.length < 24 ? [
      ...(g.bank?.jianghu?.ledgerV140?.scrolls || []).filter(s => s.ownerNpcId === npc.id),
      ...this.state.deferredClaims.filter(c => c.ownerNpcId === npc.id && c.item).map(c => c.item)
    ] : [];
    const unreadManuscript = [...carriedScrolls, ...storedScrolls].find(
      s => (s.kind === 'RECIPE_MANUSCRIPT' || s.kind === 'RECIPE_FRAGMENT') && (s.understanding || 0) < 100
    );
    if (unreadManuscript && school) {
      add('studyRecipeManuscript', 53 + (g.s.policy === 'craft' ? 14 : 0), g.endpoint(school), 14, {
        curiosity: 0.30,
        rationality: 0.25,
        discipline: 0.25
      }, {
        mwTargetId: unreadManuscript.id,
        reason: `ขบคิดตีความ «${unreadManuscript.nameTh}» (${unreadManuscript.understanding || 0}%)`
      });
    }

    // 4. Property-Based Recipe Experimentation (considers NPC caution vs poisonous experiments!)
    if (school && !g.academy?.activeProjectForNpc(npc)) {
      const expCandidate = this.findEligibleExperimentForNpc(npc);
      if (expCandidate) {
        const at = g.built(expCandidate.workshop === 'alchemy' ? 'alchemy' : 'forge') || school;
        const hasCatalyst = expCandidate.optionalCatalystMatId && (g.count(npc, expCandidate.optionalCatalystMatId) > 0 || g.count(g.bank, expCandidate.optionalCatalystMatId) > 0);
        const cautionAdj = expCandidate.poisonous ? -((npc.personality?.caution || 50) - 50) * 0.25 : 4;
        add('experimentPropertyRecipe', 42 + (g.s.policy === 'craft' ? 16 : 0) + (hasCatalyst ? 10 : 0) + cautionAdj, g.endpoint(at), 16, {
          curiosity: 0.35,
          creativity: 0.30,
          rationality: 0.25
        }, {
          mwTargetId: expCandidate.id,
          reason: `${expCandidate.hypothesisTh}${hasCatalyst ? ' · มีอวัยวะพิเศษเป็นตัวเร่ง' : ''}`
        });
      }
    }

    // 5. Autonomous Expedition into แดนหมื่นภพ (Myriad Worlds) via any of the 5 physical entrances
    const fee = 14;
    const aliveHeroes = g.heroes.filter(alive).length;
    const awayCount = g.heroes.filter(h => alive(h) && h.stageLocal?.offmap).length;
    const canLeaveSectSafely = aliveHeroes >= 3 ? (awayCount < Math.ceil(aliveHeroes * 0.4)) : (g.s.chapterCleared && awayCount === 0);
    const canAffordTrip = (g.s.realm?.travelFund >= fee || E.getSpiritStonesV140(npc) >= 65) && g.s.food >= 6 && npc.health >= 78 && (npc.core?.condition?.fatigue || 0) < 48 && p.needs.hunger < 48;
    const activeMwForNpc = this.state.activeExpeditions.some(x => x.npcId === npc.id);
    if (canLeaveSectSafely && canAffordTrip && !activeMwForNpc && hall && !g.routeBlocked()) {
      const entrances = MWD?.entrances || [];
      const entIdx = Math.abs((npc.id.charCodeAt(npc.id.length - 1) || 0) + this.state.nextSeq) % Math.max(1, entrances.length);
      const chosenEnt = entrances[entIdx] || entrances[0];
      if (chosenEnt) {
        const q = p.growth;
        const hasMissingMat = q?.needs?.some(nd => nd.missing && nd.missing.length > 0);
        const stSlot = g.progression?.inspectSlotAndComboState?.(npc);
        const seeksArt = (stSlot?.openAttackSlots > 0 || stSlot?.unpairedSetups?.length > 0 || q?.seekingArtGoal?.sourceKind === 'MYRIAD_WORLDS');
        const hasRumor = this.state.rumors.some(r => r.expiresAt > g.s.t);
        const motivationBonus = (hasMissingMat ? 11 : 0) + (seeksArt ? 7 : 0) + (hasRumor ? 6 : 0) + (g.s.policy === 'trade' ? 10 : g.s.policy === 'defend' ? -15 : 0);
        const motivationReason = hasMissingMat
          ? 'ออกตามหาวัตถุดิบและชิ้นส่วนอสูรที่ขาดแคลนตามตำรับ'
          : (seeksArt ? `ออกตามหาคัมภีร์ยุทธ์และมรดกเพื่อเติมช่องวิชา (${stSlot?.filledAttackSlots || 1}/${stSlot?.attackCapacity || 1})` : (hasRumor ? 'ตามเบาะแสข่าวลือสภาพแวดล้อมในแดนหมื่นภพ' : 'สำรวจนิเวศ สมุนไพร แร่ และมรดกในแดนหมื่นภพ'));

        add('enterMyriadWorlds', 39 + motivationBonus, g.endpoint(hall), 6, {
          curiosity: 0.35,
          courage: 0.25,
          ambition: 0.20
        }, {
          mwEntranceId: chosenEnt.id,
          risk: 28,
          reason: `${chosenEnt.shortTh} · ${motivationReason} (เสบียง 2 · ค่าทาง ${fee} ศิลา)`
        });
      }
    }
  }

  findEligibleExperimentForNpc(npc) {
    const g = this.g;
    const q = npc.stageLocal?.growth;
    if (!q || !MWD?.experimentDesigns) return null;
    const caution = npc.personality?.caution ?? 50;
    const curiosity = npc.personality?.curiosity ?? 50;

    for (const d of MWD.experimentDesigns) {
      if (q.knownRecipes.includes(d.id) || q.knownRecipes.includes(d.linkedCatalogRecipeId)) continue;
      if (g.progression.tier(npc) < d.tier) continue;
      // Cautious researcher avoids poisonous experiments unless curiosity/ambition is very high
      if (d.poisonous && caution > 68 && curiosity < 65) continue;
      const act = d.workshop === 'alchemy' ? 'alchemy' : 'forging';
      if (H.capacity(npc, act).total < d.min) continue;
      const hasInputs = d.trialInputs.every(inp => (g.count(npc, inp.matId) + g.count(g.bank, inp.matId)) >= inp.count);
      if (hasInputs && (E.getSpiritStonesV140(npc) >= 6 || (g.s.growth?.researchFund || 0) >= 6)) {
        return d;
      }
    }
    return null;
  }

  readyForDeparture(npc) {
    return alive(npc) && npc.health >= 78 && (npc.core?.condition?.fatigue || 0) < 48 && (npc.stageLocal?.needs?.hunger || 0) < 48;
  }

  cancelPreparation(npc, inst) {
    if (!inst || inst.phase !== 'TO_ENTRANCE' || inst.preparationRefunded) return false;
    inst.preparationRefunded = true;
    inst.phase = 'CANCELLED';
    inst.cancelledAt = this.g.s.t;
    const paid = Math.max(0, Number(inst.paid) || 0);
    if (inst.funder === 'travelFund' && this.g.s.realm) this.g.s.realm.travelFund += paid;
    else E.addSpiritStonesV140(npc, paid);
    this.g.s.food += Math.max(0, Number(inst.food) || 0);
    this.state.activeExpeditions = this.state.activeExpeditions.filter(x => x.instanceId !== inst.instanceId);
    if (npc.stageLocal.mwExpeditionId === inst.instanceId) npc.stageLocal.mwExpeditionId = null;
    return true;
  }

  finish(npc, action) {
    const g = this.g;
    const p = npc.stageLocal;
    const fail = { handled: true, success: false };

    if (action === 'recoverFallenBelongings') {
      const r = this.recoverFallenRemains(npc, p.mwTargetId);
      return { handled: true, success: r.ok, cooldown: 20 };
    }

    if (action === 'claimDeferredLoot') {
      const r = this.claimDeferredItems(npc);
      if (r.ok) g.note(`${npc.name} เบิกของตกค้างจากแดนหมื่นภพเข้าคลังสำเร็จ (${r.moved} ชิ้น)`, npc);
      return { handled: true, success: r.ok, cooldown: 20 };
    }

    if (action === 'studyRecipeManuscript') {
      const r = this.studyRecipeManuscript(npc, p.mwTargetId);
      return { handled: true, success: r.ok, cooldown: 18 };
    }

    if (action === 'experimentPropertyRecipe') {
      const d = (MWD?.experimentDesigns || []).find(x => x.id === p.mwTargetId);
      if (!d) return fail;
      // An NPC can arrive after another researcher has used shared ingredients.
      // Validate the entire trial before committing its fee or any input.
      const required = new Map();
      for (const inp of d.trialInputs) required.set(inp.matId, (required.get(inp.matId) || 0) + inp.count);
      const inputPlan = [];
      for (const [matId, count] of required) {
        const personal = Math.min(count, g.count(npc, matId));
        const warehouse = count - personal;
        if (g.count(g.bank, matId) < warehouse) return fail;
        inputPlan.push({ matId, personal, warehouse });
      }
      // Pay 6 stones
      if (E.getSpiritStonesV140(npc) >= 6) E.addSpiritStonesV140(npc, -6);
      else if ((g.s.growth?.researchFund || 0) >= 6) g.s.growth.researchFund -= 6;
      else return fail;

      // Consume trial inputs from personal bag or bank
      for (const inp of inputPlan) {
        if (inp.personal > 0) g.consume(npc, inp.matId, inp.personal);
        if (inp.warehouse > 0) g.consume(g.bank, inp.matId, inp.warehouse);
      }

      // Check optional rare organ catalyst
      let usedCatalyst = false;
      if (d.optionalCatalystMatId) {
        if (g.count(npc, d.optionalCatalystMatId) > 0 && g.consume(npc, d.optionalCatalystMatId, 1)) usedCatalyst = true;
        else if (g.count(g.bank, d.optionalCatalystMatId) > 0 && g.consume(g.bank, d.optionalCatalystMatId, 1)) usedCatalyst = true;
      }

      this.state.stats.recipesExperimented++;
      const act = d.workshop === 'alchemy' ? 'alchemy' : 'forging';
      const cap = H.capacity(npc, act).total;
      const priorBonus = (p.growth?.archivedResearchNotes || []).some(x => x.formulaId === d.id) ? 0.14 : 0;
      const catBonus = usedCatalyst ? (d.optionalCatalystBonusChance || 0.18) : 0;
      const chance = clamp(0.38 + (cap - d.min) * 0.008 + priorBonus + catBonus, 0.25, 0.94);
      const roll = g.rng.next();

      // Progressive property revelation even on failure!
      for (const tag of (d.requiredPropertyTags || [])) {
        this.state.propertyKnowledge[tag] = (this.state.propertyKnowledge[tag] || 0) + 1;
      }

      if (roll < chance) {
        // Register discovered formula in g.s.growth.formulaRegistry and NPC's knownRecipes
        if (!g.s.growth.formulaRegistry.some(f => f.id === d.id)) {
          g.s.growth.formulaRegistry.push({
            id: d.id,
            ownerNpcId: npc.id,
            knownBy: [npc.id],
            revision: 1,
            createdAt: g.s.t,
            recipe: copy(d.recipe)
          });
        }
        if (!p.growth.knownRecipes.includes(d.id)) p.growth.knownRecipes.push(d.id);
        if (d.linkedCatalogRecipeId) {
          this.grantRecipeManuscript(npc, d.linkedCatalogRecipeId, 'RESEARCH_DISCOVERY', `คิดค้นจากการทดลองคุณสมบัติโดย ${npc.name}`);
          this.studyRecipeManuscript(npc, d.linkedCatalogRecipeId);
        }
        H.learn(npc, 'researchFormula', 3);
        g.note(`${npc.name} ทดลองคุณสมบัติสำเร็จ ค้นพบ «${d.name}»${usedCatalyst ? ' (เร่งปฏิกิริยาด้วยอวัยวะพิเศษ)' : ''}!`, npc);
        return { handled: true, success: true, cooldown: 30 };
      } else {
        // Archive failure evidence without clogging scroll slots; apply mild poison if poisonous experiment failed
        p.growth.archivedResearchNotes = p.growth.archivedResearchNotes || [];
        p.growth.archivedResearchNotes.push({
          formulaId: d.id,
          at: g.s.t,
          revealedTags: copy(d.requiredPropertyTags || []),
          reasonTh: 'สัดส่วนไฟและคุณสมบัติตัวยายังไม่สมดุล แต่ได้ข้อมูลคุณสมบัติเพิ่มเติม'
        });
        if (d.poisonous) {
          npc.jianghu.poisonAccumulated = clamp((npc.jianghu.poisonAccumulated || 0) + 8, 0, 100);
        }
        H.learn(npc, 'researchFormula', 1);
        g.note(`${npc.name} ทดลอง «${d.name}» ยังไม่สำเร็จ แต่ได้บันทึกคุณสมบัติ (${(d.requiredPropertyTags || []).join(', ')}) เก็บเข้าแฟ้มวิจัย`, npc);
        return { handled: true, success: false, cooldown: 35 };
      }
    }

    if (action === 'enterMyriadWorlds') {
      if (!this.readyForDeparture(npc)) return fail;
      const entId = p.mwEntranceId || MWD?.entrances?.[0]?.id;
      const ent = (MWD?.entrances || []).find(e => e.id === entId) || MWD?.entrances?.[0];
      const hall = g.built('hall');
      if (!ent || !hall || dist(p, g.endpoint(hall)) > 150 || g.s.food < ent.food || p.journey) return fail;

      const personalPay = E.getSpiritStonesV140(npc) >= ent.fee && E.getSpiritStonesV140(npc) >= 48;
      if (!personalPay && (g.s.realm?.travelFund || 0) < ent.fee) return fail;
      if (personalPay) E.addSpiritStonesV140(npc, -ent.fee);
      else g.s.realm.travelFund -= ent.fee;
      g.s.food -= ent.food;

      // Commit the persisted expedition instance right now so reloading cannot freely reroll it!
      const inst = this.rollMyriadWorldsInstance(ent.id, npc);
      inst.funder = personalPay ? npc.id : 'travelFund';
      inst.paid = ent.fee;
      inst.food = ent.food;
      inst.phase = 'TO_ENTRANCE';
      this.state.activeExpeditions.push(inst);
      p.mwExpeditionId = inst.instanceId;

      g.send(npc, 'departMyriadWorlds', { id: ent.id, x: ent.x, y: ent.y }, 1);
      g.realm?.speak(npc, `เตรียมเสบียงพร้อมแล้ว ข้าจะมุ่งหน้าสู่${ent.shortTh}เพื่อเข้าสำรวจแดนหมื่นภพ`, 'journey');
      return { handled: true, success: true, keepAction: true };
    }

    if (action === 'departMyriadWorlds') {
      const inst = this.state.activeExpeditions.find(x => x.instanceId === p.mwExpeditionId);
      const ent = (MWD?.entrances || []).find(e => e.id === inst?.entranceId) || MWD?.entrances?.[0];
      if (!inst || inst.phase !== 'TO_ENTRANCE' || !ent) return fail;
      if (!this.readyForDeparture(npc)) { this.cancelPreparation(npc, inst); return fail; }
      if (dist(p, ent) > 140) return fail;

      inst.phase = 'EXPLORING';
      inst.departedAt = g.s.t;
      inst.returnAt = g.s.t + (ent.duration || 36);
      p.offmap = { kind: 'myriadWorlds', until: inst.returnAt, instanceId: inst.instanceId };
      p.mode = 'offmap';
      p.target = null;
      p.route = [];
      npc.currentCityId = null;
      g.note(`${npc.name} ก้าวผ่าน «${ent.shortTh}» เข้าสู่แดนหมื่นภพ`, npc);
      return { handled: true, success: true, keepAction: true };
    }

    if (action === 'returnMyriadWorlds') {
      const inst = this.state.activeExpeditions.find(x => x.instanceId === p.mwExpeditionId)
        || this.state.completedExpeditions.find(x => x.instanceId === p.mwExpeditionId);
      const market = root.SectLifeSystem?.MARKET || { x: 600, y: 2040 };
      if (!inst || dist(p, market) > 150) return fail;

      inst.phase = 'COMPLETE';
      inst.completedAt = g.s.t;
      p.mwExpeditionId = null;
      this.state.activeExpeditions = this.state.activeExpeditions.filter(x => x.instanceId !== inst.instanceId);
      if (!this.state.completedExpeditions.some(x => x.instanceId === inst.instanceId)) {
        this.state.completedExpeditions.unshift(inst);
        this.state.completedExpeditions.splice(60);
      }

      const rewardCount = inst.rewards.reduce((s, r) => s + (r.quantity || 0), 0);
      const msCount = inst.manuscripts.length;
      const hadGain = rewardCount > 0 || msCount > 0 || inst.organsRecovered.some(o => o.recovered);
      g.life?.credit(npc, hadGain ? 4 : 1, 'กลับจากการสำรวจแดนหมื่นภพ');
      if (hadGain) {
        g.remember(npc, 'enterMyriadWorlds', 7, `สำรวจ ${inst.environmentNameTh} (${inst.poolShortTh}) ได้ของ ${rewardCount} ชิ้น`);
      } else {
        g.remember(npc, 'enterMyriadWorlds', -3, `สำรวจ ${inst.environmentNameTh} แล้วต้องถอนตัวกลับมาตั้งหลัก`);
      }
      g.note(`${npc.name} กลับจากแดนหมื่นภพ (${inst.environmentNameTh} · ${inst.poolShortTh}) ได้วัตถุดิบ ${rewardCount} ชิ้น${msCount ? ' · คัมภีร์/ตำรับ ' + msCount + ' ฉบับ' : ''}`, npc);
      p.cooldowns.enterMyriadWorlds = g.s.t + 95;
      return { handled: true, success: hadGain, cooldown: 95 };
    }

    return null;
  }

  handleOffmap(npc) {
    const p = npc.stageLocal;
    if (p?.offmap?.kind !== 'myriadWorlds') return false;
    const inst = this.state.activeExpeditions.find(x => x.instanceId === p.offmap.instanceId);
    if (!inst) {
      p.offmap = null;
      p.mode = 'idle';
      return false;
    }
    if (this.g.s.t < inst.returnAt) return true;

    if (!inst.resolved) {
      this.resolveExpeditionInstance(npc, inst);
    }
    if (!alive(npc)) {
      p.offmap = null;
      p.mwExpeditionId = null;
      this.state.activeExpeditions = this.state.activeExpeditions.filter(x => x.instanceId !== inst.instanceId);
      this.state.completedExpeditions.unshift(inst);
      return true;
    }

    const ent = (MWD?.entrances || []).find(e => e.id === inst.entranceId) || root.SectLifeSystem?.EXIT || { x: 180, y: 1850 };
    const market = root.SectLifeSystem?.MARKET || { x: 600, y: 2040 };
    p.offmap = null;
    npc.currentCityId = this.g.city;
    p.x = ent.x;
    p.y = ent.y;
    inst.phase = 'RETURNING';
    this.g.send(npc, 'returnMyriadWorlds', market, 1);
    return true;
  }

  beforeHero(npc) {
    const p = npc.stageLocal;
    if (!p?.mwExpeditionId) return;
    const inst = this.state.activeExpeditions.find(x => x.instanceId === p.mwExpeditionId);
    if (inst && inst.phase === 'TO_ENTRANCE' && p.action !== 'departMyriadWorlds') this.cancelPreparation(npc, inst);
  }
}

const LABELS = {
  enterMyriadWorlds: 'เตรียมสำรวจแดนหมื่นภพ',
  departMyriadWorlds: 'ก้าวสู่แดนหมื่นภพ',
  returnMyriadWorlds: 'กลับจากแดนหมื่นภพ',
  dissectBeastCorpse: 'ชำแหละและตรวจค้นกายวิภาคอสูร',
  experimentPropertyRecipe: 'ทดลองวิจัยคุณสมบัติตำรับ',
  studyRecipeManuscript: 'ขบคิดตีความบันทึกตำรับ',
  claimDeferredLoot: 'เบิกของตกค้างจากแดนหมื่นภพ',
  recoverFallenBelongings: 'เก็บกู้มรดกผู้ล่วงลับ'
};

const api = {
  MyriadWorldsSystem,
  LABELS,
  makeSeededGenerator,
  weightedPick,
  weightedSampleWithoutReplacement
};

root.JianghuMyriadWorlds = api;
if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
