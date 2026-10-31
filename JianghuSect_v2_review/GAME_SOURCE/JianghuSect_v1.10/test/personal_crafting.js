'use strict';
const assert=require('assert');
const {SIM,ECO,CPE}=require('./load');
const W=SIM.create('personal-craft'),n=W.npcs[0],r=Object.values(ECO.recipeById).find(x=>x.outType==='PILL'&&x.inputs.length===2&&x.craft==='ALCHEMY'&&x.tier===1);
n.h.skills.ALCHEMY=100;n.inv.mats={};n.cp=10000;
for(const i of r.inputs)W.sect.stock[i.matId]=100;
n.inv.mats[r.inputs[0].matId]=r.inputs[0].count;
const before=ECO.count(W,r.inputs[1].matId),q=ECO.personalCraftQuote(W,n,r);
assert(q&&q.missing.length===1&&q.cost>0,'quote accounts for owned ingredients and purchases');
const cp=n.cp;const out=ECO.personalCraft(W,n,r,'keep');
assert(out.ok&&out.product,'successful craft creates owned quality product');
assert.equal(ECO.count(W,r.inputs[1].matId),before-r.inputs[1].count);
assert.equal(n.cp,cp-q.cost);assert(out.product.q>0);assert(n.inv.craftedPills.includes(out.product));
const d=ECO.donatePersonalProduct(W,n,out.product.id);assert(d.ok&&d.reward>=0);assert(!n.inv.craftedPills.includes(out.product));assert(!ECO.donatePersonalProduct(W,n,out.product.id).ok,'product cannot be donated twice');
console.log('PASS personal crafting purchase, quality and once-only donation');
{
 const W2=SIM.create('bought-loop'),n2=W2.npcs[0];n2.h.skills.ALCHEMY=100;n2.inv.mats={};n2.cp=1000;
 for(const i of r.inputs)W2.sect.stock[i.matId]=100;
 const start=n2.cp, quote=ECO.personalCraftQuote(W2,n2,r), craft=ECO.personalCraft(W2,n2,r,'donate');
 assert(craft.ok);const donation=ECO.donatePersonalProduct(W2,n2,craft.product.id);
 assert(donation.ok);assert(donation.reward<=quote.cost);assert(n2.cp<=start,'shop-only craft/donate loop must not create CP');
}
{
 const W3=SIM.create('insufficient'),n3=W3.npcs[0];n3.h.skills.ALCHEMY=100;n3.inv.mats={};n3.cp=0;
 for(const i of r.inputs)W3.sect.stock[i.matId]=100;
 const before=JSON.stringify({stock:W3.sect.stock,cp:n3.cp,inv:n3.inv});assert.equal(ECO.personalCraft(W3,n3,r,'keep').ok,false);
 assert.equal(JSON.stringify({stock:W3.sect.stock,cp:n3.cp,inv:n3.inv}),before,'failed purchase changes nothing');
}
console.log('PASS purchased-only anti-arbitrage and failed purchase rollback');
{
 const {AI}=require('./load'), W4=SIM.create('personal-craft'),n4=W4.npcs[0];n4.h.skills.ALCHEMY=100;n4.cp=10000;n4.inv.recipes=[r.id];n4.recipes=[r.id];n4.inv.mats={[r.inputs[0].matId]:r.inputs[0].count};for(const i of r.inputs)W4.sect.stock[i.matId]=100;
 n4.h.state.hp=1;const act=AI.ACTS.personalBrew;assert(act.can(n4,W4),'eligible owner chooses personal brewing');const dest=act.where(W4,n4);assert(dest&&dest.st.kind==='cauldron'&&dest.st.bkey==='alchemy');assert(act.start(n4,W4,dest));act.done(n4,W4,dest);
 assert.equal(n4.inv.craftedPills.length,1);assert.equal(n4.inv.craftedPills[0].intent,'keep');const before=n4.h.state.hp;AI.ACTS.personalPillUse.done(n4,W4);assert(n4.h.state.hp>before,'crafted pill heals when used');
}
console.log('PASS autonomous personal production selects an actual alchemy station and uses result');
{
 const W5=SIM.create('quality-use'),a=W5.npcs[0],b=W5.npcs[1],key='P:BASIC_HP';
 a.h.state.hp=1;b.h.state.hp=1;W5.sect.stock[key]=0;
 assert(ECO.add(W5,key,1,1.5));assert.equal(ECO.pillQuality(W5,key),1.5);
 const start=a.h.state.hp;ECO.usePill(W5,a,key);const high=(a.h.state.hp-start)/require('./load').CULT.hpMax(a);
 assert(ECO.add(W5,key,1,1));ECO.usePill(W5,b,key);const standard=(b.h.state.hp-1)/require('./load').CULT.hpMax(b);
 assert(high>standard*1.4,'high quality medicine improves actual healing');
}
console.log('PASS donated quality persists into stock and improves actual healing');
{
 const W6=SIM.create('craft-hunt'),n6=W6.npcs[0],ctx={}; n6.h.state.hp=1;n6.inv.craftedPills=[{id:'local',key:'P:BASIC_HP',qty:1,q:1.5,intent:'keep'}];
 assert(CPE.fightUse(W6,n6,ctx),'hurt hunter uses personal medicine in combat');assert(n6.h.state.hp>1);assert.equal(n6.inv.craftedPills.length,0);assert(!CPE.fightUse(W6,n6,ctx),'same unit cannot be used twice');
}
console.log('PASS hunter uses and consumes crafted medicine during combat');
