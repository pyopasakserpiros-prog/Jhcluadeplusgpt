'use strict';
const assert=require('assert'), G=require('./load');
assert(G.COG,'NPC cognition module must be installed in the real runtime');
const {SIM,HC,COG,CULT,AI,SECT}=G;
function world(seed='cognition'){const W=SIM.create(seed);return {W,n:W.npcs[0]};}
function trait(n,layer,key,v){n.h[layer][key]=v;HC.touch(n);}
{
 const {W,n}=world();const state=JSON.stringify(SIM.serialize(W)),rng=W.rng.getState();
 COG.explain(W,n);COG.modifiers(W,n,'cultivate');COG.role(W,n);
 assert.deepEqual(W.rng.getState(),rng,'read/score must not consume RNG');assert.equal(SIM.serialize(W),JSON.parse(state),'read/score must not mutate simulation');
}
{
 const {W,n}=world();assert.equal(COG.role(W,n).id,'master');W.sect.masterId=W.npcs[1].id;n.rank=6;
 assert.notEqual(COG.role(W,n).id,'master','rank alone must not confer actual office');
 W.sect.posts.alchemy=n.id;n.post='alchemy';assert.equal(COG.role(W,n).id,'alchemy');
 COG.prepare(W,n);assert(COG.explain(W,n).responsibility.includes('โอสถ'));
}
{
 const {W,n}=world();trait(n,'personality','discipline',95);trait(n,'values','sectDuty',95);n.h.state.hp=CULT.hpMax(n);n.h.state.satiety=90;n.h.state.rest=90;
 const regular=COG.modifiers(W,n,'duty').reduce((s,x)=>s+x[1],0);
 n.h.state.hp=CULT.hpMax(n)*.1;
 assert(COG.modifiers(W,n,'heal').reduce((s,x)=>s+x[1],0)>regular,'emergency need overrides role urge');
}
{
 const {W,n}=world();const other=W.npcs[1];other.cult=JSON.parse(JSON.stringify(n.cult));G.STATS.addBuff(other,{id:'rival-strength',dur:100000,p:{atk:10,matk:10,def:10,mdef:10}});n.cognition={version:1,goal:{id:'rival',targetId:W.npcs[1].id,title:'ฝึกฝน',createdAt:W.t,expiresAt:W.t+1440,lastProgress:W.t},memory:[],trace:[],nextReview:W.t+30};
 COG.prepare(W,n);assert.equal(n.cognition.goal.targetId,W.npcs[1].id,'retains chosen intent across nearby decisions');
 W.byId[W.npcs[1].id].dead=true;W.t+=31;COG.prepare(W,n);assert(n.cognition.goal?.targetId!==W.npcs[1].id,'invalid target cancels');
 for(let i=0;i<60;i++)COG.remember(W,n,{kind:'hunt_loss',zoneId:'north_peak',subjectId:'beast-'+i,severity:.8});
 assert(n.cognition.memory.length<=24);const L=SIM.deserialize(SIM.serialize(W));assert.deepEqual(L.byId[n.id].cognition,n.cognition,'cognition plain state survives save/load');
}
{
 const {W,n}=world();trait(n,'personality','caution',95);trait(n,'personality','courage',20);
 const beast={id:'risk',zone:'north_peak',power:CULT.power(n)*.8,x:n.x+2,y:n.y};
 const before=COG.huntValue(W,n,beast);COG.remember(W,n,{kind:'hunt_loss',zoneId:beast.zone,subjectId:'bear',severity:1});
 assert(COG.huntValue(W,n,beast)<before,'bad experience affects matching area');
 assert(COG.huntValue(W,n,{...beast,zone:'meadow'})>COG.huntValue(W,n,beast),'trauma is local, not universal');
}
{
 const {W,n}=world();n.cognition={version:1,goal:null,memory:[],trace:[]};for(let i=0;i<30;i++)COG.chosen(W,n,'leisure',[['พัก',.5]]);
 assert(n.cognition.trace.length<=8);assert.equal(COG.explain(W,n).actionId,'leisure');
}
{
 const {W,n}=world('tech-test');W.sect.library=G.JD.TECH.techniques.map(t=>t.id);
 const cap=Math.min(n.cult.stage,SECT.canLearnTier(W,n));
 const candidates=CULT.learnable(n,W.sect.library).map(CULT.tech).filter(t=>(t.reqTier||t.tier)<=cap&&G.CPE.techPrice(W,t)>0);assert(candidates.length);
 const t=candidates.at(-1),price=G.CPE.techPrice(W,t);n.cp=price+20;n.cult.learning=null;
 n.cognition={version:1,goal:{id:'scripture',title:'เรียนวิชาที่ชอบ',targetId:t.id,createdAt:W.t,expiresAt:W.t+1440,lastProgress:W.t},memory:[],trace:[]};
 assert.equal(AI.nextTechToStudy(W,n).id,t.id,'chosen intention selects the actual desired affordable book');
 assert(AI.ACTS.study.start(n,W,{}));assert.equal(n.cult.learning.id,t.id);assert.equal(n.cp,20,'studying burns the real fee exactly once');
 AI.ACTS.study.start(n,W,{});assert.equal(n.cp,20);
 n.cult.techs.push(t.id);COG.prepare(W,n);assert.notEqual(n.cognition.goal?.targetId,t.id,'learned goal ends instead of repeating');
 const preferred={power:1,tier:1,path:n.cult.path,sub:n.cult.sub},strong={power:128,tier:1,path:'other',sub:'other'};
 trait(n,'personality','rationality',5);assert(COG.techPreference(n,preferred)>COG.techPreference(n,strong),'low rationality can favor affinity over power');
 trait(n,'personality','rationality',95);assert(COG.techPreference(n,strong)>COG.techPreference(n,preferred),'high rationality can favor stronger results');
}
{
 const {W,n}=world('cognitive-replay');for(let i=0;i<720;i++)SIM.tick(W);
 const L=SIM.deserialize(SIM.serialize(W));for(let i=0;i<720;i++){SIM.tick(W);SIM.tick(L);}
 assert.equal(SIM.serialize(W),SIM.serialize(L),'real cognition and choices replay identically after save/load');
}
{
 const {W,n}=world('tech-test');trait(n,'personality','discipline',95);n.h.state.hp=CULT.hpMax(n);n.h.state.rest=90;n.h.state.satiety=90;
 W.sect.library=G.JD.TECH.techniques.map(t=>t.id);const t=CULT.learnable(n,W.sect.library).map(CULT.tech).find(t=>G.CPE.techPrice(W,t)>0);assert(t);n.cp=0;
 n.cognition={version:1,goal:{id:'scripture',targetId:t.id,title:'ออมแต้ม',expiresAt:W.t+1440},trace:[],memory:[]};
 assert(COG.modifiers(W,n,'shop').some(x=>x[1]<0),'real shop action is discouraged while saving CP');
 n.cognition.goal={id:'rival',targetId:W.npcs[1].id,title:'ฝึกฝน',expiresAt:W.t+1440};
 assert(COG.modifiers(W,n,'paidTraining').some(x=>x[1]>0),'real paidTraining action advances rivalry intent');
 n.h.state.hp=CULT.hpMax(n)*.1;
 assert(COG.modifiers(W,n,'paidTraining').some(x=>x[1]<0),'injury safeguard covers real paidTraining');
}
console.log('PASS cognition: read-only explanation, authority, emergencies, goal continuity, outcome memory, bounded save-safe state');
