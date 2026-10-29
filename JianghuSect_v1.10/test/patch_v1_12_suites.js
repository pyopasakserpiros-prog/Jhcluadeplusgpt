'use strict';
const assert=require('assert');const {SIM,MARTIAL:M,JD}=require('./load');const W=SIM.create('rank1-tier7');let found=null;
for(let i=0;i<100&&!found;i++)found=M.rollHierarchicalDiscovery(W,{forceKind:'techCrystal',forceTier:7,sourceRank:1,ignoreCap:true,allowLegendary:false});
assert(found,'rank 1 must be capable of awarding a tier 7 technique');const id=found.techId||String(found.id).replace(/^tech:/,'');const t=[...JD.TECH.techniques,...JD.TECH.mantras].find(x=>x.id===id);assert(t&&t.tier===7,'reward must resolve to a genuine tier 7 technique');assert(!M.isInnateTech(t),'innate subpath knowledge must not be a random reward');
console.log('PASS actual rank 1 tier 7 discovery and innate exclusion');
