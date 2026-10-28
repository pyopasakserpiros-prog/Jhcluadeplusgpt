'use strict';
const assert = require('assert');
const G = require('./load.js');
const { SIM, CPE, ECO, AI, HC, JD, EXPED } = G;

function world(seed) { return SIM.create(seed || 'cp-economy-test', { masterIdx: 0 }); }

// 1) Prices move in the right direction: scarce stock costs more than surplus stock.
{
  const W = world('cp-price');
  const id = 'P:BASIC_HP';
  ECO.take(W, id, ECO.count(W, id));
  const scarcePrice = CPE.priceOf(W, id);
  ECO.add(W, id, 80);
  const surplusPrice = CPE.priceOf(W, id);
  assert(scarcePrice > surplusPrice, `scarcity price should rise (${scarcePrice} > ${surplusPrice})`);
}

// 2) Ordinary recovery recipes are all craftable from easy tier-1 valley herbs.
{
  const easy = new Set(['BASIC_HP', 'BASIC_QI', 'BASIC_VIGOR', 'BASIC_WOUND', 'BASIC_DETOX', 'BASIC_CALM']);
  for (const r of JD.CP.BASIC.filter(r => easy.has(r.id))) {
    assert(r.inputs.every(i => ECO.matById[i.matId] && ECO.matById[i.matId].tier === 1), `${r.id} must use tier-1 herbs only`);
  }
}

// 3) A member who keeps expedition materials actually owns them; CP is paid only for the accepted donation.
{
  const W = world('cp-handover');
  const n = W.npcs[1];
  W.sect.policy.generosity = 0;
  W.sect.policy.strictness = 0;
  const originalEff = HC.eff;
  HC.eff = (npc, path) => {
    if (path === 'values.wealthResource') return 100;
    if (path === 'personality.integrity' || path === 'personality.loyalty') return 0;
    return originalEff(npc, path);
  };
  const originalChance = W.rng.chance;
  W.rng.chance = p => p > 0;
  const key = 'MAT_HERB_DEW_GRASS_1';
  const beforeStock = ECO.count(W, key), beforeCp = n.cp, beforeMinted = CPE.S(W).minted;
  const scroll = JD.TECH.techniques.find(t => !W.sect.library.includes(t.id));
  assert(scroll, 'test needs a technique not already in the library');
  const out = { mats: { [key]: 4 }, pills: {}, gear: [], techs: [scroll.id], stones: 0, notes: [] };
  const donation = EXPED.handover(W, { kind: 'fortune' }, [n], out);
  HC.eff = originalEff;
  W.rng.chance = originalChance;
  assert.strictEqual(ECO.count(W, key) - beforeStock, 2, 'only donated half should enter warehouse');
  assert.strictEqual(n.inv.mats[key], 2, 'kept half should remain in member inventory');
  assert(n.inv.techs && n.inv.techs.includes(scroll.id), 'a privately kept scroll should remain with its finder');
  assert(!W.sect.library.includes(scroll.id), 'a privately kept scroll must not enter the sect library yet');
  const expected = Math.round(CPE.donorValue(W, donation) * 10) / 10;
  assert(Math.abs((CPE.S(W).minted - beforeMinted) - expected) < 1e-8, 'CP should match accepted goods, not the full loot');
  assert(Math.abs((n.cp - beforeCp) - expected) < 1e-8, 'member should receive only accepted-goods CP');
}

// 4) A member can later donate their personal materials back into the warehouse for CP.
{
  const W = world('cp-personal-donation');
  const n = W.npcs[1], key = 'MAT_HERB_CINDER_LEAF_1';
  n.inv.mats = { [key]: 3 };
  const scroll = JD.TECH.techniques.find(t => !W.sect.library.includes(t.id));
  assert(scroll, 'test needs a private scroll to donate');
  n.inv.techs = [scroll.id];
  n.cp = 0;
  const before = ECO.count(W, key);
  assert(AI.ACTS.donate.can(n, W), 'member with private goods should be eligible to donate');
  assert(AI.ACTS.donate.where(W, n), 'donation should have a valid station');
  AI.ACTS.donate.done(n, W);
  assert(ECO.count(W, key) > before, 'donation should add materials to warehouse');
  assert((n.inv.mats[key] || 0) < 3, 'donation should reduce personal inventory');
  assert(n.cp > 0, 'donation should mint contribution points for the member');
  assert(W.sect.library.includes(scroll.id), 'donated scroll should enter the sect library');
  assert(!n.inv.techs.includes(scroll.id), 'donated scroll should leave personal inventory');
}

