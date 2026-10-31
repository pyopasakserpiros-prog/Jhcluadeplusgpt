'use strict';
const assert=require('assert');
const {SIM,ECO,CPE,CULT,HC,AI}=require('./load');
function setup(){const W=SIM.create('review-injury'),n=W.npcs[0];n.h.skills.ALCHEMY=80;n.cp=1000;n.inv={mats:{MAT_HERB_DEW_GRASS_1:100,MAT_HERB_CINDER_LEAF_1:100},pills:{},craftedPills:[],recipes:[]};n.recipes=[];n.h.state.energy=100;n.h.state.hp=CULT.hpMax(n);HC.touch(n);return {W,n};}
{
 const {W,n}=setup();n.inj=[{until:W.t+100000,severity:1}];let c=CPE.personalCraftChoice(W,n);assert.equal(c.r.id,'BASIC_WOUND');assert.equal(c.intent,'keep');W.rng.next=()=>0;W.rng.gauss=()=>0;assert(ECO.personalCraft(W,n,c.r,c.intent).ok);let until=n.inj[0].until;CPE.autoUse(W,n);assert(n.inj[0].until<until,'personal injury medicine should be used');
}
{
 const {W,n}=setup();n.cult.toxic=80;const c=CPE.personalCraftChoice(W,n);assert.equal(c.r.id,'BASIC_DETOX');assert.equal(c.intent,'keep');
}
{
 const {W,n}=setup();n.h.state.heartDemon=80;const c=CPE.personalCraftChoice(W,n);assert.equal(c.r.id,'BASIC_CALM');assert.equal(c.intent,'keep');
}
console.log('PASS personal medicine responds to injury, toxicity and heart demon');
{
 const {EXPLORE}=require('./load');const pool=EXPLORE.WORLD_BY_ID.godwar.areas[1].subpools[0];assert(!pool.loot.some(item=>item[0]==='relicmat'),'rank 1 must not yield tier 7 relic materials');
}
{
 const {EXPLORE:EX,JD}=require('./load');
 const {W,n}=setup();n.cult.path='XIAN';n.cult.stage=1;n.h.intellect.perceptiveness=100;n.h.skills.herbalism=100;n.h.skills.mining=100;HC.touch(n);
 const pool=EX.WORLD_BY_ID.snow.areas[1].subpools[0];W.explore.gate={...W.explore.gate,world:'snow',open:true,until:W.day+10};const ex=EX.depart(W,[n],'realm');ex.subpoolId=pool.id;ex.days=0;
 const weighted=W.rng.weighted.bind(W.rng);W.rng.gauss=()=>0;W.rng.weighted=(arr,fn)=>arr===pool.enc?arr.find(e=>e[0]==='gather'):arr===pool.loot?arr.find(e=>e[0]==='herb'):weighted(arr,fn);
 EX.resolve(W,ex,[n]);const ids=Object.keys(ex.out.mats);assert(ids.length>0);assert(!ids.includes('MAT_HERB_CINDER_LEAF_1'),'snow herbs must not include fire tea');
 assert(ids.every(id=>JD.ITEMS.materials.find(m=>m.id===id).tier<=2));
}
