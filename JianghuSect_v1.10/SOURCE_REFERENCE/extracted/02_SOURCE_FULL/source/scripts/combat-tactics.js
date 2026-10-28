/* Living Combat 1.17 tactics. Extends the existing resolver rather than forking
   the canonical NPC, damage, item or world simulation. */
(function(root){'use strict';
const C=root.LivingCombat.prototype,E=root.World2026Engine,H=root.HumanCore,D=root.CombatData117;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),alive=n=>n&&n.alive!==false&&n.health>0;
const dist=(a,b)=>Math.hypot((a.stageLocal||a).x-(b.stageLocal||b).x,(a.stageLocal||a).y-(b.stageLocal||b).y);
const effects=a=>(a.effectBindings||[]).map(x=>x.effectId||'').join('|');
const ensureOld=C.ensure,summaryOld=C.summary,baseFactor=C.moveFactor,incomingOld=C.incoming,basicOld=C.basic,targetOld=C.targetState;
C.targetState=function(n){if(n?.stageLocal?.pet){const p=n.stageLocal;p.combatState||={schema:2,marks:{},buffs:{},debuffs:{},dots:[],guardUntil:0,evadeUntil:0,staggerUntil:0,controlImmuneUntil:0,chillUntil:0,exposedUntil:0};return p.combatState;}return targetOld.call(this,n);};
C.profile=function(n){return D.profile(n);};
C.mechanics=function(a){return D.mechanics(a);};
C.attackCapacity=function(n){let slots=1;for(const [o,c] of this.profile(n).slots)if((n.jianghu.trackOrdinal||1)>=o)slots=c;return slots;};
C.eligible=function(n,a){if(!a||!n?.jianghu)return false;const r=a.innateRoute;if(r)return n.jianghu.path===r.path&&n.jianghu.subPath===r.subPath&&(n.jianghu.trackOrdinal||1)>=r.ordinal;return this.g.progression.compatible(n,a)&&this.g.progression.canStudyArtTier(n,a);};
C.learned=function(n,a){const k=n.jianghu.knowledgeV190?.[a?.id];return !!k&&k.stage>=4&&k.mastery>=8&&this.eligible(n,a);};
C.inCombat=function(n){const s=n.stageLocal?.combatState;return !!s&&(n.stageLocal.mode==='combat'||this.g.s.t-s.lastAttackAt<5||this.g.s.t-(s.lastIncomingAt??-100)<5);};
C.unlockInnates=function(n){
 if(!n?.jianghu||!n.stageLocal||n.stageLocal.pet||n.stageLocal.service||n.stageLocal.visitor)return [];
 const j=n.jianghu,out=[];j.knowledgeV190||={};j.artMasteryV150||={};j.knownArtIdsV150||=[];
 for(const id of this.profile(n).innateIds){const a=this.artMap.get(id);if(!this.eligible(n,a)||j.knowledgeV190[id])continue;
  j.knowledgeV190[id]={artId:id,stage:4,mastery:12,reading:100,source:'ROUTE_AWAKENING',redistribute:false,awakenedAt:this.g.s.t};j.artMasteryV150[id]=12;if(!j.knownArtIdsV150.includes(id))j.knownArtIdsV150.push(id);out.push(id);
  this.g.progression.receipt('routeAwakening',n,{artId:id,ordinal:j.trackOrdinal,route:j.path+':'+j.subPath});
 }
 return out;
};
C.rankArt=function(n,a,selected=[]){
 const m=this.mechanics(a),k=n.jianghu.knowledgeV190[a.id],p=this.profile(n);
 const innateMechs=(p.innateIds||[]).map(id=>this.artMap.get(id)).filter(x=>x&&this.learned(n,x)).map(x=>this.mechanics(x));
 const previous=[...innateMechs,...selected.map(x=>this.mechanics(x))];
 const person=n.personality||{};
 let v=(k?.mastery||0)*.16+(a.tier||1)*2.2+(a.subPath===n.jianghu.subPath?5.5:a.path===n.jianghu.path?1.5:0)+Math.min(170,a.power||50)*.025+Math.min(2,12/(m.qi||6));
 if(m.role==='control')v+=(person.caution||50)*.035;
 if(m.role==='defense'||m.role==='recovery')v+=((person.caution||50)-45)*.04+(p.style==='guardian'||p.style==='healer'?3.5:0);
 if(m.role==='attack')v+=((person.courage||50)+(person.aggression||50)-95)*.025+(p.style==='burst'||p.style==='duelist'?2.5:0);
 if(p.style==='combo'&&(m.setup||m.consume))v+=4.5;
 if(m.consume&&previous.some(x=>x.setup===m.consume)||m.setup&&previous.some(x=>x.consume===m.setup))v+=7.5;
 if(previous.some(x=>x.setup&&x.setup===m.setup&&x.role===m.role))v-=4;
 if(!previous.some(x=>x.role===m.role))v+=2;
 return v;
};
C.reconcileLoadout=function(n,{force=false}={}){
 if(!n?.jianghu||!n.stageLocal||n.stageLocal.pet||n.stageLocal.service||n.stageLocal.visitor||n.alive===false)return n?.jianghu?.attackArtIds||[];
 this.unlockInnates(n);const j=n.jianghu,p=n.stageLocal,cap=this.attackCapacity(n);
 let ids=Array.isArray(j.attackArtIds)?j.attackArtIds:(j.techniqueId?[j.techniqueId]:[]);
 ids=[...new Set(ids)].filter(id=>{const a=this.artMap.get(id);return a&&!a.innateRoute&&this.g.progression.slot(a)==='technique'&&this.learned(n,a);}).slice(0,cap);
 if(!this.inCombat(n)&&(force||p.nextLoadoutAt===undefined||this.g.s.t>=p.nextLoadoutAt)){
  const pool=this.arts.filter(a=>!a.innateRoute&&this.g.progression.slot(a)==='technique'&&this.learned(n,a)),selected=[];
  while(selected.length<cap&&selected.length<pool.length){const a=pool.filter(x=>!selected.includes(x)).sort((a,b)=>this.rankArt(n,b,selected)-this.rankArt(n,a,selected)||a.id.localeCompare(b.id))[0];if(!a)break;selected.push(a);}
  ids=selected.map(a=>a.id);p.nextLoadoutAt=this.g.s.t+12;p.loadoutReason='คัดสรรตามความเชี่ยวชาญ ความสอดคล้องแห่งมรรคา สมดุลลมปราณ และการประสานต่อเคล็ดวิชา';
  for(const slot of ['mantra','lightness','auxiliary','forbidden']){const a=this.arts.filter(a=>!a.innateRoute&&this.g.progression.slot(a)===slot&&this.learned(n,a)).sort((a,b)=>this.rankArt(n,b)-this.rankArt(n,a)||a.id.localeCompare(b.id))[0];j[slot+'Id']=a?.id||null;j[slot+'NameTh']=a?.nameTh||null;}
 }
 j.attackArtIds=ids;j.techniqueId=ids[0]||null;j.techniqueNameTh=this.artMap.get(ids[0])?.nameTh||null;return ids;
};
C.validEquippedArt=function(n,slot){const art=this.artMap.get(n?.jianghu?.[slot+'Id']);return art&&this.learned(n,art)?{art,knowledge:n.jianghu.knowledgeV190[art.id]}:null;};
C.activeArts=function(n){
 if(!n?.jianghu)return [];const j=n.jianghu,out=[],seen=new Set();
 const add=(id,slot,innate=false)=>{const a=this.artMap.get(id);if(!a||seen.has(id)||!this.learned(n,a))return;seen.add(id);const role=this.classify(a);if(role)out.push({art:a,slot,knowledge:j.knowledgeV190[id],mastery:j.knowledgeV190[id].mastery,role,innate});};
 for(const id of j.attackArtIds||[])add(id,'technique');for(const slot of ['mantra','lightness','auxiliary','forbidden'])add(j[slot+'Id'],slot);for(const id of this.profile(n).innateIds)add(id,'innate',true);return out;
};
C.classify=function(a){return a?this.mechanics(a).role:null;};
C.passiveEntries=function(n){const j=n.jianghu;return [...new Set([j.mantraId,j.auxiliaryId,...this.profile(n).innateIds])].map(id=>this.artMap.get(id)).filter(a=>a&&this.learned(n,a)&&['mantra','auxiliary'].includes(this.g.progression.slot(a)));};
C.maxQi=function(n){const tier=this.g.progression?.tier(n)||1,bonus=Math.min(28,this.passiveEntries(n).reduce((s,a)=>s+(a.tier||1)*2+(/QI_RESERVOIR/.test(effects(a))?8:0),0));return Math.round(clamp((38+tier*10+Number(n.core?.physiology?.meridianCapacity||50)*.16+H.effective(n,'cognition','metacognition')*.05+bonus)*this.profile(n).qi,35,220));};
C.ensure=function(n){
 if(!n?.jianghu||!n.stageLocal||n.stageLocal.pet)return null;if(n.alive===false){const dead=n.stageLocal.combatState;if(dead){n.jianghu.currentQiV190=dead.qi;n.jianghu.maxQiV190=dead.maxQi;}return dead||null;}this.unlockInnates(n);this.reconcileLoadout(n);const s=ensureOld.call(this,n);if(!s)return null;
 s.globalReadyAt??=0;s.lastIncomingAt??=-100;s.controlImmuneUntil??=0;s.marks||={};s.buffs||={};s.debuffs||={};s.dots||=[];s.history||=[];s.decisions||=[];s.comboCount||=0;s.lifespanSpent||=0;return s;
};
C.qiCost=function(n,a){return Math.ceil(this.mechanics(a).qi*(this.samePath(n,a)?1:1.25));};
C.cooldownSeconds=function(a){return this.mechanics(a).cooldown;};
C.vitalityCost=function(e){const v=this.mechanics(e.art).vitality??Math.ceil(Math.max(0,Number(e.art.costs?.vitalityCost)||0)*.2);return e.role==='forbidden'?Math.max(5,v):v;};
C.canPayCost=function(n,e,s){const life=Math.max(0,Number(e.art.costs?.lifespanCostYears)||0),cost=this.vitalityCost(e);return s.qi>=this.qiCost(n,e.art)&&(Number(n.jianghu.currentFaithV1100??100)>=Math.max(0,Number(e.art.costs?.faithDrain)||0))&&(!life||Number(n.jianghu.lifespanMax)-life>Number(n.age||0)+1)&&n.health>cost+3;};
C.ready=function(n,e,s){return !!e&&this.g.s.t>=s.globalReadyAt&&this.g.s.t>=(s.cooldowns[e.art.id]||0)&&this.canPayCost(n,e,s);};
C.applyResourceCost=function(n,e,s){
 if(!this.canPayCost(n,e,s))return false;const q=this.qiCost(n,e.art),life=Math.max(0,Number(e.art.costs?.lifespanCostYears)||0),v=this.vitalityCost(e);
 s.qi-=q;s.qiSpent+=q;n.jianghu.currentQiV190=s.qi;const faith=Math.max(0,Number(e.art.costs?.faithDrain)||0);if(faith)n.jianghu.currentFaithV1100=Math.max(0,Number(n.jianghu.currentFaithV1100??100)-faith);if(life){n.jianghu.lifespanMax-=life;n.jianghu.combatLifespanDebt117=(Number(n.jianghu.combatLifespanDebt117)||0)+life;s.lifespanSpent+=life;}s.vitalitySpent+=v;if(v){n.health-=v;H.injure(n,v*.18,this.g.s.t);}n.core.condition.fatigue=clamp((n.core.condition.fatigue||0)+v*.12,0,100);return true;
};
C.hasBuff=function(n,tag){const b=this.targetState(n)?.buffs?.[tag];return !!b&&b.expiresAt>this.g.s.t;};
C.hasDebuff=function(n,tag){const d=this.targetState(n)?.debuffs?.[tag];return !!d&&d.expiresAt>this.g.s.t;};
C.applyBuffsAndDebuffs=function(n,t,e,s){
 if(!alive(n))return;
 const now=this.g.s.t,m=this.mechanics(e.art);
 s.buffs||={};
 if(m.buff){
  const oldStacks=s.buffs[m.buff]?.expiresAt>now?(s.buffs[m.buff].stacks||1):0;
  s.buffs[m.buff]={tag:m.buff,stacks:Math.min(3,oldStacks+1),expiresAt:now+6};
 }
 if(m.debuff&&t&&(!['attack','control','forbidden'].includes(e.role)||(s.primaryHit201?.t===now&&s.primaryHit201?.targetId===t.id&&s.primaryHit201?.hit))){
  const ts=this.targetState(t);
  if(ts){
   ts.debuffs||={};
   ts.debuffs[m.debuff]={tag:m.debuff,ownerId:n.id,expiresAt:now+5.5};
  }
 }
 if(this.hasBuff(n,'BLOOD_FRENZY')&&['attack','forbidden'].includes(e.role)){
  n.health=Math.min(this.maxHealth(n),n.health+3.2);
 }
};
C.schedule=function(n,e,s){const now=this.g.s.t;
 const tObj=this.g.s.beasts?.find(b=>b.id===s.currentTargetId);
 const tTarget=this.g.world?.npcs?.[s.currentTargetId]||tObj||null;
 this.applyBuffsAndDebuffs(n,tTarget,e,s);
 const cd=this.cooldownSeconds(e.art);
 s.cooldowns[e.art.id]=cd<=0?now:now+cd;
 s.globalReadyAt=now+1.25;s.lastAttackAt=now;s.lastArtId=e.art.id;s.lastRole=e.role;s.lastMoveName=e.art.nameTh;s.lastMoveAt=now;s.movesUsed++;s.moveCount++;s.history.push({t:now,artId:e.art.id,name:e.art.nameTh,role:e.role,innate:!!e.innate,cooldown:cd,targetId:s.currentTargetId,qi:s.qi,reason:s.chosenReason||''});s.history.splice(0,Math.max(0,s.history.length-32));
};
C.moveFactor=function(n,e){return baseFactor.call(this,n,e)*this.profile(n).damage;};
C.hasMark=function(n,t,tag){const v=this.targetState(t)?.marks?.[tag];return !!v&&v.expiresAt>this.g.s.t&&v.ownerId===n.id;};
C.applyCombo=function(n,t,e,{preview=false}={}){const m=this.mechanics(e.art),s=this.targetState(t),now=this.g.s.t;s.marks||={};let multiplier=1;if(m.consume&&this.hasMark(n,t,m.consume)){multiplier=(m.comboMultiplier||1.3)*this.profile(n).combo;if(!preview){delete s.marks[m.consume];this.ensure(n).comboCount++;this.emit(n,'ประสานเคล็ดสำเร็จ!',0,'combo');}}if(m.setup&&!preview)s.marks[m.setup]={ownerId:n.id,expiresAt:now+(m.setupSeconds||5)};return {multiplier:Math.min(1.65,multiplier)};};
C.applyControl=function(t,seconds,n){const s=this.targetState(t),now=this.g.s.t;if(!s||s.controlImmuneUntil>now)return false;const d=clamp(seconds,.3,1.4);s.staggerUntil=now+d;s.controlImmuneUntil=now+d+2.8;this.emit(t,'เสียจังหวะกระบวนท่า',0,'control');return true;};
C.nearbyHostiles=function(n,t,r){const all=[...Object.values(this.g.world.npcs).filter(x=>x.stageLocal&&(n.stageLocal.enemy?!x.stageLocal.enemy&&!x.stageLocal.service&&!x.stageLocal.visitor:x.stageLocal.enemy)),...(!n.stageLocal.enemy?this.g.s.beasts.filter(x=>this.g.isHostileCreature(x)):[])];return all.filter(x=>x!==t&&alive(x)&&!x.stageLocal?.offmap&&dist(t,x)<=r).slice(0,2);};
C.injuredAllies=function(n,r=260){const members=n.stageLocal.enemy?this.g.enemies:this.g.heroes;return members.filter(a=>a.id!==n.id&&alive(a)&&!a.stageLocal.offmap&&dist(n,a)<r&&a.health<this.maxHealth(a)*.8).sort((a,b)=>a.health/this.maxHealth(a)-b.health/this.maxHealth(b));};
C.healAllies=function(n,art){if(!/MASS_VITAL_HEAL|HEALING_RELAY/.test(effects(art)))return;for(const a of this.injuredAllies(n).slice(0,2)){const heal=Math.min(this.maxHealth(a)-a.health,10+(art.tier||1)*2);a.health+=heal;H.recover(a,heal*.12);this.emit(a,'ประสานปราณฟื้นชีพ +'+Math.round(heal),-heal,'heal');}};
C.wardAllies=function(n,art){if(!/GUARDED_DAMAGE_SHARE/.test(effects(art)))return;const members=n.stageLocal.enemy?this.g.enemies:this.g.heroes;for(const a of members.filter(a=>a!==n&&alive(a)&&!a.stageLocal.offmap&&dist(n,a)<260).sort((a,b)=>a.health-b.health).slice(0,2)){const s=this.ensure(a);s.allyWard={guardianId:n.id,expiresAt:this.g.s.t+4,charges:2};this.emit(a,'ปราณสัตย์คุ้มสหาย',0,'guard');}};
C.choose=function(n,t,s,{defensiveOnly=false}={}){
 const now=this.g.s.t,hp=n.health/this.maxHealth(n),ts=this.targetState(t),p=this.profile(n),person=n.personality||{},caution=person.caution??50,courage=person.courage??50,planning=H.effective(n,'cognition','metacognition'),budget=s.qi/s.maxQi,d=dist(n,t),arts=this.activeArts(n),scored=[];
 const hasOtherReady=id=>arts.some(o=>o.art.id!==id&&this.ready(n,o,s)&&(!(['attack','control','forbidden'].includes(o.role))||d<=this.mechanics(o.art).range));
 for(const e of arts){if(defensiveOnly&&!['defense','recovery','movement'].includes(e.role))continue;if(!this.ready(n,e,s))continue;const m=this.mechanics(e.art),f=effects(e.art);let score=0,reason='';if(['attack','control','forbidden'].includes(e.role)&&d>m.range)continue;
  if(e.role==='attack'){score=35+(person.aggression||50)*.07+e.mastery*.05+(m.cooldown===0?-4:3);reason=m.cooldown===0?'กระบวนท่าต่อเนื่องไร้คูลดาวน์ สอดประสานระหว่างรอท่าไม้ตาย':'เคล็ดวิชาจู่โจมพร้อมสำแดงอานุภาพ';}
  if(e.role==='control'){if(ts.controlImmuneUntil>now&&!/EXPOSURE|FRACTURE/.test(f)&&!m.debuff)continue;score=32+caution*.1+(ts.controlImmuneUntil>now?-6:4);reason=ts.controlImmuneUntil>now?'บั่นทอนตบะศัตรูด้วยสถานะผิดปกติ':'ชิงจังหวะสะกดจุดและสกัดกั้นกระบวนท่าศัตรู';}
  if(e.role==='recovery'){const allyNeed=/MASS_VITAL_HEAL|HEALING_RELAY/.test(f)&&this.injuredAllies(n).length;if(hp>.85&&!s.dots.length&&!allyNeed)continue;score=25+(1-hp)*80+caution*.08+(allyNeed?40:0);reason='โคจรลมปราณสมานแผลและชำระพิษร้าย';}
  if(e.role==='defense'){if(s.guardUntil>now||d>260)continue;score=19+(1-hp)*35+caution*.14+(p.style==='guardian'?12:0);reason='ตั้งค่ายปราณคุ้มกาย ลดแรงปะทะและรอจังหวะสวนกลับ';}
  if(e.role==='movement'){if(s.evadeUntil>now||d>330)continue;score=15+(1-hp)*35+caution*.12+(p.style==='skirmisher'?8:0);reason='พลิ้วกายด้วยวิชาตัวเบา ชิงตำแหน่งและหลบคมศาสตรา';}
  if(e.role==='forbidden'){if(hp>.55&&this.targetPower(t)<this.power(n)*1.2)continue;if(courage+(person.ambition||50)*.3-caution*.4<30)continue;score=40+(1-hp)*35;reason='ฝืนสังเวยพลังชีวิตสำแดงวิชาต้องห้ามเพื่อพลิกชะตาศึก';}
  if(m.buff&&!this.hasBuff(n,m.buff)){score+=6+planning*.03;if(!reason.includes('ต่อเคล็ด'))reason+=' · เร่งเร้าปราณเสริมอานุภาพ';}
  if(m.debuff&&!this.hasDebuff(t,m.debuff)){score+=7+planning*.04;if(!reason.includes('ต่อเคล็ด'))reason+=' · กดดันและบั่นทอนเส้นชีพจรศัตรู';}
  if(m.consume&&this.hasMark(n,t,m.consume)){score+=18+planning*.08;reason='ประสานต่อเคล็ดทะลวงจุดตายจากรอยเปิดของศัตรู';}
  if(m.setup&&!this.hasMark(n,t,m.setup)&&arts.some(a=>this.mechanics(a.art).consume===m.setup&&s.qi>=this.qiCost(n,e.art)+this.qiCost(n,a.art))){score+=8+planning*.04;reason='เปิดช่องโหว่ปูทางสู่กระบวนท่าต่อเคล็ด';}
  if(m.setup&&this.hasMark(n,t,m.setup))score-=8;
  if(m.tags?.includes('AREA'))score+=this.nearbyHostiles(n,t,135).length*7;
  if(m.tags?.includes('PIERCE')&&(ts.guardUntil>now||this.hasBuff(t,'IRON_AEGIS')))score+=11;
  score-=this.qiCost(n,e.art)*(budget<.35?.6+caution*.006:.12);
  if(budget<.2&&hp>.4&&['attack','control'].includes(e.role)&&m.cooldown>0)score-=20;
  if(m.consume&&!this.hasMark(n,t,m.consume)&&planning>55&&arts.some(a=>this.mechanics(a.art).setup===m.consume&&now>=(s.cooldowns[a.art.id]||0)))score-=15;
  if(s.lastArtId===e.art.id&&hasOtherReady(e.art.id))score-=18;
  else if(s.history.slice(-2).some(x=>x.artId===e.art.id))score-=5;
  scored.push({entry:e,score,reason});
 }
 scored.sort((a,b)=>b.score-a.score||a.entry.art.id.localeCompare(b.entry.art.id));s.currentTargetId=t.id;s.decisions=scored.slice(0,8).map(x=>({artId:x.entry.art.id,name:x.entry.art.nameTh,score:Math.round(x.score*10)/10,reason:x.reason}));const chosen=scored[0];s.chosenReason=chosen?.score>18?chosen.reason:'ออมลมปราณและประคองจังหวะ ออกกระบวนท่าพื้นฐานหยั่งเชิง';return chosen?.score>18?chosen.entry:null;
};
C.reach=function(n){return Math.max(135,...this.activeArts(n).filter(e=>['attack','control','forbidden'].includes(e.role)).map(e=>this.mechanics(e.art).range));};
C.canEngage=function(n,t){const caution=n.personality?.caution??50,courage=n.personality?.courage??50;const extra=this.nearbyHostiles(n,t,180).reduce((v,e)=>v+this.targetPower(e)*.45,0),help=this.g.heroes.filter(a=>a!==n&&alive(a)&&a.health>50&&!a.stageLocal.offmap&&dist(n,a)<180).reduce((v,a)=>v+this.power(a)*.35,0);return this.power(n)+help>=(this.targetPower(t)+extra)*clamp(.65+caution*.006-courage*.003,.45,1.25);};
C.advance=function(n,t,dt){const p=n.stageLocal,d=dist(n,t),s=this.ensure(n),r=Math.max(135,...this.activeArts(n).filter(e=>['attack','control','forbidden'].includes(e.role)&&this.g.s.t>=(s.cooldowns[e.art.id]||0)&&this.canPayCost(n,e,s)).map(e=>this.mechanics(e.art).range));if(d<=r*.88)return;const q=this.location(t),route=this.g.path(p,{x:q.x,y:q.y}),step=route?.find(x=>Math.hypot(x.x-p.x,x.y-p.y)>4);if(!step)return;const len=Math.hypot(step.x-p.x,step.y-p.y),move=Math.min(len,dt*this.stats(n).moveSpeed);p.x+=(step.x-p.x)/len*move;p.y+=(step.y-p.y)/len*move;};
C.basic=function(n,t,s){basicOld.call(this,n,t,s);s.globalReadyAt=this.g.s.t+1.25;s.history.push({t:this.g.s.t,artId:null,name:s.lastMoveName||'เพลงหมัดปราณพื้นฐาน',role:'basic',targetId:t.id,qi:s.qi,reason:s.chosenReason});s.history.splice(0,Math.max(0,s.history.length-32));};
C.incoming=function(t,a,n){const s=this.targetState(t);if(s&&n){s.lastIncomingAt=this.g.s.t;s.lastAttackerId=n.id;}const r=incomingOld.call(this,t,a,n);let amount=r.amount===0?0:Math.max(a*.15,r.amount);if(amount>0&&this.hasBuff(t,'IRON_AEGIS'))amount*=0.84;if(amount>0&&this.hasBuff(t,'WIND_STRIDE'))amount*=0.88;const ward=s?.allyWard,guardian=ward&&this.g.world.npcs[ward.guardianId];if(amount>0&&ward&&ward.expiresAt>this.g.s.t&&ward.charges>0&&alive(guardian)&&guardian!==t&&guardian.health>10&&!guardian.stageLocal.offmap&&dist(t,guardian)<280){const healthScale=H.damageMultiplier(guardian)/(this.g.realm?.formationBonus(guardian,'protection')||1),shared=Math.min(12,amount*.25,(guardian.health-4)/Math.max(.01,healthScale));ward.charges--;amount-=shared;this.g.damage(guardian,shared,n,true);this.emit(guardian,'รับแรงแทนสหาย',shared,'guard');}return {amount,counter:Math.min(a*.3,r.counter||0)};};
C.tickStatuses=function(n,dt){const s=this.targetState(n),now=this.g.s.t;if(!s)return;for(const [k,v] of Object.entries(s.marks||{}))if(v.expiresAt<=now)delete s.marks[k];for(const [k,v] of Object.entries(s.buffs||{}))if(v.expiresAt<=now)delete s.buffs[k];for(const [k,v] of Object.entries(s.debuffs||{}))if(v.expiresAt<=now)delete s.debuffs[k];for(const d of s.dots||[]){const active=Math.min(dt,Math.max(0,d.expiresAt-(s.statusTickAt??now-dt)));if(active>0&&alive(n)){const owner=this.g.world.npcs[d.ownerId]||this.g.s.beasts.find(x=>x.id===d.ownerId);this.secondary(n,d.dps*active,owner,{type:'dot',label:'พิษและบาดแผลกัดกร่อน',artId:d.artId});}}s.dots=(s.dots||[]).filter(d=>d.expiresAt>now);s.statusTickAt=now;};
C.tick=function(n,dt){const s=this.ensure(n);if(!s)return;this.reconcileLoadout(n);const boost=Math.min(.2,this.passiveEntries(n).reduce((v,a)=>v+(a.tier||1)*.012,0)),regen=(this.inCombat(n)?.55:1.8)*this.profile(n).regen*(1+boost)*Math.max(.3,1-(n.core.condition.fatigue||0)/160);s.qi=Math.min(s.maxQi,s.qi+regen*dt);n.jianghu.currentQiV190=s.qi;n.jianghu.maxQiV190=s.maxQi;if(Number.isFinite(n.jianghu.currentFaithV1100))n.jianghu.currentFaithV1100=Math.min(100,n.jianghu.currentFaithV1100+dt*(this.inCombat(n)?.08:.4));this.tickStatuses(n,dt);};
C.summary=function(n){const s=n.stageLocal.combatState||{},r=summaryOld.call(this,n);return {...r,attackCapacity:this.attackCapacity(n),attackIds:n.jianghu.attackArtIds||[],innateIds:this.profile(n).innateIds.filter(id=>this.learned(n,this.artMap.get(id))),comboCount:s.comboCount||0,decisions:s.decisions||[],history:s.history||[],profile:this.profile(n)};};
})(typeof globalThis!=='undefined'?globalThis:this);
