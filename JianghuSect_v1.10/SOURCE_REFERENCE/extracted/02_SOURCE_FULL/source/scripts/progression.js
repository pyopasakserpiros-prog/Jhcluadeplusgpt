/* Living progression 1.4 + v1.16 Coherence & Expansion.
   External activities, 5 major paths / 41 subpaths registration, weighted fortuitous manual pools,
   unified pill semantics, non-destructive scripture deduction, and stable crafting plans; Human Foundation (human.js) is unchanged. */
(function(root){'use strict';
const H=root.HumanCore||(typeof require==='function'?require('./human'):null),E=root.World2026Engine||(typeof require==='function'?require('./legacy/src/engine'):null);
const HERB='MAT_HERB_DEW_GRASS_1',ORE='MAT_ORE_BLACK_IRON_1',CIN='MAT_ORE_CINNABAR_1',FANG='MAT_BP_WOLF_FANG_1',ORCHID='MAT_HERB_MIST_ORCHID_2',GINSENG='MAT_HERB_BLOOD_GINSENG_3',CINDER='MAT_HERB_CINDER_LEAF_1';
const alive=n=>n?.alive&&n.health>0,dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x)),copy=x=>JSON.parse(JSON.stringify(x));
const RECIPE_DATA=[
 ['remedy','โอสถสมานแผล','alchemy',1,25,[[HERB,2]],{heal:22,pain:6}],
 ['qi','โอสถน้ำค้างปราณ','alchemy',1,30,[[HERB,2],[CIN,1]],{progress:5,toxicity:3}],
 ['clarity','โอสถประคองใจ','alchemy',1,32,[[HERB,2],[ORCHID,1]],{grief:12,toxicity:1}],
 ['pure','โอสถชำระพิษ','alchemy',1,34,[[HERB,2],[CIN,1]],{cleanse:14}],
 ['ginseng','โอสถโสมฟื้นกาย','alchemy',2,45,[[GINSENG,1],[HERB,2]],{heal:38,pain:14,toxicity:2}],
 ['lotus','โอสถกล้วยไม้รวมปราณ','alchemy',2,48,[[ORCHID,2],[CIN,2]],{progress:9,toxicity:5}],
 ['ironblade','กระบี่เหล็กดำฝึกยุทธ์','forge',1,25,[[ORE,2],[FANG,1]],{slot:'WEAPON',combat:.07,defense:.01}],
 ['armor','เกราะเหล็กประสานปราณ','forge',1,34,[[ORE,3],[CIN,1]],{slot:'ARMOR',combat:.01,defense:.08}],
 ['guard','ยันต์หยกคุ้มชีพ','forge',1,35,[[ORE,1],[HERB,2],[CIN,1]],{slot:'TALISMAN_VESSEL',combat:.01,defense:.06}],
 ['flame','กระบี่ชาดเพลิง','forge',2,47,[[ORE,3],[CIN,2],[FANG,2]],{slot:'WEAPON',combat:.12,defense:.01}],
 ['jade','อาภรณ์กล้วยไม้หยก','forge',2,46,[[ORE,2],[ORCHID,2]],{slot:'ARMOR',combat:.02,defense:.11}],
 ['scholar','เครื่องรางจารึกสงบจิต','forge',2,48,[[ORE,2],[ORCHID,1],[CIN,2]],{slot:'TALISMAN_VESSEL',combat:.02,defense:.04,study:.06}]
];
const RECIPES=RECIPE_DATA.map(([id,name,workshop,tier,min,inputs,effect])=>({id:'L14_'+id,name,workshop,tier,min,inputs:inputs.map(([matId,count])=>({matId,count})),effect,duration:workshop==='alchemy'?16+tier*4:20+tier*4}));

const LABELS={
 researchRecipe:'ศึกษาตำรับโบราณ',
 makePersonalItem:'ลงมือหลอมสร้างด้วยตนเอง',
 gatherIngredient:'ออกเสาะหาตัวยาและแร่ตามตำรับ',
 takeIngredient:'เบิกเครื่องปรุงจากคลังสำนัก',
 readScripture:'ขบคิดทำความเข้าใจคัมภีร์',
 readLibraryScripture:'ศึกษาคัมภีร์ในหอสืบทอด',
 donateScripture:'นำคัมภีร์เข้าหอสืบทอด',
 practiceScripture:'เคี่ยวกรำฝึกฝนวิชายุทธ์',
 usePersonalPill:'กลืนโอสถเดินลมปราณ',
 comprehendTablet:'เพ่งจิตศึกษารอยกระบี่และศิลาจารึก',
 meditateWaterfall:'เข้าฌานเคี่ยวกรำกายใต้น้ำตกหยก',
 brewTeaDao:'ชงชาวิญญาณสนทนาธรรมชำระจิต',
 copyScripture:'คัดลอกคัมภีร์สืบทอดเข้าหอคัมภีร์',
 synthesizeScriptures:'เทียบเคล็ดคัมภีร์อนุมานวิชาใหม่',
 patrolSect:'ลาดตระเวนคุ้มภัยหุบเขาเมฆาคราม'
};

// Register activity descriptors for progression & v1.12 contextual NPC actions
for(const [id,basis] of Object.entries({
 researchRecipe:'alchemy',
 makePersonalItem:'forging',
 gatherIngredient:'herb',
 takeIngredient:'deposit',
 readScripture:'discussDao',
 readLibraryScripture:'discussDao',
 donateScripture:'discussDao',
 practiceScripture:'train',
 usePersonalPill:'heal',
 comprehendTablet:'discussDao',
 meditateWaterfall:'train',
 brewTeaDao:'alchemy',
 copyScripture:'discussDao',
 synthesizeScriptures:'discussDao',
 patrolSect:'defend'
})){
 H.registerActivity({
  ...H.descriptor(basis),
  id,
  label:LABELS[id],
  skillDomain:id==='researchRecipe'||id==='donateScripture'||id==='copyScripture'||id==='brewTeaDao'?'scholarship':id==='readScripture'||id==='readLibraryScripture'||id==='comprehendTablet'?'scriptureReading':id==='practiceScripture'?'martialPractice':id==='makePersonalItem'?'personalCraft':H.descriptor(basis).skillDomain,
  ...(id==='donateScripture'||id==='copyScripture'?{valueWeights:{sectDuty:.35,knowledgeCraft:.35,honorLegacy:.2}}:{}),
  ...(id==='comprehendTablet'?{interestWeights:{analysis:.45,practice:.35,exploration:.2},cognitiveWeights:{attention:.4,spatialReasoning:.3,metacognition:.3}}:{}),
  ...(id==='meditateWaterfall'?{interestWeights:{tranquility:.45,exertion:.3,nature:.25},needRelief:{autonomy:.3,competence:.4}}:{}),
  ...(id==='brewTeaDao'?{interestWeights:{tranquility:.45,companionship:.3,care:.25},needRelief:{social:.35,autonomy:.25}}:{}),
  ...(id==='patrolSect'?{valueWeights:{sectDuty:.45,honorLegacy:.25,familyClan:.2},personalityWeights:{courage:.3,discipline:.3,empathy:.2}}:{})
 });
}

// Register HumanCore descriptors for the 2 new Major Paths (DEMON, HEART_SOUL) and 14 new Subpaths
H.registerActivity({
 ...H.descriptor('path:XIAN'),
 id:'path:DEMON',
 label:'วิถีมารอสูร',
 skillDomain:'path:DEMON',
 valueWeights:{freedom:.4,martialPeak:.35,powerStatus:.25},
 bodyWeights:{agility:.4,senseAcuity:.35,endurance:.25},
 cognitiveWeights:{processingSpeed:.35,attention:.35,reasoning:.3},
 interestWeights:{risk:.4,competition:.35,exploration:.25},
 aptitudeWeights:{combat:.18,cultivation:.12},
 personalityWeights:{ambition:.35,courage:.3,caution:-.15}
});
H.registerActivity({
 ...H.descriptor('path:XIAN'),
 id:'path:HEART_SOUL',
 label:'วิถีจิตวิญญาณและเซน',
 skillDomain:'path:HEART_SOUL',
 valueWeights:{knowledgeCraft:.45,freedom:.25,honorLegacy:.2},
 bodyWeights:{senseAcuity:.55,coordination:.25,endurance:.2},
 cognitiveWeights:{metacognition:.4,systemsThinking:.35,verbalComprehension:.25},
 interestWeights:{tranquility:.45,analysis:.35,expression:.2},
 aptitudeWeights:{comprehension:.2,cultivation:.12},
 personalityWeights:{composure:.4,rationality:.3,empathy:.2}
});

const SUBPATH_DESCRIPTORS_V112=[
 ['CLOUD_WIND_SAGE','scout',{curiosity:.3,composure:.25},{bodyWeights:{agility:.5,coordination:.3,senseAcuity:.2},interestWeights:{exploration:.45,tranquility:.3,practice:.25}}],
 ['FROST_MOON_IMMORTAL','path:XIAN',{composure:.4,discipline:.3},{interestWeights:{tranquility:.5,analysis:.3,practice:.2}}],
 ['STAR_METEOR_BODY','path:BODY',{courage:.35,discipline:.35},{bodyWeights:{strength:.45,durability:.35,power:.2}}],
 ['WOOD_SPRING_BODY','herb',{empathy:.3,composure:.35},{bodyWeights:{endurance:.45,immuneResilience:.35,recoveryRate:.2},interestWeights:{nature:.45,care:.35,tranquility:.2}}],
 ['THUNDER_PUNISHER_GOD','defend',{courage:.35,integrity:.35,discipline:.25},{valueWeights:{sectDuty:.4,honorLegacy:.3,martialPeak:.3}}],
 ['MEDICINE_BODHI_GOD','alchemy',{empathy:.45,integrity:.3,composure:.25},{interestWeights:{care:.5,nature:.3,tranquility:.2},valueWeights:{familyClan:.35,sectDuty:.35,knowledgeCraft:.2}}],
 ['SHADOW_ASSASSIN','hunt',{caution:.25,courage:.3,ambition:.25},{bodyWeights:{agility:.5,dexterity:.3,senseAcuity:.2},interestWeights:{risk:.4,competition:.35,exploration:.25}}],
 ['VENOM_GU_SOVEREIGN','alchemy',{curiosity:.35,caution:.25,ambition:.25},{interestWeights:{nature:.4,analysis:.35,risk:.25}}],
 ['NETHER_GHOST_KING','path:DEMON',{composure:.35,ambition:.3},{cognitiveWeights:{metacognition:.4,attention:.35,reasoning:.25}}],
 ['HEAVEN_DEVOURING_DEMON','hunt',{ambition:.45,courage:.35,aggression:.2},{valueWeights:{martialPeak:.5,powerStatus:.35,freedom:.15}}],
 ['ZEN_VOID_MIND','path:HEART_SOUL',{composure:.45,discipline:.3,empathy:.2},{interestWeights:{tranquility:.55,analysis:.25,care:.2}}],
 ['CALLIGRAPHY_PAINTING_SAGE','alchemy',{creativity:.45,discipline:.25,curiosity:.25},{interestWeights:{creation:.45,expression:.35,analysis:.2},valueWeights:{knowledgeCraft:.5,honorLegacy:.25}}],
 ['DREAM_ILLUSION_WEAVER','path:HEART_SOUL',{creativity:.4,curiosity:.35},{cognitiveWeights:{metacognition:.4,socialInsight:.35,spatialReasoning:.25},interestWeights:{expression:.4,exploration:.35,tranquility:.25}}],
 ['MIND_SWORD_TELEKINESIS','hunt',{discipline:.35,composure:.35,ambition:.2},{cognitiveWeights:{attention:.45,spatialReasoning:.35,processingSpeed:.2},valueWeights:{martialPeak:.45,knowledgeCraft:.35}}]
];
for(const [subId,basis,pw,overrides] of SUBPATH_DESCRIPTORS_V112){
 const baseDesc=H.activities[basis]||H.descriptor('train');
 const labelObj=Object.values(E.CULTIVATION_PATHS||{}).flatMap(p=>Object.values(p.subPaths||{})).find(s=>s.id===subId);
 H.registerActivity({
  ...baseDesc,
  id:'subpath:'+subId,
  label:labelObj?.nameTh||subId,
  skillDomain:'cultivation',
  personalityWeights:pw,
  ...overrides
 });
}

