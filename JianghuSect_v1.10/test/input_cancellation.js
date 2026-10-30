'use strict';
// Cancellation must end a gesture without activating a map target or continuing a drag.
const assert = require('assert');
const path = require('path');
const { chromium } = (() => { try { return require('playwright'); } catch (_) { return require('../tools/cdp_playwright.js'); } })();
(async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 412, height: 860 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto('file://' + path.resolve(__dirname, '../index.html'));
    await page.click('[data-pick="0"]');
    const result = await page.evaluate(() => {
      G.speed = 0;
      const selected = G.W.npcs.find(n => !n.dead && !n.away).id;
      G.R.selected = selected;
      G.R.follow = true;
      const canvas = document.getElementById('map');
      G.R.focus(15, 15, 2); G.R.draw(0);
      const point = [[8, 500], [400, 500], [206, 220], [20, 220]].find(([x, y]) => !G.R.pickAt(x, y));
      if (!point) throw new Error('No empty ground fixture');
      const fire = (target, type, id, x, y) => target.dispatchEvent(new PointerEvent(type, { pointerId: id, clientX: x, clientY: y, bubbles: true }));
      fire(canvas, 'pointerdown', 11, ...point);
      fire(canvas, 'pointercancel', 11, ...point);
      const afterCancel = { selected: G.R.selected, follow: G.R.follow };
      fire(canvas, 'pointerdown', 21, ...point);
      fire(canvas, 'pointerdown', 22, point[0] + 20, point[1]);
      fire(canvas, 'pointerup', 22, point[0] + 20, point[1]);
      fire(canvas, 'pointerup', 21, ...point);
      const afterTwoFingerTap = G.R.selected;
      fire(canvas, 'pointerdown', 12, ...point);
      fire(canvas, 'pointerup', 12, ...point);
      const afterTap = G.R.selected;
      const mini = document.getElementById('minimap'), rect = mini.getBoundingClientRect();
      fire(mini, 'pointerdown', 13, rect.left + 20, rect.top + 20);
      fire(mini, 'pointercancel', 13, rect.left + 20, rect.top + 20);
      const beforeMove = { x: G.R.cam.x, y: G.R.cam.y };
      fire(mini, 'pointermove', 13, rect.left + 100, rect.top + 70);
      const afterMove = { x: G.R.cam.x, y: G.R.cam.y };
      return { selected, afterCancel, afterTwoFingerTap, afterTap, beforeMove, afterMove };
    });
    assert.strictEqual(result.afterCancel.selected, result.selected, 'Cancelled map touch must preserve selected NPC');
    assert.strictEqual(result.afterCancel.follow, true, 'Cancelled map touch must preserve follow mode');
    assert.strictEqual(result.afterTwoFingerTap, result.selected, 'Two-finger gesture must not activate a single-tap action');
    assert.strictEqual(result.afterTap, null, 'A completed empty-ground tap must still deselect');
    assert.deepStrictEqual(result.afterMove, result.beforeMove, 'Cancelled minimap drag must stop moving camera');
    console.log('PASS input cancellation: selection/follow preserved, ordinary tap works, minimap drag stops');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
