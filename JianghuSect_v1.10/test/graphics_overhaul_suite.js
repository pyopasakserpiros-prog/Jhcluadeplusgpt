/* test/graphics_overhaul_suite.js — Dedicated Verification Suite for Graphics & UI Overhaul */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const g = require('./load');

const ROOT = path.resolve(__dirname, '..');

function makeMockCanvas(w, h) {
  const ops = [];
  const ctx = {
    canvas: null,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    lineCap: 'butt',
    lineJoin: 'miter',
    font: '12px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    imageSmoothingEnabled: true,
    save() { ops.push('save'); },
    restore() { ops.push('restore'); },
    scale(x, y) { ops.push(['scale', x, y]); },
    translate(x, y) { ops.push(['translate', x, y]); },
    rotate(a) { ops.push(['rotate', a]); },
    setTransform(a, b, c, d, e, f) { ops.push(['setTransform', a, b, c, d, e, f]); },
    beginPath() { ops.push('beginPath'); },
    closePath() { ops.push('closePath'); },
    moveTo(x, y) { ops.push(['moveTo', x, y]); },
    lineTo(x, y) { ops.push(['lineTo', x, y]); },
    quadraticCurveTo(cx, cy, x, y) { ops.push(['quad', cx, cy, x, y]); },
    bezierCurveTo(c1x, c1y, c2x, c2y, x, y) { ops.push(['bezier', c1x, c1y, c2x, c2y, x, y]); },
    arc(x, y, r, s, e) { ops.push(['arc', x, y, r]); },
    ellipse(x, y, rx, ry, rot, s, e) { ops.push(['ellipse', x, y, rx, ry]); },
    rect(x, y, rw, rh) { ops.push(['rect', x, y, rw, rh]); },
    fillRect(x, y, rw, rh) { ops.push(['fillRect', this.fillStyle, x, y, rw, rh]); },
    strokeRect(x, y, rw, rh) { ops.push(['strokeRect', this.strokeStyle, x, y, rw, rh]); },
    clearRect(x, y, rw, rh) { ops.push(['clearRect', x, y, rw, rh]); },
    fill() { ops.push(['fill', this.fillStyle]); },
    stroke() { ops.push(['stroke', this.strokeStyle]); },
    clip() { ops.push('clip'); },
    setLineDash(d) { ops.push(['setLineDash', d]); },
    fillText(txt, x, y) { ops.push(['fillText', String(txt), x, y]); },
    measureText(txt) { return { width: String(txt || '').length * 7 }; },
    drawImage(img, ...args) { ops.push(['drawImage', args.length]); },
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; }
  };
  const cv = {
    width: w || 412,
    height: h || 860,
    style: {},
    _ops: ops,
    getContext() { return ctx; },
    getBoundingClientRect() { return { width: this.width, height: this.height, left: 0, top: 0 }; }
  };
  ctx.canvas = cv;
  return cv;
}

g.window = g;
g.devicePixelRatio = 2;
g.document = {
  createElement(tag) {
    if (tag === 'canvas') return makeMockCanvas(64, 64);
    return { style: {} };
  },
  getElementById() { return makeMockCanvas(184, 123); }
};
if (typeof g.OffscreenCanvas === 'undefined') {
  g.OffscreenCanvas = function (w, h) { return makeMockCanvas(w, h); };
}
require(path.join(ROOT, 'js/render.js'));

