/* Combat & Attributes 2.01. Pure projections over the canonical human, loadout,
   condition and beast ledgers. Inspection never initializes or repairs actors. */
(function(root){'use strict';
const VERSION='2.01';
const num=(v,fallback=0)=>typeof v==='number'&&Number.isFinite(v)?v:fallback;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,num(v,a)));
const round=v=>Math.round(v*1e6)/1e6;
const defs={
 maxHP:['พลังชีวิตสูงสุด','หน่วย',1,1000000,'ขีดความทนทานแห่งกายเนื้อและเส้นชีพจร; ผู้ฝึกตนคำนวณตามสัดส่วนสภาพร่างกาย'],
 physicalAttack:['พลังโจมตีกาย','หน่วย',1,100000,'พละกำลังกล้ามเนื้อ แรงระเบิดชั่วพริบตา และอานุภาพวิชากายา'],
 artAttack:['พลังโจมตีวิชา','หน่วย',1,100000,'สมาธิตั้งมั่น ความจุเส้นปราณ และอานุภาพเคล็ดวิชาที่ตระเตรียม'],
 armor:['เกราะกาย','ระดับ',0,20000,'ความแกร่งของกายเนื้อและเกราะคุ้มกาย ลดทอนคมศาสตราหลังหักเจาะเกราะ'],
 resistance:['ต้านทานวิชา','ระดับ',0,20000,'ม่านปราณคุ้มครองและภูมิต้านทาน ลดทอนอานุภาพปราณและเคล็ดวิชา'],
 accuracy:['ความแม่นยำ','ระดับ',1,5000,'ความเฉียบคมในการจับจังหวะและอ่านช่องโหว่ เทียบกับท่าร่างหลบหลีกของศัตรู'],
 evasion:['การหลบหลีก','ระดับ',0,3000,'ความพลิ้วไหวของท่าร่างและการอ่านวิถีโจมตีล่วงหน้า'],
 critChance:['โอกาสคริติคอล','สัดส่วน',0,.60,'โอกาสจู่โจมทะลวงจุดตายในการปะทะโดยตรง'],
 critMultiplier:['ความแรงคริติคอล','เท่า',1.1,3.5,'อานุภาพทำลายล้างเมื่อปะทะเข้าจุดตายของศัตรู'],
 attackSpeed:['ความเร็วโจมตี','ครั้ง/วินาที',.2,3,'จังหวะการออกกระบวนท่าต่อเนื่อง; คูลดาวน์ของแต่ละวิชายังแยกต่างหาก'],
 moveSpeed:['ความเร็วเคลื่อนที่','เมตร/วินาที',10,180,'ฝีเท้าและวิชาตัวเบาในการเคลื่อนทัพสำรวจยุทธภพ'],
 penetration:['เจาะเกราะ','ระดับ',0,10000,'ความคมกล้าที่ทะลวงผ่านเกราะกายหรือม่านต้านทานของเป้าหมาย'],
 controlResist:['ต้านการควบคุม','สัดส่วน',0,.65,'จิตตานุภาพและรากฐานลมปราณ ลดเวลาถูกสะกดหรือเสียจังหวะสูงสุดร้อยละ 65'],
 maxQi:['ปราณสูงสุด','หน่วย',1,3000,'ความจุทะเลลมปราณและผลหนุนจากเคล็ดเดินปราณที่ตระเตรียม'],
 qiRegen:['ฟื้นปราณ','หน่วย/วินาที',0,40,'อัตราโคจรลมปราณฟื้นฟูตามธรรมชาติก่อนปรับลดยามติดพันศึก']
};
const keys=Object.keys(defs),keySet=new Set(keys),meta=Object.freeze(Object.fromEntries(keys.map(k=>{const [label,unit,min,max,description]=defs[k];return [k,Object.freeze({label,unit,min,max,description})];})));
// Story rewards use these older names; the operational sheet has one key per stat.
const statAliases={critChance:'critRate',critMultiplier:'critDamage'};
const statValue=(map,stat)=>map?.[stat]??(statAliases[stat]?map?.[statAliases[stat]]:undefined);
const meridianDefs=root.World2026Engine?.PATCH150_DATA?.EIGHT_MERIDIANS_V150||['DU','REN','CHONG','DAI','YINQIAO','YANGQIAO','YINWEI','YANGWEI'].map(id=>({id:'MERIDIAN_'+id,maxNodes:9}));
const BODY_LABELS={strength:'พละกำลังกล้ามเนื้อ',power:'แรงระเบิดชั่วพริบตา',agility:'ความปราดเปรียว',dexterity:'ความประณีตของหัตถา',coordination:'การประสานกายา',balance:'รากฐานการทรงตัว',mobility:'ความยืดหยุ่นท่าร่าง',durability:'ความแกร่งทนแรงปะทะ',endurance:'ความอึดทนทาน',recoveryRate:'กำลังฟื้นฟูตามธรรมชาติ',senseAcuity:'ความเฉียบคมแห่งประสาทสัมผัส',immuneResilience:'ภูมิต้านทานพิษและปราณร้าย',attention:'สมาธิจดจ่อ',metacognition:'การหยั่งรู้ตนเอง',processingSpeed:'ความไวในการอ่านกระบวนท่า',spatialReasoning:'การหยั่งรู้ระยะและมิติ',reasoning:'ปัญญาวิเคราะห์ยุทธ์',meridianCapacity:'ความจุทะเลเส้นปราณ',meridianIntegrity:'ความสมบูรณ์แห่งเส้นชีพจร',spiritualFoundation:'รากฐานจิตวิญญาณ',combat:'พรสวรรค์เชิงยุทธ์',cultivation:'พรสวรรค์บ่มเพาะปราณ',comprehension:'ญาณหยั่งรู้เคล็ดวิชา'};
const bodyIds=Object.keys(BODY_LABELS);
const physiology=new Set(['endurance','recoveryRate','senseAcuity','meridianCapacity','meridianIntegrity','spiritualFoundation']);
const cognition=new Set(['attention','metacognition','processingSpeed','spatialReasoning','reasoning']);
const aptitudes=new Set(['combat','cultivation','comprehension']);
const effectiveSkip=new Set(['combat','cultivation','comprehension','meridianCapacity','meridianIntegrity','spiritualFoundation']);
const terms={
 maxHP:{endurance:.9,durability:.4,strength:.2},
 physicalAttack:{strength:.23,power:.14,coordination:.05,combat:.05},
 artAttack:{attention:.12,metacognition:.07,reasoning:.05,meridianCapacity:.12,cultivation:.06,comprehension:.06},
 armor:{durability:.28,endurance:.08,balance:.04},
 resistance:{immuneResilience:.1,meridianCapacity:.12,attention:.08,comprehension:.06},
 accuracy:{coordination:.25,senseAcuity:.25,spatialReasoning:.16,combat:.12},
 evasion:{agility:.22,balance:.1,spatialReasoning:.08},
 critChance:{dexterity:.0003,senseAcuity:.00025,combat:.0002},
 critMultiplier:{power:.001,spatialReasoning:.001},
 attackSpeed:{agility:.0023,coordination:.0015,processingSpeed:.001},
 moveSpeed:{agility:.24,mobility:.14,endurance:.08},
 penetration:{power:.06,dexterity:.03,meridianCapacity:.03},
 controlResist:{endurance:.001,metacognition:.001,meridianIntegrity:.0007},
 maxQi:{meridianCapacity:.30,metacognition:.08,cultivation:.10},
 qiRegen:{recoveryRate:.007,meridianCapacity:.004,attention:.003,cultivation:.003}
};
const termEntries=Object.fromEntries(keys.map(k=>[k,Object.entries(terms[k]||{})]));
const growthEntries=Object.entries({maxHP:1,physicalAttack:1,artAttack:1.08,armor:.95,resistance:1,penetration:.8,maxQi:.85,qiRegen:.22});
const humanBase={maxHP:130,physicalAttack:14,artAttack:12,armor:7,resistance:7,accuracy:54,evasion:3,critChance:.025,critMultiplier:1.35,attackSpeed:.55,moveSpeed:28,penetration:0,controlResist:.015,maxQi:38,qiRegen:.45};
const zeroSheet={maxHP:0,physicalAttack:0,artAttack:0,armor:0,resistance:0,accuracy:0,evasion:0,critChance:0,critMultiplier:0,attackSpeed:0,moveSpeed:0,penetration:0,controlResist:0,maxQi:0,qiRegen:0};
const baseCache=new WeakMap(),artSigMap=new WeakMap();
const itemSigMap=new WeakMap();
function itemStaticSig(it){
 if(!it||typeof it!=='object')return null;
 let s=itemSigMap.get(it);
 if(s===undefined||s.dur!==it.durability||s.tier!==it.tier||s.cMult!==it.combatMult||s.dMult!==it.defenseMult){
  s={dur:it.durability,tier:it.tier,cMult:it.combatMult,dMult:it.defenseMult,str:JSON.stringify([it.id,it.slot,it.tier,it.minStageReq,it.compatiblePath,it.durability,it.combatMult,it.defenseMult,it.setId,it.weaponSpirit?.bonusMult,it.combatStats,it.stats,it.statBonuses])};
  itemSigMap.set(it,s);
 }
 return s.str;
}
const c100=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:50));
const r100=v=>{const x=Math.round(v*100)/100;return x===0?0:x;};
function fillEffectiveMap(n,raw,effective){
 const h=n.core?.human;
 if(h?.state?.parts&&n.core?.condition&&n.core?.physiology&&h.body&&h.cognition){
  const max=n.stageLocal?.boss?240:100;
  const fat=c100(n.core.condition.fatigue??0),hun=c100(n.stageLocal?.needs?.hunger??0),str=c100(n.core.condition.moodStress??0);
  const painTol=c100(h.body.painTolerance);
  const pain=h.state.pain*(1-painTol*.005);
  const hRatio=c100(n.health,0,max)/max;
  const p=h.state.parts;
  const cogLoss=fat*.0022+hun*.0013+str*.0017+pain*.0012+p.head*.004+p.torso*.0005;
  const cogMult=Math.max(.25,1-cogLoss);
  const bodyBase=fat*.002+hun*.0011+(1-hRatio)*.2+pain*.0015+p.torso*.0015;
  const armMult=Math.max(.25,1-(bodyBase+(p.leftArm+p.rightArm)*.003));
  const legMult=Math.max(.25,1-(bodyBase+(p.leftLeg+p.rightLeg)*.003));
  const senseMult=Math.max(.25,1-(bodyBase+p.head*.004));
  const baseMult=Math.max(.25,1-bodyBase);
  effective.strength=clamp(r100(c100(raw.strength*armMult)),0,100);
  effective.power=clamp(r100(c100(raw.power*armMult)),0,100);
  effective.dexterity=clamp(r100(c100(raw.dexterity*armMult)),0,100);
  effective.coordination=clamp(r100(c100(raw.coordination*armMult)),0,100);
  effective.agility=clamp(r100(c100(raw.agility*legMult)),0,100);
  effective.balance=clamp(r100(c100(raw.balance*legMult)),0,100);
  effective.mobility=clamp(r100(c100(raw.mobility*legMult)),0,100);
  effective.endurance=clamp(r100(c100(raw.endurance*legMult)),0,100);
  effective.durability=clamp(r100(c100(raw.durability*baseMult)),0,100);
  effective.senseAcuity=clamp(r100(c100(raw.senseAcuity*senseMult)),0,100);
  effective.recoveryRate=raw.recoveryRate;
  effective.immuneResilience=raw.immuneResilience;
  effective.attention=clamp(r100(c100(raw.attention*cogMult)),0,100);
  effective.metacognition=clamp(r100(c100(raw.metacognition*cogMult)),0,100);
  effective.processingSpeed=clamp(r100(c100(raw.processingSpeed*cogMult)),0,100);
  effective.spatialReasoning=clamp(r100(c100(raw.spatialReasoning*cogMult)),0,100);
  effective.reasoning=clamp(r100(c100(raw.reasoning*cogMult)),0,100);
  effective.meridianCapacity=raw.meridianCapacity;
  effective.meridianIntegrity=raw.meridianIntegrity;
  effective.spiritualFoundation=raw.spiritualFoundation;
  effective.combat=raw.combat;
  effective.cultivation=raw.cultivation;
  effective.comprehension=raw.comprehension;
  return;
 }
 fillEffectiveMap(n,raw,effective);
}
function artStaticSig(a){
 if(!a||typeof a!=='object')return null;
 let s=artSigMap.get(a);
 if(s===undefined){s=JSON.stringify([a.path,a.subPath,a.tier,a.requiredNormalizedTier,a.category,a.innateRoute,a.crossPathCompatibility,a.combatStats,a.statBonuses,a.combat117?.role]);artSigMap.set(a,s);}
 return s;
}
function humanBaseSignature(g,n){
 const j=n?.jianghu||{},h=n?.core?.human,hb=h?.body,hc=h?.cognition,ph=n.core?.physiology,ap=n.core?.aptitudes,mr=j.meridiansV150,hr=j.heritageV115;
 const eq=j.equipmentV140||{},eqList=Array.isArray(j.ledgerV140?.equipmentItems)?j.ledgerV140.equipmentItems:[];
 const wIt=eq.WEAPON&&eqList.find(x=>x&&x.id===eq.WEAPON);
 const aIt=eq.ARMOR&&eqList.find(x=>x&&x.id===eq.ARMOR);
 const tIt=eq.TALISMAN_VESSEL&&eqList.find(x=>x&&x.id===eq.TALISMAN_VESSEL);
 const profile=root.CombatData117?.profiles?.[j.path+':'+j.subPath];
 const att=Array.isArray(j.attackArtIds)?j.attackArtIds:(j.techniqueId?[j.techniqueId]:[]);
 const cs=g?.combatSystem;
 let artsStr='';
 const pushArt=id=>{if(!id)return;const k=j.knowledgeV190?.[id],a=cs?.artMap?.get(id)||g?.progression?.artMap?.get(id);artsStr+=id+':'+k?.stage+':'+k?.mastery+':'+artStaticSig(a)+';';};
 for(let i=0;i<att.length&&i<10;i++)pushArt(att[i]);
 pushArt(j.techniqueId);pushArt(j.mantraId);pushArt(j.lightnessId);pushArt(j.auxiliaryId);pushArt(j.forbiddenId);
 if(profile?.innateIds)for(const id of profile.innateIds)pushArt(id);
 return [
  n.intelligence,
  hb?[hb.strength,hb.power,hb.agility,hb.dexterity,hb.coordination,hb.balance,hb.mobility,hb.durability,hb.endurance,hb.recoveryRate,hb.senseAcuity,hb.immuneResilience].join(','):'',
  hc?[hc.attention,hc.metacognition,hc.processingSpeed,hc.spatialReasoning,hc.reasoning].join(','):'',
  ph?[ph.endurance,ph.recoveryRate,ph.senseAcuity,ph.meridianCapacity,ph.meridianIntegrity,ph.spiritualFoundation].join(','):'',
  ap?[ap.combat,ap.cultivation,ap.comprehension].join(','):'',
  j.path,j.subPath,j.realizationBand,j.cultivationIdentityV1200?.realizationBand,j.stage,j.trackOrdinal,
  hr?JSON.stringify([hr.foundationArts,hr.routes]):'',
  mr?[mr.MERIDIAN_DU,mr.MERIDIAN_REN,mr.MERIDIAN_CHONG,mr.MERIDIAN_DAI,mr.MERIDIAN_YINQIAO,mr.MERIDIAN_YANGQIAO,mr.MERIDIAN_YINWEI,mr.MERIDIAN_YANGWEI].join(','):'',
  eq.WEAPON,eq.ARMOR,eq.TALISMAN_VESSEL,eqList.length,itemStaticSig(wIt),itemStaticSig(aIt),itemStaticSig(tIt),artsStr
 ].join('|');
}
function band(n){const j=n?.jianghu||{};return clamp(num(j.realizationBand,num(j.cultivationIdentityV1200?.realizationBand,num(j.stage,1))),1,12);}
function humanDimension(n,id){const p=n.core?.physiology||{},h=n.core?.human||{};return clamp(aptitudes.has(id)?num(n.core?.aptitudes?.[id],50):physiology.has(id)?num(p[id],50):id==='reasoning'?num(n.intelligence,50):cognition.has(id)?num(h.cognition?.[id],50):num(h.body?.[id],50),0,100);}
function effectiveDimension(n,id,raw){
 if(effectiveSkip.has(id))return raw;
 const H=root.HumanCore;
 if(H?.effective&&n.core?.human?.state?.parts){try{return clamp(num(H.effective(n,cognition.has(id)?'cognition':'body',id),raw),0,100);}catch(_){/* Incomplete actors use the same neutral projection without creating Human fields. */}}
 const c=n.core?.condition||{},h=n.core?.human?.state||{},fatigue=clamp(num(c.fatigue),0,100),pain=clamp(num(h.pain),0,100),hunger=clamp(num(n.stageLocal?.needs?.hunger),0,100);
 if(id==='recoveryRate'||id==='immuneResilience')return raw;
 return raw*clamp(1-fatigue*.002-hunger*.0011-pain*.0015,.25,1);
}
function preparedArts(g,n){
 const j=n?.jianghu;if(!j)return [];
 const cs=g?.combatSystem,progression=g?.progression,seen=new Set(),candidates=[],out=[];
 const lookup=id=>id?(cs?.artMap?.get(id)||g?.progression?.artMap?.get(id)||root.World2026Engine?.getTechniqueByIdV190?.(id)):null;
 if(typeof cs?.activeArts==='function'){const active=cs.activeArts(n);if(Array.isArray(active))candidates.push(...active);}
 const attackIds=Array.isArray(j.attackArtIds)?j.attackArtIds.slice(0,10):(j.techniqueId?[j.techniqueId]:[]);
 for(const id of attackIds){const art=lookup(id);if(art)candidates.push({art,slot:'technique'});}
 for(const slot of ['mantra','lightness','auxiliary','forbidden']){const art=lookup(j[slot+'Id']);if(art)candidates.push({art,slot});}
 // Some innate mantras have no tactical role and are intentionally omitted by activeArts.
 const profile=root.CombatData117?.profiles?.[j.path+':'+j.subPath];
 for(const id of profile?.innateIds||[]){const art=lookup(id);if(art)candidates.push({art,slot:'innate',innate:true});}
 for(const entry of candidates){
  const a=entry?.art;if(!a||!a.id||seen.has(a.id))continue;
  const k=j.knowledgeV190?.[a.id];if(!k||num(k.stage)<4||num(k.mastery)<8)continue;
  if(progression?.compatible&&!progression.compatible(n,a))continue;
  if(progression?.canStudyArtTier&&!progression.canStudyArtTier(n,a))continue;
  const r=a.innateRoute;
  if(r){if(j.path!==r.path||j.subPath!==r.subPath||num(j.trackOrdinal,num(j.stage,1))<num(r.ordinal,1))continue;}
  else{
   if(!progression?.compatible&&a.path&&a.path!=='ANY'&&a.path!==j.path&&!a.crossPathCompatibility?.allowedSecondaryPaths?.includes(j.path))continue;
   const required=num(a.requiredNormalizedTier,num(a.tier,1));
   const heritage=required<=2&&(j.heritageV115?.foundationArts?.[a.id]||a.path===j.path&&a.subPath===j.subPath&&j.heritageV115?.routes?.[a.path+':'+a.subPath]);
   if(!progression?.canStudyArtTier&&required>band(n)&&!heritage)continue;
   const slot=entry.slot;
   const expectedSlot=progression?.slot?progression.slot(a):/MANTRA/.test(a.category||'')?'mantra':/LIGHTNESS|MOVEMENT/.test(a.category||'')?'lightness':a.category==='FORBIDDEN_ART'?'forbidden':/AUXILIARY|SUPPORT/.test(a.category||'')?'auxiliary':'technique';
   if(slot!==expectedSlot)continue;
   if(slot==='technique'&&!attackIds.includes(a.id))continue;
   if(slot!=='technique'&&slot!=='innate'&&j[slot+'Id']!==a.id)continue;
   if(slot==='innate')continue;
  }
  const category=String(a.category||''),effects=(a.effectBindings||[]).map(x=>x?.effectId||'').join('|');
  const role=entry.role||a.combat117?.role||(/MANTRA/.test(category)?'mantra':/LIGHTNESS|MOVEMENT/.test(category)?'movement':/FORBIDDEN/.test(category)?'forbidden':/HEAL|PURGE|QI_TRANSFER/.test(effects)?'recovery':/BARRIER|REFLECT|PARRY|RESILIENCE/.test(effects)?'defense':'attack');
  seen.add(a.id);out.push({art:a,knowledge:k,role,slot:entry.slot,innate:!!r});
 }
 return out;
}
function equippedItems(g,n){
 const j=n?.jianghu;if(!j)return [];
 const list=Array.isArray(j.ledgerV140?.equipmentItems)?j.ledgerV140.equipmentItems:[],seen=new Set(),out=[];
 for(const slot of ['WEAPON','ARMOR','TALISMAN_VESSEL']){
  const id=j.equipmentV140?.[slot];if(!id||seen.has(id))continue;
  const item=list.find(x=>x&&x.id===id);if(!item||item.slot!==slot||num(item.durability,100)<=0||item.durability!==undefined&&!Number.isFinite(Number(item.durability)))continue;
  if(item.compatiblePath&&!['ANY',j.path].includes(item.compatiblePath))continue;
  const fn=g?.progression?.canEquipItem||root.JianghuExpansionV112?.canEquipItem;
  if(fn){const result=fn.call(g?.progression,n,item);if(!result?.ok)continue;}
  else if(num(item.minStageReq,Math.max(1,Math.floor((num(item.tier,1)+1)/2)))>Math.max(band(n),num(j.trackOrdinal,1)))continue;
  seen.add(id);out.push(item);
 }
 return out;
}
function speciesFor(g,n){const id=n?.speciesId||n?.individual?.speciesId;return g?.myriad?.resolveSpecies?.(id)||(root.World2026Engine?.PATCH140_DATA?.BEAST_SPECIES_V140||[]).find(s=>s.id===id)||root.JianghuMyriadWorldsData?.beastMap?.get(id)||{};}
function beastProfile(n,species){
 const ind=n?.individual||n||{},words=[n?.speciesId,n?.name,n?.bodyPlan,n?.element,species.id,species.nameTh,species.bodyPlan,species.element,ind.bodyPlan,ind.element,...(species.behaviorTags||[])].join(' ').toUpperCase();
 if(/SPIRIT_ENTITY|SPIRIT_CONSTRUCT|GHOST|SOUL|PHANTOM|WISP|VOID_SPIRIT|วิญญาณ|ภูต|ดวงจิต/.test(words))return {id:'spirit',label:'กายาอสูรจิตวิญญาณ',physicalAttack:.62,artAttack:1.35,armor:.75,resistance:1.6,accuracy:1.08,evasion:1.12,attackSpeed:1.04,moveSpeed:1.08};
 if(/BOAR|BEAR|TURTLE|TORTOISE|RHINO|GOLEM|CONSTRUCT|ARMORED|CARAPACE|หมี|หมูป่า|เต่า|เกราะ|ศิลา/.test(words))return {id:'armored',label:'กายาอสูรเกราะศิลา',physicalAttack:1.05,artAttack:.70,armor:1.65,resistance:1.05,accuracy:.95,evasion:.66,attackSpeed:.78,moveSpeed:.76};
 if(/WOLF|FOX|CRANE|HAWK|EAGLE|FALCON|RABBIT|BAT|SWIFT|WIND|AVIAN|หมาป่า|จิ้งจอก|กระเรียน|อินทรี|เหยี่ยว|ค้างคาว|วายุ/.test(words))return {id:'swift',label:'กายาอสูรวายุคล่องแคล่ว',physicalAttack:1.08,artAttack:.85,armor:.70,resistance:.85,accuracy:1.05,evasion:1.3,attackSpeed:1.18,moveSpeed:1.18};
 return {id:'balanced',label:'กายาอสูรสมดุล'};
}
function derive(game,entity,{explain=false,preKey=null}={}){
 const g=game||{},n=entity||{},sources=[],sheet={...zeroSheet};
 const add=(stat,value,source,label)=>{if(!keySet.has(stat)||!Number.isFinite(value)||Math.abs(value)<1e-10)return;sheet[stat]+=value;if(explain)sources.push({stat,source,label,value:round(value)});};
 const values=(map,source,label)=>{for(const [stat,value]of Object.entries(map))add(stat,value,source,label);};
 const scale=(stat,factor,source,label)=>add(stat,sheet[stat]*(factor-1),source,label);
 const bounds=(source,label)=>{for(const k of keys){const value=round(clamp(sheet[k],meta[k].min,meta[k].max));add(k,value-sheet[k],source,label);sheet[k]=value;}};
 let conditionRatios={};
 let usedBaseCache=false;
 if(n.core&&!n.stageLocal?.pet){
  const fn0=g?.progression?.compatible,fn1=g?.progression?.canStudyArtTier,fn2=g?.progression?.canEquipItem,fn3=g?.combatSystem?.activeArts;
  let bKey=null,cached=null;
  if(!explain&&typeof n==='object'){
   bKey=preKey||humanBaseSignature(g,n);
   cached=baseCache.get(n);
   if(cached&&cached.bKey===bKey&&cached.fn0===fn0&&cached.fn1===fn1&&cached.fn2===fn2&&cached.fn3===fn3){
    Object.assign(sheet,cached.baseSheet);
    const raw=cached.raw,healthyMap=cached.healthyMap,effective={};
    for(const id of bodyIds)effective[id]=effectiveDimension(n,id,raw[id]);
    for(const k of keys){let current=humanBase[k];for(const [id,w]of termEntries[k])current+=effective[id]*w;const healthy=healthyMap[k];conditionRatios[k]=healthy>0?clamp(current/healthy,.3,1):1;}
    conditionRatios.maxHP=1;conditionRatios.maxQi=1;
    const fatigue=clamp(num(n.core?.condition?.fatigue),0,100),pain=clamp(num(n.core?.human?.state?.pain),0,100),hunger=clamp(num(n.stageLocal?.needs?.hunger),0,100);
    conditionRatios.qiRegen*=clamp(1-fatigue*.004-pain*.001-hunger*.001,.3,1);
    usedBaseCache=true;
   }
  }
  if(!usedBaseCache){
   values(humanBase,'base','รากฐานกายามนุษย์');
   const raw={},effective={},healthyMap={};for(const id of bodyIds){raw[id]=humanDimension(n,id);effective[id]=effectiveDimension(n,id,raw[id]);}
   for(const k of keys){let healthy=humanBase[k],current=humanBase[k];for(const [id,w]of termEntries[k]){add(k,raw[id]*w,'body',BODY_LABELS[id]);healthy+=raw[id]*w;current+=effective[id]*w;}healthyMap[k]=healthy;conditionRatios[k]=healthy>0?clamp(current/healthy,.3,1):1;}
   const bVal=band(n),progress=bVal-1,growth=.16*progress+.035*Math.pow(progress,1.7),cultLabel=explain?'ตบะขอบเขต '+round(bVal):'';
   for(const [stat,weight]of growthEntries)scale(stat,1+growth*weight,'cultivation',cultLabel);
   add('accuracy',progress*2.8,'cultivation','ความเจนศึกตามตบะ');add('evasion',progress*1.25,'cultivation','การอ่านวิถีตามตบะ');add('controlResist',progress*.012,'cultivation','จิตตั้งมั่นตามตบะ');
   const openMeridians=meridianDefs.reduce((sum,m)=>sum+Math.floor(clamp(num(n.jianghu?.meridiansV150?.[m.id]),0,num(m.maxNodes,9))),0);
   if(openMeridians>0){
    const mLabel=explain?'เปิดจุดชีพจรปราณ ('+openMeridians+' จุด)':'';
    values({maxQi:openMeridians*3.5,qiRegen:openMeridians*.06,artAttack:openMeridians*1.5,penetration:openMeridians*.8},'cultivation',mLabel);
   }
   const items=equippedItems(g,n);
   for(const item of items){const label=explain?'ศาสตรา '+(item.nameTh||item.name||item.id):'';
    for(const stat of keys){const explicit=[statValue(item.combatStats,stat),statValue(item.stats,stat),statValue(item.statBonuses,stat),statValue(item,stat)].find(v=>typeof v==='number'&&Number.isFinite(v));if(explicit!==undefined)add(stat,clamp(explicit,-meta[stat].max,meta[stat].max),'equipment',label);}
   }
   // Rune affixes are already baked into combatMult/defenseMult by the item factory.
   const attackBase=sheet.physicalAttack,artBase=sheet.artAttack,armorBase=sheet.armor,resistBase=sheet.resistance;
   for(const item of items){const name=explain?(item.nameTh||item.name||item.id):'',attack=clamp(num(item.combatMult),-.75,3),defense=clamp(num(item.defenseMult),-.75,3);add('physicalAttack',(100+attackBase)*attack,'equipment',explain?'อานุภาพ '+name:'');add('artAttack',(100+artBase)*attack,'equipment',explain?'อานุภาพ '+name:'');add('armor',(60+armorBase)*defense,'equipment',explain?'คุ้มกาย '+name:'');add('resistance',(60+resistBase)*defense,'equipment',explain?'คุ้มปราณ '+name:'');
    if(item.weaponSpirit){const spirit=clamp(num(item.weaponSpirit.bonusMult,.04),0,.5),sLabel=explain?'จิตศาสตรา '+(item.weaponSpirit.nameTh||name):'';add('physicalAttack',attackBase*spirit,'equipment',sLabel);add('artAttack',artBase*spirit,'equipment',sLabel);}
   }
   const set=(root.JianghuExpansionV112?.equipmentSetsV114||[]).find(s=>s.path===n.jianghu?.path);
   if(set&&items.filter(it=>it.setId===set.id).length===3){const a=clamp(num(set.bonusCombatPct,12)/100,0,.5),d=clamp(num(set.bonusDefensePct,10)/100,0,.5),label=explain?'สั่นพ้อง '+(set.nameTh||'ชุดศาสตรา'):'';add('physicalAttack',attackBase*a,'equipment',label);add('artAttack',artBase*a,'equipment',label);add('armor',armorBase*d,'equipment',label);add('resistance',resistBase*d,'equipment',label);}
   for(const entry of preparedArts(g,n)){const a=entry.art,m=clamp(num(entry.knowledge.mastery),8,100),tier=clamp(num(a.tier,1),1,12),strength=(.35+m*.0065)*(1+(tier-1)*.08),label=explain?(entry.innate?'วิชาตื่นรู้ ':'วิชาตระเตรียม ')+(a.nameTh||a.id)+' · ชำนาญ '+round(m):'';
    let bonus={};
    if(entry.role==='mantra'||entry.slot==='mantra')bonus={maxQi:5*strength,qiRegen:.20*strength,resistance:1.5*strength};
    else if(entry.role==='movement')bonus={accuracy:2*strength,evasion:3.5*strength,attackSpeed:.025*strength,moveSpeed:3.5*strength};
    else if(entry.role==='defense')bonus={armor:4.5*strength,resistance:3*strength,controlResist:.009*strength};
    else if(entry.role==='recovery')bonus={maxQi:3*strength,qiRegen:.18*strength,resistance:2*strength};
    else if(entry.role==='control')bonus={artAttack:3.5*strength,accuracy:2*strength,penetration:1.5*strength};
    else bonus={[a.path==='BODY'?'physicalAttack':'artAttack']:(entry.role==='forbidden'?5.5:4.5)*strength,accuracy:1.3*strength,penetration:.8*strength};
    values(bonus,'arts',label);
    if(entry.slot==='mantra'||entry.role==='mantra'){
     const passive=a.combat117?.buff;
     if(passive==='IRON_AEGIS')values({armor:3*strength,resistance:2*strength},'arts',explain?label+' · กายประสานปราณ':'');
     if(passive==='QI_SURGE')values({artAttack:2.5*strength,maxQi:4*strength},'arts',explain?label+' · เดินปราณพลุ่งพล่าน':'');
     if(passive==='MIND_MIRROR')values({resistance:3*strength,accuracy:2*strength,controlResist:.012*strength},'arts',explain?label+' · กระจกจิต':'');
    }
    if(a.combatStats||a.statBonuses)for(const stat of keys){const v=statValue(a.combatStats,stat)??statValue(a.statBonuses,stat);if(Number.isFinite(v))add(stat,clamp(v,-meta[stat].max,meta[stat].max)*strength,'arts',label);}
   }
   // Capacity and current health have separate meanings: fatigue/injury do not rewrite full vitality.
   conditionRatios.maxHP=1;conditionRatios.maxQi=1;
   const fatigue=clamp(num(n.core?.condition?.fatigue),0,100),pain=clamp(num(n.core?.human?.state?.pain),0,100),hunger=clamp(num(n.stageLocal?.needs?.hunger),0,100);
   conditionRatios.qiRegen*=clamp(1-fatigue*.004-pain*.001-hunger*.001,.3,1);
   bounds('base','ขีดจำกัดค่าสถานะ');
   if(!explain&&bKey&&!Object.isFrozen(n))baseCache.set(n,{bKey,fn0,fn1,fn2,fn3,baseSheet:{...sheet},raw,healthyMap});
  }
 }else{
  const species=speciesFor(g,n),ind=n.individual||n,tier=clamp(num(n.tier,num(ind.tier,num(species.tier,1))),1,12),power=clamp(num(n.power,num(ind.power,num(species.combatPower,100))),0,10000000),force=Math.sqrt(power/100),nativeHP=num(n.maxHP,num(ind.maxHP,110+tier*26));
  values({maxHP:clamp(nativeHP,1,1000000),physicalAttack:22+force*16,artAttack:20+force*13,armor:12+tier*3,resistance:10+tier*3.3,accuracy:78+tier*4,evasion:16+tier*2,critChance:.04+tier*.003,critMultiplier:1.45,attackSpeed:.74+tier*.014,moveSpeed:46+tier*1.2,penetration:3+tier*1.6,controlResist:.05+tier*.013,maxQi:24+tier*8,qiRegen:.8+tier*.10},'base',explain?'รากฐานสายเลือด '+(species.nameTh||n.nameTh||n.name||'สัตว์อสูร'):'');
  const profile=beastProfile(n,species);for(const stat of keys)if(Number.isFinite(profile[stat]))scale(stat,profile[stat],'body',profile.label);
  const identity=ind.individualId||n.individualId;
  if(identity){let code=2166136261;for(const c of String(identity)){code^=c.charCodeAt(0);code=Math.imul(code,16777619);}code>>>=0;const phenotype=(divisor)=>(Math.floor(code/divisor)%101-50)/50;add('accuracy',phenotype(1)*1.8,'body','ลักษณะเฉพาะตัวอสูร');add('evasion',phenotype(101)*1.2,'body','ลักษณะเฉพาะตัวอสูร');add('attackSpeed',phenotype(10201)*.015,'body','ลักษณะเฉพาะตัวอสูร');add('moveSpeed',phenotype(1030301)*1.2,'body','ลักษณะเฉพาะตัวอสูร');}
  const age=ind.ageClass||n.ageClass;
  if(age==='JUVENILE'){scale('attackSpeed',1.06,'body','ความปราดเปรียววัยเยาว์');scale('controlResist',.85,'body','จิตอสูรวัยเยาว์');}
  if(age==='ELDER'||age==='ANCIENT'){const old=age==='ANCIENT'?2:1;add('accuracy',old*3,'body','สัญชาตญาณอสูรอาวุโส');add('armor',old*2,'body','เกล็ดกระดูกอสูรอาวุโส');add('resistance',old*3,'body','ตบะปราณอสูรอาวุโส');add('controlResist',old*.015,'body','จิตอสูรบรรพกาล');scale('attackSpeed',1-old*.035,'body','สังขารตามวัยอสูร');}
  // Native power/HP already carry age, variant and mutation multipliers. Only the
  // individual anatomy changes here; never multiply native power or vitality again.
  const organ=ind.rareOrgan||n.rareOrgan;if(organ){const tags=(organ.propertyTags||[]).join(' ').toUpperCase(),label=explain?'อวัยวะกลายพันธุ์ '+(organ.nameTh||'สายเลือดพิเศษ'):'';if(/WIND|SWIFT|FEATHER|SPEED/.test(tags)){add('evasion',4,'body',label);scale('moveSpeed',1.06,'body',label);}else if(/SOUL|MIND|SPIRIT|QI/.test(tags)){add('resistance',5,'body',label);add('maxQi',8,'body',label);}else{add('armor',4,'body',label);add('penetration',2,'body',label);}}
  const hunger=clamp(num(n.hunger),0,100),fatigue=clamp(num(n.fatigue,num(n.core?.condition?.fatigue)),0,100),injured=ind.hasPriorInjury?.05:0,ready=clamp(1-hunger*.0015-fatigue*.002-injured,.5,1);
  for(const stat of ['physicalAttack','artAttack','attackSpeed','moveSpeed','accuracy','evasion'])conditionRatios[stat]=ready;
  conditionRatios.qiRegen=clamp(1-hunger*.003-fatigue*.004,.3,1);
  bounds('base','ขีดจำกัดค่าสถานะ');
 }
 const baseStats=explain?{...sheet}:null;
 for(const [stat,factor]of Object.entries(conditionRatios))scale(stat,factor,'condition','สภาพร่างกาย ความล้า บาดเจ็บ และความหิว');
 if(n.core&&!n.stageLocal?.pet){
  const intInj=clamp(num(n.jianghu?.internalInjury),0,100),poison=clamp(num(n.jianghu?.poisonAccumulated),0,100),tox=clamp(num(n.jianghu?.pillToxicity),0,100),demon=clamp(num(n.jianghu?.heartDemon),0,100);
  if(intInj>0){const f=clamp(1-intInj*.0022,.72,1);for(const st of ['physicalAttack','artAttack','qiRegen'])scale(st,f,'condition','บาดเจ็บภายในสะสม');}
  if(poison>0||tox>=30){const pEff=poison+Math.max(0,tox-25)*.6,f=clamp(1-pEff*.002,.74,1);for(const st of ['armor','resistance','qiRegen'])scale(st,f,'condition','พิษสะสมแทรกซึมเส้นปราณ');}
  if(demon>=15){const dEff=demon-10;scale('accuracy',clamp(1-dEff*.0018,.80,1),'condition','จิตมารรบกวนสมาธิ');add('controlResist',-clamp(dEff*.0015,0,.12),'condition','จิตมารสั่นคลอนทะเลสำนึก');}
 }else if(n.ownerId&&num(n.trust,20)>20){
  const bond=clamp((num(n.trust,20)-20)/80,0,1),bLabel='สายสัมพันธ์พันธสัญญาอสูร';
  scale('physicalAttack',1+bond*.12,'status',bLabel);scale('artAttack',1+bond*.12,'status',bLabel);
  add('accuracy',bond*6,'status',bLabel);add('resistance',bond*5,'status',bLabel);
 }
 const now=num(g.s?.t),state=(n.stageLocal||n).combatState||{},active=(group,tag)=>num(state[group]?.[tag]?.expiresAt,-1)>now;
 const statusScale=(stat,factor,label)=>scale(stat,factor,'status',label);
 if(active('buffs','QI_SURGE'))statusScale('artAttack',1.12,'ปราณพลุ่งพล่านหนุนวิชา');
 if(active('buffs','SWORD_INTENT')){const f=1+clamp(num(state.buffs.SWORD_INTENT.stacks,1),1,3)*.03;statusScale('physicalAttack',f,'เจตจำนงกระบี่คมกล้า');statusScale('artAttack',f,'เจตจำนงกระบี่คมกล้า');}
 if(active('buffs','IRON_AEGIS')){statusScale('armor',1.18,'เกราะเหล็กคุ้มกาย');statusScale('resistance',1.12,'เกราะเหล็กคุ้มปราณ');}
 if(active('buffs','WIND_STRIDE')){statusScale('moveSpeed',1.12,'ท่าร่างก้าววายุ');add('evasion',5,'status','ท่าร่างก้าววายุ');}
 if(active('buffs','BLOOD_FRENZY')){statusScale('physicalAttack',1.10,'โลหิตคลั่งสังหาร');statusScale('armor',.95,'โลหิตคลั่งสังหาร');}
 if(active('buffs','MIND_MIRROR')){statusScale('resistance',1.12,'กระจกจิตสะท้อนมรรคา');add('accuracy',6,'status','กระจกจิตสะท้อนมรรคา');add('controlResist',.06,'status','กระจกจิตสะท้อนมรรคา');}
 if(active('debuffs','SOUL_TREMOR')){statusScale('artAttack',.88,'ดวงจิตสั่นสะท้าน');statusScale('resistance',.88,'ดวงจิตสั่นสะท้าน');}
 if(active('debuffs','ARMOR_SUNDER'))statusScale('armor',.75,'เกราะคุ้มกายปริร้าว');
 if(active('debuffs','MERIDIAN_SEAL')){statusScale('qiRegen',.5,'ชีพจรปราณถูกสะกด');statusScale('artAttack',.9,'ชีพจรปราณถูกสะกด');}
 if(active('debuffs','FROST_SHACKLE')){statusScale('moveSpeed',.76,'โซ่เหมันต์พันธนาการ');statusScale('attackSpeed',.9,'โซ่เหมันต์พันธนาการ');}
 if(num(state.chillUntil)>now){statusScale('attackSpeed',.82,'ไอเหมันต์หน่วงเหนี่ยว');statusScale('moveSpeed',.72,'ไอเหมันต์หน่วงเหนี่ยว');}
 if(num(state.exposedUntil)>now){statusScale('armor',.85,'เผยช่องโหว่กระบวนท่า');statusScale('evasion',.85,'เผยช่องโหว่กระบวนท่า');}
 if(n.core&&!n.stageLocal?.pet&&g?.s?.storyEvents?.active&&(g.s.heroIds||[]).includes(n.id)){
  const se=g.s.storyEvents;
  for(const doc of (se.doctrines||[])){
   const lbl=explain?'มติสำนัก · '+(doc.nameTh||doc.id):'',m=doc.mods||{};
   if(m.scale||m.add)for(const k of keys){const factor=statValue(m.scale,k);if(Number.isFinite(factor))statusScale(k,factor,lbl);add(k,statValue(m.add,k),'status',lbl);}
  }
  for(const af of (se.aftermaths||[])){
   if(num(af.expiresAt,-1)>now){
    const lbl=explain?'ผลพวงอีเวนต์ · '+(af.nameTh||af.id):'',m=af.mods||{};
    if(m.scale||m.add)for(const k of keys){const factor=statValue(m.scale,k);if(Number.isFinite(factor))statusScale(k,factor,lbl);add(k,statValue(m.add,k),'status',lbl);}
   }
  }
 }
 bounds('status','ขีดจำกัดค่าสถานะปัจจุบัน');
 if(explain){sheet.baseStats=baseStats;sheet.sources=sources;}
 return sheet;
}
const api=Object.freeze({VERSION,derive,equippedItems,humanBaseSignature,meta,statKeys:Object.freeze([...keys])});
root.CombatStats201=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
