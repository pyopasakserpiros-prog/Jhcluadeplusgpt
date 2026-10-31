/* Living Academy 1.6 + v1.16 — consent-based mentorship, transactional book loans,
   balanced research prioritization, and archived failed research notes. */
(function(root){'use strict';
const H=root.HumanCore||(typeof require==='function'?require('./human'):null);
const P=root.LivingProgression||(typeof require==='function'?require('./progression'):null);
const E=root.World2026Engine||(typeof require==='function'?require('./legacy/src/engine'):null);
const alive=n=>!!n&&n.alive&&n.health>0;
const dist=(a,b)=>Math.hypot((a?.x||0)-(b?.x||0),(a?.y||0)-(b?.y||0));
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
const copy=x=>JSON.parse(JSON.stringify(x));
const HERB='MAT_HERB_DEW_GRASS_1',ORE='MAT_ORE_BLACK_IRON_1',CIN='MAT_ORE_CINNABAR_1',FANG='MAT_BP_WOLF_FANG_1',ORCHID='MAT_HERB_MIST_ORCHID_2';
const DESIGNS=[
 {id:'L16_REMEDY_BALANCED',name:'โอสถสมานแผลฉบับประณีต',parentRecipeId:'L14_remedy',workshop:'alchemy',tier:1,min:35,trialInputs:[{matId:HERB,count:2},{matId:CIN,count:1}],recipe:{id:'L16_REMEDY_BALANCED',name:'โอสถสมานแผลฉบับประณีต',workshop:'alchemy',tier:1,min:25,inputs:[{matId:HERB,count:2},{matId:CIN,count:1}],effect:{heal:28,pain:10,toxicity:1},duration:20}},
 {id:'L16_IRON_RIPPLE_BLADE',name:'กระบี่เหล็กดำคมคลื่น',parentRecipeId:'L14_ironblade',workshop:'forge',tier:1,min:35,trialInputs:[{matId:ORE,count:3},{matId:FANG,count:1}],recipe:{id:'L16_IRON_RIPPLE_BLADE',name:'กระบี่เหล็กดำคมคลื่น',workshop:'forge',tier:1,min:25,inputs:[{matId:ORE,count:3},{matId:FANG,count:1}],effect:{slot:'WEAPON',combat:.10,defense:.025},duration:24}},
 {id:'L1110_FOXFIRE_REMEDY',name:'โอสถเพลิงจิ้งจอกฉบับประณีต',parentRecipeId:'L14_remedy',workshop:'alchemy',tier:2,min:38,trialInputs:[{matId:'MAT_HERB_CLOUD_PEONY_2',count:1},{matId:'MAT_BP_FOXFIRE_GALL_2',count:1},{matId:HERB,count:1}],recipe:{id:'L1110_FOXFIRE_REMEDY',name:'โอสถเพลิงจิ้งจอกฉบับประณีต',workshop:'alchemy',tier:2,min:32,inputs:[{matId:'MAT_HERB_CLOUD_PEONY_2',count:1},{matId:'MAT_BP_FOXFIRE_GALL_2',count:1},{matId:HERB,count:1}],effect:{heal:30,pain:12,toxicity:2},duration:28}},
 {id:'L1110_CLOUD_ANTLER_BLADE',name:'ทวนเขากวางเมฆาฉบับสำนัก',parentRecipeId:'L14_ironblade',workshop:'forge',tier:2,min:38,trialInputs:[{matId:'MAT_ORE_SPIRIT_COPPER_2',count:1},{matId:'MAT_BP_CLOUD_ANTLER_2',count:1},{matId:ORE,count:1}],recipe:{id:'L1110_CLOUD_ANTLER_BLADE',name:'ทวนเขากวางเมฆาฉบับสำนัก',workshop:'forge',tier:2,min:32,inputs:[{matId:'MAT_ORE_SPIRIT_COPPER_2',count:1},{matId:'MAT_BP_CLOUD_ANTLER_2',count:1},{matId:ORE,count:1}],effect:{slot:'WEAPON',combat:.12,defense:.02},duration:30}},
 {id:'L1110_CRYSTAL_SHELL_ARMOR',name:'เกราะกระดองผลึกฉบับช่างหลวง',parentRecipeId:'L14_ironblade',workshop:'forge',tier:3,min:48,trialInputs:[{matId:'MAT_ORE_CLOUD_JADE_3',count:1},{matId:'MAT_BP_JADE_TURTLE_SHELL_3',count:1},{matId:'MAT_BP_CRYSTAL_HIDE_3',count:1}],recipe:{id:'L1110_CRYSTAL_SHELL_ARMOR',name:'เกราะกระดองผลึกฉบับช่างหลวง',workshop:'forge',tier:3,min:42,inputs:[{matId:'MAT_ORE_CLOUD_JADE_3',count:1},{matId:'MAT_BP_JADE_TURTLE_SHELL_3',count:1},{matId:'MAT_BP_CRYSTAL_HIDE_3',count:1}],effect:{slot:'ARMOR',combat:.035,defense:.15},duration:36}},
 {id:'L1110_FROST_MOON_PILL',name:'โอสถจันทราเหมันต์สลายพิษ',parentRecipeId:'L14_remedy',workshop:'alchemy',tier:4,min:62,trialInputs:[{matId:'MAT_HERB_FROST_MOON_BERRY_3',count:1},{matId:'MAT_BP_FROST_HEART_4',count:1},{matId:ORCHID,count:1}],recipe:{id:'L1110_FROST_MOON_PILL',name:'โอสถจันทราเหมันต์สลายพิษ',workshop:'alchemy',tier:4,min:58,inputs:[{matId:'MAT_HERB_FROST_MOON_BERRY_3',count:1},{matId:'MAT_BP_FROST_HEART_4',count:1},{matId:ORCHID,count:1}],effect:{heal:26,pain:18,cleanse:30,toxicity:3},duration:42}},
 {id:'L1130_SOUL_MIRROR_INCENSE',name:'โอสถกำยานกระจกใจเซน',parentRecipeId:'L14_clarity',workshop:'alchemy',tier:2,min:40,trialInputs:[{matId:'MAT_HERB_MIST_ORCHID_2',count:1},{matId:'MAT_HERB_CLOUD_PEONY_2',count:1},{matId:HERB,count:1}],recipe:{id:'L1130_SOUL_MIRROR_INCENSE',name:'โอสถกำยานกระจกใจเซน',workshop:'alchemy',tier:2,min:35,inputs:[{matId:'MAT_HERB_MIST_ORCHID_2',count:1},{matId:'MAT_HERB_CLOUD_PEONY_2',count:1},{matId:HERB,count:1}],effect:{grief:22,cleanse:16,progress:7,toxicity:1},duration:26}},
 {id:'L1130_ABYSS_BLOOD_ELIXIR',name:'โอสถโลหิตอสูรกลืนปราณ',parentRecipeId:'L14_ginseng',workshop:'alchemy',tier:3,min:50,trialInputs:[{matId:'MAT_HERB_BLOOD_GINSENG_3',count:1},{matId:FANG,count:2},{matId:CIN,count:1}],recipe:{id:'L1130_ABYSS_BLOOD_ELIXIR',name:'โอสถโลหิตอสูรกลืนปราณ',workshop:'alchemy',tier:3,min:45,inputs:[{matId:'MAT_HERB_BLOOD_GINSENG_3',count:1},{matId:FANG,count:2},{matId:CIN,count:1}],effect:{heal:42,progress:11,toxicity:4},duration:34}},
 {id:'L1130_MIND_SWORD_BRUSH',name:'พู่กันหยกเมฆากระบี่จิต',parentRecipeId:'L14_scholar',workshop:'forge',tier:3,min:48,trialInputs:[{matId:'MAT_ORE_CLOUD_JADE_3',count:1},{matId:'MAT_ORE_SPIRIT_COPPER_2',count:1},{matId:CIN,count:1}],recipe:{id:'L1130_MIND_SWORD_BRUSH',name:'พู่กันหยกเมฆากระบี่จิต',workshop:'forge',tier:3,min:42,inputs:[{matId:'MAT_ORE_CLOUD_JADE_3',count:1},{matId:'MAT_ORE_SPIRIT_COPPER_2',count:1},{matId:CIN,count:1}],effect:{slot:'WEAPON',combat:.14,defense:.04,study:.10},duration:32}},
 {id:'L1130_NETHER_SILK_ROBE',name:'อาภรณ์ไหมทมิฬเร้นเงา',parentRecipeId:'L14_jade',workshop:'forge',tier:3,min:48,trialInputs:[{matId:'MAT_HERB_SUNSET_ORCHID_4',count:1},{matId:ORE,count:2},{matId:ORCHID,count:1}],recipe:{id:'L1130_NETHER_SILK_ROBE',name:'อาภรณ์ไหมทมิฬเร้นเงา',workshop:'forge',tier:3,min:42,inputs:[{matId:'MAT_HERB_SUNSET_ORCHID_4',count:1},{matId:ORE,count:2},{matId:ORCHID,count:1}],effect:{slot:'ARMOR',combat:.06,defense:.16},duration:34}}
];
H.registerActivity({...H.descriptor('discussDao'),id:'learnFromMentor',label:'เรียนจากอาจารย์',skillDomain:'scriptureReading',interestWeights:{practice:.5,analysis:.25,companionship:.25},valueWeights:{knowledgeCraft:.3,honorLegacy:.2,sectDuty:.15},personalityWeights:{curiosity:.25,discipline:.2,trustfulness:.15}});
H.registerActivity({...H.descriptor('train'),id:'teachLesson',label:'ถ่ายทอดวิชา',skillDomain:'teaching',interestWeights:{practice:.35,leadership:.25,care:.2,expression:.2},valueWeights:{honorLegacy:.3,sectDuty:.25,familyClan:.1},personalityWeights:{empathy:.3,integrity:.2,discipline:.2}});
H.registerActivity({...H.descriptor('alchemy'),id:'researchFormula',label:'ค้นคว้าตำรับ',skillDomain:'formulaResearch',interestWeights:{analysis:.35,creation:.3,practice:.2,exploration:.15},valueWeights:{knowledgeCraft:.4,wealthResource:.1},personalityWeights:{creativity:.3,rationality:.25,discipline:.2}});
H.registerActivity({...H.descriptor('discussDao'),id:'shareFormula',label:'ถ่ายทอดตำรับ',skillDomain:'formulaTeaching',interestWeights:{expression:.25,care:.25,analysis:.25,companionship:.25},valueWeights:{honorLegacy:.3,sectDuty:.25,knowledgeCraft:.2},personalityWeights:{integrity:.25,empathy:.25,loyalty:.2}});

class LivingAcademy{
 constructor(g){this.g=g;const s=g.s.growth;if(!s||s.schemaVersion!==2)throw Error('ข้อมูลสำนักศึกษาต้องเป็นแพตช์ 1.6');if(!Array.isArray(s.researchProjects)||!Array.isArray(s.formulaRegistry)||!Array.isArray(s.bookLoans))throw Error('ทะเบียนสำนักศึกษาไม่ถูกต้อง');if(!Array.isArray(s.archivedResearchNotes))s.archivedResearchNotes=[];/* v2.08.3: migrate formula records created by older research paths before a sharing ticket can finish. */for(const f of s.formulaRegistry)this.normalizeFormulaRecord(f);}
 get designs(){return [...DESIGNS,...(root.JianghuMyriadWorldsData?.experimentDesigns||[])];}
 normalizeFormulaRecord(f){if(!f||typeof f!=='object')return null;if(!Array.isArray(f.knownBy))f.knownBy=f.ownerNpcId?[f.ownerNpcId]:[];else if(f.ownerNpcId&&!f.knownBy.includes(f.ownerNpcId))f.knownBy.unshift(f.ownerNpcId);if(!Array.isArray(f.licenses))f.licenses=[];if(!Array.isArray(f.history))f.history=[];if(!Number.isFinite(f.revision))f.revision=1;return f;}
 heroes(){return this.g.heroes.filter(n=>alive(n)&&n.stageLocal?.growth&&!n.stageLocal.offmap&&!n.stageLocal.journey);}
 relationship(a,b){return E.getRelationshipV130(this.g.world,a,b,false)||{affinity:0,bond:0};}
 knownArt(n,id){return n.jianghu.knowledgeV190?.[id];}
 hasScroll(n,id){return n.jianghu.ledgerV140.scrolls.some(s=>s.artId===id&&s.count!==0);}
 teacherIdle(n){const s=n?.stageLocal;return alive(n)&&!!s&&!s.offmap&&!s.journey&&s.mode==='idle'&&!s.action&&!s.target&&!s.academyReservation;}
 reserved(n){return !!n?.stageLocal?.academyReservation&&n.stageLocal.academyReservation.until>this.g.s.t;}
 reservationUntil(n){return n?.stageLocal?.academyReservation?.until||this.g.s.t+1;}
 formula(id){return this.normalizeFormulaRecord(this.g.s.growth.formulaRegistry.find(f=>f.id===id)||null);}
 project(id){return this.g.s.growth.researchProjects.find(p=>p.id===id)||null;}
 activeProjectForNpc(n){return this.g.s.growth.researchProjects.find(p=>p.npcId===n.id&&p.status==='ACTIVE')||null;}
 activeProjectForFormula(id){return this.g.s.growth.researchProjects.find(p=>p.formulaId===id&&p.status==='ACTIVE')||null;}
 priorFailedInsightBonus(n,formulaId){
  const localNotes=n.stageLocal?.growth?.archivedResearchNotes||[];
  const sectNotes=this.g.s.growth.archivedResearchNotes||[];
  const hasPrior=localNotes.some(x=>x.formulaId===formulaId)||sectNotes.some(x=>x.formulaId===formulaId);
  return hasPrior?10:0;
 }
 pay(n,amount){const fund=this.g.s.growth;if(E.getSpiritStonesV140(n)>=amount){E.addSpiritStonesV140(n,-amount);return {ok:true,source:'PERSONAL',amount};}if(fund.researchFund>=amount){fund.researchFund-=amount;return {ok:true,source:'SECT_FUND',amount};}return {ok:false,reason:'ทุนไม่พอ'};}
 canPay(n,amount){return E.getSpiritStonesV140(n)>=amount||this.g.s.growth.researchFund>=amount;}
 hasInputs(owner,inputs){return inputs.every(i=>this.g.count(owner,i.matId)>=i.count);}
 hasResearchExperience(n){return !!n.stageLocal.growth.hasResearchExperience||this.g.s.growth.receipts.some(r=>r.npcId===n.id&&['recipe','production'].includes(r.kind));}
 consumeInputs(owner,inputs,source){for(const i of inputs)if(!this.g.consume(owner,i.matId,i.count))return false;this.g.progression.receipt('researchMaterial',owner,{source,inputs:copy(inputs)});return true;}
 workshopFor(design){return this.g.built(design.workshop==='alchemy'?'alchemy':'forge');}
 endpoint(design){const b=this.workshopFor(design);return b?this.g.endpoint(b):null;}
 availableDesigns(n){const q=n.stageLocal.growth;return this.designs.filter(d=>q.knownRecipes.includes(d.parentRecipeId)&&!this.formula(d.id)&&!this.activeProjectForFormula(d.id)&&!!this.workshopFor(d)&&this.g.progression.tier(n)>=d.tier&&H.capacity(n,d.workshop==='alchemy'?'alchemy':'forging').total>=d.min&&this.hasInputs(this.g.bank,d.trialInputs)&&this.canPay(n,6)&&n.jianghu.ledgerV140.scrolls.length<24&&this.hasResearchExperience(n));}
 artCandidates(student){const out=[],p=this.g.progression;for(const teacher of this.heroes()){if(teacher.id===student.id||!this.teacherIdle(teacher))continue;const rejectUntil=student.stageLocal?.growth?.mentorCooldowns?.[teacher.id]||0;if(rejectUntil>this.g.s.t)continue;for(const [artId,k] of Object.entries(teacher.jianghu.knowledgeV190||{})){const art=p.artMap.get(artId);if(!art||k.stage<4||k.mastery<20||!p.compatible(student,art)||(art.requiredNormalizedTier||art.tier||1)>p.tier(student))continue;const sk=student.jianghu.knowledgeV190?.[artId];if(sk?.stage>=4)continue;if(this.g.discovery&&(!this.g.discovery.canStudy(student,art)||!this.g.discovery.mayCopy(teacher,artId)))continue;const rel=this.relationship(student,teacher);const suit=p.scoreArtSuitability?p.scoreArtSuitability(student,art):{score:0,reasonsTh:[]};const score=H.liking(student,'learnFromMentor')*.35+k.mastery*.22+(rel.bond||0)*.18+(rel.affinity||0)*.08+Math.max(0,suit.score)*.32-dist(student.stageLocal,teacher.stageLocal)*.012;out.push({teacher,art,artId,score,suitability:suit,distance:dist(student.stageLocal,teacher.stageLocal)});}}return out.sort((a,b)=>b.score-a.score).slice(0,3);}
 consentChance(teacher,student,kind='lesson'){const rel=this.relationship(teacher,student),p=teacher.personality||{},fatigue=teacher.core?.condition?.fatigue||0,hunger=teacher.stageLocal?.needs?.hunger||0;let score=24+H.liking(teacher,kind==='formula'?'shareFormula':'teachLesson')*.32+(p.empathy??50)*.10+(p.loyalty??50)*.08+(p.integrity??50)*.06+(rel.bond||0)*.20+Math.max(-30,rel.affinity||0)*.08-fatigue*.12-hunger*.06-(p.caution??50)*.04;if(kind==='formula')score+=H.liking(student,'researchFormula')*.08;return clamp(score,5,95);}
 accept(teacher,student,kind){return this.g.rng.next()*100<this.consentChance(teacher,student,kind);}
 options(n,add,existing=[]){const g=this.g,s=n.stageLocal,q=s.growth;if(!q||s.offmap||s.journey||s.mode==='dead'||s.mode==='combat'||this.reserved(n))return;
  const activeCraftStep=existing.some(o=>['makePersonalItem','researchRecipe'].includes(o.id));
  const candidates=this.artCandidates(n);for(const c of candidates){const near=c.distance<=170,at={id:'mentor-'+c.teacher.id,x:c.teacher.stageLocal.x,y:c.teacher.stageLocal.y};if(near)add('learnFromMentor',45+c.score*.25,at,18,{curiosity:.25,discipline:.2,trustfulness:.15},{academyMentorId:c.teacher.id,academyArtId:c.artId,growthActivity:'learnFromMentor',handler:'MENTOR_LESSON',reason:'อาจารย์รู้วิชานี้จริง · ชำนาญ '+Math.round(c.teacher.jianghu.knowledgeV190[c.artId].mastery)+' · ต้องได้รับความยินยอม'});else add('seekMentor',35+c.score*.2,at,1,{curiosity:.3,trustfulness:.1},{academyMentorId:c.teacher.id,academyArtId:c.artId,growthActivity:'learnFromMentor',handler:'MENTOR_SEEK',reason:'เดินไปพบผู้รู้วิชาเดียวกัน · ระยะ '+Math.round(c.distance)+' ม.'});}
  const active=this.activeProjectForNpc(n);
  if(active){
   const d=this.designs.find(x=>x.id===active.formulaId),at=d&&this.endpoint(d);
   if(d&&at&&this.hasInputs(g.bank,d.trialInputs)&&this.canPay(n,4)){
    const researchBonus=(g.s.policy==='craft'?14:0)+(g.s.growth.researchFund>=4?8:0);
    add('continueResearch',44+active.progress*.08+H.liking(n,'researchFormula')*.08+researchBonus,at,18,{creativity:.3,rationality:.25,discipline:.2},{academyTargetId:d.id,growthActivity:'researchFormula',handler:'RESEARCH_CONTINUE',reason:'ทดลองครั้งที่ '+(active.trials+1)+' · ความคืบหน้า '+active.progress+'%'});
   }
  }else if(!activeCraftStep){
   for(const d of this.availableDesigns(n)){
    const at=this.endpoint(d);if(!at)continue;
    const cap=H.capacity(n,d.workshop==='alchemy'?'alchemy':'forging').total;
    const researchBonus=(g.s.policy==='craft'?14:0)+(g.s.growth.researchFund>=6?6:0)+(this.priorFailedInsightBonus(n,d.id)?4:0);
    add('startResearch',34+H.liking(n,'researchFormula')*.14+cap*.08+researchBonus,at,12,{creativity:.35,rationality:.25,discipline:.2,curiosity:.2},{academyTargetId:d.id,growthActivity:'researchFormula',handler:'RESEARCH_START',reason:'มีตำรับตั้งต้น วัตถุดิบทดลอง และทุน · ความสำเร็จยังไม่แน่นอน'});
   }
  }
  for(const f of g.s.growth.formulaRegistry){if(f.ownerNpcId!==n.id||!q.knownRecipes.includes(f.id))continue;for(const other of this.heroes()){if(other.id===n.id)continue;const rejectUntil=q.shareCooldowns?.[other.id+':'+f.id]||0;if(rejectUntil>g.s.t)continue;if(other.stageLocal.growth.knownRecipes.includes(f.id)||other.stageLocal.mode!=='idle'||other.stageLocal.action||other.stageLocal.target||other.stageLocal.academyReservation)continue;const d=dist(s,other.stageLocal),at={id:'formula-recipient-'+other.id,x:other.stageLocal.x,y:other.stageLocal.y};if(d<=170)add('shareFormula',24+H.liking(n,'shareFormula')*.22+(n.personality.integrity||50)*.08,at,12,{empathy:.2,integrity:.25,loyalty:.2},{academyTargetId:f.id,academyPartnerId:other.id,growthActivity:'shareFormula',handler:'FORMULA_SHARE',reason:'ถ่ายทอดตำรับโดยสมัครใจ · ผู้รับต้องยินยอม'});else add('approachFormulaRecipient',18+H.liking(n,'shareFormula')*.18,at,1,{curiosity:.15,empathy:.2},{academyTargetId:f.id,academyPartnerId:other.id,growthActivity:'shareFormula',handler:'FORMULA_APPROACH',reason:'เดินไปพบสมาชิกเพื่อพิจารณาถ่ายทอดตำรับ'});}}
 }
 engageLessonIfNear(n,ticket){
  if(!ticket||ticket.engaged||ticket.action!=='learnFromMentor')return;
  const s=n.stageLocal,teacher=this.g.world.npcs[ticket.teacherId],artId=ticket.artId,art=this.g.progression.artMap.get(artId);
  if(!teacher||!alive(teacher)||teacher.stageLocal?.offmap||teacher.stageLocal?.journey||teacher.stageLocal?.mode==='combat'||!art)return;
  if(dist(s,teacher.stageLocal)>185)return;
  if(teacher.stageLocal.academyReservation&&teacher.stageLocal.academyReservation.studentId!==n.id&&teacher.stageLocal.academyReservation.until>this.g.s.t)return;
  ticket.engaged=true;
  if((this.knownArt(teacher,artId)?.stage||0)<4||(this.knownArt(teacher,artId)?.mastery||0)<20||!this.g.progression.compatible(n,art)||(this.knownArt(n,artId)?.stage||0)>=4)return;
  if(!this.accept(teacher,n,'lesson')){
   ticket.declined=true;
   s.growth.mentorCooldowns=s.growth.mentorCooldowns||{};
   s.growth.mentorCooldowns[teacher.id]=this.g.s.t+45;
   if(s.mode==='working'&&s.job>1)s.job=0;
   return;
  }
  const studentHas=this.hasScroll(n,artId);
  const book=studentHas?null:teacher.jianghu.ledgerV140.scrolls.find(x=>x.artId===artId&&x.count!==0&&!x.loan&&x.rights!=='LOAN');
  if(!studentHas&&!book&&(this.knownArt(teacher,artId)?.stage||0)<4)return;
  const sessionId='lesson-'+this.g.s.growth.nextId++;
  if(book&&n.jianghu.ledgerV140.scrolls.length<24){
   const idx=teacher.jianghu.ledgerV140.scrolls.indexOf(book);
   teacher.jianghu.ledgerV140.scrolls.splice(idx,1);
   book.loan={ownerNpcId:teacher.id,borrowerNpcId:n.id,sessionId,dueAt:this.g.s.t+80};
   book.rights='LOAN';
   book.ownerNpcId=teacher.id;
   n.jianghu.ledgerV140.scrolls.push(book);
   ticket.loanId=book.id;
   this.g.s.growth.bookLoans.push({bookId:book.id,ownerNpcId:teacher.id,borrowerNpcId:n.id,sessionId,status:'ACTIVE',startedAt:this.g.s.t,dueAt:this.g.s.t+80});
  }
  ticket.accepted=true;
  ticket.sessionId=sessionId;
  teacher.stageLocal.academyReservation={studentId:n.id,artId,kind:'lesson',sessionId,until:this.g.s.t+75};
 }
 engageShareIfNear(n,ticket){
  if(!ticket||ticket.engaged||ticket.action!=='shareFormula')return;
  const s=n.stageLocal,f=this.formula(ticket.formulaId),other=this.g.world.npcs[ticket.partnerId];
  if(!f||f.ownerNpcId!==n.id||!other||!alive(other)||other.stageLocal?.offmap||other.stageLocal?.journey||other.stageLocal?.mode==='combat')return;
  if(dist(s,other.stageLocal)>185)return;
  if(other.stageLocal.academyReservation&&other.stageLocal.academyReservation.studentId!==n.id&&other.stageLocal.academyReservation.until>this.g.s.t)return;
  ticket.engaged=true;
  if(other.stageLocal.growth.knownRecipes.includes(f.id))return;
  if(!this.accept(other,n,'formula')){
   ticket.declined=true;
   s.growth.shareCooldowns=s.growth.shareCooldowns||{};
   s.growth.shareCooldowns[other.id+':'+f.id]=this.g.s.t+45;
   if(s.mode==='working'&&s.job>1)s.job=0;
   return;
  }
  const sessionId='share-'+this.g.s.growth.nextId++;
  ticket.accepted=true;
  ticket.sessionId=sessionId;
  other.stageLocal.academyReservation={studentId:n.id,formulaId:f.id,kind:'formula',sessionId,until:this.g.s.t+55};
 }
 start(n,action){const s=n.stageLocal;
  if(action==='learnFromMentor'){
   const teacher=this.g.world.npcs[s.academyMentorId],artId=s.academyArtId;
   const ticket={action,accepted:false,engaged:false,declined:false,studentId:n.id,teacherId:teacher?.id||null,artId,startedAt:this.g.s.t,loanId:null,sessionId:null};
   s.academyTicket=ticket;
   this.engageLessonIfNear(n,ticket);
   return;
  }
  if(action==='shareFormula'){
   const f=this.formula(s.academyTargetId),other=this.g.world.npcs[s.academyPartnerId];
   const ticket={action,accepted:false,engaged:false,declined:false,studentId:n.id,formulaId:f?.id||null,partnerId:other?.id||null,startedAt:this.g.s.t,sessionId:null};
   s.academyTicket=ticket;
   this.engageShareIfNear(n,ticket);
   return;
  }
  if(['startResearch','continueResearch','seekMentor','approachFormulaRecipient'].includes(action)){
   s.academyTicket={action,studentId:n.id,targetId:s.academyTargetId,teacherId:s.academyMentorId||null,partnerId:s.academyPartnerId||null,startedAt:this.g.s.t};
   return;
  }
 }
 cancelTicket(n){
  const s=n?.stageLocal,ticket=s?.academyTicket;
  if(!ticket)return;
  if(ticket.loanId){
   const loan=this.g.s.growth.bookLoans.find(x=>x.bookId===ticket.loanId&&x.sessionId===ticket.sessionId&&['ACTIVE','PENDING_RETURN'].includes(x.status));
   if(loan)this.returnLoan(loan);
  }
  this.clearReservation(ticket);
  s.academyTicket=null;
 }
 clearReservation(ticket){if(!ticket?.teacherId&&!ticket?.partnerId)return;const id=ticket.teacherId||ticket.partnerId,other=this.g.world.npcs[id],r=other?.stageLocal?.academyReservation;if(r&&(r.studentId===ticket.studentId||r.sessionId===ticket.sessionId))delete other.stageLocal.academyReservation;}
 returnLoan(loan){
  if(!loan||!['ACTIVE','PENDING_RETURN'].includes(loan.status))return false;
  const borrower=this.g.world.npcs[loan.borrowerNpcId],owner=this.g.world.npcs[loan.ownerNpcId];
  const src=borrower?.jianghu?.ledgerV140?.scrolls||[];
  const idx=src.findIndex(x=>x.id===loan.bookId&&(!x.loan?.sessionId||x.loan.sessionId===loan.sessionId));
  if(idx<0){
   const alreadyWithOwner=owner?.jianghu?.ledgerV140?.scrolls?.some(x=>x.id===loan.bookId);
   if(alreadyWithOwner){
    loan.status='RETURNED';
    loan.returnedAt=this.g.s.t;
    return true;
   }
   loan.status='LOST_OR_MISSING';
   loan.returnedAt=this.g.s.t;
   return false;
  }
  const book=src[idx];
  // Case 1: Owner is alive and has scroll space -> return directly to owner
  if(owner&&alive(owner)&&owner.jianghu?.ledgerV140?.scrolls&&owner.jianghu.ledgerV140.scrolls.length<24){
   src.splice(idx,1);
   delete book.loan;
   book.rights='OWNER';
   book.ownerNpcId=owner.id;
   owner.jianghu.ledgerV140.scrolls.push(book);
   loan.status='RETURNED';
   loan.returnedAt=this.g.s.t;
   return true;
  }
  // Case 2: Owner is dead -> archive into sect library or sect storage so the book is not permanently orphaned
  if(!owner||!alive(owner)){
   const lib=this.g.s.growth.scriptureLibrary||(this.g.s.growth.scriptureLibrary=[]);
   const bankScrolls=this.g.bank?.jianghu?.ledgerV140?.scrolls;
   if(lib.length<120){
    src.splice(idx,1);
    delete book.loan;
    book.rights='SECT_LIBRARY';
    book.access='SECT';
    book.ownerNpcId=null;
    book.originalOwnerNpcId=loan.ownerNpcId;
    lib.push(book);
    loan.status='RETURNED_TO_ARCHIVE';
    loan.returnedAt=this.g.s.t;
    return true;
   }
   if(bankScrolls&&bankScrolls.length<120){
    src.splice(idx,1);
    delete book.loan;
    book.rights='OWNER';
    book.ownerNpcId=this.g.bank.id;
    bankScrolls.push(book);
    loan.status='RETURNED_TO_STORAGE';
    loan.returnedAt=this.g.s.t;
    return true;
   }
  }
  // Case 3: Owner is alive but their 24-scroll bag is currently full -> keep loan intact and retry later!
  book.rights='LOAN';
  book.ownerNpcId=owner?.id||loan.ownerNpcId;
  book.loan=book.loan||{ownerNpcId:loan.ownerNpcId,borrowerNpcId:loan.borrowerNpcId,sessionId:loan.sessionId};
  book.loan.dueAt=this.g.s.t+20;
  loan.status='PENDING_RETURN';
  loan.dueAt=this.g.s.t+20;
  return false;
 }
 beforeHero(n){
  const s=n?.stageLocal,ticket=s?.academyTicket;
  if(!s||!ticket)return;
  if(['learnFromMentor','seekMentor'].includes(s.action)){
   const teacher=this.g.world.npcs[ticket.teacherId||s.academyMentorId];
   if(!alive(teacher)||teacher.stageLocal?.offmap||teacher.stageLocal?.journey){
    this.cancelTicket(n);
    return;
   }
   if(s.mode==='travel'&&this.g.s.t>=(s.repathAcademyAt||0)){
    s.repathAcademyAt=this.g.s.t+2;
    s.target={id:'mentor-'+teacher.id,x:teacher.stageLocal.x,y:teacher.stageLocal.y};
    s.route=this.g.path(s,s.target);
   }
   if(s.action==='learnFromMentor')this.engageLessonIfNear(n,ticket);
  }
  if(['shareFormula','approachFormulaRecipient'].includes(s.action)){
   const other=this.g.world.npcs[ticket.partnerId||s.academyPartnerId];
   if(!alive(other)||other.stageLocal?.offmap||other.stageLocal?.journey){
    this.cancelTicket(n);
    return;
   }
   if(s.mode==='travel'&&this.g.s.t>=(s.repathAcademyAt||0)){
    s.repathAcademyAt=this.g.s.t+2;
    s.target={id:'formula-recipient-'+other.id,x:other.stageLocal.x,y:other.stageLocal.y};
    s.route=this.g.path(s,s.target);
   }
   if(s.action==='shareFormula')this.engageShareIfNear(n,ticket);
  }
 }
 finish(n,action){if(!['learnFromMentor','seekMentor','startResearch','continueResearch','shareFormula','approachFormulaRecipient'].includes(action))return null;const g=this.g,s=n.stageLocal,ticket=s.academyTicket||{},fail={handled:true,success:false,cooldown:10};
  if(action==='seekMentor'||action==='approachFormulaRecipient'){s.academyTicket=null;return {handled:true,success:true,cooldown:1};}
  if(action==='learnFromMentor'){
   this.engageLessonIfNear(n,ticket);
   const teacher=g.world.npcs[ticket.teacherId],art=g.progression.artMap.get(ticket.artId),valid=ticket.accepted&&alive(teacher)&&alive(n)&&teacher.stageLocal?.academyReservation?.sessionId===ticket.sessionId&&dist(s,teacher.stageLocal)<=190&&g.progression.compatible(n,art)&&(this.knownArt(n,ticket.artId)?.stage||0)<4;let success=false;if(valid){let k=n.jianghu.knowledgeV190[ticket.artId];if(!k)k=n.jianghu.knowledgeV190[ticket.artId]={artId:ticket.artId,stage:1,mastery:0,reading:0,source:'MENTOR_LESSON',mentorId:teacher.id};const teacherMastery=this.knownArt(teacher,ticket.artId)?.mastery||20;const gain=clamp(24*H.learningRate(n,'learnFromMentor')*(.75+teacherMastery/100),12,42);k.reading=Math.min(100,(k.reading||0)+gain);k.source='MENTOR_LESSON';k.mentorId=teacher.id;if(k.reading>=100){k.stage=4;k.mastery=Math.max(8,k.mastery||0);k.redistribute=false;g.discovery?.onLearned(n,art);n.jianghu.artMasteryV150[ticket.artId]=k.mastery;n.jianghu.knownArtIdsV150=[...new Set([...(n.jianghu.knownArtIdsV150||[]),ticket.artId])];const slot=g.progression.slot(art),current=g.progression.artMap.get(n.jianghu[slot+'Id']),oldK=n.jianghu.knowledgeV190[current?.id];if(!current||(k.mastery*(art.tier||1)+(art.subPath===n.jianghu.subPath?15:0))>((oldK?.mastery||0)*(current.tier||1)+(current?.subPath===n.jianghu.subPath?15:0))){n.jianghu[slot+'Id']=ticket.artId;n.jianghu[slot+'NameTh']=art.nameTh;}}H.learn(teacher,'teachLesson',1);s.nextLoadoutAt=0;g.combatSystem?.reconcileLoadout(n,{force:true});E.invalidateNpcCoreCache(n);E.invalidateNpcCoreCache(teacher);g.progression.receipt('mentorLesson',n,{mentorId:teacher.id,artId:ticket.artId,reading:k.reading,gain,accepted:true,bookLoanId:ticket.loanId||null});g.note(teacher.name+' ถ่ายทอด '+art.nameTh+' ให้ '+n.name+' · เข้าใจ '+Math.round(k.reading)+'%',n);success=true;}else if(ticket.accepted){g.progression.receipt('mentorLesson',n,{mentorId:ticket.teacherId,artId:ticket.artId,accepted:false,reason:'ระยะห่างหรือสถานะผู้สอนเปลี่ยน'});}else{g.progression.receipt('mentorLesson',n,{mentorId:ticket.teacherId,artId:ticket.artId,accepted:false,reason:'ผู้สอนไม่ยินยอม'});if(teacher)H.remember(n,'learnFromMentor',-2,'ผู้รู้ปฏิเสธการถ่ายทอดวิชา');}
   if(ticket.loanId){const loan=g.s.growth.bookLoans.find(x=>x.bookId===ticket.loanId&&x.sessionId===ticket.sessionId);if(loan)this.returnLoan(loan);}if(teacher?.stageLocal?.academyReservation?.sessionId===ticket.sessionId)delete teacher.stageLocal.academyReservation;s.academyTicket=null;return {handled:true,success,cooldown:success?8:12};}
  if(action==='startResearch'){const d=this.designs.find(x=>x.id===ticket.targetId),q=s.growth,at=d&&this.endpoint(d),activity=d?.workshop==='alchemy'?'alchemy':'forging';if(!d||!at||dist(s,at)>145||!q.knownRecipes.includes(d.parentRecipeId)||this.formula(d.id)||this.activeProjectForFormula(d.id)||!this.hasInputs(g.bank,d.trialInputs)||!this.canPay(n,6)||n.jianghu.ledgerV140.scrolls.length>=24||!this.hasResearchExperience(n)||g.progression.tier(n)<d.tier||H.capacity(n,activity).total<d.min)return fail;const paid=this.pay(n,6);if(!paid.ok)return fail;const priorBonus=this.priorFailedInsightBonus(n,d.id);const project={id:'research-'+g.s.growth.nextId++,formulaId:d.id,npcId:n.id,parentRecipeId:d.parentRecipeId,status:'ACTIVE',progress:priorBonus,trials:0,successes:0,failures:0,insight:priorBonus,createdAt:g.s.t,updatedAt:g.s.t,paid:[paid],history:[],notebookId:null};const notebook={id:'research-notes-'+project.id,kind:'RESEARCH_NOTES',researchProjectId:project.id,formulaId:d.id,nameTh:'สมุดบันทึกการทดลอง: '+d.name,count:1,ownerNpcId:n.id,rights:'OWNER',sourceType:'RESEARCH_NOTES',originLabelTh:'เริ่มโครงการค้นคว้า '+project.id};project.notebookId=notebook.id;n.jianghu.ledgerV140.scrolls.push(notebook);g.s.growth.researchProjects.push(project);g.progression.receipt('researchStart',n,{projectId:project.id,formulaId:d.id,paid,priorBonus});g.note(n.name+' เริ่มโครงการค้นคว้า '+d.name+(priorBonus?' (ต่อยอดจากบันทึกการทดลองเดิม +'+priorBonus+'%)':'')+' · ยังไม่มีผลสำเร็จรับประกัน',n);s.academyTicket=null;return {handled:true,success:true,cooldown:4};}
  if(action==='continueResearch'){const d=this.designs.find(x=>x.id===ticket.targetId),project=d&&this.activeProjectForNpc(n),at=d&&this.endpoint(d),activity=d?.workshop==='alchemy'?'alchemy':'forging';if(!d||!project||project.formulaId!==d.id||!at||dist(s,at)>145||!this.hasInputs(g.bank,d.trialInputs)||!this.canPay(n,4))return fail;if(!this.consumeInputs(g.bank,d.trialInputs,'RESEARCH_TRIAL_'+project.id))return fail;const paid=this.pay(n,4);if(!paid.ok)return fail;const cap=H.capacity(n,activity),mind=H.capacity(n,'researchFormula'),craftBonus=g.progression?.equippedCraftBonus?.(n,d.discipline||d.craftPath||d.recipe?.discipline||d.recipe?.craftPath||d.workshop)||0,chance=clamp(.18+(cap.total+craftBonus)*.004+mind.cognition*.0025+cap.aptitude*.0025+H.liking(n,'researchFormula')*.001-d.tier*.035,.18,.82),roll=g.rng.next(),trialSuccess=roll<chance;project.trials++;project.updatedAt=g.s.t;project.paid.push(paid);H.learn(n,'researchFormula',2);project.history.push({at:g.s.t,roll,chance,success:trialSuccess,inputs:copy(d.trialInputs),paid});if(trialSuccess){project.successes++;project.progress=Math.min(100,project.progress+40);project.insight+=12;}else{project.failures++;project.progress=Math.min(95,project.progress+12);project.insight+=8;}project.progress=Math.min(100,project.progress);g.progression.receipt('researchTrial',n,{projectId:project.id,formulaId:d.id,trial:project.trials,chance,roll,success:trialSuccess,progress:project.progress,inputs:copy(d.trialInputs),paid});g.note(n.name+(trialSuccess?' พบหลักการสำคัญของ':' ทดลองแล้วพบข้อจำกัดของ')+d.name+' · ความคืบหน้า '+project.progress+'%',n);
   let actionSuccess=true;
   if(project.progress>=100){project.status='COMPLETED';project.completedAt=g.s.t;const formula={id:d.id,recipe:copy(d.recipe),ownerNpcId:n.id,knownBy:[n.id],access:'PRIVATE',source:'RESEARCH',createdAt:g.s.t,revision:1,parentRecipeId:d.parentRecipeId,projectId:project.id,history:[{revision:1,at:g.s.t,authorId:n.id,note:'ค้นพบจากการทดลอง',recipe:copy(d.recipe)}],licenses:[]};g.s.growth.formulaRegistry.push(formula);const notebook=n.jianghu.ledgerV140.scrolls.find(x=>x.id===project.notebookId);if(notebook){notebook.kind='FORMULA';notebook.formulaId=d.id;notebook.formulaRevision=1;notebook.nameTh='ตำรับต้นฉบับ: '+d.name;notebook.sourceType='RESEARCH';notebook.originLabelTh='ค้นพบโดย '+n.name;notebook.rights='OWNER';notebook.ownerNpcId=n.id;}if(!s.growth.knownRecipes.includes(d.id))s.growth.knownRecipes.push(d.id);g.progression.receipt('formulaDiscovered',n,{formulaId:d.id,ownerNpcId:n.id,projectId:project.id,revision:1});g.note(n.name+' ค้นพบตำรับใหม่ '+d.name+' · บันทึกต้นตำรับเป็นของผู้ค้นพบ',n);}
   else if(project.trials>=5){
    project.status='FAILED';project.failedAt=g.s.t;actionSuccess=false;
    const scrolls=n.jianghu.ledgerV140.scrolls;
    const nbIdx=scrolls.findIndex(x=>x.id===project.notebookId);
    const archivedEntry={id:project.notebookId||('archived-'+project.id),projectId:project.id,formulaId:d.id,nameTh:'บันทึกทดลองที่ยังไม่สมบูรณ์: '+d.name,npcId:n.id,insight:project.insight,progress:project.progress,archivedAt:g.s.t};
    if(nbIdx>=0)scrolls.splice(nbIdx,1);
    s.growth.archivedResearchNotes=s.growth.archivedResearchNotes||[];
    s.growth.archivedResearchNotes.unshift(archivedEntry);
    s.growth.archivedResearchNotes.splice(24);
    g.s.growth.archivedResearchNotes=g.s.growth.archivedResearchNotes||[];
    g.s.growth.archivedResearchNotes.unshift(archivedEntry);
    g.s.growth.archivedResearchNotes.splice(60);
    g.progression.receipt('researchFailed',n,{formulaId:d.id,projectId:project.id,trials:project.trials,progress:project.progress,archived:true});
    g.note('โครงการค้นคว้า '+d.name+' ของ '+n.name+' สิ้นสุดโดยยังไม่พบสูตรสมบูรณ์ · จัดเก็บสมุดทดลองเข้าแฟ้มเพื่อไม่ให้รกสัมภาระ',n);
   }
   s.academyTicket=null;return {handled:true,success:actionSuccess,cooldown:action==='continueResearch'?10:4};
  }
  if(action==='shareFormula'){
   this.engageShareIfNear(n,ticket);
   const f=this.formula(ticket.formulaId),other=g.world.npcs[ticket.partnerId],growth=other?.stageLocal?.growth,valid=!!(ticket.accepted&&f&&f.ownerNpcId===n.id&&alive(other)&&growth&&other.stageLocal?.academyReservation?.sessionId===ticket.sessionId&&dist(s,other.stageLocal)<=190);if(valid){/* Complete an accepted share idempotently. A prior runtime may have added knownRecipes before throwing while appending the missing license. */if(!Array.isArray(growth.knownRecipes))growth.knownRecipes=[];if(!growth.knownRecipes.includes(f.id))growth.knownRecipes.push(f.id);if(!f.knownBy.includes(other.id))f.knownBy.push(other.id);if(!f.licenses.some(x=>x?.npcId===other.id&&x.rights==='USE_ONLY'))f.licenses.push({npcId:other.id,rights:'USE_ONLY',grantedBy:n.id,at:g.s.t});g.progression.receipt('formulaShared',n,{formulaId:f.id,recipientId:other.id,rights:'USE_ONLY'});g.note(n.name+' ถ่ายทอดตำรับ '+(f.recipe?.name||f.id)+' ให้ '+other.name+' · สิทธิ์ใช้ผลิต ไม่ใช่สิทธิ์อ้างตนเป็นผู้ค้นพบ',n);}else g.progression.receipt('formulaShared',n,{formulaId:ticket.formulaId,recipientId:ticket.partnerId,accepted:false,reason:ticket.accepted?'ผู้รับหรือระยะห่างเปลี่ยน':'ผู้รับปฏิเสธ'});if(other?.stageLocal?.academyReservation?.sessionId===ticket.sessionId)delete other.stageLocal.academyReservation;s.academyTicket=null;return {handled:true,success:!!valid,cooldown:valid?20:12};}
  s.academyTicket=null;return fail;
 }
 workActivity(n,action){if(['learnFromMentor'].includes(action))return 'learnFromMentor';if(['startResearch','continueResearch'].includes(action))return 'researchFormula';if(action==='shareFormula')return 'shareFormula';return null;}
 tick(){const now=this.g.s.t;for(const n of this.g.heroes){const r=n.stageLocal?.academyReservation;if(r&&r.until<=now){delete n.stageLocal.academyReservation;const loan=this.g.s.growth.bookLoans.find(x=>x.sessionId===r.sessionId&&['ACTIVE','PENDING_RETURN'].includes(x.status));if(loan)this.returnLoan(loan);}}
  for(const loan of this.g.s.growth.bookLoans)if(['ACTIVE','PENDING_RETURN'].includes(loan.status)&&loan.dueAt<=now)this.returnLoan(loan);
 }
}
root.LivingAcademy=LivingAcademy;if(typeof module==='object')module.exports={LivingAcademy,RESEARCH_DESIGNS:DESIGNS};
})(typeof globalThis!=='undefined'?globalThis:this);
