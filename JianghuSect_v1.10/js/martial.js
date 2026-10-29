/* Derived martial identity and shared equipment suitability. Never writes HC attributes. */
(function(g){
'use strict';
const {JD,HC,U,CULT,ECO,STATS:ST}=g,D=JD.MARTIAL,clamp=U.clamp;
const M=g.MARTIAL={VERSION:D.version,TYPES:D.types};
const paths={
 XIAN:{body:{meridianCapacity:28,spiritualFoundation:24,reflex:8},p:{matk:.14,def:-.05},life:{ARRAY:.12,TALISMAN:.10},curve:'late',weapons:['FOCUS','SWORD'],armor:['ROBE']},
 BODY:{body:{strength:34,toughness:30,endurance:26,vitality:22},p:{atk:.08,matk:-.1},life:{mining:.20,FORGING:.08},curve:'early',weapons:['FIST','STAFF','SPEAR'],armor:['HEAVY']},
 GOD:{body:{vitality:20,spiritualFoundation:18,endurance:12},p:{mdef:.12,cast:-.04},life:{MEDICINE:.12,herbalism:.10},curve:'steady',weapons:['SPEAR','FOCUS'],armor:['HEAVY','ROBE']},
 DEMON:{body:{strength:24,explosiveness:26,agility:18},p:{atk:.10,def:-.10},life:{POISON:.17,hunting:.12},curve:'early',weapons:['BLADE','FIST'],armor:['LIGHT']},
 HEART_SOUL:{body:{reflex:18,spiritualFoundation:30,meridianCapacity:16},p:{matk:.13,hp:-.06},life:{SCRIPTURE:.18,ARRAY:.12},curve:'late',weapons:['FOCUS','SWORD'],armor:['ROBE','LIGHT']}
};
// [body, productive life skills, curve, preferred weapons, armor]. All current branches have a distinct record.
const profiles={
 SWORD_IMMORTAL:[{reflex:16,agility:10},{SWORD:.20},'late',['SWORD'],['LIGHT']],
 FIVE_ELEMENTS:[{meridianCapacity:14,spiritualFoundation:12},{ALCHEMY:.12,ARRAY:.12},'late',['FOCUS'],['ROBE']],
 ELIXIR_DAO:[{vitality:20,recoveryRate:15},{ALCHEMY:.32,MEDICINE:.22},'steady',['FOCUS'],['ROBE']],
 ASTRAL_ARRAY:[{spiritualFoundation:15},{ARRAY:.35,TALISMAN:.15},'late',['FOCUS'],['ROBE']],
 BLOOD_DEMON:[{explosiveness:22,strength:12},{hunting:.25},'early',['BLADE','FIST'],['LIGHT']],
 PHANTOM_SOUL:[{agility:18,reflex:12},{survival:.20,SCRIPTURE:.12},'late',['FOCUS','BLADE'],['LIGHT']],
 TIME_VOID:[{speed:18,reflex:18},{ARRAY:.20,SCRIPTURE:.22},'late',['FOCUS'],['ROBE']],
 SOUND_ZITHER:[{spiritualFoundation:15,dexterity:18},{MEDICINE:.14,TALISMAN:.22},'steady',['FOCUS'],['ROBE']],
 YIN_YANG_HARMONY:[{recoveryRate:20,meridianCapacity:12},{ALCHEMY:.18,MEDICINE:.20},'steady',['FOCUS','STAFF'],['ROBE']],
 TIGER_SOVEREIGN:[{strength:22,explosiveness:20},{hunting:.28},'early',['FIST'],['LIGHT']],
 BLOOD_DRAGON:[{vitality:24,strength:18},{hunting:.18,mining:.16},'late',['FIST','SPEAR'],['HEAVY']],
 VAJRA_BODHI:[{toughness:28,endurance:16},{MEDICINE:.16,mining:.18},'late',['STAFF','FIST'],['HEAVY']],
 DEVOURING_FIEND:[{immunity:24,strength:18},{hunting:.24,POISON:.15},'early',['FIST','BLADE'],['HEAVY']],
 SOLAR_FORGE:[{strength:20,dexterity:20},{FORGING:.38,mining:.14},'steady',['STAFF','FIST'],['HEAVY']],
 THUNDER_BODY:[{reflex:26,speed:18},{mining:.20,FORGING:.16},'early',['SPEAR','FIST'],['LIGHT']],
 JADE_IMMORTAL_BODY:[{vitality:28,recoveryRate:26},{MEDICINE:.24,herbalism:.22},'late',['STAFF','FOCUS'],['ROBE']],
 TITAN_MOUNTAIN_BODY:[{toughness:32,endurance:26,speed:-8},{mining:.36},'late',['STAFF'],['HEAVY']],
 WAR_DEITY:[{strength:16,endurance:20},{FORGING:.20,hunting:.15},'steady',['SPEAR','BLADE'],['HEAVY']],
 MERCY_DEITY:[{vitality:22,recoveryRate:18},{MEDICINE:.38,ALCHEMY:.16},'steady',['FOCUS','STAFF'],['ROBE']],
 FATE_ORACLE:[{reflex:20,spiritualFoundation:12},{SCRIPTURE:.30,TALISMAN:.20},'late',['FOCUS'],['ROBE']],
 TOTEM_BEAST_GOD:[{strength:16,agility:16},{BEAST_TAMING:.35,hunting:.18},'early',['SPEAR','FIST'],['LIGHT']],
 UNDERWORLD_JUDGE:[{spiritualFoundation:22,endurance:14},{SCRIPTURE:.24,POISON:.16},'late',['STAFF','FOCUS'],['HEAVY']],
 OCEAN_SOVEREIGN:[{meridianCapacity:24,flexibility:18},{MEDICINE:.20,ALCHEMY:.18},'late',['SPEAR','FOCUS'],['ROBE']],
 HARVEST_EARTH_GOD:[{vitality:20,endurance:18},{herbalism:.38,MEDICINE:.18},'steady',['STAFF','FOCUS'],['ROBE']],
 FROST_MOON_IMMORTAL:[{meridianCapacity:18,reflex:16},{ALCHEMY:.24,herbalism:.18},'late',['SWORD','FOCUS'],['ROBE']],
 WOOD_SPRING_BODY:[{vitality:26,recoveryRate:28},{herbalism:.30,MEDICINE:.22},'late',['STAFF','FIST'],['LIGHT']],
 MEDICINE_BODHI_GOD:[{vitality:20,spiritualFoundation:20},{MEDICINE:.34,ALCHEMY:.26},'steady',['FOCUS','STAFF'],['ROBE']],
 SHADOW_ASSASSIN:[{agility:26,speed:18},{survival:.28,hunting:.18},'early',['BLADE'],['LIGHT']],
 VENOM_GU_SOVEREIGN:[{immunity:32,dexterity:16},{POISON:.36,ALCHEMY:.24},'late',['FOCUS','BLADE'],['ROBE']],
 NETHER_GHOST_KING:[{spiritualFoundation:28,endurance:12},{SCRIPTURE:.24,BEAST_TAMING:.18},'late',['FOCUS','STAFF'],['ROBE']],
 HEAVEN_DEVOURING_DEMON:[{strength:26,explosiveness:24},{hunting:.30,mining:.16},'early',['FIST','BLADE'],['HEAVY']],
 ZEN_VOID_MIND:[{spiritualFoundation:22,recoveryRate:18},{SCRIPTURE:.32,MEDICINE:.20},'late',['STAFF','FOCUS'],['ROBE']],
 CALLIGRAPHY_PAINTING_SAGE:[{dexterity:24,meridianCapacity:18},{TALISMAN:.35,ARRAY:.24},'late',['FOCUS'],['ROBE']],
 DREAM_ILLUSION_WEAVER:[{reflex:22,agility:18},{SCRIPTURE:.24,TALISMAN:.20},'late',['FOCUS'],['LIGHT']],
 MIND_SWORD_TELEKINESIS:[{reflex:24,spiritualFoundation:20},{SWORD:.20,ARRAY:.22},'late',['SWORD','FOCUS'],['ROBE']],
 STAR_ARCHER:[{reflex:24,dexterity:20},{hunting:.28,survival:.20},'late',['BOW'],['LIGHT']],
 STAFF_GUARD:[{toughness:26,endurance:24,speed:-6},{mining:.28,FORGING:.18},'early',['STAFF'],['HEAVY']]
};
M.PATHS=paths;M.PROFILES=profiles;
M.normalize=n=>{if(!n.cult)return;const c=n.cult,p=CULT.PATHS[c.path];if(!p)return;if(c.sub!=='NONE'&&!p.subPaths.some(s=>s.id===c.sub)){c.sub='NONE';c.track=null;ST.dirty(n);}if(c.sub==='NONE'&&c.track){c.track=null;ST.dirty(n);}};
const growth=(stage,max,curve)=>{const x=clamp((stage-1)/Math.max(1,max-1),0,1);return .18+.82*(curve==='early'?Math.sqrt(x):curve==='late'?x*x:x);};
const progressCache=new WeakMap();
M.progression=(n,stage)=>{
 const c=n.cult;if(!c||!paths[c.path])return {identity:'ปุถุชน',body:{},p:{},f:{},life:{},scale:0};
 const rank=Math.min(CULT.PATHS[c.path].maxStage,stage==null?c.stage:stage),track=c.track?c.track.ordinal||1:1,key=c.path+'|'+c.sub+'|'+rank+'|'+track;
 const cache=progressCache.get(n);if(cache&&cache.key===key)return cache.value;
 const path=paths[c.path],sub=CULT.PATHS[c.path].subPaths.some(s=>s.id===c.sub)?profiles[c.sub]:null,max=CULT.PATHS[c.path].maxStage,ps=growth(rank,max,path.curve),ss=Math.max(growth(rank,max,sub?sub[2]:'steady'),track>1?growth(track,9,sub?sub[2]:'steady')*.85:0);
 const body={},p={},life={};for(const k in path.body)body[k]=path.body[k]*ps;if(sub)for(const k in sub[0])body[k]=(body[k]||0)+sub[0][k]*ss;
 for(const k in path.p)p[k]=path.p[k]*ps;for(const k in path.life)life[k]=1+path.life[k]*ps;if(sub)for(const k in sub[1])life[k]=(life[k]||1)+sub[1][k]*ss;
 Object.keys(body).forEach(k=>body[k]=Math.round(body[k]*10)/10);
 const value={identity:sub?CULT.subInfo(c.path,c.sub).nameTh:'พื้นฐาน (ยังไม่เลือกสายย่อย)',body,p,f:{},life,scale:ss,curve:sub?sub[2]:path.curve};
 progressCache.set(n,{key,value});return value;
};
M.eff=(n,path)=>{const value=HC.eff(n,path);return path.startsWith('physiology.')?clamp(value+(M.progression(n).body[path.slice(11)]||0),0,180):value;};
M.derived=n=>{const d=HC.derived(n),b=M.progression(n).body;return Object.assign({},d,{hpMax:Math.round(d.hpMax+(b.vitality||0)*1.1+(b.toughness||0)*.5+(b.strength||0)*.2),walkSpeed:d.walkSpeed+((b.speed||0)*.7+(b.agility||0)*.3)/100*.9});};
M.lifeMult=(n,skill)=>M.progression(n).life[skill]||1;
M.subStats=(n,fx,stage)=>{if(!n.cult||!CULT.PATHS[n.cult.path].subPaths.some(s=>s.id===n.cult.sub))return {p:{},f:{}};const scale=M.progression(n,stage).scale;return {p:Object.fromEntries(Object.entries(fx.p||{}).map(([k,v])=>[k,v*scale])),f:Object.fromEntries(Object.entries(fx.f||{}).map(([k,v])=>[k,v*scale]))};};
M.gearType=it=>it?(it.gearType||D.classify(it.slot,it.nameTh)):null;
M.conditionMatches=(n,t)=>{
 if(t.weaponTypes){const type=(M.equippedType?M.equippedType(n):M.gearType(n.equip&&n.equip.WEAPON)||'FIST');if(!t.weaponTypes.includes(type))return false;}
 if(t.armorTypes&&(!M.gearUsable(n,n.equip&&n.equip.ARMOR)||!t.armorTypes.includes(M.gearType(n.equip&&n.equip.ARMOR))))return false;
 return true;
};
M.skillEfficiency=(n,p)=>{const t=CULT.tech(p.tech||p.id)||p;if(!t.weaponTypes&&!t.armorTypes)return 1;return M.conditionMatches(n,t)?1.15:(t.requiresWeapon?0:.65);};
M.passiveStats=n=>{const p={},f={};if(n.cult)for(const id of n.cult.techs){const t=CULT.tech(id);if(M.activeTechs&&!M.activeTechs(n).includes(id)||!t||!t.passive||!M.conditionMatches(n,t))continue;for(const k in t.passive.p)p[k]=(p[k]||0)+t.passive.p[k];for(const k in t.passive.f)f[k]=(f[k]||0)+t.passive.f[k];}return {p,f};};
M.conditionText=t=>{const a=[];if(t.weaponTypes)a.push(t.weaponTypes.map(x=>D.types[x]).join('/'));if(t.armorTypes)a.push(t.armorTypes.map(x=>D.types[x]).join('/'));return a.length?a.join(' + ')+(t.passive?' · ถอดแล้วผลหาย':t.requiresWeapon?' · จำเป็น':' · ตรง ×1.15 / อื่น ×0.65'):'ใช้ได้ทุกอุปกรณ์';};
M.gearSuitability=(n,it,price)=>{
 if(!it||!n.cult||(it.minStage||1)>n.cult.stage+1)return {score:-Infinity,reasons:['ขั้นบำเพ็ญไม่ถึง']};
 const c=n.cult,path=paths[c.path]||paths.XIAN,sub=profiles[c.sub],type=M.gearType(it),weapons=sub?sub[3]:path.weapons,armor=sub?sub[4]:path.armor,reasons=[],s=it.st||ST.gearStats(Object.assign({},it));
 let fit=1;if(it.slot==='WEAPON'){fit=weapons.includes(type)?1.45:.68;reasons.push(weapons.includes(type)?'ตรงแนวสายบำเพ็ญ':'อาวุธไม่ถนัด');}
 if(it.slot==='ARMOR'){fit=armor.includes(type)?1.25:.85;reasons.push(armor.includes(type)?'เกราะตรงวิถี':'เกราะต่างแนว');}
 const role=c.path==='BODY'?{atk:1.35,matk:.45,def:1.2,mdef:1.1}:c.path==='HEART_SOUL'||c.path==='XIAN'?{atk:.65,matk:1.35,def:1.1,mdef:1}:c.path==='DEMON'?{atk:1.15,matk:1.15,def:.85,mdef:.9}:{atk:1,matk:1.1,def:1,mdef:1.2};
 let power=(s.atk||0)*role.atk+(s.matk||0)*role.matk+(s.def||0)*role.def+(s.mdef||0)*role.mdef+(s.hp||0)*.5+(s.crit||0)*8+(s.critDmg||0)*1.5+(s.pen||0)*6+(s.cast||0)*3+(s.eva||0)*.6+(s.acc||0)*.6+(s.move||0)*2;
 let moves=0;for(const id of c.techs){const t=CULT.tech(id);if(t&&((it.slot==='WEAPON'&&t.weaponTypes&&t.weaponTypes.includes(type))||(it.slot==='ARMOR'&&t.armorTypes&&t.armorTypes.includes(type))))moves++;}if(moves){fit+=Math.min(.5,moves*.12);reasons.push('หนุนวิชาที่เรียน '+moves+' วิชา');}
 const caution=HC.eff(n,'personality.caution')/100,aggression=HC.eff(n,'personality.aggression')/100;
 power+=(s.def||0)*caution*.35+(s.hp||0)*caution*.18+(s.atk||0)*aggression*.2;
 if(n.h.state.hp<CULT.hpMax(n)*.6){power+=(s.def||0)*.45+(s.hp||0)*.4;reasons.push('ต้องการเอาตัวรอด');}
 if(it.fx)for(const fx of it.fx){const skill=(fx.params||{}).craftBonusPath;if(skill&&M.lifeMult(n,skill)>1.05){power+=30*M.lifeMult(n,skill);reasons.push('หนุนงาน '+skill);}}
 const cost=Number.isFinite(price)?price:0,thrift=.08+HC.eff(n,'values.wealthResource')/350;
 return {score:power*fit-cost*thrift,reasons,type};
};
M.describe=(W,n)=>{const now=M.progression(n),next=n.cult&&n.cult.stage<CULT.maxStage(n)?M.progression(n,n.cult.stage+1):now,raw=n.cult&&(ST.SUBFX[n.cult.sub]||(JD.EXPANSION.subStats||{})[n.cult.sub])||{p:{},f:{}};return {now,next,subNow:M.subStats(n,raw),subNext:n.cult?M.subStats(n,raw,n.cult.stage+1):{p:{},f:{}},desires:n.cult?((profiles[n.cult.sub]||[null,null,null,paths[n.cult.path].weapons])[3]).map(x=>D.types[x]):[],crystals:Object.entries(n.inv&&n.inv.crystals||{}).filter(x=>x[1]>0)};};
// Mint/catalog boundary types also cover historical recipe-only equipment.
const oldMint=ECO.mintGear;ECO.mintGear=(r,q)=>{const it=oldMint(r,q),source=ECO.itemById[r.outItemId]||r;it.gearType=source.gearType||D.classify(it.slot,it.nameTh);return it;};
})(typeof globalThis!=='undefined'?globalThis:this);
