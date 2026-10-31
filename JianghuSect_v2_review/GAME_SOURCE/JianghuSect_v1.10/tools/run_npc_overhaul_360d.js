'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const g = require('../test/load');
const { SIM, CULT, ECO, SECT, AI, COG, MARTIAL, HC } = g;

const mode = process.argv[2] || 'all';
const arg1 = process.argv[3];
const arg2 = process.argv[4];

function runSeed(seed) {
  const W = SIM.create(seed);
  const metrics = {
    seed,
    days: 360,
    ticks: 360 * 1440,
    goalsCompleted: 0,
    goalsExpired: 0,
    goalsSuspended: 0,
    goalsBlockedReplan: 0,
    medicineShared: 0,
    gearGifted: 0,
    mentorLessons: 0,
    flatteryWelcomed: 0,
    flatteryDistrusted: 0,
    flatteryIgnored: 0,
    delegationsCreated: 0,
    petitionsFiled: 0
  };

  const origGiveMed = COG.giveMedicine;
  COG.giveMedicine = function (w, n, t) {
    const r = origGiveMed.apply(this, arguments);
    if (w === W && r) metrics.medicineShared++;
    return r;
  };
  const origGiveGear = COG.giveGearGift;
  COG.giveGearGift = function (w, n, rec, id) {
    const r = origGiveGear.apply(this, arguments);
    if (w === W && r) metrics.gearGifted++;
    return r;
  };
  const origMentor = COG.completeMentorLesson;
  COG.completeMentorLesson = function (w, m, s, sk) {
    const r = origMentor.apply(this, arguments);
    if (w === W && r && r.ok) metrics.mentorLessons++;
    return r;
  };
  const origFlat = COG.executeFlattery;
  COG.executeFlattery = function (w, a, t) {
    const r = origFlat.apply(this, arguments);
    if (w === W && r) {
      if (r.outcome === 'welcomed') metrics.flatteryWelcomed++;
      else if (r.outcome === 'distrusted') metrics.flatteryDistrusted++;
      else metrics.flatteryIgnored++;
    }
    return r;
  };
  const origPet = COG.submitPetition;
  COG.submitPetition = function (w, n, k, d) {
    const lenBefore = (w.sect && w.sect.petitions) ? w.sect.petitions.length : 0;
    const r = origPet.apply(this, arguments);
    if (w === W && w.sect.petitions.length > lenBefore) metrics.petitionsFiled++;
    return r;
  };

  const t0 = performance.now();
  let lastDelegationKeys = new Set();
  const seenSusp = new Map();
  const seenLastGoal = new Map();

  for (let d = 0; d < 360; d++) {
    for (let m = 0; m < 1440; m++) {
      SIM.tick(W);
    }
    const delKeys = Object.keys(W.sect.delegations || {});
    delKeys.forEach(k => { if (!lastDelegationKeys.has(k)) metrics.delegationsCreated++; });
    lastDelegationKeys = new Set(delKeys);
    for (let i = 0; i < W.npcs.length; i++) {
      const n = W.npcs[i];
      const c = n.cognition;
      if (!c) continue;
      if (c.suspendedGoal && seenSusp.get(n.id) !== c.suspendedGoal.suspendedAt) {
        seenSusp.set(n.id, c.suspendedGoal.suspendedAt);
        metrics.goalsSuspended++;
      }
      if (c.lastGoal && seenLastGoal.get(n.id) !== c.lastGoal.endedAt) {
        seenLastGoal.set(n.id, c.lastGoal.endedAt);
        if (c.lastGoal.status === 'completed') metrics.goalsCompleted++;
        else if (c.lastGoal.status === 'expired') metrics.goalsExpired++;
        else if (c.lastGoal.status === 'blocked_replan') metrics.goalsBlockedReplan++;
      }
    }
  }
  const elapsedMs = Math.round(performance.now() - t0);

  COG.giveMedicine = origGiveMed;
  COG.giveGearGift = origGiveGear;
  COG.completeMentorLesson = origMentor;
  COG.executeFlattery = origFlat;
  COG.submitPetition = origPet;

  const alive = W.npcs.filter(n => !n.dead && !n.exiled);
  const aspirations = {};
  let totalMilestones = 0;
  alive.forEach(n => {
    const aid = n.cognition?.aspiration?.id || 'unassigned';
    aspirations[aid] = (aspirations[aid] || 0) + 1;
    totalMilestones += (n.cognition?.aspiration?.milestones || []).length;
    assert(Number.isFinite(n.h.state.hp) && Number.isFinite(n.cp || 0), 'NPC state must remain finite');
    if (n.cognition) {
      assert(n.cognition.memory.length <= 24, 'memory bounded <= 24');
      assert(n.cognition.trace.length <= 8, 'trace bounded <= 8');
    }
  });

  const cpState = g.CPE.S(W);
  const sumCp = Math.round(alive.reduce((s, n) => s + (n.cp || 0), 0) * 10) / 10;
  assert(Number.isFinite(sumCp) && Number.isFinite(cpState.minted) && Number.isFinite(cpState.burned), 'CP metrics must be finite');

  const snap = SIM.serialize(W);
  const loaded = SIM.deserialize(snap);
  assert.strictEqual(loaded.npcs.length, W.npcs.length, '360d save/load preserves NPC count');

  metrics.elapsedMs = elapsedMs;
  metrics.msPerTick = Math.round((elapsedMs / (360 * 1440)) * 10000) / 10000;
  metrics.finalAlivePopulation = alive.length;
  metrics.totalDeaths = W.deaths || 0;
  metrics.sectFame = Math.round(W.sect.fame || 0);
  metrics.sectStones = Math.round(W.sect.stones || 0);
  metrics.cpCirculation = sumCp;
  metrics.cpMinted = Math.round(cpState.minted);
  metrics.cpBurned = Math.round(cpState.burned);
  metrics.cpRetired = Math.round(cpState.retired || 0);
  metrics.cpPriceIndex = Math.round((cpState.price || 1) * 100) / 100;
  metrics.aspirations = aspirations;
  metrics.aspirationMilestonesRecorded = totalMilestones;
  metrics.learnLogs = W.logs.filter(l => l.type === 'learn').length;
  metrics.breakthroughLogs = W.logs.filter(l => l.type === 'breakthrough').length;
  return metrics;
}

