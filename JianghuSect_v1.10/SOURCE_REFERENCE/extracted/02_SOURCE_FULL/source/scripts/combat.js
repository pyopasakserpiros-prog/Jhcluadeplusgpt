/* Living Combat 1.5 + v1.12/v1.16 Major Expansion — all 66 new manuals and classic arts
   drive real tactical outcomes (Qi siphon, frost slow, soul strike, reflect, barrier, venom, overdrive)
   with strict learned-art & equipment eligibility validation, without changing Human Foundation. */
(function(root){'use strict';
const E=root.World2026Engine||(typeof require==='function'?require('./legacy/src/engine'):null);
const H=root.HumanCore||(typeof require==='function'?require('./human'):null);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const alive=n=>!!n&&n.alive!==false&&Number(n.health)>0;
const ROLE_LABELS={attack:'จู่โจมสังหาร',defense:'คุ้มกายตั้งรับ',movement:'ท่าร่างหลบคม',recovery:'เดินปราณฟื้นฟู',control:'สะกดสกัดจุด',forbidden:'เคล็ดต้องห้าม',basic:'กระบวนท่าพื้นฐาน'};
const CURATED_ARTS={
 attack:[
  'NW_ART_002','NW_ART_004','NW_ART_006','NW_ART_014','NW_ART_016','NW_ART_038','NW_ART_041','NW_ART_047',
  'ART_V112_XIAN_GALE_BLADE_T3','ART_V112_XIAN_NINE_HEAVEN_GALE_T6','ART_V112_XIAN_SWORD_ARRAY_T4','ART_V112_XIAN_FIVE_THUNDER_TALISMAN_T5','ART_V112_XIAN_IMMORTAL_SWORD_GENESIS_T7',
  'ART_V112_BODY_METEOR_FIST_T1','ART_V112_BODY_FALLING_STAR_CRASH_T5','ART_V112_BODY_COSMIC_METEOR_T7','ART_V112_BODY_THORN_WHIP_FIST_T4','ART_V112_BODY_MARTIAL_GOD_FIST_T6',
  'ART_V112_GOD_SPARK_EDICT_T1','ART_V112_GOD_JUDGMENT_HALBERD_T4','ART_V112_GOD_NINE_HEAVEN_TRIBULATION_T6','ART_V112_GOD_SUN_MOON_WHEEL_T6',
  'ART_V112_DEMON_SILENT_DAGGER_T3','ART_V112_DEMON_VOID_SHADOW_KILL_T6','ART_V112_DEMON_FIVE_VENOM_PALM_T2','ART_V112_DEMON_GOLDEN_GU_PARASITE_T4','ART_V112_DEMON_DEVOURING_ABYSS_PALM_T5',
  'ART_V112_SOUL_MIND_BLADE_FLASH_T3','ART_V112_SOUL_TELEKINESIS_SWORD_WHEEL_T5','ART_V112_SOUL_FORMLESS_MIND_SWORD_T7'
 ],
 defense:[
  'ART190_XIAN_007','ART190_XIAN_012','ART190_XIAN_013','ART190_XIAN_021',
  'ART_V112_XIAN_TEMPEST_ROBE_T4','ART_V112_XIAN_FROST_DEW_T1','ART_V112_XIAN_MOON_MIRROR_T3',
  'ART_V112_BODY_STAR_BONE_MANTRA_T2','ART_V112_BODY_IRONWOOD_BARK_T3','ART_V112_BODY_VAJRA_RECOIL_T4',
  'ART_V112_GOD_LOTUS_SANCTUARY_T3','ART_V112_GOD_GOLDEN_INCENSE_DOMAIN_T3','ART_V112_GOD_GUARDIAN_SPEAR_T4',
  'ART_V112_DEMON_BONE_ARMOR_SHIELD_T3',
  'ART_V112_SOUL_VOID_LOTUS_REFLECT_T4','ART_V112_SOUL_BUDDHA_PALM_VOID_T6'
 ],
 control:[
  'ART190_XIAN_011','ART190_XIAN_023',
  'ART_V112_XIAN_FROST_LOTUS_SWORD_T4','ART_V112_XIAN_HEAVEN_NET_ARRAY_T6',
  'ART_V112_BODY_GRAVITY_DOMAIN_T4','ART_V112_BODY_BEAST_KING_ROAR_T5',
  'ART_V112_GOD_FATE_SEVERING_FINGER_T5',
  'ART_V112_DEMON_GHOST_WAIL_MANTRA_T2','ART_V112_DEMON_NETHER_SOUL_CLAW_T5',
  'ART_V112_SOUL_SPIRIT_INK_STROKE_T2','ART_V112_SOUL_MOUNTAIN_RIVER_SCROLL_T4','ART_V112_SOUL_HEAVEN_BRUSH_DECREE_T6','ART_V112_SOUL_SEVEN_EMOTION_MIRAGE_T4','ART_V112_SOUL_ETERNAL_DREAM_REALM_T5'
 ],
 movement:[
  'ART190_XIAN_041','ART190_XIAN_045','ART190_XIAN_051','ART190_BODY_041',
  'ART_V112_XIAN_CLOUD_STEP_T2','ART_V112_XIAN_MOONSHADOW_STEP_T5',
  'ART_V112_BODY_VINE_WEAVE_STEP_T2',
  'ART_V112_GOD_THUNDER_STEP_T2',
  'ART_V112_DEMON_NIGHT_CLOAK_T1',
  'ART_V112_SOUL_BUTTERFLY_DREAM_STEP_T2'
 ],
 recovery:[
  'ART190_XIAN_053','ART190_XIAN_054','ART190_XIAN_058','ART190_XIAN_062',
  'ART_V112_XIAN_WIND_MANTRA_T1','ART_V112_XIAN_NINE_TURN_FIRE_T5','ART_V112_XIAN_JADE_CRANE_BREATH_T2',
  'ART_V112_BODY_SPRING_PULSE_T1','ART_V112_BODY_WORLD_TREE_HEART_T6',
  'ART_V112_GOD_BODHI_DEW_MANTRA_T1','ART_V112_GOD_BODHI_SUTRA_HEAL_T5',
  'ART_V112_DEMON_BLOOD_SIPHON_MANTRA_T3',
  'ART_V112_SOUL_CLEAR_MIRROR_ZEN_T1'
 ],
 forbidden:[
  'ART190_XIAN_073','ART190_XIAN_074',
  'ART_V112_XIAN_ETERNAL_WINTER_T7',
  'ART_V112_BODY_BOILING_BLOOD_FORBIDDEN_T6',
  'ART_V112_GOD_NIRVANA_REBIRTH_T7',
  'ART_V112_DEMON_MYRIAD_VENOM_DOMAIN_T6','ART_V112_DEMON_HEAVEN_DEVOURING_CANON_T7'
 ]
};
const CONTROL_EFFECTS=/SPATIAL_LOCK|TERRAIN_BIND|INTERRUPT_CHANNEL|SILENCE_CAST|GRAVITY_QI_SEAL|CHILL_FREEZE|WEAPON_MAGNET_DISARM|SUPPRESS_POSITIVE_BUFF|FORMATION_DISRUPTION|STAGGER|SOUL_MENTAL_ATTACK/;
const DEFENSE_EFFECTS=/BARRIER_SHIELD|DAMAGE_REFLECT|TIMED_PARRY|RECOIL_COUNTER|GUARDED_DAMAGE_SHARE|TRIBULATION_SHIELD|CONTROL_RESILIENCE|REALM_SUPPRESSION_GUARD|SIDESTEP_EVASION/;
const HEAL_EFFECTS=/MASS_VITAL_HEAL|HEALING_RELAY|VITALITY_STEAL|MERIDIAN_TOXIN_PURGE|PURIFY_HOSTILE_STATUS|QI_TRANSFER/;

class LivingCombat{
 constructor(game){
  this.g=game;
  this.arts=E.getAllTechniquesCatalogV190();
  this.artMap=new Map(this.arts.map(a=>[a.id,a]));
  this.curatedIds=Object.values(CURATED_ARTS).flat();
 }
 validEquippedArt(n,slot){
  const j=n?.jianghu;if(!j)return null;
  const id=j[slot+'Id'];if(!id)return null;
  const art=this.artMap.get(id)||(E.getTechniqueByIdV190?E.getTechniqueByIdV190(id):null);
  if(art&&!this.artMap.has(id))this.artMap.set(id,art);
  const k=j.knowledgeV190?.[id];
  if(!art||!k||k.stage<4||(k.mastery||0)<8)return null;
  if(this.g.progression&&(!this.g.progression.compatible(n,art)||!(this.g.progression.canStudyArtTier?this.g.progression.canStudyArtTier(n,art):((art.requiredNormalizedTier||art.tier||1)<=this.g.progression.tier(n)))))return null;
  return {art,knowledge:k};
 }
 maxQi(n){
  const tier=this.g.progression?.tier(n)||n?.jianghu?.realizationBand||1;
  const meridians=n?.core?.physiology?.meridianCapacity||50;
  const cognition=n?.core?.human?H.effective(n,'cognition','metacognition'):50;
  const mantraEntry=this.validEquippedArt(n,'mantra');
  const auxEntry=this.validEquippedArt(n,'auxiliary');
  const artBonus=(mantraEntry?(mantraEntry.art.tier||1)*5:0)+(auxEntry?(auxEntry.art.tier||1)*3:0);
  return Math.round(clamp(28+tier*10+meridians*.16+cognition*.05+artBonus,35,240));
 }
 location(n){return n?.stageLocal||n;}
 ensure(n){
  if(!n||!n.stageLocal||n.stageLocal.pet)return null;
  const p=n.stageLocal,tier=Number(n.jianghu?.realizationBand)||1;
  let s=p.combatState;
  if(!s||s.schema!==2){
   const max=this.maxQi(n);
   s=p.combatState={schema:2,qi:max,maxQi:max,qiTier:tier,cooldowns:{},guardUntil:0,guardCharges:0,guardFactor:.55,evadeUntil:0,evadeCharges:0,staggerUntil:0,chillUntil:0,poisonUntil:0,parryUntil:0,parryCharges:0,reflectRatio:.28,exposedUntil:0,lastAttackAt:-100,lastMoveAt:0,lastMoveName:'ยังมิได้สำแดงกระบวนท่า',lastArtId:null,lastRole:'basic',movesUsed:0,moveCount:0,qiSpent:0,vitalitySpent:0};
  }else{
   if(!s.cooldowns||typeof s.cooldowns!=='object')s.cooldowns={};
   const max=this.maxQi(n);
   if(s.qiTier!==tier||!Number.isFinite(s.maxQi)||s.maxQi!==max){
    s.maxQi=max;
    s.qiTier=tier;
   }
   s.qi=clamp(Number(s.qi)||0,0,s.maxQi);
   for(const k of ['guardUntil','guardCharges','guardFactor','evadeUntil','evadeCharges','staggerUntil','chillUntil','poisonUntil','parryUntil','parryCharges','reflectRatio','exposedUntil','lastAttackAt','lastMoveAt','movesUsed','moveCount','qiSpent','vitalitySpent'])
    if(!Number.isFinite(s[k]))s[k]=k==='reflectRatio'?.28:0;
   if(typeof s.lastMoveName!=='string')s.lastMoveName='ยังมิได้สำแดงกระบวนท่า';
   if(!('lastArtId'in s))s.lastArtId=null;
   if(!s.lastRole)s.lastRole='basic';
  }
  if(n.jianghu){n.jianghu.currentQiV190=s.qi;n.jianghu.maxQiV190=s.maxQi;}return s;
 }
 classify(art){
  if(!art)return null;
  const category=art.category||'',role=art.roleGroup||'',effects=(art.effectBindings||[]).map(x=>x.effectId||'').join('|');
  if(category==='FORBIDDEN_ART'||role==='FORBIDDEN_HIGH_STAKES')return 'forbidden';
  if(role==='HEAL_SUPPORT_TRAINING'||(category!=='COMBAT_TECHNIQUE'&&HEAL_EFFECTS.test(effects)))return 'recovery';
  if(['LIGHTNESS_ART','MOVEMENT_LIGHTNESS'].includes(category)||/^MOVEMENT_/.test(role))return 'movement';
  if(role==='COMBAT_CONTROL'||CONTROL_EFFECTS.test(effects)&&role!=='COMBAT_OFFENSE')return 'control';
  if(role==='COMBAT_DEFENSE'||role==='SUPPORT_DEFENSE'||DEFENSE_EFFECTS.test(effects))return 'defense';
  if(role==='COMBAT_OFFENSE'||category==='COMBAT_TECHNIQUE')return 'attack';
  if(CONTROL_EFFECTS.test(effects))return 'control';
  return null;
 }
 activeArts(n){
  const j=n?.jianghu;if(!j)return [];
  const out=[];
  for(const slot of ['technique','mantra','lightness','auxiliary','forbidden']){
   const valid=this.validEquippedArt(n,slot);
   if(!valid)continue;
   const role=this.classify(valid.art);
   if(role)out.push({art:valid.art,slot,knowledge:valid.knowledge,role});
  }
  return out;
 }
 samePath(n,art){return !art.path||art.path==='ANY'||art.path===n?.jianghu?.path;}
 qiCost(n,art){
  const base=Math.max(0,Number(art.costs?.qiCost)||0);
  const cross=this.samePath(n,art)?1:(Number(art.crossPathCompatibility?.crossPathQiCostMultiplier)||1.35);
  return Math.ceil(base*cross);
 }
 cooldownSeconds(art,role){
  const base=Math.max(1,Number(art.cooldownTurns)||1)*2.1+(Number(art.tier)||1)*.25;
  const floor=role==='forbidden'?11:role==='recovery'?6.5:role==='movement'?3.8:role==='defense'?4.0:role==='control'?3.6:2.4;
  return Math.max(floor,base);
 }
 ready(n,entry,state){return !!entry&&this.g.s.t>=(state.cooldowns[entry.art.id]||0)&&state.qi>=this.qiCost(n,entry.art);}
 maxHealth(n){return Number(n?.maxHP)||(n?.stageLocal?.boss?240:100);}
 targetPower(target){return target?.core?this.g.power(target):Number(target?.power)||100;}
 power(n){return this.g.power(n);}
 moveName(entry,state){
  const moves=entry.art.moves||[];
  const index=(state.movesUsed||0)%Math.max(1,moves.length);
  const m=moves[index];
  return (typeof m==='string'?m:m?.nameTh)||entry.art.nameTh||entry.art.id;
 }
 emit(entity,label,value=0,kind='move'){
  const p=this.location(entity);if(!p||p.offmap||!Number.isFinite(p.x)||!Number.isFinite(p.y))return;
  if(value<0){value=-this.fromCondition(entity,-value);label=String(label||'').replace(/\s+\+\d+(?:\.\d+)?\s*$/,'');}
  this.g.s.combat.push({x:p.x,y:p.y,value,label:String(label||'').slice(0,96),kind,until:this.g.s.t+(kind==='move'?1.75:1.25),t:this.g.s.t,entityId:entity?.id||null});
  if(this.g.s.combat.length>75)this.g.s.combat.splice(0,this.g.s.combat.length-75);
 }
 annotate(target,label,attacker){
  const events=this.g.s.combat;
  for(let i=events.length-1;i>=0;i--){
   const e=events[i];
   if(e.t===this.g.s.t&&e.targetId===target?.id&&e.attackerId===attacker?.id&&e.value>0){
    e.label=String(label||'').slice(0,96);
    return;
   }
  }
 }
 applyResourceCost(n,entry,state){
  const art=entry.art,qi=this.qiCost(n,art);
  if(state.qi<qi)return false;
  state.qi=Math.max(0,state.qi-qi);n.jianghu.currentQiV190=state.qi;
  state.qiSpent+=qi;
  const vitality=Math.max(0,Number(art.costs?.vitalityCost)||0);
  if(vitality){
   state.vitalitySpent+=vitality;
   n.core.condition.fatigue=clamp((n.core.condition.fatigue||0)+vitality*.08,0,100);
  }
  return true;
 }
 schedule(n,entry,state){
  state.cooldowns[entry.art.id]=this.g.s.t+this.cooldownSeconds(entry.art,entry.role);
  state.lastArtId=entry.art.id;
  state.lastRole=entry.role;
  state.lastMoveName=entry.art.nameTh||entry.art.id;
  state.lastMoveAt=this.g.s.t;
  state.movesUsed=(state.movesUsed||0)+1;
  state.moveCount=(state.moveCount||0)+1;
 }
 moveFactor(n,entry){
  const mastery=Number(entry.knowledge?.mastery)||0;
  const artPower=Number(entry.art.power)||60;
  const pathFactor=this.samePath(n,entry.art)?1:(Number(entry.art.crossPathCompatibility?.crossPathEffectivenessMultiplier)||.82);
  const subBonus=entry.art.subPath&&entry.art.subPath===n?.jianghu?.subPath?1.08:1;
  return clamp((.95+artPower/195)*(.85+Math.min(85,mastery)*.0028)*pathFactor*subBonus,.75,2.25);
 }
 baseDamage(n,target){
  const power=this.power(n),def=this.targetPower(target),base=n.stageLocal?.enemy?(n.stageLocal.boss?5.5:4):7;
  return base*Math.max(.55,Math.min(2.25,Math.sqrt(power/Math.max(100,def))));
 }
 targetState(target){
  if(!target)return null;
  if(target.stageLocal&&!target.stageLocal.pet)return this.ensure(target);
  if(target.stageLocal?.pet)return null;
  if(!target.core){
   const p=this.location(target);if(!p)return null;
   if(!p.combatState)p.combatState={schema:2,guardUntil:0,guardCharges:0,guardFactor:.55,evadeUntil:0,evadeCharges:0,staggerUntil:0,chillUntil:0,poisonUntil:0,parryUntil:0,parryCharges:0,reflectRatio:.28,exposedUntil:0};
   return p.combatState;
  }
  return null;
 }
 act(n,target,{defensiveOnly=false}={}){
  if(!alive(n)||!alive(target))return false;
  const state=this.ensure(n);if(!state)return false;
  const now=this.g.s.t;
  if(now<state.staggerUntil||now<(state.globalReadyAt||0))return false;
  const cadence=this.cadence(n);
  if(now-state.lastAttackAt<cadence)return false;
  const dist=Math.hypot((n.stageLocal.x)-(this.location(target).x),(n.stageLocal.y)-(this.location(target).y));
  const selfPower=this.power(n),targetPower=this.targetPower(target),hpRatio=n.health/this.maxHealth(n);
  const caution=clamp(Number(n.personality?.caution)||50,0,100),courage=clamp(Number(n.personality?.courage)||50,0,100),ambition=clamp(Number(n.personality?.ambition)||50,0,100);
  let chosen=this.choose(n,target,state,{defensiveOnly});
  if(!chosen){if(defensiveOnly||dist>145)return false;this.basic(n,target,state);return true;}
  if(!this.applyResourceCost(n,chosen,state)){if(defensiveOnly)return false;this.basic(n,target,state);return true;}
  state.lastAttackAt=now;
  const art=chosen.art,role=chosen.role,move=this.moveName(chosen,state),effects=(art.effectBindings||[]).map(x=>x.effectId||''),factor=this.moveFactor(n,chosen),base=this.baseDamage(n,target,this.attackType(n,art));
  const targetState=this.targetState(target);

  if(role==='recovery'){
   const before=n.health,heal=Math.min(this.maxHealth(n)-n.health,Math.max(6,Math.round(8+(Number(art.power)||50)*.095+(Number(art.tier)||1)*2.0)));
   n.health=Math.min(this.maxHealth(n),n.health+heal);
   if(n.core?.human)H.recover(n,heal*.22);
   if(effects.some(x=>/MERIDIAN_TOXIN_PURGE|PURIFY_HOSTILE_STATUS/.test(x))&&n.jianghu){
    n.jianghu.pillToxicity=Math.max(0,(n.jianghu.pillToxicity||0)-8);
    n.jianghu.heartDemon=Math.max(0,(n.jianghu.heartDemon||0)-8);
    state.poisonUntil=0;state.dots=[];state.chillUntil=0;state.exposedUntil=0;
   }
   this.healAllies(n,art);
   this.schedule(n,chosen,state);state.lastMoveName=move;
   this.emit(n,move,-Math.round(n.health-before),'heal');
   H.learn(n,'train',.08);
   return true;
  }

  if(role==='movement'){
   const a=n.stageLocal,b=this.location(target),d=Math.max(1,dist),dx=(b.x-a.x)/d,dy=(b.y-a.y)/d;
   if(defensiveOnly){a.x=clamp(a.x-dx*28,0,4000);a.y=clamp(a.y-dy*28,0,3000);}
   else if(d>125){a.x=clamp(a.x+dx*28,0,4000);a.y=clamp(a.y+dy*28,0,3000);}
   else{const side=(state.moveCount%2===0?1:-1);a.x=clamp(a.x-dy*42*side,0,4000);a.y=clamp(a.y+dx*42*side,0,3000);}
   state.evadeUntil=now+2.9+(Number(art.tier)||1)*.15;
   state.evadeCharges=2+(Number(art.tier)>=5?1:0);
   if(effects.some(x=>/CHILL_FREEZE/.test(x))&&targetState){targetState.chillUntil=now+3.5;}
   this.schedule(n,chosen,state);state.lastMoveName=move;
   this.emit(n,move,0,'movement');
   H.learn(n,'hunt',.08);
   return true;
  }

  let roleFactor=this.mechanics(art).damage||1;
  if(effects.some(x=>/SWORD_STORM_STRIKE|HEAVENLY_THUNDER_SMITE|BLOOD_SACRIFICE_OVERDRIVE/.test(x)))roleFactor+=.15;
  if(effects.some(x=>/WEAKNESS_EXPOSURE|VITALITY_STEAL|QI_SIPHON|SOUL_MENTAL_ATTACK/.test(x)))roleFactor+=.08;
  const combo=this.applyCombo(n,target,chosen,{preview:true});
  let damage=base*factor*roleFactor*combo.multiplier;

  if(role==='forbidden'){
   damage*=1.22;
   if(effects.some(x=>/MASS_VITAL_HEAL/.test(x))){const heal=Math.min(this.maxHealth(n)-n.health,Math.round(this.maxHealth(n)*.40));n.health+=heal;state.guardUntil=now+3;state.guardCharges=2;state.guardFactor=.50;this.emit(n,'เคล็ดต้องห้ามคืนชีพ +'+heal,-heal,'heal');}
  }

  if(role==='defense'||effects.some(x=>/BARRIER_SHIELD|TRIBULATION_SHIELD|GUARDED_DAMAGE_SHARE/.test(x))){
   state.guardUntil=now+3.4+(Number(art.tier)||1)*.15;
   state.guardCharges=effects.some(x=>/BARRIER_SHIELD|TRIBULATION_SHIELD/.test(x))?3:2;
   state.guardFactor=clamp((.58-(Number(art.tier)||1)*.012)/this.profile(n).guard,.40,.65);
   this.wardAllies(n,art);
  }
  if(effects.some(x=>/TIMED_PARRY|RECOIL_COUNTER|DAMAGE_REFLECT/.test(x))){
   state.parryUntil=now+3.0;
   state.parryCharges=1+(Number(art.tier)>=4?1:0);
   state.reflectRatio=clamp(.28+(Number(art.tier)||1)*.04,.28,.58);
  }

  const beforeHealth=target.health;
  this.emit(n,move,0,'move');
  if(dist<=this.mechanics(art).range)this.hit(n,target,damage,{type:this.attackType(n,art),artId:art.id,moveName:move});
  const actualDamage=Math.max(0,beforeHealth-target.health);
  state.primaryHit201={targetId:target.id,t:now,hit:actualDamage>0};
  if(!alive(n))return true;
  if(actualDamage>0)this.applyCombo(n,target,chosen);
  this.annotate(target,move,n);
  if(this.mechanics(art).tags?.includes('AREA'))for(const other of this.nearbyHostiles(n,target,135))this.hit(n,other,damage*.38,{type:this.attackType(n,art),artId:art.id,moveName:move});
  if(actualDamage>0&&alive(target)&&/BURNING|BLEEDING|TOXIN_INFECTION/.test(effects.join('|'))){targetState.dots=(targetState.dots||[]).filter(d=>d.ownerId!==n.id);targetState.dots.push({ownerId:n.id,artId:art.id,expiresAt:now+5,dps:Math.min(2.5,damage*.08)});targetState.dots=targetState.dots.slice(-3);}

  if(targetState&&alive(target)&&actualDamage>0){
   if((role==='control'||effects.some(x=>/SPATIAL_LOCK|GRAVITY_QI_SEAL|HEAVENLY_THUNDER_SMITE/.test(x)))&&this.g.rng.next()<clamp(.45+(Number(art.tier)||1)*.04+(Number(chosen.knowledge?.mastery)||0)*.001,.45,.78)){
    this.applyControl(target,.68+(Number(art.tier)||1)*.09,n);
    this.emit(target,'สกัดจุดเสียจังหวะ',0,'control');
   }
   if(effects.some(x=>/CHILL_FREEZE/.test(x))){
    targetState.chillUntil=now+4.2;
    this.emit(target,'ไอเหมันต์ผนึกชีพจร',0,'control');
   }
   if(effects.some(x=>/WEAKNESS_EXPOSURE|ELEMENTAL_ANNIHILATION|GRAVITY_QI_SEAL/.test(x))){
    targetState.exposedUntil=now+3.5;
   }
   if(effects.some(x=>/SOUL_MENTAL_ATTACK/.test(x))&&Number.isFinite(targetState.qi)){
    const drained=Math.min(targetState.qi,6+(Number(art.tier)||1)*2);
    targetState.qi=Math.max(0,targetState.qi-drained);
    this.emit(target,'สะท้านทะเลสำนึก',0,'control');
   }
   if(effects.some(x=>/QI_SIPHON/.test(x))){
    targetState.poisonUntil=now+4.5;
    targetState.poisonOwnerId=n.id;targetState.poisonArtId=art.id;
    if(Number.isFinite(targetState.qi))targetState.qi=Math.max(0,targetState.qi-(4+(Number(art.tier)||1)*2));
    state.qi=Math.min(state.maxQi,state.qi+Math.min(5,this.qiCost(n,art)*.45));
   }
  }

  if(effects.some(x=>/VITALITY_STEAL|QI_SIPHON|HEALING_RELAY|MASS_VITAL_HEAL/.test(x))&&alive(n)&&actualDamage>0){
   const heal=Math.min(this.maxHealth(n)-n.health,Math.max(3,Math.round(actualDamage*.22+(Number(art.tier)||1)*1.5)));
   if(heal>0){
    n.health+=heal;
    this.emit(n,'สูบปราณฟื้นกาย +'+heal,-heal,'heal');
   }
  }

  this.schedule(n,chosen,state);
  state.lastMoveName=move;
  H.learn(n,'hunt',.1);
  n.core.condition.fatigue=clamp((n.core.condition.fatigue||0)+.4,0,100);
  return true;
 }
 basic(n,target,state){
  const now=this.g.s.t;
  const wId=n?.jianghu?.equipmentV140?.WEAPON,w=n?.jianghu?.ledgerV140?.equipmentItems?.find(i=>i.id===wId),wShort=w?.nameTh?String(w.nameTh).split('·')[0].trim():'',strikeName=wShort?'ตวัดคม'+wShort:'เพลงหมัดปราณพื้นฐาน';
  state.lastAttackAt=now;state.lastArtId=null;state.lastRole='basic';state.lastMoveName=strikeName;state.lastMoveAt=now;state.moveCount=(state.moveCount||0)+1;
  const damage=this.baseDamage(n,target);
  this.hit(n,target,damage,{type:'physical',moveName:strikeName});
  H.learn(n,'hunt',.08);
  n.core.condition.fatigue=clamp((n.core.condition.fatigue||0)+.4,0,100);
 }
 incoming(target,amount,attacker){
  const state=this.targetState(target);if(!state)return {amount,counter:0};
  const now=this.g.s.t;
  const resonance=root.JianghuExpansionV112?.computeEquipmentResonance?.(target);
  amount/=resonance?.defenseMult||1;
  const j=target?.jianghu;
  if(j){
   const canUse=it=>this.g.progression?.canEquipItem?this.g.progression.canEquipItem(target,it).ok:(root.JianghuExpansionV112?.canEquipItem?root.JianghuExpansionV112.canEquipItem(target,it).ok:(it&&it.durability>0&&(!it.compatiblePath||it.compatiblePath==='ANY'||it.compatiblePath===j.path)));
   const armor=['ARMOR','TALISMAN_VESSEL'].map(slot=>(j.ledgerV140?.equipmentItems||[]).find(it=>it.id===j.equipmentV140?.[slot]&&canUse(it)));
   amount/=1+armor.reduce((sum,it)=>sum+Math.max(0,Number(it?.defenseMult)||0),0);
  }
  if(state.exposedUntil>now)amount*=1.15;
  if(state.evadeUntil>now&&state.evadeCharges>0&&this.g.rng.next()<.44){
   state.evadeCharges--;
   this.emit(target,'ท่าร่างหลบคม',0,'evade');
   return {amount:0,counter:0};
  }
  // Passive auxiliary protection requires a genuinely learned, compatible art
  const auxEntry=this.validEquippedArt(target,'auxiliary');
  if(auxEntry){
   amount*=(1-Math.min(.14,(auxEntry.art.tier||1)*.018));
  }
  let counter=0;
  if(state.guardUntil>now){
   amount*=state.guardCharges>0?(state.guardFactor||.52):.82;
   if(state.guardCharges>0)state.guardCharges--;
  }
  if(state.parryUntil>now&&state.parryCharges>0&&attacker&&alive(attacker)){
   const ratio=state.reflectRatio||.30;
   amount*=.58;
   counter=amount*ratio*1.45;
   state.parryCharges--;
   if(state.parryCharges<=0)state.parryUntil=0;
   this.emit(target,'สะท้อนกระบวนท่า',0,'defense');
  }
  return {amount,counter};
 }
 tick(n,dt){
  let state=n?.stageLocal?.combatState;
  const tier=Number(n?.jianghu?.realizationBand)||1;
  if(!state||state.schema!==2||state.qiTier!==tier)state=this.ensure(n);
  if(!state)return;
  const now=this.g.s.t;
  const inCombat=now-state.lastAttackAt<5||n.stageLocal.mode==='combat';
  const mantraEntry=this.validEquippedArt(n,'mantra');
  const mantraMult=mantraEntry?(1+(mantraEntry.art.tier||1)*.06):1;
  const regen=(inCombat?.46:1.65)*mantraMult*Math.max(.25,1-(Number(n.core?.condition?.fatigue)||0)/180);
  state.qi=Math.min(state.maxQi,state.qi+regen*dt);if(n.jianghu){n.jianghu.currentQiV190=state.qi;n.jianghu.maxQiV190=state.maxQi;}
  if((state.poisonUntil||0)>now&&alive(n)){
   n.health=Math.max(1,n.health-dt*.35);
  }
  if(state.guardUntil<=now){state.guardCharges=0;state.guardUntil=0;}
  if(state.evadeUntil<=now){state.evadeCharges=0;state.evadeUntil=0;}
  if(state.parryUntil<=now){state.parryCharges=0;state.parryUntil=0;}
  if(state.staggerUntil<=now)state.staggerUntil=0;
  if(state.chillUntil<=now)state.chillUntil=0;
  if(state.poisonUntil<=now)state.poisonUntil=0;
  if(state.exposedUntil<=now)state.exposedUntil=0;
 }
 summary(n){
  const s=n?.stageLocal?.combatState;
  if(!s)return {qi:this.maxQi(n),maxQi:this.maxQi(n),lastMoveName:'ยังมิได้ปะทะคมศาสตรา',lastRole:'basic',moveCount:0,guarding:false,evading:false,staggered:false};
  return {
   qi:Math.round(s.qi),
   maxQi:Math.round(s.maxQi),
   lastMoveName:s.lastMoveName,
   lastRole:s.lastRole,
   moveCount:s.moveCount||0,
   guarding:s.guardUntil>this.g.s.t,
   evading:s.evadeUntil>this.g.s.t,
   staggered:s.staggerUntil>this.g.s.t,
   chilled:(s.chillUntil||0)>this.g.s.t
  };
 }
 static curated(){return JSON.parse(JSON.stringify(CURATED_ARTS));}
}
root.LivingCombat=LivingCombat;if(typeof module==='object')module.exports={LivingCombat,CURATED_ARTS,ROLE_LABELS};
})(typeof globalThis!=='undefined'?globalThis:this);
