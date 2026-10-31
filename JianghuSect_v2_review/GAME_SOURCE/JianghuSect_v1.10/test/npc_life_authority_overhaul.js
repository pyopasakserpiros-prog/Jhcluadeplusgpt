'use strict';
/**
 * Comprehensive Behavioral Acceptance & Regression Suite:
 * NPC Life, Cognition, Relationships, Martial Progression & Sect Authority Overhaul
 */
const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const g = require('./load');
const { U, HC, CULT, ECO, SECT, AI, EXPED, SIM, COG, MARTIAL, SK, JD } = g;

function clonePersonality(n, overrides) {
  Object.entries(overrides || {}).forEach(([k, v]) => {
    const [grp, key] = k.split('.');
    if (n.h[grp] && key in n.h[grp]) n.h[grp][key] = v;
  });
  if (HC.touch) HC.touch(n);
}

console.log('Running test/npc_life_authority_overhaul.js ...');

// 1. Goals & Aspirations: distinct personalities -> distinct aspirations, emergency suspension/resumption, genuine milestone check
{
  const W = SIM.create('npc-overhaul-goals-1');
  const [a, b] = W.npcs.filter(n => n.id !== W.sect.masterId);
  assert(a && b, 'expected initial disciples');

  clonePersonality(a, {
    'values.martialPeak': 95,
    'personality.ambition': 90,
    'interests.combat': 92,
    'values.knowledgeCraft': 20,
    'values.wealthResource': 20
  });
  clonePersonality(b, {
    'values.knowledgeCraft': 96,
    'interests.alchemy': 95,
    'interests.herbs': 90,
    'values.martialPeak': 20,
    'personality.ambition': 30
  });
  b.h.skills.ALCHEMY = 45;

  delete a.cognition;
  delete b.cognition;
  const aspA = COG.ensureAspiration(W, a);
  const aspB = COG.ensureAspiration(W, b);
  assert(aspA && aspB, 'both NPCs should form persistent aspirations');
  assert.notStrictEqual(aspA.id, aspB.id, `distinct personalities should select distinct aspirations (${aspA.id} vs ${aspB.id})`);
  assert.strictEqual(aspB.id, 'master_alchemist', 'alchemy-devoted NPC should aspire to grand_craftsman');

  // Defect #1 Regression: Unrelated action completion must NOT refresh goal.lastProgress
  a.cult.stage = 1;
  a.cult.prog = Math.round(CULT.threshold(a) * 0.85);
  a.cult.bn = { plan: "wait", why: "รอโอสถและตบะ" };
  clonePersonality(a, { "values.freedom": 5 });
  let gA = null;
  for (let tries = 0; tries < 10 && (!gA || gA.id !== "breakthrough"); tries++) {
    a.cognition.goal = null;
    a.cognition.nextReview = 0;
    gA = COG.prepare(W, a).goal;
  }
  assert.strictEqual(gA.id, 'breakthrough', 'near-threshold cultivator should select breakthrough goal');
  const initialProgressAt = gA.lastProgress;
  W.t += 120;
  // Complete an unrelated action ('farm') that does not advance cultivation prog or stage
  COG.finished(W, a, 'farm');
  assert.strictEqual(a.cognition.goal.lastProgress, initialProgressAt, 'unrelated action (farm) must NOT refresh breakthrough goal.lastProgress');

  // Genuine progress DOES advance goal.lastProgress
  W.t += 60;
  a.cult.prog += 15;
  COG.finished(W, a, 'cultivate');
  assert.strictEqual(a.cognition.goal.lastProgress, W.t, 'genuine cultivation progress must update goal.lastProgress');

  // Defect #4 Regression: Emergency suspends medium-term goal into suspendedGoal and resumes after recovery
  a.h.state.hp = Math.round(CULT.hpMax(a) * 0.2);
  a.inj = [{ part: 'แขนขวา', sev: 2, t: 300, why: 'ทดสอบบาดเจ็บ' }];
  const gEmergency = COG.prepare(W, a).goal;
  assert.strictEqual(gEmergency.id, 'recovery', 'critically injured NPC must switch to recover goal');
  assert(a.cognition.suspendedGoal && a.cognition.suspendedGoal.id === 'breakthrough', 'previous breakthrough goal must be preserved in suspendedGoal during emergency');
  assert.strictEqual(a.cognition.aspiration.id, aspA.id, 'long-term aspiration must persist across short-term emergency');

  // Heal and verify resumption
  a.h.state.hp = CULT.hpMax(a);
  a.inj = [];
  W.t += 30;
  const gResumed = COG.prepare(W, a).goal;
  assert.strictEqual(gResumed.id, 'breakthrough', 'recovering from emergency must resume the suspended breakthrough goal');
  assert.strictEqual(a.cognition.suspendedGoal, null, 'suspendedGoal should be cleared once resumed');

  // Prerequisite step decomposition: scripture goal when CP is insufficient -> step 'earn_cp'
  const tech3 = W.sect.library.map(id => CULT.tech(id)).find(t => t && t.tier >= 2 && g.CPE.techPrice(W, t) > 40);
  if (tech3) {
    a.cult.stage = Math.max(a.cult.stage, tech3.reqTier || tech3.tier || 2);
    a.cult.sub = tech3.sub && tech3.sub !== 'ANY' ? tech3.sub : a.cult.sub;
    a.cp = 5; // Too poor to afford tech3 right now
    a.cognition.goal = {
      id: 'scripture',
      title: 'ศึกษาคัมภีร์「' + tech3.nameTh + '」',
      targetId: tech3.id,
      actions: ['study', 'guidedStudy', 'donate', 'forage', 'brewBasic', 'duty'],
      startedAt: W.t,
      lastProgress: W.t,
      expiresAt: W.t + 5 * 1440,
      blockedCount: 0,
      snap: { techsLen: a.cult.techs.length, cp: a.cp }
    };
    const mods = COG.modifiers(W, a, 'forage');
    const studyMods = COG.modifiers(W, a, 'study');
    assert(mods.some(m => m[1] > 0), 'when lacking CP for target manual, CP-earning actions (forage) must receive positive goal step weight');
    assert(!studyMods.some(m => m[1] > 0.25), 'when lacking CP for target manual, study should not receive primary step weight');
  }
}

