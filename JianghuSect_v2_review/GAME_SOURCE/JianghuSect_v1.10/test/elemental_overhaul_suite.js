'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, ELEM, HC, CULT, MARTIAL, AI, U } = G;
let checks = 0;
function check(condition, message) {
  assert.ok(condition, message);
  checks++;
}
function resetCultivation(n, sub = 'SWORD_IMMORTAL', stage = 6) {
  n.h.constitution = 'CONST_MORTAL_BALANCED';
  n.cult = {
    path: 'XIAN', sub, stage, prog: 0, mantra: null, techs: [],
    unlockedMantras: [], learning: null, tm: {}, toxic: 0,
    lifeBonus: 0, attempts: 0, pillT: 0, pillBoost: 0
  };
  ELEM.ensureNpc(n);
  n.ext.elementalSystem.specialMastery = { ASTRAL: 0, BLOOD_DEMON: 0 };
  n.ext.elementalSystem.specialAccess = {};
  ELEM.syncSpecialAccess(n);
  return n;
}

// 1. Exact root-count traits and per-root grades.
for (let k = 1; k <= 4; k++) {
  const elements = ELEM.ORDINARY_ELEMENTS.slice(0, k);
  const grades = Array.from({ length: k }, (_, i) => ELEM.GRADE_ORDER[i + 1]);
  const root = ELEM.rollBirthRoots(new U.RNG('elemental-exact-' + k), {
    forceRootCount: k, forceElements: elements, forceGrades: grades
  });
  check(root.rootCount === k, 'forced root count ' + k + ' is exact');
  check(root.elements.length === k && root.grades.length === k, 'root and grade arrays align for count ' + k);
  check(root.rootCapacityTrait === ELEM.ROOT_CAPACITY_TRAITS[k], 'correct capacity trait for count ' + k);
  check(ELEM.isCanonicalRootObject(root), 'root object is fully canonical for count ' + k);
}

// Duplicate/invalid forced elements must not silently collapse the requested root count.
const forcedDuplicate = ELEM.rollBirthRoots(new U.RNG('forced-duplicate'), {
  forceRootCount: 3, forceElements: ['FIRE', 'FIRE', 'ASTRAL'], forceGrades: ['HEAVENLY', 'TRUE', 'SPIRIT']
});
check(forcedDuplicate.rootCount === 3, 'forced duplicate/special elements are replaced with distinct ordinary roots');
check(new Set(forcedDuplicate.elements).size === 3 && forcedDuplicate.elements.every(ELEM.isValidOrdinaryElement), 'forced roots contain only distinct ordinary elements');

