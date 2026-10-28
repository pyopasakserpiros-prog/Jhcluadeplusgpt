'use strict';
const assert = require('assert');
const G = require('./load.js');
G.document = { getElementById() { return { querySelectorAll() { return []; }, style: {}, classList: { add() {}, remove() {} } }; } };
require('../js/ui.js');

const { CONTENT: C, JD, SIM, ECO, CULT, EXPED: X, CPE, UI } = G;
const D = JD.EXPANSION;

// 1. Catalog Validation & Counts
assert.strictEqual(D.version, '1.10.9', 'Expansion version must be 1.10.9');
assert.strictEqual(SIM.VERSION, '1.10.9', 'SIM.VERSION must be 1.10.9');
assert.deepStrictEqual(C.validate(), [], 'CONTENT.validate() must pass with zero errors');
assert.strictEqual(D.rareOrgans.length, 10, 'Must have 10 curated rare organs');
assert.strictEqual(D.experiments.length, 8, 'Must have 8 curated property experiment designs');
assert.strictEqual(D.factions.length, 6, 'Must have 6 curated external sect factions');

// Ensure C.ensure() is 100% deterministic and never consumes RNG
{
  const W = SIM.create('organs-rng-lock');
  const rngBefore = JSON.stringify(W.rng.getState());
  C.ensure(W);
  C.ensure(W);
  assert.strictEqual(JSON.stringify(W.rng.getState()), rngBefore, 'C.ensure must never consume W.rng');
  assert.strictEqual(W.world.sects.length, 6, 'Must have 6 world sects enriched with faction templates');
  for (const s of W.world.sects) {
    assert(s.factionId && C.factionById[s.factionId], 'World sect must link to valid faction template');
    assert(Array.isArray(s.specialtyMatIds) && s.specialtyMatIds.length > 0, 'World sect must have specialtyMatIds');
    assert.strictEqual(s.treaty, 'NONE', 'Default treaty must be NONE');
  }
}

// 2. Rare Beast Organs: Harvesting, Handover, Donation & Refinement
{
  const W = SIM.create('organ-lifecycle');
  const n = W.npcs[0];
  n.h.skills.survival = 85;
  n.h.skills.MEDICINE = 80;
  const organ = D.rareOrgans[0];
  const reg = C.regionById[organ.regionId];
  const beast = JD.BEASTS.species.find(b => b.id === organ.beastId);
  assert(reg && beast, 'Organ must resolve to valid region and beast');

  // Test damaged organ extraction
  const exDmg = { id: 901, kind: 'hunt', region: reg.id, journal: [], done: false };
  const outDmg = { mats: {}, pills: {}, gear: [], techs: [], notes: [] };
  const resDmg = C.harvestOrgan(W, exDmg, [n], outDmg, reg, beast, { forceMutation: true, forceDamage: true });
  assert.strictEqual(resDmg.ok, false);
  assert.strictEqual(resDmg.damaged, true);
  assert.strictEqual(W.world.contentMetrics.organsDamaged, 1);

  // Test intact organ extraction & handover
  const exOk = { id: 902, kind: 'hunt', region: reg.id, journal: [], done: false };
  const outOk = { mats: {}, pills: {}, gear: [], techs: [], notes: [] };
  const resOk = C.harvestOrgan(W, exOk, [n], outOk, reg, beast, { forceMutation: true, guaranteeRecovery: true });
  assert.strictEqual(resOk.ok, true);
  assert.strictEqual(resOk.recovered, true);
  assert.strictEqual(outOk.organs[organ.id], 1);
  assert.strictEqual(W.world.contentMetrics.organsHarvested, 1);
  assert(W.sect.experiments.propertyKnowledge[organ.propertyTags[0]] >= 1, 'Harvesting organ reveals first property tag');

  const cpBefore = n.cp;
  const accepted = X.handover(W, exOk, [n], outOk);
  assert.strictEqual(accepted.organs[organ.id], 1);
  assert.strictEqual(C.organCount(W, organ.id), 1);
  assert(n.cp > cpBefore, 'Handing over rare organ awards CP');

  // Replay guard on handover
  const cpAfterHandover = n.cp;
  X.handover(W, exOk, [n], outOk);
  assert.strictEqual(C.organCount(W, organ.id), 1, 'Replay handover must not duplicate organ');
  assert.strictEqual(n.cp, cpAfterHandover, 'Replay handover must not duplicate CP');

  // Test personal organ donation
  n.inv.organs = { [organ.id]: 2 };
  const donRes = C.donateOrgan(W, n, organ.id, 2);
  assert.strictEqual(donRes.ok, true);
  assert.strictEqual(C.organCount(W, organ.id), 3);
  assert.strictEqual(n.inv.organs, undefined, 'Empty personal organs map cleaned up');

  // Test organ refinement (consumes physical organ + spirit stones, applies deterministic cultivation/healing rewards)
  W.sect.stones = 500;
  n.h.state.hp = Math.max(10, CULT.hpMax(n) - 40);
  n.h.state.heartDemon = 35;
  if (n.cult) n.cult.toxic = 40;
  n.inj = [{ part: 'แขนขวา', sev: 1, why: 'ทดสอบ' }];
  const stonesBefore = W.sect.stones;
  const progBefore = n.cult ? n.cult.prog : 0;
  const refRes = C.refineOrgan(W, n, organ.id);
  assert.strictEqual(refRes.ok, true);
  assert.strictEqual(C.organCount(W, organ.id), 2, 'Refinement consumes 1 organ from sect vault');
  assert.strictEqual(W.sect.stones, stonesBefore - refRes.stoneCost, 'Refinement consumes spirit stones');
  assert(n.h.state.hp > Math.max(10, CULT.hpMax(n) - 40), 'Refinement heals HP');
  if (n.cult) {
    assert(n.cult.toxic < 40, 'Refinement clears pill toxicity');
    assert(n.cult.prog > progBefore, 'Refinement advances cultivation progress');
  }
  assert.strictEqual(W.world.contentMetrics.organsRefined, 1);
}