(function runGraphicsOverhaulSuite() {
  // 1. Verify human_core.js immutability
  const hcBytes = fs.readFileSync(path.join(ROOT, 'js/human_core.js'));
  const hcSha = crypto.createHash('sha256').update(hcBytes).digest('hex');
  assert.strictEqual(
    hcSha,
    'a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542',
    'js/human_core.js SHA-256 must remain 100% unmodified'
  );

  // 2. Determinism & Simulation Purity Test:
  // Running 120 ticks headless vs. running 120 ticks with R.draw() + R.portrait() + resize() + quality toggles must produce identical SIM.serialize(W) and RNG state
  const WA = g.SIM.create('gfx-det-seed-777', { masterIdx: 0 });
  for (let i = 0; i < 120; i++) g.SIM.tick(WA);
  const serA = g.SIM.serialize(WA);
  const rngA = WA.rng.getState ? WA.rng.getState() : WA.rng.s;

  const WB = g.SIM.create('gfx-det-seed-777', { masterIdx: 0 });
  const mainCv = makeMockCanvas(1280, 800);
  const R = g.Render.create(mainCv);
  R.setWorld(WB);
  R.resize();
  const ptCv = makeMockCanvas(64, 64);

  const qualities = ['auto', 'low', 'standard', 'high'];
  for (let i = 0; i < 120; i++) {
    g.SIM.tick(WB);
    R.opts.quality = qualities[i % qualities.length];
    R.opts.reducedMotion = (i % 5 === 0);
    if (i % 20 === 0) {
      mainCv.width = i % 40 === 0 ? 412 : 1280;
      mainCv.height = i % 40 === 0 ? 860 : 800;
      R.resize();
    }
    R.selected = WB.npcs[i % WB.npcs.length].id;
    R.draw(1000 + i * 16);
    g.Render.portrait(ptCv, WB.npcs[i % WB.npcs.length], 64);
  }
  const serB = g.SIM.serialize(WB);
  const rngB = WB.rng.getState ? WB.rng.getState() : WB.rng.s;

  assert.deepStrictEqual(rngB, rngA, 'Rendering, resizing, portrait drawing, and quality switching must never consume W.rng');
  assert.strictEqual(serB, serA, 'Rendering must never mutate serialized simulation state SIM.serialize(W)');

  // Ensure no _ap leaked onto NPC objects, and R.draw on a fresh NPC does not mutate passiveLoadout or _passRec
  for (const n of WB.npcs) {
    assert.strictEqual(n._ap, undefined, 'Renderer must not attach mutable _ap onto authoritative NPC objects');
  }
  const freshNpc = WB.npcs[0];
  delete freshNpc._passRec;
  delete freshNpc.passiveLoadout;
  R.draw(9999);
  assert.strictEqual(freshNpc._passRec, undefined, 'R.draw must not call mutating M.activePassives/reconcilePassives on NPC objects');
  assert.strictEqual(freshNpc.passiveLoadout, undefined, 'R.draw must not mutate n.passiveLoadout');

  // 3. Appearance & Equipment Cache Invalidation Test
  const npc0 = WB.npcs[0];
  const apBefore = R.appearance(npc0);
  assert(apBefore && typeof apBefore.sig === 'string', 'appearance(n) must return live signature');

  npc0.equip = npc0.equip || {};
  npc0.equip.WEAPON = { id: 'test_staff', nameTh: 'พลองหยก', type: 'STAFF', slot: 'WEAPON', tier: 3 };
  const apStaff = R.appearance(npc0);
  assert.strictEqual(apStaff.weaponType, 'STAFF', 'appearance(n) must immediately reflect newly equipped STAFF');

  npc0.equip.WEAPON = { id: 'test_spear', nameTh: 'ทวนมังกร', type: 'SPEAR', slot: 'WEAPON', tier: 4 };
  const apSpear = R.appearance(npc0);
  assert.strictEqual(apSpear.weaponType, 'SPEAR', 'appearance(n) must immediately reflect newly equipped SPEAR');

  npc0.equip.WEAPON = { id: 'test_blade', nameTh: 'ดาบวงพระจันทร์', type: 'BLADE', slot: 'WEAPON', tier: 3 };
  const apBlade = R.appearance(npc0);
  assert.strictEqual(apBlade.weaponType, 'BLADE', 'appearance(n) must immediately reflect newly equipped BLADE');

  delete npc0.equip.WEAPON;
  const apUnarmed = R.appearance(npc0);
  assert.strictEqual(apUnarmed.weaponType, null, 'Unarmed cultivator must resolve to null weaponType');

  // 4. Building Sprite Cache Key & Upgrade Level Test
  const mainHall = WB.map.byId.main_hall;
  mainHall.level = 1;
  const spLv1 = R.getBuildingSprite(mainHall);
  mainHall.level = 2;
  const spLv2 = R.getBuildingSprite(mainHall);
  mainHall.level = 3;
  const spLv3 = R.getBuildingSprite(mainHall);
  assert.notStrictEqual(spLv1, spLv2, 'Building sprite cache must distinguish Lv.1 and Lv.2');
  assert.notStrictEqual(spLv2, spLv3, 'Building sprite cache must distinguish Lv.2 and Lv.3');

  // 5. All 22 Legendary Motifs + 24-Cast Cap + Pause Clock Freeze Verification
  const motifs = Object.keys(g.Render.LEGENDARY_MOTIFS);
  assert(motifs.length >= 22, `Expected at least 22 legendary motifs, got ${motifs.length}`);
  let seq = 1;
  for (const mKey of motifs) {
    npc0.castFx = {
      seq: seq++,
      t: WB.t,
      kind: 'normal',
      motif: mKey,
      fxKind: mKey,
      legendary: true,
      x: npc0.x + 1,
      y: npc0.y
    };
    R.focus(npc0.x, npc0.y, 2.0);
    R.draw(5000 + seq * 16);
  }
  assert(R.castActive.size <= 24, `Active cast effects (${R.castActive.size}) must never exceed 24`);

  // Pause clock freeze check
  WB.speed = 0;
  const clockAtPause = R.animClock;
  R.draw(6000);
  R.draw(7000);
  assert.strictEqual(R.animClock, clockAtPause, 'R.animClock must freeze when simulation is paused (speed === 0)');

  console.log(`PASS graphics_overhaul_suite: determinism, read-only purity, weapon/appearance cache invalidation, building Lv.1-3 sprites, ${motifs.length} legendary motifs, and pause freeze verified`);
})();
