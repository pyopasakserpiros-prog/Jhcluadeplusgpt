const G = require('./load.js'); const { SIM, SECT, HC } = G;
const seed = process.argv[2] || 'seed42', days = +process.argv[3] || 90;
const K = ['openness', 'strictness', 'meritocracy', 'expansion', 'generosity', 'secrecy', 'risk'];
for (let i = 0; i < 3; i++) {
  const W = SIM.create(seed, { masterIdx: i }); const m = W.byId[W.sect.masterId]; const end = W.t + days * 1440; while (W.t < end) SIM.tick(W);
  const posts = SECT.POST_IDS.map(p => { const h = SECT.holder(W, p); return h ? h.h.name.given : '-'; }).join(',');
  console.log('M' + i, HC.fullName(m), HC.identity(m).title, '\n  policy', K.map(k => k + '=' + Math.round(W.sect.policy[k])).join(' '), '\n  stones', Math.round(W.sect.stones), 'sat', Math.round(W.avgSat), 'missions', W.logs.filter(l => l.type === 'mission').length, 'promote', W.logs.filter(l => l.type === 'promote').length, 'recruit', W.logs.filter(l => l.type === 'recruit').length, 'deaths', W.deaths);
}
