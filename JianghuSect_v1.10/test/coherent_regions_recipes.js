'use strict';
const assert = require('assert');
const G = require('./load.js');

const { CONTENT: C, JD, SIM, ECO, CULT, EXPED: X, AI, CPE } = G;
const D = JD.EXPANSION;

// 1. CONTENT.validate() must pass with zero errors
const validationErrors = C.validate();
assert.deepStrictEqual(validationErrors, [], 'CONTENT.validate() must pass with zero errors');

// 2. Region, Recipe, Beast, and Material Counts
assert.strictEqual(D.regions.length, 6, 'Must have exactly 6 coherent destination regions');
assert.strictEqual(D.recipes.length, 14, 'Must have exactly 14 dependency-complete recipes');
assert.strictEqual(D.materials.length, 40, 'Must have exactly 40 closed-loop materials');
assert.strictEqual(D.beasts.length, 10, 'Must have exactly 10 authentic regional beast species');
assert.strictEqual(D.techniques.length, 9, 'Must have 9 combat techniques across 3 specialization tracks');

// 3. Dependency Completeness & No Unsupported FORM/ORGAN IDs
for (const r of D.recipes) {
  assert(['ALCHEMY', 'FORGING', 'ARRAY', 'TALISMAN'].includes(r.craft), 'Craft must be supported: ' + r.id);
  assert(['PILL', 'EQUIPMENT'].includes(r.outType), 'Output must be PILL or EQUIPMENT: ' + r.id);
  assert(r.inputs.length > 0, 'Recipe must have inputs: ' + r.id);
  for (const inp of r.inputs) {
    assert(!inp.matId.includes('FORM'), 'Recipe must not contain unsupported FORM ID: ' + r.id + ' -> ' + inp.matId);
    assert(!inp.matId.includes('ORGAN'), 'Recipe must not contain unsupported ORGAN ID: ' + r.id + ' -> ' + inp.matId);
    const m = ECO.matById[inp.matId];
    assert(m, 'Input material must exist in ECO.matById: ' + inp.matId);
    assert(Number.isSafeInteger(inp.count) && inp.count > 0, 'Input count must be positive integer');
  }
}

// 4. Closed-Loop Economy: 100% Acquisition and 100% Consumption
const acquiredMaterials = new Set();
for (const reg of D.regions) {
  for (const res of reg.resources) {
    acquiredMaterials.add(res.id);
    assert(ECO.matById[res.id], 'Resource in region must exist in ECO: ' + res.id);
    assert(res.cap > 0 && res.regen > 0, 'Resource cap and regen must be positive');
    assert(['hunt', 'gather'].includes(res.kind), 'Resource kind must be hunt or gather: ' + res.kind);
  }
}

const consumedMaterials = new Set();
for (const r of D.recipes) {
  for (const inp of r.inputs) {
    consumedMaterials.add(inp.matId);
  }
}

// Every imported material must have an acquisition route
for (const m of D.materials) {
  assert(acquiredMaterials.has(m.id), 'Material missing acquisition route: ' + m.id);
}

// Every imported material must have a consumption route (in a recipe)
for (const m of D.materials) {
  assert(consumedMaterials.has(m.id), 'Material missing consumption route: ' + m.id);
}

// Exact set match: no uncraftable inputs, no useless ingredients
assert.strictEqual(acquiredMaterials.size, D.materials.length, 'Acquired materials must equal total expansion materials');
assert.strictEqual(consumedMaterials.size, D.materials.length, 'Consumed materials must equal total expansion materials');

// 5. Authentic Species Drops & Habitat Ecology
const beastById = new Map(D.beasts.map(b => [b.id, b]));
for (const reg of D.regions) {
  const huntResources = reg.resources.filter(r => r.kind === 'hunt');
  const residentBeasts = (reg.beasts || []).map(id => beastById.get(id)).filter(Boolean);

  if (huntResources.length > 0) {
    assert(residentBeasts.length > 0, 'Region with hunt resources must have resident beasts: ' + reg.id);
  }

  // Every resident beast must drop at least one hunt resource in this region
  for (const b of residentBeasts) {
    assert(b.drops.length > 0, 'Beast must have non-empty drops: ' + b.id);
    for (const d of b.drops) {
      assert.strictEqual(ECO.matById[d].category, 'BEAST_PART', 'Drop must be BEAST_PART: ' + d);
    }
    const matchingDrops = b.drops.filter(d => huntResources.some(hr => hr.id === d));
    assert(matchingDrops.length > 0, 'Beast ' + b.id + ' in ' + reg.id + ' must drop at least one regional hunt resource');
  }

  // Every hunt resource in the region must be dropped by at least one resident beast
  for (const hr of huntResources) {
    const droppers = residentBeasts.filter(b => b.drops.includes(hr.id));
    assert(droppers.length > 0, 'Hunt resource ' + hr.id + ' in ' + reg.id + ' must be dropped by a resident beast');
  }
}

// 6. Expedition Hunt Drop Execution & Authentic Cargo
{
  const W = SIM.create('hunt-simulation');
  const n = W.npcs[0];
  n.h.skills.survival = 80;

  for (const reg of D.regions) {
    if (!reg.beasts || !reg.beasts.length) continue;
    for (const beastId of reg.beasts) {
      const b = beastById.get(beastId);
      const ex = { kind: 'hunt', region: reg.id, journal: [] };
      const out = { mats: {}, pills: {}, gear: [], techs: [], notes: [] };

      const gathered = C.gather(W, ex, [n], out, reg, 'hunt', b);
      assert(gathered, 'Gathering hunt drops from ' + b.nameTh + ' in ' + reg.nameTh + ' must succeed');

      const collectedIds = Object.keys(out.mats);
      assert(collectedIds.length > 0, 'Expedition cargo must receive beast parts from hunt');
      for (const cid of collectedIds) {
        assert(b.drops.includes(cid), 'Hunted material must match beast drop profile: ' + cid);
        assert(reg.resources.some(r => r.id === cid && r.kind === 'hunt'), 'Hunted material must be in region hunt table');
      }
    }
  }
}

