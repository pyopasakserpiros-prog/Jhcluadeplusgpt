'use strict';
const G = require('./load.js');
const { SIM, HC, CULT, SECT, ECO } = G;
const years = +process.argv[2] || 1, seed = process.argv[3] || 'seed1', mi = +process.argv[4] || 0;
const t0 = Date.now();
const W = SIM.create(seed, { masterIdx: mi });
console.log('created', W.npcs.length, 'npcs in', Date.now() - t0, 'ms; master', HC.fullName(W.byId[W.sect.masterId]));
const total = years * 360 * 1440; const end = W.t + total;
let lastDay = W.day; const issues = [];
while (W.t < end) {
  try { SIM.tick(W); } catch (e) { console.log('CRASH at t', W.t, SIM.dateText(W.t)); console.log(e.stack.split('\n').slice(0, 6).join('\n')); process.exit(1); }
  if (W.day !== lastDay) { lastDay = W.day;
    if (W.day % 30 === 0) {
      let nan = 0; W.npcs.forEach(n => { const s = n.h.state; for (const k in s) if (!Number.isFinite(s[k])) { nan++; issues.push('NaN state ' + k + ' ' + n.id); } if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) { nan++; issues.push('NaN pos ' + n.id); } });
      const alive = W.npcs.filter(n => !n.dead);
      const acts = {}; alive.forEach(n => { const a = n.away ? 'AWAY' : n.act.id; acts[a] = (acts[a] || 0) + 1; });
      console.log(SIM.dateText(W.t), 'pop', alive.length, 'stones', Math.round(W.sect.stones), 'meal', ECO.count(W, 'meal'), 'grain', ECO.count(W, 'grain'), 'fame', Math.round(W.sect.fame), 'sat', Math.round(W.avgSat), JSON.stringify(acts), nan ? 'NaN!' + nan : '');
    }
  }
}
console.log('done in', Date.now() - t0, 'ms');
const cnt = {}; W.logs.forEach(l => cnt[l.type] = (cnt[l.type] || 0) + 1); console.log(JSON.stringify(cnt));
console.log(issues.slice(0, 10));
