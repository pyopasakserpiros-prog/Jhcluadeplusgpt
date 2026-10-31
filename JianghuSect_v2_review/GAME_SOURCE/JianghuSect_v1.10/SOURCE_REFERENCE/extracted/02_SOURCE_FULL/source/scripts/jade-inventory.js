/* Paginated, read-only inventory. Never call simulation mutators from this view. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.JianghuInventory1222=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const PAGE_SIZE=20;
const CATEGORIES=[['ALL','ทั้งหมด'],['PILL','โอสถ'],['WEAPON','อาวุธ'],['ARMOR','เกราะ'],['TALISMAN','เครื่องราง'],['MATERIAL','วัสดุ'],['SCROLL','คัมภีร์'],['BEAST','ของอสูร'],['RELIC','เทววัตถุ']];
const FAMILIES=['sword','saber','spear','dagger','staff','bow','hammer','armor','talisman','cauldron','pill','herb','ore','crystal','scroll','beast','liquid','venom','fan','instrument','brush','shield','gourd','relic'];
const FAMILY_LABELS={sword:'กระบี่',saber:'ดาบ',spear:'หอก / ทวน / ง้าว',dagger:'กริช / มีดสั้น',staff:'คทา / กระบอง',bow:'ธนู',hammer:'ค้อน',armor:'เกราะ / อาภรณ์',talisman:'ยันต์ / เครื่องราง',cauldron:'เตาหลอม / หม้อยา',pill:'โอสถ',herb:'สมุนไพร',ore:'แร่',crystal:'ผลึก',scroll:'คัมภีร์',beast:'ชิ้นส่วน / ของอสูร',liquid:'ของเหลววิญญาณ',venom:'พิษ / กู่',fan:'พัด',instrument:'เครื่องดนตรี',brush:'พู่กัน',shield:'โล่',gourd:'น้ำเต้า',relic:'วัตถุวิเศษ'};
const QUALITY={STANDARD:'มาตรฐาน',COMMON:'สามัญ',REFINED:'ประณีต',MASTERWORK:'ชั้นครู',PEERLESS:'ไร้เทียมทาน',PERFECT:'สมบูรณ์แบบ'};
const SLOT={WEAPON:'อาวุธ',ARMOR:'เกราะ',TALISMAN_VESSEL:'เครื่องราง / ภาชนะวิเศษ',MANTRA:'เคล็ดเดินปราณ',TECHNIQUE:'กระบวนท่าจู่โจม',LIGHTNESS:'วิชาตัวเบา',AUXILIARY:'วิชาเสริมคุ้มกาย',FORBIDDEN:'วิชาต้องห้าม'};
const PATH_NAMES={XIAN:'วิถีเซียนปราณ',BODY:'วิถีหลอมกายา',GOD:'วิถีเทวะศักดิ์สิทธิ์',DEMON:'วิถีมารอสูร',HEART_SOUL:'วิถีจิตวิญญาณและเซน',ANY:'ทุกวิถี'};
const EFFECT={
 cultivationProgress:'ความคืบหน้าบ่มเพาะ',progress:'ความคืบหน้าบ่มเพาะ',
 healHealth:'ฟื้นฟูสุขภาพ',heal:'ฟื้นฟูสุขภาพ',
 healInjury:'บรรเทาบาดเจ็บภายใน',healInternalInjury:'บรรเทาบาดเจ็บภายใน',pain:'ประคองบาดแผลและความเจ็บปวด',
 restoreQi:'ฟื้นคืนปราณต่อสู้',qiRestore:'ฟื้นคืนปราณต่อสู้',qiRegen:'ฟื้นฟูปราณ',
 clearHeartDemon:'สลายจิตมาร',heartDemonRelief:'สลายจิตมาร',heartDemon:'จิตมาร',
 clarityGain:'เพิ่มความกระจ่างของจิต',grief:'บรรเทาความโศกเศร้า',
 clearPoison:'ถอนพิษสะสม',poisonRelief:'ถอนพิษสะสม',healPoison:'ลดพิษ',
 purifyPillToxicity:'ชำระพิษโอสถสะสม',toxicityRelief:'ชำระพิษโอสถสะสม',cleanse:'ชำระพิษโอสถสะสม',
 toxicity:'พิษโอสถ',pillToxicity:'พิษโอสถสะสม',
 foundationBonus:'เสริมรากฐาน',foundationGain:'เสริมรากฐาน',foundationStability:'เสริมรากฐาน',
 daoComprehensionBonus:'ความเข้าใจเต๋า',daoComprehension:'ความเข้าใจเต๋า',
 lifespanBonus:'อายุขัยเพิ่ม (ปี)',lifespanBonusYears:'อายุขัยเพิ่ม (ปี)',lifespanGain:'อายุขัยเพิ่ม (ปี)',
 openMeridianBonus:'เปิดจุดชีพจร',
 combatMult:'เสริมพลังรบ',defenseMult:'เสริมการป้องกัน',studyBonus:'เสริมความเข้าใจคัมภีร์',
 craftBonusScore:'เสริมฝีมืองานช่าง',cultivationSpeedMult:'ความเร็วบ่มเพาะ',
 pillPotencyBonusPct:'เสริมฤทธิ์โอสถ (%)',breakthroughBonus:'เสริมโอกาสทะลวง',
 chanceBonus:'เสริมโอกาสทะลวงด่าน',tribulationResist:'ต้านทานฟ้าทัณฑ์',tribulationResistance:'ต้านฟ้าทัณฑ์',
 healCompanion:'ฟื้นฟูอสูรคู่หู',trustGain:'เพิ่มความไว้ใจอสูร',healQiDeviation:'ลดปราณคลาดเคลื่อน'
};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(x,d=0)=>Number.isFinite(Number(x))?Number(x):d;
const fmt=x=>num(x).toLocaleString('th-TH',{maximumFractionDigits:2});
const values=o=>Object.values(o||{});
const catName=c=>CATEGORIES.find(x=>x[0]===c)?.[1]||'ไอเทม';
function rarity(E,tier){const t=Math.max(1,Math.min(8,Math.floor(num(tier,1))));const v112=globalThis.JianghuExpansionV112?.rarityGradesV112?.[t];if(v112&&t<=7)return {tier:t,color:v112.color,border:v112.color,shortTh:v112.badgeTh,bg:'rgba(255,255,255,.06)'};return t===8?{tier:8,color:'#ffe9ac',border:'#ffe9ac',shortTh:'เทววัตถุ',bg:'rgba(255,233,172,.14)'}:{...(E.RARITY_TIERS_7||[])[t-1],tier:t,color:E.RARITY_TIERS_7?.[t-1]?.color||['#f8fafc','#4ade80','#38bdf8','#c084fc','#facc15','#fb923c','#f43f5e'][t-1]};}
function family(item){
 const raw=item.raw||item,def=item.def||{},s=String(raw.artifactForm||raw.weaponType||raw.subType||raw.form||def.outputSubSlot||'').toUpperCase(),name=String(item.nameTh||raw.nameTh||def.outputNameTh||'');
 if(item.category==='PILL')return 'pill';if(item.category==='SCROLL')return 'scroll';if(item.category==='BEAST')return 'beast';
 if(item.category==='MATERIAL')return ({HERB:'herb',ORE:'ore',CRYSTAL:'crystal',BEAST_PART:'beast',TALISMAN_MAT:'talisman',SPIRIT_LIQUID:'liquid',VENOM_GU:'venom',HERITAGE_RELIC:'relic',RELIC_ESSENCE:'relic'})[raw.category||def.category]||'crystal';
 if(/DAGGER/.test(s)||/กริช|มีดสั้น/.test(name))return 'dagger';
 if(/SABER|DAO_BLADE/.test(s)||/ดาบ/.test(name))return 'saber';
 if(/SWORD|JIAN/.test(s)||/กระบี่/.test(name))return 'sword';
 if(/SPEAR|HALBERD/.test(s)||/ทวน|หอก|ง้าว/.test(name))return 'spear';
 if(/BOW/.test(s)||/ธนู/.test(name))return 'bow';
 if(/HAMMER/.test(s)||/ค้อน/.test(name))return 'hammer';
 if(/STAFF/.test(s)||/คทา|กระบอง|ไม้เท้า/.test(name))return 'staff';
 if(/CAULDRON|MEDICINE_POT/.test(s)||/เตา|กระถาง|หม้อโอสถ/.test(name))return 'cauldron';
 if(/SHIELD/.test(s)||/โล่/.test(name))return 'shield';
 if(/GOURD/.test(s)||/น้ำเต้า/.test(name))return 'gourd';
 if(/FAN/.test(s)||/พัด/.test(name))return 'fan';
 if(/BRUSH/.test(s)||/พู่กัน/.test(name))return 'brush';
 if(/ZITHER|FLUTE/.test(s)||/พิณ|ขลุ่ย/.test(name))return 'instrument';
 if(item.category==='ARMOR'||/ARMOR|ROBE/.test(s)||/เกราะ|อาภรณ์|เสื้อคลุม/.test(name))return 'armor';
 return item.category==='TALISMAN'?'talisman':'relic';
}
function iconSpec(item){const match=/^RELIC_T8_(\d{3})$/.exec(item.catalogId||item.raw?.id||'');if(item.category==='RELIC'&&match&&+match[1]>=1&&+match[1]<=28){const i=+match[1]-1;return {atlas:'relics',index:i,columns:7,rows:4,x:(i%7)*100/6,y:Math.floor(i/7)*100/3};}const t=num(item.tier,1),band=t<=3?0:t<=5?1:2,i=FAMILIES.indexOf(family(item))+24*band;return {atlas:'items',index:i,columns:8,rows:9,x:(i%8)*100/7,y:Math.floor(i/8)*100/8};}
function icon(item,extra=''){const s=iconSpec(item);return `<span class="i1222-icon ${extra}" data-atlas="${s.atlas}" data-icon-index="${s.index}" style="--ix:${s.x}%;--iy:${s.y}%" aria-hidden="true"></span>`;}
function localRecipeMap(w){
 const map=new Map(Object.entries(w?.jianghu?.systemsV140?.recipes?.registry||{}));
 for(const r of (globalThis.LivingProgression?.RECIPES||[]))if(r?.id)map.set(r.id,{...r,outputNameTh:r.outputNameTh||r.name});
 for(const d of (globalThis.LivingAcademy?.prototype?.designs||[]))if(d?.recipe?.id)map.set(d.recipe.id,{...d.recipe,outputNameTh:d.recipe.outputNameTh||d.recipe.name});
 return map;
}
function collect(E,w,n){
 if(typeof n==='string')n=w?.npcs?.[n];if(!n?.jianghu)return [];
 const j=n.jianghu,l=j.ledgerV140||{},result=[],mats=new Map((E.PATCH140_DATA?.MATERIALS_REGISTRY_V140||[]).map(x=>[x.id,x])),recipes=localRecipeMap(w),artDefs=new Map([...(E.getAllTechniquesCatalogV190?.()||[]),...(globalThis.JianghuExpansionV112?.manualsV112||[])].map(x=>[x.id,x]));
 function stacks(list,category,idField,defs){const grouped=new Map();for(const [index,raw] of (list||[]).entries()){
  if(num(raw.count)<=0)continue;const id=raw[idField]||raw.id||'row-'+index,def=defs?.get?.(id)||recipes.get(raw.recipeId)||recipes.get(raw.catalogId)||{},tier=num(raw.tier,def.tier||1);
  // Same material and quality can be combined visually; pills and scrolls retain their physical stack identities.
  const key=category+':'+(category==='MATERIAL'?JSON.stringify([id,tier,raw.quality||'STANDARD',!!raw.isTranscendent,raw.nameTh]):id+':'+index);
  const prev=grouped.get(key);if(prev){prev.count+=num(raw.count);prev.sources.push(raw);continue;}
  const item={key,category,catalogId:id,nameTh:raw.nameTh||def.nameTh||def.outputNameTh||id,tier,quality:raw.quality||'STANDARD',count:num(raw.count),raw,def,owner:n,sources:[raw],equipped:false,natal:false};grouped.set(key,item);result.push(item);
 }}
 stacks(l.materialStacks,'MATERIAL','matId',mats);stacks(l.pillStacks,'PILL','id');stacks(l.scrolls,'SCROLL','artId',artDefs);stacks(l.beastItems,'BEAST','id');
 for(const [index,raw] of (l.equipmentItems||[]).entries()){
  const category=raw.slot==='WEAPON'?'WEAPON':raw.slot==='ARMOR'?'ARMOR':'TALISMAN';
  const eqCheck=globalThis.JianghuExpansionV112?.canEquipItem?globalThis.JianghuExpansionV112.canEquipItem(n,raw):{ok:true};
  result.push({key:'EQUIPMENT:'+raw.id+':'+index,catalogId:raw.id,category,nameTh:raw.nameTh||'ศาสตราไร้นาม',tier:num(raw.tier,1),quality:raw.quality||'STANDARD',count:1,raw,def:recipes.get(raw.recipeId)||recipes.get(raw.catalogId)||{},owner:n, eligibility:eqCheck,sources:[raw],equipped:Object.values(j.equipmentV140||{}).includes(raw.id),natal:j.natalArtifactV1220?.itemId===raw.id});
 }
 // Registry is authoritative for singleton relic ownership, not legacy artifact mirrors.
 const catalog=new Map((E.SUPREME_RELICS_CATALOG_28||[]).map(d=>[d.id,d]));
 for(const r of values(w.jianghu?.supremeRelicsV1?.relics)){if(r.ownerId!==n.id||r.status!=='HELD_BY_OWNER')continue;const def=catalog.get(r.id);if(!def)continue;result.push({key:'RELIC:'+r.id,catalogId:r.id,category:'RELIC',nameTh:def.nameTh,tier:8,quality:'UNIQUE',count:1,raw:r,def,owner:n,sources:[r],equipped:false,natal:false});}
 return result;
}
function page(items,state={}){
 const category=CATEGORIES.some(c=>c[0]===state.category)?state.category:'ALL',q=String(state.query||'').trim().toLocaleLowerCase('th');
 const filtered=items.filter(x=>(category==='ALL'||x.category===category)&&(!state.tier||state.tier==='ALL'||x.tier===num(state.tier))&&(!state.family||state.family==='ALL'||family(x)===state.family)&&(!state.quality||state.quality==='ALL'||x.quality===state.quality)&&(!state.status||state.status==='ALL'||state.status==='EQUIPPED'&&x.equipped||state.status==='UNEQUIPPED'&&['WEAPON','ARMOR','TALISMAN'].includes(x.category)&&!x.equipped||state.status==='NATAL'&&x.natal||state.status==='TRANSCENDENT'&&(x.raw.isTranscendent||x.category==='RELIC'))&&(!q||[x.nameTh,x.catalogId,catName(x.category),FAMILY_LABELS[family(x)],x.raw.category,x.raw.element,x.def.element,x.raw.rarityBadgeTh,x.def.rarityBadgeTh].some(s=>String(s||'').toLocaleLowerCase('th').includes(q))));
 filtered.sort((a,b)=>state.sort==='NAME'?a.nameTh.localeCompare(b.nameTh,'th')||a.key.localeCompare(b.key):state.sort==='COUNT'?b.count-a.count||b.tier-a.tier||a.nameTh.localeCompare(b.nameTh,'th'):b.tier-a.tier||a.nameTh.localeCompare(b.nameTh,'th')||a.key.localeCompare(b.key));
 const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE)),current=Math.max(1,Math.min(pages,Math.floor(num(state.page,1))));
 return {items:filtered.slice((current-1)*PAGE_SIZE,current*PAGE_SIZE),total:filtered.length,pages,current,category,counts:Object.fromEntries(CATEGORIES.map(([c])=>[c,items.filter(x=>c==='ALL'||x.category===c).length]))};
}
function detailRows(item){
 const r=item.raw,d=item.def,rows=[];const add=(k,v)=>{if(v!==undefined&&v!==null&&v!=='')rows.push([k,String(v)]);};
 add('ประเภท',catName(item.category));if(item.category!=='RELIC')add('คุณภาพ',r.rarityBadgeTh||d.rarityBadgeTh||QUALITY[item.quality]||item.quality);add('จำนวน',fmt(item.count));add('ธาตุ',r.element||d.element);if(r.slot||d.slotType)add('ช่องสวมใส่',SLOT[r.slot||d.slotType]||r.slot||d.slotType);
 if(r.maxDurability!==undefined)add('ความทนทาน',fmt(r.durability)+' / '+fmt(r.maxDurability));if(r.starLevel)add('การตีทบ',r.starLevel+' ดาว');
 if(r.combatMult!==undefined)add('เสริมพลังรบ',fmt(r.combatMult*100)+'%');if(r.defenseMult!==undefined)add('เสริมการป้องกัน',fmt(r.defenseMult*100)+'%');
 if(r.studyBonus)add('เสริมความเข้าใจคัมภีร์',fmt(r.studyBonus*100)+'%');
 const reqStage=r.minStageReq||(item.category==='WEAPON'||item.category==='ARMOR'||item.category==='TALISMAN'?Math.max(1,Math.floor(((r.tier||item.tier||1)+1)/2)):null);
 if(reqStage)add('ขั้นที่ต้องการ',reqStage);if(r.compatiblePath||d.path)add('วิถีที่รองรับ',PATH_NAMES[r.compatiblePath||d.path]||r.compatiblePath||d.path);
 if(item.eligibility&&!item.eligibility.ok&&item.owner?.stageLocal?.role==='disciple')add('ความพร้อมสวมใส่','ยังไม่พร้อม ('+item.eligibility.reason+')');
 if(r.craftBonusPath)add('เสริมงานช่าง',r.craftBonusPath+' +'+fmt(r.craftBonusScore));
 if(r.weaponSpirit)add('จิตศาสตรา',r.weaponSpirit.nameTh||'ตื่นรู้แล้ว');if(r.runeNameTh)add('อักขระ',r.runeNameTh);
 if(item.equipped)add('สถานะ','กำลังสวมใส่');if(item.natal)add('พันธะ','ศาสตราคู่ชีวิต');if(r.isTranscendent)add('ต้นกำเนิด','ของเหนือโลก');
 if(item.category==='RELIC'){add('คุณสมบัติ','หนึ่งเดียวในโลก · ไม่อาจผลิต · ไม่มีวันพัง');add('การส่งต่อ',d.transferMode==='SOULBOUND_UNTRANSFERABLE'?'ผูกวิญญาณ ไม่อาจส่งต่อ':'เปลี่ยนมือได้ตามเหตุการณ์จริง');add('ลักษณะ',d.descriptionTh);}
 if(item.category==='MATERIAL'){add('หมวดวัสดุ',d.subCategoryTh||r.category||d.category);if(d.baseValueStones!==undefined)add('มูลค่าฐาน / ชิ้น',fmt(d.baseValueStones)+' หินวิญญาณ');add('คุณสมบัติ',d.propertiesTh);add('การนำไปใช้',d.futureUsesTh);}
 if(item.category==='SCROLL'){
  if(d.rarityNameTh)add('ระดับคัมภีร์',d.rarityNameTh);
  if(d.power)add('อานุภาพพื้นฐาน',fmt(d.power));
  if(d.costs?.qiCost)add('ปราณที่ใช้ร่าย',fmt(d.costs.qiCost)+' ปราณ');
  if(Array.isArray(d.moves)&&d.moves.length)add('กระบวนท่า',d.moves.map(m=>typeof m==='string'?m:m.nameTh).join(' · '));
  add('หลักวิชา',d.principlesTh||d.loreTh);
  if(r.basePriceStones||d.scrollBasePriceStones)add('มูลค่าฐาน / ฉบับ',fmt(r.basePriceStones||d.scrollBasePriceStones)+' หินวิญญาณ');
 }
 return rows;
}
function detail(item,tab){
 const r=item.raw,d=item.def,rows=detailRows(item);const table=entries=>`<dl class="i1222-facts">${entries.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
 if(tab==='effects'){
  const rawEff={...(d.effect||{}),...(r.livingEffect||{}),...(r.effect||{})};
  const seenLabels=new Set();
  const effects=[];
  for(const [k,v] of Object.entries(rawEff)){
   if(typeof v!=='number')continue;
   const label=EFFECT[k]||k;
   if(seenLabels.has(label))continue;
   seenLabels.add(label);
   effects.push([label,fmt(v)]);
  }
  const abilities=(d.abilities||[]).map(a=>`<article class="i1222-ability"><h4>${esc(a.nameTh)}</h4><p>${esc(a.descTh)}</p></article>`).join('');
  const shown=effects.length?effects:rows.filter(([k])=>/เสริม|ความทน|อักขระ|จิตศาสตรา|การนำไปใช้|คุณสมบัติ|หลักวิชา|อานุภาพ|ปราณที่ใช้|กระบวนท่า|ระดับคัมภีร์/.test(k));
  const eligibilityWarn=item.eligibility&&!item.eligibility.ok&&item.owner?.stageLocal?.role==='disciple'?`<p class="i1222-warning">ยังไม่ผ่านเกณฑ์สวมใส่: ${esc(item.eligibility.reason)}</p>`:'';
  return (abilities||(shown.length?table(shown):'<p class="i1222-muted">ไม่มีผลเพิ่มเติมที่ระบุไว้ในข้อมูลของชิ้นนี้</p>'))+eligibilityWarn+(r.curseTh?`<p class="i1222-warning">ข้อจำกัด: ${esc(r.curseTh)}</p>`:'');
 }
 if(tab==='origin'){
  const entries=[['รหัสไอเทม',item.catalogId]];if(r.makerNameTh)entries.push(['ผู้สร้าง',r.makerNameTh]);if(r.originatorSeal)entries.push(['ตราผลงาน','ตราต้นตำรับ']);if(r.originLabelTh||d.originTag)entries.push(['แหล่งที่มา',r.originLabelTh||d.originTag]);if(r.poolNameTh)entries.push(['ตารางวาสนา',r.poolNameTh]);if(d.outputNameTh||d.name)entries.push(['ตำรับ',d.nameTh||d.name||r.recipeId]);
  const origins=[...new Set(item.sources.map(s=>s.originLabelTh||s.originType).filter(Boolean))];if(origins.length)entries.push(['แหล่งของกองที่รวม',origins.join(' · ')]);
  return table(entries)+(d.loreTh?`<p>${esc(d.loreTh)}</p>`:'')+(r.spirit?`<p class="i1222-warning">คำเรียกร้องจิตวัตถุ: ${esc(r.spirit.descTh)} · ครบกำหนดวันที่ ${fmt(r.spirit.deadlineTick)}</p>`:'');
 }
 return table(rows)+((d.descTh||d.descriptionTh||d.loreTh)?`<p>${esc(d.descTh||d.descriptionTh||d.loreTh)}</p>`:'');
}
function render(E,w,n,state){
 const items=collect(E,w,n),p=page(items,state);state.page=p.current;
 const options=(list,value)=>list.map(([id,label])=>`<option value="${esc(id)}" ${(value||'ALL')===String(id)?'selected':''}>${esc(label)}</option>`).join('');
 const selected=p.items.find(x=>x.key===state.selected)||null;if(!selected)state.selected=null;
 const r=selected&&rarity(E,selected.tier),st=state.detailTab||'overview';
 return `<header class="i1222-heading"><div><small>ถุงเฉียนคุน · ${esc(n.name)}</small><h3>คลังสมบัติ</h3></div><span class="i1222-money">หินวิญญาณ <b>${fmt(n.jianghu?.spiritStones)}</b></span></header>
 <div class="i1222-categories" role="tablist" aria-label="หมวดกระเป๋า">${CATEGORIES.map(([id,label])=>`<button type="button" role="tab" aria-selected="${p.category===id}" data-i1222-category="${id}">${label}<small>${fmt(p.counts[id])}</small></button>`).join('')}</div>
 <div class="i1222-tools"><label class="i1222-search"><span class="i1222-sr">ค้นหาไอเทม</span><input data-i1222-search type="search" placeholder="ค้นหาชื่อไอเทม…" value="${esc(state.query||'')}" autocomplete="off"></label><select data-i1222-sort aria-label="เรียงไอเทม">${[['TIER','ระดับสูงก่อน'],['NAME','ตามชื่อ'],['COUNT','จำนวนมากก่อน']].map(([id,label])=>`<option value="${id}" ${state.sort===id?'selected':''}>${label}</option>`).join('')}</select></div>
 <details class="i1222-filter-panel" ${state.filtersOpen?'open':''}><summary>ตัวกรอง · ระดับ / ประเภท / คุณภาพ / สถานะ${['tier','family','quality','status'].some(k=>state[k]&&state[k]!=='ALL')?' · ใช้งานอยู่':''}</summary><div class="i1222-filters"><label>ระดับ<select data-i1222-filter="tier" aria-label="กรองระดับ">${options([['ALL','ทุกระดับ'],...Array.from({length:8},(_,i)=>[String(i+1),`${i+1} · ${rarity(E,i+1).shortTh||''}`])],state.tier)}</select></label><label>ประเภทย่อย<select data-i1222-filter="family" aria-label="กรองประเภทย่อย">${options([['ALL','ทุกประเภท'],...FAMILIES.filter(f=>items.some(x=>(p.category==='ALL'||x.category===p.category)&&family(x)===f)).map(f=>[f,FAMILY_LABELS[f]])],state.family)}</select></label><label>คุณภาพ<select data-i1222-filter="quality" aria-label="กรองคุณภาพ">${options([['ALL','ทุกคุณภาพ'],...[...new Set(items.map(x=>x.quality))].map(q=>[q,QUALITY[q]||(q==='UNIQUE'?'หนึ่งเดียว':q)])],state.quality)}</select></label><label>สถานะ<select data-i1222-filter="status" aria-label="กรองสถานะ">${options([['ALL','ทุกสถานะ'],['EQUIPPED','กำลังสวมใส่'],['UNEQUIPPED','อุปกรณ์ที่ยังไม่สวม'],['NATAL','ศาสตราคู่ชีวิต'],['TRANSCENDENT','ของเหนือโลก / เทววัตถุ']],state.status)}</select></label></div><button type="button" class="i1222-filter-reset" data-i1222-reset>ล้างตัวกรองและคำค้น</button></details>
 <div class="i1222-instruction"><span>${catName(p.category)} · ${fmt(p.total)} รายการ</span><span>แตะช่องเพื่อดูข้อมูล</span></div>
 <div class="i1222-slots" role="group" aria-label="ช่องไอเทม หน้า ${p.current}">${p.items.map(item=>{const t=rarity(E,item.tier),disabledEq=item.eligibility&&!item.eligibility.ok&&item.owner?.stageLocal?.role==='disciple';return `<button type="button" class="i1222-slot ${item.category==='RELIC'?'i1222-divine':''} ${disabledEq?'i1222-ineligible':''}" data-i1222-item="${esc(item.key)}" aria-pressed="${state.selected===item.key}" aria-label="${esc(item.nameTh)} ระดับ ${item.tier} จำนวน ${item.count}${item.equipped?' กำลังสวมใส่':''}${item.natal?' ศาสตราคู่ชีวิต':''}${disabledEq?' ยังไม่ถึงเกณฑ์สวมใส่':''}" title="${esc(item.nameTh+(disabledEq?' ('+item.eligibility.reason+')':''))}" style="--rarity:${t.color}">${icon(item)}<span class="i1222-tier">${item.tier===8?'✦':item.tier}</span>${item.equipped||item.natal?`<span class="i1222-equipped" aria-hidden="true">${item.natal?'◆':'✓'}</span>`:''}<span class="i1222-quantity">${item.count>1?fmt(item.count):''}</span></button>`;}).join('')}${p.items.length?Array.from({length:PAGE_SIZE-p.items.length},()=>'<span class="i1222-slot i1222-empty" aria-hidden="true"></span>').join(''):'<p class="i1222-no-items">ไม่มีไอเทมตรงกับหมวดหรือคำค้นนี้</p>'}</div>
 <div class="i1222-selected" aria-live="polite">${selected?`<b style="color:${r.color}">${esc(selected.nameTh)}</b><small>ระดับ ${selected.tier} · ${esc(r.shortTh||'')} · ${catName(selected.category)}${selected.equipped?' · สวมใส่อยู่':''}${selected.natal?' · ศาสตราคู่ชีวิต':''}${selected.eligibility&&!selected.eligibility.ok&&selected.owner?.stageLocal?.role==='disciple'?' · ยังไม่ถึงเกณฑ์สวมใส่':''}</small>`:'เลือกไอเทมเพื่อดูชื่อและรายละเอียดด้านล่าง'}</div>
 <nav class="i1222-pages" aria-label="เปลี่ยนหน้ากระเป๋า"><button type="button" data-i1222-page="${p.current-1}" ${p.current<=1?'disabled':''} aria-label="หน้าก่อนหน้า">‹</button><label>หน้า <select data-i1222-jump aria-label="เลือกหน้ากระเป๋า">${Array.from({length:p.pages},(_,i)=>`<option value="${i+1}" ${i+1===p.current?'selected':''}>${i+1}</option>`).join('')}</select> / ${p.pages}</label><button type="button" data-i1222-page="${p.current+1}" ${p.current>=p.pages?'disabled':''} aria-label="หน้าถัดไป">›</button></nav>
 <details class="i1222-legend"><summary>สีระดับไอเทม · เลขมุมซ้ายคือระดับ</summary><div>${Array.from({length:8},(_,i)=>{const t=rarity(E,i+1);return `<span style="--rarity:${t.color}"><i></i>${i+1} ${esc(t.shortTh||'')}</span>`;}).join('')}</div></details>
 ${selected?`<section class="i1222-detail" aria-label="รายละเอียดไอเทม" style="--rarity:${r.color}"><div class="i1222-grip" aria-hidden="true"></div><div class="i1222-detail-heading">${icon(selected)}<div><small>${catName(selected.category)} · ระดับ ${selected.tier}</small><h4>${esc(selected.nameTh)}</h4></div><button type="button" data-i1222-close aria-label="ปิดรายละเอียด">×</button></div><div class="i1222-detail-tabs" role="tablist" aria-label="รายละเอียดไอเทม">${[['overview','ข้อมูล'],['effects','คุณสมบัติ'],['origin','ที่มา']].map(([id,label])=>`<button type="button" role="tab" data-i1222-detail="${id}" aria-selected="${st===id}">${label}</button>`).join('')}</div><div class="i1222-detail-body" role="tabpanel" aria-label="${esc(({overview:'ข้อมูล',effects:'คุณสมบัติ',origin:'ที่มา'})[st]||'ข้อมูล')}">${detail(selected,st)}</div>${selected.category==='RELIC'?`<button type="button" class="i1222-codex-link" data-i1222-relic="${esc(selected.catalogId)}">เปิดทำเนียบเทววัตถุ ↗</button>`:''}</section>`:'<div class="i1222-detail-placeholder">✧ รายละเอียดไอเทมจะแสดงที่นี่</div>'}`;
}
function mount(ctx){
 let activeWorld=null;const states=new Map();
 function getState(w,id){if(activeWorld!==w){activeWorld=w;states.clear();}if(!states.has(id)){if(states.size>=120)states.delete(states.keys().next().value);states.set(id,{category:'ALL',query:'',sort:'TIER',page:1,pages:{},selected:null,detailTab:'overview',tier:'ALL',family:'ALL',quality:'ALL',status:'ALL',filtersOpen:false});}return states.get(id);}
 function draw(box,focus){const w=ctx.world(),n=w.npcs?.[box.dataset.npcId];if(!n)return;const s=getState(w,n.id);box.innerHTML=render(ctx.Engine,w,n,s);if(focus){const target=focus.itemKey?[...box.querySelectorAll('[data-i1222-item]')].find(el=>el.dataset.i1222Item===focus.itemKey):box.querySelector(focus.selector);target?.focus({preventScroll:true});if(target?.setSelectionRange&&focus.start!==undefined)try{target.setSelectionRange(focus.start,focus.end);}catch{}}}
 function savePage(s){s.pages[s.category]=s.page;}
 function post(){for(const box of document.querySelectorAll('[data-inventory1222]'))draw(box);}
 document.addEventListener('click',event=>{
  const b=event.target.closest('[data-i1222-item],[data-i1222-category],[data-i1222-page],[data-i1222-detail],[data-i1222-close],[data-i1222-relic],[data-i1222-reset]'),box=b?.closest('[data-inventory1222]');if(!box)return;
  const s=getState(ctx.world(),box.dataset.npcId);let focus=null;
  if(b.hasAttribute('data-i1222-category')){savePage(s);s.category=b.dataset.i1222Category;s.page=s.pages[s.category]||1;s.selected=null;s.family='ALL';focus={selector:'[data-i1222-category="'+s.category+'"]'};}
  else if(b.hasAttribute('data-i1222-page')){s.page=num(b.dataset.i1222Page,1);savePage(s);s.selected=null;focus={selector:'[data-i1222-jump]'};}
  else if(b.hasAttribute('data-i1222-item')){s.selected=b.dataset.i1222Item;s.detailTab='overview';focus={itemKey:s.selected};}
  else if(b.hasAttribute('data-i1222-detail')){s.detailTab=b.dataset.i1222Detail;focus={selector:'[data-i1222-detail="'+s.detailTab+'"]'};}
  else if(b.hasAttribute('data-i1222-close')){s.selected=null;focus={selector:'[data-i1222-category="'+s.category+'"]'};}
  else if(b.hasAttribute('data-i1222-relic')){ctx.openRelic?.(b.dataset.i1222Relic);return;}
  else if(b.hasAttribute('data-i1222-reset')){s.tier=s.family=s.quality=s.status='ALL';s.query='';s.page=1;s.pages={};s.selected=null;focus={selector:'[data-i1222-reset]'};}
  draw(box,focus);
 });
 document.addEventListener('input',event=>{const el=event.target,box=el.closest('[data-inventory1222]');if(!box||!el.hasAttribute('data-i1222-search'))return;const s=getState(ctx.world(),box.dataset.npcId);s.query=el.value;s.page=1;s.pages={};s.selected=null;draw(box,{selector:'[data-i1222-search]',start:el.selectionStart,end:el.selectionEnd});});
 document.addEventListener('change',event=>{const el=event.target,box=el.closest('[data-inventory1222]');if(!box)return;const s=getState(ctx.world(),box.dataset.npcId);let selector;if(el.hasAttribute('data-i1222-sort')){s.sort=el.value;s.page=1;s.pages={};s.selected=null;selector='[data-i1222-sort]';}else if(el.hasAttribute('data-i1222-jump')){s.page=num(el.value,1);savePage(s);s.selected=null;selector='[data-i1222-jump]';}else if(el.hasAttribute('data-i1222-filter')){const k=el.dataset.i1222Filter;if(!['tier','family','quality','status'].includes(k))return;s[k]=el.value;s.page=1;s.pages={};s.selected=null;s.filtersOpen=true;selector='[data-i1222-filter="'+k+'"]';}else return;draw(box,{selector});});
 document.addEventListener('toggle',event=>{const el=event.target;if(!el.classList?.contains('i1222-filter-panel'))return;const box=el.closest('[data-inventory1222]');if(box&&el.isConnected)getState(ctx.world(),box.dataset.npcId).filtersOpen=el.open;},true);
 return {post,states,getState};
}
function createState(){return {category:'ALL',query:'',sort:'TIER',page:1,pages:{},selected:null,detailTab:'overview',tier:'ALL',family:'ALL',quality:'ALL',status:'ALL',filtersOpen:false};}
return {PAGE_SIZE,CATEGORIES,FAMILIES,rarity,family,iconSpec,icon,collect,page,detailRows,detail,render,mount,createState};
});
/* Dossier navigation preserves existing nodes, listeners and all original text. */
