'use strict';
const G = require('./load.js'); const { SIM, HC, CULT, STATS, SK, COMBAT } = G;
const seed = process.argv[2] || 'cs1', days = +process.argv[3] || 200;
const W = SIM.create(seed, { masterIdx: 0 }); let crash = 0;
for (let i = 0; i < days * 1440; i++) { try { SIM.tick(W); } catch (e) { console.log('CRASH', SIM.dateText(W.t), e.stack.split('\n').slice(0, 6).join('\n')); crash = 1; break; } }
const al = W.npcs.filter(n => !n.dead && n.cult); const r = al.map(n => CULT.power(n) / CULT.powerLegacy(n)).sort((a, b) => a - b);
console.log('crash', crash, 'n', al.length, 'ratio new/old p10', r[Math.floor(r.length * .1)].toFixed(2), 'median', r[Math.floor(r.length / 2)].toFixed(2), 'p90', r[Math.floor(r.length * .9)].toFixed(2));
const m = W.byId[W.sect.masterId]; const ex = STATS.explain(m); console.log(JSON.stringify(ex.v)); console.log(ex.parts.atk.map(p => p.join(':')).join(' | '));
const cnt = {}; W.logs.forEach(l => cnt[l.type] = (cnt[l.type] || 0) + 1); console.log(JSON.stringify(cnt));
