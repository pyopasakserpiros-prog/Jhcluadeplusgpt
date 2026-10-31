'use strict';
const assert = require('assert');
const { SIM, ECO, AI, CPE } = require('./load.js');
const tests = [];
const test = (name, run) => tests.push({ name, run });

function fixture(seed) {
  const W = SIM.create(seed, { masterIdx: 0 }), n = W.npcs[1], r = ECO.recipeById.BASIC_HP;
  n.h.skills.ALCHEMY = 100;
  W.sect.stock = { MAT_HERB_DEW_GRASS_1: 10, MAT_HERB_CINDER_LEAF_1: 10 };
  successful(W);
  return { W, n, r, ctx: { rid: r.id } };
}
function successful(W) { W.rng.next = () => 0; W.rng.gauss = () => 0; W.rng.chance = () => false; }
function rewards(W, n) {
  return { stock: { ...W.sect.stock }, crafted: n.stats.crafted || 0, cp: n.cp, merit: n.merit, produced: W.sect.produced || 0, minted: CPE.S(W).minted, donated: CPE.S(W).donated };
}

// A negative withdrawal used to create stock; non-numbers used to poison it.
test('inventory rejects negative and non-finite quantities', () => {
  const { W } = fixture('craft-invalid-quantity');
  for (const amount of [-2, NaN, Infinity, -Infinity, '2', undefined]) {
    assert.strictEqual(ECO.take(W, 'MAT_HERB_DEW_GRASS_1', amount), false);
    ECO.add(W, 'MAT_HERB_CINDER_LEAF_1', amount);
    assert.strictEqual(ECO.count(W, 'MAT_HERB_DEW_GRASS_1'), 10);
    assert.strictEqual(ECO.count(W, 'MAT_HERB_CINDER_LEAF_1'), 10);
  }
  W.sect.stock.overflow = Number.MAX_VALUE;
  ECO.add(W, 'overflow', Number.MAX_VALUE);
  assert.strictEqual(ECO.count(W, 'overflow'), Number.MAX_VALUE);
  W.sect.stock.corrupt = NaN;
  assert.strictEqual(ECO.count(W, 'corrupt'), 0);
  assert.strictEqual(ECO.take(W, 'corrupt', 1), false);
  ECO.add(W, 'corrupt', 2);
  assert.strictEqual(W.sect.stock.corrupt, 2);
});

test('craft completion without paid inputs produces nothing', () => {
  const { W, n, r, ctx } = fixture('craft-unpaid');
  const before = rewards(W, n);
  assert.strictEqual(ECO.finishCraft(W, n, r, ctx).ok, false);
  assert.deepStrictEqual(rewards(W, n), before);
  assert.strictEqual(ECO.finishCraft(W, n, r).ok, false);
  assert.deepStrictEqual(rewards(W, n), before);
});

test('starting one action twice spends its ingredients once', () => {
  const { W, n, r, ctx } = fixture('craft-repeat-start');
  assert(ECO.reserveInputs(W, r, ctx, n));
  assert(ECO.reserveInputs(W, r, ctx, n));
  assert.strictEqual(ECO.count(W, r.inputs[0].matId), 8);
  assert.strictEqual(ECO.count(W, r.inputs[1].matId), 9);
  assert(ECO.finishCraft(W, n, r, ctx).ok);
  assert.strictEqual(ECO.reserveInputs(W, r, ctx, n), false);
});

test('basic crafting grants output and contribution rewards once', () => {
  const { W, n, r, ctx } = fixture('craft-basic-once');
  assert(AI.ACTS.brewBasic.start(n, W, ctx));
  const replay = JSON.parse(JSON.stringify(ctx));
  AI.ACTS.brewBasic.done(n, W, ctx);
  assert.strictEqual(ECO.count(W, 'P:' + r.id), 2);
  const after = rewards(W, n), mood = n.h.state.mood;
  AI.ACTS.brewBasic.done(n, W, ctx);
  AI.ACTS.brewBasic.done(n, W, replay);
  assert.deepStrictEqual(rewards(W, n), after);
  assert.strictEqual(n.h.state.mood, mood, 'rejected replay is not a new failed craft');
});

for (const [action, hall, craft, outType] of [['brew', 'alchemy', 'ALCHEMY', 'PILL'], ['forge', 'forge', 'FORGING', 'EQUIPMENT']]) {
  test(action + ' completes its paid recipe and grants native rewards once', () => {
    const { W, n } = fixture('craft-native-' + action);
    const r = Object.values(ECO.recipeById).find(x => x.craft === craft && !x.basic && x.tier === 1 && x.outType === outType);
    assert(r); n.h.skills[craft] = 100; W.sect.recipeTier = 1; W.sect.orders = { [hall]: { rid: r.id } };
    for (const input of r.inputs) ECO.add(W, input.matId, 10);
    const ctx = { rid: r.id }, gearBefore = W.sect.gear.length;
    assert(AI.ACTS[action].start(n, W, ctx));
    AI.ACTS[action].done(n, W, ctx);
    assert.strictEqual(n.stats.crafted, 1);
    if (outType === 'EQUIPMENT') assert.strictEqual(W.sect.gear.length, gearBefore + 1);
    else assert(ECO.count(W, r.outItemId || 'P:' + r.id) > 0);
    const after = rewards(W, n), gearAfter = W.sect.gear.length;
    AI.ACTS[action].done(n, W, ctx);
    assert.deepStrictEqual(rewards(W, n), after);
    assert.strictEqual(W.sect.gear.length, gearAfter);
  });
}

