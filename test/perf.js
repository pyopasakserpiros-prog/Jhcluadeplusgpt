const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(500); await p.click('[data-pick="0"]'); await p.waitForTimeout(800);
  for (const sp of [1, 4, 16, 32, 48]) { await p.evaluate(s => { G.speed = s; }, sp); const a = await p.evaluate(() => G.W.t); await p.waitForTimeout(4000); const c = await p.evaluate(() => G.W.t); console.log('speed', sp, 'ticks/s', ((c - a) / 4).toFixed(0), 'want', sp * 4); }
  const fps = await p.evaluate(() => new Promise(r => { let n = 0, t0 = performance.now(); G.speed = 1; (function f() { n++; if (performance.now() - t0 > 2000) r(n / 2); else requestAnimationFrame(f); })(); })); console.log('fps@1x', fps);
  console.log(errs.join('\n') || 'NO ERRORS'); await b.close();
})();
