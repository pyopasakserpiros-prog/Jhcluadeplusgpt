/* Scarce reusable manuals, finite one-use knowledge, and centralized 5-step Hierarchical Acquisition Lottery (v1.12.0). */
(function(g){
'use strict';
const {MARTIAL:M,CULT,CPE,ECO,HC,AI,SECT,JD,STATS:ST,U}=g,clamp=U.clamp;
M.RARITY=Object.freeze({dailyCap:14,techManual:.0045,subManual:.0006,techCrystal:.062,subCrystal:.0095});
M.LEGENDARY_RARITY=Object.freeze({dailyCap:2,minTier:5,minDanger:3,minCaveFloor:7,baseChance:.0012,manualShare:.25,crystalShare:.75});
M.FORBIDDEN_RARITY=Object.freeze({dailyCap:3,minTier:5,minDanger:2,minCaveFloor:5,baseChance:.0035,manualShare:.30,crystalShare:.70});

/* ---------- Hierarchical Lottery Probability Tables (Source Rank 1..4 & UNRANKED) ----------
 * Step A: Event Knowledge Resolution (techManual / techCrystal / subManual / subCrystal)
 * Step B: Tier Selection (1..7) — strictly decreasing with Tier at every rank, positive for all Tiers 1..7,
 *         P(Tier >= T) strictly increasing with sourceRank for T=2..7, and P(T5..7) < P(T1..4).
 * Step C: Grade Selection (Common, Refined, Rare, Exceptional, Legendary) conditional on Tier.
 * Step D: Concrete Candidate Selection with bounded within-Tier grade redistribution & duplicate crystal compensation.
 * Step E: Single replay-safe reward delivery.
 */
M.TIER_WEIGHTS_BY_RANK=Object.freeze({
 1:Object.freeze({1:0.5200,2:0.2800,3:0.1250,4:0.0520,5:0.0170,6:0.0058,7:0.0002}),
 2:Object.freeze({1:0.4200,2:0.2750,3:0.1650,4:0.0850,5:0.0380,6:0.0155,7:0.0015}),
 3:Object.freeze({1:0.3300,2:0.2550,3:0.1900,4:0.1150,5:0.0680,6:0.0360,7:0.0060}),
 4:Object.freeze({1:0.2500,2:0.2200,3:0.1900,4:0.1450,5:0.1050,6:0.0720,7:0.0180}),
 UNRANKED:Object.freeze({1:0.4600,2:0.2750,3:0.1500,4:0.0720,5:0.0290,6:0.0125,7:0.0015})
});

M.GRADE_WEIGHTS_BY_TIER=Object.freeze({
 1:Object.freeze({Common:0.780,Refined:0.170,Rare:0.050,Exceptional:0.000,Legendary:0.000}),
 2:Object.freeze({Common:0.500,Refined:0.340,Rare:0.160,Exceptional:0.000,Legendary:0.000}),
 3:Object.freeze({Common:0.220,Refined:0.440,Rare:0.270,Exceptional:0.070,Legendary:0.000}),
 4:Object.freeze({Common:0.080,Refined:0.320,Rare:0.450,Exceptional:0.150,Legendary:0.000}),
 5:Object.freeze({Common:0.000,Refined:0.140,Rare:0.480,Exceptional:0.365,Legendary:0.015}),
 6:Object.freeze({Common:0.000,Refined:0.050,Rare:0.380,Exceptional:0.530,Legendary:0.040}),
 7:Object.freeze({Common:0.000,Refined:0.000,Rare:0.320,Exceptional:0.580,Legendary:0.100})
});

M.resolveSourceRank=opts=>{
 opts=opts||{};
 if(opts.unranked===true)return 'UNRANKED';
 if(opts.sourceRank==='UNRANKED'||opts.rank==='UNRANKED')return 'UNRANKED';
 const explicit=opts.sourceRank!=null?opts.sourceRank:opts.rank;
 if(Number.isFinite(explicit)&&explicit>=1)return clamp(Math.round(explicit),1,4);
 if(opts.caveFloor!=null||opts.depth!=null){
  const f=Number(opts.caveFloor!=null?opts.caveFloor:opts.depth)||1;
  return f<=3?1:f<=6?2:f<=8?3:4;
 }
 if(opts.danger!=null){
  const d=Number(opts.danger)||1;
  return d<=1.5?1:d<=2.6?2:d<=3.6?3:4;
 }
 if(opts.tier!=null){
  const t=Number(opts.tier)||1;
  return t<=2?1:t===3?2:t===4?3:4;
 }
 return 'UNRANKED';
};

function buildSingleRankProbTable(rankKey){
 const tierWeights=M.TIER_WEIGHTS_BY_RANK[rankKey]||M.TIER_WEIGHTS_BY_RANK.UNRANKED;
 const R=M.RARITY;
 const techEventRate=R.techManual+R.techCrystal;
 const totalEventRate=R.techManual+R.techCrystal+R.subManual+R.subCrystal;
 const tiers={},tierProbs={},cumGe={},joint={};
 let tail=0;
 for(let t=7;t>=1;t--){
  const pTier=tierWeights[t]||0;
  tail=+(tail+pTier).toFixed(6);
  tierProbs[t]=pTier;
  cumGe[t]=tail;
  const gw=M.GRADE_WEIGHTS_BY_TIER[t]||{};
  const grades={},jGrades={};
  for(const [gName,gProb] of Object.entries(gw)){
   const jt=+(pTier*gProb).toFixed(7);
   jGrades[gName]=jt;
   grades[gName]={
    condOnTier:gProb,
    condOnTechAttempt:jt,
    perEvent:+(techEventRate*pTier*gProb).toFixed(9)
   };
  }
  joint[t]=jGrades;
  tiers[t]={
   tier:t,
   condOnTechAttempt:pTier,
   tailGteTier:tail,
   perEvent:+(techEventRate*pTier).toFixed(8),
   grades
  };
 }
 const sumLow=+(tierWeights[1]+tierWeights[2]+tierWeights[3]+tierWeights[4]).toFixed(6);
 const sumHigh=+(tierWeights[5]+tierWeights[6]+tierWeights[7]).toFixed(6);
 return {
  sourceRank:rankKey,
  totalKnowledgeEventRate:+totalEventRate.toFixed(6),
  techKnowledgeEventRate:+techEventRate.toFixed(6),
  subKnowledgeEventRate:+(R.subManual+R.subCrystal).toFixed(6),
  sumTiers1To4:sumLow,
  sumTiers5To7:sumHigh,
  tiers1To4:sumLow,
  tiers5To7:sumHigh,
  tierProbs,
  cumGe,
  joint,
  tiers
 };
}

M.getLotteryProbabilityTable=opts=>{
 if(!opts||Object.keys(opts).length===0){
  const allRanks={};
  for(const rk of [1,2,3,4,'UNRANKED']){
   allRanks[String(rk)]=buildSingleRankProbTable(rk);
  }
  return Object.assign(buildSingleRankProbTable('UNRANKED'),allRanks);
 }
 const rankKey=M.resolveSourceRank(opts);
 return buildSingleRankProbTable(rankKey);
};
M._unusedOldProbTable=opts=>{
 opts=opts||{};
 const rankKey=M.resolveSourceRank(opts);
 const tierWeights=M.TIER_WEIGHTS_BY_RANK[rankKey]||M.TIER_WEIGHTS_BY_RANK.UNRANKED;
 const R=M.RARITY;
 const techEventRate=R.techManual+R.techCrystal;
 const totalEventRate=R.techManual+R.techCrystal+R.subManual+R.subCrystal;
 const tiers={};
 let tail=0;
 for(let t=7;t>=1;t--){
  const pTier=tierWeights[t]||0;
  tail=+(tail+pTier).toFixed(6);
  const gw=M.GRADE_WEIGHTS_BY_TIER[t]||{};
  const grades={};
  for(const [gName,gProb] of Object.entries(gw)){
   grades[gName]={
    condOnTier:gProb,
    condOnTechAttempt:+(pTier*gProb).toFixed(7),
    perEvent:+(techEventRate*pTier*gProb).toFixed(9)
   };
  }
  tiers[t]={
   tier:t,
   condOnTechAttempt:pTier,
   tailGteTier:tail,
   perEvent:+(techEventRate*pTier).toFixed(8),
   grades
  };
 }
 const sumLow=+(tierWeights[1]+tierWeights[2]+tierWeights[3]+tierWeights[4]).toFixed(6);
 const sumHigh=+(tierWeights[5]+tierWeights[6]+tierWeights[7]).toFixed(6);
 return {
  sourceRank:rankKey,
  totalKnowledgeEventRate:+totalEventRate.toFixed(6),
  techKnowledgeEventRate:+techEventRate.toFixed(6),
  subKnowledgeEventRate:+(R.subManual+R.subCrystal).toFixed(6),
  sumTiers1To4:sumLow,
  sumTiers5To7:sumHigh,
  tiers
 };
};

M.techKey=id=>'T:'+id;M.subKey=id=>'S:'+id;
const branches=Object.values(CULT.PATHS).flatMap(p=>p.subPaths.map(s=>({id:s.id,path:p.id,nameTh:s.nameTh,tier:JD.MARTIAL.subPaths.some(x=>x.id===s.id)?2:1})));
const subById=Object.fromEntries(branches.map(s=>[s.id,s]));
M.knowledge=key=>{
 if(typeof key!=='string')return null;
 if(key.startsWith('T:')){
  const id=key.slice(2);
  if(M.isInnateTech&&M.isInnateTech(id))return null;
  const t=CULT.tech(id);
  return t?{kind:'tech',id:t.id,path:t.path,sub:t.sub,tier:t.reqTier||t.tier,grade:t.grade||'Common',legendary:!!t.legendary,cat:t.cat,nameTh:t.nameTh}:null;
 }
 if(key.startsWith('S:')){
  const s=subById[key.slice(2)];
  return s?Object.assign({kind:'sub'},s):null;
 }
 return null;
};
const cleanCounts=map=>{const out={};for(const [key,qty] of Object.entries(map||{}))if(M.knowledge(key)&&Number.isInteger(qty)&&qty>0)out[key]=Math.min(999,qty);return out;};
M.drainKnowledgeOverflow=W=>{const overflow=W.sect.knowledgeOverflow;if(!overflow)return;W.sect.crystals=W.sect.crystals||{};for(const key of Object.keys(overflow)){const qty=overflow[key];if(!M.knowledge(key)||!Number.isSafeInteger(qty)||qty<=0){delete overflow[key];continue;}const put=Math.min(qty,Math.max(0,999-(W.sect.crystals[key]||0)));if(put){W.sect.crystals[key]=(W.sect.crystals[key]||0)+put;if(put===qty)delete overflow[key];else overflow[key]=qty-put;}}};
M.ensure=W=>{
 const S=W.sect;if(!S.crystals)S.crystals={};M.drainKnowledgeOverflow(W);if(!S.subLibrary)S.subLibrary=[];
 if(!W.world.martial)W.world.martial={discovery:{day:W.day,attempts:0,legendaryAttempts:0,forbiddenAttempts:0},found:{techManual:0,subManual:0,crystal:0,legendary:0,forbidden:0},byTier:{},byGrade:{},bySource:{},foundLegends:[],used:0,donated:0,sold:0};
 const wm=W.world.martial;
 if(!wm.discovery)wm.discovery={day:W.day,attempts:0,legendaryAttempts:0,forbiddenAttempts:0};
 if(wm.discovery.legendaryAttempts==null)wm.discovery.legendaryAttempts=0;
 if(wm.discovery.forbiddenAttempts==null)wm.discovery.forbiddenAttempts=0;
 if(!wm.found)wm.found={techManual:0,subManual:0,crystal:0,legendary:0,forbidden:0};
 if(wm.found.legendary==null)wm.found.legendary=0;
 if(wm.found.forbidden==null)wm.found.forbidden=0;
 if(!wm.byTier||typeof wm.byTier!=='object')wm.byTier={};
 if(!wm.byGrade||typeof wm.byGrade!=='object')wm.byGrade={};
 if(!wm.bySource||typeof wm.bySource!=='object')wm.bySource={};
 if(!Array.isArray(wm.foundLegends))wm.foundLegends=[];
 for(const n of W.npcs){M.normalize(n);n.martialSkills=n.martialSkills||{};n.inv=n.inv||{};if(!n.inv.crystals)n.inv.crystals={};if(!n.inv.subManuals)n.inv.subManuals=[];}
 return wm;
};
M.eligible=(n,key,opts)=>{
 if(typeof key==='string'&&key.startsWith('T:')&&M.isInnateTech&&M.isInnateTech(key.slice(2))){
  return {ok:false,reason:'วิชาเฉพาะสายย่อยติดตัวไม่สามารถเรียนรู้จากคัมภีร์หรือผลึกภายนอก'};
 }
 const k=M.knowledge(key),c=n&&n.cult;if(!k||!c)return {ok:false,reason:'ยังไม่เปิดวิถีบำเพ็ญ'};
 if(k.path!=='ANY'&&k.path!==c.path)return {ok:false,reason:'ต่างวิถีหลัก'};
 const effStage=CULT.effectiveTechStage?CULT.effectiveTechStage(n):c.stage;
 if(effStage<k.tier)return {ok:false,reason:'ขั้นบำเพ็ญไม่ถึง'};
 if(k.kind==='sub'){
  if(c.sub&&c.sub!=='NONE')return {ok:false,reason:c.sub===k.id?'เรียนสายนี้แล้ว':'เลือกได้เพียงสายย่อยเดียว'};
 }else{
  const t=CULT.tech(k.id)||{};
  if(M.isInnateTech&&M.isInnateTech(t))return {ok:false,reason:'วิชาเฉพาะสายย่อยติดตัวไม่สามารถเรียนรู้ผ่านคัมภีร์หรือผลึก'};
  if(c.techs.includes(k.id)||c.mantra===k.id||(Array.isArray(c.unlockedMantras)&&c.unlockedMantras.includes(k.id))||c.learning&&c.learning.id===k.id)return {ok:false,reason:'เรียนแล้วหรือกำลังศึกษา'};
  if(k.sub&&k.sub!==c.sub)return {ok:false,reason:'ต้องมีสายย่อยตรงกัน'};
  if(/MANTRA/.test(t.cat||'')){
   if(!t.legendary&&!(opts&&opts.allowMantra))return {ok:false,reason:'ผลึกนี้ไม่ใช่หลักสูตรเคล็ดหลัก'};
  }
  if(/FORBIDDEN/.test(t.cat||'')){
   const fb=CULT.canStudyForbidden?CULT.canStudyForbidden(n,t,opts):{ok:false,reason:'วิชาต้องห้ามไม่เปิดศึกษา'};
   if(!fb.ok)return fb;
  }
 }
 return {ok:true,knowledge:k};
};
M.crystalName=key=>{const k=M.knowledge(key);return k?'ผลึก'+(k.kind==='sub'?'สาย':'วิชา')+'「'+k.nameTh+'」':key;};
const known=(W,k)=>k.kind==='sub'?(W.sect.subLibrary||[]).includes(k.id):W.sect.library.includes(k.id);
M.studyFee=(W,key)=>{const k=M.knowledge(key);if(!k)return Infinity;return k.kind==='tech'?CPE.techPrice(W,CULT.tech(k.id)):Math.max(1,Math.round((80+45*k.tier*k.tier)*CPE.S(W).price));};
M.crystalPrice=(W,key)=>{
 const k=M.knowledge(key);if(!k)return Infinity;
 if(known(W,k))return Math.floor(M.studyFee(W,key)*.5);
 const demand=W.npcs.reduce((s,n)=>s+(!n.dead&&M.eligible(n,key).ok?1:0),0),base=k.kind==='sub'?100+50*k.tier*k.tier:28*Math.pow(k.tier,2.1)*(k.legendary?2.2:1);
 return Math.max(2,Math.round(base*clamp(1+demand*.025,1,1.35)*clamp(CPE.S(W).price,.6,1.6)));
};
M.crystalReward=(W,key)=>Math.max(0,Math.floor(M.crystalPrice(W,key)*.4));
function removeUnit(n,key){
 const held=n.inv.crystals[key];if(!Number.isInteger(held)||held<1)return false;
 if(held===1)delete n.inv.crystals[key];else n.inv.crystals[key]=held-1;
 const receipt=n.inv.crystalBought&&n.inv.crystalBought[key];if(receipt){receipt.qty--;if(receipt.qty<=0)delete n.inv.crystalBought[key];}
 return true;
}
M.consumeCrystalUnit=removeUnit;
function applyKnowledge(W,n,k){
 const oldHp=n.h&&n.h.state?n.h.state.hp:null;
 const oldQi=n.h&&n.h.state?n.h.state.qi:null;
 if(k.kind==='sub'){
  n.cult.sub=k.id;n.cult.track=CULT.trackDef(k.id)?CULT.initTrack(k.id,1,W.day):null;
  if(M.reconcileInnate)M.reconcileInnate(n,W);
  if(M.reconcilePassives)M.reconcilePassives(n);
  CULT.refreshLifespan(n);
 }else{
  const t=CULT.tech(k.id)||{};
  if(M.isInnateTech&&M.isInnateTech(t))return;
  if(/MANTRA/.test(t.cat||'')){
   n.cult.unlockedMantras=Array.from(new Set((n.cult.unlockedMantras||[]).concat(k.id)));
   n.cult.mantra=k.id;
  }else{
   if(!n.cult.techs.includes(k.id))n.cult.techs.push(k.id);
   if(M.reconcilePassives)M.reconcilePassives(n);
  }
  if(/FORBIDDEN/.test(t.cat||'')&&n.h&&n.h.state){
   n.h.state.heartDemon=clamp((n.h.state.heartDemon||0)+6,0,100);
  }
 }
 HC.bump(n);
 if(M.syncResourceCaps)M.syncResourceCaps(n,oldHp,oldQi);else ST.dirty(n);
 W.log('learn',n.h.name.given+' เรียนรู้'+k.nameTh+(k.kind==='sub'?' · เปิดสายย่อย':k.legendary?' · คัมภีร์ระดับตำนาน!':''),[n.id]);
}
M.applyKnowledge=applyKnowledge;
M.useCrystal=(W,n,key,opts)=>{
 const e=M.eligible(n,key,opts);if(!e.ok)return e;
 if(!n.inv||!Number.isInteger(n.inv.crystals&&n.inv.crystals[key])||n.inv.crystals[key]<1)return {ok:false,reason:'ไม่มีผลึกในตัว'};
 if(n.inv.spawnedCrystals&&n.inv.spawnedCrystals[key]>0){n.inv.spawnedCrystals[key]--;if(n.inv.spawnedCrystals[key]<=0)delete n.inv.spawnedCrystals[key];}
 removeUnit(n,key);applyKnowledge(W,n,e.knowledge);M.ensure(W).used++;return {ok:true};
};
M.buyCrystal=(W,n,key,price)=>{
 const e=M.eligible(n,key);if(!e.ok&&!(M.canAcquireKnowledge&&M.canAcquireKnowledge(W,n,key)))return e;
 const quote=M.crystalPrice(W,key),have=W.sect.crystals&&W.sect.crystals[key];
 if(!Number.isFinite(price)||price!==quote||!Number.isInteger(have)||have<1||!Number.isFinite(n.cp)||n.cp<quote)return {ok:false,reason:'ราคา คลัง หรือแต้มเปลี่ยนไป'};
 n.inv=n.inv||{};n.inv.crystals=n.inv.crystals||{};if((n.inv.crystals[key]||0)>=999)return {ok:false,reason:'กระเป๋าเต็ม'};
 if(!CPE.spend(W,n,quote,'ซื้อ'+M.crystalName(key)))return {ok:false,reason:'แต้มไม่พอ'};
 if(have===1)delete W.sect.crystals[key];else W.sect.crystals[key]=have-1;
 n.inv.crystals[key]=(n.inv.crystals[key]||0)+1;
 const receipts=n.inv.crystalBought||(n.inv.crystalBought={}),old=receipts[key];receipts[key]={qty:(old?old.qty:0)+1,cap:old?Math.min(old.cap,quote):quote};
 M.drainKnowledgeOverflow(W);
 M.ensure(W).sold++;CPE.S(W).sales++;return {ok:true,price:quote};
};
M.donateCrystal=(W,n,key)=>{
 if(!M.knowledge(key)||!n.inv||!Number.isInteger(n.inv.crystals&&n.inv.crystals[key])||n.inv.crystals[key]<1)return {ok:false,reason:'ไม่มีผลึก'};
 if((W.sect.crystals&&W.sect.crystals[key]||0)>=999)return {ok:false,reason:'คลังเต็ม'};
 const spawned=n.inv.spawnedCrystals&&n.inv.spawnedCrystals[key]>0;
 const r=n.inv.crystalBought&&n.inv.crystalBought[key];let reward=spawned?0:M.crystalReward(W,key);
 if(!spawned&&r&&r.qty>0)reward=Math.min(reward,Math.floor(r.cap*.4));
 if(spawned){n.inv.spawnedCrystals[key]--;if(n.inv.spawnedCrystals[key]<=0)delete n.inv.spawnedCrystals[key];}
 removeUnit(n,key);W.sect.crystals=W.sect.crystals||{};W.sect.crystals[key]=(W.sect.crystals[key]||0)+1;
 if(reward>0){CPE.mint(W,n,reward,'บริจาค'+M.crystalName(key),true);CPE.S(W).donated+=reward;}
 M.ensure(W).donated++;return {ok:true,reward};
};
M.donateManual=(W,n,id,kind)=>{
 const isSub=kind==='sub';
 if(!isSub&&M.isInnateTech&&M.isInnateTech(id))return {ok:false,reason:'วิชาเฉพาะสายย่อยติดตัวไม่สามารถบริจาคเป็นคัมภีร์ได้'};
 const bag=n.inv&&(isSub?n.inv.subManuals:n.inv.techs),info=isSub?subById[id]:CULT.tech(id);
 if(!info||!Array.isArray(bag)||!bag.includes(id))return {ok:false,reason:'ไม่มีคัมภีร์'};
 const spList=n.inv&&(isSub?n.inv.spawnedSubManuals:n.inv.spawnedTechs),isSpawned=Array.isArray(spList)&&spList.includes(id);
 if(isSpawned)spList.splice(spList.indexOf(id),1);
 const lib=isSub?(W.sect.subLibrary||(W.sect.subLibrary=[])):W.sect.library,duplicate=lib.includes(id),reward=(duplicate||isSpawned)?0:isSub?Math.round((100+info.tier*60)*CPE.S(W).price):CPE.techReward(W,id);
 bag.splice(bag.indexOf(id),1);if(!duplicate)lib.push(id);
 if(reward){CPE.mint(W,n,reward,'บริจาคคัมภีร์'+info.nameTh,true);CPE.S(W).donated+=reward;}
 return {ok:true,reward};
};
M.startStudy=(W,n,id,opts)=>{
 if(M.isInnateTech&&M.isInnateTech(id))return {ok:false,reason:'วิชาเฉพาะสายย่อยติดตัวไม่สามารถศึกษาจากหอคัมภีร์'};
 const key=M.techKey(id),e=M.eligible(n,key,opts);if(!e.ok)return e;
 if(n.cult.learning||!W.sect.library.includes(id))return {ok:false,reason:'ไม่มีคัมภีร์ในหอหรือกำลังศึกษา'};
 const t=CULT.tech(id),fee=M.studyFee(W,key);
 if((t.reqTier||t.tier)>SECT.canLearnTier(W,n))return {ok:false,reason:'ยังไม่ได้รับสิทธิ์หอคัมภีร์'};
 if(!CPE.spend(W,n,fee,'ศึกษา'+t.nameTh))return {ok:false,reason:'แต้มไม่พอ'};
 n.cult.learning={id,need:CULT.studyCost(t),got:0};CPE.S(W).techSales+=fee;return {ok:true,fee};
};
M.studySubpath=(W,n,id)=>{
 const key=M.subKey(id),e=M.eligible(n,key);if(!e.ok)return e;
 if(!(W.sect.subLibrary||[]).includes(id)||e.knowledge.tier>SECT.canLearnTier(W,n))return {ok:false,reason:'ต้องมีคัมภีร์และสิทธิ์หอ'};
 const fee=M.studyFee(W,key);if(!CPE.spend(W,n,fee,'ศึกษาสาย'+e.knowledge.nameTh))return {ok:false,reason:'แต้มไม่พอ'};
 applyKnowledge(W,n,e.knowledge);CPE.S(W).techSales+=fee;return {ok:true,fee};
};

/* ---------- Centralized 5-Step Hierarchical Lottery ---------- */
function rollWeightedKey(rng,weightsObj,customRoll){
 const entries=Object.entries(weightsObj).filter(x=>x[1]>0);
 const tot=entries.reduce((s,x)=>s+x[1],0);
 if(tot<=0||!entries.length)return null;
 let r=(customRoll!=null?customRoll:rng.next())*tot;
 for(const [k,w] of entries){
  r-=w;
  if(r<=0)return k;
 }
 return entries[entries.length-1][0];
}

M.discoverableTechniques=opts=>{
 opts=opts||{};
 const all=[...JD.TECH.techniques,...JD.TECH.mantras];
 const byId=new Map();
 for(const t of all){
  if(!t||!t.id||byId.has(t.id))continue;
  if(t.martialBootstrap)continue;
  if(M.isInnateTech&&M.isInnateTech(t))continue;
  if(/MANTRA/.test(t.cat||'')&&!t.legendary)continue;
  byId.set(t.id,t);
 }
 return Array.from(byId.values());
};

M.rollHierarchicalDiscovery=(W,opts)=>{
 M.ensure(W);opts=opts||{};
 const wm=W.world.martial,state=wm.discovery,R=M.RARITY;
 const ignoreCap=!!(opts.ignoreDailyCap||opts.ignoreBudget);
 if(state.day!==W.day){state.day=W.day;state.attempts=0;state.legendaryAttempts=0;state.forbiddenAttempts=0;}
 if(!ignoreCap&&state.attempts>=R.dailyCap)return null;
 if(!ignoreCap)state.attempts++;

 // Step A: Resolve whether the event awards knowledge (and whether sub vs tech, manual vs crystal)
 let kind=opts.forceKind||null;
 if(!kind){
  if(opts.forceTechKnowledge){
   kind=W.rng.next()<(R.techManual/(R.techManual+R.techCrystal))?'techManual':'techCrystal';
  }else{
   const rA=opts.eventRoll!=null?opts.eventRoll:W.rng.next();
   if(rA<R.subManual)kind='subManual';
   else if(rA<R.subManual+R.techManual)kind='techManual';
   else if(rA<R.subManual+R.techManual+R.subCrystal)kind='subCrystal';
   else if(rA<R.subManual+R.techManual+R.subCrystal+R.techCrystal)kind='techCrystal';
   else return null;
  }
 }

 const sourceRank=M.resolveSourceRank(opts);
 const sourceLabel=opts.source||('rank_'+sourceRank);

 // Subpath specialization manual/crystal branch
 if(kind==='subManual'||kind==='subCrystal'){
  const pool=branches.filter(s=>(!opts.path||s.path===opts.path)&&!(kind==='subManual'&&(W.sect.subLibrary||[]).includes(s.id)));
  if(!pool.length)return null;
  const sub=W.rng.pick(pool);
  const drop=kind==='subManual'?{kind:'subManual',id:sub.id,tier:sub.tier,sourceRank}:{kind:'crystal',id:M.subKey(sub.id),tier:sub.tier,sourceRank};
  wm.found[drop.kind]=(wm.found[drop.kind]||0)+1;
  wm.bySource[sourceLabel]=(wm.bySource[sourceLabel]||0)+1;
  return drop;
 }

 // Step B: Select Technique Tier (1..7) from sourceRank distribution (no hard source-rank ceiling!)
 const tierWeights=M.TIER_WEIGHTS_BY_RANK[sourceRank]||M.TIER_WEIGHTS_BY_RANK.UNRANKED;
 const selectedTier=Number(opts.forceTier||rollWeightedKey(W.rng,tierWeights,opts.tierRoll))||1;

 // Step C: Select Grade (Common, Refined, Rare, Exceptional, Legendary) conditional on selectedTier
 const gradeWeights=M.GRADE_WEIGHTS_BY_TIER[selectedTier]||M.GRADE_WEIGHTS_BY_TIER[1];
 let selectedGrade=opts.forceGrade||rollWeightedKey(W.rng,gradeWeights,opts.gradeRoll)||'Common';

 // Enforce daily legendary cap or allowLegendary:false if Legendary was rolled
 if(selectedGrade==='Legendary'){
  if(opts.allowLegendary===false||(!ignoreCap&&(state.legendaryAttempts||0)>=M.LEGENDARY_RARITY.dailyCap)){
   selectedGrade='Exceptional';
  }else if(!ignoreCap){
   state.legendaryAttempts=(state.legendaryAttempts||0)+1;
  }
 }

 // Step D: Select concrete eligible technique at selectedTier (with bounded within-Tier grade fallback & duplicate compensation)
 const allPool=M.discoverableTechniques(opts);
 const allowForbiddenRoute=opts.allowForbidden===true||['cave-gate','cave','gate','realm','expedition','region','ruin','FORBIDDEN_RUIN','DEEP_REALM'].includes(opts.source)||(opts.danger||0)>=3||(opts.caveFloor||opts.depth||0)>=5;
 const foundLegends=new Set(wm.foundLegends||[]);
 const themeIds=(opts.techs&&Array.isArray(opts.techs)&&opts.techs.length)?new Set(opts.techs):null;

 const filterAtTier=(tierVal,requireTheme,allowKnownManual,allowForbid)=>{
  return allPool.filter(t=>{
   if(t.tier!==tierVal)return false;
   if(opts.hardMaxTier&&t.tier>opts.hardMaxTier)return false;
   if(opts.cat&&t.cat!==opts.cat)return false;
   if(opts.path&&t.path!==opts.path&&t.path!=='ANY')return false;
   if(opts.sub&&t.sub&&t.sub!==opts.sub)return false;
   if(requireTheme&&themeIds&&!themeIds.has(t.id))return false;
   const isForb=/FORBIDDEN/.test(t.cat||'');
   if(isForb&&!allowForbid)return false;
   if(t.legendary&&!opts.allowDuplicate&&foundLegends.has(t.id))return false;
   if(!allowKnownManual&&kind==='techManual'&&W.sect.library.includes(t.id))return false;
   return true;
  });
 };

 // 1. Try with theme filter at selectedTier; if theme has known manuals at selectedTier, convert to crystal first before relaxing theme
 let finalKind=kind==='techManual'?'techManual':'crystal';
 let duplicateCompensated=false;
 let tierCandidates=filterAtTier(selectedTier,true,false,allowForbiddenRoute);
 if(!tierCandidates.length&&themeIds&&finalKind==='techManual'){
  const themeKnown=filterAtTier(selectedTier,true,true,allowForbiddenRoute);
  if(themeKnown.length){
   tierCandidates=themeKnown;
   finalKind='crystal';
   duplicateCompensated=true;
  }
 }
 if(!tierCandidates.length&&themeIds){
  tierCandidates=filterAtTier(selectedTier,false,false,allowForbiddenRoute);
 }

 // 2. Duplicate Manual Compensation: if all manuals at selectedTier are already in W.sect.library, convert techManual -> crystal at selectedTier
 if(!tierCandidates.length&&finalKind==='techManual'){
  tierCandidates=filterAtTier(selectedTier,false,true,allowForbiddenRoute);
  if(tierCandidates.length){
   finalKind='crystal';
   duplicateCompensated=true;
  }
 }

 if(!tierCandidates.length){
  wm.lastLotteryTrace={outcome:'EMPTY_POOL',sourceRank,selectedTier,selectedGrade};
  return null;
 }

 // 3. Within-Tier Grade Selection (never upgrades a non-Legendary roll into Legendary!)
 let gradeCandidates=tierCandidates.filter(t=>t.grade===selectedGrade);
 let effectiveGrade=selectedGrade;
 if(!gradeCandidates.length){
  const fallbackOrder=selectedGrade==='Legendary'
   ?['Exceptional','Rare','Refined','Common']
   :['Exceptional','Rare','Refined','Common'].filter(gName=>gName!==selectedGrade);
  for(const fbGrade of fallbackOrder){
   const subList=tierCandidates.filter(t=>t.grade===fbGrade&&!t.legendary);
   if(subList.length){
    gradeCandidates=subList;
    effectiveGrade=fbGrade;
    break;
   }
  }
 }

 if(!gradeCandidates.length){
  wm.lastLotteryTrace={outcome:'NO_GRADE_CANDIDATE',sourceRank,selectedTier,selectedGrade};
  return null;
 }

 // If forbidden arts are present alongside orthodox arts in a non-Legendary pool, bound forbidden share to 20% unless explicitly requested
 const forbInPool=gradeCandidates.filter(t=>/FORBIDDEN/.test(t.cat||''));
 const nonForbInPool=gradeCandidates.filter(t=>!/FORBIDDEN/.test(t.cat||''));
 if(forbInPool.length&&nonForbInPool.length&&!opts.onlyForbidden){
  if(W.rng.next()<0.20&&(!opts.ignoreDailyCap?(state.forbiddenAttempts||0)<M.FORBIDDEN_RARITY.dailyCap:true)){
   if(!opts.ignoreDailyCap)state.forbiddenAttempts=(state.forbiddenAttempts||0)+1;
   gradeCandidates=forbInPool;
  }else{
   gradeCandidates=nonForbInPool;
  }
 }

 const chosen=W.rng.pick(gradeCandidates);
 const isForb=/FORBIDDEN/.test(chosen.cat||'');
 const drop=finalKind==='techManual'
  ?{kind:'techManual',id:chosen.id,techId:chosen.id,tier:chosen.tier,grade:chosen.grade,legendary:!!chosen.legendary,forbidden:isForb,sourceRank,duplicateCompensated}
  :{kind:'crystal',id:M.techKey(chosen.id),techId:chosen.id,tier:chosen.tier,grade:chosen.grade,legendary:!!chosen.legendary,forbidden:isForb,sourceRank,duplicateCompensated};

 // Step E: Record telemetry and return single drop
 if(chosen.legendary&&!foundLegends.has(chosen.id))wm.foundLegends.push(chosen.id);
 wm.found[drop.kind]=(wm.found[drop.kind]||0)+1;
 if(chosen.legendary)wm.found.legendary=(wm.found.legendary||0)+1;
 if(isForb)wm.found.forbidden=(wm.found.forbidden||0)+1;
 wm.byTier[chosen.tier]=(wm.byTier[chosen.tier]||0)+1;
 wm.byGrade[chosen.grade]=(wm.byGrade[chosen.grade]||0)+1;
 wm.bySource[sourceLabel]=(wm.bySource[sourceLabel]||0)+1;
 wm.lastLotteryTrace={outcome:'SUCCESS',sourceRank,selectedTier,selectedGrade,effectiveGrade,techId:chosen.id,kind:drop.kind,duplicateCompensated};
 return drop;
};

M.rollDiscovery=(W,opts)=>M.rollHierarchicalDiscovery(W,opts==null?{allowLegendary:false}:opts);

/* ---------- Gated Legendary & Forbidden Discovery Authorities ---------- */
M.rollLegendaryDiscovery=(W,opts)=>{
 M.ensure(W);opts=opts||{};
 const state=W.world.martial.discovery,LR=M.LEGENDARY_RARITY;
 if(state.day!==W.day){state.day=W.day;state.attempts=0;state.legendaryAttempts=0;state.forbiddenAttempts=0;}
 const qualifies=(opts.tier||0)>=LR.minTier||(opts.danger||0)>=LR.minDanger||(opts.caveFloor||opts.depth||0)>=LR.minCaveFloor||(opts.rank||opts.sourceRank||0)>=3||opts.allowLegendary===true;
 if(!qualifies)return null;
 if(!opts.ignoreDailyCap&&(state.legendaryAttempts||0)>=LR.dailyCap)return null;
 if(!opts.ignoreDailyCap)state.legendaryAttempts=(state.legendaryAttempts||0)+1;
 const chance=opts.chance!=null?opts.chance:(opts.forceChance!=null?opts.forceChance:LR.baseChance);
 const rollVal=opts.roll!=null?opts.roll:W.rng.next();
 if(rollVal>=chance)return null;
 const foundSet=new Set(W.world.martial.foundLegends||[]);
 const allLegends=[...JD.TECH.techniques,...JD.TECH.mantras].filter(t=>t.legendary&&t.overhaulPack&&!(M.isInnateTech&&M.isInnateTech(t)));
 const pool=allLegends.filter(t=>
  (!opts.cat||t.cat===opts.cat)&&
  (!opts.path||t.path===opts.path||t.path==='ANY')&&
  (!opts.minTier||t.tier>=opts.minTier)&&
  (!opts.maxTier||t.tier<=opts.maxTier)&&
  !W.sect.library.includes(t.id)&&
  (opts.allowDuplicate||!foundSet.has(t.id))
 );
 if(!pool.length)return null;
 const t=W.rng.pick(pool);
 const isManual=W.rng.next()<LR.manualShare;
 const drop=isManual?{kind:'techManual',id:t.id,techId:t.id,tier:t.tier,legendary:true,grade:'Legendary'}:{kind:'crystal',id:M.techKey(t.id),techId:t.id,tier:t.tier,legendary:true,grade:'Legendary'};
 if(!foundSet.has(t.id))W.world.martial.foundLegends.push(t.id);
 W.world.martial.found[drop.kind]=(W.world.martial.found[drop.kind]||0)+1;
 W.world.martial.found.legendary=(W.world.martial.found.legendary||0)+1;
 W.world.martial.byTier[t.tier]=(W.world.martial.byTier[t.tier]||0)+1;
 W.world.martial.byGrade.Legendary=(W.world.martial.byGrade.Legendary||0)+1;
 return drop;
};

M.rollForbiddenDiscovery=(W,opts)=>{
 M.ensure(W);opts=opts||{};
 const state=W.world.martial.discovery,FR=M.FORBIDDEN_RARITY;
 if(state.day!==W.day){state.day=W.day;state.attempts=0;state.legendaryAttempts=0;state.forbiddenAttempts=0;}
 const qualifies=(opts.tier||0)>=FR.minTier||(opts.danger||0)>=FR.minDanger||(opts.caveFloor||opts.depth||0)>=FR.minCaveFloor||(opts.rank||opts.sourceRank||0)>=2||opts.allowForbidden===true;
 if(!qualifies)return null;
 if(!opts.ignoreDailyCap&&(state.forbiddenAttempts||0)>=FR.dailyCap)return null;
 if(!opts.ignoreDailyCap)state.forbiddenAttempts=(state.forbiddenAttempts||0)+1;
 const chance=opts.chance!=null?opts.chance:(opts.forceChance!=null?opts.forceChance:FR.baseChance);
 const rollVal=opts.roll!=null?opts.roll:W.rng.next();
 if(rollVal>=chance)return null;
 const allForbid=[...JD.TECH.techniques,...JD.TECH.mantras].filter(t=>/FORBIDDEN/.test(t.cat||'')&&!t.legendary&&!(M.isInnateTech&&M.isInnateTech(t)));
 const pool=allForbid.filter(t=>
  (!opts.path||t.path===opts.path||t.path==='ANY')&&
  (!opts.minTier||t.tier>=opts.minTier)&&
  (!opts.maxTier||t.tier<=opts.maxTier)&&
  !W.sect.library.includes(t.id)
 );
 if(!pool.length)return null;
 const t=W.rng.pick(pool);
 const isManual=W.rng.next()<FR.manualShare;
 const drop=isManual?{kind:'techManual',id:t.id,techId:t.id,tier:t.tier,forbidden:true,grade:t.grade}:{kind:'crystal',id:M.techKey(t.id),techId:t.id,tier:t.tier,forbidden:true,grade:t.grade};
 W.world.martial.found[drop.kind]=(W.world.martial.found[drop.kind]||0)+1;
 W.world.martial.found.forbidden=(W.world.martial.found.forbidden||0)+1;
 W.world.martial.byTier[t.tier]=(W.world.martial.byTier[t.tier]||0)+1;
 W.world.martial.byGrade[t.grade]=(W.world.martial.byGrade[t.grade]||0)+1;
 return drop;
};

M.storeCrystal=(W,n,key,qty)=>{if(!M.knowledge(key)||!Number.isInteger(qty)||qty<1)return false;n.inv=n.inv||{};n.inv.crystals=n.inv.crystals||{};const room=Math.max(0,999-(n.inv.crystals[key]||0)),put=Math.min(room,qty);n.inv.crystals[key]=(n.inv.crystals[key]||0)+put;if(!n.inv.crystals[key])delete n.inv.crystals[key];if(qty>put){const overflow=W.sect.knowledgeOverflow||(W.sect.knowledgeOverflow={});overflow[key]=(overflow[key]||0)+qty-put;}return true;};
M.receiveDiscovery=(W,n,drop)=>{if(!drop||!n)return null;M.ensure(W);if(drop.kind==='techManual'){if(M.isInnateTech&&M.isInnateTech(drop.id))return null;n.inv.techs=n.inv.techs||[];if(!n.inv.techs.includes(drop.id))n.inv.techs.push(drop.id);}else if(drop.kind==='subManual'){if(!n.inv.subManuals.includes(drop.id))n.inv.subManuals.push(drop.id);}else if(M.knowledge(drop.id))M.storeCrystal(W,n,drop.id,1);return drop;};
M.personalDiscovery=(W,n,opts)=>M.receiveDiscovery(W,n,M.rollDiscovery(W,opts));
M.discover=(W,out,opts)=>{
 const drop=M.rollDiscovery(W,opts);if(!drop)return null;
 if(drop.kind==='techManual'){if(M.isInnateTech&&M.isInnateTech(drop.id))return null;out.techs=out.techs||[];if(!out.techs.includes(drop.id))out.techs.push(drop.id);}
 else {out.knowledge=out.knowledge||[];out.knowledge.push(drop);}
 return drop;
};
M.knowledgeFit=(n,key)=>{const k=M.knowledge(key);if(!k||!n.cult||k.path!==n.cult.path&&k.path!=='ANY')return -100;
 if(k.kind==='sub'){const score=CULT.pathScores(n).filter(s=>s.path===n.cult.path),best=score[0];const own=score.find(s=>s.sub===k.id);return own&&best?clamp(80+(own.score-best.score)*2,0,100):30;}
 if(k.sub&&k.sub!==n.cult.sub)return -50;const t=CULT.tech(k.id),matching=!t.weaponTypes||M.conditionMatches(n,t);return 60+(matching?20:-15)+(t.legendary?25:0)+(HC.eff(n,'personality.curiosity')-50)*.15;
};
M.crystalDecision=(W,n,key)=>{
 const fit=M.knowledgeFit(n,key),e=M.eligible(n,key),loyalty=HC.eff(n,'personality.loyalty'),wealth=HC.eff(n,'values.wealthResource');
 if(e.ok&&fit>=45)return {action:'use',reason:'ตรงวิถีและความถนัด',fit};
 const k=M.knowledge(key),effSt=n&&n.cult?(CULT.effectiveTechStage?CULT.effectiveTechStage(n):n.cult.stage):0,future=k&&n.cult&&effSt+1>=k.tier&&fit>=55;
 if(future&&wealth>45||fit>=65&&loyalty<45)return {action:'retain',reason:'เก็บไว้สำหรับขั้นถัดไป',fit};
 return {action:loyalty>35||(n.cp||0)<100?'donate':'retain',reason:fit<0?'ต่างสาย/เรียนซ้ำ':'สะสมแต้มแลกของจำเป็น',fit};
};
M.pickSubStudy=(W,n)=>(W.sect.subLibrary||[]).map(id=>({id,key:M.subKey(id)})).filter(x=>M.eligible(n,x.key).ok&&M.studyFee(W,x.key)<=(n.cp||0)&&subById[x.id].tier<=SECT.canLearnTier(W,n)).sort((a,b)=>M.knowledgeFit(n,b.key)-M.knowledgeFit(n,a.key)).find(x=>M.knowledgeFit(n,x.key)>=55)||null;
M.daily=W=>{
 M.ensure(W);
 for(const n of W.npcs){if(n.dead||n.away||n.exiled)continue;
  if(M.reconcileInnate)M.reconcileInnate(n,W);
  if(M.reconcilePassives)M.reconcilePassives(n);
  for(const key of Object.keys(n.inv.crystals)){const d=M.crystalDecision(W,n,key);if(d.action==='use')M.useCrystal(W,n,key);else if(d.action==='donate')M.donateCrystal(W,n,key);}
  for(const id of [...n.inv.subManuals]){const fit=M.knowledgeFit(n,M.subKey(id));if(fit<50||HC.eff(n,'personality.loyalty')>45||(n.cp||0)<100)M.donateManual(W,n,id,'sub');}
 }
};
const oldShop=CPE.shopItems;CPE.shopItems=W=>oldShop(W).concat(Object.entries(W.sect.crystals||{}).filter(x=>x[1]>0&&M.knowledge(x[0])).map(([key,n])=>({kind:'crystal',key,n,price:M.crystalPrice(W,key)})));
const oldBuy=CPE.buy;CPE.buy=(W,n,p)=>p&&p.kind==='crystal'?M.buyCrystal(W,n,p.key,p.price).ok:oldBuy(W,n,p);
const oldPick=CPE.pickPurchase;CPE.pickPurchase=(W,n)=>{let best=oldPick(W,n),score=best?best.s:0;for(const [key,qty] of Object.entries(W.sect.crystals||{})){if(!qty||!(M.canAcquireKnowledge?M.canAcquireKnowledge(W,n,key):M.eligible(n,key).ok)||(n.inv.crystals&&n.inv.crystals[key]||0)>0)continue;const price=M.crystalPrice(W,key),fit=M.knowledgeFit(n,key),s=.65+fit/110-price/Math.max(40,n.cp||0)*.5;if(price<=(n.cp||0)*.9&&fit>=50&&s>score){best={kind:'crystal',key,price,why:'ผลึกตรงวิถี · ใช้ครั้งเดียว',s};score=s;}}return best;};
const oldName=ECO.name;ECO.name=id=>M.knowledge(id)?M.crystalName(id):oldName(id);
AI.ACTS.specialize={nameTh:'ศึกษาคัมภีร์สายย่อย',icon:'📜',color:'#a7c8f0',can:(n,W)=>!!M.pickSubStudy(W,n),score(n,W,S){const p=M.pickSubStudy(W,n);if(p)S.add('เลือกสายที่ถนัดถาวร',.9+M.knowledgeFit(n,p.key)/150);},where:(W,n)=>{const st=AI.freeStation(W,n,'read','scripture');return st?{st}:null;},dur:()=>240,done(n,W){const p=M.pickSubStudy(W,n);if(p)M.studySubpath(W,n,p.id);}};
const daily=g.CONTENT.daily;g.CONTENT.daily=W=>{daily(W);M.daily(W);};
const handover=g.EXPED.handover;g.EXPED.handover=(W,ex,alive,out)=>{
 if(ex.martialSettled||(ex.settlement&&ex.settlement.state==='settled')||(out.settlement&&out.settlement.state==='settled'))return handover(W,ex,alive,out);
 const accepted=handover(W,ex,alive,out);
 if(alive&&alive.length&&out.knowledge&&out.knowledge.length){M.ensure(W);for(const drop of out.knowledge){const key=drop.kind==='subManual'?M.subKey(drop.id):drop.id;const eligible=alive.slice().sort((a,b)=>M.knowledgeFit(b,key)-M.knowledgeFit(a,key));const owner=eligible[0];if(drop.kind==='subManual'){if(!owner.inv.subManuals.includes(drop.id))owner.inv.subManuals.push(drop.id);}else if(M.knowledge(key))M.storeCrystal(W,owner,key,1);out.notes=out.notes||[];out.notes.push(owner.h.name.given+' พบ'+(drop.kind==='subManual'?'คัมภีร์สาย'+subById[drop.id].nameTh:M.crystalName(key)));}}
 ex.martialSettled=true;return accepted;
};
M.returnKnowledge=(W,n)=>{M.ensure(W);for(const [key,qty] of Object.entries(n.inv.crystals)){if(!M.knowledge(key))continue;const room=Math.max(0,999-(W.sect.crystals[key]||0)),put=Math.min(qty,room);W.sect.crystals[key]=(W.sect.crystals[key]||0)+put;if(qty>put){const overflow=W.sect.knowledgeOverflow||(W.sect.knowledgeOverflow={});overflow[key]=(overflow[key]||0)+qty-put;}}n.inv.crystals={};n.inv.crystalBought={};for(const id of n.inv.subManuals)if(!W.sect.subLibrary.includes(id))W.sect.subLibrary.push(id);n.inv.subManuals=[];};
M.restore=W=>{
 M.ensure(W);
 W.sect.library=Array.from(new Set((W.sect.library||[]).filter(id=>CULT.tech(id)&&!(M.isInnateTech&&M.isInnateTech(id)))));
 W.sect.crystals=cleanCounts(W.sect.crystals);
 W.sect.subLibrary=Array.from(new Set(W.sect.subLibrary.filter(id=>subById[id])));
 for(const n of W.npcs){
  n.inv.crystals=cleanCounts(n.inv.crystals);
  n.inv.subManuals=Array.from(new Set(n.inv.subManuals.filter(id=>subById[id])));
  if(Array.isArray(n.inv.techs))n.inv.techs=n.inv.techs.filter(id=>CULT.tech(id)&&!(M.isInnateTech&&M.isInnateTech(id)));
  if(n.cult){
   if(M.reconcileInnate)M.reconcileInnate(n,W);
   if(M.reconcilePassives)M.reconcilePassives(n);
  }
 }
};
})(typeof globalThis!=='undefined'?globalThis:this);
