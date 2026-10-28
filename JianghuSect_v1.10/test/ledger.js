const G = require('./load.js'); const { SIM, ECO } = G;
const years=+process.argv[2]||2, seed=process.argv[3]||'seed1', mi=+process.argv[4]||0;
const W = SIM.create(seed,{masterIdx:mi}); const tally={};
W._tally=(k,a)=>{tally[k]=(tally[k]||0)+a;};
const oe=ECO.earn, op=ECO.pay;
ECO.earn=function(w,a,why){const k='+'+String(why).replace(/[0-9]+/g,'#').slice(0,26);tally[k]=(tally[k]||0)+a;return oe.apply(this,arguments);};
ECO.pay=function(w,a,why){const r=op.apply(this,arguments);const k='-'+String(why).replace(/[0-9]+/g,'#').slice(0,26);if(r!==false)tally[k]=(tally[k]||0)+a;return r;};
const end=W.t+years*360*1440; let ld=W.day;
while(W.t<end){SIM.tick(W);if(W.day!==ld){ld=W.day;if(W.day%180===0){console.log('--',SIM.dateText(W.t),'stones',Math.round(W.sect.stones));}}}
console.log(Object.entries(tally).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,24).map(e=>e[0]+' '+Math.round(e[1]/years)).join('\n'));
