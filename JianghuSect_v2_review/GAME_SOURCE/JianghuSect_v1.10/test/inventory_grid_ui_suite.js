'use strict';
/**
 * Inventory / Sect Stock / Sect Shop icon-grid regression suite.
 * Covers real data parity, atlas mapping, mode persistence, pagination and
 * mobile/landscape/desktop Chromium rendering.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const G = require('./load');
G.document = {
  getElementById() {
    return { querySelectorAll() { return []; }, style: {}, classList: { add() {}, remove() {}, toggle() {} } };
  }
};
require('../js/ui.js');
const { SIM, ECO, UI, CPE, WILD } = G;

console.log('Testing Wuxia Inventory Grid/List, Sect Stock & Shop UI...');

// 1. Atlas and layout geometry.
{
  const atlasPath = path.join(__dirname, '..', 'assets', 'wuxia_item_atlas.png');
  const map = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'ITEM_ICON_ATLAS_MAP.json'), 'utf8'));
  assert(fs.existsSync(atlasPath), 'Wuxia sprite atlas must exist');
  assert.strictEqual(map.width, 512);
  assert.strictEqual(map.height, 576);
  assert.strictEqual(map.cols, 8);
  assert.strictEqual(map.rows, 9);
  assert.strictEqual(map.totalCells, 72);
  assert.strictEqual(UI.ITEM_ATLAS_CELLS.length, 72);
  assert.strictEqual(new Set(UI.ITEM_ATLAS_CELLS.map(x => x.key)).size, 72, 'Atlas keys must be unique');
  for (const [id, expected] of [
    ['MAT_FISH_SILVER_CARP_1', 64],
    ['FOOD_STEAMED_SPIRIT_FISH', 69],
    ['ITEM_MYSTERY_RIVER_CONTAINER', 70],
    ['TRASH_RIVER_DEBRIS', 71]
  ]) {
    const cell = UI.resolveItemAtlasCell({ id, rawKind: 'MATERIAL' });
    assert.strictEqual(cell.cell, expected, `${id} must resolve to atlas cell ${expected}`);
  }
  console.log('  PASS: 72-cell atlas, unique keys, and fish/container/trash mappings');
}

// 2. Responsive page size and persisted view preference.
{
  const originalWindow = global.window;
  try {
    for (const [width, height, cols, rows] of [
      [360, 800, 5, 3],
      [412, 860, 6, 3],
      [800, 360, 8, 2],
      [1280, 800, 10, 3]
    ]) {
      global.window = { innerWidth: width, innerHeight: height };
      const spec = UI.calcGridPageSize();
      assert.strictEqual(spec.cols, cols, `${width}x${height} column count`);
      assert.strictEqual(spec.rows, rows, `${width}x${height} row count`);
      assert.strictEqual(spec.perPage, cols * rows);
    }
  } finally {
    if (originalWindow === undefined) delete global.window;
    else global.window = originalWindow;
  }
  const storage = new Map();
  const originalStorage = global.localStorage;
  global.localStorage = { getItem: k => storage.has(k) ? storage.get(k) : null, setItem: (k, v) => storage.set(k, String(v)) };
  try {
    const W = SIM.create('inventory-grid-preference');
    UI.G = { W, opts: {}, R: { selected: W.npcs[0].id } };
    UI.setInvViewMode('list');
    assert.strictEqual(UI.getInvViewMode(), 'list');
    assert.strictEqual(storage.get('jh_inv_view_mode'), 'list');
    assert.strictEqual(UI.G.opts.invViewMode, 'list');
    UI.setInvViewMode('grid');
    assert.strictEqual(UI.getInvViewMode(), 'grid');
  } finally {
    if (originalStorage === undefined) delete global.localStorage;
    else global.localStorage = originalStorage;
  }
  console.log('  PASS: 4 responsive page geometries and saved grid/list preference');
}

// 3. Data builders are read-only and produce identical rows in both display modes.
{
  const W = SIM.create('inventory-grid-data-parity');
  const n = W.npcs[0];
  W.sect.stock.MAT_HERB_DEW_GRASS_1 = (W.sect.stock.MAT_HERB_DEW_GRASS_1 || 0) + 7;
  n.inv.mats.MAT_FISH_SILVER_CARP_1 = 2;
  n.inv.mats.FOOD_STEAMED_SPIRIT_FISH = 1;
  n.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER = 1;
  n.inv.mats.TRASH_RIVER_DEBRIS = 1;
  const before = SIM.serialize(W);
  UI.G = { W, opts: {}, R: { selected: n.id } };
  UI.setInvViewMode('list');
  const bagList = UI.buildPersonalBagItems(W, n);
  const stockList = UI.buildSectStockItems(W);
  const shopList = UI.buildSectShopItems(W);
  UI.setInvViewMode('grid');
  const bagGrid = UI.buildPersonalBagItems(W, n);
  const stockGrid = UI.buildSectStockItems(W);
  const shopGrid = UI.buildSectShopItems(W);
  assert.deepStrictEqual(bagGrid, bagList, 'Personal bag rows must not depend on view mode');
  assert.deepStrictEqual(stockGrid, stockList, 'Sect stock rows must not depend on view mode');
  assert.deepStrictEqual(shopGrid, shopList, 'Sect shop rows must not depend on view mode');
  assert.strictEqual(SIM.serialize(W), before, 'Read-only UI builders must not mutate game state');
  assert(bagGrid.some(x => x.id === 'MAT_FISH_SILVER_CARP_1'));
  assert(stockGrid.some(x => x.id === 'MAT_HERB_DEW_GRASS_1'));
  assert(shopGrid.length > 0, 'Shop must expose available exchange/study/bounty rows');
  console.log('  PASS: personal bag, sect stock and shop builders preserve data and transaction rows');
}

// 4. Rendered HTML smoke tests for all three inventory surfaces and both modes.
{
  const W = SIM.create('inventory-grid-render-smoke');
  const n = W.npcs[0];
  n.inv.mats.MAT_FISH_SILVER_CARP_1 = 3;
  n.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER = 1;
  W.sect.stock.MAT_HERB_DEW_GRASS_1 = 12;
  UI.G = { W, opts: {}, R: { selected: n.id, invalidate() {} }, speed: 0, acc: 0 };
  UI.npcId = n.id;
  UI.editNpcId = n.id;
  UI.bagSearch = '';
  UI.stockSearch = '';
  UI.shopSearch = '';
  UI.setInvViewMode('grid');

  UI.tab = 'ov';
  UI.bagSelKey = 'MAT:MAT_FISH_SILVER_CARP_1';
  let html = UI.rNpc();
  assert(html.includes('inv-grid'), 'Personal bag should render grid mode');
  assert(html.includes('inv-detail-panel'), 'Personal bag should render selected-item details');
  assert(html.includes('data-atlas-cell="64"'), 'Personal bag should render fish atlas cell');
  assert(!html.includes('undefined') && !html.includes('NaN'));

  UI.tab = 'stock';
  UI.stockSelKey = 'ST:MAT_HERB_DEW_GRASS_1';
  html = UI.rSect();
  assert(html.includes('inv-grid'), 'Sect stock should render grid mode');
  assert(html.includes('inv-detail-panel'));
  assert(!html.includes('undefined') && !html.includes('NaN'));

  UI.tab = 'shop';
  const firstShop = UI.buildSectShopItems(W)[0];
  assert(firstShop, 'Shop fixture should contain at least one item');
  UI.shopSelKey = firstShop.selKey;
  html = UI.rSect();
  assert(html.includes('inv-grid'), 'Sect shop should render grid mode');
  assert(html.includes('shopBuyerSel'), 'Shop should expose an explicit buyer selector');
  assert(!html.includes('undefined') && !html.includes('NaN'));

  UI.setInvViewMode('list');
  UI.tab = 'ov';
  html = UI.rNpc();
  assert(!html.includes('inv-grid'), 'Personal bag list mode must not render the grid');
  assert(html.includes('bagSearch'));
  UI.tab = 'stock';
  html = UI.rSect();
  assert(!html.includes('inv-grid'), 'Sect stock list mode must not render the grid');
  assert(html.includes('stockSearch'));
  UI.tab = 'shop';
  html = UI.rSect();
  assert(!html.includes('inv-grid'), 'Sect shop list mode must not render the grid');
  assert(html.includes('shopBuyerSel'));
  console.log('  PASS: Personal Bag, Sect Stock and Sect Shop render in Grid and Classic List modes');
}

// 5. Browser interaction across mobile portrait, landscape and desktop.
(async () => {
  const { chromium } = (() => { try { return require('playwright'); } catch (_) { return require('../tools/cdp_playwright.js'); } })();
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch();
  const pageErrors = [];
  const consoleErrors = [];
  try {
    const ctx = await browser.newContext({ width: 360, height: 800, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => pageErrors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    await page.goto('file://' + path.join(root, 'JianghuSect_single.html'));
    await page.waitForSelector('[data-pick="0"]');
    await page.click('[data-pick="0"]');
    await page.waitForTimeout(120);

    const initial = await page.evaluate(() => {
      G.speed = 0;
      const W = G.W;
      const n = W.byId[W.sect.masterId];
      n.inv.mats.MAT_FISH_SILVER_CARP_1 = 3;
      n.inv.mats.FOOD_STEAMED_SPIRIT_FISH = 1;
      n.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER = 1;
      n.inv.mats.TRASH_RIVER_DEBRIS = 1;
      W.sect.stock.MAT_HERB_DEW_GRASS_1 = 12;
      UI.setInvViewMode('grid');
      UI.openNpc(n.id);
      UI.bagSelKey = 'MAT:MAT_FISH_SILVER_CARP_1';
      UI.render();
      const fishCell = document.querySelector('.inv-detail-panel .inv-atlas-ic')?.getAttribute('data-atlas-cell');
      return { fishCell, grid: !!document.querySelector('.inv-grid'), cells: document.querySelectorAll('.inv-cell').length };
    });
    assert.strictEqual(initial.grid, true);
    assert.strictEqual(initial.fishCell, '64');

    const viewports = [];
    for (const [width, height, cols, rows] of [[360, 800, 5, 3], [800, 360, 8, 2], [1280, 800, 10, 3]]) {
      await page.setViewportSize({ width, height }, 2, width < 600);
      const state = await page.evaluate(() => {
        UI.render();
        const spec = UI.calcGridPageSize();
        const grid = document.querySelector('.inv-grid');
        const columns = grid ? getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length : 0;
        const body = document.getElementById('shBody');
        return { width: innerWidth, height: innerHeight, cols: spec.cols, rows: spec.rows, perPage: spec.perPage, cssCols: columns, overflow: body.scrollWidth > body.clientWidth + 2 };
      });
      assert.strictEqual(state.cols, cols, `${width}x${height} logical columns`);
      assert.strictEqual(state.rows, rows, `${width}x${height} logical rows`);
      assert.strictEqual(state.cssCols, cols, `${width}x${height} CSS columns`);
      assert.strictEqual(state.overflow, false, `${width}x${height} horizontal overflow`);
      viewports.push(state);
    }

    const shopState = await page.evaluate(() => {
      const W = G.W;
      UI.open('sect', 'shop');
      const shopItems = UI.buildSectShopItems(W);
      UI.shopSelKey = shopItems[0]?.selKey || null;
      UI.render();
      const grid = !!document.querySelector('.inv-grid');
      const buyerSelector = !!document.querySelector('#shopBuyerSel');
      UI.setInvViewMode('list');
      UI.render();
      const list = !document.querySelector('.inv-grid') && !!document.querySelector('#shopBuyerSel');
      UI.setInvViewMode('grid');
      UI.open('sect', 'stock');
      const stockGrid = !!document.querySelector('.inv-grid');
      return { grid, buyerSelector, list, stockGrid };
    });
    assert.strictEqual(shopState.grid, true);
    assert.strictEqual(shopState.buyerSelector, true);
    assert.strictEqual(shopState.list, true);
    assert.strictEqual(shopState.stockGrid, true);
    assert.strictEqual(pageErrors.length, 0, 'Browser page errors: ' + pageErrors.join('; '));
    assert.strictEqual(consoleErrors.length, 0, 'Browser console errors: ' + consoleErrors.join('; '));
    console.log('  PASS: Chromium UI interactions at 360x800, 800x360 and 1280x800; no horizontal overflow or browser errors');
    console.log('  VIEWPORTS: ' + JSON.stringify(viewports));
    console.log('ALL INVENTORY GRID UI TESTS PASSED.');
  } finally {
    await browser.close();
  }
})().catch(e => {
  console.error(e);
  process.exit(1);
});
