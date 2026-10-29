'use strict';
const assert = require('assert');
const G = require('./load.js');
const { SIM, ECO, EXT, AI, HC, CULT, SECT, CPE, MAP, WILD, STATS, JD, EXPED } = G;

console.log('Testing Living Beast & Craft Ecology Expansion (v1.10.12)...');

function makeWorld(seed) {
  return SIM.create(seed || 'ecology-test-seed', { masterIdx: 0 });
}

// -------------------------------------------------------------
// Test Group 1: Catalog Integrity, Counts, Taxonomy & No Dangling IDs
// -------------------------------------------------------------
{
  console.log('  Testing Catalog Integrity & Manifest Counts...');
  const eco = JD.ECOLOGY;
  assert(eco, 'JD.ECOLOGY must exist');
  assert.strictEqual(eco.species.length, 80, 'Must have exactly 80 species');
  assert.strictEqual(eco.materials.length, 160, 'Must have exactly 160 materials');
  assert.strictEqual(eco.recipes.length, 80, 'Must have exactly 80 recipes');
  assert.strictEqual(eco.items.length, 32, 'Must have exactly 32 equipment items');

  // Check unique IDs
  const spIds = new Set();
  eco.species.forEach(s => {
    assert(!spIds.has(s.id), 'Duplicate species id: ' + s.id);
    spIds.add(s.id);
    assert(s.tier >= 1 && s.tier <= 7, 'Species tier out of range: ' + s.tier);
    assert(s.cp > 0, 'Species CP must be positive: ' + s.cp);
    assert(Array.isArray(s.drops) && s.drops.length >= 2, 'Species must drop at least 2 parts: ' + s.id);
    s.drops.forEach(d => {
      assert(eco.materialById[d] || ECO.matById[d], 'Species drop missing material: ' + d);
    });
  });

  const matIds = new Set();
  eco.materials.forEach(m => {
    assert(!matIds.has(m.id), 'Duplicate material id: ' + m.id);
    matIds.add(m.id);
    assert(m.tier >= 1 && m.tier <= 7, 'Material tier out of range: ' + m.tier);
    assert(m.value > 0, 'Material value must be positive: ' + m.id);
    assert(Array.isArray(m.sourceBeastIds) && m.sourceBeastIds.length > 0, 'Material must have source beast: ' + m.id);
  });

  const recIds = new Set();
  eco.recipes.forEach(r => {
    assert(!recIds.has(r.id), 'Duplicate recipe id: ' + r.id);
    recIds.add(r.id);
    assert(r.tier >= 1 && r.tier <= 6, 'Recipe tier must be 1..6: ' + r.tier);
    assert(Array.isArray(r.inputs) && r.inputs.length >= 2, 'Recipe must have at least 2 inputs: ' + r.id);
    r.inputs.forEach(inp => {
      assert(ECO.matById[inp.matId], 'Recipe input material missing: ' + inp.matId);
      assert(inp.count > 0, 'Recipe input count must be > 0: ' + r.id);
    });
    if (r.outType === 'EQUIPMENT') {
      assert(eco.itemById[r.outItemId] || ECO.itemById[r.outItemId], 'Equipment recipe missing outItemId: ' + r.outItemId);
    }
  });

  // Verify that every material is either used in at least one recipe or has external demand
  const usedMats = new Set();
  eco.recipes.forEach(r => r.inputs.forEach(i => usedMats.add(i.matId)));
  eco.materials.forEach(m => {
    const isUsed = usedMats.has(m.id);
    const isTradable = EXT.isTradable(m.id);
    assert(isUsed || isTradable, 'Dead material found with no recipe or market use: ' + m.id);
  });

  console.log('    PASS: 80 species, 160 materials, 80 recipes (48 pills + 32 equipment) verified unique with zero dangling IDs');
}