function normalizePillEffect(stackOrEffect,world=null){
 const raw=(stackOrEffect&&(stackOrEffect.livingEffect||stackOrEffect.effect))?{...(stackOrEffect.effect||{}),...(stackOrEffect.livingEffect||{})}:(stackOrEffect||{});
 const recId=stackOrEffect?.recipeId;
 const regRec=recId&&world?.jianghu?.systemsV140?.recipes?.registry?.[recId];
 const merged=regRec?.effect?{...regRec.effect,...raw}:raw;
 return {
  healHealth:Number(merged.healHealth||merged.heal||0),
  healInjury:Number(merged.healInjury||merged.healInternalInjury||merged.pain||0),
  restoreQi:Number(merged.restoreQi||0),
  cultivationProgress:Number(merged.cultivationProgress||merged.progress||0),
  heartDemonRelief:Number(merged.heartDemonRelief||merged.clearHeartDemon||0),
  griefRelief:Number(merged.grief||merged.clarityGain||0),
  clearPoison:Number(merged.clearPoison||merged.poisonRelief||0),
  toxicityRelief:Number(merged.toxicityRelief||merged.purifyPillToxicity||merged.cleanse||0),
  foundationBonus:Number(merged.foundationBonus||merged.foundationGain||0),
  daoComprehensionBonus:Number(merged.daoComprehensionBonus||0),
  lifespanBonus:Number(merged.lifespanBonus||merged.lifespanBonusYears||merged.lifespanGain||0),
  tribulationResist:Number(merged.tribulationResist||0),
  openMeridianBonus:Number(merged.openMeridianBonus||0),
  toxicity:Number(merged.toxicity??0)
 };
}

