/* Scarce reusable manuals and finite one-use knowledge. Single transactional authority. */
(function(g){
'use strict';
const {MARTIAL:M,CULT,CPE,ECO,HC,AI,SECT,JD,STATS:ST,U}=g,clamp=U.clamp;
M.RARITY=Object.freeze({dailyCap:12,techManual:.003,subManual:.0005,techCrystal:.055,subCrystal:.009});
M.techKey=id=>'T:'+id;M.subKey=id=>'S:'+id;
const branches=Object.values(CULT.PATHS).flatMap(p=>p.subPaths.map(s=>({id:s.id,path:p.id,nameTh:s.nameTh,tier:JD.MARTIAL.subPaths.some(x=>x.id===s.id)?2:1})));
const subById=Object.fromEntries(branches.map(s=>[s.id,s]));
M.knowledge=key=>typeof key!=='string'?null:key.startsWith('T:')?((t=>t?{kind:'tech',id:t.id,path:t.path,sub:t.sub,tier:t.reqTier||t.tier,nameTh:t.nameTh}:null)(CULT.tech(key.slice(2)))):key.startsWith('S:')?((s=>s?Object.assign({kind:'sub'},s):null)(subById[key.slice(2)])):null;
const cleanCounts=map=>{const out={};for(const [key,qty] of Object.entries(map||{}))if(M.knowledge(key)&&Number.isInteger(qty)&&qty>0)out[key]=Math.min(999,qty);return out;};
M.drainKnowledgeOverflow=W=>{const overflow=W.sect.knowledgeOverflow;if(!overflow)return;W.sect.crystals=W.sect.crystals||{};for(const key of Object.keys(overflow)){const qty=overflow[key];if(!M.knowledge(key)||!Number.isSafeInteger(qty)||qty<=0){delete overflow[key];continue;}const put=Math.min(qty,Math.max(0,999-(W.sect.crystals[key]||0)));if(put){W.sect.crystals[key]=(W.sect.crystals[key]||0)+put;if(put===qty)delete overflow[key];else overflow[key]=qty-put;}}};
M.ensure=W=>{
 const S=W.sect;if(!S.crystals)S.crystals={};M.drainKnowledgeOverflow(W);if(!S.subLibrary)S.subLibrary=[];
 if(!W.world.martial)W.world.martial={discovery:{day:W.day,attempts:0},found:{techManual:0,subManual:0,crystal:0},used:0,donated:0,sold:0};
 for(const n of W.npcs){M.normalize(n);n.martialSkills=n.martialSkills||{};n.inv=n.inv||{};if(!n.inv.crystals)n.inv.crystals={};if(!n.inv.subManuals)n.inv.subManuals=[];}
 return W.world.martial;
};
M.eligible=(n,key,opts)=>{
 const k=M.knowledge(key),c=n&&n.cult;if(!k||!c)return {ok:false,reason:'ยังไม่เปิดวิถีบำเพ็ญ'};
 if(k.path!=='ANY'&&k.path!==c.path)return {ok:false,reason:'ต่างวิถีหลัก'};
 if(c.stage<k.tier)return {ok:false,reason:'ขั้นบำเพ็ญไม่ถึง'};
 if(k.kind==='sub'){
  if(c.sub&&c.sub!=='NONE')return {ok:false,reason:c.sub===k.id?'เรียนสายนี้แล้ว':'เลือกได้เพียงสายย่อยเดียว'};
 }else{
  if(c.techs.includes(k.id)||c.mantra===k.id||c.learning&&c.learning.id===k.id)return {ok:false,reason:'เรียนแล้วหรือกำลังศึกษา'};
  if(k.sub&&k.sub!==c.sub)return {ok:false,reason:'ต้องมีสายย่อยตรงกัน'};
  if(/MANTRA/.test((CULT.tech(k.id)||{}).cat||''))return {ok:false,reason:'ผลึกนี้ไม่ใช่หลักสูตรเคล็ดหลัก'};
  if(/FORBIDDEN/.test((CULT.tech(k.id)||{}).cat||''))return {ok:false,reason:'วิชาต้องห้ามไม่เปิดศึกษา'};
 }
 return {ok:true,knowledge:k};
};
M.crystalName=key=>{const k=M.knowledge(key);return k?'ผลึก'+(k.kind==='sub'?'สาย':'วิชา')+'「'+k.nameTh+'」':key;};
const known=(W,k)=>k.kind==='sub'?(W.sect.subLibrary||[]).includes(k.id):W.sect.library.includes(k.id);
M.studyFee=(W,key)=>{const k=M.knowledge(key);if(!k)return Infinity;return k.kind==='tech'?CPE.techPrice(W,CULT.tech(k.id)):Math.max(1,Math.round((80+45*k.tier*k.tier)*CPE.S(W).price));};
M.crystalPrice=(W,key)=>{
 const k=M.knowledge(key);if(!k)return Infinity;
 if(known(W,k))return Math.floor(M.studyFee(W,key)*.5);
 const demand=W.npcs.reduce((s,n)=>s+(!n.dead&&M.eligible(n,key).ok?1:0),0),base=k.kind==='sub'?100+50*k.tier*k.tier:28*Math.pow(k.tier,2.1);
 return Math.max(2,Math.round(base*clamp(1+demand*.025,1,1.35)*clamp(CPE.S(W).price,.6,1.6)));
};
M.crystalReward=(W,key)=>Math.max(0,Math.floor(M.crystalPrice(W,key)*.4));
function removeUnit(n,key){
 const held=n.inv.crystals[key];if(!Number.isInteger(held)||held<1)return false;
 if(held===1)delete n.inv.crystals[key];else n.inv.crystals[key]=held-1;
 const receipt=n.inv.crystalBought&&n.inv.crystalBought[key];if(receipt){receipt.qty--;if(receipt.qty<=0)delete n.inv.crystalBought[key];}
 return true;
}
M.consumeCrystalUnit=removeUnit;
function applyKnowledge(W,n,k){
 if(k.kind==='sub'){n.cult.sub=k.id;n.cult.track=CULT.trackDef(k.id)?CULT.initTrack(k.id,1,W.day):null;CULT.refreshLifespan(n);}
 else {n.cult.techs.push(k.id);}
 HC.bump(n);ST.dirty(n);
 W.log('learn',n.h.name.given+' เรียนรู้'+k.nameTh+(k.kind==='sub'?' · เปิดสายย่อย':''),[n.id]);
}
M.useCrystal=(W,n,key)=>{
 const e=M.eligible(n,key);if(!e.ok)return e;
 if(!n.inv||!Number.isInteger(n.inv.crystals&&n.inv.crystals[key])||n.inv.crystals[key]<1)return {ok:false,reason:'ไม่มีผลึกในตัว'};
 removeUnit(n,key);applyKnowledge(W,n,e.knowledge);M.ensure(W).used++;return {ok:true};
};
M.buyCrystal=(W,n,key,price)=>{
 const e=M.eligible(n,key);if(!e.ok&&!(M.canAcquireKnowledge&&M.canAcquireKnowledge(W,n,key)))return e;
 const quote=M.crystalPrice(W,key),have=W.sect.crystals&&W.sect.crystals[key];
 if(!Number.isFinite(price)||price!==quote||!Number.isInteger(have)||have<1||!Number.isFinite(n.cp)||n.cp<quote)return {ok:false,reason:'ราคา คลัง หรือแต้มเปลี่ยนไป'};
 n.inv=n.inv||{};n.inv.crystals=n.inv.crystals||{};if((n.inv.crystals[key]||0)>=999)return {ok:false,reason:'กระเป๋าเต็ม'};
 if(!CPE.spend(W,n,quote,'ซื้อ'+M.crystalName(key)))return {ok:false,reason:'แต้มไม่พอ'};
 if(have===1)delete W.sect.crystals[key];else W.sect.crystals[key]=have-1;
 n.inv.crystals[key]=(n.inv.crystals[key]||0)+1;
 const receipts=n.inv.crystalBought||(n.inv.crystalBought={}),old=receipts[key];receipts[key]={qty:(old?old.qty:0)+1,cap:old?Math.min(old.cap,quote):quote};
 M.ensure(W).sold++;CPE.S(W).sales++;return {ok:true,price:quote};
};
M.donateCrystal=(W,n,key)=>{
 if(!M.knowledge(key)||!n.inv||!Number.isInteger(n.inv.crystals&&n.inv.crystals[key])||n.inv.crystals[key]<1)return {ok:false,reason:'ไม่มีผลึก'};
 if((W.sect.crystals&&W.sect.crystals[key]||0)>=999)return {ok:false,reason:'คลังเต็ม'};
 const r=n.inv.crystalBought&&n.inv.crystalBought[key];let reward=M.crystalReward(W,key);
 if(r&&r.qty>0)reward=Math.min(reward,Math.floor(r.cap*.4));
 removeUnit(n,key);W.sect.crystals=W.sect.crystals||{};W.sect.crystals[key]=(W.sect.crystals[key]||0)+1;
 if(reward>0){CPE.mint(W,n,reward,'บริจาค'+M.crystalName(key),true);CPE.S(W).donated+=reward;}
 M.ensure(W).donated++;return {ok:true,reward};
};
M.donateManual=(W,n,id,kind)=>{
 const isSub=kind==='sub',bag=n.inv&&(isSub?n.inv.subManuals:n.inv.techs),info=isSub?subById[id]:CULT.tech(id);
 if(!info||!Array.isArray(bag)||!bag.includes(id))return {ok:false,reason:'ไม่มีคัมภีร์'};
 const lib=isSub?(W.sect.subLibrary||(W.sect.subLibrary=[])):W.sect.library,duplicate=lib.includes(id),reward=duplicate?0:isSub?Math.round((100+info.tier*60)*CPE.S(W).price):CPE.techReward(W,id);
 bag.splice(bag.indexOf(id),1);if(!duplicate)lib.push(id);
 if(reward){CPE.mint(W,n,reward,'บริจาคคัมภีร์'+info.nameTh,true);CPE.S(W).donated+=reward;}
 return {ok:true,reward};
};
M.startStudy=(W,n,id)=>{
 const key=M.techKey(id),e=M.eligible(n,key);if(!e.ok)return e;
 if(n.cult.learning||!W.sect.library.includes(id))return {ok:false,reason:'ไม่มีคัมภีร์ในหอหรือกำลังศึกษา'};
 const t=CULT.tech(id),fee=M.studyFee(W,key);
 if((t.reqTier||t.tier)>SECT.canLearnTier(W,n))return {ok:false,reason:'ยังไม่ได้รับสิทธิ์หอคัมภีร์'};
 if(!CPE.spend(W,n,fee,'ศึกษา'+t.nameTh))return {ok:false,reason:'แต้มไม่พอ'};
 n.cult.learning={id,need:CULT.studyCost(t),got:0};CPE.S(W).techSales+=fee;return {ok:true,fee};
};
M.studySubpath=(W,n,id)=>{
 const key=M.subKey(id),e=M.eligible(n,key);if(!e.ok)return e;
 if(!(W.sect.subLibrary||[]).includes(id)||e.knowledge.tier>SECT.canLearnTier(W,n))return {ok:false,reason:'ต้องมีคัมภีร์และสิทธิ์หอ'};
 const fee=M.studyFee(W,key);if(!CPE.spend(W,n,fee,'ศึกษาสาย'+e.knowledge.nameTh))return {ok:false,reason:'แต้มไม่พอ'};
 applyKnowledge(W,n,e.knowledge);CPE.S(W).techSales+=fee;return {ok:true,fee};
};
// Only acquisition opportunities roll this gate. Handover consumes already rolled rewards without rerolling.
M.rollDiscovery=(W,opts)=>{
 M.ensure(W);opts=opts||{};const state=W.world.martial.discovery,R=M.RARITY;
 if(state.day!==W.day){state.day=W.day;state.attempts=0;}if(state.attempts>=R.dailyCap)return null;state.attempts++;
 const r=W.rng.next();let kind;if(r<R.subManual)kind='subManual';else if(r<R.subManual+R.techManual)kind='techManual';else if(r<R.subManual+R.techManual+R.subCrystal)kind='subCrystal';else if(r<R.subManual+R.techManual+R.subCrystal+R.techCrystal)kind='techCrystal';else return null;
 const tier=opts.tier||4;
 if(kind==='subManual'||kind==='subCrystal'){
  const pool=branches.filter(s=>s.tier<=tier&&(!opts.path||s.path===opts.path)&&!(kind==='subManual'&&(W.sect.subLibrary||[]).includes(s.id)));
  if(!pool.length)return null;const sub=W.rng.pick(pool);const drop=kind==='subManual'?{kind:'subManual',id:sub.id}:{kind:'crystal',id:M.subKey(sub.id)};W.world.martial.found[drop.kind]++;return drop;
 }
 const ids=opts.techs?new Set(opts.techs):null,pool=JD.TECH.techniques.filter(t=>(t.reqTier||t.tier)<=tier&&!t.martialBootstrap&&!/MANTRA|FORBIDDEN/.test(t.cat)&&(!ids||ids.has(t.id))&&(!opts.path||t.path===opts.path||t.path==='ANY')&&!(kind==='techManual'&&W.sect.library.includes(t.id)));
 if(!pool.length)return null;const t=W.rng.pick(pool),drop=kind==='techManual'?{kind:'techManual',id:t.id}:{kind:'crystal',id:M.techKey(t.id)};W.world.martial.found[drop.kind]++;return drop;
};
M.storeCrystal=(W,n,key,qty)=>{if(!M.knowledge(key)||!Number.isInteger(qty)||qty<1)return false;n.inv=n.inv||{};n.inv.crystals=n.inv.crystals||{};const room=Math.max(0,999-(n.inv.crystals[key]||0)),put=Math.min(room,qty);n.inv.crystals[key]=(n.inv.crystals[key]||0)+put;if(!n.inv.crystals[key])delete n.inv.crystals[key];if(qty>put){const overflow=W.sect.knowledgeOverflow||(W.sect.knowledgeOverflow={});overflow[key]=(overflow[key]||0)+qty-put;}return true;};
M.receiveDiscovery=(W,n,drop)=>{if(!drop||!n)return null;M.ensure(W);if(drop.kind==='techManual'){n.inv.techs=n.inv.techs||[];if(!n.inv.techs.includes(drop.id))n.inv.techs.push(drop.id);}else if(drop.kind==='subManual'){if(!n.inv.subManuals.includes(drop.id))n.inv.subManuals.push(drop.id);}else if(M.knowledge(drop.id))M.storeCrystal(W,n,drop.id,1);return drop;};
M.personalDiscovery=(W,n,opts)=>M.receiveDiscovery(W,n,M.rollDiscovery(W,opts));
M.discover=(W,out,opts)=>{
 const drop=M.rollDiscovery(W,opts);if(!drop)return null;
 if(drop.kind==='techManual'){out.techs=out.techs||[];if(!out.techs.includes(drop.id))out.techs.push(drop.id);}
 else {out.knowledge=out.knowledge||[];out.knowledge.push(drop);}
 return drop;
};
M.knowledgeFit=(n,key)=>{const k=M.knowledge(key);if(!k||!n.cult||k.path!==n.cult.path&&k.path!=='ANY')return -100;
 if(k.kind==='sub'){const score=CULT.pathScores(n).filter(s=>s.path===n.cult.path),best=score[0];const own=score.find(s=>s.sub===k.id);return own&&best?clamp(80+(own.score-best.score)*2,0,100):30;}
 if(k.sub&&k.sub!==n.cult.sub)return -50;const t=CULT.tech(k.id),matching=!t.weaponTypes||M.conditionMatches(n,t);return 60+(matching?20:-15)+(HC.eff(n,'personality.curiosity')-50)*.15;
};
M.crystalDecision=(W,n,key)=>{
 const fit=M.knowledgeFit(n,key),e=M.eligible(n,key),loyalty=HC.eff(n,'personality.loyalty'),wealth=HC.eff(n,'values.wealthResource');
 if(e.ok&&fit>=45)return {action:'use',reason:'ตรงวิถีและความถนัด',fit};
 const k=M.knowledge(key),future=k&&n.cult&&n.cult.stage+1>=k.tier&&fit>=55;
 if(future&&wealth>45||fit>=65&&loyalty<45)return {action:'retain',reason:'เก็บไว้สำหรับขั้นถัดไป',fit};
 return {action:loyalty>35||(n.cp||0)<100?'donate':'retain',reason:fit<0?'ต่างสาย/เรียนซ้ำ':'สะสมแต้มแลกของจำเป็น',fit};
};
M.pickSubStudy=(W,n)=>(W.sect.subLibrary||[]).map(id=>({id,key:M.subKey(id)})).filter(x=>M.eligible(n,x.key).ok&&M.studyFee(W,x.key)<=(n.cp||0)&&subById[x.id].tier<=SECT.canLearnTier(W,n)).sort((a,b)=>M.knowledgeFit(n,b.key)-M.knowledgeFit(n,a.key)).find(x=>M.knowledgeFit(n,x.key)>=55)||null;
M.daily=W=>{
 M.ensure(W);
 for(const n of W.npcs){if(n.dead||n.away||n.exiled)continue;
  // At most one choice per held knowledge type per day; finite catalog bounds state/work.
  for(const key of Object.keys(n.inv.crystals)){const d=M.crystalDecision(W,n,key);if(d.action==='use')M.useCrystal(W,n,key);else if(d.action==='donate')M.donateCrystal(W,n,key);}
  for(const id of [...n.inv.subManuals]){const fit=M.knowledgeFit(n,M.subKey(id));if(fit<50||HC.eff(n,'personality.loyalty')>45||(n.cp||0)<100)M.donateManual(W,n,id,'sub');}
 }
};
// Extend native shop/donation/study actions, keeping shared validation at transaction boundaries.
const oldShop=CPE.shopItems;CPE.shopItems=W=>oldShop(W).concat(Object.entries(W.sect.crystals||{}).filter(x=>x[1]>0).map(([key,n])=>({kind:'crystal',key,n,price:M.crystalPrice(W,key)})));
const oldBuy=CPE.buy;CPE.buy=(W,n,p)=>p&&p.kind==='crystal'?M.buyCrystal(W,n,p.key,p.price).ok:oldBuy(W,n,p);
const oldPick=CPE.pickPurchase;CPE.pickPurchase=(W,n)=>{let best=oldPick(W,n),score=best?best.s:0;for(const [key,qty] of Object.entries(W.sect.crystals||{})){if(!qty||!(M.canAcquireKnowledge?M.canAcquireKnowledge(W,n,key):M.eligible(n,key).ok)||(n.inv.crystals&&n.inv.crystals[key]||0)>0)continue;const price=M.crystalPrice(W,key),fit=M.knowledgeFit(n,key),s=.65+fit/110-price/Math.max(40,n.cp||0)*.5;if(price<=(n.cp||0)*.9&&fit>=50&&s>score){best={kind:'crystal',key,price,why:'ผลึกตรงวิถี · ใช้ครั้งเดียว',s};score=s;}}return best;};
const oldName=ECO.name;ECO.name=id=>M.knowledge(id)?M.crystalName(id):oldName(id);
AI.ACTS.specialize={nameTh:'ศึกษาคัมภีร์สายย่อย',icon:'📜',color:'#a7c8f0',can:(n,W)=>!!M.pickSubStudy(W,n),score(n,W,S){const p=M.pickSubStudy(W,n);if(p)S.add('เลือกสายที่ถนัดถาวร',.9+M.knowledgeFit(n,p.key)/150);},where:(W,n)=>{const st=AI.freeStation(W,n,'read','scripture');return st?{st}:null;},dur:()=>240,done(n,W){const p=M.pickSubStudy(W,n);if(p)M.studySubpath(W,n,p.id);}};
const daily=g.CONTENT.daily;g.CONTENT.daily=W=>{daily(W);M.daily(W);};
const handover=g.EXPED.handover;g.EXPED.handover=(W,ex,alive,out)=>{
 if(ex.martialSettled||(ex.settlement&&ex.settlement.state==='settled')||(out.settlement&&out.settlement.state==='settled'))return handover(W,ex,alive,out);
 const accepted=handover(W,ex,alive,out);
 if(alive&&alive.length&&out.knowledge&&out.knowledge.length){M.ensure(W);for(const drop of out.knowledge){const key=drop.kind==='subManual'?M.subKey(drop.id):drop.id;const eligible=alive.slice().sort((a,b)=>M.knowledgeFit(b,key)-M.knowledgeFit(a,key));const owner=eligible[0];if(drop.kind==='subManual'){if(!owner.inv.subManuals.includes(drop.id))owner.inv.subManuals.push(drop.id);}else if(M.knowledge(key))M.storeCrystal(W,owner,key,1);out.notes=out.notes||[];out.notes.push(owner.h.name.given+' พบ'+(drop.kind==='subManual'?'คัมภีร์สาย'+subById[drop.id].nameTh:M.crystalName(key)));}}
 ex.martialSettled=true;return accepted;
};
// Defensive bounded JSON normalizer used only at save restore, never from UI/scorers.
M.returnKnowledge=(W,n)=>{M.ensure(W);for(const [key,qty] of Object.entries(n.inv.crystals)){const room=Math.max(0,999-(W.sect.crystals[key]||0)),put=Math.min(qty,room);W.sect.crystals[key]=(W.sect.crystals[key]||0)+put;if(qty>put){const overflow=W.sect.knowledgeOverflow||(W.sect.knowledgeOverflow={});overflow[key]=(overflow[key]||0)+qty-put;}}n.inv.crystals={};n.inv.crystalBought={};for(const id of n.inv.subManuals)if(!W.sect.subLibrary.includes(id))W.sect.subLibrary.push(id);n.inv.subManuals=[];};
M.restore=W=>{M.ensure(W);W.sect.crystals=cleanCounts(W.sect.crystals);W.sect.subLibrary=Array.from(new Set(W.sect.subLibrary.filter(id=>subById[id])));for(const n of W.npcs){n.inv.crystals=cleanCounts(n.inv.crystals);n.inv.subManuals=Array.from(new Set(n.inv.subManuals.filter(id=>subById[id])));}};
})(typeof globalThis!=='undefined'?globalThis:this);
