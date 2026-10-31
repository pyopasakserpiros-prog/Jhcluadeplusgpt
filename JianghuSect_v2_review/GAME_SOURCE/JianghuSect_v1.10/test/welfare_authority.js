'use strict';
const assert=require('assert');const {SIM,ECO,CPE,SECT,CULT}=require('./load');
function world(seed){const W=SIM.create(seed);const master=W.byId[W.sect.masterId],treasurer=W.npcs[1],assistant=W.npcs[2];W.sect.posts.treasury=treasurer.id;treasurer.post='treasury';assistant.assist='treasury';ECO.add(W,'P:BASIC_HP',20);W.sect.reserveDirectives.medicine['P:BASIC_HP']=1;assistant.h.state.hp=1;W.rng.next=()=>0;return {W,master,treasurer,assistant};}
{
 const {W,treasurer,assistant}=world('welfare-authority');
 treasurer.away=true;CPE.welfareDaily(W);
 let h=W.sect.welfareHistory[0];assert(h,'distribution must be logged');assert.equal(h.treasurerId,assistant.id,'appointed treasury assistant acts while treasurer away');assert.equal(h.acting,true);
 assert(W.sect.welfareAuthority && W.sect.welfareAuthority.id===assistant.id,'acting appointment recorded');
 treasurer.away=false;CPE.welfareDaily(W);assert.equal(W.sect.welfareAuthority.id,treasurer.id,'authority returns to treasurer');assert.equal(W.sect.welfareAuthority.acting,false);
}
{
 const {W,master,treasurer,assistant}=world('welfare-absence');treasurer.dead=true;assistant.sealed=true;master.away=true;
 W.npcs.forEach(n=>{n.away=true});const stock=ECO.count(W,'P:BASIC_HP');CPE.welfareDaily(W);assert.equal(ECO.count(W,'P:BASIC_HP'),stock,'no available person may dispense medicine');assert(!W.sect.welfareAuthority || W.sect.welfareAuthority.id===null);
}
console.log('PASS welfare authority: appointed acting officer, restoration, physical stock, absence');
{
 const {W,master,treasurer,assistant}=world('welfare-deputy');master.sealed=true;treasurer.away=true;assistant.away=true;
 const deputy=assistant;deputy.away=false;deputy.assist=null;W.sect.deputyId=deputy.id;
 const selected=CPE.welfareOfficer(W);assert.equal(selected.id,deputy.id,'deputy acts while both officers unavailable');assert.equal(W.sect.welfareAuthority.role,'acting_master');
 const prior=W.logs.filter(x=>x.type==='appoint').length;CPE.welfareOfficer(W);assert.equal(W.logs.filter(x=>x.type==='appoint').length,prior,'unchanged officer is not repeatedly appointed');
 const loaded=SIM.deserialize(SIM.serialize(W));assert.equal(loaded.sect.welfareAuthority.id,deputy.id,'acting appointment persists across save');
}
{
 const {W,master,treasurer,assistant}=world('welfare-available-master');treasurer.away=true;assistant.away=true;assert.equal(CPE.welfareOfficer(W).id,master.id,'master may dispense directly');
}
console.log('PASS acting deputy, stable audit record, save/load and master fallback');