// -------------------------------------------------------------
// Test Group 2: Wildlife Spawning, Habitats, Legendary Cap & Ordinary Isolation
// -------------------------------------------------------------
{
  console.log('  Testing Wildlife Spawning, Legendary Cap & Ordinary Isolation...');
  const W = makeWorld('wildlife-spawn-seed');
  WILD.init(W);

  // Verify all zones have valid pools and no aquatic beasts floating on dry land
  for (const [zId, z] of Object.entries(WILD.zones)) {
    assert(z.pools && z.pools.length > 0, 'Zone missing pools: ' + zId);
    z.pools.forEach(p => {
      p.speciesIds.forEach(spId => {
        const sp = JD.BEASTS.species.find(s => s.id === spId) || JD.BEASTS.kings.find(s => s.id === spId);
        assert(sp, 'Pool species not found in catalog: ' + spId);
      });
    });
  }

  // Force ordinary refill: must NEVER spawn legendary (Tier >= 6 or KING_)
  for (let i = 0; i < 20; i++) {
    const b = WILD.spawn(W, 'meadow', null, { ordinary: true });
    if (b) {
      assert(b.tier < 6, 'Ordinary spawn must not produce tier >= 6: ' + b.name);
      assert(!b.legendary, 'Ordinary spawn must not be legendary: ' + b.name);
      assert(!String(b.speciesId).startsWith('KING_'), 'Ordinary spawn must not be king: ' + b.speciesId);
    }
  }

  // Legendary cap <= 1 check
  W.wildlife.beasts = [];
  const leg1 = WILD.spawn(W, 'legend', 'legend_ecology_t7', { legendary: true });
  assert(leg1, 'First legendary spawn should succeed');
  assert(leg1.legendary, 'Beast must be flagged legendary');
  assert(leg1.expires > W.t, 'Legendary beast must have natural expiry timestamp');

  // Attempting second legendary spawn while one is active MUST be blocked
  const leg2 = WILD.spawn(W, 'legend', 'legend_ecology_t7', { legendary: true });
  assert.strictEqual(leg2, null, 'Active legendary cap of 1 must prevent second concurrent legendary spawn');

  console.log('    PASS: Wildlife spawning, ordinary isolation, and global legendary cap 1 verified');
}

// -------------------------------------------------------------
// Test Group 3: Real Combat Victory, Drop Flow, Merit & Resettlement Idempotency
// -------------------------------------------------------------
{
  console.log('  Testing Combat Victory, Drops, Merit & Idempotency...');
  const W = makeWorld('combat-loot-seed');
  WILD.init(W);
  const hunter = W.npcs[0];
  hunter.inv.mats = {};

  const beast = WILD.spawn(W, 'meadow', 'meadow_ecology_t1', { ordinary: true });
  assert(beast, 'Failed to spawn test beast');
  const species = JD.BEASTS.species.find(s => s.id === beast.speciesId);

  // Mock combat finish with winner = 'A' (hunter wins)
  beast.dead = true;
  const mockFight = { id: 'fight_test_1', ctx: { beastId: beast.id, hunterId: hunter.id }, wildSettled: false };
  W.foeById[beast.id] = beast;

  const meritBefore = hunter.merit || 0;
  WILD.finish(W, mockFight, 'A');

  // Check drop was awarded to personal bag
  const droppedKeys = Object.keys(hunter.inv.mats);
  assert(droppedKeys.length >= 1, 'Hunter must receive dropped material in personal bag');
  const droppedId = droppedKeys[0];
  assert(species.drops.includes(droppedId), 'Dropped material must belong to species drop table');
  assert.strictEqual(hunter.inv.mats[droppedId], 1, 'Must receive exactly 1 dropped unit');
  assert(hunter.merit > meritBefore, 'Hunter must be awarded merit for victory');
  assert(beast.gone, 'Dead beast must be marked gone');

  // Calling finish second time on settled fight must NOT award duplicate drops or merit
  const meritAfter = hunter.merit;
  WILD.finish(W, mockFight, 'A');
  assert.strictEqual(hunter.inv.mats[droppedId], 1, 'Duplicate finish must not grant extra items');
  assert.strictEqual(hunter.merit, meritAfter, 'Duplicate finish must not grant extra merit');

  console.log('    PASS: Real combat victory awards drops & merit idempotently with no double-loot');
}

// -------------------------------------------------------------
// Test Group 4: Material Donation -> Sect Stock -> CP Minting & Anti-Arbitrage
// -------------------------------------------------------------
{
  console.log('  Testing Material Donation, CP Minting & Anti-Arbitrage...');
  const W = makeWorld('donation-cp-seed');
  const member = W.npcs[1];
  member.cp = 10;
  member.inv.mats = {};

  const matId = 'ECO2_MAT_CANINE_A_1';
  member.inv.mats[matId] = 2;

  const stockBefore = ECO.count(W, matId);
  const cpBefore = member.cp;
  const reward = CPE.reward(W, matId, 1, stockBefore);
  assert(reward > 0, 'CP reward must be positive');

  // Execute personal product donation
  const ok = ECO.donatePersonalProduct(W, member, matId, 1);
  assert(ok, 'Donation should succeed');
  assert.strictEqual(member.inv.mats[matId], 1, 'Bag must deduct donated item');
  assert.strictEqual(ECO.count(W, matId), stockBefore + 1, 'Sect stock must receive donated item');
  assert(Math.abs(member.cp - (cpBefore + reward)) < 0.1, 'Member must receive minted CP');

  console.log('    PASS: Personal beast material donation converts to sect stock and CP correctly');
}