// 7. Hunt-Only Destination Behavioral Guardrail
{
  const W = SIM.create('hunt-only-check');
  const n = W.npcs[0];
  n.h.skills.herbalism = 100;
  n.h.skills.mining = 100;

  const frozenReg = D.regions.find(r => r.key === 'frozen');
  assert(frozenReg, 'Frozen route must exist');
  assert(frozenReg.resources.every(r => r.kind === 'hunt'), 'Frozen route must remain strictly hunt-only');
  assert(!frozenReg.resources.some(r => r.kind === 'gather'), 'Frozen route must have zero gather resources');

  // Gatherers autonomously avoid hunt-only destinations
  for (let i = 0; i < 50; i++) {
    const dest = C.chooseRegion(W, [n], 'gather', X.REGIONS);
    assert(dest && dest.key !== 'frozen', 'Gathering expedition must never pick hunt-only frozen route');
  }
}

// 8. Discoverability: All 14 recipes and 9 techniques discoverable in regions
const discoverableRecipes = new Set(D.regions.flatMap(r => r.recipes));
assert.strictEqual(discoverableRecipes.size, D.recipes.length, 'All 14 recipes must be discoverable across regions');
for (const r of D.recipes) {
  assert(discoverableRecipes.has(r.id), 'Recipe must be discoverable in at least one region: ' + r.id);
}

const discoverableTechs = new Set(D.regions.flatMap(r => r.techniques));
assert.strictEqual(discoverableTechs.size, D.techniques.length, 'All 9 techniques must be discoverable across regions');
for (const t of D.techniques) {
  assert(discoverableTechs.has(t.id), 'Technique must be discoverable in at least one region: ' + t.id);
}

// 9. Full Crafting Execution of All 14 Recipes (including cross-region recipes)
{
  let craftedCount = 0;
  for (const r of D.recipes) {
    const W = SIM.create('craft-test-' + r.id);
    const n = W.npcs[0];
    W.sect.recipeTier = 3;
    W.sect.knownRecipes = [r.id];
    n.h.skills[r.craft] = 100;

    // Seed input materials
    for (const inp of r.inputs) {
      ECO.add(W, inp.matId, inp.count);
    }

    const ctx = { rid: r.id };
    const action = r.craft === 'ALCHEMY' ? AI.ACTS.brew : AI.ACTS.forge;
    assert(action.start(n, W, ctx), 'Crafting action must start for ' + r.id);

    // Verify materials deducted
    for (const inp of r.inputs) {
      assert.strictEqual(ECO.count(W, inp.matId), 0, 'Input material must be deducted: ' + inp.matId);
    }

    // Complete craft
    const oldNext = W.rng.next;
    W.rng.next = () => 0.1;
    const out = ECO.finishCraft(W, n, r, ctx);
    W.rng.next = oldNext;
    assert(out.ok, 'Crafting finish must succeed for ' + r.id);

    if (r.outType === 'PILL') {
      assert.strictEqual(out.key, 'P:' + r.id);
      assert.strictEqual(ECO.count(W, out.key), out.n);
    } else {
      assert.strictEqual(W.sect.gear.length, 1);
      assert.strictEqual(W.sect.gear[0].id, r.id);
      assert(W.sect.gear[0].combatMult > 0 || W.sect.gear[0].defMult > 0, 'Minted gear must have combat or def multiplier');
    }

    // Replay rejection
    const beforeState = SIM.serialize(W);
    const secondFinish = ECO.finishCraft(W, n, r, ctx);
    assert(secondFinish.rejected, 'Replaying completed craft receipt must be rejected: ' + r.id);
    assert.strictEqual(SIM.serialize(W), beforeState, 'Replayed craft must not mutate world state');
    craftedCount++;
  }
  assert.strictEqual(craftedCount, 14, 'All 14 recipes must be successfully crafted');
}

// 10. Renewable Regional Supply & Persistence across Serialization
{
  const W = SIM.create('site-renewability');
  const reg = D.regions[0];
  const table = reg.resources[0];
  const site = C.site(W, reg);
  const initialCap = site.stock[table.id];
  assert(initialCap > 0, 'Site stock must be initialized to positive cap');

  // Deplete stock completely
  let taken = 0;
  for (let i = 0; i < initialCap + 10; i++) {
    taken += C.takeResource(W, reg, table.id, 1);
  }
  assert.strictEqual(taken, initialCap, 'Resource extraction capped at available stock');
  assert.strictEqual(site.stock[table.id], 0, 'Resource stock depleted to 0');

  // Advance time by 4 days
  W.day += 4;
  const replenishedSite = C.site(W, reg);
  assert(replenishedSite.stock[table.id] > 0, 'Stock must replenish over time');
  assert(replenishedSite.stock[table.id] <= table.cap, 'Stock replenishment must not exceed cap');

  // Persistence across serialization
  const serialized = SIM.serialize(W);
  const loaded = SIM.deserialize(serialized);
  assert.deepStrictEqual(loaded.world.contentSites, W.world.contentSites, 'Regional content site states must serialize/deserialize losslessly');
}

console.log('PASS coherent_regions_recipes: 6 biomes, 10 beasts, 14 recipes, 40 materials, 100% closed-loop ecology and dependency completeness');
