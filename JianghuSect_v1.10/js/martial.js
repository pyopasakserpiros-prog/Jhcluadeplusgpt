/* Derived martial identity, passive slot management, innate subpath techniques, synergies, and shared equipment suitability. Never writes HC attributes. */
(function(g){
'use strict';
const {JD,HC,U,CULT,ECO,STATS:ST}=g,D=JD.MARTIAL,clamp=U.clamp;
const M=g.MARTIAL={
 VERSION:D.version,
 TYPES:D.types,
 GRADES:D.GRADES||{},
 BASE_PASSIVE_SLOTS:D.BASE_PASSIVE_SLOTS||3,
 PASSIVE_SLOT_BONUSES:D.PASSIVE_SLOT_BONUSES||{},
 SYNERGIES:D.SYNERGIES||[],
 INNATE_TECHNIQUES:D.innateTechniques||[],
 INNATE_BY_SUB:Object.fromEntries((D.innateTechniques||[]).map(t=>[t.innateSubpath,t]))
};
const paths={
 XIAN:{body:{meridianCapacity:28,spiritualFoundation:24,reflex:8},p:{matk:.14,def:-.05},life:{ARRAY:.12,TALISMAN:.10},curve:'late',weapons:['FOCUS','SWORD'],armor:['ROBE']},
 BODY:{body:{strength:34,toughness:30,endurance:26,vitality:22},p:{atk:.08,matk:-.1},life:{mining:.20,FORGING:.08},curve:'early',weapons:['FIST','STAFF','SPEAR'],armor:['HEAVY']},
 GOD:{body:{vitality:20,spiritualFoundation:18,endurance:12},p:{mdef:.12,cast:-.04},life:{MEDICINE:.12,herbalism:.10},curve:'steady',weapons:['SPEAR','FOCUS'],armor:['HEAVY','ROBE']},
 DEMON:{body:{strength:24,explosiveness:26,agility:18},p:{atk:.10,def:-.10},life:{POISON:.17,hunting:.12},curve:'early',weapons:['BLADE','FIST'],armor:['LIGHT']},
 HEART_SOUL:{body:{reflex:18,spiritualFoundation:30,meridianCapacity:16},p:{matk:.13,hp:-.06},life:{SCRIPTURE:.18,ARRAY:.12},curve:'late',weapons:['FOCUS','SWORD'],armor:['ROBE','LIGHT']}
};
// [body, productive life skills, curve, preferred weapons, armor]. All current branches have a distinct record.
const profiles={
 SWORD_IMMORTAL:[{reflex:16,agility:10},{SWORD:.20},'late',['SWORD'],['LIGHT']],
 FIVE_ELEMENTS:[{meridianCapacity:14,spiritualFoundation:12},{ALCHEMY:.12,ARRAY:.12},'late',['FOCUS'],['ROBE']],
 ELIXIR_DAO:[{vitality:20,recoveryRate:15},{ALCHEMY:.32,MEDICINE:.22},'steady',['FOCUS'],['ROBE']],
 ASTRAL_ARRAY:[{spiritualFoundation:15},{ARRAY:.35,TALISMAN:.15},'late',['FOCUS'],['ROBE']],
 BLOOD_DEMON:[{explosiveness:22,strength:12},{hunting:.25},'early',['BLADE','FIST'],['LIGHT']],
 PHANTOM_SOUL:[{agility:18,reflex:12},{survival:.20,SCRIPTURE:.12},'late',['FOCUS','BLADE'],['LIGHT']],
 TIME_VOID:[{speed:18,reflex:18},{ARRAY:.20,SCRIPTURE:.22},'late',['FOCUS'],['ROBE']],
 SOUND_ZITHER:[{spiritualFoundation:15,dexterity:18},{MEDICINE:.14,TALISMAN:.22},'steady',['FOCUS'],['ROBE']],
 YIN_YANG_HARMONY:[{recoveryRate:20,meridianCapacity:12},{ALCHEMY:.18,MEDICINE:.20},'steady',['FOCUS','STAFF'],['ROBE']],
 TIGER_SOVEREIGN:[{strength:22,explosiveness:20},{hunting:.28},'early',['FIST'],['LIGHT']],
 BLOOD_DRAGON:[{vitality:24,strength:18},{hunting:.18,mining:.16},'late',['FIST','SPEAR'],['HEAVY']],
 VAJRA_BODHI:[{toughness:28,endurance:16},{MEDICINE:.16,mining:.18},'late',['STAFF','FIST'],['HEAVY']],
 DEVOURING_FIEND:[{immunity:24,strength:18},{hunting:.24,POISON:.15},'early',['FIST','BLADE'],['HEAVY']],
 SOLAR_FORGE:[{strength:20,dexterity:20},{FORGING:.38,mining:.14},'steady',['STAFF','FIST'],['HEAVY']],
 THUNDER_BODY:[{reflex:26,speed:18},{mining:.20,FORGING:.16},'early',['SPEAR','FIST'],['LIGHT']],
 JADE_IMMORTAL_BODY:[{vitality:28,recoveryRate:26},{MEDICINE:.24,herbalism:.22},'late',['STAFF','FOCUS'],['ROBE']],
 TITAN_MOUNTAIN_BODY:[{toughness:32,endurance:26,speed:-8},{mining:.36},'late',['STAFF'],['HEAVY']],
 WAR_DEITY:[{strength:16,endurance:20},{FORGING:.20,hunting:.15},'steady',['SPEAR','BLADE'],['HEAVY']],
 MERCY_DEITY:[{vitality:22,recoveryRate:18},{MEDICINE:.38,ALCHEMY:.16},'steady',['FOCUS','STAFF'],['ROBE']],
 FATE_ORACLE:[{reflex:20,spiritualFoundation:12},{SCRIPTURE:.30,TALISMAN:.20},'late',['FOCUS'],['ROBE']],
 TOTEM_BEAST_GOD:[{strength:16,agility:16},{BEAST_TAMING:.35,hunting:.18},'early',['SPEAR','FIST'],['LIGHT']],
 UNDERWORLD_JUDGE:[{spiritualFoundation:22,endurance:14},{SCRIPTURE:.24,POISON:.16},'late',['STAFF','FOCUS'],['HEAVY']],
 OCEAN_SOVEREIGN:[{meridianCapacity:24,flexibility:18},{MEDICINE:.20,ALCHEMY:.18},'late',['SPEAR','FOCUS'],['ROBE']],
 HARVEST_EARTH_GOD:[{vitality:20,endurance:18},{herbalism:.38,MEDICINE:.18},'steady',['STAFF','FOCUS'],['ROBE']],
 FROST_MOON_IMMORTAL:[{meridianCapacity:18,reflex:16},{ALCHEMY:.24,herbalism:.18},'late',['SWORD','FOCUS'],['ROBE']],
 WOOD_SPRING_BODY:[{vitality:26,recoveryRate:28},{herbalism:.30,MEDICINE:.22},'late',['STAFF','FIST'],['LIGHT']],
 MEDICINE_BODHI_GOD:[{vitality:20,spiritualFoundation:20},{MEDICINE:.34,ALCHEMY:.26},'steady',['FOCUS','STAFF'],['ROBE']],
 SHADOW_ASSASSIN:[{agility:26,speed:18},{survival:.28,hunting:.18},'early',['BLADE'],['LIGHT']],
 VENOM_GU_SOVEREIGN:[{immunity:32,dexterity:16},{POISON:.36,ALCHEMY:.24},'late',['FOCUS','BLADE'],['ROBE']],
 NETHER_GHOST_KING:[{spiritualFoundation:28,endurance:12},{SCRIPTURE:.24,BEAST_TAMING:.18},'late',['FOCUS','STAFF'],['ROBE']],
 HEAVEN_DEVOURING_DEMON:[{strength:26,explosiveness:24},{hunting:.30,mining:.16},'early',['FIST','BLADE'],['HEAVY']],
 ZEN_VOID_MIND:[{spiritualFoundation:22,recoveryRate:18},{SCRIPTURE:.32,MEDICINE:.20},'late',['STAFF','FOCUS'],['ROBE']],
 CALLIGRAPHY_PAINTING_SAGE:[{dexterity:24,meridianCapacity:18},{TALISMAN:.35,ARRAY:.24},'late',['FOCUS'],['ROBE']],
 DREAM_ILLUSION_WEAVER:[{reflex:22,agility:18},{SCRIPTURE:.24,TALISMAN:.20},'late',['FOCUS'],['LIGHT']],
 MIND_SWORD_TELEKINESIS:[{reflex:24,spiritualFoundation:20},{SWORD:.20,ARRAY:.22},'late',['SWORD','FOCUS'],['ROBE']],
 STAR_ARCHER:[{reflex:24,dexterity:20},{hunting:.28,survival:.20},'late',['BOW'],['LIGHT']],
 STAFF_GUARD:[{toughness:26,endurance:24,speed:-6},{mining:.28,FORGING:.18},'early',['STAFF'],['HEAVY']]
};
M.PATHS=paths;M.PROFILES=profiles;

M.invalidateMartialCaches=n=>{
 if(!n)return;
 n._passVer=(n._passVer||0)+1;
 n._passRec=null;
 n._passStatsCache=null;
 n._innStatsCache=null;
 n._actTechsCache=null;
 n._synCache=null;
 n._innRec=null;
 n._qiMaxCache=null;
 if(ST&&ST.dirty)ST.dirty(n);
};

/* ---------- Exclusive Innate Subpath Technique Authority ---------- */
M.isInnateTech=tOrId=>{
 const t=typeof tOrId==='string'?CULT.tech(tOrId):tOrId;
 return !!(t&&(t.innateOnly||t.acquisition==='SUBPATH_INNATE'));
};

function bindCultInnateAccessors(n){
 if(!n||!n.cult||n.cult._innAcc)return;
 const c=n.cult;
 if(Object.prototype.hasOwnProperty.call(c,'innateTechs')&&Object.getOwnPropertyDescriptor(c,'innateTechs').enumerable){
  if(Array.isArray(c.innateTechs)&&!Array.isArray(n.innateTechs))n.innateTechs=c.innateTechs;
  delete c.innateTechs;
 }
 if(Object.prototype.hasOwnProperty.call(c,'dormantInnate')&&Object.getOwnPropertyDescriptor(c,'dormantInnate').enumerable){
  if(Array.isArray(c.dormantInnate)&&!Array.isArray(n.dormantInnate))n.dormantInnate=c.dormantInnate;
  delete c.dormantInnate;
 }
 if(Object.prototype.hasOwnProperty.call(c,'innateGranted')&&Object.getOwnPropertyDescriptor(c,'innateGranted').enumerable){
  if(Array.isArray(c.innateGranted)&&!Array.isArray(n.innateGranted))n.innateGranted=c.innateGranted;
  delete c.innateGranted;
 }
 if(!Object.getOwnPropertyDescriptor(c,'innateTechs')){
  Object.defineProperty(c,'innateTechs',{get(){return n.innateTechs||[];},set(v){n.innateTechs=v;},enumerable:false,configurable:true});
 }
 if(!Object.getOwnPropertyDescriptor(c,'dormantInnate')){
  Object.defineProperty(c,'dormantInnate',{get(){return n.dormantInnate||[];},set(v){n.dormantInnate=v;},enumerable:false,configurable:true});
 }
 if(!Object.getOwnPropertyDescriptor(c,'innateGranted')){
  Object.defineProperty(c,'innateGranted',{get(){return n.innateGranted||[];},set(v){n.innateGranted=v;},enumerable:false,configurable:true});
 }
 Object.defineProperty(c,'_innAcc',{value:true,enumerable:false,configurable:true});
}

M.reconcileInnate=(n,W)=>{
 if(!n)return [];
 if(!n.cult){
  if(Array.isArray(n.innateTechs))delete n.innateTechs;
  return [];
 }
 const c=n.cult;
 const effSt0=CULT.effectiveTechStage?CULT.effectiveTechStage(n):(c.stage||1);
 const ir=n._innRec;
 if(ir&&ir.cult===c&&ir.path===c.path&&ir.sub===c.sub&&ir.st===effSt0&&ir.ver===(n._passVer||0)){
  return ir.out;
 }
 bindCultInnateAccessors(n);
 if(!Array.isArray(n.innateTechs))n.innateTechs=[];
 if(!Array.isArray(n.dormantInnate))n.dormantInnate=[];
 if(!Array.isArray(n.innateGranted))n.innateGranted=[];

 if(Array.isArray(c.techs)&&c.techs.some(id=>M.isInnateTech(id))){
  c.techs=c.techs.filter(id=>!M.isInnateTech(id));
  n._actTechsCache=null;
 }
 if(Array.isArray(n.passiveLoadout)&&n.passiveLoadout.some(id=>M.isInnateTech(id))){
  n.passiveLoadout=n.passiveLoadout.filter(id=>!M.isInnateTech(id));
  n._passRec=null;
 }
 if(n.inv){
  if(Array.isArray(n.inv.techs)&&n.inv.techs.some(id=>M.isInnateTech(id))){
   n.inv.techs=n.inv.techs.filter(id=>!M.isInnateTech(id));
  }
  if(n.inv.crystals){
   for(const k of Object.keys(n.inv.crystals)){
    if(k.startsWith('T:')&&M.isInnateTech(k.slice(2)))delete n.inv.crystals[k];
   }
  }
 }

 const effSt=CULT.effectiveTechStage?CULT.effectiveTechStage(n):(c.stage||1);
 const targetInnate=(c.sub&&c.sub!=='NONE')?M.INNATE_BY_SUB[c.sub]:null;
 const qualifies=!!(targetInnate&&targetInnate.path===c.path&&(targetInnate.reqTier||targetInnate.tier||1)<=effSt);

 for(const oldId of n.innateTechs){
  if(!qualifies||oldId!==targetInnate.id){
   if(M.isInnateTech(oldId)&&!n.dormantInnate.includes(oldId)){
    n.dormantInnate.push(oldId);
   }
  }
 }

 if(qualifies){
  const tid=targetInnate.id;
  n.dormantInnate=n.dormantInnate.filter(id=>id!==tid);
  const changed=n.innateTechs.length!==1||n.innateTechs[0]!==tid;
  if(changed){
   n.innateTechs=[tid];
   M.invalidateMartialCaches(n);
  }
  if(!n.innateGranted.includes(tid)){
   n.innateGranted.push(tid);
   if(W&&W.log&&!W._founding){
    W.log('insight',(n.h&&n.h.name?n.h.name.given:'ผู้บำเพ็ญ')+' ตื่นรู้วิชาเฉพาะสายย่อย「'+targetInnate.nameTh+'」',[n.id]);
   }
  }
 }else if(n.innateTechs.length>0){
  n.innateTechs=[];
  M.invalidateMartialCaches(n);
 }
 n._innRec={cult:c,path:c.path,sub:c.sub,st:effSt,ver:n._passVer||0,out:n.innateTechs};
 return n.innateTechs;
};

M.activeInnateTechs=n=>{
 if(!n||!n.cult)return [];
 return M.reconcileInnate(n);
};

M.dormantInnateTechs=n=>{
 if(!n||!n.cult)return [];
 M.reconcileInnate(n);
 return (n.cult.dormantInnate||[]).slice();
};

M.isInnateActive=(n,techOrId)=>{
 const t=typeof techOrId==='string'?CULT.tech(techOrId):techOrId;
 if(!t||!M.isInnateTech(t)||!n||!n.cult)return false;
 const active=M.activeInnateTechs(n);
 return active.includes(t.id);
};

const EMPTY_INNATE_STATS=Object.freeze({p:{},f:{},pp:{},qiMaxFlat:0,qiMaxPct:0,qiCostMult:1,cultRatePct:0,life:{},activeIds:[]});
M.innateStats=n=>{
 if(!n||!n.cult)return EMPTY_INNATE_STATS;
 const c=n.cult,eq=n.equip||{},ic=n._innStatsCache;
 if(ic&&ic.cult===c&&ic.path===c.path&&ic.sub===c.sub&&ic.rawSt===c.stage&&ic.eqW===eq.WEAPON&&ic.eqA===eq.ARMOR&&ic.ver===(n._passVer||0)&&ic.tm===(ic.tid&&c.tm?c.tm[ic.tid]||0:0)){
  return ic.out;
 }
 const effSt=CULT.effectiveTechStage?CULT.effectiveTechStage(n):c.stage;
 const active=M.activeInnateTechs(n);
 if(!active.length){
  n._innStatsCache={cult:c,path:c.path,sub:c.sub,rawSt:c.stage,st:effSt,tid:'',tm:0,eqW:eq.WEAPON,eqA:eq.ARMOR,ver:n._passVer||0,out:EMPTY_INNATE_STATS};
  return EMPTY_INNATE_STATS;
 }
 const tid=active[0],tmVal=(c.tm&&c.tm[tid])||0;
 const t=CULT.tech(tid);
 if(!t||!M.isInnateActive(n,t)){
  return EMPTY_INNATE_STATS;
 }
 const p={},f={},pp={},life={};
 let qiMaxFlat=0,qiMaxPct=0,qiCostMult=1,cultRatePct=0;
 const ib=t.innateBonus||{};
 for(const k in ib.p)p[k]=(p[k]||0)+ib.p[k];
 for(const k in ib.f)f[k]=(f[k]||0)+ib.f[k];
 for(const k in ib.pp)pp[k]=(pp[k]||0)+ib.pp[k];
 for(const k in ib.life)life[k]=(life[k]||0)+ib.life[k];
 if(ib.qiMaxFlat)qiMaxFlat+=ib.qiMaxFlat;
 if(ib.qiMaxPct)qiMaxPct+=ib.qiMaxPct;
 if(ib.qiCostMult)qiCostMult*=ib.qiCostMult;
 if(ib.cultRatePct)cultRatePct+=ib.cultRatePct;
 if(g.SK&&g.SK.unlockedStage&&Array.isArray(t.stages)&&M.conditionMatches(n,t)){
  const uStage=g.SK.unlockedStage(n,t);
  for(const st of t.stages){
   if(st.stage<=uStage&&st.passiveBonus){
    for(const k in st.passiveBonus.p)p[k]=(p[k]||0)+st.passiveBonus.p[k];
    for(const k in st.passiveBonus.f)f[k]=(f[k]||0)+st.passiveBonus.f[k];
    for(const k in st.passiveBonus.pp)pp[k]=(pp[k]||0)+st.passiveBonus.pp[k];
   }
  }
 }
 const out={p,f,pp,qiMaxFlat,qiMaxPct,qiCostMult,cultRatePct,life,activeIds:[tid]};
 n._innStatsCache={cult:c,path:c.path,sub:c.sub,rawSt:c.stage,st:effSt,tid,tm:tmVal,eqW:eq.WEAPON,eqA:eq.ARMOR,ver:n._passVer||0,out};
 return out;
};

M.normalize=n=>{
 if(!n||!n.cult)return;
 const c=n.cult,p=CULT.PATHS[c.path];
 if(!p)return;
 if(c.sub!=='NONE'&&!p.subPaths.some(s=>s.id===c.sub)){
  c.sub='NONE';c.track=null;M.invalidateMartialCaches(n);
 }
 if(c.sub==='NONE'&&c.track){
  c.track=null;M.invalidateMartialCaches(n);
 }
 M.reconcileInnate(n);
};
const growth=(stage,max,curve)=>{const x=clamp((stage-1)/Math.max(1,max-1),0,1);return .18+.82*(curve==='early'?Math.sqrt(x):curve==='late'?x*x:x);};
const progressCache=new WeakMap();
M.progression=(n,stage)=>{
 const c=n.cult;if(!c||!paths[c.path])return {identity:'ปุถุชน',body:{},p:{},f:{},life:{},scale:0};
 const rank=Math.min(CULT.PATHS[c.path].maxStage,stage==null?c.stage:stage),track=c.track?c.track.ordinal||1:1,key=c.path+'|'+c.sub+'|'+rank+'|'+track;
 const cache=progressCache.get(n);if(cache&&cache.key===key)return cache.value;
 const path=paths[c.path],sub=CULT.PATHS[c.path].subPaths.some(s=>s.id===c.sub)?profiles[c.sub]:null,max=CULT.PATHS[c.path].maxStage,ps=growth(rank,max,path.curve),ss=Math.max(growth(rank,max,sub?sub[2]:'steady'),track>1?growth(track,9,sub?sub[2]:'steady')*.85:0);
 const body={},p={},life={};for(const k in path.body)body[k]=path.body[k]*ps;if(sub)for(const k in sub[0])body[k]=(body[k]||0)+sub[0][k]*ss;
 for(const k in path.p)p[k]=path.p[k]*ps;for(const k in path.life)life[k]=1+path.life[k]*ps;if(sub)for(const k in sub[1])life[k]=(life[k]||1)+sub[1][k]*ss;
 Object.keys(body).forEach(k=>body[k]=Math.round(body[k]*10)/10);
 const value={identity:sub?CULT.subInfo(c.path,c.sub).nameTh:'พื้นฐาน (ยังไม่เลือกสายย่อย)',body,p,f:{},life,scale:ss,curve:sub?sub[2]:path.curve};
 progressCache.set(n,{key,value});return value;
};
M.eff=(n,path)=>{const value=HC.eff(n,path);return path.startsWith('physiology.')?clamp(value+(M.progression(n).body[path.slice(11)]||0),0,180):value;};
const derivedCache=new WeakMap();M.derived=n=>{const d=HC.derived(n),prog=M.progression(n),ver=n._ver||0,hit=derivedCache.get(n);if(hit&&hit.ver===ver&&hit.prog===prog&&hit.d===d)return hit.val;const b=prog.body,val=Object.assign({},d,{hpMax:Math.round(d.hpMax+(b.vitality||0)*1.1+(b.toughness||0)*.5+(b.strength||0)*.2),walkSpeed:d.walkSpeed+((b.speed||0)*.7+(b.agility||0)*.3)/100*.9});derivedCache.set(n,{ver,prog,d,val});return val;};

/* ---------- Passive Slot Authority, Exclusivity & Toggle Safety ---------- */
M.passiveSlotInfo=n=>{
 if(!n||!n.cult)return {base:M.BASE_PASSIVE_SLOTS,bonus:0,max:0,reasonTh:'ยังไม่เปิดวิถีบำเพ็ญ'};
 const subBonus=M.PASSIVE_SLOT_BONUSES[n.cult.sub];
 const bonus=subBonus?(subBonus.slots||0):0;
 return {
  base:M.BASE_PASSIVE_SLOTS,
  bonus,
  max:M.BASE_PASSIVE_SLOTS+bonus,
  reasonTh:subBonus?subBonus.reasonTh:'ช่องพื้นฐาน '+M.BASE_PASSIVE_SLOTS+' ช่อง'
 };
};
M.maxPassiveSlots=n=>M.passiveSlotInfo(n).max;
M.isTechCompatible=(n,t)=>{
 if(!n||!n.cult||!t)return false;
 const c=n.cult;
 const effSt=CULT.effectiveTechStage?CULT.effectiveTechStage(n):(c.stage||1);
 if(M.isInnateTech(t)){
  return c.path===t.path&&c.sub===t.innateSubpath&&(t.reqTier||t.tier||1)<=effSt;
 }
 return (t.path==='ANY'||t.path===c.path)&&(!t.sub||t.sub===c.sub)&&(t.reqTier||t.tier)<=effSt;
};
M.passiveFamilyOf=t=>t?(t.passiveFamily||('FAM_'+t.id)):null;

M.reconcilePassives=n=>{
 if(!n||!n.cult||!Array.isArray(n.cult.techs))return [];
 const c=n.cult,tl=c.techs.length,tLast=tl?c.techs[tl-1]:'',tFirst=tl?c.techs[0]:'';
 const pArr=Array.isArray(n.passiveLoadout)?n.passiveLoadout:null;
 const pLen=pArr?pArr.length:-1,p0=pLen>0?pArr[0]:'',ver=n._passVer||0;
 const rc=n._passRec;
 const effSt=CULT.effectiveTechStage?CULT.effectiveTechStage(n):(c.stage||1);
 if(rc&&rc.path===c.path&&rc.sub===c.sub&&rc.stage===effSt&&rc.tl===tl&&rc.tLast===tLast&&rc.tFirst===tFirst&&rc.pLen===pLen&&rc.p0===p0&&rc.ver===ver&&Array.isArray(c.equippedPassives)){
  return c.equippedPassives;
 }
 M.reconcileInnate(n);
 if(rc&&rc.path===c.path&&rc.sub===c.sub&&rc.stage===effSt&&rc.tl===tl&&rc.tLast===tLast&&rc.tFirst===tFirst&&rc.pLen===pLen&&rc.p0===p0&&rc.ver===ver){
  return rc.out;
 }
 const maxSlots=M.maxPassiveSlots(n);
 const learnedPassives=n.cult.techs.filter(id=>{const t=CULT.tech(id);return !!(t&&!M.isInnateTech(t)&&(t.cat==='PASSIVE'||t.passive));});
 if(!learnedPassives.length){
  if(Array.isArray(n.passiveLoadout)&&n.passiveLoadout.length)n.passiveLoadout=[];
  const emptyOut=[];
  n._passRec={path:c.path,sub:c.sub,stage:effSt,tl,tLast,tFirst,pLen:Array.isArray(n.passiveLoadout)?n.passiveLoadout.length:-1,p0:'',ver:n._passVer||0,out:emptyOut};
  return emptyOut;
 }
 const unequipped=new Set(Array.isArray(n.passiveUnequipped)?n.passiveUnequipped:[]);
 const pinned=new Set(Array.isArray(n.passivePinned)?n.passivePinned:[]);
 const current=Array.isArray(n.passiveLoadout)?n.passiveLoadout:[];
 const next=[];
 const usedFamilies=new Map();

 // 1. Keep valid existing loadout order first
 for(const id of current){
  if(next.length>=maxSlots)break;
  if(!learnedPassives.includes(id)||unequipped.has(id))continue;
  const t=CULT.tech(id);
  if(!M.isTechCompatible(n,t))continue;
  const fam=M.passiveFamilyOf(t);
  if(usedFamilies.has(fam))continue;
  usedFamilies.set(fam,id);
  next.push(id);
 }

 // 2. Evaluate all compatible learned passives (sorted by tier DESC, power DESC) for auto-upgrade of same family (if not pinned) or filling open slots
 const compatible=learnedPassives.filter(id=>!unequipped.has(id)&&M.isTechCompatible(n,CULT.tech(id))).slice().sort((a,b)=>{
  const ta=CULT.tech(a),tb=CULT.tech(b);
  return (tb.tier-ta.tier)||((tb.power||0)-(ta.power||0));
 });

 for(const id of compatible){
  if(next.includes(id))continue;
  const t=CULT.tech(id),fam=M.passiveFamilyOf(t);
  if(usedFamilies.has(fam)){
   const prevId=usedFamilies.get(fam),prevT=CULT.tech(prevId);
   if(!pinned.has(prevId)&&prevT&&((t.tier>prevT.tier)||(t.tier===prevT.tier&&(t.power||0)>(prevT.power||0)))){
    const idx=next.indexOf(prevId);
    if(idx>=0){next[idx]=id;usedFamilies.set(fam,id);}
   }
   continue;
  }
  if(next.length<maxSlots){
   usedFamilies.set(fam,id);
   next.push(id);
  }
 }

 if(Array.isArray(n.passiveLoadout)||next.length>0){
  n.passiveLoadout=next;
 }
 const pArr2=Array.isArray(n.passiveLoadout)?n.passiveLoadout:null;
 n._passRec={path:c.path,sub:c.sub,stage:effSt,tl,tLast,tFirst,pLen:pArr2?pArr2.length:-1,p0:pArr2&&pArr2.length?pArr2[0]:'',ver:n._passVer||0,out:next};
 return next;
};

M.activePassives=n=>M.reconcilePassives(n);

M.inactivePassives=n=>{
 if(!n||!n.cult||!Array.isArray(n.cult.techs))return [];
 const active=M.activePassives(n);
 const activeFamilies=new Set(active.map(id=>M.passiveFamilyOf(CULT.tech(id))));
 const maxSlots=M.maxPassiveSlots(n);
 const unequipped=new Set(Array.isArray(n.passiveUnequipped)?n.passiveUnequipped:[]);
 const out=[];
 for(const id of n.cult.techs){
  const t=CULT.tech(id);
  if(!t||M.isInnateTech(t)||!(t.cat==='PASSIVE'||t.passive))continue;
  if(!M.isTechCompatible(n,t)){
   out.push({id,tech:t,reason:'หยุดทำงาน (วิถี/สาย/ขั้นไม่ตรง)'});
  }else if(active.includes(id)){
   if(!M.conditionMatches(n,t)){
    out.push({id,tech:t,reason:'หยุดทำงาน (อุปกรณ์ไม่ตรง)'});
   }
  }else if(unequipped.has(id)){
   out.push({id,tech:t,reason:'ถอดออกจากช่องวิชาติดตัว'});
  }else if(activeFamilies.has(M.passiveFamilyOf(t))){
   out.push({id,tech:t,reason:'ทับซ้อนตระกูลวิชาติดตัวเดียวกัน ('+M.passiveFamilyOf(t)+')'});
  }else if(active.length>=maxSlots){
   out.push({id,tech:t,reason:'เกินจำนวนช่องวิชาติดตัวสูงสุด ('+maxSlots+' ช่อง)'});
  }else{
   out.push({id,tech:t,reason:'ไม่ได้ติดตั้งในช่องวิชาติดตัว'});
  }
 }
 return out;
};

M.syncResourceCaps=(n,oldHp,oldQi)=>{
 if(!n||!n.h||!n.h.state)return;
 M.invalidateMartialCaches(n);
 const newHpMax=CULT.hpMax(n),newQiMax=CULT.qiMax(n);
 const curHp=oldHp!=null?oldHp:n.h.state.hp;
 n.h.state.hp=clamp(Math.min(curHp,newHpMax),1,newHpMax);
 if(n.cult){
  const curQi=oldQi!=null?oldQi:(n.h.state.qi==null?newQiMax:n.h.state.qi);
  n.h.state.qi=clamp(Math.min(curQi,newQiMax),0,newQiMax);
 }
};

M.equipPassive=(W,n,id,slotIdx)=>{
 const t=CULT.tech(id);
 if(M.isInnateTech(t))return {ok:false,reason:'วิชาเฉพาะสายย่อยติดตัวทำงานอัตโนมัติตามสายย่อย ไม่ใช้ช่องวิชาติดตัว'};
 if(!n||!n.cult||!Array.isArray(n.cult.techs)||!n.cult.techs.includes(id))return {ok:false,reason:'ยังไม่ได้เรียนวิชานี้'};
 if(!t||!(t.cat==='PASSIVE'||t.passive))return {ok:false,reason:'ไม่ใช่เคล็ดวิชาติดตัว'};
 if(!M.isTechCompatible(n,t))return {ok:false,reason:'วิถี สายย่อย หรือขั้นบำเพ็ญไม่ตรงกับวิชานี้'};
 const oldHp=n.h&&n.h.state?n.h.state.hp:null;
 const oldQi=n.h&&n.h.state?n.h.state.qi:null;
 const maxSlots=M.maxPassiveSlots(n);
 const active=M.reconcilePassives(n).slice();
 n.passiveUnequipped=(n.passiveUnequipped||[]).filter(x=>x!==id);
 n.passivePinned=Array.from(new Set((n.passivePinned||[]).concat(id)));
 if(!active.includes(id)){
  const fam=M.passiveFamilyOf(t);
  const famIdx=active.findIndex(x=>M.passiveFamilyOf(CULT.tech(x))===fam);
  if(famIdx>=0){
   const replaced=active[famIdx];
   n.passivePinned=(n.passivePinned||[]).filter(x=>x!==replaced);
   active[famIdx]=id;
  }else if(Number.isInteger(slotIdx)&&slotIdx>=0&&slotIdx<maxSlots&&slotIdx<active.length){
   const replaced=active[slotIdx];
   n.passiveUnequipped=Array.from(new Set((n.passiveUnequipped||[]).concat(replaced)));
   n.passivePinned=(n.passivePinned||[]).filter(x=>x!==replaced);
   active[slotIdx]=id;
  }else if(active.length<maxSlots){
   active.push(id);
  }else{
   return {ok:false,reason:'ช่องวิชาติดตัวเต็มแล้ว ('+maxSlots+' ช่อง)'};
  }
 }
 n.passiveLoadout=active;
 M.syncResourceCaps(n,oldHp,oldQi);
 return {ok:true,loadout:n.passiveLoadout.slice(),maxSlots};
};

M.unequipPassive=(W,n,id)=>{
 if(!n||!n.cult)return {ok:false,reason:'ไม่มีข้อมูลผู้บำเพ็ญ'};
 if(M.isInnateTech(id))return {ok:false,reason:'วิชาเฉพาะสายย่อยติดตัวไม่สามารถถอดออกด้วยตนเอง'};
 const oldHp=n.h&&n.h.state?n.h.state.hp:null;
 const oldQi=n.h&&n.h.state?n.h.state.qi:null;
 const active=M.reconcilePassives(n).slice();
 if(!active.includes(id))return {ok:false,reason:'วิชานี้ไม่ได้อยู่ในช่องที่ใช้งาน'};
 n.passiveUnequipped=Array.from(new Set((n.passiveUnequipped||[]).concat(id)));
 n.passivePinned=(n.passivePinned||[]).filter(x=>x!==id);
 n.passiveLoadout=active.filter(x=>x!==id);
 M.syncResourceCaps(n,oldHp,oldQi);
 return {ok:true,loadout:n.passiveLoadout.slice()};
};

M.gearType=it=>it?(it.gearType||D.classify(it.slot,it.nameTh)):null;
M.conditionMatches=(n,t)=>{
 if(!t)return false;
 if(t.weaponTypes){const type=(M.equippedType?M.equippedType(n):M.gearType(n.equip&&n.equip.WEAPON)||'FIST');if(!t.weaponTypes.includes(type))return false;}
 if(t.armorTypes&&(!M.gearUsable(n,n.equip&&n.equip.ARMOR)||!t.armorTypes.includes(M.gearType(n.equip&&n.equip.ARMOR))))return false;
 return true;
};
M.skillEfficiency=(n,p)=>{
 const t=CULT.tech(p.tech||p.id)||p;
 if(!t.weaponTypes&&!t.armorTypes)return 1;
 if(M.conditionMatches(n,t))return 1.15;
 if(t.requiresWeapon||p.requiresWeapon)return 0;
 return 0.65;
};

/* ---------- Technique / Subpath / Equipment Synergy Authority ---------- */
M.evaluateSynergies=n=>{
 if(!n||!n.cult||!n.cult.sub||n.cult.sub==='NONE'){const e=[];e.active=e;return e;}
 const c=n.cult,eq=n.equip||{};
 const sc=n._synCache;
 if(sc&&sc.sub===c.sub&&sc.eqW===eq.WEAPON&&sc.eqA===eq.ARMOR&&sc.ver===(n._passVer||0)){
  return sc.out;
 }
 const wType=M.equippedType?M.equippedType(n):(M.gearType(eq.WEAPON)||'FIST');
 const aType=(M.gearUsable&&M.gearUsable(n,eq.ARMOR))?M.gearType(eq.ARMOR):null;
 const out=[];
 for(const syn of M.SYNERGIES){
  if(syn.subpath&&syn.subpath!==c.sub)continue;
  if(syn.weaponTypes&&!syn.weaponTypes.includes(wType))continue;
  if(syn.armorTypes&&(!aType||!syn.armorTypes.includes(aType)))continue;
  out.push(syn);
 }
 out.active=out;
 n._synCache={sub:c.sub,eqW:eq.WEAPON,eqA:eq.ARMOR,ver:n._passVer||0,out};
 return out;
};

const EMPTY_SKILL_SYN=Object.freeze({matched:false,synergies:[],dmgMult:1,shieldMult:1,healMult:1,dotMult:1,qiCostMult:1,penAdd:0,critAdd:0,critDmgAdd:0,windDelta:0,masteryMult:1,qiRestorePct:0,cleanseHeartDemon:0,extraSupportDur:0});
M.skillSynergy=(n,p)=>{
 if(!n||n.foe||!n.cult||!p)return EMPTY_SKILL_SYN;
 const syns=M.evaluateSynergies(n);
 if(!syns.length)return EMPTY_SKILL_SYN;
 const arch=p.arch||'strike';
 const matchedSyns=syns.filter(s=>!s.archs||s.archs.includes(arch));
 if(!matchedSyns.length)return EMPTY_SKILL_SYN;
 let dmgMult=1,shieldMult=1,healMult=1,dotMult=1,qiCostMult=1,penAdd=0,critAdd=0,critDmgAdd=0,windDelta=0,masteryMult=1,qiRestorePct=0,cleanseHeartDemon=0,extraSupportDur=0;
 for(const s of matchedSyns){
  const b=s.bonus||{};
  if(b.dmgMult)dmgMult*=b.dmgMult;
  if(b.shieldMult)shieldMult*=b.shieldMult;
  if(b.healMult)healMult*=b.healMult;
  if(b.dotMult)dotMult*=b.dotMult;
  if(b.qiCostMult)qiCostMult*=b.qiCostMult;
  if(b.penAdd)penAdd+=b.penAdd;
  if(b.critAdd)critAdd+=b.critAdd;
  if(b.critDmgAdd)critDmgAdd+=b.critDmgAdd;
  if(b.windDelta)windDelta+=b.windDelta;
  if(b.masteryMult)masteryMult*=b.masteryMult;
  if(b.qiRestorePct)qiRestorePct+=b.qiRestorePct;
  if(b.cleanseHeartDemon)cleanseHeartDemon+=b.cleanseHeartDemon;
  if(b.extraSupportDur)extraSupportDur+=b.extraSupportDur;
 }
 return {
  matched:true,
  synergies:matchedSyns,
  dmgMult:clamp(dmgMult,1,1.35),
  shieldMult:clamp(shieldMult,1,1.40),
  healMult:clamp(healMult,1,1.40),
  dotMult:clamp(dotMult,1,1.40),
  qiCostMult:clamp(qiCostMult,0.70,1.20),
  penAdd:clamp(penAdd,0,25),
  critAdd:clamp(critAdd,0,20),
  critDmgAdd:clamp(critDmgAdd,0,35),
  windDelta:clamp(windDelta,-2,2),
  masteryMult:clamp(masteryMult,1,1.50),
  qiRestorePct:clamp(qiRestorePct,0,0.08),
  cleanseHeartDemon:clamp(cleanseHeartDemon,0,10),
  extraSupportDur:clamp(extraSupportDur,0,8)
 };
};

/* ---------- Target-Conditional Combat Passive Authority ---------- */
const EMPTY_TARGET_BONUS=Object.freeze({critAdd:0,critDmgAdd:0,penAdd:0,dmgMult:1});
M.combatTargetBonus=(attacker,target)=>{
 if(!attacker||attacker.foe||!attacker.cult||!target)return EMPTY_TARGET_BONUS;
 const active=M.activePassives(attacker);
 if(!active.length)return EMPTY_TARGET_BONUS;
 const targetDebuffed=!!(target.sx&&target.sx.some(x=>x.until>(ST?ST.now:0)&&['burn','bleed','poison','slow','stun','silence','weaken','blind','armorbreak','mdefbreak','exposed'].includes(x.k)));
 const tHpMax=target.foe?(target.hpMax||1):(CULT.hpMax(target)||1);
 const tHp=target.foe?(target.hp||0):(target.h&&target.h.state?target.h.state.hp:tHpMax);
 const tHpPct=(tHp/Math.max(1,tHpMax))*100;
 let critAdd=0,critDmgAdd=0,penAdd=0,dmgMult=1;
 for(const id of active){
  const t=CULT.tech(id);
  if(!t||!t.passive||!t.passive.cond||!M.isTechCompatible(attacker,t)||!M.conditionMatches(attacker,t))continue;
  const cnd=t.passive.cond;
  let ok=false;
  if(cnd.requiresDebuffOnTarget&&targetDebuffed)ok=true;
  if(cnd.targetHpBelowPct!=null&&tHpPct<=cnd.targetHpBelowPct)ok=true;
  if(cnd.targetHpAbovePct!=null&&tHpPct>=cnd.targetHpAbovePct)ok=true;
  if(ok){
   if(cnd.pp){
    if(cnd.pp.crit)critAdd+=cnd.pp.crit;
    if(cnd.pp.critDmg)critDmgAdd+=cnd.pp.critDmg;
    if(cnd.pp.pen)penAdd+=cnd.pp.pen;
   }
   if(cnd.p&&cnd.p.atk)dmgMult+=cnd.p.atk;
   if(cnd.requiresDebuffOnTarget&&dmgMult===1)dmgMult+=0.08;
  }
 }
 if(!critAdd&&!critDmgAdd&&!penAdd&&dmgMult===1)return EMPTY_TARGET_BONUS;
 return {critAdd,critDmgAdd,penAdd,dmgMult};
};

const EMPTY_PASSIVE_STATS=Object.freeze({p:{},f:{},pp:{},qiMaxFlat:0,qiMaxPct:0,qiCostMult:1,cultRatePct:0,life:{},procs:[],activeIds:[]});
M.passiveStats=n=>{
 if(!n||!n.cult)return EMPTY_PASSIVE_STATS;
 const c=n.cult,eq=n.equip||{},effSt=CULT.effectiveTechStage?CULT.effectiveTechStage(n):c.stage,tl=c.techs.length,tLast=tl?c.techs[tl-1]:'',tFirst=tl?c.techs[0]:'';
 const hpBand=(n._hpf==null||n._hpf>0.8)?2:(n._hpf<=0.4?0:(n._hpf<=0.45?1:(n._hpf<=0.5?3:4)));
 const pc=n._passStatsCache;
 if(pc&&pc.path===c.path&&pc.sub===c.sub&&pc.stage===effSt&&pc.mantra===c.mantra&&pc.tl===tl&&pc.tLast===tLast&&pc.tFirst===tFirst&&pc.eqW===eq.WEAPON&&pc.eqA===eq.ARMOR&&pc.hpBand===hpBand&&pc.ver===(n._passVer||0)){
  return pc.out;
 }
 const active=M.activePassives(n);
 const p0=active.length?active[0]:'',p1=active.length>1?active[1]:'',p2=active.length>2?active[2]:'',p3=active.length>3?active[3]:'';
 const p={},f={},pp={},life={},procs=[],activeIds=[];
 let qiMaxFlat=0,qiMaxPct=0,qiCostMult=1,cultRatePct=0;
 const seenFamilies=new Set();
 const hpPct=(n._hpf!=null?n._hpf:1)*100;
 for(const id of active){
  const t=CULT.tech(id);
  if(!t||!t.passive||!M.isTechCompatible(n,t)||!M.conditionMatches(n,t))continue;
  const fam=M.passiveFamilyOf(t);
  if(seenFamilies.has(fam))continue;
  seenFamilies.add(fam);
  activeIds.push(id);
  const ps=t.passive;
  for(const k in ps.p)p[k]=(p[k]||0)+ps.p[k];
  for(const k in ps.f)f[k]=(f[k]||0)+ps.f[k];
  for(const k in ps.pp)pp[k]=(pp[k]||0)+ps.pp[k];
  for(const k in ps.life)life[k]=(life[k]||0)+ps.life[k];
  if(ps.qiMaxFlat)qiMaxFlat+=ps.qiMaxFlat;
  if(ps.qiMaxPct)qiMaxPct+=ps.qiMaxPct;
  if(ps.qiCostMult)qiCostMult*=ps.qiCostMult;
  if(ps.cultRatePct)cultRatePct+=ps.cultRatePct;
  if(ps.cond){
   const cnd=ps.cond;
   const hpLowOk=cnd.hpBelowPct!=null&&hpPct<=cnd.hpBelowPct;
   const hpHighOk=cnd.hpAbovePct!=null&&hpPct>=cnd.hpAbovePct;
   if(hpLowOk||hpHighOk){
    for(const k in cnd.p)p[k]=(p[k]||0)+cnd.p[k];
    for(const k in cnd.f)f[k]=(f[k]||0)+cnd.f[k];
    for(const k in cnd.pp)pp[k]=(pp[k]||0)+cnd.pp[k];
   }
  }
  if(ps.proc)procs.push(Object.assign({techId:t.id,nameTh:t.nameTh},ps.proc));
 }
 // Also include unlocked stage passiveBonuses on active learned techniques/mantras
 if(g.SK&&g.SK.unlockedStage){
  const checkIds=(M.activeTechs?M.activeTechs(n):n.cult.techs).concat(n.cult.mantra?[n.cult.mantra]:[]);
  for(const id of checkIds){
   const t=CULT.tech(id);
   if(!t||M.isInnateTech(t)||!Array.isArray(t.stages)||!M.conditionMatches(n,t))continue;
   const uStage=g.SK.unlockedStage(n,t);
   for(const st of t.stages){
    if(st.stage<=uStage&&st.passiveBonus){
     for(const k in st.passiveBonus.p)p[k]=(p[k]||0)+st.passiveBonus.p[k];
     for(const k in st.passiveBonus.f)f[k]=(f[k]||0)+st.passiveBonus.f[k];
     for(const k in st.passiveBonus.pp)pp[k]=(pp[k]||0)+st.passiveBonus.pp[k];
    }
   }
  }
 }
 qiCostMult=clamp(qiCostMult,.45,1.5);
 const out={p,f,pp,qiMaxFlat,qiMaxPct,qiCostMult,cultRatePct,life,procs,activeIds};
 n._passStatsCache={path:c.path,sub:c.sub,stage:effSt,mantra:c.mantra,tl,tLast,tFirst,al:active.length,p0,p1,p2,p3,eqW:eq.WEAPON,eqA:eq.ARMOR,hpBand,ver:n._passVer||0,out};
 return out;
};

M.lifeMult=(n,skill)=>{
 if(!n||!n.cult)return 1;
 const c=n.cult,lmc=n._lifeMultCache;
 if(lmc&&lmc.cult===c&&lmc.path===c.path&&lmc.sub===c.sub&&lmc.st===c.stage&&lmc.mantra===c.mantra&&lmc.ver===(n._passVer||0)){
  const hit=lmc.map[skill];
  if(hit!==undefined)return hit;
 }
 const base=M.progression(n).life[skill]||1;
 const pass=M.passiveStats(n);
 const passAdd=(pass.life&&pass.life[skill])||0;
 const inn=M.innateStats(n);
 const innAdd=(inn.life&&inn.life[skill])||0;
 const m=c.mantra?CULT.tech(c.mantra):null;
 const manAdd=(m&&m.mantraBonus&&m.mantraBonus.life&&m.mantraBonus.life[skill])||0;
 const val=base+passAdd+innAdd+manAdd;
 if(!lmc||lmc.cult!==c||lmc.path!==c.path||lmc.sub!==c.sub||lmc.st!==c.stage||lmc.mantra!==c.mantra||lmc.ver!==(n._passVer||0)){
  n._lifeMultCache={cult:c,path:c.path,sub:c.sub,st:c.stage,mantra:c.mantra,ver:n._passVer||0,map:{[skill]:val}};
 }else{
  lmc.map[skill]=val;
 }
 return val;
};

M.subStats=(n,fx,stage)=>{if(!n.cult||!CULT.PATHS[n.cult.path].subPaths.some(s=>s.id===n.cult.sub))return {p:{},f:{}};const scale=M.progression(n,stage).scale;return {p:Object.fromEntries(Object.entries(fx.p||{}).map(([k,v])=>[k,v*scale])),f:Object.fromEntries(Object.entries(fx.f||{}).map(([k,v])=>[k,v*scale]))};};
M.conditionText=t=>{
 const a=[];
 if(t.weaponTypes)a.push(t.weaponTypes.map(x=>D.types[x]).join('/'));
 if(t.armorTypes)a.push(t.armorTypes.map(x=>D.types[x]).join('/'));
 if(!a.length)return 'ใช้ได้ทุกอุปกรณ์';
 return a.join(' + ')+(t.passive?' · ถอดแล้วผลหาย':t.requiresWeapon?' · จำเป็นต้องสวมใส่อาวุธนี้':' · อาวุธที่ถนัด ×1.15 / อื่น ×0.65');
};
M.gearSuitability=(n,it,price)=>{
 if(!it||!n.cult||(it.minStage||1)>n.cult.stage+1)return {score:-Infinity,reasons:['ขั้นบำเพ็ญไม่ถึง']};
 const c=n.cult,path=paths[c.path]||paths.XIAN,sub=profiles[c.sub],type=M.gearType(it),weapons=sub?sub[3]:path.weapons,armor=sub?sub[4]:path.armor,reasons=[],s=it.st||ST.gearStats(Object.assign({},it));
 let fit=1;if(it.slot==='WEAPON'){fit=weapons.includes(type)?1.45:.68;reasons.push(weapons.includes(type)?'ตรงแนวสายบำเพ็ญ':'อาวุธไม่ถนัด');}
 if(it.slot==='ARMOR'){fit=armor.includes(type)?1.25:.85;reasons.push(armor.includes(type)?'เกราะตรงวิถี':'เกราะต่างแนว');}
 const role=c.path==='BODY'?{atk:1.35,matk:.45,def:1.2,mdef:1.1}:c.path==='HEART_SOUL'||c.path==='XIAN'?{atk:.65,matk:1.35,def:1.1,mdef:1}:c.path==='DEMON'?{atk:1.15,matk:1.15,def:.85,mdef:.9}:{atk:1,matk:1.1,def:1,mdef:1.2};
 let power=(s.atk||0)*role.atk+(s.matk||0)*role.matk+(s.def||0)*role.def+(s.mdef||0)*role.mdef+(s.hp||0)*.5+(s.crit||0)*8+(s.critDmg||0)*1.5+(s.pen||0)*6+(s.cast||0)*3+(s.eva||0)*.6+(s.acc||0)*2;
 let moves=0;
 const checkList=c.techs.concat(M.activeInnateTechs(n));
 for(const id of checkList){const t=CULT.tech(id);if(t&&((it.slot==='WEAPON'&&t.weaponTypes&&t.weaponTypes.includes(type))||(it.slot==='ARMOR'&&t.armorTypes&&t.armorTypes.includes(type))))moves++;}
 if(moves){fit+=Math.min(.55,moves*.12);reasons.push('หนุนวิชาที่เรียน '+moves+' วิชา');}
 // Bonus if equipment triggers a subpath synergy
 const synMatch=M.SYNERGIES.some(syn=>syn.subpath===c.sub&&((it.slot==='WEAPON'&&syn.weaponTypes&&syn.weaponTypes.includes(type))||(it.slot==='ARMOR'&&syn.armorTypes&&syn.armorTypes.includes(type))));
 if(synMatch){fit+=0.18;reasons.push('ปลดล็อกการประสานสายย่อย');}
 const caution=HC.eff(n,'personality.caution')/100,aggression=HC.eff(n,'personality.aggression')/100;
 power+=(s.def||0)*caution*.35+(s.hp||0)*caution*.18+(s.atk||0)*aggression*.2;
 if(n.h.state.hp<CULT.hpMax(n)*.6){power+=(s.def||0)*.45+(s.hp||0)*.4;reasons.push('ต้องการเอาตัวรอด');}
 if(it.fx)for(const fx of it.fx){const skill=(fx.params||{}).craftBonusPath;if(skill&&M.lifeMult(n,skill)>1.05){power+=30*M.lifeMult(n,skill);reasons.push('หนุนงาน '+skill);}}
 const cost=Number.isFinite(price)?price:0,thrift=.08+HC.eff(n,'values.wealthResource')/350;
 return {score:power*fit-cost*thrift,reasons,type};
};
M.describe=(W,n)=>{const now=M.progression(n),next=n.cult&&n.cult.stage<CULT.maxStage(n)?M.progression(n,n.cult.stage+1):now,raw=n.cult&&(ST.SUBFX[n.cult.sub]||(JD.EXPANSION.subStats||{})[n.cult.sub])||{p:{},f:{}};return {now,next,subNow:M.subStats(n,raw),subNext:n.cult?M.subStats(n,raw,n.cult.stage+1):{p:{},f:{}},desires:n.cult?((profiles[n.cult.sub]||[null,null,null,paths[n.cult.path].weapons])[3]).map(x=>D.types[x]):[],crystals:Object.entries(n.inv&&n.inv.crystals||{}).filter(x=>x[1]>0),passiveSlots:M.passiveSlotInfo(n),activePassives:M.activePassives(n),inactivePassives:M.inactivePassives(n),innateTechs:M.activeInnateTechs(n),dormantInnate:M.dormantInnateTechs(n),activeSynergies:M.evaluateSynergies(n)};};
// Mint/catalog boundary types also cover historical recipe-only equipment.
const oldMint=ECO.mintGear;ECO.mintGear=(r,q)=>{const it=oldMint(r,q),source=ECO.itemById[r.outItemId]||r;it.gearType=source.gearType||D.classify(it.slot,it.nameTh);return it;};
})(typeof globalThis!=='undefined'?globalThis:this);