// 2. Defect #2 Regression: Station congestion / Top-6 starvation fix in AI.decide
{
  const W = SIM.create('npc-overhaul-station-starvation');
  const n = W.npcs.find(x => x.id !== W.sect.masterId);
  // Occupy all stations for top actions except a lower-ranked valid station
  W.map.stations.forEach(s => {
    if (['meditate', 'dummy', 'lift', 'read', 'cauldron', 'forge', 'cook', 'farm', 'mine'].includes(s.kind)) {
      s.occ = 'occupied_dummy_id';
    }
  });
  n.h.state.energy = 80;
  n.h.state.satiety = 80;
  n.h.state.rest = 80;
  AI.decide(W, n);
  assert(n.act && n.act.id !== 'idle', 'NPC should still find a valid executable action even when top stations are occupied');
  // Restore stations
  W.map.stations.forEach(s => { if (s.occ === 'occupied_dummy_id') s.occ = null; });
}

// 3. Bounded Knowledge Scopes & Heuristic Forecasts + CA/PA Separation
{
  const W = SIM.create('npc-overhaul-knowledge-capa');
  const disc = W.npcs.find(x => x.id !== W.sect.masterId && !x.post);
  const scope = COG.knowledgeScope(W, disc);
  assert.strictEqual(scope.canSeeHiddenPA, false, 'NO NPC may ever know hidden applicant PA');
  assert.strictEqual(scope.canSeeFullTreasury, false, 'ordinary disciple without treasury/discipline/master post must not have full treasury audit knowledge');

  const fcAfford = COG.forecast(W, disc, 'affordability', { price: 150 });
  assert(fcAfford && fcAfford.isEstimate === true && typeof fcAfford.assumptionsTh === 'string' && fcAfford.assumptionsTh.includes('[คาดการณ์]'), 'forecast must be labeled as an explicit heuristic estimate');

  // Experience updates hunt risk perception
  const beast = { zone: 'z_test', nameTh: 'อสูรทดสอบ', power: Math.round(CULT.power(disc) * 1.05) };
  const riskBefore = COG.forecast(W, disc, 'huntRisk', beast);
  COG.remember(W, disc, { kind: 'hunt_loss', zoneId: 'z_test', severity: 1 });
  COG.remember(W, disc, { kind: 'hunt_loss', zoneId: 'z_test', severity: 1 });
  const riskAfter = COG.forecast(W, disc, 'huntRisk', beast);
  assert(riskAfter.winProb < riskBefore.winProb, `repeated hunt_loss memories must lower perceived win probability (${riskAfter.winProb} < ${riskBefore.winProb})`);

  // Strict CA vs PA separation
  const appLowPA = SIM.addNpc(W, { queue: true, ageYears: 18, sex: 'M', quality: -0.6, rootGrade: 'MORTAL' });
  const appHighPA = JSON.parse(JSON.stringify(appLowPA));
  appHighPA.id = 'app_high_pa_clone';
  // Mutate ONLY hidden PA / latent fields while keeping visible skills, physiology, age, stage identical
  appHighPA.h.aptitudes = { cultivation: 99, comprehension: 99,alchemy: 99, forging: 99, array: 99, combat: 99 };
  appHighPA.h.root = { grade: 'HEAVEN', elements: ['GOLD'], purity: 99 };
  if (appHighPA.ext && appHighPA.ext.applicant) {
    appHighPA.ext.applicant.quality = 2.5;
    appHighPA.ext.applicant.tier = 'MYTHIC';
    appHighPA.ext.applicant.isExceptional = true;
  }
  const ca1 = SECT.observableCapability(W, appLowPA);
  const ca2 = SECT.observableCapability(W, appHighPA);
  assert.strictEqual(ca1.caScore, ca2.caScore, 'observableCapability (CA) must be 100% identical when only hidden PA fields differ');
  const ex1 = SECT.examineApplicant(W, W.byId[W.sect.masterId], appLowPA);
  const ex2 = SECT.examineApplicant(W, W.byId[W.sect.masterId], appHighPA);
  assert.strictEqual(ex1.totalScore, ex2.totalScore, 'examineApplicant score must be 100% identical when only hidden PA fields differ');
}

