const G = require('./load.js'); const { SIM } = G;
const days = +process.argv[2]||60, types = (process.argv[3]||'death').split(',');
const W = SIM.create(process.argv[4]||'seed1', {masterIdx:0});
const end = W.t + days*1440; while(W.t<end) SIM.tick(W);
W.logs.filter(l=>types.includes(l.type)).slice(0,+process.argv[5]||40).forEach(l=>console.log(SIM.dateText(l.t).slice(0,22), l.type, l.text));
console.log('alive', W.npcs.filter(n=>!n.dead).length);
