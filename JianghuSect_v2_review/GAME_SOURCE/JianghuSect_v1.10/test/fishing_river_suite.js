'use strict';
/**
 * Comprehensive Verification Suite for Southern Spirit River, Fishing Activity,
 * 90/10 & 50/49.5/0.5 Mysterious Container Lottery, 4/5/6/7-Tier Distributions,
 * Fish Utilization (Cooking, Food Buffs, Alchemy), and NPC Integration.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const g = require('./load.js');
const { SIM, MAP, ECO, SECT, AI, CULT, MARTIAL, VC, FISHING, U } = g;

console.log('Testing Southern Spirit River, Fishing, Mysterious Containers & Fish Utilization (v1.12.3)...');

// 1. Map Expansion, River Impassability, Bridges & Fishing Station Reachability
{
  console.log('  1. Testing Map Expansion (240x192), Southern Spirit River, Bridges & Station Reachability...');
  const W = SIM.create('fishing-map-audit-1');
  const M = W.map;
  assert.strictEqual(M.W, 240, 'Map width must remain 240');
  assert.strictEqual(M.H, 192, 'Map height must be expanded southward to 192');
  assert.strictEqual(MAP.EXIT.x, 118);
  assert.strictEqual(MAP.EXIT.y, 188);

  // Verify all 3 Southern River zones + Spirit Pond exist
  ['spirit_pond', 'river_dock', 'river_west', 'river_east'].forEach(bid => {
    assert(M.byId[bid], 'Missing water/fishing zone building: ' + bid);
  });

  // Verify river channel water tiles are impassable (T.WATER, block === 2, speedAt === 0)
  let waterTiles = 0;
  for (let y = 164; y <= 176; y++) {
    for (let x = 20; x < 220; x++) {
      const k = y * M.W + x;
      if (M.terrain[k] === MAP.T.WATER) {
        waterTiles++;
        assert.strictEqual(M.block[k], 2, `Water tile at (${x},${y}) must be blocked (block=2)`);
        assert.strictEqual(M.cost[k], 0, `Water tile at (${x},${y}) must have 0 pathfinding cost (impassable)`);
      }
    }
  }
  assert(waterTiles >= 800, 'Southern Spirit River must have a substantial continuous water channel, got ' + waterTiles);

  // Verify all fishing stations are on passable land/pier tiles, adjacent to water, and reachable from sect plaza
  const fishStations = M.stations.filter(s => s.kind === 'fish');
  assert(fishStations.length >= 24, 'Expected at least 24 fishing stations across 4 zones, got ' + fishStations.length);
  for (const st of fishStations) {
    assert.strictEqual(MAP.blocked(M, st.x, st.y), false, `Fishing station ${st.id} at (${st.x},${st.y}) must be walkable`);
    assert.strictEqual(MAP.hasAdjacentWater(M, st.x, st.y), true, `Fishing station ${st.id} at (${st.x},${st.y}) must be adjacent to water`);
    const p = MAP.findPath(M, 118, 80, st.x, st.y);
    assert(Array.isArray(p) && p.length > 5, `Fishing station ${st.id} in ${st.bkey} must be reachable from plaza`);
    // Ensure path never steps onto T.WATER
    for (const [px, py] of p) {
      assert.notStrictEqual(M.terrain[py * M.W + px], MAP.T.WATER, `Path to station ${st.id} stepped onto impassable water at (${px},${py})`);
    }
  }

  // Verify MAP.EXIT (118, 188) is reachable across the central bridge without stepping on water
  const exitPath = MAP.findPath(M, 118, 80, MAP.EXIT.x, MAP.EXIT.y);
  assert(Array.isArray(exitPath) && exitPath.length > 40, 'MAP.EXIT must be reachable across the central bridge');
  for (const [px, py] of exitPath) {
    assert.notStrictEqual(M.terrain[py * M.W + px], MAP.T.WATER, 'Path to MAP.EXIT must cross bridge, not water');
  }
  console.log('    PASS: 240x192 map, impassable river water, 3 bridges, and ' + fishStations.length + ' reachable fishing stations verified.');
}

// 2. Idempotent Save Migration & Round-Trip Continuity
{
  console.log('  2. Testing Legacy Save Migration & Save/Load Round-Trip Idempotency...');
  const v19Raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'v1_9_synthetic.json'), 'utf8');
  const Wleg = SIM.deserialize(v19Raw);
  assert.strictEqual(Wleg.map.H, 192, 'Migrated v1.9 save must have expanded 192 height');
  assert(Wleg.map.byId.river_dock && Wleg.map.byId.river_west && Wleg.map.byId.river_east, 'Migrated save must have Southern River zones');
  assert(Wleg.fishing && Wleg.fishing.zones && Wleg.fishing.zones.river_central, 'Migrated save must initialize W.fishing');

  // Mutate fishing state, catch a fish & container, open container, then serialize/deserialize twice
  const n = Wleg.npcs[0];
  Wleg.fishing.zones.river_east.stock = 11;
  const c1 = FISHING.resolveSuccessfulCatch(Wleg, n, 'river_east', { catchRoll: 0.25, speciesRoll: 0.1 });
  const c2 = FISHING.resolveSuccessfulCatch(Wleg, n, 'river_east', { catchRoll: 0.95 });
  assert.strictEqual(c1.outcome, 'FISH');
  assert.strictEqual(c2.outcome, 'MYSTERY_CONTAINER');
  assert.strictEqual(Wleg.fishing.zones.river_east.stock, 9);

  const openRes = FISHING.openContainer(Wleg, n, { openRoll: 0.65, receiptId: 'test_rc_1' });
  assert.strictEqual(openRes.ok, true);
  // Calling openContainer again with the same receiptId must be idempotent
  const openReplay = FISHING.openContainer(Wleg, n, { openRoll: 0.999, receiptId: 'test_rc_1' });
  assert.strictEqual(openReplay.receiptId, 'test_rc_1');
  assert.strictEqual(openReplay.drop.id, openRes.drop.id, 'Receipt replay must return identical drop without consuming extra container');

  const snap1 = SIM.serialize(Wleg);
  const Wrel = SIM.deserialize(snap1);
  assert.strictEqual(Wrel.fishing.zones.river_east.stock, 9, 'Reloaded save must preserve exact zone stock');
  assert.strictEqual(Wrel.fishing.stats.fishCaught, 1);
  assert.strictEqual(Wrel.fishing.stats.containersCaught, 1);
  assert.strictEqual(Wrel.fishing.stats.containersOpened, 1);
  console.log('    PASS: Legacy save migration, receipt idempotency, and save/load round-trip verified.');
}

// 3. Fish Catalog, Bounded Zone Pools & Daily Recovery
{
  console.log('  3. Testing 10-Species Fish Catalog, Bounded Zone Depletion & Daily Recovery...');
  assert.strictEqual(FISHING.SPECIES.length, 10, 'Catalog must contain 10 distinct fish species across Tiers 1-5');
  const tiers = [...new Set(FISHING.SPECIES.map(s => s.tier))].sort((a, b) => a - b);
  assert.deepStrictEqual(tiers, [1, 2, 3, 4, 5], 'Fish catalog must span Tiers 1..5');
  FISHING.SPECIES.forEach(sp => {
    assert(sp.id && sp.nameTh && sp.habitats.length > 0 && sp.catchWeight > 0 && sp.value > 0, 'Invalid fish species: ' + sp.id);
    assert(ECO.matById[sp.id], 'Fish species must be registered in ECO.matById: ' + sp.id);
  });

  const W = SIM.create('fishing-pool-depletion');
  const n = W.npcs[0];
  const z = W.fishing.zones.spirit_pond;
  const maxS = z.maxStock;
  for (let i = 0; i < maxS; i++) {
    const r = FISHING.resolveSuccessfulCatch(W, n, 'spirit_pond', { catchRoll: 0.1 });
    assert.strictEqual(r.ok, true);
  }
  assert.strictEqual(z.stock, 0, 'Zone stock must reach 0 after maxStock catches');
  const depleted = FISHING.resolveSuccessfulCatch(W, n, 'spirit_pond', { catchRoll: 0.1 });
  assert.strictEqual(depleted.ok, false);
  assert.strictEqual(depleted.reason, 'zone_depleted', 'Depleted zone must refuse further catches');

  FISHING.daily(W);
  assert(z.stock > 0 && z.stock <= z.maxStock, 'Daily update must recover bounded fish stock');
  console.log('    PASS: 10 fish species, bounded pool depletion, and daily natural recovery verified.');
}

// 4. Exact Probability Tables (90/10, 50/49.5/0.5, Category Preference, 4/5/6/7-Tier Tables & 100,000-Sample Monte Carlo)
{
  console.log('  4. Testing Exact Probability Tables (4, 5, 6, 7 Tiers) & 100,000-Trial Monte Carlo Verification...');
  const spec = FISHING.getFullProbabilitySpec();
  assert.strictEqual(spec.catchOutcomes.FISH, 0.90);
  assert.strictEqual(spec.catchOutcomes.MYSTERY_CONTAINER, 0.10);
  assert.strictEqual(spec.containerBranches.TRASH, 0.500);
  assert.strictEqual(spec.containerBranches.ORDINARY, 0.495);
  assert.strictEqual(spec.containerBranches.LEGENDARY, 0.005);
  assert.strictEqual(spec.nominalLegendaryPerCatch, 0.0005);

  // Verify strict category preference ordering:
  // Pills > Equipment > Technique Crystals > Subpath Crystals > Technique Manuals > Subpath Manuals
  const cw = FISHING.ORDINARY_CATEGORY_WEIGHTS;
  assert(cw.PILL > cw.EQUIPMENT, 'Pills must be more common than Equipment');
  assert(cw.EQUIPMENT > cw.TECH_CRYSTAL, 'Equipment must be more common than Technique Crystals');
  assert(cw.TECH_CRYSTAL > cw.SUB_CRYSTAL, 'Technique Crystals must be more common than Subpath Crystals');
  assert(cw.SUB_CRYSTAL > cw.TECH_MANUAL, 'Subpath Crystals must be more common than Technique Manuals');
  assert(cw.TECH_MANUAL > cw.SUB_MANUAL, 'Technique Manuals must be more common than Subpath Manuals');
  assert(cw.SUB_MANUAL > 0, 'Subpath Manuals weight must be positive');
  const cwSum = Object.values(cw).reduce((a, b) => a + b, 0);
  assert(Math.abs(cwSum - 1.0) < 1e-9, 'Ordinary category weights must sum to 1.0, got ' + cwSum);

  // Verify every supported tier table (4, 5, 6, 7 tiers) satisfies P(T1) > P(T2) > ... > P(Tk) > 0 and top tier <= 0.04
  for (const k of [4, 5, 6, 7]) {
    const tbl = FISHING.getTierProbabilityTable(k);
    const keys = Object.keys(tbl).map(Number).sort((a, b) => a - b);
    assert.strictEqual(keys.length, k, `Tier table for k=${k} must have ${k} tiers`);
    let sum = 0;
    for (let t = 1; t <= k; t++) {
      assert(tbl[t] > 0, `P(T_${t}) for k=${k} must be > 0`);
      if (t > 1) {
        assert(tbl[t - 1] > tbl[t], `Tier probabilities for k=${k} must strictly decrease: P(T_${t - 1})=${tbl[t - 1]} <= P(T_${t})=${tbl[t]}`);
      }
      sum += tbl[t];
    }
    assert(Math.abs(sum - 1.0) < 1e-6, `Tier table for k=${k} must sum to 1.0, got ${sum}`);
    assert(tbl[k] <= 0.04, `Top tier T_${k} in ${k}-tier category must remain genuinely rare (<= 4%), got ${tbl[k]}`);
  }

  // Run 100,000-sample Monte Carlo lottery verification
  const W = SIM.create('fishing-monte-carlo-100k');
  const N = 100000;
  let fishCnt = 0, boxCnt = 0;
  for (let i = 0; i < N; i++) {
    const r = FISHING.resolveSuccessfulCatch(W, null, 'river_central', { ignoreStock: true, silent: true });
    if (r.outcome === 'FISH') fishCnt++;
    else if (r.outcome === 'MYSTERY_CONTAINER') boxCnt++;
  }
  const fishRate = fishCnt / N, boxRate = boxCnt / N;
  assert(Math.abs(fishRate - 0.90) < 0.006, `Monte Carlo catch FISH rate ${fishRate} deviated from 0.90`);
  assert(Math.abs(boxRate - 0.10) < 0.006, `Monte Carlo catch CONTAINER rate ${boxRate} deviated from 0.10`);

  let trashCnt = 0, ordCnt = 0, legCnt = 0;
  const catCounts = {};
  const tierCountsByCat = {};
  for (let i = 0; i < N; i++) {
    const r = FISHING.openContainer(W, null, { dryRun: true, silent: true });
    if (r.branch === 'TRASH') trashCnt++;
    else if (r.branch === 'ORDINARY') {
      ordCnt++;
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
      if (!tierCountsByCat[r.category]) tierCountsByCat[r.category] = {};
      tierCountsByCat[r.category][r.rolledTier] = (tierCountsByCat[r.category][r.rolledTier] || 0) + 1;
      assert.strictEqual(r.drop.legendary, false, 'Ordinary branch must never drop a Legendary item');
      if (r.drop.techId) {
        assert.strictEqual(MARTIAL.isInnateTech(r.drop.techId), false, 'Innate-only technique must never drop from container');
      }
    } else if (r.branch === 'LEGENDARY') {
      legCnt++;
      assert.strictEqual(r.drop.legendary, true, 'Legendary branch must drop a Legendary item when pool is non-empty');
    }
  }
  const trashRate = trashCnt / N, ordRate = ordCnt / N, legRate = legCnt / N;
  assert(Math.abs(trashRate - 0.500) < 0.006, `Monte Carlo TRASH rate ${trashRate} deviated from 0.500`);
  assert(Math.abs(ordRate - 0.495) < 0.006, `Monte Carlo ORDINARY rate ${ordRate} deviated from 0.495`);
  assert(Math.abs(legRate - 0.005) < 0.0015, `Monte Carlo LEGENDARY rate ${legRate} deviated from 0.005`);
  assert(catCounts.PILL > catCounts.EQUIPMENT && catCounts.EQUIPMENT > catCounts.TECH_CRYSTAL && catCounts.TECH_CRYSTAL > catCounts.SUB_CRYSTAL && catCounts.SUB_CRYSTAL > catCounts.TECH_MANUAL && catCounts.TECH_MANUAL > catCounts.SUB_MANUAL, 'Monte Carlo category counts must preserve strict preference ordering');
  console.log(`    PASS: 100,000-sample Monte Carlo verified: Catch(Fish=${(fishRate*100).toFixed(2)}%, Box=${(boxRate*100).toFixed(2)}%), Open(Trash=${(trashRate*100).toFixed(2)}%, Ordinary=${(ordRate*100).toFixed(2)}%, Legendary=${(legRate*100).toFixed(3)}%).`);
}

// 5. Unique Legendary Artifact Non-Duplication & Empty-Pool Fallback
{
  console.log('  5. Testing Unique Legendary Artifact Non-Duplication & Empty-Pool Fallback...');
  const W = SIM.create('fishing-unique-legendary');
  const m = W.byId[W.sect.masterId];
  m.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER = 100;

  // Open containers forced to the 0.5% Legendary branch until every unique weapon and legendary technique is claimed
  const claimedIds = new Set();
  let totalUniqueCount = FISHING.buildEligibleLegendaryPool(W).total;
  assert(totalUniqueCount >= 30, 'Expected at least 30 total unique legendary weapons + techniques, got ' + totalUniqueCount);

  for (let i = 0; i < totalUniqueCount; i++) {
    const res = FISHING.openContainer(W, m, { openRoll: 0.999, silent: true });
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.branch, 'LEGENDARY');
    assert.strictEqual(res.fallbackUsed, null, `Expected unclaimed legendary on roll ${i + 1}`);
    const uniqueKey = res.drop.techId || res.drop.id;
    assert.strictEqual(claimedIds.has(uniqueKey), false, `Duplicate legendary granted: ${uniqueKey}`);
    claimedIds.add(uniqueKey);
  }

  // Now the eligible legendary pool must be 0, and the next 0.999 roll must trigger the safe fallback!
  assert.strictEqual(FISHING.buildEligibleLegendaryPool(W).total, 0, 'All unique legendaries should now be claimed');
  const fbRes = FISHING.openContainer(W, m, { openRoll: 0.999, silent: true });
  assert.strictEqual(fbRes.ok, true);
  assert.strictEqual(fbRes.fallbackUsed, 'all_legendaries_claimed', 'Empty legendary pool must trigger safe fallback');
  assert.strictEqual(fbRes.drop.legendary, false);

  const audit = VC.auditUniqueWeaponInvariant(W);
  assert.strictEqual(audit.ok, true, 'Unique legendary weapon invariant must hold with 0 duplicates');
  console.log(`    PASS: All ${totalUniqueCount} unique legendaries claimed without duplication, and empty-pool fallback verified.`);
}

// 6. Worthless Trash Protection, Fish Cooking, Bounded Food Buffs & Alchemy Recipes
{
  console.log('  6. Testing Trash Non-Arbitrage, Fish Cooking, Bounded Food Buffs & Alchemy Recipes...');
  const W = SIM.create('fishing-utilization');
  const n = W.npcs[0];
  n.inv.mats.TRASH_RIVER_DEBRIS = 3;
  const cpBefore = n.cp;
  const donTrash = SECT.donateMat(W, n, 'TRASH_RIVER_DEBRIS', 1);
  assert.strictEqual(donTrash.ok, false, 'Worthless river trash must not be donatable for CP');
  assert.strictEqual(n.cp, cpBefore);
  const disc = FISHING.discardTrash(W, n, false);
  assert.strictEqual(disc.ok, true);
  assert.strictEqual(n.inv.mats.TRASH_RIVER_DEBRIS, undefined);

  // Cook fish in canteen when grain is 0
  W.sect.stock.grain = 0;
  W.sect.stock.meal = 0;
  ECO.add(W, 'MAT_FISH_SILVER_CARP_1', 4);
  assert.strictEqual(AI.ACTS.cook.can(n, W), true, 'A.cook must be runnable when cookable fish is in stock even if grain is 0');
  const cookedMeals = ECO.cookMeals(W, 1, 25);
  assert(cookedMeals >= 3 && ECO.count(W, 'meal') >= 3, 'Cooking with fish must produce canteen meals');
  assert(ECO.count(W, 'FOOD_STEAMED_SPIRIT_FISH') >= 1, 'Cooking with fish must also produce steamed spirit fish dish');

  // Eat fish dish and verify bounded non-stacking foodBuff + appetite gate
  n.h.state.satiety = 45;
  n.inv.mats.FOOD_JADE_KOI_SOUP = 2;
  const eat1 = FISHING.eatFishDish(W, n, 'FOOD_JADE_KOI_SOUP', false);
  assert.strictEqual(eat1.ok, true);
  assert(n.foodBuff && n.foodBuff.id === 'food_focus', 'Eating Jade Koi Soup must apply food_focus buff');
  assert(n.h.state.satiety >= 80);

  // Now satiety is >= 81; top up to 90 and verify appetite gate blocks overeating for buff spam
  n.h.state.satiety = 90;
  const eatBlocked = FISHING.eatFishDish(W, n, 'FOOD_JADE_KOI_SOUP', false);
  assert.strictEqual(eatBlocked.ok, false);
  assert.strictEqual(eatBlocked.reason, 'too_full', 'Appetite gate must block eating fish dishes when satiety >= 88');

  // Verify Fish Alchemy Recipe (REC_FISH_GALL_CLARITY_3)
  W.sect.recipeTier = 5;
  ECO.add(W, 'MAT_FISH_JADE_KOI_3', 2);
  ECO.add(W, 'MAT_HERB_JADE_LOTUS_2', 2);
  n.h.skills.ALCHEMY = 65;
  const r = ECO.recipeById.REC_FISH_GALL_CLARITY_3;
  assert(r, 'REC_FISH_GALL_CLARITY_3 must exist in ECO.recipeById');
  const ctx = {};
  assert.strictEqual(ECO.reserveInputs(W, r, ctx, n), true, 'Must reserve fish + herb inputs for REC_FISH_GALL_CLARITY_3');
  W.rng.next = () => 0.05; // Guarantee craft success
  const craftOut = ECO.finishCraft(W, n, r, ctx);
  assert.strictEqual(craftOut.ok, true);
  assert(ECO.count(W, 'P:REC_FISH_GALL_CLARITY_3') >= 1, 'Brewing REC_FISH_GALL_CLARITY_3 must add pill to sect stock');
  console.log('    PASS: Trash protection, canteen fish cooking, foodBuff + appetite gate, and fish alchemy verified.');
}

// 7. Real NPC Fishing Action (AI.ACTS.riverFish) Lifecycle
{
  console.log('  7. Testing Real NPC Fishing Activity (AI.ACTS.riverFish) Lifecycle...');
  const W = SIM.create('fishing-npc-action');
  const n = W.npcs[1];
  n.inj = [];
  Object.assign(n.h.state, { hp: CULT.hpMax(n), satiety: 75, rest: 85, energy: 85, stress: 45 });
  assert.strictEqual(AI.ACTS.riverFish.can(n, W), true, 'Healthy disciple must be able to perform riverFish');
  const where = AI.ACTS.riverFish.where(W, n);
  assert(where && where.st && where.zoneId, 'riverFish.where must select a valid fishing station and zone');
  const started = AI.begin(W, n, 'riverFish', where);
  assert.strictEqual(started, true, 'AI.begin(riverFish) must succeed and reserve station');
  assert.strictEqual(where.st.occ, n.id, 'Station must be occupied by the fishing NPC');

  // Step until NPC arrives and finishes fishing
  let guard = 0;
  while (n.act.id === 'riverFish' && guard < 300) {
    SIM.tick(W);
    guard++;
  }
  assert(guard < 300, 'NPC must complete riverFish within bounded ticks');
  assert.strictEqual(where.st.occ, null, 'Station must be released after riverFish completes');
  assert(FISHING.skillOf(W, n) > 0, 'Fishing skill must increase after fishing');
  console.log('    PASS: Real NPC fishing lifecycle, movement, skill gain, and station release verified.');
}


// 8. Headless Chromium UI & Standalone Verification for Southern River, Atlas Icons (64..71) & Container/Dish Actions
(async () => {
  console.log('  8. Testing Headless Chromium UI: River Dock Sheet, Atlas Cells 64..71, Container Opening, Cooking & Eating...');
  const { chromium } = (() => { try { return require('playwright'); } catch (_) { return require('../tools/cdp_playwright.js'); } })();
  const root = path.resolve(__dirname, '..');
  const b = await chromium.launch();
  const pageErrors = [];
  const consoleErrors = [];
  const ctx = await b.newContext({ width: 360, height: 800, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => pageErrors.push(e.message));
  p.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

  await p.goto('file://' + path.join(root, 'JianghuSect_single.html'));
  await p.waitForSelector('[data-pick="0"]');
  await p.click('[data-pick="0"]');
  await p.waitForTimeout(200);

  const uiAudit = await p.evaluate(() => {
    G.speed = 0;
    const W = G.W;
    const m = W.byId[W.sect.masterId];

    // 1. Open Southern River Dock building sheet and verify Fishing Zone Ecology card
    UI.openBuilding('river_dock');
    const bldHtml = document.getElementById('shBody').innerHTML;
    const hasZoneEcology = bldHtml.includes('นิเวศแหล่งน้ำและประชากรปลา') && bldHtml.includes('90.0%') && bldHtml.includes('10.0%');

    // Trigger fish-at-zone action
    UI.doAction('fish-at-zone', 'river_central');
    const isFishingAct = m.act && m.act.id === 'riverFish';

    // 2. Seed fish (T1..T5), cooked dish, mystery container, and river trash into personal bag
    m.inv.mats.MAT_FISH_SILVER_CARP_1 = 2;
    m.inv.mats.MAT_FISH_JADE_KOI_3 = 1;
    m.inv.mats.MAT_FISH_DRAGON_WHISKER_CARP_5 = 1;
    m.inv.mats.FOOD_STEAMED_SPIRIT_FISH = 1;
    m.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER = 1;
    m.inv.mats.TRASH_RIVER_DEBRIS = 2;
    m.h.state.satiety = 50;

    UI.setInvViewMode('grid');
    UI.openNpc(m.id);
    UI.doAction('bag-cat', 'ALL');

    // Select mystery container and verify atlas cell 70 + open button
    UI.doAction('bag-sel', 'MAT:ITEM_MYSTERY_RIVER_CONTAINER');
    const detailPanel = document.querySelector('.inv-detail-panel');
    const containerAtlasCell = detailPanel ? detailPanel.querySelector('.inv-atlas-ic')?.getAttribute('data-atlas-cell') : null;
    UI.doAction('open-bag-container', m.id);
    const containerRemaining = m.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER || 0;

    // Select steamed fish dish and eat it via UI action
    UI.doAction('bag-sel', 'MAT:FOOD_STEAMED_SPIRIT_FISH');
    const dishAtlasCell = document.querySelector('.inv-detail-panel .inv-atlas-ic')?.getAttribute('data-atlas-cell');
    UI.doAction('eat-bag-dish', m.id + '|FOOD_STEAMED_SPIRIT_FISH');
    const hasFoodBuff = !!(m.foodBuff && m.foodBuff.id === 'food_nourish');

    // Select raw fish and cook it via UI action
    UI.doAction('bag-sel', 'MAT:MAT_FISH_SILVER_CARP_1');
    const fishAtlasCell = document.querySelector('.inv-detail-panel .inv-atlas-ic')?.getAttribute('data-atlas-cell');
    UI.doAction('cook-bag-fish', m.id + '|MAT_FISH_SILVER_CARP_1');
    const cookedDishCount = m.inv.mats.FOOD_STEAMED_SPIRIT_FISH || 0;

    // Discard trash via UI action
    UI.doAction('discard-bag-trash', m.id);
    const trashRemaining = m.inv.mats.TRASH_RIVER_DEBRIS || 0;

    const shBody = document.getElementById('shBody');
    const horizOverflow = shBody.scrollWidth > shBody.clientWidth + 2;

    return {
      hasZoneEcology,
      isFishingAct,
      containerAtlasCell,
      containerRemaining,
      dishAtlasCell,
      hasFoodBuff,
      fishAtlasCell,
      cookedDishCount,
      trashRemaining,
      horizOverflow
    };
  });

  await b.close();

  assert.strictEqual(pageErrors.length, 0, 'Zero page errors allowed: ' + pageErrors.join('; '));
  assert.strictEqual(consoleErrors.length, 0, 'Zero console errors allowed: ' + consoleErrors.join('; '));
  assert.strictEqual(uiAudit.hasZoneEcology, true, 'River dock building sheet must display Fishing Zone Ecology & 90/10 probabilities');
  assert.strictEqual(uiAudit.isFishingAct, true, 'Clicking fish-at-zone must start riverFish action');
  assert.strictEqual(uiAudit.containerAtlasCell, '70', 'Mystery container must use atlas cell 70');
  assert.strictEqual(uiAudit.containerRemaining, 0, 'Opening container via UI must consume the container');
  assert.strictEqual(uiAudit.dishAtlasCell, '69', 'Cooked fish dish must use atlas cell 69');
  assert.strictEqual(uiAudit.hasFoodBuff, true, 'Eating fish dish via UI must apply food_nourish buff');
  assert.strictEqual(uiAudit.fishAtlasCell, '64', 'Tier 1 fish must use atlas cell 64');
  assert.strictEqual(uiAudit.cookedDishCount, 1, 'Cooking fish via UI must produce cooked fish dish');
  assert.strictEqual(uiAudit.trashRemaining, 0, 'Discarding river trash via UI must remove trash');
  assert.strictEqual(uiAudit.horizOverflow, false, 'Zero horizontal overflow on 360x800 mobile viewport');
  console.log('    PASS: Headless Chromium UI verification passed with 0 errors and 0 overflow.');
  console.log('ALL SOUTHERN RIVER & FISHING TESTS PASSED.');
})().catch(e => {
  console.error(e);
  process.exit(1);
});

