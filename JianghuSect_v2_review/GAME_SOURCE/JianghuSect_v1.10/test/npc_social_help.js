'use strict';
const assert=require('assert'),{SIM,COG,CULT,HC,ECO}=require('./load');
assert.equal(typeof COG.giveMedicine,'function','personality-driven medicine sharing exists');
const W=SIM.create('medicine-help'),a=W.npcs[0],b=W.npcs[1];a.h.personality.empathy=95;HC.touch(a);a.h.state.hp=CULT.hpMax(a);b.x=a.x+1;b.y=a.y;b.hidden=false;b.away=false;b.h.state.hp=CULT.hpMax(b)*.2;
ECO.addPersonalPill(a,'P:SRC110_MW_REC_001',1.1);ECO.addPersonalPill(a,'P:BASIC_HP',1.3);const count=()=>W.npcs.reduce((s,n)=>s+(n.inv.pills['P:BASIC_HP']||0),0),before=count(),cp=a.cp;
assert(COG.giveMedicine(W,a,b.id));assert.equal(a.inv.pills['P:SRC110_MW_REC_001'],1,'non-auto-consumable medicine stays with its owner');assert.equal(count(),before,'gift moves exactly one real pill');assert.equal(a.inv.pills['P:BASIC_HP']||0,0);assert.equal(b.inv.pills['P:BASIC_HP'],1);assert.equal(b.inv.pillQuality['P:BASIC_HP'],1.3);assert.equal(a.cp,cp,'gifts do not mint points');assert(!COG.giveMedicine(W,a,b.id),'same inventory cannot be spent twice');
console.log('PASS social help: real transferred medicine, preserved quality, no free pills or points');
