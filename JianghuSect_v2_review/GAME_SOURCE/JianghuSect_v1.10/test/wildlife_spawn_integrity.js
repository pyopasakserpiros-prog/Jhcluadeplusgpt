'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, WILD, JD, ECO } = G;

console.log('Testing wildlife spawn habitat, pool, tier, and rarity integrity...');

const allSpecies = (JD.BEASTS.species || []).concat(JD.BEASTS.kings || []);
const speciesById = new Map(allSpecies.map(s => [s.id, s]));

// Catalog invariant: every species assigned to a pool must actually be valid for that pool.
let poolSpeciesCount = 0;
for (const [zoneId, zone] of Object.entries(WILD.zones)) {
  for (const pool of zone.pools || []) {
    for (const speciesId of pool.speciesIds || []) {
      poolSpeciesCount++;
      const species = speciesById.get(speciesId);
      assert(species, `${zoneId}/${pool.id} references missing species ${speciesId}`);
      assert(species.terrain !== 'water' && species.archetype !== 'AQUATIC', `${speciesId} is aquatic but assigned to a land pool`);
      assert(species.tier >= pool.min && species.tier <= pool.max,
        `${zoneId}/${pool.id} tier range ${pool.min}-${pool.max} excludes ${speciesId} T${species.tier}`);
      assert(Array.isArray(species.drops) && species.drops.some(id => ECO.matById[id]), `${speciesId} has no valid material drop`);
    }
  }
}
assert(poolSpeciesCount > 0);
console.log(`  PASS: ${poolSpeciesCount} pool species references match their declared tier, habitat, and drop data`);

// Explicitly targeted species must not bypass the selected pool or zone tier.
{
  const W = SIM.create('wildlife-explicit-pool-guard');
  assert.strictEqual(
    WILD.spawn(W, 'meadow', 'meadow_ecology_t1', { speciesId: 'ECO2_BEAST_MYTHIC_1' }),
    null,
    'A tier-7 mythic beast must not spawn in a tier-1 meadow pool'
  );
  assert.strictEqual(
    WILD.spawn(W, 'meadow', 'meadow_ecology_t1', { speciesId: 'BEAST_IRON_BOAR' }),
    null,
    'A species outside the selected pool must not be forced into it'
  );
  assert.strictEqual(
    WILD.spawn(W, 'meadow', 'missing_pool_id', { speciesId: 'ECO2_BEAST_CANINE_1' }),
    null,
    'An invalid explicit pool ID must fail closed instead of selecting a random pool'
  );
  assert.strictEqual(
    WILD.spawn(W, 'meadow', 'meadow_ecology_t1', { legendary: true, speciesId: 'ECO2_BEAST_CANINE_1' }),
    null,
    'An ordinary species must not satisfy a legendary-only request'
  );
  assert.strictEqual(
    WILD.spawn(W, 'legend', 'legend_ecology_t7', { ordinary: true, speciesId: 'ECO2_BEAST_MYTHIC_1' }),
    null,
    'A legendary pool must not be used for an ordinary refill'
  );
  const valid = WILD.spawn(W, 'meadow', 'meadow_ecology_t1', { speciesId: 'ECO2_BEAST_CANINE_1' });
  assert(valid, 'A valid species explicitly belonging to the selected pool should still spawn');
  assert.strictEqual(valid.speciesId, 'ECO2_BEAST_CANINE_1');
  assert.strictEqual(valid.tier, 1);
  assert.strictEqual(valid.zone, 'meadow');
  assert.strictEqual(valid.pool, 'meadow_ecology_t1');
  console.log('  PASS: targeted spawns enforce zone, pool, tier, and ordinary/legendary constraints');
}

// An empty named pool must not silently turn into an unrelated species from the same zone.
{
  const W = SIM.create('wildlife-empty-pool-no-substitution');
  WILD.zones.__test_empty_pool = {
    id: '__test_empty_pool', nameTh: 'test', x0: 38, x1: 96, y0: 139, y1: 153,
    min: 1, max: 2,
    pools: [{ id: 'empty_named_pool', nameTh: 'empty', min: 1, max: 2, speciesIds: ['SPECIES_THAT_DOES_NOT_EXIST'], weight: 1 }]
  };
  try {
    const result = WILD.spawn(W, '__test_empty_pool', 'empty_named_pool');
    assert.strictEqual(result, null, 'An empty named pool must return null, not substitute another species');
    assert.strictEqual(W.wildlife.beasts.length, 0, 'Failed pool resolution must not create an unrelated beast');
  } finally {
    delete WILD.zones.__test_empty_pool;
  }
  console.log('  PASS: empty named pools fail safely without losing habitat identity');
}

// The west-grove blood fiend hound is tier 4 and must now be eligible in its own pool.
{
  const pool = WILD.zones.west_grove.pools.find(p => p.id === 'west_hound_pool');
  const hound = speciesById.get('BEAST_BLOOD_FIEND_HOUND_4');
  assert(pool && hound);
  assert(hound.tier >= pool.min && hound.tier <= pool.max, 'Tier-4 blood fiend hound must be eligible for west_hound_pool');
  assert.strictEqual(pool.max, 4);
  console.log('  PASS: tier-4 blood fiend hound is no longer excluded by its pool range');
}

console.log('ALL WILDLIFE SPAWN INTEGRITY TESTS PASSED.');
