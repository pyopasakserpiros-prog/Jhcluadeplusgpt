'use strict';
const assert = require('assert'), fs = require('fs'), path = require('path');
const G = require('./load');
const { SIM, ECO, CPE, JD, EXPED: X, SECT, HC, CULT } = G;

console.log('Testing Wider Welfare & Production Policies (v1.10.6)...');

// 1. Core byte-lock verification
const hcPath = path.join(__dirname, '../js/human_core.js');
const crypto = require('crypto');
const hcSha = crypto.createHash('sha256').update(fs.readFileSync(hcPath)).digest('hex');
assert.strictEqual(hcSha, 'a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542', 'human_core.js sha256 byte-lock preserved');
assert.strictEqual(HC.FINGERPRINT, '155:2f9c9dd7', 'human_core.js fingerprint preserved');

// 2. Reserve Directives Initialization & Structure
const W = SIM.create('welfare-test-1');
assert(W.sect.reserveDirectives, 'reserveDirectives must be initialized on world create');
const rd = W.sect.reserveDirectives;
assert(Number.isFinite(rd.minGrainDays) && rd.minGrainDays >= 8, 'valid minGrainDays');
assert(Number.isFinite(rd.minMealReserve) && rd.minMealReserve >= 10, 'valid minMealReserve');
assert(Number.isFinite(rd.expeditionMinSafetyMeal) && rd.expeditionMinSafetyMeal >= 6, 'valid expeditionMinSafetyMeal');
assert(rd.medicine && typeof rd.medicine === 'object', 'valid medicine reserve table');
assert(rd.medicine['P:BASIC_HP'] > 0, 'HP pill reserve configured');
assert(rd.medicine['P:BASIC_WOUND'] > 0, 'wound pill reserve configured');

// 3. Expedition Meal Safety Reserve Enforcement
{
  const W_exp = SIM.create('welfare-exp-reserve');
  ECO.take(W_exp, 'meal', ECO.count(W_exp, 'meal')); // empty meals
  ECO.add(W_exp, 'meal', 22); // only 22 meals
  W_exp.sect.reserveDirectives.minMealReserve = 20;
  W_exp.sect.reserveDirectives.expeditionMinSafetyMeal = 15;
  
  const party = [W_exp.npcs[0], W_exp.npcs[1]];
  const ex = X.depart(W_exp, party, 'gather', X.REGIONS[0]);
  assert(ex, 'expedition departed');
  // Available above safety reserve was 22 - 20 = 2.
  // If takeMax < party.length (2 <= 2), it can take at most 2
  assert(ECO.count(W_exp, 'meal') >= 15, 'meal count did not drop below emergency safety floor');
  assert(ex.supplies > 0, 'expedition received rations');
}

// 4. Shortage Directives Generation
{
  const W_short = SIM.create('welfare-shortage-gen');
  SECT.ensureDirectives(W_short);
  
  // Force a shortage of grain
  ECO.take(W_short, 'grain', ECO.count(W_short, 'grain')); // 0 grain
  // Force a shortage of HP pills
  ECO.take(W_short, 'P:BASIC_HP', ECO.count(W_short, 'P:BASIC_HP'));
  
  SECT.hallHeads(W_short);
  assert(Array.isArray(W_short.sect.shortageDirectives), 'shortageDirectives is an array');
  assert(W_short.sect.shortageDirectives.length > 0, 'shortageDirectives populated');
  
  const grainShort = W_short.sect.shortageDirectives.find(d => d.id === 'grain');
  assert(grainShort, 'grain shortage directive generated');
  assert.strictEqual(grainShort.kind, 'provision');
  assert(grainShort.deficit > 0, 'positive grain deficit');
  assert.strictEqual(grainShort.priority, 'critical', '0 grain triggers critical priority');
  
  const hpShort = W_short.sect.shortageDirectives.find(d => d.id === 'P:BASIC_HP');
  assert(hpShort, 'HP pill shortage directive generated');
  assert.strictEqual(hpShort.kind, 'medicine');
  assert.strictEqual(hpShort.priority, 'critical');
  
  // buyList should be populated from shortageDirectives
  assert(W_short.sect.buyList.length > 0, 'buyList populated from shortages');
  assert(W_short.sect.buyList.some(b => b.id === 'grain'), 'grain is in caravan buyList');
}

