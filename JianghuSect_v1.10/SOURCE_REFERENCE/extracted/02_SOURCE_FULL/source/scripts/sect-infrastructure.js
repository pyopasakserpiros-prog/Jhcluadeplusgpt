/* Sect infrastructure: paid, persistent construction improvements and need-driven officers.
   Loaded after stage.js; simulation integration is deliberately owned by the caller. */
(function(root){'use strict';
const data=root.FrontierData;if(!data?.B)throw Error('sect-infrastructure requires stage.js first');
const B=data.B,ORE=data.ORE||'MAT_ORE_BLACK_IRON_1';
Object.assign(B,{
 treasury:{name:'หอคลังสำนัก',icon:'▣',gold:220,wood:12,ore:8,time:26,size:155,hp:450,cap:4,desc:'ขยายช่องวัตถุดิบคลังสำนักและการช่วยเหลือพื้นฐาน ใช้วัตถุดิบและเงินสำนักจริง'},
 missionHall:{name:'หอภารกิจและคุณูปการ',icon:'📜',gold:180,wood:10,ore:5,time:24,size:155,hp:420,cap:4,desc:'เพิ่มช่องงานจัดหาและผลิตประเภทละ 1 คนต่อระดับ งานจ่ายแต้มจากผลงานจริง'},
 works:{name:'โรงช่างโยธา',icon:'⚒',gold:240,wood:14,ore:10,time:30,size:165,hp:520,cap:3,desc:'จัดงานโยธาให้การก่อสร้างและยกระดับอาคารเร็วขึ้น ไม่สร้างทรัพยากรขึ้นเอง'}
});
for(const d of Object.values(B))d.maxLevel=3;
const num=(v,f=0)=>Number.isFinite(v)?v:f,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const now=g=>num(g?.s?.t),buildings=g=>g?.s?.buildings||[],living=n=>!!(n?.alive&&n.health>0);
const level=b=>clamp(Math.floor(num(b?.level,1)),1,3),complete=b=>!!(b&&B[b.type]&&b.hp>0&&num(b.remaining)<=0);
const copy=x=>x==null?x:JSON.parse(JSON.stringify(x));
function maxHp(b){return (B[b?.type]?.hp||0)*(1+.25*(level(b)-1));}
function bonuses(g){
 const levels={};for(const b of buildings(g))if(complete(b))levels[b.type]=Math.max(levels[b.type]||0,level(b));
 const shrine=Math.max(0,(levels.shrine||0)-1),treasury=levels.treasury||0,workshop={};
 for(const type of ['alchemy','forge']){const extra=Math.max(0,(levels[type]||0)-1);workshop[type]={craftSkillBonus:4*extra,craftSpeed:1+.12*extra,skillBonus:4*extra,speed:1+.12*extra};}
 return {levels,libraryCapacity:120+40*shrine,materialCapacity:640+160*treasury,welfareDailyLimit:4+Math.max(0,treasury-1),perWorkshop:workshop,
  craftSkillBonus:{alchemy:workshop.alchemy.craftSkillBonus,forge:workshop.forge.craftSkillBonus},craftSpeed:{alchemy:workshop.alchemy.craftSpeed,forge:workshop.forge.craftSpeed},
  studySpeed:1+.1*shrine,extraDiscipleCapacity:2*Math.max(0,(levels.hall||0)-1),missionSlots:1+(levels.missionHall||0),extraEconomicWorkers:levels.missionHall||0,constructionSpeed:1+.15*(levels.works||0)};
}
function relatedRoles(type){return [({shrine:'scriptureElder',alchemy:'alchemyElder',forge:'forgeElder',works:'constructionElder',tower:'constructionElder',treasury:'steward',missionHall:'steward'})[type], 'constructionElder','steward','master'].filter((x,i,a)=>x&&a.indexOf(x)===i);}
function available(g,n){
 if(!living(n)||!(g.heroes||[]).some(h=>h?.id===n.id)||!n.stageLocal||n.stageLocal.offmap||n.stageLocal.action==='seclusion'||n.health<45||num(n.core?.condition?.fatigue)>=90)return false;
 if(num(g.s.life?.members?.[n.id]?.disgracedUntil)>now(g))return false;
 return !g.life?.available||g.life.available(n);
}
function authority(g,type,npcId=null){
 const offices=g.s.life?.offices||{};
 for(const role of relatedRoles(type)){const id=offices[role]?.npcId;if(!id||(npcId!=null&&id!==npcId))continue;const n=g.world?.npcs?.[id];if(available(g,n))return {npc:n,role};}
 return null;
}
function quoteUpgrade(g,id){
 const b=buildings(g).find(x=>x.id===id);let reason='';
 if(!b||!B[b.type])reason='ไม่พบอาคาร';else if(b.hp<=0)reason='อาคารถูกทำลาย';else if(num(b.remaining)>0)reason='ต้องก่อสร้างอาคารให้เสร็จก่อน';else if(b.upgrade)reason='อาคารกำลังยกระดับ';else if(level(b)>=3)reason='อาคารถึงระดับสูงสุด 3 แล้ว';else if(buildings(g).some(x=>x.upgrade))reason='สำนักกำลังยกระดับอาคารอื่นอยู่';
 if(reason)return {ok:false,reason,buildingId:id};
 const d=B[b.type],targetLevel=level(b)+1,cost=targetLevel===2?{stones:Math.ceil(d.gold*.9),wood:Math.ceil(d.wood*.8)+4,ore:Math.ceil(d.ore*.8)+4}:{stones:Math.ceil(d.gold*1.8),wood:Math.ceil(d.wood*1.4)+8,ore:Math.ceil(d.ore*1.4)+8};
 const duration=d.time*targetLevel/bonuses(g).constructionSpeed;
 if(num(g.gold)<cost.stones||num(g.s.wood)<cost.wood||num(g.count?.(g.bank,ORE))<cost.ore)reason='ศิลา ไม้ หรือแร่ที่เป็นสิทธิ์ของสำนักไม่เพียงพอ';
 const actor=authority(g,b.type);if(!reason&&!actor)reason='ต้องมีเจ้าสำนัก ผู้ดูแล หรือผู้อาวุโสที่รับผิดชอบและพร้อมปฏิบัติงาน';
 return {ok:!reason,reason,cost,duration,targetLevel,buildingId:id,actorId:actor?.npc.id||null,authorityRole:actor?.role||null};
}
function state(g){
 if(!g.s.infrastructure)g.s.infrastructure={schemaVersion:1,autoEnabled:true,lastTickAt:now(g),nextAutoAt:now(g)+40,history:[],lastDecision:null};
 const s=g.s.infrastructure;if(!Array.isArray(s.history))s.history=[];if(!Number.isFinite(s.lastTickAt))s.lastTickAt=now(g);if(!Number.isFinite(s.nextAutoAt))s.nextAutoAt=now(g)+40;return s;
}
function record(g,row){const s=state(g);s.history.unshift({t:now(g),...row});s.history.splice(60);}
function tradeoff(g,c){return `ใช้ ${c.stones} ศิลา · ไม้ ${c.wood} · แร่ ${c.ore} แลกความสามารถอาคาร เหลือ ${Math.floor(g.gold-c.stones)} ศิลา · ไม้ ${Math.floor(g.s.wood-c.wood)} · แร่ ${Math.floor(g.count(g.bank,ORE)-c.ore)}`;}
function requestUpgrade(g,id,authorityNpcId=null){
 const q=quoteUpgrade(g,id);if(!q.ok)return q;
 const b=buildings(g).find(x=>x.id===id),actor=authority(g,b.type,authorityNpcId);if(!actor)return {ok:false,reason:'ผู้สั่งการไม่มีอำนาจรับผิดชอบหรือยังไม่พร้อมปฏิบัติงาน'};
 // All validation is above this point. Native consume itself preflights every owned ore lot.
 if(!g.consume(g.bank,ORE,q.cost.ore))return {ok:false,reason:'แร่ที่เป็นสิทธิ์สำนักไม่เพียงพอ'};
 g.money(-q.cost.stones,'ยกระดับ '+B[b.type].name+' ระดับ '+q.targetLevel);g.s.wood-=q.cost.wood;
 const s=state(g);s.lastTickAt=now(g);b.level=level(b);b.maxHp=maxHp(b);
 b.upgrade={targetLevel:q.targetLevel,remaining:q.duration,total:q.duration,actorId:actor.npc.id,paidCost:{...q.cost}};
 const reason=actor.npc.name+' อนุมัติยกระดับ '+B[b.type].name+' เป็นระดับ '+q.targetLevel,remainingCost={stones:q.cost.stones,wood:q.cost.wood,ore:q.cost.ore};
 const costText=`ใช้ ${remainingCost.stones} ศิลา · ไม้ ${remainingCost.wood} · แร่ ${remainingCost.ore} เหลือ ${Math.floor(g.gold)} ศิลา · ไม้ ${Math.floor(g.s.wood)} · แร่ ${Math.floor(g.count(g.bank,ORE))}`;
 record(g,{kind:'START',buildingId:b.id,type:b.type,targetLevel:q.targetLevel,actorId:actor.npc.id,authorityRole:actor.role,cost:{...q.cost},reason,tradeoff:costText});g.note?.(reason+' · '+costText,actor.npc);
 return {...q,ok:true,actorId:actor.npc.id,authorityRole:actor.role,building:b};
}
function activeCrafters(g,type){
 return (g.heroes||[]).filter(n=>{
  if(!living(n)||n.stageLocal?.offmap)return false;const s=n.stageLocal,a=s?.action||'';
  if(!['working','moving','travel'].includes(s?.mode))return false;
  if(a==='craft'){const order=(g.s.orders||[]).find(o=>o.heroId===n.id&&['working','travelling','pending'].includes(o.status));return order?.type===type;}
  if(a!=='makePersonalItem'&&!a.startsWith('sectCraft:'))return false;
  const id=a.startsWith('sectCraft:')?a.slice(10):s.growthTarget,r=g.progression?.recipe?.(id);return r?.workshop===type;
 }).length;
}
function needs(g){
 const v=bonuses(g),heroes=(g.heroes||[]).filter(living),slots=(g.bank?.jianghu?.ledgerV140?.materialStacks||[]).filter(s=>num(s.count)>0).length;
 const books=(g.s.growth?.scriptureLibrary||[]).length,libraryWishes=heroes.filter(n=>n.stageLocal?.action==='readLibraryScripture'||n.stageLocal?.growth?.plan?.kind==='libraryRead').length;
 const deficits=heroes.filter(n=>num(n.stageLocal?.storeWish?.deficit)>0).length,capacity=num(g.capacity?.(),6),out=[];
 const workload=root.JianghuSectContributions?.economicWorkload(g);
 const workFull=!!workload&&(workload.gathering>=workload.gatheringLimit||workload.crafting>=workload.craftingLimit);
 for(const b of buildings(g)){
  if(!complete(b)||level(b)>=3||b.upgrade)continue;let score=0,reason='';
  // Shared capabilities use the highest completed level, so a lower duplicate
  // cannot relieve these pressures by upgrading beneath that existing level.
  if(['treasury','shrine','alchemy','forge','hall','missionHall'].includes(b.type)&&level(b)<v.levels[b.type])continue;
  if(b.type==='treasury'&&slots>=v.materialCapacity*.65){score=60+slots/v.materialCapacity*15;reason=`วัตถุดิบใช้ ${slots}/${v.materialCapacity} ช่อง เกิน 65% ของคลัง`;}
  if(b.type==='shrine'&&(books>=v.libraryCapacity*.6||libraryWishes>=3)){score=58+Math.min(15,libraryWishes*2);reason=`คลังคัมภีร์ ${books}/${v.libraryCapacity} เล่ม · มีผู้ต้องการศึกษาจริง ${libraryWishes} คน`;}
  if(['alchemy','forge'].includes(b.type)){const count=activeCrafters(g,b.type);if(count>=2){score=56+Math.min(14,count*2);reason=`ช่างกำลังทำงานจริง ${count} คน ต้องการฝีมือและความเร็วโรงช่าง`;}}
  if(b.type==='hall'&&heroes.length>=capacity*.8){score=62;reason=`ศิษย์มีชีวิต ${heroes.length}/${capacity} คน ใช้ที่พักตั้งแต่ 80%`;}
  if(b.type==='missionHall'&&deficits>=2&&workFull){score=55+Math.min(15,deficits*3);reason=`ศิษย์ ${deficits} คนขาดแต้มและช่องงานถูกใช้งานเต็ม (จัดหา ${workload.gathering}/${workload.gatheringLimit} · ผลิต ${workload.crafting}/${workload.craftingLimit}) จึงเพิ่มช่องงาน`;}
  if(b.type==='tower'&&(b.hp<maxHp(b)||num(b.lastAttackedAt,-Infinity)>now(g)-40)){score=65;reason=`หอพิทักษ์เสียหายหรือเพิ่งถูกโจมตี (${Math.ceil(b.hp)}/${maxHp(b)}) จึงเพิ่มความทนทาน`;}
  if(score)out.push({buildingId:b.id,type:b.type,needScore:score,reason});
 }
 const future=out.filter(n=>evaluateCandidate(g,n).eligible);
 if(future.length>=2)for(const b of buildings(g).filter(b=>b.type==='works'&&complete(b)&&level(b)<3&&level(b)>=v.levels.works&&!b.upgrade))out.push({buildingId:b.id,type:b.type,needScore:57+Math.min(12,future.length*2),reason:`มีโครงการยกระดับที่เกิดจากความจำเป็นและทรัพยากรพอ ${future.length} โครงการ จึงลดเวลางานโยธา`});
 return out;
}
function evaluateCandidate(g,need){
 const b=buildings(g).find(x=>x.id===need.buildingId),actor=authority(g,b.type),q=quoteUpgrade(g,b.id),n=actor?.npc;
 const caution=num(n?.personality?.caution,50),wealth=num(n?.core?.values?.wealthResource,50),duty=num(n?.core?.values?.sectDuty,50),planning=num(n?.planning,50);
 const score=need.needScore+(duty-50)*.14+(planning-50)*.1-(caution-50)*.1-(wealth-50)*.08-(q.cost?.stones||0)/Math.max(1,num(g.gold))*40;
 // Stones, wood and ore have different units. Compare the 25% budget rule
 // against stones only; each material already has its own absolute reserve.
 const reserveOk=!!q.cost&&q.cost.stones<=num(g.gold)*.25&&num(g.gold)-q.cost.stones>=250&&num(g.s.wood)-q.cost.wood>=20&&num(g.count?.(g.bank,ORE))-q.cost.ore>=10;
 const reason=need.reason+` · ผู้รับผิดชอบประเมินหน้าที่ ${Math.round(duty)} วางแผน ${Math.round(planning)} รอบคอบ ${Math.round(caution)} รักษาทรัพย์ ${Math.round(wealth)}`;
 return {...need,reason,score,actorId:n?.id||null,authorityRole:actor?.role||null,cost:q.cost||null,quoteOk:q.ok,reserveOk,eligible:q.ok&&reserveOk&&score>=45,tradeoff:q.cost?tradeoff(g,q.cost):q.reason};
}
function candidates(g){return needs(g).map(need=>evaluateCandidate(g,need)).sort((a,b)=>b.score-a.score||a.buildingId.localeCompare(b.buildingId));}
function description(b){
 const l=level(b),extra=l-1;
 const text={hall:`รองรับศิษย์เพิ่ม ${2*extra} คน`,shrine:`คลังคัมภีร์ ${120+40*extra} เล่ม · ศึกษาเร็วขึ้น ${10*extra}%`,treasury:`คลังวัตถุดิบ ${640+160*l} ช่อง · ช่วยเหลือพื้นฐานวันละ ${4+extra} หน่วย`,missionHall:`เพิ่มช่องงานจัดหาและผลิตประเภทละ ${l} คน`,works:`งานก่อสร้างและยกระดับเร็วขึ้น ${15*l}%`,alchemy:`ฝีมือโอสถ +${4*extra} · ผลิตเร็วขึ้น ${12*extra}%`,forge:`ฝีมือหลอม +${4*extra} · ผลิตเร็วขึ้น ${12*extra}%`};
 return (text[b.type]||'เพิ่มความทนทานอาคาร ไม่มีผลผลิตหรือแต้มฟรี')+` · ความทนทานสูงสุด ${maxHp(b)}`;
}
function inspect(g){
 const s=g.s.infrastructure;
 return {schemaVersion:1,autoEnabled:s?.autoEnabled!==false,lastTickAt:s?.lastTickAt??null,nextAutoAt:s?.nextAutoAt??now(g)+40,history:copy(s?.history||[]),lastDecision:copy(s?.lastDecision||null),bonuses:bonuses(g),candidates:candidates(g),
  buildings:buildings(g).map(b=>({id:b.id,type:b.type,name:B[b.type]?.name||b.type,level:level(b),hp:b.hp,maxHp:maxHp(b),completed:complete(b),upgrade:copy(b.upgrade||null),quote:quoteUpgrade(g,b.id),description:description(b)}))};
}
function tick(g,dt){
 const s=state(g),at=now(g),elapsed=Math.max(0,at-s.lastTickAt);s.lastTickAt=at;
 for(const b of buildings(g)){
  if(!B[b.type])continue;b.level=level(b);b.maxHp=maxHp(b);const u=b.upgrade;if(!u)continue;
  if(b.hp<=0){b.upgrade=null;record(g,{kind:'CANCEL',buildingId:b.id,reason:'อาคารถูกทำลายระหว่างยกระดับ ไม่มีการคืนวัสดุที่ใช้แล้ว'});continue;}
  u.remaining=Math.max(0,num(u.remaining)-elapsed);
  if(u.remaining>0)continue;
  const old=level(b),target=clamp(Math.floor(num(u.targetLevel,old)),old,3),actorId=u.actorId;
  b.level=target;b.maxHp=maxHp(b);b.hp=Math.min(b.maxHp,b.hp+(target-old)*B[b.type].hp*.25);b.upgrade=null;
  record(g,{kind:'COMPLETE',buildingId:b.id,type:b.type,targetLevel:target,actorId,reason:'ยกระดับสำเร็จ · '+description(b)});g.note?.(B[b.type].name+' ระดับ '+target+' เสร็จแล้ว · '+description(b));
 }
 if(s.autoEnabled===false||at<s.nextAutoAt)return;
 s.nextAutoAt=at+40;
 if(buildings(g).some(b=>b.upgrade)){s.lastDecision={t:at,reason:'กำลังยกระดับอาคาร รอให้เสร็จก่อน'};return;}
 const options=candidates(g),pick=options.find(x=>x.eligible);s.lastDecision={t:at,reason:pick?pick.reason:options.length?'ชะลอการยกระดับ: ทุนสำรองหรือความคุ้มค่าไม่ผ่านเกณฑ์':'ไม่มีแรงกดดันจากการใช้งานจริง จึงเก็บทรัพยากรไว้',candidates:copy(options)};
 if(!pick)return;const r=requestUpgrade(g,pick.buildingId,pick.actorId);if(!r.ok){s.lastDecision.reason=r.reason;return;}
 const row=s.history[0];row.automatic=true;row.reason=pick.reason;row.tradeoff=pick.tradeoff;s.lastDecision.buildingId=pick.buildingId;g.note?.('มติพัฒนาอาคาร: '+pick.reason+' · '+pick.tradeoff,g.world?.npcs?.[pick.actorId]);
}
root.JianghuInfrastructure={VERSION:1,quoteUpgrade,requestUpgrade,tick,inspect,bonuses,maxHp};
if(typeof module!=='undefined'&&module.exports)module.exports=root.JianghuInfrastructure;
})(typeof globalThis!=='undefined'?globalThis:this);
