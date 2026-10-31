/* Living Jianghu v1.16: Gemini content adapted to the unchanged Human Foundation.
   All people are authoritative world.npcs records. No source gameplay shortcuts are imported. */
(function(root){'use strict';
const H=root.HumanCore||(typeof require==='function'?require('./human'):null);
const E=root.World2026Engine||(typeof require==='function'?require('./legacy/src/engine'):null);
const D=root.JianghuRealmData||(typeof require==='function'?require('./jianghu-data'):null);
const L=root.SectLifeSystem||(typeof require==='function'?require('./sect-life'):null);
const VERSION=1,HERB='MAT_HERB_DEW_GRASS_1',ORE='MAT_ORE_BLACK_IRON_1',CIN='MAT_ORE_CINNABAR_1';
const MARKET=L.MARKET,EXIT=L.EXIT,alive=n=>!!n&&n.alive&&n.health>0,point=n=>n.stageLocal||n,dist=(a,b)=>Math.hypot(point(a).x-point(b).x,point(a).y-point(b).y),clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x)),round=x=>Math.round(x*100)/100,copy=x=>JSON.parse(JSON.stringify(x)),short=x=>String(x||'').replace(/\s*\([^)]*\)/g,'');
const BEASTS=Object.values(D.SPIRIT_BEAST_CATALOG_V300);
const SITE_HERITAGE_MAP={
 SITE_SWORD_TOMB:'LEG_01',
 SITE_KUNLUN_GROTTO:'LEG_23',
 SITE_SERPENT_MARSH:'LEG_11',
 SITE_STAR_PAGODA:'LEG_02',
 SITE_THUNDER_RUIN:'LEG_06',
 SITE_DEMON_ABYSS:'LEG_10'
};
const SITES=D.SPECIAL_EXPEDITION_SITES_V300.map((d,i)=>({
 id:d.id,
 name:short(d.nameTh),
 icon:d.icon,
 guardian:d.guardianNameTh,
 power:d.guardianPower,
 danger:d.dangerLevel,
 duration:34+i*6,
 fee:12+i*2,
 material:d.lootTable.materials?.[0]?.matId||ORE,
 quantity:Math.min(4,d.lootTable.materials?.[0]?.count||3),
 scroll:!!d.lootTable.grantScroll,
 heritageLegacyId:SITE_HERITAGE_MAP[d.id]||'LEG_01'
}));
const FORTUNES=D.FORTUITOUS_SITE_TEMPLATES_V300.map((d,i)=>({id:d.archetypeId,name:short(d.nameTh),icon:d.icon,kind:d.rewardType,danger:d.dangerLevel,index:i}));
const FORMATIONS=Object.values(D.GRAND_FORMATIONS_CATALOG_V320).map((d,i)=>({id:d.id,name:short(d.shortTh||d.nameTh),specialty:i===0?'พิทักษ์ด้วยกระบี่':i===1?'รวมปราณเพื่อฝึกตน':'ประคองกายและบรรเทาปะทะ',combat:[.07,.015,.025][i],cultivation:[.02,.09,.025][i],protection:[0,0,.10][i],recovery:[0,0,.12][i]}));
const ROLE_DEFS={grandElder:{name:'มหาผู้อาวุโส',basis:'sectMaster',merit:24,count:7},lawElder:{name:'ผู้อาวุโสคุมกฎ',basis:'defend',merit:8,count:4},alchemyElder:{name:'เจ้าหอโอสถ',basis:'alchemy',merit:8,count:4},forgeElder:{name:'เจ้าโรงหลอม',basis:'forging',merit:8,count:5},scriptureElder:{name:'ผู้อาวุโสหอคัมภีร์',basis:'train',merit:8,count:6},externalElder:{name:'ผู้อาวุโสการค้า',basis:'trade',merit:8,count:6},chiefDisciple:{name:'ศิษย์เอก',basis:'hunt',merit:8,count:3}};
const PET_POSITIONS=[
 {x:1670,y:1980},
 {x:2330,y:1790},
 {x:1490,y:2440},
 {x:2800,y:1940},
 {x:2120,y:2510},
 {x:2920,y:1350},
 {x:3080,y:880},
 {x:1920,y:2120},
 {x:2560,y:1120}
];
function activity(id,label,basis,extra={}){H.registerActivity({...H.descriptor(basis),id,label,...extra});}
activity('seekFortune','แสวงโชควาสนาฟ้าดิน','scout',{skillDomain:'exploration',interestWeights:{exploration:.5,analysis:.3,nature:.2},cognitiveWeights:{attention:.3,spatialReasoning:.3,systemsThinking:.2,metacognition:.2},bodyWeights:{senseAcuity:.4,agility:.3,endurance:.3}});
activity('prepareExpedition','เตรียมบุกเบิกแดนลับ','scout',{skillDomain:'expedition',valueWeights:{freedom:.25,knowledgeCraft:.3,martialPeak:.25,wealthResource:.15},interestWeights:{exploration:.45,risk:.25,analysis:.2,exertion:.1},cognitiveWeights:{planning:.3,spatialReasoning:.3,metacognition:.3,workingMemory:.1}});
activity('departExpedition','เดินทางสู่แดนลับ','prepareExpedition');activity('returnExpedition','กลับจากแดนลับ','prepareExpedition');
activity('tameCompanion','ผูกพันธสัญญาอสูร','social',{skillDomain:'beastBond',valueWeights:{familyClan:.25,freedom:.2,martialPeak:.2,honorLegacy:.1},personalityWeights:{empathy:.35,caution:.15,discipline:.2},interestWeights:{nature:.45,care:.3,companionship:.25},bodyWeights:{coordination:.3,senseAcuity:.4,agility:.3},cognitiveWeights:{socialInsight:.35,attention:.3,planning:.2,metacognition:.15}});
activity('careCompanion','ดูแลอสูรคู่หู','tameCompanion',{interestWeights:{care:.6,nature:.4},needRelief:{social:.5,competence:.2}});
activity('discussDao','สนทนาธรรมถกมรรคา','social',{skillDomain:'scholarship',interestWeights:{companionship:.4,analysis:.35,expression:.25},cognitiveWeights:{verbalComprehension:.4,socialInsight:.3,systemsThinking:.3}});
activity('sparPeer','ประลองชี้แนะกระบวนท่า','hunt',{skillDomain:'sparring',valueWeights:{martialPeak:.4,honorLegacy:.2,sectDuty:.15},personalityWeights:{courage:.3,integrity:.2,discipline:.2},interestWeights:{competition:.45,practice:.35,exertion:.2},cognitiveWeights:{spatialReasoning:.4,attention:.3,metacognition:.3},bodyWeights:{coordination:.3,agility:.3,power:.2,durability:.2}});
activity('studyWithMentor','ขอคำชี้แนะจากอาจารย์','discussDao',{valueWeights:{knowledgeCraft:.4,martialPeak:.3,honorLegacy:.15},interestWeights:{practice:.4,analysis:.35,companionship:.25}});
activity('negotiateEnvoy','เจรจาไมตรีกับผู้แทนสำนัก','trade',{skillDomain:'diplomacy',valueWeights:{sectDuty:.3,honorLegacy:.25,knowledgeCraft:.15,wealthResource:.15},interestWeights:{exchange:.4,companionship:.3,expression:.3},cognitiveWeights:{socialInsight:.4,verbalComprehension:.3,reasoning:.3}});
activity('bidAuction','ร่วมประมูลของล้ำค่า','trade',{skillDomain:'bargaining',valueWeights:{wealthResource:.25,powerStatus:.2,martialPeak:.2,knowledgeCraft:.2},interestWeights:{exchange:.5,competition:.3,analysis:.2},cognitiveWeights:{numeracy:.4,planning:.3,metacognition:.3}});
activity('inscribeFormation','จารึกมหาค่ายกลพิทักษ์สำนัก','craft',{skillDomain:'formations',valueWeights:{knowledgeCraft:.4,sectDuty:.35,honorLegacy:.2},interestWeights:{analysis:.4,creation:.35,care:.25},cognitiveWeights:{systemsThinking:.4,spatialReasoning:.3,numeracy:.3},bodyWeights:{dexterity:.6,coordination:.4}});
activity('honorAncestors','จุดธูปรำลึกบรรพชนผู้ล่วงลับ','social',{skillDomain:'remembrance',valueWeights:{honorLegacy:.4,familyClan:.3,sectDuty:.2},interestWeights:{tranquility:.4,care:.3,companionship:.3}});
for(const [id,d] of Object.entries(ROLE_DEFS)){d.activity='office:'+id;L.ROLES[id]={name:d.name,activity:d.activity};activity(d.activity,d.name,d.basis,{skillDomain:'administration',valueWeights:{sectDuty:.35,honorLegacy:.2,powerStatus:.2,freedom:-.15}});}

