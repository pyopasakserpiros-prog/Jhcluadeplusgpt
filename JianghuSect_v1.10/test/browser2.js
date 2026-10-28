// ทดสอบไฟล์เดี่ยว + โหลดเซฟ + ปุ่มเมนูต่าง ๆ บนมือถือแนวตั้ง
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto('file://' + process.cwd() + '/JianghuSect_single.html'); await p.waitForTimeout(600);
  await p.click('[data-pick="1"]'); await p.waitForTimeout(800);
  await p.evaluate(() => { G.speed = 48; }); await p.waitForTimeout(8000); await p.evaluate(() => { G.speed = 0; });
  // เซฟ/โหลดผ่าน UI
  await p.click('[data-nav="menu"]'); await p.waitForTimeout(300); await p.click('[data-do="save"][data-arg="1"]'); await p.waitForTimeout(300);
  const t1 = await p.evaluate(() => G.W.t); await p.evaluate(() => { G.speed = 48; }); await p.waitForTimeout(2500); await p.evaluate(() => { G.speed = 0; });
  await p.click('[data-do="load"][data-arg="1"]'); await p.waitForTimeout(500); const t2 = await p.evaluate(() => G.W.t); console.log('save/load', t1, '->', t2, t1 === t2 ? 'OK' : 'MISMATCH');
  // เครื่องมือผู้สังเกตการณ์
  await p.click('[data-nav="menu"]'); await p.waitForTimeout(300);
  for (const t of ['tools', 'set', 'about']) { await p.click('#shTabs [data-t="' + t + '"]'); await p.waitForTimeout(200); }
  await p.click('#shTabs [data-t="tools"]');
  for (const a of ['stones', 'food', 'recruit', 'banquet', 'tourney', 'heal', 'raid']) { await p.evaluate(a => UI.tool(a), a); await p.waitForTimeout(150); }
  await p.evaluate(() => { UI.close(); G.speed = 4; }); await p.waitForTimeout(4000);
  await p.screenshot({ path: '/tmp/shots/07_raid.png' });
  // เปิดทุกอาคาร
  const n = await p.evaluate(() => { let c = 0; G.W.map.buildings.forEach(b => { UI.openBuilding(b.id); c++; }); UI.close(); return c; }); console.log('buildings opened', n);
  // ทุกตัวละคร ทุกแท็บ
  const cnt = await p.evaluate(() => { let c = 0; G.W.npcs.forEach(n => { ['ov', 'self', 'body', 'mind', 'skill', 'rel', 'life', 'cmp'].forEach(t => { UI.openNpc(n.id, t); c++; }); }); UI.close(); return c; }); console.log('npc tabs rendered', cnt);
  const tabs = await p.evaluate(() => { let c = 0; const m = { people: ['rank', 'act', 'cult', 'mood'], sect: ['over', 'policy', 'posts', 'stock', 'shop', 'bld'], log: ['all', 'sect', 'people', 'train', 'world'], world: ['exp', 'content', 'disc', 'sects', 'hist'], menu: ['main', 'set', 'tools', 'about'] }; for (const k in m) m[k].forEach(t => { UI.sheet = null; UI.open(k); UI.tab = t; UI.render(); c++; }); UI.close(); return c; }); console.log('panel tabs rendered', tabs);
  console.log(errs.length ? errs.join('\n') : 'NO ERRORS'); await b.close();
})();