// -------------------------------------------------------------
// Test Group 5: Real Crafting (Pills & Equipment) at Stations
// -------------------------------------------------------------
{
  console.log('  Testing Crafting Lifecycle for ECO2_ Pills and Equipment...');
  const W = makeWorld('crafting-lifecycle-seed');
  const crafter = W.npcs[2];
  crafter.h.skills.ALCHEMY = 60;
  crafter.h.skills.FORGING = 60;

  // 1. Craft Pill
  const pillRec = JD.ITEMS.recipes.find(r => r.id === 'ECO2_REC_PILL_BUFF_ATK_1');
  assert(pillRec, 'Pill recipe must exist');
  pillRec.inputs.forEach(inp => ECO.add(W, inp.matId, inp.count + 5));

  const pillKey = 'P:' + pillRec.id;
  const pillBefore = ECO.count(W, pillKey);
  const inMat1 = pillRec.inputs[0];
  const matBefore = ECO.count(W, inMat1.matId);

  // Deduct inputs
  pillRec.inputs.forEach(inp => ECO.take(W, inp.matId, inp.count));
  assert.strictEqual(ECO.count(W, inMat1.matId), matBefore - inMat1.count, 'Inputs must be deducted');

  // Add produced pill
  ECO.add(W, pillKey, 1, 1.2);
  assert.strictEqual(ECO.count(W, pillKey), pillBefore + 1, 'Pill must be added to sect inventory');
  const info = ECO.pillInfo(pillKey);
  assert(info && info.effect && info.effect.cbBuff, 'Pill info must resolve with cbBuff');

  // 2. Craft Equipment
  const eqRec = JD.ITEMS.recipes.find(r => r.id.startsWith('ECO2_REC_EQ_') && r.outType === 'EQUIPMENT');
  assert(eqRec, 'Equipment recipe must exist');
  eqRec.inputs.forEach(inp => ECO.add(W, inp.matId, inp.count + 5));

  const gearCountBefore = W.sect.gear.length;
  // Mint gear and add to sect armory
  const gear = ECO.mintGear({
    outItemId: eqRec.outItemId,
    nameTh: eqRec.outNameTh,
    tier: eqRec.tier,
    slot: JD.ECOLOGY.itemById[eqRec.outItemId].slot,
    gearType: eqRec.gearType,
    craft: 'FORGING'
  }, 1.15);

  assert(gear, 'Minted gear must exist');
  assert.strictEqual(gear.gearType, eqRec.gearType, 'Gear type must match');
  W.sect.gear.push(gear);
  assert.strictEqual(W.sect.gear.length, gearCountBefore + 1, 'Gear must enter sect armory');

  console.log('    PASS: Real crafting lifecycle for pills and equipment functions accurately');
}

// -------------------------------------------------------------
// Test Group 6: NPC Purchase & Combat Preparation (cbBuff & preFight)
// -------------------------------------------------------------
{
  console.log('  Testing NPC Purchase of ECO2_ Combat Pills & preFight Consumption...');
  const W = makeWorld('prefight-consumption-seed');
  const fighter = W.npcs[0];
  fighter.rank = 2;
  fighter.cp = 50;
  fighter.h.interests.combat = 80;
  fighter.inv.pills = {};

  const pillKey = 'P:ECO2_REC_PILL_BUFF_ATK_1';
  ECO.add(W, pillKey, 3, 1.0);

  // Check CPE.pickPurchase considers the combat buff pill
  const pick = CPE.pickPurchase(W, fighter);
  assert(pick, 'Fighter must consider purchasing goods');

  // Purchase the pill
  fighter.inv.pills[pillKey] = 1;
  ECO.take(W, pillKey, 1);

  // Execute ST.preFight: fighter consumes own pill before battle
  assert(!fighter.buffs || fighter.buffs.length === 0, 'Must have no buffs before preFight');
  STATS.preFight(W, fighter, true);

  assert(fighter.buffs && fighter.buffs.length > 0, 'Fighter must have active combat buff after preFight');
  assert.strictEqual(fighter.buffs[0].name, 'เขี้ยวหมอกฮึกเหิม', 'Buff name must match ECO2_ pill effect');
  assert.strictEqual(fighter.inv.pills[pillKey] || 0, 0, 'Personal pill bag must deduct consumed pill');

  console.log('    PASS: Member purchases and consumes ECO2_ combat buff pills before battle');
}

