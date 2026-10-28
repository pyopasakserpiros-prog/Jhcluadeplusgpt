const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2 }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(400); await p.click('[data-pick="0"]'); await p.waitForTimeout(800);
  const c0 = await p.evaluate(() => ({ x: G.R.cam.x, y: G.R.cam.y, z: G.R.cam.z }));
  await p.mouse.move(200, 400); await p.mouse.down(); await p.mouse.move(120, 330, { steps: 6 }); await p.mouse.up();
  const c1 = await p.evaluate(() => ({ x: G.R.cam.x, y: G.R.cam.y, z: G.R.cam.z })); console.log('pan', JSON.stringify(c0), '->', JSON.stringify(c1));
  await p.mouse.move(200, 400); await p.mouse.wheel(0, -300); await p.waitForTimeout(200); const c2 = await p.evaluate(() => G.R.cam.z); console.log('zoom', c1.z, '->', c2);
  // แตะที่ตัวละคร
  const pos = await p.evaluate(() => { const R = G.R; const n = G.W.npcs.find(n => !n.dead && !n.away && !n.hidden); R.focus(n.x, n.y, 2); R.draw(0); const w = R.w2s ? R.w2s(n.x * 16, (n.y - 0.6) * 16) : null; return { id: n.id, w }; });
  console.log('npc screen pos', JSON.stringify(pos.w)); if (pos.w) { await p.mouse.click(pos.w.x, pos.w.y); await p.waitForTimeout(300); console.log('selected', await p.evaluate(() => G.R.selected), 'expected', pos.id); }
  // แตะที่ว่าง = ยกเลิก
  await p.mouse.click(8, 500); await p.waitForTimeout(200); console.log('after empty tap selected', await p.evaluate(() => G.R.selected));
  // minimap
  const m = await p.locator('#minimap').boundingBox(); await p.mouse.click(m.x + m.width * 0.8, m.y + m.height * 0.2); const cm = await p.evaluate(() => ({ x: G.R.cam.x / 16, y: G.R.cam.y / 16 })); console.log('minimap click -> cam tile', JSON.stringify(cm), '(expect ~192,32)');
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close();
})();