test('paid craft survives save/load and rejects replay after another reload', () => {
  const { W, n, r, ctx } = fixture('craft-reload');
  assert(AI.ACTS.brewBasic.start(n, W, ctx));
  n.act = { id: 'brewBasic', stage: 'do', started2: true, ctx, left: 5, total: 65 };
  const R = SIM.deserialize(SIM.serialize(W)), rn = R.byId[n.id];
  successful(R);
  const replay = JSON.parse(JSON.stringify(rn.act.ctx));
  AI.ACTS.brewBasic.done(rn, R, rn.act.ctx);
  assert.strictEqual(ECO.count(R, 'P:' + r.id), 2);
  const S = SIM.deserialize(SIM.serialize(R)), sn = S.byId[n.id];
  successful(S);
  const after = rewards(S, sn);
  AI.ACTS.brewBasic.done(sn, S, sn.act.ctx);
  AI.ACTS.brewBasic.done(sn, S, replay);
  assert.deepStrictEqual(rewards(S, sn), after);
});

test('a receipt cannot pay for another actor or recipe', () => {
  const { W, n, r, ctx } = fixture('craft-bound-receipt');
  assert(ECO.reserveInputs(W, r, ctx, n));
  assert.strictEqual(ECO.finishCraft(W, W.npcs[2], r, ctx).ok, false);
  assert.strictEqual(ECO.finishCraft(W, n, ECO.recipeById.BASIC_QI, ctx).ok, false);
  assert.strictEqual(ECO.count(W, 'P:BASIC_HP'), 0);
  assert(ECO.finishCraft(W, n, r, ctx).ok, 'rejected mismatches must not consume the real receipt');
});

test('failed crafting can return paid materials only once', () => {
  const { W, n, r, ctx } = fixture('craft-failed-once');
  assert(ECO.reserveInputs(W, r, ctx, n));
  W.rng.next = () => 1; W.rng.chance = () => true;
  assert.strictEqual(ECO.finishCraft(W, n, r, ctx).ok, false);
  assert.strictEqual(ECO.count(W, r.inputs[0].matId), 9);
  assert.strictEqual(ECO.count(W, r.inputs[1].matId), 10);
  const after = { ...W.sect.stock };
  assert.strictEqual(ECO.finishCraft(W, n, r, ctx).ok, false);
  assert.deepStrictEqual(W.sect.stock, after);
});

test('duplicate recipe inputs are reserved atomically', () => {
  const { W, n, r, ctx } = fixture('craft-atomic');
  W.sect.stock = { MAT_HERB_DEW_GRASS_1: 3 };
  const duplicate = { ...r, inputs: [{ matId: 'MAT_HERB_DEW_GRASS_1', count: 2 }, { matId: 'MAT_HERB_DEW_GRASS_1', count: 2 }] };
  assert.strictEqual(ECO.reserveInputs(W, duplicate, ctx, n), false);
  assert.deepStrictEqual(W.sect.stock, { MAT_HERB_DEW_GRASS_1: 3 });
  for (const count of [-1, NaN, Infinity, '1', 0]) {
    assert.strictEqual(ECO.reserveInputs(W, { ...r, inputs: [{ matId: 'MAT_HERB_DEW_GRASS_1', count }] }, ctx, n), false);
    assert.deepStrictEqual(W.sect.stock, { MAT_HERB_DEW_GRASS_1: 3 });
  }
});

test('legacy direct API still requires a consumable reservation', () => {
  const { W, n, r } = fixture('craft-direct-api');
  assert(ECO.reserveInputs(W, r));
  assert(ECO.finishCraft(W, n, r).ok);
  const after = rewards(W, n);
  assert.strictEqual(ECO.finishCraft(W, n, r).ok, false);
  assert.deepStrictEqual(rewards(W, n), after);
});

test('legacy paid action adoption does not charge its inputs again', () => {
  const { W, n, r, ctx } = fixture('craft-legacy-adoption');
  W.sect.stock = {};
  assert.strictEqual(typeof ECO.adoptLegacyCraft, 'function');
  assert(ECO.adoptLegacyCraft(W, n, r, ctx));
  assert(ECO.adoptLegacyCraft(W, n, r, ctx));
  assert.deepStrictEqual(W.sect.stock, {});
  assert(ECO.finishCraft(W, n, r, ctx).ok);
  assert.strictEqual(ECO.adoptLegacyCraft(W, n, r, ctx), false);
  const after = rewards(W, n);
  assert.strictEqual(ECO.finishCraft(W, n, r, ctx).ok, false);
  assert.deepStrictEqual(rewards(W, n), after);
});

