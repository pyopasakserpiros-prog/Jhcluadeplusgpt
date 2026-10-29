/* Explicit costly retraining, bounded NPC preparation and access-aware choice. */
(function(g){
'use strict';
const {MARTIAL:M,CULT,CPE,HC,AI,STATS:ST,JD,U,SECT}=g,clamp=U.clamp;
M.retrainingStage=(old,pathChanged)=>pathChanged?1:Math.max(1,old-Math.max(2,Math.ceil(old/2)));
M.retrainingTarget=(n,key)=>{
 const k=M.knowledge(key);if(!n||!n.cult||!k||k.kind!=='sub')return {ok:false,reason:'ต้องมีองค์ความรู้สายย่อยที่ถูกต้อง'};
 if(n.cult.path===k.path&&n.cult.sub===k.id)return {ok:false,reason:'เดินสายนี้อยู่แล้ว'};
 if(n.cult.path===k.path&&n.cult.sub==='NONE')return {ok:false,reason:'ใช้การศึกษาสายเริ่มต้น ไม่ต้องสละขั้น'};
 if(n.cult.stage<k.tier)return {ok:false,reason:'ขั้นเดิมยังไม่ถึงเกณฑ์ความรู้'};
 return {ok:true,knowledge:k,pathChanged:n.cult.path!==k.path,newStage:M.retrainingStage(n.cult.stage,n.cult.path!==k.path)};
};
M.retrainingQuote=(W,n,key,opts)=>{
 opts=opts||{};const target=M.retrainingTarget(n,key);if(!target.ok)return target;
 if(n.dead||n.away||n.exiled||n.act&&n.act.id==='fight')return {ok:false,reason:'ต้องปลอดภัยและอยู่ในสำนักก่อน'};
 if(W.day<(n.retrainUntil||0))return {ok:false,reason:'พักปรับฐานวิถีถึงวันที่ '+n.retrainUntil,cooldownUntil:n.retrainUntil};
 const id=target.knowledge.id,ownedCrystal=(n.inv&&n.inv.crystals&&n.inv.crystals[key]||0)>0,ownedManual=(n.inv&&n.inv.subManuals||[]).includes(id),sectManual=(W.sect.subLibrary||[]).includes(id)&&SECT.canLearnTier(W,n)>=target.knowledge.tier;
 const source=opts.source||(ownedCrystal?'crystal':ownedManual?'personalManual':sectManual?'sectManual':null);
 if(!source||source==='crystal'&&!ownedCrystal||source==='personalManual'&&!ownedManual||source==='sectManual'&&!sectManual||!['crystal','personalManual','sectManual'].includes(source))return {ok:false,reason:'ไม่มีผลึกหรือคัมภีร์ที่เข้าถึงได้จริง'};
 const fee=source==='crystal'?0:M.studyFee(W,key),cooldownDays=target.pathChanged?60:30;
 if(opts.price!=null&&opts.price!==fee)return {ok:false,reason:'ค่าเรียนเปลี่ยนไป'};
 return Object.assign({},target,{ok:true,key,source,fee,lostStages:n.cult.stage-target.newStage,cooldownDays,affordable:Number.isFinite(n.cp)&&(n.cp>=fee)});
};
M.retrain=(W,n,key,opts)=>{
 const quote=M.retrainingQuote(W,n,key,opts);if(!quote.ok)return quote;if(!quote.affordable)return {ok:false,reason:'แต้มไม่พอ'};
 if(quote.source==='crystal'&&!(n.inv.crystals[key]>=1))return {ok:false,reason:'ผลึกถูกใช้ไปแล้ว'};
 if(quote.fee&&!CPE.spend(W,n,quote.fee,'เปลี่ยนวิถีศึกษาสาย'+quote.knowledge.nameTh))return {ok:false,reason:'แต้มไม่พอ'};
 // No RNG or fallible operation follows payment; consume a unit only on this successful commit.
 if(quote.source==='crystal')M.consumeCrystalUnit(n,key);else CPE.S(W).techSales+=quote.fee;
 const old=n.cult,from=old.path+'/'+old.sub,before=old.stage,k=quote.knowledge;
 n.cult={path:k.path,sub:k.id,stage:quote.newStage,prog:0,mantra:(CULT.bestMantra(k.path,quote.newStage,n)||{}).id||null,techs:Array.from(new Set(old.techs||[])),learning:null,toxic:old.toxic||0,lifeBonus:old.lifeBonus||0,since:W.day,attempts:0,secl:null,rate:0,pillT:0,tm:old.tm||{}};
 if(CULT.trackDef(k.id))n.cult.track=CULT.initTrack(k.id,1,W.day);
 if(M.reconcileInnate)M.reconcileInnate(n,W);
 if(M.reconcilePassives)M.reconcilePassives(n);
 n.buffs=[];n.sx=[];n.castFx=null;n._pickCache=null;if(M.invalidateMartialCaches)M.invalidateMartialCaches(n);
 if(n.cognition){n.cognition.goal=null;n.cognition.goalCandidates=[];}
 n.retrainUntil=W.day+quote.cooldownDays;
 n.martialIntent={targetKey:key,action:'restabilize',day:W.day,until:n.retrainUntil,from,oldStage:before,newStage:quote.newStage,reasons:['ยอมลดขั้น '+before+' → '+quote.newStage,'พักปรับรากฐาน '+quote.cooldownDays+' วัน']};
 CULT.refreshLifespan(n);n.h.state.hp=Math.min(n.h.state.hp,CULT.hpMax(n));n.h.state.qi=Math.min(n.h.state.qi||0,CULT.qiMax(n));n.h.state.energy=Math.max(0,n.h.state.energy-12);HC.bump(n);ST.dirty(n);
 W.log('learn',n.h.name.given+' เปลี่ยนจาก '+from+' เป็น '+k.path+'/'+k.id+' · ขั้น '+before+' → '+quote.newStage+' ตบะเริ่มใหม่ · ใช้'+(quote.source==='crystal'?'ผลึก1ชิ้น':'คัมภีร์ถาวร ค่าเรียน '+quote.fee+' คป.')+' · พักปรับฐาน '+quote.cooldownDays+' วัน',[n.id]);
 return {ok:true,source:quote.source,fee:quote.fee,oldStage:before,newStage:quote.newStage};
};
const affinityCache=new WeakMap();
function affinities(W,n){const c=affinityCache.get(n);if(c&&c.day===W.day&&c.ver===n._ver)return c.values;const values=CULT.pathScores(n);affinityCache.set(n,{day:W.day,ver:n._ver,values});return values;}
M.evaluateRetraining=(W,n,key)=>{
 const structure=M.retrainingTarget(n,key),quote=M.retrainingQuote(W,n,key),base={targetKey:key,accessible:quote.ok,action:'retain',score:-Infinity,reasons:[]};
 if(!structure.ok)return Object.assign(base,{reason:structure.reason,reasons:[structure.reason]});
 if(!quote.ok)return Object.assign(base,{reason:quote.reason,reasons:[quote.reason]});
 const k=structure.knowledge,profile=M.PROFILES[k.id],current=M.PROFILES[n.cult.sub],preferred=profile?profile[3]:M.PATHS[k.path].weapons,oldPreferred=current?current[3]:M.PATHS[n.cult.path].weapons;
 const targetSkill=Math.max(...preferred.map(type=>M.weaponSkill(n,type))),currentSkill=Math.max(...oldPreferred.map(type=>M.weaponSkill(n,type))),ambition=HC.eff(n,'personality.ambition'),caution=HC.eff(n,'personality.caution'),rational=HC.eff(n,'personality.rationality'),curiosity=HC.eff(n,'personality.curiosity');
 const oldActive=M.activeTechs(n).map(CULT.tech).filter(Boolean),lost=oldActive.filter(t=>t.path!=='ANY'&&t.path!==k.path||t.sub&&t.sub!==k.id),compatible=oldActive.filter(t=>(t.path==='ANY'||t.path===k.path)&&(!t.sub||t.sub===k.id));
 const sourcePool=JD.TECH.techniques.filter(t=>!t.innateOnly&&t.path===k.path&&t.sub===k.id&&(t.reqTier||t.tier)<=Math.max(k.tier,quote.newStage+1)&&((n.cult.techs||[]).includes(t.id)||W.sect.library.includes(t.id)||(n.inv.techs||[]).includes(t.id)||(n.inv.crystals[M.techKey(t.id)]||0)>0));
 const gearReady=preferred.includes(M.equippedType(n)),techReady=sourcePool.length>0;
 const rows=affinities(W,n),target=rows.find(x=>x.sub===k.id),currentAffinity=rows.find(x=>x.sub===n.cult.sub),affinityAdv=clamp((target?target.score:50)-(currentAffinity?currentAffinity.score:50),-25,25)*.4;
 const skillAdv=(targetSkill-currentSkill)*.35,investment=quote.lostStages*(5+caution*.20+rational*.07)+lost.reduce((s,t)=>s+t.tier,0)*(1+caution/70),prepared=(gearReady?11:0)+Math.min(18,sourcePool.length*9);
 const advantage=affinityAdv+skillAdv+(ambition-50)*.3+(curiosity-50)*.1+prepared+(compatible.length?3:0);
 const ageRisk=HC.ageYears(n)>CULT.PATHS[k.path].stages[quote.newStage-1].lifespanMax-8?100:0,needs=n.h.state.energy<35||n.h.state.satiety<35||n.h.state.hp<CULT.hpMax(n)*.6;
 const score=advantage-investment-ageRisk-(needs?35:0)-(!quote.affordable?25:0);
 const reasons=['อาวุธเป้าหมาย '+preferred.map(x=>M.TYPES[x]).join('/')+' ฝีมือ '+Math.round(targetSkill),'เสียขั้น '+n.cult.stage+' → '+quote.newStage+' และพัก '+quote.cooldownDays+' วัน','วิชาเดิมจะหยุดทำงาน '+lost.length+' · ยังใช้ได้ '+compatible.length,'เตรียมอุปกรณ์ '+(gearReady?'พร้อม':'ยังไม่พร้อม')+' / วิชาทดแทน '+sourcePool.length,'นิสัยและความถนัดสุทธิ '+Math.round(advantage)+' · ต้นทุนฝึกใหม่ '+Math.round(investment)];
 if(needs)reasons.push('ต้องดูแลสุขภาพ/อาหารก่อน');if(ageRisk)reasons.push('อายุขัยขั้นใหม่เสี่ยงเกินไป');
 const threshold=18+caution*.08,worth=score>=threshold;
 return Object.assign(base,{quote,score,accessible:true,action:worth&&gearReady&&techReady&&!needs&&quote.affordable?'switch':(targetSkill>=50&&advantage>investment*.5&&!needs?'prepare':'retain'),reasons,gearReady,techReady,targetSkill,lostTechniques:lost.map(t=>t.id),availableTechniques:sourcePool.map(t=>t.id)});
};
M.availableRetraining=(W,n)=>Array.from(new Set(Object.keys(n.inv&&n.inv.crystals||{}).filter(key=>key.startsWith('S:')&&n.inv.crystals[key]>0).concat((n.inv&&n.inv.subManuals||[]).map(M.subKey),(W.sect.subLibrary||[]).map(M.subKey))));
M.pickRetraining=(W,n)=>M.availableRetraining(W,n).map(key=>M.evaluateRetraining(W,n,key)).filter(x=>x.accessible).sort((a,b)=>b.score-a.score)[0]||null;
const decision=M.crystalDecision;M.crystalDecision=(W,n,key)=>{
 const k=M.knowledge(key);
 if(k&&k.kind==='sub'&&M.retrainingTarget(n,key).ok){const d=M.evaluateRetraining(W,n,key);if(d.accessible&&(d.action==='switch'||d.action==='prepare'||d.targetSkill>=55))return {action:'retain',reason:d.action==='switch'?'รอฝึกเปลี่ยนสายอย่างรอบคอบ':d.reasons.join(' · '),fit:d.targetSkill||50};}
 const intent=n.martialIntent,target=intent&&M.knowledge(intent.targetKey);if(k&&k.kind==='tech'&&target&&['prepare','switch'].includes(intent.action)&&k.path===target.path&&(!k.sub||k.sub===target.id))return {action:'retain',reason:'เตรียมวิชาทดแทนก่อนยอมลดขั้น',fit:80};
 return decision(W,n,key);
};
const fit=M.knowledgeFit;M.knowledgeFit=(n,key)=>{const k=M.knowledge(key);if(k&&k.kind==='sub'&&n.cult&&M.PROFILES[k.id])return Math.max(fit(n,key),35+Math.max(...M.PROFILES[k.id][3].map(type=>M.weaponSkill(n,type)))*.5);return fit(n,key);};
M.canAcquireKnowledge=(W,n,key)=>M.eligible(n,key).ok||(M.knowledge(key)&&M.knowledge(key).kind==='sub'&&M.retrainingTarget(n,key).ok);
const daily=M.daily;M.daily=W=>{M.ensure(W);for(const n of W.npcs){if(n.dead||n.away||n.exiled||W.day<(n.retrainUntil||0))continue;const best=M.pickRetraining(W,n);if(best&&best.action!=='retain')n.martialIntent={targetKey:best.targetKey,action:best.action,day:W.day,until:W.day+30,score:Math.round(best.score),reasons:best.reasons.slice(0,6)};else if(n.martialIntent&&n.martialIntent.until<=W.day)n.martialIntent=null;}daily(W);};
AI.ACTS.retrain={nameTh:'ปรับฐานเปลี่ยนวิถี',icon:'🔄',color:'#d6a7e8',can(n,W){const p=M.pickRetraining(W,n);return !!p&&p.action==='switch';},score(n,W,S){const p=M.pickRetraining(W,n);if(p&&p.action==='switch')S.add('ยอมลดขั้นเพื่อสายที่เตรียมไว้',.65+Math.min(1,p.score/70));},where(W,n){const p=M.pickRetraining(W,n);if(!p||p.action!=='switch')return null;const st=AI.freeStation(W,n,'read','scripture');return st?{st,targetKey:p.targetKey}:null;},dur:()=>360,done(n,W,ctx){const p=M.evaluateRetraining(W,n,ctx.targetKey);if(p.action==='switch')M.retrain(W,n,ctx.targetKey,{source:p.quote.source,price:p.quote.fee});}};
const suitable=M.gearSuitability;M.gearSuitability=(n,it,price)=>{const result=suitable(n,it,price),intent=n.martialIntent,target=intent&&intent.action==='prepare'&&M.knowledge(intent.targetKey),profile=target&&M.PROFILES[target.id];if(profile&&it.slot==='WEAPON'&&profile[3].includes(M.gearType(it))&&Number.isFinite(result.score)){return Object.assign({},result,{score:result.score*1.25+18,reasons:result.reasons.concat('เตรียมอาวุธก่อนยอมลดขั้นเปลี่ยนสาย')});}return result;};
})(typeof globalThis!=='undefined'?globalThis:this);
