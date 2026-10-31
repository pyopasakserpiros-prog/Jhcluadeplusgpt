'use strict';
// Run the unmodified browser entry point with a controlled animation clock.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');
const close = (actual, expected, message) => assert(Math.abs(actual - expected) < 1e-8, `${message}: ${actual} != ${expected}`);
function harness(tickCost = 0) {
  let callback, clock = 0, saved, tickError;
  const noop = () => {};
  const ctx = new Proxy({}, { get: () => noop, set: () => true });
  const el = { width: 184, height: 123, getContext: () => ctx, addEventListener: noop };
  const R = { cam: { x: 0, y: 0, z: 1 }, vw: 412, vh: 860, setWorld: noop, resize: noop, focus: noop, clampCam: noop, draw: noop, getMini: noop };
  const makeWorld = () => ({ t: 0, day: 0, npcs: [], foes: [], sect: { masterId: 'master' }, byId: { master: { x: 0, y: 0, h: { name: { given: 'test' } } } } });
  const context = {
    U: {}, HC: {}, MAP: { W: 240, H: 160 }, Render: { create: () => R },
    SIM: {
      create: makeWorld, deserialize: str => JSON.parse(str),
      serialize: world => { saved = JSON.parse(JSON.stringify(world)); return JSON.stringify(world); },
      dateText: String,
      tick: world => { if (tickError) { const error = tickError; tickError = null; throw error; } world.t++; clock += tickCost; }
    },
    UI: { paused: false, init: noop, applyOpts: noop, showStart: noop, updateHud: noop, tick: noop, toast: noop },
    document: { readyState: 'complete', getElementById: () => el, addEventListener: noop },
    localStorage: { getItem: () => null, setItem: noop }, performance: { now: () => clock },
    requestAnimationFrame: fn => { callback = fn; }, addEventListener: noop, setTimeout: noop, console: { ...console, error: noop }
  };
  context.window = context; vm.createContext(context); vm.runInContext(source, context, { filename: 'js/main.js' });
  const G = context.G;
  return {
    G, UI: context.UI, makeWorld,
    at(ts, expectError = false) { clock = ts; callback(ts); if (expectError) assert(G.err, 'injected tick failure should be recorded'); else assert.equal(G.err, null, 'animation callback should not throw'); },
    failNextTick(error = new Error('tick failure')) { tickError = error; },
    clock(ts) { clock = ts; }, snapshot() { return saved; }
  };
}
// A missing dt clamp would produce these counts even when a foreground callback stalls.
for (const speed of [1, 2, 4, 8, 16, 32, 48]) {
  const h = harness(); h.G.newGame('test', 0); h.G.speed = speed; h.at(0);
  for (let i = 1; i <= 60; i++) h.at(i * 1000 / 60);
  close(h.G.W.t + h.G.acc, speed * 4, `${speed}x keeps a full second of elapsed time`);
  assert.equal(h.G.W.speed, speed, 'world speed follows the selected speed');
  close(h.G.W.runtimeTiming.pendingTicks, h.G.acc, 'snapshot tracks fractional pending ticks');
  assert.equal(h.G.W.runtimeTiming.speed, speed);
}
{
  const h = harness(); h.G.newGame('test', 0); h.G.speed = 32; h.at(0); h.at(1000);
  close(h.G.W.t + h.G.acc, 128, 'a one-second stalled callback retains every tick');
}
{
  const h = harness(4); h.G.newGame('test', 0); h.G.speed = 48; h.at(0); h.at(1000);
  assert.equal(h.G.W.t, 3, '12 ms work budget stops after three 4 ms ticks');
  close(h.G.acc, 189, 'unprocessed high-speed ticks remain queued');
  h.G.speed = 0; h.at(2000);
  assert.equal(h.G.W.t, 3, 'pause does not drain existing debt'); close(h.G.acc, 189, 'pause retains debt');
  h.G.speed = 1; h.UI.paused = true; h.at(3000);
  assert.equal(h.G.W.t, 3, 'UI pause freezes simulation'); close(h.G.acc, 189, 'UI pause retains debt');
  h.UI.paused = false; h.at(3100);
  close(h.G.W.t + h.G.acc, 192.4, 'resuming excludes the time spent paused');
}
{
  const h = harness(4); h.G.newGame('test', 0); h.G.speed = 32; h.at(0); h.at(1000);
  const pending = h.G.acc, t = h.G.W.t;
  h.G.speed = 16; h.G.autosave();
  assert.equal(h.snapshot().runtimeTiming.speed, 16, 'autosave captures speed changed since last frame');
  close(h.snapshot().runtimeTiming.pendingTicks, pending, 'autosave captures backlog');
  assert.equal(h.snapshot().speed, 16);
  h.clock(5000); h.G.load(JSON.stringify(h.snapshot()));
  assert.equal(h.G.speed, 16, 'load restores selected speed'); close(h.G.acc, pending, 'load restores saved debt');
  h.at(5100); close(h.G.W.t - t + h.G.acc, pending + 6.4, 'load clock starts at binding rather than previous world callback');
}
{
  const h = harness(); h.G.newGame('test', 0); h.at(1000); h.clock(5000); h.G.newGame('next', 0); h.at(5100);
  close(h.G.W.t + h.G.acc, 0.4, 'new game does not inherit elapsed time from prior world');
}
for (const timing of [undefined, { pendingTicks: -1, speed: -1 }, { pendingTicks: '10', speed: '32' }, { pendingTicks: null, speed: null }]) {
  const h = harness(), W = h.makeWorld(); if (timing) W.runtimeTiming = timing; h.G.load(JSON.stringify(W));
  assert.equal(h.G.acc, 0, 'old or invalid saves default to no pending ticks'); assert.equal(h.G.speed, 1, 'old or invalid saves default to 1x');
}
{
  const h = harness(), W = h.makeWorld(); W.runtimeTiming = { pendingTicks: 2.5, speed: 0 }; h.G.load(JSON.stringify(W)); h.at(1000);
  assert.equal(h.G.speed, 0, 'saved pause is preserved'); close(h.G.acc, 2.5, 'saved paused debt is preserved');
}
console.log('PASS runtime timing: 1/2/4/8/16/32/48x, full stalled elapsed time, 12 ms budget, preserved backlog, pause, save/load, fresh world clocks, legacy save defaults');

for (const recovery of ['load', 'newGame']) {
  const h = harness(); h.G.newGame('first', 0);
  const saved = JSON.stringify(h.G.W);
  h.failNextTick(); h.at(1000, true);
  assert.equal(h.G.speed, 0, 'first simulation error pauses the game');
  if (recovery === 'load') h.G.load(saved); else h.G.newGame('recovered', 0);
  assert.equal(h.G.err, null, recovery + ' clears the previous world error');
  h.failNextTick(); h.at(2000, true);
  assert.equal(h.G.speed, 0, recovery + ' allows a later failure to pause the recovered game');
}
console.log('PASS runtime error recovery: load/new game clear stale errors and subsequent failures pause again');
for (const speed of [0, 1, 16, 32, 48]) {
  const h = harness(), W = h.makeWorld(); W.speed = speed;
  h.G.load(JSON.stringify(W));
  assert.equal(h.G.speed, speed, 'legacy save restores world speed without runtimeTiming');
  assert.equal(h.G.W.speed, speed, 'binding must not overwrite legacy world speed');
}
console.log('PASS legacy browser load restores paused and accelerated saves without runtimeTiming');
