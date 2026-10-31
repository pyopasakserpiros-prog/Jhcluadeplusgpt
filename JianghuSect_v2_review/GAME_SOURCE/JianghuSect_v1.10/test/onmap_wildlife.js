'use strict';
const assert=require('assert'),G=require('./load');const {SIM,WILD,COMBAT,MAP}=G;
assert(WILD,'on-map wildlife module must load');
const W=SIM.create('wild-test');WILD.spawn(W,'meadow');WILD.spawn(W,'ridge');
assert.equal(W.wildlife.beasts.length,2);const [a,b]=W.wildlife.beasts;assert.equal(a.zone,'meadow');assert.equal(b.zone,'ridge');assert(a.y>W.map.wall.y1&&b.y>W.map.wall.y1);assert(!MAP.blocked(W.map,a.x,a.y));
assert(a.tier<=2&&b.tier>=3);assert.equal(a.aggressive,false,'low beasts do not attack first');
const h=W.npcs[0];h.x=a.x;h.y=a.y;assert(WILD.startFight(W,h,a));assert(W.foeById[a.id]);
a.dead=true;const f=W.fights.find(x=>x.kind==='wild');WILD.finish(W,f,'A');assert(Object.values(h.inv.mats).some(q=>q>0),'defeated beast supplies real personal inventory');const before=JSON.stringify(h.inv.mats);WILD.finish(W,f,'A');assert.equal(JSON.stringify(h.inv.mats),before,'no duplicate drops');
const legend=WILD.spawn(W,'legend');legend.expires=W.t;legend.fighting=123;W.fights.push({id:123,over:false});WILD.tick(W);assert(W.wildlife.beasts.includes(legend),'legend survives while fighting');W.fights.find(f=>f.id===123).over=true;legend.fighting=null;WILD.tick(W);assert(!W.wildlife.beasts.includes(legend),'legend expires when not fighting');
const save=SIM.serialize(W),loaded=SIM.deserialize(save);assert.deepEqual(loaded.wildlife,JSON.parse(save).wildlife);console.log('PASS on-map wildlife zones, neutral behavior, real drops, no replay, legendary expiry and save');
{
 const W1=SIM.create('wild-deterministic'), W2=SIM.create('wild-deterministic');
 for(const z of ['meadow','ridge','legend']){WILD.spawn(W1,z);WILD.spawn(W2,z);}
 assert.deepEqual(W1.wildlife,W2.wildlife,'same seed gives same actual spawns and legend duration');
 const low=W1.wildlife.beasts[0], n=W1.npcs[0];n.x=low.x;n.y=low.y;W1.t+=15-(W1.t%15);WILD.tick(W1);assert.notEqual(n.act.id,'fight','peaceful low-tier creature does not initiate combat');
 const z=WILD.zones.ridge,b=W1.wildlife.beasts.find(x=>x.zone==='ridge');b.fighting=77;W1.fights.push({id:77,over:false});b.x=z.x0-50;b.y=W1.map.wall.y0;WILD.clampCombat(W1);assert(b.x>=z.x0&&b.y>=z.y0,'fighting beast cannot cross into sect');
 const n2=W2.npcs[0],target=W2.wildlife.beasts[0];assert(AIpath());function AIpath(){return G.AI.ACTS.wildHunt.can(n2,W2)&&!!G.AI.goTo(W2,n2,target.x,target.y);}
}
console.log('PASS deterministic spawning, peaceful proximity, exterior boundary and autonomous hunter route');
