/* Spendable contribution points, Sect Store (ร้านค้าสำนัก) vs Sect Treasury (คลังสำนัก),
   rational Tier/Color/Category pricing, Sect-Sponsored Alchemy/Forging, and Demand-Supply Economic Flywheel (v2.06).
   Physical custody remains in the native ledgers with zero thin-air item generation. */
(function(root){'use strict';
const E=root.World2026Engine,H=root.HumanCore;
const keys={EQUIPMENT:'equipmentItems',PILL:'pillStacks',SCROLL:'scrolls',MATERIAL:'materialStacks'};
const clone=x=>JSON.parse(JSON.stringify(x)),time=g=>Number(g.s.t)||0;
const tools=()=>root.JianghuStoryEvents.treasuryTools;

const FREE_SECT_RECIPES=[
 'L14_remedy','L14_qi','L14_clarity','L14_pure','L14_ironblade',
 'REC1100_SUPPORT_RECOVERY','REC1100_SUPPORT_QI','REC1100_SUPPORT_CLARITY','REC140_ALC_QI_DEW_1'
];
const FORTUITOUS_RECIPES=[
 'L14_ginseng','L14_lotus','L14_armor','L14_guard','L14_flame','L14_jade','L14_scholar'
];

const QUALITY_META={
 DAMAGED:     {mult:0.35,colorCode:'GRAY',  colorNameTh:'สีเทา (ชำรุด)',      colorHex:'#868e96'},
 POOR:        {mult:0.50,colorCode:'GRAY',  colorNameTh:'สีเทา (ด้อยคุณภาพ)',  colorHex:'#868e96'},
 CRUDE:       {mult:0.65,colorCode:'GRAY',  colorNameTh:'สีเทา (หยาบ)',       colorHex:'#adb5bd'},
 COMMON:      {mult:1.00,colorCode:'WHITE', colorNameTh:'สีขาว (สามัญ)',      colorHex:'#dee2e6'},
 STANDARD:    {mult:1.00,colorCode:'WHITE', colorNameTh:'สีขาว (ทั่วไป)',     colorHex:'#dee2e6'},
 NORMAL:      {mult:1.00,colorCode:'WHITE', colorNameTh:'สีขาว (ทั่วไป)',     colorHex:'#dee2e6'},
 MORTAL:      {mult:1.00,colorCode:'WHITE', colorNameTh:'สีขาว (สามัญ)',      colorHex:'#dee2e6'},
 GOOD:        {mult:1.25,colorCode:'GREEN', colorNameTh:'สีเขียว (ดี)',       colorHex:'#69db7c'},
 REFINED:     {mult:1.45,colorCode:'GREEN', colorNameTh:'สีเขียว (ปราณีต)',    colorHex:'#51cf66'},
 RARE:        {mult:1.60,colorCode:'BLUE',  colorNameTh:'สีฟ้า (หายาก)',      colorHex:'#4dabf7'},
 MYSTIC:      {mult:1.60,colorCode:'BLUE',  colorNameTh:'สีฟ้า (ลี้ลับ)',      colorHex:'#4dabf7'},
 SUPERIOR:    {mult:1.85,colorCode:'PURPLE',colorNameTh:'สีม่วง (ชั้นเลิศ)',   colorHex:'#b197fc'},
 EXCELLENT:   {mult:1.95,colorCode:'PURPLE',colorNameTh:'สีม่วง (ยอดเยี่ยม)',  colorHex:'#b197fc'},
 MASTERWORK:  {mult:2.00,colorCode:'PURPLE',colorNameTh:'สีม่วง (เอกอุ)',     colorHex:'#9775fa'},
 EPIC:        {mult:1.95,colorCode:'PURPLE',colorNameTh:'สีม่วง (มหากาพย์)',  colorHex:'#b197fc'},
 EARTH:       {mult:1.90,colorCode:'PURPLE',colorNameTh:'สีม่วง (ปฐพี)',      colorHex:'#b197fc'},
 PERFECT:     {mult:2.35,colorCode:'GOLD',  colorNameTh:'สีทอง (สมบูรณ์แบบ)',  colorHex:'#ffd43b'},
 HEAVEN:      {mult:2.40,colorCode:'GOLD',  colorNameTh:'สีทอง (สวรรค์)',     colorHex:'#ffd43b'},
 LEGENDARY:   {mult:2.65,colorCode:'ORANGE',colorNameTh:'สีส้ม (ตำนาน)',      colorHex:'#ff922b'},
 IMMORTAL:    {mult:2.75,colorCode:'ORANGE',colorNameTh:'สีส้ม (เซียน)',      colorHex:'#ff922b'},
 MYTHIC:      {mult:3.10,colorCode:'RED',   colorNameTh:'สีแดง (เทวตำนาน)',    colorHex:'#ff6b6b'},
 TRANSCENDENT:{mult:3.25,colorCode:'RED',   colorNameTh:'สีแดง (ข้ามภพ)',     colorHex:'#ff6b6b'}
};

const CATEGORY_NAMES={
 MATERIAL:'วัตถุดิบ',
 PILL:'โอสถสำเร็จรูป',
 SCROLL:'คัมภีร์ยุทธ์',
 EQUIPMENT:'ศาสตรา/อุปกรณ์'
};

if(H?.registerActivity){
 if(!H.activities?.sectCraft){
  H.registerActivity({
   ...H.descriptor('alchemy'),
   id:'sectCraft',
   label:'หลอมโอสถและศาสตราให้สำนัก',
   skillDomain:'alchemy',
   valueWeights:{sectDuty:.4,knowledgeCraft:.35,wealthResource:.25},
   personalityWeights:{discipline:.3,integrity:.25,creativity:.2}
  });
 }
 if(!H.activities?.sectShopBuy){
  H.registerActivity({
   ...H.descriptor('deposit'),
   id:'sectShopBuy',
   label:'ใช้แต้มซื้อสินค้าในร้านค้าสำนัก',
   skillDomain:'logistics',
   valueWeights:{martialPeak:.35,wealthResource:.35,sectDuty:.2},
   personalityWeights:{ambition:.25,caution:.25,rationality:.2}
  });
 }
 if(!H.activities?.sectGather){
  H.registerActivity({
   ...H.descriptor('herb'),
   id:'sectGather',
   label:'เก็บสมุนไพรและแร่เข้าคลังสำนักแลกแต้ม',
   skillDomain:'gathering',
   valueWeights:{sectDuty:.4,wealthResource:.35,familyClan:.2},
   personalityWeights:{discipline:.3,caution:.2,integrity:.2}
  });
 }
}

function state(g){
 const t=g.storyEvents.ensureState(true).treasury;
 const c=t.contributions||(t.contributions={version:2,accounts:{},history:[],storeCuratedAt:-1});
 if(!c.version||c.version<2)c.version=2;
 if(!Array.isArray(c.history))c.history=[];
 if(!c.accounts||typeof c.accounts!=='object')c.accounts={};
 return c;
}
function accountView(g,n){return g.s.storyEvents?.treasury?.contributions?.accounts?.[typeof n==='string'?n:n.id]||{balance:0,earned:0,spent:0,lastEmergencyAt:null};}
function account(g,n){
 const s=state(g),id=typeof n==='string'?n:n.id;
 return s.accounts[id]||(s.accounts[id]={balance:0,earned:0,spent:0,lastEmergencyAt:null});
}
function owned(n,item){
 return !!item&&!item.loan&&!item.loanedTo&&!item.loanedToNpcId&&item.rights!=='LOAN'&&item.canRedistribute!==false&&!item.reservedForFormation&&[item.ownerNpcId,item.ownerId].every(id=>!id||id===n.id);
}
function bankOwned(g,item){
 return !!item&&item.count!==0&&!item.loan&&!item.loanedTo&&!item.loanedToNpcId&&item.rights!=='LOAN'&&item.access!=='PRIVATE'&&item.canRedistribute!==false&&!item.reservedForFormation&&[item.ownerNpcId,item.ownerId].every(id=>!id||id===g.bank?.id);
}
let _matMap=null;
function matDef(id){
 if(!id)return null;
 if(!_matMap&&E?.PATCH140_DATA?.MATERIALS_REGISTRY_V140){
  _matMap=new Map(E.PATCH140_DATA.MATERIALS_REGISTRY_V140.map(d=>[d.id,d]));
 }
 return _matMap?_matMap.get(id):null;
}
function resolveRecipe(g,item){
 if(!item)return null;
 const recId=item.recipeId||item.catalogId;
 if(!recId)return null;
 return g?.progression?.recipe?.(recId)||(g?.recipes||[]).find(r=>r.id===recId)||g?.world?.jianghu?.systemsV140?.recipes?.registry?.[recId]||null;
}
function matRawBase(g,matId,fallbackTier=1){
 const def=matDef(matId);
 const tier=Math.max(1,Number(def?.tier||fallbackTier)||1);
 const stones=Number(def?.baseValueStones)||(tier*8);
 return Math.max(4,Math.min(tier*10,Math.round(stones*0.35)));
}
function colorMeta(g,kind,item){
 if(!item)return {tier:1,qualityKey:'COMMON',colorCode:'WHITE',colorNameTh:'สีขาว (สามัญ)',colorHex:'#dee2e6',categoryNameTh:CATEGORY_NAMES[kind]||kind,mult:1};
 const def=kind==='MATERIAL'?matDef(item.matId):null;
 const rec=(kind==='PILL'||kind==='EQUIPMENT')?resolveRecipe(g,item):null;
 const art=kind==='SCROLL'?g?.progression?.artMap?.get(item.artId):null;
 const tier=Math.max(1,Number(item.tier||rec?.tier||art?.tier||def?.tier)||1);
 const explicitQ=(item.quality&&!['STANDARD','COMMON','NORMAL'].includes(item.quality))?item.quality:(item.rarity||item.rarityGrade||item.quality||null);
 const fallbackByTier=tier>=6?'IMMORTAL':tier===5?'HEAVEN':tier===4?'EARTH':tier===3?'MYSTIC':tier===2?'REFINED':'COMMON';
 const qualityKey=(explicitQ&&QUALITY_META[explicitQ])?explicitQ:(item.quality&&QUALITY_META[item.quality]?item.quality:fallbackByTier);
 const qm=QUALITY_META[qualityKey]||QUALITY_META.COMMON;
 return {
  tier,
  qualityKey,
  colorCode:qm.colorCode,
  colorNameTh:qm.colorNameTh,
  colorHex:qm.colorHex,
  mult:qm.mult,
  categoryNameTh:CATEGORY_NAMES[kind]||kind
 };
}

/* Rational Pricing Model (v2.06):
   - Every Tier (1..7) and Color/Quality (Gray -> White -> Green -> Blue -> Purple -> Gold -> Orange -> Red) scales monotonically.
   - Strict Category Hierarchy at the same Tier & Color:
     MATERIAL (raw input) < PILL (crafted elixir) < SCROLL (scripture manual) < EQUIPMENT (crafted weapon/armor/talisman).
   - Every crafted item (PILL or EQUIPMENT) is strictly worth more than the sum of its recipe input materials + crafting labor.
   - Specifically: a Purple (SUPERIOR/EXCELLENT/MASTERWORK/EPIC/EARTH) raw material is always cheaper than a Purple finished crafted item of the same tier. */
function quote(g,kind,item,quantity=1){
 if(!item||!keys[kind])return {donation:0,redemption:0,storePrice:0,quantity:0};
 const def=kind==='MATERIAL'?matDef(item.matId):null;
 const rec=(kind==='PILL'||kind==='EQUIPMENT')?resolveRecipe(g,item):null;
 const art=kind==='SCROLL'?g?.progression?.artMap?.get(item.artId):null;
 const tier=Math.max(1,Number(item.tier||rec?.tier||art?.tier||def?.tier)||1);
 const qKey=(item.quality&&!['STANDARD','COMMON','NORMAL'].includes(item.quality))?item.quality:(item.rarity||item.rarityGrade||item.quality||'COMMON');
 const qm=QUALITY_META[qKey]||QUALITY_META.COMMON;
 const condition=kind==='EQUIPMENT'?Math.max(0,Math.min(1,Number(item.durability??100)/Math.max(1,Number(item.maxDurability)||100))):1;

 let base=4;
 const useRecInputs=rec?.inputs?.length&&(!item.tier||Number(item.tier)===Number(rec.tier));
 if(kind==='MATERIAL'){
  base= (!item.tier||!def||Number(item.tier)===Number(def.tier))
   ? matRawBase(g,item.matId,tier)
   : Math.max(4,Math.round(6*Math.pow(tier,1.45)));
 }else if(kind==='PILL'){
  const inputBase=useRecInputs?rec.inputs.reduce((s,i)=>s+matRawBase(g,i.matId,tier)*(i.count||1),0):Math.round(9*Math.pow(tier,1.45));
  base=Math.max(Math.round(16*Math.pow(tier,1.55)),Math.round(inputBase*1.35+tier*5));
 }else if(kind==='SCROLL'){
  base=Math.round(26*Math.pow(tier,1.6));
 }else if(kind==='EQUIPMENT'){
  const inputBase=useRecInputs?rec.inputs.reduce((s,i)=>s+matRawBase(g,i.matId,tier)*(i.count||1),0):Math.round(14*Math.pow(tier,1.5));
  base=Math.max(Math.round(34*Math.pow(tier,1.65)),Math.round(inputBase*1.55+tier*10));
 }

 const unit=Math.max(1,Math.floor(base*qm.mult*condition*(item.isTranscendent?1.2:1)));
 const unitRedemption=Math.ceil(unit*1.35)+1;
 const qty=Math.max(1,Math.floor(Number(quantity)||1));
 return {
  donation:item.contributionCreditAllowed===false?0:unit*qty,
  redemption:unitRedemption*qty,
  storePrice:unitRedemption*qty,
  quantity:qty,
  unitDonation:unit,
  unitRedemption,
  tier,
  colorCode:qm.colorCode,
  colorNameTh:qm.colorNameTh,
  colorHex:qm.colorHex,
  categoryNameTh:CATEGORY_NAMES[kind]||kind
 };
}

function ensureBasicSectRecipes(g,targetNpc=null){
 if(!g)return;
 const list=targetNpc?[targetNpc]:(g.heroes||[]);
 for(const n of list){
  if(!n?.alive||!n.stageLocal?.growth)continue;
  const kr=n.stageLocal.growth.knownRecipes||(n.stageLocal.growth.knownRecipes=[]);
  for(const id of ['L14_remedy','L14_qi','L14_clarity','L14_pure','L14_ironblade']){
   if(!kr.includes(id))kr.push(id);
  }
  g.teachPublicRecipes?.(n);
 }
}

function tryFortuitousRecipeDiscovery(g,n,sourceLabelTh='วาสนาในหุบเขา'){
 if(!g?.s?.storyEvents?.active||!n?.alive||!n.stageLocal?.growth)return null;
 const kr=n.stageLocal.growth.knownRecipes||(n.stageLocal.growth.knownRecipes=[]);
 const candidates=FORTUITOUS_RECIPES.map(id=>g.progression?.recipe?.(id)).filter(r=>r&&!kr.includes(r.id)&&r.tier<=Math.max(2,Math.ceil(g.progression.tier(n))+1));
 if(!candidates.length)return null;
 let h=2166136261^((Number(g.s.seed)||8821)+Math.round(time(g)*10));
 for(const ch of (String(n.id)+":"+String(sourceLabelTh))){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}
 const roll=((h>>>0)%10000)/10000;
 const chance=0.25+Math.min(0.20,((n.personality?.curiosity||50)-50)*0.002+((n.jianghu?.fortuneKarmaV113||0)*0.004));
 if(roll>=chance)return null;
 const preferred=candidates.filter(r=>r.workshop===n.stageLocal.growth.career);
 const pool=preferred.length?preferred:candidates;
 const chosen=pool[(h>>>8)%pool.length]||pool[0];
 if(!chosen)return null;
 kr.push(chosen.id);
 g.progression?.receipt?.('fortuitousRecipe',n,{recipeId:chosen.id,recipeNameTh:chosen.name,sourceLabelTh});
 g.note(`✨ วาสนาตำรับลับ: ${n.name} ได้พบเคล็ดตำรับ «${chosen.name}» จาก${sourceLabelTh}!`,n);
 return chosen;
}

function reserve(g,n,matId){
 let keep=Math.max([root.FrontierData.HERB,root.FrontierData.ORE].includes(matId)?1:0,g.progression.reserve(n,matId)||0);
 const a=g.s.storyEvents?.sidequests?.active,d=root.JianghuSideQuests?.catalog?.find(x=>x.id===a?.questId);
 if(d?.kind==='DELIVERY'&&d.matId===matId)keep=Math.max(keep,d.quantity);
 if(d?.kind==='CRAFT')for(const r of g.progression.allRecipes())if(n.stageLocal.growth?.knownRecipes?.includes(r.id)&&g.built(r.workshop))keep=Math.max(keep,r.inputs.find(i=>i.matId===matId)?.count||0);
 return keep;
}
function log(g,n,kind,item,quantity,points,extra={}){
 const s=state(g);
 s.history.unshift({
  id:'contrib_'+g.s.nextId++,
  t:time(g),
  npcId:n?.id||null,
  npcName:n?.name||'สำนัก',
  kind,
  itemName:item?.nameTh||item?.name||item?.matId||item?.id||'พัสดุสำนัก',
  quantity,
  points,
  ...extra
 });
 s.history.splice(120);
}

/* ============================================================================
   SECT TREASURY (คลังสำนัก) vs SECT STORE (ร้านค้าสำนัก) COMPARTMENTS
   - Items brought from outside or crafted for the sect enter the Sect Treasury first.
   - The Treasury Elder / Sect Master curates items onto the Sect Store shelves
     while keeping basic welfare reserves and raw material crafting reserves in the Treasury.
   ============================================================================ */
function storeCountOf(kind,item){
 if(!item)return 0;
 if(kind==='EQUIPMENT'||kind==='SCROLL')return item.sectStore?1:0;
 const total=Math.max(0,Number(item.count)||0);
 if(Number.isFinite(item.storeCount))return Math.max(0,Math.min(total,Math.floor(item.storeCount)));
 return item.sectStore?total:0;
}
function treasuryCountOf(kind,item){
 if(!item)return 0;
 if(kind==='EQUIPMENT'||kind==='SCROLL')return item.sectStore?0:1;
 const total=Math.max(0,Number(item.count)||0);
 return Math.max(0,total-storeCountOf(kind,item));
}
// Sect-sponsored workshops must not silently consume items already on the store shelves.
// Count only unlisted, sect-owned material units; the native g.count() includes both compartments.
function treasuryMaterialAvailable(g,matId){
 return (g.bank?.jianghu?.ledgerV140?.materialStacks||[])
  .filter(s=>s.matId===matId&&bankOwned(g,s))
  .reduce((total,s)=>total+treasuryCountOf('MATERIAL',s),0);
}

function curateStore(g,actorNpc=null){
 if(!g?.bank?.jianghu?.ledgerV140)return {ok:false,movedCount:0,reason:'ไม่พบสมุดบัญชีคลังสำนัก'};
 const auths=g.storyEvents?.authorities?.()||[];
 const curator=actorNpc?auths.find(x=>x.npc.id===actorNpc.id)?.npc:auths[0]?.npc;
 if(!curator)return {ok:false,movedCount:0,reason:'ต้องมีเจ้าสำนักหรือผู้อาวุโสฝ่ายคลังที่พร้อมจัดสินค้า'};
 const curatorName=curator?.name||'ผู้อาวุโสฝ่ายคลัง';
 const b=g.bank.jianghu.ledgerV140;
 let movedCount=0;

 // 1. Equipment: Keep 1 ordinary Tier-1 per slot in Treasury for emergency welfare GRANT; put everything else in Sect Store
 const welfareSlotKept={WEAPON:false,ARMOR:false,TALISMAN_VESSEL:false};
 for(const eq of (b.equipmentItems||[])){
  if(!bankOwned(g,eq)||(eq.durability!==undefined&&eq.durability<=0))continue;
  const basicOk=grantEligibility(g,'EQUIPMENT',eq,1).ok;
  const slot=eq.slot||'WEAPON';
  if(basicOk&&!welfareSlotKept[slot]){
   welfareSlotKept[slot]=true;
   if(eq.sectStore){eq.sectStore=false;delete eq.storeCount;}
  }else if(!eq.sectStore){
   eq.sectStore=true;
   eq.curatedByNpcId=curator?.id||null;
   eq.curatedByNameTh=curatorName;
   eq.curatedAt=time(g);
   movedCount++;
  }
 }

 // 2. Scrolls: All owned scrolls in bank go to the Sect Store to be redeemed with Contribution Points
 for(const sc of (b.scrolls||[])){
  if(!bankOwned(g,sc)||!g.progression?.artMap?.has(sc.artId))continue;
  if(!sc.sectStore){
   sc.sectStore=true;
   sc.curatedByNpcId=curator?.id||null;
   sc.curatedByNameTh=curatorName;
   sc.curatedAt=time(g);
   movedCount++;
  }
 }

 const pillReserve=new Map();
 for(const p of b.pillStacks||[]){if(bankOwned(g,p)&&grantEligibility(g,'PILL',p,1).ok){const k=p.recipeId||p.nameTh;const total=(b.pillStacks||[]).filter(x=>bankOwned(g,x)&&(x.recipeId||x.nameTh)===k&&grantEligibility(g,'PILL',x,1).ok).reduce((sum,x)=>sum+x.count,0);pillReserve.set(k,total>1?Math.min(2,total-1):total);}}
 // 3. Pills: Non-grant pills go 100% to Store; basic recovery pills keep up to 2 doses in Treasury for free GRANT and put surplus in Store
 for(const p of (b.pillStacks||[])){
  if(!bankOwned(g,p)||(p.count||0)<=0)continue;
  const basicOk=grantEligibility(g,'PILL',p,1).ok;
  const prevStore=storeCountOf('PILL',p);
  let targetStore=0;
  if(!basicOk){
   targetStore=p.count;
  }else{
   const k=p.recipeId||p.nameTh,keep=Math.min(p.count,pillReserve.get(k)||0);
   pillReserve.set(k,(pillReserve.get(k)||0)-keep);targetStore=p.count-keep;
  }
  p.storeCount=targetStore;
  p.sectStore=targetStore>0;
  if(targetStore>prevStore){
   p.curatedByNpcId=curator?.id||null;
   p.curatedByNameTh=curatorName;
   p.curatedAt=time(g);
   movedCount+=(targetStore-prevStore);
  }
 }

 const materialReserve=new Map();
 // A single rare ingredient should not be auto-shelved if a sect member already
 // knows a recipe that needs it. Keep at least one complete recipe input batch.
 const knownForSect=new Set([...FREE_SECT_RECIPES,...(g.heroes||[]).filter(n=>n.alive).flatMap(n=>n.stageLocal?.growth?.knownRecipes||[])]);
 const recipeMaterialNeeds=new Map();
 for(const r of g.progression?.allRecipes?.()||[]){
  if(!knownForSect.has(r.id)||!['alchemy','forge'].includes(r.workshop)||!g.built(r.workshop)||r.effect?.beastItem)continue;
  for(const inp of r.inputs||[])recipeMaterialNeeds.set(inp.matId,Math.max(recipeMaterialNeeds.get(inp.matId)||0,inp.count));
 }
 // 4. Materials: Keep raw material reserve in Treasury for Sect-Sponsored Alchemy/Forging (sectCraft) and put surplus on Sect Store
 for(const m of (b.materialStacks||[])){
  if(!bankOwned(g,m)||(m.count||0)<=0)continue;
  if(!m.id)m.id='economic_mat_'+g.s.nextId++;
  const def=matDef(m.matId);
  const tier=Number(def?.tier||m.tier)||1;
  const ordinary=['COMMON','STANDARD','GOOD'].includes(m.quality||'STANDARD');
  const prevStore=storeCountOf('MATERIAL',m);
  const recipeNeed=recipeMaterialNeeds.get(m.matId)||0;
  const treasuryReserve=Math.max((tier===1&&ordinary)?6:2,recipeNeed);
  const reserveKey=m.matId+':'+(ordinary?'BASIC':'SPECIAL');
  const budget=materialReserve.has(reserveKey)?materialReserve.get(reserveKey):treasuryReserve;
  let keep=Math.min(budget,m.count);
  if(tier>=3||!ordinary)keep=Math.min(keep,Math.max(Math.min(m.count,recipeNeed),Math.max(0,m.count-1)));
  materialReserve.set(reserveKey,budget-keep);
  const targetStore=m.count-keep;
  m.storeCount=targetStore;
  m.sectStore=targetStore>0;
  if(targetStore>prevStore){
   m.curatedByNpcId=curator?.id||null;
   m.curatedByNameTh=curatorName;
   m.curatedAt=time(g);
   movedCount+=(targetStore-prevStore);
  }
 }

 state(g).storeCuratedAt=time(g);invalidateMarketCache(g);
 return {ok:true,movedCount,curatorName,reason:movedCount>0?`${curatorName} คัดแยกพัสดุจากคลังสำนักขึ้นวางขายที่ร้านค้าสำนัก +${movedCount} รายการ`:`${curatorName} ตรวจสอบสต็อกคลังและร้านค้าสำนักเรียบร้อยแล้ว`};
}

function transferToStore(g,kind,id,quantity=1){
 if(!keys[kind]||!g?.bank?.jianghu?.ledgerV140)return {ok:false,reason:'ประเภทพัสดุไม่ถูกต้อง'};
 const list=g.bank.jianghu.ledgerV140[keys[kind]]||[];
 const item=list.find(x=>(x.id===id||(kind==='MATERIAL'&&x.matId===id))&&bankOwned(g,x));
 if(!item)return {ok:false,reason:'ไม่พบพัสดุในคลังสำนัก'};
 const avail=treasuryCountOf(kind,item);
 if(avail<=0)return {ok:false,reason:'พัสดุชิ้นนี้อยู่ในร้านค้าสำนักทั้งหมดแล้ว'};
 const move=kind==='EQUIPMENT'||kind==='SCROLL'?1:Math.min(avail,Math.max(1,Math.floor(Number(quantity)||1)));
 if(kind==='EQUIPMENT'||kind==='SCROLL'){
  item.sectStore=true;
 }else{
  item.storeCount=storeCountOf(kind,item)+move;
  item.sectStore=item.storeCount>0;
 }
 item.curatedAt=time(g);invalidateMarketCache(g);
 return {ok:true,moved:move,reason:`ย้าย «${item.nameTh||item.matId||item.id}» ×${move} จากคลังสำนักขึ้นร้านค้าสำนักแล้ว`};
}

function returnToTreasury(g,kind,id,quantity=1){
 if(!keys[kind]||!g?.bank?.jianghu?.ledgerV140)return {ok:false,reason:'ประเภทพัสดุไม่ถูกต้อง'};
 const list=g.bank.jianghu.ledgerV140[keys[kind]]||[];
 const item=list.find(x=>(x.id===id||(kind==='MATERIAL'&&x.matId===id))&&bankOwned(g,x));
 if(!item)return {ok:false,reason:'ไม่พบพัสดุในร้านค้าสำนัก'};
 const avail=storeCountOf(kind,item);
 if(avail<=0)return {ok:false,reason:'พัสดุชิ้นนี้อยู่ในคลังสำนักอยู่แล้ว'};
 const move=kind==='EQUIPMENT'||kind==='SCROLL'?1:Math.min(avail,Math.max(1,Math.floor(Number(quantity)||1)));
 if(kind==='EQUIPMENT'||kind==='SCROLL'){
  item.sectStore=false;
 }else{
  item.storeCount=Math.max(0,avail-move);
  item.sectStore=item.storeCount>0;
 }
 invalidateMarketCache(g);return {ok:true,moved:move,reason:`ย้าย «${item.nameTh||item.matId||item.id}» ×${move} กลับเข้าคลังสำนักแล้ว`};
}

function enrichItemView(g,kind,item,countOverride){
 const qty=countOverride??(kind==='EQUIPMENT'||kind==='SCROLL'?1:(item.count||1));
 const q=quote(g,kind,item,1);
 const def=kind==='MATERIAL'?matDef(item.matId):null;
 const art=kind==='SCROLL'?g.progression?.artMap?.get(item.artId):null;
 return {
  kind,
  id:item.id||item.matId,
  stackId:item.id||item.matId,
  nameTh:item.nameTh||art?.nameTh||def?.nameTh||item.matId||item.id,
  count:qty,
  totalBankCount:kind==='EQUIPMENT'||kind==='SCROLL'?1:(item.count||1),
  storeCount:storeCountOf(kind,item),
  treasuryCount:treasuryCountOf(kind,item),
  tier:q.tier,
  quality:item.quality||'STANDARD',
  colorCode:q.colorCode,
  colorNameTh:q.colorNameTh,
  colorHex:q.colorHex,
  categoryNameTh:q.categoryNameTh,
  unitDonation:q.unitDonation,
  unitStorePrice:q.unitRedemption,
  storePrice:q.unitRedemption,
  grantEligible:grantEligibility(g,kind,item,1).ok,
  makerNameTh:item.makerNameTh||null,
  suppliedByNameTh:item.suppliedByNameTh||item.makerNameTh||item.originatorNameTh||'คลังบุกเบิกสำนัก',
  curatedByNameTh:item.curatedByNameTh||null,
  provenanceMode:item.provenanceMode||(item.makerNameTh?'SECT_WORKSHOP_CRAFT':'GATHER_OR_DONATION'),
  originLabelTh:item.originLabelTh||def?.nameTh||'พัสดุสำนัก',
  slot:item.slot||null,
  recipeId:item.recipeId||null,
  artId:item.artId||null,
  raw:item
 };
}

const marketCache=new WeakMap();
function invalidateMarketCache(g){if(g)marketCache.delete(g);}
function bankSig(g){
 const b=g?.bank?.jianghu?.ledgerV140;if(!b)return '';
 return Object.entries(keys).map(([kind,key])=>kind+':'+(b[key]||[]).map(x=>[x.id,x.matId,x.artId,x.recipeId,x.count,x.storeCount,x.sectStore,x.quality,x.tier,x.durability,x.ownerNpcId,x.ownerId,x.rights,x.access,!!x.loan,x.contributionCreditAllowed,x.suppliedByNpcId].join(',')).join('|')).join(';');
}
function getCachedMarket(g){
 if(!g)return null;
 const sig=bankSig(g),hit=marketCache.get(g);
 if(hit&&hit.sig===sig)return hit;
 const store=storeInventoryRaw(g);
 const treasury=treasuryInventoryRaw(g);
 const flywheel=computeMarketFlywheelRaw(g,store,treasury);
 const entry={sig,store,treasury,flywheel};
 marketCache.set(g,entry);
 return entry;
}

function storeInventory(g){return getCachedMarket(g)?.store||storeInventoryRaw(g);}
function storeInventoryRaw(g){
 const b=g?.bank?.jianghu?.ledgerV140||{};
 const equipment=(b.equipmentItems||[]).filter(i=>bankOwned(g,i)&&(i.durability===undefined||i.durability>0)&&storeCountOf('EQUIPMENT',i)>0).map(i=>enrichItemView(g,'EQUIPMENT',i,1));
 const pills=(b.pillStacks||[]).filter(p=>bankOwned(g,p)&&storeCountOf('PILL',p)>0).map(p=>enrichItemView(g,'PILL',p,storeCountOf('PILL',p)));
 const scrolls=(b.scrolls||[]).filter(s=>bankOwned(g,s)&&g.progression?.artMap?.has(s.artId)&&storeCountOf('SCROLL',s)>0).map(s=>enrichItemView(g,'SCROLL',s,1));
 const materials=(b.materialStacks||[]).filter(m=>bankOwned(g,m)&&storeCountOf('MATERIAL',m)>0).map(m=>enrichItemView(g,'MATERIAL',m,storeCountOf('MATERIAL',m)));
 return {
  equipment,
  pills,
  scrolls,
  materials,
  all:[...pills,...equipment,...scrolls,...materials]
 };
}

function treasuryInventory(g){return getCachedMarket(g)?.treasury||treasuryInventoryRaw(g);}
function treasuryInventoryRaw(g){
 const b=g?.bank?.jianghu?.ledgerV140||{};
 const equipment=(b.equipmentItems||[]).filter(i=>bankOwned(g,i)&&(i.durability===undefined||i.durability>0)&&treasuryCountOf('EQUIPMENT',i)>0).map(i=>enrichItemView(g,'EQUIPMENT',i,1));
 const pills=(b.pillStacks||[]).filter(p=>bankOwned(g,p)&&treasuryCountOf('PILL',p)>0).map(p=>enrichItemView(g,'PILL',p,treasuryCountOf('PILL',p)));
 const scrolls=(b.scrolls||[]).filter(s=>bankOwned(g,s)&&g.progression?.artMap?.has(s.artId)&&treasuryCountOf('SCROLL',s)>0).map(s=>enrichItemView(g,'SCROLL',s,1));
 const materials=(b.materialStacks||[]).filter(m=>bankOwned(g,m)&&treasuryCountOf('MATERIAL',m)>0).map(m=>enrichItemView(g,'MATERIAL',m,treasuryCountOf('MATERIAL',m)));
 return {
  equipment,
  pills,
  scrolls,
  materials,
  all:[...pills,...equipment,...scrolls,...materials]
 };
}

/* ============================================================================
   DEMAND & SUPPLY ECONOMIC FLYWHEEL (วงล้อเศรษฐกิจร้านค้าสำนัก)
   - More good items in the Sect Store -> higher Store Prestige & Market Heat ->
     more disciples covet items (wantedBy) -> stronger motivation to work/hunt/gather/craft for points!
   - Scarce items that disciples need -> higher Category Supply Bonus (+10%..+35% bonus points) ->
     motivates disciples to gather herbs, craft pills/weapons, or donate surplus!
   - When an item sells in the Sect Store, its original supplier/maker earns a +12% Creator Royalty!
   ============================================================================ */
function computeMarketFlywheel(g){return getCachedMarket(g)?.flywheel||computeMarketFlywheelRaw(g,storeInventoryRaw(g),treasuryInventoryRaw(g));}
function computeMarketFlywheelRaw(g,store,treasury){
 const heroes=(g?.heroes||[]).filter(h=>h?.alive&&h.health>0);
 const wantedMap=new Map();
 let activeShoppers=0,hungryForPoints=0;
 let needPills=0,needEquipment=0,needScrolls=0,needMaterials=0;

 for(const h of heroes){
  const j=h.jianghu||{},l=j.ledgerV140||{};
  const healPills=(l.pillStacks||[]).filter(p=>p.count>0&&g.progression?.normalizePill?.(p)?.healHealth>0).reduce((s,p)=>s+p.count,0);
  if(h.health<85||healPills<2||(j.cultivationProgress||0)>=40)needPills++;
  if(['WEAPON','ARMOR','TALISMAN_VESSEL'].some(sl=>!j.equipmentV140?.[sl]))needEquipment++;
  if((g.progression?.inspectSlotAndComboState?.(h)?.openAttackSlots||0)>0)needScrolls++;
  const wish=h.stageLocal?.storeWish;
  if(wish){
   activeShoppers++;
   if(wish.deficit>0)hungryForPoints++;
   const k=wish.kind+':'+wish.id;
   const arr=wantedMap.get(k)||[];
   arr.push({npcId:h.id,name:h.name,urgency:wish.urgency,canAfford:wish.canAfford,deficit:wish.deficit});
   wantedMap.set(k,arr);
  }
 }

 for(const item of store.all){
  const w=wantedMap.get(item.kind+':'+item.id)||[];
  item.wantedBy=w;
  item.demandCount=w.length;
 }

 const basicHerbs=g?.count?.(g.bank,root.FrontierData?.HERB||'MAT_HERB_DEW_GRASS_1')||0;
 const basicOres=g?.count?.(g.bank,root.FrontierData?.ORE||'MAT_ORE_BLACK_IRON_1')||0;
 if(basicHerbs<8||basicOres<8)needMaterials=Math.max(2,heroes.length);

 const totalStorePills=store.pills.reduce((s,p)=>s+p.count,0)+treasury.pills.reduce((s,p)=>s+p.count,0);
 const pillBonusPct=totalStorePills<4?30:totalStorePills<8?18:needPills>=3?12:5;
 const eqBonusPct=store.equipment.length<2?25:needEquipment>=2?15:5;
 const scrollBonusPct=store.scrolls.length<2?25:needScrolls>=2?15:5;
 const matBonusPct=basicHerbs<6?30:basicHerbs<12?18:5;

 const highGradeStoreCount=store.all.filter(x=>x.tier>=2||!['WHITE','GRAY'].includes(x.colorCode)).length;
 const marketHeat=Math.min(100,Math.round(
  20+store.all.length*6+highGradeStoreCount*9+activeShoppers*11+hungryForPoints*7
 ));

 const supplyBounties=[
  {kind:'PILL',labelTh:'โอสถฟื้นฟูและบำรุงปราณ',bonusPct:pillBonusPct,reasonTh:totalStorePills<6?'สต็อกโอสถในคลังและร้านค้าเหลือน้อย ศิษย์ต้องการใช้ประจำวัน':'มีความต้องการโอสถสำรองออกศึก'},
  {kind:'MATERIAL',labelTh:'สมุนไพรหุบเขาและแร่ปราณ',bonusPct:matBonusPct,reasonTh:basicHerbs<8?'โรงหลอมโอสถต้องการสมุนไพรสดมาป้อนเตาหลอม':'สะสมวัตถุดิบสำรองสำหรับโรงหลอมสำนัก'},
  {kind:'EQUIPMENT',labelTh:'ศาสตราและเกราะยุทธ์',bonusPct:eqBonusPct,reasonTh:store.equipment.length<2?'ชั้นวางศาสตราในร้านค้ายังขาดแคลนของดี':'ศิษย์กำลังมองหาอุปกรณ์ยกระดับพลังรบ'},
  {kind:'SCROLL',labelTh:'คัมภีร์วิชายุทธ์',bonusPct:scrollBonusPct,reasonTh:'คัมภีร์ในร้านค้าช่วยดึงดูดให้ศิษย์ขยันหาแต้มคุณูปการ'}
 ].sort((a,b)=>b.bonusPct-a.bonusPct);

 return {
  marketHeat,
  marketHeatLabelTh:marketHeat>=75?'🔥 คึกคักสูงสุด (สินค้าดีดึงดูดศิษย์ทั่วสำนัก)':marketHeat>=45?'⚖️ หมุนเวียนสมดุล (มีผู้ผลิตและผู้ซื้อต่อเนื่อง)':'🌱 เริ่มต้นสะสมสินค้าเข้าร้านค้าสำนัก',
  activeShoppers,
  hungryForPoints,
  highGradeStoreCount,
  bonusByCategory:{PILL:pillBonusPct,MATERIAL:matBonusPct,EQUIPMENT:eqBonusPct,SCROLL:scrollBonusPct},
  supplyBounties
 };
}

function donate(g,n,kind,id,quantity=1,opts={}){
 const fail=reason=>({ok:false,reason});
 if(!Number.isInteger(quantity)||quantity<=0)return fail('จำนวนบริจาคต้องเป็นจำนวนเต็มบวก');
 if(!keys[kind]||!tools().memberAvailable(g,n))return fail('ผู้บริจาคต้องเป็นศิษย์ที่อยู่ในสำนักและพร้อมส่งมอบ');
 const l=n.jianghu.ledgerV140,b=g.bank.jianghu.ledgerV140,key=keys[kind],items=l[key]||[];
 let item=items.find(x=>(kind==='MATERIAL'?x.matId:x.id)===id&&owned(n,x)&&(x.count??1)>0);
 if(!item)return fail('ไม่พบของที่เป็นสิทธิ์ของผู้บริจาค หรือพัสดุติดสิทธิ์ยืม');
 if(kind==='EQUIPMENT'&&(Object.values(n.jianghu.equipmentV140||{}).includes(item.id)||Number(item.durability??100)<=0))return fail('ต้องเก็บของที่กำลังสวมใส่ไว้ และซ่อมของพังก่อนส่งมอบ');
 let qty=kind==='EQUIPMENT'||kind==='SCROLL'?1:Math.max(1,Math.floor(Number(quantity)||1));
 let pts=0,moved=0,demandBonus=0;
 if(kind==='MATERIAL'){
  const candidates=items.filter(x=>x.matId===id&&owned(n,x)&&x.count>0),all=candidates.reduce((s,x)=>s+x.count,0);
  const keep=opts.keepOverride!==undefined?Math.max(1,opts.keepOverride):reserve(g,n,id);
  qty=Math.min(qty,Math.max(0,all-keep));if(!qty)return fail('ต้องเก็บวัตถุดิบที่จำเป็นต่อการฝึก งานผลิต หรือสัญญารองไว้ก่อน');
  for(const x of candidates){const amount=Math.min(qty-moved,x.count);if(amount<=0)break;
   const q=supplyQuote(g,kind,x,amount,opts.applyMarketBonus!==false);
   const r=depositMaterialLot(g,g.bank,id,amount,clone(x),{suppliedByNpcId:n.id,suppliedByNameTh:n.name,suppliedAt:time(g),provenanceMode:'GATHER_DEPOSIT'});
   if(!r.ok)break;
   pts+=q.donation;demandBonus+=q.demandBonus;x.count-=amount;moved+=amount;
  }
  l[key]=items.filter(x=>x.count>0);
 }else{
  const cap=kind==='EQUIPMENT'?240:kind==='PILL'?128:240;
  if((b[key]||[]).length>=cap)return fail('คลังสำนักเต็ม จึงยังไม่รับของและไม่เพิ่มแต้ม');
  if(kind==='SCROLL'&&!g.progression.artMap.has(item.artId))return fail('ไม่พบวิชาของคัมภีร์นี้');
  if(kind==='PILL')qty=Math.min(qty,item.count);
  const dq=supplyQuote(g,kind,item,qty,opts.applyMarketBonus!==false);
  const sent=kind==='PILL'&&qty<item.count?{...clone(item),id:'donation_pill_'+g.s.nextId++,count:qty}:item;
  if(sent===item)items.splice(items.indexOf(item),1);else item.count-=qty;
  sent.ownerNpcId=g.bank.id;if('ownerId'in sent)sent.ownerId=g.bank.id;if('custodianNpcId'in sent)sent.custodianNpcId=g.bank.id;
  sent.sectStore=false;sent.storeCount=0;
  sent.suppliedByNpcId=n.id;sent.suppliedByNameTh=n.name;sent.suppliedAt=time(g);
  sent.provenanceMode=sent.makerNameTh===n.name?'PERSONAL_CRAFT_DONATION':'PERSONAL_DONATION';
  if(kind==='SCROLL'){sent.access='SECT';sent.rights='OWNER';g.discovery?.onTransfer(sent,n,g.bank,'DONATION');}
  (b[key]||(b[key]=[])).push(sent);pts=dq.donation;demandBonus=dq.demandBonus;moved=qty;
 }
 if(!moved)return fail('คลังสำนักไม่มีพื้นที่รับพัสดุนี้');
 const a=account(g,n);a.balance+=pts;a.earned+=pts;
 E.syncLegacyArraysFromLedgerV140(n);E.syncLegacyArraysFromLedgerV140(g.bank);E.invalidateNpcCoreCache(n);
 g.life.credit(n,Math.min(3,pts/20),'บริจาคพัสดุที่เป็นสิทธิ์ของตนให้สำนัก');
 invalidateMarketCache(g);log(g,n,'DONATE',item,moved,pts,{compartment:'TREASURY',demandBonus});
 g.note(n.name+' มอบ '+(item.nameTh||item.matId)+' ×'+moved+' เข้าคลังสำนัก · ได้แต้มคุณูปการ +'+pts+(demandBonus?` (รวมโบนัสความต้องการตลาด +${demandBonus})`:''),n);
 return {ok:true,quantity:moved,points:pts,demandBonus,compartment:'TREASURY',reason:'ส่งมอบของจริงเข้าคลังสำนักและเพิ่มแต้มคุณูปการแล้ว'};
}

function creditLibraryDonation(g,n,book){
 if(!g.s.heroIds.includes(n?.id)||!g.s.growth.scriptureLibrary.includes(book)||book.donatedByNpcId!==n.id||!book.originalItemId||book.contributionCredited)return {ok:false};
 const pts=quote(g,'SCROLL',book).donation,a=account(g,n);book.contributionCredited=true;a.balance+=pts;a.earned+=pts;log(g,n,'DONATE',book,1,pts,{destination:'SCRIPTURE_LIBRARY'});return {ok:true,points:pts};
}

function grantEligibility(g,kind,item,quantity=1){
 const def=kind==='MATERIAL'?matDef(item.matId):null;
 const rec=(kind==='PILL'||kind==='EQUIPMENT')?resolveRecipe(g,item):null;
 const tier=Number(item.tier||def?.tier||rec?.tier)||1;
 const ordinary=['COMMON','STANDARD','GOOD','DAMAGED'].includes(item.quality||'STANDARD');
 const rare=item.isTranscendent||['RARE','EPIC','LEGENDARY','MYTHIC','TRANSCENDENT'].includes(item.rarity||'COMMON');
 let allowed=false;
 if(ordinary&&!rare&&kind==='MATERIAL')allowed=tier===1&&/^MAT_(HERB|ORE)_/.test(item.matId||'')&&quantity<=2;
 if(ordinary&&!rare&&kind==='EQUIPMENT')allowed=tier===1;
 if(ordinary&&!rare&&kind==='PILL'){
  const e=g.progression.normalizePill(item);
  const recovery=['healHealth','restoreQi','clearPoison','griefRelief','toxicityRelief','healInjury'].some(k=>e[k]>0);
  const advancement=['cultivationProgress','foundationBonus','daoComprehensionBonus','lifespanBonus','tribulationResist','openMeridianBonus'].some(k=>e[k]>0);
  allowed=tier<=2&&recovery&&!advancement;
 }
 return {ok:allowed,reason:allowed?'ของใช้พื้นฐานที่ผู้มีอำนาจพิจารณาแจกฟรีจากคลังสำนักได้':'ของหายาก คุณภาพสูง คัมภีร์ และอุปกรณ์ขั้นสูงสงวนไว้ซื้อด้วยแต้มที่ร้านค้าสำนัก'};
}

// Resolve physical lots before pricing. Shop purchases cannot reach welfare reserves.
function prepareStock(g,req,source,n){
 const kind=req.itemKind,shop=!!req.shopPurchase,grant=req.mode!=='REDEEM';
 let qty=req.quantity??(kind==='MATERIAL'?Math.min(2,Math.max(0,H.carryLimit(n)-H.load(n))):1);
 if(!Number.isInteger(qty)||qty<=0||qty>20)return {ok:false,reason:'จำนวนสินค้าต้องเป็นจำนวนเต็มบวกไม่เกิน 20'};
 if(kind!=='MATERIAL'){
  if(qty!==1)return {ok:false,reason:'รายการนี้โอนครั้งละหนึ่งชิ้น'};
  const stock=shop?storeCountOf(kind,source):grant?treasuryCountOf(kind,source):(source.count??1);
  return stock>=qty?{ok:true,quantity:qty}:{ok:false,reason:shop?'สินค้านี้ยังไม่ได้ขึ้นร้านค้า หรือขายหมดแล้ว':'ไม่มีของสำรองในคลังสำหรับแจกฟรี'};
 }
 const stacks=g.bank.jianghu.ledgerV140.materialStacks.filter(x=>bankOwned(g,x)&&x.matId===source.matId&&(!req.sourceStackId||x.id===req.sourceStackId));
 if(req.quantity===undefined)qty=Math.min(qty,stacks.reduce((sum,item)=>sum+(shop?storeCountOf(kind,item):grant?treasuryCountOf(kind,item):item.count),0));
 if(qty<=0)return {ok:false,reason:'ไม่มีวัตถุดิบในส่วนที่ขอ'};
 let left=qty;const lots=[];
 for(const item of stacks){
  const available=shop?storeCountOf(kind,item):grant?treasuryCountOf(kind,item):item.count;
  const take=Math.min(left,available);if(take>0){lots.push({item,quantity:take,storeBefore:storeCountOf(kind,item)});left-=take;}if(left===0)break;
 }
 if(left>0||qty>H.carryLimit(n)-H.load(n))return {ok:false,reason:'สินค้าในส่วนที่ขอหรือพื้นที่สัมภาระมีไม่พอ'};
 return {ok:true,quantity:qty,lots};
}
function transferStock(g,n,stock,flags){
 let moved=0;
 for(const lot of stock.lots){
  const x=lot.item,r=g.add(n,x.matId,lot.quantity,'SECT_HANDOFF',{...clone(x),...flags,allowTransferFromExistingHeritageStack:true});
  if(!r.ok)return {ok:false,moved};
  x.count-=lot.quantity;
  // Paid stock comes off shelves first; free grants leave shelves untouched.
  x.storeCount=Math.max(0,Math.min(x.count,lot.storeBefore-(flags.sectGrant?0:Math.min(lot.quantity,lot.storeBefore))));
  x.sectStore=x.storeCount>0;moved+=lot.quantity;
 }
 g.bank.jianghu.ledgerV140.materialStacks=g.bank.jianghu.ledgerV140.materialStacks.filter(x=>x.count>0);
 return {ok:true,moved};
}
// Keep real suppliers in separate lots even when the native material ledger merges by quality.
function depositMaterialLot(g,owner,matId,quantity,sample,metadata){
 const l=owner.jianghu.ledgerV140,all=l.materialStacks;
 const peer=all.find(x=>g.ownsMaterial(owner,x)&&x.matId===matId&&x.quality===(sample.quality||'STANDARD')&&x.originId===sample.originId&&x.suppliedByNpcId===metadata.suppliedByNpcId&&(x.contributionCreditAllowed===false)===(sample.contributionCreditAllowed===false));
 const cap=g.isSectStorage(owner)?(root.JianghuInfrastructure?.bonuses(g).materialCapacity||640):(E.PATCH140_CAPS?.materialStacks||24);
 if(!peer&&all.length>=cap)return {ok:false};
 l.materialStacks=peer?[peer]:[];
 try{
  const r=g.add(owner,matId,quantity,'ECONOMIC_SUPPLY',{...sample,allowTransferFromExistingHeritageStack:true});
  if(r.ok)for(const s of l.materialStacks){Object.assign(s,metadata);if(!s.id)s.id='economic_mat_'+g.s.nextId++;if(sample.contributionCreditAllowed!==undefined)s.contributionCreditAllowed=sample.contributionCreditAllowed;}
  return r;
 }finally{l.materialStacks=[...all.filter(x=>x!==peer),...l.materialStacks];E.syncLegacyArraysFromLedgerV140(owner);}
}
function supplyQuote(g,kind,item,quantity=1,withBonus=true){
 const q=quote(g,kind,item,quantity),fly=computeMarketFlywheel(g);
 const stock=kind==='MATERIAL'?g.count(g.bank,item.matId):kind==='PILL'?(g.bank.jianghu.ledgerV140.pillStacks||[]).filter(x=>x.recipeId===item.recipeId&&bankOwned(g,x)).reduce((s,x)=>s+x.count,0):0;
 const target=Math.max(kind==='MATERIAL'?10:4,g.heroes.filter(x=>x.alive).length*(kind==='MATERIAL'?3:2));
 const pct=withBonus&&stock<target?(fly.bonusByCategory?.[kind]||0):0;
 // Donation bounty + the 12% first-sale royalty must stay below the buyer's retired points.
 const maximum=Math.floor(q.redemption*.85);
 const bonus=Math.max(0,Math.min(Math.round(q.donation*pct/100),maximum-q.donation));
 return {...q,donation:q.donation+bonus,demandBonus:bonus,bonusPct:pct,stock,target};
}

function prepareRedemption(g,req,n,source,quantity=1){
 if(req.mode!=='REDEEM'){
  const stock=prepareStock(g,{...req,quantity},source,n);if(!stock.ok)return stock;
  for(const lot of stock.lots||[{item:source,quantity}]){const allowed=grantEligibility(g,req.itemKind,lot.item,lot.quantity);if(!allowed.ok)return allowed;}
  const a=account(g,n),day=Math.floor(time(g)/20),used=a.grantDay===day?(a.grantQuantity||0):0;
  const quota=root.JianghuInfrastructure?.bonuses(g).welfareDailyLimit||4;
  if(used+quantity>quota)return {ok:false,reason:'รับของใช้พื้นฐานครบโควตาวันนี้แล้ว รอวันถัดไปหรือใช้แต้มซื้อที่ร้านค้าสำนัก'};
  return {ok:true,cost:0,quantity,grant:true};
 }
 const stock=prepareStock(g,{...req,quantity},source,n);if(!stock.ok)return stock;
 const price=quote(g,req.itemKind,source,quantity),a=account(g,n);
 if(stock.lots)price.redemption=stock.lots.reduce((sum,lot)=>sum+quote(g,'MATERIAL',lot.item,lot.quantity).redemption,0);
 if(a.balance>=price.redemption)return {ok:true,cost:price.redemption,quantity,emergency:false};
 return {ok:false,cost:price.redemption,reason:'แต้มคุณูปการไม่พอสำหรับซื้อในร้านค้าสำนัก: ต้องการ '+price.redemption+' · มี '+a.balance};
}

function commitRedemption(g,req,n,item,charge){
 const a=account(g,n);
 a.balance-=charge.cost;
 a.spent+=charge.cost;
 if(charge.grant){
  const day=Math.floor(time(g)/20);
  if(a.grantDay!==day){a.grantDay=day;a.grantQuantity=0;}
  a.grantQuantity+=charge.quantity;
  if(item&&Number.isFinite(item.storeCount))item.storeCount=Math.min(item.count||0,item.storeCount);
 }else if(item&&req.itemKind!=='MATERIAL'){
  if(Number.isFinite(item.storeCount)){
   item.storeCount=Math.max(0,Math.min(item.count||0,(item.storeCount||0)-charge.quantity));
   item.sectStore=item.storeCount>0;
  }else if(item.ownerNpcId===n.id){
   delete item.sectStore;
   delete item.storeCount;
  }
 }
 invalidateMarketCache(g);log(g,n,charge.grant?'GRANT':(req.shopPurchase?'SHOP_BUY':'REDEEM'),item,charge.quantity,-charge.cost,{compartment:charge.grant?'TREASURY':'SECT_STORE'});
}

function transferFlags(g,req,item){
 return req.mode==='REDEEM'
  ?{contributionCreditAllowed:true,sectGrant:null}
  :{contributionCreditAllowed:false,sectGrant:{sectId:'TH',rootItemId:item.sectGrant?.rootItemId||item.id||item.matId}};
}

function creditWork(g,n,amount,reason){
 if(!g.s.storyEvents?.active||!(amount>0)||/บริจาค|นำวัสดุเข้าคลัง|นำคัมภีร์เข้าหอสืบทอด|หลอมสร้างพัสดุเข้าคลังสำนัก/.test(reason||''))return;
 if(!/ปกป้อง|คุ้มภัย|ปราบภัย|ประกาศสำเร็จ|ส่งไม้ไผ่ให้สำนัก|เสบียง|ช่วยชีวิตผู้ส่งสาร|เจรจากับผู้แทน|คัดลอกคัมภีร์เข้าหอสืบทอด|ค้นพบที่ตั้งค่าย|จัดหางานช่าง|นำสินค้ากลับจากเส้นทาง/.test(reason||''))return;
 const easy=/ส่งไม้ไผ่|เสบียง/.test(reason),danger=/ปราบภัย|ปกป้อง|คุ้มภัย/.test(reason);
 const category=easy?(/ไม้ไผ่/.test(reason)?'WOOD':'FOOD'):danger?'DANGER':'SERVICE';
 const a=account(g,n),day=Math.floor(time(g)/20);if(a.workDay!==day){a.workDay=day;a.workByClass={};}
 const cap=easy?6:danger?18:8,used=a.workByClass[category]||0;
 const pts=Math.max(0,Math.min(easy?Math.min(2,Math.ceil(amount)):Math.round(amount*3),cap-used));if(!pts)return;
 a.workByClass[category]=used+pts;a.balance+=pts;a.earned+=pts;log(g,n,'WORK',{nameTh:reason||'ผลงานสำนัก'},1,pts);

}

function autoMethod(g,n,kind,item){
 const quantity=kind==='MATERIAL'?Math.min(2,item.count):1,canPay=account(g,n).balance>=quote(g,kind,item,quantity).redemption,free=prepareRedemption(g,{itemKind:kind,mode:'GRANT'},n,item,quantity).ok;
 return canPay&&(!free||(n.personality.integrity||50)>=55)?'REDEEM':free?'GRANT':canPay?'REDEEM':null;
}

function acquire(g,n,kind,id,mode='REDEEM',authorityNpcId=null,quantity=undefined){
 const rejected=r=>{if(n.stageLocal?.cooldowns)n.stageLocal.cooldowns['sectWithdraw:'+kind+':'+id]=time(g)+60;return {...r,ok:false};};
 const source=tools().source(g,kind,id);if(!source)return rejected({reason:'ไม่พบพัสดุส่วนรวมที่ขอ'});
 const spec={...tools().spec(g,kind,source),mode,...(quantity===undefined?{}:{quantity})},prepared=tools().prepareTransfer(g,spec,n);if(!prepared.ok)return rejected({reason:prepared.effectTextTh});
 const charge=prepareRedemption(g,spec,n,source,prepared.qty||1);if(!charge.ok)return rejected(charge);
 const r=g.storyEvents.createManualRequisition(n.id,kind,id,mode,authorityNpcId);if(!r.ok)return rejected(r);
 if(quantity!==undefined)r.req.quantity=quantity;
 const decision=g.storyEvents.judgeRequisition(r.req.id,mode==='REDEEM'?true:null,authorityNpcId);
 return decision.ok&&decision.approved?{...decision,count:prepared.qty||1,cost:charge.cost}:rejected({...decision,reason:decision.reason||'ผู้ดูแลคลังยังไม่อนุมัติ'});
}

function buyFromStore(g,n,kind,id,quantity=1,authorityNpcId=null){
 const actor=typeof n==='string'?g.world?.npcs?.[n]:n;
 if(!actor||!tools().memberAvailable(g,actor))return {ok:false,reason:'ผู้ซื้อต้องเป็นศิษย์ที่อยู่ในสำนักและพร้อมรับสินค้า'};
 if(!keys[kind]||!Number.isInteger(quantity)||quantity<1||quantity>20||((kind==='EQUIPMENT'||kind==='SCROLL'||kind==='PILL')&&quantity!==1))return {ok:false,reason:'จำนวนสินค้าต้องเป็นจำนวนเต็มบวกตามชนิดสินค้า'};
 const source=kind==='MATERIAL'?(g.bank.jianghu.ledgerV140.materialStacks||[]).find(x=>bankOwned(g,x)&&(x.id===id||x.matId===id)&&storeCountOf(kind,x)>0):tools().source(g,kind,id);
 if(!source||storeCountOf(kind,source)<quantity)return {ok:false,reason:'ไม่พบสินค้านี้บนชั้นวางร้านค้าสำนัก หรือจำนวนไม่พอ'};
 const supplierNpcId=source.suppliedByNpcId||source.craftedByNpcId||null;
 const supplier=source.makerNameTh||source.suppliedByNameTh||'ศิษย์ร่วมสำนัก';
 const spec={...tools().spec(g,kind,source),mode:'REDEEM',shopPurchase:true,quantity,sourceStackId:kind==='MATERIAL'?source.id:null};
 const prepared=tools().prepareTransfer(g,spec,actor);
 if(!prepared.ok)return {ok:false,reason:prepared.effectTextTh};
 const qty=prepared.qty||1;
 const charge=prepareRedemption(g,spec,actor,source,qty);
 if(!charge.ok)return charge;
 const req=g.storyEvents.createManualRequisition(actor.id,kind,id,'REDEEM',authorityNpcId);
 if(!req.ok)return req;
 req.req.shopPurchase=true;req.req.quantity=quantity;req.req.sourceStackId=spec.sourceStackId;
 const decision=g.storyEvents.judgeRequisition(req.req.id,true,authorityNpcId);
 if(!decision.ok||!decision.approved)return {ok:false,reason:decision.reason||'ไม่สามารถทำรายการซื้อจากร้านค้าสำนักได้'};

 // Supplier/Creator Royalty: when another disciple buys your crafted/donated item from the Sect Store, you earn a +12% royalty & respect!
 let royaltyPts=0;
 if(supplierNpcId&&supplierNpcId!==actor.id&&g.s.heroIds.includes(supplierNpcId)){
  const supNpc=g.world?.npcs?.[supplierNpcId];
  if(supNpc?.alive){
   royaltyPts=Math.max(1,Math.round(charge.cost*0.12));
   const supAcc=account(g,supNpc);
   supAcc.balance+=royaltyPts;
   supAcc.earned+=royaltyPts;
   log(g,supNpc,'ROYALTY',{nameTh:spec.itemNameTh},qty,royaltyPts,{buyerName:actor.name,compartment:'SECT_STORE'});
   g.life?.relate?.(actor,supNpc,4,2);
  }
 }

 g.note(`🏪 ${actor.name} ใช้แต้มคุณูปการ ${charge.cost} แต้ม ซื้อ «${spec.itemNameTh}» ×${qty} จากร้านค้าสำนัก (ที่มา: ${supplier}${royaltyPts?` · ผู้จัดหารับปันผล +${royaltyPts} แต้ม`:''})`,actor);
 return {
  ok:true,
  quantity:qty,
  cost:charge.cost,
  royaltyPts,
  itemNameTh:spec.itemNameTh,
  supplierNameTh:supplier,
  balance:account(g,actor).balance,
  reason:`ซื้อ «${spec.itemNameTh}» ×${qty} จากร้านค้าสำนักสำเร็จ (ใช้ ${charge.cost} แต้ม)`
 };
}

/* ============================================================================
   MODE A: SECT-SPONSORED ALCHEMY & FORGING (หลอมโอสถ/ศาสตราให้สำนักแลกแต้ม)
   - Uses raw materials from the Sect Treasury (g.bank) — 0 personal materials & 0 personal stones.
   - Disciple contributes labor & skill at the Alchemy Hall or Forge.
   - Output belongs to the Sect (enters Sect Treasury first, then Elder curates to Sect Store).
   - Disciple earns Contribution Points (แต้มคุณูปการ) + Market Demand Bonus for their labor.
   ============================================================================ */
function canCraftForSect(g,n,recipeId){
 const actor=typeof n==='string'?g.world?.npcs?.[n]:n;
 if(!actor||!tools().memberAvailable(g,actor))return {ok:false,reason:'ผู้หลอมต้องเป็นศิษย์ที่อยู่ในสำนัก'};
 ensureBasicSectRecipes(g,actor);
 const r=g.progression?.recipe?.(recipeId);
 if(!r)return {ok:false,reason:'ไม่พบตำรับการหลอม'};
 if(r.effect?.beastItem||!['alchemy','forge'].includes(r.workshop)||!(r.effect?.slot||Object.keys(g.progression.normalizePill(r.effect)).length))return {ok:false,reason:'ตำรับนี้ไม่ใช่โอสถหรือศาสตราที่โรงหลอมสำนักรองรับ'};
 const b=g.built(r.workshop);
 if(!b)return {ok:false,reason:`ต้องสร้าง${r.workshop==='alchemy'?'หอโอสถ':'โรงหลอม'}ให้เสร็จก่อน`};
 const known=actor.stageLocal?.growth?.knownRecipes||[];
 if(!known.includes(r.id)&&!FREE_SECT_RECIPES.includes(r.id)){
  return {ok:false,reason:`${actor.name} ยังไม่รู้สูตร «${r.name}» (ต้องค้นพบจากวาสนาหรือศึกษาก่อน)`};
 }
 if(g.progression.tier(actor)<r.tier)return {ok:false,reason:`ขอบเขตของ ${actor.name} ยังไม่ถึงระดับตำรับ (T${r.tier})`};
 const activity=r.workshop==='alchemy'?'alchemy':'forging';
 const cap=H.capacity(actor,activity).total+(root.JianghuInfrastructure?.bonuses(g).perWorkshop?.[r.workshop]?.craftSkillBonus||0)+(g.progression.equippedCraftBonus?.(actor,r.discipline||r.craftPath||r.workshop)||0);
 if(cap<r.min)return {ok:false,reason:`ฝีมือ${activity==='alchemy'?'ปรุงโอสถ':'หลอมศาสตรา'}ยังไม่ถึงเกณฑ์ (${Math.round(cap)}/${r.min})`};
 // Preflight all ingredients, including recipes that repeat the same material ID.
 // A unit listed for sale is not an available treasury ingredient.
 const required=new Map();
 for(const inp of r.inputs)required.set(inp.matId,(required.get(inp.matId)||0)+inp.count);
 const missing=[...required].filter(([matId,count])=>treasuryMaterialAvailable(g,matId)<count)
  .map(([matId,count])=>({matId,count,available:treasuryMaterialAvailable(g,matId)}));
 if(missing.length){
  return {ok:false,missing,reason:`คลังสำนักมีวัตถุดิบที่ยังไม่วางขายไม่พอ (${missing.map(m=>m.matId+' ขาด '+(m.count-m.available)).join(', ')})`};
 }
 const bankLedger=g.bank.jianghu.ledgerV140;
 const outKey=r.effect?.slot?'equipmentItems':r.effect?.beastItem?'beastItems':'pillStacks';
 const outCap=outKey==='pillStacks'?128:outKey==='beastItems'?96:240;
 if((bankLedger[outKey]||[]).length>=outCap)return {ok:false,reason:'คลังสำนักไม่มีพื้นที่เก็บผลผลิตเพิ่ม'};
 return {ok:true,recipe:r,workshopBuilding:b,activity,effectiveCapacity:cap};
}

function consumeBankMaterialForSectCraft(g,matId,qty){
 if(!Number.isInteger(qty)||qty<1||treasuryMaterialAvailable(g,matId)<qty)return false;
 const stacks=(g.bank?.jianghu?.ledgerV140?.materialStacks||[]).filter(s=>s.matId===matId&&bankOwned(g,s)&&treasuryCountOf('MATERIAL',s)>0);
 stacks.sort((a,b)=>treasuryCountOf('MATERIAL',b)-treasuryCountOf('MATERIAL',a));
 let left=qty;
 for(const s of stacks){
  if(left<=0)break;
  const take=Math.min(left,treasuryCountOf('MATERIAL',s));
  s.count-=take;
  left-=take;
  // Store allocation is intentionally unchanged: these units were never on sale.
  s.sectStore=storeCountOf('MATERIAL',s)>0;
 }
 g.bank.jianghu.ledgerV140.materialStacks=g.bank.jianghu.ledgerV140.materialStacks.filter(s=>s.count>0);
 E.syncLegacyArraysFromLedgerV140?.(g.bank);
 return left===0;
}

function craftForSect(g,n,recipeId,opts={}){
 const actor=typeof n==='string'?g.world?.npcs?.[n]:n;
 const check=canCraftForSect(g,actor,recipeId);
 if(!check.ok)return check;
 const {recipe:r,workshopBuilding:b,activity,effectiveCapacity:effCap}=check;
 if(opts.requireAtWorkshop&&Math.hypot((actor.stageLocal?.x||0)-g.endpoint(b).x,(actor.stageLocal?.y||0)-g.endpoint(b).y)>145){
  return {ok:false,reason:'ผู้หลอมยังเดินไปไม่ถึงโรงหลอมของสำนัก'};
 }
 for(const inp of r.inputs){
  if(!consumeBankMaterialForSectCraft(g,inp.matId,inp.count)){
   return {ok:false,reason:'เบิกวัตถุดิบจากคลังสำนักไม่สำเร็จ'};
  }
 }
 const chance=Math.max(0.45,Math.min(0.95,0.52+effCap*0.006-r.tier*0.05));
 const roll=opts.forceSuccess?0.01:g.rng.next();
 H.learn(actor,activity,3);
 if(actor.core?.condition)actor.core.condition.fatigue=Math.min(100,(actor.core.condition.fatigue||0)+6);
 g.progression?.receipt?.('sectProduction',actor,{recipeId:r.id,chance,roll,success:roll<chance,inputs:clone(r.inputs),stones:0});

 if(roll>=chance){
  const consolationPts=Math.max(1,r.tier);
  const acc=account(g,actor);
  acc.balance+=consolationPts;acc.earned+=consolationPts;
  log(g,actor,'SECT_CRAFT_FAIL',{nameTh:r.name},1,consolationPts,{recipeId:r.id});
  g.remember(actor,'sectCraft',-2,'หลอม '+r.name+' ให้สำนักล้มเหลว ได้แต้มค่าแรงปลอบใจ '+consolationPts);
  g.note(`${actor.name} ลงแรงหลอม «${r.name}» ให้สำนักแต่ไฟปราณสะดุด (ใช้วัตถุดิบคลังสำนัก · ได้ค่าแรง ${consolationPts} แต้ม)`,actor);
  return {ok:false,produced:false,points:consolationPts,reason:`การหลอม «${r.name}» ล้มเหลว เสียวัตถุดิบคลังสำนัก แต่ได้ค่าแรง ${consolationPts} แต้ม`};
 }

 const quality=effCap>=82?'SUPERIOR':effCap>=66?'REFINED':effCap>=50?'GOOD':'COMMON';
 const isEquipment=!!r.effect?.slot;
 const isBeastItem=!!r.effect?.beastItem;
 const kind=isEquipment?'EQUIPMENT':isBeastItem?'MATERIAL':'PILL';
 const batchCount=(!isEquipment&&!isBeastItem&&r.tier===1&&effCap>=55)?2:1;
 const bankLedger=g.bank.jianghu.ledgerV140;
 let storedItem=null;

 if(isEquipment){
  storedItem={
   ...clone(r.effect),
   id:'sect_eq_'+(g.s.nextId++),
   recipeId:r.id,
   catalogId:r.id,
   nameTh:r.name,
   tier:r.tier,
   minStageReq:Number.isFinite(r.minStageReq??r.effect.minStageReq)?(r.minStageReq??r.effect.minStageReq):Math.max(1,(r.tier||1)-1),
   isTranscendent:!!r.isTranscendent,
   quality,
   slot:r.effect.slot,
   compatiblePath:r.compatiblePath||'ANY',
   durability:100,
   maxDurability:100,
   combatMult:r.effect.combat??r.effect.combatMult??0,
   defenseMult:r.effect.defense??r.effect.defenseMult??0,
   studyBonus:r.effect.study??r.effect.studyBonus??0,
   dissectionBonus:r.effect.dissectionBonus||0,
   ownerNpcId:g.bank.id,
   ownerId:g.bank.id,
   makerNameTh:actor.name,
   craftedByNpcId:actor.id,
   suppliedByNpcId:actor.id,
   suppliedByNameTh:actor.name,
   suppliedAt:time(g),
   provenanceMode:'SECT_WORKSHOP_CRAFT',
   sectStore:false,
   originLabelTh:`หลอมสร้างให้สำนักโดย ${actor.name} (ใช้วัตถุดิบคลังสำนัก)`
  };
  root.JianghuExpansionV112?.imbueEquipmentDepth?.(storedItem,g.rng);
  bankLedger.equipmentItems.push(storedItem);
 }else{
  const normEff=g.progression.normalizePill(r.effect);
  let stack=bankLedger.pillStacks.find(p=>bankOwned(g,p)&&p.recipeId===r.id&&p.quality===quality&&p.makerNameTh===actor.name);
  if(!stack){
   stack={
    id:'sect_pill_'+(g.s.nextId++),
    recipeId:r.id,
    catalogId:r.id,
    nameTh:r.name,
    tier:r.tier,
    quality,
    count:0,
    storeCount:0,
    sectStore:false,
    livingEffect:clone(r.effect),
    effect:normEff,
    ownerNpcId:g.bank.id,
    ownerId:g.bank.id,
    makerNameTh:actor.name,
    craftedByNpcId:actor.id,
    suppliedByNpcId:actor.id,
    suppliedByNameTh:actor.name,
    suppliedAt:time(g),
    provenanceMode:'SECT_WORKSHOP_CRAFT',
    originLabelTh:`ปรุงให้สำนักโดย ${actor.name} (ใช้สมุนไพรคลังสำนัก)`
   };
   bankLedger.pillStacks.push(stack);
  }
  stack.count+=batchCount;
  stack.suppliedAt=time(g);
  storedItem=stack;
 }

 E.syncLegacyArraysFromLedgerV140?.(g.bank);
 g.s.stats.crafted++;
 const fullQuote=quote(g,kind,storedItem,batchCount);
 const fly=computeMarketFlywheel(g);
 const demandBonusPct=fly.bonusByCategory?.[kind]||0;
 const baseLaborPts=Math.max(5*r.tier,Math.round(fullQuote.donation*0.65));
 const demandBonusPts=Math.round(baseLaborPts*(demandBonusPct/100));
 const laborPts=baseLaborPts+demandBonusPts;
 const acc=account(g,actor);
 acc.balance+=laborPts;
 acc.earned+=laborPts;
 g.life?.credit?.(actor,Math.min(3,1+r.tier*0.5),'หลอมสร้างพัสดุเข้าคลังสำนัก');
 log(g,actor,'SECT_CRAFT',storedItem,batchCount,laborPts,{recipeId:r.id,quality,demandBonusPts,compartment:'TREASURY'});
 const cur=curateStore(g);
 g.note(`⚗️ ${actor.name} ใช้ทรัพยากรคลังสำนักหลอม «${r.name}» (${quality}) ×${batchCount} เข้าคลังสำนัก · รับค่าแรง +${laborPts} แต้มคุณูปการ${demandBonusPts?` (โบนัสความต้องการตลาด +${demandBonusPts})`:''}${cur.movedCount?` · ${cur.curatorName} จัดขึ้นร้านค้าสำนักทันที`:''}`,actor);
 return {
  ok:true,
  produced:true,
  item:storedItem,
  quantity:batchCount,
  quality,
  points:laborPts,
  demandBonusPts,
  curatedMoved:cur.movedCount,
  reason:`${actor.name} หลอม «${r.name}» ×${batchCount} ให้สำนักสำเร็จ ได้รับ +${laborPts} แต้มคุณูปการ`
 };
}

/* ============================================================================
   AUTONOMOUS NPC SECT STORE WISHLIST, SHOPPING & POINT-SEEKING MOTIVATION
   ============================================================================ */
const desireCache=new WeakMap();
function evaluateStoreDesires(g,n,write=true){
 if(!g||!n?.alive||!n.jianghu)return {desires:[],topWish:null};
 const l0=n.jianghu.ledgerV140;
 const sig=bankSig(g)+JSON.stringify([accountView(g,n).balance,n.health,n.jianghu.internalInjury,n.jianghu.poisonAccumulated,n.jianghu.pillToxicity,n.jianghu.cultivationProgress,n.stageLocal?.combatState?.qi,l0.pillStacks,l0.equipmentItems,l0.scrolls,l0.materialStacks,n.jianghu.knowledgeV190,n.jianghu.equipmentV140,n.stageLocal?.growth?.plan,g.s.growth.scriptureLibrary,g.s.storyEvents?.treasury?.contributions?.learningLicenses?.[n.id]]);
 const hit=desireCache.get(n);if(write&&hit&&hit.sig===sig){if(n.stageLocal)n.stageLocal.storeWish=hit.val.topWish?{...hit.val.topWish,balance:accountView(g,n).balance,canAfford:hit.val.topWish.deficit===0}:null;return hit.val;}
 const store=storeInventory(g);
 const j=n.jianghu,l=j.ledgerV140,q=n.stageLocal?.growth;
 const bal=accountView(g,n).balance;
 const desires=[];

 // 1. Pills in Sect Store (healing, Qi recovery, cultivation progress, cleanse)
 const personalHealPills=(l.pillStacks||[]).filter(p=>p.count>0&&g.progression.normalizePill(p).healHealth>0).reduce((s,p)=>s+p.count,0);
 const injured=n.health<82||(j.internalInjury||0)>5||(j.poisonAccumulated||0)>5;
 for(const p of store.pills){
  const eff=g.progression.normalizePill(p.raw);
  if(p.tier>Math.max(1,Math.ceil(g.progression.tier(n))+1))continue;
  const heldFor=key=>(l.pillStacks||[]).filter(x=>owned(n,x)&&g.progression.normalizePill(x)[key]>0).reduce((sum,x)=>sum+(x.count||0),0);
  let urgency=0,reasonTh='';
  if(((eff.healHealth>0&&personalHealPills<2)||(eff.healInjury>0&&(j.internalInjury||0)>5&&heldFor('healInjury')<2)||(eff.clearPoison>0&&(j.poisonAccumulated||0)>5&&heldFor('clearPoison')<2))){
   urgency=injured?(n.health<65?99:86):58;
   reasonTh=injured?`ต้องการซื้อ «${p.nameTh}» จากร้านค้าสำนักมารักษาอาการบาดเจ็บ`:`ต้องการซื้อ «${p.nameTh}» จากร้านค้าสำนักเก็บสำรองยามออกศึก`;
  }else if(eff.cultivationProgress>0&&heldFor('cultivationProgress')<2&&(j.cultivationProgress||0)<95&&(n.personality?.ambition||50)>=45&&(j.pillToxicity||0)<30){
   urgency=62+Math.min(12,p.tier*3);reasonTh=`ต้องการซื้อ «${p.nameTh}» เพื่อใช้บ่มเพาะตบะ`;
  }else if(eff.restoreQi>0&&heldFor('restoreQi')<2){
   urgency=57;reasonTh=`ต้องการซื้อ «${p.nameTh}» สำรองฟื้นปราณต่อสู้`;
  }else if(eff.toxicityRelief>0&&(j.pillToxicity||0)>8&&heldFor('toxicityRelief')<1){
   urgency=74;reasonTh=`ต้องการซื้อ «${p.nameTh}» เพื่อลดพิษโอสถ`;
  }

  if(urgency>0&&(l.pillStacks||[]).length<15){
   desires.push({kind:'PILL',id:p.id,nameTh:p.nameTh,price:p.unitStorePrice,urgency,reasonTh,tier:p.tier,colorNameTh:p.colorNameTh});
  }
 }

 // 2. Equipment upgrades in Sect Store
 if((l.equipmentItems||[]).length<11){
  for(const eq of store.equipment){
   if(!g.progression?.canEquipItem?.(n,eq.raw,{ignoreOwnership:true})?.ok)continue;
   const slot=eq.slot||'WEAPON';
   const curId=j.equipmentV140?.[slot];
   const curEq=(l.equipmentItems||[]).filter(x=>x.slot===slot&&g.progression.canEquipItem(n,x).ok).sort((a,b)=>g.progression.effectScore(n,b)-g.progression.effectScore(n,a))[0];
   const newScore=g.progression.effectScore(n,eq.raw);
   const curScore=curEq?g.progression.effectScore(n,curEq):0;
   if(!curEq||newScore>curScore+0.25){
    const urgency=!curEq?78:Math.min(88,64+Math.round((newScore-curScore)*4)+(eq.tier>=2?6:0));
    desires.push({
     kind:'EQUIPMENT',
     id:eq.id,
     nameTh:eq.nameTh,
     price:eq.unitStorePrice,
     urgency,
     reasonTh:!curEq?`ต้องการซื้อ «${eq.nameTh}» จากร้านค้าสำนักมาสวมใส่ช่อง ${slot}`:`ต้องการซื้อ «${eq.nameTh}» (${eq.colorNameTh}) จากร้านค้าสำนักมาแทนของเดิม`,
     tier:eq.tier,
     colorNameTh:eq.colorNameTh
    });
   }
  }
 }

 // 3. Compatible unlearned Scripture Manuals in Sect Store
 if((l.scrolls||[]).length<22){
  for(const sc of store.scrolls){
   const art=g.progression?.artMap?.get(sc.artId);
   const k=j.knowledgeV190?.[sc.artId];
   if(art&&!(l.scrolls||[]).some(x=>x.artId===sc.artId&&owned(n,x))&&(!k||k.stage<4)&&g.progression.compatible(n,art)&&g.progression.canStudyArtTier(n,art)&&(!g.discovery||g.discovery.canStudy(n,art))){
    const suit=g.progression.scoreArtSuitability?.(n,art)||{score:25};
    const urgency=Math.min(88,66+Math.round((suit.score||20)*0.25));
    desires.push({
     kind:'SCROLL',
     id:sc.id,
     nameTh:sc.nameTh,
     price:sc.unitStorePrice,
     urgency,
     reasonTh:`ต้องการใช้แต้มแลกคัมภีร์ «${sc.nameTh}» จากร้านค้าสำนักมาฝึกวิชา`,
     tier:sc.tier,
     colorNameTh:sc.colorNameTh
    });
   }
  }
 }

 // 4. Missing Personal Crafting Materials in Sect Store
 const targetRec=g.progression?.recipe?.(q?.plan?.targetId||q?.careerPlan?.targetId);
 if(targetRec&&H.load(n)<H.carryLimit(n)){
  for(const inp of (targetRec.inputs||[])){
   const need=inp.count-g.count(n,inp.matId);
   if(need<=0)continue;
   const m=store.materials.find(x=>x.raw.matId===inp.matId&&x.count>0);
   if(m){
    const take=Math.min(2,need,m.count);
    const cost=quote(g,'MATERIAL',m.raw,1).redemption;
    desires.push({
     kind:'MATERIAL',
     id:m.id,
     nameTh:m.nameTh,
     price:cost,
     urgency:60,
     reasonTh:`ต้องการซื้อวัตถุดิบ «${m.nameTh}» ×1 จากร้านค้าสำนักไปหลอม «${targetRec.name}» ใช้เอง`,
     tier:m.tier,
     colorNameTh:m.colorNameTh
    });
   }
  }
 }

 desires.push(...(root.JianghuSectLibrary?.desires(g,n)||[]));
 desires.sort((a,b)=>b.urgency-a.urgency||a.price-b.price);
 const topWish=desires[0]?{...desires[0],deficit:Math.max(0,desires[0].price-bal)}:null;
 if(write&&n.stageLocal){
  n.stageLocal.storeWish=topWish?{
   kind:topWish.kind,
   id:topWish.id,
   nameTh:topWish.nameTh,
   price:topWish.price,
   balance:bal,
   canAfford:bal>=topWish.price,
   deficit:Math.max(0,topWish.price-bal),
   urgency:topWish.urgency,
   reasonTh:topWish.reasonTh
  }:null;
 }
 const val={desires,topWish};desireCache.set(n,{sig,val});return val;
}

function shoppingAvailable(g,n){return tools().memberAvailable(g,n)&&n.health>=35&&(n.stageLocal.needs?.hunger||0)<85&&(n.core.condition.fatigue||0)<85&&!g.nearestEnemy(n,500);}
function available(g,n){
 return tools().memberAvailable(g,n)&&n.health>=65&&(n.stageLocal.needs?.hunger||0)<75&&(n.core.condition.fatigue||0)<70&&!g.nearestEnemy(n,500);
}

function surplus(g,n){
 const l=n.jianghu.ledgerV140,out=[];
 const wantsPoints=(n.stageLocal?.storeWish?.deficit||0)>0||account(g,n).balance<45||(n.core?.values?.sectDuty||50)>=58;
 for(const item of l.equipmentItems||[]){
  if(!owned(n,item)||Object.values(n.jianghu.equipmentV140||{}).includes(item.id)||Number(item.durability??100)<=0)continue;
  const current=l.equipmentItems.find(x=>x.id===n.jianghu.equipmentV140?.[item.slot]);
  const wrongPath=item.compatiblePath&&!['ANY',n.jianghu.path].includes(item.compatiblePath);
  if(wrongPath||(current&&g.progression.canEquipItem(n,current).ok&&g.progression.effectScore(n,current)>=g.progression.effectScore(n,item)))
   out.push({kind:'EQUIPMENT',id:item.id,quantity:1,item});
 }
 for(const item of l.scrolls||[]){
  const art=g.progression.artMap.get(item.artId),k=n.jianghu.knowledgeV190?.[item.artId];
  if(owned(n,item)&&art&&(k?.stage>=4||!g.progression.compatible(n,art))&&g.discovery.mayShare(n,item))
   out.push({kind:'SCROLL',id:item.id,quantity:1,item});
 }
 for(const item of l.pillStacks||[]){
  if(!owned(n,item)||item.contributionCreditAllowed===false)continue;
  const keepCount=wantsPoints&&n.health>=78?1:3;
  if(item.count>keepCount&&n.health>=78){
   out.push({kind:'PILL',id:item.id,quantity:item.count-keepCount,item});
  }
 }
 for(const matId of new Set((l.materialStacks||[]).filter(x=>owned(n,x)&&x.count>0&&x.contributionCreditAllowed!==false).map(x=>x.matId))){
  const total=(l.materialStacks||[]).filter(x=>x.matId===matId&&owned(n,x)&&x.count>0).reduce((s,x)=>s+x.count,0);
  const keep=reserve(g,n,matId);
  if(total>keep&&g.canAcceptMaterial?.(g.bank,matId,{quality:'STANDARD'})){
   const sample=l.materialStacks.find(x=>x.matId===matId&&owned(n,x)&&x.count>0);
   out.push({kind:'MATERIAL',id:matId,quantity:total-keep,item:sample});
  }
 }
 return out;
}

function actionLabel(id){
 if(!id)return null;
 if(id.startsWith('sectDonate:'))return 'นำพัสดุมอบเข้าคลังสำนักแลกแต้มคุณูปการ';
 if(id.startsWith('sectCraft:'))return 'หลอมโอสถและศาสตราให้สำนักแลกแต้มคุณูปการ';
 if(id.startsWith('sectShopBuy:'))return 'ใช้แต้มคุณูปการซื้อสินค้าจากร้านค้าสำนัก';
 if(id.startsWith('sectGather:'))return 'ออกเก็บสมุนไพรและแร่ส่งสำนักแลกแต้มคุณูปการ';
 return null;
}

function workActivity(id){
 if(!id)return null;
 if(id.startsWith('sectDonate:')||id.startsWith('sectShopBuy:'))return 'deposit';
 if(id.startsWith('sectCraft:'))return /ironblade|armor|guard|flame|jade|scholar|FRG/.test(id)?'forging':'alchemy';
 if(id.startsWith('sectGather:'))return /mine|cinnabar|copper|jade|iron/.test(id)?'mine':'herb';
 return null;
}

function recipeDemand(g,r){
 const b=g.bank.jianghu.ledgerV140,kind=r.effect?.slot?'EQUIPMENT':'PILL';
 const stock=kind==='PILL'?(b.pillStacks||[]).filter(x=>bankOwned(g,x)&&x.recipeId===r.id).reduce((s,x)=>s+x.count,0):(b.equipmentItems||[]).filter(x=>bankOwned(g,x)&&x.recipeId===r.id).length;
 const need=(g.heroes||[]).filter(n=>n.alive&&(kind==='PILL'?(n.jianghu.ledgerV140.pillStacks||[]).filter(x=>x.recipeId===r.id&&x.count>0).reduce((s,x)=>s+x.count,0)<2:!(n.jianghu.ledgerV140.equipmentItems||[]).some(x=>x.slot===r.effect.slot&&g.progression.canEquipItem(n,x).ok))).length;
 return Math.max(0,(kind==='PILL'?Math.max(3,need*2):Math.max(1,need))-stock);
}
function economicWorkload(g,excludeNpcId=null){
 const heroes=(g.heroes||[]).filter(n=>n.alive),extra=root.JianghuInfrastructure?.bonuses(g).extraEconomicWorkers||0;
 const busy=heroes.filter(n=>n.id!==excludeNpcId&&!n.stageLocal?.offmap&&['working','moving','travel'].includes(n.stageLocal?.mode));
 return {gathering:busy.filter(n=>n.stageLocal.action?.startsWith('sectGather:')).length,crafting:busy.filter(n=>n.stageLocal.action?.startsWith('sectCraft:')).length,
  gatheringLimit:Math.max(1,Math.ceil(heroes.length/3))+extra,craftingLimit:Math.max(1,Math.ceil(heroes.length/4))+extra};
}
function options(g,n,add){
 if(!g.s.storyEvents?.active||!shoppingAvailable(g,n))return;
 const hall=g.built('hall');if(!hall)return;
 if(!available(g,n)){const bal=account(g,n).balance,wish=evaluateStoreDesires(g,n).desires.find(d=>d.kind==='PILL'&&d.urgency>=80&&d.price<=bal);if(wish)add('sectShopBuy:PILL:'+wish.id,wish.urgency,g.endpoint(g.built('market')||hall),5,{caution:.2},{growthActivity:'deposit',reason:wish.reasonTh+' · ซื้อยารักษาก่อนกลับไปทำงาน'});return;}
 // Accepted contracts take priority over starting additional economic errands.
 if(g.s.storyEvents?.sidequests?.active)return;
 if(g.built('alchemy')||g.built('forge'))ensureBasicSectRecipes(g,n);
 const market=g.built('market')||hall;
 const {desires,topWish}=evaluateStoreDesires(g,n);
 const fly=computeMarketFlywheel(g);
 const bal=account(g,n).balance;
 const heatBoost=Math.round((fly.marketHeat||20)*0.08);
 const wishMotivation=(topWish?Math.min(26,10+Math.round(topWish.urgency*0.22)):(bal<45?10:3))+heatBoost;
 const wishTag=topWish&&topWish.price>bal?` · สะสมแต้มซื้อ «${topWish.nameTh}» (${bal}/${topWish.price} แต้ม)`:'';

 // 1. Donate surplus personal items (equipment, scrolls, personal pills, or excess materials) to Sect Treasury for points
 const s=surplus(g,n).sort((a,b)=>supplyQuote(g,b.kind,b.item,b.quantity).donation-supplyQuote(g,a.kind,a.item,a.quantity).donation)[0];
 if(s){
  const pts=supplyQuote(g,s.kind,s.item,s.quantity).donation;
  const bonusPct=supplyQuote(g,s.kind,s.item,s.quantity).demandBonus;
  const estTotal=pts;
  if(pts>0){
   add('sectDonate:'+s.kind+':'+s.id,44+wishMotivation*0.5+(n.core.values.sectDuty-50)*.2+(n.personality.empathy-50)*.1,g.endpoint(hall),6,{integrity:.25,empathy:.2},{
    growthActivity:'deposit',
    reason:`นำ «${s.item.nameTh||s.item.matId}» ×${s.quantity} มอบเข้าคลังสำนัก · ได้ +${estTotal} แต้มคุณูปการ${bonusPct?` (รวมโบนัสตลาด ${bonusPct} แต้ม)`:''}${wishTag}`
   });
  }
 }

 // 2. Buy desired item from the Sect Store (ร้านค้าสำนัก) using Contribution Points
 const affordableWish=desires.find(d=>d.kind!=='LESSON'&&bal>=d.price&&(n.stageLocal.cooldowns?.['sectShopBuy:'+d.kind+':'+d.id]||0)<=time(g));
 if(affordableWish){
  add('sectShopBuy:'+affordableWish.kind+':'+affordableWish.id,Math.max(55,affordableWish.urgency+heatBoost*0.5),g.endpoint(market),5,{ambition:.25,rationality:.2,caution:.15},{
   growthActivity:'deposit',
   reason:`${affordableWish.reasonTh} · ใช้ ${affordableWish.price} แต้มคุณูปการ (มี ${bal} แต้ม)`
  });
 }

 const lesson=desires.find(d=>d.kind==='LESSON'&&bal>=d.price);
 const shrine=g.built('shrine');
 if(lesson&&shrine)add('readLibraryScripture',lesson.urgency,g.endpoint(shrine),16,{curiosity:.2,discipline:.15},{growthTarget:lesson.id,growthActivity:'readLibraryScripture',reason:lesson.reasonTh});

 // 3. Mode A: Craft Pills or Equipment for the Sect (หลอมโอสถ/ศาสตราให้สำนัก) using Sect Treasury materials
 const workload=economicWorkload(g,n.id),activeCrafters=workload.crafting;
 const known=n.stageLocal?.growth?.knownRecipes||[];
 const bankPillsCount=(g.bank.jianghu.ledgerV140.pillStacks||[]).filter(p=>bankOwned(g,p)).reduce((sum,p)=>sum+(p.count||0),0);
 const sectCraftCandidates=activeCrafters>=workload.craftingLimit?[]:[...FREE_SECT_RECIPES,...FORTUITOUS_RECIPES,...known]
  .filter((id,idx,arr)=>arr.indexOf(id)===idx&&(known.includes(id)||FREE_SECT_RECIPES.includes(id)))
  .map(id=>canCraftForSect(g,n,id))
  .filter(c=>c.ok&&recipeDemand(g,c.recipe)>0);

 if(sectCraftCandidates.length){
  sectCraftCandidates.sort((a,b)=>{
   const aPill=!a.recipe.effect?.slot?1:0,bPill=!b.recipe.effect?.slot?1:0;
   if(bankPillsCount<6&&aPill!==bPill)return bPill-aPill;
   return recipeDemand(g,b.recipe)-recipeDemand(g,a.recipe)||b.recipe.tier-a.recipe.tier;
  });
  const bestCraft=sectCraftCandidates[0];
  const r=bestCraft.recipe;
  const kind=r.effect?.slot?'EQUIPMENT':'PILL';
  const bonusPct=fly.bonusByCategory?.[kind]||0;
  const basePts=Math.max(5*r.tier,Math.round(quote(g,kind,{recipeId:r.id,tier:r.tier,quality:'COMMON'},1).donation*0.65));
  const estPts=basePts+Math.round(basePts*(bonusPct/100));
  const pillScarcity=bankPillsCount<6&&!r.effect?.slot?16:4;
  const score=42+pillScarcity+wishMotivation*0.65+(n.core.values.sectDuty-50)*0.22+(H.liking(n,bestCraft.activity)-50)*0.18;
  add('sectCraft:'+r.id,score,g.endpoint(bestCraft.workshopBuilding),Math.max(8,Math.round(r.duration*0.75/(root.JianghuInfrastructure?.bonuses(g).perWorkshop?.[r.workshop]?.craftSpeed||1))),{discipline:.3,integrity:.25,creativity:.2},{
   growthActivity:bestCraft.activity,
   reason:`ใช้สมุนไพร/แร่ของคลังสำนักหลอม «${r.name}» ให้สำนัก (ไม่เสียของส่วนตัว) · ได้ค่าแรง ~${estPts} แต้มคุณูปการ${wishTag}`
  });
 }

 // 4. Gather Valley Herbs/Ores for the Sect Treasury when Treasury needs alchemy herbs or disciple wants points
 if(H.load(n)<H.carryLimit(n)){
  const activeGatherers=workload.gathering;
 const herbNeedNodes=activeGatherers>=workload.gatheringLimit?[]:(g.s.nodes||[]).filter(nd=>nd.qty>=2&&nd.tier<=Math.max(2,Math.ceil(g.progression.tier(n)))&&!g.realm?.threatAt?.({x:nd.x,y:nd.y},380,n));
  if(herbNeedNodes.length){
   herbNeedNodes.sort((a,b)=>{
    const ca=g.count(g.bank,a.mat),cb=g.count(g.bank,b.mat);
    const aBasic=[root.FrontierData.HERB,'MAT_HERB_CINDER_LEAF_1',root.FrontierData.CIN,root.FrontierData.ORE].includes(a.mat)?1:0;
    const bBasic=[root.FrontierData.HERB,'MAT_HERB_CINDER_LEAF_1',root.FrontierData.CIN,root.FrontierData.ORE].includes(b.mat)?1:0;
    // If disciple needs high-price store items, also consider higher-tier nodes for bigger point payouts!
    if((topWish?.deficit||0)>=40&&a.tier!==b.tier)return b.tier-a.tier;
    if(aBasic!==bBasic)return bBasic-aBasic;
    return ca-cb||a.tier-b.tier;
   });
   const node=herbNeedNodes[0];
   const bankStock=g.count(g.bank,node.mat);
   if(bankStock<10||(topWish&&topWish.price>bal)){
    const estUnit=quote(g,'MATERIAL',{matId:node.mat,tier:node.tier,quality:'STANDARD'},2).donation;
    const gatherScore=38+(bankStock<6?14:4)+wishMotivation*0.6+(n.core.values.sectDuty-50)*0.18;
    add('sectGather:'+node.id,gatherScore,{id:node.id,x:node.x,y:node.y},10+node.tier*2,{discipline:.25,caution:.2},{
     growthActivity:node.kind==='HERB'?'herb':'mine',
     resourceNodeId:node.id,
     reason:`ออกเก็บ «${node.nameTh}» ในหุบเขานำมาส่งสำนักเพื่อแลกแต้มคุณูปการ (~+${estUnit} แต้ม)${wishTag}`
    });
   }
  }
 }
}

function finish(g,n,id){
 if(!id)return null;
 const fail={handled:true,success:false,cooldown:20},p=n.stageLocal;

 if(id.startsWith('sectDonate:')){
  const b=g.built('hall'),at=b&&g.endpoint(b);
  if(!available(g,n)||!at||p.mode!=='working'||p.action!==id||p.job>0||Math.hypot(p.x-at.x,p.y-at.y)>140)return fail;
  const [,kind,...parts]=id.split(':'),itemId=parts.join(':'),s=surplus(g,n).find(x=>x.kind===kind&&x.id===itemId);if(!s)return fail;
  const r=donate(g,n,kind,itemId,s.quantity);
  return {handled:true,success:r.ok,cooldown:30};
 }

 if(id.startsWith('sectCraft:')){
  const recipeId=id.slice('sectCraft:'.length);
  const r=g.progression?.recipe?.(recipeId),b=r&&g.built(r.workshop),at=b&&g.endpoint(b);
  if(!available(g,n)||!at||p.mode!=='working'||p.action!==id||p.job>0||Math.hypot(p.x-at.x,p.y-at.y)>145)return fail;
  const res=craftForSect(g,n,recipeId,{requireAtWorkshop:true});
  return {handled:true,success:!!res.ok,cooldown:40};
 }

 if(id.startsWith('sectShopBuy:')){
  const [,kind,...parts]=id.split(':'),itemId=parts.join(':');
  const b=g.built('market')||g.built('hall'),at=b&&g.endpoint(b);
  if(!shoppingAvailable(g,n)||!at||p.mode!=='working'||p.action!==id||p.job>0||Math.hypot(p.x-at.x,p.y-at.y)>145)return fail;
  const res=buyFromStore(g,n,kind,itemId,1);
  if(!res.ok&&p.cooldowns)p.cooldowns[id]=time(g)+45;
  return {handled:true,success:!!res.ok,cooldown:35};
 }

 if(id.startsWith('sectGather:')){
  const nodeId=id.slice('sectGather:'.length);
  const node=(g.s.nodes||[]).find(x=>x.id===nodeId);
  if(!available(g,n)||!node||p.mode!=='working'||p.action!==id||p.job>0||Math.hypot(p.x-node.x,p.y-node.y)>150)return fail;
  const hRes=g.harvestNode(nodeId,n.id);
  if(!hRes.ok)return fail;

  tryFortuitousRecipeDiscovery(g,n,node.nameTh);
  return {handled:true,success:true,cooldown:18};
 }

 return null;
}

/* Outside visitors carry finite cargo in the same NPC ledger. Contribution points
   never leave the sect; accepted proposals transfer spirit stones to the seller.
   Two-way outsider trade (v2.08): specialized merchant guilds also post finite
   Purchase Orders (ใบสั่งซื้อรับซื้อของส่วนเกิน) with tiered quota bonuses. */
const CARAVAN_GUILDS=[
 {
  id:'HERB_GUILD',
  labelTh:'ขบวนค้าสมุนไพรหุบเขาหมอก',
  specialtyTh:'สมุนไพรและวัตถุดิบปรุงยา · รับซื้อโอสถพื้นฐานและสมุนไพรส่วนเกิน',
  orders:[
   {kind:'PILL',ids:['L14_remedy','L14_qi'],wantQuantity:6,bonusQuota:2,bonusPct:25},
   {kind:'MATERIAL',ids:['MAT_HERB_CINDER_LEAF_1','MAT_HERB_DEW_GRASS_1','MAT_ORE_BLACK_IRON_1'],wantQuantity:8,bonusQuota:3,bonusPct:25}
  ]
 },
 {
  id:'FORGE_GUILD',
  labelTh:'กองคาราวานช่างหลอมพเนจร',
  specialtyTh:'แร่ปราณและศาสตรา · รับซื้อแร่เหล็กดำ ชาดปราณ และโอสถสำรองเดินทาง',
  orders:[
   {kind:'MATERIAL',ids:['MAT_ORE_BLACK_IRON_1','MAT_ORE_CINNABAR_1','MAT_HERB_DEW_GRASS_1'],wantQuantity:8,bonusQuota:3,bonusPct:25},
   {kind:'PILL',ids:['L14_remedy','L14_clarity'],wantQuantity:5,bonusQuota:2,bonusPct:25}
  ]
 },
 {
  id:'ELIXIR_GUILD',
  labelTh:'หอการค้าโอสถเมฆาคราม',
  specialtyTh:'โอสถและตัวยา · รับซื้อสมุนไพรคัดเกรดและโอสถฟื้นฟูลมปราณ',
  orders:[
   {kind:'MATERIAL',ids:['MAT_HERB_DEW_GRASS_1','MAT_HERB_CINDER_LEAF_1','MAT_ORE_CINNABAR_1'],wantQuantity:7,bonusQuota:3,bonusPct:25},
   {kind:'PILL',ids:['L14_qi','L14_remedy','L14_pure'],wantQuantity:6,bonusQuota:2,bonusPct:25}
  ]
 },
 {
  id:'SCRIPTURE_GUILD',
  labelTh:'ขบวนนักปราชญ์และตำราโบราณ',
  specialtyTh:'คัมภีร์และวิชา · รับซื้อโอสถบำรุงจิตและแร่ชาดสำหรับจารึกตำรา',
  orders:[
   {kind:'MATERIAL',ids:['MAT_ORE_CINNABAR_1','MAT_ORE_BLACK_IRON_1','MAT_HERB_DEW_GRASS_1'],wantQuantity:7,bonusQuota:3,bonusPct:25},
   {kind:'PILL',ids:['L14_clarity','L14_remedy'],wantQuantity:5,bonusQuota:2,bonusPct:25}
  ]
 },
 {
  id:'CURIO_GUILD',
  labelTh:'สมาคมวานิชแดนไกล',
  specialtyTh:'ของหายากจากต่างแดน · รับซื้อวัตถุดิบและโอสถส่วนเกินหลากหลายชนิด',
  orders:[
   {kind:'MATERIAL',ids:['MAT_ORE_BLACK_IRON_1','MAT_HERB_CINDER_LEAF_1','MAT_ORE_CINNABAR_1','MAT_HERB_DEW_GRASS_1'],wantQuantity:8,bonusQuota:3,bonusPct:25},
   {kind:'PILL',ids:['L14_remedy','L14_qi','L14_clarity'],wantQuantity:6,bonusQuota:2,bonusPct:25}
  ]
 }
];

function externalState(g){
 const s=state(g);
 if(!s.externalTrade)s.externalTrade={version:2,autoProcure:true,autoSell:true,nextVisitAt:time(g),nextDecisionAt:time(g)+20,visit:0,merchantIds:[],offers:[],orders:[],sales:[],history:[]};
 if(!Array.isArray(s.externalTrade.orders))s.externalTrade.orders=[];
 if(!Array.isArray(s.externalTrade.sales))s.externalTrade.sales=[];
 if(s.externalTrade.autoSell===undefined)s.externalTrade.autoSell=true;
 return s.externalTrade;
}
function isOrdinarySurplusLot(item){
 if(!item||item.isTranscendent||item.unique||item.sectRelic)return false;
 const q=item.quality||'STANDARD',r=item.rarity||item.rarityGrade||q;
 if(!['COMMON','STANDARD','NORMAL','MORTAL','GOOD'].includes(q))return false;
 if(['RARE','MYSTIC','SUPERIOR','EXCELLENT','MASTERWORK','EPIC','EARTH','PERFECT','HEAVEN','LEGENDARY','IMMORTAL','MYTHIC','TRANSCENDENT'].includes(r))return false;
 return true;
}
function orderLots(g,o){
 if(!o||!['MATERIAL','PILL'].includes(o.kind))return [];
 const bl=g?.bank?.jianghu?.ledgerV140;if(!bl)return [];
 if(o.kind==='MATERIAL'){
  return (bl.materialStacks||[]).filter(x=>bankOwned(g,x)&&x.matId===o.targetId&&(x.count||0)>0&&isOrdinarySurplusLot(x)).sort((a,b)=>treasuryCountOf('MATERIAL',b)-treasuryCountOf('MATERIAL',a));
 }
 if(o.kind==='PILL'){
  return (bl.pillStacks||[]).filter(x=>bankOwned(g,x)&&(x.recipeId||x.catalogId||x.id)===o.targetId&&(x.count||0)>0&&isOrdinarySurplusLot(x)).sort((a,b)=>treasuryCountOf('PILL',b)-treasuryCountOf('PILL',a));
 }
 return [];
}
function orderReserve(g,o){
 const alive=(g?.heroes||[]).filter(n=>n?.alive);
 const base=o.kind==='MATERIAL'?(o.tier===1?6:2):Math.max(4,alive.length);
 let craft=0;
 if(o.kind==='MATERIAL'){
  const known=new Set([...FREE_SECT_RECIPES,...alive.flatMap(n=>n.stageLocal?.growth?.knownRecipes||[])]);
  for(const r of g?.progression?.allRecipes?.()||[]){
   if(known.has(r.id)&&g.built(r.workshop)){
    const inp=(r.inputs||[]).find(i=>i.matId===o.targetId);
    if(inp)craft=Math.max(craft,inp.count*2);
   }
  }
 }
 const a=g?.s?.storyEvents?.sidequests?.active,d=root.JianghuSideQuests?.catalog?.find(x=>x.id===a?.questId);
 const quest=(o.kind==='MATERIAL'&&d?.kind==='DELIVERY'&&d.matId===o.targetId)?(Number(d.quantity)||0):0;
 const upgrade=(o.kind==='MATERIAL'&&o.targetId===root.FrontierData?.ORE)?8:0;
 const wishers=alive.filter(n=>{
  const w=n.stageLocal?.storeWish;if(!w||w.kind!==o.kind)return false;
  if(o.kind==='MATERIAL')return w.id===o.targetId||(g.bank?.jianghu?.ledgerV140?.materialStacks||[]).some(m=>m.id===w.id&&m.matId===o.targetId);
  return w.id===o.targetId||(g.bank?.jianghu?.ledgerV140?.pillStacks||[]).some(p=>p.id===w.id&&(p.recipeId||p.catalogId)===o.targetId);
 }).length;
 const wish=wishers*2;
 const reserve=Math.max(base+wish,craft+quest+wish,upgrade+wish);
 const reasons=[`สำรองคลังขั้นต่ำ ${base}`];
 if(craft>0)reasons.push(`สำรองวัตถุดิบโรงหลอม ${craft}`);
 if(upgrade>0)reasons.push(`สำรองแร่ก่อสร้าง/อัปเกรด ${upgrade}`);
 if(quest>0)reasons.push(`สำรองภารกิจส่งมอบ ${quest}`);
 if(wish>0)reasons.push(`ศิษย์ต้องการซื้อ ${wish}`);
 return {reserve,base,craft,quest,upgrade,wish,reasons};
}
function createPurchaseOrder(g,s,seller,guild,kind,targetId,tpl,now){
 if(!['MATERIAL','PILL'].includes(kind)||!targetId)return null;
 let nameTh=targetId,tier=1,minOfferBuy=6,rawUnit=3;
 if(kind==='MATERIAL'){
  const d=matDef(targetId);if(!d)return null;
  nameTh=d.nameTh||targetId;tier=Number(d.tier)||1;
  minOfferBuy=Math.max(3,Math.ceil((d.baseValueStones||8)*.65));
  rawUnit=Math.max(3,Math.floor((d.baseValueStones||8)*.5));
 }else{
  const r=g.progression?.recipe?.(targetId);if(!r)return null;
  nameTh=r.name||targetId;tier=Number(r.tier)||1;
  const q=quote(g,'PILL',{recipeId:r.id,tier:r.tier,quality:'COMMON'},1);
  minOfferBuy=Math.max(12,Math.ceil(q.unitDonation*.8));
  rawUnit=Math.max(6,Math.floor(q.unitDonation*.55));
 }
 const bonusPct=Math.max(10,Number(tpl.bonusPct)||25);
 const maxSafeUnit=Math.max(2,Math.floor((minOfferBuy-1)/(1+bonusPct/100)));
 const unitStones=Math.max(2,Math.min(rawUnit,maxSafeUnit));
 const bonusPerUnit=Math.max(1,Math.floor(unitStones*bonusPct/100));
 const effectiveBonusPct=Math.round((bonusPerUnit/unitStones)*100);
 const wantQuantity=Math.max(2,Number(tpl.wantQuantity)||6);
 const bonusQuota=Math.max(1,Math.min(wantQuantity-1,Number(tpl.bonusQuota)||2));
 const maxOrderStones=unitStones*wantQuantity+bonusPerUnit*bonusQuota;
 const purseStones=maxOrderStones+12;
 E.addSpiritStonesV140(seller,purseStones);
 const order={
  id:`outside_order_${s.visit}_${s.orders.length+1}`,
  visit:s.visit,
  buyerNpcId:seller.id,
  buyerNameTh:seller.name,
  guildId:guild.id,
  guildNameTh:guild.labelTh,
  kind,
  targetId,
  nameTh,
  tier,
  wantQuantity,
  filled:0,
  unitStones,
  minOfferBuyStones:minOfferBuy,
  bonusQuota,
  bonusPct:effectiveBonusPct,
  bonusPerUnit,
  bonusUsed:0,
  purseStones,
  stonesPaid:0,
  createdAt:now,
  expiresAt:now+100,
  status:'OPEN'
 };
 s.orders.push(order);
 return order;
}
function quotePurchaseOrder(g,id,requested=null){
 const s=g?.s?.storyEvents?.treasury?.contributions?.externalTrade;
 const o=(s?.orders||[]).find(x=>x.id===id);
 if(!o)return {ok:false,reason:'ไม่พบใบสั่งซื้อจากพ่อค้าคนนอก'};
 if(!['MATERIAL','PILL'].includes(o.kind))return {ok:false,reason:'สำนักห้ามขายศาสตราและคัมภีร์วิชาให้พ่อค้าคนนอก'};
 if(o.status!=='OPEN'||time(g)>=o.expiresAt)return {ok:false,reason:'ใบสั่งซื้อนี้สิ้นสุดหรือรับของครบจำนวนแล้ว'};
 const lots=orderLots(g,o);
 const totalStock=lots.reduce((sum,x)=>sum+(x.count||0),0);
 const res=orderReserve(g,o);
 const surplusQty=Math.max(0,totalStock-res.reserve);
 const remainingDemand=Math.max(0,o.wantQuantity-(o.filled||0));
 // An order's budget is a spending limit, not a second wallet. The buyer must
 // still have the actual stones, which can change after other transactions.
 const buyer=g.world?.npcs?.[o.buyerNpcId];
 const purseLeft=Math.max(0,Math.min((o.purseStones||0)-(o.stonesPaid||0),E.getSpiritStonesV140(buyer)));
 const bonusPerUnit=o.bonusPerUnit!==undefined?o.bonusPerUnit:Math.floor(o.unitStones*(o.bonusPct||0)/100);
 const bonusLeft=Math.max(0,(o.bonusQuota||0)-(o.filled||0));
 let maxAffordable=0,runningCost=0;
 for(let i=1;i<=Math.min(surplusQty,remainingDemand);i++){
  const uCost=o.unitStones+(i<=bonusLeft?bonusPerUnit:0);
  if(runningCost+uCost>purseLeft)break;
  runningCost+=uCost;
  maxAffordable=i;
 }
 const maxSellable=Math.min(surplusQty,remainingDemand,maxAffordable);
 const qty=requested===null||requested===undefined?maxSellable:Number(requested);
 if(!Number.isInteger(qty)||qty<=0){
  return {
   ok:false,
   orderId:o.id,
   totalStock,
   reserve:res.reserve,
   reserveReasons:res.reasons,
   surplusQty,
   remainingDemand,
   bonusLeft,
   maxSellable,
   quantity:0,
   stones:0,
   baseStones:0,
   bonusStones:0,
   bonusUnits:0,
   reason:surplusQty<=0?`สต็อกในคลัง (${totalStock}) ยังไม่เกินเกณฑ์สำรองของสำนัก (${res.reserve})`:remainingDemand<=0?'พ่อค้ารับซื้อครบจำนวนแล้ว':maxSellable<=0?'หินวิญญาณจริงหรือวงเงินใบสั่งซื้อของพ่อค้าไม่เพียงพอ':'จำนวนที่ต้องการขายไม่ถูกต้อง'
  };
 }
 if(qty>remainingDemand)return {ok:false,totalStock,reserve:res.reserve,reserveReasons:res.reasons,surplusQty,remainingDemand,bonusLeft,maxSellable,reason:`พ่อค้าต้องการรับซื้ออีกเพียง ${remainingDemand} หน่วย`};
 if(qty>surplusQty)return {ok:false,totalStock,reserve:res.reserve,reserveReasons:res.reasons,surplusQty,remainingDemand,bonusLeft,maxSellable,reason:`ขายได้เฉพาะส่วนเกินสำรองคลัง (มี ${totalStock} · ต้องสำรอง ${res.reserve} · ขายได้สูงสุด ${surplusQty})`};
 const bonusUnits=Math.min(qty,bonusLeft);
 const baseStones=qty*o.unitStones;
 const bonusStones=bonusUnits*bonusPerUnit;
 const stones=baseStones+bonusStones;
 if(stones>purseLeft)return {ok:false,totalStock,reserve:res.reserve,reserveReasons:res.reasons,surplusQty,remainingDemand,bonusLeft,maxSellable,reason:'ถุงเงินหินวิญญาณของพ่อค้าคนนอกไม่พอรับซื้อจำนวนนี้'};
 return {
  ok:true,
  orderId:o.id,
  quantity:qty,
  unitStones:o.unitStones,
  bonusPerUnit,
  bonusUnits,
  regularUnits:qty-bonusUnits,
  baseStones,
  bonusStones,
  stones,
  totalStock,
  reserve:res.reserve,
  reserveReasons:res.reasons,
  surplusQty,
  remainingDemand,
  bonusLeft,
  maxSellable,
  reason:`พร้อมขายส่วนเกิน ×${qty} รับหินวิญญาณ +${stones}${bonusStones>0?` (รวมโบนัสโควตาแรก +${bonusStones} หินวิญญาณ สำหรับ ${bonusUnits} หน่วยแรก)`:''}`
 };
}
function sellToPurchaseOrder(g,id,quantity=null,authorityNpcId=null){
 const s=externalState(g),o=(s.orders||[]).find(x=>x.id===id);
 if(!o)return {ok:false,reason:'ไม่พบใบสั่งซื้อจากพ่อค้าคนนอก'};
 if(g.routeBlocked())return {ok:false,reason:'เส้นทางการค้าถูกปิดกั้น ยังส่งมอบสินค้าไม่ได้'};
 const auths=g.storyEvents.authorities();
 const authority=auths.find(x=>!authorityNpcId||x.npc.id===authorityNpcId);
 if(!authority)return {ok:false,reason:'ต้องมีเจ้าสำนักหรือผู้อาวุโสฝ่ายคลังเป็นผู้เจรจาขายของส่วนเกิน'};
 const q=quotePurchaseOrder(g,id,quantity);
 if(!q.ok)return q;
 const buyer=g.world.npcs[o.buyerNpcId];
 if(!buyer?.alive)return {ok:false,reason:'พ่อค้าผู้รับซื้อไม่อยู่ในพื้นที่แล้ว'};
 if(E.getSpiritStonesV140(buyer)<q.stones)return {ok:false,reason:'พ่อค้ามีหินวิญญาณจริงไม่พอรับซื้อ'};
 const lots=orderLots(g,o);
 let rem=q.quantity;
 const plan=[];
 for(const lot of lots){
  if(rem<=0)break;
  const take=Math.min(rem,lot.count||0);
  if(take>0){plan.push({lot,quantity:take});rem-=take;}
 }
 if(rem>0)return {ok:false,reason:'พัสดุส่วนเกินที่เข้าเกณฑ์ไม่เพียงพอ'};
 const bl=g.bank.jianghu.ledgerV140,sl=buyer.jianghu.ledgerV140;
 const sample=plan[0].lot;
 if(o.kind==='MATERIAL'&&!g.canAcceptMaterial(buyer,o.targetId,sample))return {ok:false,reason:'สัมภาระของพ่อค้าคนนอกเต็ม ไม่สามารถรับของเพิ่มได้'};
 const debit=E.addSpiritStonesV140(buyer,-q.stones);
 if(!debit?.ok)return {ok:false,reason:'พ่อค้ามีหินวิญญาณจริงไม่พอรับซื้อ'};
 if(o.kind==='MATERIAL'){
  const dep=depositMaterialLot(g,buyer,o.targetId,q.quantity,sample,{suppliedBySectId:'TH',purchasedAt:time(g),provenanceMode:'EXTERNAL_TRADE_SALE'});
  if(!dep.ok){E.addSpiritStonesV140(buyer,q.stones);return {ok:false,reason:'ส่งมอบวัตถุดิบให้พ่อค้าคนนอกไม่สำเร็จ'};}
 }else{
  const existing=(sl.pillStacks||[]).find(p=>(p.recipeId||p.catalogId)===o.targetId&&p.quality===(sample.quality||'COMMON'));
  if(existing){
   existing.count=(existing.count||0)+q.quantity;
  }else{
   sl.pillStacks.push({...clone(sample),id:`outside_bought_${s.visit}_${s.sales.length+1}`,ownerNpcId:buyer.id,ownerId:buyer.id,count:q.quantity,storeCount:0,sectStore:false});
  }
 }
 for(const p of plan){
  const shelf=storeCountOf(o.kind,p.lot);
  const unShelved=Math.max(0,(p.lot.count||0)-shelf);
  p.lot.count-=p.quantity;
  if(p.quantity>unShelved){
   p.lot.storeCount=Math.max(0,shelf-(p.quantity-unShelved));
  }
  p.lot.sectStore=(p.lot.storeCount||0)>0;
 }
 bl[keys[o.kind]]=(bl[keys[o.kind]]||[]).filter(x=>(x.count??1)>0);
 g.money(q.stones,'ขายของส่วนเกินให้คนนอก '+o.nameTh);
 o.filled=(o.filled||0)+q.quantity;
 o.stonesPaid=(o.stonesPaid||0)+q.stones;
 o.bonusUsed=(o.bonusUsed||0)+q.bonusUnits;
 if(o.filled>=o.wantQuantity)o.status='FILLED';
 const saleRecord={
  id:`outside_sale_${s.visit}_${s.sales.length+1}`,
  orderId:o.id,
  t:time(g),
  authorityNpcId:authority.npc.id,
  authorityNameTh:authority.npc.name,
  buyerNpcId:buyer.id,
  buyerNameTh:buyer.name,
  guildNameTh:o.guildNameTh||'',
  kind:o.kind,
  targetId:o.targetId,
  nameTh:o.nameTh,
  quantity:q.quantity,
  unitStones:q.unitStones,
  bonusUnits:q.bonusUnits,
  baseStones:q.baseStones,
  bonusStones:q.bonusStones,
  stones:q.stones,
  reserveKept:q.reserve
 };
 s.sales.unshift(saleRecord);s.sales.splice(40);
 E.syncLegacyArraysFromLedgerV140(g.bank);E.syncLegacyArraysFromLedgerV140(buyer);invalidateMarketCache(g);
 log(g,authority.npc,'EXTERNAL_SELL',sample,q.quantity,0,{stones:q.stones,baseStones:q.baseStones,bonusStones:q.bonusStones,bonusUnits:q.bonusUnits,buyerName:buyer.name,orderId:o.id});
 g.note(`💰 ${authority.npc.name} ขายส่วนเกิน «${o.nameTh}» ×${q.quantity} ให้ ${buyer.name} · รับหินวิญญาณ +${q.stones} เข้าคลังสำนัก (คงสำรองคลัง ${q.reserve} หน่วย)`,authority.npc);
 return {
  ok:true,
  ...q,
  orderStatus:o.status,
  sale:saleRecord,
  reason:`ขาย «${o.nameTh}» ×${q.quantity} ให้ ${buyer.name} สำเร็จ · รับหินวิญญาณ +${q.stones}`
 };
}
function autoSellSurplus(g,s,auth){
 if(!auth||s.autoSell===false||g.routeBlocked())return null;
 const candidates=[];
 for(const o of s.orders||[]){
  if(o.status!=='OPEN'||time(g)>=o.expiresAt)continue;
  const q=quotePurchaseOrder(g,o.id);
  if(!q.ok||q.maxSellable<=0)continue;
  const safetyBuffer=o.kind==='MATERIAL'?6:4;
  const safeSurplus=q.surplusQty-safetyBuffer;
  if(safeSurplus<=0)continue;
  const sellQty=Math.min(q.maxSellable,safeSurplus);
  const sim=quotePurchaseOrder(g,o.id,sellQty);
  if(!sim.ok)continue;
  const wealthVal=auth.core?.values?.wealthResource||50;
  const cautionVal=auth.personality?.caution||auth.core?.values?.caution||50;
  const needStones=g.gold<800?14:g.gold<1800?6:0;
  const score=sim.stones*.45+sim.bonusStones*1.1+safeSurplus*1.5+needStones+(wealthVal-50)*.18-(cautionVal-50)*.1;
  if(score>=10)candidates.push({o,sellQty,score,sim});
 }
 candidates.sort((a,b)=>b.score-a.score||b.sim.stones-a.sim.stones);
 if(candidates.length){
  return sellToPurchaseOrder(g,candidates[0].o.id,candidates[0].sellQty,auth.id);
 }
 return null;
}
function externalMarket(g){
 const s=externalState(g),now=time(g);root.JianghuSectLibrary?.appoint(g);
 for(const o of s.offers)if(o.status==='PENDING'&&now>=o.expiresAt)o.status='EXPIRED';
 for(const o of s.orders||[])if(o.status==='OPEN'&&now>=o.expiresAt)o.status='EXPIRED';
 if(now>=s.nextVisitAt&&g.built('hall')&&!g.routeBlocked()){
  s.visit++;s.nextVisitAt=now+140;s.offers=[];s.orders=[];
  const index=(s.visit-1)%3;
  const guild=CARAVAN_GUILDS[(s.visit-1)%CARAVAN_GUILDS.length];
  s.guildId=guild.id;s.guildNameTh=guild.labelTh;s.guildSpecialtyTh=guild.specialtyTh;
  let seller=g.world.npcs[s.merchantIds[index]];
  if(!seller){
   seller=g.create(['ลั่วอัน · พ่อค้าสมุนไพร','เฉินถง · พ่อค้าศาสตรา','ซ่งชิง · พ่อค้าพเนจร'][index],{role:'merchant',sectId:'JH_MERCHANT',preserveName:true});
   const at=g.endpoint(g.built('market')||g.built('hall'));
   g.initializePerson(seller,at,{role:'merchant',visitor:true,originSectId:'JH_MERCHANT'});
   seller.stageLocal.offmap={externalMerchant:true,until:null};seller.stageLocal.mode='offmap';
   s.merchantIds[index]=seller.id;
  }
  const l=seller.jianghu.ledgerV140;
  for(const k of Object.values(keys))l[k]=[];
  const tier=Math.min(3,Math.max(1,...g.heroes.filter(x=>x.alive).map(x=>Math.floor(g.progression.tier(x)))));
  const candidates=[root.FrontierData.HERB,root.FrontierData.ORE,'MAT_HERB_CINDER_LEAF_1',root.FrontierData.CIN];
  const matIds=[candidates[(s.visit-1)%candidates.length],candidates[s.visit%candidates.length]];
  function offer(kind,item,quantity,unitStones){
   s.offers.push({id:'outside_offer_'+g.s.nextId++,sellerNpcId:seller.id,sellerNameTh:seller.name,guildId:guild.id,guildNameTh:guild.labelTh,kind,itemId:item.id||item.matId,nameTh:item.nameTh,quantity,unitStones,totalStones:unitStones*quantity,tier:item.tier||1,createdAt:now,expiresAt:now+100,status:'PENDING'});
  }
  for(const id of matIds){
   const d=matDef(id);if(!d)continue;
   g.add(seller,id,4,'EXTERNAL_CARAVAN_'+s.visit,{originType:'OUTSIDE_TRADE',originId:'caravan_'+s.visit,originLabelTh:'สินค้าติดตัวจากตลาดนอกหุบเขา'});
   const item=l.materialStacks.find(x=>x.matId===id);if(!item)continue;
   item.id='outside_cargo_'+g.s.nextId++;offer('MATERIAL',item,4,Math.max(3,Math.ceil((d.baseValueStones||8)*.65)));
  }
  const r=g.progression.recipe(s.visit%2?'L14_remedy':'L14_ironblade');
  if(r){
   const kind=r.effect?.slot?'EQUIPMENT':'PILL';
   const item={id:'outside_cargo_'+g.s.nextId++,recipeId:r.id,catalogId:r.id,nameTh:r.name,tier:r.tier,quality:tier>=2?'GOOD':'COMMON',ownerNpcId:seller.id,ownerId:seller.id,count:kind==='PILL'?2:undefined,originLabelTh:'สินค้าจากช่างตลาดนอกหุบเขา',provenanceMode:'EXTERNAL_TRADE'};
   if(kind==='PILL'){item.effect=g.progression.normalizePill(r.effect);item.livingEffect=clone(r.effect);}else Object.assign(item,{slot:r.effect.slot,minStageReq:1,durability:100,maxDurability:100,compatiblePath:'ANY',combatMult:r.effect.combat||0,defenseMult:r.effect.defense||0});
   l[keys[kind]].push(item);offer(kind,item,item.count||1,Math.max(12,Math.ceil(quote(g,kind,item).unitDonation*.8)));
  }
  const scripture=root.JianghuSectLibrary?.visitorOffer(g,s,seller);if(scripture)s.offers.push(scripture);
  for(const tpl of guild.orders||[]){
   const chosen=(tpl.ids||[]).find(id=>tpl.kind==='MATERIAL'?!matIds.includes(id):id!==r?.id)||tpl.ids?.[0];
   if(chosen)createPurchaseOrder(g,s,seller,guild,tpl.kind,chosen,tpl,now);
  }
  E.syncLegacyArraysFromLedgerV140(seller);
  g.note(seller.name+' ('+guild.labelTh+') นำสินค้า '+s.offers.length+' รายการมาเสนอขาย และเปิดใบสั่งซื้อของส่วนเกิน '+s.orders.length+' รายการ · ใช้หินวิญญาณเท่านั้น');
 }
 return s;
}
function acceptExternalOffer(g,id,authorityNpcId=null){
 const s=externalState(g),o=s.offers.find(x=>x.id===id);
 if(!o||o.status!=='PENDING'||time(g)>=o.expiresAt)return {ok:false,reason:'ข้อเสนอสิ้นสุดหรือซื้อไปแล้ว'};
 const auths=g.storyEvents.authorities(),libraryAuthority=o.kind==='SCROLL'?root.JianghuSectLibrary?.authority(g,authorityNpcId):null;
 const authority=o.kind==='SCROLL'?(libraryAuthority?{npc:libraryAuthority}:null):auths.find(x=>!authorityNpcId||x.npc.id===authorityNpcId);
 if(!authority)return {ok:false,reason:'ต้องมีเจ้าสำนักหรือผู้อาวุโสฝ่ายคลังที่พร้อมเจรจา'};
 if(g.routeBlocked())return {ok:false,reason:'เส้นทางถูกปิด ยังรับสินค้าไม่ได้'};
 if(o.kind==='SCROLL'&&root.JianghuSectLibrary.assess(g,o).score<=0)return {ok:false,reason:'ผู้อาวุโสประเมินว่าคัมภีร์นี้ยังไม่มีผู้เรียนที่เหมาะสมหรือไม่คุ้มค่าต่อสำนัก'};
 if(!Number.isFinite(o.totalStones)||o.totalStones<=0||g.gold<o.totalStones)return {ok:false,reason:'หินวิญญาณกองกลางไม่เพียงพอ'};
 const seller=g.world.npcs[o.sellerNpcId],key=keys[o.kind],sl=seller?.jianghu?.ledgerV140,bl=g.bank.jianghu.ledgerV140;
 const item=sl?.[key]?.find(x=>(x.id||x.matId)===o.itemId);
 if(!seller?.alive||!item||!g.ownsMaterial(seller,item)||(item.count??1)<o.quantity)return {ok:false,reason:'ผู้ขายไม่มีสินค้าตามที่เสนอแล้ว'};
 if(o.kind==='SCROLL'&&(!g.built('shrine')||g.s.growth.scriptureLibrary.length>=(root.JianghuSectLibrary?.capacity(g)||120)||g.s.growth.scriptureLibrary.some(b=>b.artId===o.artId)))return {ok:false,reason:'ต้องมีหอคัมภีร์ที่มีพื้นที่ว่างและยังไม่มีวิชานี้'};
 const max=o.kind==='MATERIAL'?(root.JianghuInfrastructure?.bonuses(g).materialCapacity||640):o.kind==='PILL'?128:240;
 if(o.kind!=='SCROLL'&&bl[key].length>=max)return {ok:false,reason:'คลังสำนักเต็ม จึงยังไม่จ่ายหินวิญญาณ'};
 if(o.kind==='MATERIAL'&&!g.canAcceptMaterial(g.bank,item.matId,item))return {ok:false,reason:'ไม่มีช่องรับสินค้านี้'};
 const metadata={suppliedByNpcId:seller.id,suppliedByNameTh:seller.name,suppliedAt:time(g),provenanceMode:'EXTERNAL_TRADE'};
 if(o.kind==='MATERIAL'){
  const r=depositMaterialLot(g,g.bank,item.matId,o.quantity,item,metadata);if(!r.ok)return {ok:false,reason:'ส่งมอบสินค้าไม่สำเร็จ'};
  item.count-=o.quantity;sl[key]=sl[key].filter(x=>x.count>0);
 }else if(o.kind==='SCROLL'){
  sl[key].splice(sl[key].indexOf(item),1);Object.assign(item,metadata,{ownerNpcId:null,ownerId:null,rights:'SECT_LIBRARY',access:'SECT',sourceType:'SECT_LIBRARY',libraryId:'outside_library_'+g.s.nextId++,originalOwnerNpcId:seller.id,purchasedAt:time(g)});g.s.growth.scriptureLibrary.push(item);
 }else{
  sl[key].splice(sl[key].indexOf(item),1);Object.assign(item,metadata,{ownerNpcId:g.bank.id,ownerId:g.bank.id,sectStore:false,storeCount:0});bl[key].push(item);
 }
 g.money(-o.totalStones,'ซื้อสินค้าคนนอก '+o.nameTh);E.addSpiritStonesV140(seller,o.totalStones);
 o.status='ACCEPTED';o.acceptedAt=time(g);o.authorityNpcId=authority.npc.id;
 s.history.unshift({...o});s.history.splice(40);
 E.syncLegacyArraysFromLedgerV140(g.bank);E.syncLegacyArraysFromLedgerV140(seller);invalidateMarketCache(g);
 log(g,authority.npc,'EXTERNAL_BUY',item,o.quantity,0,{stones:-o.totalStones,sellerName:seller.name});
 g.note(`${authority.npc.name} รับข้อเสนอ ${seller.name}: «${o.nameTh}» ×${o.quantity} · จ่ายหินวิญญาณ ${o.totalStones} กองกลาง`,authority.npc);
 return {ok:true,costStones:o.totalStones,quantity:o.quantity,reason:'รับสินค้าเข้าคลังและจ่ายหินวิญญาณแก่ผู้ขายแล้ว'};
}
function rejectExternalOffer(g,id){
 const o=externalState(g).offers.find(x=>x.id===id&&x.status==='PENDING');
 if(!o||time(g)>=o.expiresAt)return {ok:false,reason:'ไม่พบข้อเสนอที่ยังเปิดอยู่'};
 o.status='REJECTED';return {ok:true,reason:'ปฏิเสธข้อเสนอแล้ว คงหินวิญญาณไว้ในกองกลาง'};
}
function tickExternalMarket(g){
 const s=externalMarket(g);if(time(g)<s.nextDecisionAt)return;
 s.nextDecisionAt=time(g)+20;
 const auth=g.storyEvents.authorities()[0]?.npc,libAuth=root.JianghuSectLibrary?.authority(g);if(!auth&&!libAuth)return;
 if(s.autoProcure){
  const reserveStones=Math.max(100,Math.ceil(g.gold*.35));
  const proposals=s.offers.filter(o=>o.status==='PENDING'&&time(g)<o.expiresAt&&g.gold-o.totalStones>=reserveStones);
  const needs=proposals.map(o=>{
   if(o.kind==='SCROLL'){const evaluation=root.JianghuSectLibrary.assess(g,o);return {o,...evaluation};}
   if(!auth)return {o,score:-999};
   const count=o.kind==='MATERIAL'?g.count(g.bank,g.world.npcs[o.sellerNpcId].jianghu.ledgerV140.materialStacks.find(x=>x.id===o.itemId)?.matId):o.kind==='PILL'?g.bank.jianghu.ledgerV140.pillStacks.filter(p=>p.recipeId==='L14_remedy').reduce((s,p)=>s+p.count,0):g.bank.jianghu.ledgerV140.equipmentItems.length;
   const target=o.kind==='MATERIAL'?8:Math.max(2,g.heroes.filter(x=>x.alive).length);
   const thrift=((auth.core?.values?.wealthResource||50)-50)*.15;
   return {o,score:(target-count)*8-thrift-o.totalStones*.06};
  }).filter(x=>x.score>8).sort((a,b)=>b.score-a.score||a.o.totalStones-b.o.totalStones);
  if(needs.length)acceptExternalOffer(g,needs[0].o.id,needs[0].actor?.id||auth?.id);
 }
 if(s.autoSell!==false&&auth)autoSellSurplus(g,s,auth);
}

function tick(g){
 if(!g.s.storyEvents?.active)return;
 const s=state(g),now=time(g);
 tickExternalMarket(g);
 for(const n of g.heroes)if(g.life.member(n))account(g,n);
 if(now>=(s.storeCuratedAt||0)+15){
  if(!g.s.storyEvents?.sidequests?.active&&(g.built('alchemy')||g.built('forge')))ensureBasicSectRecipes(g);
  curateStore(g);
 }
}

function inspect(g){
 const s=g.s.storyEvents?.treasury?.contributions||{accounts:{},history:[]};
 const wishes=new Map((g.heroes||[]).filter(n=>n.alive).map(n=>[n.id,evaluateStoreDesires(g,n,false).topWish]));
 const store=storeInventory(g);
 const treasury=treasuryInventory(g);
 const flywheel=computeMarketFlywheel(g);
 for(const item of store.all){
  const w=(g?.heroes||[]).filter(h=>h?.alive&&h.stageLocal?.storeWish?.kind===item.kind&&h.stageLocal?.storeWish?.id===item.id).map(h=>({npcId:h.id,name:h.name,canAfford:h.stageLocal.storeWish.canAfford,deficit:h.stageLocal.storeWish.deficit}));
  item.wantedBy=w;
  item.demandCount=w.length;
 }
 const visibleRecipes=new Set([...FREE_SECT_RECIPES,...FORTUITOUS_RECIPES,...g.heroes.filter(n=>n.alive).flatMap(n=>n.stageLocal?.growth?.knownRecipes||[])]);
 const craftableRecipes=(g.progression?.allRecipes?.()||[]).filter(r=>visibleRecipes.has(r.id)&&['alchemy','forge'].includes(r.workshop)&&!r.effect?.beastItem).map(r=>{
  const estItem={recipeId:r.id,tier:r.tier,quality:'COMMON'};
  const kind=r.effect?.slot?'EQUIPMENT':'PILL';
  const q=quote(g,kind,estItem,1);
  const bonusPct=flywheel.bonusByCategory?.[kind]||0;
  const baseLabor=Math.max(5*r.tier,Math.round(q.donation*0.65));
  const laborPts=baseLabor+Math.round(baseLabor*(bonusPct/100));
  const inputsRequired=new Map();for(const inp of r.inputs)inputsRequired.set(inp.matId,(inputsRequired.get(inp.matId)||0)+inp.count);
  const hasInputs=[...inputsRequired].every(([matId,count])=>treasuryMaterialAvailable(g,matId)>=count);
  return {
   id:r.id,
   nameTh:r.name,
   workshop:r.workshop,
   tier:r.tier,
   minMastery:r.min,
   isFreeBasic:FREE_SECT_RECIPES.includes(r.id),
   inputs:r.inputs.map(inp=>({matId:inp.matId,count:inp.count,inBank:treasuryMaterialAvailable(g,inp.matId)})),
   hasInputs,
   laborPoints:laborPts,
   demandBonusPct:bonusPct,
   storePrice:q.storePrice
  };
 });
 return {
  accounts:g.heroes.map(n=>({
   npcId:n.id,
   name:n.name,
   ...accountView(g,n),
   merit:g.life.member(n)?.merit||0,
   knownRecipes:n.stageLocal?.growth?.knownRecipes||[],
   storeWish:wishes.get(n.id)?{...wishes.get(n.id),balance:accountView(g,n).balance,canAfford:accountView(g,n).balance>=wishes.get(n.id).price}:null
  })),
  history:s.history,
  pointEconomy:Object.values(s.accounts).reduce((r,a)=>({issued:r.issued+(a.earned||0),retired:r.retired+(a.spent||0),circulating:r.circulating+(a.balance||0)}),{issued:0,retired:0,circulating:0}),
  externalTrade:s.externalTrade?{
   ...s.externalTrade,
   purchaseOrders:(s.externalTrade.orders||[]).map(o=>({...o,quote:quotePurchaseOrder(g,o.id)}))
  }:{autoProcure:true,autoSell:true,offers:[],orders:[],purchaseOrders:[],sales:[],history:[],nextVisitAt:null},
  storeInventory:store,
  treasuryInventory:treasury,
  sectWorkshopRecipes:craftableRecipes,
  flywheel
 };
}

root.JianghuSectContributions={
 VERSION:2,
 FREE_SECT_RECIPES,
 FORTUITOUS_RECIPES,
 CARAVAN_GUILDS,
 colorMeta,
 recordTransaction:log,
 quote,
 supplyQuote,
 prepareStock,
 transferStock,
 externalMarket,
 acceptExternalOffer,
 rejectExternalOffer,
 orderReserve,
 quotePurchaseOrder,
 sellToPurchaseOrder,
 account,
 ensureBasicSectRecipes,
 tryFortuitousRecipeDiscovery,
 curateStore,
 transferToStore,
 returnToTreasury,
 storeInventory,
 treasuryInventory,
 computeMarketFlywheel,
 buyFromStore,
 canCraftForSect,
 craftForSect,
 evaluateStoreDesires,
 economicWorkload,
 acquire,
 autoMethod,
 grantEligibility,
 transferFlags,
 creditWork,
 donate,
 creditLibraryDonation,
 reserve,
 prepareRedemption,
 commitRedemption,
 options,
 finish,
 tick,
 inspect,
 actionLabel,
 workActivity
};
})(typeof globalThis!=='undefined'?globalThis:this);