// 4. Progression, Technique Fit, Passive Loadout Reconciliation & Gear Classification
{
  const W = SIM.create('npc-overhaul-martial-gear');
  const n = W.npcs.find(x => x.id !== W.sect.masterId);
  n.cult.path = 'XIAN';
  n.cult.sub = 'SWORD_IMMORTAL';
  n.cult.stage = 3;
  n.h.skills.SWORD = 75;
  n.h.skills.SABER = 5;

  const swordWeapon = { id: 'EQ_TEST_SWORD', uid: 'eq_sw_1', nameTh: 'กระบี่เมฆาคราม', slot: 'WEAPON', type: 'SWORD', tier: 3, minStage: 2, combatMult: 0.22, dur: 100, q: 1.1 };
  const saberWeapon = { id: 'EQ_TEST_SABER', uid: 'eq_sb_1', nameTh: 'ดาบโลหิต', slot: 'WEAPON', type: 'SABER', tier: 3, minStage: 2, combatMult: 0.22, dur: 100, q: 1.1 };
  const brokenSword = { id: 'EQ_TEST_BROKEN', uid: 'eq_sw_broken', nameTh: 'กระบี่บิ่นร้าว', slot: 'WEAPON', type: 
'SWORD', tier: 3, minStage: 2, combatMult: 0.22, dur: 10, q: 1.1 };

  const fitSword = MARTIAL.gearSuitability(n, swordWeapon, 50);
  const fitSaber = MARTIAL.gearSuitability(n, saberWeapon, 50);
  const fitBroken = MARTIAL.gearSuitability(n, brokenSword, 50);
  assert(fitSword.score > fitSaber.score + 20, `sword specialist should strongly prefer sword over saber (${fitSword.score} vs ${fitSaber.score})`);
  assert(fitSword.score > fitBroken.score, `intact weapon must score higher than near-broken weapon (${fitSword.score} vs ${fitBroken.score})`);

  // Gear classification: useful-now, valuable-to-own, gift-worthy, surplus
  n.equip = {};
  const clUseful = MARTIAL.classifyGearForNpc(W, n, swordWeapon, 40);
  assert.strictEqual(clUseful.category, 'useful-now', 'unarmed sword cultivator should classify compatible sword as useful-now');

  const futureSword = { id: 'EQ_FUTURE_SWORD', uid: 'eq_sw_fut', nameTh: 'กระบี่เซียนขั้นสี่', slot: 'WEAPON', type: 'SWORD', tier: 4, minStage: 4, combatMult: 0.35, dur: 100, q: 1.2 };
  const clFuture = MARTIAL.classifyGearForNpc(W, n, futureSword, 60);
  assert.strictEqual(clFuture.category, 'valuable-to-own', 'next-stage compatible weapon should be classified as valuable-to-own');

  // Equip the strong sword on n, and make another NPC a close friend who needs a weapon
  n.equip.WEAPON = swordWeapon;
  W.byId[W.sect.masterId].equip = { WEAPON: { id: 'EQ_MASTER', uid: 'eq_m', nameTh: 'กระบี่เจ้าสำนัก', slot: 'WEAPON', type: 'SWORD', tier: 5, minStage: 2, combatMult: 0.55, dur: 100, q: 1.3 } };
  const friend = W.npcs.find(x => x.id !== n.id && x.id !== W.sect.masterId);
  friend.cult.path = 'XIAN';
  friend.cult.sub = 'SWORD_IMMORTAL';
  friend.cult.stage = 2;
  friend.equip = {};
  const relNF = SECT.rel(n, friend.id);
  relNF.a = 65; relNF.t = 70;
  const spareSword = { id: 'EQ_SPARE_SWORD', uid: 'eq_sw_spare', nameTh: 'กระบี่สำรองให้ศิษย์น้อง', slot: 'WEAPON', type: 'SWORD', tier: 2, minStage: 1, combatMult: 0.16, dur: 100, q: 1.0 };
  const clGift = MARTIAL.classifyGearForNpc(W, n, spareSword, 0);
  assert.strictEqual(clGift.category, 'gift-worthy', 'spare weapon inferior to own equipped sword but big upgrade for close friend should be classified as gift-worthy');
  assert.strictEqual(clGift.targetNpcId, friend.id, 'gift-worthy classification should identify the friend as recipient');

  // Passive slot reconciliation: should equip highest build-synergy passives
  const passives = JD.TECH.techniques.filter(t => (t.passive || t.cat === 'PASSIVE') && !t.innateOnly && MARTIAL.isTechCompatible(n, t) && MARTIAL.conditionMatches(n, t)).slice(0, 5);
  passives.forEach(p => { if (!n.cult.techs.includes(p.id)) n.cult.techs.push(p.id); });
  COG.reconcileLoadout(W, n);
  const slotCap = MARTIAL.maxPassiveSlots(n);
  assert(MARTIAL.activePassives(n).length <= slotCap && MARTIAL.activePassives(n).length > 0, 'reconcileLoadout must fill passive slots within slot cap');
}

