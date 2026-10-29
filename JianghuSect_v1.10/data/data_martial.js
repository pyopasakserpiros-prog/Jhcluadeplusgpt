/* Martial paths v1.10.11: native catalog extension; stable codes and no RNG. */
(function(g){
'use strict';
const JD=g.JD, D=JD.MARTIAL={version:'1.10.11',types:{SWORD:'กระบี่',BLADE:'ดาบ',BOW:'ธนู',SPEAR:'หอก/ทวน',STAFF:'พลอง',FIST:'สนับหมัด',FOCUS:'สื่อปราณ',HEAVY:'เกราะหนัก',LIGHT:'เกราะเบา',ROBE:'อาภรณ์',RING:'แหวน',NECKLACE:'สร้อย',BRACELET:'กำไล',CHARM:'เครื่องราง'}};
D.classify=(slot,name)=>{
 if(slot==='WEAPON'){for(const [re,t] of [[/ธนู|คันศร/,'BOW'],[/กระบี่/,'SWORD'],[/ดาบ|กริช|มีด|ขวาน|ง้าว/,'BLADE'],[/หอก|ทวน/,'SPEAR'],[/พลอง|กระบอง|ค้อน|ไม้เท้า/,'STAFF'],[/หมัด|สนับ|กรงเล็บ/,'FIST']])if(re.test(name||''))return t;return 'FOCUS';}
 if(slot==='ARMOR')return /เสื้อคลุม|อาภรณ์|จีวร|ชุดแพร|袍/.test(name||'')?'ROBE':/เกราะ|เหล็ก|โลหะ/.test(name||'')?'HEAVY':'LIGHT';
 return /แหวน/.test(name||'')?'RING':/สร้อย|จี้/.test(name||'')?'NECKLACE':/กำไล|ข้อมือ/.test(name||'')?'BRACELET':'CHARM';
};
const branches=[
 {id:'STAR_ARCHER',nameTh:'เซียนศรดารา',path:'XIAN',combatBonus:1.06,defenseBonus:.94,breakthroughMod:.96,cultivationBonus:1,descTh:'ยิงแม่นจากระยะไกล เติบโตปลายทาง แต่รับแรงปะทะไม่เก่ง'},
 {id:'STAFF_GUARD',nameTh:'องครักษ์พลองเหล็ก',path:'BODY',combatBonus:.95,defenseBonus:1.12,breakthroughMod:1.03,cultivationBonus:1,descTh:'ตั้งรับด้วยพลองและเกราะหนัก แข็งแกร่งแต่เชื่องช้า'}
];
branches.forEach(s=>JD.CULT.paths[s.path].subPaths.push(s));D.subPaths=branches;
const gearNames={SWORD:'กระบี่',BLADE:'ดาบ',BOW:'ธนู',SPEAR:'หอก',STAFF:'พลอง',FIST:'สนับหมัด',FOCUS:'ตราสื่อปราณ',HEAVY:'เกราะหนัก',LIGHT:'เกราะเบา',ROBE:'อาภรณ์',RING:'แหวน',NECKLACE:'สร้อย',BRACELET:'กำไล',CHARM:'เครื่องราง'};
D.items=[];D.recipes=[];
for(const tier of [1,3,5])for(const type of Object.keys(gearNames)){
 const slot=['HEAVY','LIGHT','ROBE'].includes(type)?'ARMOR':['RING','NECKLACE','BRACELET','CHARM'].includes(type)?'ACCESSORY':'WEAPON',id='MP_'+type+'_'+tier;
 const mat=tier===1?'MAT_ORE_BLACK_IRON_1':tier===3?'MAT_ORE_STAR_COPPER_3':'MAT_ORE_METEOR_IRON_5';
 const item={id,nameTh:gearNames[type]+(['HEAVY','LIGHT','ROBE'].includes(type)?'พิทักษ์':'')+({1:'เหล็กดำ',3:'ดารา',5:'อุกกาบาต'}[tier]),slot,gearType:type,tier,minStage:tier===5?3:tier===3?2:1,value:30*Math.pow(2.1,tier-1),craft:'FORGING',out:'EQUIPMENT'};
 const recipe={id:'MP_REC_'+type+'_'+tier,nameTh:'ตำรับสร้าง'+item.nameTh,craft:'FORGING',tier,minMastery:tier*11,days:tier*2,inputs:[{matId:mat,count:2+tier},{matId:'MAT_BP_WOLF_PELT_1',count:slot==='ARMOR'?4:1}],outType:'EQUIPMENT',outItemId:id,outNameTh:item.nameTh,yield:1,gearType:type};
 D.items.push(item);D.recipes.push(recipe);JD.ITEMS.items.push(item);JD.ITEMS.recipes.push(recipe);
}
// Curated branches plus equipment-conditioned fundamentals for existing identities.
D.techniques=[
 {id:'MP_BOW_RAIN',nameTh:'ฝนศรเจ็ดดารา',path:'XIAN',sub:'STAR_ARCHER',tier:2,combatArch:'sweep',element:'ASTRAL',weaponTypes:['BOW']},
 {id:'MP_BOW_FOCUS',nameTh:'จิตสงบเหนี่ยวสายศร',path:'XIAN',sub:'STAR_ARCHER',tier:2,cat:'PASSIVE',weaponTypes:['BOW'],passive:{f:{crit:9,acc:24}}},
 {id:'MP_STAFF_WALL',nameTh:'กำแพงพลองพิทักษ์',path:'BODY',sub:'STAFF_GUARD',tier:2,combatArch:'guard',element:'EARTH_METAL',weaponTypes:['STAFF']},
 {id:'MP_STAFF_ROOT',nameTh:'หยั่งรากพลองเหล็ก',path:'BODY',sub:'STAFF_GUARD',tier:2,cat:'PASSIVE',weaponTypes:['STAFF'],passive:{p:{def:.15},f:{pen:6}}},
 {id:'MP_SPEAR_LINE',nameTh:'ทวนธงรบทะลวงแนว',path:'GOD',sub:'WAR_DEITY',tier:2,combatArch:'pierce',element:'LIGHT_YANG',weaponTypes:['SPEAR']},
 {id:'MP_BLADE_SHADOW',nameTh:'คมเงาตัดชีพจร',path:'DEMON',sub:'SHADOW_ASSASSIN',tier:2,combatArch:'flurry',element:'YIN_SHADOW',weaponTypes:['BLADE']},
 {id:'MP_FOCUS_SEAL',nameTh:'ตราจิตผนึกคลื่นฝัน',path:'HEART_SOUL',sub:'DREAM_ILLUSION_WEAVER',tier:2,combatArch:'control',element:'ASTRAL',weaponTypes:['FOCUS']},
 {id:'MP_SWORD_POISE',nameTh:'ตั้งจิตรับคมกระบี่',path:'XIAN',sub:'SWORD_IMMORTAL',tier:2,cat:'PASSIVE',weaponTypes:['SWORD'],passive:{f:{pen:9,crit:4}}},
 {id:'MP_FIST_BREATH',nameTh:'ลมหายใจพยัคฆ์ไร้ศาสตรา',path:'BODY',sub:'TIGER_SOVEREIGN',tier:2,cat:'PASSIVE',weaponTypes:['FIST'],passive:{p:{atk:.12},f:{cast:7}}},
 {id:'MP_ROBE_WARD',nameTh:'อาภรณ์ประสานห้าธาตุ',path:'XIAN',sub:'FIVE_ELEMENTS',tier:2,cat:'PASSIVE',armorTypes:['ROBE'],passive:{p:{mdef:.18},f:{cast:8}}}
].map(t=>Object.assign({cat:'COMBAT_TECHNIQUE',role:'COMBAT_DEFENSE',reqTier:t.tier,power:t.tier*42,martialRare:true,moves:[]},t));
D.curriculum=[
 ['XIAN','ฝ่ามือปราณตั้งต้น','strike','NEUTRAL'],['BODY','หมัดหินตั้งต้น','strike','EARTH_METAL'],['GOD','ศรัทธาคุ้มใจตั้งต้น','support','LIGHT_YANG'],['DEMON','เคล็ดโลหิตตั้งต้น','drain','BLOOD_DEMON'],['HEART_SOUL','คลื่นจิตตั้งต้น','control','ASTRAL']
].map(([path,nameTh,combatArch,element])=>({id:'MP_BASE_'+path,nameTh,path,sub:null,tier:1,reqTier:1,cat:'COMBAT_TECHNIQUE',role:'COMBAT_DEFENSE',combatArch,element,power:30,moves:[],martialBootstrap:true}));
D.curriculum.forEach(t=>JD.TECH.techniques.push(t));
D.techniques.forEach(t=>JD.TECH.techniques.push(t));
// Older text-only weapons receive a deterministic type once at the catalog boundary.
JD.ITEMS.items.forEach(i=>{if(i.slot)i.gearType=i.gearType||D.classify(i.slot,i.nameTh);});
JD.ITEMS.recipes.forEach(r=>{if(r.outType==='EQUIPMENT'){const it=JD.ITEMS.items.find(i=>i.id===r.outItemId);if(it)r.gearType=it.gearType;}});
const preferred={SWORD_IMMORTAL:['SWORD'],MIND_SWORD_TELEKINESIS:['SWORD','FOCUS'],SHADOW_ASSASSIN:['BLADE'],WAR_DEITY:['SPEAR','BLADE'],TIGER_SOVEREIGN:['FIST'],BLOOD_DRAGON:['FIST'],VAJRA_BODHI:['STAFF','FIST'],STAFF_GUARD:['STAFF'],STAR_ARCHER:['BOW']};
JD.TECH.techniques.forEach(t=>{if(t.cat==='COMBAT_TECHNIQUE'&&!t.weaponTypes&&preferred[t.sub])t.weaponTypes=preferred[t.sub].slice();});
D.preferred=preferred;
D.subPreferences={STAR_ARCHER:{aff:{SWORD:.2,WIND:.5},p:{'physiology.dexterity':.7,'intellect.perceptiveness':.6,'personality.caution':.3}},STAFF_GUARD:{aff:{BODY_REFINING:.8},p:{'physiology.toughness':.7,'physiology.endurance':.6,'personality.loyalty':.3}}};
})(typeof globalThis!=='undefined'?globalThis:this);