test('a replacement craft invalidates an interrupted receipt without refunds', () => {
  const { W, n, r, ctx } = fixture('craft-replacement');
  assert(ECO.reserveInputs(W, r, ctx, n));
  const next = { rid: r.id };
  assert(ECO.reserveInputs(W, r, next, n));
  assert.strictEqual(ECO.finishCraft(W, n, r, ctx).ok, false);
  assert(ECO.finishCraft(W, n, r, next).ok);
  assert.strictEqual(ECO.count(W, r.inputs[0].matId), 6);
  assert.strictEqual(ECO.count(W, r.inputs[1].matId), 8);
});

test('stale actor receipts can be pruned without returning consumed materials', () => {
  const { W, n, r, ctx } = fixture('craft-prune');
  assert(ECO.reserveInputs(W, r, ctx, n));
  n.act = { id: 'idle', stage: 'do', ctx: {} };
  assert.strictEqual(typeof ECO.pruneCraftTransactions, 'function');
  ECO.pruneCraftTransactions(W);
  assert.strictEqual(ECO.finishCraft(W, n, r, ctx).ok, false);
  assert.strictEqual(ECO.count(W, r.inputs[0].matId), 8);
});

test('discoverable recipes require knowledge as well as the normal tier gate', () => {
  const { W, r } = fixture('craft-knowledge');
  const discovered = { ...r, id: 'DISCOVERABLE_TEST', discoverable: true };
  W.sect.recipeTier = 1; W.sect.knownRecipes = [];
  assert.strictEqual(ECO.recipeKnown(W, discovered), false);
  W.sect.knownRecipes.push(discovered.id);
  assert.strictEqual(ECO.recipeKnown(W, discovered), true);
  assert.strictEqual(ECO.recipeKnown(W, { ...discovered, tier: 2 }), false);
});

test('native crafting revalidates discovered recipe requirements at start', () => {
  const { W, n, r } = fixture('craft-eligibility');
  const id = 'CRAFT_ELIGIBILITY_TEST', recipe = { ...r, id, basic: false, discoverable: true, compatiblePath: 'XIAN', minStage: 2, facilityLevel: 2 };
  ECO.recipeById[id] = recipe;
  try {
    W.sect.orders = { alchemy: { rid: id } }; W.sect.recipeTier = 1; W.sect.knownRecipes = [];
    W.map.byId.alchemy.level = 2; n.cult = { ...n.cult, path: 'XIAN', stage: 2 };
    assert.strictEqual(AI.ACTS.brew.can(n, W), false);
    assert.strictEqual(AI.ACTS.brew.start(n, W, { rid: id }), false);
    W.sect.knownRecipes.push(id);
    assert.strictEqual(AI.ACTS.brew.can(n, W), true);
    for (const field of ['path', 'stage', 'facility']) {
      n.cult.path = field === 'path' ? 'BODY' : 'XIAN'; n.cult.stage = field === 'stage' ? 1 : 2; W.map.byId.alchemy.level = field === 'facility' ? 1 : 2;
      assert.strictEqual(AI.ACTS.brew.can(n, W), false, field);
      assert.strictEqual(AI.ACTS.brew.start(n, W, { rid: id }), false, field);
    }
    n.cult.path = 'XIAN'; n.cult.stage = 2; W.map.byId.alchemy.level = 2;
    assert(AI.ACTS.brew.start(n, W, { rid: id }));
  } finally { delete ECO.recipeById[id]; }
});

test('craft duration uses its captured recipe when the hall order changes', () => {
  const { W, n } = fixture('craft-order-change');
  const r = Object.values(ECO.recipeById).find(x => x.craft === 'ALCHEMY' && !x.basic && x.tier === 1);
  assert(r); W.sect.orders = { alchemy: { rid: r.id } }; W.sect.recipeTier = 1;
  for (const input of r.inputs) ECO.add(W, input.matId, 10);
  const ctx = AI.ACTS.brew.where(W, n);
  assert(ctx && ctx.rid === r.id);
  W.sect.orders.alchemy = null;
  assert(AI.ACTS.brew.start(n, W, ctx));
  let duration;
  assert.doesNotThrow(() => { duration = AI.ACTS.brew.dur(n, W, ctx); });
  assert(Number.isFinite(duration) && duration > 0);
});

let failures = 0;
for (const { name, run } of tests) {
  try { run(); console.log('PASS ' + name); }
  catch (error) { failures++; console.error('FAIL ' + name + '\n' + error.stack); }
}
if (failures) process.exitCode = 1;
