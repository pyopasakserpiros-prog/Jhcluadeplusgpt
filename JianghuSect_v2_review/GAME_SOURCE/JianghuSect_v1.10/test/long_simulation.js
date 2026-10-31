'use strict';
// Complete native ticks with no skipped days; observational accounting, not a wall-clock multiplier benchmark.
const assert=require('assert'),fs=require('fs'),G=require('./load');
const {SIM,ECO,CPE,JD,EXPED:X,CONTENT:C}=G;
const seed=process.argv[2]||'v110-seed1',days=+(process.argv[3]||360),output=process.argv[4];
assert(Number.isInteger(days)&&days>0);
const W=SIM.create(seed),start=W.t,end=start+days*1440,started=performance.now();
const activity={},production={},consumption={},sales={},inflow={},outflow={},monthly=[],events={};
const count=(obj,key,n=1)=>obj[key]=(obj[key]||0)+n;
W.onLog=e=>count(events,e.type);
const add=ECO.add,take=ECO.take,finish=ECO.finishCraft,apply=ECO.applyPill,buy=CPE.buy;
ECO.add=(w,id,n)=>{const before=ECO.count(w,id),res=add(w,id,n);if(w===W&&ECO.count(w,id)>before)count(inflow,id,ECO.count(w,id)-before);return res;};
ECO.take=(w,id,n)=>{const res=take(w,id,n);if(w===W&&res)count(outflow,id,n);return res;};
ECO.finishCraft=(w,n,r,ctx)=>{const res=finish(w,n,r,ctx);if(w===W&&res.ok)count(production,r.id,res.n||1);return res;};
ECO.applyPill=(w,n,key)=>{const res=apply(w,n,key);if(w===W&&res)count(consumption,key);return res;};
CPE.buy=(w,n,p)=>{const res=buy(w,n,p);if(w===W&&res)count(sales,p.key||p.gear.id);return res;};
let lastDay=W.day;
while(W.t<end) {
 SIM.tick(W);
 if(W.t%60===0)for(const n of W.npcs.filter(n=>!n.dead))count(activity,n.away?'AWAY':n.act.id);
 if(W.day!==lastDay) {
  lastDay=W.day;
  for(const [id,q] of Object.entries(W.sect.stock))assert(Number.isFinite(q)&&q>=0,'stock '+id);
  for(const [oid,q] of Object.entries(W.sect.organs||{}))assert(C.organById[oid]&&Number.isSafeInteger(q)&&q>0,'organ stock '+oid);
  assert.strictEqual(new Set(W.sect.knownRecipes).size,W.sect.knownRecipes.length,'no duplicate sect knownRecipes');
  if(W.sect.experiments){
   assert(W.sect.experiments.notes.length<=30,'bounded experiment notes');
   assert(W.sect.experiments.history.length<=40,'bounded experiment history');
  }
  if(W.world.politics){
   assert(W.world.politics.events.length<=40,'bounded political events history');
  }
  for(const n of W.npcs) {
   assert(Number.isFinite(n.cp||0)&&(n.cp||0)>=0,'CP '+n.id);
   for(const v of Object.values(n.h.state))if(typeof v==='number')assert(Number.isFinite(v),'state '+n.id);
   for(const bag of [n.inv.mats,n.inv.pills,n.inv.organs])for(const q of Object.values(bag||{}))assert(Number.isFinite(q)&&q>=0,'personal inventory '+n.id);
   if(n.inv&&Array.isArray(n.inv.recipes)){
    assert.strictEqual(new Set(n.inv.recipes).size,n.inv.recipes.length,'unique personal recipes '+n.id);
    for(const rid of n.inv.recipes)assert(ECO.recipeById[rid],'valid personal recipe '+rid);
   }
   if(n.cult && n.cult.track) {
     assert(Number.isInteger(n.cult.track.ordinal) && n.cult.track.ordinal >= 1 && n.cult.track.ordinal <= 9, 'valid track ordinal 1..9');
     assert(n.cult.track.realmId, 'valid track realmId');
   }
   if(Array.isArray(n.recipes)){
    assert.strictEqual(new Set(n.recipes).size,n.recipes.length,'unique authorized recipes '+n.id);
   }
  }
  assert(W.world.contentHistory.length<=60,'bounded content history');
  if(G.EXT){
   assert((W.world.tradeHistory||[]).length<=80,'bounded external trade history');
   for(const v of W.world.visitors||[])if(v&&v.kind==='trader'){
    assert(Number.isFinite(v.stones)&&v.stones>=0,'visitor wallet '+v.id);
    assert(Number.isFinite(v.untilDay),'visitor expiry '+v.id);
    for(const q of Object.values(v.stock||{}))assert(Number.isSafeInteger(q)&&q>=0,'visitor stock '+v.id);
    for(const q of Object.values(v.wants||{}))assert(Number.isSafeInteger(q)&&q>=0,'visitor demand '+v.id);
   }
   for(const [k,v] of Object.entries(W.world.marketStats||{}))assert(Number.isFinite(v)&&v>=0,'market stat '+k);
  }
  const ledger=W.sect.craftTransactions;if(ledger)assert(Object.keys(ledger.open).length<=W.npcs.length,'bounded active craft reservations');
  for(const r of JD.EXPANSION.regions)for(const e of r.resources) {const q=C.site(W,r).stock[e.id];assert(q>=0&&q<=e.cap,'bounded regional stock');}
  if(W.day%30===0)monthly.push({day:W.day,population:W.npcs.filter(n=>!n.dead).length,stones:Math.round(W.sect.stones),cpMinted:Math.round(CPE.S(W).minted),cpBurned:Math.round(CPE.S(W).burned),priceIndex:CPE.S(W).price,goods:Object.values(W.sect.stock).reduce((a,b)=>a+b,0),formulas:W.sect.knownRecipes.length,heldFormulas:W.npcs.filter(n=>!n.dead).reduce((s,n)=>s+((n.inv&&n.inv.recipes)?n.inv.recipes.length:0),0),sourceManuals:W.sect.library.filter(id=>id.startsWith('SRC110_')).length});
 }
}
const src=o=>Object.fromEntries(Object.entries(o).filter(([id])=>id.includes('SRC110_')));
const marketStats=G.EXT?G.EXT.ensure(W):{};
const result={seed,days,ticks:W.t-start,status:'PASS',elapsedMs:Math.round(performance.now()-started),population:W.npcs.filter(n=>!n.dead).length,deaths:W.deaths,market:{...marketStats,activeVisitors:G.EXT?G.EXT.activeVisitors(W).length:0,historyEntries:(W.world.tradeHistory||[]).length,sectStones:Math.round(W.sect.stones)},cp:{minted:Math.round(CPE.S(W).minted),burned:Math.round(CPE.S(W).burned),price:CPE.S(W).price,purchases:CPE.S(W).sales,studyFees:CPE.S(W).techSales,guidanceFees:Math.round(CPE.S(W).studyFees||0),trainingFees:Math.round(CPE.S(W).trainingFees||0),recipeFees:Math.round(CPE.S(W).recipeFees||0),recipeAuthorizations:CPE.S(W).recipeAuthorizations||0},content:{...W.world.contentMetrics,knownRecipes:W.sect.knownRecipes.length,heldFormulas:W.npcs.filter(n=>!n.dead).reduce((s,n)=>s+((n.inv&&n.inv.recipes)?n.inv.recipes.length:0),0),organsVault:Object.assign({},W.sect.organs||{}),experimentsDiscovered:(W.sect.experiments&&W.sect.experiments.discovered)||[],politics:W.world.politics?{treaties:W.world.politics.treaties,stats:W.world.politics.stats,eventsCount:W.world.politics.events.length}:null},sourceProduction:src(production),sourceConsumption:src(consumption),sourceSales:src(sales),sourceInflow:src(inflow),sourceOutflow:src(outflow),sourceStock:src(W.sect.stock),
  tracks: {
    active: W.npcs.filter(n => !n.dead && n.cult && n.cult.track).map(n => ({ id: n.id, sub: n.cult.track.subPath, ord: n.cult.track.ordinal, realm: n.cult.track.realmNameTh }))
  },activityHourlySamples:activity,events,monthly,saveBytes:Buffer.byteLength(SIM.serialize(W))};
if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({seed,status:result.status,days,ticks:result.ticks,population:result.population,elapsedMs:result.elapsedMs,market:result.market,cp:result.cp,content:result.content,sourceProduction:result.sourceProduction,sourceSales:result.sourceSales}));
