/* visitors_clues.js — ระบบผู้มาเยือนจากภายนอก (Outsiders/Visitors), เบาะแสและข่าวลือมีชีวิต (Living Clues),
 * บททดสอบมรดกและวิญญาณผู้สืบทอด (Site Challenges & Inheritance Spirits), และศาสตราวุธระดับตำนาน 11 ชิ้นครบ 7 ตระกูลอาวุธ
 * ทำงานบนสถานะจริงของโลก W เดียว (single source of truth) ไม่แตะต้อง human_core.js และไม่ใช้ RNG ในการวาดภาพหรือตรวจ UI */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, MAP = g.MAP, CULT = g.CULT, ECO = g.ECO, SECT = g.SECT, AI = g.AI, COMBAT = g.COMBAT, EXPED = g.EXPED, EXPLORE = g.EXPLORE, JD = g.JD, ST = g.STATS, M = g.MARTIAL, COG = g.COG, EXT = g.EXT, C = g.CONTENT;
  const clamp = U.clamp, E = (n, p) => HC.eff(n, p);

  const VC = {
    VERSION: 1,
    PATCH_VERSION: '1.13.1',
    MAX_ACTIVE_GUESTS: 6,
    MAX_BURST_GUESTS: 8,
    MAX_OFFSITE_REGISTRY: 48,
    MAX_ACTIVE_CLUES: 32,
    MAX_CLUE_HISTORY: 80,
    MAX_INSTANCE_HISTORY: 24,
    DAILY_CLUE_BUDGET: 3,
    DAILY_LEGEND_CLUE_BUDGET: 1
  };

  VC.pushClueHistory = (inst, entry) => {
    if (!inst) return;
    if (!Array.isArray(inst.history)) inst.history = [];
    inst.history.push(entry);
    if (inst.history.length > VC.MAX_INSTANCE_HISTORY) {
      const first = inst.history[0];
      const rest = inst.history.slice(1);
      const keepIdx = rest.findIndex(x => !x.milestone);
      if (keepIdx >= 0) rest.splice(keepIdx, 1);
      else rest.shift();
      inst.history = [first].concat(rest);
    }
  };

  /* ============================================================================
   * 1. LEGENDARY WEAPONS CATALOG (11 Weapons across 7 Families: SWORD, BLADE, SPEAR, STAFF, FIST, BOW, FOCUS)
   * ============================================================================ */
  const LEGENDARY_WEAPONS = [
    {
      id: 'LEG_WPN_YITIAN_SWORD',
      nameTh: 'กระบี่อิงฟ้าพิฆาตมาร',
      chineseName: '倚天剑',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Jin Yong — The Heaven Sword and Dragon Saber (《倚天屠龙记》)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'SWORD',
      visualSubtype: 'SWORD',
      visualKey: 'vis_yitian_sword',
      presentationMode: 'held_and_orbit',
      tier: 7,
      minStage: 5,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.35,
      value: 4800,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['XIAN', 'HEART_SOUL', 'ANY'],
      preferredSubs: ['SWORD_IMMORTAL', 'MIND_SWORD_TELEKINESIS'],
      fixedStats: { atk: 680, matk: 640, acc: 195, crit: 10, critDmg: 24, pen: 18, cast: 12, eva: 65 },
      effects: [
        {
          effectId: 'EFX_LEG_YITIAN_SEVER',
          nameTh: 'คมกระบี่อิงฟ้าผ่าม่านปราณ',
          descTh: 'เมื่อโจมตีเป้าหมายที่มีโล่หรือตั้งรับ จะทำลายโล่ 35% ทันทีและติดสถานะเกราะร้าว (ลดป้องกัน/ป้องกันวิชา 8 นาที · คูลดาวน์ 8 นาที)',
          params: { shieldBreakRatio: 0.35, armorReductionRatio: 0.25, status: 'armorbreak', dur: 8, icdTicks: 8 }
        }
      ],
      descTh: 'กระบี่เทพสีเขียวครามเย็นยะเยือกที่หลอมจากเหล็กนิลและทองคำบริสุทธิ์ คมกริบดั่งตัดเหล็กไหลเหมือนตัดโคลน'
    },
    {
      id: 'LEG_WPN_XUANTIE_HEAVY_SWORD',
      nameTh: 'กระบี่เหล็กนิลไร้คม',
      chineseName: '玄铁重剑',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Jin Yong — The Return of the Condor Heroes (《神雕侠侣》)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'SWORD',
      visualSubtype: 'HEAVY_SWORD',
      visualKey: 'vis_xuantie_heavy_sword',
      presentationMode: 'held',
      tier: 7,
      minStage: 5,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.35,
      value: 4700,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['XIAN', 'BODY', 'ANY'],
      preferredSubs: ['SWORD_IMMORTAL', 'SOLAR_FORGE', 'TITAN_MOUNTAIN_BODY'],
      reqStrength: 58,
      fixedStats: { atk: 920, matk: 340, def: 260, pen: 24, critDmg: 28, move: -8, cast: -6, acc: 140 },
      effects: [
        {
          effectId: 'EFX_LEG_XUANTIE_CRUSH',
          nameTh: 'กระบี่หนักไร้คมถล่มขุนเขา',
          descTh: 'ยิ่งพละกำลังสูงยิ่งรุนแรง (เมื่อพละกำลัง ≥ 60 เพิ่มความเสียหาย +16%) และทุกครั้งที่ฟาดโดนจะสั่นสะเทือนทำให้อีกฝ่ายเชื่องช้า (คูลดาวน์ 9 นาที)',
          params: { minStrength: 60, bonusDmgMult: 0.16, armorReductionRatio: 0.30, status: 'slow', dur: 6, icdTicks: 9 }
        }
      ],
      descTh: 'กระบี่เหล็กนิลดำทะมึนหนักแปดสิบเอ็ดชั่ง ปลายมนไร้คม อาศัยกำลังภายในและพละกำลังมหาศาลบดขยี้ทุกกระบวนท่า'
    },
    {
      id: 'LEG_WPN_TULONG_SABER',
      nameTh: 'ดาบฆ่ามังกรบัญชาหล้า',
      chineseName: '屠龙刀',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Jin Yong — The Heaven Sword and Dragon Saber (《倚天屠龙记》)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'BLADE',
      visualSubtype: 'HEAVY_BLADE',
      visualKey: 'vis_tulong_saber',
      presentationMode: 'held',
      tier: 7,
      minStage: 5,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.35,
      value: 4900,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['BODY', 'DEMON', 'GOD', 'ANY'],
      preferredSubs: ['WAR_DEITY', 'BLOOD_DEMON', 'HEAVEN_DEVOURING_DEMON', 'BLOOD_DRAGON'],
      fixedStats: { atk: 940, matk: 280, hp: 520, def: 240, crit: 8, critDmg: 30, pen: 16, acc: 155 },
      effects: [
        {
          effectId: 'EFX_LEG_TULONG_DECREE',
          nameTh: 'ราชันศาสตราข่มขวัญยุทธภพ',
          descTh: 'เมื่อโจมตีจะแผ่ปราณมังกรข่มขวัญศัตรูให้ติดสถานะอ่อนแอ และปลุกขวัญกำลังใจผู้ถือครอง (คูลดาวน์ 10 นาที)',
          params: { targetStatus: 'weaken', selfStatus: 'morale', bonusDmgMult: 0.14, dur: 8, icdTicks: 10 }
        }
      ],
      descTh: 'ดาบใหญ่นิลกาฬหนักกว่าร้อยชั่ง สันดาบสลักลายมังกรคำราม ผู้ครอบครองเปรียบดั่งผู้ถือโองการแห่งยุทธภพ'
    },
    {
      id: 'LEG_WPN_FULL_MOON_SCIMITAR',
      nameTh: 'ดาบโค้งจันทร์เพ็ญสะท้อนเงา',
      chineseName: '圆月弯刀',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Gu Long — Full Moon Scimitar (《圆月弯刀》)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'BLADE',
      visualSubtype: 'BLADE',
      visualKey: 'vis_full_moon_scimitar',
      presentationMode: 'held',
      tier: 6,
      minStage: 4,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.30,
      value: 3400,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['DEMON', 'XIAN', 'ANY'],
      preferredSubs: ['SHADOW_ASSASSIN', 'PHANTOM_SOUL', 'BLOOD_DEMON'],
      fixedStats: { atk: 590, matk: 360, eva: 180, acc: 175, crit: 12, critDmg: 26, move: 8, cast: 8 },
      effects: [
        {
          effectId: 'EFX_LEG_MOON_ARC',
          nameTh: 'จันทร์เสี้ยวฟังพิรุณยามวิกาล',
          descTh: 'เมื่อโจมตีติดคริติคอลหรือสู้ในยามค่ำคืน จะฟาดประกายดาบจันทร์เสี้ยวซ้ำ สร้างแผลเลือดไหลและเพิ่มความแรง +18% (คูลดาวน์ 7 นาที)',
          params: { critOrNightBonusMult: 0.18, status: 'bleed', dur: 6, icdTicks: 7 }
        }
      ],
      descTh: 'ดาบโค้งเรียวดั่งจันทร์วันเพ็ญ บนใบดาบสลักอักษร「หอเล็กฟังเสียงฝนฤดูใบไม้ผลิยามค่ำคืน」รวดเร็วและลี้ลับยากหยั่งถึง'
    },
    {
      id: 'LEG_WPN_XIAOLI_HEART_DAGGER',
      nameTh: 'มีดสั้นเสี่ยวหลี่สะท้านภพ',
      chineseName: '小李飞刀',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Gu Long — Sentimental Swordsman, Ruthless Sword (《多情剑客无情剑》)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'BLADE',
      visualSubtype: 'DAGGER',
      visualKey: 'vis_xiaoli_dagger',
      presentationMode: 'held_and_orbit',
      tier: 7,
      minStage: 5,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.35,
      value: 4600,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['HEART_SOUL', 'XIAN', 'ANY'],
      preferredSubs: ['MIND_SWORD_TELEKINESIS', 'ZEN_VOID_MIND', 'SHADOW_ASSASSIN'],
      fixedStats: { atk: 540, matk: 720, acc: 260, crit: 14, critDmg: 34, pen: 22, cast: 14, move: 6 },
      effects: [
        {
          effectId: 'EFX_LEG_XIAOLI_TRUE_STRIKE',
          nameTh: 'มีดบินไม่เคยพลาดเป้า',
          descTh: 'ใช้ปราณ 4% เพื่อซัดมีดบินที่ไม่อาจหลบหลีกได้ ทะลวงเกราะ +22% และเปิดช่องโหว่เป้าหมาย (คูลดาวน์ 9 นาที)',
          params: { qiCostPct: 0.04, bonusPen: 22, bonusDmgMult: 0.20, status: 'exposed', dur: 6, icdTicks: 9 }
        }
      ],
      descTh: 'มีดสั้นยาวสามนิ้วเจ็ดหุนที่ดูเรียบง่ายแต่แฝงเจตจำนงแห่งความเที่ยงธรรมและเมตตา เมื่อซัดออกแล้วย่อมไม่เคยพลาดเป้า'
    },
    {
      id: 'LEG_WPN_DAGOU_JADE_STAFF',
      nameTh: 'พลองหยกเขียวตีสุนัข',
      chineseName: '打狗棒',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Jin Yong — The Legend of the Condor Heroes / Demi-Gods and Semi-Devils (《射雕英雄传》/《天龙八部》)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'STAFF',
      visualSubtype: 'STAFF',
      visualKey: 'vis_dagou_jade_staff',
      presentationMode: 'held',
      tier: 6,
      minStage: 4,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.30,
      value: 3500,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['BODY', 'XIAN', 'HEART_SOUL', 'ANY'],
      preferredSubs: ['STAFF_GUARD', 'VAJRA_BODHI', 'YIN_YANG_HARMONY'],
      fixedStats: { atk: 560, matk: 320, def: 280, mdef: 210, eva: 170, acc: 180, move: 10, cast: 8 },
      effects: [
        {
          effectId: 'EFX_LEG_DAGOU_REDIRECTION',
          nameTh: 'พลองหยกแปดเคล็ดพันสกัด',
          descTh: 'เมื่อถูกโจมตีหรือปะทะ จะใช้ความยืดหยุ่นของพลองหยกเกี่ยวสกัดขาอีกฝ่ายให้ช้าลงและตั้งท่าปัดสวน (คูลดาวน์ 8 นาที)',
          params: { targetStatus: 'slow', selfStatus: 'evadeUp', dur: 7, icdTicks: 8 }
        }
      ],
      descTh: 'พลองไม้ไผ่หยกสีเขียวมรกตโปร่งแสง เหนียวแน่นไม่หักงอและเบาคล่องตัว พลิกแพลงกระบวนท่าสกัดจุดและยืมแรงศัตรูได้เป็นเลิศ'
    },
    {
      id: 'LEG_WPN_OVERLORD_SPEAR',
      nameTh: 'ทวนราชันย์พิชิตพยัคฆ์',
      chineseName: '霸王枪',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Gu Long — The Overlord Spear, Seven Weapons #5 (《七种武器·霸王枪》)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'SPEAR',
      visualSubtype: 'SPEAR',
      visualKey: 'vis_overlord_spear',
      presentationMode: 'held',
      tier: 6,
      minStage: 4,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.30,
      value: 3450,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['BODY', 'GOD', 'ANY'],
      preferredSubs: ['WAR_DEITY', 'THUNDER_BODY', 'BLOOD_DRAGON'],
      fixedStats: { atk: 640, matk: 260, def: 180, acc: 175, crit: 9, critDmg: 22, pen: 20 },
      effects: [
        {
          effectId: 'EFX_LEG_OVERLORD_COURAGE',
          nameTh: 'ทวนราชันย์คือความกล้าหาญ',
          descTh: 'ยิ่งผู้ถือมีความกล้าหาญสูงหรือสู้กับศัตรูที่แข็งแกร่งกว่า จะเพิ่มความแรง +15% และฟื้นฟูแรงกาย/ปราณ 4% (คูลดาวน์ 8 นาที)',
          params: { courageBonusMult: 0.15, qiRestorePct: 0.04, armorReductionRatio: 0.22, icdTicks: 8 }
        }
      ],
      descTh: 'ทวนเหล็กกล้ายาวหนึ่งจั้งสามฉื่อเจ็ดชุ่น พู่ทวนสีชาดโบกสะบัด แฝงจิตวิญญาณแห่งความกล้าหาญที่ไม่หวั่นเกรงต่ออุปสรรคใด'
    },
    {
      id: 'LEG_WPN_OATHBREAKER_DRAGON_LANCE',
      nameTh: 'ทวนเกล็ดมังกรครามสัตย์สาบาน',
      chineseName: '苍龙誓约枪',
      provenanceType: 'ORIGINAL',
      literarySource: 'Original JianghuSect Design (Divine/Body Spear Archetype)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'SPEAR',
      visualSubtype: 'SPEAR',
      visualKey: 'vis_azure_dragon_lance',
      presentationMode: 'held',
      tier: 7,
      minStage: 5,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.35,
      value: 4750,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['GOD', 'BODY', 'XIAN', 'ANY'],
      preferredSubs: ['WAR_DEITY', 'OCEAN_SOVEREIGN', 'BLOOD_DRAGON', 'THUNDER_BODY'],
      fixedStats: { atk: 790, matk: 520, def: 250, mdef: 240, hp: 420, pen: 18, acc: 185 },
      effects: [
        {
          effectId: 'EFX_LEG_DRAGON_LANCE_WARD',
          nameTh: 'คมทวนมังกรครามพิทักษ์สัตย์',
          descTh: 'เมื่อใช้กระบวนท่าหรือปะทะ จะสร้างเกราะเกล็ดมังกรรับความเสียหาย 12% ของเลือดสูงสุด และแทงทะลุเกราะศัตรู (คูลดาวน์ 9 นาที)',
          params: { shieldHpPct: 0.12, bonusDmgMult: 0.14, dur: 8, icdTicks: 9 }
        }
      ],
      descTh: 'ทวนยาวหลอมจากเกล็ดมังกรครามและทองคำอัสนี สร้างขึ้นตามคำสัตย์สาบานของผู้พิทักษ์ศาลบรรพกาล'
    },
    {
      id: 'LEG_WPN_WRATHFUL_TIGER_GAUNTLETS',
      nameTh: 'สนับหมัดพยัคฆ์พิโรธสะท้านผา',
      chineseName: '愤怒铁拳套',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Gu Long — Fist / The Angry Little Horse (《拳头》/《愤怒的小马》 adaptation)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'FIST',
      visualSubtype: 'FIST',
      visualKey: 'vis_wrathful_tiger_gauntlets',
      presentationMode: 'held',
      tier: 6,
      minStage: 4,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.30,
      value: 3380,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['BODY', 'DEMON', 'ANY'],
      preferredSubs: ['TIGER_SOVEREIGN', 'BLOOD_DRAGON', 'VAJRA_BODHI', 'DEVOURING_FIEND'],
      fixedStats: { atk: 620, matk: 210, hp: 460, def: 220, crit: 9, critDmg: 22, cast: 14, pen: 14 },
      effects: [
        {
          effectId: 'EFX_LEG_TIGER_FIST_RESOLVE',
          nameTh: 'หมัดเหล็กพิทักษ์สหาย',
          descTh: 'เมื่อเลือดต่ำกว่า 75% หรือสู้เคียงข้างสหาย จะระเบิดพลังหมัดเพิ่มความเสียหาย +16% และฟื้นฟูเลือด 5% (คูลดาวน์ 8 นาที)',
          params: { bonusDmgMult: 0.16, hpRestorePct: 0.05, icdTicks: 8 }
        }
      ],
      descTh: 'สนับหมัดเหล็กไหลหุ้มเอ็นพยัคฆ์ราชันย์ เปล่งอานุภาพสูงสุดเมื่อผู้ถือครองออกหมัดเพื่อปกป้องสหายและผู้บริสุทธิ์'
    },
    {
      id: 'LEG_WPN_CONDOR_METEOR_BOW',
      nameTh: 'ธนูเหล็กไหลยิงอินทรีคู่',
      chineseName: '射雕陨铁神弓',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Jin Yong — The Legend of the Condor Heroes (《射雕英雄传》 adaptation)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'BOW',
      visualSubtype: 'BOW',
      visualKey: 'vis_condor_meteor_bow',
      presentationMode: 'held',
      tier: 6,
      minStage: 4,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.30,
      value: 3420,
      craft: 'FORGING',
      durability: 100,
      compatiblePath: ['XIAN', 'BODY', 'GOD', 'ANY'],
      preferredSubs: ['STAR_ARCHER', 'TOTEM_BEAST_GOD', 'WAR_DEITY'],
      fixedStats: { atk: 610, matk: 380, acc: 250, crit: 11, critDmg: 24, pen: 16, move: 6 },
      effects: [
        {
          effectId: 'EFX_LEG_TWIN_CONDOR_SHOT',
          nameTh: 'ศรเดียวทะลวงอินทรีคู่',
          descTh: 'เมื่อยิงโจมตี จะปล่อยศรวายุลูกที่สองทะลวงเกราะเป้าหมาย (+18% ความเสียหาย และลดเกราะป้องกัน · คูลดาวน์ 8 นาที)',
          params: { bonusDmgMult: 0.18, armorReductionRatio: 0.20, status: 'armorbreak', dur: 7, icdTicks: 8 }
        }
      ],
      descTh: 'คันธนูศึกเขาควายบรรพกาลหลอมประสานเหล็กไหลอุกกาบาต สายธนูขึงด้วยเอ็นอสูรวายุ แม่นยำและทรงพลังดั่งศรทะลวงอินทรีคู่บนท้องทุ่ง'
    },
    {
      id: 'LEG_WPN_PEACOCK_PLUME_FOCUS',
      nameTh: 'ขนนกยูงทองคำกลไกสวรรค์',
      chineseName: '孔雀翎',
      provenanceType: 'ADAPTATION_FROM_CANON',
      literarySource: 'Gu Long — The Peacock Plume, Seven Weapons #2 (《七种武器·孔雀翎》)',
      cat: 'EQUIPMENT',
      out: 'EQUIPMENT',
      slot: 'WEAPON',
      gearType: 'FOCUS',
      visualSubtype: 'FOCUS',
      visualKey: 'vis_peacock_plume_focus',
      presentationMode: 'held_and_orbit',
      tier: 7,
      minStage: 5,
      rarity: 'Legendary',
      grade: 'Legendary',
      legendary: true,
      unique: true,
      q: 1.35,
      value: 4850,
      craft: 'ARRAY',
      durability: 100,
      compatiblePath: ['XIAN', 'HEART_SOUL', 'GOD', 'DEMON', 'ANY'],
      preferredSubs: ['ASTRAL_ARRAY', 'FIVE_ELEMENTS', 'CALLIGRAPHY_PAINTING_SAGE', 'FATE_ORACLE', 'VENOM_GU_SOVEREIGN'],
      fixedStats: { atk: 320, matk: 890, mdef: 260, acc: 245, crit: 12, critDmg: 28, cast: 16, pen: 16 },
      effects: [
        {
          effectId: 'EFX_LEG_PEACOCK_RADIANCE',
          nameTh: 'ขนนกยูงรำแพนคือความเชื่อมั่น',
          descTh: 'เสริมความเชื่อมั่นและสมาธิ (ลดจิตมาร/ความกลัว) และเมื่อร่ายวิชาจะแผ่รัศมีขนนกยูงพร่าตาเป้าหมายและสร้างความเสียหายวิชา +18% (คูลดาวน์ 9 นาที)',
          params: { bonusDmgMult: 0.18, targetStatus: 'blind', selfStatus: 'morale', cleanseHeartDemon: 4, dur: 7, icdTicks: 9 }
        }
      ],
      descTh: 'กระบอกทองคำบริสุทธิ์สลักกลไกซับซ้อน ยามสำแดงอานุภาพจะเปล่งแสงเจ็ดสีดั่งนกยูงรำแพน ทว่าพลังที่แท้จริงคือความเชื่อมั่นอันไม่สั่นคลอนของผู้ถือครอง'
    }
  ];

  const LEG_WPN_EL_PROFILES = {
    LEG_WPN_YITIAN_SWORD: { el: 'WATER_ICE', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'WATER_ICE', weights: { WATER_ICE: 0.55, EARTH_METAL: 0.45 } } },
    LEG_WPN_XUANTIE_HEAVY_SWORD: { el: 'EARTH_METAL', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'EARTH_METAL', weights: { EARTH_METAL: 0.75, FIRE: 0.25 } } },
    LEG_WPN_TULONG_SABER: { el: 'FIRE', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'FIRE', weights: { FIRE: 0.55, EARTH_METAL: 0.45 } } },
    LEG_WPN_FULL_MOON_SCIMITAR: { el: 'YIN_SHADOW', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'YIN_SHADOW', weights: { YIN_SHADOW: 0.65, WATER_ICE: 0.35 } } },
    LEG_WPN_XIAOLI_HEART_DAGGER: { el: 'LIGHT_YANG', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'LIGHT_YANG', weights: { LIGHT_YANG: 0.65, ASTRAL: 0.35 } } },
    LEG_WPN_DAGOU_JADE_STAFF: { el: 'WOOD_LIFE', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'WOOD_LIFE', weights: { WOOD_LIFE: 0.60, WIND: 0.40 } } },
    LEG_WPN_OVERLORD_SPEAR: { el: 'FIRE', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'FIRE', weights: { FIRE: 0.60, LIGHT_YANG: 0.40 } } },
    LEG_WPN_OATHBREAKER_DRAGON_LANCE: { el: 'LIGHTNING', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'LIGHTNING', weights: { LIGHTNING: 0.55, WATER_ICE: 0.45 } } },
    LEG_WPN_WRATHFUL_TIGER_GAUNTLETS: { el: 'EARTH_METAL', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'EARTH_METAL', weights: { EARTH_METAL: 0.65, FIRE: 0.35 } } },
    LEG_WPN_CONDOR_METEOR_BOW: { el: 'WIND', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'WIND', weights: { WIND: 0.60, ASTRAL: 0.40 } } },
    LEG_WPN_PEACOCK_PLUME_FOCUS: { el: 'LIGHT_YANG', profile: { mode: 'INTRINSIC_WEIGHTED', primary: 'LIGHT_YANG', weights: { LIGHT_YANG: 0.55, ASTRAL: 0.45 } } }
  };
  LEGENDARY_WEAPONS.forEach(w => {
    const ep = LEG_WPN_EL_PROFILES[w.id];
    if (ep) {
      w.element = ep.el;
      w.elementProfile = ep.profile;
    }
  });
  VC.LEGENDARY_WEAPONS = LEGENDARY_WEAPONS;
  VC.LEGENDARY_WEAPON_BY_ID = Object.fromEntries(LEGENDARY_WEAPONS.map(w => [w.id, w]));

  // Register Legendary Weapons in JD.ITEMS.items and ECO.itemById without adding repeatable recipes
  LEGENDARY_WEAPONS.forEach(w => {
    if (!JD.ITEMS.items.some(x => x.id === w.id)) {
      JD.ITEMS.items.push(w);
    }
    ECO.itemById[w.id] = w;
  });

  // Canonical quality accessor & normalization so `it.q` and `it.quality` never diverge or double-scale
  VC.gearQuality = it => {
    if (!it || typeof it !== 'object') return 1;
    const raw = Number.isFinite(it.q) ? it.q : (Number.isFinite(it.quality) ? it.quality : 1);
    return clamp(Math.round(raw * 100) / 100, 0.7, 1.75);
  };
  VC.normalizeGearItem = it => {
    if (!it || typeof it !== 'object' || it._vcNorm) return it;
    Object.defineProperty(it, '_vcNorm', { value: 1, enumerable: false, configurable: true, writable: true });
    const q = VC.gearQuality(it);
    it.q = q;
    if (!Object.getOwnPropertyDescriptor(it, 'quality')) {
      Object.defineProperty(it, 'quality', {
        get() { return this.q; },
        set(v) { if (Number.isFinite(v)) this.q = clamp(Math.round(v * 100) / 100, 0.7, 1.75); },
        enumerable: false,
        configurable: true
      });
    }
    const def = ECO.itemById[it.id];
    if (def) {
      if (def.gearType) it.gearType = def.gearType;
      if (def.visualSubtype) it.visualSubtype = def.visualSubtype;
      if (def.visualKey) it.visualKey = def.visualKey;
      if (def.presentationMode) it.presentationMode = def.presentationMode;
      if (def.legendary) {
        it.legendary = true;
        it.rarity = 'Legendary';
        it.grade = 'Legendary';
        it.unique = !!def.unique;
      }
      if (def.effects && (!Array.isArray(it.fx) || !it.fx.length)) {
        it.fx = def.effects.map(e => Object.assign({}, e));
      }
    }
    if (!it.rarity) it.rarity = it.legendary ? 'Legendary' : (it.tier >= 6 ? 'Exceptional' : it.tier >= 4 ? 'Rare' : it.tier >= 2 ? 'Refined' : 'Common');
    return it;
  };

  // Override ST.gearStats to use authored fixedStats on legendary weapons (scaled once by q / baseDefQ)
  const origGearStats = ST.gearStats;
  ST.gearStats = it => {
    if (!it) return {};
    if (it.st && it._vcNorm) return it.st;
    VC.normalizeGearItem(it);
    const def = VC.LEGENDARY_WEAPON_BY_ID[it.id];
    if (def && def.fixedStats) {
      const qRatio = clamp(VC.gearQuality(it) / (def.q || 1.35), 0.75, 1.25);
      if (it.st && it._stQ === qRatio) return it.st;
      const s = {};
      for (const [k, val] of Object.entries(def.fixedStats)) {
        s[k] = (k === 'crit' || k === 'critDmg' || k === 'pen' || k === 'move' || k === 'cast')
          ? Math.round(val * 10) / 10
          : Math.round(val * qRatio * 10) / 10;
      }
      it.st = s;
      it._stQ = qRatio;
      return s;
    }
    return origGearStats(it);
  };

  // Wrap ECO.mintGear so minted legendary weapons carry full metadata, UID, and normalized q/quality
  const prevMintGear = ECO.mintGear;
  ECO.mintGear = function (a, b, c, d) {
    const it = prevMintGear.apply(this, arguments);
    if (!it) return it;
    VC.normalizeGearItem(it);
    const def = VC.LEGENDARY_WEAPON_BY_ID[it.id];
    if (def) {
      it.nameTh = def.nameTh;
      it.gearType = def.gearType;
      it.visualSubtype = def.visualSubtype;
      it.visualKey = def.visualKey;
      it.presentationMode = def.presentationMode;
      it.legendary = true;
      it.rarity = 'Legendary';
      it.grade = 'Legendary';
      it.unique = true;
      it.minStage = def.minStage || 5;
      it.value = def.value || 4500;
      if (!it.uid) it.uid = 'uid_' + def.id + '_' + (++ VC._uidSeq);
      ST.gearStats(it);
    }
    return it;
  };
  VC._uidSeq = 100;

  VC.mintLegendaryWeapon = (W, id, source) => {
    const def = VC.LEGENDARY_WEAPON_BY_ID[id] || ECO.itemById[id];
    if (!def) return null;
    const it = ECO.mintGear(def, def.q || 1.35);
    if (source) it.mintSource = source;
    return it;
  };

  const prevGearUsable = M.gearUsable;
  M.gearUsable = (n, it) => {
    if (!prevGearUsable(n, it)) return false;
    const def = it && VC.LEGENDARY_WEAPON_BY_ID[it.id];
    if (def && def.reqStrength && E(n, 'physiology.strength') < def.reqStrength) return false;
    return true;
  };

  // Enhance M.gearSuitability so NPCs evaluate legendary weapon requirements (e.g., Xuantie strength requirement) and signature effects honestly
  const prevGearSuitability = M.gearSuitability;
  M.gearSuitability = (n, it, price) => {
    const res = prevGearSuitability(n, it, price);
    if (!it || !n || !n.cult || !Number.isFinite(res.score)) return res;
    const def = VC.LEGENDARY_WEAPON_BY_ID[it.id];
    if (!def) return res;
    let bonus = 0;
    const reasons = res.reasons ? res.reasons.slice() : [];
    if (def.reqStrength) {
      const str = E(n, 'physiology.strength');
      if (str < def.reqStrength) {
        return Object.assign({}, res, {
          ok: false,
          usable: false,
          score: -999,
          rawPower: 0,
          reasons: ['พละกำลังไม่พอคุมกระบี่หนัก (' + Math.round(str) + '/' + def.reqStrength + ')']
        });
      } else {
        bonus += 95;
        reasons.push('พละกำลังแกร่งพอคุมศาสตราหนัก');
      }
    }
    if (Array.isArray(def.preferredSubs) && def.preferredSubs.includes(n.cult.sub)) {
      bonus += 135;
      reasons.push('สอดคล้องกับสายย่อยโดยตรง');
    }
    if (def.effects && def.effects.length) {
      bonus += 65;
      reasons.push('ผลพิเศษระดับตำนาน: ' + def.effects[0].nameTh);
    }
    return Object.assign({}, res, {
      score: res.score + bonus,
      rawPower: (res.rawPower || res.score) + bonus,
      reasons
    });
  };

  /* ---------- Real Combat Effect Execution for Equipped Legendary Weapons ---------- */
  VC.runWeaponProcs = (W, f, attacker, defender, isSkill, strikeResult) => {
    if (!attacker || attacker.foe || attacker.dead || !defender || (f && f._inWpnProc)) return null;
    const wpn = attacker.equip && attacker.equip.WEAPON;
    if (!wpn || (M.gearUsable && !M.gearUsable(attacker, wpn))) return null;
    const fxList = wpn.fx || (VC.LEGENDARY_WEAPON_BY_ID[wpn.id] && VC.LEGENDARY_WEAPON_BY_ID[wpn.id].effects);
    if (!Array.isArray(fxList) || !fxList.length) return null;
    if (!strikeResult || typeof strikeResult !== 'object') {
      strikeResult = { dmg: typeof isSkill === 'number' ? isSkill : 100, crit: true };
    }
    if (attacker._legProcCd && Object.keys(attacker._legProcCd).length === 0) {
      attacker.wpnProcCds = {};
      delete attacker._legProcCd;
    }

    let triggeredProc = null;
    if (f) f._inWpnProc = true;
    try {
      attacker.wpnProcCds = attacker.wpnProcCds || {};
      for (const fx of fxList) {
        const eid = fx.effectId;
        const p = fx.params || {};
        const icd = Math.max(2, p.icdTicks || 8);
        if ((attacker.wpnProcCds[eid] || 0) > W.t) continue;

        if (eid === 'EFX_LEG_YITIAN_SEVER') {
          attacker.wpnProcCds[eid] = W.t + icd;
          const breakRatio = p.shieldBreakRatio || 0.35;
          const sh = ST.statusOf(defender, 'shield');
          let severedShield = 0;
          if (sh && sh.amt > 0) {
            const cut = Math.max(1, Math.round(sh.amt * breakRatio));
            severedShield += cut;
            sh.amt = Math.max(0, sh.amt - cut);
            if (sh.amt <= 0) ST.clearStatus(defender, x => x.k === 'shield');
          }
          if (defender.shieldBp && defender.shieldBp > 0) {
            const cutBp = Math.max(1, Math.round(defender.shieldBp * breakRatio));
            severedShield += cutBp;
            defender.shieldBp = Math.max(0, defender.shieldBp - cutBp);
          }
          if (defender.shield && defender.shield > 0) {
            const cutS = Math.max(1, Math.round(defender.shield * breakRatio));
            severedShield += cutS;
            defender.shield = Math.max(0, defender.shield - cutS);
          }
          if (COMBAT.alive(defender)) ST.addStatus(defender, p.status || 'armorbreak', p.dur || 8);
          attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid, severedShield }; triggeredProc = attacker.lastWeaponProc;
        } else if (eid === 'EFX_LEG_XUANTIE_CRUSH') {
          attacker.wpnProcCds[eid] = W.t + icd;
          const str = E(attacker, 'physiology.strength');
          if (str >= (p.minStrength || 60) && strikeResult && strikeResult.dmg > 0 && COMBAT.alive(defender)) {
            const extra = Math.max(1, Math.round(strikeResult.dmg * (p.bonusDmgMult || 0.16)));
            COMBAT.applyDamage(W, f, attacker, defender, extra, 'แรงกระแทกกระบี่หนัก');
            strikeResult.dmg += extra;
          }
          if (COMBAT.alive(defender)) ST.addStatus(defender, p.status || 'slow', p.dur || 6);
          attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
        } else if (eid === 'EFX_LEG_TULONG_DECREE') {
          attacker.wpnProcCds[eid] = W.t + icd;
          if (COMBAT.alive(defender)) ST.addStatus(defender, p.targetStatus || 'weaken', p.dur || 8);
          ST.addStatus(attacker, p.selfStatus || 'morale', p.dur || 8);
          attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
        } else if (eid === 'EFX_LEG_MOON_ARC') {
          const hour = (W.t % 1440) / 60;
          const isNight = hour >= 19 || hour < 5;
          if ((strikeResult && strikeResult.crit) || isNight) {
            attacker.wpnProcCds[eid] = W.t + icd;
            if (strikeResult && strikeResult.dmg > 0 && COMBAT.alive(defender)) {
              const extra = Math.max(1, Math.round(strikeResult.dmg * (p.critOrNightBonusMult || 0.18)));
              COMBAT.applyDamage(W, f, attacker, defender, extra, 'ประกายดาบจันทร์เพ็ญ');
              strikeResult.dmg += extra;
            }
            if (COMBAT.alive(defender)) ST.addStatus(defender, p.status || 'bleed', p.dur || 6);
            attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
          }
        } else if (eid === 'EFX_LEG_XIAOLI_TRUE_STRIKE') {
          const qm = CULT.qiMax(attacker);
          const needQi = Math.max(1, Math.round(qm * (p.qiCostPct || 0.04)));
          if ((attacker.h.state.qi || 0) >= needQi) {
            attacker.wpnProcCds[eid] = W.t + icd;
            attacker.h.state.qi = Math.max(0, attacker.h.state.qi - needQi);
            if (strikeResult && strikeResult.dmg > 0 && COMBAT.alive(defender)) {
              const extra = Math.max(1, Math.round(strikeResult.dmg * (p.bonusDmgMult || 0.20)));
              COMBAT.applyDamage(W, f, attacker, defender, extra, 'มีดบินเสี่ยวหลี่');
              strikeResult.dmg += extra;
            }
            if (COMBAT.alive(defender)) ST.addStatus(defender, p.status || 'exposed', p.dur || 6);
            attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
          }
        } else if (eid === 'EFX_LEG_OVERLORD_COURAGE') {
          attacker.wpnProcCds[eid] = W.t + icd;
          const courage = E(attacker, 'personality.courage');
          if (courage >= 55 && strikeResult && strikeResult.dmg > 0 && COMBAT.alive(defender)) {
            const extra = Math.max(1, Math.round(strikeResult.dmg * (p.courageBonusMult || 0.15)));
            COMBAT.applyDamage(W, f, attacker, defender, extra, 'คมทวนราชันย์');
            strikeResult.dmg += extra;
          }
          if (p.qiRestorePct && attacker.cult) {
            const qm = CULT.qiMax(attacker);
            attacker.h.state.qi = Math.min(qm, (attacker.h.state.qi || 0) + qm * p.qiRestorePct);
          }
          attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
        } else if (eid === 'EFX_LEG_DRAGON_LANCE_WARD') {
          attacker.wpnProcCds[eid] = W.t + icd;
          const hm = COMBAT.hpMax(attacker);
          ST.addStatus(attacker, 'shield', p.dur || 8, { amt: Math.max(10, Math.round(hm * (p.shieldHpPct || 0.12))) });
          if (strikeResult && strikeResult.dmg > 0 && COMBAT.alive(defender)) {
            const extra = Math.max(1, Math.round(strikeResult.dmg * (p.bonusDmgMult || 0.14)));
            COMBAT.applyDamage(W, f, attacker, defender, extra, 'หอกมังกรคราม');
            strikeResult.dmg += extra;
          }
          attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
        } else if (eid === 'EFX_LEG_TIGER_FIST_RESOLVE') {
          attacker.wpnProcCds[eid] = W.t + icd;
          const hm = COMBAT.hpMax(attacker);
          const hpLow = COMBAT.hp(attacker) <= hm * 0.75;
          const hasAllies = !!(f && Array.isArray(f.A) && Array.isArray(f.B) && COMBAT.alliesOf(W, f, attacker.id).length > 1);
          if ((hpLow || hasAllies) && strikeResult && strikeResult.dmg > 0 && COMBAT.alive(defender)) {
            const extra = Math.max(1, Math.round(strikeResult.dmg * (p.bonusDmgMult || 0.16)));
            COMBAT.applyDamage(W, f, attacker, defender, extra, 'หมัดพยัคฆ์พิโรธ');
            strikeResult.dmg += extra;
          }
          if (p.hpRestorePct && !attacker.dead) {
            COMBAT.setHp(attacker, Math.min(hm, COMBAT.hp(attacker) + Math.max(1, Math.round(hm * p.hpRestorePct))));
          }
          attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
        } else if (eid === 'EFX_LEG_TWIN_CONDOR_SHOT') {
          attacker.wpnProcCds[eid] = W.t + icd;
          if (strikeResult && strikeResult.dmg > 0 && COMBAT.alive(defender)) {
            const extra = Math.max(1, Math.round(strikeResult.dmg * (p.bonusDmgMult || 0.18)));
            COMBAT.applyDamage(W, f, attacker, defender, extra, 'ศรวายุลูกที่สอง');
            strikeResult.dmg += extra;
          }
          if (COMBAT.alive(defender)) ST.addStatus(defender, p.status || 'armorbreak', p.dur || 7);
          attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
        } else if (eid === 'EFX_LEG_PEACOCK_RADIANCE') {
          attacker.wpnProcCds[eid] = W.t + icd;
          if (p.cleanseHeartDemon && attacker.h && attacker.h.state) {
            attacker.h.state.heartDemon = Math.max(0, (attacker.h.state.heartDemon || 0) - p.cleanseHeartDemon);
            attacker.h.state.fear = Math.max(0, (attacker.h.state.fear || 0) - 5);
          }
          ST.addStatus(attacker, p.selfStatus || 'morale', p.dur || 7);
          if (COMBAT.alive(defender)) {
            ST.addStatus(defender, p.targetStatus || 'blind', p.dur || 7);
            if (strikeResult && strikeResult.dmg > 0) {
              const extra = Math.max(1, Math.round(strikeResult.dmg * (p.bonusDmgMult || 0.18)));
              COMBAT.applyDamage(W, f, attacker, defender, extra, 'รัศมีขนนกยูงทองคำ');
              strikeResult.dmg += extra;
            }
          }
          attacker.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: eid }; triggeredProc = attacker.lastWeaponProc;
        } else if (eid === 'EFX_LEG_DAGOU_REDIRECTION') {
          // Dagou Jade Staff is primarily a defensive/redirection proc when struck (`runWeaponOnStruckProcs`).
          // Only delegate from `runWeaponProcs` when invoked directly in unit tests (`typeof isSkill === 'number'` or no live `strikeResult.hit`).
          if (typeof isSkill === 'number' || !strikeResult || !strikeResult.hit) {
            const defRes = VC.runWeaponOnStruckProcs(W, f, attacker, defender, strikeResult);
            if (defRes) triggeredProc = defRes;
          }
        }
      }
      return triggeredProc;
    } finally {
      if (f) f._inWpnProc = false;
    }
  };

  VC.runWeaponOnStruckProcs = (W, f, defender, attacker, strikeResult) => {
    if (!defender || defender.foe || defender.dead || !attacker || (f && f._inWpnDefProc)) return null;
    const wpn = defender.equip && defender.equip.WEAPON;
    if (!wpn || (M.gearUsable && !M.gearUsable(defender, wpn))) return null;
    const fxList = wpn.fx || (VC.LEGENDARY_WEAPON_BY_ID[wpn.id] && VC.LEGENDARY_WEAPON_BY_ID[wpn.id].effects);
    if (!Array.isArray(fxList) || !fxList.length) return null;
    let triggeredProc = null;
    if (f) f._inWpnDefProc = true;
    try {
      defender.wpnProcCds = defender.wpnProcCds || {};
      for (const fx of fxList) {
        if (fx.effectId === 'EFX_LEG_DAGOU_REDIRECTION') {
          const p = fx.params || {};
          const icd = Math.max(2, p.icdTicks || 8);
          if ((defender.wpnProcCds[fx.effectId] || 0) > W.t) continue;
          defender.wpnProcCds[fx.effectId] = W.t + icd;
          const incomingDmg = (strikeResult && Number.isFinite(strikeResult.dmg)) ? strikeResult.dmg : 60;
          const redirDmg = Math.max(1, Math.round(incomingDmg * (p.redirectRatio || 0.14)));
          if (COMBAT.alive(attacker)) {
            COMBAT.applyDamage(W, f, defender, attacker, redirDmg, 'พลองหยกยืมแรงปัดสวน');
            ST.addStatus(attacker, p.targetStatus || 'slow', p.dur || 7);
          }
          ST.addStatus(defender, p.selfStatus || 'evadeUp', p.dur || 7);
          defender.lastWeaponProc = { triggered: true, t: W.t, weaponId: wpn.id, effectId: fx.effectId, redirectedDmg: redirDmg };
          triggeredProc = defender.lastWeaponProc;
        }
      }
      return triggeredProc;
    } finally {
      if (f) f._inWpnDefProc = false;
    }
  };

  // Hook COMBAT.strike to invoke legendary weapon offensive and defensive procs
  const origStrike = COMBAT.strike;
  COMBAT.strike = function (W, f, a, d, o) {
    const oMod = o ? Object.assign({}, o) : {};
    // If wielder has Xiaoli Heart Dagger and proc is ready, guarantee hit (forced: true)
    if (a && !a.foe && a.equip && a.equip.WEAPON && a.equip.WEAPON.id === 'LEG_WPN_XIAOLI_HEART_DAGGER' && (!M.gearUsable || M.gearUsable(a, a.equip.WEAPON))) {
      const cd = (a.wpnProcCds && a.wpnProcCds.EFX_LEG_XIAOLI_TRUE_STRIKE) || 0;
      if (W.t >= cd && (a.h.state.qi || 0) >= Math.max(1, CULT.qiMax(a) * 0.04)) {
        oMod.forced = true;
      }
    }
    const res = origStrike.call(this, W, f, a, d, oMod);
    if (res && res.hit && !(oMod && oMod.noProc)) {
      VC.runWeaponProcs(W, f, a, d, !!(oMod && oMod.isSkill), res);
      VC.runWeaponOnStruckProcs(W, f, d, a, res);
    }
    return res;
  };

  /* ============================================================================
   * 2. CLUE SOURCE CATALOG (8 Ordinary + 22 Legendary Arts + 11 Legendary Weapons = 41 Templates)
   * ============================================================================ */
  const CLUE_TEMPLATES = [
    /* --- 2.1 Eight Ordinary / Heritage / Equipment Leads (Varied 1 to 3 Steps) --- */
    {
      templateId: 'CLUE_ORD_JADE_LOTUS_2',
      titleTh: 'เบาะแสดอกบัวหยกริมตลิ่งหมอก',
      category: 'ORDINARY_MATERIAL',
      targetKind: 'MATERIAL',
      targetId: 'MAT_HERB_JADE_LOTUS_2',
      targetQty: 4,
      tier: 2,
      rarity: 'Common',
      unique: false,
      cooldownDays: 3,
      regionId: 'plains',
      visitorRoles: ['wanderer', 'merchant', 'herbalist', 'scholar', 'artisan', 'envoy'],
      rumorTextTh: 'นักเดินทางเล่าว่าพบบัวหยกเขียวร้อยปีกำลังผลิบานอยู่ริมตลิ่งทุ่งราบเมฆา',
      steps: [
        {
          nodeId: 'search_patch',
          type: 'search_site',
          approach: 'interpret_evidence',
          titleTh: 'สำรวจตลิ่งน้ำทุ่งราบเมฆา',
          locationId: 'plains',
          scope: 'party_any',
          skill: 'herbalism',
          minVal: 12,
          hintTh: 'ใช้ทักษะสมุนไพรและการสังเกตค้นหาบัวหยกริมน้ำ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_ORD_XIAN_SWORD_T1',
      titleTh: 'คำชี้แนะเพลงกระบี่พิรุณหยกจากอดีตองครักษ์',
      category: 'ORDINARY_TECHNIQUE',
      targetKind: 'TECH_MANUAL',
      targetId: 'ART190_XIAN_001',
      tier: 1,
      rarity: 'Common',
      unique: false,
      cooldownDays: 4,
      regionId: 'sect',
      visitorRoles: ['wanderer', 'scholar', 'envoy', 'merchant', 'herbalist', 'artisan'],
      rumorTextTh: 'อดีตองครักษ์พเนจรผู้มาเยือนสำนักเก็บรักษาบันทึกเพลงกระบี่พิรุณหยกเจ็ดดาว และยินดีมอบให้ผู้ที่มีความตั้งใจจริง',
      steps: [
        {
          nodeId: 'demonstrate_courtesy',
          type: 'speak_contact',
          approach: 'honor_commitment',
          titleTh: 'สนทนาและแลกเปลี่ยนท่วงท่าพื้นฐานกับแขกผู้มาเยือน',
          locationId: 'sect',
          scope: 'personal',
          statPath: 'personality.discipline',
          minVal: 32,
          hintTh: 'แสดงความมีวินัยและรักษาคำมั่นต่อแขกผู้มาเยือนในสำนัก',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_ORD_YINYANG_SWORD_T2',
      titleTh: 'จารึกเพลงกระบี่คู่หยินหยางในศาลาร้าง',
      category: 'ORDINARY_TECHNIQUE',
      targetKind: 'TECH_MANUAL',
      targetId: 'ART190_XIAN_013',
      tier: 2,
      rarity: 'Common',
      unique: false,
      cooldownDays: 5,
      regionId: 'forest',
      visitorRoles: ['scholar', 'wanderer', 'merchant', 'envoy', 'herbalist', 'artisan'],
      rumorTextTh: 'บัณฑิตพเนจรพบแผ่นไม้จารึกเพลงกระบี่คู่หยินหยางหมุนเวียนซ่อนอยู่ในศาลาร้างกลางป่าหมอกเขียว',
      steps: [
        {
          nodeId: 'inspect_shrine_wood',
          type: 'inspect_inscription',
          approach: 'interpret_evidence',
          titleTh: 'ถอดความจารึกไม้ในศาลาร้างป่าหมอกเขียว',
          locationId: 'forest',
          scope: 'party_any',
          skill: 'SCRIPTURE',
          statPath: 'intellect.comprehension',
          minVal: 22,
          hintTh: 'ใช้ความเข้าใจและอักษรศาสตร์ถอดความลำดับกระบี่คู่',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_ORD_METEOR_SWORD_5',
      titleTh: 'ข่าวคราวกระบี่อุกกาบาตของตระกูลช่างหลอมเก่า',
      category: 'ORDINARY_EQUIPMENT',
      targetKind: 'EQUIPMENT',
      targetId: 'MP_SWORD_5',
      tier: 5,
      rarity: 'Rare',
      unique: false,
      cooldownDays: 35,
      regionId: 'mountain',
      visitorRoles: ['merchant', 'artisan'],
      rumorTextTh: 'นายหน้าค้าศาสตราเผยว่าเตาหลอมร้างบนทิวเขาศิลาครามยังมีกระบี่อุกกาบาตที่ตีค้างไว้และถูกผนึกอยู่ในห้องเก็บศาสตรา',
      steps: [
        {
          nodeId: 'verify_furnace_map',
          type: 'inspect_inscription',
          titleTh: 'ตรวจสอบแผนผังเตาหลอมเก่า',
          locationId: 'sect',
          scope: 'party_any',
          skill: 'FORGING',
          minVal: 20,
          stoneCost: 60,
          hintTh: 'ใช้ความรู้ด้านการหลอมและจ่ายค่าแผนผัง 60 ศิลา',
          onPass: 'unseal_armory',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'unseal_armory',
          type: 'skill_trial',
          titleTh: 'เปิดผนึกห้องเก็บศาสตราทิวเขาศิลาคราม',
          locationId: 'mountain',
          scope: 'party_any',
          skill: 'FORGING',
          statPath: 'physiology.strength',
          minVal: 45,
          hintTh: 'ต้องใช้ช่างหลอมหรือผู้มีพละกำลังเปิดประตูหินของเตาหลอมโบราณ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_ORD_SNOW_LOTUS_5',
      titleTh: 'ร่องรอยบัวหิมะสวรรค์หมื่นปีบนยอดผาเหมันต์',
      category: 'ORDINARY_MATERIAL',
      targetKind: 'MATERIAL',
      targetId: 'MAT_HERB_SNOW_LOTUS_5',
      targetQty: 2,
      tier: 5,
      rarity: 'Rare',
      unique: false,
      cooldownDays: 30,
      regionId: 'SRC110_MW_ENV_03_FROZEN_HIGHLANDS',
      visitorRoles: ['herbalist', 'wanderer'],
      rumorTextTh: 'หมอยาแดนเหนือเห็นประกายบัวหิมะสวรรค์หมื่นปีผลิบานอยู่เหนือทุ่งทุนดราเหมันต์ แต่มีลมหนาวจัดและอสูรเฝ้าอยู่',
      steps: [
        {
          nodeId: 'endure_blizzard',
          type: 'body_trial',
          approach: 'interpret_evidence',
          titleTh: 'สำรวจเส้นทางช่องเขาน้ำแข็งบนทิวเขาศิลาคราม',
          locationId: 'mountain',
          scope: 'party_all',
          statPath: 'physiology.endurance',
          minVal: 42,
          hintTh: 'สำรวจเส้นทางต้นลมหนาวที่ทิวเขาศิลาครามก่อนมุ่งสู่ที่ราบสูงเหมันต์',
          onPass: 'harvest_snow_lotus',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'harvest_snow_lotus',
          type: 'skill_trial',
          approach: 'deliver_item',
          acceptedItemIds: ['MAT_HERB_CINDER_LEAF_1', 'P:BASIC_VIGOR'],
          titleTh: 'เดินทางต่อสู่ที่ราบสูงเหมันต์และเก็บเกี่ยวบัวหิมะสวรรค์',
          locationId: 'SRC110_MW_ENV_03_FROZEN_HIGHLANDS',
          scope: 'party_any',
          skill: 'herbalism',
          minVal: 42,
          hintTh: 'เดินทางข้ามภูมิภาคสู่ทุ่งทุนดราเหมันต์และใช้ทักษะสมุนไพรเก็บดอกบัวหิมะ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_ORD_METEOR_IRON_5',
      titleTh: 'หลุมดาวตกและแร่เหล็กไหลในทะเลทรายเพลิงอัสดง',
      category: 'ORDINARY_MATERIAL',
      targetKind: 'MATERIAL',
      targetId: 'MAT_ORE_METEOR_IRON_5',
      targetQty: 3,
      tier: 5,
      rarity: 'Rare',
      unique: false,
      cooldownDays: 12,
      regionId: 'plains',
      visitorRoles: ['merchant', 'artisan', 'wanderer', 'scholar'],
      rumorTextTh: 'กองคาราวานเห็นดาวตกพุ่งผ่านทุ่งราบเมฆาไปตกกลางเนินทรายเพลิงอัสดง ทิ้งแร่เหล็กไหลอุกกาบาตที่ยังร้อนระอุไว้',
      steps: [
        {
          nodeId: 'locate_crater',
          type: 'search_site',
          approach: 'interpret_evidence',
          titleTh: 'คำนวณวิถีดาวตกจากเศษสะเก็ดแร่ที่ทุ่งราบเมฆา',
          locationId: 'plains',
          scope: 'party_any',
          skill: 'survival',
          statPath: 'intellect.perceptiveness',
          minVal: 42,
          hintTh: 'สำรวจเศษสะเก็ดดาวตกที่ทุ่งราบเมฆาเพื่อระบุพิกัดหลุมหลักในทะเลทราย',
          onPass: 'mine_meteor_core',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'mine_meteor_core',
          type: 'skill_trial',
          approach: 'deliver_item',
          acceptedItemIds: ['MAT_ORE_BLACK_IRON_1', 'MAT_ORE_COLD_STEEL_2'],
          titleTh: 'เดินทางสู่ทะเลทรายเพลิงอัสดงเพื่อสกัดแร่เหล็กไหลอุกกาบาต',
          locationId: 'desert',
          scope: 'party_any',
          skill: 'mining',
          statPath: 'physiology.strength',
          minVal: 46,
          hintTh: 'เดินทางสู่ทะเลทรายเพลิงอัสดงและใช้ทักษะขุดเหมืองสกัดแร่เหล็กไหล',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_ORD_DRAGON_PEARL_7',
      titleTh: 'เบาะแสมุกมังกรบรรพกาลในกรุสมบัติโบราณ',
      category: 'ORDINARY_MATERIAL',
      targetKind: 'MATERIAL',
      targetId: 'MAT_BP_DRAGON_PEARL_7',
      targetQty: 1,
      tier: 7,
      rarity: 'Exceptional',
      unique: false,
      cooldownDays: 55,
      regionId: 'ruins',
      visitorRoles: ['merchant', 'scholar', 'envoy'],
      rumorTextTh: 'นักประเมินสมบัติจากหอประมูลเผยว่ามีมุกมังกรบรรพกาลของสะสมราชวงศ์เก่าถูกผนึกไว้ในซากนครโบราณ',
      steps: [
        {
          nodeId: 'buy_rubbing',
          type: 'speak_contact',
          titleTh: 'เจรจาซื้อสำเนาแผนผังกรุสมบัติจากผู้รู้เบาะแส',
          locationId: 'sect',
          scope: 'personal',
          skill: 'trading',
          minVal: 25,
          stoneCost: 140,
          hintTh: 'จ่ายศิลา 140 ก้อนเพื่อแลกแผนผังตำแหน่งกรุสมบัติ',
          onPass: 'unlock_pearl_vault',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'unlock_pearl_vault',
          type: 'skill_trial',
          titleTh: 'คลายค่ายกลผนึกกรุสมบัติซากนครโบราณ',
          locationId: 'ruins',
          scope: 'party_any',
          skill: 'ARRAY',
          statPath: 'intellect.comprehension',
          minVal: 58,
          hintTh: 'ต้องใช้ความรู้ค่ายกลคลายผนึกห้องเก็บมุกมังกร',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_ORD_WORLD_FORGE_SHARD_7',
      titleTh: 'จารึกเศษศิลาสร้างพิภพบรรพกาลในแท่นหลอมเทพ',
      category: 'HERITAGE_MATERIAL',
      targetKind: 'MATERIAL',
      targetId: 'MAT_TR_WORLD_FORGE_SHARD',
      targetQty: 1,
      tier: 7,
      rarity: 'Exceptional',
      unique: false,
      cooldownDays: 35,
      regionId: 'ruins',
      visitorRoles: ['artisan', 'scholar'],
      rumorTextTh: 'ปรมาจารย์ช่างหลอมพเนจรพบร่องรอยแท่นหลอมมรดกในซากนครโบราณที่ยังหลงเหลือเศษศิลาสร้างพิภพบรรพกาล',
      steps: [
        {
          nodeId: 'decipher_forge_stele',
          type: 'inspect_inscription',
          titleTh: 'ถอดรหัสอักขระช่างหลอมโบราณ',
          locationId: 'sect',
          scope: 'party_any',
          skill: 'SCRIPTURE',
          minVal: 45,
          hintTh: 'ตีความอักขระโบราณเพื่อระบุพิกัดแท่นหลอมมรดก',
          onPass: 'guardian_forge_construct',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'guardian_forge_construct',
          type: 'guardian_combat',
          titleTh: 'ปราบหุ่นศิลาเฝ้าแท่นหลอมบรรพกาล',
          locationId: 'ruins',
          scope: 'party_all',
          guardianNameTh: 'หุ่นศิลาเพลิงบรรพกาล',
          guardianPower: 2200,
          guardianTier: 5,
          hintTh: 'เอาชนะหุ่นศิลาที่เฝ้าแท่นหลอมมรดกด้วยการต่อสู้จริง',
          onPass: 'extract_world_shard',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'extract_world_shard',
          type: 'skill_trial',
          titleTh: 'สกัดเศษศิลาสร้างพิภพตามจังหวะไฟปราณ',
          locationId: 'ruins',
          scope: 'party_any',
          skill: 'FORGING',
          minVal: 60,
          hintTh: 'ต้องใช้ฝีมือการหลอมขั้นสูงสกัดเศษศิลาโดยไม่ให้แตกร้าว',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },

    /* --- 2.2 All 22 Existing Legendary Arts (Authored Multi-Variety Inheritance Stories) --- */
    {
      templateId: 'CLUE_LEG_ART_DUGU_NINE_SWORDS',
      titleTh: 'ร่องรอยเก้ากระบี่เดียวดายบนผาฝึกกระบี่ร้าง',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_COMBAT_DUGU_NINE_SWORDS',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'mountain',
      visitorRoles: ['wanderer', 'scholar'],
      rumorTextTh: 'นักกระบี่พเนจรผู้บาดเจ็บเล่าถึงรอยกระบี่เก้าสายบนหน้าผาร้างที่ทำลายทุกกระบวนท่าของศัตรู',
      steps: [
        {
          nodeId: 'compare_sword_scars',
          type: 'inspect_inscription',
          titleTh: 'เปรียบเทียบรอยกระบี่ทั้งเก้าสายบนผาศิลา',
          locationId: 'mountain',
          scope: 'party_any',
          skill: 'SWORD',
          statPath: 'intellect.perceptiveness',
          minVal: 55,
          hintTh: 'ใช้ความชำนาญกระบี่และสายตาสังเกตจุดตัดของรอยกระบี่',
          onPass: 'comprehend_flawless_intent',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'comprehend_flawless_intent',
          type: 'spirit_judgment',
          titleTh: 'เข้าถึงเจตจำนง「ไร้กระบวนท่าชนะมีกระบวนท่า」เฉพาะตน',
          locationId: 'mountain',
          scope: 'personal',
          statPath: 'intellect.comprehension',
          skill: 'SWORD',
          minVal: 62,
          hintTh: 'ผู้สืบทอดต้องใช้ความเข้าใจและพื้นฐานกระบี่ของตนเองอ่านช่องโหว่ (ผู้อื่นช่วยแทนไม่ได้)',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_DRAGON_SUBDUING_PALMS',
      titleTh: 'บันทึกฝ่ามือพิชิตมังกรของผู้คุ้มกันด่านเก่า',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_COMBAT_DRAGON_SUBDUING_PALMS',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'plains',
      visitorRoles: ['wanderer', 'envoy'],
      rumorTextTh: 'อดีตผู้คุ้มกันคาราวานกล่าวถึงศิลาจารึกฝ่ามือพิชิตมังกรที่ซ่อนอยู่หลังด่านชายแดน ซึ่งผู้เฝ้ามรดกจะมอบให้เฉพาะผู้มีทั้งความกล้าและความยับยั้งชั่งใจ',
      steps: [
        {
          nodeId: 'rescue_stranded_escort',
          type: 'guardian_combat',
          titleTh: 'เข้าช่วยเหลือขบวนชาวบ้านที่ถูกโจรและอสูรล้อม',
          locationId: 'plains',
          scope: 'party_all',
          guardianNameTh: 'หัวหน้าโจรทมิฬและอสูรเกราะเหล็ก',
          guardianPower: 1650,
          guardianTier: 4,
          hintTh: 'ต้านทานและขับไล่ศัตรูที่ล้อมขบวนเดินทาง',
          onPass: 'controlled_palm_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'controlled_palm_trial',
          type: 'spirit_judgment',
          titleTh: 'บททดสอบควบคุมแรงฝ่ามือโดยไม่ทำลายศิลาคุ้มภัย',
          locationId: 'plains',
          scope: 'personal',
          statPath: 'personality.courage',
          skill: 'FIST_PALM',
          minVal: 58,
          hintTh: 'ผู้รับสืบทอดต้องมีความกล้าหาญและพื้นฐานฝ่ามือที่หนักแน่นแต่รู้จักยั้งมือ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_FEIXIAN_ONE_SWORD',
      titleTh: 'ลำแสงหนึ่งกระบี่เซียนเหินเหนือยอดเมฆา',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_COMBAT_FEIXIAN_ONE_SWORD',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
      visitorRoles: ['scholar', 'envoy'],
      rumorTextTh: 'ผู้มาเยือนจากแดนไกลเล่าว่าในคืนจันทร์เพ็ญจะมีรอยกระบี่เซียนเหินปรากฏขึ้นเพียงชั่วพริบตาบนยอดซากอุทยานสวรรค์',
      steps: [
        {
          nodeId: 'feixian_personal_epiphany',
          type: 'spirit_judgment',
          titleTh: 'เพ่งจิตจับประกายหนึ่งกระบี่เซียนเหินด้วยตนเอง',
          locationId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
          scope: 'personal',
          statPath: 'intellect.intuition',
          skill: 'SWORD',
          minVal: 66,
          hintTh: 'เป็นบททดสอบเฉพาะตัวล้วน ๆ ผู้คุ้มกันไม่อาจเข้าใจแทนได้ ต้องมีสัญชาตญาณและสมาธิกระบี่สูงส่ง',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_QIANKUN_SHIFT',
      titleTh: 'แผนผังค่ายกลเคลื่อนย้ายจักรวาลในโถงถล่ม',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_AUX_QIANKUN_SHIFT',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'ruins',
      visitorRoles: ['artisan', 'scholar'],
      rumorTextTh: 'ช่างค่ายกลพเนจรพกเศษแผนผังครึ่งแผ่นของเคล็ดเคลื่อนย้ายจักรวาลพลิกผัน ซึ่งต้องใช้การปรับสมดุลหยินหยางในโถงศิลาโบราณ',
      steps: [
        {
          nodeId: 'reconstruct_pressure_diagram',
          type: 'inspect_inscription',
          titleTh: 'ต่อเติมแผนผังแรงดันปราณครึ่งแผ่น',
          locationId: 'sect',
          scope: 'party_any',
          skill: 'ARRAY',
          minVal: 50,
          stoneCost: 120,
          hintTh: 'ใช้ทักษะค่ายกลและศิลา 120 ก้อนจำลองแผนผังที่ขาดหาย',
          onPass: 'balance_yin_yang_pillars',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'balance_yin_yang_pillars',
          type: 'skill_trial',
          titleTh: 'ผันแปรแรงปะทะของเสาค่ายกลหยินหยางโดยไม่ทำลายโครงสร้าง',
          locationId: 'ruins',
          scope: 'personal',
          skill: 'ARRAY',
          statPath: 'intellect.comprehension',
          minVal: 60,
          hintTh: 'ต้องใช้วิธีผันแรงอย่างสมดุล หากใช้กำลังหักหาญเพดานโถงจะถล่มทับ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_LINGXI_ONE_FINGER',
      titleTh: 'การชี้แนะดัชนีใจสื่อใจจากผู้เร้นกายในศาลาชา',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_AUX_LINGXI_ONE_FINGER',
      tier: 5,
      rarity: 'Legendary',
      unique: true,
      regionId: 'sect',
      visitorRoles: ['scholar', 'wanderer'],
      rumorTextTh: 'แขกผู้ดูธรรมดาในศาลาชากำลังมองหาผู้ที่สามารถอ่านเจตจำนงของคู่ต่อสู้และหยุดยั้งคมดาบด้วยสองนิ้วโดยไม่ต้องฆ่าฟัน',
      steps: [
        {
          nodeId: 'peaceful_intent_test',
          type: 'spirit_judgment',
          titleTh: 'รับการทดสอบอ่านใจและคีบสกัดคมกระบี่ด้วยความสงบ',
          locationId: 'sect',
          scope: 'personal',
          statPath: 'intellect.readPeople',
          skill: 'FIST_PALM',
          minVal: 56,
          hintTh: 'ทดสอบการอ่านคนและความสุขุมเฉพาะตนในสำนัก',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_LINGBO_STEP',
      titleTh: 'รอยเท้าย่างก้าวเหยียบคลื่นในศาลาจมน้ำ',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_LIGHT_LINGBO_STEP',
      tier: 5,
      rarity: 'Legendary',
      unique: true,
      regionId: 'water',
      visitorRoles: ['wanderer', 'merchant'],
      rumorTextTh: 'คนแจวเรือชราเล่าถึงรอยเท้าหกสิบสี่ขานในศาลากลางน้ำที่ปรากฏขึ้นเฉพาะยามน้ำลด',
      steps: [
        {
          nodeId: 'chart_tide_ timing',
          type: 'search_site',
          titleTh: 'สังเกตจังหวะน้ำขึ้นน้ำลงของลุ่มน้ำสาบมังกรคราม',
          locationId: 'water',
          scope: 'party_any',
          skill: 'survival',
          statPath: 'intellect.perceptiveness',
          minVal: 48,
          hintTh: 'คำนวณเวลาน้ำลดเพื่อเข้าสู่ศาลาใต้น้ำอย่างปลอดภัย',
          onPass: 'step_eight_trigrams',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'step_eight_trigrams',
          type: 'skill_trial',
          titleTh: 'ก้าวเดินตามผังแปดทิศหกสิบสี่ขานเหนือผิวน้ำ',
          locationId: 'water',
          scope: 'personal',
          skill: 'MOVEMENT',
          statPath: 'physiology.agility',
          minVal: 56,
          hintTh: 'ใช้ทักษะท่าร่างและความว่องไวก้าวตามลำดับขานโดยไม่ตกลงในวังวน',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_MOON_BAT_SHADOW',
      titleTh: 'บันทึกท่าร่างปีกจันทราในหอคอยไร้แสง',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_LIGHT_MOON_BAT_SHADOW',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_02_MIASMA_MANGROVE',
      visitorRoles: ['wanderer', 'envoy'],
      rumorTextTh: 'มีคำบอกเล่าสองกระแสที่ขัดแย้งกันเกี่ยวกับหอคอยจันทราในบึงหมอกพิษ ซึ่งเป็นที่ซ่อนเคล็ดวิชาตัวเบาปีกจันทราเร้นเงา',
      steps: [
        {
          nodeId: 'verify_conflicting_testimony',
          type: 'inspect_inscription',
          titleTh: 'แยกแยะคำบอกเล่าจริงเท็จเกี่ยวกับเส้นทางเงาจันทร์',
          locationId: 'sect',
          scope: 'party_any',
          statPath: 'intellect.judgement',
          skill: 'stealth',
          minVal: 50,
          hintTh: 'ใช้วิจารณญาณและทักษะเร้นกายแยกแยะเส้นทางลวง',
          onPass: 'traverse_shadow_corridor',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'traverse_shadow_corridor',
          type: 'skill_trial',
          titleTh: 'เคลื่อนกายผ่านระเบียงกระดิ่งลมในความมืดโดยไร้เสียง',
          locationId: 'SRC110_MW_ENV_02_MIASMA_MANGROVE',
          scope: 'personal',
          skill: 'MOVEMENT',
          statPath: 'physiology.reflex',
          minVal: 60,
          hintTh: 'ต้องใช้ความว่องไวและปฏิกิริยาเคลื่อนผ่านโดยไม่ให้กระดิ่งดังแม้แต่ครั้งเดียว',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_STAR_ABSORBING_VORTEX',
      titleTh: 'ห้องศิลาปิดผนึกของจอมมารดูดดาว',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_FORB_STAR_ABSORBING_VORTEX',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'ruins',
      visitorRoles: ['wanderer', 'scholar'],
      rumorTextTh: 'ผู้รอดชีวิตจากคุกใต้ดินเล่าถึงห้องศิลาที่ผนึกมหาเวทต้องห้ามวังวนดูดดาว พร้อมคำเตือนถึงอันตรายของการตีกลับของปราณต่างสาย',
      steps: [
        {
          nodeId: 'unseal_vortex_chamber',
          type: 'skill_trial',
          titleTh: 'คลายโซ่ผนึกห้องศิลาใต้ซากนครโบราณ',
          locationId: 'ruins',
          scope: 'party_any',
          skill: 'ARRAY',
          minVal: 52,
          hintTh: 'คลายโซ่ผนึกค่ายกลอย่างระมัดระวัง',
          onPass: 'withstand_vortex_pull',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'withstand_vortex_pull',
          type: 'body_trial',
          titleTh: 'ต้านทานแรงดูดปราณตกค้างและเก็บจารึกต้องห้าม',
          locationId: 'ruins',
          scope: 'personal',
          statPath: 'physiology.meridianIntegrity',
          minVal: 58,
          hintTh: 'เส้นลมปราณต้องแข็งแกร่งพอจะต้านแรงดูดปราณตกค้าง',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_BLOOD_LOTUS_SACRIFICE',
      titleTh: 'แท่นบูชาบงกชโลหิตในหุบเขาอัคคี',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_FORB_BLOOD_LOTUS_SACRIFICE',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_04_VOLCANIC_CALDERA',
      visitorRoles: ['wanderer', 'envoy'],
      rumorTextTh: 'เศษผ้าเปื้อนเลือดระบุตำแหน่งแท่นบูชาบงกชโลหิตในแอ่งอัคคีหินหนืด ซึ่งบันทึกวิชาต้องห้ามเผาอายุขัยสังหารเทพ',
      steps: [
        {
          nodeId: 'approach_blood_altar',
          type: 'spirit_judgment',
          titleTh: 'เผชิญแรงกดดันจิตมารหน้าแท่นบูชาบงกชโลหิต',
          locationId: 'SRC110_MW_ENV_04_VOLCANIC_CALDERA',
          scope: 'personal',
          statPath: 'intellect.willpower',
          minVal: 64,
          hintTh: 'ใช้ตบะจิตใจอันแน่วแน่เก็บคัมภีร์โดยไม่ถูกจิตมารครอบงำ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_MINGYU_IMMORTAL_QI',
      titleTh: 'ห้องหยกเร้นลับของวังบุปผาโบราณ',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_PASS_MINGYU_IMMORTAL_QI',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
      visitorRoles: ['healer', 'scholar'],
      rumorTextTh: 'หมอพเนจรกล่าวถึงห้องหยกเย็นในซากอุทยานสวรรค์ที่จารึกเคล็ดปราณหยกใสไร้ราคี ซึ่งเน้นการหมุนเวียนปราณภายในโดยไม่รั่วไหล',
      steps: [
        {
          nodeId: 'reconstruct_jade_breath',
          type: 'inspect_inscription',
          titleTh: 'ประกอบแผนภาพลมหายใจเก้าวัฏจักรบนผนังหยก',
          locationId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
          scope: 'party_any',
          skill: 'MEDICINE',
          statPath: 'intellect.comprehension',
          minVal: 55,
          hintTh: 'ใช้ความรู้การแพทย์และความเข้าใจเชื่อมโยงจุดชีพจรบนผนังหยก',
          onPass: 'jade_circulation_test',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'jade_circulation_test',
          type: 'spirit_judgment',
          titleTh: 'เดินปราณสงบนิ่งดั่งหยกใสไร้สิ่งเจือปน',
          locationId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
          scope: 'personal',
          statPath: 'personality.composure',
          minVal: 58,
          hintTh: 'ต้องมีความเยือกเย็นและสมาธิมั่นคงเพื่อรับสืบทอดเคล็ดปราณหยกใส',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_NINE_YANG_MERIDIAN',
      titleTh: 'คัมภีร์เก้าสุริยันในหุบเขาอบอุ่นกลางเทือกเขาหิมะ',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_PASS_NINE_YANG_MERIDIAN',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'mountain',
      visitorRoles: ['herbalist', 'wanderer'],
      rumorTextTh: 'บันทึกเก่าเล่าถึงหุบเขาลับที่อบอุ่นตลอดปีท่ามกลางทิวเขาศิลาคราม ซึ่งซ่อนคัมภีร์เก้าสุริยันคุ้มชีพจรไว้ในโพรงหินโบราณ',
      steps: [
        {
          nodeId: 'locate_warm_valley',
          type: 'search_site',
          titleTh: 'สำรวจหาโพรงหินตาน้ำอุ่นในทิวเขาศิลาคราม',
          locationId: 'mountain',
          scope: 'party_any',
          skill: 'survival',
          minVal: 50,
          hintTh: 'ใช้ทักษะการเอาตัวรอดตามหารอยไอน้ำอุ่นท่ามกลางหุบเขา',
          onPass: 'endure_yang_meridian_heat',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'endure_yang_meridian_heat',
          type: 'body_trial',
          titleTh: 'รองรับไอปราณเก้าสุริยันเพื่อเปิดผนึกคัมภีร์',
          locationId: 'mountain',
          scope: 'personal',
          statPath: 'physiology.vitality',
          minVal: 58,
          hintTh: 'ต้องมีพลังชีวิตและรากฐานกายาแข็งแกร่งเพื่อรับไอปราณหยาง',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_DUGU_SWORD_HEART',
      titleTh: 'สุสานกระบี่และเจตจำนงกระบี่ไร้พ่าย',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_PASS_DUGU_SWORD_HEART',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'mountain',
      visitorRoles: ['scholar', 'wanderer'],
      rumorTextTh: 'คำจารึกหน้าสุสานกระบี่บนยอดเขาสูงกล่าวถึงวิวัฒนาการสี่ขั้นของจอมกระบี่ จากกระบี่คมกริบสู่กระบี่ไม้และไร้กระบี่',
      steps: [
        {
          nodeId: 'study_four_epitaphs',
          type: 'inspect_inscription',
          titleTh: 'ศึกษาคำจารึกสี่ช่วงชีวิตของจอมกระบี่',
          locationId: 'mountain',
          scope: 'party_any',
          skill: 'SCRIPTURE',
          minVal: 55,
          hintTh: 'ทำความเข้าใจความหมายของกระบี่ทั้งสี่ขั้นในสุสานกระบี่',
          onPass: 'sword_heart_awakening',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'sword_heart_awakening',
          type: 'spirit_judgment',
          titleTh: 'พิสูจน์เจตจำนงกระบี่ที่มองเห็นช่องโหว่ก่อนออกท่า',
          locationId: 'mountain',
          scope: 'personal',
          skill: 'SWORD',
          statPath: 'intellect.perceptiveness',
          minVal: 65,
          hintTh: 'ต้องมีความเชี่ยวชาญกระบี่และการรับรู้เฉียบคมระดับปรมาจารย์',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_TAIXUAN_SCRIPTURE',
      titleTh: 'โถงศิลาจารึกบทกวีไท่เสวียนริมเกาะร้าง',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_TAIXUAN_SCRIPTURE',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'water',
      visitorRoles: ['merchant', 'wanderer', 'scholar'],
      rumorTextTh: 'กัปตันเรือเดินสมุทรเล่าถึงถ้ำศิลาบนเกาะกลางลุ่มน้ำใหญ่ที่สลักบทกวีโบราณ ซึ่งผู้ที่ยึดติดกับตำราเดิมเกินไปกลับตีความไม่ออก',
      steps: [
        {
          nodeId: 'sail_to_inscription_island',
          type: 'search_site',
          titleTh: 'เดินทางข้ามแก่งน้ำเชี่ยวสู่เกาะจารึกโบราณ',
          locationId: 'water',
          scope: 'party_all',
          skill: 'survival',
          minVal: 48,
          hintTh: 'นำคณะเดินทางข้ามกระแสน้ำเชี่ยวสู่โถงศิลาบนเกาะ',
          onPass: 'trace_stroke_flow',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'trace_stroke_flow',
          type: 'spirit_judgment',
          titleTh: 'มองเส้นสายอักษรเป็นกระแสปราณและท่วงท่าธรรมชาติ',
          locationId: 'water',
          scope: 'personal',
          statPath: 'intellect.intuition',
          minVal: 58,
          hintTh: 'ใช้สัญชาตญาณและความคิดสร้างสรรค์มองทะลุตัวอักษรสู่เส้นทางโคจรปราณ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_SIX_MERIDIAN_QI',
      titleTh: 'ผังปราณกระบี่หกชีพจรของอารามหลวงโบราณ',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_SIX_MERIDIAN_QI',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'ruins',
      visitorRoles: ['scholar', 'envoy'],
      rumorTextTh: 'ผู้ดูแลหอจดหมายเหตุพลัดถิ่นขอความช่วยเหลือในการกู้คืนม้วนผังปราณกระบี่หกชีพจรไร้รูปจากอารามโบราณที่ถูกทิ้งร้าง',
      steps: [
        {
          nodeId: 'assist_archivist',
          type: 'speak_contact',
          titleTh: 'มอบสมุนไพรและศิลาช่วยซ่อมแซมบันทึกของอาราม',
          locationId: 'sect',
          scope: 'personal',
          stoneCost: 150,
          statPath: 'personality.integrity',
          minVal: 48,
          hintTh: 'แสดงความซื่อสัตย์และสนับสนุนศิลา 150 ก้อนเพื่อบูรณะบันทึกโบราณ',
          onPass: 'recover_temple_folio',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'recover_temple_folio',
          type: 'guardian_combat',
          titleTh: 'ฝ่าด่านผู้พิทักษ์อารามร้างเพื่อนำม้วนผังปราณกลับคืน',
          locationId: 'ruins',
          scope: 'party_all',
          guardianNameTh: 'องครักษ์ศิลาหกชีพจร',
          guardianPower: 2400,
          guardianTier: 5,
          hintTh: 'เอาชนะหุ่นศิลาที่เฝ้าหอคัมภีร์ของอารามหลวง',
          onPass: 'meridian_foundation_check',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'meridian_foundation_check',
          type: 'body_trial',
          titleTh: 'ทดสอบความจุเส้นลมปราณเพื่อรับฉบับคัดลอกสมบูรณ์',
          locationId: 'ruins',
          scope: 'personal',
          statPath: 'physiology.meridianCapacity',
          minVal: 60,
          hintTh: 'ต้องมีความจุเส้นลมปราณกว้างขวางเพื่อรองรับผังปราณหกชีพจร',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_DRAGON_ELEPHANT_PRAJNA',
      titleTh: 'แผ่นศิลาลอกลายมหาคัมภีร์กายานาคช้าง',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_DRAGON_ELEPHANT_PRAJNA',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_03_FROZEN_HIGHLANDS',
      visitorRoles: ['merchant', 'wanderer'],
      rumorTextTh: 'กองคาราวานแดนหิมะได้แผ่นลอกลายศิลาของพระอาจารย์ต้าเอ่อร์ที่บันทึกการฝึกกำลังกายานาคช้างทีละขั้นด้วยความพากเพียร',
      steps: [
        {
          nodeId: 'trace_monastery_stele',
          type: 'search_site',
          titleTh: 'ตามรอยอารามศิลาบนที่ราบสูงเหมันต์',
          locationId: 'SRC110_MW_ENV_03_FROZEN_HIGHLANDS',
          scope: 'party_any',
          skill: 'survival',
          minVal: 48,
          hintTh: 'ค้นหาอารามหินที่ถูกหิมะทับถม',
          onPass: 'endurance_boulder_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'endurance_boulder_trial',
          type: 'body_trial',
          titleTh: 'ยกแท่นศิลาสิบสามชั้นเปิดช่องลับใต้ฐานพระ',
          locationId: 'SRC110_MW_ENV_03_FROZEN_HIGHLANDS',
          scope: 'personal',
          statPath: 'physiology.strength',
          skill: 'BODY_REFINING',
          minVal: 60,
          hintTh: 'ใช้พละกำลังและวิชาหลอมกายายกแท่นศิลาด้วยตนเอง',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_DIAMOND_INDESTRUCTIBLE',
      titleTh: 'วิญญาณผู้พิทักษ์คัมภีร์กายาวัชระอมตะ',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_DIAMOND_INDESTRUCTIBLE',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'mountain',
      visitorRoles: ['scholar', 'envoy'],
      rumorTextTh: 'พระธุดงค์ชราเล่าถึงเจดีย์ศิลาที่พังทลายซึ่งมีวิญญาณผู้พิทักษ์เฝ้าคัมภีร์กายาวัชระอมตะ และจะมอบให้เฉพาะผู้ที่ยืนหยัดปกป้องผู้อื่นโดยไม่ถอยหนี',
      steps: [
        {
          nodeId: 'repair_guardian_stupa',
          type: 'skill_trial',
          titleTh: 'บูรณะฐานเจดีย์ศิลาและระฆังสำริด',
          locationId: 'mountain',
          scope: 'party_any',
          skill: 'construction',
          statPath: 'physiology.endurance',
          minVal: 48,
          stoneCost: 100,
          hintTh: 'ใช้แรงกายและศิลา 100 ก้อนซ่อมแซมเจดีย์ที่พังทลาย',
          onPass: 'unyielding_vajra_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'unyielding_vajra_trial',
          type: 'spirit_judgment',
          titleTh: 'รับแรงปะทะสามฝ่ามือวัชระโดยไม่ถอยแม้แต่ก้าวเดียว',
          locationId: 'mountain',
          scope: 'personal',
          statPath: 'physiology.toughness',
          minVal: 64,
          hintTh: 'ผู้รับสืบทอดต้องมีความแกร่งของกายาและจิตใจที่มั่นคงดั่งเพชร',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_EIGHT_DESOLATIONS_GOD',
      titleTh: 'ปฏิทินศิลาแปดทิศและวิหารเทวะเร้นเมฆ',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_EIGHT_DESOLATIONS_GOD',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
      visitorRoles: ['scholar', 'herbalist'],
      rumorTextTh: 'ผู้แสวงบุญชราพบเศษปฏิทินศิลาที่ชี้ไปยังวิหารเทวะแปดทิศ ซึ่งบันทึกเคล็ดรักษาความเยาว์วัยและปราณชีวิตอันบริสุทธิ์',
      steps: [
        {
          nodeId: 'align_solar_calendar',
          type: 'inspect_inscription',
          titleTh: 'คำนวณตำแหน่งแสงอาทิตย์ผ่านวงแหวนศิลาแปดทิศ',
          locationId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
          scope: 'party_any',
          skill: 'ARRAY',
          statPath: 'intellect.reasoning',
          minVal: 55,
          hintTh: 'ใช้เหตุผลและความรู้ค่ายกลหมุนวงแหวนศิลาให้ตรงยาม',
          onPass: 'vital_harmony_resonance',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'vital_harmony_resonance',
          type: 'spirit_judgment',
          titleTh: 'ประสานปราณชีวิตเข้ากับศิลาเทวะแปดทิศ',
          locationId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
          scope: 'personal',
          statPath: 'physiology.spiritualFoundation',
          minVal: 60,
          hintTh: 'ใช้รากฐานปราณวิญญาณที่บริสุทธิ์เปิดผนึกคัมภีร์',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_CELESTIAL_MANDATE_CANON',
      titleTh: 'ตราหยกโองการสวรรค์และแท่นสัตย์สาบานสามภพ',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_CELESTIAL_MANDATE_CANON',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'ruins',
      visitorRoles: ['envoy', 'scholar'],
      rumorTextTh: 'อดีตทูตสวรรค์นำตราหยกที่แตกร้าวมาขอให้สำนักช่วยสืบหาแท่นสัตย์สาบานในซากนครโบราณ ซึ่งเป็นที่เก็บรักษามหาคัมภีร์โองการสวรรค์',
      steps: [
        {
          nodeId: 'verify_mandate_seal',
          type: 'inspect_inscription',
          titleTh: 'ตรวจสอบอักขระบนตราหยกและบันทึกพันธสัญญาเก่า',
          locationId: 'sect',
          scope: 'party_any',
          skill: 'SCRIPTURE',
          minVal: 54,
          hintTh: 'ตรวจทานอักขระโบราณในหอคัมภีร์เพื่อยืนยันความแท้จริงของตราหยก',
          onPass: 'defend_oath_sanctuary',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'defend_oath_sanctuary',
          type: 'guardian_combat',
          titleTh: 'ปราบอสูรผู้ละเมิดสัตย์ที่บุกรุกแท่นโองการสวรรค์',
          locationId: 'ruins',
          scope: 'party_all',
          guardianNameTh: 'มารทมิฬผู้กลืนกินคำสัตย์',
          guardianPower: 2600,
          guardianTier: 6,
          hintTh: 'ปราบมารที่คอยกัดกร่อนผนึกแท่นโองการสวรรค์',
          onPass: 'keeper_mandate_judgment',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'keeper_mandate_judgment',
          type: 'spirit_judgment',
          titleTh: 'รับการพิพากษาความเที่ยงธรรมและภาวะผู้นำจากวิญญาณผู้เฝ้าตรา',
          locationId: 'ruins',
          scope: 'personal',
          statPath: 'personality.integrity',
          minVal: 62,
          hintTh: 'ผู้รับสืบทอดต้องมีความซื่อสัตย์สุจริตและบารมีที่น่าเชื่อถือ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_ASHURA_BLOOD_SEA',
      titleTh: 'คลังศาสตราสมรภูมิร้างและมหาคัมภีร์มารทะเลโลหิต',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_ASHURA_BLOOD_SEA',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'desert',
      visitorRoles: ['wanderer', 'merchant'],
      rumorTextTh: 'ผู้ลี้ภัยสงครามเล่าถึงหลุมศพแม่ทัพอสูรกลางทะเลทรายเพลิงอัสดง ที่ยังมีปราณโลหิตคุ้มครองมหาคัมภีร์มารทะเลโลหิตอยู่',
      steps: [
        {
          nodeId: 'battle_ashura_remnant',
          type: 'guardian_combat',
          titleTh: 'เอาชนะเงาแม่ทัพอสูรโลหิตในสมรภูมิทรายแดง',
          locationId: 'desert',
          scope: 'party_all',
          guardianNameTh: 'เงาแม่ทัพอสูรทะเลโลหิต',
          guardianPower: 2100,
          guardianTier: 5,
          hintTh: 'ต้องเอาชนะเงาแม่ทัพอสูรในการต่อสู้จริง',
          onPass: 'absorb_blood_stele',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'absorb_blood_stele',
          type: 'spirit_judgment',
          titleTh: 'สะกดจิตสังหารของศิลาโลหิตด้วยความเด็ดเดี่ยว',
          locationId: 'desert',
          scope: 'personal',
          statPath: 'intellect.willpower',
          minVal: 58,
          hintTh: 'ใช้ความเด็ดเดี่ยวและตบะจิตใจสะกดปราณโลหิต',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_TEN_THOUSAND_GU_MONARCH',
      titleTh: 'เรือนเพาะพิษโบราณและคัมภีร์จักรพรรดิกู่หมื่นพิษ',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_TEN_THOUSAND_GU_MONARCH',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_02_MIASMA_MANGROVE',
      visitorRoles: ['herbalist', 'scholar'],
      rumorTextTh: 'หมอพิษแดนใต้รายงานการพบเรือนเพาะกู่โบราณใจกลางบึงหมอกพิษโกงกางทมิฬ ซึ่งต้องใช้ความรู้เรื่องยาและพิษขั้นสูงจึงจะเข้าไปถึงห้องชั้นในได้',
      steps: [
        {
          nodeId: 'neutralize_miasma_ward',
          type: 'skill_trial',
          titleTh: 'ปรุงผงสลายหมอกพิษเจ็ดชั้นหน้าเรือนเพาะกู่',
          locationId: 'SRC110_MW_ENV_02_MIASMA_MANGROVE',
          scope: 'party_any',
          skill: 'ALCHEMY',
          statPath: 'physiology.immunity',
          minVal: 56,
          hintTh: 'ใช้ทักษะปรุงยาและภูมิคุ้มกันพิษสลายม่านหมอกพิษ',
          onPass: 'subdue_gu_vessel',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'subdue_gu_vessel',
          type: 'skill_trial',
          titleTh: 'จำแนกโถราชันย์กู่และนำคัมภีร์ออกจากแท่นศิลาพิษ',
          locationId: 'SRC110_MW_ENV_02_MIASMA_MANGROVE',
          scope: 'personal',
          skill: 'POISON',
          statPath: 'intellect.comprehension',
          minVal: 62,
          hintTh: 'ต้องมีความเข้าใจศาสตร์พิษขั้นสูงเพื่อไม่ให้กู่คลุ้มคลั่ง',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_NINE_YIN_SOUL_MIRROR',
      titleTh: 'หอดูดาวกระจกเงาและมหาคัมภีร์จิตเก้าหยิน',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_NINE_YIN_SOUL_MIRROR',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'forest',
      visitorRoles: ['scholar', 'wanderer'],
      rumorTextTh: 'นักเดินทางเล่าถึงหอดูดาวร้างกลางป่าลึกที่มีกระจกสำริดเก้าบานสะท้อนภาพลวงตาไม่ตรงกับความจริง',
      steps: [
        {
          nodeId: 'interview_mirror_witness',
          type: 'speak_contact',
          titleTh: 'ซักถามรายละเอียดมุมสะท้อนของกระจกสำริดจากผู้เคยรอดชีวิต',
          locationId: 'sect',
          scope: 'party_any',
          statPath: 'intellect.perceptiveness',
          minVal: 48,
          hintTh: 'รวบรวมข้อมูลตำแหน่งกระจกเงาจากพยานก่อนออกเดินทาง',
          onPass: 'see_through_nine_mirrors',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'see_through_nine_mirrors',
          type: 'spirit_judgment',
          titleTh: 'แยกแยะเงาจริงจากภาพลวงเก้าชั้นด้วยตบะจิตวิญญาณ',
          locationId: 'forest',
          scope: 'personal',
          skill: 'SOUL_DIVINE',
          statPath: 'intellect.judgement',
          minVal: 60,
          hintTh: 'ใช้ทักษะจิตวิญญาณและวิจารณญาณมองทะลุภาพลวงตาทั้งเก้าบาน',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_ART_LITTLE_LI_HEART_BLADE',
      titleTh: 'บันทึกจิตมีดบินไร้พลาดของอดีตบัณฑิตผู้เร้นกาย',
      category: 'LEGENDARY_ART',
      targetKind: 'TECH_MANUAL',
      targetId: 'LEG_MANTRA_LITTLE_LI_HEART_BLADE',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'plains',
      visitorRoles: ['scholar', 'wanderer'],
      rumorTextTh: 'นักเล่านิทานพเนจรเอ่ยถึงกระท่อมไม้ไผ่ของอดีตบัณฑิตผู้วางมีดสั้นลงเพื่อแลกกับความสงบ และทิ้งบันทึกการหลอมรวมจิตเป็นหนึ่งเดียวไว้',
      steps: [
        {
          nodeId: 'keep_promise_at_pavilion',
          type: 'speak_contact',
          titleTh: 'รับปากนำสุราและยารักษาไปมอบให้สหายเก่าของบัณฑิตเร้นกาย',
          locationId: 'sect',
          scope: 'personal',
          statPath: 'personality.integrity',
          minVal: 52,
          stoneCost: 80,
          hintTh: 'รักษาสัจจะและจัดเตรียมของฝากมูลค่า 80 ศิลา',
          onPass: 'heart_blade_focus_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'heart_blade_focus_trial',
          type: 'spirit_judgment',
          titleTh: 'พิสูจน์สมาธิจิตที่นิ่งสงบและเปี่ยมด้วยความเมตตาหน้ากระท่อมไผ่',
          locationId: 'plains',
          scope: 'personal',
          statPath: 'intellect.focus',
          minVal: 64,
          hintTh: 'ผู้รับสืบทอดต้องมีสมาธิแน่วแน่และไม่ถูกความโกรธครอบงำ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },

    /* --- 2.3 Eleven Legendary Weapons (Authored Inheritance & Guardian Stories across 7 Families) --- */
    {
      templateId: 'CLUE_LEG_WPN_YITIAN_SWORD',
      titleTh: 'เบาะแสกระบี่อิงฟ้าพิฆาตมารในหอคอยเมฆาโบราณ',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_YITIAN_SWORD',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
      visitorRoles: ['envoy', 'scholar'],
      rumorTextTh: 'ศิษย์พเนจรจากสำนักพันธมิตรเล่าว่าพบป้ายหยกโบราณที่ระบุที่ซ่อนของ「กระบี่อิงฟ้าพิฆาตมาร」ในหอคอยเมฆาที่ถูกปิดผนึก',
      steps: [
        {
          nodeId: 'decipher_emei_seal',
          type: 'inspect_inscription',
          titleTh: 'ถอดความรหัสคำกลอน「อิงฟ้าไม่ปรากฏ ใครเลยจะกล้าต่อกร」',
          locationId: 'sect',
          scope: 'party_any',
          skill: 'SCRIPTURE',
          minVal: 50,
          hintTh: 'ตีความรหัสคำกลอนบนป้ายหยกเพื่อหาตำแหน่งแท่นผนึกกระบี่',
          onPass: 'guardian_sword_wraith',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'guardian_sword_wraith',
          type: 'guardian_combat',
          titleTh: 'ประลองกับเจตจำนงผู้พิทักษ์หอคอยกระบี่อิงฟ้า',
          locationId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
          scope: 'party_all',
          guardianNameTh: 'เจตจำนงผู้พิทักษ์กระบี่อิงฟ้า',
          guardianPower: 2650,
          guardianTier: 6,
          hintTh: 'ผ่านการทดสอบกำลังรบกับผู้พิทักษ์หอคอย',
          onPass: 'unsheathe_yitian_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'unsheathe_yitian_trial',
          type: 'skill_trial',
          titleTh: 'ชักกระบี่อิงฟ้าออกจากฝักหยกด้วยความเชี่ยวชาญกระบี่',
          locationId: 'SRC110_MW_ENV_11_CELESTIAL_GARDEN_RUINS',
          scope: 'personal',
          skill: 'SWORD',
          statPath: 'physiology.reflex',
          minVal: 60,
          hintTh: 'ผู้ชักกระบี่ต้องมีความชำนาญกระบี่และปฏิกิริยาที่ฉับไว',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_XUANTIE_HEAVY_SWORD',
      titleTh: 'สุสานกระบี่หุบเขาลึกและกระบี่เหล็กนิลไร้คม',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_XUANTIE_HEAVY_SWORD',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'mountain',
      visitorRoles: ['wanderer', 'artisan'],
      rumorTextTh: 'พรานภูเขาพบอินทรียักษ์โบราณเฝ้าแท่นหินฝังกระบี่ในหุบเขาลึก ซึ่งสลักคำว่า「กระบี่หนักไร้คม ยอดฝีมือไม่ประดิษฐ์」',
      steps: [
        {
          nodeId: 'spar_ancient_condor',
          type: 'guardian_combat',
          titleTh: 'รับมือพญาอินทรีเทพผู้เฝ้าสุสานกระบี่',
          locationId: 'mountain',
          scope: 'party_all',
          guardianNameTh: 'พญาอินทรีเหล็กผู้เฝ้าสุสานกระบี่',
          guardianPower: 2500,
          guardianTier: 6,
          hintTh: 'ผ่านการประลองกำลังกับพญาอินทรีหน้าสุสานกระบี่',
          onPass: 'lift_xuantie_sword',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'lift_xuantie_sword',
          type: 'body_trial',
          titleTh: 'ยกกระบี่เหล็กนิลหนักแปดสิบเอ็ดชั่งขึ้นจากแท่นหิน',
          locationId: 'mountain',
          scope: 'personal',
          statPath: 'physiology.strength',
          minVal: 60,
          hintTh: 'ต้องมีพละกำลังกายา ≥ 60 จึงจะยกและกวัดแกว่งกระบี่เหล็กนิลไร้คมได้',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_TULONG_SABER',
      titleTh: 'เบาะแสดาบฆ่ามังกรในเกาะเพลิงน้ำแข็งโพ้นทะเล',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_TULONG_SABER',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_04_VOLCANIC_CALDERA',
      visitorRoles: ['merchant', 'envoy', 'artisan'],
      rumorTextTh: 'พ่อค้าสมบัติเร้นลับเผยว่าพบเบาะแสของ「ดาบฆ่ามังกรบัญชาหล้า」ถูกผนึกอยู่ในถ้ำหินหนืดที่ล้อมรอบด้วยเปลวไฟและอสูรร้าย',
      steps: [
        {
          nodeId: 'survive_volcanic_gorge',
          type: 'body_trial',
          titleTh: 'ฝ่าคลื่นความร้อนของแอ่งอัคคีหินหนืดเข้าสู่โถงผนึกดาบ',
          locationId: 'SRC110_MW_ENV_04_VOLCANIC_CALDERA',
          scope: 'party_all',
          statPath: 'physiology.toughness',
          minVal: 50,
          hintTh: 'คณะเดินทางต้องมีความทนทานต่อไอร้อนหินหนืด',
          onPass: 'defeat_flame_lion_guardian',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'defeat_flame_lion_guardian',
          type: 'guardian_combat',
          titleTh: 'สยบราชสีห์ขนทองเพลิงบรรพกาลที่เฝ้าแท่นดาบ',
          locationId: 'SRC110_MW_ENV_04_VOLCANIC_CALDERA',
          scope: 'party_all',
          guardianNameTh: 'ราชสีห์ขนทองเพลิงบรรพกาล',
          guardianPower: 2700,
          guardianTier: 6,
          hintTh: 'เอาชนะอสูรผู้พิทักษ์แท่นดาบฆ่ามังกร',
          onPass: 'claim_tulong_saber',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'claim_tulong_saber',
          type: 'skill_trial',
          titleTh: 'ดึงดาบฆ่ามังกรออกจากแท่นหินหลอมเหลว',
          locationId: 'SRC110_MW_ENV_04_VOLCANIC_CALDERA',
          scope: 'personal',
          skill: 'BLADE',
          statPath: 'physiology.strength',
          minVal: 60,
          hintTh: 'ต้องใช้ทั้งพละกำลังและพื้นฐานเพลงดาบดึงดาบฆ่ามังกรขึ้นมาจากแท่นหิน',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_FULL_MOON_SCIMITAR',
      titleTh: 'ศาลาฟังพิรุณและดาบโค้งจันทร์เพ็ญสะท้อนเงา',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_FULL_MOON_SCIMITAR',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'forest',
      visitorRoles: ['wanderer', 'scholar'],
      rumorTextTh: 'จอมยุทธ์พเนจรเล่าถึงศาลาไม้สองชั้นกลางป่าไผ่ที่ทุกคืนเดือนเพ็ญจะมีประกายดาบโค้งจันทร์เพ็ญส่องสว่างท่ามกลางสายฝน',
      steps: [
        {
          nodeId: 'find_spring_rain_pavilion',
          type: 'search_site',
          titleTh: 'ตามหา「หอเล็กฟังเสียงฝนฤดูใบไม้ผลิ」ในป่าหมอกเขียว',
          locationId: 'forest',
          scope: 'party_any',
          statPath: 'intellect.perceptiveness',
          minVal: 50,
          hintTh: 'สังเกตเสียงลมและสายฝนเพื่อหาทางเข้าศาลาเร้นลับ',
          onPass: 'moon_scimitar_duel_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'moon_scimitar_duel_trial',
          type: 'skill_trial',
          titleTh: 'รับการทดสอบความเร็วเพลงดาบใต้แสงจันทร์',
          locationId: 'forest',
          scope: 'personal',
          skill: 'BLADE',
          statPath: 'physiology.agility',
          minVal: 58,
          hintTh: 'ใช้ความคล่องตัวและฝีมือดาบรับประกายดาบจันทร์เพ็ญ',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_XIAOLI_HEART_DAGGER',
      titleTh: 'มีดสั้นเสี่ยวหลี่ของช่างตีเหล็กรถเข็นเก่า',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_XIAOLI_HEART_DAGGER',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'plains',
      visitorRoles: ['artisan', 'scholar', 'wanderer'],
      rumorTextTh: 'ทายาทช่างตีเหล็กชราผู้ตีมีดสั้นให้ลี่ซุนฮวนเดินทางผ่านมา พร้อมกล่องไม้สลักรูปดอกเหมยที่บรรจุมีดสั้นเสี่ยวหลี่เล่มสุดท้าย',
      steps: [
        {
          nodeId: 'aid_elder_weaponsmith',
          type: 'speak_contact',
          titleTh: 'ช่วยเหลือทายาทช่างตีเหล็กชราและรับฟังประวัติของมีดบิน',
          locationId: 'sect',
          scope: 'personal',
          statPath: 'personality.empathy',
          minVal: 50,
          stoneCost: 90,
          hintTh: 'แสดงน้ำใจไมตรีและช่วยเหลือค่าเดินทาง 90 ศิลาโดยไม่หวังผลตอบแทนด้วยกำลัง',
          onPass: 'plum_blossom_accuracy_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'plum_blossom_accuracy_trial',
          type: 'spirit_judgment',
          titleTh: 'พิสูจน์สายตาและจิตใจที่เปี่ยมความยุติธรรมในการรับมีดสั้น',
          locationId: 'plains',
          scope: 'personal',
          statPath: 'intellect.perceptiveness',
          minVal: 64,
          hintTh: 'ต้องมีสายตาแม่นยำและจิตใจที่มั่นคงเพื่อสืบทอดมีดสั้นเสี่ยวหลี่',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_DAGOU_JADE_STAFF',
      titleTh: 'พลองหยกเขียวตีสุนัขในศาลเจ้าล้างมือ',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_DAGOU_JADE_STAFF',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'plains',
      visitorRoles: ['wanderer', 'envoy'],
      rumorTextTh: 'ผู้อาวุโสพรรคกระยาจกพเนจรเล่าว่าพลองหยกเขียวประจำตำแหน่งรุ่นก่อนถูกเก็บรักษาไว้ในศาลเจ้าร้าง รอผู้มีคุณธรรมและไหวพริบมารับช่วงต่อ',
      steps: [
        {
          nodeId: 'share_provisions_with_beggars',
          type: 'speak_contact',
          approach: 'help_contact',
          acceptedItemIds: ['meal', 'P:BASIC_HP'],
          titleTh: 'แบ่งปันเสบียงและยารักษาแก่ผู้พเนจรหน้าสำนัก',
          locationId: 'sect',
          scope: 'personal',
          statPath: 'personality.empathy',
          minVal: 45,
          stoneCost: 60,
          hintTh: 'ช่วยเหลือผู้พเนจรด้วยเสบียง/โอสถหรือศิลา 60 ก้อนด้วยความจริงใจ',
          onPass: 'jade_staff_agility_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'jade_staff_agility_trial',
          type: 'skill_trial',
          approach: 'nonlethal_trial',
          titleTh: 'ผ่านการประลองเชิงพลองไม่เอาชีวิตในค่ายกลไม้ไผ่แปดทิศ',
          locationId: 'plains',
          scope: 'personal',
          statPath: 'physiology.dexterity',
          minVal: 56,
          hintTh: 'ใช้ความคล่องแคล่วและไหวพริบผ่านการประลองเชิงพลองโดยไม่ทำร้ายผู้อาวุโส',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_OVERLORD_SPEAR',
      titleTh: 'ทวนราชันย์พิชิตพยัคฆ์ ณ เนินพยัคฆ์หิว',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_OVERLORD_SPEAR',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'mountain',
      visitorRoles: ['wanderer', 'envoy'],
      rumorTextTh: 'จอมทวนพเนจรเล่าถึง「ทวนราชันย์」ยาวหนึ่งจั้งสามฉื่อเจ็ดชุ่นที่ปักอยู่บนยอดเนินพยัคฆ์หิว รอคอยผู้ที่มีความกล้าหาญแท้จริงไปถอนขึ้นมา',
      steps: [
        {
          nodeId: 'challenge_hungry_tiger_ridge',
          type: 'guardian_combat',
          approach: 'guardian_combat',
          titleTh: 'เผชิญหน้าพยัคฆ์เขี้ยวดาบ ณ ทุ่งราบชายเขา',
          locationId: 'plains',
          scope: 'party_all',
          guardianNameTh: 'พยัคฆ์ราชันย์เขี้ยวเหล็ก',
          guardianPower: 1950,
          guardianTier: 5,
          hintTh: 'ปราบพยัคฆ์อสูรที่ทุ่งราบเมฆาก่อนตามรอยขึ้นสู่ยอดเขาศิลาคราม',
          onPass: 'overlord_courage_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'overlord_courage_trial',
          type: 'spirit_judgment',
          approach: 'nonlethal_trial',
          titleTh: 'เดินทางขึ้นยอดเขาศิลาครามและถอนทวนราชันย์ด้วยความกล้าหาญ',
          locationId: 'mountain',
          scope: 'personal',
          statPath: 'personality.courage',
          skill: 'SPEAR',
          minVal: 58,
          hintTh: 'เดินทางต่อสู่ทิวเขาศิลาคราม ผู้ถอนทวนต้องมีความกล้าหาญและพื้นฐานเพลงทวนที่มั่นคง',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_OATHBREAKER_DRAGON_LANCE',
      titleTh: 'ทวนเกล็ดมังกรครามใต้ศาลเจ้าบาดาล',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_OATHBREAKER_DRAGON_LANCE',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'water',
      visitorRoles: ['scholar', 'envoy'],
      rumorTextTh: 'นักพรตวารีเผยว่าใต้ลุ่มน้ำสาบมังกรครามมีศาลเจ้าแม่ทัพโบราณที่ผนึก「ทวนเกล็ดมังกรครามสัตย์สาบาน」ไว้',
      steps: [
        {
          nodeId: 'dive_sunken_shrine',
          type: 'body_trial',
          titleTh: 'ดำดิ่งฝ่าแรงดันน้ำลึกสู่ศาลเจ้าแม่ทัพมังกรคราม',
          locationId: 'water',
          scope: 'party_all',
          statPath: 'physiology.endurance',
          minVal: 52,
          hintTh: 'คณะเดินทางต้องมีความทนทานสูงเพื่อดำลงสู่ศาลเจ้าใต้น้ำ',
          onPass: 'subdue_water_serpent_guard',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'subdue_water_serpent_guard',
          type: 'guardian_combat',
          titleTh: 'ปราบอสรพิษเกล็ดครามผู้เฝ้าแท่นทวนสัตย์สาบาน',
          locationId: 'water',
          scope: 'party_all',
          guardianNameTh: 'อสรพิษมังกรครามพันปี',
          guardianPower: 2550,
          guardianTier: 6,
          hintTh: 'เอาชนะอสรพิษมังกรครามหน้าแท่นบูชา',
          onPass: 'oath_lance_recognition',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'oath_lance_recognition',
          type: 'spirit_judgment',
          approach: 'honor_commitment',
          titleTh: 'นำตราแม่ทัพสู่ซากนครโบราณและกล่าวคำสัตย์ต่อหน้าทวนเกล็ดมังกรคราม',
          locationId: 'ruins',
          scope: 'personal',
          statPath: 'personality.loyalty',
          skill: 'SPEAR',
          minVal: 60,
          hintTh: 'เดินทางสู่ซากนครโบราณเพื่อปลดผนึกแท่นทวนด้วยความภักดีและคำสัตย์',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_WRATHFUL_TIGER_GAUNTLETS',
      titleTh: 'สนับหมัดพยัคฆ์พิโรธ ณ หุบเขาหมาป่า',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_WRATHFUL_TIGER_GAUNTLETS',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_01_ANCIENT_CANOPY',
      visitorRoles: ['wanderer', 'artisan'],
      rumorTextTh: 'นักสู้หมัดเปล่าเล่าถึงแท่นหินในพงไพรบรรพกาลที่เก็บรักษา「สนับหมัดพยัคฆ์พิโรธสะท้านผา」ของผู้ที่ไม่เคยทอดทิ้งสหาย',
      steps: [
        {
          nodeId: 'clear_wolf_pack_ambush',
          type: 'guardian_combat',
          titleTh: 'ฝ่าวงล้อมฝูงหมาป่าอสูรในพงไพรบรรพกาล',
          locationId: 'SRC110_MW_ENV_01_ANCIENT_CANOPY',
          scope: 'party_all',
          guardianNameTh: 'จ่าฝูงหมาป่าวายุเขี้ยวเงิน',
          guardianPower: 1850,
          guardianTier: 5,
          hintTh: 'ร่วมมือกันปราบจ่าฝูงหมาป่าอสูร',
          onPass: 'tiger_gauntlet_fist_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'tiger_gauntlet_fist_trial',
          type: 'skill_trial',
          titleTh: 'ชกทะลายแท่นศิลาสามชั้นด้วยเพลงหมัดและแรงระเบิด',
          locationId: 'SRC110_MW_ENV_01_ANCIENT_CANOPY',
          scope: 'personal',
          skill: 'FIST_PALM',
          statPath: 'physiology.explosiveness',
          minVal: 58,
          hintTh: 'ใช้ความเชี่ยวชาญหมัดฝ่ามือและพลังระเบิดเปิดแท่นศิลา',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_CONDOR_METEOR_BOW',
      titleTh: 'ธนูเหล็กไหลยิงอินทรีคู่บนเนินผาลมกรด',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_CONDOR_METEOR_BOW',
      tier: 6,
      rarity: 'Legendary',
      unique: true,
      regionId: 'SRC110_MW_ENV_05_MINERAL_DESERT',
      visitorRoles: ['wanderer', 'merchant'],
      rumorTextTh: 'นายพรานทุ่งหญ้าเล่าถึงคันธนูศึกเหล็กไหลโบราณที่วางอยู่บนแท่นหินกลางช่องลมกรด ซึ่งผู้ที่มีสายตาและแรงดึงสายธนูถึงขั้นเท่านั้นจึงจะขึ้นสายได้',
      steps: [
        {
          nodeId: 'string_meteor_warbow',
          type: 'body_trial',
          titleTh: 'ออกแรงดึงสายเอ็นอสูรวายุขึ้นคันธนูเหล็กไหล',
          locationId: 'SRC110_MW_ENV_05_MINERAL_DESERT',
          scope: 'personal',
          statPath: 'physiology.strength',
          minVal: 54,
          hintTh: 'ต้องมีพละกำลังแขนและกายาแข็งแกร่งเพื่อขึ้นสายธนูศึก',
          onPass: 'shoot_wind_vane_target',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'shoot_wind_vane_target',
          type: 'skill_trial',
          titleTh: 'ยิงศรฝ่าลมกรดตัดห่วงทองคำสองวงพร้อมกัน',
          locationId: 'SRC110_MW_ENV_05_MINERAL_DESERT',
          scope: 'personal',
          statPath: 'intellect.perceptiveness',
          minVal: 58,
          hintTh: 'ใช้สายตาและความแม่นยำคำนวณทิศทางลมกรด',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    },
    {
      templateId: 'CLUE_LEG_WPN_PEACOCK_PLUME_FOCUS',
      titleTh: 'ความลับคฤหาสน์นกยูงและขนนกยูงทองคำกลไกสวรรค์',
      category: 'LEGENDARY_WEAPON',
      targetKind: 'EQUIPMENT',
      targetId: 'LEG_WPN_PEACOCK_PLUME_FOCUS',
      tier: 7,
      rarity: 'Legendary',
      unique: true,
      regionId: 'ruins',
      visitorRoles: ['artisan', 'scholar', 'envoy'],
      rumorTextTh: 'ทายาทช่างกลไกโบราณนำแผนผังห้องลับของคฤหาสน์นกยูงมาเปิดเผยว่า「ขนนกยูงทองคำกลไกสวรรค์」ยังคงถูกเก็บรักษาไว้หลังค่ายกลเก้าชั้น',
      steps: [
        {
          nodeId: 'decode_peacock_mechanism',
          type: 'inspect_inscription',
          titleTh: 'ถอดรหัสกลไกสลักคู่ของกระบอกทองคำนกยูง',
          locationId: 'sect',
          scope: 'party_any',
          skill: 'ARRAY',
          statPath: 'intellect.inventiveness',
          minVal: 54,
          stoneCost: 130,
          hintTh: 'ใช้ความช่างคิดและทักษะค่ายกลวิเคราะห์แบบแปลนกลไก (ใช้ศิลา 130 ก้อน)',
          onPass: 'peacock_confidence_trial',
          onFail: 'RETRY_LATER'
        },
        {
          nodeId: 'peacock_confidence_trial',
          type: 'spirit_judgment',
          titleTh: 'ก้าวผ่านค่ายกลภาพลวงด้วยความเชื่อมั่นอันไม่สั่นคลอน',
          locationId: 'ruins',
          scope: 'personal',
          statPath: 'intellect.willpower',
          minVal: 64,
          hintTh: 'อาวุธที่แท้จริงของขนนกยูงคือความเชื่อมั่น ผู้สืบทอดต้องมีจิตใจมั่นคงไม่หวั่นไหว',
          onPass: 'REWARD',
          onFail: 'RETRY_LATER'
        }
      ]
    }
  ];

  VC.CLUE_TEMPLATES = CLUE_TEMPLATES;
  VC.TEMPLATE_BY_ID = Object.fromEntries(CLUE_TEMPLATES.map(t => [t.templateId, t]));

  /* ============================================================================
   * 3. WORLD STATE INITIALIZATION, SAVE MIGRATION & UNIQUENESS ACCOUNTING
   * ============================================================================ */
  const VISITOR_ROLES = {
    merchant: { id: 'merchant', nameTh: 'วาณิชพเนจร', icon: '🪙', bkey: 'market', stationKind: 'browse' },
    wanderer: { id: 'wanderer', nameTh: 'จอมยุทธ์พเนจร', icon: '🗡️', bkey: 'tea_garden', stationKind: 'chat' },
    scholar: { id: 'scholar', nameTh: 'บัณฑิตท่องยุทธภพ', icon: '📜', bkey: 'tea_garden', stationKind: 'chat' },
    herbalist: { id: 'herbalist', nameTh: 'หมอยาแดนไกล', icon: '🌿', bkey: 'infirmary', stationKind: 'treat' },
    artisan: { id: 'artisan', nameTh: 'ช่างฝีมือเร่ร่อน', icon: '🔨', bkey: 'forge', stationKind: 'work' },
    envoy: { id: 'envoy', nameTh: 'ทูตสำนักพันธมิตร', icon: '🤝', bkey: 'main_hall', stationKind: 'throne' }
  };
  VC.VISITOR_ROLES = VISITOR_ROLES;

  VC.ensure = (W, fullSync) => {
    if (!W || !W.world) return null;
    const w = W.world;
    if (!fullSync && w.clues && w.guestRegistry && w.claimReceipts && w.uniqueArtifacts && w._vcEnsuredDay === W.day) {
      return w.clues;
    }
    if (EXT && EXT.ensure) EXT.ensure(W);
    if (!Array.isArray(w.visitors)) w.visitors = [];
    if (!w.guestRegistry || typeof w.guestRegistry !== 'object' || Array.isArray(w.guestRegistry)) w.guestRegistry = {};
    if (!w.clues || typeof w.clues !== 'object' || Array.isArray(w.clues)) {
      w.clues = {
        seq: 0,
        rumorSeq: 0,
        active: {},
        history: [],
        cooldowns: {},
        dailyBudget: { day: W.day, cluesGenerated: 0, legendCluesGenerated: 0 },
        funnel: {
          visits: 0,
          admitted: 0,
          rejected: 0,
          infoEncounters: 0,
          cluesByTier: {},
          cluesByRarity: {},
          investigationsStarted: 0,
          nodesPassed: 0,
          nodesFailed: 0,
          terminalsReached: 0,
          grantsSucceeded: 0,
          grantsBlockedDuplicate: 0,
          equippedOrLearned: 0
        }
      };
    }
    const cs = w.clues;
    if (!Number.isFinite(cs.seq)) cs.seq = 0;
    if (!Number.isFinite(cs.rumorSeq)) cs.rumorSeq = 0;
    if (!cs.active || typeof cs.active !== 'object') cs.active = {};
    if (!Array.isArray(cs.history)) cs.history = [];
    if (!cs.cooldowns || typeof cs.cooldowns !== 'object') cs.cooldowns = {};
    if (!cs.dailyBudget || typeof cs.dailyBudget !== 'object') cs.dailyBudget = { day: W.day, cluesGenerated: 0, legendCluesGenerated: 0 };
    if (cs.dailyBudget.day !== W.day) {
      cs.dailyBudget.day = W.day;
      cs.dailyBudget.cluesGenerated = 0;
      cs.dailyBudget.legendCluesGenerated = 0;
    }
    if (!cs.funnel || typeof cs.funnel !== 'object') {
      cs.funnel = { visits: 0, admitted: 0, rejected: 0, infoEncounters: 0, cluesByTier: {}, cluesByRarity: {}, investigationsStarted: 0, nodesPassed: 0, nodesFailed: 0, terminalsReached: 0, grantsSucceeded: 0, grantsBlockedDuplicate: 0, equippedOrLearned: 0 };
    }
    ['visits', 'admitted', 'rejected', 'infoEncounters', 'investigationsStarted', 'nodesPassed', 'nodesFailed', 'terminalsReached', 'grantsSucceeded', 'grantsBlockedDuplicate', 'equippedOrLearned'].forEach(k => {
      if (!Number.isFinite(cs.funnel[k]) || cs.funnel[k] < 0) cs.funnel[k] = 0;
    });
    if (!cs.funnel.cluesByTier || typeof cs.funnel.cluesByTier !== 'object') cs.funnel.cluesByTier = {};
    if (!cs.funnel.cluesByRarity || typeof cs.funnel.cluesByRarity !== 'object') cs.funnel.cluesByRarity = {};

    if (!w.claimReceipts || typeof w.claimReceipts !== 'object' || Array.isArray(w.claimReceipts)) w.claimReceipts = {};
    if (!w.uniqueArtifacts || typeof w.uniqueArtifacts !== 'object' || Array.isArray(w.uniqueArtifacts)) w.uniqueArtifacts = {};

    if (W.sect) {
      if (!Array.isArray(W.sect.clueArchive)) W.sect.clueArchive = [];
    }

    // Normalize existing visitors (idempotent migration for old trader records)
    w.visitors.forEach((v, idx) => {
      if (!v || typeof v !== 'object') return;
      if (!v.id) v.id = 'visitor_' + (idx + 1);
      if (!v.role) v.role = v.kind === 'trader' ? 'merchant' : 'wanderer';
      if (!v.state) v.state = (v.untilDay != null && v.untilDay < W.day) ? 'offsite' : 'admitted';
      if (!v.accessLevel) v.accessLevel = v.kind === 'trader' ? 'market_and_plaza' : 'public_courtyard';
      if (!Number.isFinite(v.x) || !Number.isFinite(v.y)) {
        const b = (W.map && W.map.byId && W.map.byId[v.kind === 'trader' ? 'market' : 'tea_garden']) || (W.map && W.map.byId && W.map.byId.plaza);
        v.x = b ? b.x + b.w / 2 : 118;
        v.y = b ? b.y + b.h / 2 : 70;
        v.px = v.x;
        v.py = v.y;
      }
      if (!v.h) {
        // Deterministic fallback human profile for legacy save trader records without consuming W.rng!
        const seedStr = String(W.seed || 'legacy') + ':visitor:' + v.id;
        const localRng = new U.RNG(seedStr);
        const oldDay = HC.nowDay;
        HC.nowDay = W.day || 360;
        v.h = HC.generate(localRng, { id: v.id, day: W.day || 360, ageYears: 32, quality: 0.4 }).h;
        HC.nowDay = oldDay;
        if (v.nameTh) {
          v.h.name.given = v.nameTh;
          v.h.name.family = '';
        }
      }
      if (!Array.isArray(v.interactedNpcIds)) v.interactedNpcIds = [];
      if (!Number.isFinite(v.visitCount)) v.visitCount = 1;
      if (!Number.isFinite(v.hospitalityScore)) v.hospitalityScore = 50;
    });

    if (!Array.isArray(w.visitorNews)) w.visitorNews = [];
    VC.syncUniqueArtifacts(W);

    Object.defineProperty(w, '_vcEnsuredDay', { value: W.day, enumerable: false, configurable: true, writable: true });
    return cs;
  };

  VC.syncUniqueArtifacts = W => {
    if (!W || !W.world) return {};
    const w = W.world;
    if (!w.uniqueArtifacts || typeof w.uniqueArtifacts !== 'object' || Array.isArray(w.uniqueArtifacts)) w.uniqueArtifacts = {};
    const seen = new Set();

    // 1. Check living NPC equipped & personal bag gear first (highest priority physical holder)
    for (const n of (W.npcs || [])) {
      if (!n) continue;
      if (!Array.isArray(n.knownClues)) n.knownClues = [];
      if (n.dead) {
        // Rescue any gear accidentally left on a dead NPC back into sect storage
        if (n.equip) {
          for (const k of Object.keys(n.equip)) {
            if (n.equip[k] && W.sect && Array.isArray(W.sect.gear)) W.sect.gear.push(n.equip[k]);
          }
          n.equip = {};
        }
        if (n.inv && Array.isArray(n.inv.gear) && n.inv.gear.length) {
          for (const g2 of n.inv.gear) {
            if (g2 && W.sect && Array.isArray(W.sect.gear)) W.sect.gear.push(g2);
          }
          n.inv.gear = [];
        }
        continue;
      }
      if (n.equip) {
        for (const slot of Object.keys(n.equip)) {
          const it = n.equip[slot];
          if (!it) continue;
          VC.normalizeGearItem(it);
          if (VC.LEGENDARY_WEAPON_BY_ID[it.id] && !it.playerSpawned) {
            if (seen.has(it.id)) {
              delete n.equip[slot];
              continue;
            }
            seen.add(it.id);
            w.uniqueArtifacts[it.id] = {
              itemId: it.id,
              uid: it.uid || ('uid_' + it.id),
              ownerKind: 'npc_equipped',
              ownerId: n.id,
              ownerNameTh: HC.fullName(n),
              updatedDay: W.day
            };
          }
        }
      }
      if (n.inv && Array.isArray(n.inv.gear)) {
        for (let i = n.inv.gear.length - 1; i >= 0; i--) {
          const it = n.inv.gear[i];
          if (!it) continue;
          VC.normalizeGearItem(it);
          if (VC.LEGENDARY_WEAPON_BY_ID[it.id] && !it.playerSpawned) {
            if (seen.has(it.id)) {
              n.inv.gear.splice(i, 1);
              continue;
            }
            seen.add(it.id);
            w.uniqueArtifacts[it.id] = {
              itemId: it.id,
              uid: it.uid || ('uid_' + it.id),
              ownerKind: 'npc_bag',
              ownerId: n.id,
              ownerNameTh: HC.fullName(n),
              updatedDay: W.day
            };
          }
        }
      }
    }

    // 2. Check Sect Armory (`W.sect.gear`)
    if (W.sect && Array.isArray(W.sect.gear)) {
      for (let i = W.sect.gear.length - 1; i >= 0; i--) {
        const it = W.sect.gear[i];
        if (!it) continue;
        VC.normalizeGearItem(it);
        if (VC.LEGENDARY_WEAPON_BY_ID[it.id] && !it.playerSpawned) {
          if (seen.has(it.id)) {
            W.sect.gear.splice(i, 1);
            continue;
          }
          seen.add(it.id);
          w.uniqueArtifacts[it.id] = {
            itemId: it.id,
            uid: it.uid || ('uid_' + it.id),
            ownerKind: 'sect_storage',
            ownerId: 'sect',
            ownerNameTh: 'คลังศาสตราสำนัก',
            updatedDay: W.day
          };
        }
      }
    }

    // 3. Check in-flight expedition loot (`W.world.expeds`)
    for (const ex of (w.expeds || [])) {
      if (!ex || ex.done) continue;
      for (const bag of [ex.out && ex.out.gear, ex.clueOut && ex.clueOut.gear]) {
        if (!Array.isArray(bag)) continue;
        for (let i = bag.length - 1; i >= 0; i--) {
          const it = bag[i];
          if (!it) continue;
          VC.normalizeGearItem(it);
          if (VC.LEGENDARY_WEAPON_BY_ID[it.id] && !it.playerSpawned) {
            if (seen.has(it.id)) {
              bag.splice(i, 1);
              continue;
            }
            seen.add(it.id);
            w.uniqueArtifacts[it.id] = {
              itemId: it.id,
              uid: it.uid || ('uid_' + it.id),
              ownerKind: 'expedition_loot',
              ownerId: it.intendedRecipientId || ex.id,
              ownerNameTh: 'สัมภาระคณะเดินทาง',
              updatedDay: W.day
            };
          }
        }
      }
    }

    return w.uniqueArtifacts;
  };

  VC.auditUniqueWeaponInvariant = W => {
    VC.syncUniqueArtifacts(W);
    const counts = {};
    const locations = {};
    const addLoc = (id, loc) => {
      counts[id] = (counts[id] || 0) + 1;
      if (!locations[id]) locations[id] = [];
      locations[id].push(loc);
    };
    for (const n of (W.npcs || [])) {
      if (!n || n.dead) continue;
      for (const it of Object.values(n.equip || {})) {
        if (it && VC.LEGENDARY_WEAPON_BY_ID[it.id] && !it.playerSpawned) addLoc(it.id, 'npc_equipped:' + n.id);
      }
      for (const it of (n.inv && n.inv.gear) || []) {
        if (it && VC.LEGENDARY_WEAPON_BY_ID[it.id] && !it.playerSpawned) addLoc(it.id, 'npc_bag:' + n.id);
      }
    }
    for (const it of (W.sect && W.sect.gear) || []) {
      if (it && VC.LEGENDARY_WEAPON_BY_ID[it.id] && !it.playerSpawned) addLoc(it.id, 'sect_storage');
    }
    for (const ex of (W.world && W.world.expeds) || []) {
      if (!ex || ex.done) continue;
      for (const it of (ex.out && ex.out.gear) || []) {
        if (it && VC.LEGENDARY_WEAPON_BY_ID[it.id] && !it.playerSpawned) addLoc(it.id, 'expedition_loot:' + ex.id);
      }
    }
    const duplicates = Object.entries(counts).filter(([, c]) => c > 1);
    return {
      ok: duplicates.length === 0,
      counts,
      locations,
      duplicates,
      registry: Object.assign({}, W.world.uniqueArtifacts || {})
    };
  };

  /* ---------- Check Whether a Unique Target Is Already Owned or Claimed ---------- */
  VC.isTargetAlreadyClaimed = (W, template) => {
    if (!W || !template || !template.unique) return false;
    VC.ensure(W);
    const tid = template.targetId;
    if (W.world.claimReceipts && Object.values(W.world.claimReceipts).some(r => r && r.targetId === tid && r.status === 'settled')) {
      return true;
    }
    if (template.targetKind === 'EQUIPMENT') {
      const rec = W.world.uniqueArtifacts && W.world.uniqueArtifacts[tid];
      if (rec && rec.ownerKind !== 'unclaimed') return true;
      if ((W.sect.gear || []).some(g2 => g2 && g2.id === tid && !g2.playerSpawned)) return true;
      for (const n of (W.npcs || [])) {
        if (!n || n.dead) continue;
        if (n.equip && Object.values(n.equip).some(g2 => g2 && g2.id === tid && !g2.playerSpawned)) return true;
        if (n.inv && Array.isArray(n.inv.gear) && n.inv.gear.some(g2 => g2 && g2.id === tid && !g2.playerSpawned)) return true;
      }
      for (const ex of (W.world.expeds || [])) {
        if (ex && !ex.done && ex.out && Array.isArray(ex.out.gear) && ex.out.gear.some(g2 => g2 && g2.id === tid)) return true;
      }
    } else if (template.targetKind === 'TECH_MANUAL') {
      if ((W.sect.library || []).includes(tid)) return true;
      if (W.world.martial && Array.isArray(W.world.martial.foundLegends) && W.world.martial.foundLegends.includes(tid)) return true;
      for (const n of (W.npcs || [])) {
        if (!n || n.dead) continue;
        if (n.cult && (n.cult.techs.includes(tid) || n.cult.mantra === tid)) return true;
        if (n.inv && Array.isArray(n.inv.techs) && n.inv.techs.includes(tid)) return true;
      }
    }
    return false;
  };

  VC.findCurrentHolderOfUnique = (W, targetKind, targetId) => {
    if (!W) return null;
    if (targetKind === 'EQUIPMENT') {
      for (const n of (W.npcs || [])) {
        if (!n || n.dead) continue;
        if (n.equip && Object.values(n.equip).some(g2 => g2 && g2.id === targetId)) return { kind: 'npc_equipped', npcId: n.id, nameTh: HC.fullName(n) };
        if (n.inv && Array.isArray(n.inv.gear) && n.inv.gear.some(g2 => g2 && g2.id === targetId)) return { kind: 'npc_bag', npcId: n.id, nameTh: HC.fullName(n) };
      }
      if ((W.sect.gear || []).some(g2 => g2 && g2.id === targetId)) return { kind: 'sect_storage', nameTh: 'คลังศาสตราสำนัก' };
      const rec = W.world.uniqueArtifacts && W.world.uniqueArtifacts[targetId];
      if (rec) return { kind: rec.ownerKind, ownerId: rec.ownerId, nameTh: rec.ownerNameTh || rec.ownerKind };
    } else if (targetKind === 'TECH_MANUAL') {
      if ((W.sect.library || []).includes(targetId)) return { kind: 'sect_library', nameTh: 'หอคัมภีร์สำนัก' };
      for (const n of (W.npcs || [])) {
        if (!n || n.dead) continue;
        if ((n.inv && Array.isArray(n.inv.techs) && n.inv.techs.includes(targetId)) || (n.cult && (n.cult.techs.includes(targetId) || n.cult.mantra === targetId))) {
          return { kind: 'npc', npcId: n.id, nameTh: HC.fullName(n) };
        }
      }
    }
    return null;
  };

  /* ============================================================================
   * 4. PERSISTENT OUTSIDER / VISITOR LIFECYCLE & GATE AUTHORITY
   * ============================================================================ */
  // Read-only query of physically present guests on the sect map
  VC.activeGuests = W => {
    if (!W || !W.world || !Array.isArray(W.world.visitors)) return [];
    return W.world.visitors.filter(v => v && v.untilDay >= W.day && ['approaching', 'admission_pending', 'admitted', 'restricted', 'departing'].includes(v.state || 'admitted'));
  };

  VC.findVisitor = (W, id) => {
    if (!W || !W.world || !id) return null;
    const active = (W.world.visitors || []).find(v => v && v.id === id);
    if (active) return active;
    return (W.world.guestRegistry && W.world.guestRegistry[id]) || null;
  };

  // Evaluate gate admission using the preceding NPC authority chain (Guard / Disciplinarian / Mission Elder / Master + fallback)
  VC.evaluateGateAdmission = (W, visitor) => {
    const S = W.sect || {};
    const pol = S.policy || { openness: 50, strictness: 50 };
    const guard = SECT.holder(W, 'guard') || SECT.holder(W, 'discipline') || SECT.holder(W, 'mission') || W.byId[S.masterId] || W.npcs.find(n => !n.dead && !n.away);
    const officerName = guard ? guard.h.name.given : 'เวรยามหน้าประตู';
    const strictness = pol.strictness != null ? pol.strictness : 50;
    const openness = pol.openness != null ? pol.openness : 50;
    const officerCaution = guard ? E(guard, 'personality.caution') : 50;
    const officerHospitality = guard ? E(guard, 'social.hospitality') : 50;

    if (W.threat && W.threat.raid) {
      return { decision: 'rejected', accessLevel: 'none', officerId: guard ? guard.id : null, officerName, reasonTh: 'สำนักกำลังอยู่ในภาวะศึกสงคราม งดรับแขกภายนอก' };
    }
    if (visitor.hostileRisk > 72 && (strictness > 45 || officerCaution > 45)) {
      return { decision: 'rejected', accessLevel: 'none', officerId: guard ? guard.id : null, officerName, reasonTh: officerName + ' ตรวจพบกลิ่นอายน่าสงสัยและปฏิเสธไม่ให้เข้าสำนัก' };
    }
    if (visitor.kind === 'trader' || visitor.role === 'merchant') {
      return { decision: 'admitted', accessLevel: 'market_and_plaza', officerId: guard ? guard.id : null, officerName, reasonTh: officerName + ' อนุญาตให้เข้าค้าขายที่ตลาดสำนักและลานกลาง' };
    }
    if (strictness > 70 || (visitor.hostileRisk > 45 && officerCaution > officerHospitality)) {
      return { decision: 'restricted', accessLevel: 'courtyard_only', officerId: guard ? guard.id : null, officerName, reasonTh: officerName + ' อนุญาตให้พักเฉพาะลานกลางและศาลาชา ห้ามเข้าเขตหอคัมภีร์และคลัง' };
    }
    if (openness < 25 && visitor.visitCount <= 1 && (visitor.hospitalityScore || 50) < 55) {
      return { decision: 'rejected', accessLevel: 'none', officerId: guard ? guard.id : null, officerName, reasonTh: officerName + ' ปฏิเสธผู้มาเยือนแปลกหน้าตามนโยบายปิดสำนัก' };
    }
    return { decision: 'admitted', accessLevel: 'public_courtyard', officerId: guard ? guard.id : null, officerName, reasonTh: officerName + ' ต้อนรับเข้าสู่ลานสำนักและศาลาชา' };
  };

  VC.canVisitorAccessBuilding = (visitor, bkey) => {
    if (!visitor || visitor.state === 'rejected' || visitor.state === 'offsite') return false;
    // Restricted libraries, stockrooms, dorms and internal halls are NEVER open to guests without explicit authorization
    if (['treasury', 'dorm_outer', 'dorm_inner', 'dorm_core', 'elder_quarters', 'discipline'].includes(bkey)) return false;
    if (bkey === 'scripture') return visitor.authorizedLibrary === true;
    if (visitor.accessLevel === 'market_and_plaza') return ['gate', 'gate_zone', 'plaza', 'market', 'tea_garden'].includes(bkey);
    if (visitor.accessLevel === 'courtyard_only') return ['gate', 'gate_zone', 'plaza', 'tea_garden'].includes(bkey);
    return ['gate', 'gate_zone', 'plaza', 'market', 'tea_garden', 'shrine', 'infirmary', 'training_ground', 'main_hall', 'forge', 'alchemy'].includes(bkey);
  };

  function pickClueTemplateForVisitor(W, role, isNotable) {
    const cs = VC.ensure(W);
    if (cs.dailyBudget.cluesGenerated >= VC.DAILY_CLUE_BUDGET) return null;
    const pending = Object.values(cs.active).filter(c => c && ['active', 'in_progress'].includes(c.status));
    if (pending.length >= VC.MAX_ACTIVE_CLUES) return null;

    const activeCountByTpl = {};
    let activeLegendCount = 0;
    for (const c of pending) {
      activeCountByTpl[c.templateId] = (activeCountByTpl[c.templateId] || 0) + 1;
      if (c.rarity === 'Legendary') activeLegendCount++;
    }

    const candidates = CLUE_TEMPLATES.filter(t => {
      const maxConcurrent = t.unique ? 1 : (t.rarity === 'Common' ? 4 : t.rarity === 'Rare' ? 2 : 1);
      if ((activeCountByTpl[t.templateId] || 0) >= maxConcurrent) return false;
      const cdUntil = cs.cooldowns[t.templateId] || 0;
      if (W.day < cdUntil) return false;
      if (t.unique && VC.isTargetAlreadyClaimed(W, t)) return false;
      if (t.rarity === 'Legendary') {
        if (cs.dailyBudget.legendCluesGenerated >= VC.DAILY_LEGEND_CLUE_BUDGET) return false;
        if (activeLegendCount >= 2) return false;
        if (W.day < (cs.nextLegendaryClueDay || 0)) return false;
      }
      if (Array.isArray(t.visitorRoles) && !t.visitorRoles.includes(role)) return false;
      return true;
    });
    if (!candidates.length) return null;

    // Two-stage hierarchical rarity roll:
    // Stage 1: Roll rarity bucket so Common > Rare > Exceptional > Legendary regardless of how many Legendary templates exist in catalog!
    const fame = (W.sect && W.sect.fame) || 12;
    const fameFactor = clamp(0.8 + fame / 650, 0.8, 1.55);
    const byBucket = {
      Common: candidates.filter(t => t.rarity === 'Common'),
      Rare: candidates.filter(t => t.rarity === 'Rare'),
      Exceptional: candidates.filter(t => t.rarity === 'Exceptional'),
      Legendary: candidates.filter(t => t.rarity === 'Legendary')
    };
    const rCounts = (cs.funnel && cs.funnel.cluesByRarity) || {};
    const cComm = rCounts.Common || 0, cRare = rCounts.Rare || 0, cExc = rCounts.Exceptional || 0, cLeg = rCounts.Legendary || 0;
    const totalGen = cComm + cRare + cExc + cLeg;
    let pickedBucket;
    if (cLeg === 0 && W.day >= 85 && totalGen >= 8 && byBucket.Legendary.length > 0 && cExc >= 1) {
      pickedBucket = 'Legendary';
    } else if (cExc === 0 && W.day >= 55 && totalGen >= 6 && byBucket.Exceptional.length > 0 && cRare >= 2) {
      pickedBucket = 'Exceptional';
    } else if (cRare < 2 && W.day >= 35 && totalGen >= 4 && byBucket.Rare.length > 0) {
      pickedBucket = 'Rare';
    } else {
      const bucketWeights = [
        { bucket: 'Common', w: 68 },
        { bucket: 'Rare', w: (cRare + 1 >= cComm) ? 4 : 21 },
        { bucket: 'Exceptional', w: (cExc + 1 >= cRare) ? 1.2 : 6.8 * fameFactor },
        { bucket: 'Legendary', w: (cLeg >= 2 || cLeg >= cExc) ? 0.5 : (isNotable ? 4.5 : 1.8) * fameFactor }
      ];
      pickedBucket = W.rng.weighted(bucketWeights, x => x.w).bucket;
    }
    const fallbackOrder = pickedBucket === 'Legendary'
      ? ['Legendary', 'Exceptional', 'Rare', 'Common']
      : pickedBucket === 'Exceptional'
        ? ['Exceptional', 'Rare', 'Common']
        : pickedBucket === 'Rare'
          ? ['Rare', 'Common']
          : ['Common'];

    let pool = [];
    for (const b of fallbackOrder) {
      if (byBucket[b] && byBucket[b].length) {
        pool = byBucket[b];
        break;
      }
    }
    if (!pool.length) return null;
    const chosen = W.rng.pick(pool);
    if (chosen && chosen.rarity === 'Legendary') {
      cs.nextLegendaryClueDay = W.day + 28;
    }
    return chosen;
  }

  // Spawn or return a persistent non-merchant or merchant outsider
  VC.spawnGuest = (W, opts) => {
    opts = opts || {};
    const cs = VC.ensure(W);
    if (W.threat && W.threat.roadBlocked > 0 && !opts.force) return null;
    const active = VC.activeGuests(W);
    const cap = opts.burst ? VC.MAX_BURST_GUESTS : VC.MAX_ACTIVE_GUESTS;
    if (active.length >= cap && !opts.force) return null;

    // Check if a known offsite guest from guestRegistry should return (30% chance if available)
    const isMarketTrader = v => !!(v && (v.kind === 'trader' || v.role === 'merchant'));
    const hasMarketState = v => isMarketTrader(v)
      && Number.isFinite(v.stones) && v.stones >= 0
      && v.stock && typeof v.stock === 'object' && !Array.isArray(v.stock)
      && v.wants && typeof v.wants === 'object' && !Array.isArray(v.wants);
    const regEntries = Object.values(W.world.guestRegistry || {}).filter(g2 =>
      g2 && !active.some(a => a.id === g2.id) && (W.day - (g2.lastDepartDay || 0) >= 8)
      && (!opts.role || g2.role === opts.role)
      && (!isMarketTrader(g2) || hasMarketState(g2))
    );
    let guest = null;
    const explicitRecord = opts.returningId && W.world.guestRegistry && W.world.guestRegistry[opts.returningId];
    const reopenMarketTrader = (prev, options) => {
      if (!EXT || !EXT.openVisit) return null;
      const marketOptions = {
        id: prev && prev.id,
        subtype: prev && ['general', 'medicine', 'caravan', 'rare'].includes(prev.subtype) ? prev.subtype : 'general',
        nameTh: prev && prev.nameTh,
        stayDays: options && options.stayDays,
        clueTemplateId: (options && options.clueTemplateId) || (prev && prev.clueTemplateId),
        clueTruthful: options && options.clueTruthful != null ? options.clueTruthful : (prev ? prev.clueTruthful : undefined)
      };
      // Preserve a complete trader's wallet and ledgers. If an older record is
      // incomplete, EXT.openVisit generates a fresh valid market state instead.
      if (hasMarketState(prev)) Object.assign(marketOptions, { stones: prev.stones, stock: prev.stock, wants: prev.wants });
      const returned = EXT.openVisit(W, marketOptions);
      if (returned && prev) {
        returned.visitCount = (prev.visitCount || prev.visits || 1) + 1;
        returned.visits = returned.visitCount;
        W.world.guestRegistry[returned.id] = Object.assign({}, returned);
      }
      return returned;
    };
    // Returning merchants always pass through the market authority so market
    // counters, coordinates, wallet, stock, wants and transaction state stay coherent.
    if (explicitRecord && isMarketTrader(explicitRecord)) return reopenMarketTrader(explicitRecord, opts);
    if (explicitRecord && opts.role && explicitRecord.role !== opts.role) return null;
    // Explicitly requested merchants must be created by the external-market authority.
    if (!explicitRecord && opts.role === 'merchant' && EXT && EXT.openVisit) {
      return EXT.openVisit(W, {
        id: opts.id,
        subtype: opts.subtype,
        nameTh: opts.nameTh,
        stones: opts.stones,
        stock: opts.stock,
        wants: opts.wants,
        stayDays: opts.stayDays,
        untilDay: opts.untilDay,
        clueTemplateId: opts.clueTemplateId,
        clueTruthful: opts.clueTruthful
      });
    }
    const explicitReturn = explicitRecord || null;
    if (explicitReturn || (!opts.id && !opts.forceNew && regEntries.length && W.rng.chance(0.30))) {
      const prev = explicitReturn || W.rng.pick(regEntries);
      if (isMarketTrader(prev)) return reopenMarketTrader(prev, opts);
      guest = Object.assign({}, prev, {
        arriveDay: W.day,
        untilDay: W.day + clamp(Math.round(opts.stayDays || W.rng.int(2, 4)), 1, 5),
        state: 'admission_pending',
        x: MAP.GATE_IN.x + 0.5,
        y: MAP.GATE_IN.y + 0.5,
        px: MAP.GATE_IN.x + 0.5,
        py: MAP.GATE_IN.y + 0.5,
        visitCount: (prev.visitCount || prev.visits || 1) + 1,
        visits: (prev.visitCount || prev.visits || 1) + 1,
        interactedNpcIds: [],
        sharedClueThisVisit: false
      });
    } else {
      const roleKeys = Object.keys(VISITOR_ROLES).filter(k => k !== 'merchant');
      const role = opts.role || W.rng.pick(roleKeys);
      const roleSpec = VISITOR_ROLES[role] || VISITOR_ROLES.wanderer;
      const seq = ++cs.seq;
      const id = opts.id || ('guest_' + seq);
      const isNotable = opts.notable != null ? !!opts.notable : W.rng.chance(clamp(0.08 + ((W.sect && W.sect.fame) || 12) / 1600, 0.06, 0.28));
      const ageYears = opts.ageYears || W.rng.int(20, 62);
      const stage = opts.stage != null ? opts.stage : (isNotable ? W.rng.int(3, 5) : W.rng.int(1, 3));
      const npcLike = SIM.buildNpc(W, W.rng, {
        id,
        ageYears,
        quality: isNotable ? 0.85 : 0.45,
        rank: 0,
        stage
      });
      const sectAffil = ( role === 'envoy' && W.world.sects && W.world.sects.length ) ? W.rng.pick(W.world.sects) : null;
      guest = {
        id,
        kind: role === 'merchant' ? 'trader' : 'guest',
        role,
        roleTitleTh: (sectAffil ? (sectAffil.shortTh || sectAffil.nameTh) + ' · ' : '') + roleSpec.nameTh,
        sectId: sectAffil ? sectAffil.id : null,
        nameTh: HC.fullName(npcLike),
        h: npcLike.h,
        cult: npcLike.cult,
        equip: npcLike.equip || {},
        inv: { stones: opts.stones != null ? opts.stones : W.rng.int(120, isNotable ? 950 : 420), mats: {}, pills: {} },
        arriveDay: W.day,
        untilDay: opts.untilDay != null ? opts.untilDay : W.day + clamp(Math.round(opts.stayDays || W.rng.int(2, 3)), 1, 5),
        stones: opts.stones != null ? opts.stones : W.rng.int(120, isNotable ? 950 : 420),
        state: 'admission_pending',
        accessLevel: 'public_courtyard',
        hostileRisk: opts.hostileRisk != null ? opts.hostileRisk : Math.max(0, Math.round(100 - E(npcLike, 'personality.integrity') * 0.65 - E(npcLike, 'personality.empathy') * 0.25 + (W.rng.next() * 20 - 10))),
        isDeceptive: opts.isDeceptive != null ? !!opts.isDeceptive : (E(npcLike, 'personality.integrity') < 34 && E(npcLike, 'social.deception') > 58),
        notable: isNotable,
        visitCount: 1,
        visits: 1,
        hospitalityScore: 50,
        interactedNpcIds: [],
        x: MAP.GATE_IN.x + 0.5,
        y: MAP.GATE_IN.y + 0.5,
        px: MAP.GATE_IN.x + 0.5,
        py: MAP.GATE_IN.y + 0.5,
        face: 1,
        targetBkey: roleSpec.bkey || 'tea_garden'
      };
    }

    // Assign an optional clue payload (most visitors remain ordinary; ~32% carry a clue lead unless explicitly requested)
    if (opts.clueTemplateId) {
      guest.clueTemplateId = opts.clueTemplateId;
      guest.clueTruthful = opts.clueTruthful !== false;
    } else if (opts.withClue || W.rng.chance(guest.notable ? 0.55 : 0.28)) {
      const tpl = pickClueTemplateForVisitor(W, guest.role, guest.notable);
      if (tpl) {
        guest.clueTemplateId = tpl.templateId;
        guest.clueTruthful = !guest.isDeceptive || W.rng.chance(0.75);
      }
    }

    // Gate admission evaluation
    const adm = VC.evaluateGateAdmission(W, guest);
    if (opts.forceAdmit) {
      adm.decision = opts.forceAdmit;
      adm.accessLevel = opts.forceAdmit === 'admitted' ? 'public_courtyard' : opts.forceAdmit === 'restricted' ? 'courtyard_only' : 'none';
    }
    cs.funnel.visits++;
    guest.admissionDecision = adm;
    guest.titleTh = guest.roleTitleTh;
    guest.admissionBy = adm.officerName;
    guest.admissionReasonTh = adm.reasonTh;
    guest.purposeTh = guest.clueTemplateId ? 'บอกเล่าเบาะแสและแลกเปลี่ยนข่าวสารยุทธภพ' : 'แวะพักและเยี่ยมเยียนสำนัก';
    if (guest.clueTemplateId && (opts.withClue || opts.clueTemplateId) && adm.decision !== 'rejected') {
      const preInst = VC.createOrGetClueInstance(W, guest.clueTemplateId, {
        visitorId: guest.id,
        speakerNameTh: guest.nameTh,
        truthful: guest.clueTruthful !== false
      });
      if (preInst) guest.clueInstanceId = preInst.instanceId;
    }
    if (adm.decision === 'rejected') {
      guest.state = 'rejected';
      guest.accessLevel = 'none';
      guest.untilDay = W.day;
      cs.funnel.rejected++;
      W.world.guestRegistry[guest.id] = Object.assign({}, guest, { lastDepartDay: W.day });
      W.log('event', '🚪 ' + adm.reasonTh + ' (' + guest.nameTh + ' · ' + guest.roleTitleTh + ')', adm.officerId ? [adm.officerId] : [], { visitorId: guest.id });
      return guest;
    }

    guest.state = adm.decision; // 'admitted' or 'restricted'
    guest.accessLevel = adm.accessLevel;
    cs.funnel.admitted++;

    // Move guest toward an allowed courtyard/hall destination
    const destBkey = VC.canVisitorAccessBuilding(guest, guest.targetBkey) ? guest.targetBkey : 'tea_garden';
    const b = (W.map && W.map.byId && W.map.byId[destBkey]) || (W.map && W.map.byId && W.map.byId.plaza);
    if (b) {
      guest.destX = b.x + b.w / 2 + (W.rng.next() - 0.5) * 2.5;
      guest.destY = b.y + b.h / 2 + (W.rng.next() - 0.5) * 2.0;
    }

    W.world.visitors.push(guest);
    W.world.guestRegistry[guest.id] = Object.assign({}, guest);
    W.log('event', '🎐 ' + guest.nameTh + ' (' + guest.roleTitleTh + ') มาเยือนสำนัก — ' + adm.reasonTh, adm.officerId ? [adm.officerId] : [], { visitorId: guest.id });
    return guest;
  };

  // Enhance EXT.openVisit so newly spawned merchants also get a persistent human profile, coordinates, and optional clue lead
  const origOpenVisit = EXT.openVisit;
  EXT.openVisit = (W, options) => {
    const v = origOpenVisit(W, options);
    if (!v) return v;
    const cs = VC.ensure(W);
    v.role = 'merchant';
    v.roleTitleTh = 'วาณิชพเนจร (' + (v.subtype || 'general') + ')';
    v.state = 'admitted';
    v.accessLevel = 'market_and_plaza';
    const mkt = W.map && W.map.byId && W.map.byId.market;
    v.x = mkt ? mkt.x + mkt.w / 2 : 118;
    v.y = mkt ? mkt.y + mkt.h / 2 : 78;
    v.px = v.x;
    v.py = v.y;
    v.destX = v.x;
    v.destY = v.y;
    if (!v.clueTemplateId && options && options.clueTemplateId) {
      v.clueTemplateId = options.clueTemplateId;
      v.clueTruthful = options.clueTruthful !== false;
    } else if (!v.clueTemplateId && W.rng.chance(v.subtype === 'rare' ? 0.55 : 0.22)) {
      const tpl = pickClueTemplateForVisitor(W, 'merchant', v.subtype === 'rare');
      if (tpl) {
        v.clueTemplateId = tpl.templateId;
        v.clueTruthful = true;
      }
    }
    W.world.guestRegistry[v.id] = Object.assign({}, v);
    return v;
  };

  // Cleanup a departing or dead visitor, releasing any station/interaction references while retaining offsite summary
  VC.departVisitor = (W, v, reasonTh) => {
    if (!v) return;
    VC.ensure(W);
    v.state = 'offsite';
    v.lastDepartDay = W.day;
    if (v.st != null && W.map && W.map.stations[v.st]) {
      if (W.map.stations[v.st].occ === v.id) W.map.stations[v.st].occ = null;
      v.st = null;
    }
    // Release any member currently interacting with this visitor
    (W.npcs || []).forEach(n => {
      if (n && n.act && n.act.ctx && n.act.ctx.visitorId === v.id) {
        AI.cancelAct(W, n);
      }
    });
    const reg = W.world.guestRegistry;
    if (v.kind === 'trader' || v.role === 'merchant') {
      // EXT.openVisit stores a complete market-trader snapshot here. Preserve its
      // wallet, stock, wants, subtype and trade counters so a returning trader is
      // never reconstructed as a trader-shaped ordinary guest with no ledger.
      reg[v.id] = Object.assign({}, v, { lastDepartDay: W.day, state: 'offsite' });
    } else {
      reg[v.id] = {
        id: v.id,
        kind: v.kind,
        role: v.role,
        roleTitleTh: v.roleTitleTh,
        nameTh: v.nameTh,
        h: v.h,
        cult: v.cult,
        visitCount: v.visitCount || v.visits || 1,
        visits: v.visitCount || v.visits || 1,
        titleTh: v.titleTh || v.roleTitleTh,
        purposeTh: v.purposeTh,
        admissionBy: v.admissionBy,
        admissionReasonTh: v.admissionReasonTh,
        interactions: v.interactions || [],
        hospitalityScore: v.hospitalityScore || 50,
        lastDepartDay: W.day,
        state: 'offsite'
      };
    }
    VC.pruneGuestRegistry(W);
    if (reasonTh) {
      W.log('event', '👋 ' + v.nameTh + ' (' + (v.roleTitleTh || 'ผู้มาเยือน') + ') เดินทางออกจากสำนัก (' + reasonTh + ')', [], { visitorId: v.id });
    }
  };

  VC.pruneGuestRegistry = W => {
    if (!W || !W.world || !W.world.guestRegistry) return;
    const reg = W.world.guestRegistry;
    const keys = Object.keys(reg);
    if (keys.length <= VC.MAX_OFFSITE_REGISTRY) return;

    const protectedIds = new Set();
    // 1. Visitors referenced by active/in_progress clues
    for (const c of Object.values((W.world.clues && W.world.clues.active) || {})) {
      if (c && ['active', 'in_progress'].includes(c.status) && c.sourceVisitorId) {
        protectedIds.add(c.sourceVisitorId);
      }
    }
    // 2. Visitors with meaningful relationships or active commitments with living sect members
    for (const n of (W.npcs || [])) {
      if (!n || n.dead) continue;
      const rels = (n.h && n.h.mind && n.h.mind.relations) || {};
      for (const [vid, r] of Object.entries(rels)) {
        if (reg[vid] && (Math.abs(r.a || 0) >= 15 || (r.t || 0) >= 52 || (r.f || 0) >= 25)) {
          protectedIds.add(vid);
        }
      }
      const comms = (n.cognition && n.cognition.commitments) || [];
      for (const cm of comms) {
        if (cm && cm.partnerId && reg[cm.partnerId]) protectedIds.add(cm.partnerId);
      }
    }

    const removable = keys
      .filter(k => !protectedIds.has(k))
      .sort((a, b) => ((reg[a].lastDepartDay || 0) + (reg[a].visitCount || 1) * 3) - ((reg[b].lastDepartDay || 0) + (reg[b].visitCount || 1) * 3));
    while (Object.keys(reg).length > VC.MAX_OFFSITE_REGISTRY && removable.length) {
      delete reg[removable.shift()];
    }
  };

  /* ============================================================================
   * 5. CLUE INSTANCE CREATION, TESTIMONY, RUMOR PROVENANCE & SHARING
   * ============================================================================ */
  VC.spawnClueInstance = (W, templateId, opts) => {
    opts = opts || {};
    const truthful = opts.forceTruth === 'false_rumor' ? false : (opts.truthful !== undefined ? opts.truthful : true);
    return VC.createOrGetClueInstance(W, templateId, Object.assign({}, opts, { truthful, forceNewInstance: true }));
  };

  VC.createOrGetClueInstance = (W, templateId, sourceInfo) => {
    const cs = VC.ensure(W);
    const tpl = VC.TEMPLATE_BY_ID[templateId];
    if (!tpl) return null;
    sourceInfo = sourceInfo || {};

    // If an active clue instance for this template already exists, return it unless forceNewInstance is set
    // or a different visitor brings an independent non-unique Common/Rare lead
    if (!sourceInfo.forceNewInstance) {
      const activeForTpl = Object.values(cs.active).filter(c => c && c.templateId === templateId && !['claimed', 'disproven', 'abandoned', 'expired'].includes(c.status));
      if (activeForTpl.length > 0) {
        if (tpl.unique || !sourceInfo.visitorId) return activeForTpl[0];
        const sameVisitor = activeForTpl.find(c => c.sourceVisitorId === sourceInfo.visitorId);
        if (sameVisitor) return sameVisitor;
        const maxConcurrent = tpl.rarity === 'Common' ? 4 : tpl.rarity === 'Rare' ? 2 : 1;
        if (activeForTpl.length >= maxConcurrent) return activeForTpl[0];
      }
    }

    // Check uniqueness: if unique artifact/manual is already claimed/held, record a holder-rumor or return null
    if (tpl.unique && VC.isTargetAlreadyClaimed(W, tpl)) {
      cs.funnel.grantsBlockedDuplicate++;
      return null;
    }

    const id = 'clue_' + (++cs.seq);
    const rootRumorId = sourceInfo.rootRumorId || ('rumor_' + (++cs.rumorSeq));
    const truthful = sourceInfo.truthful !== false;
    const baseConf = sourceInfo.confidence != null ? sourceInfo.confidence : (truthful ? clamp(58 + W.rng.int(-8, 18), 35, 92) : clamp(42 + W.rng.int(-10, 15), 25, 72));

    const inst = {
      instanceId: id,
      templateId: tpl.templateId,
      version: 1,
      titleTh: tpl.titleTh,
      category: tpl.category,
      targetKind: tpl.targetKind,
      targetId: tpl.targetId,
      targetQty: tpl.targetQty || 1,
      tier: tpl.tier || 1,
      rarity: tpl.rarity || 'Common',
      unique: !!tpl.unique,
      regionId: tpl.regionId || 'mountain',
      rootRumorId,
      corroboratingRoots: [rootRumorId],
      rumorTextTh: tpl.rumorTextTh || '',
      truthState: truthful ? 'true_lead' : 'false_rumor',
      sourceVisitorId: sourceInfo.visitorId || null,
      sourceNameTh: sourceInfo.speakerNameTh || 'ผู้เดินทางนิรนาม',
      createdDay: W.day,
      createdAt: W.t,
      expiresDay: tpl.category === 'ORDINARY_MATERIAL' ? W.day + 45 : null,
      truthful,
      disprovenReasonTh: truthful ? null : 'เมื่อไปตรวจสอบตามคำบอกเล่า พบว่าเป็นข่าวลือที่คลาดเคลื่อนหรือถูกแต่งเติม',
      status: 'active',
      currentNodeIdx: 0,
      sectKnownNodeIdx: sourceInfo.reportedToSect ? 0 : -1,
      completedNodes: [],
      nodeAttempts: {},
      nodeFailures: {},
      totalFailures: 0,
      backoffDays: 0,
      nextRetryDay: 0,
      nextRetryAt: 0,
      reconBonus: 0,
      reconCount: 0,
      regionProgress: [],
      evidenceNotes: [],
      deliveredItems: [],
      authorizations: [],
      partyRefusals: [],
      lastFailure: null,
      lastEncounterSummary: null,
      lastTrialSummary: null,
      knownBy: {},
      reportedToSect: !!sourceInfo.reportedToSect,
      assignedParty: null,
      reservedByExpedId: null,
      reservedUntil: 0,
      claimReceiptId: null,
      lastActionReasonTh: 'เพิ่งได้รับเบาะแส รอผู้สนใจตรวจสอบ',
      history: [
        { day: W.day, t: W.t, milestone: true, text: 'เริ่มต้นเบาะแสจาก ' + (sourceInfo.speakerNameTh || 'ผู้มาเยือน') }
      ]
    };

    cs.active[id] = inst;
    cs.dailyBudget.cluesGenerated++;
    cs.funnel.rumorsSpawned = (cs.funnel.rumorsSpawned || 0) + 1;
    if (tpl.rarity === 'Legendary') cs.dailyBudget.legendCluesGenerated++;
    cs.funnel.cluesByTier[inst.tier] = (cs.funnel.cluesByTier[inst.tier] || 0) + 1;
    cs.funnel.cluesByRarity[inst.rarity] = (cs.funnel.cluesByRarity[inst.rarity] || 0) + 1;
    return inst;
  };

  // Record that an NPC has learned a clue (handling rumor provenance so hearing the same rootRumorId twice never counts as independent corroboration!)
  VC.learnClueFragment = (W, npc, instOrId, opts) => {
    opts = opts || {};
    const cs = VC.ensure(W);
    const inst = typeof instOrId === 'string' ? cs.active[instOrId] : instOrId;
    if (!inst || !npc || npc.dead) return { ok: false, corroborated: false };

    npc.knownClues = Array.isArray(npc.knownClues) ? npc.knownClues : [];
    if (!npc.knownClues.includes(inst.instanceId)) {
      npc.knownClues.push(inst.instanceId);
      if (npc.knownClues.length > 16) npc.knownClues.shift();
    }

    const discoveredNodeIdx = opts.knownNodeIdx != null ? opts.knownNodeIdx : (inst.currentNodeIdx || 0);
    const rumorId = opts.rootRumorId || inst.rootRumorId;
    const prev = inst.knownBy[npc.id];
    if (!prev) {
      const speakerRel = (opts.fromId && npc.h.mind.relations[opts.fromId]) ? npc.h.mind.relations[opts.fromId] : null;
      const trustMod = speakerRel ? ((speakerRel.t ?? 40) - 45) * 0.25 : 0;
      const gullibility = (E(npc, 'personality.trustfulness') - 50) * 0.18 - (E(npc, 'intellect.judgement') - 50) * 0.12;
      const rawConf = opts.confidence != null ? opts.confidence : (opts.baseConfidence || 60);
      const perceivedConf = clamp(Math.round(rawConf + trustMod + gullibility), 15, 95);
      inst.knownBy[npc.id] = {
        npcId: npc.id,
        learnedDay: W.day,
        learnedAt: W.t,
        fromId: opts.fromId || inst.sourceVisitorId || 'unknown',
        confidence: perceivedConf,
        knownNodeIdx: discoveredNodeIdx,
        rumorsHeard: [rumorId],
        independentSources: 1
      };
      if (!Array.isArray(inst.corroboratingRoots)) inst.corroboratingRoots = [inst.rootRumorId];
      if (rumorId && !inst.corroboratingRoots.includes(rumorId)) inst.corroboratingRoots.push(rumorId);
      if (opts.fromId && W.byId && W.byId[opts.fromId]) cs.funnel.cluesShared = (cs.funnel.cluesShared || 0) + 1;
      return { ok: true, isNew: true, corroborated: false, confidence: perceivedConf };
    }

    prev.knownNodeIdx = Math.max(prev.knownNodeIdx || 0, discoveredNodeIdx);

    // Already knows this clue: check if the incoming rumor has a DIFFERENT rootRumorId
    if (!Array.isArray(prev.rumorsHeard)) prev.rumorsHeard = [inst.rootRumorId];
    if (prev.rumorsHeard.includes(rumorId)) {
      return { ok: true, isNew: false, corroborated: false, sameRootRumor: true, confidence: prev.confidence };
    }

    prev.rumorsHeard.push(rumorId);
    if (!Array.isArray(inst.corroboratingRoots)) inst.corroboratingRoots = [inst.rootRumorId];
    if (rumorId && !inst.corroboratingRoots.includes(rumorId)) inst.corroboratingRoots.push(rumorId);
    prev.independentSources = (prev.independentSources || 1) + 1;
    prev.confidence = clamp(prev.confidence + 12, 15, 96);
    VC.pushClueHistory(inst, { day: W.day, t: W.t, text: npc.h.name.given + ' ได้รับคำยืนยันเบาะแสจากแหล่งข่าวอิสระเพิ่ม (ความเชื่อมั่น ' + prev.confidence + '%)' });
    return { ok: true, isNew: false, corroborated: true, confidence: prev.confidence };
  };

  // Report a clue to the sect archive (`W.sect.clueArchive`)
  VC.reportClueToSect = (W, npc, instOrId) => {
    const cs = VC.ensure(W);
    const inst = typeof instOrId === 'string' ? cs.active[instOrId] : instOrId;
    if (!inst || !npc) return false;
    if (!W.sect.clueArchive.includes(inst.instanceId)) {
      W.sect.clueArchive.push(inst.instanceId);
    }
    inst.reportedToSect = true;
    inst.sectKnownNodeIdx = Math.max(inst.sectKnownNodeIdx ?? 0, inst.currentNodeIdx || 0);
    const officers = [SECT.holder(W, 'mission'), SECT.holder(W, 'scripture'), W.byId[W.sect.masterId]].filter(Boolean);
    officers.forEach(off => {
      if (!off.dead) VC.learnClueFragment(W, off, inst, { fromId: npc.id, rootRumorId: inst.rootRumorId, baseConfidence: (inst.knownBy[npc.id]?.confidence || 65), knownNodeIdx: inst.sectKnownNodeIdx });
    });
    VC.pushClueHistory(inst, { day: W.day, t: W.t, text: npc.h.name.given + ' รายงานเบาะแสเข้าสู่บันทึกสำนัก' });
    return true;
  };

  /* ---------- Strict Knowledge Scoping for NPC Decisions & Default Player UI ---------- */
  VC.getNpcKnownClueView = (W, npc, instOrId) => {
    const cs = VC.ensure(W);
    const inst = typeof instOrId === 'string' ? cs.active[instOrId] : instOrId;
    if (!inst || !npc) return null;
    const tpl = VC.TEMPLATE_BY_ID[inst.templateId];
    if (!tpl || !Array.isArray(tpl.steps)) return null;
    const kEntry = inst.knownBy && inst.knownBy[npc.id];
    const inArchive = inst.reportedToSect && W.sect && Array.isArray(W.sect.clueArchive) && W.sect.clueArchive.includes(inst.instanceId);
    if (!kEntry && !inArchive) return null;

    const maxKnownIdx = clamp(
      Math.max(
        kEntry && kEntry.knownNodeIdx != null ? kEntry.knownNodeIdx : 0,
        (!npc.away && inArchive && inst.sectKnownNodeIdx != null) ? inst.sectKnownNodeIdx : 0
      ),
      0,
      Math.min(tpl.steps.length - 1, inst.currentNodeIdx || 0)
    );
    const visibleSteps = tpl.steps.slice(0, maxKnownIdx + 1).map((s, idx) => ({
      idx,
      nodeId: s.nodeId,
      titleTh: s.titleTh,
      type: s.type,
      approach: s.approach || s.type,
      locationId: s.locationId,
      scope: s.scope,
      skill: s.skill || null,
      statPath: s.statPath || null,
      minVal: s.minVal || 35,
      stoneCost: s.stoneCost || 0,
      requiredItemId: s.requiredItemId || null,
      acceptedItemIds: s.acceptedItemIds || null,
      completed: (inst.completedNodes || []).includes(s.nodeId)
    }));
    const terminalResolved = ['claimed', 'disproven'].includes(inst.status);
    return {
      instanceId: inst.instanceId,
      titleTh: inst.titleTh,
      rarity: inst.rarity,
      status: inst.status,
      confidence: kEntry ? kEntry.confidence : 60,
      knownNodeIdx: maxKnownIdx,
      currentStep: visibleSteps[maxKnownIdx] || null,
      visibleSteps,
      hiddenFutureStepsCount: Math.max(0, tpl.steps.length - visibleSteps.length),
      truthKnown: terminalResolved,
      truthState: terminalResolved ? inst.truthState : 'unverified'
    };
  };

  VC.getPlayerClueView = (W, instOrId, opts) => {
    opts = opts || {};
    const cs = VC.ensure(W);
    const inst = typeof instOrId === 'string' ? cs.active[instOrId] : instOrId;
    if (!inst) return null;
    const tpl = VC.TEMPLATE_BY_ID[inst.templateId];
    if (!tpl || !Array.isArray(tpl.steps)) return null;
    const discoveredIdx = opts.debugAllSteps
      ? tpl.steps.length - 1
      : clamp(inst.currentNodeIdx || 0, 0, tpl.steps.length - 1);
    const visibleSteps = tpl.steps.slice(0, discoveredIdx + 1).map((s, idx) => ({
      idx,
      nodeId: s.nodeId,
      titleTh: s.titleTh,
      type: s.type,
      approach: s.approach || s.type,
      locationId: s.locationId,
      scope: s.scope,
      skill: s.skill || null,
      statPath: s.statPath || null,
      minVal: s.minVal || 35,
      stoneCost: s.stoneCost || 0,
      requiredItemId: s.requiredItemId || null,
      acceptedItemIds: s.acceptedItemIds || null,
      hintTh: s.hintTh || '',
      completed: (inst.completedNodes || []).includes(s.nodeId),
      attempts: (inst.nodeAttempts && inst.nodeAttempts[s.nodeId]) || 0
    }));
    const terminalResolved = ['claimed', 'disproven'].includes(inst.status);
    return {
      instanceId: inst.instanceId,
      templateId: inst.templateId,
      titleTh: inst.titleTh,
      rarity: inst.rarity,
      tier: inst.tier,
      status: inst.status,
      discoveredIdx,
      totalSteps: tpl.steps.length,
      visibleSteps,
      hiddenFutureStepsCount: Math.max(0, tpl.steps.length - visibleSteps.length),
      truthKnown: terminalResolved,
      truthLabelTh: terminalResolved
        ? (inst.status === 'disproven' ? 'พิสูจน์แล้ว: ข่าวลือคลาดเคลื่อน' : 'พิสูจน์แล้ว: เบาะแสจริง')
        : 'ยังไม่พิสูจน์ความจริง (ต้องลงพื้นที่สืบค้น)',
      backoffActive: (inst.nextRetryDay || 0) > W.day,
      nextRetryDay: inst.nextRetryDay || 0,
      lastFailure: inst.lastFailure || null,
      lastEncounterSummary: inst.lastEncounterSummary || null,
      partyRefusals: inst.partyRefusals || [],
      authorizations: inst.authorizations || []
    };
  };

  /* ============================================================================
   * 6. EXACTLY-ONCE REWARD CLAIM & TRANSACTION ENGINE
   * ============================================================================ */
  VC.grantNamedStoryReward = (W, inst, claimant, party, opts) => {
    if (Array.isArray(claimant)) {
      opts = (party && !Array.isArray(party)) ? party : (opts || {});
      party = claimant;
      claimant = claimant[0];
    }
    opts = opts || {};
    const cs = VC.ensure(W);
    const livingParty = (party || [claimant]).filter(m => m && !m.dead);
    if (!claimant || claimant.dead) claimant = livingParty[0] || null;
    if (!inst || !claimant || claimant.dead || !livingParty.length) return { ok: false, reason: 'no-living-claimant' };

    // 1. Replay / Idempotency Guard: if this instance or claimReceipt is already settled, block duplicate payout!
    if (inst.claimReceiptId && W.world.claimReceipts[inst.claimReceiptId]) {
      cs.funnel.grantsBlockedDuplicate = (cs.funnel.grantsBlockedDuplicate || 0) + 1;
      return { ok: false, replay: true, reason: 'already-settled', receipt: W.world.claimReceipts[inst.claimReceiptId] };
    }
    const tpl = VC.TEMPLATE_BY_ID[inst.templateId];
    if (!tpl) return { ok: false, reason: 'unknown-template' };
    if (!['active', 'in_progress'].includes(inst.status) || !Array.isArray(inst.completedNodes) ||
        !tpl.steps.every(node => inst.completedNodes.includes(node.nodeId))) {
      return { ok: false, reason: 'story-not-complete' };
    }

    // 2. Verify Uniqueness before issuing
    if (tpl.unique && VC.isTargetAlreadyClaimed(W, tpl)) {
      const holder = VC.findCurrentHolderOfUnique(W, tpl.targetKind, tpl.targetId);
      inst.status = 'claimed';
      inst.lastActionReasonTh = 'สมบัติชิ้นนี้มีผู้ครอบครองไปแล้ว (' + (holder ? holder.nameTh : 'ไม่ทราบผู้ถือ') + ')';
      cs.funnel.grantsBlockedDuplicate++;
      return { ok: false, reason: 'already-claimed', holder };
    }

    // 3. Disproven / False Rumor Check
    if (!inst.truthful) {
      inst.status = 'disproven';
      inst.lastActionReasonTh = inst.disprovenReasonTh || 'เบาะแสคลาดเคลื่อน ไม่พบสมบัติตามคำเล่าลือ';
      VC.pushClueHistory(inst, { day: W.day, t: W.t, milestone: true, text: 'พิสูจน์แล้วว่าเบาะแสคลาดเคลื่อน: ' + inst.lastActionReasonTh });
      return { ok: false, disproven: true, reason: inst.lastActionReasonTh };
    }

    const receiptId = 'claim_' + inst.instanceId + '_' + tpl.targetId;
    if (W.world.claimReceipts[receiptId]) {
      inst.claimReceiptId = receiptId;
      inst.status = 'claimed';
      cs.funnel.grantsBlockedDuplicate = (cs.funnel.grantsBlockedDuplicate || 0) + 1;
      return { ok: false, replay: true, reason: 'already-settled', receipt: W.world.claimReceipts[receiptId] };
    }

    const viaExpedition = !!(opts.viaExpedition && opts.expedOut);
    let grantedItem = null;
    let grantedDescTh = '';

    // 4. Validate and execute strict named target grant (NEVER calls generic lottery fallback!)
    if (tpl.targetKind === 'MATERIAL') {
      const mat = ECO.matById[tpl.targetId];
      if (!mat) return { ok: false, reason: 'invalid-material-id' };
      const qty = Math.max(1, tpl.targetQty || 1);
      if (viaExpedition) {
        opts.expedOut.mats[mat.id] = (opts.expedOut.mats[mat.id] || 0) + qty;
        opts.expedOut.clueClaimedMats = opts.expedOut.clueClaimedMats || {};
        opts.expedOut.clueClaimedMats[mat.id] = (opts.expedOut.clueClaimedMats[mat.id] || 0) + qty;
      } else {
        claimant.inv.mats = claimant.inv.mats || {};
        claimant.inv.mats[mat.id] = (claimant.inv.mats[mat.id] || 0) + qty;
      }
      grantedItem = { kind: 'MATERIAL', id: mat.id, qty, nameTh: mat.nameTh };
      grantedDescTh = mat.nameTh + ' ×' + qty;
    } else if (tpl.targetKind === 'TECH_MANUAL') {
      const tech = CULT.tech(tpl.targetId);
      if (!tech) return { ok: false, reason: 'invalid-tech-id' };
      if (M.isInnateTech && M.isInnateTech(tech)) return { ok: false, reason: 'innate-tech-excluded' };

      if (viaExpedition) {
        opts.expedOut.techs = opts.expedOut.techs || [];
        if (!opts.expedOut.techs.includes(tech.id)) opts.expedOut.techs.push(tech.id);
      } else {
        claimant.inv.techs = claimant.inv.techs || [];
        if (!claimant.inv.techs.includes(tech.id) && !W.sect.library.includes(tech.id)) {
          claimant.inv.techs.push(tech.id);
        }
      }
      if (tech.legendary && W.world.martial && Array.isArray(W.world.martial.foundLegends) && !W.world.martial.foundLegends.includes(tech.id)) {
        W.world.martial.foundLegends.push(tech.id);
      }
      grantedItem = { kind: 'TECH_MANUAL', id: tech.id, qty: 1, nameTh: tech.nameTh };
      grantedDescTh = 'คัมภีร์「' + tech.nameTh + '」';
    } else if (tpl.targetKind === 'EQUIPMENT') {
      const itemDef = ECO.itemById[tpl.targetId];
      if (!itemDef) return { ok: false, reason: 'invalid-equipment-id' };
      const minted = ECO.mintGear(itemDef, itemDef.q || 1.3);
      minted.uid = 'uid_' + itemDef.id + '_' + inst.instanceId;
      minted.clueInstanceId = inst.instanceId;
      VC.normalizeGearItem(minted);

      if (viaExpedition) {
        minted.intendedRecipientId = claimant.id;
        opts.expedOut.gear = opts.expedOut.gear || [];
        opts.expedOut.gear.push(minted);
        if (tpl.unique) {
          W.world.uniqueArtifacts[itemDef.id] = {
            itemId: itemDef.id,
            uid: minted.uid,
            ownerKind: 'expedition_loot',
            ownerId: claimant.id,
            ownerNameTh: HC.fullName(claimant),
            updatedDay: W.day
          };
        }
      } else {
        claimant.inv.gear = Array.isArray(claimant.inv.gear) ? claimant.inv.gear : [];
        claimant.inv.gear.push(minted);
        if (tpl.unique) {
          W.world.uniqueArtifacts[itemDef.id] = {
            itemId: itemDef.id,
            uid: minted.uid,
            ownerKind: 'npc_bag',
            ownerId: claimant.id,
            ownerNameTh: HC.fullName(claimant),
            updatedDay: W.day
          };
        }
        const evalRes = M.classifyGearForNpc ? M.classifyGearForNpc(W, claimant, minted, 0) : null;
        if (evalRes && evalRes.category === 'useful-now' && SECT.EDITOR && SECT.EDITOR.equipPersonalGear) {
          SECT.EDITOR.equipPersonalGear(W, claimant.id, minted.uid);
          if (W.world.uniqueArtifacts[itemDef.id]) W.world.uniqueArtifacts[itemDef.id].ownerKind = 'npc_equipped';
          cs.funnel.equippedOrLearned++;
        }
      }
      grantedItem = { kind: 'EQUIPMENT', id: itemDef.id, uid: minted.uid, qty: 1, nameTh: minted.nameTh };
      grantedDescTh = 'ศาสตรา「' + minted.nameTh + '」';
    } else {
      return { ok: false, reason: 'unsupported-target-kind' };
    }

    const receipt = {
      receiptId,
      instanceId: inst.instanceId,
      templateId: inst.templateId,
      targetKind: tpl.targetKind,
      targetId: tpl.targetId,
      claimantId: claimant.id,
      partyIds: livingParty.map(p => p.id),
      day: W.day,
      t: W.t,
      status: 'settled',
      viaExpedition,
      grantedItem
    };
    W.world.claimReceipts[receiptId] = receipt;
    inst.claimReceiptId = receiptId;
    inst.status = 'claimed';
    inst.lastActionReasonTh = claimant.h.name.given + ' สืบหาและได้รับ ' + grantedDescTh + ' สำเร็จ';
    VC.pushClueHistory(inst, { day: W.day, t: W.t, milestone: true, text: inst.lastActionReasonTh });
    if (tpl.cooldownDays) {
      cs.cooldowns[tpl.templateId] = W.day + tpl.cooldownDays;
    }
    cs.funnel.terminalsReached++;
    cs.funnel.grantsSucceeded++;
    cs.funnel.rewardsClaimed = cs.funnel.grantsSucceeded;

    cs.history.push({
      instanceId: inst.instanceId,
      templateId: inst.templateId,
      titleTh: inst.titleTh,
      status: inst.status,
      claimantId: claimant.id,
      targetId: tpl.targetId,
      completedDay: W.day
    });
    if (cs.history.length > VC.MAX_CLUE_HISTORY) cs.history.shift();

    if (COG && COG.recordAspirationMilestone) {
      COG.recordAspirationMilestone(W, claimant, 'ค้นพบ' + grantedDescTh, tpl.rarity === 'Legendary' ? 20 : 8);
    }

    W.log(
      tpl.rarity === 'Legendary' ? 'breakthrough' : 'explore',
      '🌟 ' + claimant.h.name.given + ' บรรลุเบาะแส「' + inst.titleTh + '」ได้รับ ' + grantedDescTh + '!',
      [claimant.id],
      { clueId: inst.instanceId, itemId: tpl.targetId, receiptId }
    );
    return { ok: true, receipt, grantedItem };
  };

  /* ============================================================================
   * 7. NODE EVALUATION, READINESS FORECASTING, RETRY BACKOFF & GUARDIAN COMBAT
   * ============================================================================ */
  function evalActorNodeMetric(n, node) {
    if (!n || n.dead) return 0;
    let score = 0, count = 0;
    if (node.skill) {
      const skVal = Math.max(
        (M && M.skillRead) ? M.skillRead(n, node.skill) : 0,
        (n.h && n.h.skills && Number.isFinite(n.h.skills[node.skill])) ? n.h.skills[node.skill] : 0,
        (n.martialSkills && Number.isFinite(n.martialSkills[node.skill])) ? n.martialSkills[node.skill] : 0
      );
      score += skVal + (n.cult ? n.cult.stage * 4 : 0);
      count++;
    }
    if (node.statPath) {
      const stVal = (M && M.eff) ? M.eff(n, node.statPath) : E(n, node.statPath);
      score += stVal;
      count++;
    }
    if (!count) return 55;
    return score / count;
  }
  VC.evalActorNodeMetric = evalActorNodeMetric;

  // Deterministic Readiness Forecasting & Preparation Advisor (Item 6)
  VC.forecastNodeReadiness = (W, n, inst, node) => {
    if (!n || n.dead || !inst || !node) return { ready: false, gap: 99, reasonCode: 'invalid', reasonTh: 'ไม่พร้อมดำเนินการ' };
    if (inst.nextRetryDay && W.day < inst.nextRetryDay) {
      const prevFailScore = (inst.lastFailure && inst.lastFailure.nodeId === node.nodeId) ? (inst.lastFailure.effVal || 0) : 0;
      const curMetric = evalActorNodeMetric(n, node) + (inst.reconBonus || 0);
      if (curMetric < prevFailScore + 5) {
        return {
          ready: false,
          inBackoff: true,
          gap: Math.max(1, (node.minVal || 35) - curMetric),
          retryInDays: inst.nextRetryDay - W.day,
          reasonCode: 'backoff_cooldown',
          reasonTh: 'อยู่ระหว่างพักเตรียมตัวหลังไม่ผ่านขั้นตอน (รออีก ' + (inst.nextRetryDay - W.day) + ' วัน หรือฝึกฝนทักษะเพิ่ม)',
          recommendedAction: node.skill ? 'practice' : 'cultivate'
        };
      }
    }

    const hpFrac = n.h.state.hp / Math.max(1, CULT.hpMax(n));
    if (hpFrac < 0.65 || (n.inj && n.inj.length > 0)) {
      return {
        ready: false,
        gap: 20,
        reasonCode: 'injured_or_low_hp',
        reasonTh: 'ร่างกายบาดเจ็บหรือพลังชีวิตต่ำ ต้องรักษาตัวก่อน',
        recommendedAction: 'heal'
      };
    }

    if (node.type === 'guardian_combat') {
      const ownPower = CULT.power(n);
      const gPower = node.guardianPower || 1200;
      const reconMult = 1 + (inst.reconBonus || 0) * 0.015;
      const estPartyPower = ownPower * reconMult * 1.65;
      const gap = Math.round(Math.max(0, gPower * 0.72 - estPartyPower));
      const ready = estPartyPower >= gPower * 0.68 || ownPower >= gPower * 0.78;
      return {
        ready,
        gap,
        ownPower: Math.round(ownPower),
        guardianPower: gPower,
        reasonCode: ready ? 'ready' : 'guardian_too_strong',
        reasonTh: ready
          ? 'คาดว่ากำลังรบของคณะเพียงพอรับมือ ' + (node.guardianNameTh || 'ผู้พิทักษ์')
          : 'พลังรบยังไม่พอปะทะ ' + (node.guardianNameTh || 'ผู้พิทักษ์') + ' (ต้องการกำลังรบคณะราว ~' + Math.round(gPower * 0.75) + ')',
        recommendedAction: 'cultivate'
      };
    }

    const baseVal = evalActorNodeMetric(n, node) + (inst.reconBonus || 0);
    const minVal = node.minVal || 35;
    const gap = Math.round((minVal - baseVal) * 10) / 10;
    const canBringSpecialist = node.scope !== 'personal' && (W.npcs || []).some(c =>
      c !== n && !c.dead && !c.away && evalActorNodeMetric(c, node) + (inst.reconBonus || 0) >= minVal - 2
    );
    const ready = gap <= 4 || canBringSpecialist;
    return {
      ready,
      gap: Math.max(0, gap),
      effVal: Math.round(baseVal),
      minVal,
      canBringSpecialist,
      reasonCode: ready ? 'ready' : (node.scope === 'personal' ? 'personal_metric_low' : 'metric_low'),
      reasonTh: ready
        ? 'มีความพร้อมสำหรับขั้นตอน「' + node.titleTh + '」'
        : 'ทักษะ/คุณลักษณะยังไม่ถึงเกณฑ์ (' + Math.round(baseVal) + '/' + minVal + ') ควรฝึกฝนเพิ่มก่อนลองใหม่',
      recommendedAction: node.skill === 'SCRIPTURE' || node.skill === 'ARRAY' ? 'study' : (node.skill ? 'practice' : 'cultivate')
    };
  };

  VC.recordNodeFailureBackoff = (W, inst, node, actor, effVal, minVal, reasonTh) => {
    inst.nodeFailures = inst.nodeFailures || {};
    const fCount = (inst.nodeFailures[node.nodeId] || 0) + 1;
    inst.nodeFailures[node.nodeId] = fCount;
    inst.totalFailures = (inst.totalFailures || 0) + 1;
    const backoffDays = Math.min(16, 2 * Math.pow(2, fCount - 1));
    inst.backoffDays = backoffDays;
    inst.nextRetryDay = W.day + backoffDays;
    inst.nextRetryAt = W.t + backoffDays * 1440;
    const prepAdviceTh = node.type === 'guardian_combat'
      ? 'ควรบ่มเพาะตบะ เตรียมโอสถ และชวนสหายร่วมคณะเพิ่มก่อนกลับไปท้าทายใหม่'
      : node.skill
        ? 'ควรฝึกฝนทักษะ「' + node.skill + '」ให้ก้าวหน้าขึ้นอย่างน้อย +5 แต้มก่อนลองอีกครั้ง'
        : 'ควรพักฟื้นและขัดเกลาคุณสมบัติพื้นฐานก่อนกลับมาสืบต่อ';
    inst.lastFailure = {
      day: W.day,
      t: W.t,
      nodeId: node.nodeId,
      actorId: actor ? actor.id : null,
      effVal: Math.round(effVal || 0),
      minVal: minVal || 35,
      failCount: fCount,
      backoffDays,
      nextRetryDay: inst.nextRetryDay,
      reasonTh,
      prepAdviceTh
    };
    if (actor) {
      if (COG && COG.ensure) COG.ensure(W, actor);
      actor.cognition = actor.cognition || {};
      actor.cognition.cluePrep = {
        clueId: inst.instanceId,
        nodeId: node.nodeId,
        skill: node.skill || null,
        statPath: node.statPath || null,
        until: W.t + backoffDays * 1440,
        adviceTh: prepAdviceTh
      };
    }
    if (fCount >= 4 || inst.totalFailures >= 5) {
      inst.status = 'abandoned';
      inst.lastActionReasonTh = 'ละทิ้งการสืบเบาะแส「' + inst.titleTh + '」เนื่องจากล้มเหลวซ้ำหลายครั้งเกินกำลังในปัจจุบัน';
      VC.pushClueHistory(inst, { day: W.day, t: W.t, milestone: true, text: inst.lastActionReasonTh });
    }
  };

  // Authority verification for spending sect stones or drawing sect supplies on clue investigations (Item 4)
  VC.authorizeClueResourceUse = (W, actor, inst, req) => {
    req = req || {};
    const stoneCost = req.stoneCost || 0;
    const itemId = req.itemId || null;
    const itemQty = req.itemQty || 1;

    // 1. Check personal inventory first (always allowed for the member's own possessions)
    if (stoneCost > 0 && actor && actor.inv && (actor.inv.stones || 0) >= stoneCost) {
      actor.inv.stones -= stoneCost;
      return { ok: true, source: 'personal_stones', approvedBy: actor.id, reasonTh: 'ใช้ศิลาส่วนตัว ' + stoneCost + ' ก้อน' };
    }
    if (itemId && actor && actor.inv) {
      if (itemId === 'meal' && (actor.inv.meals || 0) >= itemQty) {
        actor.inv.meals -= itemQty;
        return { ok: true, source: 'personal_item', itemId, approvedBy: actor.id, reasonTh: 'ใช้เสบียงส่วนตัว' };
      }
      if (actor.inv.mats && (actor.inv.mats[itemId] || 0) >= itemQty) {
        actor.inv.mats[itemId] -= itemQty;
        if (actor.inv.mats[itemId] <= 0) delete actor.inv.mats[itemId];
        return { ok: true, source: 'personal_item', itemId, approvedBy: actor.id, reasonTh: 'ใช้วัตถุดิบส่วนตัว ' + ECO.name(itemId) };
      }
      if (actor.inv.pills && (actor.inv.pills[itemId] || 0) >= itemQty) {
        actor.inv.pills[itemId] -= itemQty;
        if (actor.inv.pills[itemId] <= 0) delete actor.inv.pills[itemId];
        return { ok: true, source: 'personal_item', itemId, approvedBy: actor.id, reasonTh: 'ใช้โอสถส่วนตัว ' + ECO.name(itemId) };
      }
    }

    // 2. Sect resource request: requires clue reported to sect AND officer/authority approval + reserve check
    if (!inst || !inst.reportedToSect) {
      return { ok: false, reason: 'not-reported-to-sect', reasonTh: 'เบาะแสยังไม่ได้รายงานเข้าสำนัก จึงเบิกงบหรือพัสดุสำนักไม่ได้' };
    }

    const hasDirectAuth = (COG && COG.hasAuthority)
      ? (COG.hasAuthority(W, actor, 'mission') || COG.hasAuthority(W, actor, 'treasury') || COG.hasAuthority(W, actor, 'master') || actor.rank >= 3)
      : (actor.rank >= 3 || !!actor.post);
    const officer = hasDirectAuth
      ? actor
      : (SECT.holder(W, 'mission') || SECT.holder(W, 'treasury') || W.byId[W.sect.masterId] || W.byId[W.sect.deputyId]);
    if (!officer || officer.dead || officer.away) {
      return { ok: false, reason: 'no-authorizing-officer', reasonTh: 'ไม่มีผู้มีอำนาจอนุมัติงบ/พัสดุอยู่ในสำนักขณะนี้' };
    }

    const minStoneReserve = (W.sect.reserveDirectives && W.sect.reserveDirectives.minStoneReserve) || 300;
    if (stoneCost > 0) {
      if ((W.sect.stones || 0) < stoneCost + minStoneReserve) {
        return { ok: false, reason: 'sect-stone-reserve-low', reasonTh: 'ศิลาสำรองของสำนักต่ำกว่าเกณฑ์ขั้นต่ำ (' + minStoneReserve + ' ก้อน)' };
      }
      if (!hasDirectAuth) {
        const rel = SECT.rel(officer, actor.id);
        if ((rel.t ?? 40) < 28 || (rel.a || 0) < -15) {
          return { ok: false, reason: 'officer-denied', reasonTh: officer.h.name.given + ' ปฏิเสธคำขอเบิกศิลาสำนักเนื่องจากยังไม่ไว้วางใจ' };
        }
      }
      ECO.pay(W, stoneCost, 'อนุมัติงบสืบเบาะแส「' + inst.titleTh + '」โดย ' + officer.h.name.given);
      const authRec = { day: W.day, t: W.t, actorId: actor.id, approvedBy: officer.id, officerNameTh: officer.h.name.given, kind: 'stones', amount: stoneCost };
      inst.authorizations = inst.authorizations || [];
      inst.authorizations.push(authRec);
      return { ok: true, source: 'sect_stones', approvedBy: officer.id, reasonTh: officer.h.name.given + ' อนุมัติงบสำนัก ' + stoneCost + ' ศิลา' };
    }

    if (itemId) {
      const minReserve = itemId === 'meal' ? ((W.sect.reserveDirectives && W.sect.reserveDirectives.minMealReserve) || 12) : 1;
      if (ECO.count(W, itemId) < itemQty + minReserve) {
        return { ok: false, reason: 'sect-item-reserve-low', reasonTh: 'พัสดุ「' + ECO.name(itemId) + '」ในคลังสำนักมีไม่พอเบิกจ่าย' };
      }
      ECO.take(W, itemId, itemQty);
      const authRec = { day: W.day, t: W.t, actorId: actor.id, approvedBy: officer.id, officerNameTh: officer.h.name.given, kind: 'item', itemId, qty: itemQty };
      inst.authorizations = inst.authorizations || [];
      inst.authorizations.push(authRec);
      return { ok: true, source: 'sect_stock', itemId, approvedBy: officer.id, reasonTh: officer.h.name.given + ' อนุมัติเบิก ' + ECO.name(itemId) + ' ×' + itemQty };
    }

    return { ok: false, reason: 'nothing-to-authorize' };
  };

  // Multi-Round Tactical Guardian Encounter Simulation (Item 1)
  VC.simulateGuardianEncounter = (W, party, node, inst, tpl, opts) => {
    opts = opts || {};
    const alive = party.filter(m => m && !m.dead);
    const gName = node.guardianNameTh || 'ผู้พิทักษ์มรดก';
    const gPower = node.guardianPower || 1500;
    const gTier = node.guardianTier || Math.max(3, (tpl && tpl.tier) || 4);

    if (!alive.length) {
      return { win: false, retreated: false, allDead: true, rounds: 0, casualties: [], logTh: ['ไม่มีผู้รอดชีวิตเข้าปะทะ'] };
    }

    // Prepare party with combat pills if available
    alive.forEach(m => { if (ST && ST.preFight) ST.preFight(W, m, true); });

    const reconBonus = inst && inst.reconBonus ? inst.reconBonus : 0;
    const partyPower = Math.round(alive.reduce((s, m) => s + CULT.power(m), 0) * (1 + reconBonus * 0.015));

    // Construct tactical guardian unit compatible with COMBAT & VC.runWeaponProcs
    const guardian = {
      id: 'guardian_' + (node.nodeId || 'site'),
      foe: true,
      nameTh: gName,
      tier: gTier,
      power: gPower,
      hpMax: Math.round(gPower * 1.45 + 120),
      hp: Math.round(gPower * 1.45 + 120),
      shieldBp: Math.round(gPower * 0.18),
      atk: Math.round(gPower * 0.34),
      def: Math.round(gPower * 0.24),
      mdef: Math.round(gPower * 0.22),
      crit: 8 + gTier * 1.5,
      eva: Math.round(gPower * 0.16),
      acc: Math.round(gPower * 0.28),
      sx: [],
      dead: false
    };

    const encFight = {
      id: 'exped_enc_' + (inst ? inst.instanceId : '0') + '_' + W.t,
      kind: 'guardian_encounter',
      serious: true,
      A: alive.map(m => m.id),
      B: [guardian.id]
    };

    const avgCourage = alive.reduce((s, m) => s + E(m, 'personality.courage'), 0) / alive.length;
    const avgCaution = alive.reduce((s, m) => s + E(m, 'personality.caution'), 0) / alive.length;
    const retreatThreshold = clamp(0.28 - (avgCourage - 50) * 0.0018 + (avgCaution - 50) * 0.0022, 0.16, 0.38);

    const logTh = [];
    const weaponProcsTriggered = [];
    const casualties = [];
    let pillsUsed = 0;
    let rounds = 0;
    let retreated = false;

    for (let r = 1; r <= 6; r++) {
      rounds = r;
      const roundLiving = alive.filter(m => !m.dead && m.h.state.hp > 0);
      if (!roundLiving.length || guardian.hp <= 0) break;

      // 1. Party members strike in order of cast speed
      roundLiving.sort((a, b) => (ST.get(b).cast || 100) - (ST.get(a).cast || 100));
      for (const m of roundLiving) {
        if (guardian.hp <= 0) break;
        // Emergency mid-fight pill usage
        if (g.CPE && g.CPE.fightUse && m.h.state.hp < CULT.hpMax(m) * 0.42) {
          if (g.CPE.fightUse(W, m, m.act && m.act.ctx ? m.act.ctx : {})) {
            pillsUsed++;
            logTh.push('รอบที่ ' + r + ': ' + m.h.name.given + ' ใช้โอสถฟื้นฟูกลางศึก');
          }
        }
        const st = ST.get(m);
        const rawOff = Math.max(st.atk || 40, st.matk || 40) * (1 + reconBonus * 0.015);
        const techId = (m.cult && Array.isArray(m.cult.techs) && m.cult.techs.length) ? m.cult.techs[m.cult.techs.length - 1] : null;
        const tech = techId ? CULT.tech(techId) : null;
        const skillMult = tech ? (1.12 + (tech.tier || 1) * 0.06) : 1.0;
        const effDef = Math.max(10, guardian.def * (1 - clamp((st.pen || 0) / 140, 0, 0.65)) * (ST.has(guardian, 'armorbreak') ? 0.75 : 1));
        const isCrit = W.rng.chance(clamp((st.crit || 5) / 100, 0.05, 0.75));
        const critMult = isCrit ? clamp((st.critDmg || 150) / 100, 1.25, 3.0) : 1.0;
        let dmg = Math.max(8, Math.round((rawOff * skillMult * (0.9 + W.rng.next() * 0.25) - effDef * 0.38) * critMult));
        if (opts.forcePass) dmg = Math.max(dmg, Math.ceil(guardian.hpMax / 2));

        if (guardian.shieldBp > 0) {
          const absorbed = Math.min(guardian.shieldBp, Math.round(dmg * 0.6));
          guardian.shieldBp -= absorbed;
          dmg = Math.max(1, dmg - absorbed);
        }
        guardian.hp = Math.max(0, guardian.hp - dmg);
        if (guardian.hp <= 0) guardian.dead = true;

        const strikeRes = { hit: true, dmg, crit: isCrit };
        const proc = VC.runWeaponProcs(W, encFight, m, guardian, !!tech, strikeRes);
        if (proc && proc.triggered) {
          weaponProcsTriggered.push({ round: r, npcId: m.id, weaponId: proc.weaponId, effectId: proc.effectId });
        }
      }

      if (guardian.hp <= 0) {
        logTh.push('รอบที่ ' + r + ': คณะสำรวจโค่น「' + gName + '」ลงได้สำเร็จ');
        break;
      }

      // 2. Guardian counter-attacks
      if (!opts.forcePass) {
        const targets = alive.filter(m => !m.dead && m.h.state.hp > 0);
        if (!targets.length) break;
        const isSweep = (r % 2 === 0 && targets.length > 1);
        const hitTargets = isSweep ? targets : [W.rng.pick(targets)];
        for (const tgt of hitTargets) {
          const tst = ST.get(tgt);
          const defVal = ((tst.def || 30) + (tst.mdef || 30)) * 0.5;
          const evadeProb = clamp(((tst.eva || 20) - guardian.acc * 0.65) / 400 + (ST.has(tgt, 'evadeUp') ? 0.18 : 0), 0.05, 0.55);
          if (W.rng.chance(evadeProb)) {
            logTh.push('รอบที่ ' + r + ': ' + tgt.h.name.given + ' พลิ้วกายหลบการโจมตีของ ' + gName);
            continue;
          }
          const sweepScale = isSweep ? 0.68 : 1.0;
          const weakenScale = ST.has(guardian, 'weaken') ? 0.82 : 1.0;
          const gDmg = Math.max(6, Math.round((guardian.atk * sweepScale * weakenScale * (0.88 + W.rng.next() * 0.24)) - defVal * 0.36));
          const gStrike = { hit: true, dmg: gDmg, crit: false };
          tgt.h.state.hp = Math.max(0, Math.round(tgt.h.state.hp - gDmg));

          const defProc = VC.runWeaponOnStruckProcs(W, encFight, tgt, guardian, gStrike);
          if (defProc && defProc.triggered) {
            weaponProcsTriggered.push({ round: r, npcId: tgt.id, weaponId: defProc.weaponId, effectId: defProc.effectId, defensive: true });
          }

          if (tgt.h.state.hp <= 0) {
            // Check lethal casualty vs severe injury knockdown
            const survSkill = (tgt.h.skills && tgt.h.skills.survival) || 0;
            const luck = E(tgt, 'destiny.luck');
            const lethalRisk = (opts.allowLethal !== false && gPower > partyPower * 1.35)
              ? clamp((gPower / Math.max(1, partyPower) - 1.15) * 0.35 * (1 - luck / 260) * (1 - survSkill / 240), 0.02, 0.42)
              : 0;
            if (opts.forceLethalWipe || (lethalRisk > 0 && W.rng.chance(lethalRisk))) {
              casualties.push({ npcId: tgt.id, nameTh: tgt.h.name.given });
              AI.kill(W, tgt, 'เสียชีวิตในการปะทะกับ' + gName);
              logTh.push('รอบที่ ' + r + ': ' + tgt.h.name.given + ' สิ้นชีพในการปะทะกับ ' + gName);
            } else {
              tgt.h.state.hp = Math.max(1, Math.round(CULT.hpMax(tgt) * 0.12));
              AI.injure(W, tgt, 2, 'บาดเจ็บสาหัสจากการปะทะกับ' + gName);
              logTh.push('รอบที่ ' + r + ': ' + tgt.h.name.given + ' บาดเจ็บหนักจากการโจมตีของ ' + gName);
            }
          }
        }
      }

      // 3. Evaluate tactical retreat threshold at end of round
      const stillAlive = alive.filter(m => !m.dead);
      if (!stillAlive.length) break;
      const avgHpFrac = stillAlive.reduce((s, m) => s + (m.h.state.hp / Math.max(1, CULT.hpMax(m))), 0) / stillAlive.length;
      if (!opts.forcePass && !opts.noRetreat && guardian.hp > guardian.hpMax * 0.22 && avgHpFrac <= retreatThreshold) {
        retreated = true;
        if (inst) inst.reconBonus = Math.min(18, (inst.reconBonus || 0) + 6);
        logTh.push('รอบที่ ' + r + ': พลังชีวิตคณะลดต่ำถึงเกณฑ์ถอย (' + Math.round(avgHpFrac * 100) + '%) จึงตัดสินใจถอนตัวเชิงยุทธ์และจดจำกระบวนท่าของผู้พิทักษ์ไว้');
        break;
      }
    }

    // Remove any dead members from caller's `party` array in place so dead members never claim rewards
    for (let i = party.length - 1; i >= 0; i--) {
      if (!party[i] || party[i].dead) party.splice(i, 1);
    }

    const win = opts.forcePass ? (party.length > 0) : (guardian.hp <= 0 && party.length > 0);
    const allDead = party.length === 0;
    if (win) {
      party.forEach(m => {
        HC.experience(m, 'victory', 0.35);
        if (m.cult && m.cult.techs && m.cult.techs.length) {
          (M && M.skillPractice ? M.skillPractice : HC.practice)(m, 'SWORD', 1.2, 1.1);
        }
      });
    }

    const summary = {
      kind: 'expedition_tactical_encounter',
      modeLabelTh: 'การปะทะเชิงยุทธ์ในการสำรวจนอกสำนัก (คำนวณหลายรอบด้วยค่าสถานะ อาวุธ และโอสถจริง)',
      guardianNameTh: gName,
      guardianPower: gPower,
      partyPower,
      rounds,
      win,
      retreated,
      allDead,
      casualties,
      pillsUsed,
      weaponProcsTriggered,
      guardianRemainingHp: Math.max(0, guardian.hp),
      logTh
    };
    if (inst) inst.lastEncounterSummary = summary;
    return summary;
  };

  // Controlled 3-Bout Nonlethal Martial / Dao Trial (Item 2)
  VC.simulateNonlethalTrial = (W, actor, node, inst) => {
    const baseMetric = evalActorNodeMetric(actor, node) + (inst && inst.reconBonus ? inst.reconBonus : 0);
    const composure = E(actor, 'personality.composure');
    const aggression = E(actor, 'personality.aggression');
    const willpower = E(actor, 'intellect.willpower');
    // In a nonlethal trial, excessive aggression without composure incurs a poise penalty
    const poiseMod = clamp((composure - aggression * 0.55) / 14 + (willpower - 50) / 18, -8, 10);
    let boutsWon = 0;
    const minVal = node.minVal || 50;
    for (let b = 1; b <= 3; b++) {
      const boutScore = baseMetric + poiseMod + W.rng.gauss(0, 3.2);
      if (boutScore >= minVal) boutsWon++;
    }
    const hm = CULT.hpMax(actor);
    actor.h.state.hp = Math.max(Math.round(hm * 0.25), Math.round(actor.h.state.hp - hm * 0.06));
    if (node.skill) {
      (M && M.skillPractice ? M.skillPractice : HC.practice)(actor, node.skill, 1.6, 1.2);
    }
    const summary = {
      kind: 'nonlethal_trial',
      actorId: actor.id,
      boutsWon,
      poiseMod: Math.round(poiseMod * 10) / 10,
      effVal: Math.round((baseMetric + poiseMod) * 10) / 10,
      minVal,
      passed: boutsWon >= 2
    };
    if (inst) inst.lastTrialSummary = summary;
    return summary;
  };

  VC.evaluateClueNode = (W, inst, party, opts) => {
    opts = opts || {};
    const cs = VC.ensure(W);
    if (!inst || !party || !party.length) return { ok: false, reason: 'no-party' };
    // Filter out any dead party members upfront
    for (let i = party.length - 1; i >= 0; i--) {
      if (!party[i] || party[i].dead) party.splice(i, 1);
    }
    if (!party.length) return { ok: false, reason: 'no-living-party' };

    const tpl = VC.TEMPLATE_BY_ID[inst.templateId];
    if (!tpl || !Array.isArray(tpl.steps)) return { ok: false, reason: 'invalid-template' };
    if (!['active', 'in_progress'].includes(inst.status)) return { ok: false, reason: 'already-finished' };
    if (inst.expiresDay != null && W.day > inst.expiresDay) {
      inst.status = 'expired';
      return { ok: false, reason: 'expired' };
    }

    const idx = clamp(inst.currentNodeIdx || 0, 0, tpl.steps.length - 1);
    const node = tpl.steps[idx];
    if (!node) return { ok: false, reason: 'no-node' };

    const leader = party[0];
    if (!inst.truthful || inst.truthState === 'false_rumor') {
      inst.status = 'disproven';
      inst.lastActionReasonTh = inst.disprovenReasonTh || 'เมื่อไปตรวจสอบตามคำบอกเล่า พบว่าเป็นข่าวลือที่คลาดเคลื่อนหรือถูกแต่งเติม';
      cs.funnel.falseRumorsDisproven = (cs.funnel.falseRumorsDisproven || 0) + 1;
      VC.pushClueHistory(inst, { day: W.day, t: W.t, milestone: true, text: leader.h.name.given + ' ตรวจสอบพบว่าเป็นข่าวลือเท็จ: ' + inst.lastActionReasonTh });
      return { ok: false, disproven: true, reason: inst.lastActionReasonTh };
    }

    const approach = opts.chosenApproach || node.approach || node.type;

    // Approach 7: Tactical Retreat / Reconnaissance (safe withdrawal that grants reconBonus for next attempt)
    if (approach === 'tactical_retreat' && !opts.forcePass) {
      inst.reconCount = (inst.reconCount || 0) + 1;
      inst.reconBonus = Math.min(18, (inst.reconBonus || 0) + 8);
      inst.nextRetryDay = W.day + 2;
      inst.nextRetryAt = W.t + 2 * 1440;
      inst.lastActionReasonTh = leader.h.name.given + ' เลือกถอนตัวเชิงยุทธ์เพื่อประเมินกำลังและบันทึกจุดอ่อน (+โบนัสเตรียมพร้อม +' + inst.reconBonus + ')';
      VC.pushClueHistory(inst, { day: W.day, t: W.t, text: inst.lastActionReasonTh });
      return { ok: false, passed: false, retreated: true, tacticalRetreat: true, reconBonus: inst.reconBonus, reason: inst.lastActionReasonTh };
    }

    // Check required item / reagent delivery (`deliver_item` or `help_contact` item aid)
    let approachBonus = inst.reconBonus || 0;
    const itemCandidates = node.requiredItemId ? [node.requiredItemId] : (Array.isArray(node.acceptedItemIds) ? node.acceptedItemIds : []);
    if ((approach === 'deliver_item' || approach === 'help_contact') && itemCandidates.length && !inst.completedNodes.includes(node.nodeId + ':item')) {
      let consumedItem = null;
      for (const cid of itemCandidates) {
        const authItem = VC.authorizeClueResourceUse(W, leader, inst, { itemId: cid, itemQty: node.requiredItemQty || 1 });
        if (authItem && authItem.ok) {
          consumedItem = cid;
          break;
        }
      }
      if (consumedItem) {
        inst.completedNodes.push(node.nodeId + ':item');
        inst.deliveredItems = inst.deliveredItems || [];
        inst.deliveredItems.push({ day: W.day, nodeId: node.nodeId, itemId: consumedItem, by: leader.id });
        approachBonus += 10;
        if (approach === 'help_contact') {
          if (inst.sourceVisitorId) {
            const rel = SECT.rel(leader, inst.sourceVisitorId);
            rel.a = clamp((rel.a || 0) + 8, -100, 100);
            rel.t = clamp((rel.t ?? 40) + 10, 0, 100);
          }
          if (COG && COG.remember) COG.remember(W, leader, { kind: 'gave_help', subjectId: inst.sourceVisitorId || 'visitor', severity: 0.5 });
        }
      } else if (node.requiredItemId && !opts.forcePass) {
        inst.lastActionReasonTh = 'ติดขัดที่ขั้นตอน「' + node.titleTh + '」: ขาดพัสดุ/วัตถุดิบ「' + ECO.name(node.requiredItemId) + '」';
        return { ok: false, blocked: true, reason: 'missing-required-item', requiredItemId: node.requiredItemId, hintTh: inst.lastActionReasonTh };
      }
    }

    // Check required stone cost with formal authority check (Item 4)
    if (node.stoneCost && node.stoneCost > 0 && !inst.completedNodes.includes(node.nodeId + ':paid') && !inst.completedNodes.includes(node.nodeId + ':item')) {
      const authStone = VC.authorizeClueResourceUse(W, leader, inst, { stoneCost: node.stoneCost });
      if (!authStone.ok) {
        if (!opts.forcePass) {
          inst.lastActionReasonTh = 'ติดขัดที่ขั้นตอน「' + node.titleTh + '」: ' + (authStone.reasonTh || ('ศิลาไม่พอจ่ายค่าใช้จ่าย (' + node.stoneCost + ' ก้อน)'));
          return { ok: false, blocked: true, reason: authStone.reason || 'insufficient-stones', hintTh: inst.lastActionReasonTh };
        }
      } else {
        inst.completedNodes.push(node.nodeId + ':paid');
      }
    }

    let effVal = 0;
    let actorTested = leader;
    if (node.type === 'guardian_combat' || approach === 'guardian_combat') {
      const enc = VC.simulateGuardianEncounter(W, party, node, inst, tpl, opts);
      if (!enc.win) {
        cs.funnel.nodesFailed++;
        inst.nodeAttempts[node.nodeId] = (inst.nodeAttempts[node.nodeId] || 0) + 1;
        if (enc.allDead) {
          inst.lastActionReasonTh = 'คณะสำรวจสิ้นชีพทั้งหมดในการปะทะกับ「' + (node.guardianNameTh || node.titleTh) + '」';
          VC.pushClueHistory(inst, { day: W.day, t: W.t, milestone: true, text: inst.lastActionReasonTh });
          return { ok: false, passed: false, allDead: true, encounter: enc, reason: inst.lastActionReasonTh };
        }
        const failReason = enc.retreated
          ? 'ถอนตัวเชิงยุทธ์จาก「' + (node.guardianNameTh || node.titleTh) + '」หลังปะทะ ' + enc.rounds + ' รอบ (บันทึกจุดอ่อนผู้พิทักษ์ไว้แล้ว)'
          : 'พ่ายแพ้ต่อ「' + (node.guardianNameTh || node.titleTh) + '」หลังปะทะ ' + enc.rounds + ' รอบ ต้องพักฟื้นและรวมกำลังใหม่';
        inst.lastActionReasonTh = failReason;
        VC.recordNodeFailureBackoff(W, inst, node, leader, enc.partyPower, enc.guardianPower, failReason);
        VC.pushClueHistory(inst, { day: W.day, t: W.t, text: leader.h.name.given + ': ' + failReason });
        return { ok: false, passed: false, retreated: true, encounter: enc, reason: failReason };
      }
      effVal = 999;
      actorTested = party[0];
    } else if (approach === 'nonlethal_trial') {
      actorTested = node.scope === 'personal' ? leader : party.slice().sort((a, b) => evalActorNodeMetric(b, node) - evalActorNodeMetric(a, node))[0];
      const trial = VC.simulateNonlethalTrial(W, actorTested, node, inst);
      effVal = trial.effVal + approachBonus;
      if (!opts.forcePass && !trial.passed) {
        cs.funnel.nodesFailed++;
        inst.nodeAttempts[node.nodeId] = (inst.nodeAttempts[node.nodeId] || 0) + 1;
        inst.lastActionReasonTh = actorTested.h.name.given + ' ยังไม่ผ่านการประลองเชิงยุทธ์ไม่เอาชีวิต「' + node.titleTh + '」(' + trial.boutsWon + '/3 กระบวนท่า)';
        VC.recordNodeFailureBackoff(W, inst, node, actorTested, effVal, node.minVal || 50, inst.lastActionReasonTh);
        VC.pushClueHistory(inst, { day: W.day, t: W.t, text: inst.lastActionReasonTh });
        return { ok: false, passed: false, trial, reason: inst.lastActionReasonTh, effVal, minVal: node.minVal || 50 };
      }
      effVal = Math.max(effVal, (node.minVal || 50) + 5);
    } else {
      if (node.scope === 'personal') {
        effVal = evalActorNodeMetric(leader, node);
        actorTested = leader;
      } else if (node.scope === 'party_all') {
        effVal = party.reduce((s, m) => s + evalActorNodeMetric(m, node), 0) / party.length;
        actorTested = leader;
      } else {
        let bestM = leader, bestV = -1;
        for (const m of party) {
          const v = evalActorNodeMetric(m, node);
          if (v > bestV) { bestV = v; bestM = m; }
        }
        effVal = bestV;
        actorTested = bestM;
      }
      effVal += approachBonus;

      if (approach === 'honor_commitment') {
        const integ = E(actorTested, 'personality.integrity');
        const loyal = E(actorTested, 'personality.loyalty');
        const activeComms = (actorTested.cognition && Array.isArray(actorTested.cognition.commitments)) ? actorTested.cognition.commitments.length : 0;
        effVal += (integ - 50) * 0.18 + (loyal - 50) * 0.12 + activeComms * 3;
        if (COG && COG.startCommitment && !opts.forcePass) {
          COG.startCommitment(W, actorTested, { kind: 'honor_oath', partnerId: inst.sourceVisitorId || W.sect.masterId, duration: 720, noteTh: 'รักษาคำสัตย์ในเบาะแส「' + inst.titleTh + '」' });
        }
      } else if (approach === 'interpret_evidence') {
        const libBonus = Math.min(6, ((W.sect && W.sect.library && W.sect.library.length) || 0) * 0.25);
        effVal += libBonus;
      } else if (approach === 'help_contact') {
        const hosp = E(actorTested, 'social.hospitality');
        const med = (actorTested.h.skills && actorTested.h.skills.MEDICINE) || 0;
        effVal += (hosp - 45) * 0.16 + med * 0.12;
      }
    }

    const minVal = node.minVal || 35;
    const passed = opts.forcePass || effVal + W.rng.gauss(0, 4) >= minVal;
    inst.nodeAttempts[node.nodeId] = (inst.nodeAttempts[node.nodeId] || 0) + 1;

    if (!passed) {
      cs.funnel.nodesFailed++;
      const scopeNote = node.scope === 'personal' ? ' (บททดสอบเฉพาะตัว ผู้ติดตามช่วยแทนไม่ได้)' : '';
      inst.lastActionReasonTh = 'ยังไม่ผ่านขั้นตอน「' + node.titleTh + '」' + scopeNote + ' — ' + (node.hintTh || 'ต้องฝึกฝนเพิ่มเติม');
      VC.recordNodeFailureBackoff(W, inst, node, actorTested, effVal, minVal, inst.lastActionReasonTh);
      VC.pushClueHistory(inst, { day: W.day, t: W.t, text: actorTested.h.name.given + ' ยังไม่ผ่าน「' + node.titleTh + '」(' + Math.round(effVal) + '/' + minVal + ')' });
      return { ok: false, passed: false, reason: inst.lastActionReasonTh, effVal, minVal };
    }

    // Node passed! Clear any retry backoff and update discovered step index for all surviving party members
    cs.funnel.nodesPassed++;
    inst.backoffDays = 0;
    inst.nextRetryDay = 0;
    inst.nextRetryAt = 0;
    inst.reconBonus = 0;
    if (!inst.completedNodes.includes(node.nodeId)) inst.completedNodes.push(node.nodeId);
    inst.regionProgress = inst.regionProgress || [];
    inst.regionProgress.push({ day: W.day, nodeId: node.nodeId, locationId: node.locationId, approach, actorId: actorTested.id });

    if (node.skill && actorTested) {
      (M && M.skillPractice ? M.skillPractice : HC.practice)(actorTested, node.skill, 1.8, 1.2);
    }
    if (approach === 'interpret_evidence') {
      inst.evidenceNotes = inst.evidenceNotes || [];
      inst.evidenceNotes.push({ day: W.day, nodeId: node.nodeId, by: actorTested.h.name.given, summaryTh: 'ตีความหลักฐาน「' + node.titleTh + '」สำเร็จ' });
    }
    VC.pushClueHistory(inst, { day: W.day, t: W.t, milestone: true, text: actorTested.h.name.given + ' ผ่านขั้นตอน「' + node.titleTh + '」สำเร็จ' });

    if (node.onPass === 'REWARD' || idx >= tpl.steps.length - 1) {
      return VC.grantNamedStoryReward(W, inst, leader, party, opts);
    }

    // Advance to next node & update knowledge scoping for participating members
    const nextIdx = tpl.steps.findIndex(s => s.nodeId === node.onPass);
    inst.currentNodeIdx = nextIdx >= 0 ? nextIdx : (idx + 1);
    const nextNode = tpl.steps[inst.currentNodeIdx];
    inst.status = 'in_progress';
    party.forEach(m => {
      if (m && !m.dead) {
        if (!inst.knownBy[m.id]) {
          VC.learnClueFragment(W, m, inst, { fromId: leader.id, rootRumorId: inst.rootRumorId, knownNodeIdx: inst.currentNodeIdx });
        } else {
          inst.knownBy[m.id].knownNodeIdx = Math.max(inst.knownBy[m.id].knownNodeIdx || 0, inst.currentNodeIdx);
        }
      }
    });
    if (inst.reportedToSect) {
      inst.sectKnownNodeIdx = Math.max(inst.sectKnownNodeIdx || 0, inst.currentNodeIdx);
    }
    const crossRegionNote = (nextNode && nextNode.locationId !== node.locationId && nextNode.locationId !== 'sect')
      ? ' (ต้องเดินทางต่อไปยังภูมิภาค「' + nextNode.locationId + '」)'
      : '';
    inst.lastActionReasonTh = 'ผ่าน「' + node.titleTh + '」แล้ว ขั้นต่อไป: ' + (nextNode ? nextNode.titleTh : 'รับรางวัล') + crossRegionNote;
    return { ok: true, passed: true, advanced: true, nextNodeId: nextNode ? nextNode.nodeId : null, nextLocationId: nextNode ? nextNode.locationId : null };
  };

  /* ============================================================================
   * 8. MEMBER–VISITOR INTERACTIONS, CONSENT & NPC INVESTIGATION EXPEDITIONS
   * ============================================================================ */
  VC.pickVisitorForMember = (W, n) => {
    if (!W || !n || n.dead || n.away || n.exiled) return null;
    if (!W.world || !Array.isArray(W.world.visitors) || !W.world.visitors.length) return null;
    const vcVisMemo = VC._visMemo || (VC._visMemo = new WeakMap());
    const mEntry = vcVisMemo.get(n);
    if (mEntry && mEntry.t === W.t) return mEntry.v;
    const guests = VC.activeGuests(W).filter(v => v && ['admitted', 'restricted'].includes(v.state));
    if (!guests.length) { vcVisMemo.set(n, { t: W.t, v: null }); return null; }
    let best = null, bestS = -1e9;
    for (const v of guests) {
      const alreadyMet = Array.isArray(v.interactedNpcIds) && v.interactedNpcIds.includes(n.id);
      if (alreadyMet && v.interactedNpcIds.length >= 4) continue;
      let s = (E(n, 'temperament.sociability') - 42) / 50 + (E(n, 'personality.curiosity') - 42) / 45;
      if (v.role === 'scholar' && E(n, 'interests.scholarship') > 55) s += 0.6;
      if (v.role === 'herbalist' && (E(n, 'interests.herbs') > 55 || E(n, 'interests.medicine') > 55)) s += 0.6;
      if (v.role === 'artisan' && E(n, 'interests.forging') > 55) s += 0.6;
      if (v.role === 'wanderer' && E(n, 'interests.combat') > 55) s += 0.5;
      if (v.clueTemplateId && !v.sharedClueThisVisit) s += 0.45;
      if (alreadyMet) s -= 0.8;
      if (s > bestS) { bestS = s; best = v; }
    }
    const out = bestS > 0.1 ? best : null;
    vcVisMemo.set(n, { t: W.t, v: out });
    return out;
  };

  const WORLD_NEWS_TOPICS = [
    { kind: 'market_news', textTh: 'แจ้งข่าวคาราวานสมุนไพรและราคาตลาดชายแดนที่กำลังคึกคัก', skill: 'trading' },
    { kind: 'herb_news', textTh: 'แบ่งปันวิธีสังเกตสมุนไพรวิญญาณตามฤดูกาลในหุบเขา', skill: 'herbalism' },
    { kind: 'martial_gossip', textTh: 'เล่าขานผลการประลองของสำนักใหญ่และแนวทางการฝึกยุทธ์ในยุทธภพ', skill: 'SWORD' },
    { kind: 'forge_news', textTh: 'แลกเปลี่ยนเคล็ดลับการคัดแยกแร่และการควบคุมไฟเตาหลอม', skill: 'FORGING' },
    { kind: 'scholar_news', textTh: 'สนทนาเรื่องประวัติศาสตร์ยุทธภพและอักขระโบราณ', skill: 'SCRIPTURE' }
  ];

  VC.shareVisitorWorldNews = (W, n, v) => {
    const cs = VC.ensure(W);
    const topic = W.rng.pick(WORLD_NEWS_TOPICS);
    if (topic.skill) {
      (M && M.skillPractice ? M.skillPractice : HC.practice)(n, topic.skill, 0.35, 1.0);
    }
    W.world.visitorNews = Array.isArray(W.world.visitorNews) ? W.world.visitorNews : [];
    const newsEntry = {
      day: W.day,
      t: W.t,
      visitorId: v.id,
      visitorNameTh: v.nameTh,
      npcId: n.id,
      kind: topic.kind,
      textTh: v.nameTh + ' ' + topic.textTh
    };
    W.world.visitorNews.push(newsEntry);
    if (W.world.visitorNews.length > 36) W.world.visitorNews.shift();
    cs.funnel.worldNewsShared = (cs.funnel.worldNewsShared || 0) + 1;
    return newsEntry;
  };

  VC.interactWithVisitor = (W, n, v) => {
    const cs = VC.ensure(W);
    if (!n || !v || n.dead || v.state === 'rejected' || v.state === 'offsite') return { ok: false };
    v.interactedNpcIds = Array.isArray(v.interactedNpcIds) ? v.interactedNpcIds : [];
    if (!v.interactedNpcIds.includes(n.id)) v.interactedNpcIds.push(n.id);

    const rel = SECT.rel(n, v.id);
    const cha = E(n, 'social.charisma'), emp = E(n, 'personality.empathy');
    const deltaA = Math.round(3 + (cha - 45) / 18 + (emp - 45) / 22);
    rel.a = clamp((rel.a || 0) + deltaA, -100, 100);
    rel.t = clamp((rel.t ?? 40) + Math.max(1, Math.round(deltaA * 0.6)), 0, 100);
    rel.n = (rel.n || 0) + 1;
    v.hospitalityScore = clamp((v.hospitalityScore || 50) + 3, 0, 100);
    HC.feel(n, { social: 10, mood: 3, novelty: 5 });
    (M && M.skillPractice ? M.skillPractice : HC.practice)(n, 'diplomacy', 0.4, 1);

    // If visitor carries a clue lead and trusts/likes the member enough, share the clue!
    let clueShared = null;
    if (v.clueTemplateId && (!v.sharedClueThisVisit || rel.a >= 15)) {
      const shareChance = !v.sharedClueThisVisit ? 1.0 : clamp(0.55 + rel.a / 100 + (cha - 45) / 150, 0.25, 0.95);
      if (W.rng.chance(shareChance)) {
        const inst = VC.createOrGetClueInstance(W, v.clueTemplateId, {
          visitorId: v.id,
          speakerNameTh: v.nameTh,
          truthful: v.clueTruthful !== false
        });
        if (inst) {
          v.sharedClueThisVisit = true;
          cs.funnel.infoEncounters++;
          VC.learnClueFragment(W, n, inst, { fromId: v.id, rootRumorId: inst.rootRumorId });
          if (E(n, 'personality.loyalty') >= 48 || n.rank >= 3 || n.post) {
            VC.reportClueToSect(W, n, inst);
          }
          v.clueInstanceId = inst.instanceId;
          clueShared = inst;
          W.log('explore', '🗣️ ' + v.nameTh + ' เล่าเบาะแส「' + inst.titleTh + '」ให้ ' + n.h.name.given + ' ฟัง', [n.id], { visitorId: v.id, clueId: inst.instanceId });
        }
      }
    }
    let newsShared = null;
    if (!clueShared) {
      newsShared = VC.shareVisitorWorldNews(W, n, v);
    }
    v.interactions = Array.isArray(v.interactions) ? v.interactions : [];
    v.interactions.push({ day: W.day, t: W.t, npcId: n.id, textTh: n.h.name.given + ' สนทนาแลกเปลี่ยนข่าวสารกับ ' + v.nameTh + (clueShared ? ' (ได้รับเบาะแส「' + clueShared.titleTh + '」)' : (newsShared ? ' (' + newsShared.textTh + ')' : '')) });
    W.world.visitorHistory = Array.isArray(W.world.visitorHistory) ? W.world.visitorHistory : [];
    W.world.visitorHistory.push({ day: W.day, visitorId: v.id, nameTh: v.nameTh, summaryTh: 'สนทนากับ ' + n.h.name.given + (clueShared ? ' · มอบเบาะแส「' + clueShared.titleTh + '」' : ' · แบ่งปันข่าวสารทั่วไป') });
    if (W.world.visitorHistory.length > 80) W.world.visitorHistory.shift();
    return true;
  };

  AI.ACTS.meetVisitor = {
    nameTh: 'พูดคุยแลกเปลี่ยนข่าวสารกับผู้มาเยือน',
    icon: '🎐',
    color: '#7fd1b9',
    can: (n, W) => !!VC.pickVisitorForMember(W, n),
    score(n, W, S) {
      const v = VC.pickVisitorForMember(W, n);
      if (!v) return S.add('ไม่มีผู้มาเยือน', -3);
      S.add('พบปะ' + v.nameTh, 0.72 + (E(n, 'personality.curiosity') - 45) / 160 + (E(n, 'temperament.sociability') - 45) / 180);
      if (v.clueTemplateId && !v.sharedClueThisVisit) S.add('ผู้มาเยือนมีข่าวสารแดนไกล', 0.45);
    },
    where(W, n) {
      const v = VC.pickVisitorForMember(W, n);
      if (!v) return null;
      return { pos: { x: v.x, y: v.y }, visitorId: v.id };
    },
    dur: () => 22,
    done(n, W, ctx) {
      const v = VC.findVisitor(W, ctx && ctx.visitorId) || VC.pickVisitorForMember(W, n);
      if (v) VC.interactWithVisitor(W, n, v);
    },
    cooldown: 180
  };

  // Pick a known, actionable clue for an NPC to investigate (respecting strict knowledge scoping, readiness forecast & retry backoff!)
  VC.pickActionableClueForNpc = (W, n) => {
    if (!W || !n || n.dead || n.away || n.exiled) return null;
    const kc = n.knownClues, sa = W.sect && W.sect.clueArchive;
    if ((!kc || !kc.length) && (!sa || !sa.length)) return null;
    const vcClueMemo = VC._clueMemo || (VC._clueMemo = new WeakMap());
    const cEntry = vcClueMemo.get(n);
    if (cEntry && cEntry.t === W.t) return cEntry.v;
    const cs = VC.ensure(W);
    const candIds = new Set((kc || []).concat(sa || []));
    let best = null, bestScore = -1e9;

    for (const cid of candIds) {
      const inst = cs.active[cid];
      if (!inst || ['claimed', 'disproven', 'abandoned', 'expired'].includes(inst.status)) continue;
      if (inst.reservedByExpedId && inst.reservedUntil > W.t) continue;
      const tpl = VC.TEMPLATE_BY_ID[inst.templateId];
      if (!tpl) continue;
      if (tpl.unique && VC.isTargetAlreadyClaimed(W, tpl)) {
        inst.status = 'claimed';
        continue;
      }

      // Enforce knowledge scoping: NPC only acts on a step they (or the sect archive while at sect) have discovered!
      const view = VC.getNpcKnownClueView(W, n, inst);
      if (!view || !view.currentStep || view.knownNodeIdx < (inst.currentNodeIdx || 0)) continue;
      const step = tpl.steps[inst.currentNodeIdx || 0];
      if (!step) continue;

      // Check readiness forecast and retry backoff (Item 6)
      const fc = VC.forecastNodeReadiness(W, n, inst, step);
      if (!fc.ready) {
        if (n.cognition && fc.recommendedAction && !n.cognition.cluePrep) {
          n.cognition.cluePrep = {
            clueId: inst.instanceId,
            nodeId: step.nodeId,
            skill: step.skill || null,
            statPath: step.statPath || null,
            recommendedAction: fc.recommendedAction,
            until: W.t + 720,
            adviceTh: fc.reasonTh
          };
        }
        continue;
      }

      if (step.stoneCost && (n.inv.stones || 0) < step.stoneCost && (!inst.reportedToSect || W.sect.stones < step.stoneCost + 300)) continue;

      const conf = view.confidence || 55;
      const metric = evalActorNodeMetric(n, step) + (inst.reconBonus || 0);
      const minVal = step.minVal || 35;

      let score = (conf - 35) / 40 + (metric - minVal) / 30;
      if (tpl.rarity === 'Legendary') score += 0.65 + (E(n, 'personality.ambition') - 45) / 140;
      else score += 0.35;
      if (step.locationId === 'sect') score += 0.5;
      if (score > bestScore) {
        bestScore = score;
        best = { inst, tpl, step, score, forecast: fc };
      }
    }
    const out = bestScore > 0.15 ? best : null;
    vcClueMemo.set(n, { t: W.t, v: out });
    return out;
  };

  AI.ACTS.investigateClueLocal = {
    nameTh: 'สืบค้นเบาะแสในสำนัก',
    icon: '🔎',
    color: '#f2c96d',
    can(n, W) {
      const pick = VC.pickActionableClueForNpc(W, n);
      return !!(pick && pick.step && pick.step.locationId === 'sect');
    },
    score(n, W, S) {
      const pick = VC.pickActionableClueForNpc(W, n);
      if (!pick || pick.step.locationId !== 'sect') return S.add('ไม่มีเบาะแสในสำนัก', -3);
      S.add('สืบเบาะแส「' + pick.inst.titleTh + '」', 0.95 + Math.min(0.8, pick.score * 0.4));
    },
    where(W, n) {
      const st = AI.freeStation(W, n, 'read', 'scripture') || AI.freeStation(W, n, 'chat', 'tea_garden');
      return st ? { st } : { pos: { x: n.x, y: n.y } };
    },
    dur: () => 30,
    done(n, W) {
      const pick = VC.pickActionableClueForNpc(W, n);
      if (pick && pick.step.locationId === 'sect') {
        VC.evaluateClueNode(W, pick.inst, [n]);
      }
    },
    cooldown: 180
  };

  EXPED.MISSIONS.clue_investigation = { nameTh: 'ออกสืบเบาะแสและมรดกยุทธภพ', icon: '🗺️' };

  // Companion Invitation Consent Evaluator (Item 4)
  VC.evaluateCompanionConsent = (W, leader, candidate, inst, step, reg) => {
    if (!candidate || candidate.dead || candidate.away || candidate.exiled || candidate.travel || candidate.expId || candidate.sealed || (candidate.jail > W.t)) {
      return { ok: false, reasonCode: 'unavailable', reasonTh: 'ไม่สามารถร่วมเดินทางได้ในขณะนี้' };
    }
    if (AI.isProtectedAction && AI.isProtectedAction(W, candidate, 'expedition')) {
      return { ok: false, reasonCode: 'protected_action', reasonTh: 'กำลังพักผ่อนหรือติดภารกิจสำคัญ' };
    }
    const hpFrac = candidate.h.state.hp / Math.max(1, CULT.hpMax(candidate));
    if (hpFrac < 0.72 || (candidate.inj && candidate.inj.length > 0)) {
      return { ok: false, reasonCode: 'injured', reasonTh: candidate.h.name.given + ' ปฏิเสธเพราะร่างกายบาดเจ็บหรือพลังชีวิตไม่สมบูรณ์' };
    }
    if ((candidate.h.state.energy || 50) < 38 || (candidate.h.state.satiety || 50) < 25) {
      return { ok: false, reasonCode: 'fatigued', reasonTh: candidate.h.name.given + ' ปฏิเสธเพราะอ่อนล้าและต้องการพักผ่อน' };
    }

    // Check critical sect duty urgency
    if (COG && COG.role) {
      const role = COG.role(W, candidate);
      if (role && ['healer', 'provision', 'guard', 'master'].includes(role.id)) {
        const mealLow = role.id === 'provision' && ECO.count(W, 'meal') < 18;
        const hurtMany = role.id === 'healer' && (W.npcs || []).some(x => !x.dead && !x.away && (x.inj && x.inj.length > 0));
        if (mealLow || hurtMany) {
          return { ok: false, reasonCode: 'sect_duty', reasonTh: candidate.h.name.given + ' ปฏิเสธเนื่องจากติดภาระหน้าที่เร่งด่วนในสำนัก (' + role.title + ')' };
        }
      }
    }

    // Check relationship & trust toward leader
    const rel = SECT.rel(candidate, leader.id);
    const acceptProb = (AI && AI.acceptProb) ? AI.acceptProb(W, leader, candidate, 'chat') : 0.5;
    if ((rel.a || 0) < -8 || (rel.t ?? 40) < 26 || acceptProb < 0.25) {
      return { ok: false, reasonCode: 'low_trust', reasonTh: candidate.h.name.given + ' ปฏิเสธคำชวนเนื่องจากความสัมพันธ์หรือความไว้วางใจต่อผู้นำคณะยังไม่เพียงพอ' };
    }

    // Check risk tolerance vs region/guardian danger
    const regDanger = (reg && reg.danger) || 2;
    const cStage = (candidate.cult && candidate.cult.stage) || 1;
    const courage = E(candidate, 'personality.courage');
    const caution = E(candidate, 'personality.caution');
    if (regDanger >= cStage + 2 && courage - caution < 15) {
      return { ok: false, reasonCode: 'too_dangerous', reasonTh: candidate.h.name.given + ' ปฏิเสธเพราะประเมินว่าพื้นที่ปลายทางอันตรายเกินระดับตบะของตน' };
    }

    return { ok: true, acceptProb, reasonTh: candidate.h.name.given + ' ตอบรับคำชวนเข้าร่วมคณะสืบเบาะแส' };
  };

  VC.departClueExpedition = (W, leader, inst, customParty) => {
    const cs = VC.ensure(W);
    if (!leader || leader.dead || leader.away || leader.exiled || leader.travel || leader.expId || leader.sealed || leader.jail > W.t || !inst ||
        (AI.isProtectedAction && AI.isProtectedAction(W, leader, 'expedition'))) return null;
    const tpl = VC.TEMPLATE_BY_ID[inst.templateId];
    if (!tpl) return null;
    const step = tpl.steps[inst.currentNodeIdx || 0];
    if (!step) return null;

    if (step.locationId === 'sect') return null;

    const activeStep = tpl.steps[inst.currentNodeIdx || 0];
    const regId = (activeStep && activeStep.locationId !== 'sect') ? activeStep.locationId : (tpl.regionId || 'mountain');
    const reg = EXPED.REGIONS.find(r => r.id === regId) || EXPED.REGIONS.find(r => r.id === 'mountain') || EXPED.REGIONS[0];

    let party = Array.isArray(customParty) && customParty.length ? customParty.slice() : [leader];
    if (!customParty && party.length < 3) {
      const cands = W.npcs.filter(x => x !== leader && !x.dead && !x.away && !x.exiled && !x.travel && !x.expId && x.rank >= 1 && !x.sealed && !(x.jail > W.t));
      cands.sort((a, b) => evalActorNodeMetric(b, activeStep) - evalActorNodeMetric(a, activeStep));
      for (const c of cands) {
        if (party.length >= 3) break;
        const consent = VC.evaluateCompanionConsent(W, leader, c, inst, activeStep, reg);
        if (consent.ok) {
          party.push(c);
          VC.learnClueFragment(W, c, inst, { fromId: leader.id, rootRumorId: inst.rootRumorId, knownNodeIdx: inst.currentNodeIdx || 0 });
          if (COG && COG.startCommitment) {
            COG.startCommitment(W, c, {
              kind: 'clue_expedition',
              partnerId: leader.id,
              clueId: inst.instanceId,
              region: reg.id,
              duration: 720,
              noteTh: 'ร่วมคณะสืบเบาะแส「' + inst.titleTh + '」กับ ' + leader.h.name.given
            });
          }
        } else {
          inst.partyRefusals = inst.partyRefusals || [];
          inst.partyRefusals.push({ day: W.day, t: W.t, npcId: c.id, nameTh: c.h.name.given, reasonCode: consent.reasonCode, reasonTh: consent.reasonTh });
          if (inst.partyRefusals.length > 12) inst.partyRefusals.shift();
        }
      }

      // If this is a dangerous guardian combat or party_all step and leader is outmatched solo when companions refused, defer safely!
      if (!customParty && party.length === 1 && (activeStep.type === 'guardian_combat' || activeStep.scope === 'party_all')) {
        const soloPower = CULT.power(leader);
        const reqPower = activeStep.guardianPower ? activeStep.guardianPower * 0.75 : 800;
        if (soloPower < reqPower && E(leader, 'personality.courage') < 82) {
          inst.nextRetryDay = W.day + 2;
          inst.lastActionReasonTh = leader.h.name.given + ' ชะลอการออกเดินทางเนื่องจากยังหาสหายร่วมคณะไม่ได้และอันตรายเกินบุกเดี่ยว';
          VC.pushClueHistory(inst, { day: W.day, t: W.t, text: inst.lastActionReasonTh });
          return null;
        }
      }
    }

    if (party[0] !== leader || new Set(party.map(n => n.id)).size !== party.length ||
        party.some(n => W.byId[n.id] !== n || n.dead || n.away || n.exiled || n.travel || n.expId || n.sealed || n.jail > W.t ||
          (AI.isProtectedAction && AI.isProtectedAction(W, n, 'expedition')))) return null;
    const ex = EXPED.depart(W, party, 'clue_investigation', reg);
    if (!ex) return null;
    ex.clueInstanceId = inst.instanceId;
    inst.status = 'in_progress';
    inst.reservedByExpedId = ex.id;
    inst.reservedUntil = ex.ret + 720;
    inst.assignedParty = party.map(p => p.id);
    cs.funnel.investigationsStarted++;
    VC.pushClueHistory(inst, { day: W.day, t: W.t, text: party.map(p => p.h.name.given).join('、') + ' ออกเดินทางสืบเบาะแสไปยัง ' + reg.nameTh });
    return ex;
  };

  // Safe Expedition Resolution & Handover Order (Item 1):
  // Clue nodes are evaluated inside `EXPED.handover` on the surviving `alive` members *after* regional travel encounters.
  // If `alive.length === 0` after travel encounters (or after guardian combat), no reward is granted or orphaned!
  const origResolve = EXPED.resolve;
  EXPED.resolve = function (W, ex, members) {
    const res = origResolve.apply(this, arguments);
    if (ex && ex.clueInstanceId && !ex.clueResolved) {
      // If `origResolve` finished without calling `handover` (because all members died en route: `alive.length === 0`),
      // release the clue reservation cleanly without advancing or claiming the clue!
      ex.clueResolved = true;
      const cs = VC.ensure(W);
      const inst = cs && cs.active[ex.clueInstanceId];
      if (inst) {
        inst.reservedByExpedId = null;
        inst.reservedUntil = 0;
        inst.lastActionReasonTh = 'คณะสำรวจสูญหายหรือเสียชีวิตระหว่างเดินทางก่อนบรรลุเป้าหมาย';
        VC.pushClueHistory(inst, { day: W.day, t: W.t, milestone: true, text: inst.lastActionReasonTh });
      }
    }
    return res;
  };

  const prevHandover = EXPED.handover;
  EXPED.handover = function (W, ex, alive, out) {
    // Filter `alive` in place to ensure only truly living members participate in clue evaluation and loot handover
    if (Array.isArray(alive)) {
      for (let i = alive.length - 1; i >= 0; i--) {
        if (!alive[i] || alive[i].dead) alive.splice(i, 1);
      }
    }
    if (!alive || !alive.length) {
      if (ex && ex.clueInstanceId) {
        const cs = VC.ensure(W);
        const inst = cs && cs.active[ex.clueInstanceId];
        if (inst) {
          inst.reservedByExpedId = null;
          inst.reservedUntil = 0;
        }
      }
      return null;
    }

    if (ex && !ex.clueResolved && ex.clueInstanceId) {
      ex.clueResolved = true;
      const cs = VC.ensure(W);
      const inst = cs && cs.active[ex.clueInstanceId];
      if (inst) {
        ex.clueOut = { mats: {}, pills: {}, gear: [], techs: [], notes: [] };
        for (let stepIter = 0; stepIter < 2; stepIter++) {
          if (!alive.length || inst.status === 'claimed' || inst.status === 'disproven' || inst.status === 'abandoned') break;
          const tpl = VC.TEMPLATE_BY_ID[inst.templateId];
          const curStep = tpl && tpl.steps[inst.currentNodeIdx || 0];
          if (!curStep || curStep.locationId === 'sect' || curStep.locationId !== ex.region) break;
          const stepRes = VC.evaluateClueNode(W, inst, alive, { viaExpedition: true, expedOut: ex.clueOut });
          if (ex.journal) ex.journal.push(inst.lastActionReasonTh);
          if (!stepRes.ok || stepRes.retreated || !alive.length || inst.status === 'claimed' || inst.status === 'disproven') break;
        }
        inst.reservedByExpedId = null;
        inst.reservedUntil = 0;
      }
    }

    // If guardian combat wiped out the remaining party, abort handover and do not settle orphaned loot!
    if (!alive.length) {
      if (ex) ex.clueOut = null;
      return null;
    }

    // Merge any `ex.clueOut` items into `out` before handover runs once
    if (ex && ex.clueOut && !ex.clueOutMerged) {
      ex.clueOutMerged = true;
      const co = ex.clueOut;
      Object.entries(co.mats || {}).forEach(([k, v]) => { out.mats[k] = (out.mats[k] || 0) + v; });
      Object.entries(co.pills || {}).forEach(([k, v]) => { out.pills[k] = (out.pills[k] || 0) + v; });
      (co.gear || []).forEach(g2 => out.gear.push(g2));
      (co.techs || []).forEach(t2 => { if (!out.techs.includes(t2)) out.techs.push(t2); });
    }
    const res = prevHandover.apply(this, arguments);
    if (alive && alive.length && W.sect && Array.isArray(W.sect.gear)) {
      for (let i = W.sect.gear.length - 1; i >= 0; i--) {
        const g2 = W.sect.gear[i];
        if (g2 && g2.intendedRecipientId && VC.LEGENDARY_WEAPON_BY_ID[g2.id]) {
          const recNpc = alive.find(m => m.id === g2.intendedRecipientId) || alive[0];
          if (recNpc && !recNpc.dead) {
            W.sect.gear.splice(i, 1);
            recNpc.inv.gear = Array.isArray(recNpc.inv.gear) ? recNpc.inv.gear : [];
            recNpc.inv.gear.push(g2);
            W.world.uniqueArtifacts[g2.id] = {
              itemId: g2.id,
              uid: g2.uid,
              ownerKind: 'npc_bag',
              ownerId: recNpc.id,
              ownerNameTh: HC.fullName(recNpc),
              updatedDay: W.day
            };
            const evalRes = M.classifyGearForNpc ? M.classifyGearForNpc(W, recNpc, g2, 0) : null;
            if (evalRes && evalRes.category === 'useful-now' && SECT.EDITOR && SECT.EDITOR.equipPersonalGear) {
              SECT.EDITOR.equipPersonalGear(W, recNpc.id, g2.uid);
              W.world.uniqueArtifacts[g2.id].ownerKind = 'npc_equipped';
              if (W.world.clues && W.world.clues.funnel) W.world.clues.funnel.equippedOrLearned++;
            }
          }
        }
      }
    }
    VC.syncUniqueArtifacts(W);
    return res;
  };

  /* ---------- Hook Gear Ownership Transitions Across SECT, CPE & COG (Item 7) ---------- */
  if (SECT && SECT.EDITOR) {
    ['equipFromSect', 'equipPersonalGear', 'unequipGear', 'donatePersonalGear', 'removeNpcGear', 'grantItem'].forEach(fn => {
      const origFn = SECT.EDITOR[fn];
      if (typeof origFn === 'function') {
        SECT.EDITOR[fn] = function (W) {
          const r = origFn.apply(this, arguments);
          if (W && W.world) VC.syncUniqueArtifacts(W);
          return r;
        };
      }
    });
  }
  if (SECT && typeof SECT.distributeSectStock === 'function') {
    const origDist = SECT.distributeSectStock;
    SECT.distributeSectStock = function (W) {
      const r = origDist.apply(this, arguments);
      if (W && W.world) VC.syncUniqueArtifacts(W);
      return r;
    };
  }
  if (g.CPE && typeof g.CPE.buy === 'function') {
    const origBuy = g.CPE.buy;
    g.CPE.buy = function (W) {
      const r = origBuy.apply(this, arguments);
      if (W && W.world) VC.syncUniqueArtifacts(W);
      return r;
    };
  }
  if (COG && typeof COG.giveGearGift === 'function') {
    const origGift = COG.giveGearGift;
    COG.giveGearGift = function (W) {
      const r = origGift.apply(this, arguments);
      if (W && W.world) VC.syncUniqueArtifacts(W);
      return r;
    };
  }

  /* ---------- Combat Balance Benchmark for All 11 Legendary Weapons vs Same-Tier Craftables (Item 8) ---------- */
  VC.benchmarkWeaponBalance = () => {
    const W = g.SIM.create('vc-wpn-balance-bench');
    const a = W.npcs[0], b = W.npcs[1];
    [a, b].forEach(n => {
      if (!n.cult) g.SIM.awaken(W, W.rng, n, 5);
      else n.cult.stage = 5;
      g.SECT.EDITOR.applyCharacterEdit(W, n.id, {
        physiology: { strength: 75, agility: 70, reflex: 70, endurance: 72, vitality: 72 },
        intellect: { perceptiveness: 72, comprehension: 72, focus: 72, willpower: 72 },
        personality: { courage: 72, composure: 70 }
      });
      ['SWORD', 'BLADE', 'SPEAR', 'STAFF', 'FIST_PALM', 'BOW', 'ARRAY', 'SOUL_DIVINE'].forEach(sk => { n.h.skills[sk] = 75; });
      n.martialSkills = { BOW: 75, STAFF: 75, FOCUS: 75 };
      g.HC.touch(n);
    });

    const craftBaselineByType = {
      SWORD: 'MP_SWORD_5',
      BLADE: 'MP_BLADE_5',
      SPEAR: 'MP_SPEAR_5',
      STAFF: 'MP_SPEAR_5',
      FIST: 'MP_GAUNTLET_5',
      BOW: 'MP_SWORD_5',
      FOCUS: 'MP_RING_5'
    };

    const results = [];
    for (const wDef of LEGENDARY_WEAPONS) {
      const legItem = VC.mintLegendaryWeapon(W, wDef.id, 'bench');
      const baseId = craftBaselineByType[wDef.gearType] || 'MP_SWORD_5';
      const baseDef = ECO.itemById[baseId] || ECO.itemById.MP_SWORD_5;
      const craftItem = ECO.mintGear(baseDef, 1.15);
      craftItem.slot = 'WEAPON';
      craftItem.gearType = wDef.gearType;

      a.equip = { WEAPON: legItem };
      b.equip = { WEAPON: craftItem };
      g.STATS.dirty(a);
      g.STATS.dirty(b);

      const powerLeg = Math.round(CULT.power(a));
      const powerCraft = Math.round(CULT.power(b));
      let legWins = 0;
      let totalProcs = 0;
      const trials = 12;

      for (let t = 0; t < trials; t++) {
        a.h.state.hp = CULT.hpMax(a);
        b.h.state.hp = CULT.hpMax(b);
        a.h.state.qi = CULT.qiMax(a);
        b.h.state.qi = CULT.qiMax(b);
        a.wpnProcCds = {};
        b.wpnProcCds = {};
        a.sx = [];
        b.sx = [];
        const f = { id: 'bench_' + t, kind: 'spar', serious: false, A: [a.id], B: [b.id] };
        for (let r = 0; r < 14 && a.h.state.hp > 20 && b.h.state.hp > 20; r++) {
          W.t += 3;
          const sA = COMBAT.strike(W, f, a, b, { isSkill: r % 2 === 0 });
          if (a.lastWeaponProc && a.lastWeaponProc.t === W.t) totalProcs++;
          if (b.h.state.hp <= 20) break;
          const sB = COMBAT.strike(W, f, b, a, { isSkill: r % 2 === 0 });
          if (a.lastWeaponProc && a.lastWeaponProc.t === W.t) totalProcs++;
        }
        if (a.h.state.hp >= b.h.state.hp) legWins++;
      }

      results.push({
        id: wDef.id,
        nameTh: wDef.nameTh,
        gearType: wDef.gearType,
        tier: wDef.tier,
        powerWithLegendary: powerLeg,
        powerWithCraftable: powerCraft,
        powerRatio: Math.round((powerLeg / Math.max(1, powerCraft)) * 100) / 100,
        winRateVsCraftable: Math.round((legWins / trials) * 100) / 100,
        procsTriggered: totalProcs
      });
    }
    return results;
  };

  /* ---------- Daily & Tick Lifecycle for Visitors & Clue Investigations ---------- */
  VC.tick = W => {
    if (!W || !W.world || !Array.isArray(W.world.visitors)) return;
    if (W.t % 4 !== 0) return;
    for (const v of W.world.visitors) {
      if (!v || !['admitted', 'restricted'].includes(v.state)) continue;
      if (v.untilDay < W.day) continue;
      if (Number.isFinite(v.destX) && Number.isFinite(v.destY)) {
        const dx = v.destX - v.x, dy = v.destY - v.y, d = Math.hypot(dx, dy);
        v.px = v.x; v.py = v.y;
        if (d > 0.35) {
          const step = Math.min(d, 0.28);
          const nx = v.x + (dx / d) * step, ny = v.y + (dy / d) * step;
          if (!MAP.blocked(W.map, nx, ny)) {
            v.x = nx; v.y = ny;
          } else {
            v.destX = v.x; v.destY = v.y;
          }
          v.face = dx >= 0 ? 1 : -1;
        } else if (W.t % 120 === 0 && W.rng.chance(0.35)) {
          const bkey = VC.canVisitorAccessBuilding(v, v.targetBkey) ? v.targetBkey : 'plaza';
          const b = (W.map.byId && W.map.byId[bkey]) || W.map.byId.plaza;
          if (b) {
            v.destX = b.x + 1 + W.rng.next() * Math.max(1, b.w - 2);
            v.destY = b.y + 1 + W.rng.next() * Math.max(1, b.h - 2);
          }
        }
      }
    }
  };

  VC.daily = W => {
    const cs = VC.ensure(W);
    if (!cs) return;

    // 1. Depart expired guests cleanly
    for (let i = W.world.visitors.length - 1; i >= 0; i--) {
      const v = W.world.visitors[i];
      if (!v || v.untilDay < W.day || v.state === 'rejected' || v.state === 'offsite') {
        if (v && v.state !== 'rejected' && v.state !== 'offsite') {
          VC.departVisitor(W, v, 'ครบกำหนดเวลาพำนัก');
        }
        W.world.visitors.splice(i, 1);
      }
    }

    // 2. Expire time-limited ordinary clues if past expiresDay & release expired expedition reservations
    for (const inst of Object.values(cs.active)) {
      if (!inst) continue;
      if (inst.reservedByExpedId && inst.reservedUntil && W.t > inst.reservedUntil) {
        inst.reservedByExpedId = null;
        inst.reservedUntil = 0;
      }
      if (inst.expiresDay != null && W.day > inst.expiresDay && ['active', 'in_progress'].includes(inst.status)) {
        inst.status = 'expired';
        inst.lastActionReasonTh = 'แหล่งทรัพยากรตามข่าวลือพ้นฤดูกาลไปแล้ว';
      }
    }

    // Retain a bounded detail history without deleting live expedition references or durable claim receipts.
    const inFlight = new Set((W.world.expeds || []).filter(e => !e.done).map(e => e.clueInstanceId));
    const terminal = Object.values(cs.active).filter(c => c && !['active', 'in_progress'].includes(c.status) && !inFlight.has(c.instanceId))
      .sort((a, b) => b.createdAt - a.createdAt);
    for (const old of terminal.slice(VC.MAX_CLUE_HISTORY)) delete cs.active[old.instanceId];
    for (const n of W.npcs) n.knownClues = (n.knownClues || []).filter(id => !!cs.active[id]);
    W.sect.clueArchive = (W.sect.clueArchive || []).filter(id => !!cs.active[id]);

    // 3. Spawn new non-merchant outsider visits (bounded by MAX_ACTIVE_GUESTS and road state)
    if (!W.threat || W.threat.roadBlocked <= 0) {
      const activeGuests = VC.activeGuests(W);
      if (activeGuests.length < VC.MAX_ACTIVE_GUESTS) {
        const openness = (W.sect.policy && W.sect.policy.openness) || 50;
        const fame = (W.sect && W.sect.fame) || 12;
        const spawnProb = clamp(0.18 + fame / 900 + openness / 800, 0.12, 0.45);
        if (W.rng.chance(spawnProb)) {
          VC.spawnGuest(W);
        }
      }
    }

    // 4. Staggered daily clue investigation launch (at most 1 clue expedition launched per day when meals & members are ready)
    const activeClueExpeds = (W.world.expeds || []).filter(e => e && !e.done && e.kind === 'clue_investigation');
    if (activeClueExpeds.length < 2 && ECO.count(W, 'meal') >= 12 && (!W.threat || !W.threat.raid)) {
      const candidates = W.npcs.filter(n => !n.dead && !n.away && !n.exiled && !n.travel && !n.expId && n.rank >= 1 && (n.h.state.hp / CULT.hpMax(n)) >= 0.75);
      for (const n of candidates) {
        const pick = VC.pickActionableClueForNpc(W, n);
        if (!pick) continue;
        if (pick.step.locationId === 'sect') {
          continue;
        } else if (W.rng.chance(0.45)) {
          VC.departClueExpedition(W, n, pick.inst);
          break;
        }
      }
    }
    VC.syncUniqueArtifacts(W);
  };

  const origSimCreate = g.SIM && g.SIM.create;
  if (origSimCreate) {
    g.SIM.create = function (seed, opts) {
      const W = origSimCreate.call(this, seed, opts);
      VC.ensure(W);
      return W;
    };
  }
  const origSimTick = g.SIM && g.SIM.tick;
  if (origSimTick) {
    g.SIM.tick = function (W) {
      origSimTick.call(this, W);
      VC.tick(W);
    };
  }
  const origContentDaily = g.CONTENT && g.CONTENT.daily;
  if (origContentDaily) {
    g.CONTENT.daily = function (W) {
      origContentDaily.call(this, W);
      VC.daily(W);
    };
  }
  const origDeserialize = g.SIM && g.SIM.deserialize;
  if (origDeserialize) {
    g.SIM.deserialize = function (str) {
      const W = origDeserialize.call(this, str);
      VC.ensure(W, true);
      return W;
    };
  }

  /* ---------- Catalog & Graph Validator (for Automated Verification) ---------- */
  VC.validateCatalog = () => {
    const errors = [];
    const seenWpn = new Set();
    for (const w of LEGENDARY_WEAPONS) {
      if (!w.id || seenWpn.has(w.id)) errors.push('duplicate or missing weapon id: ' + w.id);
      seenWpn.add(w.id);
      if (!M.TYPES[w.gearType]) errors.push('invalid weapon gearType: ' + w.id + ' -> ' + w.gearType);
      if (!w.visualKey) errors.push('missing visualKey on weapon: ' + w.id);
      if (!Array.isArray(w.effects) || !w.effects.length) errors.push('missing effects on weapon: ' + w.id);
    }

    const seenTpl = new Set();
    const validNodeTypes = new Set(['search_site', 'speak_contact', 'inspect_inscription', 'skill_trial', 'body_trial', 'spirit_judgment', 'guardian_combat']);
    for (const t of CLUE_TEMPLATES) {
      if (!t.templateId || seenTpl.has(t.templateId)) errors.push('duplicate templateId: ' + t.templateId);
      seenTpl.add(t.templateId);
      if (t.targetKind === 'MATERIAL' && !ECO.matById[t.targetId]) errors.push('missing material target: ' + t.targetId);
      if (t.targetKind === 'EQUIPMENT' && !ECO.itemById[t.targetId]) errors.push('missing equipment target: ' + t.targetId);
      if (t.targetKind === 'TECH_MANUAL') {
        const tech = CULT.tech(t.targetId);
        if (!tech) errors.push('missing tech target: ' + t.targetId);
        if (tech && M.isInnateTech && M.isInnateTech(tech)) errors.push('innate-only tech cannot be clue target: ' + t.targetId);
      }
      if (!Array.isArray(t.steps) || !t.steps.length) errors.push('empty steps in template: ' + t.templateId);
      const stepIds = new Set(t.steps.map(s => s.nodeId));
      t.steps.forEach((s, idx) => {
        if (!validNodeTypes.has(s.type)) errors.push('invalid node type ' + s.type + ' in ' + t.templateId);
        if (s.onPass && s.onPass !== 'REWARD' && !stepIds.has(s.onPass)) errors.push('broken onPass edge ' + s.onPass + ' in ' + t.templateId);
        // Ensure no self-deadlock where a step requires the exact reward it unlocks
        if (s.requiredItemId && s.requiredItemId === t.targetId) errors.push('self-deadlock in ' + t.templateId);
      });
    }
    return errors;
  };

  g.VC = VC;
  if (typeof module === 'object' && module.exports) module.exports = VC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
