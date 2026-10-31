'use strict';
const assert=require('assert'),{SIM,JD,CULT,ECO,EXPED:X,CONTENT:C}=require('./load');
for(const seed of ['initial-manual-leak-7','initial-manual-leak-11','initial-manual-leak-18']) {
 const W=SIM.create(seed);assert(W.npcs.every(n=>!n.cult||n.cult.techs.every(id=>!CULT.tech(id).sourcePack)),'imported starting manual bypass for '+seed);
}
{
 const W=SIM.create('biome-provenance'),n=W.npcs[0],r=JD.EXPANSION.regions[0];n.h.skills.herbalism=100;
 const ex={kind:'gather',region:r.id,journal:[]},out={mats:{},pills:{},gear:[],techs:[],notes:[],rep:0};
 for(let i=0;i<50;i++) C.gather(W,ex,[n],out,r,'gather');
 assert(Object.keys(out.mats).every(id=>r.resources.some(e=>e.id===id&&e.kind==='gather')),'gather never creates monster parts or other-region resources');
 C.gather(W,ex,[n],out,r,'hunt');assert(Object.keys(out.mats).some(id=>ECO.matById[id].category==='BEAST_PART'));
 for(let i=0;i<40;i++) {const dest=C.chooseRegion(W,[n],'gather',X.REGIONS);assert(dest.key!=='frozen','gatherers avoid hunt-only destinations');}
}
console.log('PASS starting curriculum gating and regional acquisition provenance');
