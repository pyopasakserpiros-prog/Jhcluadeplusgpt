const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(500); await p.click('[data-pick="0"]'); await p.waitForTimeout(600);
  await p.evaluate(() => { G.W.explore.gate.next = G.W.day; G.speed = 48; }); await p.waitForTimeout(9000); await p.evaluate(() => { G.speed = 0; });
  for (const id of ['gate_zone', 'cave', 'stele', 'spring', 'ruin', 'grove']) { await p.evaluate(id => { const b = G.W.map.byId[id]; G.R.follow = false; G.R.focus(b.x + b.w / 2, b.y + b.h / 2, 2.2); G.R.draw(performance.now()); }, id); await p.waitForTimeout(200); await p.screenshot({ path: '/tmp/shots/10_' + id + '.png' }); }
  await p.evaluate(() => { UI.open('world'); UI.tab = 'disc'; UI.render(); }); await p.waitForTimeout(300); await p.screenshot({ path: '/tmp/shots/11_disc.png' });
  await p.evaluate(() => { UI.sheet = null; UI.open('world'); UI.tab = 'exp'; UI.render(); });
  console.log(errs.join('\n') || 'NO ERRORS', await p.evaluate(() => JSON.stringify({ g: G.W.explore.gate, d: G.W.day })));
  await b.close();
})();