// 5. Need-Based vs Relationship-Biased Welfare Decisions
// Scenario A: High Meritocracy (need-based governance)
{
  const W_fair = SIM.create('welfare-fair-gov');
  W_fair.sect.policy.meritocracy = 95;
  const tr = W_fair.byId[W_fair.sect.masterId];
  tr.h.personality.integrity = 90;
  
  // Stock basic pills
  ECO.add(W_fair, 'P:BASIC_WOUND', 5);
  ECO.add(W_fair, 'P:BASIC_HP', 5);
  
  // Disciples: n1 has high need (severe wound) but neutral relation
  // n2 is healthy favorite (high relation with tr)
  const n1 = W_fair.npcs[1];
  const n2 = W_fair.npcs[2];
  
  n1.inj = [{ part: 'arm', sev: 3, why: 'บาดเจ็บหนักในการฝึก' }];
  n1.h.state.hp = 20;
  n1.merit = 50;
  SECT.rel(tr, n1.id).r = 0; // neutral relation
  
  n2.inj = [];
  n2.h.state.hp = CULT.hpMax(n2);
  n2.h.state.heartDemon = 40; // slight need
  SECT.rel(tr, n2.id).r = 80; // beloved favorite
  
  CPE.welfareDaily(W_fair);
  
  const hist = W_fair.sect.welfareHistory[0];
  assert(hist, 'welfareHistory recorded');
  assert.strictEqual(hist.meritocracy, 95);
  
  // n1 (critically injured) should have received wound medicine
  const recN1 = hist.recipients.find(r => r.id === n1.id);
  assert(recN1, 'critically injured member received welfare under high meritocracy');
  assert.strictEqual(recN1.item, 'P:BASIC_WOUND');
}

// Scenario B: Low Meritocracy & Favoritism with Passed-Over Resentment
{
  const W_bias = SIM.create('welfare-biased-gov');
  W_bias.sect.policy.meritocracy = 10; // heavy relationship bias
  W_bias.sect.policy.generosity = 40;
  const tr = W_bias.byId[W_bias.sect.masterId];
  tr.h.personality.integrity = 20; // low integrity treasurer
  tr.h.personality.empathy = 80;
  
  // Very limited pill stock: only 2 HP pills (just above reserve)
  ECO.take(W_bias, 'P:BASIC_HP', ECO.count(W_bias, 'P:BASIC_HP'));
  ECO.take(W_bias, 'P:BASIC_WOUND', ECO.count(W_bias, 'P:BASIC_WOUND'));
  ECO.add(W_bias, 'P:BASIC_HP', 3);
  W_bias.sect.reserveDirectives.medicine['P:BASIC_HP'] = 1;
  
  const nNeedy = W_bias.npcs[1];
  const nFav = W_bias.npcs[2];
  
  nNeedy.h.state.hp = 15; // low HP
  nNeedy.merit = 60;
  nNeedy.sat = 70;
  SECT.rel(tr, nNeedy.id).r = -10; // outsider
  
  nFav.h.state.hp = Math.round(CULT.hpMax(nFav) * 0.65); // slightly below 70%
  SECT.rel(tr, nFav.id).r = 95; // beloved favorite
  
  const initialNeedySat = nNeedy.sat;
  CPE.welfareDaily(W_bias);
  
  const hist = W_bias.sect.welfareHistory[0];
  assert(hist, 'welfare history logged under favoritism');
  // Check if nNeedy was passed over or felt resentment
  if (hist.passedOverCount > 0) {
    assert(nNeedy.sat <= initialNeedySat, 'needy disciple experienced satisfaction penalty when passed over');
  }
}

