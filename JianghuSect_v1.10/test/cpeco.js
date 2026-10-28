'use strict';
const G=require('./load.js');const {SIM,CPE}=G;const seed=process.argv[2]||'s1',yrs=+process.argv[3]||1;
const W=SIM.create(seed,{masterIdx:0});const end=W.t+yrs*360*1440;
while(W.t<end){SIM.tick(W);}
const c=W.sect.cp,al=W.npcs.filter(n=>!n.dead);
const cps=al.map(n=>n.cp||0).sort((a,b)=>a-b);
console.log('pop',al.length,'minted',Math.round(c.minted),'burned',Math.round(c.burned),'price',c.price.toFixed(2),'markup',c.markup,'welfare',c.welfare);
console.log('cp min/med/max',Math.round(cps[0]),Math.round(cps[cps.length>>1]),Math.round(cps[cps.length-1]),'sales',c.sales,'techSales',Math.round(c.techSales),'welfareGiven',c.welfareGiven,'donated',Math.round(c.donated));
const st=W.sect.stock;console.log('basic stock',Object.keys(st).filter(k=>k.startsWith('P:BASIC')).map(k=>k+'='+st[k]).join(' '));
const acts={};W.logs.forEach(l=>acts[l.type]=(acts[l.type]||0)+1);console.log(JSON.stringify(acts));
