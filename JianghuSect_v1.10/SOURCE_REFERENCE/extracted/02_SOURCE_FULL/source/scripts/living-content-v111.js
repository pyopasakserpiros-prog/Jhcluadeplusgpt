/* Jianghu v1.11 + v1.12 Major Expansion — connected ecology, material, crafting,
 * 5 major cultivation paths (41 subpaths/tracks), 66 martial arts manuals (Tiers 1-7),
 * weighted fortuitous encounter drop pools, NPC status keywords, and multi-format chronicle reports.
 * Leaves Human Foundation and save envelope v8 untouched.
 */
(function(root){'use strict';
const E=root.World2026Engine,D=E?.PATCH140_DATA;
if(!E||!D)throw new Error('Jianghu v1.11/v1.12 content requires the preserved v1.8 engine catalogs');
const addUnique=(arr,items)=>{if(!Array.isArray(arr))return;const ids=new Set(arr.map(x=>x.id));for(const item of items)if(!ids.has(item.id)){arr.push(item);ids.add(item.id);}};

// ============================================================================
// PART A: PRESERVED V1.11 ECOLOGY, MATERIALS & RECIPES (100% INTACT)
// ============================================================================
const materials=[
 // New herbs
 {id:'MAT_HERB_CLOUD_PEONY_2',nameTh:'โบตั๋นเมฆาคราม',category:'HERB',tier:2,primaryCraftPath:'ALCHEMY',compatiblePaths:['ALCHEMY','BEAST_TAMING'],season:'SPRING',terrain:'forest',baseValueStones:27,seedNameTh:'เมล็ดโบตั๋นเมฆาคราม',regenPerSeason:10,isTranscendent:false},
 {id:'MAT_HERB_THUNDER_BAMBOO_3',nameTh:'หน่อไผ่อัสนี',category:'HERB',tier:3,primaryCraftPath:'ALCHEMY',compatiblePaths:['ALCHEMY','TALISMAN'],season:'SUMMER',terrain:'plains',baseValueStones:61,seedNameTh:'เหง้าไผ่อัสนี',regenPerSeason:7,isTranscendent:false},
 {id:'MAT_HERB_FROST_MOON_BERRY_3',nameTh:'ผลจันทราเหมันต์',category:'HERB',tier:3,primaryCraftPath:'ALCHEMY',compatiblePaths:['ALCHEMY'],season:'WINTER',terrain:'mountain',baseValueStones:68,seedNameTh:'เมล็ดจันทราเหมันต์',regenPerSeason:6,isTranscendent:false},
 {id:'MAT_HERB_SUNSET_ORCHID_4',nameTh:'กล้วยไม้สนธยา',category:'HERB',tier:4,primaryCraftPath:'ALCHEMY',compatiblePaths:['ALCHEMY','TALISMAN'],season:'AUTUMN',terrain:'forest',baseValueStones:148,seedNameTh:'หัวกล้วยไม้สนธยา',regenPerSeason:4,isTranscendent:false},
 // New ores
 {id:'MAT_ORE_SPIRIT_COPPER_2',nameTh:'ทองแดงสื่อปราณ',category:'ORE',tier:2,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','ARRAY'],season:'ALL',terrain:'mountain',baseValueStones:29,finiteReserve:78,slowCrystalRegen:false,isTranscendent:false},
 {id:'MAT_ORE_CLOUD_JADE_3',nameTh:'หยกเมฆาคราม',category:'ORE',tier:3,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','ARRAY','TALISMAN'],season:'ALL',terrain:'mountain',baseValueStones:69,finiteReserve:52,slowCrystalRegen:true,isTranscendent:false},
 {id:'MAT_ORE_THUNDER_IRON_4',nameTh:'เหล็กอัสนีคราม',category:'ORE',tier:4,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','ARRAY'],season:'ALL',terrain:'mountain',baseValueStones:154,finiteReserve:32,slowCrystalRegen:false,isTranscendent:false},
 // New anatomically valid beast materials
 {id:'MAT_BP_FOXFIRE_GALL_2',nameTh:'ถุงเพลิงวิญญาณจิ้งจอก',category:'BEAST_PART',anatomyType:'HEART_GALL',tier:2,primaryCraftPath:'ALCHEMY',compatiblePaths:['ALCHEMY','BEAST_TAMING'],season:'ALL',terrain:'forest',baseValueStones:34,isTranscendent:false},
 {id:'MAT_BP_CLOUDFOX_PELT_2',nameTh:'หนังจิ้งจอกเมฆาคราม',category:'BEAST_PART',anatomyType:'HIDE_PELT',tier:2,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','TALISMAN'],season:'ALL',terrain:'forest',baseValueStones:31,isTranscendent:false},
 {id:'MAT_BP_CLOUDFOX_FUR_2',nameTh:'ขนวิญญาณจิ้งจอกเมฆา',category:'BEAST_PART',anatomyType:'SPIRIT_HAIR_FEATHER',tier:2,primaryCraftPath:'TALISMAN',compatiblePaths:['TALISMAN','FORGING'],season:'ALL',terrain:'forest',baseValueStones:29,isTranscendent:false},
 {id:'MAT_BP_CLOUD_ANTLER_2',nameTh:'เขากวางเมฆารวมปราณ',category:'BEAST_PART',anatomyType:'BONE_HORN',tier:2,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','ARRAY'],season:'ALL',terrain:'plains',baseValueStones:33,isTranscendent:false},
 {id:'MAT_BP_CLOUD_SINEW_2',nameTh:'เอ็นกวางเมฆา',category:'BEAST_PART',anatomyType:'TENDON_TAIL',tier:2,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','BEAST_TAMING'],season:'ALL',terrain:'plains',baseValueStones:28,isTranscendent:false},
 {id:'MAT_BP_JADE_TURTLE_SHELL_3',nameTh:'กระดองเต่าหยกธารา',category:'BEAST_PART',anatomyType:'SCALE_CARAPACE',tier:3,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','ARRAY'],season:'ALL',terrain:'plains',baseValueStones:72,isTranscendent:false},
 {id:'MAT_BP_TIDE_CORE_3',nameTh:'แก่นธาราปราณเต่าหยก',category:'BEAST_PART',anatomyType:'BEAST_CORE',tier:3,primaryCraftPath:'ARRAY',compatiblePaths:['ARRAY','ALCHEMY','FORGING'],season:'ALL',terrain:'plains',baseValueStones:76,isTranscendent:false},
 {id:'MAT_BP_TURTLE_HEART_3',nameTh:'หัวใจเต่าหยกธารา',category:'BEAST_PART',anatomyType:'HEART_GALL',tier:3,primaryCraftPath:'ALCHEMY',compatiblePaths:['ALCHEMY','BEAST_TAMING'],season:'ALL',terrain:'plains',baseValueStones:70,isTranscendent:false},
 {id:'MAT_BP_ASHEN_FEATHER_3',nameTh:'ขนอีกาเถ้าดารา',category:'BEAST_PART',anatomyType:'SPIRIT_HAIR_FEATHER',tier:3,primaryCraftPath:'TALISMAN',compatiblePaths:['TALISMAN','FORGING'],season:'ALL',terrain:'plains',baseValueStones:64,isTranscendent:false},
 {id:'MAT_BP_EMBER_GALL_3',nameTh:'ถุงอัคคีอีกาเถ้า',category:'BEAST_PART',anatomyType:'HEART_GALL',tier:3,primaryCraftPath:'ALCHEMY',compatiblePaths:['ALCHEMY','FORGING'],season:'ALL',terrain:'plains',baseValueStones:67,isTranscendent:false},
 {id:'MAT_BP_EMBER_CORE_3',nameTh:'แก่นอัคคีอีกาเถ้า',category:'BEAST_PART',anatomyType:'BEAST_CORE',tier:3,primaryCraftPath:'ARRAY',compatiblePaths:['ARRAY','ALCHEMY','FORGING'],season:'ALL',terrain:'plains',baseValueStones:73,isTranscendent:false},
 {id:'MAT_BP_CRYSTAL_KNUCKLE_3',nameTh:'กระดูกข้อนิ้ววานรผลึก',category:'BEAST_PART',anatomyType:'BONE_HORN',tier:3,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','ARRAY'],season:'ALL',terrain:'mountain',baseValueStones:70,isTranscendent:false},
 {id:'MAT_BP_CRYSTAL_CORE_3',nameTh:'แก่นผลึกวานรศิลา',category:'BEAST_PART',anatomyType:'BEAST_CORE',tier:3,primaryCraftPath:'ARRAY',compatiblePaths:['ARRAY','ALCHEMY','FORGING'],season:'ALL',terrain:'mountain',baseValueStones:78,isTranscendent:false},
 {id:'MAT_BP_CRYSTAL_HIDE_3',nameTh:'หนังหินผลึกวานร',category:'BEAST_PART',anatomyType:'HIDE_PELT',tier:3,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','TALISMAN'],season:'ALL',terrain:'mountain',baseValueStones:66,isTranscendent:false},
 {id:'MAT_BP_FROST_LYNX_FUR_4',nameTh:'ขนแมวป่าจันทราเหมันต์',category:'BEAST_PART',anatomyType:'SPIRIT_HAIR_FEATHER',tier:4,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','TALISMAN'],season:'ALL',terrain:'mountain',baseValueStones:151,isTranscendent:false},
 {id:'MAT_BP_MOON_FANG_4',nameTh:'เขี้ยวจันทราแมวป่าเหมันต์',category:'BEAST_PART',anatomyType:'FANG_CLAW',tier:4,primaryCraftPath:'FORGING',compatiblePaths:['FORGING'],season:'ALL',terrain:'mountain',baseValueStones:158,isTranscendent:false},
 {id:'MAT_BP_FROST_HEART_4',nameTh:'หัวใจเหมันต์แมวป่าจันทรา',category:'BEAST_PART',anatomyType:'HEART_GALL',tier:4,primaryCraftPath:'ALCHEMY',compatiblePaths:['ALCHEMY','BEAST_TAMING'],season:'ALL',terrain:'mountain',baseValueStones:164,isTranscendent:false},
 {id:'MAT_BP_CLOUD_QILIN_HORN_3',nameTh:'เขากิเลนเมฆาวัยเยาว์',category:'BEAST_PART',anatomyType:'BONE_HORN',tier:3,primaryCraftPath:'FORGING',compatiblePaths:['FORGING','ARRAY'],season:'ALL',terrain:'plains',baseValueStones:88,isTranscendent:false},
 {id:'MAT_BP_QILIN_CORE_3',nameTh:'แก่นกิเลนเมฆา',category:'BEAST_PART',anatomyType:'BEAST_CORE',tier:3,primaryCraftPath:'ARRAY',compatiblePaths:['ARRAY','ALCHEMY','FORGING'],season:'ALL',terrain:'plains',baseValueStones:94,isTranscendent:false}
];
const beasts=[
 {id:'BEAST_CLOUD_FOX',nameTh:'จิ้งจอกเพลิงเมฆาคราม',tier:2,maxDropSlots:3,terrain:'forest',combatPower:245,basePop:88,maxPop:145,reproPerSeason:14,element:'FIRE',descTh:'อสูรเจ้าเล่ห์ที่เก็บเพลิงปราณไว้ในถุงอวัยวะใต้หัวใจ มักหลบผู้แข็งแกร่งและออกล่าในยามพลบค่ำ',anatomy:{hasBlood:true,hasHeartGall:true,hasVenom:false,hasHide:true,hasScales:false,hasBoneHorn:true,hasFangClaw:true,hasTendonTail:true,hasFurOrFeather:true,hasCore:true,hasMeatMusk:true},partDrops:[{matId:'MAT_BP_FOXFIRE_GALL_2',anatomyType:'HEART_GALL'},{matId:'MAT_BP_CLOUDFOX_PELT_2',anatomyType:'HIDE_PELT'},{matId:'MAT_BP_CLOUDFOX_FUR_2',anatomyType:'SPIRIT_HAIR_FEATHER'}]},
 {id:'BEAST_CLOUD_ANTLER_DEER',nameTh:'กวางเขาเมฆารวมปราณ',tier:2,maxDropSlots:3,terrain:'plains',combatPower:185,basePop:105,maxPop:170,reproPerSeason:18,element:'WIND',descTh:'กวางกินหมอกที่เขาควบแน่นปราณไม้และวายุ เป็นสัตว์ระวังภัยแต่จะพุ่งชนเมื่อถูกต้อนจนมุม',anatomy:{hasBlood:true,hasHeartGall:true,hasVenom:false,hasHide:true,hasScales:false,hasBoneHorn:true,hasFangClaw:false,hasTendonTail:true,hasFurOrFeather:true,hasCore:false,hasMeatMusk:true},partDrops:[{matId:'MAT_BP_CLOUD_ANTLER_2',anatomyType:'BONE_HORN'},{matId:'MAT_BP_CLOUD_SINEW_2',anatomyType:'TENDON_TAIL'},{matId:'MAT_BP_BEAST_MEAT_1',anatomyType:'MEAT_EGG_MUSK'}]},
 {id:'BEAST_JADE_TIDE_TURTLE',nameTh:'เต่ากระดองหยกธารา',tier:3,terrain:'plains',combatPower:410,basePop:58,maxPop:92,reproPerSeason:9,element:'WATER',descTh:'อสูรธาตุน้ำที่อาศัยตามสระและลำธาร กระดองเก็บแรงกระแทกและแก่นปราณเย็นไว้ได้ยาวนาน',anatomy:{hasBlood:true,hasHeartGall:true,hasVenom:false,hasHide:false,hasScales:true,hasBoneHorn:true,hasFangClaw:false,hasTendonTail:true,hasFurOrFeather:false,hasCore:true,hasMeatMusk:true},partDrops:[{matId:'MAT_BP_JADE_TURTLE_SHELL_3',anatomyType:'SCALE_CARAPACE'},{matId:'MAT_BP_TIDE_CORE_3',anatomyType:'BEAST_CORE'},{matId:'MAT_BP_TURTLE_HEART_3',anatomyType:'HEART_GALL'}]},
 {id:'BEAST_ASHEN_CROW',nameTh:'อีกาเถ้าดารา',tier:3,terrain:'plains',combatPower:435,basePop:62,maxPop:100,reproPerSeason:10,element:'FIRE',descTh:'วิหคสีเทาที่กินสะเก็ดแร่ร้อนและสะสมอัคคีปราณไว้ในแก่นกลาง ขนของมันนำพลังยันต์ได้ดี',anatomy:{hasBlood:true,hasHeartGall:true,hasVenom:false,hasHide:false,hasScales:false,hasBoneHorn:true,hasFangClaw:true,hasTendonTail:true,hasFurOrFeather:true,hasCore:true,hasMeatMusk:true},partDrops:[{matId:'MAT_BP_ASHEN_FEATHER_3',anatomyType:'SPIRIT_HAIR_FEATHER'},{matId:'MAT_BP_EMBER_GALL_3',anatomyType:'HEART_GALL'},{matId:'MAT_BP_EMBER_CORE_3',anatomyType:'BEAST_CORE'}]},
 {id:'BEAST_CRYSTALBACK_APE',nameTh:'วานรหลังผลึกศิลา',tier:3,terrain:'mountain',combatPower:520,basePop:48,maxPop:78,reproPerSeason:8,element:'EARTH',descTh:'วานรภูผาที่มีผลึกแร่เติบโตตามกระดูกและหนัง ชอบปกป้องแหล่งแร่จากผู้บุกรุก',anatomy:{hasBlood:true,hasHeartGall:true,hasVenom:false,hasHide:true,hasScales:false,hasBoneHorn:true,hasFangClaw:true,hasTendonTail:true,hasFurOrFeather:true,hasCore:true,hasMeatMusk:true},partDrops:[{matId:'MAT_BP_CRYSTAL_KNUCKLE_3',anatomyType:'BONE_HORN'},{matId:'MAT_BP_CRYSTAL_CORE_3',anatomyType:'BEAST_CORE'},{matId:'MAT_BP_CRYSTAL_HIDE_3',anatomyType:'HIDE_PELT'}]},
 {id:'BEAST_FROST_MOON_LYNX',nameTh:'แมวป่าจันทราเหมันต์',tier:4,terrain:'mountain',combatPower:820,basePop:24,maxPop:42,reproPerSeason:4,element:'WATER',descTh:'นักล่าหายากบนสันเขาหนาวเย็น เคลื่อนที่เงียบจนแทบไร้เสียงและเก็บปราณเย็นไว้ในหัวใจ',anatomy:{hasBlood:true,hasHeartGall:true,hasVenom:false,hasHide:true,hasScales:false,hasBoneHorn:true,hasFangClaw:true,hasTendonTail:true,hasFurOrFeather:true,hasCore:true,hasMeatMusk:true},partDrops:[{matId:'MAT_BP_FROST_LYNX_FUR_4',anatomyType:'SPIRIT_HAIR_FEATHER'},{matId:'MAT_BP_MOON_FANG_4',anatomyType:'FANG_CLAW'},{matId:'MAT_BP_FROST_HEART_4',anatomyType:'HEART_GALL'}]},
 {id:'BEAST_CLOUD_QILIN_CALF',nameTh:'ลูกกิเลนเมฆาคราม',tier:3,terrain:'plains',combatPower:470,basePop:12,maxPop:20,reproPerSeason:3,element:'WIND',descTh:'กิเลนวัยเยาว์ที่ถูกพบใกล้แหล่งปราณสงบ มักหลบซ่อนตัวและจะปรากฏเมื่ออุทยานอสูรได้รับการดูแลดี',anatomy:{hasBlood:true,hasHeartGall:true,hasVenom:false,hasHide:true,hasScales:true,hasBoneHorn:true,hasFangClaw:true,hasTendonTail:true,hasFurOrFeather:false,hasCore:true,hasMeatMusk:true},partDrops:[{matId:'MAT_BP_CLOUD_QILIN_HORN_3',anatomyType:'BONE_HORN'},{matId:'MAT_BP_QILIN_CORE_3',anatomyType:'BEAST_CORE'}]}
];
const recipes=[
 {id:'REC1110_ALC_FOXFIRE_QI',nameTh:'ตำรับโอสถรวมปราณเพลิงจิ้งจอก',craftPath:'ALCHEMY',tier:2,minMastery:30,durationDays:20,inputs:[{matId:'MAT_HERB_DEW_GRASS_1',count:2},{matId:'MAT_HERB_CLOUD_PEONY_2',count:1},{matId:'MAT_BP_FOXFIRE_GALL_2',count:1}],outputType:'PILL',outputSubSlot:null,outputNameTh:'โอสถรวมปราณเพลิงจิ้งจอก',effect:{cultivationProgress:17,healHealth:12,toxicity:3},descTh:'ประสานหญ้าน้ำค้างกับโบตั๋นเมฆาและถุงเพลิงอสูร เพื่อเร่งการรวบรวมปราณอย่างมีความเสี่ยงต่อพิษโอสถ'},
 {id:'REC1110_ALC_TIDE_MARROW',nameTh:'ตำรับโอสถไขกระดูกธาราหยก',craftPath:'ALCHEMY',tier:3,minMastery:44,durationDays:28,inputs:[{matId:'MAT_HERB_JADE_LOTUS_2',count:1},{matId:'MAT_BP_TIDE_CORE_3',count:1},{matId:'MAT_BP_TURTLE_HEART_3',count:1}],outputType:'PILL',outputSubSlot:null,outputNameTh:'โอสถไขกระดูกธาราหยก',effect:{healHealth:24,healInjury:28,clearPoison:12,toxicity:4},descTh:'โอสถประคองบาดแผลและชำระพิษจากแก่นธาราของเต่าหยก'},
 {id:'REC1110_ALC_EMBER_PURGE',nameTh:'ตำรับโอสถชำระอัคคีเถ้า',craftPath:'ALCHEMY',tier:3,minMastery:46,durationDays:30,inputs:[{matId:'MAT_HERB_CINDER_LEAF_1',count:2},{matId:'MAT_HERB_THUNDER_BAMBOO_3',count:1},{matId:'MAT_BP_EMBER_GALL_3',count:1},{matId:'MAT_BP_EMBER_CORE_3',count:1}],outputType:'PILL',outputSubSlot:null,outputNameTh:'โอสถชำระอัคคีเถ้า',effect:{clearPoison:28,clearHeartDemon:8,healHealth:10,toxicity:3},descTh:'ใช้หน่อไผ่อัสนีปรับสมดุลถุงอัคคีของอีกาเถ้า ช่วยถอนพิษและสงบจิต'},
 {id:'REC1110_ALC_SUNSET_SOOTHE',nameTh:'ตำรับโอสถกล้วยไม้สนธยาประคองชีพ',craftPath:'ALCHEMY',tier:2,minMastery:34,durationDays:22,inputs:[{matId:'MAT_HERB_SUNSET_ORCHID_4',count:1},{matId:'MAT_BP_CLOUDFOX_FUR_2',count:1},{matId:'MAT_HERB_DEW_GRASS_1',count:2}],outputType:'PILL',outputSubSlot:null,outputNameTh:'โอสถกล้วยไม้สนธยาประคองชีพ',effect:{healHealth:26,healInjury:12,toxicity:2},descTh:'กล้วยไม้สนธยาช่วยประคองชีพและบรรเทาความอ่อนล้าเมื่อใช้ร่วมกับขนวิญญาณจิ้งจอก'},
 {id:'REC1110_ALC_FROST_MOON',nameTh:'ตำรับโอสถจันทราเหมันต์สลายพิษ',craftPath:'ALCHEMY',tier:4,minMastery:60,durationDays:38,inputs:[{matId:'MAT_HERB_FROST_MOON_BERRY_3',count:2},{matId:'MAT_HERB_MIST_ORCHID_2',count:1},{matId:'MAT_BP_FROST_HEART_4',count:1}],outputType:'PILL',outputSubSlot:null,outputNameTh:'โอสถจันทราเหมันต์สลายพิษ',effect:{clearPoison:40,clearHeartDemon:18,healInjury:22,cultivationProgress:12,toxicity:4},descTh:'โอสถเย็นระดับสูงที่ต้องใช้หัวใจแมวป่าเหมันต์ซึ่งเก็บเกี่ยวอย่างประณีต'},
 {id:'REC1110_FRG_ANTLER_SPEAR',nameTh:'ตำรับหลอมทวนเขากวางเมฆา',craftPath:'FORGING',tier:2,minMastery:30,durationDays:22,inputs:[{matId:'MAT_ORE_BLACK_IRON_1',count:1},{matId:'MAT_ORE_SPIRIT_COPPER_2',count:1},{matId:'MAT_BP_CLOUD_ANTLER_2',count:1},{matId:'MAT_BP_CLOUD_SINEW_2',count:1}],outputType:'EQUIPMENT',outputSubSlot:'WEAPON',outputNameTh:'ทวนเขากวางเมฆา',compatiblePath:'ANY',effect:{combatMult:0.10,defenseMult:0.025,minStageReq:1},descTh:'ทวนสมดุลที่ผสานแร่เดิมกับเขาและเอ็นกวางเมฆา เหมาะกับศิษย์ช่วงต้น'},
 {id:'REC1110_FRG_CLOUDFOX_LEATHER',nameTh:'ตำรับตัดเกราะหนังจิ้งจอกเมฆา',craftPath:'FORGING',tier:2,minMastery:34,durationDays:24,inputs:[{matId:'MAT_ORE_SPIRIT_COPPER_2',count:1},{matId:'MAT_BP_CLOUDFOX_PELT_2',count:2},{matId:'MAT_BP_CLOUDFOX_FUR_2',count:1}],outputType:'EQUIPMENT',outputSubSlot:'ARMOR',outputNameTh:'เกราะหนังจิ้งจอกเมฆา',compatiblePath:'ANY',effect:{combatMult:0.025,defenseMult:0.105,minStageReq:1},descTh:'เกราะอ่อนที่รักษาความคล่องตัวและใช้หนังกับขนของจิ้งจอกเมฆาคราม'},
 {id:'REC1110_FRG_CRYSTAL_GUARD',nameTh:'ตำรับหลอมเกราะกระดองผลึก',craftPath:'FORGING',tier:3,minMastery:46,durationDays:32,inputs:[{matId:'MAT_ORE_CLOUD_JADE_3',count:2},{matId:'MAT_BP_JADE_TURTLE_SHELL_3',count:1},{matId:'MAT_BP_CRYSTAL_KNUCKLE_3',count:1},{matId:'MAT_BP_CRYSTAL_CORE_3',count:1},{matId:'MAT_BP_CRYSTAL_HIDE_3',count:1},{matId:'MAT_BP_BOAR_HIDE_2',count:1}],outputType:'EQUIPMENT',outputSubSlot:'ARMOR',outputNameTh:'เกราะกระดองผลึกเมฆา',compatiblePath:'ANY',effect:{combatMult:0.045,defenseMult:0.16,minStageReq:2},descTh:'เกราะหนักที่รวมกระดองเต่าหยกกับผลึกวานร ต้องใช้วัตถุดิบจากสองถิ่นอาศัย'},
 {id:'REC1110_FRG_EMBER_CROW_TALISMAN',nameTh:'ตำรับหลอมเครื่องรางขนอีกาเถ้า',craftPath:'FORGING',tier:3,minMastery:46,durationDays:30,inputs:[{matId:'MAT_ORE_CINNABAR_1',count:2},{matId:'MAT_ORE_JADE_SLATE_2',count:1},{matId:'MAT_BP_ASHEN_FEATHER_3',count:2},{matId:'MAT_BP_EMBER_CORE_3',count:1}],outputType:'EQUIPMENT',outputSubSlot:'TALISMAN_VESSEL',outputNameTh:'เครื่องรางขนอีกาเถ้า',compatiblePath:'ANY',effect:{combatMult:0.045,defenseMult:0.07,craftBonusPath:'TALISMAN',craftBonusScore:8,minStageReq:2},descTh:'เครื่องรางที่ให้ขนอีกาเป็นตัวนำปราณและใช้แร่ชาดเก่าผนึกอักขระ'},
 {id:'REC1110_FRG_FROST_MOON_MANTLE',nameTh:'ตำรับหลอมเกราะคลุมจันทราเหมันต์',craftPath:'FORGING',tier:4,minMastery:60,durationDays:40,inputs:[{matId:'MAT_ORE_THUNDER_IRON_4',count:2},{matId:'MAT_ORE_COLD_STEEL_2',count:1},{matId:'MAT_BP_FROST_LYNX_FUR_4',count:2},{matId:'MAT_BP_MOON_FANG_4',count:1}],outputType:'EQUIPMENT',outputSubSlot:'ARMOR',outputNameTh:'เกราะคลุมจันทราเหมันต์',compatiblePath:'ANY',effect:{combatMult:0.06,defenseMult:0.19,minStageReq:3},descTh:'เกราะชั้นสูงที่ใช้ขนเหมันต์และเขี้ยวจันทรา ร่วมกับเหล็กอัสนีและเหล็กเย็นเดิม'},
 {id:'REC1110_FRG_QILIN_WARD',nameTh:'ตำรับหลอมตราพิทักษ์กิเลนเมฆา',craftPath:'FORGING',tier:3,minMastery:48,durationDays:34,inputs:[{matId:'MAT_ORE_CLOUD_JADE_3',count:1},{matId:'MAT_ORE_JADE_SLATE_2',count:1},{matId:'MAT_BP_CLOUD_QILIN_HORN_3',count:1},{matId:'MAT_BP_QILIN_CORE_3',count:1}],outputType:'EQUIPMENT',outputSubSlot:'TALISMAN_VESSEL',outputNameTh:'ตราพิทักษ์กิเลนเมฆา',compatiblePath:'ANY',effect:{combatMult:0.055,defenseMult:0.10,escortSafetyBonus:0.08,minStageReq:2},descTh:'ตราอุปกรณ์หายากจากลูกกิเลนในอุทยานอสูร ใช้หยกใหม่ร่วมกับศิลาหยกเดิม'}
];
addUnique(D.MATERIALS_REGISTRY_V140,materials);
addUnique(D.BEAST_SPECIES_V140,beasts);
addUnique(D.STARTER_RECIPES_V140,recipes);

// ============================================================================
// PART B: V1.12 MAJOR CULTIVATION PATHS & 14 NEW SUBPATHS / V1200 TRACKS
// ============================================================================
const NEW_MAJOR_PATHS_V112 = {
  DEMON: {
    id: 'DEMON',
    nameTh: 'วิถีมารอสูร (หลอมปราณหยินโลหิตและฝืนลิขิตฟ้า)',
    shortTh: 'วิถีมารอสูร',
    icon: '🩸',
    color: '#e599f7',
    maxStage: 9,
    resourceUsed: 'แก่นอสูร สมุนไพรพิษ และศิลาปราณหยิน',
    coreMechanicTh: 'ทวนกระแสฟ้าดิน หลอมรวมไอสังหาร เงามืด พิษกู่ และปราณหยินเข้าสู่ตันเถียนมาร ก้าวหน้าฉับไวและดุดันในศึกสังหาร',
    supremeRiskId: 'DEMONIC_BACKLASH_FRENZY',
    supremeRiskTh: 'ปราณมารย้อนกลับ / จิตสังหารกลืนกินสติสัมปชัญญะ',
    stages: [
      { stage: 1, nameTh: 'ขั้นที่ 1 • ก่อจิตมาร', lifespanMax: 95, combatPower: 130, breakthroughBaseChance: 0.76, tribulationLayers: 0, resourceReq: 'ศิลาปราณสามัญ' },
      { stage: 2, nameTh: 'ขั้นที่ 2 • หลอมโลหิตหยิน', lifespanMax: 125, combatPower: 270, breakthroughBaseChance: 0.66, tribulationLayers: 0, resourceReq: 'โอสถหลอมโลหิต' },
      { stage: 3, nameTh: 'ขั้นที่ 3 • รากฐานมารอสูร', lifespanMax: 170, combatPower: 550, breakthroughBaseChance: 0.54, tribulationLayers: 1, resourceReq: 'แก่นอสูรหลอมรวม' },
      { stage: 4, nameTh: 'ขั้นที่ 4 • แก่นมารทมิฬ', lifespanMax: 245, combatPower: 1120, breakthroughBaseChance: 0.45, tribulationLayers: 2, resourceReq: 'โอสถแก่นมาร' },
      { stage: 5, nameTh: 'ขั้นที่ 5 • ทารกมารนิรันดร์', lifespanMax: 375, combatPower: 2280, breakthroughBaseChance: 0.36, tribulationLayers: 3, resourceReq: 'ผลึกอเวจี' },
      { stage: 6, nameTh: 'ขั้นที่ 6 • จอมมารสะท้านภพ', lifespanMax: 550, combatPower: 4500, breakthroughBaseChance: 0.28, tribulationLayers: 4, resourceReq: 'โลหิตอสูรบรรพกาล' },
      { stage: 7, nameTh: 'ขั้นที่ 7 • เขตแดนมารทลายฟ้า', lifespanMax: 810, combatPower: 8800, breakthroughBaseChance: 0.20, tribulationLayers: 6, resourceReq: 'ศิลาดาราทมิฬ' },
      { stage: 8, nameTh: 'ขั้นที่ 8 • มารบรรพกาลอมตะ', lifespanMax: 1150, combatPower: 16500, breakthroughBaseChance: 0.14, tribulationLayers: 7, resourceReq: 'แก่นมารบรรพกาล' },
      { stage: 9, nameTh: 'ขั้นที่ 9 • มหาจักรพรรดิมารนิรันดร์', lifespanMax: 1850, combatPower: 31000, breakthroughBaseChance: 0.10, tribulationLayers: 9, resourceReq: 'ตราโกลาหลสามภพ' }
    ],
    subPaths: {
      SHADOW_ASSASSIN: {
        id: 'SHADOW_ASSASSIN',
        nameTh: 'สายนักฆ่าเงาไร้ลักษณ์',
        resourceTh: 'ศิลาเงารัตติกาลและมีดสั้นอาบปราณหยิน',
        strengthTh: 'เร้นกายในเงามืด ความเร็วและอัตราคริติคอลสูงสุด ปลิดชีพในพริบตา',
        weaknessTh: 'พลังป้องกันกายภาพต่ำหากถูกตรึงอยู่ในค่ายกลแสงสว่าง',
        combatBonus: 1.28,
        defenseBonus: 0.90,
        breakthroughMod: 0.96
      },
      VENOM_GU_SOVEREIGN: {
        id: 'VENOM_GU_SOVEREIGN',
        nameTh: 'สายจ้าวพิษกู่หมื่นอสรพิษ',
        resourceTh: 'สมุนไพรพิษหายาก ถุงพิษอสูร และแมลงกู่บรรพกาล',
        strengthTh: 'กัดกร่อนเกราะและสูบปราณศัตรูต่อเนื่อง ต้านทานพิษร้ายทุกชนิด',
        weaknessTh: 'ต้องใช้เวลาสะสมพิษในการปะทะกับศัตรูที่ไร้กายเนื้อ',
        combatBonus: 1.18,
        defenseBonus: 1.04,
        breakthroughMod: 0.98
      },
      NETHER_GHOST_KING: {
        id: 'NETHER_GHOST_KING',
        nameTh: 'สายราชันย์ภูตยมโลก',
        resourceTh: 'หยกวิญญาณเยือกแข็งและปราณหยินโบราณ',
        strengthTh: 'โจมตีดวงจิตและแช่แข็งชีพจรศัตรู พร้อมเกราะกระดูกวิญญาณคุ้มกาย',
        weaknessTh: 'แพ้ทางสายฟ้าศักดิ์สิทธิ์ของวิถีเทวะโดยตรง',
        combatBonus: 1.20,
        defenseBonus: 1.06,
        breakthroughMod: 0.95
      },
      HEAVEN_DEVOURING_DEMON: {
        id: 'HEAVEN_DEVOURING_DEMON',
        nameTh: 'สายจอมมารกลืนสวรรค์',
        resourceTh: 'โลหิตอสูรระดับสูงและแก่นปราณศึก',
        strengthTh: 'สูบพลังชีวิตและปราณของคู่ต่อสู้มาฟื้นฟูตนเอง ยิ่งสู้ยิ่งแข็งแกร่ง',
        weaknessTh: 'เสี่ยงต่อการเกิดจิตมารแทรกซ้อนหากพ่ายแพ้หรือบาดเจ็บหนัก',
        combatBonus: 1.30,
        defenseBonus: 0.96,
        breakthroughMod: 0.92
      }
    }
  },
  HEART_SOUL: {
    id: 'HEART_SOUL',
    nameTh: 'วิถีจิตวิญญาณและเซน (ขัดเกลาทะเลจิตและมรรคาสุญตา)',
    shortTh: 'วิถีจิต·เซน',
    icon: '🪷',
    color: '#a5d8ff',
    maxStage: 9,
    resourceUsed: 'ใบชาวิญญาณ คัมภีร์โบราณ และหยกประคองจิต',
    coreMechanicTh: 'บำเพ็ญทะเลสำนึกและดวงจิตเดิมแท้ ใช้เจตจำนงแห่งเซน อักษรภาพ มายาฝัน และกระบี่จิตไร้รูปสยบศัตรูโดยไม่พึ่งพากำลังภายนอก',
    supremeRiskId: 'SOUL_SHATTER_ILLUSION_LOST',
    supremeRiskTh: 'ทะเลจิตร้าวฉาน / หลงติดอยู่ในห้วงมายาฝันของตนเอง',
    stages: [
      { stage: 1, nameTh: 'ขั้นที่ 1 • เปิดเนตรวิญญาณ', lifespanMax: 100, combatPower: 118, breakthroughBaseChance: 0.80, tribulationLayers: 0, resourceReq: 'ใบชาวิญญาณ' },
      { stage: 2, nameTh: 'ขั้นที่ 2 • กระจกใจไร้ฝุ่น', lifespanMax: 135, combatPower: 255, breakthroughBaseChance: 0.70, tribulationLayers: 0, resourceReq: 'โอสถประคองใจ' },
      { stage: 3, nameTh: 'ขั้นที่ 3 • ก่อรูปทะเลจิต', lifespanMax: 185, combatPower: 530, breakthroughBaseChance: 0.58, tribulationLayers: 1, resourceReq: 'หยกสื่อวิญญาณ' },
      { stage: 4, nameTh: 'ขั้นที่ 4 • ดวงจิตโพธิญาณ', lifespanMax: 265, combatPower: 1080, breakthroughBaseChance: 0.48, tribulationLayers: 1, resourceReq: 'บัวหยกเขียวร้อยปี' },
      { stage: 5, nameTh: 'ขั้นที่ 5 • กายทิพย์จำแลง', lifespanMax: 400, combatPower: 2200, breakthroughBaseChance: 0.39, tribulationLayers: 3, resourceReq: 'บุปผาวิญญาณ' },
      { stage: 6, nameTh: 'ขั้นที่ 6 • ปราชญ์วิญญาณรู้แจ้ง', lifespanMax: 590, combatPower: 4350, breakthroughBaseChance: 0.31, tribulationLayers: 4, resourceReq: 'ม้วนหยกสัจธรรม' },
      { stage: 7, nameTh: 'ขั้นที่ 7 • เขตแดนจิตสุญตา', lifespanMax: 860, combatPower: 8500, breakthroughBaseChance: 0.23, tribulationLayers: 5, resourceReq: 'ผลึกดาราวิญญาณ' },
      { stage: 8, nameTh: 'ขั้นที่ 8 • มหาเมธีเหนือกาล', lifespanMax: 1220, combatPower: 16000, breakthroughBaseChance: 0.16, tribulationLayers: 6, resourceReq: 'น้ำอมฤตกระจกใจ' },
      { stage: 9, nameTh: 'ขั้นที่ 9 • จอมปราชญ์จิตจักรวาล', lifespanMax: 1950, combatPower: 30500, breakthroughBaseChance: 0.12, tribulationLayers: 8, resourceReq: 'แก่นสัจธรรมสุญตา' }
    ],
    subPaths: {
      ZEN_VOID_MIND: {
        id: 'ZEN_VOID_MIND',
        nameTh: 'สายปราชญ์เซนสุญตา',
        resourceTh: 'ใบชาวิญญาณ เสียงระฆังอาราม และคัมภีร์เซนโบราณ',
        strengthTh: 'จิตสงบดั่งกระจกเงา สะท้อนแรงโจมตีของศัตรูและสลายจิตมารอย่างสมบูรณ์',
        weaknessTh: 'ไม่เน้นการไล่สังหารเชิงรุกแต่ชนะด้วยการตั้งรับและสะท้อนกลับ',
        combatBonus: 1.08,
        defenseBonus: 1.26,
        breakthroughMod: 1.06
      },
      CALLIGRAPHY_PAINTING_SAGE: {
        id: 'CALLIGRAPHY_PAINTING_SAGE',
        nameTh: 'สายเมธีพู่กันภาพมายา',
        resourceTh: 'หมึกชาดปราณ พู่กันขนอสูร และม้วนภาพวาดโบราณ',
        strengthTh: 'ตวัดพู่กันจารึกอักษรสวรรค์และกางม้วนภาพวาดขุนเขาแม่น้ำกักขังศัตรู',
        weaknessTh: 'ต้องรักษาระยะห่างและใช้ปราณจิตในการคงสภาพเขตแดนภาพวาด',
        combatBonus: 1.16,
        defenseBonus: 1.12,
        breakthroughMod: 1.04
      },
      DREAM_ILLUSION_WEAVER: {
        id: 'DREAM_ILLUSION_WEAVER',
        nameTh: 'สายจ้าวมายาฝันนิรันดร์',
        resourceTh: 'กล้วยไม้หมอกสารทและกล้วยไม้สนธยา',
        strengthTh: 'ถักทอห้วงฝันซ้อนฝันทำให้ศัตรูเสียจังหวะและโจมตีพลาดเป้าต่อเนื่อง',
        weaknessTh: 'อานุภาพลดลงเมื่อเจอศัตรูที่มีดวงจิตกระบี่หรือเนตรอสนีระดับสูง',
        combatBonus: 1.18,
        defenseBonus: 1.10,
        breakthroughMod: 1.02
      },
      MIND_SWORD_TELEKINESIS: {
        id: 'MIND_SWORD_TELEKINESIS',
        nameTh: 'สายจอมกระบี่จิตไร้รูป',
        resourceTh: 'ศิลาฝึกจิตและรอยกระบี่โบราณบนผาศิลา',
        strengthTh: 'หลอมรวมพลังจิตเป็นคมกระบี่ไร้ลักษณ์ ทะลวงเกราะกายภาพโจมตีทะเลจิตโดยตรง',
        weaknessTh: 'ใช้สมาธิและพลังจิตสูงมากในการควบแน่นกระบี่จิตแต่ละเล่ม',
        combatBonus: 1.27,
        defenseBonus: 0.95,
        breakthroughMod: 0.97
      }
    }
  }
};

const EXTRA_SUBPATHS_V112 = {
  XIAN: {
    CLOUD_WIND_SAGE: {
      id: 'CLOUD_WIND_SAGE',
      nameTh: 'สายเซียนวายุเมฆาพเนจร',
      resourceTh: 'ปราณสายลมยอดเขาและหยกเมฆาคราม',
      strengthTh: 'ท่าร่างรวดเร็วดั่งสายลม หลบหลีกสูงและฟาดคมวายุตัดสะบั้นจากระยะไกล',
      weaknessTh: 'การปะทะหนักหน่วงระยะประชิดด้อยกว่าสายหลอมกายา',
      combatBonus: 1.19,
      defenseBonus: 1.05,
      breakthroughMod: 1.02
    },
    FROST_MOON_IMMORTAL: {
      id: 'FROST_MOON_IMMORTAL',
      nameTh: 'สายเซียนจันทราเหมันต์',
      resourceTh: 'ผลจันทราเหมันต์และไอเย็นแสงจันทร์',
      strengthTh: 'แช่แข็งชีพจรชะลอความเร็วศัตรูและสะท้อนคมอาวุธด้วยกระจกน้ำแข็ง',
      weaknessTh: 'ต้องอาศัยความเยือกเย็นและจังหวะการตั้งรับที่แม่นยำ',
      combatBonus: 1.17,
      defenseBonus: 1.12,
      breakthroughMod: 1.00
    }
  },
  BODY: {
    STAR_METEOR_BODY: {
      id: 'STAR_METEOR_BODY',
      nameTh: 'สายกายาดาราอุกกาบาต',
      resourceTh: 'แร่เหล็กไหลดาราและแรงโน้มถ่วงขุนเขา',
      strengthTh: 'พละกำลังหมัดหนักหน่วงดั่งอุกกาบาตถล่ม พร้อมเกราะแรงโน้มถ่วงกดทับศัตรู',
      weaknessTh: 'เคลื่อนที่ช้ากว่าสายวิชาตัวเบาแต่แลกด้วยพลังทำลายล้างมหาศาล',
      combatBonus: 1.24,
      defenseBonus: 1.16,
      breakthroughMod: 0.95
    },
    WOOD_SPRING_BODY: {
      id: 'WOOD_SPRING_BODY',
      nameTh: 'สายกายาพฤกษาอมตะ',
      resourceTh: 'บัวหยกเขียวร้อยปีและน้ำพุวิญญาณ',
      strengthTh: 'ฟื้นฟูบาดแผลและพลังชีวิตต่อเนื่องในทุกการปะทะ ต้านทานพิษร้าย',
      weaknessTh: 'พลังสังหารฉับพลันไม่สูงเท่าสายโลหิตแต่ยืนหยัดได้นานที่สุด',
      combatBonus: 1.10,
      defenseBonus: 1.24,
      breakthroughMod: 1.04
    }
  },
  GOD: {
    THUNDER_PUNISHER_GOD: {
      id: 'THUNDER_PUNISHER_GOD',
      nameTh: 'สายเทพทัณฑ์อสนีสวรรค์',
      resourceTh: 'หน่อไผ่อัสนี เหล็กอัสนีคราม และศรัทธาพิทักษ์ธรรม',
      strengthTh: 'อัญเชิญสายฟ้าทัณฑ์สวรรค์ฟาดผ่าศัตรูด้วยพลังโจมตีรุนแรงและข่มขวัญมาร',
      weaknessTh: 'ต้องรักษาคุณธรรมและหน้าที่พิทักษ์สำนักเพื่อให้ตราอาญาสิทธิ์ทรงพลัง',
      combatBonus: 1.26,
      defenseBonus: 1.02,
      breakthroughMod: 0.96
    },
    MEDICINE_BODHI_GOD: {
      id: 'MEDICINE_BODHI_GOD',
      nameTh: 'สายเทพโอสถโพธิญาณ',
      resourceTh: 'สมุนไพรทิพย์ โอสถรักษา และแรงศรัทธาชาวบ้าน',
      strengthTh: 'แผ่รัศมีโพธิญาณสมานแผล ขับพิษ สลายจิตมาร และกางฉัตรบัวทองคุ้มภัย',
      weaknessTh: 'มุ่งเน้นการคุ้มครองและเยียวยามากกว่าการสังหารศัตรูด้วยความอำมหิต',
      combatBonus: 1.09,
      defenseBonus: 1.25,
      breakthroughMod: 1.05
    }
  }
};

const TRACK_SPECS_V112 = [
  {
    subpathId: 'CLOUD_WIND_SAGE', majorPathId: 'XIAN',
    nameEn: 'Cloud-Wind Wandering Sage', nameTh: 'มรรคาเซียนวายุเมฆาพเนจร',
    archetypeTh: 'เอกะวายุพเนจรและคมลมไร้ร่องรอย',
    specialtySummaryTh: 'เคลื่อนไหวดั่งสายลมและเมฆา หลบหลีกคมศาสตราและควบแน่นคมวายุตัดสะบั้นจากระยะไกล',
    domainFocus: ['FLIGHT_SPEED', 'EVASION', 'COMBAT_OFFENSE', 'EXPLORATION'],
    craftPath: 'ALCHEMY',
    realmsTh: ['รับสัมผัสสายลม', 'ก้าวเมฆาแรกแย้ม', 'รากฐานวายุคราม', 'ดวงจิตเมฆาพเนจร', 'ครรภ์วายุไร้ลักษณ์', 'วิญญาณพายุเก้าห้วง', 'เขตแดนวายุสะบั้นเมฆ', 'หมื่นสายลมคืนสู่ฟ้า', 'เซียนวายุเมฆานิรันดร์']
  },
  {
    subpathId: 'FROST_MOON_IMMORTAL', majorPathId: 'XIAN',
    nameEn: 'Frost-Moon Immortal', nameTh: 'มรรคาเซียนจันทราเหมันต์',
    archetypeTh: 'เอกะปราณเหมันต์และกระจกน้ำแข็งสะท้อนจันทร์',
    specialtySummaryTh: 'ดูดซับแสงจันทร์และไอเยือกแข็ง แช่แข็งชีพจรศัตรูและสะท้อนการโจมตีด้วยเกราะน้ำค้างแข็ง',
    domainFocus: ['COMBAT_DEFENSE', 'CONTROL', 'ELEMENTAL_MASTERY', 'ALCHEMY'],
    craftPath: 'ALCHEMY',
    realmsTh: ['ซึมซับแสงจันทร์', 'เกล็ดน้ำค้างก่อตัว', 'รากฐานบัวหิมะ', 'ดวงจิตกระจกน้ำแข็ง', 'ครรภ์จันทราคราม', 'วิญญาณเหมันต์ไร้ใจ', 'เขตแดนเหมันต์เงียบงัน', 'วังน้ำแข็งเก้าสวรรค์', 'เซียนจันทราเหมันต์อมตะ']
  },
  {
    subpathId: 'STAR_METEOR_BODY', majorPathId: 'BODY',
    nameEn: 'Star-Meteor Juggernaut Body', nameTh: 'มรรคากายาดาราอุกกาบาต',
    archetypeTh: 'เอกะกายาแรงโน้มถ่วงและหมัดดาวตกถล่มปฐพี',
    specialtySummaryTh: 'ดึงแสงดาราและแรงโน้มถ่วงมาหลอมรวมเข้ากับโครงกระดูก หมัดเดียวหนักหน่วงดั่งอุกกาบาตพุ่งชน',
    domainFocus: ['COMBAT_OFFENSE', 'COMBAT_DEFENSE', 'BODY_TEMPERING', 'FORGING'],
    craftPath: 'FORGING',
    realmsTh: ['ซึมซับละอองดารา', 'ผิวหนังเหล็กอุกกาบาต', 'กระดูกดาราเงิน', 'โลหิตดาวตกหลอมรวม', 'แก่นกายาอุกกาบาตทอง', 'หัวใจดาวฤกษ์นิรันดร์', 'เขตแดนแรงโน้มถ่วงดารา', 'กายาจักรวาลไม่บุบสลาย', 'ราชันย์กายาอุกกาบาตนิรันดร์']
  },
  {
    subpathId: 'WOOD_SPRING_BODY', majorPathId: 'BODY',
    nameEn: 'Immortal Wood-Spring Body', nameTh: 'มรรคากายาพฤกษาอมตะ',
    archetypeTh: 'เอกะกายาพฤกษาฟื้นฟูและชีพจรต้านพิษ',
    specialtySummaryTh: 'หลอมรวมแก่นชีวิตแห่งพฤกษาโบราณเข้าสู่เส้นเลือด ฟื้นฟูบาดแผลและสลายพิษร้ายได้ในทุกลมหายใจ',
    domainFocus: ['VITALITY_REGEN', 'POISON_IMMUNITY', 'COMBAT_DEFENSE', 'ALCHEMY'],
    craftPath: 'ALCHEMY',
    realmsTh: ['เพาะเมล็ดพันธุ์ชีวิต', 'เส้นเลือดเถาวัลย์หยก', 'รากฐานพฤกษาหยั่งราก', 'แก่นพฤกษามรกตพันปี', 'โลหิตน้ำอมฤตพฤกษา', 'วิญญาณต้นไม้โลก', 'เขตแดนร่มเงาหมื่นชีวิต', 'มหากายาต้นโพธิ์นิรันดร์', 'ราชันย์พฤกษาอมตะสูงสุด']
  },
  {
    subpathId: 'THUNDER_PUNISHER_GOD', majorPathId: 'GOD',
    nameEn: 'Heavenly Thunder Punisher Deity', nameTh: 'มรรคาเทพทัณฑ์อสนีสวรรค์',
    archetypeTh: 'เอกะอาญาสิทธิ์สายฟ้าและทัณฑ์สวรรค์พิพากษา',
    specialtySummaryTh: 'ถือครองตราอาญาสิทธิ์แห่งสายฟ้า ฟาดทัณฑ์อสนีสวรรค์พิพากษามารร้ายด้วยพลังทำลายล้างสูงสุด',
    domainFocus: ['COMBAT_OFFENSE', 'ARMOR_PENETRATION', 'TRIBULATION_MASTERY', 'FORGING'],
    craftPath: 'FORGING',
    realmsTh: ['ประกายสายฟ้าศักดิ์สิทธิ์', 'รับตราอาญาสิทธิ์', 'รากฐานศรัทธาอสนีบาต', 'แก่นเทพอสนีทองคำ', 'หอกสายฟ้าพิพากษา', 'กายาเทพสายฟ้าจำแลง', 'เขตแดนทัณฑ์อสนีเก้าสวรรค์', 'กงล้อสายฟ้าสะท้านภพ', 'จอมเทพทัณฑ์อสนีสวรรค์']
  },
  {
    subpathId: 'MEDICINE_BODHI_GOD', majorPathId: 'GOD',
    nameEn: 'Medicine Bodhi Sanctuary Deity', nameTh: 'มรรคาเทพโอสถโพธิญาณ',
    archetypeTh: 'เอกะรัศมีโพธิญาณและโอสถทิพย์คุ้มครองชน',
    specialtySummaryTh: 'บำเพ็ญตบะแห่งความเมตตาและศาสตร์โอสถทิพย์ ชำระล้างพิษ สมานแผล และกางฉัตรแสงบุญคุ้มครองสหาย',
    domainFocus: ['HEALING_SANCTUARY', 'COMBAT_DEFENSE', 'HEART_DEMON_PURGE', 'ALCHEMY'],
    craftPath: 'ALCHEMY',
    realmsTh: ['จุดประทีปเมตตา', 'หัตถ์โอสถอุ่นปราณ', 'รากฐานบัวขาวโพธิญาณ', 'แก่นเทพโอสถทองคำ', 'แจกันหยกน้ำอมฤต', 'กายาโพธิสัตว์จำแลง', 'เขตแดนบุญไร้โรคภัย', 'ชุบชีวิตด้วยแสงทิพย์', 'จอมเทพโอสถโพธิสัตว์สูงสุด']
  },
  {
    subpathId: 'SHADOW_ASSASSIN', majorPathId: 'DEMON',
    nameEn: 'Formless Shadow Assassin', nameTh: 'มรรคานักฆ่าเงาไร้ลักษณ์',
    archetypeTh: 'เอกะเร้นกายเงามืดและคมมีดปลิดวิญญาณ',
    specialtySummaryTh: 'หลอมรวมกายเข้ากับเงามืดและไอสังหาร เร้นกายไร้กลิ่นอายและจู่โจมจุดตายในพริบตาเดียว',
    domainFocus: ['CRIT_EXECUTION', 'EVASION', 'FLIGHT_SPEED', 'FORGING'],
    craftPath: 'FORGING',
    realmsTh: ['ก้าวสู่เงามืด', 'เก็บงำลมหายใจ', 'รากฐานเงาจันทร์เร้นลับ', 'แก่นมารเงาพันร่าง', 'หนึ่งคมปลิดวิญญาณ', 'ทารกมารเงาไร้ลักษณ์', 'เขตแดนรัตติกาลไร้เสียง', 'ข้ามผ่านมิติเงามืด', 'มหาจักรพรรดิเงาไร้ลักษณ์']
  },
  {
    subpathId: 'VENOM_GU_SOVEREIGN', majorPathId: 'DEMON',
    nameEn: 'Myriad-Venom Gu Sovereign', nameTh: 'มรรคาจ้าวพิษกู่หมื่นอสรพิษ',
    archetypeTh: 'เอกะแมลงกู่บรรพกาลและหมอกพิษกัดกร่อนปราณ',
    specialtySummaryTh: 'เพาะเลี้ยงแมลงกู่บรรพกาลและหลอมพิษห้าธาตุ กัดกร่อนเกราะและสูบปราณคู่ต่อสู้มาหล่อเลี้ยงตน',
    domainFocus: ['VENOM_CORROSION', 'QI_SIPHON', 'POISON_IMMUNITY', 'ALCHEMY'],
    craftPath: 'ALCHEMY',
    realmsTh: ['สัมผัสไอพิษ', 'หลอมโถกู่เบื้องต้น', 'รากฐานกู่เงินห้าสี', 'แก่นมารกู่ทองคำ', 'พิษกร่อนกระดูกและชีพจร', 'ทารกมารราชันย์กู่', 'เขตแดนหมอกพิษหมื่นอสรพิษ', 'หลอมรวมฟ้าดินเป็นโถกู่', 'มหาจักรพรรดิพิษกู่สูงสุด']
  },
  {
    subpathId: 'NETHER_GHOST_KING', majorPathId: 'DEMON',
    nameEn: 'Netherworld Ghost Sovereign', nameTh: 'มรรคาราชันย์ภูตยมโลก',
    archetypeTh: 'เอกะปราณหยินยมโลกและคลื่นวิญญาณสะกดขวัญ',
    specialtySummaryTh: 'ชักนำไอหยินเยือกแข็งและเสียงคร่ำครวญจากยมโลก สร้างเกราะกระดูกวิญญาณและโจมตีทำลายขวัญศัตรู',
    domainFocus: ['SOUL_OFFENSE', 'COMBAT_DEFENSE', 'CHILL_CONTROL', 'ALCHEMY'],
    craftPath: 'ALCHEMY',
    realmsTh: ['เปิดเนตรหยินยมโลก', 'สดับเสียงภูตพราย', 'รากฐานตำหนักยมทูต', 'แก่นมารภูตยมโลก', 'เกราะกระดูกขาวอเวจี', 'ทารกมารราชันย์ภูต', 'เขตแดนประตูผีผ่าน', 'แม่น้ำลืมเลือนไหลบ่า', 'มหาจักรพรรดิราชันย์ภูตสูงสุด']
  },
  {
    subpathId: 'HEAVEN_DEVOURING_DEMON', majorPathId: 'DEMON',
    nameEn: 'Heaven-Devouring Demon Overlord', nameTh: 'มรรคาจอมมารกลืนสวรรค์',
    archetypeTh: 'เอกะวังวนสูบปราณโลหิตและเตาหลอมมารคลั่งศึก',
    specialtySummaryTh: 'โคจรวิชาต้องห้ามสร้างวังวนสูบปราณและพลังชีวิตของศัตรูมาเสริมกำลังตนเอง ยิ่งต่อสู้ยิ่งแข็งแกร่ง',
    domainFocus: ['VAMPIRIC_DRAIN', 'COMBAT_OFFENSE', 'FORBIDDEN_MASTERY', 'FORGING'],
    craftPath: 'FORGING',
    realmsTh: ['เปิดจุดชีพจรกลืนปราณ', 'วังวนมารในฝ่ามือ', 'รากฐานเตาหลอมมาร', 'แก่นมารกลืนสวรรค์', 'หลุมดำกลืนกินหมื่นวิชา', 'ทารกมารอสูรบรรพกาล', 'เขตแดนจอมมารกลืนดารา', 'มารบรรพกาลกลืนสามภพ', 'มหาจักรพรรดิจอมมารกลืนสวรรค์']
  },
  {
    subpathId: 'ZEN_VOID_MIND', majorPathId: 'HEART_SOUL',
    nameEn: 'Zen Void Mirror Patriarch', nameTh: 'มรรคาปราชญ์เซนสุญตา',
    archetypeTh: 'เอกะจิตกระจกเงาสะท้อนหมื่นวิชาและสุญตาสยบมาร',
    specialtySummaryTh: 'ฝึกฝนจิตใจให้สงบว่างเปล่าดั่งกระจกเงาแห่งเซน สะท้อนแรงโจมตีของศัตรูและชำระล้างจิตมาร',
    domainFocus: ['DAMAGE_REFLECT', 'COMBAT_DEFENSE', 'HEART_DEMON_PURGE', 'SCHOLARSHIP'],
    craftPath: 'ALCHEMY',
    realmsTh: ['สงบคลื่นอารมณ์', 'กระจกใจไร้ฝุ่น', 'รากฐานดอกบัวเซน', 'แก่นจิตสุญตา', 'สะท้อนหมื่นวิชาคืนต้นทาง', 'กายทิพย์ปราชญ์เซน', 'เขตแดนความว่างเปล่าสมบูรณ์', 'โลกธาตุในหนึ่งขณะจิต', 'จอมเมธีเซนสุญตาสูงสุด']
  },
  {
    subpathId: 'CALLIGRAPHY_PAINTING_SAGE', majorPathId: 'HEART_SOUL',
    nameEn: 'Celestial Brush & Scroll Sage', nameTh: 'มรรคาเมธีพู่กันภาพมายา',
    archetypeTh: 'เอกะอักษรสวรรค์สะกดข่มและค่ายกลภาพวาดขุนเขาแม่น้ำ',
    specialtySummaryTh: 'ควบแน่นพลังจิตลงสู่ปลายพู่กันและม้วนภาพวาด จารึกอักษรศักดิ์สิทธิ์และสร้างโลกภาพวาดกักขังศัตรู',
    domainFocus: ['SPATIAL_CONTROL', 'SCHOLARSHIP', 'COMBAT_DEFENSE', 'ARRAY'],
    craftPath: 'FORGING',
    realmsTh: ['ฝนหมึกวิญญาณ', 'ปลายพู่กันแฝงปราณ', 'รากฐานม้วนภาพขุนเขา', 'แก่นเมธีอักษรสวรรค์', 'กักขังในภาพวาดพันลี้', 'กายทิพย์ปราชญ์พู่กัน', 'เขตแดนหนึ่งตวัดเปลี่ยนฤดูกาล', 'ม้วนภาพซ่อนโลกธาตุ', 'จอมเมธีพู่กันภาพมายาสูงสุด']
  },
  {
    subpathId: 'DREAM_ILLUSION_WEAVER', majorPathId: 'HEART_SOUL',
    nameEn: 'Eternal Dream & Illusion Weaver', nameTh: 'มรรคาจ้าวมายาฝันนิรันดร์',
    archetypeTh: 'เอกะห้วงฝันซ้อนฝันและภาพมายาเจ็ดอารมณ์',
    specialtySummaryTh: 'ถักทอคลื่นพลังจิตสร้างห้วงฝันซ้อนฝันและภาพลวงตาเจ็ดอารมณ์ ทำให้ศัตรูหลงทางและโจมตีพลาดเป้า',
    domainFocus: ['ILLUSION_EVASION', 'SOUL_OFFENSE', 'CONTROL', 'ALCHEMY'],
    craftPath: 'ALCHEMY',
    realmsTh: ['ทอหมอกมายา', 'เงาสะท้อนในกระจกน้ำ', 'รากฐานผีเสื้อความฝัน', 'แก่นจิตมายาเจ็ดอารมณ์', 'ห้วงฝันซ้อนฝันเก้าชั้น', 'กายทิพย์จ้าวแห่งความฝัน', 'เขตแดนหนึ่งฝันยาวนานร้อยปี', 'ความจริงคือความฝันตื่นหนึ่ง', 'จอมเมธีมายาฝันสูงสุด']
  },
  {
    subpathId: 'MIND_SWORD_TELEKINESIS', majorPathId: 'HEART_SOUL',
    nameEn: 'Formless Mind-Sword Telekinesis', nameTh: 'มรรคาจอมกระบี่จิตไร้รูป',
    archetypeTh: 'เอกะกระบี่จิตทะลวงเกราะและกงล้อศาสตราวิญญาณ',
    specialtySummaryTh: 'ควบแน่นเจตจำนงและพลังจิตวิญญาณเป็นคมกระบี่ไร้ลักษณ์ พุ่งทะลวงผ่านเกราะกายภาพเข้าทำลายทะเลจิตโดยตรง',
    domainFocus: ['COMBAT_OFFENSE', 'ARMOR_PENETRATION', 'SOUL_OFFENSE', 'FORGING'],
    craftPath: 'FORGING',
    realmsTh: ['หลอมจิตเป็นคมมีด', 'ประกายกระบี่ในดวงตา', 'รากฐานกระบี่วิญญาณ', 'แก่นจิตกระบี่ไร้รูป', 'ค่ายกลกระบี่จิตพันเล่ม', 'กายทิพย์จอมกระบี่จิต', 'เขตแดนใจอยู่ที่ใดกระบี่อยู่ที่นั่น', 'หนึ่งความคิดหมื่นกระบี่', 'จอมเมธีกระบี่จิตไร้รูปสูงสุด']
  }
];

const TRACK_MAP_V112 = new Map();
const SUBPATH_TRACK_MAP_V112 = new Map();
const REALM_MAP_V112 = new Map();
const TRANSITION_MAP_V112 = new Map();
const DEFAULT_SUBPATH_V112 = {
  XIAN: 'SWORD_IMMORTAL',
  BODY: 'TIGER_SOVEREIGN',
  GOD: 'WAR_DEITY',
  DEMON: 'SHADOW_ASSASSIN',
  HEART_SOUL: 'ZEN_VOID_MIND'
};

function buildTracksV112() {
  if (TRACK_MAP_V112.size > 0) return;
  const templateTrack = E.getCultivationTrackV1200?.('XIAN', 'SWORD_IMMORTAL');
  const templateTransition = templateTrack?.transitions?.[0] || {};
  for (const spec of TRACK_SPECS_V112) {
    const trackId = 'TRACK_' + spec.majorPathId + '_' + spec.subpathId;
    const realms = [];
    const transitions = [];
    const cumIds = [];
    const cumUnlocks = [];
    for (let ord = 1; ord <= 9; ord++) {
      const pad = String(ord).padStart(2, '0');
      const rId = 'R1200_' + spec.subpathId + '_' + pad;
      const nextRId = ord < 9 ? ('R1200_' + spec.subpathId + '_' + String(ord + 1).padStart(2, '0')) : null;
      const trId = ord < 9 ? ('TR1200_' + spec.subpathId + '_' + pad + '_TO_' + String(ord + 1).padStart(2, '0')) : null;
      const rName = spec.realmsTh[ord - 1] || ('ขั้นที่ ' + ord);
      const uId = 'UNLOCK_' + spec.subpathId + '_ORD_' + ord;
      const unlockObj = {
        id: uId,
        ordinal: ord,
        realmId: rId,
        realmNameTh: rName,
        titleTh: 'เคล็ด' + rName,
        domainFocus: spec.domainFocus,
        effectSummaryTh: 'ปลดล็อก «เคล็ด' + rName + '» (' + spec.specialtySummaryTh + ')'
      };
      cumIds.push(uId);
      cumUnlocks.push(unlockObj);
      const realmObj = {
        id: rId,
        realmId: rId,
        trackId: trackId,
        majorPathId: spec.majorPathId,
        subpathId: spec.subpathId,
        ordinal: ord,
        realmCount: 9,
        nameEn: spec.nameEn + ' Stage ' + ord,
        nameTh: rName,
        loreTh: spec.specialtySummaryTh,
        realizationBand: ord,
        bandEnd: ord === 9 ? 9.28 : ord + 1,
        bandSpan: ord === 9 ? 0.28 : 1,
        legacyStageEquivalent: ord,
        lifespanProfileId: 'LIFE_XIAN_BAND_' + ord,
        lifespanMax: [95, 125, 175, 250, 380, 560, 820, 1150, 1850][ord - 1],
        capacityProfileId: 'CAP_' + spec.subpathId + '_' + pad,
        capacityMultipliers: {
          maxQiMult: +(1 + (ord - 1) * 0.4).toFixed(2),
          vitalityMult: +(1 + (ord - 1) * 0.24).toFixed(2),
          faithPoolMult: +(1 + (ord - 1) * 0.16).toFixed(2),
          senseBonus: (ord - 1) * 4,
          authorityBonus: (ord - 1) * 3.5
        },
        realmBuffs: {
          combatOffensePct: +(ord * 3.1).toFixed(2),
          combatDefensePct: +(ord * 2.2).toFixed(2),
          armorPenetrationPct: +(ord * 2.5).toFixed(2),
          counterStrikePct: +(ord * 2.0).toFixed(2),
          lifestealPct: spec.majorPathId === 'DEMON' ? +(ord * 1.5).toFixed(2) : 0,
          evasionPct: +(ord * 1.6).toFixed(2),
          reflectPct: spec.majorPathId === 'HEART_SOUL' ? +(ord * 1.8).toFixed(2) : 0,
          qiRegenBonusPct: +(ord * 2.0).toFixed(2),
          craftMasteryBonus: ord * 2,
          gatherYieldBonusPct: ord,
          healingPotencyPct: +(ord * 1.8).toFixed(2)
        },
        npcCoreMods: [
          { stat: 'aptitudes.combat', op: 'ADD', value: +(ord * 1.6).toFixed(2), labelTh: 'ตบะหนุนนำการรบ (' + rName + ')' },
          { stat: 'combat.powerMult', op: 'MULT', value: +(1 + ord * 0.022).toFixed(3), labelTh: 'อานุภาพแห่งมรรคา (' + rName + ')' }
        ],
        milestoneUnlock: unlockObj,
        phaseDescriptionsTh: {
          EARLY: 'แรกตั้งรากแห่ง' + rName + ': ปรับสมดุลโครงสร้างปราณและจิตสำนึกหลังข้ามขอบเขต',
          MIDDLE: 'เคี่ยวกรำกลางขั้นแห่ง' + rName + ': ฝึกฝนเคล็ดวิชาประจำสายและสะสมประสบการณ์จริง',
          LATE: 'หยั่งลึกปลายขั้นแห่ง' + rName + ': ขัดเกลาความเข้าใจมรรคาจนถึงแก่นแท้',
          PEAK: 'สมบูรณ์พร้อมขีดสุดแห่ง' + rName + ': ตบะเปี่ยมล้น พร้อมประเมินเงื่อนไขทะลวงขั้นถัดไป'
        },
        internalMilestoneTh: 'บรรลุจุดเปลี่ยนภายใน: ' + rName,
        unlockIds: [...cumIds],
        transitionId: trId,
        cumulativeUnlockIds: [...cumIds],
        cumulativeUnlocks: [...cumUnlocks]
      };
      realms.push(realmObj);
      REALM_MAP_V112.set(rId, realmObj);

      if (ord < 9) {
        const nextName = spec.realmsTh[ord] || ('ขั้นที่ ' + (ord + 1));
        const transObj = {
          ...JSON.parse(JSON.stringify(templateTransition)),
          id: trId,
          transitionId: trId,
          trackId: trackId,
          majorPathId: spec.majorPathId,
          subpathId: spec.subpathId,
          fromRealmId: rId,
          toRealmId: nextRId,
          fromOrdinal: ord,
          toOrdinal: ord + 1,
          fromNameTh: rName,
          toNameTh: nextName,
          targetBand: ord + 1,
          bandSpan: 1,
          transformationNameTh: 'การยกระดับมรรคา: ' + rName + ' ➔ ' + nextName,
          transformationDescTh: 'ทะลวงจาก «' + rName + '» สู่ «' + nextName + '» (' + spec.specialtySummaryTh + ')',
          breakthroughBaseChance: Math.max(0.14, +(0.82 - ord * 0.08).toFixed(3)),
          costStones: 45 + ord * 14
        };
        transitions.push(transObj);
        TRANSITION_MAP_V112.set(trId, transObj);
      }
    }

    const trackObj = {
      id: trackId,
      trackId: trackId,
      majorPathId: spec.majorPathId,
      subpathId: spec.subpathId,
      archetypeTh: spec.archetypeTh,
      specialtySummaryTh: spec.specialtySummaryTh,
      domainFocus: spec.domainFocus,
      isCanonical24: false,
      isNewV1200: true,
      isNewV112: true,
      nameEn: spec.nameEn,
      nameTh: spec.nameTh,
      realmCount: 9,
      craftPath: spec.craftPath,
      evidenceKind: 'PRACTICE_AND_DAO_COMPREHENSION',
      evidenceDescTh: 'ฝึกฝนเคล็ดวิชา ออกสำรวจจุดวาสนา เพ่งศิลาจารึก หรือเคี่ยวกรำในการศึกจริง',
      environmentType: 'SECT_TRAINING_OR_NATURAL_VEIN',
      environmentNameTh: 'หอฝึกปราณ หอสืบทอด หรือจุดชีพจรปราณธรรมชาติในหุบเขา',
      alternateRouteNameTh: 'เข้าฌานขัดเกลาตบะและศึกษารอยจารึกโบราณด้วยตนเอง',
      riskFactorTh: 'หากจิตมารแทรกซ้อนหรือบาดเจ็บหนักระหว่างทะลวงด่าน อาจทำให้ปราณย้อนกลับ',
      mediumRecipeId: 'REC1100_SUPPORT_QI',
      realms: realms,
      transitions: transitions
    };

    TRACK_MAP_V112.set(trackId, trackObj);
    SUBPATH_TRACK_MAP_V112.set(spec.subpathId, trackObj);
  }
}

buildTracksV112();

function installCultivationExpansionV112() {
  if (!E.CULTIVATION_PATHS) return;
  E.CULTIVATION_PATHS.DEMON = NEW_MAJOR_PATHS_V112.DEMON;
  E.CULTIVATION_PATHS.HEART_SOUL = NEW_MAJOR_PATHS_V112.HEART_SOUL;
  for (const [majorId, group] of Object.entries(EXTRA_SUBPATHS_V112)) {
    if (E.CULTIVATION_PATHS[majorId]?.subPaths) {
      Object.assign(E.CULTIVATION_PATHS[majorId].subPaths, group);
    }
  }
  const D1200 = E.PATCH1200_DATA;
  if (D1200) {
    if (D1200.MAJOR_PATH_DOCTRINES_V1200) {
      D1200.MAJOR_PATH_DOCTRINES_V1200.DEMON = {
        id: 'DEMON',
        nameTh: NEW_MAJOR_PATHS_V112.DEMON.nameTh,
        nameEn: 'Demonic Qi & Unorthodox Sovereign',
        coreIdentityTh: NEW_MAJOR_PATHS_V112.DEMON.coreMechanicTh,
        primaryResourceTh: NEW_MAJOR_PATHS_V112.DEMON.resourceUsed
      };
      D1200.MAJOR_PATH_DOCTRINES_V1200.HEART_SOUL = {
        id: 'HEART_SOUL',
        nameTh: NEW_MAJOR_PATHS_V112.HEART_SOUL.nameTh,
        nameEn: 'Mind, Soul & Zen Enlightenment',
        coreIdentityTh: NEW_MAJOR_PATHS_V112.HEART_SOUL.coreMechanicTh,
        primaryResourceTh: NEW_MAJOR_PATHS_V112.HEART_SOUL.resourceUsed
      };
    }
    for (const [tId, tr] of TRACK_MAP_V112.entries()) {
      if (D1200.TRACKS_BY_ID) D1200.TRACKS_BY_ID[tId] = tr;
      if (D1200.TRACKS_BY_SUBPATH) D1200.TRACKS_BY_SUBPATH[tr.subpathId] = tr;
      if (D1200.SUBPATH_SPECIALIZATIONS_V1200) {
        D1200.SUBPATH_SPECIALIZATIONS_V1200[tr.subpathId] = {
          archetypeTh: tr.archetypeTh,
          specialtySummaryTh: tr.specialtySummaryTh,
          domainFocus: tr.domainFocus
        };
      }
    }
    for (const [rId, rm] of REALM_MAP_V112.entries()) {
      if (D1200.REALMS_BY_ID) D1200.REALMS_BY_ID[rId] = rm;
    }
    for (const [trId, trObj] of TRANSITION_MAP_V112.entries()) {
      if (D1200.TRANSITIONS_BY_ID) D1200.TRANSITIONS_BY_ID[trId] = trObj;
    }
  }
}

installCultivationExpansionV112();

// Wrap V1200 resolvers so the 14 new subpaths and 2 new major paths resolve natively
const origGetTrack1200 = E.getCultivationTrackV1200;
E.getCultivationTrackV1200 = function(majorOrSubpath, maybeSubpath = null) {
  if (maybeSubpath && SUBPATH_TRACK_MAP_V112.has(maybeSubpath)) return SUBPATH_TRACK_MAP_V112.get(maybeSubpath);
  if (typeof majorOrSubpath === 'string') {
    if (TRACK_MAP_V112.has(majorOrSubpath)) return TRACK_MAP_V112.get(majorOrSubpath);
    if (SUBPATH_TRACK_MAP_V112.has(majorOrSubpath)) return SUBPATH_TRACK_MAP_V112.get(majorOrSubpath);
    const defSub = DEFAULT_SUBPATH_V112[majorOrSubpath];
    if (defSub && SUBPATH_TRACK_MAP_V112.has(defSub)) return SUBPATH_TRACK_MAP_V112.get(defSub);
  }
  return origGetTrack1200 ? origGetTrack1200.call(E, majorOrSubpath, maybeSubpath) : null;
};

const origGetRealm1200 = E.getRealmDefinitionV1200;
E.getRealmDefinitionV1200 = function(realmId) {
  if (REALM_MAP_V112.has(realmId)) return REALM_MAP_V112.get(realmId);
  return origGetRealm1200 ? origGetRealm1200.call(E, realmId) : null;
};

const origGetTransition1200 = E.getTransitionDefinitionV1200;
E.getTransitionDefinitionV1200 = function(transitionId) {
  if (TRANSITION_MAP_V112.has(transitionId)) return TRANSITION_MAP_V112.get(transitionId);
  return origGetTransition1200 ? origGetTransition1200.call(E, transitionId) : null;
};

function isV112CustomNpc(n) {
  const j = n?.jianghu;
  if (!j) return false;
  return j.path === 'DEMON' || j.path === 'HEART_SOUL' || SUBPATH_TRACK_MAP_V112.has(j.subPath);
}

const origResolveIdentity1200 = E.resolveNpcCultivationIdentityReadOnlyV1200;
E.resolveNpcCultivationIdentityReadOnlyV1200 = function(w, npcOrId) {
  const n = typeof npcOrId === 'string' ? w?.npcs?.[npcOrId] : npcOrId;
  if (isV112CustomNpc(n)) {
    const j = n.jianghu;
    const majorPathId = E.CULTIVATION_PATHS?.[j.path] ? j.path : 'XIAN';
    const subId = SUBPATH_TRACK_MAP_V112.has(j.subPath) ? j.subPath : (DEFAULT_SUBPATH_V112[majorPathId] || 'SHADOW_ASSASSIN');
    const track = SUBPATH_TRACK_MAP_V112.get(subId) || E.getCultivationTrackV1200(majorPathId, subId);
    const ord = Math.max(1, Math.min(track.realmCount, Math.round(Number(j.trackOrdinal || j.stage || 1))));
    const realmDef = track.realms[ord - 1] || track.realms[0];
    const prog = Math.max(0, Math.min(100, Number(j.cultivationProgress || 0)));
    const subRealmId = E.normalizeSubRealmIdV1200 ? E.normalizeSubRealmIdV1200(j.subRealmId, prog) : (prog >= 85 ? 'PEAK' : prog >= 55 ? 'LATE' : prog >= 25 ? 'MIDDLE' : 'EARLY');
    const isTerminal = realmDef.transitionId === null;
    const span = isTerminal ? 0.28 : Math.max(0.08, realmDef.bandEnd - realmDef.realizationBand - 0.04);
    const realizationBand = +(realmDef.realizationBand + span * (prog / 100)).toFixed(4);
    const foundationQuality = E.computeFoundationQualityObjectV1200 ? E.computeFoundationQualityObjectV1200(n, j.cultivationIdentityV1200?.foundationQuality) : { compositeScore: 65 };
    return {
      majorPathId: track.majorPathId,
      subpathId: track.subpathId,
      trackId: track.id,
      realmId: realmDef.id,
      realmNameEn: realmDef.nameEn,
      realmNameTh: realmDef.nameTh,
      trackOrdinal: realmDef.ordinal,
      realmIndex: realmDef.ordinal,
      trackRealmCount: track.realmCount,
      subRealmId,
      subRealmNameTh: realmDef.phaseDescriptionsTh?.[subRealmId] || subRealmId,
      progress: prog,
      realizationBand,
      bandFloor: realmDef.realizationBand,
      bandEnd: realmDef.bandEnd,
      legacyStageEquivalent: realmDef.legacyStageEquivalent,
      lifespanMax: realmDef.lifespanMax,
      capacityMultipliers: realmDef.capacityMultipliers,
      realmBuffs: realmDef.realmBuffs || {},
      npcCoreMods: realmDef.npcCoreMods || [],
      milestoneUnlock: realmDef.milestoneUnlock || null,
      cumulativeUnlocks: realmDef.cumulativeUnlocks || [],
      unlockIds: realmDef.unlockIds || [],
      transitionId: realmDef.transitionId,
      foundationQuality,
      stabilizationState: { active: false, fromRealmId: null, toRealmId: null, startedTick: null, untilTick: null, remainingDays: 0, capacityPenaltyMult: 1 },
      legacyQualificationMarker: 'V1200_ACTIVE'
    };
  }
  return origResolveIdentity1200 ? origResolveIdentity1200.call(E, w, npcOrId) : null;
};

const origSyncIdentity1200 = E.syncNpcCultivationIdentityV1200;
E.syncNpcCultivationIdentityV1200 = function(w, npcOrId, opts = {}) {
  const n = typeof npcOrId === 'string' ? w?.npcs?.[npcOrId] : npcOrId;
  if (isV112CustomNpc(n)) {
    const j = n.jianghu;
    if (!E.CULTIVATION_PATHS?.[j.path]) installCultivationExpansionV112();
    const majorPathId = E.CULTIVATION_PATHS?.[j.path] ? j.path : 'XIAN';
    j.path = majorPathId;
    if (!SUBPATH_TRACK_MAP_V112.has(j.subPath) && !E.CULTIVATION_PATHS[majorPathId]?.subPaths?.[j.subPath]) {
      j.subPath = DEFAULT_SUBPATH_V112[majorPathId] || 'SHADOW_ASSASSIN';
    }
    const track = E.getCultivationTrackV1200(majorPathId, j.subPath);
    const ord = Math.max(1, Math.min(track.realmCount, Math.round(Number(opts.trackOrdinal ?? j.trackOrdinal ?? j.stage ?? 1))));
    const realmDef = track.realms[ord - 1] || track.realms[0];
    const prog = Math.max(0, Math.min(100, Number(opts.progress !== undefined ? opts.progress : (j.cultivationProgress || 0))));
    j.cultivationProgress = prog;
    j.trackOrdinal = realmDef.ordinal;
    j.realmIndex = realmDef.ordinal;
    j.stage = realmDef.ordinal;
    j.maxStage = track.realmCount;
    j.trackRealmCount = track.realmCount;
    j.trackId = track.id;
    j.realmId = realmDef.id;
    j.realmNameTh = realmDef.nameTh;
    j.realmNameEn = realmDef.nameEn;
    j.stageNameTh = realmDef.nameTh;
    const pathDef = E.CULTIVATION_PATHS[majorPathId];
    j.pathNameTh = pathDef?.nameTh || j.pathNameTh;
    j.subPathNameTh = pathDef?.subPaths?.[j.subPath]?.nameTh || track.nameTh;
    const isTerminal = realmDef.transitionId === null;
    const span = isTerminal ? 0.28 : Math.max(0.08, realmDef.bandEnd - realmDef.realizationBand - 0.04);
    j.realizationBand = +(realmDef.realizationBand + span * (prog / 100)).toFixed(4);
    j.legacyStageEquivalent = realmDef.legacyStageEquivalent;
    j.isImmortal = isTerminal;
    if (realmDef.capacityMultipliers?.maxQiMult) {
      j.maxQiV190 = Math.max(Number(j.maxQiV190 || 100), Math.round(100 * realmDef.capacityMultipliers.maxQiMult));
    }
    if (realmDef.lifespanMax) {
      j.lifespanMax = Math.max(Number(j.lifespanMax || 95), realmDef.lifespanMax);
    }
    const resolved = E.resolveNpcCultivationIdentityReadOnlyV1200(w, n);
    j.cultivationIdentityV1200 = { ...resolved, _syncedStage: j.stage };
    if (!j.evidenceLedgerV1200 || typeof j.evidenceLedgerV1200 !== 'object') {
      j.evidenceLedgerV1200 = { countsByActionKind: {}, totalEvidenceScore: 45, distinctActivities: ['INITIAL_TRADITION'], recentEntries: [] };
    }
    return j.cultivationIdentityV1200;
  }
  return origSyncIdentity1200 ? origSyncIdentity1200.call(E, w, npcOrId, opts) : null;
};

const origEvalBreakthrough1200 = E.evaluateCausalBreakthroughV1200;
E.evaluateCausalBreakthroughV1200 = function(w, who, opts = {}) {
  const n = typeof who === 'string' ? w?.npcs?.[who] : who;
  if (isV112CustomNpc(n)) {
    const id = E.resolveNpcCultivationIdentityReadOnlyV1200(w, n);
    const track = E.getCultivationTrackV1200(id.majorPathId, id.subpathId);
    const curRealm = REALM_MAP_V112.get(id.realmId) || track.realms[0];
    if (!curRealm.transitionId) {
      return { ok: false, code: 'MAX_REALM', reason: 'บรรลุขอบเขตสูงสุดของสายมรรคานี้แล้ว', hardGates: [] };
    }
    const tr = TRANSITION_MAP_V112.get(curRealm.transitionId);
    const progPassed = (n.jianghu.cultivationProgress || 0) >= 95;
    const hpPassed = (n.health || 0) >= 60;
    const evScore = Number(n.jianghu.evidenceLedgerV1200?.totalEvidenceScore || 45);
    const evidenceNeeded=25*Math.max(1,n.jianghu.trackOrdinal||1);
    const evPassed = evScore >= evidenceNeeded;
    const hardGates = [
      { id: 'GATE_PROGRESS', nameTh: 'ตบะและความก้าวหน้าถึงขีดสุด (95%+)', passed: progPassed, reasonTh: progPassed ? 'ปราณเปี่ยมล้นพร้อมทะลวง' : 'ต้องฝึกฝนสะสมความก้าวหน้าให้ถึง 95%' },
      { id: 'GATE_HEALTH', nameTh: 'สภาพกายและจิตใจสมบูรณ์ (HP ≥ 60)', passed: hpPassed, reasonTh: hpPassed ? 'ร่างกายพร้อมรับแรงปะทะปราณ' : 'ต้องพักฟื้นหรือใช้โอสถรักษาบาดแผลก่อน' },
      { id: 'GATE_EVIDENCE', nameTh: 'หลักฐานความเข้าใจมรรคา (' + Math.round(evScore) + '/'+evidenceNeeded+')', passed: evPassed, reasonTh: evPassed ? 'เข้าใจแก่นแท้มรรคาเพียงพอแล้ว' : 'ต้องฝึกวิชา สำรวจวาสนา หรือเพ่งศิลาจารึกเพิ่ม' }
    ];
    const allPassed = progPassed && hpPassed && evPassed;
    return {
      ok: allPassed,
      canStartProject: allPassed,
      code: allPassed ? 'READY' : 'GATES_NOT_MET',
      reason: allPassed ? 'พร้อมเข้าด่านทะลวงสู่ ' + tr.toNameTh : hardGates.filter(g => !g.passed).map(g => g.reasonTh).join(' · '),
      transition: tr,
      hardGates
    };
  }
  return origEvalBreakthrough1200 ? origEvalBreakthrough1200.call(E, w, who, opts) : { ok: false, hardGates: [] };
};

const origStartOrAdvance1200 = E.startOrAdvanceBreakthroughProjectV1200;
E.startOrAdvanceBreakthroughProjectV1200 = function(w, npcOrId, opts = {}) {
  const n = typeof npcOrId === 'string' ? w?.npcs?.[npcOrId] : npcOrId;
  if (isV112CustomNpc(n)) {
    const ev = E.evaluateCausalBreakthroughV1200(w, n, opts);
    if (!ev.ok) return { ok: false, code: ev.code, reason: ev.reason };
    const j=n.jianghu,existing=j.breakthroughProjectV1200;
    if(existing&&!['COMPLETE','FAILED','ABORTED'].includes(existing.phase))return {ok:true,code:'PROJECT_ACTIVE',project:existing};
    const H=root.HumanCore,cap=H?H.capacity(n,'train').total:50;
    const project=j.breakthroughProjectV1200={id:'heritage-bt-'+n.id+'-'+w.tick,source:'HERITAGE_V115',phase:'CHANNELING',fromOrdinal:j.trackOrdinal||1,startedTick:w.tick,phaseFinishTick:w.tick+3+(j.trackOrdinal||1)*2,successChance:Math.max(.25,Math.min(.90,.42+cap*.005-(j.trackOrdinal||1)*.025-(n.core?.condition?.fatigue||0)*.002))};
    return {ok:true,code:'PROJECT_STARTED',project,reason:'เริ่มปิดด่านทะลวงวิถีมรดก ต้องรอเวลาและอาจล้มเหลว'};
  }
  return origStartOrAdvance1200 ? origStartOrAdvance1200.call(E, w, npcOrId, opts) : { ok: false };
};

const origStepBt1200 = E.stepBreakthroughProjectV1200;
E.stepBreakthroughProjectV1200 = function(w, npcOrId, opts = {}) {
  const n = typeof npcOrId === 'string' ? w?.npcs?.[npcOrId] : npcOrId;
  if (isV112CustomNpc(n)) {
    const proj = n?.jianghu?.breakthroughProjectV1200;
    if(proj&&proj.source==='HERITAGE_V115'&&!['COMPLETE','FAILED','ABORTED'].includes(proj.phase)){
      if(w.tick<proj.phaseFinishTick)return {ok:true,completed:false};
      const rng=opts.rng,roll=rng?.next?rng.next():((Math.imul((w.seed||1)+w.tick+proj.fromOrdinal,1664525)>>>0)%10000)/10000;
      proj.roll=roll;proj.completedTick=w.tick;
      if(roll<proj.successChance&&n.health>=55){E.syncNpcCultivationIdentityV1200(w,n,{trackOrdinal:proj.fromOrdinal+1,progress:0});proj.phase='COMPLETE';}
      else{proj.phase='FAILED';n.jianghu.cultivationProgress=65;n.jianghu.internalInjury=Math.min(100,(n.jianghu.internalInjury||0)+12);E.syncNpcCultivationIdentityV1200(w,n,{progress:65});}
      E.invalidateNpcCoreCache?.(n);return {ok:true,completed:true,success:proj.phase==='COMPLETE'};
    }
    return { ok: true, completed: false };
  }
  return origStepBt1200 ? origStepBt1200.call(E, w, npcOrId, opts) : { ok: false };
};

// ============================================================================
// PART C: 7 RARITY GRADES, 6 FORTUITOUS MANUAL POOLS & 66 V1.12 MANUALS
// ============================================================================
const MANUAL_RARITY_GRADES_V112 = {
  1: { tier: 1, code: 'MORTAL', nameTh: 'คัมภีร์ขั้นสามัญ (凡品)', badgeTh: 'สามัญ', color: '#adb5bd', baseWeight: 100 },
  2: { tier: 2, code: 'REFINED', nameTh: 'คัมภีร์ขั้นปราณีต (精品)', badgeTh: 'ปราณีต', color: '#69db7c', baseWeight: 58 },
  3: { tier: 3, code: 'MYSTIC', nameTh: 'คัมภีร์ขั้นลี้ลับ (玄品)', badgeTh: 'ลี้ลับ', color: '#4dabf7', baseWeight: 28 },
  4: { tier: 4, code: 'EARTH', nameTh: 'คัมภีร์ขั้นปฐพี (地品)', badgeTh: 'ปฐพี', color: '#b197fc', baseWeight: 11 },
  5: { tier: 5, code: 'HEAVEN', nameTh: 'คัมภีร์ขั้นสวรรค์ (天品)', badgeTh: 'สวรรค์', color: '#ffd43b', baseWeight: 4.0 },
  6: { tier: 6, code: 'IMMORTAL', nameTh: 'คัมภีร์ขั้นเซียนบรรพกาล (仙品)', badgeTh: 'เซียนบรรพกาล', color: '#ff922b', baseWeight: 1.2 },
  7: { tier: 7, code: 'MYTHIC', nameTh: 'คัมภีร์ขั้นเทวตำนาน (神品)', badgeTh: 'เทวตำนาน', color: '#ff6b6b', baseWeight: 0.35 }
};

const FORTUNE_MANUAL_POOLS_V112 = [
  {
    poolId: 'POOL_WANDERER_RELIC',
    nameTh: 'กองมรดกจอมยุทธ์พเนจรและถ้ำร้างชายแดน',
    descTh: 'คัมภีร์ที่หลงเหลือจากจอมยุทธ์ผู้ล่วงลับในถ้ำร้างและซากปรักหักพังรอบหุบเขา',
    matchTags: ['ถ้ำ', 'คุนหลุน', 'พเนจร', 'สมุนไพร', 'โอสถ', 'default'],
    tierMultiplier: { 1: 1.4, 2: 1.25, 3: 0.85, 4: 0.35, 5: 0.10, 6: 0.02, 7: 0.005 },
    favoredPaths: ['XIAN', 'BODY']
  },
  {
    poolId: 'POOL_SWORD_CLIFF_STELA',
    nameTh: 'ผารอยกระบี่โบราณและสุสานหมื่นศาสตรา',
    descTh: 'จารึกวิชาเซียนและเพลงกระบี่ที่สลักไว้บนหน้าผาสูงชันและสุสานกระบี่โบราณ',
    matchTags: ['กระบี่', 'ศิลา', 'จารึก', 'ดารา', 'หอคอย', 'sword', 'tablet'],
    tierMultiplier: { 1: 0.75, 2: 1.15, 3: 1.35, 4: 1.25, 5: 0.75, 6: 0.28, 7: 0.09 },
    favoredPaths: ['XIAN', 'HEART_SOUL']
  },
  {
    poolId: 'POOL_ANCIENT_BLOOD_FORGE',
    nameTh: 'หลุมอุกกาบาตเหล็กไหลและสมรภูมิโลหิตโบราณ',
    descTh: 'คัมภีร์หลอมกายาและศาสตรายุทธ์ดุดันที่ซ่อนอยู่ในแหล่งแร่อุกกาบาตและสมรภูมิโบราณ',
    matchTags: ['อุกกาบาต', 'สมรภูมิ', 'โลหิต', 'เหล็กไหล', 'อสูร', 'meteor', 'battle'],
    tierMultiplier: { 1: 0.8, 2: 1.15, 3: 1.3, 4: 1.2, 5: 0.7, 6: 0.25, 7: 0.08 },
    favoredPaths: ['BODY', 'DEMON']
  },
  {
    poolId: 'POOL_NETHER_ABYSS_ALTAR',
    nameTh: 'หุบเหวมารโลหิตและบึงอสรพิษเร้นลับ',
    descTh: 'คัมภีร์วิชาต้องห้าม พิษกู่ เงามืด และวิชามารโบราณที่ถูกผนึกไว้ใต้หุบเหวและบึงพิษ',
    matchTags: ['มาร', 'อสรพิษ', 'พิษ', 'เงา', 'อเวจี', 'ยมโลก', 'abyss', 'serpent', 'demon'],
    tierMultiplier: { 1: 0.65, 2: 1.05, 3: 1.35, 4: 1.3, 5: 0.85, 6: 0.35, 7: 0.12 },
    favoredPaths: ['DEMON', 'BODY']
  },
  {
    poolId: 'POOL_ZEN_HEART_PAVILION',
    nameTh: 'ศาลาเซนกระจกใจและหอคัมภีร์หยกโบราณ',
    descTh: 'ม้วนคัมภีร์อักษรภาพ วิชาเซนสุญตา มายาฝัน และกระบี่จิตที่เก็บรักษาไว้ในศาลาโบราณกลางม่านหมอก',
    matchTags: ['เซน', 'กระจก', 'พู่กัน', 'ภาพ', 'มายา', 'ฝัน', 'จิต', 'หยก', 'zen', 'dream'],
    tierMultiplier: { 1: 0.7, 2: 1.1, 3: 1.35, 4: 1.25, 5: 0.8, 6: 0.32, 7: 0.11 },
    favoredPaths: ['HEART_SOUL', 'XIAN']
  },
  {
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC',
    nameTh: 'ซากวิหารอัสนีบรรพกาลและแท่นบูชาทัณฑ์สวรรค์',
    descTh: 'เทวคัมภีร์ที่ประทานลงมาจากรอยแยกสวรรค์และวิหารอัสนีบรรพกาล ดรอปยากยิ่งแต่ทรงอานุภาพสูงสุด',
    matchTags: ['อัสนี', 'อสนี', 'วิหาร', 'เทวะ', 'สวรรค์', 'โพธิ', 'thunder', 'shrine', 'god'],
    tierMultiplier: { 1: 0.5, 2: 0.9, 3: 1.25, 4: 1.35, 5: 1.0, 6: 0.45, 7: 0.16 },
    favoredPaths: ['GOD', 'XIAN', 'HEART_SOUL']
  }
];

function makeV112Manual(spec) {
  const tier = spec.tier || 1;
  const grade = MANUAL_RARITY_GRADES_V112[tier] || MANUAL_RARITY_GRADES_V112[1];
  const slotMap = {
    mantra: { category: 'QI_MANTRA', slotType: 'MANTRA', roleGroup: spec.roleGroup || 'COMBAT_DEFENSE' },
    technique: { category: 'COMBAT_TECHNIQUE', slotType: 'TECHNIQUE', roleGroup: spec.roleGroup || 'COMBAT_OFFENSE' },
    lightness: { category: 'LIGHTNESS_ART', slotType: 'LIGHTNESS', roleGroup: 'MOVEMENT_EVASION' },
    auxiliary: { category: 'AUXILIARY_ART', slotType: 'AUXILIARY', roleGroup: spec.roleGroup || 'SUPPORT_DEFENSE' },
    forbidden: { category: 'FORBIDDEN_ART', slotType: 'FORBIDDEN', roleGroup: 'FORBIDDEN_HIGH_STAKES' }
  };
  const sm = slotMap[spec.slot || 'technique'] || slotMap.technique;
  const power = spec.power || Math.round(32 + tier * 24 + (spec.slot === 'forbidden' ? 28 : spec.slot === 'technique' ? 14 : 6));
  const qiCost = spec.qiCost || Math.round(8 + tier * 4 + (spec.slot === 'forbidden' ? 8 : 0));
  const vitalityCost = spec.slot === 'forbidden' ? (10 + tier * 4) : 0;
  const secondaryPaths = spec.allowedSecondaryPaths || ['XIAN', 'BODY', 'GOD', 'DEMON', 'HEART_SOUL'];
  const efxList = [spec.effectId || 'EFX_SWORD_STORM_STRIKE'];
  if (spec.secondaryEffectId) efxList.push(spec.secondaryEffectId);

  return {
    id: spec.id,
    v112: true,
    nameTh: spec.nameTh,
    category: sm.category,
    roleGroup: sm.roleGroup,
    slotType: sm.slotType,
    path: spec.pathId,
    subPath: spec.subpathId,
    crossPathCompatibility: {
      allowedSecondaryPaths: secondaryPaths,
      crossPathQiCostMultiplier: 1.25,
      crossPathEffectivenessMultiplier: 0.86
    },
    tier: tier,
    requiredNormalizedTier: Math.max(1, Math.min(4, Math.ceil(tier * 0.55))),
    rarityGrade: grade.code,
    rarityNameTh: grade.nameTh,
    rarityBadgeTh: grade.badgeTh,
    rarityColor: grade.color,
    dropWeight: grade.baseWeight,
    poolId: spec.poolId || 'POOL_WANDERER_RELIC',
    originTag: spec.originTag || 'มรดกโบราณจากจุดวาสนาในยุทธภพ',
    element: spec.element || 'NEUTRAL',
    power: power,
    moves: spec.moves || [spec.moveNameTh || ('กระบวนท่า' + spec.nameTh), 'เคล็ดสังหาร' + spec.nameTh],
    costs: {
      qiCost: qiCost,
      vitalityCost: vitalityCost,
      lifespanCostYears: spec.slot === 'forbidden' && tier >= 6 ? 1 : 0,
      faithDrain: 0
    },
    cooldownTurns: spec.slot === 'forbidden' ? 3 : spec.slot === 'auxiliary' ? 2 : 1,
    castTimeTurns: 1,
    rangeBand: 'MID',
    targetPolicy: 'HOSTILE_TARGET',
    effectBindings: efxList.map((efx, idx) => ({
      bindingId: 'TBIND_' + spec.id + '_' + (idx + 1),
      effectId: efx,
      trigger: idx === 0 ? 'CAST' : 'ON_HIT',
      parameters: { powerScale: +(0.95 + tier * 0.18).toFixed(2), tier: tier, element: spec.element || 'NEUTRAL' },
      rangeBand: 'MID',
      targetPolicy: 'HOSTILE_TARGET'
    })),
    loreTh: spec.loreTh + ' (ที่มา: ' + (spec.originTag || 'จุดวาสนาโบราณ') + ' · ระดับ' + grade.badgeTh + ')'
  };
}

const MANUALS_V112 = [
  // --- XIAN (16 Manuals across CLOUD_WIND_SAGE, FROST_MOON_IMMORTAL & classic XIAN subpaths) ---
  makeV112Manual({
    id: 'ART_V112_XIAN_WIND_MANTRA_T1', nameTh: 'เคล็ดลมหายใจสายลมคราม',
    slot: 'mantra', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 1, pathId: 'XIAN', subpathId: 'CLOUD_WIND_SAGE',
    poolId: 'POOL_WANDERER_RELIC', element: 'WIND', effectId: 'EFX_MASS_VITAL_HEAL',
    originTag: 'บันทึกไม้ไผ่ของนักพรตพเนจรบนสันเขาหมอก',
    loreTh: 'คัมภีร์พื้นฐานที่สอนการปรับลมหายใจให้ประสานกับกระแสลมบนยอดเขา ช่วยให้ปราณหมุนเวียนคล่องตัวและฟื้นฟูอาการล้า',
    moves: ['ลมหายใจเมฆาคล้อย', 'สายลมครามชะล้างชีพจร']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_CLOUD_STEP_T2', nameTh: 'ท่าร่างเหยียบเมฆาไร้ร่องรอย',
    slot: 'lightness', tier: 2, pathId: 'XIAN', subpathId: 'CLOUD_WIND_SAGE',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'WIND', effectId: 'EFX_SIDESTEP_EVASION',
    originTag: 'รอยเท้าเซียนโบราณบนสะพานหินผาเมฆา',
    loreTh: 'เคล็ดวิชาตัวเบาที่ถ่ายเทน้ำหนักตัวไปตามกระแสลม ก้าวเดินบนยอดหญ้าและผิวน้ำโดยไม่ทิ้งร่องรอย',
    moves: ['ก้าวเมฆาล่องลอย', 'พลิ้วกายไร้เงาตามสายลม']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_GALE_BLADE_T3', nameTh: 'เพลงกระบี่สายลมตัดเมฆา',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 3, pathId: 'XIAN', subpathId: 'CLOUD_WIND_SAGE',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'WIND', effectId: 'EFX_SWORD_STORM_STRIKE', secondaryEffectId: 'EFX_SIDESTEP_EVASION',
    originTag: 'ศิลาจารึกช่องเขาพายุคราม',
    loreTh: 'ควบแน่นปราณวายุไว้ที่ปลายกระบี่ เมื่อตวัดออกจะเกิดคมมีดสายลมไร้รูปพุ่งตัดเกราะศัตรูจากระยะสิบก้าว',
    moves: ['คมวายุสะบั้นเมฆ', 'พายุกระบี่โหมกระหน่ำ', 'สายลมตัดขุนเขา']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_TEMPEST_ROBE_T4', nameTh: 'เคล็ดอาภรณ์วายุหมุนคุ้มกาย',
    slot: 'auxiliary', roleGroup: 'COMBAT_DEFENSE', tier: 4, pathId: 'XIAN', subpathId: 'CLOUD_WIND_SAGE',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'WIND', effectId: 'EFX_BARRIER_SHIELD', secondaryEffectId: 'EFX_TIMED_PARRY',
    originTag: 'ถ้ำลับของปรมาจารย์วายุพเนจร',
    loreTh: 'สร้างกระแสลมหมุนรอบกายดั่งเกราะไร้รูป เบี่ยงเบนคมศาสตราและลูกธนูพร้อมเร่งความเร็วในการสวนกลับ',
    moves: ['ม่านวายุหมุนคุ้มกาย', 'พายุสะท้อนคมศาสตรา']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_NINE_HEAVEN_GALE_T6', nameTh: 'คัมภีร์เซียนมหาพายุเก้าสวรรค์',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 6, pathId: 'XIAN', subpathId: 'CLOUD_WIND_SAGE',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'WIND', effectId: 'EFX_SWORD_STORM_STRIKE', secondaryEffectId: 'EFX_WEAKNESS_EXPOSURE',
    originTag: 'ยอดผาสูงสุดที่พายุสวรรค์ไม่เคยสงบตลอดพันปี',
    loreTh: 'สุดยอดคัมภีร์เซียนวายุที่เรียกพายุคมมีดปราณนับพันสายลงมาจากฟากฟ้า ฉีกกระชากค่ายกลและแนวป้องกันจนสิ้นซาก',
    moves: ['พายุเก้าสวรรค์สะบั้นภพ', 'หมื่นคมวายุกลืนเวหา']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_FROST_DEW_T1', nameTh: 'เคล็ดกลั่นน้ำค้างแข็งยามดึก',
    slot: 'mantra', roleGroup: 'COMBAT_DEFENSE', tier: 1, pathId: 'XIAN', subpathId: 'FROST_MOON_IMMORTAL',
    poolId: 'POOL_WANDERER_RELIC', element: 'WATER', effectId: 'EFX_BARRIER_SHIELD',
    originTag: 'ตำราเก่าในกระท่อมริมสระบัวหยก',
    loreTh: 'ดูดซับไอเย็นยามค่ำคืนเข้าสู่ตันเถียน ช่วยให้จิตใจเยือกเย็นและปราณมีความหนืดเหนียวดั่งน้ำค้างแข็ง',
    moves: ['กลั่นน้ำค้างหยก', 'ไอเย็นคุ้มตันเถียน']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_MOON_MIRROR_T3', nameTh: 'เคล็ดกระจกน้ำแข็งสะท้อนจันทร์',
    slot: 'auxiliary', roleGroup: 'COMBAT_DEFENSE', tier: 3, pathId: 'XIAN', subpathId: 'FROST_MOON_IMMORTAL',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'WATER', effectId: 'EFX_DAMAGE_REFLECT', secondaryEffectId: 'EFX_CHILL_FREEZE',
    originTag: 'สระน้ำแข็งโบราณบนสันเขาจันทราเหมันต์',
    loreTh: 'ควบแน่นปราณเหมันต์เป็นโล่กระจกน้ำแข็งใสสะอาด สะท้อนแรงปะทะและแผ่ไอเย็นแช่แข็งผู้ที่โจมตีเข้ามา',
    moves: ['กระจกเหมันต์สะท้อนเงา', 'จันทร์เพ็ญส่องน้ำแข็ง']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_FROST_LOTUS_SWORD_T4', nameTh: 'เพลงกระบี่บัวหิมะจันทราคราม',
    slot: 'technique', roleGroup: 'COMBAT_CONTROL', tier: 4, pathId: 'XIAN', subpathId: 'FROST_MOON_IMMORTAL',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'WATER', effectId: 'EFX_CHILL_FREEZE', secondaryEffectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'ตำหนักร้างของเซียนหญิงจันทราเหมันต์',
    loreTh: 'ทุกครั้งที่ร่ายรำกระบี่จะปรากฏดอกบัวหิมะเบ่งบานกลางอากาศ แช่แข็งชีพจรและผนึกการโคจรปราณของศัตรู',
    moves: ['บัวหิมะผนึกชีพจร', 'กระบี่จันทราเยือกแข็ง']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_MOONSHADOW_STEP_T5', nameTh: 'ท่าร่างเงาจันทร์เร้นหิมะ',
    slot: 'lightness', tier: 5, pathId: 'XIAN', subpathId: 'FROST_MOON_IMMORTAL',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'WATER', effectId: 'EFX_SIDESTEP_EVASION', secondaryEffectId: 'EFX_CHILL_FREEZE',
    originTag: 'ม้วนหยกเย็นเยียบในหอคอยดาราสวรรค์',
    loreTh: 'สลายร่างเป็นเกล็ดหิมะและแสงจันทร์เมื่อถูกโจมตี ปรากฏตัวขึ้นอีกครั้งด้านหลังศัตรูพร้อมไอเย็นยะเยือก',
    moves: ['แสงจันทร์พร่างพรายกลางหิมะ', 'ก้าวข้ามเงาเหมันต์']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_ETERNAL_WINTER_T7', nameTh: 'มหาคัมภีร์เทวตำนานเหมันต์นิรันดร์ดับสูญ',
    slot: 'forbidden', tier: 7, pathId: 'XIAN', subpathId: 'FROST_MOON_IMMORTAL',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'WATER', effectId: 'EFX_CHILL_FREEZE', secondaryEffectId: 'EFX_SPATIAL_LOCK',
    originTag: 'แก่นน้ำแข็งบรรพกาลยุคกำเนิดโลกา',
    loreTh: 'คัมภีร์ระดับเทวตำนานที่แช่แข็งแม้กระทั่งกาลเวลาและเปลวเพลิงวิญญาณ เปลี่ยนสมรภูมิให้กลายเป็นแดนเหมันต์นิรันดร์',
    moves: ['เหมันต์นิรันดร์ผนึกสามภพ', 'ดับสูญสรรพสิ่งในน้ำแข็งบรรพกาล']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_SWORD_ARRAY_T4', nameTh: 'ค่ายกลกระบี่เจ็ดดาราพิชิตมาร',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 4, pathId: 'XIAN', subpathId: 'SWORD_IMMORTAL',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'METAL', effectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'ศิลาจารึกเจ็ดดาราในสุสานกระบี่โบราณ',
    loreTh: 'แยกเงากระบี่ออกเป็นเจ็ดเล่มเรียงตัวตามกลุ่มดาวกระบวยใหญ่ โจมตีประสานกันอย่างต่อเนื่องไร้ช่องโหว่',
    moves: ['เจ็ดดาราเรียงกระบี่', 'ดาราตกสังหารมาร']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_FIVE_THUNDER_TALISMAN_T5', nameTh: 'คัมภีร์ยันต์ราชันย์อสนีห้าธาตุ',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 5, pathId: 'XIAN', subpathId: 'FIVE_ELEMENTS',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHTNING', effectId: 'EFX_HEAVENLY_THUNDER_SMITE',
    originTag: 'ซากวิหารอัสนีบรรพกาลที่ถูกฟ้าผ่าเก้าครั้ง',
    loreTh: 'ผสานปราณเบญจธาตุเข้ากับอักขระยันต์ทองคำ เรียกสายฟ้าห้าสีลงมาถล่มศัตรูและทำลายเกราะป้องกัน',
    moves: ['ยันต์อสนีห้าธาตุถล่มมาร', 'เบญจธาตุประสานสายฟ้า']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_NINE_TURN_FIRE_T5', nameTh: 'เคล็ดอัคคีวิญญาณเก้าวัฏจักร',
    slot: 'mantra', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 5, pathId: 'XIAN', subpathId: 'ELIXIR_DAO',
    poolId: 'POOL_WANDERER_RELIC', element: 'FIRE', effectId: 'EFX_MERIDIAN_TOXIN_PURGE', secondaryEffectId: 'EFX_MASS_VITAL_HEAL',
    originTag: 'ใต้เตาหลอมโอสถสำริดในถ้ำเซียนโอสถเร้นลับ',
    loreTh: 'เคล็ดควบคุมไฟวิญญาณเก้าชั้นที่ทั้งใช้หลอมโอสถทิพย์และเผาผลาญพิษร้ายในร่างกายให้กลายเป็นปราณบริสุทธิ์',
    moves: ['เพลิงโอสถเก้าวัฏจักรชำระกาย', 'ไฟวิญญาณหลอมรวมปราณ']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_HEAVEN_NET_ARRAY_T6', nameTh: 'มหาค่ายกลตาข่ายฟ้าดินไร้ลักษณ์',
    slot: 'auxiliary', roleGroup: 'COMBAT_CONTROL', tier: 6, pathId: 'XIAN', subpathId: 'ASTRAL_ARRAY',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'EARTH', effectId: 'EFX_SPATIAL_LOCK', secondaryEffectId: 'EFX_BARRIER_SHIELD',
    originTag: 'แผ่นหยกค่ายกลชั้นบนสุดของหอคอยดาราสวรรค์',
    loreTh: 'วางเส้นสายปราณเชื่อมต่อกับชีพจรปฐพี กักขังศัตรูไว้ในมิติค่ายกลและลดทอนพลังโจมตีลงอย่างมหาศาล',
    moves: ['ตาข่ายฟ้าดินผนึกมิติ', 'ดาราจักรหมุนกลับคุ้มสำนัก']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_IMMORTAL_SWORD_GENESIS_T7', nameTh: 'เทวคัมภีร์กระบี่เซียนผ่าปฐมกาล',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 7, pathId: 'XIAN', subpathId: 'SWORD_IMMORTAL',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'METAL', effectId: 'EFX_SWORD_STORM_STRIKE', secondaryEffectId: 'EFX_HEAVENLY_THUNDER_SMITE',
    originTag: 'รอยกระบี่ผ่าฟ้าใจกลางสุสานกระบี่โบราณหมื่นศาสตรา',
    loreTh: 'หนึ่งกระบี่ที่บันทึกเจตจำนงแห่งการเปิดฟ้าผ่าปฐมกาล อานุภาพรุนแรงจนสามารถตัดผ่านทุกเกราะป้องกันและกฎเกณฑ์',
    moves: ['หนึ่งกระบี่ผ่าปฐมกาล', 'แสงกระบี่เบิกสวรรค์นิรันดร์']
  }),
  makeV112Manual({
    id: 'ART_V112_XIAN_JADE_CRANE_BREATH_T2', nameTh: 'ลมปราณกระเรียนหยกเหินเวหา',
    slot: 'mantra', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 2, pathId: 'XIAN', subpathId: 'YIN_YANG_HARMONY',
    poolId: 'POOL_WANDERER_RELIC', element: 'WIND', effectId: 'EFX_MASS_VITAL_HEAL',
    originTag: 'ม้วนผ้าไหมในถ้ำคุนหลุนเร้นลับ',
    loreTh: 'เคล็ดเดินลมปราณสายเต๋าโบราณที่ช่วยให้ตันเถียนกักเก็บปราณได้ลึกซึ้งและฟื้นฟูความเหนื่อยล้าอย่างรวดเร็ว',
    moves: ['กระเรียนหยกคืนรัง', 'หยินหยางหมุนเวียนสมดุล']
  }),

  // --- BODY (14 Manuals across STAR_METEOR_BODY, WOOD_SPRING_BODY & classic BODY subpaths) ---
  makeV112Manual({
    id: 'ART_V112_BODY_METEOR_FIST_T1', nameTh: 'เพลงหมัดหินผาอุกกาบาต',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 1, pathId: 'BODY', subpathId: 'STAR_METEOR_BODY',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'EARTH', effectId: 'EFX_GRAVITY_QI_SEAL',
    originTag: 'ลานเถ้าดาราและหลุมอุกกาบาตชายแดน',
    loreTh: 'เพลงหมัดพื้นฐานที่เน้นการทิ้งน้ำหนักตัวลงสู่กำปั้น หนักแน่นและมั่นคงดั่งก้อนหินตกจากหน้าผา',
    moves: ['หมัดศิลาถล่มผา', 'อุกกาบาตกระแทกปฐพี']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_STAR_BONE_MANTRA_T2', nameTh: 'เคล็ดหลอมกระดูกแสงดารา',
    slot: 'mantra', roleGroup: 'COMBAT_DEFENSE', tier: 2, pathId: 'BODY', subpathId: 'STAR_METEOR_BODY',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'EARTH', effectId: 'EFX_BARRIER_SHIELD',
    originTag: 'หลุมอุกกาบาตเหล็กไหลดาราตก',
    loreTh: 'ดึงดูดรังสีดารายามค่ำคืนและไอแร่อุกกาบาตเข้าสู่ไขกระดูก ทำให้โครงกระดูกแข็งแกร่งดั่งเหล็กกล้า',
    moves: ['กระดูกดาราส่องแสง', 'เกราะเหล็กไหลคุ้มร่าง']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_GRAVITY_DOMAIN_T4', nameTh: 'เคล็ดกายาแรงโน้มถ่วงดาราจักร',
    slot: 'auxiliary', roleGroup: 'COMBAT_CONTROL', tier: 4, pathId: 'BODY', subpathId: 'STAR_METEOR_BODY',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'EARTH', effectId: 'EFX_GRAVITY_QI_SEAL', secondaryEffectId: 'EFX_BARRIER_SHIELD',
    originTag: 'แท่นศิลาเหล็กดำใจกลางเหมืองอุกกาบาต',
    loreTh: 'แผ่สนามแรงโน้มถ่วงหนักอึ้งรอบกาย กดทับให้ศัตรูเคลื่อนไหวเชื่องช้าลงอย่างมากในขณะที่ผู้ฝึกกลับพุ่งชนได้ดั่งดาวตก',
    moves: ['แรงโน้มถ่วงดารากดทับ', 'ขุนเขาเหล็กไหลสะกดปราณ']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_FALLING_STAR_CRASH_T5', nameTh: 'วิชาหมัดดาวตกถล่มปฐพี',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 5, pathId: 'BODY', subpathId: 'STAR_METEOR_BODY',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'EARTH', effectId: 'EFX_GRAVITY_QI_SEAL', secondaryEffectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'รอยหมัดยักษ์ในซากสมรภูมิโบราณ',
    loreTh: 'ควบแน่นพละกำลังทั่วร่างและแรงโน้มถ่วงลงสู่หมัดเดียว เมื่อชกออกจะเกิดคลื่นกระแทกสั่นสะเทือนทำลายอวัยวะภายในศัตรู',
    moves: ['ดาวตกถล่มปฐพี', 'หมัดเดียวทลายเก้าขุนเขา']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_COSMIC_METEOR_T7', nameTh: 'เทวคัมภีร์กายาจักรวาลดาราถล่มภพ',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 7, pathId: 'BODY', subpathId: 'STAR_METEOR_BODY',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'EARTH', effectId: 'EFX_GRAVITY_QI_SEAL', secondaryEffectId: 'EFX_RECOIL_COUNTER',
    originTag: 'แก่นดาวตกบรรพกาลที่ฝังอยู่ในชั้นหินลึกหมื่นวา',
    loreTh: 'เปลี่ยนร่างกายให้กลายเป็นดวงดาวที่มีแรงดึงดูดมหาศาล ทุกหมัดที่เหวี่ยงออกไปเทียบเท่าอุกกาบาตยักษ์พุ่งชนโลกา',
    moves: ['ดาราจักรภพถล่มทลาย', 'หมัดจักรวาลบดขยี้สวรรค์']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_SPRING_PULSE_T1', nameTh: 'เคล็ดชีพจรพฤกษาผลิใบ',
    slot: 'mantra', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 1, pathId: 'BODY', subpathId: 'WOOD_SPRING_BODY',
    poolId: 'POOL_WANDERER_RELIC', element: 'WOOD', effectId: 'EFX_MASS_VITAL_HEAL',
    originTag: 'สวนสมุนไพรโบราณของหมอเทวดาพเนจร',
    loreTh: 'โคจรโลหิตและปราณเลียนแบบการดูดซึมน้ำเลี้ยงของต้นไม้ ช่วยให้แผลสดสมานตัวเร็วกว่าคนทั่วไปหลายเท่า',
    moves: ['พฤกษาผลิใบรับอรุณ', 'น้ำเลี้ยงมรกตสมานแผล']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_VINE_WEAVE_STEP_T2', nameTh: 'ท่าร่างเถาวัลย์พันเกี่ยว',
    slot: 'lightness', tier: 2, pathId: 'BODY', subpathId: 'WOOD_SPRING_BODY',
    poolId: 'POOL_WANDERER_RELIC', element: 'WOOD', effectId: 'EFX_SIDESTEP_EVASION',
    originTag: 'ป่าไผ่เมฆาครามทางทิศตะวันออก',
    loreTh: 'เคลื่อนไหวยืดหยุ่นดั่งเถาวัลย์ต้องลม โอนอ่อนผ่อนตามแรงปะทะของศัตรูแล้วดีดตัวกลับอย่างว่องไว',
    moves: ['เถาวัลย์หยกโอนอ่อน', 'ก้าวพริ้วไหวกลางพงไพร']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_IRONWOOD_BARK_T3', nameTh: 'เคล็ดเกราะไม้ตะเคียนเหล็กพันปี',
    slot: 'auxiliary', roleGroup: 'COMBAT_DEFENSE', tier: 3, pathId: 'BODY', subpathId: 'WOOD_SPRING_BODY',
    poolId: 'POOL_WANDERER_RELIC', element: 'WOOD', effectId: 'EFX_BARRIER_SHIELD', secondaryEffectId: 'EFX_MERIDIAN_TOXIN_PURGE',
    originTag: 'โพรงไม้โบราณพันปีในดงสมุนไพรหยก',
    loreTh: 'เปลี่ยนผิวหนังให้เหนียวแน่นดั่งเปลือกไม้โบราณพันปี ดูดซับแรงกระแทกและสลายพิษร้ายไม่ให้ซึมเข้าสู่เส้นเลือด',
    moves: ['เปลือกไม้พันปีคุ้มกาย', 'รากแก้วหยั่งลึกไม่หวั่นไหว']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_THORN_WHIP_FIST_T4', nameTh: 'เพลงหมัดหนามพฤกษาดูดโลหิต',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 4, pathId: 'BODY', subpathId: 'WOOD_SPRING_BODY',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'WOOD', effectId: 'EFX_VITALITY_STEAL', secondaryEffectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'บึงอสรพิษเจ็ดพิษเร้นลับ',
    loreTh: 'ซัดปราณพฤกษาแหลมคมดั่งหนามเถาวัลย์เข้าใส่ศัตรู พร้อมดูดซับพลังชีวิตส่วนหนึ่งกลับมาฟื้นฟูบาดแผลของตนเอง',
    moves: ['หนามพฤกษากลืนโลหิต', 'เถาวัลย์มรกตกระชากปราณ']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_WORLD_TREE_HEART_T6', nameTh: 'คัมภีร์หัวใจต้นไม้โลกนิรันดร์',
    slot: 'mantra', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 6, pathId: 'BODY', subpathId: 'WOOD_SPRING_BODY',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'WOOD', effectId: 'EFX_MASS_VITAL_HEAL', secondaryEffectId: 'EFX_PURIFY_HOSTILE_STATUS',
    originTag: 'รากแก้วต้นไม้ศักดิ์สิทธิ์ใต้บ่อน้ำทิพย์คุนหลุน',
    loreTh: 'หลอมรวมหัวใจให้เต้นเป็นจังหวะเดียวกับชีพจรของผืนป่า ตราบใดที่เท้ายังแตะพื้นดิน พลังชีวิตจะฟื้นฟูขึ้นมาใหม่ไม่สิ้นสุด',
    moves: ['ลมหายใจต้นไม้โลกชุบชีวิต', 'วัฏจักรพฤกษาผลิบานนิรันดร์']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_VAJRA_RECOIL_T4', nameTh: 'เคล็ดระฆังทองวัชระสะท้อนภพ',
    slot: 'auxiliary', roleGroup: 'COMBAT_DEFENSE', tier: 4, pathId: 'BODY', subpathId: 'VAJRA_BODHI',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'METAL', effectId: 'EFX_RECOIL_COUNTER', secondaryEffectId: 'EFX_BARRIER_SHIELD',
    originTag: 'วิหารศิลาของพระนักรบโบราณ',
    loreTh: 'เกร็งกล้ามเนื้อและกระดูกทองคำรับการโจมตีตรงๆ แล้วสะท้อนแรงกระแทกกลับไปทำลายข้อมือและชีพจรของผู้โจมตี',
    moves: ['ระฆังวัชระสะท้อนกลับ', 'กายาทองคำไม่บุบสลาย']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_BEAST_KING_ROAR_T5', nameTh: 'วิชาคำรามราชันย์อสูรบรรพกาล',
    slot: 'technique', roleGroup: 'COMBAT_CONTROL', tier: 5, pathId: 'BODY', subpathId: 'TIGER_SOVEREIGN',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'FIRE', effectId: 'EFX_SOUL_MENTAL_ATTACK', secondaryEffectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'โครงกระดูกราชันย์พยัคฆ์ขาวในถ้ำลึก',
    loreTh: 'ปลดปล่อยจิตวิญญาณอสูรบรรพกาลออกมาพร้อมเสียงคำรามกึกก้อง สั่นคลอนดวงจิตศัตรูและเพิ่มพลังโจมตีขึ้นอย่างมหาศาล',
    moves: ['ราชันย์อสูรคำรามสะท้านผา', 'กรงเล็บพยัคฆ์โลหิตฉีกเมฆา']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_BOILING_BLOOD_FORBIDDEN_T6', nameTh: 'วิชาต้องห้ามเผาผลาญโลหิตแปดประตู',
    slot: 'forbidden', tier: 6, pathId: 'BODY', subpathId: 'BLOOD_ASURA',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'FIRE', effectId: 'EFX_BLOOD_SACRIFICE_OVERDRIVE',
    originTag: 'ศิลาโลหิตของจอมยุทธ์ผู้ยืนหยัดสู้ทัพหมื่นคนในสมรภูมิโบราณ',
    loreTh: 'เปิดประตูชีพจรโลหิตทั้งแปดจุด เผาผลาญพลังชีวิตส่วนหนึ่งเพื่อแลกกับพละกำลังและความเร็วที่พุ่งทะยานขึ้นหลายเท่าตัว',
    moves: ['เปิดแปดประตูโลหิตทะลวงสวรรค์', 'อสูรโลหิตคลั่งศึกไร้พ่าย']
  }),
  makeV112Manual({
    id: 'ART_V112_BODY_MARTIAL_GOD_FIST_T6', nameTh: 'คัมภีร์หมัดเทพยุทธ์ไร้เทียมทาน',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 6, pathId: 'BODY', subpathId: 'DRAGON_ELEPHANT',
    poolId: 'POOL_ANCIENT_BLOOD_FORGE', element: 'EARTH', effectId: 'EFX_TIMED_PARRY', secondaryEffectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'ยอดเขาศึกยุทธภพโบราณ',
    loreTh: 'หลอมรวมทุกกระบวนท่าหมัดมวยในใต้หล้าเข้าสู่ความเรียบง่าย หมัดเดียวไร้ลูกเล่นแต่แฝงเจตจำนงแห่งผู้ไร้พ่าย',
    moves: ['หมัดเทพยุทธ์พิชิตใต้หล้า', 'มังกรคชสารประสานกำลัง']
  }),

  // --- GOD (12 Manuals across THUNDER_PUNISHER_GOD, MEDICINE_BODHI_GOD & classic GOD subpaths) ---
  makeV112Manual({
    id: 'ART_V112_GOD_SPARK_EDICT_T1', nameTh: 'มนตราประกายสายฟ้าพิทักษ์ธรรม',
    slot: 'mantra', roleGroup: 'COMBAT_OFFENSE', tier: 1, pathId: 'GOD', subpathId: 'THUNDER_PUNISHER_GOD',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHTNING', effectId: 'EFX_HEAVENLY_THUNDER_SMITE',
    originTag: 'แผ่นไม้โอวาทในศาลเจ้าสายฟ้าเก่าแก่',
    loreTh: 'บทสวดพื้นฐานเพื่อสื่อสารกับพลังอสนีแห่งสวรรค์ ช่วยให้ปราณแฝงกระแสไฟฟ้าศักดิ์สิทธิ์ที่ข่มขวัญสิ่งชั่วร้าย',
    moves: ['ประกายอสนีชำระมาร', 'สายฟ้าศักดิ์สิทธิ์คุ้มใจ']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_THUNDER_STEP_T2', nameTh: 'ท่าร่างย่างก้าวอสนีแลบ',
    slot: 'lightness', tier: 2, pathId: 'GOD', subpathId: 'THUNDER_PUNISHER_GOD',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHTNING', effectId: 'EFX_SIDESTEP_EVASION',
    originTag: 'แท่นบูชาสายฟ้าในซากวิหารอัสนีบรรพกาล',
    loreTh: 'กระตุ้นจุดชีพจรที่ฝ่าเท้าด้วยปราณสายฟ้า พุ่งตัวออกไปเป็นเส้นแสงสีทองพร้อมเสียงกัมปนาท',
    moves: ['ย่างก้าวสายฟ้าฟาด', 'อสนีแลบข้ามขุนเขา']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_JUDGMENT_HALBERD_T4', nameTh: 'เพลงทวนสายฟ้าพิพากษาสวรรค์',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 4, pathId: 'GOD', subpathId: 'THUNDER_PUNISHER_GOD',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHTNING', effectId: 'EFX_HEAVENLY_THUNDER_SMITE', secondaryEffectId: 'EFX_GRAVITY_QI_SEAL',
    originTag: 'รูปปั้นเทพนักรบโบราณในซากวิหารอัสนี',
    loreTh: 'ควบแน่นพลังศรัทธาและสายฟ้าเป็นทวนแสงสีทอง ฟาดฟันลงมาด้วยอาญาสิทธิ์แห่งสวรรค์ที่ไม่อาจหลบเลี่ยง',
    moves: ['ทวนอสนีพิพากษาบาป', 'สายฟ้าสวรรค์ทลายมาร']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_NINE_HEAVEN_TRIBULATION_T6', nameTh: 'เทวคัมภีร์ทัณฑ์อสนีเก้าสวรรค์ล้างมาร',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 6, pathId: 'GOD', subpathId: 'THUNDER_PUNISHER_GOD',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHTNING', effectId: 'EFX_HEAVENLY_THUNDER_SMITE', secondaryEffectId: 'EFX_PURIFY_HOSTILE_STATUS',
    originTag: 'แท่นอาญาสิทธิ์สวรรค์กลางแดนลับวิหารอัสนี',
    loreTh: 'อัญเชิญสายฟ้าทัณฑ์สวรรค์ของจริงลงมาผ่าใส่ศัตรู สร้างความเสียหายรุนแรงและเผาผลาญปราณมารจนมอดไหม้',
    moves: ['ทัณฑ์อสนีเก้าสวรรค์พิพากษา', 'สายฟ้าบรรพกาลกวาดล้างอธรรม']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_BODHI_DEW_MANTRA_T1', nameTh: 'มนตราน้ำทิพย์โพธิสัตว์',
    slot: 'mantra', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 1, pathId: 'GOD', subpathId: 'MEDICINE_BODHI_GOD',
    poolId: 'POOL_WANDERER_RELIC', element: 'WOOD', effectId: 'EFX_MASS_VITAL_HEAL',
    originTag: 'คัมภีร์ใบลานในอารามกลางป่า',
    loreTh: 'แผ่จิตเมตตาเปลี่ยนปราณในร่างให้กลายเป็นไอทิพย์อบอุ่น ช่วยบรรเทาความเจ็บปวดและสงบจิตใจที่ฟุ้งซ่าน',
    moves: ['น้ำทิพย์ชะโลมใจ', 'เมตตาธรรมประคองชีพ']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_LOTUS_SANCTUARY_T3', nameTh: 'เคล็ดฉัตรดอกบัวทองคุ้มภัย',
    slot: 'auxiliary', roleGroup: 'COMBAT_DEFENSE', tier: 3, pathId: 'GOD', subpathId: 'MEDICINE_BODHI_GOD',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHT', effectId: 'EFX_TRIBULATION_SHIELD', secondaryEffectId: 'EFX_PURIFY_HOSTILE_STATUS',
    originTag: 'ฐานพระพุทธรูปหยกในถ้ำคุนหลุน',
    loreTh: 'กางม่านแสงรูปดอกบัวทองคำคุ้มครองร่างกาย ลดทอนความเสียหายและป้องกันพิษรวมถึงคำสาปชั่วร้าย',
    moves: ['ฉัตรบัวทองคุ้มครองธรรม', 'รัศมีโพธิญาณสลายพิษ']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_BODHI_SUTRA_HEAL_T5', nameTh: 'พระสูตรเทพโอสถโพธิญาณชุบชีวิต',
    slot: 'auxiliary', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 5, pathId: 'GOD', subpathId: 'MEDICINE_BODHI_GOD',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHT', effectId: 'EFX_MASS_VITAL_HEAL', secondaryEffectId: 'EFX_MERIDIAN_TOXIN_PURGE',
    originTag: 'หอพระไตรปิฎกหยกแห่งเทวสถานโบราณ',
    loreTh: 'เปล่งเสียงสวดพระสูตรโอสถทิพย์ แผ่รัศมีเจ็ดสีที่สมานบาดแผลสาหัส ขับพิษออกจากเส้นชีพจร และฟื้นฟูพลังชีวิตอย่างรวดเร็ว',
    moves: ['แสงโพธิญาณชำระทุกข์', 'โอสถทิพย์ชุบวิญญาณ']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_NIRVANA_REBIRTH_T7', nameTh: 'มหาเทวคัมภีร์นิพพานบัวทองคืนชีพ',
    slot: 'forbidden', tier: 7, pathId: 'GOD', subpathId: 'MEDICINE_BODHI_GOD',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHT', effectId: 'EFX_MASS_VITAL_HEAL', secondaryEffectId: 'EFX_TRIBULATION_SHIELD',
    originTag: 'ดอกบัวทองคำพันกลีบใจกลางแดนสุขาวดีโบราณ',
    loreTh: 'สุดยอดเทวคัมภีร์สายเมตตาและโอสถ เมื่อตกอยู่ในวิกฤตจะปลดปล่อยแสงทองแห่งนิพพาน ชำระล้างบาดแผลทั้งหมดและกางเกราะเทพอมตะ',
    moves: ['บัวทองนิพพานคืนชีพนิรันดร์', 'มหาเมตตาคุ้มครองสามภพ']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_GOLDEN_INCENSE_DOMAIN_T3', nameTh: 'เคล็ดเขตแดนธูปทองคำศักดิ์สิทธิ์',
    slot: 'mantra', roleGroup: 'COMBAT_DEFENSE', tier: 3, pathId: 'GOD', subpathId: 'WAR_DEITY',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'FIRE', effectId: 'EFX_TRIBULATION_SHIELD',
    originTag: 'กระถางธูปสำริดสามขาในศาลเจ้าบรรพชน',
    loreTh: 'รวบรวมแรงอธิษฐานและควันธูปเป็นเกราะแสงสีทอง เพิ่มทั้งพลังป้องกันและอัตราการฟื้นฟูปราณเทวะ',
    moves: ['ควันธูปทองคำพิทักษ์สำนัก', 'ศรัทธาปวงชนหนุนนำตบะ']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_FATE_SEVERING_FINGER_T5', nameTh: 'ดัชนีเทวะตัดสายใยชะตา',
    slot: 'technique', roleGroup: 'COMBAT_CONTROL', tier: 5, pathId: 'GOD', subpathId: 'FATE_ORACLE',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'LIGHT', effectId: 'EFX_SPATIAL_LOCK', secondaryEffectId: 'EFX_SOUL_MENTAL_ATTACK',
    originTag: 'หอคอยดาราสวรรค์เก้าชั้น',
    loreTh: 'มองเห็นเส้นด้ายแห่งโชคชะตาและจุดอ่อนของคู่ต่อสู้ ชี้ดัชนีแสงทองตัดการเชื่อมโยงปราณของศัตรูในพริบตา',
    moves: ['ดัชนีสวรรค์ตัดชะตา', 'เนตรพยากรณ์สยบมาร']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_SUN_MOON_WHEEL_T6', nameTh: 'คัมภีร์กงล้อสุริยันจันทราเบิกฟ้า',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 6, pathId: 'GOD', subpathId: 'SOLAR_SOVEREIGN',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'FIRE', effectId: 'EFX_HEAVENLY_THUNDER_SMITE', secondaryEffectId: 'EFX_TRIBULATION_SHIELD',
    originTag: 'ตำหนักจักรพรรดิสวรรค์โบราณ',
    loreTh: 'สร้างกงล้อแสงสุริยันและจันทราหมุนวนบดขยี้ศัตรูด้วยอานุภาพแห่งจักรพรรดิเทวะผู้ครองฟ้าดิน',
    moves: ['กงล้อสุริยันจันทราพิชิตภพ', 'แสงทองจักรพรรดิครอบคลุมหล้า']
  }),
  makeV112Manual({
    id: 'ART_V112_GOD_GUARDIAN_SPEAR_T4', nameTh: 'เพลงทวนเทพพิทักษ์ขุนเขา',
    slot: 'technique', roleGroup: 'COMBAT_DEFENSE', tier: 4, pathId: 'GOD', subpathId: 'WAR_DEITY',
    poolId: 'POOL_CELESTIAL_SHRINE_RELIC', element: 'EARTH', effectId: 'EFX_TIMED_PARRY', secondaryEffectId: 'EFX_GRAVITY_QI_SEAL',
    originTag: 'ศาลเทพเจ้าขุนเขาโบราณ',
    loreTh: 'ยืมพลังแห่งขุนเขาและผืนดินมาไว้ในคมทวน ปัดป้องการโจมตีและแทงสวนกลับด้วยพลังดั่งภูผาถล่ม',
    moves: ['ทวนเทพพิทักษ์ผืนแผ่นดิน', 'ขุนเขาศักดิ์สิทธิ์ต้านหมื่นทัพ']
  }),

  // --- DEMON (12 Manuals across SHADOW_ASSASSIN, VENOM_GU_SOVEREIGN, NETHER_GHOST_KING, HEAVEN_DEVOURING_DEMON) ---
  makeV112Manual({
    id: 'ART_V112_DEMON_NIGHT_CLOAK_T1', nameTh: 'เคล็ดอาภรณ์เงารัตติกาล',
    slot: 'lightness', tier: 1, pathId: 'DEMON', subpathId: 'SHADOW_ASSASSIN',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'YIN', effectId: 'EFX_SIDESTEP_EVASION',
    originTag: 'บันทึกหนังสัตว์ของหอสังหารเงาจันทร์',
    loreTh: 'วิชาเร้นกายเบื้องต้นที่สอนการกลมกลืนไปกับเงามืดและลดเสียงฝีเท้าจนแทบไม่ได้ยิน',
    moves: ['เร้นกายใต้เงามืด', 'ก้าวพรายไร้เสียง']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_SILENT_DAGGER_T3', nameTh: 'เพลงมีดสั้นไร้เงาปลิดวิญญาณ',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 3, pathId: 'DEMON', subpathId: 'SHADOW_ASSASSIN',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'YIN', effectId: 'EFX_SWORD_STORM_STRIKE', secondaryEffectId: 'EFX_WEAKNESS_EXPOSURE',
    originTag: 'สุสานนักฆ่าไร้ชื่อในซากสมรภูมิโบราณ',
    loreTh: 'พุ่งเข้าประชิดจากมุมอับสายตาแล้วตวัดมีดสั้นอาบปราณหยินตัดจุดชีพจรสำคัญ สร้างความเสียหายคริติคอลรุนแรง',
    moves: ['คมมีดไร้เงาปลิดชีพ', 'ประกายจันทร์มืดแทงจุดตาย']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_VOID_SHADOW_KILL_T6', nameTh: 'คัมภีร์มารสังหารข้ามมิติเงา',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 6, pathId: 'DEMON', subpathId: 'SHADOW_ASSASSIN',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'YIN', effectId: 'EFX_SWORD_STORM_STRIKE', secondaryEffectId: 'EFX_SPATIAL_LOCK',
    originTag: 'แท่นศิลาของจอมนักฆ่าผู้เคยลอบสังหารเซียนในหุบเหวมาร',
    loreTh: 'มุดเข้าสู่มิติเงาไร้ลักษณ์แล้วโผล่ขึ้นจากเงาของศัตรูเอง แทงทะลวงเกราะป้องกันเข้าสู่หัวใจโดยตรง',
    moves: ['เงาสังหารทะลวงมิติ', 'หนึ่งคมสะบั้นชะตาในความมืด']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_FIVE_VENOM_PALM_T2', nameTh: 'ฝ่ามือพิษเบญจพิษกัดกร่อน',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 2, pathId: 'DEMON', subpathId: 'VENOM_GU_SOVEREIGN',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'WOOD', effectId: 'EFX_QI_SIPHON', secondaryEffectId: 'EFX_WEAKNESS_EXPOSURE',
    originTag: 'ถ้ำแมงป่องหยกในบึงอสรพิษเจ็ดพิษเร้นลับ',
    loreTh: 'หลอมพิษจากแมงป่อง ตะขาบ งูพิษ คางคก และแมงมุมเข้าสู่ฝ่ามือ เมื่อซัดถูกศัตรูจะทำให้เกิดพิษสะสมและปราณรั่วไหล',
    moves: ['ฝ่ามือเบญจพิษซึมลึก', 'หมอกพิษมรกตกัดกร่อนเกราะ']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_GOLDEN_GU_PARASITE_T4', nameTh: 'เคล็ดเพาะกู่ทองคำกลืนชีพจร',
    slot: 'auxiliary', roleGroup: 'COMBAT_OFFENSE', tier: 4, pathId: 'DEMON', subpathId: 'VENOM_GU_SOVEREIGN',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'WOOD', effectId: 'EFX_QI_SIPHON', secondaryEffectId: 'EFX_VITALITY_STEAL',
    originTag: 'โถหยกดำโบราณของหุบเขาหมื่นพิษ',
    loreTh: 'ปล่อยปราณแมลงกู่ทองคำไร้รูปเข้าเกาะกินปราณของศัตรู ดูดซับทั้งพลังปราณและพลังชีวิตกลับมาให้เจ้าของอย่างต่อเนื่อง',
    moves: ['ฝูงกู่ทองคำกลืนปราณ', 'ไหมพิษพันธนาการชีพจร']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_MYRIAD_VENOM_DOMAIN_T6', nameTh: 'มหาคัมภีร์มารหมอกพิษหมื่นอสรพิษล้างภพ',
    slot: 'forbidden', tier: 6, pathId: 'DEMON', subpathId: 'VENOM_GU_SOVEREIGN',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'WOOD', effectId: 'EFX_QI_SIPHON', secondaryEffectId: 'EFX_CHILL_FREEZE',
    originTag: 'แท่นบูชาพญางูบรรพกาลใต้บึงอสรพิษเจ็ดพิษ',
    loreTh: 'ปลดปล่อยหมอกพิษบรรพกาลปกคลุมทั่วบริเวณ กัดกร่อนเกราะป้องกัน สูบปราณให้เหือดแห้ง และเปลี่ยนพิษในร่างตนให้เป็นพลังชีวิต',
    moves: ['หมอกพิษหมื่นอสรพิษกลืนฟ้า', 'กู่เทวะบรรพกาลตื่นรู้']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_GHOST_WAIL_MANTRA_T2', nameTh: 'เคล็ดปราณหยินเสียงคร่ำครวญยมโลก',
    slot: 'mantra', roleGroup: 'COMBAT_CONTROL', tier: 2, pathId: 'DEMON', subpathId: 'NETHER_GHOST_KING',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'YIN', effectId: 'EFX_SOUL_MENTAL_ATTACK',
    originTag: 'สุสานโบราณยุคสงครามหมื่นสำนัก',
    loreTh: 'โคจรปราณหยินเยือกแข็งพร้อมเปล่งคลื่นเสียงภูตพรายคร่ำครวญ รบกวนสมาธิและทำลายขวัญกำลังใจของคู่ต่อสู้',
    moves: ['เสียงภูตคร่ำครวญยามวิกาล', 'ไอเย็นยมโลกสะกดขวัญ']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_BONE_ARMOR_SHIELD_T3', nameTh: 'เคล็ดเกราะกระดูกขาวอเวจี',
    slot: 'auxiliary', roleGroup: 'COMBAT_DEFENSE', tier: 3, pathId: 'DEMON', subpathId: 'NETHER_GHOST_KING',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'YIN', effectId: 'EFX_BARRIER_SHIELD', secondaryEffectId: 'EFX_CHILL_FREEZE',
    originTag: 'หุบเหวมารโลหิตพันปี',
    loreTh: 'ควบแน่นปราณหยินเป็นเกราะกระดูกขาวและโล่วิญญาณหมุนวนรอบกาย ลดความเสียหายและแผ่ไอเย็นสะกดผู้โจมตี',
    moves: ['เกราะกระดูกขาวพิทักษ์มาร', 'โล่วิญญาณอเวจีสะท้อนคม']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_NETHER_SOUL_CLAW_T5', nameTh: 'กรงเล็บราชันย์ภูตกระชากวิญญาณ',
    slot: 'technique', roleGroup: 'COMBAT_CONTROL', tier: 5, pathId: 'DEMON', subpathId: 'NETHER_GHOST_KING',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'YIN', effectId: 'EFX_SOUL_MENTAL_ATTACK', secondaryEffectId: 'EFX_CHILL_FREEZE',
    originTag: 'ตำหนักใต้ดินของราชันย์ภูตโบราณ',
    loreTh: 'รวมเปลวไฟวิญญาณสีครามไว้ที่กรงเล็บ ตะปบผ่านเกราะกายภาพเข้าฉีกกระชากดวงจิตและแช่แข็งเส้นชีพจรศัตรู',
    moves: ['กรงเล็บยมโลกกระชากจิต', 'เพลิงวิญญาณครามเผาผลาญตบะ']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_BLOOD_SIPHON_MANTRA_T3', nameTh: 'คัมภีร์มารวังวนสูบปราณโลหิต',
    slot: 'mantra', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 3, pathId: 'DEMON', subpathId: 'HEAVEN_DEVOURING_DEMON',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'FIRE', effectId: 'EFX_VITALITY_STEAL', secondaryEffectId: 'EFX_QI_SIPHON',
    originTag: 'ผนังถ้ำหินสีเลือดในหุบเหวมารโลหิตพันปี',
    loreTh: 'สร้างวังวนปราณมารที่ฝ่ามือ ทุกครั้งที่ปะทะกับศัตรูจะสูบพลังปราณและโลหิตของอีกฝ่ายมาฟื้นฟูตนเอง',
    moves: ['วังวนมารสูบโลหิต', 'กลืนปราณศึกหล่อเลี้ยงตันเถียน']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_DEVOURING_ABYSS_PALM_T5', nameTh: 'ฝ่ามือมารหลุมดำกลืนดารา',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 5, pathId: 'DEMON', subpathId: 'HEAVEN_DEVOURING_DEMON',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'YIN', effectId: 'EFX_VITALITY_STEAL', secondaryEffectId: 'EFX_GRAVITY_QI_SEAL',
    originTag: 'แท่นผนึกจอมมารกลืนสวรรค์ชั้นใน',
    loreTh: 'ซัดฝ่ามือสร้างหลุมดำขนาดย่อมที่ดึงดูดและบดขยี้ศัตรู พร้อมดูดกลืนพลังปราณและพลังชีวิตมาเสริมความแข็งแกร่งให้ตนเอง',
    moves: ['หลุมดำมารกลืนดารา', 'ฝ่ามือทมิฬสูบเหือดมหาสมุทร']
  }),
  makeV112Manual({
    id: 'ART_V112_DEMON_HEAVEN_DEVOURING_CANON_T7', nameTh: 'มหาเทวคัมภีร์มารกลืนสวรรค์ทลายสามภพ',
    slot: 'forbidden', tier: 7, pathId: 'DEMON', subpathId: 'HEAVEN_DEVOURING_DEMON',
    poolId: 'POOL_NETHER_ABYSS_ALTAR', element: 'YIN', effectId: 'EFX_BLOOD_SACRIFICE_OVERDRIVE', secondaryEffectId: 'EFX_VITALITY_STEAL',
    originTag: 'ศิลาจารึกต้นกำเนิดมรรคามารยุคบรรพกาลใต้หุบเหวมารโลหิต',
    loreTh: 'สุดยอดคัมภีร์ต้องห้ามระดับเทวตำนานของวิถีมาร เปลี่ยนร่างกายเป็นเตาหลอมจักรวาลที่กลืนกินทุกการโจมตีและสูบพลังชีวิตศัตรูมาเป็นของตน',
    moves: ['จอมมารกลืนสวรรค์ทลายภพ', 'เตาหลอมโกลาหลกลืนกินหมื่นมรรคา']
  }),

  // --- HEART_SOUL (12 Manuals across ZEN_VOID_MIND, CALLIGRAPHY_PAINTING_SAGE, DREAM_ILLUSION_WEAVER, MIND_SWORD_TELEKINESIS) ---
  makeV112Manual({
    id: 'ART_V112_SOUL_CLEAR_MIRROR_ZEN_T1', nameTh: 'เคล็ดทำสมาธิกระจกใจไร้ฝุ่น',
    slot: 'mantra', roleGroup: 'HEAL_SUPPORT_TRAINING', tier: 1, pathId: 'HEART_SOUL', subpathId: 'ZEN_VOID_MIND',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'LIGHT', effectId: 'EFX_PURIFY_HOSTILE_STATUS', secondaryEffectId: 'EFX_MASS_VITAL_HEAL',
    originTag: 'ศาลาไม้ไผ่ริมสระน้ำใสของอารามเซนโบราณ',
    loreTh: 'เคล็ดทำจิตให้ว่างเปล่าและผ่องใสดั่งกระจกเงา ช่วยป้องกันภาพลวงตา สงบจิตมาร และฟื้นฟูพลังจิตวิญญาณ',
    moves: ['กระจกใจส่องความว่าง', 'ลมหายใจเซนชำระฝุ่นธุลี']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_VOID_LOTUS_REFLECT_T4', nameTh: 'เคล็ดดอกบัวสุญตาสะท้อนหมื่นธรรม',
    slot: 'auxiliary', roleGroup: 'COMBAT_DEFENSE', tier: 4, pathId: 'HEART_SOUL', subpathId: 'ZEN_VOID_MIND',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'LIGHT', effectId: 'EFX_DAMAGE_REFLECT', secondaryEffectId: 'EFX_TIMED_PARRY',
    originTag: 'แท่นหินนั่งสมาธิของปรมาจารย์เซนร้อยปี',
    loreTh: 'เมื่อจิตว่างเปล่าไร้ความยึดติด พลังโจมตีของศัตรูที่พุ่งเข้ามาจะไหลผ่านความว่างเปล่าและสะท้อนกลับไปหาผู้โจมตีเอง',
    moves: ['สุญตาสะท้อนหมื่นวิชา', 'ดอกบัวขาวเบ่งบานในความว่าง']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_BUDDHA_PALM_VOID_T6', nameTh: 'คัมภีร์ฝ่ามือเซนสุญตาสยบมาร',
    slot: 'technique', roleGroup: 'COMBAT_DEFENSE', tier: 6, pathId: 'HEART_SOUL', subpathId: 'ZEN_VOID_MIND',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'LIGHT', effectId: 'EFX_DAMAGE_REFLECT', secondaryEffectId: 'EFX_SOUL_MENTAL_ATTACK',
    originTag: 'รอยฝ่ามือทองคำบนหน้าผาหลังอารามบรรพกาล',
    loreTh: 'ผสานพลังจิตวิญญาณและสัจธรรมแห่งความว่างเปล่าเป็นฝ่ามือแสงสีทอง สยบความคลุ้มคลั่งและสะท้อนพลังทำลายล้างของศัตรู',
    moves: ['ฝ่ามือสุญตาสยบหมู่มาร', 'หนึ่งรอยยิ้มเซนสะท้านสามภพ']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_SPIRIT_INK_STROKE_T2', nameTh: 'เพลงพู่กันหมึกวิญญาณจารึกอักษร',
    slot: 'technique', roleGroup: 'COMBAT_CONTROL', tier: 2, pathId: 'HEART_SOUL', subpathId: 'CALLIGRAPHY_PAINTING_SAGE',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'NEUTRAL', effectId: 'EFX_SPATIAL_LOCK',
    originTag: 'ห้องหนังสือเก่าแก่ของบัณฑิตเซียน',
    loreTh: 'ควบแน่นพลังจิตเป็นเส้นหมึกสีดำทองกลางอากาศ จารึกคำว่า "ผนึก" และ "ฟัน" เพื่อโจมตีและชะลอการเคลื่อนไหวของศัตรู',
    moves: ['ตวัดพู่กันจารึกอักษร', 'เส้นหมึกวิญญาณพันธนาการ']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_MOUNTAIN_RIVER_SCROLL_T4', nameTh: 'เคล็ดม้วนภาพขุนเขาแม่น้ำพันลี้',
    slot: 'auxiliary', roleGroup: 'COMBAT_CONTROL', tier: 4, pathId: 'HEART_SOUL', subpathId: 'CALLIGRAPHY_PAINTING_SAGE',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'EARTH', effectId: 'EFX_SPATIAL_LOCK', secondaryEffectId: 'EFX_BARRIER_SHIELD',
    originTag: 'ภาพวาดโบราณที่แขวนอยู่ในหอคอยดาราสวรรค์',
    loreTh: 'กางม้วนภาพวาดพลังจิตออกมารอบกาย เปลี่ยนพื้นที่ต่อสู้ให้กลายเป็นโลกภาพวาดขุนเขาและสายน้ำที่กักขังศัตรูและคุ้มครองเจ้าของ',
    moves: ['ภาพวาดขุนเขาแม่น้ำกักขัง', 'หมึกหยกวาดกำแพงภูผา']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_HEAVEN_BRUSH_DECREE_T6', nameTh: 'คัมภีร์พู่กันสวรรค์ลิขิตฟ้าดิน',
    slot: 'technique', roleGroup: 'COMBAT_CONTROL', tier: 6, pathId: 'HEART_SOUL', subpathId: 'CALLIGRAPHY_PAINTING_SAGE',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'LIGHT', effectId: 'EFX_SPATIAL_LOCK', secondaryEffectId: 'EFX_HEAVENLY_THUNDER_SMITE',
    originTag: 'แท่นฝนหมึกหยกจักรพรรดิในแดนลับปราชญ์โบราณ',
    loreTh: 'ตวัดพู่กันวิญญาณเขียนอักษรสวรรค์สีทองกลางเวหา อักษรแต่ละตัวแปรเปลี่ยนเป็นสายฟ้า ขุนเขา และโซ่ตรวนมิติที่สะกดศัตรูอย่างสมบูรณ์',
    moves: ['พู่กันสวรรค์ลิขิตชะตา', 'บทกวีทองคำเรียกทัณฑ์อสนี']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_BUTTERFLY_DREAM_STEP_T2', nameTh: 'ท่าร่างผีเสื้อความฝันเริงระบำ',
    slot: 'lightness', tier: 2, pathId: 'HEART_SOUL', subpathId: 'DREAM_ILLUSION_WEAVER',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'WIND', effectId: 'EFX_SIDESTEP_EVASION',
    originTag: 'ดงกล้วยไม้หมอกและศาลาความฝัน',
    loreTh: 'เคลื่อนไหวพลิ้วไหวดั่งผีเสื้อในความฝัน ทิ้งภาพติดตาและเงามายาไว้เบื้องหลังจนศัตรูไม่อาจแยกแยะร่างจริงได้',
    moves: ['ผีเสื้อเริงระบำในห้วงฝัน', 'เงามายาพร่างพรายไร้ตัวตน']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_SEVEN_EMOTION_MIRAGE_T4', nameTh: 'คัมภีร์มายาฝันเจ็ดอารมณ์ลวงจิต',
    slot: 'technique', roleGroup: 'COMBAT_CONTROL', tier: 4, pathId: 'HEART_SOUL', subpathId: 'DREAM_ILLUSION_WEAVER',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'YIN', effectId: 'EFX_SOUL_MENTAL_ATTACK', secondaryEffectId: 'EFX_QI_SIPHON',
    originTag: 'พิณหยกโบราณในตำหนักมายาจันทร์',
    loreTh: 'ส่งคลื่นพลังจิตกระตุ้นอารมณ์รัก โลภ โกรธ หลง ในใจศัตรูให้กลายเป็นภาพฝันลวงตา บั่นทอนพลังจิตและเปิดช่องว่างให้โจมตี',
    moves: ['มายาเจ็ดอารมณ์กลืนสติ', 'พิณฝันสะกดวิญญาณ']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_ETERNAL_DREAM_REALM_T5', nameTh: 'เคล็ดวัฏจักรฝันซ้อนฝันเก้าชั้น',
    slot: 'mantra', roleGroup: 'COMBAT_CONTROL', tier: 5, pathId: 'HEART_SOUL', subpathId: 'DREAM_ILLUSION_WEAVER',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'YIN', effectId: 'EFX_SOUL_MENTAL_ATTACK', secondaryEffectId: 'EFX_SIDESTEP_EVASION',
    originTag: 'หมอนหยกโบราณของเซียนนิทรา',
    loreTh: 'ดึงดูดจิตสำนึกของศัตรูเข้าสู่ห้วงฝันซ้อนฝันเก้าชั้น ยิ่งศัตรูดิ้นรนมากเท่าใด พลังปราณและสติสัมปชัญญะก็ยิ่งถูกสูบออกไปมากเท่านั้น',
    moves: ['ห้วงฝันเก้าชั้นไร้ทางตื่น', 'โลกมายาซ้อนทับความจริง']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_MIND_BLADE_FLASH_T3', nameTh: 'เคล็ดประกายกระบี่จิตทะลวงเนตร',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 3, pathId: 'HEART_SOUL', subpathId: 'MIND_SWORD_TELEKINESIS',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'LIGHT', effectId: 'EFX_SOUL_MENTAL_ATTACK', secondaryEffectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'ศิลาฝึกจิตของปรมาจารย์กระบี่ไร้รูป',
    loreTh: 'ควบแน่นพลังจิตวิญญาณเป็นเข็มและใบมีดไร้รูป พุ่งโจมตีเข้าสู่ทะเลจิตของศัตรูโดยตรงโดยไม่สนใจเกราะภายนอก',
    moves: ['ประกายกระบี่จิตไร้ลักษณ์', 'เข็มวิญญาณทะลวงทะเลจิต']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_TELEKINESIS_SWORD_WHEEL_T5', nameTh: 'วิชาค่ายกลกงล้อกระบี่จิตพันเล่ม',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 5, pathId: 'HEART_SOUL', subpathId: 'MIND_SWORD_TELEKINESIS',
    poolId: 'POOL_SWORD_CLIFF_STELA', element: 'METAL', effectId: 'EFX_SOUL_MENTAL_ATTACK', secondaryEffectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'สุสานกระบี่โบราณหมื่นศาสตรา',
    loreTh: 'ใช้พลังจิตควบคุมคมกระบี่วิญญาณนับพันเล่มให้หมุนวนเป็นกงล้อไร้รูป ฟาดฟันศัตรูจากทุกทิศทางตามความคิดคำนึง',
    moves: ['กงล้อกระบี่จิตพันเล่มสังหาร', 'จิตขยับคมกระบี่สะบั้นฟ้า']
  }),
  makeV112Manual({
    id: 'ART_V112_SOUL_FORMLESS_MIND_SWORD_T7', nameTh: 'มหาเทวคัมภีร์กระบี่จิตไร้รูปสะบั้นวิญญาณ',
    slot: 'technique', roleGroup: 'COMBAT_OFFENSE', tier: 7, pathId: 'HEART_SOUL', subpathId: 'MIND_SWORD_TELEKINESIS',
    poolId: 'POOL_ZEN_HEART_PAVILION', element: 'LIGHT', effectId: 'EFX_SOUL_MENTAL_ATTACK', secondaryEffectId: 'EFX_SWORD_STORM_STRIKE',
    originTag: 'ยอดเขาสุญตาที่ไร้แม้แต่รอยกระบี่แต่แฝงเจตจำนงสะท้านภพ',
    loreTh: 'ขั้นสูงสุดของวิถีกระบี่จิตที่ละทิ้งรูปลักษณ์ของศาสตราโดยสิ้นเชิง เพียงหนึ่งความคิดก่อเกิดคมกระบี่ไร้รูปที่สะบั้นได้ทั้งทะเลจิตและสายธารแห่งชะตา',
    moves: ['หนึ่งความคิดสะบั้นวิญญาณสามภพ', 'ไร้กระบี่ในมือแต่มีกระบี่ในจักรวาล']
  })
];

const MANUAL_MAP_V112 = new Map(MANUALS_V112.map(m => [m.id, m]));

// Wrap E.getAllTechniquesCatalogV190 and E.getTechniqueByIdV190 so all 66 manuals are registered engine-wide
const origGetAllTechV190 = E.getAllTechniquesCatalogV190;
if (typeof origGetAllTechV190 === 'function') {
  E.getAllTechniquesCatalogV190 = function(...args) {
    const base = origGetAllTechV190.apply(this, args) || [];
    const seen = new Set(base.map(a => a.id));
    const out = [...base];
    for (const m of MANUALS_V112) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        out.push(m);
      }
    }
    return out;
  };
}
const origGetTechByIdV190 = E.getTechniqueByIdV190;
if (typeof origGetTechByIdV190 === 'function') {
  E.getTechniqueByIdV190 = function(id, ...args) {
    if (MANUAL_MAP_V112.has(id)) return MANUAL_MAP_V112.get(id);
    return origGetTechByIdV190.call(this, id, ...args);
  };
}

// Weighted Fortuitous Manual Pool Selector (supports both (opts) and (world, npc, opts) signatures + Karma Pity)
function rollFortuitousManualV112(arg1 = {}, arg2 = null, arg3 = null) {
  let opts = arg1 || {};
  if (arg2 && (arg2.jianghu || arg2.id || arg3)) {
    opts = { ...(arg3 || {}), world: arg1, npc: arg2 };
  }
  const n = opts.npc || null;
  const origin = String(opts.origin || '').toLowerCase();
  const poolHint = String(opts.poolId || '');
  const rng = opts.rng || { next: () => Math.random() };

  let chosenPool = FORTUNE_MANUAL_POOLS_V112[0];
  if (poolHint) {
    chosenPool = FORTUNE_MANUAL_POOLS_V112.find(p => p.poolId === poolHint) || chosenPool;
  } else if (origin) {
    for (const p of FORTUNE_MANUAL_POOLS_V112) {
      if (p.matchTags.some(tag => origin.includes(tag))) {
        chosenPool = p;
        break;
      }
    }
  }

  const npcBand = Math.max(1, Number(n?.jianghu?.realizationBand || opts.tier || 1));
  const npcPath = n?.jianghu?.path || '';
  const npcSubPath = n?.jianghu?.subPath || '';
  const danger = Number(opts.danger || 25);
  const karma = Number(n?.jianghu?.fortuneKarmaV113 || 0);

  const knownIds = new Set([
    ...Object.keys(n?.jianghu?.knowledgeV190 || {}),
    ...((n?.jianghu?.ledgerV140?.scrolls || []).map(s => s.artId))
  ]);

  const maxAllowedTier = opts.allowAnyTier
    ? 7
    : Math.min(7, Math.max(4, Math.ceil(npcBand) + 2 + Math.floor((danger + karma * 0.4) / 22)));

  const candidates = [];
  let totalWeight = 0;

  for (const m of MANUALS_V112) {
    if (knownIds.has(m.id) && !opts.allowDuplicates) continue;
    if (m.tier > maxAllowedTier) continue;

    let w = m.dropWeight || 20;
    const poolMult = chosenPool.tierMultiplier?.[m.tier] ?? 1.0;
    w *= poolMult;

    if (m.poolId === chosenPool.poolId) w *= 1.85;
    if (npcSubPath && m.subPath === npcSubPath) w *= 3.2;
    else if (npcPath && m.path === npcPath) w *= 1.9;
    else if (m.crossPathCompatibility?.allowedSecondaryPaths?.includes(npcPath)) w *= 1.1;
    else w *= 0.35;

    // High-tier rarity scaling: higher tiers drop much more rarely unless danger, realm, or fortune karma are high
    if (m.tier >= 4) {
      const bonus = Math.min(2.8, (npcBand * 0.22) + (danger / 60) + (karma / 75));
      w *= Math.max(0.18, bonus);
    }

    if (w > 0.001) {
      candidates.push({ manual: m, weight: w });
      totalWeight += w;
    }
  }

  if (!candidates.length) return null;

  const randVal = typeof rng === 'function' ? rng() : (typeof rng.next === 'function' ? rng.next() : Math.random());
  let roll = randVal * totalWeight;
  let picked = candidates[0].manual;
  for (const c of candidates) {
    roll -= c.weight;
    if (roll <= 0) {
      picked = c.manual;
      break;
    }
  }

  // Update Fortuitous Karma / Pity counter on the NPC if present
  if (n?.jianghu) {
    if ((picked.tier || 1) >= 5) {
      n.jianghu.fortuneKarmaV113 = 0;
    } else {
      n.jianghu.fortuneKarmaV113 = Math.min(120, (n.jianghu.fortuneKarmaV113 || 0) + 15);
    }
  }

  const gradeObj = MANUAL_RARITY_GRADES_V112[picked.tier] || MANUAL_RARITY_GRADES_V112[1];
  return {
    manual: picked,
    pool: chosenPool,
    grade: gradeObj,
    gradeInfo: gradeObj,
    rarityInfo: gradeObj,
    rarityGrade: picked.tier,
    rarityTier: picked.tier
  };
}

// v1.16 Non-destructive Comparative Scripture Deduction: compare 2 mastered texts to deduce a higher-tier catalog manual
function drawRngV116(rng) {
  if (typeof rng === 'function') return rng();
  if (rng && typeof rng.next === 'function') return rng.next();
  return Math.random();
}

function synthesizeManualV113(n, artIdA, artIdB, rng = { next: () => Math.random() }, opts = {}) {
  const mA = MANUAL_MAP_V112.get(artIdA) || E.getTechniqueByIdV190?.(artIdA) || MANUALS_V112[0];
  const mB = MANUAL_MAP_V112.get(artIdB) || E.getTechniqueByIdV190?.(artIdB) || MANUALS_V112[1];
  const baseTier = Math.max(Number(mA?.tier || 1), Number(mB?.tier || 1));
  const samePathBonus = (mA?.path && mA.path === mB?.path) ? 0.18 : 0;
  const sameSubBonus = (mA?.subPath && mA.subPath === mB?.subPath) ? 0.12 : 0;
  const insightBonus = Math.min(0.15, Number(n?.jianghu?.daoInsightCountV113 || 0) * 0.03);
  const band = Math.max(1, Math.floor(Number(n?.jianghu?.realizationBand || 1)));
  const maxRealmTier = Math.min(7, band + 1);
  const npcPath = n?.jianghu?.path || mA?.path || 'XIAN';
  const npcSubPath = n?.jianghu?.subPath || mA?.subPath || '';
  const knownIds = new Set(Object.keys(n?.jianghu?.knowledgeV190 || {}));
  const ownedScrollArtIds = new Set((n?.jianghu?.ledgerV140?.scrolls || []).map(s => s.artId).filter(Boolean));

  const candidatesForTier = (tier) => MANUALS_V112.filter(
    m => m.tier === tier && m.path === npcPath && m.id !== artIdA && m.id !== artIdB && !knownIds.has(m.id) && !ownedScrollArtIds.has(m.id)
  );

  if (opts.previewOnly) {
    const leapPossible = baseTier <= 5 && Math.min(7, baseTier + 2) <= maxRealmTier && candidatesForTier(Math.min(7, baseTier + 2)).length > 0;
    const baseTarget = Math.min(7, baseTier + 1, maxRealmTier);
    const pool = candidatesForTier(baseTarget).length ? candidatesForTier(baseTarget) : (leapPossible ? candidatesForTier(Math.min(7, baseTier + 2)) : []);
    if (!pool.length) return null;
    return { manual: pool[0], targetTier: pool[0].tier, leapPossible, fromArts: [mA?.nameTh || artIdA, mB?.nameTh || artIdB] };
  }

  const leapRoll = drawRngV116(rng);
  const canLeap = baseTier <= 5 && (baseTier + 2) <= maxRealmTier && candidatesForTier(baseTier + 2).length > 0;
  const leap = (canLeap && leapRoll < (0.14 + samePathBonus + sameSubBonus + insightBonus)) ? 2 : 1;
  let targetTier = Math.min(7, baseTier + leap, maxRealmTier);
  let pool = candidatesForTier(targetTier);
  if (!pool.length && leap === 2) {
    targetTier = Math.min(7, baseTier + 1, maxRealmTier);
    pool = candidatesForTier(targetTier);
  }
  if (!pool.length) return null;

  pool.sort((a, b) => {
    const scoreA = (a.subPath === npcSubPath ? 4 : 0) + (a.path === npcPath ? 2 : 0);
    const scoreB = (b.subPath === npcSubPath ? 4 : 0) + (b.path === npcPath ? 2 : 0);
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });
  const topSlice = pool.slice(0, Math.min(6, pool.length));
  const pickRoll = drawRngV116(rng);
  const idx = Math.floor(pickRoll * topSlice.length) % Math.max(1, topSlice.length);
  const picked = topSlice[idx] || pool[0];
  const gradeObj = MANUAL_RARITY_GRADES_V112[picked.tier] || MANUAL_RARITY_GRADES_V112[1];
  return {
    manual: picked,
    grade: gradeObj,
    fromArts: [mA?.nameTh || artIdA, mB?.nameTh || artIdB],
    targetTier: picked.tier,
    leap: picked.tier - baseTier
  };
}

// ============================================================================
// PART D: DYNAMIC NPC STATUS KEYWORDS & MULTI-FORMAT CHRONICLE CATEGORIES
// ============================================================================
const CHRONICLE_CATEGORIES_V112 = [
  { id: 'ALL', labelTh: 'ทั้งหมด', icon: '📜' },
  { id: 'CULTIVATION', labelTh: 'บ่มเพาะ·ทะลวงด่าน', icon: '🧘' },
  { id: 'MANUALS', labelTh: 'คัมภีร์·มรรคา', icon: '📘' },
  { id: 'FORTUNE', labelTh: 'วาสนา·แดนลับ', icon: '✨' },
  { id: 'COMBAT', labelTh: 'ศึกยุทธภพ·ล่าอสูร', icon: '⚔️' },
  { id: 'CRAFT_ECO', labelTh: 'โอสถ·ศาสตรา·นิเวศ', icon: '⚗️' },
  { id: 'SECT_COUNCIL', labelTh: 'การค้า·สภาสำนัก', icon: '🏛️' }
];

function classifyChronicleEntryV112(entryOrText) {
  const t = typeof entryOrText === 'string'
    ? entryOrText
    : String((entryOrText?.title || '') + ' ' + (entryOrText?.text || '') + ' ' + (entryOrText?.kind || ''));
  if (/คัมภีร์|หอสืบทอด|ศิลาจารึก|คัดลอก|หลอมรวมคัมภีร์|สังเคราะห์|เรียน|วิชา|ตำรา|scripture|manual|scroll/i.test(t)) return 'MANUALS';
  if (/วาสนา|แดนลับ|ออกเดินทาง|กลับถึงตลาด|สำรวจ|fortune|journey|expedition/i.test(t)) return 'FORTUNE';
  if (/ปราบ|สังหาร|อสูร|โจร|ประลอง|ลาดตระเวน|ค่าหัว|บาดเจ็บ|เสียชีวิต|combat|hunt|raid/i.test(t)) return 'COMBAT';
  if (/โอสถ|หลอม|สมุนไพร|ปลูก|รดน้ำ|เก็บเกี่ยว|แร่|ไม้ไผ่|ชงชา|craft|pill|garden/i.test(t)) return 'CRAFT_ECO';
  if (/ตลาด|ประมูล|ผู้แทน|คาราวาน|สภา|นโยบาย|รับศิษย์|ก่อสร้าง|ผูกมิตร|trade|auction|envoy/i.test(t)) return 'SECT_COUNCIL';
  return 'CULTIVATION';
}

function computeNpcStatusKeywordsV112(n) {
  if (!n || !n.jianghu) return [];
  const j = n.jianghu;
  const p = n.stageLocal || {};
  const cs = p.combatState || {};
  const tags = [];

  // 1. Major Path Identity Tag
  const pathMeta = {
    XIAN: { label: '☯ เซียนปราณ', color: '#38bdf8' },
    BODY: { label: '🔥 กายาเหล็กไหล', color: '#f59e0b' },
    GOD: { label: '⚡ เทวะศักดิ์สิทธิ์', color: '#facc15' },
    DEMON: { label: '🩸 วิถีมารอสูร', color: '#e599f7' },
    HEART_SOUL: { label: '🪷 วิถีจิต·เซน', color: '#a5d8ff' }
  }[j.path] || { label: '☯ ผู้ฝึกตน', color: '#94a3b8' };
  tags.push({ id: 'kw_path', labelTh: pathMeta.label, color: pathMeta.color });

  // 2. Cultivation & Breakthrough Readiness / Cross-Dao Insight
  if ((j.cultivationProgress || 0) >= 95) {
    tags.push({ id: 'kw_breakthrough', labelTh: '✨ ปราณเปี่ยมล้น·พร้อมทะลวงด่าน', color: '#ffd43b' });
  } else if (p.action === 'seclusion') {
    tags.push({ id: 'kw_seclusion', labelTh: '🧘 ปิดด่านทะลวงคอขวด', color: '#ffd43b' });
  } else if ((j.daoInsightCountV113 || 0) > 0) {
    tags.push({ id: 'kw_insight', labelTh: '🌟 แจ้งกระจ่างญาณข้ามวิถี', color: '#ffe066' });
  }

  // 3. Mind / Heart Demon / Toxicity
  if ((j.heartDemon || 0) >= 20 || (n.core?.human?.state?.grief || 0) >= 25) {
    tags.push({ id: 'kw_mind_unrest', labelTh: '🌑 คลื่นอารมณ์/จิตมารรบกวน', color: '#ff8787' });
  } else if ((n.core?.condition?.fatigue || 0) < 25 && (n.health || 0) >= 90) {
    tags.push({ id: 'kw_zen_clarity', labelTh: '💎 กระจกใจใสกระจ่าง', color: '#69db7c' });
  }

  // 4. Highest Equipped Manual Badge
  let bestArt = null;
  for (const slot of ['forbidden', 'technique', 'mantra', 'auxiliary', 'lightness']) {
    const id = j[slot + 'Id'];
    if (!id) continue;
    const art = MANUAL_MAP_V112.get(id) || (E.getTechniqueByIdV190 ? E.getTechniqueByIdV190(id) : null);
    if (art && (!bestArt || (art.tier || 1) > (bestArt.tier || 1))) bestArt = art;
  }
  if (bestArt) {
    const g = MANUAL_RARITY_GRADES_V112[bestArt.tier || 1] || MANUAL_RARITY_GRADES_V112[1];
    tags.push({
      id: 'kw_manual',
      labelTh: '📘 วิชา' + g.badgeTh + '·' + String(bestArt.nameTh || '').slice(0, 14),
      color: g.color
    });
  }

  // 5. Contextual Action Keyword
  const actKeyword = {
    comprehendTablet: '🗡️ เพ่งศึกษารอยกระบี่ศิลา',
    meditateWaterfall: '💧 เคี่ยวกรำกายใต้น้ำตกหยก',
    brewTeaDao: '🍵 ชงชาวิญญาณสนทนาธรรม',
    copyScripture: '📜 คัดลอกคัมภีร์เข้าหอสืบทอด',
    synthesizeScriptures: '🔮 หลอมรวมคัมภีร์บัญญัติวิชา',
    patrolSect: '🛡️ ลาดตระเวนคุ้มภัยหุบเขา',
    seekFortune: '✨ แสวงโชควาสนาฟ้าดิน',
    prepareExpedition: '🧭 เตรียมบุกเบิกแดนลับ',
    departExpedition: '⛰️ เดินทางสู่แดนลับ',
    readScripture: '📖 ขบคิดเคล็ดวิชาในคัมภีร์',
    readLibraryScripture: '🏛️ ศึกษาคัมภีร์หอสืบทอด',
    practiceScripture: '⚔️ เคี่ยวกรำกระบวนท่า'
  }[p.action];
  if (actKeyword) {
    tags.push({ id: 'kw_action', labelTh: actKeyword, color: '#fcc419' });
  } else if (cs.guardUntil > 0 || cs.evadeUntil > 0) {
    tags.push({ id: 'kw_combat', labelTh: '🛡️ ปราณคุ้มกายทำงาน', color: '#63e6be' });
  }

  const eqRes = computeEquipmentResonanceV114(n);
  if (eqRes.setActive && eqRes.setNameTh) {
    tags.push({ id: 'kw_eq_set', labelTh: '⚔️ ' + eqRes.setNameTh, color: '#ffc078' });
  }
  return tags.slice(0, 5);
}

// Keep engine-side fast lookup maps in sync; the preserved world installer temporarily
// trims public arrays while constructing its baseline world, so re-register after it returns.

// ============================================================================
// PART E: V1.14 DEEP ITEMS, EQUIPMENT, MATERIALS, SPIRIT BEASTS & MULTI-POOLS
// ============================================================================
const CATEGORY_META_TH = {
  HERB: { sub: 'สมุนไพรวิญญาณธรรมชาติ', prop: 'อัดแน่นด้วยปราณฟ้าดินตามฤดูกาลและภูมิประเทศ', use: 'ใช้หลอมโอสถทิพย์ ชงชาวิญญาณ และเลี้ยงอสูรคู่หู' },
  ORE: { sub: 'แร่ธาตุและโลหะปราณ', prop: 'โครงสร้างผลึกแข็งแกร่ง ทนทานต่อเพลิงหลอมและแรงปะทะ', use: 'ใช้ตีศาสตรา เกราะป้องกัน และจารึกเสาค่ายกล' },
  CRYSTAL: { sub: 'ผลึกปราณและหยกสวรรค์', prop: 'เหนี่ยวนำคลื่นพลังจิตและปราณธาตุได้บริสุทธิ์ยิ่ง', use: 'ใช้ทำแกนเครื่องราง พู่กันวิญญาณ และค่ายกลชั้นสูง' },
  SPIRIT_LIQUID: { sub: 'ของเหลววิญญาณและน้ำอมฤต', prop: 'ซึมซับเข้าสู่เส้นชีพจรและไขกระดูกได้โดยตรง', use: 'ใช้ชุบคมศาสตรา ปรุงโอสถชั้นสูง และชำระล้างไขกระดูก' },
  TALISMAN_MAT: { sub: 'เครื่องเขียนยันต์และหมึกปราณ', prop: 'กักเก็บเจตจำนงและอักขระเต๋าไม่ให้เสื่อมคลาย', use: 'ใช้จารึกอักขระรูนบนอุปกรณ์ คัดลอกคัมภีร์ และตั้งค่ายกล' },
  VENOM_GU: { sub: 'หัวเชื้อพิษและแมลงกู่บรรพกาล', prop: 'แฝงฤทธิ์กัดกร่อนปราณและกระตุ้นชีพจรสายมาร', use: 'ใช้ปรุงโอสถพิษ โอสถถอนพิษ และชุบอาวุธสังหาร' },
  BEAST_PART: { sub: 'ชิ้นส่วนกายวิภาคสัตว์อสูร', prop: 'คงตบะและสัญชาตญาณดั้งเดิมของสัตว์อสูรไว้ภายใน', use: 'ใช้หลอมยุทธภัณฑ์ประจำสาย ปรุงโอสถโลหิต และทำเครื่องราง' }
};

const MATERIALS_V114 = [
  // 1-5: High-Depth Spirit Herbs (Tiers 3-6)
  {
    id: 'MAT_HERB_SOUL_LOTUS_3', nameTh: 'บัววิญญาณเจ็ดสี', category: 'HERB', tier: 3,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'TALISMAN'], season: 'SPRING', terrain: 'plains',
    baseValueStones: 78, seedNameTh: 'เมล็ดบัววิญญาณเจ็ดสี', regenPerSeason: 5, isTranscendent: false,
    subCategoryTh: 'สมุนไพรบำรุงทะเลจิต',
    propertiesTh: 'กลีบบัวเปล่งประกายเจ็ดสีตามคลื่นอารมณ์ ช่วยประสานรอยร้าวในทะเลสำนึกและขับไล่จิตมาร',
    futureUsesTh: 'ใช้ปรุงโอสถบัววิญญาณเจ็ดสีชำระจิต และโอสถสายวิถีจิต·เซน'
  },
  {
    id: 'MAT_HERB_NETHER_MUSHROOM_3', nameTh: 'เห็ดหลินจือทมิฬยมโลก', category: 'HERB', tier: 3,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'BEAST_TAMING'], season: 'AUTUMN', terrain: 'mountain',
    baseValueStones: 74, seedNameTh: 'สปอร์หลินจือทมิฬ', regenPerSeason: 5, isTranscendent: false,
    subCategoryTh: 'สมุนไพรปราณหยินเร้นลับ',
    propertiesTh: 'เติบโตในหุบเหวมืดที่ไร้แสงตะวัน ดูดซับปราณหยินและไอวิญญาณเข้มข้น',
    futureUsesTh: 'ใช้ปรุงโอสถสายมารอสูร น้ำเต้าเลี้ยงกู่ และกำยานล่ออสูร'
  },
  {
    id: 'MAT_HERB_STARLIGHT_GRASS_4', nameTh: 'หญ้าดาราพันปี', category: 'HERB', tier: 4,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'FORGING'], season: 'WINTER', terrain: 'mountain',
    baseValueStones: 162, seedNameTh: 'เมล็ดหญ้าดาราพันปี', regenPerSeason: 3, isTranscendent: false,
    subCategoryTh: 'สมุนไพรดาราหลอมกายา',
    propertiesTh: 'ใบหญ้ามีจุดแสงดั่งกลุ่มดาว ดูดซับรังสีดารายามค่ำคืนและแรงโน้มถ่วงฟ้าดิน',
    futureUsesTh: 'ใช้ปรุงโอสถโลหิตมังกรดาราหลอมกาย และเสริมกระดูกดารา'
  },
  {
    id: 'MAT_HERB_BODHI_LEAF_5', nameTh: 'ใบโพธิ์ทองคำบรรพกาล', category: 'HERB', tier: 5,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'TALISMAN', 'ARRAY'], season: 'ALL', terrain: 'mountain',
    baseValueStones: 320, seedNameTh: 'หน่อโพธิ์ทองคำ', regenPerSeason: 2, isTranscendent: false,
    subCategoryTh: 'สมุนไพรศักดิ์สิทธิ์โพธิญาณ',
    propertiesTh: 'เส้นใบสลักลวดลายธรรมะธรรมชาติ แผ่รัศมีคุ้มครองดวงจิตและต้านทานสายฟ้าทัณฑ์สวรรค์',
    futureUsesTh: 'ใช้หลอมจีวรทองคำโพธิญาณ และมหาโอสถท้อเซียนโพธิญาณทะลวงด่าน'
  },
  {
    id: 'MAT_HERB_IMMORTAL_PEACH_6', nameTh: 'ผลท้อเซียนเก้าวัฏจักร', category: 'HERB', tier: 6,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY'], season: 'SPRING', terrain: 'mountain',
    baseValueStones: 680, seedNameTh: 'เมล็ดท้อเซียนบรรพกาล', regenPerSeason: 1, isTranscendent: true,
    subCategoryTh: 'ผลไม้ทิพย์ระดับเซียนบรรพกาล',
    propertiesTh: 'สามพันปีผลิดอก สามพันปีออกผล อัดแน่นด้วยปราณอมตะที่ช่วยยืดอายุขัยและทะลวงคอขวด',
    futureUsesTh: 'ตัวยาหลักในมหาโอสถท้อเซียนโพธิญาณและโอสถระดับเทวตำนาน'
  },

  // 6-10: High-Depth Ores & Spirit Crystals (Tiers 3-6)
  {
    id: 'MAT_ORE_NETHER_OBSIDIAN_3', nameTh: 'ศิลาทมิฬดูดวิญญาณ', category: 'ORE', tier: 3,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'ARRAY'], season: 'ALL', terrain: 'mountain',
    baseValueStones: 76, finiteReserve: 45, slowCrystalRegen: false, isTranscendent: false,
    subCategoryTh: 'แร่หยินสังหารเร้นเงา',
    propertiesTh: 'หินแร่สีดำสนิทที่ดูดกลืนแสงและเสียงรอบข้าง เหมาะแก่การตีศาสตราลอบสังหาร',
    futureUsesTh: 'ใช้หลอมกริชคู่เงาจันทร์ไร้เสียง และเกราะเกล็ดตะขาบพิษทมิฬ'
  },
  {
    id: 'MAT_ORE_MIND_CRYSTAL_3', nameTh: 'ผลึกกระจกจิต', category: 'CRYSTAL', tier: 3,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'TALISMAN', 'ARRAY'], season: 'ALL', terrain: 'mountain',
    baseValueStones: 82, finiteReserve: 40, slowCrystalRegen: true, isTranscendent: false,
    subCategoryTh: 'ผลึกสะท้อนคลื่นพลังจิต',
    propertiesTh: 'ผลึกใสสะอาดดั่งกระจกเงา ขยายอานุภาพของกระบี่จิต เสียงพิณ และภาพมายา',
    futureUsesTh: 'ใช้หลอมพิณกระจกจิตเจ็ดสาย และพู่กันผลึกกระจกจิตอักษรสวรรค์'
  },
  {
    id: 'MAT_ORE_STARFALL_METEOR_4', nameTh: 'แร่เหล็กไหลอุกกาบาตดารา', category: 'ORE', tier: 4,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'ARRAY'], season: 'ALL', terrain: 'mountain',
    baseValueStones: 175, finiteReserve: 28, slowCrystalRegen: false, isTranscendent: false,
    subCategoryTh: 'โลหะอุกกาบาตนอกดาราจักร',
    propertiesTh: 'แร่เหล็กไหลที่ร่วงหล่นจากฟากฟ้า หนักแน่นดั่งขุนเขาและแฝงสนามแรงโน้มถ่วงดารา',
    futureUsesTh: 'ใช้ตีกระบี่ยักษ์เหล็กไหลดาราตก และทวนมังกรสายฟ้าพิพากษา'
  },
  {
    id: 'MAT_ORE_DIVINE_GOLD_5', nameTh: 'ทองคำศักดิ์สิทธิ์สุริยัน', category: 'ORE', tier: 5,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'TALISMAN', 'ARRAY'], season: 'ALL', terrain: 'mountain',
    baseValueStones: 350, finiteReserve: 16, slowCrystalRegen: true, isTranscendent: false,
    subCategoryTh: 'เทวโลหะแห่งแสงสุริยันและอสนี',
    propertiesTh: 'โลหะทองคำที่หลอมละลายด้วยสายฟ้าสวรรค์เท่านั้น ไม่แปดเปื้อนไอหยินและพิษมาร',
    futureUsesTh: 'ใช้หลอมกระบี่ขนนกกระเรียนสวรรค์ จีวรทองคำโพธิญาณ และกระจกหยกสุญตา'
  },
  {
    id: 'MAT_ORE_CHAOS_VOID_JADE_6', nameTh: 'หยกสุญตาโกลาหลปฐมกาล', category: 'CRYSTAL', tier: 6,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'ARRAY', 'TALISMAN'], season: 'ALL', terrain: 'mountain',
    baseValueStones: 720, finiteReserve: 8, slowCrystalRegen: true, isTranscendent: true,
    subCategoryTh: 'หยกบรรพกาลเหนือกาลเวลา',
    propertiesTh: 'เศษเสี้ยวหยกจากยุคเปิดฟ้าดิน ภายในซ่อนมิติว่างเปล่าที่สะท้อนและกลืนกินหมื่นวิชา',
    futureUsesTh: 'ใช้หลอมกระจกหยกสุญตาโกลาหล และปลุกจิตศาสตราระดับเทวตำนาน'
  },

  // 11-14: Spirit Liquids, Talisman Inks & Venom Gu Essences (Tiers 3-4)
  {
    id: 'MAT_LIQ_MOON_DEW_3', nameTh: 'น้ำอมฤตจันทราเหมันต์', category: 'SPIRIT_LIQUID', tier: 3,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'FORGING'], season: 'WINTER', terrain: 'mountain',
    baseValueStones: 80, isTranscendent: false,
    subCategoryTh: 'น้ำทิพย์ควบแน่นจากแสงจันทร์',
    propertiesTh: 'หยดน้ำค้างที่รวมตัวกันในคืนจันทร์เพ็ญบนยอดเขาหิมะ เย็นบริสุทธิ์และฟื้นฟูชีพจร',
    futureUsesTh: 'ใช้ปรุงโอสถบัววิญญาณเจ็ดสี และทออาภรณ์ปีกผีเสื้อมายาฝัน'
  },
  {
    id: 'MAT_LIQ_EARTH_MARROW_4', nameTh: 'ไขกระดูกปฐพีพันปี', category: 'SPIRIT_LIQUID', tier: 4,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'FORGING'], season: 'ALL', terrain: 'mountain',
    baseValueStones: 180, isTranscendent: false,
    subCategoryTh: 'ของเหลวแก่นชีพจรธรณี',
    propertiesTh: 'น้ำแร่สีทองข้นหนืดที่ซึมออกจากใจกลางถ้ำผลึกศิลา เสริมความแข็งแกร่งของกระดูกและโลหะ',
    futureUsesTh: 'ใช้ปรุงโอสถโลหิตมังกรดารา และชุบแข็งกระบี่ยักษ์เหล็กไหลดาราตก'
  },
  {
    id: 'MAT_TAL_VERMILION_INK_3', nameTh: 'หมึกชาดโลหิตอสนี', category: 'TALISMAN_MAT', tier: 3,
    primaryCraftPath: 'TALISMAN', compatiblePaths: ['TALISMAN', 'FORGING', 'ARRAY'], season: 'ALL', terrain: 'plains',
    baseValueStones: 75, isTranscendent: false,
    subCategoryTh: 'หมึกวิญญาณจารึกอักขระ',
    propertiesTh: 'ผสมจากแร่ชาดปราณ ผงไผ่อัสนี และโลหิตอสูร สื่อนำพลังอักขระรูนได้อย่างทรงพลัง',
    futureUsesTh: 'ใช้สร้างพู่กันผลึกกระจกจิต จารึกอักขระรูนบนศาสตรา และตั้งมหาค่ายกล'
  },
  {
    id: 'MAT_VEN_CENTIPEDE_GU_4', nameTh: 'พิษตะขาบเพลิงเจ็ดสี', category: 'VENOM_GU', tier: 4,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'FORGING'], season: 'SUMMER', terrain: 'forest',
    baseValueStones: 168, isTranscendent: false,
    subCategoryTh: 'หัวเชื้อพิษกู่หมื่นอสรพิษ',
    propertiesTh: 'พิษเข้มข้นที่กลั่นจากการต่อสู้ของแมลงกู่นับร้อย กัดกร่อนเกราะปราณและสูบพลังชีวิต',
    futureUsesTh: 'ใช้หลอมน้ำเต้าหยกทมิฬเลี้ยงกู่ และชุบคมศาสตราสายมารอสูร'
  },

  // 15-28: Anatomically Valid Beast Parts for the 6 New Spirit Beasts (Tiers 3-4)
  {
    id: 'MAT_BP_SHADOW_PANTHER_PELT_3', nameTh: 'หนังเสือดำเงาจันทร์', category: 'BEAST_PART', anatomyType: 'HIDE_PELT', tier: 3,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'TALISMAN'], season: 'ALL', terrain: 'forest', baseValueStones: 74, isTranscendent: false,
    subCategoryTh: 'หนังอสูรเร้นเงา', propertiesTh: 'ผืนหนังสีดำอมม่วงที่กลืนไปกับความมืดยามค่ำคืน', futureUsesTh: 'ใช้ตัดเย็บอาภรณ์นักฆ่าและด้ามกริชเงาจันทร์'
  },
  {
    id: 'MAT_BP_SHADOW_PANTHER_CLAW_3', nameTh: 'กรงเล็บเร้นเงาเสือดำ', category: 'BEAST_PART', anatomyType: 'FANG_CLAW', tier: 3,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING'], season: 'ALL', terrain: 'forest', baseValueStones: 78, isTranscendent: false,
    subCategoryTh: 'กรงเล็บสังหารไร้เสียง', propertiesTh: 'คมกริบและแฝงปราณหยินที่ฉีกกระชากม่านปราณป้องกัน', futureUsesTh: 'ใช้ตีคมกริชคู่เงาจันทร์ไร้เสียง'
  },
  {
    id: 'MAT_BP_SHADOW_TENDON_3', nameTh: 'เส้นเอ็นไร้เสียงเสือดำเงา', category: 'BEAST_PART', anatomyType: 'TENDON_TAIL', tier: 3,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'BEAST_TAMING'], season: 'ALL', terrain: 'forest', baseValueStones: 72, isTranscendent: false,
    subCategoryTh: 'เส้นเอ็นยืดหยุ่นความเร็วสูง', propertiesTh: 'เหนียวแน่นและไร้เสียงเมื่อดีดตัว', futureUsesTh: 'ใช้ขึงสายพิณกระจกจิตและสายรัดกริชเงาจันทร์'
  },
  {
    id: 'MAT_BP_CENTIPEDE_VENOM_3', nameTh: 'ถุงพิษตะขาบเกราะเหล็ก', category: 'BEAST_PART', anatomyType: 'VENOM_GLAND', tier: 3,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'FORGING'], season: 'ALL', terrain: 'forest', baseValueStones: 80, isTranscendent: false,
    subCategoryTh: 'ต่อมพิษกัดกร่อนปราณ', propertiesTh: 'บรรจุน้ำพิษสีมรกตดำที่ใช้เลี้ยงแมลงกู่และทำลายเกราะ', futureUsesTh: 'ใช้หลอมเกราะเกล็ดตะขาบพิษทมิฬและน้ำเต้าเลี้ยงกู่'
  },
  {
    id: 'MAT_BP_CENTIPEDE_CARAPACE_3', nameTh: 'เปลือกเกราะตะขาบทมิฬ', category: 'BEAST_PART', anatomyType: 'SCALE_CARAPACE', tier: 3,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'ARRAY'], season: 'ALL', terrain: 'forest', baseValueStones: 76, isTranscendent: false,
    subCategoryTh: 'เปลือกเกราะอสูรพิษ', propertiesTh: 'แข็งแกร่งดั่งเหล็กดำแต่เบาและทนทานต่อกรดพิษทุกชนิด', futureUsesTh: 'ใช้ตีเกราะเกล็ดตะขาบพิษทมิฬ'
  },
  {
    id: 'MAT_BP_DREAM_MOTH_WING_3', nameTh: 'ปีกละอองฝันผีเสื้อวิญญาณ', category: 'BEAST_PART', anatomyType: 'SPIRIT_HAIR_FEATHER', tier: 3,
    primaryCraftPath: 'TALISMAN', compatiblePaths: ['TALISMAN', 'FORGING'], season: 'ALL', terrain: 'forest', baseValueStones: 79, isTranscendent: false,
    subCategoryTh: 'ปีกวิญญาณทอภาพลวงตา', propertiesTh: 'โปรยละอองแสงที่ทำให้ผู้มองตกอยู่ในภวังค์ความฝัน', futureUsesTh: 'ใช้ทออาภรณ์ปีกผีเสื้อมายาฝันและพู่กันผลึกกระจกจิต'
  },
  {
    id: 'MAT_BP_DREAM_MOTH_CORE_3', nameTh: 'แก่นมายาผีเสื้อเจ็ดอารมณ์', category: 'BEAST_PART', anatomyType: 'BEAST_CORE', tier: 3,
    primaryCraftPath: 'ARRAY', compatiblePaths: ['ARRAY', 'ALCHEMY', 'FORGING'], season: 'ALL', terrain: 'forest', baseValueStones: 85, isTranscendent: false,
    subCategoryTh: 'แก่นอสูรสายจิตวิญญาณ', propertiesTh: 'ผลึกปราณจิตที่สั่นพ้องกับอารมณ์ทั้งเจ็ดของมนุษย์', futureUsesTh: 'ใช้หลอมพิณกระจกจิตเจ็ดสาย อาภรณ์มายาฝัน และโอสถบัววิญญาณ'
  },
  {
    id: 'MAT_BP_THUNDER_DRAKE_SCALE_4', nameTh: 'เกล็ดเจียวหลงสายฟ้า', category: 'BEAST_PART', anatomyType: 'SCALE_CARAPACE', tier: 4,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'ARRAY'], season: 'ALL', terrain: 'mountain', baseValueStones: 172, isTranscendent: false,
    subCategoryTh: 'เกล็ดมังกรวารีอาบอสนี', propertiesTh: 'เกล็ดสีครามเข้มที่มีประจุสายฟ้าไหลเวียนอยู่ตลอดเวลา', futureUsesTh: 'ใช้ตีเกราะเกล็ดเจียวหลงสายฟ้าและจีวรทองคำโพธิญาณ'
  },
  {
    id: 'MAT_BP_THUNDER_DRAKE_HORN_4', nameTh: 'เขาอัสนีเจียวหลงคราม', category: 'BEAST_PART', anatomyType: 'BONE_HORN', tier: 4,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING', 'ARRAY'], season: 'ALL', terrain: 'mountain', baseValueStones: 180, isTranscendent: false,
    subCategoryTh: 'เขาอสูรมังกรสื่อสายฟ้า', propertiesTh: 'ดึงดูดและควบแน่นสายฟ้าสวรรค์ลงสู่ปลายศาสตรา', futureUsesTh: 'ใช้หลอมทวนมังกรสายฟ้าพิพากษาและกระบี่ยักษ์ดาราตก'
  },
  {
    id: 'MAT_BP_THUNDER_DRAKE_BLOOD_4', nameTh: 'โลหิตมังกรวารีสายฟ้า', category: 'BEAST_PART', anatomyType: 'BLOOD', tier: 4,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'BEAST_TAMING', 'TALISMAN'], season: 'ALL', terrain: 'mountain', baseValueStones: 168, isTranscendent: false,
    subCategoryTh: 'โลหิตปราณมังกรระดับสูง', propertiesTh: 'โลหิตอุ่นจัดที่เปี่ยมด้วยพลังชีวิตและปราณอัสนี', futureUsesTh: 'ใช้ปรุงโอสถโลหิตมังกรดาราหลอมกายและกำยานล่ออสูรบรรพกาล'
  },
  {
    id: 'MAT_BP_ABYSS_FIEND_HEART_4', nameTh: 'หัวใจอสูรโลหิตอเวจี', category: 'BEAST_PART', anatomyType: 'HEART_GALL', tier: 4,
    primaryCraftPath: 'ALCHEMY', compatiblePaths: ['ALCHEMY', 'BEAST_TAMING'], season: 'ALL', terrain: 'mountain', baseValueStones: 185, isTranscendent: false,
    subCategoryTh: 'หัวใจอสูรสายมารโลหิต', propertiesTh: 'ยังเต้นตุบๆ ด้วยปราณโลหิตบ้าคลั่งแม้ถูกควักออกจากร่าง', futureUsesTh: 'ใช้หลอมน้ำเต้าหยกทมิฬเลี้ยงกู่และโอสถโลหิตมังกรดารา'
  },
  {
    id: 'MAT_BP_ABYSS_FIEND_FANG_4', nameTh: 'เขี้ยวสูบวิญญาณอสูรอเวจี', category: 'BEAST_PART', anatomyType: 'FANG_CLAW', tier: 4,
    primaryCraftPath: 'FORGING', compatiblePaths: ['FORGING'], season: 'ALL', terrain: 'mountain', baseValueStones: 176, isTranscendent: false,
    subCategoryTh: 'เขี้ยวอสูรสูบปราณ', propertiesTh: 'เมื่อฝังลงในร่างเหยื่อจะดูดซับพลังชีวิตและปราณโดยอัตโนมัติ', futureUsesTh: 'ใช้หลอมกระบี่ยักษ์เหล็กไหลดาราตกและน้ำเต้าหยกทมิฬ'
  },
  {
    id: 'MAT_BP_CELESTIAL_CRANE_PLUME_4', nameTh: 'ขนปีกกระเรียนสวรรค์เก้าห้วง', category: 'BEAST_PART', anatomyType: 'SPIRIT_HAIR_FEATHER', tier: 4,
    primaryCraftPath: 'TALISMAN', compatiblePaths: ['TALISMAN', 'FORGING'], season: 'ALL', terrain: 'mountain', baseValueStones: 178, isTranscendent: false,
    subCategoryTh: 'ขนนกเซียนวายุบริสุทธิ์', propertiesTh: 'ไร้น้ำหนักแต่คมกริบดั่งใบมีดวายุเมื่ออัดปราณเซียนเข้าไป', futureUsesTh: 'ใช้หลอมกระบี่ขนนกกระเรียนสวรรค์และพู่กันผลึกกระจกจิต'
  },
  {
    id: 'MAT_BP_CELESTIAL_CRANE_CORE_4', nameTh: 'แก่นเซียนกระเรียนสวรรค์', category: 'BEAST_PART', anatomyType: 'BEAST_CORE', tier: 4,
    primaryCraftPath: 'ARRAY', compatiblePaths: ['ARRAY', 'ALCHEMY', 'FORGING'], season: 'ALL', terrain: 'mountain', baseValueStones: 192, isTranscendent: false,
    subCategoryTh: 'แก่นอสูรมงคลระดับสูง', propertiesTh: 'ผลึกสีขาวบริสุทธิ์ที่ช่วยชำระล้างปราณและเชื่อมต่อมิติฟ้าดิน', futureUsesTh: 'ใช้หลอมกระบี่ขนนกกระเรียนสวรรค์ กระจกหยกสุญตา และมหาโอสถท้อเซียน'
  }
];

// Enrich all existing v1.11 + base materials with subCategoryTh, propertiesTh, futureUsesTh if missing
for (const m of [...(D.MATERIALS_REGISTRY_V140 || []), ...materials, ...MATERIALS_V114]) {
  const cm = CATEGORY_META_TH[m.category] || CATEGORY_META_TH.HERB;
  if (!m.subCategoryTh) m.subCategoryTh = cm.sub + ' (ระดับ ' + (m.tier || 1) + ')';
  if (!m.propertiesTh) m.propertiesTh = m.nameTh + ' · ' + cm.prop;
  if (!m.futureUsesTh) m.futureUsesTh = cm.use;
}

const BEASTS_V114 = [
  {
    id: 'BEAST_SHADOW_PANTHER', nameTh: 'เสือดำเงาจันทร์เร้นลับ', tier: 3, maxDropSlots: 3,
    terrain: 'forest', combatPower: 480, basePop: 42, maxPop: 72, reproPerSeason: 7, element: 'YIN',
    descTh: 'นักล่าแห่งรัตติกาลที่หลอมรวมร่างเข้ากับเงาไม้ไผ่และแสงจันทร์ จู่โจมจุดตายโดยไร้เสียงฝีเท้า',
    anatomy: { hasBlood: true, hasHeartGall: true, hasVenom: false, hasHide: true, hasScales: false, hasBoneHorn: true, hasFangClaw: true, hasTendonTail: true, hasFurOrFeather: true, hasCore: true, hasMeatMusk: true },
    partDrops: [
      { matId: 'MAT_BP_SHADOW_PANTHER_PELT_3', anatomyType: 'HIDE_PELT' },
      { matId: 'MAT_BP_SHADOW_PANTHER_CLAW_3', anatomyType: 'FANG_CLAW' },
      { matId: 'MAT_BP_SHADOW_TENDON_3', anatomyType: 'TENDON_TAIL' }
    ]
  },
  {
    id: 'BEAST_IRON_CENTIPEDE', nameTh: 'ตะขาบเกราะเหล็กพิษทมิฬ', tier: 3, maxDropSlots: 3,
    terrain: 'forest', combatPower: 460, basePop: 50, maxPop: 85, reproPerSeason: 9, element: 'WOOD',
    descTh: 'อสูรพิษร้อยขาที่ซ่อนตัวอยู่ใต้บึงหมอกและเหมืองร้าง เปลือกนอกแข็งดั่งเหล็กและพ่นหมอกพิษกัดกร่อนปราณ',
    anatomy: { hasBlood: true, hasHeartGall: false, hasVenom: true, hasHide: false, hasScales: true, hasBoneHorn: false, hasFangClaw: true, hasTendonTail: false, hasFurOrFeather: false, hasCore: true, hasMeatMusk: false },
    partDrops: [
      { matId: 'MAT_BP_CENTIPEDE_VENOM_3', anatomyType: 'VENOM_GLAND' },
      { matId: 'MAT_BP_CENTIPEDE_CARAPACE_3', anatomyType: 'SCALE_CARAPACE' }
    ]
  },
  {
    id: 'BEAST_DREAM_MOTH', nameTh: 'ผีเสื้อวิญญาณทอฝัน', tier: 3, maxDropSlots: 3,
    terrain: 'forest', combatPower: 440, basePop: 46, maxPop: 78, reproPerSeason: 8, element: 'WIND',
    descTh: 'อสูรวิญญาณที่ดูดซับกลิ่นกล้วยไม้หมอกและคลื่นอารมณ์ผู้คน ปีกของมันสะท้อนภาพมายาเจ็ดอารมณ์',
    anatomy: { hasBlood: false, hasHeartGall: false, hasVenom: true, hasHide: false, hasScales: false, hasBoneHorn: false, hasFangClaw: false, hasTendonTail: false, hasFurOrFeather: true, hasCore: true, hasMeatMusk: true },
    partDrops: [
      { matId: 'MAT_BP_DREAM_MOTH_WING_3', anatomyType: 'SPIRIT_HAIR_FEATHER' },
      { matId: 'MAT_BP_DREAM_MOTH_CORE_3', anatomyType: 'BEAST_CORE' }
    ]
  },
  {
    id: 'BEAST_THUNDER_FLOOD_DRAKE', nameTh: 'เจียวหลงสายฟ้าคำราม', tier: 4, maxDropSlots: 3,
    terrain: 'mountain', combatPower: 890, basePop: 18, maxPop: 32, reproPerSeason: 3, element: 'LIGHTNING',
    descTh: 'งูยักษ์โบราณที่บำเพ็ญตบะจนใกล้กลายร่างเป็นมังกรวารี มีเขาอัสนีบนศีรษะและเรียกสายฟ้าฟาดศัตรูได้',
    anatomy: { hasBlood: true, hasHeartGall: true, hasVenom: false, hasHide: true, hasScales: true, hasBoneHorn: true, hasFangClaw: true, hasTendonTail: true, hasFurOrFeather: false, hasCore: true, hasMeatMusk: true },
    partDrops: [
      { matId: 'MAT_BP_THUNDER_DRAKE_SCALE_4', anatomyType: 'SCALE_CARAPACE' },
      { matId: 'MAT_BP_THUNDER_DRAKE_HORN_4', anatomyType: 'BONE_HORN' },
      { matId: 'MAT_BP_THUNDER_DRAKE_BLOOD_4', anatomyType: 'BLOOD' }
    ]
  },
  {
    id: 'BEAST_ABYSS_BLOOD_FIEND', nameTh: 'อสูรพยัคฆ์โลหิตอเวจี', tier: 4, maxDropSlots: 3,
    terrain: 'mountain', combatPower: 920, basePop: 16, maxPop: 28, reproPerSeason: 3, element: 'FIRE',
    descTh: 'พยัคฆ์อสูรที่กลืนกินปราณโลหิตและแร่อุกกาบาตในสมรภูมิโบราณ ดุดันและสูบพลังชีวิตศัตรูทุกครั้งที่ขย้ำ',
    anatomy: { hasBlood: true, hasHeartGall: true, hasVenom: false, hasHide: true, hasScales: false, hasBoneHorn: true, hasFangClaw: true, hasTendonTail: true, hasFurOrFeather: true, hasCore: true, hasMeatMusk: true },
    partDrops: [
      { matId: 'MAT_BP_ABYSS_FIEND_HEART_4', anatomyType: 'HEART_GALL' },
      { matId: 'MAT_BP_ABYSS_FIEND_FANG_4', anatomyType: 'FANG_CLAW' }
    ]
  },
  {
    id: 'BEAST_CELESTIAL_CRANE', nameTh: 'กระเรียนสวรรค์เก้าห้วง', tier: 4, maxDropSlots: 3,
    terrain: 'mountain', combatPower: 850, basePop: 15, maxPop: 26, reproPerSeason: 3, element: 'WIND',
    descTh: 'วิหคเซียนมงคลที่โบยบินเหนือเมฆาเก้าชั้น ขนปีกและแก่นปราณของมันเป็นสุดยอดวัตถุดิบสายเซียนและจิตวิญญาณ',
    anatomy: { hasBlood: true, hasHeartGall: true, hasVenom: false, hasHide: false, hasScales: false, hasBoneHorn: true, hasFangClaw: true, hasTendonTail: false, hasFurOrFeather: true, hasCore: true, hasMeatMusk: true },
    partDrops: [
      { matId: 'MAT_BP_CELESTIAL_CRANE_PLUME_4', anatomyType: 'SPIRIT_HAIR_FEATHER' },
      { matId: 'MAT_BP_CELESTIAL_CRANE_CORE_4', anatomyType: 'BEAST_CORE' }
    ]
  }
];

const BEAST_VARIANTS_V114 = [
  { id: 'NORMAL', prefixTh: '', weight: 68, hpMult: 1.0, powerMult: 1.0, extraDropCount: 0, bonusStones: 0 },
  { id: 'ALPHA', prefixTh: 'จ่าฝูง·', weight: 16, hpMult: 1.28, powerMult: 1.20, extraDropCount: 1, bonusStones: 15, badgeTh: '👑 จ่าฝูงปราณแกร่ง' },
  { id: 'BLOOD_MUTATED', prefixTh: 'โลหิตคลั่ง·', weight: 9, hpMult: 1.22, powerMult: 1.28, extraDropCount: 1, bonusStones: 20, badgeTh: '🩸 กลายพันธุ์โลหิตคลั่ง', bonusPool: 'BLOOD_ESSENCE' },
  { id: 'SPIRIT_BLESSED', prefixTh: 'อาบปราณฟ้า·', weight: 7, hpMult: 1.25, powerMult: 1.15, extraDropCount: 1, bonusStones: 28, badgeTh: '✨ อาบปราณฟ้าดิน', bonusPool: 'SPIRIT_ESSENCE' }
];

const HABITAT_POOLS_V114 = {
  'wolf-forest': ['BEAST_MIST_WOLF', 'BEAST_SHADOW_PANTHER'],
  'iron-ridge': ['BEAST_IRON_BOAR', 'BEAST_MIST_WOLF', 'BEAST_IRON_CENTIPEDE'],
  'jade-marsh': ['BEAST_IRON_BOAR', 'BEAST_EMERALD_PYTHON', 'BEAST_IRON_CENTIPEDE', 'BEAST_DREAM_MOTH'],
  'cloud-bamboo': ['BEAST_CLOUD_FOX', 'BEAST_CLOUD_ANTLER_DEER', 'BEAST_SHADOW_PANTHER', 'BEAST_DREAM_MOTH'],
  'jade-tide': ['BEAST_JADE_TIDE_TURTLE', 'BEAST_CLOUD_ANTLER_DEER', 'BEAST_THUNDER_FLOOD_DRAKE'],
  'ashen-roost': ['BEAST_ASHEN_CROW', 'BEAST_CLOUD_FOX', 'BEAST_ABYSS_BLOOD_FIEND'],
  'crystal-cave': ['BEAST_CRYSTALBACK_APE', 'BEAST_IRON_BOAR', 'BEAST_ABYSS_BLOOD_FIEND'],
  'frost-ridge': ['BEAST_FROST_MOON_LYNX', 'BEAST_FROST_BEAR', 'BEAST_THUNDER_FLOOD_DRAKE', 'BEAST_CELESTIAL_CRANE'],
  'sect-sanctuary': ['BEAST_CLOUD_QILIN_CALF', 'BEAST_CLOUD_ANTLER_DEER', 'BEAST_CELESTIAL_CRANE', 'BEAST_DREAM_MOTH']
};

const RECIPES_V114 = [
  // 1-5: Path-Specific Weapons (Tiers 3-5)
  {
    id: 'REC1140_WEP_SHADOW_MOON_DAGGER', nameTh: 'ตำรับหลอมกริชคู่เงาจันทร์ไร้เสียง',
    craftPath: 'FORGING', tier: 3, minMastery: 44, durationDays: 28,
    inputs: [
      { matId: 'MAT_ORE_NETHER_OBSIDIAN_3', count: 2 },
      { matId: 'MAT_BP_SHADOW_PANTHER_CLAW_3', count: 2 },
      { matId: 'MAT_BP_SHADOW_TENDON_3', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'WEAPON', weaponType: 'DAGGER',
    outputNameTh: 'กริชคู่เงาจันทร์ไร้เสียง', compatiblePath: 'DEMON', element: 'YIN',
    effect: { combatMult: 0.16, defenseMult: 0.04, minStageReq: 2 },
    descTh: 'กริชคู่สีดำสนิทที่ดูดกลืนแสงจันทร์ เพิ่มความเร็วและอานุภาพสังหารฉับพลันของวิถีมารอสูร'
  },
  {
    id: 'REC1140_WEP_SOUL_MIRROR_ZITHER', nameTh: 'ตำรับสร้างพิณกระจกจิตเจ็ดสาย',
    craftPath: 'FORGING', tier: 3, minMastery: 45, durationDays: 30,
    inputs: [
      { matId: 'MAT_ORE_MIND_CRYSTAL_3', count: 2 },
      { matId: 'MAT_BP_SHADOW_TENDON_3', count: 2 },
      { matId: 'MAT_BP_DREAM_MOTH_CORE_3', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'WEAPON', weaponType: 'ZITHER',
    outputNameTh: 'พิณกระจกจิตเจ็ดสาย', compatiblePath: 'HEART_SOUL', element: 'WIND',
    effect: { combatMult: 0.15, defenseMult: 0.06, craftBonusPath: 'ALCHEMY', craftBonusScore: 6, minStageReq: 2 },
    descTh: 'พิณวิญญาณที่ขึงด้วยเส้นเอ็นไร้เสียงและแก่นผีเสื้อมายา ส่งคลื่นเสียงสั่นคลอนทะเลจิตศัตรูโดยตรง'
  },
  {
    id: 'REC1140_WEP_STARFALL_GREATSWORD', nameTh: 'ตำรับตีกระบี่ยักษ์เหล็กไหลดาราตก',
    craftPath: 'FORGING', tier: 4, minMastery: 58, durationDays: 38,
    inputs: [
      { matId: 'MAT_ORE_STARFALL_METEOR_4', count: 2 },
      { matId: 'MAT_LIQ_EARTH_MARROW_4', count: 1 },
      { matId: 'MAT_BP_ABYSS_FIEND_FANG_4', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'WEAPON', weaponType: 'SWORD',
    outputNameTh: 'กระบี่ยักษ์เหล็กไหลดาราตก', compatiblePath: 'BODY', element: 'EARTH',
    effect: { combatMult: 0.21, defenseMult: 0.06, minStageReq: 3 },
    descTh: 'กระบี่เหล็กไหลหนักหมื่นชั่งที่ชุบด้วยไขกระดูกปฐพี ทุกครั้งที่ฟาดฟันจะปลดปล่อยคลื่นแรงโน้มถ่วงดารา'
  },
  {
    id: 'REC1140_WEP_THUNDER_DRAKE_HALBERD', nameTh: 'ตำรับหลอมทวนมังกรสายฟ้าพิพากษา',
    craftPath: 'FORGING', tier: 4, minMastery: 60, durationDays: 40,
    inputs: [
      { matId: 'MAT_ORE_THUNDER_IRON_4', count: 2 },
      { matId: 'MAT_BP_THUNDER_DRAKE_HORN_4', count: 1 },
      { matId: 'MAT_BP_THUNDER_DRAKE_BLOOD_4', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'WEAPON', weaponType: 'SPEAR',
    outputNameTh: 'ทวนมังกรสายฟ้าพิพากษา', compatiblePath: 'GOD', element: 'LIGHTNING',
    effect: { combatMult: 0.22, defenseMult: 0.05, escortSafetyBonus: 0.08, minStageReq: 3 },
    descTh: 'ทวนศึกที่หลอมรวมเขาและโลหิตของเจียวหลงสายฟ้า เรียกอสนีบาตสวรรค์ฟาดผ่าเกราะศัตรู'
  },
  {
    id: 'REC1140_WEP_CELESTIAL_CRANE_SWORD', nameTh: 'ตำรับหลอมกระบี่ขนนกกระเรียนสวรรค์เก้าห้วง',
    craftPath: 'FORGING', tier: 5, minMastery: 70, durationDays: 46,
    inputs: [
      { matId: 'MAT_ORE_DIVINE_GOLD_5', count: 1 },
      { matId: 'MAT_BP_CELESTIAL_CRANE_PLUME_4', count: 2 },
      { matId: 'MAT_BP_CELESTIAL_CRANE_CORE_4', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'WEAPON', weaponType: 'SWORD',
    outputNameTh: 'กระบี่ขนนกกระเรียนสวรรค์เก้าห้วง', compatiblePath: 'XIAN', element: 'WIND',
    effect: { combatMult: 0.26, defenseMult: 0.08, minStageReq: 4 },
    descTh: 'สุดยอดกระบี่เซียนที่ตีจากทองคำสุริยันและขนปีกกระเรียนสวรรค์ เบาดั่งขนนกแต่ตัดผ่านทุกสรรพสิ่ง'
  },

  // 6-9: Path-Specific Armors & Robes (Tiers 3-5)
  {
    id: 'REC1140_ARM_CENTIPEDE_CARAPACE', nameTh: 'ตำรับตีเกราะเกล็ดตะขาบพิษทมิฬ',
    craftPath: 'FORGING', tier: 3, minMastery: 44, durationDays: 28,
    inputs: [
      { matId: 'MAT_BP_CENTIPEDE_CARAPACE_3', count: 2 },
      { matId: 'MAT_BP_CENTIPEDE_VENOM_3', count: 1 },
      { matId: 'MAT_BP_SHADOW_PANTHER_PELT_3', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'ARMOR', weaponType: 'ARMOR',
    outputNameTh: 'เกราะเกล็ดตะขาบพิษทมิฬ', compatiblePath: 'DEMON', element: 'WOOD',
    effect: { combatMult: 0.05, defenseMult: 0.155, minStageReq: 2 },
    descTh: 'เกราะเบาหุ้มเปลือกตะขาบทมิฬและหนังเสือดำเงา ต้านทานพิษและแผ่ไอพิษกัดกร่อนผู้ที่โจมตีระยะประชิด'
  },
  {
    id: 'REC1140_ARM_DREAM_MOTH_ROBE', nameTh: 'ตำรับทออาภรณ์ปีกผีเสื้อมายาฝัน',
    craftPath: 'FORGING', tier: 3, minMastery: 45, durationDays: 28,
    inputs: [
      { matId: 'MAT_BP_DREAM_MOTH_WING_3', count: 2 },
      { matId: 'MAT_LIQ_MOON_DEW_3', count: 1 },
      { matId: 'MAT_HERB_SOUL_LOTUS_3', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'ARMOR', weaponType: 'ROBE',
    outputNameTh: 'อาภรณ์ปีกผีเสื้อมายาฝัน', compatiblePath: 'HEART_SOUL', element: 'WIND',
    effect: { combatMult: 0.055, defenseMult: 0.15, minStageReq: 2 },
    descTh: 'อาภรณ์ไหมวิญญาณที่ทอจากปีกละอองฝันและน้ำอมฤตจันทรา สร้างภาพติดตาหลอกล่อคมอาวุธศัตรู'
  },
  {
    id: 'REC1140_ARM_THUNDER_DRAKE_MAIL', nameTh: 'ตำรับหลอมเกราะเกล็ดเจียวหลงสายฟ้า',
    craftPath: 'FORGING', tier: 4, minMastery: 58, durationDays: 38,
    inputs: [
      { matId: 'MAT_BP_THUNDER_DRAKE_SCALE_4', count: 2 },
      { matId: 'MAT_ORE_STARFALL_METEOR_4', count: 1 },
      { matId: 'MAT_LIQ_EARTH_MARROW_4', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'ARMOR', weaponType: 'ARMOR',
    outputNameTh: 'เกราะเกล็ดเจียวหลงสายฟ้า', compatiblePath: 'BODY', element: 'LIGHTNING',
    effect: { combatMult: 0.065, defenseMult: 0.205, minStageReq: 3 },
    descTh: 'เกราะหนักที่ผสานเกล็ดเจียวหลงสายฟ้าเข้ากับแร่อุกกาบาตดารา ทนทานต่อทั้งศึกหนักและสายฟ้าทัณฑ์สวรรค์'
  },
  {
    id: 'REC1140_ARM_BODHI_GOLD_KASAYA', nameTh: 'ตำรับทอจีวรทองคำโพธิญาณคุ้มภพ',
    craftPath: 'FORGING', tier: 5, minMastery: 68, durationDays: 44,
    inputs: [
      { matId: 'MAT_HERB_BODHI_LEAF_5', count: 1 },
      { matId: 'MAT_ORE_DIVINE_GOLD_5', count: 1 },
      { matId: 'MAT_BP_THUNDER_DRAKE_SCALE_4', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'ARMOR', weaponType: 'ROBE',
    outputNameTh: 'จีวรทองคำโพธิญาณคุ้มภพ', compatiblePath: 'GOD', element: 'FIRE',
    effect: { combatMult: 0.075, defenseMult: 0.245, escortSafetyBonus: 0.12, minStageReq: 4 },
    descTh: 'อาภรณ์ศักดิ์สิทธิ์ที่ถักทอจากเส้นไหมทองคำสุริยันและใบโพธิ์บรรพกาล กางฉัตรรัศมีโพธิญาณคุ้มครองผู้สวมใส่'
  },

  // 10-12: Talisman Vessels & Sacred Implements (Tiers 4-5)
  {
    id: 'REC1140_TAL_NETHER_GU_GOURD', nameTh: 'ตำรับหลอมน้ำเต้าหยกทมิฬเลี้ยงกู่',
    craftPath: 'FORGING', tier: 4, minMastery: 56, durationDays: 36,
    inputs: [
      { matId: 'MAT_VEN_CENTIPEDE_GU_4', count: 1 },
      { matId: 'MAT_BP_ABYSS_FIEND_HEART_4', count: 1 },
      { matId: 'MAT_HERB_NETHER_MUSHROOM_3', count: 2 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'TALISMAN_VESSEL', weaponType: 'GOURD',
    outputNameTh: 'น้ำเต้าหยกทมิฬเลี้ยงกู่', compatiblePath: 'DEMON', element: 'YIN',
    effect: { combatMult: 0.115, defenseMult: 0.085, craftBonusPath: 'ALCHEMY', craftBonusScore: 10, minStageReq: 3 },
    descTh: 'น้ำเต้าวิเศษที่หล่อเลี้ยงพิษตะขาบเจ็ดสีและปราณโลหิตอเวจี ปลดปล่อยหมอกพิษสูบปราณศัตรูในการรบ'
  },
  {
    id: 'REC1140_TAL_MIND_CRYSTAL_BRUSH', nameTh: 'ตำรับสร้างพู่กันผลึกกระจกจิตอักษรสวรรค์',
    craftPath: 'FORGING', tier: 4, minMastery: 56, durationDays: 36,
    inputs: [
      { matId: 'MAT_ORE_MIND_CRYSTAL_3', count: 2 },
      { matId: 'MAT_TAL_VERMILION_INK_3', count: 2 },
      { matId: 'MAT_BP_CELESTIAL_CRANE_PLUME_4', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'TALISMAN_VESSEL', weaponType: 'BRUSH',
    outputNameTh: 'พู่กันผลึกกระจกจิตอักษรสวรรค์', compatiblePath: 'HEART_SOUL', element: 'WIND',
    effect: { combatMult: 0.105, defenseMult: 0.10, craftBonusPath: 'TALISMAN', craftBonusScore: 12, minStageReq: 3 },
    descTh: 'พู่กันหยกที่ทำจากผลึกกระจกจิตและขนกระเรียนสวรรค์ ช่วยให้จารึกค่ายกลและตีความคัมภีร์ได้รวดเร็วยิ่งขึ้น'
  },
  {
    id: 'REC1140_TAL_CHAOS_VOID_MIRROR', nameTh: 'ตำรับหลอมกระจกหยกสุญตาโกลาหล',
    craftPath: 'FORGING', tier: 5, minMastery: 72, durationDays: 48,
    inputs: [
      { matId: 'MAT_ORE_CHAOS_VOID_JADE_6', count: 1 },
      { matId: 'MAT_ORE_DIVINE_GOLD_5', count: 1 },
      { matId: 'MAT_BP_CELESTIAL_CRANE_CORE_4', count: 1 }
    ],
    outputType: 'EQUIPMENT', outputSubSlot: 'TALISMAN_VESSEL', weaponType: 'SHIELD',
    outputNameTh: 'กระจกหยกสุญตาโกลาหล', compatiblePath: 'ANY', element: 'NEUTRAL', isTranscendent: true,
    effect: { combatMult: 0.145, defenseMult: 0.16, escortSafetyBonus: 0.15, minStageReq: 4 },
    descTh: 'สมบัติวิเศษที่หลอมจากหยกสุญตาปฐมกาล สะท้อนกระบวนท่าโจมตีและคุ้มครองดวงจิตผู้ถือครองจากภัยพิบัติทั้งปวง'
  },

  // 13-16: High-Depth Pills & Beast Lure Incense (Tiers 3-5)
  {
    id: 'REC1140_ALC_SOUL_LOTUS_ELIXIR', nameTh: 'ตำรับโอสถบัววิญญาณเจ็ดสีชำระจิต',
    craftPath: 'ALCHEMY', tier: 3, minMastery: 45, durationDays: 26,
    inputs: [
      { matId: 'MAT_HERB_SOUL_LOTUS_3', count: 2 },
      { matId: 'MAT_LIQ_MOON_DEW_3', count: 1 },
      { matId: 'MAT_BP_DREAM_MOTH_CORE_3', count: 1 }
    ],
    outputType: 'PILL', outputSubSlot: null,
    outputNameTh: 'โอสถบัววิญญาณเจ็ดสีชำระจิต',
    effect: { clearHeartDemon: 30, heartDemonRelief: 30, clearPoison: 24, toxicityRelief: 24, cultivationProgress: 14, healHealth: 20, toxicity: 2 },
    descTh: 'โอสถทิพย์สายวิถีจิตที่ผสานบัววิญญาณเจ็ดสีกับน้ำอมฤตจันทรา ชำระล้างจิตมารและพิษโอสถสะสมได้อย่างล้ำลึก'
  },
  {
    id: 'REC1140_ALC_DRAGON_BLOOD_METEOR_PILL', nameTh: 'ตำรับโอสถโลหิตมังกรดาราหลอมกาย',
    craftPath: 'ALCHEMY', tier: 4, minMastery: 58, durationDays: 36,
    inputs: [
      { matId: 'MAT_HERB_STARLIGHT_GRASS_4', count: 2 },
      { matId: 'MAT_BP_THUNDER_DRAKE_BLOOD_4', count: 1 },
      { matId: 'MAT_BP_ABYSS_FIEND_HEART_4', count: 1 }
    ],
    outputType: 'PILL', outputSubSlot: null,
    outputNameTh: 'โอสถโลหิตมังกรดาราหลอมกาย',
    effect: { healHealth: 55, healInjury: 40, cultivationProgress: 20, restoreQi: 35, toxicity: 4 },
    descTh: 'โอสถหลอมกายาและโลหิตระดับสูง ฟื้นฟูอาการบาดเจ็บสาหัสและเพิ่มพูนตบะอย่างก้าวกระโดด'
  },
  {
    id: 'REC1140_ALC_IMMORTAL_PEACH_BODHI_PILL', nameTh: 'ตำรับมหาโอสถท้อเซียนโพธิญาณทะลวงด่าน',
    craftPath: 'ALCHEMY', tier: 5, minMastery: 72, durationDays: 46,
    inputs: [
      { matId: 'MAT_HERB_IMMORTAL_PEACH_6', count: 1 },
      { matId: 'MAT_HERB_BODHI_LEAF_5', count: 1 },
      { matId: 'MAT_BP_CELESTIAL_CRANE_CORE_4', count: 1 }
    ],
    outputType: 'PILL', outputSubSlot: null, isTranscendent: true,
    outputNameTh: 'มหาโอสถท้อเซียนโพธิญาณ',
    effect: { cultivationProgress: 34, restoreQi: 65, healHealth: 80, clearHeartDemon: 40, heartDemonRelief: 40, toxicityRelief: 30, lifespanBonusYears: 25, toxicity: 1 },
    descTh: 'มหาโอสถระดับตำนานที่หลอมจากผลท้อเซียนเก้าวัฏจักรและใบโพธิ์ทองคำ ช่วยทะลวงคอขวดและเพิ่มอายุขัยผู้ฝึกตน'
  },
  {
    id: 'REC1140_BST_SPIRIT_BEAST_INCENSE', nameTh: 'ตำรับกำยานโลหิตมังกรล่ออสูรบรรพกาล',
    craftPath: 'ALCHEMY', tier: 3, minMastery: 40, durationDays: 22,
    inputs: [
      { matId: 'MAT_HERB_NETHER_MUSHROOM_3', count: 1 },
      { matId: 'MAT_BP_THUNDER_DRAKE_BLOOD_4', count: 1 },
      { matId: 'MAT_TAL_VERMILION_INK_3', count: 1 }
    ],
    outputType: 'BEAST_ITEM', outputSubSlot: null,
    outputNameTh: 'กำยานโลหิตมังกรล่ออสูรบรรพกาล',
    effect: { trustGain: 28, lureRareBeast: true, spawnAlphaChance: 0.65, healCompanion: 45 },
    descTh: 'กำยานหอมล้ำค่าที่ใช้จุดเพื่อดึงดูดสัตว์อสูรหายากและจ่าฝูงกลายพันธุ์ออกมาปรากฏตัว หรือใช้เพิ่มความไว้ใจให้อสูรคู่หู'
  }
];

addUnique(D.MATERIALS_REGISTRY_V140, MATERIALS_V114);
addUnique(D.BEAST_SPECIES_V140, BEASTS_V114);
addUnique(D.STARTER_RECIPES_V140, RECIPES_V114);

// ============================================================================
// EQUIPMENT AFFIXES (RUNES), WEAPON SPIRITS & SET RESONANCE POOLS (V1.14)
// ============================================================================
const EQUIPMENT_AFFIX_POOL_V114 = [
  { id: 'RUNE_SWORD_GALE', nameTh: 'อักขระคมวายุทะลวงเมฆ (+พลังรบ 3.5%)', path: 'XIAN', element: 'WIND', combatBonus: 0.035, defenseBonus: 0.01 },
  { id: 'RUNE_FROST_MIRROR', nameTh: 'อักขระกระจกเหมันต์สะท้อนจันทร์ (+ป้องกัน 4%)', path: 'XIAN', element: 'WATER', combatBonus: 0.01, defenseBonus: 0.04 },
  { id: 'RUNE_STAR_GRAVITY', nameTh: 'อักขระดาราหนักหมื่นชั่ง (+พลังรบ 4% · กดทับ)', path: 'BODY', element: 'EARTH', combatBonus: 0.04, defenseBonus: 0.02 },
  { id: 'RUNE_WOOD_VITALITY', nameTh: 'อักขระพฤกษาอมตะสมานกาย (+ป้องกัน 4.5%)', path: 'BODY', element: 'WOOD', combatBonus: 0.01, defenseBonus: 0.045 },
  { id: 'RUNE_THUNDER_DECREE', nameTh: 'อักขระอาญาสิทธิ์สายฟ้าสวรรค์ (+พลังรบ 4.5%)', path: 'GOD', element: 'LIGHTNING', combatBonus: 0.045, defenseBonus: 0.01 },
  { id: 'RUNE_BODHI_SANCTUARY', nameTh: 'อักขระรัศมีโพธิญาณคุ้มจิต (+ป้องกัน 4.5%)', path: 'GOD', element: 'FIRE', combatBonus: 0.015, defenseBonus: 0.045 },
  { id: 'RUNE_SHADOW_EXECUTION', nameTh: 'อักขระเร้นเงาปลิดวิญญาณ (+พลังรบ 5%)', path: 'DEMON', element: 'YIN', combatBonus: 0.05, defenseBonus: 0.0 },
  { id: 'RUNE_ABYSS_SIPHON', nameTh: 'อักขระวังวนมารสูบโลหิต (+พลังรบ 3.5% · สูบปราณ)', path: 'DEMON', element: 'FIRE', combatBonus: 0.035, defenseBonus: 0.015 },
  { id: 'RUNE_ZEN_VOID', nameTh: 'อักขระสุญตากระจกใจไร้ฝุ่น (+ป้องกัน 5%)', path: 'HEART_SOUL', element: 'WATER', combatBonus: 0.01, defenseBonus: 0.05 },
  { id: 'RUNE_MIND_TELEKINESIS', nameTh: 'อักขระกระบี่จิตทะลวงเนตร (+พลังรบ 4% · เสริมศึกษา)', path: 'HEART_SOUL', element: 'WIND', combatBonus: 0.04, defenseBonus: 0.015, studyBonus: 0.05 }
];

const WEAPON_SPIRITS_V114 = [
  { id: 'SPIRIT_AZURE_CRANE', nameTh: 'จิตวิหคกระเรียนสวรรค์เมฆาคราม', path: 'XIAN', element: 'WIND', bonusMult: 0.05 },
  { id: 'SPIRIT_STAR_TITAN', nameTh: 'จิตอสูรยักษ์แบกดาราบรรพกาล', path: 'BODY', element: 'EARTH', bonusMult: 0.05 },
  { id: 'SPIRIT_THUNDER_DRAGON', nameTh: 'จิตมังกรสายฟ้าพิทักษ์สวรรค์', path: 'GOD', element: 'LIGHTNING', bonusMult: 0.055 },
  { id: 'SPIRIT_BLOOD_ASURA', nameTh: 'จิตมารอสูรโลหิตกลืนภพ', path: 'DEMON', element: 'YIN', bonusMult: 0.055 },
  { id: 'SPIRIT_BODHI_LOTUS', nameTh: 'จิตภูตบัวแก้วกระจกเซน', path: 'HEART_SOUL', element: 'WATER', bonusMult: 0.05 }
];

const EQUIPMENT_SETS_V114 = [
  {
    id: 'SET_XIAN_CRANE_CLOUD',
    nameTh: 'ชุดเซียนกระเรียนเมฆาเก้าห้วง',
    path: 'XIAN',
    bonusCombatPct: 12,
    bonusDefensePct: 10,
    descTh: 'เมื่อสวมใส่อุปกรณ์สายเซียนหรือยุทธภัณฑ์กระเรียนเมฆาครบชุด ปราณวายุและเหมันต์จะหมุนเวียนหนุนเนื่องกันโดยไร้รอยต่อ'
  },
  {
    id: 'SET_BODY_STARFALL_DRAKE',
    nameTh: 'ชุดราชันย์กายาดาราอัสนี',
    path: 'BODY',
    bonusCombatPct: 14,
    bonusDefensePct: 12,
    descTh: 'เมื่อสวมใส่ศาสตราและเกราะหลอมกายาครบชุด โครงกระดูกและโลหิตจะสั่นพ้องกับแรงโน้มถ่วงดารา'
  },
  {
    id: 'SET_GOD_BODHI_THUNDER',
    nameTh: 'ชุดเทวทัณฑ์โพธิญาณสุริยัน',
    path: 'GOD',
    bonusCombatPct: 13,
    bonusDefensePct: 13,
    descTh: 'ผสานอำนาจสายฟ้าพิพากษาเข้ากับรัศมีโพธิญาณคุ้มภพ เสริมทั้งอานุภาพทำลายมารและเกราะคุ้มกัน'
  },
  {
    id: 'SET_DEMON_SHADOW_ABYSS',
    nameTh: 'ชุดมารเงาอเวจีกลืนวิญญาณ',
    path: 'DEMON',
    bonusCombatPct: 16,
    bonusDefensePct: 8,
    descTh: 'เร่งเร้าไอสังหารและพิษกู่อเวจีถึงขีดสุด เพิ่มพลังโจมตีและการสูบปราณศัตรูในการศึก'
  },
  {
    id: 'SET_SOUL_MIRROR_DREAM',
    nameTh: 'ชุดปราชญ์กระจกจิตมายาฝัน',
    path: 'HEART_SOUL',
    bonusCombatPct: 11,
    bonusDefensePct: 14,
    descTh: 'ถักทอคลื่นพลังจิตและม่านกระจกเซนคุ้มครองทะเลสำนึก สะท้อนการโจมตีและเร่งความเข้าใจคัมภีร์'
  }
];

function canEquipItemV116(n, item, opts = {}) {
  if (!n?.jianghu || !item || typeof item !== 'object') {
    return { ok: false, code: 'INVALID_TARGET_OR_ITEM', reason: 'ข้อมูลผู้สวมใส่หรือศาสตราไม่สมบูรณ์' };
  }
  const j = n.jianghu;
  const validSlots = ['WEAPON', 'ARMOR', 'TALISMAN_VESSEL'];
  if (!validSlots.includes(item.slot)) {
    return { ok: false, code: 'INVALID_SLOT', reason: 'ช่องสวมใส่อุปกรณ์ไม่ถูกต้อง' };
  }
  if (!opts.ignoreOwnership) {
    const owned = (j.ledgerV140?.equipmentItems || []).some(x => x.id === item.id);
    if (!owned) return { ok: false, code: 'NOT_IN_INVENTORY', reason: 'ศาสตราไม่ได้อยู่ในสัมภาระของผู้สวมใส่' };
  }
  if (Number(item.durability ?? 100) <= 0) {
    return { ok: false, code: 'BROKEN_EQUIPMENT', reason: `${item.nameTh || 'ศาสตรา'} เสียหายจนใช้งานไม่ได้ ต้องซ่อมแซมก่อน` };
  }
  if (item.compatiblePath && item.compatiblePath !== 'ANY' && item.compatiblePath !== j.path) {
    const pathName = E.CULTIVATION_PATHS?.[item.compatiblePath]?.shortTh || item.compatiblePath;
    return { ok: false, code: 'INCOMPATIBLE_PATH', reason: `${item.nameTh || 'ศาสตรา'} ต้องใช้วิถี${pathName}` };
  }
  const npcBand = Math.max(
    Number(j.realizationBand || 1),
    Number(j.trackOrdinal || j.stage || 1),
    Number(E.getNormalizedStageRankV120?.(n) || 1)
  );
  const explicitMinReq = Number(item.minStageReq || 0);
  const tierDerivedReq = item.tier ? Math.max(1, Math.floor((Number(item.tier) + 1) / 2)) : 1;
  const reqStage = Math.max(1, explicitMinReq || tierDerivedReq);
  if (npcBand + 1e-6 < reqStage) {
    return {
      ok: false,
      code: 'STAGE_TOO_LOW',
      reason: `ตบะขั้นปัจจุบัน (${Math.floor(npcBand)}) ยังไม่ถึงเกณฑ์ขั้นต่ำของ ${item.nameTh || 'ศาสตรา'} (ต้องการขั้น ${reqStage})`,
      requiredStage: reqStage,
      currentStage: Math.floor(npcBand)
    };
  }
  return { ok: true, code: 'ELIGIBLE', requiredStage: reqStage };
}

function imbueEquipmentDepthV114(item, rng = { next: () => Math.random() }) {
  if (!item || typeof item !== 'object') return item;
  const rAffix = drawRngV116(rng);
  const tier = Number(item.tier || 1);
  if (!item.minStageReq) {
    item.minStageReq = Math.max(1, Math.floor((tier + 1) / 2));
  }
  const path = item.compatiblePath && item.compatiblePath !== 'ANY' ? item.compatiblePath : null;
  const candidates = path
    ? EQUIPMENT_AFFIX_POOL_V114.filter(a => a.path === path)
    : EQUIPMENT_AFFIX_POOL_V114;
  const affix = candidates[Math.floor(rAffix * candidates.length) % candidates.length] || EQUIPMENT_AFFIX_POOL_V114[0];
  if (!item.runeNameTh && affix) {
    item.runeId = affix.id;
    item.runeNameTh = affix.nameTh;
    item.element = item.element && item.element !== 'NEUTRAL' ? item.element : affix.element;
    item.combatMult = +(Number(item.combatMult || 0.05) + (affix.combatBonus || 0) * Math.min(1.5, tier * 0.35)).toFixed(3);
    item.defenseMult = +(Number(item.defenseMult || 0.02) + (affix.defenseBonus || 0) * Math.min(1.5, tier * 0.35)).toFixed(3);
    if (affix.studyBonus) item.studyBonus = +(Number(item.studyBonus || 0) + affix.studyBonus).toFixed(3);
  }
  if (tier >= 3 && !item.starLevel) {
    item.starLevel = Math.min(5, Math.max(1, tier - 1));
  }
  if (tier >= 4 && !item.weaponSpirit) {
    const rSpirit = drawRngV116(rng);
    const spPool = path ? WEAPON_SPIRITS_V114.filter(s => s.path === path) : WEAPON_SPIRITS_V114;
    const sp = spPool[Math.floor(rSpirit * spPool.length) % spPool.length] || WEAPON_SPIRITS_V114[0];
    item.weaponSpirit = { id: sp.id, nameTh: sp.nameTh, element: sp.element, bonusMult: sp.bonusMult };
  }
  const affixPath = EQUIPMENT_AFFIX_POOL_V114.find(a=>a.id===item.runeId)?.path;
  const setObj = EQUIPMENT_SETS_V114.find(s => s.path === (path || affixPath));
  if (setObj && !item.setId) {
    item.setId = setObj.id;
    item.setNameTh = setObj.nameTh;
  }
  return item;
}

function computeEquipmentResonanceV114(n) {
  if (!n?.jianghu) return { activePieces: 0, equippedPieces: 0, setActive: false, setNameTh: null, combatMult: 1, defenseMult: 1, studyBonus: 0 };
  const j = n.jianghu;
  const eqMap = j.equipmentV140 || {};
  const list = j.ledgerV140?.equipmentItems || [];
  const equipped = ['WEAPON', 'ARMOR', 'TALISMAN_VESSEL']
    .map(slot => list.find(i => i.id === eqMap[slot]))
    .filter(it => it && canEquipItemV116(n, it).ok);
  let bonusCombat = 0;
  let bonusDefense = 0;
  let studyBonus = 0;
  let runeCount = 0;
  let spiritCount = 0;
  for (const it of equipped) {
    if (it.runeNameTh) {
      runeCount++;
      // Affix bonuses are already baked into the canonical item modifiers.
    }
    if (it.weaponSpirit) {
      spiritCount++;
      bonusCombat += Number(it.weaponSpirit.bonusMult || 0.04);
    }
    if (it.studyBonus) studyBonus += Number(it.studyBonus || 0);
  }
  const setDef = EQUIPMENT_SETS_V114.find(s => s.path === j.path);
  const matchingPieces = setDef ? equipped.filter(it => it.setId === setDef.id).length : 0;
  const setActive = matchingPieces >= 3;
  if (setActive) {
    bonusCombat += (setDef.bonusCombatPct || 12) / 100;
    bonusDefense += (setDef.bonusDefensePct || 10) / 100;
  }
  return {
    activePieces: matchingPieces,
    equippedPieces: equipped.length,
    runeCount,
    spiritCount,
    setActive,
    setNameTh: setActive ? setDef.nameTh : null,
    combatMult: +(1 + bonusCombat).toFixed(3),
    defenseMult: +(1 + bonusDefense).toFixed(3),
    studyBonus: +studyBonus.toFixed(3)
  };
}

// ============================================================================
// MULTI-SYSTEM TREASURE, ENVOY AUCTION & FORTUITOUS LOOT POOLS (V1.14)
// ============================================================================
const ENVOY_AUCTION_POOLS_V114 = {
  CN: [
    { recipeId: 'REC1140_WEP_CELESTIAL_CRANE_SWORD', nameTh: 'กระบี่ขนนกกระเรียนสวรรค์แห่งหลงหยวน', slot: 'WEAPON', tier: 4, compatiblePath: 'XIAN', combatMult: 0.20, defenseMult: 0.07, minimumBid: 42 },
    { recipeId: 'REC330_WEP_AZURE_BAMBOO_SWORDS', nameTh: 'ชุดกระบี่ไผ่เมฆาครามหลงหยวน', slot: 'WEAPON', tier: 4, compatiblePath: 'XIAN', combatMult: 0.18, defenseMult: 0.08, minimumBid: 36 },
    { recipeId: 'REC1110_FRG_QILIN_WARD', nameTh: 'ตราหยกมังกรกิเลนพิทักษ์สำนัก', slot: 'TALISMAN_VESSEL', tier: 3, compatiblePath: 'ANY', combatMult: 0.08, defenseMult: 0.12, minimumBid: 26 }
  ],
  SG: [
    { recipeId: 'REC1140_TAL_MIND_CRYSTAL_BRUSH', nameTh: 'พู่กันผลึกกระจกจิตหอไข่มุกสวรรค์', slot: 'TALISMAN_VESSEL', tier: 4, compatiblePath: 'HEART_SOUL', combatMult: 0.12, defenseMult: 0.11, minimumBid: 38 },
    { recipeId: 'REC1140_ARM_DREAM_MOTH_ROBE', nameTh: 'อาภรณ์ไหมสมุทรมายาฝัน', slot: 'ARMOR', tier: 3, compatiblePath: 'HEART_SOUL', combatMult: 0.06, defenseMult: 0.16, minimumBid: 28 },
    { recipeId: 'REC1140_TAL_CHAOS_VOID_MIRROR', nameTh: 'กระจกหยกไข่มุกสุญตาหนานไห่', slot: 'TALISMAN_VESSEL', tier: 5, compatiblePath: 'ANY', combatMult: 0.15, defenseMult: 0.16, minimumBid: 52 }
  ],
  IN: [
    { recipeId: 'REC1140_ARM_BODHI_GOLD_KASAYA', nameTh: 'จีวรทองคำโพธิญาณสุริยัน', slot: 'ARMOR', tier: 5, compatiblePath: 'GOD', combatMult: 0.08, defenseMult: 0.24, minimumBid: 48 },
    { recipeId: 'REC1140_WEP_THUNDER_DRAKE_HALBERD', nameTh: 'ทวนวัชระอสนีสุริยัน', slot: 'WEAPON', tier: 4, compatiblePath: 'GOD', combatMult: 0.21, defenseMult: 0.06, minimumBid: 38 },
    { recipeId: 'REC1140_WEP_SOUL_MIRROR_ZITHER', nameTh: 'พิณธรรมะกระจกใจเจ็ดสาย', slot: 'WEAPON', tier: 3, compatiblePath: 'HEART_SOUL', combatMult: 0.15, defenseMult: 0.07, minimumBid: 28 }
  ],
  JP: [
    { recipeId: 'REC1140_WEP_STARFALL_GREATSWORD', nameTh: 'ดาบยักษ์เหล็กไหลอัสนีบูรพา', slot: 'WEAPON', tier: 4, compatiblePath: 'BODY', combatMult: 0.22, defenseMult: 0.05, minimumBid: 40 },
    { recipeId: 'REC1140_ARM_THUNDER_DRAKE_MAIL', nameTh: 'เกราะศึกเกล็ดมังกรอัสนีบูรพา', slot: 'ARMOR', tier: 4, compatiblePath: 'BODY', combatMult: 0.07, defenseMult: 0.20, minimumBid: 36 },
    { recipeId: 'REC1110_FRG_ANTLER_SPEAR', nameTh: 'ทวนศึกเขากวางอัสนี', slot: 'WEAPON', tier: 3, compatiblePath: 'ANY', combatMult: 0.14, defenseMult: 0.04, minimumBid: 24 }
  ],
  VN: [
    { recipeId: 'REC1140_TAL_NETHER_GU_GOURD', nameTh: 'น้ำเต้าหยกทมิฬหมื่นพิษ', slot: 'TALISMAN_VESSEL', tier: 4, compatiblePath: 'DEMON', combatMult: 0.13, defenseMult: 0.09, minimumBid: 36 },
    { recipeId: 'REC1140_ARM_CENTIPEDE_CARAPACE', nameTh: 'เกราะเกล็ดตะขาบมรกตหมื่นพิษ', slot: 'ARMOR', tier: 3, compatiblePath: 'DEMON', combatMult: 0.06, defenseMult: 0.16, minimumBid: 26 },
    { recipeId: 'REC1140_WEP_SHADOW_MOON_DAGGER', nameTh: 'กริชคู่อสรพิษเร้นเงา', slot: 'WEAPON', tier: 3, compatiblePath: 'DEMON', combatMult: 0.17, defenseMult: 0.04, minimumBid: 28 }
  ],
  RU: [
    { recipeId: 'REC1110_FRG_FROST_MOON_MANTLE', nameTh: 'เกราะคลุมพยัคฆ์เหมันต์อุดร', slot: 'ARMOR', tier: 4, compatiblePath: 'BODY', combatMult: 0.07, defenseMult: 0.21, minimumBid: 38 },
    { recipeId: 'REC1140_WEP_STARFALL_GREATSWORD', nameTh: 'ศาสตราเหล็กไหลน้ำแข็งโลหิต', slot: 'WEAPON', tier: 4, compatiblePath: 'DEMON', combatMult: 0.21, defenseMult: 0.06, minimumBid: 40 },
    { recipeId: 'REC1140_WEP_SHADOW_MOON_DAGGER', nameTh: 'กริชน้ำแข็งเงาจันทร์อุดร', slot: 'WEAPON', tier: 3, compatiblePath: 'XIAN', combatMult: 0.16, defenseMult: 0.05, minimumBid: 28 }
  ]
};

const EXPEDITION_TREASURE_POOLS_V114 = {
  SITE_SWORD_TOMB: {
    materials: ['MAT_ORE_STARFALL_METEOR_4', 'MAT_ORE_MIND_CRYSTAL_3', 'MAT_TAL_VERMILION_INK_3'],
    equipmentRecipes: ['REC1140_WEP_STARFALL_GREATSWORD', 'REC1140_WEP_CELESTIAL_CRANE_SWORD']
  },
  SITE_KUNLUN_GROTTO: {
    materials: ['MAT_HERB_SOUL_LOTUS_3', 'MAT_LIQ_MOON_DEW_3', 'MAT_HERB_IMMORTAL_PEACH_6', 'MAT_BP_CELESTIAL_CRANE_PLUME_4'],
    equipmentRecipes: ['REC1140_ARM_DREAM_MOTH_ROBE', 'REC1140_TAL_MIND_CRYSTAL_BRUSH']
  },
  SITE_SERPENT_MARSH: {
    materials: ['MAT_VEN_CENTIPEDE_GU_4', 'MAT_HERB_NETHER_MUSHROOM_3', 'MAT_BP_CENTIPEDE_VENOM_3', 'MAT_BP_CENTIPEDE_CARAPACE_3'],
    equipmentRecipes: ['REC1140_ARM_CENTIPEDE_CARAPACE', 'REC1140_TAL_NETHER_GU_GOURD']
  },
  SITE_STAR_PAGODA: {
    materials: ['MAT_HERB_STARLIGHT_GRASS_4', 'MAT_ORE_CHAOS_VOID_JADE_6', 'MAT_ORE_MIND_CRYSTAL_3', 'MAT_BP_DREAM_MOTH_CORE_3'],
    equipmentRecipes: ['REC1140_TAL_CHAOS_VOID_MIRROR', 'REC1140_WEP_SOUL_MIRROR_ZITHER']
  },
  SITE_THUNDER_RUIN: {
    materials: ['MAT_ORE_DIVINE_GOLD_5', 'MAT_HERB_BODHI_LEAF_5', 'MAT_BP_THUNDER_DRAKE_SCALE_4', 'MAT_BP_THUNDER_DRAKE_HORN_4'],
    equipmentRecipes: ['REC1140_WEP_THUNDER_DRAKE_HALBERD', 'REC1140_ARM_THUNDER_DRAKE_MAIL', 'REC1140_ARM_BODHI_GOLD_KASAYA']
  },
  SITE_DEMON_ABYSS: {
    materials: ['MAT_ORE_NETHER_OBSIDIAN_3', 'MAT_BP_ABYSS_FIEND_HEART_4', 'MAT_BP_ABYSS_FIEND_FANG_4', 'MAT_BP_SHADOW_PANTHER_CLAW_3'],
    equipmentRecipes: ['REC1140_WEP_SHADOW_MOON_DAGGER', 'REC1140_TAL_NETHER_GU_GOURD']
  }
};

const FORTUNE_LOOT_POOLS_V114 = {
  QI_SURGE_AND_HEAL: ['MAT_LIQ_MOON_DEW_3', 'MAT_HERB_SOUL_LOTUS_3'],
  ANCIENT_SCROLL: ['MAT_TAL_VERMILION_INK_3', 'MAT_ORE_MIND_CRYSTAL_3'],
  RARE_PILLS_AND_HERBS: ['MAT_HERB_SOUL_LOTUS_3', 'MAT_HERB_STARLIGHT_GRASS_4', 'MAT_HERB_BODHI_LEAF_5'],
  METEOR_ORE_AND_WEAPON: ['MAT_ORE_STARFALL_METEOR_4', 'MAT_LIQ_EARTH_MARROW_4', 'MAT_ORE_DIVINE_GOLD_5'],
  COMBAT_RELIC_AND_STONES: ['MAT_ORE_NETHER_OBSIDIAN_3', 'MAT_BP_ABYSS_FIEND_FANG_4', 'MAT_BP_THUNDER_DRAKE_HORN_4'],
  ZEN_SCROLL_ENLIGHTENMENT: ['MAT_HERB_SOUL_LOTUS_3', 'MAT_ORE_MIND_CRYSTAL_3', 'MAT_BP_DREAM_MOTH_WING_3'],
  DEMON_ABYSS_SCRIPTURE: ['MAT_HERB_NETHER_MUSHROOM_3', 'MAT_VEN_CENTIPEDE_GU_4', 'MAT_ORE_NETHER_OBSIDIAN_3'],
  CELESTIAL_EDICT_SCROLL: ['MAT_HERB_BODHI_LEAF_5', 'MAT_ORE_DIVINE_GOLD_5', 'MAT_BP_CELESTIAL_CRANE_CORE_4']
};

function rollEnvoyAuctionItemV114(factionId, seqId, rng = { next: () => Math.random() }) {
  const pool = ENVOY_AUCTION_POOLS_V114[factionId] || ENVOY_AUCTION_POOLS_V114.CN;
  const rPick = drawRngV116(rng);
  const tpl = pool[Math.floor(rPick * pool.length) % pool.length] || pool[0];
  const tier = tpl.tier || 3;
  const item = {
    id: 'regional-item-' + seqId,
    catalogId: tpl.recipeId,
    recipeId: tpl.recipeId,
    nameTh: tpl.nameTh,
    slot: tpl.slot,
    tier,
    minStageReq: Math.max(1, Math.floor((tier + 1) / 2)),
    quality: tier >= 4 ? 'MASTERWORK' : 'REFINED',
    durability: 100,
    maxDurability: 100,
    combatMult: tpl.combatMult,
    defenseMult: tpl.defenseMult,
    compatiblePath: tpl.compatiblePath || 'ANY',
    originType: 'REGIONAL_WORKSHOP',
    originLabelTh: 'หอศาสตราพันธมิตร · ' + factionId,
    minimumBid: tpl.minimumBid || 24
  };
  return imbueEquipmentDepthV114(item, rng);
}

function rollExpeditionTreasureV114(siteId, rng = { next: () => Math.random() }) {
  const pool = EXPEDITION_TREASURE_POOLS_V114[siteId] || EXPEDITION_TREASURE_POOLS_V114.SITE_SWORD_TOMB;
  const rMat = drawRngV116(rng);
  const rQty = drawRngV116(rng);
  const rRec = drawRngV116(rng);
  const matId = pool.materials[Math.floor(rMat * pool.materials.length) % pool.materials.length];
  const count = rQty < 0.35 ? 2 : 1;
  const equipmentRecipeId = pool.equipmentRecipes[Math.floor(rRec * pool.equipmentRecipes.length) % pool.equipmentRecipes.length];
  return { matId, count, equipmentRecipeId };
}

function rollFortuneBonusMaterialV114(kind, rng = { next: () => Math.random() }) {
  const pool = FORTUNE_LOOT_POOLS_V114[kind] || FORTUNE_LOOT_POOLS_V114.COMBAT_RELIC_AND_STONES;
  const rMat = drawRngV116(rng);
  const matId = pool[Math.floor(rMat * pool.length) % pool.length];
  return { matId, count: 1 };
}

const registerExpansionCatalogs=()=>{
  for(const m of [...materials, ...MATERIALS_V114]){
   const ex=(D?.MATERIALS_REGISTRY_V140||[]).find(x=>x.id===m.id);
   if(ex)Object.assign(ex,m);
  }
  E.registerExternalMaterialsV140?.([...materials, ...MATERIALS_V114]);
  E.registerExternalBeastSpeciesV140?.([...beasts, ...BEASTS_V114]);
  addUnique(D.STARTER_RECIPES_V140, [...recipes, ...RECIPES_V114]);
  installCultivationExpansionV112();
};
registerExpansionCatalogs();
const createWorld=E.createInitialWorld;
if(typeof createWorld==='function'&&!E.__livingExpansionV111Wrapped){
  E.createInitialWorld=function(...args){
    const world=createWorld.apply(this,args);
    registerExpansionCatalogs();
    return world;
  };
  E.__livingExpansionV111Wrapped=true;
}

const expansionApi = {
  version: '1.11',
  patchVersion: '1.14',
  materials,
  beasts,
  recipes,
  materialsV114: MATERIALS_V114,
  beastsV114: BEASTS_V114,
  recipesV114: RECIPES_V114,
  beastVariantsV114: BEAST_VARIANTS_V114,
  habitatPoolsV114: HABITAT_POOLS_V114,
  equipmentAffixPoolV114: EQUIPMENT_AFFIX_POOL_V114,
  weaponSpiritsV114: WEAPON_SPIRITS_V114,
  equipmentSetsV114: EQUIPMENT_SETS_V114,
  envoyAuctionPoolsV114: ENVOY_AUCTION_POOLS_V114,
  expeditionTreasurePoolsV114: EXPEDITION_TREASURE_POOLS_V114,
  fortuneLootPoolsV114: FORTUNE_LOOT_POOLS_V114,
  imbueEquipmentDepth: imbueEquipmentDepthV114,
  canEquipItem: canEquipItemV116,
  computeEquipmentResonance: computeEquipmentResonanceV114,
  rollEnvoyAuctionItem: rollEnvoyAuctionItemV114,
  rollExpeditionTreasure: rollExpeditionTreasureV114,
  rollFortuneBonusMaterial: rollFortuneBonusMaterialV114,
  registerCatalogs: registerExpansionCatalogs,
  materialIds: materials.map(x=>x.id),
  beastIds: beasts.map(x=>x.id),
  recipeIds: recipes.map(x=>x.id),
  materialIdsV114: MATERIALS_V114.map(x=>x.id),
  beastIdsV114: BEASTS_V114.map(x=>x.id),
  recipeIdsV114: RECIPES_V114.map(x=>x.id),
  // v1.12 / v1.13 Major Patch Exports
  newMajorPaths: NEW_MAJOR_PATHS_V112,
  extraSubpaths: EXTRA_SUBPATHS_V112,
  tracksV112: [...TRACK_MAP_V112.values()],
  realmsV112: [...REALM_MAP_V112.values()],
  transitionsV112: [...TRANSITION_MAP_V112.values()],
  // Late modules register real route definitions through the same private maps
  // used by identity, readiness and timed breakthrough execution.
  registerCultivationTrack(track) {
    if (!track?.id || !track.subpathId || !Array.isArray(track.realms) || !track.realms.length) return false;
    TRACK_MAP_V112.set(track.id, track);
    SUBPATH_TRACK_MAP_V112.set(track.subpathId, track);
    for (const realm of track.realms) REALM_MAP_V112.set(realm.id, realm);
    for (const transition of track.transitions || []) TRANSITION_MAP_V112.set(transition.id, transition);
    installCultivationExpansionV112();
    for (const [key, values] of [['tracksV112', [track]], ['realmsV112', track.realms], ['transitionsV112', track.transitions || []]]) {
      for (const value of values) if (!this[key].some(x => x.id === value.id)) this[key].push(value);
    }
    return true;
  },
  manualsV112: MANUALS_V112,
  manualMapV112: MANUAL_MAP_V112,
  rarityGradesV112: MANUAL_RARITY_GRADES_V112,
  fortunePoolsV112: FORTUNE_MANUAL_POOLS_V112,
  chronicleCategoriesV112: CHRONICLE_CATEGORIES_V112,
  rollFortuitousManual: rollFortuitousManualV112,
  synthesizeManual: synthesizeManualV113,
  computeNpcStatusKeywords: computeNpcStatusKeywordsV112,
  classifyChronicleEntry: classifyChronicleEntryV112,
  installCultivationExpansionV112
};

root.JianghuExpansionV111 = expansionApi;
root.JianghuExpansionV112 = expansionApi;
})(typeof globalThis!=='undefined'?globalThis:this);


// ============================================================================
// JIANGHU STORY QUESTS (EP.1 - EP.8) & DYNAMIC EVENTS SYSTEM (v2.03)
// Non-Linear NPC-Driven Root-Tree Storyline + 32 Consequential Dynamic Events
// ============================================================================
(function(root){
'use strict';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const alive = n => !!n && n.alive !== false && Number(n.health) > 0;

function makeSeededRng(seedInt) {
  let state = (Number(seedInt) >>> 0) || 0x2468ace1;
  return {
    get state() { return state; },
    set state(v) { state = (Number(v) >>> 0) || 0x2468ace1; },
    next() {
      state = (state + 0x6D2B79F5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(min, max) {
      if (max <= min) return min;
      return min + Math.floor(this.next() * (max - min + 1));
    },
    pick(arr) {
      if (!arr || !arr.length) return null;
      return arr[this.int(0, arr.length - 1)];
    }
  };
}

const PATH_META = {
  XIAN: { id: 'XIAN', icon: '☯', nameTh: 'วิถีเซียน', stdRealms: 9, sampleSub: 'SWORD_IMMORTAL' },
  BODY: { id: 'BODY', icon: '🔥', nameTh: 'วิถีกายา', stdRealms: 8, sampleSub: 'TIGER_SOVEREIGN' },
  GOD: { id: 'GOD', icon: '⚡', nameTh: 'วิถีเทวะ', stdRealms: 8, sampleSub: 'WAR_DEITY' },
  DEMON: { id: 'DEMON', icon: '🩸', nameTh: 'วิถีมารอสูร', stdRealms: 9, sampleSub: 'SHADOW_ASSASSIN' },
  HEART_SOUL: { id: 'HEART_SOUL', icon: '🪷', nameTh: 'วิถีจิต·เซน', stdRealms: 9, sampleSub: 'ZEN_VOID_MIND' }
};

const EP_REQUIRED_BANDS = [1, 1.5, 2, 3, 4, 5, 6, 7];

function requiredBandForEp(epNum) {
  const idx = clamp(Math.floor(Number(epNum) || 1) - 1, 0, 7);
  return EP_REQUIRED_BANDS[idx];
}

function cultivationConditionLabelForEp(epNum) {
  return `มีศิษย์ถึงเกณฑ์ EP.${epNum} (ตบะเทียบเคียง ≥ ${requiredBandForEp(epNum)}) อย่างน้อย 2 คน`;
}

function realmProgressSpan(realm) {
  return realm.transitionId === null ? 0.28 : Math.max(0.08, realm.bandEnd - realm.realizationBand - 0.04);
}

function requiredMilestoneForPath(path, subPath, epNum) {
  const E = root.World2026Engine;
  const track = E?.getCultivationTrackV1200?.(path, subPath);
  const requiredBand = requiredBandForEp(epNum);
  // Use the actual power interval of each realm, including its progress span.
  // Realm counts and local ordinals do not describe comparable attainment.
  const realms = track?.realms || Array.from({ length: 9 }, (_, i) => ({ ordinal: i + 1, realizationBand: i + 1, bandEnd: i + 2, transitionId: i === 8 ? null : 'fallback' }));
  const realm = realms.find(r => r.realizationBand >= requiredBand || r.realizationBand + realmProgressSpan(r) >= requiredBand) || realms[realms.length - 1];
  const span = realmProgressSpan(realm);
  // Round upward so the displayed requirement itself always satisfies the gate.
  const requiredProgress = clamp(Math.ceil(Math.max(0, requiredBand - realm.realizationBand) / span * 10000 - 1e-8) / 100, 0, 100);
  return { track, realm, requiredBand, requiredProgress, requiredOrdinal: realm.ordinal };
}

function requiredOrdinalForPath(path, subPath, epNum) {
  return requiredMilestoneForPath(path, subPath, epNum).requiredOrdinal;
}

function getPathStageTableForEp(epNum) {
  const out = [];
  for (const [pKey, meta] of Object.entries(PATH_META)) {
    const milestone = requiredMilestoneForPath(pKey, meta.sampleSub, epNum);
    const tr = milestone.track;
    const reqOrd = milestone.requiredOrdinal;
    const realmObj = milestone.realm;
    out.push({
      path: pKey,
      icon: meta.icon,
      nameTh: meta.nameTh,
      requiredOrdinal: reqOrd,
      requiredBand: milestone.requiredBand,
      requiredProgress: milestone.requiredProgress,
      requiredRealmBandStart: realmObj.realizationBand,
      requiredRealmBandEnd: realmObj.bandEnd,
      realmCount: tr?.realmCount || meta.stdRealms,
      sampleStageNameTh: realmObj?.nameTh || ('ขั้นที่ ' + reqOrd)
    });
  }
  return out;
}

function evaluateDiscipleForEp(g, n, epNum) {
  const E = root.World2026Engine;
  const j = n?.jianghu || {};
  // The wrapped read-only resolver includes all expanded and hidden profiles.
  // The older getRealizationBand helper still closes over the legacy registry.
  const identity = E?.resolveNpcCultivationIdentityReadOnlyV1200?.(g?.world, n);
  const path = identity?.majorPathId || j.path || 'XIAN';
  const subPath = identity?.subpathId || j.subPath || PATH_META[path]?.sampleSub || 'SWORD_IMMORTAL';
  const tr = E?.getCultivationTrackV1200?.(path, subPath);
  const maxStage = tr?.realmCount || (path === 'BODY' || path === 'GOD' ? 8 : 9);
  const curStage = Number(identity?.trackOrdinal || j.trackOrdinal || j.stage || 1);
  const currentRealm = tr?.realms?.find(r => r.ordinal === curStage) || tr?.realms?.[curStage - 1];
  const progress = clamp(Number(identity?.progress ?? j.cultivationProgress) || 0, 0, 100);
  const currentBand = Number(identity?.realizationBand ?? (currentRealm ? currentRealm.realizationBand + realmProgressSpan(currentRealm) * progress / 100 : j.realizationBand || 1));
  const milestone = requiredMilestoneForPath(path, subPath, epNum);
  const reqStage = milestone.requiredOrdinal;
  const qualified = Number.isFinite(currentBand) && currentBand >= milestone.requiredBand;
  const reqRealmObj = milestone.realm;
  return {
    npcId: n.id,
    name: n.name,
    path,
    pathIcon: PATH_META[path]?.icon || '☯',
    pathNameTh: PATH_META[path]?.nameTh || j.pathNameTh || path,
    subPath,
    subPathNameTh: j.subPathNameTh || tr?.nameTh || subPath,
    currentStage: curStage,
    maxStage,
    requiredStage: reqStage,
    currentBand,
    requiredBand: milestone.requiredBand,
    currentProgress: progress,
    requiredProgress: milestone.requiredProgress,
    currentRealmBandStart: identity?.bandFloor ?? currentRealm?.realizationBand,
    currentRealmBandEnd: identity?.bandEnd ?? currentRealm?.bandEnd,
    requiredRealmBandStart: reqRealmObj.realizationBand,
    requiredRealmBandEnd: reqRealmObj.bandEnd,
    stageNameTh: identity?.realmNameTh || currentRealm?.nameTh || j.stageNameTh || ('ขั้นที่ ' + curStage),
    requiredStageNameTh: reqRealmObj?.nameTh || ('ขั้นที่ ' + reqStage),
    progress: Math.round(progress),
    qualified
  };
}

// ============================================================================
// REAL TANGIBLE REWARD & CONSEQUENCE ENGINE (Items, Pills, Manuals, Pets, Drops, Doctrines, Aftermaths)
// ============================================================================
function pickBestHero(g, filterFn = null) {
  const list = (g?.heroes || []).filter(alive);
  const filtered = filterFn ? list.filter(filterFn) : list;
  const pool = filtered.length ? filtered : list;
  return pool.slice().sort((a, b) => (g.power?.(b) || 100) - (g.power?.(a) || 100))[0] || null;
}

function staleThreat(g) {
  return [...g.enemies.filter(alive), ...g.s.beasts.filter(b => g.isHostileCreature(b))].some(e => {
    const p = e.stageLocal || e;
    return !p.offmap && g.heroes.some(n => alive(n) && !n.stageLocal?.offmap && Math.hypot(p.x - n.stageLocal.x, p.y - n.stageLocal.y) < 350);
  });
}

function grantRealEquipment(g, spec, targetHero = null) {
  const slot = spec.slot || 'WEAPON';
  const item = {
    id: 'eq_v203_' + (g.s.nextId++),
    nameTh: spec.nameTh || 'ศาสตราวิญญาณเมฆาคราม',
    slot,
    tier: spec.tier || 2,
    rarity: spec.rarity || 'RARE',
    durability: 100,
    maxDurability: 100,
    minStageReq: spec.minStageReq || Math.max(1, Math.floor(((spec.tier || 2) + 1) / 2)),
    compatiblePath: spec.compatiblePath || 'ANY',
    combatMult: spec.combatMult ?? (slot === 'WEAPON' ? 0.12 : 0.06),
    defenseMult: spec.defenseMult ?? (slot === 'ARMOR' ? 0.14 : 0.06),
    combatStats: { ...(spec.combatStats || {}) },
    stats: { ...(spec.combatStats || {}) },
    weaponSpirit: spec.weaponSpirit || null,
    minimumBid: 30 + (spec.tier || 2) * 25
  };
  const delivery = deliverStoryItem(g, 'equipmentItems', item, targetHero);
  return { item, ownerName: delivery.ownerName, equipped: false, pending: delivery.pending };
}

// A reward is a physical item, held once either in a real ledger or in delivery escrow.
function deliverStoryItem(g, kind, item, targetHero = null, retry = false) {
  const caps = { equipmentItems: 12, pillStacks: 16, scrolls: 24 };
  const members = (g.heroes || []).filter(alive);
  const preferred = targetHero && members.some(n => n.id === targetHero.id) ? targetHero : null;
  const candidates = preferred ? [preferred] : [g.bank];
  for (const owner of candidates) {
    const ledger = owner.jianghu?.ledgerV140;
    if (!ledger) continue;
    const items = ledger[kind] || (ledger[kind] = []);
    if (kind === 'pillStacks') {
      const stack = items.find(p => p.recipeId === item.recipeId && p.nameTh === item.nameTh && p.quality === item.quality && JSON.stringify(p.effect) === JSON.stringify(item.effect));
      if (stack) { stack.count += item.count; return { ownerName: owner === g.bank ? 'คลังสำนัก' : owner.name, pending: false }; }
    }
    if (items.length >= caps[kind]) continue;
    if (kind === 'scrolls') { item.ownerNpcId = preferred?.id || owner.id; item.rights = 'OWNER'; }
    items.push(item);
    return { ownerName: owner === g.bank ? 'คลังสำนัก' : owner.name, pending: false };
  }
  if (!retry) {
    const st = g.storyEvents.ensureState(true);
    st.pendingRewards.push({ id: item.id, kind, item, recipientId: preferred?.id || null, at: g.s.t });
  }
  return { ownerName: 'พัสดุรอส่งมอบ (คลังเต็ม)', pending: true };
}

function retryStoryRewards(g, st) {
  st.pendingRewards = (st.pendingRewards || []).filter(r => {
    const n = r.recipientId && g.world.npcs[r.recipientId];
    return deliverStoryItem(g, r.kind, r.item, n, true).pending;
  });
}

function grantRealPills(g, recipeId, qty = 2, customSpec = null) {
  const rec = (g.recipes || []).find(r => r.id === recipeId) || {};
  const nameTh = customSpec?.nameTh || rec.outputNameTh || 'โอสถทิพย์เมฆาคราม';
  const effect = customSpec?.effect || rec.effect || { healHealth: 35, restoreQi: 40 };
  const item = {
      id: 'pill_v203_' + (g.s.nextId++),
      recipeId: recipeId || 'REC1100_SUPPORT_QI',
      nameTh,
      tier: customSpec?.tier || rec.tier || 1,
      quality: customSpec?.quality || 'SUPERIOR',
      count: Math.max(0, Math.floor(qty)),
      effect: { ...effect }
  };
  const delivery = item.count ? deliverStoryItem(g, 'pillStacks', item) : { ownerName: 'คลังสำนัก', pending: false };
  return { nameTh, qty: item.count, heroName: null, ownerName: delivery.ownerName, pending: delivery.pending };
}

function grantRealManualAndTeach(g, minTier = 2, maxTier = 4, preferredPath = null, targetHero = null) {
  const manuals = root.JianghuExpansionV112?.manualsV112 || [];
  let candidates = manuals.filter(m => m.tier >= minTier && m.tier <= maxTier && (!preferredPath || m.path === preferredPath || m.path === 'ANY'));
  if (!candidates.length) candidates = manuals.filter(m => m.tier >= minTier && m.tier <= maxTier);
  if (!candidates.length) candidates = manuals;
  const chosen = candidates[(g.s.nextId || 1) % Math.max(1, candidates.length)];
  if (!chosen) return null;
  const item = { id: 'story-scroll-' + (g.s.nextId++), artId: chosen.id, nameTh: chosen.nameTh, tier: chosen.tier || 1, count: 1, sourceType: 'DISCOVERY', originLabelTh: 'รางวัลเควสและอีเวนต์ยุทธภพ', rights: 'OWNER', ownerNpcId: targetHero?.id || g.bank.id };
  const delivery = deliverStoryItem(g, 'scrolls', item, targetHero);
  return { manual: chosen, item, heroName: delivery.ownerName, pending: delivery.pending };
}

function grantRealCompanionBeast(g, spec, targetHero = null) {
  if (!g.s?.realm) return null;
  g.s.realm.pets = g.s.realm.pets || [];
  const unbonded = g.heroes.filter(h => alive(h) && !g.s.realm.pets.some(p => p.alive && p.ownerId === h.id));
  const owner = targetHero && unbonded.some(n => n.id === targetHero.id) ? targetHero : unbonded[0] || null;
  const ox = owner?.stageLocal?.x || 1050;
  const oy = owner?.stageLocal?.y || 1320;
  const pet = {
    id: 'pet_v203_' + (g.s.nextId++),
    speciesId: spec.speciesId || 'BEAST_CLOUD_FOX',
    name: spec.nameTh || 'จิ้งจอกเมฆาคู่พันธสัญญา',
    tier: spec.tier || 3,
    health: spec.hp || 230,
    maxHP: spec.hp || 230,
    power: spec.power || 410,
    hunger: 0,
    trust: spec.trust || 68,
    alive: true,
    ownerId: owner?.id || null,
    x: ox + 28,
    y: oy + 22,
    home: { x: ox + 28, y: oy + 22 },
    attackAt: 0,
    cooldowns: {},
    stageLocal: {
      pet: true,
      x: ox + 28,
      y: oy + 22,
      mode: owner ? 'follow' : 'wild',
      route: [],
      offmap: null
    }
  };
  g.myriad?.attachIndividualToMapBeast?.(pet);
  g.s.realm.pets.push(pet);
  return { pet, ownerName: owner?.name || 'อุทยานสำนัก (รอผู้สมัครใจผูกพันธสัญญา)' };
}

function grantMeridianNodes(g, n, quantity = 1) {
  let opened = 0;
  for (let i = 0; i < Math.min(72, Math.max(0, quantity)); i++) {
    if (!root.World2026Engine?.openMeridianNodeV150?.(g.world, n, null, { free: true, nodes: 1 }).ok) break;
    opened++;
  }
  return opened;
}

function grantStoryLifespan(n, years, sourceId) {
  const j = n.jianghu;
  if (!j) return 0;
  const boons = j.storyLifespanBoonsV205 || (j.storyLifespanBoonsV205 = {});
  if (boons[sourceId]) return 0;
  boons[sourceId] = years;
  j.lifespanMax = (Number(j.lifespanMax) || 100) + years;
  return years;
}

function grantStoryMaterial(g, matId, count, origin) {
  const r = g.add(g.bank, matId, count, origin);
  if (!r.ok) spawnRealGroundDrops(g, g.built('hall')?.x || 1100, (g.built('hall')?.y || 1300) + 180, [{ matId, count }], origin);
  return r;
}

function setStoryCultivationBand(g, n, targetBand) {
  const tr = root.World2026Engine.getCultivationTrackV1200(n.jianghu.path, n.jianghu.subPath);
  const band = clamp(targetBand, 1, 9);
  const r = tr.realms.find(r => r.realizationBand >= band || r.realizationBand + realmProgressSpan(r) >= band) || tr.realms.at(-1);
  const progress = clamp((band - r.realizationBand) / realmProgressSpan(r) * 100, 0, 99);
  root.World2026Engine.syncNpcCultivationIdentityV1200(g.world, n, { trackOrdinal: r.ordinal, progress });
}

function eventArrivalPoint(g, offset = 0) {
  const hall = g.built('hall') || { x: 950, y: 1250 };
  const obstacles = root.FrontierData?.OBST || [];
  for (let i = 0; i < 12; i++) {
    const p = { x: clamp(hall.x + 650 + (offset % 3) * 110 - Math.floor(i / 4) * 170, 200, 3750), y: clamp(hall.y - 200 + Math.floor(offset / 3) * 110 + (i % 4) * 120, 200, 2750) };
    if (Math.hypot(p.x - hall.x, p.y - hall.y) < 400) continue;
    if (obstacles.some(o => p.x > o.x - 40 && p.x < o.x + o.w + 40 && p.y > o.y - 40 && p.y < o.y + o.h + 40)) continue;
    if (g.s.buildings.some(b => b.hp > 0 && Math.abs(p.x - b.x) < (root.FrontierData?.B[b.type]?.size || 180) / 2 + 40 && Math.abs(p.y - b.y) < (root.FrontierData?.B[b.type]?.size || 180) / 2 + 40)) continue;
    if (g.path(p, g.endpoint(hall)).length) return p;
  }
  return { x: 1950 + (offset % 3) * 100, y: 1850 };
}

function spawnRealGroundDrops(g, x, y, dropsList, sourceLabel = 'ร่องรอยเหตุการณ์ยุทธภพ') {
  if (!g.s) return [];
  g.s.groundDrops = g.s.groundDrops || [];
  const created = [];
  dropsList.forEach((d, idx) => {
    const drop = {
      id: 'drop_v203_' + (g.s.nextId++),
      matId: d.matId,
      count: d.count || 2,
      x: clamp((Number(x) || 1150) + ((idx % 3) - 1) * 36, 180, 3400),
      y: clamp((Number(y) || 1400) + (Math.floor(idx / 3) - 0.5) * 36, 180, 2400),
      source: sourceLabel,
      expiresAt: (Number(g.s.t) || 0) + 600
    };
    g.s.groundDrops.push(drop);
    created.push(drop);
  });
  return created;
}

function unlockSectDoctrine(g, docSpec) {
  if (!g.s?.storyEvents) return null;
  const list = g.s.storyEvents.doctrines || (g.s.storyEvents.doctrines = []);
  const existingIdx = list.findIndex(d => d.id === docSpec.id);
  const entry = {
    id: docSpec.id,
    ep: docSpec.ep || 2,
    nodeId: docSpec.nodeId || '',
    branchKey: docSpec.branchKey || 'RIGHTEOUS',
    icon: docSpec.icon || '🏛️',
    nameTh: docSpec.nameTh,
    descTh: docSpec.descTh,
    mods: docSpec.mods || {},
    dailyStones: docSpec.dailyStones || 0,
    dailyFood: docSpec.dailyFood || 0,
    cultivationBonusPct: docSpec.cultivationBonusPct || 0,
    unlockedAt: Math.round(g.s.t || 0)
  };
  if (existingIdx >= 0) list[existingIdx] = entry;
  else list.push(entry);
  return entry;
}

function addEventAftermath(g, afSpec) {
  if (!g.s?.storyEvents) return null;
  const list = g.s.storyEvents.aftermaths || (g.s.storyEvents.aftermaths = []);
  const now = Number(g.s.t) || 0;
  const duration = afSpec.duration || 140;
  const entry = {
    id: afSpec.id || ('af_' + (g.s.nextId++)),
    nameTh: afSpec.nameTh,
    icon: afSpec.icon || '⏳',
    kind: afSpec.kind || 'BLESSING',
    descTh: afSpec.descTh || '',
    startedAt: now,
    expiresAt: now + duration,
    mods: afSpec.mods || {},
    periodicKind: afSpec.periodicKind || null,
    nextPulseAt: now + 15
  };
  const idx = list.findIndex(x => x.id === entry.id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  return entry;
}

function queueChainedEvent(g, eventId, delaySec, reasonTh, fromTitleTh) {
  if (!g.s?.storyEvents) return null;
  const q = g.s.storyEvents.chainedQueue || (g.s.storyEvents.chainedQueue = []);
  if (q.some(x => x.eventId === eventId)) return null;
  const item = {
    id: 'chain_' + (g.s.nextId++),
    eventId,
    epNum: g.s.storyEvents.currentEp || 1,
    triggerAt: Math.round((Number(g.s.t) || 0) + (delaySec || 45)),
    reasonTh: reasonTh || 'ผลพวงต่อเนื่องจากเหตุการณ์ก่อนหน้า',
    fromTitleTh: fromTitleTh || 'เหตุการณ์ก่อนหน้า'
  };
  q.push(item);
  return item;
}

// ============================================================================
// EPISODE-SCALED BEAST TIDE & RAIDER POOLS (EP.1 to EP.8)
// ============================================================================
const EP_BEAST_TIDE_POOLS = {
  1: {
    ep: 1,
    poolNameTh: 'พูลอสูร EP.1 · ฝูงหมาป่าหมอกวายุชายป่า',
    descTh: 'อสูรระดับขั้นที่ 1 สำหรับทดสอบศิษย์ใหม่ที่เพิ่งเปิดชีพจรปราณ',
    recommendedStageTh: 'ทุกวิถี ขั้นที่ 1',
    spawns: [
      { speciesId: 'BEAST_MIST_WOLF', nameTh: 'หมาป่าหมอกวายุคลั่ง', tier: 1, hp: 95, power: 190 },
      { speciesId: 'BEAST_MIST_WOLF', nameTh: 'หมาป่าเขี้ยวลมจ่าฝูง', tier: 1, hp: 115, power: 220 }
    ],
    rewardStones: 95,
    rewardMatId: 'MAT_BP_WOLF_FANG_1',
    rewardMatQty: 3
  },
  2: {
    ep: 2,
    poolNameTh: 'พูลอสูร EP.2 · หมูป่าเกราะเหล็กและหมาป่าสันเขา',
    descTh: 'อสูรระดับขั้น 1–2 ที่มีเกราะกายหนาขึ้น ต้องอาศัยศิษย์ขั้น 2 หรือการรุมล้อมประสานวิชา',
    recommendedStageTh: 'เซียน/มาร/จิต ขั้น 2 · กายา/เทวะ ขั้น 2',
    spawns: [
      { speciesId: 'BEAST_IRON_BOAR', nameTh: 'หมูป่าเกราะเหล็กไหล', tier: 2, hp: 165, power: 290 },
      { speciesId: 'BEAST_MIST_WOLF', nameTh: 'หมาป่าหมอกวายุ', tier: 1, hp: 120, power: 240 }
    ],
    rewardStones: 160,
    rewardMatId: 'MAT_ORE_BLACK_IRON_1',
    rewardMatQty: 5
  },
  3: {
    ep: 3,
    poolNameTh: 'พูลอสูร EP.3 · จิ้งจอกเมฆาและอสรพิษมรกต',
    descTh: 'อสูรระดับขั้น 2–3 ที่มีความคล่องตัวและพิษกัดกร่อน ทดสอบศิษย์ที่เริ่มหลอมโอสถและศาสตรา',
    recommendedStageTh: 'เซียน/มาร/จิต ขั้น 2–3 · กายา/เทวะ ขั้น 2',
    spawns: [
      { speciesId: 'BEAST_CLOUD_FOX', nameTh: 'จิ้งจอกเมฆาคราม', tier: 2, hp: 190, power: 360 },
      { speciesId: 'BEAST_EMERALD_PYTHON', nameTh: 'อสรพิษเกล็ดมรกต', tier: 3, hp: 230, power: 420 }
    ],
    rewardStones: 230,
    rewardMatId: 'MAT_HERB_MIST_ORCHID_2',
    rewardMatQty: 4
  },
  4: {
    ep: 4,
    poolNameTh: 'พูลอสูร EP.4 · เต่าหยกธาราและวานรหลังผลึก',
    descTh: 'อสูรเกราะหนักและพลังกายสูงระดับขั้น 3 ต้องใช้ศิษย์ที่เข้าใจชุดวิชาและคอมโบต่อเคล็ด',
    recommendedStageTh: 'เซียน/มาร/จิต ขั้น 3 · กายา/เทวะ ขั้น 3 (สาย 6–7 ขั้น ใช้ขั้น 2)',
    spawns: [
      { speciesId: 'BEAST_JADE_TIDE_TURTLE', nameTh: 'เต่าหยกธาราเกราะศิลา', tier: 3, hp: 290, power: 540 },
      { speciesId: 'BEAST_CRYSTALBACK_APE', nameTh: 'วานรหลังผลึกคลั่ง', tier: 3, hp: 270, power: 580 }
    ],
    rewardStones: 330,
    rewardMatId: 'MAT_ORE_SPIRIT_COPPER_2',
    rewardMatQty: 4
  },
  5: {
    ep: 5,
    poolNameTh: 'พูลอสูร EP.5 · อีกาเถ้าดาราและพยัคฆ์จันทราเหมันต์',
    descTh: 'อสูรธาตุไฟและน้ำแข็งระดับขั้น 3–4 ที่ทรงพลังสมกับสำนักที่มีหอสืบทอดและค่ายกล',
    recommendedStageTh: 'เซียน/มาร/จิต ขั้น 4 · กายา/เทวะ ขั้น 3–4',
    spawns: [
      { speciesId: 'BEAST_ASHEN_CROW', nameTh: 'พญาอีกาเถ้าดารา', tier: 3, hp: 320, power: 720 },
      { speciesId: 'BEAST_FROST_MOON_LYNX', nameTh: 'พยัคฆ์ดาวจันทราเหมันต์', tier: 4, hp: 380, power: 840 }
    ],
    rewardStones: 460,
    rewardMatId: 'MAT_ORE_CLOUD_JADE_3',
    rewardMatQty: 4
  },
  6: {
    ep: 6,
    poolNameTh: 'พูลอสูร EP.6 · พญาหมีเหมันต์และฝูงอสูรสันเขา',
    descTh: 'อสูรชั้นสูงระดับขั้น 4 ที่ลงมาจากสันเขาเหมันต์ ทดสอบตบะของยอดฝีมือช่วงกลางเกม',
    recommendedStageTh: 'เซียน/มาร/จิต ขั้น 5 · กายา/เทวะ ขั้น 4',
    spawns: [
      { speciesId: 'BEAST_FROST_BEAR', nameTh: 'พญาหมีเหมันต์ถล่มผา', tier: 4, hp: 460, power: 1080 },
      { speciesId: 'BEAST_FROST_MOON_LYNX', nameTh: 'พยัคฆ์จันทราเหมันต์จ่าฝูง', tier: 4, hp: 410, power: 980 }
    ],
    rewardStones: 640,
    rewardMatId: 'MAT_HERB_BLOOD_GINSENG_3',
    rewardMatQty: 4
  },
  7: {
    ep: 7,
    poolNameTh: 'พูลอสูร EP.7 · อสูรกลายพันธุ์จากรอยแยกหมื่นภพ',
    descTh: 'อสูรสายเลือดบรรพกาลระดับขั้น 5 ที่หลุดออกมาจากรอยแยกแดนหมื่นภพ',
    recommendedStageTh: 'เซียน/มาร/จิต ขั้น 6 · กายา/เทวะ ขั้น 5',
    spawns: [
      { speciesId: 'BEAST_FROST_BEAR', nameTh: 'อสูรหมีเหมันต์สายเลือดบรรพกาล', tier: 5, hp: 580, power: 1450 },
      { speciesId: 'BEAST_CRYSTALBACK_APE', nameTh: 'ราชันย์วานรผลึกดารา', tier: 5, hp: 540, power: 1380 }
    ],
    rewardStones: 900,
    rewardMatId: 'MAT_ORE_THUNDER_IRON_4',
    rewardMatQty: 4
  },
  8: {
    ep: 8,
    poolNameTh: 'พูลอสูร EP.8 · มหาคลื่นราชันย์อสูรบรรพกาลสะท้านภพ',
    descTh: 'อสูรบรรพกาลระดับขั้น 6–7 ที่เทียบเท่าจอมยุทธ์ครองภพ ทดสอบมหาสำนักอย่างแท้จริง',
    recommendedStageTh: 'เซียน/มาร/จิต ขั้น 7 · กายา/เทวะ ขั้น 6',
    spawns: [
      { speciesId: 'BEAST_FROST_BEAR', nameTh: 'ราชันย์หมีเหมันต์ทลายสวรรค์', tier: 6, hp: 760, power: 1950 },
      { speciesId: 'BEAST_FROST_MOON_LYNX', nameTh: 'พยัคฆ์จันทราเทวะบรรพกาล', tier: 6, hp: 680, power: 1820 }
    ],
    rewardStones: 1350,
    rewardMatId: 'MAT_HERB_SUNSET_ORCHID_4',
    rewardMatQty: 4
  }
};

const EP_RAIDER_POOLS = {
  1: { nameTh: 'โจรภูเขาผาทมิฬลาดตระเวน', band: 1, hp: 85, count: 1, rewardStones: 90 },
  2: { nameTh: 'มือกระบี่นอกด่านผาทมิฬ', band: 2, hp: 95, count: 2, rewardStones: 150 },
  3: { nameTh: 'นักล่าค่าหัวทมิฬ', band: 2.5, hp: 100, count: 2, rewardStones: 220 },
  4: { nameTh: 'ยอดฝีมือค่ายโจรผาทมิฬ', band: 3.2, hp: 100, count: 2, rewardStones: 310 },
  5: { nameTh: 'ทูตโลหิตลัทธิเงาอสูร', band: 4.0, hp: 100, count: 2, rewardStones: 440 },
  6: { nameTh: 'ผู้คุมกฎสำนักมารนอกด่าน', band: 4.8, hp: 100, count: 2, rewardStones: 600 },
  7: { nameTh: 'ผู้พิทักษ์รอยแยกมิติมืด', band: 5.6, hp: 100, count: 3, rewardStones: 850 },
  8: { nameTh: 'ขุนพลมารบรรพกาลข้ามภพ', band: 6.5, hp: 100, count: 3, rewardStones: 1250 }
};

function spawnEventBeast(g, spec, eventTagId, indexOffset = 0) {
  const E = root.World2026Engine;
  const spList = E?.PATCH140_DATA?.BEAST_SPECIES_V140 || [];
  const baseSp = spList.find(b => b.id === spec.speciesId) || spList[0] || {
    id: spec.speciesId || 'BEAST_MIST_WOLF',
    nameTh: spec.nameTh || 'อสูรป่าคลั่ง',
    tier: spec.tier || 1,
    power: spec.power || 200,
    partDrops: [{ matId: 'MAT_BP_WOLF_FANG_1', chance: 1, min: 1, max: 2 }]
  };
  const arrival = eventArrivalPoint(g, indexOffset);
  const tx = arrival.x, ty = arrival.y;
  const b = {
    id: 'ev_beast_' + (g.s.nextId++),
    speciesId: baseSp.id,
    name: spec.nameTh || baseSp.nameTh,
    tier: spec.tier || baseSp.tier || 1,
    power: spec.power || baseSp.power || 220,
    hp: spec.hp || 120,
    health: spec.hp || 120,
    maxHP: spec.hp || 120,
    x: clamp(tx, 300, 3200),
    y: clamp(ty, 300, 2300),
    homeX: clamp(tx, 300, 3200),
    homeY: clamp(ty, 300, 2300),
    home: { x: clamp(tx, 300, 3200), y: clamp(ty, 300, 2300) },
    nextMove: 0,
    route: [],
    alive: true,
    hostile: true,
    aggroRange: 950,
    habitatId: 'story_event',
    storyEventId: eventTagId,
    storyEventEp: spec.ep || 1,
    variantBadgeTh: 'อีเวนต์ยุทธภพ',
    drops: baseSp.partDrops || [{ matId: 'MAT_BP_WOLF_FANG_1', chance: 1, min: 1, max: 2 }]
  };
  g.myriad?.attachIndividualToMapBeast?.(b);
  b.health = spec.hp || b.maxHP || 120;
  b.maxHP = spec.hp || b.maxHP || 120;
  g.s.beasts.push(b);
  return b;
}

function spawnEventRaider(g, spec, eventTagId, indexOffset = 0) {
  const arrival = eventArrivalPoint(g, indexOffset);
  const tx = arrival.x, ty = arrival.y;
  const n = g.bandit(!!spec.boss, clamp(tx, 350, 3200), clamp(ty, 350, 2300));
  n.name = spec.boss ? (spec.bossNameTh || ('หัวหน้า' + spec.nameTh)) : (spec.nameTh + ' #' + (indexOffset + 1));
  n.stageLocal.raid = true;
  n.stageLocal.storyEventId = eventTagId;
  const band = clamp(Number(spec.band) || 1.5, 1, 9);
  if (n.jianghu) {
    setStoryCultivationBand(g, n, band + (spec.boss ? 0.25 : 0));
  }
  n.health = n.stageLocal.boss ? 240 : 100;
  g.combatSystem?.ensure?.(n);
  return n;
}

// ============================================================================
// NON-LINEAR ROOT-TREE STORY QUEST NODES (19 Nodes across 8 Episode Tiers)
// Driven by Autonomous NPC Council Decisions (68-axis HumanCore personality/values/path)
// ============================================================================
const STORY_TREE_NODES_V203 = [
  {
    id: 'EP1_ROOT',
    ep: 1,
    code: 'EP1_ROOT',
    branchKey: 'ROOT',
    branchBadgeTh: '🌱 รากแก้วตั้งสำนัก',
    parentIds: [],
    nextNodeIds: ['EP2_RIGHTEOUS', 'EP2_MARTIAL', 'EP2_ARCANE'],
    chapterPhaseTh: 'บทที่ 1 · รากแก้วแห่งเมฆาคราม',
    titleTh: 'EP.1 · ก่อรากฐานเมฆาคราม',
    subtitleTh: 'สร้างหอเจ้าสำนัก ลานฝึกปราณ และรับศิษย์รุ่นแรกเข้าสู่สำนัก',
    loreTh: 'ณ หุบเขาเมฆาครามอันห่างไกล คุณได้วางศิลาฤกษ์ก่อตั้งสำนักใหม่ เมื่อศิษย์รุ่นแรกก้าวเข้าสู่สำนักและพิสูจน์ฝีมือกับฝูงหมาป่าชายป่า สภาศิษย์จะร่วมกันลงมติเลือก «ทิศทางมรรคาของสำนัก» ที่จะแตกกิ่งก้านออกเป็น 3 สายหลักในบทถัดไป',
    requiredCountAtStage: 2,
    decisionProfile: { archetype: 'ROOT', reasonLabelTh: 'จุดเริ่มต้นการก่อตั้งสำนัก' },
    doctrineSpec: {
      id: 'DOC_EP1_FOUNDATION',
      ep: 1,
      branchKey: 'ROOT',
      icon: '🏛️',
      nameTh: 'รากฐานเมฆาครามแรกตั้ง',
      descTh: 'เพิ่มปราณสูงสุด +6 และความแม่นยำ +3 ให้ศิษย์ทุกคนในสำนัก',
      mods: { add: { maxQi: 6, accuracy: 3 } },
      dailyStones: 4
    },
    evaluateConditions(g) {
      const hasHall = !!g.built('hall');
      const hasTrain = !!g.built('training');
      const aliveHeroes = g.heroes.filter(alive);
      const qualified = aliveHeroes.filter(n => evaluateDiscipleForEp(g, n, 1).qualified);
      return [
        { id: 'c_hall', labelTh: 'สร้างหอเจ้าสำนักสำเร็จ', current: hasHall ? 1 : 0, target: 1, passed: hasHall },
        { id: 'c_train', labelTh: 'สร้างหอฝึกปราณสำเร็จ', current: hasTrain ? 1 : 0, target: 1, passed: hasTrain },
        { id: 'c_disc1', labelTh: cultivationConditionLabelForEp(1), current: qualified.length, target: 2, passed: qualified.length >= 2 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.1 · กวาดล้างฝูงหมาป่าหมอกวายุหน้าหุบเขา',
    trialDescTh: 'ฝูงหมาป่าหมอกวายุ 2 ตัวบุกเข้ามาลองเชิงหน้าเขตสำนัก ปราบพวกมันเพื่อเปิดประชุมสภาเลือกกิ่งมรรคาของสำนัก!',
    spawnTrial(g, tagId) {
      const pool = EP_BEAST_TIDE_POOLS[1];
      return pool.spawns.map((sp, i) => spawnEventBeast(g, sp, tagId, i).id);
    },
    rewardSummaryTh: 'ปลดล็อกมติ «รากฐานเมฆาคราม» (ปราณ +6, แม่นยำ +3) · ศาสตราจริง «กระบี่หยกฝึกหัดเมฆาคราม» · โอสถฟื้นปราณ ×2 · ศิลาวิญญาณ +160 · ไม้ไผ่ +25',
    grantRewards(g) {
      g.money(160, 'รางวัลเนื้อเรื่อง EP.1');
      g.s.wood += 25;
      g.s.food = Math.min(160, (g.s.food || 0) + 20);
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'กระบี่หยกฝึกหัดเมฆาคราม',
        slot: 'WEAPON',
        tier: 2,
        combatMult: 0.10,
        combatStats: { physicalAttack: 14, artAttack: 14, accuracy: 4 }
      });
      grantRealPills(g, 'REC1100_SUPPORT_QI', 2);
      for (const h of g.heroes.filter(alive)) {
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 16);
      }
    }
  },
  {
    id: 'EP2_RIGHTEOUS',
    ep: 2,
    code: 'EP2_RIGHTEOUS',
    branchKey: 'RIGHTEOUS',
    branchBadgeTh: '🪷 กิ่งธรรมะพิทักษ์ชน',
    parentIds: ['EP1_ROOT'],
    nextNodeIds: ['EP3_R1_SANCTUARY', 'EP3_R2_BODHI_HEART'],
    chapterPhaseTh: 'บทที่ 2 (กิ่งธรรมะ) · ร่มเงาเมฆาคุ้มครองปุถุชน',
    titleTh: 'EP.2 [กิ่งธรรมะ] · ร่มเงาเมฆาคุ้มครองปุถุชน',
    subtitleTh: 'สภาศิษย์เลือกยึดมั่นคุณธรรม ปกป้องหมู่บ้านชิงหยุนและสร้างเกราะคุ้มครองผู้คน',
    loreTh: 'จากการลงมติของเหล่าศิษย์ผู้เปี่ยมเมตตาและเที่ยงธรรม สำนักเมฆาครามประกาศตนเป็นร่มเงาคุ้มครองชาวบ้านชิงหยุน เมื่อหน่วยปล้นสะดมของค่ายผาทมิฬบุกคุกคามหมู่บ้าน เหล่าศิษย์จึงออกยืนหยัดเป็นปราการด่านหน้า',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'RIGHTEOUS',
      paths: ['XIAN', 'HEART_SOUL'],
      traits: { empathy: 1.4, integrity: 1.5, trustfulness: 0.9, caution: 0.6, aggression: -0.8 },
      reasonLabelTh: 'ยึดมั่นในเมตตาธรรมและต้องการคุ้มครองชาวบ้านชิงหยุน'
    },
    doctrineSpec: {
      id: 'DOC_EP2_RIGHTEOUS',
      ep: 2,
      branchKey: 'RIGHTEOUS',
      icon: '🪷',
      nameTh: 'ร่มเงาเมตตาคุ้มชน',
      descTh: 'เพิ่มต้านทานปราณ +10%, เกราะป้องกัน +8%, ต้านสถานะ +5% และหมู่บ้านส่งส่วยเพิ่ม +6 ศิลา/วัน',
      mods: { scale: { resistance: 1.10, armor: 1.08 }, add: { controlResist: 0.05 } },
      dailyStones: 6
    },
    evaluateConditions(g) {
      const aliveHeroes = g.heroes.filter(alive);
      const qualified = aliveHeroes.filter(n => evaluateDiscipleForEp(g, n, 2).qualified);
      return [
        { id: 'c_stage2', labelTh: cultivationConditionLabelForEp(2), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_vhp', labelTh: 'ดูแลความสมบูรณ์ของหมู่บ้านชิงหยุน ≥ 500 / 1,000', current: Math.round(g.s.villageHP || 0), target: 500, passed: (g.s.villageHP || 0) >= 500 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.2 (กิ่งธรรมะ) · สกัดกั้นหน่วยปล้นสะดมผาทมิฬและหมูป่าเกราะเหล็ก',
    trialDescTh: 'หน่วยปล้นสะดมผาทมิฬและหมูป่าเกราะเหล็กบุกคุกคามเส้นทางหมู่บ้าน ปกป้องชาวบ้านให้ปลอดภัย!',
    spawnTrial(g, tagId) {
      const r1 = spawnEventRaider(g, EP_RAIDER_POOLS[2], tagId, 0).id;
      const b1 = spawnEventBeast(g, EP_BEAST_TIDE_POOLS[2].spawns[0], tagId, 1).id;
      return [r1, b1];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «ร่มเงาเมตตาคุ้มชน» (ต้านทาน +10%, เกราะ +8%) · ชุดเกราะจริง «เกราะหยกเมฆาพิทักษ์» · โอสถสมานกาย ×3 · ศิลาวิญญาณ +240',
    grantRewards(g) {
      g.money(240, 'รางวัลเนื้อเรื่อง EP.2 (กิ่งธรรมะ)');
      g.s.villageHP = Math.min(1000, (g.s.villageHP || 800) + 180);
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'เกราะหยกเมฆาพิทักษ์',
        slot: 'ARMOR',
        tier: 2,
        defenseMult: 0.16,
        combatStats: { armor: 18, resistance: 16, maxHP: 22 }
      });
      grantRealPills(g, 'REC1100_SUPPORT_RECOVERY', 3);
      for (const h of g.heroes.filter(alive)) root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 18);
    }
  },
  {
    id: 'EP2_MARTIAL',
    ep: 2,
    code: 'EP2_MARTIAL',
    branchKey: 'MARTIAL',
    branchBadgeTh: '⚔️ กิ่งศาสตราพิชิตศึก',
    parentIds: ['EP1_ROOT'],
    nextNodeIds: ['EP3_M1_WAR_FORGE', 'EP3_M2_BEAST_DOMINION'],
    chapterPhaseTh: 'บทที่ 2 (กิ่งศาสตรา) · คมดาบโลหิตสะท้านชายแดน',
    titleTh: 'EP.2 [กิ่งศาสตรา] · คมดาบโลหิตสะท้านชายแดน',
    subtitleTh: 'สภาศิษย์เลือกวิถีแห่งกำลังและการรุกไล่ ล่าอสูรและบดขยี้ศัตรูด้วยคมอาวุธ',
    loreTh: 'ด้วยแรงขับแห่งความกล้าหาญและความทะเยอทะยาน เหล่าศิษย์ลงมติว่าหนทางเดียวที่จะอยู่รอดในยุทธภพคือความแข็งแกร่งไร้เทียมทาน สำนักเมฆาครามจึงส่งศิษย์ออกล่าฝูงอสูรและเด็ดหัวหน่วยลาดตระเวนของศัตรูก่อนที่พวกมันจะทันตั้งตัว',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'MARTIAL',
      paths: ['BODY', 'GOD'],
      traits: { courage: 1.5, aggression: 1.4, ambition: 1.2, discipline: 0.7, caution: -0.7 },
      reasonLabelTh: 'เชื่อมั่นในคมศาสตราและการบุกปราบศัตรูเพื่อสร้างบารมี'
    },
    doctrineSpec: {
      id: 'DOC_EP2_MARTIAL',
      ep: 2,
      branchKey: 'MARTIAL',
      icon: '⚔️',
      nameTh: 'คมศาสตราพิชิตศึก',
      descTh: 'เพิ่มพลังโจมตีกายภาพ +10%, อัตราคริติคอล +4% และเจาะเกราะ +5 ให้ศิษย์ทุกคน',
      mods: { scale: { physicalAttack: 1.10 }, add: { critRate: 0.04, penetration: 5 } }
    },
    evaluateConditions(g) {
      const aliveHeroes = g.heroes.filter(alive);
      const qualified = aliveHeroes.filter(n => evaluateDiscipleForEp(g, n, 2).qualified);
      return [
        { id: 'c_stage2m', labelTh: cultivationConditionLabelForEp(2), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_kills2m', labelTh: 'สถิติปราบอสูรหรือศัตรูสะสมอย่างน้อย 2 ครั้ง', current: g.s.stats?.kills || 0, target: 2, passed: (g.s.stats?.kills || 0) >= 2 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.2 (กิ่งศาสตรา) · บดขยี้หัวหน้าหน่วยลาดตระเวนผาทมิฬและหมูป่าเกราะเหล็ก',
    trialDescTh: 'บุกทะลวงแนวหน้าของศัตรูและสังหารหมูป่าเกราะเหล็กเพื่อยึดแร่เหล็กดำมาหลอมศาสตรา!',
    spawnTrial(g, tagId) {
      const r1 = spawnEventRaider(g, { ...EP_RAIDER_POOLS[2], boss: true, bossNameTh: 'หัวหน้าลาดตระเวนผาทมิฬ' }, tagId, 0).id;
      const b1 = spawnEventBeast(g, EP_BEAST_TIDE_POOLS[2].spawns[0], tagId, 1).id;
      return [r1, b1];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «คมศาสตราพิชิตศึก» (โจมตีกายภาพ +10%, คริ +4%) · อาวุธจริง «ดาบเหล็กดำผ่าพยัคฆ์» · เหล็กดำ ×10 · ศิลาวิญญาณ +250',
    grantRewards(g) {
      g.money(250, 'รางวัลเนื้อเรื่อง EP.2 (กิ่งศาสตรา)');
      g.s.campKnown = true;
      grantStoryMaterial(g, 'MAT_ORE_BLACK_IRON_1', 10, 'STORY_EP2_MARTIAL');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ดาบเหล็กดำผ่าพยัคฆ์',
        slot: 'WEAPON',
        tier: 2,
        combatMult: 0.15,
        combatStats: { physicalAttack: 22, critRate: 0.05, penetration: 6 }
      });
      for (const h of g.heroes.filter(alive)) root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 18);
    }
  },
  {
    id: 'EP2_ARCANE',
    ep: 2,
    code: 'EP2_ARCANE',
    branchKey: 'ARCANE',
    branchBadgeTh: '🔮 กิ่งเร้นลับแสวงเต๋า',
    parentIds: ['EP1_ROOT'],
    nextNodeIds: ['EP3_A1_FORBIDDEN_ELIXIR', 'EP3_A2_SHADOW_PACT'],
    chapterPhaseTh: 'บทที่ 2 (กิ่งเร้นลับ) · มรรคาเร้นลับและศาสตร์โอสถพิสดาร',
    titleTh: 'EP.2 [กิ่งเร้นลับ] · มรรคาเร้นลับและศาสตร์โอสถพิสดาร',
    subtitleTh: 'สภาศิษย์เลือกศึกษาความลับแห่งฟ้าดิน ปรุงโอสถ ค้นคว้าคัมภีร์ และใช้กลยุทธ์เหนือคาดหมาย',
    loreTh: 'เหล่าศิษย์ผู้ฝักใฝ่ในความรู้เร้นลับและศาสตร์แห่งเต๋าลงมติให้สำนักมุ่งค้นคว้าชีพจรปราณ สมุนไพรวิญญาณ และคัมภีร์โบราณ เมื่ออสรพิษมรกตและผู้ฝึกตนนอกรีตเข้าแย่งชิงแหล่งชาดปราณ ศิษย์เมฆาครามจึงออกช่วงชิงความลับนั้นมาเป็นของสำนัก',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'ARCANE',
      paths: ['DEMON', 'XIAN', 'HEART_SOUL'],
      traits: { curiosity: 1.6, creativity: 1.5, caution: 0.9, ambition: 0.8 },
      reasonLabelTh: 'มุ่งแสวงหาความลับแห่งเต๋า ตำรับโอสถ และวิชาเร้นลับ'
    },
    doctrineSpec: {
      id: 'DOC_EP2_ARCANE',
      ep: 2,
      branchKey: 'ARCANE',
      icon: '🔮',
      nameTh: 'ศาสตร์เร้นลับแสวงเต๋า',
      descTh: 'เพิ่มพลังโจมตีวิชาปราณ +10%, ฟื้นฟูปราณ +12% และปราณสูงสุด +10 ให้ศิษย์ทุกคน',
      mods: { scale: { artAttack: 1.10, qiRegen: 1.12 }, add: { maxQi: 10 } }
    },
    evaluateConditions(g) {
      const aliveHeroes = g.heroes.filter(alive);
      const qualified = aliveHeroes.filter(n => evaluateDiscipleForEp(g, n, 2).qualified);
      return [
        { id: 'c_stage2a', labelTh: cultivationConditionLabelForEp(2), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_res2a', labelTh: 'สะสมสมุนไพรหรือแร่ในคลังสำนักรวม ≥ 15 หน่วย', current: g.count(g.bank, 'MAT_HERB_DEW_GRASS_1') + g.count(g.bank, 'MAT_ORE_BLACK_IRON_1'), target: 15, passed: (g.count(g.bank, 'MAT_HERB_DEW_GRASS_1') + g.count(g.bank, 'MAT_ORE_BLACK_IRON_1')) >= 15 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.2 (กิ่งเร้นลับ) · ช่วงชิงแหล่งชาดปราณจากอสรพิษมรกตและนักพรตนอกรีต',
    trialDescTh: 'ปราบอสรพิษมรกตและนักพรตนอกรีตที่เฝ้าแหล่งชาดโบราณเพื่อนำวัตถุดิบมาเปิดสายวิจัย!',
    spawnTrial(g, tagId) {
      const b1 = spawnEventBeast(g, EP_BEAST_TIDE_POOLS[3].spawns[1], tagId, 0).id;
      const r1 = spawnEventRaider(g, { ...EP_RAIDER_POOLS[2], nameTh: 'นักพรตนอกรีตชิงสมุนไพร' }, tagId, 1).id;
      return [b1, r1];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «ศาสตร์เร้นลับแสวงเต๋า» (วิชาปราณ +10%, ฟื้นปราณ +12%) · เครื่องรางจริง «หยกวิญญาณเร้นเมฆา» · คัมภีร์ยุทธ์ 1 เล่ม · เมล็ดบัวหยก ×3 · ศิลา +230',
    grantRewards(g) {
      g.money(230, 'รางวัลเนื้อเรื่อง EP.2 (กิ่งเร้นลับ)');
      g.s.seedStock.jadeLotus = (g.s.seedStock.jadeLotus || 0) + 3;
      g.s.seedStock.mistOrchid = (g.s.seedStock.mistOrchid || 0) + 3;
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'หยกวิญญาณเร้นเมฆา',
        slot: 'TALISMAN_VESSEL',
        tier: 2,
        combatMult: 0.12,
        combatStats: { artAttack: 18, maxQi: 16, qiRegen: 0.25 }
      });
      grantRealManualAndTeach(g, 2, 3, null);
      for (const h of g.heroes.filter(alive)) root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 18);
    }
  },
  {
    id: 'EP3_R1_SANCTUARY',
    ep: 3,
    code: 'EP3_R1_SANCTUARY',
    branchKey: 'RIGHTEOUS_SANCTUARY',
    branchBadgeTh: '🛡️ รากย่อย: ป้อมปราการพิทักษ์ชน',
    parentIds: ['EP2_RIGHTEOUS'],
    nextNodeIds: ['EP4_GOLDEN_BASTION', 'EP4_BODHI_SCRIPTURE'],
    chapterPhaseTh: 'บทที่ 3 (รากย่อยป้อมปราการ) · ค่ายกลพิทักษ์หุบเขา',
    titleTh: 'EP.3 [รากย่อยป้อมปราการ] · ค่ายกลพิทักษ์หุบเขาและปราการหยก',
    subtitleTh: 'เสริมป้อมปราการสำนัก สร้างหอพิทักษ์ และปกป้องหุบเขาจากฝูงอสูรบุกประชิด',
    loreTh: 'สภาศิษย์สายธรรมะลงมติให้สร้างปราการป้องกันที่แข็งแกร่งดุจขุนเขา เพื่อให้ชาวบ้านและศิษย์รุ่นหลังสามารถบ่มเพาะตบะได้โดยไร้ภัยคุกคาม',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'SANCTUARY',
      paths: ['XIAN', 'BODY', 'GOD'],
      traits: { caution: 1.3, discipline: 1.4, integrity: 1.2, empathy: 1.0 },
      reasonLabelTh: 'ต้องการสร้างป้อมปราการและค่ายกลคุ้มครองสำนักให้มั่นคง'
    },
    doctrineSpec: {
      id: 'DOC_EP3_SANCTUARY',
      ep: 3,
      branchKey: 'RIGHTEOUS_SANCTUARY',
      icon: '🛡️',
      nameTh: 'ปราการศิลาเมฆาพิทักษ์',
      descTh: 'เพิ่มเกราะป้องกัน +14%, พลังชีวิตสูงสุด +18 และหลบหลีก +6 ให้ศิษย์ทุกคน',
      mods: { scale: { armor: 1.14 }, add: { maxHP: 18, evasion: 6 } },
      dailyFood: 3
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 3).qualified);
      const bCount = g.s.buildings.filter(b => b.hp > 0 && b.remaining <= 0).length;
      return [
        { id: 'c_st3', labelTh: cultivationConditionLabelForEp(3), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_bld3', labelTh: 'มีอาคารในสำนักอย่างน้อย 3 หลัง', current: bCount, target: 3, passed: bCount >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.3 (ป้อมปราการ) · ต้านทานเต่าหยกธาราและกองโจรบุกประชิด',
    trialDescTh: 'เต่าหยกธาราและกองโจรผาทมิฬบุกเข้าทดสอบแนวป้องกันหน้าสำนัก!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[4].spawns[0], tagId, 0).id,
        spawnEventRaider(g, EP_RAIDER_POOLS[3], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «ปราการศิลาเมฆาพิทักษ์» · เกราะจริง «เกราะศิลาค่ายกลเมฆา» · ซ่อมแซมอาคารทั้งหมดเต็ม 100% · ไม้ +35 · เหล็กดำ +12 · ศิลา +320',
    grantRewards(g) {
      g.money(320, 'รางวัลเนื้อเรื่อง EP.3 (ป้อมปราการ)');
      g.s.wood += 35;
      grantStoryMaterial(g, 'MAT_ORE_BLACK_IRON_1', 12, 'STORY_EP3_SANCTUARY');
      for (const b of g.s.buildings) b.hp = Math.max(b.hp, 600);
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'เกราะศิลาค่ายกลเมฆา',
        slot: 'ARMOR',
        tier: 3,
        defenseMult: 0.22,
        combatStats: { armor: 26, resistance: 20, maxHP: 30 }
      });
    }
  },
  {
    id: 'EP3_R2_BODHI_HEART',
    ep: 3,
    code: 'EP3_R2_BODHI_HEART',
    branchKey: 'RIGHTEOUS_BODHI',
    branchBadgeTh: '🧘 รากย่อย: โพธิจิตวิญญาณบริสุทธิ์',
    parentIds: ['EP2_RIGHTEOUS'],
    nextNodeIds: ['EP4_BODHI_SCRIPTURE', 'EP4_GOLDEN_BASTION'],
    chapterPhaseTh: 'บทที่ 3 (รากย่อยโพธิจิต) · หอธรรมะชำระจิตมาร',
    titleTh: 'EP.3 [รากย่อยโพธิจิต] · หอธรรมะชำระจิตมารและเปิดชีพจร',
    subtitleTh: 'ขัดเกลาทะเลสำนึก เปิดจุดชีพจรปราณ และสยบมารในใจ',
    loreTh: 'สภาศิษย์สายจิตวิญญาณเห็นพ้องว่าศัตรูที่น่ากลัวที่สุดคือจิตมารในใจตน จึงจัดตั้งพิธีชำระจิตและเปิดชีพจรปราณร่วมกัน',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'BODHI',
      paths: ['HEART_SOUL', 'XIAN'],
      traits: { composure: 1.6, empathy: 1.3, integrity: 1.2, curiosity: 0.8 },
      reasonLabelTh: 'มุ่งเน้นการขัดเกลาจิตวิญญาณ เปิดชีพจรปราณ และสลายจิตมาร'
    },
    doctrineSpec: {
      id: 'DOC_EP3_BODHI',
      ep: 3,
      branchKey: 'RIGHTEOUS_BODHI',
      icon: '🧘',
      nameTh: 'กระจกโพธิจิตไร้ราคี',
      descTh: 'เพิ่มต้านทานปราณ +14%, ความแม่นยำ +8 และต้านสถานะควบคุม +8% ให้ศิษย์ทุกคน',
      mods: { scale: { resistance: 1.14 }, add: { accuracy: 8, controlResist: 0.08 } },
      cultivationBonusPct: 12
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 3).qualified);
      return [
        { id: 'c_st3b', labelTh: cultivationConditionLabelForEp(3), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_br3b', labelTh: 'ทะลวงขอบเขตหรือศึกษาคัมภีร์สะสม ≥ 1 ครั้ง (หรือมีศิษย์ ≥ 3 คน)', current: Math.max(g.s.stats?.breakthroughs || 0, g.heroes.filter(alive).length >= 3 ? 1 : 0), target: 1, passed: (g.s.stats?.breakthroughs || 0) >= 1 || g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.3 (โพธิจิต) · ปราบจิ้งจอกเมฆาหลอนจิตและนักพรตมาร',
    trialDescTh: 'จิ้งจอกเมฆาและนักพรตมารใช้วิชาลวงตารบกวนลานฝึก สยบพวกมันด้วยจิตอันตั้งมั่น!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[3].spawns[0], tagId, 0).id,
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[3], nameTh: 'นักพรตมารลวงจิต' }, tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «กระจกโพธิจิตไร้ราคี» · เปิดจุดชีพจรปราณศิษย์ทุกคน +1 จุด · เครื่องรางจริง «ประคำหยกโพธิ์บริสุทธิ์» · คัมภีร์สายจิต/เซียน 1 เล่ม · ศิลา +320',
    grantRewards(g) {
      g.money(320, 'รางวัลเนื้อเรื่อง EP.3 (โพธิจิต)');
      unlockSectDoctrine(g, this.doctrineSpec);
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) {
          h.jianghu.heartDemon = 0;
          h.jianghu.meridiansV150 = h.jianghu.meridiansV150 || {};
          grantMeridianNodes(g, h, 1);
        }
      }
      grantRealEquipment(g, {
        nameTh: 'ประคำหยกโพธิ์บริสุทธิ์',
        slot: 'TALISMAN_VESSEL',
        tier: 3,
        combatMult: 0.16,
        combatStats: { artAttack: 22, resistance: 22, maxQi: 24, controlResist: 0.08 }
      });
      grantRealManualAndTeach(g, 3, 4, 'HEART_SOUL');
    }
  },
  {
    id: 'EP3_M1_WAR_FORGE',
    ep: 3,
    code: 'EP3_M1_WAR_FORGE',
    branchKey: 'MARTIAL_FORGE',
    branchBadgeTh: '🔨 รากย่อย: โรงหลอมศาสตราสงคราม',
    parentIds: ['EP2_MARTIAL'],
    nextNodeIds: ['EP4_IRON_CONQUEROR', 'EP4_BEAST_SOVEREIGN'],
    chapterPhaseTh: 'บทที่ 3 (รากย่อยศาสตรา) · โรงหลอมศาสตราและทัพหน้า',
    titleTh: 'EP.3 [รากย่อยศาสตรา] · โรงหลอมศาสตราและทัพหน้าบุกค่ายโจร',
    subtitleTh: 'หลอมศาสตราชั้นเลิศติดอาวุธให้ศิษย์ และส่งทัพหน้าตัดเสบียงค่ายโจรผาทมิฬ',
    loreTh: 'สภาศิษย์สายศาสตราลงมติให้เร่งไฟเตาหลอมตีอาวุธวิญญาณและส่งหน่วยจู่โจมเข้าตัดกำลังค่ายโจรผาทมิฬโดยตรง',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'WAR_FORGE',
      paths: ['GOD', 'BODY', 'XIAN'],
      traits: { ambition: 1.5, discipline: 1.3, courage: 1.4 },
      reasonLabelTh: 'ต้องการหลอมศาสตราชั้นเลิศและส่งทัพหน้าบุกขยี้ค่ายโจร'
    },
    doctrineSpec: {
      id: 'DOC_EP3_WAR_FORGE',
      ep: 3,
      branchKey: 'MARTIAL_FORGE',
      icon: '🔨',
      nameTh: 'เตาหลอมศาสตราเทวะสงคราม',
      descTh: 'เพิ่มพลังโจมตีกายภาพ +14%, เจาะเกราะ +8 และความเร็วโจมตี +6% ให้ศิษย์ทุกคน',
      mods: { scale: { physicalAttack: 1.14, attackSpeed: 1.06 }, add: { penetration: 8 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 3).qualified);
      return [
        { id: 'c_st3mf', labelTh: cultivationConditionLabelForEp(3), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_for3', labelTh: 'สร้างโรงหลอมศาสตราหรือมีอาคาร ≥ 3 หลัง', current: g.built('forge') ? 1 : (g.s.buildings.length >= 3 ? 1 : 0), target: 1, passed: !!g.built('forge') || g.s.buildings.length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.3 (โรงหลอมศาสตรา) · บดขยี้ขบวนคุ้มกันเสบียงผาทมิฬ',
    trialDescTh: 'กองคุ้มกันเสบียงของค่ายโจรผาทมิฬ 2 คนกำลังลำเลียงแร่เหล็กและศิลาวิญญาณ บุกชิงมาเป็นของสำนัก!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[3], boss: true, bossNameTh: 'ขุนพลคุ้มเสบียงผาทมิฬ' }, tagId, 0).id,
        spawnEventRaider(g, EP_RAIDER_POOLS[3], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «เตาหลอมศาสตราเทวะสงคราม» · อาวุธจริง 2 ชิ้น «ทวนเหล็กไหลทะลวงทัพ» และ «กระบี่เพลิงเมฆาคราม» · ตัดเสบียงค่ายโจร -40 · ศิลา +350',
    grantRewards(g) {
      g.money(350, 'รางวัลเนื้อเรื่อง EP.3 (โรงหลอมศาสตรา)');
      g.s.campSupplies = Math.max(0, (g.s.campSupplies || 100) - 40);
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ทวนเหล็กไหลทะลวงทัพ',
        slot: 'WEAPON',
        tier: 3,
        combatMult: 0.20,
        combatStats: { physicalAttack: 30, penetration: 10, critDamage: 0.15 }
      }, g.heroes.filter(alive)[0]);
      grantRealEquipment(g, {
        nameTh: 'กระบี่เพลิงเมฆาคราม',
        slot: 'WEAPON',
        tier: 3,
        combatMult: 0.18,
        combatStats: { physicalAttack: 24, artAttack: 26, critRate: 0.06 }
      }, g.heroes.filter(alive)[1] || g.heroes.filter(alive)[0]);
    }
  },
  {
    id: 'EP3_M2_BEAST_DOMINION',
    ep: 3,
    code: 'EP3_M2_BEAST_DOMINION',
    branchKey: 'MARTIAL_BEAST',
    branchBadgeTh: '🐾 รากย่อย: สยบอสูรบรรพกาล',
    parentIds: ['EP2_MARTIAL'],
    nextNodeIds: ['EP4_BEAST_SOVEREIGN', 'EP4_IRON_CONQUEROR'],
    chapterPhaseTh: 'บทที่ 3 (รากย่อยอสูร) · อุทยานสยบอสูรและกลั่นโลหิต',
    titleTh: 'EP.3 [รากย่อยอสูร] · อุทยานสยบอสูรและกลั่นโลหิตบรรพกาล',
    subtitleTh: 'สยบอสูรป่ามาเป็นคู่หูร่วมรบ และนำโลหิตอสูรมาหล่อเลี้ยงกายาเหล็กไหล',
    loreTh: 'สภาศิษย์สายกายาและนักล่าลงมติให้นำพลังอันดุร้ายของสัตว์อสูรในหุบเขามาเป็นกำลังรบของสำนัก ทั้งการผูกพันธสัญญาอสูรคู่หูและการสกัดโลหิตอสูรเสริมกายา',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'BEAST_DOMINION',
      paths: ['BODY', 'DEMON'],
      traits: { courage: 1.5, curiosity: 1.2, aggression: 1.1, empathy: 0.5 },
      reasonLabelTh: 'ต้องการสยบสัตว์อสูรวิญญาณเป็นคู่หูและหลอมกายาด้วยโลหิตอสูร'
    },
    doctrineSpec: {
      id: 'DOC_EP3_BEAST_DOMINION',
      ep: 3,
      branchKey: 'MARTIAL_BEAST',
      icon: '🐾',
      nameTh: 'พันธสัญญาโลหิตอสูรบรรพกาล',
      descTh: 'เพิ่มพลังโจมตีกายภาพ +10%, ความเร็วเคลื่อนที่ +10% และพลังชีวิตสูงสุด +20 ให้ศิษย์ทุกคน',
      mods: { scale: { physicalAttack: 1.10, moveSpeed: 1.10 }, add: { maxHP: 20 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 3).qualified);
      return [
        { id: 'c_st3mb', labelTh: cultivationConditionLabelForEp(3), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_k3mb', labelTh: 'ปราบอสูรหรือศัตรูสะสม ≥ 3 ครั้ง', current: g.s.stats?.kills || 0, target: 3, passed: (g.s.stats?.kills || 0) >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.3 (สยบอสูร) · พิชิตวานรหลังผลึกและจิ้งจอกเมฆาจ่าฝูง',
    trialDescTh: 'สยบวานรหลังผลึกและจิ้งจอกเมฆาจ่าฝูงเพื่อแสดงบารมีจ้าวอสูรแห่งหุบเขา!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[4].spawns[1], tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[3].spawns[0], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «พันธสัญญาโลหิตอสูร» · ได้รับอสูรคู่หูจริง «พยัคฆ์หมอกเมฆาคราม (Tier 3)» ร่วมรบเคียงข้างศิษย์ · โสมโลหิต ×3 · เขี้ยวอสูร ×8 · ศิลา +320',
    grantRewards(g) {
      g.money(320, 'รางวัลเนื้อเรื่อง EP.3 (สยบอสูร)');
      grantStoryMaterial(g, 'MAT_HERB_BLOOD_GINSENG_3', 3, 'STORY_EP3_BEAST');
      grantStoryMaterial(g, 'MAT_BP_WOLF_FANG_1', 8, 'STORY_EP3_BEAST');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealCompanionBeast(g, {
        speciesId: 'BEAST_FROST_MOON_LYNX',
        nameTh: 'พยัคฆ์หมอกเมฆาคราม (คู่พันธสัญญา)',
        tier: 3,
        hp: 260,
        power: 460,
        trust: 72
      });
    }
  },
  {
    id: 'EP3_A1_FORBIDDEN_ELIXIR',
    ep: 3,
    code: 'EP3_A1_FORBIDDEN_ELIXIR',
    branchKey: 'ARCANE_ELIXIR',
    branchBadgeTh: '⚗️ รากย่อย: โอสถสวรรค์เร้นลับ',
    parentIds: ['EP2_ARCANE'],
    nextNodeIds: ['EP4_GRAND_ALCHEMIST', 'EP4_BODHI_SCRIPTURE'],
    chapterPhaseTh: 'บทที่ 3 (รากย่อยโอสถ) · เตาหลอมโอสถสวรรค์และพิษพันปี',
    titleTh: 'EP.3 [รากย่อยโอสถ] · เตาหลอมโอสถสวรรค์และพิษพันปี',
    subtitleTh: 'เปิดหอปรุงยาและสวนสมุนไพรวิญญาณ กลั่นโอสถทิพย์ยกระดับตบะทั้งสำนัก',
    loreTh: 'สภาศิษย์สายปรุงยาลงมติให้ทุ่มเททรัพยากรไปที่การกลั่นโอสถทิพย์และเพาะปลูกสมุนไพรหายาก เพื่อเร่งความเร็วในการทะลวงขอบเขตของศิษย์ทุกคน',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'ELIXIR',
      paths: ['XIAN', 'HEART_SOUL', 'DEMON'],
      traits: { creativity: 1.6, curiosity: 1.4, caution: 1.1 },
      reasonLabelTh: 'ต้องการมุ่งเน้นศาสตร์การหลอมโอสถทิพย์และเพาะปลูกสมุนไพรวิญญาณ'
    },
    doctrineSpec: {
      id: 'DOC_EP3_ELIXIR',
      ep: 3,
      branchKey: 'ARCANE_ELIXIR',
      icon: '⚗️',
      nameTh: 'หอมกรุ่นโอสถทิพย์นิรันดร์',
      descTh: 'เพิ่มฟื้นฟูปราณ +18%, โจมตีวิชาปราณ +10% และเพิ่มประสิทธิภาพการบ่มเพาะตบะ',
      mods: { scale: { qiRegen: 1.18, artAttack: 1.10 }, add: { maxQi: 14 } },
      cultivationBonusPct: 15
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 3).qualified);
      const hasAlchOrGarden = !!g.built('alchemy') || !!g.built('garden') || g.s.buildings.length >= 3;
      return [
        { id: 'c_st3ae', labelTh: cultivationConditionLabelForEp(3), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_alg3', labelTh: 'สร้างหอโอสถ สวนสมุนไพร หรือมีอาคาร ≥ 3 หลัง', current: hasAlchOrGarden ? 1 : 0, target: 1, passed: hasAlchOrGarden }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.3 (โอสถสวรรค์) · ปราบอสรพิษเกล็ดมรกตคู่เพื่อสกัดดีงูพันปี',
    trialDescTh: 'อสรพิษเกล็ดมรกต 2 ตัวปรากฏตัวใกล้แหล่งสมุนไพร ปราบพวกมันเพื่อนำดีงูมาหลอมโอสถทิพย์!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[3].spawns[1], tagId, 0).id,
        spawnEventBeast(g, { ...EP_BEAST_TIDE_POOLS[3].spawns[1], nameTh: 'อสรพิษมรกตจ่าฝูง' }, tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «หอมกรุ่นโอสถทิพย์นิรันดร์» · ได้รับโอสถจริง 6 เม็ดเข้าคลังและสัมภาระศิษย์ · เมล็ดโสมโลหิต ×3 · เมล็ดไผ่อัสนี ×3 · ศิลา +320',
    grantRewards(g) {
      g.money(320, 'รางวัลเนื้อเรื่อง EP.3 (โอสถสวรรค์)');
      g.s.seedStock.bloodGinseng = (g.s.seedStock.bloodGinseng || 0) + 3;
      g.s.seedStock.thunderBamboo = (g.s.seedStock.thunderBamboo || 0) + 3;
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealPills(g, 'REC1100_SUPPORT_QI', 3);
      grantRealPills(g, 'REC1100_SUPPORT_RECOVERY', 3);
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) { h.jianghu.pillToxicity = 0; h.jianghu.poisonAccumulated = 0; }
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 22);
      }
    }
  },
  {
    id: 'EP3_A2_SHADOW_PACT',
    ep: 3,
    code: 'EP3_A2_SHADOW_PACT',
    branchKey: 'ARCANE_SHADOW',
    branchBadgeTh: '🌑 รากย่อย: พันธสัญญาเงาจันทรา',
    parentIds: ['EP2_ARCANE'],
    nextNodeIds: ['EP4_SHADOW_NETHER', 'EP4_GRAND_ALCHEMIST'],
    chapterPhaseTh: 'บทที่ 3 (รากย่อยเงามืด) · เครือข่ายเงาจันทราและจารึกโบราณ',
    titleTh: 'EP.3 [รากย่อยเงามืด] · พันธสัญญาเงาจันทราและจารึกโบราณ',
    subtitleTh: 'ศึกษาคัมภีร์เร้นลับและวิชามารเงา ลอบสังหารศัตรูจากในเงามืด',
    loreTh: 'สภาศิษย์สายเร้นลับลงมติว่าธรรมะและอธรรมล้วนเป็นเพียงเครื่องมือ จึงเปิดรับศาสตร์เงาจันทราและคัมภีร์นอกกรอบเพื่อก้าวข้ามขีดจำกัดเดิม',
    requiredCountAtStage: 2,
    decisionProfile: {
      archetype: 'SHADOW',
      paths: ['DEMON', 'XIAN'],
      traits: { ambition: 1.5, curiosity: 1.4, caution: 1.1, integrity: -0.6 },
      reasonLabelTh: 'ต้องการใช้วิชาเร้นลับและเครือข่ายเงามืดเพื่อก้าวข้ามขีดจำกัดอย่างรวดเร็ว'
    },
    doctrineSpec: {
      id: 'DOC_EP3_SHADOW',
      ep: 3,
      branchKey: 'ARCANE_SHADOW',
      icon: '🌑',
      nameTh: 'ก้าวเงาจันทราสังหาร',
      descTh: 'เพิ่มอัตราคริติคอล +6%, ความแรงคริติคอล +18% และหลบหลีก +8 ให้ศิษย์ทุกคน',
      mods: { add: { critRate: 0.06, critDamage: 0.18, evasion: 8 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 3).qualified);
      return [
        { id: 'c_st3as', labelTh: cultivationConditionLabelForEp(3), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_gold3as', labelTh: 'มีศิลาวิญญาณสำรองในคลังสำนัก ≥ 200 ก้อน', current: g.gold || 0, target: 200, passed: (g.gold || 0) >= 200 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.3 (เงาจันทรา) · ปราบนักล่าค่าหัวทมิฬและพญาอีกาเถ้าดารา',
    trialDescTh: 'ปราบนักล่าค่าหัวทมิฬและพญาอีกาเถ้าดาราเพื่อยึดครองป้ายคำสั่งเงาจันทรา!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[3], boss: true, bossNameTh: 'ทูตเงาจันทราทมิฬ' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[5].spawns[0], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «ก้าวเงาจันทราสังหาร» (คริ +6%, แรงคริ +18%) · ชุดเกราะจริง «คลุมเงาจันทราเร้นกาย» · คัมภีร์วิชามาร/เร้นลับระดับ 4 · ศิลา +360',
    grantRewards(g) {
      g.money(360, 'รางวัลเนื้อเรื่อง EP.3 (เงาจันทรา)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'คลุมเงาจันทราเร้นกาย',
        slot: 'ARMOR',
        tier: 3,
        defenseMult: 0.16,
        combatStats: { armor: 18, evasion: 14, critRate: 0.06, moveSpeed: 8 }
      });
      grantRealManualAndTeach(g, 3, 4, 'DEMON');
    }
  },
  {
    id: 'EP4_GOLDEN_BASTION',
    ep: 4,
    code: 'EP4_GOLDEN_BASTION',
    branchKey: 'GOLDEN_BASTION',
    branchBadgeTh: '🏰 สายปราการทองคำ',
    parentIds: ['EP3_R1_SANCTUARY', 'EP3_R2_BODHI_HEART'],
    nextNodeIds: ['EP5_CELESTIAL_ORTHODOX', 'EP5_SUPREME_MARTIAL'],
    chapterPhaseTh: 'บทที่ 4 · สหพันธ์ผู้พิทักษ์สี่หมู่บ้าน',
    titleTh: 'EP.4 [ปราการทองคำ] · สหพันธ์ผู้พิทักษ์สี่หมู่บ้าน',
    subtitleTh: 'รวมพลังชาวบ้านและผู้ฝึกตนตั้งค่ายกลทองคำ ขับไล่ทัพใหญ่ของโจรผาทมิฬ',
    loreTh: 'ชื่อเสียงด้านคุณธรรมและการปกป้องของสำนักเมฆาครามขจรขจายไปทั่วสี่หมู่บ้านชายแดน เมื่อหัวหน้าค่ายโจรผาทมิฬส่งขุนพลบุกประชิด สำนักจึงตั้งค่ายกลทองคำรับศึกใหญ่',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'GOLDEN_BASTION',
      paths: ['XIAN', 'GOD', 'BODY'],
      traits: { integrity: 1.5, empathy: 1.3, discipline: 1.3 },
      reasonLabelTh: 'มุ่งสถาปนาสหพันธ์ผู้พิทักษ์ชายแดนและค่ายกลป้องกันสูงสุด'
    },
    doctrineSpec: {
      id: 'DOC_EP4_GOLDEN_BASTION',
      ep: 4,
      branchKey: 'GOLDEN_BASTION',
      icon: '🏰',
      nameTh: 'มหาค่ายกลระฆังทองพิทักษ์ชน',
      descTh: 'เพิ่มเกราะ +16%, ต้านทานปราณ +16% และฟื้นปราณ +10% ให้ศิษย์ทุกคน',
      mods: { scale: { armor: 1.16, resistance: 1.16, qiRegen: 1.10 } },
      dailyStones: 12
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 4).qualified);
      return [
        { id: 'c_st4gb', labelTh: cultivationConditionLabelForEp(4), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop4gb', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.4 · สยบขุนพลผาทมิฬและเต่าหยกธารายักษ์',
    trialDescTh: 'ขุนพลผาทมิฬและเต่าหยกธาราบุกโจมตีแนวค่ายกล ปราบพวกมันให้สิ้น!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[4], boss: true, bossNameTh: 'ขุนพลเกราะเหล็กผาทมิฬ' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[4].spawns[0], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «มหาค่ายกลระฆังทอง» · เครื่องรางจริง «ระฆังทองคุ้มภัยเมฆา» · ตรามรดกสำนัก +1 · ศิลา +480',
    grantRewards(g) {
      g.money(480, 'รางวัลเนื้อเรื่อง EP.4 (ปราการทองคำ)');
      g.s.legacy = Math.min(3, (g.s.legacy || 0) + 1);
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ระฆังทองคุ้มภัยเมฆา',
        slot: 'TALISMAN_VESSEL',
        tier: 4,
        defenseMult: 0.24,
        combatStats: { armor: 28, resistance: 28, maxHP: 35, controlResist: 0.10 }
      });
    }
  },
  {
    id: 'EP4_BODHI_SCRIPTURE',
    ep: 4,
    code: 'EP4_BODHI_SCRIPTURE',
    branchKey: 'BODHI_SCRIPTURE',
    branchBadgeTh: '📜 สายหอคัมภีร์โพธิ์',
    parentIds: ['EP3_R1_SANCTUARY', 'EP3_R2_BODHI_HEART', 'EP3_A1_FORBIDDEN_ELIXIR'],
    nextNodeIds: ['EP5_CELESTIAL_ORTHODOX', 'EP5_MYRIAD_UNORTHODOX'],
    chapterPhaseTh: 'บทที่ 4 · มหาวิหารโพธิสัตว์และจารึกเซียน',
    titleTh: 'EP.4 [หอคัมภีร์โพธิ์] · มหาวิหารโพธิสัตว์และจารึกเซียน',
    subtitleTh: 'รวบรวมคัมภีร์ยุทธ์โบราณและถ่ายทอดเคล็ดวิชาเซียน-จิตให้ศิษย์ทั้งสำนัก',
    loreTh: 'สำนักเมฆาครามกลายเป็นศูนย์กลางแห่งปัญญาและคัมภีร์โบราณ เมื่อผู้ฝึกตนนอกด่านบุกมาหวังชิงจารึกเซียน เหล่าศิษย์จึงสำแดงอานุภาพแห่งวิชาที่ศึกษาเล่าเรียนมา',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'BODHI_SCRIPTURE',
      paths: ['XIAN', 'HEART_SOUL'],
      traits: { curiosity: 1.5, composure: 1.4, creativity: 1.2 },
      reasonLabelTh: 'ต้องการยกระดับหอคัมภีร์และถ่ายทอดสุดยอดวิชาเซียน-โพธิจิต'
    },
    doctrineSpec: {
      id: 'DOC_EP4_BODHI_SCRIPTURE',
      ep: 4,
      branchKey: 'BODHI_SCRIPTURE',
      icon: '📜',
      nameTh: 'ปัญญาจารึกหมื่นคัมภีร์',
      descTh: 'เพิ่มพลังโจมตีวิชาปราณ +16%, ปราณสูงสุด +20 และความแม่นยำ +10 ให้ศิษย์ทุกคน',
      mods: { scale: { artAttack: 1.16 }, add: { maxQi: 20, accuracy: 10 } },
      cultivationBonusPct: 18
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 4).qualified);
      return [
        { id: 'c_st4bs', labelTh: cultivationConditionLabelForEp(4), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop4bs', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.4 · ปราบจอมโจรชิงคัมภีร์และพญาอีกาเถ้าดารา',
    trialDescTh: 'ปราบผู้บุกรุกที่หมายชิงจารึกโบราณของสำนัก!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[4], boss: true, bossNameTh: 'มารชิงคัมภีร์นอกด่าน' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[5].spawns[0], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «ปัญญาจารึกหมื่นคัมภีร์» · คัมภีร์ระดับสูง 2 เล่มสำหรับให้ศิษย์ศึกษา · อาวุธจริง «กระบี่จารึกอักษรเซียน» · ศิลา +460',
    grantRewards(g) {
      g.money(460, 'รางวัลเนื้อเรื่อง EP.4 (หอคัมภีร์โพธิ์)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'กระบี่จารึกอักษรเซียน',
        slot: 'WEAPON',
        tier: 4,
        combatMult: 0.22,
        combatStats: { artAttack: 34, physicalAttack: 20, maxQi: 25, accuracy: 10 }
      });
      grantRealManualAndTeach(g, 4, 5, 'XIAN', g.heroes.filter(alive)[0]);
      grantRealManualAndTeach(g, 4, 5, 'HEART_SOUL', g.heroes.filter(alive)[1] || g.heroes.filter(alive)[0]);
    }
  },
  {
    id: 'EP4_IRON_CONQUEROR',
    ep: 4,
    code: 'EP4_IRON_CONQUEROR',
    branchKey: 'IRON_CONQUEROR',
    branchBadgeTh: '🔥 สายทัพศาสตราพิชิตศึก',
    parentIds: ['EP3_M1_WAR_FORGE', 'EP3_M2_BEAST_DOMINION'],
    nextNodeIds: ['EP5_SUPREME_MARTIAL', 'EP5_CELESTIAL_ORTHODOX'],
    chapterPhaseTh: 'บทที่ 4 · ถล่มค่ายโจรผาทมิฬสิ้นซาก',
    titleTh: 'EP.4 [ทัพศาสตรา] · ถล่มค่ายโจรผาทมิฬสิ้นซาก',
    subtitleTh: 'กรีฑาทัพศิษย์บุกสังหารหัวหน้าโจรเถี่ยหู่และยึดครองคลังแสงผาทมิฬ',
    loreTh: 'ด้วยศาสตราอันคมกริบและกำลังพลที่พร้อมสรรพ สำนักเมฆาครามเปิดฉากบุกถล่มค่ายโจรผาทมิฬเพื่อขจัดเสี้ยนหนามชายแดนอย่างเด็ดขาด',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'IRON_CONQUEROR',
      paths: ['BODY', 'GOD', 'XIAN'],
      traits: { courage: 1.6, aggression: 1.5, ambition: 1.4 },
      reasonLabelTh: 'ต้องการกรีฑาทัพถล่มค่ายโจรผาทมิฬและยึดคลังแสงมาเป็นของสำนัก'
    },
    doctrineSpec: {
      id: 'DOC_EP4_IRON_CONQUEROR',
      ep: 4,
      branchKey: 'IRON_CONQUEROR',
      icon: '🔥',
      nameTh: 'เดชะทัพศาสตราพิชิตผาทมิฬ',
      descTh: 'เพิ่มโจมตีกายภาพ +16%, คริติคอล +5% และความแรงคริติคอล +15% ให้ศิษย์ทุกคน',
      mods: { scale: { physicalAttack: 1.16 }, add: { critRate: 0.05, critDamage: 0.15 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 4).qualified);
      return [
        { id: 'c_st4ic', labelTh: cultivationConditionLabelForEp(4), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_k4ic', labelTh: 'ปราบศัตรูและอสูรสะสม ≥ 4 ครั้ง', current: g.s.stats?.kills || 0, target: 4, passed: (g.s.stats?.kills || 0) >= 4 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.4 · เด็ดหัวขุนพลใหญ่เถี่ยหู่แห่งผาทมิฬ',
    trialDescTh: 'ขุนพลใหญ่แห่งค่ายผาทมิฬและองครักษ์นำกำลังออกมารับศึก!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[4], boss: true, bossNameTh: 'เถี่ยหู่ · จอมโจรผาทมิฬ' }, tagId, 0).id,
        spawnEventRaider(g, EP_RAIDER_POOLS[4], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «เดชะทัพศาสตรา» · อาวุธจริงระดับ 4 «ง้าวมังกรเหล็กผาทมิฬ» · ทองแดงวิญญาณ ×8 · หยกเมฆา ×4 · ศิลา +520',
    grantRewards(g) {
      g.money(520, 'รางวัลเนื้อเรื่อง EP.4 (ทัพศาสตรา)');
      g.s.campSupplies = 0;
      grantStoryMaterial(g, 'MAT_ORE_SPIRIT_COPPER_2', 8, 'STORY_EP4_CONQUEROR');
      grantStoryMaterial(g, 'MAT_ORE_CLOUD_JADE_3', 4, 'STORY_EP4_CONQUEROR');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ง้าวมังกรเหล็กผาทมิฬ',
        slot: 'WEAPON',
        tier: 4,
        combatMult: 0.25,
        combatStats: { physicalAttack: 38, critRate: 0.07, critDamage: 0.20, penetration: 12 }
      });
    }
  },
  {
    id: 'EP4_BEAST_SOVEREIGN',
    ep: 4,
    code: 'EP4_BEAST_SOVEREIGN',
    branchKey: 'BEAST_SOVEREIGN',
    branchBadgeTh: '🐉 สายจ้าวอสูรหมื่นวิญญาณ',
    parentIds: ['EP3_M1_WAR_FORGE', 'EP3_M2_BEAST_DOMINION'],
    nextNodeIds: ['EP5_SUPREME_MARTIAL', 'EP5_MYRIAD_UNORTHODOX'],
    chapterPhaseTh: 'บทที่ 4 · จ้าวอสูรหมื่นวิญญาณแห่งหุบเขาเมฆา',
    titleTh: 'EP.4 [จ้าวอสูร] · จ้าวอสูรหมื่นวิญญาณแห่งหุบเขาเมฆา',
    subtitleTh: 'สยบพยัคฆ์จันทราเหมันต์มาเป็นอสูรคู่หูระดับสูง และปลุกสายเลือดอสูรในกายศิษย์',
    loreTh: 'สำนักเมฆาครามก้าวขึ้นเป็นผู้ปกครองเหล่าสรรพสัตว์วิญญาณในหุบเขา เมื่อพยัคฆ์จันทราเหมันต์ลงมาจากยอดเขา เหล่าศิษย์จึงออกพิสูจน์สิทธิ์แห่งจ้าวอสูร',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'BEAST_SOVEREIGN',
      paths: ['BODY', 'DEMON', 'GOD'],
      traits: { courage: 1.5, curiosity: 1.3, empathy: 0.8 },
      reasonLabelTh: 'มุ่งสร้างกองทัพอสูรคู่หูและหลอมรวมสายเลือดอสูรบรรพกาล'
    },
    doctrineSpec: {
      id: 'DOC_EP4_BEAST_SOVEREIGN',
      ep: 4,
      branchKey: 'BEAST_SOVEREIGN',
      icon: '🐉',
      nameTh: 'บารมีจ้าวอสูรหมื่นวิญญาณ',
      descTh: 'เพิ่มโจมตีกายภาพ +12%, โจมตีวิชา +12%, พลังชีวิตสูงสุด +26 และความเร็วเคลื่อนที่ +10%',
      mods: { scale: { physicalAttack: 1.12, artAttack: 1.12, moveSpeed: 1.10 }, add: { maxHP: 26 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 4).qualified);
      return [
        { id: 'c_st4bsov', labelTh: cultivationConditionLabelForEp(4), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pet4', labelTh: 'มีอสูรวิญญาณในหุบเขาหรือคู่หู ≥ 1 ตัว', current: (g.s.realm?.pets?.length || 0) + (g.s.beasts?.length || 0), target: 1, passed: ((g.s.realm?.pets?.length || 0) + (g.s.beasts?.length || 0)) >= 1 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.4 · สยบพยัคฆ์ดาวจันทราเหมันต์และวานรผลึก',
    trialDescTh: 'เอาชนะพยัคฆ์ดาวจันทราเหมันต์เพื่อรับมันเป็นอสูรคู่หูระดับสูงของสำนัก!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[5].spawns[1], tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[4].spawns[1], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «บารมีจ้าวอสูรหมื่นวิญญาณ» · ได้รับอสูรคู่หูจริงระดับ 4 «พยัคฆ์ดาวจันทราเหมันต์» · เกราะจริง «เกราะเกล็ดอสูรเหมันต์» · ศิลา +480',
    grantRewards(g) {
      g.money(480, 'รางวัลเนื้อเรื่อง EP.4 (จ้าวอสูร)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealCompanionBeast(g, {
        speciesId: 'BEAST_FROST_MOON_LYNX',
        nameTh: 'พยัคฆ์ดาวจันทราเหมันต์ (ราชันย์คู่หู)',
        tier: 4,
        hp: 360,
        power: 720,
        trust: 80
      });
      grantRealEquipment(g, {
        nameTh: 'เกราะเกล็ดอสูรเหมันต์',
        slot: 'ARMOR',
        tier: 4,
        defenseMult: 0.24,
        combatStats: { armor: 30, resistance: 24, maxHP: 32 }
      });
    }
  },
  {
    id: 'EP4_GRAND_ALCHEMIST',
    ep: 4,
    code: 'EP4_GRAND_ALCHEMIST',
    branchKey: 'GRAND_ALCHEMIST',
    branchBadgeTh: '🏺 สายตำหนักโอสถเก้าสุริยัน',
    parentIds: ['EP3_A1_FORBIDDEN_ELIXIR', 'EP3_A2_SHADOW_PACT'],
    nextNodeIds: ['EP5_MYRIAD_UNORTHODOX', 'EP5_CELESTIAL_ORTHODOX'],
    chapterPhaseTh: 'บทที่ 4 · ตำหนักโอสถเก้าสุริยันและสวนทิพย์',
    titleTh: 'EP.4 [ราชันย์โอสถ] · ตำหนักโอสถเก้าสุริยันและสวนทิพย์',
    subtitleTh: 'หลอมโอสถทิพย์ระดับสูง เปิดจุดชีพจรปราณ และยกระดับอายุขัยศิษย์ทั้งสำนัก',
    loreTh: 'กลิ่นหอมของโอสถทิพย์จากเตาหลอมเมฆาครามดึงดูดทั้งอสูรวิญญาณและผู้ฝึกตนจากทั่วสารทิศ หากสำนักคุ้มครองเตาหลอมสำเร็จ โอสถชุดนี้จะยกระดับรากฐานของศิษย์ทุกคนอย่างก้าวกระโดด',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'GRAND_ALCHEMIST',
      paths: ['XIAN', 'HEART_SOUL', 'DEMON'],
      traits: { creativity: 1.6, curiosity: 1.5, caution: 1.2 },
      reasonLabelTh: 'มุ่งกลั่นโอสถทิพย์เก้าสุริยันเพื่อยกระดับรากฐานและอายุขัยของศิษย์'
    },
    doctrineSpec: {
      id: 'DOC_EP4_GRAND_ALCHEMIST',
      ep: 4,
      branchKey: 'GRAND_ALCHEMIST',
      icon: '🏺',
      nameTh: 'เตาหลอมโอสถเก้าสุริยัน',
      descTh: 'เพิ่มฟื้นฟูปราณ +22%, พลังวิชาปราณ +14% และพลังชีวิตสูงสุด +22 ให้ศิษย์ทุกคน',
      mods: { scale: { qiRegen: 1.22, artAttack: 1.14 }, add: { maxHP: 22, maxQi: 18 } },
      cultivationBonusPct: 20
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 4).qualified);
      return [
        { id: 'c_st4ga', labelTh: cultivationConditionLabelForEp(4), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop4ga', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.4 · คุ้มกันเตาหลอมจากพญาอีกาเถ้าดาราและทูตชิงโอสถ',
    trialDescTh: 'ปกป้องเตาหลอมโอสถจากศัตรูที่บุกมาชิงโอสถเก้าสุริยัน!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[5].spawns[0], tagId, 0).id,
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[4], boss: true, bossNameTh: 'มารโอสถพิษนอกด่าน' }, tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «เตาหลอมโอสถเก้าสุริยัน» · โอสถทิพย์จริง 8 เม็ด · เปิดชีพจรปราณศิษย์ทุกคน +1 จุด · อายุขัย +5 ปี · ศิลา +480',
    grantRewards(g) {
      g.money(480, 'รางวัลเนื้อเรื่อง EP.4 (ตำหนักโอสถ)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealPills(g, 'REC1100_SUPPORT_QI', 4, { nameTh: 'โอสถปราณเก้าสุริยัน', quality: 'TRANSCENDENT', effect: { restoreQi: 85, cultivationProgress: 18 } });
      grantRealPills(g, 'REC1100_SUPPORT_RECOVERY', 4, { nameTh: 'โอสถทิพย์สมานชีพจร', quality: 'TRANSCENDENT', effect: { healHealth: 75, restoreQi: 45 } });
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) {
          grantStoryLifespan(h, 5, this.id);
          h.jianghu.meridiansV150 = h.jianghu.meridiansV150 || {};
          grantMeridianNodes(g, h, 1);
        }
      }
    }
  },
  {
    id: 'EP4_SHADOW_NETHER',
    ep: 4,
    code: 'EP4_SHADOW_NETHER',
    branchKey: 'SHADOW_NETHER',
    branchBadgeTh: '🩸 สายตำหนักมารเงาโลหิต',
    parentIds: ['EP3_A1_FORBIDDEN_ELIXIR', 'EP3_A2_SHADOW_PACT'],
    nextNodeIds: ['EP5_MYRIAD_UNORTHODOX', 'EP5_SUPREME_MARTIAL'],
    chapterPhaseTh: 'บทที่ 4 · ตำหนักมารเงาโลหิตและตลาดมืด',
    titleTh: 'EP.4 [ศาลเงาโลหิต] · ตำหนักมารเงาโลหิตและตลาดมืดชายแดน',
    subtitleTh: 'ครอบครองเครือข่ายข่าวกรองและตลาดมืด สังหารผู้คุมกฎที่ขวางทางสำนัก',
    loreTh: 'สำนักเมฆาครามแผ่อิทธิพลในเงามืดจนควบคุมเส้นทางค้าลับและข่าวกรองชายแดน เมื่อผู้คุมกฎจากสำนักอื่นเข้ามาแทรกแซง ศาลเงาโลหิตจึงเปิดฉากพิพากษา',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'SHADOW_NETHER',
      paths: ['DEMON', 'BODY'],
      traits: { ambition: 1.6, aggression: 1.3, curiosity: 1.3, integrity: -0.7 },
      reasonLabelTh: 'มุ่งครอบครองเครือข่ายเงามืดและวิชาสังหารไร้ร่องรอย'
    },
    doctrineSpec: {
      id: 'DOC_EP4_SHADOW_NETHER',
      ep: 4,
      branchKey: 'SHADOW_NETHER',
      icon: '🩸',
      nameTh: 'อาณาเขตศาลเงาโลหิต',
      descTh: 'เพิ่มคริติคอล +8%, ความแรงคริติคอล +22%, เจาะเกราะ +10 และรายได้ตลาดมืด +15 ศิลา/วัน',
      mods: { add: { critRate: 0.08, critDamage: 0.22, penetration: 10, evasion: 8 } },
      dailyStones: 15
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 4).qualified);
      return [
        { id: 'c_st4sn', labelTh: cultivationConditionLabelForEp(4), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_k4sn', labelTh: 'ปราบศัตรูสะสม ≥ 3 ครั้ง', current: g.s.stats?.kills || 0, target: 3, passed: (g.s.stats?.kills || 0) >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.4 · สังหารทูตโลหิตและยึดตราประทับตลาดมืด',
    trialDescTh: 'ทูตโลหิตและองครักษ์บุกมาท้าชิงอำนาจเหนือเครือข่ายเงา สังหารพวกมันให้สิ้น!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[5], boss: true, bossNameTh: 'ทูตโลหิตไร้เงา' }, tagId, 0).id,
        spawnEventRaider(g, EP_RAIDER_POOLS[4], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «อาณาเขตศาลเงาโลหิต» · อาวุธจริง «เคียวโลหิตเร้นวิญญาณ» · คัมภีร์ต้องห้ามระดับ 4–5 · ศิลา +550',
    grantRewards(g) {
      g.money(550, 'รางวัลเนื้อเรื่อง EP.4 (ศาลเงาโลหิต)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'เคียวโลหิตเร้นวิญญาณ',
        slot: 'WEAPON',
        tier: 4,
        combatMult: 0.26,
        combatStats: { physicalAttack: 32, artAttack: 32, critRate: 0.08, critDamage: 0.25, penetration: 12 }
      });
      grantRealManualAndTeach(g, 4, 5, 'DEMON');
    }
  },
  {
    id: 'EP5_CELESTIAL_ORTHODOX',
    ep: 5,
    code: 'EP5_CELESTIAL_ORTHODOX',
    branchKey: 'CELESTIAL_ORTHODOX',
    branchBadgeTh: '☯ เสาหลักสวรรค์เที่ยงธรรม',
    parentIds: ['EP4_GOLDEN_BASTION', 'EP4_BODHI_SCRIPTURE', 'EP4_IRON_CONQUEROR', 'EP4_GRAND_ALCHEMIST'],
    nextNodeIds: ['EP6_ORTHODOX_SUMMIT', 'EP6_MARTIAL_WARLORD'],
    chapterPhaseTh: 'บทที่ 5 · สหพันธ์เซียนเทวะพิทักษ์แผ่นดิน',
    titleTh: 'EP.5 [เสาหลักสวรรค์] · สหพันธ์เซียนเทวะพิทักษ์แผ่นดิน',
    subtitleTh: 'ยกระดับศิษย์สู่ขั้นกลาง (ขั้น 3–4) และตั้งหอสืบทอดคัมภีร์เซียนเทวะ',
    loreTh: 'สำนักเมฆาครามก้าวขึ้นเป็นเสาหลักแห่งฝ่ายธรรมะและวิถีเซียนเทวะ เหล่าศิษย์เอกบรรลุขอบเขตขั้นกลางและพร้อมรับมือภัยคุกคามระดับภูมิภาค',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'CELESTIAL_ORTHODOX',
      paths: ['XIAN', 'HEART_SOUL', 'GOD'],
      traits: { integrity: 1.5, empathy: 1.3, composure: 1.3 },
      reasonLabelTh: 'ต้องการสถาปนาสำนักเป็นเสาหลักแห่งมรรคาสวรรค์และคุณธรรม'
    },
    doctrineSpec: {
      id: 'DOC_EP5_CELESTIAL',
      ep: 5,
      branchKey: 'CELESTIAL_ORTHODOX',
      icon: '☯',
      nameTh: 'รัศมีเซียนเทวะค้ำฟ้า',
      descTh: 'เพิ่มพลังวิชาปราณ +18%, ต้านทานปราณ +18%, เกราะ +14% และฟื้นปราณ +15%',
      mods: { scale: { artAttack: 1.18, resistance: 1.18, armor: 1.14, qiRegen: 1.15 } },
      dailyStones: 16
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 5).qualified);
      return [
        { id: 'c_st5c', labelTh: cultivationConditionLabelForEp(5), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_bld5c', labelTh: 'มีอาคารในสำนัก ≥ 3 หลัง', current: g.s.buildings.length, target: 3, passed: g.s.buildings.length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.5 · ปราบพยัคฆ์ดาวจันทราเหมันต์และทูตมารบุกหุบเขา',
    trialDescTh: 'พิสูจน์บารมีเสาหลักสวรรค์ด้วยการสยบพยัคฆ์เหมันต์และทูตมาร!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[5].spawns[1], tagId, 0).id,
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[5], boss: true, bossNameTh: 'ทูตมารทำลายค่ายกล' }, tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «รัศมีเซียนเทวะค้ำฟ้า» · อาวุธจริงระดับ 5 «กระบี่เซียนดาราสวรรค์» · คัมภีร์ระดับ 5 · ศิลา +650',
    grantRewards(g) {
      g.money(650, 'รางวัลเนื้อเรื่อง EP.5 (เสาหลักสวรรค์)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'กระบี่เซียนดาราสวรรค์',
        slot: 'WEAPON',
        tier: 5,
        combatMult: 0.28,
        combatStats: { artAttack: 42, physicalAttack: 30, accuracy: 12, maxQi: 30 }
      });
      grantRealManualAndTeach(g, 4, 5, 'XIAN');
    }
  },
  {
    id: 'EP5_SUPREME_MARTIAL',
    ep: 5,
    code: 'EP5_SUPREME_MARTIAL',
    branchKey: 'SUPREME_MARTIAL',
    branchBadgeTh: '⚡ เสาหลักยุทธ์ไร้พ่าย',
    parentIds: ['EP4_GOLDEN_BASTION', 'EP4_IRON_CONQUEROR', 'EP4_BEAST_SOVEREIGN', 'EP4_SHADOW_NETHER'],
    nextNodeIds: ['EP6_MARTIAL_WARLORD', 'EP6_ORTHODOX_SUMMIT'],
    chapterPhaseTh: 'บทที่ 5 · สำนักยุทธ์ไร้พ่ายและกองทัพอสูร',
    titleTh: 'EP.5 [เสาหลักจอมภพ] · สำนักยุทธ์ไร้พ่ายและกองทัพอสูร',
    subtitleTh: 'หลอมรวมพลังกายา เทวะ และอสูรคู่หู ก้าวขึ้นเป็นขุมกำลังรบอันดับหนึ่งแห่งชายแดน',
    loreTh: 'ทุกสำนักรอบชายแดนต่างครั่นคร้ามต่ออานุภาพการศึกของสำนักเมฆาคราม ทั้งคมศาสตราและอสูรคู่หูที่พร้อมบดขยี้ทุกผู้บุกรุก',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'SUPREME_MARTIAL',
      paths: ['BODY', 'GOD'],
      traits: { courage: 1.6, ambition: 1.5, aggression: 1.3 },
      reasonLabelTh: 'มุ่งสถาปนาขุมกำลังยุทธ์ไร้พ่ายที่สยบทุกสำนักด้วยกำลังรบ'
    },
    doctrineSpec: {
      id: 'DOC_EP5_MARTIAL',
      ep: 5,
      branchKey: 'SUPREME_MARTIAL',
      icon: '⚡',
      nameTh: 'กายาเทวะสงครามไร้พ่าย',
      descTh: 'เพิ่มโจมตีกายภาพ +20%, ความเร็วโจมตี +10%, เกราะ +15% และพลังชีวิตสูงสุด +30',
      mods: { scale: { physicalAttack: 1.20, attackSpeed: 1.10, armor: 1.15 }, add: { maxHP: 30 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 5).qualified);
      return [
        { id: 'c_st5m', labelTh: cultivationConditionLabelForEp(5), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_k5m', labelTh: 'ปราบศัตรูและอสูรสะสม ≥ 5 ครั้ง', current: g.s.stats?.kills || 0, target: 5, passed: (g.s.stats?.kills || 0) >= 5 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.5 · พิชิตพญาหมีเหมันต์และขุนพลศึกนอกด่าน',
    trialDescTh: 'พญาหมีเหมันต์และขุนพลศึกนอกด่านบุกมาท้าชิงความเป็นจ้าวแห่งกำลังรบ!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[6].spawns[0], tagId, 0).id,
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[5], boss: true, bossNameTh: 'ขุนพลศึกเกราะอัสนี' }, tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «กายาเทวะสงครามไร้พ่าย» · อาวุธจริงระดับ 5 «ขวานศึกเทวะผ่าขุนเขา» · อสูรคู่หูระดับ 4 · ศิลา +680',
    grantRewards(g) {
      g.money(680, 'รางวัลเนื้อเรื่อง EP.5 (เสาหลักจอมภพ)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ขวานศึกเทวะผ่าขุนเขา',
        slot: 'WEAPON',
        tier: 5,
        combatMult: 0.30,
        combatStats: { physicalAttack: 46, penetration: 16, critDamage: 0.25, maxHP: 25 }
      });
      grantRealCompanionBeast(g, {
        speciesId: 'BEAST_FROST_BEAR',
        nameTh: 'หมีเหมันต์เกราะศิลา (คู่หูศึก)',
        tier: 4,
        hp: 420,
        power: 820,
        trust: 78
      });
    }
  },
  {
    id: 'EP5_MYRIAD_UNORTHODOX',
    ep: 5,
    code: 'EP5_MYRIAD_UNORTHODOX',
    branchKey: 'MYRIAD_UNORTHODOX',
    branchBadgeTh: '🌀 เสาหลักเร้นลับนอกกรอบ',
    parentIds: ['EP4_BODHI_SCRIPTURE', 'EP4_BEAST_SOVEREIGN', 'EP4_GRAND_ALCHEMIST', 'EP4_SHADOW_NETHER'],
    nextNodeIds: ['EP6_ABYSSAL_PACT', 'EP6_ORTHODOX_SUMMIT'],
    chapterPhaseTh: 'บทที่ 5 · ตำหนักหมื่นพิษและคัมภีร์นอกกรอบ',
    titleTh: 'EP.5 [เสาหลักเร้นลับ] · ตำหนักหมื่นพิษและคัมภีร์นอกกรอบ',
    subtitleTh: 'ผสานศาสตร์โอสถพิสดาร วิชามารเร้นลับ และคัมภีร์โบราณเข้าด้วยกัน',
    loreTh: 'สำนักเมฆาครามไม่ยึดติดกับกฎเกณฑ์ของฝ่ายธรรมะหรืออธรรม แต่หลอมรวมทั้งศาสตร์โอสถทิพย์และวิชาเร้นลับจนกลายเป็นขุมกำลังที่ไม่มีใครหยั่งถึง',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'MYRIAD_UNORTHODOX',
      paths: ['DEMON', 'XIAN', 'HEART_SOUL'],
      traits: { curiosity: 1.6, creativity: 1.6, ambition: 1.3 },
      reasonLabelTh: 'มุ่งผสานศาสตร์เร้นลับ โอสถพิสดาร และคัมภีร์นอกกรอบเหนือข้อจำกัด'
    },
    doctrineSpec: {
      id: 'DOC_EP5_UNORTHODOX',
      ep: 5,
      branchKey: 'MYRIAD_UNORTHODOX',
      icon: '🌀',
      nameTh: 'มรรคาหมื่นแปรผันไร้ลักษณ์',
      descTh: 'เพิ่มโจมตีวิชาปราณ +18%, อัตราคริติคอล +7%, หลบหลีก +10 และฟื้นปราณ +18%',
      mods: { scale: { artAttack: 1.18, qiRegen: 1.18 }, add: { critRate: 0.07, evasion: 10 } },
      cultivationBonusPct: 20
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 5).qualified);
      return [
        { id: 'c_st5u', labelTh: cultivationConditionLabelForEp(5), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop5u', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.5 · สยบผู้คุมกฎสำนักมารและอสูรเงาจันทรา',
    trialDescTh: 'ผู้คุมกฎสำนักมารบุกมาทวงคัมภีร์ต้องห้าม สยบพวกมันเพื่อครอบครองศาสตร์เร้นลับอย่างสมบูรณ์!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[6], boss: true, bossNameTh: 'ผู้คุมกฎเงาโลหิต' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[5].spawns[1], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «มรรคาหมื่นแปรผันไร้ลักษณ์» · เครื่องรางจริงระดับ 5 «กระจกเงาหมื่นมายา» · โอสถทิพย์ ×6 · คัมภีร์ระดับ 5 · ศิลา +660',
    grantRewards(g) {
      g.money(660, 'รางวัลเนื้อเรื่อง EP.5 (เสาหลักเร้นลับ)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'กระจกเงาหมื่นมายา',
        slot: 'TALISMAN_VESSEL',
        tier: 5,
        combatMult: 0.28,
        combatStats: { artAttack: 40, evasion: 14, critRate: 0.08, maxQi: 32 }
      });
      grantRealPills(g, 'REC1100_SUPPORT_QI', 6);
      grantRealManualAndTeach(g, 5, 6, null);
    }
  },
  {
    id: 'EP6_ORTHODOX_SUMMIT',
    ep: 6,
    code: 'EP6_ORTHODOX_SUMMIT',
    branchKey: 'ORTHODOX_SUMMIT',
    branchBadgeTh: '🏔️ ชุมนุมยุทธภพห้ายอดเขา',
    parentIds: ['EP5_CELESTIAL_ORTHODOX', 'EP5_SUPREME_MARTIAL', 'EP5_MYRIAD_UNORTHODOX'],
    nextNodeIds: ['EP7_SEAL_RIFT', 'EP7_HARVEST_RIFT'],
    chapterPhaseTh: 'บทที่ 6 · ชุมนุมยุทธภพห้ายอดเขาและศึกทูตสำนักใหญ่',
    titleTh: 'EP.6 [ชุมนุมห้ายอดเขา] · ศึกประลองประกาศศักดาเหนือสำนักใหญ่',
    subtitleTh: 'ต้อนรับและเอาชนะยอดฝีมือจากสำนักใหญ่ในชุมนุมยุทธภพ',
    loreTh: 'เมื่อสำนักเมฆาครามเติบโตจนทัดเทียมสำนักใหญ่ในแคว้น ทูตและยอดฝีมือจากห้ายอดเขาจึงเดินทางมาขอท้าพิสูจน์ตบะขั้นที่ 4–5 ของศิษย์เอกในสำนัก',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'ORTHODOX_SUMMIT',
      paths: ['XIAN', 'HEART_SOUL', 'GOD'],
      traits: { integrity: 1.4, composure: 1.4, ambition: 1.2 },
      reasonLabelTh: 'ต้องการประกาศเกียรติภูมิสำนักในชุมนุมยุทธภพห้ายอดเขาอย่างสง่างาม'
    },
    doctrineSpec: {
      id: 'DOC_EP6_SUMMIT',
      ep: 6,
      branchKey: 'ORTHODOX_SUMMIT',
      icon: '🏔️',
      nameTh: 'ผู้นำพันธมิตรห้ายอดเขา',
      descTh: 'เพิ่มพลังโจมตีทั้งกายภาพและวิชา +18%, ต้านทาน +18% และส่งส่วยพันธมิตร +22 ศิลา/วัน',
      mods: { scale: { physicalAttack: 1.18, artAttack: 1.18, resistance: 1.18 } },
      dailyStones: 22
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 6).qualified);
      return [
        { id: 'c_st6o', labelTh: cultivationConditionLabelForEp(6), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop6o', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.6 · ประลองชนะยอดฝีมือทูตห้ายอดเขาและพญาหมีเหมันต์',
    trialDescTh: 'เอาชนะตัวแทนจากสำนักใหญ่และอสูรเหมันต์เพื่อขึ้นเป็นผู้นำพันธมิตรห้ายอดเขา!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[6], boss: true, bossNameTh: 'ปรมาจารย์เจี้ยนอู๋จี๋ · ทูตห้ายอดเขา' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[6].spawns[0], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «ผู้นำพันธมิตรห้ายอดเขา» · ศิษย์ใหม่ระดับสูงเข้าสำนัก 1 คน · อาวุธระดับ 5 · เหล็กอัสนีคราม ×5 · ศิลา +900',
    grantRewards(g) {
      g.money(900, 'รางวัลเนื้อเรื่อง EP.6 (ชุมนุมห้ายอดเขา)');
      grantStoryMaterial(g, 'MAT_ORE_THUNDER_IRON_4', 5, 'STORY_EP6_SUMMIT');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'กระบี่จักรพรรดิห้ายอดเขา',
        slot: 'WEAPON',
        tier: 5,
        combatMult: 0.32,
        combatStats: { physicalAttack: 42, artAttack: 46, accuracy: 15, critRate: 0.08 }
      });
      if (g.heroes.filter(alive).length < g.capacity()) {
        const rec = g.recruit();
        if (rec?.npc?.jianghu) {
          root.World2026Engine?.syncNpcCultivationIdentityV1200?.(g.world, rec.npc, { trackOrdinal: 4, progress: 50 });
        }
      }
    }
  },
  {
    id: 'EP6_MARTIAL_WARLORD',
    ep: 6,
    code: 'EP6_MARTIAL_WARLORD',
    branchKey: 'MARTIAL_WARLORD',
    branchBadgeTh: '⚔️ จ้าวสมรภูมิเกราะทมิฬ',
    parentIds: ['EP5_CELESTIAL_ORTHODOX', 'EP5_SUPREME_MARTIAL'],
    nextNodeIds: ['EP7_CONQUER_RIFT', 'EP7_SEAL_RIFT'],
    chapterPhaseTh: 'บทที่ 6 · ศึกชิงความเป็นจ้าวเหนือขุนพลเกราะทมิฬ',
    titleTh: 'EP.6 [จ้าวสมรภูมิ] · ศึกชิงความเป็นจ้าวเหนือขุนพลเกราะทมิฬ',
    subtitleTh: 'บดขยี้ทัพขุนพลเกราะทมิฬนอกด่านและยึดครองศาสตราเทวะ',
    loreTh: 'ขุนพลเกราะทมิฬเฮยหลงยกทัพใหญ่มาประชิดหุบเขาเมฆาคราม สภาศิษย์สายสงครามจึงนำกำลังทั้งหมดออกบดขยี้ข้าศึกเพื่อประกาศศักดาจ้าวสมรภูมิ',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'MARTIAL_WARLORD',
      paths: ['BODY', 'GOD'],
      traits: { courage: 1.7, aggression: 1.5, ambition: 1.5 },
      reasonLabelTh: 'ต้องการบดขยี้ทัพขุนพลเกราะทมิฬและครองความเป็นจ้าวสมรภูมิ'
    },
    doctrineSpec: {
      id: 'DOC_EP6_WARLORD',
      ep: 6,
      branchKey: 'MARTIAL_WARLORD',
      icon: '⚔️',
      nameTh: 'จ้าวสมรภูมิพิชิตแปดทิศ',
      descTh: 'เพิ่มโจมตีกายภาพ +24%, เจาะเกราะ +14, คริติคอล +6% และเกราะ +16%',
      mods: { scale: { physicalAttack: 1.24, armor: 1.16 }, add: { penetration: 14, critRate: 0.06 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 6).qualified);
      return [
        { id: 'c_st6w', labelTh: cultivationConditionLabelForEp(6), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_k6w', labelTh: 'ปราบศัตรูและอสูรสะสม ≥ 6 ครั้ง', current: g.s.stats?.kills || 0, target: 6, passed: (g.s.stats?.kills || 0) >= 6 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.6 · สังหารขุนพลเกราะทมิฬเฮยหลงและพยัคฆ์เหมันต์',
    trialDescTh: 'เด็ดหัวขุนพลเกราะทมิฬเฮยหลงในศึกตัดสินหน้าหุบเขา!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[6], boss: true, bossNameTh: 'เฮยหลง · ขุนพลเกราะทมิฬนอกด่าน' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[6].spawns[1], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «จ้าวสมรภูมิพิชิตแปดทิศ» · ชุดเกราะจริงระดับ 5 «เกราะราชันย์ทมิฬสะท้านภพ» · เหล็กอัสนีคราม ×6 · ศิลา +950',
    grantRewards(g) {
      g.money(950, 'รางวัลเนื้อเรื่อง EP.6 (จ้าวสมรภูมิ)');
      grantStoryMaterial(g, 'MAT_ORE_THUNDER_IRON_4', 6, 'STORY_EP6_WARLORD');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'เกราะราชันย์ทมิฬสะท้านภพ',
        slot: 'ARMOR',
        tier: 5,
        defenseMult: 0.30,
        combatStats: { armor: 42, resistance: 32, physicalAttack: 20, maxHP: 45 }
      });
    }
  },
  {
    id: 'EP6_ABYSSAL_PACT',
    ep: 6,
    code: 'EP6_ABYSSAL_PACT',
    branchKey: 'ABYSSAL_PACT',
    branchBadgeTh: '🌑 พิธีกรรมกลืนจันทรา',
    parentIds: ['EP5_SUPREME_MARTIAL', 'EP5_MYRIAD_UNORTHODOX'],
    nextNodeIds: ['EP7_HARVEST_RIFT', 'EP7_CONQUER_RIFT'],
    chapterPhaseTh: 'บทที่ 6 · พิธีกรรมกลืนจันทราและศึกชิงรอยแยกโบราณ',
    titleTh: 'EP.6 [กลืนจันทรา] · พิธีกรรมกลืนจันทราและศึกชิงรอยแยกโบราณ',
    subtitleTh: 'ดูดซับปราณหยินบริสุทธิ์จากรอยแยกโบราณ เปิดชีพจรปราณและคว้าคัมภีร์ต้องห้าม',
    loreTh: 'สภาศิษย์สายเร้นลับทำพิธีดึงปราณจันทราโบราณจากรอยแยกมิติเข้าสู่หุบเขาเพื่อเร่งตบะและเปิดชีพจรปราณขั้นสูง',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'ABYSSAL_PACT',
      paths: ['DEMON', 'HEART_SOUL', 'XIAN'],
      traits: { curiosity: 1.6, ambition: 1.5, creativity: 1.5 },
      reasonLabelTh: 'มุ่งดึงปราณเร้นลับจากรอยแยกจันทราเพื่อเปิดชีพจรปราณขั้นสูง'
    },
    doctrineSpec: {
      id: 'DOC_EP6_ABYSSAL',
      ep: 6,
      branchKey: 'ABYSSAL_PACT',
      icon: '🌑',
      nameTh: 'ค่ายกลกลืนจันทราเร้นภพ',
      descTh: 'เพิ่มโจมตีวิชาปราณ +22%, ความแรงคริติคอล +25%, ฟื้นปราณ +20% และปราณสูงสุด +28',
      mods: { scale: { artAttack: 1.22, qiRegen: 1.20 }, add: { critDamage: 0.25, maxQi: 28 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 6).qualified);
      return [
        { id: 'c_st6a', labelTh: cultivationConditionLabelForEp(6), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop6a', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.6 · สยบพญาหมีเหมันต์และผู้คุมกฎจันทราโลหิต',
    trialDescTh: 'สยบผู้คุมกฎจันทราโลหิตเพื่อควบคุมปราณรอยแยกโบราณ!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[6], boss: true, bossNameTh: 'ประมุขรองจันทราโลหิต' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[6].spawns[0], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «ค่ายกลกลืนจันทราเร้นภพ» · เปิดชีพจรปราณศิษย์ทุกคน +2 จุด · คัมภีร์ระดับ 6 · บัววิญญาณเจ็ดสี ×4 · ศิลา +920',
    grantRewards(g) {
      g.money(920, 'รางวัลเนื้อเรื่อง EP.6 (กลืนจันทรา)');
      grantStoryMaterial(g, 'MAT_HERB_SOUL_LOTUS_3', 4, 'STORY_EP6_ABYSSAL');
      unlockSectDoctrine(g, this.doctrineSpec);
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) {
          h.jianghu.meridiansV150 = h.jianghu.meridiansV150 || {};
          for (let k = 0; k < 2; k++) {
            grantMeridianNodes(g, h, 1);
          }
        }
      }
      grantRealManualAndTeach(g, 5, 6, 'DEMON');
    }
  },
  {
    id: 'EP7_SEAL_RIFT',
    ep: 7,
    code: 'EP7_SEAL_RIFT',
    branchKey: 'SEAL_RIFT',
    branchBadgeTh: '🛡️ ผนึกรอยแยกหมื่นภพ',
    parentIds: ['EP6_ORTHODOX_SUMMIT', 'EP6_MARTIAL_WARLORD'],
    nextNodeIds: ['EP8_IMMORTAL_SANCTUARY', 'EP8_GOD_MARTIAL_EMPIRE'],
    chapterPhaseTh: 'บทที่ 7 · มหาค่ายกลผนึกรอยแยกแดนหมื่นภพ',
    titleTh: 'EP.7 [ผนึกรอยแยก] · มหาค่ายกลผนึกรอยแยกแดนหมื่นภพ',
    subtitleTh: 'สกัดกั้นการทะลักของอสูรบรรพกาลและเปลี่ยนรอยแยกมิติเป็นบ่อเกิดปราณบริสุทธิ์',
    loreTh: 'เมื่อรอยแยกมิติแดนหมื่นภพฉีกออก สภาศิษย์เลือกสร้างมหาค่ายกลผนึกอสูรร้ายและกลั่นกรองเฉพาะปราณสวรรค์บริสุทธิ์เข้าสู่หุบเขา',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'SEAL_RIFT',
      paths: ['XIAN', 'HEART_SOUL', 'GOD'],
      traits: { integrity: 1.5, caution: 1.3, composure: 1.4 },
      reasonLabelTh: 'มุ่งผนึกรอยแยกมิติเพื่อคุ้มครองหุบเขาและกลั่นปราณสวรรค์บริสุทธิ์'
    },
    doctrineSpec: {
      id: 'DOC_EP7_SEAL_RIFT',
      ep: 7,
      branchKey: 'SEAL_RIFT',
      icon: '🛡️',
      nameTh: 'มหาผนึกสวรรค์คุ้มหมื่นภพ',
      descTh: 'เพิ่มเกราะ +22%, ต้านทานปราณ +22%, ฟื้นปราณ +25% และต้านสถานะ +12%',
      mods: { scale: { armor: 1.22, resistance: 1.22, qiRegen: 1.25 }, add: { controlResist: 0.12 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 7).qualified);
      return [
        { id: 'c_st7s', labelTh: cultivationConditionLabelForEp(7), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop7s', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.7 · สยบอสูรหมีเหมันต์บรรพกาลและราชันย์วานรผลึกดารา',
    trialDescTh: 'อสูรสายเลือดบรรพกาล 2 ตนทะลักออกจากรอยแยก ปราบพวกมันเพื่อวางศิลาผนึก!',
    spawnTrial(g, tagId) {
      return EP_BEAST_TIDE_POOLS[7].spawns.map((sp, i) => spawnEventBeast(g, sp, tagId, i).id);
    },
    rewardSummaryTh: 'ปลดล็อกมติ «มหาผนึกสวรรค์คุ้มหมื่นภพ» · เครื่องรางระดับ 6 «ศิลาผนึกเก้าสวรรค์» · กล้วยไม้สนธยา ×4 · หญ้าดาราพันปี ×4 · ศิลา +1,300',
    grantRewards(g) {
      g.money(1300, 'รางวัลเนื้อเรื่อง EP.7 (ผนึกรอยแยก)');
      grantStoryMaterial(g, 'MAT_HERB_SUNSET_ORCHID_4', 4, 'STORY_EP7_SEAL');
      grantStoryMaterial(g, 'MAT_HERB_STARLIGHT_GRASS_4', 4, 'STORY_EP7_SEAL');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ศิลาผนึกเก้าสวรรค์',
        slot: 'TALISMAN_VESSEL',
        tier: 6,
        defenseMult: 0.32,
        combatStats: { armor: 40, resistance: 45, maxQi: 40, qiRegen: 0.45, controlResist: 0.12 }
      });
    }
  },
  {
    id: 'EP7_CONQUER_RIFT',
    ep: 7,
    code: 'EP7_CONQUER_RIFT',
    branchKey: 'CONQUER_RIFT',
    branchBadgeTh: '🔥 กรีฑาทัพพิชิตหมื่นภพ',
    parentIds: ['EP6_MARTIAL_WARLORD', 'EP6_ABYSSAL_PACT'],
    nextNodeIds: ['EP8_GOD_MARTIAL_EMPIRE', 'EP8_PRIMORDIAL_DAO_LORD'],
    chapterPhaseTh: 'บทที่ 7 · กรีฑาทัพบุกยึดครองแดนหมื่นภพ',
    titleTh: 'EP.7 [พิชิตหมื่นภพ] · กรีฑาทัพบุกยึดครองแดนหมื่นภพ',
    subtitleTh: 'บุกทะลวงเข้าสู่รอยแยกมิติ ล่าอสูรบรรพกาลและยึดครองทรัพยากรข้ามภพ',
    loreTh: 'แทนที่จะตั้งรับ สภาศิษย์สายสงครามเลือกเปิดประตูรอยแยกให้กว้างขึ้นและส่งยอดฝีมือบุกเข้าไปล่าอสูรบรรพกาลถึงถิ่น!',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'CONQUER_RIFT',
      paths: ['BODY', 'GOD', 'DEMON'],
      traits: { courage: 1.7, ambition: 1.6, aggression: 1.4 },
      reasonLabelTh: 'ต้องการกรีฑาทัพบุกยึดครองแดนหมื่นภพและล่าอสูรบรรพกาล'
    },
    doctrineSpec: {
      id: 'DOC_EP7_CONQUER_RIFT',
      ep: 7,
      branchKey: 'CONQUER_RIFT',
      icon: '🔥',
      nameTh: 'ทัพเทวะพิชิตหมื่นพิภพ',
      descTh: 'เพิ่มโจมตีกายภาพ +25%, โจมตีวิชา +20%, เจาะเกราะ +16 และความเร็วโจมตี +12%',
      mods: { scale: { physicalAttack: 1.25, artAttack: 1.20, attackSpeed: 1.12 }, add: { penetration: 16 } }
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 7).qualified);
      return [
        { id: 'c_st7c', labelTh: cultivationConditionLabelForEp(7), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_k7c', labelTh: 'ปราบศัตรูและอสูรสะสม ≥ 7 ครั้ง', current: g.s.stats?.kills || 0, target: 7, passed: (g.s.stats?.kills || 0) >= 7 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.7 · บดขยี้ผู้พิทักษ์รอยแยกมิติและราชันย์วานรผลึกดารา',
    trialDescTh: 'ปราบผู้พิทักษ์รอยแยกมิติและราชันย์วานรผลึกดาราเพื่อยึดครองประตูข้ามภพ!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[7], boss: true, bossNameTh: 'ขุนพลพิทักษ์รอยแยกมิติ' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[7].spawns[1], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติ «ทัพเทวะพิชิตหมื่นพิภพ» · อาวุธระดับ 6 «ทวนเทวะทลายมิติ» · อสูรคู่หูระดับ 5 · ศิลา +1,400',
    grantRewards(g) {
      g.money(1400, 'รางวัลเนื้อเรื่อง EP.7 (พิชิตหมื่นภพ)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ทวนเทวะทลายมิติ',
        slot: 'WEAPON',
        tier: 6,
        combatMult: 0.36,
        combatStats: { physicalAttack: 55, artAttack: 40, penetration: 20, critRate: 0.09, critDamage: 0.28 }
      });
      grantRealCompanionBeast(g, {
        speciesId: 'BEAST_CRYSTALBACK_APE',
        nameTh: 'ราชันย์วานรผลึกดารา (คู่หูข้ามภพ)',
        tier: 5,
        hp: 520,
        power: 1150,
        trust: 85
      });
    }
  },
  {
    id: 'EP7_HARVEST_RIFT',
    ep: 7,
    code: 'EP7_HARVEST_RIFT',
    branchKey: 'HARVEST_RIFT',
    branchBadgeTh: '⚗️ กลั่นแก่นปราณหมื่นภพ',
    parentIds: ['EP6_ORTHODOX_SUMMIT', 'EP6_ABYSSAL_PACT'],
    nextNodeIds: ['EP8_PRIMORDIAL_DAO_LORD', 'EP8_IMMORTAL_SANCTUARY'],
    chapterPhaseTh: 'บทที่ 7 · กลั่นแก่นปราณรอยแยกสู่อมฤตนิรันดร์',
    titleTh: 'EP.7 [กลั่นแก่นมิติ] · กลั่นแก่นปราณรอยแยกสู่อมฤตนิรันดร์',
    subtitleTh: 'สกัดแก่นปราณบรรพกาลจากรอยแยกมาหลอมโอสถอมฤตและคัมภีร์ระดับตำนาน',
    loreTh: 'สภาศิษย์สายปัญญาและเร้นลับตั้งค่ายกลสูบแก่นปราณบรรพกาลจากรอยแยกแดนหมื่นภพเข้าสู่เตาหลอมโดยตรง',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'HARVEST_RIFT',
      paths: ['DEMON', 'XIAN', 'HEART_SOUL'],
      traits: { curiosity: 1.7, creativity: 1.6, ambition: 1.4 },
      reasonLabelTh: 'มุ่งสูบแก่นปราณรอยแยกมาหลอมโอสถอมฤตและศึกษาคัมภีร์บรรพกาล'
    },
    doctrineSpec: {
      id: 'DOC_EP7_HARVEST_RIFT',
      ep: 7,
      branchKey: 'HARVEST_RIFT',
      icon: '⚗️',
      nameTh: 'เตาหลอมอมฤตกลืนหมื่นภพ',
      descTh: 'เพิ่มโจมตีวิชาปราณ +26%, ฟื้นปราณ +30%, ปราณสูงสุด +35 และความแรงคริติคอล +25%',
      mods: { scale: { artAttack: 1.26, qiRegen: 1.30 }, add: { maxQi: 35, critDamage: 0.25 } },
      cultivationBonusPct: 25
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 7).qualified);
      return [
        { id: 'c_st7h', labelTh: cultivationConditionLabelForEp(7), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop7h', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'บททดสอบ EP.7 · ปราบอสูรหมีเหมันต์บรรพกาลและยึดแก่นปราณรอยแยก',
    trialDescTh: 'สยบอสูรบรรพกาลที่เฝ้าแก่นปราณรอยแยกเพื่อนำมาหลอมโอสถอมฤต!',
    spawnTrial(g, tagId) {
      return EP_BEAST_TIDE_POOLS[7].spawns.map((sp, i) => spawnEventBeast(g, sp, tagId, i).id);
    },
    rewardSummaryTh: 'ปลดล็อกมติ «เตาหลอมอมฤตกลืนหมื่นภพ» · โอสถอมฤตจริง 8 เม็ด · คัมภีร์ระดับ 6–7 · อายุขัยศิษย์ทุกคน +8 ปี · ศิลา +1,350',
    grantRewards(g) {
      g.money(1350, 'รางวัลเนื้อเรื่อง EP.7 (กลั่นแก่นมิติ)');
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealPills(g, 'REC1100_SUPPORT_QI', 8, { nameTh: 'โอสถอมฤตแก่นหมื่นภพ', quality: 'MYTHIC', effect: { healHealth: 100, restoreQi: 100, cultivationProgress: 25 } });
      grantRealManualAndTeach(g, 6, 7, null);
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) grantStoryLifespan(h, 8, this.id);
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 28);
      }
    }
  },
  {
    id: 'EP8_IMMORTAL_SANCTUARY',
    ep: 8,
    code: 'EP8_IMMORTAL_SANCTUARY',
    branchKey: 'IMMORTAL_SANCTUARY',
    branchBadgeTh: '👑 ฉากจบ: แดนสุขาวดีเมฆาคราม',
    parentIds: ['EP7_SEAL_RIFT', 'EP7_HARVEST_RIFT'],
    nextNodeIds: [],
    chapterPhaseTh: 'บทที่ 8 (บทสรุปแดนสุขาวดี) · สถาปนาแดนสุขาวดีเมฆาครามเทียมฟ้า',
    titleTh: 'EP.8 [แดนสุขาวดี] · สถาปนาแดนสุขาวดีเมฆาครามเทียมฟ้า',
    subtitleTh: 'พิชิตทัณฑ์สวรรค์เก้าชั้นฟ้าและยกระดับหุบเขาเมฆาครามสู่แดนเซียนอมตะบนดิน',
    loreTh: 'ภายใต้การนำของสภาศิษย์ผู้เปี่ยมคุณธรรมและปัญญา หุบเขาเมฆาครามถูกยกระดับเป็นแดนสุขาวดีที่ปราณสวรรค์ไหลเวียนไม่รู้จบ เมื่อทัณฑ์สวรรค์และราชันย์อสูรบรรพกาลลงมาทดสอบ เหล่าปรมาจารย์ของสำนักจึงร่วมกันรับศึกสุดท้ายเพื่อจารึกตำนานนิรันดร์!',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'IMMORTAL_SANCTUARY',
      paths: ['XIAN', 'HEART_SOUL'],
      traits: { empathy: 1.6, integrity: 1.6, composure: 1.5 },
      reasonLabelTh: 'มุ่งสถาปนาหุบเขาเมฆาครามเป็นแดนสุขาวดีอมตะที่คุ้มครองทุกสรรพชีวิต'
    },
    doctrineSpec: {
      id: 'DOC_EP8_IMMORTAL_SANCTUARY',
      ep: 8,
      branchKey: 'IMMORTAL_SANCTUARY',
      icon: '👑',
      nameTh: 'มหาสำนักแดนสุขาวดีเทียมฟ้า',
      descTh: 'เพิ่มสถานะต่อสู้ทุกด้าน +25%, ปราณสูงสุด +50, ฟื้นปราณ +35% และรายได้สำนัก +35 ศิลา/วัน',
      mods: { scale: { physicalAttack: 1.25, artAttack: 1.25, armor: 1.25, resistance: 1.25, qiRegen: 1.35 }, add: { maxQi: 50, maxHP: 45, controlResist: 0.15 } },
      dailyStones: 35,
      dailyFood: 6
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 8).qualified);
      return [
        { id: 'c_st8is', labelTh: cultivationConditionLabelForEp(8), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop8is', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'มหาบททดสอบ EP.8 · พิชิตประมุขมารเงาโลหิตและราชันย์หมีเหมันต์ทลายสวรรค์',
    trialDescTh: 'ศึกตัดสินครั้งสุดท้ายเพื่อสถาปนาแดนสุขาวดีเมฆาครามเทียมฟ้า!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[8], boss: true, bossNameTh: 'จอมมารเสวี่ยหมิง · ประมุขมารเงาโลหิต' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[8].spawns[0], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติสูงสุด «มหาสำนักแดนสุขาวดีเทียมฟ้า» · ศาสตราเทวะระดับ 7 «กระบี่เซียนเมฆาครามนิรันดร์» · ท้อเซียนอมฤต ×4 · อายุขัยศิษย์ทุกคน +15 ปี · ศิลา +2,200',
    grantRewards(g) {
      g.money(2200, 'รางวัลเนื้อเรื่อง EP.8 (แดนสุขาวดี)');
      g.s.legacy = 3;
      g.s.chapterCleared = true;
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'กระบี่เซียนเมฆาครามนิรันดร์',
        slot: 'WEAPON',
        tier: 7,
        combatMult: 0.42,
        combatStats: { physicalAttack: 55, artAttack: 68, accuracy: 20, critRate: 0.12, maxQi: 50 },
        weaponSpirit: { nameTh: 'จิตกระบี่เมฆาสวรรค์', bonusMult: 0.15 }
      });
      grantRealManualAndTeach(g, 7, 7, 'XIAN');
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) grantStoryLifespan(h, 15, this.id);
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 35);
      }
    }
  },
  {
    id: 'EP8_GOD_MARTIAL_EMPIRE',
    ep: 8,
    code: 'EP8_GOD_MARTIAL_EMPIRE',
    branchKey: 'GOD_MARTIAL_EMPIRE',
    branchBadgeTh: '👑 ฉากจบ: จักรวรรดิเทวะยุทธ์',
    parentIds: ['EP7_SEAL_RIFT', 'EP7_CONQUER_RIFT'],
    nextNodeIds: [],
    chapterPhaseTh: 'บทที่ 8 (บทสรุปจักรวรรดิยุทธ์) · จักรวรรดิเทวะยุทธ์สะท้านเก้าสวรรค์',
    titleTh: 'EP.8 [จักรวรรดิยุทธ์] · จักรวรรดิเทวะยุทธ์สะท้านเก้าสวรรค์',
    subtitleTh: 'สยบทุกขุมกำลังและราชันย์อสูรบรรพกาล สถาปนาสำนักยุทธ์ไร้พ่ายเหนือแผ่นดิน',
    loreTh: 'ด้วยอำนาจแห่งกายาเทวะและคมศาสตราที่บดขยี้ทุกอุปสรรค สำนักเมฆาครามก้าวขึ้นเป็นจักรวรรดิเทวะยุทธ์ที่แม้แต่ทวยเทพและราชันย์อสูรยังต้องก้มศีรษะ!',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'GOD_MARTIAL_EMPIRE',
      paths: ['BODY', 'GOD'],
      traits: { courage: 1.8, ambition: 1.7, aggression: 1.5 },
      reasonLabelTh: 'มุ่งสถาปนาจักรวรรดิเทวะยุทธ์ไร้พ่ายที่สยบทั้งเก้าสวรรค์และหมื่นพิภพ'
    },
    doctrineSpec: {
      id: 'DOC_EP8_GOD_MARTIAL',
      ep: 8,
      branchKey: 'GOD_MARTIAL_EMPIRE',
      icon: '⚡',
      nameTh: 'จักรพรรดิเทวะยุทธ์ครองพิภพ',
      descTh: 'เพิ่มโจมตีกายภาพ +32%, โจมตีวิชา +25%, เจาะเกราะ +22, คริติคอล +10% และพลังชีวิต +55',
      mods: { scale: { physicalAttack: 1.32, artAttack: 1.25, armor: 1.25, attackSpeed: 1.15 }, add: { penetration: 22, critRate: 0.10, maxHP: 55 } },
      dailyStones: 30
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 8).qualified);
      return [
        { id: 'c_st8gm', labelTh: cultivationConditionLabelForEp(8), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_k8gm', labelTh: 'ปราบศัตรูและอสูรสะสม ≥ 8 ครั้ง', current: g.s.stats?.kills || 0, target: 8, passed: (g.s.stats?.kills || 0) >= 8 }
      ];
    },
    trialTitleTh: 'มหาบททดสอบ EP.8 · บดขยี้ขุนพลมารบรรพกาลและราชันย์หมีเหมันต์ทลายสวรรค์',
    trialDescTh: 'ศึกตัดสินแห่งจอมทัพเพื่อสถาปนาจักรวรรดิเทวะยุทธ์!',
    spawnTrial(g, tagId) {
      return [
        spawnEventRaider(g, { ...EP_RAIDER_POOLS[8], boss: true, bossNameTh: 'ขุนพลมารบรรพกาลข้ามภพ' }, tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[8].spawns[0], tagId, 1).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[8].spawns[1], tagId, 2).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติสูงสุด «จักรพรรดิเทวะยุทธ์ครองพิภพ» · อาวุธระดับ 7 «ง้าวเทวะพิชิตสวรรค์» · อสูรคู่หูระดับ 6 «ราชันย์พยัคฆ์เทวะ» · ศิลา +2,500',
    grantRewards(g) {
      g.money(2500, 'รางวัลเนื้อเรื่อง EP.8 (จักรวรรดิยุทธ์)');
      g.s.legacy = 3;
      g.s.chapterCleared = true;
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ง้าวเทวะพิชิตสวรรค์',
        slot: 'WEAPON',
        tier: 7,
        combatMult: 0.45,
        combatStats: { physicalAttack: 72, artAttack: 48, penetration: 25, critRate: 0.12, critDamage: 0.35 },
        weaponSpirit: { nameTh: 'จิตเทวะสงคราม', bonusMult: 0.18 }
      });
      grantRealCompanionBeast(g, {
        speciesId: 'BEAST_FROST_MOON_LYNX',
        nameTh: 'พยัคฆ์จันทราเทวะบรรพกาล (ราชันย์คู่หู)',
        tier: 6,
        hp: 680,
        power: 1650,
        trust: 95
      });
    }
  },
  {
    id: 'EP8_PRIMORDIAL_DAO_LORD',
    ep: 8,
    code: 'EP8_PRIMORDIAL_DAO_LORD',
    branchKey: 'PRIMORDIAL_DAO_LORD',
    branchBadgeTh: '👑 ฉากจบ: จ้าวแห่งมรรคาบรรพกาล',
    parentIds: ['EP7_CONQUER_RIFT', 'EP7_HARVEST_RIFT'],
    nextNodeIds: [],
    chapterPhaseTh: 'บทที่ 8 (บทสรุปจ้าวบรรพกาล) · จ้าวแห่งมรรคาบรรพกาลเหนือกฎเกณฑ์ฟ้าดิน',
    titleTh: 'EP.8 [จ้าวบรรพกาล] · จ้าวแห่งมรรคาบรรพกาลเหนือกฎเกณฑ์ฟ้าดิน',
    subtitleTh: 'หลอมรวมห้าวิถีและแก่นปราณหมื่นภพ ก้าวข้ามกฎเกณฑ์สวรรค์สู่ความเป็นอมตะไร้พันธนาการ',
    loreTh: 'สำนักเมฆาครามเข้าใจแจ้งถึงแก่นแท้แห่งเต๋าบรรพกาลที่อยู่เหนือความดีและความชั่ว เมื่อทัณฑ์สวรรค์ลงมาพิพากษา เหล่าศิษย์กลับกลืนกินสายฟ้าสวรรค์มาเป็นพลังของตน!',
    requiredCountAtStage: 3,
    decisionProfile: {
      archetype: 'PRIMORDIAL_DAO_LORD',
      paths: ['DEMON', 'XIAN', 'HEART_SOUL'],
      traits: { curiosity: 1.8, creativity: 1.8, ambition: 1.6 },
      reasonLabelTh: 'มุ่งหลอมรวมแก่นเต๋าบรรพกาลเพื่อก้าวข้ามกฎเกณฑ์ฟ้าดินทั้งปวง'
    },
    doctrineSpec: {
      id: 'DOC_EP8_PRIMORDIAL_DAO',
      ep: 8,
      branchKey: 'PRIMORDIAL_DAO_LORD',
      icon: '🌀',
      nameTh: 'จ้าวแห่งมรรคาบรรพกาลไร้ขอบเขต',
      descTh: 'เพิ่มโจมตีวิชาปราณ +35%, โจมตีกายภาพ +25%, คริติคอล +12%, แรงคริ +35% และฟื้นปราณ +40%',
      mods: { scale: { artAttack: 1.35, physicalAttack: 1.25, qiRegen: 1.40 }, add: { critRate: 0.12, critDamage: 0.35, maxQi: 60 } },
      cultivationBonusPct: 35
    },
    evaluateConditions(g) {
      const qualified = g.heroes.filter(alive).filter(n => evaluateDiscipleForEp(g, n, 8).qualified);
      return [
        { id: 'c_st8pd', labelTh: cultivationConditionLabelForEp(8), current: qualified.length, target: 2, passed: qualified.length >= 2 },
        { id: 'c_pop8pd', labelTh: 'มีศิษย์ที่มีชีวิตในสำนัก ≥ 3 คน', current: g.heroes.filter(alive).length, target: 3, passed: g.heroes.filter(alive).length >= 3 }
      ];
    },
    trialTitleTh: 'มหาบททดสอบ EP.8 · กลืนกินอสูรอัสนีสวรรค์และราชันย์อสูรบรรพกาล',
    trialDescTh: 'สยบทัณฑ์สวรรค์และราชันย์อสูรบรรพกาลเพื่อก้าวขึ้นเป็นจ้าวแห่งมรรคาบรรพกาล!',
    spawnTrial(g, tagId) {
      return [
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[8].spawns[0], tagId, 0).id,
        spawnEventBeast(g, EP_BEAST_TIDE_POOLS[8].spawns[1], tagId, 1).id
      ];
    },
    rewardSummaryTh: 'ปลดล็อกมติสูงสุด «จ้าวแห่งมรรคาบรรพกาล» · เครื่องรางระดับ 7 «ตราประทับสุญตาบรรพกาล» · เปิดชีพจรปราณครบทุกจุด · อายุขัย +20 ปี · ศิลา +2,400',
    grantRewards(g) {
      g.money(2400, 'รางวัลเนื้อเรื่อง EP.8 (จ้าวบรรพกาล)');
      g.s.legacy = 3;
      g.s.chapterCleared = true;
      unlockSectDoctrine(g, this.doctrineSpec);
      grantRealEquipment(g, {
        nameTh: 'ตราประทับสุญตาบรรพกาล',
        slot: 'TALISMAN_VESSEL',
        tier: 7,
        combatMult: 0.44,
        combatStats: { artAttack: 75, physicalAttack: 50, critRate: 0.14, critDamage: 0.35, maxQi: 65 }
      });
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) {
          grantStoryLifespan(h, 20, this.id);
          h.jianghu.meridiansV150 = h.jianghu.meridiansV150 || {};
          grantMeridianNodes(g, h, 72);
        }
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 40);
      }
    }
  }
];

for (const node of STORY_TREE_NODES_V203) node.requiredCountAtStage = 2;
for (const [ep, pool] of Object.entries(EP_BEAST_TIDE_POOLS)) pool.recommendedStageTh = 'ตบะเทียบเคียง ≥ ' + requiredBandForEp(Number(ep)) + ' · ดูขั้นและเปอร์เซ็นต์ตามสายของศิษย์';

const STORY_EPISODES_V202 = [1, 2, 3, 4, 5, 6, 7, 8].map(epNum => STORY_TREE_NODES_V203.find(n => n.ep === epNum));

// ============================================================================
// NPC COUNCIL BRANCH DECISION ENGINE (68-Axis HumanCore Driven)
// ============================================================================
function evaluateNpcBranchVote(g, npc, candidateNodes) {
  const p = npc?.personality || {};
  const j = npc?.jianghu || {};
  const offices = g?.s?.life?.offices || {};
  const isMaster = offices.master?.npcId === npc.id;
  const isElder = Object.entries(offices).some(([k, o]) => k !== 'master' && o?.npcId === npc.id);
  const weight = isMaster ? 1.5 : isElder ? 1.25 : 1.0;
  const roleLabelTh = isMaster ? 'เจ้าสำนัก' : isElder ? 'ผู้อาวุโสสภา' : 'ศิษย์ในสำนัก';

  const scores = candidateNodes.map(node => {
    const dp = node.decisionProfile || {};
    let score = 50;
    const reasons = [];
    if (Array.isArray(dp.paths) && dp.paths.includes(j.path)) {
      score += 18;
      reasons.push(`ตรงกับ${PATH_META[j.path]?.nameTh || j.path}`);
    }
    const traits = dp.traits || {};
    let topTraitName = null;
    let topTraitContrib = -999;
    const traitNamesTh = {
      empathy: 'ความเมตตา',
      integrity: 'ความเที่ยงธรรม',
      courage: 'ความกล้าหาญ',
      aggression: 'ความดุดัน',
      ambition: 'ความทะเยอทะยาน',
      curiosity: 'ความใฝ่รู้',
      creativity: 'ความคิดสร้างสรรค์',
      caution: 'ความรอบคอบ',
      discipline: 'วินัยเคร่งครัด',
      composure: 'ความสุขุม',
      trustfulness: 'ความไว้วางใจ'
    };
    for (const [tKey, mult] of Object.entries(traits)) {
      const val = Number(p[tKey] ?? 50);
      const contrib = (val - 50) * mult * 0.65;
      score += contrib;
      if (contrib > topTraitContrib && traitNamesTh[tKey]) {
        topTraitContrib = contrib;
        topTraitName = `${traitNamesTh[tKey]} (${Math.round(val)})`;
      }
    }
    if (topTraitName) reasons.push(`นิสัย${topTraitName}`);
    if (dp.reasonLabelTh) reasons.push(dp.reasonLabelTh);
    return {
      nodeId: node.id,
      titleTh: node.titleTh,
      branchBadgeTh: node.branchBadgeTh,
      rawScore: +score.toFixed(1),
      weightedScore: +(score * weight).toFixed(1),
      reasonTh: reasons.join(' · ')
    };
  }).sort((a, b) => b.rawScore - a.rawScore);

  const chosen = scores[0];
  return {
    npcId: npc.id,
    npcName: npc.name,
    roleLabelTh,
    pathIcon: PATH_META[j.path]?.icon || '☯',
    pathNameTh: PATH_META[j.path]?.nameTh || j.pathNameTh || 'ผู้ฝึกตน',
    weight,
    chosenNodeId: chosen?.nodeId || candidateNodes[0]?.id,
    chosenTitleTh: chosen?.titleTh || '',
    chosenBadgeTh: chosen?.branchBadgeTh || '',
    score: chosen?.rawScore || 50,
    weightedScore: chosen?.weightedScore || 50,
    reasonTh: chosen?.reasonTh || 'ตัดสินใจตามมรรคาของตน',
    allScores: scores
  };
}

function runNpcBranchCouncil(g, parentNodeId) {
  const parent = STORY_TREE_NODES_V203.find(n => n.id === parentNodeId) || STORY_TREE_NODES_V203[0];
  const candidateIds = parent?.nextNodeIds || [];
  const candidates = candidateIds.map(id => STORY_TREE_NODES_V203.find(n => n.id === id)).filter(Boolean);
  if (!candidates.length) return null;

  const heroes = (g?.heroes || []).filter(alive);
  const votes = heroes.map(h => evaluateNpcBranchVote(g, h, candidates));
  const tallyMap = {};
  for (const c of candidates) {
    tallyMap[c.id] = {
      nodeId: c.id,
      titleTh: c.titleTh,
      branchBadgeTh: c.branchBadgeTh,
      subtitleTh: c.subtitleTh,
      voteCount: 0,
      totalWeight: 0,
      totalScore: 0,
      voters: []
    };
  }
  for (const v of votes) {
    const t = tallyMap[v.chosenNodeId] || Object.values(tallyMap)[0];
    if (t) {
      t.voteCount += 1;
      t.totalWeight = +(t.totalWeight + v.weight).toFixed(2);
      t.totalScore = +(t.totalScore + v.weightedScore).toFixed(1);
      t.voters.push(v);
    }
  }
  const tallies = Object.values(tallyMap).sort((a, b) => (b.totalWeight - a.totalWeight) || (b.totalScore - a.totalScore));
  const winner = tallies[0] || { nodeId: candidates[0].id, titleTh: candidates[0].titleTh, branchBadgeTh: candidates[0].branchBadgeTh };
  return {
    parentNodeId: parent.id,
    parentTitleTh: parent.titleTh,
    winnerNodeId: winner.nodeId,
    winnerTitleTh: winner.titleTh,
    winnerBadgeTh: winner.branchBadgeTh,
    tallies,
    votes
  };
}

// ============================================================================
// 32 CONSEQUENTIAL DYNAMIC JIANGHU EVENTS
// ============================================================================
const DYNAMIC_EVENTS_CATALOG_V202 = [
  {
    id: 'EVT_BEAST_TIDE',
    nameTh: 'คลื่นสัตว์อสูรบุกหุบเขา (Beast Tide)',
    icon: '🌊',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 55,
    descTh: 'อสูรจากพูลประจำ EP ปัจจุบันบุกโจมตีแนวสำนัก เมื่อปราบสำเร็จจะดรอปชิ้นส่วนอสูรลงพื้นแผนที่จริง ได้รับบัฟผลพวงนักล่าอสูร และมีโอกาสทริกเกอร์อีเวนต์ต่อเนื่อง «จ่าฝูงอสูรล้างแค้น» หรือ «พ่อค้าชิ้นส่วนอสูร»!',
    start(g, epNum, tagId) {
      const pool = EP_BEAST_TIDE_POOLS[clamp(epNum, 1, 8)];
      const ids = pool.spawns.map((sp, i) => spawnEventBeast(g, sp, tagId, i).id);
      return {
        situationTh: `${pool.poolNameTh} (${pool.spawns.map(s => s.nameTh).join(' + ')}) บุกประชิดแนวสำนัก!`,
        objectiveTh: `ปราบอสูรจากคลื่นอสูร EP.${epNum} ให้ครบ (${ids.length} ตัว)`,
        entityIds: ids,
        rewardStones: pool.rewardStones,
        rewardMatId: pool.rewardMatId,
        rewardMatQty: pool.rewardMatQty
      };
    },
    onComplete(g, inst) {
      const epNum = clamp(inst.epNum || 1, 1, 8);
      g.money(inst.rewardStones || 120, 'รางวัลปราบคลื่นสัตว์อสูร');
      if (inst.rewardMatId) grantStoryMaterial(g, inst.rewardMatId, inst.rewardMatQty || 3, 'BEAST_TIDE_REWARD');
      const hall = g.built?.('hall');
      spawnRealGroundDrops(g, (hall?.x || 950) + 160, (hall?.y || 1250) + 140, [
        { matId: inst.rewardMatId || 'MAT_BP_WOLF_FANG_1', count: 3 },
        { matId: 'MAT_HERB_BLOOD_GINSENG_3', count: Math.max(1, Math.floor(epNum / 2)) }
      ], 'ซากคลื่นสัตว์อสูรบุก');
      addEventAftermath(g, {
        id: 'AF_HUNTER_MOMENTUM',
        nameTh: 'กลิ่นอายนักล่าพิชิตอสูร',
        icon: '🐾',
        kind: 'BLESSING',
        duration: 140,
        descTh: 'ศิษย์ทั้งสำนักฮึกเหิมจากการปราบคลื่นอสูร โจมตีกายภาพ +10% และอัตราคริติคอล +5%',
        mods: { scale: { physicalAttack: 1.10 }, add: { critRate: 0.05 } }
      });
      const chainId = (g.s.nextId % 2 === 0) ? 'EVT_CHAIN_APEX_VENGEANCE' : 'EVT_CHAIN_BEAST_MERCHANT';
      queueChainedEvent(g, chainId, 45, 'กลิ่นโลหิตและซากอสูรจากศึกคลื่นสัตว์อสูรชักนำเหตุการณ์ต่อเนื่องเข้ามา', inst.nameTh);
      return `ได้รับศิลา +${inst.rewardStones}, วัตถุดิบเข้าคลัง ×${inst.rewardMatQty}, ดรอปซากอสูรลงพื้นแผนที่ 2 กอง, บัฟ «กลิ่นอายนักล่าพิชิตอสูร» และเปิดสายอีเวนต์ต่อเนื่อง!`;
    }
  },
  {
    id: 'EVT_OUTLAW_RAID',
    nameTh: 'กองกำลังนอกด่านบุกปล้นชิง',
    icon: '⚔️',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 55,
    descTh: 'ผู้ฝึกตนนอกรีตที่ความเก่งสเกลตามพูล EP ปัจจุบันบุกปล้นสำนัก เมื่อปราบสำเร็จจะยึดอาวุธจริงของหัวหน้าโจรเข้าสัมภาระศิษย์ พร้อมบัฟคุมเข้มแนวป้องกัน!',
    start(g, epNum, tagId) {
      const pool = EP_RAIDER_POOLS[clamp(epNum, 1, 8)];
      const ids = [];
      for (let i = 0; i < pool.count; i++) ids.push(spawnEventRaider(g, pool, tagId, i).id);
      return {
        situationTh: `${pool.nameTh} (ระดับพูล EP.${epNum}) จำนวน ${pool.count} คน บุกเข้าเขตหุบเขา!`,
        objectiveTh: `สังหารหรือขับไล่ ${pool.nameTh} ทั้งหมด (${ids.length} คน)`,
        entityIds: ids,
        rewardStones: pool.rewardStones
      };
    },
    onComplete(g, inst) {
      const epNum = clamp(inst.epNum || 1, 1, 8);
      g.money(inst.rewardStones || 150, 'ยึดทรัพย์สินกองกำลังนอกด่าน');
      grantStoryMaterial(g, 'MAT_ORE_BLACK_IRON_1', 4 + epNum, 'OUTLAW_RAID_LOOT');
      const eq = grantRealEquipment(g, {
        nameTh: `ศาสตรายึดศึกนอกด่าน (EP.${epNum})`,
        slot: 'WEAPON',
        tier: clamp(epNum, 1, 6),
        combatMult: 0.08 + epNum * 0.03,
        combatStats: { physicalAttack: 12 + epNum * 5, penetration: 3 + epNum * 2 }
      });
      addEventAftermath(g, {
        id: 'AF_MARTIAL_VIGILANCE',
        nameTh: 'แนวป้องกันเหล็กไหล',
        icon: '🛡️',
        kind: 'BLESSING',
        duration: 130,
        descTh: 'เวรยามสำนักรัดกุมขึ้นหลังปราบผู้บุกรุก เกราะป้องกัน +12% และความแม่นยำ +6',
        mods: { scale: { armor: 1.12 }, add: { accuracy: 6 } }
      });
      return `ยึดศิลา +${inst.rewardStones}, เหล็กดำ ×${4 + epNum}, มอบอาวุธจริง «${eq.item.nameTh}» ให้ ${eq.ownerName} และรับบัฟ «แนวป้องกันเหล็กไหล»!`;
    }
  },
  {
    id: 'EVT_QI_LEYLINE_SURGE',
    nameTh: 'ชีพจรปราณฟ้าดินปะทุ',
    icon: '✨',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: 'กระแสปราณใต้หุบเขาปะทุขึ้น ฟื้นปราณต่อสู้เต็ม 100% เร่งตบะศิษย์ทุกคน สร้างผลพวง «สั่นพ้องชีพจรปราณ» และก่อให้เกิดอีเวนต์ต่อเนื่อง «ผลึกศิลาปราณควบแน่น»!',
    executeInstant(g, epNum) {
      const progGain = 5 + epNum * 2.5;
      for (const h of g.heroes.filter(alive)) {
        const cs = g.combatSystem?.ensure?.(h);
        if (cs) { cs.qi = cs.maxQi; h.jianghu.currentQiV190 = cs.maxQi; }
        h.core.condition.fatigue = Math.max(0, (h.core.condition.fatigue || 0) - 30);
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, progGain);
      }
      g.realm?.spawnFortune?.();
      addEventAftermath(g, {
        id: 'AF_LEYLINE_RESONANCE',
        nameTh: 'สั่นพ้องชีพจรปราณฟ้าดิน',
        icon: '✨',
        kind: 'BLESSING',
        duration: 160,
        descTh: 'ปราณฟ้าดินหนาแน่นผิดปกติ ฟื้นฟูปราณต่อสู้ +20% และพลังโจมตีวิชาปราณ +12%',
        mods: { scale: { qiRegen: 1.20, artAttack: 1.12 }, add: { maxQi: 12 } }
      });
      queueChainedEvent(g, 'EVT_CHAIN_CRYSTAL_CONDENSATION', 40, 'แรงดันปราณที่ปะทุขึ้นค่อย ๆ ควบแน่นกลายเป็นผลึกแร่ปราณรอบสำนัก', 'ชีพจรปราณฟ้าดินปะทุ');
      return {
        situationTh: `กระแสปราณฟ้าดินระดับ EP.${epNum} พวยพุ่งทั่วลานฝึกปราณ!`,
        outcomeTh: `ศิษย์ทุกคนฟื้นปราณเต็ม 100% ได้รับตบะ +${progGain.toFixed(1)}%, เกิดจุดวาสนาใหม่, รับผลพวง «สั่นพ้องชีพจรปราณฟ้าดิน» (ฟื้นปราณ +20%, วิชา +12%) และเตรียมเกิดผลึกศิลาปราณควบแน่น!`
      };
    }
  },
  {
    id: 'EVT_CELESTIAL_DEW_BLOOM',
    nameTh: 'พฤกษาวิญญาณรับน้ำค้างทิพย์',
    icon: '🌿',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: 'หมอกน้ำค้างทิพย์ฟื้นฟูแหล่งสมุนไพรป่าเต็มจำนวน เร่งแปลงปลูกสมุนไพร มอบสมุนไพรและเมล็ดพันธุ์เข้าคลังจริง พร้อมผลพวงกลิ่นหอมพฤกษาทิพย์!',
    executeInstant(g, epNum) {
      for (const node of (g.s.nodes || [])) {
        if (node.kind === 'HERB') node.qty = node.max;
      }
      for (const plot of (g.s.gardenPlots || [])) {
        if (plot.cropId) { plot.moisture = 100; plot.growth += 55; }
      }
      const herbByEp = ['MAT_HERB_DEW_GRASS_1', 'MAT_HERB_CINDER_LEAF_1', 'MAT_HERB_JADE_LOTUS_2', 'MAT_HERB_MIST_ORCHID_2', 'MAT_HERB_BLOOD_GINSENG_3', 'MAT_HERB_THUNDER_BAMBOO_3', 'MAT_HERB_FROST_MOON_BERRY_3', 'MAT_HERB_SUNSET_ORCHID_4'][clamp(epNum - 1, 0, 7)];
      const qty = 4;
      g.add(g.bank, herbByEp, qty, 'CELESTIAL_DEW_EVENT');
      g.s.seedStock.jadeLotus = (g.s.seedStock.jadeLotus || 0) + 2;
      g.s.seedStock.bloodGinseng = (g.s.seedStock.bloodGinseng || 0) + 1;
      addEventAftermath(g, {
        id: 'AF_DEW_FRAGRANCE',
        nameTh: 'ไอหอมน้ำค้างทิพย์ชุบกายา',
        icon: '🌿',
        kind: 'BLESSING',
        duration: 140,
        descTh: 'ไอน้ำค้างทิพย์ช่วยเพิ่มพลังชีวิตสูงสุด +18 และต้านทานปราณ +10% ให้ศิษย์ทุกคน',
        mods: { scale: { resistance: 1.10 }, add: { maxHP: 18 } }
      });
      return {
        situationTh: `สายฝนน้ำค้างทิพย์ระดับ EP.${epNum} โปรยปรายชุบเลี้ยงพืชพรรณทั่วหุบเขา`,
        outcomeTh: `แหล่งสมุนไพรป่าฟื้นเต็ม 100%, เร่งโตแปลงสมุนไพร, ได้รับสมุนไพร ×${qty} และเมล็ดพันธุ์หายาก 3 ชุดเข้าคลัง พร้อมบัฟ «ไอหอมน้ำค้างทิพย์»!`
      };
    }
  },
  {
    id: 'EVT_HERMIT_GUIDANCE',
    nameTh: 'ปรมาจารย์เร้นกายแวะชี้แนะมรรคา',
    icon: '🧙',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: 'ยอดฝีมืออาวุโสเร้นกายแวะมอบคัมภีร์วิชายุทธ์ของจริงเข้าหอคัมภีร์และสอนศิษย์ในสำนักโดยตรง พร้อมสลายจิตมารและมอบบัฟรู้แจ้งมรรคา!',
    executeInstant(g, epNum) {
      const masteryGain = 6 + epNum * 2;
      for (const h of g.heroes.filter(alive)) {
        const j = h.jianghu;
        if (!j) continue;
        j.heartDemon = Math.max(0, (j.heartDemon || 0) - 25);
        for (const k of Object.values(j.knowledgeV190 || {})) {
          if (k.stage >= 4) {
            k.mastery = Math.min(100, (k.mastery || 8) + masteryGain);
            j.artMasteryV150[k.artId] = k.mastery;
          }
        }
      }
      const taught = grantRealManualAndTeach(g, clamp(epNum - 1, 1, 6), clamp(epNum + 1, 2, 7), null);
      addEventAftermath(g, {
        id: 'AF_HERMIT_EPIPHANY',
        nameTh: 'รู้แจ้งเคล็ดวิชาปรมาจารย์',
        icon: '🧙',
        kind: 'BLESSING',
        duration: 150,
        descTh: 'คำชี้แนะของผู้อาวุโสช่วยเพิ่มความแม่นยำ +10, โจมตีวิชา +12% และต้านสถานะ +8%',
        mods: { scale: { artAttack: 1.12 }, add: { accuracy: 10, controlResist: 0.08 } }
      });
      return {
        situationTh: `ปรมาจารย์พเนจรระดับ EP.${epNum} แวะพักจิบชา ณ หอเจ้าสำนักและถ่ายทอดคัมภีร์ยุทธ์`,
        outcomeTh: `มอบคัมภีร์จริง «${taught?.manual?.nameTh || 'คัมภีร์โบราณ'}» ให้ ${taught?.heroName || 'สำนัก'} เรียนรู้ทันที, เพิ่มความชำนาญวิชาทุกแขนง +${masteryGain} และรับบัฟ «รู้แจ้งเคล็ดวิชา»!`
      };
    }
  },
  {
    id: 'EVT_MERCHANT_CARAVAN',
    nameTh: 'ขบวนคาราวานพ่อค้าแดนไกลขอพักพิง',
    icon: '🏮',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 35,
    descTh: 'ขบวนพ่อค้าหยกต่างแคว้นขอพักพิงที่ตลาดชายแดน เติมสินค้าตลาดเต็มจำนวนทันที และเมื่อคุ้มกันครบเวลาจะมอบศิลาวิญญาณ โอสถจริง และเครื่องประดับหยกให้สำนัก!',
    start(g, epNum, tagId) {
      for (const k of Object.keys(g.s.merchantStock || {})) g.s.merchantStock[k] = 24;
      g.s.food = Math.min(160, (g.s.food || 0) + 16);
      const rewardStones = 90 + epNum * 50;
      return {
        situationTh: `ขบวนคาราวานพ่อค้าแดนไกล (ระดับการค้า EP.${epNum}) เข้าพักพิง ณ ตลาดชายแดน พร้อมเติมสินค้าเต็มตลาด`,
        objectiveTh: `คุ้มครองตลาดและหมู่บ้านให้ปลอดภัยจนขบวนคาราวานออกเดินทาง (35 วินาที)`,
        entityIds: [],
        timerOnly: true,
        rewardStones
      };
    },
    onComplete(g, inst) {
      const epNum = clamp(inst.epNum || 1, 1, 8);
      g.money(inst.rewardStones || 140, 'ค่าคุ้มกันขบวนคาราวานพ่อค้าแดนไกล');
      const pill = grantRealPills(g, 'REC1100_SUPPORT_QI', 2);
      const eq = grantRealEquipment(g, {
        nameTh: `จี้หยกพ่อค้าแดนไกล (EP.${epNum})`,
        slot: 'TALISMAN_VESSEL',
        tier: clamp(epNum, 1, 6),
        combatMult: 0.08 + epNum * 0.02,
        combatStats: { maxQi: 10 + epNum * 4, evasion: 4 + epNum, resistance: 8 + epNum * 3 }
      });
      return `ขบวนคาราวานมอบศิลา +${inst.rewardStones}, ${pill.nameTh} ×2 และเครื่องรางจริง «${eq.item.nameTh}» ให้ ${eq.ownerName}!`;
    }
  },
  {
    id: 'EVT_METEOR_STAR_IRON',
    nameTh: 'อุกกาบาตเหล็กดาราตกกลางหุบเขา',
    icon: '☄️',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 50,
    descTh: 'อุกกาบาตแร่ดาราตกลงในหุบเขา ดรอปแร่หายากลงบนพื้นแผนที่จริงทันที แต่แรงสั่นสะเทือนดึงดูดอสูรจากพูล EP เข้ามาแย่งชิง หากปราบสำเร็จจะหลอมเป็นศาสตราดาราตกสวรรค์!',
    start(g, epNum, tagId) {
      const hall = g.built?.('hall');
      spawnRealGroundDrops(g, (hall?.x || 950) + 220, (hall?.y || 1250) - 90, [
        { matId: epNum >= 5 ? 'MAT_ORE_THUNDER_IRON_4' : 'MAT_ORE_CLOUD_JADE_3', count: 3 },
        { matId: 'MAT_ORE_SPIRIT_COPPER_2', count: 4 }
      ], 'หลุมอุกกาบาตเหล็กดารา');
      const pool = EP_BEAST_TIDE_POOLS[clamp(epNum, 1, 8)];
      const b1 = spawnEventBeast(g, { ...pool.spawns[0], nameTh: 'อสูรกลืนแร่ดารา' }, tagId, 0).id;
      return {
        situationTh: `อุกกาบาตเหล็กดาราพุ่งตกใกล้เขตสำนัก ดรอปแร่ล้ำค่าลงพื้นแผนที่ พร้อมดึงดูด «อสูรกลืนแร่ดารา» เข้ามาแย่งชิง!`,
        objectiveTh: `ปราบอสูรกลืนแร่ดาราเพื่อยึดแกนอุกกาบาตมาตีศาสตรา`,
        entityIds: [b1],
        rewardStones: 110 + epNum * 45
      };
    },
    onComplete(g, inst) {
      const epNum = clamp(inst.epNum || 1, 1, 8);
      g.money(inst.rewardStones || 155, 'สกัดแกนอุกกาบาตเหล็กดารา');
      const eq = grantRealEquipment(g, {
        nameTh: `กระบี่เหล็กดาราตกสวรรค์ (EP.${epNum})`,
        slot: 'WEAPON',
        tier: clamp(epNum + 1, 2, 7),
        combatMult: 0.12 + epNum * 0.035,
        combatStats: { physicalAttack: 16 + epNum * 6, artAttack: 16 + epNum * 6, penetration: 5 + epNum * 2, critRate: 0.05 }
      });
      addEventAftermath(g, {
        id: 'AF_STAR_RADIANCE',
        nameTh: 'รัศมีดาราตกสวรรค์',
        icon: '☄️',
        kind: 'BLESSING',
        duration: 150,
        descTh: 'ปราณดาราช่วยเพิ่มเจาะเกราะ +10 และอัตราคริติคอล +5% ให้ศิษย์ทั้งสำนัก',
        mods: { add: { penetration: 10, critRate: 0.05 } }
      });
      return `หลอมแกนอุกกาบาตเป็นอาวุธจริง «${eq.item.nameTh}» มอบให้ ${eq.ownerName}, รับศิลา +${inst.rewardStones} และบัฟ «รัศมีดาราตกสวรรค์»!`;
    }
  },
  {
    id: 'EVT_WANDERING_DISCIPLE_REFUGE',
    nameTh: 'ผู้ฝึกตนพเนจรบาดเจ็บขอพึ่งพิงสำนัก',
    icon: '🙇',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: 'จอมยุทธ์พเนจรหนีการตามล่าของศัตรูมาขอเข้าสำนัก รับศิษย์ใหม่ที่มีระดับขั้นตาม EP เข้าสำนักจริง พร้อมคัมภีร์ติดตัว แต่จะทริกเกอร์อีเวนต์ต่อเนื่อง «นักฆ่าคู่แค้นบุกทวงหนี้แค้น» ในอีก 45 วินาที!',
    executeInstant(g, epNum) {
      let joinedName = null;
      const targetBand = requiredBandForEp(epNum);
      const room = g.heroes.filter(alive).length < g.capacity();
      if (room) g.money(100, 'ทุนต้อนรับผู้ฝึกตนพเนจรจากผู้ค้ำประกัน');
      const rec = room ? g.recruit?.() : null;
      if (room && !rec?.ok) g.money(-100, 'คืนทุนต้อนรับที่ยังไม่ใช้');
      let hero = rec?.npc;
      if (!hero && g.heroes.filter(alive).length > 0) {
        hero = pickBestHero(g);
      }
      if (rec?.ok && hero?.jianghu) {
        joinedName = hero.name;
        setStoryCultivationBand(g, hero, targetBand);
        hero.health = 68;
        g.storyEvents.ensureState(true).refugeeNpcId = hero.id;
      }
      const taught = grantRealManualAndTeach(g, clamp(epNum, 1, 6), clamp(epNum + 1, 2, 7), null, hero);
      if (rec?.ok) queueChainedEvent(g, 'EVT_CHAIN_PURSUERS_ARRIVE', 90, `นักฆ่าคู่แค้นแกะรอยตามผู้ฝึกตนพเนจรมาถึงหน้าประตูสำนักเมฆาคราม!`, 'ผู้ฝึกตนพเนจรขอพึ่งพิง');
      return {
        situationTh: `ผู้ฝึกตนพเนจรบาดเจ็บหอบคัมภีร์ลับมาคุกเข่าขอพึ่งพิงใบบุญสำนักเมฆาคราม`,
        outcomeTh: joinedName
          ? `รับศิษย์ใหม่ «${joinedName}» (ตบะเทียบเคียง ${targetBand}) เข้าร่วมสำนักจริง พร้อมคัมภีร์ «${taught?.manual?.nameTh || 'คัมภีร์ลับ'}» ให้ศึกษา (ระวัง: นักฆ่าคู่แค้นจะตามมาใน 90 วินาที)`
          : `ที่พักสำนักเต็ม ผู้ฝึกตนพเนจรมอบคัมภีร์จริง «${taught?.manual?.nameTh || 'คัมภีร์ลับ'}» ตอบแทนการชี้ทางก่อนเดินทางต่อ`
      };
    }
  },
  {
    id: 'EVT_CAULDRON_OVERLOAD',
    nameTh: 'เตาหลอมโอสถปะทุปราณอัคคี',
    icon: '🔥',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: 'ไฟปราณในเตาหลอมลุกโชติช่วงผิดปกติ กลั่นสมุนไพรในคลังออกมาเป็นโอสถจริง 4 เม็ดทันที เพิ่มความชำนาญปรุงยา และทิ้งผลพวงปราณอัคคีเร่งความเร็วโจมตี!',
    executeInstant(g, epNum) {
      const p1 = grantRealPills(g, 'REC1100_SUPPORT_QI', 2, { nameTh: `โอสถอัคคีปะทุปราณ (EP.${epNum})`, quality: 'SUPERIOR', effect: { restoreQi: 55 + epNum * 8, cultivationProgress: 10 + epNum * 2 } });
      const p2 = grantRealPills(g, 'REC1100_SUPPORT_RECOVERY', 2);
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu?.craftMasteryV140) {
          h.jianghu.craftMasteryV140.ALCHEMY = Math.min(100, (h.jianghu.craftMasteryV140.ALCHEMY || 20) + 7);
        }
      }
      addEventAftermath(g, {
        id: 'AF_CAULDRON_FIRE_QI',
        nameTh: 'ไออัคคีเตาหลอมเร่งปราณ',
        icon: '🔥',
        kind: 'BLESSING',
        duration: 120,
        descTh: 'ไอความร้อนจากเตาหลอมกระตุ้นเลือดลม ความเร็วโจมตี +8% และโจมตีวิชา +10%',
        mods: { scale: { attackSpeed: 1.08, artAttack: 1.10 } }
      });
      return {
        situationTh: `เปลวเพลิงวิญญาณในเตาหลอมปะทุขึ้นระดับ EP.${epNum} กลั่นตัวยาออกมาอย่างรวดเร็ว!`,
        outcomeTh: `ได้รับโอสถจริง «${p1.nameTh}» ×2 และ «${p2.nameTh}» ×2 เข้าคลังสำนัก, เพิ่มฝีมือปรุงยา +7 และรับบัฟ «ไออัคคีเตาหลอมเร่งปราณ»!`
      };
    }
  },
  {
    id: 'EVT_SPIRIT_SPRING_DISCOVERY',
    nameTh: 'ตาน้ำพุวิญญาณผุดกลางลานฝึก',
    icon: '💧',
    scope: 'ALL_EP',
    minEp: 1,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: 'ตาน้ำพุปราณบริสุทธิ์ผุดขึ้นในเขตสำนัก ฟื้นพลังชีวิตศิษย์และอสูรคู่หูเต็ม 100% รักษาอาการบาดเจ็บภายในและพิษสะสมทั้งหมด พร้อมเพิ่มเสบียงอาหารและบัฟน้ำพุทิพย์!',
    executeInstant(g, epNum) {
      for (const h of g.heroes.filter(alive)) {
        h.health = 100;
        if (h.jianghu) {
          h.jianghu.internalInjury = 0;
          h.jianghu.poisonAccumulated = 0;
          h.jianghu.pillToxicity = 0;
        }
      }
      for (const pet of (g.s.realm?.pets || [])) {
        if (pet.alive) pet.health = pet.maxHP;
      }
      g.s.food = Math.min(160, (g.s.food || 0) + 25);
      g.money(60 + epNum * 30, 'ตาน้ำพุวิญญาณควบแน่นศิลาปราณ');
      addEventAftermath(g, {
        id: 'AF_SPIRIT_SPRING',
        nameTh: 'น้ำพุวิญญาณชุบชีพจร',
        icon: '💧',
        kind: 'BLESSING',
        duration: 150,
        descTh: 'น้ำพุวิญญาณช่วยฟื้นฟูปราณ +18% และต้านทานปราณ +10% ให้ศิษย์ทุกคน',
        mods: { scale: { qiRegen: 1.18, resistance: 1.10 } }
      });
      return {
        situationTh: `ตาน้ำพุวิญญาณใสสะอาดผุดขึ้นกลางลานฝึกปราณ แผ่ไอเย็นบริสุทธิ์ทั่วสำนัก`,
        outcomeTh: `รักษาอาการบาดเจ็บภายในและพิษสะสมของศิษย์ทุกคนจนหายขาด, ฟื้น HP เต็ม 100%, เสบียงอาหาร +25, ศิลา +${60 + epNum * 30} และรับบัฟ «น้ำพุวิญญาณชุบชีพจร»!`
      };
    }
  },
  {
    id: 'EVT_BLACK_CLIFF_VENGEANCE',
    nameTh: 'คำสั่งล้างแค้นจากค่ายโจรผาทมิฬ',
    icon: '🩸',
    scope: 'EP_SPECIFIC',
    minEp: 1,
    maxEp: 3,
    kind: 'CONTINUOUS',
    duration: 50,
    descTh: '[เฉพาะ EP.1–3] ค่ายโจรผาทมิฬส่งมือสังหาร 2 คนลอบลงมาจากสันเขา เมื่อปราบสำเร็จจะได้อาวุธจริง «มีดสั้นเงาผาทมิฬ» เปิดเผยพิกัดค่ายโจร และตัดเสบียงค่ายโจรลง 30 หน่วย!',
    start(g, epNum, tagId) {
      const spec = EP_RAIDER_POOLS[clamp(epNum, 1, 3)];
      const ids = [0, 1].map(i => spawnEventRaider(g, { ...spec, nameTh: 'มือสังหารค่ายผาทมิฬ' }, tagId, i).id);
      return {
        situationTh: `ค่ายโจรผาทมิฬส่งมือสังหาร 2 คนลอบลงมาจากสันเขาหมอก!`,
        objectiveTh: `ปราบมือสังหารค่ายผาทมิฬทั้งหมด (${ids.length} คน)`,
        entityIds: ids,
        rewardStones: 180
      };
    },
    onComplete(g, inst) {
      g.money(inst.rewardStones || 180, 'รางวัลปราบมือสังหารผาทมิฬ');
      g.s.campSupplies = Math.max(0, (g.s.campSupplies || 0) - 30);
      g.s.campKnown = true;
      const eq = grantRealEquipment(g, {
        nameTh: 'มีดสั้นเงาผาทมิฬ',
        slot: 'WEAPON',
        tier: 2,
        combatMult: 0.14,
        combatStats: { physicalAttack: 18, critRate: 0.06, attackSpeed: 0.08, evasion: 5 }
      });
      return `ปราบมือสังหารสำเร็จ! ยึดอาวุธจริง «${eq.item.nameTh}» ให้ ${eq.ownerName}, ศิลา +${inst.rewardStones}, เปิดเผยที่ตั้งค่ายโจร และตัดเสบียงค่ายโจร -30!`;
    }
  },
  {
    id: 'EVT_REFUGEE_ARTISAN_AID',
    nameTh: 'ช่างฝีมืออพยพหนีภัยโจรขอแลกเปลี่ยนเสบียง',
    icon: '🛠️',
    scope: 'EP_SPECIFIC',
    minEp: 1,
    maxEp: 3,
    kind: 'INSTANT',
    descTh: '[เฉพาะ EP.1–3] ขบวนช่างฝีมือชายแดนขอรับบริจาคอาหารเล็กน้อย แลกกับการซ่อมแซมหมู่บ้านและอาคารสำนัก มอบไม้และเหล็กดำ พร้อมตีเสื้อเกราะหนังพยัคฆ์ให้ศิษย์!',
    executeInstant(g, epNum) {
      g.s.food = Math.max(20, (g.s.food || 60) - 8);
      g.s.villageHP = Math.min(1000, (g.s.villageHP || 700) + 180);
      for (const b of (g.s.buildings || [])) b.hp = Math.min(800, (b.hp || 400) + 140);
      g.s.wood += 30;
      grantStoryMaterial(g, 'MAT_ORE_BLACK_IRON_1', 12, 'REFUGEE_ARTISAN_GIFT');
      const eq = grantRealEquipment(g, {
        nameTh: 'เสื้อเกราะหนังพยัคฆ์ชายแดน',
        slot: 'ARMOR',
        tier: 2,
        defenseMult: 0.14,
        combatStats: { armor: 16, resistance: 12, maxHP: 20 }
      });
      return {
        situationTh: `กลุ่มช่างตีเหล็กและช่างไม้อพยพแวะขอพึ่งเสบียงอาหารที่หน้าสำนักเมฆาคราม`,
        outcomeTh: `ซ่อมแซมหมู่บ้าน +180 HP, ซ่อมอาคารทุกหลัง +140 HP, รับไม้ไผ่ +30, เหล็กดำ +12 และมอบชุดเกราะจริง «${eq.item.nameTh}» ให้ ${eq.ownerName}!`
      };
    }
  },
  {
    id: 'EVT_MIASMA_FOG_INVASION',
    nameTh: 'หมอกพิษบึงอสรพิษแผ่ปกคลุมหุบเขา',
    icon: '☠️',
    scope: 'EP_SPECIFIC',
    minEp: 2,
    maxEp: 5,
    kind: 'CONTINUOUS',
    duration: 50,
    descTh: '[เฉพาะ EP.2–5] อสรพิษหมอกพิษพันปีพ่นไอมรณะปกคลุมหุบเขา กดความเร็วเคลื่อนที่ระหว่างเกิดเหตุ แต่เมื่อปราบสำเร็จจะดรอปสมุนไพรพิษหายากลงพื้นแผนที่ มอบโอสถถอนพิษ และบัฟต้านทานพิษ!',
    start(g, epNum, tagId) {
      addEventAftermath(g, {
        id: 'AF_MIASMA_HAZARD',
        nameTh: 'ไอหมอกพิษบึงอสรพิษ',
        icon: '☠️',
        kind: 'HAZARD',
        duration: 50,
        descTh: 'หมอกพิษหน่วงความเร็วเคลื่อนที่ -10% จนกว่าจะปราบอสรพิษหมอกพิษสำเร็จ',
        mods: { scale: { moveSpeed: 0.90 } }
      });
      const b1 = spawnEventBeast(g, { speciesId: 'BEAST_EMERALD_PYTHON', nameTh: 'อสรพิษหมอกพิษพันปี', tier: 3, hp: 280, power: 520 }, tagId, 0).id;
      return {
        situationTh: `«อสรพิษหมอกพิษพันปี» เลื้อยขึ้นมาจากบึงน้ำดำพร้อมแผ่หมอกพิษปกคลุมหุบเขา!`,
        objectiveTh: `สังหารอสรพิษหมอกพิษพันปีเพื่อสลายหมอกพิษและเก็บดีงูพันปี`,
        entityIds: [b1],
        rewardStones: 260
      };
    },
    onComplete(g, inst) {
      if (g.s?.storyEvents?.aftermaths) {
        g.s.storyEvents.aftermaths = g.s.storyEvents.aftermaths.filter(a => a.id !== 'AF_MIASMA_HAZARD');
      }
      g.money(inst.rewardStones || 260, 'รางวัลสลายหมอกพิษพันปี');
      const hall = g.built?.('hall');
      spawnRealGroundDrops(g, (hall?.x || 950) + 140, (hall?.y || 1250) + 120, [
        { matId: 'MAT_HERB_MIST_ORCHID_2', count: 4 },
        { matId: 'MAT_HERB_NETHER_MUSHROOM_3', count: 2 }
      ], 'ซากอสรพิษหมอกพิษพันปี');
      grantRealPills(g, 'REC1100_SUPPORT_RECOVERY', 3, { nameTh: 'โอสถดีงูมรกตถอนพิษ', quality: 'SUPERIOR', effect: { healHealth: 65, restoreQi: 40 } });
      addEventAftermath(g, {
        id: 'AF_POISON_IMMUNITY',
        nameTh: 'คุ้มกันพิษดีงูพันปี',
        icon: '🛡️',
        kind: 'BLESSING',
        duration: 160,
        descTh: 'ต้านทานปราณและพิษเพิ่มขึ้น +18% และฟื้นปราณ +10%',
        mods: { scale: { resistance: 1.18, qiRegen: 1.10 } }
      });
      return `สลายหมอกพิษสำเร็จ! ดรอปเห็ดยมโลกและกล้วยไม้หมอกลงพื้นแผนที่, รับ «โอสถดีงูมรกตถอนพิษ» ×3, ศิลา +${inst.rewardStones} และบัฟ «คุ้มกันพิษดีงูพันปี»!`;
    }
  },
  {
    id: 'EVT_AUSPICIOUS_PILL_THUNDER',
    nameTh: 'อัสนีโอสถและนิมิตเตาหลอมโบราณ',
    icon: '⚗️',
    scope: 'EP_SPECIFIC',
    minEp: 3,
    maxEp: 6,
    kind: 'INSTANT',
    descTh: '[เฉพาะ EP.3–6] เมฆมงคลและอัสนีโอสถฟาดลงสู่เตาหลอม ชำระพิษโอสถของศิษย์ทุกคนจนหมดสิ้น ประทานโอสถทิพย์จริง 4 เม็ด และเพิ่มฝีมือปรุงยา!',
    executeInstant(g, epNum) {
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) {
          h.jianghu.pillToxicity = 0;
          h.jianghu.poisonAccumulated = 0;
          h.jianghu.craftMasteryV140 = h.jianghu.craftMasteryV140 || {};
          h.jianghu.craftMasteryV140.ALCHEMY = Math.min(100, (h.jianghu.craftMasteryV140.ALCHEMY || 20) + 8);
        }
      }
      grantRealPills(g, 'REC1100_SUPPORT_QI', 2);
      grantRealPills(g, 'REC1100_SUPPORT_RECOVERY', 2);
      addEventAftermath(g, {
        id: 'AF_PILL_THUNDER',
        nameTh: 'ประกายอัสนีโอสถมงคล',
        icon: '⚗️',
        kind: 'BLESSING',
        duration: 150,
        descTh: 'ปราณโอสถมงคลเพิ่มฟื้นฟูปราณ +16% และปราณสูงสุด +15',
        mods: { scale: { qiRegen: 1.16 }, add: { maxQi: 15 } }
      });
      return {
        situationTh: `เมฆมงคลห้าสีและอัสนีโอสถฟาดลงสู่เตาหลอมของสำนักเมฆาคราม!`,
        outcomeTh: `ชำระพิษโอสถของศิษย์ทุกคนเป็น 0, เพิ่มฝีมือปรุงยา +8, ได้รับโอสถทิพย์จริงรวม 4 เม็ดเข้าคลัง และรับบัฟ «ประกายอัสนีโอสถมงคล»!`
      };
    }
  },
  {
    id: 'EVT_RIVAL_SECT_CHALLENGE',
    nameTh: 'เทียบท้าประลองยุทธ์จากสำนักข้างเคียง',
    icon: '🗡️',
    scope: 'EP_SPECIFIC',
    minEp: 3,
    maxEp: 6,
    kind: 'CONTINUOUS',
    duration: 45,
    descTh: '[เฉพาะ EP.3–6] ศิษย์เอกสำนักกระบี่เมฆาขาวมาท้าประลองยุทธ์ เมื่อชนะจะได้รับอาวุธจริง «กระบี่หยกเมฆาขาว» และทริกเกอร์อีเวนต์ต่อเนื่อง «ทูตสำนักกระบี่เมฆาขาวนำของขวัญมาคารวะ»!',
    start(g, epNum, tagId) {
      const spec = { ...EP_RAIDER_POOLS[clamp(epNum, 3, 6)], count: 1, boss: true, bossNameTh: 'ไป๋อวิ๋นเฟย · ศิษย์เอกสำนักกระบี่เมฆาขาว' };
      const id = spawnEventRaider(g, spec, tagId, 0).id;
      return {
        situationTh: `«ไป๋อวิ๋นเฟย» ยอดฝีมือต่างสำนักเดินทางมาท้าประลองยุทธ์ที่หน้าหอฝึกปราณ!`,
        objectiveTh: `เอาชนะผู้ท้าประลองยุทธ์เพื่อประกาศเกียรติภูมิสำนักเมฆาคราม`,
        entityIds: [id],
        rewardStones: 300 + epNum * 35
      };
    },
    onComplete(g, inst) {
      g.money(inst.rewardStones || 400, 'รางวัลชนะการท้าประลองยุทธ์ต่างสำนัก');
      const eq = grantRealEquipment(g, {
        nameTh: 'กระบี่หยกเมฆาขาว',
        slot: 'WEAPON',
        tier: 4,
        combatMult: 0.20,
        combatStats: { physicalAttack: 26, artAttack: 30, accuracy: 10, critRate: 0.06 }
      });
      for (const h of g.heroes.filter(alive)) {
        root.World2026Engine?.recordTrackDaoEvidenceV1200?.(g.world, h, 'COMBAT', 12);
      }
      queueChainedEvent(g, 'EVT_CHAIN_RIVAL_GIFT_ENVOY', 40, 'สำนักกระบี่เมฆาขาวยอมรับในฝีมือและส่งทูตนำของกำนัลมาผูกไมตรี', inst.nameTh);
      return `ชนะการประลอง! มอบอาวุธจริง «${eq.item.nameTh}» ให้ ${eq.ownerName}, รับศิลา +${inst.rewardStones} และสำนักกระบี่เมฆาขาวกำลังส่งทูตนำของขวัญมาคารวะ!`;
    }
  },
  {
    id: 'EVT_SPIRIT_BEAST_MIGRATION',
    nameTh: 'ฝูงอสูรวิญญาณมงคลอพยพผ่านหุบเขา',
    icon: '🦌',
    scope: 'EP_SPECIFIC',
    minEp: 3,
    maxEp: 7,
    kind: 'INSTANT',
    descTh: '[เฉพาะ EP.3–7] กวางเซียนและอสูรมงคลเดินผ่านหุบเขา ฟื้นพลังชีวิตและความผูกพันอสูรคู่หูทุกตัว และมอบลูกกวางหยกมงคลเป็นอสูรคู่หูตัวใหม่ให้ศิษย์ในสำนักจริง!',
    executeInstant(g, epNum) {
      for (const pet of (g.s.realm?.pets || [])) {
        if (pet.alive) {
          pet.health = pet.maxHP;
          pet.hunger = 0;
          if (pet.ownerId) pet.trust = clamp((pet.trust || 20) + 18, 0, 100);
        }
      }
      grantStoryMaterial(g, 'MAT_HERB_CLOUD_PEONY_2', 4, 'BEAST_MIGRATION_GIFT');
      let newPetMsg = '';
      if ((g.s.realm?.pets?.filter(p => p.alive)?.length || 0) < 5) {
        const res = grantRealCompanionBeast(g, {
          speciesId: 'BEAST_CLOUD_ANTLER_DEER',
          nameTh: 'กวางหยกเมฆามงคล (คู่หูวาสนา)',
          tier: clamp(epNum - 1, 2, 5),
          hp: 190 + epNum * 30,
          power: 320 + epNum * 65,
          trust: 75
        });
        if (res) newPetMsg = `, พร้อมมอบอสูรคู่หูจริง «${res.pet.name}» ให้เคียงข้าง ${res.ownerName}`;
      }
      return {
        situationTh: `ฝูงกวางทองและอสูรมงคลเคลื่อนผ่านอุทยานเมฆาคราม แผ่ปราณบริสุทธิ์ทั่วบริเวณ`,
        outcomeTh: `อสูรคู่หูทุกตัวฟื้นพลังชีวิตเต็มและเพิ่มความผูกพัน +18, รับโบตั๋นเมฆาคราม ×4 เข้าคลัง${newPetMsg}!`
      };
    }
  },
  {
    id: 'EVT_ANCESTRAL_STELE_VISION',
    nameTh: 'ศิลาจารึกบรรพชนเปล่งแสงส่องมรรคา',
    icon: '📜',
    scope: 'EP_SPECIFIC',
    minEp: 4,
    maxEp: 7,
    kind: 'INSTANT',
    descTh: '[เฉพาะ EP.4–7] รอยกระบี่บนศิลาจารึกเปล่งแสงสั่นพ้อง เปิดจุดชีพจรปราณให้ศิษย์ทุกคน +1 จุด มอบคัมภีร์โบราณเข้าหอคัมภีร์ และให้บัฟปราณบรรพชน!',
    executeInstant(g, epNum) {
      for (const h of g.heroes.filter(alive)) {
        const j = h.jianghu;
        if (!j) continue;
        j.foundationStability = Math.min(100, (j.foundationStability || 58) + 12);
        j.daoComprehension = Math.min(100, (j.daoComprehension || 52) + 12);
        j.meridiansV150 = j.meridiansV150 || {};
        grantMeridianNodes(g, h, 1);
      }
      const taught = grantRealManualAndTeach(g, 4, 5, null);
      addEventAftermath(g, {
        id: 'AF_ANCESTRAL_STELE',
        nameTh: 'รัศมีศิลาจารึกบรรพชน',
        icon: '📜',
        kind: 'BLESSING',
        duration: 160,
        descTh: 'เจตจำนงบรรพชนหนุนนำ โจมตีกายภาพ +12% และโจมตีวิชาปราณ +12%',
        mods: { scale: { physicalAttack: 1.12, artAttack: 1.12 } }
      });
      return {
        situationTh: `ศิลาจารึกโบราณในสำนักเปล่งลำแสงสีทองส่องสะท้อนเข้าสู่ทะเลสำนึกของศิษย์ทุกคน!`,
        outcomeTh: `เปิดจุดชีพจรปราณศิษย์ทุกคน +1 จุด, มอบคัมภีร์จริง «${taught?.manual?.nameTh || 'จารึกบรรพชน'}» ให้ ${taught?.heroName} และรับบัฟ «รัศมีศิลาจารึกบรรพชน»!`
      };
    }
  },
  {
    id: 'EVT_BLOOD_MOON_DEMON_TIDE',
    nameTh: 'จันทราโลหิตปลุกคลื่นอสูรมาร',
    icon: '🌑',
    scope: 'EP_SPECIFIC',
    minEp: 5,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 60,
    descTh: '[เฉพาะ EP.5–8] จันทราสีโลหิตปลุกอสูรเงาโลหิตและทูตมาร เมื่อปราบสำเร็จจะได้รับชุดเกราะจริง «คลุมโลหิตจันทราทมิฬ» และทริกเกอร์อีเวนต์ต่อเนื่อง «บัวโลหิตพันปีเบ่งบาน»!',
    start(g, epNum, tagId) {
      const pool = EP_BEAST_TIDE_POOLS[clamp(epNum, 5, 8)];
      const bId = spawnEventBeast(g, { ...pool.spawns[0], nameTh: 'อสูรเงาจันทราโลหิต' }, tagId, 0).id;
      const rId = spawnEventRaider(g, { ...EP_RAIDER_POOLS[clamp(epNum, 5, 8)], boss: true, bossNameTh: 'ทูตจันทราโลหิต' }, tagId, 1).id;
      return {
        situationTh: `ดวงจันทร์ทอแสงสีโลหิตเหนือหุบเขาเมฆาคราม อสูรเงาจันทราโลหิตและทูตมารปรากฏตัวขึ้น!`,
        objectiveTh: `ปราบอสูรเงาจันทราโลหิตและทูตมารเพื่อสลายอาถรรพ์จันทราโลหิต`,
        entityIds: [bId, rId],
        rewardStones: 580 + epNum * 55
      };
    },
    onComplete(g, inst) {
      g.money(inst.rewardStones || 850, 'รางวัลสลายอาถรรพ์จันทราโลหิต');
      const eq = grantRealEquipment(g, {
        nameTh: 'คลุมโลหิตจันทราทมิฬ',
        slot: 'ARMOR',
        tier: 5,
        defenseMult: 0.26,
        combatStats: { armor: 34, resistance: 34, critRate: 0.07, evasion: 10 }
      });
      queueChainedEvent(g, 'EVT_CHAIN_BLOOD_LOTUS_BLOOM', 40, 'หยดโลหิตของอสูรจันทราซึมลงสู่ผืนดิน กระตุ้นให้บัวโลหิตพันปีเบ่งบานขึ้น', inst.nameTh);
      return `สลายอาถรรพ์จันทราโลหิตสำเร็จ! มอบเกราะจริง «${eq.item.nameTh}» ให้ ${eq.ownerName}, ศิลา +${inst.rewardStones} และเตรียมพบปรากฏการณ์ «บัวโลหิตพันปีเบ่งบาน»!`;
    }
  },
  {
    id: 'EVT_MYRIAD_RIFT_ERUPTION',
    nameTh: 'รอยแยกแดนหมื่นภพปะทุสมบัติบรรพกาล',
    icon: '🌀',
    scope: 'EP_SPECIFIC',
    minEp: 6,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[เฉพาะ EP.6–8] รอยแยกมิติปะทุคลื่นสมบัติ ดรอปวัตถุดิบระดับสูงลงบนพื้นแผนที่จริง มอบเครื่องรางระดับ 5 «ตราประทับรอยแยกหมื่นภพ» และเปิดจุดวาสนา 2 แห่ง!',
    executeInstant(g, epNum) {
      const hall = g.built?.('hall');
      spawnRealGroundDrops(g, (hall?.x || 950) + 180, (hall?.y || 1250) - 120, [
        { matId: 'MAT_ORE_THUNDER_IRON_4', count: 3 },
        { matId: 'MAT_HERB_STARLIGHT_GRASS_4', count: 3 },
        { matId: 'MAT_HERB_SOUL_LOTUS_3', count: 3 }
      ], 'สมบัติปะทุจากรอยแยกหมื่นภพ');
      g.realm?.spawnFortune?.();
      g.realm?.spawnFortune?.();
      const eq = grantRealEquipment(g, {
        nameTh: 'ตราประทับรอยแยกหมื่นภพ',
        slot: 'TALISMAN_VESSEL',
        tier: 5,
        combatMult: 0.28,
        combatStats: { artAttack: 38, physicalAttack: 28, penetration: 14, maxQi: 35 }
      });
      return {
        situationTh: `รอยแยกแดนหมื่นภพสั่นสะเทือน พัดพาสมบัติวิญญาณและวัตถุดิบระดับสูงตกลงสู่หุบเขา!`,
        outcomeTh: `ดรอปเหล็กอัสนีคราม, หญ้าดาราพันปี และบัววิญญาณลงบนแผนที่จริง, มอบเครื่องราง «${eq.item.nameTh}» ให้ ${eq.ownerName} และเกิดจุดวาสนาใหม่ 2 แห่ง!`
      };
    }
  },
  {
    id: 'EVT_NINE_HEAVEN_TRIBULATION',
    nameTh: 'อสนีบาตเก้าสวรรค์ขัดเกลาตบะ',
    icon: '⚡',
    scope: 'EP_SPECIFIC',
    minEp: 7,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 50,
    descTh: '[เฉพาะ EP.7–8] อสูรอัสนีสวรรค์พิพากษาลงมาทดสอบสำนัก เมื่อปราบสำเร็จจะได้รับ «แหวนอัสนีเก้าสวรรค์» เพิ่มอายุขัย +6 ปี ตบะ +25% และบัฟกายาอมตะอัสนีสวรรค์!',
    start(g, epNum, tagId) {
      const b1 = spawnEventBeast(g, { speciesId: 'BEAST_FROST_BEAR', nameTh: 'อสูรอัสนีสวรรค์พิพากษา', tier: 6, hp: 660, power: 1680 }, tagId, 0).id;
      return {
        situationTh: `เมฆทัณฑ์อัสนีเก้าสวรรค์ปกคลุมยอดเขาเมฆาคราม พร้อมการจุติของ «อสูรอัสนีสวรรค์พิพากษา»!`,
        objectiveTh: `ปราบอสูรอัสนีสวรรค์พิพากษาเพื่อรับพรแห่งฟ้าดิน`,
        entityIds: [b1],
        rewardStones: 1150
      };
    },
    onComplete(g, inst) {
      g.money(inst.rewardStones || 1150, 'รางวัลผ่านพ้นทัณฑ์อัสนีเก้าสวรรค์');
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) grantStoryLifespan(h, 6, this.id);
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 25);
      }
      const eq = grantRealEquipment(g, {
        nameTh: 'แหวนอัสนีเก้าสวรรค์',
        slot: 'TALISMAN_VESSEL',
        tier: 6,
        combatMult: 0.34,
        combatStats: { physicalAttack: 40, artAttack: 48, attackSpeed: 0.12, critRate: 0.09, maxQi: 42 }
      });
      addEventAftermath(g, {
        id: 'AF_THUNDER_IMMORTAL',
        nameTh: 'กายาอมตะอัสนีสวรรค์',
        icon: '⚡',
        kind: 'BLESSING',
        duration: 180,
        descTh: 'สายฟ้าสวรรค์หล่อเลี้ยงกายา โจมตีทุกแขนง +16%, เกราะและต้านทาน +16%, ความเร็วโจมตี +12%',
        mods: { scale: { physicalAttack: 1.16, artAttack: 1.16, armor: 1.16, resistance: 1.16, attackSpeed: 1.12 } }
      });
      return `ผ่านพ้นทัณฑ์อัสนี! มอบเครื่องรางจริง «${eq.item.nameTh}» ให้ ${eq.ownerName}, ศิษย์ทุกคนตบะ +25%, อายุขัย +6 ปี, ศิลา +${inst.rewardStones} และรับบัฟ «กายาอมตะอัสนีสวรรค์»!`;
    }
  },
  {
    id: 'EVT_BRANCH_RIGHTEOUS_PILGRIMAGE',
    nameTh: 'ขบวนสาธุชนและผู้ทรงศีลถวายเครื่องไทยทาน',
    icon: '🪷',
    scope: 'BRANCH_EXCLUSIVE',
    reqBranches: ['RIGHTEOUS', 'RIGHTEOUS_SANCTUARY', 'RIGHTEOUS_BODHI', 'GOLDEN_BASTION', 'BODHI_SCRIPTURE', 'CELESTIAL_ORTHODOX', 'IMMORTAL_SANCTUARY'],
    minEp: 2,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[เฉพาะกิ่งธรรมะ/โพธิจิต] ชาวบ้านและผู้ทรงศีลเดินทางมาถวายศิลาวิญญาณ เสบียง โอสถทิพย์ และอวยพรเกราะศรัทธาคุ้มครองสำนัก!',
    executeInstant(g, epNum) {
      const stones = 180 + epNum * 45;
      g.money(stones, 'เครื่องไทยทานจากขบวนสาธุชน');
      g.s.food = Math.min(160, (g.s.food || 0) + 30);
      g.s.villageHP = 1000;
      const pill = grantRealPills(g, 'REC1100_SUPPORT_RECOVERY', 3);
      addEventAftermath(g, {
        id: 'AF_PEOPLE_FAITH',
        nameTh: 'แรงศรัทธาปุถุชนคุ้มภัย',
        icon: '🪷',
        kind: 'BLESSING',
        duration: 160,
        descTh: 'แรงศรัทธาของชาวบ้านเพิ่มต้านทานปราณ +16%, เกราะ +12% และต้านสถานะ +8%',
        mods: { scale: { resistance: 1.16, armor: 1.12 }, add: { controlResist: 0.08 } }
      });
      return {
        situationTh: `ขบวนชาวบ้านชิงหยุนและนักพรตผู้ทรงศีลนำเครื่องไทยทานมาถวายแด่สำนักเมฆาครามด้วยความเลื่อมใส`,
        outcomeTh: `ได้รับศิลาวิญญาณ +${stones}, อาหาร +30, ฟื้นฟูหมู่บ้านเต็ม 1,000 HP, รับ «${pill.nameTh}» ×3 และบัฟ «แรงศรัทธาปุถุชนคุ้มภัย»!`
      };
    }
  },
  {
    id: 'EVT_BRANCH_MARTIAL_BLOOD_ARENA',
    nameTh: 'ประลองยุทธ์ชิงศาสตราโลหิตหน้าลานสำนัก',
    icon: '🔥',
    scope: 'BRANCH_EXCLUSIVE',
    reqBranches: ['MARTIAL', 'MARTIAL_FORGE', 'MARTIAL_BEAST', 'IRON_CONQUEROR', 'BEAST_SOVEREIGN', 'SUPREME_MARTIAL', 'MARTIAL_WARLORD', 'GOD_MARTIAL_EMPIRE'],
    minEp: 2,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 45,
    descTh: '[เฉพาะกิ่งศาสตรา/สงคราม] จอมยุทธ์พเนจรผู้ครอบครองง้าวโลหิตเดินทางมาท้าประลอง เมื่อเอาชนะได้จะยึดอาวุธจริง «ง้าวโลหิตพยัคฆ์คำราม» และเปิดจุดชีพจรปราณให้ผู้ชนะ!',
    start(g, epNum, tagId) {
      const spec = { ...EP_RAIDER_POOLS[clamp(epNum, 2, 8)], count: 1, boss: true, bossNameTh: 'ขุนพลดาบโลหิตพเนจร' };
      const id = spawnEventRaider(g, spec, tagId, 0).id;
      return {
        situationTh: `«ขุนพลดาบโลหิตพเนจร» ได้ยินกิตติศัพท์สายศาสตราของสำนัก จึงเดินทางมาท้าเดิมพันด้วยอาวุธคู่กาย!`,
        objectiveTh: `เอาชนะขุนพลดาบโลหิตพเนจรในการประลองเดิมพันศาสตรา`,
        entityIds: [id],
        rewardStones: 240 + epNum * 45
      };
    },
    onComplete(g, inst) {
      const epNum = clamp(inst.epNum || 2, 2, 8);
      g.money(inst.rewardStones || 330, 'ชนะเดิมพันลานประลองศาสตราโลหิต');
      const hero = pickBestHero(g);
      if (hero?.jianghu) {
        hero.jianghu.meridiansV150 = hero.jianghu.meridiansV150 || {};
        grantMeridianNodes(g, hero, 1);
      }
      const eq = grantRealEquipment(g, {
        nameTh: `ง้าวโลหิตพยัคฆ์คำราม (EP.${epNum})`,
        slot: 'WEAPON',
        tier: clamp(epNum + 1, 3, 7),
        combatMult: 0.16 + epNum * 0.03,
        combatStats: { physicalAttack: 22 + epNum * 6, critRate: 0.07, critDamage: 0.22, penetration: 8 + epNum * 2 }
      }, hero);
      addEventAftermath(g, {
        id: 'AF_WARGOD_ARENA',
        nameTh: 'เดชะจ้าวศาสตราไร้พ่าย',
        icon: '🔥',
        kind: 'BLESSING',
        duration: 160,
        descTh: 'ชัยชนะเหนือจอมยุทธ์พเนจรเพิ่มโจมตีกายภาพ +15% และความแรงคริติคอล +15%',
        mods: { scale: { physicalAttack: 1.15 }, add: { critDamage: 0.15 } }
      });
      return `ชนะเดิมพัน! มอบอาวุธจริง «${eq.item.nameTh}» และเปิดชีพจรปราณ +1 จุดให้ ${eq.ownerName}, รับศิลา +${inst.rewardStones} และบัฟ «เดชะจ้าวศาสตราไร้พ่าย»!`;
    }
  },
  {
    id: 'EVT_BRANCH_ARCANE_SECRET_AUCTION',
    nameTh: 'ประมูลลับตำหนักเงาจันทร์',
    icon: '🔮',
    scope: 'BRANCH_EXCLUSIVE',
    reqBranches: ['ARCANE', 'ARCANE_ELIXIR', 'ARCANE_SHADOW', 'GRAND_ALCHEMIST', 'SHADOW_NETHER', 'MYRIAD_UNORTHODOX', 'ABYSSAL_PACT', 'PRIMORDIAL_DAO_LORD'],
    minEp: 2,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[เฉพาะกิ่งเร้นลับ/เงาจันทร์] ตลาดประมูลลับใต้ดินเปิดทำการเฉพาะสำนักที่ถือครองป้ายเร้นลับ มอบคัมภีร์วิชาระดับสูง เครื่องรางเร้นดารา และสมุนไพรหายากเข้าคลังจริง!',
    executeInstant(g, epNum) {
      const taught = grantRealManualAndTeach(g, clamp(epNum, 2, 6), clamp(epNum + 1, 3, 7), null);
      const eq = grantRealEquipment(g, {
        nameTh: `จี้หยกเร้นดาราตำหนักเงา (EP.${epNum})`,
        slot: 'TALISMAN_VESSEL',
        tier: clamp(epNum + 1, 3, 7),
        combatMult: 0.15 + epNum * 0.03,
        combatStats: { artAttack: 20 + epNum * 5, critRate: 0.06, evasion: 8, maxQi: 16 + epNum * 4 }
      });
      grantStoryMaterial(g, 'MAT_HERB_BLOOD_GINSENG_3', 3, 'SECRET_AUCTION');
      grantStoryMaterial(g, 'MAT_HERB_SOUL_LOTUS_3', 2, 'SECRET_AUCTION');
      return {
        situationTh: `ผู้ถือโคมตำหนักเงาจันทร์เปิดห้องประมูลลับพิเศษต้อนรับตัวแทนสำนักเมฆาคราม`,
        outcomeTh: `คว้าคัมภีร์จริง «${taught?.manual?.nameTh || 'คัมภีร์ลับ'}» ให้ ${taught?.heroName}, เครื่องรางจริง «${eq.item.nameTh}» ให้ ${eq.ownerName} พร้อมโสมโลหิต ×3 และบัววิญญาณ ×2 เข้าคลัง!`
      };
    }
  },
  {
    id: 'EVT_BRANCH_BEAST_KING_TRIBUTE',
    nameTh: 'พญาอสูรป่าเมฆานำลูกอสูรมาผูกพันธสัญญา',
    icon: '🐾',
    scope: 'BRANCH_EXCLUSIVE',
    reqBranches: ['MARTIAL_BEAST', 'BEAST_SOVEREIGN', 'SUPREME_MARTIAL', 'CONQUER_RIFT', 'GOD_MARTIAL_EMPIRE'],
    minEp: 3,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[เฉพาะกิ่งสยบอสูร] พญาอสูรในหุบเขายอมรับบารมีของสำนัก ส่งลูกอสูรสายเลือดบริสุทธิ์มาผูกพันธสัญญาเป็นคู่หูจริงให้ศิษย์ พร้อมดรอปชิ้นส่วนอสูรล้ำค่า!',
    executeInstant(g, epNum) {
      const res = grantRealCompanionBeast(g, {
        speciesId: epNum >= 5 ? 'BEAST_FROST_BEAR' : 'BEAST_FROST_MOON_LYNX',
        nameTh: `อสูรสายเลือดราชันย์ (EP.${epNum})`,
        tier: clamp(epNum, 3, 6),
        hp: 240 + epNum * 55,
        power: 450 + epNum * 110,
        trust: 85
      });
      grantStoryMaterial(g, 'MAT_BP_WOLF_FANG_1', 10, 'BEAST_TRIBUTE');
      return {
        situationTh: `เสียงคำรามกึกก้องจากชายป่า พญาอสูรนำลูกอสูรสายเลือดราชันย์มาส่งมอบที่หน้าอุทยานสำนัก`,
        outcomeTh: `ได้รับอสูรคู่หูจริง «${res?.pet?.name || 'อสูรราชันย์'}» ผูกพันธสัญญากับ ${res?.ownerName || 'ศิษย์เอก'} พร้อมเขี้ยวอสูร ×10 เข้าคลังสำนัก!`
      };
    }
  },
  {
    id: 'EVT_BRANCH_ELIXIR_IMMORTAL_FURNACE',
    nameTh: 'เตาหลอมเก้าสุริยันกลั่นโอสถทิพย์สำเร็จเอง',
    icon: '🏺',
    scope: 'BRANCH_EXCLUSIVE',
    reqBranches: ['ARCANE_ELIXIR', 'GRAND_ALCHEMIST', 'HARVEST_RIFT', 'PRIMORDIAL_DAO_LORD'],
    minEp: 3,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[เฉพาะกิ่งโอสถสวรรค์] ปราณยาที่สะสมในเตาหลอมเก้าสุริยันควบแน่นจนกลั่นโอสถทิพย์ออกมาเอง 6 เม็ด เพิ่มตบะศิษย์ทุกคน +18% และมอบบัฟไอยาอมฤต!',
    executeInstant(g, epNum) {
      const p1 = grantRealPills(g, 'REC1100_SUPPORT_QI', 3, { nameTh: `โอสถทิพย์เก้าสุริยัน (EP.${epNum})`, quality: 'TRANSCENDENT', effect: { restoreQi: 80, cultivationProgress: 20 } });
      const p2 = grantRealPills(g, 'REC1100_SUPPORT_RECOVERY', 3, { nameTh: `โอสถอมฤตชุบกายา (EP.${epNum})`, quality: 'TRANSCENDENT', effect: { healHealth: 80, restoreQi: 50 } });
      for (const h of g.heroes.filter(alive)) {
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 18);
      }
      addEventAftermath(g, {
        id: 'AF_IMMORTAL_FURNACE',
        nameTh: 'ไอยาอมฤตเก้าสุริยัน',
        icon: '🏺',
        kind: 'BLESSING',
        duration: 180,
        descTh: 'ไอยาอมฤตฟื้นฟูปราณ +24% และพลังวิชาปราณ +14%',
        mods: { scale: { qiRegen: 1.24, artAttack: 1.14 } }
      });
      return {
        situationTh: `เตาหลอมโอสถส่งเสียงกังวานพร้อมลำแสงสีทอง กลั่นโอสถทิพย์สำเร็จขึ้นเองโดยอัตโนมัติ!`,
        outcomeTh: `ได้รับ «${p1.nameTh}» ×3 และ «${p2.nameTh}» ×3 เข้าคลังและสัมภาระศิษย์, ศิษย์ทุกคนตบะ +18% และรับบัฟ «ไอยาอมฤตเก้าสุริยัน»!`
      };
    }
  },
  {
    id: 'EVT_BRANCH_SHADOW_INTELLIGENCE',
    nameTh: 'สายลับเงามืดส่งแผนที่ขุมทรัพย์และตัดกำลังศัตรู',
    icon: '🗡️',
    scope: 'BRANCH_EXCLUSIVE',
    reqBranches: ['ARCANE_SHADOW', 'SHADOW_NETHER', 'MYRIAD_UNORTHODOX', 'ABYSSAL_PACT'],
    minEp: 3,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[เฉพาะกิ่งเงามืด] เครือข่ายสายลับเงาจันทราวางยาพิษตัดกำลังศัตรูบนแผนที่ทั้งหมด -35% HP เปิดจุดวาสนา 2 แห่ง ดรอปสมุนไพรหายากหน้าสำนัก และมอบเครื่องรางก้าวเงา!',
    executeInstant(g, epNum) {
      for (const e of (g.enemies || []).filter(alive)) {
        e.health = Math.min(e.health, Math.max(1, Math.round(e.health * 0.65)));
      }
      g.realm?.spawnFortune?.();
      g.realm?.spawnFortune?.();
      const hall = g.built?.('hall');
      spawnRealGroundDrops(g, (hall?.x || 950) + 90, (hall?.y || 1250) + 90, [
        { matId: 'MAT_HERB_NETHER_MUSHROOM_3', count: 3 },
        { matId: 'MAT_ORE_CLOUD_JADE_3', count: 3 }
      ], 'เสบียงลับจากสายลับเงาจันทรา');
      const eq = grantRealEquipment(g, {
        nameTh: 'ป้ายหยกทูตเงาไร้ร่องรอย',
        slot: 'TALISMAN_VESSEL',
        tier: clamp(epNum, 3, 6),
        combatMult: 0.18,
        combatStats: { evasion: 14, moveSpeed: 10, critRate: 0.07, accuracy: 8 }
      });
      return {
        situationTh: `นกพิราบเงาจากเครือข่ายมืดนำรายงานลับและห่อสมบัติมาส่งที่หอเจ้าสำนัก`,
        outcomeTh: `ตัดพลังชีวิตศัตรูบนแผนที่ทั้งหมดลง 35%, เกิดจุดวาสนา 2 แห่ง, ดรอปเห็ดยมโลกและหยกเมฆาหน้าสำนัก และมอบ «${eq.item.nameTh}» ให้ ${eq.ownerName}!`
      };
    }
  },
  {
    id: 'EVT_CHAIN_APEX_VENGEANCE',
    nameTh: '[ผลพวงต่อเนื่อง] จ่าฝูงอสูรบรรพกาลตามกลิ่นโลหิตมาล้างแค้น!',
    icon: '🐺',
    scope: 'CHAIN_FOLLOWUP',
    minEp: 1,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 50,
    descTh: '[อีเวนต์ผลพวงจากคลื่นสัตว์อสูร] กลิ่นโลหิตของฝูงอสูรที่ถูกสังหารดึงดูดจ่าฝูงระดับสูงกว่าพูลปกติเข้ามาล้างแค้น เมื่อปราบสำเร็จจะได้รับเครื่องรางแก่นอสูรจ่าฝูงของจริง!',
    start(g, epNum, tagId) {
      const pool = EP_BEAST_TIDE_POOLS[clamp(epNum + 1, 1, 8)];
      const sp = pool.spawns[0];
      const b1 = spawnEventBeast(g, { ...sp, nameTh: `พญาจ่าฝูง${sp.nameTh} (ล้างแค้น)` }, tagId, 0).id;
      return {
        situationTh: `[ผลพวงต่อเนื่อง] กลิ่นโลหิตจากศึกคลื่นสัตว์อสูรชักนำ «พญาจ่าฝูง${sp.nameTh}» บุกมาล้างแค้นถึงหน้าสำนัก!`,
        objectiveTh: `สังหารพญาจ่าฝูงอสูรเพื่อคว้าแก่นอสูรพันปี`,
        entityIds: [b1],
        rewardStones: 200 + epNum * 65
      };
    },
    onComplete(g, inst) {
      const epNum = clamp(inst.epNum || 1, 1, 8);
      g.money(inst.rewardStones || 265, 'รางวัลปราบพญาจ่าฝูงอสูรล้างแค้น');
      const eq = grantRealEquipment(g, {
        nameTh: `แก่นอสูรพญาจ่าฝูง (EP.${epNum})`,
        slot: 'TALISMAN_VESSEL',
        tier: clamp(epNum + 1, 2, 7),
        combatMult: 0.16 + epNum * 0.03,
        combatStats: { physicalAttack: 18 + epNum * 5, artAttack: 18 + epNum * 5, maxHP: 25 + epNum * 4, critDamage: 0.18 }
      });
      return `สังหารพญาจ่าฝูงสำเร็จ! สกัดเป็นเครื่องรางจริง «${eq.item.nameTh}» มอบให้ ${eq.ownerName} และรับศิลาวิญญาณ +${inst.rewardStones}!`;
    }
  },
  {
    id: 'EVT_CHAIN_BEAST_MERCHANT',
    nameTh: '[ผลพวงต่อเนื่อง] พ่อค้าชิ้นส่วนอสูรเดินทางมารับซื้อถึงสำนัก',
    icon: '💰',
    scope: 'CHAIN_FOLLOWUP',
    minEp: 1,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[อีเวนต์ผลพวงจากคลื่นสัตว์อสูร] พ่อค้าใหญ่นอกด่านได้ข่าวว่าสำนักเพิ่งปราบคลื่นสัตว์อสูร จึงเดินทางมารับซื้อชิ้นส่วนที่เหลือโดยให้ราคาสูงลิ่ว พร้อมมอบโอสถและเมล็ดพันธุ์!',
    executeInstant(g, epNum) {
      const ledger = g.bank.jianghu.ledgerV140;
      const pieces = ledger.materialStacks.filter(m => m.matId.startsWith('MAT_BP_') && m.count > 0);
      let sold = 0;
      for (const piece of pieces) { const q = Math.min(4 - sold, piece.count); if (q > 0 && g.consume(g.bank, piece.matId, q)) sold += q; if (sold >= 4) break; }
      if (!sold) return { ok: false, reason: 'ไม่มีชิ้นส่วนอสูรในคลังสำนักให้พ่อค้ารับซื้อ' };
      const payout = sold * (18 + epNum * 6);
      g.money(payout, 'ขายชิ้นส่วนอสูรให้พ่อค้าแดนไกล');
      const pill = grantRealPills(g, 'REC1100_SUPPORT_QI', 3);
      g.s.seedStock.cloudPeony = (g.s.seedStock.cloudPeony || 0) + 2;
      return {
        situationTh: `[ผลพวงต่อเนื่อง] พ่อค้าชิ้นส่วนอสูรเดินทางตามข่าวการปราบคลื่นอสูรมาขอรับซื้อเศษซากอสูรถึงหน้าสำนัก`,
        outcomeTh: `ขายชิ้นส่วนอสูรจริง ${sold} หน่วย รับศิลา +${payout}, รับ «${pill.nameTh}» ×3 และเมล็ดโบตั๋นเมฆา ×2 เข้าคลัง`
      };
    }
  },
  {
    id: 'EVT_CHAIN_CRYSTAL_CONDENSATION',
    nameTh: '[ผลพวงต่อเนื่อง] ผลึกศิลาปราณควบแน่นหลังชีพจรปราณปะทุ',
    icon: '💎',
    scope: 'CHAIN_FOLLOWUP',
    minEp: 1,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[อีเวนต์ผลพวงจากชีพจรปราณปะทุ] แรงดันปราณที่ตกค้างตกผลึกเป็นก้อนแร่วิญญาณ ดรอปลงบนพื้นแผนที่รอบหอเจ้าสำนักและเพิ่มศิลาวิญญาณเข้าคลังจริง!',
    executeInstant(g, epNum) {
      const stones = 160 + epNum * 50;
      g.money(stones, 'เก็บเกี่ยวผลึกศิลาปราณควบแน่น');
      const hall = g.built?.('hall');
      spawnRealGroundDrops(g, (hall?.x || 950) - 110, (hall?.y || 1250) + 110, [
        { matId: 'MAT_ORE_CLOUD_JADE_3', count: 3 },
        { matId: 'MAT_ORE_SPIRIT_COPPER_2', count: 4 },
        { matId: 'MAT_ORE_CINNABAR_1', count: 5 }
      ], 'ผลึกควบแน่นจากชีพจรปราณ');
      return {
        situationTh: `[ผลพวงต่อเนื่อง] ไอน้ำค้างปราณที่หลงเหลือจากการปะทุของชีพจรฟ้าดินจับตัวเป็นผลึกแร่ส่องประกายรอบสำนัก!`,
        outcomeTh: `ได้รับศิลาวิญญาณ +${stones} เข้าคลังทันที และดรอปผลึกแร่หยกเมฆา ทองแดงวิญญาณ และชาดปราณลงบนพื้นแผนที่ 3 กอง!`
      };
    }
  },
  {
    id: 'EVT_CHAIN_PURSUERS_ARRIVE',
    nameTh: '[ผลพวงต่อเนื่อง] นักฆ่าคู่แค้นของศิษย์ใหม่บุกมาทวงหนี้แค้น!',
    icon: '⚔️',
    scope: 'CHAIN_FOLLOWUP',
    minEp: 1,
    maxEp: 8,
    kind: 'CONTINUOUS',
    duration: 50,
    descTh: '[อีเวนต์ผลพวงจากผู้ฝึกตนพเนจรขอพึ่งพิง] นักฆ่าที่ไล่ล่าศิษย์ใหม่ตามมาถึงหน้าสำนัก หากช่วยกันปราบสำเร็จ ศิษย์คนนั้นจะภักดีต่อสำนักอย่างสุดหัวใจ ได้รับตบะเพิ่ม และยึดดาบคู่ล่าวิญญาณ!',
    start(g, epNum, tagId) {
      const spec = EP_RAIDER_POOLS[clamp(epNum, 1, 8)];
      const r1 = spawnEventRaider(g, { ...spec, boss: true, bossNameTh: 'หัวหน้านักฆ่าล่าวิญญาณ' }, tagId, 0).id;
      const r2 = spawnEventRaider(g, { ...spec, nameTh: 'มือสังหารเงาโลหิต' }, tagId, 1).id;
      return {
        situationTh: `[ผลพวงต่อเนื่อง] นักฆ่าคู่แค้น 2 คนแกะรอยผู้ฝึกตนพเนจรมาถึงหน้าประตูสำนักเมฆาคราม!`,
        objectiveTh: `ปกป้องศิษย์ในสำนักและสังหารนักฆ่าคู่แค้นทั้ง 2 คน`,
        entityIds: [r1, r2],
        rewardStones: 210 + epNum * 50
      };
    },
    onComplete(g, inst) {
      const epNum = clamp(inst.epNum || 1, 1, 8);
      g.money(inst.rewardStones || 260, 'รางวัลปราบนักฆ่าคู่แค้น');
      for (const h of g.heroes.filter(alive)) {
        g.remember(h, 'defend', 8, 'พี่น้องร่วมสำนักช่วยกันสกัดมือสังหาร');
        for (const ally of g.heroes.filter(alive)) if (ally.id !== h.id) g.life?.relate(h, ally, 2, 1);
        root.World2026Engine?.applyNpcCultivationProgressGain?.(g.world, h, 20);
      }
      const eq = grantRealEquipment(g, {
        nameTh: `ดาบคู่ล่าวิญญาณ (EP.${epNum})`,
        slot: 'WEAPON',
        tier: clamp(epNum + 1, 2, 7),
        combatMult: 0.16 + epNum * 0.03,
        combatStats: { physicalAttack: 20 + epNum * 5, attackSpeed: 0.10, critRate: 0.07, evasion: 6 }
      });
      return `ปกป้องพี่น้องร่วมสำนักสำเร็จ! ศิษย์จดจำการช่วยเหลือ สายสัมพันธ์ระหว่างสมาชิกดีขึ้น และตบะ +20%, รับศิลา +${inst.rewardStones} และยึดอาวุธจริง «${eq.item.nameTh}» ให้ ${eq.ownerName}!`;
    }
  },
  {
    id: 'EVT_CHAIN_RIVAL_GIFT_ENVOY',
    nameTh: '[ผลพวงต่อเนื่อง] ทูตสำนักกระบี่เมฆาขาวนำของขวัญมาคารวะยอมรับฝีมือ',
    icon: '🎁',
    scope: 'CHAIN_FOLLOWUP',
    minEp: 3,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[อีเวนต์ผลพวงจากเทียบท้าประลองยุทธ์] หลังพ่ายแพ้ในการประลอง สำนักกระบี่เมฆาขาวจึงส่งทูตนำศิลาวิญญาณ คัมภีร์กระบี่ และป้ายไมตรีสำนักพันธมิตรมามอบให้!',
    executeInstant(g, epNum) {
      const stones = 320 + epNum * 45;
      g.money(stones, 'ของกำนัลคารวะจากสำนักกระบี่เมฆาขาว');
      const taught = grantRealManualAndTeach(g, clamp(epNum, 3, 6), clamp(epNum + 1, 4, 7), 'XIAN');
      addEventAftermath(g, {
        id: 'AF_ALLIED_SECT_PRESTIGE',
        nameTh: 'เกียรติภูมิพันธมิตรสำนักกระบี่',
        icon: '🎁',
        kind: 'BLESSING',
        duration: 180,
        descTh: 'บารมีจากการยอมรับของสำนักข้างเคียง เพิ่มพลังโจมตีและป้องกันทุกด้าน +12%',
        mods: { scale: { physicalAttack: 1.12, artAttack: 1.12, armor: 1.12, resistance: 1.12 } }
      });
      return {
        situationTh: `[ผลพวงต่อเนื่อง] ทูตจากสำนักกระบี่เมฆาขาวเดินทางมาประสานมือคารวะและมอบของกำนัลเชื่อมสัมพันธไมตรี`,
        outcomeTh: `ได้รับศิลาวิญญาณ +${stones}, มอบคัมภีร์กระบี่จริง «${taught?.manual?.nameTh || 'คัมภีร์กระบี่'}» ให้ ${taught?.heroName} และรับบัฟ «เกียรติภูมิพันธมิตรสำนักกระบี่»!`
      };
    }
  },
  {
    id: 'EVT_CHAIN_BLOOD_LOTUS_BLOOM',
    nameTh: '[ผลพวงต่อเนื่อง] บัวโลหิตพันปีเบ่งบานหลังคืนจันทราโลหิต',
    icon: '🌺',
    scope: 'CHAIN_FOLLOWUP',
    minEp: 5,
    maxEp: 8,
    kind: 'INSTANT',
    descTh: '[อีเวนต์ผลพวงจากจันทราโลหิต] ณ จุดที่ปราบอสูรจันทราโลหิต ดอกบัวโลหิตพันปีได้ผลิบานขึ้น มอบสมุนไพรระดับสูงเข้าคลัง เพิ่มอายุขัยศิษย์ทุกคน +5 ปี และเพิ่มปราณสูงสุดถาวร!',
    executeInstant(g, epNum) {
      grantStoryMaterial(g, 'MAT_HERB_SOUL_LOTUS_3', 5, 'BLOOD_LOTUS_BLOOM');
      grantStoryMaterial(g, 'MAT_HERB_BLOOD_GINSENG_3', 5, 'BLOOD_LOTUS_BLOOM');
      for (const h of g.heroes.filter(alive)) {
        if (h.jianghu) {
          grantStoryLifespan(h, 5, this.id);
          unlockSectDoctrine(g, { id: 'DOC_BLOOD_LOTUS_V205', nameTh: 'กลิ่นหอมบัวโลหิตประคองปราณ', branchKey: 'ROOT', ep: 5, descTh: 'ปราณสูงสุดของสมาชิกสำนัก +12 ถาวร รับมตินี้ได้หนึ่งครั้ง', mods: { add: { maxQi: 12 } } });
          const cs = g.combatSystem?.ensure(h);
          if (cs) { cs.qi = cs.maxQi; h.jianghu.currentQiV190 = cs.qi; }
        }
      }
      return {
        situationTh: `[ผลพวงต่อเนื่อง] แสงอรุณรุ่งหลังคืนจันทราโลหิตส่องกระทบหยดเลือดอสูร ผลิบานเป็น «บัวโลหิตพันปี» ส่งกลิ่นหอมทั่วหุบเขา!`,
        outcomeTh: `ได้รับบัววิญญาณเจ็ดสี ×5 และโสมโลหิต ×5 เข้าคลังสำนัก · รับพรอายุขัย +5 ปีและมติปราณสูงสุด +12 ได้ครั้งแรกครั้งเดียว`
      };
    }
  }
];

// ============================================================================
// SECT TREASURY & AUTONOMOUS NPC QUARTERMASTER / DISTRIBUTION SYSTEM (v2.04)
// - Sect Master appoints Treasury Elder (or handles distribution personally) based on personality
// - Disciples submit real Item Requisitions (Equipment, Pills, Manuals/Scrolls, Materials)
// - Distributor approves/rejects or proactively distributes based on Merit, Need, or Favoritism/Bias!
// ============================================================================
const TREASURY_PENDING_LIMIT = 64;
const TREASURY_MEMBER_REQUEST_LIMIT = 2;

function treasuryMemberAvailable(g, npc, official = false) {
  const p = npc?.stageLocal;
  const member = g?.life?.member?.(npc);
  if (!alive(npc) || !g?.s?.heroIds?.includes(npc.id) || !member || !p ||
      p.enemy || p.visitor || p.service || p.offmap || p.journey ||
      p.action === 'seclusion' || npc.jianghu?.inSeclusion ||
      (member.disgracedUntil || 0) > (g.s.t || 0)) return false;
  return !official || !g.life?.available || g.life.available(npc);
}

function treasuryOwnsItem(g, item) {
  if (!item || item.count === 0 || item.loan || item.loanedTo || item.loanedToNpcId ||
      item.rights === 'LOAN' || item.access === 'PRIVATE' || item.canRedistribute === false ||
      item.reservedForFormation) return false;
  return [item.ownerNpcId, item.ownerId].every(id => !id || id === g.bank?.id);
}

function treasuryRequestSpec(g, itemKind, item) {
  const art = itemKind === 'SCROLL' ? g.progression?.artMap?.get(item.artId) : null;
  return {
    itemKind, itemId: itemKind === 'MATERIAL' ? item.matId : item.id,
    itemNameTh: item.nameTh || art?.nameTh || item.matId || item.id,
    slot: item.slot || 'WEAPON', tier: item.tier || art?.tier || 1,
    path: art?.path || item.path || 'ANY', artId: item.artId || null
  };
}

function treasuryRequestSource(g, itemKind, itemId) {
  const bank = getBankTreasuryItems(g);
  const list = { EQUIPMENT: bank.equipment, PILL: bank.pills, SCROLL: bank.scrolls, MATERIAL: bank.materials }[itemKind];
  if (!list) return null;
  return (itemId ? list.find(item => item.id === itemId || (itemKind === 'MATERIAL' && item.matId === itemId)) ||
    (itemKind === 'SCROLL' ? list.find(item => item.artId === itemId) : null) : list[0]) || null;
}

function treasuryPillMergeTarget(ledger, source) {
  const signature = item => JSON.stringify(Object.fromEntries(Object.keys(item).sort()
    .filter(k => !['id', 'count', 'ownerId', 'ownerNpcId', 'custodianNpcId', 'originalStackId','contributionCreditAllowed','sectGrant','sectStore','storeCount','curatedByNpcId','curatedByNameTh','curatedAt','suppliedByNpcId','suppliedByNameTh','suppliedAt','provenanceMode','craftedByNpcId'].includes(k))
    .map(k => [k, item[k]]).concat([['contributionCreditAllowed',item.contributionCreditAllowed!==false]])));
  return (ledger.pillStacks || []).find(item => !item.loan && !item.loanedTo &&
    item.rights !== 'LOAN' && signature(item) === signature(source));
}

function prepareTreasuryTransfer(g, req, recipientNpc) {
  const fail = effectTextTh => ({ ok: false, effectTextTh });
  if (!treasuryMemberAvailable(g, recipientNpc)) return fail('ผู้รับต้องเป็นศิษย์ที่อยู่ในสำนักและไม่ถูกพักหน้าที่');
  const bankLedger = g.bank?.jianghu?.ledgerV140, recLedger = recipientNpc.jianghu?.ledgerV140;
  if (!bankLedger || !recLedger) return fail('ไม่พบสมุดบัญชีคลัง');
  const item = treasuryRequestSource(g, req.itemKind, req.itemId);
  if (!item) return fail('พัสดุนี้ไม่อยู่ในคลังส่วนรวม หรือมีสิทธิ์เจ้าของ/การยืมคุ้มครองอยู่');
  const stock = root.JianghuSectContributions?.prepareStock(g, req, item, recipientNpc);
  if (stock && !stock.ok) return fail(stock.reason);
  const caps = root.World2026Engine?.PATCH140_CAPS || {};
  if (req.itemKind === 'EQUIPMENT') {
    if ((recLedger.equipmentItems || []).length >= (caps.equipmentItems || 12)) return fail('สัมภาระศาสตราผู้รับเต็ม');
    const canEquip = g.progression?.canEquipItem?.(recipientNpc, item, { ignoreOwnership: true });
    if (!canEquip?.ok) return fail(canEquip?.reason || 'ผู้รับยังไม่เหมาะสมกับศาสตรานี้');
  } else if (req.itemKind === 'PILL') {
    const mergeTarget = treasuryPillMergeTarget(recLedger, {...item,...(root.JianghuSectContributions?.transferFlags(g,req,item)||{})});
    if (!mergeTarget && (recLedger.pillStacks || []).length >= (caps.pillStacks || 16)) return fail('สัมภาระโอสถผู้รับเต็ม');
    return { ok: true, item, bankLedger, recLedger, mergeTarget, stock };
  } else if (req.itemKind === 'SCROLL') {
    if (!g.progression?.artMap?.has(item.artId)) return fail('ไม่พบวิชาของคัมภีร์ในทะเบียนจริง');
    if ((recLedger.scrolls || []).length >= (caps.scrollsPerOwner || 24)) return fail('สัมภาระคัมภีร์ผู้รับเต็ม');
  } else if (req.itemKind === 'MATERIAL') {
    const stacks = stock?.lots?.map(x=>x.item) || bankLedger.materialStacks.filter(s => s.matId === item.matId && s.count > 0);
    // The canonical transfer walks all matching source stacks; do not let it debit protected custody.
    if (stacks.some(s => !treasuryOwnsItem(g, s))) return fail('วัตถุดิบชนิดนี้มีทรัพย์สินส่วนตัวหรือของยืมฝากอยู่');
    const room = root.HumanCore ? Math.max(0, root.HumanCore.carryLimit(recipientNpc) - root.HumanCore.load(recipientNpc)) : 0;
    const qty = stock?.quantity ?? Math.min(2, room, stacks.reduce((sum, s) => sum + s.count, 0));
    if (qty <= 0) return fail('สัมภาระวัตถุดิบผู้รับเต็ม');
    if (!g.transferMaterialStack || !g.canAcceptMaterial?.(recipientNpc, item.matId, {...item,...(root.JianghuSectContributions?.transferFlags(g,req,item)||{})})) return fail('ไม่มีช่องรับวัตถุดิบนี้');
    return { ok: true, item:stock?.lots?.[0]?.item||item, bankLedger, recLedger, qty, stock };
  } else return fail('ไม่รู้จักประเภทพัสดุ');
  return { ok: true, item, bankLedger, recLedger, stock };
}

function analyzeDistributorPhilosophy(g, npc) {
  if (!npc) {
    return {
      styleId: 'BALANCED',
      styleBadgeTh: '⚖️ สมดุลตามระเบียบสำนัก',
      summaryTh: 'ยังไม่มีผู้ดำรงตำแหน่งชัดเจน ใช้เกณฑ์สมดุลระหว่างความเหมาะสมและผลงาน',
      meritWeight: 1.0,
      needWeight: 1.0,
      favoritismWeight: 0.4,
      compassionWeight: 0.8,
      combatWeight: 0.8,
      approvalThreshold: 50
    };
  }
  const p = npc.personality || {};
  const v = npc.core?.values || {};
  const integrity = Number(p.integrity ?? 50);
  const discipline = Number(p.discipline ?? 50);
  const empathy = Number(p.empathy ?? 50);
  const ambition = Number(p.ambition ?? 50);
  const caution = Number(p.caution ?? 50);
  const courage = Number(p.courage ?? 50);
  const trustfulness = Number(p.trustfulness ?? 50);
  const wealthVal = Number(v.wealthResource ?? 50);
  const dutyVal = Number(v.sectDuty ?? 50);
  const clanVal = Number(v.familyClan ?? 50);

  const meritScore = (integrity - 50) * 0.8 + (discipline - 50) * 0.7 + (dutyVal - 50) * 0.5;
  const cronyScore = (58 - integrity) * 1.55 + (clanVal - 45) * 0.65 + (trustfulness - 45) * 0.45;
  const compassionScore = (empathy - 50) * 1.1 - ((p.aggression ?? 50) - 50) * 0.3;
  const warScore = (courage - 50) * 0.7 + (ambition - 50) * 0.7 + ((p.aggression ?? 50) - 50) * 0.5;
  const hoardScore = (caution - 50) * 0.7 + (wealthVal - 50) * 0.8 - (empathy - 50) * 0.5;

  let styleId = 'MERIT_AND_FIT';
  let styleBadgeTh = '⚖️ เที่ยงธรรมตามความเหมาะสมและผลงาน';
  let summaryTh = `ยึดถือความยุติธรรม (เที่ยงธรรม ${Math.round(integrity)}, วินัย ${Math.round(discipline)}) มอบของให้ศิษย์ที่มีผลงานและเหมาะสมกับวิชามากที่สุด`;

  const top = Math.max(meritScore, cronyScore, compassionScore, warScore, hoardScore);
  if (top === cronyScore && cronyScore >= 6) {
    styleId = 'CRONY_FAVORITISM';
    styleBadgeTh = '🤝 เอนเอียงเข้าข้างคนสนิทและพวกพ้อง';
    summaryTh = `ให้ความสำคัญกับสายสัมพันธ์ส่วนตัวมากกว่ากฎเกณฑ์ (เที่ยงธรรม ${Math.round(integrity)}) มักอนุมัติของดีให้คนที่สนิทสนมคุ้นเคยก่อนเสมอ`;
  } else if (top === compassionScore && compassionScore >= 8) {
    styleId = 'COMPASSIONATE_RELIEF';
    styleBadgeTh = '🪷 เมตตาอุ้มชูผู้บาดเจ็บและผู้อ่อนแอ';
    summaryTh = `จิตใจเปี่ยมเมตตา (เมตตา ${Math.round(empathy)}) มักแจกจ่ายโอสถและเครื่องป้องกันให้ศิษย์ที่บาดเจ็บหรือตบะยังน้อยก่อน`;
  } else if (top === warScore && warScore >= 8) {
    styleId = 'WAR_PRIORITY';
    styleBadgeTh = '⚔️ มุ่งเน้นขุนพลแนวหน้าและกำลังรบ';
    summaryTh = `มุ่งหวังชัยชนะและอำนาจ (ทะเยอทะยาน ${Math.round(ambition)}, กล้าหาญ ${Math.round(courage)}) ทุ่มศาสตราและทรัพยากรให้ตัวตึงแนวหน้าของสำนัก`;
  } else if (top === hoardScore && hoardScore >= 10) {
    styleId = 'HOARDER_CONSERVATIVE';
    styleBadgeTh = '🔒 เข้มงวดตระหนี่ เก็บสำรองคลัง';
    summaryTh = `ระมัดระวังและหวงแหนทรัพย์สิน (รอบคอบ ${Math.round(caution)}) อนุมัติยากหากไม่มีความจำเป็นเร่งด่วนหรือผลงานโดดเด่นจริง`;
  }

  return {
    styleId,
    styleBadgeTh,
    summaryTh,
    meritWeight: clamp(0.6 + (integrity + discipline) / 110, 0.4, 2.0),
    needWeight: clamp(0.7 + (discipline + (p.rationality ?? 50)) / 120, 0.5, 1.8),
    favoritismWeight: styleId === 'CRONY_FAVORITISM'
      ? clamp(1.35 + (70 - integrity) / 45, 1.2, 2.4)
      : clamp(0.35 + (60 - integrity) / 90, 0.15, 1.2),
    compassionWeight: clamp(0.5 + empathy / 65, 0.3, 2.1),
    combatWeight: clamp(0.5 + (ambition + courage) / 120, 0.4, 1.9),
    approvalThreshold: clamp(Math.round(50 + hoardScore * 0.45 - (empathy - 50) * 0.15), 38, 66)
  };
}

function getMasterNpc(g) {
  const masterId = g?.s?.life?.offices?.master?.npcId;
  if (masterId && treasuryMemberAvailable(g, g.world?.npcs?.[masterId], true)) return g.world.npcs[masterId];
  return null;
}

function evaluateMasterTreasuryDecision(g) {
  const master = getMasterNpc(g);
  if (!master) return null;
  const p = master.personality || {};
  const v = master.core?.values || {};
  const selfControlScore = +(50 + ((p.ambition ?? 50) - 50) * 0.45 + ((p.caution ?? 50) - 50) * 0.38 - ((p.trustfulness ?? 50) - 50) * 0.52 + ((v.powerStatus ?? 50) - 50) * 0.35).toFixed(1);
  const delegateBaseScore = +(50 + ((p.trustfulness ?? 50) - 50) * 0.48 + ((p.rationality ?? 50) - 50) * 0.32 + ((p.empathy ?? 50) - 50) * 0.22).toFixed(1);

  const others = (g.heroes || []).filter(h => treasuryMemberAvailable(g, h, true) && h.id !== master.id);
  const masterIntegrity = Number(p.integrity ?? 50);

  const candidateScores = others.map(cand => {
    const cp = cand.personality || {};
    const rel = root.World2026Engine?.getRelationshipV130?.(g.world, master, cand, false) || { affinity: 0, bond: 0 };
    const merit = g.life?.member?.(cand)?.merit || 0;
    const cap = root.HumanCore?.capacity?.(cand, 'sectSteward')?.total || 50;
    let score = 40;
    let reasonParts = [];
    if (masterIntegrity >= 54) {
      const competenceContrib = cap * 0.42 + (cp.integrity ?? 50) * 0.28 + (cp.discipline ?? 50) * 0.25 + Math.min(15, merit * 0.4);
      const relContrib = (rel.affinity || 0) * 0.15 + (rel.bond || 0) * 0.12;
      score += competenceContrib * 0.55 + relContrib;
      reasonParts.push(`ความสามารถดูแลคลัง ${cap.toFixed(0)} · เที่ยงธรรม ${Math.round(cp.integrity ?? 50)} · ผลงาน ${merit.toFixed(1)}`);
      if ((rel.affinity || 0) >= 10) reasonParts.push(`ความคุ้นเคย +${Math.round(rel.affinity)}`);
    } else {
      const relContrib = (rel.affinity || 0) * 0.75 + (rel.bond || 0) * 0.65 + 18;
      const competenceContrib = cap * 0.20 + Math.min(10, merit * 0.25);
      score += relContrib + competenceContrib;
      reasonParts.push(`คนสนิทที่เจ้าสำนักไว้ใจส่วนตัว (ความสนิท ${Math.round(rel.affinity || 0)}, ผูกพัน ${Math.round(rel.bond || 0)})`);
    }
    return {
      npcId: cand.id,
      name: cand.name,
      score: +score.toFixed(1),
      affinityWithMaster: Math.round(rel.affinity || 0),
      bondWithMaster: Math.round(rel.bond || 0),
      merit: +merit.toFixed(1),
      stewardCapacity: +cap.toFixed(1),
      philosophy: analyzeDistributorPhilosophy(g, cand),
      reasonTh: reasonParts.join(' · ')
    };
  }).sort((a, b) => b.score - a.score);

  const bestCandidate = candidateScores[0] || null;
  const willMasterDirect = !bestCandidate || (selfControlScore > delegateBaseScore + 6);
  const decisionReasonTh = willMasterDirect
    ? `${master.name} (เจ้าสำนัก) มีนิสัยทะเยอทะยาน/รอบคอบสูง (คุมเอง ${selfControlScore} vs มอบหมาย ${delegateBaseScore}) จึงเลือกกุมกุญแจคลังและอนุมัติพัสดุด้วยตนเอง`
    : `${master.name} (เจ้าสำนัก) เลือกแต่งตั้ง «${bestCandidate.name}» เป็นผู้อาวุโสดูแลคลัง เพราะ${bestCandidate.reasonTh}`;

  return {
    masterId: master.id,
    masterName: master.name,
    selfControlScore,
    delegateBaseScore,
    willMasterDirect,
    recommendedMode: willMasterDirect ? 'MASTER_DIRECT' : 'APPOINTED_ELDER',
    recommendedElderId: bestCandidate?.npcId || null,
    recommendedElderName: bestCandidate?.name || null,
    decisionReasonTh,
    masterPhilosophy: analyzeDistributorPhilosophy(g, master),
    candidateScores
  };
}

function getActiveTreasuryDistributor(g, st) {
  const tr = st?.treasury || {};
  const master = getMasterNpc(g);
  const mode = tr.authorityMode || 'APPOINTED_ELDER';
  if (mode === 'MASTER_DIRECT' && master) {
    return {
      npc: master,
      roleTitleTh: 'เจ้าสำนัก (กุมอำนาจคลังโดยตรง)',
      mode: 'MASTER_DIRECT',
      philosophy: analyzeDistributorPhilosophy(g, master)
    };
  }
  const elderId = tr.elderNpcId || g?.s?.life?.offices?.steward?.npcId;
  const elder = elderId && treasuryMemberAvailable(g, g.world?.npcs?.[elderId], true) ? g.world.npcs[elderId] : null;
  if (elder) {
    return {
      npc: elder,
      roleTitleTh: 'ผู้อาวุโสหอคลัง (ได้รับแต่งตั้งจากเจ้าสำนัก)',
      mode: 'APPOINTED_ELDER',
      philosophy: analyzeDistributorPhilosophy(g, elder)
    };
  }
  const fallback = master;
  return {
    npc: fallback,
    roleTitleTh: fallback ? 'เจ้าสำนัก (รักษาการหอคลัง)' : 'สภาคลังสำนัก',
    mode: 'MASTER_DIRECT',
    philosophy: analyzeDistributorPhilosophy(g, fallback)
  };
}

function getBankTreasuryItems(g) {
  const l = g?.bank?.jianghu?.ledgerV140 || {};
  const equipment = (l.equipmentItems || []).filter(i => treasuryOwnsItem(g, i) && (i.durability === undefined || i.durability > 0));
  const pills = (l.pillStacks || []).filter(p => treasuryOwnsItem(g, p) && p.count > 0);
  const scrolls = (l.scrolls || []).filter(s => treasuryOwnsItem(g, s) && g.progression?.artMap?.has(s.artId));
  const libraryScrolls = (g?.s?.growth?.scriptureLibrary || []).filter(Boolean);
  const materials = (l.materialStacks || []).filter(m => treasuryOwnsItem(g, m) && m.count > 0);
  return { equipment, pills, scrolls, libraryScrolls, materials };
}

function evaluateRequisitionScore(g, distributorNpc, philosophy, requesterNpc, reqItem) {
  if (!requesterNpc) return { totalScore: 0, approved: false, breakdown: {} };
  const isSelf = distributorNpc && distributorNpc.id === requesterNpc.id;
  const rel = (distributorNpc && !isSelf)
    ? (root.World2026Engine?.getRelationshipV130?.(g.world, distributorNpc, requesterNpc, false) || { affinity: 0, bond: 0 })
    : { affinity: isSelf ? 35 : 0, bond: isSelf ? 25 : 0 };
  const merit = g.life?.member?.(requesterNpc)?.merit || 0;

  // 1. Suitability & Real Need Score (0..38)
  let needScore = 16;
  let needReasonTh = 'นำไปใช้เสริมความแข็งแกร่งในการฝึกตน';
  if (reqItem.itemKind === 'EQUIPMENT') {
    const slot = reqItem.slot || 'WEAPON';
    const curId = requesterNpc.jianghu?.equipmentV140?.[slot];
    const curEq = (requesterNpc.jianghu?.ledgerV140?.equipmentItems || []).find(x => x.id === curId);
    const tierDiff = (reqItem.tier || 2) - (curEq?.tier || 0);
    if (!curEq) {
      needScore = 32;
      needReasonTh = `ยังไม่มีอุปกรณ์ช่อง ${slot} สวมใส่ จึงจำเป็นต้องใช้โดยตรง`;
    } else if (tierDiff > 0) {
      needScore = 22 + tierDiff * 5;
      needReasonTh = `ยกระดับศาสตราจากระดับ ${curEq.tier || 1} สู่ระดับ ${reqItem.tier || 2}`;
    } else {
      needScore = 8;
      needReasonTh = `มีอุปกรณ์ระดับใกล้เคียงกันอยู่แล้ว`;
    }
  } else if (reqItem.itemKind === 'PILL') {
    const injured = requesterNpc.health < 80 || (requesterNpc.jianghu?.internalInjury || 0) > 0 || (requesterNpc.jianghu?.poisonAccumulated || 0) > 0;
    const nearBreak = (requesterNpc.jianghu?.cultivationProgress || 0) >= 55;
    if (injured) {
      needScore = 34;
      needReasonTh = `กำลังบาดเจ็บ (HP ${Math.round(requesterNpc.health)}%) จำเป็นต้องใช้โอสถรักษาเร่งด่วน`;
    } else if (nearBreak) {
      needScore = 27;
      needReasonTh = `ตบะอยู่ที่ ${Math.round(requesterNpc.jianghu?.cultivationProgress || 0)}% กำลังเตรียมทะลวงคอขวด`;
    } else {
      needScore = 17;
      needReasonTh = `ขอสำรองไว้ฟื้นฟูปราณระหว่างออกศึก`;
    }
  } else if (reqItem.itemKind === 'SCROLL') {
    const matchPath = !reqItem.path || reqItem.path === 'ANY' || reqItem.path === requesterNpc.jianghu?.path;
    needScore = matchPath ? 29 : 14;
    needReasonTh = matchPath ? `คัมภีร์ตรงกับ${PATH_META[requesterNpc.jianghu?.path]?.nameTh || 'วิถีของตน'}โดยตรง` : `ต้องการศึกษาคัมภีร์ข้ามสายเพื่อเสริมความรู้`;
  } else if (reqItem.itemKind === 'MATERIAL') {
    needScore = requesterNpc.health < 75 ? 26 : 19;
    needReasonTh = `ต้องใช้วัตถุดิบในการบำรุงปราณและฝึกอาชีพ`;
  }
  const weightedNeed = +(needScore * philosophy.needWeight).toFixed(1);

  // 2. Merit & Contribution Score (0..26)
  const rawMerit = Math.min(22, 6 + merit * 1.1);
  const weightedMerit = +(rawMerit * philosophy.meritWeight).toFixed(1);

  // 3. Personal Relationship & Favoritism / Bias Score (-18..+32)
  const aff = Number(rel.affinity || 0);
  const bond = Number(rel.bond || 0);
  let rawBias = (aff * 0.35) + (bond * 0.28);
  if (philosophy.styleId === 'CRONY_FAVORITISM') {
    if (aff >= 12 || bond >= 10 || isSelf) rawBias += 14;
    else if (aff <= 0) rawBias -= 9;
  }
  const weightedBias = clamp(+(rawBias * philosophy.favoritismWeight).toFixed(1), -18, 32);

  // 4. Compassion & Combat Priority Adjustments
  const injuryUrgency = (requesterNpc.health < 75 || (requesterNpc.jianghu?.internalInjury || 0) > 5) ? 10 : 0;
  const compassionAdj = +(injuryUrgency * philosophy.compassionWeight * 0.7).toFixed(1);
  const combatPower = g.power?.(requesterNpc) || 150;
  const combatAdj = +(Math.min(10, combatPower / 90) * philosophy.combatWeight * 0.5).toFixed(1);

  const totalScore = +(weightedNeed + weightedMerit + weightedBias + compassionAdj + combatAdj).toFixed(1);
  const threshold = philosophy.approvalThreshold || 50;
  const approved = totalScore >= threshold;

  let verdictType = 'MERIT_FIT';
  let verdictReasonTh = '';
  if (approved) {
    if (weightedBias >= 10 && weightedBias > weightedMerit) {
      verdictType = 'FAVORITISM';
      verdictReasonTh = `อนุมัติด้วยความเสน่หา/คนสนิท (${distributorNpc?.name || 'ผู้ดูแลคลัง'} มีความสนิทสนมกับ ${requesterNpc.name} จึงลัดคิวมอบให้ทันที)`;
    } else if (compassionAdj >= 7) {
      verdictType = 'COMPASSION';
      verdictReasonTh = `อนุมัติด้วยความเมตตาเพื่อช่วยฟื้นฟูอาการบาดเจ็บของ ${requesterNpc.name}`;
    } else {
      verdictType = 'MERIT_FIT';
      verdictReasonTh = `อนุมัติตามความเหมาะสมและผลงาน (${needReasonTh} · ผลงานสำนัก ${merit.toFixed(1)})`;
    }
  } else {
    if (philosophy.styleId === 'CRONY_FAVORITISM' && aff < 10) {
      verdictType = 'REJECTED_BIAS';
      verdictReasonTh = `ปฏิเสธคำร้องเพราะ ${distributorNpc?.name || 'ผู้ดูแลคลัง'} เอนเอียงเก็บของดีไว้ให้คนสนิทของตน`;
    } else if (philosophy.styleId === 'HOARDER_CONSERVATIVE') {
      verdictType = 'REJECTED_HOARD';
      verdictReasonTh = `ปฏิเสธคำร้องเพราะ ${distributorNpc?.name || 'ผู้ดูแลคลัง'} มีนิสัยตระหนี่ ต้องการเก็บสำรองไว้ในคลังสำนัก`;
    } else {
      verdictType = 'REJECTED_MERIT';
      verdictReasonTh = `ปฏิเสธคำร้องเพราะคะแนนรวม (${totalScore}) ยังไม่ถึงเกณฑ์อนุมัติ (${threshold}) ต้องสะสมผลงานเพิ่ม`;
    }
  }

  return {
    totalScore,
    threshold,
    approved,
    verdictType,
    verdictReasonTh,
    needReasonTh,
    breakdown: {
      need: weightedNeed,
      merit: weightedMerit,
      bias: weightedBias,
      compassion: compassionAdj,
      combat: combatAdj,
      affinity: Math.round(aff),
      bond: Math.round(bond),
      requesterMerit: +merit.toFixed(1)
    }
  };
}

function generateDiscipleRequisitions(g, st) {
  const tr = st.treasury || (st.treasury = {});
  tr.requisitions = Array.isArray(tr.requisitions) ? tr.requisitions : [];
  // Keep existing pending requisitions whose target item still exists in bank
  const allBankItems = getBankTreasuryItems(g);
  const seen = new Set(), memberCounts = {};
  tr.requisitions = tr.requisitions.filter(r => {
    if (r.status !== 'PENDING') return false;
    const hero = g.world?.npcs?.[r.requesterId];
    if (!treasuryMemberAvailable(g, hero)) return false;
    const source = treasuryRequestSource(g, r.itemKind, r.itemId);
    if (!source) return false;
    const spec = treasuryRequestSpec(g, r.itemKind, source), key = hero.id + ':' + spec.itemKind + ':' + spec.itemId;
    if (seen.has(key) || (memberCounts[hero.id] || 0) >= TREASURY_MEMBER_REQUEST_LIMIT) return false;
    seen.add(key);memberCounts[hero.id] = (memberCounts[hero.id] || 0) + 1;
    Object.assign(r, spec);
    return true;
  }).slice(0, TREASURY_PENDING_LIMIT);

  const heroes = (g.heroes || []).filter(h => treasuryMemberAvailable(g, h));
  for (const h of heroes) {
    if (tr.requisitions.length >= TREASURY_PENDING_LIMIT) break;
    if (tr.requisitions.filter(r => r.requesterId === h.id).length >= 2) continue;
    const j = h.jianghu || {};
    const C=root.JianghuSectContributions,bankItems={...allBankItems};
    if(C)for(const [key,kind] of [['equipment','EQUIPMENT'],['pills','PILL'],['scrolls','SCROLL'],['materials','MATERIAL']])bankItems[key]=allBankItems[key].filter(item=>C.autoMethod(g,h,kind,item));

    // 1. Check if Bank has an Equipment upgrade for this disciple
    for (const eq of bankItems.equipment) {
      if (tr.requisitions.some(r => r.requesterId === h.id && r.itemId === eq.id)) continue;
      if (!prepareTreasuryTransfer(g, { itemKind: 'EQUIPMENT', itemId: eq.id }, h).ok) continue;
      const slot = eq.slot || 'WEAPON';
      const curId = j.equipmentV140?.[slot];
      const curEq = (j.ledgerV140?.equipmentItems || []).find(x => x.id === curId);
      if (!curEq || (eq.tier || 2) > (curEq.tier || 1)) {
        tr.requisitions.push({
          id: 'req_' + (g.s.nextId++),
          createdAt: Math.round(g.s.t || 0),
          status: 'PENDING',
          requesterId: h.id,
          requesterName: h.name,
          itemKind: 'EQUIPMENT',
          itemId: eq.id,
          itemNameTh: eq.nameTh || eq.id,
          slot,
          tier: eq.tier || 2,
          requestReasonTh: !curEq
            ? `ยังไม่มี${slot === 'WEAPON' ? 'อาวุธ' : slot === 'ARMOR' ? 'ชุดเกราะ' : 'เครื่องราง'}ประจำกาย ขอเบิก «${eq.nameTh}» จากคลังสำนัก`
            : `ขอเบิก «${eq.nameTh} (T${eq.tier || 2})» เพื่อเปลี่ยนแทน «${curEq.nameTh} (T${curEq.tier || 1})»`
        });
        break;
      }
    }

    if (tr.requisitions.filter(r => r.requesterId === h.id).length >= 2) continue;

    // 2. Check if Disciple wants a Pill from Bank
    if (bankItems.pills.length > 0) {
      const injured = h.health < 85 || (j.internalInjury || 0) > 0 || (j.poisonAccumulated || 0) > 0;
      const wantsCult = (j.cultivationProgress || 0) >= 35 || (h.personality?.ambition || 50) >= 55;
      const targetPill = injured
        ? (bankItems.pills.find(p => p.effect?.healHealth) || bankItems.pills[0])
        : wantsCult
          ? (bankItems.pills.find(p => p.effect?.restoreQi || p.effect?.cultivationProgress) || bankItems.pills[0])
          : null;
      if (targetPill && prepareTreasuryTransfer(g, { itemKind: 'PILL', itemId: targetPill.id }, h).ok && !tr.requisitions.some(r => r.requesterId === h.id && r.itemKind === 'PILL')) {
        tr.requisitions.push({
          id: 'req_' + (g.s.nextId++),
          createdAt: Math.round(g.s.t || 0),
          status: 'PENDING',
          requesterId: h.id,
          requesterName: h.name,
          itemKind: 'PILL',
          itemId: targetPill.id,
          itemNameTh: targetPill.nameTh || targetPill.recipeId,
          tier: 2,
          requestReasonTh: injured
            ? `ร่างกายบาดเจ็บ/อ่อนล้า (HP ${Math.round(h.health)}%) ขอเบิก «${targetPill.nameTh}» 1 เม็ดเพื่อรักษาตัว`
            : `ตบะอยู่ที่ ${Math.round(j.cultivationProgress || 0)}% ขอเบิก «${targetPill.nameTh}» 1 เม็ดเพื่อหนุนการบ่มเพาะ`
        });
      }
    }

    if (tr.requisitions.filter(r => r.requesterId === h.id).length >= 2) continue;

    // 3. Check if Bank/Library has a Manual or Material they want
    const allScrolls = bankItems.scrolls;
    const unlearnedScroll = allScrolls.find(s => {
      const artId = s.artId || s.id;
      const k = j.knowledgeV190?.[artId];
      const art = g.progression?.artMap?.get(artId);
      return (!k || k.stage < 4) && art && g.progression.compatible(h, art) &&
        g.progression.canStudyArtTier(h, art) && (!g.discovery || g.discovery.canStudy(h, art)) &&
        prepareTreasuryTransfer(g, { itemKind: 'SCROLL', itemId: s.id }, h).ok;
    });
    if (unlearnedScroll && !tr.requisitions.some(r => r.requesterId === h.id && r.itemKind === 'SCROLL')) {
      const artId = unlearnedScroll.artId || unlearnedScroll.id;
      const mDef = g.progression.artMap.get(artId) || unlearnedScroll;
      tr.requisitions.push({
        id: 'req_' + (g.s.nextId++),
        createdAt: Math.round(g.s.t || 0),
        status: 'PENDING',
        requesterId: h.id,
        requesterName: h.name,
        itemKind: 'SCROLL',
        itemId: unlearnedScroll.id,
        itemNameTh: mDef.nameTh || unlearnedScroll.nameTh || artId,
        path: mDef.path || 'ANY',
        tier: mDef.tier || 2,
        requestReasonTh: `ขอเบิกคัมภีร์ «${mDef.nameTh || artId}» มาตีความและฝึกฝนวิชาประจำตัว`
      });
    } else if (bankItems.materials.length > 0 && !tr.requisitions.some(r => r.requesterId === h.id && r.itemKind === 'MATERIAL')) {
      const mat = bankItems.materials.find(m => m.count >= 3 && prepareTreasuryTransfer(g, { itemKind: 'MATERIAL', itemId: m.matId }, h).ok);
      if (mat) {
        tr.requisitions.push({
          id: 'req_' + (g.s.nextId++),
          createdAt: Math.round(g.s.t || 0),
          status: 'PENDING',
          requesterId: h.id,
          requesterName: h.name,
          itemKind: 'MATERIAL',
          itemId: mat.matId,
          itemNameTh: mat.nameTh || mat.matId,
          tier: 1,
          requestReasonTh: `ขอเบิกวัตถุดิบ «${mat.nameTh || mat.matId}» ×2 หน่วยเพื่อใช้ฝึกฝนและบำรุงกำลัง`
        });
      }
    }
  }
  const distributor = getActiveTreasuryDistributor(g, st);
  tr.requisitions = tr.requisitions.slice(0, TREASURY_PENDING_LIMIT).sort((a, b) =>
    evaluateRequisitionScore(g, distributor.npc, distributor.philosophy, g.world.npcs[b.requesterId], b).totalScore -
    evaluateRequisitionScore(g, distributor.npc, distributor.philosophy, g.world.npcs[a.requesterId], a).totalScore);
  if(root.JianghuSectContributions)tr.requisitions=tr.requisitions.filter(r=>{if(r.manual)return true;const n=g.world.npcs[r.requesterId],item=treasuryRequestSource(g,r.itemKind,r.itemId);r.mode=item&&root.JianghuSectContributions.autoMethod(g,n,r.itemKind,item);return !!r.mode;});
  return tr.requisitions;
}

function executePhysicalItemTransfer(g, req, recipientNpc) {
  const prepared = prepareTreasuryTransfer(g, req, recipientNpc);
  if (!prepared.ok) return prepared;
  const { item, bankLedger, recLedger } = prepared;
  const E = root.World2026Engine;
  const key = { EQUIPMENT: 'equipmentItems', PILL: 'pillStacks', SCROLL: 'scrolls', MATERIAL: 'materialStacks' }[req.itemKind];
  const sourceBefore = [...bankLedger[key]], destinationBefore = [...(recLedger[key] || [])];
  const itemStates = new Map([...sourceBefore, ...destinationBefore].map(it => [it, JSON.parse(JSON.stringify(it))]));
  const quantity = req.itemKind === 'MATERIAL' ? prepared.qty : 1;
  const transferFlags = root.JianghuSectContributions?.transferFlags(g,req,item)||{};
  const charge = root.JianghuSectContributions?.prepareRedemption(g, req, recipientNpc, item, quantity) || { ok:true, cost:0, quantity };
  if (!charge.ok) return { ok:false, effectTextTh:charge.reason };
  const oldEquipment = { ...(recipientNpc.jianghu.equipmentV140 || {}) };
  const oldKnownMaterials = [...(recipientNpc.jianghu.knownMaterialIds || [])];
  const oldNextId = g.s.nextId;
  try {
    if (req.itemKind === 'MATERIAL') {
      const result = prepared.stock?.lots
        ? root.JianghuSectContributions.transferStock(g,recipientNpc,prepared.stock,transferFlags)
        : g.transferMaterialStack(g.bank, recipientNpc, item.matId, prepared.qty, 'TREASURY_GRANT',transferFlags);
      if (!result?.ok || result.moved !== prepared.qty) throw Error('ไม่สามารถรับวัตถุดิบครบจำนวน จึงคืนรายการโอนเดิมแล้ว');
    } else if (req.itemKind === 'PILL') {
      const existing = prepared.mergeTarget;
      if (existing) { item.count -= 1;existing.count += 1; }
      else {
        const dose = item.count === 1 ? item : { ...JSON.parse(JSON.stringify(item)), id: 'pill_tr_' + (g.s.nextId++), count: 1, originalStackId: item.originalStackId || item.id };
        if (dose !== item) item.count -= 1;
        else bankLedger.pillStacks.splice(bankLedger.pillStacks.indexOf(item), 1);
        Object.assign(dose,transferFlags);dose.ownerNpcId = recipientNpc.id;
        delete dose.sectStore;delete dose.storeCount;
        if ('ownerId' in dose) dose.ownerId = recipientNpc.id;
        (recLedger.pillStacks || (recLedger.pillStacks = [])).push(dose);
      }
      bankLedger.pillStacks = bankLedger.pillStacks.filter(p => p.count > 0);
    } else {
      bankLedger[key].splice(bankLedger[key].indexOf(item), 1);
      (recLedger[key] || (recLedger[key] = [])).push(item);
      Object.assign(item,transferFlags);item.ownerNpcId = recipientNpc.id;
      delete item.sectStore;delete item.storeCount;
      if ('ownerId' in item) item.ownerId = recipientNpc.id;
      if ('custodianNpcId' in item) item.custodianNpcId = recipientNpc.id;
      if (req.itemKind === 'EQUIPMENT') {
        const canEquip = g.progression.canEquipItem(recipientNpc, item);
        if (!canEquip.ok) throw Error(canEquip.reason);
        recipientNpc.jianghu.equipmentV140 = recipientNpc.jianghu.equipmentV140 || {};
        recipientNpc.jianghu.equipmentV140[item.slot] = item.id;
      } else {
        item.rights = 'OWNER';item.access = 'PRIVATE';
        g.discovery?.onTransfer?.(item, g.bank, recipientNpc, 'TREASURY');
      }
    }
    E?.syncLegacyArraysFromLedgerV140?.(g.bank);
    E?.syncLegacyArraysFromLedgerV140?.(recipientNpc);
    E?.invalidateNpcCoreCache?.(recipientNpc);
    root.JianghuSectContributions?.commitRedemption(g, req, recipientNpc, item, charge);
    return { ok: true, quantity, itemId: item.id || item.matId,
      effectTextTh: `โอน «${item.nameTh || req.itemNameTh}» ×${quantity} จากคลังให้ ${recipientNpc.name} จริง` + (charge.grant ? ' · แจกตามดุลยพินิจผู้ดูแลคลัง ไม่ใช้แต้ม' : charge.cost ? ` · ใช้แต้มสำนัก ${charge.cost}` : '') +
        (req.itemKind === 'SCROLL' ? ' · ต้องอ่านและฝึกฝนตามขั้นตอนปกติ' : req.itemKind === 'PILL' ? ' · เก็บไว้ใช้เมื่อเจ้าตัวตัดสินใจกินโอสถ' : '') };
  } catch (error) {
    bankLedger[key] = sourceBefore;recLedger[key] = destinationBefore;
    for (const [it, state] of itemStates) { for (const k of Object.keys(it)) delete it[k];Object.assign(it, state); }
    recipientNpc.jianghu.equipmentV140 = oldEquipment;
    recipientNpc.jianghu.knownMaterialIds = oldKnownMaterials;
    g.s.nextId = oldNextId;
    E?.syncLegacyArraysFromLedgerV140?.(g.bank);E?.syncLegacyArraysFromLedgerV140?.(recipientNpc);
    E?.invalidateNpcCoreCache?.(recipientNpc);
    return { ok: false, effectTextTh: error.message || 'โอนพัสดุไม่สำเร็จ จึงคืนทรัพย์สินครบแล้ว' };
  }
}


// ============================================================================
// STORY & DYNAMIC EVENT SYSTEM CONTROLLER (v2.03)
// ============================================================================
class StoryEventSystem {
  constructor(game) {
    this.g = game;
  }

  get defaultState() {
    return {
      schemaVersion: 2,
      active: false,
      autoEvents: true,
      autoNpcBranchDecision: true,
      currentEp: 1,
      currentNodeId: 'EP1_ROOT',
      epPhase: 'WAITING_CONDITIONS',
      trialEntityIds: [],
      trialStartedAt: 0,
      completedEpisodes: [],
      completedNodeIds: [],
      branchHistory: [],
      doctrines: [],
      aftermaths: [],
      chainedQueue: [],
      pendingRewards: [],
      targetDefeats: {},
      eventCooldowns: {},
      eventReadyAt: 0,
      storyReadyAt: 0,
      activeDynamicEvent: null,
      nextEventAt: 75,
      lastDoctrineDay: 0,
      treasury: {
        authorityMode: 'APPOINTED_ELDER', // 'APPOINTED_ELDER' | 'MASTER_DIRECT'
        elderNpcId: null,
        appointedByMasterId: null,
        appointmentReasonTh: '',
        autoDistribute: true,
        nextTreasuryTickAt: 30,
        requisitions: [],
        ledgerHistory: []
      },
      rngState: ((Number(this.g?.s?.seed) || 8821) ^ 0x5a5a5a5a) >>> 0,
      history: []
    };
  }

  ensureState(createIfMissing = false) {
    const s = this.g?.s;
    if (!s) return this.defaultState;
    if (!s.storyEvents) {
      if (!createIfMissing) return this.defaultState;
      s.storyEvents = this.defaultState;
      s.storyEvents.nextEventAt = (Number(s.t) || 0) + 65;
    }
    const st = s.storyEvents;
    if (!Array.isArray(st.completedEpisodes)) st.completedEpisodes = [];
    if (!Array.isArray(st.completedNodeIds)) st.completedNodeIds = [];
    if (!Array.isArray(st.branchHistory)) st.branchHistory = [];
    if (!Array.isArray(st.doctrines)) st.doctrines = [];
    if (!Array.isArray(st.aftermaths)) st.aftermaths = [];
    if (!Array.isArray(st.chainedQueue)) st.chainedQueue = [];
    if (!Array.isArray(st.pendingRewards)) st.pendingRewards = [];
    if (!st.targetDefeats || typeof st.targetDefeats !== 'object') st.targetDefeats = {};
    if (!st.eventCooldowns || typeof st.eventCooldowns !== 'object') st.eventCooldowns = {};
    if (!Array.isArray(st.trialEntityIds)) st.trialEntityIds = [];
    if (!Array.isArray(st.history)) st.history = [];
    if (!st.treasury || typeof st.treasury !== 'object') {
      st.treasury = this.defaultState.treasury;
    }
    if (!Array.isArray(st.treasury.requisitions)) st.treasury.requisitions = [];
    if (!Array.isArray(st.treasury.ledgerHistory)) st.treasury.ledgerHistory = [];
    if (st.autoNpcBranchDecision === undefined) st.autoNpcBranchDecision = true;
    if (!Number.isFinite(st.currentEp) || st.currentEp < 1) st.currentEp = 1;
    if (!st.currentNodeId || !STORY_TREE_NODES_V203.some(n => n.id === st.currentNodeId)) {
      const matchEp = STORY_TREE_NODES_V203.find(n => n.ep === st.currentEp) || STORY_TREE_NODES_V203[0];
      st.currentNodeId = matchEp.id;
    }
    if (!st.epPhase) st.epPhase = 'WAITING_CONDITIONS';
    return st;
  }

  authorities(){
    const st=this.ensureState(true),g=this.g,master=getMasterNpc(g),id=st.treasury.elderNpcId||g.s.life?.offices?.steward?.npcId,elder=id&&g.world.npcs[id];
    return [...new Set([master,elder].filter(n=>treasuryMemberAvailable(g,n,true)))].map(n=>({npc:n,roleTitleTh:n===master?'เจ้าสำนัก':'ผู้อาวุโสหอคลัง',mode:n===master?'MASTER_DIRECT':'APPOINTED_ELDER',philosophy:analyzeDistributorPhilosophy(g,n)}));
  }

  activate() {
    const st = this.ensureState(true);
    st.active = true;
    return st;
  }

  rng() {
    const st = this.ensureState(true);
    const gen = makeSeededRng(st.rngState);
    return {
      next: () => { const v = gen.next(); st.rngState = gen.state; return v; },
      int: (a, b) => { const v = gen.int(a, b); st.rngState = gen.state; return v; },
      pick: (arr) => { const v = gen.pick(arr); st.rngState = gen.state; return v; }
    };
  }

  recordHistory(kind, titleTh, detailTh, epNum) {
    const st = this.ensureState(true);
    st.history.unshift({
      id: 'seh_' + (this.g.s.nextId++),
      t: Math.round(this.g.s.t || 0),
      day: Math.floor((this.g.s.t || 0) / 20) + 1,
      ep: epNum || st.currentEp,
      kind,
      titleTh,
      detailTh
    });
    if (st.history.length > 80) st.history.length = 80;
  }

  getNodeDef(nodeId) {
    return STORY_TREE_NODES_V203.find(n => n.id === nodeId) || STORY_TREE_NODES_V203[0];
  }

  getEpisodeDef(epNumOrNodeId) {
    if (typeof epNumOrNodeId === 'string') return this.getNodeDef(epNumOrNodeId);
    const st = this.ensureState(false);
    if (st.currentNodeId) {
      const curNode = STORY_TREE_NODES_V203.find(n => n.id === st.currentNodeId);
      if (curNode && curNode.ep === epNumOrNodeId) return curNode;
    }
    return STORY_TREE_NODES_V203.find(n => n.ep === epNumOrNodeId) || STORY_TREE_NODES_V203[STORY_TREE_NODES_V203.length - 1];
  }

  isEntityAlive(id) {
    const g = this.g;
    const npc = g.world?.npcs?.[id];
    if (npc) return alive(npc);
    const beast = (g.s?.beasts || []).find(b => b.id === id);
    if (beast) return alive(beast);
    return false;
  }

  recordTargetDefeat(target, attacker) {
    const tagId = target.storyEventId || target.stageLocal?.storyEventId;
    if (!tagId) return;
    const st = this.ensureState(true);
    st.targetDefeats[target.id] = { tagId, at: this.g.s.t, killerId: attacker?.id || null };
  }

  targetsDefeated(ids, tagId) {
    const st = this.ensureState(false);
    return ids.length > 0 && ids.every(id => st.targetDefeats[id]?.tagId === tagId);
  }

  availableStoryBranches(st = this.ensureState(false)) {
    if (st.epPhase === 'ALL_COMPLETED') return [];
    const lastId = st.completedNodeIds[st.completedNodeIds.length - 1];
    const ids = lastId ? this.getNodeDef(lastId).nextNodeIds : ['EP1_ROOT'];
    return STORY_TREE_NODES_V203.filter(n => ids.includes(n.id) && !st.completedNodeIds.includes(n.id) && !st.completedEpisodes.includes(n.ep));
  }

  eventAvailability(eventId, context = {}) {
    const st = this.ensureState(false), now = Number(this.g.s.t) || 0;
    const def = DYNAMIC_EVENTS_CATALOG_V202.find(e => e.id === eventId);
    const no = reason => ({ ok: false, reason });
    if (!def) return no('ไม่พบอีเวนต์ที่ระบุ');
    if (st.activeDynamicEvent) return no('มีอีเวนต์กำลังดำเนินอยู่');
    if (st.epPhase === 'ACTIVE_TRIAL') return no('รอให้บททดสอบเนื้อเรื่องปัจจุบันสิ้นสุดก่อน');
    if (!this.g.built('hall') || !this.g.heroes.some(alive)) return no('ต้องมีหอเจ้าสำนักและสมาชิกที่มีชีวิต');
    const queued = def.scope === 'CHAIN_FOLLOWUP' ? (st.chainedQueue || []).find(c => c.eventId === eventId && (!context.chainId || c.id === context.chainId)) : null;
    const ep = queued?.epNum || st.currentEp || 1;
    if (ep < (def.minEp || 1) || ep > (def.maxEp || 8)) return no(`เกิดในช่วงบท ${def.minEp || 1}–${def.maxEp || 8}`);
    if (def.scope === 'BRANCH_EXCLUSIVE' && !(def.reqBranches || []).some(b => this.getUnlockedBranches(st).includes(b))) return no('ยังไม่ได้เดินกิ่งเนื้อเรื่องที่เปิดอีเวนต์นี้');
    if (def.scope === 'CHAIN_FOLLOWUP') {
      const chain = (st.chainedQueue || []).find(c => c.eventId === eventId && (!context.chainId || c.id === context.chainId));
      if (!chain) return no('ต้องเกิดผลพวงจากอีเวนต์ต้นเหตุก่อน');
      if (now < chain.triggerAt) return no(`ผลพวงจะมาถึงในอีก ${Math.ceil(chain.triggerAt - now)} วินาที`);
    }
    const readyAt = Math.max(st.eventReadyAt || 0, st.eventCooldowns[eventId] || 0);
    if (now < readyAt) return no(`รอเหตุการณ์รอบถัดไปอีก ${Math.ceil(readyAt - now)} วินาที`);
    if (typeof def.requirements === 'function') {
      const r = def.requirements(this.g, ep);
      if (r === false || r?.ok === false) return no(r?.reason || 'ยังไม่ครบเงื่อนไขของเหตุการณ์');
    }
    return { ok: true, reason: 'พร้อมเกิดเหตุการณ์' };
  }

  getUnlockedBranches(st) {
    const keys = new Set(['ROOT']);
    for (const nid of (st.completedNodeIds || [])) {
      const nd = STORY_TREE_NODES_V203.find(x => x.id === nid);
      if (nd?.branchKey) keys.add(nd.branchKey);
    }
    const cur = STORY_TREE_NODES_V203.find(x => x.id === st.currentNodeId);
    if (cur?.branchKey) keys.add(cur.branchKey);
    for (const d of (st.doctrines || [])) {
      if (d?.branchKey) keys.add(d.branchKey);
    }
    return [...keys];
  }

  getEligibleEvents(st, epNum) {
    return DYNAMIC_EVENTS_CATALOG_V202.filter(e => e.scope !== 'CHAIN_FOLLOWUP' && this.eventAvailability(e.id).ok);
  }

  inspect() {
    const st = this.ensureState(false);
    const curNode = this.getNodeDef(st.currentNodeId || 'EP1_ROOT');
    const epNum = clamp(curNode?.ep || st.currentEp || 1, 1, 8);
    const conditions = curNode.evaluateConditions(this.g);
    const allConditionsMet = conditions.every(c => c.passed);
    const pathTable = getPathStageTableForEp(epNum);
    const discipleEvaluations = this.g.heroes.filter(alive).map(n => evaluateDiscipleForEp(this.g, n, epNum));
    const remainingTrialIds = (st.trialEntityIds || []).filter(id => this.isEntityAlive(id));

    let dyn = st.activeDynamicEvent;
    let dynRemainingIds = [];
    if (dyn && Array.isArray(dyn.entityIds)) {
      dynRemainingIds = dyn.entityIds.filter(id => this.isEntityAlive(id));
    }

    const now = Number(this.g?.s?.t) || 0;
    const activeAftermaths = (st.aftermaths || []).filter(a => Number(a.expiresAt) > now);
    const eligibleEvents = this.getEligibleEvents(st, epNum);

    const parentIdForCouncil = (curNode.parentIds && curNode.parentIds.length && st.epPhase === 'WAITING_CONDITIONS')
      ? (st.completedNodeIds[st.completedNodeIds.length - 1] || curNode.parentIds[0])
      : curNode.id;
    const nextCouncilPreview = runNpcBranchCouncil(this.g, curNode.id);
    const currentTierSiblings = STORY_TREE_NODES_V203.filter(n => n.ep === epNum && (!curNode.parentIds.length || n.parentIds.some(p => curNode.parentIds.includes(p))));
    const currentTierCouncil = curNode.parentIds.length ? runNpcBranchCouncil(this.g, parentIdForCouncil) : null;

    const masterTreasuryEval = evaluateMasterTreasuryDecision(this.g);
    const activeDistributor = getActiveTreasuryDistributor(this.g, st);
    const bankTreasury = getBankTreasuryItems(this.g);
    // Compute live preview of pending requisitions with Distributor's current scores
    const liveRequisitions = (st.treasury?.requisitions || []).map(req => {
      const reqNpc = this.g.world?.npcs?.[req.requesterId];
      const evalRes = evaluateRequisitionScore(this.g, activeDistributor.npc, activeDistributor.philosophy, reqNpc, req);
      return { ...req, evaluation: evalRes };
    });

    return {
      state: st,
      treasuryView: {
        authorityMode: activeDistributor.mode,
        distributorNpcId: activeDistributor.npc?.id || null,
        distributorName: activeDistributor.npc?.name || 'ยังไม่มีผู้รับหน้าที่',
        distributorRoleTitleTh: activeDistributor.roleTitleTh,
        philosophy: activeDistributor.philosophy,
        masterEval: masterTreasuryEval,
        autoDistribute: st.treasury?.autoDistribute !== false,
        appointmentReasonTh: st.treasury?.appointmentReasonTh || masterTreasuryEval?.decisionReasonTh || '',
        bankTreasury,
        storeInventory: root.JianghuSectContributions?.storeInventory?.(this.g) || null,
        treasuryCompartment: root.JianghuSectContributions?.treasuryInventory?.(this.g) || null,
        flywheel: root.JianghuSectContributions?.computeMarketFlywheel?.(this.g) || null,
        requisitions: liveRequisitions,
        ledgerHistory: st.treasury?.ledgerHistory || []
      },
      currentEp: epNum,
      currentNodeId: curNode.id,
      epDef: curNode,
      epPhase: st.epPhase,
      conditions,
      allConditionsMet,
      pathTable,
      discipleEvaluations,
      remainingTrialIds,
      canCompleteTrial: st.epPhase === 'ACTIVE_TRIAL' && this.targetsDefeated(st.trialEntityIds || [], st.trialTagId),
      canResolveDynamicEvent: !!dyn && (dyn.timerOnly ? now >= dyn.expiresAt : this.targetsDefeated(dyn.entityIds || [], dyn.tagId)),
      activeDynamicEvent: dyn,
      dynRemainingIds,
      activeAftermaths,
      doctrines: st.doctrines || [],
      chainedQueue: st.chainedQueue || [],
      branchHistory: st.branchHistory || [],
      completedNodeIds: st.completedNodeIds || [],
      currentTierSiblings,
      currentTierCouncil,
      nextCouncilPreview,
      beastPool: EP_BEAST_TIDE_POOLS[epNum],
      raiderPool: EP_RAIDER_POOLS[epNum],
      allBeastPools: EP_BEAST_TIDE_POOLS,
      allRaiderPools: EP_RAIDER_POOLS,
      eligibleEvents,
      allEpisodes: STORY_EPISODES_V202,
      allStoryNodes: STORY_TREE_NODES_V203,
      allDynamicEvents: DYNAMIC_EVENTS_CATALOG_V202
      ,availableBranchIds: this.availableStoryBranches(st).map(n => n.id)
      ,eventAvailability: Object.fromEntries(DYNAMIC_EVENTS_CATALOG_V202.map(e => [e.id, this.eventAvailability(e.id)]))
      ,sidequests: root.JianghuSideQuests?.inspect(this.g) || null
      ,pendingRewards: st.pendingRewards || []
    };
  }

  selectStoryBranch(nodeId, byCouncil = false) {
    const st = this.activate();
    const target = STORY_TREE_NODES_V203.find(n => n.id === nodeId);
    if (!target) return { ok: false, reason: 'ไม่พบกิ่งเนื้อเรื่องที่ระบุ' };
    if (!this.availableStoryBranches(st).some(n => n.id === target.id)) return { ok: false, reason: 'กิ่งนี้ยังไม่เปิดจากเส้นทางที่สำนักผ่าน หรือรับรางวัลไปแล้ว' };
    if (st.epPhase === 'ACTIVE_TRIAL') {
      return { ok: false, reason: 'ไม่สามารถสลับกิ่งเนื้อเรื่องระหว่างที่บททดสอบกำลังดำเนินอยู่ได้' };
    }
    st.currentNodeId = target.id;
    st.currentEp = target.ep;
    const msg = byCouncil
      ? `🗳️ สภาศิษย์ลงมติเลือกกิ่งเนื้อเรื่อง «${target.titleTh}» (${target.branchBadgeTh})`
      : `🧭 สำนักปรับทิศทางสู่กิ่งเนื้อเรื่อง «${target.titleTh}» (${target.branchBadgeTh})`;
    this.g.note(msg);
    this.recordHistory('BRANCH_SELECT', target.titleTh, msg, target.ep);
    return { ok: true, node: target, reason: msg };
  }

  conveneNpcCouncilNow() {
    const st = this.activate();
    const curNode = this.getNodeDef(st.currentNodeId);
    const parentId = (st.completedNodeIds.length > 0)
      ? st.completedNodeIds[st.completedNodeIds.length - 1]
      : (curNode.parentIds?.[0] || curNode.id);
    const council = runNpcBranchCouncil(this.g, parentId);
    if (!council) return { ok: false, reason: 'กิ่งปัจจุบันไม่มีทางแยกให้ลงมติ' };
    if (st.epPhase === 'WAITING_CONDITIONS' && this.availableStoryBranches(st).some(n => n.id === council.winnerNodeId)) {
      st.currentNodeId = council.winnerNodeId;
      const winNode = this.getNodeDef(council.winnerNodeId);
      st.currentEp = winNode.ep;
      const summary = council.votes.map(v => `${v.npcName} โหวต ${v.chosenBadgeTh}`).join(' · ');
      const msg = `🗳️ มติสภาศิษย์เลือก «${winNode.titleTh}» (${summary})`;
      this.g.note(msg);
      this.recordHistory('NPC_COUNCIL', `🗳️ มติสภาศิษย์: ${winNode.branchBadgeTh}`, summary, winNode.ep);
      return { ok: true, council, reason: msg };
    }
    return { ok: true, council, reason: `ผลการหยั่งเสียงสภาศิษย์: ${council.winnerBadgeTh}` };
  }

  triggerCurrentEpisodeTrial(force = false) {
    const st = this.activate();
    if (st.epPhase === 'ALL_COMPLETED') return { ok: false, reason: 'ผ่านเนื้อเรื่องครบทั้ง 8 บทแล้ว' };
    if (st.epPhase === 'ACTIVE_TRIAL') return { ok: false, reason: 'บททดสอบเนื้อเรื่องปัจจุบันกำลังดำเนินอยู่' };
    if (st.activeDynamicEvent) return { ok: false, reason: 'รอให้อีเวนต์ปัจจุบันสิ้นสุดก่อนเริ่มบททดสอบ' };
    if ((this.g.s.t || 0) < (st.storyReadyAt || 0)) return { ok: false, reason: 'สมาชิกกำลังพักและเตรียมรับบททดสอบถัดไป' };
    const epDef = this.getNodeDef(st.currentNodeId);
    if (!this.availableStoryBranches(st).some(n => n.id === epDef.id)) return { ok: false, reason: 'กิ่งเนื้อเรื่องนี้ยังไม่เปิดหรือสำเร็จไปแล้ว' };
    const conds = epDef.evaluateConditions(this.g);
    if (!conds.every(c => c.passed)) {
      return { ok: false, reason: 'ยังบรรลุเงื่อนไขปลดล็อกเนื้อเรื่องไม่ครบถ้วน' };
    }
    const tagId = 'story_ep_' + epDef.id + '_' + (this.g.s.nextId++);
    const spawnedIds = epDef.spawnTrial(this.g, tagId) || [];
    st.epPhase = 'ACTIVE_TRIAL';
    st.trialEntityIds = spawnedIds;
    st.trialStartedAt = this.g.s.t || 0;
    st.trialTagId = tagId;
    const msg = `📜 ทริกเกอร์เควสเนื้อเรื่อง ${epDef.titleTh} · เริ่ม «${epDef.trialTitleTh}»!`;
    this.g.note(msg);
    this.recordHistory('STORY_TRIGGER', epDef.titleTh, epDef.trialDescTh, epDef.ep);
    return { ok: true, reason: msg, spawnedIds };
  }

  completeCurrentEpisode(force = false) {
    const st = this.activate();
    if (st.epPhase !== 'ACTIVE_TRIAL') return { ok: false, reason: 'ยังไม่ได้อยู่ในช่วงบททดสอบเนื้อเรื่อง' };
    const epDef = this.getNodeDef(st.currentNodeId);
    const aliveTargets = (st.trialEntityIds || []).filter(id => this.isEntityAlive(id));
    if (!this.targetsDefeated(st.trialEntityIds || [], st.trialTagId)) {
      return { ok: false, reason: `ยังมีเป้าหมายบททดสอบบนแผนที่อีก ${aliveTargets.length} เป้าหมาย` };
    }

    epDef.grantRewards(this.g);
    if (!st.completedEpisodes.includes(epDef.ep)) st.completedEpisodes.push(epDef.ep);
    if (!st.completedNodeIds.includes(epDef.id)) st.completedNodeIds.push(epDef.id);

    const doneMsg = `🏆 สำเร็จเควสเนื้อเรื่อง ${epDef.titleTh} · รับรางวัลจริง: ${epDef.rewardSummaryTh}`;
    this.g.note(doneMsg);
    this.recordHistory('STORY_COMPLETE', `🏆 สำเร็จ ${epDef.titleTh}`, epDef.rewardSummaryTh, epDef.ep);
    st.trialEntityIds = [];
    st.storyReadyAt = this.g.s.t + 60;
    st.eventReadyAt = this.g.s.t + 25;

    if (epDef.nextNodeIds && epDef.nextNodeIds.length > 0) {
      const council = runNpcBranchCouncil(this.g, epDef.id);
      const nextNodeId = council?.winnerNodeId || epDef.nextNodeIds[0];
      const nextNode = this.getNodeDef(nextNodeId);
      st.currentNodeId = nextNode.id;
      st.currentEp = nextNode.ep;
      st.epPhase = 'WAITING_CONDITIONS';
      if (council) {
        const voteDetails = council.votes.map(v => `${v.npcName}(${v.pathIcon}) เลือก ${v.chosenBadgeTh} [${v.reasonTh}]`).join(' | ');
        st.branchHistory.unshift({
          fromNodeId: epDef.id,
          fromTitleTh: epDef.titleTh,
          chosenNodeId: nextNode.id,
          chosenTitleTh: nextNode.titleTh,
          chosenBadgeTh: nextNode.branchBadgeTh,
          day: Math.floor((this.g.s.t || 0) / 20) + 1,
          tallies: council.tallies,
          votes: council.votes
        });
        const branchMsg = `🌳 แตกกิ่งเนื้อเรื่องสู่ EP.${nextNode.ep}: สภาศิษย์ลงมติเลือก «${nextNode.titleTh}» (${nextNode.branchBadgeTh})`;
        this.g.note(branchMsg);
        this.recordHistory('BRANCH_COUNCIL', branchMsg, voteDetails, nextNode.ep);
      }
    } else {
      st.epPhase = 'ALL_COMPLETED';
    }
    return { ok: true, reason: doneMsg, nextEp: st.currentEp, nextNodeId: st.currentNodeId, epPhase: st.epPhase };
  }

  triggerDynamicEvent(eventId = null, context = {}) {
    const st = this.activate();
    if (st.activeDynamicEvent) {
      return { ok: false, reason: 'มีอีเวนต์ต่อเนื่องกำลังดำเนินอยู่ กรุณาจัดการอีเวนต์ปัจจุบันให้เสร็จสิ้นก่อน' };
    }
    let epNum = clamp(st.currentEp || 1, 1, 8);
    const eligible = this.getEligibleEvents(st, epNum);
    const chosen = eventId
      ? DYNAMIC_EVENTS_CATALOG_V202.find(e => e.id === eventId)
      : this.rng().pick(eligible);
    if (!chosen) return { ok: false, reason: 'ไม่พบอีเวนต์ที่ระบุ' };
    const availability = this.eventAvailability(chosen.id, context);
    if (!availability.ok) return availability;
    const chain = chosen.scope === 'CHAIN_FOLLOWUP' ? st.chainedQueue.find(c => c.eventId === chosen.id && (!context.chainId || c.id === context.chainId)) : null;
    if (chain?.epNum) epNum = chain.epNum;

    const tagId = 'dyn_' + chosen.id + '_' + (this.g.s.nextId++);
    if (chosen.kind === 'INSTANT') {
      const res = chosen.executeInstant(this.g, epNum);
      if (res?.ok === false) return res;
      if (chain) st.chainedQueue = st.chainedQueue.filter(c => c.id !== chain.id);
      st.eventCooldowns[chosen.id] = this.g.s.t + (chosen.cooldownSeconds || 240);
      st.eventReadyAt = this.g.s.t + 25;
      const msg = `${chosen.icon} อีเวนต์ยุทธภพ (EP.${epNum}): ${chosen.nameTh} · ${res.outcomeTh}`;
      this.g.note(msg);
      this.recordHistory('EVENT_INSTANT', `${chosen.icon} ${chosen.nameTh} (EP.${epNum})`, `${res.situationTh} → ${res.outcomeTh}`, epNum);
      st.nextEventAt = (this.g.s.t || 0) + 70;
      return { ok: true, kind: 'INSTANT', event: chosen, result: res, reason: msg };
    }

    const started = chosen.start(this.g, epNum, tagId);
    st.activeDynamicEvent = {
      id: chosen.id,
      tagId,
      nameTh: chosen.nameTh,
      icon: chosen.icon,
      scope: chosen.scope,
      epNum,
      startedAt: this.g.s.t || 0,
      expiresAt: (this.g.s.t || 0) + (chosen.duration || 50),
      situationTh: started.situationTh,
      objectiveTh: started.objectiveTh,
      entityIds: started.entityIds || [],
      timerOnly: !!started.timerOnly,
      rewardStones: started.rewardStones ?? 120,
      rewardMatId: started.rewardMatId || null,
      rewardMatQty: started.rewardMatQty || 0
    };
    st.eventCooldowns[chosen.id] = this.g.s.t + (chosen.cooldownSeconds || 240);
    if (chain) st.chainedQueue = st.chainedQueue.filter(c => c.id !== chain.id);
    st.nextEventAt = (this.g.s.t || 0) + (chosen.duration || 50) + 60;
    const msg = `${chosen.icon} เกิดอีเวนต์ต่อเนื่อง (พูล EP.${epNum}): ${chosen.nameTh} · ${started.situationTh}`;
    this.g.note(msg);
    this.recordHistory('EVENT_START', `${chosen.icon} ${chosen.nameTh} (พูล EP.${epNum})`, started.situationTh, epNum);
    return { ok: true, kind: 'CONTINUOUS', event: chosen, activeEvent: st.activeDynamicEvent, reason: msg };
  }

  triggerQueuedChainNow(chainId = null) {
    const st = this.activate();
    const q = st.chainedQueue || [];
    if (!q.length) return { ok: false, reason: 'ยังไม่มีอีเวนต์ผลพวงต่อเนื่องในคิว' };
    const item = chainId ? q.find(x => x.id === chainId || x.eventId === chainId) : q[0];
    if (!item) return { ok: false, reason: 'ไม่พบอีเวนต์ต่อเนื่องในคิว' };
    const result = this.triggerDynamicEvent(item.eventId, { chainId: item.id });
    if (result.ok) st.chainedQueue = q.filter(x => x !== item);
    return result;
  }

  toggleAutoEvents() {
    const st = this.activate();
    st.autoEvents = !st.autoEvents;
    return { ok: true, autoEvents: st.autoEvents, reason: st.autoEvents ? 'เปิดระบบอีเวนต์ยุทธภพอัตโนมัติแล้ว' : 'ปิดระบบอีเวนต์ยุทธภพอัตโนมัติชั่วคราว' };
  }

  rollRandomDynamicEvent() {
    return this.triggerDynamicEvent(null);
  }

  resolveActiveEvent(force = false) {
    const st = this.activate();
    const dyn = st.activeDynamicEvent;
    if (!dyn) return { ok: false, reason: 'ไม่มีอีเวนต์ต่อเนื่องที่กำลังทำงานอยู่' };
    if (dyn.timerOnly ? this.g.s.t < dyn.expiresAt : !this.targetsDefeated(dyn.entityIds || [], dyn.tagId)) return { ok: false, reason: dyn.timerOnly ? 'ยังไม่ครบระยะเวลาของอีเวนต์' : 'ต้องปราบเป้าหมายอีเวนต์ให้สำเร็จจริงก่อนรับรางวัล' };
    const def = DYNAMIC_EVENTS_CATALOG_V202.find(e => e.id === dyn.id);
    const outText = def?.onComplete ? def.onComplete(this.g, dyn) : 'คลี่คลายอีเวนต์สำเร็จ';
    const msg = `✓ สำเร็จอีเวนต์ «${dyn.nameTh}» · ${outText}`;
    this.g.note(msg);
    this.recordHistory('EVENT_COMPLETE', `✓ สำเร็จ «${dyn.nameTh}»`, outText, dyn.epNum);
    st.activeDynamicEvent = null;
    st.eventReadyAt = this.g.s.t + 35;
    return { ok: true, reason: msg };
  }

  letMasterDecideTreasuryAuthority() {
    const st = this.activate();
    const tr = st.treasury;
    const evalRes = evaluateMasterTreasuryDecision(this.g);
    if (!evalRes) return { ok: false, reason: 'ยังไม่มีเจ้าสำนักที่มีชีวิต' };
    tr.authorityMode = evalRes.recommendedMode;
    tr.appointedByMasterId = evalRes.masterId;
    tr.appointmentReasonTh = evalRes.decisionReasonTh;
    if (evalRes.recommendedMode === 'APPOINTED_ELDER' && evalRes.recommendedElderId) {
      tr.elderNpcId = evalRes.recommendedElderId;
      if (this.g.s?.life?.offices) {
        this.g.s.life.offices.steward = {
          npcId: evalRes.recommendedElderId,
          since: this.g.s.t || 0,
          capacity: evalRes.candidateScores?.[0]?.stewardCapacity || 60
        };
        this.g.life?.syncLegacyPositions?.();
      }
    } else {
      tr.elderNpcId = null;
    }
    const msg = `🏛️ ${evalRes.decisionReasonTh}`;
    this.g.note(msg);
    this.recordHistory('TREASURY_APPOINT', '🏛️ การตัดสินใจแต่งตั้งผู้ดูแลคลังของเจ้าสำนัก', evalRes.decisionReasonTh, st.currentEp);
    return { ok: true, evalRes, reason: msg };
  }

  setTreasuryAuthority(mode, elderNpcId = null) {
    const st = this.activate();
    const tr = st.treasury;
    const master = getMasterNpc(this.g);
    if (!['MASTER_DIRECT', 'APPOINTED_ELDER'].includes(mode)) return { ok: false, reason: 'รูปแบบอำนาจคลังไม่ถูกต้อง' };
    if (!master) return { ok: false, reason: 'ยังไม่มีศิษย์ที่พร้อมรักษาการเจ้าสำนัก' };
    if (mode === 'MASTER_DIRECT') {
      tr.authorityMode = 'MASTER_DIRECT';
      tr.elderNpcId = null;
      tr.appointmentReasonTh = `${master?.name || 'เจ้าสำนัก'} กุมอำนาจตัดสินใจแจกจ่ายพัสดุคลังสำนักด้วยตนเอง`;
      const msg = `👑 ${tr.appointmentReasonTh}`;
      this.g.note(msg);
      return { ok: true, reason: msg };
    }
    const chosen = elderNpcId ? this.g.world?.npcs?.[elderNpcId] :
      (this.g.heroes || []).find(h => h.id !== master.id && treasuryMemberAvailable(this.g, h, true)) || master;
    if (!treasuryMemberAvailable(this.g, chosen, true)) return { ok: false, reason: 'ผู้ดูแลคลังต้องเป็นศิษย์ที่มีชีวิต อยู่ในสำนัก และไม่ถูกพักหน้าที่' };
    tr.authorityMode = 'APPOINTED_ELDER';
    tr.elderNpcId = chosen.id;
    tr.appointedByMasterId = master?.id || null;
    const phil = analyzeDistributorPhilosophy(this.g, chosen);
    tr.appointmentReasonTh = `${master?.name || 'เจ้าสำนัก'} แต่งตั้ง «${chosen.name}» เป็นผู้อาวุโสหอคลัง (${phil.styleBadgeTh})`;
    if (this.g.s?.life?.offices) {
      this.g.s.life.offices.steward = {
        npcId: chosen.id,
        since: this.g.s.t || 0,
        capacity: root.HumanCore?.capacity?.(chosen, 'sectSteward')?.total || 60
      };
      this.g.life?.syncLegacyPositions?.();
    }
    const msg = `🏛️ ${tr.appointmentReasonTh}`;
    this.g.note(msg);
    this.recordHistory('TREASURY_APPOINT', `🏛️ แต่งตั้งผู้ดูแลคลัง: ${chosen.name}`, tr.appointmentReasonTh, st.currentEp);
    return { ok: true, reason: msg };
  }

  refreshDiscipleRequisitions() {
    const st = this.activate();
    const reqs = generateDiscipleRequisitions(this.g, st);
    return { ok: true, count: reqs.length, reason: `ศิษย์ในสำนักยื่นคำร้องขอเบิกพัสดุรวม ${reqs.length} รายการ` };
  }

  createManualRequisition(npcId, itemKind, itemId, mode='GRANT', authorityNpcId=null) {
    if(!['GRANT','REDEEM'].includes(mode))return {ok:false,reason:'ต้องเลือกรับแจกหรือใช้แต้มแลก'};
    if(authorityNpcId&&!this.authorities().some(a=>a.npc.id===authorityNpcId))return {ok:false,reason:'ผู้มีอำนาจต้องเป็นเจ้าสำนักหรือผู้อาวุโสหอคลัง'};
    const st = this.activate();
    const tr = st.treasury;
    const hero = npcId ? this.g.world?.npcs?.[npcId] : getMasterNpc(this.g);
    if (!treasuryMemberAvailable(this.g, hero)) return { ok: false, reason: 'ผู้ยื่นคำร้องต้องเป็นศิษย์ที่อยู่ในสำนักและไม่ถูกพักหน้าที่' };
    const source = treasuryRequestSource(this.g, itemKind, itemId);
    if (!source) return { ok: false, reason: 'ไม่มีพัสดุส่วนรวมที่ขอ หรือรายการนี้ติดสิทธิ์เจ้าของ/การยืม' };
    if(mode==='GRANT'&&root.JianghuSectContributions){const allowed=root.JianghuSectContributions.grantEligibility(this.g,itemKind,source,itemKind==='MATERIAL'?Math.min(2,source.count):1);if(!allowed.ok)return allowed;}
    const spec = treasuryRequestSpec(this.g, itemKind, source), itemNameTh = spec.itemNameTh;
    const duplicate = tr.requisitions.find(r => r.status === 'PENDING' && r.requesterId === hero.id && r.itemKind === itemKind && r.itemId === spec.itemId && (r.mode||'GRANT')===mode && (r.authorityNpcId||null)===authorityNpcId);
    if (duplicate) return { ok: true, req: duplicate, reason: 'มีคำร้องรายการนี้รอพิจารณาอยู่แล้ว' };
    if (tr.requisitions.filter(r => r.status === 'PENDING').length >= TREASURY_PENDING_LIMIT ||
        tr.requisitions.filter(r => r.status === 'PENDING' && r.requesterId === hero.id).length >= TREASURY_MEMBER_REQUEST_LIMIT) {
      return { ok: false, reason: 'คำร้องรอพิจารณาเต็มแล้ว โปรดรอให้พิจารณารายการเดิมก่อน' };
    }
    const req = {
      id: 'req_' + (this.g.s.nextId++),
      createdAt: Math.round(this.g.s.t || 0),
      status: 'PENDING',
      requesterId: hero.id,
      requesterName: hero.name,
      ...spec,mode,authorityNpcId,manual:true,
      requestReasonTh: `${hero.name} ยื่นคำร้องขอเบิก «${itemNameTh}» ต่อผู้ดูแลคลังสำนัก`
    };
    tr.requisitions.unshift(req);
    return { ok: true, req, reason: `${hero.name} ยื่นคำร้องขอเบิก «${itemNameTh}» แล้ว` };
  }

  judgeRequisition(reqId, forceApprove = null, authorityNpcId = null) {
    const st = this.activate();
    const tr = st.treasury;
    const idx = tr.requisitions.findIndex(r => r.id === reqId);
    if (idx === -1) return { ok: false, reason: 'ไม่พบคำร้องที่ระบุ' };
    const req = tr.requisitions[idx];
    const reqNpc = this.g.world?.npcs?.[req.requesterId];
    if (!treasuryMemberAvailable(this.g, reqNpc)) {
      if (!alive(reqNpc) || !this.g.s.heroIds.includes(req.requesterId)) tr.requisitions.splice(idx, 1);
      return { ok: false, reason: 'ผู้ยื่นคำร้องไม่พร้อมรับของในสำนัก' };
    }
    const requestedAuthority=authorityNpcId||req.authorityNpcId;
    const dist = requestedAuthority?this.authorities().find(a=>a.npc.id===requestedAuthority):getActiveTreasuryDistributor(this.g, st);
    if(!dist)return {ok:false,reason:'ผู้มีอำนาจต้องเป็นเจ้าสำนักหรือผู้อาวุโสหอคลังที่พร้อมปฏิบัติหน้าที่'};
    if (!dist.npc) return { ok: false, reason: 'ยังไม่มีผู้ดูแลคลังที่พร้อมปฏิบัติหน้าที่' };
    const source = treasuryRequestSource(this.g, req.itemKind, req.itemId);
    if (!source) return { ok: false, reason: 'พัสดุไม่อยู่ในคลังส่วนรวมแล้ว หรือมีสิทธิ์เจ้าของคุ้มครอง' };
    Object.assign(req, treasuryRequestSpec(this.g, req.itemKind, source));
    const evalRes = evaluateRequisitionScore(this.g, dist.npc, dist.philosophy, reqNpc, req);
    const approve = forceApprove !== null ? !!forceApprove : evalRes.approved;

    if (approve) {
      const transfer = executePhysicalItemTransfer(this.g, req, reqNpc);
      if (!transfer.ok) return { ok: false, reason: transfer.effectTextTh };
      tr.requisitions.splice(idx, 1);
      if (dist.npc && dist.npc.id !== reqNpc.id) {
        this.g.life?.relate?.(reqNpc, dist.npc, 8, 3);
      }
      if (reqNpc.core?.condition) {
        reqNpc.core.condition.moodStress = Math.max(0, (reqNpc.core.condition.moodStress || 0) - 8);
      }
      // If approved by blatant favoritism, upright disciples feel slighted
      let reactionNote = '';
      if (evalRes.verdictType === 'FAVORITISM' && dist.npc) {
        for (const other of this.g.heroes.filter(h => alive(h) && h.id !== reqNpc.id && h.id !== dist.npc.id)) {
          if ((other.personality?.integrity || 50) >= 60) {
            this.g.life?.relate?.(other, dist.npc, -4, 0);
            if (other.core?.condition) other.core.condition.moodStress = Math.min(100, (other.core.condition.moodStress || 0) + 4);
            reactionNote = ` · ศิษย์ผู้เที่ยงธรรม (${other.name}) ไม่พอใจความเอนเอียงเล็กน้อย`;
          }
        }
      }
      const logEntry = {
        id: 'tlog_' + (this.g.s.nextId++),
        t: Math.round(this.g.s.t || 0),
        day: Math.floor((this.g.s.t || 0) / 20) + 1,
        decision: 'APPROVED',mode:req.mode||'GRANT',
        verdictType: forceApprove ? 'MASTER_OVERRIDE' : evalRes.verdictType,
        distributorName: dist.npc?.name || 'คลังสำนัก',
        distributorStyleTh: dist.philosophy.styleBadgeTh,
        requesterName: reqNpc.name,
        itemNameTh: req.itemNameTh,
        itemKind: req.itemKind,
        score: evalRes.totalScore,
        threshold: evalRes.threshold,
        reasonTh: (forceApprove ? 'อนุมัติคำร้องโดยตรง · ' : evalRes.verdictReasonTh + ' · ') + transfer.effectTextTh + reactionNote
      };
      tr.ledgerHistory.unshift(logEntry);
      if (tr.ledgerHistory.length > 60) tr.ledgerHistory.length = 60;
      const msg = `✓ [${dist.npc?.name || 'หอคลัง'}] อนุมัติมอบ «${req.itemNameTh}» ให้ ${reqNpc.name} (${evalRes.verdictType === 'FAVORITISM' ? 'เอนเอียงให้คนสนิท' : 'ตามความเหมาะสม/ผลงาน'})`;
      this.g.note(msg);
      this.recordHistory('TREASURY_GRANT', msg, logEntry.reasonTh, st.currentEp);
      return { ok: true, approved: true, logEntry, reason: msg };
    } else {
      tr.requisitions.splice(idx, 1);
      if (dist.npc && dist.npc.id !== reqNpc.id) {
        this.g.life?.relate?.(reqNpc, dist.npc, -5, 0);
      }
      if (reqNpc.core?.condition) {
        reqNpc.core.condition.moodStress = Math.min(100, (reqNpc.core.condition.moodStress || 0) + 6);
      }
      const logEntry = {
        id: 'tlog_' + (this.g.s.nextId++),
        t: Math.round(this.g.s.t || 0),
        day: Math.floor((this.g.s.t || 0) / 20) + 1,
        decision: 'REJECTED',mode:req.mode||'GRANT',
        verdictType: forceApprove === false ? 'MASTER_OVERRIDE' : evalRes.verdictType,
        distributorName: dist.npc?.name || 'คลังสำนัก',
        distributorStyleTh: dist.philosophy.styleBadgeTh,
        requesterName: reqNpc.name,
        itemNameTh: req.itemNameTh,
        itemKind: req.itemKind,
        score: evalRes.totalScore,
        threshold: evalRes.threshold,
        reasonTh: forceApprove === false ? 'ปฏิเสธคำร้องโดยตรงจากผู้ดูแลสำนัก' : evalRes.verdictReasonTh
      };
      tr.ledgerHistory.unshift(logEntry);
      if (tr.ledgerHistory.length > 60) tr.ledgerHistory.length = 60;
      const msg = `✗ [${dist.npc?.name || 'หอคลัง'}] ปฏิเสธคำร้องขอ «${req.itemNameTh}» ของ ${reqNpc.name} · ${evalRes.verdictReasonTh}`;
      this.g.note(msg);
      return { ok: true, approved: false, logEntry, reason: msg };
    }
  }

  judgeAllRequisitionsByNpcPersonality() {
    const st = this.activate();
    generateDiscipleRequisitions(this.g, st);
    const pending = [...(st.treasury.requisitions || [])];
    if (!pending.length) {
      return this.proactiveDistributeFromTreasury();
    }
    let approvedCount = 0;
    let rejectedCount = 0;
    for (const req of pending) {
      const r = this.judgeRequisition(req.id, null);
      if (r.ok && r.approved) approvedCount++;
      else if (r.ok && !r.approved) rejectedCount++;
    }
    return {
      ok: true,
      approvedCount,
      rejectedCount,
      reason: `ผู้ดูแลคลังพิจารณาคำร้องตามนิสัยเสร็จสิ้น: อนุมัติ ${approvedCount} รายการ · ปฏิเสธ ${rejectedCount} รายการ`
    };
  }

  proactiveDistributeFromTreasury() {
    const st = this.activate();
    const dist = getActiveTreasuryDistributor(this.g, st);
    const bank = getBankTreasuryItems(this.g);
    const heroes = (this.g.heroes || []).filter(h => treasuryMemberAvailable(this.g, h));
    if (!heroes.length) return { ok: false, reason: 'ยังไม่มีศิษย์ในสำนัก' };
    if (!dist.npc) return { ok: false, reason: 'ยังไม่มีผู้ดูแลคลังที่พร้อมปฏิบัติหน้าที่' };

    const candidates = [
      ...bank.equipment.map(item => treasuryRequestSpec(this.g, 'EQUIPMENT', item)),
      ...bank.pills.map(item => treasuryRequestSpec(this.g, 'PILL', item)),
      ...bank.scrolls.map(item => treasuryRequestSpec(this.g, 'SCROLL', item)),
      ...bank.materials.filter(item => item.count >= 4).map(item => treasuryRequestSpec(this.g, 'MATERIAL', item))
    ];
    let candidateReq = null, best = null;
    for (const candidate of candidates) {
      const ranked = heroes.filter(h => {
        if (!prepareTreasuryTransfer(this.g, candidate, h).ok) return false;
        if (candidate.itemKind === 'SCROLL') {
          const art = this.g.progression.artMap.get(candidate.artId);
          return (h.jianghu.knowledgeV190?.[art?.id]?.stage || 0) < 4 &&
            this.g.progression.compatible(h, art) && this.g.progression.canStudyArtTier(h, art) &&
            (!this.g.discovery || this.g.discovery.canStudy(h, art));
        }
        if (candidate.itemKind === 'EQUIPMENT') {
          const currentId = h.jianghu.equipmentV140?.[candidate.slot];
          const current = h.jianghu.ledgerV140.equipmentItems.find(item => item.id === currentId);
          if (current && (current.tier || 1) >= candidate.tier) return false;
        }
        return true;
      }).map(hero => ({ hero, evalRes: evaluateRequisitionScore(this.g, dist.npc, dist.philosophy, hero, candidate) }))
        .filter(row => row.evalRes.approved).sort((a, b) => b.evalRes.totalScore - a.evalRes.totalScore);
      if (ranked.length) { candidateReq = candidate;best = ranked[0];break; }
    }
    if (!best) return { ok: false, reason: 'ยังไม่มีผู้รับที่เหมาะสมและผ่านเกณฑ์อนุมัติของผู้ดูแลคลัง' };

    const transfer = executePhysicalItemTransfer(this.g, candidateReq, best.hero);
    if (!transfer.ok) return { ok: false, reason: transfer.effectTextTh };

    if (dist.npc && dist.npc.id !== best.hero.id) {
      this.g.life?.relate?.(best.hero, dist.npc, 8, 3);
    }
    const logEntry = {
      id: 'tlog_' + (this.g.s.nextId++),
      t: Math.round(this.g.s.t || 0),
      day: Math.floor((this.g.s.t || 0) / 20) + 1,
      decision: 'PROACTIVE_GRANT',
      verdictType: best.evalRes.verdictType,
      distributorName: dist.npc?.name || 'คลังสำนัก',
      distributorStyleTh: dist.philosophy.styleBadgeTh,
      requesterName: best.hero.name,
      itemNameTh: candidateReq.itemNameTh,
      itemKind: candidateReq.itemKind,
      score: best.evalRes.totalScore,
      threshold: best.evalRes.threshold,
      reasonTh: `แจกจ่ายเชิงรุกตามนิสัยผู้ดูแลคลัง · ${best.evalRes.verdictReasonTh} · ${transfer.effectTextTh}`
    };
    st.treasury.ledgerHistory.unshift(logEntry);
    if (st.treasury.ledgerHistory.length > 60) st.treasury.ledgerHistory.length = 60;
    const msg = `🎁 [${dist.npc?.name || 'ผู้ดูแลคลัง'}] แจกจ่าย «${candidateReq.itemNameTh}» ให้ ${best.hero.name} (${best.evalRes.verdictType === 'FAVORITISM' ? 'เอนเอียงให้คนสนิท' : 'ตามความเหมาะสมและผลงาน'})`;
    this.g.note(msg);
    this.recordHistory('TREASURY_PROACTIVE', msg, logEntry.reasonTh, st.currentEp);
    return { ok: true, logEntry, reason: msg };
  }

  toggleAutoTreasuryDistribute() {
    const st = this.activate();
    st.treasury.autoDistribute = !st.treasury.autoDistribute;
    return {
      ok: true,
      autoDistribute: st.treasury.autoDistribute,
      reason: st.treasury.autoDistribute ? 'เปิดการยื่นคำร้องและแจกจ่ายคลังอัตโนมัติตามนิสัย NPC แล้ว' : 'พักการแจกจ่ายคลังอัตโนมัติชั่วคราว'
    };
  }

  retireTargets(ids, reason) {
    const g = this.g, st = this.ensureState(true);
    st.targetDepartures = st.targetDepartures || {};
    for (const id of ids || []) {
      const n = g.world.npcs[id];
      if (n && alive(n)) {
        n.stageLocal.offmap = { eventDeparture: true, until: null };
        n.stageLocal.mode = 'offmap'; n.stageLocal.route = []; n.stageLocal.target = null; n.currentCityId = null;
        g.s.enemyIds = g.s.enemyIds.filter(x => x !== id);
        st.targetDepartures[id] = { at: g.s.t, reason };
      }
      const b = g.s.beasts.find(b => b.id === id);
      if (b && alive(b)) { st.targetDepartures[id] = { at: g.s.t, reason }; g.s.beasts = g.s.beasts.filter(x => x.id !== id); }
    }
  }

  canStartAutomaticTrial() {
    const g = this.g;
    const ready = g.heroes.filter(n => alive(n) && !n.stageLocal?.offmap && n.health >= 70 && (n.core?.condition?.fatigue || 0) < 65 && (n.stageLocal?.needs?.hunger || 0) < 75);
    return ready.length >= 2 && !staleThreat(g);
  }

  tick(dt) {
    const s = this.g?.s;
    if (!s?.storyEvents?.active) return;
    const st = s.storyEvents;
    const now = Number(s.t) || 0;
    root.JianghuSideQuests?.tick(this.g, dt);
    root.JianghuSectContributions?.tick(this.g, dt);
    if (now >= (st.nextRewardRetryAt || 0)) { st.nextRewardRetryAt = now + 5; retryStoryRewards(this.g, st); }

    if (Array.isArray(st.aftermaths) && st.aftermaths.length) {
      st.aftermaths = st.aftermaths.filter(a => Number(a.expiresAt) > now);
    }
    if (st.treasury && now >= (st.treasury.nextTreasuryTickAt || 30)) {
      st.treasury.nextTreasuryTickAt = now + 35;
      if (!st.treasury.elderNpcId && st.treasury.authorityMode === 'APPOINTED_ELDER') {
        this.letMasterDecideTreasuryAuthority();
      }
      generateDiscipleRequisitions(this.g, st);
      if (st.treasury.autoDistribute && st.treasury.requisitions.length > 0) {
        const readyReq = st.treasury.requisitions.find(r => {
          const n = this.g.world.npcs[r.requesterId], p = prepareTreasuryTransfer(this.g,r,n);
          return p.ok && (!root.JianghuSectContributions || root.JianghuSectContributions.prepareRedemption(this.g,r,n,p.item,p.qty||1).ok);
        });
        if (readyReq) this.judgeRequisition(readyReq.id, null);
      }
    }
    const curDay = Math.floor(now / 20);
    if (curDay > (st.lastDoctrineDay || 0)) {
      st.lastDoctrineDay = curDay;
      let bonusStones = 0;
      let bonusFood = 0;
      let bonusCultPct = 0;
      for (const d of (st.doctrines || [])) {
        bonusStones += Number(d.dailyStones || 0);
        bonusFood += Number(d.dailyFood || 0);
        bonusCultPct += Number(d.cultivationBonusPct || 0);
      }
      if (bonusStones > 0) this.g.money(bonusStones, 'ส่วยมติสำนักประจำวัน');
      if (bonusFood > 0) s.food = Math.min(160, (s.food || 0) + bonusFood);
      if (bonusCultPct > 0) {
        const gain = Math.min(6, bonusCultPct * 0.08);
        for (const h of this.g.heroes.filter(alive)) {
          root.World2026Engine?.applyNpcCultivationProgressGain?.(this.g.world, h, gain);
        }
      }
    }

    if (st.epPhase === 'WAITING_CONDITIONS') {
      const epDef = this.getNodeDef(st.currentNodeId);
      const conds = epDef.evaluateConditions(this.g);
      if (conds.every(c => c.passed) && this.canStartAutomaticTrial()) {
        this.triggerCurrentEpisodeTrial();
      }
    } else if (st.epPhase === 'ACTIVE_TRIAL') {
      if (this.targetsDefeated(st.trialEntityIds || [], st.trialTagId)) {
        this.completeCurrentEpisode(false);
      } else if (now > st.trialStartedAt + 480 || (st.trialEntityIds || []).some(id => !this.isEntityAlive(id) && !st.targetDefeats[id])) {
        this.retireTargets(st.trialEntityIds, 'บททดสอบยุติลง');
        this.recordHistory('STORY_FAILED', 'บททดสอบยังไม่สำเร็จ', 'เป้าหมายถอนตัวหรือหมดเวลา สำนักพักเตรียมกำลังและลองใหม่ได้', st.currentEp);
        st.trialEntityIds = []; st.epPhase = 'WAITING_CONDITIONS'; st.storyReadyAt = now + 120;
      }
    }

    const dyn = st.activeDynamicEvent;
    if (dyn) {
      const def = DYNAMIC_EVENTS_CATALOG_V202.find(e => e.id === dyn.id);
      if (dyn.timerOnly) {
        if (now >= dyn.expiresAt) {
          this.resolveActiveEvent();
        }
      } else {
        const remaining = (dyn.entityIds || []).filter(id => this.isEntityAlive(id));
        if (this.targetsDefeated(dyn.entityIds || [], dyn.tagId)) {
          this.resolveActiveEvent();
        } else if (now >= dyn.expiresAt || remaining.some(id => st.targetDepartures?.[id]) || (dyn.entityIds || []).some(id => !this.isEntityAlive(id) && !st.targetDefeats[id])) {
          this.retireTargets(remaining, 'ภัยอีเวนต์ถอยจากหุบเขา');
          this.g.note(`⏳ อีเวนต์ «${dyn.nameTh}» สิ้นสุดลงเมื่อคลื่นภัยถอยร่นกลับไป`);
          this.recordHistory('EVENT_EXPIRED', `⏳ สิ้นสุด «${dyn.nameTh}»`, 'คลื่นเหตุการณ์สงบลงตามกาลเวลา', dyn.epNum);
          st.activeDynamicEvent = null;
          st.eventReadyAt = now + 60;
        }
      }
    } else {
      if (Array.isArray(st.chainedQueue) && st.chainedQueue.length > 0) {
        const dueIdx = st.chainedQueue.findIndex(c => now >= c.triggerAt);
        if (dueIdx >= 0) {
          const result = this.triggerQueuedChainNow(st.chainedQueue[dueIdx].id);
          if (result.ok) return;
        }
      }
      if (st.autoEvents && now >= (st.nextEventAt || 75)) {
        if (this.canStartAutomaticTrial() && this.g.built('hall')) {
          const result = this.triggerDynamicEvent(null);
          if (!result.ok) st.nextEventAt = now + 15;
        } else {
          st.nextEventAt = now + 35;
        }
      }
    }
  }
}

const storyApi = {
  VERSION: '2.05-quests-treasury',
  PATH_META,
  STORY_EPISODES_V202,
  STORY_TREE_NODES_V203,
  DYNAMIC_EVENTS_CATALOG_V202,
  EP_BEAST_TIDE_POOLS,
  EP_RAIDER_POOLS,
  requiredBandForEp,
  requiredOrdinalForPath,
  getPathStageTableForEp,
  evaluateDiscipleForEp,
  evaluateNpcBranchVote,
  runNpcBranchCouncil,
  grantRealEquipment,
  grantRealPills,
  grantRealManualAndTeach,
  grantRealCompanionBeast,
  spawnRealGroundDrops,
  unlockSectDoctrine,
  addEventAftermath,
  queueChainedEvent,
  StoryEventSystem,
  treasuryTools: { memberAvailable: treasuryMemberAvailable, source: treasuryRequestSource, spec: treasuryRequestSpec, prepareTransfer: prepareTreasuryTransfer }
};

root.JianghuStoryEvents = storyApi;
if (root.JianghuExpansionV112) {
  root.JianghuExpansionV112.storyEvents = storyApi;
}
})(typeof globalThis!=='undefined'?globalThis:this);
