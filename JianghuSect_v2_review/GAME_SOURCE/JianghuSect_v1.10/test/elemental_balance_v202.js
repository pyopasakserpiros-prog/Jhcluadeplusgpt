'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, ELEM, HC, U, JD } = G;
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
function near(a, b, epsilon = 1e-8) { return Math.abs(a - b) <= epsilon; }
function sortedGradeKey(grades) {
  const order = ['HEAVENLY', 'TRUE', 'SPIRIT', 'MORTAL', 'DEFECTIVE'];
  return grades.slice().sort((a,b)=>order.indexOf(a)-order.indexOf(b)).join('+');
}
function sampleForcedGrades(rootCount, samples, seed) {
  const rng = new U.RNG(seed), counts = Object.create(null);
  for (let i=0;i<samples;i++) {
    const profile = ELEM.rollBirthRoots(rng, { forceRootCount: rootCount });
    const key = sortedGradeKey(profile.grades);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

// 1. Root-count and conditional-grade probability distributions are normalized.
const rootProbabilitySum = Object.values(ELEM.ROOT_COUNT_PROBABILITIES).reduce((a,b)=>a+b,0);
check(near(rootProbabilitySum,1), 'root-count probabilities sum to one');
check(ELEM.GENERATED_CHARACTERS_PER_WORLD_YEAR === 390, 'rarity calibration uses 390 generated character appearances per 360-day world-year');
check(near(ELEM.ROOT_COUNT_PROBABILITIES[2],0.02), 'dual-root characters are a 2% generation cohort');
check(near(ELEM.ROOT_COUNT_PROBABILITIES[3],0.001), 'triple-root characters are a 0.1% generation cohort');
check(near(ELEM.ROOT_COUNT_PROBABILITIES[4],1/(390*10000)), 'four-root characters remain one generation in 10,000 world-years');
for (let k=1;k<=4;k++) {
  check(near(Object.values(ELEM.ROOT_GRADE_PROBABILITIES[k]).reduce((a,b)=>a+b,0),1), 'conditional grade cohorts sum to one for ' + k + ' roots');
}

// 2. Rarity display is derived from the same root-count × conditional-grade probability used by generation.
const r1H = ELEM.classifyRarity(['FIRE'],['HEAVENLY']);
const r1T = ELEM.classifyRarity(['FIRE'],['TRUE']);
const r2HH = ELEM.classifyRarity(['FIRE','WIND'],['HEAVENLY','HEAVENLY']);
const r2HT = ELEM.classifyRarity(['FIRE','WIND'],['HEAVENLY','TRUE']);
const r2HS = ELEM.classifyRarity(['FIRE','WIND'],['HEAVENLY','SPIRIT']);
const r3HTS = ELEM.classifyRarity(['FIRE','WIND','WATER_ICE'],['HEAVENLY','TRUE','SPIRIT']);
const r3HHS = ELEM.classifyRarity(['FIRE','WIND','WATER_ICE'],['HEAVENLY','HEAVENLY','SPIRIT']);
const r3HHH = ELEM.classifyRarity(['FIRE','WIND','WATER_ICE'],['HEAVENLY','HEAVENLY','HEAVENLY']);
const r4Other = ELEM.classifyRarity(['FIRE','WIND','WATER_ICE','WOOD_LIFE'],['MORTAL','MORTAL','MORTAL','MORTAL']);
const r4HHHH = ELEM.classifyRarity(['FIRE','WIND','WATER_ICE','WOOD_LIFE'],['HEAVENLY','HEAVENLY','HEAVENLY','HEAVENLY']);
check(r1H.expectedWorldYears === 5, 'single Heavenly root remains a five-year event');
check(r1T.expectedWorldYears === 0.71, 'single True root retains its declared world-scale interval');
check(r2HT.expectedWorldYears === 5 && r2HS.expectedWorldYears === 5, 'dual Heavenly + True/Spirit remains a five-year genius cohort');
check(r2HH.expectedWorldYears === 100, 'dual Heavenly roots remain a 100-year genius cohort');
check(r3HTS.expectedWorldYears === 100, 'triple one-Heavenly + two True/Spirit remains a 100-year cohort');
check(r3HHS.expectedWorldYears === 500, 'triple two-Heavenly + one True/Spirit remains a 500-year cohort');
check(r3HHH.expectedWorldYears === 1000, 'triple Heavenly roots remain a 1,000-year cohort');
check(near(r4Other.expectedWorldYears,10000/0.995,0.01), 'non-four-Heavenly four-root cohort is derived from the 10,000-year all-four-root event');
check(r4HHHH.expectedWorldYears === 2000000, 'four Heavenly roots remain a two-million-year subtype without a unique-person cap');
for (const rarity of [r1H,r1T,r2HH,r2HT,r2HS,r3HTS,r3HHS,r3HHH,r4Other,r4HHHH]) {
  check(rarity.expectedBirths === rarity.expectedCharacters, 'legacy expectedBirths alias matches expected generated-character appearances');
  check(near(rarity.expectedWorldYears, rarity.expectedCharacters / ELEM.GENERATED_CHARACTERS_PER_WORLD_YEAR, 0.00011), 'displayed world interval is derived from generated-character appearances');
}

// 3. Forced-count conditional sampling validates rare grade cohorts without requiring millions of natural generations.
const dual = sampleForcedGrades(2,50000,'v202-root-dual-cohort');
const dualHT = (dual['HEAVENLY+TRUE']||0)+(dual['HEAVENLY+SPIRIT']||0);
check(dualHT>=1180 && dualHT<=1380, 'dual Heavenly + True/Spirit sampling matches the calibrated 2.564% conditional cohort');
check((dual['HEAVENLY+HEAVENLY']||0)>=35 && (dual['HEAVENLY+HEAVENLY']||0)<=95, 'dual Heavenly pair sampling matches the calibrated 0.1282% cohort');
const triple = sampleForcedGrades(3,50000,'v202-root-triple-cohort');
const tripleHTS = Object.entries(triple).filter(([key])=>key.split('+').filter(x=>x==='HEAVENLY').length===1 && key.split('+').filter(x=>x==='TRUE'||x==='SPIRIT').length===2).reduce((a,[,v])=>a+v,0);
const tripleHHS = Object.entries(triple).filter(([key])=>key.split('+').filter(x=>x==='HEAVENLY').length===2 && key.split('+').filter(x=>x==='TRUE'||x==='SPIRIT').length===1).reduce((a,[,v])=>a+v,0);
check(tripleHTS>=1180 && tripleHTS<=1380, 'triple one-Heavenly + two True/Spirit sampling matches the 2.564% cohort');
check(tripleHHS>=210 && tripleHHS<=310, 'triple two-Heavenly + one True/Spirit sampling matches the 0.5128% cohort');
check((triple['HEAVENLY+HEAVENLY+HEAVENLY']||0)>=90 && (triple['HEAVENLY+HEAVENLY+HEAVENLY']||0)<=170, 'triple Heavenly sampling matches the 0.2564% cohort');
const four = sampleForcedGrades(4,50000,'v202-root-fourfold-cohort');
check((four['HEAVENLY+HEAVENLY+HEAVENLY+HEAVENLY']||0)>=200 && (four['HEAVENLY+HEAVENLY+HEAVENLY+HEAVENLY']||0)<=300, 'four Heavenly subtype remains 0.5% conditional on four roots');

// 4. Natural root-count sampling follows the rare dual/triple distribution.
const rng = new U.RNG('v202-natural-root-counts');
const natural = {1:0,2:0,3:0,4:0};
for (let i=0;i<200000;i++) natural[ELEM.rollBirthRoots(rng).rootCount]++;
check(natural[2]>=3700 && natural[2]<=4300, 'natural sampling matches 2% dual-root frequency');
check(natural[3]>=150 && natural[3]<=250, 'natural sampling matches 0.1% triple-root frequency');
check(natural[4]<=1, 'natural sampling does not inflate four-root characters');

// 5. Root-capacity traits are capacity-only; dormant stat modifiers are removed and never applied.
for (const traitId of ['TR_ROOT_CAPACITY_DUAL','TR_ROOT_CAPACITY_TRIPLE','TR_ROOT_CAPACITY_FOURFOLD']) {
  const def = JD.CORE.rootCapacityTraits[traitId];
  check(!!def && def.rootCapacityOnly === true, traitId + ' remains an explicit root-capacity trait');
  check(!Array.isArray(def.modifiers) || def.modifiers.length === 0, traitId + ' has no dormant aptitude/meridian modifiers');
  check(HC.traitMods(traitId,1).length === 0, traitId + ' grants no hidden automatic stat modifiers');
}

console.log('PASS elemental_balance_v202: ' + checks + '/' + checks + ' assertions; calibrated root-count rarity, grade cohorts, natural sampling, metadata consistency and capacity-only traits verified');
