/* ความตั้งใจและหน้าที่ของ NPC — JSON bounded state, no RNG in scores or explanations. */
(function(g){
 'use strict';
 const {HC,CULT,SECT,ECO,U}=g, COG={VERSION:1}, E=(n,p)=>HC.eff(n,p), clamp=U.clamp;
 const INCOME=['forage','brewBasic','brew','forge','donate','personalPillDonation','mine'];
 const TRAIN=['cultivate','practice','paidTraining','study','guidedStudy'];
 const REST=['sleep','leisure','pray'];
 const OFFICE={
  commander:['แม่ทัพสำนัก','ประเมินกำลังศัตรู จัดกำลัง และนำการป้องกันสำนัก'],
  provision:['ฝ่ายเสบียง','ประเมินอาหารสำรองและวางแผนปลูกหรือประกอบอาหาร'],
  herbal:['ฝ่ายสมุนไพร','ประเมินสมุนไพรและวัตถุดิบที่ต้องเก็บหรือปลูก'],
  wildwarden:['ฝ่ายลาดตระเวนอสูร','ตรวจความเสี่ยงนอกกำแพงและความพร้อมของผู้ล่า'],
  steward:['ฝ่ายอาคารสถานที่','ตรวจการใช้สถานีและเสนอขยายเมื่อแออัด'],
  master:['เจ้าสำนัก','วางนโยบาย จัดคน ทรัพยากร และความมั่นคงของสำนัก'],
  deputy:['รองเจ้าสำนัก','ช่วยกำกับงานและรับผิดชอบเมื่อเจ้าสำนักไม่พร้อม'],
  martial:['หอยุทธ์','ฝึกศิษย์และดูแลความพร้อมด้านการต่อสู้'],alchemy:['หอโอสถ','วางแผนโอสถที่ขาดและจัดงานปรุง'],
  forge:['โรงหลอม','จัดงานผลิตอุปกรณ์ให้เหมาะกับความต้องการ'],scripture:['หอคัมภีร์','จัดการวิชาและสนับสนุนการเรียนรู้'],
  discipline:['ผู้คุมกฎสำนัก','รักษากฎและตรวจสอบความไม่เป็นธรรม'],treasury:['หอคลัง','ดูแลเงิน ของสำรอง และการจัดสรรตามนโยบาย'],
  mission:['ผู้อาวุโสฝ่ายกิจการนอกสำนัก','พิจารณาคณะเดินทางและความเสี่ยง'],guard:['องครักษ์','เฝ้าระวังและรักษาความปลอดภัย'],
  registry:['หอทะเบียน','ดูแลทะเบียนและผู้สมัคร'],healer:['หมอหลวง','ดูแลผู้บาดเจ็บและความพร้อมของสถานรักษา']
 };
 COG.role=(W,n)=>{
  let id=W.sect.masterId===n.id?'master':W.sect.deputyId===n.id?'deputy':Object.keys(SECT.POSTS).find(p=>W.sect.posts[p]===n.id);
  let acting=false;
  if(!id&&W.sect.welfareAuthority?.id===n.id&&W.sect.welfareAuthority.acting){id='treasury';acting=true;}
  if(!id&&n.assist&&OFFICE[n.assist]){id=n.assist;acting=true;}
  const o=OFFICE[id];return {id:id||'member',title:o?(acting?'ผู้ช่วย/รักษาการ':'')+o[0]:'สมาชิกสำนัก',responsibility:o?o[1]:'ดูแลตนเอง ฝึกฝน และเลือกช่วยสำนักตามความสามารถ',acting};
 };
 COG.ensure=n=>{
  if(!n.cognition||n.cognition.version!==1)n.cognition={version:1,goal:null,memory:[],trace:[],nextReview:0};
  const c=n.cognition;c.memory=Array.isArray(c.memory)?c.memory.slice(-24):[];c.trace=Array.isArray(c.trace)?c.trace.slice(-8):[];return c;
 };
 function safe(n){const s=n.h.state;return s.hp/CULT.hpMax(n)>=.35&&s.satiety>=20&&s.rest>=8;}
 function roleNeed(W,n){
  const r=COG.role(W,n).id,short=(W.sect.shortageDirectives||[]).some(d=>d.priority==='critical');
  if(r==='member')return 0;
  if(r==='healer')return W.npcs.some(x=>!x.dead&&!x.away&&(x.inj?.length||x.h.state.hp<CULT.hpMax(x)*.5))?1:.1;
  if(r==='guard'||r==='martial')return W.threat?.raid||W.threat?.alert>0?1:.15;
  if(r==='alchemy')return (W.sect.shortageDirectives||[]).some(d=>d.kind==='medicine')?.8:.15;
  if(r==='treasury'||r==='master'||r==='deputy')return short?.9:.2;
  return .2;
 }
 function complete(W,n,goal){
  if(!goal||goal.expiresAt<=W.t||W.t-(goal.lastProgress??goal.createdAt)>3*1440)return true;
  if(goal.id==='scripture')return !n.cult||n.cult.techs.includes(goal.targetId)||!W.sect.library.includes(goal.targetId)||!CULT.learnable(n,W.sect.library).includes(goal.targetId);
  if(goal.id==='rival')return !W.byId[goal.targetId]||W.byId[goal.targetId].dead||W.byId[goal.targetId].exiled||CULT.power(n)>CULT.power(W.byId[goal.targetId])*1.15;
  if(goal.id==='craft')return !ECO.recipeById[goal.targetId]||(n.stats?.crafted||0)>goal.startCrafted;
  if(goal.id==='breakthrough')return !n.cult||n.cult.stage>goal.startStage;
  if(goal.id==='service')return (W.sect.lastDuty[n.id]||0)>goal.createdAt||COG.role(W,n).id!==goal.targetId;
  if(goal.id==='crisis')return !(W.sect.shortageDirectives||[]).some(d=>d.id===goal.targetId&&d.deficit>0);
  if(goal.id==='recovery')return safe(n)&&n.h.state.hp>=CULT.hpMax(n)*.8&&n.h.state.rest>=40;
  return false;
 }
 COG.prepare=(W,n)=>{
  const c=COG.ensure(n),r=COG.role(W,n);c.office=r;
  if(c.goal&&complete(W,n,c.goal)){c.lastGoal={id:c.goal.id,title:c.goal.title,endedAt:W.t};c.goal=null;c.nextReview=0;}
  if(c.goal||W.t<(c.nextReview||0))return c;
  c.nextReview=W.t+180;const options=[],add=(id,title,weight,targetId,extra)=>{if(weight>0)options.push({id,title,weight,targetId,...extra});};
  if(!safe(n))add('recovery','ฟื้นร่างกายก่อนตัดสินใจเรื่องอื่น',20,null);
  else{
   if(r.id!=='member')add('service','รับผิดชอบงาน'+r.title,.2+(E(n,'values.sectDuty')+E(n,'personality.discipline')+E(n,'personality.loyalty'))/200+roleNeed(W,n),r.id);
   const crisis=(W.sect.shortageDirectives||[]).find(d=>d.priority==='critical'&&d.deficit>0);
   if(crisis)add('crisis','ช่วยสำนักแก้การขาด '+(crisis.nameTh||ECO.name(crisis.id)),Math.max(0,(E(n,'values.sectDuty')+E(n,'personality.empathy')+E(n,'personality.loyalty')-130)/100),crisis.id,{source:crisis.source});
   if(n.cult){
    if(n.cult.bn||CULT.ready(n))add('breakthrough','เตรียมตัวก้าวข้ามขอบเขต',.3+E(n,'values.martialPeak')/80+E(n,'personality.ambition')/180,null,{startStage:n.cult.stage});
    const cap=Math.min(n.cult.stage,SECT.canLearnTier(W,n));
    const eligible=CULT.learnable(n,W.sect.library).map(CULT.tech).filter(t=>t&&(t.reqTier||t.tier)<=cap&&g.CPE.techPrice(W,t)>0);
    // Preferred book includes personal affinity, not just the numerically strongest move.
    eligible.sort((a,b)=>COG.techPreference(n,b)-COG.techPreference(n,a));
    if(eligible[0])add('scripture','ตั้งใจเรียน '+eligible[0].nameTh,.2+(E(n,'personality.curiosity')+E(n,'values.knowledgeCraft')+E(n,'interests.scholarship'))/160,eligible[0].id);
    const recipes=[...(n.inv.recipes||[]),...(n.recipes||[])].map(id=>ECO.recipeById[id]).filter(r=>r&&r.craft==='ALCHEMY'&&r.inputs.some(i=>(n.inv.mats[i.matId]||0)>0));
    if(recipes[0])add('craft','เก็บส่วนผสมเพื่อปรุง '+recipes[0].nameTh,.2+(E(n,'interests.alchemy')+E(n,'values.knowledgeCraft'))/120,recipes[0].id,{startCrafted:n.stats?.crafted||0});
    const rival=Object.entries(n.h.mind.relations||{}).find(([id,v])=>['คู่แข่ง','ศัตรู'].includes(v.bond)&&W.byId[id]&&!W.byId[id].dead);
    if(rival&&CULT.power(W.byId[rival[0]])>=CULT.power(n))add('rival','ฝึกฝนเพื่อก้าวข้าม '+W.byId[rival[0]].h.name.given,Math.max(0,(E(n,'personality.pride')+E(n,'personality.ambition')-100)/65),rival[0]);
   }
  }
  // Also allow a day without an overriding ambition; people are not permanent optimizers.
  options.push({id:'none',weight:1.2+E(n,'values.freedom')/100});
  const chosen=options.length===1?options[0]:W.rng.weighted(options,x=>x.weight);
  if(chosen.id!=='none')c.goal={id:chosen.id,title:chosen.title,targetId:chosen.targetId||null,source:chosen.source||null,createdAt:W.t,expiresAt:W.t+7*1440,lastProgress:W.t,startStage:chosen.startStage??null,startCrafted:chosen.startCrafted??null,blocked:0};
  return c;
 };
 COG.techPreference=(n,t)=>{
  const rational=E(n,'personality.rationality')/100;
  return (g.MARTIAL ? (g.MARTIAL.conditionMatches(n,t) ? .8 : -.8) : 0)+rational*Math.log2(Math.max(1,t.power||1))+(1-rational)*((t.sub===n.cult?.sub?3:0)+(t.path===n.cult?.path?1:0))+E(n,'personality.curiosity')/100*(t.tier||1)*.2;
 };
 COG.modifiers=(W,n,id)=>{
  const out=[],push=(why,x)=>{if(Number.isFinite(x)&&Math.abs(x)>.025)out.push([why,clamp(x,-2,2)]);},s=n.h.state,c=n.cognition,r=COG.role(W,n);
  const goal=c?.goal&&c.goal.expiresAt>W.t?c.goal:null;
  if(!safe(n)){
   if(['heal','sleep','eat','personalPillUse','shop'].includes(id))push('ร่างกายเร่งด่วนสำคัญกว่างานหรือความชอบ',2.4);
   if(['wildHunt','paidTraining','practice','personalBrew','duty'].includes(id))push('ต้องรักษาตัวก่อน',-1.6);
   return out;
  }
  const duty=(E(n,'values.sectDuty')+E(n,'personality.discipline')+E(n,'personality.loyalty'))/300;
  if(r.id!=='member'){
   if(id==='duty')push('หน้าที่ของ'+r.title,(.1+duty*.55+roleNeed(W,n)*duty)*((W.sect.lastDuty[n.id]||-9999)>W.t-180?.15:1));
   const relevant={commander:['duty','practice','guard'],provision:['cook','farm'],herbal:['farm','forage'],wildwarden:['guard','wildHunt'],steward:['duty'],alchemy:['brew','brewBasic'],forge:['forge'],scripture:['study','guidedStudy'],martial:['practice','pair'],guard:['guard'],healer:['duty'],mission:['duty'],treasury:['duty'],registry:['duty'],discipline:['duty'],master:['duty'],deputy:['duty']}[r.id]||[];
   if(relevant.includes(id))push('งานในความรับผิดชอบ',duty*.25);
  }
  if(goal){
   const price=goal.id==='scripture'?g.CPE.techPrice(W,CULT.tech(goal.targetId)):0;
   let actions=goal.id==='scripture'?((n.cp||0)>=price?['study']:INCOME):goal.id==='service'?['duty']:goal.id==='craft'?['personalBrew','forage','donate']:goal.id==='rival'?TRAIN:goal.id==='breakthrough'?['cultivate','breakthrough','shop','pray']:goal.id==='crisis'?(goal.targetId==='meal'?['cook','farm']:goal.targetId==='grain'?['farm']:goal.source==='alchemy'?['brew','brewBasic']:['forage','donate','mine']):REST;
   if(actions.includes(id))push('เป้าหมาย: '+goal.title,.35+E(n,'intellect.planning')/180+E(n,'personality.discipline')/250);
   if(id==='shop'&&goal.id==='scripture'&&(n.cp||0)<price)push('เก็บแต้มไว้เรียนวิชาที่ตั้งใจ',-E(n,'personality.discipline')/140);
  }
  for(const [post,plan] of Object.entries(W.sect.officePlans||{})){const owner=W.byId[plan.by];if(plan.expiresAt>W.t&&plan.actions.includes(id)&&COG.available(owner,W)&&((post==='master'?W.sect.masterId:post==='deputy'?W.sect.deputyId:W.sect.posts[post])===plan.by))push('ข้อเสนอฝ่าย: '+plan.title,.08+duty*.16);}
  const hour=(W.t%1440)/60,night=hour>=21||hour<5,discipline=E(n,'personality.discipline')/100;
  if(night&&['duty','farm','mine','forage'].includes(id))push('ยามดึกควรพัก',-.25*discipline);
  if(hour>=8&&hour<17&&id==='duty')push('ช่วงเวลาปฏิบัติหน้าที่',.15+.15*discipline);
  if(hour>=17&&hour<21&&['pair','leisure'].includes(id))push('ยามเย็นอยากผ่อนคลาย',E(n,'temperament.sociability')/300);
  if(s.stress>60){if(REST.includes(id))push('ผ่อนคลายความเครียด',(s.stress-60)/70*(.5+E(n,'values.freedom')/100));if(id==='duty')push('เหนื่อยล้าแต่ยังชั่งใจเรื่องหน้าที่',-(s.stress-60)/120*(1-duty));}
  if((n.grief||0)>0&&['pray','leisure'].includes(id))push('กำลังโศกเศร้าและต้องการสงบใจ',Math.min(.6,n.grief/10));
  if(s.anger>45&&id==='pair')push('อารมณ์ร้อนอยากพูดคุยหรือระบาย',Math.min(.3,(s.anger-45)/180));
  if(['farm','mine','wildHunt','forage'].includes(id)&&['rain','snow'].includes(W.weather?.kind))push('อากาศทำให้งานกลางแจ้งไม่น่าสบาย',-.12-E(n,'personality.caution')/800);
  return out;
 };
 COG.chosen=(W,n,actionId,reasons)=>{
  const c=COG.ensure(n);c.trace.push({at:W.t,actionId,reasons:reasons.slice(0,4).map(x=>[String(x[0]),x[1]])});if(c.trace.length>8)c.trace.shift();
  if(c.goal){c.goal.blocked=0;c.goal.lastAction=actionId;}
 };
 COG.blocked=(W,n,id)=>{const c=COG.ensure(n);if(c.goal){c.goal.blocked++;c.goal.blockReason='ยังทำ '+(g.AI.ACTS[id]?.nameTh||id)+' ไม่ได้';if(c.goal.blocked>=4){c.goal.expiresAt=W.t;c.nextReview=W.t+120;}}};
 COG.finished=(W,n,id)=>{
  const c=n.cognition;if(!c)return;
  if(c.goal&&['duty','study','cultivate','practice','personalBrew',...INCOME].includes(id))c.goal.lastProgress=W.t;
 };
 COG.remember=(W,n,event)=>{
  const c=COG.ensure(n),e={kind:event.kind,zoneId:event.zoneId||null,subjectId:event.subjectId||null,at:W.t,severity:clamp(event.severity||.5,.05,1)};
  const old=c.memory.find(x=>x.kind===e.kind&&x.zoneId===e.zoneId&&x.subjectId===e.subjectId);if(old)Object.assign(old,e);else c.memory.push(e);if(c.memory.length>24)c.memory.shift();
 };
 COG.huntValue=(W,n,b)=>{
  const ratio=CULT.power(n)/Math.max(1,b.power),caution=E(n,'personality.caution')/100,courage=E(n,'personality.courage')/100;
  let v=Math.log2(Math.max(.05,ratio))*(.6+caution)+(courage-.5)*.25;
  for(const m of n.cognition?.memory||[]){if(m.zoneId!==b.zone)continue;const fade=Math.max(0,1-(W.t-m.at)/(14*1440));if(m.kind==='hunt_loss')v-=m.severity*fade*(.25+caution);if(m.kind==='hunt_win')v+=.12*fade;}
  const preferred=(b.x-n.x)**2+(b.y-n.y)**2;return v-Math.min(.4,Math.sqrt(preferred)/400);
 };
 COG.explain=(W,n)=>{
  const c=n.cognition,r=COG.role(W,n),goal=c?.goal&&!complete(W,n,c.goal)?c.goal:null,last=c?.trace?.at(-1);
  return {role:r.title,responsibility:r.responsibility,goal:goal?{id:goal.id,title:goal.title,targetId:goal.targetId,blocked:goal.blockReason||null}:null,actionId:last?.actionId||n.act?.id||null,reasons:(last?.reasons||n.why||[]).map(x=>x.slice()),officeDecision:c?.officeDecision?{...c.officeDecision}:null};
 };
 COG.officeBias=(W,n,kind)=>{
  const critical=(W.sect.shortageDirectives||[]).some(x=>x.priority==='critical'),duty=E(n,'values.sectDuty')/100,empathy=E(n,'personality.empathy')/100;
  if(critical&&['upgrade','research','seclusion','tournament','banquet','drive'].includes(kind))return -(.2+duty*.4);
  if(kind==='banquet')return (W.avgMood<0?empathy*.25:0);
  if(kind==='upgrade')return Object.values(W.sect.facilityDemand||{}).some(x=>x.failedAttempts>=2||x.congestedHours>=3)?duty*.35:0;
  if(kind==='audit')return E(n,'personality.integrity')/400*(W.sect.suspicion||0)/50;
  return 0;
 };
 COG.officeDecision=(W,n,action,reasons)=>{const c=COG.ensure(n);c.office=COG.role(W,n);c.officeDecision={action,at:W.t,reasons:reasons.slice(0,3),status:'attempted'};};

 COG.orderBias=(W,n,r)=>{
  const e=r.outType==='PILL'?ECO.pillInfo(r.outItemId||'P:'+r.id)?.effect||{}:{};
  let v=0;
  if(e.healHealth||e.healInjury)v+=(E(n,'personality.empathy')-50)/150;
  if(e.cbBuff)v+=(E(n,'values.martialPeak')-50)/220;
  v+=(E(n,'personality.ambition')-E(n,'personality.caution'))/500*Math.max(0,r.tier-1);
  v+=(E(n,'values.wealthResource')-50)/500*clamp((ECO.outputValue(W,r)-ECO.inputCost(W,r))/100,-1,1);
  return clamp(v,-.6,.6);
 };
 COG.performDuty=(W,n)=>{
  const r=COG.role(W,n);if(r.id==='member'||!COG.available(n,W))return;
  COG.reviewOffice(W,n);
  if(r.acting){COG.officeDecision(W,n,'ช่วยงานภายใต้ผู้มีอำนาจ',[r.responsibility]);return;}
  if(['alchemy','forge'].includes(r.id)){
   const o=ECO.pickOrder(W,r.id,n);W.sect.orders[r.id]=o.recipe?{rid:o.recipe.id,why:o.why,by:n.id}:null;
   COG.officeDecision(W,n,'จัดแผนผลิต'+(o.recipe?' '+o.recipe.nameTh:' รอวัตถุดิบ'),[r.responsibility,o.why||'ยังไม่มีงานผลิตที่พร้อม']);
  }else if(r.id==='master'&&!n.sealed&&!n.away){SECT.masterDecision(W,n);}
  else {const status=r.id==='treasury'?'ตรวจของสำรองและความขาดแคลน':r.id==='healer'?'ตรวจความจำเป็นของผู้บาดเจ็บ':r.id==='guard'?'ตรวจความพร้อมในการเฝ้ายาม':'ปฏิบัติงานตามตำแหน่ง';COG.officeDecision(W,n,status,[r.responsibility]);}
 };

 COG.available=(n,W)=>!!n&&!n.dead&&!n.away&&!n.exiled&&!n.sealed&&!n.sealedBt&&!(n.jail>(W?.t??0));
 COG.reviewOffice=(W,n)=>{
  const r=COG.role(W,n);if(!COG.available(n,W)||r.id==='member')return;
  if(!['master','deputy'].includes(r.id)&&W.sect.posts[r.id]!==n.id)return;
  const short=(W.sect.shortageDirectives||[]).filter(d=>d.deficit>0),critical=short.find(d=>d.priority==='critical');
  let title=r.responsibility,actions=['duty'],targetId=null;
  if(r.id==='provision'){const lack=ECO.count(W,'meal')<W.npcs.filter(x=>!x.dead).length*3;title=lack?'เสบียงพร้อมกินต่ำกว่าที่ควรสำรอง':'ดูแลเสบียงโดยยังไม่เร่งผลิต';actions=lack?(ECO.count(W,'grain')>=3?['cook']:['farm']):['duty'];targetId=lack?'meal':null;}
  if(r.id==='herbal'){const d=short.find(d=>ECO.matById[d.id]?.category==='HERB');title=d?'หาและปลูกส่วนผสมที่ขาด: '+(d.nameTh||ECO.name(d.id)):'ตรวจสมุนไพรที่สำรองไว้';actions=d?['forage','farm']:['duty'];targetId=d?.id||null;}
  if(r.id==='steward'){const entries=Object.entries(W.sect.facilityDemand||{}).filter(([id,x])=>W.map.byId[id]&&!W.map.byId[id].building&&W.map.byId[id].level<3&&W.t-(x.lastCongestionHour||0)<2880&&(x.failedAttempts>=2||x.congestedHours>=3));entries.sort((a,b)=>b[1].failedAttempts-a[1].failedAttempts);targetId=entries[0]?.[0]||null;title=targetId?'เสนอให้เจ้าสำนักพิจารณาขยาย '+W.map.byId[targetId].nameTh:'ยังไม่พบความแออัดที่ต้องเสนอขยาย';}
  if(r.id==='wildwarden'){const danger=(W.wildlife?.beasts||[]).filter(b=>!b.dead&&!b.gone&&b.legendary).length;title=danger?'เฝ้าระวังอสูรตำนาน ไม่แนะนำผู้ล่าที่ไม่พร้อม':'ประเมินพื้นที่และความพร้อมในการล่า';actions=danger?['guard']:['guard','wildHunt'];}
  if(r.id==='discipline'){title=(W.sect.suspicion||0)>0?'มีข้อสงสัยด้านบัญชี ต้องตรวจหลักฐานก่อนกล่าวโทษ':'ดูแลระเบียบและตรวจสอบข้อร้องเรียน';}
  if(r.id==='commander'){const raid=!!W.threat.raid;title=raid?'ระดมกำลังป้องกันสำนัก':(W.wildlife?.beasts||[]).some(b=>b.legendary&&!b.gone&&!b.dead)?'ประเมินอสูรตำนานก่อนเสี่ยงกำลังพล':'ตรวจความพร้อมของกำลังป้องกัน';actions=raid?['guard','duty']:['duty','practice'];}
  if(r.id==='mission'){title=W.threat.roadBlocked>0?'เส้นทางถูกปิด พิจารณาชะลอภารกิจ':'พิจารณาภารกิจตามกำลังและนโยบายสำนัก';actions=W.threat.roadBlocked>0?['duty']:['errand'];}
  if(r.id==='alchemy'){const d=short.find(d=>d.kind==='medicine');actions=d?['brewBasic','brew']:['duty'];targetId=d?.id||null;title=d?'วางแผนโอสถที่ต้องการ: '+(d.nameTh||ECO.name(d.id)):'ตรวจความพร้อมของหอโอสถ';}
  if(r.id==='treasury'){title=critical?'จัดลำดับซื้อและสำรองของที่ขาด: '+(critical.nameTh||ECO.name(critical.id)):'ตรวจของล้นและเงินสำรองก่อนซื้อขาย';}
  const plans=W.sect.officePlans||(W.sect.officePlans={});plans[r.id]={by:n.id,title,targetId,actions,at:W.t,expiresAt:W.t+1440};
  COG.officeDecision(W,n,title,[r.responsibility]);
 };
 COG.reviewOffices=W=>{for(const id of Object.keys(SECT.POSTS)){const n=SECT.holder(W,id);if(n)COG.reviewOffice(W,n);}};
 COG.missionBias=(W,approver,kind)=>{
  const critical=(W.sect.shortageDirectives||[]).some(d=>d.priority==='critical');
  if(critical&&kind==='gather')return E(approver,'values.sectDuty')/100*.7;
  if(['hunt','bounty'].includes(kind))return (E(approver,'personality.courage')-E(approver,'personality.caution'))/200;
  if(kind==='trade')return (E(approver,'values.wealthResource')-50)/100;
  if(kind==='diplomacy')return (E(approver,'personality.empathy')-50)/100;
  return 0;
 };

 COG.choiceTemperature=n=>clamp(.2+(E(n,'temperament.sensationSeeking')+E(n,'personality.creativity'))/1100-(E(n,'personality.rationality')+E(n,'intellect.judgement')+E(n,'personality.discipline'))/1800+E(n,'temperament.emotionalReactivity')/1400,.06,.4);
 function helpCandidate(W,n,target){
  if(!COG.available(n,W)||!safe(n)||n.act?.id==='fight')return null;
  const key=(g.JD.CP.RECOVERY.hp||[]).find(k=>n.inv?.pills?.[k]>0&&ECO.pillInfo(k)?.effect.healHealth);if(!key)return null;
  const candidates=target?[W.byId[target]]:W.npcs;
  let best=null,score=0;
  for(const x of candidates){
   if(!x||x.id===n.id||!COG.available(x,W)||x.hidden||x.act?.id==='fight'||Math.hypot(x.x-n.x,x.y-n.y)>12||x.h.state.hp>=CULT.hpMax(x)*.55||(x.inv.pills[key]||0)>=1)continue;
   const affection=SECT.relationScore(n,x),empathy=E(n,'personality.empathy'),kin=x.mentor===n.id||n.mentor===x.id;
   const v=empathy/100+Math.max(0,affection)/100+(kin?.4:0)-(E(n,'values.wealthResource')/200);
   if(v>.55&&v>score){score=v;best={id:x.id,key,score:v};}
  }return best;
 }
 COG.helpCandidate=helpCandidate;
 COG.giveMedicine=(W,n,target)=>{
  const p=helpCandidate(W,n,target),x=p&&W.byId[p.id];if(!p||Math.hypot(x.x-n.x,x.y-n.y)>3)return false;
  const quality=n.inv.pillQuality?.[p.key]||1;
  n.inv.pills[p.key]--;if(n.inv.pills[p.key]<=0){delete n.inv.pills[p.key];if(n.inv.pillQuality)delete n.inv.pillQuality[p.key];}
  ECO.addPersonalPill(x,p.key,quality);const rel=SECT.rel(x,n.id);rel.a=clamp(rel.a+2,-100,100);
  COG.remember(W,x,{kind:'received_help',subjectId:n.id,severity:.5});
  W.log('relation',n.h.name.given+' มอบ '+ECO.name(p.key)+' จากของส่วนตัวให้ '+x.h.name.given+' ที่บาดเจ็บ',[n.id,x.id]);return true;
 };
 g.AI.ACTS.shareMedicine={nameTh:'แบ่งปันโอสถให้คนใกล้ตัว',icon:'💊',color:'#8dd9b4',can:(n,W)=>!!helpCandidate(W,n),score(n,W,S){const p=helpCandidate(W,n);if(p)S.add('เป็นห่วงผู้บาดเจ็บและมีโอสถแบ่งได้',Math.min(2,p.score));},where(W,n){const p=helpCandidate(W,n),x=p&&W.byId[p.id];return x?{pos:{x:x.x,y:x.y},recipient:p.id}:null;},dur:()=>5,tick(){},done(n,W,ctx){COG.giveMedicine(W,n,ctx.recipient);},cooldown:180};

 COG.rallyLeader=(W,f)=>{
  if(f.over)return null;
  const current=W.byId[f.ctx.commanderId];if(current&&COG.available(current,W)&&!current.fled&&!current.yield&&current.h.state.hp>=CULT.hpMax(current)*.45&&f.A.includes(current.id)&&current.act?.ctx?.fid===f.id)return current;
  const ids=[W.sect.posts.commander,W.sect.posts.guard,W.sect.posts.martial,W.sect.masterId];
  for(const id of ids){const n=W.byId[id];if(!COG.available(n,W)||n.fled||n.yield||(f.A.length>=14&&!f.A.includes(n.id))||n.h.state.hp<CULT.hpMax(n)*.45||(n.act?.id==='fight'&&!f.A.includes(n.id)))continue;
   const resolve=(E(n,'personality.courage')+E(n,'personality.loyalty')+E(n,'values.sectDuty'))/300;
   if(resolve<.45)continue;
   g.COMBAT.join(W,f,n.id,'A');f.ctx.commanderId=n.id;f.ctx.formation=E(n,'personality.caution')+E(n,'personality.empathy')>120?'ตั้งรับรักษากำลัง':'รุกสกัดผู้บุกรุก';
   COG.officeDecision(W,n,f.ctx.formation,['เข้าร่วมการต่อสู้จริงเพื่อป้องกันสำนัก']);W.log('raid',n.h.name.given+' นำกำลัง '+f.ctx.formation,[n.id]);return n;
  }return null;
 };
 g.COG=COG;if(typeof module==='object'&&module.exports)module.exports=COG;
})(typeof globalThis!=='undefined'?globalThis:this);
