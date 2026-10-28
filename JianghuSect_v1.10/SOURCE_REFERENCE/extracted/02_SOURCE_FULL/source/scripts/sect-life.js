/* Living Sect v1: institutions and a grounded courier story on the same NPCs.
   Human Foundation is consumed, never extended or rerolled by this module. */
(function(root){'use strict';
const H=root.HumanCore||(typeof require==='function'?require('./human'):null);
const E=root.World2026Engine||(typeof require==='function'?require('./legacy/src/engine'):null);
const D=root.JianghuSectDoctrines190Data||(typeof require==='function'?require('./legacy/data/jianghu_sect_doctrines190_data'):null);
const VERSION=1,DAY=20,HERB='MAT_HERB_DEW_GRASS_1',ORE='MAT_ORE_BLACK_IRON_1',CIN='MAT_ORE_CINNABAR_1';
const alive=n=>!!n&&n.alive&&n.health>0,dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v)),round=v=>Math.round(v*100)/100;
const TRADE_HOUSE=D.SECT_DOCTRINES_40.find(s=>s.sectId==='SG'),HOME_DOCTRINE=D.SECT_DOCTRINES_40.find(s=>s.sectId==='TH');
const MARKET={id:'market',x:600,y:2040},EXIT={id:'exit',x:180,y:1850};
const ROLES={master:{name:'เจ้าสำนัก',activity:'sectMaster'},steward:{name:'ผู้ดูแลคลัง',activity:'sectSteward'}};
const AGENDAS={
 cultivate:{name:'สั่งสมตบะและรากฐานมรรคา',activity:'train',actions:{train:16,breakthrough:14,craft:4},description:'หนุนนำให้ศิษย์เดินลมปราณและเตรียมทะลวงคอขวดตามวิถีแห่งตน'},
 resource:{name:'สั่งสมเสบียงและทรัพยากรวิญญาณ',activity:'deposit',actions:{herb:12,mine:12,wood:12,deposit:18,craft:5,resupplyFood:16},description:'มุ่งเน้นการเสาะหาสมุนไพร สกัดแร่ปราณ และส่งเข้าคลังสำนัก'},
 defend:{name:'พิทักษ์ปวงชนและปราบมารร้าย',activity:'defend',actions:{defend:18,hunt:9,'bounty':9,heal:10,aidCourier:16,assault:4},description:'ให้ความสำคัญกับการคุ้มภัยชาวบ้านและกวาดล้างอสูรโจรใกล้สำนัก'},
 trade:{name:'เบิกทางค้าและท่องยุทธภพ',activity:'trade',actions:{trade:16,scout:8,buy:5,craft:8,deposit:5},description:'ส่งเสริมคาราวานข้ามด่าน การสำรวจแดนไพร และการจัดหาวัตถุดิบ'},
 care:{name:'ถนอมชีวิตและผูกสายสัมพันธ์',activity:'social',actions:{social:13,heal:14,rest:5,aidCourier:24,deposit:7,resupplyFood:14,takeCourierCargo:-18},description:'ประคับประคองผู้บาดเจ็บและถักทอไมตรีในสำนักก่อนแผ่อำนาจ'}
};
H.registerActivity({id:'sectMaster',label:'บริหารสำนัก',skillDomain:'administration',valueWeights:{sectDuty:.35,powerStatus:.4,honorLegacy:.25,freedom:-.2},personalityWeights:{discipline:.15,integrity:.15,ambition:.15},bodyWeights:{endurance:1},cognitiveWeights:{planning:.35,socialInsight:.25,metacognition:.2,verbalComprehension:.2},aptitudeWeights:{command:.25,socialCommerce:.08},interestWeights:{leadership:.65,expression:.2,care:.15},needRelief:{competence:.5}});
H.registerActivity({id:'sectSteward',label:'ดูแลคลังสำนัก',skillDomain:'stewardship',valueWeights:{sectDuty:.4,wealthResource:.2,honorLegacy:.15,freedom:-.15},personalityWeights:{discipline:.3,rationality:.25,integrity:.15},bodyWeights:{endurance:1},cognitiveWeights:{planning:.3,numeracy:.4,workingMemory:.3},aptitudeWeights:{command:.12,socialCommerce:.12},interestWeights:{leadership:.3,exchange:.3,analysis:.4},needRelief:{competence:.5}});
H.registerActivity({id:'aidCourier',label:'ช่วยผู้ส่งสารบาดเจ็บ',skillDomain:'firstAid',valueWeights:{familyClan:.2,sectDuty:.25,honorLegacy:.35,knowledgeCraft:.08,wealthResource:-.08},personalityWeights:{empathy:.65,integrity:.25,caution:-.08},bodyWeights:{dexterity:.5,senseAcuity:.3,coordination:.2},cognitiveWeights:{attention:.35,systemsThinking:.35,socialInsight:.3},aptitudeWeights:{crafting:.08,comprehension:.08},interestWeights:{care:.7,companionship:.15,analysis:.15},needRelief:{competence:.5,social:.3}});
H.registerActivity({id:'takeCourierCargo',label:'ฉวยของจากผู้ส่งสาร',skillDomain:'coercion',valueWeights:{wealthResource:.5,powerStatus:.2,freedom:.1,honorLegacy:-.35,sectDuty:-.15},personalityWeights:{integrity:-.9,empathy:-.6,aggression:.15,caution:.1},bodyWeights:{dexterity:.6,agility:.4},cognitiveWeights:{planning:.5,socialInsight:.5},aptitudeWeights:{socialCommerce:.06},interestWeights:{exchange:.4,risk:.4,competition:.2},needRelief:{}});
H.registerActivity({id:'returnKindness',label:'ตอบแทนบุญคุณ',skillDomain:'relationships',valueWeights:{honorLegacy:.45,sectDuty:.2,familyClan:.1,wealthResource:-.15},personalityWeights:{integrity:.35,loyalty:.25,empathy:.2},bodyWeights:{},cognitiveWeights:{socialInsight:.6,planning:.4},aptitudeWeights:{socialCommerce:.12},interestWeights:{care:.5,companionship:.3,exchange:.2},needRelief:{social:.5}});

