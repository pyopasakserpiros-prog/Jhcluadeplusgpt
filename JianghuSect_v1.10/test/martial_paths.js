'use strict';
const assert=require('assert');
const {SIM,JD,CULT,ECO,HC,CPE,AI,STATS:ST,SK,MARTIAL:M}=require('./load');
assert(M,'integrated martial runtime must be loaded');
const W=SIM.create('martial-conservation'), n=W.npcs[0];
n.cult.path='XIAN';n.cult.sub='NONE';n.cult.stage=4;n.cult.track=null;n.cult.techs=[];n.cult.learning=null;n.cp=4000;M.ensure(W);
const subKey=M.subKey('STAR_ARCHER'), techKey=M.techKey('MP_BOW_RAIN');
// Real units transfer before use; invalid/duplicate use is an atomic no-op.
W.sect.crystals[subKey]=1;let price=M.crystalPrice(W,subKey), before=n.cp;
assert(CPE.buy(W,n,{kind:'crystal',key:subKey,price}));assert.equal(W.sect.crystals[subKey]||0,0);assert.equal(n.inv.crystals[subKey],1);assert.equal(n.cp,before-price);assert.equal(n.cult.sub,'NONE');
assert(M.useCrystal(W,n,subKey).ok);assert.equal(n.cult.sub,'STAR_ARCHER');assert.equal(n.inv.crystals[subKey]||0,0);
n.inv.crystals[subKey]=1;const snap=JSON.stringify(n.inv.crystals);assert(!M.useCrystal(W,n,subKey).ok);assert.equal(JSON.stringify(n.inv.crystals),snap);
const wrong=M.subKey('STAFF_GUARD');n.inv.crystals[wrong]=1;assert(!M.useCrystal(W,n,wrong).ok);assert.equal(n.cult.sub,'STAR_ARCHER');assert.equal(n.inv.crystals[wrong],1);
n.inv.crystals[techKey]=2;assert(M.useCrystal(W,n,techKey).ok);assert(n.cult.techs.includes('MP_BOW_RAIN'));assert.equal(n.inv.crystals[techKey],1);assert(!M.useCrystal(W,n,techKey).ok);assert.equal(n.inv.crystals[techKey],1);
// Reusable library manuals: fee is a service, not a unit and never copied into crystals.
W.sect.library.push('MP_BOW_RAIN');const t=CULT.tech('MP_BOW_RAIN'),fee=CPE.techPrice(W,t);assert(M.crystalPrice(W,techKey)<=Math.ceil(fee*.5));assert(M.crystalReward(W,techKey)<=M.crystalPrice(W,techKey)*.4);
const sale=M.crystalPrice(W,techKey);W.sect.crystals[techKey]=2;n.cult.techs=[];before=n.cp;assert(M.buyCrystal(W,n,techKey,sale).ok);assert(M.donateCrystal(W,n,techKey).ok);assert(n.cp<before,'buy/donate cycle strictly loses CP');
const stock=W.sect.crystals[techKey];assert(!M.buyCrystal(W,n,techKey,sale+1).ok);assert.equal(W.sect.crystals[techKey],stock);n.cp=0;assert(!M.buyCrystal(W,n,techKey,sale).ok);assert.equal(W.sect.crystals[techKey],stock);n.cp=4000;
assert(M.startStudy(W,n,'MP_BOW_RAIN').ok);assert(W.sect.library.includes(t.id));assert(!n.cult.techs.includes(t.id));assert(n.cult.learning);assert(!M.startStudy(W,n,t.id).ok);n.cult.learning=null;
n.inv.techs=['MP_BOW_RAIN'];before=n.cp;assert.equal(M.donateManual(W,n,t.id).reward,0);assert.equal(n.cp,before,'duplicate manuals mint zero CP');
// All techniques and subpaths have explicit progression; no HC mutations or accumulation.
const original=JSON.stringify(n.h.physiology);n.cult.path='BODY';n.cult.sub='SOLAR_FORGE';n.cult.stage=1;const early=M.progression(n);n.cult.stage=4;const late=M.progression(n);assert(late.body.strength>early.body.strength);assert(late.life.FORGING>1);assert.equal(JSON.stringify(n.h.physiology),original);assert.deepEqual(M.progression(n),late);
for(const p of Object.values(JD.CULT.paths))for(const sub of p.subPaths){n.cult.path=p.id;n.cult.sub=sub.id;n.cult.stage=1;assert(M.progression(n).identity);}
n.cult.path='BODY';n.cult.sub='NONE';n.cult.stage=2;ST.dirty(n);const bodyAtk=ST.get(n).atk;n.cult.path='XIAN';ST.dirty(n);assert.notEqual(ST.get(n).atk,bodyAtk,'path body bonus feeds actual combat');
// Weapon active multiplier and conditional passives use identical type metadata.
n.cult.path='XIAN';n.cult.sub='STAR_ARCHER';n.cult.stage=4;n.cult.techs=['MP_BOW_RAIN','MP_BOW_FOCUS'];const bow=ECO.mintGear(ECO.recipeById.MP_REC_BOW_1,1), sword=ECO.mintGear(ECO.recipeById.MP_REC_SWORD_1,1);assert.equal(bow.gearType,'BOW');n.equip.WEAPON=bow;ST.dirty(n);const withBow=ST.get(n).crit;const prof=SK.list(n).find(p=>p.id==='MP_BOW_RAIN');assert(prof);assert.equal(M.skillEfficiency(n,prof),1.15);n.equip.WEAPON=sword;ST.dirty(n);assert.equal(M.skillEfficiency(n,prof),.65);assert(ST.get(n).crit<withBow,'unequipping bow clears conditional passive');assert(!SK.list(n).some(p=>p.id==='MP_BOW_FOCUS'),'passives never become active moves');
assert(M.gearSuitability(n,bow).score>M.gearSuitability(n,sword).score,'archer values matching bow over equal tier sword');
const rng=JSON.stringify(W.rng.getState());M.gearSuitability(n,bow);M.describe(W,n);assert.equal(JSON.stringify(W.rng.getState()),rng,'UI and suitability are pure');
// Shared rarity gate applies even to repeated calls and is seeded/bounded.
const A=SIM.create('martial-rarity'),B=SIM.create('martial-rarity');const drops=[];
for(let d=0;d<1000;d++){A.day=B.day=d;for(let i=0;i<40;i++){const a=M.rollDiscovery(A,{tier:4}),b=M.rollDiscovery(B,{tier:4});assert.deepEqual(a,b);if(a)drops.push(a);}}
const counts=k=>drops.filter(x=>x.kind===k).length;assert(counts('techManual')>0&&counts('subManual')>0);assert(counts('crystal')>counts('techManual')*5);assert(counts('techManual')<100&&counts('subManual')<20,'manuals remain exceptionally scarce');assert(A.world.martial.discovery.attempts<=M.RARITY.dailyCap);
// Normal awakening enters a base path, founding NPCs retain valid specializations.
const mortal=W.npcs.find(x=>!x.cult)||W.npcs.at(-1);mortal.cult=null;CULT.awaken(mortal,W.rng,null,W.day);assert.equal(mortal.cult.sub,'NONE');mortal.cult.sub='STAFF_GUARD';mortal.cult.path='XIAN';M.normalize(mortal);assert.equal(mortal.cult.sub,'NONE','cross-path specializations never fallback to another bonus');
const loaded=SIM.deserialize(SIM.serialize(W));assert.deepEqual(loaded.byId[n.id].inv.crystals,n.inv.crystals);assert.deepEqual(loaded.sect.crystals,W.sect.crystals);
// Actual combat activations carry the equipment multiplier into damage, once.
{
 const {COMBAT:C}=require('./load'),a=n,b=W.npcs[1],oldStrike=C.strike,oldRandom=W.rng.next,oldList=SK.list;
 a.cult.path='XIAN';a.cult.sub='STAR_ARCHER';a.cult.stage=4;a.cult.techs=['MP_BOW_RAIN'];a.h.state.qi=CULT.qiMax(a);a.x=b.x=1;a.y=b.y=1;
 SK.list=actor=>actor===a?[Object.assign({},prof,{M:10,aoe:false})]:oldList(actor);
 const fight={id:77,A:[a.id],B:[b.id],serious:true,log:[]},seen=[];W.rng.next=()=>.5;
 C.strike=(world,f,actor,target,opts)=>{seen.push(opts.M);return {hit:true,dmg:10};};
 for(const weapon of [bow,sword]){a.equip.WEAPON=weapon;a.act={id:'fight',ctx:{cds:{}}};a.cult.tm={};a.h.state.qi=CULT.qiMax(a);ST.dirty(a);C.attack(W,fight,a,b);}
 C.strike=oldStrike;W.rng.next=oldRandom;SK.list=oldList;assert.equal(seen.length,2);assert(Math.abs(seen[0]/seen[1]-1.15/.65)<1e-9,'actual skill damage gets exactly one condition multiplier');
}
// Body deltas enter formulas: removing only the derived body layer changes actual combat, without HC writes.
{
 n.cult.path='BODY';n.cult.sub='SOLAR_FORGE';n.cult.stage=4;n.cult.techs=[];const human=JSON.stringify(n.h.physiology),real=M.eff;ST.dirty(n);const derived=ST.get(n).atk;M.eff=(actor,key)=>HC.eff(actor,key);ST.dirty(n);const raw=ST.get(n).atk;M.eff=real;ST.dirty(n);assert(derived>raw);assert.equal(JSON.stringify(n.h.physiology),human);
}
// Life bonuses change real gathering yield, crafting odds and study progress.
{
 const oldNext=W.rng.next,oldPick=W.rng.pick;W.rng.next=()=>.5;W.rng.pick=list=>list[0];n.cult.path='GOD';n.cult.sub='NONE';n.cult.stage=CULT.PATHS.GOD.maxStage;const baseline=ECO.harvestHerb(W,n,10).length;n.cult.sub='HARVEST_EARTH_GOD';const trained=ECO.harvestHerb(W,n,10).length;assert(trained>baseline,'harvest identity produces actual extra units');
 n.cult.path='BODY';n.cult.sub='NONE';n.cult.stage=CULT.PATHS.BODY.maxStage;n.h.skills.FORGING=35;const r=ECO.recipeById.MP_REC_BOW_3,base=ECO.successChance(n,r);n.cult.sub='SOLAR_FORGE';assert(ECO.successChance(n,r)>base,'forge identity changes actual success odds');
 W.rng.next=oldNext;W.rng.pick=oldPick;
 n.cult.path='HEART_SOUL';n.cult.sub='NONE';n.cult.stage=6;n.cult.learning={id:'MP_BASE_HEART_SOUL',need:9999,got:0};W.t+=1;AI.ACTS.study.tick(n,W);const step=n.cult.learning.got;n.cult.sub='ZEN_VOID_MIND';n.cult.learning.got=0;AI.ACTS.study.tick(n,W);assert(n.cult.learning.got>step,'scripture identity changes actual learning progress');n.cult.learning=null;
}
// A permanent subpath manual serves multiple eligible members, without consumption or new crystals.
{
 const K=SIM.create('reusable-branch'),a=K.npcs[0],b=K.npcs[1];M.ensure(K);K.sect.subLibrary=['STAR_ARCHER'];
 for(const actor of [a,b]){actor.cult.path='XIAN';actor.cult.sub='NONE';actor.cult.stage=3;actor.rank=6;actor.cp=999;actor.inv.crystals={};assert(M.studySubpath(K,actor,'STAR_ARCHER').ok);assert.equal(actor.cult.sub,'STAR_ARCHER');assert.deepEqual(actor.inv.crystals,{});}
 assert.deepEqual(K.sect.subLibrary,['STAR_ARCHER']);assert(!M.studySubpath(K,a,'STAFF_GUARD').ok);
}
// Handover preserves already rolled finite rewards exactly once, including save/reload replay.
{
 const K=SIM.create('finite-handover'),a=K.npcs[0],ex={id:880,kind:'fortune',journal:[]},out={mats:{},pills:{},gear:[],techs:[],recipes:[],notes:[],stones:0,knowledge:[{kind:'crystal',id:techKey},{kind:'subManual',id:'STAR_ARCHER'}]};
 const {EXPED:X}=require('./load');X.handover(K,ex,[a],out);assert.equal(a.inv.crystals[techKey],1);const cp=a.cp;X.handover(K,ex,[a],out);assert.equal(a.inv.crystals[techKey],1);assert.equal(a.cp,cp);
 const loaded=SIM.deserialize(SIM.serialize(K));X.handover(loaded,JSON.parse(JSON.stringify(ex)),[loaded.byId[a.id]],JSON.parse(JSON.stringify(out)));assert.equal(loaded.byId[a.id].inv.crystals[techKey],1);
}
// All new gear is made through paid native forge transactions from real material IDs.
for(const r of JD.MARTIAL.recipes){
 const K=SIM.create('martial-recipe-'+r.id),a=K.npcs[0];K.sect.recipeTier=5;K.sect.stock={};a.cult.stage=5;a.h.skills.FORGING=100;
 r.inputs.forEach(i=>{assert(ECO.matById[i.matId]);ECO.add(K,i.matId,i.count);});const ctx={rid:r.id};assert(AI.ACTS.forge.start(a,K,ctx));r.inputs.forEach(i=>assert.equal(ECO.count(K,i.matId),0));const random=K.rng.next;K.rng.next=()=>.1;const result=ECO.finishCraft(K,a,r,ctx);K.rng.next=random;assert(result.ok);assert.equal(result.gear.gearType,r.gearType);assert.equal(K.sect.gear.length,1);assert(ECO.finishCraft(K,a,r,ctx).rejected);
}
// Acquisition hooks really route through one gate; exhausted budget cannot leak free manuals.
{
 const {CONTENT:C,EXPLORE:EX}=require('./load'),K=SIM.create('gate-hooks'),a=K.npcs[0],reg=JD.EXPANSION.regions[0],out={mats:{},pills:{},gear:[],techs:[],recipes:[],notes:[],rep:0},ex={kind:'fortune',journal:[]},gate=M.rollDiscovery;let calls=0;M.rollDiscovery=()=>{calls++;return null;};
 for(let i=0;i<10;i++)C.discover(K,ex,[a],out,reg);assert.equal(calls,10);assert.equal(out.techs.length,0);M.rollDiscovery=gate;
 assert(K.npcs.every(actor=>!actor.cult||actor.cult.techs.every(id=>!CULT.tech(id).martialRare)),'new rare discoveries never leak through bootstrap');
 const entrant=SIM.addNpc(K,{ageYears:22,stage:2});assert.equal(entrant.cult.sub,'NONE');assert(entrant.cult.techs.includes('MP_BASE_'+entrant.cult.path)||CULT.learnable(entrant,K.sect.library).includes('MP_BASE_'+entrant.cult.path),'base cultivators have a free general curriculum');
}
console.log('PASS martial paths: finite knowledge, economy, rarity, exclusive paths, typed gear, progression and pure scoring');
