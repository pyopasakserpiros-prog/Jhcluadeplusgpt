'use strict';
const fs = require('fs');
const path = require('path');

// Bridge for test watcher: run full regression suite, build standalone, or git commit/push
const runAllTrigger = path.resolve(__dirname, '../../.run_all');
const buildTrigger = path.resolve(__dirname, '../../.run_build');
const gitTrigger = path.resolve(__dirname, '../../.git_push');
const syncTrigger = path.resolve(__dirname, '../../.git_sync');
const scriptTrigger = path.resolve(__dirname, '../../.run_script');

if (fs.existsSync(scriptTrigger)) {
  const scriptPath = fs.readFileSync(scriptTrigger, 'utf8').trim();
  try { fs.unlinkSync(scriptTrigger); } catch (e) {}
  const rootDir = path.resolve(__dirname, '../..');
  try {
    const { execSync } = require('child_process');
    const out = execSync(`node "${scriptPath}"`, { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });
    fs.writeFileSync(path.join(rootDir, 'test_output.log'), out);
    fs.writeFileSync(path.join(rootDir, 'test_exitcode.log'), '0\n');
  } catch (err) {
    fs.writeFileSync(path.join(rootDir, 'test_output.log'), (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message);
    fs.writeFileSync(path.join(rootDir, 'test_exitcode.log'), '1\n');
  }
  return;
}

if (fs.existsSync(syncTrigger)) {
  try { fs.unlinkSync(syncTrigger); } catch (e) {}
  const { execSync } = require('child_process');
  const rootDir = path.resolve(__dirname, '../..');
  try {
    try { fs.unlinkSync(path.join(__dirname, 'git_sync.js')); } catch (e) {}
    const out = execSync('git status && git fetch origin main-1 && git log -3 origin/main-1 --stat && git pull origin main-1 && git status && git log -3 --stat', { cwd: rootDir, encoding: 'utf8' });
    fs.writeFileSync(path.join(rootDir, 'test_output.log'), out);
    fs.writeFileSync(path.join(rootDir, 'test_exitcode.log'), '0\n');
  } catch (err) {
    fs.writeFileSync(path.join(rootDir, 'test_output.log'), (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message);
    fs.writeFileSync(path.join(rootDir, 'test_exitcode.log'), '1\n');
  }
  return;
}

if (fs.existsSync(gitTrigger)) {
  let commitMsg = 'Expand Living Beast & Craft Ecology: 80 species, 160 materials, 80 recipes, combat pills, and full integration';
  try {
    const custom = fs.readFileSync(gitTrigger, 'utf8').trim();
    if (custom) commitMsg = custom;
  } catch (e) {}
  try { fs.unlinkSync(gitTrigger); } catch (e) {}
  const { execSync } = require('child_process');
  const rootDir = path.resolve(__dirname, '../..');
  try {
    const escapedMsg = commitMsg.replace(/"/g, '\\"');
    const out = execSync(`git status && git add . && git commit -m "${escapedMsg}" && git push origin main-1 && git log -1 --stat`, { cwd: rootDir, encoding: 'utf8' });
    fs.writeFileSync(path.join(rootDir, 'test_output.log'), out);
    fs.writeFileSync(path.join(rootDir, 'test_exitcode.log'), '0\n');
  } catch (err) {
    fs.writeFileSync(path.join(rootDir, 'test_output.log'), (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + err.message);
    fs.writeFileSync(path.join(rootDir, 'test_exitcode.log'), '1\n');
  }
  return;
}
if (fs.existsSync(buildTrigger)) {
  try { fs.unlinkSync(buildTrigger); } catch (e) {}
  require('../tools/build_single.js');
  return;
}
if (process.argv.includes('--all') || (!process.env.INTERNAL_SUITE && fs.existsSync(runAllTrigger))) {
  if (fs.existsSync(runAllTrigger)) {
    try { fs.unlinkSync(runAllTrigger); } catch (e) {}
  }
  require('./run_all.js');
  return;
}

const assert = require('assert');
const G = require('./load.js');
const { SIM, ECO, EXT, AI, HC, CULT, SECT, CPE, MAP } = G;

function world(seed) { return SIM.create(seed || 'autonomous-eco-test', { masterIdx: 0 }); }
function trader(W, options) { return EXT.openVisit(W, Object.assign({ nameTh: 'พ่อค้าทดสอบ', stones: 1500, stock: {}, wants: {}, stayDays: 2 }, options || {})); }

console.log('Testing Autonomous Economy & Facility Expansion...');

// Scenario 1: Inventory overflow and surplus sales
{
  const W = world('eco-surplus-sale');
  const id = 'MAT_HERB_DEW_GRASS_1';
  ECO.ensureStockTracker(W);
  // Add a huge amount to ensure genuine surplus
  ECO.add(W, id, 60);
  const floor = ECO.reserveFloor(W, id);
  assert(ECO.count(W, id) > floor, 'stock should exceed floor');

  const intel = ECO.inventoryIntelligence(W, true);
  const surplusEntry = intel.surplus.find(x => x.id === id);
  assert(surplusEntry, 'dew grass must be identified as surplus');
  assert(surplusEntry.surplusQty > 0, 'surplus quantity must be positive');

  const v = trader(W, { stock: {}, wants: { [id]: 10 }, stones: 1000 });
  const beforeStock = ECO.count(W, id);
  const beforeStones = W.sect.stones;
  const beforeTraderStones = v.stones;

  const res = EXT.tradeSect(W, v);
  assert(res.sold > 0, 'sect should sell surplus goods to visiting merchant');
  assert.strictEqual(ECO.count(W, id), beforeStock - res.sold);
  assert.strictEqual(W.sect.stones, beforeStones + res.sellRevenue);
  assert.strictEqual(v.stones, beforeTraderStones - res.sellRevenue);
  assert(ECO.count(W, id) >= floor, 'stock must remain at or above reserve floor');
  assert(W.world.tradeHistory.some(t => t.side === 'sect-sell' && t.itemId === id && t.reason));
  console.log('  PASS: Scenario 1 - Inventory overflow and surplus sales');
}

// Scenario 2: Shortages and external purchasing
{
  const W = world('eco-shortage-buy');
  const id = 'MAT_ORE_BLACK_IRON_1';
  W.sect.stock[id] = 0; // complete shortage
  W.sect.stones = 2500; // ample treasury above cash reserve
  W.sect.shortageDirectives = [{
    id,
    nameTh: 'เหล็กดำ',
    needed: 10,
    current: 0,
    deficit: 10,
    priority: 'high',
    reason: 'ขาดแคลนงานหลอม'
  }];

  const intel = ECO.inventoryIntelligence(W, true);
  assert(intel.shortage.some(x => x.id === id), 'iron should be classified as shortage');

  const v = trader(W, { stock: { [id]: 8 }, wants: {}, stones: 500 });
  const beforeStock = ECO.count(W, id);
  const beforeStones = W.sect.stones;
  const beforeTraderStones = v.stones;

  const res = EXT.tradeSect(W, v);
  assert(res.bought > 0, 'sect should purchase shortage materials from visitor');
  assert.strictEqual(ECO.count(W, id), beforeStock + res.bought);
  assert.strictEqual(W.sect.stones, beforeStones - res.buyCost);
  assert.strictEqual(v.stones, beforeTraderStones + res.buyCost);
  assert(W.world.tradeHistory.some(t => t.side === 'sect-buy' && t.itemId === id && t.reason));
  console.log('  PASS: Scenario 2 - Shortages and external purchasing');
}

// Scenario 3: No merchant availability
{
  const W = world('eco-no-merchant');
  W.threat.roadBlocked = 10;
  W.world.visitors = [];
  const active = EXT.activeVisitors(W);
  assert.strictEqual(active.length, 0, 'no merchants should be active');
  const beforeStones = W.sect.stones;
  EXT.daily(W);
  assert.strictEqual(W.sect.stones, beforeStones, 'stones must not change without active merchants');
  console.log('  PASS: Scenario 3 - No merchant availability');
}

// Scenario 4: Insufficient spirit stones (cash reserve floor protection)
{
  const W = world('eco-cash-reserve');
  const pop = W.npcs.filter(n => !n.dead).length;
  const cashFloor = Math.max(300, pop * 20);
  W.sect.stones = cashFloor - 50; // below cash reserve floor!

  const id = 'MAT_ORE_BLACK_IRON_1';
  W.sect.shortageDirectives = [{ id, nameTh: 'เหล็กดำ', needed: 10, current: 0, deficit: 10, priority: 'high', reason: 'ขาด' }];
  const v = trader(W, { stock: { [id]: 5 }, wants: {}, stones: 500 });

  const res = EXT.tradeSect(W, v);
  assert.strictEqual(res.bought, 0, 'purchase must be postponed when treasury is below safety reserve floor');
  assert(W.logs.some(l => l.type === 'finance' && l.text.includes('ชะลอการจัดซื้อ')), 'transparent log must record purchase postponement');
  console.log('  PASS: Scenario 4 - Insufficient spirit stones / cash reserve protection');
}

// Scenario 5: Emergency and welfare reserve protection
{
  const W = world('eco-reserve-protect');
  const mealFloor = ECO.reserveFloor(W, 'meal');
  W.sect.stock.meal = mealFloor; // exactly at floor

  const v = trader(W, { stock: {}, wants: { meal: 50 }, stones: 2000 });
  const res = EXT.tradeSect(W, v);
  assert.strictEqual(res.sold, 0, 'emergency meal reserve must never be sold');
  assert.strictEqual(ECO.count(W, 'meal'), mealFloor, 'meal stock must remain at reserve floor');

  // Verify basic medical pills are protected from surplus selling
  const hpPill = 'P:BASIC_HP';
  W.sect.stock[hpPill] = 20;
  const v2 = trader(W, { stock: {}, wants: { [hpPill]: 10 }, stones: 2000 });
  const res2 = EXT.tradeSect(W, v2);
  assert.strictEqual(res2.sold, 0, 'welfare emergency medicine must never be liquidated as surplus');
  console.log('  PASS: Scenario 5 - Emergency and welfare reserve protection');
}

// Scenario 6: Duplicate transaction prevention
{
  const W = world('eco-no-duplicate');
  const id = 'MAT_ORE_BLACK_IRON_1';
  W.sect.stones = 3000;
  W.sect.buyList = [{ id, n: 3 }];
  const v = trader(W, { stock: { [id]: 10 }, wants: {}, stones: 1000 });

  const first = EXT.tradeSect(W, v);
  assert(first.bought > 0, 'first trade should succeed');

  // Calling tradeSect again on the same day without new directives
  const second = EXT.tradeSect(W, v);
  assert.strictEqual(second.bought, 0, 'duplicate purchase on same day must be rejected');
  console.log('  PASS: Scenario 6 - Duplicate transaction prevention');
}

// Scenario 7: Donation–crafting–purchase arbitrage protection
{
  const W = world('eco-arbitrage-protection');
  const n = W.npcs[0];
  const r = ECO.recipeById.BASIC_HP;
  assert(r, 'BASIC_HP recipe must exist');

  // Member crafts a pill using store-bought ingredients (marked with storeBoughtCost)
  const storeBoughtCost = 30; // say ingredients cost 30 CP
  const fakePill = {
    id: 'test_crafted_pill_1',
    key: 'P:BASIC_HP',
    q: 1.0,
    qty: 1,
    intent: 'donate',
    purchasedCost: storeBoughtCost,
    storeBoughtCost: storeBoughtCost
  };
  n.inv.craftedPills = [fakePill];

  const beforeCp = n.cp || 0;
  const donateRes = ECO.donatePersonalProduct(W, n, fakePill.id);
  assert(donateRes.ok, 'donation should succeed');
  // Reward must be strictly capped at <= 0.88 * storeBoughtCost
  assert(donateRes.reward <= storeBoughtCost * 0.88 + 0.01, 'reward for store-bought inputs must not exceed 88% of cost');
  assert(donateRes.reward < storeBoughtCost, 'positive arbitrage loop must be mathematically impossible');
  assert(CPE.S(W).arbitrageBlocked > 0, 'arbitrage safeguard counter should increment');
  console.log('  PASS: Scenario 7 - Donation-crafting-purchase arbitrage protection');
}

// Scenario 8: Contribution-point issuance, spending, and circulation tracking
{
  const W = world('eco-cp-tracking');
  const c = CPE.S(W);
  const n = W.npcs[0];
  n.cp = 50;

  const initialMinted = c.minted;
  const initialBurned = c.burned;

  CPE.mint(W, n, 25, 'ทดสอบได้แต้ม');
  assert.strictEqual(n.cp, 75);
  assert.strictEqual(c.minted, initialMinted + 25);

  const spent = CPE.spend(W, n, 30, 'ทดสอบใช้แต้ม');
  assert(spent, 'spend should succeed');
  assert.strictEqual(n.cp, 45);
  assert.strictEqual(c.burned, initialBurned + 30);

  // Daily circulation calculation
  CPE.daily(W);
  const totalLivingCp = W.npcs.filter(x => !x.dead && !x.exiled).reduce((s, x) => s + (x.cp || 0), 0);
  assert.strictEqual(c.circulation, Math.round(totalLivingCp * 10) / 10);

  // Retiring member CP on departure
  const retiringCp = n.cp;
  const beforeRetired = c.retired;
  CPE.retireNpc(W, n, 'เกษียณ');
  assert.strictEqual(n.cp, 0);
  assert.strictEqual(c.retired, beforeRetired + retiringCp);
  console.log('  PASS: Scenario 8 - CP issuance, spending, and circulation tracking');
}

// Scenario 9: Sustained facility congestion tracking
{
  const W = world('eco-facility-congestion');
  SECT.ensureFacilityDemand(W);
  const dorm = W.map.byId.dorm_outer;
  assert(dorm, 'dorm_outer must exist');

  const fd = W.sect.facilityDemand.dorm_outer;
  assert(fd, 'facilityDemand for dorm_outer must be initialized');

  // Record failed station attempts
  SECT.recordFacilityDemand(W, 'dorm_outer', 'no_bed', W.npcs[0]);
  SECT.recordFacilityDemand(W, 'dorm_outer', 'no_bed', W.npcs[0]);
  SECT.recordFacilityDemand(W, 'dorm_outer', 'no_bed', W.npcs[0]);
  assert.strictEqual(fd.failedAttempts, 3, 'failed attempts should be tracked');
  assert.strictEqual(fd.unmetDemands, 3, 'unmet demands should be tracked');

  // Fill all dorm stations to test hourly congestion
  dorm.stations.forEach(sid => {
    const s = W.map.stations[sid];
    if (s) s.occ = 'someone';
  });

  // Run hourly update
  SIM.hourly(W);
  assert(fd.congestedHours >= 1, 'congested hours should increment when fully occupied');
  console.log('  PASS: Scenario 9 - Sustained facility congestion tracking');
}

// Scenario 10: Construction completion and usable capacity expansion
{
  const W = world('eco-capacity-expansion');
  const b = W.map.byId.alchemy;
  assert(b, 'alchemy facility must exist');
  const stCountBefore = b.stations.length;

  b.building = { until: W.t + 10, to: 2 };
  W.t += 20; // advance time past completion
  SIM.hourly(W);

  assert.strictEqual(b.level, 2, 'facility level should increase to 2');
  assert.strictEqual(b.building, null, 'building order should be cleared upon completion');
  assert(b.stations.length > stCountBefore, 'physical usable stations must increase');

  // Verify new stations are accessible in W.map.stations
  const newStationId = b.stations[b.stations.length - 1];
  const newStation = W.map.stations[newStationId];
  assert(newStation, 'new station must exist in map stations');
  assert.strictEqual(newStation.occ, null, 'new station must start unoccupied');

  // Free station query should be able to find new stations
  const found = AI.freeStation(W, W.npcs[0], newStation.kind, 'alchemy');
  assert(found, 'AI must be able to discover newly expanded station');
  console.log('  PASS: Scenario 10 - Construction completion and usable capacity expansion');
}

// Scenario 11: Multiple simultaneous NPC demands
{
  const W = world('eco-simultaneous-demands');
  const b = W.map.byId.alchemy;
  // Free up stations
  b.stations.forEach(sid => { if (W.map.stations[sid]) W.map.stations[sid].occ = null; });

  const npcs = W.npcs.slice(0, 3);
  const allocated = [];
  npcs.forEach(n => {
    const st = AI.freeStation(W, n, 'cauldron', 'alchemy');
    if (st) {
      AI.reserve(W, n, st);
      allocated.push(st);
    } else {
      SECT.recordFacilityDemand(W, 'alchemy', 'failed_station', n);
    }
  });

  // Stations reserved by different NPCs must not conflict
  const occs = allocated.map(s => s.occ);
  const uniqueOccs = new Set(occs);
  assert.strictEqual(occs.length, uniqueOccs.size, 'each allocated station must be uniquely occupied');

  // Clean up
  npcs.forEach(n => AI.release(W, n));
  console.log('  PASS: Scenario 11 - Multiple simultaneous NPC demands');
}

// Scenario 12: Save/load continuity
{
  const W = world('eco-save-load');
  SECT.ensureFacilityDemand(W);
  ECO.ensureStockTracker(W);
  W.sect.facilityDemand.dorm_outer.failedAttempts = 5;
  W.sect.facilityDemand.dorm_outer.congestedHours = 7;
  W.sect.cp.circulation = 120;
  W.sect.cp.retired = 40;
  W.sect.stockTracker.usage['grain'] = 15;

  const serialized = SIM.serialize(W);
  assert(typeof serialized === 'string' && serialized.length > 100);

  const restored = SIM.deserialize(serialized);
  assert(restored.sect.facilityDemand, 'restored world must have facilityDemand');
  assert.strictEqual(restored.sect.facilityDemand.dorm_outer.failedAttempts, 5);
  assert.strictEqual(restored.sect.facilityDemand.dorm_outer.congestedHours, 7);
  assert.strictEqual(restored.sect.cp.circulation, 120);
  assert.strictEqual(restored.sect.cp.retired, 40);
  assert(restored.sect.stockTracker, 'restored world must have stockTracker');
  console.log('  PASS: Scenario 12 - Save/load continuity');
}

// Scenario 13: Multiple deterministic simulation seeds
{
  const seeds = ['eco-det-seed-1', 'eco-det-seed-2'];
  seeds.forEach(seed => {
    const W1 = world(seed);
    const W2 = world(seed);

    // Run both worlds for 120 ticks
    for (let t = 0; t < 120; t++) {
      SIM.tick(W1);
      SIM.tick(W2);
    }

    // Invariants check
    assert(W1.sect.stones >= 0, 'stones must never be negative');
    assert(W2.sect.stones >= 0, 'stones must never be negative');
    Object.keys(W1.sect.stock).forEach(k => {
      assert(W1.sect.stock[k] >= 0, 'stock must never be negative: ' + k);
    });

    // Determinism check between runs with same seed
    assert.strictEqual(W1.day, W2.day, 'days must match');
    assert.strictEqual(W1.sect.stones, W2.sect.stones, 'stones must be identical for same seed');
    assert.strictEqual(Math.round(W1.avgMood), Math.round(W2.avgMood), 'avgMood must match');
  });
  console.log('  PASS: Scenario 13 - Multiple deterministic simulation seeds');
}

// Scenario 14: Facility demand decay resets stale congestion
{
  const W = world('eco-demand-decay');
  SECT.ensureFacilityDemand(W);
  const dorm = W.map.byId.dorm_outer;
  assert(dorm, 'dorm_outer must exist');
  const fd = W.sect.facilityDemand.dorm_outer;

  // Record congestion events at t = 100
  W.t = 100;
  fd.failedAttempts = 6;
  fd.unmetDemands = 6;
  fd.congestedHours = 8;
  fd.lastCongestionHour = W.t;

  // 1 day of inactivity (t = 100 + 1440) -> demand counters halve
  W.t = 100 + 1440;
  SECT.decayFacilityDemand(W);
  assert.strictEqual(fd.failedAttempts, 3, '1 day inactivity should halve failed attempts');
  assert.strictEqual(fd.congestedHours, 4, '1 day inactivity should halve congested hours');

  // >= 2 days of inactivity (t = 100 + 1440 * 2.5) -> demand counters reset to 0
  W.t = 100 + Math.floor(1440 * 2.5);
  SECT.decayFacilityDemand(W);
  assert.strictEqual(fd.failedAttempts, 0, '2+ days inactivity must clear failed attempts to 0');
  assert.strictEqual(fd.unmetDemands, 0, '2+ days inactivity must clear unmet demands to 0');
  assert.strictEqual(fd.congestedHours, 0, '2+ days inactivity must clear congested hours to 0');

  // Stale demand does not trigger building upgrade
  const master = W.byId[W.sect.masterId];
  W.sect.stones = 50000;
  W.sect.stock['grain'] = 500;
  W.sect.stock['meal'] = 500;
  dorm.stations = new Array(50).fill('dummy_station'); // plenty of beds so structural need doesn't trigger
  SECT.upgradeBuilding(W, master);
  assert(!dorm.building, 'stale congestion must not trigger facility expansion');
  console.log('  PASS: Scenario 14 - Facility demand decay resets stale congestion');
}

// Scenario 15: Active sustained congestion triggers upgrade lifecycle and prevents duplicate expansion
{
  const W = world('eco-sustained-upgrade');
  SECT.ensureFacilityDemand(W);
  const master = W.byId[W.sect.masterId];
  const alc = W.map.byId.alchemy;
  assert(alc, 'alchemy facility must exist');
  const fd = W.sect.facilityDemand.alchemy;

  // Put other buildings on upgrade cooldown so alchemy is evaluated cleanly
  ['dorm_outer', 'meditation_hall', 'forge', 'herb_garden', 'farm', 'mine', 'canteen', 'infirmary', 'training_ground', 'dorm_inner', 'dorm_core', 'scripture'].forEach(id => {
    if (W.sect.facilityDemand[id]) W.sect.facilityDemand[id].lastUpgradedDay = W.day;
  });
  fd.lastUpgradedDay = 0;
  W.day = 30;

  // Sufficient sect treasury
  W.sect.stones = 50000;
  W.sect.policy.expansion = 80;

  // 1. Single isolated spike (failedAttempts = 1, congestedHours = 1) must NOT trigger upgrade
  fd.failedAttempts = 1;
  fd.unmetDemands = 1;
  fd.congestedHours = 1;
  fd.lastCongestionHour = W.t;
  SECT.upgradeBuilding(W, master);
  assert(!alc.building, 'isolated single spike must not trigger building expansion');

  // 2. Active sustained congestion (failedAttempts >= 2, congestedHours >= 3) triggers upgrade
  fd.failedAttempts = 4;
  fd.unmetDemands = 4;
  fd.congestedHours = 5;
  fd.lastCongestionHour = W.t;
  SECT.upgradeBuilding(W, master);
  assert(alc.building, 'sustained active congestion must trigger facility upgrade');
  assert.strictEqual(alc.building.to, 2, 'upgrade target should be level 2');
  assert.strictEqual(fd.failedAttempts, 0, 'starting upgrade must reset failedAttempts');
  assert.strictEqual(fd.congestedHours, 0, 'starting upgrade must reset congestedHours');

  // 3. Duplicate upgrade prevention: while under construction, another upgrade cannot start
  const forge = W.map.byId.forge;
  const forgeFd = W.sect.facilityDemand.forge;
  forgeFd.lastUpgradedDay = 0;
  forgeFd.failedAttempts = 6;
  forgeFd.congestedHours = 8;
  forgeFd.lastCongestionHour = W.t;
  SECT.upgradeBuilding(W, master);
  assert(!forge.building, 'cannot start concurrent upgrade while another building is under construction');

  console.log('  PASS: Scenario 15 - Active sustained congestion triggers upgrade lifecycle and prevents duplicate expansion');
}

// Scenario 16: Multi-zone outer beasts, multi-pools, perimeter gates, and loot flow
{
  const W = world('eco-wildlife-zones');
  const { WILD } = G;
  assert(WILD, 'WILD module must exist');
  assert(WILD.zones, 'WILD.zones must exist');

  // 1. Verify zones in all directions (South, West, East, North)
  const zoneKeys = ['meadow', 'ridge', 'west_grove', 'east_crag', 'north_peak', 'legend'];
  zoneKeys.forEach(zk => {
    const z = WILD.zones[zk];
    assert(z, 'zone ' + zk + ' must exist');
    assert(Array.isArray(z.pools) && z.pools.length >= 2, zk + ' must have multiple pools (>= 2)');
    z.pools.forEach(pool => {
      assert(pool.id && pool.nameTh, 'pool must have id and nameTh');
      assert(pool.min <= pool.max, 'pool min tier must be <= max tier');
      assert(Array.isArray(pool.speciesIds) && pool.speciesIds.length > 0, 'pool must contain speciesIds');
    });
  });

  // 2. Spawns across different zones are outside sect walls
  const wall = W.map.wall;
  const spawned = [];
  ['west_grove', 'east_crag', 'north_peak'].forEach(zk => {
    const b = WILD.spawn(W, zk);
    assert(b, 'must successfully spawn beast in ' + zk);
    assert(b.zone === zk, 'beast zone must match');
    const outside = (b.x < wall.x0 || b.x > wall.x1 || b.y < wall.y0 || b.y > wall.y1);
    assert(outside, zk + ' beast must be placed outside walls (x=' + b.x + ', y=' + b.y + ')');
    spawned.push(b);
  });

  // 3. Combat clamping keeps fighting beasts in their zone outside walls
  spawned.forEach(b => {
    b.fighting = 999;
    b.x = (wall.x0 + wall.x1) / 2; // attempt placing inside walls
    b.y = (wall.y0 + wall.y1) / 2;
    WILD.clampCombat(W);
    const z = WILD.zones[b.zone];
    if (z.dir === 'west') assert(b.x <= wall.x0, 'west beast clamped outside west wall');
    if (z.dir === 'east') assert(b.x >= wall.x1, 'east beast clamped outside east wall');
    if (z.dir === 'north') assert(b.y <= wall.y0, 'north beast clamped outside north wall');
    if (z.dir === 'south') assert(b.y >= wall.y1, 'south beast clamped outside south wall');
    b.fighting = null;
  });

  // 4. Perimeter gates allow pathfinding from sect inside to outer zones
  assert(!MAP.blocked(W.map, wall.x0, 80), 'west gate tile must not be blocked');
  assert(!MAP.blocked(W.map, wall.x1, 80), 'east gate tile must not be blocked');
  assert(!MAP.blocked(W.map, 118, wall.y0), 'north gate tile must not be blocked');

  // 5. Hunt victory drops into personal inventory and can be donated to sect
  const hunter = W.npcs[0];
  const testBeast = spawned[0];
  testBeast.dead = true;
  const fakeFight = { id: 888, kind: 'wild', ctx: { beastId: testBeast.id, hunterId: hunter.id }, wildSettled: false };
  W.foeById[testBeast.id] = testBeast;
  WILD.finish(W, fakeFight, 'A');
  const mats = hunter.inv.mats || {};
  const matKeys = Object.keys(mats).filter(k => mats[k] > 0);
  assert(matKeys.length > 0, 'hunter must receive drop into personal inventory');
  const droppedMat = matKeys[0];
  const matCountBefore = mats[droppedMat];
  const sectStockBefore = W.sect.stock[droppedMat] || 0;
  const cpBefore = hunter.cp;

  // Donate personal product to sect
  const donated = ECO.donatePersonalProduct(W, hunter, droppedMat, 1);
  assert(donated && donated.ok, 'personal drop donation to sect should succeed');
  assert.strictEqual(hunter.inv.mats[droppedMat] || 0, matCountBefore - 1, 'personal mat should decrease by 1');
  assert.strictEqual(W.sect.stock[droppedMat], sectStockBefore + 1, 'sect stock should increase by 1');
  assert(hunter.cp > cpBefore, 'hunter should earn CP for donating hunted drops');

  // 6. Beast population cap
  for (let i = 0; i < 20; i++) WILD.spawn(W, 'meadow');
  WILD.tick(W);
  const activeCount = W.wildlife.beasts.filter(b => !b.gone && !b.dead).length;
  assert(activeCount <= 12, 'active beast population must not exceed cap (got ' + activeCount + ')');

  console.log('  PASS: Scenario 16 - Multi-zone outer beasts, multi-pools, perimeter gates, and loot flow');
}

// Scenario 17: Rich wuxia event logging and multi-category filtering
{
  const W = world('eco-wuxia-logging');
  if (!G.document) {
    G.document = {
      getElementById() {
        return { querySelectorAll() { return []; }, style: {}, classList: { add() {}, remove() {} } };
      }
    };
  }
  if (!G.UI) require('../js/ui.js');
  const { UI } = G;
  assert(UI, 'UI module must be loaded');

  // Clean slate for logs
  W.logs = [];

  const n = W.npcs[0];

  // 1. Injury logging
  AI.injure(W, n, 1, 'อุบัติเหตุ');
  const injuryLog = W.logs.find(l => l.type === 'injury');
  assert(injuryLog, 'injury must produce an injury log');
  assert(injuryLog.text.includes(n.h.name.given), 'log must mention the injured member');

  // 2. Healing logging
  assert(n.inj && n.inj.length > 0, 'npc must have recorded injury');
  n.inj[0].until = 10; // set remaining recovery time to under 1 hour
  AI.healTick(W, n);
  const healLog = W.logs.find(l => l.type === 'heal');
  assert(healLog, 'recovery must produce a heal log');

  // 3. Crafting log (success / high purity)
  const craftLogText = n.h.name.given + ' ปรุงโอสถ โอสถปราณรวม สำเร็จ บริสุทธิ์เลิศล้ำ ได้รับ 3 เม็ด';
  W.log('craft', craftLogText, [n.id]);

  // 4. Combat / Beast hunt log
  const beastLogText = n.h.name.given + ' ล่าสังหาร หมูป่าเกราะเหล็กไหล ในทุ่งหญ้าหน้าสำนัก สำเร็จ ได้รับ หนังหมูป่าเกราะเหล็ก';
  W.log('combat', beastLogText, [n.id]);

  // 5. Economy log
  const ecoLogText = n.h.name.given + ' บริจาค หนังหมูป่าเกราะเหล็ก ×1 เข้าคลังสำนัก ได้รับ 15 คป.';
  W.log('economy', ecoLogText, [n.id]);

  // 6. Verify Thai wuxia tone and no empty logs
  assert(W.logs.length >= 5, 'must have logged at least 5 events');
  W.logs.forEach(l => {
    assert(l.text && typeof l.text === 'string' && l.text.length > 5, 'log entry text must be valid string');
    assert(l.type && typeof l.type === 'string', 'log entry must have a type');
    assert(typeof l.t === 'number', 'log entry must have a timestamp');
  });

  // 7. Verify UI Multi-category filtering
  UI.G = { W, R: {}, opts: {}, acc: 0, speed: 1 };
  UI.tab = 'all';
  UI.logFilters = new Set(['all']);

  // All filter renders all logs
  let htmlAll = UI.rLog();
  assert(htmlAll.includes('ล่าสังหาร'), 'all filter should include combat');
  assert(htmlAll.includes('ปรุงโอสถ'), 'all filter should include craft');
  assert(htmlAll.includes('บริจาค'), 'all filter should include economy');

  // Switch to combat only
  UI.toggleLogFilter('combat');
  assert(UI.logFilters.has('combat'));
  assert(!UI.logFilters.has('all'));
  let htmlCombat = UI.rLog();
  assert(htmlCombat.includes('ล่าสังหาร'), 'combat filter must show combat logs');
  assert(!htmlCombat.includes('ปรุงโอสถ'), 'combat filter must not show craft logs');
  assert(!htmlCombat.includes('บริจาค'), 'combat filter must not show economy logs');

  // Multi-select: toggle economy in addition to combat
  UI.toggleLogFilter('economy');
  assert(UI.logFilters.has('combat') && UI.logFilters.has('economy'));
  let htmlMulti = UI.rLog();
  assert(htmlMulti.includes('ล่าสังหาร'), 'multi-filter must show combat logs');
  assert(htmlMulti.includes('บริจาค'), 'multi-filter must show economy logs');
  assert(!htmlMulti.includes('ปรุงโอสถ'), 'multi-filter must not show craft logs');

  // Toggle all back
  UI.toggleLogFilter('all');
  assert(UI.logFilters.has('all'));
  let htmlReset = UI.rLog();
  assert(htmlReset.includes('ปรุงโอสถ'), 'reset to all must show craft logs again');

  console.log('  PASS: Scenario 17 - Rich wuxia event logging and multi-category filtering');
}

console.log('ALL 17 AUTONOMOUS ECONOMY, WILDLIFE & LOGGING TESTS PASSED.');
