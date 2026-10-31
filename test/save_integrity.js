'use strict';
const assert = require('assert');
const { SIM, HC, STATS } = require('./load');

const source = SIM.create('save-integrity');
const snapshot = SIM.serialize(source);
let failures = 0;
function test(name, check) {
  try { check(); console.log('PASS ' + name); }
  catch (error) { failures++; console.error('FAIL ' + name + '\n' + error.stack); }
}
function save(change) {
  const raw = JSON.parse(snapshot);
  change(raw);
  return JSON.stringify(raw);
}
function rejectsWithoutChangingCurrentGame(raw) {
  HC.nowDay = 432;
  STATS.now = 622123;
  const before = SIM.serialize(source);
  const age = HC.ageYears(source.npcs[0]);
  assert.throws(() => SIM.deserialize(raw), 'malformed saves must be rejected');
  assert.strictEqual(HC.nowDay, 432, 'a rejected import must preserve the current age clock');
  assert.strictEqual(STATS.now, 622123, 'a rejected import must preserve the current effect clock');
  assert.strictEqual(HC.ageYears(source.npcs[0]), age);
  assert.strictEqual(SIM.serialize(source), before, 'a rejected import must preserve the current world');
}

test('a paused save remains paused after loading', () => {
  const loaded = SIM.deserialize(save(raw => { raw.speed = 0; }));
  assert.strictEqual(loaded.speed, 0);
});
test('missing legacy speed still defaults to normal playback', () => {
  const loaded = SIM.deserialize(save(raw => { delete raw.speed; }));
  assert.strictEqual(loaded.speed, 1);
});
test('a failed map import preserves the running game clocks', () => {
  rejectsWithoutChangingCurrentGame(save(raw => { raw.t = 999999; delete raw.map; }));
});
test('a failure during extension migration preserves the running game clocks', () => {
  rejectsWithoutChangingCurrentGame(save(raw => {
    raw.t = 999999;
    raw.npcs[0].recipes = {};
    raw.sect.recipeAuth[raw.npcs[0].id] = [Object.keys(globalThis.ECO.recipeById)[0]];
  }));
});
for (const [name, change] of [
  ['nonnumeric simulation time', raw => { raw.t = 'bad'; }],
  ['incomplete RNG state', raw => { raw.rng = []; }],
  ['duplicate NPC identities', raw => { raw.npcs.push(raw.npcs[0]); }],
  ['missing log storage', raw => { raw.logs = null; }],
  ['negative playback speed', raw => { raw.speed = -1; }],
  ['missing map seed', raw => { delete raw.seed; }],
  ['missing NPC sequence', raw => { delete raw.seqN; }],
  ['missing log sequence', raw => { delete raw.logSeq; }]
]) test('rejects ' + name + ' without affecting the running game', () => {
  rejectsWithoutChangingCurrentGame(save(change));
});
test('a successful import publishes the restored simulation clocks', () => {
  const loaded = SIM.deserialize(save(raw => { raw.t = 999999; }));
  assert.strictEqual(loaded.t, 999999);
  assert.strictEqual(HC.nowDay, 694);
  assert.strictEqual(STATS.now, 999999);
  assert.deepStrictEqual(loaded.rng.getState(), JSON.parse(snapshot).rng);
});

if (failures) process.exitCode = 1;
