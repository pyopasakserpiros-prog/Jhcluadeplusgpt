'use strict';
const assert = require('assert');
const G = require('./load');
G.document = { getElementById() { return { querySelectorAll() { return []; }, style: {}, classList: { add() {}, remove() {}, toggle() {} } }; } };
require('../js/ui.js');
const { SIM, SECT, EXPED, HC, UI, MAP } = G;

console.log('Testing Phase 1: Recruitment Pipeline, Talent Distribution, CA/PA Privacy & Facility Caps...');

// 1. Authoritative Housing Capacity (Base 46 -> Max 100) & Facility Max Levels
{
  const W = SIM.create('phase1-facilities');
  assert.strictEqual(SECT.housingCapacity(W), 46, 'Initial housing capacity must be 46 (24 + 14 + 8)');
  assert.strictEqual(SECT.maxHousingCapacity(), 100, 'Max housing capacity across dorms must be 100 (56 + 28 + 16)');

  // Upgrade dorm_outer L1 -> L5: [24, 32, 40, 48, 56]
  const expectedOuter = [0, 24, 32, 40, 48, 56];
  for (let lv = 2; lv <= 5; lv++) {
    const res = SECT.upgradeBuildingTo(W, 'dorm_outer', lv);
    assert(res.ok);
    assert.strictEqual(W.map.byId.dorm_outer.level, lv);
    assert.strictEqual(W.map.byId.dorm_outer.stations.length, expectedOuter[lv], `dorm_outer L${lv} should have ${expectedOuter[lv]} beds`);
  }
  // Cannot exceed maxLevel 5
  SECT.upgradeBuildingTo(W, 'dorm_outer', 9);
  assert.strictEqual(W.map.byId.dorm_outer.level, 5);

  // Upgrade dorm_inner L1 -> L4: [14, 19, 24, 28]
  const expectedInner = [0, 14, 19, 24, 28];
  for (let lv = 2; lv <= 4; lv++) {
    SECT.upgradeBuildingTo(W, 'dorm_inner', lv);
    assert.strictEqual(W.map.byId.dorm_inner.stations.length, expectedInner[lv]);
  }

  // Upgrade dorm_core L1 -> L3: [8, 12, 16]
  const expectedCore = [0, 8, 12, 16];
  for (let lv = 2; lv <= 3; lv++) {
    SECT.upgradeBuildingTo(W, 'dorm_core', lv);
    assert.strictEqual(W.map.byId.dorm_core.stations.length, expectedCore[lv]);
  }

  assert.strictEqual(SECT.housingCapacity(W), 100, 'Fully upgraded dorms must provide exactly 100 beds');

  // Upgrade non-housing facilities and verify they NEVER add bed stations and respect maxLevel
  for (const b of W.map.buildings) {
    if (SECT.HOUSING_IDS.includes(b.id)) continue;
    const maxL = SECT.maxBuildingLevel(b);
    SECT.upgradeBuildingTo(W, b.id, maxL + 2);
    assert.strictEqual(b.level, maxL, `${b.id} must cap at maxLevel ${maxL}`);
    const hasBed = b.stations.some(sid => W.map.stations[sid] && W.map.stations[sid].kind === 'bed' && b.id !== 'elder_quarters');
    assert(!hasBed, `Non-housing building ${b.id} must never add bed stations`);
  }
  assert.strictEqual(SECT.housingCapacity(W), 100, 'Upgrading non-housing buildings must not alter housingCapacity(W)');
  console.log('  PASS: Authoritative housing capacity (46 -> 100) and per-facility max levels');
}

// 2. 5-Tier Applicant Talent Distribution & Fame Scaling
{
  const lowW = SECT.applicantTierWeights(1);
  const midW = SECT.applicantTierWeights(120);
  const highW = SECT.applicantTierWeights(2000);

  for (const w of [lowW, midW, highW]) {
    const sum = Object.values(w).reduce((a, b) => a + b, 0);
    assert(Math.abs(sum - 1) < 1e-4, `Tier weights must sum to 1 (got ${sum})`);
    for (const k of SECT.TALENT_TIER_IDS) {
      assert(w[k] > 0, `Tier ${k} must have positive probability even at low fame`);
    }
    const giftedPlus = w.GIFTED + w.PRODIGY + w.HEAVENLY_CHILD;
    assert(giftedPlus <= 0.330001, `Combined gifted/prodigy/heavenly weight (${giftedPlus}) must never exceed 0.33`);
  }
  assert(highW.GIFTED > lowW.GIFTED && highW.PRODIGY > lowW.PRODIGY && highW.HEAVENLY_CHILD > lowW.HEAVENLY_CHILD, 'Higher sect fame must increase gifted/exceptional applicant rates');
  assert(highW.COMMON > highW.GIFTED + highW.PRODIGY + highW.HEAVENLY_CHILD, 'Common + Steady must remain the majority even at max fame');
  console.log('  PASS: 5-tier applicant talent distribution and fame scaling');
}

