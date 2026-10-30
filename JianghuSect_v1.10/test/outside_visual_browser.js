'use strict';
const assert = require('assert'), path = require('path');
const { chromium } = (() => { try { return require('playwright'); } catch (_) { return require('../tools/cdp_playwright.js'); } })();
(async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 412, height: 860 } });
    const page = await context.newPage();
    await page.goto('file://' + path.resolve(__dirname, '../index.html'));
    await page.waitForSelector('[data-pick="0"]'); await page.click('[data-pick="0"]');
    const counts = await page.evaluate(() => {
      G.speed = 0;
      return ['BASIC_HERB', 'OTHER_HERB'].map(category => {
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 48;
        const ctx = canvas.getContext('2d'); ctx.translate(16, 16);
        G.R.drawWildResource(ctx, { x: 0, y: 0, category, materialId: 'MAT_HERB_CINDER_LEAF_1', remaining: 2 });
        const pixels = ctx.getImageData(0, 0, 48, 48).data; let leaves = 0, petals = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const [r, g, b, a] = pixels.slice(i, i + 4);
          if (a > 150 && g > r + 40 && g > b + 40) leaves++;
          if (a > 150 && r > 220 && g > 70 && g < 150 && b < 100) petals++;
        }
        return { category, leaves, petals };
      });
    });
    for (const row of counts) {
      assert(row.leaves > 8, row.category + ' must render green herb leaves, rather than a generic material stump');
      assert(row.petals > 2, row.category + ' must preserve cinder leaf flower color');
    }
    console.log('PASS real Canvas resource rendering: both herb categories have leaves and material-specific petals');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
