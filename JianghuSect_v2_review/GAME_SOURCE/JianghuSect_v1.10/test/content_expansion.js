'use strict';
const assert = require('assert');
const G = require('./load.js');
assert(G.CONTENT && G.JD.EXPANSION, 'native source integration must load');
const {CONTENT:C, JD, SIM, ECO, CULT, EXPED:X, AI, SK, CPE} = G;
assert.deepStrictEqual(C.validate(), [], 'all imported definitions must validate');
const D=JD.EXPANSION;
assert.strictEqual(D.subPaths.length,3);
assert.strictEqual(D.regions.length,6);
for (const p of Object.values(JD.CULT.paths)) assert.strictEqual(p.stages.length,p.maxStage);
for (const branch of D.subPaths) {
 const W=SIM.create('branch-'+branch.id), n=W.npcs[1]; n.cult.path=branch.path; n.cult.sub=branch.id; n.cult.stage=3;
 assert(CULT.pathScores(n).some(s=>s.sub===branch.id),'new branch eligible for autonomous choice');
 const t=D.techniques.find(t=>t.sub===branch.id); assert(t,'new branch has actual technique');
 assert(SK.profile(t),'new technique has combat mechanics');
 n.cult.techs=[t.id]; assert(SK.list(n).some(p=>p.id===t.id),'learned technique is usable');
}
{
 const W=SIM.create('gates');
 for(const t of D.techniques) assert(!W.sect.library.includes(t.id),'discovery manual not granted on new game');
 for(const r of D.recipes) assert(!ECO.recipeKnown(W,r),'new formulas require discovery');
 for(const m of D.materials) assert.strictEqual(ECO.count(W,m.id),0,'rare materials not free start stock');
 const r=D.recipes[0]; W.sect.knownRecipes.push(r.id); assert(ECO.recipeKnown(W,r),'formula unlock observes native tier');
}
{
 const W=SIM.create('site-stock'), reg=D.regions[0], before=JSON.stringify(W.rng.getState());
 C.ensure(W); C.ensure(W); assert.strictEqual(JSON.stringify(W.rng.getState()),before,'migration never consumes RNG');
 const table=reg.resources[0], s=C.site(W,reg), cap=s.stock[table.id];
 assert(cap>0); let sum=0;
 for(let i=0;i<cap+10;i++) sum+=C.takeResource(W,reg,table.id,1);
 assert.strictEqual(sum,cap,'limited resource supply shared between parties');
 W.day+=3; const restored=C.site(W,reg); assert(restored.stock[table.id]>0 && restored.stock[table.id]<=table.cap,'replenishment capped');
 const restoredCopy=SIM.deserialize(SIM.serialize(W)); assert.deepStrictEqual(restoredCopy.world.contentSites,W.world.contentSites,'regional state persists');
}
{
 const W=SIM.create('settlement'), n=W.npcs[0], reg=D.regions[0], mat=reg.resources[0].id;
 const ex={id:999,kind:'gather',region:reg.id,journal:[],done:false};
 const out={mats:{[mat]:3},pills:{},gear:[],techs:[D.techniques[0].id],recipes:[D.recipes[0].id],stones:0,notes:[]};
 X.handover(W,ex,[n],out); const snapshot=SIM.serialize(W), cp=n.cp, stock=ECO.count(W,mat);
 X.handover(W,ex,[n],out); assert.strictEqual(n.cp,cp); assert.strictEqual(ECO.count(W,mat),stock);
 const loaded=SIM.deserialize(snapshot), le=JSON.parse(JSON.stringify(ex)), ln=loaded.byId[n.id];
 X.handover(loaded,le,[ln],JSON.parse(JSON.stringify(out))); assert.strictEqual(ln.cp,cp,'reload cannot claim settled rewards twice');
 assert(W.sect.knownRecipes.includes(D.recipes[0].id),'formula physically delivered and registered');
}
{
 const W=SIM.create('save-forward'); W.sect.privateExtension={keep:1};
 const s=JSON.parse(SIM.serialize(W)); s.futureField={keep:42}; s.t=(450*1440)+180;s.runtimeTiming={pendingTicks:13.5,speed:32};
 const loaded=SIM.deserialize(JSON.stringify(s)), again=JSON.parse(SIM.serialize(loaded));
 assert.strictEqual(loaded.season,1,'restore season immediately'); assert.deepStrictEqual(again.futureField,s.futureField,'unknown top-level save fields preserved');
 assert.deepStrictEqual(again.runtimeTiming,s.runtimeTiming); assert.deepStrictEqual(again.sect.privateExtension,s.sect.privateExtension);
 C.ensure(loaded); C.ensure(loaded); assert.deepStrictEqual(loaded.sect.knownRecipes,W.sect.knownRecipes,'migration idempotent');
}
console.log('PASS content integrity, new branches/combat, discovery gates, renewable stocks, exactly-once handover, compatibility');
