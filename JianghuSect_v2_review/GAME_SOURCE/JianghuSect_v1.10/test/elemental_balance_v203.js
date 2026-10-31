'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, ELEM, HC, CULT, MARTIAL, COMBAT, STATS, SK, EXPED, JD } = G;
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
function near(a,b,epsilon=1e-4) { return Math.abs(a-b)<=epsilon; }
function neutralSynergy() { return {matched:false,qiCostMult:1,dmgMult:1,shieldMult:1,healMult:1,dotMult:1,penAdd:0,critAdd:0,critDmgAdd:0,windDelta:0,qiRestorePct:0,extraSupportDur:0,cleanseHeartDemon:0}; }
function setRoot(npc, element, grade='HEAVENLY') {
  const result = ELEM.setRootProfile(npc, {
    rootCount:1, rootCapacityTrait:'ROOT_CAPACITY_SINGLE',
    elements:[element], grades:[grade]
  });
  assert.ok(result && result.ok, 'test fixture root assignment must succeed');
  npc.h.affinities[element]=100;
  ELEM.ensureNpc(npc);
  npc.ext.elementalSystem.mastery[element]=100;
  ELEM.invalidateNpcCache(npc);
  return npc;
}
function relationMultiplier(a,b) {
  if (a===b) return 1.06;
  const raw = ELEM.EFFICACY_MATRIX[a] && ELEM.EFFICACY_MATRIX[a][b];
  const value = Number.isFinite(raw) ? raw : 0.5;
  return value>=0.72 ? 1.03 : value<=0.28 ? 0.95 : 1.0;
}

// 1. Weighted weapon-to-technique resonance includes every element pair.
{
  const W=SIM.create('v203-weighted-weapon-resonance');
  const attacker=W.npcs[0], defender=W.npcs[1];
  setRoot(attacker,'FIRE');
  attacker.equip=attacker.equip||{};
  attacker.equip.WEAPON={
    id:'V203_WEIGHTED_WEAPON',
    elementProfile:{mode:'INTRINSIC_WEIGHTED',primary:'FIRE',weights:{FIRE:0.5,WATER_ICE:0.5}}
  };
  const skill={
    id:'V203_WEIGHTED_SKILL',
    elementProfile:{mode:'INTRINSIC_WEIGHTED',primary:'FIRE',weights:{FIRE:0.75,WIND:0.25}}
  };
  const result=ELEM.resolveCombatInteraction(attacker,defender,skill);
  const expected=
    0.5*0.75*relationMultiplier('FIRE','FIRE')+
    0.5*0.25*relationMultiplier('FIRE','WIND')+
    0.5*0.75*relationMultiplier('WATER_ICE','FIRE')+
    0.5*0.25*relationMultiplier('WATER_ICE','WIND');
  check(near(result.weaponResonance,expected,0.0001),'weapon resonance is the normalized weighted average of all weapon/technique element pairs');
  check(result.weaponResonance!==1.06,'composite technique does not collapse to its primary-element-only resonance');
}

// 2. Elemental accuracy is passed into actual direct skill hit resolution.
{
  const W1=SIM.create('v203-accuracy-base'), W2=SIM.create('v203-accuracy-boosted');
  const a1=setRoot(W1.npcs[0],'FIRE'), d1=W1.npcs[1];
  const a2=setRoot(W2.npcs[0],'FIRE'), d2=W2.npcs[1];
  const skill={id:'V203_FIRE_ACCURACY',elementProfile:{mode:'INTRINSIC_SINGLE',primary:'FIRE',weights:{FIRE:1}}};
  const interaction=ELEM.resolveCombatInteraction(a2,d2,skill);
  const s1=STATS.get(a1), sd1=STATS.get(d1), s2=STATS.get(a2), sd2=STATS.get(d2);
  const baseHit=s1.acc/(s1.acc+0.55*sd1.eva);
  const boostedHit=(s2.acc+interaction.accBonus)/(s2.acc+interaction.accBonus+0.55*sd2.eva);
  check(interaction.accBonus>0 && boostedHit>baseHit,'a compatible Heavenly root creates a positive real accuracy bonus');
  const threshold=(baseHit+boostedHit)/2;
  W1.rng.next=()=>threshold; W1.rng.chance=()=>false;
  W2.rng.next=()=>threshold; W2.rng.chance=()=>false;
  const f1={id:301,serious:true,A:[a1.id],B:[d1.id],over:false,log:[]};
  const f2={id:302,serious:true,A:[a2.id],B:[d2.id],over:false,log:[]};
  const missed=COMBAT.strike(W1,f1,a1,d1,{M:0.1,type:'p',accAdd:0});
  const hit=COMBAT.strike(W2,f2,a2,d2,{M:0.1,type:'p',accAdd:interaction.accBonus});
  check(missed.hit===false && hit.hit===true,'elemental accuracy bonus changes a borderline strike from miss to hit');
}