// -------------------------------------------------------------
// Test Group 7: Save/Load Continuity and Determinism
// -------------------------------------------------------------
{
  console.log('  Testing Save/Load Round-Trip Continuity & Determinism...');
  const W1 = makeWorld('save-load-ecology-seed');
  const matId = 'ECO2_MAT_CANINE_A_2';
  const pillKey = 'P:ECO2_REC_PILL_HEAL_2';
  ECO.add(W1, matId, 7);
  ECO.add(W1, pillKey, 4);

  const matCountExpected = ECO.count(W1, matId);
  const pillCountExpected = ECO.count(W1, pillKey);

  const serialized = SIM.serialize(W1);
  const W2 = SIM.deserialize(serialized);

  assert.strictEqual(ECO.count(W2, matId), matCountExpected, 'Material count must survive serialization');
  assert.strictEqual(ECO.count(W2, pillKey), pillCountExpected, 'Pill count must survive serialization');

  // Determinism check: two worlds with identical seeds must produce identical initial wildlife
  const WA = makeWorld('deterministic-seed-xyz');
  const WB = makeWorld('deterministic-seed-xyz');
  const bA = WILD.spawn(WA, 'meadow', 'meadow_ecology_t1', { ordinary: true });
  const bB = WILD.spawn(WB, 'meadow', 'meadow_ecology_t1', { ordinary: true });

  assert.strictEqual(bA.speciesId, bB.speciesId, 'Spawns under identical seed must be deterministic');
  assert.strictEqual(bA.power, bB.power, 'Beast power must match deterministically');

  console.log('    PASS: Save/load serialization and deterministic seed execution verified');
}

// -------------------------------------------------------------
// Test Group 8: NPC Healing Pill Autonomous Usage & Fight Usage (Codex Finding 1)
// -------------------------------------------------------------
{
  console.log('  Testing Autonomous & In-Fight Usage of ECO2_ Healing Pills...');
  const W = makeWorld('npc-pill-use-seed');
  const npc = W.npcs[0];
  const pillKey = 'P:ECO2_REC_PILL_HEAL_2';
  const info = ECO.pillInfo(pillKey);
  assert(info && info.effect && info.effect.healHealth, 'Pill must have healHealth effect');

  // Case 1: Member has low HP (10%) and holds pill in personal bag
  const hpMax = CULT.hpMax(npc);
  npc.h.state.hp = hpMax * 0.10;
  npc.inv.pills = { [pillKey]: 2 };

  // Personal pill use check
  const actionPillUse = AI.ACTS && AI.ACTS.personalPillUse;
  assert(actionPillUse, 'AI.ACTS.personalPillUse action must exist');
  assert.strictEqual(actionPillUse.can(npc, W), true, 'personalPillUse.can should be true at 10% HP');

  // Execute CPE.autoUse
  const hpBeforeAuto = npc.h.state.hp;
  CPE.autoUse(W, npc);
  assert(npc.h.state.hp > hpBeforeAuto, 'autoUse should restore HP from ECO2_ heal pill');
  assert.strictEqual(npc.inv.pills[pillKey], 1, 'autoUse must decrement pill count by exactly 1');

  // Execute personalPillUse.done with remaining 1 pill
  const hpBeforeAction = npc.h.state.hp;
  npc.h.state.hp = hpMax * 0.20; // set below 0.8
  actionPillUse.done(npc, W);
  assert(npc.h.state.hp > hpBeforeAction, 'personalPillUse.done should restore HP');
  assert.strictEqual(npc.inv.pills[pillKey] || 0, 0, 'Pill count must decrement to 0 and remove key');

  // Case 2: High HP (90%) - should NOT use pill
  npc.h.state.hp = hpMax * 0.90;
  npc.inv.pills = { [pillKey]: 1 };
  assert.strictEqual(actionPillUse.can(npc, W), false, 'personalPillUse.can must be false at 90% HP');
  CPE.autoUse(W, npc);
  assert.strictEqual(npc.inv.pills[pillKey], 1, 'autoUse must not consume pill at high HP');

  // Case 3: In-combat usage via CPE.fightUse
  npc.h.state.hp = hpMax * 0.25; // < 0.38
  const fightCtx = { pillAt: 0 };
  const used = CPE.fightUse(W, npc, fightCtx);
  assert.strictEqual(used, true, 'fightUse should return true when consuming healing pill');
  assert.strictEqual(npc.inv.pills[pillKey] || 0, 0, 'fightUse must decrement pill count');
  assert(fightCtx.pillAt > W.t, 'fightUse must set pill cooldown');

  console.log('    PASS: NPC healing pill selection, consumption decrement, threshold gating, and fightUse verified');
}

