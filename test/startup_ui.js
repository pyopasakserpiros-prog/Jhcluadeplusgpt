'use strict';
// Exercise startup loading through real DOM events, FileReader and saved worlds.
const assert = require('assert');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const failures = [];
  async function test(name, run) {
    const context = await browser.newContext({ viewport: { width: 412, height: 860 }, isMobile: true, hasTouch: true });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto('file://' + path.resolve(__dirname, '../index.html'));
      await page.waitForSelector('[data-pick="0"]');
      await run(page);
      assert.deepStrictEqual(errors, [], 'Startup actions must not throw browser errors');
      console.log('PASS ' + name);
    } catch (error) {
      failures.push(name + ': ' + error.message);
      console.error('FAIL ' + name + ': ' + error.message);
    } finally { await context.close(); }
  }
  async function savePayload(page, seed) {
    return page.evaluate(seed => {
      const world = SIM.create(seed, { masterIdx: 0 });
      world.speed = 0; world.runtimeTiming = { pendingTicks: 0, speed: 0 };
      return SIM.serialize(world);
    }, seed);
  }
  async function chooseImport(page, payload) {
    const chooser = page.waitForEvent('filechooser');
    await page.click('[data-do="import"]');
    await (await chooser).setFiles({ name: 'startup-save.json', mimeType: 'application/json', buffer: Buffer.from(payload) });
  }
  try {
    await test('startup load menu exposes only actions available without a world', async page => {
      await page.click('#stLoad');
      assert.strictEqual(await page.evaluate(() => G.W), null);
      assert.strictEqual(await page.locator('[data-do="save"], [data-do="export"], [data-do="tool"]').count(), 0,
        'Loading before a game must not expose save, export or observer actions');
      assert.strictEqual(await page.locator('[data-t="tools"], [data-t="about"]').count(), 0,
        'World-dependent tabs must not be offered before a game exists');
      assert.strictEqual(await page.locator('[data-do="import"]').isVisible(), true);
    });
    await test('cancelling startup load restores the same selectable candidates', async page => {
      const candidates = await page.locator('#start').textContent();
      await page.click('#stLoad');
      await page.click('#shClose');
      assert.strictEqual(await page.locator('#start').isVisible(), true, 'Cancel must return to master selection');
      assert.strictEqual(await page.locator('#start').textContent(), candidates, 'Cancel must preserve the existing choices');
      await page.click('[data-pick="0"]');
      assert.strictEqual(await page.evaluate(() => !!G.W), true);
      assert.strictEqual(await page.locator('#start').isVisible(), false);
    });
    await test('gameplay navigation before loading returns safely to startup', async page => {
      for (const nav of ['people', 'sect', 'log', 'world']) {
        await page.click('#stLoad');
        await page.click('[data-nav="' + nav + '"]');
        assert.strictEqual(await page.locator('#start').isVisible(), true, nav + ' must not open without a world');
      }
    });
    await test('loading a saved slot enters the world and retains the normal game menu', async page => {
      const payload = await savePayload(page, 'startup-slot');
      await page.evaluate(payload => {
        localStorage.setItem('jhs_slot_1', payload);
        localStorage.setItem('jhs_meta_1', JSON.stringify({ text: 'Saved slot' }));
      }, payload);
      await page.click('#stLoad');
      await page.click('[data-do="load"][data-arg="1"]');
      assert.strictEqual(await page.evaluate(() => G.W.seed), 'startup-slot');
      assert.strictEqual(await page.locator('#start').isVisible(), false);
      assert.strictEqual(await page.locator('#sheet').isVisible(), false);
      await page.click('[data-nav="menu"]');
      assert.strictEqual(await page.locator('[data-do="save"]').count(), 3);
      assert.strictEqual(await page.locator('[data-do="export"]').isVisible(), true);
      await page.click('[data-t="about"]');
      assert((await page.locator('#shBody').textContent()).includes('startup-slot'));
      await page.click('[data-t="tools"]');
      const stones = await page.evaluate(() => G.W.sect.stones);
      await page.click('[data-do="tool"][data-arg="stones"]');
      assert.strictEqual(await page.evaluate(() => G.W.sect.stones), stones + 1000);
    });
    await test('a corrupt saved slot remains recoverable', async page => {
      await page.evaluate(() => {
        localStorage.setItem('jhs_slot_1', 'not a save');
        localStorage.setItem('jhs_meta_1', JSON.stringify({ text: 'Broken slot' }));
      });
      await page.click('#stLoad');
      await page.click('[data-do="load"][data-arg="1"]');
      await page.waitForFunction(() => document.getElementById('toasts').textContent.includes('โหลดไม่สำเร็จ'));
      assert.strictEqual(await page.evaluate(() => G.W), null);
      await page.click('#shClose');
      assert.strictEqual(await page.locator('#start').isVisible(), true, 'A failed slot load must not strand the player');
    });
    await test('a failed file import can be retried with a valid save', async page => {
      const payload = await savePayload(page, 'startup-import');
      await page.click('#stLoad');
      await chooseImport(page, 'not a save');
      await page.waitForFunction(() => document.getElementById('toasts').textContent.includes('ไฟล์ไม่ถูกต้อง'));
      assert.strictEqual(await page.evaluate(() => G.W), null);
      assert.strictEqual(await page.locator('#sheet').isVisible(), true);
      await chooseImport(page, payload);
      await page.waitForFunction(() => G.W && G.W.seed === 'startup-import');
      assert.strictEqual(await page.locator('#start').isVisible(), false);
      assert.strictEqual(await page.locator('#sheet').isVisible(), false);
    });
    await test('a successful import dismisses an open startup overlay', async page => {
      const payload = await savePayload(page, 'startup-overlay-import');
      await page.setInputFiles('#impFile', { name: 'saved.json', mimeType: 'application/json', buffer: Buffer.from(payload) });
      await page.waitForFunction(() => G.W && G.W.seed === 'startup-overlay-import');
      assert.strictEqual(await page.locator('#start').isVisible(), false, 'A loaded world must not remain covered by startup');
    });
  } finally { await browser.close(); }
  assert.strictEqual(failures.length, 0, failures.join('\n'));
})().catch(error => { console.error(error); process.exitCode = 1; });
