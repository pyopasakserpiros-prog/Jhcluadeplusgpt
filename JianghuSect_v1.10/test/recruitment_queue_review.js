'use strict';
const assert=require('assert');
const {SIM,SECT}=require('./load');
const W=SIM.create('recruit-batch'),m=W.byId[W.sect.masterId];
W.sect.queue=[];
for(let i=0;i<5;i++)W.sect.queue.push(W.makeNpc({quality:0,ageYears:20,rank:0,fromApplicant:true,queue:true}));
const before=W.npcs.length,old=SECT.appraise;SECT.appraise=()=>1000;W.rng.next=()=>0;
SECT.processApplicants(W,m);SECT.appraise=old;
assert(W.npcs.length-before>1,'registration should admit several eligible applicants in a day');
assert(W.npcs.length<=['dorm_outer','dorm_inner','dorm_core'].reduce((s,id)=>s+W.map.byId[id].stations.length,0),'admissions cannot exceed beds');
console.log('PASS multiple applicants admitted without exceeding capacity');
{
 const V=SIM.create('last-bed'),master=V.byId[V.sect.masterId],population=V.npcs.length;
 for(const id of ['dorm_outer','dorm_inner','dorm_core'])V.map.byId[id].stations=[];
 V.map.byId.dorm_outer.stations=Array.from({length:population+1},()=>({}));V.sect.queue=[];
 for(let i=0;i<4;i++)V.sect.queue.push(V.makeNpc({quality:0,ageYears:20,rank:0,fromApplicant:true,queue:true}));
 const original=SECT.appraise;SECT.appraise=()=>1000;V.rng.next=()=>0;
 try{SECT.processApplicants(V,master);}finally{SECT.appraise=original;}
 assert.strictEqual(V.npcs.length,population+1,'only one applicant can occupy the final bed');
 assert.strictEqual(V.sect.queue.length,3,'other applicants should wait when beds are full');
}
