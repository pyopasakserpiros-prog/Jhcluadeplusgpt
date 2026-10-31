'use strict';
const fs = require('fs');
const path = require('path');

const FAMILIES = [
  {
    code: 'CANINE', nameTh: 'ตระกูลสุนัข/หมาป่า', archetype: 'CANINE',
    partA: { anatomy: 'FANG_CLAW', craft: 'FORGING', labelTh: 'เขี้ยว' },
    partB: { anatomy: 'HIDE_PELT', craft: 'FORGING', labelTh: 'หนัง' },
    tiers: [
      { t: 1, name: 'หมาป่าหมอกคราม', elem: 'WIND', cp: 95, terr: 'forest', body: '#718fa7', acc: '#c8e9f1' },
      { t: 2, name: 'หมาป่าเงาจันทร์', elem: 'YIN_SHADOW', cp: 215, terr: 'forest', body: '#4a5b6d', acc: '#8ba4b8' },
      { t: 3, name: 'สุนัขป่าลมกรดทักษิณ', elem: 'WIND', cp: 460, terr: 'plains', body: '#7d8a6e', acc: '#c2d4a6' },
      { t: 4, name: 'หมาป่าโลหิตกระหายศึก', elem: 'BLOOD_DEMON', cp: 980, terr: 'mountain', body: '#8a3a3a', acc: '#d86262' },
      { t: 5, name: 'จิ้งจอกเงินเก้าหางค้ำดึก', elem: 'ASTRAL', cp: 2500, terr: 'mountain', body: '#b8c4d1', acc: '#f0f4f8' },
      { t: 6, name: 'ราชันย์หมาป่ากลืนตะวัน', elem: 'FIRE', cp: 6500, terr: 'mountain', body: '#c26127', acc: '#f5b042' }
    ]
  },
  {
    code: 'FELINE', nameTh: 'ตระกูลเสือ/แมวป่า', archetype: 'FELINE',
    partA: { anatomy: 'FANG_CLAW', craft: 'FORGING', labelTh: 'กรงเล็บ' },
    partB: { anatomy: 'BLOOD', craft: 'ALCHEMY', labelTh: 'โลหิต' },
    tiers: [
      { t: 1, name: 'แมวป่าลายเสือหินผา', elem: 'EARTH_METAL', cp: 100, terr: 'mountain', body: '#968165', acc: '#d4c0a5' },
      { t: 2, name: 'เสือดาววายุไพร', elem: 'WIND', cp: 220, terr: 'forest', body: '#8c9c72', acc: '#c8deb0' },
      { t: 3, name: 'พยัคฆ์เขี้ยวดาบเกราะศิลา', elem: 'EARTH_METAL', cp: 470, terr: 'mountain', body: '#736d5e', acc: '#a89f8b' },
      { t: 4, name: 'เสือดาวเพลิงอสูร', elem: 'FIRE', cp: 1020, terr: 'desert', body: '#b5582f', acc: '#fab066' },
      { t: 5, name: 'พยัคฆ์ขาวเหมันต์ทะลวงเมฆ', elem: 'WATER_ICE', cp: 2600, terr: 'mountain', body: '#abbdd1', acc: '#eef6fc' },
      { t: 6, name: 'พยัคฆ์สายฟ้าทมิฬเก้าสวรรค์', elem: 'LIGHTNING', cp: 7200, terr: 'mountain', body: '#4a3b69', acc: '#b28df7' }
    ]
  },
  {
    code: 'URSINE', nameTh: 'ตระกูลหมี', archetype: 'URSINE',
    partA: { anatomy: 'BONE_HORN', craft: 'FORGING', labelTh: 'กระดูก' },
    partB: { anatomy: 'HEART_GALL', craft: 'ALCHEMY', labelTh: 'ถุงน้ำดี' },
    tiers: [
      { t: 1, name: 'หมีดำดงไผ่', elem: 'WOOD_LIFE', cp: 110, terr: 'forest', body: '#3c3a38', acc: '#706b67' },
      { t: 2, name: 'หมีหินผาทะลวงหุบเขา', elem: 'EARTH_METAL', cp: 235, terr: 'mountain', body: '#61584c', acc: '#998c7b' },
      { t: 3, name: 'หมีเพลิงพิโรธถ้ำลาวา', elem: 'FIRE', cp: 485, terr: 'mountain', body: '#853e28', acc: '#d66e4b' },
      { t: 4, name: 'หมีเกราะเหล็กไหลหลังทอง', elem: 'EARTH_METAL', cp: 1080, terr: 'mountain', body: '#575b63', acc: '#e6be43' },
      { t: 5, name: 'หมีพายุหิมะโบราณ', elem: 'WATER_ICE', cp: 2650, terr: 'mountain', body: '#a6becc', acc: '#e8f3f7' },
      { t: 6, name: 'ราชันย์หมีปฐพีสะเทือนฟ้า', elem: 'EARTH_METAL', cp: 7500, terr: 'mountain', body: '#57422f', acc: '#cfa878' }
    ]
  },
  {
    code: 'BOAR', nameTh: 'ตระกูลหมูป่า', archetype: 'BOAR',
    partA: { anatomy: 'BONE_HORN', craft: 'FORGING', labelTh: 'งา' },
    partB: { anatomy: 'HIDE_PELT', craft: 'FORGING', labelTh: 'หนังหนา' },
    tiers: [
      { t: 1, name: 'หมูป่าเขี้ยวสั้นหน้าผา', elem: 'EARTH_METAL', cp: 105, terr: 'plains', body: '#736151', acc: '#b59e89' },
      { t: 2, name: 'หมูป่าเกราะหนามโลหะ', elem: 'EARTH_METAL', cp: 225, terr: 'plains', body: '#5c5c5c', acc: '#a6a6a6' },
      { t: 3, name: 'หมูป่าดินโป่งปราณคราม', elem: 'WOOD_LIFE', cp: 450, terr: 'forest', body: '#4a6b57', acc: '#8fbaa0' },
      { t: 4, name: 'หมูป่าเขาศิลาอัคนี', elem: 'FIRE', cp: 1000, terr: 'mountain', body: '#8c4837', acc: '#e87c64' },
      { t: 5, name: 'หมูป่าเกราะเพชรโบราณ', elem: 'EARTH_METAL', cp: 2550, terr: 'mountain', body: '#6a7885', acc: '#cbe4fa' },
      { t: 6, name: 'พญาหมูป่าเก้าภูผาทลายทวีป', elem: 'EARTH_METAL', cp: 6800, terr: 'mountain', body: '#634938', acc: '#dba881' }
    ]
  },
  {
    code: 'SERPENT', nameTh: 'ตระกูลอสรพิษ/งู', archetype: 'SERPENT',
    partA: { anatomy: 'VENOM_GLAND', craft: 'ALCHEMY', labelTh: 'ต่อมพิษ' },
    partB: { anatomy: 'SCALE_CARAPACE', craft: 'FORGING', labelTh: 'เกล็ด' },
    tiers: [
      { t: 1, name: 'งูดงไผ่เขียวมรกต', elem: 'WOOD_LIFE', cp: 98, terr: 'forest', body: '#4b7549', acc: '#86c282' },
      { t: 2, name: 'งูพิษทรายแดง', elem: 'FIRE', cp: 215, terr: 'desert', body: '#945b46', acc: '#d69780' },
      { t: 3, name: 'เหลือมศิลาหุบเขาลึก', elem: 'EARTH_METAL', cp: 460, terr: 'mountain', body: '#5e5a52', acc: '#999285' },
      { t: 4, name: 'งูเห่าหมอกเหมันต์', elem: 'WATER_ICE', cp: 990, terr: 'mountain', body: '#6e899c', acc: '#b8daf0' },
      { t: 5, name: 'พญางูเหลือมเพลิงเก้าชีพจร', elem: 'FIRE', cp: 2500, terr: 'mountain', body: '#ad4931', acc: '#f79f65' },
      { t: 6, name: 'ราชันย์อสรพิษดำใต้พิภพบรรพกาล', elem: 'YIN_SHADOW', cp: 7400, terr: 'mountain', body: '#322c38', acc: '#7a668f' }
    ]
  },
  {
    code: 'AVIAN', nameTh: 'ตระกูลวิหค/อินทรี', archetype: 'AVIAN',
    partA: { anatomy: 'SPIRIT_HAIR_FEATHER', craft: 'TALISMAN', labelTh: 'ขนปีก' },
    partB: { anatomy: 'FANG_CLAW', craft: 'FORGING', labelTh: 'กรงเล็บ' },
    tiers: [
      { t: 1, name: 'เหยี่ยวลมกรดทุ่งหญ้า', elem: 'WIND', cp: 96, terr: 'plains', body: '#80776b', acc: '#c9bfb1' },
      { t: 2, name: 'นกกระเรียนหยกธารน้ำ', elem: 'WATER_ICE', cp: 210, terr: 'forest', body: '#5b827e', acc: '#aae0d9' },
      { t: 3, name: 'อินทรีศิลาหน้าผาสูง', elem: 'EARTH_METAL', cp: 470, terr: 'mountain', body: '#66615b', acc: '#ada79e' },
      { t: 4, name: 'เหยี่ยวเพลิงเมฆาสารท', elem: 'FIRE', cp: 1040, terr: 'mountain', body: '#a6543b', acc: '#fab082' },
      { t: 5, name: 'พญาอินทรีวายุสายฟ้า', elem: 'LIGHTNING', cp: 2600, terr: 'mountain', body: '#4b5780', acc: '#9bb2fc' },
      { t: 6, name: 'ราชันย์วิหคเพลิงอมฤตเก้าภพ', elem: 'LIGHT_YANG', cp: 8200, terr: 'mountain', body: '#bd4024', acc: '#ffd56b' }
    ]
  },
  {
    code: 'ARTHROPOD', nameTh: 'ตระกูลแมลง/แมงป่อง', archetype: 'ARTHROPOD',
    partA: { anatomy: 'VENOM_GLAND', craft: 'FORGING', labelTh: 'เหล็กใน' },
    partB: { anatomy: 'SCALE_CARAPACE', craft: 'FORGING', labelTh: 'กระดอง' },
    tiers: [
      { t: 1, name: 'ตั๊กแตนใบไม้คมกริบ', elem: 'WOOD_LIFE', cp: 95, terr: 'forest', body: '#5d824d', acc: '#a1d48c' },
      { t: 2, name: 'ตะขาบแดงร้อยขา', elem: 'FIRE', cp: 220, terr: 'mountain', body: '#9c4038', acc: '#e3847b' },
      { t: 3, name: 'ด้วงเกราะเหล็กดำดิน', elem: 'EARTH_METAL', cp: 460, terr: 'plains', body: '#3b3b3b', acc: '#828282' },
      { t: 4, name: 'แมงมุมพิษเร้นเงารัตติกาล', elem: 'YIN_SHADOW', cp: 970, terr: 'forest', body: '#41354d', acc: '#8a72a3' },
      { t: 5, name: 'พญาแมงป่องผลึกอสนีบาต', elem: 'LIGHTNING', cp: 2480, terr: 'desert', body: '#674d80', acc: '#bda6de' },
      { t: 6, name: 'จักรพรรดิแมลงทองคำกลืนปราณ', elem: 'LIGHT_YANG', cp: 6600, terr: 'desert', body: '#b09435', acc: '#ffea80' }
    ]
  },
  {
    code: 'SHELL', nameTh: 'ตระกูลเต่า/สัตว์หุ้มเกราะ', archetype: 'SHELL',
    partA: { anatomy: 'SCALE_CARAPACE', craft: 'FORGING', labelTh: 'กระดอง' },
    partB: { anatomy: 'BEAST_CORE', craft: 'ARRAY', labelTh: 'แก่นศิลา' },
    tiers: [
      { t: 1, name: 'ตะพาบน้ำลำธารหิน', elem: 'WATER_ICE', cp: 102, terr: 'water', body: '#5a6e69', acc: '#98b8af' },
      { t: 2, name: 'เต่าหญ้าเขียวร้อยปี', elem: 'WOOD_LIFE', cp: 225, terr: 'plains', body: '#496645', acc: '#8eb888' },
      { t: 3, name: 'เต่าศิลาดำหนามคม', elem: 'EARTH_METAL', cp: 475, terr: 'mountain', body: '#474747', acc: '#878787' },
      { t: 4, name: 'เต่าเพลิงลาวาใต้ธาร', elem: 'FIRE', cp: 1050, terr: 'mountain', body: '#87402d', acc: '#e0765c' },
      { t: 5, name: 'พญาเต่ามังกรครามค้ำสมุทร', elem: 'WATER_ICE', cp: 2620, terr: 'water', body: '#3b586e', acc: '#78afd6' },
      { t: 6, name: 'ราชันย์เต่าปฐพีบรรพกาลห้าทวีป', elem: 'EARTH_METAL', cp: 7800, terr: 'mountain', body: '#5c5443', acc: '#bfb095' }
    ]
  },
  {
    code: 'UNGULATE', nameTh: 'ตระกูลกวาง/แพะ/กระทิง', archetype: 'UNGULATE',
    partA: { anatomy: 'BONE_HORN', craft: 'FORGING', labelTh: 'เขา' },
    partB: { anatomy: 'TENDON_TAIL', craft: 'ALCHEMY', labelTh: 'เอ็นแก่น' },
    tiers: [
      { t: 1, name: 'กวางดาวทุ่งสารท', elem: 'WOOD_LIFE', cp: 95, terr: 'plains', body: '#8a6a4d', acc: '#d9b38f' },
      { t: 2, name: 'แพะผาสูงปราณวายุ', elem: 'WIND', cp: 215, terr: 'mountain', body: '#7d7a72', acc: '#c2beb4' },
      { t: 3, name: 'กระทิงศิลาเขาเหล็ก', elem: 'EARTH_METAL', cp: 470, terr: 'mountain', body: '#575249', acc: '#999081' },
      { t: 4, name: 'กวางขาวหิมะเก้ามังกร', elem: 'WATER_ICE', cp: 1010, terr: 'mountain', body: '#9bb0bd', acc: '#f0f7fc' },
      { t: 5, name: 'พญากระทิงเพลิงพิโรธเก้าอัคคี', elem: 'FIRE', cp: 2550, terr: 'mountain', body: '#96442b', acc: '#f2815e' },
      { t: 6, name: 'ราชันย์กวางดาราสวรรค์เก้าภพ', elem: 'ASTRAL', cp: 7100, terr: 'mountain', body: '#4a5b78', acc: '#a3beeb' }
    ]
  },
  {
    code: 'AQUATIC', nameTh: 'ตระกูลมัจฉา/สัตว์น้ำ', archetype: 'AQUATIC',
    partA: { anatomy: 'SCALE_CARAPACE', craft: 'FORGING', labelTh: 'เกล็ดครีบ' },
    partB: { anatomy: 'BEAST_CORE', craft: 'ARRAY', labelTh: 'ไข่มุก' },
    tiers: [
      { t: 1, name: 'ปลากระบอกเกล็ดเงินธารา', elem: 'WATER_ICE', cp: 95, terr: 'water', body: '#718c94', acc: '#c7e2eb' },
      { t: 2, name: 'ปลาคาร์ปหยกกระโดดมังกร', elem: 'WOOD_LIFE', cp: 210, terr: 'water', body: '#4f7a69', acc: '#95dbbe' },
      { t: 3, name: 'ชะโดเกราะหนามหนองบึง', elem: 'EARTH_METAL', cp: 450, terr: 'water', body: '#526154', acc: '#96ad99' },
      { t: 4, name: 'ฉลามครีบเพลิงทะเลเดือด', elem: 'FIRE', cp: 990, terr: 'water', body: '#8f4e3c', acc: '#eb8d75' },
      { t: 5, name: 'วาฬมุกวิญญาณเมฆาคราม', elem: 'ASTRAL', cp: 2500, terr: 'water', body: '#455f7d', acc: '#9ac4f5' },
      { t: 6, name: 'มังกรมัจฉาสมุทรดึกดำบรรพ์', elem: 'WATER_ICE', cp: 7300, terr: 'water', body: '#2e4961', acc: '#68b1e8' }
    ]
  },
  {
    code: 'PLANT_SPIRIT', nameTh: 'ตระกูลพฤกษา/เห็ดวิญญาณ', archetype: 'PLANT',
    partA: { anatomy: 'MEAT_EGG_MUSK', craft: 'ALCHEMY', labelTh: 'สปอร์ยางไม้' },
    partB: { anatomy: 'BONE_HORN', craft: 'ALCHEMY', labelTh: 'แก่นราก' },
    tiers: [
      { t: 1, name: 'ภูตเห็ดหมอกเรืองแสง', elem: 'WOOD_LIFE', cp: 95, terr: 'forest', body: '#4d755c', acc: '#9ee0b5' },
      { t: 2, name: 'เถาวัลย์หนามโลหิตดงไผ่', elem: 'BLOOD_DEMON', cp: 220, terr: 'forest', body: '#733737', acc: '#c76969' },
      { t: 3, name: 'โสมปีศาจรากพันปี', elem: 'WOOD_LIFE', cp: 460, terr: 'forest', body: '#6e5e44', acc: '#c2ab84' },
      { t: 4, name: 'บัวเพลิงอัคนีธารลาวา', elem: 'FIRE', cp: 1010, terr: 'mountain', body: '#964438', acc: '#f0897a' },
      { t: 5, name: 'พญาพฤกษาหมื่นพิษลวงวิญญาณ', elem: 'WOOD_LIFE', cp: 2550, terr: 'forest', body: '#3b5443', acc: '#86ba95' },
      { t: 6, name: 'มหาพฤกษาโลกบรรพกาลค้ำสวรรค์', elem: 'EARTH_METAL', cp: 7600, terr: 'forest', body: '#473d31', acc: '#b59d80' }
    ]
  },
  {
    code: 'CHIMERA', nameTh: 'ตระกูลสัตว์ผสม/วิญญาณ', archetype: 'CHIMERA',
    partA: { anatomy: 'BONE_HORN', craft: 'FORGING', labelTh: 'เขาอสูร' },
    partB: { anatomy: 'BEAST_CORE', craft: 'ARRAY', labelTh: 'ผลึกแก่น' },
    tiers: [
      { t: 1, name: 'จิ้งจอกวายุติดปีก', elem: 'WIND', cp: 100, terr: 'forest', body: '#657e87', acc: '#b0d5e3' },
      { t: 2, name: 'เสือโคร่งปีกค้างคาว', elem: 'YIN_SHADOW', cp: 225, terr: 'forest', body: '#4d4757', acc: '#9086a1' },
      { t: 3, name: 'กิเลนศิลาพิทักษ์ถ้ำ', elem: 'EARTH_METAL', cp: 475, terr: 'mountain', body: '#5c574b', acc: '#a39c89' },
      { t: 4, name: 'อินทรีหัวพยัคฆ์เหินนภา', elem: 'WIND', cp: 1060, terr: 'mountain', body: '#785b41', acc: '#cca583' },
      { t: 5, name: 'กิเลนเพลิงม่วงเก้าวัฏจักร', elem: 'FIRE', cp: 2650, terr: 'mountain', body: '#6e3869', acc: '#c977c0' },
      { t: 6, name: 'อสูรกลืนมิติบารมีอนันต์', elem: 'ASTRAL', cp: 8000, terr: 'mountain', body: '#352d47', acc: '#7c68ad' }
    ]
  }
];