// 5) Basic pills enter stock only after a member spends the sect's ingredients to craft them.
{
  const W = world('cp-craft-test');
  const n = W.npcs[1], r = ECO.recipeById.BASIC_HP;
  n.h.skills.ALCHEMY = 100;
  const beforeHerbA = ECO.count(W, r.inputs[0].matId), beforeHerbB = ECO.count(W, r.inputs[1].matId);
  assert.strictEqual(ECO.count(W, 'P:BASIC_HP'), 0, 'no free pill stock at game start');
  const ctx = { rid: r.id };
  assert(AI.ACTS.brewBasic.start(n, W, ctx), 'member should be able to reserve ingredients');
  AI.ACTS.brewBasic.done(n, W, ctx);
  assert(ECO.count(W, 'P:BASIC_HP') >= 2, 'crafted pills should enter sect stock');
  assert(ECO.count(W, r.inputs[0].matId) < beforeHerbA && ECO.count(W, r.inputs[1].matId) < beforeHerbB, 'crafting must consume warehouse ingredients');
  assert(n.cp > 40, 'member should earn CP for successful production');
}

// 6) Studying a paid technique deducts its price once and starts the exact technique paid for.
{
  const W = world('cp-study');
  const n = W.npcs.find(x => x.cult && x.cult.stage >= 2) || W.npcs.find(x => x.cult);
  assert(n, 'test needs a cultivator');
  n.cult.learning = null;
  n.cp = 1000;
  const selected = AI.nextTechToStudy(W, n);
  assert(selected, 'test needs an available technique');
  const price = CPE.techPrice(W, selected);
  assert(price > 0, 'selected technique should be paid');
  n.cp = price;
  const expected = AI.nextTechToStudy(W, n);
  assert(expected, 'exact-price technique should remain available');
  const beforeBurn = CPE.S(W).burned;
  const ok = AI.ACTS.study.start(n, W, {});
  assert.notStrictEqual(ok, false, 'study should start');
  assert.strictEqual(n.cp, 0, 'exact price should be deducted exactly once');
  assert.strictEqual(n.cult.learning.id, expected.id, 'the paid technique must be the one actually studied');
  assert.strictEqual(CPE.S(W).burned - beforeBurn, price, 'burn ledger should record one price');
}

// 7) Starting stock must not conjure pills, and initialization must preserve a true zero balance.
{
  const W = world('cp-zero');
  for (const r of JD.CP.BASIC) assert.strictEqual(ECO.count(W, 'P:' + r.id), 0, 'basic pills must be produced, not seeded from air');
  W.npcs[1].cp = 0;
  CPE.init(W);
  assert.strictEqual(W.npcs[1].cp, 0, 'zero CP is a valid balance and must not be reset');
}

// 8) Personal donations survive save/load without losing their item provenance.
{
  const W = world('cp-save-load');
  const n = W.npcs[1], scroll = JD.TECH.techniques.find(t => !W.sect.library.includes(t.id));
  n.inv.mats = { MAT_HERB_DEW_GRASS_1: 4 };
  n.inv.techs = [scroll.id];
  const restored = SIM.deserialize(SIM.serialize(W));
  const rn = restored.byId[n.id];
  assert.strictEqual(rn.inv.mats.MAT_HERB_DEW_GRASS_1, 4, 'personal materials should survive save/load');
  assert(rn.inv.techs.includes(scroll.id), 'personal scrolls should survive save/load');
}



// 9) A pill bought/received into personal inventory is truly consumed, not recycled into sect stock.
{
  const W = world('cp-pill-consumption');
  const n = W.npcs[1], key = 'P:BASIC_HP';
  n.inv.pills = { [key]: 1 };
  n.h.state.hp = 1;
  const stockBefore = ECO.count(W, key), hpBefore = n.h.state.hp;
  CPE.autoUse(W, n);
  assert.strictEqual(n.inv.pills[key] || 0, 0, 'used personal pill must leave the personal inventory');
  assert.strictEqual(ECO.count(W, key), stockBefore, 'using a personal pill must not replenish sect stock');
  assert(n.h.state.hp > hpBefore, 'personal pill must still apply its healing effect');
  ECO.add(W, key, 1);
  const fromStock = ECO.count(W, key);
  assert(ECO.usePill(W, n, key), 'warehouse pill should be usable');
  assert.strictEqual(ECO.count(W, key), fromStock - 1, 'using a warehouse pill must consume exactly one stock item');
}

// 10) Premium item-backed medicines are real shop goods and can be bought for a relevant need.
{
  const W = world('cp-premium-pill-shop');
  const n = W.npcs.find(x => x.cult) || W.npcs[0], key = 'ITEM190_PILL_001';
  W.sect.stock = {}; W.sect.gear = [];
  ECO.add(W, key, 2); n.cp = 10000;
  if (n.cult) n.cult.toxic = 80;
  const listing = CPE.shopItems(W).find(x => x.kind === 'pill' && x.key === key);
  assert(listing && listing.price > 0, 'item-backed premium pill should appear in the shop with a real price');
  const picked = CPE.pickPurchase(W, n);
  assert(picked && picked.kind === 'pill' && picked.key === key, 'member with accumulated toxicity should consider the premium detox pill');
  const cpBefore = n.cp, stockBefore = ECO.count(W, key);
  assert(CPE.buy(W, n, picked), 'premium pill purchase should succeed');
  assert(n.cp < cpBefore, 'premium pill purchase must burn contribution points');
  assert.strictEqual(ECO.count(W, key), stockBefore - 1, 'premium pill purchase must transfer one real item from stock');
}