// 3. Property-Based Experimentation & Permanent Recipe Synergy
{
  const W = SIM.create('experiment-lifecycle');
  const n = W.npcs[1];
  const exp = D.experiments.find(e => e.poisonous) || D.experiments[0];
  n.h.skills[exp.discipline] = 85;
  n.h.skills.ALCHEMY = 85;
  n.h.skills.FORGING = 85;
  W.sect.stones = 500;
  W.sect.recipeTier = 3;

  // Seed inputs for 2 trials (1 fail, 1 catalyst-boosted success)
  for (const inp of exp.trialInputs) {
    ECO.add(W, inp.matId, inp.count * 2);
  }
  C.addOrgan(W, exp.catalystOrganId, 1);

  const toxicBefore = (n.cult && n.cult.toxic) || 0;
  const failRes = C.runExperiment(W, n, exp.id, { forceFail: true, useCatalyst: false });
  assert.strictEqual(failRes.ok, true);
  assert.strictEqual(failRes.success, false);
  assert.strictEqual(W.sect.experiments.notes.length, 1, 'Failed experiment records research note');
  for (const tag of exp.requiredPropertyTags) {
    assert(W.sect.experiments.propertyKnowledge[tag] >= 1, 'Failed experiment still reveals property tags');
  }
  if (exp.poisonous && n.cult) {
    assert(n.cult.toxic > toxicBefore, 'Poisonous experiment failure adds mild toxicity');
  }

  // Run second trial with rare organ catalyst -> succeeds and unlocks recipe + prototype + permanent synergy
  const succRes = C.runExperiment(W, n, exp.id, { forceSuccess: true, useCatalyst: true });
  assert.strictEqual(succRes.ok, true);
  assert.strictEqual(succRes.success, true);
  assert.strictEqual(succRes.usedCatalyst, true);
  assert.strictEqual(C.organCount(W, exp.catalystOrganId), 0, 'Catalyst organ consumed from vault');
  assert(W.sect.experiments.discovered.includes(exp.id), 'Experiment registered in discovered list');
  assert(W.sect.knownRecipes.includes(exp.linkedRecipeId), 'Linked recipe unlocked in sect library');
  assert(C.isRecipeAuthorized(W, n, exp.linkedRecipeId), 'Researcher granted authorization for discovered recipe');
  assert(succRes.prototype, 'Successful experiment synthesizes prototype output');

  // Verify permanent synergy bonus on subsequent crafting of linkedRecipeId
  const rec = ECO.recipeById[exp.linkedRecipeId];
  for (const inp of rec.inputs) {
    ECO.add(W, inp.matId, inp.count * 2);
  }
  const ctx = { rid: rec.id };
  assert(ECO.reserveInputs(W, rec, ctx, n), 'Must reserve inputs for linked recipe');
  W.rng.next = () => 0.01; // guarantee craft success
  const craftOut = ECO.finishCraft(W, n, rec, ctx);
  assert.strictEqual(craftOut.ok, true);
  assert.strictEqual(craftOut.synergyApplied, true, 'Discovered experiment synergy must apply to finished craft');
}