const MYTHICS = [
  { id: 'ECO2_BEAST_MYTHIC_1', nameTh: 'ราชันย์มังกรทองเก้าสุริยัน', elem: 'LIGHT_YANG', cp: 24500, terr: 'mountain', body: '#b89228', acc: '#fae36b', partA: { id: 'ECO2_MAT_MYTHIC_SCALE_1', nameTh: 'เกล็ดมังกรทองเก้าสุริยัน', craft: 'FORGING', anatomy: 'SCALE_CARAPACE', value: 2200 }, partB: { id: 'ECO2_MAT_MYTHIC_HEART_1', nameTh: 'หัวใจมังกรสุริยะบรรพกาล', craft: 'ALCHEMY', anatomy: 'HEART_GALL', value: 2350 } },
  { id: 'ECO2_BEAST_MYTHIC_2', nameTh: 'หงส์เพลิงสวรรค์เก้าชีวา', elem: 'FIRE', cp: 22000, terr: 'mountain', body: '#ba3c25', acc: '#ffaa54', partA: { id: 'ECO2_MAT_MYTHIC_FEATHER_2', nameTh: 'ขนหางหงส์เพลิงเก้าชีวา', craft: 'TALISMAN', anatomy: 'SPIRIT_HAIR_FEATHER', value: 2150 }, partB: { id: 'ECO2_MAT_MYTHIC_PEARL_2', nameTh: 'มุกหยาดน้ำตาหงสาอมตะ', craft: 'ARRAY', anatomy: 'BEAST_CORE', value: 2300 } },
  { id: 'ECO2_BEAST_MYTHIC_3', nameTh: 'เต่าดำเสวียนอู่ค้ำจักรวาล', elem: 'WATER_ICE', cp: 24000, terr: 'water', body: '#263b4a', acc: '#649dbd', partA: { id: 'ECO2_MAT_MYTHIC_SHELL_3', nameTh: 'กระดองเสวียนอู่ค้ำฟ้า', craft: 'FORGING', anatomy: 'SCALE_CARAPACE', value: 2250 }, partB: { id: 'ECO2_MAT_MYTHIC_CORE_3', nameTh: 'ศิลากำเนิดธาตุน้ำบรรพกาล', craft: 'ARRAY', anatomy: 'BEAST_CORE', value: 2400 } },
  { id: 'ECO2_BEAST_MYTHIC_4', nameTh: 'พยัคฆ์ขาวไป๋หู่พิฆาตดารา', elem: 'EARTH_METAL', cp: 23500, terr: 'mountain', body: '#8fa5b8', acc: '#eef5fa', partA: { id: 'ECO2_MAT_MYTHIC_FANG_4', nameTh: 'เขี้ยวไป๋หู่พิฆาตดารา', craft: 'FORGING', anatomy: 'FANG_CLAW', value: 2200 }, partB: { id: 'ECO2_MAT_MYTHIC_PELT_4', nameTh: 'หนังพยัคฆ์ขาวเจ็ดดาวเหนือ', craft: 'FORGING', anatomy: 'HIDE_PELT', value: 2100 } },
  { id: 'ECO2_BEAST_MYTHIC_5', nameTh: 'กิเลนทองคำจักรพรรดิฟ้า', elem: 'LIGHT_YANG', cp: 23000, terr: 'forest', body: '#ad8728', acc: '#fade64', partA: { id: 'ECO2_MAT_MYTHIC_HORN_5', nameTh: 'มหาเขากิเลนจักรพรรดิฟ้า', craft: 'FORGING', anatomy: 'BONE_HORN', value: 2250 }, partB: { id: 'ECO2_MAT_MYTHIC_CRYSTAL_5', nameTh: 'ผลึกบุญญาบารมีสวรรค์', craft: 'ARRAY', anatomy: 'BEAST_CORE', value: 2350 } },
  { id: 'ECO2_BEAST_MYTHIC_6', nameTh: 'ปลาวาฬคุนเผิงกลืนดวงดารา', elem: 'ASTRAL', cp: 24500, terr: 'water', body: '#334466', acc: '#88a3db', partA: { id: 'ECO2_MAT_MYTHIC_WING_6', nameTh: 'ขนปีกคุนเผิงข้ามสมุทร', craft: 'TALISMAN', anatomy: 'SPIRIT_HAIR_FEATHER', value: 2280 }, partB: { id: 'ECO2_MAT_MYTHIC_OCEAN_6', nameTh: 'แก่นมหาสมุทรดารากลืนภพ', craft: 'ARRAY', anatomy: 'BEAST_CORE', value: 2450 } },
  { id: 'ECO2_BEAST_MYTHIC_7', nameTh: 'อสูรเทาเที่ยกลืนหมื่นวิญญาณ', elem: 'YIN_SHADOW', cp: 25000, terr: 'desert', body: '#3b2f42', acc: '#866b96', partA: { id: 'ECO2_MAT_MYTHIC_HORN_7', nameTh: 'เขาคู่เทาเที่ยกลืนวิญญาณ', craft: 'FORGING', anatomy: 'BONE_HORN', value: 2300 }, partB: { id: 'ECO2_MAT_MYTHIC_STOMACH_7', nameTh: 'กระเพาะมิติกลืนหมื่นภพ', craft: 'FORGING', anatomy: 'MEAT_EGG_MUSK', value: 2500 } },
  { id: 'ECO2_BEAST_MYTHIC_8', nameTh: 'พญาพฤกษาโพธิ์สวรรค์หมื่นวัฏจักร', elem: 'WOOD_LIFE', cp: 24000, terr: 'forest', body: '#45382b', acc: '#b0946d', partA: { id: 'ECO2_MAT_MYTHIC_ROOT_8', nameTh: 'แก่นรากโพธิ์สวรรค์', craft: 'ALCHEMY', anatomy: 'BONE_HORN', value: 2350 }, partB: { id: 'ECO2_MAT_MYTHIC_FRUIT_8', nameTh: 'ผลโพธิ์ตรัสรู้หมื่นวัฏจักร', craft: 'ALCHEMY', anatomy: 'MEAT_EGG_MUSK', value: 2600 } }
];

