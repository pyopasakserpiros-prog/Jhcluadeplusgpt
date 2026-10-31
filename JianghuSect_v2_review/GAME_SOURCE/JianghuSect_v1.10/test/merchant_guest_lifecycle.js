'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, EXT, VC } = G;

const W = SIM.create('merchant-guest-lifecycle-regression');
const original = EXT.openVisit(W, {
  id: 'trader_return_fixture', subtype: 'general', nameTh: 'พ่อค้าทดสอบ', stones: 517,
  stock: { grain: 3 }, wants: { meal: 2 }, stayDays: 2
});
assert.strictEqual(original.kind, 'trader');
assert.strictEqual(original.role, 'merchant');
assert.strictEqual(original.stones, 517);

VC.departVisitor(W, original, 'regression fixture departure');
const saved = W.world.guestRegistry[original.id];
assert(saved, 'departed trader should retain a registry record');
assert.strictEqual(saved.state, 'offsite');
assert.strictEqual(saved.stones, 517, 'trader wallet must survive departure');
assert.deepStrictEqual(saved.stock, { grain: 3 }, 'trader stock must survive departure');
assert.deepStrictEqual(saved.wants, { meal: 2 }, 'trader demand must survive departure');

const visitsBeforeReturn = W.world.marketStats.visits;
const returned = VC.spawnGuest(W, { returningId: original.id, force: true, stayDays: 3 });
assert(returned, 'valid trader should be returnable');
assert.strictEqual(returned.kind, 'trader');
assert.strictEqual(returned.role, 'merchant');
assert(Number.isFinite(returned.stones) && returned.stones >= 0, 'returned trader wallet must be valid');
assert(returned.stock && returned.wants, 'returned trader must retain both inventory ledgers');
assert.strictEqual(returned.stones, 517);
assert.strictEqual(returned.stock.grain, 3);
assert.strictEqual(returned.wants.meal, 2);
assert.strictEqual(returned.visitCount, 2, 'market trader visit count must advance');
assert.strictEqual(W.world.marketStats.visits, visitsBeforeReturn + 1, 'market visit counter must include returning traders');
assert(EXT.activeVisitors(W).some(v => v.id === returned.id), 'returned trader must be recognized by the market system');

// A malformed historical merchant record must be repaired by the market authority,
// never restored as a trader-shaped guest without a wallet or ledgers.
VC.departVisitor(W, returned, 'second fixture departure');
W.world.guestRegistry[returned.id] = {
  id: returned.id, kind: 'trader', role: 'merchant', nameTh: 'พ่อค้าข้อมูลเก่า',
  lastDepartDay: W.day - 10, state: 'offsite'
};
const repaired = VC.spawnGuest(W, { returningId: returned.id, force: true });
assert(repaired && repaired.kind === 'trader');
assert(Number.isFinite(repaired.stones) && repaired.stones >= 0, 'recreated merchant wallet must be valid');
assert(repaired.stock && repaired.wants, 'recreated merchant must have valid stock and wants');

// Explicit merchant creation must route through EXT.openVisit.
const explicit = VC.spawnGuest(W, {
  role: 'merchant', id: 'trader_explicit_fixture', subtype: 'caravan', stones: 700,
  stock: { grain: 4 }, wants: { meal: 1 }, force: true
});
assert(explicit && explicit.kind === 'trader');
assert(Number.isFinite(explicit.stones) && explicit.stones === 700);
assert(explicit.stock && explicit.wants);

console.log('PASS merchant guest lifecycle: wallet/stock/wants survive return; malformed trader records are rebuilt by EXT; explicit merchants use market initialization');
