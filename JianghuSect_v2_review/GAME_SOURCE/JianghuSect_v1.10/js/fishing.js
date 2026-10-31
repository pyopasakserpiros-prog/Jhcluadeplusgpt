/* fishing.js — ระบบธารน้ำปราณทักษิณ การตกปลา นิเวศปลา 10 ชนิด หีบปริศนาใต้น้ำ (90/10 & 50/49.5/0.5)
 * การทำอาหาร/โอสถจากปลา บัฟอาหารทิพย์ และการตัดสินใจของ NPC (v1.12.3) */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js');
  const HC = g.HC, MAP = g.MAP, CULT = g.CULT, ECO = g.ECO, SECT = g.SECT, AI = g.AI, JD = g.JD, CPE = g.CPE;
  const clamp = U.clamp;
  const E = (n, p) => HC.eff(n, p);

  const FISHING = { VERSION: '1.12.3' };

  /* ============================================================================
   * 1. เขตแหล่งน้ำและนิเวศประชากรปลา (Bounded Zone Pools & Recovery)
   * ============================================================================ */
  const ZONES = {
    spirit_pond: {
      id: 'spirit_pond',
      bkey: 'spirit_pond',
      nameTh: 'สระธารวิญญาณ (ในสำนัก)',
      maxStock: 18,
      dailyRegen: 6,
      danger: 0,
      maxTier: 3,
      descTh: 'สระน้ำพุวิญญาณภายในกำแพงสำนัก ปลอดภัยและเงียบสงบ มีปลาลำธารและปลาหลีฮื้อหยกอาศัยอยู่'
    },
    river_west: {
      id: 'river_west',
      bkey: 'river_west',
      nameTh: 'คุ้งน้ำไผ่หยก (ธารใต้ฝั่งตะวันตก)',
      maxStock: 32,
      dailyRegen: 10,
      danger: 1,
      maxTier: 4,
      descTh: 'คุ้งน้ำตื้นร่มไผ่ทางตะวันตกของธารน้ำปราณทักษิณ ชุกชุมด้วยปลาสำหรับทำอาหารและปลาสมุนไพร'
    },
    river_central: {
      id: 'river_central',
      bkey: 'river_dock',
      nameTh: 'ท่าน้ำธารปราณทักษิณ (ธารใต้ตอนกลาง)',
      maxStock: 38,
      dailyRegen: 12,
      danger: 1,
      maxTier: 5,
      descTh: 'ท่าน้ำไม้และสะพานหลักข้ามธารน้ำปราณทักษิณ กระแสน้ำหมุนเวียนอุดมสมบูรณ์และมีโอกาสพบหีบปริศนาที่พัดมากับน้ำ'
    },
    river_east: {
      id: 'river_east',
      bkey: 'river_east',
      nameTh: 'วังน้ำศิลาคราม (ธารใต้ฝั่งตะวันออก)',
      maxStock: 28,
      dailyRegen: 9,
      danger: 2,
      maxTier: 5,
      descTh: 'วังน้ำลึกและโขดหินปราณทางตะวันออก แหล่งอาศัยของปลาดาราเก้าจุดและปลามังกรหนวดหยกหายาก'
    }
  };
  FISHING.ZONES = ZONES;

  /* ============================================================================
   * 2. บัญชีสายพันธุ์ปลา 10 ชนิด (Tiers 1–5) + ไอเทมหีบปริศนา & เศษซากใต้น้ำ
   * ============================================================================ */
  const SPECIES = [
    {
      id: 'MAT_FISH_SILVER_CARP_1',
      nameTh: 'ปลาตะเพียนเงินลำธาร',
      category: 'FISH',
      subCategory: 'COOKING_FISH',
      tier: 1,
      rarity: 'Common',
      value: 6,
      mealYield: 3,
      catchWeight: 36,
      minSkill: 0,
      habitats: ['spirit_pond', 'river_west', 'river_central', 'river_east'],
      preferredSeasons: [0, 1, 2],
      preferredWeather: ['clear', 'cloud', 'rain'],
      preferredTime: ['morning', 'day', 'dusk'],
      recipes: ['FOOD_STEAMED_SPIRIT_FISH', 'CANTEEN_MEAL'],
      iconCell: 'fish_common_silver',
      descTh: 'ปลาเกล็ดเงินเนื้อนุ่มที่พบได้ชุกชุมในสระวิญญาณและคุ้งน้ำตื้น ใช้ปรุงอาหารในโรงครัวทดแทนข้าวสารหรือนึ่งขิงบำรุงกำลัง'
    },
    {
      id: 'MAT_FISH_BAMBOO_GUDGEON_1',
      nameTh: 'ปลาซิวไผ่หยก',
      category: 'FISH',
      subCategory: 'COOKING_FISH',
      tier: 1,
      rarity: 'Common',
      value: 7,
      mealYield: 3,
      catchWeight: 32,
      minSkill: 0,
      habitats: ['spirit_pond', 'river_west', 'river_central'],
      preferredSeasons: [0, 1],
      preferredWeather: ['clear', 'cloud'],
      preferredTime: ['morning', 'day'],
      recipes: ['FOOD_STEAMED_SPIRIT_FISH', 'CANTEEN_MEAL'],
      iconCell: 'fish_common_jade',
      descTh: 'ปลาตัวเล็กสีเขียวมรกตที่ชอบว่ายทวนน้ำใต้ร่มไผ่ มีกลิ่นหอมใบไผ่อ่อน ช่วยเจริญอาหารและคลายความอ่อนล้า'
    },
    {
      id: 'MAT_FISH_GOLDEN_PERCH_2',
      nameTh: 'ปลากะพงเกล็ดทอง',
      category: 'FISH',
      subCategory: 'COOKING_FISH',
      tier: 2,
      rarity: 'Refined',
      value: 16,
      mealYield: 4,
      catchWeight: 22,
      minSkill: 4,
      habitats: ['spirit_pond', 'river_west', 'river_central'],
      preferredSeasons: [1, 2],
      preferredWeather: ['clear', 'cloud'],
      preferredTime: ['day', 'dusk'],
      recipes: ['FOOD_STEAMED_SPIRIT_FISH', 'CANTEEN_MEAL'],
      iconCell: 'fish_refined_gold',
      descTh: 'ปลาน้ำจืดเนื้อแน่นเกล็ดสะท้อนแสงทอง อุดมด้วยปราณธาตุดินและทอง บำรุงกำลังกายและฟื้นฟูความเหนื่อยล้าจากการฝึกยุทธ์'
    },
    {
      id: 'MAT_FISH_MIST_CATFISH_2',
      nameTh: 'ปลากดหมอกคราม',
      category: 'FISH',
      subCategory: 'MEDICINAL_FISH',
      tier: 2,
      rarity: 'Refined',
      value: 18,
      mealYield: 4,
      catchWeight: 20,
      minSkill: 5,
      habitats: ['river_west', 'river_central', 'river_east'],
      preferredSeasons: [0, 2],
      preferredWeather: ['rain', 'fog', 'cloud'],
      preferredTime: ['dusk', 'night'],
      recipes: ['FOOD_EEL_VITALITY_BROTH'],
      iconCell: 'fish_refined_catfish',
      descTh: 'ปลาหนังลื่นที่ออกหากินยามหมอกลงจัดและฝนพรำ เนื้อและเมือกมีสรรพคุณสมานแผลและคลายความตึงเครียดของเส้นชีพจร'
    },
    {
      id: 'MAT_FISH_JADE_KOI_3',
      nameTh: 'ปลาหลีฮื้อหยกขาว',
      category: 'FISH',
      subCategory: 'SPIRIT_FISH',
      tier: 3,
      rarity: 'Rare',
      value: 38,
      mealYield: 5,
      catchWeight: 12,
      minSkill: 10,
      habitats: ['spirit_pond', 'river_central', 'river_east'],
      preferredSeasons: [0, 2],
      preferredWeather: ['clear', 'fog'],
      preferredTime: ['morning', 'day'],
      recipes: ['FOOD_JADE_KOI_SOUP', 'REC_FISH_GALL_CLARITY_3'],
      iconCell: 'fish_rare_koi',
      descTh: 'ปลาหลีฮื้อสีขาวพิสุทธิ์ดั่งหยกมันแพะ ซึมซับไอปราณจากตาน้ำวิญญาณ ช่วยชำระจิตมารและเสริมสมาธิในการศึกษาคัมภีร์'
    },
    {
      id: 'MAT_FISH_SPIRIT_EEL_3',
      nameTh: 'ปลาไหลปราณวารี',
      category: 'FISH',
      subCategory: 'MEDICINAL_FISH',
      tier: 3,
      rarity: 'Rare',
      value: 42,
      mealYield: 5,
      catchWeight: 11,
      minSkill: 12,
      habitats: ['river_west', 'river_east'],
      preferredSeasons: [0, 1],
      preferredWeather: ['rain', 'cloud', 'fog'],
      preferredTime: ['dusk', 'night'],
      recipes: ['FOOD_EEL_VITALITY_BROTH', 'REC_FISH_GALL_CLARITY_3'],
      iconCell: 'fish_rare_eel',
      descTh: 'ปลาไหลลำตัวยาวที่มีกระแสปราณธาตุน้ำไหลเวียนในโลหิต ใช้ต้มน้ำแกงบำรุงโลหิตและฟื้นฟูพลังปราณของผู้บาดเจ็บ'
    },
    {
      id: 'MAT_FISH_STARLIGHT_TROUT_4',
      nameTh: 'ปลาดาราเก้าจุด',
      category: 'FISH',
      subCategory: 'ALCHEMY_FISH',
      tier: 4,
      rarity: 'Exceptional',
      value: 85,
      mealYield: 6,
      catchWeight: 5.5,
      minSkill: 18,
      habitats: ['river_central', 'river_east'],
      preferredSeasons: [2, 3],
      preferredWeather: ['clear', 'snow'],
      preferredTime: ['dusk', 'night'],
      recipes: ['FOOD_JADE_KOI_SOUP', 'REC_FISH_GALL_CLARITY_3'],
      iconCell: 'fish_exc_starlight',
      descTh: 'ปลาหายากในวังน้ำลึกที่มีจุดแสงเก้าดาวเรียงตัวบนแผ่นหลัง ดีปลาและไข่มุกในหัวใช้หลอมโอสถเปิดจุดชีพจรและเร่งความเข้าใจวิชา'
    },
    {
      id: 'MAT_FISH_CRIMSON_LOTUS_CARP_4',
      nameTh: 'ปลาชาดบัวสวรรค์',
      category: 'FISH',
      subCategory: 'ALCHEMY_FISH',
      tier: 4,
      rarity: 'Exceptional',
      value: 92,
      mealYield: 6,
      catchWeight: 5.0,
      minSkill: 20,
      habitats: ['river_west', 'river_central'],
      preferredSeasons: [0, 1],
      preferredWeather: ['clear', 'rain'],
      preferredTime: ['morning', 'day'],
      recipes: ['FOOD_JADE_KOI_SOUP', 'REC_DRAGON_CARP_MARROW_5'],
      iconCell: 'fish_exc_crimson',
      descTh: 'ปลาเกล็ดสีชาดสดที่กินกลีบบัวปราณเป็นอาหาร มีฤทธิ์หยางอบอุ่นบริสุทธิ์ ช่วยขับพิษสะสมและเสริมพลังชีวิตอย่างยิ่งยวด'
    },
    {
      id: 'MAT_FISH_DRAGON_WHISKER_CARP_5',
      nameTh: 'ปลามังกรหนวดหยก',
      category: 'FISH',
      subCategory: 'APEX_SPIRIT_FISH',
      tier: 5,
      rarity: 'Exceptional',
      value: 195,
      mealYield: 8,
      catchWeight: 2.0,
      minSkill: 28,
      habitats: ['river_east'],
      preferredSeasons: [0, 1],
      preferredWeather: ['rain', 'fog'],
      preferredTime: ['morning', 'dusk'],
      recipes: ['FOOD_DRAGON_CARP_BANQUET', 'REC_DRAGON_CARP_MARROW_5'],
      iconCell: 'fish_apex_dragon',
      descTh: 'ราชาแห่งวังน้ำศิลาครามผู้มีหนวดยาวดุจมังกรและเกล็ดแข็งแกร่งดั่งหยกโบราณ แก่นโลหิตใช้หลอมโอสถชำระไขกระดูกและหนุนการทะลวงคอขวด'
    },
    {
      id: 'MAT_FISH_FROST_JADE_STURGEON_5',
      nameTh: 'ปลาสเตอร์เจียนหยกเหมันต์',
      category: 'FISH',
      subCategory: 'APEX_SPIRIT_FISH',
      tier: 5,
      rarity: 'Exceptional',
      value: 210,
      mealYield: 8,
      catchWeight: 1.8,
      minSkill: 30,
      habitats: ['river_central', 'river_east'],
      preferredSeasons: [2, 3],
      preferredWeather: ['snow', 'fog', 'clear'],
      preferredTime: ['night', 'morning'],
      recipes: ['FOOD_DRAGON_CARP_BANQUET', 'REC_DRAGON_CARP_MARROW_5'],
      iconCell: 'fish_apex_sturgeon',
      descTh: 'ปลาโบราณแห่งกระแสน้ำเย็นยะเยือกใต้ธารปราณทักษิณ ไขกระดูกเยือกแข็งบริสุทธิ์ช่วยสงบจิตมารขั้นลึกและเสริมรากฐานวิญญาณ'
    }
  ];

  const SPECIAL_ITEMS = [
    {
      id: 'ITEM_MYSTERY_RIVER_CONTAINER',
      nameTh: 'หีบไม้โบราณแช่น้ำ',
      category: 'CONTAINER',
      tier: 3,
      rarity: 'Rare',
      value: 0,
      noShopReward: true,
      iconCell: 'mystery_river_box',
      descTh: 'หีบไม้และถุงแพรปิดผนึกที่ถูกกระแสน้ำพัดพามาติดเบ็ด สามารถเปิดดูสิ่งของภายในได้ (โอกาส 50% เป็นเศษซากใต้น้ำ, 49.5% ของทั่วไปตามลำดับขั้น, 0.5% ของระดับตำนาน)'
    },
    {
      id: 'TRASH_RIVER_DEBRIS',
      nameTh: 'เศษซากใต้น้ำไร้ค่า',
      category: 'TRASH',
      tier: 1,
      rarity: 'Common',
      value: 0,
      worthless: true,
      noShopReward: true,
      iconCell: 'river_trash_debris',
      descTh: 'เศษไม้ผุพัง กรวดโคลน และซากผ้าขาดวิ่นที่เปื่อยยุ่ยอยู่ในน้ำ ไม่มีมูลค่าซื้อขายหรือแลกเปลี่ยนแต้มคุณูปการ สามารถทิ้งทำลายได้ทันที'
    }
  ];

  /* ============================================================================
   * 3. ตำรับอาหารปลาและโอสถจากปลา (Culinary Dishes & Alchemy Recipes)
   * ============================================================================ */
  const FISH_DISHES = [
    {
      id: 'FOOD_STEAMED_SPIRIT_FISH',
      nameTh: 'ปลานึ่งขิงปราณหอม',
      category: 'FOOD',
      tier: 1,
      rarity: 'Common',
      value: 14,
      satietyGain: 34,
      moodGain: 4,
      stressRelief: 2,
      inputs: [{ fishTiers: [1, 2], count: 1 }],
      buff: {
        id: 'food_nourish',
        nameTh: 'ปราณอาหารอุ่นกาย',
        durationTicks: 360,
        hpRegenMult: 1.12,
        energySaveMult: 0.88,
        descTh: 'ฟื้นฟูพลังกายและพลังชีวิตตามธรรมชาติเร็วขึ้น +12% และเหนื่อยช้าลง 12% นาน 6 ชั่วโมง'
      },
      iconCell: 'dish_steamed_fish',
      descTh: 'ปลาสดจากลำธารนึ่งกับขิงแก่และต้นหอมวิญญาณ เนื้อหวานนุ่มชุ่มฉ่ำ ช่วยให้อิ่มท้องและฟื้นฟูเรี่ยวแรงได้อย่างต่อเนื่อง'
    },
    {
      id: 'FOOD_EEL_VITALITY_BROTH',
      nameTh: 'ซุปปลาไหลปราณบำรุงโลหิต',
      category: 'FOOD',
      tier: 2,
      rarity: 'Refined',
      value: 32,
      satietyGain: 38,
      moodGain: 5,
      stressRelief: 3,
      hpRestorePct: 0.10,
      qiRestorePct: 0.12,
      inputs: [{ fishIds: ['MAT_FISH_MIST_CATFISH_2', 'MAT_FISH_SPIRIT_EEL_3'], count: 1 }],
      buff: {
        id: 'food_qi_flow',
        nameTh: 'กระแสปราณวารีไหลเวียน',
        durationTicks: 420,
        cultRateMult: 1.08,
        qiRegenMult: 1.14,
        injuryHealBonus: 0.12,
        descTh: 'กระตุ้นการไหลเวียนของปราณและโลหิต ฟื้นปราณ +14% บ่มเพาะ +8% และสมานแผลเร็วขึ้นนาน 7 ชั่วโมง'
      },
      iconCell: 'dish_eel_broth',
      descTh: 'น้ำแกงเคี่ยวจากปลาไหลปราณวารีหรือปลากดหมอกคราม รสชาติกลมกล่อมล้ำลึก ช่วยบำรุงโลหิตและเสริมการหมุนเวียนลมปราณ'
    },
    {
      id: 'FOOD_JADE_KOI_SOUP',
      nameTh: 'แกงจืดปลาหยกบัวสวรรค์',
      category: 'FOOD',
      tier: 3,
      rarity: 'Rare',
      value: 56,
      satietyGain: 36,
      moodGain: 7,
      stressRelief: 5,
      heartDemonRelief: 3,
      inputs: [{ fishIds: ['MAT_FISH_JADE_KOI_3', 'MAT_FISH_STARLIGHT_TROUT_4', 'MAT_FISH_CRIMSON_LOTUS_CARP_4'], count: 1 }],
      buff: {
        id: 'food_focus',
        nameTh: 'จิตกระจ่างรสทิพย์',
        durationTicks: 420,
        studyMult: 1.12,
        stressGainMult: 0.80,
        descTh: 'ช่วยให้จิตใจสงบนิ่ง ศึกษาคัมภีร์และฝึกทักษะเร็วขึ้น +12% และลดความเครียดสะสมลง 20% นาน 7 ชั่วโมง'
      },
      iconCell: 'dish_koi_soup',
      descTh: 'น้ำแกงใสบริสุทธิ์ปรุงจากปลาหลีฮื้อหยกขาวหรือปลาดารา ช่วยชำระความฟุ้งซ่านในจิตใจและเพิ่มสมาธิในการศึกษาวิชา'
    },
    {
      id: 'FOOD_DRAGON_CARP_BANQUET',
      nameTh: 'หม้อไฟปลามังกรหยกทิพย์',
      category: 'FOOD',
      tier: 5,
      rarity: 'Exceptional',
      value: 145,
      satietyGain: 45,
      moodGain: 11,
      stressRelief: 8,
      heartDemonRelief: 5,
      hpRestorePct: 0.16,
      qiRestorePct: 0.18,
      inputs: [{ fishIds: ['MAT_FISH_DRAGON_WHISKER_CARP_5', 'MAT_FISH_FROST_JADE_STURGEON_5'], count: 1 }],
      buff: {
        id: 'food_dragon_vitality',
        nameTh: 'ปราณมังกรวารีหนุนกาย',
        durationTicks: 480,
        hpRegenMult: 1.18,
        qiRegenMult: 1.18,
        cultRateMult: 1.12,
        studyMult: 1.12,
        descTh: 'อาหารมงคลชั้นเลิศ ฟื้นฟูกายและปราณ +18% และหนุนการบ่มเพาะ/ศึกษาวิชา +12% นาน 8 ชั่วโมง'
      },
      iconCell: 'dish_dragon_banquet',
      descTh: 'อาหารจานเอกที่เคี่ยวจากปลามังกรหนวดหยกหรือปลาสเตอร์เจียนหยกเหมันต์ อัดแน่นด้วยปราณวารีบริสุทธิ์ที่ช่วยชะล้างความเหนื่อยล้าและจิตมาร'
    }
  ];

  const ALCHEMY_FISH_RECIPES = [
    {
      id: 'REC_FISH_GALL_CLARITY_3',
      nameTh: 'ตำรับโอสถดีปลาหยกกระจ่างจิต',
      outNameTh: 'โอสถดีปลาหยกกระจ่างจิต',
      craft: 'ALCHEMY',
      outType: 'PILL',
      fishAlchemyRecipe: true,
      tier: 3,
      minMastery: 18,
      yield: 2,
      compatiblePath: ['ANY'],
      inputs: [
        { matId: 'MAT_FISH_JADE_KOI_3', count: 1 },
        { matId: 'MAT_HERB_JADE_LOTUS_2', count: 1 }
      ],
      effect: {
        clearHeartDemon: 26,
        clearToxic: 18,
        insight: 1.32,
        cultivationProgress: 38
      },
      descTh: 'หลอมจากดีปลาหลีฮื้อหยกขาวและบัวหยก ช่วยขจัดจิตมาร ถอนพิษสะสม และเปิดความเข้าใจในการศึกษาวิชา'
    },
    {
      id: 'REC_DRAGON_CARP_MARROW_5',
      nameTh: 'ตำรับโอสถไขกระดูกปลามังกร',
      outNameTh: 'โอสถไขกระดูกปลามังกรทะลวงขั้น',
      craft: 'ALCHEMY',
      outType: 'PILL',
      fishAlchemyRecipe: true,
      tier: 5,
      minMastery: 42,
      yield: 1,
      compatiblePath: ['ANY'],
      inputs: [
        { matId: 'MAT_FISH_DRAGON_WHISKER_CARP_5', count: 1 },
        { matId: 'MAT_HERB_BLOOD_GINSENG_3', count: 1 }
      ],
      effect: {
        cultivationProgress: 115,
        breakthroughBonus: 0.16,
        healHealth: 45,
        healInjury: 35
      },
      descTh: 'โอสถชั้นสูงที่หลอมจากไขกระดูกปลามังกรหนวดหยกและโสมโลหิต ช่วยเสริมตบะขนานใหญ่และเพิ่มโอกาสทะลวงคอขวด'
    }
  ];

  const FISH_EL_PROFILES = {
    MAT_FISH_SILVER_CARP_1: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 1 } } },
    MAT_FISH_BAMBOO_GUDGEON_1: { el: 'WOOD_LIFE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WOOD_LIFE', weights: { WOOD_LIFE: 0.6, WATER_ICE: 0.4 } } },
    MAT_FISH_GOLDEN_PERCH_2: { el: 'EARTH_METAL', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'EARTH_METAL', weights: { EARTH_METAL: 0.6, WATER_ICE: 0.4 } } },
    MAT_FISH_MIST_CATFISH_2: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 0.65, WOOD_LIFE: 0.35 } } },
    MAT_FISH_JADE_KOI_3: { el: 'LIGHT_YANG', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'LIGHT_YANG', weights: { LIGHT_YANG: 0.6, WATER_ICE: 0.4 } } },
    MAT_FISH_SPIRIT_EEL_3: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 1 } } },
    MAT_FISH_STARLIGHT_TROUT_4: { el: 'ASTRAL', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'ASTRAL', weights: { ASTRAL: 0.65, WATER_ICE: 0.35 } } },
    MAT_FISH_CRIMSON_LOTUS_CARP_4: { el: 'FIRE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'FIRE', weights: { FIRE: 0.6, WOOD_LIFE: 0.4 } } },
    MAT_FISH_DRAGON_WHISKER_CARP_5: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 0.65, EARTH_METAL: 0.35 } } },
    MAT_FISH_FROST_JADE_STURGEON_5: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 1 } } },
    ITEM_MYSTERY_RIVER_CONTAINER: { el: 'WATER_ICE', profile: { mode: 'EXPLICIT_NON_ELEMENTAL', primary: 'NEUTRAL', weights: {} } },
    TRASH_RIVER_DEBRIS: { el: 'NEUTRAL', profile: { mode: 'EXPLICIT_NON_ELEMENTAL', primary: 'NEUTRAL', weights: {} } },
    FOOD_STEAMED_SPIRIT_FISH: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 0.6, WOOD_LIFE: 0.4 } } },
    FOOD_EEL_VITALITY_BROTH: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 0.7, WOOD_LIFE: 0.3 } } },
    FOOD_JADE_KOI_SOUP: { el: 'LIGHT_YANG', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'LIGHT_YANG', weights: { LIGHT_YANG: 0.6, WATER_ICE: 0.4 } } },
    FOOD_DRAGON_CARP_BANQUET: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 0.7, LIGHT_YANG: 0.3 } } },
    REC_FISH_GALL_CLARITY_3: { el: 'LIGHT_YANG', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'LIGHT_YANG', weights: { LIGHT_YANG: 0.6, WOOD_LIFE: 0.4 } } },
    REC_DRAGON_CARP_MARROW_5: { el: 'WATER_ICE', profile: { mode: 'ELEMENT_LINK_ONLY', primary: 'WATER_ICE', weights: { WATER_ICE: 0.65, WOOD_LIFE: 0.35 } } }
  };
  [...SPECIES, ...SPECIAL_ITEMS, ...FISH_DISHES, ...ALCHEMY_FISH_RECIPES].forEach(entry => {
    const ep = FISH_EL_PROFILES[entry.id];
    if (ep) {
      entry.element = ep.el;
      entry.elementProfile = ep.profile;
    }
  });
  FISHING.SPECIES = SPECIES;
  FISHING.SPECIES_BY_ID = Object.fromEntries(SPECIES.map(s => [s.id, s]));
  FISHING.SPECIAL_ITEMS = SPECIAL_ITEMS;
  FISHING.SPECIAL_BY_ID = Object.fromEntries(SPECIAL_ITEMS.map(s => [s.id, s]));
  FISHING.FISH_DISHES = FISH_DISHES;
  FISHING.DISH_BY_ID = Object.fromEntries(FISH_DISHES.map(d => [d.id, d]));
  FISHING.ALCHEMY_FISH_RECIPES = ALCHEMY_FISH_RECIPES;

  // ลงทะเบียนปลา หีบปริศนา เศษซากใต้น้ำ อาหารปลา และตำรับโอสถปลา เข้าสู่แคตตาล็อกกลาง (JD & ECO) อย่างปลอดภัย
  function registerCatalogEntries() {
    if (!JD || !JD.ITEMS || !ECO) return;
    const allMats = [...SPECIES, ...SPECIAL_ITEMS, ...FISH_DISHES];
    allMats.forEach(entry => {
      if (!ECO.matById[entry.id]) {
        ECO.matById[entry.id] = entry;
      }
      if (!ECO.itemById[entry.id]) {
        ECO.itemById[entry.id] = entry;
      }
    });
    ALCHEMY_FISH_RECIPES.forEach(r => {
      if (!JD.ITEMS.recipes.some(x => x.id === r.id)) {
        JD.ITEMS.recipes.push(r);
      }
      ECO.recipeById[r.id] = r;
    });
  }
  registerCatalogEntries();

  FISHING.isFish = id => !!(id && FISHING.SPECIES_BY_ID[id]);
  FISHING.isFishDish = id => !!(id && FISHING.DISH_BY_ID[id]);
  FISHING.isMysteryContainer = id => id === 'ITEM_MYSTERY_RIVER_CONTAINER';
  FISHING.isRiverTrash = id => id === 'TRASH_RIVER_DEBRIS';

  /* ============================================================================
   * 4. ตารางความน่าจะเป็นของการตกปลาและหีบปริศนาใต้น้ำ (Sections 6, 7 & 8)
   * ============================================================================ */
  // 4.1 ผลลัพธ์เมื่อตกได้สำเร็จ (Completed Successful Catch): ปลา 90% / หีบปริศนา 10%
  FISHING.CATCH_OUTCOME_PROBS = Object.freeze({
    FISH: 0.90,
    MYSTERY_CONTAINER: 0.10
  });

  // 4.2 ผลลัพธ์เมื่อเปิดหีบปริศนา (Container Opening): ขยะไร้ค่า 50.0% / ของทั่วไป 49.5% / ของตำนาน 0.5%
  FISHING.CONTAINER_BRANCH_PROBS = Object.freeze({
    TRASH: 0.500,
    ORDINARY: 0.495,
    LEGENDARY: 0.005
  });

  // 4.3 น้ำหนักหมวดของทั่วไป (Ordinary Loot Category Weights)
  // รักษาลำดับ строго: Pills (0.28) > Equipment (0.22) > Materials (0.16) > Technique Crystals (0.14) > Subpath Crystals (0.09) > Technique Manuals (0.07) > Subpath Manuals (0.04)
  FISHING.ORDINARY_CATEGORY_WEIGHTS = Object.freeze({
    PILL: 0.28,
    EQUIPMENT: 0.22,
    MATERIAL: 0.16,
    TECH_CRYSTAL: 0.14,
    SUB_CRYSTAL: 0.09,
    TECH_MANUAL: 0.07,
    SUB_MANUAL: 0.04
  });

  // 4.4 ตารางความน่าจะเป็นตามจำนวนขั้นสูงสุดของแต่ละหมวด (4, 5, 6 และ 7 ขั้น)
  // ทุกตารางรวมเป็น 1.0000, เรียงลดหลั่น P(T1) > P(T2) > ... > P(Tk) > 0 และขั้นสูงสุดหาได้ยากจริง (1.2% - 3.5%)
  FISHING.ORDINARY_TIER_TABLES = Object.freeze({
    4: Object.freeze({ 1: 0.5600, 2: 0.2800, 3: 0.1250, 4: 0.0350 }),
    5: Object.freeze({ 1: 0.5000, 2: 0.2650, 3: 0.1350, 4: 0.0700, 5: 0.0300 }),
    6: Object.freeze({ 1: 0.4600, 2: 0.2550, 3: 0.1400, 4: 0.0800, 5: 0.0450, 6: 0.0200 }),
    7: Object.freeze({ 1: 0.4400, 2: 0.2500, 3: 0.1450, 4: 0.0820, 5: 0.0460, 6: 0.0250, 7: 0.0120 })
  });

  // จำนวนขั้นที่ใช้จริงของแต่ละหมวดในหีบของทั่วไป (4 ขั้นสำหรับสายย่อย, 5 ขั้นสำหรับอุปกรณ์ทั่วไป, 7 ขั้นสำหรับโอสถ/วัตถุดิบ/วิชา)
  FISHING.CATEGORY_TIER_COUNTS = Object.freeze({
    PILL: 7,
    EQUIPMENT: 5,
    MATERIAL: 7,
    TECH_CRYSTAL: 7,
    SUB_CRYSTAL: 4,
    TECH_MANUAL: 7,
    SUB_MANUAL: 4
  });

  // จัดลำดับความหายาก 4 ขั้น (Rarity Tier 1..4) ของสายย่อยทั้ง 37 สายสำหรับการสุ่มหีบปริศนา
  // (โดยไม่กระทบค่า k.tier = 1..2 ที่ใช้ตรวจสิทธิ์หอคัมภีร์ใน studySubpath)
  const SUBPATH_LOOT_TIER = Object.freeze({
    // Tier 1 (15 สายพื้นฐานหลัก)
    SWORD_IMMORTAL: 1, FIVE_ELEMENTS: 1, ELIXIR_DAO: 1, ASTRAL_ARRAY: 1,
    TIGER_SOVEREIGN: 1, VAJRA_BODHI: 1, SOLAR_FORGE: 1, WOOD_SPRING_BODY: 1,
    WAR_DEITY: 1, MERCY_DEITY: 1, HARVEST_EARTH_GOD: 1, MEDICINE_BODHI_GOD: 1,
    SHADOW_ASSASSIN: 1, ZEN_VOID_MIND: 1, CALLIGRAPHY_PAINTING_SAGE: 1,
    // Tier 2 (12 สายเฉพาะทางธาตุและกายา)
    BLOOD_DEMON: 2, PHANTOM_SOUL: 2, SOUND_ZITHER: 2, YIN_YANG_HARMONY: 2,
    BLOOD_DRAGON: 2, THUNDER_BODY: 2, JADE_IMMORTAL_BODY: 2, TITAN_MOUNTAIN_BODY: 2,
    TOTEM_BEAST_GOD: 2, OCEAN_SOVEREIGN: 2, VENOM_GU_SOVEREIGN: 2, NETHER_GHOST_KING: 2,
    // Tier 3 (6 สายลี้ลับและสายเสริมยุทธภพ)
    FROST_MOON_IMMORTAL: 3, STAR_ARCHER: 3, DEVOURING_FIEND: 3, STAFF_GUARD: 3,
    FATE_ORACLE: 3, TIME_VOID: 3,
    // Tier 4 (4 สายยอดวิชาล้ำลึกหายาก)
    UNDERWORLD_JUDGE: 4, HEAVEN_DEVOURING_DEMON: 4, DREAM_ILLUSION_WEAVER: 4, MIND_SWORD_TELEKINESIS: 4
  });
  FISHING.SUBPATH_LOOT_TIER = SUBPATH_LOOT_TIER;

  FISHING.getTierProbabilityTable = tierCount => {
    const k = Number(tierCount) || 7;
    if (FISHING.ORDINARY_TIER_TABLES[k]) return FISHING.ORDINARY_TIER_TABLES[k];
    // สำหรับจำนวนขั้นอื่น ๆ คำนวณแบบเรขาคณิตลดหลั่นที่ปรับให้ขั้นสูงสุด <= 4%
    const r = 0.52;
    const raw = {};
    let sum = 0;
    for (let i = 1; i <= k; i++) {
      raw[i] = Math.pow(r, i - 1);
      sum += raw[i];
    }
    const out = {};
    let acc = 0;
    for (let i = 1; i <= k; i++) {
      out[i] = i === k ? +(1 - acc).toFixed(6) : +(raw[i] / sum).toFixed(6);
      acc += out[i];
    }
    return out;
  };

  FISHING.getFullProbabilitySpec = () => {
    const catProbs = {};
    for (const [cat, cWeight] of Object.entries(FISHING.ORDINARY_CATEGORY_WEIGHTS)) {
      const k = FISHING.CATEGORY_TIER_COUNTS[cat] || 7;
      const tTable = FISHING.getTierProbabilityTable(k);
      const tiers = {};
      for (const [t, tProb] of Object.entries(tTable)) {
        const pGivenOrdinary = +(cWeight * tProb).toFixed(7);
        const pGivenContainer = +(FISHING.CONTAINER_BRANCH_PROBS.ORDINARY * pGivenOrdinary).toFixed(8);
        const pGivenCatch = +(FISHING.CATCH_OUTCOME_PROBS.MYSTERY_CONTAINER * pGivenContainer).toFixed(9);
        tiers[t] = {
          tier: Number(t),
          condOnCategory: tProb,
          condOnOrdinaryBranch: pGivenOrdinary,
          condOnContainerOpen: pGivenContainer,
          perSuccessfulCatch: pGivenCatch
        };
      }
      catProbs[cat] = {
        category: cat,
        tierCount: k,
        condOnOrdinaryBranch: cWeight,
        condOnContainerOpen: +(FISHING.CONTAINER_BRANCH_PROBS.ORDINARY * cWeight).toFixed(6),
        perSuccessfulCatch: +(FISHING.CATCH_OUTCOME_PROBS.MYSTERY_CONTAINER * FISHING.CONTAINER_BRANCH_PROBS.ORDINARY * cWeight).toFixed(7),
        tiers
      };
    }
    return {
      version: FISHING.VERSION,
      catchOutcomes: FISHING.CATCH_OUTCOME_PROBS,
      containerBranches: FISHING.CONTAINER_BRANCH_PROBS,
      nominalLegendaryPerCatch: +(FISHING.CATCH_OUTCOME_PROBS.MYSTERY_CONTAINER * FISHING.CONTAINER_BRANCH_PROBS.LEGENDARY).toFixed(6),
      tierTablesByCount: FISHING.ORDINARY_TIER_TABLES,
      categories: catProbs
    };
  };

  /* ============================================================================
   * 5. การจัดการสถานะโลกและการอัปเกรดเซฟเก่า (World State & Idempotent Migration)
   * ============================================================================ */
  FISHING.ensure = (W, fullSync) => {
    if (!W) return null;
    if (!fullSync && W.fishing && W.fishing._ensuredDay === W.day && W.fishing.zones && W.fishing.zones.river_central) {
      return W.fishing;
    }
    registerCatalogEntries();
    if (!W.fishing || typeof W.fishing !== 'object' || Array.isArray(W.fishing)) {
      W.fishing = {
        version: FISHING.VERSION,
        zones: {},
        stats: {
          attempts: 0,
          successfulCatches: 0,
          fishCaught: 0,
          containersCaught: 0,
          containersOpened: 0,
          trashOpened: 0,
          ordinaryOpened: 0,
          legendaryOpened: 0,
          legendaryFallbackUsed: 0,
          fishCookedMeals: 0,
          fishDishesCooked: 0,
          fishDishesEaten: 0,
          fishDonated: 0,
          fishSoldStones: 0,
          bySpecies: {},
          byCategory: {},
          byTier: {}
        },
        containerReceipts: {},
        receiptSeq: 0,
        lastMigratedDay: W.day || 0
      };
    }
    const f = W.fishing;
    if (!f.zones || typeof f.zones !== 'object') f.zones = {};
    for (const [zid, zdef] of Object.entries(ZONES)) {
      if (!f.zones[zid] || typeof f.zones[zid] !== 'object') {
        f.zones[zid] = {
          id: zid,
          stock: zdef.maxStock,
          maxStock: zdef.maxStock,
          dailyRegen: zdef.dailyRegen,
          totalCaught: 0,
          lastFishedTick: -9999
        };
      } else {
        f.zones[zid].maxStock = zdef.maxStock;
        f.zones[zid].dailyRegen = zdef.dailyRegen;
        if (!Number.isFinite(f.zones[zid].stock)) f.zones[zid].stock = zdef.maxStock;
        f.zones[zid].stock = clamp(f.zones[zid].stock, 0, zdef.maxStock);
      }
    }
    if (!f.stats || typeof f.stats !== 'object') f.stats = {};
    ['attempts', 'successfulCatches', 'fishCaught', 'containersCaught', 'containersOpened', 'trashOpened', 'ordinaryOpened', 'legendaryOpened', 'legendaryFallbackUsed', 'fishCookedMeals', 'fishDishesCooked', 'fishDishesEaten', 'fishDonated', 'fishSoldStones'].forEach(k => {
      if (!Number.isFinite(f.stats[k])) f.stats[k] = 0;
    });
    if (!f.stats.bySpecies || typeof f.stats.bySpecies !== 'object') f.stats.bySpecies = {};
    if (!f.stats.byCategory || typeof f.stats.byCategory !== 'object') f.stats.byCategory = {};
    if (!f.stats.byTier || typeof f.stats.byTier !== 'object') f.stats.byTier = {};
    if (!f.containerReceipts || typeof f.containerReceipts !== 'object') f.containerReceipts = {};
    if (!Number.isFinite(f.receiptSeq)) f.receiptSeq = 0;
    if (!f.npcData || typeof f.npcData !== 'object') f.npcData = {};

    if (Array.isArray(W.npcs)) {
      W.npcs.forEach(n => FISHING.ensureNpc(n, W));
    }
    Object.defineProperty(f, '_ensuredDay', { value: W.day, enumerable: false, configurable: true, writable: true });
    return f;
  };

  FISHING.ensureNpc = (n, W) => {
    if (!n || !n.h) return null;
    const f = W && W.fishing;
    if (f) {
      f.npcData = f.npcData || {};
      if (!f.npcData[n.id]) {
        const isFisherOrigin = n.h.origin && /ประมง|ทะเล|แม่น้ำ/.test((n.h.origin.cls || '') + ' ' + (n.h.origin.region || ''));
        const surv = Number(n.h.skills && n.h.skills.survival) || 0;
        const cook = Number(n.h.skills && n.h.skills.cooking) || 0;
        f.npcData[n.id] = {
          skill: Math.round(((isFisherOrigin ? 18 : 2) + surv * 0.25 + cook * 0.15) * 10) / 10,
          knowsRiver: true,
          knownSpecies: {},
          knownZones: { spirit_pond: true, river_central: true },
          lastFishedDay: -999
        };
      }
      return f.npcData[n.id];
    }
    return null;
  };

  FISHING.skillOf = (W, n) => {
    if (!n || !n.h) return 0;
    if (n.h.skills && Number.isFinite(n.h.skills.fishing)) return n.h.skills.fishing;
    const nd = FISHING.ensureNpc(n, W);
    return nd ? nd.skill : 5;
  };

  FISHING.knowledgeOf = (W, n) => {
    const nd = FISHING.ensureNpc(n, W);
    return nd || { skill: 5, knowsRiver: true, knownSpecies: {}, knownZones: { spirit_pond: true, river_central: true }, lastFishedDay: -999 };
  };

  /* ============================================================================
   * 6. การฟื้นฟูประชากรปลารายวัน และตัวคูณฤดูกาล/เวลา/สภาพอากาศ
   * ============================================================================ */
  FISHING.timeSlotOf = W => {
    const h = ((W ? W.t : 0) % 1440) / 60;
    if (h >= 5 && h < 9) return 'morning';
    if (h >= 9 && h < 16.5) return 'day';
    if (h >= 16.5 && h < 20) return 'dusk';
    return 'night';
  };

  FISHING.speciesMultiplier = (W, species, anglerSkill) => {
    if (!species) return 0;
    const sk = Number.isFinite(anglerSkill) ? anglerSkill : 0;
    if (sk + 6 < (species.minSkill || 0)) return 0.15; // ทักษะยังไม่ถึงเกณฑ์ โอกาสติดเบ็ดต่ำมากแต่ไม่เป็นศูนย์หากอยู่ในแหล่งน้ำเดียวกัน
    let mult = 1.0;
    const season = W && Number.isFinite(W.season) ? W.season : 0;
    const weather = (W && W.weather && W.weather.kind) || 'clear';
    const slot = FISHING.timeSlotOf(W);
    if (Array.isArray(species.preferredSeasons) && species.preferredSeasons.includes(season)) mult *= 1.25;
    if (Array.isArray(species.preferredWeather) && species.preferredWeather.includes(weather)) mult *= 1.28;
    if (Array.isArray(species.preferredTime) && species.preferredTime.includes(slot)) mult *= 1.20;
    if (species.tier >= 3) {
      mult *= clamp(0.75 + (sk - (species.minSkill || 0)) / 45, 0.55, 1.85);
    }
    return mult;
  };

  FISHING.daily = W => {
    const f = FISHING.ensure(W);
    if (!f) return;
    const season = W.season || 0;
    const weather = (W.weather && W.weather.kind) || 'clear';
    const seasonMult = season === 0 ? 1.20 : season === 1 ? 1.10 : season === 2 ? 1.0 : 0.80;
    const weatherMult = weather === 'rain' ? 1.18 : weather === 'snow' ? 0.85 : 1.0;

    for (const [zid, z] of Object.entries(f.zones)) {
      const zdef = ZONES[zid];
      if (!zdef) continue;
      const gain = Math.max(1, Math.round(zdef.dailyRegen * seasonMult * weatherMult));
      z.stock = Math.min(zdef.maxStock, (z.stock || 0) + gain);
    }

    // NPC จัดการปลา ขยะใต้น้ำ และหีบปริศนาในกระเป๋าช่วงสรุปประจำวัน
    if (Array.isArray(W.npcs)) {
      for (const n of W.npcs) {
        if (!n || n.dead || n.away || n.exiled) continue;
        FISHING.handlePostFishingInventory(W, n);
      }
    }
  };

  /* ============================================================================
   * 7. การทอยผลลัพธ์เมื่อตกปลาสำเร็จ (90% Fish / 10% Mysterious Container)
   * ============================================================================ */
  function rollWeightedMap(rng, weightMap, explicitRoll) {
    const entries = Object.entries(weightMap).filter(([, w]) => Number.isFinite(w) && w > 0);
    const total = entries.reduce((s, [, w]) => s + w, 0);
    if (total <= 0 || !entries.length) return null;
    let r = (explicitRoll != null ? explicitRoll : rng.next()) * total;
    for (const [k, w] of entries) {
      r -= w;
      if (r <= 0) return k;
    }
    return entries[entries.length - 1][0];
  }

  FISHING.pickSpeciesForZone = (W, zoneId, anglerSkill, speciesRoll) => {
    const zid = ZONES[zoneId] ? zoneId : 'river_central';
    const pool = SPECIES.filter(s => s.habitats.includes(zid));
    if (!pool.length) return SPECIES[0];
    const weights = {};
    pool.forEach(s => {
      weights[s.id] = s.catchWeight * FISHING.speciesMultiplier(W, s, anglerSkill);
    });
    const pickedId = rollWeightedMap(W.rng, weights, speciesRoll) || pool[0].id;
    return FISHING.SPECIES_BY_ID[pickedId] || pool[0];
  };

  FISHING.computeFishQuality = (W, npc, species) => {
    const sk = npc ? FISHING.skillOf(W, npc) : 0;
    const perc = npc && npc.h ? (E(npc, 'intellect.perceptiveness') || 50) : 50;
    const base = 0.88 + clamp(sk / 180, 0, 0.35) + clamp((perc - 50) / 400, -0.06, 0.12);
    const jitter = W && W.rng && W.rng.gauss ? W.rng.gauss(0, 0.05) : 0;
    return Math.round(clamp(base + jitter, 0.75, 1.45) * 100) / 100;
  };

  FISHING.addFishToBag = (npc, fishId, qty, quality) => {
    if (!npc || !FISHING.isFish(fishId)) return false;
    const n = Number.isInteger(qty) && qty > 0 ? qty : 1;
    const q = clamp(Number.isFinite(quality) ? quality : 1.0, 0.75, 1.45);
    npc.inv = npc.inv || {};
    npc.inv.mats = npc.inv.mats || {};
    npc.inv.matQuality = npc.inv.matQuality || {};
    const prev = npc.inv.mats[fishId] || 0;
    const prevQ = Number.isFinite(npc.inv.matQuality[fishId]) ? npc.inv.matQuality[fishId] : 1.0;
    npc.inv.matQuality[fishId] = Math.round(((prev * prevQ + n * q) / (prev + n)) * 100) / 100;
    npc.inv.mats[fishId] = prev + n;
    return true;
  };

  /**
   * ตัดสินผลการตกปลาที่สำเร็จ 1 ครั้ง:
   * - 90.0% ได้ปลาตามนิเวศของเขตน้ำนั้น
   * - 10.0% ได้หีบไม้โบราณแช่น้ำ (ITEM_MYSTERY_RIVER_CONTAINER)
   */
  FISHING.resolveSuccessfulCatch = (W, npc, zoneId, opts) => {
    opts = opts || {};
    const f = FISHING.ensure(W);
    const zid = ZONES[zoneId] ? zoneId : 'river_central';
    const z = f.zones[zid];
    if (!opts.ignoreStock && z && z.stock <= 0) {
      return { ok: false, reason: 'zone_depleted', zoneId: zid };
    }
    if (!opts.ignoreStock && z) {
      z.stock = Math.max(0, z.stock - 1);
      z.totalCaught = (z.totalCaught || 0) + 1;
      z.lastFishedTick = W.t;
    }

    f.stats.successfulCatches++;
    const rCatch = opts.catchRoll != null ? opts.catchRoll : W.rng.next();
    const isContainer = rCatch >= FISHING.CATCH_OUTCOME_PROBS.FISH; // [0.0, 0.90) = FISH (90%), [0.90, 1.0) = CONTAINER (10%)

    if (isContainer) {
      f.stats.containersCaught++;
      if (npc) {
        npc.inv = npc.inv || {};
        npc.inv.mats = npc.inv.mats || {};
        npc.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER = (npc.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER || 0) + 1;
        const fk = FISHING.knowledgeOf(W, npc);
        fk.knownZones[zid] = true;
        fk.lastFishedDay = W.day;
        if (!opts.silent && W.log) {
          W.log('fish', npc.h.name.given + ' ตกได้「หีบไม้โบราณแช่น้ำ」จาก' + ZONES[zid].nameTh + '!', [npc.id]);
        }
      }
      return {
        ok: true,
        outcome: 'MYSTERY_CONTAINER',
        itemId: 'ITEM_MYSTERY_RIVER_CONTAINER',
        nameTh: 'หีบไม้โบราณแช่น้ำ',
        zoneId: zid,
        roll: rCatch
      };
    }

    const sk = npc ? FISHING.skillOf(W, npc) : (opts.anglerSkill || 15);
    const species = FISHING.pickSpeciesForZone(W, zid, sk, opts.speciesRoll);
    const q = FISHING.computeFishQuality(W, npc, species);

    f.stats.fishCaught++;
    f.stats.bySpecies[species.id] = (f.stats.bySpecies[species.id] || 0) + 1;

    if (npc) {
      FISHING.addFishToBag(npc, species.id, 1, q);
      const fk = FISHING.knowledgeOf(W, npc);
      fk.knownZones[zid] = true;
      fk.knownSpecies[species.id] = (fk.knownSpecies[species.id] || 0) + 1;
      fk.lastFishedDay = W.day;
      if (!opts.silent && W.log && (species.tier >= 3 || W.rng.chance(0.25))) {
        W.log('fish', npc.h.name.given + ' ตกได้「' + species.nameTh + '」(ขั้น ' + species.tier + ' · คุณภาพ ' + q.toFixed(2) + ') ที่' + ZONES[zid].nameTh, [npc.id]);
      }
    }

    return {
      ok: true,
      outcome: 'FISH',
      speciesId: species.id,
      species,
      tier: species.tier,
      quality: q,
      zoneId: zid,
      roll: rCatch
    };
  };

  /* ============================================================================
   * 8. การสร้างพูลไอเทมและการเปิดหีบปริศนาใต้น้ำ (50% Trash / 49.5% Ordinary / 0.5% Legendary)
   * ============================================================================ */
  function buildOrdinaryPoolForCategoryAndTier(W, category, tier, openerNpc) {
    const M = g.MARTIAL, VC = g.VC;
    if (category === 'PILL') {
      const pills = [];
      const seen = new Set();
      JD.ITEMS.items.forEach(it => {
        if (it && it.out === 'PILL' && it.tier === tier && !it.legendary) {
          seen.add(it.id);
          pills.push({ kind: 'PILL', id: it.id, nameTh: it.nameTh, tier: it.tier });
        }
      });
      JD.ITEMS.recipes.forEach(r => {
        if (r && r.outType === 'PILL' && r.tier === tier && !r.legendary && !r.basic) {
          const key = r.outItemId || ('P:' + r.id);
          if (!seen.has(key)) {
            seen.add(key);
            pills.push({ kind: 'PILL', id: key, nameTh: r.outNameTh || ECO.name(key), tier: r.tier });
          }
        }
      });
      return pills;
    }

    if (category === 'EQUIPMENT') {
      const eq = [];
      const seen = new Set();
      JD.ITEMS.items.forEach(it => {
        if (!it || it.out !== 'EQUIPMENT' || it.tier !== tier) return;
        if (it.legendary || (VC && VC.LEGENDARY_WEAPON_BY_ID && VC.LEGENDARY_WEAPON_BY_ID[it.id])) return;
        seen.add(it.id);
        eq.push({ kind: 'EQUIPMENT', id: it.id, itemDef: it, nameTh: it.nameTh, tier: it.tier });
      });
      JD.ITEMS.recipes.forEach(r => {
        if (!r || r.outType !== 'EQUIPMENT' || r.tier !== tier || r.legendary) return;
        const id = r.outItemId || r.id;
        if (seen.has(id) || (VC && VC.LEGENDARY_WEAPON_BY_ID && VC.LEGENDARY_WEAPON_BY_ID[id])) return;
        seen.add(id);
        eq.push({ kind: 'EQUIPMENT', id, recipeDef: r, nameTh: r.outNameTh, tier: r.tier });
      });
      return eq;
    }

    if (category === 'MATERIAL') {
      return Object.values(ECO.matById)
        .filter(m => m && m.tier === tier && !m.legendary && m.category !== 'CONTAINER' && m.category !== 'TRASH' && m.category !== 'FOOD')
        .map(m => ({ kind: 'MATERIAL', id: m.id, nameTh: m.nameTh, tier: m.tier }));
    }

    if (category === 'TECH_CRYSTAL' || category === 'TECH_MANUAL') {
      const allTechs = M && M.discoverableTechniques ? M.discoverableTechniques({}) : JD.TECH.techniques;
      const isManual = category === 'TECH_MANUAL';
      const lib = (W && W.sect && Array.isArray(W.sect.library)) ? W.sect.library : [];
      const heldManuals = (openerNpc && openerNpc.inv && Array.isArray(openerNpc.inv.techs)) ? openerNpc.inv.techs : [];
      let list = allTechs.filter(t => {
        if (!t || t.tier !== tier) return false;
        if (t.legendary) return false; // ห้ามสุ่มได้วิชาตำนานในกิ่ง Ordinary!
        if (t.innateOnly || (M && M.isInnateTech && M.isInnateTech(t))) return false;
        if (isManual && (lib.includes(t.id) || heldManuals.includes(t.id))) return false;
        return true;
      });
      let compensatedToCrystal = false;
      if (isManual && !list.length) {
        // หากคัมภีร์ขั้นนี้มีครบในหอคัมภีร์แล้ว ชดเชยเป็นผลึกวิชาในขั้นเดียวกัน (Duplicate Manual Compensation)
        list = allTechs.filter(t => t && t.tier === tier && !t.legendary && !t.innateOnly && !(M && M.isInnateTech && M.isInnateTech(t)));
        compensatedToCrystal = true;
      }
      return list.map(t => ({
        kind: (isManual && !compensatedToCrystal) ? 'TECH_MANUAL' : 'TECH_CRYSTAL',
        id: (isManual && !compensatedToCrystal) ? t.id : ('T:' + t.id),
        techId: t.id,
        nameTh: (isManual && !compensatedToCrystal) ? ('คัมภีร์「' + t.nameTh + '」') : ('ผลึกวิชา「' + t.nameTh + '」'),
        tier: t.tier,
        compensatedToCrystal
      }));
    }

    if (category === 'SUB_CRYSTAL' || category === 'SUB_MANUAL') {
      const isManual = category === 'SUB_MANUAL';
      const subLib = (W && W.sect && Array.isArray(W.sect.subLibrary)) ? W.sect.subLibrary : [];
      const heldSub = (openerNpc && openerNpc.inv && Array.isArray(openerNpc.inv.subManuals)) ? openerNpc.inv.subManuals : [];
      const allSubs = Object.values(CULT.PATHS).flatMap(p => p.subPaths.map(s => ({
        id: s.id,
        path: p.id,
        nameTh: s.nameTh,
        lootTier: SUBPATH_LOOT_TIER[s.id] || 1
      })));
      let list = allSubs.filter(s => {
        if (s.lootTier !== tier) return false;
        if (isManual && (subLib.includes(s.id) || heldSub.includes(s.id))) return false;
        return true;
      });
      let compensatedToCrystal = false;
      if (isManual && !list.length) {
        list = allSubs.filter(s => s.lootTier === tier);
        compensatedToCrystal = true;
      }
      return list.map(s => ({
        kind: (isManual && !compensatedToCrystal) ? 'SUB_MANUAL' : 'SUB_CRYSTAL',
        id: (isManual && !compensatedToCrystal) ? s.id : ('S:' + s.id),
        subId: s.id,
        nameTh: (isManual && !compensatedToCrystal) ? ('คัมภีร์สาย「' + s.nameTh + '」') : ('ผลึกสาย「' + s.nameTh + '」'),
        tier: s.lootTier,
        compensatedToCrystal
      }));
    }

    return [];
  }

  function buildEligibleLegendaryPool(W) {
    const VC = g.VC, M = g.MARTIAL;
    const weapons = [];
    const techs = [];
    if (VC && Array.isArray(VC.LEGENDARY_WEAPONS)) {
      VC.LEGENDARY_WEAPONS.forEach(w => {
        const claimed = VC.isTargetAlreadyClaimed
          ? VC.isTargetAlreadyClaimed(W, { unique: true, targetKind: 'EQUIPMENT', targetId: w.id })
          : false;
        if (!claimed) {
          weapons.push({
            subKind: 'LEGENDARY_WEAPON',
            id: w.id,
            nameTh: w.nameTh,
            tier: w.tier || 7,
            weaponDef: w
          });
        }
      });
    }
    const allTechs = M && M.discoverableTechniques ? M.discoverableTechniques({}) : [...JD.TECH.techniques, ...JD.TECH.mantras];
    allTechs.forEach(t => {
      if (!t || !t.legendary) return;
      if (t.innateOnly || (M && M.isInnateTech && M.isInnateTech(t))) return;
      const claimed = VC && VC.isTargetAlreadyClaimed
        ? VC.isTargetAlreadyClaimed(W, { unique: true, targetKind: 'TECH_MANUAL', targetId: t.id })
        : ((W && W.sect && Array.isArray(W.sect.library) && W.sect.library.includes(t.id)) ||
           (W && W.world && W.world.martial && Array.isArray(W.world.martial.foundLegends) && W.world.martial.foundLegends.includes(t.id)));
      if (!claimed) {
        techs.push({
          subKind: 'LEGENDARY_TECH',
          id: t.id,
          nameTh: t.nameTh,
          tier: t.tier || 6,
          techDef: t
        });
      }
    });
    return { weapons, techs, total: weapons.length + techs.length };
  }
  FISHING.buildEligibleLegendaryPool = buildEligibleLegendaryPool;

  function deliverContainerReward(W, openerNpc, drop, fromSectStock) {
    const M = g.MARTIAL, VC = g.VC;
    if (!drop) return null;

    if (drop.kind === 'TRASH') {
      if (openerNpc && !fromSectStock) {
        openerNpc.inv = openerNpc.inv || {};
        openerNpc.inv.mats = openerNpc.inv.mats || {};
        openerNpc.inv.mats.TRASH_RIVER_DEBRIS = (openerNpc.inv.mats.TRASH_RIVER_DEBRIS || 0) + 1;
      } else if (W && W.sect && W.sect.stock) {
        W.sect.stock.TRASH_RIVER_DEBRIS = (W.sect.stock.TRASH_RIVER_DEBRIS || 0) + 1;
      }
      return drop;
    }

    if (drop.kind === 'PILL') {
      if (openerNpc && !fromSectStock) {
        ECO.addPersonalPill(openerNpc, drop.id, 1.05, 1);
      } else {
        ECO.add(W, drop.id, 1, 1.05);
      }
      return drop;
    }

    if (drop.kind === 'MATERIAL') {
      if (openerNpc && !fromSectStock) {
        openerNpc.inv = openerNpc.inv || {};
        openerNpc.inv.mats = openerNpc.inv.mats || {};
        openerNpc.inv.mats[drop.id] = (openerNpc.inv.mats[drop.id] || 0) + 1;
      } else {
        ECO.add(W, drop.id, 1);
      }
      return drop;
    }

    if (drop.kind === 'EQUIPMENT' || drop.kind === 'LEGENDARY_WEAPON') {
      let gear = null;
      if (drop.kind === 'LEGENDARY_WEAPON' && VC && VC.mintLegendaryWeapon) {
        gear = VC.mintLegendaryWeapon(W, drop.id, 'fishing_container');
      } else {
        gear = ECO.mintGear(drop.itemDef || drop.recipeDef || ECO.itemById[drop.id] || ECO.recipeById[drop.id], 1.05);
      }
      if (gear) {
        if (openerNpc && !fromSectStock) {
          openerNpc.inv = openerNpc.inv || {};
          openerNpc.inv.gear = openerNpc.inv.gear || [];
          openerNpc.inv.gear.push(gear);
        } else {
          W.sect.gear.push(gear);
        }
        if (drop.kind === 'LEGENDARY_WEAPON' && VC) {
          VC.ensure(W);
          const rcId = 'fish_leg_wpn_' + drop.id;
          W.world.claimReceipts[rcId] = {
            receiptId: rcId,
            targetKind: 'EQUIPMENT',
            targetId: drop.id,
            recipientId: openerNpc ? openerNpc.id : 'sect',
            day: W.day,
            status: 'settled',
            source: 'fishing_container'
          };
          if (VC.syncUniqueArtifacts) VC.syncUniqueArtifacts(W);
        }
        drop.gear = gear;
      }
      return drop;
    }

    if (drop.kind === 'TECH_CRYSTAL' || drop.kind === 'SUB_CRYSTAL') {
      if (M && M.ensure) M.ensure(W);
      if (openerNpc && !fromSectStock && M && M.storeCrystal) {
        M.storeCrystal(W, openerNpc, drop.id, 1);
      } else if (W && W.sect) {
        W.sect.crystals = W.sect.crystals || {};
        W.sect.crystals[drop.id] = Math.min(999, (W.sect.crystals[drop.id] || 0) + 1);
      }
      if (drop.legendary && drop.techId) {
        if (W.world && W.world.martial && Array.isArray(W.world.martial.foundLegends) && !W.world.martial.foundLegends.includes(drop.techId)) {
          W.world.martial.foundLegends.push(drop.techId);
        }
        if (VC) {
          VC.ensure(W);
          const rcId = 'fish_leg_tech_' + drop.techId;
          W.world.claimReceipts[rcId] = {
            receiptId: rcId,
            targetKind: 'TECH_MANUAL',
            targetId: drop.techId,
            recipientId: openerNpc ? openerNpc.id : 'sect',
            day: W.day,
            status: 'settled',
            source: 'fishing_container'
          };
        }
      }
      return drop;
    }

    if (drop.kind === 'TECH_MANUAL') {
      if (M && M.ensure) M.ensure(W);
      if (openerNpc && !fromSectStock) {
        openerNpc.inv = openerNpc.inv || {};
        openerNpc.inv.techs = openerNpc.inv.techs || [];
        if (!openerNpc.inv.techs.includes(drop.id)) openerNpc.inv.techs.push(drop.id);
      } else if (W && W.sect && Array.isArray(W.sect.library)) {
        if (!W.sect.library.includes(drop.id)) W.sect.library.push(drop.id);
      }
      if (drop.legendary) {
        if (W.world && W.world.martial && Array.isArray(W.world.martial.foundLegends) && !W.world.martial.foundLegends.includes(drop.id)) {
          W.world.martial.foundLegends.push(drop.id);
        }
        if (VC) {
          VC.ensure(W);
          const rcId = 'fish_leg_tech_' + drop.id;
          W.world.claimReceipts[rcId] = {
            receiptId: rcId,
            targetKind: 'TECH_MANUAL',
            targetId: drop.id,
            recipientId: openerNpc ? openerNpc.id : 'sect',
            day: W.day,
            status: 'settled',
            source: 'fishing_container'
          };
        }
      }
      return drop;
    }

    if (drop.kind === 'SUB_MANUAL') {
      if (M && M.ensure) M.ensure(W);
      if (openerNpc && !fromSectStock) {
        openerNpc.inv = openerNpc.inv || {};
        openerNpc.inv.subManuals = openerNpc.inv.subManuals || [];
        if (!openerNpc.inv.subManuals.includes(drop.id)) openerNpc.inv.subManuals.push(drop.id);
      } else if (W && W.sect) {
        W.sect.subLibrary = W.sect.subLibrary || [];
        if (!W.sect.subLibrary.includes(drop.id)) W.sect.subLibrary.push(drop.id);
      }
      return drop;
    }

    return drop;
  }

  /**
   * เปิดหีบไม้โบราณแช่น้ำ (ITEM_MYSTERY_RIVER_CONTAINER) 1 ใบอย่างปลอดภัย (Idempotent per receiptId):
   * - 50.0% [0.000, 0.500): ขยะไร้ค่า (TRASH_RIVER_DEBRIS)
   * - 49.5% [0.500, 0.995): ของทั่วไป (Category -> Calibrated Tier -> Eligible Non-Legendary Candidate)
   * - 0.5%  [0.995, 1.000): ของระดับตำนานที่ยังไม่ถูกครอบครองซ้ำ (Legendary Weapon หรือ Legendary Technique)
   */
  FISHING.openContainer = (W, openerNpc, opts) => {
    opts = opts || {};
    const f = FISHING.ensure(W);
    if (opts.receiptId && f.containerReceipts[opts.receiptId]) {
      return f.containerReceipts[opts.receiptId];
    }

    const fromSect = !!opts.fromSectStock;
    if (!opts.dryRun) {
      if (fromSect) {
        if (ECO.count(W, 'ITEM_MYSTERY_RIVER_CONTAINER') < 1) {
          return { ok: false, reason: 'no_container_in_sect_stock' };
        }
        ECO.take(W, 'ITEM_MYSTERY_RIVER_CONTAINER', 1);
      } else {
        const held = openerNpc && openerNpc.inv && openerNpc.inv.mats ? (openerNpc.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER || 0) : 0;
        if (held < 1) {
          return { ok: false, reason: 'no_container_in_bag' };
        }
        openerNpc.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER -= 1;
        if (openerNpc.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER <= 0) delete openerNpc.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER;
        if (openerNpc.inv.spawnedMats && openerNpc.inv.spawnedMats.ITEM_MYSTERY_RIVER_CONTAINER > 0) {
          openerNpc.inv.spawnedMats.ITEM_MYSTERY_RIVER_CONTAINER -= 1;
          if (openerNpc.inv.spawnedMats.ITEM_MYSTERY_RIVER_CONTAINER <= 0) delete openerNpc.inv.spawnedMats.ITEM_MYSTERY_RIVER_CONTAINER;
        }
      }
    }

    const rBranch = opts.openRoll != null ? opts.openRoll : W.rng.next();
    let result = null;

    // กิ่งที่ 1: 50.0% ขยะใต้น้ำไร้ค่า (TRASH)
    if (rBranch < FISHING.CONTAINER_BRANCH_PROBS.TRASH) {
      const drop = {
        kind: 'TRASH',
        category: 'TRASH',
        id: 'TRASH_RIVER_DEBRIS',
        nameTh: 'เศษซากใต้น้ำไร้ค่า',
        tier: 1,
        rarity: 'Common',
        legendary: false,
        value: 0
      };
      if (!opts.dryRun) {
        f.stats.containersOpened++;
        f.stats.trashOpened++;
        deliverContainerReward(W, openerNpc, drop, fromSect);
        if (!opts.silent && W.log && openerNpc) {
          W.log('fish', openerNpc.h.name.given + ' เปิด「หีบไม้โบราณแช่น้ำ」พบเพียงเศษซากใต้น้ำไร้ค่า', [openerNpc.id]);
        }
      }
      result = { ok: true, branch: 'TRASH', drop, roll: rBranch };
    }
    // กิ่งที่ 2: 49.5% ของทั่วไปตามลำดับหมวดและขั้น (ORDINARY)
    else if (rBranch < FISHING.CONTAINER_BRANCH_PROBS.TRASH + FISHING.CONTAINER_BRANCH_PROBS.ORDINARY) {
      const cat = opts.forceCategory || rollWeightedMap(W.rng, FISHING.ORDINARY_CATEGORY_WEIGHTS, opts.categoryRoll) || 'PILL';
      const tierCount = FISHING.CATEGORY_TIER_COUNTS[cat] || 7;
      const tierTable = FISHING.getTierProbabilityTable(tierCount);
      const rolledTier = Number(opts.forceTier || rollWeightedMap(W.rng, tierTable, opts.tierRoll)) || 1;

      let pool = [];
      let actualTier = rolledTier;
      for (let t = rolledTier; t >= 1; t--) {
        pool = buildOrdinaryPoolForCategoryAndTier(W, cat, t, openerNpc);
        if (pool.length > 0) {
          actualTier = t;
          break;
        }
      }
      if (!pool.length) {
        for (let t = rolledTier + 1; t <= tierCount; t++) {
          pool = buildOrdinaryPoolForCategoryAndTier(W, cat, t, openerNpc);
          if (pool.length > 0) {
            actualTier = t;
            break;
          }
        }
      }
      const chosen = pool.length ? W.rng.pick(pool) : { kind: 'PILL', id: 'P:BASIC_HP', nameTh: ECO.name('P:BASIC_HP'), tier: 1 };
      const drop = Object.assign({}, chosen, {
        category: cat,
        rolledTier,
        tier: actualTier,
        legendary: false
      });

      if (!opts.dryRun) {
        f.stats.containersOpened++;
        f.stats.ordinaryOpened++;
        f.stats.byCategory[cat] = (f.stats.byCategory[cat] || 0) + 1;
        f.stats.byTier[actualTier] = (f.stats.byTier[actualTier] || 0) + 1;
        deliverContainerReward(W, openerNpc, drop, fromSect);
        if (!opts.silent && W.log && openerNpc) {
          W.log('fish', openerNpc.h.name.given + ' เปิด「หีบไม้โบราณแช่น้ำ」ได้รับ「' + drop.nameTh + '」(ขั้น ' + drop.tier + ')', [openerNpc.id]);
        }
      }
      result = { ok: true, branch: 'ORDINARY', category: cat, tierCount, rolledTier, tier: actualTier, drop, roll: rBranch };
    }
    // กิ่งที่ 3: 0.5% ของระดับตำนาน (LEGENDARY — อาวุธในตำนาน หรือ วิชาในตำนานที่ไม่ใช่ innateOnly)
    else {
      const legPool = buildEligibleLegendaryPool(W);
      let drop = null;
      let fallbackUsed = null;

      if (legPool.total > 0) {
        const wantWeapon = legPool.weapons.length > 0 && (legPool.techs.length === 0 || (opts.legendaryTypeRoll != null ? opts.legendaryTypeRoll : W.rng.next()) < 0.5);
        if (wantWeapon) {
          const wPick = W.rng.pick(legPool.weapons);
          drop = {
            kind: 'LEGENDARY_WEAPON',
            category: 'EQUIPMENT',
            id: wPick.id,
            nameTh: wPick.nameTh,
            tier: wPick.tier,
            rarity: 'Legendary',
            legendary: true,
            unique: true
          };
        } else {
          const tPick = W.rng.pick(legPool.techs);
          const isManual = (opts.legendaryFormRoll != null ? opts.legendaryFormRoll : W.rng.next()) < 0.25;
          drop = {
            kind: isManual ? 'TECH_MANUAL' : 'TECH_CRYSTAL',
            category: isManual ? 'TECH_MANUAL' : 'TECH_CRYSTAL',
            id: isManual ? tPick.id : ('T:' + tPick.id),
            techId: tPick.id,
            nameTh: (isManual ? 'คัมภีร์ตำนาน「' : 'ผลึกวิชาตำนาน「') + tPick.nameTh + '」',
            tier: tPick.tier,
            rarity: 'Legendary',
            legendary: true,
            unique: true
          };
        }
      } else {
        // กรณีของระดับตำนานทุกชิ้นในโลกถูกครอบครองครบหมดแล้ว (Empty-Pool Fallback):
        // ลดระดับลงเป็นโอสถหรือผลึกวิชาขั้น 7 ที่ไม่ใช่ระดับตำนานอย่างปลอดภัยโดยไม่สร้างของซ้ำ
        fallbackUsed = 'all_legendaries_claimed';
        const fbPool = buildOrdinaryPoolForCategoryAndTier(W, 'PILL', 7, openerNpc)
          .concat(buildOrdinaryPoolForCategoryAndTier(W, 'TECH_CRYSTAL', 7, openerNpc));
        const fbPick = fbPool.length ? W.rng.pick(fbPool) : { kind: 'PILL', id: 'P:BASIC_HP', nameTh: ECO.name('P:BASIC_HP'), tier: 7 };
        drop = Object.assign({}, fbPick, {
          category: fbPick.kind,
          tier: fbPick.tier || 7,
          legendary: false,
          fallbackReason: fallbackUsed
        });
      }

      if (!opts.dryRun) {
        f.stats.containersOpened++;
        if (fallbackUsed) {
          f.stats.legendaryFallbackUsed++;
          f.stats.ordinaryOpened++;
        } else {
          f.stats.legendaryOpened++;
        }
        deliverContainerReward(W, openerNpc, drop, fromSect);
        if (!opts.silent && W.log) {
          const who = openerNpc ? openerNpc.h.name.given : 'สำนัก';
          if (!fallbackUsed) {
            W.log('legend', '🌟 วาสนาแห่งสายน้ำ! ' + who + ' เปิด「หีบไม้โบราณแช่น้ำ」พบสมบัติระดับตำนาน「' + drop.nameTh + '」!', openerNpc ? [openerNpc.id] : []);
          } else {
            W.log('fish', who + ' เปิด「หีบไม้โบราณแช่น้ำ」ได้รับของล้ำค่า「' + drop.nameTh + '」', openerNpc ? [openerNpc.id] : []);
          }
        }
      }
      result = { ok: true, branch: 'LEGENDARY', fallbackUsed, drop, roll: rBranch };
    }

    if (!opts.dryRun) {
      const rId = opts.receiptId || ('cnt_' + (++f.receiptSeq));
      result.receiptId = rId;
      f.containerReceipts[rId] = result;
    }
    return result;
  };

  FISHING.discardTrash = (W, npc, fromSectStock) => {
    if (fromSectStock) {
      const cnt = ECO.count(W, 'TRASH_RIVER_DEBRIS');
      if (cnt <= 0) return { ok: false, removed: 0 };
      ECO.take(W, 'TRASH_RIVER_DEBRIS', cnt);
      return { ok: true, removed: cnt };
    }
    if (!npc || !npc.inv || !npc.inv.mats || !npc.inv.mats.TRASH_RIVER_DEBRIS) {
      return { ok: false, removed: 0 };
    }
    const cnt = npc.inv.mats.TRASH_RIVER_DEBRIS;
    delete npc.inv.mats.TRASH_RIVER_DEBRIS;
    if (npc.inv.spawnedMats) delete npc.inv.spawnedMats.TRASH_RIVER_DEBRIS;
    return { ok: true, removed: cnt };
  };

  /* ============================================================================
   * 9. การนำปลาไปใช้ประโยชน์: ทำอาหารโรงครัว อาหารจานพิเศษ บัฟอาหาร และโอสถ
   * ============================================================================ */
  FISHING.countCookableFish = W => {
    if (!W || !W.sect || !W.sect.stock) return 0;
    let sum = 0;
    for (const s of SPECIES) {
      if (s.tier <= 3) sum += ECO.count(W, s.id);
    }
    return sum;
  };

  // ปรุงอาหารจานปลาจากวัตถุดิบในคลังสำนักหรือในกระเป๋าส่วนตัว
  FISHING.canCookDish = (W, dishId, npc, usePersonalBag) => {
    const dish = FISHING.DISH_BY_ID[dishId];
    if (!dish) return null;
    const bag = usePersonalBag && npc && npc.inv && npc.inv.mats ? npc.inv.mats : (W && W.sect && W.sect.stock ? W.sect.stock : {});
    const req = dish.inputs[0];
    const candidates = SPECIES.filter(s => {
      if (req.fishIds && !req.fishIds.includes(s.id)) return false;
      if (req.fishTiers && !req.fishTiers.includes(s.tier)) return false;
      return (bag[s.id] || 0) >= req.count;
    });
    if (!candidates.length) return null;
    // เลือกปลาที่มีจำนวนมากที่สุดหรือขั้นต่ำสุดที่ผ่านเกณฑ์ก่อน
    candidates.sort((a, b) => a.tier - b.tier || (bag[b.id] || 0) - (bag[a.id] || 0));
    return { dish, fish: candidates[0], count: req.count };
  };

  FISHING.cookDish = (W, dishId, npc, usePersonalBag) => {
    const plan = FISHING.canCookDish(W, dishId, npc, usePersonalBag);
    if (!plan) return { ok: false, reason: 'missing_fish_input' };
    const f = FISHING.ensure(W);
    const { dish, fish, count } = plan;

    if (usePersonalBag && npc && npc.inv && npc.inv.mats) {
      npc.inv.mats[fish.id] -= count;
      if (npc.inv.mats[fish.id] <= 0) delete npc.inv.mats[fish.id];
      npc.inv.mats[dish.id] = (npc.inv.mats[dish.id] || 0) + 1;
    } else {
      if (!ECO.take(W, fish.id, count)) return { ok: false, reason: 'stock_take_failed' };
      ECO.add(W, dish.id, 2);
      ECO.add(W, 'meal', Math.max(2, Math.round(fish.mealYield * 0.75)));
    }
    if (npc && npc.h) {
      (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(npc, 'cooking', 0.35, 1);
    }
    f.stats.fishDishesCooked++;
    return { ok: true, dishId: dish.id, dish, usedFishId: fish.id };
  };

  /**
   * กินอาหารจานปลา (จากกระเป๋าส่วนตัวหรือคลังสำนัก) เพื่อฟื้นความอิ่มและรับบัฟอาหารที่มีขอบเขตชัดเจน (Non-stacking, Appetite-gated)
   */
  FISHING.eatFishDish = (W, npc, dishId, fromSectStock) => {
    if (!W || !npc || npc.dead) return { ok: false, reason: 'invalid_npc' };
    const dish = FISHING.DISH_BY_ID[dishId];
    if (!dish) return { ok: false, reason: 'invalid_dish' };
    const s = npc.h.state;
    // Appetite constraint: ถ้าอิ่มมากแล้ว (>= 88) จะไม่สามารถกินอัดเพื่อปั๊มบัฟซ้ำได้
    if (s.satiety >= 88) {
      return { ok: false, reason: 'too_full', reasonTh: 'อิ่มอยู่แล้ว ไม่สามารถกินอาหารจานปราณเพิ่มได้ในตอนนี้' };
    }
    if (fromSectStock) {
      if (ECO.count(W, dishId) < 1) return { ok: false, reason: 'no_dish_in_stock' };
      ECO.take(W, dishId, 1);
    } else {
      if (!npc.inv || !npc.inv.mats || (npc.inv.mats[dishId] || 0) < 1) return { ok: false, reason: 'no_dish_in_bag' };
      npc.inv.mats[dishId] -= 1;
      if (npc.inv.mats[dishId] <= 0) delete npc.inv.mats[dishId];
    }

    s.satiety = clamp(s.satiety + (dish.satietyGain || 34), 0, 100);
    s.mood = clamp(s.mood + (dish.moodGain || 4), -100, 100);
    if (dish.stressRelief) s.stress = Math.max(0, s.stress - dish.stressRelief);
    if (dish.heartDemonRelief) s.heartDemon = Math.max(0, s.heartDemon - dish.heartDemonRelief);
    if (dish.hpRestorePct) {
      const hm = CULT.hpMax(npc);
      s.hp = Math.min(hm, s.hp + hm * dish.hpRestorePct);
    }
    if (dish.qiRestorePct && npc.cult) {
      const qm = CULT.qiMax(npc);
      s.qi = Math.min(qm, (s.qi || 0) + qm * dish.qiRestorePct);
    }

    // ติดตั้งบัฟอาหาร (ทับบัฟอาหารเดิม ไม่ซ้อนทับกันแบบไร้ขีดจำกัด)
    if (dish.buff) {
      npc.foodBuff = {
        id: dish.buff.id,
        dishId: dish.id,
        nameTh: dish.buff.nameTh,
        startedAt: W.t,
        until: W.t + (dish.buff.durationTicks || 360),
        hpRegenMult: dish.buff.hpRegenMult || 1,
        qiRegenMult: dish.buff.qiRegenMult || 1,
        cultRateMult: dish.buff.cultRateMult || 1,
        studyMult: dish.buff.studyMult || 1,
        energySaveMult: dish.buff.energySaveMult || 1,
        stressGainMult: dish.buff.stressGainMult || 1,
        descTh: dish.buff.descTh
      };
    }

    const f = FISHING.ensure(W);
    f.stats.fishDishesEaten++;
    FISHING.ensureNpc(npc);
    HC.bump(npc);
    return { ok: true, dish, buff: npc.foodBuff };
  };

  FISHING.activeFoodBuff = (W, npc) => {
    if (!npc || !npc.foodBuff) return null;
    if (W && Number.isFinite(W.t) && W.t >= npc.foodBuff.until) {
      npc.foodBuff = null;
      return null;
    }
    return npc.foodBuff;
  };

  FISHING.tickFoodBuff = (W, npc) => {
    const fb = FISHING.activeFoodBuff(W, npc);
    if (!fb) return;
    const s = npc.h.state;
    if (fb.hpRegenMult > 1) {
      const hm = (npc._nd && npc._nd.day === HC.nowDay) ? npc._nd.hpMax : CULT.hpMax(npc);
      s.hp = Math.min(hm, s.hp + hm * 0.00004 * (fb.hpRegenMult - 1) * 10);
    }
    if (fb.qiRegenMult > 1 && npc.cult) {
      const qm = (npc._nd && npc._nd.day === HC.nowDay) ? npc._nd.qiMax : CULT.qiMax(npc);
      s.qi = Math.min(qm, (s.qi || 0) + qm * 0.00006 * (fb.qiRegenMult - 1) * 10);
    }
    if (fb.energySaveMult < 1) {
      s.energy = Math.min(100, s.energy + 0.008);
    }
    if (fb.stressGainMult < 1 && s.stress > 0) {
      s.stress = Math.max(0, s.stress - 0.006);
    }
  };

  // เชื่อมต่อ ECO.cookMeals ให้สามารถใช้ปลาในคลังทำเป็นเสบียงอาหาร (meal) และอาหารจานปลาได้โดยอัตโนมัติ
  const origCookMeals = ECO.cookMeals;
  ECO.cookMeals = function (W, hours, skill) {
    let meals = origCookMeals.apply(this, arguments) || 0;
    const f = FISHING.ensure(W);
    const pop = Math.max(1, W.npcs.length);
    const lowGrain = ECO.count(W, 'grain') < 6;
    const fishCount = FISHING.countCookableFish(W);
    if (fishCount > 0 && (lowGrain || fishCount >= 3 || ECO.count(W, 'meal') < pop * 3)) {
      // นำปลาขั้น 1-2 มาปรุงเป็นมื้ออาหารและอาหารจานพิเศษเข้าคลัง
      for (const sp of SPECIES) {
        if (sp.tier > 2) continue;
        const have = ECO.count(W, sp.id);
        if (have >= 1) {
          const useN = Math.min(have, lowGrain ? 2 : 1);
          if (ECO.take(W, sp.id, useN)) {
            const addM = Math.round(useN * sp.mealYield * (0.95 + (skill || 0) / 350));
            ECO.add(W, 'meal', addM);
            ECO.add(W, 'FOOD_STEAMED_SPIRIT_FISH', 1);
            meals += addM;
            f.stats.fishCookedMeals += addM;
            f.stats.fishDishesCooked += 1;
            break;
          }
        }
      }
    }
    // หากมีปลาขั้น 3-4 ในคลังและโรงครัวมีฝีมือ ให้ปรุงซุปปลาบำรุงศิษย์
    if ((skill || 0) >= 8) {
      if (ECO.count(W, 'MAT_FISH_JADE_KOI_3') >= 2 && ECO.count(W, 'FOOD_JADE_KOI_SOUP') < 4) {
        FISHING.cookDish(W, 'FOOD_JADE_KOI_SOUP', null, false);
      } else if (ECO.count(W, 'MAT_FISH_SPIRIT_EEL_3') >= 2 && ECO.count(W, 'FOOD_EEL_VITALITY_BROTH') < 4) {
        FISHING.cookDish(W, 'FOOD_EEL_VITALITY_BROTH', null, false);
      }
    }
    return meals;
  };

  // ปรับเงื่อนไข A.cook และ A.eat ให้รองรับปลาและอาหารจานปลา
  if (AI && AI.ACTS) {
    if (AI.ACTS.cook) {
      const origCanCook = AI.ACTS.cook.can;
      AI.ACTS.cook.can = (n, W) => origCanCook(n, W) || FISHING.countCookableFish(W) >= 1;
    }
    if (AI.ACTS.eat) {
      const origStartEat = AI.ACTS.eat.start;
      AI.ACTS.eat.start = function (n, W) {
        // หากในคลังหรือในกระเป๋ามีอาหารจานปลาและยังไม่มีบัฟอาหาร ให้กินอาหารจานปลาก่อนเพื่อรับบัฟ
        if (!FISHING.activeFoodBuff(W, n) && n.h.state.satiety < 85) {
          for (const d of FISH_DISHES) {
            if (n.inv && n.inv.mats && (n.inv.mats[d.id] || 0) > 0) {
              if (FISHING.eatFishDish(W, n, d.id, false).ok) {
                W.sect.meals = (W.sect.meals || 0) + 1;
                return true;
              }
            }
            if (ECO.count(W, d.id) > 0) {
              if (FISHING.eatFishDish(W, n, d.id, true).ok) {
                W.sect.meals = (W.sect.meals || 0) + 1;
                return true;
              }
            }
          }
        }
        return origStartEat.apply(this, arguments);
      };
    }
  }

  /* ============================================================================
   * 10. การตัดสินใจหลังตกปลาของ NPC (เปิดหีบ บริจาค เก็บทำยา/อาหาร ขายพ่อค้า)
   * ============================================================================ */
  FISHING.handlePostFishingInventory = (W, n) => {
    if (!W || !n || n.dead || !n.inv || !n.inv.mats) return;
    FISHING.ensure(W);

    // 1. ทิ้งขยะใต้น้ำไร้ค่าทันทีเพื่อไม่ให้รกกระเป๋า
    if (n.inv.mats.TRASH_RIVER_DEBRIS > 0) {
      FISHING.discardTrash(W, n, false);
    }

    // 2. เปิดหีบไม้โบราณแช่น้ำที่ตกได้ (สูงสุด 2 ใบต่อครั้ง)
    let openGuard = 0;
    while ((n.inv.mats.ITEM_MYSTERY_RIVER_CONTAINER || 0) > 0 && openGuard < 2) {
      openGuard++;
      const res = FISHING.openContainer(W, n);
      if (!res || !res.ok) break;
      if (res.branch === 'TRASH') {
        FISHING.discardTrash(W, n, false);
      } else if (res.drop) {
        const d = res.drop;
        if ((d.kind === 'TECH_CRYSTAL' || d.kind === 'SUB_CRYSTAL') && g.MARTIAL && g.MARTIAL.crystalDecision) {
          const dec = g.MARTIAL.crystalDecision(W, n, d.id);
          if (dec.action === 'use') g.MARTIAL.useCrystal(W, n, d.id);
          else if (dec.action === 'donate') g.MARTIAL.donateCrystal(W, n, d.id);
        } else if (d.kind === 'TECH_MANUAL' && g.MARTIAL && g.MARTIAL.donateManual) {
          if (E(n, 'personality.loyalty') > 45 || (n.cp || 0) < 100) {
            g.MARTIAL.donateManual(W, n, d.id, 'tech');
          }
        } else if (d.kind === 'SUB_MANUAL' && g.MARTIAL && g.MARTIAL.donateManual) {
          if (E(n, 'personality.loyalty') > 45 || (n.cp || 0) < 100) {
            g.MARTIAL.donateManual(W, n, d.id, 'sub');
          }
        }
      }
    }

    // 3. จัดการปลาที่อยู่ในกระเป๋า: กินเมื่อหิว / เก็บไว้ปรุงยา / ขายให้พ่อค้าพเนจร / บริจาคเข้าคลังสำนัก
    const loyalty = E(n, 'personality.loyalty');
    const wealth = E(n, 'values.wealthResource');
    const isAlchemist = (n.h.skills.ALCHEMY || 0) >= 18 || n.post === 'alchemy' || n.assist === 'alchemy';
    const isCook = (n.h.skills.cooking || 0) >= 12 || E(n, 'interests.cuisine') >= 60;
    const hasMerchant = W.world && Array.isArray(W.world.visitors) && W.world.visitors.some(v => v && (v.kind === 'trader' || v.role === 'merchant') && v.untilDay >= W.day);

    for (const sp of SPECIES) {
      const held = n.inv.mats[sp.id] || 0;
      if (held <= 0) continue;

      // หากหิวและยังไม่มีบัฟอาหาร ให้ปรุงกินเอง 1 ตัว
      if (n.h.state.satiety < 68 && !FISHING.activeFoodBuff(W, n) && (isCook || sp.tier <= 2)) {
        const dishId = sp.tier >= 3 ? 'FOOD_JADE_KOI_SOUP' : 'FOOD_STEAMED_SPIRIT_FISH';
        if (FISHING.cookDish(W, dishId, n, true).ok) {
          FISHING.eatFishDish(W, n, dishId, false);
        }
      }

      const rem = n.inv.mats[sp.id] || 0;
      if (rem <= 0) continue;

      // นักปรุงยาเก็บปลาสมุนไพรขั้น 3-5 ไว้ 1 ตัวสำหรับปรุงโอสถส่วนตัว
      const keepForAlchemy = (isAlchemist && sp.tier >= 3) ? 1 : 0;
      const actionable = rem - keepForAlchemy;
      if (actionable <= 0) continue;

      // หากเน้นทรัพย์สินและมีพ่อค้าอยู่ในตลาด อาจขายปลาหายากแลกศิลาวิญญาณ
      if (hasMerchant && sp.tier >= 3 && wealth > loyalty + 12) {
        const sellQty = 1;
        const stones = Math.max(4, Math.round(ECO.price(W, sp.id) * 0.9 * sellQty));
        n.inv.mats[sp.id] -= sellQty;
        if (n.inv.mats[sp.id] <= 0) delete n.inv.mats[sp.id];
        n.inv.stones = (n.inv.stones || 0) + stones;
        W.fishing.stats.fishSoldStones += stones;
        continue;
      }

      // บริจาคปลาส่วนเกินเข้าคลังสำนักเพื่อรับแต้มคุณูปการและเติมเสบียงโรงครัว/หอโอสถ
      if (loyalty >= 32 || (n.cp || 0) < 120 || ECO.count(W, 'meal') < W.npcs.length * 2 || actionable >= 2) {
        if (SECT && SECT.donateMat) {
          const dres = SECT.donateMat(W, n, sp.id, actionable);
          if (dres && dres.ok) {
            W.fishing.stats.fishDonated += actionable;
          }
        }
      }
    }
  };

  /* ============================================================================
   * 11. กิจกรรมตกปลาจริงของ NPC (AI.ACTS.riverFish & การประเมินความคุ้มค่าแบบไม่หยั่งรู้)
   * ============================================================================ */
  // ประเมินความคาดหวังของเขตตกปลาโดยใช้เฉพาะสิ่งที่ NPC รู้จริง (ไม่รู้อนาคตของ RNG)
  FISHING.chooseFishingSpotForNpc = (W, n) => {
    const f = FISHING.ensure(W);
    const fk = FISHING.knowledgeOf(W, n);
    const sk = FISHING.skillOf(W, n);
    const stage = n.cult ? n.cult.stage : 0;
    const caution = E(n, 'personality.caution');
    const sociability = E(n, 'temperament.sociability');

    const candidates = [];
    const zoneOrder = ['spirit_pond', 'river_west', 'river_central', 'river_east'];

    for (const zid of zoneOrder) {
      const zdef = ZONES[zid];
      const zstate = f.zones[zid];
      if (!zdef || !zstate) continue;
      // หยุดเลือกเขตที่เห็นว่าปลาหมดเกลี้ยงแล้ว
      if (zstate.stock <= 0) continue;

      const b = W.map.byId[zdef.bkey];
      if (!b || !Array.isArray(b.stations)) continue;
      let st = null, bestD = 1e9, companionCount = 0;
      for (let i = 0; i < b.stations.length; i++) {
        const sObj = W.map.stations[b.stations[i]];
        if (!sObj || sObj.kind !== 'fish') continue;
        if (sObj.occ && sObj.occ !== n.id) {
          companionCount++;
        } else if (!sObj.occ || sObj.occ === n.id) {
          const d = Math.abs(sObj.x - n.x) + Math.abs(sObj.y - n.y);
          if (d < bestD) { bestD = d; st = sObj; }
        }
      }
      if (!st) continue;

      // ประเมินคุณค่าคาดหวังตามความรู้ของตัวละคร
      const known = !!fk.knownZones[zid];
      const abundance = clamp(zstate.stock / zdef.maxStock, 0.15, 1.0);
      let score = abundance * 1.2 + (known ? 0.15 : 0.08 * (E(n, 'personality.curiosity') / 50));

      if (zid === 'spirit_pond') {
        score += (caution > 60 || stage <= 1) ? 0.35 : 0.05;
      } else if (zid === 'river_west') {
        score += 0.30 + (E(n, 'interests.cuisine') + E(n, 'interests.herbs')) / 300;
      } else if (zid === 'river_central') {
        score += 0.38;
      } else if (zid === 'river_east') {
        score += (sk >= 12 || stage >= 2) ? (0.48 + sk / 120) : -0.15;
      }

      if (companionCount > 0) {
        score += sociability > 48 ? 0.25 * Math.min(2, companionCount) : -0.15;
      }

      candidates.push({ st, zoneId: zid, bkey: zdef.bkey, w: Math.max(0.05, score) });
    }

    if (!candidates.length) return null;
    candidates.sort((a, b) => b.w - a.w);
    return candidates[0];
  };

  if (AI && AI.ACTS) {
    AI.ACTS.riverFish = {
      nameTh: 'ตกปลาริมธาร',
      icon: '🎣',
      color: '#38a3a5',
      can(n, W) {
        if (!W || !n || n.dead || n.away || n.sealed) return false;
        if (n.cool && n.cool.riverFish > W.t) return false;
        if (W.threat && W.threat.raid) return false;
        // ปกป้องความอยู่รอดและการพักผ่อน: ไม่ไปตกปลาหากบาดเจ็บ เหนื่อยจัด ง่วงจัด หรือหิวจัดขณะมีข้าวในโรงครัว
        if (n.inj && n.inj.length > 0) return false;
        const s = n.h.state;
        const hm = (n._nd && n._nd.day === HC.nowDay) ? n._nd.hpMax : CULT.hpMax(n);
        if (s.hp < hm * 0.5 || s.rest < 24 || s.energy < 22) return false;
        if (s.satiety < 26 && ECO.count(W, 'meal') > 0) return false;
        const f = W.fishing || FISHING.ensure(W);
        const z = f.zones;
        return ((z.spirit_pond && z.spirit_pond.stock) || 0) +
               ((z.river_west && z.river_west.stock) || 0) +
               ((z.river_central && z.river_central.stock) || 0) +
               ((z.river_east && z.river_east.stock) || 0) > 0;
      },
      score(n, W, S) {
        const s = n.h.state;
        const h = (W.t % 1440) / 60;
        const isNight = h < 5.5 || h >= 21.5;
        if (isNight) S.add('ดึกดื่น', -0.65);

        // ปกป้องงานตำแหน่งหน้าที่หลักของสำนัก (Office Duty Protection)
        if (n.post && h >= 7.5 && h < 17.5 && (W.sect.lastDuty[n.id] || -9999) <= W.t - 360) {
          S.add('ติดภาระตำแหน่งหลัก', -0.95);
        }

        // 1. แรงจูงใจด้านเสบียงและงานครัว (Food & Culinary Supply)
        const pop = Math.max(1, W.npcs.length);
        const meals = ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3;
        const foodLow = clamp(1 - meals / (pop * 3.2), 0, 1);
        if (foodLow > 0.1) {
          S.add('หาปลาเสริมเสบียงสำนัก', foodLow * 0.95);
        }
        if (E(n, 'interests.cuisine') > 55 || (n.h.skills.cooking || 0) >= 15) {
          S.add('หาวัตถุดิบปลาสดเข้าครัว', (E(n, 'interests.cuisine') - 50) / 135 + (n.h.skills.cooking || 0) / 220);
        }

        // 2. แรงจูงใจด้านสมุนไพรและโอสถ (Alchemy / Medicinal Fish Need)
        if ((n.h.skills.ALCHEMY || 0) >= 18 || E(n, 'interests.alchemy') > 62) {
          const koiStock = ECO.count(W, 'MAT_FISH_JADE_KOI_3') + ECO.count(W, 'MAT_FISH_DRAGON_WHISKER_CARP_5');
          if (koiStock < 2) {
            S.add('เสาะหาปลาปราณปรุงโอสถ', 0.28 + (n.h.skills.ALCHEMY || 0) / 260);
          }
        }

        // 3. แรงจูงใจด้านแต้มคุณูปการและรายได้ (Contribution Points & Income)
        if ((n.cp || 0) < 65 && E(n, 'values.wealthResource') > 55) {
          S.add('ตกปลาแลกแต้มคุณูปการ', 0.22 + Math.max(0, (65 - (n.cp || 0)) / 300));
        }

        // 4. แรงจูงใจด้านการพักผ่อนคลายเครียดและธรรมชาติ (Leisure, Solitude & Pastime)
        if (s.stress > 32) S.add('คลายเครียดริมสายน้ำ', (s.stress - 30) / 105);
        if (s.novelty < 48) S.add('เปลี่ยนบรรยากาศริมธารใต้', (50 - s.novelty) / 145);
        if (E(n, 'interests.solitude') > 54) S.add('ชอบความสงบริมน้ำ', (E(n, 'interests.solitude') - 50) / 155);
        if (n.h.origin && /ประมง|ทะเล|แม่น้ำ/.test((n.h.origin.cls || '') + ' ' + (n.h.origin.region || ''))) {
          S.add('คุ้นเคยวิถีชาวประมง', 0.32);
        }
        if (n.h.tastes && /ปลา|น้ำ/.test((n.h.tastes.food || '') + ' ' + (n.h.tastes.pastime || ''))) {
          S.add('ชื่นชอบเมนูปลาและสายน้ำ', 0.22);
        }
        S.add('ฝีมือตกปลา', clamp(FISHING.skillOf(W, n) / 260, 0, 0.28));
      },
      where(W, n) {
        const pick = FISHING.chooseFishingSpotForNpc(W, n);
        return pick ? { st: pick.st, zoneId: pick.zoneId, bkey: pick.bkey, mode: 'fish' } : null;
      },
      dur: () => 90,
      tick(n, W, ctx) {
        const s = n.h.state;
        s.stress = Math.max(0, s.stress - 0.11);
        s.mood = Math.min(100, s.mood + 0.08);
        s.novelty = Math.min(100, s.novelty + 0.07);
        s.energy = Math.max(10, s.energy - 0.025);
        { const fk = FISHING.knowledgeOf(W, n); fk.skill = Math.min(100, +(fk.skill + 0.015).toFixed(3)); }
        (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(n, 'survival', 1 / 180, 0.6);

        // ทุก ๆ 45 นาทีของการตกปลา ทอยโอกาสปลากินเบ็ดตามทักษะและความอุดมสมบูรณ์ของแหล่งน้ำ
        ctx.ticks = (ctx.ticks || 0) + 1;
        if (ctx.ticks % 45 === 0) {
          const f = FISHING.ensure(W);
          f.stats.attempts++;
          const zid = ctx.zoneId || (ctx.st && ctx.st.zoneId) || 'river_central';
          const z = f.zones[zid] || f.zones.river_central;
          if (z && z.stock > 0) {
            const sk = FISHING.skillOf(W, n);
            const abundanceMult = clamp(z.stock / (z.maxStock * 0.35), 0.25, 1.0);
            const biteChance = clamp((0.52 + sk / 135 + (E(n, 'intellect.perceptiveness') - 50) / 350) * abundanceMult, 0.20, 0.90);
            if (W.rng.chance(biteChance)) {
              const res = FISHING.resolveSuccessfulCatch(W, n, zid);
              if (res && res.ok) {
                ctx.caught = (ctx.caught || 0) + 1;
              }
            }
          }
        }
        AI.vf(n, { freedom: 0.03, sectDuty: 0.015 });
      },
      done(n, W, ctx) {
        n.cool = n.cool || {};
        n.cool.riverFish = W.t + 1080;
        if ((ctx && ctx.caught) > 0) {
          n.merit += 0.35 * ctx.caught;
          HC.experience(n, 'craft_success', 0.2);
        }
        FISHING.handlePostFishingInventory(W, n);
      }
    };

    // อัปเกรด A.leisure โหมดตกปลาให้ใช้ระบบตกปลาจริงแทนการเสก meal เปล่า ๆ
    if (AI.ACTS.leisure) {
      const origWhere = AI.ACTS.leisure.where;
      AI.ACTS.leisure.where = function (W, n) {
        const res = origWhere.apply(this, arguments);
        if (res && res.mode === 'fish' && res.st) {
          res.zoneId = res.st.zoneId || 'spirit_pond';
        }
        return res;
      };
      AI.ACTS.leisure.tick = function (n, W, ctx) {
        const s = n.h.state;
        const musMult = (ctx.mode === 'music' && g.MARTIAL) ? g.MARTIAL.skillEffects(n).music : 1;
        s.stress = Math.max(0, s.stress - 0.1 * musMult);
        s.mood = Math.min(100, s.mood + 0.09 * musMult);
        s.novelty = Math.min(100, s.novelty + 0.08);
        if (ctx.mode === 'music') {
          (g.MARTIAL && g.MARTIAL.skillPractice ? g.MARTIAL.skillPractice : HC.practice)(n, 'arts', 1 / 60, 1);
          AI.vf(n, { freedom: 0.03 });
        }
        if (ctx.mode === 'fish') {
          { const fk = FISHING.knowledgeOf(W, n); fk.skill = Math.min(100, +(fk.skill + 0.01).toFixed(3)); }
          if (W.t % 65 === 0) {
            const f = FISHING.ensure(W);
            const zid = ctx.zoneId || (ctx.st && ctx.st.zoneId) || 'spirit_pond';
            const z = f.zones[zid];
            if (z && z.stock > 0 && W.rng.chance(0.48)) {
              FISHING.resolveSuccessfulCatch(W, n, zid);
              FISHING.handlePostFishingInventory(W, n);
            }
          }
        }
        AI.vf(n, { freedom: 0.035 });
        s.energy = Math.min(100, s.energy + 0.05);
      };
    }
  }

  // ป้องกันการบริจาคขยะใต้น้ำหรือหีบปริศนาเพื่อปั๊มแต้มคุณูปการ
  if (SECT && SECT.donateMat) {
    const origDonateMat = SECT.donateMat;
    SECT.donateMat = function (W, npc, matId, qty) {
      if (matId === 'TRASH_RIVER_DEBRIS') {
        return { ok: false, reward: 0, reason: 'worthless_trash', reasonTh: 'เศษซากใต้น้ำไร้ค่า ไม่สามารถบริจาคแลกแต้มคุณูปการได้' };
      }
      if (matId === 'ITEM_MYSTERY_RIVER_CONTAINER') {
        // อนุญาตให้นำหีบเข้าคลังสำนักได้แต่ไม่แจกแต้มจนกว่าจะเปิดหีบ
        if (!W || !npc || !npc.inv || !npc.inv.mats || !Number.isSafeInteger(qty) || qty <= 0 || (npc.inv.mats[matId] || 0) < qty) {
          return { ok: false, reward: 0, reason: 'invalid_qty' };
        }
        npc.inv.mats[matId] -= qty;
        if (npc.inv.mats[matId] <= 0) delete npc.inv.mats[matId];
        ECO.add(W, matId, qty);
        return { ok: true, reward: 0, qty };
      }
      return origDonateMat.apply(this, arguments);
    };
  }

  // เชื่อมต่อบัฟอาหารเข้ากับการคำนวณความเร็วบ่มเพาะและศึกษาคัมภีร์
  if (CULT && CULT.cultRate) {
    const origCultRate = CULT.cultRate;
    CULT.cultRate = function (W, n, inHall) {
      const base = origCultRate.apply(this, arguments);
      const fb = FISHING.activeFoodBuff(W, n);
      return fb && fb.cultRateMult ? base * fb.cultRateMult : base;
    };
  }
  if (AI && AI.needs) {
    const origNeeds = AI.needs;
    AI.needs = function (W, n) {
      origNeeds.apply(this, arguments);
      FISHING.tickFoodBuff(W, n);
    };
  }

  if (g.EXT && g.EXT.isTradable) {
    const origIsTradable = g.EXT.isTradable;
    g.EXT.isTradable = id => {
      if (id === 'ITEM_MYSTERY_RIVER_CONTAINER' || id === 'TRASH_RIVER_DEBRIS') return false;
      return origIsTradable(id);
    };
  }
  if (CPE && CPE.reward) {
    const origCpeReward = CPE.reward;
    CPE.reward = function (W, id, n, stockBefore) {
      if (id === 'ITEM_MYSTERY_RIVER_CONTAINER' || id === 'TRASH_RIVER_DEBRIS') return 0;
      return origCpeReward.apply(this, arguments);
    };
  }
  g.FISHING = FISHING;
  if (typeof module === 'object' && module.exports) module.exports = FISHING;
})(typeof globalThis !== 'undefined' ? globalThis : this);