console.log('Building complete ecology dataset...');
const speciesList = [];
const materialsList = [];
const recipesList = [];
const itemsList = [];

// Base values by tier
const MAT_VALUES = { 1: 10, 2: 26, 3: 62, 4: 145, 5: 340, 6: 800, 7: 2100 };

// 1. Generate 72 Family Beasts and 144 materials
for (const fam of FAMILIES) {
  for (const t of fam.tiers) {
    const beastId = `ECO2_BEAST_${fam.code}_${t.t}`;
    const matAId = `ECO2_MAT_${fam.code}_A_${t.t}`;
    const matBId = `ECO2_MAT_${fam.code}_B_${t.t}`;

    const valA = MAT_VALUES[t.t] + Math.round((t.t * 3));
    const valB = MAT_VALUES[t.t] - Math.round((t.t * 1));

    const matA = {
      id: matAId,
      nameTh: `${fam.partA.labelTh}${t.name}`,
      category: 'BEAST_PART',
      tier: t.t,
      craft: fam.partA.craft,
      terrain: t.terr,
      value: valA,
      anatomy: fam.partA.anatomy,
      relic: false,
      family: fam.code,
      sourceBeastIds: [beastId]
    };

    const matB = {
      id: matBId,
      nameTh: `${fam.partB.labelTh}${t.name}`,
      category: 'BEAST_PART',
      tier: t.t,
      craft: fam.partB.craft,
      terrain: t.terr,
      value: valB,
      anatomy: fam.partB.anatomy,
      relic: false,
      family: fam.code,
      sourceBeastIds: [beastId]
    };

    const beast = {
      id: beastId,
      nameTh: t.name,
      tier: t.t,
      cp: t.cp,
      flee: t.t >= 6 ? 10 : t.t >= 4 ? 20 : 30,
      aggro: t.t >= 5 ? 85 : t.t >= 3 ? 65 : 45,
      drops: [matAId, matBId],
      terrain: t.terr,
      family: fam.code,
      archetype: fam.archetype,
      element: t.elem,
      visual: { body: t.body, accent: t.acc, mark: 'crest', scale: 0.8 + t.t * 0.12 }
    };

    speciesList.push(beast);
    materialsList.push(matA, matB);
  }
}

// 2. Generate 8 Mythic Tier 7 Beasts and 16 materials
for (const m of MYTHICS) {
  const matA = {
    id: m.partA.id,
    nameTh: m.partA.nameTh,
    category: 'BEAST_PART',
    tier: 7,
    craft: m.partA.craft,
    terrain: m.terr,
    value: m.partA.value,
    anatomy: m.partA.anatomy,
    relic: true,
    family: 'CHIMERA',
    sourceBeastIds: [m.id]
  };

  const matB = {
    id: m.partB.id,
    nameTh: m.partB.nameTh,
    category: 'BEAST_PART',
    tier: 7,
    craft: m.partB.craft,
    terrain: m.terr,
    value: m.partB.value,
    anatomy: m.partB.anatomy,
    relic: true,
    family: 'CHIMERA',
    sourceBeastIds: [m.id]
  };

  const beast = {
    id: m.id,
    nameTh: m.nameTh,
    tier: 7,
    cp: m.cp,
    flee: 5,
    aggro: 95,
    drops: [m.partA.id, m.partB.id],
    terrain: m.terr,
    family: 'CHIMERA',
    archetype: 'CHIMERA',
    element: m.elem,
    visual: { body: m.body, accent: m.acc, mark: 'crown', scale: 1.8 }
  };

  speciesList.push(beast);
  materialsList.push(matA, matB);
}

console.log(`Generated ${speciesList.length} species, ${materialsList.length} materials.`);

