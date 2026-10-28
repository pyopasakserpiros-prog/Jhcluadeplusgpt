/* Living provenance 1.16. Gameplay extensions use the locked HumanCore and the
   canonical world NPCs. Rumours, possessions, permissions and route knowledge
   are learned state, never new identity axes. */
(function(root){'use strict';
const H=root.HumanCore,E=root.World2026Engine;
const alive=n=>!!n&&n.alive&&n.health>0,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const TRADITIONS={XIAN:['SWORD_IMMORTAL','FIVE_ELEMENTS','ELIXIR_DAO','ASTRAL_ARRAY'],BODY:['TIGER_SOVEREIGN','VAJRA_BODHI','SOLAR_FORGE'],GOD:['WAR_DEITY','MERCY_DEITY','HARVEST_EARTH_GOD']};
const LABELS={hearRumor:'สืบฟังข่าวลือ',investigateRumor:'ตามรอยเบาะแสมรดก',decipherInheritance:'ถอดความมรดกเร้นลับ',adoptInheritance:'เริ่มฝึกวิถีจากมรดก',giftScripture:'มอบมรดกส่วนตัวให้สหาย',lureBeast:'นำเหยื่อไปล่ออสูร'};
for(const [id,basis] of Object.entries({hearRumor:'social',investigateRumor:'scout',decipherInheritance:'readScripture',adoptInheritance:'train',giftScripture:'donateScripture',lureBeast:'tameCompanion'})){
 H.registerActivity({...H.descriptor(basis),id,label:LABELS[id],skillDomain:id==='giftScripture'?'transmission':id==='lureBeast'?'beastBond':'heritage',...(id==='decipherInheritance'?{interestWeights:{analysis:.45,exploration:.3,tranquility:.25},cognitiveWeights:{reasoning:.35,attention:.35,verbalComprehension:.3}}:{}),...(id==='giftScripture'?{valueWeights:{familyClan:.3,honorLegacy:.3,knowledgeCraft:.2},personalityWeights:{empathy:.3,trustfulness:.2,loyalty:.2}}:{})});
}
const SPOTS=[
 {name:'รอยกระบี่ใต้เถาวัลย์',x:3070,y:900,poolId:'POOL_SWORD_CLIFF_STELA',danger:38},
 {name:'เสียงระฆังในเรือนร้าง',x:1700,y:1920,poolId:'POOL_ZEN_HEART_PAVILION',danger:15},
 {name:'แท่นโลหิตริมผาทมิฬ',x:2830,y:880,poolId:'POOL_NETHER_ABYSS_ALTAR',danger:60},
 {name:'เตาหลอมที่ถูกฝัง',x:2820,y:1490,poolId:'POOL_ANCIENT_BLOOD_FORGE',danger:40},
 {name:'ศาลฟ้าไร้ผู้บูชา',x:2150,y:2480,poolId:'POOL_CELESTIAL_SHRINE_RELIC',danger:30}
];
class Discovery{
 constructor(g){this.g=g;if(!g.s.discovery)g.s.discovery={schema:1,nextId:1,rumors:[],events:[],arts:{},routes:{},nextRumorAt:40};this.data=g.s.discovery;for(const n of g.heroes)this.state(n);if(this.data.schema!==1||!Array.isArray(this.data.rumors)||!Array.isArray(this.data.events))throw Error('ข้อมูลมรดกไม่ตรงรุ่น');}
 id(prefix){return prefix+'-'+this.data.nextId++;}
 state(n){return n.jianghu.heritageV115||(n.jianghu.heritageV115={routes:{},deciphered:{},foundationArts:{},lastRumorAt:-999,lastAdoptAt:-9999,history:[]});}
 routeKey(a){return a.path+':'+a.subPath;}
 sectArt(a){return !!a&&(this.g.s.growth.sectArtIds||[]).includes(a.id);}
 routeKnown(n,a){return !a.path||!a.subPath||(a.path===n.jianghu.path&&a.subPath===n.jianghu.subPath)||!!this.state(n).routes[this.routeKey(a)]||!!TRADITIONS[a.path]?.includes(a.subPath);}
 canStudy(n,a){return this.routeKnown(n,a)&&this.g.progression.compatible(n,a);}
 event(kind,n,data={}){const row={id:this.id('heritage'),t:this.g.s.t,kind,npcId:n.id,...data};this.data.events.unshift(row);this.data.events.splice(240);this.g.progression.receipt(kind,n,data);return row;}
 recordFind(n,item,context={}){
  const a=this.g.progression.artMap.get(item.artId);if(!a)return;
  const record=this.data.arts[a.id]||(this.data.arts[a.id]={artId:a.id,firstDiscovererId:n.id,discoveredAt:this.g.s.t,firstPractitionerId:null});
  item.discoveredByNpcId=n.id;item.discoveredAt=this.g.s.t;item.access='PRIVATE';item.canRedistribute=true;
  item.mediumTh=a.path==='HEART_SOUL'?['รอยฝันที่จารึกในหยก','ภาพเขียนที่ส่งผ่านนิมิต'][this.g.rng.int(0,1)]:a.path==='DEMON'?'ตราประทับโลหิตที่หลงเหลือจิตอาจารย์':a.path==='GOD'?'แผ่นคำสัตย์และเสียงสวดโบราณ':'คัมภีร์เก่าหรือรอยจารึกที่คัดกลับมา';
  item.provenance=[{kind:'DISCOVERY',at:this.g.s.t,npcId:n.id,origin:item.originLabelTh,...context}];
  this.event('inheritanceFound',n,{artId:a.id,itemId:item.id,origin:item.originLabelTh,mediumTh:item.mediumTh,firstDiscovererId:record.firstDiscovererId});
  this.g.remember(n,'investigateRumor',6,'ค้นพบมรดกส่วนตัว '+a.nameTh);
 }
 onTransfer(book,from,to,kind){
  book.provenance=book.provenance||[];book.provenance.push({kind,from:from?.id||null,to:to?.id||null,at:this.g.s.t});
  for(const journey of this.g.s.realm.journeys)if(journey.scroll&&(journey.scroll.itemId===book.id||journey.scroll.itemId===book.originalItemId)){journey.scroll.status=kind==='LIBRARY'?'LIBRARY':'GIFTED';journey.scroll.holderNpcId=to?.id||null;if(book.libraryId)journey.scroll.libraryId=book.libraryId;}
 }
 onLearned(n,a){
  let r=this.data.arts[a.id];if(!r&&!this.sectArt(a))r=this.data.arts[a.id]={artId:a.id,firstDiscovererId:n.id,discoveredAt:this.g.s.t,firstPractitionerId:null};
  if(r&&!r.firstPractitionerId){r.firstPractitionerId=n.id;r.practicedAt=this.g.s.t;this.event('firstPractitioner',n,{artId:a.id});this.g.note(n.name+' เป็นคนแรกในหุบเขาที่ฝึก «'+a.nameTh+'» สำเร็จ',n);}
  if(a.path&&a.subPath&&!TRADITIONS[a.path]?.includes(a.subPath)){const key=this.routeKey(a);if(!this.data.routes[key]){this.data.routes[key]={path:a.path,subPath:a.subPath,firstPractitionerId:n.id,at:this.g.s.t};this.event('firstRoutePractitioner',n,{path:a.path,subPath:a.subPath});}}
 }
 ensureAdoptionFoundation(n,path,subPath,book){
  const g=this.g,p=g.progression,j=n.jianghu,h=this.state(n);
  if(!h.foundationArts)h.foundationArts={};
  const bookArt=book?p.artMap.get(book.artId):null;
  if(bookArt&&bookArt.path===path&&(bookArt.requiredNormalizedTier||bookArt.tier||1)<=2){
   h.foundationArts[bookArt.id]=true;
  }
  const unlocked=[];
  for(const slot of ['mantra','technique']){
   const curId=j[slot+'Id'],curArt=curId?p.artMap.get(curId):null,curK=curId?j.knowledgeV190?.[curId]:null;
   if(curArt&&curK?.stage>=4&&p.compatible(n,curArt)&&((curArt.requiredNormalizedTier||curArt.tier||1)<=p.tier(n)||h.foundationArts[curArt.id]))continue;
   const existingLearned=Object.keys(j.knowledgeV190||{}).map(id=>p.artMap.get(id)).filter(a=>a&&p.slot(a)===slot&&p.compatible(n,a)&&j.knowledgeV190[a.id]?.stage>=4&&((a.requiredNormalizedTier||a.tier||1)<=p.tier(n)||h.foundationArts[a.id])).sort((a,b)=>(b.subPath===subPath)-(a.subPath===subPath)||(b.tier||1)-(a.tier||1))[0];
   if(existingLearned){
    j[slot+'Id']=existingLearned.id;
    j[slot+'NameTh']=existingLearned.nameTh;
    continue;
   }
   let candidates=p.arts.filter(a=>!a.innateRoute&&p.slot(a)===slot&&a.path===path&&(a.tier||1)<=2);
   if(!candidates.length)candidates=p.arts.filter(a=>!a.innateRoute&&p.slot(a)===slot&&p.compatible(n,a)&&(a.tier||1)<=2);
   candidates.sort((a,b)=>{
    const aIsBook=bookArt&&a.id===bookArt.id?1:0,bIsBook=bookArt&&b.id===bookArt.id?1:0;
    if(aIsBook!==bIsBook)return bIsBook-aIsBook;
    if((a.subPath===subPath)!==(b.subPath===subPath))return (b.subPath===subPath)-(a.subPath===subPath);
    return (a.tier||1)-(b.tier||1)||String(a.id).localeCompare(String(b.id));
   });
   const chosen=candidates[0];
   if(!chosen)continue;
   h.foundationArts[chosen.id]=true;
   if(bookArt&&chosen.id===bookArt.id&&(!j.knowledgeV190[chosen.id]||j.knowledgeV190[chosen.id].stage<4)){
    // Keep the discovered manual itself at stage 1 (reading 35) so reading it still triggers firstPractitioner upon completion,
    // while also granting a basic starter primer if another slot/primer exists, or equipping the primer!
    const alt=candidates.find(a=>a.id!==bookArt.id);
    if(alt){
     h.foundationArts[alt.id]=true;
     if(!j.knowledgeV190[alt.id]||j.knowledgeV190[alt.id].stage<4){
      j.knowledgeV190[alt.id]={artId:alt.id,stage:4,mastery:10,reading:100,redistribute:false,source:'INHERITANCE_FOUNDATION'};
      j.artMasteryV150[alt.id]=10;
      if(!j.knownArtIdsV150.includes(alt.id))j.knownArtIdsV150.push(alt.id);
     }
     j[slot+'Id']=alt.id;
     j[slot+'NameTh']=alt.nameTh;
     unlocked.push(alt.id);
     continue;
    }
   }
   if(!j.knowledgeV190[chosen.id]||j.knowledgeV190[chosen.id].stage<4){
    j.knowledgeV190[chosen.id]={artId:chosen.id,stage:4,mastery:10,reading:100,redistribute:false,source:'INHERITANCE_FOUNDATION'};
    j.artMasteryV150[chosen.id]=10;
    if(!j.knownArtIdsV150.includes(chosen.id))j.knownArtIdsV150.push(chosen.id);
   }
   j[slot+'Id']=chosen.id;
   j[slot+'NameTh']=chosen.nameTh;
   unlocked.push(chosen.id);
  }
  return unlocked;
 }
 releaseScore(n,book,recipient=null){
  if(!book||book.loan||book.rights==='LOAN'||book.canRedistribute===false||book.ownerNpcId&&book.ownerNpcId!==n.id)return -Infinity;
  const a=this.g.progression.artMap.get(book.artId),known=n.jianghu.knowledgeV190?.[book.artId];
  const selfSuit=(a&&!known?.stage||known?.stage<4)&&this.g.progression.scoreArtSuitability?this.g.progression.scoreArtSuitability(n,a):null;
  const selfNeedPenalty=(selfSuit?.fillsOpenSlot||selfSuit?.isComboCompleter)?-22:0;
  const peerFitBonus=(recipient&&a&&this.g.progression.scoreArtSuitability)?Math.max(0,this.g.progression.scoreArtSuitability(recipient,a).score)*.15:0;
  const rel=recipient?this.g.academy.relationship(n,recipient):{bond:0,affinity:0};
  return (n.core.values.sectDuty-50)*.22+(n.core.values.knowledgeCraft-50)*.12+(n.personality.empathy-50)*.18-(n.personality.ambition-50)*.16-(n.core.values.freedom-50)*.10+(known?.stage>=4?10:-14)+(a&&!this.g.progression.compatible(n,a)?9:0)+selfNeedPenalty+peerFitBonus+(rel.bond||0)*.30+(rel.affinity||0)*.12-(book.access==='PRIVATE'?12:0);
 }
 mayShare(n,book,to=null){return this.releaseScore(n,book,to)>=0;}
 mayCopy(n,artId){if(this.sectArt(this.g.progression.artMap.get(artId)))return true;const b=n.jianghu.ledgerV140.scrolls.find(b=>b.artId===artId&&!b.loan);return b?this.mayShare(n,b):n.jianghu.knowledgeV190?.[artId]?.redistribute===true;}
 rumor(n,source='เสียงเล่าที่ตลาด'){
  const h=this.state(n);if(this.g.s.t-h.lastRumorAt<100||this.data.rumors.some(r=>r.npcId===n.id&&['HEARD','TRACED'].includes(r.status)))return null;
  const spot=SPOTS[this.g.rng.int(0,SPOTS.length-1)],r={id:this.id('rumor'),npcId:n.id,source,...spot,status:'HEARD',createdAt:this.g.s.t,expiresAt:this.g.s.t+900,reliability:.45+this.g.rng.next()*.35,attempts:0,history:[{at:this.g.s.t,kind:'HEARD',source}]};
  this.data.rumors.push(r);this.data.rumors=this.data.rumors.filter(r=>['HEARD','TRACED'].includes(r.status)||this.g.s.t-(r.resolvedAt||r.expiresAt)<1800).slice(-100);h.lastRumorAt=this.g.s.t;
  this.event('rumorHeard',n,{rumorId:r.id,source,label:r.name});this.g.note(n.name+' ได้ข่าวลือเรื่อง'+r.name+' · ยังไม่มีผู้ยืนยัน',n);return r;
 }
 onExplore(n,source){if(alive(n)&&this.g.rng.next()<.38)this.rumor(n,source);}
 options(n,add){
  const g=this.g,p=n.stageLocal;if(!alive(n)||p.offmap||p.journey||p.mode==='combat'||p.needs.hunger>75||n.core.condition.fatigue>75||n.health<55||g.nearestEnemy(n,450))return;
  const hall=g.built('hall');if(!hall)return;const h=this.state(n),school=g.built('shrine')||g.built('training')||hall;
  const stSlot=g.progression?.inspectSlotAndComboState?.(n);const seekBoost=(stSlot?.openAttackSlots>0?6:0)+(stSlot?.unpairedSetups?.length?4:0);if(g.s.t-h.lastRumorAt>=100&&!this.data.rumors.some(r=>r.npcId===n.id&&['HEARD','TRACED'].includes(r.status)))add('hearRumor',28+seekBoost+p.needs.social*.24,{id:'market',x:600,y:2040},9,{curiosity:.3},{growthTarget:'market',reason:seekBoost?'สืบฟังเบาะแสคัมภีร์ยุทธ์เพื่อเติมช่องวิชาและต่อเคล็ดของตน':'ฟังข่าวจากพ่อค้าและคนเดินทาง · ข่าวอาจคลาดเคลื่อน'});
  for(const r of this.data.rumors.filter(r=>r.npcId===n.id&&['HEARD','TRACED'].includes(r.status)&&r.expiresAt>g.s.t)){
   if(g.realm.threatAt(r,260,n)||n.health<65||n.core.condition.fatigue>60)continue;
   add('investigateRumor',48+r.attempts*4,r,18,{curiosity:.3,courage:.2},{growthTarget:r.id,risk:r.danger,reason:(r.status==='HEARD'?'ตรวจข่าวลือ: ':'ตามรอยต่อ: ')+r.name+' · อาจเจอทางตัน อันตราย หรือมรดก'});
  }
  for(const b of [...n.jianghu.ledgerV140.scrolls,...g.s.growth.scriptureLibrary].filter(b=>b.artId&&!b.loan&&b.rights!=='LOAN')){
   const a=g.progression.artMap.get(b.artId);if(!a)continue;
   if(!this.routeKnown(n,a))add('decipherInheritance',54,g.endpoint(school),24,{curiosity:.3,discipline:.2},{growthTarget:b.id,reason:'ถอดความ'+(b.mediumTh||'มรดก')+' ก่อนตัดสินใจว่าจะฝึกวิถีนี้หรือไม่'});
   const key=this.routeKey(a),route=h.routes[key];
   if(route&&(a.path!==n.jianghu.path||a.subPath!==n.jianghu.subPath)&&g.s.t-h.lastAdoptAt>1200){
    const subAffinity=H.liking(n,'subpath:'+a.subPath)-H.liking(n,'subpath:'+n.jianghu.subPath);
    const pathAffinity=H.liking(n,'path:'+a.path)-H.liking(n,'path:'+n.jianghu.path);
    const curStage=n.jianghu.trackOrdinal||1;
    const conversionCost=(curStage-1)*8+(n.jianghu.cultivationProgress>75?6:0);
    const curiosityDrive=((n.personality?.curiosity||50)-50)*.18+((n.personality?.ambition||50)-50)*.12;
    const netFit=subAffinity*.55+pathAffinity*.25+curiosityDrive-conversionCost;
    if(curStage<=2||netFit>-6){
     add('adoptInheritance',clamp(34+netFit,12,68),g.endpoint(school),32,{curiosity:.3,courage:.2,caution:-.15},{growthTarget:b.id,reason:'มรดกเปิดวิถีใหม่ · ประเมินความสอดคล้องและรากฐานวิชาเริ่มต้นก่อนเปลี่ยนวิถี'});
    }
   }
   const recipient=g.heroes.filter(o=>o.id!==n.id&&alive(o)&&!o.stageLocal.offmap&&!o.stageLocal.journey&&o.jianghu.ledgerV140.scrolls.length<24&&!o.jianghu.ledgerV140.scrolls.some(x=>x.artId===b.artId)&&!o.jianghu.knowledgeV190?.[b.artId]&&this.mayShare(n,b,o)).sort((a,c)=>this.releaseScore(n,b,c)-this.releaseScore(n,b,a))[0];
   if(recipient&&n.jianghu.ledgerV140.scrolls.includes(b))add('giftScripture',36+Math.min(20,this.releaseScore(n,b,recipient)),{id:recipient.id,x:recipient.stageLocal.x,y:recipient.stageLocal.y},8,{empathy:.3,trustfulness:.2},{growthTarget:b.id,academyPartnerId:recipient.id,reason:'เลือกมอบมรดกส่วนตัวให้ '+recipient.name+' ตามความสัมพันธ์และความหวงแหน'});
  }
  const lure=n.jianghu.ledgerV140.beastItems?.some(b=>b.count>0&&b.effect?.lureRareBeast);
  if(lure&&n.health>85&&n.core.condition.fatigue<35){const habitat=g.s.ecology.habitats.filter(h=>(!h.requiresBuilding||g.built(h.requiresBuilding))&&g.s.beasts.filter(b=>b.alive&&b.habitatId===h.id).length<h.maxAlive).sort((a,b)=>dist(p,a)-dist(p,b))[0];if(habitat&&!g.realm.threatAt(habitat,300,n))add('lureBeast',40,habitat,12,{courage:.2,caution:.2},{growthTarget:habitat.id,risk:50,reason:'ใช้กำยานส่วนตัวล่ออสูร · ประเมินกำลังและจำนวนประชากรก่อน'});}
 }
 start(n,action){if(!LABELS[action])return;n.stageLocal.discoveryTicket={action,target:n.stageLocal.growthTarget,partnerId:n.stageLocal.academyPartnerId,done:false};}
 cancelTicket(n){if(n?.stageLocal?.discoveryTicket)n.stageLocal.discoveryTicket=null;}
 finish(n,action){
  if(!LABELS[action])return null;const g=this.g,p=n.stageLocal,t=p.discoveryTicket,fail={handled:true,success:false,cooldown:20};
  if(!t||t.done||t.action!==action||p.mode!=='working'||p.job>0||!p.target||dist(p,p.target)>140)return fail;t.done=true;const h=this.state(n);
  if(action==='hearRumor'){const r=this.rumor(n);return {handled:true,success:!!r,cooldown:100};}
  if(action==='investigateRumor'){
   const r=this.data.rumors.find(r=>r.id===t.target&&r.npcId===n.id);if(!r||!['HEARD','TRACED'].includes(r.status)||r.expiresAt<=g.s.t||dist(p,r)>140)return fail;
   r.attempts++;const cap=H.capacity(n,'investigateRumor').total,roll=g.rng.next();
   const hazard=clamp(r.danger/300-(cap-50)*.001,.025,.25);
   if(roll<hazard){g.damage(n,8+r.danger*.2,null);r.status='LOST';r.resolvedAt=g.s.t;r.history.push({at:g.s.t,kind:'DANGER',roll,hazard});g.note(n.name+' ตามข่าวลือแล้วเผชิญอันตราย ต้องยุติการค้นหา',n);}
   else if(r.status==='HEARD'&&roll<.72){r.status='TRACED';r.history.push({at:g.s.t,kind:'TRACED'});g.note(n.name+' พบหลักฐานที่สอดคล้องกับข่าวลือ แต่ยังไม่พบมรดก',n);}
   else if(roll<r.reliability+(cap-50)*.003){const book=g.progression.grantScroll(n,'ตามรอยข่าวลือ: '+r.name,n,{poolId:r.poolId,danger:r.danger,rumorId:r.id});if(!book){r.status='TRACED';return {handled:true,success:false,cooldown:45};}r.status='FOUND';r.itemId=book.id;r.artId=book.artId;r.resolvedAt=g.s.t;r.history.push({at:g.s.t,kind:'FOUND',itemId:book.id});g.note(n.name+' พบ'+book.mediumTh+' · «'+book.nameTh+'» เป็นมรดกส่วนตัว',n);}
   else {r.status='FALSE';r.resolvedAt=g.s.t;r.history.push({at:g.s.t,kind:'DEAD_END'});g.note(n.name+' ตรวจแล้วพบว่าข่าวเรื่อง'+r.name+' พาไปสู่ทางตัน',n);}
   this.event('rumorInvestigated',n,{rumorId:r.id,status:r.status,attempt:r.attempts,roll,hazard});H.learn(n,action,2);return {handled:true,success:true,cooldown:40};
  }
  const book=[...n.jianghu.ledgerV140.scrolls,...g.s.growth.scriptureLibrary].find(b=>b.id===t.target&&!b.loan&&b.rights!=='LOAN'),a=book&&g.progression.artMap.get(book.artId);
  if(action==='lureBeast'){const r=g.lureRareBeast(t.target,n.id);this.event('beastLured',n,{habitatId:t.target,success:r.ok,beastId:r.beast?.id});return {handled:true,success:r.ok,cooldown:100};}
  if(!book||!a)return fail;
  if(action==='decipherInheritance'){
   if(this.routeKnown(n,a))return fail;const key=this.routeKey(a),old=h.deciphered[book.id]||0,gain=clamp(22*H.learningRate(n,action),12,42);h.deciphered[book.id]=Math.min(100,old+gain);
   this.event('inheritanceDeciphered',n,{itemId:book.id,artId:a.id,progress:h.deciphered[book.id]});H.learn(n,action,2);
   if(h.deciphered[book.id]>=100){h.routes[key]={path:a.path,subPath:a.subPath,itemId:book.id,at:g.s.t};g.note(n.name+' ถอดความมรดกสำเร็จ เห็นทางสู่'+(E.CULTIVATION_PATHS[a.path]?.subPaths[a.subPath]?.nameTh||a.subPath)+' · ยังไม่ได้เปลี่ยนวิถี',n);}
   return {handled:true,success:true,cooldown:18};
  }
  if(action==='adoptInheritance'){
   if(!h.routes[this.routeKey(a)]||g.s.t-h.lastAdoptAt<=1200||!E.CULTIVATION_PATHS[a.path]?.subPaths[a.subPath])return fail;
   const previous={path:n.jianghu.path,subPath:n.jianghu.subPath,ordinal:n.jianghu.trackOrdinal,progress:n.jianghu.cultivationProgress};
   if(n.jianghu.breakthroughProjectV1200&&!['COMPLETE','ABORTED','FAILED'].includes(n.jianghu.breakthroughProjectV1200.phase)){
    E.cancelBreakthroughProjectV1200?.(g.world,n,'INHERITANCE_ADOPTION','เปลี่ยนวิถีบ่มเพาะตามมรดกที่ถอดความแล้ว');
   }
   n.jianghu.path=a.path;n.jianghu.subPath=a.subPath;E.syncNpcCultivationIdentityV1200(g.world,n,{trackOrdinal:1,progress:0});
   for(const slot of ['mantra','technique','lightness','auxiliary','forbidden'])if(!g.progression.compatible(n,g.progression.artMap.get(n.jianghu[slot+'Id']))){n.jianghu[slot+'Id']=null;n.jianghu[slot+'NameTh']=null;}
   const foundationUnlocked=this.ensureAdoptionFoundation(n,a.path,a.subPath,book);
   g.progression?.sanitizeEquippedItems?.(n);
   p.nextLoadoutAt=0;g.combatSystem?.ensure(n);g.combatSystem?.reconcileLoadout(n,{force:true});
   p.nextLoadoutAt=0;g.combatSystem?.ensure(n);g.combatSystem?.reconcileLoadout(n,{force:true});
   h.lastAdoptAt=g.s.t;h.history.push({at:g.s.t,from:previous,to:{path:a.path,subPath:a.subPath},itemId:book.id,foundationUnlocked});p.growth.nextPlan=0;E.invalidateNpcCoreCache(n);
   this.event('inheritanceAdopted',n,{artId:a.id,itemId:book.id,from:previous,path:a.path,subPath:a.subPath,foundationUnlocked});g.note(n.name+' ตัดสินใจเริ่มฝึก'+n.jianghu.subPathNameTh+' จาก'+book.mediumTh+' · เริ่มตบะวิถีใหม่ที่ขั้นต้นพร้อมรากฐานวิชามรดก',n);return {handled:true,success:true,cooldown:1200};
  }
  if(action==='giftScripture'){
   const other=g.world.npcs[t.partnerId];if(!n.jianghu.ledgerV140.scrolls.includes(book)||!alive(other)||other.stageLocal.offmap||other.stageLocal.journey||dist(p,other.stageLocal)>170||!this.mayShare(n,book,other)||other.jianghu.ledgerV140.scrolls.length>=24||other.jianghu.ledgerV140.scrolls.some(b=>b.artId===a.id))return fail;
   const yes=H.option(other,{id:'accept',baseScore:46+(g.progression.compatible(other,a)?12:0)},'decipherInheritance'),no=H.option(other,{id:'decline',baseScore:32},'rest');
   if(E.chooseNpcDecisionOption(g.world,other,[yes,no],{rng:g.rng,temperature:H.temperature(other),decisionTag:'PRIVATE_INHERITANCE_GIFT'}).chosenId!=='accept'){this.event('inheritanceGiftRefused',n,{recipientId:other.id,artId:a.id});return fail;}
   n.jianghu.ledgerV140.scrolls.splice(n.jianghu.ledgerV140.scrolls.indexOf(book),1);other.jianghu.ledgerV140.scrolls.push(book);book.ownerNpcId=other.id;this.onTransfer(book,n,other,'GIFT');
   this.event('inheritanceGifted',n,{recipientId:other.id,itemId:book.id,artId:a.id});g.note(n.name+' สมัครใจมอบ «'+a.nameTh+'» ให้ '+other.name+' · สิทธิ์ครอบครองย้ายตามมรดก',n);p.growth.nextPlan=0;other.stageLocal.growth.nextPlan=0;return {handled:true,success:true,cooldown:90};
  }
  return fail;
 }
 tick(){for(const r of this.data.rumors)if(['HEARD','TRACED'].includes(r.status)&&r.expiresAt<=this.g.s.t){r.status='EXPIRED';r.resolvedAt=this.g.s.t;}if(this.g.s.t>=this.data.nextRumorAt){this.data.nextRumorAt=this.g.s.t+100;const people=this.g.heroes.filter(n=>alive(n)&&!n.stageLocal.offmap);if(people.length)this.rumor(people[this.g.rng.int(0,people.length-1)],'ข่าวจากคนเดินทางผ่านหุบเขา');}}
 beforeHero(n){const p=n.stageLocal;if(p.action==='giftScripture'&&p.mode==='travel'&&this.g.s.t>=(p.repathGiftAt||0)){p.repathGiftAt=this.g.s.t+2;const o=this.g.world.npcs[p.discoveryTicket?.partnerId];if(alive(o)&&!o.stageLocal.offmap){p.target={id:o.id,x:o.stageLocal.x,y:o.stageLocal.y};p.route=this.g.path(p,p.target);}}}
}
root.LivingDiscovery={Discovery,TRADITIONS,LABELS};
})(typeof globalThis!=='undefined'?globalThis:this);
