/* cultivation.js — วิถีบำเพ็ญ (5 วิถีหลัก: XIAN/BODY/GOD/DEMON/HEART_SOUL) + ระบบรากวิญญาณและธาตุกลาง (ELEM v2.0.1)
 * ใช้ค่ามนุษย์จาก HC เท่านั้น (ไม่แก้ js/human_core.js; ล็อก HC.FINGERPRINT === '155:2f9c9dd7')
 * npc.cult = null (ปุถุชน) หรือ {path, sub, stage, prog, mantra, techs[], learning, toxic, dev(จิตมาร)...}
 * ข้อมูลความชำนาญธาตุเก็บใน npc.ext.elementalSystem และโครงสร้างรากวิญญาณเก็บใน npc.h.root */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js'), HC = g.HC, JD = g.JD;
  const clamp = U.clamp;

  /* =========================================================================
   * 0) ระบบธาตุและรากวิญญาณกลาง (ELEM / ELEMENTAL AUTHORITY v2.0)
   * ========================================================================= */
  const ELEM = {
    VERSION: '2.0.1',
    // Character generation throughput is measured from deterministic 90/180-day
    // world simulations (14 runs: 326–436 appearances/year; pooled mean 386.43).
    // The configured 390/year is a rounded calibration, not a biological birth rate.
    GENERATED_CHARACTERS_PER_WORLD_YEAR: 390,
    ROOT_COUNT_PROBABILITIES: Object.freeze({
      1: 0.9789997435897436,
      2: 0.02,
      3: 0.001,
      4: 0.0000002564102564102564
    }),
    // Conditional grade-cohort probabilities are calibrated independently for each
    // root count. Root-count frequency × conditional cohort frequency determines
    // the world-scale interval displayed to the player.
    ROOT_GRADE_PROBABILITIES: Object.freeze({
      1: Object.freeze({
        HEAVENLY: 0.0005238208857339738,
        TRUE: 0.003688879476999816,
        SPIRIT: 0.0124719258508089,
        MORTAL: 0.5,
        DEFECTIVE: 0.4833153737864573
      }),
      2: Object.freeze({
        HEAVENLY_PAIR: 0.001282051282051282,
        HEAVENLY_TRUE_OR_SPIRIT: 0.02564102564102564,
        TRUE_PAIR: 0.020512820512820513,
        HEAVENLY_WITH_MORTAL_OR_DEFECTIVE: 0.007690769538400011,
        COMMON: 0.9448733330257025
      }),
      3: Object.freeze({
        HEAVENLY_TRIPLE: 0.002564102564102564,
        TWO_HEAVENLY_ONE_TRUE_OR_SPIRIT: 0.005128205128205128,
        ONE_HEAVENLY_TWO_TRUE_OR_SPIRIT: 0.02564102564102564,
        TRUE_TRIPLE: 0.041025641025641026,
        OTHER_HEAVENLY: 0.1282051282051282,
        COMMON: 0.7974358974358975
      }),
      4: Object.freeze({ ALL_HEAVENLY: 0.005, OTHER: 0.995 })
    }),
    ORDINARY_ELEMENTS: Object.freeze([
      'FIRE', 'WATER_ICE', 'LIGHTNING', 'WIND',
      'EARTH_METAL', 'WOOD_LIFE', 'YIN_SHADOW', 'LIGHT_YANG'
    ]),
    SPECIAL_ELEMENTS: Object.freeze(['ASTRAL', 'BLOOD_DEMON']),
    ALL_ELEMENTS: Object.freeze([
      'FIRE', 'WATER_ICE', 'LIGHTNING', 'WIND',
      'EARTH_METAL', 'WOOD_LIFE', 'YIN_SHADOW', 'LIGHT_YANG',
      'ASTRAL', 'BLOOD_DEMON'
    ]),
    VALID_MODES: Object.freeze([
      'INTRINSIC_SINGLE',
      'INTRINSIC_WEIGHTED',
      'SPECIAL_ELEMENT',
      'EXPLICIT_NON_ELEMENTAL',
      'ELEMENT_LINK_ONLY',
      'ROOT_AGNOSTIC_UTILITY'
    ]),
    AFFINITY_GROUPS: Object.freeze({
      ELEMENTAL: Object.freeze([
        'FIRE', 'WATER_ICE', 'LIGHTNING', 'WIND',
        'EARTH_METAL', 'WOOD_LIFE', 'YIN_SHADOW', 'LIGHT_YANG'
      ]),
      NON_ELEMENTAL: Object.freeze([
        'SWORD', 'BLADE', 'SPEAR', 'FIST_PALM', 'MOVEMENT', 'BODY_REFINING', 'SOUL_DIVINE',
        'ALCHEMY', 'FORGING', 'ARRAY', 'TALISMAN', 'BEAST_TAMING', 'MEDICINE', 'POISON', 'SCRIPTURE'
      ])
    }),
    META: Object.freeze({
      FIRE: { id: 'FIRE', nameTh: 'ธาตุไฟ', shortTh: 'ไฟ', icon: '🔥', color: '#ff6b4a', kind: 'ORDINARY', descTh: 'เปลวเพลิง สุริยัน เตาหลอม และการเผาผลาญรุนแรง' },
      WATER_ICE: { id: 'WATER_ICE', nameTh: 'ธาตุน้ำ-น้ำแข็ง', shortTh: 'น้ำ/น้ำแข็ง', icon: '❄️', color: '#4fb2f2', kind: 'ORDINARY', descTh: 'สายน้ำ เหมันต์ หิมะ ความเยือกเย็น และการไหลเวียนฟื้นฟู' },
      LIGHTNING: { id: 'LIGHTNING', nameTh: 'ธาตุสายฟ้า', shortTh: 'สายฟ้า', icon: '⚡', color: '#ffd43b', kind: 'ORDINARY', descTh: 'อสนี ฟ้าทัณฑ์ ความเร็วฉับพลัน และการทำลายเกราะป้องกัน' },
      WIND: { id: 'WIND', nameTh: 'ธาตุลม', shortTh: 'ลม', icon: '🌪️', color: '#6ddfb5', kind: 'ORDINARY', descTh: 'สายลม พายุ เมฆา คลื่นเสียง และความพริ้วไหวไร้ร่องรอย' },
      EARTH_METAL: { id: 'EARTH_METAL', nameTh: 'ธาตุดิน-โลหะ', shortTh: 'ดิน/โลหะ', icon: '⛰️', color: '#d9a97c', kind: 'ORDINARY', descTh: 'ขุนเขา ศิลา เหล็กไหล ทองคำ คมศาสตรา และปราการตั้งรับ' },
      WOOD_LIFE: { id: 'WOOD_LIFE', nameTh: 'ธาตุไม้-ชีวิต', shortTh: 'ไม้/ชีวิต', icon: '🌿', color: '#51cf66', kind: 'ORDINARY', descTh: 'พฤกษา พลังชีวิต โอสถ สมุนไพร การเยียวยา และพิษชีวภาพ' },
      YIN_SHADOW: { id: 'YIN_SHADOW', nameTh: 'ธาตุหยิน-เงา', shortTh: 'หยิน/เงา', icon: '🌑', color: '#b197fc', kind: 'ORDINARY', descTh: 'เงามืด จันทรา มายา วิญญาณ ยมโลก และการลอบเร้น' },
      LIGHT_YANG: { id: 'LIGHT_YANG', nameTh: 'ธาตุแสง-หยาง', shortTh: 'แสง/หยาง', icon: '☀️', color: '#fcc419', kind: 'ORDINARY', descTh: 'แสงศักดิ์สิทธิ์ ปราณหยางบริสุทธิ์ เซน เมตตา และการชำระล้างมาร' },
      ASTRAL: { id: 'ASTRAL', nameTh: 'ดารา-มิติ (ธาตุพิเศษ)', shortTh: 'ดารา/มิติ', icon: '✨', color: '#74c0fc', kind: 'SPECIAL', descTh: 'พลังดวงดาว สุญญากาศ มิติ และชะตาฟ้าดิน (ธาตุพิเศษ ไม่เกิดเป็นรากวิญญาณสามัญ)' },
      BLOOD_DEMON: { id: 'BLOOD_DEMON', nameTh: 'โลหิต-มาร (ธาตุพิเศษ)', shortTh: 'โลหิต/มาร', icon: '🩸', color: '#ff4d6d', kind: 'SPECIAL', descTh: 'ปราณโลหิต อาคมมาร และการสูบกลืนตบะ (ธาตุพิเศษ ไม่เกิดเป็นรากวิญญาณสามัญ)' },
      NEUTRAL: { id: 'NEUTRAL', nameTh: 'ไร้ธาตุเฉพาะ', shortTh: 'ไร้ธาตุ', icon: '⚪', color: '#9fb0c2', kind: 'NEUTRAL', descTh: 'กระบวนท่าและอุปกรณ์พื้นฐานที่ไม่พึ่งพาปราณธาตุเฉพาะทาง' }
    }),
    ALIAS_MAP: Object.freeze({
      WATER: 'WATER_ICE',
      ICE: 'WATER_ICE',
      WOOD: 'WOOD_LIFE',
      METAL: 'EARTH_METAL',
      EARTH: 'EARTH_METAL',
      GOLD: 'EARTH_METAL',
      YIN: 'YIN_SHADOW',
      YANG: 'LIGHT_YANG',
      LIGHT: 'LIGHT_YANG',
      BLOOD: 'BLOOD_DEMON',
      ไฟ: 'FIRE',
      น้ำ: 'WATER_ICE',
      น้ำแข็ง: 'WATER_ICE',
      สายฟ้า: 'LIGHTNING',
      ลม: 'WIND',
      ดิน: 'EARTH_METAL',
      ทอง: 'EARTH_METAL',
      โลหะ: 'EARTH_METAL',
      ไม้: 'WOOD_LIFE',
      หยิน: 'YIN_SHADOW',
      เงา: 'YIN_SHADOW',
      หยาง: 'LIGHT_YANG',
      แสง: 'LIGHT_YANG',
      ดารา: 'ASTRAL',
      โลหิต: 'BLOOD_DEMON'
    }),
    COMPOSITE_PROFILES: Object.freeze({
      FIVE_ELEMENTS: Object.freeze({
        mode: 'INTRINSIC_WEIGHTED',
        primary: 'WOOD_LIFE',
        compositeTag: 'FIVE_ELEMENTS',
        weights: Object.freeze({ WOOD_LIFE: 0.2, FIRE: 0.2, EARTH_METAL: 0.2, WATER_ICE: 0.2, WIND: 0.2 })
      }),
      CHAOS: Object.freeze({
        mode: 'INTRINSIC_WEIGHTED',
        primary: 'ASTRAL',
        compositeTag: 'CHAOS',
        weights: Object.freeze({ ASTRAL: 0.36, LIGHT_YANG: 0.16, YIN_SHADOW: 0.16, FIRE: 0.08, WATER_ICE: 0.08, LIGHTNING: 0.08, EARTH_METAL: 0.08 })
      }),
      YIN_YANG: Object.freeze({
        mode: 'INTRINSIC_WEIGHTED',
        primary: 'LIGHT_YANG',
        compositeTag: 'YIN_YANG',
        weights: Object.freeze({ LIGHT_YANG: 0.5, YIN_SHADOW: 0.5 })
      })
    }),
    GRADE_ORDER: Object.freeze(['DEFECTIVE', 'MORTAL', 'SPIRIT', 'TRUE', 'HEAVENLY']),
    GRADE_SCORE: Object.freeze({
      DEFECTIVE: 1.0,
      MORTAL: 2.0,
      SPIRIT: 3.0,
      TRUE: 4.0,
      HEAVENLY: 5.0
    }),
    GRADE_FACTORS: Object.freeze({
      DEFECTIVE: Object.freeze({ score: 1.0, combat: 0.72, cult: 0.65, study: 0.75, bt: -0.06, nameTh: 'รากวิญญาณบกพร่อง', shortTh: 'บกพร่อง', color: '#8a96a8' }),
      MORTAL:    Object.freeze({ score: 2.0, combat: 0.88, cult: 0.85, study: 0.90, bt:  0.00, nameTh: 'รากวิญญาณสามัญ', shortTh: 'สามัญ', color: '#9fb0c2' }),
      SPIRIT:    Object.freeze({ score: 3.0, combat: 1.00, cult: 1.05, study: 1.05, bt:  0.04, nameTh: 'รากวิญญาณชั้นจิต', shortTh: 'จิต', color: '#6ddfb5' }),
      TRUE:      Object.freeze({ score: 4.0, combat: 1.12, cult: 1.25, study: 1.18, bt:  0.08, nameTh: 'รากวิญญาณแท้จริง', shortTh: 'แท้จริง', color: '#4fb2f2' }),
      HEAVENLY:  Object.freeze({ score: 5.0, combat: 1.24, cult: 1.48, study: 1.32, bt:  0.14, nameTh: 'รากวิญญาณสวรรค์', shortTh: 'สวรรค์', color: '#f0cf4a' })
    }),
    ROOT_CAPACITY_TRAITS: Object.freeze({
      1: 'ROOT_CAPACITY_SINGLE',
      2: 'TR_ROOT_CAPACITY_DUAL',
      3: 'TR_ROOT_CAPACITY_TRIPLE',
      4: 'TR_ROOT_CAPACITY_FOURFOLD'
    }),
    TRAIT_TO_ROOT_COUNT: Object.freeze({
      ROOT_CAPACITY_SINGLE: 1,
      TR_ROOT_CAPACITY_DUAL: 2,
      TR_ROOT_CAPACITY_TRIPLE: 3,
      TR_ROOT_CAPACITY_FOURFOLD: 4
    }),
    // 1) Combat & Cultivation Efficacy Matrix (K[charEl][targetEl])
    EFFICACY_MATRIX: Object.freeze({
      FIRE:        Object.freeze({ FIRE: 1.00, WOOD_LIFE: 0.76, EARTH_METAL: 0.74, LIGHT_YANG: 0.78, WIND: 0.74, LIGHTNING: 0.68, YIN_SHADOW: 0.34, WATER_ICE: 0.22, ASTRAL: 0.36, BLOOD_DEMON: 0.44 }),
      WATER_ICE:   Object.freeze({ WATER_ICE: 1.00, WOOD_LIFE: 0.75, YIN_SHADOW: 0.76, WIND: 0.70, EARTH_METAL: 0.68, LIGHTNING: 0.64, LIGHT_YANG: 0.38, FIRE: 0.22, ASTRAL: 0.38, BLOOD_DEMON: 0.36 }),
      LIGHTNING:   Object.freeze({ LIGHTNING: 1.00, WIND: 0.78, LIGHT_YANG: 0.74, FIRE: 0.68, WATER_ICE: 0.64, EARTH_METAL: 0.64, WOOD_LIFE: 0.42, YIN_SHADOW: 0.35, ASTRAL: 0.42, BLOOD_DEMON: 0.32 }),
      WIND:        Object.freeze({ WIND: 1.00, LIGHTNING: 0.78, FIRE: 0.74, WATER_ICE: 0.70, YIN_SHADOW: 0.68, LIGHT_YANG: 0.66, WOOD_LIFE: 0.62, EARTH_METAL: 0.38, ASTRAL: 0.42, BLOOD_DEMON: 0.34 }),
      EARTH_METAL: Object.freeze({ EARTH_METAL: 1.00, FIRE: 0.74, WATER_ICE: 0.68, LIGHTNING: 0.64, LIGHT_YANG: 0.58, YIN_SHADOW: 0.52, WOOD_LIFE: 0.42, WIND: 0.38, ASTRAL: 0.38, BLOOD_DEMON: 0.35 }),
      WOOD_LIFE:   Object.freeze({ WOOD_LIFE: 1.00, FIRE: 0.76, WATER_ICE: 0.75, LIGHT_YANG: 0.72, WIND: 0.62, YIN_SHADOW: 0.54, EARTH_METAL: 0.42, LIGHTNING: 0.42, ASTRAL: 0.35, BLOOD_DEMON: 0.38 }),
      YIN_SHADOW:  Object.freeze({ YIN_SHADOW: 1.00, WATER_ICE: 0.76, WIND: 0.68, WOOD_LIFE: 0.54, EARTH_METAL: 0.52, FIRE: 0.34, LIGHTNING: 0.35, LIGHT_YANG: 0.24, ASTRAL: 0.38, BLOOD_DEMON: 0.46 }),
      LIGHT_YANG:  Object.freeze({ LIGHT_YANG: 1.00, FIRE: 0.78, LIGHTNING: 0.74, WOOD_LIFE: 0.72, WIND: 0.66, EARTH_METAL: 0.58, WATER_ICE: 0.38, YIN_SHADOW: 0.24, ASTRAL: 0.45, BLOOD_DEMON: 0.20 }),
      ASTRAL:      Object.freeze({ ASTRAL: 1.00, LIGHT_YANG: 0.68, WIND: 0.64, WATER_ICE: 0.58, YIN_SHADOW: 0.58, LIGHTNING: 0.58, EARTH_METAL: 0.52, FIRE: 0.50, WOOD_LIFE: 0.48, BLOOD_DEMON: 0.35 }),
      BLOOD_DEMON: Object.freeze({ BLOOD_DEMON: 1.00, YIN_SHADOW: 0.72, FIRE: 0.68, WOOD_LIFE: 0.58, EARTH_METAL: 0.55, WATER_ICE: 0.48, WIND: 0.45, LIGHTNING: 0.42, ASTRAL: 0.35, LIGHT_YANG: 0.20 })
    }),
    // 2) Directed Learning / Comprehension Transfer Graph (L[fromEl][toEl]) — never used directly as raw combat multiplier
    LEARNING_GRAPH: Object.freeze({
      FIRE:        Object.freeze({ FIRE: 1.00, LIGHT_YANG: 0.52, EARTH_METAL: 0.44, LIGHTNING: 0.40, WOOD_LIFE: 0.36, WIND: 0.34, BLOOD_DEMON: 0.32, ASTRAL: 0.22, YIN_SHADOW: 0.12, WATER_ICE: 0.08 }),
      WATER_ICE:   Object.freeze({ WATER_ICE: 1.00, YIN_SHADOW: 0.52, WOOD_LIFE: 0.48, WIND: 0.42, LIGHTNING: 0.32, EARTH_METAL: 0.30, ASTRAL: 0.28, LIGHT_YANG: 0.15, BLOOD_DEMON: 0.22, FIRE: 0.08 }),
      LIGHTNING:   Object.freeze({ LIGHTNING: 1.00, WIND: 0.50, LIGHT_YANG: 0.46, FIRE: 0.40, EARTH_METAL: 0.36, WATER_ICE: 0.30, ASTRAL: 0.34, WOOD_LIFE: 0.20, YIN_SHADOW: 0.16, BLOOD_DEMON: 0.18 }),
      WIND:        Object.freeze({ WIND: 1.00, LIGHTNING: 0.50, WATER_ICE: 0.42, YIN_SHADOW: 0.40, FIRE: 0.38, LIGHT_YANG: 0.36, WOOD_LIFE: 0.34, ASTRAL: 0.38, EARTH_METAL: 0.20, BLOOD_DEMON: 0.20 }),
      EARTH_METAL: Object.freeze({ EARTH_METAL: 1.00, FIRE: 0.44, WATER_ICE: 0.38, LIGHTNING: 0.36, LIGHT_YANG: 0.32, WOOD_LIFE: 0.26, YIN_SHADOW: 0.26, ASTRAL: 0.28, WIND: 0.18, BLOOD_DEMON: 0.22 }),
      WOOD_LIFE:   Object.freeze({ WOOD_LIFE: 1.00, FIRE: 0.48, WATER_ICE: 0.46, LIGHT_YANG: 0.42, WIND: 0.34, YIN_SHADOW: 0.30, BLOOD_DEMON: 0.30, EARTH_METAL: 0.24, LIGHTNING: 0.20, ASTRAL: 0.22 }),
      YIN_SHADOW:  Object.freeze({ YIN_SHADOW: 1.00, WATER_ICE: 0.50, WIND: 0.40, BLOOD_DEMON: 0.44, WOOD_LIFE: 0.30, ASTRAL: 0.30, EARTH_METAL: 0.24, LIGHTNING: 0.18, FIRE: 0.14, LIGHT_YANG: 0.10 }),
      LIGHT_YANG:  Object.freeze({ LIGHT_YANG: 1.00, FIRE: 0.50, LIGHTNING: 0.45, WOOD_LIFE: 0.42, ASTRAL: 0.42, WIND: 0.35, EARTH_METAL: 0.30, WATER_ICE: 0.18, YIN_SHADOW: 0.10, BLOOD_DEMON: 0.08 }),
      ASTRAL:      Object.freeze({ ASTRAL: 1.00, LIGHT_YANG: 0.45, WIND: 0.42, LIGHTNING: 0.36, WATER_ICE: 0.34, YIN_SHADOW: 0.34, EARTH_METAL: 0.30, FIRE: 0.26, WOOD_LIFE: 0.24, BLOOD_DEMON: 0.20 }),
      BLOOD_DEMON: Object.freeze({ BLOOD_DEMON: 1.00, YIN_SHADOW: 0.46, FIRE: 0.42, WOOD_LIFE: 0.34, EARTH_METAL: 0.28, WATER_ICE: 0.24, WIND: 0.20, LIGHTNING: 0.18, ASTRAL: 0.18, LIGHT_YANG: 0.06 })
    }),
    // 3) Combat Tactical Matchup Matrix (Attacker Element vs Defender Element: [0.90, 1.12])
    COUNTER_MATRIX: Object.freeze({
      WATER_ICE:   Object.freeze({ FIRE: 1.10, EARTH_METAL: 0.93, LIGHTNING: 0.95 }),
      FIRE:        Object.freeze({ WOOD_LIFE: 1.10, EARTH_METAL: 1.06, WATER_ICE: 0.90 }),
      WOOD_LIFE:   Object.freeze({ EARTH_METAL: 1.09, WATER_ICE: 1.05, FIRE: 0.91 }),
      EARTH_METAL: Object.freeze({ LIGHTNING: 1.09, WIND: 1.06, WOOD_LIFE: 0.92 }),
      LIGHTNING:   Object.freeze({ WATER_ICE: 1.09, WIND: 1.06, EARTH_METAL: 0.91 }),
      WIND:        Object.freeze({ WOOD_LIFE: 1.07, YIN_SHADOW: 1.05, EARTH_METAL: 0.93 }),
      LIGHT_YANG:  Object.freeze({ YIN_SHADOW: 1.12, BLOOD_DEMON: 1.12, WATER_ICE: 0.95 }),
      YIN_SHADOW:  Object.freeze({ LIGHT_YANG: 1.08, ASTRAL: 1.05, LIGHTNING: 0.93 }),
      ASTRAL:      Object.freeze({ EARTH_METAL: 1.08, WIND: 1.06, BLOOD_DEMON: 1.04 }),
      BLOOD_DEMON: Object.freeze({ WOOD_LIFE: 1.09, WATER_ICE: 1.05, LIGHT_YANG: 0.90 })
    })
  };

  // Strict tag normalizer — never maps unknown tags to NEUTRAL silently
  ELEM.normalizeTag = raw => {
    if (raw == null) return { ok: true, element: 'NEUTRAL', composite: null };
    const s = String(raw).trim();
    const canonical = s.toUpperCase();
    if (!canonical || canonical === 'NONE' || canonical === 'NEUTRAL' || canonical === 'ANY') {
      return { ok: true, element: 'NEUTRAL', composite: null };
    }
    if (ELEM.COMPOSITE_PROFILES[canonical]) {
      const cp = ELEM.COMPOSITE_PROFILES[canonical];
      return { ok: true, element: cp.primary, composite: canonical, profile: cp };
    }
    const mapped = ELEM.ALIAS_MAP[canonical] || ELEM.ALIAS_MAP[s] || canonical;
    if (ELEM.ORDINARY_ELEMENTS.includes(mapped) || ELEM.SPECIAL_ELEMENTS.includes(mapped)) {
      return { ok: true, element: mapped, composite: null };
    }
    if (mapped === 'NEUTRAL') {
      return { ok: true, element: 'NEUTRAL', composite: null };
    }
    return { ok: false, element: 'UNKNOWN', raw: s, error: 'Unregistered element tag: ' + s };
  };

  ELEM.isValidOrdinaryElement = el => ELEM.ORDINARY_ELEMENTS.includes(el);
  ELEM.isValidSpecialElement = el => ELEM.SPECIAL_ELEMENTS.includes(el);
  ELEM.isValidGrade = gId => ELEM.GRADE_ORDER.includes(gId);

  const NEUTRAL_PROFILE = Object.freeze({ valid: true, mode: "EXPLICIT_NON_ELEMENTAL", primary: "NEUTRAL", weights: Object.freeze({}) });
  function computeProfileUncached(def) {
    if (!def) return NEUTRAL_PROFILE;
    if (typeof def === "string") {
      const norm = ELEM.normalizeTag(def);
      if (!norm.ok) return { valid: false, mode: "UNKNOWN", primary: "UNKNOWN", weights: {}, error: norm.error };
      if (norm.profile) return Object.assign({ valid: true }, norm.profile);
      if (norm.element === "NEUTRAL") return NEUTRAL_PROFILE;
      return {
        valid: true,
        mode: ELEM.isValidSpecialElement(norm.element) ? "SPECIAL_ELEMENT" : "INTRINSIC_SINGLE",
        primary: norm.element,
        weights: { [norm.element]: 1.0 }
      };
    }
    if (def.elementProfile && typeof def.elementProfile === "object") {
      const ep = def.elementProfile;
      if (!ELEM.VALID_MODES.includes(ep.mode)) {
        return { valid: false, mode: "UNKNOWN", primary: "UNKNOWN", weights: {}, error: "Invalid profile mode: " + ep.mode };
      }
      if (ep.mode === "EXPLICIT_NON_ELEMENTAL" || ep.mode === "ROOT_AGNOSTIC_UTILITY") {
        return { valid: true, mode: ep.mode, primary: "NEUTRAL", weights: NEUTRAL_PROFILE.weights };
      }
      const weights = {};
      let sum = 0;
      for (const [k, v] of Object.entries(ep.weights || {})) {
        const nk = ELEM.normalizeTag(k);
        if (!nk.ok || nk.element === "NEUTRAL") {
          return { valid: false, mode: "UNKNOWN", primary: "UNKNOWN", weights: {}, error: "Invalid weight element: " + k };
        }
        const w = Number(v);
        if (Number.isFinite(w) && w > 0) {
          weights[nk.element] = (weights[nk.element] || 0) + w;
          sum += w;
        }
      }
      if (sum <= 0) {
        const pNorm = ELEM.normalizeTag(ep.primary || def.element);
        if (!pNorm.ok) return { valid: false, mode: "UNKNOWN", primary: "UNKNOWN", weights: {}, error: pNorm.error };
        if (pNorm.element === "NEUTRAL") return NEUTRAL_PROFILE;
        return { valid: true, mode: ep.mode, primary: pNorm.element, weights: { [pNorm.element]: 1.0 } };
      }
      const normWeights = {};
      let bestEl = ep.primary || "NEUTRAL", bestW = -1;
      for (const [k, w] of Object.entries(weights)) {
        const nw = +(w / sum).toFixed(4);
        normWeights[k] = nw;
        if (nw > bestW) { bestW = nw; bestEl = k; }
      }
      return {
        valid: true,
        mode: ep.mode,
        primary: bestEl,
        compositeTag: ep.compositeTag || def.compositeElement || null,
        weights: normWeights
      };
    }
    if (def.compositeElement && ELEM.COMPOSITE_PROFILES[def.compositeElement]) {
      return Object.assign({ valid: true }, ELEM.COMPOSITE_PROFILES[def.compositeElement]);
    }
    const norm = ELEM.normalizeTag(def.element);
    if (!norm.ok) {
      return { valid: false, mode: "UNKNOWN", primary: "UNKNOWN", weights: {}, error: norm.error };
    }
    if (norm.profile) return Object.assign({ valid: true }, norm.profile);
    if (norm.element === "NEUTRAL") return NEUTRAL_PROFILE;
    return {
      valid: true,
      mode: ELEM.isValidSpecialElement(norm.element) ? "SPECIAL_ELEMENT" : "INTRINSIC_SINGLE",
      primary: norm.element,
      weights: { [norm.element]: 1.0 }
    };
  }
  const PROFILE_CACHE = new WeakMap();
  const NPC_ELEM_CACHE = new WeakMap();
  function getNpcCache(npc) {
    let c = NPC_ELEM_CACHE.get(npc);
    if (!c) { c = { ready: false, compat: Object.create(null), cap: Object.create(null), effMast: Object.create(null) }; NPC_ELEM_CACHE.set(npc, c); }
    return c;
  }
  function resetNpcCache(npc) {
    NPC_ELEM_CACHE.set(npc, { ready: true, compat: Object.create(null), cap: Object.create(null), effMast: Object.create(null) });
  }
  ELEM.getProfile = def => {
    if (!def) return NEUTRAL_PROFILE;
    if (typeof def === "object") {
      const hit = PROFILE_CACHE.get(def);
      if (hit) return hit;
      const res = computeProfileUncached(def);
      PROFILE_CACHE.set(def, res);
      return res;
    }
    return computeProfileUncached(def);
  };

  ELEM.getTargetProfile = ELEM.getProfile;

  /* ---------- Conservative Aggregate Scalar Grade Adapter & Rarity Classification ---------- */
  ELEM.computeAggregateGrade = (elements, grades) => {
    const k = Array.isArray(grades) && grades.length ? clamp(grades.length, 1, 4) : 1;
    const scores = (Array.isArray(grades) && grades.length ? grades.slice(0, k) : ['MORTAL'])
      .map(gId => ELEM.GRADE_SCORE[gId] || 2.0)
      .sort((a, b) => b - a);
    const maxS = scores[0] || 2.0;
    const meanS = scores.reduce((a, b) => a + b, 0) / scores.length;
    const breadthBonus = k === 4 ? 0.28 : k === 3 ? 0.20 : k === 2 ? 0.12 : 0.00;
    const aggScore = +(0.65 * maxS + 0.35 * meanS + breadthBonus).toFixed(4);
    let grade = 'DEFECTIVE';
    if (aggScore >= 4.75) grade = 'HEAVENLY';
    else if (aggScore >= 3.85) grade = 'TRUE';
    else if (aggScore >= 2.85) grade = 'SPIRIT';
    else if (aggScore >= 1.85) grade = 'MORTAL';
    return { grade, aggregateScore: aggScore, maxScore: maxS, meanScore: +meanS.toFixed(4), breadthBonus };
  };

  ELEM.classifyRarity = (elements, grades) => {
    const k = Array.isArray(grades) ? grades.length : 1;
    const counts = { HEAVENLY: 0, TRUE: 0, SPIRIT: 0, MORTAL: 0, DEFECTIVE: 0 };
    (grades || []).forEach(gId => { counts[gId] = (counts[gId] || 0) + 1; });
    const trueOrSpirit = counts.TRUE + counts.SPIRIT;
    const q = ELEM.ROOT_GRADE_PROBABILITIES;

    // The displayed rarity is derived from the same probabilities used by the
    // generator: P(root-count cohort) × P(grade cohort | root count).
    // expectedBirths is retained as a legacy field name; it means generated
    // character appearances, including visitors and recruitment candidates.
    const rarity = (band, rarityBand, rarityTitleTh, rootCount, conditionalProbability) => {
      const cohortProbability = ELEM.ROOT_COUNT_PROBABILITIES[rootCount] * conditionalProbability;
      const expectedCharacters = 1 / Math.max(Number.MIN_VALUE, cohortProbability);
      const expectedWorldYears = expectedCharacters / ELEM.GENERATED_CHARACTERS_PER_WORLD_YEAR;
      const roundedCharacters = +expectedCharacters.toFixed(2);
      const roundedYears = +expectedWorldYears.toFixed(4);
      return {
        band, rarityBand, rarityTitleTh,
        expectedCharacters: roundedCharacters,
        expectedBirths: roundedCharacters,
        expectedWorldYears: roundedYears
      };
    };

    if (k === 4) {
      if (counts.HEAVENLY === 4) {
        return rarity('TRANSCENDENT_HEAVENLY_FOURFOLD', 'TRANSCENDENT',
          'อัจฉริยะรากสวรรค์สี่ธาตุ (หายากยิ่งยวด · ไม่มีโควตาจำนวนคน)', 4, q[4].ALL_HEAVENLY);
      }
      return rarity('TRANSCENDENT_10000Y', 'TRANSCENDENT',
        'ผู้ถือครองกายาจตุรธาตุ (อัจฉริยะรอบหมื่นปี)', 4, q[4].OTHER);
    }

    if (k === 3) {
      if (counts.HEAVENLY === 3) {
        return rarity('MYTHIC_1000Y', 'TRANSCENDENT',
          'ตรีรากวิญญาณสวรรค์สมบูรณ์ (อัจฉริยะรอบหนึ่งพันปี)', 3, q[3].HEAVENLY_TRIPLE);
      }
      if (counts.HEAVENLY === 2 && trueOrSpirit === 1) {
        return rarity('MYTHIC_500Y', 'MYTHIC',
          'ตรีรากสองสวรรค์หนึ่งแท้/จิต (อัจฉริยะในช่วง 100–1,000 ปี)', 3, q[3].TWO_HEAVENLY_ONE_TRUE_OR_SPIRIT);
      }
      if (counts.HEAVENLY === 1 && trueOrSpirit === 2) {
        return rarity('MYTHIC_100Y', 'MYTHIC',
          'ตรีรากหนึ่งสวรรค์สองแท้/จิต (อัจฉริยะรอบหนึ่งร้อยปี)', 3, q[3].ONE_HEAVENLY_TWO_TRUE_OR_SPIRIT);
      }
      if (counts.TRUE === 3) {
        return rarity('EPIC_62Y', 'EPIC',
          'ตรีรากวิญญาณแท้จริงทั้งสาม (1 ใน 62.5 ปี)', 3, q[3].TRUE_TRIPLE);
      }
      if (counts.HEAVENLY >= 1) {
        return rarity('RARE_3ROOT_HEAVEN', 'RARE',
          'ตรีรากวิญญาณแฝงรากสวรรค์', 3, q[3].OTHER_HEAVENLY);
      }
      return rarity('UNCOMMON_3ROOT', 'UNCOMMON',
        'ผู้ถือครองตรีรากวิญญาณ', 3, q[3].COMMON);
    }

    if (k === 2) {
      if (counts.HEAVENLY === 2) {
        return rarity('MYTHIC_100Y', 'MYTHIC',
          'รากวิญญาณคู่สวรรค์สมบูรณ์ (อัจฉริยะรอบหนึ่งร้อยปี)', 2, q[2].HEAVENLY_PAIR);
      }
      if (counts.HEAVENLY === 1 && trueOrSpirit === 1) {
        return rarity('EPIC_5Y', 'EPIC',
          'รากวิญญาณคู่สวรรค์-แท้/จิต (อัจฉริยะทุกหลายปี)', 2, q[2].HEAVENLY_TRUE_OR_SPIRIT);
      }
      if (counts.TRUE === 2) {
        return rarity('RARE_6Y', 'RARE',
          'รากวิญญาณคู่แท้จริง (1 ใน 6.25 ปี)', 2, q[2].TRUE_PAIR);
      }
      if (counts.HEAVENLY === 1) {
        return rarity('RARE_DUAL_HEAVEN_LOW', 'RARE',
          'รากวิญญาณคู่แฝงรากสวรรค์', 2, q[2].HEAVENLY_WITH_MORTAL_OR_DEFECTIVE);
      }
      return rarity('COMMON_2ROOT', 'UNCOMMON',
        'รากวิญญาณคู่ประสาน', 2, q[2].COMMON);
    }

    if (counts.HEAVENLY === 1) {
      return rarity('RARE_SINGLE_HEAVEN', 'RARE',
        'เอกรากวิญญาณสวรรค์ (1 ใน 5 ปี)', 1, q[1].HEAVENLY);
    }
    if (counts.TRUE === 1) {
      return rarity('UNCOMMON_SINGLE_TRUE', 'UNCOMMON',
        'เอกรากวิญญาณแท้จริง', 1, q[1].TRUE);
    }
    if (counts.SPIRIT === 1) {
      return rarity('COMMON_SINGLE_SPIRIT', 'COMMON',
        'เอกรากวิญญาณระดับจิต', 1, q[1].SPIRIT);
    }
    if (counts.DEFECTIVE === 1) {
      return rarity('COMMON_SINGLE_DEFECTIVE', 'COMMON',
        'เอกรากวิญญาณบกพร่อง', 1, q[1].DEFECTIVE);
    }
    return rarity('COMMON_SINGLE_MORTAL', 'COMMON',
      'เอกรากวิญญาณสามัญ', 1, q[1].MORTAL);
  };

  ELEM.buildRootObject = (elements, grades) => {
    const cleanEls = [];
    const cleanGrades = [];
    const rawEls = Array.isArray(elements) ? elements : ['FIRE'];
    const rawGrades = Array.isArray(grades) ? grades : [];
    for (let i = 0; i < rawEls.length && cleanEls.length < 4; i++) {
      const norm = ELEM.normalizeTag(rawEls[i]);
      const el = (norm.ok && ELEM.isValidOrdinaryElement(norm.element)) ? norm.element : null;
      if (el && !cleanEls.includes(el)) {
        const gRaw = rawGrades[i] || rawGrades[0] || 'MORTAL';
        const gId = gRaw === 'HEAVEN' ? 'HEAVENLY' : (ELEM.isValidGrade(gRaw) ? gRaw : 'MORTAL');
        cleanEls.push(el);
        cleanGrades.push(gId);
      }
    }
    if (!cleanEls.length) {
      cleanEls.push('FIRE');
      const g0 = rawGrades[0] === 'HEAVEN' ? 'HEAVENLY' : (ELEM.isValidGrade(rawGrades[0]) ? rawGrades[0] : 'MORTAL');
      cleanGrades.push(g0);
    }
    const k = cleanEls.length;
    const agg = ELEM.computeAggregateGrade(cleanEls, cleanGrades);
    const rar = ELEM.classifyRarity(cleanEls, cleanGrades);
    const traitId = ELEM.ROOT_CAPACITY_TRAITS[k] || 'ROOT_CAPACITY_SINGLE';
    const roots = cleanEls.map((el, idx) => ({
      slot: idx,
      element: el,
      elementNameTh: ELEM.META[el] ? ELEM.META[el].nameTh : el,
      grade: cleanGrades[idx],
      gradeNameTh: ELEM.GRADE_FACTORS[cleanGrades[idx]] ? ELEM.GRADE_FACTORS[cleanGrades[idx]].nameTh : cleanGrades[idx],
      isPrimary: idx === 0
    }));
    return {
      schemaVersion: 2,
      rootCount: k,
      rootCapacityTrait: traitId,
      elements: cleanEls,
      grades: cleanGrades,
      roots,
      primaryElement: cleanEls[0],
      primaryGrade: cleanGrades[0],
      grade: agg.grade,
      aggregateScore: agg.aggregateScore,
      rarityBand: rar.rarityBand,
      rarityCode: rar.band,
      rarityTitleTh: rar.rarityTitleTh,
      expectedBirths: rar.expectedBirths,
      expectedWorldYears: rar.expectedWorldYears
    };
  };

  /* ---------- Hierarchical Deterministic Birth Root Generator ---------- */
  function pickOrdinaryElements(rng, k) {
    const pool = ELEM.ORDINARY_ELEMENTS.slice();
    const out = [];
    for (let i = 0; i < k && pool.length > 0; i++) {
      const idx = Math.floor(rng.next() * pool.length);
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }

  function rollGradesForCount(rng, k, explicitGrade) {
    const rollTrueOrSpirit = () => rng.next() < 0.5 ? 'TRUE' : 'SPIRIT';
    if (explicitGrade) {
      const gNorm = explicitGrade === 'HEAVEN' ? 'HEAVENLY' : (ELEM.isValidGrade(explicitGrade) ? explicitGrade : 'MORTAL');
      const out = [gNorm];
      const subPool = gNorm === 'HEAVENLY' ? ['TRUE', 'SPIRIT', 'MORTAL'] : gNorm === 'TRUE' ? ['TRUE', 'SPIRIT', 'MORTAL'] : ['SPIRIT', 'MORTAL', 'DEFECTIVE'];
      for (let i = 1; i < k; i++) out.push(subPool[Math.floor(rng.next() * subPool.length)]);
      return out;
    }

    const u = rng.next();
    const p = ELEM.ROOT_GRADE_PROBABILITIES;

    if (k === 1) {
      const q = p[1];
      if (u < q.HEAVENLY) return ['HEAVENLY'];
      if (u < q.HEAVENLY + q.TRUE) return ['TRUE'];
      if (u < q.HEAVENLY + q.TRUE + q.SPIRIT) return ['SPIRIT'];
      if (u < q.HEAVENLY + q.TRUE + q.SPIRIT + q.MORTAL) return ['MORTAL'];
      return ['DEFECTIVE'];
    }

    if (k === 2) {
      const q = p[2];
      if (u < q.HEAVENLY_PAIR) return ['HEAVENLY', 'HEAVENLY'];
      if (u < q.HEAVENLY_PAIR + q.HEAVENLY_TRUE_OR_SPIRIT) {
        return rng.next() < 0.5 ? ['HEAVENLY', rollTrueOrSpirit()] : [rollTrueOrSpirit(), 'HEAVENLY'];
      }
      if (u < q.HEAVENLY_PAIR + q.HEAVENLY_TRUE_OR_SPIRIT + q.TRUE_PAIR) return ['TRUE', 'TRUE'];
      if (u < q.HEAVENLY_PAIR + q.HEAVENLY_TRUE_OR_SPIRIT + q.TRUE_PAIR + q.HEAVENLY_WITH_MORTAL_OR_DEFECTIVE) {
        const other = rng.next() < 0.5 ? 'MORTAL' : 'DEFECTIVE';
        return rng.next() < 0.5 ? ['HEAVENLY', other] : [other, 'HEAVENLY'];
      }
      const rollOne = () => {
        const r = rng.next();
        if (r < 0.06) return 'TRUE';
        if (r < 0.28) return 'SPIRIT';
        if (r < 0.78) return 'MORTAL';
        return 'DEFECTIVE';
      };
      const out = [rollOne(), rollOne()];
      // Keep the explicitly calibrated TRUE+TRUE cohort exclusive.
      if (out[0] === 'TRUE' && out[1] === 'TRUE') out[1] = 'SPIRIT';
      return out;
    }

    if (k === 3) {
      const q = p[3];
      if (u < q.HEAVENLY_TRIPLE) return ['HEAVENLY', 'HEAVENLY', 'HEAVENLY'];
      if (u < q.HEAVENLY_TRIPLE + q.TWO_HEAVENLY_ONE_TRUE_OR_SPIRIT) {
        return ['HEAVENLY', 'HEAVENLY', rollTrueOrSpirit()];
      }
      if (u < q.HEAVENLY_TRIPLE + q.TWO_HEAVENLY_ONE_TRUE_OR_SPIRIT + q.ONE_HEAVENLY_TWO_TRUE_OR_SPIRIT) {
        return ['HEAVENLY', rollTrueOrSpirit(), rollTrueOrSpirit()];
      }
      if (u < q.HEAVENLY_TRIPLE + q.TWO_HEAVENLY_ONE_TRUE_OR_SPIRIT + q.ONE_HEAVENLY_TWO_TRUE_OR_SPIRIT + q.TRUE_TRIPLE) {
        return ['TRUE', 'TRUE', 'TRUE'];
      }
      if (u < q.HEAVENLY_TRIPLE + q.TWO_HEAVENLY_ONE_TRUE_OR_SPIRIT + q.ONE_HEAVENLY_TWO_TRUE_OR_SPIRIT + q.TRUE_TRIPLE + q.OTHER_HEAVENLY) {
        const compositions = [
          ['HEAVENLY', 'MORTAL', 'MORTAL'],
          ['HEAVENLY', 'MORTAL', 'DEFECTIVE'],
          ['HEAVENLY', 'DEFECTIVE', 'DEFECTIVE'],
          ['HEAVENLY', 'HEAVENLY', 'MORTAL'],
          ['HEAVENLY', 'HEAVENLY', 'DEFECTIVE']
        ];
        return compositions[Math.floor(rng.next() * compositions.length)].slice();
      }
      const rollOne = () => {
        const r = rng.next();
        if (r < 0.06) return 'TRUE';
        if (r < 0.28) return 'SPIRIT';
        if (r < 0.78) return 'MORTAL';
        return 'DEFECTIVE';
      };
      const out = [rollOne(), rollOne(), rollOne()];
      // Keep the explicitly calibrated TRUE×3 cohort exclusive.
      if (out.every(gId => gId === 'TRUE')) out[2] = 'SPIRIT';
      return out;
    }

    // Four-root characters are themselves a 10,000-year cohort. Four Heavenly
    // grades form a 0.5% conditional subtype (about one appearance per 2 million years).
    const q = p[4];
    if (u < q.ALL_HEAVENLY) return ['HEAVENLY', 'HEAVENLY', 'HEAVENLY', 'HEAVENLY'];
    if (u < q.ALL_HEAVENLY + 0.02) return ['HEAVENLY', 'HEAVENLY', 'HEAVENLY', rollTrueOrSpirit()];
    if (u < q.ALL_HEAVENLY + 0.10) return ['TRUE', 'TRUE', 'TRUE', 'TRUE'];
    const out4 = [];
    let hCnt4 = 0, tCnt4 = 0;
    for (let i = 0; i < 4; i++) {
      const r = rng.next();
      let gId = r < 0.005 ? 'HEAVENLY' : r < 0.050 ? 'TRUE' : r < 0.240 ? 'SPIRIT' : r < 0.720 ? 'MORTAL' : 'DEFECTIVE';
      if (gId === 'HEAVENLY' && hCnt4 >= 1) gId = 'SPIRIT';
      if (gId === 'HEAVENLY') hCnt4++;
      if (gId === 'TRUE') tCnt4++;
      out4.push(gId);
    }
    if (tCnt4 === 4) out4[3] = 'SPIRIT';
    return out4;
  }

  ELEM.rollBirthRoots = (rng, opts) => {
    opts = opts || {};
    const r = rng || new U.RNG('default-root-rng');
    if (opts.customRoots && Array.isArray(opts.customRoots.elements)) {
      return ELEM.buildRootObject(opts.customRoots.elements, opts.customRoots.grades);
    }
    let k = opts.forceRootCount ? clamp(Math.floor(opts.forceRootCount), 1, 4) : null;
    if (!k) {
      const uCount = r.next();
      let cumulative = 0;
      for (const count of [1, 2, 3, 4]) {
        cumulative += ELEM.ROOT_COUNT_PROBABILITIES[count];
        if (uCount < cumulative) { k = count; break; }
      }
      if (!k) k = 4; // Floating-point-safe final bucket.
    }
    const hasForcedElements = Array.isArray(opts.forceElements) && opts.forceElements.length > 0;
    let elements = hasForcedElements ? [] : pickOrdinaryElements(r, k);
    if (hasForcedElements) {
      for (let i = 0; i < opts.forceElements.length && elements.length < k; i++) {
        const norm = ELEM.normalizeTag(opts.forceElements[i]);
        if (!norm.ok || !ELEM.isValidOrdinaryElement(norm.element) || elements.includes(norm.element)) continue;
        elements.push(norm.element);
      }
    }
    while (elements.length < k) {
      const pool = ELEM.ORDINARY_ELEMENTS.filter(e => !elements.includes(e));
      if (!pool.length) break;
      const candidate = pool[Math.min(pool.length - 1, Math.floor(r.next() * pool.length))];
      elements.push(candidate);
    }
    // Grades are indexed by final root slot, not by the raw forceElements input.
    // This keeps partial/filtered forced element lists deterministic and predictable.
    const grades = Array.isArray(opts.forceGrades) && opts.forceGrades.length
      ? elements.map((_, i) => opts.forceGrades[i] || (hasForcedElements ? 'MORTAL' : opts.forceGrades[0] || 'MORTAL'))
      : rollGradesForCount(r, elements.length, opts.explicitRootGrade || null);
    return ELEM.buildRootObject(elements, grades);
  };

  /* ---------- Validate & Normalize Root/Trait/Mastery State on NPC ---------- */
  ELEM.validateRootSpec = spec => {
    const errors = [];
    if (!spec || typeof spec !== 'object') return { ok: false, errors: ['Missing root specification'] };
    const k = Number(spec.rootCount != null ? spec.rootCount : (Array.isArray(spec.elements) ? spec.elements.length : 0));
    if (!Number.isInteger(k) || k < 1 || k > 4) {
      errors.push('จำนวนรากวิญญาณต้องอยู่ระหว่าง 1 ถึง 4 รากเท่านั้น (ไม่รองรับ 5 ราก)');
    }
    if (spec.rootCapacityTrait && !Object.prototype.hasOwnProperty.call(ELEM.TRAIT_TO_ROOT_COUNT, spec.rootCapacityTrait)) {
      errors.push('ไม่รู้จักลักษณะความจุรากวิญญาณ: ' + spec.rootCapacityTrait);
    } else if (spec.rootCapacityTrait && ELEM.TRAIT_TO_ROOT_COUNT[spec.rootCapacityTrait] !== k) {
      errors.push('ลักษณะความจุรากวิญญาณ (' + spec.rootCapacityTrait + ') ไม่ตรงกับจำนวนราก (' + k + ')');
    }
    if (!Array.isArray(spec.elements) || spec.elements.length !== k) {
      errors.push('รายการธาตุรากวิญญาณต้องมีความยาวตรงกับจำนวนราก (' + k + ')');
    } else {
      const seen = new Set();
      for (const el of spec.elements) {
        if (ELEM.isValidSpecialElement(el)) {
          errors.push('ธาตุพิเศษ (' + el + ') ไม่สามารถตั้งเป็นรากวิญญาณกำเนิดสามัญได้');
        } else if (!ELEM.isValidOrdinaryElement(el)) {
          errors.push('ธาตุรากวิญญาณไม่ถูกต้อง: ' + el);
        } else if (seen.has(el)) {
          errors.push('ห้ามมีธาตุรากวิญญาณซ้ำกันในตัวละครเดียวกัน: ' + el);
        }
        seen.add(el);
      }
    }
    if (!Array.isArray(spec.grades) || spec.grades.length !== k) {
      errors.push('รายการระดับรากวิญญาณ (grades) ต้องมีความยาวตรงกับจำนวนราก (' + k + ')');
    } else {
      for (const gId of spec.grades) {
        if (!ELEM.isValidGrade(gId)) {
          errors.push('ระดับรากวิญญาณไม่ถูกต้อง: ' + gId);
        }
      }
    }
    return { ok: errors.length === 0, errors };
  };

  // Verify the complete version-2 root snapshot, including its UI mirrors and derived rarity fields.
  ELEM.isCanonicalRootObject = root => {
    if (!root || root.schemaVersion !== 2 || !Array.isArray(root.elements) || !Array.isArray(root.grades)) return false;
    const k = root.elements.length;
    if (k < 1 || k > 4 || root.rootCount !== k || root.grades.length !== k) return false;
    if (new Set(root.elements).size !== k || !root.elements.every(ELEM.isValidOrdinaryElement) || !root.grades.every(ELEM.isValidGrade)) return false;
    const traitId = ELEM.ROOT_CAPACITY_TRAITS[k] || 'ROOT_CAPACITY_SINGLE';
    if (root.rootCapacityTrait !== traitId) return false;
    if (!ELEM.validateRootSpec({ rootCount: k, rootCapacityTrait: traitId, elements: root.elements, grades: root.grades }).ok) return false;
    if (!Array.isArray(root.roots) || root.roots.length !== k) return false;
    for (let i = 0; i < k; i++) {
      const r = root.roots[i], el = root.elements[i], gr = root.grades[i];
      if (!r || r.slot !== i || r.element !== el || r.grade !== gr || r.isPrimary !== (i === 0)) return false;
      if (r.elementNameTh !== (ELEM.META[el] ? ELEM.META[el].nameTh : el)) return false;
      if (r.gradeNameTh !== (ELEM.GRADE_FACTORS[gr] ? ELEM.GRADE_FACTORS[gr].nameTh : gr)) return false;
    }
    const agg = ELEM.computeAggregateGrade(root.elements, root.grades);
    const rar = ELEM.classifyRarity(root.elements, root.grades);
    return root.primaryElement === root.elements[0] && root.primaryGrade === root.grades[0]
      && root.grade === agg.grade && Math.abs(Number(root.aggregateScore) - agg.aggregateScore) < 0.00011
      && root.rarityCode === rar.band && root.rarityBand === rar.rarityBand
      && root.rarityTitleTh === rar.rarityTitleTh && root.expectedBirths === rar.expectedBirths
      && root.expectedWorldYears === rar.expectedWorldYears;
  };

  // Repair malformed new-schema root snapshots deterministically; never reroll on every load.
  function repairRootObject(npc) {
    const root = npc && npc.h && npc.h.root && typeof npc.h.root === 'object' ? npc.h.root : {};
    const rawEls = Array.isArray(root.elements) ? root.elements : (Array.isArray(root.roots) ? root.roots.map(r => r && r.element) : []);
    const rawGrades = Array.isArray(root.grades) ? root.grades : (Array.isArray(root.roots) ? root.roots.map(r => r && r.grade) : []);
    const declaredCount = Number(root.rootCount);
    const traitCount = ELEM.TRAIT_TO_ROOT_COUNT[root.rootCapacityTrait] || 0;
    let targetCount = Number.isInteger(declaredCount) && declaredCount >= 1 && declaredCount <= 4 ? declaredCount : traitCount;
    const elements = [], grades = [];
    for (let i = 0; i < rawEls.length && elements.length < 4; i++) {
      const norm = ELEM.normalizeTag(rawEls[i]);
      const el = norm.ok && ELEM.isValidOrdinaryElement(norm.element) ? norm.element : null;
      if (!el || elements.includes(el)) continue;
      elements.push(el);
      grades.push(ELEM.isValidGrade(rawGrades[i]) ? rawGrades[i] : 'MORTAL');
    }
    if (!targetCount) targetCount = Math.max(1, Math.min(4, elements.length || 1));
    targetCount = clamp(targetCount, 1, 4);
    if (elements.length > targetCount) { elements.length = targetCount; grades.length = targetCount; }
    const seedStr = 'repair_root:' + (npc.h.genome || 1) + ':' + (npc.h.birthDay || 0) + ':' + (npc.id || '') + ':' + targetCount;
    const r = new U.RNG(seedStr);
    while (elements.length < targetCount) {
      const pool = ELEM.ORDINARY_ELEMENTS.filter(el => !elements.includes(el));
      if (!pool.length) break;
      const idx = Math.min(pool.length - 1, Math.floor(r.next() * pool.length));
      elements.push(pool[idx]);
      grades.push('MORTAL');
    }
    return ELEM.buildRootObject(elements.length ? elements : ['FIRE'], grades.length ? grades : ['MORTAL']);
  }

  function elementalSystemIsReady(sys) {
    if (!sys || typeof sys !== 'object' || sys.version !== 2) return false;
    if (!sys.mastery || typeof sys.mastery !== 'object' || Array.isArray(sys.mastery)) return false;
    if (!sys.specialMastery || typeof sys.specialMastery !== 'object' || Array.isArray(sys.specialMastery)) return false;
    if (!ELEM.ORDINARY_ELEMENTS.every(el => Number.isFinite(sys.mastery[el]) && sys.mastery[el] >= 0 && sys.mastery[el] <= 100)) return false;
    if (!ELEM.SPECIAL_ELEMENTS.every(el => Number.isFinite(sys.specialMastery[el]) && sys.specialMastery[el] >= 0 && sys.specialMastery[el] <= 100)) return false;
    const log = sys.dailyGainLog;
    if (!log || typeof log !== 'object' || !Number.isFinite(log.day)
      || !log.byElement || typeof log.byElement !== 'object' || Array.isArray(log.byElement)
      || !Array.isArray(log.seenKeys)) return false;
    const access = sys.specialAccess;
    return !!access && typeof access === 'object' && !Array.isArray(access)
      && ELEM.SPECIAL_ELEMENTS.every(el => access[el] && typeof access[el].unlocked === 'boolean'
        && Number.isFinite(access[el].affinity) && Array.isArray(access[el].sources));
  }

  const ASTRAL_SUBS = new Set(['ASTRAL_ARRAY', 'TIME_VOID', 'FATE_ORACLE', 'MIND_SWORD_TELEKINESIS', 'STAR_ARCHER']);
  const BLOOD_SUBS = new Set(['BLOOD_DEMON', 'BLOOD_DRAGON', 'DEVOURING_FIEND', 'HEAVEN_DEVOURING_DEMON']);

  ELEM.syncSpecialAccess = npc => {
    if (!npc || !npc.h) return null;
    npc.ext = npc.ext || {};
    const sys = npc.ext.elementalSystem;
    if (!sys) return null;
    const c = npc.cult;
    const oldAccess = sys.specialAccess && typeof sys.specialAccess === 'object' ? sys.specialAccess : {};
    const sourceArray = el => oldAccess[el] && Array.isArray(oldAccess[el].sources) ? oldAccess[el].sources.filter(x => typeof x === 'string' && x.length > 0) : [];
    const astralSources = new Set(sourceArray('ASTRAL'));
    const bloodSources = new Set(sourceArray('BLOOD_DEMON'));

    if (c) {
      if (ASTRAL_SUBS.has(c.sub)) astralSources.add('SUBPATH:' + c.sub);
      if (c.path === 'DEMON') bloodSources.add('PATH:DEMON');
      if (BLOOD_SUBS.has(c.sub)) bloodSources.add('SUBPATH:' + c.sub);
      const learnedTechs = Array.isArray(c.techs) ? c.techs : [];
      const checkIds = Array.from(new Set(learnedTechs.concat(c.mantra ? [c.mantra] : [], Array.isArray(c.unlockedMantras) ? c.unlockedMantras : [])));
      for (const id of checkIds) {
        const t = CULT.tech ? CULT.tech(id) : null;
        if (!t) continue;
        const prof = ELEM.getProfile(t);
        if (prof.weights && prof.weights.ASTRAL) astralSources.add('TECH:' + id);
        if (prof.weights && prof.weights.BLOOD_DEMON) bloodSources.add('TECH:' + id);
      }
    }
    if (npc.h.constitution === 'CON_STAR_MARROW' || npc.h.constitution === 'CON_VOID_SPIRIT') {
      astralSources.add('CONSTITUTION:' + npc.h.constitution);
    }
    if (npc.h.constitution === 'CON_BLOOD_FIEND' || npc.h.constitution === 'CON_ASURA_WAR') {
      bloodSources.add('CONSTITUTION:' + npc.h.constitution);
    }

    const aList = Array.from(astralSources);
    const bList = Array.from(bloodSources);
    const aBaseAff = Math.round(
      (HC.eff(npc, 'affinities.ARRAY') * 0.35 + HC.eff(npc, 'affinities.SOUL_DIVINE') * 0.35 + HC.eff(npc, 'affinities.LIGHT_YANG') * 0.15 + HC.eff(npc, 'affinities.WIND') * 0.15)
    );
    const bBaseAff = Math.round(
      (HC.eff(npc, 'affinities.YIN_SHADOW') * 0.40 + HC.eff(npc, 'affinities.POISON') * 0.30 + HC.eff(npc, 'affinities.BODY_REFINING') * 0.30)
    );

    sys.specialAccess = {
      ASTRAL: {
        unlocked: aList.length > 0 || (sys.specialMastery && sys.specialMastery.ASTRAL > 5),
        affinity: clamp(aBaseAff + aList.length * 10, 0, 100),
        sources: aList
      },
      BLOOD_DEMON: {
        unlocked: bList.length > 0 || (sys.specialMastery && sys.specialMastery.BLOOD_DEMON > 5),
        affinity: clamp(bBaseAff + bList.length * 10, 0, 100),
        sources: bList
      }
    };
    resetNpcCache(npc);
    return sys.specialAccess;
  };

  ELEM.ensureNpc = (npc, opts) => {
    if (!npc || !npc.h) return null;
    const _ec = NPC_ELEM_CACHE.get(npc);
    const h = npc.h;
    const rootReady = ELEM.isCanonicalRootObject(h.root);
    const sysReady = npc.ext && elementalSystemIsReady(npc.ext.elementalSystem);
    const activeCapTraitIds = ['TR_ROOT_CAPACITY_DUAL', 'TR_ROOT_CAPACITY_TRIPLE', 'TR_ROOT_CAPACITY_FOURFOLD'];
    const activeCapTraits = Array.isArray(h.traits) ? h.traits.filter(x => x && activeCapTraitIds.includes(x.id)).map(x => x.id) : [];
    const wantTraitNow = rootReady ? (ELEM.ROOT_CAPACITY_TRAITS[h.root.rootCount] || 'ROOT_CAPACITY_SINGLE') : null;
    const traitsReady = rootReady && (wantTraitNow === 'ROOT_CAPACITY_SINGLE' ? activeCapTraits.length === 0 : activeCapTraits.length === 1 && activeCapTraits[0] === wantTraitNow);
    if (!opts && _ec && _ec.ready && rootReady && sysReady && traitsReady) return npc.ext.elementalSystem;
    opts = opts || {};
    if (!rootReady) h.root = repairRootObject(npc);

    h.traits = Array.isArray(h.traits) ? h.traits : [];
    const capTraitIds = ['TR_ROOT_CAPACITY_DUAL', 'TR_ROOT_CAPACITY_TRIPLE', 'TR_ROOT_CAPACITY_FOURFOLD'];
    const wantTrait = ELEM.ROOT_CAPACITY_TRAITS[h.root.rootCount] || 'ROOT_CAPACITY_SINGLE';
    let keptWantedTrait = false;
    for (let i = h.traits.length - 1; i >= 0; i--) {
      const tid = h.traits[i] && h.traits[i].id;
      if (!capTraitIds.includes(tid)) continue;
      if (tid !== wantTrait || keptWantedTrait) h.traits.splice(i, 1);
      else keptWantedTrait = true;
    }
    if (wantTrait !== 'ROOT_CAPACITY_SINGLE' && !keptWantedTrait) {
      h.traits.push({ id: wantTrait, lv: 1 });
    }

    npc.ext = npc.ext || {};
    let sys = npc.ext.elementalSystem;
    if (!sys || typeof sys !== 'object' || sys.version !== 2) {
      const mastery = {};
      ELEM.ORDINARY_ELEMENTS.forEach(el => {
        const rootIdx = h.root.elements.indexOf(el);
        const gId = rootIdx >= 0 ? h.root.grades[rootIdx] : null;
        const gScore = gId ? (ELEM.GRADE_SCORE[gId] || 2) : 0;
        const aff = (h.affinities && Number.isFinite(h.affinities[el])) ? h.affinities[el] : 25;
        const stageBonus = npc.cult ? (npc.cult.stage || 1) * 3.5 : 0;
        const baseM = rootIdx >= 0
          ? clamp(Math.round((4 + gScore * 2.8 + aff * 0.14 + stageBonus * (rootIdx === 0 ? 1.0 : 0.7)) * 10) / 10, 2, 68)
          : clamp(Math.round((aff > 45 ? (aff - 45) * 0.15 : 0) * 10) / 10, 0, 25);
        mastery[el] = baseM;
      });
      const specialMastery = {
        ASTRAL: (npc.cult && ASTRAL_SUBS.has(npc.cult.sub)) ? clamp(8 + (npc.cult.stage || 1) * 4, 5, 55) : 0,
        BLOOD_DEMON: (npc.cult && (npc.cult.path === 'DEMON' || BLOOD_SUBS.has(npc.cult.sub))) ? clamp(8 + (npc.cult.stage || 1) * 4, 5, 55) : 0
      };
      sys = npc.ext.elementalSystem = {
        version: 2,
        mastery,
        specialMastery,
        specialAccess: {},
        dailyGainLog: { day: HC.nowDay || 0, byElement: {}, seenKeys: [] },
        lastCompatibilityCache: null
      };
    } else {
      if (!sys.mastery || typeof sys.mastery !== 'object' || Array.isArray(sys.mastery)) sys.mastery = {};
      ELEM.ORDINARY_ELEMENTS.forEach(el => {
        const value = Number(sys.mastery[el]);
        sys.mastery[el] = clamp(Number.isFinite(value) ? value : 0, 0, 100);
      });
      if (!sys.specialMastery || typeof sys.specialMastery !== 'object' || Array.isArray(sys.specialMastery)) sys.specialMastery = {};
      ELEM.SPECIAL_ELEMENTS.forEach(el => {
        const value = Number(sys.specialMastery[el]);
        sys.specialMastery[el] = clamp(Number.isFinite(value) ? value : 0, 0, 100);
      });
      if (!sys.dailyGainLog || typeof sys.dailyGainLog !== 'object' || Array.isArray(sys.dailyGainLog)) {
        sys.dailyGainLog = { day: HC.nowDay || 0, byElement: {}, seenKeys: [] };
      } else {
        if (!Number.isFinite(sys.dailyGainLog.day)) sys.dailyGainLog.day = HC.nowDay || 0;
        if (!sys.dailyGainLog.byElement || typeof sys.dailyGainLog.byElement !== 'object' || Array.isArray(sys.dailyGainLog.byElement)) sys.dailyGainLog.byElement = {};
        for (const el of Object.keys(sys.dailyGainLog.byElement)) {
          if (!ELEM.ALL_ELEMENTS.includes(el)) { delete sys.dailyGainLog.byElement[el]; continue; }
          const used = Number(sys.dailyGainLog.byElement[el]);
          if (!Number.isFinite(used)) delete sys.dailyGainLog.byElement[el];
          else sys.dailyGainLog.byElement[el] = clamp(used, 0, ELEM.MAX_DAILY_GAIN || 2.5);
        }
        if (!Array.isArray(sys.dailyGainLog.seenKeys)) sys.dailyGainLog.seenKeys = [];
        if (sys.dailyGainLog.seenKeys.length > 60) sys.dailyGainLog.seenKeys = sys.dailyGainLog.seenKeys.slice(-60);
      }
    }
    ELEM.syncSpecialAccess(npc);
    resetNpcCache(npc);
    return sys;
  };
  ELEM.ensureNpcElementalState = ELEM.ensureNpc;
  ELEM.invalidateNpcCache = resetNpcCache;

  ELEM.setRootProfile = (npc, spec) => {
    if (!npc || !npc.h) return { ok: false, errors: ['ไม่พบตัวละครสำหรับแก้ไขรากวิญญาณ'], reason: 'ไม่พบตัวละครสำหรับแก้ไขรากวิญญาณ' };
    const val = ELEM.validateRootSpec(spec);
    if (!val.ok) return { ok: false, errors: val.errors, reason: val.errors.join(' · ') };
    npc.h.root = ELEM.buildRootObject(spec.elements, spec.grades);
    ELEM.ensureNpc(npc);
    if (spec.mastery && typeof spec.mastery === 'object') {
      const sys = npc.ext.elementalSystem;
      for (const el of ELEM.ORDINARY_ELEMENTS) {
        if (spec.mastery[el] != null && Number.isFinite(Number(spec.mastery[el]))) {
          sys.mastery[el] = clamp(Math.round(Number(spec.mastery[el]) * 100) / 100, 0, 100);
        }
      }
      for (const el of ELEM.SPECIAL_ELEMENTS) {
        if (spec.mastery[el] != null && Number.isFinite(Number(spec.mastery[el]))) {
          sys.specialMastery[el] = clamp(Math.round(Number(spec.mastery[el]) * 100) / 100, 0, 100);
        }
      }
    }
    NPC_ELEM_CACHE.delete(npc);
    ELEM.ensureNpc(npc);
    npc._cultRateBase = null;
    if (g.MARTIAL && g.MARTIAL.invalidateMartialCaches) g.MARTIAL.invalidateMartialCaches(npc);
    HC.bump(npc);
    return { ok: true, root: npc.h.root, elementalSystem: npc.ext.elementalSystem };
  };

  /* ---------- Action-Execution-Only Elemental Mastery Gain ---------- */
  ELEM.MAX_DAILY_GAIN = 2.5;
  const ACTION_BASE_GAIN = {
    skill_cast: 0.14,
    practice: 0.22,
    study: 0.28,
    cultivate_session: 0.24,
    craft_finish: 0.25,
    breakthrough_ok: 0.90,
    cult_gain: 0.08
  };
  // Supports both (npc, target, actionOrAmt, W, opts) and (W, npc, target, baseAmount, sourceTag)
  ELEM.gainMastery = (a1, a2, a3, a4, a5) => {
    let W, npc, targetOrElement, baseAmount, sourceTag;
    if (a1 && a1.h) {
      // Called as (npc, target, actionKindOrAmt, W, opts)
      npc = a1;
      targetOrElement = a2;
      W = a4;
      const opts = a5 || {};
      const scale = Number.isFinite(opts.scale) ? opts.scale : 1;
      if (typeof a3 === 'number') {
        baseAmount = a3 * scale;
        sourceTag = opts.sourceId || 'act';
      } else {
        baseAmount = (ACTION_BASE_GAIN[a3] || 0.18) * scale;
        sourceTag = (a3 || 'act') + ':' + (opts.sourceId || '');
      }
    } else {
      // Called as (W, npc, target, baseAmount, sourceTag)
      W = a1;
      npc = a2;
      targetOrElement = a3;
      baseAmount = typeof a4 === 'number' ? a4 : (ACTION_BASE_GAIN[a4] || 0.18);
      sourceTag = a5 || (typeof a4 === 'string' ? a4 : 'act');
    }

    if (!npc || npc.foe || npc.dead || !npc.h) return { gained: 0, details: {} };
    const sys = ELEM.ensureNpc(npc);
    if (!sys) return { gained: 0, details: {} };
    const prof = ELEM.getProfile(targetOrElement);
    if (!prof.valid || prof.mode === 'EXPLICIT_NON_ELEMENTAL' || prof.mode === 'ROOT_AGNOSTIC_UTILITY') {
      return { gained: 0, details: {} };
    }
    const day = W && W.day != null ? W.day : (HC.nowDay || 0);
    const tick = W && W.t != null ? W.t : 0;
    const log = sys.dailyGainLog;
    if (log.day !== day) {
      log.day = day;
      log.byElement = {};
      log.seenKeys = [];
    }
    const dedupKey = day + ':' + tick + ':' + (sourceTag || 'act') + ':' + prof.primary;
    if (sourceTag && log.seenKeys.includes(dedupKey)) {
      return { gained: 0, deduplicated: true, details: {} };
    }
    if (sourceTag) {
      log.seenKeys.push(dedupKey);
      if (log.seenKeys.length > 60) log.seenKeys.splice(0, log.seenKeys.length - 60);
    }

    const comp = (HC.eff(npc, 'intellect.comprehension') + HC.eff(npc, 'intellect.learningSpeed')) / 200;
    const details = {};
    let totalGained = 0;

    for (const [el, w] of Object.entries(prof.weights)) {
      const isSpec = ELEM.isValidSpecialElement(el);
      const map = isSpec ? sys.specialMastery : sys.mastery;
      const cur = map[el] || 0;
      if (cur >= 100) continue;
      const usedToday = log.byElement[el] || 0;
      if (usedToday >= ELEM.MAX_DAILY_GAIN) continue;

      let rootMult = 0.72;
      if (isSpec) {
        const acc = sys.specialAccess && sys.specialAccess[el];
        rootMult = (acc && acc.unlocked) ? (0.85 + (acc.affinity || 50) / 250) : 0.45;
      } else {
        const rIdx = npc.h.root.elements.indexOf(el);
        if (rIdx >= 0) {
          const gf = ELEM.GRADE_FACTORS[npc.h.root.grades[rIdx]] || ELEM.GRADE_FACTORS.MORTAL;
          rootMult = gf.study * (rIdx === 0 ? 1.08 : 0.96);
        } else {
          let bestL = 0.25;
          for (let i = 0; i < npc.h.root.elements.length; i++) {
            const rEl = npc.h.root.elements[i];
            const tr = (ELEM.LEARNING_GRAPH[rEl] && ELEM.LEARNING_GRAPH[rEl][el]) || 0.15;
            if (tr > bestL) bestL = tr;
          }
          rootMult = 0.55 + 0.45 * bestL;
        }
      }

      const diminishing = Math.pow(Math.max(0.06, 1 - cur / 104), 1.35);
      const rawGain = (baseAmount || 0.15) * w * rootMult * (0.75 + 0.5 * comp) * diminishing;
      const clampedGain = Math.min(ELEM.MAX_DAILY_GAIN - usedToday, Math.max(0, rawGain));
      if (clampedGain > 0.0001) {
        map[el] = clamp(+(cur + clampedGain).toFixed(4), 0, 100);
        log.byElement[el] = +(usedToday + clampedGain).toFixed(4);
        details[el] = +clampedGain.toFixed(4);
        totalGained += clampedGain;
      }
    }
    if (totalGained > 0) {
      resetNpcCache(npc);
      npc._cultRateBase = null;
    }
    return { gained: +totalGained.toFixed(4), details };
  };

  /* ---------- Central Compatibility Resolver ---------- */
  ELEM.effectiveMastery = (npc, targetEl) => {
    const sys = ELEM.ensureNpc(npc);
    if (!sys) return 0;
    const _ec = getNpcCache(npc);
    if (_ec.effMast[targetEl] !== undefined) return _ec.effMast[targetEl];
    if (ELEM.isValidSpecialElement(targetEl)) {
      const directSpec = sys.specialMastery[targetEl] || 0;
      let bestTransfer = 0;
      for (const oEl of ELEM.ORDINARY_ELEMENTS) {
        const m = sys.mastery[oEl] || 0;
        const l = (ELEM.LEARNING_GRAPH[oEl] && ELEM.LEARNING_GRAPH[oEl][targetEl]) || 0;
        if (m * l > bestTransfer) bestTransfer = m * l;
      }
      const v = clamp(0.75 * directSpec + 0.25 * bestTransfer, 0, 100); _ec.effMast[targetEl] = v; return v;
    }
    const direct = sys.mastery[targetEl] || 0;
    let maxTransfer = 0;
    for (const oEl of ELEM.ORDINARY_ELEMENTS) {
      if (oEl === targetEl) continue;
      const m = sys.mastery[oEl] || 0;
      const l = (ELEM.LEARNING_GRAPH[oEl] && ELEM.LEARNING_GRAPH[oEl][targetEl]) || 0;
      if (m * l > maxTransfer) maxTransfer = m * l;
    }
    const v = clamp(0.70 * direct + 0.30 * maxTransfer, 0, 100); _ec.effMast[targetEl] = v; return v;
  };

  ELEM.elementCapability = (npc, targetEl, mode) => {
    const sys = ELEM.ensureNpc(npc);
    const _ec = getNpcCache(npc);
    const capKey = targetEl + ":" + mode;
    if (_ec.cap[capKey]) return _ec.cap[capKey];
    const rootObj = npc.h.root;
    const gKey = mode === 'study' ? 'study' : mode === 'cult' ? 'cult' : 'combat';

    if (ELEM.isValidSpecialElement(targetEl)) {
      const acc = (sys.specialAccess && sys.specialAccess[targetEl]) || { unlocked: false, affinity: 25 };
      const mEff = ELEM.effectiveMastery(npc, targetEl);
      let bestSupport = 0.45;
      for (let i = 0; i < rootObj.elements.length; i++) {
        const rEl = rootObj.elements[i];
        const rG = ELEM.GRADE_FACTORS[rootObj.grades[i]] || ELEM.GRADE_FACTORS.MORTAL;
        const kVal = (ELEM.EFFICACY_MATRIX[rEl] && ELEM.EFFICACY_MATRIX[rEl][targetEl]) || 0.35;
        const sVal = kVal * rG[gKey] * (i === 0 ? 1.0 : 0.90);
        if (sVal > bestSupport) bestSupport = sVal;
      }
      const accessFactor = acc.unlocked ? (0.88 + (acc.affinity / 100) * 0.32) : 0.58;
      const score = 0.45 * accessFactor + 0.30 * bestSupport + 0.25 * (mEff / 100);
      const specRes = {
        element: targetEl,
        score: +score.toFixed(4),
        exactRootMatch: false,
        specialUnlocked: !!acc.unlocked,
        effectiveMastery: +mEff.toFixed(2),
        affinity: acc.affinity || 25
      };
      _ec.cap[capKey] = specRes;
      return specRes;
    }

    let bestRootFit = 0.25;
    let exactMatch = false;
    let matchedGrade = null;
    for (let i = 0; i < rootObj.elements.length; i++) {
      const rEl = rootObj.elements[i];
      const rGrade = rootObj.grades[i];
      const gf = ELEM.GRADE_FACTORS[rGrade] || ELEM.GRADE_FACTORS.MORTAL;
      const slotWeight = i === 0 ? 1.00 : i === 1 ? 0.92 : i === 2 ? 0.86 : 0.82;
      if (rEl === targetEl) {
        exactMatch = true;
        matchedGrade = rGrade;
        const fit = 1.00 * gf[gKey] * slotWeight;
        if (fit > bestRootFit) bestRootFit = fit;
      } else {
        const rel = mode === 'study'
          ? ((ELEM.LEARNING_GRAPH[rEl] && ELEM.LEARNING_GRAPH[rEl][targetEl]) || 0.20) * 0.85 + 0.25
          : ((ELEM.EFFICACY_MATRIX[rEl] && ELEM.EFFICACY_MATRIX[rEl][targetEl]) || 0.30);
        const fit = rel * gf[gKey] * slotWeight;
        if (fit > bestRootFit) bestRootFit = fit;
      }
    }

    const mEff = ELEM.effectiveMastery(npc, targetEl);
    const aff = HC.eff(npc, 'affinities.' + targetEl);
    const score = 0.55 * bestRootFit + 0.25 * (mEff / 100) + 0.20 * (aff / 100);
    const ordRes = {
      element: targetEl,
      score: +score.toFixed(4),
      exactRootMatch: exactMatch,
      matchedGrade,
      bestRootFit: +bestRootFit.toFixed(4),
      effectiveMastery: +mEff.toFixed(2),
      affinity: Math.round(aff)
    };
    _ec.cap[capKey] = ordRes;
    return ordRes;
  };

  function makeNeutralResult(context, mode) {
    return {
      valid: true,
      context,
      mode: mode || 'EXPLICIT_NON_ELEMENTAL',
      primaryElement: 'NEUTRAL',
      rawFit: 0.78,
      multiplier: 1.0,
      combatMultiplier: 1.0,
      damageMult: 1.0,
      qiCostMultiplier: 1.0,
      costMult: 1.0,
      cultivationMultiplier: 1.0,
      studySpeedMultiplier: 1.0,
      studySpeedMult: 1.0,
      masteryGainMultiplier: 1.0,
      breakthroughBonus: 0,
      backlashRiskDelta: 0,
      equipmentSynergyMultiplier: 1.0,
      equipmentSuitabilityMult: 1.0,
      craftingSuccessBonus: 0,
      craftSuccessBonus: 0,
      craftingQualityBonus: 0,
      craftQualityBonus: 0,
      accBonus: 0,
      controlChanceMult: 1.0,
      aiPreferenceScore: 0,
      score: 0,
      tier: 'NEUTRAL',
      reasonsTh: ['วิชา/อุปกรณ์ไร้ธาตุเฉพาะ (ใช้ได้เต็มประสิทธิภาพกับทุกรากวิญญาณ)'],
      perElement: {}
    };
  }

  const NEUTRAL_COMPAT_RESULT = Object.freeze({
    valid: true,
    context: "COMBAT_SKILL",
    mode: "EXPLICIT_NON_ELEMENTAL",
    element: "NEUTRAL",
    primaryElement: "NEUTRAL",
    rawFit: 0.78,
    score: 0,
    multiplier: 1.0,
    accBonus: 0,
    controlChanceMult: 1.0,
    combatMultiplier: 1.0,
    damageMult: 1.0,
    qiCostMultiplier: 1.0,
    costMult: 1.0,
    cultivationMultiplier: 1.0,
    cultivationMult: 1.0,
    studySpeedMultiplier: 1.0,
    studySpeedMult: 1.0,
    masteryGainMultiplier: 1.0,
    masteryGainMult: 1.0,
    breakthroughBonus: 0,
    breakthroughDelta: 0,
    backlashRiskDelta: 0,
    equipmentSynergyMultiplier: 1.0,
    equipmentSuitabilityMult: 1.0,
    craftingSuccessBonus: 0,
    craftSuccessBonus: 0,
    craftingQualityBonus: 0,
    craftQualityBonus: 0,
    aiPreferenceScore: 0,
    tier: "NEUTRAL",
    labelTh: "ไร้ข้อจำกัดธาตุ",
    tierTh: "ไร้ข้อจำกัดธาตุ",
    reasonsTh: Object.freeze(["วิชา/อุปกรณ์ไร้ธาตุเฉพาะ (ใช้ได้เต็มประสิทธิภาพกับทุกรากวิญญาณ)"]),
    perElement: Object.freeze({})
  });

  ELEM.resolveCompatibility = (npc, targetDef, context) => {
    context = context || 'COMBAT_SKILL';
    if (!npc || npc.foe || !npc.h) {
      return makeNeutralResult(context, 'EXPLICIT_NON_ELEMENTAL');
    }

    const prof = ELEM.getProfile(targetDef);
    if (prof.valid && (prof.mode === "EXPLICIT_NON_ELEMENTAL" || prof.mode === "ROOT_AGNOSTIC_UTILITY" || prof.primary === "NEUTRAL")) return NEUTRAL_COMPAT_RESULT;
    ELEM.ensureNpc(npc);
    const _ec = getNpcCache(npc);
    const targetKey = (typeof targetDef === "string") ? targetDef : (targetDef && (targetDef.id || targetDef.sub || targetDef.outItemId || targetDef.key || targetDef.nameTh)) || null;
    if (targetKey) {
      const hit = _ec.compat[targetKey + ":" + context];
      if (hit) return hit;
    }
    if (!prof.valid) {
      return {
        valid: false,
        error: prof.error || 'Invalid elemental profile',
        context,
        mode: 'UNKNOWN',
        primaryElement: 'UNKNOWN',
        rawFit: 0,
        multiplier: 0.65,
        combatMultiplier: 0.65,
        damageMult: 0.65,
        qiCostMultiplier: 1.30,
        costMult: 1.30,
        cultivationMultiplier: 0.60,
        studySpeedMultiplier: 0.55,
        studySpeedMult: 0.55,
        masteryGainMultiplier: 0.60,
        breakthroughBonus: -0.08,
        backlashRiskDelta: 0.18,
        equipmentSynergyMultiplier: 0.82,
        equipmentSuitabilityMult: 0.82,
        craftingSuccessBonus: -0.06,
        craftSuccessBonus: -0.06,
        craftingQualityBonus: -0.05,
        craftQualityBonus: -0.05,
        accBonus: -4,
        controlChanceMult: 0.85,
        aiPreferenceScore: -35,
        score: -35,
        tier: 'CLASH',
        reasonsTh: ['ข้อมูลธาตุไม่ถูกต้อง (' + (prof.error || 'UNKNOWN') + ')'],
        perElement: {}
      };
    }

    if (prof.mode === 'EXPLICIT_NON_ELEMENTAL' || prof.mode === 'ROOT_AGNOSTIC_UTILITY' || prof.primary === 'NEUTRAL') {
      return makeNeutralResult(context, prof.mode);
    }

    const weights = prof.weights || { [prof.primary]: 1.0 };
    const entries = Object.entries(weights);
    const perElement = {};
    let rCombat = 0, rCult = 0, rStudy = 0;
    let exactMatchedCount = 0;

    for (const [el, w] of entries) {
      const cComb = ELEM.elementCapability(npc, el, 'combat');
      const cCult = ELEM.elementCapability(npc, el, 'cult');
      const cStud = ELEM.elementCapability(npc, el, 'study');
      perElement[el] = {
        weight: w,
        combatCap: cComb.score,
        cultCap: cCult.score,
        studyCap: cStud.score,
        exactRootMatch: cComb.exactRootMatch,
        matchedGrade: cComb.matchedGrade,
        effectiveMastery: cComb.effectiveMastery,
        affinity: cComb.affinity
      };
      rCombat += w * cComb.score;
      rCult += w * cCult.score;
      rStudy += w * cStud.score;
      if (ELEM.isValidOrdinaryElement(el)) {
        if (cComb.exactRootMatch) exactMatchedCount++;
      } else if (ELEM.isValidSpecialElement(el) && cComb.specialUnlocked) {
        exactMatchedCount++;
      }
    }

    let covBonus = 0;
    if (entries.length >= 2) {
      const covRatio = exactMatchedCount / Math.max(1, entries.length);
      if (covRatio >= 0.99) covBonus = 0.08 + Math.min(0.04, (entries.length - 2) * 0.02);
      else if (covRatio >= 0.50) covBonus = 0.03;
      else if (exactMatchedCount === 0) covBonus = -0.05;
    } else if (entries.length === 1 && npc.h.root.rootCount === 1 && exactMatchedCount === 1) {
      covBonus = 0.05;
    }

    rCombat = clamp(rCombat + covBonus, 0.20, 1.45);
    rCult = clamp(rCult + covBonus, 0.20, 1.50);
    rStudy = clamp(rStudy + covBonus, 0.20, 1.50);

    const ctxNorm = String(context || '').toUpperCase();
    const isStudyCtx = ctxNorm === 'TECH_STUDY' || ctxNorm === 'LEARNING' || ctxNorm === 'EXPERIMENT' || ctxNorm === 'CRAFTING';
    const isCultCtx = ctxNorm === 'CULTIVATION' || ctxNorm === 'CULTIVATION_TICK' || ctxNorm === 'MANTRA_PRACTICE' || ctxNorm === 'BREAKTHROUGH' || ctxNorm === 'PATH_SELECT' || ctxNorm === 'SUBPATH_SELECT' || ctxNorm === 'PATHCHOICE';
    const isEquipmentCtx = ctxNorm === 'EQUIPMENT' || ctxNorm === 'GEAR';

    const activeFit = isStudyCtx ? rStudy : isCultCtx ? rCult : rCombat;

    const combatMultiplier = +clamp(0.65 + 0.65 * ((rCombat - 0.30) / 0.85), 0.65, 1.35).toFixed(4);
    const qiCostMultiplier = +clamp(1.22 - 0.36 * ((rCombat - 0.30) / 0.85), 0.78, 1.30).toFixed(4);
    const cultivationMultiplier = +clamp(0.60 + 0.75 * ((rCult - 0.30) / 0.85), 0.60, 1.45).toFixed(4);
    const studySpeedMultiplier = +clamp(0.55 + 0.85 * ((rStudy - 0.30) / 0.85), 0.55, 1.50).toFixed(4);
    const masteryGainMultiplier = +clamp(0.60 + 0.75 * ((rStudy - 0.30) / 0.85), 0.60, 1.45).toFixed(4);
    const breakthroughBonus = +clamp((rCult - 0.68) * 0.18, -0.08, 0.12).toFixed(4);
    const backlashRiskDelta = +clamp(rCult < 0.52 ? (0.52 - rCult) * 0.45 : 0, 0, 0.18).toFixed(4);
    const equipmentSynergyMultiplier = +clamp(0.82 + 0.36 * ((rCombat - 0.30) / 0.85), 0.82, 1.22).toFixed(4);
    const craftingSuccessBonus = +clamp((rStudy - 0.62) * 0.18, -0.06, 0.12).toFixed(4);
    const craftingQualityBonus = +clamp((rStudy - 0.62) * 0.20, -0.05, 0.15).toFixed(4);
    const accBonus = +clamp((rCombat - 0.65) * 12, -4, 8).toFixed(2);
    const controlChanceMult = +clamp(0.88 + (rCombat - 0.45) * 0.35, 0.85, 1.18).toFixed(4);
    const aiPreferenceScore = +clamp((activeFit - 0.68) * 68, -35, 45).toFixed(2);
    const multiplier = isStudyCtx ? studySpeedMultiplier : isCultCtx ? cultivationMultiplier : isEquipmentCtx ? equipmentSynergyMultiplier : combatMultiplier;

    let tier = 'NEUTRAL';
    if (activeFit >= 0.92) tier = 'EXCELLENT';
    else if (activeFit >= 0.76) tier = 'GOOD';
    else if (activeFit >= 0.58) tier = 'NEUTRAL';
    else if (activeFit >= 0.44) tier = 'POOR';
    else tier = 'CLASH';

    const reasonsTh = [];
    const pMeta = ELEM.META[prof.primary] || { nameTh: prof.primary };
    if (exactMatchedCount > 0) {
      if (entries.length > 1 && exactMatchedCount >= 2) {
        reasonsTh.push('รากวิญญาณรองรับหลายธาตุตรงสาย (' + exactMatchedCount + '/' + entries.length + ' ธาตุ)');
      } else {
        reasonsTh.push('รากวิญญาณตรงกับ' + pMeta.nameTh + 'โดยตรง');
      }
    } else if (activeFit >= 0.76) {
      reasonsTh.push('ธาตุเกื้อหนุนกับ' + pMeta.nameTh + 'ได้ดี');
    } else if (activeFit < 0.52) {
      reasonsTh.push('ธาตุขัดแย้งกับ' + pMeta.nameTh + ' (ลดประสิทธิภาพและสิ้นเปลืองปราณ)');
    } else {
      reasonsTh.push('ความเข้ากันได้กับ' + pMeta.nameTh + 'อยู่ในระดับปานกลาง');
    }

    const resultObj = {
      valid: true,
      context,
      mode: prof.mode,
      primaryElement: prof.primary,
      compositeTag: prof.compositeTag || null,
      rawFit: +activeFit.toFixed(4),
      multiplier,
      combatMultiplier,
      damageMult: combatMultiplier,
      qiCostMultiplier,
      costMult: qiCostMultiplier,
      cultivationMultiplier,
      studySpeedMultiplier,
      studySpeedMult: studySpeedMultiplier,
      masteryGainMultiplier,
      breakthroughBonus,
      backlashRiskDelta,
      equipmentSynergyMultiplier,
      equipmentSuitabilityMult: equipmentSynergyMultiplier,
      craftingSuccessBonus,
      craftSuccessBonus: craftingSuccessBonus,
      craftingQualityBonus,
      craftQualityBonus: craftingQualityBonus,
      accBonus,
      controlChanceMult,
      aiPreferenceScore,
      score: aiPreferenceScore,
      coverageBonus: +covBonus.toFixed(4),
      tier,
      reasonsTh,
      perElement
    };
    if (targetKey) {
      _ec.compat[targetKey + ":" + context] = resultObj;
    }
    return resultObj;
  };

  ELEM.explainCompatibility = (npc, targetDef, context) => {
    const res = ELEM.resolveCompatibility(npc, targetDef, context);
    const tierTh = {
      EXCELLENT: 'สอดคล้องเลิศล้ำ',
      GOOD: 'เกื้อหนุนดี',
      NEUTRAL: 'ปานกลาง',
      POOR: 'ฝืนชีพจร',
      CLASH: 'ธาตุขัดแย้งรุนแรง'
    }[res.tier] || 'ปานกลาง';
    const elMeta = ELEM.META[res.primaryElement] || ELEM.META.NEUTRAL;
    return Object.assign({}, res, {
      tierTh,
      elementNameTh: elMeta.nameTh,
      elementShortTh: elMeta.shortTh,
      elementIcon: elMeta.icon,
      summaryTh: elMeta.icon + ' ' + elMeta.shortTh + ' · ' + tierTh + ' (×' + (Number.isFinite(res.multiplier) ? res.multiplier : res.combatMultiplier).toFixed(2) + ')'
    });
  };

  ELEM.combatElementalMatchup = (attacker, defender, attackDef) => {
    const atkProf = ELEM.getProfile(attackDef);
    if (!atkProf.valid || atkProf.primary === 'NEUTRAL') return 1.0;
    let defEl = 'NEUTRAL';
    if (defender) {
      if (defender.foe) {
        const sp = JD.BEASTS && JD.BEASTS.species && JD.BEASTS.species.find(s => s.id === defender.speciesId || s.nameTh === defender.name);
        if (sp && sp.element) defEl = sp.element;
      } else if (defender.cult) {
        const m = defender.cult.mantra && CULT.tech(defender.cult.mantra);
        const sub = CULT.subInfo(defender.cult.path, defender.cult.sub);
        defEl = (m && m.element && m.element !== 'NEUTRAL') ? m.element : (sub && sub.element) || (defender.h && defender.h.root && defender.h.root.primaryElement) || 'NEUTRAL';
      } else if (defender.h && defender.h.root) {
        defEl = defender.h.root.primaryElement || 'NEUTRAL';
      }
    }
    if (!defEl || defEl === 'NEUTRAL') return 1.0;
    // Multi-element techniques must use their declared profile weights in the
    // tactical matchup; using only `primary` silently discarded every secondary element.
    const weights = atkProf.weights || { [atkProf.primary]: 1.0 };
    let weighted = 0, totalWeight = 0;
    for (const [atkEl, rawWeight] of Object.entries(weights)) {
      const weight = Number(rawWeight);
      if (!Number.isFinite(weight) || weight <= 0) continue;
      const row = ELEM.COUNTER_MATRIX[atkEl];
      const value = row && Number.isFinite(row[defEl]) ? row[defEl] : 1.0;
      weighted += weight * value;
      totalWeight += weight;
    }
    return totalWeight > 0 ? weighted / totalWeight : 1.0;
  };

  ELEM.resolveCombatInteraction = (attacker, defender, skillOrTech) => {
    const tDef = (skillOrTech && skillOrTech.tech && CULT.tech(skillOrTech.tech)) || skillOrTech;
    const attackerCompat = ELEM.resolveCompatibility(attacker, tDef, 'COMBAT_SKILL');
    const targetCounterMult = ELEM.combatElementalMatchup(attacker, defender, tDef);

    // Weapon resonance is a weighted interaction between every declared weapon
    // element and every technique element. A primary-element-only comparison
    // silently discarded composite techniques and composite weapons.
    let weaponResonance = 1.0;
    const wpn = attacker && attacker.equip && attacker.equip.WEAPON;
    const weaponProfile = wpn ? ELEM.getProfile(wpn) : null;
    const skillProfile = tDef ? ELEM.getProfile(tDef) : null;
    const isResonantProfile = profile => !!profile && profile.valid && profile.primary !== 'NEUTRAL'
      && !['ELEMENT_LINK_ONLY', 'EXPLICIT_NON_ELEMENTAL', 'ROOT_AGNOSTIC_UTILITY'].includes(profile.mode);
    const normalizedWeights = profile => {
      const raw = profile.weights || { [profile.primary]: 1 };
      const pairs = Object.entries(raw)
        .map(([element, weight]) => [element, Number(weight)])
        .filter(([element, weight]) => (ELEM.isValidOrdinaryElement(element) || ELEM.isValidSpecialElement(element))
          && Number.isFinite(weight) && weight > 0);
      const total = pairs.reduce((sum, pair) => sum + pair[1], 0);
      return total > 0 ? pairs.map(([element, weight]) => [element, weight / total]) : [[profile.primary, 1]];
    };
    if (isResonantProfile(weaponProfile) && isResonantProfile(skillProfile)) {
      const relationMultiplier = (weaponElement, skillElement) => {
        if (weaponElement === skillElement) return 1.06;
        const raw = ELEM.EFFICACY_MATRIX[weaponElement] && ELEM.EFFICACY_MATRIX[weaponElement][skillElement];
        const efficacy = Number.isFinite(raw) ? raw : 0.5;
        if (efficacy >= 0.72) return 1.03;
        if (efficacy <= 0.28) return 0.95;
        return 1.0;
      };
      const weaponWeights = normalizedWeights(weaponProfile);
      const techniqueWeights = normalizedWeights(skillProfile);
      let weightedResonance = 0, totalWeight = 0;
      for (const [weaponElement, weaponWeight] of weaponWeights) {
        for (const [skillElement, skillWeight] of techniqueWeights) {
          const pairWeight = weaponWeight * skillWeight;
          weightedResonance += relationMultiplier(weaponElement, skillElement) * pairWeight;
          totalWeight += pairWeight;
        }
      }
      if (totalWeight > 0) {
        weaponResonance = +clamp(weightedResonance / totalWeight, 0.95, 1.06).toFixed(4);
      }
    }

    const counterRelation = targetCounterMult >= 1.04 ? 'COUNTER_ADVANTAGE' : targetCounterMult <= 0.96 ? 'RESISTED' : 'NEUTRAL';
    // Elemental counters also influence control reliability, but at half strength
    // so a damage advantage does not become a guaranteed stun/silence.
    const targetControlFactor = clamp(1 + (targetCounterMult - 1) * 0.5, 0.90, 1.10);
    const controlChanceMult = +clamp((attackerCompat.controlChanceMult || 1) * targetControlFactor, 0.75, 1.25).toFixed(4);
    const totalDamageMult = +clamp(attackerCompat.combatMultiplier * weaponResonance * targetCounterMult, 0.58, 1.52).toFixed(4);
    return {
      attackerCompat,
      weaponResonance,
      targetCounterMult,
      targetControlFactor: +targetControlFactor.toFixed(4),
      counterRelation,
      totalDamageMult,
      damageMult: totalDamageMult,
      costMult: attackerCompat.qiCostMultiplier,
      accBonus: attackerCompat.accBonus,
      controlChanceMult
    };
  };

  /* ---------- Wire Option A Root-Capacity Traits & Zero-RNG-Shift HC.generate Wrapper ---------- */
  if (HC) {
    const origTraitDef = HC.traitDef;
    HC.traitDef = id => {
      const d = origTraitDef ? origTraitDef(id) : null;
      if (d) return d;
      return (JD.CORE && JD.CORE.rootCapacityTraits && JD.CORE.rootCapacityTraits[id]) || null;
    };
    const origTraitMods = HC.traitMods;
    HC.traitMods = (id, lv) => {
      if (JD.CORE && JD.CORE.rootCapacityTraits && JD.CORE.rootCapacityTraits[id]) {
        return [];
      }
      return origTraitMods ? origTraitMods(id, lv) : [];
    };
    const origGenerate = HC.generate;
    HC.generate = (rng, opts) => {
      const npc = origGenerate(rng, opts);
      const rootSeed = 'hc_birth_root:' + npc.h.genome + ':' + npc.h.birthDay + ':' + ((opts && opts.id) || '');
      const rootRng = new U.RNG(rootSeed);
      const explicitGrade = (opts && opts.explicitRootGrade) || (opts && opts.rootGrade && !opts._fromTierRoll && !opts.fromApplicant ? opts.rootGrade : null);
      npc.h.root = ELEM.rollBirthRoots(rootRng, {
        customRoots: opts && opts.customRoots,
        forceRootCount: opts && opts.forceRootCount,
        forceElements: opts && opts.forceElements,
        forceGrades: opts && opts.forceGrades,
        explicitRootGrade: explicitGrade
      });
      ELEM.ensureNpc(npc);
      npc._c = null;
      npc._d = null;
      npc.h.state.hp = HC.derived(npc).hpMax;
      return npc;
    };
  }

  /* =========================================================================
   * 1) ระบบวิถีบำเพ็ญ (CULTIVATION SYSTEM)
   * ========================================================================= */
  const CULT = {};
  CULT.ELEM = ELEM;
  g.ELEM = ELEM;
  g.ELEMENTAL = ELEM;

  CULT.PATHS = JD.CULT.paths;
  CULT.THRESH = {
    XIAN: [260, 700, 1800, 4500, 11000, 27000, 65000, 150000],
    BODY: [230, 800, 3200, 12000],
    GOD: [300, 1200, 5200],
    DEMON: [240, 650, 1680, 4200, 10400, 25500, 61500, 142000],
    HEART_SOUL: [250, 680, 1750, 4400, 10800, 26500, 63500, 146000]
  };
  const SUBPREF = {
    SWORD_IMMORTAL: { aff: { SWORD: 1, MOVEMENT: .5 }, p: { 'personality.courage': .4, 'values.martialPeak': .4 } },
    FIVE_ELEMENTS: { aff: { FIRE: .4, WATER_ICE: .4, WOOD_LIFE: .4, EARTH_METAL: .4, LIGHTNING: .3 }, p: { 'personality.rationality': .4 } },
    ELIXIR_DAO: { aff: { ALCHEMY: 1, MEDICINE: .6 }, p: { 'values.knowledgeCraft': .5, 'intellect.comprehension': .3 } },
    ASTRAL_ARRAY: { aff: { ARRAY: 1, TALISMAN: .6 }, p: { 'intellect.spatial': .5, 'intellect.planning': .3 } },
    BLOOD_DEMON: { aff: { POISON: .5, YIN_SHADOW: .4 }, p: { 'personality.aggression': .6, 'values.powerStatus': .4, 'personality.integrity': -.5, 'personality.empathy': -.4 } },
    PHANTOM_SOUL: { aff: { YIN_SHADOW: 1, SOUL_DIVINE: .5 }, p: { 'social.deception': .4, 'intellect.intuition': .3 } },
    TIME_VOID: { aff: { SCRIPTURE: .6, ARRAY: .4, MOVEMENT: .4 }, p: { 'intellect.comprehension': .6, 'intellect.reasoning': .4 } },
    SOUND_ZITHER: { aff: { SOUL_DIVINE: .4, WIND: .5 }, p: { 'interests.arts': .7, 'personality.empathy': .3 } },
    YIN_YANG_HARMONY: { aff: { YIN_SHADOW: .4, LIGHT_YANG: .4 }, p: { 'personality.composure': .6, 'intellect.wisdom': .4 } },
    TIGER_SOVEREIGN: { aff: { FIST_PALM: .7, BEAST_TAMING: .3 }, p: { 'physiology.strength': .6, 'personality.aggression': .4 } },
    BLOOD_DRAGON: { aff: { FIRE: .5, BODY_REFINING: .6 }, p: { 'physiology.vitality': .6, 'personality.courage': .4 } },
    VAJRA_BODHI: { aff: { BODY_REFINING: .6, SOUL_DIVINE: .5 }, p: { 'personality.discipline': .6, 'physiology.toughness': .4 } },
    DEVOURING_FIEND: { aff: { BODY_REFINING: .5, POISON: .3 }, p: { 'personality.aggression': .5, 'personality.integrity': -.4, 'physiology.immunity': .4 } },
    SOLAR_FORGE: { aff: { FORGING: .8, FIRE: .6, LIGHT_YANG: .4 }, p: { 'interests.forging': .5 } },
    THUNDER_BODY: { aff: { LIGHTNING: 1, BODY_REFINING: .5 }, p: { 'physiology.reflex': .4, 'temperament.sensationSeeking': .4 } },
    JADE_IMMORTAL_BODY: { aff: { WOOD_LIFE: .8, MEDICINE: .4 }, p: { 'physiology.recoveryRate': .6, 'physiology.flexibility': .3 } },
    TITAN_MOUNTAIN_BODY: { aff: { EARTH_METAL: .8, BODY_REFINING: .6 }, p: { 'physiology.toughness': .6, 'physiology.endurance': .4 } },
    WAR_DEITY: { aff: { SPEAR: .5, BLADE: .4 }, p: { 'social.leadership': .6, 'personality.courage': .5, 'aptitudes.command': .5 } },
    MERCY_DEITY: { aff: { MEDICINE: .7, SOUL_DIVINE: .5 }, p: { 'personality.empathy': .8, 'social.hospitality': .4 } },
    FATE_ORACLE: { aff: { SCRIPTURE: .6, SOUL_DIVINE: .5 }, p: { 'intellect.intuition': .6, 'destiny.luck': .4 } },
    TOTEM_BEAST_GOD: { aff: { BEAST_TAMING: 1 }, p: { 'interests.beasts': .6, 'personality.courage': .3 } },
    UNDERWORLD_JUDGE: { aff: { YIN_SHADOW: .6, SOUL_DIVINE: .4 }, p: { 'personality.integrity': .6, 'personality.discipline': .4, 'social.intimidation': .4 } },
    OCEAN_SOVEREIGN: { aff: { WATER_ICE: 1 }, p: { 'social.charisma': .4, 'temperament.optimism': .3 } },
    HARVEST_EARTH_GOD: { aff: { WOOD_LIFE: .6, EARTH_METAL: .4 }, p: { 'social.hospitality': .6, 'interests.herbs': .5 } },
    SHADOW_ASSASSIN: { aff: { YIN_SHADOW: 1, MOVEMENT: .7, BLADE: .5 }, p: { 'physiology.agility': .6, 'social.deception': .4, 'personality.caution': .3 } },
    VENOM_GU_SOVEREIGN: { aff: { POISON: 1, ALCHEMY: .7, WOOD_LIFE: .4 }, p: { 'intellect.inventiveness': .5, 'physiology.immunity': .5, 'personality.empathy': -.3 } },
    NETHER_GHOST_KING: { aff: { YIN_SHADOW: .9, SOUL_DIVINE: .7, WATER_ICE: .4 }, p: { 'personality.composure': .5, 'social.intimidation': .5, 'personality.ambition': .4 } },
    HEAVEN_DEVOURING_DEMON: { aff: { FIST_PALM: .7, FIRE: .5, YIN_SHADOW: .6 }, p: { 'personality.ambition': .7, 'personality.aggression': .6, 'values.powerStatus': .5, 'personality.integrity': -.4 } },
    ZEN_VOID_MIND: { aff: { SOUL_DIVINE: .8, SCRIPTURE: .7, LIGHT_YANG: .4 }, p: { 'personality.composure': .8, 'intellect.wisdom': .6, 'personality.empathy': .4, 'personality.aggression': -.4 } },
    CALLIGRAPHY_PAINTING_SAGE: { aff: { SCRIPTURE: .9, TALISMAN: .7, ARRAY: .6 }, p: { 'intellect.comprehension': .7, 'interests.arts': .7, 'personality.creativity': .5 } },
    DREAM_ILLUSION_WEAVER: { aff: { SOUL_DIVINE: .8, YIN_SHADOW: .5, WIND: .4 }, p: { 'intellect.intuition': .7, 'personality.creativity': .6, 'personality.curiosity': .5 } },
    MIND_SWORD_TELEKINESIS: { aff: { SWORD: .9, SOUL_DIVINE: .8, ASTRAL: .4 }, p: { 'intellect.focus': .8, 'intellect.willpower': .6, 'values.martialPeak': .5 } }
  };
  CULT.subList = [];
  Object.keys(CULT.PATHS).forEach(pid => CULT.PATHS[pid].subPaths.forEach(s => CULT.subList.push({ path: pid, sub: s })));

  function pval(npc, path) {
    if (path === 'destiny.luck') return npc.h.destiny.luck;
    return HC.eff(npc, path);
  }
  /** คะแนนความอยากเดินสายย่อย (ทำไมคนนี้เลือกวิถีนี้ — อธิบายได้ รวมรากวิญญาณและธาตุ) */
  CULT.pathScores = (npc, bias) => {
    ELEM.ensureNpc(npc);
    const out = [];
    const body = (HC.eff(npc, 'physiology.strength') + HC.eff(npc, 'physiology.toughness') + HC.eff(npc, 'physiology.endurance')) / 3;
    const qi = (HC.eff(npc, 'physiology.meridianCapacity') + HC.eff(npc, 'physiology.spiritualFoundation') + HC.eff(npc, 'intellect.comprehension')) / 3;
    const faith = (HC.eff(npc, 'social.charisma') + HC.eff(npc, 'intellect.willpower') + HC.eff(npc, 'interests.worship') + HC.eff(npc, 'affinities.SOUL_DIVINE')) / 4;
    const demon = (HC.eff(npc, 'personality.ambition') + HC.eff(npc, 'personality.aggression') + HC.eff(npc, 'values.powerStatus') + HC.eff(npc, 'affinities.YIN_SHADOW') + HC.eff(npc, 'affinities.POISON')) / 5;
    const soul = (HC.eff(npc, 'intellect.comprehension') + HC.eff(npc, 'intellect.intuition') + HC.eff(npc, 'personality.composure') + HC.eff(npc, 'affinities.SOUL_DIVINE') + HC.eff(npc, 'affinities.SCRIPTURE')) / 5;
    const base = {
      XIAN: qi * 0.7 + HC.eff(npc, 'aptitudes.cultivation') * 0.5 + 8,
      BODY: body * 0.8 + HC.eff(npc, 'interests.combat') * 0.4 + HC.eff(npc, 'physiology.vitality') * 0.2 - 6,
      GOD: faith * 0.8 + HC.eff(npc, 'personality.empathy') * 0.2 - 5,
      DEMON: demon * 0.85 + HC.eff(npc, 'aptitudes.combat') * 0.35 + (55 - HC.eff(npc, 'personality.integrity')) * 0.25 - 6,
      HEART_SOUL: soul * 0.85 + HC.eff(npc, 'aptitudes.comprehension') * 0.4 + HC.eff(npc, 'interests.meditation') * 0.2 - 5
    };
    const rootCount = (npc.h && npc.h.root && npc.h.root.rootCount) || 1;
    CULT.subList.forEach(({ path, sub }) => {
      const pref = SUBPREF[sub.id] || (JD.EXPANSION.subPreferences || {})[sub.id] || (JD.MARTIAL.subPreferences || {})[sub.id] || { aff: {}, p: {} };
      let s = base[path] || 0;
      Object.keys(pref.aff).forEach(k => { s += (HC.eff(npc, 'affinities.' + k) - 30) * pref.aff[k] * 0.45; });
      Object.keys(pref.p).forEach(k => { const w = pref.p[k]; s += (w >= 0 ? pval(npc, k) - 50 : 50 - pval(npc, k)) * Math.abs(w) * 0.4; });
      const elemComp = ELEM.resolveCompatibility(npc, sub, 'SUBPATH_SELECT');
      let elemScore = elemComp.aiPreferenceScore * 0.28;
      if (sub.id === 'FIVE_ELEMENTS' && rootCount >= 3) elemScore += (rootCount - 2) * 5.5;
      else if (sub.id === 'YIN_YANG_HARMONY' && rootCount >= 2 && npc.h.root.elements.includes('LIGHT_YANG') && npc.h.root.elements.includes('YIN_SHADOW')) elemScore += 7.5;
      s += elemScore;
      if (bias && bias[sub.id]) s += bias[sub.id];
      if (g.MARTIAL && g.MARTIAL.pathSkillAffinity) s += g.MARTIAL.pathSkillAffinity(npc, path, sub.id);
      out.push({ path, sub: sub.id, score: s, elemScore: +elemScore.toFixed(2), elemTier: elemComp.tier });
    });
    return out.sort((a, b) => b.score - a.score);
  };
  CULT.choosePath = (npc, rng, bias) => {
    const sc = CULT.pathScores(npc, bias);
    const top = sc.slice(0, 6);
    const pick = rng.weighted(top, x => Math.exp((x.score - top[0].score) / 7));
    return pick;
  };
  CULT.BASE_SUB = Object.freeze({ id: 'NONE', nameTh: 'พื้นฐาน (ยังไม่เลือกสายย่อย)', combatBonus: 1, defenseBonus: 1, breakthroughMod: 1, cultivationBonus: 1 });
  CULT.subInfo = (path, sub) => (CULT.PATHS[path] && CULT.PATHS[path].subPaths.find(s => s.id === sub)) || CULT.BASE_SUB;
  CULT.stageInfo = (npc) => {
    const c = npc.cult; if (!c) return { nameTh: 'ปุถุชน (ยังไม่เปิดเส้นลมปราณ)', stage: 0, lifespanMax: 70, combatPower: 25, breakthroughBaseChance: 1 };
    const stArr = CULT.PATHS[c.path].stages;
    return stArr[Math.min(stArr.length - 1, Math.max(0, (c.stage || 1) - 1))];
  };
  CULT.stageName = npc => {
    if (!npc.cult) return 'ปุถุชน';
    const stArr = CULT.PATHS[npc.cult.path].stages;
    const stObj = stArr[Math.min(stArr.length - 1, Math.max(0, (npc.cult.stage || 1) - 1))];
    return CULT.PATHS[npc.cult.path].shortTh + ' · ' + stObj.nameTh.replace(/^ขั้นที่ \d+ • /, '') + ' (' + npc.cult.stage + ')';
  };
  CULT.maxStage = npc => npc.cult ? CULT.PATHS[npc.cult.path].maxStage : 0;
  CULT.normalizedStage = npc => {
    if (!npc || !npc.cult) return 0;
    const c = npc.cult, st = Math.max(1, c.stage || 1);
    if (c.path === "BODY") return [1, 2.5, 4.5, 6.8, 9][Math.min(4, st - 1)] || st;
    if (c.path === "GOD") return [1, 3.2, 6.2, 9][Math.min(3, st - 1)] || st;
    return st;
  };
  CULT.effectiveTechStage = npc => {
    if (!npc || !npc.cult) return 0;
    const c = npc.cult, st = Math.max(1, c.stage || 1);
    const trOrd = (c.track && c.track.ordinal) ? c.track.ordinal : 0;
    let mapped = st;
    if (c.path === "BODY") mapped = [1, 2, 4, 6, 7][Math.min(4, st - 1)] || st;
    else if (c.path === "GOD") mapped = [1, 3, 5, 7][Math.min(3, st - 1)] || st;
    return Math.max(st, mapped, trOrd);
  };
  CULT.worldRankFromRaw = raw => {
    if (!Number.isFinite(raw) || raw <= 0) return 0;
    const floor = Math.floor(raw);
    const frac = raw - floor;
    const roundUp = (frac > 0.75) ? 1 : 0;
    return Math.max(1, Math.min(4, floor + roundUp));
  };
  CULT.worldRank = npc => {
    if (!npc || !npc.cult || !npc.cult.path || npc.cult.path === 'NONE') return 0;
    const pathDef = CULT.PATHS[npc.cult.path];
    if (!pathDef || !pathDef.stages || !pathDef.stages.length) return 0;
    const S = pathDef.stages.length;
    const s = Math.max(1, Math.min(S, Math.floor(npc.cult.stage || 1)));
    if (S <= 1) return 1;
    const num = (S - 1) + 3 * (s - 1);
    const den = S - 1;
    const quotient = Math.floor(num / den);
    const rem = num % den;
    const roundUp = (rem * 4 > den * 3) ? 1 : 0;
    return Math.max(1, Math.min(4, quotient + roundUp));
  };
  CULT.threshold = npc => { const c = npc.cult; if (!c) return 0; const t = CULT.THRESH[c.path][c.stage - 1]; return t == null ? Infinity : t; };
  CULT.lifespan = npc => {
    const c = npc.cult; if (!c) return Math.round(HC.mortalLifespan(npc));
    let life = CULT.PATHS[c.path].stages[c.stage - 1].lifespanMax + (c.lifeBonus || 0);
    if (c.track) {
      const trRealm = CULT.trackRealm(npc);
      if (trRealm && trRealm.lifespanMax > life) life = trRealm.lifespanMax + (c.lifeBonus || 0);
    }
    return life;
  };
  CULT.refreshLifespan = npc => { npc.lifespanMax = CULT.lifespan(npc); HC.touch(npc); };
  CULT.hpMult = npc => {
    if (!npc || !npc.cult) return 1;
    const ns = CULT.normalizedStage(npc);
    const pathAdd = npc.cult.path === "BODY" ? 0.09 * (ns - 1) : npc.cult.path === "GOD" ? 0.11 * (ns - 1) : 0;
    return 1 + 0.42 * (ns - 1) + 0.25 + pathAdd;
  };
  CULT.hpMax = npc => {
    const c = npc.cult, cPath = c ? c.path : '', cSub = c ? c.sub : '', cSt = c ? c.stage : 0, cTr = c && c.track ? c.track.ordinal : 0, hc = npc._hpMaxCache;
    if (hc && hc.day === HC.nowDay && hc.ver === npc._ver && hc.pver === (npc._passVer || 0) && hc.path === cPath && hc.sub === cSub && hc.st === cSt && hc.tr === cTr) return hc.val;
    const val = Math.round((g.MARTIAL ? g.MARTIAL.derived(npc) : HC.derived(npc)).hpMax * CULT.hpMult(npc));
    npc._hpMaxCache = { day: HC.nowDay, ver: npc._ver, pver: npc._passVer || 0, path: cPath, sub: cSub, st: cSt, tr: cTr, val };
    return val;
  };

  const TECH_BY_ID = {}, MOVE_PARENT_BY_ID = {};
  JD.TECH.techniques.forEach(t => { TECH_BY_ID[t.id] = t; if (Array.isArray(t.moveDefs)) t.moveDefs.forEach(m => { MOVE_PARENT_BY_ID[m.id] = t; }); });
  JD.TECH.mantras.forEach(t => { TECH_BY_ID[t.id] = t; if (Array.isArray(t.moveDefs)) t.moveDefs.forEach(m => { MOVE_PARENT_BY_ID[m.id] = t; }); });
  CULT.tech = id => TECH_BY_ID[id] || MOVE_PARENT_BY_ID[id];

  CULT.qiMax = npc => {
    if (!npc || !npc.cult) return 0;
    const c = npc.cult, qc = npc._qiMaxCache;
    if (qc && qc.cult === c && qc.path === c.path && qc.sub === c.sub && qc.st === c.stage && qc.mantra === c.mantra && qc.ver === npc._ver && qc.pver === (npc._passVer || 0)) return qc.val;
    const ns = CULT.normalizedStage(npc);
    const base = (40 + (g.MARTIAL ? g.MARTIAL.eff(npc, 'physiology.meridianCapacity') : HC.eff(npc, 'physiology.meridianCapacity')) * 0.9) * (1 + 0.5 * (ns - 1));
    const pass = g.MARTIAL && g.MARTIAL.passiveStats ? g.MARTIAL.passiveStats(npc) : null;
    const inn = g.MARTIAL && g.MARTIAL.innateStats ? g.MARTIAL.innateStats(npc) : null;
    const m = c.mantra ? TECH_BY_ID[c.mantra] : null;
    const pct = (pass ? (pass.qiMaxPct || 0) : 0) + (inn ? (inn.qiMaxPct || 0) : 0) + (m && m.mantraBonus && m.mantraBonus.qiMaxPct ? m.mantraBonus.qiMaxPct : 0);
    const flat = (pass ? (pass.qiMaxFlat || 0) : 0) + (inn ? (inn.qiMaxFlat || 0) : 0);
    const val = Math.max(1, Math.round(base * (1 + pct) + flat));
    npc._qiMaxCache = { cult: c, path: c.path, sub: c.sub, st: c.stage, mantra: c.mantra, ver: npc._ver, pver: npc._passVer || 0, val };
    return val;
  };
  CULT.speedMult = npc => npc.cult ? 1 + 0.05 * (npc.cult.stage - 1) : 1;

  /* ----- ตั้งต้นการบำเพ็ญ: เปิดเส้นลมปราณ (awakening) ----- */
  CULT.awaken = (npc, rng, bias, day) => {
    ELEM.ensureNpc(npc);
    const ch = CULT.choosePath(npc, rng, bias);
    const mant = CULT.bestMantra(ch.path, 1, npc);
    npc.cult = { path: ch.path, sub: 'NONE', stage: 1, prog: 0, mantra: mant ? mant.id : null, techs: [], learning: null, toxic: 0, lifeBonus: 0, since: day, attempts: 0, secl: null, rate: 0, pillT: 0 };
    ELEM.syncSpecialAccess(npc);
    CULT.refreshLifespan(npc);
    HC.bump(npc);
    return ch;
  };
  CULT.mantraPool = path => JD.TECH.mantras.filter(m => m.path === path).concat(JD.TECH.techniques.filter(t => /_MANTRA$/.test(t.cat) && t.path === path).map(t => ({ id: t.id, nameTh: t.nameTh, path: t.path, tier: t.tier, power: t.power, element: t.element, elementProfile: t.elementProfile, legendary: !!t.legendary })));
  CULT.bestMantra = (path, maxTier, npc) => {
    const unlocked = npc && npc.cult && Array.isArray(npc.cult.unlockedMantras) ? npc.cult.unlockedMantras : [];
    const pool = CULT.mantraPool(path).filter(m => m.tier <= maxTier && (!m.legendary || unlocked.includes(m.id)));
    if (npc && npc.h) {
      pool.sort((a, b) => {
        const ca = ELEM.resolveCompatibility(npc, TECH_BY_ID[a.id] || a, 'MANTRA_PRACTICE').cultivationMultiplier;
        const cb = ELEM.resolveCompatibility(npc, TECH_BY_ID[b.id] || b, 'MANTRA_PRACTICE').cultivationMultiplier;
        const effA = (a.tier * 100 + a.power) * (0.75 + 0.25 * ca);
        const effB = (b.tier * 100 + b.power) * (0.75 + 0.25 * cb);
        return effB - effA;
      });
    } else {
      pool.sort((a, b) => b.tier - a.tier || b.power - a.power);
    }
    return pool[0] || null;
  };

  /* ----- อัตราบำเพ็ญ (แต้มต่อชั่วโมงเกม) ----- */
  CULT.rate = (npc, env) => {
    const c = npc.cult; if (!c) return 0;
    let staticBase;
    const rc = npc._cultRateBase, ritVal = npc.h.skills.ritual || 0, focVal = npc.h.intellect.focus || 0;
    if (rc && rc.day === HC.nowDay && rc.ver === npc._ver && rc.pver === (npc._passVer || 0) && rc.path === c.path && rc.sub === c.sub && rc.st === c.stage && rc.mantra === c.mantra && rc.rit === ritVal && rc.foc === focVal) {
      staticBase = rc.val;
    } else {
      ELEM.ensureNpc(npc);
      const d = HC.derived(npc);
      const talent = clamp(d.cultivationTalent / 62, 0.35, 2.4);
      const root = HC.ROOT_BY_ID[npc.h.root.grade] || HC.ROOT_BY_ID.MORTAL;
      let base;
      if (c.path === 'XIAN') base = 1.0 * talent * root.cultivationMult;
      else if (c.path === 'BODY') base = 0.9 * clamp((HC.eff(npc, 'physiology.strength') + HC.eff(npc, 'physiology.toughness') + HC.eff(npc, 'physiology.endurance') + HC.eff(npc, 'aptitudes.cultivation')) / 4 / 55, 0.35, 2.2) * (0.8 + 0.4 * root.bodySynergy);
      else if (c.path === 'DEMON') {
        const demonApt = (d.cultivationTalent * 0.45 + HC.eff(npc, 'personality.ambition') * 0.25 + HC.eff(npc, 'personality.aggression') * 0.15 + Math.max(HC.eff(npc, 'affinities.YIN_SHADOW'), HC.eff(npc, 'affinities.POISON')) * 0.15) / 55;
        base = 1.05 * clamp(demonApt, 0.4, 2.45) * (0.85 + 0.2 * root.cultivationMult);
      } else if (c.path === 'HEART_SOUL') {
        const soulApt = (HC.eff(npc, 'intellect.comprehension') * 0.35 + HC.eff(npc, 'intellect.willpower') * 0.25 + HC.eff(npc, 'personality.composure') * 0.25 + HC.eff(npc, 'physiology.spiritualFoundation') * 0.15) / 54;
        base = 0.98 * clamp(soulApt, 0.4, 2.35) * (0.9 + 0.15 * root.cultivationMult);
      } else {
        base = 0.94 * clamp((HC.eff(npc, 'social.charisma') * 0.35 + HC.eff(npc, 'intellect.willpower') * 0.35 + HC.eff(npc, 'aptitudes.cultivation') * 0.30) / 54, 0.38, 2.35) * (0.88 + 0.18 * root.cultivationMult);
      }
      const m = c.mantra ? TECH_BY_ID[c.mantra] : null;
      const mantraK = m ? 1 + 0.11 * (m.tier - 1) : 0.9;
      const mantraElemMult = m ? ELEM.resolveCompatibility(npc, m, 'MANTRA_PRACTICE').cultivationMultiplier : 1.0;
      const subObj = c.sub && c.sub !== 'NONE' ? CULT.subInfo(c.path, c.sub) : CULT.PATHS[c.path];
      const subElemMult = subObj ? ELEM.resolveCompatibility(npc, subObj, 'CULTIVATION_TICK').cultivationMultiplier : 1.0;
      const elemRateFactor = clamp(0.60 * mantraElemMult + 0.40 * subElemMult, 0.72, 1.38);

      const focus = 0.65 + 0.35 * HC.eff(npc, 'intellect.focus') / 100;
      const sp = 1 + HC.special(npc, 'cultivation.rateBonus');
      const passRate = (g.MARTIAL && g.MARTIAL.passiveStats ? g.MARTIAL.passiveStats(npc).cultRatePct : 0) || 0;
      const innRate = (g.MARTIAL && g.MARTIAL.innateStats ? g.MARTIAL.innateStats(npc).cultRatePct : 0) || 0;
      const manRate = (m && m.mantraBonus && m.mantraBonus.cultRatePct) || 0;
      staticBase = base * (g.MARTIAL ? g.MARTIAL.skillEffects(npc).cultivation : 1) * mantraK * elemRateFactor * focus * sp * (1 + passRate + innRate + manRate);
      npc._cultRateBase = { day: HC.nowDay, ver: npc._ver, pver: npc._passVer || 0, path: c.path, sub: c.sub, st: c.stage, mantra: c.mantra, rit: ritVal, foc: focVal, val: staticBase };
    }
    const rest = npc.h.state.rest < 30 ? 0.6 : npc.h.state.rest < 55 ? 0.85 : 1;
    let toxic, dev;
    const hd = npc.h.state.heartDemon || 0;
    if (c.path === 'DEMON') {
      toxic = 1 - clamp(c.toxic / (c.sub === 'VENOM_GU_SOVEREIGN' ? 360 : 240), 0, 0.28);
      dev = hd <= 60 ? (1 + (hd / 60) * 0.22) : Math.max(0.55, 1.22 - ((hd - 60) / 40) * 0.65);
    } else if (c.path === 'HEART_SOUL') {
      toxic = 1 - clamp(c.toxic / 140, 0, 0.5);
      const stressPen = clamp(Math.max(0, (npc.h.state.stress || 0) - 45) / 150, 0, 0.25);
      dev = (hd <= 10 && (npc.h.state.stress || 0) <= 25) ? 1.15 : Math.max(0.35, 1 - clamp(hd / 140, 0, 0.55) - stressPen);
    } else {
      toxic = 1 - clamp(c.toxic / 140, 0, 0.5);
      dev = 1 - clamp(hd / 200, 0, 0.4);
    }
    const pill = c.pillT > 0 ? 1 + (c.pillBoost || 0) : 1;
    return staticBase * rest * toxic * dev * pill * (env || 1);
  };
  CULT.gain = (npc, pts, W, sourceTag) => {
    const c = npc.cult; if (!c) return;
    const th = CULT.threshold(npc);
    if (c.prog >= th) { c.found = Math.min(0.08, (c.found || 0) + pts * 0.0002); pts *= 0.15; }
    c.prog += pts;
    if (c.prog > th * 1.25) c.prog = th * 1.25;

    const tr = c.track;
    if (tr) {
      const trTh = CULT.trackThreshold(npc);
      if (trTh !== Infinity) {
        let trPts = pts;
        if (tr.prog >= trTh) trPts *= 0.15;
        tr.prog += trPts;
        if (tr.prog > trTh * 1.25) tr.prog = trTh * 1.25;
      }
    }
  };
  CULT.ready = npc => !!npc.cult && npc.cult.stage < CULT.maxStage(npc) && npc.cult.prog >= CULT.threshold(npc);

  /* ----- กำลังรบ ----- */
  CULT.power = (npc, opts) => {
    const d = HC.derived(npc), s = npc.h.state, hpMax = CULT.hpMax(npc);
    const st = CULT.stageInfo(npc);
    let cp = st.combatPower;
    if (npc.cult) { const si = CULT.subInfo(npc.cult.path, npc.cult.sub); cp *= si.combatBonus; }
    const f_body = 0.7 + d.physicalIndex / 100 * 0.6;
    const sk = npc.h.skills; const martial = Math.max(sk.SWORD || 0, sk.BLADE || 0, sk.SPEAR || 0, sk.FIST_PALM || 0, sk.BODY_REFINING || 0, sk.SOUL_DIVINE || 0, sk.POISON || 0);
    const f_skill = 0.75 + martial / 100 * 0.5;
    let techSum = 0; (npc.cult ? npc.cult.techs : []).forEach(id => { const t = TECH_BY_ID[id]; if (t) techSum += t.tier; });
    const f_tech = 1 + Math.min(0.4, 0.04 * techSum);
    let eq = 0; const E = npc.equip || {}; for (const k in E) if (E[k] && E[k].combatMult) eq += E[k].combatMult * (E[k].dur == null ? 1 : clamp(E[k].dur / 100, 0.3, 1));
    const hdFactor = (npc.cult && npc.cult.path === 'DEMON')
      ? ((s.heartDemon || 0) <= 65 ? 1 + 0.12 * ((s.heartDemon || 0) / 65) : 1 - 0.25 * (((s.heartDemon || 0) - 65) / 35))
      : (1 - 0.3 * (s.heartDemon || 0) / 100);
    const f_state = (0.35 + 0.65 * clamp(s.hp / hpMax, 0, 1)) * (0.75 + 0.25 * s.energy / 100) * hdFactor;
    const f_mind = 0.9 + HC.eff(npc, 'personality.courage') / 100 * 0.12 + HC.eff(npc, 'aptitudes.combat') / 100 * 0.18;
    cp = cp * f_body * f_skill * f_tech * (1 + eq) * HC.special(npc, 'combat.powerMult') * f_state * f_mind;
    return Math.max(3, cp);
  };
  CULT.defenseMult = npc => { let d = 0; const E = npc.equip || {}; for (const k in E) if (E[k] && E[k].defMult) d += E[k].defMult; return 1 + d; };

  /* ----- ทะลวงขั้น ----- */
  CULT.breakthroughChance = (npc, prep) => {
    ELEM.ensureNpc(npc);
    const c = npc.cult; const st = CULT.PATHS[c.path].stages[c.stage - 1];
    const si = CULT.subInfo(c.path, c.sub);
    let p = st.breakthroughBaseChance * si.breakthroughMod;
    const root = HC.ROOT_BY_ID[npc.h.root.grade] || HC.ROOT_BY_ID.MORTAL;
    p *= 0.72 + clamp(HC.derived(npc).cultivationTalent, 20, 120) / 200;
    p += root.breakthroughBonus;
    const m = c.mantra ? TECH_BY_ID[c.mantra] : null;
    const btTarget = m || (c.sub && c.sub !== 'NONE' ? si : CULT.PATHS[c.path]);
    const elemBt = ELEM.resolveCompatibility(npc, btTarget, 'BREAKTHROUGH');
    p += elemBt.breakthroughBonus * 0.5;
    p += (HC.eff(npc, 'personality.composure') - 50) / 50 * 0.08 + (HC.eff(npc, 'intellect.willpower') - 50) / 50 * 0.08 + (HC.eff(npc, 'physiology.spiritualFoundation') - 50) / 50 * 0.06;
    p += HC.special(npc, 'cultivation.breakthroughBonus');
    const hd = npc.h.state.heartDemon || 0;
    if (c.path === 'DEMON') {
      p += (HC.eff(npc, 'personality.ambition') - 50) / 50 * 0.05;
      p -= (hd <= 55 ? hd / 100 * 0.10 : (0.055 + (hd - 55) / 100 * 0.38)) + c.toxic / 100 * 0.08;
    } else if (c.path === 'HEART_SOUL') {
      p += (HC.eff(npc, 'intellect.comprehension') - 50) / 50 * 0.06 + (HC.eff(npc, 'personality.composure') - 50) / 50 * 0.04;
      p -= hd / 100 * 0.32 + c.toxic / 100 * 0.15;
    } else {
      p -= hd / 100 * 0.25 + c.toxic / 100 * 0.15;
    }
    if (g.BN) p += g.BN.chanceMod(npc);
    if (prep) p += (prep.pill || 0) + (prep.env || 0) + (prep.guide || 0);
    return clamp(p, 0.03, 0.97);
  };
  CULT.breakthrough = (W, npc, prep) => {
    const c = npc.cult, rng = W.rng;
    const p = CULT.breakthroughChance(npc, prep);
    c.attempts++;
    const ok = rng.next() < p;
    const res = { ok, p, injured: false, died: false, stageFrom: c.stage };
    if (ok) {
      const over = Math.max(0, c.prog - CULT.threshold(npc));
      c.stage++; c.prog = over * 0.3; c.attempts = 0; c.lifeBonus = c.lifeBonus || 0;
      CULT.refreshLifespan(npc);
      const h = npc.h;
      h.physiology.meridianCapacity = Math.min(99, h.physiology.meridianCapacity + 1.2);
      h.physiology.spiritualFoundation = Math.min(99, h.physiology.spiritualFoundation + 0.8);
      h.physiology.vitality = Math.min(99, h.physiology.vitality + 0.5);
      const mBt = c.mantra ? TECH_BY_ID[c.mantra] : null;
      ELEM.gainMastery(W, npc, mBt || CULT.subInfo(c.path, c.sub) || CULT.PATHS[c.path], 0.9, 'breakthrough_ok');
      if (c.path === 'HEART_SOUL') {
        h.state.heartDemon = Math.max(0, (h.state.heartDemon || 0) - 15);
        h.intellect.comprehension = Math.min(99, h.intellect.comprehension + 0.8);
        HC.gainWisdom(npc, 1.4);
      } else if (c.path === 'DEMON') {
        h.physiology.vitality = Math.min(99, h.physiology.vitality + 0.7);
        h.state.heartDemon = Math.max(0, (h.state.heartDemon || 0) - 5);
        HC.gainWisdom(npc, 0.8);
      } else {
        HC.gainWisdom(npc, 0.8);
      }
      h.state.hp = CULT.hpMax(npc); h.state.qi = CULT.qiMax(npc);
      HC.experience(npc, 'insight', 0.8);
      const m = CULT.bestMantra(c.path, c.stage, npc);
      if (m && (!c.mantra || !TECH_BY_ID[c.mantra] || TECH_BY_ID[c.mantra].tier < m.tier) && c.stage >= m.tier - 1) c.mantra = m.id;
      ELEM.syncSpecialAccess(npc);
      c.pillT = 0; c.pillBoost = 0; if (g.BN) g.BN.onResult(W, npc, true);
    } else {
      c.prog = CULT.threshold(npc) * (0.5 + 0.2 * clamp(HC.eff(npc, 'intellect.willpower') / 100 * 0.6 + HC.eff(npc, 'personality.composure') / 100 * 0.4 + rng.gauss(0, 0.12), 0, 1));
      const sev = rng.next() < 0.35 ? 2 : 1;
      res.injured = true; res.sev = sev;
      npc.h.state.hp = Math.max(1, npc.h.state.hp * (sev === 2 ? 0.35 : 0.6));
      HC.feel(npc, { mood: -18, stress: 18 });
      npc.h.state.heartDemon = clamp(npc.h.state.heartDemon + rng.int(5, 16), 0, 100);
      if (c.path === 'DEMON') {
        res.supremeRisk = 'DEMONIC_BACKLASH_FRENZY';
        npc.h.state.heartDemon = clamp(npc.h.state.heartDemon + 8, 0, 100);
        npc.h.state.hp = Math.max(1, Math.round(npc.h.state.hp * 0.85));
      } else if (c.path === 'HEART_SOUL') {
        res.supremeRisk = 'SOUL_SHATTER_ILLUSION_LOST';
        npc.h.state.qi = 0;
        npc.h.state.rest = Math.max(5, (npc.h.state.rest || 50) - 25);
        npc.h.state.stress = clamp((npc.h.state.stress || 0) + 12, 0, 100);
      }
      const pd = c.stage >= 3 ? 0.012 * (c.stage - 2) * (1 - HC.eff(npc, 'intellect.willpower') / 160) : 0;
      if (rng.next() < pd) res.died = true;
      HC.experience(npc, 'heart_demon', 0.5);
      if (rng.chance(0.18)) { npc.h.physiology.meridianIntegrity = Math.max(8, npc.h.physiology.meridianIntegrity - rng.float(1, 4)); }
    }
    if (!res.ok && g.BN) g.BN.onResult(W, npc, false);
    HC.bump(npc);
    return res;
  };

  /* ----- เรียนวิชา (รวมถึงวิชาต้องห้ามภายใต้เงื่อนไขเข้มงวด) ----- */
  // Accepts either (tech, npcSub, strictPrimarySub) or (npcSub, tech, strictPrimarySub)
  CULT.isSubCompatible = (a, b, strictPrimarySub) => {
    const tech = (a && typeof a === 'object') ? a : (b && typeof b === 'object' ? b : null);
    const npcSub = typeof a === 'string' ? a : (typeof b === 'string' ? b : null);
    if (!tech || !tech.sub) return true;
    if (tech.sub === npcSub) return true;
    if (!strictPrimarySub && Array.isArray(tech.compatibleSubs) && tech.compatibleSubs.includes(npcSub)) return true;
    return false;
  };

  CULT.canStudyForbidden = (npc, tOrId, opts) => {
    const t = typeof tOrId === 'string' ? TECH_BY_ID[tOrId] : tOrId;
    if (!t || !/FORBIDDEN/.test(t.cat || '')) return { ok: true };
    if (!npc || !npc.cult) return { ok: false, reason: 'ยังไม่เปิดวิถีบำเพ็ญ' };
    const c = npc.cult, req = t.reqTier || t.tier || 5;
    if (CULT.effectiveTechStage(npc) < req) return { ok: false, reason: 'ขั้นบำเพ็ญไม่ถึงเกณฑ์วิชาต้องห้าม (ขั้น ' + req + ')' };
    if (t.path !== 'ANY' && t.path !== c.path) return { ok: false, reason: 'ต่างวิถีหลัก' };
    if (!CULT.isSubCompatible(t, c.sub, false)) return { ok: false, reason: 'ต้องมีสายย่อยตรงกัน' };
    const allowFlag = !!(opts && (opts.allowForbidden || opts.libraryStudy)) || !!npc.allowForbiddenStudy;
    const demonPath = c.path === 'DEMON';
    const darkDrive = HC.eff(npc, 'personality.ambition') >= 62 && HC.eff(npc, 'personality.integrity') <= 48;
    const heartDemonDrive = !!(npc.h && npc.h.state && (npc.h.state.heartDemon || 0) >= 25);
    if (!allowFlag && !demonPath && !darkDrive && !heartDemonDrive) {
      return { ok: false, reason: 'วิชาต้องห้ามต้องอาศัยวิถีมาร ความทะเยอทะยานสูง หรือการเปิดอนุญาตศึกษา' };
    }
    return { ok: true };
  };

  CULT.learnable = (npc, library, opts) => {
    const c = npc.cult; if (!c) return [];
    const effSt = CULT.effectiveTechStage(npc);
    const strictPrimary = !!(opts && opts.strictPrimarySub);
    return library.filter(id => {
      const t = TECH_BY_ID[id];
      if (!t || t.innateOnly || (t.reqTier || t.tier) > effSt || (t.path !== 'ANY' && t.path !== c.path) || !CULT.isSubCompatible(t, c.sub, strictPrimary) || c.techs.includes(id)) return false;
      if (/_MANTRA$|^QI_MANTRA$/.test(t.cat)) return false;
      if (/FORBIDDEN/.test(t.cat)) {
        if (!opts || !opts.includeForbidden) {
          if (!npc.allowForbiddenStudy && !(opts && opts.allowForbidden)) return false;
        }
        if (!CULT.canStudyForbidden(npc, t, opts).ok) return false;
      }
      return true;
    });
  };
  CULT.studyCost = (t, npc) => {
    const base = 90 * (t.tier + 0.5) * (1 + t.tier * 0.25);
    if (!npc || !npc.h) return base;
    const comp = ELEM.resolveCompatibility(npc, t, 'TECH_STUDY');
    return Math.max(30, Math.round(base / Math.max(0.55, comp.studySpeedMultiplier)));
  };
  CULT.maxTechs = npc => 2 + (npc.cult ? Math.round(CULT.normalizedStage(npc)) : 0);


  /* ----- สายบำเพ็ญเฉพาะทางอิสระ (Independent Specialization Tracks - v1.10.3 / v1.10.8) ----- */
  CULT.TRACKS = {};
  CULT.registerTracks = () => {
    if (JD && JD.EXPANSION && Array.isArray(JD.EXPANSION.progressionMapping)) {
      JD.EXPANSION.progressionMapping.forEach(pm => {
        if (pm.subPath && Array.isArray(pm.realms)) {
          CULT.TRACKS[pm.subPath] = pm;
        }
      });
    }
  };
  CULT.registerTracks();

  CULT.trackDef = subPath => {
    if (!subPath) return null;
    if (!CULT.TRACKS[subPath]) CULT.registerTracks();
    return CULT.TRACKS[subPath] || null;
  };

  CULT.trackOf = npc => {
    if (!npc || !npc.cult) return null;
    return npc.cult.track || null;
  };

  CULT.initTrack = (subPath, ord, day) => {
    const def = CULT.trackDef(subPath);
    if (!def || !def.realms || !def.realms.length) return null;
    const ordinal = clamp(ord || 1, 1, def.realms.length);
    const r = def.realms[ordinal - 1];
    return {
      subPath,
      ordinal,
      realmId: r.id,
      realmNameTh: r.nameTh,
      prog: 0,
      attempts: 0,
      history: [{ ordinal, realmId: r.id, realmNameTh: r.nameTh, atDay: day || 0 }]
    };
  };

  CULT.ensureTrack = (npc, day) => {
    if (!npc || !npc.cult) return null;
    if (g.MARTIAL) g.MARTIAL.normalize(npc);
    if (!npc.cult.track && CULT.trackDef(npc.cult.sub)) {
      npc.cult.track = CULT.initTrack(npc.cult.sub, 1, day || 0);
      CULT.refreshLifespan(npc);
    }
    return npc.cult.track || null;
  };

  CULT.trackRealm = (npcOrSub, ord) => {
    let subPath, ordinal;
    if (typeof npcOrSub === 'object' && npcOrSub !== null) {
      const tr = CULT.trackOf(npcOrSub);
      if (!tr) return null;
      subPath = tr.subPath;
      ordinal = ord != null ? ord : tr.ordinal;
    } else {
      subPath = npcOrSub;
      ordinal = ord;
    }
    const def = CULT.trackDef(subPath);
    if (!def || !def.realms) return null;
    return def.realms[(ordinal || 1) - 1] || null;
  };

  CULT.trackThreshold = (npcOrSub, ord) => {
    let subPath, ordinal;
    if (typeof npcOrSub === 'object' && npcOrSub !== null) {
      const tr = CULT.trackOf(npcOrSub);
      if (!tr) return Infinity;
      subPath = tr.subPath;
      ordinal = ord != null ? ord : tr.ordinal;
    } else {
      subPath = npcOrSub;
      ordinal = ord || 1;
    }
    const def = CULT.trackDef(subPath);
    if (!def || !def.realms) return Infinity;
    if (ordinal >= def.realms.length) return Infinity;
    const threshCurve = [200, 520, 1350, 3400, 8500, 21000, 50000, 120000];
    return threshCurve[ordinal - 1] || 150000;
  };

  CULT.trackReady = npc => {
    const tr = CULT.trackOf(npc);
    if (!tr) return false;
    const def = CULT.trackDef(tr.subPath);
    if (!def || tr.ordinal >= def.realms.length) return false;
    const th = CULT.trackThreshold(npc);
    return tr.prog >= th;
  };

  CULT.checkTrackGates = (W, npc, targetOrd) => {
    const tr = CULT.trackOf(npc);
    if (!tr) return { ok: false, reason: 'ไม่มีสายบำเพ็ญเฉพาะทาง', reasons: ['ไม่มีสายบำเพ็ญเฉพาะทาง'] };
    const def = CULT.trackDef(tr.subPath);
    if (!def) return { ok: false, reason: 'ไม่พบข้อมูลสายบำเพ็ญ', reasons: ['ไม่พบข้อมูลสายบำเพ็ญ'] };
    const nextOrd = targetOrd != null ? targetOrd : tr.ordinal + 1;
    if (nextOrd > def.realms.length) {
      return { ok: false, reason: 'บรรลุขั้นสูงสุดของสายแล้ว (ขั้น 9)', reasons: ['บรรลุขั้นสูงสุดของสายแล้ว'], maxReached: true };
    }
    const nextRealm = def.realms[nextOrd - 1];
    const gate = nextRealm.skillGate || {};
    const reasons = [];
    const h = npc.h || {};
    const skills = h.skills || {};
    let skillOk = true;
    if (gate.primarySkill) {
      const curPrimary = skills[gate.primarySkill] || 0;
      const reqPrimary = gate.minPrimarySkill || 0;
      if (curPrimary < reqPrimary) {
        skillOk = false;
        reasons.push('ทักษะ ' + gate.primarySkill + ' ไม่ถึงเกณฑ์ (' + Math.round(curPrimary) + '/' + reqPrimary + ')');
      }
    }
    if (gate.secondarySkill) {
      const curSec = skills[gate.secondarySkill] || 0;
      const reqSec = gate.minSecondarySkill || 0;
      if (curSec < reqSec) {
        skillOk = false;
        reasons.push('ทักษะ ' + gate.secondarySkill + ' ไม่ถึงเกณฑ์ (' + Math.round(curSec) + '/' + reqSec + ')');
      }
    }
    const cost = nextRealm.resourceCost || {};
    const reqStones = cost.stones || 0;
    const havePersonal = (npc.inv && npc.inv.stones != null) ? npc.inv.stones : 0;
    const haveSect = (W && W.sect && W.sect.stones != null) ? W.sect.stones : 0;
    let stonesSource = 'none';
    let resourceOk = false;
    if (havePersonal >= reqStones) {
      stonesSource = 'personal';
      resourceOk = true;
    } else if (haveSect >= reqStones && (npc.rank >= 2 || (W && W.sect && W.sect.policy && W.sect.policy.subsidizeSpecialization))) {
      stonesSource = 'sect';
      resourceOk = true;
    } else {
      reasons.push('ศิลาวิญญาณไม่เพียงพอ (ต้องการ ' + reqStones + ' ก้อน มี ' + Math.round(havePersonal) + ')');
    }
    return {
      ok: reasons.length === 0,
      reasons,
      reason: reasons.join(' · '),
      skillOk,
      resourceOk,
      stonesRequired: reqStones,
      stonesSource,
      currentOrdinal: tr.ordinal,
      nextOrdinal: nextOrd,
      nextRealm
    };
  };

  CULT.trackBreakthroughChance = (npc, opts) => {
    const tr = CULT.trackOf(npc);
    if (!tr) return 0;
    const def = CULT.trackDef(tr.subPath);
    if (!def || tr.ordinal >= def.realms.length) return 0;
    const nextRealm = def.realms[tr.ordinal];
    let p = nextRealm ? nextRealm.breakthroughBaseChance : 0.5;
    const root = (HC.ROOT_BY_ID && npc.h && npc.h.root) ? (HC.ROOT_BY_ID[npc.h.root.grade] || HC.ROOT_BY_ID.MORTAL) : { breakthroughBonus: 0 };
    p *= 0.75 + clamp(HC.derived(npc).cultivationTalent, 20, 120) / 200;
    p += root.breakthroughBonus || 0;
    p += (HC.eff(npc, 'personality.composure') - 50) / 50 * 0.08 + (HC.eff(npc, 'intellect.willpower') - 50) / 50 * 0.08;
    p += HC.special(npc, 'cultivation.breakthroughBonus');
    const s = npc.h ? npc.h.state : {};
    p -= (s.heartDemon || 0) / 100 * 0.2 + (npc.cult.toxic || 0) / 100 * 0.12;
    if (opts) {
      p += (opts.pill || 0) + (opts.env || 0) + (opts.guide || 0) + (opts.bonus || 0);
    }
    return clamp(p, (opts && opts.bonus != null && opts.bonus <= -0.99) ? 0 : 0.05, 0.95);
  };

  CULT.trackBreakthrough = (W, npc, opts) => {
    const tr = CULT.trackOf(npc);
    if (!tr) return { ok: false, reason: 'ไม่มีสายบำเพ็ญเฉพาะทาง' };
    const def = CULT.trackDef(tr.subPath);
    if (!def) return { ok: false, reason: 'ไม่พบข้อมูลสายบำเพ็ญ' };
    const gate = CULT.checkTrackGates(W, npc);
    if (!gate.ok && (!opts || !opts.ignoreGates)) {
      return { ok: false, blockedByGate: true, reason: gate.reason, gate };
    }
    const th = CULT.trackThreshold(npc);
    if (tr.prog < th && (!opts || !opts.force)) {
      return { ok: false, blockedByProgress: true, reason: 'ตบะสายเฉพาะทางยังไม่เต็มขั้น' };
    }
    const reqStones = gate.stonesRequired;
    if (reqStones > 0 && (!opts || !opts.free)) {
      if (gate.stonesSource === 'personal') {
        npc.inv.stones = Math.max(0, npc.inv.stones - reqStones);
      } else if (gate.stonesSource === 'sect' && W && W.sect) {
        W.sect.stones = Math.max(0, W.sect.stones - reqStones);
        if (W.sect.ledger) W.sect.ledger.push({ t: W.t, type: 'track_bt', id: npc.id, stones: -reqStones });
      }
    }
    const p = CULT.trackBreakthroughChance(npc, opts);
    tr.attempts = (tr.attempts || 0) + 1;
    const ok = (opts && opts.guarantee) ? true : (W && W.rng ? W.rng.next() < p : Math.random() < p);
    const fromOrd = tr.ordinal;
    if (ok) {
      tr.ordinal++;
      const newRealm = CULT.trackRealm(npc);
      tr.realmId = newRealm.id;
      tr.realmNameTh = newRealm.nameTh;
      tr.prog = 0;
      tr.attempts = 0;
      const day = W && (W.day != null ? W.day : (W.t ? Math.floor(W.t / 1440) : 0));
      tr.history = tr.history || [];
      tr.history.push({ ordinal: tr.ordinal, realmId: newRealm.id, realmNameTh: newRealm.nameTh, atDay: day || 0 });
      const h = npc.h;
      if (h) {
        const prim = gate.nextRealm && gate.nextRealm.skillGate && gate.nextRealm.skillGate.primarySkill;
        if (prim && h.skills && h.skills[prim] != null) h.skills[prim] = Math.min(100, h.skills[prim] + 1.5);
        HC.gainWisdom(npc, 0.5);
        HC.experience(npc, 'insight', 0.6);
      }
      CULT.refreshLifespan(npc);
      if (W && W.log) {
        W.log('breakthrough', npc.h.name.given + ' ทะลวงสายเฉพาะทางสู่「' + newRealm.nameTh + '」(ลำดับ ' + tr.ordinal + '/9)!', [npc.id]);
      }
      HC.bump(npc);
      return { ok: true, p, fromOrdinal: fromOrd, toOrdinal: tr.ordinal, realm: newRealm };
    } else {
      tr.prog = th * (0.5 + 0.2 * clamp(HC.eff(npc, 'intellect.willpower') / 100 * 0.6 + HC.eff(npc, 'personality.composure') / 100 * 0.4, 0, 1));
      HC.feel(npc, { mood: -12, stress: 12 });
      npc.h.state.heartDemon = clamp(npc.h.state.heartDemon + 8, 0, 100);
      if (W && W.log) {
        W.log('breakthrough', npc.h.name.given + ' ทะลวงสายเฉพาะทาง ' + def.realms[fromOrd - 1].nameTh + ' ไม่สำเร็จ (โอกาส ' + Math.round(p * 100) + '%)', [npc.id]);
      }
      HC.bump(npc);
      return { ok: false, p, failed: true, fromOrdinal: fromOrd, toOrdinal: fromOrd };
    }
  };

  CULT.trackFunctionalPower = (subPath, ord) => {
    const r = CULT.trackRealm(subPath, ord);
    return r ? r.functionalCombatPower : 0;
  };

  CULT.getFunctionalMetrics = entity => {
    if (!entity) return { power: 25, band: 0, label: 'ปุถุชน' };
    if (entity.cult && entity.cult.track) {
      const tr = entity.cult.track;
      const r = CULT.trackRealm(tr.subPath, tr.ordinal);
      if (r) {
        return {
          power: r.functionalCombatPower,
          band: r.majorBandEquivalent,
          ordinal: tr.ordinal,
          realmName: r.nameTh,
          subPath: tr.subPath,
          majorPath: entity.cult.path,
          majorStage: entity.cult.stage,
          label: r.nameTh + ' (ลำดับ ' + tr.ordinal + '/9 · เทียบขั้นหลัก ' + r.majorBandEquivalent.toFixed(1) + ')'
        };
      }
    }
    if (entity.cult) {
      const c = entity.cult;
      const st = CULT.PATHS[c.path] && CULT.PATHS[c.path].stages[c.stage - 1];
      const power = st ? st.combatPower : 25;
      return {
        power,
        band: c.stage,
        ordinal: null,
        realmName: st ? st.nameTh : '',
        subPath: c.sub,
        majorPath: c.path,
        majorStage: c.stage,
        label: (st ? st.nameTh : 'ขั้น ' + c.stage) + ' (ขั้นหลัก ' + c.stage + ')'
      };
    }
    if (entity.subPath && entity.ordinal) {
      const r = CULT.trackRealm(entity.subPath, entity.ordinal);
      if (r) {
        return {
          power: r.functionalCombatPower,
          band: r.majorBandEquivalent,
          ordinal: entity.ordinal,
          realmName: r.nameTh,
          subPath: entity.subPath,
          label: r.nameTh + ' (ลำดับ ' + entity.ordinal + '/9 · เทียบขั้นหลัก ' + r.majorBandEquivalent.toFixed(1) + ')'
        };
      }
    }
    if (entity.path && entity.stage) {
      const st = CULT.PATHS[entity.path] && CULT.PATHS[entity.path].stages[entity.stage - 1];
      const power = st ? st.combatPower : 25;
      return {
        power,
        band: entity.stage,
        ordinal: null,
        realmName: st ? st.nameTh : '',
        majorPath: entity.path,
        majorStage: entity.stage,
        label: (st ? st.nameTh : 'ขั้น ' + entity.stage)
      };
    }
    return { power: 25, band: 0, label: 'ไม่ทราบขั้น' };
  };

  CULT.compareFunctionalPower = (a, b) => {
    const mA = CULT.getFunctionalMetrics(a);
    const mB = CULT.getFunctionalMetrics(b);
    const ratio = mB.power > 0 ? +(mA.power / mB.power).toFixed(3) : 1;
    const bandDelta = +(mA.band - mB.band).toFixed(2);
    let assessmentTh = '';
    if (ratio >= 1.35) {
      assessmentTh = 'เหนือกว่าอย่างเห็นได้ชัด (' + Math.round((ratio - 1) * 100) + '% แกร่งกว่า)';
    } else if (ratio >= 1.05) {
      assessmentTh = 'ได้เปรียบเล็กน้อย (' + Math.round((ratio - 1) * 100) + '% เหนือกว่า)';
    } else if (ratio >= 0.95) {
      assessmentTh = 'สูสีทัดเทียม (พลังเทียบเคียงกัน)';
    } else if (ratio >= 0.70) {
      assessmentTh = 'เป็นรองเล็กน้อย (' + Math.round((1 - ratio) * 100) + '% ด้อยกว่า)';
    } else {
      assessmentTh = 'ด้อยกว่าอย่างเห็นได้ชัด (' + Math.round((1 - ratio) * 100) + '% เป็นรอง)';
    }
    return {
      a: mA,
      b: mB,
      powerA: mA.power,
      powerB: mB.power,
      bandA: mA.band,
      bandB: mB.band,
      ratio,
      bandDelta,
      assessmentTh
    };
  };

  g.CULT = CULT;
  if (typeof module === 'object' && module.exports) module.exports = CULT;
})(typeof globalThis !== 'undefined' ? globalThis : this);