// 3. Generate 48 Pills (8 pills per Tier 1-6)
// Each pill takes 2 ECO2_ materials + standard herbs
const PILL_GROUPS = [
  // T1 (8 pills)
  { id: 'ECO2_REC_PILL_HEAL_1', nameTh: 'ตำรับโอสถสมานแผลดงไผ่', tier: 1, craft: 'ALCHEMY', minMastery: 12, days: 5, inMats: ['ECO2_MAT_SERPENT_A_1', 'ECO2_MAT_CANINE_B_1', 'MAT_HERB_DEW_GRASS_1'], eff: { healHealth: 15, healInjury: 10, toxicity: 1 }, descTh: 'ใช้พิษงูไผ่สกัดร่วมหญ้าน้ำค้าง สมานแผลภายนอกอย่างรวดเร็ว' },
  { id: 'ECO2_REC_PILL_PURGE_1', nameTh: 'ตำรับโอสถชะล้างพิษสปอร์', tier: 1, craft: 'ALCHEMY', minMastery: 14, days: 6, inMats: ['ECO2_MAT_PLANT_SPIRIT_A_1', 'ECO2_MAT_ARTHROPOD_B_1', 'MAT_HERB_CINDER_LEAF_1'], eff: { clearPoison: 20, clearToxic: 15, toxicity: 1 }, descTh: 'สกัดจากสปอร์เห็ดหมอก ขับพิษตกค้างออกจากชีพจร' },
  { id: 'ECO2_REC_PILL_ENERGY_1', nameTh: 'ตำรับโอสถฟื้นกำลังกวางดาว', tier: 1, craft: 'ALCHEMY', minMastery: 10, days: 5, inMats: ['ECO2_MAT_UNGULATE_B_1', 'ECO2_MAT_BOAR_B_1', 'MAT_HERB_DEW_GRASS_1'], eff: { energyRestore: 30, healHealth: 8, toxicity: 1 }, descTh: 'บำรุงกล้ามเนื้อ คืนความกระปรี้กระเปร่า' },
  { id: 'ECO2_REC_PILL_BUFF_ATK_1', nameTh: 'ตำรับโอสถเขี้ยวหมอกฮึกเหิม', tier: 1, craft: 'ALCHEMY', minMastery: 15, days: 6, inMats: ['ECO2_MAT_CANINE_A_1', 'ECO2_MAT_FELINE_A_1', 'MAT_HERB_CINDER_LEAF_1'], eff: { cbBuff: { name: 'เขี้ยวหมอกฮึกเหิม', dur: 120, p: { atk: 0.12 }, f: { acc: 8 } }, toxicity: 2 }, descTh: 'เพิ่มพลังโจมตีกายภาพและความแม่นยำยามปะทะศัตรู' },
  { id: 'ECO2_REC_PILL_BUFF_DEF_1', nameTh: 'ตำรับโอสถเกราะตะพาบธารา', tier: 1, craft: 'ALCHEMY', minMastery: 15, days: 6, inMats: ['ECO2_MAT_SHELL_A_1', 'ECO2_MAT_URSINE_A_1', 'MAT_HERB_DEW_GRASS_1'], eff: { cbBuff: { name: 'เกราะตะพาบธารา', dur: 120, p: { def: 0.14 }, f: {} }, toxicity: 2 }, descTh: 'เสริมความทนทานของผิวหนัง ป้องกันแรงกระแทก' },
  { id: 'ECO2_REC_PILL_BUFF_SPEED_1', nameTh: 'ตำรับโอสถปีกจิ้งจอกวายุ', tier: 1, craft: 'ALCHEMY', minMastery: 16, days: 6, inMats: ['ECO2_MAT_CHIMERA_A_1', 'ECO2_MAT_AVIAN_A_1', 'MAT_HERB_DEW_GRASS_1'], eff: { cbBuff: { name: 'ปีกจิ้งจอกวายุ', dur: 120, p: { move: 0.12, eva: 0.08 }, f: {} }, toxicity: 2 }, descTh: 'เพิ่มความคล่องตัวในการหลบหลีกและเคลื่อนที่' },
  { id: 'ECO2_REC_PILL_CULT_QI_1', nameTh: 'ตำรับโอสถรวบรวมปราณวารี', tier: 1, craft: 'ALCHEMY', minMastery: 15, days: 8, inMats: ['ECO2_MAT_AQUATIC_B_1', 'ECO2_MAT_PLANT_SPIRIT_B_1', 'MAT_HERB_DEW_GRASS_1'], eff: { cultivationProgress: 14, toxicity: 2 }, descTh: 'ช่วยกักเก็บปราณฟ้าดิน เร่งการบำเพ็ญในขั้นต้น' },
  { id: 'ECO2_REC_PILL_MIND_CALM_1', nameTh: 'ตำรับโอสถสงบจิตใบไม้คราม', tier: 1, craft: 'ALCHEMY', minMastery: 14, days: 6, inMats: ['ECO2_MAT_ARTHROPOD_A_1', 'ECO2_MAT_SHELL_B_1', 'MAT_HERB_CINDER_LEAF_1'], eff: { clearHeartDemon: 16, toxicity: 1 }, descTh: 'ดับอารมณ์พลุ่งพล่าน ลดการก่อตัวของจิตมาร' },

  // T2 (8 pills)
  { id: 'ECO2_REC_PILL_HEAL_2', nameTh: 'ตำรับโอสถชะล้างชีพจรกระเรียนหยก', tier: 2, craft: 'ALCHEMY', minMastery: 26, days: 10, inMats: ['ECO2_MAT_AVIAN_A_2', 'ECO2_MAT_CANINE_B_2', 'MAT_HERB_JADE_LOTUS_2'], eff: { healHealth: 28, healInjury: 24, toxicity: 2 }, descTh: 'สมานแผลลึกในเส้นลมปราณด้วยพลังบริสุทธิ์ของวิหคธารา' },
  { id: 'ECO2_REC_PILL_PURGE_2', nameTh: 'ตำรับโอสถถอนพิษทรายแดง', tier: 2, craft: 'ALCHEMY', minMastery: 28, days: 10, inMats: ['ECO2_MAT_SERPENT_A_2', 'ECO2_MAT_ARTHROPOD_A_2', 'MAT_HERB_MIST_ORCHID_2'], eff: { clearPoison: 40, clearToxic: 30, toxicity: 2 }, descTh: 'ใช้พิษต้านพิษ ชะล้างสารพิษรุนแรงและลมปราณอุดตัน' },
  { id: 'ECO2_REC_PILL_REGEN_2', nameTh: 'ตำรับโอสถเลือดอสูรคืนพลัง', tier: 2, craft: 'ALCHEMY', minMastery: 25, days: 8, inMats: ['ECO2_MAT_PLANT_SPIRIT_A_2', 'ECO2_MAT_FELINE_B_2', 'MAT_HERB_JADE_LOTUS_2'], eff: { healHealth: 35, energyRestore: 45, toxicity: 3 }, descTh: 'ยางเถาวัลย์โลหิตช่วยกระตุ้นการไหลเวียนโลหิตและเร่งฟื้นตัว' },
  { id: 'ECO2_REC_PILL_BUFF_ATK_2', nameTh: 'ตำรับโอสถกรงเล็บวายุไพร', tier: 2, craft: 'ALCHEMY', minMastery: 30, days: 12, inMats: ['ECO2_MAT_FELINE_A_2', 'ECO2_MAT_BOAR_A_2', 'MAT_HERB_MIST_ORCHID_2'], eff: { cbBuff: { name: 'กรงเล็บวายุไพร', dur: 180, p: { atk: 0.16 }, f: { crit: 6 } }, toxicity: 3 }, descTh: 'คมเขี้ยวเสือดาววายุ เพิ่มพลังเจาะทะลวงและโอกาสคริติคอล' },
  { id: 'ECO2_REC_PILL_BUFF_DEF_2', nameTh: 'ตำรับโอสถเกราะหินผาทะลวง', tier: 2, craft: 'ALCHEMY', minMastery: 30, days: 12, inMats: ['ECO2_MAT_URSINE_B_2', 'ECO2_MAT_SHELL_A_2', 'MAT_HERB_JADE_LOTUS_2'], eff: { cbBuff: { name: 'เกราะหินผาทะลวง', dur: 180, p: { def: 0.18, mdef: 0.12 }, f: {} }, toxicity: 3 }, descTh: 'ถุงน้ำดีหมีผาหินสร้างชั้นคุ้มกายหนาดั่งศิลา' },
  { id: 'ECO2_REC_PILL_BUFF_CAST_2', nameTh: 'ตำรับโอสถเนตรเงาจันทร์กระจ่าง', tier: 2, craft: 'ALCHEMY', minMastery: 32, days: 12, inMats: ['ECO2_MAT_CHIMERA_A_2', 'ECO2_MAT_AQUATIC_A_2', 'MAT_HERB_MIST_ORCHID_2'], eff: { cbBuff: { name: 'เนตรเงาจันทร์', dur: 180, p: {}, f: { cast: 14, acc: 12 } }, toxicity: 3 }, descTh: 'เปิดประสาทสัมผัส ร่ายวิชาได้รวดเร็วและแม่นยำยิ่งขึ้น' },
  { id: 'ECO2_REC_PILL_CULT_QI_2', nameTh: 'ตำรับโอสถบัวหยกแก่นเต่าร้อยปี', tier: 2, craft: 'ALCHEMY', minMastery: 28, days: 14, inMats: ['ECO2_MAT_SHELL_B_2', 'ECO2_MAT_UNGULATE_B_2', 'MAT_HERB_JADE_LOTUS_2'], eff: { cultivationProgress: 22, toxicity: 3 }, descTh: 'แก่นเต่าร้อยปีผสมบัวหยก หล่อเลี้ยงฐานปราณให้หนักแน่น' },
  { id: 'ECO2_REC_PILL_INSIGHT_2', nameTh: 'ตำรับโอสถเบิกปัญญาคาร์ปมังกร', tier: 2, craft: 'ALCHEMY', minMastery: 30, days: 12, inMats: ['ECO2_MAT_AQUATIC_B_2', 'ECO2_MAT_PLANT_SPIRIT_B_2', 'MAT_HERB_MIST_ORCHID_2'], eff: { insight: 1, clearHeartDemon: 20, toxicity: 2 }, descTh: 'เพิ่มความเข้าใจคัมภีร์และวิชา ลดความฟุ้งซ่าน' },

  // T3 (8 pills)
  { id: 'ECO2_REC_PILL_HEAL_3', nameTh: 'ตำรับโอสถบำรุงชีพจรโสมปีศาจ', tier: 3, craft: 'ALCHEMY', minMastery: 42, days: 16, inMats: ['ECO2_MAT_PLANT_SPIRIT_B_3', 'ECO2_MAT_CANINE_B_3', 'MAT_HERB_BLOOD_GINSENG_3'], eff: { healHealth: 50, healInjury: 40, toxicity: 4 }, descTh: 'รากโสมปีศาจและโสมโลหิตสมานอาการบาดเจ็บสาหัสอย่างชะงัด' },
  { id: 'ECO2_REC_PILL_PURGE_3', nameTh: 'ตำรับโอสถดีงูเหลือมศิลาถอนหมื่นพิษ', tier: 3, craft: 'ALCHEMY', minMastery: 44, days: 16, inMats: ['ECO2_MAT_SERPENT_A_3', 'ECO2_MAT_ARTHROPOD_B_3', 'MAT_HERB_VENOM_VINE_3'], eff: { clearPoison: 60, clearToxic: 45, toxicity: 3 }, descTh: 'ดีงูเหลือมเข้มข้น ล้างพิษสะสมในไขกระดูกและเส้นเอ็น' },
  { id: 'ECO2_REC_PILL_LIFE_3', nameTh: 'ตำรับโอสถต่ออายุขัยกวางดาวสารท', tier: 3, craft: 'ALCHEMY', minMastery: 46, days: 20, inMats: ['ECO2_MAT_UNGULATE_B_3', 'ECO2_MAT_AQUATIC_B_3', 'MAT_HERB_BLOOD_GINSENG_3'], eff: { lifespanBonus: 15, healHealth: 30, toxicity: 3 }, descTh: 'ฟื้นฟูปราณชีวิต บำรุงธาตุแท้ให้อายุขัยยืนยาวขึ้น' },
  { id: 'ECO2_REC_PILL_BUFF_ATK_3', nameTh: 'ตำรับโอสถพยัคฆ์ศิลาทะลวงค่าย', tier: 3, craft: 'ALCHEMY', minMastery: 45, days: 18, inMats: ['ECO2_MAT_FELINE_B_3', 'ECO2_MAT_BOAR_A_3', 'MAT_HERB_BLOOD_GINSENG_3'], eff: { cbBuff: { name: 'พยัคฆ์ศิลาทะลวงค่าย', dur: 240, p: { atk: 0.20 }, f: { pen: 14 } }, toxicity: 4 }, descTh: 'โลหิตพยัคฆ์ศิลา เสริมพลังทำลายล้างทะลวงเกราะศัตรู' },
  { id: 'ECO2_REC_PILL_BUFF_DEF_3', nameTh: 'ตำรับโอสถเกราะเต่าหนามทมิฬ', tier: 3, craft: 'ALCHEMY', minMastery: 45, days: 18, inMats: ['ECO2_MAT_SHELL_A_3', 'ECO2_MAT_URSINE_A_3', 'MAT_HERB_VENOM_VINE_3'], eff: { cbBuff: { name: 'เกราะเต่าหนามทมิฬ', dur: 240, p: { def: 0.22, mdef: 0.16 }, f: {} }, toxicity: 4 }, descTh: 'แก่นศิลาหนามทมิฬ คุ้มกายต้านทานอาวุธและวิชาคาถา' },
  { id: 'ECO2_REC_PILL_BUFF_CRIT_3', nameTh: 'ตำรับโอสถคมเขี้ยวสุนัขป่าลมกรด', tier: 3, craft: 'ALCHEMY', minMastery: 46, days: 18, inMats: ['ECO2_MAT_CANINE_A_3', 'ECO2_MAT_AVIAN_B_3', 'MAT_HERB_VENOM_VINE_3'], eff: { cbBuff: { name: 'คมเขี้ยวลมกรด', dur: 240, p: {}, f: { crit: 12, critDmg: 25 } }, toxicity: 4 }, descTh: 'กระตุ้นสัญชาตญาณสัตว์ป่า เพิ่มความเสียหายคริติคอลอย่างรุนแรง' },
  { id: 'ECO2_REC_PILL_CULT_QI_3', nameTh: 'ตำรับโอสถรากฐานกิเลนศิลา', tier: 3, craft: 'ALCHEMY', minMastery: 44, days: 22, inMats: ['ECO2_MAT_CHIMERA_A_3', 'ECO2_MAT_PLANT_SPIRIT_A_3', 'MAT_HERB_BLOOD_GINSENG_3'], eff: { cultivationProgress: 32, breakthroughBonus: 0.12, toxicity: 5 }, descTh: 'พลังกิเลนศิลา เสริมความมั่นคงช่วงเตรียมทะลวงขั้น' },
  { id: 'ECO2_REC_PILL_MIND_CALM_3', nameTh: 'ตำรับโอสถดับจิตมารเพลิงลาวา', tier: 3, craft: 'ALCHEMY', minMastery: 45, days: 18, inMats: ['ECO2_MAT_URSINE_B_3', 'ECO2_MAT_SERPENT_B_3', 'MAT_HERB_VENOM_VINE_3'], eff: { clearHeartDemon: 35, toxicity: 3 }, descTh: 'สยบไฟมารในจิตวิญญาณ ป้องกันอาการธาตุไฟแทรก' },

  // T4 (8 pills)
  { id: 'ECO2_REC_PILL_HEAL_4', nameTh: 'ตำรับโอสถโลหิตกวางขาวคืนชีพ', tier: 4, craft: 'ALCHEMY', minMastery: 58, days: 24, inMats: ['ECO2_MAT_UNGULATE_B_4', 'ECO2_MAT_FELINE_B_4', 'MAT_HERB_DRAGON_GRASS_4'], eff: { healHealth: 80, healInjury: 60, toxicity: 5 }, descTh: 'โลหิตวิญญาณกวางหิมะขาว สมานกระดูกที่แตกหักและชีพจรที่ฉีกขาด' },
  { id: 'ECO2_REC_PILL_PURGE_4', nameTh: 'ตำรับโอสถถอนพิษงูเห่าเหมันต์', tier: 4, craft: 'ALCHEMY', minMastery: 60, days: 24, inMats: ['ECO2_MAT_SERPENT_A_4', 'ECO2_MAT_BOAR_B_4', 'MAT_HERB_DRAGON_GRASS_4'], eff: { clearPoison: 80, clearToxic: 60, toxicity: 4 }, descTh: 'สกัดความเย็นเยือกแข็ง ขับพิษร้ายแรงและหนอนกู่' },
  { id: 'ECO2_REC_PILL_LIFE_4', nameTh: 'ตำรับโอสถเสริมปราณบัวเพลิงอัคนี', tier: 4, craft: 'ALCHEMY', minMastery: 62, days: 28, inMats: ['ECO2_MAT_PLANT_SPIRIT_B_4', 'ECO2_MAT_CANINE_B_4', 'MAT_HERB_DRAGON_GRASS_4'], eff: { lifespanBonus: 30, healHealth: 50, toxicity: 5 }, descTh: 'เมล็ดบัวลาวาหลอมปราณ ต่อเติมอายุขัยและฟื้นฟูรากฐาน' },
  { id: 'ECO2_REC_PILL_BUFF_ATK_4', nameTh: 'ตำรับโอสถหมาป่าโลหิตคลั่ง', tier: 4, craft: 'ALCHEMY', minMastery: 60, days: 25, inMats: ['ECO2_MAT_CANINE_A_4', 'ECO2_MAT_FELINE_A_4', 'MAT_HERB_DRAGON_GRASS_4'], eff: { cbBuff: { name: 'หมาป่าโลหิตคลั่ง', dur: 300, p: { atk: 0.26 }, f: { crit: 8, pen: 16 } }, toxicity: 6 }, descTh: 'ปลุกสัญชาตญาณสังหาร เพิ่มพลังโจมตีและอัตราคริติคอลสูงสุด' },
  { id: 'ECO2_REC_PILL_BUFF_DEF_4', nameTh: 'ตำรับโอสถแก่นเพลิงลาวาคุ้มร่าง', tier: 4, craft: 'ALCHEMY', minMastery: 60, days: 25, inMats: ['ECO2_MAT_SHELL_B_4', 'ECO2_MAT_URSINE_B_4', 'MAT_HERB_DRAGON_GRASS_4'], eff: { cbBuff: { name: 'แก่นเพลิงลาวาคุ้มร่าง', dur: 300, p: { def: 0.28, mdef: 0.22 }, f: {} }, toxicity: 6 }, descTh: 'ห่อหุ้มร่างด้วยเกราะเพลิงลาวา ลดทอนดาเมจกายภาพและเวทมนตร์' },
  { id: 'ECO2_REC_PILL_BUFF_SPEED_4', nameTh: 'ตำรับโอสถเหินนภาอินทรีพยัคฆ์', tier: 4, craft: 'ALCHEMY', minMastery: 62, days: 25, inMats: ['ECO2_MAT_CHIMERA_A_4', 'ECO2_MAT_AVIAN_B_4', 'MAT_HERB_DRAGON_GRASS_4'], eff: { cbBuff: { name: 'เหินนภาอินทรีพยัคฆ์', dur: 300, p: { move: 0.22, eva: 0.16 }, f: { cast: 18 } }, toxicity: 5 }, descTh: 'ตัวเบาดุจขนนก เคลื่อนไหวรวดเร็วดั่งอินทรีทะยานลม' },
  { id: 'ECO2_REC_PILL_CULT_QI_4', nameTh: 'ตำรับโอสถแก่นทองคำฉลามเพลิง', tier: 4, craft: 'ALCHEMY', minMastery: 60, days: 30, inMats: ['ECO2_MAT_AQUATIC_B_4', 'ECO2_MAT_PLANT_SPIRIT_A_4', 'MAT_HERB_DRAGON_GRASS_4'], eff: { cultivationProgress: 45, breakthroughBonus: 0.20, toxicity: 6 }, descTh: 'ช่วยหลอมรวมปราณแก่นทองคำให้บริสุทธิ์และมั่นคง' },
  { id: 'ECO2_REC_PILL_MIND_CALM_4', nameTh: 'ตำรับโอสถสยบมารใยไหมเงารัตติกาล', tier: 4, craft: 'ALCHEMY', minMastery: 62, days: 26, inMats: ['ECO2_MAT_ARTHROPOD_B_4', 'ECO2_MAT_CHIMERA_B_4', 'MAT_HERB_DRAGON_GRASS_4'], eff: { clearHeartDemon: 50, toxicity: 4 }, descTh: 'พันธนาการจิตมารที่ปั่นป่วน ให้สงบนิ่งดั่งบ่อน้ำลึก' },

  // T5 (8 pills)
  { id: 'ECO2_REC_PILL_HEAL_5', nameTh: 'ตำรับโอสถเอ็นพยัคฆ์ขาวต่อกระดูก', tier: 5, craft: 'ALCHEMY', minMastery: 72, days: 36, inMats: ['ECO2_MAT_FELINE_B_5', 'ECO2_MAT_CANINE_A_5', 'MAT_HERB_SNOW_LOTUS_5'], eff: { healHealth: 120, healInjury: 100, toxicity: 6 }, descTh: 'ฟื้นฟูกระดูกและกล้ามเนื้อที่แหลกเหลวให้คืนสภาพสมบูรณ์' },
  { id: 'ECO2_REC_PILL_PURGE_5', nameTh: 'ตำรับโอสถถอนพิษพญาพฤกษาหมื่นพิษ', tier: 5, craft: 'ALCHEMY', minMastery: 74, days: 36, inMats: ['ECO2_MAT_PLANT_SPIRIT_A_5', 'ECO2_MAT_SERPENT_A_5', 'MAT_HERB_SNOW_LOTUS_5'], eff: { clearPoison: 100, clearToxic: 80, toxicity: 5 }, descTh: 'ขับล้างสารพิษระดับมรณะและคำสาปกัดกร่อนวิญญาณ' },
  { id: 'ECO2_REC_PILL_LIFE_5', nameTh: 'ตำรับโอสถไข่มุกวาฬครามต่ออายุ', tier: 5, craft: 'ALCHEMY', minMastery: 76, days: 45, inMats: ['ECO2_MAT_AQUATIC_A_5', 'ECO2_MAT_BOAR_A_5', 'MAT_HERB_SNOW_LOTUS_5'], eff: { lifespanBonus: 60, healHealth: 80, toxicity: 6 }, descTh: 'ไข่มุกวิญญาณวาฬคราม มอบพลังชีวิตอันไพศาลดั่งมหาสมุทร' },
  { id: 'ECO2_REC_PILL_BUFF_ATK_5', nameTh: 'ตำรับโอสถกระทิงเพลิงเก้าอัคคีพิโรธ', tier: 5, craft: 'ALCHEMY', minMastery: 75, days: 38, inMats: ['ECO2_MAT_UNGULATE_B_5', 'ECO2_MAT_URSINE_B_5', 'MAT_HERB_SNOW_LOTUS_5'], eff: { cbBuff: { name: 'กระทิงเพลิงเก้าอัคคี', dur: 360, p: { atk: 0.32 }, f: { crit: 12, pen: 22 } }, toxicity: 7 }, descTh: 'หัวใจกระทิงเพลิง เสริมพลังทำลายล้างสูงสุดยามเผชิญหน้ายอดฝีมือ' },
  { id: 'ECO2_REC_PILL_BUFF_DEF_5', nameTh: 'ตำรับโอสถกระดองเต่ามังกรค้ำฟ้า', tier: 5, craft: 'ALCHEMY', minMastery: 75, days: 38, inMats: ['ECO2_MAT_SHELL_B_5', 'ECO2_MAT_BOAR_B_5', 'MAT_HERB_SNOW_LOTUS_5'], eff: { cbBuff: { name: 'กระดองเต่ามังกรค้ำฟ้า', dur: 360, p: { def: 0.34, mdef: 0.28 }, f: {} }, toxicity: 7 }, descTh: 'เกราะเต่ามังกรค้ำฟ้า คุ้มครองผู้ใช้ต้านทานการโจมตีหนักหน่วง' },
  { id: 'ECO2_REC_PILL_BUFF_THUNDER_5', nameTh: 'ตำรับโอสถสายฟ้าพญาแมงป่องผลึก', tier: 5, craft: 'ALCHEMY', minMastery: 76, days: 38, inMats: ['ECO2_MAT_ARTHROPOD_B_5', 'ECO2_MAT_AVIAN_B_5', 'MAT_HERB_SNOW_LOTUS_5'], eff: { cbBuff: { name: 'สายฟ้าผลึกอสนี', dur: 360, p: {}, f: { cast: 24, crit: 14, acc: 20 } }, toxicity: 7 }, descTh: 'กระแสไฟฟ้าในร่างเร่งการประมวลผลและการจู่โจมฉับไว' },
  { id: 'ECO2_REC_PILL_CULT_QI_5', nameTh: 'ตำรับโอสถแก่นวิญญาณจิ้งจอกเก้าหาง', tier: 5, craft: 'ALCHEMY', minMastery: 74, days: 42, inMats: ['ECO2_MAT_CANINE_B_5', 'ECO2_MAT_PLANT_SPIRIT_B_5', 'MAT_HERB_SNOW_LOTUS_5'], eff: { cultivationProgress: 60, breakthroughBonus: 0.25, toxicity: 7 }, descTh: 'เร่งการสะสมพลังตบะในขั้นสูง และช่วยเปิดจุดชีพจรสำคัญ' },
  { id: 'ECO2_REC_PILL_MIND_CALM_5', nameTh: 'ตำรับโอสถสงบวิญญาณกิเลนเพลิงม่วง', tier: 5, craft: 'ALCHEMY', minMastery: 75, days: 40, inMats: ['ECO2_MAT_CHIMERA_B_5', 'ECO2_MAT_SERPENT_B_5', 'MAT_HERB_SNOW_LOTUS_5'], eff: { clearHeartDemon: 70, toxicity: 5 }, descTh: 'ชำระล้างจิตใจให้ผ่องแผ้ว สยบภาพหลอนและมารในใจ' },

  // T6 (8 pills - Uses Tier 6 and Tier 7 Mythic Drops!)
  { id: 'ECO2_REC_PILL_HEAL_6', nameTh: 'ตำรับโอสถหงส์เพลิงเก้าชีวาอมฤต', tier: 6, craft: 'ALCHEMY', minMastery: 86, days: 60, inMats: ['ECO2_MAT_MYTHIC_FEATHER_2', 'ECO2_MAT_CANINE_A_6', 'MAT_HERB_IMMORTAL_PEACH_6'], eff: { healHealth: 200, healInjury: 150, clearPoison: 120, toxicity: 5 }, descTh: 'พลังคืนชีพของหงส์เพลิงสวรรค์ ชุบชีวิตและซ่อมแซมร่างกายทุกส่วน' },
  { id: 'ECO2_REC_PILL_LIFE_6', nameTh: 'ตำรับโอสถผลโพธิ์ตรัสรู้หมื่นปี', tier: 6, craft: 'ALCHEMY', minMastery: 88, days: 70, inMats: ['ECO2_MAT_MYTHIC_FRUIT_8', 'ECO2_MAT_PLANT_SPIRIT_A_6', 'MAT_HERB_IMMORTAL_PEACH_6'], eff: { lifespanBonus: 150, healHealth: 150, toxicity: 5 }, descTh: 'ผลโพธิ์ตรัสรู้ ยืดอายุขัยและชำระล้างรากฐานชีวิตสู่ความบริสุทธิ์' },
  { id: 'ECO2_REC_PILL_PURGE_6', nameTh: 'ตำรับโอสถมุกน้ำตาหงสาสลายพิษสวรรค์', tier: 6, craft: 'ALCHEMY', minMastery: 85, days: 55, inMats: ['ECO2_MAT_MYTHIC_PEARL_2', 'ECO2_MAT_SERPENT_A_6', 'MAT_HERB_IMMORTAL_PEACH_6'], eff: { clearPoison: 150, clearToxic: 100, clearHeartDemon: 80, toxicity: 4 }, descTh: 'หยาดน้ำตาหงสาอมตะ ละลายพิษทุกชนิดในใต้หล้า' },
  { id: 'ECO2_REC_PILL_BUFF_ATK_6', nameTh: 'ตำรับโอสถหัวใจมังกรสุริยะบรรพกาล', tier: 6, craft: 'ALCHEMY', minMastery: 88, days: 60, inMats: ['ECO2_MAT_MYTHIC_HEART_1', 'ECO2_MAT_FELINE_A_6', 'MAT_HERB_IMMORTAL_PEACH_6'], eff: { cbBuff: { name: 'มังกรสุริยะบรรพกาล', dur: 480, p: { atk: 0.40, matk: 0.35 }, f: { crit: 16, pen: 30 } }, toxicity: 8 }, descTh: 'หัวใจมังกรทองสุริยัน มอบพลังโจมตีสะเทือนสวรรค์และปฐพี' },
  { id: 'ECO2_REC_PILL_BUFF_DEF_6', nameTh: 'ตำรับโอสถกระดองเสวียนอู่ค้ำจักรวาล', tier: 6, craft: 'ALCHEMY', minMastery: 88, days: 60, inMats: ['ECO2_MAT_MYTHIC_CORE_3', 'ECO2_MAT_SHELL_A_6', 'MAT_HERB_IMMORTAL_PEACH_6'], eff: { cbBuff: { name: 'เสวียนอู่ค้ำจักรวาล', dur: 480, p: { def: 0.42, mdef: 0.38 }, f: {} }, toxicity: 8 }, descTh: 'แผ่นกระดองเสวียนอู่ ก่อกำแพงปราณไร้พ่ายต้านทานทุกสิ่ง' },
  { id: 'ECO2_REC_PILL_BUFF_ASTRAL_6', nameTh: 'ตำรับโอสถมหาสมุทรดารากลืนภพ', tier: 6, craft: 'ALCHEMY', minMastery: 87, days: 60, inMats: ['ECO2_MAT_MYTHIC_OCEAN_6', 'ECO2_MAT_CHIMERA_A_6', 'MAT_HERB_IMMORTAL_PEACH_6'], eff: { cbBuff: { name: 'มหาสมุทรดารากลืนภพ', dur: 480, p: { move: 0.30, eva: 0.25 }, f: { cast: 30, acc: 25 } }, toxicity: 8 }, descTh: 'พลังกลืนมิติของคุนเผิง เคลื่อนที่ข้ามห้วงอวกาศและร่ายวิชาฉับไว' },
  { id: 'ECO2_REC_PILL_CULT_QI_6', nameTh: 'ตำรับโอสถแก่นรากโพธิ์สวรรค์รวมเต๋า', tier: 6, craft: 'ALCHEMY', minMastery: 88, days: 65, inMats: ['ECO2_MAT_MYTHIC_HORN_5', 'ECO2_MAT_UNGULATE_A_6', 'MAT_HERB_IMMORTAL_PEACH_6'], eff: { cultivationProgress: 90, breakthroughBonus: 0.30, toxicity: 8 }, descTh: 'เร่งตบะสู่จุดสูงสุดของขั้นเซียน เสริมโอกาสผ่านทัณฑ์สวรรค์' },
  { id: 'ECO2_REC_PILL_MIND_CALM_6', nameTh: 'ตำรับโอสถสยบมารบุญญาบารมีฟ้า', tier: 6, craft: 'ALCHEMY', minMastery: 86, days: 55, inMats: ['ECO2_MAT_MYTHIC_CRYSTAL_5', 'ECO2_MAT_ARTHROPOD_A_6', 'MAT_HERB_IMMORTAL_PEACH_6'], eff: { clearHeartDemon: 100, toxicity: 5 }, descTh: 'พลังกิเลนทองคำจักรพรรดิฟ้า กำจัดจิตมารจนสิ้นเชิง' }
];

