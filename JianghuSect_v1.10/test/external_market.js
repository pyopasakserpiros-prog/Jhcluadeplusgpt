'use strict';
const assert = require('assert');
const G = require('./load.js');
const { SIM, ECO, EXT, AI, HC, CULT } = G;

function world(seed) { return SIM.create(seed || 'external-market-test', { masterIdx: 0 }); }
function trader(W, options) { return EXT.openVisit(W, Object.assign({ nameTh: 'พ่อค้าทดสอบ', stones: 1200, stock: {}, wants: {}, stayDays: 2 }, options || {})); }

assert(EXT && typeof EXT.openVisit === 'function', 'external market system must be loaded');

// Sect-to-trader purchase: goods move from the visitor's real inventory into the sect warehouse.
{
  const W = world('external-sect-buy');
  const id = 'MAT_ORE_BLACK_IRON_1';
  const v = trader(W, { stock: { [id]: 5 }, wants: {} });
  W.sect.stones = 1000;
  W.sect.buyList = [{ id, n: 3 }];
  const beforeStock = ECO.count(W, id), beforeSectStones = W.sect.stones, beforeTraderStones = v.stones;
  const result = EXT.tradeSect(W, v);
  assert(result.bought > 0, 'sect treasury should buy requested goods from a visiting trader');
  assert.strictEqual(ECO.count(W, id), beforeStock + result.bought);
  assert.strictEqual(v.stock[id], 5 - result.bought);
  assert.strictEqual(W.sect.stones, beforeSectStones - result.buyCost);
  assert.strictEqual(v.stones, beforeTraderStones + result.buyCost);
  assert(W.sect.ledger.some(x => x.why.includes('พ่อค้า')) || W.sect.ledger.some(x => x.why.includes('ตลาดภายนอก')));
  v.stock[id] = 5; W.day += 1;
  const repeatDay = EXT.tradeSect(W, v);
  assert.strictEqual(repeatDay.bought, 0, 'one visitor cannot trigger repeated treasury purchases during a multi-day visit');
}


// If the first visit day has no treasury demand, a later newly-issued shortage order can still be filled.
{
  const W = world('external-late-demand');
  const id = 'MAT_ORE_BLACK_IRON_1';
  ECO.add(W, id, 100);
  const v = trader(W, { stock: { [id]: 5 }, wants: {}, stones: 1200 });
  W.sect.buyList = [];
  const first = EXT.tradeSect(W, v);
  assert.strictEqual(first.bought, 0);
  assert.strictEqual(v.sectBuyDone, false, 'no purchase should not consume the visit purchase opportunity');
  W.sect.buyList = [{ id, n: 2 }]; W.day += 1;
  const second = EXT.tradeSect(W, v);
  assert(second.bought > 0, 'new treasury demand during the same visit should be eligible for purchase');
}

// Trader-to-sect sale: the sect sells only surplus, preserving a reserve for its own ecosystem.
{
  const W = world('external-sect-sell');
  const id = 'MAT_HERB_DEW_GRASS_1';
  ECO.add(W, id, 30);
  const v = trader(W, { stock: {}, wants: { [id]: 4 }, stones: 1200 });
  const beforeStock = ECO.count(W, id), beforeSectStones = W.sect.stones, beforeTraderStones = v.stones;
  const result = EXT.tradeSect(W, v);
  assert(result.sold > 0, 'visitor should buy wanted surplus from the sect');
  assert.strictEqual(ECO.count(W, id), beforeStock - result.sold);
  assert.strictEqual(W.sect.stones, beforeSectStones + result.sellRevenue);
  assert.strictEqual(v.stones, beforeTraderStones - result.sellRevenue);
  assert(ECO.count(W, id) >= EXT.reserveForSect(W, id), 'sect reserve must never be sold');
}

// Members use their personal spirit stones—not contribution points—to buy medicine from outsiders.
{
  const W = world('external-member-buy');
  const n = W.npcs[1], id = 'P:BASIC_HP';
  const v = trader(W, { stock: { [id]: 2 }, wants: {}, stones: 1200 });
  n.inv.stones = 100;
  n.inv.pills = {};
  n.h.state.hp = 1;
  const q = EXT.memberQuote(W, n);
  assert(q && q.side === 'buy' && q.itemId === id, 'injured member should choose an available healing pill');
  const beforeWallet = n.inv.stones, beforeTraderWallet = v.stones;
  assert(EXT.tradeMember(W, n, q), 'valid outside purchase should settle');
  assert.strictEqual(n.inv.stones, beforeWallet - q.price);
  assert.strictEqual(v.stones, beforeTraderWallet + q.price);
  assert.strictEqual(v.stock[id], 1);
  assert.strictEqual(n.inv.pills[id], 1);
}