class Progression{
 constructor(g){
  this.g=g;
  this.arts=E.getAllTechniquesCatalogV190();
  this.artMap=new Map(this.arts.map(a=>[a.id,a]));
  if(!g.s.growth){
   g.s.growth={schemaVersion:2,nextId:1,researchFund:0,receipts:[],researchProjects:[],formulaRegistry:[],bookLoans:[],scriptureLibrary:[],libraryReceipts:[],archivedResearchNotes:[]};
   for(const node of [{id:'orchid',mat:ORCHID,x:2480,y:1850,qty:16,max:16,regen:.008},{id:'ginseng',mat:GINSENG,x:1500,y:2500,qty:12,max:12,regen:.006}])
    if(!g.s.nodes.some(z=>z.id===node.id))g.s.nodes.push(node);
  }
  if(!Array.isArray(g.s.growth.scriptureLibrary))g.s.growth.scriptureLibrary=[];
  if(!Array.isArray(g.s.growth.libraryReceipts))g.s.growth.libraryReceipts=[];
  if(!Array.isArray(g.s.growth.archivedResearchNotes))g.s.growth.archivedResearchNotes=[];
  if(g.s.growth.schemaVersion!==2||!Number.isFinite(g.s.growth.researchFund)||g.s.growth.researchFund<0||!Array.isArray(g.s.growth.receipts)||!Array.isArray(g.s.growth.researchProjects)||!Array.isArray(g.s.growth.formulaRegistry)||!Array.isArray(g.s.growth.bookLoans)||!Number.isSafeInteger(g.s.growth.nextId)||g.s.growth.nextId<1)
   throw Error('ข้อมูลเส้นทางชีวิตไม่ตรงแพตช์');
  for(const n of g.heroes){
   if(n.stageLocal.growth&&!Array.isArray(n.stageLocal.growth.knownRecipes))throw Error('ข้อมูลตำรับส่วนตัวไม่ถูกต้อง');
   this.initialize(n);
  }
 }
 id(prefix){return prefix+'-'+this.g.s.growth.nextId++;}
 receipt(kind,n,data={}){
  this.g.s.growth.receipts.unshift({id:this.id('life-work'),t:this.g.s.t,npcId:n.id,kind,...data});
  this.g.s.growth.receipts.splice(160);
 }
 slot(a){return /MANTRA/.test(a.category)?'mantra':/LIGHTNESS|MOVEMENT/.test(a.category)?'lightness':a.category==='FORBIDDEN_ART'?'forbidden':/AUXILIARY|SUPPORT/.test(a.category)?'auxiliary':'technique';}
 compatible(n,a){if(a?.innateRoute){const r=a.innateRoute;return n.jianghu.path===r.path&&n.jianghu.subPath===r.subPath&&(n.jianghu.trackOrdinal||1)>=r.ordinal;}return !!a&&(!a.path||a.path===n.jianghu.path||a.crossPathCompatibility?.allowedSecondaryPaths?.includes(n.jianghu.path));}
 tier(n){return n.jianghu.realizationBand||1;}
 canStudyArtTier(n,a){
  if(!a)return false;
  const req=a.requiredNormalizedTier||a.tier||1;
  if(req<=this.tier(n))return true;
  if(req<=2&&n?.jianghu?.heritageV115?.foundationArts?.[a.id])return true;
  if(req<=2&&a.path===n?.jianghu?.path&&a.subPath===n?.jianghu?.subPath&&n?.jianghu?.heritageV115?.routes?.[a.path+':'+a.subPath])return true;
  return false;
 }
 canEquipItem(n,item,opts={}){
  if(root.JianghuExpansionV112?.canEquipItem)return root.JianghuExpansionV112.canEquipItem(n,item,opts);
  if(!n?.jianghu||!item||!['WEAPON','ARMOR','TALISMAN_VESSEL'].includes(item.slot))return {ok:false,reason:'ไม่พบช่องอุปกรณ์'};
  if(Number(item.durability??100)<=0)return {ok:false,reason:'อุปกรณ์เสียหาย'};
  if(item.compatiblePath&&!['ANY',n.jianghu.path].includes(item.compatiblePath))return {ok:false,reason:'ไม่ตรงวิถีบ่มเพาะ'};
  const minStage=Number.isFinite(item.minStageReq)?item.minStageReq:Math.max(1,(item.tier||1)-1);
  if(Math.max(this.tier(n),n.jianghu.trackOrdinal||1)+1e-6<minStage)return {ok:false,reason:'ขอบเขตยังไม่ถึงเกณฑ์อุปกรณ์'};
  return {ok:true};
 }
 sanitizeEquippedItems(n){
  if(!n?.jianghu?.equipmentV140)return [];
  const j=n.jianghu,l=j.ledgerV140,removed=[];
  for(const slot of ['WEAPON','ARMOR','TALISMAN_VESSEL']){
   const eqId=j.equipmentV140[slot];
   if(!eqId)continue;
   const item=l?.equipmentItems?.find(x=>x.id===eqId);
   if(!item||!this.canEquipItem(n,item).ok){
    delete j.equipmentV140[slot];
    removed.push(eqId);
   }
  }
  if(removed.length)E.invalidateNpcCoreCache?.(n);
  return removed;
 }
 initialize(n){
  if(!n.stageLocal||n.stageLocal.enemy||n.stageLocal.service||n.stageLocal.visitor||n.stageLocal.growth)return;
  const j=n.jianghu,p=n.stageLocal;
  p.growth={career:H.liking(n,'alchemy')+H.capacity(n,'alchemy').total*.2>=H.liking(n,'forging')+H.capacity(n,'forging').total*.2?'alchemy':'forge',knownRecipes:['L14_remedy','L14_ironblade'],plan:null,careerPlan:null,needs:[],nextPlan:0,ticket:null,deducedPairs:{},archivedResearchNotes:[]};
  j.knowledgeV190={};j.artMasteryV150={};j.knownArtIdsV150=[];
  for(const slot of ['mantra','technique','lightness','auxiliary','forbidden']){j[slot+'Id']=null;j[slot+'NameTh']=null;}
  for(const slot of ['mantra','technique']){
   let pool=this.arts.filter(a=>!a.innateRoute&&!a.hiddenWorldArt&&this.slot(a)===slot&&(!a.path||a.path===j.path)&&(a.tier||1)<=1&&!a.id.startsWith('ART_V112_')&&(!a.subPath||root.LivingDiscovery.TRADITIONS[j.path]?.includes(a.subPath)));
   if(!pool.length)pool=this.arts.filter(a=>!a.innateRoute&&!a.hiddenWorldArt&&this.slot(a)===slot&&this.compatible(n,a)&&(a.tier||1)<=2);
   pool.sort((a,b)=>(b.subPath===j.subPath)-(a.subPath===j.subPath)||String(a.id).localeCompare(String(b.id)));
   if(pool.length){
    const a=pool[0];this.g.s.growth.sectArtIds=[...new Set([...(this.g.s.growth.sectArtIds||[]),a.id])];
    j.knowledgeV190[a.id]={artId:a.id,stage:4,mastery:8,reading:100,source:'STARTER_LESSON'};
    j.artMasteryV150[a.id]=8;
    j.knownArtIdsV150.push(a.id);
    j[slot+'Id']=a.id;
    j[slot+'NameTh']=a.nameTh;
   }
  }
  E.invalidateNpcCoreCache(n);
 }
 support(){const s=this.g.s.growth;if(s.researchFund>=180)return {ok:false,reason:'กองทุนเต็มแล้ว'};if(!this.g.money(-60,'กองทุนศึกษาตำรับ'))return {ok:false,reason:'ต้องมี 60 ศิลา'};s.researchFund+=60;return {ok:true};}
 refund(){const s=this.g.s.growth;if(!s.researchFund)return {ok:false,reason:'ไม่มีกองทุนคงเหลือ'};this.g.money(s.researchFund,'คืนกองทุนศึกษาตำรับ');s.researchFund=0;return {ok:true};}
 _ensureStaticRecipes(){
  if(!this._mwRecipes){
   this._mwRecipes=(root.JianghuMyriadWorldsData?.newRecipes||[]).map(r=>({
    id:r.id,
    name:r.outputNameTh||r.nameTh,
    nameTh:r.nameTh,
    workshop:r.craftPath==='ALCHEMY'||r.craftPath==='BEAST_TAMING'?'alchemy':'forge',
    discipline:r.craftPath,
    tier:r.tier||1,
    min:r.minMastery||25,
    inputs:r.inputs||[],
    duration:r.durationDays||20,
    compatiblePath:r.compatiblePath||'ANY',
    minStageReq:r.effect?.minStageReq,
    isTranscendent:!!r.isTranscendent,
    isMyriadCatalog:true,
    effect:r.outputType==='EQUIPMENT'
     ?{...(r.effect||{}),slot:r.outputSubSlot||'WEAPON',combat:r.effect?.combatMult??.12,defense:r.effect?.defenseMult??.04,study:r.effect?.studyBonus||0,dissectionBonus:r.effect?.dissectionBonus||0}
     :r.outputType==='BEAST_ITEM'
     ?{beastItem:true,...(r.effect||{})}
     :{heal:r.effect?.healHealth||0,pain:r.effect?.healInjury||0,restoreQi:r.effect?.restoreQi||0,progress:r.effect?.cultivationProgress||0,cleanse:r.effect?.clearPoison||0,toxicityRelief:r.effect?.toxicityRelief||0,heartDemonRelief:r.effect?.heartDemonRelief||0,grief:r.effect?.griefRelief||0,foundationBonus:r.effect?.foundationBonus||0,daoComprehensionBonus:r.effect?.daoComprehensionBonus||0,lifespanBonus:r.effect?.lifespanBonus||0,tribulationResist:r.effect?.tribulationResist||0,toxicity:r.effect?.toxicity||0}
   }));
   this._staticRecipeMap=new Map([...RECIPES,...this._mwRecipes].map(r=>[r.id,r]));
  }
 }
 allRecipes(){
  this._ensureStaticRecipes();
  const dyn=(this.g.s.growth.formulaRegistry||[]).map(f=>f.recipe).filter(Boolean);
  return dyn.length?[...RECIPES,...dyn,...this._mwRecipes]:[...RECIPES,...this._mwRecipes];
 }
 recipe(id){
  if(!id)return undefined;
  this._ensureStaticRecipes();
  const hit=this._staticRecipeMap.get(id);
  if(hit)return hit;
  return (this.g.s.growth.formulaRegistry||[]).map(f=>f.recipe).find(r=>r&&r.id===id);
 }
 equippedCraftBonus(n,kind='alchemy'){
  const items=root.CombatStats201?.equippedItems?.(this.g,n)||[];
  const normalize=path=>String(path||'').toUpperCase().replace(/^FORGE$/,'FORGING'),target=normalize(kind);
  return items.reduce((sum,it)=>{
   if(!Number.isFinite(it.craftBonusScore)||it.craftBonusScore<=0)return sum;
   const cp=normalize(it.craftBonusPath);
   return cp==='ANY'||cp===target?sum+it.craftBonusScore:sum;
  },0);
 }
 equippedEscortBonus(n){
  return (root.CombatStats201?.equippedItems?.(this.g,n)||[]).reduce((sum,it)=>sum+(Number.isFinite(it.escortSafetyBonus)?Math.max(0,it.escortSafetyBonus):0),0);
 }
 effectScore(n,it){return (it.tier||1)*2+(it.combatMult||0)*(60+H.liking(n,'hunt'))+(it.defenseMult||0)*(55+n.personality.caution)+(it.studyBonus||0)*(50+H.liking(n,'train'))+(it.craftBonusScore||0)*1.2+(it.escortSafetyBonus||0)*80;}
 bestEquipment(n){
  this.sanitizeEquippedItems(n);
  const j=n.jianghu,l=j.ledgerV140;
  return ['WEAPON','ARMOR','TALISMAN_VESSEL'].map(slot=>{
   const cur=l.equipmentItems.find(x=>x.id===j.equipmentV140?.[slot]);
   const curValid=cur&&this.canEquipItem(n,cur).ok?cur:null;
   const best=l.equipmentItems.filter(x=>x.slot===slot&&this.canEquipItem(n,x).ok).sort((a,b)=>this.effectScore(n,b)-this.effectScore(n,a))[0];
   return best&&best.id!==curValid?.id&&(!curValid||this.effectScore(n,best)>this.effectScore(n,curValid)+.1)?best:null;
  }).filter(Boolean);
 }
 equip(n){
  this.sanitizeEquippedItems(n);
  const candidates=this.bestEquipment(n);
  let count=0;
  for(const item of candidates){
   if(!this.canEquipItem(n,item).ok)continue;
   n.jianghu.equipmentV140[item.slot]=item.id;
   this.receipt('equip',n,{itemId:item.id,name:item.nameTh});
   count++;
  }
  E.invalidateNpcCoreCache(n);
  return count;
 }
 normalizePill(stackOrEffect){return normalizePillEffect(stackOrEffect,this.g.world);}
 inspectSlotAndComboState(n){
  const j=n?.jianghu||{},c=this.g.combatSystem;
  const cap=c?.attackCapacity?c.attackCapacity(n):1;
  const attackIds=Array.isArray(j.attackArtIds)?j.attackArtIds.filter(Boolean):(j.techniqueId?[j.techniqueId]:[]);
  const openAttackSlots=Math.max(0,cap-attackIds.length);
  const supportSlots={mantra:j.mantraId||null,lightness:j.lightnessId||null,auxiliary:j.auxiliaryId||null,forbidden:j.forbiddenId||null};
  const missingSupportSlots=['mantra','lightness','auxiliary','forbidden'].filter(s=>!j[s+'Id']);
  const prof=c?.profile?c.profile(n):{innateIds:[],style:'duelist'};
  const innateIds=(prof.innateIds||[]).filter(id=>{const a=this.artMap.get(id);return a&&c?.learned?.(n,a);});
  const equippedIds=[...new Set([...attackIds,...Object.values(supportSlots).filter(Boolean),...innateIds])];
  const equippedArts=equippedIds.map(id=>this.artMap.get(id)).filter(Boolean);
  const activeSetups=new Set(),activeConsumes=new Set();
  for(const a of equippedArts){
   const m=c?.mechanics?c.mechanics(a):(a.combat117||{});
   if(m?.setup)activeSetups.add(m.setup);
   if(m?.consume)activeConsumes.add(m.consume);
  }
  const unpairedSetups=[...activeSetups].filter(t=>!activeConsumes.has(t));
  const unpairedConsumes=[...activeConsumes].filter(t=>!activeSetups.has(t));
  return {
   attackCapacity:cap,
   filledAttackSlots:attackIds.length,
   openAttackSlots,
   attackIds,
   supportSlots,
   missingSupportSlots,
   innateIds,
   equippedIds,
   activeSetups:[...activeSetups],
   activeConsumes:[...activeConsumes],
   unpairedSetups,
   unpairedConsumes,
   style:prof.style||'duelist'
  };
 }
 scoreArtSuitability(n,a){
  if(!a||!n?.jianghu||a.innateRoute)return {eligible:false,score:-999,slot:null,reasonsTh:[],fillsOpenSlot:false,isSubPathMatch:false,isComboCompleter:false};
  const j=n.jianghu,c=this.g.combatSystem,slot=this.slot(a);
  const canTier=this.canStudyArtTier(n,a),isComp=this.compatible(n,a);
  if(!isComp||!canTier)return {eligible:false,score:-999,slot,reasonsTh:['ยังไม่ผ่านเงื่อนไขวิถีหรือขอบเขต'],fillsOpenSlot:false,isSubPathMatch:false,isComboCompleter:false};
  const st=this.inspectSlotAndComboState(n);
  const m=c?.mechanics?c.mechanics(a):(a.combat117||{});
  const slotLabels={technique:'โจมตี',mantra:'เดินปราณ',lightness:'ท่าร่าง',auxiliary:'คุ้มกาย',forbidden:'ต้องห้าม'};
  let score=(a.tier||1)*6+Math.min(16,(a.power||45)*.08);
  const reasonsTh=[];
  let fillsOpenSlot=false,isSubPathMatch=false,isComboCompleter=false;

  // 1. Slot need awareness
  if(slot==='technique'){
   if(st.openAttackSlots>0&&!st.attackIds.includes(a.id)){
    score+=28;fillsOpenSlot=true;
    reasonsTh.push(`เติมช่องโจมตีที่ว่าง (${st.filledAttackSlots}/${st.attackCapacity})`);
   }else if(!st.attackIds.includes(a.id)){
    const weakestTier=st.attackIds.reduce((minT,id)=>Math.min(minT,this.artMap.get(id)?.tier||1),99);
    if((a.tier||1)>weakestTier){score+=14;reasonsTh.push('ยกระดับช่องโจมตีแทนวิชาขั้นต่ำกว่า');}
   }
  }else{
   const curId=j[slot+'Id'],curArt=curId?this.artMap.get(curId):null;
   if(!curArt){
    score+=slot==='forbidden'?16:26;fillsOpenSlot=true;
    reasonsTh.push(`ช่อง${slotLabels[slot]||slot}ยังว่างอยู่`);
   }else if((a.tier||1)>(curArt.tier||1)||(a.subPath===j.subPath&&curArt.subPath!==j.subPath)){
    score+=14;
    reasonsTh.push(`ยกระดับช่อง${slotLabels[slot]||slot}`);
   }
  }

  // 2. Path & Subpath identity awareness
  if(a.subPath&&a.subPath===j.subPath){
   score+=26;isSubPathMatch=true;
   reasonsTh.push(`ตรงสายย่อย ${j.subPathNameTh||j.subPath}`);
  }else if(a.path===j.path){
   score+=12;
   reasonsTh.push('ตรงวิถีหลัก');
  }else{
   score+=2;
  }

  // 3. Combo synergy awareness (setup <-> consume)
  const markNames={OPEN:'เปิดช่องป้องกัน',BOUND:'ตรึงชีพจร',RESONANCE:'ประสานเคล็ด'};
  if(m.consume&&st.unpairedSetups.includes(m.consume)){
   score+=25;isComboCompleter=true;
   reasonsTh.push(`ต่อเคล็ดปิดฉากคู่กับ «${markNames[m.consume]||m.consume}» ที่ยังขาดคู่`);
  }else if(m.setup&&st.unpairedConsumes.includes(m.setup)){
   score+=23;isComboCompleter=true;
   reasonsTh.push(`วางรอยเปิด «${markNames[m.setup]||m.setup}» ให้วิชาปิดฉากที่มีอยู่`);
  }else if(m.consume&&st.activeSetups.includes(m.consume)){
   score+=14;isComboCompleter=true;
   reasonsTh.push(`ประสานคอมโบ «${markNames[m.consume]||m.consume}»`);
  }else if(m.setup&&st.activeConsumes.includes(m.setup)){
   score+=14;isComboCompleter=true;
   reasonsTh.push(`เสริมรอยเปิดคอมโบ «${markNames[m.setup]||m.setup}»`);
  }
  if(st.style==='combo'&&(m.setup||m.consume))score+=8;

  // 4. 68-axis personality & lifespan safety awareness
  const person=n.personality||{};
  const caution=person.caution??50,courage=person.courage??50,aggression=person.aggression??50,ambition=person.ambition??50;
  if(m.role==='defense'||m.role==='recovery'){
   score+=(caution-45)*.18+(st.style==='guardian'||st.style==='healer'?7:0);
  }else if(m.role==='attack'){
   score+=(courage+aggression-90)*.12+(st.style==='burst'||st.style==='duelist'?6:0);
  }else if(m.role==='control'){
   score+=(H.effective(n,'cognition','metacognition')-45)*.16+(st.style==='controller'?7:0);
  }else if(m.role==='forbidden'){
   const remLife=(j.lifespanMax||100)-(n.age||20);
   if(remLife<16||(courage+ambition*.4-caution*.5<24)){
    score-=35;
    reasonsTh.push('ระแวงผลสะท้อนอายุขัยของวิชาต้องห้าม');
   }else{
    score+=10;
    reasonsTh.push('กล้าแลกพลังต้องห้ามยามคับขัน');
   }
  }
  return {eligible:true,score:Math.round(score*10)/10,slot,reasonsTh,fillsOpenSlot,isSubPathMatch,isComboCompleter,setup:m.setup||null,consume:m.consume||null};
 }
 inspectKnownWorldArts(n){
  const g=this.g,j=n?.jianghu||{};
  const st=this.inspectSlotAndComboState(n);
  const seen=new Map();
  const pushLead=(art,sourceKind,sourceLabelTh,targetId=null)=>{
   if(!art||art.innateRoute||seen.has(art.id))return;
   const k=j.knowledgeV190?.[art.id];
   if(k?.stage>=4)return; // Already learned
   if(g.discovery&&!g.discovery.canStudy(n,art))return;
   const suit=this.scoreArtSuitability(n,art);
   if(!suit.eligible||suit.score<15)return;
   seen.set(art.id,{
    artId:art.id,
    nameTh:art.nameTh,
    tier:art.tier||1,
    slot:suit.slot,
    score:suit.score,
    sourceKind,
    sourceLabelTh,
    targetId,
    fillsOpenSlot:suit.fillsOpenSlot,
    isSubPathMatch:suit.isSubPathMatch,
    isComboCompleter:suit.isComboCompleter,
    reasonsTh:suit.reasonsTh
   });
  };
  // 1. Personal scrolls in bag
  for(const b of (j.ledgerV140?.scrolls||[])){
   if(b.artId&&b.count!==0)pushLead(this.artMap.get(b.artId),'PERSONAL_SCROLL','คัมภีร์ในสัมภาระของตน',b.artId);
  }
  // 2. Sect Scripture Library
  for(const b of (g.s.growth?.scriptureLibrary||[])){
   if(b.artId)pushLead(this.artMap.get(b.artId),'SECT_LIBRARY','หอคัมภีร์สืบทอดของสำนัก',b.artId);
  }
  // 3. Sect Peers & Mentors (arts actually practiced by living sect members)
  for(const peer of (g.heroes||[])){
   if(!peer?.alive||peer.id===n.id)continue;
   for(const [artId,pk] of Object.entries(peer.jianghu?.knowledgeV190||{})){
    if(pk?.stage>=4&&(pk.mastery||0)>=20&&(!g.discovery||g.discovery.mayCopy(peer,artId))){
     pushLead(this.artMap.get(artId),'SECT_MENTOR',`วิชาที่ ${peer.name} เชี่ยวชาญ`,peer.id);
    }
   }
  }
  // 4. Heard Rumors & Known Sect/Realm Leads (strictly bounded by what the NPC/sect has heard or visited)
  const myRumors=(g.s.discovery?.rumors||[]).filter(r=>r.npcId===n.id&&['HEARD','TRACED'].includes(r.status));
  const visitedSites=(g.s.realm?.sites||[]).filter(s=>s.visitedBy?.includes(n.id));
  const discEnvs=Object.keys(g.s.myriadWorlds?.discoveredEnvironments||{});
  if(myRumors.length||visitedSites.length||discEnvs.length||(n.stageLocal?.known?.length||0)>=4){
   const matchingWorldArts=this.arts.filter(a=>!a.innateRoute&&a.subPath===j.subPath&&this.canStudyArtTier(n,a)&&!(j.knowledgeV190?.[a.id]?.stage>=4)).slice(0,4);
   for(const a of matchingWorldArts){
    if(myRumors.length)pushLead(a,'RUMOR_SPOT',`เบาะแสข่าวลือ (${myRumors[0].name})`,myRumors[0].id);
    else if(visitedSites.length)pushLead(a,'SECRET_REALM','ร่องรอยมรดกในแดนลับที่เคยไปเยือน',visitedSites[0].id);
    else if(discEnvs.length)pushLead(a,'MYRIAD_WORLDS','เบาะแสคัมภีร์โบราณในแดนหมื่นภพ',discEnvs[0]);
   }
  }
  const knownArts=[...seen.values()].sort((a,b)=>b.score-a.score||a.artId.localeCompare(b.artId));
  return {slotState:st,knownArts,topGoal:knownArts[0]||null};
 }
 refresh(n,force=false){
  const p=n.stageLocal,q=p.growth;if(!q)return;if(!force&&q.nextPlan>this.g.s.t)return;q.nextPlan=this.g.s.t+10;const g=this.g,j=n.jianghu,ledger=j.ledgerV140,career=q.career;
  if(!q.deducedPairs)q.deducedPairs={};
  if(!Array.isArray(q.archivedResearchNotes))q.archivedResearchNotes=[];
  // Persistent career recipe selection (does not get wiped when injured!)
  const careerDesired=this.allRecipes().filter(r=>(RECIPES.some(base=>base.id===r.id)||q.knownRecipes.includes(r.id))&&r.workshop===career&&r.tier<=this.tier(n)&&H.capacity(n,r.workshop==='alchemy'?'alchemy':'forging').total>=r.min);
  let careerRecipe=q.careerPlan?.targetId?this.recipe(q.careerPlan.targetId):null;
  if(careerRecipe){
   const alreadyMade=careerRecipe.effect?.slot?ledger.equipmentItems.some(i=>i.recipeId===careerRecipe.id):ledger.pillStacks.some(i=>i.recipeId===careerRecipe.id&&i.count>0);
   if(alreadyMade||careerRecipe.tier>this.tier(n))careerRecipe=null;
  }
  if(!careerRecipe){
   careerRecipe=careerDesired.filter(r=>r.effect.slot&&!ledger.equipmentItems.some(i=>i.recipeId===r.id)).sort((a,b)=>b.tier-a.tier)[0]
    ||careerDesired.find(r=>!r.effect.slot&&!ledger.pillStacks.some(i=>i.recipeId===r.id&&i.count>0));
  }
  if(careerRecipe){
   q.careerPlan={kind:'craft',targetId:careerRecipe.id,label:'หลอมสร้าง '+careerRecipe.name,steps:['ศึกษาตำรับ','รวบรวมตัวยาและแร่','จุดเตาหลอมสร้าง','นำผลงานมาเสริมตบะ']};
  }else{
   q.careerPlan=null;
  }
  // Emergency heal recipe only when injured AND NPC has no usable healing pill in bag AND has at least 1 herb or known alchemy recipe
  const hasHealPill=ledger.pillStacks.some(s=>s.count>0&&this.normalizePill(s).healHealth>0);
  const healRecipes=this.allRecipes().filter(r=>(RECIPES.some(base=>base.id===r.id)||q.knownRecipes.includes(r.id))&&r.workshop==='alchemy'&&r.effect?.heal&&r.tier<=this.tier(n)&&H.capacity(n,'alchemy').total>=r.min);
  const emergencyHealRecipe=(n.health<75&&!hasHealPill)?healRecipes.find(r=>q.knownRecipes.includes(r.id)||(career==='alchemy'))||null:null;
  const r=emergencyHealRecipe||careerRecipe;

  const st=this.inspectSlotAndComboState(n);
  const eligiblePersonalScrolls=ledger.scrolls.filter(s=>{const a=this.artMap.get(s.artId);return !!a&&(!g.discovery||g.discovery.canStudy(n,a))&&this.compatible(n,a)&&this.canStudyArtTier(n,a)&&(j.knowledgeV190[s.artId]?.stage||0)<4;})
   .sort((a,b)=>this.scoreArtSuitability(n,this.artMap.get(b.artId)).score-this.scoreArtSuitability(n,this.artMap.get(a.artId)).score);
  const scroll=eligiblePersonalScrolls[0]||null;
  const eligibleLibraryScrolls=(g.s.growth.scriptureLibrary||[]).filter(s=>{const a=this.artMap.get(s.artId);return !!a&&(!g.discovery||g.discovery.canStudy(n,a))&&this.compatible(n,a)&&this.canStudyArtTier(n,a)&&(j.knowledgeV190[s.artId]?.stage||0)<4;})
   .sort((a,b)=>this.scoreArtSuitability(n,this.artMap.get(b.artId)).score-this.scoreArtSuitability(n,this.artMap.get(a.artId)).score);
  const libraryScroll=eligibleLibraryScrolls[0]||null;
  const equippedSet=new Set(st.equippedIds);
  const practice=Object.keys(j.knowledgeV190).map(id=>this.artMap.get(id)).filter(a=>a&&this.compatible(n,a)&&j.knowledgeV190[a.id].stage>=4&&j.knowledgeV190[a.id].mastery<65)
   .sort((a,b)=>{
    const aEq=equippedSet.has(a.id)?1:0,bEq=equippedSet.has(b.id)?1:0;
    if(aEq!==bEq)return bEq-aEq;
    return j.knowledgeV190[a.id].mastery-j.knowledgeV190[b.id].mastery;
   })[0];
  const worldAwareness=this.inspectKnownWorldArts(n);
  q.seekingArtGoal=worldAwareness.topGoal||null;
  q.needs=[];if(n.health<75)q.needs.push({kind:'health',text:'ต้องการฟื้นฟูบาดแผลและลมปราณ',urgency:100-n.health});
  if(st.openAttackSlots>0){
   q.needs.push({kind:'openAttackSlot',text:`ช่องวิชาโจมตียังว่าง ${st.openAttackSlots}/${st.attackCapacity} ช่อง · กำลังมองหาวิชาสาย ${j.subPathNameTh||j.subPath}`,urgency:58});
  }
  if(st.unpairedSetups.length){
   q.needs.push({kind:'comboSynergy',text:`มีวิชาเปิดช่องโหว่ (${st.unpairedSetups.join(', ')}) · มองหาวิชาต่อเคล็ดปิดฉาก`,urgency:56});
  }
  if(q.seekingArtGoal){
   q.needs.push({kind:'seekingArt',text:`ตามหาวิชา «${q.seekingArtGoal.nameTh}» (${q.seekingArtGoal.sourceLabelTh}) · ${q.seekingArtGoal.reasonsTh.slice(0,2).join(' · ')}`,artId:q.seekingArtGoal.artId,urgency:Math.min(72,Math.round(q.seekingArtGoal.score))});
  }
  if(r){const missing=r.inputs.filter(i=>g.count(n,i.matId)<i.count).map(i=>({...i,missing:i.count-g.count(n,i.matId)}));q.needs.push({kind:'recipe',text:(q.knownRecipes.includes(r.id)?'เตรียมหลอมสร้าง ':'ต้องศึกษาตำรับ ')+r.name,recipeId:r.id,missing,urgency:60});}
  if(careerRecipe&&careerRecipe.id!==r?.id){
   const cMissing=careerRecipe.inputs.filter(i=>g.count(n,i.matId)<i.count).map(i=>({...i,missing:i.count-g.count(n,i.matId)}));
   q.needs.push({kind:'careerRecipe',text:'เป้าหมายงานช่างหลัก: '+careerRecipe.name,recipeId:careerRecipe.id,missing:cMissing,urgency:52});
  }
  if(scroll)q.needs.push({kind:'scripture',text:`มีคัมภีร์ส่วนตัว «${this.artMap.get(scroll.artId)?.nameTh||scroll.artId}» ที่เหมาะกับชุดวิชา`,artId:scroll.artId,urgency:62});
  if(libraryScroll)q.needs.push({kind:'libraryScripture',text:`มีคัมภีร์ในหอสืบทอด «${this.artMap.get(libraryScroll.artId)?.nameTh||libraryScroll.artId}» ที่เข้ากับวิถีและคอมโบ`,artId:libraryScroll.artId,urgency:56});
  const wantsArt=scroll&&((scroll.sourceType==='DISCOVERY')||H.liking(n,'train')>=H.liking(n,career==='alchemy'?'alchemy':'forging')-5||!r);
  const wantsLibraryArt=libraryScroll&&(H.liking(n,'train')>=H.liking(n,career==='alchemy'?'alchemy':'forging')-5||!r);
  q.plan=wantsArt?{kind:'read',targetId:scroll.artId,label:'ขบคิดคัมภีร์ '+this.artMap.get(scroll.artId).nameTh,steps:['ครอบครองคัมภีร์ส่วนตัว','อ่านตีความเคล็ดวิชา','เคี่ยวกรำกระบวนท่า','ผสานเข้ากับมรรคาตน']}:wantsLibraryArt?{kind:'libraryRead',targetId:libraryScroll.artId,label:'ศึกษาคัมภีร์ส่วนรวม '+this.artMap.get(libraryScroll.artId).nameTh,steps:['เลือกคัมภีร์ที่เข้ากับวิถี','ศึกษาในหอสืบทอด','ทำความเข้าใจแก่นวิชา','นำไปฝึกฝนใช้งานจริง']}:r?{kind:'craft',targetId:r.id,label:'หลอมสร้าง '+r.name,steps:['ศึกษาตำรับ','รวบรวมตัวยาและแร่','จุดเตาหลอมสร้าง','นำผลงานมาเสริมตบะ']}:practice?{kind:'practice',targetId:practice.id,label:'เคี่ยวกรำ '+practice.nameTh,steps:['เข้าใจรากฐานวิชาแล้ว','ฝึกซ้ำจนเกิดความชำนาญ','สำแดงอานุภาพในการศึก']}:{kind:'cultivate',label:'สะสมตบะและหลักฐานเต๋าเพื่อทะลวงขอบเขต',steps:['เดินลมปราณและเข้าฌาน','สั่งสมหลักฐานความเข้าใจมรรคา','ประเมินด่านคอขวดเพื่อทะลวงขั้น']};
 }
 reserve(n,id){
  const q=n.stageLocal?.growth;if(!q)return 0;
  const rActive=this.recipe(q.plan?.targetId);
  const rCareer=this.recipe(q.careerPlan?.targetId);
  const c1=rActive?.inputs.find(i=>i.matId===id)?.count||0;
  const c2=rCareer?.inputs.find(i=>i.matId===id)?.count||0;
  return Math.max(c1,c2);
 }
 bias(n,id){const q=n.stageLocal.growth;if(!q)return 0;const goal=q.plan?.kind||q.careerPlan?.kind;return (goal==='craft'&&['herb','mine','hunt'].includes(id)?5:goal==='cultivate'&&['train','comprehendTablet','meditateWaterfall'].includes(id)?7:goal==='read'&&id==='seekFortune'?3:0);}
 location(id){const z=this.g.s.nodes.find(z=>z.id===id);const locations={grove:{x:2430,y:2200},mine:{x:2720,y:1450}};return z?{id:z.id,...(locations[id]||z)}:null;}
 findDeductionPair(n){
  const j=n.jianghu,l=j.ledgerV140,q=n.stageLocal?.growth;
  const spares=l.scrolls.filter(book=>book.artId&&!book.loan&&book.rights!=='LOAN'&&(!book.ownerNpcId||book.ownerNpcId===n.id)&&(j.knowledgeV190?.[book.artId]?.stage||0)>=4&&this.artMap.get(book.artId)?.path===j.path&&(book.tier||1)<7);
  if(spares.length<2)return null;
  for(let i=0;i<spares.length;i++){
   for(let k=i+1;k<spares.length;k++){
    const sA=spares[i],sB=spares[k];
    if(sA.artId===sB.artId&&spares.some(x=>x.artId!==sA.artId))continue;
    const pairKey=[sA.id,sB.id].sort().join('|');
    if((q?.deducedPairs?.[pairKey]||0)>this.g.s.t)continue;
    const preview=root.JianghuExpansionV112?.synthesizeManual?.(n,sA.artId,sB.artId,this.g.rng,{previewOnly:true});
    if(preview?.manual&&!l.scrolls.some(x=>x.artId===preview.manual.id)&&!j.knowledgeV190?.[preview.manual.id]){
     return {sA,sB,pairKey,preview};
    }
   }
  }
  return null;
 }
 options(n,add){
  const g=this.g,p=n.stageLocal,q=p.growth,j=n.jianghu;if(!q||p.offmap||p.journey||g.nearestEnemy(n,450)||n.health<1||p.needs.hunger>75||n.core.condition.fatigue>75)return;this.refresh(n);const hall=g.built('hall'),school=g.built('shrine')||g.built('training')||hall;if(!hall)return;const target=g.endpoint(hall),plan=q.plan;
  const push=(id,score,at,seconds,t,extraReason='')=>add(id,score+(g.s.policy==='craft'?18:0),at,seconds,{},{growthActivity:id==='gatherIngredient'?(g.s.nodes.find(z=>z.id===t)?.kind==='ORE'?'mine':'herb'):id==='makePersonalItem'?(this.recipe(t)?.workshop==='alchemy'?'alchemy':'forging'):id,growthTarget:t,reason:extraReason||('แผนชีวิต: '+plan.label+' · '+LABELS[id])});
  const activeCraftRecipe=plan.kind==='craft'?this.recipe(plan.targetId):(q.careerPlan?.targetId?this.recipe(q.careerPlan.targetId):null);
  if(activeCraftRecipe){
   const r=activeCraftRecipe,b=g.built(r.workshop);
   if(!q.knownRecipes.includes(r.id)){if(E.getSpiritStonesV140(n)>=6||g.s.growth.researchFund>=6)push('researchRecipe',50,school?g.endpoint(school):target,18+r.tier*4,r.id);}
   else{
    let missing=r.inputs.filter(i=>g.count(n,i.matId)<i.count);
    if(missing.length){
     const stocked=missing.find(i=>g.count(g.bank,i.matId)>0&&(p.cooldowns['sectWithdraw:MATERIAL:'+i.matId]||0)<=g.s.t);if(stocked)push('takeIngredient',58,target,4,stocked.matId);
     const mat=missing.find(i=>g.s.nodes.some(z=>z.mat===i.matId&&z.qty>=1));
     if(mat){const z=g.s.nodes.find(z=>z.mat===mat.matId&&z.qty>=1),at=this.location(z.id);if(!g.realm.threatAt(at,400,n))push('gatherIngredient',52,at,12,z.id);}
     const beastMat=missing.find(i=>String(i.matId).startsWith('MAT_BP_')&&g.count(g.bank,i.matId)<=0);
     if(beastMat&&n.health>=70){
      const speciesCatalog=E.PATCH140_DATA?.BEAST_SPECIES_V140||[];
      const matchingSpeciesIds=new Set(speciesCatalog.filter(sp=>(sp.partDrops||[]).some(d=>d.matId===beastMat.matId)).map(sp=>sp.id));
      const targetBeast=g.s.beasts.filter(b=>b.alive&&(g.isHostileCreature?g.isHostileCreature(b):!b.sanctuaryResident)&&matchingSpeciesIds.has(b.speciesId)&&g.power(n)>g.power(b)*(.60+(n.personality.caution||50)*.004)).sort((a,b)=>dist(p,a)-dist(p,b))[0];
      if(targetBeast){
       add('hunt',54+(g.s.policy==='craft'?12:0),targetBeast,10,{courage:.45,discipline:.25,caution:-.2},{risk:40+targetBeast.tier*8,handler:'HUNT',growthTarget:targetBeast.id,huntForMatId:beastMat.matId,reason:'แผนหลอมสร้าง '+r.name+' · ล่า '+targetBeast.name+' เพื่อหาชิ้นส่วนตามตำรับ'});
      }
     }
    }else if(b)push('makePersonalItem',52,g.endpoint(b),r.duration/(root.JianghuInfrastructure?.bonuses(g).perWorkshop?.[r.workshop]?.craftSpeed||1),r.id);
   }
  }
  const l=n.jianghu.ledgerV140;
  const pill=g.chooseUsefulPill?g.chooseUsefulPill(n):l.pillStacks.find(x=>x.count>0&&x.livingEffect&&((x.livingEffect.heal&&n.health<78)||(x.livingEffect.cleanse&&n.jianghu.pillToxicity>5)||(x.livingEffect.progress&&n.jianghu.cultivationProgress<92&&n.jianghu.pillToxicity<18)||(x.livingEffect.grief&&n.core.human.state.grief>8)));
  if(pill)push('usePersonalPill',n.health<78?90:49,target,5,pill.id);
  if(plan.kind==='read')push('readScripture',52,g.endpoint(school),16,plan.targetId);
  const shrine=g.built('shrine'),library=g.s.growth.scriptureLibrary||[];
  if(plan.kind==='libraryRead'&&shrine&&(!root.JianghuSectLibrary||root.JianghuSectLibrary.quote(g,n,plan.targetId).canAfford))push('readLibraryScripture',54,g.endpoint(shrine),16,plan.targetId);
  if(shrine&&library.length<(root.JianghuSectLibrary?.capacity(g)||120)){
   const donate=l.scrolls.find(book=>book.artId&&book.sourceType==='DISCOVERY'&&!book.loan&&book.rights!=='LOAN'&&!library.some(shared=>shared.artId===book.artId));
   if(donate){
    const art=this.artMap.get(donate.artId),known=j.knowledgeV190?.[donate.artId];
    if(art&&(!g.discovery||g.discovery.mayShare(n,donate))&&(!this.compatible(n,art)||!this.canStudyArtTier(n,art)||(known?.stage||0)>=4))
     push('donateScripture',36+(n.core.values.sectDuty-50)*.1+(n.core.values.knowledgeCraft-50)*.12+(H.liking(n,'donateScripture')-50)*.08,g.endpoint(shrine),10,donate.artId);
   }
   // v1.12 Action: copyScripture (transcribe a mastered art into the shared library if not yet archived)
   const copyableId=Object.keys(j.knowledgeV190||{}).find(artId=>{
    const k=j.knowledgeV190[artId];
    return k&&k.stage>=4&&(k.mastery||0)>=18&&(!g.discovery||g.discovery.mayCopy(n,artId))&&!library.some(shared=>shared.artId===artId);
   });
   if(copyableId&&E.getSpiritStonesV140(n)>=4){
    const copyArt=this.artMap.get(copyableId);
    if(copyArt)push('copyScripture',34+(n.core.values.knowledgeCraft-50)*.12+(n.core.values.sectDuty-50)*.1,g.endpoint(shrine),12,copyableId,'คัดลอกเคล็ดวิชา '+copyArt.nameTh+' เก็บไว้ในหอสืบทอด');
   }
  }
  // v1.16 Non-destructive comparative scripture deduction: only offer when a valid target manual exists and bag has room
  if(l.scrolls.length<24&&(E.getSpiritStonesV140(n)>=8||g.s.growth.researchFund>=8)&&school){
   const pair=this.findDeductionPair(n);
   if(pair){
    push('synthesizeScriptures',39+(n.core.values.knowledgeCraft-50)*.14+(H.liking(n,'researchRecipe')-50)*.1,g.endpoint(school),15,pair.sA.id+'|'+pair.sB.id,'เทียบเคล็ดคัมภีร์ 2 ม้วนเพื่ออนุมานวิชาระดับสูงขึ้น (คัมภีร์ต้นฉบับไม่สูญหาย)');
   }
  }
  if(plan.kind==='practice')push('practiceScripture',42,g.endpoint(school),16,plan.targetId);

  // Contextual Autonomous Actions:
  const tabletSpot=shrine?g.endpoint(shrine):{id:'scout',x:3070,y:900};
  if(n.core.condition.fatigue<55&&!g.realm.threatAt(tabletSpot,350,n)){
   const focusArtId=[...(j.attackArtIds||[]),j.techniqueId,j.mantraId,j.lightnessId,j.auxiliaryId].filter(id=>id&&j.knowledgeV190?.[id]).sort((a,b)=>(j.knowledgeV190[a]?.mastery||0)-(j.knowledgeV190[b]?.mastery||0))[0]||j.techniqueId||j.mantraId;
   const focusScore=35+(g.s.policy==='cultivate'?14:0)+(j.path==='HEART_SOUL'||j.subPath==='SWORD_IMMORTAL'?8:0);
   add('comprehendTablet',focusScore,tabletSpot,14,{curiosity:.3,discipline:.25},{growthActivity:'comprehendTablet',growthTarget:focusArtId,reason:'เพ่งจิตศึกษารอยจารึกโบราณ · สะสมหลักฐานเต๋าและโอกาสหยั่งรู้วิชา'});
  }
  const riverSpot={id:'river',x:2240,y:2580};
  if((n.core.condition.fatigue>25||n.core.human.state.grief>8||(j.heartDemon||0)>5||plan.kind==='cultivate')&&!g.realm.threatAt(riverSpot,380,n)){
   const wfScore=34+(n.core.condition.fatigue*.18)+((j.heartDemon||0)*.35)+(j.path==='BODY'||j.subPath==='FROST_MOON_IMMORTAL'?7:0);
   add('meditateWaterfall',wfScore,riverSpot,14,{composure:.35,discipline:.25},{growthActivity:'meditateWaterfall',reason:'เข้าฌานใต้น้ำตกธาราหยก · ชำระจิตมาร คลายความล้า และหล่อหลอมตบะ'});
  }
  const hasTeaLeaf=g.count(n,CINDER)>0||g.count(g.bank,CINDER)>0||g.count(n,HERB)>0;
  if(hasTeaLeaf&&((j.pillToxicity||0)>3||n.core.human.state.grief>5||p.needs.social>38)){
   const teaSpot=shrine?g.endpoint(shrine):target;
   const teaScore=36+((j.pillToxicity||0)*.6)+(n.core.human.state.grief*.35)+(j.path==='HEART_SOUL'?9:0);
   add('brewTeaDao',teaScore,teaSpot,10,{composure:.3,empathy:.25},{growthActivity:'brewTeaDao',reason:'ชงชาวิญญาณชำระพิษโอสถ ประคองอารมณ์ และสนทนาธรรม'});
  }
  if(n.health>=75&&(g.s.policy==='defend'||n.core.values.sectDuty>=64||g.s.villageHP<920)){
   const patrolSpot={id:'village',x:1100,y:2180};
   const patrolScore=33+(g.s.policy==='defend'?18:0)+Math.max(0,(1000-g.s.villageHP)*.025);
   add('patrolSect',patrolScore,patrolSpot,11,{courage:.3,integrity:.3},{growthActivity:'patrolSect',reason:'ลาดตระเวนคุ้มครองหมู่บ้านและแนวป้องกันสำนัก'});
  }
 }
 workActivity(n,action){const sectActivity=root.JianghuSideQuests?.workActivity(action)||root.JianghuSectContributions?.workActivity(action);if(sectActivity)return sectActivity;if(action?.startsWith('herb:')||action?.startsWith('garden'))return 'herb';if(action?.startsWith('mine:'))return 'mine';if(action==='gatherIngredient')return this.g.s.nodes.find(z=>z.id===n.stageLocal.growth?.ticket?.target)?.kind==='ORE'?'mine':'herb';return action==='makePersonalItem'?(this.recipe(n.stageLocal.growth?.ticket?.target)?.workshop==='alchemy'?'alchemy':'forging'):action;}
 start(n,action){if(!LABELS[action])return;const q=n.stageLocal.growth;if(q)q.ticket={id:this.id('work'),action,target:n.stageLocal.growthTarget,done:false};}
 cancelTicket(n){const q=n?.stageLocal?.growth;if(q?.ticket)q.ticket=null;}
 finish(n,action){
  if(!LABELS[action])return null;
  const g=this.g,p=n.stageLocal,q=p.growth,w=q?.ticket,fail={handled:true,success:false};
  if(!w||w.done||w.action!==action||p.mode!=='working'||p.job>0||!p.target||dist(p,p.target)>140)return fail;
  w.done=true;const id=w.target;
  if(action==='researchRecipe'){
   const r=this.recipe(id),b=g.built('shrine')||g.built('training')||g.built('hall');
   if(!r||this.g.s.growth.formulaRegistry.some(f=>f.id===id)||!b||dist(p,g.endpoint(b))>140||q.knownRecipes.includes(id)||this.tier(n)<r.tier)return fail;
   const activity=r.workshop==='alchemy'?'alchemy':'forging';if(H.capacity(n,activity).total<r.min)return fail;
   if(E.getSpiritStonesV140(n)>=6)E.addSpiritStonesV140(n,-6);else if(g.s.growth.researchFund>=6)g.s.growth.researchFund-=6;else return fail;
   q.hasResearchExperience=true;q.knownRecipes.push(id);H.learn(n,'researchRecipe',2);this.receipt('recipe',n,{recipeId:id,stones:6});
  }
  if(action==='takeIngredient'){
   const r=this.recipe(q.plan?.targetId)||this.recipe(q.careerPlan?.targetId),input=r?.inputs.find(i=>i.matId===id);
   if(!input||dist(p,g.endpoint(g.built('hall')))>140)return fail;
   const amount=Math.min(input.count-g.count(n,id),g.count(g.bank,id),H.carryLimit(n)-H.load(n));
   if(amount<=0)return fail;
   const acquired=g.s.storyEvents?.active&&root.JianghuSectContributions?root.JianghuSectContributions.acquire(g,n,'MATERIAL',id,'REDEEM',null,amount):null;const moved=acquired?(acquired.ok?acquired.count:0):g.realm.transferMaterial(g.bank,n,id,amount,'PERSONAL_RECIPE_INPUT');
   if(moved<=0)return fail;
   this.receipt('material',n,{matId:id,amount:moved});
  }
  if(action==='gatherIngredient'){
   const z=g.s.nodes.find(z=>z.id===id),at=this.location(id);if(!z||dist(p,at)>140||z.qty<1)return fail;
   const amount=Math.min(Math.floor(z.qty),H.harvestLimit(n,z.kind==='ORE'?'mine':'herb'),Math.max(0,this.reserve(n,z.mat)-g.count(n,z.mat)));
   if(amount<=0||!g.add(n,z.mat,amount,'TARGETED_GATHER').ok)return fail;z.qty-=amount;this.receipt('gather',n,{matId:z.mat,amount});
  }
  if(action==='makePersonalItem'){
   const r=this.recipe(id),b=r&&g.built(r.workshop),activity=r?.workshop==='alchemy'?'alchemy':'forging';
   if(!r||!b||dist(p,g.endpoint(b))>140||!q.knownRecipes.includes(id)||this.tier(n)<r.tier||H.capacity(n,activity).total<r.min||r.inputs.some(i=>g.count(n,i.matId)<i.count)||E.getSpiritStonesV140(n)<2)return fail;
   const ledger=n.jianghu.ledgerV140,items=r.effect.slot?ledger.equipmentItems:r.effect.beastItem?ledger.beastItems:ledger.pillStacks;if(items.length>=16)return fail;
   const usesGrant=r.inputs.some(i=>{let left=i.count,grant=false;for(const stack of ledger.materialStacks.filter(x=>x.matId===i.matId&&g.ownsMaterial(n,x))){const take=Math.min(left,stack.count);if(take>0&&stack.contributionCreditAllowed===false)grant=true;left-=take;if(left<=0)break;}return grant;});
   for(const i of r.inputs)g.consume(n,i.matId,i.count);E.addSpiritStonesV140(n,-2);
   const craftBonus=this.equippedCraftBonus(n,r.discipline||r.craftPath||r.workshop)+(root.JianghuInfrastructure?.bonuses(g).perWorkshop?.[r.workshop]?.craftSkillBonus||0),effCap=H.capacity(n,activity).total+craftBonus;
   const chance=clamp(.48+effCap*.006-r.tier*.06,.35,.92),roll=g.rng.next();
   q.hasResearchExperience=true;H.learn(n,activity,3);this.receipt('production',n,{recipeId:id,chance,roll,success:roll<chance,inputs:copy(r.inputs),stones:2});
   if(roll>=chance){g.remember(n,action,-4,'หลอมสร้าง '+r.name+' ล้มเหลว สูญเสียวัตถุดิบจริง');q.nextPlan=0;return {handled:true,success:false,cooldown:45};}
   const item={id:this.id('crafted'),recipeId:id,catalogId:id,nameTh:r.name,tier:r.tier,minStageReq:Number.isFinite(r.minStageReq??r.effect.minStageReq)?(r.minStageReq??r.effect.minStageReq):Math.max(1,(r.tier||1)-1),isTranscendent:!!r.isTranscendent,quality:effCap>=60?'REFINED':'COMMON',makerNameTh:n.name,originLabelTh:'ผลงานที่หลอมสร้างเองในสำนัก'};
   if(r.effect.slot){Object.assign(item,{...copy(r.effect),slot:r.effect.slot,compatiblePath:r.compatiblePath||'ANY',durability:100,maxDurability:100,combatMult:r.effect.combat??r.effect.combatMult??0,defenseMult:r.effect.defense??r.effect.defenseMult??0,studyBonus:r.effect.study??r.effect.studyBonus??0,dissectionBonus:r.effect.dissectionBonus||0});root.JianghuExpansionV112?.imbueEquipmentDepth?.(item,g.rng);}else if(r.effect.beastItem){Object.assign(item,{count:1,effect:copy(r.effect)});}
   else{
    const normEff=normalizePillEffect(r.effect);
    Object.assign(item,{count:1,livingEffect:copy(r.effect),effect:normEff});
   }
   if(usesGrant){item.contributionCreditAllowed=false;item.sectGrant={sectId:'TH',derivedFromWelfare:true};}
   items.push(item);E.syncLegacyArraysFromLedgerV140(n);g.life.credit(n,2,'ลงมือผลิตด้วยตนเอง');g.s.stats.crafted++;this.equip(n);
  }
  if(action==='donateScripture'){
   const j=n.jianghu,shrine=g.built('shrine'),library=g.s.growth.scriptureLibrary||(g.s.growth.scriptureLibrary=[]),ledger=j.ledgerV140;
   const index=ledger.scrolls.findIndex(book=>book.artId===id&&book.sourceType==='DISCOVERY'&&!book.loan&&book.rights!=='LOAN');
   const book=index>=0?ledger.scrolls[index]:null;
   if(!shrine||dist(p,g.endpoint(shrine))>140||!book||(g.discovery&&!g.discovery.mayShare(n,book))||library.length>=(root.JianghuSectLibrary?.capacity(g)||120)||library.some(shared=>shared.artId===id))return fail;
   const shared={...book,originalItemId:book.originalItemId||book.id,canRedistribute:true,access:'SECT',id:this.id('library-scroll'),libraryId:this.id('library-entry'),ownerNpcId:null,originalOwnerNpcId:book.ownerNpcId||n.id,donatedByNpcId:n.id,donatedAt:g.s.t,rights:'SECT_LIBRARY',sourceType:'SECT_LIBRARY',count:1};
   ledger.scrolls.splice(index,1);library.push(shared);root.JianghuSectContributions?.creditLibraryDonation(g,n,shared);g.discovery?.onTransfer(shared,n,null,'LIBRARY');E.syncLegacyArraysFromLedgerV140?.(n);
   g.s.growth.libraryReceipts.unshift({t:g.s.t,kind:'donation',npcId:n.id,artId:id,libraryId:shared.libraryId,originLabelTh:book.originLabelTh||'ไม่ทราบที่มา'});
   g.s.growth.libraryReceipts.splice(120);H.learn(n,'donateScripture',2);
   g.remember(n,'donateScripture',5,'นำคัมภีร์ '+(book.nameTh||this.artMap.get(id)?.nameTh||id)+' เข้าหอสืบทอด');
   g.life?.credit(n,2,'นำคัมภีร์เข้าหอสืบทอด');
   const journeys=g.s.realm?.journeys||[];
   for(let i=journeys.length-1;i>=0;i--){const journey=journeys[i];if(journey.npcId===n.id&&journey.scroll?.itemId===book.id){journey.scroll.status='LIBRARY';journey.scroll.libraryId=shared.libraryId;break;}}
   this.receipt('scriptureDonated',n,{artId:id,libraryId:shared.libraryId,originLabelTh:book.originLabelTh||'ไม่ทราบที่มา'});
   if(g.s.realm?.receipts){g.s.realm.receipts.unshift({id:'library-donation-'+shared.libraryId,t:g.s.t,kind:'scriptureDonated',npcId:n.id,artId:id,libraryId:shared.libraryId,originLabelTh:book.originLabelTh||'ไม่ทราบที่มา',scroll:{nameTh:book.nameTh||this.artMap.get(id)?.nameTh||id}});g.s.realm.receipts.splice(120);}
   g.note(n.name+' นำคัมภีร์ «'+(book.nameTh||this.artMap.get(id)?.nameTh||id)+'» ขึ้นประดิษฐาน ณ หอสืบทอด · ศิษย์ร่วมสำนักสามารถศึกษาต่อได้',n);
   q.nextPlan=0;return {handled:true,success:true,cooldown:24};
  }
  if(action==='copyScripture'){
   const j=n.jianghu,shrine=g.built('shrine'),library=g.s.growth.scriptureLibrary||(g.s.growth.scriptureLibrary=[]),art=this.artMap.get(id),k=j.knowledgeV190?.[id];
   if(!shrine||dist(p,g.endpoint(shrine))>140||!art||(g.discovery&&!g.discovery.mayCopy(n,id))||!k||k.stage<4||(k.mastery||0)<18||library.length>=(root.JianghuSectLibrary?.capacity(g)||120)||library.some(s=>s.artId===id)||E.getSpiritStonesV140(n)<4)return fail;
   E.addSpiritStonesV140(n,-4);
   const grade=root.JianghuExpansionV112?.rarityGradesV112?.[art.tier||1];
   const shared={canRedistribute:true,access:'SECT',id:this.id('library-scroll'),libraryId:this.id('library-entry'),artId:art.id,nameTh:art.nameTh,tier:art.tier||1,rarityBadgeTh:art.rarityBadgeTh||grade?.badgeTh||'สามัญ',rarityColor:art.rarityColor||grade?.color||'#adb5bd',ownerNpcId:null,originalOwnerNpcId:n.id,donatedByNpcId:n.id,donatedAt:g.s.t,rights:'SECT_LIBRARY',sourceType:'SECT_LIBRARY',originLabelTh:'ฉบับคัดลอกจารึกโดย '+n.name,count:1};
   library.push(shared);H.learn(n,'copyScripture',2);E.recordTrackDaoEvidenceV1200(g.world,n,'STUDY',4);
   g.life?.credit(n,2,'คัดลอกคัมภีร์เข้าหอสืบทอด');
   this.receipt('scriptureDonated',n,{artId:art.id,libraryId:shared.libraryId,originLabelTh:shared.originLabelTh});
   g.realm?.speak(n,'ข้าคัดลอกเคล็ดวิชา '+art.nameTh+' เก็บไว้ให้ศิษย์รุ่นหลังแล้ว','scripture');
   g.note(n.name+' จรดพู่กันคัดลอกคัมภีร์ «'+art.nameTh+'» เข้าหอสืบทอดสำเร็จ',n);
   q.nextPlan=0;return {handled:true,success:true,cooldown:35};
  }
  if(action==='synthesizeScriptures'){
   const j=n.jianghu,ledger=j.ledgerV140,b=g.built('shrine')||g.built('training')||g.built('hall');
   if(!b||dist(p,g.endpoint(b))>140||ledger.scrolls.length>=24)return fail;
   if(E.getSpiritStonesV140(n)<8&&(g.s.growth.researchFund||0)<8)return fail;
   const selected=String(id||'').split('|');
   const spares=selected.map(sid=>ledger.scrolls.find(book=>book.id===sid&&!book.loan&&book.rights!=='LOAN'&&(!book.ownerNpcId||book.ownerNpcId===n.id)&&(j.knowledgeV190?.[book.artId]?.stage||0)>=4&&this.artMap.get(book.artId)?.path===j.path&&(book.tier||1)<7)).filter(Boolean);
   if(new Set(spares.map(b=>b.id)).size!==2||spares.length<2)return fail;
   const sA=spares[0],sB=spares[1];
   const pairKey=[sA.id,sB.id].sort().join('|');
   q.deducedPairs=q.deducedPairs||{};
   const syn=root.JianghuExpansionV112?.synthesizeManual?.(n,sA.artId,sB.artId,g.rng);
   if(!syn?.manual){
    q.deducedPairs[pairKey]=g.s.t+180;
    return fail;
   }
   // Pay scholarly costs (8 stones + ink/cinnabar/paper if available + mental fatigue) WITHOUT destroying source scrolls!
   if(E.getSpiritStonesV140(n)>=8)E.addSpiritStonesV140(n,-8);
   else g.s.growth.researchFund-=8;
   let inkUsed=null;
   for(const matId of ['MAT_TAL_VERMILION_INK_3',CIN,HERB]){
    if(g.count(n,matId)>0&&g.consume(n,matId,1)){inkUsed=matId;break;}
    if(g.count(g.bank,matId)>0&&g.consume(g.bank,matId,1)){inkUsed=matId;break;}
   }
   n.core.condition.fatigue=clamp((n.core.condition.fatigue||0)+12);
   q.deducedPairs[pairKey]=g.s.t+120;
   const chance=clamp(.26+H.capacity(n,'synthesizeScriptures').total*.006,.28,.85),roll=g.rng.next();
   if(roll>=chance){
    H.learn(n,'synthesizeScriptures',1);
    E.recordTrackDaoEvidenceV1200(g.world,n,'STUDY',2);
    this.receipt('scriptureDeductionFailed',n,{fromIds:[sA.id,sB.id],fromArtIds:[sA.artId,sB.artId],chance,roll,inkUsed,sourceScrollsPreserved:true});
    g.note(n.name+' เทียบเคล็ดคัมภีร์ทั้งสองม้วนแล้วยังตีความจุดเชื่อมไม่สำเร็จ (คัมภีร์ต้นฉบับทั้งสองม้วนยังคงอยู่ครบ)',n);
    return {handled:true,success:false,cooldown:65};
   }
   const created=syn.manual,grade=syn.grade;
   if(!this.artMap.has(created.id))this.artMap.set(created.id,created);
   const newScroll={
    id:this.id('scroll-synth'),
    artId:created.id,
    nameTh:created.nameTh,
    tier:created.tier||1,
    rarityGrade:created.rarityGrade||grade?.code||'MYSTIC',
    rarityBadgeTh:created.rarityBadgeTh||grade?.badgeTh||'ลี้ลับ',
    rarityColor:created.rarityColor||grade?.color||'#4dabf7',
    count:1,
    ownerNpcId:n.id,
    rights:'OWNER',
    sourceType:'DISCOVERY',
    originLabelTh:'เทียบเคล็ดและอนุมานมรรคาโดย '+n.name+' (จาก '+syn.fromArts.join(' + ')+')'
   };
   ledger.scrolls.push(newScroll);
   g.discovery?.recordFind(n,newScroll,{method:'SCRIPTURE_DEDUCTION',fromIds:[sA.id,sB.id],fromArtIds:[sA.artId,sB.artId],leap:syn.leap,inkUsed,chance,roll});
   H.learn(n,'synthesizeScriptures',3);
   E.recordTrackDaoEvidenceV1200(g.world,n,'STUDY',7);
   g.life?.credit(n,3,'อนุมานคัมภีร์ยกระดับมรรคา');
   this.receipt('synthesizeScriptures',n,{artId:created.id,tier:created.tier,leap:syn.leap,fromArts:syn.fromArts,fromIds:[sA.id,sB.id],sourceScrollsPreserved:true});
   g.realm?.speak(n,'นำแก่นแท้สองคัมภีร์มาเทียบเคียงกัน บังเกิดความเข้าใจใน «'+created.nameTh+'»!','enlightenment');
   g.note(n.name+' เทียบเคล็ดคัมภีร์ 2 ม้วน อนุมานขึ้นเป็นคัมภีร์ระดับ'+newScroll.rarityBadgeTh+' «'+created.nameTh+'» สำเร็จ โดยคัมภีร์ต้นฉบับยังอยู่ครบ!',n);
   q.nextPlan=0;return {handled:true,success:true,cooldown:45,item:newScroll};
  }
  if(action==='readScripture'||action==='readLibraryScripture'||action==='practiceScripture'){
   const libraryRead=action==='readLibraryScripture',a=this.artMap.get(id),j=n.jianghu,library=g.s.growth.scriptureLibrary||[],shared=library.find(book=>book.artId===id),b=libraryRead?g.built('shrine'):(g.built('shrine')||g.built('training')||g.built('hall'));
   if(!a||!b||dist(p,g.endpoint(b))>140||(g.discovery&&!g.discovery.canStudy(n,a))||!this.compatible(n,a)||!this.canStudyArtTier(n,a))return fail;
   let k=j.knowledgeV190[id];
   if(action==='readScripture'||libraryRead){
    const source=libraryRead?shared:j.ledgerV140.scrolls.find(book=>book.artId===id&&book.count!==0);const hasSource=!!source;
    if(!hasSource||k?.stage>=4)return fail;
    if(libraryRead&&root.JianghuSectLibrary&&!root.JianghuSectLibrary.enroll(g,n,id).ok)return fail;
    if(!k)k=j.knowledgeV190[id]={artId:id,stage:1,mastery:0,reading:0,source:libraryRead?'SECT_LIBRARY':'PERSONAL_SCROLL'};
    this.sanitizeEquippedItems(n);
    const studyBonus=Object.values(j.equipmentV140||{}).reduce((sum,eqId)=>{
     const eq=j.ledgerV140.equipmentItems.find(i=>i.id===eqId);
     return sum+(eq&&this.canEquipItem(n,eq).ok?(eq.studyBonus||0):0);
    },0);
    k.reading=Math.min(100,(k.reading||0)+20*H.learningRate(n,'readScripture')*(1+studyBonus)*(libraryRead?(root.JianghuInfrastructure?.bonuses(g).studySpeed||1):1));
    k.redistribute=libraryRead||(source?.rights!=='LOAN'&&source?.canRedistribute!==false);k.sourceItemId=source?.id||null;if(libraryRead){k.source='SECT_LIBRARY';k.libraryScrollId=shared.libraryId||shared.id;}
    if(k.reading>=100){
     k.stage=4;k.mastery=Math.max(8,k.mastery||8);g.discovery?.onLearned(n,a);j.artMasteryV150[id]=k.mastery;j.knownArtIdsV150=[...new Set([...(j.knownArtIdsV150||[]),id])];
     g.realm?.speak(n,'ที่แท้แก่นแท้ของ «'+a.nameTh+'» เป็นเช่นนี้เอง!','enlightenment');
     g.note(n.name+' ตีความคัมภีร์ «'+a.nameTh+'» จนแจ้งกระจ่างและเริ่มนำไปฝึกฝนจริง',n);
    }
   }else{
    if(!k||k.stage<4)return fail;
    k.mastery=Math.min(100,k.mastery+8*H.learningRate(n,'practiceScripture'));
    k.stage=k.mastery>=60?6:k.mastery>=30?5:4;
    j.artMasteryV150[id]=k.mastery;
    E.recordTrackDaoEvidenceV1200(g.world,n,'STUDY',3);
   }
   const slot=this.slot(a),current=this.artMap.get(j[slot+'Id']),oldK=j.knowledgeV190[current?.id];
   if(k.stage>=4&&(!current||(k.mastery*(a.tier||1)+(a.subPath===j.subPath?15:0))>((oldK?.mastery||0)*(current.tier||1)+(current?.subPath===j.subPath?15:0)))){
    j[slot+'Id']=id;j[slot+'NameTh']=a.nameTh;
   }
   E.invalidateNpcCoreCache(n);
   p.nextLoadoutAt=0;g.combatSystem?.reconcileLoadout(n,{force:true});
   this.receipt(action,n,{artId:id,reading:k.reading,mastery:k.mastery,source:libraryRead?'SECT_LIBRARY':'PERSONAL_SCROLL',libraryId:libraryRead?(shared?.libraryId||shared?.id):null});
   if(libraryRead&&g.s.realm?.receipts){
    g.s.realm.receipts.unshift({id:'library-study-'+this.id('realm-receipt'),t:g.s.t,kind:'readLibraryScripture',npcId:n.id,artId:id,reading:k.reading,mastery:k.mastery,libraryId:shared?.libraryId||shared?.id});
    g.s.realm.receipts.splice(120);
   }
  }
  if(action==='comprehendTablet'){
   const j=n.jianghu,artId=id||j.techniqueId||j.mantraId,a=this.artMap.get(artId);
   E.applyNpcCultivationProgressGain(g.world,n,2.8*H.learningRate(n,'comprehendTablet'));
   E.recordTrackDaoEvidenceV1200(g.world,n,'STUDY',5);
   if(a&&j.knowledgeV190?.[artId]){
    const k=j.knowledgeV190[artId];
    k.mastery=Math.min(100,(k.mastery||8)+6*H.learningRate(n,'comprehendTablet'));
    k.stage=k.mastery>=60?6:k.mastery>=30?5:4;
    j.artMasteryV150[artId]=k.mastery;
   }
   H.learn(n,'comprehendTablet',2);
   let discovered=null;
   if(!g.built('shrine')&&g.rng.next()<0.08){
    discovered=this.grantScroll(n,'รอยจารึกโบราณบนศิลาแห่งมรรคา',n,{poolId:'POOL_SWORD_CLIFF_STELA'});
   }
   E.invalidateNpcCoreCache(n);this.receipt('comprehendTablet',n,{artId:discovered?.artId||artId,discoveredScrollId:discovered?.id||null});
   if(discovered){
    g.realm?.speak(n,'ในรอยจารึกนี้ซ่อนเคล็ดวิชา «'+discovered.nameTh+'» ไว้!', 'discovery');
    g.note(n.name+' เพ่งจิตศึกษารอยศิลาจารึกจนบังเกิดญาณหยั่งรู้ ได้รับคัมภีร์'+discovered.rarityBadgeTh+' «'+discovered.nameTh+'»',n);
   }else{
    g.realm?.speak(n,'ร่องรอยปราณบนศิลาจารึกช่วยให้ข้าเข้าใจมรรคาลึกซึ้งขึ้น','cultivation');
    g.note(n.name+' เพ่งจิตศึกษารอยกระบี่และศิลาจารึก สะสมหลักฐานเต๋าและความชำนาญวิชา',n);
   }
   q.nextPlan=0;return {handled:true,success:true,cooldown:42};
  }
  if(action==='meditateWaterfall'){
   const j=n.jianghu,rec=H.recovery(n);
   n.health=Math.min(100,n.health+14*rec);
   n.core.condition.fatigue=Math.max(0,n.core.condition.fatigue-26*rec);
   n.core.human.state.grief=Math.max(0,(n.core.human.state.grief||0)-10);
   j.heartDemon=Math.max(0,(j.heartDemon||0)-14);
   E.applyNpcCultivationProgressGain(g.world,n,3.5*H.learningRate(n,'meditateWaterfall'));
   E.recordTrackDaoEvidenceV1200(g.world,n,'PRACTICE',5);
   H.learn(n,'meditateWaterfall',2);
   this.receipt('meditateWaterfall',n,{progressGain:3.5});
   g.realm?.speak(n,'สายน้ำเชี่ยวกรากช่วยชะล้างจิตมารและหล่อหลอมกายใจให้มั่นคง','cultivation');
   g.note(n.name+' เข้าฌานเคี่ยวกรำกายใจใต้สายน้ำตกธาราหยก สลายจิตมารและเพิ่มพูนตบะ',n);
   q.nextPlan=0;return {handled:true,success:true,cooldown:38};
  }
  if(action==='brewTeaDao'){
   const j=n.jianghu;
   if(g.count(n,CINDER)>0)g.consume(n,CINDER,1);
   else if(g.count(g.bank,CINDER)>0)g.consume(g.bank,CINDER,1);
   else if(g.count(n,HERB)>0)g.consume(n,HERB,1);else return fail;
   j.pillToxicity=Math.max(0,(j.pillToxicity||0)-12);
   j.heartDemon=Math.max(0,(j.heartDemon||0)-10);
   n.core.human.state.grief=Math.max(0,(n.core.human.state.grief||0)-12);
   n.core.condition.fatigue=Math.max(0,n.core.condition.fatigue-16);
   p.needs.social=Math.max(0,p.needs.social-28);
   E.applyNpcCultivationProgressGain(g.world,n,2.2);
   E.recordTrackDaoEvidenceV1200(g.world,n,'STUDY',3);
   H.learn(n,'brewTeaDao',2);
   this.receipt('brewTeaDao',n,{cleanse:12});
   g.realm?.speak(n,'กลิ่นชาวิญญาณหอมกรุ่น ช่วยให้กระจกใจใสกระจ่างไร้ฝุ่นธุลี','zen');
   g.note(n.name+' ต้มน้ำชงชาวิญญาณชำระพิษโอสถและประคองดวงจิตให้สงบนิ่ง',n);
   q.nextPlan=0;return {handled:true,success:true,cooldown:32};
  }
  if(action==='patrolSect'){
   g.s.villageHP=Math.min(1000,g.s.villageHP+20);
   p.needs.safety=Math.max(0,p.needs.safety-25);
   g.life?.credit(n,2,'ลาดตระเวนคุ้มภัยหุบเขา');
   E.recordTrackDaoEvidenceV1200(g.world,n,'COMBAT',4);
   H.learn(n,'patrolSect',2);
   this.receipt('patrolSect',n,{villageHP:g.s.villageHP});
   g.realm?.speak(n,'แนวป้องกันรอบหมู่บ้านและสำนักยังมั่นคงดี','patrol');
   g.note(n.name+' ออกตรวจตราแนวป้องกันรอบหุบเขาเมฆาคราม เสริมความอุ่นใจแก่ชาวบ้าน',n);
   q.nextPlan=0;return {handled:true,success:true,cooldown:36};
  }
  if(action==='usePersonalPill'){
   const pill=n.jianghu.ledgerV140.pillStacks.find(x=>x.id===id&&x.count>0&&(x.livingEffect||x.effect));if(!pill)return fail;
   const e=this.normalizePill(pill);
   const cs=g.combatSystem?.ensure(n);
   if(cs){n.jianghu.currentQiV190=cs.qi;n.jianghu.maxQiV190=cs.maxQi;}
   const res=E.consumePillFromLedgerV150(g.world,n.id,pill.id);
   if(!res?.ok)return fail;
   if(cs){cs.qi=Math.max(0,Math.min(cs.maxQi,n.jianghu.currentQiV190));}
   this.receipt('pill',n,{itemId:id,effect:e});
  }
  q.nextPlan=0;return {handled:true,success:true,cooldown:action==='makePersonalItem'?65:action==='practiceScripture'?24:12};
 }
 grantScroll(n,origin,owner=n,opts={}){
  if(owner.jianghu.ledgerV140.scrolls.length>=24)return null;
  const exp=root.JianghuExpansionV112;
  let chosenArt=null,poolInfo=null,gradeInfo=null;
  const originText=String(origin||'');
  const worldChannel=opts.discoveryChannel||(opts.rumorId||/ข่าวลือ|rumor/i.test(originText)?'RUMOR_HERITAGE':opts.siteId||/แดนลับ|secret realm/i.test(originText)?'SECRET_REALM':/หมื่นภพ|myriad/i.test(originText)?'MYRIAD_WORLDS':null);
  const knownIds=new Set([...Object.keys(n.jianghu.knowledgeV190||{}),...n.jianghu.ledgerV140.scrolls.map(s=>s.artId)]);
  const maxFindTier=opts.allowAnyTier?7:Math.min(7,Math.max(4,Math.ceil(this.tier(n))+2+Math.floor(((opts.danger||25)+(n.jianghu.fortuneKarmaV113||0)*.4)/22)));
  const hiddenPool=this.arts.filter(a=>a.hiddenWorldArt&&!a.innateRoute&&a.discoveryChannel===worldChannel&&(a.tier||1)<=maxFindTier&&(!knownIds.has(a.id)||opts.allowDuplicates));
  if(hiddenPool.length&&this.g.rng.next()<.28){
   const weight=a=>(a.subPath===n.jianghu.subPath?4:a.path===n.jianghu.path?2:1)/(1+Math.max(0,(a.tier||1)-2)*.6);
   let roll=this.g.rng.next()*hiddenPool.reduce((sum,a)=>sum+weight(a),0);
   chosenArt=hiddenPool[hiddenPool.length-1];
   for(const a of hiddenPool){roll-=weight(a);if(roll<=0){chosenArt=a;break;}}
   poolInfo={poolId:'POOL_'+worldChannel,nameTh:worldChannel==='MYRIAD_WORLDS'?'มรดกแดนหมื่นภพ':worldChannel==='SECRET_REALM'?'มรดกแดนลับ':'มรดกตามเบาะแสข่าวลือ'};
  }
  if(!chosenArt&&exp?.rollFortuitousManual){
   const rolled=exp.rollFortuitousManual({npc:n,origin,rng:this.g.rng,tier:this.tier(n),...opts});
   if(rolled?.manual){
    chosenArt=this.artMap.get(rolled.manual.id)||rolled.manual;
    poolInfo=rolled.pool;
    gradeInfo=rolled.grade;
   }
  }
  if(!chosenArt){
   const candidates=this.arts.filter(a=>!a.innateRoute&&(!a.hiddenWorldArt||a.discoveryChannel===worldChannel)&&this.compatible(n,a)&&(a.tier||1)<=Math.min(4,this.tier(n)+1)&&!n.jianghu.ledgerV140.scrolls.some(s=>s.artId===a.id)&&!n.jianghu.knowledgeV190[a.id])
    .sort((a,b)=>this.scoreArtSuitability(n,b).score-this.scoreArtSuitability(n,a).score);
   const topPool=candidates.slice(0,Math.min(6,candidates.length));
   chosenArt=topPool.length?topPool[this.g.rng.int(0,topPool.length-1)]:null;
  }
  if(!chosenArt)return null;
  if(!this.artMap.has(chosenArt.id))this.artMap.set(chosenArt.id,chosenArt);
  const grade=gradeInfo||exp?.rarityGradesV112?.[chosenArt.tier||1]||{badgeTh:'สามัญ',color:'#adb5bd',code:'MORTAL'};
  const item={
   id:this.id('scroll'),
   artId:chosenArt.id,
   nameTh:chosenArt.nameTh,
   tier:chosenArt.tier||1,
   rarityGrade:chosenArt.rarityGrade||grade.code,
   rarityBadgeTh:chosenArt.rarityBadgeTh||grade.badgeTh,
   rarityColor:chosenArt.rarityColor||grade.color,
   poolId:chosenArt.poolId||poolInfo?.poolId||'POOL_WANDERER_RELIC',
   poolNameTh:poolInfo?.nameTh||'มรดกยุทธภพ',
   count:1,
   ownerNpcId:owner.id,
   rights:'OWNER',
   sourceType:'DISCOVERY',
   originLabelTh:origin+(poolInfo?(' · '+poolInfo.nameTh):'')
  };
  owner.jianghu.ledgerV140.scrolls.push(item);this.g.discovery?.recordFind(owner,item,{poolId:item.poolId,rumorId:opts.rumorId||null,siteId:opts.siteId||null});
  return item;
 }
 stockFortune(f){
  if(f.stocked14)return;f.stocked14=true;const g=this.g,l=f.cache.jianghu.ledgerV140;
  if(f.kind==='RARE_PILLS_AND_HERBS'){
   const r=RECIPES[0];l.pillStacks.push({id:this.id('ruin-pill'),recipeId:r.id,nameTh:r.name,tier:1,quality:'REFINED',count:1,livingEffect:copy(r.effect),effect:normalizePillEffect(r.effect),originLabelTh:f.name});
   g.add(f.cache,GINSENG,1,'BOUNDED_FORTUNE_DEPOSIT');
  }
  if(f.kind==='COMBAT_RELIC_AND_STONES')E.setSpiritStonesV140(f.cache,25);
  if(f.kind==='METEOR_ORE_AND_WEAPON'){const eq={id:this.id('meteor-blade'),nameTh:'กระบี่เหล็กดาราร่วง',slot:'WEAPON',tier:3,minStageReq:2,quality:'REFINED',durability:100,maxDurability:100,combatMult:.12,defenseMult:.03,compatiblePath:'ANY',originLabelTh:f.name};root.JianghuExpansionV112?.imbueEquipmentDepth?.(eq,g.rng);l.equipmentItems.push(eq);}
  const bonusMat=root.JianghuExpansionV112?.rollFortuneBonusMaterial?.(f.kind,g.rng);
  if(bonusMat?.matId)g.add(f.cache,bonusMat.matId,bonusMat.count,'FORTUNE_POOL_V114');
 }
 claimFortune(n,f){
  const g=this.g;this.stockFortune(f);
  if(f.claimed||f.expiresAt<=g.s.t||dist(n.stageLocal,f)>125)return {handled:true,success:false};
  const moved=[];
  const cash=E.getSpiritStonesV140(f.cache);if(cash>0&&g.realm.transferMoney(f.cache,n,cash))moved.push({stones:cash});
  for(const z of [...f.cache.jianghu.ledgerV140.materialStacks]){const amount=g.realm.transferMaterial(f.cache,n,z.matId,z.count,'FORTUNE');if(amount)moved.push({matId:z.matId,amount});}
  for(const key of ['equipmentItems','pillStacks']){const src=f.cache.jianghu.ledgerV140[key],dst=n.jianghu.ledgerV140[key];while(src.length&&dst.length<12){const it=src.shift();dst.push(it);moved.push({itemId:it.id});}}
  if(['ANCIENT_SCROLL','COMBAT_RELIC_AND_STONES','ZEN_SCROLL_ENLIGHTENMENT','DEMON_ABYSS_SCRIPTURE','CELESTIAL_EDICT_SCROLL'].includes(f.kind)){
   const poolMap={
    ZEN_SCROLL_ENLIGHTENMENT:'POOL_ZEN_HEART_PAVILION',
    DEMON_ABYSS_SCRIPTURE:'POOL_NETHER_ABYSS_ALTAR',
    CELESTIAL_EDICT_SCROLL:'POOL_CELESTIAL_SHRINE_RELIC',
    COMBAT_RELIC_AND_STONES:'POOL_ANCIENT_BLOOD_FORGE',
    ANCIENT_SCROLL:'POOL_SWORD_CLIFF_STELA'
   };
   const it=this.grantScroll(n,f.name,n,{poolId:poolMap[f.kind],danger:f.danger||30});
   if(it){
    moved.push({itemId:it.id,artId:it.artId,rarityBadgeTh:it.rarityBadgeTh});
    g.note(n.name+' ค้นพบวาสนา ณ '+f.name+' ได้รับคัมภีร์ระดับ'+it.rarityBadgeTh+' «'+it.nameTh+'»!',n);
   }
  }
  if(f.kind==='QI_SURGE_AND_HEAL'&&f.charges>0){
   f.charges--;n.health=Math.min(100,n.health+22*H.recovery(n));H.recover(n,12);E.applyNpcCultivationProgressGain(g.world,n,3);moved.push({water:true});
  }
  if(!moved.length)return {handled:true,success:false};
  f.claimed=true;f.claimedBy=n.id;f.claimedAt=g.s.t;
  root.JianghuSectContributions?.tryFortuitousRecipeDiscovery?.(g,n,f.name);
  this.receipt('fortune',n,{fortuneId:f.id,fortuneKind:f.kind,moved});
  g.remember(n,'seekFortune',6,'ค้นพบวาสนา '+f.name);
  g.life.credit(n,3,'พบวาสนาฟ้าดิน');
  this.equip(n);
  if(n.stageLocal.growth)n.stageLocal.growth.nextPlan=0;
  return {handled:true,success:true,cooldown:110};
 }
}
const api={Progression,RECIPES,LABELS,HERB,ORE,CIN,FANG,ORCHID,GINSENG,normalizePillEffect};root.LivingProgression=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
