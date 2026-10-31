'use strict';
const assert=require('assert'),G=require('./load'),{SIM,MARTIAL:M,CULT,HC,ECO,STATS:ST,SK,AI}=G;
assert(M.skillRead&&M.skillPractice&&M.retrain,'shared skills and explicit retraining must exist');
const W=SIM.create('retraining'),n=W.npcs[0];M.ensure(W);
assert.equal(Object.keys(M.SKILL_INFO).length,29);assert(HC.SKILL_IDS.every(k=>M.SKILL_INFO[k]));
for(const k of M.SKILL_IDS){const before=M.skillRead(n,k);assert(M.SKILL_INFO[k].effect&&M.SKILL_INFO[k].route);M.skillPractice(n,k,2,1);assert(M.skillRead(n,k)>before,'real training '+k);}
assert(!HC.SKILL_IDS.includes('BOW'));assert(!('BOW' in n.h.skills));assert(n.martialSkills.BOW>0);assert(M.skillRead(n,'not-a-skill')===0);
// Equipped weapon proficiency replaces the maximum of unrelated weapon skills.
n.cult.path='XIAN';n.cult.sub='STAR_ARCHER';n.cult.stage=4;n.cult.techs=['MP_BOW_RAIN'];n.equip.WEAPON=ECO.mintGear(ECO.recipeById.MP_REC_BOW_1,1);n.martialSkills.BOW=5;n.h.skills.SWORD=5;ST.dirty(n);const base=ST.get(n).atk;n.h.skills.SWORD=100;ST.dirty(n);assert.equal(ST.get(n).atk,base);n.martialSkills.BOW=100;ST.dirty(n);assert(ST.get(n).atk>base);
// Same-path change: exact reduction, no arbitrary access, no incompatible old techniques or buffs.
n.cult.path='XIAN';n.cult.sub='SWORD_IMMORTAL';n.cult.stage=6;n.cult.prog=900;n.cult.techs=['MP_SWORD_POISE','MP_BASE_XIAN'];n.cult.learning={id:'MP_SWORD_POISE',need:99,got:50};n.cult.bn={};n.cult.found=.2;n.buffs=[{id:'old',p:{atk:10},until:W.t+9999}];n.sx=[{k:'morale',until:W.t+9999}];n.cp=5000;
const key=M.subKey('STAR_ARCHER'),human=JSON.stringify(n.h.physiology),practice=M.skillRead(n,'BOW'),stage=n.cult.stage;
assert(!M.retrain(W,n,key,{source:'crystal'}).ok);assert.equal(n.cult.stage,stage);n.inv.crystals[key]=1;const quote=M.retrainingQuote(W,n,key,{source:'crystal'});assert(quote.ok);assert.equal(quote.newStage,3);assert(M.retrain(W,n,key,{source:'crystal'}).ok);assert.equal(n.cult.path,'XIAN');assert.equal(n.cult.sub,'STAR_ARCHER');assert.equal(n.cult.stage,3);assert.equal(n.cult.prog,0);assert(!n.cult.learning&&!n.cult.bn&&!n.cult.track&&!n.cult.found);assert.equal(n.inv.crystals[key]||0,0);assert.equal(JSON.stringify(n.h.physiology),human);assert.equal(M.skillRead(n,'BOW'),practice);assert.equal(n.buffs.length,0);assert.equal(n.sx.length,0);assert(!SK.list(n).some(t=>t.id==='MP_SWORD_POISE'));assert(!M.activeTechs(n).includes('MP_SWORD_POISE'));
const activeStats=ST.get(n);n.cult.techs=n.cult.techs.filter(id=>id!=='MP_SWORD_POISE');ST.dirty(n);assert.deepEqual(ST.get(n),activeStats,'dormant old technique contributes zero stats');
// Cross-path change is explicit and resets to stage1; ordinary use stays nondestructive.
const target=M.subKey('STAFF_GUARD');n.inv.crystals[target]=2;const snap=JSON.stringify(n.inv.crystals),cp=n.cp;assert(!M.useCrystal(W,n,target).ok);assert.equal(JSON.stringify(n.inv.crystals),snap);assert(!M.retrain(W,n,target,{source:'crystal'}).ok,'cooldown blocks repeat');assert.equal(n.cp,cp);W.day=n.retrainUntil;assert(M.retrain(W,n,target,{source:'crystal'}).ok);assert.equal(n.cult.path,'BODY');assert.equal(n.cult.stage,1);assert.equal(n.cult.prog,0);assert.equal(n.inv.crystals[target],1);assert(!SK.list(n).some(t=>CULT.tech(t.id).path==='XIAN'));
for(const [old,want] of [[1,1],[2,1],[3,1],[4,2],[5,2],[6,3]])assert.equal(M.retrainingStage(old,false),want);
// Reusable personal/sect manuals pay only a successful current quote, never consume the manual.
W.day=n.retrainUntil;n.cult.stage=4;n.inv.subManuals=['SOLAR_FORGE'];const manual='S:SOLAR_FORGE',fee=M.retrainingQuote(W,n,manual,{source:'personalManual'}).fee;n.cp=0;assert(!M.retrain(W,n,manual,{source:'personalManual'}).ok);assert.equal(n.cult.sub,'STAFF_GUARD');n.cp=5000;assert(!M.retrain(W,n,manual,{source:'personalManual',price:fee+1}).ok);assert(M.retrain(W,n,manual,{source:'personalManual',price:fee}).ok);assert(n.inv.subManuals.includes('SOLAR_FORGE'));assert.equal(n.cp,5000-fee);
// Cost-aware NPC decisions: the same target skill never forces an invested cautious incumbent.
const K=SIM.create('contrasting-decisions'),a=K.npcs[0],b=K.npcs[1];
for(const actor of [a,b]){actor.cult.path='XIAN';actor.cult.sub='SWORD_IMMORTAL';actor.cult.techs=['MP_SWORD_POISE','MP_BASE_XIAN'];actor.inv.crystals={'S:STAR_ARCHER':1,'T:MP_BOW_RAIN':1};actor.martialSkills={BOW:95};actor.h.skills.SWORD=30;actor.equip.WEAPON=ECO.mintGear(ECO.recipeById.MP_REC_BOW_1,1);actor.cp=3000;actor.h.state.energy=90;actor.h.state.satiety=90;actor.h.state.hp=CULT.hpMax(actor);}
a.cult.stage=8;a.h.personality.caution=95;a.h.personality.ambition=25;a.h.personality.rationality=90;
b.cult.stage=2;b.h.personality.caution=20;b.h.personality.ambition=95;b.h.personality.curiosity=90;HC.bump(a);HC.bump(b);
const cautious=M.evaluateRetraining(K,a,'S:STAR_ARCHER'),prepared=M.evaluateRetraining(K,b,'S:STAR_ARCHER');assert(cautious.score<prepared.score);assert.notEqual(cautious.action,'switch');assert.equal(prepared.action,'switch');assert(cautious.reasons.some(s=>/ขั้น|วิชา/.test(s)));assert(prepared.reasons.some(s=>/ธนู|เตรียม|วิชา/.test(s)));
b.inv.crystals={'S:STAR_ARCHER':1};b.equip.WEAPON=null;const unprepared=M.evaluateRetraining(K,b,'S:STAR_ARCHER');assert.equal(unprepared.action,'prepare');assert.equal(M.crystalDecision(K,b,'S:STAR_ARCHER').action,'retain');
b.inv.crystals={};assert(!M.evaluateRetraining(K,b,'S:STAR_ARCHER').accessible);assert(!M.pickRetraining(K,b));
// All skill families visibly affect actual outcomes, including previously inert general skills.
const actor=b;actor.cult.path='GOD';actor.cult.sub='NONE';actor.cult.stage=2;
for(const k of ['MOVEMENT','BODY_REFINING','SOUL_DIVINE','ARRAY','TALISMAN','stealth']){actor.h.skills[k]=0;ST.dirty(actor);const before=ST.get(actor);actor.h.skills[k]=100;ST.dirty(actor);const after=ST.get(actor);assert.notDeepEqual(after,before,'combat effect '+k);}
actor.h.skills.ritual=0;const rate=CULT.rate(actor,1);actor.h.skills.ritual=100;assert(CULT.rate(actor,1)>rate,'ritual affects actual cultivation');
// Review regressions: stable rank previews, receipt-based knowledge replay and full-unit returns at cap.
actor.cult.path='DEMON';actor.cult.sub='SHADOW_ASSASSIN';actor.cult.stage=4;actor.cult.track=CULT.initTrack('SHADOW_ASSASSIN',9,K.day);assert(M.progression(actor,5).scale>=M.progression(actor).scale);
const {EXPED:X}=G,ex={id:900,journal:[]},out={mats:{},pills:{},gear:[],techs:[],recipes:[],notes:[],stones:0,knowledge:[{kind:'crystal',id:key}]};X.handover(K,ex,[actor],out);const q=actor.inv.crystals[key],state=K.rng.getState();X.handover(K,{id:901,journal:[]},[actor],out);assert.equal(actor.inv.crystals[key],q);assert.deepEqual(K.rng.getState(),state);
K.sect.crystals[key]=998;actor.inv.crystals[key]=2;M.returnKnowledge(K,actor);assert.equal((K.sect.crystals[key]||0)+(K.sect.knowledgeOverflow&&K.sect.knowledgeOverflow[key]||0)+(actor.inv.crystals[key]||0),1000);
const escrowBefore=(K.sect.knowledgeOverflow[key]||0);assert.equal(escrowBefore,1);actor.cult.path='BODY';actor.cult.sub='STAFF_GUARD';actor.cult.stage=2;actor.cp=5000;assert(M.buyCrystal(K,actor,key,M.crystalPrice(K,key)).ok);assert.equal(K.sect.crystals[key],999);assert.equal(K.sect.knowledgeOverflow[key]||0,0);assert.equal(actor.inv.crystals[key],1,'overflow becomes accessible stock after a real sale opens room');
actor.inv.crystals[key]=999;K.sect.crystals[key]=999;M.receiveDiscovery(K,actor,{kind:'crystal',id:key});assert.equal(K.sect.knowledgeOverflow[key],1,'discovery overflow stays real and available for refill');
const saved=SIM.deserialize(SIM.serialize(K));assert.deepEqual(saved.byId[actor.id].martialSkills,actor.martialSkills);assert.deepEqual(saved.sect.knowledgeOverflow,K.sect.knowledgeOverflow);
// Real same-map WILD.spawn creatures use the beast taxonomy and taming damage reduction.
{
 const B=SIM.create('beast-proficiency'),p=B.npcs[0],beast=G.WILD.spawn(B,'meadow'),f={id:991,A:[beast.id],B:[p.id],serious:true,log:[]};assert(beast&&beast.wild&&M.isBeast(beast));const random=B.rng.next,damage=G.COMBAT.applyDamage,seen=[];B.rng.next=()=>.5;G.COMBAT.applyDamage=(world,fight,a,d,value)=>{seen.push(value);return false;};
 p.h.skills.BEAST_TAMING=0;ST.dirty(p);G.COMBAT.strike(B,f,beast,p,{M:1,forced:true,noCounter:true,noCrit:true,noReflect:true});p.h.skills.BEAST_TAMING=100;ST.dirty(p);G.COMBAT.strike(B,f,beast,p,{M:1,forced:true,noCounter:true,noCrit:true,noReflect:true});G.COMBAT.applyDamage=damage;B.rng.next=random;assert(seen[1]<seen[0]);assert(Math.abs(seen[0]/seen[1]-1.4)<1e-9);
}
// Base paths and both new branches can really progress without NaN breakthrough odds.
for(const path of Object.keys(CULT.PATHS)){
 const B=SIM.create('base-breakthrough-'+path),p=B.npcs[0];p.cult.path=path;p.cult.sub='NONE';p.cult.stage=1;p.cult.track=null;p.cult.prog=CULT.threshold(p);assert(CULT.ready(p));const chance=CULT.breakthroughChance(p);assert(Number.isFinite(chance)&&chance>0&&chance<1);const random=B.rng.next;B.rng.next=()=>0;assert(CULT.breakthrough(B,p).ok);B.rng.next=random;assert.equal(p.cult.stage,2);
}
for(const sub of ['STAR_ARCHER','STAFF_GUARD']){actor.cult.path=sub==='STAR_ARCHER'?'XIAN':'BODY';actor.cult.sub=sub;actor.cult.stage=2;assert(Number.isFinite(CULT.breakthroughChance(actor)));}
// Categorized skill UI explains all29 effects and explicit preparation without advancing state/RNG.
G.document={getElementById(){return {querySelectorAll(){return[];},style:{},classList:{add(){},remove(){}}};}};require('../js/ui.js');
const beforeUi=SIM.serialize(K),beforeRng=K.rng.getState(),html=G.UI.martialSkills(K,actor),retrainingHtml=G.UI.martialRetraining(K,actor);
for(const info of Object.values(M.SKILL_INFO)){assert(html.includes(info.nameTh));assert(html.includes(info.effect));}for(const group of Object.keys(M.SKILL_GROUPS))assert(html.includes(M.SKILL_GROUP_NAMES[group]));assert(retrainingHtml.includes('ขั้น1'));assert.equal(SIM.serialize(K),beforeUi);assert.deepEqual(K.rng.getState(),beforeRng);
actor.cult.path='BODY';actor.cult.sub='STAFF_GUARD';actor.cult.techs=['MP_BOW_FOCUS'];actor.equip.WEAPON=ECO.mintGear(ECO.recipeById.MP_REC_BOW_1);assert(G.UI.martialNpc(K,actor).includes('หยุดทำงาน (วิถี/สาย/ขั้นไม่ตรง)'),'old-path passive must not be advertised active even with matching gear');
// Daily intent preserves future replacement crystals rather than donating preparation away.
{
 const P=SIM.create('daily-preparation'),p=P.npcs[0];p.cult.path='XIAN';p.cult.sub='SWORD_IMMORTAL';p.cult.stage=2;p.cult.techs=['MP_BASE_XIAN'];p.inv.crystals={'S:STAR_ARCHER':1,'T:MP_BOW_RAIN':1};p.martialSkills={BOW:95};p.h.skills.SWORD=10;p.equip.WEAPON=ECO.mintGear(ECO.recipeById.MP_REC_BOW_1);p.h.personality.ambition=95;p.h.personality.caution=10;p.h.personality.curiosity=95;p.cp=3000;p.h.state.energy=90;p.h.state.satiety=90;p.h.state.hp=CULT.hpMax(p);HC.bump(p);M.daily(P);assert(p.martialIntent&&p.martialIntent.targetKey==='S:STAR_ARCHER');assert.equal(p.inv.crystals['T:MP_BOW_RAIN'],1);assert.equal(p.inv.crystals['S:STAR_ARCHER'],1);
}
console.log('PASS29 skill effects/training, matching weapons, atomic explicit retraining, cost-aware preparation and review regressions');