function runBench100() {
  const W100 = SIM.create('npc-overhaul-100npc-bench');
  for (const b of W100.map.buildings) {
    if (SECT.HOUSING_IDS && SECT.HOUSING_IDS.includes(b.id)) {
      const maxL = SECT.maxBuildingLevel(b);
      while (b.level < maxL) {
        b.building = { to: b.level + 1, until: W100.t };
        SIM.finishBuilding(W100, b);
      }
    }
  }
  while (W100.npcs.filter(n => !n.dead).length < 100) {
    const n = SIM.addNpc(W100, { ageYears: 18 + (W100.seqN % 30), quality: 0.6, rank: W100.seqN % 4, stage: 1 + (W100.seqN % 3) });
    const pl = W100.map.byId.plaza;
    SIM.placeNear(W100, n, pl.x + pl.w / 2, pl.y + pl.h / 2, 14);
    n.act.left = W100.seqN % 45;
  }
  for (let i = 0; i < 120; i++) SIM.tick(W100);
  const t100Start = performance.now();
  for (let i = 0; i < 720; i++) SIM.tick(W100);
  const t100Elapsed = Math.round((performance.now() - t100Start) * 100) / 100;
  return {
    seed: 'npc-overhaul-100npc-bench',
    population: W100.npcs.filter(n => !n.dead).length,
    housingCapacity: SECT.housingCapacity(W100),
    ticks: 720,
    elapsedMs: t100Elapsed,
    avgMsPerTick: Math.round((t100Elapsed / 720) * 1000) / 1000,
    ticksPerSec: Math.round(720000 / t100Elapsed)
  };
}

if (mode === 'seed') {
  const m = runSeed(arg1);
  fs.writeFileSync(arg2, JSON.stringify(m, null, 2) + '\n');
  console.log('DONE seed', arg1, 'elapsedMs:', m.elapsedMs, 'msPerTick:', m.msPerTick, 'alive:', m.finalAlivePopulation, 'goalsCompleted:', m.goalsCompleted);
} else if (mode === 'bench100') {
  const b = runBench100();
  fs.writeFileSync(arg1, JSON.stringify(b, null, 2) + '\n');
  console.log('DONE bench100', b);
}
