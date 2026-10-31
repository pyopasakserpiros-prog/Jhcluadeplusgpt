/* Combat & Attributes 2.01: one derived sheet, one direct-hit roll, one HP ledger. */
(function(root){'use strict';
const C=root.LivingCombat.prototype,H=root.HumanCore;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const alive=n=>!!n&&n.alive!==false&&Number(n.health)>0;
const at=n=>n?.stageLocal||n;
const now=c=>Number(c.g.s.t)||0;
const artSigCache=new WeakMap();
const itemSigCache=new WeakMap();
function itemSig(it){
 if(!it||typeof it!=='object')return null;
 let s=itemSigCache.get(it);
 if(s===undefined||s.dur!==it.durability||s.tier!==it.tier||s.cMult!==it.combatMult||s.dMult!==it.defenseMult){
  s={dur:it.durability,tier:it.tier,cMult:it.combatMult,dMult:it.defenseMult,str:JSON.stringify([it.id,it.slot,it.tier,it.minStageReq,it.compatiblePath,it.durability,it.combatMult,it.defenseMult,it.setId,it.weaponSpirit?.bonusMult,it.combatStats,it.stats,it.statBonuses])};
  itemSigCache.set(it,s);
 }
 return s.str;
}
function artSig(a){
 if(!a||typeof a!=='object')return null;
 let s=artSigCache.get(a);
 if(s===undefined){s=JSON.stringify([a.path,a.subPath,a.tier,a.requiredNormalizedTier,a.category,a.innateRoute,a.crossPathCompatibility,a.combatStats,a.statBonuses,a.combat117?.role]);artSigCache.set(a,s);}
 return s;
}
// A private projection cache keeps repeated threat/range/GUI reads cheap. The
// signature contains the actual stat inputs, never the simulation's save data.
function statSignature(c,n){
 const j=n?.jianghu,p=at(n)||{},h=n?.core?.human,ind=n?.individual||n||{},s=p.combatState||{},time=now(c);
 const b=s.buffs,d=s.debuffs;
 const statuses=b?(b.QI_SURGE?.expiresAt>time?b.QI_SURGE.stacks||1:0)+':'+(b.SWORD_INTENT?.expiresAt>time?b.SWORD_INTENT.stacks||1:0)+':'+(b.IRON_AEGIS?.expiresAt>time?b.IRON_AEGIS.stacks||1:0)+':'+(b.WIND_STRIDE?.expiresAt>time?b.WIND_STRIDE.stacks||1:0)+':'+(b.BLOOD_FRENZY?.expiresAt>time?b.BLOOD_FRENZY.stacks||1:0)+':'+(b.MIND_MIRROR?.expiresAt>time?b.MIND_MIRROR.stacks||1:0):'';
 const debuffs=d?(d.SOUL_TREMOR?.expiresAt>time?1:0)+':'+(d.ARMOR_SUNDER?.expiresAt>time?1:0)+':'+(d.MERIDIAN_SEAL?.expiresAt>time?1:0)+':'+(d.FROST_SHACKLE?.expiresAt>time?1:0):'';
 const story=c.g.s.storyEvents;
 const storyMods=n?.core&&!p.pet&&story?.active&&(c.g.s.heroIds||[]).includes(n.id)?JSON.stringify([(story.doctrines||[]).map(x=>x.mods),(story.aftermaths||[]).filter(a=>Number(a.expiresAt)>time).map(a=>a.mods)]):'';
 if(j){
  const bSig=root.CombatStats201.humanBaseSignature(c.g,n);c._lastBSig=bSig;
  const hp=h?.state?.parts;
  const partsSig=hp?[hp.head,hp.torso,hp.leftArm,hp.rightArm,hp.leftLeg,hp.rightLeg].join(','):'';
  return bSig+'|'+[n.health,p.boss,h?.state?.pain,h?.body?.painTolerance,partsSig,n.core?.condition?.fatigue,n.core?.condition?.moodStress,p.needs?.hunger,j.internalInjury,j.poisonAccumulated,j.pillToxicity,j.heartDemon,statuses,debuffs,(s.chillUntil||0)>time?1:0,(s.exposedUntil||0)>time?1:0,storyMods].join('|');
 }
 return [n?.maxHP,n?.power,n?.tier,n?.speciesId,n?.name,n?.bodyPlan,n?.element,n?.hunger,n?.fatigue,n?.ownerId,n?.trust,ind.individualId,ind.ageClass,ind.hasPriorInjury,ind.rareOrgan?.nameTh,(ind.rareOrgan?.propertyTags||[]).join(','),ind.bodyPlan,ind.element,statuses,debuffs,(s.chillUntil||0)>time?1:0,(s.exposedUntil||0)>time?1:0,storyMods].join('|');
}
C.stats=function(n,options){
 if(options?.explain||!n||typeof n!=='object')return root.CombatStats201.derive(this.g,n,options);
 this._statCache201||=new WeakMap();const key=statSignature(this,n),old=this._statCache201.get(n);
 if(old?.key===key)return old.sheet;
 const sheet=Object.freeze(root.CombatStats201.derive(this.g,n,{...options,preKey:this._lastBSig}));this._statCache201.set(n,{key,sheet});return sheet;
};
C.healthScale=function(n){return n?.core?this.stats(n).maxHP/this.maxHealth(n):1;};
C.toCondition=function(n,raw){return Math.max(0,Number(raw)||0)/Math.max(.01,this.healthScale(n));};
C.fromCondition=function(n,value){return Math.max(0,Number(value)||0)*this.healthScale(n);};
C.cadence=function(n){return 1/Math.max(.15,this.stats(n).attackSpeed);};
C.maxQi=function(n){return this.stats(n).maxQi;};
const qiCost=C.qiCost;
C.qiCost=function(n,art){
 const s=at(n)?.combatState||{},time=now(this),mirror=s.buffs?.MIND_MIRROR?.expiresAt>time||this.passiveEntries(n).some(a=>a.combat117?.buff==='MIND_MIRROR');
 return Math.ceil(qiCost.call(this,n,art)*(mirror?.88:1)*(s.debuffs?.MERIDIAN_SEAL?.expiresAt>time?1.15:1));
};
C.rating=function(n){
 const s=this.stats(n),attack=s.physicalAttack*.65+s.artAttack*.35;
 const defense=1+(s.armor+s.resistance)/200;
 const critical=1+s.critChance*(s.critMultiplier-1);
 return Math.round(Math.max(40,3.4*Math.sqrt(s.maxHP*attack*s.attackSpeed*defense)*critical));
};
C.targetPower=function(n){return this.rating(n);};
C.canEngage=function(n,t){
 const caution=n.personality?.caution??50,courage=n.personality?.courage??50,dist=(a,b)=>Math.hypot(at(a).x-at(b).x,at(a).y-at(b).y);
 const vigor=x=>Math.sqrt(clamp(x.health/this.maxHealth(x),0,1));
 const extra=this.nearbyHostiles(n,t,180).reduce((v,e)=>v+this.targetPower(e)*.75*vigor(e),0);
 const help=this.g.heroes.filter(a=>a!==n&&alive(a)&&a.health>50&&!at(a).offmap&&dist(n,a)<180).reduce((v,a)=>v+this.power(a)*.35*vigor(a),0);
 return this.power(n)*vigor(n)+help>=(this.targetPower(t)*vigor(t)+extra)*clamp(.65+caution*.006-courage*.003,.45,1.25);
};
C.pursue=function(n,t,dt){
 const p=at(n),q=at(t);if(!p||!q)return;
 const end=p.route?.at(-1);
 if(!p.route?.length||now(this)>=(p.pursueAt201||0)||!end||Math.hypot(end.x-q.x,end.y-q.y)>70){p.route=this.g.path(p,q);p.pursueAt201=now(this)+.6;}
 this.g.move(n,dt,48);
};
C.attackType=function(n,art){
 if(art?.combat201?.damageType==='physical'||art?.combat201?.damageType==='art')return art.combat201.damageType;
 return !art||art.path==='BODY'?'physical':'art';
};
C.baseDamage=function(n,target,type='physical'){return this.stats(n)[type==='physical'?'physicalAttack':'artAttack']*.55;};
C.hitChance=function(n,t){const a=this.stats(n),d=this.stats(t),s=this.targetState(t),stance=s?.evadeUntil>now(this)&&s.evadeCharges>0?.13:0;return clamp(.90+(a.accuracy-d.evasion-75)*.0025-stance,.55,.98);};
C.hit=function(n,t,raw,options={}){
 if(!alive(n)||!alive(t))return {hit:false,critical:false,rawDamage:0,damage:0};
 const a=this.stats(n),d=this.stats(t),type=options.type||'physical';
 const hit=this.g.rng.next()<this.hitChance(n,t),ts=this.targetState(t),ns=at(n)?.combatState;
 if(ts){ts.lastIncomingAt=now(this);ts.lastAttackerId=n.id;}
 if(!hit){
  if(ts?.evadeUntil>now(this)&&ts.evadeCharges>0)ts.evadeCharges--;
  this.emit(t,'พลิ้วกายหลบคม',0,'miss');const e=this.g.s.combat.at(-1);if(e){e.targetId=t.id;e.attackerId=n.id;e.critical=false;e.damageType=type;}
  if(ns)ns.missedHits=(ns.missedHits||0)+1;
  return {hit:false,critical:false,rawDamage:0,damage:0,type};
 }
 const critical=this.g.rng.next()<clamp(a.critChance,0,.65);
 const defense=Math.max(0,(type==='physical'?d.armor:d.resistance)-a.penetration);
 const amount=Math.max(0,Number.isFinite(raw)?raw:this.baseDamage(n,t,type))*100/(100+defense)*(critical?a.critMultiplier:1);
 const hp=t.health,healthScale=this.healthScale(t);
 this.g.damage(t,this.toCondition(t,amount),n,false,{combat201:true,critical,type,artId:options.artId||null,moveName:options.moveName||null});
 const damage=Math.max(0,hp-t.health),rawDamage=damage*healthScale;
 if(ns){ns.landedHits=(ns.landedHits||0)+1;if(critical&&damage>0)ns.criticalHits=(ns.criticalHits||0)+1;ns.damageDealt=(ns.damageDealt||0)+rawDamage;}
 return {hit:true,critical,rawDamage,damage,type};
};
C.secondary=function(t,raw,n,options={}){
 if(!alive(t))return 0;
 const mitigation=options.type==='dot'?100/(100+this.stats(t).resistance*.5):1;
 const before=t.health;
 this.g.damage(t,this.toCondition(t,Math.max(0,Number(raw)||0)*mitigation),n,true,{combat201:true,secondary:true,critical:false,type:options.type||'secondary',moveName:options.label||null,artId:options.artId||null});
 return this.fromCondition(t,before-t.health);
};
// Physical equipment/durability and passive arts are already in the derived sheet.
// Only finite-duration reactions belong here; never roll a second evasion/crit.
C.incoming=function(t,amount,n){
 const s=this.targetState(t),time=now(this);if(!s)return {amount,counter:0};
 if(n){s.lastIncomingAt=time;s.lastAttackerId=n.id;}
 if(s.guardUntil>time){amount*=s.guardCharges>0?(s.guardFactor||.52):.82;if(s.guardCharges>0)s.guardCharges--;}
 let counter=0;
 if(s.parryUntil>time&&s.parryCharges>0&&alive(n)){
  amount*=.58;counter=this.toCondition(n,this.fromCondition(t,amount)*(s.reflectRatio||.3)*1.45);
  s.parryCharges--;if(s.parryCharges<=0)s.parryUntil=0;
  this.emit(t,'ปัดป้องสะท้อนกลับ',0,'defense');
 }
 const ward=s.allyWard,guardian=ward&&this.g.world.npcs[ward.guardianId];
 if(amount>0&&ward&&ward.expiresAt>time&&ward.charges>0&&alive(guardian)&&guardian!==t&&guardian.health>10&&!guardian.stageLocal.offmap&&Math.hypot(at(t).x-at(guardian).x,at(t).y-at(guardian).y)<280){
  const protection=this.g.realm?.formationBonus(guardian,'protection')||1;
  const room=this.fromCondition(guardian,Math.max(0,guardian.health-4))*protection;
  const shared=Math.min(28,this.fromCondition(t,amount)*.25,room);
  if(shared>0){ward.charges--;amount=Math.max(0,amount-this.toCondition(t,shared));this.secondary(guardian,shared,n,{label:'รับแรงแทนสหาย'});this.emit(guardian,'รับแรงแทนสหาย',0,'guard');}
 }
 return {amount,counter};
};
const applyControl=C.applyControl;
C.applyControl=function(t,seconds,n){return applyControl.call(this,t,seconds*(1-this.stats(t).controlResist),n);};
const schedule=C.schedule;
C.schedule=function(n,e,s){schedule.call(this,n,e,s);s.globalReadyAt=now(this)+this.cadence(n);};
const basic=C.basic;
C.basic=function(n,t,s){basic.call(this,n,t,s);s.globalReadyAt=now(this)+this.cadence(n);};
C.tick=function(n,dt){
 const s=this.ensure(n);if(!s)return;this.reconcileLoadout(n);
 const sheet=this.stats(n),regen=sheet.qiRegen*(this.inCombat(n)?.30:1);
 s.qi=Math.min(s.maxQi,s.qi+regen*dt);n.jianghu.currentQiV190=s.qi;n.jianghu.maxQiV190=s.maxQi;
 if(Number.isFinite(n.jianghu.currentFaithV1100))n.jianghu.currentFaithV1100=Math.min(100,n.jianghu.currentFaithV1100+dt*(this.inCombat(n)?.08:.4));
 this.tickStatuses(n,dt);
};
C.creatureTechnique=function(n){
 const s=this.stats(n),spId=n.speciesId||n.individual?.speciesId,cat=root.JianghuRealmData?.SPIRIT_BEAST_CATALOG_V300?.[spId];
 const named=n.abilityNameTh||cat?.abilityNameTh||null;
 const hint=[s.archetype,s.archetypeId,spId,n.name,n.individual?.element,n.element,n.individual?.bodyPlan,n.bodyPlan,cat?.element].join(' ').toUpperCase();
 if(/SPIRIT|SOUL|WISP|GHOST|QI|ธาตุ|วิญญาณ/.test(hint))return {id:cat?.abilityId||'BEAST_SPIRIT_WAVE',name:named||'คลื่นปราณอสูรสะท้านภพ',type:'art',multiplier:1.28,cooldown:7.5};
 if(/SWIFT|AGILE|WOLF|FELINE|TIGER|BIRD|FOX|EAGLE|HAWK|WIND|LIGHTNING|หมาป่า|เหยี่ยว|อินทรี|จิ้งจอก/.test(hint))return {id:cat?.abilityId||'BEAST_POUNCE',name:named||'กรงเล็บวายุกระโจนขย้ำ',type:'physical',multiplier:1.35,cooldown:6.5};
 if(/ARMO|HEAVY|TURTLE|TORTOISE|OX|BOAR|BEAR|เต่า|เกราะ|กระทิง|หมูป่า|หมี/.test(hint))return {id:cat?.abilityId||'BEAST_CRUSH',name:named||'พุ่งชนทลายศิลา',type:'physical',multiplier:1.40,cooldown:8.5};
 return {id:cat?.abilityId||'BEAST_FERAL_FANG',name:named||'เขี้ยวอสูรฉีกกระชาก',type:'physical',multiplier:1.28,cooldown:7};
};
C.creatureAct=function(n,t){
 const time=now(this),p=at(n),s=this.targetState(n);
 if(!alive(n)||!alive(t)||!s||s.staggerUntil>time||time<(n.attackAt||0))return false;
 n.attackAt=time+this.cadence(n);s.lastAttackAt=time;s.lastIncomingAt??=-100;s.beastSkills||={};
 const sheet=this.stats(n);s.maxQi=sheet.maxQi;s.qi=clamp(Number.isFinite(s.qi)?s.qi:s.maxQi,0,s.maxQi);
 const technique=this.creatureTechnique(n),cost=8+Math.min(12,(Number(n.tier)||1)*2),ready=time>=(s.beastSkills[technique.id]||0)&&s.qi>=cost;
 const type=ready?technique.type:'physical',raw=this.baseDamage(n,t,type)*(ready?technique.multiplier:1);
 if(ready){s.qi-=cost;s.qiSpent=(s.qiSpent||0)+cost;s.beastSkills[technique.id]=time+technique.cooldown;s.lastMoveName=technique.name;s.lastMoveAt=time;this.emit(n,technique.name,0,'move');}
 else s.lastMoveName='กรงเล็บและคมเขี้ยว';
 this.hit(n,t,raw,{type,artId:ready?technique.id:null,moveName:s.lastMoveName});return true;
};
const tickStatuses=C.tickStatuses;
C.tickStatuses=function(n,dt){
 const s=this.targetState(n),time=now(this),poisonActive=s?.poisonUntil>0?Math.min(Math.max(0,Number(dt)||0),Math.max(0,s.poisonUntil-(s.statusTickAt??time-dt))):0;
 tickStatuses.call(this,n,dt);
 if(s){
  if(poisonActive>0&&alive(n)){
   const ownerId=s.poisonOwnerId,owner=this.g.world.npcs[ownerId]||this.g.s.beasts.find(b=>b.id===ownerId)||(this.g.s.realm?.pets||[]).find(p=>p.id===ownerId);
   this.secondary(n,poisonActive*.35,owner,{type:'dot',label:'พิษกัดกร่อนเส้นปราณ',artId:s.poisonArtId});
  }
  if((s.guardUntil||0)<=time){s.guardCharges=0;s.guardUntil=0;}
  if((s.evadeUntil||0)<=time){s.evadeCharges=0;s.evadeUntil=0;}
  if((s.parryUntil||0)<=time){s.parryCharges=0;s.parryUntil=0;}
  if((s.staggerUntil||0)<=time)s.staggerUntil=0;
  if((s.chillUntil||0)<=time)s.chillUntil=0;
  if((s.poisonUntil||0)<=time){s.poisonUntil=0;delete s.poisonOwnerId;delete s.poisonArtId;}
  if((s.exposedUntil||0)<=time)s.exposedUntil=0;
 }
 if(!n?.core&&alive(n)||n?.stageLocal?.pet&&alive(n)){
  const sheet=this.stats(n);if(!s)return;
  s.maxQi=sheet.maxQi;s.qi=clamp(Number.isFinite(s.qi)?s.qi:s.maxQi,0,s.maxQi);
  const inCombat=time-(s.lastAttackAt??-100)<5;
  s.qi=Math.min(s.maxQi,s.qi+sheet.qiRegen*dt*(inCombat?.3:1));
 }
};
// Off-map encounters share the sheet, hit expectation and defense formulas.
// The journey remains a summary simulation; it never creates fake map actors.
C.encounterPreview=function(n,t,entry=null){
 const a=this.stats(n),d=this.stats(t),type=this.attackType(n,entry?.art);
 const outgoing=(a[type==='physical'?'physicalAttack':'artAttack']*.55)*100/(100+Math.max(0,(type==='physical'?d.armor:d.resistance)-a.penetration));
 const incoming=d.physicalAttack*.55*100/(100+Math.max(0,a.armor-d.penetration));
 const chance=(x,y)=>clamp(.90+(x.accuracy-y.evasion-75)*.0025,.55,.98);
 const multiplier=entry?this.moveFactor(n,entry)*(this.mechanics(entry.art).damage||1):1;
 const offense=outgoing*(1+(multiplier-1)*.45)*a.attackSpeed*chance(a,d)*(1+a.critChance*(a.critMultiplier-1));
 const escortBonus=this.g.progression?.equippedEscortBonus?.(n)||0;
 const threat=incoming*d.attackSpeed*chance(d,a)*(1+d.critChance*(d.critMultiplier-1))*clamp(1-escortBonus*.5,.78,1);
 const vigor=Math.max(.1,n.health/this.maxHealth(n)),beastVigor=Math.max(.1,(t.health??d.maxHP)/Math.max(1,t.maxHP||d.maxHP));
 const ratio=(a.maxHP*vigor/Math.max(.1,threat))/(d.maxHP*beastVigor/Math.max(.1,offense));
 return {npc:a,beast:d,offense,threat,ratio,skillDamage:outgoing*multiplier,winChance:clamp(.5+Math.log(Math.max(.05,ratio))*.22,.12,.96),expectedConditionDamage:this.toCondition(n,threat*Math.min(8,d.maxHP/Math.max(1,offense)))};
};
})(typeof globalThis!=='undefined'?globalThis:this);