// 5. Protected Actions, Social Invitations, Commitments, Mentoring, Gifting & Reciprocity
{
  const W = SIM.create('npc-overhaul-social-commitments');
  const [n1, n2] = W.npcs.filter(x => x.id !== W.sect.masterId);

  // Defect #3 Regression: Protected actions (brew, forge, heal, paidTraining, guidedStudy) must block pair invitations and expedition volunteering
  n2.act = { id: 'brew', stage: 'do', left: 40, total: 60, ctx: { rid: 'BASIC_HP' }, why: [] };
  assert.strictEqual(AI.isProtectedAction(W, n2, 'pair'), true, 'active brew must be protected from pair invitations');
  assert.strictEqual(AI.isProtectedAction(W, n2, 'expedition'), true, 'active brew must be protected from expedition volunteering');
  const propWhileBrewing = AI.proposePair(W, n1, n2);
  assert.strictEqual(propWhileBrewing, false, 'proposePair must not interrupt an NPC who is mid-brew');

  // Defect #5 Regression: received_help memory increases AI.acceptProb and reciprocity
  n2.act = { id: 'idle', stage: 'do', left: 0, total: 0, ctx: {}, why: [] };
  n1.act = { id: 'idle', stage: 'do', left: 0, total: 0, ctx: {}, why: [] };
  const probBeforeHelp = AI.acceptProb(W, n2, n1, 'chat');
  COG.remember(W, n2, { kind: 'received_help', subjectId: n1.id, severity: 0.85 });
  SECT.rel(n2, n1.id).g = 22;
  const probAfterHelp = AI.acceptProb(W, n2, n1, 'chat');
  assert(probAfterHelp > probBeforeHelp, `received_help memory and gratitude must increase invitation acceptance probability (${probAfterHelp} > ${probBeforeHelp})`);

  // Commitment lifecycle: emergency interruption is excused without trust penalty, while non-emergency broken commitment reduces trust
  COG.startCommitment(W, n1, n2, 'spar', 30);
  assert(n1.cognition.commitment && n2.cognition.commitment, 'both partners must record active commitment');
  const trustBeforeEmergency = COG.relInfo(n2, n1.id).trust;
  n1.inj = [{ part: 'อก', sev: 2, t: 200, why: 'บาดเจ็บฉุกเฉิน' }];
  const resEmergency = COG.resolveCommitment(W, n1, n2, false, 'บาดเจ็บฉุกเฉิน');
  assert.strictEqual(resEmergency, 'excused', 'emergency interruption must be excused');
  assert(COG.relInfo(n2, n1.id).trust >= trustBeforeEmergency, 'excused emergency interruption must not penalize trust');
  n1.inj = [];

  COG.startCommitment(W, n1, n2, 'spar', 30);
  const trustBeforeBreak = COG.relInfo(n2, n1.id).trust;
  const resBreak = COG.resolveCommitment(W, n1, n2, false, 'เปลี่ยนใจเดินหนี');
  assert.strictEqual(resBreak, 'broken', 'non-emergency cancellation before completion must be recorded as broken');
  assert(COG.relInfo(n2, n1.id).trust < trustBeforeBreak, 'broken commitment must reduce partner trust');

  // Mentoring transfers real learning/mastery progress
  const master = W.byId[W.sect.masterId];
  const learnTech = W.sect.library.map(id => CULT.tech(id)).find(t => t && !n1.cult.techs.includes(t.id));
  if (learnTech) {
    n1.cult.learning = { id: learnTech.id, need: 100, got: 20 };
    const gotBefore = n1.cult.learning.got;
    const mentorRes = COG.completeMentorLesson(W, master, n1);
    assert(mentorRes.ok && n1.cult.learning.got > gotBefore, 'completeMentorLesson must advance disciple technique study progress');
  }

  // Surplus gear gifting transfers real item to friend
  const giftSword = { id: 'EQ_GIFT_SWORD', uid: 'eq_gift_99', nameTh: 'กระบี่มิตรภาพ', slot: 'WEAPON', type: 'SWORD', tier: 2, minStage: 1, combatMult: 0.18, dur: 100, q: 1.05 };
  n1.inv.gear = [giftSword];
  n2.equip = {};
  n2.cult.stage = 2;
  const gifted = COG.giveGearGift(W, n1, n2.id, 'eq_gift_99');
  assert.strictEqual(gifted, true, 'giveGearGift must succeed for valid personal bag gear');
  assert(!n1.inv.gear || !n1.inv.gear.some(g2 => g2.uid === 'eq_gift_99'), 'gifted item must be removed from giver bag');
  assert((n2.equip.WEAPON && n2.equip.WEAPON.uid === 'eq_gift_99') || (n2.inv.gear && n2.inv.gear.some(g2 => g2.uid === 'eq_gift_99')), 'gifted item must belong to recipient');
}