// 3. useSkill forwards elemental accuracy to strike; delayed channel ticks retain it.
{
  const W=SIM.create('v203-use-skill-accuracy');
  const a=setRoot(W.npcs[0],'FIRE'), d=W.npcs[1];
  a.cult={path:'XIAN',sub:'SWORD_IMMORTAL',stage:6,prog:0,mantra:null,techs:[],unlockedMantras:[],learning:null,tm:{},toxic:0,lifeBonus:0,attempts:0,pillT:0,pillBoost:0};
  ELEM.ensureNpc(a);
  const skill={id:'V203_DIRECT_FIRE',nameTh:'ทดสอบเพลิง',icon:'🔥',arch:'strike',type:'m',M:0.2,cd:5,wind:2,costPct:0,elementProfile:{mode:'INTRINSIC_SINGLE',primary:'FIRE',weights:{FIRE:1}}};
  const originalStrike=COMBAT.strike, originalEfficiency=MARTIAL.skillEfficiency, originalSynergy=MARTIAL.skillSynergy;
  let directAcc=null, channelAcc=null;
  try {
    MARTIAL.skillEfficiency=()=>1;
    MARTIAL.skillSynergy=()=>neutralSynergy();
    COMBAT.strike=(W,f,attacker,target,opts)=>{directAcc=opts.accAdd;return {hit:false};};
    COMBAT.useSkill(W,{id:303,serious:true,A:[a.id],B:[d.id],over:false,log:[]},a,d,skill,{cds:{}});
    check(Number.isFinite(directAcc) && directAcc>0,'useSkill forwards elemental accuracy to direct technique strikes');

    const chCtx={channeling:{skillId:'V203_CHANNEL',skill:{id:'V203_CHANNEL',nameTh:'คลื่นเพลิง',type:'m',pen:0,elementAccAdd:7.25},targetId:d.id,ticksLeft:1,totalTicks:1,tickM:0.2,finishM:0.5}};
    COMBAT.strike=(W,f,attacker,target,opts)=>{channelAcc=opts.accAdd;return {hit:false};};
    COMBAT.resolveChannelTick(W,{id:304,serious:true,A:[a.id],B:[d.id],over:false,log:[]},a,chCtx);
    check(channelAcc===7.25,'delayed channel tick passes the saved elemental accuracy modifier into strike');
  } finally {
    COMBAT.strike=originalStrike;
    MARTIAL.skillEfficiency=originalEfficiency;
    MARTIAL.skillSynergy=originalSynergy;
  }
}

