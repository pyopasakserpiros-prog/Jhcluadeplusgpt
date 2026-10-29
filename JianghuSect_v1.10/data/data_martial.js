/* Martial paths & Technique Overhaul (v1.11.0): native catalog extension, 100 passives, 10-category legends, variable multi-move arts, and tier/grade rubric. */
(function(g){
'use strict';
const JD=g.JD, D=JD.MARTIAL={version:'1.12.0',types:{SWORD:'กระบี่',BLADE:'ดาบ',BOW:'ธนู',SPEAR:'หอก/ทวน',STAFF:'พลอง',FIST:'สนับหมัด',FOCUS:'สื่อปราณ',HEAVY:'เกราะหนัก',LIGHT:'เกราะเบา',ROBE:'อาภรณ์',RING:'แหวน',NECKLACE:'สร้อย',BRACELET:'กำไล',CHARM:'เครื่องราง'}};
D.GRADES={
 Common:{id:'Common',nameTh:'สามัญ',rank:1,priceMult:1.0,color:'#9fb0c2'},
 Refined:{id:'Refined',nameTh:'ประณีต',rank:2,priceMult:1.15,color:'#6ddfb5'},
 Rare:{id:'Rare',nameTh:'หายาก',rank:3,priceMult:1.35,color:'#4fb2f2'},
 Exceptional:{id:'Exceptional',nameTh:'ล้ำเลิศ',rank:4,priceMult:1.65,color:'#e599f7'},
 Legendary:{id:'Legendary',nameTh:'ตำนาน',rank:5,priceMult:2.5,color:'#f0cf4a'}
};
D.PASSIVE_SLOT_BONUSES={
 YIN_YANG_HARMONY:{slots:1,reasonTh:'สายสมดุลหยินหยางไม่มีโบนัสโจมตีตรง จึงเปิดช่องวิชาติดตัวเพิ่ม +1 ช่องเพื่อประสานเคล็ดพื้นฐาน'},
 ZEN_VOID_MIND:{slots:1,reasonTh:'สายเซนสุญตาเน้นสมาธิและคัมภีร์ ไม่มีโบนัสโจมตีตรง จึงได้ช่องวิชาติดตัวเพิ่ม +1 ช่อง'},
 ELIXIR_DAO:{slots:1,reasonTh:'สายเต๋าโอสถเน้นการปรุงยาและพยุงชีพ ความเร็วร่ายลดลง จึงได้ช่องวิชาติดตัวเพิ่ม +1 ช่อง'},
 HARVEST_EARTH_GOD:{slots:1,reasonTh:'สายเทพเกษตรและสมุนไพรเน้นการผลิตและคุ้มกัน จึงได้ช่องวิชาติดตัวเพิ่ม +1 ช่อง'},
 STAFF_GUARD:{slots:1,reasonTh:'สายองครักษ์พลองเหล็กเน้นตั้งรับและลดความเร็ว จึงได้ช่องวิชาติดตัวเพิ่ม +1 ช่อง'}
};
D.classify=(slot,name)=>{
 if(slot==='WEAPON'){for(const [re,t] of [[/ธนู|คันศร/,'BOW'],[/กระบี่/,'SWORD'],[/ดาบ|กริช|มีด|ขวาน|ง้าว/,'BLADE'],[/หอก|ทวน/,'SPEAR'],[/พลอง|กระบอง|ค้อน|ไม้เท้า/,'STAFF'],[/หมัด|สนับ|กรงเล็บ/,'FIST']])if(re.test(name||''))return t;return 'FOCUS';}
 if(slot==='ARMOR')return /เสื้อคลุม|อาภรณ์|จีวร|ชุดแพร|袍/.test(name||'')?'ROBE':/เกราะ|เหล็ก|โลหะ/.test(name||'')?'HEAVY':'LIGHT';
 return /แหวน/.test(name||'')?'RING':/สร้อย|จี้/.test(name||'')?'NECKLACE':/กำไล|ข้อมือ/.test(name||'')?'BRACELET':'CHARM';
};
const branches=[
 {id:'STAR_ARCHER',nameTh:'เซียนศรดารา',path:'XIAN',combatBonus:1.06,defenseBonus:.94,breakthroughMod:.96,cultivationBonus:1,descTh:'ยิงแม่นจากระยะไกล เติบโตปลายทาง แต่รับแรงปะทะไม่เก่ง'},
 {id:'STAFF_GUARD',nameTh:'องครักษ์พลองเหล็ก',path:'BODY',combatBonus:.95,defenseBonus:1.12,breakthroughMod:1.03,cultivationBonus:1,descTh:'ตั้งรับด้วยพลองและเกราะหนัก แข็งแกร่งแต่เชื่องช้า'}
];
branches.forEach(s=>{if(!JD.CULT.paths[s.path].subPaths.some(x=>x.id===s.id))JD.CULT.paths[s.path].subPaths.push(s);});D.subPaths=branches;
const gearNames={SWORD:'กระบี่',BLADE:'ดาบ',BOW:'ธนู',SPEAR:'หอก',STAFF:'พลอง',FIST:'สนับหมัด',FOCUS:'ตราสื่อปราณ',HEAVY:'เกราะหนัก',LIGHT:'เกราะเบา',ROBE:'อาภรณ์',RING:'แหวน',NECKLACE:'สร้อย',BRACELET:'กำไล',CHARM:'เครื่องราง'};
D.items=[];D.recipes=[];
for(const tier of [1,3,5])for(const type of Object.keys(gearNames)){
 const slot=['HEAVY','LIGHT','ROBE'].includes(type)?'ARMOR':['RING','NECKLACE','BRACELET','CHARM'].includes(type)?'ACCESSORY':'WEAPON',id='MP_'+type+'_'+tier;
 const mat=tier===1?'MAT_ORE_BLACK_IRON_1':tier===3?'MAT_ORE_STAR_COPPER_3':'MAT_ORE_METEOR_IRON_5';
 const item={id,nameTh:gearNames[type]+(['HEAVY','LIGHT','ROBE'].includes(type)?'พิทักษ์':'')+({1:'เหล็กดำ',3:'ดารา',5:'อุกกาบาต'}[tier]),slot,gearType:type,tier,minStage:tier===5?3:tier===3?2:1,value:30*Math.pow(2.1,tier-1),craft:'FORGING',out:'EQUIPMENT'};
 const recipe={id:'MP_REC_'+type+'_'+tier,nameTh:'ตำรับสร้าง'+item.nameTh,craft:'FORGING',tier,minMastery:tier*11,days:tier*2,inputs:[{matId:mat,count:2+tier},{matId:'MAT_BP_WOLF_PELT_1',count:slot==='ARMOR'?4:1}],outType:'EQUIPMENT',outItemId:id,outNameTh:item.nameTh,yield:1,gearType:type};
 D.items.push(item);D.recipes.push(recipe);JD.ITEMS.items.push(item);JD.ITEMS.recipes.push(recipe);
}

// 1. Existing 10 MP_ techniques (5 active + 5 passive)
D.techniques=[
 {id:'MP_BOW_RAIN',nameTh:'ฝนศรเจ็ดดารา',path:'XIAN',sub:'STAR_ARCHER',tier:2,grade:'Rare',combatArch:'sweep',element:'ASTRAL',weaponTypes:['BOW'],
  stages:[{stage:1,id:'ST1',nameTh:'ร้อยศรประสาน',reqMastery:0},{stage:2,id:'ST2',nameTh:'ดาราโปรยฟ้า',reqMastery:18}],
  moveDefs:[
   {id:'MP_BOW_RAIN_M1',parentId:'MP_BOW_RAIN',stageReq:1,reqMastery:0,nameTh:'ศรคู่เปิดแนว',arch:'pierce',type:'m',M:1.35,hits:1,cd:8,wind:3,costPct:4.5,pen:20,aoe:false,aiRole:'opener'},
   {id:'MP_BOW_RAIN_M2',parentId:'MP_BOW_RAIN',stageReq:2,reqMastery:18,nameTh:'ฝนศรเจ็ดดารา',arch:'sweep',type:'m',M:1.15,hits:1,cd:12,wind:5,costPct:6.5,pen:10,aoe:true,aiRole:'aoe_pressure'}
  ]},
 {id:'MP_BOW_FOCUS',nameTh:'จิตสงบเหนี่ยวสายศร',path:'XIAN',sub:'STAR_ARCHER',tier:2,grade:'Rare',cat:'PASSIVE',passiveFamily:'FAM_MP_BOW_FOCUS',weaponTypes:['BOW'],passive:{f:{crit:9,acc:24}}},
 {id:'MP_STAFF_WALL',nameTh:'กำแพงพลองพิทักษ์',path:'BODY',sub:'STAFF_GUARD',tier:2,grade:'Rare',combatArch:'guard',element:'EARTH_METAL',weaponTypes:['STAFF']},
 {id:'MP_STAFF_ROOT',nameTh:'หยั่งรากพลองเหล็ก',path:'BODY',sub:'STAFF_GUARD',tier:2,grade:'Rare',cat:'PASSIVE',passiveFamily:'FAM_MP_STAFF_ROOT',weaponTypes:['STAFF'],passive:{p:{def:.15},f:{pen:6}}},
 {id:'MP_SPEAR_LINE',nameTh:'ทวนธงรบทะลวงแนว',path:'GOD',sub:'WAR_DEITY',tier:2,grade:'Rare',combatArch:'pierce',element:'LIGHT_YANG',weaponTypes:['SPEAR']},
 {id:'MP_BLADE_SHADOW',nameTh:'คมเงาตัดชีพจร',path:'DEMON',sub:'SHADOW_ASSASSIN',tier:2,grade:'Rare',combatArch:'flurry',element:'YIN_SHADOW',weaponTypes:['BLADE']},
 {id:'MP_FOCUS_SEAL',nameTh:'ตราจิตผนึกคลื่นฝัน',path:'HEART_SOUL',sub:'DREAM_ILLUSION_WEAVER',tier:2,grade:'Rare',combatArch:'control',element:'ASTRAL',weaponTypes:['FOCUS']},
 {id:'MP_SWORD_POISE',nameTh:'ตั้งจิตรับคมกระบี่',path:'XIAN',sub:'SWORD_IMMORTAL',tier:2,grade:'Rare',cat:'PASSIVE',passiveFamily:'FAM_MP_SWORD_POISE',weaponTypes:['SWORD'],passive:{f:{pen:9,crit:4}}},
 {id:'MP_FIST_BREATH',nameTh:'ลมหายใจพยัคฆ์ไร้ศาสตรา',path:'BODY',sub:'TIGER_SOVEREIGN',tier:2,grade:'Rare',cat:'PASSIVE',passiveFamily:'FAM_MP_FIST_BREATH',weaponTypes:['FIST'],passive:{p:{atk:.12},f:{cast:7}}},
 {id:'MP_ROBE_WARD',nameTh:'อาภรณ์ประสานห้าธาตุ',path:'XIAN',sub:'FIVE_ELEMENTS',tier:2,grade:'Rare',cat:'PASSIVE',passiveFamily:'FAM_MP_ROBE_WARD',armorTypes:['ROBE'],passive:{p:{mdef:.18},f:{cast:8}}}
].map(t=>Object.assign({cat:'COMBAT_TECHNIQUE',role:'COMBAT_DEFENSE',reqTier:t.tier,power:t.tier*42,martialRare:true,moves:[]},t));

D.curriculum=[
 ['XIAN','ฝ่ามือปราณตั้งต้น','strike','NEUTRAL'],['BODY','หมัดหินตั้งต้น','strike','EARTH_METAL'],['GOD','ศรัทธาคุ้มใจตั้งต้น','support','LIGHT_YANG'],['DEMON','เคล็ดโลหิตตั้งต้น','drain','BLOOD_DEMON'],['HEART_SOUL','คลื่นจิตตั้งต้น','control','ASTRAL']
].map(([path,nameTh,combatArch,element])=>({id:'MP_BASE_'+path,nameTh,path,sub:null,tier:1,reqTier:1,grade:'Common',cat:'COMBAT_TECHNIQUE',role:'COMBAT_DEFENSE',combatArch,element,power:30,moves:[],martialBootstrap:true}));
D.curriculum.forEach(t=>JD.TECH.techniques.push(t));
D.techniques.forEach(t=>JD.TECH.techniques.push(t));

// 2. Migrate the 28 pre-existing non-combat PROFESSION_LIFESTYLE / AUX_* entries into unified cat='PASSIVE'
// so they retain their exact IDs, order, and save compatibility while providing real runtime passive mechanics.
const MIGRATED_PROFESSION_PASSIVES={
 ART190_XIAN_065:{passiveFamily:'FAM_MIG_XIAN_ALCH',grade:'Refined',passive:{life:{ALCHEMY:.22},p:{mdef:.05},f:{cast:4}},descTh:'คุมไฟเตาหลอมเสถียร เพิ่มประสิทธิภาพปรุงโอสถ +22% และป้องกันวิชา +5%'},
 ART190_XIAN_066:{passiveFamily:'FAM_MIG_XIAN_TALISMAN',grade:'Refined',passive:{life:{TALISMAN:.24,SCRIPTURE:.10},p:{mdef:.05},f:{acc:10}},descTh:'เดินปราณลงปลายพู่กัน เพิ่มประสิทธิภาพเขียนยันต์ +24% และแม่นยำ +10'},
 ART190_XIAN_067:{passiveFamily:'FAM_MIG_XIAN_ARRAY',grade:'Rare',passive:{life:{ARRAY:.26,construction:.12},p:{def:.06,mdef:.08}},descTh:'ตอกหมุดเชื่อมชีพจรดิน เพิ่มประสิทธิภาพค่ายกล +26% ป้องกัน +6% ป้องกันวิชา +8%'},
 ART190_XIAN_068:{passiveFamily:'FAM_MIG_XIAN_HERB_SOIL',grade:'Refined',passive:{life:{herbalism:.24,MEDICINE:.12},p:{hp:.06},f:{hp:28}},descTh:'ชำระพิษดินฟื้นฟูแปลงสมุนไพร เพิ่มเก็บสมุนไพร +24% และพลังชีวิต +6%'},
 ART190_XIAN_069:{passiveFamily:'FAM_MIG_XIAN_HERB_POLLEN',grade:'Rare',passive:{life:{herbalism:.30,ALCHEMY:.15},p:{hp:.08},qiMaxPct:.08},descTh:'ผสานเกสรบัวหยก เพิ่มเก็บสมุนไพร +30% หลอมโอสถ +15% และปราณสูงสุด +8%'},
 ART190_XIAN_070:{passiveFamily:'FAM_MIG_XIAN_TRADE_ICE',grade:'Rare',passive:{life:{trading:.28,administration:.16},p:{mdef:.10},f:{move:8}},descTh:'ผนึกน้ำแข็งรักษาสินค้า เพิ่มการค้า +28% บริหาร +16% และป้องกันวิชา +10%'},
 ART190_XIAN_071:{passiveFamily:'FAM_MIG_XIAN_NAV',grade:'Common',passive:{life:{survival:.16,trading:.10},f:{move:8,eva:8},qiCostMult:.94},descTh:'จัดสรรปราณเดินเรือ ลดใช้ปราณวิชา 6% และเพิ่มความเร็วเดินทาง +8'},
 ART190_XIAN_072:{passiveFamily:'FAM_MIG_XIAN_GARDEN_TRAP',grade:'Refined',passive:{life:{ARRAY:.16,herbalism:.14},f:{acc:12,eva:10}},descTh:'วางกับดักยันต์เฝ้าสวนยา เพิ่มค่ายกล +16% สมุนไพร +14% และแม่นยำ +12'},
 ART190_BODY_065:{passiveFamily:'FAM_MIG_BODY_HAMMER',grade:'Refined',passive:{life:{FORGING:.25,mining:.12},p:{atk:.06},f:{def:12}},descTh:'ค้อนยักษ์ตีทบเหล็กไหล เพิ่มหลอมศาสตรา +25% ขุดแร่ +12% และโจมตี +6%'},
 ART190_BODY_066:{passiveFamily:'FAM_MIG_BODY_FIRE',grade:'Refined',passive:{life:{ALCHEMY:.18,FORGING:.18},p:{def:.06},f:{hp:32}},descTh:'ไฟกายาสุริยันอุ่นเตา เพิ่มหลอมโอสถและศาสตรา +18% และพลังชีวิต +32'},
 ART190_BODY_067:{passiveFamily:'FAM_MIG_BODY_BEAST_AURA',grade:'Rare',passive:{life:{BEAST_TAMING:.26,hunting:.20},p:{atk:.07,def:.05}},descTh:'กลิ่นอายราชันย์ข่มอสูร เพิ่มฝึกอสูร +26% ล่าสัตว์ +20% และโจมตี +7%'},
 ART190_BODY_068:{passiveFamily:'FAM_MIG_BODY_BEAST_PACT',grade:'Rare',passive:{life:{BEAST_TAMING:.24,MEDICINE:.14},p:{hp:.09,atk:.05}},descTh:'ผสานโลหิตเชื่อมใจอสูร เพิ่มฝึกอสูร +24% และพลังชีวิตสูงสุด +9%'},
 ART190_BODY_069:{passiveFamily:'FAM_MIG_BODY_MINE_PILLAR',grade:'Rare',passive:{life:{mining:.30,construction:.20},p:{def:.10,hp:.06}},descTh:'ขุดเจาะสายแร่ตอกเสาค่าย เพิ่มขุดแร่ +30% ก่อสร้าง +20% และป้องกัน +10%'},
 ART190_BODY_070:{passiveFamily:'FAM_MIG_BODY_EARTH_TILL',grade:'Exceptional',passive:{life:{herbalism:.26,mining:.22},p:{hp:.12,def:.08}},descTh:'พลิกฟื้นหน้าดินด้วยปราณปฐพี เพิ่มสมุนไพร +26% ขุดแร่ +22% และพลังชีวิต +12%'},
 ART190_BODY_071:{passiveFamily:'FAM_MIG_BODY_LOGISTICS',grade:'Common',passive:{life:{survival:.16,construction:.12},p:{hp:.04},f:{move:6,def:10}},descTh:'แบกหามยุทธปัจจัยข้ามเขา เพิ่มเอาตัวรอด +16% ความเร็ว +6 และป้องกัน +10'},
 ART190_BODY_072:{passiveFamily:'FAM_MIG_BODY_ROCK_TRAP',grade:'Refined',passive:{life:{hunting:.18,survival:.14},f:{atk:14,pen:5}},descTh:'วางกับดักหินถล่ม เพิ่มล่าสัตว์ +18% โจมตีกายภาพ +14 และเจาะเกราะ +5%'},
 ART190_GOD_065:{passiveFamily:'FAM_MIG_GOD_TALISMAN',grade:'Refined',passive:{life:{TALISMAN:.25,SCRIPTURE:.12},p:{mdef:.07},f:{cast:5}},descTh:'จารึกยันต์เทวโองการ เพิ่มเขียนยันต์ +25% คัมภีร์ +12% และป้องกันวิชา +7%'},
 ART190_GOD_066:{passiveFamily:'FAM_MIG_GOD_TEMPLE_FORGE',grade:'Refined',passive:{life:{FORGING:.24,TALISMAN:.12},p:{def:.06,mdef:.06}},descTh:'หลอมศาสตราด้วยเพลิงวิหาร เพิ่มตีเหล็ก +24% และป้องกันทั้งสองสาย +6%'},
 ART190_GOD_067:{passiveFamily:'FAM_MIG_GOD_HOLY_SOIL',grade:'Rare',passive:{life:{herbalism:.26,MEDICINE:.18},p:{hp:.08,mdef:.06}},descTh:'พรมน้ำมนต์ชำระพิษดิน เพิ่มสมุนไพร +26% การแพทย์ +18% และพลังชีวิต +8%'},
 ART190_GOD_068:{passiveFamily:'FAM_MIG_GOD_SEASON_BLESS',grade:'Rare',passive:{life:{herbalism:.28,cooking:.16},p:{hp:.09},qiMaxPct:.06},descTh:'อวยพรฤดูกาลเร่งเกสร เพิ่มสมุนไพร +28% ทำอาหาร +16% และพลังชีวิต +9%'},
 ART190_GOD_069:{passiveFamily:'FAM_MIG_GOD_BEAST_PACT',grade:'Rare',passive:{life:{BEAST_TAMING:.30,diplomacy:.15},p:{def:.08,mdef:.08}},descTh:'พันธสัญญาเทพอสูรคู่บารมี เพิ่มฝึกอสูร +30% และป้องกัน/ป้องกันวิชา +8%'},
 ART190_GOD_070:{passiveFamily:'FAM_MIG_GOD_TRADE_SEAL',grade:'Exceptional',passive:{life:{trading:.30,administration:.20},p:{mdef:.12},f:{acc:14}},descTh:'ผนึกตราเทวัญรักษาสินค้า เพิ่มการค้า +30% บริหาร +20% และป้องกันวิชา +12%'},
 ART190_GOD_071:{passiveFamily:'FAM_MIG_GOD_DIVINE_NAV',grade:'Common',passive:{life:{survival:.15,trading:.12},f:{move:7,acc:10},qiCostMult:.95},descTh:'คำนวณฤกษ์ยามเดินนาวาปราณ ลดใช้ปราณ 5% ความเร็วเดินทาง +7 และแม่นยำ +10'},
 ART190_GOD_072:{passiveFamily:'FAM_MIG_GOD_TOTEM_WARD',grade:'Refined',passive:{life:{ARRAY:.18,administration:.12},p:{def:.05,mdef:.05},f:{acc:10}},descTh:'วางเขตแดนเทวรูปสะกดผู้บุกรุก เพิ่มค่ายกล +18% และป้องกัน/ป้องกันวิชา +5%'},
 AUX_PILL_NINE_REVOLUTIONS:{passiveFamily:'FAM_MIG_AUX_PILL9',grade:'Exceptional',passive:{life:{ALCHEMY:.35,MEDICINE:.20},p:{mdef:.10,hp:.08},qiMaxPct:.10},descTh:'ศาสตร์หลอมโอสถเก้าวัฏจักร เพิ่มปรุงโอสถ +35% การแพทย์ +20% และปราณสูงสุด +10%'},
 AUX_WEAPON_HEAVEN_FORGE:{passiveFamily:'FAM_MIG_AUX_FORGE',grade:'Exceptional',passive:{life:{FORGING:.35,mining:.20},p:{atk:.10,def:.08},pp:{pen:8}},descTh:'ศาสตร์หลอมศาสตราค้อนสวรรค์ เพิ่มตีเหล็ก +35% โจมตี +10% และเจาะเกราะ +8%'},
 AUX_ARRAY_STARS:{passiveFamily:'FAM_MIG_AUX_ARRAY',grade:'Exceptional',passive:{life:{ARRAY:.38,TALISMAN:.22},p:{mdef:.14,acc:.10},f:{cast:10}},descTh:'ตำราค่ายกลดาราจักรแปดทิศ เพิ่มค่ายกล +38% ป้องกันวิชา +14% และร่ายไว +10'},
 AUX_BEAST_BLOOD_PACT:{passiveFamily:'FAM_MIG_AUX_BEAST',grade:'Exceptional',passive:{life:{BEAST_TAMING:.36,hunting:.22},p:{atk:.09,hp:.10},f:{move:10}},descTh:'มนตราพันธสัญญาโลหิตหมื่นอสูร เพิ่มฝึกอสูร +36% ล่าสัตว์ +22% และพลังชีวิต +10%'}
};
D.MIGRATED_PROFESSION_PASSIVES=MIGRATED_PROFESSION_PASSIVES;
[...JD.TECH.techniques, ...JD.TECH.mantras].forEach(t=>{
 if(MIGRATED_PROFESSION_PASSIVES[t.id]){
  const spec=MIGRATED_PROFESSION_PASSIVES[t.id];
  t.origCat=t.cat;
  t.legacyCat='AUXILIARY_ART';
  t.cat='PASSIVE';
  t.grade=spec.grade;
  t.passiveFamily=spec.passiveFamily;
  t.passive=spec.passive;
  t.descTh=spec.descTh;
  t.migratedPassive=true;
 }
});

// 3. 64 Brand-New Learnable Passive Techniques (ordinary, refined, rare, exceptional)
// Combined with 5 MP_ passives + 28 migrated profession passives + 3 Legendary passives = 100 distinct PASSIVE IDs.
D.overhaulPassives=[
 // --- A. Weapon Disciplines (14) ---
 {id:'PASS_SWORD_FAMILIAR_T1',nameTh:'คุ้นเคยคมกระบี่พื้นฐาน',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_WEAPON_SWORD_FLAT',weaponTypes:['SWORD'],passive:{f:{atk:12,matk:12,acc:10}},descTh:'จับกระบี่มั่นคง เพิ่มโจมตี +12 โจมตีวิชา +12 และแม่นยำ +10 เมื่อถือกระบี่'},
 {id:'PASS_SWORD_EDGE_T3',nameTh:'เคล็ดลับคมกระบี่ทะลวงจุด',path:'ANY',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_WEAPON_SWORD_FLAT',weaponTypes:['SWORD'],passive:{f:{atk:28,matk:28,acc:18},pp:{pen:6}},descTh:'คมกระบี่เฉียบขาด เพิ่มโจมตี +28 แม่นยำ +18 และเจาะเกราะ +6% เมื่อถือกระบี่'},
 {id:'PASS_SWORD_INTENT_T3',nameTh:'เจตจำนงกระบี่กระจ่างใจ',path:'XIAN',sub:'SWORD_IMMORTAL',tier:3,grade:'Rare',passiveFamily:'FAM_SWORD_INTENT',weaponTypes:['SWORD'],passive:{p:{atk:.11,matk:.11},pp:{crit:6,critDmg:14}},descTh:'เจตจำนงกระบี่ประสานปราณ เพิ่มโจมตี/วิชา +11% อัตราคริ +6% แรงคริ +14% เมื่อถือกระบี่'},
 {id:'PASS_SWORD_HEART_CLARITY_T5',nameTh:'กระบี่ในใจไร้สิ่งกั้น',path:'HEART_SOUL',sub:'MIND_SWORD_TELEKINESIS',tier:5,grade:'Exceptional',passiveFamily:'FAM_SWORD_INTENT',weaponTypes:['SWORD','FOCUS'],passive:{p:{matk:.16,acc:.12},pp:{pen:14,crit:8}},descTh:'รวมจิตเป็นกระบี่ เพิ่มโจมตีวิชา +16% แม่นยำ +12% เจาะเกราะ +14% และคริ +8%'},
 {id:'PASS_BLADE_FOUNDATION_T1',nameTh:'รากฐานดาบหนักผ่าศิลา',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_WEAPON_BLADE',weaponTypes:['BLADE'],passive:{f:{atk:18,cast:-4}},descTh:'ฟันดาบเต็มแรง เพิ่มโจมตีกายภาพ +18 แต่ความเร็วร่ายลดลง -4 เมื่อถือดาบ'},
 {id:'PASS_BLADE_HEAVY_CLEAVE_T3',nameTh:'เคล็ดดาบยักษ์สะบั้นทัพ',path:'ANY',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_WEAPON_BLADE',weaponTypes:['BLADE'],passive:{p:{atk:.14},f:{atk:22,cast:-6},pp:{critDmg:16}},descTh:'หน่วงน้ำหนักดาบฟาดฟัน เพิ่มโจมตี +14% (+22) แรงคริ +16% แต่ร่ายช้าลง -6'},
 {id:'PASS_BLADE_BLOOD_EDGE_T5',nameTh:'คมดาบกระหายโลหิต',path:'DEMON',sub:null,tier:5,grade:'Exceptional',passiveFamily:'FAM_BLADE_BLOOD',weaponTypes:['BLADE'],passive:{p:{atk:.17},pp:{crit:8,critDmg:24},f:{def:-18}},descTh:'ดาบมารอาบโลหิต เพิ่มโจมตี +17% คริ +8% แรงคริ +24%แลกกับป้องกัน -18'},
 {id:'PASS_SPEAR_REACH_T1',nameTh:'ระยะทวนได้เปรียบหนึ่งนิ้ว',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_WEAPON_SPEAR',weaponTypes:['SPEAR'],passive:{f:{acc:16,atk:10},pp:{pen:5}},descTh:'ทวนยาวคุมระยะ เพิ่มแม่นยำ +16 โจมตี +10 และเจาะเกราะ +5% เมื่อถือหอก/ทวน'},
 {id:'PASS_SPEAR_DRAGON_SPINE_T3',nameTh:'กระดูกสันหลังมังกรสถิตทวน',path:'BODY',sub:null,tier:3,grade:'Rare',passiveFamily:'FAM_WEAPON_SPEAR',weaponTypes:['SPEAR'],passive:{p:{atk:.12,acc:.08},pp:{pen:11}},descTh:'ส่งแรงจากเอวสู่ปลายทวน เพิ่มโจมตี +12% แม่นยำ +8% และเจาะเกราะ +11%'},
 {id:'PASS_SPEAR_PIERCING_AURA_T5',nameTh:'รัศมีทวนศึกทะลวงค่าย',path:'GOD',sub:'WAR_DEITY',tier:5,grade:'Exceptional',passiveFamily:'FAM_SPEAR_WAR',weaponTypes:['SPEAR'],passive:{p:{atk:.15,def:.10},pp:{pen:16}},descTh:'ทวนเทพสงครามทะลวงแนวรบ เพิ่มโจมตี +15% ป้องกัน +10% และเจาะเกราะ +16%'},
 {id:'PASS_STAFF_GUARD_T1',nameTh:'ตั้งพลองขวางด่านหน้า',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_WEAPON_STAFF',weaponTypes:['STAFF'],passive:{f:{def:18,mdef:12}},descTh:'ควงพลองปัดป้องคมอาวุธ เพิ่มป้องกัน +18 และป้องกันวิชา +12 เมื่อถือพลอง'},
 {id:'PASS_STAFF_PILLAR_STANCE_T4',nameTh:'พลองเสาค้ำสวรรค์ไม่สั่นคลอน',path:'BODY',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_WEAPON_STAFF',weaponTypes:['STAFF'],passive:{p:{def:.16,mdef:.12},f:{hp:45,move:-4}},descTh:'ปักพลองมั่นดั่งเสาหลัก เพิ่มป้องกัน +16% ป้องกันวิชา +12% เลือด +45 แต่เดินช้าลง -4'},
 {id:'PASS_FIST_FOUNDATION_T1',nameTh:'รากฐานหมัดมวยไร้ศาสตรา',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_WEAPON_FIST',weaponTypes:['FIST'],passive:{f:{atk:14,cast:5}},descTh:'หมัดเท้าคล่องแคล่ว เพิ่มโจมตี +14 และความเร็วร่าย +5 เมื่อใช้สนับหมัดหรือมือเปล่า'},
 {id:'PASS_FIST_IRON_KNUCKLE_T4',nameTh:'หมัดเหล็กไหลทะลวงเกราะใน',path:'BODY',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_WEAPON_FIST',weaponTypes:['FIST'],passive:{p:{atk:.14},f:{cast:8},pp:{pen:12}},descTh:'ข้อนิ้วแกร่งดั่งเหล็กไหล เพิ่มโจมตี +14% ความเร็วร่าย +8 และเจาะเกราะ +12%'},

 // --- B. Bow, Focus & Armor Disciplines (12) ---
 {id:'PASS_BOW_STILLNESS_T1',nameTh:'นิ่งดั่งศิลาก่อนปล่อยศร',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_WEAPON_BOW',weaponTypes:['BOW'],passive:{f:{acc:22,move:-5},pp:{crit:5}},descTh:'ตั้งหลักเล็งนิ่ง เพิ่มแม่นยำ +22 อัตราคริ +5% แต่ความเร็วเคลื่อนที่ -5 เมื่อถือธนู'},
 {id:'PASS_FOCUS_MERIDIAN_T3',nameTh:'สื่อปราณเชื่อมจุดตันเถียน',path:'ANY',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_WEAPON_FOCUS',weaponTypes:['FOCUS'],passive:{p:{matk:.12},f:{cast:8},qiCostMult:.92},descTh:'ใช้สื่อปราณคล่องมือ เพิ่มโจมตีวิชา +12% ร่ายไว +8 และลดใช้ปราณ 8%'},
 {id:'PASS_IRON_SHIRT_T1',nameTh:'เคล็ดเสื้อเหล็กขั้นต้น',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_IRON_SHIRT',passive:{f:{def:20,hp:30,move:-4}},descTh:'เกร็งกล้ามเนื้อรับแรงปะทะ เพิ่มป้องกัน +20 พลังชีวิต +30 แต่เคลื่อนที่ช้าลง -4'},
 {id:'PASS_IRON_SHIRT_T3',nameTh:'เคล็ดเสื้อเหล็กสำริดหลอมกาย',path:'BODY',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_IRON_SHIRT',passive:{p:{def:.14},f:{def:28,hp:65,move:-6}},descTh:'เสื้อเหล็กขั้นสูง เพิ่มป้องกัน +14% (+28) พลังชีวิต +65 แต่เคลื่อนที่ช้าลง -6'},
 {id:'PASS_ROOTED_STANCE_T2',nameTh:'ท่ายืนหยั่งรากสนพันปี',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_ROOTED_STANCE',passive:{p:{def:.10,mdef:.10},f:{eva:-8}},descTh:'ปักหลักมั่นคงไม่ถอยหนี เพิ่มป้องกันและป้องกันวิชา +10% แต่หลบหลีก -8'},
 {id:'PASS_ROOTED_MOUNTAIN_T5',nameTh:'ปราการขุนเขาอचलะ',path:'BODY',sub:'TITAN_MOUNTAIN_BODY',tier:5,grade:'Exceptional',passiveFamily:'FAM_ROOTED_STANCE',passive:{p:{def:.20,mdef:.14,hp:.12},f:{move:-8}},descTh:'หนักแน่นดั่งขุนเขา เพิ่มป้องกัน +20% ป้องกันวิชา +14% เลือด +12% แต่เคลื่อนที่ -8'},
 {id:'PASS_SOFT_FORCE_T2',nameTh:'เคล็ดอ่อนสยบแข็งผ่อนแรง',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_SOFT_FORCE',passive:{p:{mdef:.09,eva:.08},f:{def:10}},descTh:'สลายแรงปะทะด้วยความอ่อนหยุ่น เพิ่มป้องกันวิชา +9% หลบหลีก +8% และป้องกัน +10'},
 {id:'PASS_LASTING_BREATH_T2',nameTh:'ลมหายใจเต่าจำศีลประคองชีพ',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_LASTING_BREATH',passive:{p:{hp:.07,def:.06},cond:{hpBelowPct:50,p:{def:.14,mdef:.14}}},descTh:'เพิ่มเลือด +7% ป้องกัน +6% และเมื่อเลือดต่ำกว่า 50% จะได้ป้องกัน/ป้องกันวิชาเพิ่มอีก +14%'},
 {id:'PASS_BROKEN_RHYTHM_T3',nameTh:'เคล็ดขัดจังหวะทลายคม',path:'ANY',sub:null,tier:3,grade:'Rare',passiveFamily:'FAM_BROKEN_RHYTHM',passive:{p:{eva:.10,def:.08},f:{cast:6}},descTh:'ก้าวผิดจังหวะลวงศัตรู เพิ่มหลบหลีก +10% ป้องกัน +8% และความเร็วร่าย +6'},
 {id:'PASS_HEAVY_ARMOR_MASTERY_T3',nameTh:'ชำนาญศึกเกราะหนักพิทักษ์',path:'BODY',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_ARMOR_MASTERY',armorTypes:['HEAVY'],passive:{p:{def:.15,hp:.08},f:{move:4}},descTh:'สวมเกราะหนักดั่งเสื้อผ้า เพิ่มป้องกัน +15% เลือด +8% และชดเชยความเร็วเดิน +4'},
 {id:'PASS_LIGHT_ARMOR_SHADOW_T3',nameTh:'ชำนาญเกราะเบาเร้นกาย',path:'DEMON',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_ARMOR_MASTERY',armorTypes:['LIGHT'],passive:{p:{eva:.14},f:{move:10},pp:{crit:5}},descTh:'เกราะเบาแนบกายไร้เสียง เพิ่มหลบหลีก +14% ความเร็ว +10 และคริ +5% เมื่อสวมเกราะเบา'},
 {id:'PASS_ROBE_SPIRIT_WEAVE_T4',nameTh:'อาภรณ์เซียนถักทอสายปราณ',path:'HEART_SOUL',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_ARMOR_MASTERY',armorTypes:['ROBE'],passive:{p:{mdef:.16,matk:.08},f:{cast:10}},descTh:'อาภรณ์ซึมซับปราณฟ้าดิน เพิ่มป้องกันวิชา +16% โจมตีวิชา +8% และร่ายไว +10 เมื่อสวมอาภรณ์'},

 // --- C. Resource, Qi & Cultivation Passives (12) ---
 {id:'PASS_DEEP_RESERVOIR_T1',nameTh:'ตันเถียนลึกกักเก็บปราณ',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_DEEP_RESERVOIR',passive:{qiMaxFlat:20,qiMaxPct:.08,f:{mdef:8}},descTh:'ขยายความจุตันเถียน เพิ่มปราณสูงสุด +20 (+8%) และป้องกันวิชา +8'},
 {id:'PASS_DEEP_RESERVOIR_T3',nameTh:'ทะเลปราณกว้างใหญ่ไร้ก้นบึ้ง',path:'XIAN',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_DEEP_RESERVOIR',passive:{qiMaxFlat:48,qiMaxPct:.16,p:{mdef:.08}},descTh:'ตันเถียนกว้างดั่งทะเล เพิ่มปราณสูงสุด +48 (+16%) และป้องกันวิชา +8%'},
 {id:'PASS_VAST_OCEAN_DANTIAN_T5',nameTh:'มหาสมุทรปราณเก้าชั้นฟ้า',path:'XIAN',sub:null,tier:5,grade:'Exceptional',passiveFamily:'FAM_DEEP_RESERVOIR',passive:{qiMaxFlat:95,qiMaxPct:.26,p:{matk:.10,mdef:.12}},descTh:'ตันเถียนดั่งมหาสมุทร เพิ่มปราณสูงสุด +95 (+26%) โจมตีวิชา +10% และป้องกันวิชา +12%'},
 {id:'PASS_CAREFUL_CIRCULATION_T2',nameTh:'โคจรปราณประหยัดไร้รั่วไหล',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_QI_CIRCULATION',passive:{qiCostMult:.86,f:{cast:5}},descTh:'ควบคุมเส้นปราณละเอียดอ่อน ลดการใช้ปราณของวิชาลง 14% และเพิ่มความเร็วร่าย +5'},
 {id:'PASS_PERFECT_CIRCULATION_T4',nameTh:'วงจรปราณไร้รอยต่อหมุนเวียน',path:'XIAN',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_QI_CIRCULATION',passive:{qiCostMult:.78,f:{cast:10},qiMaxPct:.10},descTh:'ปราณหมุนเวียนคืนต้นกำเนิด ลดการใช้ปราณวิชาลง 22% ร่ายไว +10 และปราณสูงสุด +10%'},
 {id:'PASS_RETURNING_BREATH_T2',nameTh:'ลมหายใจหวนคืนหลังออกกระบวนท่า',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_RETURNING_BREATH',passive:{qiMaxPct:.08,f:{hp:25},proc:{kind:'combatTick',icdTicks:6,qiRestorePct:.035}},descTh:'ปราณสูงสุด +8% เลือด +25 และฟื้นฟูปราณ 3.5% ทุก 6 นาทีระหว่างต่อสู้'},
 {id:'PASS_NINE_BREATH_CYCLE_T4',nameTh:'วัฏจักรเก้าลมหายใจคืนปราณ',path:'GOD',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_RETURNING_BREATH',passive:{qiMaxPct:.14,p:{hp:.08},proc:{kind:'combatTick',icdTicks:5,qiRestorePct:.05,hpRestorePct:.02}},descTh:'ปราณสูงสุด +14% เลือด +8% และฟื้นปราณ 5% + เลือด 2% ทุก 5 นาทีระหว่างต่อสู้'},
 {id:'PASS_QUIET_HEART_T1',nameTh:'จิตสงบนิ่งดั่งน้ำในบ่อ',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_QUIET_HEART',passive:{cultRatePct:.08,f:{mdef:12,acc:8}},descTh:'รักษาใจไม่ให้ฟุ้งซ่าน เพิ่มอัตราบำเพ็ญตบะ +8% ป้องกันวิชา +12 และแม่นยำ +8'},
 {id:'PASS_MIRROR_HEART_T3',nameTh:'กระจกใจส่องธรรมไร้จิตมาร',path:'HEART_SOUL',sub:null,tier:3,grade:'Rare',passiveFamily:'FAM_QUIET_HEART',passive:{cultRatePct:.16,p:{mdef:.12,acc:.08}},descTh:'จิตใสดั่งกระจกเงา เพิ่มอัตราบำเพ็ญตบะ +16% ป้องกันวิชา +12% และแม่นยำ +8%'},
 {id:'PASS_MERIDIAN_DISCIPLINE_T2',nameTh:'ระเบียบเส้นลมปราณสิบสองสาย',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_MERIDIAN_DISC',passive:{p:{matk:.08,mdef:.06},qiMaxPct:.08},descTh:'จัดระเบียบเส้นปราณหลัก เพิ่มโจมตีวิชา +8% ป้องกันวิชา +6% และปราณสูงสุด +8%'},
 {id:'PASS_GOLDEN_CORE_PULSE_T4',nameTh:'ชีพจรแก่นทองคำสูบฉีด',path:'XIAN',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_MERIDIAN_DISC',passive:{p:{atk:.10,matk:.12,hp:.08},cultRatePct:.12},descTh:'แก่นปราณหนุนเนื่อง เพิ่มโจมตี +10% โจมตีวิชา +12% เลือด +8% และอัตราบำเพ็ญ +12%'},
 {id:'PASS_PRIMORDIAL_ROOT_NURTURE_T5',nameTh:'หล่อเลี้ยงรากวิญญาณต้นกำเนิด',path:'ANY',sub:null,tier:5,grade:'Exceptional',passiveFamily:'FAM_ROOT_NURTURE',passive:{p:{hp:.14,mdef:.14},qiMaxPct:.18,cultRatePct:.18},descTh:'บำรุงรากปราณลึกถึงแก่น เพิ่มเลือด +14% ป้องกันวิชา +14% ปราณสูงสุด +18% และบำเพ็ญ +18%'},

 // --- D. Precision, Tempo & Combat-State Passives (14) ---
 {id:'PASS_CLEAR_SIGHT_T1',nameTh:'สายตากระจ่างอ่านวิถีคม',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_CLEAR_SIGHT',passive:{f:{acc:18},pp:{crit:3}},descTh:'มองเห็นจังหวะเคลื่อนไหวชัดเจน เพิ่มความแม่นยำ +18 และอัตราคริ +3%'},
 {id:'PASS_HAWK_EYE_T3',nameTh:'เนตรเหยี่ยวเวหาเล็งจุดตาย',path:'ANY',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_CLEAR_SIGHT',passive:{f:{acc:36},pp:{crit:6,pen:8}},descTh:'สายตาคมกริบดั่งเหยี่ยวเวหา เพิ่มความแม่นยำ +36 อัตราคริ +6% และเจาะเกราะ +8%'},
 {id:'PASS_READING_OPENINGS_T2',nameTh:'อ่านช่องโหว่จังหวะถอนกระบวนท่า',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_READING_OPENINGS',passive:{pp:{crit:5,pen:7},cond:{requiresDebuffOnTarget:true,pp:{crit:8,critDmg:18}}},descTh:'คริ +5% เจาะเกราะ +7% และเมื่อเป้าหมายติดสถานะผิดปกติจะเพิ่มคริอีก +8% แรงคริ +18%'},
 {id:'PASS_FLAW_SEEKER_T4',nameTh:'เนตรส่องรอยร้าวร้อยช่องโหว่',path:'XIAN',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_READING_OPENINGS',passive:{pp:{crit:9,critDmg:22,pen:12}},descTh:'มองเห็นรอยร้าวในกระบวนท่าศัตรู เพิ่มอัตราคริ +9% ความแรงคริ +22% และเจาะเกราะ +12%'},
 {id:'PASS_MEASURED_FOOTWORK_T1',nameTh:'ฝีเท้าวัดระยะรุกถอย',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_MEASURED_FOOTWORK',passive:{f:{eva:16,move:7},p:{atk:-.03}},descTh:'เน้นก้าวหลบปลอดภัย เพิ่มหลบหลีก +16 ความเร็วเคลื่อนที่ +7 แต่โจมตีกายภาพ -3%'},
 {id:'PASS_GHOST_SHADOW_STEP_T3',nameTh:'ฝีเท้าเงาพรายไร้เสียง',path:'DEMON',sub:'SHADOW_ASSASSIN',tier:3,grade:'Rare',passiveFamily:'FAM_MEASURED_FOOTWORK',passive:{p:{eva:.14},f:{move:12},pp:{crit:6}},descTh:'ย่างก้าวเงาพราย เพิ่มหลบหลีก +14% ความเร็วเคลื่อนที่ +12 และอัตราคริ +6%'},
 {id:'PASS_SWIFT_RECOVERY_T2',nameTh:'พลิกข้อมือร่ายวิชาต่อเนื่อง',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_SWIFT_TEMPO',passive:{f:{cast:12,acc:10}},descTh:'ลดจังหวะหน่วงหลังออกท่า เพิ่มความเร็วร่ายวิชา +12 และความแม่นยำ +10'},
 {id:'PASS_WIND_CHANT_TEMPO_T4',nameTh:'จังหวะสายลมร่ายมนตราไม่ขาดสาย',path:'XIAN',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_SWIFT_TEMPO',passive:{f:{cast:20,move:8},p:{matk:.08}},descTh:'ผสานปราณเข้ากับสายลม เพิ่มความเร็วร่าย +20 ความเร็วเดิน +8 และโจมตีวิชา +8%'},
 {id:'PASS_CALM_UNDER_PRESSURE_T2',nameTh:'สงบเยือกเย็นท่ามกลางวิกฤต',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_PRESSURE_STATE',passive:{p:{mdef:.06},cond:{hpBelowPct:45,p:{def:.18,mdef:.18},f:{cast:10}}},descTh:'ป้องกันวิชา +6% และเมื่อเลือดต่ำกว่า 45% จะตั้งสติเพิ่มป้องกัน/ป้องกันวิชา +18% ร่ายไว +10'},
 {id:'PASS_DESPERATE_FURY_T3',nameTh:'พยัคฆ์บาดเจ็บคำรามสู้ตาย',path:'BODY',sub:null,tier:3,grade:'Rare',passiveFamily:'FAM_PRESSURE_STATE',passive:{p:{atk:.06},cond:{hpBelowPct:40,p:{atk:.22,def:-.06},pp:{crit:8,critDmg:20}}},descTh:'โจมตี +6% และเมื่อเลือดต่ำกว่า 40% จะระเบิดพลังโจมตี +22% คริ +8% แรงคริ +20% (ป้องกัน -6%)'},
 {id:'PASS_FIRST_STRIKE_MOMENTUM_T2',nameTh:'เปิดฉากคมแรกไร้ผู้ต้าน',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_OPENING_STATE',passive:{f:{acc:12},cond:{hpAbovePct:80,p:{atk:.12,matk:.12},pp:{crit:6}}},descTh:'แม่นยำ +12 และขณะที่พลังชีวิตเกิน 80% จะได้โจมตี/โจมตีวิชา +12% และอัตราคริ +6%'},
 {id:'PASS_EXECUTIONER_INSTINCT_T4',nameTh:'สัญชาตญาณเพชฌฆาตปิดบัญชี',path:'DEMON',sub:null,tier:4,grade:'Rare',passiveFamily:'FAM_EXECUTION_STATE',passive:{pp:{pen:10,critDmg:18},p:{atk:.08},cond:{targetHpBelowPct:45,pp:{crit:8,critDmg:16}}},descTh:'โจมตี +8% เจาะเกราะ +10% แรงคริ +18% และเมื่อเป้าหมายเลือดต่ำกว่า 45% จะได้คริ +8% แรงคริ +16%'},
 {id:'PASS_POISON_BLOOD_AFFINITY_T3',nameTh:'ชีพจรพิษโลหิตซึมลึก',path:'DEMON',sub:'VENOM_GU_SOVEREIGN',tier:3,grade:'Rare',passiveFamily:'FAM_VENOM_BLOOD',passive:{p:{matk:.11,mdef:.07},pp:{pen:9},life:{POISON:.25}},descTh:'หลอมพิษเข้ากับปราณ เพิ่มโจมตีวิชา +11% เจาะเกราะ +9% และความชำนาญพิษ +25%'},
 {id:'PASS_SOUL_RESONANCE_WARD_T3',nameTh:'กำแพงคลื่นจิตสะท้อนมายา',path:'HEART_SOUL',sub:null,tier:3,grade:'Rare',passiveFamily:'FAM_SOUL_WARD',passive:{p:{mdef:.15,eva:.07},f:{acc:18}},descTh:'กางม่านสำนึกคุ้มครองดวงจิต เพิ่มป้องกันวิชา +15% หลบหลีก +7% และความแม่นยำ +18'},

 // --- E. Professions, Exploration & Subpath Synergy (12) ---
 {id:'PASS_STEADY_ALCHEMY_HAND_T1',nameTh:'หัตถ์โอสถมั่นคงไม่สั่นไหว',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_PROF_ALCHEMY',passive:{life:{ALCHEMY:.16},f:{mdef:10,acc:8}},descTh:'ประคองไฟและสมุนไพรอย่างนิ่งสงบ เพิ่มความสำเร็จปรุงโอสถ +16% ป้องกันวิชา +10'},
 {id:'PASS_PILL_FIRE_HARMONY_T3',nameTh:'ประสานไฟโอสถหยินหยาง',path:'XIAN',sub:'ELIXIR_DAO',tier:3,grade:'Rare',passiveFamily:'FAM_PROF_ALCHEMY',passive:{life:{ALCHEMY:.28,MEDICINE:.18},p:{hp:.08,mdef:.08}},descTh:'เข้าใจไฟโอสถถ่องแท้ เพิ่มปรุงโอสถ +28% การแพทย์ +18% เลือดและป้องกันวิชา +8%'},
 {id:'PASS_SMITH_EYE_T1',nameTh:'เนตรช่างหลอมคัดเนื้อเหล็ก',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_PROF_FORGING',passive:{life:{FORGING:.16,mining:.12},f:{atk:10,def:10}},descTh:'มองเห็นลายแร่และจุดเปราะ เพิ่มตีเหล็ก +16% ขุดแร่ +12% โจมตีและป้องกัน +10'},
 {id:'PASS_ANVIL_SOUL_T3',nameTh:'จิตวิญญาณทั่งเหล็กพันค้อน',path:'BODY',sub:'SOLAR_FORGE',tier:3,grade:'Rare',passiveFamily:'FAM_PROF_FORGING',passive:{life:{FORGING:.28,mining:.18},p:{atk:.09,def:.09},pp:{pen:6}},descTh:'หลอมจิตเข้ากับค้อนและทั่ง เพิ่มตีเหล็ก +28% ขุดแร่ +18% โจมตี/ป้องกัน +9%'},
 {id:'PASS_HERBAL_DISCERNMENT_T1',nameTh:'จำแนกสมุนไพรร้อยพิษร้อยยา',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_PROF_HERB',passive:{life:{herbalism:.18,MEDICINE:.12},f:{hp:26}},descTh:'ดมกลิ่นแยกแยะสมุนไพรแม่นยำ เพิ่มเก็บสมุนไพร +18% การแพทย์ +12% และเลือด +26'},
 {id:'PASS_SPIRIT_BOTANY_T3',nameTh:'ศาสตร์พฤกษาวิญญาณหยั่งราก',path:'GOD',sub:'HARVEST_EARTH_GOD',tier:3,grade:'Rare',passiveFamily:'FAM_PROF_HERB',passive:{life:{herbalism:.30,ALCHEMY:.14},p:{hp:.10,def:.06}},descTh:'สื่อสารกับชีพจรพฤกษา เพิ่มเก็บสมุนไพร +30% ปรุงโอสถ +14% และพลังชีวิต +10%'},
 {id:'PASS_TRAIL_READER_T1',nameTh:'อ่านรอยเท้าและลมหายใจป่า',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_PROF_TRAIL',passive:{life:{survival:.18,hunting:.14},f:{move:8,eva:10}},descTh:'ชำนาญเส้นทางป่าเขา เพิ่มเอาตัวรอด +18% ล่าสัตว์ +14% ความเร็วเดิน +8 และหลบหลีก +10'},
 {id:'PASS_WILD_HUNTER_SENSE_T3',nameTh:'สัมผัสพรานใหญ่สะกดรอยอสูร',path:'ANY',sub:null,tier:3,grade:'Refined',passiveFamily:'FAM_PROF_TRAIL',passive:{life:{hunting:.26,BEAST_TAMING:.20,survival:.16},f:{acc:22},pp:{crit:5}},descTh:'รู้เท่าทันอสูรป่า เพิ่มล่าสัตว์ +26% ฝึกอสูร +20% แม่นยำ +22 และอัตราคริ +5%'},
 {id:'PASS_SCRIPTURE_INTERPRETATION_T1',nameTh:'ตีความอักขระโบราณเบื้องต้น',path:'ANY',sub:null,tier:1,grade:'Common',passiveFamily:'FAM_PROF_SCRIPTURE',passive:{life:{SCRIPTURE:.20},f:{matk:12,cast:4}},descTh:'เข้าใจรากศัพท์คัมภีร์โบราณ เพิ่มความเร็วศึกษาคัมภีร์ +20% โจมตีวิชา +12 และร่ายไว +4'},
 {id:'PASS_SAGE_CALLIGRAPHY_MIND_T3',nameTh:'จิตปราชญ์พู่กันจารึกเต๋า',path:'HEART_SOUL',sub:'CALLIGRAPHY_PAINTING_SAGE',tier:3,grade:'Rare',passiveFamily:'FAM_PROF_SCRIPTURE',passive:{life:{SCRIPTURE:.30,TALISMAN:.20,ARRAY:.16},p:{matk:.10},f:{cast:8}},descTh:'ตวัดพู่กันสื่อความหมายฟ้าดิน เพิ่มศึกษาคัมภีร์ +30% ยันต์ +20% และโจมตีวิชา +10%'},
 {id:'PASS_ARRAY_GEOMANCY_T2',nameTh:'ดูดาววางผังค่ายกลพื้นฐาน',path:'XIAN',sub:'ASTRAL_ARRAY',tier:2,grade:'Refined',passiveFamily:'FAM_PROF_ARRAY',passive:{life:{ARRAY:.24,TALISMAN:.14},p:{mdef:.10},f:{acc:12}},descTh:'คำนวณทิศทางดาราและชีพจรดิน เพิ่มค่ายกล +24% ยันต์ +14% และป้องกันวิชา +10%'},
 {id:'PASS_MERCHANT_LEDGER_MIND_T2',nameTh:'สายตาพ่อค้าประเมินค่าหมื่นสิ่ง',path:'ANY',sub:null,tier:2,grade:'Refined',passiveFamily:'FAM_PROF_TRADE',passive:{life:{trading:.24,administration:.18},f:{eva:12,move:6}},descTh:'คำนวณต้นทุนและเส้นทางค้าขาย เพิ่มการค้า +24% บริหาร +18% หลบหลีก +12 และเดินไว +6'}
].map(t=>Object.assign({cat:'PASSIVE',role:'COMBAT_DEFENSE',reqTier:t.tier,element:'NEUTRAL',power:t.tier*44,moves:[],overhaulPack:true,starterPassive:t.tier===1&&t.grade==='Common',martialRare:!(t.tier===1&&t.grade==='Common')},t));

// 4. 22 Exceptionally Rare Legendary Techniques across all 10 supported categories
// (3 COMBAT_TECHNIQUE, 2 AUXILIARY_ART, 2 LIGHTNESS_ART, 2 FORBIDDEN_ART, 3 PASSIVE,
//  2 QI_MANTRA, 2 BODY_MANTRA, 2 FAITH_MANTRA, 2 DEMON_MANTRA, 2 SOUL_MANTRA)
D.legendaryTechniques=[
 // --- Category 1: COMBAT_TECHNIQUE (3 Legends) ---
 {
  id:'LEG_COMBAT_DUGU_NINE_SWORDS',
  nameTh:'เก้ากระบี่เดียวดายทลายกระบวน',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_OFFENSE',
  path:'XIAN',
  sub:'SWORD_IMMORTAL',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'EARTH_METAL',
  power:310,
  weaponTypes:['SWORD'],
  combatArch:'pierce',
  fxKind:'legend_dugu_sword',
  literaryInspiration:'แรงบันดาลใจจากแนวคิดเพลงกระบี่อ่านช่องโหว่ (กิมย้ง): รุกแทนรับ ทำลายกระบวนท่าศัตรูตามจุดอ่อนจริง',
  moves:['บททำลายสิ้นเชิง','บททำลายคมดาบ','บททำลายปราณคุ้มกาย','บททำลายศาสตราลับ','บททำลายลมปราณใน','บทไร้กระบวนท่าคืนสู่ว่าง'],
  stages:[
   {stage:1,id:'DUGU_S1',nameTh:'ขั้นที่ 1 • ทำลายสิ้นเชิง',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_DUGU_TOTAL'},
   {stage:2,id:'DUGU_S2',nameTh:'ขั้นที่ 2 • ทำลายคมดาบและศาสตรา',reqMastery:12,reqCultStage:6,unlockMoveId:'M2_DUGU_BLADE'},
   {stage:3,id:'DUGU_S3',nameTh:'ขั้นที่ 3 • ทำลายม่านปราณคุ้มกาย',reqMastery:28,reqCultStage:6,unlockMoveId:'M3_DUGU_QI'},
   {stage:4,id:'DUGU_S4',nameTh:'ขั้นที่ 4 • ทำลายศาสตราลับและค่ายกล',reqMastery:45,reqCultStage:6,unlockMoveId:'M4_DUGU_WHIP'},
   {stage:5,id:'DUGU_S5',nameTh:'ขั้นที่ 5 • ทำลายลมปราณภายใน',reqMastery:68,reqCultStage:6,unlockMoveId:'M5_DUGU_MANTRA'},
   {stage:6,id:'DUGU_S6',nameTh:'ขั้นที่ 6 • ไร้กระบวนท่าคืนสู่ความว่าง',reqMastery:95,reqCultStage:7,unlockMoveId:'M6_DUGU_FORMLESS'}
  ],
  moveDefs:[
   {id:'M1_DUGU_TOTAL',parentId:'LEG_COMBAT_DUGU_NINE_SWORDS',stageReq:1,reqMastery:0,nameTh:'บทที่หนึ่ง • ทำลายสิ้นเชิง',arch:'strike',type:'p',M:1.45,hits:1,cd:6,wind:3,costPct:3.5,pen:20,rider:'armorbreak',fxKind:'legend_dugu_sword',aiRole:'opener'},
   {id:'M2_DUGU_BLADE',parentId:'LEG_COMBAT_DUGU_NINE_SWORDS',stageReq:2,reqMastery:12,nameTh:'บทที่สอง • ทำลายคมดาบ',arch:'pierce',type:'p',M:1.75,hits:1,cd:10,wind:3,costPct:5.0,pen:35,rider:'weaken',fxKind:'legend_dugu_sword',aiRole:'anti_armor'},
   {id:'M3_DUGU_QI',parentId:'LEG_COMBAT_DUGU_NINE_SWORDS',stageReq:3,reqMastery:28,nameTh:'บทที่สาม • ทำลายปราณคุ้มกาย',arch:'pierce',type:'p',M:2.05,hits:1,cd:13,wind:4,costPct:7.0,pen:40,shatterShield:true,rider:'mdefbreak',fxKind:'legend_dugu_sword',aiRole:'anti_shield'},
   {id:'M4_DUGU_WHIP',parentId:'LEG_COMBAT_DUGU_NINE_SWORDS',stageReq:4,reqMastery:45,nameTh:'บทที่สี่ • ทำลายศาสตราลับ',arch:'sweep',type:'p',M:1.55,hits:1,cd:14,wind:4,costPct:8.0,pen:25,aoe:true,fxKind:'legend_dugu_sword',aiRole:'aoe_pressure'},
   {id:'M5_DUGU_MANTRA',parentId:'LEG_COMBAT_DUGU_NINE_SWORDS',stageReq:5,reqMastery:68,nameTh:'บทที่ห้า • ทำลายลมปราณใน',arch:'control',type:'p',M:2.15,hits:1,cd:18,wind:5,costPct:11.0,pen:35,ctrl:'silence',fxKind:'legend_dugu_sword',aiRole:'control'},
   {id:'M6_DUGU_FORMLESS',parentId:'LEG_COMBAT_DUGU_NINE_SWORDS',stageReq:6,reqMastery:95,reqCultStage:7,nameTh:'บทที่หก • ไร้กระบวนท่าคืนสู่ว่าง',arch:'burst',type:'p',M:2.95,hits:1,cd:24,wind:6,costPct:16.0,pen:45,critAdd:18,fxKind:'legend_dugu_sword',aiRole:'finisher'}
  ]
 },
 {
  id:'LEG_COMBAT_DRAGON_SUBDUING_PALMS',
  nameTh:'สิบแปดฝ่ามือพิชิตมังกรสะท้านภพ',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_OFFENSE',
  path:'BODY',
  sub:'BLOOD_DRAGON',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'LIGHT_YANG',
  power:315,
  weaponTypes:['FIST'],
  combatArch:'burst',
  fxKind:'legend_dragon_palm',
  literaryInspiration:'แรงบันดาลใจจากฝ่ามือพิชิตมังกร (กิมย้ง): พลังฝ่ามือเที่ยงธรรมหนักหน่วง ยิ่งอัดพลังยิ่งใช้ปราณและเรี่ยวแรงสูง',
  moves:['มังกรทะยานมีสำนึก','มังกรปรากฏกลางทุ่ง','มังกรทะยานจากห้วงเหว','สะท้านไกลร้อยลี้'],
  stages:[
   {stage:1,id:'DRG_S1',nameTh:'ขั้นที่ 1 • มังกรทะยานมีสำนึก',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_DRAGON_REGRET'},
   {stage:2,id:'DRG_S2',nameTh:'ขั้นที่ 2 • มังกรปรากฏกลางทุ่ง',reqMastery:20,reqCultStage:6,unlockMoveId:'M2_DRAGON_FIELD'},
   {stage:3,id:'DRG_S3',nameTh:'ขั้นที่ 3 • มังกรทะยานจากห้วงเหว',reqMastery:48,reqCultStage:6,unlockMoveId:'M3_DRAGON_ABYSS'},
   {stage:4,id:'DRG_S4',nameTh:'ขั้นที่ 4 • สะท้านไกลร้อยลี้',reqMastery:80,reqCultStage:6,unlockMoveId:'M4_DRAGON_SHOCK'}
  ],
  moveDefs:[
   {id:'M1_DRAGON_REGRET',parentId:'LEG_COMBAT_DRAGON_SUBDUING_PALMS',stageReq:1,reqMastery:0,nameTh:'มังกรทะยานมีสำนึก',arch:'strike',type:'p',M:1.65,hits:1,cd:8,wind:4,costPct:5.0,pen:15,fxKind:'legend_dragon_palm',aiRole:'opener'},
   {id:'M2_DRAGON_FIELD',parentId:'LEG_COMBAT_DRAGON_SUBDUING_PALMS',stageReq:2,reqMastery:20,nameTh:'มังกรปรากฏกลางทุ่ง',arch:'sweep',type:'p',M:1.50,hits:1,cd:12,wind:5,costPct:8.0,pen:20,aoe:true,rider:'armorbreak',fxKind:'legend_dragon_palm',aiRole:'aoe_pressure'},
   {id:'M3_DRAGON_ABYSS',parentId:'LEG_COMBAT_DRAGON_SUBDUING_PALMS',stageReq:3,reqMastery:48,nameTh:'มังกรทะยานจากห้วงเหว',arch:'flurry',type:'p',M:1.15,hits:3,cd:16,wind:6,costPct:12.0,pen:25,fxKind:'legend_dragon_palm',aiRole:'anti_armor'},
   {id:'M4_DRAGON_SHOCK',parentId:'LEG_COMBAT_DRAGON_SUBDUING_PALMS',stageReq:4,reqMastery:80,nameTh:'สะท้านไกลร้อยลี้',arch:'burst',type:'p',M:3.15,hits:1,cd:28,wind:8,costPct:22.0,pen:35,ctrl:'stun',drawback:{staminaCost:6},fxKind:'legend_dragon_palm',aiRole:'finisher'}
  ]
 },
 {
  id:'LEG_COMBAT_FEIXIAN_ONE_SWORD',
  nameTh:'หนึ่งกระบี่เซียนเหินจากฟากฟ้า',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_OFFENSE',
  path:'HEART_SOUL',
  sub:'MIND_SWORD_TELEKINESIS',
  tier:7,
  reqTier:7,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'LIGHT_YANG',
  power:375,
  weaponTypes:['SWORD','FOCUS'],
  combatArch:'burst',
  fxKind:'legend_feixian_beam',
  literaryInspiration:'แรงบันดาลใจจากเซียนเหินฟ้า (โกวเล้ง): หนึ่งกระบวนท่าสมบูรณ์แบบไร้ที่ติ ไม่ต้องมีขั้นย่อยซับซ้อน แต่ต้องทุ่มเทสมาธิและปราณทั้งหมดในคมเดียว',
  moves:['เซียนเหินจากนอกนภา'],
  stages:[
   {stage:1,id:'FX_S1',nameTh:'ขั้นสมบูรณ์ • หนึ่งกระบี่ไร้ผู้ต้าน',reqMastery:0,reqCultStage:7,unlockMoveId:'M1_FEIXIAN_DESCENT'}
  ],
  moveDefs:[
   {id:'M1_FEIXIAN_DESCENT',parentId:'LEG_COMBAT_FEIXIAN_ONE_SWORD',stageReq:1,reqMastery:0,nameTh:'เซียนเหินจากนอกนภา',arch:'burst',type:'m',M:3.35,hits:1,cd:26,wind:7,costPct:20.0,pen:42,critAdd:20,drawback:{exposeTicks:4},fxKind:'legend_feixian_beam',aiRole:'finisher'}
  ]
 },

 // --- Category 2: AUXILIARY_ART (2 Legends) ---
 {
  id:'LEG_AUX_QIANKUN_SHIFT',
  nameTh:'เคล็ดเคลื่อนย้ายจักรวาลพลิกผัน',
  cat:'AUXILIARY_ART',
  role:'HEAL_SUPPORT_TRAINING',
  path:'XIAN',
  sub:'YIN_YANG_HARMONY',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'NEUTRAL',
  power:285,
  combatArch:'counter',
  fxKind:'legend_qiankun_taiji',
  literaryInspiration:'แรงบันดาลใจจากเคลื่อนย้ายจักรวาล (กิมย้ง): ผ่อนแรงสะท้อนกลับและปรับสมดุลหยินหยางให้ตนเองและพวกพ้อง',
  moves:['เบี่ยงแรงสี่ตำลึงปัดพันชั่ง','ย้ายชีพจรผสานหยินหยาง','พลิกฟ้าคว่ำดินคืนสนอง'],
  stages:[
   {stage:1,id:'QK_S1',nameTh:'ขั้นที่ 1 • เบี่ยงแรงสี่ตำลึงปัดพันชั่ง',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_QIANKUN_DEFLECT'},
   {stage:2,id:'QK_S2',nameTh:'ขั้นที่ 2 • ย้ายชีพจรผสานหยินหยาง',reqMastery:25,reqCultStage:6,unlockMoveId:'M2_QIANKUN_CLEANSE'},
   {stage:3,id:'QK_S3',nameTh:'ขั้นที่ 3 • พลิกฟ้าคว่ำดินคืนสนอง',reqMastery:60,reqCultStage:6,unlockMoveId:'M3_QIANKUN_REVERSAL'}
  ],
  moveDefs:[
   {id:'M1_QIANKUN_DEFLECT',parentId:'LEG_AUX_QIANKUN_SHIFT',stageReq:1,reqMastery:0,nameTh:'เบี่ยงแรงสี่ตำลึงปัดพันชั่ง',arch:'counter',type:'m',M:1.90,hits:1,cd:14,wind:3,costPct:7.0,pen:25,self:true,fxKind:'legend_qiankun_taiji',aiRole:'defensive'},
   {id:'M2_QIANKUN_CLEANSE',parentId:'LEG_AUX_QIANKUN_SHIFT',stageReq:2,reqMastery:25,nameTh:'ย้ายชีพจรผสานหยินหยาง',arch:'heal',type:'m',M:0,hits:0,cd:20,wind:4,costPct:11.0,heal:0.26,shield:0.18,team:true,fxKind:'legend_qiankun_taiji',aiRole:'sustain'},
   {id:'M3_QIANKUN_REVERSAL',parentId:'LEG_AUX_QIANKUN_SHIFT',stageReq:3,reqMastery:60,nameTh:'พลิกฟ้าคว่ำดินคืนสนอง',arch:'support',type:'m',M:0,hits:0,cd:24,wind:4,costPct:14.0,support:{kind:'holyAura',dur:18},team:true,fxKind:'legend_qiankun_taiji',aiRole:'sustain'}
  ]
 },
 {
  id:'LEG_AUX_LINGXI_ONE_FINGER',
  nameTh:'ดัชนีใจสื่อใจสกัดพันคม',
  cat:'AUXILIARY_ART',
  role:'HEAL_SUPPORT_TRAINING',
  path:'HEART_SOUL',
  sub:'ZEN_VOID_MIND',
  tier:5,
  reqTier:5,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'LIGHT_YANG',
  power:245,
  combatArch:'counter',
  fxKind:'legend_lingxi_gold',
  literaryInspiration:'แรงบันดาลใจจากดัชนีใจสื่อใจ (โกวเล้ง): สองนิ้วคีบหยุดคมศาสตราในเสี้ยวพริบตาด้วยจิตว่างกระจ่าง',
  moves:['สองนิ้วคีบคมดาบ','ใจสื่อใจกระจ่างแจ้ง'],
  stages:[
   {stage:1,id:'LX_S1',nameTh:'ขั้นที่ 1 • สองนิ้วคีบคมดาบ',reqMastery:0,reqCultStage:5,unlockMoveId:'M1_LINGXI_CLASP'},
   {stage:2,id:'LX_S2',nameTh:'ขั้นที่ 2 • ใจสื่อใจกระจ่างแจ้ง',reqMastery:35,reqCultStage:5,unlockMoveId:'M2_LINGXI_EPIPHANY'}
  ],
  moveDefs:[
   {id:'M1_LINGXI_CLASP',parentId:'LEG_AUX_LINGXI_ONE_FINGER',stageReq:1,reqMastery:0,nameTh:'สองนิ้วคีบคมดาบ',arch:'counter',type:'m',M:1.80,hits:1,cd:13,wind:2,costPct:6.0,pen:20,self:true,fxKind:'legend_lingxi_gold',aiRole:'defensive'},
   {id:'M2_LINGXI_EPIPHANY',parentId:'LEG_AUX_LINGXI_ONE_FINGER',stageReq:2,reqMastery:35,nameTh:'ใจสื่อใจกระจ่างแจ้ง',arch:'support',type:'m',M:0,hits:0,cd:20,wind:3,costPct:10.0,support:{kind:'morale',dur:16},team:true,fxKind:'legend_lingxi_gold',aiRole:'sustain'}
  ]
 },

 // --- Category 3: LIGHTNESS_ART (2 Legends) ---
 {
  id:'LEG_LIGHT_LINGBO_STEP',
  nameTh:'ย่างก้าวเหยียบคลื่นไร้ร่องรอย',
  cat:'LIGHTNESS_ART',
  role:'MOVEMENT_STEALTH_RECON',
  path:'XIAN',
  sub:'TIME_VOID',
  tier:5,
  reqTier:5,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'WATER_ICE',
  power:240,
  combatArch:'evade',
  fxKind:'legend_lingbo_afterimage',
  literaryInspiration:'แรงบันดาลใจจากย่างก้าวเหยียบคลื่น (กิมย้ง): ก้าวตามผังอัฐลักษณ์ หลบหลีกพร้อมหมุนเวียนปราณในตัว',
  moves:['ก้าวตามอัฐลักษณ์หลบคม','เงาคลื่นซ้อนหกสิบสี่ก้าว'],
  stages:[
   {stage:1,id:'LB_S1',nameTh:'ขั้นที่ 1 • ก้าวตามอัฐลักษณ์หลบคม',reqMastery:0,reqCultStage:5,unlockMoveId:'M1_LINGBO_RIPPLE'},
   {stage:2,id:'LB_S2',nameTh:'ขั้นที่ 2 • ลมปราณหนุนเนื่องทุกย่างก้าว',reqMastery:25,reqCultStage:5,passiveBonus:{p:{eva:.08},f:{move:12}}},
   {stage:3,id:'LB_S3',nameTh:'ขั้นที่ 3 • เงาคลื่นซ้อนหกสิบสี่ก้าว',reqMastery:55,reqCultStage:5,unlockMoveId:'M2_LINGBO_MIRAGE'}
  ],
  moveDefs:[
   {id:'M1_LINGBO_RIPPLE',parentId:'LEG_LIGHT_LINGBO_STEP',stageReq:1,reqMastery:0,nameTh:'ก้าวตามอัฐลักษณ์หลบคม',arch:'evade',type:'m',M:0,hits:0,cd:16,wind:2,costPct:4.5,self:true,qiRestorePct:.08,fxKind:'legend_lingbo_afterimage',aiRole:'defensive'},
   {id:'M2_LINGBO_MIRAGE',parentId:'LEG_LIGHT_LINGBO_STEP',stageReq:3,reqMastery:55,nameTh:'เงาคลื่นซ้อนหกสิบสี่ก้าว',arch:'guard',type:'m',M:0,hits:0,cd:22,wind:2,costPct:8.5,shield:.18,self:true,fxKind:'legend_lingbo_afterimage',aiRole:'defensive'}
  ]
 },
 {
  id:'LEG_LIGHT_MOON_BAT_SHADOW',
  nameTh:'ท่าร่างปีกจันทราเร้นเงาพันลี้',
  cat:'LIGHTNESS_ART',
  role:'MOVEMENT_STEALTH_RECON',
  path:'DEMON',
  sub:'SHADOW_ASSASSIN',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'YIN_SHADOW',
  power:278,
  combatArch:'evade',
  fxKind:'legend_moon_shadow',
  literaryInspiration:'แรงบันดาลใจจากวิชาตัวเบาเงาจันทรา (โกวเล้ง): เร้นกายดั่งสายลมยามค่ำคืน โฉบเข้าจุดบอดไร้สุ้มเสียง',
  moves:['ล่องลมใต้แสงจันทร์','เร้นเงาแทงจุดบอด'],
  stages:[
   {stage:1,id:'MB_S1',nameTh:'ขั้นที่ 1 • ล่องลมใต้แสงจันทร์',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_MOON_GLIDE'},
   {stage:2,id:'MB_S2',nameTh:'ขั้นที่ 2 • เร้นเงาแทงจุดบอด',reqMastery:40,reqCultStage:6,unlockMoveId:'M2_SHADOW_BLINDSPOT'}
  ],
  moveDefs:[
   {id:'M1_MOON_GLIDE',parentId:'LEG_LIGHT_MOON_BAT_SHADOW',stageReq:1,reqMastery:0,nameTh:'ล่องลมใต้แสงจันทร์',arch:'evade',type:'p',M:0,hits:0,cd:15,wind:2,costPct:5.5,self:true,fxKind:'legend_moon_shadow',aiRole:'defensive'},
   {id:'M2_SHADOW_BLINDSPOT',parentId:'LEG_LIGHT_MOON_BAT_SHADOW',stageReq:2,reqMastery:40,nameTh:'เร้นเงาแทงจุดบอด',arch:'pierce',type:'p',M:1.95,hits:1,cd:18,wind:3,costPct:9.5,pen:32,critAdd:14,fxKind:'legend_moon_shadow',aiRole:'anti_armor'}
  ]
 },

 // --- Category 4: FORBIDDEN_ART (2 Legends) ---
 {
  id:'LEG_FORB_STAR_ABSORBING_VORTEX',
  nameTh:'มหาเวทต้องห้าม • วังวนดูดดาวกลืนชีพจร',
  cat:'FORBIDDEN_ART',
  role:'FORBIDDEN_HIGH_STAKES',
  path:'DEMON',
  sub:'HEAVEN_DEVOURING_DEMON',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'BLOOD_DEMON',
  power:325,
  combatArch:'forbid',
  fxKind:'legend_star_vortex',
  literaryInspiration:'แรงบันดาลใจจากมหาเวทดูดดาว (กิมย้ง): สูบพลังปราณและโลหิตศัตรูเข้าสู่ตันเถียน แต่ต้องรับพิษปราณปะปนและแรงสะท้อนชีพจร',
  moves:['ดูดปราณตัดขั้วหัวใจ','วังวนมืดกลืนตันเถียน','หลุมดำกลืนดาราแลกตบะ'],
  stages:[
   {stage:1,id:'SA_S1',nameTh:'ขั้นที่ 1 • ดูดปราณตัดขั้วหัวใจ',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_STAR_SIPHON'},
   {stage:2,id:'SA_S2',nameTh:'ขั้นที่ 2 • วังวนมืดกลืนตันเถียน',reqMastery:35,reqCultStage:6,unlockMoveId:'M2_STAR_MERIDIAN_COLLAPSE'},
   {stage:3,id:'SA_S3',nameTh:'ขั้นที่ 3 • หลุมดำกลืนดาราแลกตบะ',reqMastery:70,reqCultStage:6,unlockMoveId:'M3_STAR_ABYSS_DEVOUR'}
  ],
  moveDefs:[
   {id:'M1_STAR_SIPHON',parentId:'LEG_FORB_STAR_ABSORBING_VORTEX',stageReq:1,reqMastery:0,nameTh:'ดูดปราณตัดขั้วหัวใจ',arch:'drain',type:'m',M:1.95,hits:1,cd:20,wind:5,costPct:9.5,steal:.55,recoil:.08,qiRestorePct:.10,fxKind:'legend_star_vortex',aiRole:'sustain'},
   {id:'M2_STAR_MERIDIAN_COLLAPSE',parentId:'LEG_FORB_STAR_ABSORBING_VORTEX',stageReq:2,reqMastery:35,nameTh:'วังวนมืดกลืนตันเถียน',arch:'forbid',type:'m',M:2.10,hits:1,cd:28,wind:6,costPct:13.0,aoe:true,steal:.40,recoil:.12,ctrl:'silence',fxKind:'legend_star_vortex',aiRole:'aoe_pressure'},
   {id:'M3_STAR_ABYSS_DEVOUR',parentId:'LEG_FORB_STAR_ABSORBING_VORTEX',stageReq:3,reqMastery:70,nameTh:'หลุมดำกลืนดาราแลกตบะ',arch:'forbid',type:'m',M:2.95,hits:1,cd:36,wind:8,costPct:18.0,pen:35,steal:.60,recoil:.16,drawback:{heartDemonAdd:10},fxKind:'legend_star_vortex',aiRole:'finisher'}
  ]
 },
 {
  id:'LEG_FORB_BLOOD_LOTUS_SACRIFICE',
  nameTh:'วิชาต้องห้าม • บงกชโลหิตเผาอายุขัยสังหารเทพ',
  cat:'FORBIDDEN_ART',
  role:'FORBIDDEN_HIGH_STAKES',
  path:'ANY',
  sub:null,
  tier:7,
  reqTier:7,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'FIRE',
  power:368,
  combatArch:'forbid',
  fxKind:'legend_blood_lotus',
  literaryInspiration:'แรงบันดาลใจจากวิชาต้องห้ามเผาโลหิตต้นกำเนิด: แลกพลังชีวิตและเปิดเกราะตนเองเพื่อจุดดอกบัวโลหิตล้างสมรภูมิ',
  moves:['บงกชโลหิตผลิบานกลางศึก','เผาชีพจรสะบั้นชะตาฟ้า'],
  stages:[
   {stage:1,id:'BL_S1',nameTh:'ขั้นที่ 1 • บงกชโลหิตผลิบานกลางศึก',reqMastery:0,reqCultStage:7,unlockMoveId:'M1_BLOOD_LOTUS_BLOOM'},
   {stage:2,id:'BL_S2',nameTh:'ขั้นที่ 2 • เผาชีพจรสะบั้นชะตาฟ้า',reqMastery:50,reqCultStage:7,unlockMoveId:'M2_BLOOD_LOTUS_ASHES'}
  ],
  moveDefs:[
   {id:'M1_BLOOD_LOTUS_BLOOM',parentId:'LEG_FORB_BLOOD_LOTUS_SACRIFICE',stageReq:1,reqMastery:0,nameTh:'บงกชโลหิตผลิบานกลางศึก',arch:'forbid',type:'m',M:2.75,hits:1,cd:32,wind:7,costPct:14.0,pen:35,recoil:.15,fxKind:'legend_blood_lotus',aiRole:'finisher'},
   {id:'M2_BLOOD_LOTUS_ASHES',parentId:'LEG_FORB_BLOOD_LOTUS_SACRIFICE',stageReq:2,reqMastery:50,nameTh:'เผาชีพจรสะบั้นชะตาฟ้า',arch:'forbid',type:'m',M:3.50,hits:1,cd:42,wind:9,costPct:20.0,pen:45,aoe:true,recoil:.22,drawback:{exposeTicks:12,heartDemonAdd:12},fxKind:'legend_blood_lotus',aiRole:'finisher'}
  ]
 },

 // --- Category 5: PASSIVE (3 Legends — brings total PASSIVE count to exactly 100) ---
 {
  id:'LEG_PASS_MINGYU_IMMORTAL_QI',
  nameTh:'เคล็ดปราณหยกใสไร้ราคี',
  cat:'PASSIVE',
  role:'COMBAT_DEFENSE',
  path:'XIAN',
  sub:null,
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'WATER_ICE',
  power:295,
  passiveFamily:'FAM_LEG_MINGYU',
  fxKind:'legend_aura_mingyu',
  literaryInspiration:'แรงบันดาลใจจากพลังหยกใสหมิงอวี้กง (โกวเล้ง): ปราณหมุนเวียนภายในดั่งหยกน้ำแข็งไร้รอยรั่ว ยิ่งสงบยิ่งแข็งแกร่ง',
  moves:[],
  passive:{
   p:{mdef:.22,def:.16,matk:.10},
   qiMaxPct:.25,
   qiCostMult:.75,
   proc:{kind:'combatTick',icdTicks:5,qiRestorePct:.045,hpRestorePct:.025}
  },
  descTh:'ปราณหยกใสหมุนเวียนไร้รั่วไหล เพิ่มป้องกันวิชา +22% ป้องกัน +16% ปราณสูงสุด +25% ลดใช้ปราณ 25% และฟื้นปราณ/เลือดต่อเนื่องในศึก'
 },
 {
  id:'LEG_PASS_NINE_YANG_MERIDIAN',
  nameTh:'คัมภีร์เก้าสุริยันคุ้มชีพจร',
  cat:'PASSIVE',
  role:'COMBAT_DEFENSE',
  path:'BODY',
  sub:null,
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'LIGHT_YANG',
  power:300,
  passiveFamily:'FAM_LEG_NINE_YANG',
  fxKind:'legend_aura_nine_yang',
  literaryInspiration:'แรงบันดาลใจจากคัมภีร์เก้าเอี้ยง (กิมย้ง): ปราณหยางบริสุทธิ์หนุนพละกำลังและคุ้มครองชีพจร ฟื้นตัวและต้านทานพิษ',
  moves:[],
  passive:{
   p:{hp:.20,def:.18,atk:.14,mdef:.12},
   qiMaxPct:.20,
   cultRatePct:.20,
   proc:{kind:'onStruck',icdTicks:4,hpRestorePct:.035,reboundM:.45}
  },
  descTh:'ปราณเก้าสุริยันคุ้มกาย เพิ่มเลือด +20% ป้องกัน +18% โจมตี +14% ปราณสูงสุด +20% และเมื่อถูกโจมตีจะสะท้อนปราณหยางพร้อมฟื้นเลือด (มีคูลดาวน์)'
 },
 {
  id:'LEG_PASS_DUGU_SWORD_HEART',
  nameTh:'เจตจำนงกระบี่ไร้พ่ายอ่านช่องโหว่',
  cat:'PASSIVE',
  role:'COMBAT_OFFENSE',
  path:'ANY',
  sub:null,
  tier:7,
  reqTier:7,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'EARTH_METAL',
  power:355,
  weaponTypes:['SWORD'],
  passiveFamily:'FAM_LEG_DUGU_HEART',
  fxKind:'legend_aura_dugu',
  literaryInspiration:'แรงบันดาลใจจากหัวใจกระบี่เดียวดาย (กิมย้ง): มองทะลุจุดอ่อนทุกกระบวนท่าเมื่อถือกระบี่',
  moves:[],
  passive:{
   p:{atk:.16,matk:.16,acc:.15},
   pp:{crit:14,critDmg:32,pen:18},
   proc:{kind:'onHit',icdTicks:4,bonusPen:15}
  },
  descTh:'เมื่อถือกระบี่ จะเพิ่มโจมตี/โจมตีวิชา +16% แม่นยำ +15% อัตราคริ +14% แรงคริ +32% และเจาะเกราะ +18%'
 }
];
D.legendaryTechniques.forEach(t=>JD.TECH.techniques.push(t));

// 5. 10 Legendary Mantras across the 5 Mantra categories (2 per category: QI_MANTRA, BODY_MANTRA, FAITH_MANTRA, DEMON_MANTRA, SOUL_MANTRA)
D.legendaryMantras=[
 // --- Category 6: QI_MANTRA (2 Legends) ---
 {
  id:'LEG_MANTRA_TAIXUAN_SCRIPTURE',
  nameTh:'มหาคัมภีร์ปราณไท่เสวียนจารึกเกาะร้าง',
  cat:'QI_MANTRA',
  path:'XIAN',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'WATER_ICE',
  power:265,
  fxKind:'legend_taixuan_runes',
  mantraBonus:{cultRatePct:.28,qiMaxPct:.22,p:{matk:.14,atk:.10,mdef:.10},f:{cast:8}},
  literaryInspiration:'แรงบันดาลใจจากคัมภีร์ไท่เสวียน (กิมย้ง): บทกวีบนผาหินที่หลอมรวมปราณและกระบวนท่าเป็นหนึ่งเดียว',
  moves:['คลื่นอักษรไท่เสวียนสะท้านสมุทร','ปราณกวีไร้ลักษณ์'],
  stages:[
   {stage:1,id:'TX_S1',nameTh:'ขั้นที่ 1 • ตื่นรู้บทกวีผาหิน',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_TAIXUAN_WAVE'},
   {stage:2,id:'TX_S2',nameTh:'ขั้นที่ 2 • เส้นปราณโคจรเองตามธรรมชาติ',reqMastery:35,reqCultStage:6,passiveBonus:{p:{matk:.06,mdef:.06}}}
  ],
  moveDefs:[
   {id:'M1_TAIXUAN_WAVE',parentId:'LEG_MANTRA_TAIXUAN_SCRIPTURE',stageReq:1,reqMastery:0,nameTh:'คลื่นอักษรไท่เสวียนสะท้านสมุทร',arch:'sweep',type:'m',M:2.10,hits:1,cd:18,wind:4,costPct:9.0,pen:25,aoe:true,fxKind:'legend_taixuan_runes',aiRole:'aoe_pressure'}
  ]
 },
 {
  id:'LEG_MANTRA_SIX_MERIDIAN_QI',
  nameTh:'คัมภีร์ปราณกระบี่หกชีพจรไร้รูป',
  cat:'QI_MANTRA',
  path:'XIAN',
  tier:7,
  reqTier:7,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'ASTRAL',
  power:370,
  fxKind:'legend_six_meridian',
  mantraBonus:{cultRatePct:.32,qiMaxPct:.30,p:{matk:.18,acc:.14},pp:{pen:22,crit:8}},
  literaryInspiration:'แรงบันดาลใจจากกระบี่หกชีพจร (กิมย้ง): เปล่งปราณแท้ผ่านปลายนิ้วเป็นคมกระบี่ไร้รูป ต้องอาศัยทะเลปราณอันมหาศาล',
  moves:['กระบี่จงชงทะลวงเมฆ','กระบี่ซางหยางพริบตา','หกชีพจรประสานพิฆาต'],
  stages:[
   {stage:1,id:'SM_S1',nameTh:'ขั้นที่ 1 • กระบี่จงชงทะลวงเมฆ',reqMastery:0,reqCultStage:7,unlockMoveId:'M1_SHAOZE_SWORD'},
   {stage:2,id:'SM_S2',nameTh:'ขั้นที่ 2 • กระบี่ซางหยางพริบตา',reqMastery:30,reqCultStage:7,unlockMoveId:'M2_SHANGYANG_FLURRY'},
   {stage:3,id:'SM_S3',nameTh:'ขั้นที่ 3 • หกชีพจรประสานพิฆาต',reqMastery:65,reqCultStage:7,unlockMoveId:'M3_SIXI_CONVERGENCE'}
  ],
  moveDefs:[
   {id:'M1_SHAOZE_SWORD',parentId:'LEG_MANTRA_SIX_MERIDIAN_QI',stageReq:1,reqMastery:0,nameTh:'กระบี่จงชงทะลวงเมฆ',arch:'pierce',type:'m',M:1.85,hits:1,cd:9,wind:3,costPct:6.5,pen:30,fxKind:'legend_six_meridian',aiRole:'opener'},
   {id:'M2_SHANGYANG_FLURRY',parentId:'LEG_MANTRA_SIX_MERIDIAN_QI',stageReq:2,reqMastery:30,nameTh:'กระบี่ซางหยางพริบตา',arch:'flurry',type:'m',M:1.10,hits:3,cd:14,wind:4,costPct:10.5,pen:25,fxKind:'legend_six_meridian',aiRole:'anti_armor'},
   {id:'M3_SIXI_CONVERGENCE',parentId:'LEG_MANTRA_SIX_MERIDIAN_QI',stageReq:3,reqMastery:65,nameTh:'หกชีพจรประสานพิฆาต',arch:'burst',type:'m',M:3.10,hits:1,cd:24,wind:6,costPct:18.0,pen:40,critAdd:15,fxKind:'legend_six_meridian',aiRole:'finisher'}
  ]
 },

 // --- Category 7: BODY_MANTRA (2 Legends) ---
 {
  id:'LEG_MANTRA_DRAGON_ELEPHANT_PRAJNA',
  nameTh:'มหาคัมภีร์กายานาคช้างปัญญาบารมี',
  cat:'BODY_MANTRA',
  path:'BODY',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'EARTH_METAL',
  power:272,
  fxKind:'legend_dragon_elephant',
  mantraBonus:{cultRatePct:.26,p:{def:.22,hp:.18,atk:.16},pp:{pen:10}},
  literaryInspiration:'แรงบันดาลใจจากวิชาปัญญานาคช้าง (กิมย้ง): สั่งสมพละกำลังทีละชั้นดั่งพญานาคและช้างสาร',
  moves:['สิบนาคสิบช้างกระทืบปฐพี','เกราะปัญญาบารมี'],
  stages:[
   {stage:1,id:'DE_S1',nameTh:'ขั้นที่ 1 • กำลังห้านาคห้าช้าง',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_DRAGON_ELEPHANT_STAMP'},
   {stage:2,id:'DE_S2',nameTh:'ขั้นที่ 2 • กำลังสิบนาคสิบช้าง',reqMastery:40,reqCultStage:6,passiveBonus:{p:{atk:.08,def:.08}}}
  ],
  moveDefs:[
   {id:'M1_DRAGON_ELEPHANT_STAMP',parentId:'LEG_MANTRA_DRAGON_ELEPHANT_PRAJNA',stageReq:1,reqMastery:0,nameTh:'สิบนาคสิบช้างกระทืบปฐพี',arch:'strike',type:'p',M:2.35,hits:1,cd:16,wind:5,costPct:9.0,pen:28,ctrl:'stun',fxKind:'legend_dragon_elephant',aiRole:'anti_armor'}
  ]
 },
 {
  id:'LEG_MANTRA_DIAMOND_INDESTRUCTIBLE',
  nameTh:'คัมภีร์กายาวัชระอมตะไม่บุบสลาย',
  cat:'BODY_MANTRA',
  path:'BODY',
  tier:7,
  reqTier:7,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'LIGHT_YANG',
  power:372,
  fxKind:'legend_vajra_bell',
  mantraBonus:{cultRatePct:.30,p:{def:.28,mdef:.22,hp:.24},f:{move:-6}},
  literaryInspiration:'แรงบันดาลใจจากกายาวัชระไม่บุบสลาย (กิมย้ง): แปรสภาพร่างกายเป็นทองคำวัชระ ต้านทานคมศาสตราและสะท้อนแรงกระแทก',
  moves:['ระฆังทองวัชระคุ้มกาย','ฝ่ามือวัชระสะท้อนภพ'],
  stages:[
   {stage:1,id:'DI_S1',nameTh:'ขั้นที่ 1 • กายาทองคำไม่บุบสลาย',reqMastery:0,reqCultStage:7,unlockMoveId:'M1_VAJRA_GOLDEN_BELL'},
   {stage:2,id:'DI_S2',nameTh:'ขั้นที่ 2 • ฝ่ามือวัชระสะท้อนภพ',reqMastery:45,reqCultStage:7,unlockMoveId:'M2_VAJRA_REBOUND_PALM'}
  ],
  moveDefs:[
   {id:'M1_VAJRA_GOLDEN_BELL',parentId:'LEG_MANTRA_DIAMOND_INDESTRUCTIBLE',stageReq:1,reqMastery:0,nameTh:'ระฆังทองวัชระคุ้มกาย',arch:'guard',type:'p',M:0,hits:0,cd:18,wind:3,costPct:8.0,shield:.28,self:true,fxKind:'legend_vajra_bell',aiRole:'defensive'},
   {id:'M2_VAJRA_REBOUND_PALM',parentId:'LEG_MANTRA_DIAMOND_INDESTRUCTIBLE',stageReq:2,reqMastery:45,nameTh:'ฝ่ามือวัชระสะท้อนภพ',arch:'counter',type:'p',M:2.45,hits:1,cd:18,wind:4,costPct:10.0,pen:30,self:true,fxKind:'legend_vajra_bell',aiRole:'defensive'}
  ]
 },

 // --- Category 8: FAITH_MANTRA (2 Legends) ---
 {
  id:'LEG_MANTRA_EIGHT_DESOLATIONS_GOD',
  nameTh:'มหาคัมภีร์ศรัทธาเทวะแปดทิศคืนเยาว์',
  cat:'FAITH_MANTRA',
  path:'GOD',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'FIRE',
  power:268,
  fxKind:'legend_eight_desolations',
  mantraBonus:{cultRatePct:.26,p:{hp:.20,mdef:.16,matk:.14}},
  literaryInspiration:'แรงบันดาลใจจากวิชาหกบรรจบแปดทิศ (กิมย้ง) ผสานวิถีเทวะ: ผลัดเปลี่ยนปราณชีวิตให้สดใหม่อยู่เสมอ',
  moves:['แสงเทวะผลัดชีวิต','โองการแปดทิศสยบศึก'],
  stages:[
   {stage:1,id:'ED_S1',nameTh:'ขั้นที่ 1 • แสงเทวะผลัดชีวิต',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_SACRED_RENEWAL'},
   {stage:2,id:'ED_S2',nameTh:'ขั้นที่ 2 • โองการแปดทิศสยบศึก',reqMastery:40,reqCultStage:6,unlockMoveId:'M2_EIGHT_DIRECTIONS_EDICT'}
  ],
  moveDefs:[
   {id:'M1_SACRED_RENEWAL',parentId:'LEG_MANTRA_EIGHT_DESOLATIONS_GOD',stageReq:1,reqMastery:0,nameTh:'แสงเทวะผลัดชีวิต',arch:'heal',type:'m',M:0,hits:0,cd:22,wind:4,costPct:10.0,heal:.28,team:true,fxKind:'legend_eight_desolations',aiRole:'sustain'},
   {id:'M2_EIGHT_DIRECTIONS_EDICT',parentId:'LEG_MANTRA_EIGHT_DESOLATIONS_GOD',stageReq:2,reqMastery:40,nameTh:'โองการแปดทิศสยบศึก',arch:'sweep',type:'m',M:2.05,hits:1,cd:18,wind:5,costPct:11.0,aoe:true,rider:'blind',fxKind:'legend_eight_desolations',aiRole:'aoe_pressure'}
  ]
 },
 {
  id:'LEG_MANTRA_CELESTIAL_MANDATE_CANON',
  nameTh:'มหาคัมภีร์โองการสวรรค์ค้ำจุนสามภพ',
  cat:'FAITH_MANTRA',
  path:'GOD',
  tier:7,
  reqTier:7,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'LIGHT_YANG',
  power:368,
  fxKind:'legend_celestial_mandate',
  mantraBonus:{cultRatePct:.32,p:{mdef:.22,def:.18,matk:.18},f:{acc:20}},
  literaryInspiration:'คัมภีร์สูงสุดแห่งวิถีศรัทธา: รวบรวมแรงอธิษฐานตั้งเป็นม่านสวรรค์และพิพากษาผู้รุกราน',
  moves:['ม่านทองโองการสวรรค์','หอกแสงพิพากษา','เทวราชจุติกลางสมรภูมิ'],
  stages:[
   {stage:1,id:'CM_S1',nameTh:'ขั้นที่ 1 • ม่านทองโองการสวรรค์',reqMastery:0,reqCultStage:7,unlockMoveId:'M1_MANDATE_SHIELD'},
   {stage:2,id:'CM_S2',nameTh:'ขั้นที่ 2 • หอกแสงพิพากษา',reqMastery:35,reqCultStage:7,unlockMoveId:'M2_HEAVENLY_SPEAR_VERDICT'},
   {stage:3,id:'CM_S3',nameTh:'ขั้นที่ 3 • เทวราชจุติกลางสมรภูมิ',reqMastery:70,reqCultStage:7,unlockMoveId:'M3_PANTHEON_DESCENT'}
  ],
  moveDefs:[
   {id:'M1_MANDATE_SHIELD',parentId:'LEG_MANTRA_CELESTIAL_MANDATE_CANON',stageReq:1,reqMastery:0,nameTh:'ม่านทองโองการสวรรค์',arch:'support',type:'m',M:0,hits:0,cd:20,wind:4,costPct:10.0,support:{kind:'holyAura',dur:18},team:true,fxKind:'legend_celestial_mandate',aiRole:'sustain'},
   {id:'M2_HEAVENLY_SPEAR_VERDICT',parentId:'LEG_MANTRA_CELESTIAL_MANDATE_CANON',stageReq:2,reqMastery:35,nameTh:'หอกแสงพิพากษา',arch:'pierce',type:'m',M:2.35,hits:1,cd:14,wind:4,costPct:11.0,pen:35,fxKind:'legend_celestial_mandate',aiRole:'anti_armor'},
   {id:'M3_PANTHEON_DESCENT',parentId:'LEG_MANTRA_CELESTIAL_MANDATE_CANON',stageReq:3,reqMastery:70,nameTh:'เทวราชจุติกลางสมรภูมิ',arch:'burst',type:'m',M:3.05,hits:1,cd:26,wind:7,costPct:17.0,pen:38,aoe:true,fxKind:'legend_celestial_mandate',aiRole:'finisher'}
  ]
 },

 // --- Category 9: DEMON_MANTRA (2 Legends) ---
 {
  id:'LEG_MANTRA_ASHURA_BLOOD_SEA',
  nameTh:'มหาคัมภีร์มารทะเลโลหิตอสูรบรรพกาล',
  cat:'DEMON_MANTRA',
  path:'DEMON',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'BLOOD_DEMON',
  power:275,
  fxKind:'legend_ashura_blood',
  mantraBonus:{cultRatePct:.28,p:{atk:.18,matk:.18},pp:{crit:10,critDmg:22}},
  literaryInspiration:'แรงบันดาลใจจากคัมภีร์มารทะเลโลหิต: เปลี่ยนกลิ่นคาวเลือดในสมรภูมิเป็นคลื่นปราณอสูรไร้พ่าย',
  moves:['คลื่นทะเลโลหิตกลืนทัพ','คมอสูรสะบั้นวิญญาณ'],
  stages:[
   {stage:1,id:'AB_S1',nameTh:'ขั้นที่ 1 • คลื่นทะเลโลหิตกลืนทัพ',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_BLOOD_SEA_TIDE'},
   {stage:2,id:'AB_S2',nameTh:'ขั้นที่ 2 • คมอสูรสะบั้นวิญญาณ',reqMastery:40,reqCultStage:6,unlockMoveId:'M2_ASHURA_WRATH'}
  ],
  moveDefs:[
   {id:'M1_BLOOD_SEA_TIDE',parentId:'LEG_MANTRA_ASHURA_BLOOD_SEA',stageReq:1,reqMastery:0,nameTh:'คลื่นทะเลโลหิตกลืนทัพ',arch:'drain',type:'m',M:1.95,hits:1,cd:16,wind:4,costPct:9.0,steal:.50,rider:'bleed',fxKind:'legend_ashura_blood',aiRole:'sustain'},
   {id:'M2_ASHURA_WRATH',parentId:'LEG_MANTRA_ASHURA_BLOOD_SEA',stageReq:2,reqMastery:40,nameTh:'คมอสูรสะบั้นวิญญาณ',arch:'burst',type:'p',M:2.75,hits:1,cd:22,wind:6,costPct:14.0,pen:32,critAdd:16,fxKind:'legend_ashura_blood',aiRole:'finisher'}
  ]
 },
 {
  id:'LEG_MANTRA_TEN_THOUSAND_GU_MONARCH',
  nameTh:'มหาคัมภีร์มารจักรพรรดิกู่หมื่นพิษกลืนฟ้า',
  cat:'DEMON_MANTRA',
  path:'DEMON',
  tier:7,
  reqTier:7,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'WOOD_LIFE',
  power:370,
  fxKind:'legend_gu_monarch',
  mantraBonus:{cultRatePct:.32,p:{matk:.22,mdef:.16},pp:{pen:18},life:{POISON:.35}},
  literaryInspiration:'คัมภีร์กู่บรรพกาลสูงสุด: หลอมรวมพิษหมื่นชนิดเข้าเป็นกู่จักรพรรดิทองคำ กัดกร่อนเกราะและปราณศัตรู',
  moves:['ไหมกู่ทองคำกัดชีพจร','หมอกหมื่นพิษกลืนนภา','กู่จักรพรรดิปะทุ'],
  stages:[
   {stage:1,id:'GM_S1',nameTh:'ขั้นที่ 1 • ไหมกู่ทองคำกัดชีพจร',reqMastery:0,reqCultStage:7,unlockMoveId:'M1_GOLDEN_SILKWORM_BITE'},
   {stage:2,id:'GM_S2',nameTh:'ขั้นที่ 2 • หมอกหมื่นพิษกลืนนภา',reqMastery:35,reqCultStage:7,unlockMoveId:'M2_MYRIAD_VENOM_MIST'},
   {stage:3,id:'GM_S3',nameTh:'ขั้นที่ 3 • กู่จักรพรรดิปะทุ',reqMastery:70,reqCultStage:7,unlockMoveId:'M3_SOVEREIGN_GU_ERUPTION'}
  ],
  moveDefs:[
   {id:'M1_GOLDEN_SILKWORM_BITE',parentId:'LEG_MANTRA_TEN_THOUSAND_GU_MONARCH',stageReq:1,reqMastery:0,nameTh:'ไหมกู่ทองคำกัดชีพจร',arch:'dot',type:'m',M:1.25,dot:1.45,dotKind:'poison',hits:1,cd:12,wind:4,costPct:7.5,pen:25,fxKind:'legend_gu_monarch',aiRole:'opener'},
   {id:'M2_MYRIAD_VENOM_MIST',parentId:'LEG_MANTRA_TEN_THOUSAND_GU_MONARCH',stageReq:2,reqMastery:35,nameTh:'หมอกหมื่นพิษกลืนนภา',arch:'sweep',type:'m',M:1.75,hits:1,cd:16,wind:5,costPct:11.0,aoe:true,rider:'weaken',fxKind:'legend_gu_monarch',aiRole:'aoe_pressure'},
   {id:'M3_SOVEREIGN_GU_ERUPTION',parentId:'LEG_MANTRA_TEN_THOUSAND_GU_MONARCH',stageReq:3,reqMastery:70,nameTh:'กู่จักรพรรดิปะทุ',arch:'burst',type:'m',M:3.05,hits:1,cd:24,wind:6,costPct:16.5,pen:38,steal:.35,fxKind:'legend_gu_monarch',aiRole:'finisher'}
  ]
 },

 // --- Category 10: SOUL_MANTRA (2 Legends) ---
 {
  id:'LEG_MANTRA_NINE_YIN_SOUL_MIRROR',
  nameTh:'มหาคัมภีร์จิตเก้าหยินส่องวิญญาณ',
  cat:'SOUL_MANTRA',
  path:'HEART_SOUL',
  tier:6,
  reqTier:6,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'YIN_SHADOW',
  power:270,
  fxKind:'legend_nine_yin_mirror',
  mantraBonus:{cultRatePct:.28,p:{matk:.20,mdef:.18,eva:.12},f:{cast:10}},
  literaryInspiration:'แรงบันดาลใจจากคัมภีร์เก้าอิมบทหลอมดวงจิต (กิมย้ง): ชำระล้างอาการบาดเจ็บทางจิตและสะกดวิญญาณคู่ต่อสู้',
  moves:['บทสวดหลอมวิญญาณคืนใส','กรงเล็บจิตทะลวงเงา','กระจกหยินสะกดขวัญ'],
  stages:[
   {stage:1,id:'NY_S1',nameTh:'ขั้นที่ 1 • บทสวดหลอมวิญญาณคืนใส',reqMastery:0,reqCultStage:6,unlockMoveId:'M1_SOUL_FORGING_CHANT'},
   {stage:2,id:'NY_S2',nameTh:'ขั้นที่ 2 • กรงเล็บจิตทะลวงเงา',reqMastery:30,reqCultStage:6,unlockMoveId:'M2_SPIRIT_CLAW_PIERCE'},
   {stage:3,id:'NY_S3',nameTh:'ขั้นที่ 3 • กระจกหยินสะกดขวัญ',reqMastery:60,reqCultStage:6,unlockMoveId:'M3_YIN_MIRROR_SHOCK'}
  ],
  moveDefs:[
   {id:'M1_SOUL_FORGING_CHANT',parentId:'LEG_MANTRA_NINE_YIN_SOUL_MIRROR',stageReq:1,reqMastery:0,nameTh:'บทสวดหลอมวิญญาณคืนใส',arch:'heal',type:'m',M:0,hits:0,cd:20,wind:4,costPct:9.0,heal:.25,team:true,fxKind:'legend_nine_yin_mirror',aiRole:'sustain'},
   {id:'M2_SPIRIT_CLAW_PIERCE',parentId:'LEG_MANTRA_NINE_YIN_SOUL_MIRROR',stageReq:2,reqMastery:30,nameTh:'กรงเล็บจิตทะลวงเงา',arch:'pierce',type:'m',M:2.10,hits:1,cd:12,wind:4,costPct:8.5,pen:32,fxKind:'legend_nine_yin_mirror',aiRole:'anti_armor'},
   {id:'M3_YIN_MIRROR_SHOCK',parentId:'LEG_MANTRA_NINE_YIN_SOUL_MIRROR',stageReq:3,reqMastery:60,nameTh:'กระจกหยินสะกดขวัญ',arch:'control',type:'m',M:1.85,hits:1,cd:18,wind:4,costPct:11.0,ctrl:'stun',fxKind:'legend_nine_yin_mirror',aiRole:'control'}
  ]
 },
 {
  id:'LEG_MANTRA_LITTLE_LI_HEART_BLADE',
  nameTh:'มหาคัมภีร์จิตมีดบินไร้พลาดสะท้านภพ',
  cat:'SOUL_MANTRA',
  path:'HEART_SOUL',
  tier:7,
  reqTier:7,
  grade:'Legendary',
  legendary:true,
  overhaulPack:true,
  martialRare:true,
  element:'LIGHT_YANG',
  power:374,
  fxKind:'legend_little_li_dagger',
  mantraBonus:{cultRatePct:.32,p:{matk:.24,acc:.20},pp:{crit:12,critDmg:28,pen:20}},
  literaryInspiration:'แรงบันดาลใจจากมีดบินไม่พลาดเป้า (โกวเล้ง): มีดบินที่เกิดจากความเมตตาและสมาธิสูงสุด ต้องตั้งจิตก่อนซัดออก ไม่ใช่การสังหารไร้เงื่อนไข',
  moves:['ตั้งจิตเมตตาผนึกคม','หนึ่งมีดบินสะท้านภพ'],
  stages:[
   {stage:1,id:'LL_S1',nameTh:'ขั้นที่ 1 • ตั้งจิตเมตตาผนึกคม',reqMastery:0,reqCultStage:7,unlockMoveId:'M1_HEART_FOCUS_BREATH'},
   {stage:2,id:'LL_S2',nameTh:'ขั้นที่ 2 • หนึ่งมีดบินสะท้านภพ',reqMastery:45,reqCultStage:7,unlockMoveId:'M2_FLYING_DAGGER_NO_MISS'}
  ],
  moveDefs:[
   {id:'M1_HEART_FOCUS_BREATH',parentId:'LEG_MANTRA_LITTLE_LI_HEART_BLADE',stageReq:1,reqMastery:0,nameTh:'ตั้งจิตเมตตาผนึกคม',arch:'guard',type:'m',M:0,hits:0,cd:16,wind:3,costPct:7.0,shield:.22,self:true,fxKind:'legend_little_li_dagger',aiRole:'defensive'},
   {id:'M2_FLYING_DAGGER_NO_MISS',parentId:'LEG_MANTRA_LITTLE_LI_HEART_BLADE',stageReq:2,reqMastery:45,nameTh:'หนึ่งมีดบินสะท้านภพ',arch:'burst',type:'m',M:3.25,hits:1,cd:24,wind:6,costPct:18.0,pen:42,critAdd:22,fxKind:'legend_little_li_dagger',aiRole:'finisher'}
  ]
 }
];
D.legendaryMantras.forEach(m=>JD.TECH.mantras.push(m));

// Append the 64 new non-legendary passives to JD.TECH.techniques
D.overhaulPassives.forEach(t=>JD.TECH.techniques.push(t));

// 6. Add genuine multi-move / stage definitions to selected existing techniques across tiers
// so variable move counts (1, 2, 3, 4, 6) exist across both historical and new arts.
const EXISTING_MULTI_MOVE_SPECS={
 ART190_XIAN_001:{
  stages:[
   {stage:1,id:'X001_S1',nameTh:'ขั้นที่ 1 • กระบี่พิรุณโปรย',reqMastery:0,unlockMoveId:'X001_M1'},
   {stage:2,id:'X001_S2',nameTh:'ขั้นที่ 2 • เจ็ดดาวเรียงร้อย',reqMastery:10,unlockMoveId:'X001_M2',passiveBonus:{f:{acc:8}}},
   {stage:3,id:'X001_S3',nameTh:'ขั้นที่ 3 • คมหยกสะบั้นเมฆา',reqMastery:25,unlockMoveId:'X001_M3',passiveBonus:{pp:{pen:5}}}
  ],
  moveDefs:[
   {id:'X001_M1',parentId:'ART190_XIAN_001',stageReq:1,reqMastery:0,nameTh:'กระบี่พิรุณโปรย',arch:'strike',type:'p',M:1.25,hits:1,cd:7,wind:3,costPct:3.2,pen:5,aiRole:'opener'},
   {id:'X001_M2',parentId:'ART190_XIAN_001',stageReq:2,reqMastery:10,nameTh:'เจ็ดดาวเรียงร้อย',arch:'flurry',type:'p',M:0.75,hits:3,cd:10,wind:4,costPct:4.5,pen:10,aiRole:'anti_armor'},
   {id:'X001_M3',parentId:'ART190_XIAN_001',stageReq:3,reqMastery:25,nameTh:'คมหยกสะบั้นเมฆา',arch:'pierce',type:'p',M:1.65,hits:1,cd:13,wind:5,costPct:6.0,pen:25,rider:'armorbreak',aiRole:'finisher'}
  ]
 },
 ART190_BODY_001:{
  stages:[
   {stage:1,id:'B001_S1',nameTh:'ขั้นที่ 1 • พยัคฆ์คำรามสั่นภูผา',reqMastery:0,unlockMoveId:'B001_M1'},
   {stage:2,id:'B001_S2',nameTh:'ขั้นที่ 2 • หมัดตรงป่นศิลา',reqMastery:12,unlockMoveId:'B001_M2',passiveBonus:{f:{atk:8}}},
   {stage:3,id:'B001_S3',nameTh:'ขั้นที่ 3 • กรงเล็บฉีกเกราะเหล็ก',reqMastery:28,unlockMoveId:'B001_M3',passiveBonus:{pp:{pen:6}}}
  ],
  moveDefs:[
   {id:'B001_M1',parentId:'ART190_BODY_001',stageReq:1,reqMastery:0,nameTh:'พยัคฆ์คำรามสั่นภูผา',arch:'strike',type:'p',M:1.30,hits:1,cd:7,wind:3,costPct:3.2,aiRole:'opener'},
   {id:'B001_M2',parentId:'ART190_BODY_001',stageReq:2,reqMastery:12,nameTh:'หมัดตรงป่นศิลา',arch:'pierce',type:'p',M:1.55,hits:1,cd:11,wind:4,costPct:4.8,pen:25,aiRole:'anti_armor'},
   {id:'B001_M3',parentId:'ART190_BODY_001',stageReq:3,reqMastery:28,nameTh:'กรงเล็บฉีกเกราะเหล็ก',arch:'flurry',type:'p',M:0.85,hits:3,cd:14,wind:5,costPct:6.2,pen:20,rider:'bleed',aiRole:'finisher'}
  ]
 },
 ART190_GOD_001:{
  stages:[
   {stage:1,id:'G001_S1',nameTh:'ขั้นที่ 1 • ประกาศิตสวรรค์กดข่ม',reqMastery:0,unlockMoveId:'G001_M1'},
   {stage:2,id:'G001_S2',nameTh:'ขั้นที่ 2 • หอกแสงเทวะทะลวงทัพ',reqMastery:12,unlockMoveId:'G001_M2',passiveBonus:{f:{acc:8}}},
   {stage:3,id:'G001_S3',nameTh:'ขั้นที่ 3 • รัศมีเทพสงครามไร้พ่าย',reqMastery:28,unlockMoveId:'G001_M3',passiveBonus:{p:{def:.06}}}
  ],
  moveDefs:[
   {id:'G001_M1',parentId:'ART190_GOD_001',stageReq:1,reqMastery:0,nameTh:'ประกาศิตสวรรค์กดข่ม',arch:'strike',type:'p',M:1.28,hits:1,cd:7,wind:3,costPct:3.4,aiRole:'opener'},
   {id:'G001_M2',parentId:'ART190_GOD_001',stageReq:2,reqMastery:12,nameTh:'หอกแสงเทวะทะลวงทัพ',arch:'pierce',type:'p',M:1.58,hits:1,cd:11,wind:4,costPct:5.0,pen:25,aiRole:'anti_armor'},
   {id:'G001_M3',parentId:'ART190_GOD_001',stageReq:3,reqMastery:28,nameTh:'รัศมีเทพสงครามไร้พ่าย',arch:'support',type:'m',M:0,hits:0,cd:18,wind:4,costPct:6.5,support:{kind:'morale',dur:14},team:true,aiRole:'sustain'}
  ]
 },
 ART_V210_CHAIN_SHADOW_DAGGER:{
  stages:[
   {stage:1,id:'D002_S1',nameTh:'ขั้นที่ 1 • มีดสั้นเงาจันทร์ซ้อนคม',reqMastery:0,unlockMoveId:'D002_M1'},
   {stage:2,id:'D002_S2',nameTh:'ขั้นที่ 2 • คมมีดคู่ตัดเส้นปราณ',reqMastery:16,unlockMoveId:'D002_M2',passiveBonus:{pp:{crit:4,pen:5}}}
  ],
  moveDefs:[
   {id:'D002_M1',parentId:'ART_V210_CHAIN_SHADOW_DAGGER',stageReq:1,reqMastery:0,nameTh:'มีดสั้นเงาจันทร์ซ้อนคม',arch:'flurry',type:'p',M:0.78,hits:2,cd:8,wind:3,costPct:4.0,pen:12,aiRole:'opener'},
   {id:'D002_M2',parentId:'ART_V210_CHAIN_SHADOW_DAGGER',stageReq:2,reqMastery:16,nameTh:'คมมีดคู่ตัดเส้นปราณ',arch:'pierce',type:'p',M:1.68,hits:1,cd:12,wind:4,costPct:5.5,pen:28,critAdd:10,rider:'bleed',aiRole:'finisher'}
  ]
 },
 ART_V112_SOUL_SPIRIT_INK_STROKE_T2:{
  stages:[
   {stage:1,id:'S002_S1',nameTh:'ขั้นที่ 1 • ตวัดพู่กันจารึกอักษร',reqMastery:0,unlockMoveId:'S002_M1'},
   {stage:2,id:'S002_S2',nameTh:'ขั้นที่ 2 • เส้นหมึกวิญญาณพันธนาการ',reqMastery:16,unlockMoveId:'S002_M2',passiveBonus:{f:{cast:6,acc:8}}}
  ],
  moveDefs:[
   {id:'S002_M1',parentId:'ART_V112_SOUL_SPIRIT_INK_STROKE_T2',stageReq:1,reqMastery:0,nameTh:'ตวัดพู่กันจารึกอักษร',arch:'strike',type:'m',M:1.36,hits:1,cd:8,wind:3,costPct:4.2,pen:10,aiRole:'opener'},
   {id:'S002_M2',parentId:'ART_V112_SOUL_SPIRIT_INK_STROKE_T2',stageReq:2,reqMastery:16,nameTh:'เส้นหมึกวิญญาณพันธนาการ',arch:'control',type:'m',M:1.15,hits:1,cd:14,wind:4,costPct:6.0,ctrl:'slow',aiRole:'control'}
  ]
 },
 TECH_NINE_SKIES_SWORD_ARRAY:{
  stages:[
   {stage:1,id:'NS_S1',nameTh:'ขั้นที่ 1 • หมื่นกระบี่เหินเวหา',reqMastery:0,unlockMoveId:'NS_M1'},
   {stage:2,id:'NS_S2',nameTh:'ขั้นที่ 2 • ฝนกระบี่ดาราตก',reqMastery:30,unlockMoveId:'NS_M2',passiveBonus:{p:{matk:.08},pp:{pen:8}}}
  ],
  moveDefs:[
   {id:'NS_M1',parentId:'TECH_NINE_SKIES_SWORD_ARRAY',stageReq:1,reqMastery:0,nameTh:'หมื่นกระบี่เหินเวหา',arch:'sweep',type:'m',M:1.65,hits:1,cd:12,wind:4,costPct:8.5,aoe:true,aiRole:'aoe_pressure'},
   {id:'NS_M2',parentId:'TECH_NINE_SKIES_SWORD_ARRAY',stageReq:2,reqMastery:30,nameTh:'ฝนกระบี่ดาราตก',arch:'burst',type:'m',M:2.55,hits:1,cd:22,wind:6,costPct:14.0,pen:30,aoe:true,aiRole:'finisher'}
  ]
 }
};

// 7. Data-Driven Technique / Subpath / Equipment Synergies (v1.12.0)
D.SYNERGIES=[
 {
  id:'SYN_SWORD_IMMORTAL_BLADE',
  nameTh:'กระบี่สวรรค์ประสานคม',
  subpath:'SWORD_IMMORTAL',
  weaponTypes:['SWORD'],
  archs:['strike','pierce','flurry','burst'],
  bonus:{dmgMult:1.12,penAdd:8,qiCostMult:0.90,masteryMult:1.25},
  descTh:'สายกระบี่สวรรค์ถือกระบี่: ท่าโจมตีแรงขึ้น +12% เจาะเกราะ +8% ใช้ปราณลดลง 10% และความชำนาญวิชาขึ้นไว +25%'
 },
 {
  id:'SYN_STAR_ARCHER_BOW',
  nameTh:'ศรดาราเล็งทะลวงฟ้า',
  subpath:'STAR_ARCHER',
  weaponTypes:['BOW'],
  archs:['pierce','sweep','strike','burst'],
  bonus:{dmgMult:1.14,critAdd:6,penAdd:6,windDelta:-1},
  descTh:'เซียนศรดาราถือธนู: ท่ายิงแรงขึ้น +14% อัตราคริ +6% เจาะเกราะ +6% และร่ายไวขึ้น 1 จังหวะ'
 },
 {
  id:'SYN_ELIXIR_DAO_CAULDRON',
  nameTh:'เต๋าโอสถหล่อเลี้ยงปราณ',
  subpath:'ELIXIR_DAO',
  weaponTypes:['FOCUS'],
  armorTypes:['ROBE'],
  archs:['heal','support','dot','drain'],
  bonus:{healMult:1.22,dotMult:1.16,qiCostMult:0.85,qiRestorePct:0.03},
  descTh:'สายโอสถอมฤตถือสื่อปราณสวมอาภรณ์: ฟื้นฟูแรงขึ้น +22% พิษแรงขึ้น +16% ลดใช้ปราณ 15% และคืนปราณ 3% เมื่อร่าย'
 },
 {
  id:'SYN_YIN_YANG_HARMONY_FLOW',
  nameTh:'หยินหยางหมุนเวียนไร้ลักษณ์',
  subpath:'YIN_YANG_HARMONY',
  weaponTypes:['FOCUS','STAFF'],
  armorTypes:['ROBE'],
  archs:['counter','guard','heal'],
  bonus:{dmgMult:1.15,shieldMult:1.18,healMult:1.15,qiRestorePct:0.04},
  descTh:'สายหยินหยางถือสื่อปราณ/พลองสวมอาภรณ์: ท่าสวนกลับ/โล่/ฟื้นฟูแรงขึ้น +15~18% และฟื้นปราณ 4% ทุกครั้งที่ใช้'
 },
 {
  id:'SYN_ASTRAL_ARRAY_FORMATION',
  nameTh:'ค่ายกลดาราจักรประสานทิศ',
  subpath:'ASTRAL_ARRAY',
  weaponTypes:['FOCUS'],
  archs:['channel','control','sweep','support'],
  bonus:{dmgMult:1.14,qiCostMult:0.88,extraSupportDur:4},
  descTh:'สายค่ายกลดาราถือสื่อปราณ: ท่าร่ายต่อเนื่อง/ควบคุม/กวาดหมู่แรงขึ้น +14% ลดปราณ 12% และยืดเวลาบัฟ +4 นาที'
 },
 {
  id:'SYN_TIGER_SOVEREIGN_CLAW',
  nameTh:'พยัคฆ์คลั่งไร้ศาสตรา',
  subpath:'TIGER_SOVEREIGN',
  weaponTypes:['FIST'],
  archs:['flurry','strike','burst'],
  bonus:{dmgMult:1.14,critAdd:7,critDmgAdd:15},
  descTh:'สายพยัคฆ์ราชันย์ใช้หมัด/สนับมือ: ท่าโจมตีประชิดแรงขึ้น +14% อัตราคริ +7% และความแรงคริ +15%'
 },
 {
  id:'SYN_VAJRA_BODHI_BELL',
  nameTh:'วัชระโพธิสัตว์ตั้งรับสะท้อนคม',
  subpath:'VAJRA_BODHI',
  weaponTypes:['STAFF','FIST'],
  armorTypes:['HEAVY'],
  archs:['guard','counter','strike'],
  bonus:{shieldMult:1.24,dmgMult:1.15,penAdd:8},
  descTh:'สายวัชระโพธิสัตว์ถือพลอง/หมัดสวมเกราะหนัก: โล่ป้องกันหนาขึ้น +24% ท่าสวนกลับและโจมตีแรงขึ้น +15%'
 },
 {
  id:'SYN_STAFF_GUARD_BASTION',
  nameTh:'ปราการพลองเหล็กเกราะหนัก',
  subpath:'STAFF_GUARD',
  weaponTypes:['STAFF'],
  armorTypes:['HEAVY'],
  archs:['guard','counter','sweep','strike'],
  bonus:{shieldMult:1.22,dmgMult:1.12,qiCostMult:0.88},
  descTh:'องครักษ์พลองเหล็กถือพลองสวมเกราะหนัก: โล่ป้องกัน +22% ดาเมจวิชาพลอง +12% และใช้ปราณลดลง 12%'
 },
 {
  id:'SYN_WAR_DEITY_BANNER',
  nameTh:'ทวนศึกเทพสงครามนำทัพ',
  subpath:'WAR_DEITY',
  weaponTypes:['SPEAR','BLADE'],
  armorTypes:['HEAVY'],
  archs:['pierce','sweep','support','strike'],
  bonus:{dmgMult:1.14,penAdd:10,extraSupportDur:5},
  descTh:'สายเทพสงครามถือหอก/ดาบสวมเกราะหนัก: ท่ารบแรงขึ้น +14% เจาะเกราะ +10% และบัฟขวัญกำลังใจนานขึ้น +5 นาที'
 },
 {
  id:'SYN_MERCY_DEITY_SANCTUARY',
  nameTh:'เมตตาเทวัญคุ้มครองปวงชน',
  subpath:'MERCY_DEITY',
  weaponTypes:['FOCUS','STAFF'],
  armorTypes:['ROBE'],
  archs:['heal','support','guard'],
  bonus:{healMult:1.25,shieldMult:1.20,qiCostMult:0.86,cleanseHeartDemon:3},
  descTh:'สายเทพเมตตาถือสื่อปราณ/พลองสวมอาภรณ์: ฟื้นฟู +25% โล่ +20% ลดปราณ 14% และลดจิตมาร 3 แต้มเมื่อร่าย'
 },
 {
  id:'SYN_SHADOW_ASSASSIN_DAGGER',
  nameTh:'คมดาบเงารัตติกาลปลิดชีพ',
  subpath:'SHADOW_ASSASSIN',
  weaponTypes:['BLADE'],
  armorTypes:['LIGHT'],
  archs:['strike','pierce','flurry','evade'],
  bonus:{dmgMult:1.14,critAdd:8,critDmgAdd:18,penAdd:8},
  descTh:'สายนักฆ่าเงาถือดาบสวมเกราะเบา: ดาเมจท่าสังหาร +14% อัตราคริ +8% แรงคริ +18% และเจาะเกราะ +8%'
 },
 {
  id:'SYN_VENOM_GU_CATALYST',
  nameTh:'พิษกู่ประสานศาสตรามาร',
  subpath:'VENOM_GU_SOVEREIGN',
  weaponTypes:['FOCUS','BLADE'],
  archs:['dot','drain','control','sweep'],
  bonus:{dotMult:1.24,dmgMult:1.10,penAdd:8,qiCostMult:0.88},
  descTh:'สายจ้าวพิษกู่ถือสื่อปราณ/ดาบ: แผลพิษต่อเนื่องแรงขึ้น +24% ดาเมจ +10% เจาะเกราะ +8% และลดปราณ 12%'
 },
 {
  id:'SYN_ZEN_VOID_MIRROR',
  nameTh:'เซนสุญตากระจกใจสะท้อนธรรม',
  subpath:'ZEN_VOID_MIND',
  weaponTypes:['STAFF','FOCUS'],
  armorTypes:['ROBE'],
  archs:['counter','guard','heal','support'],
  bonus:{dmgMult:1.16,shieldMult:1.20,healMult:1.15,cleanseHeartDemon:4},
  descTh:'สายปราชญ์เซนสุญตาถือพลอง/สื่อปราณสวมอาภรณ์: สวนกลับ/โล่/ฟื้นฟูแรงขึ้น +15~20% และชำระจิตมาร 4 แต้ม'
 },
 {
  id:'SYN_MIND_SWORD_TELEKINESIS',
  nameTh:'กระบี่จิตไร้รูปทะลวงสำนึก',
  subpath:'MIND_SWORD_TELEKINESIS',
  weaponTypes:['SWORD','FOCUS'],
  archs:['pierce','flurry','channel','burst','strike'],
  bonus:{dmgMult:1.13,penAdd:12,critAdd:5,masteryMult:1.20},
  descTh:'สายจอมกระบี่จิตถือกระบี่/สื่อปราณ: ดาเมจ +13% เจาะเกราะ +12% คริ +5% และความชำนาญวิชาขึ้นไว +20%'
 }
];

// 8. Exclusive Innate Subpath Techniques (12 subpath-intrinsic abilities with ZERO external acquisition)
D.innateTechniques=[
 {
  id:'INNATE_SWORD_IMMORTAL_HEART',
  nameTh:'เจตจำนงกระบี่กำเนิดใจ',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_OFFENSE',
  path:'XIAN',
  sub:'SWORD_IMMORTAL',
  innateSubpath:'SWORD_IMMORTAL',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'METAL',
  power:92,
  weaponTypes:['SWORD'],
  innateBonus:{p:{atk:.06,matk:.06},pp:{pen:6,crit:4}},
  descTh:'วิชาติดตัวเฉพาะสายกระบี่สวรรค์ (ไม่มีคัมภีร์ภายนอก): ก่อเจตจำนงกระบี่ในใจ เพิ่มโจมตี/วิชา +6% เจาะเกราะ +6% คริ +4% และปลดล็อกท่ากระบี่จิต',
  moves:['คมกระบี่สะท้อนใจ','กระบี่ไร้เงาผ่าเมฆา'],
  stages:[
   {stage:1,id:'ISW_S1',nameTh:'ขั้นที่ 1 • คมกระบี่สะท้อนใจ',reqMastery:0,reqCultStage:1,unlockMoveId:'ISW_M1'},
   {stage:2,id:'ISW_S2',nameTh:'ขั้นที่ 2 • กระบี่ไร้เงาผ่าเมฆา',reqMastery:18,reqCultStage:3,unlockMoveId:'ISW_M2',passiveBonus:{pp:{pen:5,critDmg:12}}}
  ],
  moveDefs:[
   {id:'ISW_M1',parentId:'INNATE_SWORD_IMMORTAL_HEART',stageReq:1,reqMastery:0,nameTh:'คมกระบี่สะท้อนใจ',arch:'pierce',type:'p',M:1.38,hits:1,cd:8,wind:3,costPct:3.6,pen:18,aiRole:'opener'},
   {id:'ISW_M2',parentId:'INNATE_SWORD_IMMORTAL_HEART',stageReq:2,reqMastery:18,reqCultStage:3,nameTh:'กระบี่ไร้เงาผ่าเมฆา',arch:'burst',type:'p',M:1.95,hits:1,cd:15,wind:4,costPct:6.5,pen:28,critAdd:10,aiRole:'finisher'}
  ]
 },
 {
  id:'INNATE_ELIXIR_DAO_CAULDRON',
  nameTh:'ลมหายใจเตาหลอมโอสถทิพย์',
  cat:'AUXILIARY_ART',
  role:'HEAL_SUPPORT_TRAINING',
  path:'XIAN',
  sub:'ELIXIR_DAO',
  innateSubpath:'ELIXIR_DAO',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'WOOD_LIFE',
  power:88,
  weaponTypes:['FOCUS'],
  innateBonus:{p:{hp:.07,mdef:.08},life:{ALCHEMY:.16,MEDICINE:.14}},
  descTh:'วิชาเฉพาะสายโอสถอมฤต: เปลี่ยนตันเถียนเป็นเตาหลอมปราณโอสถ เพิ่มเลือด +7% ป้องกันวิชา +8% หลอมโอสถ +16% และใช้ปราณโอสถรักษาพวกพ้อง',
  moves:['ปราณโอสถชำระพิษ','หมอกโอสถคุ้มครองทัพ'],
  stages:[
   {stage:1,id:'IEL_S1',nameTh:'ขั้นที่ 1 • ปราณโอสถชำระพิษ',reqMastery:0,reqCultStage:1,unlockMoveId:'IEL_M1'},
   {stage:2,id:'IEL_S2',nameTh:'ขั้นที่ 2 • หมอกโอสถคุ้มครองทัพ',reqMastery:18,reqCultStage:3,unlockMoveId:'IEL_M2',passiveBonus:{p:{mdef:.06,hp:.05}}}
  ],
  moveDefs:[
   {id:'IEL_M1',parentId:'INNATE_ELIXIR_DAO_CAULDRON',stageReq:1,reqMastery:0,nameTh:'ปราณโอสถชำระพิษ',arch:'heal',type:'m',M:0,hits:0,cd:16,wind:4,costPct:5.5,heal:.20,team:true,aiRole:'sustain'},
   {id:'IEL_M2',parentId:'INNATE_ELIXIR_DAO_CAULDRON',stageReq:2,reqMastery:18,reqCultStage:3,nameTh:'หมอกโอสถคุ้มครองทัพ',arch:'support',type:'m',M:0,hits:0,cd:18,wind:4,costPct:6.5,support:{kind:'holyAura',dur:16},team:true,aiRole:'sustain'}
  ]
 },
 {
  id:'INNATE_YIN_YANG_TAIJI_WHEEL',
  nameTh:'วงล้อไท่เก็กหมุนเวียน',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_DEFENSE',
  path:'XIAN',
  sub:'YIN_YANG_HARMONY',
  innateSubpath:'YIN_YANG_HARMONY',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'NEUTRAL',
  power:90,
  weaponTypes:['FOCUS','STAFF'],
  innateBonus:{p:{def:.07,mdef:.07},qiCostMult:0.92},
  descTh:'วิชาเฉพาะสายหยินหยางหมุนเวียน: ผ่อนแรงปะทะและหมุนเวียนปราณ เพิ่มป้องกัน/ป้องกันวิชา +7% ลดใช้ปราณ 8%',
  moves:['คลื่นหยินหยางผ่อนแรง','สองขั้วหมุนกลับสะท้านภพ'],
  stages:[
   {stage:1,id:'IYY_S1',nameTh:'ขั้นที่ 1 • คลื่นหยินหยางผ่อนแรง',reqMastery:0,reqCultStage:1,unlockMoveId:'IYY_M1'},
   {stage:2,id:'IYY_S2',nameTh:'ขั้นที่ 2 • สองขั้วหมุนกลับสะท้านภพ',reqMastery:18,reqCultStage:3,unlockMoveId:'IYY_M2',passiveBonus:{p:{eva:.06,def:.05}}}
  ],
  moveDefs:[
   {id:'IYY_M1',parentId:'INNATE_YIN_YANG_TAIJI_WHEEL',stageReq:1,reqMastery:0,nameTh:'คลื่นหยินหยางผ่อนแรง',arch:'counter',type:'m',M:1.55,hits:1,cd:13,wind:3,costPct:4.2,pen:12,self:true,qiRestorePct:0.04,aiRole:'defensive'},
   {id:'IYY_M2',parentId:'INNATE_YIN_YANG_TAIJI_WHEEL',stageReq:2,reqMastery:18,reqCultStage:3,nameTh:'สองขั้วหมุนกลับสะท้านภพ',arch:'strike',type:'m',M:1.72,hits:1,cd:11,wind:4,costPct:5.2,pen:18,rider:'weaken',aiRole:'anti_armor'}
  ]
 },
 {
  id:'INNATE_STAR_ARCHER_ASTRAL_LOCK',
  nameTh:'เนตรดาราล็อกวิถีศร',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_OFFENSE',
  path:'XIAN',
  sub:'STAR_ARCHER',
  innateSubpath:'STAR_ARCHER',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'ASTRAL',
  power:92,
  weaponTypes:['BOW'],
  requiresWeapon:true,
  innateBonus:{f:{acc:18},pp:{crit:5,pen:6}},
  descTh:'วิชาเฉพาะสายเซียนศรดารา (ต้องใช้ธนู): ล็อกเป้าด้วยปราณดารา เพิ่มแม่นยำ +18 อัตราคริ +5% เจาะเกราะ +6%',
  moves:['ศรดาวตกเล็งจุดตาย','ศรทะลวงดาราจักร'],
  stages:[
   {stage:1,id:'ISA_S1',nameTh:'ขั้นที่ 1 • ศรดาวตกเล็งจุดตาย',reqMastery:0,reqCultStage:1,unlockMoveId:'ISA_M1'},
   {stage:2,id:'ISA_S2',nameTh:'ขั้นที่ 2 • ศรทะลวงดาราจักร',reqMastery:18,reqCultStage:3,unlockMoveId:'ISA_M2',passiveBonus:{pp:{crit:4,critDmg:14}}}
  ],
  moveDefs:[
   {id:'ISA_M1',parentId:'INNATE_STAR_ARCHER_ASTRAL_LOCK',stageReq:1,reqMastery:0,nameTh:'ศรดาวตกเล็งจุดตาย',arch:'pierce',type:'m',M:1.42,hits:1,cd:8,wind:3,costPct:3.8,pen:22,critAdd:8,aiRole:'opener'},
   {id:'ISA_M2',parentId:'INNATE_STAR_ARCHER_ASTRAL_LOCK',stageReq:2,reqMastery:18,reqCultStage:3,nameTh:'ศรทะลวงดาราจักร',arch:'burst',type:'m',M:2.05,hits:1,cd:16,wind:4,costPct:7.0,pen:32,critAdd:12,aiRole:'finisher'}
  ]
 },
 {
  id:'INNATE_TIGER_SOVEREIGN_FEROCITY',
  nameTh:'พยัคฆ์ราชันย์คำรามสั่นปฐพี',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_OFFENSE',
  path:'BODY',
  sub:'TIGER_SOVEREIGN',
  innateSubpath:'TIGER_SOVEREIGN',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'EARTH_METAL',
  power:94,
  weaponTypes:['FIST'],
  innateBonus:{p:{atk:.09},f:{move:8},pp:{crit:4}},
  descTh:'วิชาเฉพาะสายพยัคฆ์ราชันย์คลั่ง: ปลุกสัญชาตญาณพยัคฆ์ขาว เพิ่มโจมตีกายภาพ +9% ความเร็วเดิน +8 และคริ +4%',
  moves:['กรงเล็บพยัคฆ์ขย้ำ','ราชันย์พยัคฆ์คำราม'],
  stages:[
   {stage:1,id:'ITS_S1',nameTh:'ขั้นที่ 1 • กรงเล็บพยัคฆ์ขย้ำ',reqMastery:0,reqCultStage:1,unlockMoveId:'ITS_M1'},
   {stage:2,id:'ITS_S2',nameTh:'ขั้นที่ 2 • ราชันย์พยัคฆ์คำราม',reqMastery:16,reqCultStage:2,unlockMoveId:'ITS_M2',passiveBonus:{p:{atk:.06},pp:{critDmg:14}}}
  ],
  moveDefs:[
   {id:'ITS_M1',parentId:'INNATE_TIGER_SOVEREIGN_FEROCITY',stageReq:1,reqMastery:0,nameTh:'กรงเล็บพยัคฆ์ขย้ำ',arch:'flurry',type:'p',M:0.82,hits:2,cd:8,wind:3,costPct:3.5,pen:12,aiRole:'opener'},
   {id:'ITS_M2',parentId:'INNATE_TIGER_SOVEREIGN_FEROCITY',stageReq:2,reqMastery:16,reqCultStage:2,nameTh:'ราชันย์พยัคฆ์คำราม',arch:'strike',type:'p',M:1.85,hits:1,cd:13,wind:4,costPct:5.5,pen:22,rider:'armorbreak',aiRole:'finisher'}
  ]
 },
 {
  id:'INNATE_VAJRA_BODHI_GOLDEN_BELL',
  nameTh:'ระฆังทองวัชระคุ้มกาย',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_DEFENSE',
  path:'BODY',
  sub:'VAJRA_BODHI',
  innateSubpath:'VAJRA_BODHI',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'LIGHT_YANG',
  power:90,
  weaponTypes:['STAFF','FIST'],
  innateBonus:{p:{def:.12,mdef:.08,hp:.06}},
  descTh:'วิชาเฉพาะสายวัชระโพธิสัตว์: หลอมกายเป็นระฆังทองไม่บุบสลาย เพิ่มป้องกัน +12% ป้องกันวิชา +8% เลือด +6%',
  moves:['เกราะระฆังทองคำ','แรงสะท้อนวัชระไม่บุบสลาย'],
  stages:[
   {stage:1,id:'IVB_S1',nameTh:'ขั้นที่ 1 • เกราะระฆังทองคำ',reqMastery:0,reqCultStage:1,unlockMoveId:'IVB_M1'},
   {stage:2,id:'IVB_S2',nameTh:'ขั้นที่ 2 • แรงสะท้อนวัชระไม่บุบสลาย',reqMastery:16,reqCultStage:2,unlockMoveId:'IVB_M2',passiveBonus:{p:{def:.08,hp:.05}}}
  ],
  moveDefs:[
   {id:'IVB_M1',parentId:'INNATE_VAJRA_BODHI_GOLDEN_BELL',stageReq:1,reqMastery:0,nameTh:'เกราะระฆังทองคำ',arch:'guard',type:'p',M:0,hits:0,cd:22,wind:3,costPct:4.8,shield:.13,self:true,aiRole:'defensive'},
   {id:'IVB_M2',parentId:'INNATE_VAJRA_BODHI_GOLDEN_BELL',stageReq:2,reqMastery:16,reqCultStage:2,nameTh:'แรงสะท้อนวัชระไม่บุบสลาย',arch:'counter',type:'p',M:1.35,hits:1,cd:20,wind:3,costPct:5.2,pen:14,self:true,aiRole:'defensive'}
  ]
 },
 {
  id:'INNATE_STAFF_GUARD_BASTION',
  nameTh:'ปราการพลองเหล็กพิทักษ์ด่าน',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_DEFENSE',
  path:'BODY',
  sub:'STAFF_GUARD',
  innateSubpath:'STAFF_GUARD',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'EARTH_METAL',
  power:88,
  weaponTypes:['STAFF'],
  innateBonus:{p:{def:.11,hp:.08},f:{acc:10}},
  descTh:'วิชาเฉพาะสายองครักษ์พลองเหล็ก: ตั้งปราการพลองคุ้มกันแนวหน้า เพิ่มป้องกัน +11% เลือด +8% แม่นยำ +10',
  moves:['ตั้งพลองสกัดทัพ','พลองเหล็กกวาดพสุธา'],
  stages:[
   {stage:1,id:'ISG_S1',nameTh:'ขั้นที่ 1 • ตั้งพลองสกัดทัพ',reqMastery:0,reqCultStage:1,unlockMoveId:'ISG_M1'},
   {stage:2,id:'ISG_S2',nameTh:'ขั้นที่ 2 • พลองเหล็กกวาดพสุธา',reqMastery:16,reqCultStage:2,unlockMoveId:'ISG_M2',passiveBonus:{p:{def:.07},pp:{pen:5}}}
  ],
  moveDefs:[
   {id:'ISG_M1',parentId:'INNATE_STAFF_GUARD_BASTION',stageReq:1,reqMastery:0,nameTh:'ตั้งพลองสกัดทัพ',arch:'guard',type:'p',M:0,hits:0,cd:15,wind:3,costPct:4.0,shield:.19,self:true,aiRole:'defensive'},
   {id:'ISG_M2',parentId:'INNATE_STAFF_GUARD_BASTION',stageReq:2,reqMastery:16,reqCultStage:2,nameTh:'พลองเหล็กกวาดพสุธา',arch:'sweep',type:'p',M:1.35,hits:1,cd:12,wind:4,costPct:5.2,pen:15,aoe:true,rider:'slow',aiRole:'aoe_pressure'}
  ]
 },
 {
  id:'INNATE_WAR_DEITY_BANNER_SPEAR',
  nameTh:'เทวโองการทวนศึกพิชิตมาร',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_OFFENSE',
  path:'GOD',
  sub:'WAR_DEITY',
  innateSubpath:'WAR_DEITY',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'LIGHT_YANG',
  power:92,
  weaponTypes:['SPEAR','BLADE'],
  innateBonus:{p:{atk:.08,def:.07},f:{acc:14}},
  descTh:'วิชาเฉพาะสายเทพสงครามพิทักษ์แดน: อัญเชิญบารมีทวนศึก เพิ่มโจมตี +8% ป้องกัน +7% แม่นยำ +14',
  moves:['ทวนศึกเบิกสมรภูมิ','ธงรบเทพสงครามปลุกขวัญ'],
  stages:[
   {stage:1,id:'IWD_S1',nameTh:'ขั้นที่ 1 • ทวนศึกเบิกสมรภูมิ',reqMastery:0,reqCultStage:1,unlockMoveId:'IWD_M1'},
   {stage:2,id:'IWD_S2',nameTh:'ขั้นที่ 2 • ธงรบเทพสงครามปลุกขวัญ',reqMastery:16,reqCultStage:2,unlockMoveId:'IWD_M2',passiveBonus:{p:{atk:.06,def:.05}}}
  ],
  moveDefs:[
   {id:'IWD_M1',parentId:'INNATE_WAR_DEITY_BANNER_SPEAR',stageReq:1,reqMastery:0,nameTh:'ทวนศึกเบิกสมรภูมิ',arch:'pierce',type:'p',M:1.58,hits:1,cd:8,wind:3,costPct:4.0,pen:25,shatterShield:true,aiRole:'opener'},
   {id:'IWD_M2',parentId:'INNATE_WAR_DEITY_BANNER_SPEAR',stageReq:2,reqMastery:16,reqCultStage:2,nameTh:'ธงรบเทพสงครามปลุกขวัญ',arch:'support',type:'m',M:0,hits:0,cd:18,wind:4,costPct:6.0,support:{kind:'morale',dur:16},team:true,aiRole:'sustain'}
  ]
 },
 {
  id:'INNATE_MERCY_DEITY_LOTUS_GRACE',
  nameTh:'รัศมีบัวทิพย์เมตตาธรรม',
  cat:'AUXILIARY_ART',
  role:'HEAL_SUPPORT_TRAINING',
  path:'GOD',
  sub:'MERCY_DEITY',
  innateSubpath:'MERCY_DEITY',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'WOOD_LIFE',
  power:88,
  weaponTypes:['FOCUS','STAFF'],
  innateBonus:{p:{hp:.09,mdef:.10},life:{MEDICINE:.18}},
  descTh:'วิชาเฉพาะสายเทพเมตตาคุ้มครองชน: แผ่รัศมีบัวทิพย์ เพิ่มเลือด +9% ป้องกันวิชา +10% การแพทย์ +18%',
  moves:['หยาดน้ำทิพย์ชุบชีวา','ม่านบัวทองคุ้มครองชน'],
  stages:[
   {stage:1,id:'IMD_S1',nameTh:'ขั้นที่ 1 • หยาดน้ำทิพย์ชุบชีวา',reqMastery:0,reqCultStage:1,unlockMoveId:'IMD_M1'},
   {stage:2,id:'IMD_S2',nameTh:'ขั้นที่ 2 • ม่านบัวทองคุ้มครองชน',reqMastery:16,reqCultStage:2,unlockMoveId:'IMD_M2',passiveBonus:{p:{mdef:.07,hp:.06}}}
  ],
  moveDefs:[
   {id:'IMD_M1',parentId:'INNATE_MERCY_DEITY_LOTUS_GRACE',stageReq:1,reqMastery:0,nameTh:'หยาดน้ำทิพย์ชุบชีวา',arch:'heal',type:'m',M:0,hits:0,cd:15,wind:4,costPct:5.0,heal:.22,team:true,aiRole:'sustain'},
   {id:'IMD_M2',parentId:'INNATE_MERCY_DEITY_LOTUS_GRACE',stageReq:2,reqMastery:16,reqCultStage:2,nameTh:'ม่านบัวทองคุ้มครองชน',arch:'guard',type:'m',M:0,hits:0,cd:17,wind:3,costPct:5.5,shield:.22,self:true,aiRole:'defensive'}
  ]
 },
 {
  id:'INNATE_SHADOW_ASSASSIN_NIGHT_VEIL',
  nameTh:'ม่านรัตติกาลเร้นเงาสังหาร',
  cat:'LIGHTNESS_ART',
  role:'MOVEMENT_STEALTH_RECON',
  path:'DEMON',
  sub:'SHADOW_ASSASSIN',
  innateSubpath:'SHADOW_ASSASSIN',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'YIN_SHADOW',
  power:92,
  weaponTypes:['BLADE'],
  innateBonus:{p:{eva:.10,atk:.06},pp:{crit:5,critDmg:14}},
  descTh:'วิชาเฉพาะสายนักฆ่าเงาไร้ลักษณ์: เร้นกายในเงามืด เพิ่มหลบหลีก +10% โจมตี +6% คริ +5% แรงคริ +14%',
  moves:['ก้าวเร้นเงารัตติกาล','คมมีดเงาปลิดชีพ'],
  stages:[
   {stage:1,id:'ISN_S1',nameTh:'ขั้นที่ 1 • ก้าวเร้นเงารัตติกาล',reqMastery:0,reqCultStage:1,unlockMoveId:'ISN_M1'},
   {stage:2,id:'ISN_S2',nameTh:'ขั้นที่ 2 • คมมีดเงาปลิดชีพ',reqMastery:18,reqCultStage:3,unlockMoveId:'ISN_M2',passiveBonus:{pp:{crit:4,pen:6}}}
  ],
  moveDefs:[
   {id:'ISN_M1',parentId:'INNATE_SHADOW_ASSASSIN_NIGHT_VEIL',stageReq:1,reqMastery:0,nameTh:'ก้าวเร้นเงารัตติกาล',arch:'evade',type:'p',M:0,hits:0,cd:16,wind:2,costPct:3.5,self:true,aiRole:'defensive'},
   {id:'ISN_M2',parentId:'INNATE_SHADOW_ASSASSIN_NIGHT_VEIL',stageReq:2,reqMastery:18,reqCultStage:3,nameTh:'คมมีดเงาปลิดชีพ',arch:'pierce',type:'p',M:1.82,hits:1,cd:12,wind:3,costPct:5.5,pen:26,critAdd:12,aiRole:'finisher'}
  ]
 },
 {
  id:'INNATE_VENOM_GU_HEART_PARASITE',
  nameTh:'กู่โลหิตสถิตชีพจร',
  cat:'COMBAT_TECHNIQUE',
  role:'COMBAT_OFFENSE',
  path:'DEMON',
  sub:'VENOM_GU_SOVEREIGN',
  innateSubpath:'VENOM_GU_SOVEREIGN',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'WOOD_LIFE',
  power:90,
  weaponTypes:['FOCUS','BLADE'],
  innateBonus:{p:{matk:.09},pp:{pen:8},life:{POISON:.18}},
  descTh:'วิชาเฉพาะสายจ้าวพิษกู่: เลี้ยงกู่ต้นกำเนิดในชีพจร เพิ่มโจมตีวิชา +9% เจาะเกราะ +8% ความชำนาญพิษ +18%',
  moves:['ปล่อยไหมกู่กัดกร่อน','สูบปราณพิษคืนตันเถียน'],
  stages:[
   {stage:1,id:'IVG_S1',nameTh:'ขั้นที่ 1 • ปล่อยไหมกู่กัดกร่อน',reqMastery:0,reqCultStage:1,unlockMoveId:'IVG_M1'},
   {stage:2,id:'IVG_S2',nameTh:'ขั้นที่ 2 • สูบปราณพิษคืนตันเถียน',reqMastery:18,reqCultStage:3,unlockMoveId:'IVG_M2',passiveBonus:{p:{matk:.06},pp:{pen:5}}}
  ],
  moveDefs:[
   {id:'IVG_M1',parentId:'INNATE_VENOM_GU_HEART_PARASITE',stageReq:1,reqMastery:0,nameTh:'ปล่อยไหมกู่กัดกร่อน',arch:'dot',type:'m',M:1.05,dot:0.95,dotKind:'poison',hits:1,cd:10,wind:4,costPct:4.2,pen:15,aiRole:'opener'},
   {id:'IVG_M2',parentId:'INNATE_VENOM_GU_HEART_PARASITE',stageReq:2,reqMastery:18,reqCultStage:3,nameTh:'สูบปราณพิษคืนตันเถียน',arch:'drain',type:'m',M:1.55,hits:1,cd:14,wind:4,costPct:5.8,steal:0.45,qiRestorePct:0.05,aiRole:'sustain'}
  ]
 },
 {
  id:'INNATE_ZEN_VOID_HEART_MIRROR',
  nameTh:'โศลกสุญตากระจกใจไร้ฝุ่น',
  cat:'AUXILIARY_ART',
  role:'HEAL_SUPPORT_TRAINING',
  path:'HEART_SOUL',
  sub:'ZEN_VOID_MIND',
  innateSubpath:'ZEN_VOID_MIND',
  innateOnly:true,
  acquisition:'SUBPATH_INNATE',
  noManual:true,
  noCrystal:true,
  martialRare:true,
  tier:1,
  reqTier:1,
  grade:'Exceptional',
  element:'LIGHT_YANG',
  power:90,
  weaponTypes:['STAFF','FOCUS'],
  innateBonus:{p:{mdef:.12,def:.06},f:{cast:8},cultRatePct:0.08},
  descTh:'วิชาเฉพาะสายปราชญ์เซนสุญตา: รักษาใจใสไร้ฝุ่น เพิ่มป้องกันวิชา +12% ป้องกัน +6% ร่ายไว +8 และบำเพ็ญไว +8%',
  moves:['กระจกใจสะท้อนมายา','ระฆังเซนชำระจิตมาร'],
  stages:[
   {stage:1,id:'IZV_S1',nameTh:'ขั้นที่ 1 • กระจกใจสะท้อนมายา',reqMastery:0,reqCultStage:1,unlockMoveId:'IZV_M1'},
   {stage:2,id:'IZV_S2',nameTh:'ขั้นที่ 2 • ระฆังเซนชำระจิตมาร',reqMastery:18,reqCultStage:3,unlockMoveId:'IZV_M2',passiveBonus:{p:{mdef:.08},f:{eva:8}}}
  ],
  moveDefs:[
   {id:'IZV_M1',parentId:'INNATE_ZEN_VOID_HEART_MIRROR',stageReq:1,reqMastery:0,nameTh:'กระจกใจสะท้อนมายา',arch:'counter',type:'m',M:1.60,hits:1,cd:13,wind:3,costPct:4.2,pen:15,self:true,aiRole:'defensive'},
   {id:'IZV_M2',parentId:'INNATE_ZEN_VOID_HEART_MIRROR',stageReq:2,reqMastery:18,reqCultStage:3,nameTh:'ระฆังเซนชำระจิตมาร',arch:'support',type:'m',M:0,hits:0,cd:18,wind:4,costPct:5.8,support:{kind:'holyAura',dur:16},team:true,aiRole:'sustain'}
  ]
 }
];
D.innateTechniques.forEach(t=>JD.TECH.techniques.push(t));

// 9. Apply Coherent Tier & Grade Rubric across all entries in JD.TECH.techniques and JD.TECH.mantras
// Grade === "Legendary" is strictly reserved for t.legendary === true (22 entries).
// Non-legendary entries across Tiers 1..7 are graded into Common, Refined, Rare, and Exceptional.
function classifyEntryGrade(t){
 if(t.legendary) return 'Legendary';
 if(t.grade && t.grade !== 'Legendary') return t.grade;
 if(t.martialBootstrap) return 'Common';
 if(t.innateOnly) return 'Exceptional';
 if(t.cat === 'FORBIDDEN_ART') return t.tier >= 6 ? 'Exceptional' : 'Rare';
 if(t.martialRare || t.sourcePack) return t.tier >= 5 ? 'Exceptional' : 'Rare';
 const p = t.power || 0;
 if(t.tier >= 7) return p >= 340 ? 'Exceptional' : 'Rare';
 if(t.tier === 6) return p >= 255 ? 'Exceptional' : p >= 230 ? 'Rare' : 'Refined';
 if(t.tier === 5) return p >= 220 ? 'Exceptional' : p >= 190 ? 'Rare' : 'Refined';
 if(t.tier === 4) return p >= 188 ? 'Exceptional' : p >= 170 ? 'Rare' : p >= 150 ? 'Refined' : 'Common';
 if(t.tier === 3) return p >= 158 ? 'Exceptional' : p >= 142 ? 'Rare' : p >= 122 ? 'Refined' : 'Common';
 if(t.tier === 2) return p >= 115 ? 'Rare' : p >= 95 ? 'Refined' : 'Common';
 return p >= 70 ? 'Refined' : 'Common';
}
D.classifyEntryGrade=classifyEntryGrade;

[...JD.TECH.techniques, ...JD.TECH.mantras].forEach(t=>{
 if(t.origTier === undefined) t.origTier = t.tier;
 if(t.origReqTier === undefined) t.origReqTier = t.reqTier != null ? t.reqTier : t.tier;
 if(t.origCat === undefined) t.origCat = t.cat;
 // Standardize tier === reqTier across the catalog so stage prerequisite and displayed tier never conflict
 if(t.reqTier != null && !t.overhaulPack && !t.innateOnly) t.tier = t.reqTier; else t.reqTier = t.tier;
 t.grade = classifyEntryGrade(t);
 if(t.legendary && t.overhaulPack) t.overhaulLegendary = true;
 if(EXISTING_MULTI_MOVE_SPECS[t.id]){
  t.stages = EXISTING_MULTI_MOVE_SPECS[t.id].stages;
  t.moveDefs = EXISTING_MULTI_MOVE_SPECS[t.id].moveDefs;
 }
});

// Older text-only weapons receive a deterministic type once at the catalog boundary.
JD.ITEMS.items.forEach(i=>{if(i.slot)i.gearType=i.gearType||D.classify(i.slot,i.nameTh);});
JD.ITEMS.recipes.forEach(r=>{if(r.outType==='EQUIPMENT'){const it=JD.ITEMS.items.find(i=>i.id===r.outItemId);if(it)r.gearType=it.gearType;}});
const preferred={SWORD_IMMORTAL:['SWORD'],MIND_SWORD_TELEKINESIS:['SWORD','FOCUS'],SHADOW_ASSASSIN:['BLADE'],WAR_DEITY:['SPEAR','BLADE'],TIGER_SOVEREIGN:['FIST'],BLOOD_DRAGON:['FIST'],VAJRA_BODHI:['STAFF','FIST'],STAFF_GUARD:['STAFF'],STAR_ARCHER:['BOW']};
JD.TECH.techniques.forEach(t=>{if(t.cat==='COMBAT_TECHNIQUE'&&!t.weaponTypes&&preferred[t.sub])t.weaponTypes=preferred[t.sub].slice();});
D.preferred=preferred;
D.subPreferences={STAR_ARCHER:{aff:{SWORD:.2,WIND:.5},p:{'physiology.dexterity':.7,'intellect.perceptiveness':.6,'personality.caution':.3}},STAFF_GUARD:{aff:{BODY_REFINING:.8},p:{'physiology.toughness':.7,'physiology.endurance':.6,'personality.loyalty':.3}}};
})(typeof globalThis!=='undefined'?globalThis:this);