// 1.1 World-scale rarity must match the user-confirmed intervals at the measured generated-character rate.
const rootProbTotal = Object.values(ELEM.ROOT_COUNT_PROBABILITIES).reduce((a, b) => a + b, 0);
check(Math.abs(rootProbTotal - 1) < 1e-12, 'root-count probabilities sum to exactly 1');
check(ELEM.GENERATED_CHARACTERS_PER_WORLD_YEAR === 390, 'world rarity uses the rounded 390 generated-character appearances per 360-day world-year calibration');
check(Math.abs(ELEM.ROOT_COUNT_PROBABILITIES[4] - 1 / (ELEM.GENERATED_CHARACTERS_PER_WORLD_YEAR * 10000)) < 1e-12, 'four-root generation rate is one per 10,000 world years');
check(Math.abs(ELEM.ROOT_COUNT_PROBABILITIES[2] - 0.02) < 1e-12 && Math.abs(ELEM.ROOT_COUNT_PROBABILITIES[3] - 0.001) < 1e-12, 'dual roots are rare and triple roots are twenty times rarer than dual roots');
for (let count = 1; count <= 4; count++) {
  const probabilitySum = Object.values(ELEM.ROOT_GRADE_PROBABILITIES[count]).reduce((a,b)=>a+b,0);
  check(Math.abs(probabilitySum - 1) < 1e-12, 'conditional grade cohort probabilities sum to one for ' + count + ' roots');
}
const rarity2HH = ELEM.classifyRarity(['FIRE', 'WIND'], ['HEAVENLY', 'HEAVENLY']);
const rarity2HT = ELEM.classifyRarity(['FIRE', 'WIND'], ['HEAVENLY', 'TRUE']);
const rarity2HS = ELEM.classifyRarity(['FIRE', 'WIND'], ['HEAVENLY', 'SPIRIT']);
const rarity3HTS = ELEM.classifyRarity(['FIRE', 'WIND', 'WATER_ICE'], ['HEAVENLY', 'TRUE', 'SPIRIT']);
const rarity3HHS = ELEM.classifyRarity(['FIRE', 'WIND', 'WATER_ICE'], ['HEAVENLY', 'HEAVENLY', 'SPIRIT']);
const rarity3HHH = ELEM.classifyRarity(['FIRE', 'WIND', 'WATER_ICE'], ['HEAVENLY', 'HEAVENLY', 'HEAVENLY']);
const rarity4Common = ELEM.classifyRarity(['FIRE', 'WIND', 'WATER_ICE', 'WOOD_LIFE'], ['MORTAL', 'MORTAL', 'MORTAL', 'MORTAL']);
const rarity4Heaven = ELEM.classifyRarity(['FIRE', 'WIND', 'WATER_ICE', 'WOOD_LIFE'], ['HEAVENLY', 'HEAVENLY', 'HEAVENLY', 'HEAVENLY']);
check(rarity2HH.expectedWorldYears === 100, 'two Heavenly roots are classified at the 100-year interval');
check(rarity2HT.expectedWorldYears === 5 && rarity2HS.expectedWorldYears === 5, 'Dual Heavenly + True/Spirit share the every-few-years genius band');
check(rarity3HTS.expectedWorldYears === 100, 'Triple 1 Heavenly + 2 True/Spirit is classified at 100 years');
check(rarity3HHS.expectedWorldYears >= 100 && rarity3HHS.expectedWorldYears <= 1000 && rarity3HHS.expectedWorldYears === 500, 'Triple 2 Heavenly + 1 True/Spirit is within the 100–1,000-year band');
check(rarity3HHH.expectedWorldYears === 1000, 'Triple Heavenly roots are classified at 1,000 years');
check(Math.abs(rarity4Common.expectedWorldYears - (10000 / 0.995)) < 0.01 && rarity4Heaven.expectedWorldYears === 2000000, 'four-root cohort is 10,000 years overall; non-four-Heavenly composition and four-Heavenly subtype are derived from the same conditional probability');