// 4. Elemental control compatibility changes the actual control-proc roll for human and foe attackers.
function exerciseControlProc(attacker, defender, world, skill, seedLabel) {
  const interaction=ELEM.resolveCombatInteraction(attacker,defender,skill);
  const base=0.78;
  const boosted=Math.max(0.1,Math.min(0.95,base*interaction.controlChanceMult));
  check(boosted>base,seedLabel+' has a real positive control-proc modifier');
  const threshold=(base+boosted)/2;
  const originalStrike=COMBAT.strike, originalPower=COMBAT.power;
  const originalEfficiency=MARTIAL.skillEfficiency, originalSynergy=MARTIAL.skillSynergy;
  let appliedDamageMultiplier=1;
  try {
    COMBAT.power=()=>100;
    COMBAT.strike=(world,f,source,target,options)=>{appliedDamageMultiplier=options.synDmgMult||1;return {hit:true,dmg:1};};
    if(!attacker.foe){MARTIAL.skillEfficiency=()=>1;MARTIAL.skillSynergy=()=>neutralSynergy();}
    world.rng.next=()=>threshold;
    COMBAT.useSkill(world,{id:305,serious:true,A:[attacker.id],B:[defender.id],over:false,log:[]},attacker,defender,skill,{cds:{}});
  } finally {
    COMBAT.strike=originalStrike;
    COMBAT.power=originalPower;
    MARTIAL.skillEfficiency=originalEfficiency;
    MARTIAL.skillSynergy=originalSynergy;
  }
  check((defender.sx||[]).some(x=>x.k==='stun'),seedLabel+' modifier reaches the real status-proc roll');
  check(appliedDamageMultiplier>1,seedLabel+' elemental damage multiplier reaches the real strike');
}
{
  const W=SIM.create('v203-human-control-proc');
  const attacker=setRoot(W.npcs[0],'FIRE'), defender=setRoot(W.npcs[1],'FIRE');
  defender.cult=null;
  attacker.cult={path:'XIAN',sub:'SWORD_IMMORTAL',stage:6,prog:0,mantra:null,techs:[],unlockedMantras:[],learning:null,tm:{},toxic:0,lifeBonus:0,attempts:0,pillT:0,pillBoost:0};
  ELEM.ensureNpc(attacker);
  const skill={id:'V203_HUMAN_FIRE_STUN',nameTh:'เพลิงสะกด',icon:'🔥',arch:'control',type:'m',tier:3,M:0.2,ctrl:'stun',cd:5,wind:2,costPct:0,elementProfile:{mode:'INTRINSIC_SINGLE',primary:'FIRE',weights:{FIRE:1}}};
  exerciseControlProc(attacker,defender,W,skill,'human attacker');
}
{
  const W=SIM.create('v203-foe-control-proc');
  const defender=setRoot(W.npcs[0],'FIRE');
  defender.cult=null;
  const attacker={id:'V203_WATER_BEAST',foe:true,kind:'beast',tier:3,name:'อสูรธารา',element:'WATER_ICE',elementProfile:{mode:'INTRINSIC_SINGLE',primary:'WATER_ICE',weights:{WATER_ICE:1}},hp:100,hpMax:100,power:100,atk:100,matk:100,def:100,mdef:100,eva:30,acc:80,crit:5,critDmg:150,pen:0,cast:100,sx:[],equip:{}};
  W.foes.push(attacker);W.foeById[attacker.id]=attacker;
  const skill={id:'V203_FOE_WATER_STUN',nameTh:'คำรามธารา',icon:'❄️',arch:'control',type:'m',tier:3,M:0.2,ctrl:'stun',cd:5,wind:2,costPct:0,elementProfile:attacker.elementProfile};
  const inter=ELEM.resolveCombatInteraction(attacker,defender,skill);
  check(near(inter.targetCounterMult,1.10),'enemy technique resolves its water-over-fire elemental counter');
  exerciseControlProc(attacker,defender,W,skill,'foe attacker');
}

// 5. Combat AI keeps elemental counter preference after archetype-specific scoring.
{
  const W=SIM.create('v203-elemental-control-ai');
  const target=setRoot(W.npcs[0],'FIRE');
  target.cult=null;
  const neutralControl={id:'V203_NEUTRAL_CONTROL',nameTh:'ท่าสะกดไร้ธาตุ',icon:'✦',arch:'control',type:'m',tier:3,M:0.2,ctrl:'stun',cd:8,wind:4,cost:0,costPct:0};
  const waterControl={id:'V203_WATER_CONTROL',nameTh:'ท่าสะกดธารา',icon:'❄️',arch:'control',type:'m',tier:3,M:0.2,ctrl:'stun',cd:8,wind:4,cost:0,costPct:0,elementProfile:{mode:'INTRINSIC_SINGLE',primary:'WATER_ICE',weights:{WATER_ICE:1}}};
  const foe={id:'V203_AI_FOE',foe:true,kind:'beast',tier:3,name:'อสูรธารา',hp:100,hpMax:100,power:100,atk:100,matk:100,def:100,mdef:100,eva:30,acc:80,crit:5,critDmg:150,pen:0,cast:100,sx:[],equip:{},skl:[neutralControl,waterControl],x:target.x+1,y:target.y+1};
  W.foes.push(foe);W.foeById[foe.id]=foe;
  const f={id:306,serious:true,A:[target.id],B:[foe.id],over:false,log:[]};
  W.fights.push(f);
  W.rng.next=()=>0.5;
  const choice=COMBAT.chooseSkill(W,f,foe,target,{cds:{}});
  check(choice && choice.id==='V203_WATER_CONTROL','combat AI selects elemental counter control skill after its control-archetype score is applied');
}

