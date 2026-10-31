'use strict';
const assert=require('assert');
const {SIM,COMBAT:C,STATS:ST,JD}=require('./load');
function encounter(arch,serious=true){
 const W=SIM.create('visual-events-'+arch),a={id:'fxCaster',name:'caster',foe:true,tier:3,power:500,hp:20,hpMax:100,speed:1,x:120,y:70,sx:[],act:{id:'fight',ctx:{}}},d={...a,id:'fxTarget',name:'target',x:122,hp:100,hpMax:100,act:{id:'fight',ctx:{}},sx:[]};
 a.skl=arch?[{id:'fxSkill',nameTh:'skill',arch,icon:'',tier:3,type:'m',cd:30,wind:2,M:12,hits:1,moves:[]}]:[];d.skl=[];
 W.foes=[a,d];W.foeById={[a.id]:a,[d.id]:d};const f={id:1,serious,A:[a.id],B:[d.id]};ST.now=W.t;return {W,a,d,f};
}
for(const arch of ['strike','forbid']){
 const {W,a,d,f}=encounter(arch);C.attack(W,f,a,d);
 assert(a.castFx,'successful active skill emits a visual event');
 assert.equal(a.castFx.kind,arch==='forbid'?'forbidden':'normal');
 assert.equal(a.castFx.x,d.x);assert.equal(a.castFx.y,d.y);assert.equal(a.castFx.t,W.t);
 const first=a.castFx.seq;W.t+=1;ST.now=W.t;C.attack(W,f,a,d);assert.equal(a.castFx.seq,first,'cooldown/basic attack must not replay skill effect');
}
for(const mode of ['basic','silenced','stunned','nonlethal-forbidden']){
 const {W,a,d,f}=encounter(mode==='basic'?null:mode==='nonlethal-forbidden'?'forbid':'strike',mode!=='nonlethal-forbidden');
 if(mode==='silenced')ST.addStatus(a,'silence',10);if(mode==='stunned')ST.addStatus(a,'stun',10);
 C.attack(W,f,a,d);assert.equal(a.castFx,undefined,mode+' does not emit a cast event');
}
console.log('PASS shared skill visuals: ordinary/forbidden active casts, target binding, cooldown, silence, stun, nonlethal gate, basic attacks');

{const {W,a,d,f}=encounter('strike'); a.skl[0].tech=JD.TECH.techniques.find(t=>t.cat==='FORBIDDEN_ART').id; C.attack(W,f,a,d); assert.equal(a.castFx.kind,'forbidden','forbidden category stays distinct even with a different active archetype');}
for(const arch of ['heal','support','summon']){
 const {W,a,d,f}=encounter(arch);Object.assign(a.skl[0],{M:0,team:true,heal:0.3});
 C.attack(W,f,a,d);assert(a.castFx,arch+' activated');assert.equal(a.castFx.x,a.x,arch+' effect stays with caster/team, not enemy');
}