// 4. Factions, Treaties & World Politics
{
  const W = SIM.create('politics-lifecycle');
  W.sect.stones = 600;
  const sTrade = W.world.sects[1]; // SG Merchant Pavilion
  sTrade.attitude = 25;

  const trRes = C.signTreaty(W, sTrade.id, 'TRADE_PACT');
  assert.strictEqual(trRes.ok, true);
  assert.strictEqual(sTrade.treaty, 'TRADE_PACT');
  assert.strictEqual(W.world.politics.treaties[sTrade.id].type, 'TRADE_PACT');
  assert.strictEqual(W.world.politics.stats.treatiesSigned, 1);

  // Advance to 10-day shipment day and verify real resource generation/consumption
  W.day = 10;
  const specMat = sTrade.specialtyMatIds[0];
  const beforeSpec = ECO.count(W, specMat) + ECO.count(W, sTrade.specialtyMatIds[1]);
  const beforeStones = W.sect.stones;
  C.tickPolitics(W);
  const afterSpec = ECO.count(W, specMat) + ECO.count(W, sTrade.specialtyMatIds[1]);
  assert.strictEqual(afterSpec, beforeSpec + 2, 'Trade pact delivers 2 units of specialty material on 10-day cycle');
  assert.strictEqual(W.sect.stones, beforeStones - 12, 'Trade pact shipment pays 12 spirit stones');
  assert.strictEqual(W.world.politics.stats.tradeShipments, 1);

  // Test ALLIANCE joint defense during raid
  const sAlly = W.world.sects[0];
  sAlly.attitude = 55;
  const alRes = C.signTreaty(W, sAlly.id, 'ALLIANCE');
  assert.strictEqual(alRes.ok, true);
  const fRaid = X.spawnRaid(W, 'bandit', 0.5);
  assert(fRaid, 'Raid spawned');
  assert.strictEqual(W.world.politics.stats.jointDefenses, 1, 'Allied sect provides joint defense during raid');

  // Test all 4 Political Event types
  const ev1 = C.spawnPoliticalEvent(W, 'SPECIALTY_CARAVAN', sTrade.id);
  assert(ev1 && W.world.politics.activeEvent === ev1);
  const r1 = C.resolvePoliticalEvent(W, 'ACCEPT');
  assert.strictEqual(r1.ok, true);
  assert.strictEqual(r1.outcome, 'ACCEPTED');
  assert.strictEqual(r1.matAdded, 3);
  assert.strictEqual(W.world.politics.activeEvent, null);

  const sHostile = W.world.sects[5];
  sHostile.attitude = -40;
  C.spawnPoliticalEvent(W, 'TRIBUTE_DEMAND', sHostile.id);
  const r2 = C.resolvePoliticalEvent(W, 'DEFY');
  assert.strictEqual(r2.ok, true);
  assert.strictEqual(r2.outcome, 'DEFIED');

  C.spawnPoliticalEvent(W, 'DOCTRINE_SUMMIT', sAlly.id);
  const r3 = C.resolvePoliticalEvent(W, 'ATTEND');
  assert.strictEqual(r3.ok, true);
  assert.strictEqual(r3.outcome, 'ATTENDED');

  C.spawnPoliticalEvent(W, 'BORDER_HERB_DISPUTE', W.world.sects[3].id);
  const r4 = C.resolvePoliticalEvent(W, 'COMPROMISE');
  assert.strictEqual(r4.ok, true);
  assert.strictEqual(r4.outcome, 'COMPROMISED');
  assert(r4.matAdded >= 1);
  assert.strictEqual(W.world.politics.stats.crisesResolved, 4);

  // Verify save/load round-trip preserves organs, experiments, and politics
  const loaded = SIM.deserialize(SIM.serialize(W));
  assert.deepStrictEqual(loaded.sect.organs, W.sect.organs);
  assert.deepStrictEqual(loaded.sect.experiments, W.sect.experiments);
  assert.deepStrictEqual(loaded.world.politics, W.world.politics);
}

// 5. UI Rendering Verification
{
  const W = SIM.create('ui-v1109');
  C.addOrgan(W, D.rareOrgans[0].id, 2);
  W.npcs[1].inv.organs = { [D.rareOrgans[1].id]: 1 };
  C.signTreaty(W, W.world.sects[0].id, 'ALLIANCE', { force: true, free: true });
  C.spawnPoliticalEvent(W, 'SPECIALTY_CARAVAN', W.world.sects[1].id);

  UI.G = { W, R: {}, opts: {}, acc: 0, speed: 1 };
  UI.tab = 'content';
  const contentHtml = UI.rWorld();
  assert(contentHtml.includes('อวัยวะอสูรกลายพันธุ์และกายวิภาค'), 'Content tab must render rare organs section');
  assert(contentHtml.includes('การทดลองคุณสมบัติและสูตรประยุกต์'), 'Content tab must render property experiments section');
  assert(contentHtml.includes(D.rareOrgans[0].nameTh));
  assert(contentHtml.includes(D.experiments[0].nameTh));
  assert(!contentHtml.includes('undefined') && !contentHtml.includes('NaN'));

  UI.tab = 'sects';
  const sectsHtml = UI.rWorld();
  assert(sectsHtml.includes('เหตุการณ์การเมืองยุทธภพปัจจุบัน'), 'Sects tab must render active political event');
  assert(sectsHtml.includes('พันธมิตรยุทธภพ'), 'Sects tab must render treaty status');
  assert(!sectsHtml.includes('undefined') && !sectsHtml.includes('NaN'));

  UI.npcId = W.npcs[1].id;
  UI.tab = 'ov';
  const npcHtml = UI.rNpc();
  assert(npcHtml.includes(D.rareOrgans[1].nameTh), 'NPC sheet must render personally held rare organ');
  assert(!npcHtml.includes('undefined') && !npcHtml.includes('NaN'));
}

console.log('PASS v1.10.9 rare organs, property experimentation, factions/world politics, synergies, save/load, and UI rendering');