class LivingJianghu{
 constructor(g){this.g=g;this.ensure();}
 get data(){return this.g.s.realm;}
 cache(id){const o={id,jianghu:{}};E.ensureOwnerLedgerV140(this.g.world,o);E.setSpiritStonesV140(o,0);return o;}
 ensure(){const g=this.g;if(g.s.realm&&g.s.realm.schemaVersion!==VERSION)throw Error('เซฟใช้ระบบยุทธภพที่เกมนี้อ่านไม่ได้');
  if(!g.s.realm){const s=g.s.realm={schemaVersion:VERSION,createdAt:g.s.t,nextId:1,fortuneCursor:0,nextThink:g.s.t+1,nextFortuneAt:g.s.t+50,nextVisitorAt:g.s.t+120,journeys:[],fortunes:[],pets:[],factions:[],envoyIds:[],auctions:[],lineages:[],meetings:[],formation:null,formationOrder:null,travelFund:0,marketFund:0,journal:[],receipts:[],lastDay:Math.floor(g.s.t/20)};
   s.sites=SITES.map((d,i)=>{const o=this.cache('realm-cache-site-'+d.id);g.add(o,d.material,d.quantity*3,'BOUNDED_RUIN_CACHE');g.add(o,HERB,3,'BOUNDED_RUIN_CACHE');E.setSpiritStonesV140(o,60+i*12);return {id:d.id,remaining:3,cache:o,visitedBy:[],nextVisitAt:0};});
   s.factions=D.EXTERNAL_SECTS_TEMPLATES_V300.map((d,i)=>{const o=this.cache('realm-faction-'+d.id);g.add(o,ORE,12,'REGIONAL_START_STOCK');g.add(o,CIN,6,'REGIONAL_START_STOCK');g.add(o,HERB,8,'REGIONAL_START_STOCK');E.setSpiritStonesV140(o,150);return {id:d.id,name:short(d.nameTh),short:short(d.shortTh),icon:d.icon,alignment:d.alignment,relation:d.id==='SG'?g.s.life.pavilionRelation:d.initialRelation,cache:o,delegateId:null,invitation:null,lastVisitAt:-300,production:0};});
   for(let i=0;i<Math.min(BEASTS.length,PET_POSITIONS.length);i++)s.pets.push(this.makePet(BEASTS[i],PET_POSITIONS[i]));
  }
  const s=this.data;if(!Array.isArray(s.sites)||!Array.isArray(s.pets)||!Array.isArray(s.journeys)||!Array.isArray(s.factions)||!Array.isArray(s.auctions)||!Number.isFinite(s.travelFund)||s.travelFund<0||!Number.isFinite(s.marketFund)||s.marketFund<0)throw Error('ข้อมูลยุทธภพไม่ครบ');
  if(!Number.isFinite(s.fortuneCursor))s.fortuneCursor=0;
  for(let i=0;i<Math.min(BEASTS.length,PET_POSITIONS.length);i++){
   if(!s.pets.some(p=>p.speciesId===BEASTS[i].id)){
    s.pets.push(this.makePet(BEASTS[i],PET_POSITIONS[i]));
   }
  }
  for(const id of Object.keys(ROLE_DEFS))if(!Object.hasOwn(g.s.life.offices,id))g.s.life.offices[id]=null;
  return s;
 }
 id(prefix){return prefix+'-'+this.data.nextId++;}
 log(title,text,ids=[]){const row={id:this.id('chronicle'),t:this.g.s.t,title,text,npcIds:ids};this.data.journal.unshift(row);this.data.journal.splice(120);this.g.note(title+' · '+text);return row;}
 receipt(kind,data){const row={id:this.id('receipt'),t:this.g.s.t,kind,...data};this.data.receipts.unshift(row);this.data.receipts.splice(140);return row;}
 speak(n,text,kind='life'){if(!alive(n)||!n.stageLocal)return;n.stageLocal.speech={text,kind,at:this.g.s.t,until:this.g.s.t+7};}
 get visitors(){return this.data.envoyIds.map(id=>this.g.world.npcs[id]).filter(Boolean);}
 origin(n){const f=this.data.factions.find(f=>f.id===n.stageLocal?.originSectId);return f?.name||null;}
 petFor(n){return this.data.pets.find(p=>p.ownerId===n.id&&p.alive)||null;}
 makePet(d,p){return {id:'companion-'+d.id,speciesId:d.id,name:short(d.nameTh),icon:d.icon,tier:d.tier,health:Math.min(120,d.baseHp),maxHP:Math.min(120,d.baseHp),power:Math.round(d.combatPower*.4),alive:true,ownerId:null,trust:20,hunger:15,attackAt:0,bondAt:null,home:{...p},stageLocal:{...p,pet:true,mode:'wild',route:[],offmap:null},cooldowns:{}};}
 get combatPets(){return this.data.pets.filter(p=>p.ownerId&&p.alive&&alive(this.g.world.npcs[p.ownerId])&&!p.stageLocal.offmap);}
 transferMaterial(from,to,id,q,origin,opts={}){
  if(this.g.transferMaterialStack)return this.g.transferMaterialStack(from,to,id,q,origin,opts).moved;
  q=Math.max(0,Math.min(q,this.g.count(from,id)));if(!Number.isInteger(q)||q<=0)return 0;
  if(this.g.world.npcs[to.id]?.core?.human&&!this.g.isSectStorage?.(to))q=Math.min(q,Math.max(0,H.carryLimit(to)-H.load(to)));
  if(q<=0)return 0;const r=this.g.add(to,id,q,origin,opts);if(!r.ok)return 0;this.g.consume(from,id,q);return q;
 }
 transferMoney(from,to,q){if(!Number.isFinite(q)||q<0||E.getSpiritStonesV140(from)<q)return false;E.addSpiritStonesV140(from,-q);E.addSpiritStonesV140(to,q);return true;}
 support(kind){const s=this.data,field=kind==='travel'?'travelFund':kind==='market'?'marketFund':null;if(!field)return {ok:false,reason:'ไม่รู้จักกองทุน'};if(s[field]+60>180)return {ok:false,reason:'มีเงินสำรองเพียงพอแล้ว'};if(!this.g.money(-60,'สำรอง'+(kind==='travel'?'การเดินทาง':'จัดหาของจากตลาด')))return {ok:false,reason:'ต้องใช้ 60 ศิลา'};s[field]+=60;return {ok:true};}
 refund(kind){const field=kind==='travel'?'travelFund':kind==='market'?'marketFund':null;if(!field||this.data[field]<=0)return {ok:false,reason:'ไม่มีเงินที่ยังไม่ใช้'};const q=this.data[field];this.data[field]=0;this.g.money(q,'คืนกองทุนที่ยังไม่ผูกพัน');return {ok:true,amount:q};}
 electOfficers(candidates){const g=this.g,s=g.s.life,used=new Set([s.offices.master,s.offices.steward].filter(Boolean).map(o=>o.npcId));for(const [id,d] of Object.entries(ROLE_DEFS)){s.offices[id]=null;const eligible=candidates.filter(n=>!used.has(n.id)&&g.life.member(n)?.merit>=d.merit&&g.heroes.filter(alive).length>=d.count);const willing=eligible.map(n=>g.life.offer(n,id)).filter(o=>o.accepted).sort((a,b)=>b.capacity-a.capacity||a.npcId.localeCompare(b.npcId));if(willing[0]){s.offices[id]={npcId:willing[0].npcId,since:g.s.t,capacity:willing[0].capacity};used.add(willing[0].npcId);this.speak(g.world.npcs[willing[0].npcId],'ข้าจะรับผิดชอบหน้าที่'+d.name,'office');}}
  g.life?.syncLegacyPositions?.();
 }
 roleAdjustment(n,action){const offices=this.g.s.life.offices,map={chiefDisciple:{sparPeer:12,hunt:8,defend:10,patrolSect:10},lawElder:{defend:12,aidCourier:8,patrolSect:12},alchemyElder:{craft:10,herb:10,brewTeaDao:8},forgeElder:{craft:10,mine:10},scriptureElder:{discussDao:14,studyWithMentor:10,train:5,copyScripture:12,comprehendTablet:10},externalElder:{negotiateEnvoy:16,bidAuction:8,trade:10},grandElder:{discussDao:10,defend:10,comprehendTablet:8}};let v=0;for(const [id,weights] of Object.entries(map))if(offices[id]?.npcId===n.id&&this.g.life.available(n))v+=weights[action]||0;return v;}
 hasRecentMeeting(aId,bId,action,window=55){
  const key=[aId,bId].sort().join('|')+'|'+action;
  return this.data.meetings.some(m=>m.key===key&&this.g.s.t-m.t<window);
 }
 options(n,add){const g=this.g,s=this.data,p=n.stageLocal;if(!alive(n)||p.offmap||p.journey||p.action==='seclusion')return;const danger=g.nearestEnemy(n,500);if(danger||n.health<45)return;
  for(const f of s.fortunes.filter(f=>!f.claimed&&f.expiresAt>g.s.t&&n.health>=80&&n.core.condition.fatigue<55&&p.needs.hunger<65&&!this.threatAt(f,450,n)))add('seekFortune',48+(H.liking(n,'seekFortune')>65?8:0),f,7,{}, {realmTarget:f.id,risk:f.danger,reason:'ออกสำรวจจุดวาสนา '+f.name+' · ลุ้นรับคัมภีร์และสมบัติฟ้าดิน'});
  if(n.health>70&&n.core.condition.fatigue<65&&(s.travelFund>=12||E.getSpiritStonesV140(n)>=60))for(const d of SITES){const site=s.sites.find(x=>x.id===d.id);if(site.remaining<=0||site.nextVisitAt>g.s.t||s.journeys.some(j=>j.npcId===n.id&&j.siteId===d.id&&g.s.t-j.createdAt<160))continue;const risk=this.journeyRisk(n,d);if(risk>.8)continue;const hall=g.built('hall');const stSlot=g.progression?.inspectSlotAndComboState?.(n);const pathSiteMatch=(d.id==='SITE_SWORD_TOMB'&&(/SWORD|HEART_SOUL/.test((n.jianghu.subPath||'')+' '+(n.jianghu.path||''))))||(d.id==='SITE_THUNDER_RUIN'&&(/THUNDER|BODY|SOLAR|TITAN|TIGER/.test((n.jianghu.subPath||'')+' '+(n.jianghu.path||''))))||(d.id==='SITE_DEMON_ABYSS'&&(/DEMON|BLOOD|VENOM|NETHER/.test((n.jianghu.subPath||'')+' '+(n.jianghu.path||''))))||(d.id==='SITE_STAR_PAGODA'&&(/ASTRAL|ZITHER|FATE|SCHOLAR|ORACLE/.test((n.jianghu.subPath||'')+' '+(n.jianghu.path||''))));const artSeekBonus=((stSlot?.openAttackSlots>0||stSlot?.unpairedSetups?.length)?6:0)+(pathSiteMatch?6:0);if(hall)add('prepareExpedition',45+artSeekBonus+(g.s.policy==='trade'?15:g.s.policy==='defend'?-12:0),g.endpoint(hall),6,{}, {realmTarget:d.id,risk:Math.round(risk*100),reason:d.name+(pathSiteMatch?' · แหล่งมรดกตรงสายวิชาของตน':'')+' · เสบียง 2 · ค่าทาง '+d.fee+' ศิลา · มีโอกาสพบคัมภีร์โบราณ'});}
  const pet=this.petFor(n);if(!pet&&n.health>=80&&p.needs.hunger<60&&n.core.condition.fatigue<50&&g.s.food>=2&&g.count(n,HERB)>0)for(const a of s.pets.filter(a=>a.alive&&!a.ownerId&&!this.threatAt(a,400,n)&&(!a.cooldowns[n.id]||a.cooldowns[n.id]<=g.s.t)))add('tameCompanion',54,a.stageLocal,9,{}, {realmTarget:a.id,risk:22,reason:'ผูกพันธสัญญา'+a.name+' · ใช้สมุนไพร 1 อาหาร 2'});
  if(pet&&(pet.hunger>45||pet.health<pet.maxHP*.75)&&g.s.food>0){const b=g.built('sanctuary')||g.built('hall');if(b)add('careCompanion',45+pet.hunger*.5,g.endpoint(b),6,{}, {realmTarget:pet.id,reason:'ให้อาหารดูแลอสูรคู่หูจากเสบียงสำนัก'});}
  const peers=g.heroes.filter(q=>q.id!==n.id&&alive(q)&&!q.stageLocal.offmap&&!q.stageLocal.journey&&q.stageLocal.action!=='seclusion'&&dist(n,q)<900);const peer=peers.sort((a,b)=>dist(n,a)-dist(n,b)||a.id.localeCompare(b.id))[0];
  if(peer&&n.core.condition.fatigue<65){
   if(!this.hasRecentMeeting(n.id,peer.id,'discussDao'))add('discussDao',25+p.needs.social*.4,peer.stageLocal,8,{}, {realmTarget:peer.id,reason:'พบ '+peer.name+' เพื่อสนทนาธรรมแลกเปลี่ยนความเข้าใจเต๋า'});
   if(n.health>80&&peer.health>80&&!this.hasRecentMeeting(n.id,peer.id,'sparPeer'))add('sparPeer',29,peer.stageLocal,8,{}, {realmTarget:peer.id,risk:8,reason:'ชวน '+peer.name+' ประลองชี้แนะกระบวนท่า'});
  }
  const mentor=g.world.npcs[n.jianghu.masterId];if(mentor&&alive(mentor)&&!mentor.stageLocal.offmap&&!mentor.stageLocal.journey&&mentor.stageLocal.action!=='seclusion'&&!this.hasRecentMeeting(n.id,mentor.id,'studyWithMentor'))add('studyWithMentor',47,mentor.stageLocal,9,{}, {realmTarget:mentor.id,reason:'ขอคำชี้แนะจากอาจารย์ '+mentor.name});
  for(const v of this.visitors.filter(v=>alive(v)&&v.stageLocal.envoy?.phase==='waiting'))if(!v.stageLocal.envoy.met[n.id]||g.s.t-v.stageLocal.envoy.met[n.id]>70)add('negotiateEnvoy',48,v.stageLocal,8,{}, {realmTarget:v.id,reason:'เจรจาไมตรีและแลกเปลี่ยนกับ '+(this.origin(v)||v.name)});
  for(const lot of s.auctions.filter(l=>l.phase==='open'&&l.closesAt>g.s.t&&l.bid?.npcId!==n.id)){const owner=g.world.npcs[lot.ownerId];if(!alive(owner)||lot.ownerId===n.id||E.getSpiritStonesV140(n)+(g.s.heroIds.includes(n.id)?s.marketFund:0)<(lot.bid?.amount+4||lot.minimum))continue;add('bidAuction',39,MARKET,3,{}, {realmTarget:lot.id,reason:'ร่วมประมูล '+lot.name+' · ราคาปัจจุบัน '+(lot.bid?.amount||lot.minimum)+' ศิลา'});}
  if(s.formationOrder?.status==='funded'){const b=g.built('shrine')||g.built('hall');if(b)add('inscribeFormation',57,g.endpoint(b),12,{}, {realmTarget:s.formationOrder.id,reason:'จารึกค่ายกลพิทักษ์สำนัก · ใช้ชาด 3 แร่ 3'});}
  const shrine=g.built('shrine');if(shrine&&n.core.human.state.grief>12&&g.count(n,HERB)>0)add('honorAncestors',45+n.core.human.state.grief*.4,g.endpoint(shrine),8,{}, {realmTarget:shrine.id,reason:'รำลึกถึงผู้ล่วงลับ ณ หอสืบทอด'});
 }
 factionRelation(f){return f.id==='SG'?this.g.s.life.pavilionRelation:f.relation;}
 journeyRisk(n,d){const a=this.petFor(n),petPower=a&&a.health>30&&a.hunger<80&&dist(n,a)<220?this.g.power(a)*.4:0,power=this.g.power(n)+petPower,capacity=H.capacity(n,'prepareExpedition'),escort=this.g.progression?.equippedEscortBonus?.(n)||0,i=SITES.findIndex(x=>x.id===d.id),f=this.data.factions[i];return clamp(d.power/(power+d.power)*.8+.10-(capacity.cognition-50)*.002-(f?this.factionRelation(f)*.0007:0)-escort*.35,.08,.88);}
 threatAt(p,r=400,actor=null){
  const g=this.g;
  const hostiles=[...g.enemies.filter(alive),...g.s.beasts.filter(b=>g.isHostileCreature?g.isHostileCreature(b):(b.alive&&!b.sanctuaryResident&&b.hostile!==false))].filter(e=>dist(e,p)<r);
  if(!hostiles.length)return false;
  if(!actor||!alive(actor))return true;
  const healthRatio=clamp((actor.health||100)/100,.2,1),fatiguePenalty=clamp(1-(actor.core?.condition?.fatigue||0)*.004,.55,1);
  const pet=this.petFor(actor),petPower=pet&&pet.alive&&pet.health>25&&pet.hunger<80&&dist(actor,pet)<240?g.power(pet)*.45:0;
  const allies=g.heroes.filter(h=>h.id!==actor.id&&alive(h)&&!h.stageLocal?.offmap&&dist(h,p)<Math.min(360,r)).reduce((s,h)=>s+g.power(h)*.35,0);
  const towerSupport=(g.s.buildings||[]).some(b=>b.type==='tower'&&b.hp>0&&b.remaining<=0&&dist(b,p)<420)?180:0;
  const effectiveActorPower=(g.power(actor)*healthRatio*fatiguePenalty)+petPower+allies+towerSupport;
  const rawHostilePower=hostiles.reduce((sum,e)=>{
   const ep=g.power(e);
   const pursuing=e.target===actor.id||dist(e,actor)<165?1.25:1;
   return sum+ep*pursuing;
  },0);
  const groupMult=1+Math.max(0,hostiles.length-1)*.22;
  const totalThreat=rawHostilePower*groupMult;
  const caution=(actor.personality?.caution??50),courage=(actor.personality?.courage??50);
  const safetyMargin=.72+(caution-50)*.004-(courage-50)*.003;
  return totalThreat>effectiveActorPower*clamp(safetyMargin,.50,.98);
 }
 cancelPreparedExpedition(n,j){
  if(!j||j.phase!=='toExit'||j.refunded)return;
  j.refunded=true;j.phase='cancelled';j.outcome='cancelled';j.cancelledAt=this.g.s.t;
  if(j.funder===n.id)E.addSpiritStonesV140(n,j.paid||0);else this.data.travelFund+=j.paid||0;
  this.g.s.food+=j.food||0;const site=this.data.sites.find(s=>s.id===j.siteId);if(site)site.remaining++;
  n.stageLocal.journey=null;this.receipt('journeyCancelled',{npcId:n.id,journeyId:j.id,reason:'สุขภาพหรือสภาพร่างกายเปลี่ยนก่อนออกจากหุบเขา',refundedStones:j.paid||0,refundedFood:j.food||0});
 }
 finish(n,action){const g=this.g,s=this.data,p=n.stageLocal,id=p.realmTarget,fail={handled:true,success:false};
  if(action==='prepareExpedition'){if(!alive(n)||n.health<=70||n.core.condition.fatigue>=65||(p.needs?.hunger||0)>75)return fail;const d=SITES.find(d=>d.id===id),site=s.sites.find(d=>d.id===id),hall=g.built('hall');if(!d||!site||site.remaining<=0||!hall||dist(p,g.endpoint(hall))>140||g.s.food<2||p.journey)return fail;const personal=E.getSpiritStonesV140(n)>=d.fee&&E.getSpiritStonesV140(n)>=60;if(!personal&&s.travelFund<d.fee)return fail;if(personal)E.addSpiritStonesV140(n,-d.fee);else s.travelFund-=d.fee;g.s.food-=2;site.remaining--;site.nextVisitAt=g.s.t+30;const j={id:this.id('journey'),npcId:n.id,siteId:d.id,createdAt:g.s.t,phase:'toExit',paid:d.fee,funder:personal?n.id:'travelFund',food:2,resolved:false,outcome:null,loot:[]};s.journeys.unshift(j);s.journeys.splice(80);p.journey=j.id;g.send(n,'departExpedition',EXIT,1);this.speak(n,'เสบียงพร้อมแล้ว ข้าจะออกเดินทางไปสำรวจ'+d.name,'journey');this.receipt('journeyPreparation',{npcId:n.id,siteId:d.id,stones:d.fee,food:2});return {handled:true,success:true,keepAction:true};}
  if(action==='departExpedition'){const j=s.journeys.find(j=>j.id===p.journey),d=SITES.find(d=>d.id===j?.siteId);if(!j||j.phase!=='toExit'||!d)return fail;if(!alive(n)||n.health<=70||n.core.condition.fatigue>=65||(p.needs?.hunger||0)>75){this.cancelPreparedExpedition(n,j);return fail;}if(dist(p,EXIT)>125)return fail;const pet=this.petFor(n);j.petId=pet&&dist(n,pet)<180?pet.id:null;j.phase='away';j.departedAt=g.s.t;j.returnAt=g.s.t+d.duration;p.offmap={kind:'realmJourney',until:j.returnAt,journeyId:j.id};p.mode='offmap';p.target=null;p.route=[];n.currentCityId=null;this.log('ออกเดินทางสู่แดนลับ',n.name+' ก้าวพ้นด่านมุ่งหน้าสู่'+d.name,[n.id]);return {handled:true,success:true,keepAction:true};}
  if(action==='returnExpedition'){const j=s.journeys.find(j=>j.id===p.journey);if(!j||j.phase!=='returning'||dist(p,MARKET)>140)return fail;j.phase='complete';j.completedAt=g.s.t;p.journey=null;g.life.credit(n,j.outcome==='success'?4:1,'กลับจากแดนลับด้วยตนเอง');this.speak(n,j.outcome==='success'?'ข้ากลับมาแล้ว วาสนาและคัมภีร์ที่พบยังอยู่ในสัมภาระ':'ข้าจดจำอันตรายในแดนลับนั้นไว้เป็นบทเรียนแล้ว','journey');this.log('กลับถึงตลาด',n.name+' กลับจาก'+SITES.find(d=>d.id===j.siteId).name+' · '+(j.outcome==='success'?'นำของกลับมาจริง':'บาดเจ็บและได้บทเรียน')+(j.scroll?' · นำคัมภีร์'+(j.scroll.rarityBadgeTh?'ระดับ'+j.scroll.rarityBadgeTh:'')+' «'+j.scroll.nameTh+'» กลับมารอศึกษาและถ่ายทอด':''),[n.id]);return {handled:true,success:true};}
  if(action==='seekFortune'){const f=s.fortunes.find(f=>f.id===id);if(!f||f.claimed||f.expiresAt<=g.s.t||dist(p,f)>125)return fail;if(g.progression)return g.progression.claimFortune(n,f);const transfers=[];for(const z of [...f.cache.jianghu.ledgerV140.materialStacks]){const q=this.transferMaterial(f.cache,n,z.matId,z.count,'FORTUNE_'+f.id);if(q)transfers.push({material:z.matId,quantity:q});}if(f.kind==='QI_SURGE_AND_HEAL'&&f.charges>0){f.charges--;n.health=Math.min(100,n.health+22*H.recovery(n));H.recover(n,12);E.applyNpcCultivationProgressGain(g.world,n,3);}else if(f.kind==='ANCIENT_SCROLL'&&f.charges>0){f.charges--;this.learnScroll(n,'จารึกที่'+f.name,{danger:f.danger});}if(!transfers.length&&f.charges>0){f.charges--;E.recordTrackDaoEvidenceV1200(g.world,n,'EXPLORATION',4);}f.claimed=true;f.claimedBy=n.id;f.claimedAt=g.s.t;H.learn(n,'seekFortune',2);g.remember(n,'seekFortune',7,'ค้นพบ'+f.name+'ด้วยตนเอง');g.life.credit(n,3,'สำรวจ'+f.name);this.receipt('fortune',{npcId:n.id,fortuneId:f.id,transfers});this.speak(n,'วาสนาแห่งฟ้าดิน! ข้าพบ'+f.name+'แล้ว','discovery');return {handled:true,success:true,cooldown:110};}
  if(action==='tameCompanion'){const a=s.pets.find(a=>a.id===id),d=BEASTS.find(d=>d.id===a?.speciesId);if(!a||!d||!a.alive||a.ownerId||this.petFor(n)||dist(n,a)>125||g.s.food<2||g.count(n,HERB)<1)return fail;g.consume(n,HERB,1);g.s.food-=2;const chance=clamp(.22+H.capacity(n,'tameCompanion').total*.006+(n.personality.empathy-50)*.003-d.tameDifficulty*.004,.12,.88),roll=g.rng.next(),success=roll<chance;a.cooldowns[n.id]=g.s.t+55;a.trust=clamp(a.trust+(success?35:5));if(success){a.ownerId=n.id;a.bondAt=g.s.t;a.stageLocal.mode='follow';a.hunger=20;H.learn(n,'tameCompanion',3);g.life.credit(n,3,'ผูกมิตรอสูรโดยดูแลจริง');this.log('สายสัมพันธ์ใหม่',n.name+' ได้รับการยอมรับจาก'+a.name,[n.id]);this.speak(n,'นับแต่นี้ข้าจะดูแลเจ้าเอง '+a.name,'companion');}else{g.damage(n,3,null);g.remember(n,'tameCompanion',-5,a.name+' ยังไม่ไว้วางใจ');this.speak(n,'เขายังระแวงข้าอยู่ ต้องค่อยเป็นค่อยไป','companion');}this.receipt('taming',{npcId:n.id,petId:a.id,success,chance,roll,herb:1,food:2});return {handled:true,success,cooldown:50};}
  if(action==='careCompanion'){const a=s.pets.find(a=>a.id===id),b=g.built('sanctuary')||g.built('hall');if(!a||a.ownerId!==n.id||!a.alive||!b||dist(p,g.endpoint(b))>140||g.s.food<1)return fail;g.s.food--;a.hunger=Math.max(0,a.hunger-60);const own=n.jianghu.ledgerV140.beastItems||[],shared=g.bank.jianghu.ledgerV140.beastItems||[],item=[...own,...shared].find(i=>i.count>0&&(i.effect?.healCompanion||i.effect?.trustGain)&&!i.effect?.lureRareBeast);if(item)item.count--;a.health=Math.min(a.maxHP,a.health+16+(item?.effect?.healCompanion||0));a.trust=clamp(a.trust+3+(item?.effect?.trustGain||0));this.speak(n,'กินให้อิ่มก่อนสหายยาก แล้วค่อยออกท่องยุทธภพต่อ','companion');this.receipt('petCare',{npcId:n.id,petId:a.id,food:1,itemId:item?.id||null,itemEffect:item?.effect||null});return {handled:true,success:true};}
  if(['discussDao','sparPeer','studyWithMentor'].includes(action))return this.finishMeeting(n,action,id);
  if(action==='negotiateEnvoy')return this.finishParley(n,id);
  if(action==='bidAuction')return {handled:true,success:this.bid(n,id).ok};
  if(action==='inscribeFormation'){const order=s.formationOrder,b=g.built('shrine')||g.built('hall');if(!order||order.id!==id||order.status!=='funded'||!b||dist(p,g.endpoint(b))>140||g.count(g.bank,CIN)<3||g.count(g.bank,ORE)<3)return fail;g.consume(g.bank,CIN,3);g.consume(g.bank,ORE,3);order.status='complete';const d=FORMATIONS.find(d=>d.id===order.formationId),capacity=H.capacity(n,action).total+(g.progression?.equippedCraftBonus?.(n,'ARRAY')||0);s.formation={id:d.id,name:d.name,specialty:d.specialty,by:n.id,createdAt:g.s.t,expiresAt:g.s.t+120,combat:round(d.combat+capacity*.0004),cultivation:round(d.cultivation+capacity*.0004),protection:d.protection,recovery:d.recovery,lastUpkeepAt:g.s.t,center:{x:b.x,y:b.y}};this.receipt('formation',{npcId:n.id,stones:order.budget,ore:3,cinnabar:3,expiresAt:s.formation.expiresAt});this.log('ค่ายกลก่อตัว',n.name+' จารึก'+s.formation.name+' สำเร็จ แผ่ม่านปราณคุ้มครองสำนัก',[n.id]);return {handled:true,success:true};}
  if(action==='honorAncestors'){const b=g.built('shrine');if(!b||dist(p,g.endpoint(b))>140||!g.consume(n,HERB,1))return fail;n.core.human.state.grief=Math.max(0,n.core.human.state.grief-12);this.speak(n,'ปณิธานของบรรพชนผู้ล่วงลับ ข้าจะสืบทอดต่อไป','remembrance');return {handled:true,success:true};}
  return null;
 }
 handleOffmap(n){const p=n.stageLocal;if(p.offmap?.kind!=='realmJourney')return false;const j=this.data.journeys.find(j=>j.id===p.offmap.journeyId);if(!j)throw Error('การเดินทางอ้างอิงบันทึกที่หายไป');if(this.g.s.t<j.returnAt)return true;if(!j.resolved)this.resolveJourney(n,j);if(!alive(n))return true;p.offmap=null;n.currentCityId=this.g.city;p.x=EXIT.x;p.y=EXIT.y;j.phase='returning';this.g.send(n,'returnExpedition',MARKET,1);return true;}
 deliverExpeditionMaterial(n,d,matId,qty,sourceLabel){
  const g=this.g;
  const def=(E.PATCH140_DATA?.MATERIALS_REGISTRY_V140||[]).find(m=>m.id===matId);
  const isTrans=!!def?.isTranscendent;
  const opts=isTrans
   ? {originType:'HERITAGE_SITE',originId:d.heritageLegacyId||'LEG_01',originLabelTh:'มรดกแดนลับ '+d.name,isTranscendent:true}
   : {originType:'EXPEDITION_SITE',originId:d.id,originLabelTh:sourceLabel||('แดนลับ '+d.name)};
  const freeCarry=n?.core?.human?Math.max(0,H.carryLimit(n)-H.load(n)):qty;
  const toNpc=Math.min(qty,freeCarry);
  let personalAdded=0,warehouseAdded=0;
  if(toNpc>0){
   const r=g.add(n,matId,toNpc,sourceLabel,opts);
   if(r.ok)personalAdded=toNpc;
  }
  const rem=qty-personalAdded;
  if(rem>0){
   const rb=g.add(g.bank,matId,rem,sourceLabel,opts);
   if(rb.ok)warehouseAdded=rem;
  }
  return {
   material:matId,
   quantity:personalAdded+warehouseAdded,
   personal:personalAdded,
   warehouse:warehouseAdded,
   isTranscendent:isTrans,
   originId:opts.originId,
   status:personalAdded===qty?'PERSONAL':(personalAdded+warehouseAdded>0?'WAREHOUSE_OVERFLOW':'STORAGE_FULL')
  };
 }
 settleExpeditionRecipeReward(n,d,recipeId){
  const g=this.g,reg=g.world?.jianghu?.systemsV140?.recipes?.registry;
  const rec=reg?.[recipeId];
  if(!rec)return null;
  n.jianghu.knownRecipeIdsV140=n.jianghu.knownRecipeIdsV140||[];
  const alreadyKnown=n.jianghu.knownRecipeIdsV140.includes(recipeId);
  if(!alreadyKnown)n.jianghu.knownRecipeIdsV140.push(recipeId);
  rec.knowers=[...new Set([...(rec.knowers||[]),n.id])];
  rec.authorizedLearners=[...new Set([...(rec.authorizedLearners||[]),n.id])];
  const artisan=rec.craftPath==='ALCHEMY'?g.alchemist:g.smith;
  if(artisan?.jianghu){
   artisan.jianghu.knownRecipeIdsV140=artisan.jianghu.knownRecipeIdsV140||[];
   if(!artisan.jianghu.knownRecipeIdsV140.includes(recipeId))artisan.jianghu.knownRecipeIdsV140.push(recipeId);
   rec.knowers=[...new Set([...(rec.knowers||[]),artisan.id])];
   rec.authorizedLearners=[...new Set([...(rec.authorizedLearners||[]),artisan.id])];
  }
  let craftedItem=null,status=alreadyKnown?'RECIPE_REINFORCED':'RECIPE_LEARNED';
  if(rec.outputType==='EQUIPMENT'){
   const eq={
    id:this.id('expedition-relic'),
    recipeId:rec.id,
    catalogId:rec.id,
    nameTh:rec.outputNameTh||rec.nameTh,
    slot:rec.outputSubSlot||'WEAPON',
    tier:rec.tier||3,
    minStageReq:Math.max(1,(rec.tier||3)-1),
    quality:'REFINED',
    compatiblePath:rec.compatiblePath||'ANY',
    durability:100,
    maxDurability:100,
    combatMult:rec.effect?.combatMult||.14,
    defenseMult:rec.effect?.defenseMult||.05,
    studyBonus:rec.effect?.studyBonus||0,
    originType:'HERITAGE_SITE',
    originId:d.heritageLegacyId||'LEG_01',
    originLabelTh:'ศาสตราโบราณจาก'+d.name
   };
   root.JianghuExpansionV112?.imbueEquipmentDepth?.(eq,g.rng);
   if(n.jianghu.ledgerV140.equipmentItems.length<12){
    n.jianghu.ledgerV140.equipmentItems.push(eq);
    E.syncLegacyArraysFromLedgerV140?.(n);
    craftedItem=eq;
    status='RELIC_ACQUIRED';
   }else if(g.bank.jianghu.ledgerV140.equipmentItems.length<120){
    g.bank.jianghu.ledgerV140.equipmentItems.push(eq);
    E.syncLegacyArraysFromLedgerV140?.(g.bank);
    craftedItem=eq;
    status='RELIC_WAREHOUSE';
   }
  }
  return {recipeId,nameTh:rec.outputNameTh||rec.nameTh,status,itemId:craftedItem?.id||null};
 }
 resolveJourney(n,j){if(j.resolved)return;const g=this.g,d=SITES.find(d=>d.id===j.siteId),site=this.data.sites.find(d=>d.id===j.siteId);j.resolved=true;j.risk=this.journeyRisk(n,d);j.roll=g.rng.next();j.outcome=j.roll<j.risk?'setback':'success';j.hpBefore=n.health;const damage=j.outcome==='setback'?20+g.rng.int(0,25)+Math.max(0,d.power/g.power(n)-1)*15:5+g.rng.int(0,12);g.damage(n,damage,null);if(!alive(n)){j.phase='dead';j.outcome='died';n.stageLocal.journey=null;this.log('ข่าวร้ายจากแดนลับ',n.name+' สิ้นชีพในการสำรวจ'+d.name,[n.id]);return;}if(j.outcome==='success'){for(const [id,q] of [[d.material,d.quantity],[HERB,1]]){const count=this.transferMaterial(site.cache,n,id,q,'RUIN_'+d.id);if(count)j.loot.push({material:id,quantity:count,status:'PERSONAL'});else{const fallback=this.transferMaterial(site.cache,g.bank,id,q,'RUIN_'+d.id);if(fallback)j.loot.push({material:id,quantity:fallback,status:'WAREHOUSE_OVERFLOW'});}}const bonusTr=root.JianghuExpansionV112?.rollExpeditionTreasure?.(d.id,g.rng);if(bonusTr?.matId){const deliv=this.deliverExpeditionMaterial(n,d,bonusTr.matId,bonusTr.count,'EXPEDITION_POOL_'+d.id);if(deliv.quantity>0)j.loot.push(deliv);}if(bonusTr?.equipmentRecipeId){const recReward=this.settleExpeditionRecipeReward(n,d,bonusTr.equipmentRecipeId);if(recReward){j.recipeReward=recReward;j.loot.push(recReward);}}const stones=Math.min(20+g.rng.int(0,15),E.getSpiritStonesV140(site.cache));if(this.transferMoney(site.cache,n,stones))j.stones=stones;if(d.scroll){const found=this.learnScroll(n,'คัมภีร์จาก'+d.name,{danger:d.danger,siteId:d.id});if(found)j.scroll={itemId:found.id,artId:found.artId,nameTh:found.nameTh||this.g.progression?.artMap.get(found.artId)?.nameTh||'คัมภีร์ที่ค้นพบ',rarityBadgeTh:found.rarityBadgeTh||'สามัญ',rarityColor:found.rarityColor||'#adb5bd',poolNameTh:found.poolNameTh||d.name,status:'PERSONAL'};}H.learn(n,'prepareExpedition',3);E.recordTrackDaoEvidenceV1200(g.world,n,'EXPLORATION',8);g.remember(n,'prepareExpedition',7,'สำรวจ'+d.name+'และปะทะกับ'+d.guardian);}else{g.remember(n,'prepareExpedition',-10,'บาดเจ็บจาก'+d.guardian+'ที่'+d.name);H.learn(n,'prepareExpedition',1);}g.discovery?.onExplore(n,'ข่าวจากแดนลับ '+d.name);j.hpAfter=n.health;site.visitedBy.push(n.id);this.receipt('journeyOutcome',{npcId:n.id,journeyId:j.id,outcome:j.outcome,hpBefore:j.hpBefore,hpAfter:j.hpAfter,stones:j.stones||0,transfers:j.loot,recipeReward:j.recipeReward||null,scroll:j.scroll||null});}
 learnScroll(n,origin,opts={}){if(this.g.progression)return this.g.progression.grantScroll(n,origin,n,opts);const g=this.g,arts=(E.getAllTechniquesCatalogV190?.()||[]).filter(a=>a.id);const chosen=arts.find(a=>a.id===n.jianghu.techniqueId)||arts[0];if(!chosen)return;const id=chosen.id,knowledge=n.jianghu.knowledgeV190||(n.jianghu.knowledgeV190={}),old=knowledge[id];if(old&&typeof old==='object'){old.mastery=Math.min(100,(old.mastery||0)+H.learningRate(n,'discussDao')*2);}else knowledge[id]={artId:id,stage:1,mastery:2,authorizedBy:'DISCOVERY',updatedTick:g.world.tick};const scroll={id:this.id('scroll'),artId:id,nameTh:chosen.nameTh||n.jianghu.techniqueNameTh||'บันทึกวิชายุทธ์',tier:chosen.tier||1,count:1,originLabelTh:origin};if(n.jianghu.ledgerV140.scrolls.length<24)n.jianghu.ledgerV140.scrolls.push(scroll);H.learn(n,'discussDao',1);return scroll;}
 finishMeeting(n,action,id){const g=this.g,partner=g.world.npcs[id];if(!alive(partner)||partner.stageLocal.offmap||partner.stageLocal.journey||partner.stageLocal.action==='seclusion'||partner.stageLocal.mode==='combat'||g.nearestEnemy(partner,190)||dist(n,partner)>140||partner.id===n.id)return {handled:true,success:false};if(action==='sparPeer'&&(n.health<75||partner.health<75))return {handled:true,success:false};const key=[n.id,id].sort().join('|')+'|'+action;if(this.data.meetings.some(m=>m.key===key&&g.s.t-m.t<55))return {handled:true,success:false,cooldown:30};const accept=H.option(partner,{id:'accept',baseScore:42},action),decline={id:'decline',baseScore:32+(partner.core.condition.fatigue>65?20:0),valueWeights:{freedom:.3}};const choice=E.chooseNpcDecisionOption(g.world,partner,[accept,decline],{rng:g.rng,temperature:H.temperature(partner),decisionTag:'PEER_CONSENT'});if(choice.chosenId!=='accept'){this.data.meetings.unshift({key,t:g.s.t,actorId:n.id,partnerId:id,action,declined:true});this.data.meetings.splice(100);if(partner.stageLocal?.cooldowns)partner.stageLocal.cooldowns[action]=g.s.t+30;this.speak(partner,'ข้ายังติดภารกิจฝึกตนอยู่ ไว้วันหน้าค่อยสนทนาใหม่','social');this.receipt('meeting',{npcId:n.id,partnerId:id,action,distance:round(dist(n,partner)),consent:false});return {handled:true,success:false,cooldown:30};}
  this.data.meetings.unshift({key,t:g.s.t,actorId:n.id,partnerId:id,action,consent:true});this.data.meetings.splice(100);if(partner.stageLocal?.cooldowns)partner.stageLocal.cooldowns[action]=g.s.t+55;g.life.relate(n,partner,4,2);n.stageLocal.needs.social=Math.max(0,n.stageLocal.needs.social-35);partner.stageLocal.needs.social=Math.max(0,partner.stageLocal.needs.social-25);for(const q of [n,partner]){H.learn(q,action,1);g.remember(q,action,5,(action==='sparPeer'?'ประลองชี้แนะ':'สนทนาธรรม')+'กับ'+(q===n?partner.name:n.name));}
  if(action==='sparPeer'){const crossDao=n.jianghu?.path!==partner.jianghu?.path||n.jianghu?.subPath!==partner.jianghu?.subPath;for(const q of [n,partner]){q.core.condition.fatigue=clamp(q.core.condition.fatigue+7);E.recordTrackDaoEvidenceV1200(g.world,q,'COMBAT',crossDao?5:3);const eqArt=[...(q.jianghu?.attackArtIds||[]),q.jianghu?.techniqueId,q.jianghu?.mantraId,q.jianghu?.lightnessId,q.jianghu?.auxiliaryId].filter(aid=>aid&&q.jianghu?.knowledgeV190?.[aid]).sort((a,b)=>(q.jianghu.knowledgeV190[a]?.mastery||0)-(q.jianghu.knowledgeV190[b]?.mastery||0))[0]||q.jianghu?.techniqueId||q.jianghu?.mantraId;if(eqArt&&q.jianghu?.knowledgeV190?.[eqArt]){const k=q.jianghu.knowledgeV190[eqArt];k.mastery=Math.min(100,(k.mastery||8)+(crossDao?7:4));k.stage=k.mastery>=60?6:k.mastery>=30?5:4;q.jianghu.artMasteryV150[eqArt]=k.mastery;}if(crossDao){q.jianghu.daoInsightCountV113=(q.jianghu.daoInsightCountV113||0)+1;q.jianghu.heartDemon=Math.max(0,(q.jianghu.heartDemon||0)-5);}}this.speak(n,'เชิญศิษย์สหาย '+partner.name+' ชี้แนะกระบวนท่าด้วย!','spar');this.speak(partner,crossDao?'การประลองข้ามสายมรรคาครั้งนี้ ทำให้ข้าเห็นช่องทางพัฒนาวิชาขึ้นอีกขั้น!':'คมปราณของเจ้าเฉียบคมขึ้นมาก ข้าได้เปิดหูเปิดตาแล้ว','spar');}else{const learner=action==='studyWithMentor'?n:H.capacity(n,'discussDao').cognition<H.capacity(partner,'discussDao').cognition?n:partner;E.applyNpcCultivationProgressGain(g.world,learner,1.5*H.learningRate(learner,'discussDao'));E.recordTrackDaoEvidenceV1200(g.world,learner,'STUDY',3);this.speak(n,'ได้ฟังมุมมองแห่งมรรคาของ '+partner.name+' ทำให้ข้าแจ้งกระจ่างยิ่งนัก','social');this.speak(partner,'หลักธรรมที่ถกกันในวันนี้ ข้าจะนำไปขบคิดต่อในยามเข้าฌาน','social');if(action==='discussDao'&&!n.jianghu.masterId&&!partner.jianghu.masterId){const delta=(n.jianghu.realizationBand||1)-(partner.jianghu.realizationBand||1);if(Math.abs(delta)>=.5){const master=delta>0?n:partner,disciple=delta>0?partner:n;this.bindLineage(master,disciple);}}}
  this.receipt('meeting',{npcId:n.id,partnerId:id,action,distance:round(dist(n,partner)),consent:true});return {handled:true,success:true,cooldown:55};
 }
 bindLineage(master,disciple){if(!alive(master)||!alive(disciple)||(master.jianghu.realizationBand||1)<(disciple.jianghu.realizationBand||1)+.5||master.id===disciple.id||disciple.jianghu.masterId||dist(master,disciple)>140)return false;let cur=master,seen=new Set();while(cur){if(cur.id===disciple.id||seen.has(cur.id))return false;seen.add(cur.id);cur=this.g.world.npcs[cur.jianghu.masterId];}const g=this.g;for(const [actor,activity] of [[master,'office:scriptureElder'],[disciple,'studyWithMentor']]){const accept=H.option(actor,{id:'accept',baseScore:48},activity),decline={id:'decline',baseScore:30,valueWeights:{freedom:.25}};if(E.chooseNpcDecisionOption(g.world,actor,[accept,decline],{rng:g.rng,temperature:H.temperature(actor),decisionTag:'MENTOR_CONSENT'}).chosenId!=='accept')return false;}disciple.jianghu.masterId=master.id;master.jianghu.discipleIds=[...new Set([...(master.jianghu.discipleIds||[]),disciple.id])];this.data.lineages.push({masterId:master.id,discipleId:disciple.id,at:this.g.s.t});this.log('สายการถ่ายทอด',master.name+' รับ '+disciple.name+' เป็นศิษย์สืบทอดมรรคา หลังสนทนาธรรมและประจักษ์ในความตั้งใจ',[master.id,disciple.id]);return true;}
 requestFormation(id){if(this.data.formationOrder?.status==='funded')return {ok:false,reason:'มีงบจัดวางค่ายกลที่ยังรอผู้สมัครใจ'};if(!FORMATIONS.some(d=>d.id===id))return {ok:false,reason:'ไม่พบแบบค่ายกล'};if(!this.g.money(-60,'สำรองค่าจัดวางค่ายกล'))return {ok:false,reason:'ต้องใช้ 60 ศิลา'};this.data.formationOrder={id:this.id('formation-order'),formationId:id,budget:60,status:'funded',at:this.g.s.t};return {ok:true};}
 cancelFormation(){const o=this.data.formationOrder;if(o?.status!=='funded')return {ok:false,reason:'ไม่มีงบค่ายกลที่ยังไม่ใช้'};o.status='cancelled';this.g.money(o.budget,'คืนค่าจัดวางค่ายกล');return {ok:true};}
 formationBonus(n,kind){const f=this.data.formation;return alive(n)&&this.g.s.heroIds.includes(n.id)&&f&&f.expiresAt>this.g.s.t&&dist(n,f.center)<=650?1+(f[kind]||0):1;}
 spawnFortune(index=null){
  const s=this.data;if(s.fortunes.filter(f=>!f.claimed&&f.expiresAt>this.g.s.t).length>=4)return null;
  let pickedIndex;
  if(index!==null&& index!==undefined){
   pickedIndex=Math.abs(Math.floor(index))%FORTUNES.length;
  }else{
   const cursor=Number.isFinite(s.fortuneCursor)?s.fortuneCursor:0;
   const step=1+(this.g.rng?this.g.rng.int(0,2):0);
   pickedIndex=(cursor+step-1)%FORTUNES.length;
   s.fortuneCursor=pickedIndex+1;
  }
  const d=FORTUNES[pickedIndex];
  const positions=[{x:1480,y:1930},{x:2450,y:1740},{x:1600,y:2480},{x:2830,y:1110},{x:2930,y:2520},{x:2180,y:2520},{x:3120,y:1280},{x:2740,y:890}],p=positions[d.index%positions.length],cache=this.cache(this.id('fortune-cache'));
  if(!['QI_SURGE_AND_HEAL','ANCIENT_SCROLL','ZEN_SCROLL_ENLIGHTENMENT','DEMON_ABYSS_SCRIPTURE','CELESTIAL_EDICT_SCROLL'].includes(d.kind)){this.g.add(cache,d.index%2?CIN:HERB,2,'FORTUNE_DEPOSIT');this.g.add(cache,ORE,1,'FORTUNE_DEPOSIT');}
  const f={id:this.id('fortune'),...p,name:d.name,icon:d.icon,kind:d.kind,danger:d.danger,charges:1,cache,createdAt:this.g.s.t,expiresAt:this.g.s.t+115,claimed:false};
  this.g.progression?.stockFortune(f);s.fortunes.push(f);
  s.fortunes=s.fortunes.filter(x=>!x.claimed&&x.expiresAt>this.g.s.t||this.g.s.t-(x.claimedAt||x.expiresAt)<120);
  return f;
 }
 invite(id){const g=this.g,f=this.data.factions.find(f=>f.id===id);if(!f)return {ok:false,reason:'ไม่พบสำนัก'};if(this.data.factions.some(x=>x.invitation)||this.visitors.some(v=>v.stageLocal.envoy&&!['away','dead'].includes(v.stageLocal.envoy.phase)))return {ok:false,reason:'รอให้การเยือนปัจจุบันสิ้นสุดก่อน'};if(g.s.t-f.lastVisitAt<100)return {ok:false,reason:'ผู้แทนยังเตรียมการเดินทางครั้งใหม่'};if(!g.money(-20,'จัดเตรียมการต้อนรับผู้แทน '+f.short))return {ok:false,reason:'ต้องใช้ 20 ศิลา'};f.invitation={at:g.s.t,arrivesAt:g.s.t+15};this.log('เทียบเชิญทูตสำนัก','ส่งเทียบเชิญถึง'+f.name+' ศิษย์ในสำนักจะเลือกเดินไปต้อนรับและเจรจาด้วยตนเอง');return {ok:true};}
 createEnvoy(f){const g=this.g;let n=g.world.npcs[f.delegateId];if(!alive(n)){const names=['หลงชิง','จินหลิง','หมิงจ้าว','เหลยเซียว','หลัวอิน','เสวี่ยหนิง'];n=g.create(names[this.data.factions.indexOf(f)]||'ผู้แทนต่างสำนัก',{role:'envoy',visitor:true,preserveName:true});g.initializePerson(n,EXIT,{role:'envoy',visitor:true,originSectId:f.id});E.setSpiritStonesV140(n,0);f.delegateId=n.id;this.data.envoyIds.push(n.id);}else{n.stageLocal.x=EXIT.x;n.stageLocal.y=EXIT.y;n.stageLocal.offmap=null;}
  n.stageLocal.visitor=true;n.stageLocal.role='envoy';n.stageLocal.originSectId=f.id;const extPool=(root.CombatData117?.worldArtsV210||[]).filter(a=>a.discoveryChannel==='EXTERNAL_MASTER');const idxEnv=Math.max(0,this.data.factions.indexOf(f)),visit=Number.isFinite(this.data.transmissionCursor201)?this.data.transmissionCursor201:0;this.data.transmissionCursor201=visit+1;const first=extPool.length?(visit+idxEnv)%extPool.length:0;const secretArtIds=extPool.length?[...new Set([extPool[first].id,extPool[(first+3)%extPool.length].id])]:[];n.stageLocal.envoy={factionId:f.id,phase:'arriving',arrivedAt:null,expiresAt:g.s.t+115,met:{},nextBidAt:g.s.t+6,secretArtIds,transmittedTo:{}};n.currentCityId=g.city;this.transferMoney(f.cache,n,Math.min(60,E.getSpiritStonesV140(f.cache)));this.transferMaterial(f.cache,n,ORE,2,'DIPLOMATIC_CARGO');this.transferMaterial(f.cache,n,CIN,1,'DIPLOMATIC_CARGO');
  if(g.count(f.cache,ORE)>=2&&f.production<8){g.consume(f.cache,ORE,2);f.production++;const item=root.JianghuExpansionV112?.rollEnvoyAuctionItem?root.JianghuExpansionV112.rollEnvoyAuctionItem(f.id,this.id('regional'),g.rng):{id:this.id('regional-sword'),catalogId:'REGIONAL_SECT_SWORD',nameTh:'กระบี่เหล็กดำแห่ง'+f.short,slot:'WEAPON',tier:2,minStageReq:1,quality:'REFINED',durability:100,maxDurability:100,combatMult:.07,defenseMult:.02,originType:'REGIONAL_WORKSHOP',originLabelTh:f.name};item.originLabelTh=f.name;n.jianghu.ledgerV140.equipmentItems.push(item);}g.send(n,'visitMarket',MARKET,0);f.invitation=null;f.lastVisitAt=g.s.t;this.log('ทูตต่างสำนักมาเยือน',n.name+' เดินทางเข้าหุบเขาพร้อมศิลาวิญญาณและสินค้าจาก'+f.short,[n.id]);return n;
 }
 finishParley(n,id){const g=this.g,v=g.world.npcs[id],e=v?.stageLocal.envoy,f=this.data.factions.find(f=>f.id===e?.factionId);if(!alive(v)||!e||e.phase!=='waiting'||dist(n,v)>125||!f)return {handled:true,success:false};const ask=Math.ceil(12*clamp(1-this.factionRelation(f)*.003,.8,1.25)),options=[H.option(n,{id:'greet',baseScore:43},'negotiateEnvoy')];if(g.count(v,ORE)>=1&&E.getSpiritStonesV140(n)>=ask)options.push(H.option(n,{id:'trade',baseScore:42,valueWeights:{wealthResource:.3,knowledgeCraft:.25}},'trade'));const pick=E.chooseNpcDecisionOption(g.world,n,options,{rng:g.rng,temperature:H.temperature(n),decisionTag:'ENVOY_PARLEY'});let traded=0,cost=0;if(pick.chosenId==='trade'){traded=this.transferMaterial(v,n,ORE,1,'ENVOY_TRADE');if(traded){this.transferMoney(n,v,ask);cost=ask;}}
  const gain=Math.round(2+H.capacity(n,'negotiateEnvoy').cognition*.04);f.relation=clamp(this.factionRelation(f)+gain,-100,100);if(f.id==='SG')g.s.life.pavilionRelation=f.relation;e.met[n.id]=g.s.t;g.life.relate(n,v,gain,1);
  const relObj=E.getRelationshipV130(g.world,n,v,false)||{affinity:0,bond:0};
  if(e.secretArtIds?.length&&!e.transmittedTo?.[n.id]&&n.jianghu.ledgerV140.scrolls.length<24&&(relObj.bond>=6||relObj.affinity>=10||this.factionRelation(f)>=22)&&g.rng.chance(.42)){
   const sArtId=e.secretArtIds.find(aid=>!n.jianghu.knowledgeV190?.[aid]&&!n.jianghu.ledgerV140.scrolls.some(s=>s.artId===aid))||e.secretArtIds[0];
   const sArt=g.progression?.artMap.get(sArtId)||(root.CombatData117?.worldArtsV210||[]).find(a=>a.id===sArtId);
   if(sArt){
    if(g.progression&&!g.progression.artMap.has(sArt.id))g.progression.artMap.set(sArt.id,sArt);
    if(g.combatSystem&&!g.combatSystem.artMap.has(sArt.id))g.combatSystem.artMap.set(sArt.id,sArt);
    const giftScroll={id:this.id('envoy-secret-scroll'),artId:sArt.id,nameTh:sArt.nameTh,tier:sArt.tier||3,rarityGrade:'EARTH',rarityBadgeTh:'ปฐพี (มรดกนอกสำนัก)',rarityColor:'#4fb2f2',count:1,ownerNpcId:n.id,rights:'OWNER',sourceType:'DISCOVERY',originLabelTh:`ได้รับการถ่ายทอดจาก ${v.name} (${f.short})`};
    n.jianghu.ledgerV140.scrolls.push(giftScroll);
    g.discovery?.recordFind(n,giftScroll,{method:'EXTERNAL_MASTER_TRANSMISSION',masterId:v.id,factionId:f.id});
    e.transmittedTo=e.transmittedTo||{};e.transmittedTo[n.id]=sArt.id;
    this.log('ได้รับการถ่ายทอดวิชาเร้นลับ',`${v.name} แห่ง${f.short} ประทับใจในไมตรีของ ${n.name} จึงมอบเคล็ดวิชาเร้นลับ «${sArt.nameTh}» ให้เป็นมรดกส่วนตัว`,[n.id,v.id]);
   }
  }g.remember(n,'negotiateEnvoy',5,'พบผู้แทน'+f.name+'จริง');g.remember(v,'negotiateEnvoy',5,'ได้พูดคุยกับ'+n.name);g.life.credit(n,2,'เจรจากับผู้แทนสำนัก');this.speak(n,'ข้ายินดีแลกเปลี่ยนความรู้และผูกไมตรีกับ'+f.short,'diplomacy');this.speak(v,'ข้าจะจดจำไมตรีของสหาย '+n.name,'diplomacy');this.receipt('parley',{npcId:n.id,partnerId:v.id,factionId:f.id,relationGain:gain,ore:traded,stones:cost,distance:round(dist(n,v))});return {handled:true,success:true};}
 openAuction(owner){if(!alive(owner)||dist(owner,MARKET)>140)return null;const e=owner.stageLocal.envoy;if(!e||e.phase!=='waiting'||this.data.auctions.some(l=>l.ownerId===owner.id&&l.phase==='open'))return null;const item=owner.jianghu.ledgerV140.equipmentItems.find(i=>!this.data.auctions.some(l=>l.itemId===i.id));if(!item)return null;const lot={id:this.id('lot'),ownerId:owner.id,itemId:item.id,name:item.nameTh,minimum:item.minimumBid||16,createdAt:this.g.s.t,closesAt:this.g.s.t+55,phase:'open',bid:null,bids:[],delivered:false};this.data.auctions.push(lot);this.log('เปิดประมูลที่ตลาด',owner.name+' นำ'+item.nameTh+'ขึ้นประมูล ณ ตลาดชายแดน',[owner.id]);return lot;}
 bid(n,id){const g=this.g,lot=this.data.auctions.find(l=>l.id===id);if(!lot||lot.phase!=='open'||lot.closesAt<=g.s.t||!alive(n)||n.id===lot.ownerId||lot.bid?.npcId===n.id||n.stageLocal.offmap||dist(n,MARKET)>140||n.jianghu.ledgerV140.equipmentItems.length>=12)return {ok:false,reason:'ยังร่วมประมูลไม่ได้'};const amount=lot.bid?lot.bid.amount+4:lot.minimum,isMember=g.s.heroIds.includes(n.id),personal=Math.min(amount,E.getSpiritStonesV140(n)),support=amount-personal;if(support>(isMember?this.data.marketFund+(lot.bid?.support||0):0))return {ok:false,reason:'เงินที่ยอมจ่ายไม่พอ'};this.refundBid(lot);E.addSpiritStonesV140(n,-personal);this.data.marketFund-=support;lot.bid={npcId:n.id,amount,personal,support,at:g.s.t};lot.bids.push({...lot.bid});lot.bids.splice(40);this.speak(n,'ข้าขอเสนอราคา '+amount+' ศิลา สำหรับศาสตราชิ้นนี้!','auction');return {ok:true,amount};}
 refundBid(lot){const b=lot.bid;if(!b)return;const n=this.g.world.npcs[b.npcId];if(n)E.addSpiritStonesV140(n,b.personal);else this.g.money(b.personal,'คืนเงินประมูลที่เจ้าของข้อมูลไม่อยู่');this.data.marketFund+=b.support;lot.bid=null;}
 closeAuction(lot){if(lot.phase!=='open'||this.g.s.t<lot.closesAt)return false;const g=this.g,owner=g.world.npcs[lot.ownerId],bid=lot.bid,n=g.world.npcs[bid?.npcId],items=owner?.jianghu.ledgerV140.equipmentItems,index=items?.findIndex(i=>i.id===lot.itemId)??-1;if(!bid||!alive(owner)||!alive(n)||index<0||n.jianghu.ledgerV140.equipmentItems.length>=12){this.refundBid(lot);lot.phase='unsold';return false;}const item=items.splice(index,1)[0];n.jianghu.ledgerV140.equipmentItems.push(item);E.addSpiritStonesV140(owner,bid.amount);E.syncLegacyArraysFromLedgerV140(owner);E.syncLegacyArraysFromLedgerV140(n);lot.phase='sold';lot.delivered=true;lot.winnerId=n.id;lot.price=bid.amount;lot.closedAt=g.s.t;lot.bid=null;g.remember(n,'bidAuction',6,'ประมูล'+item.nameTh+'ด้วยเงิน '+lot.price);g.life.credit(n,1,'จัดหาศาสตราจากตลาด');this.receipt('auction',{npcId:n.id,sellerId:owner.id,itemId:item.id,stones:lot.price,bids:lot.bids.length});this.log('ปิดประมูลสำเร็จ',n.name+' ประมูลได้'+item.nameTh+'ในราคา '+lot.price+' ศิลา',[n.id,owner.id]);return true;}
 tickVisitor(n,dt){if(!alive(n))return;const g=this.g,p=n.stageLocal,e=p.envoy,f=this.data.factions.find(f=>f.id===e.factionId);if(e.phase==='away'||e.phase==='dead')return;H.tick(n,dt);if(e.phase==='arriving'||e.phase==='leaving'){g.move(n,dt);if(p.route.length)return;const target=e.phase==='arriving'?MARKET:EXIT;if(dist(n,target)>6){p.route=g.path(p,target);return;}if(e.phase==='arriving'){e.phase='waiting';e.arrivedAt=g.s.t;p.mode='waiting';p.goal='พบปะผู้ฝึกตนที่ตลาด';this.openAuction(n);}else{e.phase='away';p.offmap={realmEnvoy:true};p.mode='offmap';n.currentCityId=null;for(const z of [...n.jianghu.ledgerV140.materialStacks])this.transferMaterial(n,f.cache,z.matId,z.count,'RETURNED_ENVOY_STOCK');this.transferMoney(n,f.cache,E.getSpiritStonesV140(n));}return;}if(e.phase==='waiting'&&g.s.t>=e.expiresAt&&!this.data.auctions.some(l=>l.ownerId===n.id&&l.phase==='open')){e.phase='leaving';g.send(n,'leaveValley',EXIT,0);}}
 beforeHero(n){const p=n.stageLocal,j=this.data.journeys.find(j=>j.id===p.journey);if(j?.phase==='toExit'&&p.action!=='departExpedition'){j.phase='cancelled';j.reason='ถูกเหตุฉุกเฉินหรืองานอื่นขัดจังหวะก่อนออกด่าน';const site=this.data.sites.find(s=>s.id===j.siteId);if(site)site.remaining++;p.journey=null;this.log('พักการเดินทาง',n.name+' หยุดแผนก่อนออกด่าน เสบียงเตรียมไปแล้ว ค่าทางคืนเข้ากองทุน');if(j.funder==='travelFund')this.data.travelFund+=j.paid;else E.addSpiritStonesV140(n,j.paid);j.refunded=true;}if(['discussDao','sparPeer','studyWithMentor','negotiateEnvoy'].includes(p.action)&&p.mode==='travel'&&this.g.s.t>=(p.repathAt||0)){const other=this.g.world.npcs[p.realmTarget];p.repathAt=this.g.s.t+2;if(alive(other)&&!other.stageLocal.offmap&&dist(n,other)>100){p.target={id:other.id,x:other.stageLocal.x,y:other.stageLocal.y};p.route=this.g.path(p,p.target);}}}
 damagePet(a,amount,attacker){if(!a.alive)return;a.health=Math.max(0,a.health-amount);if(a.health<=0){a.alive=false;a.stageLocal.mode='dead';const n=this.g.world.npcs[a.ownerId];if(alive(n)){this.g.remember(n,'tameCompanion',-12,'คู่หู '+a.name+' เสียชีวิต');n.core.human.state.grief=clamp(n.core.human.state.grief+15);}this.log('สูญเสียคู่หู',a.name+' เสียชีวิตถาวร',n?[n.id]:[]);}}
 tickPet(a,dt){this.g.combatSystem?.tickStatuses(a,dt);if(!a.alive||a.health<=0||(a.stageLocal?.combatState?.staggerUntil||0)>this.g.s.t)return;if(!a.alive)return;const g=this.g,p=a.stageLocal,n=g.world.npcs[a.ownerId];a.hunger=clamp(a.hunger+dt*.025);if(a.ownerId&&!alive(n)){a.formerOwnerId=a.ownerId;a.ownerId=null;a.trust=Math.max(0,a.trust-20);p.mode='wild';p.offmap=null;p.home={x:p.x,y:p.y};return;}if(!n){p.offmap=null;return;}if(n.stageLocal.offmap){const j=this.data.journeys.find(j=>j.id===n.stageLocal.offmap.journeyId);if(j?.petId===a.id||!j&&dist(a,EXIT)<180)p.offmap={followingOwner:n.id};else {p.offmap=null;p.mode='waiting';}return;}if(p.offmap){p.offmap=null;p.x=EXIT.x;p.y=EXIT.y;}p.mode='follow';const d=dist(a,n);if(d>100){if(!p.route.length||g.s.t>=(p.repathAt||0)){p.route=g.path(p,n.stageLocal);p.repathAt=g.s.t+2;}g.move(a,dt,54);}else p.route=[];
  const enemy=g.nearestEnemy(n,200);if(enemy&&dist(a,enemy)<150&&a.hunger<85&&a.health>20&&g.s.t>=a.attackAt){g.combatSystem.creatureAct(a,enemy);a.hunger=clamp(a.hunger+.5);}if(g.built('sanctuary')&&dist(a,g.endpoint(g.built('sanctuary')))<180&&a.hunger<70)a.health=Math.min(a.maxHP,a.health+dt*.3);}
 onDeath(n){const e=n.stageLocal?.envoy;if(e){e.phase='dead';for(const lot of this.data.auctions.filter(l=>l.ownerId===n.id&&l.phase==='open')){this.refundBid(lot);lot.phase='cancelled';}this.log('ผู้แทนเสียชีวิต',n.name+' เสียชีวิต การเยือนและรายการขายสิ้นสุดลง',[n.id]);return true;}const j=this.data.journeys.find(j=>j.id===n.stageLocal?.journey);if(j){j.phase='dead';j.outcome='died';j.resolved=true;}return false;}
 onWork(n,action,success){if(!success)return;if(action==='train')this.speak(n,'ข้ากำลังขัดเกลาตบะแห่ง'+short(n.jianghu.subPathNameTh),'practice');else if(action==='deposit')this.speak(n,'ทรัพยากรที่รวบรวมมา ส่งเข้าคลังสำนักเรียบร้อยแล้ว','work');else if(action==='scout')this.speak(n,'ร่องรอยปราณและเส้นทางบนสันเขา ข้าจดจำไว้หมดแล้ว','discovery');}
 tick(dt){const g=this.g,s=this.data;if(g.s.t>=s.nextThink){s.nextThink=g.s.t+1;if(g.s.t>=s.nextFortuneAt){this.spawnFortune();s.nextFortuneAt=g.s.t+85;}for(const f of s.factions)if(f.invitation&&g.s.t>=f.invitation.arrivesAt)this.createEnvoy(f);for(const lot of s.auctions)if(lot.phase==='open'&&g.s.t>=lot.closesAt)this.closeAuction(lot);if(s.formation&&s.formation.expiresAt<=g.s.t){this.log('ค่ายกลสงบลง',s.formation.name+' หมดอายุลง ต้องรอผู้จารึกใหม่');s.formation=null;}const day=Math.floor(g.s.t/20);if(day>s.lastDay){const days=day-s.lastDay;s.lastDay=day;for(const f of s.factions){E.addSpiritStonesV140(f.cache,days*4);if(g.count(f.cache,ORE)<12)g.add(f.cache,ORE,Math.min(days,12-g.count(f.cache,ORE)),'REGIONAL_DAILY_PRODUCTION');}if(s.formation&&g.s.t-s.formation.lastUpkeepAt>=20){if(g.consume(g.bank,CIN,1))s.formation.lastUpkeepAt=g.s.t;else{s.formation.expiresAt=g.s.t;this.log('ค่ายกลขาดแร่ชาด','สื่อค่ายกลหมดลง ม่านปราณจึงสลายตัว');}}}}
  for(const n of this.visitors)this.tickVisitor(n,dt);for(const a of s.pets)this.tickPet(a,dt);
 }
}
const LABELS=Object.fromEntries(['seekFortune','prepareExpedition','departExpedition','returnExpedition','tameCompanion','careCompanion','discussDao','sparPeer','studyWithMentor','negotiateEnvoy','bidAuction','inscribeFormation','honorAncestors'].map(id=>[id,H.descriptor(id).label]));LABELS.visitMarket='เยือนตลาดชายแดน';
const api={LivingJianghu,LABELS,VERSION,FORMATIONS,SITES,FORTUNES,BEASTS,ROLE_DEFS,MARKET,EXIT,SITE_HERITAGE_MAP};root.LivingJianghuSystem=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
