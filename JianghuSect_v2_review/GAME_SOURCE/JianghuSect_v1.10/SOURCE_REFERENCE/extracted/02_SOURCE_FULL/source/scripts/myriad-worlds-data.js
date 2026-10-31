/* Jianghu Ascension v2.00 — Myriad Worlds (แดนหมื่นภพ) Declarative Content Registry
 * Contains:
 * - 5 Physical Entrances to แดนหมื่นภพ (shared probability law)
 * - 15 Distinct Environments (MW_ENV_01 .. MW_ENV_15)
 * - 90 Coherent Thematic Encounter Pools (6 per environment)
 * - 125 New Base Beast Species (MW_BEAST_001 .. MW_BEAST_125) + 18 NW_BEAST drop fixups
 * - 40 Rare Organs & Individual Mutations (MW_ORGAN_001 .. MW_ORGAN_040)
 * - 235 New Materials (MW_MAT_*) across Beast Parts, Rare Organs, Herbs, Ores/Crystals, Spirit Wood, Spirit Liquid, Sacred Soil, Formation Media, Talisman Materials, Venom/Gu, and Relic Essence
 * - 165 New Recipes (MW_REC_001 .. MW_REC_165) + 25 Property-Based Experimentation Designs (MW_EXP_001 .. MW_EXP_025)
 * - 24 Multi-Choice Exploration Event Chains (MW_EVT_01 .. MW_EVT_24)
 * Leaves Human Foundation (source/scripts/human.js) 100% untouched.
 */
(function(root){
'use strict';
const DATA = {
  "version": "2.00.0",
  "patch": "2.00-myriad-worlds",
  "realmNameTh": "แดนหมื่นภพ",
  "entrances": [
    {
      "id": "MW_ENT_NORTH_RIFT",
      "nameTh": "รอยแยกเมฆาอุดร (Northern Cloud Rift)",
      "shortTh": "รอยแยกเมฆาอุดร",
      "icon": "🌌",
      "x": 3420,
      "y": 420,
      "fee": 14,
      "food": 2,
      "duration": 36,
      "descTh": "รอยแยกมิติเหนือยอดเขาหิมะอุดรที่กระแสปราณฟ้าดินบิดเบี้ยว เชื่อมต่อไปยังแดนหมื่นภพด้วยกฎความน่าจะเป็นเดียวกับทางเข้าอื่นทุกประการ"
    },
    {
      "id": "MW_ENT_EAST_MIST_GATE",
      "nameTh": "ประตูหมอกบูรพา (Eastern Mist Gate)",
      "shortTh": "ประตูหมอกบูรพา",
      "icon": "⛩️",
      "x": 3680,
      "y": 1680,
      "fee": 14,
      "food": 2,
      "duration": 36,
      "descTh": "ซุ้มประตูศิลาโบราณกลางทะเลหมอกทิศตะวันออก เมื่อก้าวผ่านม่านหมอกจะถูกส่งเข้าสู่ห้วงมิติแดนหมื่นภพแบบสุ่มตามวัฏจักรปราณ"
    },
    {
      "id": "MW_ENT_SOUTH_ROOT_ARCH",
      "nameTh": "ซุ้มรากพฤกษาทักษิณ (Southern World-Root Arch)",
      "shortTh": "ซุ้มรากพฤกษาทักษิณ",
      "icon": "🌳",
      "x": 2650,
      "y": 2780,
      "fee": 14,
      "food": 2,
      "duration": 36,
      "descTh": "โพรงรากไม้บรรพกาลทางตอนใต้ของหุบเขาที่หยั่งลึกลงไปในเส้นชีพจรโลก เปิดทางสู่แดนหมื่นภพอย่างไม่อาจคาดเดาภูมิประเทศล่วงหน้า"
    },
    {
      "id": "MW_ENT_WEST_STAR_WELL",
      "nameTh": "บ่อดาราประจิม (Western Starfall Well)",
      "shortTh": "บ่อดาราประจิม",
      "icon": "🌠",
      "x": 380,
      "y": 1180,
      "fee": 14,
      "food": 2,
      "duration": 36,
      "descTh": "แอ่งน้ำโบราณทางทิศตะวันตกที่สะท้อนภาพหมู่ดาวต่างภพ ผู้ที่ดำดิ่งลงไปจะทะลุเข้าสู่หนึ่งในภูมิทัศน์ของแดนหมื่นภพ"
    },
    {
      "id": "MW_ENT_ABYSSAL_FAULT",
      "nameTh": "หุบเหวรอยต่อภพ (Abyssal Realm Fault)",
      "shortTh": "หุบเหวรอยต่อภพ",
      "icon": "🌀",
      "x": 1420,
      "y": 2820,
      "fee": 14,
      "food": 2,
      "duration": 36,
      "descTh": "รอยแยกธรณีพิบัติริมผาใต้สุดของเขตชายแดน ที่ซึ่งกระแสลมปราณโบราณพัดพาผู้กล้าเข้าสู่วงจรสุ่มของแดนหมื่นภพ"
    }
  ],
  "environments": [
    {
      "id": "MW_ENV_01_ANCIENT_CANOPY",
      "nameTh": "พงไพรบรรพกาลเร้นเมฆา",
      "icon": "🌲",
      "weight": 100,
      "tierRange": [
        1,
        5
      ],
      "element": "WOOD",
      "terrain": "forest",
      "visibility": 0.72,
      "hazardTh": "ละอองเกสรสะกดจิตและเถาวัลย์ดูดปราณในร่มเงาทึบ",
      "categoryProfile": {
        "HERB": "ABUNDANT",
        "BEAST_PART": "ABUNDANT",
        "SPIRIT_WOOD": "ABUNDANT",
        "ORE": "SCARCE"
      },
      "rationaleTh": "ผืนป่าดึกดำบรรพ์ที่เรือนยอดสูงเสียดฟ้าบดบังแสงตะวัน อุดมด้วยสมุนไพรร่มเงา ไม้แก่นวิญญาณ ยางไม้ และสัตว์อสูรผู้ล่าบนเรือนยอด แต่แทบไม่มีสายแร่โลหะให้ขุดเจาะ"
    },
    {
      "id": "MW_ENV_02_MIASMA_MANGROVE",
      "nameTh": "บึงหมอกพิษโกงกางทมิฬ",
      "icon": "🐊",
      "weight": 95,
      "tierRange": [
        1,
        5
      ],
      "element": "WATER",
      "terrain": "forest",
      "visibility": 0.55,
      "hazardTh": "ไอพิษชื้นแฉะกัดกร่อนปราณคุ้มกายและโคลนดูดวิญญาณ",
      "categoryProfile": {
        "VENOM_GU": "ABUNDANT",
        "HERB": "COMMON",
        "SPIRIT_LIQUID": "COMMON",
        "ORE": "EXCLUDED"
      },
      "rationaleTh": "พื้นที่ชุ่มน้ำและป่าโกงกางโบราณที่ปกคลุมด้วยหมอกพิษเจ็ดสี แหล่งรวมแมลงกู่ สัตว์ครึ่งบกครึ่งน้ำ สมุนไพรพิษ และโคลนศักดิ์สิทธิ์ แต่ไร้แร่โลหะแข็ง"
    },
    {
      "id": "MW_ENV_03_FROZEN_HIGHLANDS",
      "nameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า",
      "icon": "❄️",
      "weight": 88,
      "tierRange": [
        2,
        6
      ],
      "element": "ICE",
      "terrain": "mountain",
      "visibility": 0.65,
      "hazardTh": "พายุหิมะเชือดเฉือนเส้นชีพจรและไอเย็นแช่แข็งปราณ",
      "categoryProfile": {
        "HERB": "UNCOMMON",
        "CRYSTAL": "ABUNDANT",
        "SPIRIT_LIQUID": "COMMON",
        "BEAST_PART": "COMMON"
      },
      "rationaleTh": "ที่ราบสูงน้ำแข็งและสันเขาหิมะนิรันดร์ พืชพรรณเติบโตช้าแต่บริสุทธิ์ยิ่ง อุดมด้วยผลึกน้ำแข็ง น้ำอมฤตจันทรา และอสูรขนหนาทนความหนาวเหน็บ"
    },
    {
      "id": "MW_ENV_04_VOLCANIC_CALDERA",
      "nameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า",
      "icon": "🌋",
      "weight": 85,
      "tierRange": [
        2,
        6
      ],
      "element": "FIRE",
      "terrain": "desert",
      "visibility": 0.78,
      "hazardTh": "ไอร้อนกำมะถันเผาผลาญปอดและลาวาปะทุฉับพลัน",
      "categoryProfile": {
        "ORE": "ABUNDANT",
        "CRYSTAL": "COMMON",
        "HERB": "SCARCE",
        "BEAST_PART": "COMMON"
      },
      "rationaleTh": "ปากปล่องภูเขาไฟและลำธารหินหนืดที่อุดมด้วยแร่เหล็กเพลิง ทองคำสุริยัน และเถ้าถ่านวิญญาณ สมุนไพรทั่วไปไม่อาจทนไฟได้ ยกเว้นบัวเพลิงและหญ้าอัคคี"
    },
    {
      "id": "MW_ENV_05_MINERAL_DESERT",
      "nameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง",
      "icon": "🏜️",
      "weight": 92,
      "tierRange": [
        1,
        5
      ],
      "element": "EARTH",
      "terrain": "desert",
      "visibility": 0.6,
      "hazardTh": "พายุทรายใบมีดตัดเกราะและภาวะขาดน้ำปราณ",
      "categoryProfile": {
        "ORE": "ABUNDANT",
        "SACRED_SOIL": "ABUNDANT",
        "BEAST_PART": "COMMON",
        "HERB": "SCARCE"
      },
      "rationaleTh": "ทะเลทรายกว้างใหญ่ที่เต็มไปด้วยเสาหินแร่ ทรายทองคำ เกลือปราณ และอสูรเกราะแข็งจำพวกแมงป่องและด้วงแร่ พืชสมุนไพรหายากยิ่ง"
    },
    {
      "id": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "nameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง",
      "icon": "🌊",
      "weight": 76,
      "tierRange": [
        2,
        7
      ],
      "element": "WATER",
      "terrain": "island",
      "visibility": 0.48,
      "hazardTh": "แรงดันสมุทรลึกบดขยี้กายเนื้อและกระแสน้ำร้อนจัดสลับเย็นจัด",
      "categoryProfile": {
        "CRYSTAL": "ABUNDANT",
        "SPIRIT_LIQUID": "ABUNDANT",
        "BEAST_PART": "ABUNDANT",
        "HERB": "UNCOMMON"
      },
      "rationaleTh": "ระบบนิเวศก้นสมุทรไร้แสงตะวัน รอบปล่องน้ำพุร้อนใต้ทะเลที่สิ่งมีชีวิตพึ่งพาปราณเคมีและแสงชีวภาพ อุดมด้วยมุกสมุทร แร่ก้นทะเล และอสูรทะเลลึก"
    },
    {
      "id": "MW_ENV_07_THUNDER_PLATEAU",
      "nameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์",
      "icon": "⚡",
      "weight": 82,
      "tierRange": [
        2,
        6
      ],
      "element": "LIGHTNING",
      "terrain": "mountain",
      "visibility": 0.82,
      "hazardTh": "สายฟ้าทัณฑ์สวรรค์ผ่าลงเสาแร่และสนามแม่เหล็กปั่นป่วนปราณ",
      "categoryProfile": {
        "ORE": "ABUNDANT",
        "TALISMAN_MAT": "COMMON",
        "HERB": "UNCOMMON",
        "BEAST_PART": "COMMON"
      },
      "rationaleTh": "ที่ราบสูงหินแม่เหล็กที่สายฟ้าฟาดลงมาไม่หยุดหย่อน แหล่งกำเนิดเหล็กอัสนี ไผ่สายฟ้า ผลึกอสนีบาต และอสูรสายฟ้าผู้ดุดัน"
    },
    {
      "id": "MW_ENV_08_CRYSTAL_CAVERN",
      "nameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ",
      "icon": "💎",
      "weight": 86,
      "tierRange": [
        1,
        6
      ],
      "element": "EARTH",
      "terrain": "mountain",
      "visibility": 0.58,
      "hazardTh": "คลื่นเสียงสะท้อนจากผลึกแก้วทำให้ทะเลจิตสั่นคลอนและหินถล่ม",
      "categoryProfile": {
        "CRYSTAL": "ABUNDANT",
        "ORE": "ABUNDANT",
        "SPIRIT_LIQUID": "COMMON",
        "HERB": "SCARCE"
      },
      "rationaleTh": "โถงถ้ำลึกใต้ดินที่ผนังทุกด้านเป็นผลึกหยกและแร่เรืองแสง มีนมศิลาหยดสะสมและสัตว์อสูรตาบอดที่ใช้คลื่นเสียงสะท้อนในการล่า"
    },
    {
      "id": "MW_ENV_09_FUNGAL_GROVE",
      "nameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ",
      "icon": "🍄",
      "weight": 90,
      "tierRange": [
        1,
        5
      ],
      "element": "WOOD",
      "terrain": "forest",
      "visibility": 0.62,
      "hazardTh": "ละอองสปอร์ปรสิตแทรกซึมลมหายใจและภาพหลอนประสาท",
      "categoryProfile": {
        "HERB": "ABUNDANT",
        "VENOM_GU": "ABUNDANT",
        "BEAST_PART": "COMMON",
        "ORE": "SCARCE"
      },
      "rationaleTh": "ป่าใต้หุบเขาอับชื้นที่ต้นเห็ดหลินจือและเห็ดเรืองแสงเติบโตสูงใหญ่เท่าต้นไม้ มีทั้งเห็ดทิพย์รักษาชีวิตและเชื้อราปรสิตที่ควบคุมร่างแมลงและอสูร"
    },
    {
      "id": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "nameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี",
      "icon": "🪷",
      "weight": 88,
      "tierRange": [
        1,
        6
      ],
      "element": "WATER",
      "terrain": "plains",
      "visibility": 0.9,
      "hazardTh": "เงาสะท้อนบนผิวน้ำดึงดูดความทรงจำและสร้างมารในใจ",
      "categoryProfile": {
        "HERB": "ABUNDANT",
        "SPIRIT_LIQUID": "ABUNDANT",
        "TALISMAN_MAT": "COMMON",
        "ORE": "UNCOMMON"
      },
      "rationaleTh": "ทะเลสาบน้ำใสราวกระจกเงาที่สะท้อนท้องฟ้าและจิตใจผู้มาเยือน อุดมด้วยบัววิญญาณ น้ำค้างทิพย์ ปลาปราณ และอสูรสายจิตวิญญาณ"
    },
    {
      "id": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "nameTh": "ซากอุทยานสวรรค์ร่วงหล่น",
      "icon": "🏛️",
      "weight": 68,
      "tierRange": [
        3,
        7
      ],
      "element": "LIGHT",
      "terrain": "mountain",
      "visibility": 0.85,
      "hazardTh": "ค่ายกลโบราณที่ยังทำงานค้างอยู่และหุ่นศิลาพิทักษ์อุทยาน",
      "categoryProfile": {
        "HERB": "ABUNDANT",
        "RELIC_ESSENCE": "ABUNDANT",
        "FORMATION_MEDIA": "ABUNDANT",
        "ORE": "UNCOMMON"
      },
      "rationaleTh": "เศษเสี้ยวของอุทยานเซียนโบราณที่ตกลงมาจากเบื้องบน เต็มไปด้วยสมุนไพรทิพย์กลายพันธุ์ เศษเสาค่ายกล ตำราโบราณ และอสูรผู้พิทักษ์สายเลือดมงคล"
    },
    {
      "id": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "nameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ",
      "icon": "⚔️",
      "weight": 78,
      "tierRange": [
        2,
        6
      ],
      "element": "YIN",
      "terrain": "plains",
      "visibility": 0.64,
      "hazardTh": "ปราณสังหารตกค้างและคมกระบี่อาฆาตที่พุ่งเชือดเฉือนเอง",
      "categoryProfile": {
        "RELIC_ESSENCE": "ABUNDANT",
        "ORE": "COMMON",
        "BEAST_PART": "COMMON",
        "HERB": "UNCOMMON"
      },
      "rationaleTh": "ทุ่งร้างที่เต็มไปด้วยโครงกระดูกอสูรยักษ์และศาสตราแตกหักจากศึกเมื่อพันปีก่อน ปราณโลหิตและหยินหล่อเลี้ยงอสูรกระดูกและหญ้าคืนชีพ"
    },
    {
      "id": "MW_ENV_13_KARST_WIND_PILLARS",
      "nameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด",
      "icon": "⛰️",
      "weight": 90,
      "tierRange": [
        1,
        5
      ],
      "element": "WIND",
      "terrain": "mountain",
      "visibility": 0.88,
      "hazardTh": "กระแสลมกรดตัดร่างและทางเดินริมผาแคบชัน",
      "categoryProfile": {
        "HERB": "COMMON",
        "ORE": "COMMON",
        "BEAST_PART": "ABUNDANT",
        "TALISMAN_MAT": "COMMON"
      },
      "rationaleTh": "ป่าเสาหินปูนสูงชันนับพันต้นที่มีสะพานธรรมชาติและกระแสลมแรง เป็นรังของวิหคอสูร วานรภูผา กล้วยไม้หน้าผา และแร่ปราณวายุ"
    },
    {
      "id": "MW_ENV_14_STARFALL_CRATER",
      "nameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง",
      "icon": "☄️",
      "weight": 64,
      "tierRange": [
        3,
        7
      ],
      "element": "STAR",
      "terrain": "mountain",
      "visibility": 0.8,
      "hazardTh": "สนามแรงโน้มถ่วงผิดปกติกดทับการเคลื่อนไหวและรังสีดาราเผาผลาญ",
      "categoryProfile": {
        "ORE": "ABUNDANT",
        "CRYSTAL": "ABUNDANT",
        "RELIC_ESSENCE": "COMMON",
        "HERB": "UNCOMMON"
      },
      "rationaleTh": "แอ่งหลุมยักษ์ที่เกิดจากดาวตกบรรพกาลพุ่งชน แรงโน้มถ่วงสูงกว่าปกติหลายเท่า อุดมด้วยเหล็กไหลอุกกาบาต หยกดารา และอสูรที่วิวัฒนาการโครงกระดูกให้รับแรงกดทับ"
    },
    {
      "id": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "nameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ",
      "icon": "🌀",
      "weight": 48,
      "tierRange": [
        4,
        7
      ],
      "element": "VOID",
      "terrain": "mountain",
      "visibility": 0.5,
      "hazardTh": "พายุรอยแยกมิติฉีกกระชากปราณและการบิดเบือนของเวลา",
      "categoryProfile": {
        "CRYSTAL": "ABUNDANT",
        "RELIC_ESSENCE": "ABUNDANT",
        "FORMATION_MEDIA": "ABUNDANT",
        "HERB": "SCARCE"
      },
      "rationaleTh": "เขตชายขอบที่ผืนผ้าใบของภพภูมิฉีกขาด เศษหินลอยเคว้งในความว่างเปล่า เป็นแหล่งกำเนิดหยกสุญตา ผลึกข้ามมิติ และอสูรระดับสูงที่แหวกว่ายระหว่างรอยแยก"
    }
  ],
  "rareOrgans": [
    {
      "id": "MW_ORGAN_001",
      "matId": "MAT_MW_ORGAN_001",
      "nameTh": "ต่อมกังวานคู่สะท้อนปราณ",
      "tier": 2,
      "element": "WIND",
      "anatomyType": "HEART_GALL",
      "mutationChance": 0.08,
      "dissectionDifficulty": 32,
      "auraHintTh": "เสียงคำรามมีคลื่นความถี่ซ้อนกันสองชั้น",
      "physicalSignTh": "ลำคอป่องนูนสองฝั่ง",
      "propertyTags": [
        "RESONANCE",
        "QI_CONDUCT",
        "SOUND_WAVE"
      ],
      "usesTh": "เพิ่มอานุภาพวิชาเสียงและลดการใช้ปราณของเครื่องราง"
    },
    {
      "id": "MW_ORGAN_002",
      "matId": "MAT_MW_ORGAN_002",
      "nameTh": "ปมไขกระดูกหลอมอัสนี",
      "tier": 3,
      "element": "LIGHTNING",
      "anatomyType": "MARROW",
      "mutationChance": 0.07,
      "dissectionDifficulty": 45,
      "auraHintTh": "ประกายไฟสีครามแลบตามข้อต่อยามเคลื่อนไหว",
      "physicalSignTh": "กระดูกสันหลังมีปมผลึกสีม่วงคราม",
      "propertyTags": [
        "LIGHTNING_TEMPERED",
        "MARROW_STRENGTH",
        "CONDUCTIVE"
      ],
      "usesTh": "ใช้ชุบศาสตราสายฟ้าหรือหลอมโอสถเสริมกระดูกอสนี"
    },
    {
      "id": "MW_ORGAN_003",
      "matId": "MAT_MW_ORGAN_003",
      "nameTh": "เยื่อตาจันทร์กระจกเงา",
      "tier": 3,
      "element": "ICE",
      "anatomyType": "SENSORY_ORGAN",
      "mutationChance": 0.07,
      "dissectionDifficulty": 48,
      "auraHintTh": "ดวงตาสะท้อนแสงจันทร์เป็นวงแหวนสีเงินแม้ในที่มืดสนิท",
      "physicalSignTh": "ม่านตาซ้อนกันสองชั้นดั่งกระจกหยก",
      "propertyTags": [
        "MOON_REFLECT",
        "ILLUSION_PIERCE",
        "NIGHT_VISION"
      ],
      "usesTh": "ทะลวงภาพมายาและเพิ่มความแม่นยำของกระบี่จิต"
    },
    {
      "id": "MW_ORGAN_004",
      "matId": "MAT_MW_ORGAN_004",
      "nameTh": "หน่อเขาบรรพกาลคืนสายเลือด",
      "tier": 4,
      "element": "EARTH",
      "anatomyType": "BONE_HORN",
      "mutationChance": 0.06,
      "dissectionDifficulty": 56,
      "auraHintTh": "ปราณกดดันโบราณแผ่ออกจากหน้าผากเหนือเขาปกติ",
      "physicalSignTh": "มีหน่อเขาสีทองหม่นงอกแทรกกลางกระหม่อม",
      "propertyTags": [
        "ANCESTRAL_BLOOD",
        "ARMOR_PIERCE",
        "ROYAL_AURA"
      ],
      "usesTh": "ใช้ตีหัวทวนทะลวงเกราะหรือปรุงโอสถปลุกสายเลือด"
    },
    {
      "id": "MW_ORGAN_005",
      "matId": "MAT_MW_ORGAN_005",
      "nameTh": "ไข่มุกวิญญาณแฝดเก้าวัฏจักร",
      "tier": 4,
      "element": "WATER",
      "anatomyType": "SPIRIT_PEARL",
      "mutationChance": 0.05,
      "dissectionDifficulty": 62,
      "auraHintTh": "กระแสน้ำรอบตัวอสูรหมุนวนเป็นรูปหยินหยาง",
      "physicalSignTh": "ภายในช่องท้องมีแสงมุกสองดวงโคจรรอบกัน",
      "propertyTags": [
        "TWIN_CORE",
        "QI_RESERVOIR",
        "WATER_AFFINITY"
      ],
      "usesTh": "ขยายความจุปราณสูงสุดและใช้เป็นแกนค่ายกลระดับสูง"
    },
    {
      "id": "MW_ORGAN_006",
      "matId": "MAT_MW_ORGAN_006",
      "nameTh": "ถุงพิษผลึกเจ็ดสีกลายพันธุ์",
      "tier": 3,
      "element": "WOOD",
      "anatomyType": "VENOM_GLAND",
      "mutationChance": 0.07,
      "dissectionDifficulty": 46,
      "auraHintTh": "ไอพิษที่พ่นออกมามีเกล็ดผลึกแวววาวไม่สลายตามลม",
      "physicalSignTh": "ถุงพิษใต้เขี้ยวแข็งตัวเป็นก้อนผลึกเจ็ดสี",
      "propertyTags": [
        "CRYSTAL_VENOM",
        "CORROSIVE",
        "ANTIDOTE_CATALYST"
      ],
      "usesTh": "ใช้สกัดพิษกู่ชั้นสูงหรือใช้เป็นตัวเร่งโอสถถอนพิษร้อยชนิด"
    },
    {
      "id": "MW_ORGAN_007",
      "matId": "MAT_MW_ORGAN_007",
      "nameTh": "หัวใจเพลิงสุริยันสองห้องซ้อน",
      "tier": 4,
      "element": "FIRE",
      "anatomyType": "HEART_GALL",
      "mutationChance": 0.06,
      "dissectionDifficulty": 58,
      "auraHintTh": "ไอร้อนรอบกายระอุเป็นจังหวะชีพจรคู่",
      "physicalSignTh": "หัวใจมีห้องสูบฉีดปราณเพลิงแยกต่างหากอีกชั้น",
      "propertyTags": [
        "DUAL_PULSE",
        "SOLAR_FLAME",
        "VITALITY_SURGE"
      ],
      "usesTh": "เร่งไฟเตาหลอมและเพิ่มพลังฟื้นฟูชีวิตในโอสถหลอมกายา"
    },
    {
      "id": "MW_ORGAN_008",
      "matId": "MAT_MW_ORGAN_008",
      "nameTh": "ต่อมไหมเหล็กไหลดารา",
      "tier": 3,
      "element": "METAL",
      "anatomyType": "SILK_SAC",
      "mutationChance": 0.07,
      "dissectionDifficulty": 44,
      "auraHintTh": "เส้นใยที่พ่นออกมามีเสียงโลหะกระทบกัน",
      "physicalSignTh": "ต่อมชักใยมีประกายแร่เหล็กไหลเงินยวง",
      "propertyTags": [
        "METALLIC_SILK",
        "TENSILE_TOUGH",
        "TRAP_MEDIA"
      ],
      "usesTh": "ใช้ถักทอเสื้อเกราะอ่อนไร้รอยต่อและสายพิณศึก"
    },
    {
      "id": "MW_ORGAN_009",
      "matId": "MAT_MW_ORGAN_009",
      "nameTh": "เกล็ดย้อนสลักอักขระธรรมชาติ",
      "tier": 4,
      "element": "LIGHTNING",
      "anatomyType": "SCALE_CARAPACE",
      "mutationChance": 0.06,
      "dissectionDifficulty": 54,
      "auraHintTh": "สายฟ้ารอบตัววิ่งวนตามลวดลายใต้คอ",
      "physicalSignTh": "เกล็ดย้อนใต้คางมีรอยอักขระเต๋าเกิดขึ้นเองตามธรรมชาติ",
      "propertyTags": [
        "NATURAL_RUNE",
        "DAMAGE_REFLECT",
        "TRIBULATION_WARD"
      ],
      "usesTh": "สะท้อนแรงโจมตีและป้องกันสายฟ้าทัณฑ์สวรรค์"
    },
    {
      "id": "MW_ORGAN_010",
      "matId": "MAT_MW_ORGAN_010",
      "nameTh": "ถุงดีทองคำกลืนพิษ",
      "tier": 2,
      "element": "WOOD",
      "anatomyType": "HEART_GALL",
      "mutationChance": 0.08,
      "dissectionDifficulty": 34,
      "auraHintTh": "กินพืชพิษร้ายแรงได้โดยไร้บาดแผล",
      "physicalSignTh": "ถุงน้ำดีมีสีทองอร่ามและกลิ่นหอมเย็น",
      "propertyTags": [
        "TOXIN_DIGEST",
        "PURIFY_PILL",
        "BILE_CATALYST"
      ],
      "usesTh": "ลดพิษโอสถสะสมลงอย่างมากเมื่อใช้เป็นตัวยาเสริม"
    },
    {
      "id": "MW_ORGAN_011",
      "matId": "MAT_MW_ORGAN_011",
      "nameTh": "เส้นเอ็นเงาไร้เสียงพับมิติ",
      "tier": 4,
      "element": "YIN",
      "anatomyType": "TENDON_TAIL",
      "mutationChance": 0.06,
      "dissectionDifficulty": 55,
      "auraHintTh": "จังหวะกระโจนเหมือนหายตัวข้ามระยะสั้นๆ",
      "physicalSignTh": "เส้นเอ็นขาหลังสีดำใสราวกับเงา",
      "propertyTags": [
        "SHADOW_STEP",
        "SILENT_STRIKE",
        "AGILITY_BOOST"
      ],
      "usesTh": "ใช้ทำสายธนูหรือรองเท้าวิชาตัวเบาเร้นเงา"
    },
    {
      "id": "MW_ORGAN_012",
      "matId": "MAT_MW_ORGAN_012",
      "nameTh": "ต่อมแสงชีวภาพล่อวิญญาณ",
      "tier": 2,
      "element": "WATER",
      "anatomyType": "SENSORY_ORGAN",
      "mutationChance": 0.08,
      "dissectionDifficulty": 36,
      "auraHintTh": "เรืองแสงสีฟ้าครามสลับเขียวดึงดูดสัตว์เล็ก",
      "physicalSignTh": "ติ่งเนื้อเรืองแสงมีเส้นประสาทปราณหนาแน่น",
      "propertyTags": [
        "BIOLUMINESCENT",
        "SOUL_LURE",
        "ABYSS_LIGHT"
      ],
      "usesTh": "ใช้ปรุงกำยานล่ออสูรน้ำลึกและโคมส่องค่ายกล"
    },
    {
      "id": "MW_ORGAN_013",
      "matId": "MAT_MW_ORGAN_013",
      "nameTh": "กระดูกอกหลอมรวมหินหนืด",
      "tier": 3,
      "element": "FIRE",
      "anatomyType": "BONE_HORN",
      "mutationChance": 0.07,
      "dissectionDifficulty": 47,
      "auraHintTh": "หน้าอกเปล่งแสงสีส้มแดงดั่งถ่านไฟคุโชน",
      "physicalSignTh": "กระดูกหน้าอกผสานเป็นเนื้อเดียวกับแร่ลาวา",
      "propertyTags": [
        "MAGMA_FUSED",
        "HEAT_SHIELD",
        "HEAVY_GUARD"
      ],
      "usesTh": "ใช้ตีโล่และเกราะอกต้านทานปราณเพลิง"
    },
    {
      "id": "MW_ORGAN_014",
      "matId": "MAT_MW_ORGAN_014",
      "nameTh": "ปีกผลึกบางใสหักเหแสง",
      "tier": 3,
      "element": "WIND",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "mutationChance": 0.07,
      "dissectionDifficulty": 45,
      "auraHintTh": "เมื่อขยับปีกจะเกิดภาพลวงตาซ้อนทับหลายร่าง",
      "physicalSignTh": "แผ่นปีกบางใสราวผลึกแก้วหักเหแสงแดด",
      "propertyTags": [
        "LIGHT_REFRACT",
        "MIRAGE_CLONE",
        "EVASION"
      ],
      "usesTh": "ใช้ทอผ้าคลุมลวงตาและพัดยุทธภัณฑ์"
    },
    {
      "id": "MW_ORGAN_015",
      "matId": "MAT_MW_ORGAN_015",
      "nameTh": "แก่นปราณปรสิตเห็ดหลินจือ",
      "tier": 3,
      "element": "WOOD",
      "anatomyType": "BEAST_CORE",
      "mutationChance": 0.06,
      "dissectionDifficulty": 50,
      "auraHintTh": "มีเส้นใยเห็ดสีม่วงทองงอกประสานกับแก่นอสูรอย่างสมดุล",
      "physicalSignTh": "แก่นอสูรถูกห่อหุ้มด้วยรากเห็ดทิพย์ที่มีชีวิต",
      "propertyTags": [
        "SYMBIOTIC_CORE",
        "LIFE_REGEN",
        "SPORE_IMMUNITY"
      ],
      "usesTh": "ผสานคุณค่าของแก่นอสูรและสมุนไพรทิพย์ในชิ้นเดียว"
    },
    {
      "id": "MW_ORGAN_016",
      "matId": "MAT_MW_ORGAN_016",
      "nameTh": "เขี้ยวกลวงสูบโลหิตบรรพกาล",
      "tier": 4,
      "element": "YIN",
      "anatomyType": "FANG_CLAW",
      "mutationChance": 0.06,
      "dissectionDifficulty": 54,
      "auraHintTh": "รอยกัดทำให้ปราณของผู้ถูกกัดรั่วไหลอย่างรวดเร็ว",
      "physicalSignTh": "ภายในเขี้ยวมีท่อเกลียวดูดกลืนปราณโลหิต",
      "propertyTags": [
        "BLOOD_SIPHON",
        "VAMPIRIC_EDGE",
        "PIERCING"
      ],
      "usesTh": "ใช้ตีศาสตราสายมารอสูรที่ดูดพลังชีวิตศัตรู"
    },
    {
      "id": "MW_ORGAN_017",
      "matId": "MAT_MW_ORGAN_017",
      "nameTh": "ผลึกน้ำตาความทรงจำพันปี",
      "tier": 5,
      "element": "LIGHT",
      "anatomyType": "CRYSTALLIZED_TEAR",
      "mutationChance": 0.04,
      "dissectionDifficulty": 68,
      "auraHintTh": "ดวงตาของอสูรฉายภาพเหตุการณ์โบราณออกมาเป็นระยะ",
      "physicalSignTh": "หางตามีหยดผลึกใสที่กักเก็บเศษเสี้ยวญาณหยั่งรู้",
      "propertyTags": [
        "MEMORY_IMPRINT",
        "DAO_INSIGHT",
        "SPIRIT_CLARITY"
      ],
      "usesTh": "ช่วยเพิ่มความเข้าใจมรรคาและลดเวลาถอดความคัมภีร์โบราณ"
    },
    {
      "id": "MW_ORGAN_018",
      "matId": "MAT_MW_ORGAN_018",
      "nameTh": "ถุงลมลอยฟ้าต้านแรงโน้มถ่วง",
      "tier": 4,
      "element": "WIND",
      "anatomyType": "HEART_GALL",
      "mutationChance": 0.05,
      "dissectionDifficulty": 58,
      "auraHintTh": "ร่างกายขนาดใหญ่กลับลอยตัวเหนือพื้นได้อย่างแผ่วเบา",
      "physicalSignTh": "ถุงลมภายในบรรจุปราณเมฆาที่เบากว่าอากาศ",
      "propertyTags": [
        "ANTI_GRAVITY",
        "FLIGHT_BUOYANCY",
        "CLOUD_QI"
      ],
      "usesTh": "ใช้สร้างแกนลอยฟ้าของค่ายกลและวิชาตัวเบาชั้นสูง"
    },
    {
      "id": "MW_ORGAN_019",
      "matId": "MAT_MW_ORGAN_019",
      "nameTh": "เปลือกกระดองจารึกดาวเหนือ",
      "tier": 5,
      "element": "STAR",
      "anatomyType": "SCALE_CARAPACE",
      "mutationChance": 0.04,
      "dissectionDifficulty": 70,
      "auraHintTh": "ลวดลายบนกระดองเรืองแสงตรงกับตำแหน่งกลุ่มดาวบนฟ้า",
      "physicalSignTh": "ร่องกระดองฝังด้วยละอองแร่อุกกาบาตดารา",
      "propertyTags": [
        "ASTRAL_CHART",
        "FORTUNE_SHIELD",
        "DIVINATION"
      ],
      "usesTh": "ใช้หลอมจานค่ายกลดาราและเกราะสะท้อนเคราะห์กรรม"
    },
    {
      "id": "MW_ORGAN_020",
      "matId": "MAT_MW_ORGAN_020",
      "nameTh": "ต่อมชะมดกลิ่นหอมสยบอสูร",
      "tier": 2,
      "element": "EARTH",
      "anatomyType": "MEAT_EGG_MUSK",
      "mutationChance": 0.08,
      "dissectionDifficulty": 35,
      "auraHintTh": "อสูรระดับต่ำรอบข้างไม่กล้าเข้าใกล้รัศมีกลิ่น",
      "physicalSignTh": "ต่อมกลิ่นใต้ท้องมีกลิ่นหอมลึกคล้ายไม้จันทน์โบราณ",
      "propertyTags": [
        "BEAST_AWE",
        "CALM_MIND",
        "INCENSE_BASE"
      ],
      "usesTh": "ใช้ทำเครื่องหอมสงบจิตมารและเหยื่อฝึกอสูรคู่หู"
    },
    {
      "id": "MW_ORGAN_021",
      "matId": "MAT_MW_ORGAN_021",
      "nameTh": "กะโหลกแก้วสะท้อนเสียงสวรรค์",
      "tier": 4,
      "element": "LIGHT",
      "anatomyType": "BONE_HORN",
      "mutationChance": 0.05,
      "dissectionDifficulty": 60,
      "auraHintTh": "เมื่อปราณปะทะศีรษะจะเกิดเสียงระฆังกังวานขับไล่ความมืด",
      "physicalSignTh": "กระดูกกะโหลกโปร่งแสงดั่งหยกขาวไร้ตำหนิ",
      "propertyTags": [
        "ZEN_BELL",
        "SOUL_GUARD",
        "MIND_RESONANCE"
      ],
      "usesTh": "ใช้สร้างเครื่องรางป้องกันการโจมตีทางจิตและเสียงสะกด"
    },
    {
      "id": "MW_ORGAN_022",
      "matId": "MAT_MW_ORGAN_022",
      "nameTh": "เส้นประสาทรับคลื่นแม่เหล็กธรณี",
      "tier": 3,
      "element": "EARTH",
      "anatomyType": "SENSORY_ORGAN",
      "mutationChance": 0.07,
      "dissectionDifficulty": 46,
      "auraHintTh": "รับรู้การสั่นสะเทือนใต้ดินและตำแหน่งสายแร่ได้แม่นยำ",
      "physicalSignTh": "เส้นประสาทบริเวณหนวดมีเกล็ดแร่แม่เหล็กเกาะเรียงตัว",
      "propertyTags": [
        "ORE_SENSE",
        "EARTH_PULSE",
        "FORMATION_LINK"
      ],
      "usesTh": "ใช้สร้างเข็มทิศค้นหาสายแร่และเชื่อมต่อชีพจรค่ายกลปฐพี"
    },
    {
      "id": "MW_ORGAN_023",
      "matId": "MAT_MW_ORGAN_023",
      "nameTh": "กรงเล็บผลึกน้ำแข็งนิรันดร์",
      "tier": 4,
      "element": "ICE",
      "anatomyType": "FANG_CLAW",
      "mutationChance": 0.06,
      "dissectionDifficulty": 52,
      "auraHintTh": "ทุกย่างก้าวทิ้งรอยน้ำค้างแข็งที่ละลายช้าผิดปกติ",
      "physicalSignTh": "แกนในของกรงเล็บเป็นน้ำแข็งหมื่นปีที่ไม่ละลายด้วยไฟสามัญ",
      "propertyTags": [
        "FROST_BITE",
        "CHILL_MERIDIAN",
        "SHARP_EDGE"
      ],
      "usesTh": "ใช้ตีคมกระบี่เหมันต์ที่แช่แข็งชีพจรคู่ต่อสู้"
    },
    {
      "id": "MW_ORGAN_024",
      "matId": "MAT_MW_ORGAN_024",
      "nameTh": "หัวใจศิลาหลอมปฐพี",
      "tier": 3,
      "element": "EARTH",
      "anatomyType": "HEART_GALL",
      "mutationChance": 0.07,
      "dissectionDifficulty": 44,
      "auraHintTh": "ผิวหนังแข็งแกร่งขึ้นทันทีเมื่อเท้าสัมผัสพื้นหิน",
      "physicalSignTh": "หัวใจเต้นช้าแต่ทรงพลังและมีเปลือกแร่หุ้มบางๆ",
      "propertyTags": [
        "STONE_HEART",
        "DEFENSE_SURGE",
        "STAMINA_CORE"
      ],
      "usesTh": "ใช้ปรุงโอสถเสริมความทนทานกายาและลดความเหนื่อยล้า"
    },
    {
      "id": "MW_ORGAN_025",
      "matId": "MAT_MW_ORGAN_025",
      "nameTh": "ขนนกหงอนเพลิงอมตะแรกแย้ม",
      "tier": 5,
      "element": "FIRE",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "mutationChance": 0.04,
      "dissectionDifficulty": 68,
      "auraHintTh": "บาดแผลของอสูรสมานตัวเองพร้อมเปลวไฟสีทองอ่อนๆ",
      "physicalSignTh": "ขนหงอนเส้นกลางมีไฟชีวิตที่ไม่มีวันดับมอด",
      "propertyTags": [
        "NIRVANA_SPARK",
        "REBIRTH_HEAL",
        "IMMORTAL_FIRE"
      ],
      "usesTh": "วัตถุดิบล้ำค่าสำหรับโอสถชุบชีวิตและพู่กันอัคคีสวรรค์"
    },
    {
      "id": "MW_ORGAN_026",
      "matId": "MAT_MW_ORGAN_026",
      "nameTh": "เมือกทองคำประสานแผลฉับพลัน",
      "tier": 2,
      "element": "WATER",
      "anatomyType": "MEAT_EGG_MUSK",
      "mutationChance": 0.08,
      "dissectionDifficulty": 30,
      "auraHintTh": "บาดแผลตามลำตัวปิดสนิททันทีที่เมือกไหลเคลือบ",
      "physicalSignTh": "ต่อมเมือกพิเศษสีทองใสไร้กลิ่นคาว",
      "propertyTags": [
        "INSTANT_COAGULATE",
        "TISSUE_MEND",
        "SALVE_BASE"
      ],
      "usesTh": "ใช้ทำยาพอกสมานแผลสดและรักษาอาการบาดเจ็บภายใน"
    },
    {
      "id": "MW_ORGAN_027",
      "matId": "MAT_MW_ORGAN_027",
      "nameTh": "หนวดรับมิติว่างเปล่า",
      "tier": 5,
      "element": "VOID",
      "anatomyType": "SENSORY_ORGAN",
      "mutationChance": 0.04,
      "dissectionDifficulty": 72,
      "auraHintTh": "ปลายหนวดสั่นไหวไปตามรอยแยกมิติที่มองไม่เห็น",
      "physicalSignTh": "หนวดคู่หน้ามีสีเงินพร่าเลือนเหมือนไม่ได้อยู่ในมิตินี้เต็มตัว",
      "propertyTags": [
        "VOID_SENSE",
        "SPATIAL_LOCK_RESIST",
        "RIFT_NAVIGATION"
      ],
      "usesTh": "ลดความเสี่ยงในการสำรวจแดนหมื่นภพและต้านทานค่ายกลกักขัง"
    },
    {
      "id": "MW_ORGAN_028",
      "matId": "MAT_MW_ORGAN_028",
      "nameTh": "คราบหยกสมบูรณ์ไร้รอยปริ",
      "tier": 3,
      "element": "WOOD",
      "anatomyType": "SCALE_CARAPACE",
      "mutationChance": 0.07,
      "dissectionDifficulty": 42,
      "auraHintTh": "ผิวเปลือกนอกเงางามดั่งหยกแกะสลักที่เพิ่งลอกคราบ",
      "physicalSignTh": "ชั้นหนังกำพร้าที่ลอกออกมามีความยืดหยุ่นและเก็บปราณครบถ้วน",
      "propertyTags": [
        "JADE_MOLT",
        "PURE_BARRIER",
        "TALISMAN_SKIN"
      ],
      "usesTh": "ใช้ทำแผ่นยันต์หนังหยกและเสื้อคลุมกันพิษ"
    },
    {
      "id": "MW_ORGAN_029",
      "matId": "MAT_MW_ORGAN_029",
      "nameTh": "ต่อมหมึกทมิฬกลืนแสงดาว",
      "tier": 4,
      "element": "YIN",
      "anatomyType": "VENOM_GLAND",
      "mutationChance": 0.06,
      "dissectionDifficulty": 53,
      "auraHintTh": "เมื่อพ่นหมึกออกมาจะดูดกลืนทั้งแสงและสัมผัสวิญญาณ",
      "physicalSignTh": "ถุงหมึกสีดำสนิทที่มีจุดแสงคล้ายดวงดาวจมอยู่ภายใน",
      "propertyTags": [
        "LIGHT_DEVOUR",
        "SENSE_BLIND",
        "SPIRIT_INK"
      ],
      "usesTh": "ใช้ปรุงหมึกจารึกค่ายกลเร้นลับและยันต์พรางกาย"
    },
    {
      "id": "MW_ORGAN_030",
      "matId": "MAT_MW_ORGAN_030",
      "nameTh": "กระดูกสันหลังข้อที่เก้าเชื่อมฟ้า",
      "tier": 5,
      "element": "LIGHTNING",
      "anatomyType": "BONE_HORN",
      "mutationChance": 0.04,
      "dissectionDifficulty": 70,
      "auraHintTh": "สายฟ้าจากฟากฟ้าไหลผ่านแนวสันหลังโดยไม่สร้างบาดแผล",
      "physicalSignTh": "กระดูกข้อที่เก้ามีรูพรุนนำปราณบริสุทธิ์ดั่งทองคำขาว",
      "propertyTags": [
        "HEAVEN_CONDUIT",
        "TRIBULATION_CHANNEL",
        "SUPREME_BONE"
      ],
      "usesTh": "ใช้หลอมแกนศาสตราระดับสูงและโอสถทะลวงด่านใหญ่"
    },
    {
      "id": "MW_ORGAN_031",
      "matId": "MAT_MW_ORGAN_031",
      "nameTh": "ถุงน้ำดีเพลิงพิษสลับขั้ว",
      "tier": 3,
      "element": "FIRE",
      "anatomyType": "HEART_GALL",
      "mutationChance": 0.07,
      "dissectionDifficulty": 46,
      "auraHintTh": "ลมหายใจมีทั้งไอพิษเย็นและเปลวไฟร้อนสลับกัน",
      "physicalSignTh": "ถุงน้ำดีแบ่งเป็นสองซีกที่มีสีแดงชาดและเขียวคราม",
      "propertyTags": [
        "YIN_YANG_TOXIN",
        "THERMAL_SHOCK",
        "ALCHEMICAL_BALANCE"
      ],
      "usesTh": "ช่วยปรับสมดุลสูตรโอสถที่มีฤทธิ์ร้อนเย็นขัดแย้งกัน"
    },
    {
      "id": "MW_ORGAN_032",
      "matId": "MAT_MW_ORGAN_032",
      "nameTh": "ไข่มุกสมุทรดูดซับแรงดัน",
      "tier": 4,
      "element": "WATER",
      "anatomyType": "SPIRIT_PEARL",
      "mutationChance": 0.05,
      "dissectionDifficulty": 58,
      "auraHintTh": "มวลน้ำรอบตัวอสูรหนักอึ้งดั่งขุนเขาแต่ตัวมันเคลื่อนไหวคล่องแคล่ว",
      "physicalSignTh": "ไข่มุกสีครามเข้มที่มีมวลหนาแน่นผิดปกติ",
      "propertyTags": [
        "ABYSS_PRESSURE",
        "HEAVY_WATER",
        "CRUSHING_FORCE"
      ],
      "usesTh": "เพิ่มน้ำหนักทำลายล้างของอาวุธหนักและค่ายกลแรงโน้มถ่วง"
    },
    {
      "id": "MW_ORGAN_033",
      "matId": "MAT_MW_ORGAN_033",
      "nameTh": "รากวิญญาณแฝงร่างอสูรพฤกษา",
      "tier": 4,
      "element": "WOOD",
      "anatomyType": "BEAST_CORE",
      "mutationChance": 0.05,
      "dissectionDifficulty": 56,
      "auraHintTh": "เมื่ออสูรหยุดนิ่ง รากฝอยสีทองจะหยั่งลงดินเพื่อดูดปราณชีพจรโลก",
      "physicalSignTh": "แก่นหัวใจมีรากไม้ทิพย์พันเกี่ยวจนแยกไม่ออก",
      "propertyTags": [
        "EARTH_VEIN_TAP",
        "ENDLESS_VITALITY",
        "WOOD_SPIRIT"
      ],
      "usesTh": "ใช้ปลูกสมุนไพรระดับสูงหรือหลอมโอสถอายุวัฒนะ"
    },
    {
      "id": "MW_ORGAN_034",
      "matId": "MAT_MW_ORGAN_034",
      "nameTh": "เขี้ยวแก้วสั่นพ้องความถี่สูง",
      "tier": 3,
      "element": "WIND",
      "anatomyType": "FANG_CLAW",
      "mutationChance": 0.07,
      "dissectionDifficulty": 45,
      "auraHintTh": "เสียงขบเขี้ยวทำให้หินผารอบข้างแตกร้าวเป็นเสี่ยงๆ",
      "physicalSignTh": "เนื้อเขี้ยวโปร่งใสและสั่นสะเทือนด้วยความถี่สูงตลอดเวลา",
      "propertyTags": [
        "VIBRO_SHATTER",
        "ARMOR_CRACK",
        "SONIC_EDGE"
      ],
      "usesTh": "ใช้ตีมีดสั้นหรือหัวลูกศรที่เจาะเกราะแข็ง"
    },
    {
      "id": "MW_ORGAN_035",
      "matId": "MAT_MW_ORGAN_035",
      "nameTh": "ขนแผงคอทองคำเก็บแสงอรุณ",
      "tier": 4,
      "element": "LIGHT",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "mutationChance": 0.06,
      "dissectionDifficulty": 52,
      "auraHintTh": "แผงคอส่องสว่างเจิดจ้าขับไล่หมอกพิษและไอหยิน",
      "physicalSignTh": "เส้นขนแต่ละเส้นกักเก็บไอสุริยันยามรุ่งอรุณไว้ภายใน",
      "propertyTags": [
        "DAWN_PURIFY",
        "MIASMA_WARD",
        "BRUSH_HAIR"
      ],
      "usesTh": "ใช้ทำพู่กันจารึกยันต์ปราบมารและผ้าคลุมกันหมอกพิษ"
    },
    {
      "id": "MW_ORGAN_036",
      "matId": "MAT_MW_ORGAN_036",
      "nameTh": "เลือดหยกทองคำไม่แข็งตัว",
      "tier": 5,
      "element": "WOOD",
      "anatomyType": "BLOOD",
      "mutationChance": 0.04,
      "dissectionDifficulty": 66,
      "auraHintTh": "แม้บาดเจ็บแต่หยดเลือดที่ไหลออกมากลับเปล่งแสงสีหยกทองและมีกลิ่นหอม",
      "physicalSignTh": "โลหิตหัวใจมีความบริสุทธิ์สูงจนไม่จับตัวเป็นก้อน",
      "propertyTags": [
        "IMMORTAL_BLOOD",
        "MERIDIAN_REBUILD",
        "DIVINE_INK"
      ],
      "usesTh": "สุดยอดตัวยาเชื่อมเส้นชีพจรที่ขาดสะบั้นและหมึกโลหิตเซียน"
    },
    {
      "id": "MW_ORGAN_037",
      "matId": "MAT_MW_ORGAN_037",
      "nameTh": "แผ่นเกราะอกสะท้อนกระบี่จิต",
      "tier": 4,
      "element": "STAR",
      "anatomyType": "SCALE_CARAPACE",
      "mutationChance": 0.05,
      "dissectionDifficulty": 58,
      "auraHintTh": "การโจมตีทางจิตและปราณกระบี่ไร้รูปแฉลบออกเมื่อกระทบหน้าอก",
      "physicalSignTh": "แผ่นกระดูกอกมีโครงสร้างผลึกหกเหลี่ยมซ้อนทับกัน",
      "propertyTags": [
        "MIND_SHIELD",
        "SPELL_DEFLECT",
        "ASTRAL_SHELL"
      ],
      "usesTh": "ใช้ตีเกราะป้องกันวิชาสายจิตวิญญาณและกระบี่ไร้รูป"
    },
    {
      "id": "MW_ORGAN_038",
      "matId": "MAT_MW_ORGAN_038",
      "nameTh": "ต่อมสร้างเถ้าถ่านคืนชีพ",
      "tier": 3,
      "element": "FIRE",
      "anatomyType": "MEAT_EGG_MUSK",
      "mutationChance": 0.07,
      "dissectionDifficulty": 43,
      "auraHintTh": "เมื่อบาดเจ็บจะพ่นเถ้าถ่านร้อนออกมาห่อหุ้มแผลเพื่อเร่งการสร้างเนื้อเยื่อ",
      "physicalSignTh": "ถุงอวัยวะใกล้ปอดเก็บผงเถ้าปราณอัคคีบริสุทธิ์",
      "propertyTags": [
        "ASH_REBIRTH",
        "CAUTERIZE",
        "FORGE_FLUX"
      ],
      "usesTh": "ใช้เป็นผงประสานโลหะในเตาหลอมและยารักษาแผลไฟไหม้"
    },
    {
      "id": "MW_ORGAN_039",
      "matId": "MAT_MW_ORGAN_039",
      "nameTh": "ดวงตาที่สามส่องชีพจรฟ้าดิน",
      "tier": 6,
      "element": "LIGHT",
      "anatomyType": "SENSORY_ORGAN",
      "mutationChance": 0.03,
      "dissectionDifficulty": 78,
      "auraHintTh": "รอยแยกกลางหน้าผากเปิดออกเผยดวงตาสีทองที่มองเห็นกระแสปราณทุกสาย",
      "physicalSignTh": "ดวงตาพิเศษกลางหน้าผากที่เชื่อมต่อกับเส้นประสาทสมองโดยตรง",
      "propertyTags": [
        "HEAVEN_EYE",
        "WEAKNESS_INSIGHT",
        "SUPREME_PERCEPTION"
      ],
      "usesTh": "วัตถุดิบระดับตำนานสำหรับเปิดเนตรวิญญาณและหลอมกระจกส่องภพ"
    },
    {
      "id": "MW_ORGAN_040",
      "matId": "MAT_MW_ORGAN_040",
      "nameTh": "แก่นสุญตากลืนกินคาถา",
      "tier": 6,
      "element": "VOID",
      "anatomyType": "BEAST_CORE",
      "mutationChance": 0.03,
      "dissectionDifficulty": 80,
      "auraHintTh": "ปราณธาตุที่พุ่งเข้าใส่ถูกดูดกลืนหายไปในความว่างเปล่ากลางอก",
      "physicalSignTh": "แก่นอสูรสีดำใสที่ภายในไร้สสารแต่มีแรงดึงดูดมหาศาล",
      "propertyTags": [
        "VOID_ABSORB",
        "NULLIFY_QI",
        "CHAOS_CATALYST"
      ],
      "usesTh": "แก่นวัสดุสูงสุดสำหรับหลอมศาสตราสุญตาและค่ายกลตัดมิติ"
    }
  ],
  "newMaterials": [
    {
      "id": "MAT_MW_ORGAN_001",
      "organId": "MW_ORGAN_001",
      "nameTh": "ต่อมกังวานคู่สะท้อนปราณ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ต่อมกังวานคู่สะท้อนปราณ",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "isRareOrgan": true,
      "tier": 2,
      "element": "WIND",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 112,
      "isTranscendent": false,
      "propertyTags": [
        "RESONANCE",
        "QI_CONDUCT",
        "SOUND_WAVE"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เสียงคำรามมีคลื่นความถี่ซ้อนกันสองชั้น · ลักษณะกายวิภาค: ลำคอป่องนูนสองฝั่ง",
      "futureUsesTh": "เพิ่มอานุภาพวิชาเสียงและลดการใช้ปราณของเครื่องราง"
    },
    {
      "id": "MAT_MW_ORGAN_002",
      "organId": "MW_ORGAN_002",
      "nameTh": "ปมไขกระดูกหลอมอัสนี (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ปมไขกระดูกหลอมอัสนี",
      "category": "BEAST_PART",
      "anatomyType": "MARROW",
      "isRareOrgan": true,
      "tier": 3,
      "element": "LIGHTNING",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "LIGHTNING_TEMPERED",
        "MARROW_STRENGTH",
        "CONDUCTIVE"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ประกายไฟสีครามแลบตามข้อต่อยามเคลื่อนไหว · ลักษณะกายวิภาค: กระดูกสันหลังมีปมผลึกสีม่วงคราม",
      "futureUsesTh": "ใช้ชุบศาสตราสายฟ้าหรือหลอมโอสถเสริมกระดูกอสนี"
    },
    {
      "id": "MAT_MW_ORGAN_003",
      "organId": "MW_ORGAN_003",
      "nameTh": "เยื่อตาจันทร์กระจกเงา (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เยื่อตาจันทร์กระจกเงา",
      "category": "BEAST_PART",
      "anatomyType": "SENSORY_ORGAN",
      "isRareOrgan": true,
      "tier": 3,
      "element": "ICE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "MOON_REFLECT",
        "ILLUSION_PIERCE",
        "NIGHT_VISION"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ดวงตาสะท้อนแสงจันทร์เป็นวงแหวนสีเงินแม้ในที่มืดสนิท · ลักษณะกายวิภาค: ม่านตาซ้อนกันสองชั้นดั่งกระจกหยก",
      "futureUsesTh": "ทะลวงภาพมายาและเพิ่มความแม่นยำของกระบี่จิต"
    },
    {
      "id": "MAT_MW_ORGAN_004",
      "organId": "MW_ORGAN_004",
      "nameTh": "หน่อเขาบรรพกาลคืนสายเลือด (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "หน่อเขาบรรพกาลคืนสายเลือด",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "isRareOrgan": true,
      "tier": 4,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "ANCESTRAL_BLOOD",
        "ARMOR_PIERCE",
        "ROYAL_AURA"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ปราณกดดันโบราณแผ่ออกจากหน้าผากเหนือเขาปกติ · ลักษณะกายวิภาค: มีหน่อเขาสีทองหม่นงอกแทรกกลางกระหม่อม",
      "futureUsesTh": "ใช้ตีหัวทวนทะลวงเกราะหรือปรุงโอสถปลุกสายเลือด"
    },
    {
      "id": "MAT_MW_ORGAN_005",
      "organId": "MW_ORGAN_005",
      "nameTh": "ไข่มุกวิญญาณแฝดเก้าวัฏจักร (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ไข่มุกวิญญาณแฝดเก้าวัฏจักร",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_PEARL",
      "isRareOrgan": true,
      "tier": 4,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "TWIN_CORE",
        "QI_RESERVOIR",
        "WATER_AFFINITY"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "กระแสน้ำรอบตัวอสูรหมุนวนเป็นรูปหยินหยาง · ลักษณะกายวิภาค: ภายในช่องท้องมีแสงมุกสองดวงโคจรรอบกัน",
      "futureUsesTh": "ขยายความจุปราณสูงสุดและใช้เป็นแกนค่ายกลระดับสูง"
    },
    {
      "id": "MAT_MW_ORGAN_006",
      "organId": "MW_ORGAN_006",
      "nameTh": "ถุงพิษผลึกเจ็ดสีกลายพันธุ์ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ถุงพิษผลึกเจ็ดสีกลายพันธุ์",
      "category": "BEAST_PART",
      "anatomyType": "VENOM_GLAND",
      "isRareOrgan": true,
      "tier": 3,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "CRYSTAL_VENOM",
        "CORROSIVE",
        "ANTIDOTE_CATALYST"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ไอพิษที่พ่นออกมามีเกล็ดผลึกแวววาวไม่สลายตามลม · ลักษณะกายวิภาค: ถุงพิษใต้เขี้ยวแข็งตัวเป็นก้อนผลึกเจ็ดสี",
      "futureUsesTh": "ใช้สกัดพิษกู่ชั้นสูงหรือใช้เป็นตัวเร่งโอสถถอนพิษร้อยชนิด"
    },
    {
      "id": "MAT_MW_ORGAN_007",
      "organId": "MW_ORGAN_007",
      "nameTh": "หัวใจเพลิงสุริยันสองห้องซ้อน (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "หัวใจเพลิงสุริยันสองห้องซ้อน",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "isRareOrgan": true,
      "tier": 4,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "DUAL_PULSE",
        "SOLAR_FLAME",
        "VITALITY_SURGE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ไอร้อนรอบกายระอุเป็นจังหวะชีพจรคู่ · ลักษณะกายวิภาค: หัวใจมีห้องสูบฉีดปราณเพลิงแยกต่างหากอีกชั้น",
      "futureUsesTh": "เร่งไฟเตาหลอมและเพิ่มพลังฟื้นฟูชีวิตในโอสถหลอมกายา"
    },
    {
      "id": "MAT_MW_ORGAN_008",
      "organId": "MW_ORGAN_008",
      "nameTh": "ต่อมไหมเหล็กไหลดารา (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ต่อมไหมเหล็กไหลดารา",
      "category": "BEAST_PART",
      "anatomyType": "SILK_SAC",
      "isRareOrgan": true,
      "tier": 3,
      "element": "METAL",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "METALLIC_SILK",
        "TENSILE_TOUGH",
        "TRAP_MEDIA"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เส้นใยที่พ่นออกมามีเสียงโลหะกระทบกัน · ลักษณะกายวิภาค: ต่อมชักใยมีประกายแร่เหล็กไหลเงินยวง",
      "futureUsesTh": "ใช้ถักทอเสื้อเกราะอ่อนไร้รอยต่อและสายพิณศึก"
    },
    {
      "id": "MAT_MW_ORGAN_009",
      "organId": "MW_ORGAN_009",
      "nameTh": "เกล็ดย้อนสลักอักขระธรรมชาติ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เกล็ดย้อนสลักอักขระธรรมชาติ",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "isRareOrgan": true,
      "tier": 4,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "NATURAL_RUNE",
        "DAMAGE_REFLECT",
        "TRIBULATION_WARD"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "สายฟ้ารอบตัววิ่งวนตามลวดลายใต้คอ · ลักษณะกายวิภาค: เกล็ดย้อนใต้คางมีรอยอักขระเต๋าเกิดขึ้นเองตามธรรมชาติ",
      "futureUsesTh": "สะท้อนแรงโจมตีและป้องกันสายฟ้าทัณฑ์สวรรค์"
    },
    {
      "id": "MAT_MW_ORGAN_010",
      "organId": "MW_ORGAN_010",
      "nameTh": "ถุงดีทองคำกลืนพิษ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ถุงดีทองคำกลืนพิษ",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "isRareOrgan": true,
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 112,
      "isTranscendent": false,
      "propertyTags": [
        "TOXIN_DIGEST",
        "PURIFY_PILL",
        "BILE_CATALYST"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "กินพืชพิษร้ายแรงได้โดยไร้บาดแผล · ลักษณะกายวิภาค: ถุงน้ำดีมีสีทองอร่ามและกลิ่นหอมเย็น",
      "futureUsesTh": "ลดพิษโอสถสะสมลงอย่างมากเมื่อใช้เป็นตัวยาเสริม"
    },
    {
      "id": "MAT_MW_ORGAN_011",
      "organId": "MW_ORGAN_011",
      "nameTh": "เส้นเอ็นเงาไร้เสียงพับมิติ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เส้นเอ็นเงาไร้เสียงพับมิติ",
      "category": "BEAST_PART",
      "anatomyType": "TENDON_TAIL",
      "isRareOrgan": true,
      "tier": 4,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "SHADOW_STEP",
        "SILENT_STRIKE",
        "AGILITY_BOOST"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "จังหวะกระโจนเหมือนหายตัวข้ามระยะสั้นๆ · ลักษณะกายวิภาค: เส้นเอ็นขาหลังสีดำใสราวกับเงา",
      "futureUsesTh": "ใช้ทำสายธนูหรือรองเท้าวิชาตัวเบาเร้นเงา"
    },
    {
      "id": "MAT_MW_ORGAN_012",
      "organId": "MW_ORGAN_012",
      "nameTh": "ต่อมแสงชีวภาพล่อวิญญาณ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ต่อมแสงชีวภาพล่อวิญญาณ",
      "category": "BEAST_PART",
      "anatomyType": "SENSORY_ORGAN",
      "isRareOrgan": true,
      "tier": 2,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 112,
      "isTranscendent": false,
      "propertyTags": [
        "BIOLUMINESCENT",
        "SOUL_LURE",
        "ABYSS_LIGHT"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เรืองแสงสีฟ้าครามสลับเขียวดึงดูดสัตว์เล็ก · ลักษณะกายวิภาค: ติ่งเนื้อเรืองแสงมีเส้นประสาทปราณหนาแน่น",
      "futureUsesTh": "ใช้ปรุงกำยานล่ออสูรน้ำลึกและโคมส่องค่ายกล"
    },
    {
      "id": "MAT_MW_ORGAN_013",
      "organId": "MW_ORGAN_013",
      "nameTh": "กระดูกอกหลอมรวมหินหนืด (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "กระดูกอกหลอมรวมหินหนืด",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "isRareOrgan": true,
      "tier": 3,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "MAGMA_FUSED",
        "HEAT_SHIELD",
        "HEAVY_GUARD"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "หน้าอกเปล่งแสงสีส้มแดงดั่งถ่านไฟคุโชน · ลักษณะกายวิภาค: กระดูกหน้าอกผสานเป็นเนื้อเดียวกับแร่ลาวา",
      "futureUsesTh": "ใช้ตีโล่และเกราะอกต้านทานปราณเพลิง"
    },
    {
      "id": "MAT_MW_ORGAN_014",
      "organId": "MW_ORGAN_014",
      "nameTh": "ปีกผลึกบางใสหักเหแสง (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ปีกผลึกบางใสหักเหแสง",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "isRareOrgan": true,
      "tier": 3,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "LIGHT_REFRACT",
        "MIRAGE_CLONE",
        "EVASION"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เมื่อขยับปีกจะเกิดภาพลวงตาซ้อนทับหลายร่าง · ลักษณะกายวิภาค: แผ่นปีกบางใสราวผลึกแก้วหักเหแสงแดด",
      "futureUsesTh": "ใช้ทอผ้าคลุมลวงตาและพัดยุทธภัณฑ์"
    },
    {
      "id": "MAT_MW_ORGAN_015",
      "organId": "MW_ORGAN_015",
      "nameTh": "แก่นปราณปรสิตเห็ดหลินจือ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "แก่นปราณปรสิตเห็ดหลินจือ",
      "category": "BEAST_PART",
      "anatomyType": "BEAST_CORE",
      "isRareOrgan": true,
      "tier": 3,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "SYMBIOTIC_CORE",
        "LIFE_REGEN",
        "SPORE_IMMUNITY"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "มีเส้นใยเห็ดสีม่วงทองงอกประสานกับแก่นอสูรอย่างสมดุล · ลักษณะกายวิภาค: แก่นอสูรถูกห่อหุ้มด้วยรากเห็ดทิพย์ที่มีชีวิต",
      "futureUsesTh": "ผสานคุณค่าของแก่นอสูรและสมุนไพรทิพย์ในชิ้นเดียว"
    },
    {
      "id": "MAT_MW_ORGAN_016",
      "organId": "MW_ORGAN_016",
      "nameTh": "เขี้ยวกลวงสูบโลหิตบรรพกาล (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เขี้ยวกลวงสูบโลหิตบรรพกาล",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "isRareOrgan": true,
      "tier": 4,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "BLOOD_SIPHON",
        "VAMPIRIC_EDGE",
        "PIERCING"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "รอยกัดทำให้ปราณของผู้ถูกกัดรั่วไหลอย่างรวดเร็ว · ลักษณะกายวิภาค: ภายในเขี้ยวมีท่อเกลียวดูดกลืนปราณโลหิต",
      "futureUsesTh": "ใช้ตีศาสตราสายมารอสูรที่ดูดพลังชีวิตศัตรู"
    },
    {
      "id": "MAT_MW_ORGAN_017",
      "organId": "MW_ORGAN_017",
      "nameTh": "ผลึกน้ำตาความทรงจำพันปี (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ผลึกน้ำตาความทรงจำพันปี",
      "category": "BEAST_PART",
      "anatomyType": "CRYSTALLIZED_TEAR",
      "isRareOrgan": true,
      "tier": 5,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 700,
      "isTranscendent": false,
      "propertyTags": [
        "MEMORY_IMPRINT",
        "DAO_INSIGHT",
        "SPIRIT_CLARITY"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ดวงตาของอสูรฉายภาพเหตุการณ์โบราณออกมาเป็นระยะ · ลักษณะกายวิภาค: หางตามีหยดผลึกใสที่กักเก็บเศษเสี้ยวญาณหยั่งรู้",
      "futureUsesTh": "ช่วยเพิ่มความเข้าใจมรรคาและลดเวลาถอดความคัมภีร์โบราณ"
    },
    {
      "id": "MAT_MW_ORGAN_018",
      "organId": "MW_ORGAN_018",
      "nameTh": "ถุงลมลอยฟ้าต้านแรงโน้มถ่วง (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ถุงลมลอยฟ้าต้านแรงโน้มถ่วง",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "isRareOrgan": true,
      "tier": 4,
      "element": "WIND",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "ANTI_GRAVITY",
        "FLIGHT_BUOYANCY",
        "CLOUD_QI"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ร่างกายขนาดใหญ่กลับลอยตัวเหนือพื้นได้อย่างแผ่วเบา · ลักษณะกายวิภาค: ถุงลมภายในบรรจุปราณเมฆาที่เบากว่าอากาศ",
      "futureUsesTh": "ใช้สร้างแกนลอยฟ้าของค่ายกลและวิชาตัวเบาชั้นสูง"
    },
    {
      "id": "MAT_MW_ORGAN_019",
      "organId": "MW_ORGAN_019",
      "nameTh": "เปลือกกระดองจารึกดาวเหนือ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เปลือกกระดองจารึกดาวเหนือ",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "isRareOrgan": true,
      "tier": 5,
      "element": "STAR",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 700,
      "isTranscendent": false,
      "propertyTags": [
        "ASTRAL_CHART",
        "FORTUNE_SHIELD",
        "DIVINATION"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ลวดลายบนกระดองเรืองแสงตรงกับตำแหน่งกลุ่มดาวบนฟ้า · ลักษณะกายวิภาค: ร่องกระดองฝังด้วยละอองแร่อุกกาบาตดารา",
      "futureUsesTh": "ใช้หลอมจานค่ายกลดาราและเกราะสะท้อนเคราะห์กรรม"
    },
    {
      "id": "MAT_MW_ORGAN_020",
      "organId": "MW_ORGAN_020",
      "nameTh": "ต่อมชะมดกลิ่นหอมสยบอสูร (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ต่อมชะมดกลิ่นหอมสยบอสูร",
      "category": "BEAST_PART",
      "anatomyType": "MEAT_EGG_MUSK",
      "isRareOrgan": true,
      "tier": 2,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 112,
      "isTranscendent": false,
      "propertyTags": [
        "BEAST_AWE",
        "CALM_MIND",
        "INCENSE_BASE"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "อสูรระดับต่ำรอบข้างไม่กล้าเข้าใกล้รัศมีกลิ่น · ลักษณะกายวิภาค: ต่อมกลิ่นใต้ท้องมีกลิ่นหอมลึกคล้ายไม้จันทน์โบราณ",
      "futureUsesTh": "ใช้ทำเครื่องหอมสงบจิตมารและเหยื่อฝึกอสูรคู่หู"
    },
    {
      "id": "MAT_MW_ORGAN_021",
      "organId": "MW_ORGAN_021",
      "nameTh": "กะโหลกแก้วสะท้อนเสียงสวรรค์ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "กะโหลกแก้วสะท้อนเสียงสวรรค์",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "isRareOrgan": true,
      "tier": 4,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "ZEN_BELL",
        "SOUL_GUARD",
        "MIND_RESONANCE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เมื่อปราณปะทะศีรษะจะเกิดเสียงระฆังกังวานขับไล่ความมืด · ลักษณะกายวิภาค: กระดูกกะโหลกโปร่งแสงดั่งหยกขาวไร้ตำหนิ",
      "futureUsesTh": "ใช้สร้างเครื่องรางป้องกันการโจมตีทางจิตและเสียงสะกด"
    },
    {
      "id": "MAT_MW_ORGAN_022",
      "organId": "MW_ORGAN_022",
      "nameTh": "เส้นประสาทรับคลื่นแม่เหล็กธรณี (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เส้นประสาทรับคลื่นแม่เหล็กธรณี",
      "category": "BEAST_PART",
      "anatomyType": "SENSORY_ORGAN",
      "isRareOrgan": true,
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "ORE_SENSE",
        "EARTH_PULSE",
        "FORMATION_LINK"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "รับรู้การสั่นสะเทือนใต้ดินและตำแหน่งสายแร่ได้แม่นยำ · ลักษณะกายวิภาค: เส้นประสาทบริเวณหนวดมีเกล็ดแร่แม่เหล็กเกาะเรียงตัว",
      "futureUsesTh": "ใช้สร้างเข็มทิศค้นหาสายแร่และเชื่อมต่อชีพจรค่ายกลปฐพี"
    },
    {
      "id": "MAT_MW_ORGAN_023",
      "organId": "MW_ORGAN_023",
      "nameTh": "กรงเล็บผลึกน้ำแข็งนิรันดร์ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "กรงเล็บผลึกน้ำแข็งนิรันดร์",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "isRareOrgan": true,
      "tier": 4,
      "element": "ICE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "FROST_BITE",
        "CHILL_MERIDIAN",
        "SHARP_EDGE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ทุกย่างก้าวทิ้งรอยน้ำค้างแข็งที่ละลายช้าผิดปกติ · ลักษณะกายวิภาค: แกนในของกรงเล็บเป็นน้ำแข็งหมื่นปีที่ไม่ละลายด้วยไฟสามัญ",
      "futureUsesTh": "ใช้ตีคมกระบี่เหมันต์ที่แช่แข็งชีพจรคู่ต่อสู้"
    },
    {
      "id": "MAT_MW_ORGAN_024",
      "organId": "MW_ORGAN_024",
      "nameTh": "หัวใจศิลาหลอมปฐพี (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "หัวใจศิลาหลอมปฐพี",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "isRareOrgan": true,
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "STONE_HEART",
        "DEFENSE_SURGE",
        "STAMINA_CORE"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ผิวหนังแข็งแกร่งขึ้นทันทีเมื่อเท้าสัมผัสพื้นหิน · ลักษณะกายวิภาค: หัวใจเต้นช้าแต่ทรงพลังและมีเปลือกแร่หุ้มบางๆ",
      "futureUsesTh": "ใช้ปรุงโอสถเสริมความทนทานกายาและลดความเหนื่อยล้า"
    },
    {
      "id": "MAT_MW_ORGAN_025",
      "organId": "MW_ORGAN_025",
      "nameTh": "ขนนกหงอนเพลิงอมตะแรกแย้ม (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ขนนกหงอนเพลิงอมตะแรกแย้ม",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "isRareOrgan": true,
      "tier": 5,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 700,
      "isTranscendent": false,
      "propertyTags": [
        "NIRVANA_SPARK",
        "REBIRTH_HEAL",
        "IMMORTAL_FIRE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "บาดแผลของอสูรสมานตัวเองพร้อมเปลวไฟสีทองอ่อนๆ · ลักษณะกายวิภาค: ขนหงอนเส้นกลางมีไฟชีวิตที่ไม่มีวันดับมอด",
      "futureUsesTh": "วัตถุดิบล้ำค่าสำหรับโอสถชุบชีวิตและพู่กันอัคคีสวรรค์"
    },
    {
      "id": "MAT_MW_ORGAN_026",
      "organId": "MW_ORGAN_026",
      "nameTh": "เมือกทองคำประสานแผลฉับพลัน (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เมือกทองคำประสานแผลฉับพลัน",
      "category": "BEAST_PART",
      "anatomyType": "MEAT_EGG_MUSK",
      "isRareOrgan": true,
      "tier": 2,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 112,
      "isTranscendent": false,
      "propertyTags": [
        "INSTANT_COAGULATE",
        "TISSUE_MEND",
        "SALVE_BASE"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "บาดแผลตามลำตัวปิดสนิททันทีที่เมือกไหลเคลือบ · ลักษณะกายวิภาค: ต่อมเมือกพิเศษสีทองใสไร้กลิ่นคาว",
      "futureUsesTh": "ใช้ทำยาพอกสมานแผลสดและรักษาอาการบาดเจ็บภายใน"
    },
    {
      "id": "MAT_MW_ORGAN_027",
      "organId": "MW_ORGAN_027",
      "nameTh": "หนวดรับมิติว่างเปล่า (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "หนวดรับมิติว่างเปล่า",
      "category": "BEAST_PART",
      "anatomyType": "SENSORY_ORGAN",
      "isRareOrgan": true,
      "tier": 5,
      "element": "VOID",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 700,
      "isTranscendent": false,
      "propertyTags": [
        "VOID_SENSE",
        "SPATIAL_LOCK_RESIST",
        "RIFT_NAVIGATION"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ปลายหนวดสั่นไหวไปตามรอยแยกมิติที่มองไม่เห็น · ลักษณะกายวิภาค: หนวดคู่หน้ามีสีเงินพร่าเลือนเหมือนไม่ได้อยู่ในมิตินี้เต็มตัว",
      "futureUsesTh": "ลดความเสี่ยงในการสำรวจแดนหมื่นภพและต้านทานค่ายกลกักขัง"
    },
    {
      "id": "MAT_MW_ORGAN_028",
      "organId": "MW_ORGAN_028",
      "nameTh": "คราบหยกสมบูรณ์ไร้รอยปริ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "คราบหยกสมบูรณ์ไร้รอยปริ",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "isRareOrgan": true,
      "tier": 3,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "JADE_MOLT",
        "PURE_BARRIER",
        "TALISMAN_SKIN"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ผิวเปลือกนอกเงางามดั่งหยกแกะสลักที่เพิ่งลอกคราบ · ลักษณะกายวิภาค: ชั้นหนังกำพร้าที่ลอกออกมามีความยืดหยุ่นและเก็บปราณครบถ้วน",
      "futureUsesTh": "ใช้ทำแผ่นยันต์หนังหยกและเสื้อคลุมกันพิษ"
    },
    {
      "id": "MAT_MW_ORGAN_029",
      "organId": "MW_ORGAN_029",
      "nameTh": "ต่อมหมึกทมิฬกลืนแสงดาว (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ต่อมหมึกทมิฬกลืนแสงดาว",
      "category": "BEAST_PART",
      "anatomyType": "VENOM_GLAND",
      "isRareOrgan": true,
      "tier": 4,
      "element": "YIN",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "LIGHT_DEVOUR",
        "SENSE_BLIND",
        "SPIRIT_INK"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เมื่อพ่นหมึกออกมาจะดูดกลืนทั้งแสงและสัมผัสวิญญาณ · ลักษณะกายวิภาค: ถุงหมึกสีดำสนิทที่มีจุดแสงคล้ายดวงดาวจมอยู่ภายใน",
      "futureUsesTh": "ใช้ปรุงหมึกจารึกค่ายกลเร้นลับและยันต์พรางกาย"
    },
    {
      "id": "MAT_MW_ORGAN_030",
      "organId": "MW_ORGAN_030",
      "nameTh": "กระดูกสันหลังข้อที่เก้าเชื่อมฟ้า (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "กระดูกสันหลังข้อที่เก้าเชื่อมฟ้า",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "isRareOrgan": true,
      "tier": 5,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 700,
      "isTranscendent": false,
      "propertyTags": [
        "HEAVEN_CONDUIT",
        "TRIBULATION_CHANNEL",
        "SUPREME_BONE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "สายฟ้าจากฟากฟ้าไหลผ่านแนวสันหลังโดยไม่สร้างบาดแผล · ลักษณะกายวิภาค: กระดูกข้อที่เก้ามีรูพรุนนำปราณบริสุทธิ์ดั่งทองคำขาว",
      "futureUsesTh": "ใช้หลอมแกนศาสตราระดับสูงและโอสถทะลวงด่านใหญ่"
    },
    {
      "id": "MAT_MW_ORGAN_031",
      "organId": "MW_ORGAN_031",
      "nameTh": "ถุงน้ำดีเพลิงพิษสลับขั้ว (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ถุงน้ำดีเพลิงพิษสลับขั้ว",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "isRareOrgan": true,
      "tier": 3,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "YIN_YANG_TOXIN",
        "THERMAL_SHOCK",
        "ALCHEMICAL_BALANCE"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ลมหายใจมีทั้งไอพิษเย็นและเปลวไฟร้อนสลับกัน · ลักษณะกายวิภาค: ถุงน้ำดีแบ่งเป็นสองซีกที่มีสีแดงชาดและเขียวคราม",
      "futureUsesTh": "ช่วยปรับสมดุลสูตรโอสถที่มีฤทธิ์ร้อนเย็นขัดแย้งกัน"
    },
    {
      "id": "MAT_MW_ORGAN_032",
      "organId": "MW_ORGAN_032",
      "nameTh": "ไข่มุกสมุทรดูดซับแรงดัน (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ไข่มุกสมุทรดูดซับแรงดัน",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_PEARL",
      "isRareOrgan": true,
      "tier": 4,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "ABYSS_PRESSURE",
        "HEAVY_WATER",
        "CRUSHING_FORCE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "มวลน้ำรอบตัวอสูรหนักอึ้งดั่งขุนเขาแต่ตัวมันเคลื่อนไหวคล่องแคล่ว · ลักษณะกายวิภาค: ไข่มุกสีครามเข้มที่มีมวลหนาแน่นผิดปกติ",
      "futureUsesTh": "เพิ่มน้ำหนักทำลายล้างของอาวุธหนักและค่ายกลแรงโน้มถ่วง"
    },
    {
      "id": "MAT_MW_ORGAN_033",
      "organId": "MW_ORGAN_033",
      "nameTh": "รากวิญญาณแฝงร่างอสูรพฤกษา (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "รากวิญญาณแฝงร่างอสูรพฤกษา",
      "category": "BEAST_PART",
      "anatomyType": "BEAST_CORE",
      "isRareOrgan": true,
      "tier": 4,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "EARTH_VEIN_TAP",
        "ENDLESS_VITALITY",
        "WOOD_SPIRIT"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เมื่ออสูรหยุดนิ่ง รากฝอยสีทองจะหยั่งลงดินเพื่อดูดปราณชีพจรโลก · ลักษณะกายวิภาค: แก่นหัวใจมีรากไม้ทิพย์พันเกี่ยวจนแยกไม่ออก",
      "futureUsesTh": "ใช้ปลูกสมุนไพรระดับสูงหรือหลอมโอสถอายุวัฒนะ"
    },
    {
      "id": "MAT_MW_ORGAN_034",
      "organId": "MW_ORGAN_034",
      "nameTh": "เขี้ยวแก้วสั่นพ้องความถี่สูง (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เขี้ยวแก้วสั่นพ้องความถี่สูง",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "isRareOrgan": true,
      "tier": 3,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "VIBRO_SHATTER",
        "ARMOR_CRACK",
        "SONIC_EDGE"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เสียงขบเขี้ยวทำให้หินผารอบข้างแตกร้าวเป็นเสี่ยงๆ · ลักษณะกายวิภาค: เนื้อเขี้ยวโปร่งใสและสั่นสะเทือนด้วยความถี่สูงตลอดเวลา",
      "futureUsesTh": "ใช้ตีมีดสั้นหรือหัวลูกศรที่เจาะเกราะแข็ง"
    },
    {
      "id": "MAT_MW_ORGAN_035",
      "organId": "MW_ORGAN_035",
      "nameTh": "ขนแผงคอทองคำเก็บแสงอรุณ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ขนแผงคอทองคำเก็บแสงอรุณ",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "isRareOrgan": true,
      "tier": 4,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "DAWN_PURIFY",
        "MIASMA_WARD",
        "BRUSH_HAIR"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "แผงคอส่องสว่างเจิดจ้าขับไล่หมอกพิษและไอหยิน · ลักษณะกายวิภาค: เส้นขนแต่ละเส้นกักเก็บไอสุริยันยามรุ่งอรุณไว้ภายใน",
      "futureUsesTh": "ใช้ทำพู่กันจารึกยันต์ปราบมารและผ้าคลุมกันหมอกพิษ"
    },
    {
      "id": "MAT_MW_ORGAN_036",
      "organId": "MW_ORGAN_036",
      "nameTh": "เลือดหยกทองคำไม่แข็งตัว (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "เลือดหยกทองคำไม่แข็งตัว",
      "category": "BEAST_PART",
      "anatomyType": "BLOOD",
      "isRareOrgan": true,
      "tier": 5,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 700,
      "isTranscendent": false,
      "propertyTags": [
        "IMMORTAL_BLOOD",
        "MERIDIAN_REBUILD",
        "DIVINE_INK"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "แม้บาดเจ็บแต่หยดเลือดที่ไหลออกมากลับเปล่งแสงสีหยกทองและมีกลิ่นหอม · ลักษณะกายวิภาค: โลหิตหัวใจมีความบริสุทธิ์สูงจนไม่จับตัวเป็นก้อน",
      "futureUsesTh": "สุดยอดตัวยาเชื่อมเส้นชีพจรที่ขาดสะบั้นและหมึกโลหิตเซียน"
    },
    {
      "id": "MAT_MW_ORGAN_037",
      "organId": "MW_ORGAN_037",
      "nameTh": "แผ่นเกราะอกสะท้อนกระบี่จิต (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "แผ่นเกราะอกสะท้อนกระบี่จิต",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "isRareOrgan": true,
      "tier": 4,
      "element": "STAR",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 448,
      "isTranscendent": false,
      "propertyTags": [
        "MIND_SHIELD",
        "SPELL_DEFLECT",
        "ASTRAL_SHELL"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "การโจมตีทางจิตและปราณกระบี่ไร้รูปแฉลบออกเมื่อกระทบหน้าอก · ลักษณะกายวิภาค: แผ่นกระดูกอกมีโครงสร้างผลึกหกเหลี่ยมซ้อนทับกัน",
      "futureUsesTh": "ใช้ตีเกราะป้องกันวิชาสายจิตวิญญาณและกระบี่ไร้รูป"
    },
    {
      "id": "MAT_MW_ORGAN_038",
      "organId": "MW_ORGAN_038",
      "nameTh": "ต่อมสร้างเถ้าถ่านคืนชีพ (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ต่อมสร้างเถ้าถ่านคืนชีพ",
      "category": "BEAST_PART",
      "anatomyType": "MEAT_EGG_MUSK",
      "isRareOrgan": true,
      "tier": 3,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 252,
      "isTranscendent": false,
      "propertyTags": [
        "ASH_REBIRTH",
        "CAUTERIZE",
        "FORGE_FLUX"
      ],
      "preservationRule": "SEALED_POUCH",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "เมื่อบาดเจ็บจะพ่นเถ้าถ่านร้อนออกมาห่อหุ้มแผลเพื่อเร่งการสร้างเนื้อเยื่อ · ลักษณะกายวิภาค: ถุงอวัยวะใกล้ปอดเก็บผงเถ้าปราณอัคคีบริสุทธิ์",
      "futureUsesTh": "ใช้เป็นผงประสานโลหะในเตาหลอมและยารักษาแผลไฟไหม้"
    },
    {
      "id": "MAT_MW_ORGAN_039",
      "organId": "MW_ORGAN_039",
      "nameTh": "ดวงตาที่สามส่องชีพจรฟ้าดิน (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "ดวงตาที่สามส่องชีพจรฟ้าดิน",
      "category": "BEAST_PART",
      "anatomyType": "SENSORY_ORGAN",
      "isRareOrgan": true,
      "tier": 6,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 1008,
      "isTranscendent": true,
      "propertyTags": [
        "HEAVEN_EYE",
        "WEAKNESS_INSIGHT",
        "SUPREME_PERCEPTION"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "รอยแยกกลางหน้าผากเปิดออกเผยดวงตาสีทองที่มองเห็นกระแสปราณทุกสาย · ลักษณะกายวิภาค: ดวงตาพิเศษกลางหน้าผากที่เชื่อมต่อกับเส้นประสาทสมองโดยตรง",
      "futureUsesTh": "วัตถุดิบระดับตำนานสำหรับเปิดเนตรวิญญาณและหลอมกระจกส่องภพ"
    },
    {
      "id": "MAT_MW_ORGAN_040",
      "organId": "MW_ORGAN_040",
      "nameTh": "แก่นสุญตากลืนกินคาถา (อวัยวะกลายพันธุ์หายาก)",
      "shortNameTh": "แก่นสุญตากลืนกินคาถา",
      "category": "BEAST_PART",
      "anatomyType": "BEAST_CORE",
      "isRareOrgan": true,
      "tier": 6,
      "element": "VOID",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 1008,
      "isTranscendent": true,
      "propertyTags": [
        "VOID_ABSORB",
        "NULLIFY_QI",
        "CHAOS_CATALYST"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "อวัยวะพิเศษและชิ้นส่วนกลายพันธุ์เฉพาะตัว",
      "propertiesTh": "ปราณธาตุที่พุ่งเข้าใส่ถูกดูดกลืนหายไปในความว่างเปล่ากลางอก · ลักษณะกายวิภาค: แก่นอสูรสีดำใสที่ภายในไร้สสารแต่มีแรงดึงดูดมหาศาล",
      "futureUsesTh": "แก่นวัสดุสูงสุดสำหรับหลอมศาสตราสุญตาและค่ายกลตัดมิติ"
    },
    {
      "id": "MW_MAT_HERB_001",
      "nameTh": "รากโสมหมอกม่วงซ่อนปราณ",
      "category": "HERB",
      "plantForm": "ROOT",
      "tier": 1,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "forest",
      "toxicity": 1,
      "baseValueStones": 26,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์รากโสมหมอกม่วงซ่อนปราณ",
      "regenPerSeason": 10,
      "isTranscendent": false,
      "propertyTags": [
        "QI_GATHER",
        "GENTLE_WARM",
        "ROOT_ESSENCE"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (ROOT) · ระดับ 1",
      "propertiesTh": "รากฝอยสีม่วงอ่อนที่ดูดซับน้ำค้างใต้ร่มไม้ใหญ่ มีฤทธิ์อุ่นอ่อนๆ ประสานลมปราณ",
      "futureUsesTh": "ปรุงโอสถรวบรวมปราณขั้นต้นและน้ำแกงบำรุงกำลัง"
    },
    {
      "id": "MW_MAT_HERB_002",
      "nameTh": "มอสหยกเรืองแสงถ้ำลึก",
      "category": "HERB",
      "plantForm": "MOSS",
      "tier": 1,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "toxicity": 0,
      "baseValueStones": 26,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์มอสหยกเรืองแสงถ้ำลึก",
      "regenPerSeason": 10,
      "isTranscendent": false,
      "propertyTags": [
        "COOLING",
        "HEAL_FLESH",
        "BIOLUMINESCENT"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (MOSS) · ระดับ 1",
      "propertiesTh": "แผ่นมอสสีเขียวมรกตที่เติบโตตามผนังถ้ำชื้น เรืองแสงอ่อนๆ และสมานแผลสดได้ดี",
      "futureUsesTh": "พอกแผลสด ปรุงโอสถสมานเนื้อเยื่อ และเลี้ยงแมลงวิญญาณ"
    },
    {
      "id": "MW_MAT_HERB_003",
      "nameTh": "สปอร์เห็ดหลับใหลสีเทา",
      "category": "HERB",
      "plantForm": "SPORE",
      "tier": 1,
      "element": "YIN",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "forest",
      "toxicity": 4,
      "baseValueStones": 26,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์สปอร์เห็ดหลับใหลสีเทา",
      "regenPerSeason": 10,
      "isTranscendent": false,
      "propertyTags": [
        "SEDATIVE",
        "SPORE_CLOUD",
        "CALM_PAIN"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (SPORE) · ระดับ 1",
      "propertiesTh": "ผงสปอร์ละเอียดที่ทำให้ผู้สูดดมรู้สึกง่วงซึมและลืมความเจ็บปวดชั่วคราว",
      "futureUsesTh": "ปรุงโอสถระงับปวด ยาสลบอสูร และผงควันพรางตัว"
    },
    {
      "id": "MW_MAT_HERB_004",
      "nameTh": "ผลหนามแดงซับโลหิต",
      "category": "HERB",
      "plantForm": "FRUIT",
      "tier": 1,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "plains",
      "toxicity": 2,
      "baseValueStones": 26,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ผลหนามแดงซับโลหิต",
      "regenPerSeason": 10,
      "isTranscendent": false,
      "propertyTags": [
        "BLOOD_TONIC",
        "WARM_PULSE",
        "STAMINA"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (FRUIT) · ระดับ 1",
      "propertiesTh": "ผลไม้ป่าเปลือกหนามที่เนื้อในสีแดงสดเหมือนหยดเลือด รสฝาดอมหวาน",
      "futureUsesTh": "ปรุงโอสถบำรุงโลหิตและลูกกลอนฟื้นกำลังหลังฝึกหนัก"
    },
    {
      "id": "MW_MAT_HERB_005",
      "nameTh": "ยางสนเกราะเหลืองโบราณ",
      "category": "HERB",
      "plantForm": "RESIN",
      "tier": 1,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "forest",
      "toxicity": 1,
      "baseValueStones": 26,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ยางสนเกราะเหลืองโบราณ",
      "regenPerSeason": 10,
      "isTranscendent": false,
      "propertyTags": [
        "ADHESIVE",
        "SHIELD_COAT",
        "PRESERVATIVE"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (RESIN) · ระดับ 1",
      "propertiesTh": "ยางไม้เหนียวข้นที่ไหลจากต้นสนอายุนับร้อยปี แข็งตัวเมื่อกระทบอากาศ",
      "futureUsesTh": "เคลือบด้ามศาสตรา ผนึกขวดโอสถ และทำฐานกำยาน"
    },
    {
      "id": "MW_MAT_HERB_006",
      "nameTh": "สาหร่ายเกลียวครามน้ำเชี่ยว",
      "category": "HERB",
      "plantForm": "AQUATIC",
      "tier": 1,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "plains",
      "toxicity": 0,
      "baseValueStones": 26,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์สาหร่ายเกลียวครามน้ำเชี่ยว",
      "regenPerSeason": 10,
      "isTranscendent": false,
      "propertyTags": [
        "MERIDIAN_FLOW",
        "HYDRATING",
        "DETOX_MILD"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (AQUATIC) · ระดับ 1",
      "propertiesTh": "สาหร่ายน้ำจืดที่บิดเป็นเกลียวตามกระแสน้ำเชี่ยว เหนียวและซับปราณน้ำได้ดี",
      "futureUsesTh": "ปรุงโอสถคลายความเหนื่อยล้าและชะล้างพิษตกค้าง"
    },
    {
      "id": "MW_MAT_HERB_007",
      "nameTh": "กาฝากเถาเงินเกาะไผ่",
      "category": "HERB",
      "plantForm": "PARASITIC",
      "tier": 2,
      "element": "WIND",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "forest",
      "toxicity": 2,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์กาฝากเถาเงินเกาะไผ่",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "PARASITIC_DRAIN",
        "LIGHTNESS_QI",
        "AGILITY"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (PARASITIC) · ระดับ 2",
      "propertiesTh": "พืชกาฝากสีเงินที่แทงรากสูบปราณวายุจากต้นไผ่เมฆาคราม",
      "futureUsesTh": "ปรุงโอสถเสริมความคล่องตัวและชงชาเร่งปราณวิชาตัวเบา"
    },
    {
      "id": "MW_MAT_HERB_008",
      "nameTh": "เห็ดถั่งเช่าหนอนศิลา",
      "category": "HERB",
      "plantForm": "PARASITIC",
      "tier": 2,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "WINTER",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เห็ดถั่งเช่าหนอนศิลา",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "CORDYCEPS",
        "BONE_NOURISH",
        "STAMINA_CORE"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (PARASITIC) · ระดับ 2",
      "propertiesTh": "เห็ดปรสิตที่งอกออกจากร่างหนอนแร่ในฤดูหนาว ผสานคุณค่าของพืชและอสูรดิน",
      "futureUsesTh": "ปรุงโอสถเสริมรากฐานกายาและฟื้นฟูอาการบาดเจ็บภายใน"
    },
    {
      "id": "MW_MAT_HERB_009",
      "nameTh": "ดอกบัวโคลนทมิฬเจ็ดพิษ",
      "category": "HERB",
      "plantForm": "AQUATIC",
      "tier": 2,
      "element": "YIN",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "forest",
      "toxicity": 7,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ดอกบัวโคลนทมิฬเจ็ดพิษ",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "MIASMA_ABSORB",
        "POISON_IMMUNE",
        "VENOM_CATALYST"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (AQUATIC) · ระดับ 2",
      "propertiesTh": "ดอกบัวสีดำม่วงที่เบ่งบานกลางโคลนพิษ ดูดซับพิษรอบข้างมาเก็บไว้ที่เกสร",
      "futureUsesTh": "ใช้ฝึกกายาต้านพิษ ปรุงยาถอนพิษบึงหมอก และเลี้ยงแมลงกู่"
    },
    {
      "id": "MW_MAT_HERB_010",
      "nameTh": "รากขิงเพลิงหินผา",
      "category": "HERB",
      "plantForm": "ROOT",
      "tier": 2,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "mountain",
      "toxicity": 3,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์รากขิงเพลิงหินผา",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "EXPEL_COLD",
        "FIRE_MERIDIAN",
        "YANG_SURGE"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (ROOT) · ระดับ 2",
      "propertiesTh": "เหง้าขิงที่แทรกตัวอยู่ในรอยแตกของหินภูเขาไฟ รสเผ็ดร้อนแรงขับไอเย็นทันที",
      "futureUsesTh": "ปรุงโอสถขับพิษเหมันต์และเปิดชีพจรสายอัคคี"
    },
    {
      "id": "MW_MAT_HERB_011",
      "nameTh": "ผลแก้วน้ำค้างแข็ง",
      "category": "HERB",
      "plantForm": "FRUIT",
      "tier": 2,
      "element": "ICE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "WINTER",
      "terrain": "mountain",
      "toxicity": 1,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ผลแก้วน้ำค้างแข็ง",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "CHILL_CALM",
        "CLEAR_MIND",
        "FEVER_RELIEF"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (FRUIT) · ระดับ 2",
      "propertiesTh": "ผลไม้โปร่งใสที่ห้อยอยู่ตามกิ่งสนหิมะ เนื้อในเย็นเฉียบช่วยดับไฟราคะและจิตมาร",
      "futureUsesTh": "ปรุงโอสถสงบจิตใจและลดความร้อนในเตาหลอม"
    },
    {
      "id": "MW_MAT_HERB_012",
      "nameTh": "ใบชาสายฟ้าเก้าแฉก",
      "category": "HERB",
      "plantForm": "LEAF",
      "tier": 2,
      "element": "LIGHTNING",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ใบชาสายฟ้าเก้าแฉก",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "SPARK_SENSE",
        "FOCUS_MIND",
        "LIGHTNING_CONDUCT"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (LEAF) · ระดับ 2",
      "propertiesTh": "ใบชาที่เติบโตบนที่ราบสูงซึ่งถูกสายฟ้าผ่าเป็นประจำ มีประจุไฟฟ้าอ่อนๆ",
      "futureUsesTh": "ชงชาวิญญาณเพิ่มความเร็วในการคิดวิเคราะห์และตีความคัมภีร์"
    },
    {
      "id": "MW_MAT_HERB_013",
      "nameTh": "มอสทองแดงกินแร่",
      "category": "HERB",
      "plantForm": "MOSS",
      "tier": 2,
      "element": "METAL",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "toxicity": 3,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์มอสทองแดงกินแร่",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "METAL_DIGEST",
        "ACIDIC_SAP",
        "ETCHING"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (MOSS) · ระดับ 2",
      "propertiesTh": "มอสประหลาดที่ย่อยสลายผิวแร่ทองแดงเพื่อเติบโต ให้สารคัดหลั่งกัดกร่อนโลหะ",
      "futureUsesTh": "ใช้กัดลายอักขระบนใบกระบี่และสกัดสิ่งเจือปนออกจากแร่ดิบ"
    },
    {
      "id": "MW_MAT_HERB_014",
      "nameTh": "เกสรดอกไม้กินแมลงหมื่นมายา",
      "category": "HERB",
      "plantForm": "FLOWER",
      "tier": 3,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "forest",
      "toxicity": 6,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เกสรดอกไม้กินแมลงหมื่นมายา",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "HALLUCINOGEN",
        "DREAM_WEAVE",
        "LURE_SCENT"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (FLOWER) · ระดับ 3",
      "propertiesTh": "เกสรสีรุ้งจากดอกไม้กินเนื้อขนาดใหญ่ ส่งกลิ่นหอมหวานล่อแมลงและอสูรให้หลงทาง",
      "futureUsesTh": "ปรุงกำยานมายาฝัน เหยื่อล่ออสูรหายาก และโอสถสายวิถีจิต"
    },
    {
      "id": "MW_MAT_HERB_015",
      "nameTh": "รากโสมคนคู่ประสานวิญญาณ",
      "category": "HERB",
      "plantForm": "ROOT",
      "tier": 3,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "forest",
      "toxicity": 1,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์รากโสมคนคู่ประสานวิญญาณ",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "TWIN_ROOT",
        "SOUL_HARMONY",
        "VITALITY_RESTORE"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (ROOT) · ระดับ 3",
      "propertiesTh": "รากโสมสองหัวที่พันเกี่ยวกันเหมือนคนโอบกอด ต้องขุดด้วยเสียมไม้ไผ่ห้ามโดนเหล็ก",
      "futureUsesTh": "ปรุงโอสถประสานปราณและฟื้นฟูพลังชีวิตระดับกลาง"
    },
    {
      "id": "MW_MAT_HERB_016",
      "nameTh": "เห็ดเกราะเหล็กหลังเต่า",
      "category": "HERB",
      "plantForm": "SPORE",
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เห็ดเกราะเหล็กหลังเต่า",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "HARD_CAP",
        "SHIELD_QI",
        "EARTH_ESSENCE"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (SPORE) · ระดับ 3",
      "propertiesTh": "เห็ดหลินจือที่มีหมวกแข็งแกร่งดั่งกระดองเต่าศิลา ใช้เวลาห้าสิบปีจึงจะโตเต็มวัย",
      "futureUsesTh": "ปรุงโอสถเสริมเกราะปราณคุ้มกายและบดเป็นผงผสมเกราะ"
    },
    {
      "id": "MW_MAT_HERB_017",
      "nameTh": "ดอกซากศพแวมไพร์โลหิต",
      "category": "HERB",
      "plantForm": "PARASITIC",
      "tier": 3,
      "element": "YIN",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "plains",
      "toxicity": 8,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ดอกซากศพแวมไพร์โลหิต",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "RAFFLESIA_BLOOD",
        "CORPSE_QI",
        "VAMPIRIC"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (PARASITIC) · ระดับ 3",
      "propertiesTh": "ดอกไม้ปรสิตไร้ใบที่งอกบนซากอสูรในสมรภูมิ กลีบสีแดงคล้ำส่งกลิ่นคาวเลือด",
      "futureUsesTh": "ปรุงโอสถโลหิตสายมารอสูรและยาปลุกพลังรบฉับพลัน"
    },
    {
      "id": "MW_MAT_HERB_018",
      "nameTh": "สาหร่ายมุกเพลิงก้นปล่อง",
      "category": "HERB",
      "plantForm": "AQUATIC",
      "tier": 3,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "island",
      "toxicity": 3,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์สาหร่ายมุกเพลิงก้นปล่อง",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "THERMAL_VENT",
        "FIRE_WATER_HARMONY",
        "PEARL_SAP"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (AQUATIC) · ระดับ 3",
      "propertiesTh": "สาหร่ายที่เติบโตติดกับปล่องน้ำพุร้อนใต้สมุทร ทนทั้งแรงดันน้ำและความร้อนจัด",
      "futureUsesTh": "ปรุงโอสถผสานน้ำและไฟ ช่วยให้ทะลวงจุดชีพจรที่ตีบตัน"
    },
    {
      "id": "MW_MAT_HERB_019",
      "nameTh": "ยางไม้จันทน์โลหิตพันปี",
      "category": "HERB",
      "plantForm": "RESIN",
      "tier": 3,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "forest",
      "toxicity": 1,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ยางไม้จันทน์โลหิตพันปี",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "DRAGON_BLOOD_RESIN",
        "SEAL_QI",
        "TALISMAN_BIND"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (RESIN) · ระดับ 3",
      "propertiesTh": "ยางไม้สีแดงเข้มดั่งเลือดมังกรที่ซึมจากต้นจันทน์โบราณ กักเก็บปราณไม่ให้รั่วไหล",
      "futureUsesTh": "ผสมหมึกชาดจารึกยันต์ระดับสูงและเคลือบศาสตราไม่ให้ปราณเสื่อม"
    },
    {
      "id": "MW_MAT_HERB_020",
      "nameTh": "หญ้าเข็มสายฟ้าเงิน",
      "category": "HERB",
      "plantForm": "LEAF",
      "tier": 3,
      "element": "LIGHTNING",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "mountain",
      "toxicity": 4,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์หญ้าเข็มสายฟ้าเงิน",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "NEEDLE_LEAF",
        "PIERCE_ACUPUNCTURE",
        "THUNDER_QI"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (LEAF) · ระดับ 3",
      "propertiesTh": "ใบหญ้าแข็งและแหลมคมดั่งเข็มเงิน นำกระแสปราณสายฟ้าเข้าสู่จุดฝังเข็มโดยตรง",
      "futureUsesTh": "ใช้ทำเข็มกระตุ้นชีพจรและปรุงโอสถสายเทพทัณฑ์อสนี"
    },
    {
      "id": "MW_MAT_HERB_021",
      "nameTh": "ผลน้ำเต้าหยกเก็บลม",
      "category": "HERB",
      "plantForm": "FRUIT",
      "tier": 3,
      "element": "WIND",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "mountain",
      "toxicity": 1,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ผลน้ำเต้าหยกเก็บลม",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "WIND_VESSEL",
        "GOURD_SHELL",
        "FLIGHT_SPEED"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (FRUIT) · ระดับ 3",
      "propertiesTh": "ผลน้ำเต้าที่เติบโตตามหน้าผาหินปูน ภายในกลวงและมีกระแสลมหมุนวนอยู่เอง",
      "futureUsesTh": "ใช้ทำน้ำเต้าเก็บโอสถหรือหลอมเป็นเครื่องรางวิชาตัวเบา"
    },
    {
      "id": "MW_MAT_HERB_022",
      "nameTh": "เฟิร์นแก้วสะท้อนจันทร์",
      "category": "HERB",
      "plantForm": "LEAF",
      "tier": 3,
      "element": "ICE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "WINTER",
      "terrain": "forest",
      "toxicity": 1,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เฟิร์นแก้วสะท้อนจันทร์",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "CRYSTAL_FROND",
        "MOONLIGHT_STORE",
        "ILLUSION_CLEAR"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (LEAF) · ระดับ 3",
      "propertiesTh": "ใบเฟิร์นโปร่งใสที่บานเฉพาะคืนเดือนหงายเพื่อเก็บสะสมปราณจันทรา",
      "futureUsesTh": "ปรุงโอสถกระจกใจเซนและน้ำยาล้างพิษมายา"
    },
    {
      "id": "MW_MAT_HERB_023",
      "nameTh": "เห็ดราปรสิตสมองอสูร",
      "category": "HERB",
      "plantForm": "PARASITIC",
      "tier": 4,
      "element": "YIN",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "forest",
      "toxicity": 9,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เห็ดราปรสิตสมองอสูร",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "MIND_PARASITE",
        "NEURAL_CONTROL",
        "GU_CATALYST"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (PARASITIC) · ระดับ 4",
      "propertiesTh": "เห็ดสายพันธุ์ดุร้ายที่งอกทะลุกะโหลกของอสูรที่ติดเชื้อ อัดแน่นด้วยคลื่นจิตบิดเบี้ยว",
      "futureUsesTh": "ปรุงโอสถควบคุมพิษกู่และศึกษาวิชาโจมตีดวงจิต"
    },
    {
      "id": "MW_MAT_HERB_024",
      "nameTh": "บัวหิมะเพลิงสองขั้ว",
      "category": "HERB",
      "plantForm": "FLOWER",
      "tier": 4,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "WINTER",
      "terrain": "mountain",
      "toxicity": 3,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์บัวหิมะเพลิงสองขั้ว",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "FROST_FLAME",
        "YIN_YANG_BALANCE",
        "CORE_TEMPER"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FLOWER) · ระดับ 4",
      "propertiesTh": "ดอกบัวประหลาดที่กลีบนอกเป็นน้ำแข็งแต่เกสรในลุกโชนด้วยเปลวไฟสีทอง",
      "futureUsesTh": "ปรุงโอสถปรับสมดุลหยินหยางและทะลวงคอขวดขั้นกลาง"
    },
    {
      "id": "MW_MAT_HERB_025",
      "nameTh": "รากโสมดาราตกหนักหมื่นชั่ง",
      "category": "HERB",
      "plantForm": "ROOT",
      "tier": 4,
      "element": "STAR",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์รากโสมดาราตกหนักหมื่นชั่ง",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "GRAVITY_ROOT",
        "BONE_DENSITY",
        "METEOR_QI"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (ROOT) · ระดับ 4",
      "propertiesTh": "โสมที่งอกในหลุมอุกกาบาต ดูดซับแร่ดาราจนมีน้ำหนักมากกว่าโสมทั่วไปสิบเท่า",
      "futureUsesTh": "ปรุงโอสถหลอมกระดูกดาราสำหรับผู้ฝึกวิถีกายา"
    },
    {
      "id": "MW_MAT_HERB_026",
      "nameTh": "ดอกกล้วยไม้สุญตาล่องหน",
      "category": "HERB",
      "plantForm": "FLOWER",
      "tier": 4,
      "element": "VOID",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ดอกกล้วยไม้สุญตาล่องหน",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "PHASE_SHIFT",
        "STEALTH_QI",
        "SPATIAL_AURA"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FLOWER) · ระดับ 4",
      "propertiesTh": "กล้วยไม้ที่กลีบดอกเลือนรางจางหายเป็นพักๆ ต้องใช้ตาข่ายดักปราณจึงจะเก็บได้",
      "futureUsesTh": "ปรุงโอสถเร้นกายไร้ลักษณ์และผสมหมึกจารึกค่ายกลมิติ"
    },
    {
      "id": "MW_MAT_HERB_027",
      "nameTh": "ผลทับทิมโลหิตอสุรา",
      "category": "HERB",
      "plantForm": "FRUIT",
      "tier": 4,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "plains",
      "toxicity": 5,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ผลทับทิมโลหิตอสุรา",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "ASURA_BLOOD",
        "BERSERK_QI",
        "VITALITY_BURST"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FRUIT) · ระดับ 4",
      "propertiesTh": "ผลทับทิมที่เติบโตเหนือสุสานนักรบ เมล็ดข้างในเหมือนอัญมณีโลหิตที่เต้นตามชีพจร",
      "futureUsesTh": "ปรุงโอสถโลหิตคลั่งศึกและโอสถฟื้นฟูบาดแผลฉกรรจ์"
    },
    {
      "id": "MW_MAT_HERB_028",
      "nameTh": "ยางอำพันผนึกแมลงบรรพกาล",
      "category": "HERB",
      "plantForm": "RESIN",
      "tier": 4,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "forest",
      "toxicity": 2,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ยางอำพันผนึกแมลงบรรพกาล",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "ANCIENT_AMBER",
        "TIME_SEAL",
        "GU_ANCESTOR"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (RESIN) · ระดับ 4",
      "propertiesTh": "ก้อนยางอำพันอายุหลายพันปีที่ภายในมีแมลงปราณยุคโบราณถูกผนึกไว้ในสภาพสมบูรณ์",
      "futureUsesTh": "สกัดพันธุกรรมแมลงกู่บรรพกาลและหลอมเครื่องรางคุ้มชีพ"
    },
    {
      "id": "MW_MAT_HERB_029",
      "nameTh": "ปะการังแก้วสมุทรเจ็ดเสียง",
      "category": "HERB",
      "plantForm": "AQUATIC",
      "tier": 4,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "island",
      "toxicity": 1,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ปะการังแก้วสมุทรเจ็ดเสียง",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "SONIC_CORAL",
        "MIND_CALM",
        "WATER_ARRAY"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (AQUATIC) · ระดับ 4",
      "propertiesTh": "พืชกึ่งปะการังจากร่องสมุทรลึก เมื่อกระแสน้ำไหลผ่านจะเกิดเสียงดนตรีชำระล้างจิตใจ",
      "futureUsesTh": "ใช้ทำแกนค่ายกลเสียงและปรุงโอสถสลายจิตมาร"
    },
    {
      "id": "MW_MAT_HERB_030",
      "nameTh": "ไผ่กระดูกขาวสุสานกระบี่",
      "category": "HERB",
      "plantForm": "ROOT",
      "tier": 4,
      "element": "METAL",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "plains",
      "toxicity": 4,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ไผ่กระดูกขาวสุสานกระบี่",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "SWORD_QI_BAMBOO",
        "SHARP_FIBER",
        "BONE_HARD"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (ROOT) · ระดับ 4",
      "propertiesTh": "หน่อไผ่สีขาวซีดที่แทงทะลุโครงกระดูกและเศษกระบี่ขึ้นมา มีความคมและแข็งดั่งโลหะ",
      "futureUsesTh": "ใช้ตีฝักกระบี่ พู่กันศึก และปรุงโอสถคมปราณ"
    },
    {
      "id": "MW_MAT_HERB_031",
      "nameTh": "มอสสายฟ้าทองคำม่วง",
      "category": "HERB",
      "plantForm": "MOSS",
      "tier": 4,
      "element": "LIGHTNING",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "mountain",
      "toxicity": 3,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์มอสสายฟ้าทองคำม่วง",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "THUNDER_CARPET",
        "CHARGE_STORE",
        "TRIBULATION_BUFFER"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (MOSS) · ระดับ 4",
      "propertiesTh": "มอสสีม่วงเหลือบทองที่เติบโตเฉพาะจุดที่สายฟ้าสวรรค์ผ่าซ้ำเกินร้อยครั้ง",
      "futureUsesTh": "ปรุงโอสถต้านทานทัณฑ์สวรรค์และชุบเกราะสายฟ้า"
    },
    {
      "id": "MW_MAT_HERB_032",
      "nameTh": "เห็ดหลินจือกระจกเงาหกแฉก",
      "category": "HERB",
      "plantForm": "SPORE",
      "tier": 4,
      "element": "LIGHT",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "plains",
      "toxicity": 1,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เห็ดหลินจือกระจกเงาหกแฉก",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "MIRROR_FUNGUS",
        "REFLECT_MIND",
        "ZEN_INSIGHT"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (SPORE) · ระดับ 4",
      "propertiesTh": "เห็ดทิพย์ริมทะเลสาบกระจกที่ผิวด้านบนเรียบใสสะท้อนภาพดวงจิตของผู้มอง",
      "futureUsesTh": "ปรุงโอสถรู้แจ้งวิถีเซนและเพิ่มความเข้าใจคัมภีร์"
    },
    {
      "id": "MW_MAT_HERB_033",
      "nameTh": "เถาวัลย์มังกรไม้ดูดชีพจร",
      "category": "HERB",
      "plantForm": "PARASITIC",
      "tier": 4,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "forest",
      "toxicity": 5,
      "baseValueStones": 296,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เถาวัลย์มังกรไม้ดูดชีพจร",
      "regenPerSeason": 4,
      "isTranscendent": false,
      "propertyTags": [
        "DRAGON_VINE",
        "TOUGH_SINEW",
        "LIFE_SIPHON"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (PARASITIC) · ระดับ 4",
      "propertiesTh": "เถาวัลย์ยักษ์ที่มีเกล็ดคล้ายงูเหลือม พันรัดต้นไม้ใหญ่เพื่อสูบน้ำเลี้ยงปราณ",
      "futureUsesTh": "ใช้ทำแส้ยุทธภัณฑ์ เชือกค่ายกล และโอสถยืดเส้นเอ็น"
    },
    {
      "id": "MW_MAT_HERB_034",
      "nameTh": "ผลท้อเหมันต์หัวใจน้ำแข็ง",
      "category": "HERB",
      "plantForm": "FRUIT",
      "tier": 5,
      "element": "ICE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "WINTER",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ผลท้อเหมันต์หัวใจน้ำแข็ง",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "GLACIER_PEACH",
        "PURE_YIN",
        "LONGEVITY_COOL"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FRUIT) · ระดับ 5",
      "propertiesTh": "ผลท้อที่สุกเพียงครั้งเดียวในรอบร้อยปีบนยอดเขาหิมะ เมล็ดในเป็นผลึกน้ำแข็งบริสุทธิ์",
      "futureUsesTh": "ปรุงโอสถทะลวงขอบเขตสายเหมันต์และยืดอายุขัย"
    },
    {
      "id": "MW_MAT_HERB_035",
      "nameTh": "ดอกบัวเพลิงกัลป์เก้ากลีบ",
      "category": "HERB",
      "plantForm": "FLOWER",
      "tier": 5,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "desert",
      "toxicity": 4,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ดอกบัวเพลิงกัลป์เก้ากลีบ",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "CALDERA_LOTUS",
        "TRUE_FIRE",
        "REBIRTH_QI"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FLOWER) · ระดับ 5",
      "propertiesTh": "ดอกบัวที่ลอยอยู่บนผิวลาวาเหลวในแอ่งภูเขาไฟ ไม่ไหม้ไฟและเก็บปราณสุริยันบริสุทธิ์",
      "futureUsesTh": "ปรุงมหาโอสถอัคคีบริสุทธิ์และใช้หลอมศาสตราระดับนภา"
    },
    {
      "id": "MW_MAT_HERB_036",
      "nameTh": "รากโสมมังกรสมุทรพันลี้",
      "category": "HERB",
      "plantForm": "AQUATIC",
      "tier": 5,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "island",
      "toxicity": 2,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์รากโสมมังกรสมุทรพันลี้",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "ABYSS_GINSENG",
        "DRAGON_VITALITY",
        "PRESSURE_FORGED"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (AQUATIC) · ระดับ 5",
      "propertiesTh": "รากโสมที่เติบโตใต้ก้นสมุทรลึก ทนแรงดันมหาศาลและมีรูปร่างเหมือนมังกรกำลังแหวกว่าย",
      "futureUsesTh": "ปรุงโอสถหลอมกายาระดับสูงและฟื้นฟูชีพจรที่เสียหายหนัก"
    },
    {
      "id": "MW_MAT_HERB_037",
      "nameTh": "เห็ดดาราสวรรค์เจ็ดสี",
      "category": "HERB",
      "plantForm": "SPORE",
      "tier": 5,
      "element": "STAR",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "WINTER",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เห็ดดาราสวรรค์เจ็ดสี",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "ASTRAL_MUSHROOM",
        "COSMIC_QI",
        "DIVINE_SENSE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (SPORE) · ระดับ 5",
      "propertiesTh": "เห็ดทิพย์ที่ดูดซับแสงดาวตกในหลุมอุกกาบาต สปอร์ของมันลอยวนเป็นรูปดาราจักร",
      "futureUsesTh": "ปรุงโอสถขยายทะเลสำนึกและเสริมญาณหยั่งรู้ข้ามวิถี"
    },
    {
      "id": "MW_MAT_HERB_038",
      "nameTh": "ใบชาต้นโพธิ์หยกโบราณ",
      "category": "HERB",
      "plantForm": "LEAF",
      "tier": 5,
      "element": "LIGHT",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "mountain",
      "toxicity": 0,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ใบชาต้นโพธิ์หยกโบราณ",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "JADE_BODHI_TEA",
        "HEART_DEMON_BANISH",
        "ENLIGHTENMENT"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (LEAF) · ระดับ 5",
      "propertiesTh": "ใบชาที่เก็บจากต้นไม้โบราณในซากอุทยานสวรรค์ มีลวดลายอักขระธรรมะสีทอง",
      "futureUsesTh": "ชงชาทิพย์ชำระจิตมารขั้นรุนแรงและปรุงโอสถทะลวงด่าน"
    },
    {
      "id": "MW_MAT_HERB_039",
      "nameTh": "กาฝากสุญตากลืนมิติ",
      "category": "HERB",
      "plantForm": "PARASITIC",
      "tier": 5,
      "element": "VOID",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "toxicity": 6,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์กาฝากสุญตากลืนมิติ",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "VOID_MISTLETOE",
        "SPACE_DEVOUR",
        "RIFT_ANCHOR"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (PARASITIC) · ระดับ 5",
      "propertiesTh": "พืชกาฝากที่งอกอยู่บนหินลอยฟ้าชายขอบรอยแยกสุญตา ดูดกลืนพลังงานมิติเป็นอาหาร",
      "futureUsesTh": "ใช้ทำหมุดยึดค่ายกลมิติและปรุงโอสถหลบหลีกไร้ร่องรอย"
    },
    {
      "id": "MW_MAT_HERB_040",
      "nameTh": "ยางต้นไม้โลกหยดทอง",
      "category": "HERB",
      "plantForm": "RESIN",
      "tier": 5,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "forest",
      "toxicity": 0,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ยางต้นไม้โลกหยดทอง",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "WORLD_TREE_SAP",
        "SUPREME_HEAL",
        "LIFE_SOURCE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (RESIN) · ระดับ 5",
      "propertiesTh": "หยดยางสีทองอำพันจากแก่นต้นไม้บรรพกาล เพียงหยดเดียวสามารถทำให้กิ่งไม้แห้งผลิใบใหม่",
      "futureUsesTh": "ตัวยาหลักในโอสถชุบชีวิตและฟื้นฟูรากฐานที่พังทลาย"
    },
    {
      "id": "MW_MAT_HERB_041",
      "nameTh": "ดอกพลับพลึงยมโลกสีเลือด",
      "category": "HERB",
      "plantForm": "FLOWER",
      "tier": 5,
      "element": "YIN",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "plains",
      "toxicity": 7,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ดอกพลับพลึงยมโลกสีเลือด",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "NETHER_LILY",
        "SOUL_RECALL",
        "GHOST_QI"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FLOWER) · ระดับ 5",
      "propertiesTh": "ดอกไม้สีแดงสดที่บานสะพรั่งบนเนินกระดูกโบราณ เชื่อมต่อระหว่างภพคนเป็นและเงาวิญญาณ",
      "futureUsesTh": "ปรุงโอสถสายราชันย์ภูตยมโลกและเครื่องรางสะกดวิญญาณ"
    },
    {
      "id": "MW_MAT_HERB_042",
      "nameTh": "หน่อไผ่ทองคำอสนีสวรรค์",
      "category": "HERB",
      "plantForm": "ROOT",
      "tier": 5,
      "element": "LIGHTNING",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "mountain",
      "toxicity": 3,
      "baseValueStones": 458,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์หน่อไผ่ทองคำอสนีสวรรค์",
      "regenPerSeason": 2,
      "isTranscendent": false,
      "propertyTags": [
        "HEAVEN_THUNDER_SHOOT",
        "PURE_YANG",
        "DEMON_BANE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (ROOT) · ระดับ 5",
      "propertiesTh": "หน่อไผ่สีทองคำที่แตกหน่อหลังพายุสายฟ้าครั้งใหญ่ เปี่ยมด้วยปราณหยางพิฆาตมาร",
      "futureUsesTh": "ใช้หลอมศาสตราเทพสายฟ้าและโอสถคุ้มครองยามฝ่าด่านเคราะห์"
    },
    {
      "id": "MW_MAT_HERB_043",
      "nameTh": "ผลมังกรสุญตาเก้าดารา",
      "category": "HERB",
      "plantForm": "FRUIT",
      "tier": 6,
      "element": "VOID",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "toxicity": 3,
      "baseValueStones": 656,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ผลมังกรสุญตาเก้าดารา",
      "regenPerSeason": 1,
      "isTranscendent": true,
      "propertyTags": [
        "VOID_DRAGON_FRUIT",
        "TRANSCENDENT_QI",
        "REALM_LEAP"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FRUIT) · ระดับ 6",
      "propertiesTh": "ผลไม้ทิพย์ที่สุกในรอยแยกมิติ เปลือกนอกมีลายมังกรและจุดดาวเก้าดวง",
      "futureUsesTh": "ปรุงมหาโอสถทะลวงขอบเขตระดับเซียนและเปิดชีพจรพิเศษ"
    },
    {
      "id": "MW_MAT_HERB_044",
      "nameTh": "บัวแก้วตรัสรู้หมื่นกัลป์",
      "category": "HERB",
      "plantForm": "AQUATIC",
      "tier": 6,
      "element": "LIGHT",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "mountain",
      "toxicity": 0,
      "baseValueStones": 656,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์บัวแก้วตรัสรู้หมื่นกัลป์",
      "regenPerSeason": 1,
      "isTranscendent": true,
      "propertyTags": [
        "NIRVANA_LOTUS",
        "SUPREME_CLARITY",
        "IMMORTAL_SOUL"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (AQUATIC) · ระดับ 6",
      "propertiesTh": "ดอกบัวแก้วโปร่งแสงในสระน้ำทิพย์ของซากอุทยานสวรรค์ ไม่แปดเปื้อนกิเลสและพิษใดๆ",
      "futureUsesTh": "ปรุงมหาโอสถชำระล้างทะเลจิตและยกระดับรากฐานวิญญาณ"
    },
    {
      "id": "MW_MAT_HERB_045",
      "nameTh": "รากโสมบรรพกาลกลืนฟ้า",
      "category": "HERB",
      "plantForm": "ROOT",
      "tier": 6,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 656,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์รากโสมบรรพกาลกลืนฟ้า",
      "regenPerSeason": 1,
      "isTranscendent": true,
      "propertyTags": [
        "PRIMORDIAL_GINSENG",
        "INFINITE_STAMINA",
        "BODY_ASCENSION"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (ROOT) · ระดับ 6",
      "propertiesTh": "โสมอายุหมื่นปีที่มีรูปร่างคล้ายทารกนั่งขัดสมาธิ ดูดซับปราณชีพจรโลกมาตั้งแต่ยุคโบราณ",
      "futureUsesTh": "ตัวยาเอกสำหรับทะลวงด่านขั้นสูงและต่ออายุขัยผู้ฝึกตน"
    },
    {
      "id": "MW_MAT_HERB_046",
      "nameTh": "เห็ดหลินจือเพลิงอมตะหงส์สวรรค์",
      "category": "HERB",
      "plantForm": "SPORE",
      "tier": 6,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "desert",
      "toxicity": 2,
      "baseValueStones": 656,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เห็ดหลินจือเพลิงอมตะหงส์สวรรค์",
      "regenPerSeason": 1,
      "isTranscendent": true,
      "propertyTags": [
        "PHOENIX_REISHI",
        "UNDYING_FLAME",
        "BLOOD_REBIRTH"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (SPORE) · ระดับ 6",
      "propertiesTh": "เห็ดทิพย์ที่เชื่อว่างอกขึ้นจากหยดเลือดของหงส์เพลิงอมตะ เปล่งรัศมีเพลิงสีทองตลอดกาล",
      "futureUsesTh": "ปรุงมหาโอสถผลัดเปลี่ยนไขกระดูกและฟื้นคืนพลังชีวิต"
    },
    {
      "id": "MW_MAT_HERB_047",
      "nameTh": "เถาวัลย์ดาราจักรทอฟ้า",
      "category": "HERB",
      "plantForm": "PARASITIC",
      "tier": 6,
      "element": "STAR",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "WINTER",
      "terrain": "mountain",
      "toxicity": 3,
      "baseValueStones": 656,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เถาวัลย์ดาราจักรทอฟ้า",
      "regenPerSeason": 1,
      "isTranscendent": true,
      "propertyTags": [
        "GALAXY_VINE",
        "STAR_LAW",
        "HEAVEN_WEAVE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (PARASITIC) · ระดับ 6",
      "propertiesTh": "เถาวัลย์ที่เลื้อยพันอยู่ตามเสาศิลาโบราณในหลุมดาวตก ดูดซับกฎเกณฑ์แห่งดวงดาว",
      "futureUsesTh": "ใช้ถักทออาภรณ์เซียนดาราและปรุงโอสถหยั่งรู้กฎฟ้าดิน"
    },
    {
      "id": "MW_MAT_HERB_048",
      "nameTh": "ผลต้นไม้โลกปฐมกาล",
      "category": "HERB",
      "plantForm": "FRUIT",
      "tier": 7,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "forest",
      "toxicity": 0,
      "baseValueStones": 890,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ผลต้นไม้โลกปฐมกาล",
      "regenPerSeason": 1,
      "isTranscendent": true,
      "propertyTags": [
        "GENESIS_FRUIT",
        "SUPREME_LONGEVITY",
        "DAO_HARMONY"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FRUIT) · ระดับ 7",
      "propertiesTh": "ผลไม้ในตำนานที่ควบแน่นจากแก่นปราณชีวิตบริสุทธิ์ของแดนหมื่นภพ",
      "futureUsesTh": "ปรุงโอสถระดับเทวตำนานเพื่อทะลวงสู่ขอบเขตสูงสุด"
    },
    {
      "id": "MW_MAT_HERB_049",
      "nameTh": "ดอกบัวสุญตาเปิดพิภพ",
      "category": "HERB",
      "plantForm": "FLOWER",
      "tier": 7,
      "element": "VOID",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 890,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ดอกบัวสุญตาเปิดพิภพ",
      "regenPerSeason": 1,
      "isTranscendent": true,
      "propertyTags": [
        "CHAOS_VOID_LOTUS",
        "CREATION_QI",
        "SPACE_MASTERY"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "สมุนไพรวิญญาณ (FLOWER) · ระดับ 7",
      "propertiesTh": "ดอกบัวที่ผลิบานท่ามกลางพายุสุญตา กลีบดอกแต่ละกลีบซ่อนมิติขนาดย่อมไว้ภายใน",
      "futureUsesTh": "หลอมสมบัติวิเศษระดับเทวตำนานและมหาโอสถข้ามภพ"
    },
    {
      "id": "MW_MAT_HERB_050",
      "nameTh": "หญ้าน้ำค้างหยกขาว",
      "category": "HERB",
      "plantForm": "LEAF",
      "tier": 1,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "plains",
      "toxicity": 0,
      "baseValueStones": 26,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์หญ้าน้ำค้างหยกขาว",
      "regenPerSeason": 10,
      "isTranscendent": false,
      "propertyTags": [
        "MILD_HEAL",
        "QI_DEW",
        "COMMON_BASE"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (LEAF) · ระดับ 1",
      "propertiesTh": "หญ้าสมุนไพรพื้นฐานที่ใบอุ้มหยดน้ำค้างใสสะอาด ใช้เป็นตัวยาประสานในตำรับทั่วไป",
      "futureUsesTh": "ใช้เป็นตัวยาตั้งต้นสำหรับฝึกปรุงโอสถและสมานแผลเล็กน้อย"
    },
    {
      "id": "MW_MAT_HERB_051",
      "nameTh": "รากบัวศิลาต้านพิษ",
      "category": "HERB",
      "plantForm": "AQUATIC",
      "tier": 2,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "plains",
      "toxicity": 1,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์รากบัวศิลาต้านพิษ",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "STONE_LOTUS_ROOT",
        "STOMACH_GUARD",
        "TOXIN_BUFFER"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (AQUATIC) · ระดับ 2",
      "propertiesTh": "รากบัวเนื้อแน่นแข็งที่ขึ้นในสระหิน ช่วยเคลือบเส้นชีพจรลดการดูดซึมพิษโอสถ",
      "futureUsesTh": "ใช้เป็นตัวยาเสริมลดความเสียหายเมื่อทดลองตำรับใหม่"
    },
    {
      "id": "MW_MAT_HERB_052",
      "nameTh": "พริกไทยอัคคีลมกรด",
      "category": "HERB",
      "plantForm": "FRUIT",
      "tier": 2,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SUMMER",
      "terrain": "mountain",
      "toxicity": 3,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์พริกไทยอัคคีลมกรด",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "WIND_FIRE_SPICE",
        "CIRCULATION_BOOST",
        "HEAT_CATALYST"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (FRUIT) · ระดับ 2",
      "propertiesTh": "เมล็ดพริกปราณที่เติบโตตามหน้าผาลมแรง เร่งการไหลเวียนของเลือดและปราณ",
      "futureUsesTh": "ใช้เร่งปฏิกิริยาในหม้อปรุงยาและทำอาหารเดินทางต้านความหนาว"
    },
    {
      "id": "MW_MAT_HERB_053",
      "nameTh": "ใบหม่อนหยกเลี้ยงไหมฟ้า",
      "category": "HERB",
      "plantForm": "LEAF",
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "SPRING",
      "terrain": "forest",
      "toxicity": 0,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ใบหม่อนหยกเลี้ยงไหมฟ้า",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "SILK_FEED",
        "PURE_FIBER",
        "BEAST_SNACK"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (LEAF) · ระดับ 2",
      "propertiesTh": "ใบหม่อนสีเขียวหยกที่อสูรแมลงและหนอนไหมวิญญาณชื่นชอบเป็นพิเศษ",
      "futureUsesTh": "ใช้เลี้ยงหนอนไหมปราณ ทำเหยื่อล่อแมลง และชงชาคลายความล้า"
    },
    {
      "id": "MW_MAT_HERB_054",
      "nameTh": "ดอกเก๊กฮวยเหมันต์ส่องตา",
      "category": "HERB",
      "plantForm": "FLOWER",
      "tier": 2,
      "element": "ICE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "WINTER",
      "terrain": "mountain",
      "toxicity": 0,
      "baseValueStones": 80,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์ดอกเก๊กฮวยเหมันต์ส่องตา",
      "regenPerSeason": 8,
      "isTranscendent": false,
      "propertyTags": [
        "EYE_CLARITY",
        "COOL_LIVER",
        "SENSE_SHARPEN"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (FLOWER) · ระดับ 2",
      "propertiesTh": "ดอกไม้สีขาวขอบเงินที่บานในหิมะแรก ช่วยบำรุงดวงตาและเพิ่มความคมชัดของประสาทสัมผัส",
      "futureUsesTh": "ปรุงโอสถบำรุงเนตรวิญญาณและช่วยให้มองเห็นร่องรอยอสูรชัดเจนขึ้น"
    },
    {
      "id": "MW_MAT_HERB_055",
      "nameTh": "เหง้าว่านเกราะทองคำ",
      "category": "HERB",
      "plantForm": "ROOT",
      "tier": 3,
      "element": "METAL",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "BEAST_TAMING",
        "TALISMAN"
      ],
      "season": "AUTUMN",
      "terrain": "mountain",
      "toxicity": 2,
      "baseValueStones": 170,
      "seedNameTh": "เมล็ด/เชื้อพันธุ์เหง้าว่านเกราะทองคำ",
      "regenPerSeason": 6,
      "isTranscendent": false,
      "propertyTags": [
        "GOLDEN_RHIZOME",
        "SKIN_HARDEN",
        "METAL_QI"
      ],
      "preservationRule": "DRY_POUCH",
      "subCategoryTh": "สมุนไพรวิญญาณ (ROOT) · ระดับ 3",
      "propertiesTh": "เหง้าว่านที่ดูดซับแร่ทองคำในดินจนเนื้อในเป็นสีทอง แข็งเหนียวต้องใช้ครกเหล็กตำ",
      "futureUsesTh": "ปรุงโอสถชุบผิวหนังเหล็กไหลและยาทาภายนอกก่อนออกศึก"
    },
    {
      "id": "MW_MAT_ORE_056",
      "nameTh": "ก้อนแร่เหล็กสนิมเลือดดิบ",
      "category": "ORE",
      "mineralForm": "RAW_DEPOSIT",
      "hardness": 45,
      "spiritualConductivity": 38,
      "thermalBehaviour": "HEAT_RETENTIVE",
      "tier": 1,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 30,
      "finiteReserve": 78,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "BLOOD_RUST",
        "RAW_IRON",
        "SHARP_SLAG"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_DEPOSIT) · ความแข็ง 45 · นำปราณ 38",
      "propertiesTh": "ก้อนแร่เหล็กดิบที่มีคราบสีแดงคล้ายเลือดซึมอยู่ตามรอยแตก ต้องหลอมแยกกากก่อนใช้",
      "futureUsesTh": "ถลุงเป็นเหล็กกล้าโลหิตหรือใช้ตีอาวุธพื้นฐานที่มีฤทธิ์สร้างแผลฉีกขาด"
    },
    {
      "id": "MW_MAT_ORE_057",
      "nameTh": "ทรายควอตซ์ปราณวายุ",
      "category": "ORE",
      "mineralForm": "RAW_DEPOSIT",
      "hardness": 35,
      "spiritualConductivity": 62,
      "thermalBehaviour": "NEUTRAL",
      "tier": 1,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 30,
      "finiteReserve": 78,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "WIND_SILICA",
        "GLASS_MEDIA",
        "LIGHT_WEIGHT"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_DEPOSIT) · ความแข็ง 35 · นำปราณ 62",
      "propertiesTh": "เม็ดทรายผลึกใสที่ถูกสายลมภูผาขัดเกลาจนกลมเกลี้ยง นำปราณวายุได้ดี",
      "futureUsesTh": "ใช้หลอมแก้วผลึก ขัดคมกระบี่ และโรยฐานค่ายกลลม"
    },
    {
      "id": "MW_MAT_ORE_058",
      "nameTh": "หินชนวนหยกเทาแผ่นเรียบ",
      "category": "ORE",
      "mineralForm": "RAW_DEPOSIT",
      "hardness": 50,
      "spiritualConductivity": 48,
      "thermalBehaviour": "STABLE",
      "tier": 1,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 30,
      "finiteReserve": 78,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "SLATE_PLATE",
        "INSCRIPTION_BASE",
        "STURDY"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_DEPOSIT) · ความแข็ง 50 · นำปราณ 48",
      "propertiesTh": "แผ่นหินเนื้อละเอียดที่กะเทาะออกเป็นแผ่นบางได้ง่าย ทนทานและเก็บอักขระได้นาน",
      "futureUsesTh": "ใช้ทำป้ายค่ายกลพื้นฐาน แผ่นฝึกจารึก และฐานเตาหลอม"
    },
    {
      "id": "MW_MAT_ORE_059",
      "nameTh": "แร่ดีบุกเงินสะท้อนเสียง",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 42,
      "spiritualConductivity": 74,
      "thermalBehaviour": "LOW_MELT",
      "tier": 2,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 90,
      "finiteReserve": 66,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "ACOUSTIC_TIN",
        "ALLOY_FLUX",
        "RESONANCE"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 42 · นำปราณ 74",
      "propertiesTh": "แร่โลหะสีขาวเงินที่หลอมละลายง่าย เมื่อผสมกับทองแดงจะได้สำริดที่กังวานไกล",
      "futureUsesTh": "ใช้หลอมระฆังวิญญาณ ขลุ่ยปราณ และเป็นตัวประสานโลหะต่างชนิด"
    },
    {
      "id": "MW_MAT_ORE_060",
      "nameTh": "แร่ทองแดงเพลิงภูเขาไฟ",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 55,
      "spiritualConductivity": 78,
      "thermalBehaviour": "HIGH_HEAT",
      "tier": 2,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 90,
      "finiteReserve": 66,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "VOLCANIC_COPPER",
        "FIRE_CONDUCT",
        "DUCTILE"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 55 · นำปราณ 78",
      "propertiesTh": "แร่ทองแดงที่ขุดได้จากขอบแอ่งลาวา มีความยืดหยุ่นสูงและนำปราณอัคคีได้ดีเยี่ยม",
      "futureUsesTh": "ใช้ตีหม้อต้มยา เตาหลอมขนาดเล็ก และอาวุธธาตุไฟขั้นต้น"
    },
    {
      "id": "MW_MAT_ORE_061",
      "nameTh": "แร่ตะกั่วน้ำลึกถ่วงสมุทร",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 38,
      "spiritualConductivity": 30,
      "thermalBehaviour": "COLD_SINK",
      "tier": 2,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 90,
      "finiteReserve": 66,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "HEAVY_LEAD",
        "QI_ISOLATOR",
        "PRESSURE_DENSE"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 38 · นำปราณ 30",
      "propertiesTh": "แร่โลหะหนักอึ้งจากก้นน้ำที่กั้นการรั่วไหลของปราณและพิษได้อย่างมิดชิด",
      "futureUsesTh": "ใช้ตีกล่องเก็บวัตถุดิบพิษ ถ่วงน้ำหนักอาวุธทุบ และผนึกไอหยิน"
    },
    {
      "id": "MW_MAT_ORE_062",
      "nameTh": "ผลึกเกลือศิลาชำระปราณ",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 40,
      "spiritualConductivity": 65,
      "thermalBehaviour": "DISSOLVABLE",
      "tier": 2,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 90,
      "finiteReserve": 66,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "PURIFY_SALT",
        "MIASMA_CLEAR",
        "ALCHEMICAL_FLUX"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 40 · นำปราณ 65",
      "propertiesTh": "ผลึกเกลือแร่สีขาวอมชมพูจากทะเลทรายศิลา ช่วยดูดซับสิ่งสกปรกในหม้อหลอม",
      "futureUsesTh": "ใช้ชำระล้างแร่ดิบ ปรุงยาถอนพิษ และโรยรอบค่ายพักแรมกันแมลงพิษ"
    },
    {
      "id": "MW_MAT_ORE_063",
      "nameTh": "เหล็กกล้าพับทบปราณคราม",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 68,
      "spiritualConductivity": 70,
      "thermalBehaviour": "BALANCED",
      "tier": 2,
      "element": "METAL",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 90,
      "finiteReserve": 66,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "FOLDED_STEEL",
        "BLADE_CORE",
        "REFINed_METAL"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 68 · นำปราณ 70",
      "propertiesTh": "แท่งเหล็กที่ผ่านการเผาและตีพับทบด้วยน้ำพุหยกจนไร้ฟองอากาศภายใน",
      "futureUsesTh": "วัสดุหลักสำหรับตีกระบี่ ดาบ และหัวทวนของศิษย์สายใน"
    },
    {
      "id": "MW_MAT_ORE_064",
      "nameTh": "แร่เงินน้ำค้างแข็งบริสุทธิ์",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 58,
      "spiritualConductivity": 84,
      "thermalBehaviour": "SUBZERO",
      "tier": 3,
      "element": "ICE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "FROST_SILVER",
        "CHILL_CONDUCT",
        "PURITY_HIGH"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 58 · นำปราณ 84",
      "propertiesTh": "สายแร่เงินที่จับตัวอยู่ใต้ธารน้ำแข็ง แผ่ไอเย็นออกมาตลอดเวลาและนำปราณจิตได้ดี",
      "futureUsesTh": "ใช้ตีศาสตราเหมันต์ เข็มเงินถอนพิษ และเครื่องประดับประคองจิต"
    },
    {
      "id": "MW_MAT_ORE_065",
      "nameTh": "หินแม่เหล็กอสนีสองขั้ว",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 64,
      "spiritualConductivity": 88,
      "thermalBehaviour": "SPARK_ACTIVE",
      "tier": 3,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "BIPOLAR_MAGNET",
        "LIGHTNING_TRAP",
        "REPULSION"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 64 · นำปราณ 88",
      "propertiesTh": "ก้อนหินแม่เหล็กจากที่ราบสูงสายฟ้าที่มีขั้วดูดและขั้วผลักรุนแรงในก้อนเดียว",
      "futureUsesTh": "ใช้สร้างค่ายกลแรงแม่เหล็ก อาวุธบินควบคุมด้วยปราณ และเสาล่อสายฟ้า"
    },
    {
      "id": "MW_MAT_ORE_066",
      "nameTh": "แร่เหล็กหนามอสูรโลหิต",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 72,
      "spiritualConductivity": 66,
      "thermalBehaviour": "BLOOD_REACTIVE",
      "tier": 3,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "BARBED_IRON",
        "BLOOD_RESONANCE",
        "BATTLEFIELD_ORE"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 72 · นำปราณ 66",
      "propertiesTh": "แร่เหล็กที่ดูดซับเลือดเนื้อในสมรภูมิโบราณจนงอกเป็นหนามแหลมคมเองตามธรรมชาติ",
      "futureUsesTh": "ใช้ตีอาวุธสังหารสายมาร เกราะหนามสะท้อนแรง และหอกทะลวงเกราะ"
    },
    {
      "id": "MW_MAT_ORE_067",
      "nameTh": "ผลึกควอตซ์ม่วงสะกดวิญญาณ",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 65,
      "spiritualConductivity": 82,
      "thermalBehaviour": "COOL_STABLE",
      "tier": 3,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "AMETHYST_SOUL",
        "MIND_ANCHOR",
        "ILLUSION_WARD"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 65 · นำปราณ 82",
      "propertiesTh": "ผลึกสีม่วงเข้มจากถ้ำใต้พิภพที่ช่วยดูดซับคลื่นอารมณ์ฟุ้งซ่านและป้องกันภาพหลอน",
      "futureUsesTh": "ใช้ฝังด้ามกระบี่จิต ทำลูกประคำเซน และแกนค่ายกลสงบจิต"
    },
    {
      "id": "MW_MAT_ORE_068",
      "nameTh": "แร่สำริดเขียวโบราณสถาน",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 70,
      "spiritualConductivity": 76,
      "thermalBehaviour": "ANCIENT_STABLE",
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "RUIN_BRONZE",
        "MEMORY_METAL",
        "FORMATION_PILLAR"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 70 · นำปราณ 76",
      "propertiesTh": "โลหะผสมสำริดที่กู้ได้จากซากปรักหักพัง มีลวดลายสนิมหยกที่ทนทานต่อการผุกร่อน",
      "futureUsesTh": "ใช้หล่อกระถางธูป เสาค่ายกล และเกราะป้องกันเวท"
    },
    {
      "id": "MW_MAT_ORE_069",
      "nameTh": "หยกเพลิงแมกมาสีชาด",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 66,
      "spiritualConductivity": 85,
      "thermalBehaviour": "INTERNAL_HEAT",
      "tier": 3,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "MAGMA_JADE",
        "FIRE_RESERVOIR",
        "WARM_WARD"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 66 · นำปราณ 85",
      "propertiesTh": "เนื้อหยกสีแดงสดที่มีเส้นสายคล้ายลาวาไหลเวียนอยู่ภายใน อุ่นร้อนตลอดปี",
      "futureUsesTh": "ใช้แกะสลักจี้คุ้มครองกันหนาว หัวไม้เท้าอัคคี และเร่งไฟปรุงโอสถ"
    },
    {
      "id": "MW_MAT_ORE_070",
      "nameTh": "แร่เหล็กดำก้นสมุทรอัดแรงดัน",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 84,
      "spiritualConductivity": 72,
      "thermalBehaviour": "PRESSURE_TEMPERED",
      "tier": 4,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "ABYSSAL_IRON",
        "CRUSH_RESIST",
        "HEAVY_WEAPON"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 84 · นำปราณ 72",
      "propertiesTh": "แร่เหล็กที่ถูกแรงดันน้ำมหาศาลบีบอัดมานับหมื่นปีจนเนื้อแน่นหนาทึบ",
      "futureUsesTh": "ใช้ตีค้อนศึก กระบี่ยักษ์ และเกราะหนักที่ไม่มีวันปริแตก"
    },
    {
      "id": "MW_MAT_ORE_071",
      "nameTh": "ทองคำขาวสายลมคมกริบ",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 78,
      "spiritualConductivity": 90,
      "thermalBehaviour": "AERODYNAMIC",
      "tier": 4,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "GALE_PLATINUM",
        "RAZOR_EDGE",
        "FEATHER_LIGHT"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 78 · นำปราณ 90",
      "propertiesTh": "โลหะสีขาวเงินที่มีน้ำหนักเบาผิดคาดแต่เมื่อรีดเป็นใบมีดจะคมกริบตัดเส้นผมขาดกลางอากาศ",
      "futureUsesTh": "ใช้ตีกระบี่บิน มีดสั้นเร้นเงา และชุดเกราะเบาความเร็วสูง"
    },
    {
      "id": "MW_MAT_ORE_072",
      "nameTh": "ผลึกสายฟ้าเหลวผนึกหิน",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 70,
      "spiritualConductivity": 95,
      "thermalBehaviour": "VOLATILE_SPARK",
      "tier": 4,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "LIQUID_THUNDER",
        "HIGH_VOLTAGE",
        "THUNDER_CORE"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 70 · นำปราณ 95",
      "propertiesTh": "ก้อนผลึกที่ภายในมีสายฟ้าเหลวสีม่วงทองไหลกลิ้งไปมา หากทุบแตกจะระเบิดสายฟ้าทันที",
      "futureUsesTh": "ใช้เป็นแกนกลางทวนสายฟ้า ยันต์อสนีบาตทำลายล้าง และค่ายกลทัณฑ์สวรรค์"
    },
    {
      "id": "MW_MAT_ORE_073",
      "nameTh": "แร่เงินปรอทมายาเปลี่ยนรูป",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 50,
      "spiritualConductivity": 92,
      "thermalBehaviour": "FLUID_METAL",
      "tier": 4,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "QUICKSILVER_SOUL",
        "SHAPE_SHIFT",
        "FLEXIBLE_CONDUCT"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 50 · นำปราณ 92",
      "propertiesTh": "โลหะกึ่งของเหลวที่เปลี่ยนรูปร่างตามเจตจำนงของผู้ใช้ปราณจิต",
      "futureUsesTh": "ใช้หลอมศาสตราแปรสัณฐาน เส้นสายพิณ และผสมยาอายุวัฒนะชั้นสูง"
    },
    {
      "id": "MW_MAT_ORE_074",
      "nameTh": "หยกกระดูกขาวอมตะ",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 76,
      "spiritualConductivity": 84,
      "thermalBehaviour": "COLD_BONE",
      "tier": 4,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "BONE_JADE",
        "MARROW_LINK",
        "NETHER_GUARD"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 76 · นำปราณ 84",
      "propertiesTh": "แร่หยกสีขาวนวลที่เกิดจากการกลายเป็นหินของกระดูกอสูรบรรพกาล เข้ากับร่างกายมนุษย์ได้ดี",
      "futureUsesTh": "ใช้ทำอวัยวะเทียมปราณ เกราะกระดูก และเครื่องรางสายยมโลก"
    },
    {
      "id": "MW_MAT_ORE_075",
      "nameTh": "แร่เหล็กไหลทองคำเพลิงสุริยัน",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 88,
      "spiritualConductivity": 94,
      "thermalBehaviour": "SOLAR_FUSION",
      "tier": 5,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 510,
      "finiteReserve": 30,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "SOLAR_ADAMANT",
        "IMMORTAL_FORGE",
        "YANG_SUPREME"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 88 · นำปราณ 94",
      "propertiesTh": "โลหะที่หลอมรวมจากเหล็กไหลและทองคำสุริยันในใจกลางปล่องภูเขาไฟ เปล่งแสงสีทองแดง",
      "futureUsesTh": "ใช้ตีศาสตราระดับนภาและเกราะเทพสงคราม"
    },
    {
      "id": "MW_MAT_ORE_076",
      "nameTh": "ผลึกน้ำแข็งดำเก้าขุมนรก",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 82,
      "spiritualConductivity": 91,
      "thermalBehaviour": "ABSOLUTE_ZERO",
      "tier": 5,
      "element": "ICE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 510,
      "finiteReserve": 30,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "ABYSS_ICE_CRYSTAL",
        "SOUL_FREEZE",
        "ETERNAL_FROST"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 82 · นำปราณ 91",
      "propertiesTh": "ผลึกน้ำแข็งสีดำสนิทจากรอยแยกใต้ธารน้ำแข็ง แช่แข็งได้แม้กระทั่งเปลวไฟและปราณจิต",
      "futureUsesTh": "ใช้หลอมกระบี่เหมันต์นิรันดร์และค่ายกลผนึกอสูร"
    },
    {
      "id": "MW_MAT_ORE_077",
      "nameTh": "แร่อุกกาบาตม่วงดาราพินาศ",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 92,
      "spiritualConductivity": 89,
      "thermalBehaviour": "GRAVITY_FIELD",
      "tier": 5,
      "element": "STAR",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 510,
      "finiteReserve": 30,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "STAR_DESTROYER_ORE",
        "HEAVY_CRUSH",
        "COSMIC_METAL"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 92 · นำปราณ 89",
      "propertiesTh": "แกนกลางของอุกกาบาตที่ตกลงมาในหลุมดารา มีสนามแรงโน้มถ่วงดึงดูดโลหะรอบข้าง",
      "futureUsesTh": "ใช้ตีศาสตราหนักสายกายาดาราและหมุดสะกดค่ายกลใหญ่"
    },
    {
      "id": "MW_MAT_ORE_078",
      "nameTh": "หยกจักรพรรดิห้าสีประสานธาตุ",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 85,
      "spiritualConductivity": 96,
      "thermalBehaviour": "ELEMENTAL_HARMONY",
      "tier": 5,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 510,
      "finiteReserve": 30,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "IMPERIAL_FIVE_JADE",
        "ALL_ELEMENTS",
        "SUPREME_CONDUIT"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 85 · นำปราณ 96",
      "propertiesTh": "ก้อนหยกธรรมชาติที่มีห้าสีหลอมรวมกันอย่างสมดุล เหนี่ยวนำปราณได้ทุกธาตุโดยไร้แรงต้าน",
      "futureUsesTh": "ใช้หลอมตราประจำตำแหน่งเจ้าสำนัก จานค่ายกลเบญจธาตุ และเครื่องรางระดับสูง"
    },
    {
      "id": "MW_MAT_ORE_079",
      "nameTh": "แร่เงินสุญตาไร้เงา",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 80,
      "spiritualConductivity": 95,
      "thermalBehaviour": "PHASE_METAL",
      "tier": 5,
      "element": "VOID",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 510,
      "finiteReserve": 30,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "VOID_SILVER",
        "BLINK_STRIKE",
        "BARRIER_BYPASS"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 80 · นำปราณ 95",
      "propertiesTh": "โลหะสีเงินหม่นจากชายขอบรอยแยกสุญตา เมื่ออัดปราณจะสามารถทะลุผ่านเกราะป้องกันบางส่วนได้",
      "futureUsesTh": "ใช้ตีอาวุธลอบสังหารข้ามมิติและเข็มทะลวงม่านปราณ"
    },
    {
      "id": "MW_MAT_ORE_080",
      "nameTh": "ทองคำเทวะอสนีสวรรค์เก้าชั้น",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 94,
      "spiritualConductivity": 98,
      "thermalBehaviour": "DIVINE_SPARK",
      "tier": 6,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 730,
      "finiteReserve": 18,
      "slowCrystalRegen": false,
      "isTranscendent": true,
      "propertyTags": [
        "NINE_HEAVEN_GOLD",
        "TRIBULATION_IMMUNE",
        "GOD_WEAPON"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 94 · นำปราณ 98",
      "propertiesTh": "โลหะศักดิ์สิทธิ์ที่ผ่านการชุบด้วยสายฟ้าเก้าชั้นฟ้า มีลวดลายเมฆาอัสนีฝังอยู่ในเนื้อโลหะ",
      "futureUsesTh": "ใช้หลอมศาสตราระดับเซียนและเกราะรับทัณฑ์สวรรค์"
    },
    {
      "id": "MW_MAT_ORE_081",
      "nameTh": "ผลึกหัวใจดาราจักรนิรันดร์",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 95,
      "spiritualConductivity": 99,
      "thermalBehaviour": "STAR_REACTOR",
      "tier": 6,
      "element": "STAR",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 730,
      "finiteReserve": 18,
      "slowCrystalRegen": true,
      "isTranscendent": true,
      "propertyTags": [
        "GALAXY_CORE_CRYSTAL",
        "ENDLESS_QI",
        "ASTRAL_DOMAIN"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 95 · นำปราณ 99",
      "propertiesTh": "ผลึกอัญมณีที่มีกลุ่มดาวหมุนวนอยู่ภายใน ให้กำเนิดปราณดาราอย่างไม่รู้จักจบสิ้น",
      "futureUsesTh": "ใช้เป็นแกนพลังงานมหาค่ายกลพิทักษ์สำนักและศาสตราคู่ชีวิต"
    },
    {
      "id": "MW_MAT_ORE_082",
      "nameTh": "แร่เหล็กบรรพกาลหลอมโลก",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 99,
      "spiritualConductivity": 98,
      "thermalBehaviour": "GENESIS_FORGE",
      "tier": 7,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 990,
      "finiteReserve": 6,
      "slowCrystalRegen": false,
      "isTranscendent": true,
      "propertyTags": [
        "WORLD_FORGE_IRON",
        "UNBREAKABLE",
        "SUPREME_ARTIFACT"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 99 · นำปราณ 98",
      "propertiesTh": "โลหะในตำนานจากยุคก่อกำเนิดภพภูมิ หนักแน่นดั่งแผ่นดินและไม่มีวันบุบสลาย",
      "futureUsesTh": "ใช้ตีสุดยอดศาสตราประจำสำนักระดับเทวตำนาน"
    },
    {
      "id": "MW_MAT_ORE_083",
      "nameTh": "หยกสุญตาไร้ลักษณ์",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 96,
      "spiritualConductivity": 100,
      "thermalBehaviour": "VOID_TRANSCENDENT",
      "tier": 7,
      "element": "VOID",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 990,
      "finiteReserve": 6,
      "slowCrystalRegen": true,
      "isTranscendent": true,
      "propertyTags": [
        "FORMLESS_VOID_JADE",
        "REALM_PIERCE",
        "IMMORTAL_RELIC"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 96 · นำปราณ 100",
      "propertiesTh": "หยกใสไร้สีที่มองทะลุไปเห็นห้วงอวกาศว่างเปล่า รองรับกฎเกณฑ์แห่งเต๋าขั้นสูงสุด",
      "futureUsesTh": "ใช้หลอมกระจกส่องหมื่นภพและสมบัติวิเศษระดับสูงสุด"
    },
    {
      "id": "MW_MAT_ORE_084",
      "nameTh": "ก้อนถ่านศิลาเพลิงอุ่น",
      "category": "ORE",
      "mineralForm": "RAW_DEPOSIT",
      "hardness": 30,
      "spiritualConductivity": 50,
      "thermalBehaviour": "SLOW_BURN",
      "tier": 1,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 30,
      "finiteReserve": 78,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "COAL_EMBER",
        "STEADY_HEAT",
        "FURNACE_FUEL"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_DEPOSIT) · ความแข็ง 30 · นำปราณ 50",
      "propertiesTh": "ถ่านหินปราณที่ติดไฟได้นานและให้ความร้อนสม่ำเสมอโดยไม่เกิดควันพิษ",
      "futureUsesTh": "ใช้เป็นเชื้อเพลิงมาตรฐานในหอโอสถและโรงหลอม"
    },
    {
      "id": "MW_MAT_ORE_085",
      "nameTh": "แร่ยิปซัมหยกขาวซับชื้น",
      "category": "ORE",
      "mineralForm": "RAW_DEPOSIT",
      "hardness": 28,
      "spiritualConductivity": 40,
      "thermalBehaviour": "DRY_COOL",
      "tier": 1,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 30,
      "finiteReserve": 78,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "GYPSUM_PURE",
        "MOISTURE_LOCK",
        "PILL_COATING"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_DEPOSIT) · ความแข็ง 28 · นำปราณ 40",
      "propertiesTh": "แร่สีขาวเนื้ออ่อนที่บดเป็นผงละเอียดได้ง่าย ช่วยดูดความชื้นและเคลือบผิวลูกกลอน",
      "futureUsesTh": "ใช้เคลือบเม็ดโอสถให้เก็บได้นานและทำแม่พิมพ์หล่อโลหะ"
    },
    {
      "id": "MW_MAT_ORE_086",
      "nameTh": "แร่กำมะถันเพลิงเหลือง",
      "category": "ORE",
      "mineralForm": "RAW_DEPOSIT",
      "hardness": 32,
      "spiritualConductivity": 58,
      "thermalBehaviour": "COMBUSTIBLE",
      "tier": 2,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 90,
      "finiteReserve": 66,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "SULFUR_FIRE",
        "PEST_REPEL",
        "EXPLOSIVE_QI"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_DEPOSIT) · ความแข็ง 32 · นำปราณ 58",
      "propertiesTh": "ก้อนแร่สีเหลืองสดจากปากปล่องน้ำพุร้อน มีกลิ่นฉุนขับไล่แมลงพิษและติดไฟง่าย",
      "futureUsesTh": "ใช้ทำยันต์ระเบิดเพลิง ผงไล่อสูรแมลง และยาแก้โรคผิวหนัง"
    },
    {
      "id": "MW_MAT_ORE_087",
      "nameTh": "แร่ไมกาเกล็ดเงินสะท้อนแสง",
      "category": "ORE",
      "mineralForm": "RAW_DEPOSIT",
      "hardness": 36,
      "spiritualConductivity": 68,
      "thermalBehaviour": "HEAT_INSULATOR",
      "tier": 2,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 90,
      "finiteReserve": 66,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "MICA_FLAKE",
        "SHIMMER_INK",
        "HEAT_SHIELD"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_DEPOSIT) · ความแข็ง 36 · นำปราณ 68",
      "propertiesTh": "แผ่นแร่บางใสซ้อนกันเป็นชั้นๆ ทนความร้อนสูงและสะท้อนแสงปราณ",
      "futureUsesTh": "บดผสมหมึกเขียนยันต์ให้เรืองแสงและบุผนังเตาหลอม"
    },
    {
      "id": "MW_MAT_ORE_088",
      "nameTh": "แร่เหล็กเขียวมรกตหนองน้ำ",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 52,
      "spiritualConductivity": 60,
      "thermalBehaviour": "MOIST_REACTIVE",
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 90,
      "finiteReserve": 66,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "BOG_IRON",
        "WOOD_COMPATIBLE",
        "POISON_HOLD"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 52 · นำปราณ 60",
      "propertiesTh": "แร่เหล็กที่ตกตะกอนอยู่ในบึงโบราณ ดูดซับปราณพฤกษาและพิษอ่อนๆ ไว้ในเนื้อแร่",
      "futureUsesTh": "ใช้ตีเคียวเกี่ยวสมุนไพร มีดชำแหละอสูร และอาวุธชุบพิษ"
    },
    {
      "id": "MW_MAT_ORE_089",
      "nameTh": "แร่พลวงเงินคมเข็ม",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 56,
      "spiritualConductivity": 75,
      "thermalBehaviour": "SHARP_CRYSTAL",
      "tier": 3,
      "element": "METAL",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "ANTIMONY_NEEDLE",
        "PIERCE_GRAIN",
        "HARDEN_ALLOY"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 56 · นำปราณ 75",
      "propertiesTh": "ผลึกแร่โลหะที่งอกเป็นแท่งเข็มแหลมคม ช่วยเพิ่มความแข็งและความคมเมื่อผสมกับเหล็ก",
      "futureUsesTh": "ใช้หลอมเข็มซัด อาวุธลับ และชุบคมกระบี่"
    },
    {
      "id": "MW_MAT_ORE_090",
      "nameTh": "หยกน้ำผึ้งอุ่นชีพจร",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 62,
      "spiritualConductivity": 80,
      "thermalBehaviour": "WARM_SOOTHING",
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "HONEY_JADE",
        "QI_NOURISH",
        "CRAFT_STABILITY"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 62 · นำปราณ 80",
      "propertiesTh": "หยกสีเหลืองอำพันเหมือนน้ำผึ้งป่า เมื่อพกติดตัวจะช่วยให้ลมปราณไหลเวียนราบรื่น",
      "futureUsesTh": "ใช้ทำด้ามเครื่องมือช่าง จี้หยกบำรุงสุขภาพ และเตาอุ่นยา"
    },
    {
      "id": "MW_MAT_ORE_091",
      "nameTh": "แร่โคบอลต์ครามสมุทร",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 64,
      "spiritualConductivity": 79,
      "thermalBehaviour": "DEEP_COOL",
      "tier": 3,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "COBALT_BLUE",
        "WATER_RESONANCE",
        "RUNE_PIGMENT"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 64 · นำปราณ 79",
      "propertiesTh": "แร่โลหะสีน้ำเงินเข้มจากโขดหินใต้ทะเล ให้สีครามสดใสไม่จางหายแม้เผาด้วยไฟแรง",
      "futureUsesTh": "ใช้เคลือบเกราะวารี ผสมหมึกรูน และตีศาสตราธาตุน้ำ"
    },
    {
      "id": "MW_MAT_ORE_092",
      "nameTh": "ศิลาปะการังฟอสซิลพันปี",
      "category": "ORE",
      "mineralForm": "RAW_DEPOSIT",
      "hardness": 60,
      "spiritualConductivity": 72,
      "thermalBehaviour": "POROUS_QI",
      "tier": 3,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 190,
      "finiteReserve": 54,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "FOSSIL_CORAL",
        "FILTER_TOXIN",
        "AQUA_WARD"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_DEPOSIT) · ความแข็ง 60 · นำปราณ 72",
      "propertiesTh": "ปะการังโบราณที่กลายเป็นหินหยก มีรูพรุนละเอียดช่วยกรองพิษและกักเก็บปราณน้ำ",
      "futureUsesTh": "ใช้ทำฐานค่ายกลกรองหมอกพิษและถ้วยกรองน้ำอมฤต"
    },
    {
      "id": "MW_MAT_ORE_093",
      "nameTh": "แร่ทังสเตนภูผาหนัก",
      "category": "ORE",
      "mineralForm": "RAW_ORE",
      "hardness": 88,
      "spiritualConductivity": 65,
      "thermalBehaviour": "EXTREME_MELT",
      "tier": 4,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "HEAVY_TUNGSTEN",
        "MELT_RESIST",
        "ARMOR_BREAKER"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (RAW_ORE) · ความแข็ง 88 · นำปราณ 65",
      "propertiesTh": "แร่โลหะสีเทาเข้มที่มีจุดหลอมเหลวสูงมากและมีน้ำหนักมหาศาล",
      "futureUsesTh": "ใช้ตีหัวค้อนศึก เกราะหนัก และแกนเสาค่ายกลต้านพายุ"
    },
    {
      "id": "MW_MAT_ORE_094",
      "nameTh": "ผลึกทัวร์มาลีนสายรุ้งนำปราณ",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 72,
      "spiritualConductivity": 91,
      "thermalBehaviour": "PIEZOELECTRIC",
      "tier": 4,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "RAINBOW_CRYSTAL",
        "QI_AMPLIFIER",
        "MULTI_PATH"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 72 · นำปราณ 91",
      "propertiesTh": "ผลึกยาวที่มีหลายสีในแท่งเดียว เมื่อถูกบีบอัดหรือรับปราณจะปล่อยกระแสพลังออกทางปลายยอด",
      "futureUsesTh": "ใช้ทำหัวพู่กันอักษรสวรรค์และแกนขยายพลังของเครื่องราง"
    },
    {
      "id": "MW_MAT_ORE_095",
      "nameTh": "แร่ไทเทเนียมเมฆาเงิน",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 83,
      "spiritualConductivity": 86,
      "thermalBehaviour": "CORROSION_IMMUNE",
      "tier": 4,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "CLOUD_TITANIUM",
        "LIGHT_STRONG",
        "SKY_ALLOY"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 83 · นำปราณ 86",
      "propertiesTh": "โลหะที่สกัดจากเสาหินเสียดฟ้า แข็งแกร่งเท่าเหล็กกล้าแต่เบากว่าครึ่งหนึ่งและไม่เป็นสนิม",
      "futureUsesTh": "ใช้ตีชุดเกราะนักรบเวหาและโครงสร้างค่ายกลลอยฟ้า"
    },
    {
      "id": "MW_MAT_ORE_096",
      "nameTh": "หินออบซิเดียนเปลวสุริยัน",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 68,
      "spiritualConductivity": 84,
      "thermalBehaviour": "RAZOR_GLASS",
      "tier": 4,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "SOLAR_OBSIDIAN",
        "DISSECT_BLADE",
        "FIRE_SHARP"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 68 · นำปราณ 84",
      "propertiesTh": "แก้วภูเขาไฟสีดำที่มีประกายสีทองแดงซ่อนอยู่ กะเทาะให้คมกริบระดับผ่าเส้นประสาทได้",
      "futureUsesTh": "ใช้ทำมีดชำแหละอวัยวะพิเศษของอสูรและหัวลูกธนูเพลิง"
    },
    {
      "id": "MW_MAT_ORE_097",
      "nameTh": "แร่บิสมัทเขาวงกตเจ็ดสี",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 55,
      "spiritualConductivity": 88,
      "thermalBehaviour": "GEOMETRIC_STEP",
      "tier": 4,
      "element": "STAR",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 330,
      "finiteReserve": 42,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "LABYRINTH_BISMUTH",
        "ARRAY_GEOMETRY",
        "MIND_MAZE"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 55 · นำปราณ 88",
      "propertiesTh": "ผลึกโลหะที่ก่อตัวเป็นขั้นบันไดสี่เหลี่ยมซ้อนกันและมีสีรุ้งเลื่อมพราย",
      "futureUsesTh": "ใช้สร้างจานค่ายกลเขาวงกตและเครื่องรางป้องกันการสะกดรอย"
    },
    {
      "id": "MW_MAT_ORE_098",
      "nameTh": "หยกม่วงจักรพรรดิเร้นลับ",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 84,
      "spiritualConductivity": 93,
      "thermalBehaviour": "NOBLE_YIN",
      "tier": 5,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 510,
      "finiteReserve": 30,
      "slowCrystalRegen": true,
      "isTranscendent": false,
      "propertyTags": [
        "PURPLE_EMPEROR_JADE",
        "SOUL_NOBILITY",
        "AUTHORITY_SEAL"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 84 · นำปราณ 93",
      "propertiesTh": "หยกสีม่วงเข้มโปร่งแสงที่พบในจุดตัดของชีพจรธรณี แผ่รัศมีน่าเกรงขาม",
      "futureUsesTh": "ใช้แกะสลักตราประทับสภาสำนักและหลอมศาสตราสายจิตวิญญาณ"
    },
    {
      "id": "MW_MAT_ORE_099",
      "nameTh": "แร่แพลทินัมดาราเยือกแข็ง",
      "category": "ORE",
      "mineralForm": "REFINED_INGOT",
      "hardness": 87,
      "spiritualConductivity": 94,
      "thermalBehaviour": "STAR_COLD",
      "tier": 5,
      "element": "ICE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 510,
      "finiteReserve": 30,
      "slowCrystalRegen": false,
      "isTranscendent": false,
      "propertyTags": [
        "FROST_STAR_PLATINUM",
        "PURE_CONDUCT",
        "CELESTIAL_METAL"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (REFINED_INGOT) · ความแข็ง 87 · นำปราณ 94",
      "propertiesTh": "โลหะขาวบริสุทธิ์จากอุกกาบาตน้ำแข็ง นำปราณเซียนและปราณเหมันต์ได้เต็มร้อยส่วน",
      "futureUsesTh": "ใช้หลอมกระบี่เซียนจันทราและเครื่องรางระดับห้า"
    },
    {
      "id": "MW_MAT_ORE_100",
      "nameTh": "ผลึกเพชรทมิฬแก่นพิภพ",
      "category": "CRYSTAL",
      "mineralForm": "CRYSTAL",
      "hardness": 100,
      "spiritualConductivity": 92,
      "thermalBehaviour": "INDESTRUCTIBLE",
      "tier": 6,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "FORGING",
        "ARRAY",
        "TALISMAN"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 730,
      "finiteReserve": 18,
      "slowCrystalRegen": true,
      "isTranscendent": true,
      "propertyTags": [
        "BLACK_EARTH_DIAMOND",
        "ABSOLUTE_HARDNESS",
        "DRILL_TIP"
      ],
      "subCategoryTh": "แร่และผลึกปราณ (CRYSTAL) · ความแข็ง 100 · นำปราณ 92",
      "propertiesTh": "ผลึกคาร์บอนปราณที่ถูกบีบอัดในแก่นพิภพ แข็งแกร่งที่สุดในบรรดาผลึกทั้งปวง",
      "futureUsesTh": "ใช้ทำหัวเจาะทำลายเกราะเซียนและฝังแกนกลางเกราะอมตะ"
    },
    {
      "id": "MW_MAT_EXO_101",
      "nameTh": "ไม้แก่นเหล็กพันปี",
      "category": "HERB",
      "exoticCategory": "SPIRIT_WOOD",
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "IRON_WOOD",
        "STURDY_SHAFT",
        "BOW_STAVE"
      ],
      "subCategoryTh": "ไม้ปราณเนื้อแข็ง (SPIRIT_WOOD · ระดับ 2)",
      "propertiesTh": "ท่อนไม้จากพงไพรบรรพกาลที่เนื้อแน่นและหนักจนจมน้ำ ทนไฟและแรงฟันดาบ",
      "futureUsesTh": "ใช้ทำด้ามทวน คันธนู และเสาค้ำอาคารสำนัก"
    },
    {
      "id": "MW_MAT_EXO_102",
      "nameTh": "ไม้ไผ่หยกกลวงสื่อเสียง",
      "category": "HERB",
      "exoticCategory": "SPIRIT_WOOD",
      "tier": 2,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "ECHO_BAMBOO",
        "SOUND_CHANNEL",
        "LIGHT_FRAME"
      ],
      "subCategoryTh": "ไผ่วิญญาณ (SPIRIT_WOOD · ระดับ 2)",
      "propertiesTh": "ลำไผ่สีเขียวใสที่ภายในมีเยื่อไผ่สะท้อนคลื่นเสียงและปราณวายุ",
      "futureUsesTh": "ใช้ทำขลุ่ยศึก กระบอกเก็บยันต์ และรางส่งน้ำปราณ"
    },
    {
      "id": "MW_MAT_EXO_103",
      "nameTh": "ไม้จันทน์หอมสงบวิญญาณ",
      "category": "HERB",
      "exoticCategory": "SPIRIT_WOOD",
      "tier": 3,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "SANDALWOOD_CALM",
        "HEART_DEMON_WARD",
        "INCENSE_WOOD"
      ],
      "subCategoryTh": "ไม้หอมศักดิ์สิทธิ์ (SPIRIT_WOOD · ระดับ 3)",
      "propertiesTh": "แก่นไม้ที่มีกลิ่นหอมเย็นติดทนนานนับร้อยปี ช่วยให้ผู้ฝึกตนเข้าสมาธิได้เร็วขึ้น",
      "futureUsesTh": "ใช้แกะสลักลูกประคำ แท่นวางคัมภีร์ และบดทำธูปบูชาบรรพชน"
    },
    {
      "id": "MW_MAT_EXO_104",
      "nameTh": "ไม้ผีเสื้อราตรีพรางเงา",
      "category": "HERB",
      "exoticCategory": "SPIRIT_WOOD",
      "tier": 3,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "SHADOW_BARK",
        "STEALTH_MEDIA",
        "DARK_WOOD"
      ],
      "subCategoryTh": "ไม้ปราณหยิน (SPIRIT_WOOD · ระดับ 3)",
      "propertiesTh": "เปลือกไม้และเนื้อไม้สีดำอมม่วงที่ดูดกลืนแสงไฟและลดกลิ่นอายของผู้ถือ",
      "futureUsesTh": "ใช้ทำฝักมีดสั้นนักฆ่า โครงหุ่นเชิด และป้ายคำสั่งลับ"
    },
    {
      "id": "MW_MAT_EXO_105",
      "nameTh": "ไม้สนสายฟ้าฟาดไม่ตาย",
      "category": "HERB",
      "exoticCategory": "SPIRIT_WOOD",
      "tier": 4,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "LIGHTNING_STRUCK_WOOD",
        "EVIL_BANE",
        "THUNDER_TALISMAN"
      ],
      "subCategoryTh": "ไม้อัสนีสวรรค์ (SPIRIT_WOOD · ระดับ 4)",
      "propertiesTh": "แก่นไม้จากต้นสนโบราณที่ถูกสายฟ้าผ่าครึ่งแต่ยังแตกกิ่งใบใหม่ได้ อัดแน่นด้วยปราณหยางและสายฟ้า",
      "futureUsesTh": "ใช้ทำกระบี่ไม้ปราบมาร เสาหลักค่ายกลสายฟ้า และตราอาญาสิทธิ์"
    },
    {
      "id": "MW_MAT_EXO_106",
      "nameTh": "ไม้โพธิ์แก้วสะท้อนธรรม",
      "category": "HERB",
      "exoticCategory": "SPIRIT_WOOD",
      "tier": 5,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 562,
      "isTranscendent": false,
      "propertyTags": [
        "BODHI_HEARTWOOD",
        "ZEN_RESONANCE",
        "SACRED_CARVING"
      ],
      "subCategoryTh": "ไม้ทิพย์โพธิญาณ (SPIRIT_WOOD · ระดับ 5)",
      "propertiesTh": "กิ่งไม้ที่ร่วงหล่นในซากอุทยานสวรรค์ เนื้อไม้โปร่งแสงและมีเสียงสวดมนต์แว่วเบาๆ",
      "futureUsesTh": "ใช้สร้างพู่กันปราชญ์ พิณเซน และแกนกลางหอสืบทอด"
    },
    {
      "id": "MW_MAT_EXO_107",
      "nameTh": "กิ่งต้นไม้โลกค้ำดารา",
      "category": "HERB",
      "exoticCategory": "SPIRIT_WOOD",
      "tier": 6,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 804,
      "isTranscendent": true,
      "propertyTags": [
        "WORLD_TREE_BRANCH",
        "INFINITE_GROWTH",
        "REALM_BRIDGE"
      ],
      "subCategoryTh": "ไม้บรรพกาล (SPIRIT_WOOD · ระดับ 6)",
      "propertiesTh": "กิ่งสดจากยอดสูงสุดของพงไพรบรรพกาลที่อาบแสงดาวและปราณชีวิตบริสุทธิ์",
      "futureUsesTh": "ใช้หลอมศาสตราพฤกษาอมตะและวางรากฐานค่ายกลระดับเซียน"
    },
    {
      "id": "MW_MAT_EXO_108",
      "nameTh": "รังไหมเงินแมงมุมหน้าคน",
      "category": "TALISMAN_MAT",
      "exoticCategory": "TALISMAN_MAT",
      "tier": 2,
      "element": "METAL",
      "primaryCraftPath": "TALISMAN",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "TOUGH_SILK",
        "NET_WEAVE",
        "CUT_RESIST"
      ],
      "subCategoryTh": "เส้นไหมอสูร (TALISMAN_MAT · ระดับ 2)",
      "propertiesTh": "เส้นใยสีเงินเหนียวหนึบที่ทนต่อคมมีดและไฟอ่อนๆ",
      "futureUsesTh": "ใช้ทอเสื้อซับในกันคมอาวุธ เย็บเล่มคัมภีร์ และทำสายธนู"
    },
    {
      "id": "MW_MAT_EXO_109",
      "nameTh": "ไหมน้ำแข็งหนอนจันทรา",
      "category": "TALISMAN_MAT",
      "exoticCategory": "TALISMAN_MAT",
      "tier": 3,
      "element": "ICE",
      "primaryCraftPath": "TALISMAN",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "FROST_SILK",
        "COOL_ROBE",
        "PURE_FABRIC"
      ],
      "subCategoryTh": "เส้นไหมวิญญาณ (TALISMAN_MAT · ระดับ 3)",
      "propertiesTh": "เส้นไหมสีขาวประกายฟ้าจากหนอนปราณบนทุ่งทุนดรา สวมใส่แล้วเย็นสบายป้องกันปราณร้อน",
      "futureUsesTh": "ใช้ทออาภรณ์เซียนจันทราและผ้าพันแผลไฟไหม้"
    },
    {
      "id": "MW_MAT_EXO_110",
      "nameTh": "ไหมทองคำสวรรค์ทอเมฆ",
      "category": "TALISMAN_MAT",
      "exoticCategory": "TALISMAN_MAT",
      "tier": 5,
      "element": "LIGHT",
      "primaryCraftPath": "TALISMAN",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 562,
      "isTranscendent": false,
      "propertyTags": [
        "CELESTIAL_GOLD_SILK",
        "SPELL_RESIST",
        "ROYAL_VESTMENT"
      ],
      "subCategoryTh": "แพรไหมทิพย์ (TALISMAN_MAT · ระดับ 5)",
      "propertiesTh": "เส้นไหมสีทองอร่ามที่กู้ได้จากซากตำหนักเซียน เบาราวปุยเมฆแต่ต้านทานคมกระบี่และคาถา",
      "futureUsesTh": "ใช้ทอจีวรทองคำ ม้วนคัมภีร์ระดับสูง และธงมหาค่ายกล"
    },
    {
      "id": "MW_MAT_EXO_111",
      "nameTh": "ขี้ผึ้งอสูรหยกผนึกปราณ",
      "category": "TALISMAN_MAT",
      "exoticCategory": "TALISMAN_MAT",
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "TALISMAN",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "SPIRIT_WAX",
        "AIRTIGHT_SEAL",
        "CANDLE_FUEL"
      ],
      "subCategoryTh": "ขี้ผึ้งวิญญาณ (TALISMAN_MAT · ระดับ 2)",
      "propertiesTh": "ขี้ผึ้งสีเขียวหยกจากรังผึ้งปราณ ช่วยเก็บรักษาฤทธิ์ยาและอวัยวะอสูรไม่ให้เสื่อมสภาพ",
      "futureUsesTh": "ใช้ผนึกขวดโอสถ เคลือบกระดาษยันต์กันน้ำ และหล่อเทียนเดินปราณ"
    },
    {
      "id": "MW_MAT_EXO_112",
      "nameTh": "ขี้ผึ้งศพเพลิงวิญญาณ",
      "category": "VENOM_GU",
      "exoticCategory": "VENOM_GU",
      "tier": 4,
      "element": "YIN",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "GHOST_WAX",
        "SOUL_FLAME",
        "ILLUSION_SMOKE"
      ],
      "subCategoryTh": "ไขมันและขี้ผึ้งอาถรรพ์ (VENOM_GU · ระดับ 4)",
      "propertiesTh": "ขี้ผึ้งสีซีดที่เกิดในสุสานโบราณ เมื่อจุดไฟจะให้เปลวสีเขียวครามที่เผาผลาญเฉพาะปราณจิต",
      "futureUsesTh": "ใช้ทำเทียนสะกดวิญญาณและปรุงพิษทำลายสมาธิ"
    },
    {
      "id": "MW_MAT_EXO_113",
      "nameTh": "ดินทิพย์ห้าสีแปลงเกษตร",
      "category": "ORE",
      "exoticCategory": "SACRED_SOIL",
      "tier": 2,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "FERTILE_SOIL",
        "CROP_ACCEL",
        "ROOT_NOURISH"
      ],
      "subCategoryTh": "ดินวิญญาณ (SACRED_SOIL · ระดับ 2)",
      "propertiesTh": "ดินร่วนห้าสีที่อุดมด้วยแร่ธาตุและปราณธรณี ช่วยให้สมุนไพรเติบโตเร็วและให้ผลผลิตสมบูรณ์",
      "futureUsesTh": "ใช้บำรุงแปลงสวนสมุนไพรวิญญาณและเพาะเมล็ดพันธุ์หายาก"
    },
    {
      "id": "MW_MAT_EXO_114",
      "nameTh": "โคลนหยกสมุทรดูดพิษ",
      "category": "ORE",
      "exoticCategory": "SACRED_SOIL",
      "tier": 3,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "DETOX_MUD",
        "COOL_BURN",
        "SKIN_REPAIR"
      ],
      "subCategoryTh": "โคลนปราณบำบัด (SACRED_SOIL · ระดับ 3)",
      "propertiesTh": "โคลนเนื้อเนียนละเอียดจากก้นทะเลสาบและร่องสมุทร ดูดซับพิษร้อนและรังสีตกค้างได้ดีเยี่ยม",
      "futureUsesTh": "ใช้พอกถอนพิษอสูร บำรุงผิวหนังเหล็กไหล และอุดรอยรั่วเตาหลอม"
    },
    {
      "id": "MW_MAT_EXO_115",
      "nameTh": "ทรายดาราแม่เหล็กไหล",
      "category": "ORE",
      "exoticCategory": "SACRED_SOIL",
      "tier": 4,
      "element": "STAR",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "ASTRAL_SAND",
        "GRAVITY_SHIFT",
        "ARRAY_DRAW"
      ],
      "subCategoryTh": "ทรายแร่วิญญาณ (SACRED_SOIL · ระดับ 4)",
      "propertiesTh": "เม็ดทรายสีเงินดำที่เคลื่อนไหวตามกระแสปราณจิต ใช้โรยวาดลวดลายค่ายกลได้อย่างรวดเร็ว",
      "futureUsesTh": "ใช้ตั้งค่ายกลเคลื่อนที่และขัดเงาศาสตราอุกกาบาต"
    },
    {
      "id": "MW_MAT_EXO_116",
      "nameTh": "ดินปฐมกาลลมหายใจโลก",
      "category": "ORE",
      "exoticCategory": "SACRED_SOIL",
      "tier": 6,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 804,
      "isTranscendent": true,
      "propertyTags": [
        "GENESIS_SOIL",
        "PLANT_REVIVE",
        "WALL_REPAIR"
      ],
      "subCategoryTh": "ดินศักดิ์สิทธิ์ระดับเซียน (SACRED_SOIL · ระดับ 6)",
      "propertiesTh": "ก้อนดินสีทองที่มีปราณก่อกำเนิดไหลเวียน สามารถปลูกพืชเหนือโลกและซ่อมแซมรากฐานที่สึกหรอ",
      "futureUsesTh": "ใช้เพาะสมุนไพรระดับตำนานและหลอมตราปฐพีพิทักษ์สำนัก"
    },
    {
      "id": "MW_MAT_EXO_117",
      "nameTh": "น้ำพุร้อนกำมะถันล้างไขกระดูก",
      "category": "SPIRIT_LIQUID",
      "exoticCategory": "SPIRIT_LIQUID",
      "tier": 2,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "THERMAL_SPRING",
        "MUSCLE_RELAX",
        "QUENCH_BLADE"
      ],
      "subCategoryTh": "น้ำแร่วิญญาณ (SPIRIT_LIQUID · ระดับ 2)",
      "propertiesTh": "น้ำแร่ร้อนจัดที่มีปราณอัคคีและแร่ธาตุละลายอยู่ ช่วยคลายเส้นเอ็นที่ตึงเครียด",
      "futureUsesTh": "ใช้ชุบเหล็กตีดาบและผสมน้ำอาบฟื้นฟูความเหนื่อยล้า"
    },
    {
      "id": "MW_MAT_EXO_118",
      "nameTh": "น้ำค้างไผ่ม่วงยามอรุณ",
      "category": "SPIRIT_LIQUID",
      "exoticCategory": "SPIRIT_LIQUID",
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "MORNING_DEW",
        "INK_SOLVENT",
        "PURE_SOLVENT"
      ],
      "subCategoryTh": "น้ำค้างปราณ (SPIRIT_LIQUID · ระดับ 2)",
      "propertiesTh": "หยดน้ำค้างที่กลั่นตัวบนใบไผ่ยามรุ่งสาง บริสุทธิ์ไร้สิ่งเจือปน",
      "futureUsesTh": "ใช้ฝนหมึกเขียนยันต์ ชงชาวิญญาณ และเป็นตัวทำละลายในโอสถทุกชนิด"
    },
    {
      "id": "MW_MAT_EXO_119",
      "nameTh": "น้ำกรดพิษบึงทมิฬ",
      "category": "VENOM_GU",
      "exoticCategory": "VENOM_GU",
      "tier": 3,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "CORROSIVE_ACID",
        "ARMOR_MELT",
        "RUST_STRIP"
      ],
      "subCategoryTh": "ของเหลวพิษ (VENOM_GU · ระดับ 3)",
      "propertiesTh": "ของเหลวสีเขียวคล้ำจากบึงหมอกพิษที่มีฤทธิ์กัดกร่อนโลหะและม่านปราณ",
      "futureUsesTh": "ใช้ชุบอาวุธสังหาร ล้างสนิมโบราณวัตถุ และสกัดพิษกู่"
    },
    {
      "id": "MW_MAT_EXO_120",
      "nameTh": "น้ำตาหินงอกถ้ำผลึก",
      "category": "SPIRIT_LIQUID",
      "exoticCategory": "SPIRIT_LIQUID",
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "STALACTITE_TEAR",
        "BONE_MEND",
        "EARTH_QI_LIQUID"
      ],
      "subCategoryTh": "นมศิลา (SPIRIT_LIQUID · ระดับ 3)",
      "propertiesTh": "หยดน้ำแร่ที่ซึมผ่านชั้นหินผลึกนับพันปี อุดมด้วยแคลเซียมปราณและไอธรณี",
      "futureUsesTh": "ใช้ปรุงโอสถต่อกระดูกและฟื้นฟูตันเถียน"
    },
    {
      "id": "MW_MAT_EXO_121",
      "nameTh": "น้ำหนักสมุทรลึกหมื่นวา",
      "category": "SPIRIT_LIQUID",
      "exoticCategory": "SPIRIT_LIQUID",
      "tier": 4,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "HEAVY_ABYSS_WATER",
        "FORCE_MULTIPLIER",
        "QUENCH_HEAVY"
      ],
      "subCategoryTh": "วารีแรงดันสูง (SPIRIT_LIQUID · ระดับ 4)",
      "propertiesTh": "น้ำจากก้นร่องสมุทรที่มีความหนาแน่นสูงกว่าน้ำปกติหลายเท่า เพียงหนึ่งขวดก็หนักอึ้ง",
      "futureUsesTh": "ใช้ชุบแข็งศาสตราหนักและปรุงโอสถสายวารีสมุทร"
    },
    {
      "id": "MW_MAT_EXO_122",
      "nameTh": "น้ำอมฤตสระกระจกสวรรค์",
      "category": "SPIRIT_LIQUID",
      "exoticCategory": "SPIRIT_LIQUID",
      "tier": 5,
      "element": "LIGHT",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 562,
      "isTranscendent": false,
      "propertyTags": [
        "CELESTIAL_POOL_NECTAR",
        "SOUL_PURIFY",
        "MERIDIAN_HEAL"
      ],
      "subCategoryTh": "น้ำทิพย์โบราณ (SPIRIT_LIQUID · ระดับ 5)",
      "propertiesTh": "น้ำทิพย์เรืองแสงจากสระโบราณในซากอุทยานสวรรค์ ดื่มเพียงอึกเดียวช่วยให้จิตใจสว่างไสว",
      "futureUsesTh": "ใช้ปรุงมหาโอสถระดับสูงและชะล้างพิษโอสถสะสม"
    },
    {
      "id": "MW_MAT_EXO_123",
      "nameTh": "เถ้าภูเขาไฟอัดปราณเพลิง",
      "category": "ORE",
      "exoticCategory": "FORMATION_MEDIA",
      "tier": 2,
      "element": "FIRE",
      "primaryCraftPath": "ARRAY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "VOLCANIC_ASH",
        "HEAT_INSULATION",
        "FERTILIZER_FIRE"
      ],
      "subCategoryTh": "เถ้าถ่านและผงแร่ (FORMATION_MEDIA · ระดับ 2)",
      "propertiesTh": "ผงเถ้าละเอียดจากแอ่งอัคคีที่ยังอมความร้อนไว้ภายใน",
      "futureUsesTh": "ใช้โรยรักษาอุณหภูมิเตาหลอมและบำรุงสมุนไพรธาตุไฟ"
    },
    {
      "id": "MW_MAT_EXO_124",
      "nameTh": "เถ้ากระดูกอสูรสงคราม",
      "category": "ORE",
      "exoticCategory": "FORMATION_MEDIA",
      "tier": 3,
      "element": "YIN",
      "primaryCraftPath": "ARRAY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "BONE_ASH",
        "STEEL_CARBON",
        "GHOST_BARRIER"
      ],
      "subCategoryTh": "ผงกระดูกปราณ (FORMATION_MEDIA · ระดับ 3)",
      "propertiesTh": "เถ้ากระดูกสีขาวเทาจากสมรภูมิโบราณ เมื่อผสมลงในเหล็กหลอมจะทำให้ใบดาบแข็งและคมยิ่งขึ้น",
      "futureUsesTh": "ใช้ผสมเหล็กตีศาสตราและโรยเส้นเขตแดนค่ายกลหยิน"
    },
    {
      "id": "MW_MAT_EXO_125",
      "nameTh": "เกลือสายฟ้าสีคราม",
      "category": "ORE",
      "exoticCategory": "FORMATION_MEDIA",
      "tier": 3,
      "element": "LIGHTNING",
      "primaryCraftPath": "ARRAY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "THUNDER_SALT",
        "CONDUCT_LINE",
        "SHOCK_POWDER"
      ],
      "subCategoryTh": "เกลือแร่ปราณ (FORMATION_MEDIA · ระดับ 3)",
      "propertiesTh": "ผลึกเกลือที่เกิดจากการที่สายฟ้าผ่าลงบนแอ่งเกลือแร่ แตกประจุไฟฟ้าเมื่อโดนความชื้น",
      "futureUsesTh": "ใช้ลากเส้นเชื่อมต่อค่ายกลสายฟ้าและทำระเบิดแสงอัสนี"
    },
    {
      "id": "MW_MAT_EXO_126",
      "nameTh": "ผงเขม่าสนดำพันปี",
      "category": "TALISMAN_MAT",
      "exoticCategory": "TALISMAN_MAT",
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "TALISMAN",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "PINE_SOOT",
        "INK_CARBON",
        "STABLE_LINE"
      ],
      "subCategoryTh": "วัตถุดิบปรุงหมึก (TALISMAN_MAT · ระดับ 2)",
      "propertiesTh": "เขม่าควันจากการเผาไม้สนปราณอย่างช้าๆ เนื้อละเอียดดำสนิทเกาะติดกระดาษยันต์แน่น",
      "futureUsesTh": "ใช้ทำแท่งหมึกมาตรฐานสำหรับคัดลอกคัมภีร์และเขียนยันต์ขั้นต้น"
    },
    {
      "id": "MW_MAT_EXO_127",
      "nameTh": "ผงมุกสมุทรเรืองแสง",
      "category": "TALISMAN_MAT",
      "exoticCategory": "TALISMAN_MAT",
      "tier": 3,
      "element": "WATER",
      "primaryCraftPath": "TALISMAN",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "PEARL_POWDER",
        "LUMINOUS_INK",
        "SKIN_HEAL"
      ],
      "subCategoryTh": "ผงอัญมณีวิญญาณ (TALISMAN_MAT · ระดับ 3)",
      "propertiesTh": "ผงไข่มุกบดละเอียดจากหอยปราณทะเลลึก ให้ประกายสีขาวเงินและเชื่อมปราณจิตได้ดี",
      "futureUsesTh": "ใช้ผสมหมึกจารึกคัมภีร์ชั้นสูงและปรุงโอสถบำรุงผิวพรรณ"
    },
    {
      "id": "MW_MAT_EXO_128",
      "nameTh": "หมึกโลหิตชาดสนามรบ",
      "category": "TALISMAN_MAT",
      "exoticCategory": "TALISMAN_MAT",
      "tier": 4,
      "element": "FIRE",
      "primaryCraftPath": "TALISMAN",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "BATTLE_BLOOD_INK",
        "OFFENSIVE_TALISMAN",
        "FIERCE_QI"
      ],
      "subCategoryTh": "หมึกอาคมศึก (TALISMAN_MAT · ระดับ 4)",
      "propertiesTh": "หมึกที่เคี่ยวจากแร่ชาดและผลึกโลหิตในสมรภูมิ มีกลิ่นอายสังหารที่รุนแรง",
      "futureUsesTh": "ใช้เขียนยันต์โจมตี จารึกอักขระรูนสายรุก และตั้งค่ายกลสังหาร"
    },
    {
      "id": "MW_MAT_EXO_129",
      "nameTh": "หมึกดาราจักรเจ็ดแสง",
      "category": "TALISMAN_MAT",
      "exoticCategory": "TALISMAN_MAT",
      "tier": 5,
      "element": "STAR",
      "primaryCraftPath": "TALISMAN",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 562,
      "isTranscendent": false,
      "propertyTags": [
        "STARLIGHT_INK",
        "HEAVEN_RUNE",
        "SYNTHESIS_CATALYST"
      ],
      "subCategoryTh": "หมึกทิพย์ระดับสูง (TALISMAN_MAT · ระดับ 5)",
      "propertiesTh": "หมึกวิเศษที่ปรุงจากน้ำค้างดาราและผงแร่อุกกาบาต เส้นหมึกเปลี่ยนสีตามแสงดาว",
      "futureUsesTh": "ใช้คัดลอกคัมภีร์ระดับตำนานและเทียบเคล็ดอนุมานวิชาใหม่"
    },
    {
      "id": "MW_MAT_EXO_130",
      "nameTh": "แผ่นธงอาคมผ้าไหมคราม",
      "category": "ORE",
      "exoticCategory": "FORMATION_MEDIA",
      "tier": 2,
      "element": "WIND",
      "primaryCraftPath": "ARRAY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 100,
      "isTranscendent": false,
      "propertyTags": [
        "ARRAY_FLAG",
        "WIND_CHANNEL",
        "PORTABLE_WARD"
      ],
      "subCategoryTh": "อุปกรณ์ตั้งค่ายกล (FORMATION_MEDIA · ระดับ 2)",
      "propertiesTh": "ธงผ้าไหมทอผสมเส้นใยปราณพร้อมด้ามไม้ไผ่หยก ใช้ปักกำหนดทิศทางของค่ายกล",
      "futureUsesTh": "ใช้ตั้งค่ายกลคุ้มครองสำนักและค่ายพักแรมระหว่างสำรวจ"
    },
    {
      "id": "MW_MAT_EXO_131",
      "nameTh": "จานศิลาแปดทิศหยินหยาง",
      "category": "ORE",
      "exoticCategory": "FORMATION_MEDIA",
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "ARRAY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "BAGUA_DISK",
        "ARRAY_ANCHOR",
        "STABILIZE_QI"
      ],
      "subCategoryTh": "ฐานค่ายกล (FORMATION_MEDIA · ระดับ 3)",
      "propertiesTh": "จานหินสลักลายปากั้วแปดทิศ ใช้เป็นจุดศูนย์กลางในการกระจายปราณสู่เสาค่ายกล",
      "futureUsesTh": "ใช้จารึกมหาค่ายกลและควบคุมทิศทางลมปราณในหอฝึก"
    },
    {
      "id": "MW_MAT_EXO_132",
      "nameTh": "เสาหยกสื่อชีพจรธรณี",
      "category": "ORE",
      "exoticCategory": "FORMATION_MEDIA",
      "tier": 4,
      "element": "EARTH",
      "primaryCraftPath": "ARRAY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "VEIN_PILLAR",
        "EARTH_LINK",
        "BARRIER_STRENGTH"
      ],
      "subCategoryTh": "เสาหลักค่ายกล (FORMATION_MEDIA · ระดับ 4)",
      "propertiesTh": "เสาหยกแกะสลักที่ตอกลงสู่พื้นดินเพื่อดึงปราณจากเส้นชีพจรโลกมาหล่อเลี้ยงม่านพลัง",
      "futureUsesTh": "ใช้สร้างและซ่อมแซมมหาค่ายกลพิทักษ์สำนักระดับสูง"
    },
    {
      "id": "MW_MAT_EXO_133",
      "nameTh": "แกนผลึกสุญตาตรึงมิติ",
      "category": "ORE",
      "exoticCategory": "FORMATION_MEDIA",
      "tier": 5,
      "element": "VOID",
      "primaryCraftPath": "ARRAY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 562,
      "isTranscendent": false,
      "propertyTags": [
        "VOID_ARRAY_CORE",
        "SPACE_LOCK",
        "RIFT_STABILIZE"
      ],
      "subCategoryTh": "แกนค่ายกลข้ามภพ (FORMATION_MEDIA · ระดับ 5)",
      "propertiesTh": "ผลึกทรงกลมที่ดูดซับแรงสั่นสะเทือนของรอยแยกมิติ ป้องกันไม่ให้ค่ายกลพังทลายจากพายุปราณ",
      "futureUsesTh": "ใช้ตั้งค่ายกลระดับห้าและเสริมเสถียรภาพการสำรวจแดนหมื่นภพ"
    },
    {
      "id": "MW_MAT_EXO_134",
      "nameTh": "ไอปราณกระบี่ตกค้างพันปี",
      "category": "RELIC_ESSENCE",
      "exoticCategory": "RELIC_ESSENCE",
      "tier": 4,
      "element": "METAL",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "SWORD_INTENT_RESIDUE",
        "SHARP_INSIGHT",
        "WEAPON_TEMPER"
      ],
      "subCategoryTh": "ปรากฏการณ์ปราณตกค้าง (RELIC_ESSENCE · ระดับ 4)",
      "propertiesTh": "กลุ่มก้อนเจตจำนงกระบี่ที่ยังไม่สลายไปในสมรภูมิโบราณ ต้องใช้ขวดหยกผนึกเก็บ",
      "futureUsesTh": "ใช้หลอมคมศาสตราให้มีจิตกระบี่และช่วยในการเพ่งศึกษาวิชา"
    },
    {
      "id": "MW_MAT_EXO_135",
      "nameTh": "เสียงสะท้อนสวดมนต์โบราณ",
      "category": "RELIC_ESSENCE",
      "exoticCategory": "RELIC_ESSENCE",
      "tier": 4,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "CHANT_ECHO",
        "SOUL_SOOTHE",
        "ZEN_CATALYST"
      ],
      "subCategoryTh": "ปรากฏการณ์จิตวิญญาณ (RELIC_ESSENCE · ระดับ 4)",
      "propertiesTh": "คลื่นเสียงศักดิ์สิทธิ์ที่ก้องกังวานอยู่ในซากวิหารร้าง ช่วยขับไล่จิตมารและเปิดปัญญา",
      "futureUsesTh": "ใช้ประกอบการถอดความคัมภีร์โบราณและปรุงโอสถสงบจิต"
    },
    {
      "id": "MW_MAT_EXO_136",
      "nameTh": "เปลวไฟวิญญาณไม่รู้ดับ",
      "category": "RELIC_ESSENCE",
      "exoticCategory": "RELIC_ESSENCE",
      "tier": 5,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 562,
      "isTranscendent": false,
      "propertyTags": [
        "ETERNAL_WISP",
        "ALCHEMICAL_FLAME",
        "SPIRIT_IGNITE"
      ],
      "subCategoryTh": "ไฟทิพย์ตกค้าง (RELIC_ESSENCE · ระดับ 5)",
      "propertiesTh": "ลูกไฟสีครามอมทองที่ลอยอยู่ในเตาหลอมร้างยุคโบราณ ไม่ต้องใช้เชื้อเพลิงแต่ไม่เคยมอดดับ",
      "futureUsesTh": "ใช้ยกระดับไฟในเตาโอสถและปลุกจิตศาสตราธาตุไฟ"
    },
    {
      "id": "MW_MAT_EXO_137",
      "nameTh": "หยดน้ำค้างกาลเวลาหยุดนิ่ง",
      "category": "RELIC_ESSENCE",
      "exoticCategory": "RELIC_ESSENCE",
      "tier": 6,
      "element": "VOID",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 804,
      "isTranscendent": true,
      "propertyTags": [
        "TIME_DEW",
        "PRESERVE_ETERNAL",
        "LONGEVITY_ESSENCE"
      ],
      "subCategoryTh": "ปรากฏการณ์มิติเวลา (RELIC_ESSENCE · ระดับ 6)",
      "propertiesTh": "หยดน้ำค้างที่ลอยค้างอยู่กลางอากาศในรอยแยกมิติ ภายในหยดน้ำเวลาเดินช้ากว่าภายนอกร้อยเท่า",
      "futureUsesTh": "ใช้ปรุงมหาโอสถยืดอายุขัยและเก็บรักษาวัตถุดิบเหนือโลก"
    },
    {
      "id": "MW_MAT_EXO_138",
      "nameTh": "เศษศิลาจารึกอักษรเทวะ",
      "category": "RELIC_ESSENCE",
      "exoticCategory": "RELIC_ESSENCE",
      "tier": 4,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "RUNE_FRAGMENT",
        "DECIPHER_AID",
        "ANCIENT_LORE"
      ],
      "subCategoryTh": "โบราณวัตถุความรู้ (RELIC_ESSENCE · ระดับ 4)",
      "propertiesTh": "ชิ้นส่วนแผ่นหินที่มีอักขระยุคบรรพกาลสลักอยู่ แม้ไม่ครบแผ่นแต่แฝงหลักการโคจรปราณ",
      "futureUsesTh": "ใช้ช่วยถอดความมรดกเร้นลับและวิจัยตำรับโบราณ"
    },
    {
      "id": "MW_MAT_EXO_139",
      "nameTh": "ผงสนิมศาสตราเซียนร่วงหล่น",
      "category": "RELIC_ESSENCE",
      "exoticCategory": "RELIC_ESSENCE",
      "tier": 3,
      "element": "METAL",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 210,
      "isTranscendent": false,
      "propertyTags": [
        "IMMORTAL_RUST",
        "ALLOY_CATALYST",
        "SPIRIT_CONDUCT"
      ],
      "subCategoryTh": "ผงโลหะโบราณ (RELIC_ESSENCE · ระดับ 3)",
      "propertiesTh": "ผงสนิมสีทองหม่นที่ร่วงจากศาสตราหักในสมรภูมิ แม้เสื่อมสภาพแต่ยังมีโครงสร้างโลหะชั้นสูง",
      "futureUsesTh": "ใช้ผสมลงในเบ้าหลอมเพื่อยกระดับคุณภาพเหล็กสามัญ"
    },
    {
      "id": "MW_MAT_EXO_140",
      "nameTh": "ละอองฝันผีเสื้อพันปี",
      "category": "RELIC_ESSENCE",
      "exoticCategory": "RELIC_ESSENCE",
      "tier": 4,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 364,
      "isTranscendent": false,
      "propertyTags": [
        "DREAM_DUST",
        "ILLUSION_BOOST",
        "SLEEP_WARD"
      ],
      "subCategoryTh": "แก่นมายาตกค้าง (RELIC_ESSENCE · ระดับ 4)",
      "propertiesTh": "ละอองแสงสีเงินม่วงที่ลอยเหนือทะเลสาบกระจกยามค่ำคืน บันทึกภาพความฝันของผู้ฝึกตนในอดีต",
      "futureUsesTh": "ใช้ปรุงโอสถสายจ้าวมายาฝันและเขียนยันต์ลวงตา"
    },
    {
      "id": "MW_MAT_BP_141",
      "nameTh": "เขี้ยวโค้งงูไม้หนาม",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "tier": 1,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 29,
      "isTranscendent": false,
      "propertyTags": [
        "THORN_FANG",
        "MILD_VENOM",
        "PIERCE"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (FANG_CLAW · ระดับ 1)",
      "propertiesTh": "เขี้ยวแหลมเล็กที่มีร่องน้ำพิษตื้นๆ แข็งและคมเหมือนหนามไม้",
      "futureUsesTh": "ใช้ทำหัวลูกดอกซัดและมีดสั้นฝึกหัด"
    },
    {
      "id": "MW_MAT_BP_142",
      "nameTh": "กระดองปูศิลาลำธาร",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 1,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 29,
      "isTranscendent": false,
      "propertyTags": [
        "STREAM_SHELL",
        "HARD_PLATE",
        "CALCIUM"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 1)",
      "propertiesTh": "กระดองปูน้ำจืดที่กินแร่หินจนเปลือกแข็งคล้ายโล่ขนาดย่อม",
      "futureUsesTh": "ใช้ทำสนับแขนเกราะเบาและบดผสมยาบำรุงกระดูก"
    },
    {
      "id": "MW_MAT_BP_143",
      "nameTh": "ขนหางกระรอกบินเมฆา",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "tier": 1,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 29,
      "isTranscendent": false,
      "propertyTags": [
        "GLIDE_FUR",
        "SOFT_BRUSH",
        "WIND_TOUCH"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SPIRIT_HAIR_FEATHER · ระดับ 1)",
      "propertiesTh": "ขนหางฟูฟ่องที่อุ้มลมได้ดีและนุ่มเนียนเป็นพิเศษ",
      "futureUsesTh": "ใช้ทำพู่กันเขียนยันต์ขั้นต้นและบุรองเท้าเดินป่า"
    },
    {
      "id": "MW_MAT_BP_144",
      "nameTh": "ถุงกรดมดเกราะทองแดง",
      "category": "BEAST_PART",
      "anatomyType": "VENOM_GLAND",
      "tier": 1,
      "element": "METAL",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 29,
      "isTranscendent": false,
      "propertyTags": [
        "FORMIC_ACID",
        "ETCH_METAL",
        "STING_JUICE"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (VENOM_GLAND · ระดับ 1)",
      "propertiesTh": "ถุงน้ำกรดขนาดเล็กจากมดงานที่ขุดรังในสายแร่",
      "futureUsesTh": "ใช้ล้างคราบตะกรันโลหะและปรุงยาแก้พิษแมลง"
    },
    {
      "id": "MW_MAT_BP_145",
      "nameTh": "หนังกบหมอกพิษลายจุด",
      "category": "BEAST_PART",
      "anatomyType": "HIDE_PELT",
      "tier": 1,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 29,
      "isTranscendent": false,
      "propertyTags": [
        "SLIME_SKIN",
        "WATER_PROOF",
        "TOXIN_RESIST"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (HIDE_PELT · ระดับ 1)",
      "propertiesTh": "หนังเหนียวลื่นที่กันน้ำและทนต่อไอพิษในบึง",
      "futureUsesTh": "ใช้ทำถุงใส่วัตถุดิบพิษและถุงมือเก็บสมุนไพร"
    },
    {
      "id": "MW_MAT_BP_146",
      "nameTh": "เขากวางผาหินปูน",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "tier": 1,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 29,
      "isTranscendent": false,
      "propertyTags": [
        "CLIFF_HORN",
        "STURDY_GRIP",
        "BONE_TONIC"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BONE_HORN · ระดับ 1)",
      "propertiesTh": "เขาสั้นแต่เนื้อแน่นแข็งแรงจากการขวิดหินผา",
      "futureUsesTh": "ใช้ทำด้ามอาวุธและฝนเป็นผงปรุงยาชูกำลัง"
    },
    {
      "id": "MW_MAT_BP_147",
      "nameTh": "ปีกแมลงทับผลึกเขียว",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "IRIDESCENT_ELYTRA",
        "LIGHT_SHIELD",
        "TALISMAN_INLAY"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 2)",
      "propertiesTh": "ปีกแข็งสีเขียวมรกตเหลือบfทองที่เบามากแต่ไม่เปราะ",
      "futureUsesTh": "ใช้ประดับเกราะเบาและบดทำสีเขียนยันต์"
    },
    {
      "id": "MW_MAT_BP_148",
      "nameTh": "เส้นเอ็นจระเข้บึงทมิฬ",
      "category": "BEAST_PART",
      "anatomyType": "TENDON_TAIL",
      "tier": 2,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "SWAMP_SINEW",
        "HIGH_TENSION",
        "TOUGH_CORD"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (TENDON_TAIL · ระดับ 2)",
      "propertiesTh": "เส้นเอ็นหางที่ทรงพลังและไม่เปื่อยยุ่ยแม้แช่น้ำนาน",
      "futureUsesTh": "ใช้ขึงคันธนูหนักและรัดข้อต่อชุดเกราะ"
    },
    {
      "id": "MW_MAT_BP_149",
      "nameTh": "ครีบฉลามทรายทอง",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "tier": 2,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "SAND_CUTTER",
        "BLADE_FIN",
        "EARTH_SWIM"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (FANG_CLAW · ระดับ 2)",
      "propertiesTh": "ครีบหลังที่แข็งและคมดั่งใบมีดสำหรับแหวกว่ายในทะเลทราย",
      "futureUsesTh": "ใช้ตีใบมีดโค้งและหัวหอกซัด"
    },
    {
      "id": "MW_MAT_BP_150",
      "nameTh": "ถุงลมกบสายฟ้าคำราม",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "tier": 2,
      "element": "LIGHTNING",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "THUNDER_SAC",
        "SONIC_BLAST",
        "QI_BELLOWS"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (HEART_GALL · ระดับ 2)",
      "propertiesTh": "ถุงลมใต้คางที่ขยายตัวได้สามเท่าและสะท้อนคลื่นสายฟ้า",
      "futureUsesTh": "ใช้ทำสูบลมเตาหลอมและเครื่องรางเสียงคำราม"
    },
    {
      "id": "MW_MAT_BP_151",
      "nameTh": "ขนเม่นเหล็กเพลิง",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "tier": 2,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "IRON_QUILL",
        "FIRE_NEEDLE",
        "PIERCE_DEFENSE"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SPIRIT_HAIR_FEATHER · ระดับ 2)",
      "propertiesTh": "ขนหนามแข็งดั่งลวดเหล็กที่มีปลายอมความร้อน",
      "futureUsesTh": "ใช้ทำเข็มซัดเพลิงและปักเสริมเกราะไหล่"
    },
    {
      "id": "MW_MAT_BP_152",
      "nameTh": "เกล็ดปลาคาร์ปกระจกเจ็ดสี",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 2,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "MIRROR_SCALE",
        "MIND_CALM",
        "LUCKY_CHARM"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 2)",
      "propertiesTh": "เกล็ดกลมใสที่สะท้อนแสงเป็นสีรุ้งและมีปราณมงคลอ่อนๆ",
      "futureUsesTh": "ใช้ทำจี้คุ้มครองดวงจิตและส่วนผสมโอสถประคองใจ"
    },
    {
      "id": "MW_MAT_BP_153",
      "nameTh": "เลือดอุ่นแพะภูผาหิมะ",
      "category": "BEAST_PART",
      "anatomyType": "BLOOD",
      "tier": 2,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "WARM_BLOOD",
        "COLD_WARD",
        "VITALITY_INK"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BLOOD · ระดับ 2)",
      "propertiesTh": "โลหิตของสัตว์ที่อาศัยบนยอดเขาหนาวจัด มีฤทธิ์อุ่นร้อนต้านความหนาว",
      "futureUsesTh": "ใช้ผสมหมึกเขียนยันต์กันหนาวและปรุงโอสถบำรุงเลือด"
    },
    {
      "id": "MW_MAT_BP_154",
      "nameTh": "ตาข่ายใยแมงมุมเห็ดเรืองแสง",
      "category": "BEAST_PART",
      "anatomyType": "TENDON_TAIL",
      "tier": 2,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "SPORE_WEB",
        "STICKY_BIND",
        "FILTER_CLOTH"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (TENDON_TAIL · ระดับ 2)",
      "propertiesTh": "แผ่นใยแมงมุมที่ถักทอร่วมกับเส้นใยเห็ดทิพย์ เหนียวและกรองพิษได้",
      "futureUsesTh": "ใช้ทำหน้ากากกันหมอกพิษและถุงกรองน้ำยา"
    },
    {
      "id": "MW_MAT_BP_155",
      "nameTh": "กรงเล็บตัวตุ่นขุดแร่",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "tier": 2,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 86,
      "isTranscendent": false,
      "propertyTags": [
        "DIGGER_CLAW",
        "ROCK_BREAKER",
        "MINING_AID"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (FANG_CLAW · ระดับ 2)",
      "propertiesTh": "กรงเล็บหน้าทรงพลั่วที่แข็งแกร่งพอจะขุดเจาะหินแร่ได้โดยไม่บิ่น",
      "futureUsesTh": "ใช้ตีเครื่องมือขุดแร่และสนับมือทะลวงเกราะ"
    },
    {
      "id": "MW_MAT_BP_156",
      "nameTh": "เขี้ยวพิษงูทะเลปล่องไฟ",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "tier": 3,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "BOILING_VENOM_FANG",
        "HEAT_PIERCE",
        "ABYSS_BITE"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (FANG_CLAW · ระดับ 3)",
      "propertiesTh": "เขี้ยวอสรพิษจากร่องสมุทรร้อนที่มีทั้งพิษประสาทและปราณความร้อนสูง",
      "futureUsesTh": "ใช้ตีคมกริชพิษเพลิงและสกัดพิษร้อน"
    },
    {
      "id": "MW_MAT_BP_157",
      "nameTh": "กระดองปูเสฉวนแบกผลึก",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "CRYSTAL_SHELL",
        "RESONANCE_GUARD",
        "HEAVY_SHIELD"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 3)",
      "propertiesTh": "เปลือกหอยโบราณที่หลอมรวมกับผลึกในถ้ำจนกลายเป็นเกราะแก้วเนื้อแกร่ง",
      "futureUsesTh": "ใช้หลอมโล่สะท้อนปราณและเสื้อเกราะหนัก"
    },
    {
      "id": "MW_MAT_BP_158",
      "nameTh": "ขนนกอินทรีลมกรด",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "tier": 3,
      "element": "WIND",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "RAZOR_PLUME",
        "GALE_FLIGHT",
        "ARROW_FLETCH"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SPIRIT_HAIR_FEATHER · ระดับ 3)",
      "propertiesTh": "ขนปีกยาวเรียวที่ตัดกระแสลมได้ไร้เสียงและเพิ่มความเร็วในการพุ่งทะยาน",
      "futureUsesTh": "ใช้ทำหางลูกธนู พัดศึก และรองเท้าวิชาตัวเบา"
    },
    {
      "id": "MW_MAT_BP_159",
      "nameTh": "ดีหมีหินหนืดเพลิง",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "tier": 3,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "MAGMA_BILE",
        "FIERCE_STRENGTH",
        "TOXIN_BURN"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (HEART_GALL · ระดับ 3)",
      "propertiesTh": "ถุงน้ำดีสีแดงเข้มจากหมีที่จำศีลใกล้ปล่องลาวา อัดแน่นด้วยปราณหยางดุดัน",
      "futureUsesTh": "ปรุงโอสถเพิ่มพละกำลังกายาและเผาผลาญพิษเย็น"
    },
    {
      "id": "MW_MAT_BP_160",
      "nameTh": "หนวดแมงกะพรุนสายฟ้าสมุทร",
      "category": "BEAST_PART",
      "anatomyType": "TENDON_TAIL",
      "tier": 3,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "SHOCK_TENTACLE",
        "PARALYZE_WHIP",
        "CONDUCTIVE_CORD"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (TENDON_TAIL · ระดับ 3)",
      "propertiesTh": "หนวดโปร่งแสงที่ยังเก็บประจุไฟฟ้าแรงสูงไว้แม้ตัดออกจากตัว",
      "futureUsesTh": "ใช้ทำแส้สายฟ้าและสายตัวนำในค่ายกล"
    },
    {
      "id": "MW_MAT_BP_161",
      "nameTh": "หนังกิ้งก่าพรางแสงคาเมเลี่ยน",
      "category": "BEAST_PART",
      "anatomyType": "HIDE_PELT",
      "tier": 3,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "CHAMELEON_HIDE",
        "OPTICAL_CAMO",
        "STEALTH_CLOAK"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (HIDE_PELT · ระดับ 3)",
      "propertiesTh": "ผืนหนังที่เปลี่ยนสีตามสภาพแวดล้อมโดยอัตโนมัติเมื่อได้รับปราณกระตุ้น",
      "futureUsesTh": "ใช้ตัดเย็บผ้าคลุมเร้นกายและชุดลาดตระเวน"
    },
    {
      "id": "MW_MAT_BP_162",
      "nameTh": "กระดูกปีกค้างคาวเสียงสะท้อน",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "tier": 3,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "ECHO_BONE",
        "LIGHT_HOLLOW",
        "SONIC_TUNING"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BONE_HORN · ระดับ 3)",
      "propertiesTh": "กระดูกปีกที่เบาแต่แข็งแรงและสั่นพ้องกับคลื่นเสียงความถี่สูงได้ดี",
      "futureUsesTh": "ใช้ทำโครงพัดอาวุธ ขลุ่ยสะกดจิต และเครื่องรางตรวจจับศัตรู"
    },
    {
      "id": "MW_MAT_BP_163",
      "nameTh": "แก่นอสูรแมลงกู่เห็ดทอง",
      "category": "BEAST_PART",
      "anatomyType": "BEAST_CORE",
      "tier": 3,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "FUNGAL_BEAST_CORE",
        "POISON_REGEN",
        "SYMBIOTIC_QI"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BEAST_CORE · ระดับ 3)",
      "propertiesTh": "แก่นปราณของอสูรที่อยู่ร่วมกับเห็ดทิพย์อย่างสมบูรณ์ ให้ทั้งปราณชีวิตและภูมิคุ้มกันพิษ",
      "futureUsesTh": "ใช้ปรุงโอสถต้านพิษหมื่นชนิดและฝังในเครื่องรางสายพิษ"
    },
    {
      "id": "MW_MAT_BP_164",
      "nameTh": "ไขกระดูกเสือดาวหิมะ",
      "category": "BEAST_PART",
      "anatomyType": "MARROW",
      "tier": 3,
      "element": "ICE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "FROST_MARROW",
        "AGILE_BONE",
        "COLD_ENDURANCE"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (MARROW · ระดับ 3)",
      "propertiesTh": "ไขกระดูกสีขาวเงินที่อุดมด้วยปราณความเร็วและความทนทานต่ออากาศหนาวจัด",
      "futureUsesTh": "ปรุงโอสถเสริมความคล่องแคล่วและหล่อเลี้ยงเส้นชีพจร"
    },
    {
      "id": "MW_MAT_BP_165",
      "nameTh": "เกล็ดปลาไหลไฟฟ้าม่วง",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 3,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "SPARK_SCALE",
        "SLIPPERY_WARD",
        "SHOCK_COAT"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 3)",
      "propertiesTh": "เกล็ดละเอียดที่เคลือบด้วยเมือกนำไฟฟ้า ช่วยลดแรงปะทะและช็อตศัตรูที่สัมผัส",
      "futureUsesTh": "ใช้ทำเกราะอ่อนสายฟ้าและถุงมือปัดป้องศาสตรา"
    },
    {
      "id": "MW_MAT_BP_166",
      "nameTh": "เขี้ยวหมาป่ากระดูกสมรภูมิ",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "tier": 3,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "BONE_HOUND_FANG",
        "DEATH_QI",
        "ARMOR_GNAW"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (FANG_CLAW · ระดับ 3)",
      "propertiesTh": "เขี้ยวที่แข็งแกร่งจากการแทะกินศาสตราและกระดูกผู้ฝึกตนในสมรภูมิร้าง",
      "futureUsesTh": "ใช้ตีอาวุธสายมารและทำหัวลูกศรเจาะเกราะ"
    },
    {
      "id": "MW_MAT_BP_167",
      "nameTh": "เขาแพะสายฟ้าภูผา",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "tier": 3,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "THUNDER_RAM_HORN",
        "IMPACT_SHOCK",
        "SPIRAL_CONDUIT"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BONE_HORN · ระดับ 3)",
      "propertiesTh": "เขาโค้งเป็นเกลียวที่ดูดซับสายฟ้าบนยอดเขาและปล่อยแรงกระแทกมหาศาลเมื่อพุ่งชน",
      "futureUsesTh": "ใช้ตีค้อนศึกสายฟ้าและทำคันธนูพลังทำลายสูง"
    },
    {
      "id": "MW_MAT_BP_168",
      "nameTh": "ถุงพิษแมงป่องผลึกทราย",
      "category": "BEAST_PART",
      "anatomyType": "VENOM_GLAND",
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "PETRIFY_VENOM",
        "NUMB_MERIDIAN",
        "DESERT_TOXIN"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (VENOM_GLAND · ระดับ 3)",
      "propertiesTh": "พิษที่มีฤทธิ์ทำให้เลือดลมไหลเวียนช้าลงเหมือนกำลังกลายเป็นหิน",
      "futureUsesTh": "ใช้ชุบคมอาวุธเพื่อชะลอความเร็วศัตรูและสกัดยาชา"
    },
    {
      "id": "MW_MAT_BP_169",
      "nameTh": "ขนแผงคอสิงโตหินปูน",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "tier": 3,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "STONE_MANE",
        "HEAVY_FUR",
        "SHOCK_ABSORB"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SPIRIT_HAIR_FEATHER · ระดับ 3)",
      "propertiesTh": "ขนแผงคอที่หนาและแข็งตัวคล้ายเส้นใยหิน ช่วยซับแรงกระแทกจากอาวุธหนัก",
      "futureUsesTh": "ใช้บุเกราะอกและทำพู่ห้อยด้ามทวนเพิ่มความมั่นคง"
    },
    {
      "id": "MW_MAT_BP_170",
      "nameTh": "หัวใจกวางน้ำค้างเจ็ดสี",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "tier": 3,
      "element": "LIGHT",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 181,
      "isTranscendent": false,
      "propertyTags": [
        "PURE_STAG_HEART",
        "COMPASSION_QI",
        "HEAL_BOOST"
      ],
      "preservationRule": "SALTED_WRAP",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (HEART_GALL · ระดับ 3)",
      "propertiesTh": "หัวใจของอสูรมงคลริมทะเลสาบกระจก เปี่ยมด้วยปราณชีวิตที่อ่อนโยน",
      "futureUsesTh": "ปรุงโอสถรักษาบาดแผลขั้นสูงและโอสถสายเทพโอสถโพธิญาณ"
    },
    {
      "id": "MW_MAT_BP_171",
      "nameTh": "เกล็ดมังกรดินเกราะเพชร",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 4,
      "element": "EARTH",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "DRAKE_DIAMOND_SCALE",
        "IMPENETRABLE",
        "EARTH_SHIELD"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 4)",
      "propertiesTh": "เกล็ดหนาหนักของอสูรตระกูลมังกรดินที่ผ่านการขัดเกลาด้วยพายุทรายแร่",
      "futureUsesTh": "ใช้ตีเกราะหนักระดับสี่และโล่ป้องกันค่ายกล"
    },
    {
      "id": "MW_MAT_BP_172",
      "nameTh": "เขี้ยวเสือโคร่งเพลิงกัลป์",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "tier": 4,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "CALDERA_TIGER_FANG",
        "SEARING_BITE",
        "FEROCITY_QI"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (FANG_CLAW · ระดับ 4)",
      "propertiesTh": "เขี้ยวคู่หน้าที่มีลายเส้นสีทองแดงและปล่อยความร้อนเผาไหม้ม่านปราณ",
      "futureUsesTh": "ใช้ตีดาบใหญ่และกระบี่เพลิงสังหาร"
    },
    {
      "id": "MW_MAT_BP_173",
      "nameTh": "ขนนกยูงพิษเจ็ดมายา",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "tier": 4,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "SEVEN_VENOM_PLUME",
        "DAZZLE_EYE",
        "TOXIC_FAN"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SPIRIT_HAIR_FEATHER · ระดับ 4)",
      "propertiesTh": "ขนหางที่มีลวดลายคล้ายดวงตาปีศาจ สะบัดครั้งเดียวโปรยทั้งพิษและภาพลวงตา",
      "futureUsesTh": "ใช้สร้างพัดยุทธภัณฑ์สายพิษและเครื่องรางสะกดใจ"
    },
    {
      "id": "MW_MAT_BP_174",
      "nameTh": "แก่นอสูรเต่าดำก้นสมุทร",
      "category": "BEAST_PART",
      "anatomyType": "BEAST_CORE",
      "tier": 4,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "ABYSS_TURTLE_CORE",
        "DEEP_WATER_QI",
        "UNSHAKABLE_DEFENSE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BEAST_CORE · ระดับ 4)",
      "propertiesTh": "แก่นปราณสีน้ำเงินเข้มที่หนักและเย็นเยียบ เสริมพลังป้องกันและความมั่นคงของรากฐาน",
      "futureUsesTh": "ใช้หลอมเกราะคุ้มกายและปรุงโอสถเสริมรากฐานตบะ"
    },
    {
      "id": "MW_MAT_BP_175",
      "nameTh": "เส้นเอ็นวานรสายฟ้าแขนยาว",
      "category": "BEAST_PART",
      "anatomyType": "TENDON_TAIL",
      "tier": 4,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "THUNDER_APE_SINEW",
        "ELASTIC_POWER",
        "WHIP_STRIKE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (TENDON_TAIL · ระดับ 4)",
      "propertiesTh": "เส้นเอ็นแขนที่ยืดหดได้รวดเร็วและทนต่อกระแสไฟฟ้าแรงสูง",
      "futureUsesTh": "ใช้ทำสายธนูระดับปฐพีและแส้สายฟ้า"
    },
    {
      "id": "MW_MAT_BP_176",
      "nameTh": "กระดูกงูยักษ์หลุมดารา",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "tier": 4,
      "element": "STAR",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "CRATER_PYTHON_BONE",
        "GRAVITY_BONE",
        "FLEXIBLE_SPINE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BONE_HORN · ระดับ 4)",
      "propertiesTh": "ข้อกระดูกสันหลังที่ทนแรงโน้มถ่วงสูงในหลุมอุกกาบาตได้โดยไม่บิดงอ",
      "futureUsesTh": "ใช้ตีดาบแส้ข้อต่อและแกนเสาค่ายกลแรงโน้มถ่วง"
    },
    {
      "id": "MW_MAT_BP_177",
      "nameTh": "เลือดสีเงินจิ้งจอกจันทรา",
      "category": "BEAST_PART",
      "anatomyType": "BLOOD",
      "tier": 4,
      "element": "ICE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "SILVER_FOX_BLOOD",
        "MOON_AFFINITY",
        "ILLUSION_INK"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BLOOD · ระดับ 4)",
      "propertiesTh": "โลหิตสีเงินเรืองแสงที่มีปราณจันทราและพลังจิตบริสุทธิ์",
      "futureUsesTh": "ใช้ผสมหมึกจารึกคัมภีร์มายาและปรุงโอสถเปิดเนตรวิญญาณ"
    },
    {
      "id": "MW_MAT_BP_178",
      "nameTh": "เปลือกด้วงแรดทองคำสุริยัน",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 4,
      "element": "METAL",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "SOLAR_BEETLE_SHELL",
        "METALLIC_CARAPACE",
        "SPELL_DEFLECT"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 4)",
      "propertiesTh": "เปลือกปีกที่แข็งแกร่งดั่งทองคำหลอมรวมกับเหล็กไหล สะท้อนทั้งคมดาบและเปลวไฟ",
      "futureUsesTh": "ใช้ตีเกราะอกและหมวกศึกนักรบ"
    },
    {
      "id": "MW_MAT_BP_179",
      "nameTh": "ถุงพิษแมงมุมแม่ม่ายสุญตา",
      "category": "BEAST_PART",
      "anatomyType": "VENOM_GLAND",
      "tier": 4,
      "element": "VOID",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "VOID_SPIDER_VENOM",
        "QI_DISRUPT",
        "SILENT_CORROSION"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (VENOM_GLAND · ระดับ 4)",
      "propertiesTh": "พิษไร้สีไร้กลิ่นที่ทำให้การเชื่อมต่อระหว่างจิตและปราณของเหยื่อขาดช่วงชั่วขณะ",
      "futureUsesTh": "ใช้ชุบอาวุธลับและปรุงยาพิษตัดปราณ"
    },
    {
      "id": "MW_MAT_BP_180",
      "nameTh": "หัวใจวิหคสายฟ้าปีกคราม",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "tier": 4,
      "element": "LIGHTNING",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 314,
      "isTranscendent": false,
      "propertyTags": [
        "STORM_BIRD_HEART",
        "HIGH_SPEED_QI",
        "THUNDER_PULSE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (HEART_GALL · ระดับ 4)",
      "propertiesTh": "หัวใจที่สูบฉีดปราณด้วยความเร็วสูงผิดมนุษย์ ช่วยให้เคลื่อนไหวดั่งสายฟ้าแลบ",
      "futureUsesTh": "ปรุงโอสถเร่งความเร็วและเสริมวิชาตัวเบา"
    },
    {
      "id": "MW_MAT_BP_181",
      "nameTh": "เขากิเลนพฤกษามรกต",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "tier": 5,
      "element": "WOOD",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "forest",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "JADE_QILIN_HORN",
        "LIFE_BLESSING",
        "DETOX_SUPREME"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BONE_HORN · ระดับ 5)",
      "propertiesTh": "เขาที่หักหล่นตามธรรมชาติของอสูรมงคลในพงไพรบรรพกาล ชำระล้างพิษร้ายได้ทุกชนิด",
      "futureUsesTh": "ใช้หลอมเครื่องรางคุ้มครองชีวิตและปรุงมหาโอสถถอนพิษ"
    },
    {
      "id": "MW_MAT_BP_182",
      "nameTh": "เกล็ดมังกรสมุทรเรืองแสง",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 5,
      "element": "WATER",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "LEVIATHAN_GLOW_SCALE",
        "ABYSS_SOVEREIGN",
        "WATER_IMMUNITY"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 5)",
      "propertiesTh": "เกล็ดขนาดเท่าฝ่ามือจากอสูรเจ้าสมุทร เปล่งแสงสีครามและต้านทานแรงกระแทกมหาศาล",
      "futureUsesTh": "ใช้ตีเกราะระดับนภาและโล่พิทักษ์สำนัก"
    },
    {
      "id": "MW_MAT_BP_183",
      "nameTh": "ขนปีกหงส์เหมันต์เก้าชั้นฟ้า",
      "category": "BEAST_PART",
      "anatomyType": "SPIRIT_HAIR_FEATHER",
      "tier": 5,
      "element": "ICE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "FROST_PHOENIX_PLUME",
        "ABSOLUTE_CHILL",
        "NOBLE_GRACE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SPIRIT_HAIR_FEATHER · ระดับ 5)",
      "propertiesTh": "ขนนกสีขาวประกายเพชรที่แช่แข็งความชื้นในอากาศให้กลายเป็นเกล็ดหิมะทันที",
      "futureUsesTh": "ใช้หลอมพัดเหมันต์สวรรค์และอาภรณ์เซียน"
    },
    {
      "id": "MW_MAT_BP_184",
      "nameTh": "แก่นอสูรราชสีห์เพลิงสุริยัน",
      "category": "BEAST_PART",
      "anatomyType": "BEAST_CORE",
      "tier": 5,
      "element": "FIRE",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "SOLAR_LION_CORE",
        "BLAZING_DOMINION",
        "OVERWHELM_POWER"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BEAST_CORE · ระดับ 5)",
      "propertiesTh": "แก่นปราณที่ร้อนแรงดั่งดวงตะวันดวงน้อย ข่มขวัญอสูรระดับต่ำให้หมอบราบ",
      "futureUsesTh": "ใช้หลอมศาสตราเพลิงระดับห้าและปรุงโอสถทะลวงขอบเขต"
    },
    {
      "id": "MW_MAT_BP_185",
      "nameTh": "กรงเล็บพยัคฆ์มารทลายศิลา",
      "category": "BEAST_PART",
      "anatomyType": "FANG_CLAW",
      "tier": 5,
      "element": "YIN",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "plains",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "DEMON_TIGER_CLAW",
        "SHATTER_GUARD",
        "BLOOD_THIRST"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (FANG_CLAW · ระดับ 5)",
      "propertiesTh": "กรงเล็บสีดำขลับที่ฉีกกระชากเกราะเหล็กและม่านปราณป้องกันได้ราวกับกระดาษ",
      "futureUsesTh": "ใช้ตีถุงมือกรงเล็บและกริชสังหารระดับนภา"
    },
    {
      "id": "MW_MAT_BP_186",
      "nameTh": "เส้นเอ็นมังกรสายฟ้าคำราม",
      "category": "BEAST_PART",
      "anatomyType": "TENDON_TAIL",
      "tier": 5,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "THUNDER_DRAGON_SINEW",
        "SUPREME_TENSION",
        "LIGHTNING_ARC"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (TENDON_TAIL · ระดับ 5)",
      "propertiesTh": "เส้นเอ็นสีม่วงทองที่ส่งเสียงคำรามของสายฟ้าทุกครั้งที่ถูกดึงจนตึง",
      "futureUsesTh": "ใช้ทำสายพิณสวรรค์และคันธนูระดับห้า"
    },
    {
      "id": "MW_MAT_BP_187",
      "nameTh": "ไขกระดูกยักษ์ศิลาแบกฟ้า",
      "category": "BEAST_PART",
      "anatomyType": "MARROW",
      "tier": 5,
      "element": "EARTH",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "TITAN_STONE_MARROW",
        "IMMORTAL_BONE",
        "GRAVITY_RESIST"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (MARROW · ระดับ 5)",
      "propertiesTh": "ไขกระดูกสีทองข้นหนืดดั่งปรอทจากอสูรศิลายักษ์ เสริมสร้างโครงกระดูกให้แกร่งดั่งขุนเขา",
      "futureUsesTh": "ปรุงมหาโอสถหลอมกายาและชุบแกนศาสตราหนัก"
    },
    {
      "id": "MW_MAT_BP_188",
      "nameTh": "เนตรวิญญาณจิ้งจอกสวรรค์",
      "category": "BEAST_PART",
      "anatomyType": "SENSORY_ORGAN",
      "tier": 5,
      "element": "LIGHT",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "CELESTIAL_FOX_EYE",
        "TRUTH_SIGHT",
        "SOUL_CHARM"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SENSORY_ORGAN · ระดับ 5)",
      "propertiesTh": "ดวงตาอัญมณีที่มองทะลุภาพลวงตาทั้งปวงและสะกดจิตใจผู้ที่สบตา",
      "futureUsesTh": "ใช้หลอมกระจกส่องมายาและเครื่องรางสายวิถีจิต"
    },
    {
      "id": "MW_MAT_BP_189",
      "nameTh": "เปลือกหอยมุกดาราบรรพกาล",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 5,
      "element": "STAR",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "STAR_CLAM_SHELL",
        "COSMIC_BARRIER",
        "PEARL_MOTHER"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 5)",
      "propertiesTh": "ฝาหอยยักษ์ที่ซึมซับแสงดาวผ่านผืนน้ำมานับพันปี แข็งแกร่งและสะท้อนคาถา",
      "futureUsesTh": "ใช้หลอมเกราะป้องกันเวทและจานค่ายกลดารา"
    },
    {
      "id": "MW_MAT_BP_190",
      "nameTh": "แก่นอสูรผีเสื้อสุญตาข้ามภพ",
      "category": "BEAST_PART",
      "anatomyType": "BEAST_CORE",
      "tier": 5,
      "element": "VOID",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 485,
      "isTranscendent": false,
      "propertyTags": [
        "VOID_MOTH_CORE",
        "DREAM_DIMENSION",
        "PHASE_FLIGHT"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BEAST_CORE · ระดับ 5)",
      "propertiesTh": "แก่นปราณสีเงินพร่าเลือนที่เชื่อมโยงกับมิติความฝันและความว่างเปล่า",
      "futureUsesTh": "ใช้หลอมอาภรณ์ข้ามมิติและปรุงโอสถหยั่งรู้สุญตา"
    },
    {
      "id": "MW_MAT_BP_191",
      "nameTh": "เกล็ดย้อนมังกรอัสนีสวรรค์",
      "category": "BEAST_PART",
      "anatomyType": "SCALE_CARAPACE",
      "tier": 6,
      "element": "LIGHTNING",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 694,
      "isTranscendent": true,
      "propertyTags": [
        "HEAVEN_DRAGON_SCALE",
        "SUPREME_WARD",
        "THUNDER_SOVEREIGN"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (SCALE_CARAPACE · ระดับ 6)",
      "propertiesTh": "เกล็ดที่แข็งแกร่งและล้ำค่าที่สุดของมังกรอัสนี เต็มไปด้วยอำนาจแห่งทัณฑ์สวรรค์",
      "futureUsesTh": "ใช้หลอมเกราะเซียนและศาสตราพิพากษามาร"
    },
    {
      "id": "MW_MAT_BP_192",
      "nameTh": "หัวใจหงส์เพลิงอมตะนิรันดร์",
      "category": "BEAST_PART",
      "anatomyType": "HEART_GALL",
      "tier": 6,
      "element": "FIRE",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "desert",
      "baseValueStones": 694,
      "isTranscendent": true,
      "propertyTags": [
        "PHOENIX_IMMORTAL_HEART",
        "NIRVANA_REBIRTH",
        "TRUE_IMMORTAL_FIRE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (HEART_GALL · ระดับ 6)",
      "propertiesTh": "หัวใจที่ยังคงเต้นด้วยเปลวไฟแห่งการเกิดใหม่ แม้ร่างอสูรจะสลายไปแล้ว",
      "futureUsesTh": "ปรุงมหาโอสถชุบชีวิตและยกระดับรากฐานสู่ขั้นเซียน"
    },
    {
      "id": "MW_MAT_BP_193",
      "nameTh": "เขากิเลนดาราจักรเก้าสี",
      "category": "BEAST_PART",
      "anatomyType": "BONE_HORN",
      "tier": 6,
      "element": "STAR",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 694,
      "isTranscendent": true,
      "propertyTags": [
        "COSMIC_QILIN_HORN",
        "FORTUNE_BLESS",
        "HEAVEN_PIERCE"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BONE_HORN · ระดับ 6)",
      "propertiesTh": "เขามงคลที่รวมแสงดาราทั้งเก้าไว้ในตัว ปัดเป่าเคราะห์ร้ายและทะลวงทุกสิ่งกีดขวาง",
      "futureUsesTh": "ใช้หลอมทวนเซียนและตราคุ้มครองสำนักระดับหก"
    },
    {
      "id": "MW_MAT_BP_194",
      "nameTh": "โลหิตเต่ามังกรบรรพกาล",
      "category": "BEAST_PART",
      "anatomyType": "BLOOD",
      "tier": 6,
      "element": "WATER",
      "primaryCraftPath": "ALCHEMY",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "island",
      "baseValueStones": 694,
      "isTranscendent": true,
      "propertyTags": [
        "ANCIENT_XUANWU_BLOOD",
        "LONGEVITY_BLOOD",
        "UNBREAKABLE_VITALITY"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BLOOD · ระดับ 6)",
      "propertiesTh": "โลหิตสีครามทองที่มีอายุขัยยืนยาวนับหมื่นปี เปี่ยมด้วยพลังชีวิตอันไร้ขีดจำกัด",
      "futureUsesTh": "ปรุงมหาโอสถต่ออายุขัยและเขียนมหายันต์คุ้มภพ"
    },
    {
      "id": "MW_MAT_BP_195",
      "nameTh": "แก่นอสูรกลืนสวรรค์ไร้ลักษณ์",
      "category": "BEAST_PART",
      "anatomyType": "BEAST_CORE",
      "tier": 7,
      "element": "VOID",
      "primaryCraftPath": "FORGING",
      "compatiblePaths": [
        "ALCHEMY",
        "FORGING",
        "ARRAY",
        "TALISMAN",
        "BEAST_TAMING"
      ],
      "season": "ALL",
      "terrain": "mountain",
      "baseValueStones": 941,
      "isTranscendent": true,
      "propertyTags": [
        "HEAVEN_DEVOUR_CORE",
        "PRIMORDIAL_CHAOS",
        "SUPREME_POWER"
      ],
      "preservationRule": "JADE_BOX",
      "subCategoryTh": "ชิ้นส่วนกายวิภาคสัตว์อสูร (BEAST_CORE · ระดับ 7)",
      "propertiesTh": "แก่นอสูรระดับสูงสุดจากชายขอบรอยแยกสุญตา ภายในหมุนวนด้วยปราณต้นกำเนิดฟ้าดิน",
      "futureUsesTh": "ใช้หลอมศาสตราและโอสถระดับเทวตำนานขั้นที่เจ็ด"
    }
  ],
  "newBeasts": [
    {
      "id": "MW_BEAST_001",
      "nameTh": "งูไม้หนามพรางใบ",
      "tier": 1,
      "maxDropSlots": 2,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "AMBUSH_PREDATOR",
      "bodyPlan": "SERPENT",
      "temperament": "CAUTIOUS",
      "hostile": true,
      "behaviorTags": [
        "CAMOUFLAGE_CANOPY",
        "HERB_SCENT_ATTRACTED"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 150,
      "basePop": 95,
      "maxPop": 156,
      "reproPerSeason": 14,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": false,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_141",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_PYTHON_SCALE_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_028",
        "MW_ORGAN_006"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "CAMOUFLAGE_CANOPY",
        "futureEffectHook": "HOOK_AMBUSH_PREDATOR_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "งูสีเขียวสดที่มีเกล็ดยื่นออกมาคล้ายหนามกุหลาบ มักพันตัวนิ่งอยู่ตามกิ่งไม้สมุนไพรเพื่อดักฉกสัตว์เล็กและลอกคราบหยกทิ้งไว้ตามโคนไม้"
    },
    {
      "id": "MW_BEAST_002",
      "nameTh": "กระรอกบินหางเมฆา",
      "tier": 1,
      "maxDropSlots": 2,
      "element": "WIND",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "PREY_HERBIVORE",
      "bodyPlan": "MAMMAL_AGILE",
      "temperament": "TIMID",
      "hostile": false,
      "behaviorTags": [
        "DIURNAL",
        "HERD_GLIDER",
        "HIGH_EVASION"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "TAME",
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 165,
      "basePop": 95,
      "maxPop": 156,
      "reproPerSeason": 14,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": false,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_143",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_001",
        "MW_ORGAN_018"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WIND",
        "specialTrait": "DIURNAL",
        "futureEffectHook": "HOOK_PREY_HERBIVORE_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "สัตว์ฟันแทะปราณวายุที่ร่อนข้ามเรือนยอดไม้ได้ไกลหลายร้อยก้าว ชอบสะสมเมล็ดสมุนไพรและผลไม้ไว้ในโพรงไม้แก่นเหล็ก"
    },
    {
      "id": "MW_BEAST_003",
      "nameTh": "แมลงทับเกราะมรกตดูดยางไม้",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "SYMBIOTIC_GRAZER",
      "bodyPlan": "INSECTOID",
      "temperament": "DOCILE",
      "hostile": false,
      "behaviorTags": [
        "RESIN_FEEDER",
        "HARD_CARAPACE",
        "SWARM_DEFENSE"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 300,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_147",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_132",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_028",
        "MW_ORGAN_014"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "RESIN_FEEDER",
        "futureEffectHook": "HOOK_SYMBIOTIC_GRAZER_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "แมลงปีกแข็งขนาดเท่าฝ่ามือที่ดูดกินยางไม้ปราณและช่วยผสมเกสรให้กล้วยไม้หายาก เปลือกปีกที่ผลัดทิ้งมีความแข็งแกร่งดั่งหยก"
    },
    {
      "id": "MW_BEAST_004",
      "nameTh": "กิ้งก่าคาเมเลี่ยนเจ็ดแสงเรือนยอด",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "LIGHT",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "AMBUSH_PREDATOR",
      "bodyPlan": "REPTILE",
      "temperament": "ELUSIVE",
      "hostile": true,
      "behaviorTags": [
        "OPTICAL_STEALTH",
        "SOLITARY",
        "TONGUE_SNATCH"
      ],
      "affordances": [
        "OBSERVE",
        "TRACK",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 550,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_161",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_PYTHON_TENDON_3",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_003",
        "MW_ORGAN_014"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHT",
        "specialTrait": "OPTICAL_STEALTH",
        "futureEffectHook": "HOOK_AMBUSH_PREDATOR_LIGHT",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "กิ้งก่าปราณที่บิดเบือนแสงรอบตัวจนกลืนหายไปกับลำต้นไม้ ลิ้นยาวเหนียวหนึบสามารถฉกชิงสมุนไพรหรือจู่โจมจุดตายจากมุมอับ"
    },
    {
      "id": "MW_BEAST_005",
      "nameTh": "นกยูงพิษเจ็ดมายาพงไพร",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "TERRITORIAL_GUARDIAN",
      "bodyPlan": "AVIAN",
      "temperament": "PROUD",
      "hostile": true,
      "behaviorTags": [
        "ILLUSION_PLUME",
        "PROTECT_YOUNG",
        "VENOM_DANCE"
      ],
      "affordances": [
        "OBSERVE",
        "INTIMIDATE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 955,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_173",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_173",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_014",
        "MW_ORGAN_010"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "WOOD",
        "specialTrait": "ILLUSION_PLUME",
        "futureEffectHook": "HOOK_TERRITORIAL_GUARDIAN_WOOD",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "วิหคหงอนหยกที่รำแพนหางสร้างค่ายกลภาพลวงตาและละอองพิษเจ็ดสี หวงอาณาเขตและดุร้ายยิ่งเมื่อมีลูกน้อยอยู่ในรัง"
    },
    {
      "id": "MW_BEAST_006",
      "nameTh": "วานรพฤษภาแขนเถาวัลย์",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "PACK_FORAGER",
      "bodyPlan": "PRIMATE",
      "temperament": "CURIOUS",
      "hostile": true,
      "behaviorTags": [
        "PACK_COORDINATION",
        "HERB_BREWER",
        "CANOPY_LEAP"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "RESCUE",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 580,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_165",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_WOLF_PELT_1",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_020",
        "MW_ORGAN_033"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "PACK_COORDINATION",
        "futureEffectHook": "HOOK_PACK_FORAGER_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ฝูงวานรฉลาดเฉลียวที่รู้จักนำผลไม้ปราณและใบชามาหมักในโพรงไม้เป็นสุราวิญญาณ มักแลกเปลี่ยนของป่ากับผู้ฝึกตนที่ไม่ทำร้ายพวกมัน"
    },
    {
      "id": "MW_BEAST_007",
      "nameTh": "ตั๊กแตนตำข้าวใบมีดหยกเขียว",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "WIND",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "SOLITARY_HUNTER",
      "bodyPlan": "INSECTOID",
      "temperament": "AGGRESSIVE",
      "hostile": true,
      "behaviorTags": [
        "WIND_SLASH",
        "NOCTURNAL",
        "ARMOR_PIERCE"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 490,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_147",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_146",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_034",
        "MW_ORGAN_014"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WIND",
        "specialTrait": "WIND_SLASH",
        "futureEffectHook": "HOOK_SOLITARY_HUNTER_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "นักล่าไร้เสียงแห่งพงไพรที่เคียวคู่หน้าคมกริบดั่งกระบี่เซียน ฟาดฟันคลื่นลมตัดลำต้นไม้ใหญ่ขาดสะบั้นในพริบตา"
    },
    {
      "id": "MW_BEAST_008",
      "nameTh": "กิเลนพฤกษามรกตเร้นเมฆ",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "MYTHIC_GUARDIAN",
      "bodyPlan": "MYTHIC_BEAST",
      "temperament": "BENEVOLENT",
      "hostile": false,
      "behaviorTags": [
        "AURA_VITALITY",
        "HERB_BLESSING",
        "NON_HOSTILE_UNLESS_PROVOKED"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "RESCUE",
        "HARVEST_SHED",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 1535,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_181",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_157",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_033",
        "MW_ORGAN_036"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "AURA_VITALITY",
        "futureEffectHook": "HOOK_MYTHIC_GUARDIAN_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "อสูรมงคลที่เดินผ่านที่ใดสมุนไพรจะผลิดอกออกผลทันที ไม่ทำร้ายผู้มีจิตเมตตาและบางครั้งจะสลัดเขามรกตเก่าทิ้งไว้ให้ผู้มีวาสนา"
    },
    {
      "id": "MW_BEAST_009",
      "nameTh": "มังกรพฤกษาพันปีรากต้นไม้โลก",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "ecologicalRole": "APEX_GUARDIAN",
      "bodyPlan": "DRAGON_SERPENT",
      "temperament": "TERRITORIAL",
      "hostile": true,
      "behaviorTags": [
        "WORLD_ROOT_SYMBIOSIS",
        "REGEN_CANOPY",
        "WOOD_DOMAIN"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 2680,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_141",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_181",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_033",
        "MW_ORGAN_036"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "WORLD_ROOT_SYMBIOSIS",
        "futureEffectHook": "HOOK_APEX_GUARDIAN_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "อสูรบรรพกาลที่หลอมรวมกายเนื้อเข้ากับรากของต้นไม้โลก คอยปกป้องแก่นชีวิตของพงไพรจากผู้บุกรุกที่หวังโค่นทำลาย"
    },
    {
      "id": "MW_BEAST_010",
      "nameTh": "กบหมอกพิษลายจุดเจ็ดสี",
      "tier": 1,
      "maxDropSlots": 2,
      "element": "WATER",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "ecologicalRole": "VENOM_AMBUSHER",
      "bodyPlan": "AMPHIBIAN",
      "temperament": "CAUTIOUS",
      "hostile": true,
      "behaviorTags": [
        "POISON_SKIN",
        "WETLAND_LEAP",
        "NOCTURNAL"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 180,
      "basePop": 95,
      "maxPop": 156,
      "reproPerSeason": 14,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": false,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_145",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_PYTHON_GALL_3",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_006",
        "MW_ORGAN_026"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "POISON_SKIN",
        "futureEffectHook": "HOOK_VENOM_AMBUSHER_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "กบขนาดเท่าลูกมะพร้าวที่ซ่อนตัวในโคลนโกงกาง ผิวหนังหลั่งเมือกพิษเหนียวที่ใช้ทำถุงกันพิษและยาสกัดกู่ได้อย่างดี"
    },
    {
      "id": "MW_BEAST_011",
      "nameTh": "จระเข้เกราะทมิฬบึงน้ำกรด",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "WATER",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "ecologicalRole": "APEX_AMBUSHER",
      "bodyPlan": "REPTILE",
      "temperament": "FEROCIOUS",
      "hostile": true,
      "behaviorTags": [
        "SUBMERGED_AMBUSH",
        "DEATH_ROLL",
        "ACID_RESIST"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 315,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_148",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_BOAR_HIDE_2",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_132",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_009",
        "MW_ORGAN_016"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "SUBMERGED_AMBUSH",
        "futureEffectHook": "HOOK_APEX_AMBUSHER_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "จระเข้ยักษ์ที่ลอยตัวนิ่งเหมือนขอนไม้ผุในบึงหมอกพิษ เกราะหลังทนทานต่อน้ำกรดและมีแรงขบกัดที่บดขยี้โล่เหล็ก"
    },
    {
      "id": "MW_BEAST_012",
      "nameTh": "ปลาไหลไฟฟ้าม่วงรากโกงกาง",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "ecologicalRole": "PACK_SHOCK_HUNTER",
      "bodyPlan": "AQUATIC_SERPENT",
      "temperament": "AGGRESSIVE",
      "hostile": true,
      "behaviorTags": [
        "WATER_CONDUCTION",
        "WEAK_OUTSIDE_WATER",
        "SWARM_SHOCK"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 565,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_165",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_PYTHON_TENDON_3",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_002",
        "MW_ORGAN_026"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "WATER_CONDUCTION",
        "futureEffectHook": "HOOK_PACK_SHOCK_HUNTER_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "ปลาไหลปราณที่ปล่อยกระแสไฟฟ้าผ่านผืนน้ำบึงโกงกางเพื่อทำให้เหยื่อเป็นอัมพาต แต่จะอ่อนกำลังลงอย่างมากหากถูกหลอกล่อขึ้นบนบก"
    },
    {
      "id": "MW_BEAST_013",
      "nameTh": "หอยทากศิลาพิษกลืนแร่",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "EARTH",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "ecologicalRole": "SCAVENGER_GRAZER",
      "bodyPlan": "MOLLUSK",
      "temperament": "DOCILE",
      "hostile": false,
      "behaviorTags": [
        "SLOW_ARMORED",
        "MIASMA_FILTER",
        "SLIME_TRAIL"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 345,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": false,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_186",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_142",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_026",
        "MW_ORGAN_010"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "SLOW_ARMORED",
        "futureEffectHook": "HOOK_SCAVENGER_GRAZER_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "หอยทากกระดองหินที่กินตะกอนพิษในบึงแล้วขับออกมาเป็นเมือกบริสุทธิ์ สามารถเก็บเมือกและเปลือกเก่าได้โดยไม่ต้องฆ่า"
    },
    {
      "id": "MW_BEAST_014",
      "nameTh": "แมงมุมแม่ม่ายบึงหมอกทมิฬ",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "ecologicalRole": "TRAP_PREDATOR",
      "bodyPlan": "ARACHNID",
      "temperament": "CUNNING",
      "hostile": true,
      "behaviorTags": [
        "VENOM_WEB",
        "NOCTURNAL",
        "CORPSE_PUPPET"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 490,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_167",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_145",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_008",
        "MW_ORGAN_006"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "VENOM_WEB",
        "futureEffectHook": "HOOK_TRAP_PREDATOR_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "แมงมุมพิษที่ขึงใยใสไร้สีระหว่างรากโกงกาง พิษของมันทำให้เหยื่อหลับใหลและถูกรังไหมห่อหุ้มไว้เป็นเสบียง"
    },
    {
      "id": "MW_BEAST_015",
      "nameTh": "อสรพิษหงอนโลหิตเจ็ดก้าว",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "ecologicalRole": "SOLITARY_HUNTER",
      "bodyPlan": "SERPENT",
      "temperament": "VENOMOUS",
      "hostile": true,
      "behaviorTags": [
        "HEAT_SENSE",
        "BLOOD_BOIL_VENOM",
        "SHED_SKIN"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 895,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_147",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_140",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_173",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_006",
        "MW_ORGAN_031"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "HEAT_SENSE",
        "futureEffectHook": "HOOK_SOLITARY_HUNTER_WOOD",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "งูพิษร้ายแรงที่มีหงอนสีแดงสดดั่งเลือด มักเฝ้าอยู่ใกล้สมุนไพรพิษระดับสูงเพื่อดูดซับไอพิษมาบ่มเพาะเนยตัน"
    },
    {
      "id": "MW_BEAST_016",
      "nameTh": "ตะขาบมังกรโคลนทมิฬ",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "ecologicalRole": "BURROWING_HUNTER",
      "bodyPlan": "INSECTOID",
      "temperament": "RUTHLESS",
      "hostile": true,
      "behaviorTags": [
        "MUD_BURROW",
        "ACID_SPIT",
        "MULTI_SEGMENT_ARMOR"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 910,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_CENTIPEDE_CARAPACE_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_174",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_006",
        "MW_ORGAN_028"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "MUD_BURROW",
        "futureEffectHook": "HOOK_BURROWING_HUNTER_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "ตะขาบยักษ์ยาวสามวาที่มุดซ่อนใต้โคลนดูด เปลือกแต่ละปล้องแข็งดั่งเหล็กไหลและมีต่อมพิษเพลิงหยิน"
    },
    {
      "id": "MW_BEAST_017",
      "nameTh": "คางคกสามตาเจ้าบึงพิษ",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "WATER",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "ecologicalRole": "TERRITORIAL_LORD",
      "bodyPlan": "AMPHIBIAN",
      "temperament": "GREEDY",
      "hostile": true,
      "behaviorTags": [
        "MIASMA_DOMAIN",
        "TREASURE_HOARDER",
        "TONGUE_DISARM"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 1565,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_175",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_150",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_010",
        "MW_ORGAN_039"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "MIASMA_DOMAIN",
        "futureEffectHook": "HOOK_TERRITORIAL_LORD_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "พญาคางคกโบราณที่ชอบสะสมหยกและศิลาปราณไว้ในท้อง สามารถยื่นข้อเสนอแลกเปลี่ยนของล้ำค่าเพื่อหลีกเลี่ยงการปะทะได้"
    },
    {
      "id": "MW_BEAST_018",
      "nameTh": "แพะภูผาหิมะเขาเกลียว",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "ICE",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "ecologicalRole": "HERD_GRAZER",
      "bodyPlan": "UNGULATE",
      "temperament": "STUBBORN",
      "hostile": true,
      "behaviorTags": [
        "CLIFF_CLIMBER",
        "WARM_BLOOD_CORE",
        "HERD_CHARGE"
      ],
      "affordances": [
        "OBSERVE",
        "TRACK",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 315,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_153",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_146",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_004",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "ICE",
        "specialTrait": "CLIFF_CLIMBER",
        "futureEffectHook": "HOOK_HERD_GRAZER_ICE",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "แพะภูเขาขนหนาสีขาวที่มีเลือดอุ่นจัดเพื่อต้านทานพายุหิมะ มักปีนป่ายอยู่ตามหน้าผาน้ำแข็งเพื่อเล็มมอสและผลจันทรา"
    },
    {
      "id": "MW_BEAST_019",
      "nameTh": "จิ้งจอกหิมะขนเงินสองหาง",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "ICE",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "ecologicalRole": "CUNNING_SCAVENGER",
      "bodyPlan": "CANINE",
      "temperament": "CAUTIOUS",
      "hostile": true,
      "behaviorTags": [
        "BLIZZARD_STEALTH",
        "ILLUSION_TRACKS",
        "CURIOUS_WATCHER"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "TAME",
        "RESCUE",
        "COMBAT"
      ],
      "combatPower": 330,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_155",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_WOLF_PELT_1",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_132",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_003",
        "MW_ORGAN_011"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "ICE",
        "specialTrait": "BLIZZARD_STEALTH",
        "futureEffectHook": "HOOK_CUNNING_SCAVENGER_ICE",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "จิ้งจอกปราณเหมันต์ที่ใช้หางคู่ปัดรอยเท้าบนหิมะไร้ร่องรอย หากผู้เดินทางแบ่งอาหารให้ในยามพายุหิมะ มันอาจนำทางไปยังถ้ำปลอดภัย"
    },
    {
      "id": "MW_BEAST_020",
      "nameTh": "เสือดาวหิมะเขี้ยวกระจก",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "ICE",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "ecologicalRole": "SOLITARY_PREDATOR",
      "bodyPlan": "FELINE",
      "temperament": "PATIENT",
      "hostile": true,
      "behaviorTags": [
        "SILENT_POUNCE",
        "FROST_BITE_CLAW",
        "HIGH_ALTITUDE"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 580,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_164",
          "anatomyType": "MARROW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_FROST_LYNX_FUR_4",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_MOON_FANG_4",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_023",
        "MW_ORGAN_011"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "ICE",
        "specialTrait": "SILENT_POUNCE",
        "futureEffectHook": "HOOK_SOLITARY_PREDATOR_ICE",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "นักล่าบนยอดเขาหิมะที่เคลื่อนไหวไร้เสียงบนแผ่นน้ำแข็งบางๆ ไขกระดูกและกรงเล็บของมันอัดแน่นด้วยปราณเหมันต์บริสุทธิ์"
    },
    {
      "id": "MW_BEAST_021",
      "nameTh": "หนอนไหมน้ำแข็งจันทรา",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "ICE",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "ecologicalRole": "SPIRIT_INSECT",
      "bodyPlan": "INSECTOID",
      "temperament": "DOCILE",
      "hostile": false,
      "behaviorTags": [
        "COCOON_WEAVER",
        "COLD_RADIATION",
        "FRAGILE_BODY"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "OFFERING",
        "TAME"
      ],
      "combatPower": 490,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_EXO_109",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_008",
        "MW_ORGAN_028"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "ICE",
        "specialTrait": "COCOON_WEAVER",
        "futureEffectHook": "HOOK_SPIRIT_INSECT_ICE",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "หนอนปราณสีขาวใสที่กินน้ำค้างแข็งและใบสนหิมะ เมื่อถึงเวลาจำศีลจะถักทอรังไหมน้ำแข็งที่เหนียวและล้ำค่าทิ้งไว้"
    },
    {
      "id": "MW_BEAST_022",
      "nameTh": "จักจั่นหยกเหมันต์พันปี",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "ICE",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "ecologicalRole": "DORMANT_SPIRIT",
      "bodyPlan": "INSECTOID",
      "temperament": "ELUSIVE",
      "hostile": true,
      "behaviorTags": [
        "UNDERGROUND_MOLT",
        "CHILL_SONG",
        "SEASONAL_WINTER"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 895,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_187",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_147",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_028",
        "MW_ORGAN_001"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "ICE",
        "specialTrait": "UNDERGROUND_MOLT",
        "futureEffectHook": "HOOK_DORMANT_SPIRIT_ICE",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "แมลงวิญญาณที่จำศีลใต้ชั้นน้ำแข็งนับร้อยปีก่อนจะลอกคราบหยกออกมาเกาะกิ่งสน เสียงร้องของมันช่วยให้ผู้ฟังจิตใจสงบเยือกเย็น"
    },
    {
      "id": "MW_BEAST_023",
      "nameTh": "หมีขั้วโลกเกราะธารน้ำแข็ง",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "ICE",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "ecologicalRole": "TERRITORIAL_BRUTE",
      "bodyPlan": "URSINE",
      "temperament": "AGGRESSIVE",
      "hostile": true,
      "behaviorTags": [
        "GLACIER_ARMOR",
        "GROUND_SLAM",
        "HIBERNATION_GUARD"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 910,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_BEAR_HEART_4",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_155",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_023",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "ICE",
        "specialTrait": "GLACIER_ARMOR",
        "futureEffectHook": "HOOK_TERRITORIAL_BRUTE_ICE",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "พญาหมีร่างยักษ์ที่มีผลึกน้ำแข็งเกาะตามขนหนาดั่งชุดเกราะ พละกำลังมหาศาลสามารถตบแผ่นน้ำแข็งให้แยกออกเป็นเหวลึก"
    },
    {
      "id": "MW_BEAST_024",
      "nameTh": "จิ้งจอกสวรรค์เนตรจันทราหกหาง",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "ICE",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "ecologicalRole": "MYSTIC_SAGE_BEAST",
      "bodyPlan": "CANINE",
      "temperament": "WISE",
      "hostile": false,
      "behaviorTags": [
        "MOON_DOMAIN",
        "MIND_ILLUSION",
        "RIDDLE_TEST"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "RESCUE",
        "COMBAT"
      ],
      "combatPower": 1565,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_177",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_188",
          "anatomyType": "SENSORY_ORGAN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_153",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_003",
        "MW_ORGAN_017"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "ICE",
        "specialTrait": "MOON_DOMAIN",
        "futureEffectHook": "HOOK_MYSTIC_SAGE_BEAST_ICE",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "อสูรจิ้งจอกระดับสูงที่บำเพ็ญเพียรรับแสงจันทร์บนยอดเขา มักทดสอบจิตใจของผู้มาเยือนด้วยภาพมายาก่อนตัดสินใจมอบวาสนาหรือขับไล่"
    },
    {
      "id": "MW_BEAST_025",
      "nameTh": "หงส์เหมันต์เก้าชั้นฟ้า",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "ICE",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "ecologicalRole": "CELESTIAL_SOVEREIGN",
      "bodyPlan": "AVIAN",
      "temperament": "NOBLE",
      "hostile": false,
      "behaviorTags": [
        "ABSOLUTE_ZERO_AURA",
        "BLIZZARD_WINGS",
        "AERIAL_SUPREMACY"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 2710,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_183",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_PHOENIX_PLUME_6",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_023",
        "MW_ORGAN_017"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "ICE",
        "specialTrait": "ABSOLUTE_ZERO_AURA",
        "futureEffectHook": "HOOK_CELESTIAL_SOVEREIGN_ICE",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "วิหคเทพแห่งความหนาวเหน็บที่โบยบินเหนือเมฆหิมะ ทุกครั้งที่กระพือปีกจะโปรยเกล็ดหิมะปราณที่แช่แข็งสรรพสิ่ง"
    },
    {
      "id": "MW_BEAST_026",
      "nameTh": "เม่นเหล็กเพลิงขนหนามแดง",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "FIRE",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "ecologicalRole": "DEFENSIVE_FORAGER",
      "bodyPlan": "MAMMAL_ARMORED",
      "temperament": "DEFENSIVE",
      "hostile": true,
      "behaviorTags": [
        "QUILL_BURST",
        "ORE_EATER",
        "HEAT_IMMUNE"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 330,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_151",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_038",
        "MW_ORGAN_013"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "QUILL_BURST",
        "futureEffectHook": "HOOK_DEFENSIVE_FORAGER_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "สัตว์อสูรที่กินถ่านศิลาและแร่เหล็กริมปล่องภูเขาไฟ เมื่อถูกคุกคามจะสลัดขนหนามเหล็กที่ร้อนจัดออกมารอบทิศทาง"
    },
    {
      "id": "MW_BEAST_027",
      "nameTh": "ซาลาแมนเดอร์ลาวาลิ้นเพลิง",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "FIRE",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "ecologicalRole": "THERMAL_AMBUSHER",
      "bodyPlan": "AMPHIBIAN",
      "temperament": "CAUTIOUS",
      "hostile": true,
      "behaviorTags": [
        "LAVA_SWIM",
        "FLAME_SPIT",
        "ASH_REGEN"
      ],
      "affordances": [
        "OBSERVE",
        "TRACK",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 345,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_EMBER_GALL_3",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_EMBER_CORE_3",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_038",
        "MW_ORGAN_007"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "LAVA_SWIM",
        "futureEffectHook": "HOOK_THERMAL_AMBUSHER_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "กิ้งก่าไฟที่แหวกว่ายในโคลนลาวาเดือด ผิวหนังเคลือบด้วยเถ้าถ่านปราณที่ช่วยให้ทนไฟหลอมระดับสูงได้"
    },
    {
      "id": "MW_BEAST_028",
      "nameTh": "หมีหินหนืดเกราะอัคคี",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "FIRE",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "ecologicalRole": "TERRITORIAL_BRUTE",
      "bodyPlan": "URSINE",
      "temperament": "FEROCIOUS",
      "hostile": true,
      "behaviorTags": [
        "MAGMA_CRUST",
        "ERUPTION_ROAR",
        "SLOWER_WHEN_COOLED"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 490,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_159",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_BOAR_HIDE_2",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_013",
        "MW_ORGAN_007"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "MAGMA_CRUST",
        "futureEffectHook": "HOOK_TERRITORIAL_BRUTE_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "หมีภูเขาไฟที่แผ่นหลังปกคลุมด้วยหินหนืดแข็งตัว หากถูกวิชาธาตุน้ำหรือน้ำแข็งโจมตีต่อเนื่อง เกราะลาวาจะเย็นตัวและหนักจนเคลื่อนไหวช้าลง"
    },
    {
      "id": "MW_BEAST_029",
      "nameTh": "เต่าศิลาเพลิงเตาหลอม",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "FIRE",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "ecologicalRole": "WALKING_FURNACE",
      "bodyPlan": "REPTILE",
      "temperament": "STOIC",
      "hostile": true,
      "behaviorTags": [
        "VENT_SHELL",
        "INTERNAL_SMELTER",
        "PASSIVE_DEFENSE"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 505,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_FORM_EARTH_FLAME_CORE_4",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_JADE_TURTLE_SHELL_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_007",
        "MW_ORGAN_038"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "VENT_SHELL",
        "futureEffectHook": "HOOK_WALKING_FURNACE_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เต่าโบราณที่กระดองมีปล่องระบายควันไฟเหมือนเตาหลอมโอสถ กินแร่ดิบเข้าไปแล้วขับกากตะกรันบริสุทธิ์ออกมาตามทางเดิน"
    },
    {
      "id": "MW_BEAST_030",
      "nameTh": "เสือโคร่งเพลิงกัลป์ลายทองแดง",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "FIRE",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "ecologicalRole": "APEX_HUNTER",
      "bodyPlan": "FELINE",
      "temperament": "AGGRESSIVE",
      "hostile": true,
      "behaviorTags": [
        "FLAME_POUNCE",
        "SEARING_AURA",
        "SOLITARY_KING"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 910,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_172",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_170",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_007",
        "MW_ORGAN_035"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "FLAME_POUNCE",
        "futureEffectHook": "HOOK_APEX_HUNTER_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เจ้าแห่งนักล่าในแอ่งอัคคีที่ลายพาดกลอนเรืองแสงดั่งโลหะหลอมเหลว เขี้ยวและกรงเล็บสามารถหลอมละลายเกราะเหล็กธรรมดาได้"
    },
    {
      "id": "MW_BEAST_031",
      "nameTh": "งูเหลือมแมกมาเกล็ดชาด",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "FIRE",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "ecologicalRole": "CONSTRICTOR",
      "bodyPlan": "SERPENT",
      "temperament": "PATIENT",
      "hostile": true,
      "behaviorTags": [
        "THERMAL_COIL",
        "MOLTEN_BREATH",
        "HEAT_SENSE"
      ],
      "affordances": [
        "AVOID",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 925,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_139",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_173",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_031",
        "MW_ORGAN_009"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "THERMAL_COIL",
        "futureEffectHook": "HOOK_CONSTRICTOR_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "งูยักษ์ที่ขดตัวอยู่ใต้ทะเลสาบลาวา เมื่อรัดเหยื่อจะเร่งความร้อนจากเกล็ดจนเหยื่อสุกไหม้ภายในเกราะของตนเอง"
    },
    {
      "id": "MW_BEAST_032",
      "nameTh": "ราชสีห์เพลิงสุริยันแผงคอทอง",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "FIRE",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "ecologicalRole": "SOVEREIGN_PREDATOR",
      "bodyPlan": "FELINE",
      "temperament": "PROUD",
      "hostile": true,
      "behaviorTags": [
        "SOLAR_ROAR",
        "FIRE_DOMAIN",
        "PACK_LEADER"
      ],
      "affordances": [
        "OBSERVE",
        "INTIMIDATE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 1580,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_184",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_156",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_177",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_007",
        "MW_ORGAN_035"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "SOLAR_ROAR",
        "futureEffectHook": "HOOK_SOVEREIGN_PREDATOR_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ราชสีห์อสูรผู้ครองยอดปล่องภูเขาไฟ แผงคอเป็นเปลวไฟสีทองที่ไม่เคยดับ เสียงคำรามสามารถสลายวิชาภาพมายาและไอหยินได้ทันที"
    },
    {
      "id": "MW_BEAST_033",
      "nameTh": "วิหคหงส์เพลิงอมตะนิรันดร์",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "FIRE",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "ecologicalRole": "MYTHIC_SOVEREIGN",
      "bodyPlan": "AVIAN",
      "temperament": "NOBLE",
      "hostile": false,
      "behaviorTags": [
        "NIRVANA_REBIRTH",
        "TRUE_SOLAR_FIRE",
        "SACRED_PRESENCE"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 2725,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_192",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_PHOENIX_PLUME_6",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_169",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_025",
        "MW_ORGAN_007"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "FIRE",
        "specialTrait": "NIRVANA_REBIRTH",
        "futureEffectHook": "HOOK_MYTHIC_SOVEREIGN_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "วิหคเทพในตำนานที่ถือกำเนิดจากใจกลางอัคคีพิภพ ขนหงอนและหยดเลือดของมันมีพลังแห่งการเกิดใหม่และชำระล้างมลทินทั้งปวง"
    },
    {
      "id": "MW_BEAST_034",
      "nameTh": "มดเกราะทองแดงขุดแร่",
      "tier": 1,
      "maxDropSlots": 2,
      "element": "METAL",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_05_MINERAL_DESERT",
      "ecologicalRole": "COLONY_WORKER",
      "bodyPlan": "INSECTOID",
      "temperament": "INDUSTRIOUS",
      "hostile": true,
      "behaviorTags": [
        "SWARM_COLONY",
        "ORE_CARRIER",
        "ACID_SPRAY"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 225,
      "basePop": 95,
      "maxPop": 156,
      "reproPerSeason": 14,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": false,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_144",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_ORE_SPIRIT_COPPER_2",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_022",
        "MW_ORGAN_006"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "METAL",
        "specialTrait": "SWARM_COLONY",
        "futureEffectHook": "HOOK_COLONY_WORKER_METAL",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "มดงานขนาดเท่ากำปั้นที่ขุดอุโมงค์ลึกตามสายแร่ทองแดงและนำเศษแร่บริสุทธิ์มากองไว้ปากทางเข้ารัง"
    },
    {
      "id": "MW_BEAST_035",
      "nameTh": "ฉลามทรายครีบใบมีดทอง",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "EARTH",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_05_MINERAL_DESERT",
      "ecologicalRole": "DUNE_PREDATOR",
      "bodyPlan": "PISCES_LAND",
      "temperament": "AGGRESSIVE",
      "hostile": true,
      "behaviorTags": [
        "SAND_SWIM",
        "TREMOR_SENSE",
        "FIN_SLASH"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 255,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_149",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_BOAR_HIDE_2",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_132",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_022",
        "MW_ORGAN_034"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "SAND_SWIM",
        "futureEffectHook": "HOOK_DUNE_PREDATOR_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "อสูรรูปร่างคล้ายปลาฉลามที่แหวกว่ายใต้ผืนทรายด้วยความเร็วสูง จับทิศทางของเหยื่อจากแรงสั่นสะเทือนของฝีเท้า"
    },
    {
      "id": "MW_BEAST_036",
      "nameTh": "แมงป่องผลึกทรายเหลือง",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_05_MINERAL_DESERT",
      "ecologicalRole": "AMBUSH_PREDATOR",
      "bodyPlan": "ARACHNID",
      "temperament": "HOSTILE",
      "hostile": true,
      "behaviorTags": [
        "BURROW_WAIT",
        "PETRIFY_STING",
        "SANDSTORM_HUNTER"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 505,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_168",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_SCORPION_STING_4",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_006",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "BURROW_WAIT",
        "futureEffectHook": "HOOK_AMBUSH_PREDATOR_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "แมงป่องทะเลทรายที่เปลือกนอกเป็นผลึกควอตซ์แข็งแกร่ง ออกล่าอย่างดุร้ายในช่วงที่เกิดพายุทรายบดบังทัศนวิสัย"
    },
    {
      "id": "MW_BEAST_037",
      "nameTh": "อูฐศิลาหยกเก็บน้ำทิพย์",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "EARTH",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_05_MINERAL_DESERT",
      "ecologicalRole": "NOMAD_HERBIVORE",
      "bodyPlan": "UNGULATE",
      "temperament": "DOCILE",
      "hostile": false,
      "behaviorTags": [
        "OASIS_FINDER",
        "SANDSTORM_SHELTER",
        "WATER_RESERVOIR"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "TAME",
        "RESCUE"
      ],
      "combatPower": 285,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_BOAR_HIDE_2",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_EXO_120",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_024",
        "MW_ORGAN_020"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "OASIS_FINDER",
        "futureEffectHook": "HOOK_NOMAD_HERBIVORE_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "สัตว์อสูรใจสงบที่โหนกหลังกักเก็บน้ำแร่ปราณบริสุทธิ์ไว้ ผู้เดินทางที่หลงในพายุทรายสามารถตามรอยมันไปยังโอเอซิสลับได้"
    },
    {
      "id": "MW_BEAST_038",
      "nameTh": "ด้วงแรดทองคำสุริยันกลืนแร่",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "METAL",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_05_MINERAL_DESERT",
      "ecologicalRole": "MINERAL_GRAZER",
      "bodyPlan": "INSECTOID",
      "temperament": "TERRITORIAL",
      "hostile": true,
      "behaviorTags": [
        "METALLIC_SHELL",
        "HORN_FLIP",
        "GOLD_SEEKER"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 925,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_178",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_144",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_022",
        "MW_ORGAN_037"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "METAL",
        "specialTrait": "METALLIC_SHELL",
        "futureEffectHook": "HOOK_MINERAL_GRAZER_METAL",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ด้วงยักษ์เปลือกสีทองอร่ามที่กินทรายทองคำและแร่เหล็กเป็นอาหาร เปลือกของมันแข็งแกร่งจนอาวุธระดับต่ำฟันไม่เข้า"
    },
    {
      "id": "MW_BEAST_039",
      "nameTh": "มังกรดินเกราะเพชรทะเลทราย",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_05_MINERAL_DESERT",
      "ecologicalRole": "TERRITORIAL_APEX",
      "bodyPlan": "REPTILE",
      "temperament": "FEROCIOUS",
      "hostile": true,
      "behaviorTags": [
        "QUICKSAND_VORTEX",
        "DIAMOND_SCALES",
        "HEAVY_TAIL"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 940,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_171",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_EARTH_CORE_4",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_THUNDER_LIZARD_SCALE_4",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_009",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "QUICKSAND_VORTEX",
        "futureEffectHook": "HOOK_TERRITORIAL_APEX_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "กิ้งก่ายักษ์สายเลือดมังกรดินที่สร้างหลุมทรายดูดขนาดใหญ่เพื่อดักจับคาราวานและสัตว์อสูรอื่น เกล็ดแข็งประดุจเพชร"
    },
    {
      "id": "MW_BEAST_040",
      "nameTh": "หนอนยักษ์กลืนศิลาพันวา",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_05_MINERAL_DESERT",
      "ecologicalRole": "SUBTERRANEAN_COLOSSUS",
      "bodyPlan": "WORM",
      "temperament": "BLIND_HUNTER",
      "hostile": true,
      "behaviorTags": [
        "SEISMIC_SWALLOW",
        "ORE_REFINER_GUT",
        "BLIND_SENSE"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 1595,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_171",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_ORE_QUICKSAND_SPIRIT_GOLD_4",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_022",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "SEISMIC_SWALLOW",
        "futureEffectHook": "HOOK_SUBTERRANEAN_COLOSSUS_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "หนอนอสูรขนาดมหึมาที่ขุดอุโมงค์อยู่ใต้ทะเลทรายแร่ ในกระเพาะของมันมีหินบดแร่ที่สกัดทรายทองคำวิญญาณออกมาตามทางเดิน"
    },
    {
      "id": "MW_BEAST_041",
      "nameTh": "เทาเที่ยเงาทรายกลืนปราณ",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "desert",
      "primaryEnvironmentId": "MW_ENV_05_MINERAL_DESERT",
      "ecologicalRole": "MYTHIC_DEVOURER",
      "bodyPlan": "MYTHIC_BEAST",
      "temperament": "RAVENOUS",
      "hostile": true,
      "behaviorTags": [
        "DEVOUR_QI_SHIELD",
        "SANDSTORM_AVATAR",
        "INSATIABLE"
      ],
      "affordances": [
        "AVOID",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 2740,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_MYTHIC_GUARDIAN_CORE_6",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_TIGER_BONE_6",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_040",
        "MW_ORGAN_016"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "DEVOUR_QI_SHIELD",
        "futureEffectHook": "HOOK_MYTHIC_DEVOURER_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "อสูรบรรพกาลผู้หิวโหยที่ตื่นขึ้นจากใต้ผืนทรายโบราณ สามารถสูบกินทั้งปราณกระบี่และแร่ธาตุรอบข้างเข้าสู่กระเพาะไร้ก้น"
    },
    {
      "id": "MW_BEAST_042",
      "nameTh": "ปูขาวตาบอดปล่องน้ำพุร้อน",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "WATER",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "VENT_SCAVENGER",
      "bodyPlan": "CRUSTACEAN",
      "temperament": "DOCILE",
      "hostile": false,
      "behaviorTags": [
        "CHEMOSYNTHETIC_FUR",
        "HEAT_PRESSURE_RESIST",
        "CLUSTER_COLONY"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 255,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_150",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_142",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_028",
        "MW_ORGAN_013"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "CHEMOSYNTHETIC_FUR",
        "futureEffectHook": "HOOK_VENT_SCAVENGER_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "ปูใต้สมุทรที่มีขนสีขาวตามก้ามเพื่อเลี้ยงจุลินทรีย์ปราณรอบปล่องน้ำพุร้อน เปลือกทนทานต่อทั้งน้ำเดือดและแรงดันน้ำลึก"
    },
    {
      "id": "MW_BEAST_043",
      "nameTh": "หนอนท่อเกราะหยกแดงก้นสมุทร",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "FIRE",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "SESSILE_SYMBIOTE",
      "bodyPlan": "WORM",
      "temperament": "PASSIVE",
      "hostile": true,
      "behaviorTags": [
        "MINERAL_TUBE",
        "SULFUR_FILTER",
        "RETRACT_DEFENSE"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 270,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_EXO_117",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_JADE_TURTLE_SHELL_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_026",
        "MW_ORGAN_031"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "MINERAL_TUBE",
        "futureEffectHook": "HOOK_SESSILE_SYMBIOTE_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "สิ่งมีชีวิตประหลาดที่สร้างท่อแร่หยกยึดติดกับปล่องภูเขาไฟใต้น้ำ พู่สีแดงสดที่ยอดท่อทำหน้าที่ดูดซับปราณอัคคีและวารีพร้อมกัน"
    },
    {
      "id": "MW_BEAST_044",
      "nameTh": "งูทะเลปล่องไฟเขี้ยวเดือด",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "FIRE",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "THERMAL_PREDATOR",
      "bodyPlan": "AQUATIC_SERPENT",
      "temperament": "AGGRESSIVE",
      "hostile": true,
      "behaviorTags": [
        "BOILING_VENOM",
        "VENT_AMBUSH",
        "HIGH_SPEED_SWIM"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 520,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_156",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_181",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_031",
        "MW_ORGAN_006"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "BOILING_VENOM",
        "futureEffectHook": "HOOK_THERMAL_PREDATOR_FIRE",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "อสรพิษทะเลลึกที่อาศัยอยู่ในกระแสน้ำร้อนจัด พิษของมันทำให้อุณหภูมิในเส้นเลือดของเหยื่อพุ่งสูงขึ้นอย่างฉับพลัน"
    },
    {
      "id": "MW_BEAST_045",
      "nameTh": "แมงกะพรุนโคมสายฟ้าสมุทรลึก",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "DRIFTING_HAZARD",
      "bodyPlan": "CNIDARIAN",
      "temperament": "INDIFFERENT",
      "hostile": true,
      "behaviorTags": [
        "BIOLUMINESCENT_LURE",
        "PARALYTIC_NET",
        "INK_CLOUD_IGNORE"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 535,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": false,
        "hasHeartGall": false,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": false,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_160",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_012",
        "MW_ORGAN_002"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "BIOLUMINESCENT_LURE",
        "futureEffectHook": "HOOK_DRIFTING_HAZARD_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "แมงกะพรุนโปร่งแสงที่ส่องประกายสีฟ้าม่วงในความมืดมิดของร่องสมุทร หนวดยาวนับสิบเส้นปล่อยกระแสไฟฟ้าช็อตทุกสิ่งที่ว่ายชน"
    },
    {
      "id": "MW_BEAST_046",
      "nameTh": "ปลาตกเบ็ดโคมวิญญาณอเวจี",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "ABYSS_AMBUSHER",
      "bodyPlan": "PISCES",
      "temperament": "CUNNING",
      "hostile": true,
      "behaviorTags": [
        "SOUL_LANTERN_LURE",
        "JAW_UNHINGE",
        "DARKNESS_CLOAK"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "COMBAT"
      ],
      "combatPower": 940,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_166",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_178",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_012",
        "MW_ORGAN_016"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "SOUL_LANTERN_LURE",
        "futureEffectHook": "HOOK_ABYSS_AMBUSHER_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "ปลาอสูรหน้าตาน่าเกลียดน่ากลัวที่ใช้ติ่งเนื้อเรืองแสงเลียนแบบดวงไฟวิญญาณหรือสมุนไพรทิพย์เพื่อล่อผู้ฝึกตนที่โลภมากเข้าสู่คมเขี้ยว"
    },
    {
      "id": "MW_BEAST_047",
      "nameTh": "เต่าดำก้นสมุทรแบกปล่องแร่",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "WATER",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "ANCIENT_GRAZER",
      "bodyPlan": "REPTILE",
      "temperament": "CALM",
      "hostile": false,
      "behaviorTags": [
        "ABYSSAL_PRESSURE_FIELD",
        "MINERAL_SHELL",
        "PEACEFUL_GIANT"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 955,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_174",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_JADE_TURTLE_SHELL_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_TURTLE_HEART_3",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_032",
        "MW_ORGAN_005"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "ABYSSAL_PRESSURE_FIELD",
        "futureEffectHook": "HOOK_ANCIENT_GRAZER_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "เต่ายักษ์ที่บนกระดองมีปล่องแร่และปะการังเรืองแสงเติบโตเป็นระบบนิเวศขนาดย่อม ผู้ที่คารวะอย่างถูกวิธีสามารถเก็บแร่บนหลังมันได้"
    },
    {
      "id": "MW_BEAST_048",
      "nameTh": "หอยมุกดาราสมุทรบรรพกาล",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "STAR",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "TREASURE_GUARDIAN",
      "bodyPlan": "MOLLUSK",
      "temperament": "DEFENSIVE",
      "hostile": true,
      "behaviorTags": [
        "SHELL_CLAMP_TRAP",
        "PEARL_ILLUSION",
        "TIDAL_RESONANCE"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 1610,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": false,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_189",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_112",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_005",
        "MW_ORGAN_032"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "STAR",
        "specialTrait": "SHELL_CLAMP_TRAP",
        "futureEffectHook": "HOOK_TREASURE_GUARDIAN_STAR",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "หอยมุกยักษ์อายุนับพันปีที่เปิดฝารับกระแสปราณดาราที่สะท้อนลงสู่ก้นทะเล ภายในบ่มเพาะไข่มุกวิญญาณที่ส่องสว่างดั่งดวงจันทร์"
    },
    {
      "id": "MW_BEAST_049",
      "nameTh": "มังกรสมุทรเรืองแสงเจ็ดครีบ",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "WATER",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "ABYSS_APEX",
      "bodyPlan": "DRAGON_SERPENT",
      "temperament": "TERRITORIAL",
      "hostile": true,
      "behaviorTags": [
        "TIDAL_VORTEX",
        "BIOLUMINESCENT_FLASH",
        "PRESSURE_CRUSH"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 1520,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_182",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_163",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_168",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_032",
        "MW_ORGAN_012"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "TIDAL_VORTEX",
        "futureEffectHook": "HOOK_ABYSS_APEX_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "เจ้าแห่งร่องสมุทรลึกที่มีแถบแสงชีวภาพวิ่งไปตามลำตัว สามารถควบแน่นมวลน้ำแรงดันสูงเป็นคมมีดตัดเกราะศัตรู"
    },
    {
      "id": "MW_BEAST_050",
      "nameTh": "เต่ามังกรเสวียนอู่หนุนพิภพ",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "WATER",
      "terrain": "island",
      "primaryEnvironmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "ecologicalRole": "MYTHIC_GUARDIAN",
      "bodyPlan": "MYTHIC_BEAST",
      "temperament": "ANCIENT",
      "hostile": true,
      "behaviorTags": [
        "IMMOVABLE_FORTRESS",
        "WATER_EARTH_DOMAIN",
        "LONGEVITY_AURA"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 2665,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_194",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_142",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_005",
        "MW_ORGAN_019"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "IMMOVABLE_FORTRESS",
        "futureEffectHook": "HOOK_MYTHIC_GUARDIAN_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "เทพอสูรเต่ามังกรที่หลับใหลอยู่ก้นสมุทรลึก ลมหายใจของมันคือกระแสน้ำอุ่นและน้ำเย็นที่หล่อเลี้ยงมหาสมุทรทั้งปวง"
    },
    {
      "id": "MW_BEAST_051",
      "nameTh": "กบสายฟ้าคำรามหนังคราม",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "LIGHTNING",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "ecologicalRole": "STORM_CHORUS",
      "bodyPlan": "AMPHIBIAN",
      "temperament": "TERRITORIAL",
      "hostile": true,
      "behaviorTags": [
        "THUNDER_CROAK",
        "RAIN_CALLER",
        "LEAP_SPARK"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 285,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_150",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_145",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_001",
        "MW_ORGAN_002"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "THUNDER_CROAK",
        "futureEffectHook": "HOOK_STORM_CHORUS_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "กบปราณอัสนีที่จะออกมาร้องประสานเสียงก่อนพายุสายฟ้าจะฟาดลงมา ถุงลมใต้คางสามารถพองออกเพื่อปล่อยคลื่นเสียงผสมสายฟ้า"
    },
    {
      "id": "MW_BEAST_052",
      "nameTh": "แพะภูผาเขาอัสนีคู่",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "ecologicalRole": "HERD_DEFENDER",
      "bodyPlan": "UNGULATE",
      "temperament": "PROUD",
      "hostile": true,
      "behaviorTags": [
        "LIGHTNING_ROD_HORN",
        "THUNDER_CHARGE",
        "MAGNETIC_HOOF"
      ],
      "affordances": [
        "OBSERVE",
        "INTIMIDATE",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 535,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_167",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_002",
        "MW_ORGAN_004"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "LIGHTNING_ROD_HORN",
        "futureEffectHook": "HOOK_HERD_DEFENDER_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "แพะจ่าฝูงที่ยืนอยู่บนยอดเสาหินแม่เหล็กเพื่อล่อให้สายฟ้าผ่าลงมาชุบเขาของตนเอง ทุกครั้งที่พุ่งชนจะเกิดเสียงฟ้าร้องกึกก้อง"
    },
    {
      "id": "MW_BEAST_053",
      "nameTh": "เหยี่ยวสายฟ้าปีกมีดโกน",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "ecologicalRole": "AERIAL_INTERCEPTOR",
      "bodyPlan": "AVIAN",
      "temperament": "FIERCE",
      "hostile": true,
      "behaviorTags": [
        "DIVE_LIGHTNING",
        "HIGH_SPEED",
        "STORM_VISION"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 550,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_158",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_146",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_002",
        "MW_ORGAN_018"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "DIVE_LIGHTNING",
        "futureEffectHook": "HOOK_AERIAL_INTERCEPTOR_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "วิหคนักล่าที่พุ่งดิ่งลงมาจากก้อนเมฆพายุพร้อมกับลำแสงสายฟ้า รวดเร็วเสียจนมองเห็นเป็นเพียงเส้นแสงสีคราม"
    },
    {
      "id": "MW_BEAST_054",
      "nameTh": "วานรสายฟ้าแขนยาวสี่กร",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "ecologicalRole": "PACK_BRAWLER",
      "bodyPlan": "PRIMATE",
      "temperament": "BELLIGERENT",
      "hostile": true,
      "behaviorTags": [
        "THUNDER_DRUM_CHEST",
        "PILLAR_SWING",
        "WEAPON_THROW"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 955,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_175",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_CRYSTAL_KNUCKLE_3",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_002",
        "MW_ORGAN_030"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "THUNDER_DRUM_CHEST",
        "futureEffectHook": "HOOK_PACK_BRAWLER_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "วานรสี่แขนที่ชอบทุบอกสร้างคลื่นสายฟ้าและขว้างก้อนแร่แม่เหล็กใส่ผู้บุกรุก เส้นเอ็นแขนของมันเหนียวและนำปราณอัสนีชั้นเลิศ"
    },
    {
      "id": "MW_BEAST_055",
      "nameTh": "วิหคพายุสายฟ้าปีกคราม",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "ecologicalRole": "SKY_PREDATOR",
      "bodyPlan": "AVIAN",
      "temperament": "PROUD",
      "hostile": true,
      "behaviorTags": [
        "THUNDERCLOUD_TRAIL",
        "FEATHER_DART",
        "ROOST_ON_IRON_PEAK"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 970,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_180",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_ROC_FEATHER_5",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_018",
        "MW_ORGAN_001"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "THUNDERCLOUD_TRAIL",
        "futureEffectHook": "HOOK_SKY_PREDATOR_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "นกยักษ์ที่สร้างรังอยู่บนยอดผาเหล็กอัสนี หัวใจของมันเต้นด้วยจังหวะความถี่ของสายฟ้าทำให้บินฝ่าพายุได้โดยไม่เหน็ดเหนื่อย"
    },
    {
      "id": "MW_BEAST_056",
      "nameTh": "กระทิงเทพอสนีเกราะม่วง",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "ecologicalRole": "PLATEAU_JUGGERNAUT",
      "bodyPlan": "UNGULATE",
      "temperament": "RELENTLESS",
      "hostile": true,
      "behaviorTags": [
        "STAMPEDE_THUNDER",
        "ARC_SHIELD",
        "HORN_PIERCE"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 1520,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_158",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_BOAR_HIDE_2",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_004",
        "MW_ORGAN_030"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "STAMPEDE_THUNDER",
        "futureEffectHook": "HOOK_PLATEAU_JUGGERNAUT_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "กระทิงอสูรขนาดมหึมาที่ทั่วร่างห่อหุ้มด้วยเกราะสายฟ้าสีม่วง ยามวิ่งห้อตะบึงพื้นดินจะแตกร้าวและมีสายฟ้าแลบตามรอยกลีบเท้า"
    },
    {
      "id": "MW_BEAST_057",
      "nameTh": "มังกรสายฟ้าคำรามเก้าปล้อง",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "ecologicalRole": "STORM_LORD",
      "bodyPlan": "DRAGON_SERPENT",
      "temperament": "DOMINEERING",
      "hostile": true,
      "behaviorTags": [
        "TRIBULATION_CALL",
        "LIGHTNING_COIL",
        "MAGNETIC_FLIGHT"
      ],
      "affordances": [
        "AVOID",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 1535,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_186",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_THUNDER_DRAKE_SCALE_4",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_THUNDER_DRAKE_HORN_4",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_009",
        "MW_ORGAN_030"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "TRIBULATION_CALL",
        "futureEffectHook": "HOOK_STORM_LORD_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "เจียวหลงสายฟ้าที่ลอยตัวอยู่ในหมู่เมฆดำเหนือที่ราบสูง คอยดูดกลืนสายฟ้าทัณฑ์สวรรค์มาหลอมรวมเข้ากับกระดูกสันหลัง"
    },
    {
      "id": "MW_BEAST_058",
      "nameTh": "ราชันมังกรอัสนีสวรรค์พิพากษา",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "LIGHTNING",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "ecologicalRole": "CELESTIAL_ARBITER",
      "bodyPlan": "DRAGON_SERPENT",
      "temperament": "MAJESTIC",
      "hostile": true,
      "behaviorTags": [
        "HEAVENLY_JUDGMENT",
        "DEMON_SUPPRESSION",
        "SUPREME_THUNDER"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 2680,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_191",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_148",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_009",
        "MW_ORGAN_030"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHTNING",
        "specialTrait": "HEAVENLY_JUDGMENT",
        "futureEffectHook": "HOOK_CELESTIAL_ARBITER_LIGHTNING",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "มังกรสวรรค์ผู้ถือครองอำนาจแห่งอสนีบาตพิพากษา เกล็ดย้อนใต้คอของมันสลักด้วยกฎเกณฑ์แห่งสายฟ้าที่แม้แต่เซียนยังต้องยำเกรง"
    },
    {
      "id": "MW_BEAST_059",
      "nameTh": "ตัวตุ่นขุดแร่จมูกดาว",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "ecologicalRole": "TUNNEL_EXCAVATOR",
      "bodyPlan": "MAMMAL_BURROW",
      "temperament": "TIMID",
      "hostile": false,
      "behaviorTags": [
        "ORE_SCENT",
        "FAST_BURROW",
        "BLIND_ECHOLOCATION"
      ],
      "affordances": [
        "OBSERVE",
        "TRACK",
        "TAME",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 300,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_155",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_WOLF_PELT_1",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_022",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "ORE_SCENT",
        "futureEffectHook": "HOOK_TUNNEL_EXCAVATOR_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "ตัวตุ่นปราณที่มีติ่งเนื้อรอบจมูกสำหรับตรวจจับความบริสุทธิ์ของสายแร่หยก นักขุดแร่มักสังเกตรอยขุดของมันเพื่อหาแหล่งผลึกล้ำค่า"
    },
    {
      "id": "MW_BEAST_060",
      "nameTh": "ค้างคาวผลึกเสียงสะท้อน",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "ecologicalRole": "CAVE_SWARM_HUNTER",
      "bodyPlan": "CHIROPTERA",
      "temperament": "SKITTISH",
      "hostile": true,
      "behaviorTags": [
        "SONIC_RESONANCE",
        "CEILING_ROOST",
        "DARK_VISION"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "COMBAT"
      ],
      "combatPower": 550,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_162",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_FORM_YIN_CRYSTAL_3",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_001",
        "MW_ORGAN_021"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "SONIC_RESONANCE",
        "futureEffectHook": "HOOK_CAVE_SWARM_HUNTER_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "ค้างคาวถ้ำลึกที่ส่งคลื่นเสียงความถี่สูงไปสะท้อนกับผนังผลึกเพื่อสร้างคลื่นกระแทกโจมตีศัตรูจากความมืด"
    },
    {
      "id": "MW_BEAST_061",
      "nameTh": "ปูเสฉวนแบกผลึกหยก",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "ecologicalRole": "ARMORED_SCAVENGER",
      "bodyPlan": "CRUSTACEAN",
      "temperament": "DEFENSIVE",
      "hostile": true,
      "behaviorTags": [
        "CRYSTAL_CAMOUFLAGE",
        "SHELL_RETRACT",
        "MINERAL_SYMBIOSIS"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 565,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_157",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_ORE_CLOUD_JADE_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_037",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "CRYSTAL_CAMOUFLAGE",
        "futureEffectHook": "HOOK_ARMORED_SCAVENGER_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "ปูถ้ำขนาดใหญ่ที่ใช้โพรงผลึกหยกธรรมชาติแทนเปลือกหอย ยามหดตัวเข้าในผลึกจะดูเหมือนก้อนแร่ธรรมดาจนแยกแทบไม่ออก"
    },
    {
      "id": "MW_BEAST_062",
      "nameTh": "ตะขาบแก้วเรืองแสงถ้ำลึก",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "LIGHT",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "ecologicalRole": "CREVICE_HUNTER",
      "bodyPlan": "INSECTOID",
      "temperament": "AGGRESSIVE",
      "hostile": true,
      "behaviorTags": [
        "PRISM_BODY",
        "NERVE_VENOM",
        "WALL_CRAWLER"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 580,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_CENTIPEDE_VENOM_3",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_147",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_012",
        "MW_ORGAN_006"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHT",
        "specialTrait": "PRISM_BODY",
        "futureEffectHook": "HOOK_CREVICE_HUNTER_LIGHT",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "ตะขาบที่มีลำตัวโปร่งใสเหมือนแท่งคริสตัล เมื่อแสงไฟกระทบตัวมันจะหักเหเป็นลำแสงเจ็ดสีที่ทำให้ศัตรูตาพร่ามัว"
    },
    {
      "id": "MW_BEAST_063",
      "nameTh": "งูหยกขาวกลืนนมศิลา",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "ecologicalRole": "POOL_GUARDIAN",
      "bodyPlan": "SERPENT",
      "temperament": "CALM",
      "hostile": false,
      "behaviorTags": [
        "STALACTITE_DRINKER",
        "JADE_SKIN",
        "COIL_MEDITATION"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 880,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_140",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_EXO_120",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_028",
        "MW_ORGAN_036"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "STALACTITE_DRINKER",
        "futureEffectHook": "HOOK_POOL_GUARDIAN_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "งูขาวบริสุทธิ์ที่เฝ้าแอ่งน้ำตาหินงอกในโถงถ้ำลึก ไม่ดุร้ายหากไม่ถูกแย่งชิงตาน้ำ และมักลอกคราบหยกขาวทิ้งไว้ริมสระ"
    },
    {
      "id": "MW_BEAST_064",
      "nameTh": "แมงมุมใยแก้วสะท้อนจิต",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "LIGHT",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "ecologicalRole": "MIND_TRAPPER",
      "bodyPlan": "ARACHNID",
      "temperament": "CUNNING",
      "hostile": true,
      "behaviorTags": [
        "RESONANCE_WEB",
        "MIND_SHOCK",
        "VIBRATION_SENSE"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 895,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_167",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_ORE_MIND_CRYSTAL_3",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_008",
        "MW_ORGAN_037"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHT",
        "specialTrait": "RESONANCE_WEB",
        "futureEffectHook": "HOOK_MIND_TRAPPER_LIGHT",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "แมงมุมถ้ำผลึกที่ชักใยใสราวเส้นแก้วเชื่อมระหว่างหน่อหินงอก หากผู้ใดแตะโดนเส้นใย คลื่นเสียงสะท้อนจะสั่นคลอนทะเลจิตทันที"
    },
    {
      "id": "MW_BEAST_065",
      "nameTh": "ยักษ์ศิลาผลึกเรโซแนนซ์",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "ecologicalRole": "CAVERN_SENTINEL",
      "bodyPlan": "CONSTRUCT_BEAST",
      "temperament": "STOIC",
      "hostile": true,
      "behaviorTags": [
        "CRYSTAL_REGROWTH",
        "SONIC_QUAKE",
        "MAGIC_REFLECT"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 1550,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": false
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_187",
          "anatomyType": "MARROW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_CRYSTAL_CORE_3",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_024",
        "MW_ORGAN_037"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "CRYSTAL_REGROWTH",
        "futureEffectHook": "HOOK_CAVERN_SENTINEL_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "อสูรยักษ์ที่ร่างกายประกอบขึ้นจากหินผาและผลึกทัวร์มาลีน มีแกนไขกระดูกศิลาสีทองที่ช่วยฟื้นฟูร่างกายเมื่อยืนอยู่บนสายแร่"
    },
    {
      "id": "MW_BEAST_066",
      "nameTh": "มังกรผลึกเจ็ดสีใต้พิภพ",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "ecologicalRole": "SUBTERRANEAN_SOVEREIGN",
      "bodyPlan": "DRAGON_SERPENT",
      "temperament": "MAJESTIC",
      "hostile": true,
      "behaviorTags": [
        "PRISM_BREATH",
        "EARTH_VEIN_CONTROL",
        "CRYSTAL_DOMAIN"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 2695,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_141",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_187",
          "anatomyType": "MARROW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_037",
        "MW_ORGAN_039"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "PRISM_BREATH",
        "futureEffectHook": "HOOK_SUBTERRANEAN_SOVEREIGN_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "มังกรโบราณที่จำศีลอยู่บนสายแร่หยกจักรพรรดิ เกล็ดทั่วร่างเป็นผลึกเจ็ดสีที่สะท้อนและขยายอานุภาพปราณธาตุได้อย่างน่าอัศจรรย์"
    },
    {
      "id": "MW_BEAST_067",
      "nameTh": "เต่าทองสปอร์หลับใหล",
      "tier": 1,
      "maxDropSlots": 2,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_09_FUNGAL_GROVE",
      "ecologicalRole": "SPORE_CARRIER",
      "bodyPlan": "INSECTOID",
      "temperament": "DOCILE",
      "hostile": false,
      "behaviorTags": [
        "SLEEP_PUFF",
        "FUNGUS_GRAZER",
        "HARMLESS"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "TAME",
        "AVOID"
      ],
      "combatPower": 195,
      "basePop": 95,
      "maxPop": 156,
      "reproPerSeason": 14,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": false,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_HERB_003",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_147",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_015",
        "MW_ORGAN_010"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "SLEEP_PUFF",
        "futureEffectHook": "HOOK_SPORE_CARRIER_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "แมลงเต่าทองหลังจุดที่อาศัยอยู่ตามหมวกเห็ดยักษ์ เมื่อตกใจจะพ่นละอองสปอร์หลับใหลออกมาแล้วแกล้งตาย"
    },
    {
      "id": "MW_BEAST_068",
      "nameTh": "แมงมุมหลังเห็ดเรืองแสง",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_09_FUNGAL_GROVE",
      "ecologicalRole": "SYMBIOTIC_TRAPPER",
      "bodyPlan": "ARACHNID",
      "temperament": "CAUTIOUS",
      "hostile": true,
      "behaviorTags": [
        "FUNGAL_WEB",
        "GLOW_LURE",
        "SPORE_IMMUNE"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 330,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_154",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_132",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_015",
        "MW_ORGAN_008"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "FUNGAL_WEB",
        "futureEffectHook": "HOOK_SYMBIOTIC_TRAPPER_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "แมงมุมที่ยอมให้เห็ดเรืองแสงเติบโตบนหลังเพื่อใช้แสงล่อแมลงกลางคืน เส้นใยของมันมีฤทธิ์ฆ่าเชื้อและกรองพิษ"
    },
    {
      "id": "MW_BEAST_069",
      "nameTh": "กวางเขาสปอร์หลินจือม่วง",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_09_FUNGAL_GROVE",
      "ecologicalRole": "SYMBIOTIC_HERBIVORE",
      "bodyPlan": "UNGULATE",
      "temperament": "GENTLE",
      "hostile": false,
      "behaviorTags": [
        "MEDICINAL_ANTLER",
        "SPORE_TRAIL",
        "HEALING_AURA"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 580,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_MIST_STAG_ANTLER_3",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_163",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_015",
        "MW_ORGAN_004"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "MEDICINAL_ANTLER",
        "futureEffectHook": "HOOK_SYMBIOTIC_HERBIVORE_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "กวางวิญญาณที่บนเขามีเห็ดหลินจือม่วงเจ็ดดาวเติบโตอยู่ร่วมกันอย่างสมดุล สามารถแลกเปลี่ยนอาหารปราณเพื่อขอตัดกิ่งเขาเห็ดได้โดยไม่ทำร้ายมัน"
    },
    {
      "id": "MW_BEAST_070",
      "nameTh": "หมูป่าเขี้ยวราทมิฬขุดเห็ด",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_09_FUNGAL_GROVE",
      "ecologicalRole": "TRUFFLE_FORAGER",
      "bodyPlan": "SUIDAE",
      "temperament": "IRRITABLE",
      "hostile": true,
      "behaviorTags": [
        "TRUFFLE_SNIFF",
        "SPORE_RAGE",
        "THICK_HIDE"
      ],
      "affordances": [
        "OBSERVE",
        "TRACK",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 490,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_BOAR_HIDE_2",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_163",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_010",
        "MW_ORGAN_015"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "TRUFFLE_SNIFF",
        "futureEffectHook": "HOOK_TRUFFLE_FORAGER_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "หมูป่าจมูกไวที่เชี่ยวชาญการขุดหาเห็ดหัวบุกและเห็ดถั่งเช่าใต้ดิน หากตามรอยมันอย่างระมัดระวังจะพบแหล่งสมุนไพรหายาก"
    },
    {
      "id": "MW_BEAST_071",
      "nameTh": "ตั๊กแตนร่างปรสิตถั่งเช่าทอง",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_09_FUNGAL_GROVE",
      "ecologicalRole": "PARASITIZED_HOST",
      "bodyPlan": "INSECTOID",
      "temperament": "ERRATIC",
      "hostile": true,
      "behaviorTags": [
        "FUNGAL_PUPPET",
        "FEARLESS_ATTACK",
        "SPORE_BURST_ON_DEATH"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "COMBAT"
      ],
      "combatPower": 505,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_HERB_008",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_163",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_146",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_015",
        "MW_ORGAN_006"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "FUNGAL_PUPPET",
        "futureEffectHook": "HOOK_PARASITIZED_HOST_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "อสูรแมลงที่ถูกเชื้อราถั่งเช่าควบคุมระบบประสาทจนไร้ความกลัวตาย เมื่อถูกสังหารจะปล่อยก้อนแก่นปราณปรสิตที่มีคุณค่าทางยาสูงยิ่ง"
    },
    {
      "id": "MW_BEAST_072",
      "nameTh": "ผีเสื้อราตรีปีกสปอร์มายา",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_09_FUNGAL_GROVE",
      "ecologicalRole": "ILLUSION_FLUTTER",
      "bodyPlan": "INSECTOID",
      "temperament": "ELUSIVE",
      "hostile": true,
      "behaviorTags": [
        "HALLUCINOGEN_SCALES",
        "DREAM_POLLINATOR",
        "SILENT_WING"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 910,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_DREAM_MOTH_WING_3",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_229",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_014",
        "MW_ORGAN_015"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "HALLUCINOGEN_SCALES",
        "futureEffectHook": "HOOK_ILLUSION_FLUTTER_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ผีเสื้อขนาดใหญ่ในป่าเห็ดที่ละอองปีกทำให้เกิดภาพหลอนเจ็ดอารมณ์ มักตอมเกสรดอกไม้กินแมลงและเห็ดหลินจือระดับสูง"
    },
    {
      "id": "MW_BEAST_073",
      "nameTh": "พยัคฆ์เงาคลั่งปรสิตสมอง",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_09_FUNGAL_GROVE",
      "ecologicalRole": "INFECTED_APEX",
      "bodyPlan": "FELINE",
      "temperament": "FRENZIED",
      "hostile": true,
      "behaviorTags": [
        "PAIN_IMMUNE",
        "MYCELIUM_CLAWS",
        "CONTAGIOUS_ROAR"
      ],
      "affordances": [
        "AVOID",
        "RESCUE",
        "COMBAT"
      ],
      "combatPower": 925,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_HERB_023",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_SHADOW_PANTHER_CLAW_3",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_015",
        "MW_ORGAN_011"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "PAIN_IMMUNE",
        "futureEffectHook": "HOOK_INFECTED_APEX_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "เสือดำที่ถูกเห็ดราปรสิตสมองคุกคามจนคลุ้มคลั่ง ผู้ฝึกตนที่มีความรู้โอสถสูงสามารถใช้ยาชำระพิษช่วยชีวิตมันเพื่อรับของตอบแทนหรือสังหารเพื่อเก็บเห็ดปรสิต"
    },
    {
      "id": "MW_BEAST_074",
      "nameTh": "มหาพฤกษาเห็ดพันกรเจ้าป่าสปอร์",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "forest",
      "primaryEnvironmentId": "MW_ENV_09_FUNGAL_GROVE",
      "ecologicalRole": "GROVE_OVERMIND",
      "bodyPlan": "PLANT_BEAST",
      "temperament": "TERRITORIAL",
      "hostile": true,
      "behaviorTags": [
        "MYCELIUM_NETWORK",
        "SPORE_FOG_DOMAIN",
        "REGENERATION"
      ],
      "affordances": [
        "AVOID",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 1580,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": false,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_163",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_005",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_015",
        "MW_ORGAN_033"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "MYCELIUM_NETWORK",
        "futureEffectHook": "HOOK_GROVE_OVERMIND_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "สิ่งมีชีวิตกึ่งอสูรกึ่งอาณาจักรเห็ดยักษ์ที่เชื่อมโยงรากใยไปทั่วป่าเห็ด สามารถรับรู้ทุกฝีก้าวของผู้ที่เหยียบย่ำเส้นใยของมัน"
    },
    {
      "id": "MW_BEAST_075",
      "nameTh": "ปลาคาร์ปกระจกเกล็ดเจ็ดสี",
      "tier": 1,
      "maxDropSlots": 2,
      "element": "WATER",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "ecologicalRole": "AUSPICIOUS_SWIMMER",
      "bodyPlan": "PISCES",
      "temperament": "TIMID",
      "hostile": false,
      "behaviorTags": [
        "SCHOOL_SWIM",
        "LUCK_AURA",
        "LEAP_OVER_WAVE"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "TAME",
        "HARVEST_SHED"
      ],
      "combatPower": 210,
      "basePop": 95,
      "maxPop": 156,
      "reproPerSeason": 14,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": false,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_152",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_005",
        "MW_ORGAN_012"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "SCHOOL_SWIM",
        "futureEffectHook": "HOOK_AUSPICIOUS_SWIMMER_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "ฝูงปลาปราณที่แหวกว่ายใต้ใบบัววิญญาณ เกล็ดที่หลุดร่วงตามธรรมชาติมีประกายเจ็ดสีและช่วยทำให้จิตใจผู้พกพาสงบร่มเย็น"
    },
    {
      "id": "MW_BEAST_076",
      "nameTh": "นกกระเต็นหยกฟ้าพุ่งดิ่ง",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "WIND",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "ecologicalRole": "PRECISION_HUNTER",
      "bodyPlan": "AVIAN",
      "temperament": "ALERT",
      "hostile": true,
      "behaviorTags": [
        "WATER_DIVE",
        "RIPPLELESS_ENTRY",
        "SHARP_BEAK"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 345,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_154",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_132",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_003",
        "MW_ORGAN_014"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "WIND",
        "specialTrait": "WATER_DIVE",
        "futureEffectHook": "HOOK_PRECISION_HUNTER_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "นกตัวเล็กขนสีฟ้าสดที่พุ่งลงน้ำได้โดยไม่เกิดระลอกคลื่นแม้แต่น้อย ขนปีกของมันใช้ทำพู่กันเขียนยันต์สายจิตวิญญาณได้ดีเยี่ยม"
    },
    {
      "id": "MW_BEAST_077",
      "nameTh": "กวางน้ำค้างเจ็ดสีริมบึง",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "LIGHT",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "ecologicalRole": "SPIRIT_GRAZER",
      "bodyPlan": "UNGULATE",
      "temperament": "GENTLE",
      "hostile": false,
      "behaviorTags": [
        "WATER_WALK",
        "PURE_AURA",
        "FLEE_FROM_MALICE"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "RESCUE",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 490,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_170",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_CLOUD_ANTLER_2",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_CLOUD_SINEW_2",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_036",
        "MW_ORGAN_004"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHT",
        "specialTrait": "WATER_WALK",
        "futureEffectHook": "HOOK_SPIRIT_GRAZER_LIGHT",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "กวางมงคลที่ก้าวเดินบนผิวน้ำของทะเลสาบกระจกได้ราวกับเดินบนพื้นดิน จะปรากฏตัวให้เห็นเฉพาะผู้ที่ไม่มีจิตสังหาร"
    },
    {
      "id": "MW_BEAST_078",
      "nameTh": "เต่าหยกขาวหลังศิลาจารึก",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "WATER",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "ecologicalRole": "LORE_BEARER",
      "bodyPlan": "REPTILE",
      "temperament": "CALM",
      "hostile": false,
      "behaviorTags": [
        "RUNE_CARAPACE",
        "SUN_BASKING",
        "LONG_LIVED"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 505,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_JADE_TURTLE_SHELL_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_TIDE_CORE_3",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_019",
        "MW_ORGAN_005"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "RUNE_CARAPACE",
        "futureEffectHook": "HOOK_LORE_BEARER_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "เต่าหยกโบราณที่ขึ้นมาอาบแดดบนโขดหินกลางทะเลสาบ ลวดลายบนกระดองแฝงเคล็ดวิชาเดินปราณที่ผู้มีปัญญาสามารถเพ่งศึกษาได้"
    },
    {
      "id": "MW_BEAST_079",
      "nameTh": "หงส์ขาวเงากระจกสะท้อนจันทร์",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "LIGHT",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "ecologicalRole": "LAKE_GUARDIAN",
      "bodyPlan": "AVIAN",
      "temperament": "GRACEFUL",
      "hostile": true,
      "behaviorTags": [
        "MIRROR_CLONE",
        "SONG_OF_CLARITY",
        "PAIR_BOND"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 910,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_CELESTIAL_CRANE_PLUME_4",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_CELESTIAL_CRANE_CORE_4",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_017",
        "MW_ORGAN_003"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "LIGHT",
        "specialTrait": "MIRROR_CLONE",
        "futureEffectHook": "HOOK_LAKE_GUARDIAN_LIGHT",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "หงส์คู่รักที่สร้างเงาสะท้อนบนผิวน้ำให้มีตัวตนจริงเพื่อช่วยกันปกป้องรัง เสียงร้องของมันช่วยสลายมารในใจผู้ที่ได้ยิน"
    },
    {
      "id": "MW_BEAST_080",
      "nameTh": "อสูรเงาสะท้อนลวงจิตใต้น้ำ",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "ecologicalRole": "MIMIC_PREDATOR",
      "bodyPlan": "SPIRIT_ENTITY",
      "temperament": "DECEPTIVE",
      "hostile": true,
      "behaviorTags": [
        "DOPPELGANGER_MIMIC",
        "SOUL_PULL",
        "NO_CORPOREAL_MEAT"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 925,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": false,
        "hasHeartGall": false,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": false,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": false
      },
      "partDrops": [
        {
          "matId": "MAT_ORE_MIND_CRYSTAL_3",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_EXO_140",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_017",
        "MW_ORGAN_029"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "DOPPELGANGER_MIMIC",
        "futureEffectHook": "HOOK_MIMIC_PREDATOR_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "สิ่งมีชีวิตกึ่งวิญญาณที่ซ่อนอยู่ใต้ผิวน้ำกระจก เลียนแบบรูปร่างและความทรงจำของผู้ที่ก้มมองน้ำเพื่อล่อให้ตกลงไปในห้วงภวังค์"
    },
    {
      "id": "MW_BEAST_081",
      "nameTh": "ม้าน้ำมังกรครามสายหมอก",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "WATER",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "ecologicalRole": "MIST_WEAVER",
      "bodyPlan": "PISCES",
      "temperament": "ELUSIVE",
      "hostile": true,
      "behaviorTags": [
        "MIST_SCREEN",
        "WATER_JET",
        "CORAL_GUARDIAN"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 940,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_138",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_152",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_005",
        "MW_ORGAN_018"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WATER",
        "specialTrait": "MIST_SCREEN",
        "futureEffectHook": "HOOK_MIST_WEAVER_WATER",
        "baselineFallback": "CHILL_SLOW"
      },
      "descTh": "ม้าน้ำขนาดใหญ่ที่มีหงอนและหนวดเหมือนมังกรวารี พ่นม่านหมอกเจ็ดสีปกคลุมเกาะกลางทะเลสาบเพื่อซ่อนสมุนไพรทิพย์"
    },
    {
      "id": "MW_BEAST_082",
      "nameTh": "ปลาวาฬเมฆาแหวกว่ายกระจกฟ้า",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "WIND",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "ecologicalRole": "SKY_LAKE_COLOSSUS",
      "bodyPlan": "CETACEAN",
      "temperament": "PEACEFUL",
      "hostile": false,
      "behaviorTags": [
        "SKY_WATER_TRANSITION",
        "SONIC_HYMN",
        "GENTLE_GIANT"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "RESCUE",
        "COMBAT"
      ],
      "combatPower": 1595,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_188",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_219",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_018",
        "MW_ORGAN_001"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WIND",
        "specialTrait": "SKY_WATER_TRANSITION",
        "futureEffectHook": "HOOK_SKY_LAKE_COLOSSUS_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "อสูรวาฬยักษ์ที่สามารถกระโจนจากผืนน้ำทะเลสาบกระจกขึ้นไปแหวกว่ายบนทะเลเมฆได้ เสียงร้องทุ้มลึกของมันช่วยเปิดจุดชีพจรที่ติดขัด"
    },
    {
      "id": "MW_BEAST_083",
      "nameTh": "ผึ้งหยกทองเฝ้าสวนท้อ",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "LIGHT",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "ecologicalRole": "GARDEN_POLLINATOR",
      "bodyPlan": "INSECTOID",
      "temperament": "DEFENSIVE",
      "hostile": true,
      "behaviorTags": [
        "ROYAL_JELLY_MAKER",
        "SWARM_FORMATION",
        "FLOWER_GUARD"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 345,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_218",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_EXO_111",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_006",
        "MW_ORGAN_014"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHT",
        "specialTrait": "ROYAL_JELLY_MAKER",
        "futureEffectHook": "HOOK_GARDEN_POLLINATOR_LIGHT",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ฝู้งผึ้งวิญญาณที่ยังคงทำหน้าที่ดูแลสวนสมุนไพรเซียนที่ร่วงหล่น หากวางศิลาปราณแลกเปลี่ยนจะสามารถเก็บน้ำผึ้งและขี้ผึ้งหยกได้โดยไม่ถูกต่อย"
    },
    {
      "id": "MW_BEAST_084",
      "nameTh": "ตุ๊กตาศิลาคนสวนโบราณ",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "ecologicalRole": "AUTOMATON_KEEPER",
      "bodyPlan": "CONSTRUCT",
      "temperament": "PROGRAMMED",
      "hostile": true,
      "behaviorTags": [
        "NO_FLESH_OR_BLOOD",
        "IGNORE_NON_THREAT",
        "REPAIR_PROTOCOL"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 490,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": false,
        "hasHeartGall": false,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": false,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": false
      },
      "partDrops": [
        {
          "matId": "MAT_FORM_ARRAY_CORE_basic_3",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_ORE_068",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_024",
        "MW_ORGAN_037"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "NO_FLESH_OR_BLOOD",
        "futureEffectHook": "HOOK_AUTOMATON_KEEPER_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "หุ่นศิลาจารึกอักขระที่ยังคงพรวนดินและรดน้ำต้นไม้ตามคำสั่งเมื่อพันปีก่อน จะโจมตีเฉพาะผู้ที่ถอนรากสมุนไพรอย่างตะกละตะกลาม"
    },
    {
      "id": "MW_BEAST_085",
      "nameTh": "กระเรียนหยกขาวคาบคัมภีร์",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "WIND",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "ecologicalRole": "SANCTUARY_MESSENGER",
      "bodyPlan": "AVIAN",
      "temperament": "INTELLIGENT",
      "hostile": true,
      "behaviorTags": [
        "SUTRA_GUARDIAN",
        "GRACEFUL_FLIGHT",
        "RESPECT_SCHOLARS"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "TAME",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 895,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_CELESTIAL_CRANE_PLUME_4",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_CELESTIAL_CRANE_CORE_4",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_018",
        "MW_ORGAN_017"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "WIND",
        "specialTrait": "SUTRA_GUARDIAN",
        "futureEffectHook": "HOOK_SANCTUARY_MESSENGER_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "นกกระเรียนเซียนที่อาศัยอยู่ตามศาลาวิหารพังทลาย ชื่นชอบผู้ฝึกตนที่มีกลิ่นอายปราชญ์และบางครั้งจะคาบเศษหน้าคัมภีร์มามอบให้"
    },
    {
      "id": "MW_BEAST_086",
      "nameTh": "กวางทองคำเก้าสีเฝ้าบ่อน้ำทิพย์",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "LIGHT",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "ecologicalRole": "SACRED_GUARDIAN",
      "bodyPlan": "UNGULATE",
      "temperament": "BENEVOLENT",
      "hostile": false,
      "behaviorTags": [
        "BLESSING_HALO",
        "PURIFY_POISON",
        "TELEPORT_LEAP"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "RESCUE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 1550,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_157",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_170",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_035",
        "MW_ORGAN_036"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHT",
        "specialTrait": "BLESSING_HALO",
        "futureEffectHook": "HOOK_SACRED_GUARDIAN_LIGHT",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "อสูรมงคลจากจิตรกรรมฝาผนังโบราณที่มีรัศมีเก้าสีรอบกาย เลือดและเขาของมันมีฤทธิ์ชำระล้างพิษมารและฟื้นฟูชีพจรที่ขาดสะบั้น"
    },
    {
      "id": "MW_BEAST_087",
      "nameTh": "สิงโตศิลาหยกพิทักษ์ซุ้มประตู",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "ecologicalRole": "GATE_SENTINEL",
      "bodyPlan": "CONSTRUCT_BEAST",
      "temperament": "STERN",
      "hostile": true,
      "behaviorTags": [
        "ROAR_SHOCKWAVE",
        "STONE_SKIN",
        "TRIAL_GUARDIAN"
      ],
      "affordances": [
        "OBSERVE",
        "INTIMIDATE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 1565,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": false
      },
      "partDrops": [
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_169",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_187",
          "anatomyType": "MARROW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_021",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "ROAR_SHOCKWAVE",
        "futureEffectHook": "HOOK_GATE_SENTINEL_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "สิงโตหยกคู่ที่เฝ้าหน้าตำหนักโอสถร้าง มีจิตวิญญาณสถิตอยู่ภายในและจะยอมเปิดทางให้ผู้ที่ผ่านการทดสอบกำลังหรือความเคารพ"
    },
    {
      "id": "MW_BEAST_088",
      "nameTh": "งูพฤกษาเถาวัลย์ดอกท้อเซียน",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "WOOD",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "ecologicalRole": "ORCHARD_WARDEN",
      "bodyPlan": "SERPENT",
      "temperament": "PROTECTIVE",
      "hostile": true,
      "behaviorTags": [
        "BLOSSOM_CAMOUFLAGE",
        "ENTANGLE_VINE",
        "SWEET_POLLEN_SLEEP"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 940,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_FORM_LIFE_ESSENCE_DEW_4",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_PYTHON_TENDON_3",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_033",
        "MW_ORGAN_028"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WOOD",
        "specialTrait": "BLOSSOM_CAMOUFLAGE",
        "futureEffectHook": "HOOK_ORCHARD_WARDEN_WOOD",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "อสรพิษโบราณที่บนหัวมีกิ่งดอกท้อเซียนผลิบาน คอยเฝ้าต้นท้อทิพย์ไม่ให้ถูกแมลงหรือผู้บุกรุกทำลาย"
    },
    {
      "id": "MW_BEAST_089",
      "nameTh": "ค่างขาวปราชญ์เฝ้าหอตำรา",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "LIGHT",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "ecologicalRole": "SCRIPTURE_KEEPER",
      "bodyPlan": "PRIMATE",
      "temperament": "SCHOLARLY",
      "hostile": false,
      "behaviorTags": [
        "MARTIAL_MIMIC",
        "CALLIGRAPHY_LOVER",
        "TEA_CONNOISSEUR"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 1595,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_184",
          "anatomyType": "MARROW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_155",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_017",
        "MW_ORGAN_039"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHT",
        "specialTrait": "MARTIAL_MIMIC",
        "futureEffectHook": "HOOK_SCRIPTURE_KEEPER_LIGHT",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ค่างชราขนสีขาวหิมะที่แอบจำกระบวนท่าของเซียนในอดีตไว้มากมาย หากนำชาวิญญาณหรือหมึกชั้นดีมามอบให้ มันจะชี้แนะเคล็ดวิชาโบราณ"
    },
    {
      "id": "MW_BEAST_090",
      "nameTh": "ราชันย์กิเลนสวรรค์พิทักษ์ชีพจร",
      "tier": 7,
      "maxDropSlots": 3,
      "element": "LIGHT",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "ecologicalRole": "SUPREME_GUARDIAN",
      "bodyPlan": "MYTHIC_BEAST",
      "temperament": "DIVINE",
      "hostile": false,
      "behaviorTags": [
        "CELESTIAL_LAW",
        "AUSPICIOUS_CLOUD",
        "MERCIFUL_JUDGMENT"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 4490,
      "basePop": 5,
      "maxPop": 12,
      "reproPerSeason": 2,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_MYTHIC_GUARDIAN_CORE_6",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_193",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_FROST_KIRIN_PLUME_5",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_036",
        "MW_ORGAN_039"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "LIGHT",
        "specialTrait": "CELESTIAL_LAW",
        "futureEffectHook": "HOOK_SUPREME_GUARDIAN_LIGHT",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เทพอสูรระดับสูงสุดที่คอยพยุงเศษเสี้ยวอุทยานสวรรค์ไม่ให้พังทลายลงสู่ความว่างเปล่า ผู้ที่มีคุณธรรมสูงส่งอาจได้รับพรหรือขนมงคลจากมัน"
    },
    {
      "id": "MW_BEAST_091",
      "nameTh": "อีกาจิกศพเนตรโลหิต",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "YIN",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "ecologicalRole": "CARRION_FLOCK",
      "bodyPlan": "AVIAN",
      "temperament": "OPPORTUNISTIC",
      "hostile": true,
      "behaviorTags": [
        "CORPSE_FEEDER",
        "DEATH_OMEN",
        "FLOCK_HARASS"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 255,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_ASHEN_FEATHER_3",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_EMBER_GALL_3",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_003",
        "MW_ORGAN_029"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "YIN",
        "specialTrait": "CORPSE_FEEDER",
        "futureEffectHook": "HOOK_CARRION_FLOCK_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "ฝูงอีกาที่กินซากศพและปราณอาฆาตในสมรภูมิโบราณ ขนปีกสีดำอมแดงของมันใช้ทำลูกธนูอาคมและพู่กันสายมาร"
    },
    {
      "id": "MW_BEAST_092",
      "nameTh": "หมาป่ากระดูกขาวกินเหล็ก",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "ecologicalRole": "PACK_SCAVENGER",
      "bodyPlan": "CANINE",
      "temperament": "FEROCIOUS",
      "hostile": true,
      "behaviorTags": [
        "BONE_ARMOR",
        "SWORD_CHEWER",
        "NIGHT_HOWL"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 505,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_166",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_FORM_BLOOD_FIEND_CRYSTAL_4",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_WOLF_FANG_1",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_016",
        "MW_ORGAN_021"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "BONE_ARMOR",
        "futureEffectHook": "HOOK_PACK_SCAVENGER_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "หมาป่าอสูรที่แทะกินดาบหักและกระดูกนักรบจนเขี้ยวแข็งแกร่งดั่งเหล็กกล้า มักออกล่าเป็นฝูงในยามที่หมอกโลหิตลงจัด"
    },
    {
      "id": "MW_BEAST_093",
      "nameTh": "อาชาศึกโครงกระดูกเพลิงคราม",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "ecologicalRole": "PHANTOM_CHARGER",
      "bodyPlan": "EQUINE",
      "temperament": "RESTLESS",
      "hostile": true,
      "behaviorTags": [
        "GHOST_FIRE_HOOF",
        "TIRELES_GALLOP",
        "WAR_MEMORY"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 520,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_158",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_EXO_124",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_011",
        "MW_ORGAN_021"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "GHOST_FIRE_HOOF",
        "futureEffectHook": "HOOK_PHANTOM_CHARGER_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "ม้าศึกโบราณที่ดวงวิญญาณยังคงควบตะบึงอยู่ในสมรภูมิร้าง หากผู้ฝึกตนแสดงเจตจำนงแห่งนักรบที่เที่ยงแท้ มันจะยอมสงบลงและมอบแก่นไฟวิญญาณ"
    },
    {
      "id": "MW_BEAST_094",
      "nameTh": "ตะขาบศพเกราะศาสตราหัก",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "METAL",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "ecologicalRole": "TRENCH_AMBUSHER",
      "bodyPlan": "INSECTOID",
      "temperament": "RUTHLESS",
      "hostile": true,
      "behaviorTags": [
        "BLADE_CARAPACE",
        "CORPSE_TOXIN",
        "BURROW_AMBUSH"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 925,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_CENTIPEDE_CARAPACE_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_226",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_009",
        "MW_ORGAN_016"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "METAL",
        "specialTrait": "BLADE_CARAPACE",
        "futureEffectHook": "HOOK_TRENCH_AMBUSHER_METAL",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ตะขาบยักษ์ที่ใช้เศษเกราะและใบดาบหักในสนามรบมาเชื่อมติดกับเปลือกของตนเอง ทุกการเลื้อยผ่านเหมือนมีคมมีดนับร้อยกรีดเฉือน"
    },
    {
      "id": "MW_BEAST_095",
      "nameTh": "วิญญาณกระบี่อาฆาตไร้เจ้าของ",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "METAL",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "ecologicalRole": "WEAPON_WRAITH",
      "bodyPlan": "SPIRIT_CONSTRUCT",
      "temperament": "VENGEFUL",
      "hostile": true,
      "behaviorTags": [
        "NO_FLESH_OR_BLOOD",
        "FLYING_SWORD_SWARM",
        "SWORD_INTENT_RESONANCE"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 940,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": false,
        "hasHeartGall": false,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": false,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": false
      },
      "partDrops": [
        {
          "matId": "MW_MAT_EXO_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_231",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_EXO_139",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_034",
        "MW_ORGAN_037"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "METAL",
        "specialTrait": "NO_FLESH_OR_BLOOD",
        "futureEffectHook": "HOOK_WEAPON_WRAITH_METAL",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เจตจำนงกระบี่ของผู้ยอดยุทธ์ที่ตายในสนามรบแล้วควบแน่นเข้ากับเศษศาสตรา ไม่มีเลือดเนื้อแต่ทิ้งแก่นปราณกระบี่และเศษเหล็กเซียนไว้เมื่อสลายตัว"
    },
    {
      "id": "MW_BEAST_096",
      "nameTh": "พยัคฆ์มารทลายศิลาเกราะกระดูก",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "ecologicalRole": "WARLORD_BEAST",
      "bodyPlan": "FELINE",
      "temperament": "BLOODTHIRSTY",
      "hostile": true,
      "behaviorTags": [
        "BLOOD_FRENZY",
        "BONE_SPIKE_SHIELD",
        "EXECUTION_LEAP"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 1595,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_185",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_ABYSS_FIEND_HEART_4",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_016",
        "MW_ORGAN_021"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "BLOOD_FRENZY",
        "futureEffectHook": "HOOK_WARLORD_BEAST_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "พยัคฆ์อสูรที่เติบโตจากการกลืนกินแก่นปราณในสุสานรบ มีโครงกระดูกสีขาวงอกหุ้มนอกผิวหนังเป็นเกราะที่ทั้งแข็งและคม"
    },
    {
      "id": "MW_BEAST_097",
      "nameTh": "ยักษ์อสุราสี่กรถือศาสตราหัก",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "FIRE",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "ecologicalRole": "BATTLEFIELD_TITAN",
      "bodyPlan": "HUMANOID_FIEND",
      "temperament": "BELLIGERENT",
      "hostile": true,
      "behaviorTags": [
        "MULTI_WEAPON_STRIKE",
        "WAR_CRY_STAGGER",
        "UNDYING_WILL"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 1610,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_ABYSS_FIEND_HEART_4",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_172",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_007",
        "MW_ORGAN_030"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "FIRE",
        "specialTrait": "MULTI_WEAPON_STRIKE",
        "futureEffectHook": "HOOK_BATTLEFIELD_TITAN_FIRE",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "อสูรสงครามร่างสูงใหญ่ที่หลงใหลการต่อสู้ หากพบผู้ฝึกตนสายกายาหรือสายกระบี่ที่กล้าหาญ มันจะท้าประลองอย่างตรงไปตรงมา"
    },
    {
      "id": "MW_BEAST_098",
      "nameTh": "มังกรโครงกระดูกยมโลกเก้าขุม",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "plains",
      "primaryEnvironmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "ecologicalRole": "DEATH_SOVEREIGN",
      "bodyPlan": "DRAGON_UNDEAD",
      "temperament": "MALEVOLENT",
      "hostile": true,
      "behaviorTags": [
        "NETHER_BREATH",
        "BONE_REANIMATION",
        "SOUL_CHILL"
      ],
      "affordances": [
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 2650,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": false
      },
      "partDrops": [
        {
          "matId": "NW_MAT_162",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_160",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_021",
        "MW_ORGAN_030"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "NETHER_BREATH",
        "futureEffectHook": "HOOK_DEATH_SOVEREIGN_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "ซากมังกรโบราณที่ถูกปราณหยินและเพลิงวิญญาณในสมรภูมิปลุกให้ตื่นขึ้น แม้ไร้เนื้อหนังแต่โครงกระดูกและกะโหลกของมันคือสุดยอดวัสดุหลอมศาสตรามาร"
    },
    {
      "id": "MW_BEAST_099",
      "nameTh": "กวางผาหินปูนกีบเมฆา",
      "tier": 1,
      "maxDropSlots": 2,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "ecologicalRole": "CLIFF_LEAPER",
      "bodyPlan": "UNGULATE",
      "temperament": "AGILE",
      "hostile": true,
      "behaviorTags": [
        "VERTICAL_WALL_RUN",
        "WIND_SENSE",
        "TIMID_HERD"
      ],
      "affordances": [
        "OBSERVE",
        "TRACK",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 150,
      "basePop": 95,
      "maxPop": 156,
      "reproPerSeason": 14,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": false,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_146",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_CLOUD_SINEW_2",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "anatomyType": "MEAT_EGG_MUSK",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_011",
        "MW_ORGAN_004"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "VERTICAL_WALL_RUN",
        "futureEffectHook": "HOOK_CLIFF_LEAPER_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "กวางขนาดเล็กที่กระโดดไต่หน้าผาหินปูนตั้งฉากได้อย่างน่าอัศจรรย์ เอ็นขาและเขาของมันช่วยเสริมความมั่นคงในการเคลื่อนที่"
    },
    {
      "id": "MW_BEAST_100",
      "nameTh": "ลิงลมหางแส้เสาหิน",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "WIND",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "ecologicalRole": "PILLAR_ACROBAT",
      "bodyPlan": "PRIMATE",
      "temperament": "MISCHIEVOUS",
      "hostile": true,
      "behaviorTags": [
        "GALE_SWING",
        "HERB_PICKER",
        "THROW_PEBBLES"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 285,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_CLOUD_SINEW_2",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_132",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_001",
        "MW_ORGAN_018"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WIND",
        "specialTrait": "GALE_SWING",
        "futureEffectHook": "HOOK_PILLAR_ACROBAT_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ลิงปราณวายุที่ใช้หางยาวเหนียวหนึบเกี่ยวกับยอดเสาหินปูนเพื่อเหวี่ยงตัวข้ามหุบเหว รู้แหล่งซ่อนของกล้วยไม้หน้าผาเป็นอย่างดี"
    },
    {
      "id": "MW_BEAST_101",
      "nameTh": "อินทรีลมกรดปีกใบมีด",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "WIND",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "ecologicalRole": "CANYON_HUNTER",
      "bodyPlan": "AVIAN",
      "temperament": "SHARP_EYED",
      "hostile": true,
      "behaviorTags": [
        "GALE_CANNON_DIVE",
        "UPDRAFT_SOAR",
        "NEST_ON_SPIRE"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "HARVEST_SHED",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 535,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_158",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_146",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_018",
        "MW_ORGAN_003"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "WIND",
        "specialTrait": "GALE_CANNON_DIVE",
        "futureEffectHook": "HOOK_CANYON_HUNTER_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "นกอินทรีที่อาศัยกระแสลมกรดระหว่างเสาหินในการพุ่งโจมตี ขนปีกที่ผลัดไว้ในรังบนยอดเสาหินมีค่าอย่างยิ่งสำหรับงานช่าง"
    },
    {
      "id": "MW_BEAST_102",
      "nameTh": "สิงโตหินปูนแผงคอศิลา",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "ecologicalRole": "BRIDGE_GUARDIAN",
      "bodyPlan": "FELINE",
      "temperament": "TERRITORIAL",
      "hostile": true,
      "behaviorTags": [
        "STONE_ROAR",
        "BRIDGE_BLOCKADE",
        "HEAVY_PAW"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 550,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_169",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_CRYSTAL_HIDE_3",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_024",
        "MW_ORGAN_001"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "STONE_ROAR",
        "futureEffectHook": "HOOK_BRIDGE_GUARDIAN_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "สิงโตภูผาที่ชอบนอนขวางสะพานหินธรรมชาติระหว่างเสาหินปูน ขนแผงคอแข็งตัวเป็นเส้นหินช่วยลดแรงฟันของคมดาบ"
    },
    {
      "id": "MW_BEAST_103",
      "nameTh": "งูบินปีกพังผืดวายุคราม",
      "tier": 3,
      "maxDropSlots": 3,
      "element": "WIND",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "ecologicalRole": "GLIDING_VIPER",
      "bodyPlan": "SERPENT",
      "temperament": "STEALTHY",
      "hostile": true,
      "behaviorTags": [
        "RIB_WING_GLIDE",
        "AIR_AMBUSH",
        "WIND_VENOM"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 565,
      "basePop": 65,
      "maxPop": 108,
      "reproPerSeason": 10,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_PYTHON_SCALE_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_PYTHON_TENDON_3",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_133",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_014",
        "MW_ORGAN_028"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WIND",
        "specialTrait": "RIB_WING_GLIDE",
        "futureEffectHook": "HOOK_GLIDING_VIPER_WIND",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "อสรพิษที่กางซี่โครงออกเป็นปีกพังผืดร่อนไปตามกระแสลมหุบเขา จู่โจมจากกลางอากาศโดยไร้เสียง"
    },
    {
      "id": "MW_BEAST_104",
      "nameTh": "พังพอนเคียวลมไร้เงา",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "WIND",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "ecologicalRole": "SWIFT_PREDATOR",
      "bodyPlan": "MUSTELID",
      "temperament": "FEROCIOUS",
      "hostile": true,
      "behaviorTags": [
        "VACUUM_CLAW",
        "SNAKE_HUNTER",
        "BLUR_SPEED"
      ],
      "affordances": [
        "OBSERVE",
        "TRACK",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 970,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_155",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_145",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_011",
        "MW_ORGAN_034"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "WIND",
        "specialTrait": "VACUUM_CLAW",
        "futureEffectHook": "HOOK_SWIFT_PREDATOR_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ศัตรูตามธรรมชาติของงูบินในป่าเสาหิน เคลื่อนไหวเร็วประดุจสายลมกระโชกและมีกรงเล็บที่สร้างคมมีดสุญญากาศ"
    },
    {
      "id": "MW_BEAST_105",
      "nameTh": "วิหค鹏 (เผิง) ปีกเมฆาตัดผา",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "WIND",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "ecologicalRole": "SKY_SOVEREIGN",
      "bodyPlan": "AVIAN",
      "temperament": "DOMINEERING",
      "hostile": true,
      "behaviorTags": [
        "HURRICANE_WING",
        "PILLAR_SHATTER",
        "HIGH_ALTITUDE_NEST"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 1520,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_ROC_FEATHER_5",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_HEAVEN_CORE_5",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_146",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_018",
        "MW_ORGAN_025"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "WIND",
        "specialTrait": "HURRICANE_WING",
        "futureEffectHook": "HOOK_SKY_SOVEREIGN_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "พญาวิหคสายเลือดคุนเผิงที่ปีกข้างเดียวกว้างคลุมยอดเสาหิน กระพือปีกครั้งเดียวเกิดพายุหมุนพัดหินผาปลิวว่อน"
    },
    {
      "id": "MW_BEAST_106",
      "nameTh": "พญาครุฑปีกทองสะบั้นเมฆา",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "WIND",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "ecologicalRole": "MYTHIC_APEX",
      "bodyPlan": "AVIAN",
      "temperament": "PROUD",
      "hostile": true,
      "behaviorTags": [
        "SERPENT_BANE",
        "GOLDEN_GALE",
        "SUPREME_SPEED"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 2665,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_152",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_180",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_018",
        "MW_ORGAN_035"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "WIND",
        "specialTrait": "SERPENT_BANE",
        "futureEffectHook": "HOOK_MYTHIC_APEX_WIND",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เทพอสูรวิหคทองคำผู้เป็นเจ้าแห่งเวหาและศัตรูคู่อาฆาตของตระกูลอสรพิษทั้งปวง ขนปีกสีทองของมันตัดผ่านม่านปราณได้ทุกชนิด"
    },
    {
      "id": "MW_BEAST_107",
      "nameTh": "ด้วงแม่เหล็กกินสะเก็ดดาว",
      "tier": 2,
      "maxDropSlots": 2,
      "element": "STAR",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "METEOR_SCAVENGER",
      "bodyPlan": "INSECTOID",
      "temperament": "DOCILE",
      "hostile": false,
      "behaviorTags": [
        "MAGNETIC_SHELL",
        "METEOR_FINDER",
        "ROLL_IRON_BALL"
      ],
      "affordances": [
        "OBSERVE",
        "HARVEST_SHED",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 285,
      "basePop": 80,
      "maxPop": 132,
      "reproPerSeason": 12,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_144",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_ORE_STAR_COPPER_3",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            2
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_022",
        "MW_ORGAN_037"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "STAR",
        "specialTrait": "MAGNETIC_SHELL",
        "futureEffectHook": "HOOK_METEOR_SCAVENGER_STAR",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "ด้วงปราณที่กลิ้งก้อนเศษแร่อุกกาบาตไปตามพื้นหลุมดาวตก เปลือกของมันมีสนามแม่เหล็กที่ช่วยชี้ตำแหน่งสายแร่ดารา"
    },
    {
      "id": "MW_BEAST_108",
      "nameTh": "แรดเกราะหยกดาราทลายผา",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "STAR",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "HEAVY_CHARGER",
      "bodyPlan": "UNGULATE",
      "temperament": "TERRITORIAL",
      "hostile": true,
      "behaviorTags": [
        "GRAVITY_CHARGE",
        "STAR_HORN",
        "HEAVY_ARMOR"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 925,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_159",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_179",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_004",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "STAR",
        "specialTrait": "GRAVITY_CHARGE",
        "futureEffectHook": "HOOK_HEAVY_CHARGER_STAR",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "แรดร่างยักษ์ที่อาศัยอยู่ในเขตแรงโน้มถ่วงสามเท่าของหลุมดาวตก นอเดี่ยวบนจมูกอัดแน่นด้วยมวลสารแร่อุกกาบาต"
    },
    {
      "id": "MW_BEAST_109",
      "nameTh": "งูยักษ์หลุมดาราเกล็ดเงิน",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "STAR",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "CRATER_CONSTRICTOR",
      "bodyPlan": "SERPENT",
      "temperament": "PATIENT",
      "hostile": true,
      "behaviorTags": [
        "GRAVITY_COIL",
        "STARLIGHT_ABSORB",
        "DENSE_BONE"
      ],
      "affordances": [
        "AVOID",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 940,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_176",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_138",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_009",
        "MW_ORGAN_030"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "STAR",
        "specialTrait": "GRAVITY_COIL",
        "futureEffectHook": "HOOK_CRATER_CONSTRICTOR_STAR",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "งูยักษ์ที่โครงกระดูกวิวัฒนาการให้ทนทานต่อแรงกดทับของสนามแรงโน้มถ่วงดารา ยามค่ำคืนเกล็ดจะเรืองแสงตามหมู่ดาว"
    },
    {
      "id": "MW_BEAST_110",
      "nameTh": "เสือดาวเจ็ดดาราเร้นแสง",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "STAR",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "STARLIGHT_HUNTER",
      "bodyPlan": "FELINE",
      "temperament": "ELUSIVE",
      "hostile": true,
      "behaviorTags": [
        "CONSTELLATION_SPOTS",
        "STAR_STEP",
        "NIGHT_EMPOWERED"
      ],
      "affordances": [
        "OBSERVE",
        "TRACK",
        "TAME",
        "COMBAT"
      ],
      "combatPower": 955,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_180",
          "anatomyType": "HIDE_PELT",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_145",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_011",
        "MW_ORGAN_003"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "STAR",
        "specialTrait": "CONSTELLATION_SPOTS",
        "futureEffectHook": "HOOK_STARLIGHT_HUNTER_STAR",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "เสือดาวที่มีจุดบนลำตัวเรียงเป็นรูปกลุ่มดาวกระบวยเหนือ สามารถยืมแสงดาวในการก้าวพริบตาข้ามหลุมหิน"
    },
    {
      "id": "MW_BEAST_111",
      "nameTh": "หมีศิลาอุกกาบาตแบกฟ้า",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "STAR",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "GRAVITY_BRUTE",
      "bodyPlan": "URSINE",
      "temperament": "FIERCE",
      "hostile": true,
      "behaviorTags": [
        "GRAVITY_DOMAIN_SLAM",
        "METEOR_HIDE",
        "UNYIELDING"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 1610,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_178",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_187",
          "anatomyType": "MARROW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_024",
        "MW_ORGAN_037"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "STAR",
        "specialTrait": "GRAVITY_DOMAIN_SLAM",
        "futureEffectHook": "HOOK_GRAVITY_BRUTE_STAR",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "พญาหมีที่จำศีลทับก้อนอุกกาบาตหลักจนขนและผิวหนังผสานกับเหล็กไหลดารา ทุกฝ่ามือที่ตบลงมาจะเพิ่มแรงโน้มถ่วงกดทับศัตรู"
    },
    {
      "id": "MW_BEAST_112",
      "nameTh": "ช้างสารปฐพีหกงาแบกดารา",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "EARTH",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "HERD_MATRIARCH",
      "bodyPlan": "PROBOSCIDEA",
      "temperament": "PROTECTIVE",
      "hostile": true,
      "behaviorTags": [
        "EARTHQUAKE_STOMP",
        "SIX_TUSK_GUARD",
        "PROTECT_HERD"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 1520,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_160",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_BP_187",
          "anatomyType": "MARROW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_004",
        "MW_ORGAN_024"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "EARTH",
        "specialTrait": "EARTHQUAKE_STOMP",
        "futureEffectHook": "HOOK_HERD_MATRIARCH_EARTH",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "ช้างอสูรโบราณที่มีงาหยกหกข้าง พละกำลังมหาศาลสามารถเดินฝ่าสนามแรงโน้มถ่วงผิดปกติได้เหมือนเดินบนทางราบ"
    },
    {
      "id": "MW_BEAST_113",
      "nameTh": "กิเลนดาราจักรเก้าสี",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "STAR",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "ASTRAL_AUSPICE",
      "bodyPlan": "MYTHIC_BEAST",
      "temperament": "NOBLE",
      "hostile": false,
      "behaviorTags": [
        "STARLIGHT_BRIDGE",
        "FATE_PROTECTION",
        "COSMIC_AURA"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 2665,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_193",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_190",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_019",
        "MW_ORGAN_039"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "STAR",
        "specialTrait": "STARLIGHT_BRIDGE",
        "futureEffectHook": "HOOK_ASTRAL_AUSPICE_STAR",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "อสูรเทพที่ปรากฏตัวในคืนที่มีฝนดาวตกเหนือหลุมอุกกาบาต เขาของมันเชื่อมโยงกับพลังดาราจักรและชะตาฟ้าดิน"
    },
    {
      "id": "MW_BEAST_114",
      "nameTh": "พยัคฆ์ขาวบรรพกาลจ้าวศาสตราดารา",
      "tier": 7,
      "maxDropSlots": 3,
      "element": "METAL",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "SUPREME_PREDATOR",
      "bodyPlan": "MYTHIC_BEAST",
      "temperament": "FIERCE",
      "hostile": true,
      "behaviorTags": [
        "METAL_STAR_SLAUGHTER",
        "ARMOR_SHATTER_ROAR",
        "APEX_SOVEREIGN"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 4430,
      "basePop": 5,
      "maxPop": 12,
      "reproPerSeason": 2,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_TIGER_BONE_6",
          "anatomyType": "BONE_HORN",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_BP_TIGER_BLOOD_6",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_137",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_034",
        "MW_ORGAN_030"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "METAL",
        "specialTrait": "METAL_STAR_SLAUGHTER",
        "futureEffectHook": "HOOK_SUPREME_PREDATOR_METAL",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เทพอสูรพยัคฆ์ขาวผู้ถือครองปราณทองคำและดวงดาวแห่งการศึก เพียงลมหายใจก็คมกริบดั่งหมื่นคมกระบี่"
    },
    {
      "id": "MW_BEAST_115",
      "nameTh": "ราชันเจียวหลงดาราจักรกลืนดาว",
      "tier": 7,
      "maxDropSlots": 3,
      "element": "STAR",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_14_STARFALL_CRATER",
      "ecologicalRole": "COSMIC_DRAGON",
      "bodyPlan": "DRAGON_SERPENT",
      "temperament": "MAJESTIC",
      "hostile": true,
      "behaviorTags": [
        "STARFALL_CALL",
        "GRAVITY_COLLAPSE",
        "SUPREME_DRAGON"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 4445,
      "basePop": 5,
      "maxPop": 12,
      "reproPerSeason": 2,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_BP_DRAGON_PEARL_7",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_DRAGON_SCALE_7",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_DRAGON_HEART_7",
          "anatomyType": "HEART_GALL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_019",
        "MW_ORGAN_040"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "STAR",
        "specialTrait": "STARFALL_CALL",
        "futureEffectHook": "HOOK_COSMIC_DRAGON_STAR",
        "baselineFallback": "STAGGER_BLOW"
      },
      "descTh": "มังกรบรรพกาลที่ขดตัวรอบแกนอุกกาบาตใจกลางหลุมดารา บ่มเพาะมุกมังกรด้วยรังสีดาราจักรนับหมื่นปี"
    },
    {
      "id": "MW_BEAST_116",
      "nameTh": "ปลากระเบนมิติแหวกว่ายความว่างเปล่า",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "RIFT_GLIDER",
      "bodyPlan": "PISCES_VOID",
      "temperament": "ALOOF",
      "hostile": true,
      "behaviorTags": [
        "PHASE_GLIDE",
        "SPATIAL_TAIL_WHIP",
        "RIFT_FEEDER"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 940,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_FORM_VOID_COMPASS_SHARD_5",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_160",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_027",
        "MW_ORGAN_018"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "VOID",
        "specialTrait": "PHASE_GLIDE",
        "futureEffectHook": "HOOK_RIFT_GLIDER_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "อสูรรูปร่างคล้ายปลากระเบนโปร่งแสงที่แหวกว่ายผ่านรอยแยกอากาศเหมือนว่ายในน้ำ นักสำรวจมักสังเกตทิศทางที่มันว่ายเพื่อหลบพายุสุญตา"
    },
    {
      "id": "MW_BEAST_117",
      "nameTh": "แมงมุมแม่ม่ายสุญตาทอไยมิติ",
      "tier": 4,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "RIFT_WEAVER",
      "bodyPlan": "ARACHNID",
      "temperament": "CUNNING",
      "hostile": true,
      "behaviorTags": [
        "SPATIAL_WEB_TRAP",
        "PHASE_BITE",
        "RIFT_STABILIZER"
      ],
      "affordances": [
        "AVOID",
        "OBSERVE",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 955,
      "basePop": 50,
      "maxPop": 84,
      "reproPerSeason": 8,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_179",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_167",
          "anatomyType": "TENDON_TAIL",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_134",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_008",
        "MW_ORGAN_027"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "VOID",
        "specialTrait": "SPATIAL_WEB_TRAP",
        "futureEffectHook": "HOOK_RIFT_WEAVER_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "แมงมุมประหลาดที่ถักทอเส้นใยเย็บรอยแยกมิติเล็กๆ เข้าด้วยกันเพื่อดักจับสิ่งมีชีวิตที่หลุดผ่านรอยแยกออกมา"
    },
    {
      "id": "MW_BEAST_118",
      "nameTh": "เหยี่ยวสุญตาปีกตัดมิติ",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "RIFT_HUNTER",
      "bodyPlan": "AVIAN",
      "temperament": "FIERCE",
      "hostile": true,
      "behaviorTags": [
        "BLINK_DIVE",
        "SPATIAL_SLASH",
        "VOID_EYES"
      ],
      "affordances": [
        "AVOID",
        "TRACK",
        "COMBAT"
      ],
      "combatPower": 1610,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_FORM_VOID_COMPASS_SHARD_5",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_ROC_FEATHER_5",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_027",
        "MW_ORGAN_003"
      ],
      "combatHooks": {
        "preferredRange": "RANGED",
        "elementalAffinity": "VOID",
        "specialTrait": "BLINK_DIVE",
        "futureEffectHook": "HOOK_RIFT_HUNTER_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เหยี่ยวนักล่าที่สามารถพับระยะทางพุ่งจู่โจมเหยื่อจากอีกฟากของรอยแยกมิติ ขนปีกของมันคมกริบจนกรีดผืนอากาศให้เปิดออกได้"
    },
    {
      "id": "MW_BEAST_119",
      "nameTh": "ผีเสื้อสุญตาข้ามภพทอฝัน",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "DREAM_DRIFTER",
      "bodyPlan": "INSECTOID",
      "temperament": "MYSTERIOUS",
      "hostile": true,
      "behaviorTags": [
        "DIMENSION_POLLEN",
        "ILLUSION_REALITY_SWAP",
        "NON_AGGRESSIVE"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 1520,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_190",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_DREAM_MOTH_WING_3",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        },
        {
          "matId": "MW_MAT_EXO_140",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_027",
        "MW_ORGAN_014"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "VOID",
        "specialTrait": "DIMENSION_POLLEN",
        "futureEffectHook": "HOOK_DREAM_DRIFTER_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "ผีเสื้อสีเงินพร่าเลือนที่บินไปมาระหว่างโลกความจริงและห้วงความฝันในรอยแยกมิติ ผู้ที่จิตมั่นคงสามารถเก็บละอองปีกของมันมาใช้ศึกษาวิชาเซน"
    },
    {
      "id": "MW_BEAST_120",
      "nameTh": "อสูรเงาไร้ลักษณ์กลืนปราณ",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "VOID_STALKER",
      "bodyPlan": "SPIRIT_ENTITY",
      "temperament": "PREDATORY",
      "hostile": true,
      "behaviorTags": [
        "NO_CORPOREAL_MEAT",
        "QI_SIPHON_AURA",
        "PHYSICAL_RESIST"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 1535,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": false,
        "hasHeartGall": false,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": false,
        "hasFangClaw": false,
        "hasTendonTail": false,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": false
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_190",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_MW_ORGAN_029",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_040",
        "MW_ORGAN_011"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "VOID",
        "specialTrait": "NO_CORPOREAL_MEAT",
        "futureEffectHook": "HOOK_VOID_STALKER_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "สิ่งมีชีวิตไร้รูปร่างตายตัวที่เกิดจากปราณตกค้างในรอยแยกสุญตา อาวุธธรรมดาฟันผ่านร่างเงาได้ยาก ต้องอาศัยปราณจิตหรือสายฟ้าจึงจะสยบได้"
    },
    {
      "id": "MW_BEAST_121",
      "nameTh": "เต่าลอยฟ้าแบกเกาะศิลา",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "FLOATING_ISLAND",
      "bodyPlan": "REPTILE",
      "temperament": "ANCIENT",
      "hostile": true,
      "behaviorTags": [
        "ANTI_GRAVITY_SHELL",
        "SAFE_HAVEN",
        "SPACE_ANCHOR"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "HARVEST_SHED",
        "COMBAT"
      ],
      "combatPower": 1550,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": true,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MAT_FORM_SKY_LEVITATION_CORE_5",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_189",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_018",
        "MW_ORGAN_019"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "VOID",
        "specialTrait": "ANTI_GRAVITY_SHELL",
        "futureEffectHook": "HOOK_FLOATING_ISLAND_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เต่าโบราณที่ลอยเคว้งอยู่ในชายขอบสุญตา บนกระดองมีเศษดินและสมุนไพรหายากเติบโตอยู่ เป็นจุดพักพิงปลอดภัยท่ามกลางพายุรอยแยก"
    },
    {
      "id": "MW_BEAST_122",
      "nameTh": "สุนัขล่าวิญญาณสามหัวเฝ้ารอยแยก",
      "tier": 5,
      "maxDropSlots": 3,
      "element": "YIN",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "RIFT_GUARDIAN",
      "bodyPlan": "CANINE",
      "temperament": "FEROCIOUS",
      "hostile": true,
      "behaviorTags": [
        "THREE_HEAD_COORDINATION",
        "SOUL_BARK",
        "NO_BLINDSPOT"
      ],
      "affordances": [
        "AVOID",
        "INTIMIDATE",
        "COMBAT"
      ],
      "combatPower": 1565,
      "basePop": 35,
      "maxPop": 60,
      "reproPerSeason": 6,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": true,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": true,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_170",
          "anatomyType": "BLOOD",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_149",
          "anatomyType": "FANG_CLAW",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "NW_MAT_135",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_016",
        "MW_ORGAN_001"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "YIN",
        "specialTrait": "THREE_HEAD_COORDINATION",
        "futureEffectHook": "HOOK_RIFT_GUARDIAN_YIN",
        "baselineFallback": "VENOM_DOT"
      },
      "descTh": "สุนัขอสูรสามหัวที่เฝ้าทางเชื่อมระหว่างสมรภูมิโบราณและรอยแยกสุญตา ทั้งสามหัวมองเห็นสามทิศทางทำให้ไม่อาจลอบโจมตีจากด้านหลังได้"
    },
    {
      "id": "MW_BEAST_123",
      "nameTh": "พญาอสรพิษแปดเศียรกลืนมิติ",
      "tier": 6,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "CALAMITY_BEAST",
      "bodyPlan": "DRAGON_SERPENT",
      "temperament": "CHAOTIC",
      "hostile": true,
      "behaviorTags": [
        "EIGHT_ELEMENT_BREATH",
        "REGROW_HEAD",
        "SPATIAL_DISTORTION"
      ],
      "affordances": [
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 2710,
      "basePop": 20,
      "maxPop": 36,
      "reproPerSeason": 4,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": true,
        "hasHide": false,
        "hasScales": true,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_136",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_141",
          "anatomyType": "SCALE_CARAPACE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_175",
          "anatomyType": "VENOM_GLAND",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "PRECISION_DISSECT",
          "fragile": true,
          "damagedByFire": true,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_031",
        "MW_ORGAN_040"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "VOID",
        "specialTrait": "EIGHT_ELEMENT_BREATH",
        "futureEffectHook": "HOOK_CALAMITY_BEAST_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "อสรพิษบรรพกาลแปดหัวที่แต่ละหัวพ่นปราณธาตุและพิษต่างชนิดกัน อาศัยอยู่ในส่วนลึกของรอยแยกมิติที่พายุปราณรุนแรงที่สุด"
    },
    {
      "id": "MW_BEAST_124",
      "nameTh": "มหาอสูรคุนเผิงข้ามทะเลสุญตา",
      "tier": 7,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "TRANSCENDENT_COLOSSUS",
      "bodyPlan": "MYTHIC_BEAST",
      "temperament": "TRANSCENDENT",
      "hostile": false,
      "behaviorTags": [
        "FISH_BIRD_TRANSFORM",
        "SWALLOW_RIFT",
        "REALM_TRAVELER"
      ],
      "affordances": [
        "OBSERVE",
        "OFFERING",
        "COMBAT"
      ],
      "combatPower": 4475,
      "basePop": 5,
      "maxPop": 12,
      "reproPerSeason": 2,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": true,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "NW_MAT_137",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MW_MAT_BP_195",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "MAT_BP_ROC_FEATHER_5",
          "anatomyType": "SPIRIT_HAIR_FEATHER",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "CAREFUL_SKINNING",
          "fragile": false,
          "damagedByFire": true,
          "damagedByCrush": false
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_018",
        "MW_ORGAN_040"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "VOID",
        "specialTrait": "FISH_BIRD_TRANSFORM",
        "futureEffectHook": "HOOK_TRANSCENDENT_COLOSSUS_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "เทพอสูรในตำนานที่ยามอยู่ในสมุทรเป็นปลาคุน ยามทะยานขึ้นสู่รอยแยกสุญตาเป็นวิหคเผิง การได้พบเห็นเพียงเงาของมันก็นับเป็นมหาโชควาสนา"
    },
    {
      "id": "MW_BEAST_125",
      "nameTh": "มหาอสูรโกลาหลไร้ลักษณ์ต้นกำเนิด",
      "tier": 7,
      "maxDropSlots": 3,
      "element": "VOID",
      "terrain": "mountain",
      "primaryEnvironmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "ecologicalRole": "PRIMORDIAL_ENTITY",
      "bodyPlan": "MYTHIC_BEAST",
      "temperament": "ENIGMATIC",
      "hostile": true,
      "behaviorTags": [
        "CHAOS_LAW",
        "NULLIFY_TECHNIQUE",
        "ORIGIN_QI"
      ],
      "affordances": [
        "OBSERVE",
        "AVOID",
        "COMBAT"
      ],
      "combatPower": 4490,
      "basePop": 5,
      "maxPop": 12,
      "reproPerSeason": 2,
      "anatomy": {
        "hasBlood": true,
        "hasHeartGall": true,
        "hasVenom": false,
        "hasHide": false,
        "hasScales": false,
        "hasBoneHorn": true,
        "hasFangClaw": false,
        "hasTendonTail": true,
        "hasFurOrFeather": false,
        "hasCore": true,
        "hasMeatMusk": true
      },
      "partDrops": [
        {
          "matId": "MW_MAT_BP_195",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        },
        {
          "matId": "NW_MAT_240",
          "anatomyType": "SPIRIT_LIQUID",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": true,
          "damagedByFire": false,
          "damagedByCrush": false
        },
        {
          "matId": "MAT_TR_VOID_MATRIX_CORE",
          "anatomyType": "BEAST_CORE",
          "baseQty": [
            1,
            1
          ],
          "harvestMethod": "HEAVY_CLEAVE",
          "fragile": false,
          "damagedByFire": false,
          "damagedByCrush": true
        }
      ],
      "eligibleRareOrgans": [
        "MW_ORGAN_040",
        "MW_ORGAN_039"
      ],
      "combatHooks": {
        "preferredRange": "MELEE",
        "elementalAffinity": "VOID",
        "specialTrait": "CHAOS_LAW",
        "futureEffectHook": "HOOK_PRIMORDIAL_ENTITY_VOID",
        "baselineFallback": "FIERCE_STRIKE"
      },
      "descTh": "สิ่งมีชีวิตยุคก่อนเปิดฟ้าดินที่หลงเหลืออยู่ในใจกลางรอยแยกหมื่นภพ ร่างกายเป็นกลุ่มก้อนปราณโกลาหลที่ให้กำเนิดและกลืนกินสรรพสิ่ง"
    }
  ],
  "nwBeastDropFixups": {
    "NW_BEAST_045": [
      {
        "matId": "NW_MAT_142",
        "anatomyType": "SCALE_CARAPACE"
      },
      {
        "matId": "NW_MAT_171",
        "anatomyType": "BLOOD"
      }
    ],
    "NW_BEAST_041": [
      {
        "matId": "NW_MAT_143",
        "anatomyType": "SCALE_CARAPACE"
      }
    ],
    "NW_BEAST_052": [
      {
        "matId": "NW_MAT_144",
        "anatomyType": "SCALE_CARAPACE"
      }
    ],
    "NW_BEAST_050": [
      {
        "matId": "NW_MAT_147",
        "anatomyType": "FANG_CLAW"
      }
    ],
    "NW_BEAST_030": [
      {
        "matId": "NW_MAT_149",
        "anatomyType": "FANG_CLAW"
      }
    ],
    "NW_BEAST_029": [
      {
        "matId": "NW_MAT_156",
        "anatomyType": "SPIRIT_HAIR_FEATHER"
      }
    ],
    "NW_BEAST_064": [
      {
        "matId": "NW_MAT_159",
        "anatomyType": "BONE_HORN"
      }
    ],
    "NW_BEAST_028": [
      {
        "matId": "NW_MAT_161",
        "anatomyType": "BONE_HORN"
      }
    ],
    "NW_BEAST_096": [
      {
        "matId": "NW_MAT_162",
        "anatomyType": "BONE_HORN"
      }
    ],
    "NW_BEAST_051": [
      {
        "matId": "NW_MAT_166",
        "anatomyType": "TENDON_TAIL"
      }
    ],
    "NW_BEAST_055": [
      {
        "matId": "NW_MAT_167",
        "anatomyType": "TENDON_TAIL"
      }
    ],
    "NW_BEAST_098": [
      {
        "matId": "NW_MAT_172",
        "anatomyType": "BLOOD"
      }
    ],
    "NW_BEAST_049": [
      {
        "matId": "NW_MAT_174",
        "anatomyType": "VENOM_GLAND"
      }
    ],
    "NW_BEAST_003": [
      {
        "matId": "NW_MAT_181",
        "anatomyType": "HIDE_PELT"
      }
    ],
    "NW_BEAST_062": [
      {
        "matId": "NW_MAT_184",
        "anatomyType": "MARROW"
      }
    ],
    "NW_BEAST_053": [
      {
        "matId": "NW_MAT_187",
        "anatomyType": "SCALE_CARAPACE"
      }
    ],
    "NW_BEAST_044": [
      {
        "matId": "NW_MAT_188",
        "anatomyType": "HEART_GALL"
      }
    ],
    "NW_BEAST_040": [
      {
        "matId": "NW_MAT_189",
        "anatomyType": "TENDON_TAIL"
      }
    ]
  },
  "newRecipes": [
    {
      "id": "MW_REC_001",
      "nameTh": "ตำรับโอสถหมอกม่วงสมานชีพจร",
      "craftPath": "ALCHEMY",
      "tier": 1,
      "minMastery": 22,
      "durationDays": 16,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_001",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_050",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_141",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถหมอกม่วงสมานชีพจร",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 26,
        "healInjury": 14,
        "restoreQi": 12,
        "toxicity": 1
      },
      "descTh": "ประสานรากโสมหมอกม่วงและหญ้าน้ำค้างหยกขาวด้วยพิษอ่อนๆ ของเขี้ยวงูไม้เพื่อกระตุ้นการสมานเส้นชีพจรขั้นต้น"
    },
    {
      "id": "MW_REC_002",
      "nameTh": "ตำรับโอสถมอสหยกเรืองแสงพอกแผล",
      "craftPath": "ALCHEMY",
      "tier": 1,
      "minMastery": 20,
      "durationDays": 14,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_002",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_005",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_142",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถมอสหยกเรืองแสง",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 32,
        "healInjury": 18,
        "clearPoison": 8,
        "toxicity": 1
      },
      "descTh": "ใช้มอสหยกถ้ำลึกและกระดองปูศิลาบดละเอียด เคลือบด้วยยางสนเกราะเหลือง สมานแผลสดและลดอาการอักเสบ"
    },
    {
      "id": "MW_REC_003",
      "nameTh": "ตำรับโอสถสปอร์นิทราสลายความปวด",
      "craftPath": "ALCHEMY",
      "tier": 1,
      "minMastery": 24,
      "durationDays": 15,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_003",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_006",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_145",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถสปอร์นิทราสลายปวด",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "healInjury": 28,
        "griefRelief": 16,
        "heartDemonRelief": 10,
        "toxicity": 2
      },
      "descTh": "ใช้สปอร์เห็ดหลับใหลในปริมาณพอเหมาะร่วมกับสาหร่ายเกลียวคราม ช่วยระงับความเจ็บปวดและคลายความตึงเครียดของดวงจิต"
    },
    {
      "id": "MW_REC_004",
      "nameTh": "ตำรับโอสถผลหนามแดงบำรุงโลหิต",
      "craftPath": "ALCHEMY",
      "tier": 1,
      "minMastery": 25,
      "durationDays": 16,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_004",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_084",
          "count": 1
        },
        {
          "matId": "MAT_BP_BEAST_MEAT_1",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถผลหนามแดงบำรุงโลหิต",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 30,
        "cultivationProgress": 9,
        "restoreQi": 15,
        "toxicity": 2
      },
      "descTh": "เคี่ยวผลหนามแดงกับเนื้อปราณด้วยไฟถ่านศิลาเพลิงอุ่น เสริมสร้างเลือดเนื้อและพละกำลังให้ศิษย์สายหลอมกายา"
    },
    {
      "id": "MW_REC_005",
      "nameTh": "ตำรับโอสถถั่งเช่าหนอนศิลาหล่อเลี้ยงกระดูก",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 34,
      "durationDays": 22,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_008",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_051",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_153",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถถั่งเช่าหนอนศิลา",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 38,
        "healInjury": 26,
        "foundationBonus": 6,
        "cultivationProgress": 13,
        "toxicity": 2
      },
      "descTh": "ผสานเห็ดถั่งเช่าหนอนศิลากับเลือดอุ่นแพะภูผาและรากบัวศิลา เสริมความแข็งแกร่งของไขกระดูกและรากฐานกายา"
    },
    {
      "id": "MW_REC_006",
      "nameTh": "ตำรับโอสถขิงเพลิงขับพิษเหมันต์",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 35,
      "durationDays": 20,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_010",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_052",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_117",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถขิงเพลิงขับเหมันต์",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "clearPoison": 26,
        "restoreQi": 28,
        "healHealth": 24,
        "toxicity": 2
      },
      "descTh": "ใช้รากขิงเพลิงและพริกไทยอัคคีต้มในน้ำพุร้อนกำมะถัน ขับไล่ไอเย็นเหมันต์และเปิดเส้นชีพจรที่ถูกแช่แข็ง"
    },
    {
      "id": "MW_REC_007",
      "nameTh": "ตำรับโอสถผลแก้วน้ำค้างแข็งสงบจิต",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 36,
      "durationDays": 22,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_011",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_054",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_118",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถผลแก้วน้ำค้างแข็ง",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 24,
        "griefRelief": 22,
        "daoComprehensionBonus": 5,
        "toxicityRelief": 12,
        "toxicity": 1
      },
      "descTh": "กลั่นผลแก้วน้ำค้างแข็งและดอกเก๊กฮวยเหมันต์ด้วยน้ำค้างไผ่ม่วง ชำระล้างอารมณ์ขุ่นมัวและเปิดเนตรวิญญาณ"
    },
    {
      "id": "MW_REC_008",
      "nameTh": "ตำรับโอสถชาสายฟ้าเก้าแฉกปลุกปัญญา",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 22,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_012",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_007",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_150",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถชาสายฟ้าปลุกปัญญา",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "restoreQi": 32,
        "daoComprehensionBonus": 7,
        "cultivationProgress": 14,
        "toxicity": 2
      },
      "descTh": "กระตุ้นประสาทสัมผัสและทะเลสำนึกด้วยใบชาสายฟ้าและกาฝากเถาเงิน ช่วยให้ขบคิดคัมภีร์และเดินปราณได้รวดเร็วขึ้น"
    },
    {
      "id": "MW_REC_009",
      "nameTh": "ตำรับโอสถโสมคนคู่ประสานวิญญาณ",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 46,
      "durationDays": 28,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_015",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_014",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_170",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_120",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถโสมคนคู่ประสานวิญญาณ",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 52,
        "healInjury": 38,
        "restoreQi": 35,
        "foundationBonus": 8,
        "toxicity": 2
      },
      "descTh": "ใช้รากโสมคนคู่และหัวใจกวางน้ำค้างเจ็ดสีเคี่ยวในน้ำตาหินงอก ประสานบาดแผลภายในและฟื้นฟูรากฐานที่สั่นคลอน"
    },
    {
      "id": "MW_REC_010",
      "nameTh": "ตำรับโอสถดอกซากศพโลหิตอสูร",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 30,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_017",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_156",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_119",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถดอกซากศพโลหิตมาร",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 22,
        "restoreQi": 40,
        "healHealth": 30,
        "toxicity": 5
      },
      "descTh": "โอสถสายมารที่สกัดจากดอกซากศพแวมไพร์และเขี้ยวพิษงูทะเลปล่องไฟ เร่งตบะและปราณโลหิตอย่างรุนแรง"
    },
    {
      "id": "MW_REC_011",
      "nameTh": "ตำรับโอสถสาหร่ายมุกเพลิงผสานหยินหยาง",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 50,
      "durationDays": 30,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_018",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_022",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_031",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถมุกเพลิงผสานหยินหยาง",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 19,
        "toxicityRelief": 26,
        "clearPoison": 28,
        "foundationBonus": 9,
        "toxicity": 1
      },
      "descTh": "ใช้ถุงน้ำดีเพลิงพิษสลับขั้วเป็นตัวเร่งผสานสาหร่ายมุกเพลิงและเฟิร์นแก้วสะท้อนจันทร์ ชำระพิษโอสถและปรับสมดุลปราณ"
    },
    {
      "id": "MW_REC_012",
      "nameTh": "ตำรับโอสถบัวหิมะเพลิงสองขั้วหลอมแก่น",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 60,
      "durationDays": 36,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_024",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_025",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_164",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_007",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถบัวหิมะเพลิงสองขั้ว",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 25,
        "restoreQi": 48,
        "healHealth": 55,
        "foundationBonus": 12,
        "tribulationResist": 15,
        "toxicity": 3
      },
      "descTh": "ใช้หัวใจเพลิงสุริยันสองห้องซ้อนหลอมรวมบัวหิมะเพลิงและโสมดาราตก ยกระดับความหนาแน่นของแก่นปราณและกายเนื้อ"
    },
    {
      "id": "MW_REC_013",
      "nameTh": "ตำรับโอสถทับทิมโลหิตอสุราคลั่งศึก",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 34,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_027",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_159",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_177",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_016",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทับทิมโลหิตอสุรา",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 68,
        "healInjury": 45,
        "restoreQi": 45,
        "cultivationProgress": 20,
        "toxicity": 4
      },
      "descTh": "โอสถศึกชั้นสูงที่ฟื้นฟูบาดแผลฉกรรจ์และเติมเต็มปราณโลหิตในพริบตา เหมาะสำหรับผู้ฝึกวิถีกายาและวิถีมาร"
    },
    {
      "id": "MW_REC_014",
      "nameTh": "ตำรับโอสถหลินจือกระจกเงาแจ้งกระจ่างเซน",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 62,
      "durationDays": 36,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_032",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_029",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_017",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถหลินจือกระจกเงาเซน",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 38,
        "griefRelief": 35,
        "daoComprehensionBonus": 14,
        "cultivationProgress": 18,
        "toxicity": 1
      },
      "descTh": "ผสานเห็ดหลินจือกระจกเงากับผลึกน้ำตาความทรงจำพันปี ชำระล้างมารในใจและเปิดญาณหยั่งรู้มรรคาอย่างล้ำลึก"
    },
    {
      "id": "MW_REC_015",
      "nameTh": "ตำรับโอสถท้อเหมันต์บัวเพลิงกัลป์",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 70,
      "durationDays": 42,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_034",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_035",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_122",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_025",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถท้อเหมันต์บัวเพลิงกัลป์",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 32,
        "healHealth": 75,
        "restoreQi": 60,
        "lifespanBonus": 18,
        "tribulationResist": 22,
        "toxicity": 2
      },
      "descTh": "มหาโอสถระดับห้าที่หลอมรวมสุดยอดสมุนไพรน้ำแข็งและไฟด้วยขนนกหงอนเพลิงอมตะ ช่วยทะลวงคอขวดและต่ออายุขัย"
    },
    {
      "id": "MW_REC_016",
      "nameTh": "ตำรับโอสถยางต้นไม้โลกชุบชีพจร",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 72,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_040",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_036",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_187",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_033",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถยางต้นไม้โลกชุบชีพจร",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 95,
        "healInjury": 80,
        "toxicityRelief": 35,
        "foundationBonus": 18,
        "lifespanBonus": 20,
        "toxicity": 0
      },
      "descTh": "โอสถศักดิ์สิทธิ์ที่ใช้ยางต้นไม้โลกหยดทองและรากวิญญาณอสูรพฤกษา ซ่อมแซมเส้นชีพจรและรากฐานที่เสียหายได้อย่างสมบูรณ์"
    },
    {
      "id": "MW_REC_017",
      "nameTh": "ตำรับโอสถชาโพธิ์หยกสลายมารเก้าชั้น",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 40,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_038",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_037",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_135",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_021",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถชาโพธิ์หยกสลายมาร",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 55,
        "clearPoison": 45,
        "toxicityRelief": 40,
        "daoComprehensionBonus": 16,
        "tribulationResist": 25,
        "toxicity": 0
      },
      "descTh": "ใช้ใบชาต้นโพธิ์หยกและเสียงสะท้อนสวดมนต์โบราณ หลอมเป็นเม็ดยาที่ปัดเป่าจิตมารและคุ้มครองดวงจิตยามรับทัณฑ์สวรรค์"
    },
    {
      "id": "MW_REC_018",
      "nameTh": "ตำรับมหาโอสถมังกรสุญตาบัวตรัสรู้",
      "craftPath": "ALCHEMY",
      "tier": 6,
      "minMastery": 80,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_043",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_044",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_192",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_036",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "มหาโอสถมังกรสุญตาบัวตรัสรู้",
      "compatiblePath": "ANY",
      "isTranscendent": true,
      "effect": {
        "cultivationProgress": 42,
        "restoreQi": 85,
        "healHealth": 100,
        "heartDemonRelief": 50,
        "lifespanBonus": 35,
        "foundationBonus": 24,
        "toxicity": 1
      },
      "descTh": "มหาโอสถระดับเซียนที่ผสานผลมังกรสุญตา บัวแก้วตรัสรู้ และเลือดหยกทองคำไม่แข็งตัว ยกระดับตบะและอายุขัยอย่างก้าวกระโดด"
    },
    {
      "id": "MW_REC_019",
      "nameTh": "ตำรับมหาโอสถโสมบรรพกาลหลินจือหงส์",
      "craftPath": "ALCHEMY",
      "tier": 6,
      "minMastery": 82,
      "durationDays": 52,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_045",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_046",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_194",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_137",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "มหาโอสถโสมบรรพกาลหลินจือหงส์",
      "compatiblePath": "BODY",
      "isTranscendent": true,
      "effect": {
        "cultivationProgress": 45,
        "healHealth": 100,
        "healInjury": 90,
        "lifespanBonus": 45,
        "tribulationResist": 35,
        "toxicity": 1
      },
      "descTh": "สุดยอดโอสถหลอมกายาและต่ออายุขัยจากรากโสมบรรพกาล โลหิตเต่ามังกร และหยดน้ำค้างกาลเวลาหยุดนิ่ง"
    },
    {
      "id": "MW_REC_020",
      "nameTh": "ตำรับเทวโอสถต้นไม้โลกเปิดพิภพสุญตา",
      "craftPath": "ALCHEMY",
      "tier": 7,
      "minMastery": 90,
      "durationDays": 60,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_048",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_049",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_195",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_040",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "เทวโอสถต้นไม้โลกเปิดพิภพ",
      "compatiblePath": "ANY",
      "isTranscendent": true,
      "effect": {
        "cultivationProgress": 60,
        "restoreQi": 120,
        "healHealth": 100,
        "healInjury": 100,
        "heartDemonRelief": 80,
        "toxicityRelief": 80,
        "lifespanBonus": 60,
        "foundationBonus": 35,
        "daoComprehensionBonus": 25,
        "toxicity": 0
      },
      "descTh": "เทวโอสถระดับสูงสุดแห่งแดนหมื่นภพ หลอมรวมผลต้นไม้โลกปฐมกาลและดอกบัวสุญตาด้วยแก่นสุญตากลืนกินคาถา"
    },
    {
      "id": "MW_REC_021",
      "nameTh": "ตำรับตีดาบเหล็กสนิมเลือดเขี้ยวงู",
      "craftPath": "FORGING",
      "tier": 1,
      "minMastery": 22,
      "durationDays": 18,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_056",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_101",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_141",
          "count": 2
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ดาบเหล็กสนิมเลือดเขี้ยวงู",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.085,
        "defenseMult": 0.015,
        "minStageReq": 1
      },
      "descTh": "ดาบศึกชั้นต้นที่ตีจากก้อนแร่เหล็กสนิมเลือดและฝังเขี้ยวงูไม้หนามไว้ที่สันดาบ"
    },
    {
      "id": "MW_REC_022",
      "nameTh": "ตำรับสร้างเกราะสนับแขนปูศิลา",
      "craftPath": "FORGING",
      "tier": 1,
      "minMastery": 24,
      "durationDays": 18,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_058",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_142",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_145",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะสนับแขนปูศิลาลำธาร",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.015,
        "defenseMult": 0.09,
        "minStageReq": 1
      },
      "descTh": "เกราะเบาที่นำกระดองปูศิลาและแผ่นหินชนวนหยกเทามาบุด้วยหนังกบหมอกพิษ กันทั้งคมมีดและไอพิษชื้น"
    },
    {
      "id": "MW_REC_023",
      "nameTh": "ตำรับหลอมขลุ่ยศึกไผ่หยกดีบุกเงิน",
      "craftPath": "FORGING",
      "tier": 2,
      "minMastery": 34,
      "durationDays": 24,
      "inputs": [
        {
          "matId": "MW_MAT_EXO_102",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_059",
          "count": 2
        },
        {
          "matId": "MAT_MW_ORGAN_001",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ขลุ่ยศึกไผ่หยกสะท้อนปราณ",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.065,
        "defenseMult": 0.055,
        "studyBonus": 0.06,
        "minStageReq": 1
      },
      "descTh": "ขลุ่ยหยกหุ้มดีบุกเงินที่บรรจุต่อมกังวานคู่สะท้อนปราณไว้ภายใน ขยายคลื่นเสียงสะกดจิตและเสริมสมาธิยามอ่านคัมภีร์"
    },
    {
      "id": "MW_REC_024",
      "nameTh": "ตำรับตีทวนเหล็กพับทบครีบฉลามทราย",
      "craftPath": "FORGING",
      "tier": 2,
      "minMastery": 36,
      "durationDays": 24,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_063",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_101",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_149",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_148",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ทวนเหล็กพับทบครีบฉลามทราย",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.125,
        "defenseMult": 0.03,
        "minStageReq": 1
      },
      "descTh": "ทวนด้ามไม้แก่นเหล็กที่หัวทวนตีจากเหล็กกล้าพับทบและครีบฉลามทรายทอง พุ่งทะลวงเกราะเบาได้อย่างเฉียบขาด"
    },
    {
      "id": "MW_REC_025",
      "nameTh": "ตำรับทอเสื้อเกราะไหมแมงมุมปีกแมลงทับ",
      "craftPath": "FORGING",
      "tier": 2,
      "minMastery": 36,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "MW_MAT_EXO_108",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_147",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_151",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะอ่อนไหมเงินปีกแมลงทับ",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.03,
        "defenseMult": 0.12,
        "minStageReq": 1
      },
      "descTh": "เสื้อเกราะอ่อนถักจากรังไหมเงินแมงมุมหน้าคน ประดับด้วยปีกแมลงทับผลึกเขียวและขนเม่นเหล็กเพลิงที่หัวไหล่"
    },
    {
      "id": "MW_REC_026",
      "nameTh": "ตำรับหลอมกระบี่เงินน้ำค้างแข็งเขี้ยวกระจก",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 46,
      "durationDays": 30,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_064",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_089",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_003",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_023",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "กระบี่เงินน้ำค้างแข็งส่องจันทร์",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.165,
        "defenseMult": 0.05,
        "studyBonus": 0.04,
        "minStageReq": 2
      },
      "descTh": "กระบี่เซียนเหมันต์ที่หลอมจากแร่เงินน้ำค้างแข็งและกรงเล็บผลึกน้ำแข็งนิรันดร์ ฝังเยื่อตาจันทร์กระจกเงาที่โกร่งกระบี่"
    },
    {
      "id": "MW_REC_027",
      "nameTh": "ตำรับตีค้อนศึกแม่เหล็กเขาแพะสายฟ้า",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_065",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_167",
          "count": 2
        },
        {
          "matId": "MAT_MW_ORGAN_002",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ค้อนศึกแม่เหล็กอสนีคำราม",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.175,
        "defenseMult": 0.045,
        "minStageReq": 2
      },
      "descTh": "ค้อนศึกหนักที่ใช้หินแม่เหล็กอสนีสองขั้วและเขาแพะสายฟ้าภูผา เสริมด้วยปมไขกระดูกหลอมอัสนี ฟาดทีเดียวสะท้านทั้งขุนเขา"
    },
    {
      "id": "MW_REC_028",
      "nameTh": "ตำรับตัดเย็บผ้าคลุมกิ้งก่าพรางแสงเส้นเอ็นเงา",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 46,
      "durationDays": 30,
      "inputs": [
        {
          "matId": "MW_MAT_BP_161",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_104",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_011",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_014",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "ผ้าคลุมเร้นแสงพับมิติ",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.065,
        "defenseMult": 0.155,
        "minStageReq": 2
      },
      "descTh": "ผ้าคลุมนักฆ่าที่ตัดเย็บจากหนังกิ้งก่าคาเมเลี่ยนและปีกผลึกหักเหแสง เย็บด้วยเส้นเอ็นเงาไร้เสียง ช่วยเร้นกายและหลบหลีกคมอาวุธ"
    },
    {
      "id": "MW_REC_029",
      "nameTh": "ตำรับหลอมโล่กระดองผลึกสำริดโบราณ",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MW_MAT_BP_157",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_068",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_169",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_013",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "โล่ผลึกสำริดกระดูกอกลาวา",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.04,
        "defenseMult": 0.14,
        "escortSafetyBonus": 0.09,
        "minStageReq": 2
      },
      "descTh": "โล่หนักที่ผสานกระดองปูเสฉวนแบกผลึกกับสำริดโบราณและกระดูกอกหลอมรวมหินหนืด ป้องกันทั้งไฟและแรงกระแทก"
    },
    {
      "id": "MW_REC_030",
      "nameTh": "ตำรับตีดาบเหล็กหนามโลหิตเขี้ยวสุสาน",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 47,
      "durationDays": 30,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_066",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_166",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_124",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ดาบหนามโลหิตสุสานรบ",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.17,
        "defenseMult": 0.03,
        "minStageReq": 2
      },
      "descTh": "ดาบสังหารที่ตีจากแร่เหล็กหนามอสูรโลหิตและเถ้ากระดูกอสูรสงคราม คมดาบฉีกกระชากม่านปราณและดูดซับไอโลหิต"
    },
    {
      "id": "MW_REC_031",
      "nameTh": "ตำรับหลอมกระบี่บินทองคำขาวสายลม",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 60,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_071",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_158",
          "count": 2
        },
        {
          "matId": "MAT_MW_ORGAN_018",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_034",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "กระบี่บินทองคำขาวเคียววายุ",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.215,
        "defenseMult": 0.06,
        "minStageReq": 3
      },
      "descTh": "กระบี่บินน้ำหนักเบาแต่คมกริบที่หลอมจากทองคำขาวสายลมและเขี้ยวแก้วสั่นพ้องความถี่สูง มีถุงลมลอยฟ้าช่วยให้เหินสังหารได้ดั่งใจนึก"
    },
    {
      "id": "MW_REC_032",
      "nameTh": "ตำรับสร้างพัดพิษเจ็ดมายาเงินปรอท",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 36,
      "inputs": [
        {
          "matId": "MW_MAT_BP_173",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_073",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_162",
          "count": 2
        },
        {
          "matId": "MAT_MW_ORGAN_006",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "พัดเหล็กไหลเงินปรอทเจ็ดมายา",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.195,
        "defenseMult": 0.075,
        "studyBonus": 0.07,
        "minStageReq": 3
      },
      "descTh": "พัดยุทธภัณฑ์ที่ใช้กระดูกปีกค้างคาวและเงินปรอทเป็นโครง เรียงด้วยขนนกยูงพิษเจ็ดมายา สะบัดครั้งเดียวปล่อยทั้งคมลมและภาพลวงตา"
    },
    {
      "id": "MW_REC_033",
      "nameTh": "ตำรับตีเกราะหนักเหล็กก้นสมุทรเกล็ดมังกรดิน",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 62,
      "durationDays": 40,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_070",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_171",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_121",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_009",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะเหล็กสมุทรเกล็ดมังกรเพชร",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.06,
        "defenseMult": 0.215,
        "minStageReq": 3
      },
      "descTh": "ชุดเกราะหนักที่ตีจากเหล็กดำก้นสมุทรชุบด้วยน้ำหนักสมุทรลึก หุ้มด้วยเกล็ดมังกรดินเกราะเพชรและเกล็ดย้อนสลักอักขระธรรมชาติ"
    },
    {
      "id": "MW_REC_034",
      "nameTh": "ตำรับหลอมทวนสายฟ้าเหลวไม้สนอัสนี",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 62,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_072",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_105",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_175",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_004",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ทวนไม้สนอัสนีผลึกสายฟ้าเหลว",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.225,
        "defenseMult": 0.055,
        "escortSafetyBonus": 0.1,
        "minStageReq": 3
      },
      "descTh": "ทวนปราบมารที่ใช้ไม้สนสายฟ้าฟาดไม่ตายเป็นด้าม หัวทวนหลอมจากหน่อเขาบรรพกาลและผลึกสายฟ้าเหลว"
    },
    {
      "id": "MW_REC_035",
      "nameTh": "ตำรับสร้างมีดผ่าเส้นประสาทออบซิเดียนสุริยัน",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 56,
      "durationDays": 34,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_096",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_090",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_022",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ชุดมีดชำแหละออบซิเดียนสุริยัน",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.095,
        "defenseMult": 0.08,
        "craftBonusPath": "ALCHEMY",
        "craftBonusScore": 12,
        "dissectionBonus": 25,
        "minStageReq": 2
      },
      "descTh": "ชุดเครื่องมือชำแหละและศาสตราเสริมที่ทำจากหินออบซิเดียนเปลวสุริยันและด้ามหยกน้ำผึ้ง ช่วยเพิ่มโอกาสเก็บกู้อวัยวะพิเศษของอสูรอย่างสมบูรณ์"
    },
    {
      "id": "MW_REC_036",
      "nameTh": "ตำรับหลอมกระบี่สุริยันเหล็กไหลทองคำ",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 72,
      "durationDays": 46,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_075",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_184",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_136",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_030",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "กระบี่สุริยันผลาญสวรรค์",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.265,
        "defenseMult": 0.08,
        "minStageReq": 4
      },
      "descTh": "ศาสตราระดับห้าที่หลอมจากเหล็กไหลทองคำเพลิงสุริยันและกระดูกสันหลังข้อที่เก้าเชื่อมฟ้า ปลุกจิตด้วยเปลวไฟวิญญาณไม่รู้ดับ"
    },
    {
      "id": "MW_REC_037",
      "nameTh": "ตำรับหลอมค้อนอุกกาบาตม่วงดาราพินาศ",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 72,
      "durationDays": 46,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_077",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_093",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_186",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_032",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ค้อนอุกกาบาตดาราพินาศ",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.275,
        "defenseMult": 0.075,
        "minStageReq": 4
      },
      "descTh": "อาวุธหนักที่รวมแร่อุกกาบาตม่วง ทังสเตนภูผา และไข่มุกสมุทรดูดซับแรงดัน สร้างสนามแรงโน้มถ่วงบดขยี้ศัตรู"
    },
    {
      "id": "MW_REC_038",
      "nameTh": "ตำรับทออาภรณ์ไหมทองคำสวรรค์ขนหงส์เหมันต์",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 70,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MW_MAT_EXO_110",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_183",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_076",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_037",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "อาภรณ์ไหมทองสวรรค์หงส์เหมันต์",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.08,
        "defenseMult": 0.25,
        "studyBonus": 0.08,
        "minStageReq": 4
      },
      "descTh": "อาภรณ์ระดับนภาที่ทอจากไหมทองคำสวรรค์และขนปีกหงส์เหมันต์ ฝังแผ่นเกราะอกสะท้อนกระบี่จิต ป้องกันทั้งศาสตราและวิชาจิต"
    },
    {
      "id": "MW_REC_039",
      "nameTh": "ตำรับหลอมกริชเงินสุญตาพยัคฆ์มาร",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 70,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_079",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_185",
          "count": 2
        },
        {
          "matId": "MAT_MW_ORGAN_027",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_029",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "กริชคู่เงินสุญตาตัดเงา",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.27,
        "defenseMult": 0.06,
        "minStageReq": 4
      },
      "descTh": "กริชลอบสังหารจากแร่เงินสุญตาไร้เงาและกรงเล็บพยัคฆ์มาร มีหนวดรับมิติว่างเปล่าช่วยให้แทงทะลุม่านปราณป้องกัน"
    },
    {
      "id": "MW_REC_040",
      "nameTh": "ตำรับสร้างคันฉ่องเนตรจิ้งจอกสวรรค์หยกห้าสี",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 72,
      "durationDays": 46,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_078",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_188",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_189",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_019",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "คันฉ่องหยกห้าสีเนตรสวรรค์",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.14,
        "defenseMult": 0.165,
        "studyBonus": 0.12,
        "escortSafetyBonus": 0.14,
        "minStageReq": 4
      },
      "descTh": "สมบัติวิเศษที่ผสานหยกจักรพรรดิห้าสี เนตรวิญญาณจิ้งจอกสวรรค์ และเปลือกกระดองจารึกดาวเหนือ ส่องทะลุภาพลวงตาและสะท้อนเคราะห์ร้าย"
    },
    {
      "id": "MW_REC_041",
      "nameTh": "ตำรับหลอมทวนทองคำเทวะเขากิเลนดารา",
      "craftPath": "FORGING",
      "tier": 6,
      "minMastery": 82,
      "durationDays": 52,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_080",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_193",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_107",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_039",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ทวนเทวะอสนีเขากิเลนดารา",
      "compatiblePath": "GOD",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.32,
        "defenseMult": 0.11,
        "escortSafetyBonus": 0.18,
        "minStageReq": 5
      },
      "descTh": "ศาสตราเทวะระดับหกที่ใช้กิ่งต้นไม้โลกค้ำดาราเป็นด้าม หัวทวนหลอมจากทองคำเทวะอสนีและเขากิเลนดาราจักร ฝังดวงตาที่สามส่องชีพจรฟ้าดิน"
    },
    {
      "id": "MW_REC_042",
      "nameTh": "ตำรับตีเกราะเซียนเกล็ดมังกรอัสนีเพชรทมิฬ",
      "craftPath": "FORGING",
      "tier": 6,
      "minMastery": 82,
      "durationDays": 52,
      "inputs": [
        {
          "matId": "MW_MAT_BP_191",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_100",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_081",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_116",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะเซียนมังกรอัสนีเพชรทมิฬ",
      "compatiblePath": "ANY",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.1,
        "defenseMult": 0.3,
        "minStageReq": 5
      },
      "descTh": "เกราะระดับเซียนที่ผสานเกล็ดย้อนมังกรอัสนีสวรรค์เข้ากับผลึกเพชรทมิฬแก่นพิภพและผลึกหัวใจดาราจักรนิรันดร์"
    },
    {
      "id": "MW_REC_043",
      "nameTh": "ตำรับหลอมเทวศาสตราเหล็กบรรพกาลหยกสุญตา",
      "craftPath": "FORGING",
      "tier": 7,
      "minMastery": 90,
      "durationDays": 60,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_082",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_083",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_195",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_040",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "กระบี่บรรพกาลตัดหมื่นภพ",
      "compatiblePath": "ANY",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.38,
        "defenseMult": 0.15,
        "studyBonus": 0.15,
        "minStageReq": 6
      },
      "descTh": "สุดยอดเทวศาสตราแห่งแดนหมื่นภพ ตีจากแร่เหล็กบรรพกาลหลอมโลกและหยกสุญตาไร้ลักษณ์ ตัดขาดได้แม้กระทั่งกฎเกณฑ์มิติ"
    },
    {
      "id": "MW_REC_044",
      "nameTh": "ตำรับสร้างพู่กันขนกระรอกเมฆาหมึกสนดำ",
      "craftPath": "TALISMAN",
      "tier": 1,
      "minMastery": 22,
      "durationDays": 16,
      "inputs": [
        {
          "matId": "MW_MAT_BP_143",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_126",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_102",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "พู่กันขนเมฆาไผ่หยก",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.03,
        "defenseMult": 0.05,
        "studyBonus": 0.05,
        "craftBonusPath": "TALISMAN",
        "craftBonusScore": 6,
        "minStageReq": 1
      },
      "descTh": "พู่กันเขียนยันต์สำหรับผู้เริ่มต้น ทำจากขนหางกระรอกบินเมฆาและด้ามไม้ไผ่หยก ช่วยให้ลากเส้นปราณได้มั่นคง"
    },
    {
      "id": "MW_REC_045",
      "nameTh": "ตำรับจารึกยันต์ระเบิดเพลิงกำมะถัน",
      "craftPath": "TALISMAN",
      "tier": 2,
      "minMastery": 34,
      "durationDays": 20,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_086",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_087",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_111",
          "count": 1
        },
        {
          "matId": "NW_MAT_191",
          "count": 2
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ชุดยันต์อัคคีกำมะถันสะท้อนแสง",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.08,
        "defenseMult": 0.04,
        "minStageReq": 1
      },
      "descTh": "แผ่นยันต์เพลิงที่ใช้แร่กำมะถันและไมกาเกล็ดเงิน ผนึกด้วยขี้ผึ้งอสูรหยก ใช้ขว้างจู่โจมและขับไล่ฝูงแมลงพิษ"
    },
    {
      "id": "MW_REC_046",
      "nameTh": "ตำรับสร้างหน้ากากใยเห็ดกรองหมอกพิษ",
      "craftPath": "TALISMAN",
      "tier": 2,
      "minMastery": 35,
      "durationDays": 22,
      "inputs": [
        {
          "matId": "MW_MAT_BP_154",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_062",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_103",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "หน้ากากไม้จันทน์กรองพิษหมอก",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.02,
        "defenseMult": 0.09,
        "escortSafetyBonus": 0.08,
        "minStageReq": 1
      },
      "descTh": "เครื่องรางสวมหน้าที่กรองละอองสปอร์และหมอกพิษในบึงโกงกางด้วยตาข่ายใยแมงมุมเห็ดเรืองแสงและเกลือศิลา"
    },
    {
      "id": "MW_REC_047",
      "nameTh": "ตำรับหลอมโคมแสงชีวภาพส่องสมุทร",
      "craftPath": "ARRAY",
      "tier": 3,
      "minMastery": 44,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "MAT_MW_ORGAN_012",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_127",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_057",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_091",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "โคมแก้วชีวภาพส่องเหวลึก",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.05,
        "defenseMult": 0.1,
        "studyBonus": 0.06,
        "escortSafetyBonus": 0.1,
        "minStageReq": 2
      },
      "descTh": "โคมแก้วควอตซ์ที่บรรจุต่อมแสงชีวภาพและผงมุกสมุทร ช่วยเพิ่มทัศนวิสัยในการสำรวจถ้ำมืดและร่องสมุทรลึก"
    },
    {
      "id": "MW_REC_048",
      "nameTh": "ตำรับสร้างจานค่ายกลแปดทิศเกลือสายฟ้า",
      "craftPath": "ARRAY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 30,
      "inputs": [
        {
          "matId": "MW_MAT_EXO_131",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_125",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_130",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_067",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "จานค่ายกลแปดทิศอสนีพิทักษ์",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.08,
        "defenseMult": 0.12,
        "craftBonusPath": "ARRAY",
        "craftBonusScore": 10,
        "minStageReq": 2
      },
      "descTh": "ชุดจานศิลาและธงอาคมที่ใช้เกลือสายฟ้าสีครามเดินเส้นปราณ ช่วยกางม่านป้องกันย่อยรอบตัวผู้ถือ"
    },
    {
      "id": "MW_REC_049",
      "nameTh": "ตำรับสร้างเขาวงกตบิสมัทสะกดรอย",
      "craftPath": "ARRAY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 36,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_097",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_115",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_132",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_094",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราเขาวงกตเจ็ดสีสะกดมิติ",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.11,
        "defenseMult": 0.14,
        "escortSafetyBonus": 0.12,
        "minStageReq": 3
      },
      "descTh": "เครื่องรางค่ายกลที่สร้างจากแร่บิสมัทเขาวงกตและทรายดาราแม่เหล็กไหล บิดเบือนทิศทางของศัตรูที่ไล่ล่า"
    },
    {
      "id": "MW_REC_050",
      "nameTh": "ตำรับหลอมแกนค่ายกลสุญตาไม้โพธิ์แก้ว",
      "craftPath": "ARRAY",
      "tier": 5,
      "minMastery": 70,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MW_MAT_EXO_133",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_106",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_129",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_098",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "แกนมหาค่ายกลสุญตาโพธิ์แก้ว",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.15,
        "defenseMult": 0.18,
        "studyBonus": 0.12,
        "minStageReq": 4
      },
      "descTh": "แกนค่ายกลระดับสูงที่ผสานแกนผลึกสุญตาตรึงมิติเข้ากับไม้โพธิ์แก้วและหมึกดาราจักรเจ็ดแสง"
    },
    {
      "id": "MW_REC_051",
      "nameTh": "ตำรับปรุงยาพอกเมือกทองคำสมานอสูร",
      "craftPath": "BEAST_TAMING",
      "tier": 2,
      "minMastery": 30,
      "durationDays": 18,
      "inputs": [
        {
          "matId": "MAT_MW_ORGAN_026",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_053",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_114",
          "count": 1
        }
      ],
      "outputType": "BEAST_ITEM",
      "outputSubSlot": null,
      "outputNameTh": "ยาพอกเมือกทองคำสมานแผลอสูร",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "healCompanion": 55,
        "trustGain": 20,
        "lureRareBeast": false
      },
      "descTh": "ยาพอกชั้นเลิศจากเมือกทองคำประสานแผลฉับพลันและใบหม่อนหยก ช่วยฟื้นฟูบาดแผลให้อสูรคู่หูอย่างรวดเร็ว"
    },
    {
      "id": "MW_REC_052",
      "nameTh": "ตำรับปรุงเครื่องหอมชะมดสยบอสูรป่า",
      "craftPath": "BEAST_TAMING",
      "tier": 3,
      "minMastery": 42,
      "durationDays": 24,
      "inputs": [
        {
          "matId": "MAT_MW_ORGAN_020",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_014",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_019",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_111",
          "count": 1
        }
      ],
      "outputType": "BEAST_ITEM",
      "outputSubSlot": null,
      "outputNameTh": "กำยานชะมดเจ็ดมายาล่ออสูร",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "trustGain": 32,
        "lureRareBeast": true,
        "spawnAlphaChance": 0.72,
        "healCompanion": 35
      },
      "descTh": "กำยานที่ใช้ต่อมชะมดกลิ่นหอมสยบอสูรและเกสรดอกไม้กินแมลง ดึงดูดสัตว์อสูรหายากและช่วยให้ผูกพันธสัญญาได้ง่ายขึ้น"
    },
    {
      "id": "MW_REC_053",
      "nameTh": "ตำรับปรุงลูกกลอนแก่นปรสิตเสริมสายเลือดอสูร",
      "craftPath": "BEAST_TAMING",
      "tier": 4,
      "minMastery": 55,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MAT_MW_ORGAN_015",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_163",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_028",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_113",
          "count": 1
        }
      ],
      "outputType": "BEAST_ITEM",
      "outputSubSlot": null,
      "outputNameTh": "โอสถแก่นปรสิตปลุกสายเลือดคู่หู",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "trustGain": 40,
        "healCompanion": 75,
        "lureRareBeast": true,
        "spawnAlphaChance": 0.8
      },
      "descTh": "ลูกกลอนวิญญาณสำหรับอสูรคู่หูและใช้ล่ออสูรระดับจ่าฝูงในถิ่นอาศัย"
    },
    {
      "id": "MW_REC_054",
      "nameTh": "ตำรับหลอมโอสถทิพย์มอสเรืองแสงถ้ำเซีย",
      "craftPath": "ALCHEMY",
      "tier": 1,
      "minMastery": 28,
      "durationDays": 20,
      "inputs": [
        {
          "matId": "NW_MAT_040",
          "count": 2
        },
        {
          "matId": "NW_MAT_051",
          "count": 1
        },
        {
          "matId": "NW_MAT_206",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์มอสเรืองแสงถ้ำเซีย",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 19,
        "griefRelief": 15,
        "daoComprehensionBonus": 5,
        "toxicityRelief": 13,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 1 ที่สกัดฤทธิ์ยาจาก มอสเรืองแสงถ้ำเซียน และ ว่านหางจระเข้หยกเย็น เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_055",
      "nameTh": "ตำรับจารึกเครื่องรางแร่ดีบุกปราณวายุ",
      "craftPath": "ARRAY",
      "tier": 1,
      "minMastery": 28,
      "durationDays": 20,
      "inputs": [
        {
          "matId": "NW_MAT_068",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_085",
          "count": 1
        },
        {
          "matId": "NW_MAT_131",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางแร่ดีบุกปราณวายุ",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.052,
        "defenseMult": 0.065,
        "studyBonus": 0.035,
        "escortSafetyBonus": 0.048,
        "minStageReq": 1
      },
      "descTh": "จารึกอักขระเต๋าลงบน แร่ดีบุกปราณวายุ และ แร่ยิปซัมหยกขาวซับชื้น สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 1"
    },
    {
      "id": "MW_REC_056",
      "nameTh": "ตำรับตีตราพิทักษ์ถุงกรดมดเกราะทองแด",
      "craftPath": "FORGING",
      "tier": 1,
      "minMastery": 28,
      "durationDays": 20,
      "inputs": [
        {
          "matId": "MW_MAT_BP_144",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_146",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์ถุงกรดมดเกราะทองแด",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.059,
        "defenseMult": 0.064,
        "studyBonus": 0.015,
        "minStageReq": 1
      },
      "descTh": "หลอมรวม ถุงกรดมดเกราะทองแดง เข้ากับ เขากวางผาหินปูน ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 1"
    },
    {
      "id": "MW_REC_057",
      "nameTh": "ตำรับหลอมโอสถทิพย์โสมโลหิตมังกรร้อยป",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_001",
          "count": 2
        },
        {
          "matId": "NW_MAT_011",
          "count": 1
        },
        {
          "matId": "NW_MAT_016",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์โสมโลหิตมังกรร้อยป",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "healHealth": 42,
        "healInjury": 32,
        "clearPoison": 22,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 2 ที่สกัดฤทธิ์ยาจาก โสมโลหิตมังกรร้อยปี และ หญ้าดาราพราวแสง เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_058",
      "nameTh": "ตำรับหลอมโอสถทิพย์ดอกทานตะวันสุริยัน",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_020",
          "count": 2
        },
        {
          "matId": "NW_MAT_031",
          "count": 1
        },
        {
          "matId": "NW_MAT_033",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ดอกทานตะวันสุริยัน",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 26,
        "griefRelief": 20,
        "daoComprehensionBonus": 7,
        "toxicityRelief": 18,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 2 ที่สกัดฤทธิ์ยาจาก ดอกทานตะวันสุริยันทอง และ หน่อไผ่หยกมรกต เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_059",
      "nameTh": "ตำรับหลอมโอสถทิพย์ใบชาเมฆาหมอกเก้ายอ",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_036",
          "count": 2
        },
        {
          "matId": "NW_MAT_041",
          "count": 1
        },
        {
          "matId": "NW_MAT_042",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ใบชาเมฆาหมอกเก้ายอ",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 10,
        "cultivationProgress": 14,
        "tribulationResist": 8,
        "lifespanBonus": 0,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 2 ที่สกัดฤทธิ์ยาจาก ใบชาเมฆาหมอกเก้ายอด และ เฟิร์นเงินจันทราเร้นลับ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_060",
      "nameTh": "ตำรับหลอมโอสถทิพย์หัวบุกศิลาปฐพี",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_045",
          "count": 2
        },
        {
          "matId": "NW_MAT_052",
          "count": 1
        },
        {
          "matId": "NW_MAT_210",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หัวบุกศิลาปฐพี",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 18,
        "restoreQi": 24,
        "healHealth": 20,
        "toxicity": 3
      },
      "descTh": "ตำรับโอสถระดับ 2 ที่สกัดฤทธิ์ยาจาก หัวบุกศิลาปฐพี และ หญ้าเข็มเงินทะลวงพิษ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_061",
      "nameTh": "ตำรับหลอมโอสถทิพย์สุราปราณร้อยบุปผา",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_215",
          "count": 2
        },
        {
          "matId": "NW_MAT_222",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_009",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์สุราปราณร้อยบุปผา",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 42,
        "healInjury": 32,
        "clearPoison": 22,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 2 ที่สกัดฤทธิ์ยาจาก สุราปราณร้อยบุปผา และ น้ำพิษบึงหมอกทมิฬ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_062",
      "nameTh": "ตำรับหลอมโอสถทิพย์มอสทองแดงกินแร่",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_013",
          "count": 2
        },
        {
          "matId": "MAT_FORM_BLANK_ARRAY_FLAG_2",
          "count": 1
        },
        {
          "matId": "MAT_FORM_SPIRIT_INK_SAND_2",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์มอสทองแดงกินแร่",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 26,
        "griefRelief": 20,
        "daoComprehensionBonus": 7,
        "toxicityRelief": 18,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 2 ที่สกัดฤทธิ์ยาจาก มอสทองแดงกินแร่ และ ชุดธงอาคมแปดทิศสื่อปราณ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_063",
      "nameTh": "ตำรับตีศาสตราแร่เหล็กทมิฬก้นสมุ",
      "craftPath": "FORGING",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_056",
          "count": 2
        },
        {
          "matId": "NW_MAT_066",
          "count": 1
        },
        {
          "matId": "NW_MAT_086",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตราแร่เหล็กทมิฬก้นสมุ",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.144,
        "defenseMult": 0.035,
        "minStageReq": 1
      },
      "descTh": "หลอมรวม แร่เหล็กทมิฬก้นสมุทร เข้ากับ แร่ทรายเงินดาราพราว ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 2"
    },
    {
      "id": "MW_REC_064",
      "nameTh": "ตำรับตีเกราะศึกแร่ศิลาเหล็กหลอมกา",
      "craftPath": "FORGING",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_088",
          "count": 2
        },
        {
          "matId": "NW_MAT_090",
          "count": 1
        },
        {
          "matId": "NW_MAT_096",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกแร่ศิลาเหล็กหลอมกา",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.039,
        "defenseMult": 0.141,
        "minStageReq": 1
      },
      "descTh": "หลอมรวม แร่ศิลาเหล็กหลอมกายา เข้ากับ แร่เงินเกล็ดน้ำค้างแข็ง ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 2"
    },
    {
      "id": "MW_REC_065",
      "nameTh": "ตำรับจารึกเครื่องรางศิลาหยกน้ำค้างแข็ง",
      "craftPath": "ARRAY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_123",
          "count": 2
        },
        {
          "matId": "NW_MAT_195",
          "count": 1
        },
        {
          "matId": "NW_MAT_198",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางศิลาหยกน้ำค้างแข็ง",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.074,
        "defenseMult": 0.09,
        "studyBonus": 0.05,
        "escortSafetyBonus": 0.066,
        "minStageReq": 1
      },
      "descTh": "จารึกอักขระเต๋าลงบน ศิลาหยกน้ำค้างแข็ง และ หมึกชาดโลหิตอสูรร้อยปี สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 2"
    },
    {
      "id": "MW_REC_066",
      "nameTh": "ตำรับตีศาสตราแร่ทองแดงเพลิงภูเข",
      "craftPath": "FORGING",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_060",
          "count": 2
        },
        {
          "matId": "MW_MAT_ORE_061",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_088",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตราแร่ทองแดงเพลิงภูเข",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.144,
        "defenseMult": 0.035,
        "minStageReq": 1
      },
      "descTh": "หลอมรวม แร่ทองแดงเพลิงภูเขาไฟ เข้ากับ แร่ตะกั่วน้ำลึกถ่วงสมุทร ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 2"
    },
    {
      "id": "MW_REC_067",
      "nameTh": "ตำรับตีเกราะศึกเถ้าภูเขาไฟอัดปราณ",
      "craftPath": "FORGING",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "MW_MAT_EXO_123",
          "count": 2
        },
        {
          "matId": "NW_MAT_132",
          "count": 1
        },
        {
          "matId": "NW_MAT_150",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกเถ้าภูเขาไฟอัดปราณ",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.039,
        "defenseMult": 0.141,
        "minStageReq": 1
      },
      "descTh": "หลอมรวม เถ้าภูเขาไฟอัดปราณเพลิง เข้ากับ แก่นอสูรระดับ 2 (ปราณควบแน่น) ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 2"
    },
    {
      "id": "MW_REC_068",
      "nameTh": "ตำรับตีตราพิทักษ์ขนหมีน้ำแข็งเหมันต",
      "craftPath": "FORGING",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "NW_MAT_155",
          "count": 2
        },
        {
          "matId": "NW_MAT_186",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_010",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์ขนหมีน้ำแข็งเหมันต",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.083,
        "defenseMult": 0.088,
        "studyBonus": 0.03,
        "minStageReq": 1
      },
      "descTh": "หลอมรวม ขนหมีน้ำแข็งเหมันต์ เข้ากับ เมือกหอยทากศิลาโบราณ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 2"
    },
    {
      "id": "MW_REC_069",
      "nameTh": "ตำรับหลอมโอสถทิพย์เกล็ดปลาคาร์ปกระจก",
      "craftPath": "ALCHEMY",
      "tier": 2,
      "minMastery": 38,
      "durationDays": 26,
      "inputs": [
        {
          "matId": "MW_MAT_BP_152",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_155",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์เกล็ดปลาคาร์ปกระจก",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "healHealth": 42,
        "healInjury": 32,
        "clearPoison": 22,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 2 ที่สกัดฤทธิ์ยาจาก เกล็ดปลาคาร์ปกระจกเจ็ดสี และ กรงเล็บตัวตุ่นขุดแร่ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_070",
      "nameTh": "ตำรับหลอมโอสถทิพย์เถาวัลย์มรกตเจ็ดพิ",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MAT_HERB_VENOM_VINE_3",
          "count": 2
        },
        {
          "matId": "MAT_HERB_ANCIENT_MIST_FERN_3",
          "count": 1
        },
        {
          "matId": "NW_MAT_004",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์เถาวัลย์มรกตเจ็ดพิ",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 33,
        "griefRelief": 25,
        "daoComprehensionBonus": 9,
        "toxicityRelief": 23,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก เถาวัลย์มรกตเจ็ดพิษ และ เฟิร์นหมอกวิญญาณพันปี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_071",
      "nameTh": "ตำรับหลอมโอสถทิพย์หญ้ากระบี่เจ็ดคม",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_012",
          "count": 2
        },
        {
          "matId": "NW_MAT_013",
          "count": 1
        },
        {
          "matId": "NW_MAT_015",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หญ้ากระบี่เจ็ดคม",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 13,
        "cultivationProgress": 18,
        "tribulationResist": 12,
        "lifespanBonus": 0,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก หญ้ากระบี่เจ็ดคม และ หญ้าสายฟ้าคำราม เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_072",
      "nameTh": "ตำรับหลอมโอสถทิพย์ดอกกล้วยไม้เงาจันท",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_017",
          "count": 2
        },
        {
          "matId": "NW_MAT_019",
          "count": 1
        },
        {
          "matId": "NW_MAT_025",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ดอกกล้วยไม้เงาจันท",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 23,
        "restoreQi": 30,
        "healHealth": 25,
        "toxicity": 3
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก ดอกกล้วยไม้เงาจันทรา และ ดอกเหมยน้ำค้างแข็งเก้ากลีบ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_073",
      "nameTh": "ตำรับหลอมโอสถทิพย์ผลหยกเหมันต์วิญญาณ",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_026",
          "count": 2
        },
        {
          "matId": "NW_MAT_034",
          "count": 1
        },
        {
          "matId": "NW_MAT_038",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ผลหยกเหมันต์วิญญาณ",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 52,
        "healInjury": 40,
        "clearPoison": 28,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก ผลหยกเหมันต์วิญญาณ และ แก่นไม้จันทน์หอมร้อยปี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_074",
      "nameTh": "ตำรับหลอมโอสถทิพย์รากบัวเจ็ดรูทะลวงป",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_044",
          "count": 2
        },
        {
          "matId": "NW_MAT_047",
          "count": 1
        },
        {
          "matId": "NW_MAT_050",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์รากบัวเจ็ดรูทะลวงป",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 33,
        "griefRelief": 25,
        "daoComprehensionBonus": 9,
        "toxicityRelief": 23,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก รากบัวเจ็ดรูทะลวงปราณ และ เมล็ดสนดาราพันปี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_075",
      "nameTh": "ตำรับหลอมโอสถทิพย์ดอกลำโพงมารหลับใหล",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_053",
          "count": 2
        },
        {
          "matId": "NW_MAT_207",
          "count": 1
        },
        {
          "matId": "NW_MAT_208",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ดอกลำโพงมารหลับใหล",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 13,
        "cultivationProgress": 18,
        "tribulationResist": 12,
        "lifespanBonus": 0,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก ดอกลำโพงมารหลับใหล และ น้ำค้างดาราเจ็ดราตรี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_076",
      "nameTh": "ตำรับหลอมโอสถทิพย์สุราโลหิตพยัคฆ์คำร",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_216",
          "count": 2
        },
        {
          "matId": "NW_MAT_218",
          "count": 1
        },
        {
          "matId": "NW_MAT_221",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์สุราโลหิตพยัคฆ์คำร",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 23,
        "restoreQi": 30,
        "healHealth": 25,
        "toxicity": 3
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก สุราโลหิตพยัคฆ์คำราม และ น้ำผึ้งหลวงผึ้งหยกพิษ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_077",
      "nameTh": "ตำรับปรุงเครื่องหอมปราณตัวอ่อนแมงป่องหย",
      "craftPath": "BEAST_TAMING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_227",
          "count": 2
        },
        {
          "matId": "NW_MAT_229",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_016",
          "count": 1
        }
      ],
      "outputType": "BEAST_ITEM",
      "outputSubSlot": null,
      "outputNameTh": "เครื่องหอมปราณตัวอ่อนแมงป่องหย",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "healCompanion": 55,
        "trustGain": 27,
        "lureRareBeast": true,
        "spawnAlphaChance": 0.59
      },
      "descTh": "หลอมสกัด ตัวอ่อนแมงป่องหยกโลหิต ร่วมกับ เกล็ดผีเสื้อราตรีมรณะ เป็นเครื่องหอมและโอสถบำรุงอสูรระดับ 3"
    },
    {
      "id": "MW_REC_078",
      "nameTh": "ตำรับหลอมโอสถทิพย์หญ้าเข็มสายฟ้าเงิน",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_020",
          "count": 2
        },
        {
          "matId": "MW_MAT_HERB_021",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_055",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หญ้าเข็มสายฟ้าเงิน",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 33,
        "griefRelief": 25,
        "daoComprehensionBonus": 9,
        "toxicityRelief": 23,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก หญ้าเข็มสายฟ้าเงิน และ ผลน้ำเต้าหยกเก็บลม เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_079",
      "nameTh": "ตำรับตีเกราะศึกแร่ทองแดงอัสนีเผาผ",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MAT_ORE_THUNDER_SCORCH_COPPER_3",
          "count": 2
        },
        {
          "matId": "MAT_FORM_SWORD_TALISMAN_3",
          "count": 1
        },
        {
          "matId": "MAT_FORM_ARRAY_CORE_basic_3",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกแร่ทองแดงอัสนีเผาผ",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.051,
        "defenseMult": 0.179,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม แร่ทองแดงอัสนีเผาผลาญ เข้ากับ ยันต์กระบี่สังหารปราณคม ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_080",
      "nameTh": "ตำรับจารึกเครื่องรางผลึกหยินเยือกวิญญา",
      "craftPath": "TALISMAN",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MAT_FORM_YIN_CRYSTAL_3",
          "count": 2
        },
        {
          "matId": "NW_MAT_057",
          "count": 1
        },
        {
          "matId": "NW_MAT_060",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางผลึกหยินเยือกวิญญา",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.096,
        "defenseMult": 0.115,
        "studyBonus": 0.065,
        "escortSafetyBonus": 0.084,
        "minStageReq": 2
      },
      "descTh": "จารึกอักขระเต๋าลงบน ผลึกหยินเยือกวิญญาณ และ แร่เงินจันทราบริสุทธิ์ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 3"
    },
    {
      "id": "MW_REC_081",
      "nameTh": "ตำรับตีศาสตราแร่ตะกั่วทมิฬผนึกป",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_065",
          "count": 2
        },
        {
          "matId": "NW_MAT_069",
          "count": 1
        },
        {
          "matId": "NW_MAT_076",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตราแร่ตะกั่วทมิฬผนึกป",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.186,
        "defenseMult": 0.045,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม แร่ตะกั่วทมิฬผนึกปราณ เข้ากับ แร่สำริดโบราณสนิมเขียว ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_082",
      "nameTh": "ตำรับตีเกราะศึกหยกมรกตพฤกษาพันปี",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_077",
          "count": 2
        },
        {
          "matId": "NW_MAT_089",
          "count": 1
        },
        {
          "matId": "NW_MAT_091",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกหยกมรกตพฤกษาพันปี",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.051,
        "defenseMult": 0.179,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม หยกมรกตพฤกษาพันปี เข้ากับ แร่ทองแดงเสียงกังวาน ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_083",
      "nameTh": "ตำรับตีตราพิทักษ์แร่ศิลาเพลิงเมฆา",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_092",
          "count": 2
        },
        {
          "matId": "NW_MAT_103",
          "count": 1
        },
        {
          "matId": "NW_MAT_109",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์แร่ศิลาเพลิงเมฆา",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.107,
        "defenseMult": 0.112,
        "studyBonus": 0.045,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม แร่ศิลาเพลิงเมฆา เข้ากับ ผลึกวารีสมุทรคราม ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_084",
      "nameTh": "ตำรับตีศาสตรามุกสมุทรส่องราตรี",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_112",
          "count": 2
        },
        {
          "matId": "NW_MAT_116",
          "count": 1
        },
        {
          "matId": "NW_MAT_119",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตรามุกสมุทรส่องราตรี",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.186,
        "defenseMult": 0.045,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม มุกสมุทรส่องราตรี เข้ากับ ศิลาปราณบริสุทธิ์เกรดสูง ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_085",
      "nameTh": "ตำรับจารึกเครื่องรางศิลาโลหิตสมรภูมิ",
      "craftPath": "ARRAY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_124",
          "count": 2
        },
        {
          "matId": "NW_MAT_125",
          "count": 1
        },
        {
          "matId": "NW_MAT_192",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางศิลาโลหิตสมรภูมิ",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.096,
        "defenseMult": 0.115,
        "studyBonus": 0.065,
        "escortSafetyBonus": 0.084,
        "minStageReq": 2
      },
      "descTh": "จารึกอักขระเต๋าลงบน ศิลาโลหิตสมรภูมิ และ ศิลาดาวเหนือชี้ทิศ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 3"
    },
    {
      "id": "MW_REC_086",
      "nameTh": "ตำรับจารึกเครื่องรางเสาธงค่ายกลไม้สายฟ",
      "craftPath": "TALISMAN",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_200",
          "count": 2
        },
        {
          "matId": "NW_MAT_201",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_069",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางเสาธงค่ายกลไม้สายฟ",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.096,
        "defenseMult": 0.115,
        "studyBonus": 0.065,
        "escortSafetyBonus": 0.084,
        "minStageReq": 2
      },
      "descTh": "จารึกอักขระเต๋าลงบน เสาธงค่ายกลไม้สายฟ้า และ ผงแป้งศิลาดาราบด สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 3"
    },
    {
      "id": "MW_REC_087",
      "nameTh": "ตำรับตีศาสตราศิลาปะการังฟอสซิลพ",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_092",
          "count": 2
        },
        {
          "matId": "MW_MAT_EXO_109",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_139",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตราศิลาปะการังฟอสซิลพ",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.186,
        "defenseMult": 0.045,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ศิลาปะการังฟอสซิลพันปี เข้ากับ ไหมน้ำแข็งหนอนจันทรา ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_088",
      "nameTh": "ตำรับตีเกราะศึกเขากวางหยกหมอกพันป",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MAT_BP_MIST_STAG_ANTLER_3",
          "count": 2
        },
        {
          "matId": "NW_MAT_133",
          "count": 1
        },
        {
          "matId": "NW_MAT_140",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกเขากวางหยกหมอกพันป",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.051,
        "defenseMult": 0.179,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม เขากวางหยกหมอกพันปี เข้ากับ แก่นอสูรระดับ 3 (ปราณธาตุบริสุทธิ์) ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_089",
      "nameTh": "ตำรับตีตราพิทักษ์กระดองปูยักษ์หยกสม",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_143",
          "count": 2
        },
        {
          "matId": "NW_MAT_146",
          "count": 1
        },
        {
          "matId": "NW_MAT_149",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์กระดองปูยักษ์หยกสม",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.107,
        "defenseMult": 0.112,
        "studyBonus": 0.045,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม กระดองปูยักษ์หยกสมุทร เข้ากับ กรงเล็บอินทรีเหล็กเวหา ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_090",
      "nameTh": "ตำรับหลอมโอสถทิพย์ขนกระเรียนหยกเมฆา",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_154",
          "count": 2
        },
        {
          "matId": "NW_MAT_158",
          "count": 1
        },
        {
          "matId": "NW_MAT_165",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ขนกระเรียนหยกเมฆา",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 33,
        "griefRelief": 25,
        "daoComprehensionBonus": 9,
        "toxicityRelief": 23,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก ขนกระเรียนหยกเมฆา และ เขากระทิงคลั่งอัสนี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_091",
      "nameTh": "ตำรับตีเกราะศึกดีหมีศิลาเกราะเพชร",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_178",
          "count": 2
        },
        {
          "matId": "NW_MAT_180",
          "count": 1
        },
        {
          "matId": "NW_MAT_181",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกดีหมีศิลาเกราะเพชร",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.051,
        "defenseMult": 0.179,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ดีหมีศิลาเกราะเพชร เข้ากับ หนังเสือดาวเงาจันทรา ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_092",
      "nameTh": "ตำรับตีตราพิทักษ์ต่อมกลิ่นกวางชะมดด",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "NW_MAT_185",
          "count": 2
        },
        {
          "matId": "NW_MAT_189",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_008",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์ต่อมกลิ่นกวางชะมดด",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.107,
        "defenseMult": 0.112,
        "studyBonus": 0.045,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ต่อมกลิ่นกวางชะมดดารา เข้ากับ หนวดอสูรหมึกยักษ์วังวน ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_093",
      "nameTh": "ตำรับหลอมโอสถทิพย์หัวใจศิลาหลอมปฐพี",
      "craftPath": "ALCHEMY",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MAT_MW_ORGAN_024",
          "count": 2
        },
        {
          "matId": "MAT_MW_ORGAN_028",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_038",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หัวใจศิลาหลอมปฐพี",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "healHealth": 52,
        "healInjury": 40,
        "clearPoison": 28,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 3 ที่สกัดฤทธิ์ยาจาก หัวใจศิลาหลอมปฐพี และ คราบหยกสมบูรณ์ไร้รอยปริ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_094",
      "nameTh": "ตำรับตีเกราะศึกหนวดแมงกะพรุนสายฟ้",
      "craftPath": "FORGING",
      "tier": 3,
      "minMastery": 48,
      "durationDays": 32,
      "inputs": [
        {
          "matId": "MW_MAT_BP_160",
          "count": 2
        },
        {
          "matId": "MW_MAT_BP_165",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_168",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกหนวดแมงกะพรุนสายฟ้",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.051,
        "defenseMult": 0.179,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม หนวดแมงกะพรุนสายฟ้าสมุทร เข้ากับ เกล็ดปลาไหลไฟฟ้าม่วง ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 3"
    },
    {
      "id": "MW_REC_095",
      "nameTh": "ตำรับหลอมโอสถทิพย์กล้วยไม้ดาราเหมันต",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MAT_HERB_FROST_STAR_ORCHID_4",
          "count": 1
        },
        {
          "matId": "MAT_FORM_LIFE_ESSENCE_DEW_4",
          "count": 1
        },
        {
          "matId": "MAT_FORM_SOUL_WOOD_PILLAR_4",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์กล้วยไม้ดาราเหมันต",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 16,
        "cultivationProgress": 22,
        "tribulationResist": 16,
        "lifespanBonus": 12,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก กล้วยไม้ดาราเหมันต์ และ หยาดน้ำอมฤตพฤกษาชีวิต เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_096",
      "nameTh": "ตำรับหลอมโอสถทิพย์มุกกำยานศรัทธาปวงช",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MAT_FORM_FAITH_INCENSE_PEARL_4",
          "count": 1
        },
        {
          "matId": "NW_MAT_002",
          "count": 1
        },
        {
          "matId": "NW_MAT_006",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์มุกกำยานศรัทธาปวงช",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 28,
        "restoreQi": 36,
        "healHealth": 30,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก มุกกำยานศรัทธาปวงชน และ โสมโลหิตมังกรพันปี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_097",
      "nameTh": "ตำรับหลอมโอสถทิพย์บัวหยกจันทราพันกลี",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_008",
          "count": 1
        },
        {
          "matId": "NW_MAT_014",
          "count": 1
        },
        {
          "matId": "NW_MAT_018",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์บัวหยกจันทราพันกลี",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "healHealth": 62,
        "healInjury": 48,
        "clearPoison": 34,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก บัวหยกจันทราพันกลีบ และ หญ้ากระดูกขาวคืนชีพ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_098",
      "nameTh": "ตำรับหลอมโอสถทิพย์ดอกกล้วยไม้สายฟ้าม",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_023",
          "count": 1
        },
        {
          "matId": "NW_MAT_027",
          "count": 1
        },
        {
          "matId": "NW_MAT_032",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ดอกกล้วยไม้สายฟ้าม",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 40,
        "griefRelief": 30,
        "daoComprehensionBonus": 11,
        "toxicityRelief": 28,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก ดอกกล้วยไม้สายฟ้าม่วง และ ผลมังกรครามสมุทรลึก เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_099",
      "nameTh": "ตำรับปรุงเครื่องหอมปราณเถาวัลย์เหล็กไหล",
      "craftPath": "BEAST_TAMING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_039",
          "count": 1
        },
        {
          "matId": "NW_MAT_046",
          "count": 1
        },
        {
          "matId": "NW_MAT_048",
          "count": 1
        }
      ],
      "outputType": "BEAST_ITEM",
      "outputSubSlot": null,
      "outputNameTh": "เครื่องหอมปราณเถาวัลย์เหล็กไหล",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "healCompanion": 65,
        "trustGain": 32,
        "lureRareBeast": true,
        "spawnAlphaChance": 0.6699999999999999
      },
      "descTh": "หลอมสกัด เถาวัลย์เหล็กไหลพันปี ร่วมกับ เกสรบัวทองสุริยัน เป็นเครื่องหอมและโอสถบำรุงอสูรระดับ 4"
    },
    {
      "id": "MW_REC_100",
      "nameTh": "ตำรับหลอมโอสถทิพย์หญ้าวิญญาณห้าสี",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_049",
          "count": 1
        },
        {
          "matId": "NW_MAT_213",
          "count": 1
        },
        {
          "matId": "NW_MAT_219",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หญ้าวิญญาณห้าสี",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 28,
        "restoreQi": 36,
        "healHealth": 30,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก หญ้าวิญญาณห้าสี และ น้ำตาเงือกสมุทรคราม เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_101",
      "nameTh": "ตำรับปรุงเครื่องหอมปราณผงเกสรบุปผาฝันสล",
      "craftPath": "BEAST_TAMING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_224",
          "count": 1
        },
        {
          "matId": "NW_MAT_225",
          "count": 1
        },
        {
          "matId": "NW_MAT_228",
          "count": 1
        }
      ],
      "outputType": "BEAST_ITEM",
      "outputSubSlot": null,
      "outputNameTh": "เครื่องหอมปราณผงเกสรบุปผาฝันสล",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "healCompanion": 65,
        "trustGain": 32,
        "lureRareBeast": true,
        "spawnAlphaChance": 0.6699999999999999
      },
      "descTh": "หลอมสกัด ผงเกสรบุปผาฝันสลาย ร่วมกับ พิษเกล็ดน้ำแข็งกัดกร่อนกระดูก เป็นเครื่องหอมและโอสถบำรุงอสูรระดับ 4"
    },
    {
      "id": "MW_REC_102",
      "nameTh": "ตำรับหลอมโอสถทิพย์เห็ดราปรสิตสมองอสู",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_023",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_026",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_030",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์เห็ดราปรสิตสมองอสู",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 40,
        "griefRelief": 30,
        "daoComprehensionBonus": 11,
        "toxicityRelief": 28,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก เห็ดราปรสิตสมองอสูร และ ดอกกล้วยไม้สุญตาล่องหน เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_103",
      "nameTh": "ตำรับหลอมโอสถทิพย์มอสสายฟ้าทองคำม่วง",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_031",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_033",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_112",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์มอสสายฟ้าทองคำม่วง",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 16,
        "cultivationProgress": 22,
        "tribulationResist": 16,
        "lifespanBonus": 12,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก มอสสายฟ้าทองคำม่วง และ เถาวัลย์มังกรไม้ดูดชีพจร เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_104",
      "nameTh": "ตำรับตีตราพิทักษ์ทรายทองคำวิญญาณบรร",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MAT_ORE_QUICKSAND_SPIRIT_GOLD_4",
          "count": 1
        },
        {
          "matId": "MAT_FORM_EARTH_ARRAY_CORE_4",
          "count": 1
        },
        {
          "matId": "MAT_FORM_LIGHTNING_CRYSTAL_4",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์ทรายทองคำวิญญาณบรร",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.131,
        "defenseMult": 0.136,
        "studyBonus": 0.06,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ทรายทองคำวิญญาณบรรพกาล เข้ากับ แกนค่ายกลปฐพีเชื่อมชีพจร ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_105",
      "nameTh": "ตำรับจารึกเครื่องรางผลึกเพลิงพิภพสุริย",
      "craftPath": "ARRAY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MAT_FORM_EARTH_FLAME_CORE_4",
          "count": 1
        },
        {
          "matId": "NW_MAT_058",
          "count": 1
        },
        {
          "matId": "NW_MAT_059",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางผลึกเพลิงพิภพสุริย",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.118,
        "defenseMult": 0.14,
        "studyBonus": 0.08,
        "escortSafetyBonus": 0.102,
        "minStageReq": 2
      },
      "descTh": "จารึกอักขระเต๋าลงบน ผลึกเพลิงพิภพสุริยัน และ แร่ทองคำสุริยัน赤金 สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 4"
    },
    {
      "id": "MW_REC_106",
      "nameTh": "ตำรับตีเกราะศึกแร่เหล็กกล้าเกล็ดม",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_070",
          "count": 1
        },
        {
          "matId": "NW_MAT_071",
          "count": 1
        },
        {
          "matId": "NW_MAT_078",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกแร่เหล็กกล้าเกล็ดม",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.063,
        "defenseMult": 0.217,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม แร่เหล็กกล้าเกล็ดมังกร เข้ากับ แร่ปรอทเงินวิญญาณ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_107",
      "nameTh": "ตำรับตีตราพิทักษ์หยกเพลิงสุริยันชาด",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_079",
          "count": 1
        },
        {
          "matId": "NW_MAT_081",
          "count": 1
        },
        {
          "matId": "NW_MAT_087",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์หยกเพลิงสุริยันชาด",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.131,
        "defenseMult": 0.136,
        "studyBonus": 0.06,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม หยกเพลิงสุริยันชาด เข้ากับ หยกทมิฬเร้นวิญญาณ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_108",
      "nameTh": "ตำรับตีศาสตราแร่ทองคำสมุทรลึก",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_093",
          "count": 1
        },
        {
          "matId": "NW_MAT_094",
          "count": 1
        },
        {
          "matId": "NW_MAT_100",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตราแร่ทองคำสมุทรลึก",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.228,
        "defenseMult": 0.055,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม แร่ทองคำสมุทรลึก เข้ากับ แร่เหล็กวิญญาณพันทบ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_109",
      "nameTh": "ตำรับตีเกราะศึกผลึกพฤกษามรกตนิรัน",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_101",
          "count": 1
        },
        {
          "matId": "NW_MAT_102",
          "count": 1
        },
        {
          "matId": "NW_MAT_106",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกผลึกพฤกษามรกตนิรัน",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.063,
        "defenseMult": 0.217,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ผลึกพฤกษามรกตนิรันดร์ เข้ากับ ผลึกทองคำขาวคมกระบี่ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_110",
      "nameTh": "ตำรับจารึกเครื่องรางผลึกวิญญาณเร่ร่อน",
      "craftPath": "TALISMAN",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_107",
          "count": 1
        },
        {
          "matId": "NW_MAT_110",
          "count": 1
        },
        {
          "matId": "NW_MAT_113",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางผลึกวิญญาณเร่ร่อน",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.118,
        "defenseMult": 0.14,
        "studyBonus": 0.08,
        "escortSafetyBonus": 0.102,
        "minStageReq": 2
      },
      "descTh": "จารึกอักขระเต๋าลงบน ผลึกวิญญาณเร่ร่อน และ ผลึกแสงอรุณพิสุทธิ์ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 4"
    },
    {
      "id": "MW_REC_111",
      "nameTh": "ตำรับตีศาสตรามุกพิษเจ็ดสี",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_114",
          "count": 1
        },
        {
          "matId": "NW_MAT_122",
          "count": 1
        },
        {
          "matId": "NW_MAT_126",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตรามุกพิษเจ็ดสี",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.228,
        "defenseMult": 0.055,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม มุกพิษเจ็ดสี เข้ากับ ศิลาเพลิงอุกกาบาต ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_112",
      "nameTh": "ตำรับตีเกราะศึกแก่นปราณวารีพันลี้",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_127",
          "count": 1
        },
        {
          "matId": "NW_MAT_193",
          "count": 1
        },
        {
          "matId": "NW_MAT_196",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกแก่นปราณวารีพันลี้",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.063,
        "defenseMult": 0.217,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม แก่นปราณวารีพันลี้ เข้ากับ แผ่นยันต์หนังจิ้งจอกวิญญาณ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_113",
      "nameTh": "ตำรับจารึกเครื่องรางจานค่ายกลสำริดแปดท",
      "craftPath": "ARRAY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_202",
          "count": 1
        },
        {
          "matId": "NW_MAT_236",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_074",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางจานค่ายกลสำริดแปดท",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.118,
        "defenseMult": 0.14,
        "studyBonus": 0.08,
        "escortSafetyBonus": 0.102,
        "minStageReq": 2
      },
      "descTh": "จารึกอักขระเต๋าลงบน จานค่ายกลสำริดแปดทิศ และ ลูกปัดวิญญาณจักรพรรดิโบราณ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 4"
    },
    {
      "id": "MW_REC_114",
      "nameTh": "ตำรับตีศาสตราแร่ไทเทเนียมเมฆาเง",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MW_MAT_ORE_095",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_128",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_134",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตราแร่ไทเทเนียมเมฆาเง",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.228,
        "defenseMult": 0.055,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม แร่ไทเทเนียมเมฆาเงิน เข้ากับ หมึกโลหิตชาดสนามรบ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_115",
      "nameTh": "ตำรับจารึกเครื่องรางเศษศิลาจารึกอักษรเ",
      "craftPath": "ARRAY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MW_MAT_EXO_138",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_140",
          "count": 1
        },
        {
          "matId": "MAT_BP_THUNDER_LIZARD_SCALE_4",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางเศษศิลาจารึกอักษรเ",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.118,
        "defenseMult": 0.14,
        "studyBonus": 0.08,
        "escortSafetyBonus": 0.102,
        "minStageReq": 2
      },
      "descTh": "จารึกอักขระเต๋าลงบน เศษศิลาจารึกอักษรเทวะ และ ละอองฝันผีเสื้อพันปี สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 4"
    },
    {
      "id": "MW_REC_116",
      "nameTh": "ตำรับตีตราพิทักษ์ผลึกโลหิตอาฆาตกลั่",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MAT_FORM_BLOOD_FIEND_CRYSTAL_4",
          "count": 1
        },
        {
          "matId": "NW_MAT_134",
          "count": 1
        },
        {
          "matId": "NW_MAT_138",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์ผลึกโลหิตอาฆาตกลั่",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.131,
        "defenseMult": 0.136,
        "studyBonus": 0.06,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ผลึกโลหิตอาฆาตกลั่นปราณ เข้ากับ แก่นอสูรระดับ 4 (แก่นแท้ปฐพี) ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_117",
      "nameTh": "ตำรับหลอมโอสถทิพย์เปลือกด้วงทองคำกลื",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_144",
          "count": 1
        },
        {
          "matId": "NW_MAT_145",
          "count": 1
        },
        {
          "matId": "NW_MAT_147",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์เปลือกด้วงทองคำกลื",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "healHealth": 62,
        "healInjury": 48,
        "clearPoison": 34,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก เปลือกด้วงทองคำกลืนแร่ และ เขี้ยวพยัคฆ์ขาววายุ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_118",
      "nameTh": "ตำรับตีเกราะศึกขนปีกวิหคเพลิงชาด",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_151",
          "count": 1
        },
        {
          "matId": "NW_MAT_156",
          "count": 1
        },
        {
          "matId": "NW_MAT_157",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกขนปีกวิหคเพลิงชาด",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.063,
        "defenseMult": 0.217,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ขนปีกวิหคเพลิงชาด เข้ากับ ขนแผงคอราชสีห์เพลิงทอง ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_119",
      "nameTh": "ตำรับตีตราพิทักษ์นอแรดเกราะหยกทลายผ",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_159",
          "count": 1
        },
        {
          "matId": "NW_MAT_161",
          "count": 1
        },
        {
          "matId": "NW_MAT_164",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์นอแรดเกราะหยกทลายผ",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.131,
        "defenseMult": 0.136,
        "studyBonus": 0.06,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม นอแรดเกราะหยกทลายผา เข้ากับ กระดูกพยัคฆ์ขาวพันปี ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_120",
      "nameTh": "ตำรับหลอมโอสถทิพย์หางแมงป่องหยกเหมัน",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_166",
          "count": 1
        },
        {
          "matId": "NW_MAT_167",
          "count": 1
        },
        {
          "matId": "NW_MAT_170",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หางแมงป่องหยกเหมัน",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 28,
        "restoreQi": 36,
        "healHealth": 30,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก หางแมงป่องหยกเหมันต์ และ ใยแมงมุมวิญญาณเจ็ดสี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_121",
      "nameTh": "ตำรับตีเกราะศึกดีงูเหลือมมังกรเพล",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_173",
          "count": 1
        },
        {
          "matId": "NW_MAT_174",
          "count": 1
        },
        {
          "matId": "NW_MAT_176",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกดีงูเหลือมมังกรเพล",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.063,
        "defenseMult": 0.217,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ดีงูเหลือมมังกรเพลิง เข้ากับ ถุงพิษตะขาบเพลิงเก้าปล้อง ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_122",
      "nameTh": "ตำรับตีตราพิทักษ์หนังแรดเกราะหยก",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_179",
          "count": 1
        },
        {
          "matId": "NW_MAT_182",
          "count": 1
        },
        {
          "matId": "NW_MAT_184",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์หนังแรดเกราะหยก",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.131,
        "defenseMult": 0.136,
        "studyBonus": 0.06,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม หนังแรดเกราะหยก เข้ากับ เนื้อเจียวหลงปราณทิพย์ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_123",
      "nameTh": "ตำรับหลอมโอสถทิพย์คราบจักจั่นหยกเหมั",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "NW_MAT_187",
          "count": 1
        },
        {
          "matId": "NW_MAT_188",
          "count": 1
        },
        {
          "matId": "MAT_MW_ORGAN_005",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์คราบจักจั่นหยกเหมั",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 16,
        "cultivationProgress": 22,
        "tribulationResist": 16,
        "lifespanBonus": 12,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก คราบจักจั่นหยกเหมันต์ และ ถุงลมปลาวาฬเมฆา เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_124",
      "nameTh": "ตำรับตีเกราะศึกขนแผงคอทองคำเก็บแส",
      "craftPath": "FORGING",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MAT_MW_ORGAN_035",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_172",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_174",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกขนแผงคอทองคำเก็บแส",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.063,
        "defenseMult": 0.217,
        "minStageReq": 2
      },
      "descTh": "หลอมรวม ขนแผงคอทองคำเก็บแสงอรุณ เข้ากับ เขี้ยวเสือโคร่งเพลิงกัลป์ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 4"
    },
    {
      "id": "MW_REC_125",
      "nameTh": "ตำรับจารึกเครื่องรางกระดูกงูยักษ์หลุมด",
      "craftPath": "ARRAY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MW_MAT_BP_176",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_178",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_179",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางกระดูกงูยักษ์หลุมด",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.118,
        "defenseMult": 0.14,
        "studyBonus": 0.08,
        "escortSafetyBonus": 0.102,
        "minStageReq": 2
      },
      "descTh": "จารึกอักขระเต๋าลงบน กระดูกงูยักษ์หลุมดารา และ เปลือกด้วงแรดทองคำสุริยัน สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 4"
    },
    {
      "id": "MW_REC_126",
      "nameTh": "ตำรับหลอมโอสถทิพย์หัวใจวิหคสายฟ้าปีก",
      "craftPath": "ALCHEMY",
      "tier": 4,
      "minMastery": 58,
      "durationDays": 38,
      "inputs": [
        {
          "matId": "MW_MAT_BP_180",
          "count": 1
        },
        {
          "matId": "MAT_HERB_BLOOD_GINSENG_3",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หัวใจวิหคสายฟ้าปีก",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 40,
        "griefRelief": 30,
        "daoComprehensionBonus": 11,
        "toxicityRelief": 28,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 4 ที่สกัดฤทธิ์ยาจาก หัวใจวิหคสายฟ้าปีกคราม และ โสมโลหิตห้าร้อยปี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_127",
      "nameTh": "ตำรับหลอมโอสถทิพย์หญ้าปะการังปราณสมุ",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MAT_HERB_ABYSSAL_CORAL_GRASS_5",
          "count": 1
        },
        {
          "matId": "NW_MAT_005",
          "count": 1
        },
        {
          "matId": "NW_MAT_007",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หญ้าปะการังปราณสมุ",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 19,
        "cultivationProgress": 26,
        "tribulationResist": 20,
        "lifespanBonus": 15,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 5 ที่สกัดฤทธิ์ยาจาก หญ้าปะการังปราณสมุทร และ เห็ดหลินจือทองคำเก้าชั้น เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_128",
      "nameTh": "ตำรับหลอมโอสถทิพย์บัวทองวัชระโพธิ์",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_010",
          "count": 1
        },
        {
          "matId": "NW_MAT_021",
          "count": 1
        },
        {
          "matId": "NW_MAT_022",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์บัวทองวัชระโพธิ์",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 33,
        "restoreQi": 42,
        "healHealth": 35,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 5 ที่สกัดฤทธิ์ยาจาก บัวทองวัชระโพธิ์ และ ดอกบัวดินปฐพีบรรพกาล เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_129",
      "nameTh": "ตำรับหลอมโอสถทิพย์ผลท้อทิพย์เมฆาคราม",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_024",
          "count": 1
        },
        {
          "matId": "NW_MAT_028",
          "count": 1
        },
        {
          "matId": "NW_MAT_037",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ผลท้อทิพย์เมฆาคราม",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "healHealth": 72,
        "healInjury": 56,
        "clearPoison": 40,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 5 ที่สกัดฤทธิ์ยาจาก ผลท้อทิพย์เมฆาคราม และ ผลเนตรมารพันปี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_130",
      "nameTh": "ตำรับหลอมโอสถทิพย์ปะการังโลหิตมังกรส",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_043",
          "count": 1
        },
        {
          "matId": "NW_MAT_211",
          "count": 1
        },
        {
          "matId": "NW_MAT_212",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ปะการังโลหิตมังกรส",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "heartDemonRelief": 47,
        "griefRelief": 35,
        "daoComprehensionBonus": 13,
        "toxicityRelief": 33,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 5 ที่สกัดฤทธิ์ยาจาก ปะการังโลหิตมังกรสมุทร และ น้ำพุเหมันต์เก้ายมโลก เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_131",
      "nameTh": "ตำรับหลอมโอสถทิพย์สุราเมฆาครามหมื่นล",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_217",
          "count": 1
        },
        {
          "matId": "NW_MAT_223",
          "count": 1
        },
        {
          "matId": "NW_MAT_226",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์สุราเมฆาครามหมื่นล",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 19,
        "cultivationProgress": 26,
        "tribulationResist": 20,
        "lifespanBonus": 15,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 5 ที่สกัดฤทธิ์ยาจาก สุราเมฆาครามหมื่นลี้ และ รังไหมหนอนกู่ทองคำ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_132",
      "nameTh": "ตำรับปรุงเครื่องหอมปราณกาฝากสุญตากลืนมิ",
      "craftPath": "BEAST_TAMING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MW_MAT_HERB_039",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_041",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_042",
          "count": 1
        }
      ],
      "outputType": "BEAST_ITEM",
      "outputSubSlot": null,
      "outputNameTh": "เครื่องหอมปราณกาฝากสุญตากลืนมิ",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "healCompanion": 75,
        "trustGain": 37,
        "lureRareBeast": true,
        "spawnAlphaChance": 0.75
      },
      "descTh": "หลอมสกัด กาฝากสุญตากลืนมิติ ร่วมกับ ดอกพลับพลึงยมโลกสีเลือด เป็นเครื่องหอมและโอสถบำรุงอสูรระดับ 5"
    },
    {
      "id": "MW_REC_133",
      "nameTh": "ตำรับตีเกราะศึกผลึกน้ำแข็งก้นเหวห",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MAT_ORE_ABYSSAL_FROST_CRYSTAL_5",
          "count": 1
        },
        {
          "matId": "MAT_FORM_SUPREME_SWORD_TALISMAN_5",
          "count": 1
        },
        {
          "matId": "MAT_FORM_SKY_LEVITATION_CORE_5",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกผลึกน้ำแข็งก้นเหวห",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.075,
        "defenseMult": 0.255,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม ผลึกน้ำแข็งก้นเหวหมื่นปี เข้ากับ ยันต์ราชันย์หมื่นกระบี่ดารา ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_134",
      "nameTh": "ตำรับตีตราพิทักษ์หมุดทองคำสะกดชีพจร",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MAT_FORM_VEIN_ANCHOR_SPIKE_5",
          "count": 1
        },
        {
          "matId": "MAT_FORM_VOID_COMPASS_SHARD_5",
          "count": 1
        },
        {
          "matId": "NW_MAT_061",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์หมุดทองคำสะกดชีพจร",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.155,
        "defenseMult": 0.16,
        "studyBonus": 0.075,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม หมุดทองคำสะกดชีพจรมังกร เข้ากับ ศิลาเข็มทิศพิกัดมิติ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_135",
      "nameTh": "ตำรับจารึกเครื่องรางแร่เหล็กมารกลืนโลห",
      "craftPath": "ARRAY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_063",
          "count": 1
        },
        {
          "matId": "NW_MAT_064",
          "count": 1
        },
        {
          "matId": "NW_MAT_067",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางแร่เหล็กมารกลืนโลห",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.14,
        "defenseMult": 0.165,
        "studyBonus": 0.095,
        "escortSafetyBonus": 0.12,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน แร่เหล็กมารกลืนโลหิต และ แร่เหล็กน้ำแข็งหมื่นปี สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 5"
    },
    {
      "id": "MW_REC_136",
      "nameTh": "ตำรับตีเกราะศึกแร่ทองคำขาวพยัคฆ์ค",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_072",
          "count": 1
        },
        {
          "matId": "NW_MAT_080",
          "count": 1
        },
        {
          "matId": "NW_MAT_084",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกแร่ทองคำขาวพยัคฆ์ค",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.075,
        "defenseMult": 0.255,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม แร่ทองคำขาวพยัคฆ์คำราม เข้ากับ หยกม่วงอัสนีสวรรค์ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_137",
      "nameTh": "ตำรับตีตราพิทักษ์ผลึกเพลิงสุริยันแท",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_097",
          "count": 1
        },
        {
          "matId": "NW_MAT_098",
          "count": 1
        },
        {
          "matId": "NW_MAT_099",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์ผลึกเพลิงสุริยันแท",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.155,
        "defenseMult": 0.16,
        "studyBonus": 0.075,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม ผลึกเพลิงสุริยันแท้จริง เข้ากับ ผลึกเหมันต์เก้าชั้นฟ้า ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_138",
      "nameTh": "ตำรับตีศาสตราผลึกดาราจักรพันปี",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_105",
          "count": 1
        },
        {
          "matId": "NW_MAT_111",
          "count": 1
        },
        {
          "matId": "NW_MAT_115",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตราผลึกดาราจักรพันปี",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.27,
        "defenseMult": 0.065,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม ผลึกดาราจักรพันปี เข้ากับ มุกน้ำแข็งหมื่นปี ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_139",
      "nameTh": "ตำรับตีเกราะศึกศิลาปราณ極品 (ระดับส",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_117",
          "count": 1
        },
        {
          "matId": "NW_MAT_120",
          "count": 1
        },
        {
          "matId": "NW_MAT_128",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกศิลาปราณ極品 (ระดับส",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.075,
        "defenseMult": 0.255,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม ศิลาปราณ極品 (ระดับสุดยอด) เข้ากับ ศิลาลอยฟ้าไร้แรงโน้มถ่วง ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_140",
      "nameTh": "ตำรับจารึกเครื่องรางแผ่นหยกขาวจารึกอาค",
      "craftPath": "TALISMAN",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_194",
          "count": 1
        },
        {
          "matId": "NW_MAT_197",
          "count": 1
        },
        {
          "matId": "NW_MAT_199",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางแผ่นหยกขาวจารึกอาค",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.14,
        "defenseMult": 0.165,
        "studyBonus": 0.095,
        "escortSafetyBonus": 0.12,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน แผ่นหยกขาวจารึกอาคม และ หมึกน้ำค้างดาราเจ็ดดาว สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 5"
    },
    {
      "id": "MW_REC_141",
      "nameTh": "ตำรับจารึกเครื่องรางเข็มปักชีพจรปราณเห",
      "craftPath": "ARRAY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_203",
          "count": 1
        },
        {
          "matId": "NW_MAT_231",
          "count": 1
        },
        {
          "matId": "NW_MAT_232",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางเข็มปักชีพจรปราณเห",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.14,
        "defenseMult": 0.165,
        "studyBonus": 0.095,
        "escortSafetyBonus": 0.12,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน เข็มปักชีพจรปราณเหล็กไหล และ เศษคมกระบี่เซียนโบราณ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 5"
    },
    {
      "id": "MW_REC_142",
      "nameTh": "ตำรับจารึกเครื่องรางแผ่นศิลาจารึกอักขร",
      "craftPath": "TALISMAN",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_234",
          "count": 1
        },
        {
          "matId": "NW_MAT_239",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_099",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางแผ่นศิลาจารึกอักขร",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.14,
        "defenseMult": 0.165,
        "studyBonus": 0.095,
        "escortSafetyBonus": 0.12,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน แผ่นศิลาจารึกอักขระเต๋าแตกหัก และ เศษโซ่ตรวนผนึกอสูรสวรรค์ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 5"
    },
    {
      "id": "MW_REC_143",
      "nameTh": "ตำรับตีตราพิทักษ์ขนแผงคอกิเลนเกล็ดเ",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MAT_BP_FROST_KIRIN_PLUME_5",
          "count": 1
        },
        {
          "matId": "NW_MAT_135",
          "count": 1
        },
        {
          "matId": "NW_MAT_139",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์ขนแผงคอกิเลนเกล็ดเ",
      "compatiblePath": "ANY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.155,
        "defenseMult": 0.16,
        "studyBonus": 0.075,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม ขนแผงคอกิเลนเกล็ดเหมันต์ เข้ากับ แก่นอสูรระดับ 5 (แก่นแท้นภา) ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_144",
      "nameTh": "ตำรับหลอมโอสถทิพย์กรงเล็บมังกรอัสนีม",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_148",
          "count": 1
        },
        {
          "matId": "NW_MAT_153",
          "count": 1
        },
        {
          "matId": "NW_MAT_160",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์กรงเล็บมังกรอัสนีม",
      "compatiblePath": "XIAN",
      "isTranscendent": false,
      "effect": {
        "cultivationProgress": 33,
        "restoreQi": 42,
        "healHealth": 35,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 5 ที่สกัดฤทธิ์ยาจาก กรงเล็บมังกรอัสนีม่วง และ ขนจิ้งจอกเก้าหางมายา เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_145",
      "nameTh": "ตำรับจารึกเครื่องรางกะโหลกอสูรเงายมโลก",
      "craftPath": "ARRAY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_162",
          "count": 1
        },
        {
          "matId": "NW_MAT_163",
          "count": 1
        },
        {
          "matId": "NW_MAT_168",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางกะโหลกอสูรเงายมโลก",
      "compatiblePath": "BODY",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.14,
        "defenseMult": 0.165,
        "studyBonus": 0.095,
        "escortSafetyBonus": 0.12,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน กะโหลกอสูรเงายมโลก และ เส้นเอ็นมังกรวารี สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 5"
    },
    {
      "id": "MW_REC_146",
      "nameTh": "ตำรับตีตราพิทักษ์โลหิตเต่าดำอายุวัฒ",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_171",
          "count": 1
        },
        {
          "matId": "NW_MAT_172",
          "count": 1
        },
        {
          "matId": "NW_MAT_175",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์โลหิตเต่าดำอายุวัฒ",
      "compatiblePath": "GOD",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.155,
        "defenseMult": 0.16,
        "studyBonus": 0.075,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม โลหิตเต่าดำอายุวัฒนะ เข้ากับ โลหิตอสูรโลหิตบรรพกาล ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_147",
      "nameTh": "ตำรับหลอมโอสถทิพย์หัวใจราชสีห์เพลิงท",
      "craftPath": "ALCHEMY",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "NW_MAT_177",
          "count": 1
        },
        {
          "matId": "NW_MAT_183",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_181",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์หัวใจราชสีห์เพลิงท",
      "compatiblePath": "DEMON",
      "isTranscendent": false,
      "effect": {
        "foundationBonus": 19,
        "cultivationProgress": 26,
        "tribulationResist": 20,
        "lifespanBonus": 15,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 5 ที่สกัดฤทธิ์ยาจาก หัวใจราชสีห์เพลิงทอง และ ไข่วิหคเพลิงสายเลือดบริสุทธิ์ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_148",
      "nameTh": "ตำรับตีเกราะศึกเกล็ดมังกรสมุทรเรื",
      "craftPath": "FORGING",
      "tier": 5,
      "minMastery": 68,
      "durationDays": 44,
      "inputs": [
        {
          "matId": "MW_MAT_BP_182",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_190",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกเกล็ดมังกรสมุทรเรื",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": false,
      "effect": {
        "combatMult": 0.075,
        "defenseMult": 0.255,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม เกล็ดมังกรสมุทรเรืองแสง เข้ากับ แก่นอสูรผีเสื้อสุญตาข้ามภพ ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 5"
    },
    {
      "id": "MW_REC_149",
      "nameTh": "ตำรับหลอมโอสถทิพย์บัวทิพย์สุริยันจัน",
      "craftPath": "ALCHEMY",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "MAT_HERB_SUN_MOON_NECTAR_LOTUS_6",
          "count": 1
        },
        {
          "matId": "NW_MAT_003",
          "count": 1
        },
        {
          "matId": "NW_MAT_009",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์บัวทิพย์สุริยันจัน",
      "compatiblePath": "ANY",
      "isTranscendent": true,
      "effect": {
        "healHealth": 82,
        "healInjury": 64,
        "clearPoison": 46,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 6 ที่สกัดฤทธิ์ยาจาก บัวทิพย์สุริยันจันทรา และ โสมหิมะเหมันต์หมื่นปี เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_150",
      "nameTh": "ตำรับหลอมโอสถทิพย์ผลโพธิ์ทองคำตรัสรู",
      "craftPath": "ALCHEMY",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_029",
          "count": 1
        },
        {
          "matId": "NW_MAT_054",
          "count": 1
        },
        {
          "matId": "NW_MAT_209",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ผลโพธิ์ทองคำตรัสรู",
      "compatiblePath": "XIAN",
      "isTranscendent": true,
      "effect": {
        "heartDemonRelief": 54,
        "griefRelief": 40,
        "daoComprehensionBonus": 15,
        "toxicityRelief": 38,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 6 ที่สกัดฤทธิ์ยาจาก ผลโพธิ์ทองคำตรัสรู้ และ ผลเพลิงกัลป์ล้างพิภพ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_151",
      "nameTh": "ตำรับหลอมโอสถทิพย์น้ำอมฤตยอดบัวสวรรค",
      "craftPath": "ALCHEMY",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_214",
          "count": 1
        },
        {
          "matId": "NW_MAT_230",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_047",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์น้ำอมฤตยอดบัวสวรรค",
      "compatiblePath": "BODY",
      "isTranscendent": true,
      "effect": {
        "foundationBonus": 22,
        "cultivationProgress": 30,
        "tribulationResist": 24,
        "lifespanBonus": 18,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 6 ที่สกัดฤทธิ์ยาจาก น้ำอมฤตยอดบัวสวรรค์ และ หัวใจกู่ราชันหมื่นพิษ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_152",
      "nameTh": "ตำรับตีตราพิทักษ์หยกดาราตกสวรรค์เร้",
      "craftPath": "FORGING",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "MAT_ORE_STARFALL_VOID_JADE_6",
          "count": 1
        },
        {
          "matId": "MAT_FORM_FORTRESS_REACTOR_CORE_6",
          "count": 1
        },
        {
          "matId": "NW_MAT_062",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์หยกดาราตกสวรรค์เร้",
      "compatiblePath": "GOD",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.179,
        "defenseMult": 0.184,
        "studyBonus": 0.09,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม หยกดาราตกสวรรค์เร้นลับ เข้ากับ เตาปฏิกรณ์แกนปราณมหาป้อม ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 6"
    },
    {
      "id": "MW_REC_153",
      "nameTh": "ตำรับตีศาสตราแร่เหล็กเพลิงนรกภู",
      "craftPath": "FORGING",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_073",
          "count": 1
        },
        {
          "matId": "NW_MAT_082",
          "count": 1
        },
        {
          "matId": "NW_MAT_083",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "WEAPON",
      "outputNameTh": "ศาสตราแร่เหล็กเพลิงนรกภู",
      "compatiblePath": "DEMON",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.312,
        "defenseMult": 0.075,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม แร่เหล็กเพลิงนรกภูมิ เข้ากับ หยกโลหิตมังกรบรรพกาล ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 6"
    },
    {
      "id": "MW_REC_154",
      "nameTh": "ตำรับตีเกราะศึกแร่หยกเหลวแก่นปฐพี",
      "craftPath": "FORGING",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_095",
          "count": 1
        },
        {
          "matId": "NW_MAT_104",
          "count": 1
        },
        {
          "matId": "NW_MAT_108",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกแร่หยกเหลวแก่นปฐพี",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.087,
        "defenseMult": 0.293,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม แร่หยกเหลวแก่นปฐพี เข้ากับ ผลึกมิติว่างเปล่า ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 6"
    },
    {
      "id": "MW_REC_155",
      "nameTh": "ตำรับจารึกเครื่องรางศิลาจารึกอักขระฟ้า",
      "craftPath": "ARRAY",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_118",
          "count": 1
        },
        {
          "matId": "NW_MAT_121",
          "count": 1
        },
        {
          "matId": "NW_MAT_129",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางศิลาจารึกอักขระฟ้า",
      "compatiblePath": "ANY",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.162,
        "defenseMult": 0.19,
        "studyBonus": 0.11,
        "escortSafetyBonus": 0.138,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน ศิลาจารึกอักขระฟ้าดิน และ ศิลาหลอมจิตสามชาติ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 6"
    },
    {
      "id": "MW_REC_156",
      "nameTh": "ตำรับจารึกเครื่องรางแผ่นยันต์ทองคำม่วง",
      "craftPath": "TALISMAN",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_204",
          "count": 1
        },
        {
          "matId": "NW_MAT_205",
          "count": 1
        },
        {
          "matId": "NW_MAT_233",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางแผ่นยันต์ทองคำม่วง",
      "compatiblePath": "XIAN",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.162,
        "defenseMult": 0.19,
        "studyBonus": 0.11,
        "escortSafetyBonus": 0.138,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน แผ่นยันต์ทองคำม่วงสวรรค์ และ แกนศิลาบัญชาการค่ายกลหมื่นกระบี่ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 6"
    },
    {
      "id": "MW_REC_157",
      "nameTh": "ตำรับจารึกเครื่องรางเศษกระจกส่องภพภูมิ",
      "craftPath": "ARRAY",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_235",
          "count": 1
        },
        {
          "matId": "NW_MAT_237",
          "count": 1
        },
        {
          "matId": "NW_MAT_238",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางเศษกระจกส่องภพภูมิ",
      "compatiblePath": "BODY",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.162,
        "defenseMult": 0.19,
        "studyBonus": 0.11,
        "escortSafetyBonus": 0.138,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน เศษกระจกส่องภพภูมิ และ เศษกระดองเต่าพยากรณ์สวรรค์ สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 6"
    },
    {
      "id": "MW_REC_158",
      "nameTh": "ตำรับตีตราพิทักษ์แก่นปราณเทพอสูรพิท",
      "craftPath": "FORGING",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "MAT_BP_MYTHIC_GUARDIAN_CORE_6",
          "count": 1
        },
        {
          "matId": "NW_MAT_136",
          "count": 1
        },
        {
          "matId": "NW_MAT_141",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์แก่นปราณเทพอสูรพิท",
      "compatiblePath": "GOD",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.179,
        "defenseMult": 0.184,
        "studyBonus": 0.09,
        "minStageReq": 3
      },
      "descTh": "หลอมรวม แก่นปราณเทพอสูรพิทักษ์แดนลับ เข้ากับ แก่นอสูรระดับ 6 (เนยตันอสูรเซียน) ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 6"
    },
    {
      "id": "MW_REC_159",
      "nameTh": "ตำรับหลอมโอสถทิพย์กระดองเต่าดำเสวียน",
      "craftPath": "ALCHEMY",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_142",
          "count": 1
        },
        {
          "matId": "NW_MAT_152",
          "count": 1
        },
        {
          "matId": "NW_MAT_169",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์กระดองเต่าดำเสวียน",
      "compatiblePath": "DEMON",
      "isTranscendent": true,
      "effect": {
        "foundationBonus": 22,
        "cultivationProgress": 30,
        "tribulationResist": 24,
        "lifespanBonus": 18,
        "toxicity": 2
      },
      "descTh": "ตำรับโอสถระดับ 6 ที่สกัดฤทธิ์ยาจาก กระดองเต่าดำเสวียนอู่ และ ขนปีกพญาครุฑสายฟ้า เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_160",
      "nameTh": "ตำรับจารึกเครื่องรางเขาสมบูรณ์กิเลนปฐพ",
      "craftPath": "TALISMAN",
      "tier": 6,
      "minMastery": 78,
      "durationDays": 50,
      "inputs": [
        {
          "matId": "NW_MAT_190",
          "count": 1
        },
        {
          "matId": "MAT_HERB_SNOW_LOTUS_5",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางเขาสมบูรณ์กิเลนปฐพ",
      "compatiblePath": "HEART_SOUL",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.162,
        "defenseMult": 0.19,
        "studyBonus": 0.11,
        "escortSafetyBonus": 0.138,
        "minStageReq": 3
      },
      "descTh": "จารึกอักขระเต๋าลงบน เขาสมบูรณ์กิเลนปฐพี และ บัวหิมะสวรรค์หมื่นปี สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 6"
    },
    {
      "id": "MW_REC_161",
      "nameTh": "ตำรับหลอมโอสถทิพย์ผลดาราจักรไร้ขอบเข",
      "craftPath": "ALCHEMY",
      "tier": 7,
      "minMastery": 88,
      "durationDays": 56,
      "inputs": [
        {
          "matId": "NW_MAT_030",
          "count": 1
        },
        {
          "matId": "NW_MAT_035",
          "count": 1
        },
        {
          "matId": "NW_MAT_055",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์ผลดาราจักรไร้ขอบเข",
      "compatiblePath": "ANY",
      "isTranscendent": true,
      "effect": {
        "healHealth": 92,
        "healInjury": 72,
        "clearPoison": 52,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 7 ที่สกัดฤทธิ์ยาจาก ผลดาราจักรไร้ขอบเขต และ รากต้นไม้โลกบรรพกาล เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_162",
      "nameTh": "ตำรับหลอมโอสถทิพย์น้ำทิพย์ล้างมรรคา",
      "craftPath": "ALCHEMY",
      "tier": 7,
      "minMastery": 88,
      "durationDays": 56,
      "inputs": [
        {
          "matId": "NW_MAT_220",
          "count": 1
        },
        {
          "matId": "MAT_TR_VOID_MATRIX_CORE",
          "count": 1
        },
        {
          "matId": "MAT_TR_HEAVEN_EDICT_SILK",
          "count": 1
        }
      ],
      "outputType": "PILL",
      "outputSubSlot": null,
      "outputNameTh": "โอสถทิพย์น้ำทิพย์ล้างมรรคา",
      "compatiblePath": "XIAN",
      "isTranscendent": true,
      "effect": {
        "heartDemonRelief": 61,
        "griefRelief": 45,
        "daoComprehensionBonus": 17,
        "toxicityRelief": 43,
        "toxicity": 1
      },
      "descTh": "ตำรับโอสถระดับ 7 ที่สกัดฤทธิ์ยาจาก น้ำทิพย์ล้างมรรคา และ ผลึกแกนค่ายกลข้ามมิติ เพื่อบำรุงตบะและเส้นชีพจร"
    },
    {
      "id": "MW_REC_163",
      "nameTh": "ตำรับตีเกราะศึกไขกระดูกเทพอสูรเบื",
      "craftPath": "FORGING",
      "tier": 7,
      "minMastery": 88,
      "durationDays": 56,
      "inputs": [
        {
          "matId": "MAT_TR_IMMORTAL_BEAST_MARROW",
          "count": 1
        },
        {
          "matId": "MAT_TR_DAO_HEART_CRYSTAL",
          "count": 1
        },
        {
          "matId": "MAT_FORM_ANCIENT_RUNE_TABLET_7",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "ARMOR",
      "outputNameTh": "เกราะศึกไขกระดูกเทพอสูรเบื",
      "compatiblePath": "BODY",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.099,
        "defenseMult": 0.331,
        "minStageReq": 4
      },
      "descTh": "หลอมรวม ไขกระดูกเทพอสูรเบื้องบน เข้ากับ ผลึกหัวใจเต๋าสวรรค์ชั้นเก้า ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 7"
    },
    {
      "id": "MW_REC_164",
      "nameTh": "ตำรับตีตราพิทักษ์แร่โลหะมิติว่างเปล",
      "craftPath": "FORGING",
      "tier": 7,
      "minMastery": 88,
      "durationDays": 56,
      "inputs": [
        {
          "matId": "NW_MAT_074",
          "count": 1
        },
        {
          "matId": "NW_MAT_075",
          "count": 1
        },
        {
          "matId": "NW_MAT_085",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "ตราพิทักษ์แร่โลหะมิติว่างเปล",
      "compatiblePath": "GOD",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.203,
        "defenseMult": 0.208,
        "studyBonus": 0.105,
        "minStageReq": 4
      },
      "descTh": "หลอมรวม แร่โลหะมิติว่างเปล่า เข้ากับ แร่เหล็กเทวะบรรพกาล ด้วยเพลิงโรงหลอมเป็นยุทธภัณฑ์ระดับ 7"
    },
    {
      "id": "MW_REC_165",
      "nameTh": "ตำรับจารึกเครื่องรางแก่นมรรคาเมฆาคราม",
      "craftPath": "ARRAY",
      "tier": 7,
      "minMastery": 88,
      "durationDays": 56,
      "inputs": [
        {
          "matId": "NW_MAT_130",
          "count": 1
        },
        {
          "matId": "NW_MAT_240",
          "count": 1
        },
        {
          "matId": "NW_MAT_137",
          "count": 1
        }
      ],
      "outputType": "EQUIPMENT",
      "outputSubSlot": "TALISMAN_VESSEL",
      "outputNameTh": "เครื่องรางแก่นมรรคาเมฆาคราม",
      "compatiblePath": "DEMON",
      "isTranscendent": true,
      "effect": {
        "combatMult": 0.184,
        "defenseMult": 0.215,
        "studyBonus": 0.125,
        "escortSafetyBonus": 0.156,
        "minStageReq": 4
      },
      "descTh": "จารึกอักขระเต๋าลงบน แก่นมรรคาเมฆาคราม และ หยดปราณต้นกำเนิดฟ้าดิน (Chaos Essence) สร้างเครื่องรางคุ้มครองและเสริมปัญญาระดับ 7"
    }
  ],
  "experimentDesigns": [
    {
      "id": "MW_EXP_001",
      "name": "โอสถมอสหยกเรืองแสง (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_002",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 1,
      "min": 30,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ มอสหยกเรืองแสงถ้ำลึก เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "RESONANCE",
        "QI_CONDUCT"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_001",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_HERB_002",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_005",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_HERB_002": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_001",
        "name": "โอสถมอสหยกเรืองแสง (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 1,
        "min": 27,
        "inputs": [
          {
            "matId": "MW_MAT_HERB_002",
            "count": 2
          },
          {
            "matId": "MW_MAT_HERB_005",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_001",
        "effect": {
          "healHealth": 32,
          "healInjury": 18,
          "clearPoison": 8,
          "toxicity": 0,
          "heal": 40,
          "pain": 24,
          "progress": 14,
          "cleanse": 14
        },
        "duration": 23
      }
    },
    {
      "id": "MW_EXP_002",
      "name": "โอสถถั่งเช่าหนอนศิลา (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_005",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 2,
      "min": 38,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ เห็ดถั่งเช่าหนอนศิลา เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "LIGHTNING_TEMPERED",
        "MARROW_STRENGTH"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_002",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_HERB_008",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_051",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_HERB_008": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_002",
        "name": "โอสถถั่งเช่าหนอนศิลา (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 2,
        "min": 34,
        "inputs": [
          {
            "matId": "MW_MAT_HERB_008",
            "count": 2
          },
          {
            "matId": "MW_MAT_HERB_051",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_002",
        "effect": {
          "healHealth": 38,
          "healInjury": 26,
          "foundationBonus": 6,
          "cultivationProgress": 13,
          "toxicity": 1,
          "heal": 46,
          "pain": 32,
          "progress": 17,
          "cleanse": 18
        },
        "duration": 28
      }
    },
    {
      "id": "MW_EXP_003",
      "name": "โอสถชาสายฟ้าปลุกปัญญา (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_008",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 2,
      "min": 38,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ใบชาสายฟ้าเก้าแฉก เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "MOON_REFLECT",
        "ILLUSION_PIERCE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_003",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_HERB_012",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_007",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_HERB_012": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_003",
        "name": "โอสถชาสายฟ้าปลุกปัญญา (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 2,
        "min": 34,
        "inputs": [
          {
            "matId": "MW_MAT_HERB_012",
            "count": 2
          },
          {
            "matId": "MW_MAT_HERB_007",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_003",
        "effect": {
          "restoreQi": 32,
          "daoComprehensionBonus": 7,
          "cultivationProgress": 14,
          "toxicity": 1,
          "heal": 36,
          "pain": 20,
          "progress": 18,
          "cleanse": 18
        },
        "duration": 28
      }
    },
    {
      "id": "MW_EXP_004",
      "name": "โอสถมุกเพลิงผสานหยินหยาง (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_011",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 3,
      "min": 46,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ สาหร่ายมุกเพลิงก้นปล่อง เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "ANCESTRAL_BLOOD",
        "ARMOR_PIERCE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_004",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_HERB_018",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_022",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_HERB_018": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_004",
        "name": "โอสถมุกเพลิงผสานหยินหยาง (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 3,
        "min": 41,
        "inputs": [
          {
            "matId": "MW_MAT_HERB_018",
            "count": 2
          },
          {
            "matId": "MW_MAT_HERB_022",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_004",
        "effect": {
          "cultivationProgress": 19,
          "toxicityRelief": 26,
          "clearPoison": 28,
          "foundationBonus": 9,
          "toxicity": 0,
          "heal": 36,
          "pain": 20,
          "progress": 23,
          "cleanse": 34
        },
        "duration": 33
      }
    },
    {
      "id": "MW_EXP_005",
      "name": "โอสถหลินจือกระจกเงาเซน (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_014",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 4,
      "min": 54,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ เห็ดหลินจือกระจกเงาหกแฉก เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "TWIN_CORE",
        "QI_RESERVOIR"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_005",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_HERB_032",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_029",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_HERB_032": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_005",
        "name": "โอสถหลินจือกระจกเงาเซน (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 4,
        "min": 48,
        "inputs": [
          {
            "matId": "MW_MAT_HERB_032",
            "count": 2
          },
          {
            "matId": "MW_MAT_HERB_029",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_005",
        "effect": {
          "heartDemonRelief": 38,
          "griefRelief": 35,
          "daoComprehensionBonus": 14,
          "cultivationProgress": 18,
          "toxicity": 0,
          "heal": 36,
          "pain": 20,
          "progress": 22,
          "cleanse": 18
        },
        "duration": 38
      }
    },
    {
      "id": "MW_EXP_006",
      "name": "โอสถชาโพธิ์หยกสลายมาร (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_017",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 5,
      "min": 62,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ใบชาต้นโพธิ์หยกโบราณ เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "CRYSTAL_VENOM",
        "CORROSIVE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_006",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_HERB_038",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_037",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_HERB_038": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_006",
        "name": "โอสถชาโพธิ์หยกสลายมาร (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 5,
        "min": 55,
        "inputs": [
          {
            "matId": "MW_MAT_HERB_038",
            "count": 2
          },
          {
            "matId": "MW_MAT_HERB_037",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_006",
        "effect": {
          "heartDemonRelief": 55,
          "clearPoison": 45,
          "toxicityRelief": 40,
          "daoComprehensionBonus": 16,
          "tribulationResist": 25,
          "toxicity": 0,
          "heal": 36,
          "pain": 20,
          "progress": 14,
          "cleanse": 51
        },
        "duration": 43
      }
    },
    {
      "id": "MW_EXP_007",
      "name": "เทวโอสถต้นไม้โลกเปิดพิภพ (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_020",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 5,
      "min": 62,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ผลต้นไม้โลกปฐมกาล เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "DUAL_PULSE",
        "SOLAR_FLAME"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_007",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_HERB_048",
          "count": 1
        },
        {
          "matId": "MW_MAT_HERB_049",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_HERB_048": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_007",
        "name": "เทวโอสถต้นไม้โลกเปิดพิภพ (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 5,
        "min": 55,
        "inputs": [
          {
            "matId": "MW_MAT_HERB_048",
            "count": 1
          },
          {
            "matId": "MW_MAT_HERB_049",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_007",
        "effect": {
          "cultivationProgress": 60,
          "restoreQi": 120,
          "healHealth": 100,
          "healInjury": 100,
          "heartDemonRelief": 80,
          "toxicityRelief": 80,
          "lifespanBonus": 60,
          "foundationBonus": 35,
          "daoComprehensionBonus": 25,
          "toxicity": 0,
          "heal": 108,
          "pain": 106,
          "progress": 64,
          "cleanse": 18
        },
        "duration": 43
      }
    },
    {
      "id": "MW_EXP_008",
      "name": "ขลุ่ยศึกไผ่หยกสะท้อนปราณ (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_023",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 2,
      "min": 38,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ไม้ไผ่หยกกลวงสื่อเสียง เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "METALLIC_SILK",
        "TENSILE_TOUGH"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_008",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_EXO_102",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_059",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_EXO_102": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_008",
        "name": "ขลุ่ยศึกไผ่หยกสะท้อนปราณ (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 2,
        "min": 34,
        "inputs": [
          {
            "matId": "MW_MAT_EXO_102",
            "count": 2
          },
          {
            "matId": "MW_MAT_ORE_059",
            "count": 2
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_008",
        "effect": {
          "combatMult": 0.065,
          "defenseMult": 0.055,
          "studyBonus": 0.06,
          "minStageReq": 1,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.09,
          "defense": 0.075,
          "study": 0.08
        },
        "duration": 28
      }
    },
    {
      "id": "MW_EXP_009",
      "name": "กระบี่เงินน้ำค้างแข็งส่องจันทร์ (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_026",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 3,
      "min": 46,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ แร่เงินน้ำค้างแข็งบริสุทธิ์ เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "NATURAL_RUNE",
        "DAMAGE_REFLECT"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_009",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_ORE_064",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_089",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_ORE_064": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_009",
        "name": "กระบี่เงินน้ำค้างแข็งส่องจันทร์ (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 3,
        "min": 41,
        "inputs": [
          {
            "matId": "MW_MAT_ORE_064",
            "count": 2
          },
          {
            "matId": "MW_MAT_ORE_089",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_009",
        "effect": {
          "combatMult": 0.165,
          "defenseMult": 0.05,
          "studyBonus": 0.04,
          "minStageReq": 2,
          "slot": "WEAPON",
          "combat": 0.19,
          "defense": 0.07,
          "study": 0.06
        },
        "duration": 33
      }
    },
    {
      "id": "MW_EXP_010",
      "name": "โล่ผลึกสำริดกระดูกอกลาวา (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_029",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 3,
      "min": 46,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ กระดองปูเสฉวนแบกผลึก เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "TOXIN_DIGEST",
        "PURIFY_PILL"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_010",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_BP_157",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_068",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_BP_157": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_010",
        "name": "โล่ผลึกสำริดกระดูกอกลาวา (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 3,
        "min": 41,
        "inputs": [
          {
            "matId": "MW_MAT_BP_157",
            "count": 2
          },
          {
            "matId": "MW_MAT_ORE_068",
            "count": 2
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_010",
        "effect": {
          "combatMult": 0.04,
          "defenseMult": 0.14,
          "escortSafetyBonus": 0.09,
          "minStageReq": 2,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.065,
          "defense": 0.16
        },
        "duration": 33
      }
    },
    {
      "id": "MW_EXP_011",
      "name": "พัดเหล็กไหลเงินปรอทเจ็ดมายา (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_032",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 4,
      "min": 54,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ขนนกยูงพิษเจ็ดมายา เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "SHADOW_STEP",
        "SILENT_STRIKE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_011",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_BP_173",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_073",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_BP_173": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_011",
        "name": "พัดเหล็กไหลเงินปรอทเจ็ดมายา (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 4,
        "min": 48,
        "inputs": [
          {
            "matId": "MW_MAT_BP_173",
            "count": 2
          },
          {
            "matId": "MW_MAT_ORE_073",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_011",
        "effect": {
          "combatMult": 0.195,
          "defenseMult": 0.075,
          "studyBonus": 0.07,
          "minStageReq": 3,
          "slot": "WEAPON",
          "combat": 0.22,
          "defense": 0.095,
          "study": 0.09
        },
        "duration": 38
      }
    },
    {
      "id": "MW_EXP_012",
      "name": "ชุดมีดชำแหละออบซิเดียนสุริยัน (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_035",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 4,
      "min": 54,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ หินออบซิเดียนเปลวสุริยัน เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "BIOLUMINESCENT",
        "SOUL_LURE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_012",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_ORE_096",
          "count": 1
        },
        {
          "matId": "MW_MAT_ORE_090",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_ORE_096": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_012",
        "name": "ชุดมีดชำแหละออบซิเดียนสุริยัน (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 4,
        "min": 48,
        "inputs": [
          {
            "matId": "MW_MAT_ORE_096",
            "count": 2
          },
          {
            "matId": "MW_MAT_ORE_090",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_012",
        "effect": {
          "combatMult": 0.095,
          "defenseMult": 0.08,
          "craftBonusPath": "ALCHEMY",
          "craftBonusScore": 12,
          "dissectionBonus": 25,
          "minStageReq": 2,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.12,
          "defense": 0.1
        },
        "duration": 38
      }
    },
    {
      "id": "MW_EXP_013",
      "name": "อาภรณ์ไหมทองสวรรค์หงส์เหมันต์ (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_038",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 5,
      "min": 62,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ไหมทองคำสวรรค์ทอเมฆ เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "MAGMA_FUSED",
        "HEAT_SHIELD"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_013",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_EXO_110",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_183",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_EXO_110": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_013",
        "name": "อาภรณ์ไหมทองสวรรค์หงส์เหมันต์ (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 5,
        "min": 55,
        "inputs": [
          {
            "matId": "MW_MAT_EXO_110",
            "count": 2
          },
          {
            "matId": "MW_MAT_BP_183",
            "count": 2
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_013",
        "effect": {
          "combatMult": 0.08,
          "defenseMult": 0.25,
          "studyBonus": 0.08,
          "minStageReq": 4,
          "slot": "ARMOR",
          "combat": 0.105,
          "defense": 0.27,
          "study": 0.1
        },
        "duration": 43
      }
    },
    {
      "id": "MW_EXP_014",
      "name": "ทวนเทวะอสนีเขากิเลนดารา (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_041",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 5,
      "min": 62,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ทองคำเทวะอสนีสวรรค์เก้าชั้น เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "LIGHT_REFRACT",
        "MIRAGE_CLONE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_014",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_ORE_080",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_193",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_ORE_080": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_014",
        "name": "ทวนเทวะอสนีเขากิเลนดารา (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 5,
        "min": 55,
        "inputs": [
          {
            "matId": "MW_MAT_ORE_080",
            "count": 2
          },
          {
            "matId": "MW_MAT_BP_193",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_014",
        "effect": {
          "combatMult": 0.32,
          "defenseMult": 0.11,
          "escortSafetyBonus": 0.18,
          "minStageReq": 5,
          "slot": "WEAPON",
          "combat": 0.345,
          "defense": 0.13
        },
        "duration": 43
      }
    },
    {
      "id": "MW_EXP_015",
      "name": "พู่กันขนเมฆาไผ่หยก (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_044",
      "workshop": "forge",
      "discipline": "TALISMAN",
      "tier": 1,
      "min": 30,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ขนหางกระรอกบินเมฆา เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "SYMBIOTIC_CORE",
        "LIFE_REGEN"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_015",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_BP_143",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_126",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_BP_143": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_015",
        "name": "พู่กันขนเมฆาไผ่หยก (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "TALISMAN",
        "tier": 1,
        "min": 27,
        "inputs": [
          {
            "matId": "MW_MAT_BP_143",
            "count": 2
          },
          {
            "matId": "MW_MAT_EXO_126",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_015",
        "effect": {
          "combatMult": 0.03,
          "defenseMult": 0.05,
          "studyBonus": 0.05,
          "craftBonusPath": "TALISMAN",
          "craftBonusScore": 6,
          "minStageReq": 1,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.055,
          "defense": 0.07,
          "study": 0.07
        },
        "duration": 23
      }
    },
    {
      "id": "MW_EXP_016",
      "name": "โคมแก้วชีวภาพส่องเหวลึก (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_047",
      "workshop": "forge",
      "discipline": "ARRAY",
      "tier": 3,
      "min": 46,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ต่อมแสงชีวภาพล่อวิญญาณ (อวัยวะกลายพันธุ์หายาก) เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "BLOOD_SIPHON",
        "VAMPIRIC_EDGE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_016",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MAT_MW_ORGAN_012",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_127",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MAT_MW_ORGAN_012": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_016",
        "name": "โคมแก้วชีวภาพส่องเหวลึก (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "ARRAY",
        "tier": 3,
        "min": 41,
        "inputs": [
          {
            "matId": "MAT_MW_ORGAN_012",
            "count": 1
          },
          {
            "matId": "MW_MAT_EXO_127",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_016",
        "effect": {
          "combatMult": 0.05,
          "defenseMult": 0.1,
          "studyBonus": 0.06,
          "escortSafetyBonus": 0.1,
          "minStageReq": 2,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.075,
          "defense": 0.12,
          "study": 0.08
        },
        "duration": 33
      }
    },
    {
      "id": "MW_EXP_017",
      "name": "แกนมหาค่ายกลสุญตาโพธิ์แก้ว (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_050",
      "workshop": "forge",
      "discipline": "ARRAY",
      "tier": 5,
      "min": 62,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ แกนผลึกสุญตาตรึงมิติ เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "MEMORY_IMPRINT",
        "DAO_INSIGHT"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_017",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_EXO_133",
          "count": 1
        },
        {
          "matId": "MW_MAT_EXO_106",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_EXO_133": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_017",
        "name": "แกนมหาค่ายกลสุญตาโพธิ์แก้ว (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "ARRAY",
        "tier": 5,
        "min": 55,
        "inputs": [
          {
            "matId": "MW_MAT_EXO_133",
            "count": 1
          },
          {
            "matId": "MW_MAT_EXO_106",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_017",
        "effect": {
          "combatMult": 0.15,
          "defenseMult": 0.18,
          "studyBonus": 0.12,
          "minStageReq": 4,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.175,
          "defense": 0.2,
          "study": 0.14
        },
        "duration": 43
      }
    },
    {
      "id": "MW_EXP_018",
      "name": "โอสถแก่นปรสิตปลุกสายเลือดคู่หู (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_053",
      "workshop": "alchemy",
      "discipline": "BEAST_TAMING",
      "tier": 4,
      "min": 54,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ แก่นปราณปรสิตเห็ดหลินจือ (อวัยวะกลายพันธุ์หายาก) เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "ANTI_GRAVITY",
        "FLIGHT_BUOYANCY"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_018",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MAT_MW_ORGAN_015",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_163",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MAT_MW_ORGAN_015": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_018",
        "name": "โอสถแก่นปรสิตปลุกสายเลือดคู่หู (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "BEAST_TAMING",
        "tier": 4,
        "min": 48,
        "inputs": [
          {
            "matId": "MAT_MW_ORGAN_015",
            "count": 1
          },
          {
            "matId": "MW_MAT_BP_163",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_018",
        "effect": {
          "trustGain": 40,
          "healCompanion": 75,
          "lureRareBeast": true,
          "spawnAlphaChance": 0.8,
          "heal": 36,
          "pain": 20,
          "progress": 14,
          "cleanse": 18,
          "toxicity": 1
        },
        "duration": 38
      }
    },
    {
      "id": "MW_EXP_019",
      "name": "ตราพิทักษ์ถุงกรดมดเกราะทองแด (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_056",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 1,
      "min": 30,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ถุงกรดมดเกราะทองแดง เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "ASTRAL_CHART",
        "FORTUNE_SHIELD"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_019",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_BP_144",
          "count": 1
        },
        {
          "matId": "MW_MAT_BP_146",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_BP_144": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_019",
        "name": "ตราพิทักษ์ถุงกรดมดเกราะทองแด (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 1,
        "min": 27,
        "inputs": [
          {
            "matId": "MW_MAT_BP_144",
            "count": 2
          },
          {
            "matId": "MW_MAT_BP_146",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_019",
        "effect": {
          "combatMult": 0.059,
          "defenseMult": 0.064,
          "studyBonus": 0.015,
          "minStageReq": 1,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.084,
          "defense": 0.084,
          "study": 0.035
        },
        "duration": 23
      }
    },
    {
      "id": "MW_EXP_020",
      "name": "โอสถทิพย์ใบชาเมฆาหมอกเก้ายอ (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_059",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 2,
      "min": 38,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ใบชาเมฆาหมอกเก้ายอด เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "BEAST_AWE",
        "CALM_MIND"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_020",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "NW_MAT_036",
          "count": 1
        },
        {
          "matId": "NW_MAT_041",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "NW_MAT_036": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_020",
        "name": "โอสถทิพย์ใบชาเมฆาหมอกเก้ายอ (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 2,
        "min": 34,
        "inputs": [
          {
            "matId": "NW_MAT_036",
            "count": 2
          },
          {
            "matId": "NW_MAT_041",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_020",
        "effect": {
          "foundationBonus": 10,
          "cultivationProgress": 14,
          "tribulationResist": 8,
          "lifespanBonus": 0,
          "toxicity": 1,
          "heal": 36,
          "pain": 20,
          "progress": 18,
          "cleanse": 18
        },
        "duration": 28
      }
    },
    {
      "id": "MW_EXP_021",
      "name": "โอสถทิพย์มอสทองแดงกินแร่ (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_062",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 2,
      "min": 38,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ มอสทองแดงกินแร่ เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "ZEN_BELL",
        "SOUL_GUARD"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_021",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "MW_MAT_HERB_013",
          "count": 1
        },
        {
          "matId": "MAT_FORM_BLANK_ARRAY_FLAG_2",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "MW_MAT_HERB_013": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_021",
        "name": "โอสถทิพย์มอสทองแดงกินแร่ (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 2,
        "min": 34,
        "inputs": [
          {
            "matId": "MW_MAT_HERB_013",
            "count": 2
          },
          {
            "matId": "MAT_FORM_BLANK_ARRAY_FLAG_2",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_021",
        "effect": {
          "heartDemonRelief": 26,
          "griefRelief": 20,
          "daoComprehensionBonus": 7,
          "toxicityRelief": 18,
          "toxicity": 0,
          "heal": 36,
          "pain": 20,
          "progress": 14,
          "cleanse": 18
        },
        "duration": 28
      }
    },
    {
      "id": "MW_EXP_022",
      "name": "เครื่องรางศิลาหยกน้ำค้างแข็ง (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_065",
      "workshop": "forge",
      "discipline": "ARRAY",
      "tier": 2,
      "min": 38,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ศิลาหยกน้ำค้างแข็ง เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "ORE_SENSE",
        "EARTH_PULSE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_022",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "NW_MAT_123",
          "count": 1
        },
        {
          "matId": "NW_MAT_195",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "NW_MAT_123": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_022",
        "name": "เครื่องรางศิลาหยกน้ำค้างแข็ง (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "ARRAY",
        "tier": 2,
        "min": 34,
        "inputs": [
          {
            "matId": "NW_MAT_123",
            "count": 2
          },
          {
            "matId": "NW_MAT_195",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_022",
        "effect": {
          "combatMult": 0.074,
          "defenseMult": 0.09,
          "studyBonus": 0.05,
          "escortSafetyBonus": 0.066,
          "minStageReq": 1,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.099,
          "defense": 0.11,
          "study": 0.07
        },
        "duration": 28
      }
    },
    {
      "id": "MW_EXP_023",
      "name": "ตราพิทักษ์ขนหมีน้ำแข็งเหมันต (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_ironblade",
      "linkedCatalogRecipeId": "MW_REC_068",
      "workshop": "forge",
      "discipline": "FORGING",
      "tier": 2,
      "min": 38,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ ขนหมีน้ำแข็งเหมันต์ เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "FROST_BITE",
        "CHILL_MERIDIAN"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_023",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "NW_MAT_155",
          "count": 1
        },
        {
          "matId": "NW_MAT_186",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "NW_MAT_155": [
          "MAT_ORE_BLACK_IRON_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_023",
        "name": "ตราพิทักษ์ขนหมีน้ำแข็งเหมันต (สูตรค้นคว้าประยุกต์)",
        "workshop": "forge",
        "discipline": "FORGING",
        "tier": 2,
        "min": 34,
        "inputs": [
          {
            "matId": "NW_MAT_155",
            "count": 2
          },
          {
            "matId": "NW_MAT_186",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_023",
        "effect": {
          "combatMult": 0.083,
          "defenseMult": 0.088,
          "studyBonus": 0.03,
          "minStageReq": 1,
          "slot": "TALISMAN_VESSEL",
          "combat": 0.108,
          "defense": 0.108,
          "study": 0.05
        },
        "duration": 28
      }
    },
    {
      "id": "MW_EXP_024",
      "name": "โอสถทิพย์หญ้ากระบี่เจ็ดคม (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_071",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 3,
      "min": 46,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ หญ้ากระบี่เจ็ดคม เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "STONE_HEART",
        "DEFENSE_SURGE"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_024",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "NW_MAT_012",
          "count": 1
        },
        {
          "matId": "NW_MAT_013",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "NW_MAT_012": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_024",
        "name": "โอสถทิพย์หญ้ากระบี่เจ็ดคม (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 3,
        "min": 41,
        "inputs": [
          {
            "matId": "NW_MAT_012",
            "count": 2
          },
          {
            "matId": "NW_MAT_013",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_024",
        "effect": {
          "foundationBonus": 13,
          "cultivationProgress": 18,
          "tribulationResist": 12,
          "lifespanBonus": 0,
          "toxicity": 1,
          "heal": 36,
          "pain": 20,
          "progress": 22,
          "cleanse": 18
        },
        "duration": 33
      }
    },
    {
      "id": "MW_EXP_025",
      "name": "โอสถทิพย์รากบัวเจ็ดรูทะลวงป (สูตรค้นคว้าประยุกต์)",
      "parentRecipeId": "L14_remedy",
      "linkedCatalogRecipeId": "MW_REC_074",
      "workshop": "alchemy",
      "discipline": "ALCHEMY",
      "tier": 3,
      "min": 46,
      "hypothesisTh": "สมมติฐานการผสานคุณสมบัติของ รากบัวเจ็ดรูทะลวงปราณ เข้ากับตัวเร่งปราณเพื่อยกระดับความบริสุทธิ์",
      "requiredPropertyTags": [
        "NIRVANA_SPARK",
        "REBIRTH_HEAL"
      ],
      "optionalCatalystMatId": "MAT_MW_ORGAN_025",
      "optionalCatalystBonusChance": 0.18,
      "poisonous": false,
      "trialInputs": [
        {
          "matId": "NW_MAT_044",
          "count": 1
        },
        {
          "matId": "NW_MAT_047",
          "count": 1
        }
      ],
      "supportedAlternatives": {
        "NW_MAT_044": [
          "MAT_HERB_DEW_GRASS_1"
        ]
      },
      "recipe": {
        "id": "MW_EXP_025",
        "name": "โอสถทิพย์รากบัวเจ็ดรูทะลวงป (สูตรค้นคว้าประยุกต์)",
        "workshop": "alchemy",
        "discipline": "ALCHEMY",
        "tier": 3,
        "min": 41,
        "inputs": [
          {
            "matId": "NW_MAT_044",
            "count": 2
          },
          {
            "matId": "NW_MAT_047",
            "count": 1
          }
        ],
        "optionalCatalystMatId": "MAT_MW_ORGAN_025",
        "effect": {
          "heartDemonRelief": 33,
          "griefRelief": 25,
          "daoComprehensionBonus": 9,
          "toxicityRelief": 23,
          "toxicity": 0,
          "heal": 36,
          "pain": 20,
          "progress": 14,
          "cleanse": 18
        },
        "duration": 33
      }
    }
  ],
  "explorationEvents": [
    {
      "id": "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP",
      "nameTh": "ร่องรอยค่ายพักแรมของผู้สำรวจรุ่นก่อน",
      "category": "TRACE_DISCOVERY",
      "weight": 18,
      "descTh": "พบเต็นท์ผ้าไหมที่ขาดวิ่นและกองไฟที่มอดดับไปนานแล้ว ข้างใต้ก้อนหินมีสมุดบันทึกเปื้อนโคลนและห่อวัตถุดิบที่ซ่อนไว้",
      "choices": [
        {
          "id": "STUDY_LOG",
          "labelTh": "ตรวจค้นสมุดบันทึกและแกะรอยเส้นทางอย่างรอบคอบ",
          "traitBias": {
            "curiosity": 0.4,
            "caution": 0.3
          },
          "outcome": "GAIN_FRAGMENT_AND_RUMOR"
        },
        {
          "id": "SALVAGE_CACHE",
          "labelTh": "รื้อค้นห่อสัมภาระที่ถูกฝังไว้ใต้กองไฟ",
          "traitBias": {
            "ambition": 0.3,
            "wealthResource": 0.4
          },
          "outcome": "GAIN_MATERIALS"
        },
        {
          "id": "BURY_REMAINS",
          "labelTh": "ทำพิธีกลบฝังร่องรอยและคารวะดวงวิญญาณผู้ล่วงลับ",
          "traitBias": {
            "empathy": 0.4,
            "integrity": 0.4
          },
          "outcome": "GAIN_DAO_INSIGHT_AND_KARMA"
        }
      ]
    },
    {
      "id": "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF",
      "nameTh": "เผชิญหน้าผู้ฝึกตนต่างสำนักหน้าแหล่งสมบัติ",
      "category": "RIVAL_ENCOUNTER",
      "weight": 15,
      "descTh": "นักพรตพเนจรและศิษย์ต่างสำนักกำลังยืนคุมเชิงกันหน้ากอสมุนไพรวิญญาณที่เพิ่งสุกงอม",
      "choices": [
        {
          "id": "PARLEY_SHARE",
          "labelTh": "เสนอแบ่งปันตามสัดส่วนและแลกเปลี่ยนข่าวสาร",
          "traitBias": {
            "empathy": 0.3,
            "rationality": 0.4
          },
          "outcome": "SHARED_REWARD"
        },
        {
          "id": "INTIMIDATE_RIVAL",
          "labelTh": "แผ่ปราณข่มขวัญให้ถอยไปโดยไม่เสียเลือดเนื้อ",
          "traitBias": {
            "ambition": 0.4,
            "courage": 0.3
          },
          "outcome": "CONTEST_POWER"
        },
        {
          "id": "WAIT_IN_AMBUSH",
          "labelTh": "ซ่อนตัวสังเกตการณ์รอจังหวะเก็บเกี่ยวภายหลัง",
          "traitBias": {
            "caution": 0.4,
            "cunning": 0.3
          },
          "outcome": "STEALTH_HARVEST"
        }
      ]
    },
    {
      "id": "MW_EVT_03_MIGRATING_BEAST_HERD",
      "nameTh": "ขบวนอพยพของฝูงสัตว์อสูรตามฤดูกาล",
      "category": "ECOLOGY_EVENT",
      "weight": 16,
      "descTh": "ฝูงสัตว์อสูรนับสิบตัวกำลังเคลื่อนขบวนผ่านหุบเขา ทิ้งทั้งขน เขาที่ผลัดตก และร่องรอยสมุนไพรที่ถูกขุดคุ้ย",
      "choices": [
        {
          "id": "OBSERVE_GAIT",
          "labelTh": "เฝ้าสังเกตท่วงท่าการโคจรปราณของจ่าฝูง",
          "traitBias": {
            "curiosity": 0.4,
            "composure": 0.3
          },
          "outcome": "GAIN_DAO_INSIGHT_AND_SHED"
        },
        {
          "id": "COLLECT_SHED",
          "labelTh": "เดินตามเก็บชิ้นส่วนที่ผลัดร่วงตามทางอย่างเงียบเชียบ",
          "traitBias": {
            "caution": 0.4,
            "discipline": 0.3
          },
          "outcome": "SAFE_SHED_HARVEST"
        },
        {
          "id": "HUNT_STRAGGLER",
          "labelTh": "จู่โจมตัวที่รั้งท้ายขบวนอย่างรวดเร็ว",
          "traitBias": {
            "aggression": 0.4,
            "courage": 0.4
          },
          "outcome": "COMBAT_STRAGGLER"
        }
      ]
    },
    {
      "id": "MW_EVT_04_WOUNDED_GUARDIAN_BEAST",
      "nameTh": "อสูรผู้พิทักษ์บาดเจ็บสาหัสริมตาน้ำ",
      "category": "MORAL_CHOICE",
      "weight": 14,
      "descTh": "พบสัตว์อสูรระดับสูงนอนหอบหายใจรวยรินจากพิษธาตุไฟเข้าแทรก ข้างกายของมันมีผลึกปราณและสมุนไพรล้ำค่า",
      "choices": [
        {
          "id": "TREAT_BEAST",
          "labelTh": "สละสมุนไพรและปราณช่วยถอนพิษรักษาบาดแผล",
          "traitBias": {
            "empathy": 0.5,
            "integrity": 0.3
          },
          "outcome": "GIFT_RARE_ORGAN_OR_SCROLL"
        },
        {
          "id": "STRIKE_WEAKENED",
          "labelTh": "ฉวยโอกาสลงมือสังหารเพื่อชิงแก่นอสูร",
          "traitBias": {
            "ambition": 0.4,
            "aggression": 0.4
          },
          "outcome": "DESPERATE_BEAST_COMBAT"
        },
        {
          "id": "SLIP_PAST",
          "labelTh": "เลี่ยงเดินอ้อมไปเก็บเฉพาะวัตถุดิบรอบนอก",
          "traitBias": {
            "caution": 0.5
          },
          "outcome": "SAFE_MINOR_LOOT"
        }
      ]
    },
    {
      "id": "MW_EVT_05_UNSTABLE_SPATIAL_RIFT",
      "nameTh": "รอยแยกมิติปั่นป่วนและสิ่งของต่างภพ",
      "category": "ANOMALY",
      "weight": 12,
      "descTh": "อากาศเบื้องหน้าบิดเบี้ยวเป็นวังวนสีเงินม่วง มีเศษศิลาจารึกและวัตถุดิบจากภูมิประเทศอื่นหลุดลอยออกมา",
      "choices": [
        {
          "id": "ANCHOR_AND_REACH",
          "labelTh": "โคจรปราณคุ้มกายยื่นมือคว้าสมบัติจากรอยแยก",
          "traitBias": {
            "courage": 0.4,
            "curiosity": 0.4
          },
          "outcome": "ANOMALY_TREASURE_OR_SHOCK"
        },
        {
          "id": "COMPREHEND_VOID",
          "labelTh": "นั่งสมาธิเพ่งมองกฎเกณฑ์มิติอยู่ห่างๆ",
          "traitBias": {
            "composure": 0.4,
            "rationality": 0.4
          },
          "outcome": "VOID_DAO_INSIGHT"
        },
        {
          "id": "RETREAT_SAFE",
          "labelTh": "ถอยห่างก่อนที่รอยแยกจะระเบิดออก",
          "traitBias": {
            "caution": 0.5
          },
          "outcome": "AVOID_HAZARD"
        }
      ]
    },
    {
      "id": "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO",
      "nameTh": "ถ้ำหลอมโอสถร้างและเตาสำริดที่ยังอุ่น",
      "category": "KNOWLEDGE_SITE",
      "weight": 15,
      "descTh": "พบถ้ำลับของนักปรุงยาโบราณ ภายในมีเตาสำริดที่ปิดผนึกไว้และแผ่นไม้ไผ่บันทึกสูตรยาที่ขาดหายไปครึ่งหนึ่ง",
      "choices": [
        {
          "id": "OPEN_FURNACE",
          "labelTh": "แก้ผนึกเตาสำริดเพื่อเก็บโอสถและเถ้าปราณ",
          "traitBias": {
            "curiosity": 0.4,
            "ambition": 0.3
          },
          "outcome": "GAIN_PILL_AND_ASH"
        },
        {
          "id": "TRANSCRIBE_BAMBOO",
          "labelTh": "คัดลอกบันทึกไม้ไผ่และรวบรวมสมุนไพรแห้งบนชั้นวาง",
          "traitBias": {
            "knowledgeCraft": 0.5,
            "discipline": 0.3
          },
          "outcome": "GAIN_RECIPE_SCROLL"
        },
        {
          "id": "COLLECT_UTENSILS",
          "labelTh": "เก็บกู้แร่และวัสดุทนไฟรอบเตาหลอม",
          "traitBias": {
            "wealthResource": 0.4
          },
          "outcome": "GAIN_FORGE_MATS"
        }
      ]
    },
    {
      "id": "MW_EVT_07_HIDDEN_MASTER_MURAL",
      "nameTh": "ภาพจิตรกรรมฝาผนังและจิตตกค้างของปรมาจารย์",
      "category": "INHERITANCE",
      "weight": 13,
      "descTh": "บนผนังผาศิลาในส่วนลึกมีภาพวาดท่วงท่าการเดินปราณที่เหมือนมีชีวิต เมื่อจ้องมองจะเกิดเสียงชี้แนะดังขึ้นในทะเลจิต",
      "choices": [
        {
          "id": "IMMERSE_MIND",
          "labelTh": "ปล่อยจิตเข้าสู่นิมิตของภาพวาดเพื่อรับการถ่ายทอด",
          "traitBias": {
            "curiosity": 0.4,
            "composure": 0.4
          },
          "outcome": "GAIN_MANUAL_OR_FOUNDATION"
        },
        {
          "id": "COPY_STROKES",
          "labelTh": "วาดคัดลอกเส้นสายลงบนม้วนกระดาษเพื่อนำกลับไปศึกษา",
          "traitBias": {
            "discipline": 0.4,
            "caution": 0.3
          },
          "outcome": "GAIN_FRAGMENT_SCROLL"
        },
        {
          "id": "SCRAPE_PIGMENT",
          "labelTh": "ขูดเก็บผงแร่และหมึกวิญญาณโบราณจากขอบผนัง",
          "traitBias": {
            "wealthResource": 0.4
          },
          "outcome": "GAIN_TALISMAN_INK"
        }
      ]
    },
    {
      "id": "MW_EVT_08_CONTESTED_ANCIENT_CORPSE",
      "nameTh": "ซากอสูรบรรพกาลที่เพิ่งสิ้นใจและผู้มาเยือน",
      "category": "HARVEST_EVENT",
      "weight": 15,
      "descTh": "พบซากสัตว์อสูรระดับสูงที่เพิ่งตายจากการต่อสู้กันเอง ปราณในซากยังสมบูรณ์แต่กลิ่นเลือดกำลังดึงดูดนักล่าตัวอื่นเข้ามา",
      "choices": [
        {
          "id": "PRECISION_DISSECT",
          "labelTh": "ใช้มีดผ่าเส้นประสาทเก็บกู้อวัยวะพิเศษภายในเวลาจำกัด",
          "traitBias": {
            "discipline": 0.4,
            "courage": 0.3
          },
          "outcome": "RARE_ORGAN_HARVEST"
        },
        {
          "id": "QUICK_CLEAVE",
          "labelTh": "รีบตัดเอาเฉพาะชิ้นส่วนภายนอกแล้วถอนตัวทันที",
          "traitBias": {
            "caution": 0.4
          },
          "outcome": "FAST_SAFE_PARTS"
        },
        {
          "id": "BAIT_PREDATOR",
          "labelTh": "ใช้ซากอสูรเป็นเหยื่อล่อเพื่อดักซุ่มโจมตีผู้ล่าตัวถัดไป",
          "traitBias": {
            "aggression": 0.4,
            "ambition": 0.4
          },
          "outcome": "APEX_AMBUSH_COMBAT"
        }
      ]
    },
    {
      "id": "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
      "nameTh": "ตาน้ำพึ่งพาอาศัยระหว่างอสูรและพืชทิพย์",
      "category": "ECOLOGY_EVENT",
      "weight": 16,
      "descTh": "สัตว์อสูรกำลังคายปราณหล่อเลี้ยงรากสมุนไพรหายากริมตาน้ำ หากทำลายฝ่ายใดฝ่ายหนึ่ง อีกฝ่ายจะเหี่ยวเฉาลงทันที",
      "choices": [
        {
          "id": "HARMONIOUS_GATHER",
          "labelTh": "เก็บเฉพาะใบและน้ำค้างส่วนเกินโดยไม่กระทบระบบนิเวศ",
          "traitBias": {
            "empathy": 0.4,
            "discipline": 0.4
          },
          "outcome": "HIGH_QUALITY_HERB_AND_BLESSING"
        },
        {
          "id": "FORCE_UPROOT",
          "labelTh": "บุกชิงถอนรากสมุนไพรและสังหารอสูรเฝ้าตาน้ำ",
          "traitBias": {
            "ambition": 0.4,
            "aggression": 0.4
          },
          "outcome": "COMBAT_AND_RAW_LOOT"
        },
        {
          "id": "MEDITATE_BY_SPRING",
          "labelTh": "นั่งเดินลมปราณซึมซับไอทิพย์ริมตาน้ำ",
          "traitBias": {
            "composure": 0.4
          },
          "outcome": "HEAL_AND_QI_RESTORE"
        }
      ]
    },
    {
      "id": "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
      "nameTh": "สุสานศาสตราโบราณสั่นพ้องตอบรับปราณ",
      "category": "KNOWLEDGE_SITE",
      "weight": 14,
      "descTh": "ศาสตราที่ปักอยู่ตามเนินดินส่งเสียงร้องกังวานพร้อมกัน เผยให้เห็นแผ่นป้ายหลุมศพของช่างหลอมในตำนาน",
      "choices": [
        {
          "id": "COMPREHEND_FORGE_STELA",
          "labelTh": "เพ่งจิตอ่านป้ายหลุมศพเพื่อเรียนรู้เคล็ดการตีเหล็ก",
          "traitBias": {
            "knowledgeCraft": 0.5
          },
          "outcome": "GAIN_FORGE_RECIPE"
        },
        {
          "id": "DRAW_RESONANT_BLADE",
          "labelTh": "ทดลองดึงศาสตราที่ยังไม่ผุพังขึ้นมาจากเนินดิน",
          "traitBias": {
            "courage": 0.4,
            "ambition": 0.4
          },
          "outcome": "GAIN_RELIC_OR_SWORD_QI_CUT"
        },
        {
          "id": "GATHER_SWORD_RUST",
          "labelTh": "เก็บรวบรวมผงสนิมเซียนและแร่เหล็กหนามรอบสุสาน",
          "traitBias": {
            "caution": 0.4
          },
          "outcome": "GAIN_ORE_MATS"
        }
      ]
    },
    {
      "id": "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
      "nameTh": "ช่วงเวลาลอกคราบของอสูรผลึกโบราณ",
      "category": "ECOLOGY_EVENT",
      "weight": 15,
      "descTh": "พบสัตว์อสูรกำลังลอกคราบเปลือกผลึกเก่าออกในโพรงถ้ำ ช่วงเวลานี้มันอ่อนแอลงแต่คราบที่ลอกออกมานั้นสมบูรณ์ไร้รอยขีดข่วน",
      "choices": [
        {
          "id": "WAIT_FOR_MOLT",
          "labelTh": "ซ่อนตัวรอจนมันลอกคราบเสร็จและจากไป แล้วจึงเก็บคราบสมบูรณ์",
          "traitBias": {
            "caution": 0.4,
            "discipline": 0.4
          },
          "outcome": "PERFECT_MOLT_HARVEST"
        },
        {
          "id": "GUARD_MOLTING",
          "labelTh": "ช่วยคุ้มกันไม่ให้อสูรอื่นเข้ามาทำร้ายมันระหว่างลอกคราบ",
          "traitBias": {
            "empathy": 0.4,
            "courage": 0.3
          },
          "outcome": "GIFT_CORE_AND_MOLT"
        },
        {
          "id": "ATTACK_VULNERABLE",
          "labelTh": "จู่โจมขณะที่เกราะใหม่ยังไม่แข็งตัว",
          "traitBias": {
            "aggression": 0.4
          },
          "outcome": "EASY_KILL_DAMAGED_SHELL"
        }
      ]
    },
    {
      "id": "MW_EVT_12_POISON_MIASMA_TIDE",
      "nameTh": "กระแสหมอกพิษเจ็ดสีไหลบ่า",
      "category": "HAZARD_EVENT",
      "weight": 14,
      "descTh": "หมอกพิษความเข้มข้นสูงพัดทะลักขึ้นมาจากรอยแยกใต้ดิน พร้อมกับแมลงกู่และเห็ดทิพย์ที่บานรับไอพิษ",
      "choices": [
        {
          "id": "FILTER_AND_COLLECT",
          "labelTh": "ใช้ปราณปิดกั้นลมหายใจแล้วรีบเก็บเห็ดพิษและแมลงกู่",
          "traitBias": {
            "courage": 0.4,
            "curiosity": 0.3
          },
          "outcome": "VENOM_HARVEST_WITH_RISK"
        },
        {
          "id": "CLIMB_HIGH_GROUND",
          "labelTh": "รีบขึ้นที่สูงเพื่อหลบหมอกพิษและสำรวจเส้นทางจากมุมสูง",
          "traitBias": {
            "caution": 0.5
          },
          "outcome": "SAFE_SCOUT_MAP"
        },
        {
          "id": "ABSORB_WITH_DEMON_ART",
          "labelTh": "โคจรเคล็ดวิชาดูดซับไอพิษมาขัดเกลาเส้นชีพจร",
          "traitBias": {
            "ambition": 0.4
          },
          "outcome": "TOXIN_TEMPER_OR_POISON"
        }
      ]
    },
    {
      "id": "MW_EVT_13_FALLING_STAR_FRAGMENT",
      "nameTh": "สะเก็ดดาวตกร่วงหล่นสดใหม่",
      "category": "TREASURE_EVENT",
      "weight": 12,
      "descTh": "ลูกไฟสีม่วงทองพุ่งแหวกอากาศตกลงกระแทกพื้นห่างออกไปไม่ไกล ทิ้งก้อนแร่อุกกาบาตที่ยังร้อนระอุและแผ่คลื่นดารา",
      "choices": [
        {
          "id": "QUENCH_AND_MINE",
          "labelTh": "ใช้น้ำปราณลดความร้อนแล้วสกัดแกนแร่ดาราทันที",
          "traitBias": {
            "discipline": 0.4,
            "wealthResource": 0.4
          },
          "outcome": "HIGH_TIER_STAR_ORE"
        },
        {
          "id": "ABSORB_STARLIGHT",
          "labelTh": "นั่งขัดสมาธิรับรังสีดาราแรกกำเนิดก่อนที่มันจะสลาย",
          "traitBias": {
            "martialPeak": 0.4
          },
          "outcome": "BODY_AND_QI_BOOST"
        },
        {
          "id": "WATCH_FOR_BEASTS",
          "labelTh": "ตั้งค่ายกลดักรอสัตว์อสูรที่ถูกแสงดาวดึงดูดมา",
          "traitBias": {
            "caution": 0.3,
            "courage": 0.3
          },
          "outcome": "STAR_BEAST_HUNT"
        }
      ]
    },
    {
      "id": "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
      "nameTh": "ศาลาปราชญ์เร้นลับและกระดานหมากรุกค่ายกล",
      "category": "INHERITANCE",
      "weight": 13,
      "descTh": "กลางหมอกทึบปรากฏศาลาหินโบราณ บนโต๊ะมีกระดานหมากรุกหยกที่วางหมากค้างไว้พร้อมม้วนตำราค่ายกล",
      "choices": [
        {
          "id": "SOLVE_ENDGAME",
          "labelTh": "ใช้ปัญญาขบคิดวางหมากแก้กลศึกบนกระดานหยก",
          "traitBias": {
            "rationality": 0.5,
            "knowledgeCraft": 0.4
          },
          "outcome": "UNLOCK_PAVILION_SCROLL"
        },
        {
          "id": "PAY_RESPECT_INCENSE",
          "labelTh": "จุดธูปคารวะเจ้าของศาลาแล้วขอคัดลอกเฉพาะตำราพื้นฐาน",
          "traitBias": {
            "integrity": 0.4,
            "caution": 0.3
          },
          "outcome": "SAFE_RECIPE_FRAGMENT"
        },
        {
          "id": "FORCE_ARRAY_LOCK",
          "labelTh": "ใช้กำลังภายในกระแทกทำลายม่านพลังคุ้มกันโต๊ะหยก",
          "traitBias": {
            "aggression": 0.4
          },
          "outcome": "BACKLASH_OR_LOOT"
        }
      ]
    },
    {
      "id": "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
      "nameTh": "น้ำพุร้อนใต้พิภพปะทุพัดพาแร่และน้ำทิพย์",
      "category": "RESOURCE_EVENT",
      "weight": 15,
      "descTh": "ปล่องน้ำพุร้อนปะทุเป็นจังหวะ พัดพาทั้งผลึกแร่จากแก่นโลกและน้ำอมฤตขึ้นมาค้างตามแอ่งหินชั้นบน",
      "choices": [
        {
          "id": "TIME_THE_ERUPTION",
          "labelTh": "คำนวณจังหวะการปะทุแล้วพุ่งเข้าไปเก็บน้ำทิพย์และผลึก",
          "traitBias": {
            "discipline": 0.4,
            "courage": 0.3
          },
          "outcome": "GAIN_LIQUID_AND_CRYSTAL"
        },
        {
          "id": "TEMPER_WEAPON_IN_VENT",
          "labelTh": "นำศาสตราประจำตัวไปชุบในไอร้อนปราณธรณี",
          "traitBias": {
            "martialPeak": 0.4
          },
          "outcome": "BUFF_WEAPON_DURABILITY"
        },
        {
          "id": "COLLECT_OUTER_SALTS",
          "labelTh": "เก็บเกลือแร่และเถ้าภูเขาไฟรอบนอกอย่างปลอดภัย",
          "traitBias": {
            "caution": 0.5
          },
          "outcome": "SAFE_MINERAL_SALTS"
        }
      ]
    },
    {
      "id": "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
      "nameTh": "โพรงไม้บรรพกาลที่ซ่อนคลังสมบัติของอสูร",
      "category": "TREASURE_EVENT",
      "weight": 15,
      "descTh": "ในโพรงของต้นไม้ยักษ์อายุนับพันปีมีทั้งรังผึ้งหยก ยางไม้ทองคำ และหีบสมบัติของผู้ฝึกตนที่ถูกเถาวัลย์พันธนาการไว้",
      "choices": [
        {
          "id": "SMOKE_AND_HARVEST",
          "labelTh": "ใช้ควันสมุนไพรกล่อมแมลงแล้วเก็บยางไม้และหีบสมบัติ",
          "traitBias": {
            "rationality": 0.4,
            "caution": 0.3
          },
          "outcome": "CLEAN_VAULT_HARVEST"
        },
        {
          "id": "LEAVE_OFFERING_SWAP",
          "labelTh": "วางอาหารปราณแลกเปลี่ยนกับของในโพรงไม้",
          "traitBias": {
            "integrity": 0.4,
            "empathy": 0.3
          },
          "outcome": "PEACEFUL_EXCHANGE"
        },
        {
          "id": "SLASH_VINES",
          "labelTh": "ฟันเถาวัลย์ชิงหีบสมบัติออกมาโดยตรง",
          "traitBias": {
            "courage": 0.4
          },
          "outcome": "GUARDIAN_SWARM_FIGHT"
        }
      ]
    },
    {
      "id": "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
      "nameTh": "สายฟ้าฟาดเปิดหน้าดินเผยสายแร่และหน่อไผ่อัสนี",
      "category": "RESOURCE_EVENT",
      "weight": 14,
      "descTh": "อสนีบาตฟาดลงกลางเนินหินจนแยกออก เผยให้เห็นสายแร่ทองแดงอัสนีและหน่อไผ่ทองคำที่เพิ่งแตกหน่อรับสายฟ้า",
      "choices": [
        {
          "id": "HARVEST_UNDER_LIGHTNING",
          "labelTh": "ฝ่าประจุสายฟ้าเข้าไปขุดหน่อไผ่และแร่สดใหม่",
          "traitBias": {
            "courage": 0.5,
            "ambition": 0.3
          },
          "outcome": "THUNDER_BOUNTY"
        },
        {
          "id": "SET_LIGHTNING_TALISMAN",
          "labelTh": "วางกระดาษยันต์และแร่แม่เหล็กเพื่อดูดซับปราณสายฟ้า",
          "traitBias": {
            "knowledgeCraft": 0.4
          },
          "outcome": "CRAFT_THUNDER_MEDIA"
        },
        {
          "id": "WAIT_FOR_STORM_END",
          "labelTh": "รอให้ประจุไฟฟ้าสลายตัวก่อนจึงค่อยเก็บแร่ที่เหลือ",
          "traitBias": {
            "caution": 0.4
          },
          "outcome": "SAFE_THUNDER_ORE"
        }
      ]
    },
    {
      "id": "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL",
      "nameTh": "ด่านทดสอบกระจกใจกลางทะเลสาบวิญญาณ",
      "category": "INHERITANCE",
      "weight": 13,
      "descTh": "หมอกเหนือทะเลสาบก่อตัวเป็นเงาสะท้อนของตัวผู้สำรวจเอง หากเอาชนะหรือประสานใจกับเงาสะท้อนได้ จะพบมรดกใต้น้ำ",
      "choices": [
        {
          "id": "CONFRONT_SHADOW_SELF",
          "labelTh": "ประลองกระบวนท่ากับเงาสะท้อนเพื่อขัดเกลาวิชา",
          "traitBias": {
            "martialPeak": 0.5,
            "courage": 0.4
          },
          "outcome": "MASTERY_AND_RELIC"
        },
        {
          "id": "EMBRACE_ZEN_CLARITY",
          "labelTh": "สงบจิตยอมรับจุดอ่อนของตนเองจนเงาสะท้อนสลายเป็นดอกบัว",
          "traitBias": {
            "composure": 0.5,
            "empathy": 0.3
          },
          "outcome": "PURIFY_DEMON_AND_LOTUS"
        },
        {
          "id": "SHATTER_WATER_SURFACE",
          "labelTh": "ซัดฝ่ามือทำลายผิวน้ำแล้วงมเก็บไข่มุกริมตลิ่ง",
          "traitBias": {
            "aggression": 0.3
          },
          "outcome": "MINOR_PEARL_LOOT"
        }
      ]
    },
    {
      "id": "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
      "nameTh": "ซากกองคาราวานโบราณที่โผล่พ้นเนินทราย",
      "category": "TRACE_DISCOVERY",
      "weight": 15,
      "descTh": "พายุทรายพัดเปิดเนินทรายสูง เผยให้เห็นเกวียนบรรทุกแร่และกล่องหยกของหอการค้ายุคโบราณที่จมอยู่ใต้ทราย",
      "choices": [
        {
          "id": "EXCAVATE_JADE_BOXES",
          "labelTh": "ขุดกู้กล่องหยกที่ผนึกตำรับและสมุนไพรแห้งไว้",
          "traitBias": {
            "curiosity": 0.4,
            "knowledgeCraft": 0.4
          },
          "outcome": "GAIN_RECIPE_AND_HERBS"
        },
        {
          "id": "LOAD_ORE_INGOTS",
          "labelTh": "ขนแท่งแร่โลหะและศิลาปราณจากเกวียน",
          "traitBias": {
            "wealthResource": 0.5
          },
          "outcome": "GAIN_ORES_AND_STONES"
        },
        {
          "id": "SEARCH_GUARD_REMAINS",
          "labelTh": "ตรวจค้นศาสตราและบันทึกของผู้คุ้มกันคาราวาน",
          "traitBias": {
            "courage": 0.3
          },
          "outcome": "GAIN_EQUIPMENT_OR_MANUAL"
        }
      ]
    },
    {
      "id": "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM",
      "nameTh": "การผลิบานของดงเห็ดถั่งเช่าปรสิตหมื่นปี",
      "category": "ECOLOGY_EVENT",
      "weight": 14,
      "descTh": "พบสุสานแมลงอสูรที่กลายเป็นแปลงเห็ดถั่งเช่าทองคำและหลินจือม่วง แต่ละอองสปอร์รอบพื้นที่มีฤทธิ์สะกดประสาท",
      "choices": [
        {
          "id": "CAREFUL_MYCOLOGY_HARVEST",
          "labelTh": "ใช้ความรู้สมุนไพรแยกเก็บเห็ดทิพย์และแก่นปรสิต",
          "traitBias": {
            "knowledgeCraft": 0.4,
            "discipline": 0.4
          },
          "outcome": "RARE_FUNGUS_AND_ORGAN"
        },
        {
          "id": "BURN_SPORES_FIRST",
          "labelTh": "ใช้ปราณเพลิงเผาทำลายหมอกสปอร์ก่อนเข้าเก็บเกี่ยว",
          "traitBias": {
            "caution": 0.4
          },
          "outcome": "SAFE_REDUCED_FUNGUS"
        },
        {
          "id": "CAPTURE_LIVE_GU_HOST",
          "labelTh": "จับตัวอ่อนแมลงกู่ที่ยังสมบูรณ์ใส่ขวดหยก",
          "traitBias": {
            "ambition": 0.4
          },
          "outcome": "GAIN_VENOM_GU_MATS"
        }
      ]
    },
    {
      "id": "MW_EVT_21_ABYSSAL_PEARL_ALTAR",
      "nameTh": "แท่นบูชามุกสมุทรและจารึกเผ่าพันธุ์ใต้น้ำ",
      "category": "INHERITANCE",
      "weight": 13,
      "descTh": "พบแท่นหินปะการังโบราณที่มีไข่มุกเรืองแสงวางอยู่เป็นค่ายกล รอบแท่นสลักเคล็ดวิชาควบคุมกระแสน้ำและแรงดัน",
      "choices": [
        {
          "id": "DECIPHER_CORAL_SCRIPT",
          "labelTh": "ถอดความอักขระบนปะการังเพื่อบันทึกเคล็ดวิชาและตำรับ",
          "traitBias": {
            "knowledgeCraft": 0.5
          },
          "outcome": "GAIN_SCROLL_AND_INSIGHT"
        },
        {
          "id": "EXTRACT_ALTAR_PEARL",
          "labelTh": "ปลดไข่มุกแกนกลางออกจากแท่นบูชาอย่างระมัดระวัง",
          "traitBias": {
            "wealthResource": 0.4,
            "dexterity": 0.4
          },
          "outcome": "GAIN_ABYSS_PEARL"
        },
        {
          "id": "OFFER_SPIRIT_STONES",
          "labelTh": "วางศิลาปราณเติมพลังให้แท่นบูชาเพื่อรับน้ำอมฤต",
          "traitBias": {
            "integrity": 0.4
          },
          "outcome": "GAIN_SPIRIT_LIQUID"
        }
      ]
    },
    {
      "id": "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER",
      "nameTh": "ร่างผู้บำเพ็ญโบราณที่ถูกแช่แข็งในกำแพงน้ำแข็ง",
      "category": "INHERITANCE",
      "weight": 12,
      "descTh": "ภายในผนังน้ำแข็งใสราวกระจกมีร่างของผู้ฝึกตนยุคโบราณนั่งประสานมืออยู่ ในอกเสื้อมีม้วนหยกและถุงเฉียนคุน",
      "choices": [
        {
          "id": "MELT_ICE_GENTLY",
          "labelTh": "ค่อยๆ ใช้ปราณละลายน้ำแข็งเพื่อนำม้วนหยกออกมาโดยไม่ทำลายศพ",
          "traitBias": {
            "integrity": 0.4,
            "discipline": 0.4
          },
          "outcome": "GAIN_COMPLETE_INHERITANCE"
        },
        {
          "id": "SHATTER_GLACIER_WALL",
          "labelTh": "ทุบกำแพงน้ำแข็งชิงถุงสัมภาระและผลึกน้ำแข็งดำ",
          "traitBias": {
            "ambition": 0.4
          },
          "outcome": "GAIN_MATS_AND_DAMAGED_SCROLL"
        },
        {
          "id": "MEDITATE_ON_POSTURE",
          "labelTh": "เพ่งศึกษามุทราและเส้นทางปราณที่แข็งค้างอยู่ในร่างนั้น",
          "traitBias": {
            "curiosity": 0.4,
            "composure": 0.4
          },
          "outcome": "GAIN_ROUTE_INSIGHT"
        }
      ]
    },
    {
      "id": "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE",
      "nameTh": "ศาลเจ้าสายลมบนสะพานหินเสียดฟ้า",
      "category": "KNOWLEDGE_SITE",
      "weight": 14,
      "descTh": "บนสะพานหินธรรมชาติแคบชันเหนือหุบเหวมีศาลไม้โบราณที่มีกระดิ่งลมหยกห้อยอยู่ เสียงกระดิ่งสอดคล้องกับจังหวะวิชาตัวเบา",
      "choices": [
        {
          "id": "LISTEN_WIND_CHIMES",
          "labelTh": "หลับตาฟังเสียงกระดิ่งลมเพื่อทำความเข้าใจเคล็ดวิชาตัวเบา",
          "traitBias": {
            "curiosity": 0.4,
            "composure": 0.3
          },
          "outcome": "GAIN_LIGHTNESS_INSIGHT"
        },
        {
          "id": "SEARCH_SHRINE_DRAWER",
          "labelTh": "เปิดลิ้นชักใต้แท่นบูชาเพื่อหาคัมภีร์และยันต์ที่ผู้คนถวายไว้",
          "traitBias": {
            "wealthResource": 0.3,
            "curiosity": 0.3
          },
          "outcome": "GAIN_TALISMAN_OR_RECIPE"
        },
        {
          "id": "REPAIR_SHRINE_ROOF",
          "labelTh": "ใช้ไม้และหินซ่อมแซมศาลเจ้าที่ผุพัง",
          "traitBias": {
            "integrity": 0.4,
            "empathy": 0.4
          },
          "outcome": "GAIN_FORTUNE_KARMA_AND_HERB"
        }
      ]
    },
    {
      "id": "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET",
      "nameTh": "สวนมิติย่อยที่เวลาไหลเหลื่อมล้ำ",
      "category": "ANOMALY",
      "weight": 10,
      "descTh": "ก้าวผ่านม่านหมอกสุญตาเข้าไปพบสวนขนาดเล็กที่สมุนไพรเติบโตและร่วงโรยในเวลาเพียงไม่กี่ลมหายใจ",
      "choices": [
        {
          "id": "PLUCK_AT_PEAK_BLOOM",
          "labelTh": "จับจังหวะเก็บเกี่ยวสมุนไพรและผลไม้ทิพย์ในเสี้ยววินาทีที่สุกเต็มที่",
          "traitBias": {
            "attention": 0.5,
            "dexterity": 0.4
          },
          "outcome": "TRANSCENDENT_HERB_HARVEST"
        },
        {
          "id": "COLLECT_TIME_DEW",
          "labelTh": "ใช้ขวดหยกรองรับหยดน้ำค้างกาลเวลาและแก่นสุญตา",
          "traitBias": {
            "knowledgeCraft": 0.4,
            "caution": 0.4
          },
          "outcome": "GAIN_TIME_DEW_AND_CRYSTAL"
        },
        {
          "id": "CULTIVATE_IN_POCKET",
          "labelTh": "เร่งเดินลมปราณใช้ประโยชน์จากกระแสเวลาในสวนมิติ",
          "traitBias": {
            "martialPeak": 0.5
          },
          "outcome": "MASSIVE_CULTIVATION_GAIN"
        }
      ]
    }
  ],
  "pools": [
    {
      "id": "MW_POOL_01_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "environmentNameTh": "พงไพรบรรพกาลเร้นเมฆา",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "พงไพรบรรพกาลเร้นเมฆา · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 26,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_001",
        "MW_BEAST_004",
        "MW_BEAST_007",
        "BEAST_IRON_BOAR",
        "BEAST_YIN_SHADOW_BAT_3",
        "NW_BEAST_017",
        "NW_BEAST_047",
        "NW_BEAST_064",
        "NW_BEAST_068",
        "NW_BEAST_072",
        "NW_BEAST_080",
        "BEAST_CLOUD_ANTLER_DEER"
      ],
      "resourceEntries": [
        "MAT_HERB_MIST_ORCHID_2",
        "MAT_FORM_SOUL_WOOD_PILLAR_4",
        "NW_MAT_045",
        "NW_MAT_144",
        "MW_MAT_HERB_013",
        "MW_MAT_EXO_103"
      ],
      "recipeManuscripts": [
        "MW_REC_001",
        "MW_REC_019",
        "MW_REC_037",
        "MW_REC_055",
        "MW_REC_073",
        "MW_REC_091"
      ],
      "eventIds": [
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP",
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO",
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_001",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตพงไพรบรรพกาลเร้นเมฆา"
    },
    {
      "id": "MW_POOL_01_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "environmentNameTh": "พงไพรบรรพกาลเร้นเมฆา",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "พงไพรบรรพกาลเร้นเมฆา · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 32,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_002",
        "MW_BEAST_005",
        "MW_BEAST_008",
        "BEAST_MIST_JADE_STAG",
        "BEAST_ANCIENT_TREANT_SERPENT_4",
        "NW_BEAST_027",
        "NW_BEAST_059",
        "NW_BEAST_065",
        "NW_BEAST_069",
        "NW_BEAST_073",
        "NW_BEAST_082",
        "BEAST_JADE_TIDE_TURTLE"
      ],
      "resourceEntries": [
        "MAT_HERB_DRAGON_GRASS_4",
        "NW_MAT_039",
        "NW_MAT_051",
        "NW_MAT_189",
        "MW_MAT_HERB_022",
        "MW_MAT_BP_142"
      ],
      "recipeManuscripts": [
        "MW_REC_018",
        "MW_REC_036",
        "MW_REC_054",
        "MW_REC_072",
        "MW_REC_090",
        "MW_REC_108"
      ],
      "eventIds": [
        "MW_EVT_03_MIGRATING_BEAST_HERD",
        "MW_EVT_07_HIDDEN_MASTER_MURAL",
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_014",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตพงไพรบรรพกาลเร้นเมฆา"
    },
    {
      "id": "MW_POOL_01_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "environmentNameTh": "พงไพรบรรพกาลเร้นเมฆา",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "พงไพรบรรพกาลเร้นเมฆา · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 38,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_003",
        "MW_BEAST_006",
        "MW_BEAST_009",
        "BEAST_MYTHIC_CELESTIAL_QILIN_SOVEREIGN",
        "NW_BEAST_001",
        "NW_BEAST_033",
        "NW_BEAST_062",
        "NW_BEAST_066",
        "NW_BEAST_070",
        "NW_BEAST_078",
        "NW_BEAST_088",
        "BEAST_SHADOW_PANTHER"
      ],
      "resourceEntries": [
        "MAT_BP_EARTH_CORE_4",
        "NW_MAT_045",
        "NW_MAT_144",
        "NW_MAT_234",
        "MW_MAT_HERB_028"
      ],
      "recipeManuscripts": [
        "MW_REC_017",
        "MW_REC_035",
        "MW_REC_053",
        "MW_REC_071",
        "MW_REC_089",
        "MW_REC_107"
      ],
      "eventIds": [
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT",
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE",
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_027",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตพงไพรบรรพกาลเร้นเมฆา"
    },
    {
      "id": "MW_POOL_01_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "environmentNameTh": "พงไพรบรรพกาลเร้นเมฆา",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "พงไพรบรรพกาลเร้นเมฆา · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 44,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_001",
        "MW_BEAST_004",
        "MW_BEAST_007",
        "BEAST_IRON_BOAR",
        "BEAST_YIN_SHADOW_BAT_3",
        "NW_BEAST_017",
        "NW_BEAST_047",
        "NW_BEAST_064",
        "NW_BEAST_068",
        "NW_BEAST_072",
        "NW_BEAST_080",
        "BEAST_CLOUD_ANTLER_DEER"
      ],
      "resourceEntries": [
        "MAT_BP_MIST_STAG_ANTLER_3",
        "NW_MAT_051",
        "NW_MAT_189",
        "MAT_BP_SHADOW_PANTHER_PELT_3",
        "MW_MAT_HERB_040"
      ],
      "recipeManuscripts": [
        "MW_REC_016",
        "MW_REC_034",
        "MW_REC_052",
        "MW_REC_070",
        "MW_REC_088",
        "MW_REC_106"
      ],
      "eventIds": [
        "MW_EVT_07_HIDDEN_MASTER_MURAL",
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_040",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตพงไพรบรรพกาลเร้นเมฆา"
    },
    {
      "id": "MW_POOL_01_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "environmentNameTh": "พงไพรบรรพกาลเร้นเมฆา",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "พงไพรบรรพกาลเร้นเมฆา · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 50,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_002",
        "MW_BEAST_005",
        "MW_BEAST_008",
        "BEAST_MIST_JADE_STAG",
        "BEAST_ANCIENT_TREANT_SERPENT_4",
        "NW_BEAST_027",
        "NW_BEAST_059",
        "NW_BEAST_065",
        "NW_BEAST_069",
        "NW_BEAST_073",
        "NW_BEAST_082",
        "BEAST_JADE_TIDE_TURTLE"
      ],
      "resourceEntries": [
        "MAT_HERB_MIST_ORCHID_2",
        "MAT_FORM_SOUL_WOOD_PILLAR_4",
        "NW_MAT_144",
        "NW_MAT_234",
        "MW_MAT_HERB_013",
        "MW_MAT_EXO_103"
      ],
      "recipeManuscripts": [
        "MW_REC_015",
        "MW_REC_033",
        "MW_REC_051",
        "MW_REC_069",
        "MW_REC_087",
        "MW_REC_105"
      ],
      "eventIds": [
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_053",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตพงไพรบรรพกาลเร้นเมฆา"
    },
    {
      "id": "MW_POOL_01_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_01_ANCIENT_CANOPY",
      "environmentNameTh": "พงไพรบรรพกาลเร้นเมฆา",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "พงไพรบรรพกาลเร้นเมฆา · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 56,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_003",
        "MW_BEAST_006",
        "MW_BEAST_009",
        "BEAST_MYTHIC_CELESTIAL_QILIN_SOVEREIGN",
        "NW_BEAST_001",
        "NW_BEAST_033",
        "NW_BEAST_062",
        "NW_BEAST_066",
        "NW_BEAST_070",
        "NW_BEAST_078",
        "NW_BEAST_088",
        "BEAST_SHADOW_PANTHER"
      ],
      "resourceEntries": [
        "MAT_HERB_DRAGON_GRASS_4",
        "NW_MAT_039",
        "NW_MAT_189",
        "MAT_BP_SHADOW_PANTHER_PELT_3",
        "MW_MAT_HERB_022",
        "MW_MAT_BP_142"
      ],
      "recipeManuscripts": [
        "MW_REC_014",
        "MW_REC_032",
        "MW_REC_050",
        "MW_REC_068",
        "MW_REC_086",
        "MW_REC_104"
      ],
      "eventIds": [
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_066",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตพงไพรบรรพกาลเร้นเมฆา"
    },
    {
      "id": "MW_POOL_02_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "environmentNameTh": "บึงหมอกพิษโกงกางทมิฬ",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "บึงหมอกพิษโกงกางทมิฬ · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 26,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_010",
        "MW_BEAST_013",
        "MW_BEAST_016",
        "NW_BEAST_056"
      ],
      "resourceEntries": [
        "MAT_HERB_VENOM_VINE_3",
        "NW_MAT_081",
        "NW_MAT_140",
        "NW_MAT_190",
        "NW_MAT_222",
        "MAT_MW_ORGAN_010",
        "MW_MAT_HERB_009",
        "MW_MAT_BP_145",
        "MW_MAT_BP_173"
      ],
      "recipeManuscripts": [
        "MW_REC_013",
        "MW_REC_031",
        "MW_REC_049",
        "MW_REC_067",
        "MW_REC_085",
        "MW_REC_103"
      ],
      "eventIds": [
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF",
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_008",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตบึงหมอกพิษโกงกางทมิฬ"
    },
    {
      "id": "MW_POOL_02_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "environmentNameTh": "บึงหมอกพิษโกงกางทมิฬ",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "บึงหมอกพิษโกงกางทมิฬ · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 32,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_011",
        "MW_BEAST_014",
        "MW_BEAST_017"
      ],
      "resourceEntries": [
        "MAT_BP_PYTHON_GALL_3",
        "NW_MAT_091",
        "NW_MAT_147",
        "NW_MAT_218",
        "NW_MAT_223",
        "MAT_MW_ORGAN_029",
        "MW_MAT_EXO_119",
        "MW_MAT_BP_148",
        "MW_MAT_BP_179"
      ],
      "recipeManuscripts": [
        "MW_REC_012",
        "MW_REC_030",
        "MW_REC_048",
        "MW_REC_066",
        "MW_REC_084",
        "MW_REC_102"
      ],
      "eventIds": [
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST",
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_021",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตบึงหมอกพิษโกงกางทมิฬ"
    },
    {
      "id": "MW_POOL_02_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "environmentNameTh": "บึงหมอกพิษโกงกางทมิฬ",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "บึงหมอกพิษโกงกางทมิฬ · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 38,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_012",
        "MW_BEAST_015",
        "NW_BEAST_048"
      ],
      "resourceEntries": [
        "NW_MAT_009",
        "NW_MAT_140",
        "NW_MAT_190",
        "NW_MAT_220",
        "MAT_ORE_NETHER_OBSIDIAN_3",
        "MW_MAT_HERB_009",
        "MW_MAT_BP_145",
        "MW_MAT_BP_156"
      ],
      "recipeManuscripts": [
        "MW_REC_011",
        "MW_REC_029",
        "MW_REC_047",
        "MW_REC_065",
        "MW_REC_083",
        "MW_REC_101"
      ],
      "eventIds": [
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO",
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_034",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตบึงหมอกพิษโกงกางทมิฬ"
    },
    {
      "id": "MW_POOL_02_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "environmentNameTh": "บึงหมอกพิษโกงกางทมิฬ",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "บึงหมอกพิษโกงกางทมิฬ · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 44,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_010",
        "MW_BEAST_013",
        "MW_BEAST_016",
        "NW_BEAST_056"
      ],
      "resourceEntries": [
        "NW_MAT_052",
        "NW_MAT_147",
        "NW_MAT_218",
        "NW_MAT_221",
        "MAT_BP_SHADOW_PANTHER_CLAW_3",
        "MW_MAT_EXO_119",
        "MW_MAT_BP_148",
        "MW_MAT_BP_158"
      ],
      "recipeManuscripts": [
        "MW_REC_010",
        "MW_REC_028",
        "MW_REC_046",
        "MW_REC_064",
        "MW_REC_082",
        "MW_REC_100"
      ],
      "eventIds": [
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE",
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_047",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตบึงหมอกพิษโกงกางทมิฬ"
    },
    {
      "id": "MW_POOL_02_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "environmentNameTh": "บึงหมอกพิษโกงกางทมิฬ",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "บึงหมอกพิษโกงกางทมิฬ · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 50,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_011",
        "MW_BEAST_014",
        "MW_BEAST_017"
      ],
      "resourceEntries": [
        "MAT_HERB_VENOM_VINE_3",
        "NW_MAT_081",
        "NW_MAT_190",
        "NW_MAT_220",
        "NW_MAT_222",
        "MAT_MW_ORGAN_010",
        "MW_MAT_BP_145",
        "MW_MAT_BP_156",
        "MW_MAT_BP_173"
      ],
      "recipeManuscripts": [
        "MW_REC_009",
        "MW_REC_027",
        "MW_REC_045",
        "MW_REC_063",
        "MW_REC_081",
        "MW_REC_099"
      ],
      "eventIds": [
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_03_MIGRATING_BEAST_HERD"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_060",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตบึงหมอกพิษโกงกางทมิฬ"
    },
    {
      "id": "MW_POOL_02_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_02_MIASMA_MANGROVE",
      "environmentNameTh": "บึงหมอกพิษโกงกางทมิฬ",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "บึงหมอกพิษโกงกางทมิฬ · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 56,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_012",
        "MW_BEAST_015",
        "NW_BEAST_048"
      ],
      "resourceEntries": [
        "MAT_BP_PYTHON_GALL_3",
        "NW_MAT_091",
        "NW_MAT_218",
        "NW_MAT_221",
        "NW_MAT_223",
        "MAT_MW_ORGAN_029",
        "MW_MAT_BP_148",
        "MW_MAT_BP_158",
        "MW_MAT_BP_179"
      ],
      "recipeManuscripts": [
        "MW_REC_008",
        "MW_REC_026",
        "MW_REC_044",
        "MW_REC_062",
        "MW_REC_080",
        "MW_REC_098"
      ],
      "eventIds": [
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_07_HIDDEN_MASTER_MURAL"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_073",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตบึงหมอกพิษโกงกางทมิฬ"
    },
    {
      "id": "MW_POOL_03_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "environmentNameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 34,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_018",
        "MW_BEAST_021",
        "MW_BEAST_024",
        "BEAST_FROST_MIST_KIRIN",
        "NW_BEAST_051",
        "BEAST_FROST_MOON_LYNX"
      ],
      "resourceEntries": [
        "MAT_HERB_SNOW_LOTUS_5",
        "MAT_BP_FROST_KIRIN_PLUME_5",
        "NW_MAT_019",
        "NW_MAT_064",
        "NW_MAT_146",
        "NW_MAT_211",
        "MAT_HERB_FROST_MOON_BERRY_3",
        "MAT_BP_MOON_FANG_4",
        "MAT_MW_ORGAN_004",
        "MW_MAT_HERB_024",
        "MW_MAT_HERB_054",
        "MW_MAT_ORE_076",
        "MW_MAT_BP_183"
      ],
      "recipeManuscripts": [
        "MW_REC_007",
        "MW_REC_025",
        "MW_REC_043",
        "MW_REC_061",
        "MW_REC_079",
        "MW_REC_097"
      ],
      "eventIds": [
        "MW_EVT_03_MIGRATING_BEAST_HERD",
        "MW_EVT_12_POISON_MIASMA_TIDE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_015",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตทุ่งทุนดราเหมันต์เก้าชั้นฟ้า"
    },
    {
      "id": "MW_POOL_03_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "environmentNameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 40,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_019",
        "MW_BEAST_022",
        "MW_BEAST_025",
        "NW_BEAST_007",
        "NW_BEAST_060"
      ],
      "resourceEntries": [
        "MAT_BP_BEAR_HEART_4",
        "NW_MAT_003",
        "NW_MAT_026",
        "NW_MAT_090",
        "NW_MAT_155",
        "NW_MAT_225",
        "MAT_BP_FROST_LYNX_FUR_4",
        "MAT_BP_FROST_HEART_4",
        "MAT_MW_ORGAN_023",
        "MW_MAT_HERB_034",
        "MW_MAT_ORE_064",
        "MW_MAT_EXO_109"
      ],
      "recipeManuscripts": [
        "MW_REC_006",
        "MW_REC_024",
        "MW_REC_042",
        "MW_REC_060",
        "MW_REC_078",
        "MW_REC_096"
      ],
      "eventIds": [
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT",
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_028",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตทุ่งทุนดราเหมันต์เก้าชั้นฟ้า"
    },
    {
      "id": "MW_POOL_03_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "environmentNameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 46,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_020",
        "MW_BEAST_023",
        "BEAST_FROST_BEAR",
        "NW_BEAST_019",
        "NW_BEAST_071"
      ],
      "resourceEntries": [
        "MAT_HERB_FROST_STAR_ORCHID_4",
        "NW_MAT_019",
        "NW_MAT_064",
        "NW_MAT_098",
        "NW_MAT_166",
        "MAT_HERB_FROST_MOON_BERRY_3",
        "MAT_BP_MOON_FANG_4",
        "MAT_LIQ_MOON_DEW_3",
        "MAT_MW_ORGAN_034",
        "MW_MAT_HERB_054",
        "MW_MAT_ORE_076",
        "MW_MAT_BP_153"
      ],
      "recipeManuscripts": [
        "MW_REC_005",
        "MW_REC_023",
        "MW_REC_041",
        "MW_REC_059",
        "MW_REC_077",
        "MW_REC_095"
      ],
      "eventIds": [
        "MW_EVT_07_HIDDEN_MASTER_MURAL",
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_041",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตทุ่งทุนดราเหมันต์เก้าชั้นฟ้า"
    },
    {
      "id": "MW_POOL_03_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "environmentNameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 52,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_018",
        "MW_BEAST_021",
        "MW_BEAST_024",
        "BEAST_FROST_MIST_KIRIN",
        "NW_BEAST_051",
        "BEAST_FROST_MOON_LYNX"
      ],
      "resourceEntries": [
        "MAT_ORE_ABYSSAL_FROST_CRYSTAL_5",
        "NW_MAT_026",
        "NW_MAT_090",
        "NW_MAT_123",
        "NW_MAT_187",
        "MAT_BP_FROST_LYNX_FUR_4",
        "MAT_BP_FROST_HEART_4",
        "MAT_BP_SHADOW_TENDON_3",
        "MW_MAT_HERB_011",
        "MW_MAT_ORE_064",
        "MW_MAT_EXO_109",
        "MW_MAT_BP_164"
      ],
      "recipeManuscripts": [
        "MW_REC_004",
        "MW_REC_022",
        "MW_REC_040",
        "MW_REC_058",
        "MW_REC_076",
        "MW_REC_094"
      ],
      "eventIds": [
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_054",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตทุ่งทุนดราเหมันต์เก้าชั้นฟ้า"
    },
    {
      "id": "MW_POOL_03_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "environmentNameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 58,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_019",
        "MW_BEAST_022",
        "MW_BEAST_025",
        "NW_BEAST_007",
        "NW_BEAST_060"
      ],
      "resourceEntries": [
        "MAT_HERB_SNOW_LOTUS_5",
        "MAT_BP_FROST_KIRIN_PLUME_5",
        "NW_MAT_064",
        "NW_MAT_098",
        "NW_MAT_146",
        "NW_MAT_211",
        "MAT_BP_MOON_FANG_4",
        "MAT_LIQ_MOON_DEW_3",
        "MAT_MW_ORGAN_004",
        "MW_MAT_HERB_024",
        "MW_MAT_ORE_076",
        "MW_MAT_BP_153",
        "MW_MAT_BP_183"
      ],
      "recipeManuscripts": [
        "MW_REC_003",
        "MW_REC_021",
        "MW_REC_039",
        "MW_REC_057",
        "MW_REC_075",
        "MW_REC_093"
      ],
      "eventIds": [
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_067",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตทุ่งทุนดราเหมันต์เก้าชั้นฟ้า"
    },
    {
      "id": "MW_POOL_03_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_03_FROZEN_HIGHLANDS",
      "environmentNameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 64,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_020",
        "MW_BEAST_023",
        "BEAST_FROST_BEAR",
        "NW_BEAST_019",
        "NW_BEAST_071"
      ],
      "resourceEntries": [
        "MAT_BP_BEAR_HEART_4",
        "NW_MAT_003",
        "NW_MAT_090",
        "NW_MAT_123",
        "NW_MAT_155",
        "NW_MAT_225",
        "MAT_BP_FROST_HEART_4",
        "MAT_BP_SHADOW_TENDON_3",
        "MAT_MW_ORGAN_023",
        "MW_MAT_HERB_034",
        "MW_MAT_EXO_109",
        "MW_MAT_BP_164"
      ],
      "recipeManuscripts": [
        "MW_REC_002",
        "MW_REC_020",
        "MW_REC_038",
        "MW_REC_056",
        "MW_REC_074",
        "MW_REC_092"
      ],
      "eventIds": [
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_080",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตทุ่งทุนดราเหมันต์เก้าชั้นฟ้า"
    },
    {
      "id": "MW_POOL_04_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "environmentNameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 34,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_026",
        "MW_BEAST_029",
        "MW_BEAST_032",
        "NW_BEAST_005",
        "NW_BEAST_023",
        "NW_BEAST_034",
        "NW_BEAST_087",
        "BEAST_ASHEN_CROW"
      ],
      "resourceEntries": [
        "MAT_HERB_CINDER_LEAF_1",
        "MAT_HERB_SUN_MOON_NECTAR_LOTUS_6",
        "NW_MAT_007",
        "NW_MAT_020",
        "NW_MAT_058",
        "NW_MAT_097",
        "NW_MAT_139",
        "NW_MAT_156",
        "NW_MAT_174",
        "NW_MAT_199",
        "NW_MAT_226",
        "MAT_BP_FOXFIRE_GALL_2",
        "MAT_VEN_CENTIPEDE_GU_4",
        "MAT_MW_ORGAN_031",
        "MAT_MW_ORGAN_038",
        "MW_MAT_HERB_035",
        "MW_MAT_ORE_069",
        "MW_MAT_ORE_096",
        "MW_MAT_EXO_117",
        "MW_MAT_BP_151",
        "MW_MAT_BP_184"
      ],
      "recipeManuscripts": [
        "MW_REC_001",
        "MW_REC_019",
        "MW_REC_037",
        "MW_REC_055",
        "MW_REC_073",
        "MW_REC_091"
      ],
      "eventIds": [
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST",
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_13_FALLING_STAR_FRAGMENT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_022",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตแอ่งอัคคีหินหนืดผลาญฟ้า"
    },
    {
      "id": "MW_POOL_04_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "environmentNameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 40,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_027",
        "MW_BEAST_030",
        "MW_BEAST_033",
        "NW_BEAST_016",
        "NW_BEAST_026",
        "NW_BEAST_049",
        "NW_BEAST_092"
      ],
      "resourceEntries": [
        "MAT_ORE_DIVINE_GOLD_6",
        "MAT_FORM_EARTH_FLAME_CORE_4",
        "NW_MAT_016",
        "NW_MAT_025",
        "NW_MAT_073",
        "NW_MAT_122",
        "NW_MAT_151",
        "NW_MAT_162",
        "NW_MAT_177",
        "NW_MAT_212",
        "NW_MAT_228",
        "MAT_BP_EMBER_GALL_3",
        "MAT_MW_ORGAN_007",
        "MAT_MW_ORGAN_035",
        "MW_MAT_HERB_010",
        "MW_MAT_HERB_046",
        "MW_MAT_ORE_075",
        "MW_MAT_EXO_112",
        "MW_MAT_EXO_123",
        "MW_MAT_BP_159",
        "MW_MAT_BP_192"
      ],
      "recipeManuscripts": [
        "MW_REC_018",
        "MW_REC_036",
        "MW_REC_054",
        "MW_REC_072",
        "MW_REC_090",
        "MW_REC_108"
      ],
      "eventIds": [
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO",
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_035",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตแอ่งอัคคีหินหนืดผลาญฟ้า"
    },
    {
      "id": "MW_POOL_04_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "environmentNameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 46,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_028",
        "MW_BEAST_031",
        "BEAST_LAVA_FLAME_TORTOISE_4",
        "NW_BEAST_021",
        "NW_BEAST_029",
        "NW_BEAST_076",
        "BEAST_CLOUD_FOX"
      ],
      "resourceEntries": [
        "MAT_BP_SCORPION_STING_4",
        "NW_MAT_007",
        "NW_MAT_020",
        "NW_MAT_046",
        "NW_MAT_079",
        "NW_MAT_139",
        "NW_MAT_156",
        "NW_MAT_169",
        "NW_MAT_183",
        "NW_MAT_226",
        "MAT_BP_FOXFIRE_GALL_2",
        "MAT_BP_EMBER_CORE_3",
        "MAT_MW_ORGAN_020",
        "MAT_MW_ORGAN_038",
        "MW_MAT_HERB_035",
        "MW_MAT_HERB_052",
        "MW_MAT_ORE_084",
        "MW_MAT_EXO_117",
        "MW_MAT_BP_151",
        "MW_MAT_BP_172"
      ],
      "recipeManuscripts": [
        "MW_REC_017",
        "MW_REC_035",
        "MW_REC_053",
        "MW_REC_071",
        "MW_REC_089",
        "MW_REC_107"
      ],
      "eventIds": [
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE",
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_048",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตแอ่งอัคคีหินหนืดผลาญฟ้า"
    },
    {
      "id": "MW_POOL_04_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "environmentNameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 52,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_026",
        "MW_BEAST_029",
        "MW_BEAST_032",
        "NW_BEAST_005",
        "NW_BEAST_023",
        "NW_BEAST_034",
        "NW_BEAST_087",
        "BEAST_ASHEN_CROW"
      ],
      "resourceEntries": [
        "MAT_BP_PHOENIX_PLUME_6",
        "NW_MAT_016",
        "NW_MAT_025",
        "NW_MAT_054",
        "NW_MAT_092",
        "NW_MAT_151",
        "NW_MAT_162",
        "NW_MAT_173",
        "NW_MAT_196",
        "NW_MAT_228",
        "MAT_BP_EMBER_GALL_3",
        "MAT_ORE_DIVINE_GOLD_5",
        "MAT_MW_ORGAN_025",
        "MW_MAT_HERB_010",
        "MW_MAT_HERB_046",
        "MW_MAT_ORE_060",
        "MW_MAT_ORE_086",
        "MW_MAT_EXO_123",
        "MW_MAT_BP_159",
        "MW_MAT_BP_178"
      ],
      "recipeManuscripts": [
        "MW_REC_016",
        "MW_REC_034",
        "MW_REC_052",
        "MW_REC_070",
        "MW_REC_088",
        "MW_REC_106"
      ],
      "eventIds": [
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL",
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_061",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตแอ่งอัคคีหินหนืดผลาญฟ้า"
    },
    {
      "id": "MW_POOL_04_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "environmentNameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 58,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_027",
        "MW_BEAST_030",
        "MW_BEAST_033",
        "NW_BEAST_016",
        "NW_BEAST_026",
        "NW_BEAST_049",
        "NW_BEAST_092"
      ],
      "resourceEntries": [
        "MAT_HERB_CINDER_LEAF_1",
        "MAT_HERB_SUN_MOON_NECTAR_LOTUS_6",
        "NW_MAT_020",
        "NW_MAT_046",
        "NW_MAT_058",
        "NW_MAT_097",
        "NW_MAT_156",
        "NW_MAT_169",
        "NW_MAT_174",
        "NW_MAT_199",
        "MAT_BP_FOXFIRE_GALL_2",
        "MAT_BP_EMBER_CORE_3",
        "MAT_VEN_CENTIPEDE_GU_4",
        "MAT_MW_ORGAN_031",
        "MW_MAT_HERB_035",
        "MW_MAT_HERB_052",
        "MW_MAT_ORE_069",
        "MW_MAT_ORE_096",
        "MW_MAT_BP_151",
        "MW_MAT_BP_172",
        "MW_MAT_BP_184"
      ],
      "recipeManuscripts": [
        "MW_REC_015",
        "MW_REC_033",
        "MW_REC_051",
        "MW_REC_069",
        "MW_REC_087",
        "MW_REC_105"
      ],
      "eventIds": [
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_074",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตแอ่งอัคคีหินหนืดผลาญฟ้า"
    },
    {
      "id": "MW_POOL_04_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_04_VOLCANIC_CALDERA",
      "environmentNameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "แอ่งอัคคีหินหนืดผลาญฟ้า · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 64,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_028",
        "MW_BEAST_031",
        "BEAST_LAVA_FLAME_TORTOISE_4",
        "NW_BEAST_021",
        "NW_BEAST_029",
        "NW_BEAST_076",
        "BEAST_CLOUD_FOX"
      ],
      "resourceEntries": [
        "MAT_ORE_DIVINE_GOLD_6",
        "MAT_FORM_EARTH_FLAME_CORE_4",
        "NW_MAT_025",
        "NW_MAT_054",
        "NW_MAT_073",
        "NW_MAT_122",
        "NW_MAT_162",
        "NW_MAT_173",
        "NW_MAT_177",
        "NW_MAT_212",
        "MAT_BP_EMBER_GALL_3",
        "MAT_ORE_DIVINE_GOLD_5",
        "MAT_MW_ORGAN_007",
        "MAT_MW_ORGAN_035",
        "MW_MAT_HERB_046",
        "MW_MAT_ORE_060",
        "MW_MAT_ORE_075",
        "MW_MAT_EXO_112",
        "MW_MAT_BP_159",
        "MW_MAT_BP_178",
        "MW_MAT_BP_192"
      ],
      "recipeManuscripts": [
        "MW_REC_014",
        "MW_REC_032",
        "MW_REC_050",
        "MW_REC_068",
        "MW_REC_086",
        "MW_REC_104"
      ],
      "eventIds": [
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM",
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_087",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตแอ่งอัคคีหินหนืดผลาญฟ้า"
    },
    {
      "id": "MW_POOL_05_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_05_MINERAL_DESERT",
      "environmentNameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 26,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_034",
        "MW_BEAST_037",
        "MW_BEAST_040",
        "BEAST_BLOOD_FIEND_HOUND_4"
      ],
      "resourceEntries": [
        "MAT_ORE_SOUL_IRON_5",
        "NW_MAT_066",
        "NW_MAT_120",
        "NW_MAT_193",
        "MW_MAT_ORE_057",
        "MW_MAT_ORE_085",
        "MW_MAT_EXO_115",
        "MW_MAT_BP_146"
      ],
      "recipeManuscripts": [
        "MW_REC_013",
        "MW_REC_031",
        "MW_REC_049",
        "MW_REC_067",
        "MW_REC_085",
        "MW_REC_103"
      ],
      "eventIds": [
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT",
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL",
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_029",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตทะเลทรายศิลาแร่และพายุทรายทอง"
    },
    {
      "id": "MW_POOL_05_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_05_MINERAL_DESERT",
      "environmentNameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 32,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_035",
        "MW_BEAST_038",
        "MW_BEAST_041"
      ],
      "resourceEntries": [
        "MAT_ORE_QUICKSAND_SPIRIT_GOLD_4",
        "NW_MAT_067",
        "NW_MAT_163",
        "NW_MAT_227",
        "MW_MAT_ORE_058",
        "MW_MAT_ORE_088",
        "MW_MAT_EXO_125",
        "MW_MAT_BP_149"
      ],
      "recipeManuscripts": [
        "MW_REC_012",
        "MW_REC_030",
        "MW_REC_048",
        "MW_REC_066",
        "MW_REC_084",
        "MW_REC_102"
      ],
      "eventIds": [
        "MW_EVT_07_HIDDEN_MASTER_MURAL",
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_042",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตทะเลทรายศิลาแร่และพายุทรายทอง"
    },
    {
      "id": "MW_POOL_05_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_05_MINERAL_DESERT",
      "environmentNameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 38,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_036",
        "MW_BEAST_039",
        "BEAST_MYTHIC_TAOTIE_SHADOW"
      ],
      "resourceEntries": [
        "MAT_FORM_SPIRIT_INK_SAND_2",
        "NW_MAT_120",
        "NW_MAT_193",
        "NW_MAT_238",
        "MW_MAT_ORE_062",
        "MW_MAT_EXO_115",
        "MW_MAT_BP_146",
        "MW_MAT_BP_168"
      ],
      "recipeManuscripts": [
        "MW_REC_011",
        "MW_REC_029",
        "MW_REC_047",
        "MW_REC_065",
        "MW_REC_083",
        "MW_REC_101"
      ],
      "eventIds": [
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM",
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_055",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตทะเลทรายศิลาแร่และพายุทรายทอง"
    },
    {
      "id": "MW_POOL_05_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_05_MINERAL_DESERT",
      "environmentNameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 44,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_034",
        "MW_BEAST_037",
        "MW_BEAST_040",
        "BEAST_BLOOD_FIEND_HOUND_4"
      ],
      "resourceEntries": [
        "MAT_FORM_VEIN_ANCHOR_SPIKE_5",
        "NW_MAT_163",
        "NW_MAT_227",
        "MAT_MW_ORGAN_036",
        "MW_MAT_ORE_073",
        "MW_MAT_EXO_125",
        "MW_MAT_BP_149"
      ],
      "recipeManuscripts": [
        "MW_REC_010",
        "MW_REC_028",
        "MW_REC_046",
        "MW_REC_064",
        "MW_REC_082",
        "MW_REC_100"
      ],
      "eventIds": [
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR",
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_068",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตทะเลทรายศิลาแร่และพายุทรายทอง"
    },
    {
      "id": "MW_POOL_05_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_05_MINERAL_DESERT",
      "environmentNameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 50,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_035",
        "MW_BEAST_038",
        "MW_BEAST_041"
      ],
      "resourceEntries": [
        "MAT_ORE_SOUL_IRON_5",
        "NW_MAT_066",
        "NW_MAT_193",
        "NW_MAT_238",
        "MW_MAT_ORE_057",
        "MW_MAT_ORE_085",
        "MW_MAT_BP_146",
        "MW_MAT_BP_168"
      ],
      "recipeManuscripts": [
        "MW_REC_009",
        "MW_REC_027",
        "MW_REC_045",
        "MW_REC_063",
        "MW_REC_081",
        "MW_REC_099"
      ],
      "eventIds": [
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER",
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_081",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตทะเลทรายศิลาแร่และพายุทรายทอง"
    },
    {
      "id": "MW_POOL_05_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_05_MINERAL_DESERT",
      "environmentNameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ทะเลทรายศิลาแร่และพายุทรายทอง · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 56,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_036",
        "MW_BEAST_039",
        "BEAST_MYTHIC_TAOTIE_SHADOW"
      ],
      "resourceEntries": [
        "MAT_ORE_QUICKSAND_SPIRIT_GOLD_4",
        "NW_MAT_067",
        "NW_MAT_227",
        "MAT_MW_ORGAN_036",
        "MW_MAT_ORE_058",
        "MW_MAT_ORE_088",
        "MW_MAT_BP_149"
      ],
      "recipeManuscripts": [
        "MW_REC_008",
        "MW_REC_026",
        "MW_REC_044",
        "MW_REC_062",
        "MW_REC_080",
        "MW_REC_098"
      ],
      "eventIds": [
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE",
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_094",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตทะเลทรายศิลาแร่และพายุทรายทอง"
    },
    {
      "id": "MW_POOL_06_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "environmentNameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 2,
      "maxTier": 7,
      "dangerBase": 34,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_042",
        "MW_BEAST_045",
        "MW_BEAST_048",
        "BEAST_SAND_SCORPION",
        "BEAST_ABYSSAL_LEVIATHAN_TURTLE",
        "NW_BEAST_039",
        "NW_BEAST_042",
        "NW_BEAST_045"
      ],
      "resourceEntries": [
        "MAT_BP_DRAGON_PEARL_7",
        "NW_MAT_027",
        "NW_MAT_043",
        "NW_MAT_078",
        "NW_MAT_112",
        "NW_MAT_134",
        "NW_MAT_160",
        "NW_MAT_188",
        "MAT_MW_ORGAN_005",
        "MW_MAT_HERB_029",
        "MW_MAT_ORE_061",
        "MW_MAT_ORE_091",
        "MW_MAT_EXO_127",
        "MW_MAT_BP_189"
      ],
      "recipeManuscripts": [
        "MW_REC_007",
        "MW_REC_025",
        "MW_REC_043",
        "MW_REC_061",
        "MW_REC_079",
        "MW_REC_097"
      ],
      "eventIds": [
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO",
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR",
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_036",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตร่องสมุทรปล่องน้ำพุร้อนเรืองแสง"
    },
    {
      "id": "MW_POOL_06_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "environmentNameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 2,
      "maxTier": 7,
      "dangerBase": 40,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_043",
        "MW_BEAST_046",
        "MW_BEAST_049",
        "BEAST_ABYSSAL_DRAGON",
        "NW_BEAST_004",
        "NW_BEAST_040",
        "NW_BEAST_043",
        "NW_BEAST_046"
      ],
      "resourceEntries": [
        "MAT_HERB_ABYSSAL_CORAL_GRASS_5",
        "NW_MAT_042",
        "NW_MAT_056",
        "NW_MAT_093",
        "NW_MAT_113",
        "NW_MAT_143",
        "NW_MAT_181",
        "NW_MAT_194",
        "MAT_MW_ORGAN_032",
        "MW_MAT_HERB_036",
        "MW_MAT_ORE_070",
        "MW_MAT_ORE_092",
        "MW_MAT_BP_160"
      ],
      "recipeManuscripts": [
        "MW_REC_006",
        "MW_REC_024",
        "MW_REC_042",
        "MW_REC_060",
        "MW_REC_078",
        "MW_REC_096"
      ],
      "eventIds": [
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE",
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER",
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_049",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตร่องสมุทรปล่องน้ำพุร้อนเรืองแสง"
    },
    {
      "id": "MW_POOL_06_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "environmentNameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 2,
      "maxTier": 7,
      "dangerBase": 46,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_044",
        "MW_BEAST_047",
        "MW_BEAST_050",
        "BEAST_THUNDER_DRAKE_LIZARD",
        "NW_BEAST_010",
        "NW_BEAST_041",
        "NW_BEAST_044"
      ],
      "resourceEntries": [
        "MAT_FORM_FAITH_INCENSE_PEARL_4",
        "NW_MAT_043",
        "NW_MAT_078",
        "NW_MAT_103",
        "NW_MAT_114",
        "NW_MAT_160",
        "NW_MAT_188",
        "NW_MAT_213",
        "MW_MAT_HERB_006",
        "MW_MAT_ORE_061",
        "MW_MAT_ORE_091",
        "MW_MAT_EXO_114",
        "MW_MAT_BP_174"
      ],
      "recipeManuscripts": [
        "MW_REC_005",
        "MW_REC_023",
        "MW_REC_041",
        "MW_REC_059",
        "MW_REC_077",
        "MW_REC_095"
      ],
      "eventIds": [
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
        "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_062",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตร่องสมุทรปล่องน้ำพุร้อนเรืองแสง"
    },
    {
      "id": "MW_POOL_06_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "environmentNameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 2,
      "maxTier": 7,
      "dangerBase": 52,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_042",
        "MW_BEAST_045",
        "MW_BEAST_048",
        "BEAST_SAND_SCORPION",
        "BEAST_ABYSSAL_LEVIATHAN_TURTLE",
        "NW_BEAST_039",
        "NW_BEAST_042",
        "NW_BEAST_045"
      ],
      "resourceEntries": [
        "NW_MAT_015",
        "NW_MAT_056",
        "NW_MAT_093",
        "NW_MAT_111",
        "NW_MAT_115",
        "NW_MAT_181",
        "NW_MAT_194",
        "NW_MAT_219",
        "MW_MAT_HERB_018",
        "MW_MAT_ORE_070",
        "MW_MAT_ORE_092",
        "MW_MAT_EXO_121",
        "MW_MAT_BP_182"
      ],
      "recipeManuscripts": [
        "MW_REC_004",
        "MW_REC_022",
        "MW_REC_040",
        "MW_REC_058",
        "MW_REC_076",
        "MW_REC_094"
      ],
      "eventIds": [
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET",
        "MW_EVT_03_MIGRATING_BEAST_HERD"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_075",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตร่องสมุทรปล่องน้ำพุร้อนเรืองแสง"
    },
    {
      "id": "MW_POOL_06_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "environmentNameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 2,
      "maxTier": 7,
      "dangerBase": 58,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_043",
        "MW_BEAST_046",
        "MW_BEAST_049",
        "BEAST_ABYSSAL_DRAGON",
        "NW_BEAST_004",
        "NW_BEAST_040",
        "NW_BEAST_043",
        "NW_BEAST_046"
      ],
      "resourceEntries": [
        "MAT_BP_DRAGON_PEARL_7",
        "NW_MAT_027",
        "NW_MAT_078",
        "NW_MAT_103",
        "NW_MAT_112",
        "NW_MAT_134",
        "NW_MAT_188",
        "NW_MAT_213",
        "MAT_MW_ORGAN_005",
        "MW_MAT_HERB_029",
        "MW_MAT_ORE_091",
        "MW_MAT_EXO_114",
        "MW_MAT_EXO_127",
        "MW_MAT_BP_189"
      ],
      "recipeManuscripts": [
        "MW_REC_003",
        "MW_REC_021",
        "MW_REC_039",
        "MW_REC_057",
        "MW_REC_075",
        "MW_REC_093"
      ],
      "eventIds": [
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP",
        "MW_EVT_07_HIDDEN_MASTER_MURAL"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_088",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตร่องสมุทรปล่องน้ำพุร้อนเรืองแสง"
    },
    {
      "id": "MW_POOL_06_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_06_HYDROTHERMAL_ABYSS",
      "environmentNameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ร่องสมุทรปล่องน้ำพุร้อนเรืองแสง · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 2,
      "maxTier": 7,
      "dangerBase": 64,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_044",
        "MW_BEAST_047",
        "MW_BEAST_050",
        "BEAST_THUNDER_DRAKE_LIZARD",
        "NW_BEAST_010",
        "NW_BEAST_041",
        "NW_BEAST_044"
      ],
      "resourceEntries": [
        "MAT_HERB_ABYSSAL_CORAL_GRASS_5",
        "NW_MAT_042",
        "NW_MAT_093",
        "NW_MAT_111",
        "NW_MAT_113",
        "NW_MAT_143",
        "NW_MAT_194",
        "NW_MAT_219",
        "MAT_MW_ORGAN_032",
        "MW_MAT_HERB_036",
        "MW_MAT_ORE_092",
        "MW_MAT_EXO_121",
        "MW_MAT_BP_160"
      ],
      "recipeManuscripts": [
        "MW_REC_002",
        "MW_REC_020",
        "MW_REC_038",
        "MW_REC_056",
        "MW_REC_074",
        "MW_REC_092"
      ],
      "eventIds": [
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF",
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_101",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตร่องสมุทรปล่องน้ำพุร้อนเรืองแสง"
    },
    {
      "id": "MW_POOL_07_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "environmentNameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์ · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 34,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_051",
        "MW_BEAST_054",
        "MW_BEAST_057",
        "BEAST_THUNDER_HORN_STAG_4",
        "NW_BEAST_031",
        "BEAST_THUNDER_FLOOD_DRAKE"
      ],
      "resourceEntries": [
        "MAT_ORE_MAGNET_LODESTONE_3",
        "MAT_ORE_THUNDER_SCORCH_COPPER_3",
        "MAT_FORM_LIGHTNING_CRYSTAL_4",
        "NW_MAT_023",
        "NW_MAT_086",
        "NW_MAT_135",
        "NW_MAT_150",
        "NW_MAT_158",
        "MAT_HERB_THUNDER_BAMBOO_3",
        "MAT_BP_THUNDER_DRAKE_SCALE_4",
        "MAT_BP_THUNDER_DRAKE_BLOOD_4",
        "MAT_MW_ORGAN_022",
        "MW_MAT_HERB_042",
        "MW_MAT_EXO_105",
        "MW_MAT_BP_167",
        "MW_MAT_BP_180"
      ],
      "recipeManuscripts": [
        "MW_REC_001",
        "MW_REC_019",
        "MW_REC_037",
        "MW_REC_055",
        "MW_REC_073",
        "MW_REC_091"
      ],
      "eventIds": [
        "MW_EVT_07_HIDDEN_MASTER_MURAL",
        "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET",
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_043",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตที่ราบสูงอสนีบาตฟาดนิรันดร์"
    },
    {
      "id": "MW_POOL_07_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "environmentNameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์ · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 40,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_052",
        "MW_BEAST_055",
        "MW_BEAST_058",
        "NW_BEAST_006",
        "NW_BEAST_061"
      ],
      "resourceEntries": [
        "MAT_BP_WOLF_PELT_1",
        "MAT_BP_THUNDER_LIZARD_SCALE_4",
        "NW_MAT_013",
        "NW_MAT_032",
        "NW_MAT_087",
        "NW_MAT_148",
        "NW_MAT_152",
        "NW_MAT_164",
        "MAT_ORE_THUNDER_IRON_4",
        "MAT_BP_THUNDER_DRAKE_HORN_4",
        "MAT_MW_ORGAN_002",
        "MW_MAT_HERB_012",
        "MW_MAT_ORE_065",
        "MW_MAT_BP_150",
        "MW_MAT_BP_175",
        "MW_MAT_BP_186"
      ],
      "recipeManuscripts": [
        "MW_REC_018",
        "MW_REC_036",
        "MW_REC_054",
        "MW_REC_072",
        "MW_REC_090",
        "MW_REC_108"
      ],
      "eventIds": [
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP",
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_056",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตที่ราบสูงอสนีบาตฟาดนิรันดร์"
    },
    {
      "id": "MW_POOL_07_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "environmentNameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์ · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 46,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_053",
        "MW_BEAST_056",
        "BEAST_THUNDER_ROC",
        "NW_BEAST_018",
        "NW_BEAST_083"
      ],
      "resourceEntries": [
        "MAT_BP_ROC_FEATHER_5",
        "MAT_FORM_LIGHTNING_CRYSTAL_4",
        "NW_MAT_023",
        "NW_MAT_060",
        "NW_MAT_099",
        "NW_MAT_150",
        "NW_MAT_158",
        "NW_MAT_165",
        "MAT_TAL_VERMILION_INK_3",
        "MAT_BP_THUNDER_DRAKE_BLOOD_4",
        "MAT_MW_ORGAN_022",
        "MW_MAT_HERB_020",
        "MW_MAT_ORE_072",
        "MW_MAT_BP_167",
        "MW_MAT_BP_180",
        "MW_MAT_BP_191"
      ],
      "recipeManuscripts": [
        "MW_REC_017",
        "MW_REC_035",
        "MW_REC_053",
        "MW_REC_071",
        "MW_REC_089",
        "MW_REC_107"
      ],
      "eventIds": [
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF",
        "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_069",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตที่ราบสูงอสนีบาตฟาดนิรันดร์"
    },
    {
      "id": "MW_POOL_07_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "environmentNameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์ · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 52,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_051",
        "MW_BEAST_054",
        "MW_BEAST_057",
        "BEAST_THUNDER_HORN_STAG_4",
        "NW_BEAST_031",
        "BEAST_THUNDER_FLOOD_DRAKE"
      ],
      "resourceEntries": [
        "MAT_ORE_THUNDER_JADE_4",
        "NW_MAT_013",
        "NW_MAT_032",
        "NW_MAT_080",
        "NW_MAT_128",
        "NW_MAT_152",
        "NW_MAT_164",
        "NW_MAT_200",
        "MAT_BP_DREAM_MOTH_CORE_3",
        "MAT_MW_ORGAN_002",
        "MW_MAT_HERB_012",
        "MW_MAT_HERB_031",
        "MW_MAT_ORE_080",
        "MW_MAT_BP_175",
        "MW_MAT_BP_186"
      ],
      "recipeManuscripts": [
        "MW_REC_016",
        "MW_REC_034",
        "MW_REC_052",
        "MW_REC_070",
        "MW_REC_088",
        "MW_REC_106"
      ],
      "eventIds": [
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_03_MIGRATING_BEAST_HERD",
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_082",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตที่ราบสูงอสนีบาตฟาดนิรันดร์"
    },
    {
      "id": "MW_POOL_07_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "environmentNameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์ · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 58,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_052",
        "MW_BEAST_055",
        "MW_BEAST_058",
        "NW_BEAST_006",
        "NW_BEAST_061"
      ],
      "resourceEntries": [
        "MAT_ORE_MAGNET_LODESTONE_3",
        "MAT_ORE_THUNDER_SCORCH_COPPER_3",
        "NW_MAT_023",
        "NW_MAT_060",
        "NW_MAT_086",
        "NW_MAT_135",
        "NW_MAT_158",
        "NW_MAT_165",
        "MAT_HERB_THUNDER_BAMBOO_3",
        "MAT_BP_THUNDER_DRAKE_SCALE_4",
        "MAT_MW_ORGAN_022",
        "MW_MAT_HERB_020",
        "MW_MAT_HERB_042",
        "MW_MAT_EXO_105",
        "MW_MAT_BP_180",
        "MW_MAT_BP_191"
      ],
      "recipeManuscripts": [
        "MW_REC_015",
        "MW_REC_033",
        "MW_REC_051",
        "MW_REC_069",
        "MW_REC_087",
        "MW_REC_105"
      ],
      "eventIds": [
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST",
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_095",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตที่ราบสูงอสนีบาตฟาดนิรันดร์"
    },
    {
      "id": "MW_POOL_07_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_07_THUNDER_PLATEAU",
      "environmentNameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ที่ราบสูงอสนีบาตฟาดนิรันดร์ · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 64,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_053",
        "MW_BEAST_056",
        "BEAST_THUNDER_ROC",
        "NW_BEAST_018",
        "NW_BEAST_083"
      ],
      "resourceEntries": [
        "MAT_BP_WOLF_PELT_1",
        "MAT_BP_THUNDER_LIZARD_SCALE_4",
        "NW_MAT_032",
        "NW_MAT_080",
        "NW_MAT_087",
        "NW_MAT_148",
        "NW_MAT_164",
        "NW_MAT_200",
        "MAT_ORE_THUNDER_IRON_4",
        "MAT_BP_THUNDER_DRAKE_HORN_4",
        "MW_MAT_HERB_012",
        "MW_MAT_HERB_031",
        "MW_MAT_ORE_065",
        "MW_MAT_BP_150",
        "MW_MAT_BP_186"
      ],
      "recipeManuscripts": [
        "MW_REC_014",
        "MW_REC_032",
        "MW_REC_050",
        "MW_REC_068",
        "MW_REC_086",
        "MW_REC_104"
      ],
      "eventIds": [
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT",
        "MW_EVT_12_POISON_MIASMA_TIDE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_108",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตที่ราบสูงอสนีบาตฟาดนิรันดร์"
    },
    {
      "id": "MW_POOL_08_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "environmentNameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 26,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_059",
        "MW_BEAST_062",
        "MW_BEAST_065",
        "NW_BEAST_025",
        "NW_BEAST_052",
        "NW_BEAST_084",
        "BEAST_CRYSTALBACK_APE"
      ],
      "resourceEntries": [
        "MAT_ORE_BLACK_IRON_1",
        "MAT_TR_VOID_MATRIX_CORE",
        "MAT_FORM_EARTH_ARRAY_CORE_4",
        "MAT_FORM_SKY_LEVITATION_CORE_5",
        "NW_MAT_088",
        "NW_MAT_101",
        "NW_MAT_104",
        "NW_MAT_106",
        "NW_MAT_110",
        "NW_MAT_178",
        "NW_MAT_209",
        "MAT_BP_CRYSTAL_CORE_3",
        "MAT_MW_ORGAN_009",
        "MAT_MW_ORGAN_039",
        "MW_MAT_ORE_067",
        "MW_MAT_ORE_087",
        "MW_MAT_ORE_098",
        "MW_MAT_EXO_131",
        "MW_MAT_BP_147",
        "MW_MAT_BP_171"
      ],
      "recipeManuscripts": [
        "MW_REC_013",
        "MW_REC_031",
        "MW_REC_049",
        "MW_REC_067",
        "MW_REC_085",
        "MW_REC_103"
      ],
      "eventIds": [
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE",
        "MW_EVT_03_MIGRATING_BEAST_HERD",
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_050",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตถ้ำผลึกเรโซแนนซ์ใต้พิภพ"
    },
    {
      "id": "MW_POOL_08_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "environmentNameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 32,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_060",
        "MW_BEAST_063",
        "MW_BEAST_066",
        "NW_BEAST_032",
        "NW_BEAST_063",
        "NW_BEAST_086"
      ],
      "resourceEntries": [
        "MAT_ORE_MITHRIL_JADE_4",
        "MAT_TR_DAO_HEART_CRYSTAL",
        "MAT_FORM_YIN_CRYSTAL_3",
        "MAT_FORM_BLOOD_FIEND_CRYSTAL_4",
        "NW_MAT_094",
        "NW_MAT_102",
        "NW_MAT_105",
        "NW_MAT_107",
        "NW_MAT_118",
        "NW_MAT_208",
        "MAT_BP_CRYSTAL_KNUCKLE_3",
        "MAT_BP_CRYSTAL_HIDE_3",
        "MAT_MW_ORGAN_014",
        "MW_MAT_ORE_059",
        "MW_MAT_ORE_081",
        "MW_MAT_ORE_089",
        "MW_MAT_ORE_100",
        "MW_MAT_EXO_133",
        "MW_MAT_BP_157"
      ],
      "recipeManuscripts": [
        "MW_REC_012",
        "MW_REC_030",
        "MW_REC_048",
        "MW_REC_066",
        "MW_REC_084",
        "MW_REC_102"
      ],
      "eventIds": [
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST",
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_063",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตถ้ำผลึกเรโซแนนซ์ใต้พิภพ"
    },
    {
      "id": "MW_POOL_08_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "environmentNameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 38,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_061",
        "MW_BEAST_064",
        "NW_BEAST_009",
        "NW_BEAST_036",
        "NW_BEAST_081",
        "NW_BEAST_089"
      ],
      "resourceEntries": [
        "MAT_ORE_PRIMORDIAL_CRYSTAL_7",
        "MAT_FORM_EARTH_ARRAY_CORE_4",
        "MAT_FORM_SKY_LEVITATION_CORE_5",
        "NW_MAT_048",
        "NW_MAT_096",
        "NW_MAT_104",
        "NW_MAT_106",
        "NW_MAT_108",
        "NW_MAT_121",
        "NW_MAT_209",
        "MAT_BP_CRYSTAL_CORE_3",
        "MAT_ORE_MIND_CRYSTAL_3",
        "MAT_MW_ORGAN_017",
        "MW_MAT_ORE_067",
        "MW_MAT_ORE_087",
        "MW_MAT_ORE_094",
        "MW_MAT_EXO_113",
        "MW_MAT_BP_147",
        "MW_MAT_BP_171"
      ],
      "recipeManuscripts": [
        "MW_REC_011",
        "MW_REC_029",
        "MW_REC_047",
        "MW_REC_065",
        "MW_REC_083",
        "MW_REC_101"
      ],
      "eventIds": [
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT",
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_076",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตถ้ำผลึกเรโซแนนซ์ใต้พิภพ"
    },
    {
      "id": "MW_POOL_08_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "environmentNameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 44,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_059",
        "MW_BEAST_062",
        "MW_BEAST_065",
        "NW_BEAST_025",
        "NW_BEAST_052",
        "NW_BEAST_084",
        "BEAST_CRYSTALBACK_APE"
      ],
      "resourceEntries": [
        "MAT_BP_WOLF_HAIR_1",
        "MAT_FORM_YIN_CRYSTAL_3",
        "MAT_FORM_BLOOD_FIEND_CRYSTAL_4",
        "NW_MAT_070",
        "NW_MAT_100",
        "NW_MAT_105",
        "NW_MAT_107",
        "NW_MAT_109",
        "NW_MAT_136",
        "MAT_BP_CRYSTAL_KNUCKLE_3",
        "MAT_BP_CRYSTAL_HIDE_3",
        "MAT_MW_ORGAN_006",
        "MAT_MW_ORGAN_024",
        "MW_MAT_ORE_081",
        "MW_MAT_ORE_089",
        "MW_MAT_ORE_097",
        "MW_MAT_EXO_120",
        "MW_MAT_BP_157"
      ],
      "recipeManuscripts": [
        "MW_REC_010",
        "MW_REC_028",
        "MW_REC_046",
        "MW_REC_064",
        "MW_REC_082",
        "MW_REC_100"
      ],
      "eventIds": [
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO",
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_089",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตถ้ำผลึกเรโซแนนซ์ใต้พิภพ"
    },
    {
      "id": "MW_POOL_08_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "environmentNameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 50,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_060",
        "MW_BEAST_063",
        "MW_BEAST_066",
        "NW_BEAST_032",
        "NW_BEAST_063",
        "NW_BEAST_086"
      ],
      "resourceEntries": [
        "MAT_ORE_BLACK_IRON_1",
        "MAT_TR_VOID_MATRIX_CORE",
        "MAT_FORM_SKY_LEVITATION_CORE_5",
        "NW_MAT_048",
        "NW_MAT_088",
        "NW_MAT_101",
        "NW_MAT_106",
        "NW_MAT_108",
        "NW_MAT_110",
        "NW_MAT_178",
        "MAT_BP_CRYSTAL_CORE_3",
        "MAT_ORE_MIND_CRYSTAL_3",
        "MAT_MW_ORGAN_009",
        "MAT_MW_ORGAN_039",
        "MW_MAT_ORE_087",
        "MW_MAT_ORE_094",
        "MW_MAT_ORE_098",
        "MW_MAT_EXO_131",
        "MW_MAT_BP_171"
      ],
      "recipeManuscripts": [
        "MW_REC_009",
        "MW_REC_027",
        "MW_REC_045",
        "MW_REC_063",
        "MW_REC_081",
        "MW_REC_099"
      ],
      "eventIds": [
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_07_HIDDEN_MASTER_MURAL",
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_102",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตถ้ำผลึกเรโซแนนซ์ใต้พิภพ"
    },
    {
      "id": "MW_POOL_08_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_08_CRYSTAL_CAVERN",
      "environmentNameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ถ้ำผลึกเรโซแนนซ์ใต้พิภพ · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 56,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_061",
        "MW_BEAST_064",
        "NW_BEAST_009",
        "NW_BEAST_036",
        "NW_BEAST_081",
        "NW_BEAST_089"
      ],
      "resourceEntries": [
        "MAT_ORE_MITHRIL_JADE_4",
        "MAT_TR_DAO_HEART_CRYSTAL",
        "MAT_FORM_BLOOD_FIEND_CRYSTAL_4",
        "NW_MAT_070",
        "NW_MAT_094",
        "NW_MAT_102",
        "NW_MAT_107",
        "NW_MAT_109",
        "NW_MAT_118",
        "NW_MAT_208",
        "MAT_BP_CRYSTAL_HIDE_3",
        "MAT_MW_ORGAN_006",
        "MAT_MW_ORGAN_014",
        "MW_MAT_ORE_059",
        "MW_MAT_ORE_089",
        "MW_MAT_ORE_097",
        "MW_MAT_ORE_100",
        "MW_MAT_EXO_133"
      ],
      "recipeManuscripts": [
        "MW_REC_008",
        "MW_REC_026",
        "MW_REC_044",
        "MW_REC_062",
        "MW_REC_080",
        "MW_REC_098"
      ],
      "eventIds": [
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL",
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE",
        "MW_EVT_13_FALLING_STAR_FRAGMENT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_115",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตถ้ำผลึกเรโซแนนซ์ใต้พิภพ"
    },
    {
      "id": "MW_POOL_09_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_09_FUNGAL_GROVE",
      "environmentNameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 26,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_067",
        "MW_BEAST_070",
        "MW_BEAST_073",
        "NW_BEAST_008",
        "NW_BEAST_055"
      ],
      "resourceEntries": [
        "MAT_HERB_DEW_GRASS_1",
        "MAT_ORE_JADE_SLATE_2",
        "MAT_BP_BEAST_MEAT_1",
        "MAT_BP_BOAR_HIDE_2",
        "MAT_HERB_ANCIENT_MIST_FERN_3",
        "MAT_FORM_SUPREME_SWORD_TALISMAN_5",
        "MAT_FORM_BLANK_ARRAY_FLAG_2",
        "MAT_FORM_FORTRESS_REACTOR_CORE_6",
        "NW_MAT_008",
        "NW_MAT_028",
        "NW_MAT_034",
        "NW_MAT_038",
        "NW_MAT_047",
        "NW_MAT_059",
        "NW_MAT_065",
        "NW_MAT_069",
        "NW_MAT_116",
        "NW_MAT_129",
        "NW_MAT_131",
        "NW_MAT_133",
        "NW_MAT_175",
        "NW_MAT_182",
        "NW_MAT_186",
        "NW_MAT_201",
        "NW_MAT_216",
        "NW_MAT_231",
        "NW_MAT_240",
        "MAT_HERB_SUNSET_ORCHID_4",
        "MAT_BP_CLOUD_ANTLER_2",
        "MAT_BP_ASHEN_FEATHER_3",
        "MAT_HERB_STARLIGHT_GRASS_4",
        "MAT_BP_CENTIPEDE_VENOM_3",
        "MAT_MW_ORGAN_015",
        "MW_MAT_HERB_001",
        "MW_MAT_HERB_003",
        "MW_MAT_HERB_008",
        "MW_MAT_HERB_023",
        "MW_MAT_HERB_032",
        "MW_MAT_HERB_038",
        "MW_MAT_HERB_043",
        "MW_MAT_HERB_053",
        "MW_MAT_ORE_077",
        "MW_MAT_EXO_101",
        "MW_MAT_EXO_107",
        "MW_MAT_EXO_130",
        "MW_MAT_BP_144",
        "MW_MAT_BP_161",
        "MW_MAT_BP_165"
      ],
      "recipeManuscripts": [
        "MW_REC_007",
        "MW_REC_025",
        "MW_REC_043",
        "MW_REC_061",
        "MW_REC_079",
        "MW_REC_097"
      ],
      "eventIds": [
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO",
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_057",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ"
    },
    {
      "id": "MW_POOL_09_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_09_FUNGAL_GROVE",
      "environmentNameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 32,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_068",
        "MW_BEAST_071",
        "MW_BEAST_074",
        "NW_BEAST_050",
        "NW_BEAST_057"
      ],
      "resourceEntries": [
        "MAT_HERB_CHAOS_ROOT_7",
        "MAT_ORE_STAR_COPPER_3",
        "MAT_BP_BOAR_CORE_2",
        "MAT_BP_TIGER_BLOOD_6",
        "MAT_ORE_STARFALL_VOID_JADE_6",
        "MAT_FORM_ARRAY_CORE_basic_3",
        "MAT_FORM_LIFE_ESSENCE_DEW_4",
        "NW_MAT_004",
        "NW_MAT_011",
        "NW_MAT_030",
        "NW_MAT_035",
        "NW_MAT_040",
        "NW_MAT_049",
        "NW_MAT_061",
        "NW_MAT_068",
        "NW_MAT_072",
        "NW_MAT_117",
        "NW_MAT_130",
        "NW_MAT_132",
        "NW_MAT_138",
        "NW_MAT_176",
        "NW_MAT_185",
        "NW_MAT_197",
        "NW_MAT_203",
        "NW_MAT_217",
        "NW_MAT_236",
        "MAT_HERB_CLOUD_PEONY_2",
        "MAT_ORE_SPIRIT_COPPER_2",
        "MAT_BP_JADE_TURTLE_SHELL_3",
        "MAT_HERB_NETHER_MUSHROOM_3",
        "MAT_ORE_STARFALL_METEOR_4",
        "MAT_BP_CENTIPEDE_CARAPACE_3",
        "MAT_MW_ORGAN_028",
        "MW_MAT_HERB_002",
        "MW_MAT_HERB_005",
        "MW_MAT_HERB_014",
        "MW_MAT_HERB_025",
        "MW_MAT_HERB_037",
        "MW_MAT_HERB_041",
        "MW_MAT_HERB_045",
        "MW_MAT_HERB_055",
        "MW_MAT_ORE_099",
        "MW_MAT_EXO_104",
        "MW_MAT_EXO_111",
        "MW_MAT_EXO_134",
        "MW_MAT_BP_154",
        "MW_MAT_BP_163",
        "MW_MAT_BP_176"
      ],
      "recipeManuscripts": [
        "MW_REC_006",
        "MW_REC_024",
        "MW_REC_042",
        "MW_REC_060",
        "MW_REC_078",
        "MW_REC_096"
      ],
      "eventIds": [
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_07_HIDDEN_MASTER_MURAL",
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_070",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ"
    },
    {
      "id": "MW_POOL_09_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_09_FUNGAL_GROVE",
      "environmentNameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 38,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_069",
        "MW_BEAST_072",
        "BEAST_EMERALD_PYTHON",
        "NW_BEAST_054",
        "BEAST_IRON_CENTIPEDE"
      ],
      "resourceEntries": [
        "MAT_ORE_CINNABAR_1",
        "MAT_BP_BEAST_MEAT_1",
        "MAT_BP_BOAR_HIDE_2",
        "MAT_BP_DRAGON_HEART_7",
        "MAT_BP_MYTHIC_GUARDIAN_CORE_6",
        "MAT_FORM_BLANK_ARRAY_FLAG_2",
        "MAT_FORM_FORTRESS_REACTOR_CORE_6",
        "NW_MAT_005",
        "NW_MAT_017",
        "NW_MAT_034",
        "NW_MAT_038",
        "NW_MAT_041",
        "NW_MAT_055",
        "NW_MAT_065",
        "NW_MAT_069",
        "NW_MAT_084",
        "NW_MAT_126",
        "NW_MAT_131",
        "NW_MAT_133",
        "NW_MAT_159",
        "NW_MAT_179",
        "NW_MAT_186",
        "NW_MAT_201",
        "NW_MAT_207",
        "NW_MAT_229",
        "NW_MAT_240",
        "MAT_HERB_SUNSET_ORCHID_4",
        "MAT_ORE_CLOUD_JADE_3",
        "MAT_BP_TIDE_CORE_3",
        "MAT_HERB_STARLIGHT_GRASS_4",
        "MAT_BP_CENTIPEDE_VENOM_3",
        "MAT_MW_ORGAN_001",
        "MAT_MW_ORGAN_033",
        "MW_MAT_HERB_003",
        "MW_MAT_HERB_008",
        "MW_MAT_HERB_015",
        "MW_MAT_HERB_026",
        "MW_MAT_HERB_038",
        "MW_MAT_HERB_043",
        "MW_MAT_HERB_047",
        "MW_MAT_ORE_063",
        "MW_MAT_EXO_101",
        "MW_MAT_EXO_107",
        "MW_MAT_EXO_124",
        "MW_MAT_EXO_135",
        "MW_MAT_BP_161",
        "MW_MAT_BP_165",
        "MW_MAT_BP_177"
      ],
      "recipeManuscripts": [
        "MW_REC_005",
        "MW_REC_023",
        "MW_REC_041",
        "MW_REC_059",
        "MW_REC_077",
        "MW_REC_095"
      ],
      "eventIds": [
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE",
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_083",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ"
    },
    {
      "id": "MW_POOL_09_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_09_FUNGAL_GROVE",
      "environmentNameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 44,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_067",
        "MW_BEAST_070",
        "MW_BEAST_073",
        "NW_BEAST_008",
        "NW_BEAST_055"
      ],
      "resourceEntries": [
        "MAT_ORE_COLD_STEEL_2",
        "MAT_BP_BOAR_CORE_2",
        "MAT_BP_TIGER_BLOOD_6",
        "MAT_TR_ASTRAL_DEW",
        "MAT_FORM_SWORD_TALISMAN_3",
        "MAT_FORM_LIFE_ESSENCE_DEW_4",
        "NW_MAT_004",
        "NW_MAT_006",
        "NW_MAT_024",
        "NW_MAT_035",
        "NW_MAT_040",
        "NW_MAT_044",
        "NW_MAT_057",
        "NW_MAT_068",
        "NW_MAT_072",
        "NW_MAT_085",
        "NW_MAT_127",
        "NW_MAT_132",
        "NW_MAT_138",
        "NW_MAT_167",
        "NW_MAT_180",
        "NW_MAT_197",
        "NW_MAT_203",
        "NW_MAT_215",
        "NW_MAT_230",
        "MAT_HERB_CLOUD_PEONY_2",
        "MAT_ORE_SPIRIT_COPPER_2",
        "MAT_BP_CLOUDFOX_PELT_2",
        "MAT_BP_TURTLE_HEART_3",
        "MAT_ORE_STARFALL_METEOR_4",
        "MAT_BP_CENTIPEDE_CARAPACE_3",
        "MAT_MW_ORGAN_008",
        "MAT_MW_ORGAN_037",
        "MW_MAT_HERB_005",
        "MW_MAT_HERB_014",
        "MW_MAT_HERB_016",
        "MW_MAT_HERB_027",
        "MW_MAT_HERB_041",
        "MW_MAT_HERB_045",
        "MW_MAT_HERB_051",
        "MW_MAT_ORE_068",
        "MW_MAT_EXO_104",
        "MW_MAT_EXO_111",
        "MW_MAT_EXO_129",
        "MW_MAT_EXO_139",
        "MW_MAT_BP_163",
        "MW_MAT_BP_176",
        "MW_MAT_BP_193"
      ],
      "recipeManuscripts": [
        "MW_REC_004",
        "MW_REC_022",
        "MW_REC_040",
        "MW_REC_058",
        "MW_REC_076",
        "MW_REC_094"
      ],
      "eventIds": [
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_096",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ"
    },
    {
      "id": "MW_POOL_09_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_09_FUNGAL_GROVE",
      "environmentNameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 50,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_068",
        "MW_BEAST_071",
        "MW_BEAST_074",
        "NW_BEAST_050",
        "NW_BEAST_057"
      ],
      "resourceEntries": [
        "MAT_HERB_DEW_GRASS_1",
        "MAT_ORE_JADE_SLATE_2",
        "MAT_BP_BOAR_HIDE_2",
        "MAT_BP_DRAGON_HEART_7",
        "MAT_HERB_ANCIENT_MIST_FERN_3",
        "MAT_FORM_SUPREME_SWORD_TALISMAN_5",
        "MAT_FORM_FORTRESS_REACTOR_CORE_6",
        "NW_MAT_005",
        "NW_MAT_008",
        "NW_MAT_028",
        "NW_MAT_038",
        "NW_MAT_041",
        "NW_MAT_047",
        "NW_MAT_059",
        "NW_MAT_069",
        "NW_MAT_084",
        "NW_MAT_116",
        "NW_MAT_129",
        "NW_MAT_133",
        "NW_MAT_159",
        "NW_MAT_175",
        "NW_MAT_182",
        "NW_MAT_201",
        "NW_MAT_207",
        "NW_MAT_216",
        "NW_MAT_231",
        "MAT_HERB_SUNSET_ORCHID_4",
        "MAT_ORE_CLOUD_JADE_3",
        "MAT_BP_CLOUD_ANTLER_2",
        "MAT_BP_ASHEN_FEATHER_3",
        "MAT_BP_CENTIPEDE_VENOM_3",
        "MAT_MW_ORGAN_001",
        "MAT_MW_ORGAN_015",
        "MW_MAT_HERB_001",
        "MW_MAT_HERB_008",
        "MW_MAT_HERB_015",
        "MW_MAT_HERB_023",
        "MW_MAT_HERB_032",
        "MW_MAT_HERB_043",
        "MW_MAT_HERB_047",
        "MW_MAT_HERB_053",
        "MW_MAT_ORE_077",
        "MW_MAT_EXO_107",
        "MW_MAT_EXO_124",
        "MW_MAT_EXO_130",
        "MW_MAT_BP_144",
        "MW_MAT_BP_165",
        "MW_MAT_BP_177"
      ],
      "recipeManuscripts": [
        "MW_REC_003",
        "MW_REC_021",
        "MW_REC_039",
        "MW_REC_057",
        "MW_REC_075",
        "MW_REC_093"
      ],
      "eventIds": [
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_109",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ"
    },
    {
      "id": "MW_POOL_09_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_09_FUNGAL_GROVE",
      "environmentNameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 56,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_069",
        "MW_BEAST_072",
        "BEAST_EMERALD_PYTHON",
        "NW_BEAST_054",
        "BEAST_IRON_CENTIPEDE"
      ],
      "resourceEntries": [
        "MAT_HERB_CHAOS_ROOT_7",
        "MAT_ORE_STAR_COPPER_3",
        "MAT_BP_TIGER_BLOOD_6",
        "MAT_TR_ASTRAL_DEW",
        "MAT_ORE_STARFALL_VOID_JADE_6",
        "MAT_FORM_ARRAY_CORE_basic_3",
        "NW_MAT_004",
        "NW_MAT_006",
        "NW_MAT_011",
        "NW_MAT_030",
        "NW_MAT_040",
        "NW_MAT_044",
        "NW_MAT_049",
        "NW_MAT_061",
        "NW_MAT_072",
        "NW_MAT_085",
        "NW_MAT_117",
        "NW_MAT_130",
        "NW_MAT_138",
        "NW_MAT_167",
        "NW_MAT_176",
        "NW_MAT_185",
        "NW_MAT_203",
        "NW_MAT_215",
        "NW_MAT_217",
        "NW_MAT_236",
        "MAT_ORE_SPIRIT_COPPER_2",
        "MAT_BP_CLOUDFOX_PELT_2",
        "MAT_BP_JADE_TURTLE_SHELL_3",
        "MAT_HERB_NETHER_MUSHROOM_3",
        "MAT_BP_CENTIPEDE_CARAPACE_3",
        "MAT_MW_ORGAN_008",
        "MAT_MW_ORGAN_028",
        "MW_MAT_HERB_002",
        "MW_MAT_HERB_014",
        "MW_MAT_HERB_016",
        "MW_MAT_HERB_025",
        "MW_MAT_HERB_037",
        "MW_MAT_HERB_045",
        "MW_MAT_HERB_051",
        "MW_MAT_HERB_055",
        "MW_MAT_ORE_099",
        "MW_MAT_EXO_111",
        "MW_MAT_EXO_129",
        "MW_MAT_EXO_134",
        "MW_MAT_BP_154",
        "MW_MAT_BP_176",
        "MW_MAT_BP_193"
      ],
      "recipeManuscripts": [
        "MW_REC_002",
        "MW_REC_020",
        "MW_REC_038",
        "MW_REC_056",
        "MW_REC_074",
        "MW_REC_092"
      ],
      "eventIds": [
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_122",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตป่าเห็ดยักษ์และสปอร์ปรสิตวิญญาณ"
    },
    {
      "id": "MW_POOL_10_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "environmentNameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 26,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_075",
        "MW_BEAST_078",
        "MW_BEAST_081",
        "NW_BEAST_003",
        "NW_BEAST_053"
      ],
      "resourceEntries": [
        "MAT_HERB_JADE_LOTUS_2",
        "NW_MAT_021",
        "NW_MAT_053",
        "NW_MAT_198",
        "NW_MAT_224",
        "MAT_MW_ORGAN_003",
        "MAT_MW_ORGAN_026",
        "MW_MAT_HERB_044",
        "MW_MAT_EXO_118",
        "MW_MAT_EXO_140",
        "MW_MAT_BP_170"
      ],
      "recipeManuscripts": [
        "MW_REC_001",
        "MW_REC_019",
        "MW_REC_037",
        "MW_REC_055",
        "MW_REC_073",
        "MW_REC_091"
      ],
      "eventIds": [
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING",
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_064",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตทะเลสาบกระจกวิญญาณเจ็ดสี"
    },
    {
      "id": "MW_POOL_10_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "environmentNameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 32,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_076",
        "MW_BEAST_079",
        "MW_BEAST_082",
        "NW_BEAST_037",
        "BEAST_DREAM_MOTH"
      ],
      "resourceEntries": [
        "MAT_HERB_MERIDIAN_FLOWER_3",
        "NW_MAT_050",
        "NW_MAT_153",
        "NW_MAT_206",
        "NW_MAT_235",
        "MAT_MW_ORGAN_011",
        "MW_MAT_HERB_033",
        "MW_MAT_HERB_048",
        "MW_MAT_EXO_122",
        "MW_MAT_BP_152",
        "MW_MAT_BP_181"
      ],
      "recipeManuscripts": [
        "MW_REC_018",
        "MW_REC_036",
        "MW_REC_054",
        "MW_REC_072",
        "MW_REC_090",
        "MW_REC_108"
      ],
      "eventIds": [
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE",
        "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_077",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตทะเลสาบกระจกวิญญาณเจ็ดสี"
    },
    {
      "id": "MW_POOL_10_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "environmentNameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 38,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_077",
        "MW_BEAST_080",
        "NW_BEAST_002",
        "NW_BEAST_038"
      ],
      "resourceEntries": [
        "MAT_HERB_VOID_LOTUS_6",
        "NW_MAT_053",
        "NW_MAT_198",
        "NW_MAT_210",
        "MAT_HERB_SOUL_LOTUS_3",
        "MAT_MW_ORGAN_026",
        "MW_MAT_HERB_044",
        "MW_MAT_HERB_049",
        "MW_MAT_EXO_136",
        "MW_MAT_BP_170"
      ],
      "recipeManuscripts": [
        "MW_REC_017",
        "MW_REC_035",
        "MW_REC_053",
        "MW_REC_071",
        "MW_REC_089",
        "MW_REC_107"
      ],
      "eventIds": [
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_03_MIGRATING_BEAST_HERD"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_090",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตทะเลสาบกระจกวิญญาณเจ็ดสี"
    },
    {
      "id": "MW_POOL_10_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "environmentNameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 44,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_075",
        "MW_BEAST_078",
        "MW_BEAST_081",
        "NW_BEAST_003",
        "NW_BEAST_053"
      ],
      "resourceEntries": [
        "NW_MAT_010",
        "NW_MAT_153",
        "NW_MAT_206",
        "NW_MAT_214",
        "MAT_BP_DREAM_MOTH_WING_3",
        "MW_MAT_HERB_033",
        "MW_MAT_HERB_048",
        "MW_MAT_HERB_050",
        "MW_MAT_EXO_137",
        "MW_MAT_BP_181"
      ],
      "recipeManuscripts": [
        "MW_REC_016",
        "MW_REC_034",
        "MW_REC_052",
        "MW_REC_070",
        "MW_REC_088",
        "MW_REC_106"
      ],
      "eventIds": [
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_07_HIDDEN_MASTER_MURAL"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_103",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตทะเลสาบกระจกวิญญาณเจ็ดสี"
    },
    {
      "id": "MW_POOL_10_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "environmentNameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 50,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_076",
        "MW_BEAST_079",
        "MW_BEAST_082",
        "NW_BEAST_037",
        "BEAST_DREAM_MOTH"
      ],
      "resourceEntries": [
        "MAT_HERB_JADE_LOTUS_2",
        "NW_MAT_021",
        "NW_MAT_198",
        "NW_MAT_210",
        "NW_MAT_224",
        "MAT_MW_ORGAN_003",
        "MW_MAT_HERB_044",
        "MW_MAT_HERB_049",
        "MW_MAT_EXO_118",
        "MW_MAT_EXO_140"
      ],
      "recipeManuscripts": [
        "MW_REC_015",
        "MW_REC_033",
        "MW_REC_051",
        "MW_REC_069",
        "MW_REC_087",
        "MW_REC_105"
      ],
      "eventIds": [
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL",
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_116",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตทะเลสาบกระจกวิญญาณเจ็ดสี"
    },
    {
      "id": "MW_POOL_10_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_10_MIRROR_SPIRIT_LAKE",
      "environmentNameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ทะเลสาบกระจกวิญญาณเจ็ดสี · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 1,
      "maxTier": 6,
      "dangerBase": 56,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_077",
        "MW_BEAST_080",
        "NW_BEAST_002",
        "NW_BEAST_038"
      ],
      "resourceEntries": [
        "MAT_HERB_MERIDIAN_FLOWER_3",
        "NW_MAT_050",
        "NW_MAT_206",
        "NW_MAT_214",
        "NW_MAT_235",
        "MAT_MW_ORGAN_011",
        "MW_MAT_HERB_048",
        "MW_MAT_HERB_050",
        "MW_MAT_EXO_122",
        "MW_MAT_BP_152"
      ],
      "recipeManuscripts": [
        "MW_REC_014",
        "MW_REC_032",
        "MW_REC_050",
        "MW_REC_068",
        "MW_REC_086",
        "MW_REC_104"
      ],
      "eventIds": [
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM",
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_004",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตทะเลสาบกระจกวิญญาณเจ็ดสี"
    },
    {
      "id": "MW_POOL_11_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "environmentNameTh": "ซากอุทยานสวรรค์ร่วงหล่น",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ซากอุทยานสวรรค์ร่วงหล่น · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 42,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_083",
        "MW_BEAST_086",
        "MW_BEAST_089"
      ],
      "resourceEntries": [
        "MAT_HERB_IMMORTAL_PEACH_6",
        "MAT_HERB_BODHI_LEAF_5",
        "NW_MAT_022",
        "NW_MAT_037",
        "NW_MAT_204",
        "MAT_BP_CELESTIAL_CRANE_CORE_4",
        "MAT_MW_ORGAN_021",
        "MW_MAT_EXO_110"
      ],
      "recipeManuscripts": [
        "MW_REC_013",
        "MW_REC_031",
        "MW_REC_049",
        "MW_REC_067",
        "MW_REC_085",
        "MW_REC_103"
      ],
      "eventIds": [
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST",
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_071",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตซากอุทยานสวรรค์ร่วงหล่น"
    },
    {
      "id": "MW_POOL_11_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "environmentNameTh": "ซากอุทยานสวรรค์ร่วงหล่น",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ซากอุทยานสวรรค์ร่วงหล่น · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 48,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_084",
        "MW_BEAST_087",
        "MW_BEAST_090"
      ],
      "resourceEntries": [
        "MAT_BP_HEAVEN_CORE_5",
        "NW_MAT_018",
        "NW_MAT_029",
        "NW_MAT_075",
        "NW_MAT_237",
        "MAT_MW_ORGAN_012",
        "MW_MAT_EXO_106",
        "MW_MAT_EXO_138"
      ],
      "recipeManuscripts": [
        "MW_REC_012",
        "MW_REC_030",
        "MW_REC_048",
        "MW_REC_066",
        "MW_REC_084",
        "MW_REC_102"
      ],
      "eventIds": [
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_084",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตซากอุทยานสวรรค์ร่วงหล่น"
    },
    {
      "id": "MW_POOL_11_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "environmentNameTh": "ซากอุทยานสวรรค์ร่วงหล่น",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ซากอุทยานสวรรค์ร่วงหล่น · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 54,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_085",
        "MW_BEAST_088",
        "NW_BEAST_067"
      ],
      "resourceEntries": [
        "MAT_BP_DRAGON_SCALE_7",
        "NW_MAT_022",
        "NW_MAT_037",
        "NW_MAT_076",
        "NW_MAT_239",
        "MAT_MW_ORGAN_021",
        "MW_MAT_EXO_110",
        "MW_MAT_BP_188"
      ],
      "recipeManuscripts": [
        "MW_REC_011",
        "MW_REC_029",
        "MW_REC_047",
        "MW_REC_065",
        "MW_REC_083",
        "MW_REC_101"
      ],
      "eventIds": [
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_097",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตซากอุทยานสวรรค์ร่วงหล่น"
    },
    {
      "id": "MW_POOL_11_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "environmentNameTh": "ซากอุทยานสวรรค์ร่วงหล่น",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ซากอุทยานสวรรค์ร่วงหล่น · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 60,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_083",
        "MW_BEAST_086",
        "MW_BEAST_089"
      ],
      "resourceEntries": [
        "MAT_TR_HEAVEN_EDICT_SILK",
        "NW_MAT_029",
        "NW_MAT_075",
        "NW_MAT_149",
        "MAT_BP_CELESTIAL_CRANE_PLUME_4",
        "MW_MAT_EXO_106",
        "MW_MAT_EXO_138",
        "MW_MAT_BP_195"
      ],
      "recipeManuscripts": [
        "MW_REC_010",
        "MW_REC_028",
        "MW_REC_046",
        "MW_REC_064",
        "MW_REC_082",
        "MW_REC_100"
      ],
      "eventIds": [
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_110",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตซากอุทยานสวรรค์ร่วงหล่น"
    },
    {
      "id": "MW_POOL_11_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "environmentNameTh": "ซากอุทยานสวรรค์ร่วงหล่น",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ซากอุทยานสวรรค์ร่วงหล่น · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 66,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_084",
        "MW_BEAST_087",
        "MW_BEAST_090"
      ],
      "resourceEntries": [
        "MAT_HERB_IMMORTAL_PEACH_6",
        "MAT_HERB_BODHI_LEAF_5",
        "NW_MAT_037",
        "NW_MAT_076",
        "NW_MAT_204",
        "MAT_BP_CELESTIAL_CRANE_CORE_4",
        "MW_MAT_EXO_110",
        "MW_MAT_BP_188"
      ],
      "recipeManuscripts": [
        "MW_REC_009",
        "MW_REC_027",
        "MW_REC_045",
        "MW_REC_063",
        "MW_REC_081",
        "MW_REC_099"
      ],
      "eventIds": [
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_12_POISON_MIASMA_TIDE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_123",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตซากอุทยานสวรรค์ร่วงหล่น"
    },
    {
      "id": "MW_POOL_11_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_11_CELESTIAL_GARDEN_RUINS",
      "environmentNameTh": "ซากอุทยานสวรรค์ร่วงหล่น",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ซากอุทยานสวรรค์ร่วงหล่น · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 72,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_085",
        "MW_BEAST_088",
        "NW_BEAST_067"
      ],
      "resourceEntries": [
        "MAT_BP_HEAVEN_CORE_5",
        "NW_MAT_018",
        "NW_MAT_075",
        "NW_MAT_149",
        "NW_MAT_237",
        "MAT_MW_ORGAN_012",
        "MW_MAT_EXO_138",
        "MW_MAT_BP_195"
      ],
      "recipeManuscripts": [
        "MW_REC_008",
        "MW_REC_026",
        "MW_REC_044",
        "MW_REC_062",
        "MW_REC_080",
        "MW_REC_098"
      ],
      "eventIds": [
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR",
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_011",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตซากอุทยานสวรรค์ร่วงหล่น"
    },
    {
      "id": "MW_POOL_12_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "environmentNameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 34,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_091",
        "MW_BEAST_094",
        "MW_BEAST_097",
        "NW_BEAST_030",
        "NW_BEAST_091",
        "NW_BEAST_095",
        "NW_BEAST_099"
      ],
      "resourceEntries": [
        "MAT_HERB_BLOOD_GINSENG_3",
        "NW_MAT_001",
        "NW_MAT_012",
        "NW_MAT_063",
        "NW_MAT_168",
        "NW_MAT_184",
        "NW_MAT_205",
        "MAT_LIQ_EARTH_MARROW_4",
        "MAT_MW_ORGAN_016",
        "MW_MAT_HERB_019",
        "MW_MAT_ORE_056",
        "MW_MAT_ORE_074",
        "MW_MAT_BP_166"
      ],
      "recipeManuscripts": [
        "MW_REC_007",
        "MW_REC_025",
        "MW_REC_043",
        "MW_REC_061",
        "MW_REC_079",
        "MW_REC_097"
      ],
      "eventIds": [
        "MW_EVT_12_POISON_MIASMA_TIDE",
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_078",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตสมรภูมิศาสตราหักและสุสานกระดูกโบราณ"
    },
    {
      "id": "MW_POOL_12_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "environmentNameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 40,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_092",
        "MW_BEAST_095",
        "MW_BEAST_098",
        "NW_BEAST_085",
        "NW_BEAST_093",
        "NW_BEAST_097",
        "NW_BEAST_100"
      ],
      "resourceEntries": [
        "MAT_BP_TIGER_BONE_6",
        "NW_MAT_002",
        "NW_MAT_014",
        "NW_MAT_082",
        "NW_MAT_170",
        "NW_MAT_195",
        "NW_MAT_233",
        "MAT_BP_ABYSS_FIEND_HEART_4",
        "MAT_MW_ORGAN_030",
        "MW_MAT_HERB_030",
        "MW_MAT_ORE_066",
        "MW_MAT_EXO_108",
        "MW_MAT_BP_187"
      ],
      "recipeManuscripts": [
        "MW_REC_006",
        "MW_REC_024",
        "MW_REC_042",
        "MW_REC_060",
        "MW_REC_078",
        "MW_REC_096"
      ],
      "eventIds": [
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_091",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตสมรภูมิศาสตราหักและสุสานกระดูกโบราณ"
    },
    {
      "id": "MW_POOL_12_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "environmentNameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 46,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_093",
        "MW_BEAST_096",
        "BEAST_BLOOD_TIGER",
        "NW_BEAST_090",
        "NW_BEAST_094",
        "NW_BEAST_098",
        "BEAST_ABYSS_BLOOD_FIEND"
      ],
      "resourceEntries": [
        "MAT_TR_IMMORTAL_BEAST_MARROW",
        "NW_MAT_012",
        "NW_MAT_063",
        "NW_MAT_124",
        "NW_MAT_171",
        "NW_MAT_205",
        "MAT_LIQ_EARTH_MARROW_4",
        "MAT_BP_ABYSS_FIEND_FANG_4",
        "MW_MAT_HERB_004",
        "MW_MAT_ORE_056",
        "MW_MAT_ORE_074",
        "MW_MAT_EXO_128",
        "MW_MAT_BP_194"
      ],
      "recipeManuscripts": [
        "MW_REC_005",
        "MW_REC_023",
        "MW_REC_041",
        "MW_REC_059",
        "MW_REC_077",
        "MW_REC_095"
      ],
      "eventIds": [
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_104",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตสมรภูมิศาสตราหักและสุสานกระดูกโบราณ"
    },
    {
      "id": "MW_POOL_12_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "environmentNameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 52,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_091",
        "MW_BEAST_094",
        "MW_BEAST_097",
        "NW_BEAST_030",
        "NW_BEAST_091",
        "NW_BEAST_095",
        "NW_BEAST_099"
      ],
      "resourceEntries": [
        "MAT_FORM_VOID_COMPASS_SHARD_5",
        "NW_MAT_014",
        "NW_MAT_082",
        "NW_MAT_161",
        "NW_MAT_172",
        "NW_MAT_233",
        "MAT_BP_ABYSS_FIEND_HEART_4",
        "MAT_MW_ORGAN_013",
        "MW_MAT_HERB_017",
        "MW_MAT_ORE_066",
        "MW_MAT_EXO_108",
        "MW_MAT_BP_162"
      ],
      "recipeManuscripts": [
        "MW_REC_004",
        "MW_REC_022",
        "MW_REC_040",
        "MW_REC_058",
        "MW_REC_076",
        "MW_REC_094"
      ],
      "eventIds": [
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL",
        "MW_EVT_09_SYMBIOTIC_SPIRIT_SPRING"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_117",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตสมรภูมิศาสตราหักและสุสานกระดูกโบราณ"
    },
    {
      "id": "MW_POOL_12_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "environmentNameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 58,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_092",
        "MW_BEAST_095",
        "MW_BEAST_098",
        "NW_BEAST_085",
        "NW_BEAST_093",
        "NW_BEAST_097",
        "NW_BEAST_100"
      ],
      "resourceEntries": [
        "MAT_HERB_BLOOD_GINSENG_3",
        "NW_MAT_001",
        "NW_MAT_063",
        "NW_MAT_124",
        "NW_MAT_168",
        "NW_MAT_184",
        "MAT_LIQ_EARTH_MARROW_4",
        "MAT_BP_ABYSS_FIEND_FANG_4",
        "MAT_MW_ORGAN_016",
        "MW_MAT_HERB_019",
        "MW_MAT_ORE_074",
        "MW_MAT_EXO_128",
        "MW_MAT_BP_166"
      ],
      "recipeManuscripts": [
        "MW_REC_003",
        "MW_REC_021",
        "MW_REC_039",
        "MW_REC_057",
        "MW_REC_075",
        "MW_REC_093"
      ],
      "eventIds": [
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM",
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
        "MW_EVT_13_FALLING_STAR_FRAGMENT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_005",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตสมรภูมิศาสตราหักและสุสานกระดูกโบราณ"
    },
    {
      "id": "MW_POOL_12_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_12_ANCIENT_BATTLEFIELD",
      "environmentNameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "สมรภูมิศาสตราหักและสุสานกระดูกโบราณ · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 2,
      "maxTier": 6,
      "dangerBase": 64,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_093",
        "MW_BEAST_096",
        "BEAST_BLOOD_TIGER",
        "NW_BEAST_090",
        "NW_BEAST_094",
        "NW_BEAST_098",
        "BEAST_ABYSS_BLOOD_FIEND"
      ],
      "resourceEntries": [
        "MAT_BP_TIGER_BONE_6",
        "NW_MAT_002",
        "NW_MAT_082",
        "NW_MAT_161",
        "NW_MAT_170",
        "NW_MAT_195",
        "MAT_BP_ABYSS_FIEND_HEART_4",
        "MAT_MW_ORGAN_013",
        "MAT_MW_ORGAN_030",
        "MW_MAT_HERB_030",
        "MW_MAT_EXO_108",
        "MW_MAT_BP_162",
        "MW_MAT_BP_187"
      ],
      "recipeManuscripts": [
        "MW_REC_002",
        "MW_REC_020",
        "MW_REC_038",
        "MW_REC_056",
        "MW_REC_074",
        "MW_REC_092"
      ],
      "eventIds": [
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER",
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM",
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_018",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตสมรภูมิศาสตราหักและสุสานกระดูกโบราณ"
    },
    {
      "id": "MW_POOL_13_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "environmentNameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 26,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_099",
        "MW_BEAST_102",
        "MW_BEAST_105",
        "NW_BEAST_013",
        "NW_BEAST_020",
        "NW_BEAST_028"
      ],
      "resourceEntries": [
        "MAT_BP_WOLF_FANG_1",
        "NW_MAT_036",
        "NW_MAT_071",
        "NW_MAT_083",
        "NW_MAT_145",
        "MAT_BP_CLOUDFOX_FUR_2",
        "MAT_BP_CLOUD_QILIN_HORN_3",
        "MAT_MW_ORGAN_018",
        "MW_MAT_ORE_078",
        "MW_MAT_EXO_116",
        "MW_MAT_BP_143"
      ],
      "recipeManuscripts": [
        "MW_REC_001",
        "MW_REC_019",
        "MW_REC_037",
        "MW_REC_055",
        "MW_REC_073",
        "MW_REC_091"
      ],
      "eventIds": [
        "MW_EVT_13_FALLING_STAR_FRAGMENT",
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL",
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_085",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตเสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด"
    },
    {
      "id": "MW_POOL_13_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "environmentNameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 32,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_100",
        "MW_BEAST_103",
        "MW_BEAST_106",
        "NW_BEAST_014",
        "NW_BEAST_022",
        "NW_BEAST_058"
      ],
      "resourceEntries": [
        "MAT_BP_PYTHON_SCALE_3",
        "NW_MAT_062",
        "NW_MAT_077",
        "NW_MAT_089",
        "NW_MAT_154",
        "MAT_BP_CLOUD_SINEW_2",
        "MAT_BP_QILIN_CORE_3",
        "MW_MAT_HERB_007",
        "MW_MAT_ORE_090",
        "MW_MAT_EXO_132",
        "MW_MAT_BP_169"
      ],
      "recipeManuscripts": [
        "MW_REC_018",
        "MW_REC_036",
        "MW_REC_054",
        "MW_REC_072",
        "MW_REC_090",
        "MW_REC_108"
      ],
      "eventIds": [
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_098",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตเสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด"
    },
    {
      "id": "MW_POOL_13_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "environmentNameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 38,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_101",
        "MW_BEAST_104",
        "BEAST_MIST_WOLF",
        "NW_BEAST_015",
        "NW_BEAST_024",
        "BEAST_CELESTIAL_CRANE"
      ],
      "resourceEntries": [
        "NW_MAT_031",
        "NW_MAT_071",
        "NW_MAT_083",
        "NW_MAT_095",
        "NW_MAT_191",
        "MAT_BP_CLOUD_QILIN_HORN_3",
        "MAT_MW_ORGAN_018",
        "MW_MAT_HERB_021",
        "MW_MAT_ORE_095",
        "MW_MAT_BP_143"
      ],
      "recipeManuscripts": [
        "MW_REC_017",
        "MW_REC_035",
        "MW_REC_053",
        "MW_REC_071",
        "MW_REC_089",
        "MW_REC_107"
      ],
      "eventIds": [
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM",
        "MW_EVT_06_ABANDONED_ALCHEMY_GROTTO"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_111",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตเสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด"
    },
    {
      "id": "MW_POOL_13_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "environmentNameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 44,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_099",
        "MW_BEAST_102",
        "MW_BEAST_105",
        "NW_BEAST_013",
        "NW_BEAST_020",
        "NW_BEAST_028"
      ],
      "resourceEntries": [
        "NW_MAT_033",
        "NW_MAT_077",
        "NW_MAT_089",
        "NW_MAT_119",
        "NW_MAT_192",
        "MAT_BP_QILIN_CORE_3",
        "MW_MAT_HERB_007",
        "MW_MAT_ORE_071",
        "MW_MAT_EXO_102",
        "MW_MAT_BP_169"
      ],
      "recipeManuscripts": [
        "MW_REC_016",
        "MW_REC_034",
        "MW_REC_052",
        "MW_REC_070",
        "MW_REC_088",
        "MW_REC_106"
      ],
      "eventIds": [
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR",
        "MW_EVT_10_ANCIENT_SWORD_TOMB_RESONANCE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_124",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตเสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด"
    },
    {
      "id": "MW_POOL_13_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "environmentNameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 50,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_100",
        "MW_BEAST_103",
        "MW_BEAST_106",
        "NW_BEAST_014",
        "NW_BEAST_022",
        "NW_BEAST_058"
      ],
      "resourceEntries": [
        "MAT_BP_WOLF_FANG_1",
        "NW_MAT_036",
        "NW_MAT_083",
        "NW_MAT_095",
        "NW_MAT_145",
        "MAT_BP_CLOUDFOX_FUR_2",
        "MAT_MW_ORGAN_018",
        "MW_MAT_HERB_021",
        "MW_MAT_ORE_078",
        "MW_MAT_EXO_116"
      ],
      "recipeManuscripts": [
        "MW_REC_015",
        "MW_REC_033",
        "MW_REC_051",
        "MW_REC_069",
        "MW_REC_087",
        "MW_REC_105"
      ],
      "eventIds": [
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR",
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER",
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_012",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตเสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด"
    },
    {
      "id": "MW_POOL_13_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_13_KARST_WIND_PILLARS",
      "environmentNameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "เสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 1,
      "maxTier": 5,
      "dangerBase": 56,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_101",
        "MW_BEAST_104",
        "BEAST_MIST_WOLF",
        "NW_BEAST_015",
        "NW_BEAST_024",
        "BEAST_CELESTIAL_CRANE"
      ],
      "resourceEntries": [
        "MAT_BP_PYTHON_SCALE_3",
        "NW_MAT_062",
        "NW_MAT_089",
        "NW_MAT_119",
        "NW_MAT_154",
        "MAT_BP_CLOUD_SINEW_2",
        "MW_MAT_HERB_007",
        "MW_MAT_ORE_071",
        "MW_MAT_ORE_090",
        "MW_MAT_EXO_132"
      ],
      "recipeManuscripts": [
        "MW_REC_014",
        "MW_REC_032",
        "MW_REC_050",
        "MW_REC_068",
        "MW_REC_086",
        "MW_REC_104"
      ],
      "eventIds": [
        "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE",
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_025",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตเสาหินปูนเสียดฟ้าและหุบเหวสายลมคมมีด"
    },
    {
      "id": "MW_POOL_14_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_14_STARFALL_CRATER",
      "environmentNameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 42,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_107",
        "MW_BEAST_110",
        "MW_BEAST_113",
        "BEAST_ASTRAL_VOID_HAWK_5",
        "NW_BEAST_035"
      ],
      "resourceEntries": [
        "MAT_ORE_METEOR_IRON_5",
        "NW_MAT_157",
        "NW_MAT_232",
        "MW_MAT_ORE_093"
      ],
      "recipeManuscripts": [
        "MW_REC_013",
        "MW_REC_031",
        "MW_REC_049",
        "MW_REC_067",
        "MW_REC_085",
        "MW_REC_103"
      ],
      "eventIds": [
        "MW_EVT_14_GHOST_SCHOLAR_PAVILION",
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR",
        "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_092",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตหลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง"
    },
    {
      "id": "MW_POOL_14_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_14_STARFALL_CRATER",
      "environmentNameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 48,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_108",
        "MW_BEAST_111",
        "MW_BEAST_114",
        "NW_BEAST_011",
        "NW_BEAST_077"
      ],
      "resourceEntries": [
        "MAT_BP_PYTHON_TENDON_3",
        "NW_MAT_202",
        "MAT_MW_ORGAN_019",
        "MW_MAT_BP_155"
      ],
      "recipeManuscripts": [
        "MW_REC_012",
        "MW_REC_030",
        "MW_REC_048",
        "MW_REC_066",
        "MW_REC_084",
        "MW_REC_102"
      ],
      "eventIds": [
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT",
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER",
        "MW_EVT_03_MIGRATING_BEAST_HERD"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_105",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตหลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง"
    },
    {
      "id": "MW_POOL_14_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_14_STARFALL_CRATER",
      "environmentNameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 54,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_109",
        "MW_BEAST_112",
        "MW_BEAST_115",
        "NW_BEAST_012",
        "NW_BEAST_079"
      ],
      "resourceEntries": [
        "NW_MAT_125",
        "NW_MAT_232",
        "MW_MAT_ORE_093",
        "MW_MAT_BP_185"
      ],
      "recipeManuscripts": [
        "MW_REC_011",
        "MW_REC_029",
        "MW_REC_047",
        "MW_REC_065",
        "MW_REC_083",
        "MW_REC_101"
      ],
      "eventIds": [
        "MW_EVT_18_MIRROR_LAKE_HEART_TRIAL",
        "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE",
        "MW_EVT_07_HIDDEN_MASTER_MURAL"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_118",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตหลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง"
    },
    {
      "id": "MW_POOL_14_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_14_STARFALL_CRATER",
      "environmentNameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 60,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_107",
        "MW_BEAST_110",
        "MW_BEAST_113",
        "BEAST_ASTRAL_VOID_HAWK_5",
        "NW_BEAST_035"
      ],
      "resourceEntries": [
        "NW_MAT_142",
        "MAT_MW_ORGAN_019",
        "MW_MAT_BP_155"
      ],
      "recipeManuscripts": [
        "MW_REC_010",
        "MW_REC_028",
        "MW_REC_046",
        "MW_REC_064",
        "MW_REC_082",
        "MW_REC_100"
      ],
      "eventIds": [
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM",
        "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET",
        "MW_EVT_11_MOLTING_CRYSTAL_BEAST"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_006",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตหลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง"
    },
    {
      "id": "MW_POOL_14_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_14_STARFALL_CRATER",
      "environmentNameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 66,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_108",
        "MW_BEAST_111",
        "MW_BEAST_114",
        "NW_BEAST_011",
        "NW_BEAST_077"
      ],
      "resourceEntries": [
        "MAT_ORE_METEOR_IRON_5",
        "NW_MAT_157",
        "MW_MAT_ORE_093",
        "MW_MAT_BP_185"
      ],
      "recipeManuscripts": [
        "MW_REC_009",
        "MW_REC_027",
        "MW_REC_045",
        "MW_REC_063",
        "MW_REC_081",
        "MW_REC_099"
      ],
      "eventIds": [
        "MW_EVT_22_FROZEN_IMMORTAL_IN_GLACIER",
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP",
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_019",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตหลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง"
    },
    {
      "id": "MW_POOL_14_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_14_STARFALL_CRATER",
      "environmentNameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "หลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 3,
      "maxTier": 7,
      "dangerBase": 72,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_109",
        "MW_BEAST_112",
        "MW_BEAST_115",
        "NW_BEAST_012",
        "NW_BEAST_079"
      ],
      "resourceEntries": [
        "MAT_BP_PYTHON_TENDON_3",
        "NW_MAT_202",
        "MW_MAT_BP_155"
      ],
      "recipeManuscripts": [
        "MW_REC_008",
        "MW_REC_026",
        "MW_REC_044",
        "MW_REC_062",
        "MW_REC_080",
        "MW_REC_098"
      ],
      "eventIds": [
        "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET",
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF",
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_032",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตหลุมอุกกาบาตดาราตกและทุ่งแรงโน้มถ่วง"
    },
    {
      "id": "MW_POOL_15_01_PREDATOR_TERRITORY",
      "environmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "environmentNameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ",
      "themeCode": "PREDATOR_TERRITORY",
      "nameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ · เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "shortTh": "เขตล่าอสูรเจ้าถิ่นและทางผ่านฝูงสัตว์",
      "weight": 24,
      "minTier": 4,
      "maxTier": 7,
      "dangerBase": 50,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.42,
        "RESOURCE": 0.28,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_116",
        "MW_BEAST_119",
        "MW_BEAST_122",
        "MW_BEAST_125",
        "NW_BEAST_096"
      ],
      "resourceEntries": [
        "MAT_TR_WORLD_FORGE_SHARD",
        "NW_MAT_137",
        "MAT_ORE_CHAOS_VOID_JADE_6",
        "MAT_MW_ORGAN_040",
        "MW_MAT_ORE_083"
      ],
      "recipeManuscripts": [
        "MW_REC_007",
        "MW_REC_025",
        "MW_REC_043",
        "MW_REC_061",
        "MW_REC_079",
        "MW_REC_097"
      ],
      "eventIds": [
        "MW_EVT_15_SUBTERRANEAN_THERMAL_GEYSER",
        "MW_EVT_24_VOID_CHRONO_GARDEN_POCKET"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_099",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการเผชิญหน้าสัตว์อสูร ร่องรอยการล่า การเก็บคราบที่ผลัดทิ้ง และการชำแหละชิ้นส่วน ในเขตชายขอบรอยแยกสุญตาและมิติซ้อนทับ"
    },
    {
      "id": "MW_POOL_15_02_BOTANICAL_SYMBIOSIS",
      "environmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "environmentNameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ",
      "themeCode": "BOTANICAL_SYMBIOSIS",
      "nameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ · แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "shortTh": "แหล่งสมุนไพรทิพย์และนิเวศพึ่งพา",
      "weight": 22,
      "minTier": 4,
      "maxTier": 7,
      "dangerBase": 56,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_117",
        "MW_BEAST_120",
        "MW_BEAST_123",
        "NW_BEAST_074"
      ],
      "resourceEntries": [
        "MAT_ORE_YINYANG_STONE_6",
        "NW_MAT_141",
        "MAT_MW_ORGAN_027",
        "MW_MAT_HERB_039",
        "MW_MAT_EXO_126"
      ],
      "recipeManuscripts": [
        "MW_REC_006",
        "MW_REC_024",
        "MW_REC_042",
        "MW_REC_060",
        "MW_REC_078",
        "MW_REC_096"
      ],
      "eventIds": [
        "MW_EVT_17_THUNDER_STRUCK_SPIRIT_VEIN",
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP",
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_112",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "อุดมด้วยสมุนไพรตามสภาพแวดล้อม ยางไม้ น้ำค้าง และอสูรผู้ดูแลพืชพรรณ ในเขตชายขอบรอยแยกสุญตาและมิติซ้อนทับ"
    },
    {
      "id": "MW_POOL_15_03_MINERAL_EXCAVATION",
      "environmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "environmentNameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ",
      "themeCode": "MINERAL_EXCAVATION",
      "nameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ · สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "shortTh": "สายแร่ปราณและโพรงผลึกธรรมชาติ",
      "weight": 20,
      "minTier": 4,
      "maxTier": 7,
      "dangerBase": 62,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.28,
        "RESOURCE": 0.38,
        "EVENT": 0.14,
        "MANUSCRIPT": 0.06
      },
      "residentBeasts": [
        "MW_BEAST_118",
        "MW_BEAST_121",
        "MW_BEAST_124",
        "NW_BEAST_075"
      ],
      "resourceEntries": [
        "MAT_FORM_ANCIENT_RUNE_TABLET_7",
        "MAT_ORE_CHAOS_VOID_JADE_6",
        "MAT_MW_ORGAN_040",
        "MW_MAT_ORE_079",
        "MW_MAT_BP_141"
      ],
      "recipeManuscripts": [
        "MW_REC_005",
        "MW_REC_023",
        "MW_REC_041",
        "MW_REC_059",
        "MW_REC_077",
        "MW_REC_095"
      ],
      "eventIds": [
        "MW_EVT_19_LOST_CARAVAN_IN_SANDSTORM",
        "MW_EVT_02_RIVAL_CULTIVATOR_STANDOFF",
        "MW_EVT_08_CONTESTED_ANCIENT_CORPSE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_125",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "เน้นการขุดค้นสายแร่ ผลึกปราณ ดินศักดิ์สิทธิ์ และอสูรเกราะแข็งที่อาศัยตามโขดหิน ในเขตชายขอบรอยแยกสุญตาและมิติซ้อนทับ"
    },
    {
      "id": "MW_POOL_15_04_ABANDONED_REFUGE",
      "environmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "environmentNameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ",
      "themeCode": "ABANDONED_REFUGE",
      "nameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ · ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "shortTh": "ที่พำนักร้างและบันทึกผู้ฝึกตนโบราณ",
      "weight": 16,
      "minTier": 4,
      "maxTier": 7,
      "dangerBase": 68,
      "encounterBudget": [
        2,
        4
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_116",
        "MW_BEAST_119",
        "MW_BEAST_122",
        "MW_BEAST_125",
        "NW_BEAST_096"
      ],
      "resourceEntries": [
        "NW_MAT_074",
        "MAT_MW_ORGAN_027",
        "MW_MAT_HERB_039",
        "MW_MAT_ORE_082",
        "MW_MAT_BP_190"
      ],
      "recipeManuscripts": [
        "MW_REC_004",
        "MW_REC_022",
        "MW_REC_040",
        "MW_REC_058",
        "MW_REC_076",
        "MW_REC_094"
      ],
      "eventIds": [
        "MW_EVT_21_ABYSSAL_PEARL_ALTAR",
        "MW_EVT_03_MIGRATING_BEAST_HERD",
        "MW_EVT_12_POISON_MIASMA_TIDE"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_013",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พบเตาหลอมร้าง ค่ายพักแรมเก่า เศษคัมภีร์ ตำรับโอสถ/ศาสตรา และศาสตราตกค้าง ในเขตชายขอบรอยแยกสุญตาและมิติซ้อนทับ"
    },
    {
      "id": "MW_POOL_15_05_ESSENCE_PHENOMENON",
      "environmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "environmentNameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ",
      "themeCode": "ESSENCE_PHENOMENON",
      "nameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ · ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "shortTh": "ใจกลางกระแสปราณและอสูรกลายพันธุ์",
      "weight": 11,
      "minTier": 4,
      "maxTier": 7,
      "dangerBase": 74,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_117",
        "MW_BEAST_120",
        "MW_BEAST_123",
        "NW_BEAST_074"
      ],
      "resourceEntries": [
        "MAT_TR_WORLD_FORGE_SHARD",
        "NW_MAT_137",
        "MAT_MW_ORGAN_040",
        "MW_MAT_ORE_079",
        "MW_MAT_ORE_083"
      ],
      "recipeManuscripts": [
        "MW_REC_003",
        "MW_REC_021",
        "MW_REC_039",
        "MW_REC_057",
        "MW_REC_075",
        "MW_REC_093"
      ],
      "eventIds": [
        "MW_EVT_23_KARST_SKY_BRIDGE_SHRINE",
        "MW_EVT_04_WOUNDED_GUARDIAN_BEAST",
        "MW_EVT_16_ANCIENT_TREE_HOLLOW_VAULT"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_026",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "ปราณธาตุเข้มข้นสูง มีโอกาสพบอสูรที่มีอวัยวะพิเศษกลายพันธุ์ ของเหลววิญญาณ และสมุนไพรระดับสูง ในเขตชายขอบรอยแยกสุญตาและมิติซ้อนทับ"
    },
    {
      "id": "MW_POOL_15_06_RIFT_INHERITANCE",
      "environmentId": "MW_ENV_15_VOID_FRACTURE_MARGIN",
      "environmentNameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ",
      "themeCode": "RIFT_INHERITANCE",
      "nameTh": "ชายขอบรอยแยกสุญตาและมิติซ้อนทับ · รอยแยกบรรพกาลและมรดกข้ามภพ",
      "shortTh": "รอยแยกบรรพกาลและมรดกข้ามภพ",
      "weight": 7,
      "minTier": 4,
      "maxTier": 7,
      "dangerBase": 80,
      "encounterBudget": [
        3,
        5
      ],
      "categoryWeights": {
        "BEAST": 0.34,
        "RESOURCE": 0.28,
        "EVENT": 0.22,
        "MANUSCRIPT": 0.16
      },
      "residentBeasts": [
        "MW_BEAST_118",
        "MW_BEAST_121",
        "MW_BEAST_124",
        "NW_BEAST_075"
      ],
      "resourceEntries": [
        "MAT_ORE_YINYANG_STONE_6",
        "NW_MAT_141",
        "MW_MAT_HERB_039",
        "MW_MAT_ORE_082",
        "MW_MAT_EXO_126"
      ],
      "recipeManuscripts": [
        "MW_REC_002",
        "MW_REC_020",
        "MW_REC_038",
        "MW_REC_056",
        "MW_REC_074",
        "MW_REC_092"
      ],
      "eventIds": [
        "MW_EVT_01_PREVIOUS_EXPEDITION_CAMP",
        "MW_EVT_05_UNSTABLE_SPATIAL_RIFT",
        "MW_EVT_20_PARASITIC_CORDYCEPS_BLOOM"
      ],
      "anomaly": {
        "chance": 0.035,
        "displacedBeastId": "MW_BEAST_039",
        "reasonTh": "รอยแยกมิติขนาดเล็กพัดพาสิ่งมีชีวิตจากภพอื่นหลุดเข้ามาในพื้นที่"
      },
      "descTh": "พื้นที่หายากใกล้รอยต่อมิติ มีโอกาสพบวัตถุดิบเหนือโลก แท่นศิลาจารึกวิชา และอสูรระดับตำนาน ในเขตชายขอบรอยแยกสุญตาและมิติซ้อนทับ"
    }
  ]
};

function registerMyriadWorldsCatalogs() {
  const E = root.World2026Engine;
  const D = E?.PATCH140_DATA;
  if (!E || !D) return false;

  const addUnique = (arr, items) => {
    if (!Array.isArray(arr)) return;
    const map = new Map(arr.map(x => [x.id, x]));
    for (const item of items) {
      if (!map.has(item.id)) {
        arr.push(item);
        map.set(item.id, item);
      } else {
        Object.assign(map.get(item.id), item);
      }
    }
  };

  // 1. Apply NW_BEAST drop fixups so all 19 previously orphaned NW_MAT_* beast parts drop from their matching species
  if (Array.isArray(D.BEAST_SPECIES_V140)) {
    for (const b of D.BEAST_SPECIES_V140) {
      const fixups = DATA.nwBeastDropFixups[b.id];
      if (fixups) {
        b.partDrops = b.partDrops || [];
        for (const f of fixups) {
          if (!b.partDrops.some(d => d.matId === f.matId)) {
            b.partDrops.push({ matId: f.matId, anatomyType: f.anatomyType });
          }
        }
        b.maxDropSlots = Math.max(b.maxDropSlots || 3, b.partDrops.length);
      }
      // Also attach default eligibleRareOrgans to baseline beasts if not present
      if (!b.eligibleRareOrgans) {
        const tier = b.tier || 1;
        b.eligibleRareOrgans = DATA.rareOrgans
          .filter(o => Math.abs(o.tier - tier) <= 1 && (o.element === b.element || o.element === 'EARTH' || o.element === 'WOOD'))
          .slice(0, 2)
          .map(o => o.id);
        if (!b.eligibleRareOrgans.length) {
          b.eligibleRareOrgans = [DATA.rareOrgans[tier % DATA.rareOrgans.length].id];
        }
      }
      if (!b.affordances) {
        b.affordances = b.sanctuaryResident
          ? ['OBSERVE', 'OFFERING', 'HARVEST_SHED', 'TAME']
          : ['OBSERVE', 'AVOID', 'TRACK', 'INTIMIDATE', 'HARVEST_SHED', 'COMBAT'];
      }
    }
  }

  // 2. Register 235 new materials, 125 new base beasts, and 165 new recipes
  addUnique(D.MATERIALS_REGISTRY_V140, DATA.newMaterials);
  addUnique(D.BEAST_SPECIES_V140, DATA.newBeasts);
  addUnique(D.STARTER_RECIPES_V140, DATA.newRecipes);

  E.registerExternalMaterialsV140?.(DATA.newMaterials);
  E.registerExternalBeastSpeciesV140?.(DATA.newBeasts);

  if (root.JianghuExpansionV111) {
    root.JianghuExpansionV111.myriadMaterialsV200 = DATA.newMaterials;
    root.JianghuExpansionV111.myriadBeastsV200 = DATA.newBeasts;
    root.JianghuExpansionV111.myriadRecipesV200 = DATA.newRecipes;
  }
  return true;
}

registerMyriadWorldsCatalogs();

const origCreateWorld = root.World2026Engine?.createInitialWorld;
if (typeof origCreateWorld === 'function' && !root.World2026Engine.__myriadWorldsCatalogsWrapped) {
  root.World2026Engine.createInitialWorld = function(...args) {
    const world = origCreateWorld.apply(this, args);
    registerMyriadWorldsCatalogs();
    // Ensure all higherRealmLegacies include Myriad Worlds heritage origin IDs so transcendent drops carry valid HERITAGE_SITE provenance
    if (world?.jianghu) {
      world.jianghu.higherRealmLegacies = world.jianghu.higherRealmLegacies || [];
      const mwLegacyIds = ['LEG_MYRIAD_WORLDS', 'LEG_MW_CELESTIAL_GARDEN', 'LEG_MW_STARFALL_CRATER', 'LEG_MW_VOID_MARGIN'];
      for (const lid of mwLegacyIds) {
        if (!world.jianghu.higherRealmLegacies.some(x => x.id === lid)) {
          world.jianghu.higherRealmLegacies.push({ id: lid, nameTh: 'มรดกแดนหมื่นภพ (' + lid + ')', tier: 7 });
        }
      }
    }
    return world;
  };
  root.World2026Engine.__myriadWorldsCatalogsWrapped = true;
}

DATA.registerCatalogs = registerMyriadWorldsCatalogs;
DATA.organMap = new Map(DATA.rareOrgans.map(o => [o.id, o]));
DATA.organMatMap = new Map(DATA.rareOrgans.map(o => [o.matId, o]));
DATA.environmentMap = new Map(DATA.environments.map(e => [e.id, e]));
DATA.poolMap = new Map(DATA.pools.map(p => [p.id, p]));
DATA.eventMap = new Map(DATA.explorationEvents.map(ev => [ev.id, ev]));
DATA.beastMap = new Map(DATA.newBeasts.map(b => [b.id, b]));
DATA.materialMap = new Map(DATA.newMaterials.map(m => [m.id, m]));
DATA.recipeMap = new Map(DATA.newRecipes.map(r => [r.id, r]));

root.JianghuMyriadWorldsData = DATA;
if (typeof module === 'object' && module.exports) module.exports = DATA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
