'use strict';
const assert=require('assert'),{SIM,SECT,AI,COG,HC,ECO}=require('./load');
for(const id of ['provision','herbal','wildwarden','steward']){
 assert(SECT.POSTS[id],'new post '+id+' is registered');
 const W=SIM.create('office-'+id);while(W.npcs.length<16)SIM.addNpc(W,{ageYears:24,rank:2,stage:2});const n=W.npcs[1];SECT.appoint(W,id,n,'test');
 assert.equal(COG.role(W,n).id,id);assert(Number.isFinite(SECT.relevance(id,n)));
 assert(AI.ACTS.duty.where(W,n),'officer has a usable real workplace');
 COG.performDuty(W,n);const p=W.sect.officePlans[id];assert(p&&p.by===n.id&&p.actions.length,'actual office review produces a bounded actionable directive');
 const before=JSON.stringify(W.sect.officePlans);n.dead=true;COG.performDuty(W,n);assert.equal(JSON.stringify(W.sect.officePlans),before,'unavailable officer cannot revise plans');
}
{
 const W=SIM.create('role-personality'),n=W.npcs[1];SECT.appoint(W,'healer',n,'test');n.h.values.sectDuty=95;n.h.personality.discipline=95;n.h.personality.loyalty=95;HC.touch(n);
 const high=COG.modifiers(W,n,'duty').reduce((s,x)=>s+x[1],0);n.h.values.sectDuty=5;n.h.personality.discipline=5;n.h.personality.loyalty=5;HC.touch(n);
 const low=COG.modifiers(W,n,'duty').reduce((s,x)=>s+x[1],0);assert(high>low,'duty is weighted by personality, not a mandatory script');
}
{
 const W=SIM.create('assistant-authority'),n=W.npcs[1];n.assist='alchemy';n.post=null;
 const before=JSON.stringify(W.sect.orders);COG.performDuty(W,n);
 assert.equal(JSON.stringify(W.sect.orders),before,'an assistant cannot issue an official production order');
 W.sect.posts.alchemy=n.id;n.assist=null;COG.reviewOffice(W,n);
 const id=W.sect.officePlans.alchemy.actions[0],beforeBias=COG.modifiers(W,W.npcs[0],id).filter(x=>x[0].startsWith('ข้อเสนอฝ่าย:')).length;
 W.sect.posts.alchemy=null;
 const afterBias=COG.modifiers(W,W.npcs[0],id).filter(x=>x[0].startsWith('ข้อเสนอฝ่าย:')).length;
 assert(beforeBias>afterBias,'dismissed officers no longer issue current directives');
}
{
 const W=SIM.create('herbal-material-shortage');while(W.npcs.length<16)SIM.addNpc(W,{ageYears:24,rank:2,stage:2});const n=W.npcs[1];SECT.appoint(W,'herbal',n);
 const herb=Object.values(ECO.matById).find(m=>m.category==='HERB');assert(herb);
 W.sect.shortageDirectives=[{id:herb.id,nameTh:herb.nameTh,kind:'material',source:'hall',deficit:3,priority:'high'}];
 COG.reviewOffice(W,n);assert.equal(W.sect.officePlans.herbal.targetId,herb.id,'herbal office recognizes actual material shortage records');assert(W.sect.officePlans.herbal.actions.includes('forage'));
}
console.log('PASS new offices: real appointments, suitability, work locations, useful directives, authority and personality');
