/* Optional sect sidecontracts. All inventory work uses the real Frontier ledgers;
   production and study are observed from new canonical work receipts only. */
(function(root){'use strict';
const HERB='MAT_HERB_DEW_GRASS_1',ORE='MAT_ORE_BLACK_IRON_1',COPPER='MAT_ORE_SPIRIT_COPPER_2';
const PREFIX='sidequest:',clone=x=>JSON.parse(JSON.stringify(x));
const now=g=>Number(g.s.t)||0,alive=n=>!!(n?.alive&&n.health>0);
const human=()=>root.HumanCore,engine=()=>root.World2026Engine;
const story=()=>root.JianghuExpansionV112?.storyEvents||root.JianghuStoryEvents;
const catalog=[
 {id:'SQ_HERBAL_CLINIC',nameTh:'ถุงยาถึงมือหมอหมู่บ้าน',descTh:'ให้ศิษย์เก็บหรือเบิกหญ้าน้ำค้าง 4 หน่วย แล้วเดินไปส่งที่หมู่บ้านจริง หญ้าในสัมภาระถูกใช้เมื่อส่งมอบ',kind:'DELIVERY',matId:HERB,quantity:4,target:1,deadlineSeconds:600,cooldownSeconds:360,rewardStones:18,merit:2,villageRepair:45,costSummaryTh:'ส่งหญ้าน้ำค้างจากสัมภาระ 4 หน่วย',rewardSummaryTh:'ศิลา 18 · ฟื้นหมู่บ้าน 45 · ความดีความชอบ 2'},
 {id:'SQ_ORE_REPAIRS',nameTh:'เหล็กใหม่ซ่อมเครื่องมือชาวนา',descTh:'นำเหล็กดำ 4 หน่วยจากสัมภาระศิษย์ไปส่งช่างหมู่บ้าน ใช้ไม้สำนัก 2 หน่วยที่สำรองไว้ซ่อมอุปกรณ์เพาะปลูก',kind:'DELIVERY',matId:ORE,quantity:4,target:1,escrow:{wood:2},deadlineSeconds:600,cooldownSeconds:360,rewardStones:24,merit:2,villageRepair:55,costSummaryTh:'สำรองไม้ 2 · ส่งเหล็กดำจากสัมภาระ 4 หน่วย',rewardSummaryTh:'ศิลา 24 · ฟื้นหมู่บ้าน 55 · ความดีความชอบ 2'},
 {id:'SQ_VILLAGE_RELIEF',nameTh:'ครัวแบ่งข้าวยามหมู่บ้านลำบาก',descTh:'สำรองอาหาร 8 และศิลา 12 ให้ศิษย์เดินไปเปิดครัวช่วยหมู่บ้าน หากยกเลิกหรือเลยกำหนดจะคืนส่วนที่สำรองไว้',kind:'RELIEF',target:1,escrow:{food:8,stones:12},deadlineSeconds:480,cooldownSeconds:420,rewardStones:16,merit:3,villageRepair:70,relation:2,costSummaryTh:'สำรองอาหาร 8 · ศิลา 12',rewardSummaryTh:'ศิลา 16 · ฟื้นหมู่บ้าน 70 · ไมตรีชุมชน 2'},
 {id:'SQ_FOOD_STORES',nameTh:'เสบียงก่อนคืนฝนยาว',descTh:'สำรองศิลา 18 ให้ศิษย์เดินไปซื้อและขนอาหาร 14 หน่วยจากหมู่บ้านกลับเข้าคลัง ต้องมีที่ว่างในคลังเสบียงเมื่อรายงานงาน',kind:'FOOD',target:2,escrow:{stones:18},deadlineSeconds:600,cooldownSeconds:300,rewardFood:14,merit:2,costSummaryTh:'สำรองศิลา 18',rewardSummaryTh:'อาหารจริง 14 หน่วย · ความดีความชอบ 2'},
 {id:'SQ_WORKSHOP_PROOF',nameTh:'งานชิ้นแรกที่ตรวจรับได้',descTh:'ผลิตของส่วนตัวสำเร็จหรือส่งมอบงานช่างที่เริ่มหลังรับสัญญาอย่างน้อย 1 ชิ้น แล้วให้ผู้ลงมือกลับมารายงานที่สำนัก งานเก่าและความล้มเหลวไม่นับ',kind:'CRAFT',target:1,deadlineSeconds:900,cooldownSeconds:480,rewardStones:16,merit:2,costSummaryTh:'ใช้วัตถุดิบและค่าผลิตตามตำรับจริง',rewardSummaryTh:'ศิลา 16 · ความดีความชอบ 2'},
 {id:'SQ_SHARED_STUDY',nameTh:'สองคราวศึกษาก่อนรุ่งสาง',descTh:'อ่านคัมภีร์ ฝึกวิชาที่รู้จริง หรือเรียนกับผู้ยินยอมสอน 2 คราวหลังรับสัญญา ให้ผู้ร่วมศึกษารายงานที่สำนัก สัญญานี้ไม่มอบความรู้สำเร็จรูป',kind:'STUDY',target:2,deadlineSeconds:720,cooldownSeconds:420,rewardStones:12,merit:2,costSummaryTh:'ใช้เวลาและแหล่งความรู้จริง 2 คราว',rewardSummaryTh:'ศิลา 12 · ความดีความชอบ 2'},
 {id:'SQ_SAFE_PATHS',nameTh:'หมุดทางปลอดภัยของคนเก็บของ',descTh:'สำรองอาหาร 2 ให้ศิษย์เดินตรวจดงสมุนไพรและทางเข้าเหมืองคนละจุด หยุดงานเมื่อมีภัยใกล้ตัว แล้วจดจำเส้นทางที่ได้สำรวจ',kind:'SCOUT',target:2,escrow:{food:2},deadlineSeconds:900,cooldownSeconds:420,rewardStones:14,merit:2,relation:1,costSummaryTh:'สำรองอาหาร 2 · ตรวจเส้นทางจริง 2 จุด',rewardSummaryTh:'ศิลา 14 · จดจำเส้นทาง · ไมตรีชุมชน 1'},
 {id:'SQ_GARDEN_KEEPERS',nameTh:'เวรน้ำสองแปลงก่อนเหี่ยวเฉา',descTh:'ให้ศิษย์รดน้ำแปลงที่ยังไม่สุกและขาดน้ำ 2 แปลงต่างกันหลังรับสัญญา การดูแลเก่าหรือรดซ้ำแปลงเดิมไม่นับ',kind:'GARDEN',target:2,deadlineSeconds:600,cooldownSeconds:360,rewardStones:10,rewardSeed:'dew',merit:2,costSummaryTh:'ดูแลแปลงปลูกจริง 2 แปลง',rewardSummaryTh:'ศิลา 10 · เมล็ดหญ้าน้ำค้าง 1 · ความดีความชอบ 2'}
];
const byId=new Map(catalog.map(q=>[q.id,q]));
function state(g){
 const st=g.storyEvents.ensureState(true);
 if(!st.sidequests)st.sidequests={schemaVersion:1,nextId:1,active:null,records:{},history:[],eventCooldowns:{}};
 const q=st.sidequests;
 if(q.schemaVersion!==1)throw Error('ข้อมูลสัญญารองใหม่กว่าเกมนี้');
 q.records=q.records||{};q.history=q.history||[];q.eventCooldowns=q.eventCooldowns||{};
 if(!Number.isSafeInteger(q.nextId)||q.nextId<1)q.nextId=1;
 return q;
}
function cargo(g,n,matId,a){return (n.jianghu.ledgerV140.materialStacks||[]).filter(s=>s.matId===matId&&s.ownerNpcId===g.bank.id&&s.loan?.purpose==='SIDEQUEST'&&s.loan.runId===a.runId&&s.count>0);}
function carried(g,n,matId,a){return g.count(n,matId)+cargo(g,n,matId,a).reduce((sum,s)=>sum+s.count,0);}
function lendCargo(g,n,matId,qty,a){
 const source=g.bank.jianghu.ledgerV140,ledger=n.jianghu.ledgerV140,eligible=source.materialStacks.filter(s=>s.matId===matId&&g.ownsMaterial(g.bank,s)&&s.count>0),parts=[];let left=qty;
 if(qty<=0||eligible.reduce((sum,s)=>sum+s.count,0)<qty||human().load(n)+qty>human().carryLimit(n))return {ok:false,moved:0};
 for(const s of eligible){const take=Math.min(left,s.count);if(take>0){parts.push({source:s,count:take});left-=take;}if(!left)break;}
 if(ledger.materialStacks.length+parts.length>(engine().PATCH140_CAPS.materialStacks||24))return {ok:false,moved:0};
 for(const p of parts){const item={...clone(p.source),id:'contract-cargo-'+g.s.nextId++,count:p.count,ownerNpcId:g.bank.id,rights:'LOAN',loan:{purpose:'SIDEQUEST',runId:a.runId,ownerNpcId:g.bank.id}};if('ownerId'in item)item.ownerId=g.bank.id;delete item.storeCount;delete item.sectStore;ledger.materialStacks.push(item);g.debitMaterialStack(g.bank,p.source,p.count);}
 source.materialStacks=source.materialStacks.filter(s=>s.count>0);engine().syncLegacyArraysFromLedgerV140(n);engine().syncLegacyArraysFromLedgerV140(g.bank);return {ok:true,moved:qty};
}
function returnCargo(g,a){
 for(const n of Object.values(g.world.npcs)){
  const l=n.jianghu?.ledgerV140;if(!l)continue;
  for(const s of [...l.materialStacks])if(s.loan?.purpose==='SIDEQUEST'&&s.loan.runId===a.runId&&s.ownerNpcId===g.bank.id&&s.count>0)g.transferMaterialStack(n,g.bank,s.matId,s.count,'SIDEQUEST_RETURN',{returnLoanRunId:a.runId});
 }
}
function consumeCargo(g,n,matId,qty,a){
 if(carried(g,n,matId,a)<qty)return false;let left=qty;for(const s of cargo(g,n,matId,a)){const take=Math.min(left,s.count);s.count-=take;left-=take;if(!left)break;}
 if(left&&!g.consume(n,matId,left))return false;n.jianghu.ledgerV140.materialStacks=n.jianghu.ledgerV140.materialStacks.filter(s=>s.count>0);engine().syncLegacyArraysFromLedgerV140(n);return true;
}
function member(g,n){return alive(n)&&g.s.heroIds.includes(n.id)&&!!g.life?.member(n)&&!n.stageLocal?.enemy&&!n.stageLocal?.visitor;}
function readyNpc(g,n){const p=n?.stageLocal;return member(g,n)&&p&&!p.offmap&&!p.journey&&!p.pet&&p.mode!=='combat'&&n.health>=55&&(p.needs?.hunger||0)<=75&&(n.core?.condition?.fatigue||0)<=75&&(n.jianghu?.busyProductionUntilTick||-1)<=g.world.tick&&!g.academy?.reserved(n)&&!g.nearestEnemy?.(n,450);}
function hall(g){const b=g.built('hall');return b?g.endpoint(b):null;}
function location(id){return root.FrontierData?.LOCS?.find(x=>x.id===id)||null;}
function hasCost(g,c={}){return g.gold>=Number(c.stones||0)&&(g.s.food||0)>=Number(c.food||0)&&(g.s.wood||0)>=Number(c.wood||0)&&Object.entries(c.materials||{}).every(([id,q])=>g.count(g.bank,id)>=q);}
function deduct(g,c={},reason){
 if(!hasCost(g,c))return false;
 for(const [id,q] of Object.entries(c.materials||{}))if(!g.consume(g.bank,id,q))return false;
 if(c.stones&&!g.money(-c.stones,reason))return false;
 if(c.food)g.s.food-=c.food;if(c.wood)g.s.wood-=c.wood;return true;
}
function refund(g,a){if(a.refunded)return;a.refunded=true;const e=a.escrow||{};if(e.stones)g.money(e.stones,'คืนทุนสัญญารอง '+a.questId);if(e.food)g.s.food+=e.food;if(e.wood)g.s.wood+=e.wood;a.escrow={};}
function precondition(g,d){
 if(!g.s.storyEvents?.active)return 'เปิดเนื้อเรื่องสำนักก่อนรับสัญญา';
 if(!g.built('hall'))return 'ต้องมีหอเจ้าสำนักที่สร้างเสร็จ';
 if(!g.heroes.some(n=>member(g,n)))return 'ต้องมีศิษย์ที่ยังมีชีวิตในสำนัก';
 if(d.kind==='CRAFT'&&!g.built('alchemy')&&!g.built('forge'))return 'ต้องมีหอโอสถหรือโรงหลอมที่สร้างเสร็จ';
 if(d.kind==='GARDEN'&&(!g.built('garden')||(g.s.gardenPlots||[]).filter(p=>p.cropId).length<2))return 'ต้องมีสวนและปลูกพืชอย่างน้อย 2 แปลง';
 if(d.kind==='FOOD'&&(g.s.food||0)>146)return 'คลังอาหารต้องมีที่ว่างอย่างน้อย 14 หน่วย';
 if(!hasCost(g,d.escrow))return 'ทุนสำรองไม่พอ: '+d.costSummaryTh;
 return '';
}
function recordTerminal(g,a,status,reason){
 const q=state(g),d=byId.get(a.questId),old=q.records[a.questId]||{};
 returnCargo(g,a);q.active=null;
 q.records[a.questId]={status,progress:a.progress,target:d.target,lastRunId:a.runId,endedAt:now(g),cooldownUntil:now(g)+d.cooldownSeconds,completedCount:(old.completedCount||0)+(status==='COMPLETED'?1:0),reason};
 q.history.unshift({runId:a.runId,questId:a.questId,nameTh:d.nameTh,status,at:now(g),progress:a.progress,target:d.target,reason,contributors:[...a.contributors]});q.history.splice(32);
 g.note?.((status==='COMPLETED'?'✓ ':status==='FAILED'?'⌛ ':'↩ ')+d.nameTh+' · '+reason);
}
function accept(g,id){
 const q=state(g),d=byId.get(id);if(!d)return {ok:false,reason:'ไม่พบสัญญารอง'};
 if(q.active)return {ok:false,reason:'มีสัญญารองกำลังดำเนินอยู่ รับได้ครั้งละหนึ่งงาน'};
 const rec=q.records[id];if((rec?.cooldownUntil||0)>now(g))return {ok:false,reason:'สัญญานี้ยังอยู่ระหว่างพักงาน'};
 const reason=precondition(g,d);if(reason)return {ok:false,reason};
 if(!deduct(g,d.escrow,'สำรองทุนสัญญารอง '+d.nameTh))return {ok:false,reason:'ทุนสำรองเปลี่ยนไป กรุณาตรวจคลังอีกครั้ง'};
 const a={questId:id,runId:'sq'+q.nextId++,acceptedAt:now(g),deadlineAt:now(g)+d.deadlineSeconds,progress:0,target:d.target,escrow:clone(d.escrow||{}),contributors:[],doneKeys:[],observedReceiptIds:[],snapshot:{receiptSeq:g.s.growth?.nextId||1,receiptIds:(g.s.growth?.receipts||[]).map(r=>r.id),orderIds:(g.s.orders||[]).map(o=>o.id),knowledge:{}},refunded:false};
 for(const n of g.heroes)for(const [artId,k] of Object.entries(n.jianghu?.knowledgeV190||{}))a.snapshot.knowledge[n.id+':'+artId]={reading:Number(k.reading)||0,mastery:Number(k.mastery)||0};
 q.active=a;g.note?.('รับสัญญารอง '+d.nameTh+' · '+d.costSummaryTh);return {ok:true,active:a,reason:'เปิดงานให้ศิษย์ตัดสินใจรับหน้าที่ด้วยตนเอง'};
}
function cancel(g,id){const a=state(g).active;if(!a||!(id===a.questId||id===a.runId))return {ok:false,reason:'ไม่พบสัญญารองที่กำลังทำ'};recordTerminal(g,a,'CANCELLED','ยกเลิกงานและคืนทุนสำรอง');refund(g,a);return {ok:true,reason:'คืนทุนและพัสดุสำนักที่ยังไม่ใช้แล้ว ของส่วนตัวของศิษย์ยังอยู่กับเจ้าของ หากคลังเต็มจะเก็บของสำนักรอส่งคืน'};}
function addContributor(a,n){if(n&&!a.contributors.includes(n.id))a.contributors.push(n.id);}
function observe(g,a){
 const d=byId.get(a.questId);if(!d||!['CRAFT','STUDY'].includes(d.kind)||a.progress>=d.target)return;
 const receipts=[...(g.s.growth?.receipts||[])].reverse();
 for(const r of receipts){
  const seq=Number(/^life-work-(\d+)$/.exec(r.id||'')?.[1]);
  if(a.observedReceiptIds.includes(r.id)||a.snapshot.receiptIds.includes(r.id)||!Number.isFinite(seq)||seq<a.snapshot.receiptSeq||Number(r.t)<a.acceptedAt)continue;
  a.observedReceiptIds.push(r.id);const n=g.world.npcs[r.npcId];if(!member(g,n))continue;
  let valid=false;
  if(d.kind==='CRAFT')valid=r.kind==='production'&&r.success===true&&!!g.progression?.recipe(r.recipeId)&&Array.isArray(r.inputs)&&r.inputs.length>0;
  else if(r.kind==='mentorLesson')valid=r.accepted===true&&Number(r.gain)>0;
  else if(['readScripture','readLibraryScripture','practiceScripture'].includes(r.kind)){
   const key=n.id+':'+r.artId,old=a.snapshot.knowledge[key]||{reading:0,mastery:0};
   valid=Number(r.reading)>old.reading||Number(r.mastery)>old.mastery;
   if(valid)a.snapshot.knowledge[key]={reading:Math.max(old.reading,Number(r.reading)||0),mastery:Math.max(old.mastery,Number(r.mastery)||0)};
  }
  if(valid){a.progress++;addContributor(a,n);if(a.progress>=d.target)break;}
 }
 if(d.kind==='CRAFT'&&a.progress<d.target){
  for(const o of g.s.orders||[]){if(a.snapshot.orderIds.includes(o.id)||a.doneKeys.includes('order:'+o.id)||!Number.isFinite(o.created)||o.created<a.acceptedAt||o.status!=='delivered')continue;const n=g.world.npcs[o.heroId||o.brewerId];if(!member(g,n)||!g.recipes?.some(r=>r.id===o.recipeId)||o.budget!==0||!Number.isFinite(o.finishTick))continue;a.doneKeys.push('order:'+o.id);a.progress++;addContributor(a,n);break;}
 }
}
function tick(g,dt){
 if(!g?.s?.storyEvents?.active)return;
 const q=state(g);if(now(g)>=(q.nextReturnAt||0)){q.nextReturnAt=now(g)+5;const runs=new Set();for(const n of Object.values(g.world.npcs))for(const s of n.jianghu?.ledgerV140?.materialStacks||[])if(s.loan?.purpose==='SIDEQUEST'&&s.loan.runId!==q.active?.runId)runs.add(s.loan.runId);for(const runId of runs)returnCargo(g,{runId});}
 const a=q.active;if(!a)return;
 if(!byId.has(a.questId)){state(g).active=null;refund(g,a);return;}
 if(now(g)>=a.deadlineAt){recordTerminal(g,a,'FAILED','เลยกำหนดส่งงาน คืนทุนส่วนที่ยังสำรองไว้');refund(g,a);return;}
 observe(g,a);
}
function inspect(g){
 const q=state(g),active=q.active;
 return {active:active?clone({...active,nameTh:byId.get(active.questId)?.nameTh,descTh:byId.get(active.questId)?.descTh}):null,history:clone(q.history),contracts:catalog.map(d=>{
  const a=active?.questId===d.id?active:null,r=q.records[d.id],reason=active&&!a?'มีสัญญาอื่นกำลังดำเนินอยู่':a?'กำลังดำเนินงาน':(r?.cooldownUntil||0)>now(g)?'พักงานจนถึง '+Math.ceil(r.cooldownUntil)+' วินาที':precondition(g,d);
  return {...d,status:a?'ACTIVE':r?.status||'AVAILABLE',progress:a?.progress??r?.progress??0,target:d.target,canAccept:!reason,reason,deadlineAt:a?.deadlineAt||null,cooldownUntil:r?.cooldownUntil||0,completedCount:r?.completedCount||0};
 })};
}
function token(a,verb,target){return PREFIX+a.runId+':'+verb+(target?':'+target:'');}
function actionLabel(id){if(!id?.startsWith(PREFIX))return null;const verb=id.split(':')[2];return {pickup:'เบิกวัตถุดิบสำหรับสัญญารอง',deliver:'ส่งมอบวัสดุให้หมู่บ้าน',relief:'เปิดครัวช่วยชุมชน',procure:'จัดหาเสบียงตามสัญญา',return:'ขนเสบียงกลับสำนัก',report:'รายงานหลักฐานการทำงาน',survey:'ตรวจเส้นทางเก็บทรัพยากร',water:'รดน้ำตามเวรดูแลสวน',ingredient:'เบิกตัวยาสำหรับงานตรวจรับ',harvest:'เก็บวัตถุดิบสำหรับผลิตซ้ำ'}[verb]||'ปฏิบัติสัญญารอง';}
function workActivity(id){if(!id?.startsWith(PREFIX))return null;return {pickup:'deposit',deliver:'deposit',ingredient:'deposit',harvest:'herb',survey:'scout',water:'herb',procure:'resupplyFood',return:'resupplyFood',relief:'social',report:'social'}[id.split(':')[2]]||'social';}
function put(g,n,add,a,verb,target,duration=8,extra={}){if(target)add(token(a,verb,extra.key),58,target,duration,{discipline:.25,empathy:.2,integrity:.15},{handler:'SIDEQUEST',growthActivity:extra.activity||'social',reason:byId.get(a.questId).nameTh+' · '+actionLabel(token(a,verb)),...extra});}
function canCarry(g,n,id,qty){return human().load(n)+qty<=human().carryLimit(n)&&g.canAcceptMaterial(n,id);}
function options(g,n,add){
 if(!g?.s?.storyEvents?.active||!readyNpc(g,n))return;
 const a=state(g).active;if(!a||now(g)>=a.deadlineAt)return;observe(g,a);const d=byId.get(a.questId);if(!d)return;
 if(d.kind==='DELIVERY'){
  const held=carried(g,n,d.matId,a),need=Math.max(0,d.quantity-held);
  if(!need)put(g,n,add,a,'deliver',location('village'),10,{activity:'deposit'});
  else{
   if(g.count(g.bank,d.matId)>=need&&canCarry(g,n,d.matId,need))put(g,n,add,a,'pickup',hall(g),4,{activity:'deposit'});
   const node=(g.s.nodes||[]).find(x=>x.mat===d.matId&&x.qty>=1);
   if(node&&canCarry(g,n,d.matId,1)){const at=location(node.locationId)||node;if(!g.realm?.threatAt?.(at,350,n))add((node.kind==='ORE'?'mine:':'herb:')+node.id,52,at,12,{discipline:.25,caution:.2},{handler:'GATHER',growthActivity:node.kind==='ORE'?'mine':'herb',resourceNodeId:node.id,reason:d.nameTh+' · เก็บวัสดุให้ครบก่อนส่งจริง'});}
  }
 }else if(d.kind==='RELIEF')put(g,n,add,a,'relief',location('village'),16,{activity:'social'});
 else if(d.kind==='FOOD'){
  if(a.progress===0)put(g,n,add,a,'procure',location('village'),12,{activity:'resupplyFood'});
  else if(a.carrierId===n.id)put(g,n,add,a,'return',hall(g),8,{activity:'resupplyFood'});
  else if(!member(g,g.world.npcs[a.carrierId])||g.world.npcs[a.carrierId]?.stageLocal?.offmap||g.world.npcs[a.carrierId]?.stageLocal?.journey){a.progress=0;delete a.carrierId;put(g,n,add,a,'procure',location('village'),12,{activity:'resupplyFood'});}
 }else if(['CRAFT','STUDY'].includes(d.kind)){
  if(a.progress>=d.target){if(a.contributors.includes(n.id))put(g,n,add,a,'report',hall(g),6,{activity:'social'});return;}
  const school=g.built('shrine')||g.built('training')||g.built('hall');
  if(d.kind==='STUDY'){
   const p=g.progression;
   for(const b of n.jianghu.ledgerV140.scrolls||[]){const art=p.artMap.get(b.artId),k=n.jianghu.knowledgeV190?.[b.artId];if(!art||k?.stage>=4||!p.compatible(n,art)||!p.canStudyArtTier(n,art)||g.discovery&&!g.discovery.canStudy(n,art))continue;add('readScripture',57,g.endpoint(school),16,{curiosity:.3,discipline:.2},{growthTarget:art.id,growthActivity:'readScripture',reason:d.nameTh+' · ศึกษาจากคัมภีร์ที่ถือจริง'});break;}
   g.academy?.options(n,(id,score,at,seconds,pw,extra)=>{if(['seekMentor','learnFromMentor'].includes(id))add(id,score+9,at,seconds,pw,extra);},[]);
   p.options(n,(id,score,at,seconds,pw,extra)=>{if(['readLibraryScripture','practiceScripture'].includes(id))add(id,score+8,at,seconds,pw,extra);});
  }else{
   const p=g.progression,known=n.stageLocal.growth?.knownRecipes||[],ledger=n.jianghu.ledgerV140;
   const recipes=engine().getSpiritStonesV140(n)<2?[]:p.allRecipes().filter(r=>known.includes(r.id)&&g.built(r.workshop)&&r.tier<=p.tier(n)&&human().capacity(n,r.workshop==='alchemy'?'alchemy':'forging').total>=r.min&&(r.effect.slot?ledger.equipmentItems:r.effect.beastItem?ledger.beastItems:ledger.pillStacks).length<16).sort((x,y)=>x.tier-y.tier);
   const r=recipes[0];if(r){const missing=r.inputs.find(i=>g.count(n,i.matId)<i.count);if(missing){const need=missing.count-g.count(n,missing.matId);const source=root.JianghuStoryEvents.treasuryTools.source(g,'MATERIAL',missing.matId),afford=source&&root.JianghuSectContributions.prepareRedemption(g,{itemKind:'MATERIAL'},n,source,Math.min(2,need)).ok;if(g.count(g.bank,missing.matId)>=need&&afford&&(n.stageLocal.cooldowns['sectWithdraw:MATERIAL:'+missing.matId]||0)<=now(g)&&canCarry(g,n,missing.matId,need))put(g,n,add,a,'ingredient',hall(g),4,{key:r.id+':'+missing.matId,activity:'deposit'});else if(canCarry(g,n,missing.matId,1)){const node=g.s.nodes.find(z=>z.mat===missing.matId&&z.qty>=1),at=node&&location(node.locationId);if(at&&!g.realm.threatAt(at,400,n))put(g,n,add,a,'harvest',at,8,{key:r.id+':'+node.id,activity:node.kind==='ORE'?'mine':'herb'});}}else add('makePersonalItem',60,g.endpoint(g.built(r.workshop)),r.duration,{creativity:.25,discipline:.2},{growthTarget:r.id,growthActivity:r.workshop==='alchemy'?'alchemy':'forging',reason:d.nameTh+' · ผลิตด้วยต้นทุนและโอกาสสำเร็จตามตำรับจริง'});}
  }
 }else if(d.kind==='SCOUT'){
  for(const id of ['grove','mine'])if(!a.doneKeys.includes(id)){const at=location(id);if(at&&!g.realm?.threatAt?.(at,350,n))put(g,n,add,a,'survey',at,12,{key:id,activity:'scout'});}
 }else if(d.kind==='GARDEN'){
  const garden=g.built('garden');if(!garden)return;
  for(const p of g.s.gardenPlots||[]){const crop=root.FrontierData?.CROPS?.[p.cropId];if(p.buildingId===garden.id&&crop&&p.moisture<65&&p.growth<crop.growSeconds&&!a.doneKeys.includes(p.id)&&(!p.reservedBy||p.reservedBy===n.id||p.reservedUntil<=now(g)))put(g,n,add,a,'water',{id:p.id,x:p.x,y:p.y},6,{key:p.id,activity:'herb'});}
 }
}
function complete(g,a,n){
 const d=byId.get(a.questId);if(state(g).active!==a||a.progress<d.target)return false;
 recordTerminal(g,a,'COMPLETED',d.rewardSummaryTh);a.escrow={};
 if(d.rewardStones)g.money(d.rewardStones,'รางวัลสัญญารอง '+d.nameTh);
 if(d.rewardFood)g.s.food+=d.rewardFood;
 if(d.villageRepair)g.s.villageHP=Math.min(1000,(g.s.villageHP||0)+d.villageRepair);
 if(d.relation&&g.s.life)g.s.life.pavilionRelation+=d.relation;
 if(d.rewardSeed)g.s.seedStock[d.rewardSeed]=(g.s.seedStock[d.rewardSeed]||0)+1;
 for(const id of a.contributors){const x=g.world.npcs[id];if(member(g,x))g.life?.credit(x,d.merit||1,'ร่วมสัญญา '+d.nameTh);}
 return true;
}
function finish(g,n,action){
 if(!action?.startsWith(PREFIX))return null;
 const fail={handled:true,success:false,cooldown:12},a=state(g).active,p=n?.stageLocal;
 if(!a||!readyNpc(g,n)||now(g)>=a.deadlineAt||p.action!==action||p.mode!=='working'||p.job>0||!p.target)return fail;
 const pieces=action.split(':'),run=pieces[1],verb=pieces[2],key=pieces.slice(3).join(':');if(run!==a.runId)return fail;
 const d=byId.get(a.questId);if(!d)return fail;
 let expected=null;
 if(['pickup','ingredient','return','report'].includes(verb))expected=hall(g);
 else if(['deliver','relief','procure'].includes(verb))expected=location('village');
 else if(verb==='survey'&&['grove','mine'].includes(key))expected=location(key);
 else if(verb==='harvest'){const node=g.s.nodes.find(x=>x.id===key.slice(key.lastIndexOf(':')+1));expected=node&&location(node.locationId);}
 else if(verb==='water')expected=(g.s.gardenPlots||[]).find(x=>x.id===key);
 if(!expected||Math.hypot(p.x-expected.x,p.y-expected.y)>140||p.target.id!==expected.id)return fail;
 if(verb==='pickup'&&d.kind==='DELIVERY'){
  const need=d.quantity-carried(g,n,d.matId,a);if(need<=0||!canCarry(g,n,d.matId,need))return fail;const moved=lendCargo(g,n,d.matId,need,a);return {handled:true,success:moved.moved>0,cooldown:8};
 }
 if(verb==='ingredient'&&d.kind==='CRAFT'){
  const split=key.lastIndexOf(':'),recipeId=key.slice(0,split),matId=key.slice(split+1),r=g.progression.recipe(recipeId),inp=r?.inputs.find(x=>x.matId===matId);
  if(!inp||!n.stageLocal.growth.knownRecipes.includes(recipeId)||!g.built(r.workshop))return fail;const need=inp.count-g.count(n,matId);if(need<=0||!canCarry(g,n,matId,need))return fail;const acquired=root.JianghuSectContributions.acquire(g,n,'MATERIAL',matId);return {handled:true,success:acquired.ok,cooldown:8};
 }
 if(verb==='harvest'&&d.kind==='CRAFT'){
  const split=key.lastIndexOf(':'),r=g.progression.recipe(key.slice(0,split)),node=g.s.nodes.find(x=>x.id===key.slice(split+1)),inp=r?.inputs.find(x=>x.matId===node?.mat);
  if(!node||!inp||!n.stageLocal.growth.knownRecipes.includes(r.id)||g.count(n,inp.matId)>=inp.count||!g.built(r.workshop))return fail;
  const r2=g.harvestNode(node.id,n.id);return {handled:true,success:r2.ok,cooldown:8};
 }
 if(verb==='deliver'&&d.kind==='DELIVERY'){
  if(!consumeCargo(g,n,d.matId,d.quantity,a))return fail;a.progress=d.target;addContributor(a,n);
 }else if(verb==='relief'&&d.kind==='RELIEF'){a.progress=d.target;addContributor(a,n);}
 else if(verb==='procure'&&d.kind==='FOOD'&&a.progress===0){a.carrierId=n.id;a.progress=1;addContributor(a,n);return {handled:true,success:true,cooldown:8};}
 else if(verb==='return'&&d.kind==='FOOD'&&a.progress===1&&a.carrierId===n.id){if((g.s.food||0)>146)return fail;a.progress=d.target;addContributor(a,n);}
 else if(verb==='report'&&['CRAFT','STUDY'].includes(d.kind)){observe(g,a);if(a.progress<d.target||!a.contributors.includes(n.id))return fail;}
 else if(verb==='survey'&&d.kind==='SCOUT'&&!a.doneKeys.includes(key)){
  if(g.realm?.threatAt?.(expected,350,n))return fail;a.doneKeys.push(key);a.progress++;addContributor(a,n);if(!p.known.includes(key))p.known.push(key);engine()?.recordTrackDaoEvidenceV1200?.(g.world,n,'EXPLORATION',2);
 }else if(verb==='water'&&d.kind==='GARDEN'&&!a.doneKeys.includes(key)){
  const garden=g.built('garden'),plot=expected;if(!garden||plot.buildingId!==garden.id||!plot.cropId||plot.moisture>=65)return fail;const r=g.water(key,n.id);if(!r.ok)return fail;a.doneKeys.push(key);a.progress++;addContributor(a,n);
 }else return fail;
 if(a.progress>=d.target)complete(g,a,n);return {handled:true,success:true,cooldown:8};
}

/* Costed local events supplement the combat-heavy base catalog. Their own saved
   guards also protect direct tool/API calls; the story scheduler adds its guard. */
function aftermath(g,e,spec){story()?.addEventAftermath?.(g,{id:e.aftermathId,nameTh:e.nameTh,icon:e.icon,kind:'BLESSING',duration:100,descTh:spec.descTh,mods:spec.mods||{}});}
function eventReady(g,e){const cooldown=state(g).eventCooldowns[e.id]||0;if(cooldown>now(g))return {ok:false,reason:'เหตุการณ์นี้ยังอยู่ระหว่างพัก'};if(!hasCost(g,e.cost))return {ok:false,reason:'ทรัพยากรไม่พอ: '+e.costTh};if(e.check){const reason=e.check(g);if(reason)return {ok:false,reason};}return {ok:true};}
function makeEvent(spec){
 const e={scope:'ALL_EP',minEp:1,maxEp:8,kind:'INSTANT',cooldownSeconds:420,...spec};
 e.requirements=g=>eventReady(g,e);
 e.executeInstant=(g,ep)=>{const allowed=eventReady(g,e);if(!allowed.ok)return {ok:false,situationTh:e.nameTh,outcomeTh:allowed.reason};if(!deduct(g,e.cost,e.nameTh))return {ok:false,situationTh:e.nameTh,outcomeTh:'ต้นทุนเปลี่ยนไป ยังไม่ได้ดำเนินการ'};const result=e.apply(g,ep);state(g).eventCooldowns[e.id]=now(g)+e.cooldownSeconds;aftermath(g,e,e.aftermath);return {ok:true,situationTh:e.descTh,outcomeTh:result};};return e;
}
const extraEvents=[
 makeEvent({id:'EVT_SECT_OPEN_GRANARY',nameTh:'เปิดยุ้งฉางรับครอบครัวหนีน้ำ',icon:'🍚',aftermathId:'AF_SECT_OPEN_GRANARY',descTh:'สำนักเลือกแบ่งอาหาร 12 และศิลา 8 ให้ชาวบ้านที่พลัดถิ่น แลกการฟื้นตัวของหมู่บ้านและขวัญกำลังใจชั่วคราว',cost:{food:12,stones:8},costTh:'อาหาร 12 · ศิลา 8',check:g=>g.s.villageHP>=980?'หมู่บ้านไม่ต้องการครัวบรรเทาทุกข์ในตอนนี้':'',apply:g=>{g.s.villageHP=Math.min(1000,g.s.villageHP+50);g.s.life.pavilionRelation+=2;return 'ใช้เสบียงจริง 12 และศิลา 8 · หมู่บ้านฟื้น 50 · ไมตรีชุมชน +2';},aftermath:{descTh:'ความร่วมมือประคองผู้ลี้ภัย · พลังชีวิตสูงสุด +5 ชั่วคราว',mods:{add:{maxHP:5}}}}),
 makeEvent({id:'EVT_SECT_SEED_EXCHANGE',nameTh:'พ่อค้าเมล็ดขอสมุนไพรแลกพันธุ์',icon:'🌱',aftermathId:'AF_SECT_SEED_EXCHANGE',descTh:'แลกหญ้าน้ำค้าง 3 และศิลา 10 กับเมล็ดหญ้าน้ำค้าง 2 และเมล็ดชาเพลิง 1 เป็นทุนเพาะปลูกระยะยาว',cost:{stones:10,materials:{[HERB]:3}},costTh:'หญ้าน้ำค้าง 3 · ศิลา 10',apply:g=>{g.s.seedStock.dew=(g.s.seedStock.dew||0)+2;g.s.seedStock.cinder=(g.s.seedStock.cinder||0)+1;return 'ใช้หญ้าน้ำค้างจริง 3 และศิลา 10 · ได้เมล็ดหญ้าน้ำค้าง ×2 และเมล็ดชาเพลิง ×1 สำหรับแปลงปลูกจริง';},aftermath:{descTh:'เรียนรู้วิธีเก็บเมล็ดจากพ่อค้า · ต้านสถานะ +2% ชั่วคราว',mods:{add:{controlResist:.02}}}}),
 makeEvent({id:'EVT_SECT_IRRIGATION',nameTh:'ช่างชุมชนเสนอซ่อมรางน้ำสวน',icon:'💧',aftermathId:'AF_SECT_IRRIGATION',descTh:'ใช้ไม้ 4 และศิลา 12 ทำรางน้ำชั่วคราวให้แปลงที่ยังเติบโต เพิ่มความชื้นและเร่งโตเล็กน้อย',cost:{wood:4,stones:12},costTh:'ไม้ 4 · ศิลา 12',check:g=>!g.built('garden')||!(g.s.gardenPlots||[]).some(p=>p.cropId&&p.moisture<80&&p.growth<(root.FrontierData.CROPS[p.cropId]?.growSeconds||0))?'ต้องมีสวนและพืชที่ยังโตซึ่งต้องการน้ำ':'',apply:g=>{let count=0;for(const p of g.s.gardenPlots||[]){const c=root.FrontierData.CROPS[p.cropId];if(c&&p.growth<c.growSeconds){p.moisture=Math.min(100,p.moisture+35);p.growth=Math.min(c.growSeconds,p.growth+12);count++;}}return 'ใช้ไม้จริง 4 และศิลา 12 · แปลงปลูก '+count+' แปลงได้รับความชื้น +35 และเติบโต +12';},aftermath:{descTh:'เสียงน้ำทำให้ลมปราณสงบ · ปราณสูงสุด +5 ชั่วคราว',mods:{add:{maxQi:5}}}}),
 makeEvent({id:'EVT_SECT_ORE_ASSAY',nameTh:'ช่างพเนจรรับคัดแยกแร่เก่า',icon:'⛏️',aftermathId:'AF_SECT_ORE_ASSAY',descTh:'ใช้เหล็กดำ 4 และศิลา 8 คัดแยกทองแดงสื่อปราณ 1 หน่วยเข้าคลังจริง ต้องมีที่เก็บผลผลิตก่อนเริ่ม',cost:{stones:8,materials:{[ORE]:4}},costTh:'เหล็กดำ 4 · ศิลา 8',check:g=>!g.canAcceptMaterial(g.bank,COPPER)?'คลังไม่มีช่องว่างสำหรับทองแดงสื่อปราณ':'',apply:g=>{const r=g.add(g.bank,COPPER,1,'SECT_ORE_ASSAY');if(!r.ok)throw Error('พื้นที่คลังเปลี่ยนระหว่างคัดแยกแร่');return 'ใช้เหล็กดำจริง 4 และศิลา 8 · ทองแดงสื่อปราณ 1 หน่วยเข้าคลัง';},aftermath:{descTh:'ตรวจคุณภาพเครื่องมือประจำสำนัก · เกราะ +4% ชั่วคราว',mods:{scale:{armor:1.04}}}}),
 makeEvent({id:'EVT_SECT_DETOX_RETREAT',nameTh:'หมอหมู่บ้านเปิดคราวพักพิษโอสถ',icon:'🍵',aftermathId:'AF_SECT_DETOX_RETREAT',descTh:'ใช้หญ้าน้ำค้าง 3 อาหาร 6 และศิลา 10 ดูแลศิษย์ที่อยู่ในสำนัก ลดพิษโอสถและความอ่อนล้าตามอาการจริง',cost:{stones:10,food:6,materials:{[HERB]:3}},costTh:'หญ้าน้ำค้าง 3 · อาหาร 6 · ศิลา 10',check:g=>!g.heroes.some(n=>member(g,n)&&!n.stageLocal.offmap&&!n.stageLocal.journey&&((n.jianghu.pillToxicity||0)>0||(n.core.condition.fatigue||0)>10))?'ยังไม่มีศิษย์ในสำนักที่ต้องพักพิษหรืออ่อนล้า':'',apply:g=>{let count=0;for(const n of g.heroes){if(!member(g,n)||n.stageLocal.offmap||n.stageLocal.journey)continue;n.jianghu.pillToxicity=Math.max(0,(n.jianghu.pillToxicity||0)-10);n.core.condition.fatigue=Math.max(0,(n.core.condition.fatigue||0)-10);count++;}return 'ใช้ตัวยา อาหาร และค่าหมอตามจริง · ศิษย์ในสำนัก '+count+' คนลดพิษโอสถ 10 และความอ่อนล้า 10';},aftermath:{descTh:'พักฟื้นหลังดื่มยาชำระพิษ · พลังชีวิตสูงสุด +4 ชั่วคราว',mods:{add:{maxHP:4}}}}),
 makeEvent({id:'EVT_SECT_WAYSTATION',nameTh:'ร่วมตั้งศาลาพักทางของพ่อค้า',icon:'🏮',aftermathId:'AF_SECT_WAYSTATION',descTh:'ใช้ไม้ 3 และศิลา 18 ตั้งจุดพักคาราวาน เติมสินค้าราคาปกติในตลาดเป็นหญ้าน้ำค้างและเหล็กดำอย่างละ 4 หน่วย สำนักยังต้องซื้อสินค้าตามจริง',cost:{wood:3,stones:18},costTh:'ไม้ 3 · ศิลา 18',check:g=>g.routeBlocked?.()?'เส้นทางยังถูกกองโจรปิด ไม่สามารถส่งคาราวานเข้าได้':'',apply:g=>{for(const id of [HERB,ORE])g.s.merchantStock[id]=Math.min(40,(g.s.merchantStock[id]||0)+4);g.s.life.pavilionRelation+=2;return 'ใช้ไม้จริง 3 และศิลา 18 · ตลาดมีหญ้าน้ำค้างและเหล็กดำเพิ่มอย่างละ 4 หน่วยสำหรับซื้อ · ไมตรีชุมชน +2';},aftermath:{descTh:'จดจำจุดพักและทางเลี่ยง · หลบหลีก +2 ชั่วคราว',mods:{add:{evasion:2}}}})
];
function registerEvents(){const list=story()?.DYNAMIC_EVENTS_CATALOG_V202;if(!Array.isArray(list))return false;for(const e of extraEvents)if(!list.some(x=>x.id===e.id))list.push(e);return true;}
const api={VERSION:'2.02-sect-sidecontracts',catalog,inspect,tick,options,finish,accept,cancel,actionLabel,workActivity,registerEvents};
root.JianghuSideQuests=api;registerEvents();if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