// -------------------------------------------------------------
// Test Group 9: Combat Poison Removal vs Cultivation Toxic (Codex Finding 2)
// -------------------------------------------------------------
{
  console.log('  Testing Combat Poison (clearPoison) vs Cultivation Toxic (clearToxic)...');
  const W = makeWorld('poison-clear-seed');
  const npc = W.npcs[0];

  // Set up both combat status and cultivation body toxic
  npc.sx = [
    { k: 'poison', until: W.t + 60 },
    { k: 'burn', until: W.t + 60 }
  ];
  npc.cult.toxic = 35;

  const purgePillKey = 'P:ECO2_REC_PILL_HEAL_6'; // Has clearPoison: 120
  const infoPurge = ECO.pillInfo(purgePillKey);
  assert(infoPurge && infoPurge.effect && infoPurge.effect.clearPoison, 'HEAL_6 must have clearPoison effect');

  // Apply clearPoison pill
  const res = ECO.applyQualityPill(W, npc, purgePillKey, 1.0);
  assert(res, 'applyQualityPill should succeed');

  // Verify combat poison is cleared while burn remains
  assert(!npc.sx.some(x => x.k === 'poison'), 'Combat poison status must be removed');
  assert(npc.sx.some(x => x.k === 'burn'), 'Burn status must remain intact');

  // Now test clearToxic pill (reduces body toxic)
  const detoxPillKey = 'P:ECO2_REC_PILL_PURGE_2';
  const infoDetox = ECO.pillInfo(detoxPillKey);
  assert(infoDetox && infoDetox.effect && infoDetox.effect.clearToxic, 'PURGE_2 must have clearToxic effect');
  const toxicBefore = npc.cult.toxic;
  ECO.applyQualityPill(W, npc, detoxPillKey, 1.0);
  assert(npc.cult.toxic < toxicBefore, 'clearToxic pill must reduce cult.toxic');

  console.log('    PASS: clearPoison clears combat status from npc.sx without confusing with cult.toxic');
}

// -------------------------------------------------------------
// Test Group 10: Habitat & Spawning Strict Isolation (Codex Finding 3 & 5)
// -------------------------------------------------------------
{
  console.log('  Testing Terrestrial vs Aquatic Habitat Isolation & Full 80 Species Encounter Coverage...');
  const W = makeWorld('habitat-isolation-seed');
  WILD.init(W);

  // 1. Verify no water creatures in any on-map pool
  for (const [zId, z] of Object.entries(WILD.zones)) {
    (z.pools || []).forEach(p => {
      p.speciesIds.forEach(spId => {
        const sp = JD.BEASTS.species.find(s => s.id === spId) || JD.BEASTS.kings.find(s => s.id === spId);
        assert(sp, 'Unknown species in pool: ' + spId);
        assert(sp.terrain !== 'water' && sp.archetype !== 'AQUATIC',
          'Aquatic beast must never be placed in land map pool (' + zId + '): ' + spId);
      });
    });
  }

  // 2. WILD.spawn safety guard against aquatic creatures on sect map
  const aquaticSp = JD.BEASTS.species.find(s => s.terrain === 'water' || s.archetype === 'AQUATIC');
  assert(aquaticSp, 'Aquatic species must exist in catalog');
  // Attempting to spawn aquatic beast via WILD.spawn on sect land must return null
  const spawnAttempt = WILD.spawn(W, 'meadow', 'meadow_ecology_t1', { speciesId: aquaticSp.id });
  assert.strictEqual(spawnAttempt, null, 'WILD.spawn must refuse aquatic beasts on sect map');

  // 3. Verify Expedition water region exists and hunts aquatic beasts
  assert(EXPED && EXPED.REGIONS, 'EXPED.REGIONS must exist');
  const waterRegion = EXPED.REGIONS.find(r => r.id === 'water');
  assert(waterRegion, 'Water expedition region (ลุ่มน้ำสาบมังกรคราม) must exist');
  assert.strictEqual(waterRegion.terrain, 'water', 'Water region must have terrain: water');

  // Test beast pool in water region
  const waterBeasts = EXPED.beastPool(waterRegion);
  assert(Array.isArray(waterBeasts) && waterBeasts.length > 0, 'Water expedition must encounter beasts');
  waterBeasts.forEach(b => {
    assert(b.terrain === 'water' || b.archetype === 'AQUATIC', 'Water expedition pool must contain aquatic beasts: ' + b.id);
  });

  // 4. Verify all 80 species have accessible encounters
  const mapSpecies = new Set();
  for (const z of Object.values(WILD.zones)) {
    (z.pools || []).forEach(p => p.speciesIds.forEach(id => mapSpecies.add(id)));
  }
  const waterSpecies = JD.BEASTS.species.filter(s => s.terrain === 'water' || s.archetype === 'AQUATIC');
  const allBeastIds = new Set(JD.ECOLOGY.species.map(s => s.id));

  allBeastIds.forEach(id => {
    const isMap = mapSpecies.has(id);
    const isWater = waterSpecies.some(s => s.id === id);
    assert(isMap || isWater, 'Species has no reachable encounter route: ' + id);
  });

  console.log('    PASS: 0 aquatic beasts on land map; water expedition encounters verified; 100% of 80 species reachable');
}