class SectLife{
 constructor(game){this.g=game;this.ensure();}
 get data(){return this.g.s.life;}
 ensure(){const g=this.g;if(g.s.life?.schemaVersion>VERSION)throw Error('เซฟใช้ระบบชีวิตสำนักรุ่นใหม่กว่าเกมนี้');if(g.s.life&&g.s.life.schemaVersion!==VERSION)throw Error('ข้อมูลชีวิตสำนักไม่ตรงรุ่น');
  if(!g.s.life)g.s.life={schemaVersion:VERSION,members:{},offices:{master:null,steward:null},agenda:null,councils:[],nextCouncilAt:g.s.t,nextAgendaAt:g.s.t,nextThink:g.s.t,meetingAt:-200,reliefEscrow:0,pavilionRelation:0,story:null,storyAt:Math.max(80,g.s.t+35),journal:[],nextJournalId:1};
  const s=this.data;if(!s.members||!s.offices||!Array.isArray(s.journal)||!Array.isArray(s.councils)||!Number.isFinite(s.reliefEscrow)||s.reliefEscrow<0||!Number.isFinite(s.pavilionRelation))throw Error('ข้อมูลชีวิตสำนักไม่ครบ');
  for(const n of g.heroes)this.enrol(n);
  this.syncLegacyPositions();
  return s;
 }
 enrol(n){
  if(!n||n.stageLocal?.visitor||n.stageLocal?.enemy||n.stageLocal?.service)return null;
  if(!this.data.members[n.id]){this.data.nextCouncilAt=Math.min(this.data.nextCouncilAt,this.g.s.t+1);this.data.members[n.id]={joinedAt:this.g.s.t,merit:0,resourcesDelivered:0,aid:0,commissions:0,kills:0,disgracedUntil:0,deeds:[]};}
  return this.data.members[n.id];
 }
 member(n){return n?this.data.members[n.id]||null:null;}
 rank(n){const m=this.member(n);if(!m)return 'ผู้มาเยือน';if(m.disgracedUntil>this.g.s.t)return 'พักหน้าที่';if(m.merit>=32&&this.g.s.t-m.joinedAt>=120&&(n.jianghu.realizationBand||1)>=1.5)return 'ศิษย์อาวุโส';if(m.merit>=8&&this.g.s.t-m.joinedAt>=40)return 'ศิษย์ประจำสำนัก';return 'ศิษย์ใหม่';}
 roles(n){return Object.entries(this.data.offices).filter(([,o])=>o?.npcId===n.id).map(([id])=>ROLES[id]?.name||(id==='scriptureElder'?'ผู้อาวุโสหอคัมภีร์':id==='constructionElder'?'ผู้อาวุโสฝ่ายโยธา':'ผู้อาวุโส'));}
 get visitors(){const id=this.data.story?.actorId;return id&&this.g.world.npcs[id]?[this.g.world.npcs[id]]:[];}
 log(title,text,npcIds=[]){const row={id:'life-'+this.data.nextJournalId++,t:this.g.s.t,title,text,npcIds:[...new Set(npcIds)]};this.data.journal.unshift(row);this.data.journal.splice(80);this.g.note(title+' · '+text);return row;}
 credit(n,amount,reason){const m=this.member(n);if(!m||!alive(n))return;const oldRank=this.rank(n);m.merit=round(Math.max(0,m.merit+amount));root.JianghuSectContributions?.creditWork(this.g,n,amount,reason);m.deeds.unshift({t:this.g.s.t,amount:round(amount),reason});m.deeds.splice(16);const rank=this.rank(n);if(rank!==oldRank&&rank!=='พักหน้าที่')this.log('เติบโตในสำนัก',n.name+' ได้รับการยอมรับเป็น'+rank,[n.id]);}
 recordKill(n){const m=n&&this.member(n);if(m){m.kills++;this.credit(n,3,'ปราบภัยด้วยกำลังของตน');}}
 recordBounty(n){this.credit(n,5,'ทำประกาศสำเร็จและได้รับค่าหัวจริง');}
 beforeWork(n){return {load:H.load(n),wood:this.g.s.wood,progress:n.jianghu.cultivationProgress,camp:this.g.s.campKnown};}
 onWork(n,action,success,before){if(!success)return;const m=this.member(n);if(!m)return;
  let merit=0,reason='';
  if(action==='train'&&n.jianghu.cultivationProgress>before.progress){merit=1;reason='ฝึกตนจนก้าวหน้าจริง';}
  if(action==='deposit'){const q=Math.max(0,before.load-H.load(n));if(q>0){m.resourcesDelivered+=q;merit=Math.min(5,q*.6);reason='นำวัสดุเข้าคลัง '+q+' หน่วย';}}
  if(['herb','mine'].includes(action)){const q=Math.max(0,H.load(n)-before.load);if(q>0){merit=Math.min(2,q*.35);reason='เก็บวัสดุ '+q+' หน่วย';}}
  if(action==='wood'){merit=Math.min(2,Math.max(0,this.g.s.wood-before.wood)*.35);reason='ส่งไม้ไผ่ให้สำนัก';}
  if(action==='scout'&&!before.camp&&this.g.s.campKnown){merit=4;reason='ค้นพบที่ตั้งค่ายโจร';}
  if(action==='craft'){m.commissions++;merit=1;reason='จัดหางานช่างที่เริ่มผลิตจริง';}
  if(action==='aidCourier'){m.aid++;merit=8;reason='ช่วยชีวิตผู้ส่งสาร';}
  if(action==='resupplyFood'){merit=1.5;reason='จัดหาเสบียงอาหารเข้าสำนัก';}
  if(merit>0)this.credit(n,merit,reason);
  const adj=this.authorityAdjustment(n,action);if(adj>5&&H.liking(n,action)<35)n.core.human.state.autonomy=clamp(n.core.human.state.autonomy+5);
 }
 available(n){return alive(n)&&!n.stageLocal.offmap&&n.health>=45&&n.core.condition.fatigue<90&&n.stageLocal.action!=='seclusion'&&(this.member(n)?.disgracedUntil||0)<=this.g.s.t;}
 offer(n,role){const activity=ROLES[role].activity,accept=H.option(n,{id:'accept',baseScore:41+H.memoryBias(n,activity,this.g.s.t)*.25},activity),decline={id:'decline',baseScore:35,valueWeights:{freedom:.35,familyClan:.15},personalityWeights:{caution:.1}};
  const opts=[accept,decline],ctx={rng:this.g.rng,temperature:4,decisionTag:'SECT_OFFICE_'+role},scores=E.scoreNpcDecisionOptions(this.g.world,n,opts,ctx),pick=E.chooseNpcDecisionOption(this.g.world,n,opts,{...ctx,preScoredDecision:scores});
  return {npcId:n.id,accepted:pick.chosenId==='accept',acceptScore:scores.options.find(o=>o.id==='accept').score,declineScore:scores.options.find(o=>o.id==='decline').score,capacity:H.capacity(n,activity).total};
 }
 syncLegacyPositions(){
  const g=this.g,st=g.world?.states?.TH,offices=this.data?.offices||{};
  if(!st)return;
  st.positions=st.positions||{};
  for(const k of Object.keys(st.positions))st.positions[k]=null;
  const masterId=offices.master?.npcId&&g.s.heroIds.includes(offices.master.npcId)?offices.master.npcId:null;
  const stewardId=offices.steward?.npcId&&g.s.heroIds.includes(offices.steward.npcId)?offices.steward.npcId:null;
  const grandElderId=offices.grandElder?.npcId&&g.s.heroIds.includes(offices.grandElder.npcId)?offices.grandElder.npcId:null;
  const lawElderId=offices.lawElder?.npcId&&g.s.heroIds.includes(offices.lawElder.npcId)?offices.lawElder.npcId:null;
  const chiefDiscipleId=offices.chiefDisciple?.npcId&&g.s.heroIds.includes(offices.chiefDisciple.npcId)?offices.chiefDisciple.npcId:null;
  const externalElderId=offices.externalElder?.npcId&&g.s.heroIds.includes(offices.externalElder.npcId)?offices.externalElder.npcId:null;
  const scriptureElderId=offices.scriptureElder?.npcId&&g.s.heroIds.includes(offices.scriptureElder.npcId)?offices.scriptureElder.npcId:null;
  st.positions.HEAD_OF_STATE=masterId;
  st.positions.PRIME_MINISTER=grandElderId;
  st.positions.LOGISTICS_CHIEF=stewardId;
  st.positions.FINANCE_MINISTER=stewardId;
  st.positions.DEFENSE_MINISTER=lawElderId;
  st.positions.SUPREME_COMMANDER=chiefDiscipleId||lawElderId;
  st.positions.FOREIGN_MINISTER=externalElderId;
  st.positions.CHIEF_SCIENTIST=scriptureElderId;
  for(const n of Object.values(g.world.npcs||{})){
   if(!n)continue;
   if(g.s.heroIds.includes(n.id)){
    const held=Object.entries(offices).find(([,o])=>o?.npcId===n.id)?.[0];
    n.positionId=held==='master'?'HEAD_OF_STATE':held?'ELDER':'DISCIPLE';
    n.positionTitle=held?(ROLES[held]?.name||'ผู้อาวุโส'):this.rank(n);
   }else if(n.stageLocal?.service==='BANK'){
    n.positionId='SECT_STORAGE';n.positionTitle='คลังสำนัก';
   }else if(n.stageLocal?.service){
    n.positionId='SECT_ARTISAN';n.positionTitle='ช่างประจำสำนัก';
   }else if(n.stageLocal?.enemy){
    n.positionId=n.stageLocal.boss?'BANDIT_BOSS':'BANDIT';n.positionTitle=n.stageLocal.boss?'หัวหน้าโจรผาทมิฬ':'โจรผาทมิฬ';
   }else if(n.stageLocal?.envoy){
    n.positionId='EXTERNAL_ENVOY';n.positionTitle='ทูตต่างสำนัก';
   }else if(n.stageLocal?.visitor){
    n.positionId='VISITOR';n.positionTitle='ผู้เดินทางผ่านหุบเขา';
   }
  }
 }
 convene(reason='ครบวาระ'){const g=this.g,s=this.data,members=g.heroes.filter(alive),previous=s.offices.master?.npcId;
  const candidates=members.filter(n=>this.available(n)),offers=candidates.map(n=>this.offer(n,'master')),willing=offers.filter(o=>o.accepted),votes=[];
  if(willing.length){for(const voter of members.filter(n=>!n.stageLocal.offmap&&n.stageLocal.action!=='seclusion')){const opts=willing.map(c=>{const candidate=g.world.npcs[c.npcId],rel=E.getRelationshipV130(g.world,voter,candidate,false),weights={};for(const [id,value] of Object.entries(candidate.core.values))weights[id]=(value-50)*.0025;
    return {id:c.npcId,baseScore:30+c.capacity*.35+Math.min(8,(this.member(candidate)?.merit||0)*.1)+(rel?.affinity||0)*.08+(c.npcId===voter.id?(voter.personality.ambition||0)*.05:0)+(c.npcId===previous?5:0),valueWeights:weights};});
    const choice=E.chooseNpcDecisionOption(g.world,voter,opts,{rng:g.rng,temperature:H.temperature(voter),decisionTag:'SECT_COUNCIL'});votes.push({voterId:voter.id,candidateId:choice.chosenId});}
   const counts=Object.fromEntries(willing.map(c=>[c.npcId,0]));for(const v of votes)counts[v.candidateId]++;
   const winner=[...willing].sort((a,b)=>counts[b.npcId]-counts[a.npcId]||b.capacity-a.capacity||a.npcId.localeCompare(b.npcId))[0];
   s.offices.master={npcId:winner.npcId,since:g.s.t,votes:counts[winner.npcId],acting:(this.member(g.world.npcs[winner.npcId])?.merit||0)<8,capacity:winner.capacity};
  }else s.offices.master=null;
  const stewards=candidates.filter(n=>n.id!==s.offices.master?.npcId).map(n=>this.offer(n,'steward')).filter(o=>o.accepted).sort((a,b)=>b.capacity-a.capacity||b.acceptScore-a.acceptScore||a.npcId.localeCompare(b.npcId));
  s.offices.steward=stewards.length?{npcId:stewards[0].npcId,since:g.s.t,capacity:stewards[0].capacity}:null;
  g.realm?.electOfficers(candidates);
  this.syncLegacyPositions();
  s.councils.unshift({t:g.s.t,reason,offers,votes,masterId:s.offices.master?.npcId||null,stewardId:s.offices.steward?.npcId||null});s.councils.splice(12);s.nextCouncilAt=g.s.t+160;s.nextAgendaAt=g.s.t;
  if(s.offices.master?.npcId!==previous){if(s.offices.master)this.g.remember(g.world.npcs[s.offices.master.npcId],'sectMaster',6,'ได้รับการยอมรับให้ดูแลสำนัก');const name=s.offices.master?g.world.npcs[s.offices.master.npcId].name:'ยังไม่มีผู้ยอมรับตำแหน่ง';this.log('สภาสำนัก',name+(s.offices.master?' ได้รับการผลักดันเป็นเจ้าสำนัก':' · สำนักประคองตนโดยไม่มีผู้นำ'),s.offices.master?[s.offices.master.npcId]:[]);}
 }
 chooseAgenda(){const g=this.g,s=this.data,n=g.world.npcs[s.offices.master?.npcId];if(!alive(n)){s.agenda=null;return;}if(n.stageLocal.offmap||n.stageLocal.action==='seclusion'){s.nextAgendaAt=g.s.t+20;return;}
  const legacy=HOME_DOCTRINE.leaderPersonalityWeights,threat=g.routeBlocked()||g.s.villageHP<650,scarce=g.ore<7||g.count(g.bank,HERB)<5||g.s.wood<10||g.s.food<15;
  const opts=Object.entries(AGENDAS).map(([id,d])=>{let base=42+(id==='defend'&&threat?25:0)+(id==='resource'&&scarce?18:0)+(id==='care'&&g.heroes.some(h=>alive(h)&&h.health<60)?16:0);
   if(['defend','care'].includes(id))base+=(legacy.cautious.avoidResourceWar-1)*(n.personality.caution||0)*.12;
   if(['cultivate','trade'].includes(id))base+=(legacy.ambitious.preferExploreAndContest-1)*(n.personality.ambition||0)*.12;
   if(['trade','resource'].includes(id))base+=(legacy.rational.optimizeTotalDeliveryCost-1)*(n.personality.rationality||0)*.12;
   if(id==='care')base+=(legacy.empathetic.prioritizeHealingAndProtection-1)*(n.personality.empathy||0)*.15;
   return H.option(n,{id,baseScore:base},d.activity);});
  const ctx={rng:g.rng,temperature:H.temperature(n),decisionTag:'SECT_AGENDA'},scored=E.scoreNpcDecisionOptions(g.world,n,opts,ctx),choice=E.chooseNpcDecisionOption(g.world,n,opts,{...ctx,preScoredDecision:scored}),old=s.agenda?.id;
  s.agenda={id:choice.chosenId,leaderId:n.id,at:g.s.t,scores:scored.options.map(o=>({id:o.id,score:o.score,valueAdj:o.contributions.valueAdj,interestAdj:o.option.human.interestAdj}))};s.nextAgendaAt=g.s.t+40;H.learn(n,'sectMaster',.2);
  if(old!==choice.chosenId)this.log('แนวทางเจ้าสำนัก',n.name+' เสนอให้'+AGENDAS[choice.chosenId].name,[n.id]);
 }
 authorityAdjustment(n,action){const s=this.data,master=this.g.world.npcs[s.offices.master?.npcId],agenda=AGENDAS[s.agenda?.id];let adj=0;
  if(alive(master)&&agenda){const relation=E.getRelationshipV130(this.g.world,n,master,false),acceptance=clamp(.35+((n.personality.loyalty||0)+(n.core.values.sectDuty||0)-(n.core.values.freedom||0))/250+(relation?.respect||0)/400,.1,1),key=action.startsWith('bounty:')?'bounty':action;adj=(agenda.actions[key]||0)*acceptance;}
  if(s.offices.steward?.npcId===n.id&&this.available(n)){if(action==='deposit'||action==='resupplyFood')adj+=14;else if(['herb','mine','wood'].includes(action))adj+=8;}return round(adj);
 }
 requestCouncil(){const g=this.g;if(g.s.t-this.data.meetingAt<80)return {ok:false,reason:'รอให้สมาชิกใช้ชีวิตก่อนเรียกประชุมใหม่'};if(!g.heroes.some(alive))return {ok:false,reason:'ยังไม่มีสมาชิกที่มีชีวิต'};if(!g.money(-30,'เตรียมการประชุมสำนัก'))return {ok:false,reason:'ต้องมี 30 ศิลา'};this.data.meetingAt=g.s.t;this.convene('ผู้ดูแลจัดการประชุม');this.chooseAgenda();return {ok:true};}
 fundRelief(){if(!['arriving','waiting'].includes(this.data.story?.phase))return {ok:false,reason:'ยังไม่มีผู้บาดเจ็บรอความช่วยเหลือ'};if(this.data.reliefEscrow>=120)return {ok:false,reason:'กองทุนมีเพียงพอแล้ว'};if(!this.g.money(-60,'สำรองกองทุนช่วยเหลือผู้เดินทาง'))return {ok:false,reason:'ต้องมี 60 ศิลา'};this.data.reliefEscrow+=60;return {ok:true};}
 refundRelief(){const amount=this.data.reliefEscrow;if(amount<=0)return {ok:false,reason:'ไม่มีกองทุนเหลือให้คืน'};this.data.reliefEscrow=0;this.g.money(amount,'คืนกองทุนช่วยเหลือที่ยังไม่ใช้');return {ok:true,amount};}
 marketPrice(base,quantity=1){return Math.ceil(base*quantity*clamp(1-this.data.pavilionRelation*.005,.8,1.25));}
 routeRisk(base){return clamp(base-this.data.pavilionRelation*.0015,0,.65);}
 announceCourier(){const g=this.g;if(this.data.story||!g.built('hall')||!g.heroes.some(alive))return false;
  const surnames=['เฉิน','ลั่ว','เซี่ย','เว่ย','ตู้','เฟิง'],names=['จื่ออัน','อวิ๋นเหอ','เยี่ยนชิง','หมิงซิน','หยุนจื้อ','ชิงหลัว'];
  const n=g.create(surnames[g.rng.int(0,5)]+names[g.rng.int(0,5)]+' · ผู้ส่งสาร',{role:'courier',sectId:TRADE_HOUSE.sectId,preserveName:true});
  g.initializePerson(n,EXIT,{role:'courier',visitor:true,originSectId:TRADE_HOUSE.sectId});
  n.stageLocal.goal='ขอความช่วยเหลือที่ตลาด';n.health=32;H.injure(n,68,g.s.t);n.core.condition.fatigue=25;E.setSpiritStonesV140(n,18);g.add(n,ORE,4,'PAVILION_COURIER_CARGO');g.add(n,CIN,2,'PAVILION_COURIER_CARGO');
  const story={id:'courier-debt',sourceChainId:'CH_COURIER_DEBT',actorId:n.id,phase:'arriving',createdAt:g.s.t,arrivedAt:null,expiresAt:g.s.t+190,helperId:null,thiefId:null,outcome:null,repayment:null,returnAt:null,giftDelivered:false,lockedBranches:[],receipts:[],decisions:[]};this.data.story=story;g.send(n,'seekAid',MARKET,0);this.log('ผู้ส่งสารกลางสายฝน',n.name+' จาก'+TRADE_HOUSE.nameTh+' เดินเข้าหุบเขาพร้อมบาดแผล',[n.id]);return true;
 }
 courierOptions(n,add){const story=this.data.story,courier=this.g.world.npcs[story?.actorId];if(story?.phase!=='waiting'||!alive(courier)||!alive(n)||n.health<40)return;
  const g=this.g,medical=g.count(n,HERB)>0||g.count(g.bank,HERB)>0||g.s.food>=2;
  if(medical)add('aidCourier',73+(this.data.reliefEscrow>=10?16:0),{id:courier.id,x:courier.stageLocal.x,y:courier.stageLocal.y},8,{}, {sceneTarget:courier.id,reason:'ผู้ส่งสารบาดเจ็บ · ใช้สมุนไพร 1 หรืออาหาร 2 · ต้องพบตัวจริง'+(this.data.reliefEscrow>=10?' · กองทุนตอบแทน 10 ศิลา':'')});
  const cargo=H.load(courier)>0||E.getSpiritStonesV140(courier)>0;if(cargo)add('takeCourierCargo',64,{id:courier.id,x:courier.stageLocal.x,y:courier.stageLocal.y},5,{}, {sceneTarget:courier.id,unethical:true,reason:'ฉวยของที่มีจริง · พ่อค้าในตลาดอาจเห็นและความสัมพันธ์เสียหาย'});
 }
 finishAction(n,action){if(!['aidCourier','takeCourierCargo'].includes(action))return null;const g=this.g,s=this.data,story=s.story,courier=g.world.npcs[story?.actorId],valid=story?.phase==='waiting'&&alive(courier)&&alive(n)&&n.stageLocal.sceneTarget===courier.id&&dist(n.stageLocal,courier.stageLocal)<=125;
  if(!valid)return {handled:true,success:false};
  if(action==='aidCourier'){let cost=null;if(g.consume(n,HERB,1))cost={ownerId:n.id,material:HERB,quantity:1};else if(dist(n.stageLocal,MARKET)<140&&g.consume(g.bank,HERB,1))cost={ownerId:g.bank.id,material:HERB,quantity:1};else if(dist(n.stageLocal,MARKET)<140&&g.s.food>=2){g.s.food-=2;cost={ownerId:g.bank.id,material:'food',quantity:2};}if(!cost)return {handled:true,success:false};
   const hpBefore=courier.health;courier.health=Math.min(100,courier.health+30+H.capacity(n,'aidCourier').cognition*.16);H.recover(courier,32);story.phase='grateful';story.helperId=n.id;story.decideAt=g.s.t+12;story.lockedBranches=['theft','ignored'];n.stageLocal.sceneTarget=null;courier.stageLocal.goal='พักฟื้นและคิดว่าจะตอบแทนอย่างไร';const reward=s.reliefEscrow>=10?10:0;if(reward){s.reliefEscrow-=reward;E.addSpiritStonesV140(n,reward);}s.pavilionRelation=clamp(s.pavilionRelation+8,-100,100);
   this.relate(n,courier,15,6);g.remember(n,'aidCourier',9,'ช่วย '+courier.name+' ด้วยเสบียงจริง');g.remember(courier,'aidCourier',12,'ได้รับความช่วยเหลือจาก '+n.name);story.receipts.push({t:g.s.t,kind:'medicalCare',actorId:n.id,cost,reward,hpBefore,hpAfter:courier.health});this.log('หนี้บุญคุณใต้สายฝน',n.name+' ช่วย'+courier.name+' สำเร็จ ผู้ส่งสารจะตัดสินใจตอบแทนด้วยตนเอง',[n.id,courier.id]);return {handled:true,success:true};
  }
  const transfers=[];for(const [id,want] of [[ORE,2],[CIN,1]]){const qty=Math.min(want,g.count(courier,id),Math.max(0,H.carryLimit(n)-H.load(n)));if(qty>0&&g.add(n,id,qty,'COURIER_THEFT').ok){g.consume(courier,id,qty);transfers.push({material:id,quantity:qty});}}
  const cash=Math.min(12,E.getSpiritStonesV140(courier));if(cash){E.addSpiritStonesV140(courier,-cash);E.addSpiritStonesV140(n,cash);}if(!cash&&!transfers.length)return {handled:true,success:false};
  story.phase='wronged';story.thiefId=n.id;story.lockedBranches=['saved','ignored'];story.outcome='theft';s.pavilionRelation=clamp(s.pavilionRelation-22,-100,100);this.relate(n,courier,-40,-6);g.remember(courier,'takeCourierCargo',-15,'ถูก '+n.name+' ฉวยของขณะบาดเจ็บ');g.remember(n,'takeCourierCargo',-4,'พ่อค้าที่ตลาดพบเห็นการฉวยของ');
  const m=this.member(n);if(m){m.disgracedUntil=g.s.t+200;this.credit(n,-12,'ฉวยของผู้เดินทางที่ตลาด');}story.receipts.push({t:g.s.t,kind:'theft',actorId:n.id,cash,transfers});story.decisions.push({t:g.s.t,kind:'memberBranch',choice:'theft',actorId:n.id});g.send(courier,'leaveValley',EXIT,0);this.log('รอยร้าวจากตลาด',n.name+' ฉวยของจาก'+courier.name+' พ่อค้าขึ้นราคาและสำนักพักหน้าที่ผู้ก่อเหตุ',[n.id,courier.id]);return {handled:true,success:true};
 }
 relate(a,b,affinity,bond){for(const [x,y] of [[a,b],[b,a]]){const r=E.getRelationshipV130(this.g.world,x,y,true);r.affinity=clamp((r.affinity||0)+affinity,-100,100);r.bond=clamp((r.bond||0)+bond,0,100);}}
 chooseRepayment(){const g=this.g,story=this.data.story,n=g.world.npcs[story.actorId];if(story.phase!=='grateful'||!alive(n))return;
  const opts=[H.option(n,{id:'goods',baseScore:43,valueWeights:{knowledgeCraft:.15,sectDuty:.2}},'returnKindness'),H.option(n,{id:'return',baseScore:46,valueWeights:{familyClan:.3,freedom:.25,wealthResource:.25,honorLegacy:.1}},'returnKindness')];
  if(E.getSpiritStonesV140(n)>=12)opts.push(H.option(n,{id:'cash',baseScore:44,costStones:12,valueWeights:{honorLegacy:.45,wealthResource:-.4}},'returnKindness'));
  const ctx={rng:g.rng,temperature:H.temperature(n),decisionTag:'COURIER_REPAYMENT'},scored=E.scoreNpcDecisionOptions(g.world,n,opts,ctx),choice=E.chooseNpcDecisionOption(g.world,n,opts,{...ctx,preScoredDecision:scored});story.repayment=choice.chosenId;story.decisions.push({t:g.s.t,kind:'repayment',actorId:n.id,choice:choice.chosenId,scores:scored.options.map(o=>({id:o.id,score:o.score,valueAdj:o.contributions.valueAdj}))});H.learn(n,'returnKindness',1);
  if(choice.chosenId==='return'){story.phase='leavingForReturn';g.send(n,'leaveValley',EXIT,0);this.log('คำมั่นของผู้ส่งสาร',n.name+' ขอไปสะสางธุระ แล้วจะกลับมาพร้อมของตอบแทน โดยยังถือสัมภาระของตนอยู่',[n.id]);}
  else{this.deliverGift(choice.chosenId);story.phase='leaving';g.send(n,'leaveValley',EXIT,0);}
 }
 deliverGift(kind){const g=this.g,s=this.data,story=s.story,n=g.world.npcs[story.actorId];if(story.giftDelivered||!alive(n)||dist(n.stageLocal,MARKET)>140)return false;const helper=g.world.npcs[story.helperId],recipient=alive(helper)?helper:g.bank,transfers=[];let cash=0;
  if(kind==='cash'){cash=Math.min(12,E.getSpiritStonesV140(n));E.addSpiritStonesV140(n,-cash);E.addSpiritStonesV140(recipient,cash);}else for(const [id,want] of [[ORE,2],[CIN,1]]){const qty=Math.min(want,g.count(n,id));if(qty>0&&g.add(g.bank,id,qty,'COURIER_REPAYMENT').ok){g.consume(n,id,qty);transfers.push({material:id,quantity:qty});}}
  if(!cash&&!transfers.length)return false;story.giftDelivered=true;story.outcome=kind==='cash'?'repaidCash':kind==='return'?'returnedWithGift':'repaidGoods';s.pavilionRelation=clamp(s.pavilionRelation+6,-100,100);story.receipts.push({t:g.s.t,kind:'repayment',actorId:n.id,recipientId:kind==='cash'?recipient.id:g.bank.id,cash,transfers});if(alive(helper)){this.relate(n,helper,8,3);g.remember(helper,'aidCourier',10,n.name+' กลับมาตอบแทนบุญคุณจริง');}g.remember(n,'returnKindness',8,'ตอบแทนสำนักเมฆาครามด้วยทรัพย์ที่มีอยู่');this.log('บุญคุณได้รับคำตอบ',n.name+(cash?' มอบ '+cash+' ศิลาให้'+recipient.name:' นำแร่และชาดส่งเข้าคลังสำนัก')+' สิ่งของหักจากสัมภาระผู้ส่งสารเพียงครั้งเดียว',[n.id,recipient.id]);return true;
 }
 updateCourier(dt){const g=this.g,story=this.data.story,n=g.world.npcs[story?.actorId];if(!story||!n||['complete','departed','reported','dead'].includes(story.phase))return;if(!alive(n)){this.onDeath(n);return;}
  const p=n.stageLocal;if(story.phase==='away'){if(g.s.t<story.returnAt)return;p.offmap=null;n.currentCityId=g.city;p.x=EXIT.x;p.y=EXIT.y;story.phase='returning';g.send(n,'returnKindness',MARKET,0);this.log('ผู้ส่งสารกลับเข้าหุบเขา',n.name+' คนเดิมเดินกลับมาจากด่าน พร้อมสัมภาระที่ยังเหลือ',[n.id]);return;}
  H.tick(n,dt);const enemy=g.nearestEnemy(n,190);if(enemy&&n.health<45){const e=enemy.stageLocal||enemy,dx=p.x-e.x,dy=p.y-e.y,len=Math.hypot(dx,dy)||1;p.x=clamp(p.x+dx/len*H.travelSpeed(n,60)*dt,20,3980);p.y=clamp(p.y+dy/len*H.travelSpeed(n,60)*dt,20,2980);p.route=g.path(p,p.target||MARKET);return;}
  if(['arriving','returning','leaving','leavingForReturn','wronged','departingIgnored'].includes(story.phase)){g.move(n,dt);if(p.route.length)return;const destination=['arriving','returning'].includes(story.phase)?MARKET:EXIT;if(dist(p,destination)>6){p.route=g.path(p,destination);return;}
   if(story.phase==='arriving'){story.phase='waiting';story.arrivedAt=g.s.t;p.mode='waiting';p.goal='ขอความช่วยเหลือที่ตลาด';this.log('ข่าวจากตลาด',n.name+' รอผู้มีน้ำใจอยู่ที่ตลาด ศิษย์จะเลือกเองว่าจะช่วยหรือฉวยโอกาส',[n.id]);}
   else if(story.phase==='returning'){if(this.deliverGift('return')){story.phase='leaving';g.send(n,'leaveValley',EXIT,0);}else{p.mode='waiting';p.nextThink=g.s.t+5;}}
   else if(story.phase==='leavingForReturn'){story.phase='away';story.returnAt=g.s.t+40;p.offmap={until:story.returnAt,lifeJourney:true};p.mode='offmap';n.currentCityId=null;}
   else{story.phase=story.phase==='wronged'?'reported':story.phase==='departingIgnored'?'departed':'complete';story.completedAt=g.s.t;p.offmap={lifeJourney:true,until:null};p.mode='offmap';n.currentCityId=null;if(story.phase==='departed')this.log('เส้นทางที่ไม่ได้เลือก',n.name+' ออกจากหุบเขาไปหาความช่วยเหลือที่อื่น ไม่เกิดรางวัลหรือหนี้บุญคุณ',[n.id]);}
  }
  if(['waiting','grateful'].includes(story.phase)&&dist(p,MARKET)>6){if(!p.route.length)p.route=g.path(p,MARKET);g.move(n,dt);}if(story.phase==='grateful'&&g.s.t>=story.decideAt&&dist(p,MARKET)<140)this.chooseRepayment();
  if(story.phase==='waiting'&&g.s.t>=story.expiresAt){story.outcome='ignored';story.lockedBranches=['saved','theft'];story.phase='departingIgnored';g.send(n,'leaveValley',EXIT,0);}
 }
 onDeath(n){const story=this.data.story;if(!story||story.actorId!==n.id||story.phase==='dead')return false;story.phase='dead';story.outcome='died';story.completedAt=this.g.s.t;n.stageLocal.mode='dead';n.stageLocal.offmap=null;n.stageLocal.route=[];n.stageLocal.action=null;this.log('ข่าวเศร้าจากถนน',n.name+' เสียชีวิตจริง เส้นทางบุญคุณของเขาสิ้นสุดลง',[n.id]);for(const h of this.g.heroes.filter(alive))this.g.remember(h,'aidCourier',-6,'ผู้ส่งสาร '+n.name+' ไม่รอดจากภัยในหุบเขา');return true;}
 tick(dt){const g=this.g,s=this.data;if(g.s.t>=s.nextThink){s.nextThink=g.s.t+1;const invalid=Object.values(s.offices).some(o=>o&&(!alive(g.world.npcs[o.npcId])||(this.member(g.world.npcs[o.npcId])?.disgracedUntil||0)>g.s.t));if(g.s.t>=s.nextCouncilAt||invalid)this.convene(invalid?'ตำแหน่งว่างหรือถูกพักหน้าที่':'ครบวาระ');if(g.s.t>=s.nextAgendaAt)this.chooseAgenda();if(!s.story&&g.s.t>=s.storyAt)this.announceCourier();}this.updateCourier(dt);}
}
const api={SectLife,VERSION,ROLES,AGENDAS,TRADE_HOUSE,HOME_DOCTRINE,MARKET,EXIT};root.SectLifeSystem=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