for (const p of PILL_GROUPS) {
  const recipe = {
    id: p.id,
    nameTh: p.nameTh,
    craft: p.craft,
    tier: p.tier,
    minMastery: p.minMastery,
    days: p.days,
    inputs: p.inMats.map(id => ({ matId: id, count: 2 })),
    outType: 'PILL',
    outNameTh: p.nameTh.replace('ตำรับ', ''),
    effect: p.eff,
    descTh: p.descTh,
    starter: p.tier <= 2
  };
  recipesList.push(recipe);
}

console.log(`Generated ${recipesList.length} pill recipes.`);

// 4. Generate 32 Equipment Items and Recipes
// Each equipment recipe consumes 2 ECO2_ materials + standard ore
const EQ_DEFINITIONS = [
  // Weapons - SWORD (T2, T4, T6)
  { type: 'SWORD', slot: 'WEAPON', t: 2, name: 'กระบี่เขี้ยวเงาจันทร์', inMats: ['ECO2_MAT_CANINE_A_2', 'ECO2_MAT_SERPENT_B_2'], ore: 'MAT_ORE_COLD_STEEL_2', val: 140, fx: [{ effectId: 'EFX_ARMOR_FRACTURE', params: { armorReductionRatio: 0.15 } }] },
  { type: 'SWORD', slot: 'WEAPON', t: 4, name: 'กระบี่เกล็ดงูเห่าเหมันต์', inMats: ['ECO2_MAT_SERPENT_B_4', 'ECO2_MAT_BOAR_A_4'], ore: 'MAT_ORE_MITHRIL_JADE_4', val: 280, fx: [{ effectId: 'EFX_CHILL_FREEZE', params: { chillStacks: 1, slowRatio: 0.25 } }] },
  { type: 'SWORD', slot: 'WEAPON', t: 6, name: 'กระบี่มังกรทองเก้าสุริยัน', inMats: ['ECO2_MAT_MYTHIC_SCALE_1', 'ECO2_MAT_BOAR_A_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 880, fx: [{ effectId: 'EFX_SWORD_STORM_STRIKE', params: { slashPower: 600, maxTargets: 5, armorPenRatio: 0.4 } }] },

  // Weapons - BLADE (T2, T4, T6)
  { type: 'BLADE', slot: 'WEAPON', t: 2, name: 'ดาบกรงเล็บวายุไพร', inMats: ['ECO2_MAT_FELINE_A_2', 'ECO2_MAT_BOAR_B_1'], ore: 'MAT_ORE_COLD_STEEL_2', val: 140, fx: [{ effectId: 'EFX_BLEEDING', params: { bleedDamagePerTurn: 32 } }] },
  { type: 'BLADE', slot: 'WEAPON', t: 4, name: 'ดาบเขี้ยวหมูป่าหินหลอม', inMats: ['ECO2_MAT_BOAR_A_4', 'ECO2_MAT_URSINE_A_4'], ore: 'MAT_ORE_MITHRIL_JADE_4', val: 280, fx: [{ effectId: 'EFX_BURNING', params: { burnDamagePerTurn: 48 } }] },
  { type: 'BLADE', slot: 'WEAPON', t: 6, name: 'ดาบเขี้ยวไป๋หู่พิฆาตดารา', inMats: ['ECO2_MAT_MYTHIC_FANG_4', 'ECO2_MAT_URSINE_A_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 880, fx: [{ effectId: 'EFX_ARMOR_FRACTURE', params: { armorReductionRatio: 0.35 } }] },

  // Weapons - BOW (T3, T5)
  { type: 'BOW', slot: 'WEAPON', t: 3, name: 'ธนูปีกอินทรีศิลา', inMats: ['ECO2_MAT_AVIAN_A_3', 'ECO2_MAT_UNGULATE_A_3'], ore: 'MAT_ORE_STAR_COPPER_3', val: 210, fx: [{ effectId: 'EFX_INTENT_SENSE', params: { intentSensitivity: 60, firstTurnEvasionBonus: 0.25 } }] },
  { type: 'BOW', slot: 'WEAPON', t: 5, name: 'ธนูขนนกอัสนีคำรณ', inMats: ['ECO2_MAT_AVIAN_A_5', 'ECO2_MAT_UNGULATE_A_5'], ore: 'MAT_ORE_METEOR_IRON_5', val: 560, fx: [{ effectId: 'EFX_SHOCK_CONDUCTION', params: { shockDamage: 85, maxChainTargets: 3 } }] },

  // Weapons - SPEAR (T3, T5)
  { type: 'SPEAR', slot: 'WEAPON', t: 3, name: 'หอกเขาเหล็กกระทิงศิลา', inMats: ['ECO2_MAT_UNGULATE_A_3', 'ECO2_MAT_BOAR_B_3'], ore: 'MAT_ORE_STAR_COPPER_3', val: 210, fx: [{ effectId: 'EFX_ARMOR_FRACTURE', params: { armorReductionRatio: 0.22 } }] },
  { type: 'SPEAR', slot: 'WEAPON', t: 5, name: 'ทวนมหาเขากระทิงเพลิง', inMats: ['ECO2_MAT_UNGULATE_A_5', 'ECO2_MAT_FELINE_A_5'], ore: 'MAT_ORE_METEOR_IRON_5', val: 560, fx: [{ effectId: 'EFX_BURNING', params: { burnDamagePerTurn: 55 } }] },

  // Weapons - STAFF (T2, T5)
  { type: 'STAFF', slot: 'WEAPON', t: 2, name: 'พลองกระดูกหมีหินผา', inMats: ['ECO2_MAT_URSINE_A_2', 'ECO2_MAT_UNGULATE_A_2'], ore: 'MAT_ORE_COLD_STEEL_2', val: 140, fx: [{ effectId: 'EFX_BARRIER_SHIELD', params: { barrierCapacity: 450 } }] },
  { type: 'STAFF', slot: 'WEAPON', t: 5, name: 'กระบองกระดูกหมีหิมะโบราณ', inMats: ['ECO2_MAT_URSINE_A_5', 'ECO2_MAT_CHIMERA_A_5'], ore: 'MAT_ORE_METEOR_IRON_5', val: 560, fx: [{ effectId: 'EFX_DAMAGE_REFLECT', params: { reflectRatio: 0.30, maxReflectCap: 650 } }] },

  // Weapons - FIST (T3, T5)
  { type: 'FIST', slot: 'WEAPON', t: 3, name: 'สนับกรงเล็บเสือดาบศิลา', inMats: ['ECO2_MAT_FELINE_A_3', 'ECO2_MAT_CHIMERA_B_3'], ore: 'MAT_ORE_STAR_COPPER_3', val: 210, fx: [{ effectId: 'EFX_BLEEDING', params: { bleedDamagePerTurn: 38 } }] },
  { type: 'FIST', slot: 'WEAPON', t: 5, name: 'สนับเขี้ยวพยัคฆ์ขาวเหมันต์', inMats: ['ECO2_MAT_FELINE_A_5', 'ECO2_MAT_CANINE_A_5'], ore: 'MAT_ORE_METEOR_IRON_5', val: 560, fx: [{ effectId: 'EFX_CHILL_FREEZE', params: { chillStacks: 2, slowRatio: 0.35 } }] },

  // Weapons - FOCUS (T3, T5)
  { type: 'FOCUS', slot: 'WEAPON', t: 3, name: 'ตราดวงจิตกิเลนศิลา', inMats: ['ECO2_MAT_CHIMERA_B_3', 'ECO2_MAT_SHELL_B_3'], ore: 'MAT_ORE_STAR_COPPER_3', val: 210, fx: [{ effectId: 'EFX_QI_RESERVOIR', params: { reservoirCapacity: 420, leakagePerDay: 2 } }] },
  { type: 'FOCUS', slot: 'WEAPON', t: 5, name: 'ตราเพลิงกิเลนม่วงเก้าวัฏจักร', inMats: ['ECO2_MAT_CHIMERA_A_5', 'ECO2_MAT_AQUATIC_B_5'], ore: 'MAT_ORE_METEOR_IRON_5', val: 560, fx: [{ effectId: 'EFX_QI_SIPHON', params: { siphonAmount: 90, conversionEfficiency: 0.8 } }] },

  // Armor - HEAVY (T2, T4, T6)
  { type: 'HEAVY', slot: 'ARMOR', t: 2, name: 'เกราะหนักหนามเหล็กหมูป่า', inMats: ['ECO2_MAT_BOAR_B_2', 'ECO2_MAT_SHELL_B_2'], ore: 'MAT_ORE_COLD_STEEL_2', val: 150, fx: [{ effectId: 'EFX_DAMAGE_REFLECT', params: { reflectRatio: 0.20, maxReflectCap: 400 } }] },
  { type: 'HEAVY', slot: 'ARMOR', t: 4, name: 'เกราะหนักหมีเหล็กไหลหลังทอง', inMats: ['ECO2_MAT_URSINE_A_4', 'ECO2_MAT_SHELL_A_4'], ore: 'MAT_ORE_MITHRIL_JADE_4', val: 300, fx: [{ effectId: 'EFX_CONTROL_RESILIENCE', params: { controlDurationReductionRatio: 0.4, resilienceScore: 55 } }] },
  { type: 'HEAVY', slot: 'ARMOR', t: 6, name: 'เกราะหนักกระดองเสวียนอู่ค้ำฟ้า', inMats: ['ECO2_MAT_MYTHIC_SHELL_3', 'ECO2_MAT_BOAR_B_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 920, fx: [{ effectId: 'EFX_REALM_SUPPRESSION_GUARD', params: { maxCrossRealmDelta: 2.0, suppressionReductionRatio: 0.45 } }] },

  // Armor - LIGHT (T2, T4, T6)
  { type: 'LIGHT', slot: 'ARMOR', t: 2, name: 'เกราะเบาหนังเสือดาววายุ', inMats: ['ECO2_MAT_FELINE_B_2', 'ECO2_MAT_CHIMERA_B_2'], ore: 'MAT_ORE_COLD_STEEL_2', val: 140, fx: [{ effectId: 'EFX_SIDESTEP_EVASION', params: { evasionChanceBonus: 0.20, movementCost: 3 } }] },
  { type: 'LIGHT', slot: 'ARMOR', t: 4, name: 'เกราะเบาหนังหมาป่าเพลิงโลหิต', inMats: ['ECO2_MAT_CANINE_B_4', 'ECO2_MAT_UNGULATE_A_4'], ore: 'MAT_ORE_MITHRIL_JADE_4', val: 280, fx: [{ effectId: 'EFX_TIMED_PARRY', params: { parryMitigationRatio: 0.45, parryCharges: 2 } }] },
  { type: 'LIGHT', slot: 'ARMOR', t: 6, name: 'เกราะเบาหนังพยัคฆ์ขาวเจ็ดดาว', inMats: ['ECO2_MAT_MYTHIC_PELT_4', 'ECO2_MAT_CANINE_B_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 890, fx: [{ effectId: 'EFX_SIDESTEP_EVASION', params: { evasionChanceBonus: 0.32, movementCost: 2 } }] },

  // Armor - ROBE (T2, T4, T6)
  { type: 'ROBE', slot: 'ARMOR', t: 2, name: 'อาภรณ์แพรนกกระเรียนหยก', inMats: ['ECO2_MAT_AVIAN_B_2', 'ECO2_MAT_SERPENT_B_1'], ore: 'MAT_ORE_COLD_STEEL_2', val: 140, fx: [{ effectId: 'EFX_QI_RESERVOIR', params: { reservoirCapacity: 350, leakagePerDay: 2 } }] },
  { type: 'ROBE', slot: 'ARMOR', t: 4, name: 'อาภรณ์ไหมแมงมุมเงารัตติกาล', inMats: ['ECO2_MAT_ARTHROPOD_A_4', 'ECO2_MAT_AVIAN_A_4'], ore: 'MAT_ORE_MITHRIL_JADE_4', val: 280, fx: [{ effectId: 'EFX_STEALTH_CONCEALMENT', params: { concealmentScore: 55 } }] },
  { type: 'ROBE', slot: 'ARMOR', t: 6, name: 'อาภรณ์แพรโพธิ์สวรรค์หมื่นปี', inMats: ['ECO2_MAT_MYTHIC_ROOT_8', 'ECO2_MAT_PLANT_SPIRIT_B_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 900, fx: [{ effectId: 'EFX_CALM_MIND', params: { heartDemonReduction: 35, soulDefenseBonus: 50 } }] },

  // Accessories - RING (T3, T5)
  { type: 'RING', slot: 'ACCESSORY', t: 3, name: 'แหวนแก่นเต่าศิลาดำ', inMats: ['ECO2_MAT_SHELL_B_3', 'ECO2_MAT_ARTHROPOD_A_3'], ore: 'MAT_ORE_STAR_COPPER_3', val: 200, fx: [{ effectId: 'EFX_BARRIER_SHIELD', params: { barrierCapacity: 480 } }] },
  { type: 'RING', slot: 'ACCESSORY', t: 5, name: 'แหวนไข่มุกวิญญาณวาฬคราม', inMats: ['ECO2_MAT_AQUATIC_B_5', 'ECO2_MAT_SHELL_A_5'], ore: 'MAT_ORE_METEOR_IRON_5', val: 540, fx: [{ effectId: 'EFX_QI_SIPHON', params: { siphonAmount: 80, conversionEfficiency: 0.75 } }] },

  // Accessories - NECKLACE (T3, T5)
  { type: 'NECKLACE', slot: 'ACCESSORY', t: 3, name: 'สร้อยเขากวางดาวสารท', inMats: ['ECO2_MAT_UNGULATE_A_3', 'ECO2_MAT_BOAR_A_1'], ore: 'MAT_ORE_STAR_COPPER_3', val: 200, fx: [{ effectId: 'EFX_CALM_MIND', params: { heartDemonReduction: 25, soulDefenseBonus: 35 } }] },
  { type: 'NECKLACE', slot: 'ACCESSORY', t: 5, name: 'สร้อยมงกุฎเขากวางดาราสวรรค์', inMats: ['ECO2_MAT_UNGULATE_A_5', 'ECO2_MAT_AVIAN_A_5'], ore: 'MAT_ORE_METEOR_IRON_5', val: 540, fx: [{ effectId: 'EFX_INTENT_SENSE', params: { intentSensitivity: 65, firstTurnEvasionBonus: 0.28 } }] },

  // Accessories - BRACELET (T3, T5)
  { type: 'BRACELET', slot: 'ACCESSORY', t: 3, name: 'กำไลเกล็ดชะโดหนองบึง', inMats: ['ECO2_MAT_AQUATIC_A_3', 'ECO2_MAT_SERPENT_B_3'], ore: 'MAT_ORE_STAR_COPPER_3', val: 200, fx: [{ effectId: 'EFX_SUPPLY_EFFICIENCY', params: { supplySavingRatio: 0.25 } }] },
  { type: 'BRACELET', slot: 'ACCESSORY', t: 5, name: 'กำไลเกล็ดกิเลนเพลิงม่วง', inMats: ['ECO2_MAT_CHIMERA_A_5', 'ECO2_MAT_ARTHROPOD_A_5'], ore: 'MAT_ORE_METEOR_IRON_5', val: 540, fx: [{ effectId: 'EFX_BURNING', params: { burnDamagePerTurn: 45 } }] },

  // Accessories - CHARM (T4)
  { type: 'CHARM', slot: 'ACCESSORY', t: 4, name: 'เครื่องรางกระดองเต่าลาวาเพลิง', inMats: ['ECO2_MAT_SHELL_A_4', 'ECO2_MAT_AQUATIC_A_4'], ore: 'MAT_ORE_MITHRIL_JADE_4', val: 270, fx: [{ effectId: 'EFX_TRIBULATION_SHIELD', params: { tribulationMitigationRatio: 0.30, maxSupportedLayers: 6 } }] },

  // Additional T6 Equipment & Mythic consumers to connect remaining T6 & T7 parts
  { type: 'FIST', slot: 'WEAPON', t: 6, name: 'สนับเขาคู่เทาเที่ยกลืนวิญญาณ', inMats: ['ECO2_MAT_MYTHIC_HORN_7', 'ECO2_MAT_FELINE_B_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 890, fx: [{ effectId: 'EFX_VITALITY_STEAL', params: { vitalityStealRatio: 0.35 } }] },
  { type: 'ACCESSORY', slot: 'ACCESSORY', t: 6, name: 'ถุงมิติกระเพาะเทาเที่ยกลืนหมื่นภพ', inMats: ['ECO2_MAT_MYTHIC_STOMACH_7', 'ECO2_MAT_AQUATIC_A_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 950, fx: [{ effectId: 'EFX_SUPPLY_EFFICIENCY', params: { supplySavingRatio: 0.40 } }] },
  { type: 'FOCUS', slot: 'WEAPON', t: 6, name: 'ตรามุกสมุทรดารากลืนภพ', inMats: ['ECO2_MAT_MYTHIC_WING_6', 'ECO2_MAT_AQUATIC_B_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 940, fx: [{ effectId: 'EFX_SPATIAL_LOCK', params: { lockStrength: 85 } }] },
  { type: 'BRACELET', slot: 'ACCESSORY', t: 6, name: 'กำไลเกล็ดย้อนอสรพิษบรรพกาล', inMats: ['ECO2_MAT_SERPENT_B_6', 'ECO2_MAT_CHIMERA_B_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 890, fx: [{ effectId: 'EFX_TOXIN_INFECTION', params: { toxinPotency: 55 } }] },
  { type: 'ARMOR', slot: 'ARMOR', t: 6, name: 'เกราะเปลือกแมลงทองคำอมตะ', inMats: ['ECO2_MAT_ARTHROPOD_B_6', 'ECO2_MAT_URSINE_B_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 920, fx: [{ effectId: 'EFX_STRUCTURAL_IMMUNITY_FLOOR', params: { floorTier: 6, minIntegrityRequired: 80 } }] },
  { type: 'CHARM', slot: 'ACCESSORY', t: 6, name: 'เครื่องรางมงกุฎกวางดาราสวรรค์', inMats: ['ECO2_MAT_UNGULATE_B_6', 'ECO2_MAT_AVIAN_B_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 910, fx: [{ effectId: 'EFX_CALM_MIND', params: { heartDemonReduction: 40, soulDefenseBonus: 60 } }] },
  { type: 'RING', slot: 'ACCESSORY', t: 6, name: 'แหวนแผ่นกระดองปฐพีบรรพกาล', inMats: ['ECO2_MAT_SHELL_B_6', 'ECO2_MAT_PLANT_SPIRIT_A_6'], ore: 'MAT_ORE_DIVINE_GOLD_6', val: 930, fx: [{ effectId: 'EFX_VEIN_ANCHORED', params: { veinThroughputMult: 1.4 } }] }
];

// Ensure we have exactly 32 equipment recipes
const TARGET_EQ = EQ_DEFINITIONS.slice(0, 32);

let eqCounter = 1;
for (const eq of TARGET_EQ) {
  const padNum = String(eqCounter).padStart(3, '0');
  const itemId = `ECO2_EQ_${padNum}_${eq.type}_${eq.t}`;
  const recipeId = `ECO2_REC_EQ_${padNum}_${eq.type}_${eq.t}`;

  const item = {
    id: itemId,
    recipeId: recipeId,
    nameTh: eq.name,
    cat: 'EQUIPMENT',
    out: 'EQUIPMENT',
    slot: eq.slot,
    gearType: eq.type,
    tier: eq.t,
    minStage: eq.t === 6 ? 5 : eq.t >= 4 ? 3 : eq.t >= 3 ? 2 : 1,
    value: eq.val,
    craft: 'FORGING',
    durability: 100,
    charges: null,
    effects: eq.fx
  };

  const recipe = {
    id: recipeId,
    nameTh: 'ตำรับหลอม' + eq.name,
    craft: 'FORGING',
    tier: eq.t,
    minMastery: eq.t * 14,
    days: eq.t * 3,
    inputs: eq.inMats.map(m => ({ matId: m, count: 2 })).concat([{ matId: eq.ore, count: 2 + eq.t }]),
    outType: 'EQUIPMENT',
    outItemId: itemId,
    outNameTh: eq.name,
    yield: 1,
    gearType: eq.type,
    starter: eq.t <= 2
  };

  itemsList.push(item);
  recipesList.push(recipe);
  eqCounter++;
}

console.log(`Generated ${itemsList.length} equipment items and recipes.`);
console.log(`Total: ${speciesList.length} species, ${materialsList.length} materials, ${recipesList.length} recipes, ${itemsList.length} items.`);

// Validation of input coverage
const recipeInputMats = new Set();
recipesList.forEach(r => r.inputs.forEach(i => recipeInputMats.add(i.matId)));

// Ensure every material is consumed in at least one recipe or tradable
for (const mat of materialsList) {
  const isUsed = recipeInputMats.has(mat.id);
  const isTradable = mat.tier <= 3;
  if (!isUsed && !isTradable) {
    // If somehow a high tier material wasn't picked, link it as bonus input to matching tier recipe
    const candRecipe = recipesList.find(r => r.tier === mat.tier || (mat.tier === 7 && r.tier === 6));
    if (candRecipe) {
      candRecipe.inputs.push({ matId: mat.id, count: 1 });
      recipeInputMats.add(mat.id);
      console.log(`Auto-linked ${mat.id} to recipe ${candRecipe.id}`);
    }
  }
}

// Final check: assert every material is either in recipe or tradable
for (const mat of materialsList) {
  const isUsed = recipeInputMats.has(mat.id);
  const isTradable = mat.tier <= 3;
  if (!isUsed && !isTradable) {
    throw new Error(`Fatal: Dead material ${mat.id} has no recipe or market use!`);
  }
}

// Output data_ecology.js file
const code = `/* data_ecology.js — Living Beast & Craft Expansion v1.10.12
 * 80 Beast Species, 160 Materials, 80 Recipes (48 Pills + 32 Equipment).
 * Self-contained extension registered into JD.BEASTS and JD.ITEMS. */
(function(g) {
  'use strict';
  g.JD = g.JD || {};
  const JD = g.JD;

  const species = ${JSON.stringify(speciesList, null, 2)};
  const materials = ${JSON.stringify(materialsList, null, 2)};
  const recipes = ${JSON.stringify(recipesList, null, 2)};
  const items = ${JSON.stringify(itemsList, null, 2)};

  const ECOLOGY = {
    VERSION: '1.10.12',
    species,
    materials,
    recipes,
    items,
    speciesById: Object.fromEntries(species.map(s => [s.id, s])),
    materialById: Object.fromEntries(materials.map(m => [m.id, m])),
    recipeById: Object.fromEntries(recipes.map(r => [r.id, r])),
    itemById: Object.fromEntries(items.map(i => [i.id, i]))
  };

  JD.ECOLOGY = ECOLOGY;

  // Register into global catalogs before consumers build lookup maps
  JD.BEASTS = JD.BEASTS || { species: [], kings: [] };
  JD.BEASTS.species = JD.BEASTS.species || [];
  JD.BEASTS.species.push(...species);

  JD.ITEMS = JD.ITEMS || { materials: [], recipes: [], items: [] };
  JD.ITEMS.materials = JD.ITEMS.materials || [];
  JD.ITEMS.recipes = JD.ITEMS.recipes || [];
  JD.ITEMS.items = JD.ITEMS.items || [];

  JD.ITEMS.materials.push(...materials);
  JD.ITEMS.recipes.push(...recipes);
  JD.ITEMS.items.push(...items);

})(typeof globalThis !== 'undefined' ? globalThis : this);
`;

const destPath = path.resolve(__dirname, '../data/data_ecology.js');
fs.writeFileSync(destPath, code, 'utf8');
console.log(`Successfully wrote ${destPath} (${Math.round(code.length / 1024)} KB)`);
