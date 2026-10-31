const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n'))); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(800);
  await p.screenshot({ path: '/tmp/shots/01_start.png' });
  await p.click('[data-pick="0"]'); await p.waitForTimeout(1500);
  await p.screenshot({ path: '/tmp/shots/02_game.png' });
  await p.evaluate(() => { G.speed = 16; }); await p.waitForTimeout(6000); await p.evaluate(() => { G.speed = 1; });
  await p.screenshot({ path: '/tmp/shots/03_after.png' });
  for (const nav of ['people', 'sect', 'log', 'world', 'menu']) { await p.click('[data-nav="' + nav + '"]'); await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/shots/04_' + nav + '.png' }); }
  await p.evaluate(() => UI.close());
  await p.evaluate(() => { const n = G.W.npcs.find(n => !n.dead && !n.away); UI.openNpc(n.id); });
  for (const t of ['ov', 'self', 'body', 'mind', 'skill', 'rel', 'life', 'cmp']) { await p.evaluate(t => { UI.tab = t; UI.render(); document.getElementById('shBody').scrollTop = 0; }, t); await p.waitForTimeout(200); await p.screenshot({ path: '/tmp/shots/05_npc_' + t + '.png' }); }
  await p.evaluate(() => { UI.close(); const n = G.W.npcs.find(n => !n.dead && !n.away); G.R.selected = n.id; G.R.follow = true; G.R.cam.z = 2.5; }); await p.waitForTimeout(1500);
  await p.screenshot({ path: '/tmp/shots/06_follow.png' });
  console.log(errs.length ? errs.join('\n') : 'NO ERRORS'); console.log(await p.evaluate(() => JSON.stringify({ t: G.W.t, n: G.W.npcs.filter(n => !n.dead).length, stones: G.W.sect.stones })));
  await b.close();
})();