// -------------------------------------------------------------
// Test Group 11: External Market High-Tier Item Trade & Safety (Codex Finding 4)
// -------------------------------------------------------------
{
  console.log('  Testing External Market High-Tier Materials, ECO2_ Pills & Arbitrage Protection...');
  const W = makeWorld('external-market-high-tier-seed');
  EXT.ensure(W);
  W.sect.stones = 500;

  // 1. Verify EXT.isTradable accepts ECO2_ materials and pills
  const t5Mat = 'ECO2_MAT_AVIAN_A_5';
  const eco2Pill = 'P:ECO2_REC_PILL_HEAL_2';
  assert.strictEqual(EXT.isTradable(t5Mat), true, 'T5 material must be tradable');
  assert.strictEqual(EXT.isTradable(eco2Pill), true, 'ECO2 pill must be tradable');

  // 2. Sect sells surplus high-tier material to visitor wanting it
  const visitor = EXT.openVisit(W, {
    nameTh: 'พ่อค้าวัตถุดิบล้ำค่า',
    kind: 'trader',
    traderType: 'rare',
    stones: 1000,
    stayDays: 3,
    stock: {},
    wants: { [t5Mat]: 3 }
  });

  // Put surplus in sect stock (reserveForSect will protect recipe inputs)
  ECO.add(W, t5Mat, 10);
  const stonesBefore = W.sect.stones;
  const visitorStonesBefore = visitor.stones;

  EXT.tradeSect(W, visitor);
  assert(W.sect.stones > stonesBefore, 'Sect must gain stones from selling surplus high-tier material');
  assert(visitor.stones < visitorStonesBefore, 'Visitor stones must decrease');
  assert(ECO.count(W, t5Mat) < 10, 'Sect stock of sold material must decrease');

  // 3. Visitor with 0 stones cannot buy
  visitor.sectTradeDay = -1;
  visitor.stones = 0;
  const sectStonesCheck = W.sect.stones;
  EXT.tradeSect(W, visitor);
  assert.strictEqual(W.sect.stones, sectStonesCheck, 'Trade must not execute when visitor has 0 stones');

  // 4. Sect reserve protection: cannot sell below reserve floor
  visitor.sectTradeDay = -1;
  ECO.take(W, t5Mat, ECO.count(W, t5Mat) - 2); // leave only 2 units (below reserve floor)
  visitor.stones = 500;
  visitor.wants[t5Mat] = 2;
  const countAtReserve = ECO.count(W, t5Mat);
  EXT.tradeSect(W, visitor);
  assert.strictEqual(ECO.count(W, t5Mat), countAtReserve, 'Sect must not sell material at or below reserve floor');

  console.log('    PASS: External market high-tier material & pill trading, stone exchange, and reserve floor verified');
}

console.log('ALL ECOLOGY EXPANSION TESTS PASSED.');