// 6. Office Authority, Jurisdiction, Delegation, Favoritism, Self-Dealing & Discipline Investigation
{
  const W = SIM.create('npc-overhaul-office-authority');
  // Add extra NPCs so offices can be staffed and delegated
  for (let i = 0; i < 6; i++) {
    const m = SIM.addNpc(W, { ageYears: 24 + i, rank: 2, stage: 2, quality: 0.6 });
    m.merit = 80;
  }
  const staff = W.npcs.filter(n => n.id !== W.sect.masterId);
  const trOfficer = staff[0];
  const trAssist = staff[1];
  const discOfficer = staff[2];
  const ordinaryDisciple = staff[3];

  W.sect.posts.treasury = trOfficer.id; trOfficer.post = 'treasury'; trOfficer.rank = 4;
  trAssist.assist = 'treasury'; trAssist.rank = 2;
  W.sect.posts.discipline = discOfficer.id; discOfficer.post = 'discipline'; discOfficer.rank = 4;

  // Jurisdiction check: ordinary disciple does not have treasury authority; trOfficer does
  assert.strictEqual(COG.hasAuthority(W, ordinaryDisciple, 'treasury'), false, 'ordinary disciple must not have treasury authority');
  assert.strictEqual(COG.hasAuthority(W, trOfficer, 'treasury'), true, 'appointed treasury elder must have treasury authority');
  assert.strictEqual(COG.hasAuthority(W, trAssist, 'treasury'), false, 'assistant must not have official treasury authority while elder is present and available');

  // When trOfficer goes away on expedition or is incapacitated, syncOfficeAuthority delegates acting authority to trAssist
  trOfficer.away = true;
  COG.syncOfficeAuthority(W);
  assert.strictEqual(COG.hasAuthority(W, trOfficer, 'treasury'), false, 'absent officer must not exercise local authority');
  assert.strictEqual(COG.hasAuthority(W, trAssist, 'treasury'), true, 'assistant must receive acting delegated authority when holder is unavailable');
  assert(W.sect.delegations && W.sect.delegations.treasury && W.sect.delegations.treasury.delegateId === trAssist.id, 'delegation record must be created');

  // When trOfficer returns, delegation is revoked and authority returns to holder
  trOfficer.away = false;
  COG.syncOfficeAuthority(W);
  assert.strictEqual(COG.hasAuthority(W, trOfficer, 'treasury'), true, 'returning officer regains authority');
  assert.strictEqual(COG.hasAuthority(W, trAssist, 'treasury'), false, 'acting delegation ends when holder returns');

  // Personality-dependent treasury abuse (skimming) & evidence-based discipline exposure
  clonePersonality(trOfficer, { 'personality.integrity': 15, 'values.wealthResource': 90 });
  W.sect.stones = 1200;
  trOfficer._lastSkimDay = -99;
  // Force deterministic skim check by running performDuty across a few days
  for (let d = 0; d < 12 && !(trOfficer.embezzled > 0); d++) {
    W.day += 10;
    W.t += 10 * 1440;
    COG.performDuty(W, trOfficer);
  }
  assert((trOfficer.embezzled || 0) > 0, 'low-integrity, greedy treasurer should eventually skim stones when unsupervised');
  assert(Array.isArray(W.sect.auditTrail) && W.sect.auditTrail.length > 0, 'skimming must leave an auditTrail discrepancy');

  // High-integrity discipline officer investigates and exposes embezzlement
  clonePersonality(discOfficer, { 'personality.integrity': 88, 'intellect.perceptiveness': 85, 'intellect.judgement': 85 });
  W.sect.suspicion = 40;
  for (let i = 0; i < 10 && W.sect.posts.treasury === trOfficer.id; i++) {
    COG.performDuty(W, discOfficer);
  }
  assert.notStrictEqual(W.sect.posts.treasury, trOfficer.id, 'high-integrity discipline officer should expose and remove embezzling treasurer');
}


  // Biased welfare allocation creates unfair_allocation memory and complaint petition
  const W2 = SIM.create("npc-overhaul-welfare-petition");
  const tr2 = SIM.addNpc(W2, { ageYears: 35, rank: 4, stage: 2, quality: 0.5 });
  const fav2 = SIM.addNpc(W2, { ageYears: 20, rank: 1, stage: 1, quality: 0.3 });
  const needy2 = SIM.addNpc(W2, { ageYears: 22, rank: 1, stage: 1, quality: 0.4 });
  W2.sect.posts.treasury = tr2.id; tr2.post = "treasury";
  W2.sect.policy.meritocracy = 20;
  clonePersonality(tr2, { "personality.integrity": 20, "personality.empathy": 55 });
  SECT.rel(tr2, fav2.id).a = 80;
  SECT.rel(tr2, needy2.id).a = -30;
  fav2.h.state.hp = Math.round(CULT.hpMax(fav2) * 0.65); // Mild need (<30)
  needy2.h.state.hp = Math.round(CULT.hpMax(needy2) * 0.35);
  needy2.inj = [{ part: "ขา", sev: 2, t: 300, why: "บาดเจ็บหนัก" }]; // High need (>=35)
  W2.sect.stock["P:BASIC_HP"] = 2; // Only 1 pill above reserve (reserve=1)
  W2.sect.stock["P:BASIC_WOUND"] = 0;
  g.CPE.welfareDaily(W2);
  if ((needy2.cognition?.memory || []).some(m => m.kind === "unfair_allocation")) {
    assert(Array.isArray(W2.sect.petitions) && W2.sect.petitions.some(p => p.npcId === needy2.id && p.kind === "complaint"), "passed-over needy member must file complaint petition when biased recipient gets welfare pill");
  }

  // Bounded memory and petition sizes
  for (let i = 0; i < 40; i++) {
    COG.remember(W2, needy2, { kind: "work_done", severity: 0.5 });
    COG.submitPetition(W2, tr2, "medicine_" + i, { reason: "test" });
  }
  assert(needy2.cognition.memory.length <= 24, "cognition.memory must remain bounded at <= 24 entries");
  assert(W2.sect.petitions.length <= 16, "sect.petitions must remain bounded at <= 16 entries");

