'use strict';
const assert=require('assert'),{SIM,JD,ECO,AI}=require('./load');
let crafted=0;
for(const r of JD.EXPANSION.recipes) {
 const W=SIM.create('all-recipes-'+r.id),n=W.npcs[0];W.sect.recipeTier=3;W.sect.knownRecipes=[r.id];n.h.skills[r.craft]=100;
 for(const i of r.inputs)ECO.add(W,i.matId,i.count);
 const ctx={rid:r.id};const action=r.craft==='ALCHEMY'?AI.ACTS.brew:AI.ACTS.forge;
 assert(action.start(n,W,ctx),'eligible native craft '+r.id);
 for(const i of r.inputs)assert.strictEqual(ECO.count(W,i.matId),0,'input deducted '+r.id);
 const old=W.rng.next;W.rng.next=()=>.1;const out=ECO.finishCraft(W,n,r,ctx);W.rng.next=old;
 assert(out.ok,'output '+r.id);
 if(r.outType==='PILL'){assert.strictEqual(out.key,'P:'+r.id);assert.strictEqual(ECO.count(W,out.key),out.n);}
 else {assert.strictEqual(W.sect.gear.length,1);assert.strictEqual(W.sect.gear[0].id,r.id);assert(W.sect.gear[0].combatMult>0||W.sect.gear[0].defMult>0);}
 const before=SIM.serialize(W);assert(ECO.finishCraft(W,n,r,ctx).rejected);assert(SIM.serialize(W)===before);crafted++;
}
console.log('PASS all '+crafted+' imported recipes: native skill gates, actual inputs, functional outputs and replay rejection');