// Conditional deterministic sampling validates grade-composition calibration without
// requiring millions of births for the exceptionally rare four-root count itself.
function sampleForcedRootGrades(rootCount, samples, seed) {
  const rng = new U.RNG(seed), counts = Object.create(null);
  const order = ['HEAVENLY', 'TRUE', 'SPIRIT', 'MORTAL', 'DEFECTIVE'];
  for (let i = 0; i < samples; i++) {
    const profile = ELEM.rollBirthRoots(rng, { forceRootCount: rootCount });
    const key = profile.grades.slice().sort((a, b) => order.indexOf(a) - order.indexOf(b)).join('+');
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}
const dualSamples = sampleForcedRootGrades(2, 50000, 'dual-rarity-calibration-v2');
const dualHighMix = (dualSamples['HEAVENLY+TRUE'] || 0) + (dualSamples['HEAVENLY+SPIRIT'] || 0);
check(dualHighMix >= 1180 && dualHighMix <= 1380, 'Dual Heavenly + True/Spirit generator matches its 2.564% conditional target at 390 generated characters/year');
const tripleSamples = sampleForcedRootGrades(3, 50000, 'triple-rarity-calibration-v2');
const tripleOneHeaven = Object.entries(tripleSamples).filter(([key]) => key.startsWith('HEAVENLY+') && key.split('+').filter(x => x === 'TRUE' || x === 'SPIRIT').length === 2).reduce((a, [, v]) => a + v, 0);
check(tripleOneHeaven >= 1180 && tripleOneHeaven <= 1380, 'Triple 1 Heavenly + 2 True/Spirit generator matches its 2.564% conditional target at 390 generated characters/year');
const fourSamples = sampleForcedRootGrades(4, 50000, 'fourfold-rarity-calibration-v2');
check((fourSamples['HEAVENLY+HEAVENLY+HEAVENLY+HEAVENLY'] || 0) >= 200 && (fourSamples['HEAVENLY+HEAVENLY+HEAVENLY+HEAVENLY'] || 0) <= 300, 'Fourfold all-Heavenly subtype remains extremely rare at 0.5% conditional probability');

// 2. Strict edit validation.
check(!ELEM.validateRootSpec({ rootCount: 2, rootCapacityTrait: 'TR_ROOT_CAPACITY_TRIPLE', elements: ['FIRE', 'WIND'], grades: ['HEAVENLY', 'SPIRIT'] }).ok, 'rejects mismatched exact-count trait');
check(!ELEM.validateRootSpec({ rootCount: 2, rootCapacityTrait: 'TR_ROOT_CAPACITY_UNKNOWN', elements: ['FIRE', 'WIND'], grades: ['HEAVENLY', 'SPIRIT'] }).ok, 'rejects unknown root-capacity trait');
check(!ELEM.validateRootSpec({ rootCount: 2, elements: ['FIRE', 'FIRE'], grades: ['HEAVENLY', 'SPIRIT'] }).ok, 'rejects duplicate roots');
check(!ELEM.validateRootSpec({ rootCount: 1, elements: ['ASTRAL'], grades: ['HEAVENLY'] }).ok, 'rejects special elements as ordinary birth roots');
check(!ELEM.validateRootSpec({ rootCount: 1, elements: ['FIRE'], grades: ['GODLIKE'] }).ok, 'rejects unknown per-root grade');
check(ELEM.setRootProfile(null, { rootCount: 1, elements: ['FIRE'], grades: ['MORTAL'] }).ok === false, 'safe failure when root editor receives no character');

// 3. Repair malformed version-2 root snapshots deterministically.
const W = SIM.create('elemental-overhaul-suite', { masterIdx: 0 });
const n = W.npcs[0];
ELEM.ensureNpc(n);
const originalElements = n.h.root.elements.slice();
const originalCount = n.h.root.rootCount;
n.h.root.grades[0] = 'INVALID_GRADE';
n.h.root.roots = [];
ELEM.invalidateNpcCache(n);
ELEM.ensureNpc(n);
check(ELEM.isCanonicalRootObject(n.h.root), 'ensureNpc repairs invalid grades and missing root display mirrors');
check(n.h.root.rootCount === originalCount && JSON.stringify(n.h.root.elements) === JSON.stringify(originalElements), 'root repair preserves valid root identities and count');
check(n.h.root.grades[0] === 'MORTAL', 'invalid grade is safely downgraded rather than retained');

// 4. Repair incomplete elemental progression state without breaking save-safe logs.
const sys = n.ext.elementalSystem;
sys.mastery = null;
sys.specialMastery = null;
sys.dailyGainLog = { day: 'bad-day', byElement: [], seenKeys: {} };
ELEM.invalidateNpcCache(n);
ELEM.ensureNpc(n);
check(ELEM.ORDINARY_ELEMENTS.every(el => Number.isFinite(n.ext.elementalSystem.mastery[el])), 'repairs missing ordinary mastery fields');
check(ELEM.SPECIAL_ELEMENTS.every(el => Number.isFinite(n.ext.elementalSystem.specialMastery[el])), 'repairs missing special mastery fields');
check(Number.isFinite(n.ext.elementalSystem.dailyGainLog.day) && !Array.isArray(n.ext.elementalSystem.dailyGainLog.byElement) && Array.isArray(n.ext.elementalSystem.dailyGainLog.seenKeys), 'repairs malformed mastery event log');

// 5. Affinity presentation groups reuse the original 23-key affinity object.
check(ELEM.AFFINITY_GROUPS.ELEMENTAL.length === 8, 'exactly eight elemental affinity keys');
check(ELEM.AFFINITY_GROUPS.NON_ELEMENTAL.length === 15, 'exactly fifteen non-elemental aptitude keys');
check(new Set(ELEM.AFFINITY_GROUPS.ELEMENTAL.concat(ELEM.AFFINITY_GROUPS.NON_ELEMENTAL)).size === 23, 'affinity UI groups contain 23 unique keys without overlap');
check(ELEM.AFFINITY_GROUPS.ELEMENTAL.every(k => Object.prototype.hasOwnProperty.call(n.h.affinities, k)) && ELEM.AFFINITY_GROUPS.NON_ELEMENTAL.every(k => Object.prototype.hasOwnProperty.call(n.h.affinities, k)), 'both UI groups read keys from the existing h.affinities object');

// 6. Context-specific multipliers must not confuse combat, cultivation and equipment.
ELEM.setRootProfile(n, {
  rootCount: 1, rootCapacityTrait: 'ROOT_CAPACITY_SINGLE',
  elements: ['FIRE'], grades: ['HEAVENLY']
});
// Repeated or imported duplicate capacity traits must be normalized to exactly one.
n.h.traits.push({ id: 'TR_ROOT_CAPACITY_DUAL', lv: 1 }, { id: 'TR_ROOT_CAPACITY_DUAL', lv: 1 });
ELEM.invalidateNpcCache(n);
ELEM.ensureNpc(n);
check(n.h.traits.filter(t => t && t.id === 'TR_ROOT_CAPACITY_DUAL').length === 0, 'single-root characters cannot retain stale dual-root traits');
ELEM.setRootProfile(n, { rootCount: 2, rootCapacityTrait: 'TR_ROOT_CAPACITY_DUAL', elements: ['FIRE', 'WIND'], grades: ['TRUE', 'SPIRIT'] });
n.h.traits.push({ id: 'TR_ROOT_CAPACITY_DUAL', lv: 1 });
ELEM.invalidateNpcCache(n);
ELEM.ensureNpc(n);
check(n.h.traits.filter(t => t && t.id === 'TR_ROOT_CAPACITY_DUAL').length === 1, 'ensureNpc deduplicates the correct root-capacity trait');
ELEM.setRootProfile(n, { rootCount: 1, rootCapacityTrait: 'ROOT_CAPACITY_SINGLE', elements: ['FIRE'], grades: ['HEAVENLY'] });
const fireDef = { id: 'TEST_FIRE_CONTEXT', element: 'FIRE', elementProfile: { mode: 'INTRINSIC_SINGLE', primary: 'FIRE', weights: { FIRE: 1 } } };
const combatFit = ELEM.resolveCompatibility(n, fireDef, 'combat');
const cultFit = ELEM.resolveCompatibility(n, fireDef, 'cultivation');
const gearFit = ELEM.resolveCompatibility(n, fireDef, 'equipment');
const studyFit = ELEM.resolveCompatibility(n, fireDef, 'learning');
check(cultFit.multiplier === cultFit.cultivationMultiplier, 'cultivation context selects cultivation multiplier');
check(gearFit.multiplier === gearFit.equipmentSuitabilityMult, 'equipment context selects equipment suitability multiplier');
check(studyFit.multiplier === studyFit.studySpeedMultiplier, 'learning context selects study-speed multiplier');
check(combatFit.multiplier === combatFit.combatMultiplier, 'combat context selects combat multiplier');
const cultExplanation = ELEM.explainCompatibility(n, fireDef, 'CULTIVATION_TICK');
check(cultExplanation.summaryTh.includes('×' + cultExplanation.multiplier.toFixed(2)), 'compatibility explanation displays the active context multiplier, not always combat');
const weightedAttack = { id: 'TEST_WEIGHTED_ATTACK', elementProfile: { mode: 'INTRINSIC_WEIGHTED', primary: 'WOOD_LIFE', weights: { WOOD_LIFE: 0.2, FIRE: 0.2, EARTH_METAL: 0.2, WATER_ICE: 0.2, WIND: 0.2 } } };
const waterDefender = { h: { root: { primaryElement: 'WATER_ICE' } } };
const weightedCounter = ELEM.combatElementalMatchup(n, waterDefender, weightedAttack);
const expectedWeightedCounter = (ELEM.COUNTER_MATRIX.WOOD_LIFE.WATER_ICE + ELEM.COUNTER_MATRIX.FIRE.WATER_ICE + 1 + 1 + 1) / 5;
check(Math.abs(weightedCounter - expectedWeightedCounter) < 1e-12 && weightedCounter !== ELEM.COUNTER_MATRIX.WOOD_LIFE.WATER_ICE, 'multi-element combat counters use declared element weights instead of primary element only');
const neutralFit = ELEM.resolveCompatibility(n, { id: 'TEST_NEUTRAL', elementProfile: { mode: 'EXPLICIT_NON_ELEMENTAL', primary: 'NEUTRAL', weights: {} } }, 'equipment');
check(neutralFit.multiplier === 1 && neutralFit.equipmentSuitabilityMult === 1, 'explicitly non-elemental equipment bypasses root penalties and bonuses');

// 7. Existing weapon-type synergy remains active for non-elemental gear.
resetCultivation(n, 'SWORD_IMMORTAL', 6);
n.cult.techs = ['TECH_SWORD_OF_TIME_PRIMORDIAL'];
const neutralSword = { id: 'TEST_NEUTRAL_SWORD', slot: 'WEAPON', gearType: 'SWORD', elementProfile: { mode: 'EXPLICIT_NON_ELEMENTAL', primary: 'NEUTRAL', weights: {} }, st: { atk: 12, matk: 3, def: 0, mdef: 0, hp: 0, crit: 0, critDmg: 0, pen: 0, cast: 0, eva: 0, acc: 0 }, dur: 100 };
const neutralBow = Object.assign({}, neutralSword, { id: 'TEST_NEUTRAL_BOW', gearType: 'BOW' });
const swordSuit = MARTIAL.gearSuitability(n, neutralSword);
const bowSuit = MARTIAL.gearSuitability(n, neutralBow);
check(Number.isFinite(swordSuit.score) && Number.isFinite(bowSuit.score), 'gear suitability still evaluates both compatible and mismatched weapon types');
check(swordSuit.fit > bowSuit.fit, 'sword technique and sword equipment synergy remains stronger than mismatched bow');

// 8. Directed learning graph stays separate from combat efficacy.
check(ELEM.LEARNING_GRAPH.WOOD_LIFE.WATER_ICE !== ELEM.LEARNING_GRAPH.WATER_ICE.WOOD_LIFE, 'learning relation is directed, not implicitly symmetric');
const fiveProfile = ELEM.getProfile(CULT.subInfo('XIAN', 'FIVE_ELEMENTS'));
check(fiveProfile.valid && Math.abs(Object.values(fiveProfile.weights).reduce((a, b) => a + b, 0) - 1) < 1e-9, 'weighted subpath element profile is normalized');

// 9. Special-element access updates after learning a subpath, retraining and studying a technique.
const nLearn = resetCultivation(W.npcs[1], 'SWORD_IMMORTAL', 6);
check(!nLearn.ext.elementalSystem.specialAccess.ASTRAL.unlocked, 'ordinary character starts without astral access');
MARTIAL.applyKnowledge(W, nLearn, MARTIAL.knowledge('S:ASTRAL_ARRAY'));
check(nLearn.cult.sub === 'ASTRAL_ARRAY' && nLearn.ext.elementalSystem.specialAccess.ASTRAL.unlocked, 'learning an astral subpath refreshes special access immediately');

const nRetrain = resetCultivation(W.npcs[2], 'SWORD_IMMORTAL', 6);
nRetrain.inv.subManuals = ['ASTRAL_ARRAY'];
nRetrain.cp = 100000;
const retrainResult = MARTIAL.retrain(W, nRetrain, 'S:ASTRAL_ARRAY', { source: 'personalManual' });
check(retrainResult.ok && nRetrain.cult.sub === 'ASTRAL_ARRAY', 'retraining into a special subpath succeeds through the existing retraining system');
check(nRetrain.ext.elementalSystem.specialAccess.ASTRAL.unlocked, 'retraining refreshes special-element access immediately');

const nStudy = resetCultivation(W.npcs[0], 'NONE', 7);
nStudy.cult.learning = { id: 'TECH_SWORD_OF_TIME_PRIMORDIAL', need: 1, got: 0.9999 };
W.t = 1;
const studyResult = AI.ACTS.study.tick(nStudy, W);
check(studyResult === 'done' && nStudy.cult.techs.includes('TECH_SWORD_OF_TIME_PRIMORDIAL'), 'NPC study action completes and learns the special technique');
check(nStudy.ext.elementalSystem.specialAccess.ASTRAL.unlocked, 'NPC study completion refreshes special-element access immediately');

const nMantra = resetCultivation(W.npcs[1], 'SWORD_IMMORTAL', 6);
nMantra.cult.unlockedMantras = ['MANTRA_SOUL_COSMIC_VOID_SAGE'];
nMantra.cult.mantra = 'MANTRA_SOUL_BODHI_WISDOM';
ELEM.syncSpecialAccess(nMantra);
check(nMantra.ext.elementalSystem.specialAccess.ASTRAL.unlocked, 'learned special mantras grant access even when another mantra is currently equipped');

// 10. Elemental mastery is action-based, deduplicated, capped and separate from technique mastery.
const nMastery = resetCultivation(W.npcs[2], 'SWORD_IMMORTAL', 6);
nMastery.cult.tm = { TECH_EXAMPLE: 17 };
nMastery.ext.elementalSystem.mastery.FIRE = 0;
nMastery.ext.elementalSystem.dailyGainLog = { day: W.day, byElement: {}, seenKeys: [] };
ELEM.invalidateNpcCache(nMastery);
const firstGain = ELEM.gainMastery(nMastery, 'FIRE', 0.5, W, { sourceId: 'dedup-test' });
const repeatGain = ELEM.gainMastery(nMastery, 'FIRE', 0.5, W, { sourceId: 'dedup-test' });
check(firstGain.gained > 0 && repeatGain.deduplicated === true && repeatGain.gained === 0, 'same action event cannot grant elemental mastery twice');
for (let i = 0; i < 100; i++) ELEM.gainMastery(nMastery, 'FIRE', 0.5, W, { sourceId: 'daily-cap-' + i });
check(nMastery.ext.elementalSystem.dailyGainLog.byElement.FIRE <= ELEM.MAX_DAILY_GAIN + 1e-8, 'elemental mastery respects the per-day gain cap');
check(nMastery.cult.tm.TECH_EXAMPLE === 17, 'elemental mastery does not overwrite technique-specific mastery');

// 11. Root identity and progression survive a new-schema save/load round trip.
const rootBeforeSave = JSON.parse(JSON.stringify(nMastery.h.root));
const loaded = SIM.deserialize(SIM.serialize(W));
const loadedNpc = loaded.byId[nMastery.id];
check(loadedNpc && ELEM.isCanonicalRootObject(loadedNpc.h.root), 'new-schema save/load preserves a canonical root object');
check(JSON.stringify(loadedNpc.h.root) === JSON.stringify(rootBeforeSave), 'root identity and per-root grades survive save/load exactly');

// 12. Legendary content remains registered after the elemental integration.
check(G.VC && G.VC.LEGENDARY_WEAPONS && G.VC.LEGENDARY_WEAPONS.length === 11, 'all eleven legendary weapons remain registered');
const legendaryTechs = G.JD.TECH.techniques.filter(t => t.legendary);
const legendaryMantras = G.JD.TECH.mantras.filter(t => t.legendary);
check(legendaryTechs.length === 12 && legendaryMantras.length === 10, 'all twelve legendary techniques and ten legendary mantras remain registered');

console.log('PASS elemental_overhaul_suite: ' + checks + '/' + checks + ' focused assertions; root validation, progression, special access, compatibility contexts, equipment synergy and save integrity verified');