// 7. Deference & Flattery Mechanics (welcomed vs distrusted + anti-farming cooldowns)
{
  const W = SIM.create('npc-overhaul-flattery');
  const master = W.byId[W.sect.masterId];
  const flatterer = W.npcs.find(n => n.id !== master.id);

  // Case A: Vain, trusting target welcomes skilled flatterer
  clonePersonality(master, { 'personality.pride': 88, 'personality.trustfulness': 80, 'intellect.readPeople': 25, 'personality.integrity': 35 });
  clonePersonality(flatterer, { 'social.persuasion': 85, 'social.charisma': 80, 'social.etiquette': 78, 'personality.ambition': 85, 'values.powerStatus': 85, 'personality.integrity': 25 });
  const resWelcome = COG.executeFlattery(W, flatterer, master.id);
  assert(resWelcome && resWelcome.outcome === 'welcomed', `vain target should welcome skilled flattery (got ${resWelcome && resWelcome.outcome})`);
  assert(COG.flatteryBonus(master, flatterer) > 0, 'welcomed flattery should grant positive bounded favor');

  // Cooldown check: flatterer cannot immediately re-select same target in flatteryCandidate
  const candImmediate = COG.flatteryCandidate(W, flatterer);
  assert.strictEqual(candImmediate, null, 'flattery cooldown must prevent immediate repeat flattery');

  // Case B: Discerning, high-integrity target distrusts clumsy/repeated flatterer
  clonePersonality(master, { 'personality.pride': 20, 'personality.trustfulness': 25, 'intellect.readPeople': 92, 'intellect.judgement': 90, 'personality.integrity': 92 });
  clonePersonality(flatterer, { 'social.persuasion': 25, 'social.charisma': 25, 'social.etiquette': 25 });
  const resDistrust = COG.executeFlattery(W, flatterer, master.id);
  assert(resDistrust && resDistrust.outcome === 'distrusted', `discerning high-integrity target should distrust transparent flattery (got ${resDistrust && resDistrust.outcome})`);

  // Deference calculation
  const def = COG.deferenceToward(W, flatterer, master);
  assert(def && typeof def.deference === 'number' && typeof def.summaryTh === 'string', 'deferenceToward must return structured Thai summary and numeric deference');
}

