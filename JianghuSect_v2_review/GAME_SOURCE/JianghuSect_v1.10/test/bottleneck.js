'use strict';
const G = require('./load.js'); const { SIM, HC, CULT, ECO } = G;
const years = +process.argv[2] || 3, seed = process.argv[3] || 'bn1', mi = +process.argv[4] || 0;
const W = SIM.create(seed, { masterIdx: mi }); const end = W.t + years * 360 * 1440; let lastDay = W.day;
const st = {};
while (W.t < end) { try { SIM.tick(W); } catch (e) { console.log('CRASH', SIM.dateText(W.t), e.stack.split('\n').slice(0, 5).join('\n')); process.exit(1); }
  if (W.day !== lastDay) { lastDay = W.day; if (W.day % 90 === 0) {
    const al = W.npcs.filter(n => !n.dead && n.cult); const dist = {}; al.forEach(n => { const k = n.cult.path[0] + n.cult.stage; dist[k] = (dist[k] || 0) + 1; });
    const stuck = al.filter(n => n.cult.bn).length, wait = al.filter(n => n.cult.bn && n.cult.bn.plan === 'wait').length;
    const tr = Object.keys(W.sect.stock).filter(k => k.startsWith('T:')).map(k => ECO.name(k) + '×' + W.sect.stock[k]);
    const bp = Object.keys(W.sect.stock).filter(k => k.startsWith('P:BT_')).map(k => k.slice(5) + '×' + W.sect.stock[k]);
    console.log(SIM.dateText(W.t).slice(0, 18), 'pop', al.length, JSON.stringify(dist), 'stuck', stuck, 'wait', wait, 'T:', tr.join(','), 'BT:', bp.join(','), 'stones', Math.round(W.sect.stones));
  } } }
const cnt = {}; W.logs.forEach(l => { if (l.type === 'breakthrough') { const k = /สำเร็จ/.test(l.text) ? 'ok' : /ล้มเหลว/.test(l.text) ? 'fail' : /ตัดสินใจ/.test(l.text) ? 'go' : /มอบ/.test(l.text) ? 'grant' : 'other'; cnt[k] = (cnt[k] || 0) + 1; } });
console.log('breakthrough logs', JSON.stringify(cnt));
console.log(W.logs.filter(l => l.type === 'breakthrough').slice(-12).map(l => l.text).join('\n'));