// 6. Elemental effectiveness scales the actual DOT payload for both human and foe casts.
function testDotMultiplier(attacker, defender, world, skill, label) {
  const interaction=ELEM.resolveCombatInteraction(attacker,defender,skill);
  const stats=STATS.get(attacker);
  const expected=Math.min(0.06,(skill.dot*interaction.totalDamageMult*0.12*(stats[skill.type==='p'?'atk':'matk']/Math.max(1,Math.max(stats.atk,stats.matk)))/12));
  const originalStrike=COMBAT.strike, originalAddStatus=STATS.addStatus;
  const originalEfficiency=MARTIAL.skillEfficiency, originalSynergy=MARTIAL.skillSynergy;
  let observedPer=null;
  try {
    if(!attacker.foe){MARTIAL.skillEfficiency=()=>1;MARTIAL.skillSynergy=()=>neutralSynergy();}
    COMBAT.strike=()=>({hit:true,dmg:1});
    STATS.addStatus=(unit,key,duration,extra)=>{
      if(unit===defender && key==='bleed' && extra && Number.isFinite(extra.per)) observedPer=extra.per;
      return originalAddStatus(unit,key,duration,extra);
    };
    COMBAT.useSkill(world,{id:307,serious:true,A:[attacker.id],B:[defender.id],over:false,log:[]},attacker,defender,skill,{cds:{}});
  } finally {
    COMBAT.strike=originalStrike;
    STATS.addStatus=originalAddStatus;
    MARTIAL.skillEfficiency=originalEfficiency;
    MARTIAL.skillSynergy=originalSynergy;
  }
  check(Number.isFinite(observedPer) && near(observedPer,expected,0.00001),label+' elemental multiplier scales the applied bleed/DOT magnitude exactly once');
}
{
  const W=SIM.create('v203-human-dot-scaling');
  const attacker=setRoot(W.npcs[0],'FIRE'), defender=W.npcs[1];
  defender.cult=null;
  setRoot(defender,'FIRE');
  attacker.cult={path:'XIAN',sub:'SWORD_IMMORTAL',stage:6,prog:0,mantra:null,techs:[],unlockedMantras:[],learning:null,tm:{},toxic:0,lifeBonus:0,attempts:0,pillT:0,pillBoost:0};
  ELEM.ensureNpc(attacker);
  const skill={id:'V203_HUMAN_FIRE_DOT',nameTh:'เพลิงกัดกร่อน',icon:'🔥',arch:'dot',type:'p',M:0.2,dot:1.5,cd:5,wind:2,costPct:0};
  skill.elementProfile={mode:'INTRINSIC_SINGLE',primary:'FIRE',weights:{FIRE:1}};
  testDotMultiplier(attacker,defender,W,skill,'human attacker');
}
{
  const W=SIM.create('v203-foe-dot-scaling');
  const defender=W.npcs[0];
  defender.cult=null;
  setRoot(defender,'FIRE');
  const attacker={id:'V203_WATER_DOT_BEAST',foe:true,kind:'beast',tier:3,name:'อสูรธารา',element:'WATER_ICE',elementProfile:{mode:'INTRINSIC_SINGLE',primary:'WATER_ICE',weights:{WATER_ICE:1}},hp:1000,hpMax:1000,power:10000,atk:10000,matk:10000,def:10000,mdef:10000,eva:30,acc:80,crit:5,critDmg:150,pen:0,cast:100,sx:[],equip:{}};
  const skill={id:'V203_FOE_WATER_DOT',nameTh:'เขี้ยวธารา',icon:'❄️',arch:'dot',type:'p',tier:3,M:0.2,dot:1.5,cd:5,wind:2,costPct:0,elementProfile:attacker.elementProfile};
  W.foes.push(attacker);W.foeById[attacker.id]=attacker;
  testDotMultiplier(attacker,defender,W,skill,'foe attacker');
}