// 11) Price index follows economy-wide balances, rather than being held down by a few new low-balance recruits.
{
  const rich = world('cp-price-rich');
  rich.npcs.filter(n => !n.dead && !n.exiled).forEach(n => { n.cp = 1000; });
  CPE.S(rich).price = 1;
  CPE.daily(rich);
  assert(CPE.S(rich).price > 1, 'high average wallet balance should raise the price index');
  const poor = world('cp-price-poor');
  poor.npcs.filter(n => !n.dead && !n.exiled).forEach(n => { n.cp = 0; });
  CPE.S(poor).price = 1;
  CPE.daily(poor);
  assert(CPE.S(poor).price < 1, 'low average wallet balance should lower the price index');
}



// 12) Paid scripture guidance is a real service sink: it costs CP, improves the current lesson, and has a cooldown.
{
  const W = world('cp-guidance-service');
  const n = W.npcs.find(x => x.cult && x.id !== W.sect.masterId && x.rank < 4) || W.npcs.find(x => x.cult) || W.npcs[0];
  const tech = JD.TECH.techniques.find(t => W.sect.library.includes(t.id) && t.tier >= 2) || JD.TECH.techniques.find(t => t.tier >= 2);
  assert(n.cult && tech, 'test needs a cultivator and an advanced technique');
  n.cult.learning = { id: tech.id, need: 100, got: 10 };
  n.cp = 10000; n.insightT = 0; n.guidanceDay = -999;
  const fee = CPE.guidanceFee(W, n), beforeCp = n.cp, beforeBurn = CPE.S(W).burned, ctx = {};
  assert(AI.ACTS.guidedStudy.can(n, W), 'eligible student should be able to request guidance');
  assert(AI.ACTS.guidedStudy.start(n, W, ctx), 'guidance service should start');
  assert.strictEqual(n.cp, beforeCp - fee, 'guidance fee must be charged once');
  assert.strictEqual(CPE.S(W).burned - beforeBurn, fee, 'guidance fee must be burned from the economy');
  const beforeProgress = n.cult.learning.got;
  for (let i = 0; i < 30; i++) AI.ACTS.guidedStudy.tick(n, W, ctx);
  assert(n.cult.learning.got > beforeProgress, 'guidance must advance the current lesson');
  assert(n.insightT > 0, 'guidance should leave a temporary study insight');
  assert.strictEqual(CPE.S(W).studyServices, 1, 'service ledger should count one consultation');
  assert(!AI.ACTS.guidedStudy.can(n, W), 'student should not repeat the paid service during its cooldown');
}



// 13) Paid intensive cultivation training burns CP and grants bounded progress with a cooldown.
{
  const W = world('cp-paid-training');
  const n = W.npcs.find(x => x.cult && x.id !== W.sect.masterId) || W.npcs.find(x => x.cult);
  assert(n && n.cult, 'test needs a cultivator');
  n.cult.prog = 0; n.cp = 10000; n.h.state.energy = 90; n.h.state.satiety = 90; n.paidTrainingDay = -999;
  const fee = CPE.trainingFee(W, n), beforeCp = n.cp, beforeBurn = CPE.S(W).burned, beforeProg = n.cult.prog, ctx = {};
  assert(AI.ACTS.paidTraining.can(n, W), 'eligible cultivator should be able to buy intensive training');
  assert(AI.ACTS.paidTraining.start(n, W, ctx), 'paid training should start');
  assert.strictEqual(n.cp, beforeCp - fee, 'training fee must be charged once');
  assert.strictEqual(CPE.S(W).burned - beforeBurn, fee, 'training fee must be burned');
  for (let i = 0; i < 90; i++) AI.ACTS.paidTraining.tick(n, W, ctx);
  assert(n.cult.prog > beforeProg, 'paid training must grant cultivation progress');
  assert(n.cult.prog <= CULT.threshold(n) * 0.1, 'single session must not grant excessive cultivation progress');
  assert.strictEqual(CPE.S(W).trainingServices, 1, 'training service should be recorded once');
  assert(!AI.ACTS.paidTraining.can(n, W), 'training service should respect its cooldown');
}

console.log('PASS contribution economy: scarcity pricing, basic recipes, sourced crafting, truthful handover, personal donation, one-time study payment, no free starting pills, zero-balance preservation, save/load inventory, true pill consumption, premium pill shop, adaptive price index, paid guidance service, paid training sink');