// 3. Strict CA vs PA Separation (Zero Hidden Potential Leakage)
{
  const W = SIM.create('phase1-ca-pa');
  const who = W.byId[W.sect.masterId];
  const a1 = W.makeNpc({ ageYears: 19, rank: 0, fromApplicant: true, useTalentTier: true, queue: true });
  const a2 = JSON.parse(JSON.stringify(a1));

  // Mutate ONLY hidden PA fields on a2
  a2.h.root.grade = 'HEAVEN';
  a2.h.constitution = 'IMMORTAL_BONE';
  a2.h.aptitudes = { cultivation: 100, comprehension: 100, combat: 100, crafting: 100, command: 100, socialCommerce: 100 };
  a2.h.intellect.learningSpeed = 100;
  a2.h.intellect.comprehension = 100;
  a2.h.physiology.spiritualFoundation = 100;
  a2.h.physiology.meridianCapacity = 100;
  a2.h.physiology.meridianIntegrity = 100;
  a2.h.physiology.senseAcuity = 100;
  a2.h.destiny = { luck: 100, karma: 100, fateWeight: 100 };
  a2.ext = { applicant: { tier: 'HEAVENLY_CHILD', tierId: 'HEAVENLY_CHILD', isGifted: true, isExceptional: true } };

  const ca1 = SECT.observableCapability(W, a1);
  const ca2 = SECT.observableCapability(W, a2);
  assert.deepStrictEqual(ca1, ca2, 'SECT.observableCapability must be 100% invariant to hidden PA fields');

  const rngSnap = W.rng.getState();
  const ex1 = SECT.examineApplicant(W, who, a1);
  W.rng.setState(rngSnap);
  const ex2 = SECT.examineApplicant(W, who, a2);
  assert.strictEqual(ex1.score, ex2.score, 'SECT.examineApplicant score must not leak hidden PA fields');

  // Verify UI queue rendering does not leak hidden PA
  W.sect.queue = [a2];
  UI.G = { W, R: {}, opts: {}, acc: 0, speed: 1 };
  UI.tab = 'over';
  const overHtml = UI.rSect();
  assert(overHtml.includes(a2.h.name.given), 'Queue UI should show applicant name');
  assert(!overHtml.includes('HEAVENLY_CHILD') && !overHtml.includes('IMMORTAL_BONE') && !overHtml.includes('HEAVEN'), 'Queue UI must never expose hidden PA identifiers');
  console.log('  PASS: Strict CA vs PA separation in evaluation and UI');
}

// 4. End-to-End Recruitment Queue Lifecycle & Edge Cases
{
  const W = SIM.create('phase1-queue-edge');
  const m = W.byId[W.sect.masterId];
  W.sect.queue = [];

  // Fill queue to MAX_QUEUE (6)
  for (let i = 0; i < SECT.MAX_QUEUE; i++) {
    W.sect.queue.push(W.makeNpc({ ageYears: 18 + i, rank: 0, fromApplicant: true, useTalentTier: true, queue: true }));
  }
  assert.strictEqual(W.sect.queue.length, 6);
  const addedWhenFull = EXPED.recruitApplicants(W, 'manual');
  assert.strictEqual(addedWhenFull, 0, 'recruitApplicants must return 0 when queue is already at MAX_QUEUE');
  assert.strictEqual(W.sect.queue.length, 6);

  // Corrupt queue with null, dead, already-admitted, and duplicate entries
  const dup = W.sect.queue[0];
  const deadApp = W.makeNpc({ ageYears: 22, rank: 0, fromApplicant: true, queue: true });
  deadApp.dead = true;
  W.sect.queue.push(null, m, dup, deadApp);
  SECT.sanitizeQueue(W);
  assert.strictEqual(W.sect.queue.length, 6, 'sanitizeQueue must remove null, dead, already-admitted, and duplicate entries');

  // Unavailable leadership: seal master, no registrar or deputy -> queue remains intact without crash
  m.sealed = true;
  SECT.processApplicants(W, m);
  assert.strictEqual(W.sect.queue.length, 6, 'When all reviewing officers are unavailable, applicants must wait safely');
  m.sealed = false;

  // Expiry (>14 days)
  W.sect.queue[0].joinDay = W.day - 16;
  const expiredId = W.sect.queue[0].id;
  SECT.processApplicants(W, m);
  assert(!W.sect.queue.some(x => x.id === expiredId) && !W.byId[expiredId], 'Applicant waiting >14 days must expire and not be admitted');
  assert(W.sect.recruitmentStats.expired >= 1, 'Expired applicant must increment recruitmentStats.expired');

  // Active recruitment drive generates applicants
  W.sect.queue = [];
  W.sect.lastRecruitGenDay = -1;
  const driveStarted = SECT.recruitDrive(W, m);
  assert(driveStarted, 'recruitDrive should succeed when beds and food are available');
  assert(W.sect.queue.length >= 1, 'recruitDrive should trigger an initial applicant wave');
  console.log('  PASS: Queue cap, sanitization, officer availability, expiry, and recruitment drive');
}

console.log('ALL PHASE 1 TESTS PASSED.');
