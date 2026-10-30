'use strict';
const assert=require('assert'),g=require('./load');let failed=0;
function check(name,fn){try{fn();console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name+': '+e.message)}}
check('story rewards require all completed nodes',()=>{
 const W=g.SIM.create('codex-grant-guard'),n=W.npcs[0],i=g.VC.spawnClueInstance(W,'CLUE_LEG_WPN_YITIAN_SWORD');
 assert.equal(g.VC.grantNamedStoryReward(W,i,n,[n]).ok,false);
 assert.equal(Object.keys(W.world.claimReceipts).length,0);
});
check('legendary weapon cooldown survives save/load',()=>{
 const W=g.SIM.create('codex-cooldown'),a=W.npcs[0],d=W.npcs[1];a.cult.stage=7;
 a.equip.WEAPON=g.VC.mintLegendaryWeapon(W,'LEG_WPN_YITIAN_SWORD','test');
 const first=g.VC.runWeaponProcs(W,{},a,d,false,{hit:true,dmg:10,crit:false});assert(first);
 const W2=g.SIM.deserialize(g.SIM.serialize(W));
 assert.equal(g.VC.runWeaponProcs(W2,{},W2.byId[a.id],W2.byId[d.id],false,{hit:true,dmg:10,crit:false}),null);
});
check('expired clues cannot grant even with forced trial success',()=>{
 const W=g.SIM.create('codex-expired'),i=g.VC.spawnClueInstance(W,'CLUE_ORD_JADE_LOTUS_2');i.status='expired';
 assert.equal(g.VC.evaluateClueNode(W,i,[W.npcs[0]],{forcePass:true}).ok,false);
});
check('daily planning does not complete local activity',()=>{
 const W=g.SIM.create('codex-local'),n=W.npcs[0],i=g.VC.spawnClueInstance(W,'CLUE_ORD_XIAN_SWORD_T1');
 g.VC.learnClueFragment(W,n,i,{confidence:90});g.ECO.add(W,'meal',30);
 const pick=g.VC.pickActionableClueForNpc;g.VC.pickActionableClueForNpc=(_W,x)=>x===n?{inst:i,step:g.VC.TEMPLATE_BY_ID[i.templateId].steps[0]}:null;
 try{g.VC.daily(W)}finally{g.VC.pickActionableClueForNpc=pick}
 assert.equal(i.nodeAttempts.demonstrate_courtesy||0,0);
});
check('completed clues do not exhaust the active opportunity budget',()=>{
 const W=g.SIM.create('codex-clue-budget');
 for(let x=0;x<g.VC.MAX_ACTIVE_CLUES;x++){const i=g.VC.spawnClueInstance(W,'CLUE_ORD_JADE_LOTUS_2');i.status='claimed'}
 W.day++;W.t+=1440;
 const v=g.VC.spawnGuest(W,{role:'scholar',forceAdmit:'admitted',withClue:true});
 assert(v.clueTemplateId,'terminal records must not block new visitor information');
});
check('clue departures preserve protected work and sleep',()=>{
 const W=g.SIM.create('codex-protected'),n=W.npcs[1],i=g.VC.spawnClueInstance(W,'CLUE_ORD_JADE_LOTUS_2');
 n.act={id:'sleep',stage:'do',ctx:{},left:200,total:200};
 assert(g.AI.isProtectedAction(W,n,'expedition'));
 assert.equal(g.VC.departClueExpedition(W,n,i,[n]),null);
 assert.equal(n.act.id,'sleep');
});
if(failed)process.exitCode=1;
