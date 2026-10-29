'use strict';
const assert = require('assert');
const { SIM, AI, WILD_RES: R, WILD, EXPED: X, ECO, HC, MAP, SECT } = require('./load');
let failures = 0;
function test(name, fn) { try { fn(); console.log('PASS ' + name); } catch (e) { failures++; console.error('FAIL ' + name + ': ' + e.message); } }
function setup(seed) { const W = SIM.create(seed), n = W.npcs[0]; return { W, n }; }
const herb = 'MAT_HERB_DEW_GRASS_1';

test('safe gathering remains reachable through the two tiles just outside the gate', () => {
  const { W, n } = setup('audit-gate-corridor');
  const node = R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt', remaining: 1 });
  const dest = AI.ACTS.gatherWildResource.where(W, n);
  assert(dest && dest.nodeId === node.id, 'safe herb must be selectable from inside the sect');
  assert(AI.begin(W, n, 'gatherWildResource', dest));
  assert(n.path.every(([x, y]) => !MAP.isOutsideWall(W.map, x + .5, y + .5) || MAP.isInSafeBelt(x + .5, y + .5)));
});

test('basic herb job refuses an unsafe destination even when it is the only node', () => {
  const { W, n } = setup('audit-safe-job');
  R.spawnNode(W, { materialId: herb, zoneId: 'exterior_west', remaining: 1 });
  assert.strictEqual(AI.ACTS.gatherWildResource.where(W, n), null);
});
test('legendary spawn cannot bypass safe-belt exclusion', () => {
  const { W } = setup('audit-legend-safe');
  W.rng.int = (lo, hi) => lo <= 145 && hi >= 145 ? 145 : lo;
  const b = WILD.spawn(W, 'legend', null, { legendary: true });
  assert(b, 'valid legend must still spawn in its habitat');
  assert(!MAP.isInSafeBelt(b.x, b.y), 'legend spawned in safe collection belt');
  assert(!MAP.blocked(W.map, b.x, b.y), 'relocated beast must remain on passable land');
});
test('resource placement rejects isolated passable islands', () => {
  const { W } = setup('audit-reachability');
  for (let y = 139; y <= 141; y++) for (let x = 99; x <= 101; x++) {
    const k = y * MAP.W + x; W.map.block[k] = x === 100 && y === 140 ? 0 : 1;
    W.map.cost[k] = x === 100 && y === 140 ? 1 : 0; W.map.terrain[k] = MAP.T.GRASS;
  }
  W.rng.int = (lo, hi) => lo === 80 ? 100 : lo === 135 ? 140 : lo;
  assert.strictEqual(R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt' }), null);
});
test('learned recipes outside the scroll bag can motivate retaining gathered herbs', () => {
  const { W, n } = setup('audit-learned-recipe');
  const r = Object.values(ECO.recipeById).find(r => r.craft === 'ALCHEMY' && r.inputs.some(i => i.matId === herb));
  n.recipes = [r.id]; n.inv.recipes = []; n.h.skills.ALCHEMY = 80;
  n.h.values.wealthResource = 100; n.h.personality.loyalty = 0; HC.touch(n);
  W.rng.chance = () => true;
  const node = R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt', remaining: 1 });
  n.x = node.x + .5; n.y = node.y + .5;
  const cp = n.cp, stock = ECO.count(W, herb);
  AI.ACTS.gatherWildResource.done(n, W, { nodeId: node.id });
  assert.strictEqual(n.inv.mats[herb], 1);
  assert.strictEqual(n.cp, cp); assert.strictEqual(ECO.count(W, herb), stock);
});
test('alchemy fortune trial uses learned ALCHEMY proficiency', () => {
  const { W, n } = setup('audit-alchemy-trial');
  n.h.skills.ALCHEMY = 100; n.h.interests.alchemy = 0; HC.touch(n);
  W.rng.gauss = () => 0;
  const out = { mats: {}, pills: {}, gear: [], techs: [], notes: [], stones: 0, rep: 0 };
  const ex = { partyRank: 4, siteId: 'f4_primordial_fountain', poolId: 'f4_fountain_cleansing', journal: [] };
  X.fortuneEvent(W, ex, [n], out, X.REGIONS.find(r => r.id === 'water'));
  assert(out.stones > 0, 'master alchemist should pass, regardless of low hobby interest');
});
test('invalid donation quantities cannot consume stock or mint contribution points', () => {
  const { W, n } = setup('audit-donation-validation'); n.inv.mats = { [herb]: 4 };
  for (const qty of [NaN, Infinity, -1, 0, 1.5, '2']) {
    const before = JSON.stringify({ inv: n.inv, cp: n.cp, stock: W.sect.stock });
    assert.strictEqual(SECT.donateMat(W, n, herb, qty).ok, false, 'invalid qty: ' + qty);
    assert.strictEqual(JSON.stringify({ inv: n.inv, cp: n.cp, stock: W.sect.stock }), before);
  }
});
test('failed movement releases the resource lease immediately', () => {
  const { W, n } = setup('audit-lease-failure');
  const node = R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt' });
  R.claimNode(W, n, node);
  const old = AI.goTo; AI.goTo = () => false;
  try { assert.strictEqual(AI.begin(W, n, 'gatherWildResource', { nodeId: node.id, pos: { x: node.x, y: node.y } }), false); }
  finally { AI.goTo = old; }
  assert.strictEqual(node.claimedBy, null);
});
test('beginner gathering preference uses cultivation rank rather than sect office rank', () => {
  const { W, n } = setup('audit-rank-preference'); n.rank = 1; n.cult.path = 'XIAN'; n.cult.stage = 9;
  const reasons = []; AI.ACTS.gatherWildResource.score(n, W, { add: (why, score) => reasons.push([why, score]) });
  assert(!reasons.some(([why]) => why.includes('ศิษย์ใหม่')), 'a late-stage cultivator is not a cultivation beginner');
});
test('uncollected dangerous nodes cannot fill the slots needed for safe basic herb supply', () => {
  const { W } = setup('audit-safe-reserve');
  for (let i = 0; i < 40; i++) {
    assert(R.spawnNode(W, { materialId: herb, zoneId: 'exterior_west' }));
  }
  assert.strictEqual(R.spawnNode(W, { materialId: herb, zoneId: 'exterior_west' }), null);
  assert(R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt' }), 'reserved capacity must accept safe herbs');
  assert(W.wildResources.nodes.length <= 48);
});
test('a real gathering action settles exactly once across a mid-action save/load', () => {
  const { W, n } = setup('audit-harvest-replay');
  const node = R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt', remaining: 1 });
  n.x = node.x + .5; n.y = node.y + .5; n.inj = [];
  Object.assign(n.h.state, { energy: 100, satiety: 100, rest: 100 });
  const owned = (n.inv.mats?.[herb] || 0) + ECO.count(W, herb);
  assert(AI.begin(W, n, 'gatherWildResource', { nodeId: node.id, pos: { x: node.x, y: node.y } }));
  for (let i = 0; i < 30; i++) { W.t++; AI.step(W, n); }
  const L = SIM.deserialize(SIM.serialize(W)), m = L.byId[n.id];
  for (let i = 0; i < 30; i++) { W.t++; L.t++; AI.step(W, n); AI.step(L, m); }
  assert.strictEqual((n.inv.mats?.[herb] || 0) + ECO.count(W, herb), owned + 1);
  assert.deepStrictEqual(n.inv.mats, m.inv.mats); assert.strictEqual(n.cp, m.cp);
  assert.deepStrictEqual(W.wildResources, L.wildResources);
  assert.deepStrictEqual(W.rng.getState(), L.rng.getState());
  const before = JSON.stringify({ inv: m.inv, cp: m.cp, stock: L.sect.stock, rng: L.rng.getState() });
  AI.ACTS.gatherWildResource.done(m, L, { nodeId: node.id });
  assert.strictEqual(JSON.stringify({ inv: m.inv, cp: m.cp, stock: L.sect.stock, rng: L.rng.getState() }), before);
});
if (failures) process.exitCode = 1;
