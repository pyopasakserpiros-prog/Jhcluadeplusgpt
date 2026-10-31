const G = require('./load.js'); const { SIM, EXPLORE } = G;
const days = +process.argv[2] || 90, seed = process.argv[3] || 'ex1', mi = +process.argv[4] || 0;
const W = SIM.create(seed, { masterIdx: mi }); W.explore.gate.next = W.day + 3;
const end = W.t + days * 1440; const t0 = Date.now();
while (W.t < end) SIM.tick(W);
const L = W.logs.filter(l => l.type === 'explore'); console.log('explore logs', L.length, 'time', Date.now() - t0, 'ms');
L.slice(0, 40).forEach(l => console.log(' ', l.text.slice(0, 190)));
const e = W.explore; console.log('cave', JSON.stringify(e.cave), 'spots', JSON.stringify(e.spots), 'relics', e.relics, 'gate', JSON.stringify(e.gate), 'found', Object.keys(e.codex.found).length, 'deaths', W.deaths, 'stones', Math.round(W.sect.stones));