// Members can sell their own common materials for spirit stones; this does not mint contribution points.
{
  const W = world('external-member-sell');
  const n = W.npcs[1], id = 'MAT_HERB_CINDER_LEAF_1';
  const v = trader(W, { stock: {}, wants: { [id]: 3 }, stones: 1200 });
  n.inv.mats = { [id]: 3 };
  n.inv.stones = 10;
  const beforeCP = n.cp, beforeWallet = n.inv.stones, beforeTraderWallet = v.stones;
  const q = EXT.memberQuote(W, n);
  assert(q && q.side === 'sell' && q.itemId === id, 'member with demanded goods should receive a sell quote');
  assert(EXT.tradeMember(W, n, q));
  assert.strictEqual(n.inv.mats[id], 2);
  assert.strictEqual(n.inv.stones, beforeWallet + q.price);
  assert.strictEqual(v.stones, beforeTraderWallet - q.price);
  assert.strictEqual(n.cp, beforeCP, 'external sales must not mint contribution points');
}


// Trade-oriented cultivators may stock one affordable basic pill even without an emergency.
{
  const W = world('external-proactive-buy');
  const n = W.npcs[1], id = 'P:BASIC_HP';
  const v = trader(W, { stock: { [id]: 1 }, wants: {}, stones: 1200 });
  n.rank = Math.max(1, n.rank); n.inv.stones = 120; n.inv.pills = {}; n.h.state.hp = CULT.hpMax(n);
  const original = HC.eff;
  HC.eff = (npc, path) => path === 'interests.medicine' || path === 'interests.trade' ? 95 : original(npc, path);
  const q = EXT.memberQuote(W, n);
  assert(q && q.side === 'buy' && q.itemId === id && q.reason.includes('สำรอง'), 'trade-oriented cultivator should stock a pill when able to afford a reserve');
  assert(EXT.tradeMember(W, n, q));
  HC.eff = original;
  assert.strictEqual(n.inv.pills[id], 1);
}

// Surplus pills can be sold, but an injured member must not sell medicine they may need.
{
  const W = world('external-member-sell-pill');
  const n = W.npcs[1], id = 'P:BASIC_HP';
  const v = trader(W, { stock: {}, wants: { [id]: 3 }, stones: 1200 });
  n.inv.pills = { [id]: 2 }; n.inv.mats = {}; n.inv.stones = 10; n.h.state.hp = 1;
  assert.strictEqual(EXT.memberQuote(W, n), null, 'urgent healing needs protect held pills from sale');
  n.h.state.hp = CULT.hpMax(n);
  const q = EXT.memberQuote(W, n);
  assert(q && q.side === 'sell-pill' && q.itemId === id);
  assert(EXT.tradeMember(W, n, q));
  assert.strictEqual(n.inv.pills[id], 1);
}

// Stale quotes and insufficient funds cannot create items or negative wallets.
{
  const W = world('external-stale-quote');
  const n = W.npcs[1], id = 'P:BASIC_HP';
  const v = trader(W, { stock: { [id]: 1 }, wants: {}, stones: 100 });
  n.inv.stones = 100; n.inv.pills = {}; n.h.state.hp = 1;
  const q = EXT.memberQuote(W, n); assert(q && q.side === 'buy');
  v.stock[id] = 0;
  const before = n.inv.stones;
  assert.strictEqual(EXT.tradeMember(W, n, q), false);
  assert.strictEqual(n.inv.stones, before);
  assert.strictEqual(n.inv.pills[id] || 0, 0);
  assert(n.inv.stones >= 0 && v.stones >= 0);
}

// Visitor inventories and trade history survive save/load, and one visitor cannot settle twice in a day.
{
  const W = world('external-save');
  const id = 'MAT_ORE_BLACK_IRON_1';
  const v = trader(W, { stock: { [id]: 4 }, wants: {}, stones: 1000 });
  W.sect.buyList = [{ id, n: 2 }];
  const result = EXT.tradeSect(W, v);
  assert(result.bought > 0);
  const after = SIM.serialize(W), L = SIM.deserialize(after);
  EXT.ensure(L);
  const lv = L.world.visitors.find(x => x.id === v.id);
  assert(lv, 'active visitor must survive serialization');
  assert.strictEqual(lv.stock[id], v.stock[id]);
  assert(L.world.tradeHistory.length > 0, 'trade history must be saved');
  const before = SIM.serialize(L);
  EXT.tradeSect(L, lv);
  assert.strictEqual(SIM.serialize(L), before, 'same-day duplicate sect settlement must be a no-op');
}

// Visits are blocked by a closed road, but normal daily updates can spawn real visitors.
{
  const W = world('external-visit-cycle');
  W.world.visitors = [];
  const chance = W.rng.chance;
  W.rng.chance = () => true;
  W.threat.roadBlocked = 0;
  EXT.daily(W);
  assert(EXT.activeVisitors(W).length > 0, 'open road and successful visit roll should create a trader');
  W.world.visitors = [];
  W.threat.roadBlocked = 10;
  EXT.daily(W);
  assert.strictEqual(EXT.activeVisitors(W).length, 0, 'blocked road should prevent new visitors');
  W.rng.chance = chance;
}


// Read-only visitor queries must not initialize or mutate economy state from a UI/render path.
{
  const W = world('external-read-only-query');
  delete W.world.marketStats;
  assert.deepStrictEqual(EXT.activeVisitors(W), []);
  assert.strictEqual(W.world.marketStats, undefined, 'querying active visitors must remain read-only');
}

console.log('PASS external market: sect purchase/sale, member purchase/sale, quote safety, save/load, and visit cycle');
