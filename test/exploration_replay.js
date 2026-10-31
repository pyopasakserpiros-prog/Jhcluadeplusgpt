'use strict';
const assert=require('assert'),{SIM,EXPLORE:EX,EXPED:X}=require('./load');
for(const kind of ['delve','realm']) {
 const W=SIM.create('replay-'+kind),n=W.npcs[0];
 W.explore.gate.open=true;W.explore.gate.world=EX.WORLDS[0].id;W.explore.gate.tide=0;
 const ex=EX.depart(W,[n],kind);assert(ex);X.resolve(W,ex,[n]);
 const snapshot=SIM.serialize(W);X.resolve(W,ex,[n]);assert(SIM.serialize(W)===snapshot,'replaying '+kind+' must preserve every reward and RNG');
 const L=SIM.deserialize(snapshot),e=L.world.expeds.find(e=>e.id===ex.id),nn=L.byId[n.id],second=SIM.serialize(L);X.resolve(L,e,[nn]);assert(SIM.serialize(L)===second,'reload replay '+kind);
}
console.log('PASS cave/realm rewards, progress, logs and RNG settle once across reload');
