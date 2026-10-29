'use strict';
const assert=require('assert');const {JD,MARTIAL:M,SIM,CULT}=require('./load');
const all=[...JD.TECH.techniques,...JD.TECH.mantras];assert.equal(new Set(all.map(t=>t.id)).size,all.length,'technique IDs must be unique');
assert(all.filter(t=>t.cat==='PASSIVE').length>=90,'passive catalog should be near 100');
for(const r of [1,2,3,4]){const v=M.TIER_WEIGHTS_BY_RANK[r];assert(Math.abs(Object.values(v).reduce((a,b)=>a+b,0)-1)<1e-9);for(let t=1;t<7;t++)assert(v[t]>v[t+1]&&v[t+1]>0);if(r>1)for(let t=2;t<=7;t++){let a=0,b=0;for(let k=t;k<=7;k++){a+=v[k];b+=M.TIER_WEIGHTS_BY_RANK[r-1][k]}assert(a>=b)}}
const W=SIM.create('overhaul-regression'),n=W.npcs.find(x=>x.cult);assert(n);assert(M.maxPassiveSlots(n)>=3);const c=SIM.deserialize(SIM.serialize(W));assert.deepStrictEqual(c.rng.getState(),W.rng.getState());
console.log('PASS catalog IDs, passive availability, tier distribution and save/RNG');
