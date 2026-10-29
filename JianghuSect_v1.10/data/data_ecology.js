/* data_ecology.js — Living Beast & Craft Expansion v1.10.12
 * 80 Beast Species, 160 Materials, 80 Recipes (48 Pills + 32 Equipment).
 * Self-contained extension registered into JD.BEASTS and JD.ITEMS. */
(function(g) {
  'use strict';
  g.JD = g.JD || {};
  const JD = g.JD;

  const species = [
  {
    "id": "ECO2_BEAST_CANINE_1",
    "nameTh": "หมาป่าหมอกคราม",
    "tier": 1,
    "cp": 95,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_CANINE_A_1",
      "ECO2_MAT_CANINE_B_1"
    ],
    "terrain": "forest",
    "family": "CANINE",
    "archetype": "CANINE",
    "element": "WIND",
    "visual": {
      "body": "#718fa7",
      "accent": "#c8e9f1",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_CANINE_2",
    "nameTh": "หมาป่าเงาจันทร์",
    "tier": 2,
    "cp": 215,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_CANINE_A_2",
      "ECO2_MAT_CANINE_B_2"
    ],
    "terrain": "forest",
    "family": "CANINE",
    "archetype": "CANINE",
    "element": "YIN_SHADOW",
    "visual": {
      "body": "#4a5b6d",
      "accent": "#8ba4b8",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_CANINE_3",
    "nameTh": "สุนัขป่าลมกรดทักษิณ",
    "tier": 3,
    "cp": 460,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_CANINE_A_3",
      "ECO2_MAT_CANINE_B_3"
    ],
    "terrain": "plains",
    "family": "CANINE",
    "archetype": "CANINE",
    "element": "WIND",
    "visual": {
      "body": "#7d8a6e",
      "accent": "#c2d4a6",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_CANINE_4",
    "nameTh": "หมาป่าโลหิตกระหายศึก",
    "tier": 4,
    "cp": 980,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_CANINE_A_4",
      "ECO2_MAT_CANINE_B_4"
    ],
    "terrain": "mountain",
    "family": "CANINE",
    "archetype": "CANINE",
    "element": "BLOOD_DEMON",
    "visual": {
      "body": "#8a3a3a",
      "accent": "#d86262",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_CANINE_5",
    "nameTh": "จิ้งจอกเงินเก้าหางค้ำดึก",
    "tier": 5,
    "cp": 2500,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_CANINE_A_5",
      "ECO2_MAT_CANINE_B_5"
    ],
    "terrain": "mountain",
    "family": "CANINE",
    "archetype": "CANINE",
    "element": "ASTRAL",
    "visual": {
      "body": "#b8c4d1",
      "accent": "#f0f4f8",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_CANINE_6",
    "nameTh": "ราชันย์หมาป่ากลืนตะวัน",
    "tier": 6,
    "cp": 6500,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_CANINE_A_6",
      "ECO2_MAT_CANINE_B_6"
    ],
    "terrain": "mountain",
    "family": "CANINE",
    "archetype": "CANINE",
    "element": "FIRE",
    "visual": {
      "body": "#c26127",
      "accent": "#f5b042",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_FELINE_1",
    "nameTh": "แมวป่าลายเสือหินผา",
    "tier": 1,
    "cp": 100,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_FELINE_A_1",
      "ECO2_MAT_FELINE_B_1"
    ],
    "terrain": "mountain",
    "family": "FELINE",
    "archetype": "FELINE",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#968165",
      "accent": "#d4c0a5",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_FELINE_2",
    "nameTh": "เสือดาววายุไพร",
    "tier": 2,
    "cp": 220,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_FELINE_A_2",
      "ECO2_MAT_FELINE_B_2"
    ],
    "terrain": "forest",
    "family": "FELINE",
    "archetype": "FELINE",
    "element": "WIND",
    "visual": {
      "body": "#8c9c72",
      "accent": "#c8deb0",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_FELINE_3",
    "nameTh": "พยัคฆ์เขี้ยวดาบเกราะศิลา",
    "tier": 3,
    "cp": 470,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_FELINE_A_3",
      "ECO2_MAT_FELINE_B_3"
    ],
    "terrain": "mountain",
    "family": "FELINE",
    "archetype": "FELINE",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#736d5e",
      "accent": "#a89f8b",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_FELINE_4",
    "nameTh": "เสือดาวเพลิงอสูร",
    "tier": 4,
    "cp": 1020,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_FELINE_A_4",
      "ECO2_MAT_FELINE_B_4"
    ],
    "terrain": "desert",
    "family": "FELINE",
    "archetype": "FELINE",
    "element": "FIRE",
    "visual": {
      "body": "#b5582f",
      "accent": "#fab066",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_FELINE_5",
    "nameTh": "พยัคฆ์ขาวเหมันต์ทะลวงเมฆ",
    "tier": 5,
    "cp": 2600,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_FELINE_A_5",
      "ECO2_MAT_FELINE_B_5"
    ],
    "terrain": "mountain",
    "family": "FELINE",
    "archetype": "FELINE",
    "element": "WATER_ICE",
    "visual": {
      "body": "#abbdd1",
      "accent": "#eef6fc",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_FELINE_6",
    "nameTh": "พยัคฆ์สายฟ้าทมิฬเก้าสวรรค์",
    "tier": 6,
    "cp": 7200,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_FELINE_A_6",
      "ECO2_MAT_FELINE_B_6"
    ],
    "terrain": "mountain",
    "family": "FELINE",
    "archetype": "FELINE",
    "element": "LIGHTNING",
    "visual": {
      "body": "#4a3b69",
      "accent": "#b28df7",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_URSINE_1",
    "nameTh": "หมีดำดงไผ่",
    "tier": 1,
    "cp": 110,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_URSINE_A_1",
      "ECO2_MAT_URSINE_B_1"
    ],
    "terrain": "forest",
    "family": "URSINE",
    "archetype": "URSINE",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#3c3a38",
      "accent": "#706b67",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_URSINE_2",
    "nameTh": "หมีหินผาทะลวงหุบเขา",
    "tier": 2,
    "cp": 235,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_URSINE_A_2",
      "ECO2_MAT_URSINE_B_2"
    ],
    "terrain": "mountain",
    "family": "URSINE",
    "archetype": "URSINE",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#61584c",
      "accent": "#998c7b",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_URSINE_3",
    "nameTh": "หมีเพลิงพิโรธถ้ำลาวา",
    "tier": 3,
    "cp": 485,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_URSINE_A_3",
      "ECO2_MAT_URSINE_B_3"
    ],
    "terrain": "mountain",
    "family": "URSINE",
    "archetype": "URSINE",
    "element": "FIRE",
    "visual": {
      "body": "#853e28",
      "accent": "#d66e4b",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_URSINE_4",
    "nameTh": "หมีเกราะเหล็กไหลหลังทอง",
    "tier": 4,
    "cp": 1080,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_URSINE_A_4",
      "ECO2_MAT_URSINE_B_4"
    ],
    "terrain": "mountain",
    "family": "URSINE",
    "archetype": "URSINE",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#575b63",
      "accent": "#e6be43",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_URSINE_5",
    "nameTh": "หมีพายุหิมะโบราณ",
    "tier": 5,
    "cp": 2650,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_URSINE_A_5",
      "ECO2_MAT_URSINE_B_5"
    ],
    "terrain": "mountain",
    "family": "URSINE",
    "archetype": "URSINE",
    "element": "WATER_ICE",
    "visual": {
      "body": "#a6becc",
      "accent": "#e8f3f7",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_URSINE_6",
    "nameTh": "ราชันย์หมีปฐพีสะเทือนฟ้า",
    "tier": 6,
    "cp": 7500,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_URSINE_A_6",
      "ECO2_MAT_URSINE_B_6"
    ],
    "terrain": "mountain",
    "family": "URSINE",
    "archetype": "URSINE",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#57422f",
      "accent": "#cfa878",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_BOAR_1",
    "nameTh": "หมูป่าเขี้ยวสั้นหน้าผา",
    "tier": 1,
    "cp": 105,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_BOAR_A_1",
      "ECO2_MAT_BOAR_B_1"
    ],
    "terrain": "plains",
    "family": "BOAR",
    "archetype": "BOAR",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#736151",
      "accent": "#b59e89",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_BOAR_2",
    "nameTh": "หมูป่าเกราะหนามโลหะ",
    "tier": 2,
    "cp": 225,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_BOAR_A_2",
      "ECO2_MAT_BOAR_B_2"
    ],
    "terrain": "plains",
    "family": "BOAR",
    "archetype": "BOAR",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#5c5c5c",
      "accent": "#a6a6a6",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_BOAR_3",
    "nameTh": "หมูป่าดินโป่งปราณคราม",
    "tier": 3,
    "cp": 450,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_BOAR_A_3",
      "ECO2_MAT_BOAR_B_3"
    ],
    "terrain": "forest",
    "family": "BOAR",
    "archetype": "BOAR",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#4a6b57",
      "accent": "#8fbaa0",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_BOAR_4",
    "nameTh": "หมูป่าเขาศิลาอัคนี",
    "tier": 4,
    "cp": 1000,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_BOAR_A_4",
      "ECO2_MAT_BOAR_B_4"
    ],
    "terrain": "mountain",
    "family": "BOAR",
    "archetype": "BOAR",
    "element": "FIRE",
    "visual": {
      "body": "#8c4837",
      "accent": "#e87c64",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_BOAR_5",
    "nameTh": "หมูป่าเกราะเพชรโบราณ",
    "tier": 5,
    "cp": 2550,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_BOAR_A_5",
      "ECO2_MAT_BOAR_B_5"
    ],
    "terrain": "mountain",
    "family": "BOAR",
    "archetype": "BOAR",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#6a7885",
      "accent": "#cbe4fa",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_BOAR_6",
    "nameTh": "พญาหมูป่าเก้าภูผาทลายทวีป",
    "tier": 6,
    "cp": 6800,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_BOAR_A_6",
      "ECO2_MAT_BOAR_B_6"
    ],
    "terrain": "mountain",
    "family": "BOAR",
    "archetype": "BOAR",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#634938",
      "accent": "#dba881",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_SERPENT_1",
    "nameTh": "งูดงไผ่เขียวมรกต",
    "tier": 1,
    "cp": 98,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_SERPENT_A_1",
      "ECO2_MAT_SERPENT_B_1"
    ],
    "terrain": "forest",
    "family": "SERPENT",
    "archetype": "SERPENT",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#4b7549",
      "accent": "#86c282",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_SERPENT_2",
    "nameTh": "งูพิษทรายแดง",
    "tier": 2,
    "cp": 215,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_SERPENT_A_2",
      "ECO2_MAT_SERPENT_B_2"
    ],
    "terrain": "desert",
    "family": "SERPENT",
    "archetype": "SERPENT",
    "element": "FIRE",
    "visual": {
      "body": "#945b46",
      "accent": "#d69780",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_SERPENT_3",
    "nameTh": "เหลือมศิลาหุบเขาลึก",
    "tier": 3,
    "cp": 460,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_SERPENT_A_3",
      "ECO2_MAT_SERPENT_B_3"
    ],
    "terrain": "mountain",
    "family": "SERPENT",
    "archetype": "SERPENT",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#5e5a52",
      "accent": "#999285",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_SERPENT_4",
    "nameTh": "งูเห่าหมอกเหมันต์",
    "tier": 4,
    "cp": 990,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_SERPENT_A_4",
      "ECO2_MAT_SERPENT_B_4"
    ],
    "terrain": "mountain",
    "family": "SERPENT",
    "archetype": "SERPENT",
    "element": "WATER_ICE",
    "visual": {
      "body": "#6e899c",
      "accent": "#b8daf0",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_SERPENT_5",
    "nameTh": "พญางูเหลือมเพลิงเก้าชีพจร",
    "tier": 5,
    "cp": 2500,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_SERPENT_A_5",
      "ECO2_MAT_SERPENT_B_5"
    ],
    "terrain": "mountain",
    "family": "SERPENT",
    "archetype": "SERPENT",
    "element": "FIRE",
    "visual": {
      "body": "#ad4931",
      "accent": "#f79f65",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_SERPENT_6",
    "nameTh": "ราชันย์อสรพิษดำใต้พิภพบรรพกาล",
    "tier": 6,
    "cp": 7400,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_SERPENT_A_6",
      "ECO2_MAT_SERPENT_B_6"
    ],
    "terrain": "mountain",
    "family": "SERPENT",
    "archetype": "SERPENT",
    "element": "YIN_SHADOW",
    "visual": {
      "body": "#322c38",
      "accent": "#7a668f",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_AVIAN_1",
    "nameTh": "เหยี่ยวลมกรดทุ่งหญ้า",
    "tier": 1,
    "cp": 96,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_AVIAN_A_1",
      "ECO2_MAT_AVIAN_B_1"
    ],
    "terrain": "plains",
    "family": "AVIAN",
    "archetype": "AVIAN",
    "element": "WIND",
    "visual": {
      "body": "#80776b",
      "accent": "#c9bfb1",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_AVIAN_2",
    "nameTh": "นกกระเรียนหยกธารน้ำ",
    "tier": 2,
    "cp": 210,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_AVIAN_A_2",
      "ECO2_MAT_AVIAN_B_2"
    ],
    "terrain": "forest",
    "family": "AVIAN",
    "archetype": "AVIAN",
    "element": "WATER_ICE",
    "visual": {
      "body": "#5b827e",
      "accent": "#aae0d9",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_AVIAN_3",
    "nameTh": "อินทรีศิลาหน้าผาสูง",
    "tier": 3,
    "cp": 470,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_AVIAN_A_3",
      "ECO2_MAT_AVIAN_B_3"
    ],
    "terrain": "mountain",
    "family": "AVIAN",
    "archetype": "AVIAN",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#66615b",
      "accent": "#ada79e",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_AVIAN_4",
    "nameTh": "เหยี่ยวเพลิงเมฆาสารท",
    "tier": 4,
    "cp": 1040,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_AVIAN_A_4",
      "ECO2_MAT_AVIAN_B_4"
    ],
    "terrain": "mountain",
    "family": "AVIAN",
    "archetype": "AVIAN",
    "element": "FIRE",
    "visual": {
      "body": "#a6543b",
      "accent": "#fab082",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_AVIAN_5",
    "nameTh": "พญาอินทรีวายุสายฟ้า",
    "tier": 5,
    "cp": 2600,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_AVIAN_A_5",
      "ECO2_MAT_AVIAN_B_5"
    ],
    "terrain": "mountain",
    "family": "AVIAN",
    "archetype": "AVIAN",
    "element": "LIGHTNING",
    "visual": {
      "body": "#4b5780",
      "accent": "#9bb2fc",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_AVIAN_6",
    "nameTh": "ราชันย์วิหคเพลิงอมฤตเก้าภพ",
    "tier": 6,
    "cp": 8200,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_AVIAN_A_6",
      "ECO2_MAT_AVIAN_B_6"
    ],
    "terrain": "mountain",
    "family": "AVIAN",
    "archetype": "AVIAN",
    "element": "LIGHT_YANG",
    "visual": {
      "body": "#bd4024",
      "accent": "#ffd56b",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_ARTHROPOD_1",
    "nameTh": "ตั๊กแตนใบไม้คมกริบ",
    "tier": 1,
    "cp": 95,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_ARTHROPOD_A_1",
      "ECO2_MAT_ARTHROPOD_B_1"
    ],
    "terrain": "forest",
    "family": "ARTHROPOD",
    "archetype": "ARTHROPOD",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#5d824d",
      "accent": "#a1d48c",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_ARTHROPOD_2",
    "nameTh": "ตะขาบแดงร้อยขา",
    "tier": 2,
    "cp": 220,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_ARTHROPOD_A_2",
      "ECO2_MAT_ARTHROPOD_B_2"
    ],
    "terrain": "mountain",
    "family": "ARTHROPOD",
    "archetype": "ARTHROPOD",
    "element": "FIRE",
    "visual": {
      "body": "#9c4038",
      "accent": "#e3847b",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_ARTHROPOD_3",
    "nameTh": "ด้วงเกราะเหล็กดำดิน",
    "tier": 3,
    "cp": 460,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_ARTHROPOD_A_3",
      "ECO2_MAT_ARTHROPOD_B_3"
    ],
    "terrain": "plains",
    "family": "ARTHROPOD",
    "archetype": "ARTHROPOD",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#3b3b3b",
      "accent": "#828282",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_ARTHROPOD_4",
    "nameTh": "แมงมุมพิษเร้นเงารัตติกาล",
    "tier": 4,
    "cp": 970,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_ARTHROPOD_A_4",
      "ECO2_MAT_ARTHROPOD_B_4"
    ],
    "terrain": "forest",
    "family": "ARTHROPOD",
    "archetype": "ARTHROPOD",
    "element": "YIN_SHADOW",
    "visual": {
      "body": "#41354d",
      "accent": "#8a72a3",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_ARTHROPOD_5",
    "nameTh": "พญาแมงป่องผลึกอสนีบาต",
    "tier": 5,
    "cp": 2480,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_ARTHROPOD_A_5",
      "ECO2_MAT_ARTHROPOD_B_5"
    ],
    "terrain": "desert",
    "family": "ARTHROPOD",
    "archetype": "ARTHROPOD",
    "element": "LIGHTNING",
    "visual": {
      "body": "#674d80",
      "accent": "#bda6de",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_ARTHROPOD_6",
    "nameTh": "จักรพรรดิแมลงทองคำกลืนปราณ",
    "tier": 6,
    "cp": 6600,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_ARTHROPOD_A_6",
      "ECO2_MAT_ARTHROPOD_B_6"
    ],
    "terrain": "desert",
    "family": "ARTHROPOD",
    "archetype": "ARTHROPOD",
    "element": "LIGHT_YANG",
    "visual": {
      "body": "#b09435",
      "accent": "#ffea80",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_SHELL_1",
    "nameTh": "ตะพาบน้ำลำธารหิน",
    "tier": 1,
    "cp": 102,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_SHELL_A_1",
      "ECO2_MAT_SHELL_B_1"
    ],
    "terrain": "water",
    "family": "SHELL",
    "archetype": "SHELL",
    "element": "WATER_ICE",
    "visual": {
      "body": "#5a6e69",
      "accent": "#98b8af",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_SHELL_2",
    "nameTh": "เต่าหญ้าเขียวร้อยปี",
    "tier": 2,
    "cp": 225,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_SHELL_A_2",
      "ECO2_MAT_SHELL_B_2"
    ],
    "terrain": "plains",
    "family": "SHELL",
    "archetype": "SHELL",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#496645",
      "accent": "#8eb888",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_SHELL_3",
    "nameTh": "เต่าศิลาดำหนามคม",
    "tier": 3,
    "cp": 475,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_SHELL_A_3",
      "ECO2_MAT_SHELL_B_3"
    ],
    "terrain": "mountain",
    "family": "SHELL",
    "archetype": "SHELL",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#474747",
      "accent": "#878787",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_SHELL_4",
    "nameTh": "เต่าเพลิงลาวาใต้ธาร",
    "tier": 4,
    "cp": 1050,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_SHELL_A_4",
      "ECO2_MAT_SHELL_B_4"
    ],
    "terrain": "mountain",
    "family": "SHELL",
    "archetype": "SHELL",
    "element": "FIRE",
    "visual": {
      "body": "#87402d",
      "accent": "#e0765c",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_SHELL_5",
    "nameTh": "พญาเต่ามังกรครามค้ำสมุทร",
    "tier": 5,
    "cp": 2620,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_SHELL_A_5",
      "ECO2_MAT_SHELL_B_5"
    ],
    "terrain": "water",
    "family": "SHELL",
    "archetype": "SHELL",
    "element": "WATER_ICE",
    "visual": {
      "body": "#3b586e",
      "accent": "#78afd6",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_SHELL_6",
    "nameTh": "ราชันย์เต่าปฐพีบรรพกาลห้าทวีป",
    "tier": 6,
    "cp": 7800,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_SHELL_A_6",
      "ECO2_MAT_SHELL_B_6"
    ],
    "terrain": "mountain",
    "family": "SHELL",
    "archetype": "SHELL",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#5c5443",
      "accent": "#bfb095",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_UNGULATE_1",
    "nameTh": "กวางดาวทุ่งสารท",
    "tier": 1,
    "cp": 95,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_UNGULATE_A_1",
      "ECO2_MAT_UNGULATE_B_1"
    ],
    "terrain": "plains",
    "family": "UNGULATE",
    "archetype": "UNGULATE",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#8a6a4d",
      "accent": "#d9b38f",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_UNGULATE_2",
    "nameTh": "แพะผาสูงปราณวายุ",
    "tier": 2,
    "cp": 215,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_UNGULATE_A_2",
      "ECO2_MAT_UNGULATE_B_2"
    ],
    "terrain": "mountain",
    "family": "UNGULATE",
    "archetype": "UNGULATE",
    "element": "WIND",
    "visual": {
      "body": "#7d7a72",
      "accent": "#c2beb4",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_UNGULATE_3",
    "nameTh": "กระทิงศิลาเขาเหล็ก",
    "tier": 3,
    "cp": 470,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_UNGULATE_A_3",
      "ECO2_MAT_UNGULATE_B_3"
    ],
    "terrain": "mountain",
    "family": "UNGULATE",
    "archetype": "UNGULATE",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#575249",
      "accent": "#999081",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_UNGULATE_4",
    "nameTh": "กวางขาวหิมะเก้ามังกร",
    "tier": 4,
    "cp": 1010,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_UNGULATE_A_4",
      "ECO2_MAT_UNGULATE_B_4"
    ],
    "terrain": "mountain",
    "family": "UNGULATE",
    "archetype": "UNGULATE",
    "element": "WATER_ICE",
    "visual": {
      "body": "#9bb0bd",
      "accent": "#f0f7fc",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_UNGULATE_5",
    "nameTh": "พญากระทิงเพลิงพิโรธเก้าอัคคี",
    "tier": 5,
    "cp": 2550,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_UNGULATE_A_5",
      "ECO2_MAT_UNGULATE_B_5"
    ],
    "terrain": "mountain",
    "family": "UNGULATE",
    "archetype": "UNGULATE",
    "element": "FIRE",
    "visual": {
      "body": "#96442b",
      "accent": "#f2815e",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_UNGULATE_6",
    "nameTh": "ราชันย์กวางดาราสวรรค์เก้าภพ",
    "tier": 6,
    "cp": 7100,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_UNGULATE_A_6",
      "ECO2_MAT_UNGULATE_B_6"
    ],
    "terrain": "mountain",
    "family": "UNGULATE",
    "archetype": "UNGULATE",
    "element": "ASTRAL",
    "visual": {
      "body": "#4a5b78",
      "accent": "#a3beeb",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_AQUATIC_1",
    "nameTh": "ปลากระบอกเกล็ดเงินธารา",
    "tier": 1,
    "cp": 95,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_AQUATIC_A_1",
      "ECO2_MAT_AQUATIC_B_1"
    ],
    "terrain": "water",
    "family": "AQUATIC",
    "archetype": "AQUATIC",
    "element": "WATER_ICE",
    "visual": {
      "body": "#718c94",
      "accent": "#c7e2eb",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_AQUATIC_2",
    "nameTh": "ปลาคาร์ปหยกกระโดดมังกร",
    "tier": 2,
    "cp": 210,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_AQUATIC_A_2",
      "ECO2_MAT_AQUATIC_B_2"
    ],
    "terrain": "water",
    "family": "AQUATIC",
    "archetype": "AQUATIC",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#4f7a69",
      "accent": "#95dbbe",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_AQUATIC_3",
    "nameTh": "ชะโดเกราะหนามหนองบึง",
    "tier": 3,
    "cp": 450,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_AQUATIC_A_3",
      "ECO2_MAT_AQUATIC_B_3"
    ],
    "terrain": "water",
    "family": "AQUATIC",
    "archetype": "AQUATIC",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#526154",
      "accent": "#96ad99",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_AQUATIC_4",
    "nameTh": "ฉลามครีบเพลิงทะเลเดือด",
    "tier": 4,
    "cp": 990,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_AQUATIC_A_4",
      "ECO2_MAT_AQUATIC_B_4"
    ],
    "terrain": "water",
    "family": "AQUATIC",
    "archetype": "AQUATIC",
    "element": "FIRE",
    "visual": {
      "body": "#8f4e3c",
      "accent": "#eb8d75",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_AQUATIC_5",
    "nameTh": "วาฬมุกวิญญาณเมฆาคราม",
    "tier": 5,
    "cp": 2500,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_AQUATIC_A_5",
      "ECO2_MAT_AQUATIC_B_5"
    ],
    "terrain": "water",
    "family": "AQUATIC",
    "archetype": "AQUATIC",
    "element": "ASTRAL",
    "visual": {
      "body": "#455f7d",
      "accent": "#9ac4f5",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_AQUATIC_6",
    "nameTh": "มังกรมัจฉาสมุทรดึกดำบรรพ์",
    "tier": 6,
    "cp": 7300,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_AQUATIC_A_6",
      "ECO2_MAT_AQUATIC_B_6"
    ],
    "terrain": "water",
    "family": "AQUATIC",
    "archetype": "AQUATIC",
    "element": "WATER_ICE",
    "visual": {
      "body": "#2e4961",
      "accent": "#68b1e8",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_PLANT_SPIRIT_1",
    "nameTh": "ภูตเห็ดหมอกเรืองแสง",
    "tier": 1,
    "cp": 95,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_PLANT_SPIRIT_A_1",
      "ECO2_MAT_PLANT_SPIRIT_B_1"
    ],
    "terrain": "forest",
    "family": "PLANT_SPIRIT",
    "archetype": "PLANT",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#4d755c",
      "accent": "#9ee0b5",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_PLANT_SPIRIT_2",
    "nameTh": "เถาวัลย์หนามโลหิตดงไผ่",
    "tier": 2,
    "cp": 220,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_PLANT_SPIRIT_A_2",
      "ECO2_MAT_PLANT_SPIRIT_B_2"
    ],
    "terrain": "forest",
    "family": "PLANT_SPIRIT",
    "archetype": "PLANT",
    "element": "BLOOD_DEMON",
    "visual": {
      "body": "#733737",
      "accent": "#c76969",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_PLANT_SPIRIT_3",
    "nameTh": "โสมปีศาจรากพันปี",
    "tier": 3,
    "cp": 460,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_PLANT_SPIRIT_A_3",
      "ECO2_MAT_PLANT_SPIRIT_B_3"
    ],
    "terrain": "forest",
    "family": "PLANT_SPIRIT",
    "archetype": "PLANT",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#6e5e44",
      "accent": "#c2ab84",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_PLANT_SPIRIT_4",
    "nameTh": "บัวเพลิงอัคนีธารลาวา",
    "tier": 4,
    "cp": 1010,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_PLANT_SPIRIT_A_4",
      "ECO2_MAT_PLANT_SPIRIT_B_4"
    ],
    "terrain": "mountain",
    "family": "PLANT_SPIRIT",
    "archetype": "PLANT",
    "element": "FIRE",
    "visual": {
      "body": "#964438",
      "accent": "#f0897a",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_PLANT_SPIRIT_5",
    "nameTh": "พญาพฤกษาหมื่นพิษลวงวิญญาณ",
    "tier": 5,
    "cp": 2550,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_PLANT_SPIRIT_A_5",
      "ECO2_MAT_PLANT_SPIRIT_B_5"
    ],
    "terrain": "forest",
    "family": "PLANT_SPIRIT",
    "archetype": "PLANT",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#3b5443",
      "accent": "#86ba95",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_PLANT_SPIRIT_6",
    "nameTh": "มหาพฤกษาโลกบรรพกาลค้ำสวรรค์",
    "tier": 6,
    "cp": 7600,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_PLANT_SPIRIT_A_6",
      "ECO2_MAT_PLANT_SPIRIT_B_6"
    ],
    "terrain": "forest",
    "family": "PLANT_SPIRIT",
    "archetype": "PLANT",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#473d31",
      "accent": "#b59d80",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_CHIMERA_1",
    "nameTh": "จิ้งจอกวายุติดปีก",
    "tier": 1,
    "cp": 100,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_CHIMERA_A_1",
      "ECO2_MAT_CHIMERA_B_1"
    ],
    "terrain": "forest",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "WIND",
    "visual": {
      "body": "#657e87",
      "accent": "#b0d5e3",
      "mark": "crest",
      "scale": 0.92
    }
  },
  {
    "id": "ECO2_BEAST_CHIMERA_2",
    "nameTh": "เสือโคร่งปีกค้างคาว",
    "tier": 2,
    "cp": 225,
    "flee": 30,
    "aggro": 45,
    "drops": [
      "ECO2_MAT_CHIMERA_A_2",
      "ECO2_MAT_CHIMERA_B_2"
    ],
    "terrain": "forest",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "YIN_SHADOW",
    "visual": {
      "body": "#4d4757",
      "accent": "#9086a1",
      "mark": "crest",
      "scale": 1.04
    }
  },
  {
    "id": "ECO2_BEAST_CHIMERA_3",
    "nameTh": "กิเลนศิลาพิทักษ์ถ้ำ",
    "tier": 3,
    "cp": 475,
    "flee": 30,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_CHIMERA_A_3",
      "ECO2_MAT_CHIMERA_B_3"
    ],
    "terrain": "mountain",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#5c574b",
      "accent": "#a39c89",
      "mark": "crest",
      "scale": 1.1600000000000001
    }
  },
  {
    "id": "ECO2_BEAST_CHIMERA_4",
    "nameTh": "อินทรีหัวพยัคฆ์เหินนภา",
    "tier": 4,
    "cp": 1060,
    "flee": 20,
    "aggro": 65,
    "drops": [
      "ECO2_MAT_CHIMERA_A_4",
      "ECO2_MAT_CHIMERA_B_4"
    ],
    "terrain": "mountain",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "WIND",
    "visual": {
      "body": "#785b41",
      "accent": "#cca583",
      "mark": "crest",
      "scale": 1.28
    }
  },
  {
    "id": "ECO2_BEAST_CHIMERA_5",
    "nameTh": "กิเลนเพลิงม่วงเก้าวัฏจักร",
    "tier": 5,
    "cp": 2650,
    "flee": 20,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_CHIMERA_A_5",
      "ECO2_MAT_CHIMERA_B_5"
    ],
    "terrain": "mountain",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "FIRE",
    "visual": {
      "body": "#6e3869",
      "accent": "#c977c0",
      "mark": "crest",
      "scale": 1.4
    }
  },
  {
    "id": "ECO2_BEAST_CHIMERA_6",
    "nameTh": "อสูรกลืนมิติบารมีอนันต์",
    "tier": 6,
    "cp": 8000,
    "flee": 10,
    "aggro": 85,
    "drops": [
      "ECO2_MAT_CHIMERA_A_6",
      "ECO2_MAT_CHIMERA_B_6"
    ],
    "terrain": "mountain",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "ASTRAL",
    "visual": {
      "body": "#352d47",
      "accent": "#7c68ad",
      "mark": "crest",
      "scale": 1.52
    }
  },
  {
    "id": "ECO2_BEAST_MYTHIC_1",
    "nameTh": "ราชันย์มังกรทองเก้าสุริยัน",
    "tier": 7,
    "cp": 24500,
    "flee": 5,
    "aggro": 95,
    "drops": [
      "ECO2_MAT_MYTHIC_SCALE_1",
      "ECO2_MAT_MYTHIC_HEART_1"
    ],
    "terrain": "mountain",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "LIGHT_YANG",
    "visual": {
      "body": "#b89228",
      "accent": "#fae36b",
      "mark": "crown",
      "scale": 1.8
    }
  },
  {
    "id": "ECO2_BEAST_MYTHIC_2",
    "nameTh": "หงส์เพลิงสวรรค์เก้าชีวา",
    "tier": 7,
    "cp": 22000,
    "flee": 5,
    "aggro": 95,
    "drops": [
      "ECO2_MAT_MYTHIC_FEATHER_2",
      "ECO2_MAT_MYTHIC_PEARL_2"
    ],
    "terrain": "mountain",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "FIRE",
    "visual": {
      "body": "#ba3c25",
      "accent": "#ffaa54",
      "mark": "crown",
      "scale": 1.8
    }
  },
  {
    "id": "ECO2_BEAST_MYTHIC_3",
    "nameTh": "เต่าดำเสวียนอู่ค้ำจักรวาล",
    "tier": 7,
    "cp": 24000,
    "flee": 5,
    "aggro": 95,
    "drops": [
      "ECO2_MAT_MYTHIC_SHELL_3",
      "ECO2_MAT_MYTHIC_CORE_3"
    ],
    "terrain": "water",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "WATER_ICE",
    "visual": {
      "body": "#263b4a",
      "accent": "#649dbd",
      "mark": "crown",
      "scale": 1.8
    }
  },
  {
    "id": "ECO2_BEAST_MYTHIC_4",
    "nameTh": "พยัคฆ์ขาวไป๋หู่พิฆาตดารา",
    "tier": 7,
    "cp": 23500,
    "flee": 5,
    "aggro": 95,
    "drops": [
      "ECO2_MAT_MYTHIC_FANG_4",
      "ECO2_MAT_MYTHIC_PELT_4"
    ],
    "terrain": "mountain",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "EARTH_METAL",
    "visual": {
      "body": "#8fa5b8",
      "accent": "#eef5fa",
      "mark": "crown",
      "scale": 1.8
    }
  },
  {
    "id": "ECO2_BEAST_MYTHIC_5",
    "nameTh": "กิเลนทองคำจักรพรรดิฟ้า",
    "tier": 7,
    "cp": 23000,
    "flee": 5,
    "aggro": 95,
    "drops": [
      "ECO2_MAT_MYTHIC_HORN_5",
      "ECO2_MAT_MYTHIC_CRYSTAL_5"
    ],
    "terrain": "forest",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "LIGHT_YANG",
    "visual": {
      "body": "#ad8728",
      "accent": "#fade64",
      "mark": "crown",
      "scale": 1.8
    }
  },
  {
    "id": "ECO2_BEAST_MYTHIC_6",
    "nameTh": "ปลาวาฬคุนเผิงกลืนดวงดารา",
    "tier": 7,
    "cp": 24500,
    "flee": 5,
    "aggro": 95,
    "drops": [
      "ECO2_MAT_MYTHIC_WING_6",
      "ECO2_MAT_MYTHIC_OCEAN_6"
    ],
    "terrain": "water",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "ASTRAL",
    "visual": {
      "body": "#334466",
      "accent": "#88a3db",
      "mark": "crown",
      "scale": 1.8
    }
  },
  {
    "id": "ECO2_BEAST_MYTHIC_7",
    "nameTh": "อสูรเทาเที่ยกลืนหมื่นวิญญาณ",
    "tier": 7,
    "cp": 25000,
    "flee": 5,
    "aggro": 95,
    "drops": [
      "ECO2_MAT_MYTHIC_HORN_7",
      "ECO2_MAT_MYTHIC_STOMACH_7"
    ],
    "terrain": "desert",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "YIN_SHADOW",
    "visual": {
      "body": "#3b2f42",
      "accent": "#866b96",
      "mark": "crown",
      "scale": 1.8
    }
  },
  {
    "id": "ECO2_BEAST_MYTHIC_8",
    "nameTh": "พญาพฤกษาโพธิ์สวรรค์หมื่นวัฏจักร",
    "tier": 7,
    "cp": 24000,
    "flee": 5,
    "aggro": 95,
    "drops": [
      "ECO2_MAT_MYTHIC_ROOT_8",
      "ECO2_MAT_MYTHIC_FRUIT_8"
    ],
    "terrain": "forest",
    "family": "CHIMERA",
    "archetype": "CHIMERA",
    "element": "WOOD_LIFE",
    "visual": {
      "body": "#45382b",
      "accent": "#b0946d",
      "mark": "crown",
      "scale": 1.8
    }
  }
];
  const materials = [
  {
    "id": "ECO2_MAT_CANINE_A_1",
    "nameTh": "เขี้ยวหมาป่าหมอกคราม",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 13,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_1"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_B_1",
    "nameTh": "หนังหมาป่าหมอกคราม",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 9,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_1"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_A_2",
    "nameTh": "เขี้ยวหมาป่าเงาจันทร์",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 32,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_2"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_B_2",
    "nameTh": "หนังหมาป่าเงาจันทร์",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 24,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_2"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_A_3",
    "nameTh": "เขี้ยวสุนัขป่าลมกรดทักษิณ",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 71,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_3"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_B_3",
    "nameTh": "หนังสุนัขป่าลมกรดทักษิณ",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 59,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_3"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_A_4",
    "nameTh": "เขี้ยวหมาป่าโลหิตกระหายศึก",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_4"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_B_4",
    "nameTh": "หนังหมาป่าโลหิตกระหายศึก",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_4"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_A_5",
    "nameTh": "เขี้ยวจิ้งจอกเงินเก้าหางค้ำดึก",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 355,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_5"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_B_5",
    "nameTh": "หนังจิ้งจอกเงินเก้าหางค้ำดึก",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 335,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_5"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_A_6",
    "nameTh": "เขี้ยวราชันย์หมาป่ากลืนตะวัน",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_6"
    ]
  },
  {
    "id": "ECO2_MAT_CANINE_B_6",
    "nameTh": "หนังราชันย์หมาป่ากลืนตะวัน",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "CANINE",
    "sourceBeastIds": [
      "ECO2_BEAST_CANINE_6"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_A_1",
    "nameTh": "กรงเล็บแมวป่าลายเสือหินผา",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 13,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_1"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_B_1",
    "nameTh": "โลหิตแมวป่าลายเสือหินผา",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 9,
    "anatomy": "BLOOD",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_1"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_A_2",
    "nameTh": "กรงเล็บเสือดาววายุไพร",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 32,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_2"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_B_2",
    "nameTh": "โลหิตเสือดาววายุไพร",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 24,
    "anatomy": "BLOOD",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_2"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_A_3",
    "nameTh": "กรงเล็บพยัคฆ์เขี้ยวดาบเกราะศิลา",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 71,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_3"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_B_3",
    "nameTh": "โลหิตพยัคฆ์เขี้ยวดาบเกราะศิลา",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 59,
    "anatomy": "BLOOD",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_3"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_A_4",
    "nameTh": "กรงเล็บเสือดาวเพลิงอสูร",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "desert",
    "value": 157,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_4"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_B_4",
    "nameTh": "โลหิตเสือดาวเพลิงอสูร",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ALCHEMY",
    "terrain": "desert",
    "value": 141,
    "anatomy": "BLOOD",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_4"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_A_5",
    "nameTh": "กรงเล็บพยัคฆ์ขาวเหมันต์ทะลวงเมฆ",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 355,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_5"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_B_5",
    "nameTh": "โลหิตพยัคฆ์ขาวเหมันต์ทะลวงเมฆ",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 335,
    "anatomy": "BLOOD",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_5"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_A_6",
    "nameTh": "กรงเล็บพยัคฆ์สายฟ้าทมิฬเก้าสวรรค์",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_6"
    ]
  },
  {
    "id": "ECO2_MAT_FELINE_B_6",
    "nameTh": "โลหิตพยัคฆ์สายฟ้าทมิฬเก้าสวรรค์",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "BLOOD",
    "relic": false,
    "family": "FELINE",
    "sourceBeastIds": [
      "ECO2_BEAST_FELINE_6"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_A_1",
    "nameTh": "กระดูกหมีดำดงไผ่",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 13,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_1"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_B_1",
    "nameTh": "ถุงน้ำดีหมีดำดงไผ่",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 9,
    "anatomy": "HEART_GALL",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_1"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_A_2",
    "nameTh": "กระดูกหมีหินผาทะลวงหุบเขา",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 32,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_2"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_B_2",
    "nameTh": "ถุงน้ำดีหมีหินผาทะลวงหุบเขา",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 24,
    "anatomy": "HEART_GALL",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_2"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_A_3",
    "nameTh": "กระดูกหมีเพลิงพิโรธถ้ำลาวา",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 71,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_3"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_B_3",
    "nameTh": "ถุงน้ำดีหมีเพลิงพิโรธถ้ำลาวา",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 59,
    "anatomy": "HEART_GALL",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_3"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_A_4",
    "nameTh": "กระดูกหมีเกราะเหล็กไหลหลังทอง",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_4"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_B_4",
    "nameTh": "ถุงน้ำดีหมีเกราะเหล็กไหลหลังทอง",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "HEART_GALL",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_4"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_A_5",
    "nameTh": "กระดูกหมีพายุหิมะโบราณ",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 355,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_5"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_B_5",
    "nameTh": "ถุงน้ำดีหมีพายุหิมะโบราณ",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 335,
    "anatomy": "HEART_GALL",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_5"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_A_6",
    "nameTh": "กระดูกราชันย์หมีปฐพีสะเทือนฟ้า",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_6"
    ]
  },
  {
    "id": "ECO2_MAT_URSINE_B_6",
    "nameTh": "ถุงน้ำดีราชันย์หมีปฐพีสะเทือนฟ้า",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "HEART_GALL",
    "relic": false,
    "family": "URSINE",
    "sourceBeastIds": [
      "ECO2_BEAST_URSINE_6"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_A_1",
    "nameTh": "งาหมูป่าเขี้ยวสั้นหน้าผา",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 13,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_1"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_B_1",
    "nameTh": "หนังหนาหมูป่าเขี้ยวสั้นหน้าผา",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 9,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_1"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_A_2",
    "nameTh": "งาหมูป่าเกราะหนามโลหะ",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 32,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_2"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_B_2",
    "nameTh": "หนังหนาหมูป่าเกราะหนามโลหะ",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 24,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_2"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_A_3",
    "nameTh": "งาหมูป่าดินโป่งปราณคราม",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 71,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_3"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_B_3",
    "nameTh": "หนังหนาหมูป่าดินโป่งปราณคราม",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 59,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_3"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_A_4",
    "nameTh": "งาหมูป่าเขาศิลาอัคนี",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_4"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_B_4",
    "nameTh": "หนังหนาหมูป่าเขาศิลาอัคนี",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_4"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_A_5",
    "nameTh": "งาหมูป่าเกราะเพชรโบราณ",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 355,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_5"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_B_5",
    "nameTh": "หนังหนาหมูป่าเกราะเพชรโบราณ",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 335,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_5"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_A_6",
    "nameTh": "งาพญาหมูป่าเก้าภูผาทลายทวีป",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_6"
    ]
  },
  {
    "id": "ECO2_MAT_BOAR_B_6",
    "nameTh": "หนังหนาพญาหมูป่าเก้าภูผาทลายทวีป",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "HIDE_PELT",
    "relic": false,
    "family": "BOAR",
    "sourceBeastIds": [
      "ECO2_BEAST_BOAR_6"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_A_1",
    "nameTh": "ต่อมพิษงูดงไผ่เขียวมรกต",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 13,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_1"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_B_1",
    "nameTh": "เกล็ดงูดงไผ่เขียวมรกต",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 9,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_1"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_A_2",
    "nameTh": "ต่อมพิษงูพิษทรายแดง",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ALCHEMY",
    "terrain": "desert",
    "value": 32,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_2"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_B_2",
    "nameTh": "เกล็ดงูพิษทรายแดง",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "desert",
    "value": 24,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_2"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_A_3",
    "nameTh": "ต่อมพิษเหลือมศิลาหุบเขาลึก",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 71,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_3"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_B_3",
    "nameTh": "เกล็ดเหลือมศิลาหุบเขาลึก",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 59,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_3"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_A_4",
    "nameTh": "ต่อมพิษงูเห่าหมอกเหมันต์",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_4"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_B_4",
    "nameTh": "เกล็ดงูเห่าหมอกเหมันต์",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_4"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_A_5",
    "nameTh": "ต่อมพิษพญางูเหลือมเพลิงเก้าชีพจร",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 355,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_5"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_B_5",
    "nameTh": "เกล็ดพญางูเหลือมเพลิงเก้าชีพจร",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 335,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_5"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_A_6",
    "nameTh": "ต่อมพิษราชันย์อสรพิษดำใต้พิภพบรรพกาล",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_6"
    ]
  },
  {
    "id": "ECO2_MAT_SERPENT_B_6",
    "nameTh": "เกล็ดราชันย์อสรพิษดำใต้พิภพบรรพกาล",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SERPENT",
    "sourceBeastIds": [
      "ECO2_BEAST_SERPENT_6"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_A_1",
    "nameTh": "ขนปีกเหยี่ยวลมกรดทุ่งหญ้า",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "TALISMAN",
    "terrain": "plains",
    "value": 13,
    "anatomy": "SPIRIT_HAIR_FEATHER",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_1"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_B_1",
    "nameTh": "กรงเล็บเหยี่ยวลมกรดทุ่งหญ้า",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 9,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_1"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_A_2",
    "nameTh": "ขนปีกนกกระเรียนหยกธารน้ำ",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "TALISMAN",
    "terrain": "forest",
    "value": 32,
    "anatomy": "SPIRIT_HAIR_FEATHER",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_2"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_B_2",
    "nameTh": "กรงเล็บนกกระเรียนหยกธารน้ำ",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 24,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_2"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_A_3",
    "nameTh": "ขนปีกอินทรีศิลาหน้าผาสูง",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "TALISMAN",
    "terrain": "mountain",
    "value": 71,
    "anatomy": "SPIRIT_HAIR_FEATHER",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_3"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_B_3",
    "nameTh": "กรงเล็บอินทรีศิลาหน้าผาสูง",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 59,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_3"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_A_4",
    "nameTh": "ขนปีกเหยี่ยวเพลิงเมฆาสารท",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "TALISMAN",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "SPIRIT_HAIR_FEATHER",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_4"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_B_4",
    "nameTh": "กรงเล็บเหยี่ยวเพลิงเมฆาสารท",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_4"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_A_5",
    "nameTh": "ขนปีกพญาอินทรีวายุสายฟ้า",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "TALISMAN",
    "terrain": "mountain",
    "value": 355,
    "anatomy": "SPIRIT_HAIR_FEATHER",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_5"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_B_5",
    "nameTh": "กรงเล็บพญาอินทรีวายุสายฟ้า",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 335,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_5"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_A_6",
    "nameTh": "ขนปีกราชันย์วิหคเพลิงอมฤตเก้าภพ",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "TALISMAN",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "SPIRIT_HAIR_FEATHER",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_6"
    ]
  },
  {
    "id": "ECO2_MAT_AVIAN_B_6",
    "nameTh": "กรงเล็บราชันย์วิหคเพลิงอมฤตเก้าภพ",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "FANG_CLAW",
    "relic": false,
    "family": "AVIAN",
    "sourceBeastIds": [
      "ECO2_BEAST_AVIAN_6"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_A_1",
    "nameTh": "เหล็กในตั๊กแตนใบไม้คมกริบ",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 13,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_1"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_B_1",
    "nameTh": "กระดองตั๊กแตนใบไม้คมกริบ",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 9,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_1"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_A_2",
    "nameTh": "เหล็กในตะขาบแดงร้อยขา",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 32,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_2"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_B_2",
    "nameTh": "กระดองตะขาบแดงร้อยขา",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 24,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_2"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_A_3",
    "nameTh": "เหล็กในด้วงเกราะเหล็กดำดิน",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 71,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_3"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_B_3",
    "nameTh": "กระดองด้วงเกราะเหล็กดำดิน",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 59,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_3"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_A_4",
    "nameTh": "เหล็กในแมงมุมพิษเร้นเงารัตติกาล",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 157,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_4"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_B_4",
    "nameTh": "กระดองแมงมุมพิษเร้นเงารัตติกาล",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 141,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_4"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_A_5",
    "nameTh": "เหล็กในพญาแมงป่องผลึกอสนีบาต",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "desert",
    "value": 355,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_5"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_B_5",
    "nameTh": "กระดองพญาแมงป่องผลึกอสนีบาต",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "desert",
    "value": 335,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_5"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_A_6",
    "nameTh": "เหล็กในจักรพรรดิแมลงทองคำกลืนปราณ",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "desert",
    "value": 818,
    "anatomy": "VENOM_GLAND",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_6"
    ]
  },
  {
    "id": "ECO2_MAT_ARTHROPOD_B_6",
    "nameTh": "กระดองจักรพรรดิแมลงทองคำกลืนปราณ",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "desert",
    "value": 794,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "ARTHROPOD",
    "sourceBeastIds": [
      "ECO2_BEAST_ARTHROPOD_6"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_A_1",
    "nameTh": "กระดองตะพาบน้ำลำธารหิน",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "water",
    "value": 13,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_1"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_B_1",
    "nameTh": "แก่นศิลาตะพาบน้ำลำธารหิน",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 9,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_1"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_A_2",
    "nameTh": "กระดองเต่าหญ้าเขียวร้อยปี",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 32,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_2"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_B_2",
    "nameTh": "แก่นศิลาเต่าหญ้าเขียวร้อยปี",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ARRAY",
    "terrain": "plains",
    "value": 24,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_2"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_A_3",
    "nameTh": "กระดองเต่าศิลาดำหนามคม",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 71,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_3"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_B_3",
    "nameTh": "แก่นศิลาเต่าศิลาดำหนามคม",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ARRAY",
    "terrain": "mountain",
    "value": 59,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_3"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_A_4",
    "nameTh": "กระดองเต่าเพลิงลาวาใต้ธาร",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_4"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_B_4",
    "nameTh": "แก่นศิลาเต่าเพลิงลาวาใต้ธาร",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ARRAY",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_4"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_A_5",
    "nameTh": "กระดองพญาเต่ามังกรครามค้ำสมุทร",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "water",
    "value": 355,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_5"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_B_5",
    "nameTh": "แก่นศิลาพญาเต่ามังกรครามค้ำสมุทร",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 335,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_5"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_A_6",
    "nameTh": "กระดองราชันย์เต่าปฐพีบรรพกาลห้าทวีป",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_6"
    ]
  },
  {
    "id": "ECO2_MAT_SHELL_B_6",
    "nameTh": "แก่นศิลาราชันย์เต่าปฐพีบรรพกาลห้าทวีป",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ARRAY",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "SHELL",
    "sourceBeastIds": [
      "ECO2_BEAST_SHELL_6"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_A_1",
    "nameTh": "เขากวางดาวทุ่งสารท",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "plains",
    "value": 13,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_1"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_B_1",
    "nameTh": "เอ็นแก่นกวางดาวทุ่งสารท",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ALCHEMY",
    "terrain": "plains",
    "value": 9,
    "anatomy": "TENDON_TAIL",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_1"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_A_2",
    "nameTh": "เขาแพะผาสูงปราณวายุ",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 32,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_2"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_B_2",
    "nameTh": "เอ็นแก่นแพะผาสูงปราณวายุ",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 24,
    "anatomy": "TENDON_TAIL",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_2"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_A_3",
    "nameTh": "เขากระทิงศิลาเขาเหล็ก",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 71,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_3"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_B_3",
    "nameTh": "เอ็นแก่นกระทิงศิลาเขาเหล็ก",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 59,
    "anatomy": "TENDON_TAIL",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_3"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_A_4",
    "nameTh": "เขากวางขาวหิมะเก้ามังกร",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_4"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_B_4",
    "nameTh": "เอ็นแก่นกวางขาวหิมะเก้ามังกร",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "TENDON_TAIL",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_4"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_A_5",
    "nameTh": "เขาพญากระทิงเพลิงพิโรธเก้าอัคคี",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 355,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_5"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_B_5",
    "nameTh": "เอ็นแก่นพญากระทิงเพลิงพิโรธเก้าอัคคี",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 335,
    "anatomy": "TENDON_TAIL",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_5"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_A_6",
    "nameTh": "เขาราชันย์กวางดาราสวรรค์เก้าภพ",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_6"
    ]
  },
  {
    "id": "ECO2_MAT_UNGULATE_B_6",
    "nameTh": "เอ็นแก่นราชันย์กวางดาราสวรรค์เก้าภพ",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "TENDON_TAIL",
    "relic": false,
    "family": "UNGULATE",
    "sourceBeastIds": [
      "ECO2_BEAST_UNGULATE_6"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_A_1",
    "nameTh": "เกล็ดครีบปลากระบอกเกล็ดเงินธารา",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "water",
    "value": 13,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_1"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_B_1",
    "nameTh": "ไข่มุกปลากระบอกเกล็ดเงินธารา",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 9,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_1"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_A_2",
    "nameTh": "เกล็ดครีบปลาคาร์ปหยกกระโดดมังกร",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "water",
    "value": 32,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_2"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_B_2",
    "nameTh": "ไข่มุกปลาคาร์ปหยกกระโดดมังกร",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 24,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_2"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_A_3",
    "nameTh": "เกล็ดครีบชะโดเกราะหนามหนองบึง",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "water",
    "value": 71,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_3"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_B_3",
    "nameTh": "ไข่มุกชะโดเกราะหนามหนองบึง",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 59,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_3"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_A_4",
    "nameTh": "เกล็ดครีบฉลามครีบเพลิงทะเลเดือด",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "water",
    "value": 157,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_4"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_B_4",
    "nameTh": "ไข่มุกฉลามครีบเพลิงทะเลเดือด",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 141,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_4"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_A_5",
    "nameTh": "เกล็ดครีบวาฬมุกวิญญาณเมฆาคราม",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "water",
    "value": 355,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_5"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_B_5",
    "nameTh": "ไข่มุกวาฬมุกวิญญาณเมฆาคราม",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 335,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_5"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_A_6",
    "nameTh": "เกล็ดครีบมังกรมัจฉาสมุทรดึกดำบรรพ์",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "water",
    "value": 818,
    "anatomy": "SCALE_CARAPACE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_6"
    ]
  },
  {
    "id": "ECO2_MAT_AQUATIC_B_6",
    "nameTh": "ไข่มุกมังกรมัจฉาสมุทรดึกดำบรรพ์",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 794,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "AQUATIC",
    "sourceBeastIds": [
      "ECO2_BEAST_AQUATIC_6"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_A_1",
    "nameTh": "สปอร์ยางไม้ภูตเห็ดหมอกเรืองแสง",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 13,
    "anatomy": "MEAT_EGG_MUSK",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_1"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_B_1",
    "nameTh": "แก่นรากภูตเห็ดหมอกเรืองแสง",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 9,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_1"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_A_2",
    "nameTh": "สปอร์ยางไม้เถาวัลย์หนามโลหิตดงไผ่",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 32,
    "anatomy": "MEAT_EGG_MUSK",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_2"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_B_2",
    "nameTh": "แก่นรากเถาวัลย์หนามโลหิตดงไผ่",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 24,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_2"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_A_3",
    "nameTh": "สปอร์ยางไม้โสมปีศาจรากพันปี",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 71,
    "anatomy": "MEAT_EGG_MUSK",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_3"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_B_3",
    "nameTh": "แก่นรากโสมปีศาจรากพันปี",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 59,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_3"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_A_4",
    "nameTh": "สปอร์ยางไม้บัวเพลิงอัคนีธารลาวา",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "MEAT_EGG_MUSK",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_4"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_B_4",
    "nameTh": "แก่นรากบัวเพลิงอัคนีธารลาวา",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_4"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_A_5",
    "nameTh": "สปอร์ยางไม้พญาพฤกษาหมื่นพิษลวงวิญญาณ",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 355,
    "anatomy": "MEAT_EGG_MUSK",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_5"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_B_5",
    "nameTh": "แก่นรากพญาพฤกษาหมื่นพิษลวงวิญญาณ",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 335,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_5"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_A_6",
    "nameTh": "สปอร์ยางไม้มหาพฤกษาโลกบรรพกาลค้ำสวรรค์",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 818,
    "anatomy": "MEAT_EGG_MUSK",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_6"
    ]
  },
  {
    "id": "ECO2_MAT_PLANT_SPIRIT_B_6",
    "nameTh": "แก่นรากมหาพฤกษาโลกบรรพกาลค้ำสวรรค์",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 794,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "PLANT_SPIRIT",
    "sourceBeastIds": [
      "ECO2_BEAST_PLANT_SPIRIT_6"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_A_1",
    "nameTh": "เขาอสูรจิ้งจอกวายุติดปีก",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 13,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_1"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_B_1",
    "nameTh": "ผลึกแก่นจิ้งจอกวายุติดปีก",
    "category": "BEAST_PART",
    "tier": 1,
    "craft": "ARRAY",
    "terrain": "forest",
    "value": 9,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_1"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_A_2",
    "nameTh": "เขาอสูรเสือโคร่งปีกค้างคาว",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 32,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_2"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_B_2",
    "nameTh": "ผลึกแก่นเสือโคร่งปีกค้างคาว",
    "category": "BEAST_PART",
    "tier": 2,
    "craft": "ARRAY",
    "terrain": "forest",
    "value": 24,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_2"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_A_3",
    "nameTh": "เขาอสูรกิเลนศิลาพิทักษ์ถ้ำ",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 71,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_3"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_B_3",
    "nameTh": "ผลึกแก่นกิเลนศิลาพิทักษ์ถ้ำ",
    "category": "BEAST_PART",
    "tier": 3,
    "craft": "ARRAY",
    "terrain": "mountain",
    "value": 59,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_3"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_A_4",
    "nameTh": "เขาอสูรอินทรีหัวพยัคฆ์เหินนภา",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 157,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_4"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_B_4",
    "nameTh": "ผลึกแก่นอินทรีหัวพยัคฆ์เหินนภา",
    "category": "BEAST_PART",
    "tier": 4,
    "craft": "ARRAY",
    "terrain": "mountain",
    "value": 141,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_4"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_A_5",
    "nameTh": "เขาอสูรกิเลนเพลิงม่วงเก้าวัฏจักร",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 355,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_5"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_B_5",
    "nameTh": "ผลึกแก่นกิเลนเพลิงม่วงเก้าวัฏจักร",
    "category": "BEAST_PART",
    "tier": 5,
    "craft": "ARRAY",
    "terrain": "mountain",
    "value": 335,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_5"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_A_6",
    "nameTh": "เขาอสูรอสูรกลืนมิติบารมีอนันต์",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 818,
    "anatomy": "BONE_HORN",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_6"
    ]
  },
  {
    "id": "ECO2_MAT_CHIMERA_B_6",
    "nameTh": "ผลึกแก่นอสูรกลืนมิติบารมีอนันต์",
    "category": "BEAST_PART",
    "tier": 6,
    "craft": "ARRAY",
    "terrain": "mountain",
    "value": 794,
    "anatomy": "BEAST_CORE",
    "relic": false,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_CHIMERA_6"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_SCALE_1",
    "nameTh": "เกล็ดมังกรทองเก้าสุริยัน",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 2200,
    "anatomy": "SCALE_CARAPACE",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_1"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_HEART_1",
    "nameTh": "หัวใจมังกรสุริยะบรรพกาล",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "ALCHEMY",
    "terrain": "mountain",
    "value": 2350,
    "anatomy": "HEART_GALL",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_1"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_FEATHER_2",
    "nameTh": "ขนหางหงส์เพลิงเก้าชีวา",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "TALISMAN",
    "terrain": "mountain",
    "value": 2150,
    "anatomy": "SPIRIT_HAIR_FEATHER",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_2"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_PEARL_2",
    "nameTh": "มุกหยาดน้ำตาหงสาอมตะ",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "ARRAY",
    "terrain": "mountain",
    "value": 2300,
    "anatomy": "BEAST_CORE",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_2"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_SHELL_3",
    "nameTh": "กระดองเสวียนอู่ค้ำฟ้า",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "FORGING",
    "terrain": "water",
    "value": 2250,
    "anatomy": "SCALE_CARAPACE",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_3"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_CORE_3",
    "nameTh": "ศิลากำเนิดธาตุน้ำบรรพกาล",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 2400,
    "anatomy": "BEAST_CORE",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_3"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_FANG_4",
    "nameTh": "เขี้ยวไป๋หู่พิฆาตดารา",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 2200,
    "anatomy": "FANG_CLAW",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_4"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_PELT_4",
    "nameTh": "หนังพยัคฆ์ขาวเจ็ดดาวเหนือ",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "FORGING",
    "terrain": "mountain",
    "value": 2100,
    "anatomy": "HIDE_PELT",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_4"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_HORN_5",
    "nameTh": "มหาเขากิเลนจักรพรรดิฟ้า",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "FORGING",
    "terrain": "forest",
    "value": 2250,
    "anatomy": "BONE_HORN",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_5"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_CRYSTAL_5",
    "nameTh": "ผลึกบุญญาบารมีสวรรค์",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "ARRAY",
    "terrain": "forest",
    "value": 2350,
    "anatomy": "BEAST_CORE",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_5"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_WING_6",
    "nameTh": "ขนปีกคุนเผิงข้ามสมุทร",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "TALISMAN",
    "terrain": "water",
    "value": 2280,
    "anatomy": "SPIRIT_HAIR_FEATHER",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_6"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_OCEAN_6",
    "nameTh": "แก่นมหาสมุทรดารากลืนภพ",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "ARRAY",
    "terrain": "water",
    "value": 2450,
    "anatomy": "BEAST_CORE",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_6"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_HORN_7",
    "nameTh": "เขาคู่เทาเที่ยกลืนวิญญาณ",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "FORGING",
    "terrain": "desert",
    "value": 2300,
    "anatomy": "BONE_HORN",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_7"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_STOMACH_7",
    "nameTh": "กระเพาะมิติกลืนหมื่นภพ",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "FORGING",
    "terrain": "desert",
    "value": 2500,
    "anatomy": "MEAT_EGG_MUSK",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_7"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_ROOT_8",
    "nameTh": "แก่นรากโพธิ์สวรรค์",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 2350,
    "anatomy": "BONE_HORN",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_8"
    ]
  },
  {
    "id": "ECO2_MAT_MYTHIC_FRUIT_8",
    "nameTh": "ผลโพธิ์ตรัสรู้หมื่นวัฏจักร",
    "category": "BEAST_PART",
    "tier": 7,
    "craft": "ALCHEMY",
    "terrain": "forest",
    "value": 2600,
    "anatomy": "MEAT_EGG_MUSK",
    "relic": true,
    "family": "CHIMERA",
    "sourceBeastIds": [
      "ECO2_BEAST_MYTHIC_8"
    ]
  }
];
  const recipes = [
  {
    "id": "ECO2_REC_PILL_HEAL_1",
    "nameTh": "ตำรับโอสถสมานแผลดงไผ่",
    "craft": "ALCHEMY",
    "tier": 1,
    "minMastery": 12,
    "days": 5,
    "inputs": [
      {
        "matId": "ECO2_MAT_SERPENT_A_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CANINE_B_1",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DEW_GRASS_1",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถสมานแผลดงไผ่",
    "effect": {
      "healHealth": 15,
      "healInjury": 10,
      "toxicity": 1
    },
    "descTh": "ใช้พิษงูไผ่สกัดร่วมหญ้าน้ำค้าง สมานแผลภายนอกอย่างรวดเร็ว",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_PURGE_1",
    "nameTh": "ตำรับโอสถชะล้างพิษสปอร์",
    "craft": "ALCHEMY",
    "tier": 1,
    "minMastery": 14,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_A_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_ARTHROPOD_B_1",
        "count": 2
      },
      {
        "matId": "MAT_HERB_CINDER_LEAF_1",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถชะล้างพิษสปอร์",
    "effect": {
      "clearPoison": 20,
      "clearToxic": 15,
      "toxicity": 1
    },
    "descTh": "สกัดจากสปอร์เห็ดหมอก ขับพิษตกค้างออกจากชีพจร",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_ENERGY_1",
    "nameTh": "ตำรับโอสถฟื้นกำลังกวางดาว",
    "craft": "ALCHEMY",
    "tier": 1,
    "minMastery": 10,
    "days": 5,
    "inputs": [
      {
        "matId": "ECO2_MAT_UNGULATE_B_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_B_1",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DEW_GRASS_1",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถฟื้นกำลังกวางดาว",
    "effect": {
      "energyRestore": 30,
      "healHealth": 8,
      "toxicity": 1
    },
    "descTh": "บำรุงกล้ามเนื้อ คืนความกระปรี้กระเปร่า",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_BUFF_ATK_1",
    "nameTh": "ตำรับโอสถเขี้ยวหมอกฮึกเหิม",
    "craft": "ALCHEMY",
    "tier": 1,
    "minMastery": 15,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_CANINE_A_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_FELINE_A_1",
        "count": 2
      },
      {
        "matId": "MAT_HERB_CINDER_LEAF_1",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเขี้ยวหมอกฮึกเหิม",
    "effect": {
      "cbBuff": {
        "name": "เขี้ยวหมอกฮึกเหิม",
        "dur": 120,
        "p": {
          "atk": 0.12
        },
        "f": {
          "acc": 8
        }
      },
      "toxicity": 2
    },
    "descTh": "เพิ่มพลังโจมตีกายภาพและความแม่นยำยามปะทะศัตรู",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_BUFF_DEF_1",
    "nameTh": "ตำรับโอสถเกราะตะพาบธารา",
    "craft": "ALCHEMY",
    "tier": 1,
    "minMastery": 15,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_SHELL_A_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_URSINE_A_1",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DEW_GRASS_1",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเกราะตะพาบธารา",
    "effect": {
      "cbBuff": {
        "name": "เกราะตะพาบธารา",
        "dur": 120,
        "p": {
          "def": 0.14
        },
        "f": {}
      },
      "toxicity": 2
    },
    "descTh": "เสริมความทนทานของผิวหนัง ป้องกันแรงกระแทก",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_BUFF_SPEED_1",
    "nameTh": "ตำรับโอสถปีกจิ้งจอกวายุ",
    "craft": "ALCHEMY",
    "tier": 1,
    "minMastery": 16,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_CHIMERA_A_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AVIAN_A_1",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DEW_GRASS_1",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถปีกจิ้งจอกวายุ",
    "effect": {
      "cbBuff": {
        "name": "ปีกจิ้งจอกวายุ",
        "dur": 120,
        "p": {
          "move": 0.12,
          "eva": 0.08
        },
        "f": {}
      },
      "toxicity": 2
    },
    "descTh": "เพิ่มความคล่องตัวในการหลบหลีกและเคลื่อนที่",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_CULT_QI_1",
    "nameTh": "ตำรับโอสถรวบรวมปราณวารี",
    "craft": "ALCHEMY",
    "tier": 1,
    "minMastery": 15,
    "days": 8,
    "inputs": [
      {
        "matId": "ECO2_MAT_AQUATIC_B_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_B_1",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DEW_GRASS_1",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถรวบรวมปราณวารี",
    "effect": {
      "cultivationProgress": 14,
      "toxicity": 2
    },
    "descTh": "ช่วยกักเก็บปราณฟ้าดิน เร่งการบำเพ็ญในขั้นต้น",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_MIND_CALM_1",
    "nameTh": "ตำรับโอสถสงบจิตใบไม้คราม",
    "craft": "ALCHEMY",
    "tier": 1,
    "minMastery": 14,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_ARTHROPOD_A_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SHELL_B_1",
        "count": 2
      },
      {
        "matId": "MAT_HERB_CINDER_LEAF_1",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถสงบจิตใบไม้คราม",
    "effect": {
      "clearHeartDemon": 16,
      "toxicity": 1
    },
    "descTh": "ดับอารมณ์พลุ่งพล่าน ลดการก่อตัวของจิตมาร",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_HEAL_2",
    "nameTh": "ตำรับโอสถชะล้างชีพจรกระเรียนหยก",
    "craft": "ALCHEMY",
    "tier": 2,
    "minMastery": 26,
    "days": 10,
    "inputs": [
      {
        "matId": "ECO2_MAT_AVIAN_A_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CANINE_B_2",
        "count": 2
      },
      {
        "matId": "MAT_HERB_JADE_LOTUS_2",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถชะล้างชีพจรกระเรียนหยก",
    "effect": {
      "healHealth": 28,
      "healInjury": 24,
      "toxicity": 2
    },
    "descTh": "สมานแผลลึกในเส้นลมปราณด้วยพลังบริสุทธิ์ของวิหคธารา",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_PURGE_2",
    "nameTh": "ตำรับโอสถถอนพิษทรายแดง",
    "craft": "ALCHEMY",
    "tier": 2,
    "minMastery": 28,
    "days": 10,
    "inputs": [
      {
        "matId": "ECO2_MAT_SERPENT_A_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_ARTHROPOD_A_2",
        "count": 2
      },
      {
        "matId": "MAT_HERB_MIST_ORCHID_2",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถถอนพิษทรายแดง",
    "effect": {
      "clearPoison": 40,
      "clearToxic": 30,
      "toxicity": 2
    },
    "descTh": "ใช้พิษต้านพิษ ชะล้างสารพิษรุนแรงและลมปราณอุดตัน",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_REGEN_2",
    "nameTh": "ตำรับโอสถเลือดอสูรคืนพลัง",
    "craft": "ALCHEMY",
    "tier": 2,
    "minMastery": 25,
    "days": 8,
    "inputs": [
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_A_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_FELINE_B_2",
        "count": 2
      },
      {
        "matId": "MAT_HERB_JADE_LOTUS_2",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเลือดอสูรคืนพลัง",
    "effect": {
      "healHealth": 35,
      "energyRestore": 45,
      "toxicity": 3
    },
    "descTh": "ยางเถาวัลย์โลหิตช่วยกระตุ้นการไหลเวียนโลหิตและเร่งฟื้นตัว",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_BUFF_ATK_2",
    "nameTh": "ตำรับโอสถกรงเล็บวายุไพร",
    "craft": "ALCHEMY",
    "tier": 2,
    "minMastery": 30,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_FELINE_A_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_A_2",
        "count": 2
      },
      {
        "matId": "MAT_HERB_MIST_ORCHID_2",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถกรงเล็บวายุไพร",
    "effect": {
      "cbBuff": {
        "name": "กรงเล็บวายุไพร",
        "dur": 180,
        "p": {
          "atk": 0.16
        },
        "f": {
          "crit": 6
        }
      },
      "toxicity": 3
    },
    "descTh": "คมเขี้ยวเสือดาววายุ เพิ่มพลังเจาะทะลวงและโอกาสคริติคอล",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_BUFF_DEF_2",
    "nameTh": "ตำรับโอสถเกราะหินผาทะลวง",
    "craft": "ALCHEMY",
    "tier": 2,
    "minMastery": 30,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_URSINE_B_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SHELL_A_2",
        "count": 2
      },
      {
        "matId": "MAT_HERB_JADE_LOTUS_2",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเกราะหินผาทะลวง",
    "effect": {
      "cbBuff": {
        "name": "เกราะหินผาทะลวง",
        "dur": 180,
        "p": {
          "def": 0.18,
          "mdef": 0.12
        },
        "f": {}
      },
      "toxicity": 3
    },
    "descTh": "ถุงน้ำดีหมีผาหินสร้างชั้นคุ้มกายหนาดั่งศิลา",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_BUFF_CAST_2",
    "nameTh": "ตำรับโอสถเนตรเงาจันทร์กระจ่าง",
    "craft": "ALCHEMY",
    "tier": 2,
    "minMastery": 32,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_CHIMERA_A_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AQUATIC_A_2",
        "count": 2
      },
      {
        "matId": "MAT_HERB_MIST_ORCHID_2",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเนตรเงาจันทร์กระจ่าง",
    "effect": {
      "cbBuff": {
        "name": "เนตรเงาจันทร์",
        "dur": 180,
        "p": {},
        "f": {
          "cast": 14,
          "acc": 12
        }
      },
      "toxicity": 3
    },
    "descTh": "เปิดประสาทสัมผัส ร่ายวิชาได้รวดเร็วและแม่นยำยิ่งขึ้น",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_CULT_QI_2",
    "nameTh": "ตำรับโอสถบัวหยกแก่นเต่าร้อยปี",
    "craft": "ALCHEMY",
    "tier": 2,
    "minMastery": 28,
    "days": 14,
    "inputs": [
      {
        "matId": "ECO2_MAT_SHELL_B_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_UNGULATE_B_2",
        "count": 2
      },
      {
        "matId": "MAT_HERB_JADE_LOTUS_2",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถบัวหยกแก่นเต่าร้อยปี",
    "effect": {
      "cultivationProgress": 22,
      "toxicity": 3
    },
    "descTh": "แก่นเต่าร้อยปีผสมบัวหยก หล่อเลี้ยงฐานปราณให้หนักแน่น",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_INSIGHT_2",
    "nameTh": "ตำรับโอสถเบิกปัญญาคาร์ปมังกร",
    "craft": "ALCHEMY",
    "tier": 2,
    "minMastery": 30,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_AQUATIC_B_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_B_2",
        "count": 2
      },
      {
        "matId": "MAT_HERB_MIST_ORCHID_2",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเบิกปัญญาคาร์ปมังกร",
    "effect": {
      "insight": 1,
      "clearHeartDemon": 20,
      "toxicity": 2
    },
    "descTh": "เพิ่มความเข้าใจคัมภีร์และวิชา ลดความฟุ้งซ่าน",
    "starter": true
  },
  {
    "id": "ECO2_REC_PILL_HEAL_3",
    "nameTh": "ตำรับโอสถบำรุงชีพจรโสมปีศาจ",
    "craft": "ALCHEMY",
    "tier": 3,
    "minMastery": 42,
    "days": 16,
    "inputs": [
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_B_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CANINE_B_3",
        "count": 2
      },
      {
        "matId": "MAT_HERB_BLOOD_GINSENG_3",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถบำรุงชีพจรโสมปีศาจ",
    "effect": {
      "healHealth": 50,
      "healInjury": 40,
      "toxicity": 4
    },
    "descTh": "รากโสมปีศาจและโสมโลหิตสมานอาการบาดเจ็บสาหัสอย่างชะงัด",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_PURGE_3",
    "nameTh": "ตำรับโอสถดีงูเหลือมศิลาถอนหมื่นพิษ",
    "craft": "ALCHEMY",
    "tier": 3,
    "minMastery": 44,
    "days": 16,
    "inputs": [
      {
        "matId": "ECO2_MAT_SERPENT_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_ARTHROPOD_B_3",
        "count": 2
      },
      {
        "matId": "MAT_HERB_VENOM_VINE_3",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถดีงูเหลือมศิลาถอนหมื่นพิษ",
    "effect": {
      "clearPoison": 60,
      "clearToxic": 45,
      "toxicity": 3
    },
    "descTh": "ดีงูเหลือมเข้มข้น ล้างพิษสะสมในไขกระดูกและเส้นเอ็น",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_LIFE_3",
    "nameTh": "ตำรับโอสถต่ออายุขัยกวางดาวสารท",
    "craft": "ALCHEMY",
    "tier": 3,
    "minMastery": 46,
    "days": 20,
    "inputs": [
      {
        "matId": "ECO2_MAT_UNGULATE_B_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AQUATIC_B_3",
        "count": 2
      },
      {
        "matId": "MAT_HERB_BLOOD_GINSENG_3",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถต่ออายุขัยกวางดาวสารท",
    "effect": {
      "lifespanBonus": 15,
      "healHealth": 30,
      "toxicity": 3
    },
    "descTh": "ฟื้นฟูปราณชีวิต บำรุงธาตุแท้ให้อายุขัยยืนยาวขึ้น",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_ATK_3",
    "nameTh": "ตำรับโอสถพยัคฆ์ศิลาทะลวงค่าย",
    "craft": "ALCHEMY",
    "tier": 3,
    "minMastery": 45,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_FELINE_B_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_A_3",
        "count": 2
      },
      {
        "matId": "MAT_HERB_BLOOD_GINSENG_3",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถพยัคฆ์ศิลาทะลวงค่าย",
    "effect": {
      "cbBuff": {
        "name": "พยัคฆ์ศิลาทะลวงค่าย",
        "dur": 240,
        "p": {
          "atk": 0.2
        },
        "f": {
          "pen": 14
        }
      },
      "toxicity": 4
    },
    "descTh": "โลหิตพยัคฆ์ศิลา เสริมพลังทำลายล้างทะลวงเกราะศัตรู",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_DEF_3",
    "nameTh": "ตำรับโอสถเกราะเต่าหนามทมิฬ",
    "craft": "ALCHEMY",
    "tier": 3,
    "minMastery": 45,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_SHELL_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_URSINE_A_3",
        "count": 2
      },
      {
        "matId": "MAT_HERB_VENOM_VINE_3",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเกราะเต่าหนามทมิฬ",
    "effect": {
      "cbBuff": {
        "name": "เกราะเต่าหนามทมิฬ",
        "dur": 240,
        "p": {
          "def": 0.22,
          "mdef": 0.16
        },
        "f": {}
      },
      "toxicity": 4
    },
    "descTh": "แก่นศิลาหนามทมิฬ คุ้มกายต้านทานอาวุธและวิชาคาถา",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_CRIT_3",
    "nameTh": "ตำรับโอสถคมเขี้ยวสุนัขป่าลมกรด",
    "craft": "ALCHEMY",
    "tier": 3,
    "minMastery": 46,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_CANINE_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AVIAN_B_3",
        "count": 2
      },
      {
        "matId": "MAT_HERB_VENOM_VINE_3",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถคมเขี้ยวสุนัขป่าลมกรด",
    "effect": {
      "cbBuff": {
        "name": "คมเขี้ยวลมกรด",
        "dur": 240,
        "p": {},
        "f": {
          "crit": 12,
          "critDmg": 25
        }
      },
      "toxicity": 4
    },
    "descTh": "กระตุ้นสัญชาตญาณสัตว์ป่า เพิ่มความเสียหายคริติคอลอย่างรุนแรง",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_CULT_QI_3",
    "nameTh": "ตำรับโอสถรากฐานกิเลนศิลา",
    "craft": "ALCHEMY",
    "tier": 3,
    "minMastery": 44,
    "days": 22,
    "inputs": [
      {
        "matId": "ECO2_MAT_CHIMERA_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_A_3",
        "count": 2
      },
      {
        "matId": "MAT_HERB_BLOOD_GINSENG_3",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถรากฐานกิเลนศิลา",
    "effect": {
      "cultivationProgress": 32,
      "breakthroughBonus": 0.12,
      "toxicity": 5
    },
    "descTh": "พลังกิเลนศิลา เสริมความมั่นคงช่วงเตรียมทะลวงขั้น",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_MIND_CALM_3",
    "nameTh": "ตำรับโอสถดับจิตมารเพลิงลาวา",
    "craft": "ALCHEMY",
    "tier": 3,
    "minMastery": 45,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_URSINE_B_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SERPENT_B_3",
        "count": 2
      },
      {
        "matId": "MAT_HERB_VENOM_VINE_3",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถดับจิตมารเพลิงลาวา",
    "effect": {
      "clearHeartDemon": 35,
      "toxicity": 3
    },
    "descTh": "สยบไฟมารในจิตวิญญาณ ป้องกันอาการธาตุไฟแทรก",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_HEAL_4",
    "nameTh": "ตำรับโอสถโลหิตกวางขาวคืนชีพ",
    "craft": "ALCHEMY",
    "tier": 4,
    "minMastery": 58,
    "days": 24,
    "inputs": [
      {
        "matId": "ECO2_MAT_UNGULATE_B_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_FELINE_B_4",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DRAGON_GRASS_4",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถโลหิตกวางขาวคืนชีพ",
    "effect": {
      "healHealth": 80,
      "healInjury": 60,
      "toxicity": 5
    },
    "descTh": "โลหิตวิญญาณกวางหิมะขาว สมานกระดูกที่แตกหักและชีพจรที่ฉีกขาด",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_PURGE_4",
    "nameTh": "ตำรับโอสถถอนพิษงูเห่าเหมันต์",
    "craft": "ALCHEMY",
    "tier": 4,
    "minMastery": 60,
    "days": 24,
    "inputs": [
      {
        "matId": "ECO2_MAT_SERPENT_A_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_B_4",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DRAGON_GRASS_4",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถถอนพิษงูเห่าเหมันต์",
    "effect": {
      "clearPoison": 80,
      "clearToxic": 60,
      "toxicity": 4
    },
    "descTh": "สกัดความเย็นเยือกแข็ง ขับพิษร้ายแรงและหนอนกู่",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_LIFE_4",
    "nameTh": "ตำรับโอสถเสริมปราณบัวเพลิงอัคนี",
    "craft": "ALCHEMY",
    "tier": 4,
    "minMastery": 62,
    "days": 28,
    "inputs": [
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_B_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CANINE_B_4",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DRAGON_GRASS_4",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเสริมปราณบัวเพลิงอัคนี",
    "effect": {
      "lifespanBonus": 30,
      "healHealth": 50,
      "toxicity": 5
    },
    "descTh": "เมล็ดบัวลาวาหลอมปราณ ต่อเติมอายุขัยและฟื้นฟูรากฐาน",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_ATK_4",
    "nameTh": "ตำรับโอสถหมาป่าโลหิตคลั่ง",
    "craft": "ALCHEMY",
    "tier": 4,
    "minMastery": 60,
    "days": 25,
    "inputs": [
      {
        "matId": "ECO2_MAT_CANINE_A_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_FELINE_A_4",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DRAGON_GRASS_4",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถหมาป่าโลหิตคลั่ง",
    "effect": {
      "cbBuff": {
        "name": "หมาป่าโลหิตคลั่ง",
        "dur": 300,
        "p": {
          "atk": 0.26
        },
        "f": {
          "crit": 8,
          "pen": 16
        }
      },
      "toxicity": 6
    },
    "descTh": "ปลุกสัญชาตญาณสังหาร เพิ่มพลังโจมตีและอัตราคริติคอลสูงสุด",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_DEF_4",
    "nameTh": "ตำรับโอสถแก่นเพลิงลาวาคุ้มร่าง",
    "craft": "ALCHEMY",
    "tier": 4,
    "minMastery": 60,
    "days": 25,
    "inputs": [
      {
        "matId": "ECO2_MAT_SHELL_B_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_URSINE_B_4",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DRAGON_GRASS_4",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถแก่นเพลิงลาวาคุ้มร่าง",
    "effect": {
      "cbBuff": {
        "name": "แก่นเพลิงลาวาคุ้มร่าง",
        "dur": 300,
        "p": {
          "def": 0.28,
          "mdef": 0.22
        },
        "f": {}
      },
      "toxicity": 6
    },
    "descTh": "ห่อหุ้มร่างด้วยเกราะเพลิงลาวา ลดทอนดาเมจกายภาพและเวทมนตร์",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_SPEED_4",
    "nameTh": "ตำรับโอสถเหินนภาอินทรีพยัคฆ์",
    "craft": "ALCHEMY",
    "tier": 4,
    "minMastery": 62,
    "days": 25,
    "inputs": [
      {
        "matId": "ECO2_MAT_CHIMERA_A_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AVIAN_B_4",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DRAGON_GRASS_4",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเหินนภาอินทรีพยัคฆ์",
    "effect": {
      "cbBuff": {
        "name": "เหินนภาอินทรีพยัคฆ์",
        "dur": 300,
        "p": {
          "move": 0.22,
          "eva": 0.16
        },
        "f": {
          "cast": 18
        }
      },
      "toxicity": 5
    },
    "descTh": "ตัวเบาดุจขนนก เคลื่อนไหวรวดเร็วดั่งอินทรีทะยานลม",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_CULT_QI_4",
    "nameTh": "ตำรับโอสถแก่นทองคำฉลามเพลิง",
    "craft": "ALCHEMY",
    "tier": 4,
    "minMastery": 60,
    "days": 30,
    "inputs": [
      {
        "matId": "ECO2_MAT_AQUATIC_B_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_A_4",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DRAGON_GRASS_4",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถแก่นทองคำฉลามเพลิง",
    "effect": {
      "cultivationProgress": 45,
      "breakthroughBonus": 0.2,
      "toxicity": 6
    },
    "descTh": "ช่วยหลอมรวมปราณแก่นทองคำให้บริสุทธิ์และมั่นคง",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_MIND_CALM_4",
    "nameTh": "ตำรับโอสถสยบมารใยไหมเงารัตติกาล",
    "craft": "ALCHEMY",
    "tier": 4,
    "minMastery": 62,
    "days": 26,
    "inputs": [
      {
        "matId": "ECO2_MAT_ARTHROPOD_B_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CHIMERA_B_4",
        "count": 2
      },
      {
        "matId": "MAT_HERB_DRAGON_GRASS_4",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถสยบมารใยไหมเงารัตติกาล",
    "effect": {
      "clearHeartDemon": 50,
      "toxicity": 4
    },
    "descTh": "พันธนาการจิตมารที่ปั่นป่วน ให้สงบนิ่งดั่งบ่อน้ำลึก",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_HEAL_5",
    "nameTh": "ตำรับโอสถเอ็นพยัคฆ์ขาวต่อกระดูก",
    "craft": "ALCHEMY",
    "tier": 5,
    "minMastery": 72,
    "days": 36,
    "inputs": [
      {
        "matId": "ECO2_MAT_FELINE_B_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CANINE_A_5",
        "count": 2
      },
      {
        "matId": "MAT_HERB_SNOW_LOTUS_5",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถเอ็นพยัคฆ์ขาวต่อกระดูก",
    "effect": {
      "healHealth": 120,
      "healInjury": 100,
      "toxicity": 6
    },
    "descTh": "ฟื้นฟูกระดูกและกล้ามเนื้อที่แหลกเหลวให้คืนสภาพสมบูรณ์",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_PURGE_5",
    "nameTh": "ตำรับโอสถถอนพิษพญาพฤกษาหมื่นพิษ",
    "craft": "ALCHEMY",
    "tier": 5,
    "minMastery": 74,
    "days": 36,
    "inputs": [
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SERPENT_A_5",
        "count": 2
      },
      {
        "matId": "MAT_HERB_SNOW_LOTUS_5",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถถอนพิษพญาพฤกษาหมื่นพิษ",
    "effect": {
      "clearPoison": 100,
      "clearToxic": 80,
      "toxicity": 5
    },
    "descTh": "ขับล้างสารพิษระดับมรณะและคำสาปกัดกร่อนวิญญาณ",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_LIFE_5",
    "nameTh": "ตำรับโอสถไข่มุกวาฬครามต่ออายุ",
    "craft": "ALCHEMY",
    "tier": 5,
    "minMastery": 76,
    "days": 45,
    "inputs": [
      {
        "matId": "ECO2_MAT_AQUATIC_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_A_5",
        "count": 2
      },
      {
        "matId": "MAT_HERB_SNOW_LOTUS_5",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถไข่มุกวาฬครามต่ออายุ",
    "effect": {
      "lifespanBonus": 60,
      "healHealth": 80,
      "toxicity": 6
    },
    "descTh": "ไข่มุกวิญญาณวาฬคราม มอบพลังชีวิตอันไพศาลดั่งมหาสมุทร",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_ATK_5",
    "nameTh": "ตำรับโอสถกระทิงเพลิงเก้าอัคคีพิโรธ",
    "craft": "ALCHEMY",
    "tier": 5,
    "minMastery": 75,
    "days": 38,
    "inputs": [
      {
        "matId": "ECO2_MAT_UNGULATE_B_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_URSINE_B_5",
        "count": 2
      },
      {
        "matId": "MAT_HERB_SNOW_LOTUS_5",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถกระทิงเพลิงเก้าอัคคีพิโรธ",
    "effect": {
      "cbBuff": {
        "name": "กระทิงเพลิงเก้าอัคคี",
        "dur": 360,
        "p": {
          "atk": 0.32
        },
        "f": {
          "crit": 12,
          "pen": 22
        }
      },
      "toxicity": 7
    },
    "descTh": "หัวใจกระทิงเพลิง เสริมพลังทำลายล้างสูงสุดยามเผชิญหน้ายอดฝีมือ",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_DEF_5",
    "nameTh": "ตำรับโอสถกระดองเต่ามังกรค้ำฟ้า",
    "craft": "ALCHEMY",
    "tier": 5,
    "minMastery": 75,
    "days": 38,
    "inputs": [
      {
        "matId": "ECO2_MAT_SHELL_B_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_B_5",
        "count": 2
      },
      {
        "matId": "MAT_HERB_SNOW_LOTUS_5",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถกระดองเต่ามังกรค้ำฟ้า",
    "effect": {
      "cbBuff": {
        "name": "กระดองเต่ามังกรค้ำฟ้า",
        "dur": 360,
        "p": {
          "def": 0.34,
          "mdef": 0.28
        },
        "f": {}
      },
      "toxicity": 7
    },
    "descTh": "เกราะเต่ามังกรค้ำฟ้า คุ้มครองผู้ใช้ต้านทานการโจมตีหนักหน่วง",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_THUNDER_5",
    "nameTh": "ตำรับโอสถสายฟ้าพญาแมงป่องผลึก",
    "craft": "ALCHEMY",
    "tier": 5,
    "minMastery": 76,
    "days": 38,
    "inputs": [
      {
        "matId": "ECO2_MAT_ARTHROPOD_B_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AVIAN_B_5",
        "count": 2
      },
      {
        "matId": "MAT_HERB_SNOW_LOTUS_5",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถสายฟ้าพญาแมงป่องผลึก",
    "effect": {
      "cbBuff": {
        "name": "สายฟ้าผลึกอสนี",
        "dur": 360,
        "p": {},
        "f": {
          "cast": 24,
          "crit": 14,
          "acc": 20
        }
      },
      "toxicity": 7
    },
    "descTh": "กระแสไฟฟ้าในร่างเร่งการประมวลผลและการจู่โจมฉับไว",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_CULT_QI_5",
    "nameTh": "ตำรับโอสถแก่นวิญญาณจิ้งจอกเก้าหาง",
    "craft": "ALCHEMY",
    "tier": 5,
    "minMastery": 74,
    "days": 42,
    "inputs": [
      {
        "matId": "ECO2_MAT_CANINE_B_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_B_5",
        "count": 2
      },
      {
        "matId": "MAT_HERB_SNOW_LOTUS_5",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถแก่นวิญญาณจิ้งจอกเก้าหาง",
    "effect": {
      "cultivationProgress": 60,
      "breakthroughBonus": 0.25,
      "toxicity": 7
    },
    "descTh": "เร่งการสะสมพลังตบะในขั้นสูง และช่วยเปิดจุดชีพจรสำคัญ",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_MIND_CALM_5",
    "nameTh": "ตำรับโอสถสงบวิญญาณกิเลนเพลิงม่วง",
    "craft": "ALCHEMY",
    "tier": 5,
    "minMastery": 75,
    "days": 40,
    "inputs": [
      {
        "matId": "ECO2_MAT_CHIMERA_B_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SERPENT_B_5",
        "count": 2
      },
      {
        "matId": "MAT_HERB_SNOW_LOTUS_5",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถสงบวิญญาณกิเลนเพลิงม่วง",
    "effect": {
      "clearHeartDemon": 70,
      "toxicity": 5
    },
    "descTh": "ชำระล้างจิตใจให้ผ่องแผ้ว สยบภาพหลอนและมารในใจ",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_HEAL_6",
    "nameTh": "ตำรับโอสถหงส์เพลิงเก้าชีวาอมฤต",
    "craft": "ALCHEMY",
    "tier": 6,
    "minMastery": 86,
    "days": 60,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_FEATHER_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CANINE_A_6",
        "count": 2
      },
      {
        "matId": "MAT_HERB_IMMORTAL_PEACH_6",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_FELINE_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_URSINE_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_SERPENT_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_AVIAN_A_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_AVIAN_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_ARTHROPOD_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_SHELL_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_UNGULATE_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_AQUATIC_A_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_AQUATIC_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_CHIMERA_B_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_MYTHIC_WING_6",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_MYTHIC_HORN_7",
        "count": 1
      },
      {
        "matId": "ECO2_MAT_MYTHIC_STOMACH_7",
        "count": 1
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถหงส์เพลิงเก้าชีวาอมฤต",
    "effect": {
      "healHealth": 200,
      "healInjury": 150,
      "clearPoison": 120,
      "toxicity": 5
    },
    "descTh": "พลังคืนชีพของหงส์เพลิงสวรรค์ ชุบชีวิตและซ่อมแซมร่างกายทุกส่วน",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_LIFE_6",
    "nameTh": "ตำรับโอสถผลโพธิ์ตรัสรู้หมื่นปี",
    "craft": "ALCHEMY",
    "tier": 6,
    "minMastery": 88,
    "days": 70,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_FRUIT_8",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_A_6",
        "count": 2
      },
      {
        "matId": "MAT_HERB_IMMORTAL_PEACH_6",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถผลโพธิ์ตรัสรู้หมื่นปี",
    "effect": {
      "lifespanBonus": 150,
      "healHealth": 150,
      "toxicity": 5
    },
    "descTh": "ผลโพธิ์ตรัสรู้ ยืดอายุขัยและชำระล้างรากฐานชีวิตสู่ความบริสุทธิ์",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_PURGE_6",
    "nameTh": "ตำรับโอสถมุกน้ำตาหงสาสลายพิษสวรรค์",
    "craft": "ALCHEMY",
    "tier": 6,
    "minMastery": 85,
    "days": 55,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_PEARL_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SERPENT_A_6",
        "count": 2
      },
      {
        "matId": "MAT_HERB_IMMORTAL_PEACH_6",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถมุกน้ำตาหงสาสลายพิษสวรรค์",
    "effect": {
      "clearPoison": 150,
      "clearToxic": 100,
      "clearHeartDemon": 80,
      "toxicity": 4
    },
    "descTh": "หยาดน้ำตาหงสาอมตะ ละลายพิษทุกชนิดในใต้หล้า",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_ATK_6",
    "nameTh": "ตำรับโอสถหัวใจมังกรสุริยะบรรพกาล",
    "craft": "ALCHEMY",
    "tier": 6,
    "minMastery": 88,
    "days": 60,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_HEART_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_FELINE_A_6",
        "count": 2
      },
      {
        "matId": "MAT_HERB_IMMORTAL_PEACH_6",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถหัวใจมังกรสุริยะบรรพกาล",
    "effect": {
      "cbBuff": {
        "name": "มังกรสุริยะบรรพกาล",
        "dur": 480,
        "p": {
          "atk": 0.4,
          "matk": 0.35
        },
        "f": {
          "crit": 16,
          "pen": 30
        }
      },
      "toxicity": 8
    },
    "descTh": "หัวใจมังกรทองสุริยัน มอบพลังโจมตีสะเทือนสวรรค์และปฐพี",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_DEF_6",
    "nameTh": "ตำรับโอสถกระดองเสวียนอู่ค้ำจักรวาล",
    "craft": "ALCHEMY",
    "tier": 6,
    "minMastery": 88,
    "days": 60,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_CORE_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SHELL_A_6",
        "count": 2
      },
      {
        "matId": "MAT_HERB_IMMORTAL_PEACH_6",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถกระดองเสวียนอู่ค้ำจักรวาล",
    "effect": {
      "cbBuff": {
        "name": "เสวียนอู่ค้ำจักรวาล",
        "dur": 480,
        "p": {
          "def": 0.42,
          "mdef": 0.38
        },
        "f": {}
      },
      "toxicity": 8
    },
    "descTh": "แผ่นกระดองเสวียนอู่ ก่อกำแพงปราณไร้พ่ายต้านทานทุกสิ่ง",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_BUFF_ASTRAL_6",
    "nameTh": "ตำรับโอสถมหาสมุทรดารากลืนภพ",
    "craft": "ALCHEMY",
    "tier": 6,
    "minMastery": 87,
    "days": 60,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_OCEAN_6",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CHIMERA_A_6",
        "count": 2
      },
      {
        "matId": "MAT_HERB_IMMORTAL_PEACH_6",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถมหาสมุทรดารากลืนภพ",
    "effect": {
      "cbBuff": {
        "name": "มหาสมุทรดารากลืนภพ",
        "dur": 480,
        "p": {
          "move": 0.3,
          "eva": 0.25
        },
        "f": {
          "cast": 30,
          "acc": 25
        }
      },
      "toxicity": 8
    },
    "descTh": "พลังกลืนมิติของคุนเผิง เคลื่อนที่ข้ามห้วงอวกาศและร่ายวิชาฉับไว",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_CULT_QI_6",
    "nameTh": "ตำรับโอสถแก่นรากโพธิ์สวรรค์รวมเต๋า",
    "craft": "ALCHEMY",
    "tier": 6,
    "minMastery": 88,
    "days": 65,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_HORN_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_UNGULATE_A_6",
        "count": 2
      },
      {
        "matId": "MAT_HERB_IMMORTAL_PEACH_6",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถแก่นรากโพธิ์สวรรค์รวมเต๋า",
    "effect": {
      "cultivationProgress": 90,
      "breakthroughBonus": 0.3,
      "toxicity": 8
    },
    "descTh": "เร่งตบะสู่จุดสูงสุดของขั้นเซียน เสริมโอกาสผ่านทัณฑ์สวรรค์",
    "starter": false
  },
  {
    "id": "ECO2_REC_PILL_MIND_CALM_6",
    "nameTh": "ตำรับโอสถสยบมารบุญญาบารมีฟ้า",
    "craft": "ALCHEMY",
    "tier": 6,
    "minMastery": 86,
    "days": 55,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_CRYSTAL_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_ARTHROPOD_A_6",
        "count": 2
      },
      {
        "matId": "MAT_HERB_IMMORTAL_PEACH_6",
        "count": 2
      }
    ],
    "outType": "PILL",
    "outNameTh": "โอสถสยบมารบุญญาบารมีฟ้า",
    "effect": {
      "clearHeartDemon": 100,
      "toxicity": 5
    },
    "descTh": "พลังกิเลนทองคำจักรพรรดิฟ้า กำจัดจิตมารจนสิ้นเชิง",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_001_SWORD_2",
    "nameTh": "ตำรับหลอมกระบี่เขี้ยวเงาจันทร์",
    "craft": "FORGING",
    "tier": 2,
    "minMastery": 28,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_CANINE_A_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SERPENT_B_2",
        "count": 2
      },
      {
        "matId": "MAT_ORE_COLD_STEEL_2",
        "count": 4
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_001_SWORD_2",
    "outNameTh": "กระบี่เขี้ยวเงาจันทร์",
    "yield": 1,
    "gearType": "SWORD",
    "starter": true
  },
  {
    "id": "ECO2_REC_EQ_002_SWORD_4",
    "nameTh": "ตำรับหลอมกระบี่เกล็ดงูเห่าเหมันต์",
    "craft": "FORGING",
    "tier": 4,
    "minMastery": 56,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_SERPENT_B_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_A_4",
        "count": 2
      },
      {
        "matId": "MAT_ORE_MITHRIL_JADE_4",
        "count": 6
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_002_SWORD_4",
    "outNameTh": "กระบี่เกล็ดงูเห่าเหมันต์",
    "yield": 1,
    "gearType": "SWORD",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_003_SWORD_6",
    "nameTh": "ตำรับหลอมกระบี่มังกรทองเก้าสุริยัน",
    "craft": "FORGING",
    "tier": 6,
    "minMastery": 84,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_SCALE_1",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_A_6",
        "count": 2
      },
      {
        "matId": "MAT_ORE_DIVINE_GOLD_6",
        "count": 8
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_003_SWORD_6",
    "outNameTh": "กระบี่มังกรทองเก้าสุริยัน",
    "yield": 1,
    "gearType": "SWORD",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_004_BLADE_2",
    "nameTh": "ตำรับหลอมดาบกรงเล็บวายุไพร",
    "craft": "FORGING",
    "tier": 2,
    "minMastery": 28,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_FELINE_A_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_B_1",
        "count": 2
      },
      {
        "matId": "MAT_ORE_COLD_STEEL_2",
        "count": 4
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_004_BLADE_2",
    "outNameTh": "ดาบกรงเล็บวายุไพร",
    "yield": 1,
    "gearType": "BLADE",
    "starter": true
  },
  {
    "id": "ECO2_REC_EQ_005_BLADE_4",
    "nameTh": "ตำรับหลอมดาบเขี้ยวหมูป่าหินหลอม",
    "craft": "FORGING",
    "tier": 4,
    "minMastery": 56,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_BOAR_A_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_URSINE_A_4",
        "count": 2
      },
      {
        "matId": "MAT_ORE_MITHRIL_JADE_4",
        "count": 6
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_005_BLADE_4",
    "outNameTh": "ดาบเขี้ยวหมูป่าหินหลอม",
    "yield": 1,
    "gearType": "BLADE",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_006_BLADE_6",
    "nameTh": "ตำรับหลอมดาบเขี้ยวไป๋หู่พิฆาตดารา",
    "craft": "FORGING",
    "tier": 6,
    "minMastery": 84,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_FANG_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_URSINE_A_6",
        "count": 2
      },
      {
        "matId": "MAT_ORE_DIVINE_GOLD_6",
        "count": 8
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_006_BLADE_6",
    "outNameTh": "ดาบเขี้ยวไป๋หู่พิฆาตดารา",
    "yield": 1,
    "gearType": "BLADE",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_007_BOW_3",
    "nameTh": "ตำรับหลอมธนูปีกอินทรีศิลา",
    "craft": "FORGING",
    "tier": 3,
    "minMastery": 42,
    "days": 9,
    "inputs": [
      {
        "matId": "ECO2_MAT_AVIAN_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_UNGULATE_A_3",
        "count": 2
      },
      {
        "matId": "MAT_ORE_STAR_COPPER_3",
        "count": 5
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_007_BOW_3",
    "outNameTh": "ธนูปีกอินทรีศิลา",
    "yield": 1,
    "gearType": "BOW",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_008_BOW_5",
    "nameTh": "ตำรับหลอมธนูขนนกอัสนีคำรณ",
    "craft": "FORGING",
    "tier": 5,
    "minMastery": 70,
    "days": 15,
    "inputs": [
      {
        "matId": "ECO2_MAT_AVIAN_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_UNGULATE_A_5",
        "count": 2
      },
      {
        "matId": "MAT_ORE_METEOR_IRON_5",
        "count": 7
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_008_BOW_5",
    "outNameTh": "ธนูขนนกอัสนีคำรณ",
    "yield": 1,
    "gearType": "BOW",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_009_SPEAR_3",
    "nameTh": "ตำรับหลอมหอกเขาเหล็กกระทิงศิลา",
    "craft": "FORGING",
    "tier": 3,
    "minMastery": 42,
    "days": 9,
    "inputs": [
      {
        "matId": "ECO2_MAT_UNGULATE_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_B_3",
        "count": 2
      },
      {
        "matId": "MAT_ORE_STAR_COPPER_3",
        "count": 5
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_009_SPEAR_3",
    "outNameTh": "หอกเขาเหล็กกระทิงศิลา",
    "yield": 1,
    "gearType": "SPEAR",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_010_SPEAR_5",
    "nameTh": "ตำรับหลอมทวนมหาเขากระทิงเพลิง",
    "craft": "FORGING",
    "tier": 5,
    "minMastery": 70,
    "days": 15,
    "inputs": [
      {
        "matId": "ECO2_MAT_UNGULATE_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_FELINE_A_5",
        "count": 2
      },
      {
        "matId": "MAT_ORE_METEOR_IRON_5",
        "count": 7
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_010_SPEAR_5",
    "outNameTh": "ทวนมหาเขากระทิงเพลิง",
    "yield": 1,
    "gearType": "SPEAR",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_011_STAFF_2",
    "nameTh": "ตำรับหลอมพลองกระดูกหมีหินผา",
    "craft": "FORGING",
    "tier": 2,
    "minMastery": 28,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_URSINE_A_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_UNGULATE_A_2",
        "count": 2
      },
      {
        "matId": "MAT_ORE_COLD_STEEL_2",
        "count": 4
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_011_STAFF_2",
    "outNameTh": "พลองกระดูกหมีหินผา",
    "yield": 1,
    "gearType": "STAFF",
    "starter": true
  },
  {
    "id": "ECO2_REC_EQ_012_STAFF_5",
    "nameTh": "ตำรับหลอมกระบองกระดูกหมีหิมะโบราณ",
    "craft": "FORGING",
    "tier": 5,
    "minMastery": 70,
    "days": 15,
    "inputs": [
      {
        "matId": "ECO2_MAT_URSINE_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CHIMERA_A_5",
        "count": 2
      },
      {
        "matId": "MAT_ORE_METEOR_IRON_5",
        "count": 7
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_012_STAFF_5",
    "outNameTh": "กระบองกระดูกหมีหิมะโบราณ",
    "yield": 1,
    "gearType": "STAFF",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_013_FIST_3",
    "nameTh": "ตำรับหลอมสนับกรงเล็บเสือดาบศิลา",
    "craft": "FORGING",
    "tier": 3,
    "minMastery": 42,
    "days": 9,
    "inputs": [
      {
        "matId": "ECO2_MAT_FELINE_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CHIMERA_B_3",
        "count": 2
      },
      {
        "matId": "MAT_ORE_STAR_COPPER_3",
        "count": 5
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_013_FIST_3",
    "outNameTh": "สนับกรงเล็บเสือดาบศิลา",
    "yield": 1,
    "gearType": "FIST",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_014_FIST_5",
    "nameTh": "ตำรับหลอมสนับเขี้ยวพยัคฆ์ขาวเหมันต์",
    "craft": "FORGING",
    "tier": 5,
    "minMastery": 70,
    "days": 15,
    "inputs": [
      {
        "matId": "ECO2_MAT_FELINE_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CANINE_A_5",
        "count": 2
      },
      {
        "matId": "MAT_ORE_METEOR_IRON_5",
        "count": 7
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_014_FIST_5",
    "outNameTh": "สนับเขี้ยวพยัคฆ์ขาวเหมันต์",
    "yield": 1,
    "gearType": "FIST",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_015_FOCUS_3",
    "nameTh": "ตำรับหลอมตราดวงจิตกิเลนศิลา",
    "craft": "FORGING",
    "tier": 3,
    "minMastery": 42,
    "days": 9,
    "inputs": [
      {
        "matId": "ECO2_MAT_CHIMERA_B_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SHELL_B_3",
        "count": 2
      },
      {
        "matId": "MAT_ORE_STAR_COPPER_3",
        "count": 5
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_015_FOCUS_3",
    "outNameTh": "ตราดวงจิตกิเลนศิลา",
    "yield": 1,
    "gearType": "FOCUS",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_016_FOCUS_5",
    "nameTh": "ตำรับหลอมตราเพลิงกิเลนม่วงเก้าวัฏจักร",
    "craft": "FORGING",
    "tier": 5,
    "minMastery": 70,
    "days": 15,
    "inputs": [
      {
        "matId": "ECO2_MAT_CHIMERA_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AQUATIC_B_5",
        "count": 2
      },
      {
        "matId": "MAT_ORE_METEOR_IRON_5",
        "count": 7
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_016_FOCUS_5",
    "outNameTh": "ตราเพลิงกิเลนม่วงเก้าวัฏจักร",
    "yield": 1,
    "gearType": "FOCUS",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_017_HEAVY_2",
    "nameTh": "ตำรับหลอมเกราะหนักหนามเหล็กหมูป่า",
    "craft": "FORGING",
    "tier": 2,
    "minMastery": 28,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_BOAR_B_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SHELL_B_2",
        "count": 2
      },
      {
        "matId": "MAT_ORE_COLD_STEEL_2",
        "count": 4
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_017_HEAVY_2",
    "outNameTh": "เกราะหนักหนามเหล็กหมูป่า",
    "yield": 1,
    "gearType": "HEAVY",
    "starter": true
  },
  {
    "id": "ECO2_REC_EQ_018_HEAVY_4",
    "nameTh": "ตำรับหลอมเกราะหนักหมีเหล็กไหลหลังทอง",
    "craft": "FORGING",
    "tier": 4,
    "minMastery": 56,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_URSINE_A_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SHELL_A_4",
        "count": 2
      },
      {
        "matId": "MAT_ORE_MITHRIL_JADE_4",
        "count": 6
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_018_HEAVY_4",
    "outNameTh": "เกราะหนักหมีเหล็กไหลหลังทอง",
    "yield": 1,
    "gearType": "HEAVY",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_019_HEAVY_6",
    "nameTh": "ตำรับหลอมเกราะหนักกระดองเสวียนอู่ค้ำฟ้า",
    "craft": "FORGING",
    "tier": 6,
    "minMastery": 84,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_SHELL_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_B_6",
        "count": 2
      },
      {
        "matId": "MAT_ORE_DIVINE_GOLD_6",
        "count": 8
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_019_HEAVY_6",
    "outNameTh": "เกราะหนักกระดองเสวียนอู่ค้ำฟ้า",
    "yield": 1,
    "gearType": "HEAVY",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_020_LIGHT_2",
    "nameTh": "ตำรับหลอมเกราะเบาหนังเสือดาววายุ",
    "craft": "FORGING",
    "tier": 2,
    "minMastery": 28,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_FELINE_B_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CHIMERA_B_2",
        "count": 2
      },
      {
        "matId": "MAT_ORE_COLD_STEEL_2",
        "count": 4
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_020_LIGHT_2",
    "outNameTh": "เกราะเบาหนังเสือดาววายุ",
    "yield": 1,
    "gearType": "LIGHT",
    "starter": true
  },
  {
    "id": "ECO2_REC_EQ_021_LIGHT_4",
    "nameTh": "ตำรับหลอมเกราะเบาหนังหมาป่าเพลิงโลหิต",
    "craft": "FORGING",
    "tier": 4,
    "minMastery": 56,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_CANINE_B_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_UNGULATE_A_4",
        "count": 2
      },
      {
        "matId": "MAT_ORE_MITHRIL_JADE_4",
        "count": 6
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_021_LIGHT_4",
    "outNameTh": "เกราะเบาหนังหมาป่าเพลิงโลหิต",
    "yield": 1,
    "gearType": "LIGHT",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_022_LIGHT_6",
    "nameTh": "ตำรับหลอมเกราะเบาหนังพยัคฆ์ขาวเจ็ดดาว",
    "craft": "FORGING",
    "tier": 6,
    "minMastery": 84,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_PELT_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_CANINE_B_6",
        "count": 2
      },
      {
        "matId": "MAT_ORE_DIVINE_GOLD_6",
        "count": 8
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_022_LIGHT_6",
    "outNameTh": "เกราะเบาหนังพยัคฆ์ขาวเจ็ดดาว",
    "yield": 1,
    "gearType": "LIGHT",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_023_ROBE_2",
    "nameTh": "ตำรับหลอมอาภรณ์แพรนกกระเรียนหยก",
    "craft": "FORGING",
    "tier": 2,
    "minMastery": 28,
    "days": 6,
    "inputs": [
      {
        "matId": "ECO2_MAT_AVIAN_B_2",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SERPENT_B_1",
        "count": 2
      },
      {
        "matId": "MAT_ORE_COLD_STEEL_2",
        "count": 4
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_023_ROBE_2",
    "outNameTh": "อาภรณ์แพรนกกระเรียนหยก",
    "yield": 1,
    "gearType": "ROBE",
    "starter": true
  },
  {
    "id": "ECO2_REC_EQ_024_ROBE_4",
    "nameTh": "ตำรับหลอมอาภรณ์ไหมแมงมุมเงารัตติกาล",
    "craft": "FORGING",
    "tier": 4,
    "minMastery": 56,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_ARTHROPOD_A_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AVIAN_A_4",
        "count": 2
      },
      {
        "matId": "MAT_ORE_MITHRIL_JADE_4",
        "count": 6
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_024_ROBE_4",
    "outNameTh": "อาภรณ์ไหมแมงมุมเงารัตติกาล",
    "yield": 1,
    "gearType": "ROBE",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_025_ROBE_6",
    "nameTh": "ตำรับหลอมอาภรณ์แพรโพธิ์สวรรค์หมื่นปี",
    "craft": "FORGING",
    "tier": 6,
    "minMastery": 84,
    "days": 18,
    "inputs": [
      {
        "matId": "ECO2_MAT_MYTHIC_ROOT_8",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_PLANT_SPIRIT_B_6",
        "count": 2
      },
      {
        "matId": "MAT_ORE_DIVINE_GOLD_6",
        "count": 8
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_025_ROBE_6",
    "outNameTh": "อาภรณ์แพรโพธิ์สวรรค์หมื่นปี",
    "yield": 1,
    "gearType": "ROBE",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_026_RING_3",
    "nameTh": "ตำรับหลอมแหวนแก่นเต่าศิลาดำ",
    "craft": "FORGING",
    "tier": 3,
    "minMastery": 42,
    "days": 9,
    "inputs": [
      {
        "matId": "ECO2_MAT_SHELL_B_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_ARTHROPOD_A_3",
        "count": 2
      },
      {
        "matId": "MAT_ORE_STAR_COPPER_3",
        "count": 5
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_026_RING_3",
    "outNameTh": "แหวนแก่นเต่าศิลาดำ",
    "yield": 1,
    "gearType": "RING",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_027_RING_5",
    "nameTh": "ตำรับหลอมแหวนไข่มุกวิญญาณวาฬคราม",
    "craft": "FORGING",
    "tier": 5,
    "minMastery": 70,
    "days": 15,
    "inputs": [
      {
        "matId": "ECO2_MAT_AQUATIC_B_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SHELL_A_5",
        "count": 2
      },
      {
        "matId": "MAT_ORE_METEOR_IRON_5",
        "count": 7
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_027_RING_5",
    "outNameTh": "แหวนไข่มุกวิญญาณวาฬคราม",
    "yield": 1,
    "gearType": "RING",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_028_NECKLACE_3",
    "nameTh": "ตำรับหลอมสร้อยเขากวางดาวสารท",
    "craft": "FORGING",
    "tier": 3,
    "minMastery": 42,
    "days": 9,
    "inputs": [
      {
        "matId": "ECO2_MAT_UNGULATE_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_BOAR_A_1",
        "count": 2
      },
      {
        "matId": "MAT_ORE_STAR_COPPER_3",
        "count": 5
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_028_NECKLACE_3",
    "outNameTh": "สร้อยเขากวางดาวสารท",
    "yield": 1,
    "gearType": "NECKLACE",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_029_NECKLACE_5",
    "nameTh": "ตำรับหลอมสร้อยมงกุฎเขากวางดาราสวรรค์",
    "craft": "FORGING",
    "tier": 5,
    "minMastery": 70,
    "days": 15,
    "inputs": [
      {
        "matId": "ECO2_MAT_UNGULATE_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AVIAN_A_5",
        "count": 2
      },
      {
        "matId": "MAT_ORE_METEOR_IRON_5",
        "count": 7
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_029_NECKLACE_5",
    "outNameTh": "สร้อยมงกุฎเขากวางดาราสวรรค์",
    "yield": 1,
    "gearType": "NECKLACE",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_030_BRACELET_3",
    "nameTh": "ตำรับหลอมกำไลเกล็ดชะโดหนองบึง",
    "craft": "FORGING",
    "tier": 3,
    "minMastery": 42,
    "days": 9,
    "inputs": [
      {
        "matId": "ECO2_MAT_AQUATIC_A_3",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_SERPENT_B_3",
        "count": 2
      },
      {
        "matId": "MAT_ORE_STAR_COPPER_3",
        "count": 5
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_030_BRACELET_3",
    "outNameTh": "กำไลเกล็ดชะโดหนองบึง",
    "yield": 1,
    "gearType": "BRACELET",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_031_BRACELET_5",
    "nameTh": "ตำรับหลอมกำไลเกล็ดกิเลนเพลิงม่วง",
    "craft": "FORGING",
    "tier": 5,
    "minMastery": 70,
    "days": 15,
    "inputs": [
      {
        "matId": "ECO2_MAT_CHIMERA_A_5",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_ARTHROPOD_A_5",
        "count": 2
      },
      {
        "matId": "MAT_ORE_METEOR_IRON_5",
        "count": 7
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_031_BRACELET_5",
    "outNameTh": "กำไลเกล็ดกิเลนเพลิงม่วง",
    "yield": 1,
    "gearType": "BRACELET",
    "starter": false
  },
  {
    "id": "ECO2_REC_EQ_032_CHARM_4",
    "nameTh": "ตำรับหลอมเครื่องรางกระดองเต่าลาวาเพลิง",
    "craft": "FORGING",
    "tier": 4,
    "minMastery": 56,
    "days": 12,
    "inputs": [
      {
        "matId": "ECO2_MAT_SHELL_A_4",
        "count": 2
      },
      {
        "matId": "ECO2_MAT_AQUATIC_A_4",
        "count": 2
      },
      {
        "matId": "MAT_ORE_MITHRIL_JADE_4",
        "count": 6
      }
    ],
    "outType": "EQUIPMENT",
    "outItemId": "ECO2_EQ_032_CHARM_4",
    "outNameTh": "เครื่องรางกระดองเต่าลาวาเพลิง",
    "yield": 1,
    "gearType": "CHARM",
    "starter": false
  }
];
  const items = [
  {
    "id": "ECO2_EQ_001_SWORD_2",
    "recipeId": "ECO2_REC_EQ_001_SWORD_2",
    "nameTh": "กระบี่เขี้ยวเงาจันทร์",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "SWORD",
    "tier": 2,
    "minStage": 1,
    "value": 140,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_ARMOR_FRACTURE",
        "params": {
          "armorReductionRatio": 0.15
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_002_SWORD_4",
    "recipeId": "ECO2_REC_EQ_002_SWORD_4",
    "nameTh": "กระบี่เกล็ดงูเห่าเหมันต์",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "SWORD",
    "tier": 4,
    "minStage": 3,
    "value": 280,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_CHILL_FREEZE",
        "params": {
          "chillStacks": 1,
          "slowRatio": 0.25
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_003_SWORD_6",
    "recipeId": "ECO2_REC_EQ_003_SWORD_6",
    "nameTh": "กระบี่มังกรทองเก้าสุริยัน",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "SWORD",
    "tier": 6,
    "minStage": 5,
    "value": 880,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_SWORD_STORM_STRIKE",
        "params": {
          "slashPower": 600,
          "maxTargets": 5,
          "armorPenRatio": 0.4
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_004_BLADE_2",
    "recipeId": "ECO2_REC_EQ_004_BLADE_2",
    "nameTh": "ดาบกรงเล็บวายุไพร",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "BLADE",
    "tier": 2,
    "minStage": 1,
    "value": 140,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_BLEEDING",
        "params": {
          "bleedDamagePerTurn": 32
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_005_BLADE_4",
    "recipeId": "ECO2_REC_EQ_005_BLADE_4",
    "nameTh": "ดาบเขี้ยวหมูป่าหินหลอม",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "BLADE",
    "tier": 4,
    "minStage": 3,
    "value": 280,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_BURNING",
        "params": {
          "burnDamagePerTurn": 48
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_006_BLADE_6",
    "recipeId": "ECO2_REC_EQ_006_BLADE_6",
    "nameTh": "ดาบเขี้ยวไป๋หู่พิฆาตดารา",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "BLADE",
    "tier": 6,
    "minStage": 5,
    "value": 880,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_ARMOR_FRACTURE",
        "params": {
          "armorReductionRatio": 0.35
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_007_BOW_3",
    "recipeId": "ECO2_REC_EQ_007_BOW_3",
    "nameTh": "ธนูปีกอินทรีศิลา",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "BOW",
    "tier": 3,
    "minStage": 2,
    "value": 210,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_INTENT_SENSE",
        "params": {
          "intentSensitivity": 60,
          "firstTurnEvasionBonus": 0.25
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_008_BOW_5",
    "recipeId": "ECO2_REC_EQ_008_BOW_5",
    "nameTh": "ธนูขนนกอัสนีคำรณ",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "BOW",
    "tier": 5,
    "minStage": 3,
    "value": 560,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_SHOCK_CONDUCTION",
        "params": {
          "shockDamage": 85,
          "maxChainTargets": 3
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_009_SPEAR_3",
    "recipeId": "ECO2_REC_EQ_009_SPEAR_3",
    "nameTh": "หอกเขาเหล็กกระทิงศิลา",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "SPEAR",
    "tier": 3,
    "minStage": 2,
    "value": 210,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_ARMOR_FRACTURE",
        "params": {
          "armorReductionRatio": 0.22
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_010_SPEAR_5",
    "recipeId": "ECO2_REC_EQ_010_SPEAR_5",
    "nameTh": "ทวนมหาเขากระทิงเพลิง",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "SPEAR",
    "tier": 5,
    "minStage": 3,
    "value": 560,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_BURNING",
        "params": {
          "burnDamagePerTurn": 55
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_011_STAFF_2",
    "recipeId": "ECO2_REC_EQ_011_STAFF_2",
    "nameTh": "พลองกระดูกหมีหินผา",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "STAFF",
    "tier": 2,
    "minStage": 1,
    "value": 140,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_BARRIER_SHIELD",
        "params": {
          "barrierCapacity": 450
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_012_STAFF_5",
    "recipeId": "ECO2_REC_EQ_012_STAFF_5",
    "nameTh": "กระบองกระดูกหมีหิมะโบราณ",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "STAFF",
    "tier": 5,
    "minStage": 3,
    "value": 560,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_DAMAGE_REFLECT",
        "params": {
          "reflectRatio": 0.3,
          "maxReflectCap": 650
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_013_FIST_3",
    "recipeId": "ECO2_REC_EQ_013_FIST_3",
    "nameTh": "สนับกรงเล็บเสือดาบศิลา",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "FIST",
    "tier": 3,
    "minStage": 2,
    "value": 210,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_BLEEDING",
        "params": {
          "bleedDamagePerTurn": 38
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_014_FIST_5",
    "recipeId": "ECO2_REC_EQ_014_FIST_5",
    "nameTh": "สนับเขี้ยวพยัคฆ์ขาวเหมันต์",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "FIST",
    "tier": 5,
    "minStage": 3,
    "value": 560,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_CHILL_FREEZE",
        "params": {
          "chillStacks": 2,
          "slowRatio": 0.35
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_015_FOCUS_3",
    "recipeId": "ECO2_REC_EQ_015_FOCUS_3",
    "nameTh": "ตราดวงจิตกิเลนศิลา",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "FOCUS",
    "tier": 3,
    "minStage": 2,
    "value": 210,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_QI_RESERVOIR",
        "params": {
          "reservoirCapacity": 420,
          "leakagePerDay": 2
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_016_FOCUS_5",
    "recipeId": "ECO2_REC_EQ_016_FOCUS_5",
    "nameTh": "ตราเพลิงกิเลนม่วงเก้าวัฏจักร",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "WEAPON",
    "gearType": "FOCUS",
    "tier": 5,
    "minStage": 3,
    "value": 560,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_QI_SIPHON",
        "params": {
          "siphonAmount": 90,
          "conversionEfficiency": 0.8
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_017_HEAVY_2",
    "recipeId": "ECO2_REC_EQ_017_HEAVY_2",
    "nameTh": "เกราะหนักหนามเหล็กหมูป่า",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "HEAVY",
    "tier": 2,
    "minStage": 1,
    "value": 150,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_DAMAGE_REFLECT",
        "params": {
          "reflectRatio": 0.2,
          "maxReflectCap": 400
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_018_HEAVY_4",
    "recipeId": "ECO2_REC_EQ_018_HEAVY_4",
    "nameTh": "เกราะหนักหมีเหล็กไหลหลังทอง",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "HEAVY",
    "tier": 4,
    "minStage": 3,
    "value": 300,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_CONTROL_RESILIENCE",
        "params": {
          "controlDurationReductionRatio": 0.4,
          "resilienceScore": 55
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_019_HEAVY_6",
    "recipeId": "ECO2_REC_EQ_019_HEAVY_6",
    "nameTh": "เกราะหนักกระดองเสวียนอู่ค้ำฟ้า",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "HEAVY",
    "tier": 6,
    "minStage": 5,
    "value": 920,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_REALM_SUPPRESSION_GUARD",
        "params": {
          "maxCrossRealmDelta": 2,
          "suppressionReductionRatio": 0.45
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_020_LIGHT_2",
    "recipeId": "ECO2_REC_EQ_020_LIGHT_2",
    "nameTh": "เกราะเบาหนังเสือดาววายุ",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "LIGHT",
    "tier": 2,
    "minStage": 1,
    "value": 140,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_SIDESTEP_EVASION",
        "params": {
          "evasionChanceBonus": 0.2,
          "movementCost": 3
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_021_LIGHT_4",
    "recipeId": "ECO2_REC_EQ_021_LIGHT_4",
    "nameTh": "เกราะเบาหนังหมาป่าเพลิงโลหิต",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "LIGHT",
    "tier": 4,
    "minStage": 3,
    "value": 280,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_TIMED_PARRY",
        "params": {
          "parryMitigationRatio": 0.45,
          "parryCharges": 2
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_022_LIGHT_6",
    "recipeId": "ECO2_REC_EQ_022_LIGHT_6",
    "nameTh": "เกราะเบาหนังพยัคฆ์ขาวเจ็ดดาว",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "LIGHT",
    "tier": 6,
    "minStage": 5,
    "value": 890,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_SIDESTEP_EVASION",
        "params": {
          "evasionChanceBonus": 0.32,
          "movementCost": 2
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_023_ROBE_2",
    "recipeId": "ECO2_REC_EQ_023_ROBE_2",
    "nameTh": "อาภรณ์แพรนกกระเรียนหยก",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "ROBE",
    "tier": 2,
    "minStage": 1,
    "value": 140,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_QI_RESERVOIR",
        "params": {
          "reservoirCapacity": 350,
          "leakagePerDay": 2
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_024_ROBE_4",
    "recipeId": "ECO2_REC_EQ_024_ROBE_4",
    "nameTh": "อาภรณ์ไหมแมงมุมเงารัตติกาล",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "ROBE",
    "tier": 4,
    "minStage": 3,
    "value": 280,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_STEALTH_CONCEALMENT",
        "params": {
          "concealmentScore": 55
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_025_ROBE_6",
    "recipeId": "ECO2_REC_EQ_025_ROBE_6",
    "nameTh": "อาภรณ์แพรโพธิ์สวรรค์หมื่นปี",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ARMOR",
    "gearType": "ROBE",
    "tier": 6,
    "minStage": 5,
    "value": 900,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_CALM_MIND",
        "params": {
          "heartDemonReduction": 35,
          "soulDefenseBonus": 50
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_026_RING_3",
    "recipeId": "ECO2_REC_EQ_026_RING_3",
    "nameTh": "แหวนแก่นเต่าศิลาดำ",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ACCESSORY",
    "gearType": "RING",
    "tier": 3,
    "minStage": 2,
    "value": 200,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_BARRIER_SHIELD",
        "params": {
          "barrierCapacity": 480
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_027_RING_5",
    "recipeId": "ECO2_REC_EQ_027_RING_5",
    "nameTh": "แหวนไข่มุกวิญญาณวาฬคราม",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ACCESSORY",
    "gearType": "RING",
    "tier": 5,
    "minStage": 3,
    "value": 540,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_QI_SIPHON",
        "params": {
          "siphonAmount": 80,
          "conversionEfficiency": 0.75
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_028_NECKLACE_3",
    "recipeId": "ECO2_REC_EQ_028_NECKLACE_3",
    "nameTh": "สร้อยเขากวางดาวสารท",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ACCESSORY",
    "gearType": "NECKLACE",
    "tier": 3,
    "minStage": 2,
    "value": 200,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_CALM_MIND",
        "params": {
          "heartDemonReduction": 25,
          "soulDefenseBonus": 35
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_029_NECKLACE_5",
    "recipeId": "ECO2_REC_EQ_029_NECKLACE_5",
    "nameTh": "สร้อยมงกุฎเขากวางดาราสวรรค์",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ACCESSORY",
    "gearType": "NECKLACE",
    "tier": 5,
    "minStage": 3,
    "value": 540,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_INTENT_SENSE",
        "params": {
          "intentSensitivity": 65,
          "firstTurnEvasionBonus": 0.28
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_030_BRACELET_3",
    "recipeId": "ECO2_REC_EQ_030_BRACELET_3",
    "nameTh": "กำไลเกล็ดชะโดหนองบึง",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ACCESSORY",
    "gearType": "BRACELET",
    "tier": 3,
    "minStage": 2,
    "value": 200,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_SUPPLY_EFFICIENCY",
        "params": {
          "supplySavingRatio": 0.25
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_031_BRACELET_5",
    "recipeId": "ECO2_REC_EQ_031_BRACELET_5",
    "nameTh": "กำไลเกล็ดกิเลนเพลิงม่วง",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ACCESSORY",
    "gearType": "BRACELET",
    "tier": 5,
    "minStage": 3,
    "value": 540,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_BURNING",
        "params": {
          "burnDamagePerTurn": 45
        }
      }
    ]
  },
  {
    "id": "ECO2_EQ_032_CHARM_4",
    "recipeId": "ECO2_REC_EQ_032_CHARM_4",
    "nameTh": "เครื่องรางกระดองเต่าลาวาเพลิง",
    "cat": "EQUIPMENT",
    "out": "EQUIPMENT",
    "slot": "ACCESSORY",
    "gearType": "CHARM",
    "tier": 4,
    "minStage": 3,
    "value": 270,
    "craft": "FORGING",
    "durability": 100,
    "charges": null,
    "effects": [
      {
        "effectId": "EFX_TRIBULATION_SHIELD",
        "params": {
          "tribulationMitigationRatio": 0.3,
          "maxSupportedLayers": 6
        }
      }
    ]
  }
];

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
