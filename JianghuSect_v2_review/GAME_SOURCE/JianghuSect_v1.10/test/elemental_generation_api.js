'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, ELEM, U } = G;

assert.strictEqual(ELEM.normalizeTag('fire').element, 'FIRE');
assert.strictEqual(ELEM.normalizeTag(' Water ').element, 'WATER_ICE');
assert.strictEqual(ELEM.normalizeTag('five_elements').composite, 'FIVE_ELEMENTS');
assert.strictEqual(ELEM.normalizeTag(' none ').element, 'NEUTRAL');
assert.strictEqual(ELEM.normalizeTag('Neutral').element, 'NEUTRAL');
assert.strictEqual(ELEM.normalizeTag('mystery_element').ok, false, 'unknown tags must remain strict');

const W = SIM.create('elemental-generation-api');
const built = SIM.buildNpc(W, new U.RNG('force-elements-buildNpc'), {
  id: 'forced_element_build', stage: 0, forceRootCount: 2,
  forceElements: ['WIND', 'FIRE'], forceGrades: ['TRUE', 'SPIRIT']
});
assert.deepStrictEqual(built.h.root.elements, ['WIND', 'FIRE']);
assert.deepStrictEqual(built.h.root.grades, ['TRUE', 'SPIRIT']);

const added = SIM.addNpc(W, {
  stage: 0, forceRootCount: 2,
  forceElements: ['WOOD_LIFE', 'LIGHTNING'], forceGrades: ['HEAVENLY', 'MORTAL']
});
assert.deepStrictEqual(added.h.root.elements, ['WOOD_LIFE', 'LIGHTNING']);
assert.deepStrictEqual(added.h.root.grades, ['HEAVENLY', 'MORTAL']);

// Grades are mapped to final root slots, even when a partial forced element list
// is completed by deterministic generation.
const partial = SIM.buildNpc(W, new U.RNG('force-elements-partial-buildNpc'), {
  id: 'forced_element_partial', stage: 0,
  forceRootCount: 3,
  forceElements: ['FIRE'],
  forceGrades: ['HEAVENLY', 'TRUE', 'SPIRIT']
});
assert.strictEqual(partial.h.root.rootCount, 3);
assert.strictEqual(partial.h.root.elements[0], 'FIRE');
assert.deepStrictEqual(partial.h.root.grades, ['HEAVENLY', 'TRUE', 'SPIRIT']);
assert(ELEM.isCanonicalRootObject(partial.h.root), 'partial forced roots must produce a canonical root object');

const filtered = ELEM.rollBirthRoots(new U.RNG('force-elements-filtered'), {
  forceRootCount: 3,
  forceElements: ['FIRE', 'FIRE', 'ASTRAL'],
  forceGrades: ['TRUE', 'SPIRIT', 'MORTAL']
});
assert.strictEqual(filtered.rootCount, 3);
assert.deepStrictEqual(filtered.grades, ['TRUE', 'SPIRIT', 'MORTAL']);
assert.strictEqual(new Set(filtered.elements).size, 3);

console.log('PASS elemental generation API: normalized case-insensitive tags and deterministic forced roots work through SIM.buildNpc and SIM.addNpc');