// 6. Premium Pill Protection & Shop Availability
{
  const W_prem = SIM.create('welfare-premium-protect');
  // Add premium pill and gear
  const premPillId = 'P:SRC110_MW_REC_001';
  ECO.add(W_prem, premPillId, 5);
  ECO.add(W_prem, 'P:BASIC_HP', 10);
  
  // Run welfare daily
  CPE.welfareDaily(W_prem);
  
  // Assert: premium pill was NEVER given in welfare
  const hist = W_prem.sect.welfareHistory[0];
  if (hist && hist.recipients) {
    assert(!hist.recipients.some(r => r.item === premPillId), 'premium pill was NOT given as welfare');
  }
  assert.strictEqual(ECO.count(W_prem, premPillId), 5, 'premium pill stock remains completely intact (no welfare leak)');
  
  // Assert: premium pill IS available in shop
  const shopItems = CPE.shopItems(W_prem);
  const foundPrem = shopItems.find(i => i.key === premPillId);
  assert(foundPrem, 'premium pill is listed in CPE.shopItems');
  assert(foundPrem.price > 0, 'premium pill has valid CP purchase price');
  
  // Member with enough CP can buy premium pill
  const buyer = W_prem.npcs[1];
  buyer.cp = 200;
  buyer.cult = buyer.cult || { path: 'XIAN', stage: 2, prog: 10, toxic: 0 };
  const ok = CPE.buy(W_prem, buyer, { kind: 'pill', key: premPillId, price: CPE.priceOf(W_prem, premPillId) });
  assert(ok, 'member successfully purchased premium pill with CP');
  assert.strictEqual(ECO.count(W_prem, premPillId), 4, 'sect stock decremented on purchase');
  assert.strictEqual(buyer.inv.pills[premPillId], 1, 'buyer personal inventory received premium pill');
}

// 7. Gear Distribution under Meritocracy vs Relationship Bias
{
  const W_gear = SIM.create('welfare-gear-test');
  W_gear.sect.gear.push({ id: 'G_TEST_SWORD', slot: 'WEAPON', tier: 1, nameTh: 'กระบี่เหล็กกล้าชั้นเลิศ', minStage: 1, value: 50, q: 1.2 });
  
  const m = W_gear.byId[W_gear.sect.masterId];
  m.equip.WEAPON = { id: 'G_MASTER_SWORD', slot: 'WEAPON', tier: 3, nameTh: 'กระบี่เจ้าสำนัก', minStage: 3, value: 500, q: 2.0 };
  W_gear.sect.policy.meritocracy = 90;
  
  const n1 = W_gear.npcs[1];
  n1.rank = 2; n1.merit = 100;
  n1.cult = Object.assign(n1.cult || {}, { path: 'XIAN', stage: 2, prog: 50, techs: [] });
  
  SIM.distributeGear(W_gear);
  assert(n1.equip.WEAPON && n1.equip.WEAPON.id === 'G_TEST_SWORD', 'high merit cultivator received gear under meritocracy');
}

// 8. Legacy Save Compatibility & Serialization
{
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/v1_9_synthetic.json'), 'utf8'));
  const W_leg = SIM.deserialize(JSON.stringify(raw));
  assert(W_leg.sect.reserveDirectives, 'legacy save automatically receives reserveDirectives');
  assert(Array.isArray(W_leg.sect.shortageDirectives), 'legacy save receives shortageDirectives');
  assert(Array.isArray(W_leg.sect.welfareHistory), 'legacy save receives welfareHistory');
  
  // Check roundtrip serialization
  const serialized = SIM.serialize(W_leg);
  const W_reloaded = SIM.deserialize(serialized);
  assert.deepStrictEqual(W_reloaded.sect.reserveDirectives, W_leg.sect.reserveDirectives, 'reserveDirectives preserved across serialize/deserialize');
}

console.log('PASS welfare_production_policies: reserve directives, visible shortages, need/bias welfare, premium protection, and save compatibility verified.');
