
/* Adapted from the user-provided Gemini game; provenance in GEMINI_REUSE_MATRIX.md. */
(function(root){const data={
  "source": "Gemini Ascension Dynasty 4.0.0; adapted catalogs only; no gameplay functions imported",
  "SPIRIT_BEAST_CATALOG_V300": {
    "BEAST_MIST_WOLF": {
      "id": "BEAST_MIST_WOLF",
      "nameTh": "หมาป่าหมอกวายุ (Mist Gale Wolf)",
      "icon": "🐺",
      "tier": 1,
      "element": "WIND",
      "baseHp": 115,
      "combatPower": 920,
      "tameDifficulty": 35,
      "contractBonusPower": 140,
      "abilityId": "BABIL_MIST_FANG_RUSH",
      "abilityNameTh": "เขี้ยวหมอกวายุจู่โจม",
      "dropMatIds": [
        "MAT_BP_WOLF_FANG_1",
        "MAT_BP_WOLF_PELT_1"
      ],
      "lootStones": 28
    },
    "BEAST_IRON_BOAR": {
      "id": "BEAST_IRON_BOAR",
      "nameTh": "หมูป่าเกราะเหล็กไหล (Ironhide Spirit Boar)",
      "icon": "🐗",
      "tier": 2,
      "element": "EARTH",
      "baseHp": 185,
      "combatPower": 1320,
      "tameDifficulty": 48,
      "contractBonusPower": 210,
      "abilityId": "BABIL_IRON_STAMPEDE",
      "abilityNameTh": "เกราะศิลาพุ่งชนทลายค่าย",
      "dropMatIds": [
        "MAT_BP_BEAST_MEAT_1",
        "MAT_ORE_BLACK_IRON_1"
      ],
      "lootStones": 45
    },
    "BEAST_JADE_SERPENT": {
      "id": "BEAST_JADE_SERPENT",
      "nameTh": "อสรพิษเกล็ดหยกพิษหมอก (Jade Scale Venom Serpent)",
      "icon": "🐍",
      "tier": 2,
      "element": "WOOD",
      "baseHp": 165,
      "combatPower": 1420,
      "tameDifficulty": 52,
      "contractBonusPower": 235,
      "abilityId": "BABIL_VENOM_MIST_SPIT",
      "abilityNameTh": "พ่นหมอกพิษมรกตกัดกร่อนปราณ",
      "dropMatIds": [
        "MAT_HERB_JADE_LOTUS_2",
        "MAT_BP_WOLF_FANG_1"
      ],
      "lootStones": 55
    },
    "BEAST_THUNDER_HAWK": {
      "id": "BEAST_THUNDER_HAWK",
      "nameTh": "อินทรีสายฟ้าคราม (Azure Thunder Spirit Hawk)",
      "icon": "🦅",
      "tier": 3,
      "element": "LIGHTNING",
      "baseHp": 220,
      "combatPower": 1680,
      "tameDifficulty": 62,
      "contractBonusPower": 310,
      "abilityId": "BABIL_THUNDER_WING_SLASH",
      "abilityNameTh": "ปีกอัสนีฟาดผ่าเวหา",
      "dropMatIds": [
        "MAT_HERB_MIST_ORCHID_2",
        "MAT_BP_WOLF_FANG_1"
      ],
      "lootStones": 85
    },
    "KING_BLOOD_TIGER": {
      "id": "KING_BLOOD_TIGER",
      "nameTh": "พยัคฆ์ราชันย์โลหิตผาหมอก (Blood Sovereign Tiger King)",
      "icon": "🐅",
      "tier": 4,
      "isBeastKing": true,
      "element": "FIRE",
      "baseHp": 390,
      "combatPower": 2350,
      "tameDifficulty": 75,
      "contractBonusPower": 480,
      "abilityId": "BABIL_SOVEREIGN_BLOOD_ROAR",
      "abilityNameTh": "คำรามราชันย์โลหิตสะท้านขุนเขา",
      "dropMatIds": [
        "MAT_HERB_BLOOD_GINSENG_3",
        "MAT_BP_WOLF_FANG_1",
        "MAT_BP_WOLF_PELT_1"
      ],
      "lootStones": 260
    },
    "KING_FROST_BEAR": {
      "id": "KING_FROST_BEAR",
      "nameTh": "พญาหมีเหมันต์ทลายสวรรค์ (Frost Sovereign Bear King)",
      "icon": "🐻‍❄️",
      "tier": 4,
      "isBeastKing": true,
      "element": "WATER",
      "baseHp": 440,
      "combatPower": 2480,
      "tameDifficulty": 78,
      "contractBonusPower": 520,
      "abilityId": "BABIL_GLACIER_CRUSH",
      "abilityNameTh": "ฝ่ามือภูผาน้ำแข็งถล่มปฐพี",
      "dropMatIds": [
        "MAT_HERB_BLOOD_GINSENG_3",
        "MAT_HERB_JADE_LOTUS_2"
      ],
      "lootStones": 290
    },
    "KING_NETHER_SHADOW_HOUND": {
      "id": "KING_NETHER_SHADOW_HOUND",
      "nameTh": "พญาสุนัขป่าเงาอเวจีกลืนจันทร์ (Nether Shadow Hound King)",
      "icon": "🐺",
      "tier": 3,
      "isBeastKing": true,
      "element": "YIN",
      "baseHp": 320,
      "combatPower": 1980,
      "tameDifficulty": 68,
      "contractBonusPower": 390,
      "abilityId": "BABIL_SHADOW_THROAT_BITE",
      "abilityNameTh": "เขี้ยวเงามืดขย้ำวิญญาณไร้เสียง",
      "dropMatIds": [
        "MAT_BP_SHADOW_PANTHER_PELT_3",
        "MAT_BP_SHADOW_PANTHER_CLAW_3"
      ],
      "lootStones": 210
    },
    "KING_GOLDEN_BODHI_DEER": {
      "id": "KING_GOLDEN_BODHI_DEER",
      "nameTh": "พญากวางทองโพธิญาณเก้าสี (Nine-Color Golden Bodhi Stag)",
      "icon": "🦌",
      "tier": 4,
      "isBeastKing": true,
      "element": "WOOD",
      "baseHp": 410,
      "combatPower": 2250,
      "tameDifficulty": 72,
      "contractBonusPower": 460,
      "abilityId": "BABIL_BODHI_SANCTUARY_AURA",
      "abilityNameTh": "รัศมีเขาทองเก้าสีชุบชีวิตสลายมาร",
      "dropMatIds": [
        "MAT_HERB_SOUL_LOTUS_3",
        "MAT_HERB_BODHI_LEAF_5"
      ],
      "lootStones": 265
    },
    "KING_THUNDER_QILIN": {
      "id": "KING_THUNDER_QILIN",
      "nameTh": "พญากิเลนอัสนีสวรรค์พิพากษา (Heavenly Thunder Qilin Sovereign)",
      "icon": "🦄",
      "tier": 4,
      "isBeastKing": true,
      "element": "LIGHTNING",
      "baseHp": 460,
      "combatPower": 2620,
      "tameDifficulty": 80,
      "contractBonusPower": 560,
      "abilityId": "BABIL_QILIN_THUNDER_STAMPEDE",
      "abilityNameTh": "กีบเท้าสายฟ้าเก้าสวรรค์สะท้านภพ",
      "dropMatIds": [
        "MAT_BP_THUNDER_DRAKE_HORN_4",
        "MAT_ORE_DIVINE_GOLD_5"
      ],
      "lootStones": 320
    }
  },
  "FORTUITOUS_SITE_TEMPLATES_V300": [
    {
      "archetypeId": "MICRO_ARCH_SPIRIT_POND",
      "nameTh": "แอ่งน้ำทิพย์ปราณบรรจบ (Spirit Convergence Pond)",
      "icon": "💧",
      "tier": 2,
      "dangerLevel": 18,
      "durationHours": 14,
      "rewardType": "QI_SURGE_AND_HEAL",
      "descTh": "ตาน้ำวิญญาณธรรมชาติที่ปราณฟ้าดินไหลมาบรรจบกัน ผู้ดูดซับจะทะลวงจุดติดขัดและฟื้นฟูอาการบาดเจ็บทันที"
    },
    {
      "archetypeId": "MICRO_ARCH_SWORD_TABLET",
      "nameTh": "ศิลาจารึกเจตจำนงกระบี่โบราณ (Ancient Sword Intent Tablet)",
      "icon": "🗡️",
      "tier": 3,
      "dangerLevel": 28,
      "durationHours": 16,
      "rewardType": "ANCIENT_SCROLL",
      "descTh": "รอยกระบี่ของปรมาจารย์ยุคบรรพกาลที่ทิ้งเจตจำนงไว้บนผาหิน ผู้ตระหนักรู้จะได้รับคัมภีร์วิชายุทธ์และความเข้าใจเต๋า"
    },
    {
      "archetypeId": "MICRO_ARCH_MIXED_FORTUNE_CAVE",
      "nameTh": "ถ้ำเซียนโอสถเร้นลับ (Hidden Immortal Alchemist Cave)",
      "icon": "🕳️",
      "tier": 3,
      "dangerLevel": 35,
      "durationHours": 16,
      "rewardType": "RARE_PILLS_AND_HERBS",
      "descTh": "ถ้ำพำนักเก่าของปรมาจารย์ปรุงยา มีเตาหลอมโบราณ โอสถประสานปราณ และสมุนไพรร้อยปีซ่อนอยู่หลังค่ายกล"
    },
    {
      "archetypeId": "MICRO_ARCH_METEOR_VEIN",
      "nameTh": "หลุมอุกกาบาตเหล็กไหลดาราตก (Starfall Meteoric Ore)",
      "icon": "☄️",
      "tier": 3,
      "dangerLevel": 32,
      "durationHours": 15,
      "rewardType": "METEOR_ORE_AND_WEAPON",
      "descTh": "เศษเสี้ยวศิลาดาราที่ร่วงหล่นลงมาพร้อมปราณทองคำและอัคคี เหมาะแก่การเก็บแร่ล้ำค่าและหลอมศาสตรา"
    },
    {
      "archetypeId": "MICRO_ARCH_BLOOD_BATTLE_RELIC",
      "nameTh": "ซากสมรภูมิโบราณและป้ายหยกมรดก (Ancient Battlefield Relic)",
      "icon": "🩸",
      "tier": 3,
      "dangerLevel": 42,
      "durationHours": 15,
      "rewardType": "COMBAT_RELIC_AND_STONES",
      "descTh": "เศษซากศาสตราและถุงเฉียนคุนของยอดฝีมือที่ล่วงลับ มีทั้งหินวิญญาณ คัมภีร์ลับ และกลิ่นอายสังหารที่ต้องสยบ"
    },
    {
      "archetypeId": "MICRO_ARCH_ZEN_HEART_PAVILION",
      "nameTh": "ศาลาเซนกระจกใจโบราณ (Ancient Zen Mirror Pavilion)",
      "icon": "🪷",
      "tier": 4,
      "dangerLevel": 36,
      "durationHours": 16,
      "rewardType": "ZEN_SCROLL_ENLIGHTENMENT",
      "descTh": "ศาลาไม้ไผ่โบราณกลางม่านหมอกที่ปรมาจารย์เซนและเมธีพู่กันเคยพำนัก ซ่อนม้วนคัมภีร์วิถีจิตและภาพวาดสวรรค์ไว้ภายใน"
    },
    {
      "archetypeId": "MICRO_ARCH_DEMON_SEAL_ALTAR",
      "nameTh": "แท่นผนึกมารบรรพกาลเร้นลับ (Sealed Demonic Altar)",
      "icon": "🔮",
      "tier": 4,
      "dangerLevel": 44,
      "durationHours": 16,
      "rewardType": "DEMON_ABYSS_SCRIPTURE",
      "descTh": "แท่นศิลาดำที่ผนึกไอหยินและตำราลับของยอดฝีมือวิถีมารอสูร ผู้ที่มีตบะและดวงชะตาแข็งแกร่งจึงจะชิงคัมภีร์มาได้"
    },
    {
      "archetypeId": "MICRO_ARCH_CELESTIAL_SCRIPTURE_CLIFF",
      "nameTh": "ผาอักษรสวรรค์ประทานพร (Celestial Edict Cliff)",
      "icon": "⚡",
      "tier": 5,
      "dangerLevel": 48,
      "durationHours": 16,
      "rewardType": "CELESTIAL_EDICT_SCROLL",
      "descTh": "หน้าผาสูงเสียดฟ้าที่เคยรับสายฟ้าทัณฑ์สวรรค์และแสงโพธิญาณ มีอักขระเทวคัมภีร์ปรากฏขึ้นเมื่อปราณฟ้าดินปั่นป่วน"
    }
  ],
  "SPECIAL_EXPEDITION_SITES_V300": [
    {
      "id": "SITE_SWORD_TOMB",
      "subsiteCode": "SUBSITE_SWORD_VALLEY_01",
      "nameTh": "สุสานกระบี่โบราณหมื่นศาสตรา (Myriad Sword Tomb)",
      "icon": "⚔️",
      "regionNameTh": "หุบเขากระบี่ร้างบูรพา",
      "dangerLevel": 48,
      "recommendedPower": 1150,
      "travelHours": 2.6,
      "guardianNameTh": "หุ่นเชิดศาสตราผู้พิทักษ์สุสานกระบี่",
      "guardianPower": 1220,
      "rewardSummaryTh": "คัมภีร์เพลงกระบี่โบราณ, ศาสตราระดับ 2–3, หินวิญญาณ 120–180",
      "lootTable": {
        "stonesMin": 120,
        "stonesMax": 185,
        "materials": [
          {
            "matId": "MAT_ORE_BLACK_IRON_1",
            "count": 4
          }
        ],
        "grantScroll": true,
        "grantEquipmentSlot": "WEAPON",
        "relicChance": 0.18
      }
    },
    {
      "id": "SITE_KUNLUN_GROTTO",
      "subsiteCode": "SUBSITE_JADE_SPRING_02",
      "nameTh": "ถ้ำคุนหลุนเร้นลับและบ่อน้ำทิพย์หยก (Kunlun Jade Grotto)",
      "icon": "🏔️",
      "regionNameTh": "เทือกเขาหยกเมฆาเหนือ",
      "dangerLevel": 42,
      "recommendedPower": 1050,
      "travelHours": 2.4,
      "guardianNameTh": "พยัคฆ์ขาวพิทักษ์บ่อน้ำทิพย์",
      "guardianPower": 1100,
      "rewardSummaryTh": "โสมโลหิตพันปี, บัวหยกเขียวร้อยปี, โอสถประสานปราณทะลวงขั้น",
      "lootTable": {
        "stonesMin": 95,
        "stonesMax": 150,
        "materials": [
          {
            "matId": "MAT_HERB_BLOOD_GINSENG_3",
            "count": 2
          },
          {
            "matId": "MAT_HERB_JADE_LOTUS_2",
            "count": 3
          }
        ],
        "grantPill": true,
        "grantScroll": false,
        "relicChance": 0.15
      }
    },
    {
      "id": "SITE_SERPENT_MARSH",
      "subsiteCode": "SUBSITE_VENOM_SWAMP_03",
      "nameTh": "บึงอสรพิษเจ็ดพิษเร้นลับ (Seven-Venom Spirit Marsh)",
      "icon": "🐍",
      "regionNameTh": "บึงหมอกพิษทักษิณ",
      "dangerLevel": 52,
      "recommendedPower": 1250,
      "travelHours": 2.5,
      "guardianNameTh": "พญางูเหลือมเกล็ดมรกตเก้าเศียร",
      "guardianPower": 1320,
      "rewardSummaryTh": "ชิ้นส่วนอสูรระดับสูง, กล้วยไม้หมอกวิญญาณ, คัมภีร์วิชาเสริม/โอสถพิษ",
      "lootTable": {
        "stonesMin": 130,
        "stonesMax": 195,
        "materials": [
          {
            "matId": "MAT_HERB_MIST_ORCHID_2",
            "count": 3
          },
          {
            "matId": "MAT_BP_WOLF_FANG_1",
            "count": 4
          },
          {
            "matId": "MAT_BP_WOLF_PELT_1",
            "count": 3
          }
        ],
        "grantScroll": true,
        "grantPill": true,
        "relicChance": 0.2
      }
    },
    {
      "id": "SITE_STAR_PAGODA",
      "subsiteCode": "SUBSITE_ASTRAL_TOWER_04",
      "nameTh": "หอคอยดาราสวรรค์เก้าชั้น (Nine-Heavens Star Pagoda)",
      "icon": "🌟",
      "regionNameTh": "ยอดเขาดาราพยากรณ์",
      "dangerLevel": 65,
      "recommendedPower": 1450,
      "travelHours": 3,
      "guardianNameTh": "เทวรูปศิลาดาราพิทักษ์หอคอย",
      "guardianPower": 1520,
      "rewardSummaryTh": "คัมภีร์เคล็ดปราณชั้นสูง, โอกาสครอบครองสมบัติวิเศษระดับ 8 (Supreme Relic)",
      "lootTable": {
        "stonesMin": 160,
        "stonesMax": 240,
        "materials": [
          {
            "matId": "MAT_HERB_BLOOD_GINSENG_3",
            "count": 2
          },
          {
            "matId": "MAT_ORE_BLACK_IRON_1",
            "count": 4
          }
        ],
        "grantScroll": true,
        "grantEquipmentSlot": "TALISMAN_VESSEL",
        "relicChance": 0.45
      }
    },
    {
      "id": "SITE_THUNDER_RUIN",
      "subsiteCode": "SUBSITE_THUNDER_VALLEY_05",
      "nameTh": "ซากวิหารอัสนีบรรพกาล (Primordial Thunder Ruin)",
      "icon": "⚡",
      "regionNameTh": "ผาอัสนีคำรามตะวันออก",
      "dangerLevel": 58,
      "recommendedPower": 1350,
      "travelHours": 2.7,
      "guardianNameTh": "อสูรกิเลนสายฟ้าคลั่ง",
      "guardianPower": 1400,
      "rewardSummaryTh": "คัมภีร์หลอมกายาอัสนี, เกราะวิญญาณ, แร่เหล็กดำและหินวิญญาณ",
      "lootTable": {
        "stonesMin": 140,
        "stonesMax": 210,
        "materials": [
          {
            "matId": "MAT_ORE_BLACK_IRON_1",
            "count": 5
          },
          {
            "matId": "MAT_HERB_CINDER_LEAF_1",
            "count": 4
          }
        ],
        "grantScroll": true,
        "grantEquipmentSlot": "ARMOR",
        "relicChance": 0.25
      }
    },
    {
      "id": "SITE_DEMON_ABYSS",
      "subsiteCode": "SUBSITE_BLOOD_ABYSS_06",
      "nameTh": "หุบเหวมารโลหิตพันปี (Millennium Blood Abyss)",
      "icon": "🩸",
      "regionNameTh": "หุบเหวโลหิตประจิม",
      "dangerLevel": 72,
      "recommendedPower": 1600,
      "travelHours": 3.1,
      "guardianNameTh": "มารเงาโลหิตบรรพกาล",
      "guardianPower": 1680,
      "rewardSummaryTh": "คัมภีร์วิชาต้องห้าม/ชั้นสูง, สมบัติวิเศษระดับ 8, หินวิญญาณจำนวนมาก",
      "lootTable": {
        "stonesMin": 190,
        "stonesMax": 290,
        "materials": [
          {
            "matId": "MAT_HERB_BLOOD_GINSENG_3",
            "count": 3
          },
          {
            "matId": "MAT_BP_WOLF_FANG_1",
            "count": 4
          }
        ],
        "grantScroll": true,
        "grantPill": true,
        "relicChance": 0.55
      }
    }
  ],
  "EXTERNAL_SECTS_TEMPLATES_V300": [
    {
      "id": "CN",
      "nameTh": "สำนักมังกรบรรพกาลหลงหยวน (Dragon Seal Orthodox Sect)",
      "shortTh": "สำนักมังกรหลงหยวน",
      "icon": "🐉",
      "alignment": "RIGHTEOUS",
      "alignmentLabelTh": "ฝ่ายธรรมะเสาหลัก",
      "majorPath": "XIAN",
      "specialtyTh": "เพลงกระบี่เซียนและค่ายกลพิทักษ์ฟ้า",
      "militaryPower": 2400,
      "initialRelation": 25,
      "leaderNameTh": "ปรมาจารย์หลงเทียน (ขอบเขตแก่นทองคำ)",
      "descTh": "สำนักใหญ่ฝ่ายธรรมะผู้ยึดมั่นในกฎระเบียบยุทธภพ ชื่นชมสำนักที่คุ้มครองชาวบ้านและรังเกียจวิถีมาร"
    },
    {
      "id": "SG",
      "nameTh": "หอประมูลไข่มุกสวรรค์หนานไห่ (South Sea Pearl Pavilion)",
      "shortTh": "หอไข่มุกสวรรค์",
      "icon": "🏮",
      "alignment": "NEUTRAL",
      "alignmentLabelTh": "ฝ่ายเป็นกลางการค้า",
      "majorPath": "XIAN",
      "specialtyTh": "การค้าข้ามสมุทร โอสถทิพย์ และข่าวกรองยุทธภพ",
      "militaryPower": 1950,
      "initialRelation": 35,
      "leaderNameTh": "เถ้าแก่เนี้ยไป๋หลาน (เจ้าหอการค้าหมื่นสมุทร)",
      "descTh": "สมาคมการค้าและหอประมูลที่มั่งคั่งที่สุด ยินดีทำสัญญาการค้าแลกเปลี่ยนสมุนไพรหายากกับทุกสำนักที่มีหินวิญญาณ"
    },
    {
      "id": "IN",
      "nameTh": "มหาอารามเทวะสุริยัน (Solar Dharma Monastery)",
      "shortTh": "อารามเทวะสุริยัน",
      "icon": "☀️",
      "alignment": "RIGHTEOUS",
      "alignmentLabelTh": "ฝ่ายธรรมะศรัทธา",
      "majorPath": "GOD",
      "specialtyTh": "มหาศรัทธาเทวะและกายาเพลิงสุริยัน",
      "militaryPower": 2250,
      "initialRelation": 15,
      "leaderNameTh": "มหาสมณะสุริยะคุปต์",
      "descTh": "อารามผู้ฝึกตนสายเทวะและหลอมกายาผู้เคร่งครัด พร้อมส่งคณะผู้ฝึกตนมาร่วมแลกเปลี่ยนธรรมะหากมีความสัมพันธ์อันดี"
    },
    {
      "id": "JP",
      "nameTh": "หมู่ตึกอัสนีบูรพา (Eastern Thunder Blade Hall)",
      "shortTh": "หมู่ตึกอัสนีบูรพา",
      "icon": "⚡",
      "alignment": "NEUTRAL",
      "alignmentLabelTh": "ฝ่ายอิสระคลั่งยุทธ์",
      "majorPath": "BODY",
      "specialtyTh": "เพลงดาบผ่าอัสนีและการประลองตัดสินเป็นตาย",
      "militaryPower": 2150,
      "initialRelation": -10,
      "leaderNameTh": "จ้าวศาสตรา เคนชิน อัสนีทมิฬ",
      "descTh": "สำนักมือดาบผู้หยิ่งทระนงและชื่นชอบการท้าประลองยุทธ์ หากสำนักเราอ่อนแอหรือไปยั่วยุอาจยกพวกมาท้าตีถึงหน้าด่าน"
    },
    {
      "id": "VN",
      "nameTh": "หุบเขาหมื่นพิษมรกต (Myriad Venom Valley)",
      "shortTh": "หุบเขาหมื่นพิษ",
      "icon": "🦂",
      "alignment": "UNORTHODOX",
      "alignmentLabelTh": "ฝ่ายอธรรมเร้นลับ",
      "majorPath": "XIAN",
      "specialtyTh": "วิชาพิษกู่ การเลี้ยงอสูรพิษ และโอสถต้องห้าม",
      "militaryPower": 2050,
      "initialRelation": -35,
      "leaderNameTh": "แม่เฒ่าพิษมรกต ตู้ซานเหนียง",
      "descTh": "สำนักอธรรมใกล้ชายแดนที่คอยลอบเก็บสมุนไพรและอสูรพิษ หากความสัมพันธ์ตกต่ำกว่า -55 จะส่งมือสังหารพิษบุกโจมตีสำนักเรา"
    },
    {
      "id": "RU",
      "nameTh": "วังเหมันต์อุดรพิฆาต (Northern Frost Blood Palace)",
      "shortTh": "วังเหมันต์อุดร",
      "icon": "❄️",
      "alignment": "DEMONIC",
      "alignmentLabelTh": "ฝ่ายมารโลหิตน้ำแข็ง",
      "majorPath": "BODY",
      "specialtyTh": "ปราณเหมันต์กลืนโลหิตและการรุกรานชิงทรัพยากร",
      "militaryPower": 2500,
      "initialRelation": -50,
      "leaderNameTh": "ประมุขมารเหมันต์ โวรอนอฟ",
      "descTh": "ขั้วอำนาจฝ่ายมารที่ดุดันและพร้อมบุกโจมตีสำนักเพื่อนบ้านทันทีที่เห็นช่องโหว่หรือเมื่อความสัมพันธ์เข้าขั้นศัตรูคู่แค้น"
    }
  ],
  "GRAND_FORMATIONS_CATALOG_V320": {
    "FORM_SEVEN_STAR_SWORD": {
      "id": "FORM_SEVEN_STAR_SWORD",
      "nameTh": "🗡️ มหาค่ายกลกระบี่เจ็ดดาราพิฆาตมาร (Seven-Star Sword Array)",
      "shortTh": "ค่ายกลกระบี่เจ็ดดารา",
      "icon": "🗡️",
      "costStones": 160,
      "durationHours": 18,
      "towerDamageMult": 2.2,
      "towerRangeBonusKm": 0.28,
      "combatBonusPct": 20,
      "cultivationBonusPct": 10,
      "villageShieldReductionPct": 25,
      "descTh": "เร่งอานุภาพหอคอยค่ายกลขึ้น 2.2 เท่า ขยายรัศมียิงศรปราณ และฟาดปราณกระบี่เจ็ดดาราใส่ศัตรูที่บุกรุกเขตสำนักโดยอัตโนมัติ"
    },
    "FORM_AZURE_CLOUD_MIST": {
      "id": "FORM_AZURE_CLOUD_MIST",
      "nameTh": "☁️ มหาค่ายกลหมอกเมฆาเร้นลับเก้าชั้น (Nine-Layer Azure Mist Array)",
      "shortTh": "ค่ายกลหมอกเมฆาเก้าชั้น",
      "icon": "☁️",
      "costStones": 150,
      "durationHours": 20,
      "towerDamageMult": 1.4,
      "towerRangeBonusKm": 0.15,
      "combatBonusPct": 12,
      "cultivationBonusPct": 28,
      "villageShieldReductionPct": 60,
      "descTh": "ปกคลุมสำนักและหมู่บ้านด้วยหมอกปราณศักดิ์สิทธิ์ ลดความเสียหายจากการถูกโจมตีลง 60% ฟื้นฟู HP หมู่บ้านและเร่งการบ่มเพาะ +28%"
    },
    "FORM_SOLAR_THUNDER_DRAGON": {
      "id": "FORM_SOLAR_THUNDER_DRAGON",
      "nameTh": "⚡ มหาค่ายกลมังกรอัสนีสุริยัน (Solar Thunder Dragon Array)",
      "shortTh": "ค่ายกลมังกรอัสนี",
      "icon": "⚡",
      "costStones": 180,
      "durationHours": 16,
      "towerDamageMult": 1.8,
      "towerRangeBonusKm": 0.22,
      "combatBonusPct": 35,
      "cultivationBonusPct": 15,
      "villageShieldReductionPct": 35,
      "descTh": "ปลุกชีพจรมังกรอัสนี เสริมพลังรบศิษย์และสัตว์อสูรพันธสัญญาทั้งสำนัก +35% พร้อมสายฟ้าฟาดศัตรูที่เข้าปะทะ"
    }
  },
  "SECT_POSITIONS_CATALOG": {
    "SECT_MASTER": {
      "id": "SECT_MASTER",
      "titleTh": "เจ้าสำนัก (Sect Master)",
      "shortTh": "เจ้าสำนัก",
      "badgeIcon": "👑",
      "rankOrder": 1,
      "stipendPerDay": 25,
      "maxHolders": 1,
      "effectSummaryTh": "กำหนดชะตาสำนัก นโยบาย กฤษฎีกา การแต่งตั้งตำแหน่ง และทิศทางธรรมะ/อธรรมตามบุคลิกของเจ้าสำนัก"
    },
    "GRAND_ELDER": {
      "id": "GRAND_ELDER",
      "titleTh": "มหาผู้อาวุโสพิทักษ์สำนัก (Grand Guardian Elder)",
      "shortTh": "มหาผู้อาวุโส",
      "badgeIcon": "🐉",
      "rankOrder": 2,
      "stipendPerDay": 18,
      "maxHolders": 1,
      "effectSummaryTh": "เสริมพลังรบและการป้องกันสำนัก +15% · ออกสกัดศัตรูระดับสูงและชี้แนะการทะลวงด่าน"
    },
    "LAW_ELDER": {
      "id": "LAW_ELDER",
      "titleTh": "ผู้อาวุโสสูงสุดหอคุมกฎ (Law Enforcement Elder)",
      "shortTh": "ผู้อาวุโสคุมกฎ",
      "badgeIcon": "⚖️",
      "rankOrder": 3,
      "stipendPerDay": 15,
      "maxHolders": 1,
      "effectSummaryTh": "รักษาวินัยสำนัก ลดโอกาสเกิดจิตมารและการทะเลาะวิวาทของศิษย์ · เพิ่มโบนัสป้องกันหมู่บ้าน"
    },
    "ALCHEMY_ELDER": {
      "id": "ALCHEMY_ELDER",
      "titleTh": "เจ้าหอปรุงโอสถ (Alchemy Hall Master)",
      "shortTh": "เจ้าหอโอสถ",
      "badgeIcon": "⚗️",
      "rankOrder": 4,
      "stipendPerDay": 15,
      "maxHolders": 1,
      "effectSummaryTh": "เพิ่มความเร็วและคุณภาพการหลอมโอสถ +25% · ถ่ายทอดตำรับโอสถให้ศิษย์รุ่นหลัง"
    },
    "FORGE_ELDER": {
      "id": "FORGE_ELDER",
      "titleTh": "เจ้าโรงหลอมศาสตรา (Forge Hall Master)",
      "shortTh": "เจ้าโรงหลอม",
      "badgeIcon": "⚒️",
      "rankOrder": 5,
      "stipendPerDay": 15,
      "maxHolders": 1,
      "effectSummaryTh": "เพิ่มประสิทธิภาพการตีศาสตราและเกราะ +25% · ซ่อมแซมอาวุธศิษย์ในสำนัก"
    },
    "SCRIPTURE_ELDER": {
      "id": "SCRIPTURE_ELDER",
      "titleTh": "ผู้อาวุโสหอคัมภีร์และปราชญ์เต๋า (Scripture Pavilion Elder)",
      "shortTh": "ผู้อาวุโสหอคัมภีร์",
      "badgeIcon": "📜",
      "rankOrder": 6,
      "stipendPerDay": 15,
      "maxHolders": 1,
      "effectSummaryTh": "เร่งความเข้าใจเต๋าและความชำนาญวิชายุทธ์ของศิษย์ทั้งสำนัก +20% · จัดบรรยายธรรมะ"
    },
    "EXTERNAL_ELDER": {
      "id": "EXTERNAL_ELDER",
      "titleTh": "ผู้อาวุโสกิจการภายนอกและหอการค้า (External Affairs Elder)",
      "shortTh": "ผู้อาวุโสการค้า",
      "badgeIcon": "🏮",
      "rankOrder": 7,
      "stipendPerDay": 14,
      "maxHolders": 1,
      "effectSummaryTh": "เพิ่มรายได้การค้าและส่วยคุ้มครอง +20% · ดูแลเส้นทางคาราวานและข่าวกรองชายแดน"
    },
    "CHIEF_DISCIPLE": {
      "id": "CHIEF_DISCIPLE",
      "titleTh": "ศิษย์เอกประจำสำนัก (Chief Senior Disciple)",
      "shortTh": "ศิษย์เอก",
      "badgeIcon": "⚔️",
      "rankOrder": 8,
      "stipendPerDay": 12,
      "maxHolders": 1,
      "effectSummaryTh": "ผู้นำศิษย์รุ่นเยาว์ · ชี้แนะการประลองยุทธ์และนำขบวนออกปฏิบัติภารกิจค่าหัว"
    },
    "CORE_DISCIPLE": {
      "id": "CORE_DISCIPLE",
      "titleTh": "ศิษย์สืบทอดสายตรง (Core Disciple)",
      "shortTh": "ศิษย์สืบทอด",
      "badgeIcon": "🌟",
      "rankOrder": 9,
      "stipendPerDay": 10,
      "maxHolders": 4,
      "effectSummaryTh": "ผู้ฝึกตนดาวรุ่งที่ได้รับการถ่ายทอดวิชาหลักและมีสิทธิ์ก้าวขึ้นเป็นผู้อาวุโส"
    },
    "INNER_DISCIPLE": {
      "id": "INNER_DISCIPLE",
      "titleTh": "ศิษย์สายใน (Inner Disciple)",
      "shortTh": "ศิษย์สายใน",
      "badgeIcon": "🧘",
      "rankOrder": 10,
      "stipendPerDay": 7,
      "maxHolders": 12,
      "effectSummaryTh": "กำลังหลักของสำนักในการบ่มเพาะปราณ ออกล่าอสูร และฝึกวิชายุทธ์"
    },
    "OUTER_DISCIPLE": {
      "id": "OUTER_DISCIPLE",
      "titleTh": "ศิษย์สายนอก (Outer Disciple)",
      "shortTh": "ศิษย์สายนอก",
      "badgeIcon": "🌱",
      "rankOrder": 11,
      "stipendPerDay": 4,
      "maxHolders": 20,
      "effectSummaryTh": "ผู้เริ่มต้นเข้าสำนัก ดูแลการเก็บสมุนไพร ขุดแร่ และบ่มเพาะรากฐานขั้นต้น"
    }
  },
  "SECT_MASTER_GOVERNANCE_STYLES": {
    "RIGHTEOUS_GUARDIAN": {
      "id": "RIGHTEOUS_GUARDIAN",
      "nameTh": "วิถีคุณธรรมพิทักษ์ชน (Righteous Orthodox)",
      "doctrine": "DEFENSIVE",
      "moralShift": 2,
      "orderShift": 2,
      "cultivationBonusPct": 15,
      "harmonyBonusPct": 25,
      "combatBonusPct": 10,
      "tradeBonusPct": 10,
      "descTh": "เจ้าสำนักผู้เปี่ยมเมตตาและคุณธรรม มุ่งเน้นคุ้มครองหมู่บ้าน รักษาความสามัคคีของศิษย์ และส่งเสริมการชี้แนะวิชาอย่างเท่าเทียม"
    },
    "IMMORTAL_SAGE": {
      "id": "IMMORTAL_SAGE",
      "nameTh": "วิถีเซียนละทางโลกมุ่งสู่เต๋า (Immortal Dao Seeker)",
      "doctrine": "BALANCED",
      "moralShift": 1,
      "orderShift": 1,
      "cultivationBonusPct": 30,
      "harmonyBonusPct": 15,
      "combatBonusPct": 5,
      "tradeBonusPct": 5,
      "descTh": "เจ้าสำนักผู้ลุ่มลึกในหลักเต๋าและคัมภีร์ เน้นการนั่งสมาธิบ่มเพาะปราณ ถกธรรมะ และทะลวงขอบเขตขั้นสูง"
    },
    "MARTIAL_OVERLORD": {
      "id": "MARTIAL_OVERLORD",
      "nameTh": "วิถีราชันย์ยุทธ์พิชิตศึก (Martial Hegemon)",
      "doctrine": "AGGRESSIVE",
      "moralShift": 0,
      "orderShift": 1,
      "cultivationBonusPct": 12,
      "harmonyBonusPct": 5,
      "combatBonusPct": 30,
      "tradeBonusPct": 10,
      "descTh": "เจ้าสำนักผู้ห้าวหาญและทะเยอทะยาน ส่งเสริมการประลองยุทธ์ การออกล่าอสูร และการปราบปรามศัตรูเพื่อเชิดชูบารมีสำนัก"
    },
    "GRAND_ARTISAN": {
      "id": "GRAND_ARTISAN",
      "nameTh": "วิถีปรมาจารย์โอสถและศาสตรา (Alchemist & Artisan Sovereign)",
      "doctrine": "ALCHEMY_FOCUS",
      "moralShift": 1,
      "orderShift": 1,
      "cultivationBonusPct": 15,
      "harmonyBonusPct": 15,
      "combatBonusPct": 10,
      "tradeBonusPct": 30,
      "descTh": "เจ้าสำนักผู้เชี่ยวชาญศาสตร์หลอมโอสถและตีศาสตรา มุ่งรวบรวมสมุนไพรวิญญาณ แร่หายาก และสร้างความมั่งคั่งให้หอคลัง"
    },
    "UNORTHODOX_SUPREME": {
      "id": "UNORTHODOX_SUPREME",
      "nameTh": "วิถีอธรรมไร้พันธนาการ (Unorthodox / Ruthless Ambition)",
      "doctrine": "AGGRESSIVE",
      "moralShift": -3,
      "orderShift": -2,
      "cultivationBonusPct": 22,
      "harmonyBonusPct": -10,
      "combatBonusPct": 35,
      "tradeBonusPct": 15,
      "descTh": "เจ้าสำนักผู้ถือคติปลาใหญ่กินปลาเล็ก เน้นความแข็งแกร่งและการแย่งชิงวาสนา ศิษย์เก่งก้าวหน้าไวแต่อาจเกิดการแก่งแย่งชิงดี"
    }
  },
  "GRAND_EQUIPMENT_CATALOG_V330": [
    {
      "id": "REC330_WEP_AZURE_BAMBOO_SWORDS",
      "nameTh": "ตำรับชุดกระบี่ไผ่เมฆาครามเจ็ดสิบสองเล่ม (72 Azure Bamboo Cloud Swords)",
      "outputNameTh": "กระบี่ไผ่เมฆาครามเจ็ดสิบสองเล่ม (青竹蜂云剑)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "WEAPON",
      "weaponType": "SWORD",
      "compatiblePath": "XIAN",
      "tier": 4,
      "minMastery": 35,
      "priceStones": 145,
      "inputs": [
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "count": 3
        },
        {
          "matId": "MAT_HERB_JADE_LOTUS_2",
          "count": 1
        }
      ],
      "combatMult": 0.18,
      "defenseMult": 0.08,
      "element": "WOOD",
      "descTh": "ชุดกระบี่บินไม้ไผ่อัสนีในตำนาน สามารถประกอบเป็นค่ายกลกระบี่สังหารศัตรูได้ทั้งรุกและรับ"
    },
    {
      "id": "REC330_WEP_HEAVY_XUAN_RULER",
      "nameTh": "ตำรับไม้บรรทัดเหล็กดำหนักหมื่นชั่ง (Heavy Xuan Iron Ruler)",
      "outputNameTh": "ดาบไม้บรรทัดเสวียนจ้งหมื่นชั่ง (玄重尺)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "WEAPON",
      "weaponType": "SABER",
      "compatiblePath": "BODY",
      "tier": 4,
      "minMastery": 35,
      "priceStones": 140,
      "inputs": [
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "count": 4
        },
        {
          "matId": "MAT_BP_WOLF_FANG_1",
          "count": 1
        }
      ],
      "combatMult": 0.2,
      "defenseMult": 0.07,
      "element": "FIRE",
      "descTh": "ศาสตราเหล็กไหลดำไร้คมแต่หนักดั่งขุนเขา ยิ่งผู้ถือมีพละกำลังกายาสูง แรงฟาดและคลื่นเพลิงยิ่งรุนแรง"
    },
    {
      "id": "REC330_WEP_SILVER_DRAGON_SPEAR",
      "nameTh": "ตำรับทวนมังกรเงินทะลวงสวรรค์ (Silver Dragon Sky-Piercing Spear)",
      "outputNameTh": "ทวนมังกรเงินทะลวงสวรรค์ (银龙破天枪)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "WEAPON",
      "weaponType": "SPEAR",
      "compatiblePath": "ANY",
      "tier": 3,
      "minMastery": 28,
      "priceStones": 110,
      "inputs": [
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "count": 2
        },
        {
          "matId": "MAT_BP_WOLF_FANG_1",
          "count": 2
        }
      ],
      "combatMult": 0.15,
      "defenseMult": 0.05,
      "element": "LIGHTNING",
      "descTh": "ทวนยาวสลักลายมังกรเงิน แทงทะลวงเกราะปราณพร้อมปลดปล่อยกระแสสายฟ้า"
    },
    {
      "id": "REC330_WEP_FIVE_FLAME_FAN",
      "nameTh": "ตำรับพัดขนนกหงส์เพลิงห้าสี (Five-Flame Phoenix Feather Fan)",
      "outputNameTh": "พัดขนนกหงส์เพลิงห้าสี (五火七禽扇)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "WEAPON",
      "weaponType": "FAN",
      "compatiblePath": "XIAN",
      "tier": 4,
      "minMastery": 38,
      "priceStones": 150,
      "inputs": [
        {
          "matId": "MAT_HERB_CINDER_LEAF_1",
          "count": 3
        },
        {
          "matId": "MAT_BP_WOLF_FANG_1",
          "count": 2
        }
      ],
      "combatMult": 0.19,
      "defenseMult": 0.06,
      "element": "FIRE",
      "descTh": "พัดวิเศษที่ถักทอจากขนนกอสูรวิญญาณ เพียงสะบัดหนึ่งครั้งก็เรียกพายุเพลิงห้าสีเผาผลาญศัตรู"
    },
    {
      "id": "REC330_WEP_NINE_STRING_ZITHER",
      "nameTh": "ตำรับพิณหยกเก้าสายสะกดวิญญาณ (Nine-String Soul-Suppressing Zither)",
      "outputNameTh": "พิณหยกเก้าสายสะกดวิญญาณ (九弦镇魂琴)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "WEAPON",
      "weaponType": "ZITHER",
      "compatiblePath": "GOD",
      "tier": 4,
      "minMastery": 36,
      "priceStones": 145,
      "inputs": [
        {
          "matId": "MAT_HERB_MIST_ORCHID_2",
          "count": 2
        },
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "count": 2
        }
      ],
      "combatMult": 0.17,
      "defenseMult": 0.09,
      "element": "YIN",
      "descTh": "พิณโบราณที่ส่งคลื่นเสียงปราณโจมตีดวงจิตของศัตรูโดยตรงพร้อมคุ้มครองจิตใจผู้บรรเลง"
    },
    {
      "id": "REC330_ARM_DRAGON_SCALE",
      "nameTh": "ตำรับเกราะเกล็ดมังกรบรรพกาล (Ancient Dragon-Scale Battle Armor)",
      "outputNameTh": "เกราะเกล็ดมังกรบรรพกาล (古龙鳞甲)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "ARMOR",
      "weaponType": "ARMOR",
      "compatiblePath": "BODY",
      "tier": 4,
      "minMastery": 35,
      "priceStones": 135,
      "inputs": [
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "count": 3
        },
        {
          "matId": "MAT_BP_WOLF_PELT_1",
          "count": 2
        }
      ],
      "combatMult": 0.06,
      "defenseMult": 0.21,
      "element": "EARTH",
      "descTh": "เกราะหนักที่หลอมจากแร่เหล็กดำและเกล็ดอสูร ทนทานต่อทั้งคมศาสตราและอสนีบาตสวรรค์"
    },
    {
      "id": "REC330_ARM_PHOENIX_ROBE",
      "nameTh": "ตำรับอาภรณ์ขนนกฟีนิกซ์เมฆาคราม (Azure Cloud Phoenix Feather Robe)",
      "outputNameTh": "อาภรณ์ขนนกฟีนิกซ์เมฆาคราม (霓裳凤羽衣)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "ARMOR",
      "weaponType": "ROBE",
      "compatiblePath": "XIAN",
      "tier": 4,
      "minMastery": 35,
      "priceStones": 135,
      "inputs": [
        {
          "matId": "MAT_BP_WOLF_PELT_1",
          "count": 2
        },
        {
          "matId": "MAT_HERB_JADE_LOTUS_2",
          "count": 2
        }
      ],
      "combatMult": 0.08,
      "defenseMult": 0.19,
      "element": "WIND",
      "descTh": "ชุดคลุมเซียนน้ำหนักเบาที่กางม่านปราณคุ้มกายอัตโนมัติและเร่งความเร็วการเดินปราณ"
    },
    {
      "id": "REC330_TAL_NINE_DRAGON_CAULDRON",
      "nameTh": "ตำรับเตาหลอมโอสถเก้ามังกรอัคคี (Nine-Dragon Fire Spirit Cauldron)",
      "outputNameTh": "เตาหลอมโอสถเก้ามังกรอัคคี (九龙神火鼎)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "TALISMAN_VESSEL",
      "weaponType": "CAULDRON",
      "compatiblePath": "ANY",
      "tier": 4,
      "minMastery": 38,
      "priceStones": 155,
      "inputs": [
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "count": 3
        },
        {
          "matId": "MAT_HERB_CINDER_LEAF_1",
          "count": 2
        }
      ],
      "combatMult": 0.12,
      "defenseMult": 0.14,
      "craftBonusPath": "ALCHEMY",
      "craftBonusScore": 18,
      "element": "FIRE",
      "descTh": "ภาชนะวิเศษใช้ได้ทั้งครอบสังหารศัตรูด้วยเพลิงเก้ามังกรและเพิ่มความชำนาญการปรุงโอสถ +18"
    },
    {
      "id": "REC330_TAL_SWORD_GOURD",
      "nameTh": "ตำรับน้ำเต้าหยก养剑กลืนวิญญาณ (Spirit-Nurturing Sword Gourd)",
      "outputNameTh": "น้ำเต้าหยกกลืนวิญญาณซ่อนกระบี่ (养剑紫金葫)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "TALISMAN_VESSEL",
      "weaponType": "GOURD",
      "compatiblePath": "XIAN",
      "tier": 4,
      "minMastery": 36,
      "priceStones": 145,
      "inputs": [
        {
          "matId": "MAT_HERB_JADE_LOTUS_2",
          "count": 2
        },
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "count": 2
        }
      ],
      "combatMult": 0.16,
      "defenseMult": 0.1,
      "element": "METAL",
      "descTh": "น้ำเต้าวิเศษสำหรับบ่มเลี้ยงปราณกระบี่สังหาร เมื่อเปิดจุกจะพ่นแสงกระบี่ตัดเศียรศัตรูในพริบตา"
    },
    {
      "id": "REC330_TAL_DEMON_PAGODA",
      "nameTh": "ตำรับเจดีย์ทองคำเก้าชั้นสยบมาร (Nine-Story Golden Demon-Suppressing Pagoda)",
      "outputNameTh": "เจดีย์ทองคำเก้าชั้นสยบมาร (九层镇魔塔)",
      "craftPath": "FORGING",
      "outputType": "EQUIPMENT",
      "slot": "TALISMAN_VESSEL",
      "weaponType": "TALISMAN",
      "compatiblePath": "GOD",
      "tier": 5,
      "minMastery": 45,
      "priceStones": 175,
      "inputs": [
        {
          "matId": "MAT_ORE_BLACK_IRON_1",
          "count": 4
        },
        {
          "matId": "MAT_HERB_BLOOD_GINSENG_3",
          "count": 1
        }
      ],
      "combatMult": 0.15,
      "defenseMult": 0.18,
      "element": "LIGHT",
      "descTh": "ภาชนะวิเศษสายเทวะที่เปล่งรัศมีทองคำสะกดข่มอสูรและป้องกันจิตมารเข้าแทรก"
    }
  ]
};root.JianghuRealmData=data;if(typeof module==="object")module.exports=data;})(typeof globalThis!=="undefined"?globalThis:this);