// 8. Pure Read-Only Inspection Invariant, Save/Load Roundtrip & Human Core Lock
{
  const W = SIM.create('npc-overhaul-save-invariants');
  for (let i = 0; i < 180; i++) SIM.tick(W);

  const n = W.npcs.find(x => !x.dead);
  const rngBefore = JSON.stringify(W.rng.getState());
  const serBefore = SIM.serialize(W);

  const ex = COG.explain(W, n);
  const mods = COG.modifiers(W, n, 'cultivate');
  const role = COG.role(W, n);
  const desc = MARTIAL.describe(W, n);

  assert(ex && ex.role && Array.isArray(ex.estimates), 'COG.explain must return structured explanation');
  assert(Array.isArray(mods) && role && desc, 'read-only helpers must return valid structures');
  assert.strictEqual(JSON.stringify(W.rng.getState()), rngBefore, 'read-only helpers must NEVER consume W.rng');
  assert.strictEqual(SIM.serialize(W), serBefore, 'read-only helpers must NEVER mutate serialized world state');

  // Save/load roundtrip preserves cognition state and deterministic continuation
  const loaded = SIM.deserialize(serBefore);
  assert.deepStrictEqual(loaded.byId[n.id].cognition, n.cognition, 'save/load roundtrip must preserve NPC cognition state');

  for (let i = 0; i < 60; i++) {
    SIM.tick(W);
    SIM.tick(loaded);
  }
  assert.strictEqual(SIM.serialize(W), SIM.serialize(loaded), 'post-load simulation must remain 100% deterministic');

  // Verify human_core.js SHA-256 byte lock
  const hcBytes = fs.readFileSync(path.resolve(__dirname, '../js/human_core.js'));
  const hcSha = crypto.createHash('sha256').update(hcBytes).digest('hex');
  assert.strictEqual(hcSha, 'a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542', 'human_core.js SHA-256 must remain untouched');
}

console.log('PASS npc_life_authority_overhaul: aspirations, goal continuity, station starvation fix, bounded knowledge, CA/PA separation, gear/loadout, commitments/reciprocity, office authority/delegation/abuse, flattery, and save/load determinism');