// 7. Defensive/utility archetypes must not receive the offensive counter-selection bonus.
{
  const W=SIM.create('v203-counter-ai-not-offensive');
  const target=W.npcs[0];
  target.cult=null;
  setRoot(target,'FIRE');
  const foe={id:'V203_COUNTER_AI_FOE',foe:true,kind:'beast',tier:3,name:'อสูรธารา',element:'WATER_ICE',elementProfile:{mode:'INTRINSIC_SINGLE',primary:'WATER_ICE',weights:{WATER_ICE:1}},hp:10000,hpMax:10000,power:10000,atk:10000,matk:10000,def:10000,mdef:10000,eva:30,acc:80,crit:5,critDmg:150,pen:0,cast:100,sx:[],equip:{},skl:[
    {id:'V203_DEFENSIVE_COUNTER',nameTh:'ตั้งท่าสวน',icon:'↩️',arch:'counter',type:'p',M:0.5,cd:10,wind:3}
  ]};
  W.foes.push(foe);W.foeById[foe.id]=foe;
  const fight={id:308,serious:true,A:[target.id],B:[foe.id],over:false,log:[]};
  W.rng.next=()=>0.5;
  const choice=COMBAT.chooseSkill(W,fight,foe,target,{cds:{}});
  check(choice===null,'defensive counter stance does not receive an offensive elemental advantage merely because its stored M value is nonzero');
}

// 8. Raid foes enter through the combat initializer and beasts carry their species element into their generated techniques.
{
  const banditWorld=SIM.create('v203-raid-bandit-loadout');
  const banditFight=EXPED.spawnRaid(banditWorld,'bandit',0.3);
  const bandits=banditFight.foes.map(id=>banditWorld.foeById[id]).filter(Boolean);
  check(bandits.length>=3,'bandit raid creates its expected enemy group');
  check(bandits.every(u=>Array.isArray(u.skl)&&u.skl.length>=1),'bandit raid initializes a generated technique loadout for every enemy');
  check(bandits.every(u=>u.act&&u.act.ctx&&u.act.ctx.fid===banditFight.id),'bandit raid foes receive combat context through COMBAT.enter');

  const beastWorld=SIM.create('v203-raid-beast-element-profile');
  const beastFight=EXPED.spawnRaid(beastWorld,'beast',0.3);
  const beasts=beastFight.foes.map(id=>beastWorld.foeById[id]).filter(Boolean);
  check(beasts.length>=1,'beast raid creates at least one beast');
  check(beasts.every(u=>Array.isArray(u.skl)&&u.skl.length>=1),'beast raid initializes generated techniques');
  check(beasts.every(u=>u.speciesId && u.elementProfile && ELEM.getProfile(u).valid),'raid beasts retain their species element profile');
  check(beasts.every(u=>u.skl.every(skill=>ELEM.getProfile(skill).valid && ELEM.getProfile(skill).primary===u.elementProfile.primary)),'each generated beast technique inherits its species element');
  const target=beastWorld.npcs[0];
  target.cult=null;
  setRoot(target,'FIRE');
  const beast=beasts[0], skill=beast.skl[0];
  const matchup=ELEM.resolveCombatInteraction(beast,target,skill);
  const expected=(ELEM.COUNTER_MATRIX[beast.elementProfile.primary]||{})[target.h.root.primaryElement] || 1;
  check(near(matchup.targetCounterMult,expected),'raid beast technique uses its actual species element in the combat counter calculation');
}

console.log('PASS elemental_balance_v203: ' + checks + '/' + checks + ' assertions; weighted weapon resonance, accuracy, control/DOT propagation, offensive AI scoring, foe symmetry and raid initialization verified');
