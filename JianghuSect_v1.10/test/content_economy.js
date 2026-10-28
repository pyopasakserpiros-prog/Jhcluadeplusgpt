'use strict';
const assert=require('assert'),G=require('./load');
const {JD,SIM,ECO,CULT,AI,STATS,CONTENT:C,CPE,EXPED:X}=G;
let tests=0;function test(name,fn){fn();tests++;console.log('PASS '+name);}
function world(seed){return SIM.create(seed);}
test('new subpaths have distinctive stat and affinity effects',()=>{
 const W=world('stat-specializations'),n=W.npcs[1];n.cult.path='BODY';n.cult.stage=2;n.cult.sub='WOOD_SPRING_BODY';STATS.dirty(n);
 assert(JD.EXPANSION.subStats && JD.EXPANSION.subStats.WOOD_SPRING_BODY.p.hp>0); assert(JD.EXPANSION.subPreferences.WOOD_SPRING_BODY.aff.BODY_REFINING>0);
});
test('physical imported goods can be donated, sold, consumed with exact transfers',()=>{
 const W=world('medicine-loop'),n=W.npcs[1],r=JD.EXPANSION.recipes.find(r=>r.outType==='PILL'&&r.sourceCompatiblePath==='ANY');
 W.sect.knownRecipes.push(r.id);n.h.skills.ALCHEMY=100;const ctx={rid:r.id};
 for(const i of r.inputs)ECO.add(W,i.matId,i.count);
 assert(AI.ACTS.brew.start(n,W,ctx));const was=W.rng.next;W.rng.next=()=>0.1;
 const result=ECO.finishCraft(W,n,r,ctx);W.rng.next=was;assert(result.ok);
 const key=result.key,stock=ECO.count(W,key),price=CPE.priceOf(W,key);n.cp=price+10;
 assert(CPE.buy(W,n,{kind:'pill',key,price}));assert.strictEqual(ECO.count(W,key),stock-1);assert.strictEqual(n.inv.pills[key],1);assert.strictEqual(n.cp,10);
 n.h.state.hp=1;CPE.autoUse(W,n);assert.strictEqual(n.inv.pills[key]||0,0);assert(n.h.state.hp>1);
});
test('stale or forged shop prices cannot charge or create corrupt balances',()=>{
 const W=world('shop-prices'),n=W.npcs[1],key='P:BASIC_HP';ECO.add(W,key,1);n.cp=100;
 for(const price of [-5,NaN,0]) {assert(!CPE.buy(W,n,{kind:'pill',key,price}));assert.strictEqual(n.cp,100);assert.strictEqual(ECO.count(W,key),1);}
 const current=CPE.priceOf(W,key);assert(!CPE.buy(W,n,{kind:'pill',key,price:current+1}));
 assert(!CPE.spend(W,n,-5,'invalid'));assert.strictEqual(n.cp,100);
 n.cp=0;assert(!CPE.buy(W,n,{kind:'pill',key,price:current}));assert.strictEqual(ECO.count(W,key),1);
});
test('wrong cultivation affinity does not buy or consume specialized medicine',()=>{
 const W=world('medicine-affinity'),n=W.npcs[1],r=JD.EXPANSION.recipes.find(r=>r.sourceCompatiblePath==='BODY'),key='P:'+r.id;
 n.cult.path='GOD';n.cult.sub='WAR_DEITY';n.cp=10000;ECO.add(W,key,1);n.h.state.hp=1;
 const choice=CPE.pickPurchase(W,n);assert(!choice||choice.key!==key);
 n.inv.pills[key]=1;CPE.autoUse(W,n);assert.strictEqual(n.inv.pills[key],1);
});
test('new regional expedition resolves once, roundtrips outcomes and formula access',()=>{
 const W=world('native-expedition'),n=W.npcs[0],r=JD.EXPANSION.regions[0];
 const ex=X.depart(W,[n],'gather',r);assert(ex);X.resolve(W,ex,[n]);
 const before=SIM.serialize(W);X.resolve(W,ex,[n]);assert.strictEqual(SIM.serialize(W),before,'resolved expedition replay is a no-op');
 const loaded=SIM.deserialize(before),copy=loaded.world.expeds.find(e=>e.id===ex.id),nn=loaded.byId[n.id],cp=nn.cp;
 X.resolve(loaded,copy,[nn]);assert.strictEqual(nn.cp,cp);assert.strictEqual(copy.done,true);
});
test('paid imported technique selects and charges the same manual only once',()=>{
 const W=world('new-manual'),n=W.npcs[0],t=JD.EXPANSION.techniques[0];n.cult.path=t.path;n.cult.sub=t.sub;n.cult.stage=3;n.cult.techs=[];n.cult.learning=null;n.rank=4;n.cp=100000;
 W.sect.library=[t.id]; const price=CPE.techPrice(W,t),before=n.cp;
 assert(AI.ACTS.study.start(n,W,{}));assert.strictEqual(n.cult.learning.id,t.id);assert.strictEqual(n.cp,before-price);
 AI.ACTS.study.start(n,W,{});assert.strictEqual(n.cp,before-price);
});
test('legacy paid crafting migrates without consuming inputs a second time',()=>{
 const W=world('legacy-paid'),n=W.npcs[1],r=ECO.recipeById.BASIC_HP;
 n.act={id:'brewBasic',stage:'do',ctx:{rid:r.id},started2:true,left:5,total:65};
 const s=JSON.parse(SIM.serialize(W));delete s.sect.contentVersion;delete s.sect.craftTransactions;s.v='1.0.0';
 const loaded=SIM.deserialize(JSON.stringify(s)),nn=loaded.byId[n.id];assert(nn.act.ctx.craftReceipt);const stock=JSON.stringify(loaded.sect.stock);
 const round=SIM.deserialize(SIM.serialize(loaded));assert.strictEqual(JSON.stringify(round.sect.stock),stock);assert.deepStrictEqual(round.byId[n.id].act.ctx.craftReceipt,nn.act.ctx.craftReceipt);
});
console.log('PASS '+tests+' content economy integration checks');
