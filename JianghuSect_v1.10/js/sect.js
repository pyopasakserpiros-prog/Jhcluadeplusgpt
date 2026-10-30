/* sect.js — โครงสร้างสำนัก: ระดับศิษย์ ตำแหน่ง นโยบายที่มาจากนิสัยเจ้าสำนักจริง การประชุมสภา การสืบทอด
 * หลักการ: เจ้าสำนักตัดสินใจจาก "ตัวตน" (HC) ของเขา → นโยบาย → ผลต่อทั้งสำนัก (ดู policy ที่ถูกอ่านโดย ai/events/economy) */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js'), HC = g.HC, CULT = g.CULT, ECO = g.ECO, MAP = g.MAP, JD = g.JD;
  const clamp = U.clamp;
  const SECT = {};

  SECT.MAX_QUEUE = 6;
  SECT.HOUSING_IDS = ['dorm_outer', 'dorm_inner', 'dorm_core'];

  /* ---------- Authoritative Facility Progression & Housing Capacity (Max = 100) ---------- */
  SECT.FACILITY_SPECS = {
    dorm_outer: { maxLevel: 5, bedsByLevel: [0, 24, 32, 40, 48, 56], costBase: 550, category: 'housing' },
    dorm_inner: { maxLevel: 4, bedsByLevel: [0, 14, 19, 24, 28], costBase: 700, category: 'housing' },
    dorm_core: { maxLevel: 3, bedsByLevel: [0, 8, 12, 16], costBase: 900, category: 'housing' },
    elder_quarters: { maxLevel: 1, costBase: 900, category: 'housing_exec' },
    farm: { maxLevel: 5, costBase: 500, category: 'production' },
    canteen: { maxLevel: 4, costBase: 550, category: 'service' },
    meditation_hall: { maxLevel: 4, costBase: 650, category: 'cultivation' },
    training_ground: { maxLevel: 4, costBase: 600, category: 'martial' },
    herb_garden: { maxLevel: 4, costBase: 550, category: 'production' },
    alchemy: { maxLevel: 3, costBase: 650, category: 'craft' },
    forge: { maxLevel: 3, costBase: 650, category: 'craft' },
    mine: { maxLevel: 3, costBase: 600, category: 'production' },
    infirmary: { maxLevel: 3, costBase: 550, category: 'service' },
    scripture: { maxLevel: 3, costBase: 700, category: 'scholar' },
    tea_garden: { maxLevel: 2, costBase: 500, category: 'production' },
    shrine: { maxLevel: 2, costBase: 550, category: 'service' },
    market: { maxLevel: 2, costBase: 600, category: 'commerce' },
    main_hall: { maxLevel: 1, category: 'admin' },
    treasury: { maxLevel: 1, category: 'admin' },
    mission_hall: { maxLevel: 1, category: 'admin' },
    discipline: { maxLevel: 1, category: 'admin' },
    gate: { maxLevel: 1, category: 'defense' },
    watchtower_w: { maxLevel: 1, category: 'defense' },
    watchtower_e: { maxLevel: 1, category: 'defense' },
    waterfall: { maxLevel: 1, category: 'landmark' },
    spirit_tree: { maxLevel: 1, category: 'landmark' },
    plaza: { maxLevel: 1, category: 'landmark' }
  };

  SECT.maxBuildingLevel = bOrId => {
    const id = typeof bOrId === 'string' ? bOrId : (bOrId && bOrId.id);
    const sp = SECT.FACILITY_SPECS[id];
    return sp && Number.isFinite(sp.maxLevel) ? sp.maxLevel : 3;
  };

  SECT.upgradeCost = b => {
    if (!b) return 600;
    const sp = SECT.FACILITY_SPECS[b.id];
    const base = (sp && sp.costBase) || 600;
    return Math.round(base * b.level * b.level);
  };

  SECT.housingCapacity = W => {
    if (!W || !W.map || !W.map.byId) return 46;
    return SECT.HOUSING_IDS.reduce((sum, id) => {
      const b = W.map.byId[id];
      if (!b || !Array.isArray(b.stations)) return sum;
      return sum + b.stations.filter(st => st && (!st.k || st.k === 'bed')).length;
    }, 0);
  };

  SECT.maxHousingCapacity = () => {
    return SECT.HOUSING_IDS.reduce((sum, id) => {
      const sp = SECT.FACILITY_SPECS[id];
      return sum + (sp && sp.bedsByLevel ? sp.bedsByLevel[sp.maxLevel] : 0);
    }, 0);
  };

  SECT.memberOccupancy = W => {
    if (!W || !Array.isArray(W.npcs)) return 0;
    const seen = new Set();
    let count = 0;
    for (const n of W.npcs) {
      if (!n || n.dead || n.exiled || !n.id || seen.has(n.id)) continue;
      seen.add(n.id);
      count++;
    }
    return count;
  };

  SECT.freeHousingBeds = W => Math.max(0, SECT.housingCapacity(W) - SECT.memberOccupancy(W));

  SECT.upgradeBuildingTo = (W, bOrId, targetLevel) => {
    if (!W || !W.map || !W.map.byId) return { ok: false, reason: 'invalid-world' };
    const b = typeof bOrId === 'string' ? W.map.byId[bOrId] : bOrId;
    if (!b) return { ok: false, reason: 'building-not-found' };
    const maxL = SECT.maxBuildingLevel(b);
    const goal = clamp(Math.floor(Number(targetLevel) || b.level), 1, maxL);
    b.building = null;
    while (b.level < goal) {
      b.level++;
      if (g.SIM && g.SIM.expandStations) g.SIM.expandStations(W, b);
    }
    return { ok: true, id: b.id, level: b.level, maxLevel: maxL, capacity: SECT.housingCapacity(W) };
  };

  /* ---------- Applicant Talent Tier Distribution & CA/PA Privacy ---------- */
  SECT.TALENT_TIERS = {
    COMMON: { id: 'COMMON', nameTh: 'สามัญ', quality: [0.34, 0.50], rootGrades: ['DEFECTIVE', 'MORTAL'], traitCount: [1, 2], isGifted: false, isExceptional: false },
    STEADY: { id: 'STEADY', nameTh: 'มุ่งมั่น', quality: [0.46, 0.60], rootGrades: ['MORTAL', 'SPIRIT'], traitCount: [2, 3], isGifted: false, isExceptional: false },
    GIFTED: { id: 'GIFTED', nameTh: 'พรสวรรค์เด่น', quality: [0.58, 0.72], rootGrades: ['SPIRIT', 'TRUE'], traitCount: [2, 3], isGifted: true, isExceptional: false },
    PRODIGY: { id: 'PRODIGY', nameTh: 'อัจฉริยะ', quality: [0.72, 0.85], rootGrades: ['TRUE', 'HEAVENLY'], traitCount: [3, 4], isGifted: true, isExceptional: true },
    HEAVENLY_CHILD: { id: 'HEAVENLY_CHILD', nameTh: 'บุตรสวรรค์', quality: [0.85, 0.96], rootGrades: ['HEAVENLY'], traitCount: [3, 4], isGifted: true, isExceptional: true }
  };
  SECT.TALENT_TIER_IDS = ['COMMON', 'STEADY', 'GIFTED', 'PRODIGY', 'HEAVENLY_CHILD'];

  SECT.applicantTierWeights = fame => {
    const f = Math.max(0, Number.isFinite(fame) ? fame : 12);
    const u = clamp(Math.sqrt(f) / 28, 0, 1);
    const GIFTED = +(0.060 + 0.165 * u).toFixed(6);
    const PRODIGY = +(0.012 + 0.068 * u).toFixed(6);
    const HEAVENLY_CHILD = +(0.003 + 0.022 * u).toFixed(6);
    const STEADY = +(0.220 + 0.080 * u).toFixed(6);
    const COMMON = +(1 - (GIFTED + PRODIGY + HEAVENLY_CHILD + STEADY)).toFixed(6);
    return { COMMON, STEADY, GIFTED, PRODIGY, HEAVENLY_CHILD };
  };

  SECT.rollApplicantTier = (rng, fame) => {
    const weights = SECT.applicantTierWeights(fame);
    const tierId = (rng && rng.weighted) ? rng.weighted(SECT.TALENT_TIER_IDS, k => weights[k]) : 'COMMON';
    const spec = SECT.TALENT_TIERS[tierId] || SECT.TALENT_TIERS.COMMON;
    const quality = (rng && rng.float) ? rng.float(spec.quality[0], spec.quality[1]) : (spec.quality[0] + spec.quality[1]) / 2;
    const rootGrade = (rng && rng.pick) ? rng.pick(spec.rootGrades) : spec.rootGrades[0];
    const traitCount = (rng && rng.int) ? rng.int(spec.traitCount[0], spec.traitCount[1]) : spec.traitCount[0];
    return {
      tierId: spec.id,
      nameTh: spec.nameTh,
      quality,
      rootGrade,
      traitCount,
      isGifted: spec.isGifted,
      isExceptional: spec.isExceptional
    };
  };

  // Internal diagnostic helper for test/simulation verification only (never used by UI or recruitment evaluation)
  SECT.hiddenPotential = n => {
    if (!n || !n.h) return { paScore: 0, tierId: 'COMMON' };
    const a = n.h.aptitudes || {}, it = n.h.intellect || {}, ph = n.h.physiology || {};
    const rootTier = (HC.ROOT_BY_ID[n.h.root && n.h.root.grade] || { tier: 1 }).tier;
    const paScore = (
      (a.cultivation || 50) * 0.30 +
      (a.comprehension || 50) * 0.20 +
      (a.combat || 50) * 0.15 +
      (a.crafting || 50) * 0.10 +
      (it.learningSpeed || 50) * 0.10 +
      (ph.spiritualFoundation || 50) * 0.08 +
      (ph.meridianCapacity || 50) * 0.07 +
      (rootTier - 1) * 4.5
    );
    const tierId = (n.ext && n.ext.applicant && n.ext.applicant.tierId)
      ? n.ext.applicant.tierId
      : (paScore >= 82 || rootTier >= 5 ? 'HEAVENLY_CHILD' : paScore >= 72 || rootTier >= 4 ? 'PRODIGY' : paScore >= 61 ? 'GIFTED' : paScore >= 49 ? 'STEADY' : 'COMMON');
    return { paScore: +paScore.toFixed(2), tierId, rootGrade: n.h.root && n.h.root.grade };
  };

  // Strictly observable current capability (CA) — NEVER reads hidden PA fields:
  // aptitudes, affinities, root, constitution, traits, innate, destiny, intellect, spiritualFoundation, meridianCapacity, meridianIntegrity, senseAcuity, or n.ext.applicant
  SECT.observableCapability = (W, n) => {
    if (!n || !n.h) {
      return { caScore: 0, physicalScore: 0, demeanorScore: 0, martialSkill: 0, craftSkill: 0, civicSkill: 0, healthScore: 0, roleFit: 'general', bestRoleTh: 'แรงงานทั่วไป', summaryTh: 'ไม่ทราบข้อมูล', tags: [] };
    }
    const ph = n.h.physiology || {};
    const pe = n.h.personality || {};
    const so = n.h.social || {};
    const sk = n.h.skills || {};
    const st = n.h.state || {};

    const physicalScore = (
      (ph.strength || 40) * 0.20 +
      (ph.endurance || 40) * 0.20 +
      (ph.toughness || 40) * 0.15 +
      (ph.dexterity || 40) * 0.15 +
      (ph.agility || 40) * 0.15 +
      (ph.vitality || 40) * 0.15
    );
    const demeanorScore = (
      (pe.discipline || 45) * 0.35 +
      (pe.integrity || 45) * 0.25 +
      (pe.composure || 45) * 0.20 +
      (pe.courage || 45) * 0.10 +
      (so.charisma || 45) * 0.10
    );
    const martialSkill = Math.max(sk.SWORD || 0, sk.BLADE || 0, sk.SPEAR || 0, sk.FIST_PALM || 0, sk.BODY_REFINING || 0, sk.LIGHTFOOT || 0);
    const craftSkill = Math.max(sk.ALCHEMY || 0, sk.FORGING || 0, sk.MEDICINE || 0, sk.HERB_LORE || 0, sk.SCRIPTURE || 0);
    const civicSkill = Math.max(sk.farming || 0, sk.cooking || 0, sk.mining || 0, sk.herbalism || 0, sk.administration || 0, sk.trading || 0, sk.survival || 0, sk.construction || 0);
    const stage = n.cult ? (n.cult.stage || 0) : 0;
    const injPenalty = Array.isArray(n.inj) ? n.inj.length * 6 : 0;
    const healthScore = clamp((st.energy == null ? 80 : st.energy) * 0.5 + 50 - injPenalty, 10, 100);

    // Evaluate current sect staffing fit from observable skills only
    let roleFit = 'general', bestRoleTh = 'งานทั่วไป', needBonus = 0;
    const roleScores = [
      { id: 'martial', label: 'ฝึกยุทธ์/ป้องกัน', val: martialSkill * 1.1 + (ph.strength || 40) * 0.35 + (pe.courage || 45) * 0.25 },
      { id: 'alchemy', label: 'ปรุงยา/การแพทย์', val: Math.max(sk.ALCHEMY || 0, sk.MEDICINE || 0, sk.HERB_LORE || 0) * 1.2 + (ph.dexterity || 40) * 0.3 },
      { id: 'forge', label: 'ช่างหลอม/ก่อสร้าง', val: Math.max(sk.FORGING || 0, sk.construction || 0, sk.mining || 0) * 1.2 + (ph.strength || 40) * 0.35 },
      { id: 'provision', label: 'เกษตร/โรงครัว', val: Math.max(sk.farming || 0, sk.cooking || 0, sk.herbalism || 0) * 1.25 + (ph.endurance || 40) * 0.35 },
      { id: 'admin', label: 'ธุรการ/การค้า', val: Math.max(sk.administration || 0, sk.trading || 0, sk.SCRIPTURE || 0) * 1.2 + (pe.discipline || 45) * 0.35 }
    ].sort((a, b) => b.val - a.val);

    if (roleScores[0] && roleScores[0].val >= 28) {
      roleFit = roleScores[0].id;
      bestRoleTh = roleScores[0].label;
    }

    if (W && W.sect) {
      const pop = Math.max(1, SECT.memberOccupancy(W));
      const foodDays = (ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3) / (pop * 3);
      if (foodDays < 8 && (sk.farming || 0) + (sk.cooking || 0) >= 12) needBonus += 5;
      if ((W.sect.shortageDirectives || []).some(d => d.source === 'alchemy') && (sk.ALCHEMY || 0) + (sk.herbalism || 0) >= 10) needBonus += 4;
      if (pop < 16) needBonus += 3;
    }

    const caScore = +(
      physicalScore * 0.34 +
      demeanorScore * 0.32 +
      Math.max(martialSkill, craftSkill, civicSkill) * 0.45 +
      (martialSkill + craftSkill + civicSkill) * 0.08 +
      stage * 5 +
      (healthScore - 50) * 0.08 +
      needBonus
    ).toFixed(2);

    const tags = [];
    if (physicalScore >= 60) tags.push('ร่างกายกำยำ');
    else if (physicalScore < 42) tags.push('รูปร่างบอบบาง');
    if (demeanorScore >= 60) tags.push('กิริยาสำรวมมีวินัย');
    if (martialSkill >= 14) tags.push('มีพื้นฐานยุทธ์');
    if (craftSkill >= 12) tags.push('คุ้นงานช่าง/โอสถ');
    if (civicSkill >= 14) tags.push('คล่องงานดูแลสำนัก');
    if (!tags.length) tags.push('พื้นฐานปุถุชนทั่วไป');

    const gradeTh = caScore >= 64 ? 'โดดเด่นพร้อมใช้งาน' : caScore >= 52 ? 'หน่วยก้านดี' : caScore >= 42 ? 'พอฝึกหัดได้' : 'พื้นฐานยังอ่อน';
    const summaryTh = gradeTh + ' · ถนัด' + bestRoleTh + ' (' + tags.slice(0, 2).join(', ') + ')';

    return {
      caScore,
      physicalScore: Math.round(physicalScore),
      demeanorScore: Math.round(demeanorScore),
      martialSkill: Math.round(martialSkill),
      craftSkill: Math.round(craftSkill),
      civicSkill: Math.round(civicSkill),
      healthScore: Math.round(healthScore),
      roleFit,
      bestRoleTh,
      gradeTh,
      summaryTh,
      tags
    };
  };

  SECT.RANKS = [
    { id: 0, nameTh: 'ผู้ฝึกหัด', dorm: 'dorm_outer', stipend: 2, color: '#9aa3a8' },
    { id: 1, nameTh: 'ศิษย์นอก', dorm: 'dorm_outer', stipend: 5, color: '#8fae8b' },
    { id: 2, nameTh: 'ศิษย์ใน', dorm: 'dorm_inner', stipend: 12, color: '#5ea6d9' },
    { id: 3, nameTh: 'ศิษย์แกนกลาง', dorm: 'dorm_core', stipend: 25, color: '#b07ae0' },
    { id: 4, nameTh: 'ผู้อาวุโส', dorm: 'elder_quarters', stipend: 55, color: '#d9534f' },
    { id: 5, nameTh: 'รองเจ้าสำนัก', dorm: 'elder_quarters', stipend: 85, color: '#f0a030' },
    { id: 6, nameTh: 'เจ้าสำนัก', dorm: 'elder_quarters', stipend: 130, color: '#f6d44a' }
  ];
  SECT.POSTS = {
    martial: { nameTh: 'ผู้อาวุโสหอยุทธ์', hall: 'training_ground', desc: 'ฝึกศิษย์ จัดประลอง กำหนดหลักสูตรยุทธ์' },
    alchemy: { nameTh: 'ผู้อาวุโสหอโอสถ', hall: 'alchemy', desc: 'กำหนดการปรุงโอสถ ดูแลคุณภาพและสต็อกยา' },
    forge: { nameTh: 'ผู้อาวุโสโรงหลอม', hall: 'forge', desc: 'ดูแลหลอมอาวุธ เกราะ ยันต์ ค่ายกล' },
    scripture: { nameTh: 'ผู้อาวุโสหอคัมภีร์', hall: 'scripture', desc: 'คุมตำราวิชา วิจัยตำรับใหม่ ควบคุมการเข้าถึงวิชา' },
    discipline: { nameTh: 'ผู้คุมกฎสำนัก', hall: 'discipline', desc: 'บังคับใช้กฎ ลงโทษ สืบสวนทุจริต' },
    treasury: { nameTh: 'ผู้อาวุโสหอคลัง', hall: 'treasury', desc: 'คุมศิลาวิญญาณ จัดสรรเบี้ยหวัด สั่งซื้อวัตถุดิบ' },
    mission: { nameTh: 'ผู้อาวุโสฝ่ายกิจการนอกสำนัก', hall: 'mission_hall', desc: 'จัดคณะเดินทางนอกสำนัก ค้าขาย ล่าอสูร หาศิษย์ใหม่' },
    guard: { nameTh: 'หัวหน้าองครักษ์', hall: 'gate', desc: 'เฝ้าประตู สำนัก ตรวจตรา ป้องกันศัตรู' },
    registry: { nameTh: 'ผู้อาวุโสหอทะเบียน', hall: 'main_hall', desc: 'พิจารณาผู้สมัครเข้าสำนัก จัดทำทะเบียนศิษย์ แทนเจ้าสำนัก' },
    healer: { nameTh: 'หมอหลวงสำนัก', hall: 'infirmary', desc: 'รักษาผู้บาดเจ็บ ดูแลสุขภาพทั้งสำนัก' }
  };
  SECT.PLANNED_POSTS = {
    diplomacy: { nameTh: 'ฝ่ายการทูต', requires: 'ระบบภารกิจและข้อตกลงทางการทูตที่มอบหมายเฉพาะฝ่าย' },
    intelligence: { nameTh: 'ฝ่ายข่าวกรอง', requires: 'ระบบข่าวและการยืนยันแหล่งข่าว' },
    beastcare: { nameTh: 'ฝ่ายสัตว์วิญญาณ', requires: 'ระบบจับ เลี้ยง และดูแลสัตว์' },
    formation: { nameTh: 'ฝ่ายค่ายกลป้องกัน', requires: 'ระบบค่ายกลประจำพื้นที่และการบำรุงรักษา' },
    disciples: { nameTh: 'ฝ่ายศิษย์สืบทอด', requires: 'ระบบหลักสูตรและการมอบหมายศิษย์รายฝ่าย' }
  };
  Object.assign(SECT.POSTS, {
    commander: { nameTh: 'แม่ทัพสำนัก', hall: 'training_ground', desc: 'ประเมินศัตรู ระดมกำลัง และนำการป้องกันสำนัก' },
    provision: { nameTh: 'ผู้อาวุโสฝ่ายเสบียง', hall: 'main_hall', desc: 'ตรวจอาหารสำรอง วางแผนเพาะปลูกและประกอบอาหาร' },
    herbal: { nameTh: 'ผู้อาวุโสฝ่ายสมุนไพร', hall: 'main_hall', desc: 'ประเมินสมุนไพรที่ขาดและประสานการปลูกหรือเก็บ' },
    wildwarden: { nameTh: 'ผู้อาวุโสฝ่ายลาดตระเวนอสูร', hall: 'gate', desc: 'ตรวจพื้นที่อสูร แจ้งความเสี่ยงและความพร้อมของผู้ล่า' },
    steward: { nameTh: 'ผู้อาวุโสฝ่ายอาคารสถานที่', hall: 'main_hall', desc: 'ตรวจสถานีแออัดและเสนอขยายโดยเจ้าสำนักอนุมัติ' }
  });
  SECT.POST_IDS = Object.keys(SECT.POSTS);
  // A future office becomes assignable only after its implementation joins POSTS.
  SECT.officeState = (W, id) => {
    if (!SECT.POSTS[id]) return { enabled: false, reason: SECT.PLANNED_POSTS[id]?.requires || 'ยังไม่มีระบบรองรับตำแหน่งนี้' };
    const min = id === 'commander' ? 12 : ['provision', 'herbal', 'wildwarden', 'steward'].includes(id) ? 16 : 0;
    const pop = W.npcs.filter(n => !n.dead && !n.exiled).length;
    return { enabled: pop >= min, reason: pop < min ? 'รอสมาชิกอย่างน้อย ' + min + ' คน' : '' };
  };

  SECT.rankOf = npc => SECT.RANKS[npc.rank];
  SECT.title = npc => npc.rank === 6 ? 'เจ้าสำนัก' : npc.rank === 5 ? 'รองเจ้าสำนัก' : npc.post ? SECT.POSTS[npc.post].nameTh : npc.assist ? 'ผู้ช่วย' + SECT.POSTS[npc.assist].nameTh.replace(/^ผู้อาวุโส|^หัวหน้า|^หมอหลวง/, '') : SECT.RANKS[npc.rank].nameTh;

  /* ---------- สไตล์การปกครอง = ฟังก์ชันของตัวตน ---------- */
  function mix(npc, list) { // list: ['path', w] (w<0 = กลับค่า)
    let s = 0, wsum = 0;
    list.forEach(([p, w]) => { const v = HC.eff(npc, p); s += (w >= 0 ? v : 100 - v) * Math.abs(w); wsum += Math.abs(w); });
    return clamp(s / wsum, 0, 100);
  }
  SECT.styleOf = npc => {
    const d = HC.derived(npc);
    const st = {
      openness: mix(npc, [['personality.trustfulness', .3], ['personality.empathy', .2], ['personality.curiosity', .25], ['personality.caution', -.2], ['personality.pride', -.15]]),
      strictness: mix(npc, [['personality.discipline', .3], ['personality.integrity', .15], ['personality.aggression', .2], ['personality.empathy', -.25], ['personality.pride', .1], ['personality.composure', .05]]),
      meritocracy: mix(npc, [['personality.rationality', .3], ['personality.integrity', .3], ['values.familyClan', -.2], ['personality.loyalty', -.05], ['intellect.judgement', .15]]),
      expansion: mix(npc, [['personality.ambition', .3], ['personality.courage', .2], ['values.powerStatus', .25], ['personality.aggression', .1], ['personality.caution', -.2]]),
      generosity: mix(npc, [['personality.empathy', .35], ['values.wealthResource', -.3], ['values.familyClan', .1], ['personality.integrity', .1], ['personality.trustfulness', .15]]),
      secrecy: mix(npc, [['personality.caution', .3], ['personality.trustfulness', -.25], ['personality.pride', .15], ['values.powerStatus', .15], ['personality.curiosity', -.1]]),
      risk: d.riskTolerance
    };
    const raw = {
      martial: HC.eff(npc, 'values.martialPeak') * .6 + HC.eff(npc, 'personality.aggression') * .2 + HC.eff(npc, 'interests.combat') * .2,
      craft: HC.eff(npc, 'values.knowledgeCraft') * .45 + HC.eff(npc, 'personality.creativity') * .2 + (HC.eff(npc, 'interests.alchemy') + HC.eff(npc, 'interests.forging')) * .175,
      scholar: HC.eff(npc, 'personality.curiosity') * .35 + HC.eff(npc, 'personality.rationality') * .25 + HC.eff(npc, 'interests.scholarship') * .4,
      commerce: HC.eff(npc, 'values.wealthResource') * .5 + HC.eff(npc, 'aptitudes.socialCommerce') * .25 + HC.eff(npc, 'interests.trade') * .25,
      faith: HC.eff(npc, 'values.honorLegacy') * .35 + HC.eff(npc, 'values.sectDuty') * .35 + HC.eff(npc, 'interests.worship') * .3
    };
    let tot = 0; const f = {};
    Object.keys(raw).forEach(k => { f[k] = Math.pow(Math.max(5, raw[k]) / 50, 3); tot += f[k]; });
    Object.keys(f).forEach(k => f[k] /= tot);
    st.focus = f;
    return st;
  };
  SECT.initPolicy = W => {
    const m = W.byId[W.sect.masterId]; const t = SECT.styleOf(m);
    return JSON.parse(JSON.stringify(t));
  };
  SECT.targetPolicy = W => {
    const m = W.byId[W.sect.masterId], dp = W.byId[W.sect.deputyId];
    const els = SECT.POST_IDS.map(p => W.byId[W.sect.posts[p]]).filter(Boolean);
    const sm = SECT.styleOf(m), sd = dp ? SECT.styleOf(dp) : sm;
    const se = els.map(SECT.styleOf);
    const out = { focus: {} };
    ['openness', 'strictness', 'meritocracy', 'expansion', 'generosity', 'secrecy', 'risk'].forEach(k => {
      const e = se.length ? se.reduce((s, x) => s + x[k], 0) / se.length : sm[k];
      out[k] = sm[k] * 0.78 + sd[k] * 0.14 + e * 0.08;
    });
    Object.keys(sm.focus).forEach(k => { const e = se.length ? se.reduce((s, x) => s + x.focus[k], 0) / se.length : sm.focus[k]; out.focus[k] = sm.focus[k] * 0.78 + (dp ? sd.focus[k] : sm.focus[k]) * 0.14 + e * 0.08; });
    return out;
  };
  SECT.policyLabel = (k, v) => {
    const t = v >= 72 ? 'สูงมาก' : v >= 58 ? 'สูง' : v >= 42 ? 'กลาง' : v >= 28 ? 'ต่ำ' : 'ต่ำมาก';
    return t;
  };
  SECT.POLICY_TH = { openness: 'เปิดรับคนนอก', strictness: 'เข้มงวดกฎ', meritocracy: 'ยึดความสามารถ', expansion: 'ขยายอิทธิพล', generosity: 'ใจกว้างแจกจ่าย', secrecy: 'หวงวิชา', risk: 'กล้าเสี่ยง' };
  SECT.FOCUS_TH = { martial: 'ยุทธ์', craft: 'หัตถศิลป์', scholar: 'ปราชญ์', commerce: 'ค้าขาย', faith: 'ศรัทธา-สืบทอด' };

  /* ---------- ตำแหน่ง ---------- */
  SECT.relevance = (post, n) => {
    const e = p => HC.eff(n, p), sk = n.h.skills;
    const martial = Math.max(sk.SWORD, sk.BLADE, sk.SPEAR, sk.FIST_PALM, sk.BODY_REFINING);
    const stage = n.cult ? n.cult.stage : 0;
    switch (post) {
      case 'commander': return e('social.leadership') * .3 + e('intellect.judgement') * .25 + e('personality.courage') * .2 + e('personality.loyalty') * .15 + stage * 4;
      case 'provision': return (sk.cooking || 0) * .35 + e('intellect.planning') * .25 + e('intellect.numeracy') * .15 + e('personality.discipline') * .25;
      case 'herbal': return (sk.herbalism || 0) * .4 + e('interests.herbs') * .25 + e('intellect.planning') * .2 + e('personality.caution') * .15;
      case 'wildwarden': return (sk.survival || 0) * .3 + e('intellect.perceptiveness') * .25 + e('intellect.judgement') * .25 + e('personality.courage') * .2;
      case 'steward': return (sk.administration || 0) * .3 + e('interests.building') * .25 + e('intellect.planning') * .3 + e('personality.integrity') * .15;
      case 'martial': return martial * .35 + e('aptitudes.combat') * .2 + e('social.teaching') * .2 + stage * 6 + e('personality.discipline') * .1;
      case 'alchemy': return sk.ALCHEMY * .45 + e('aptitudes.crafting') * .2 + e('intellect.reasoning') * .1 + e('interests.alchemy') * .1 + stage * 3;
      case 'forge': return sk.FORGING * .4 + (sk.ARRAY + sk.TALISMAN) * .1 + e('aptitudes.crafting') * .2 + e('physiology.dexterity') * .1 + stage * 3;
      case 'scripture': return sk.SCRIPTURE * .35 + e('intellect.comprehension') * .25 + e('intellect.memory') * .15 + e('values.knowledgeCraft') * .1 + stage * 3;
      case 'discipline': return e('personality.integrity') * .25 + e('personality.discipline') * .2 + e('social.intimidation') * .15 + e('intellect.perceptiveness') * .15 + martial * .1 + stage * 4 + e('personality.empathy') * -.05 + 5;
      case 'treasury': return e('intellect.numeracy') * .25 + sk.trading * .2 + sk.administration * .25 + e('personality.integrity') * .2 + e('personality.caution') * .1;
      case 'mission': return e('intellect.planning') * .25 + e('social.leadership') * .2 + sk.survival * .15 + sk.diplomacy * .1 + e('intellect.judgement') * .2 + stage * 3;
      case 'guard': return martial * .25 + e('intellect.perceptiveness') * .2 + e('social.leadership') * .15 + e('personality.courage') * .2 + stage * 6;
      case 'registry': return e('intellect.judgement') * .25 + e('intellect.readPeople') * .25 + sk.administration * .2 + e('personality.integrity') * .15 + e('personality.empathy') * .1 + stage * 2;
      case 'healer': return sk.MEDICINE * .45 + e('personality.empathy') * .2 + sk.ALCHEMY * .1 + e('aptitudes.crafting') * .1 + e('affinities.MEDICINE') * .1;
    }
    return 0;
  };
  SECT.holder = (W, post) => { const id = W.sect.posts[post]; return id ? W.byId[id] : null; };
  SECT.alive = n => n && !n.dead;
  SECT.isOfficerAvailable = (W, n) => Boolean(n && !n.dead && !n.exiled && !n.away && !n.sealed && !n.sealedBt && !(n.jail > W.t) && !(n.punished > W.t));

  SECT.appointScore = (W, post, n, by) => {
    const pol = W.sect.policy, rel = by ? SECT.relationScore(by, n) : 0;
    const flat = (by && g.COG && g.COG.flatteryBonus) ? g.COG.flatteryBonus(by, n) : 0;
    const merit = SECT.relevance(post, n) + (n.rank >= 3 ? 8 : 0) + (n.merit || 0) * 0.03;
    const meritK = 0.35 + pol.meritocracy / 100 * 0.65;
    return merit * meritK + (rel + flat * 1.2) * (1 - meritK) * 0.55 + (n.cult ? n.cult.stage * 2 : 0) - (n.h.state.heartDemon > 40 ? 6 : 0);
  };
  SECT.relationScore = (a, b) => { const r = a.h.mind.relations[b.id]; return r ? r.a * 0.6 + r.t * 0.2 + r.r * 0.2 : 0; };
  SECT.eligible = (W, post, n) => { if (!SECT.officeState(W, post).enabled) return false; const small = W.npcs.length < 14; return !n.dead && !n.away && !n.sealed && !n.sealedBt && !(n.jail > W.t) && n.rank >= (small ? 1 : 2) && n.id !== W.sect.masterId && n.id !== W.sect.deputyId && !n.post && (n.cult ? n.cult.stage >= (small ? 1 : 2) : n.rank >= 3) && !n.exiled; };
  SECT.appoint = (W, post, n, why) => {
    if (!SECT.officeState(W, post).enabled) return false;
    const old = SECT.holder(W, post); if (old && old.id === n.id) return;
    if (old) { old.post = null; if (old.rank === 4) old.rank = 3; }
    n.post = post; n.assist = null; if (n.rank < 4) n.rank = 4;
    W.sect.posts[post] = n.id; n.sat = Math.min(100, (n.sat || 60) + 12);
    HC.experience(n, 'promoted', 1);
    SECT.reassignBed(W, n);
    W.log('appoint', n.h.name.given + ' ได้รับตำแหน่ง' + SECT.POSTS[post].nameTh + (why ? ' — ' + why : ''), [n.id]);
    SECT.resentOthers(W, post, n);
  };
  SECT.dismiss = (W, post, why) => {
    const n = SECT.holder(W, post); if (!n) return;
    n.post = null; if (n.rank === 4) n.rank = 3; W.sect.posts[post] = null;
    n.sat = Math.max(0, (n.sat || 60) - 18); HC.experience(n, 'punished_fair', 0.6);
    W.log('dismiss', n.h.name.given + ' พ้นจากตำแหน่ง' + SECT.POSTS[post].nameTh + (why ? ' — ' + why : ''), [n.id]);
  };
  // คนที่อยากได้ตำแหน่งแต่ไม่ได้ จะน้อยใจ (ขึ้นกับความทะเยอทะยานและความสามารถ) → ปมความขัดแย้งทางการเมือง
  SECT.resentOthers = (W, post, winner) => {
    W.npcs.forEach(n => {
      if (n.dead || n.id === winner.id || n.rank < 3 || n.post) return;
      const want = (HC.eff(n, 'personality.ambition') + HC.eff(n, 'values.powerStatus')) / 2;
      const rel = SECT.relevance(post, n), wrel = SECT.relevance(post, winner);
      if (want > 55 && rel > wrel - 6) {
        n.sat = Math.max(0, (n.sat || 60) - (want - 50) * 0.18);
        const r = SECT.rel(n, winner.id); r.v = Math.min(100, r.v + 6); r.a -= 3;
        if (rel > wrel + 4) W.log('politics', n.h.name.given + ' ไม่พอใจที่ ' + winner.h.name.given + ' ได้ตำแหน่ง' + SECT.POSTS[post].nameTh + ' ทั้งที่ตนเก่งกว่า', [n.id, winner.id]);
      }
    });
  };
  SECT.rel = (a, bid) => a.h.mind.relations[bid] || (a.h.mind.relations[bid] = { a: 0, t: 40, r: 30, l: 0, v: 0, n: 0, last: 0, bond: '' });

  SECT.reassignBed = (W, n) => { n.bed = null; };

  SECT.setRank = (W, n, rank, why) => {
    const old = n.rank; if (old === rank) return;
    n.rank = rank; n.sat = Math.min(100, (n.sat || 60) + (rank > old ? 10 : -15));
    W.log(rank > old ? 'promote' : 'demote', n.h.name.given + (rank > old ? ' เลื่อนเป็น' : ' ถูกลดเป็น') + SECT.RANKS[rank].nameTh + (why ? ' — ' + why : ''), [n.id]);
    HC.experience(n, rank > old ? 'promoted' : 'punished_fair', 0.8);
    if (rank > old) W.fame(2 + rank);
    n.bed = null;
  };

  /* ---------- ความพึงพอใจต่อสำนัก ---------- */
  SECT.satTarget = (W, n) => {
    const pol = W.sect.policy, e = p => HC.eff(n, p);
    let s = 55;
    s += (pol.generosity - 50) * (e('values.wealthResource') / 100 - 0.2) * 0.35;
    s -= Math.max(0, pol.strictness - 50) * (e('values.freedom') / 100) * 0.55;
    s += Math.max(0, pol.strictness - 50) * (e('personality.discipline') - 50) / 100 * 0.25;
    s += (pol.meritocracy - 50) * (e('personality.ambition') - 50) / 100 * 0.3;
    s -= Math.max(0, pol.secrecy - 50) * (e('personality.curiosity') - 50) / 100 * 0.3;
    s += (e('values.sectDuty') - 50) * 0.15 + (e('personality.loyalty') - 50) * 0.18;
    s += (n.h.state.mood) * 0.12;
    s += (W.sect.stipendOk ? 3 : -10);
    if (n.rank >= 3) s += 3;
    s -= Math.max(0, (n.h.state.stress - 50)) * 0.2;
    s -= (n.grief || 0);
    return clamp(s, 5, 95);
  };

  /* ---------- เบี้ยหวัดรายเดือน ---------- */
  SECT.paySalaries = W => {
    const gen = (0.45 + W.sect.policy.generosity / 100 * 1.1) * 0.4;
    let total = 0; const list = [];
    W.npcs.forEach(n => { if (n.dead || n.exiled) return; const amt = Math.round(SECT.RANKS[n.rank].stipend * gen * (n.post ? 1.2 : 1)); list.push([n, amt]); total += amt; });
    const ok = W.sect.stones >= total;
    const k = ok ? 1 : Math.max(0, W.sect.stones) / Math.max(1, total);
    list.forEach(([n, amt]) => { const pay = Math.round(amt * k); n.inv.stones += pay; });
    const paid = Math.round(total * k);
    W.sect.stones -= paid; W.sect.ledger.push({ t: W.t, amt: -paid, why: 'เบี้ยหวัดรายเดือน' }); if (W._tally) W._tally('-เบี้ยหวัดรายเดือน', paid);
    W.sect.stipendOk = ok;
    if (!ok) W.log('finance', 'คลังไม่พอจ่ายเบี้ยหวัดเต็ม จ่ายได้ ' + Math.round(k * 100) + '%', []);
    W.sect.lastPayroll = paid;
    return paid;
  };

  /* ---------- สภาประจำวัน: เจ้าสำนักตัดสินใจตามตัวตน ---------- */
  SECT.daily = W => {
    SECT.decayFacilityDemand(W);
    const S = W.sect, m = W.byId[S.masterId];
    if (!m || m.dead) { SECT.succession(W, 'เจ้าสำนักว่าง'); return; }
    // Ensure applicant queue is always processed if registrar or deputy is available even during master seclusion
    if (S.sealedUntil && W.t < S.sealedUntil) {
      SECT.processApplicants(W, m);
      SECT.runByDeputy(W);
      return;
    }
    // 1) ตำแหน่งว่าง
    SECT.POST_IDS.forEach(post => {
      const h = SECT.holder(W, post);
      if (h && (h.dead || h.exiled)) { S.posts[post] = null; }
    });
    const vacant = SECT.POST_IDS.filter(p => SECT.officeState(W, p).enabled && !SECT.holder(W, p));
    if (vacant.length && W.rng.chance(0.5)) {
      const post = (vacant.includes('registry') && W.npcs.length >= 6 && W.rng.chance(0.6)) ? 'registry' : W.rng.pick(vacant);
      const cands = W.npcs.filter(n => SECT.eligible(W, post, n));
      if (cands.length) {
        cands.sort((a, b) => SECT.appointScore(W, post, b, m) - SECT.appointScore(W, post, a, m));
        const win = cands[0], sc = SECT.appointScore(W, post, win, m);
        if (sc > (W.npcs.length < 14 ? 13 : 28)) {
          const fav = SECT.relationScore(m, win);
          SECT.appoint(W, post, win, fav > 30 && S.policy.meritocracy < 45 ? 'เจ้าสำนักไว้ใจเป็นพิเศษ' : 'ความสามารถสูงสุดในสำนัก');
        }
      }
    }
    // 2) รองเจ้าสำนัก
    if (!S.deputyId || !W.byId[S.deputyId] || W.byId[S.deputyId].dead || W.byId[S.deputyId].exiled) {
      S.deputyId = null;
      const cands = W.npcs.filter(n => !n.dead && !n.away && !n.exiled && n.rank >= 3 && n.id !== m.id && n.cult && n.cult.stage >= 3);
      if (cands.length && W.rng.chance(0.5)) {
        cands.sort((a, b) => (SECT.relationScore(m, b) * (1 - S.policy.meritocracy / 100) + (b.cult.stage * 8 + SECT.relevance('mission', b) * .3) * (S.policy.meritocracy / 100 + .3)) - (SECT.relationScore(m, a) * (1 - S.policy.meritocracy / 100) + (a.cult.stage * 8 + SECT.relevance('mission', a) * .3) * (S.policy.meritocracy / 100 + .3)));
        const d = cands[0]; if (d.post) { S.posts[d.post] = null; d.post = null; }
        d.rank = 5; S.deputyId = d.id; d.sat = Math.min(100, (d.sat || 60) + 15); HC.experience(d, 'promoted', 1.2);
        W.log('appoint', d.h.name.given + ' ได้เป็นรองเจ้าสำนัก', [d.id]);
      }
    }
    // 3) เลื่อนขั้นศิษย์ (เจ้าสำนักเลือกตามนโยบาย)
    if (W.day % 3 === 0) SECT.reviewPromotions(W);
    SECT.processApplicants(W, m);
    // 4) การตัดสินใจเชิงนโยบายของเจ้าสำนัก
    SECT.masterDecision(W, m);
    // 5) หัวหน้าหอสั่งงานของตน
    SECT.hallHeads(W);
  };

  /* ---------- พิจารณาผู้สมัคร: ประเมินจากความสามารถปัจจุบันที่สังเกตได้ (CA) เท่านั้น ไม่รั่วไหล PA ---------- */
  SECT.examineApplicant = (W, who, n) => {
    const ca = SECT.observableCapability(W, n);
    const e = p => who ? HC.eff(who, p) : 50;
    const eye = (e('intellect.readPeople') * 0.45 + e('intellect.judgement') * 0.35 + (who && who.h && who.h.skills ? (who.h.skills.administration || 0) * 0.2 : 0));
    const noiseStd = Math.max(1.5, (100 - eye) / 9 + 1.5);
    const noise = (W && W.rng && W.rng.gauss) ? W.rng.gauss(0, noiseStd) : 0;
    let bias = 0;
    const cls = (n && n.h && n.h.origin && n.h.origin.cls) || '';
    bias += (e('personality.empathy') - 50) / 12 * (cls === 'ยาจก' || /ยาก|ทาส|กำพร้า/.test(cls) ? 1 : 0.25);
    bias -= (e('personality.pride') - 50) / 14 * (ca.caScore < 44 ? 1 : 0);
    if (ca.demeanorScore >= 58 && e('personality.discipline') >= 55) bias += 2.2;
    const score = ca.caScore + noise + bias;
    return {
      score,
      ca,
      eye: Math.round(eye),
      roleFit: ca.roleFit,
      bestRoleTh: ca.bestRoleTh,
      summaryTh: ca.summaryTh
    };
  };

  SECT.appraise = (W, who, n) => {
    return SECT.examineApplicant(W, who, n).score;
  };

  SECT.sanitizeQueue = W => {
    if (!W || !W.sect) return [];
    if (!Array.isArray(W.sect.queue)) W.sect.queue = [];
    const seen = new Set();
    const cleaned = [];
    for (const a of W.sect.queue) {
      if (!a || typeof a !== 'object' || !a.id || !a.h || a.dead || a.exiled) continue;
      if (W.byId && W.byId[a.id]) continue; // already registered member
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      if (!Number.isFinite(a.joinDay)) a.joinDay = W.day || 1;
      cleaned.push(a);
    }
    if (cleaned.length > SECT.MAX_QUEUE) cleaned.length = SECT.MAX_QUEUE;
    W.sect.queue = cleaned;
    return cleaned;
  };

  SECT.processApplicants = (W, m) => {
    if (!W || !W.sect) return;
    const S = W.sect;
    const stats = S.recruitmentStats || (S.recruitmentStats = { generated: 0, driveGenerated: 0, normalGenerated: 0, admitted: 0, rejected: 0, deferred: 0, expired: 0, tiers: {}, tierCounts: {} }); stats.tiers = stats.tiers || {}; stats.tierCounts = stats.tiers;
    const q = SECT.sanitizeQueue(W);
    if (!q.length) return;

    // Expire applicants who have waited > 14 days first
    for (let i = q.length - 1; i >= 0; i--) {
      if (W.day - (q[i].joinDay || 0) > 14) {
        const expNpc = q[i];
        q.splice(i, 1);
        stats.expired = (stats.expired || 0) + 1;
        W.log('recruit', expNpc.h.name.given + ' รอการพิจารณาเกินกำหนดและเดินทางกลับไป', []);
      }
    }
    if (!q.length) return;

    // Determine available reviewing officer: registry elder -> master -> deputy
    const reg = SECT.holder(W, 'registry');
    const master = m || W.byId[S.masterId];
    const dep = W.byId[S.deputyId];
    const who = SECT.isOfficerAvailable(W, reg) ? reg : SECT.isOfficerAvailable(W, master) ? master : SECT.isOfficerAvailable(W, dep) ? dep : null;
    if (!who) return;

    let pop = SECT.memberOccupancy(W);
    const cap = SECT.housingCapacity(W);
    if (pop >= cap) return; // Keep queued applicants waiting when beds are full

    const food = (ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3) / Math.max(1, pop + 1);
    const pol = S.policy || { meritocracy: 50, openness: 50, strictness: 50 };
    let handled = 0;

    for (let i = 0; i < q.length && handled < SECT.MAX_QUEUE && pop < cap;) {
      const a = q[i];
      handled++;
      const thr = 48 + (pol.meritocracy - 50) * 0.22 - (pol.openness - 50) * 0.28 - (pop < 12 ? 6 : pop < 24 ? 3 : 0) + (food < 4 ? 14 : 0) + (pol.strictness - 50) * 0.08;
      const score = SECT.appraise(W, who, a);
      const ca = SECT.observableCapability(W, a);
      const ok = W.rng.next() < 1 / (1 + Math.exp(-(score - thr) / 6)) && pop < cap;
      const waited = W.day - (a.joinDay || W.day);

      if (!ok && waited < 6 && pop < cap && W.rng.chance(0.42)) {
        stats.deferred = (stats.deferred || 0) + 1;
        i++;
        continue; // ขอดูตัวอีกสักพัก
      }
      q.splice(i, 1);
      if (ok && pop < cap) {
        g.SIM.register(W, a);
        pop = SECT.memberOccupancy(W);
        a.joinDay = W.day;
        a.sat = 72;
        a.rank = 0;
        a.merit = 0;
        a.x = MAP.EXIT.x + .5 + W.rng.next();
        a.y = MAP.EXIT.y + .5;
        a.px = a.x;
        a.py = a.y;
        a.travel = { to: 'home' };
        a.path = null;
        stats.admitted = (stats.admitted || 0) + 1;
        const roleLabel = who === master ? 'เจ้าสำนัก ' : who === dep ? 'รองเจ้าสำนัก ' : SECT.POSTS.registry.nameTh + ' ';
        W.log('recruit', a.h.name.given + ' ผ่านการพิจารณาของ' + roleLabel + who.h.name.given + ' เข้าเป็นผู้ฝึกหัด (' + a.h.origin.cls + ' จาก' + a.h.origin.region + ' · ' + ca.bestRoleTh + ')', [a.id, who.id]);
        who.merit = (who.merit || 0) + 1.5;
      } else {
        stats.rejected = (stats.rejected || 0) + 1;
        W.log('recruit', who.h.name.given + ' ไม่รับ ' + a.h.name.given + ' เข้าสำนัก' + (pop >= cap ? ' (ที่พักเต็ม)' : ' (พื้นฐานยังไม่พร้อม)'), [who.id]);
        W.fame(-0.05);
      }
    }
  };

  SECT.runByDeputy = W => { const d = W.byId[W.sect.deputyId]; if (d && !d.dead) SECT.hallHeads(W); };

  SECT.reviewPromotions = W => {
    const S = W.sect, m = W.byId[S.masterId], mer = S.policy.meritocracy / 100;
    const cnt = r => W.npcs.filter(n => !n.dead && !n.exiled && n.rank === r).length;
    const innerCap = W.map && W.map.byId && W.map.byId.dorm_inner ? Math.max(18, W.map.byId.dorm_inner.stations.length) : 18;
    const coreCap = W.map && W.map.byId && W.map.byId.dorm_core ? Math.max(8, W.map.byId.dorm_core.stations.length) : 8;
    const cap = { inner: innerCap, core: coreCap };
    const cands = W.npcs.filter(n => !n.dead && !n.away && !n.exiled && n.rank <= 2).map(n => {
      const stage = n.cult ? n.cult.stage : 0;
      const need = n.rank === 0 ? 1 : n.rank === 1 ? 2 : 3;
      const days = W.day - (n.joinDay || 0);
      const can = n.rank === 0 ? days >= 20 && (stage >= 1 || days >= 60) : stage >= need && days >= 40 + n.rank * 60 && n.merit >= (n.rank === 1 ? 60 : 160);
      const favor = m ? SECT.relationScore(m, n) : 0;
      const score = can ? (stage * 10 + n.merit * 0.1) * (0.4 + mer * 0.6) + favor * (1 - mer) * 0.5 : -999;
      return { n, can, score };
    }).filter(x => x.can).sort((a, b) => b.score - a.score);
    for (const x of cands.slice(0, 2)) {
      const n = x.n;
      if (n.rank === 1 && cnt(2) >= cap.inner) continue;
      if (n.rank === 2 && cnt(3) >= cap.core) continue;
      SECT.setRank(W, n, n.rank + 1, n.rank === 0 ? 'ผ่านการทดลอง' : 'ผลงานและตบะถึงเกณฑ์');
    }
  };

  /* ---------- การตัดสินใจเชิงนโยบายของเจ้าสำนัก ---------- */
  SECT.masterDecision = (W, m) => {
    const S = W.sect, e = p => HC.eff(m, p), pol = S.policy;
    S.cd = S.cd || {};
    const opts = [];
    const cd = k => (S.cd[k] || 0) > W.day;
    const pop = SECT.memberOccupancy(W);
    const bedCap = SECT.housingCapacity(W);
    // งานเลี้ยง
    if (!cd('banquet')) opts.push({ k: 'banquet', u: (e('interests.socializing') + e('values.familyClan') + e('personality.empathy')) / 300 + (50 - W.avgMood) / 150 + (S.stones > 1500 ? .1 : -.3), run: () => SECT.banquet(W, m) });
    // ประลองยุทธ์
    if (!cd('tournament')) opts.push({ k: 'tournament', u: (e('values.martialPeak') + e('interests.combat') + e('values.powerStatus')) / 300 + pol.focus.martial * .3 - .1, run: () => SECT.tournament(W, m) });
    // ปิดด่าน
    if (!cd('seclusion') && m.cult && CULT.ready(m)) opts.push({ k: 'seclusion', u: .55 + (e('values.martialPeak') - 50) / 200, run: () => SECT.seclusion(W, m) });
    // ขยายอาคาร
    if (!cd('upgrade')) opts.push({ k: 'upgrade', u: (e('interests.building') + e('personality.ambition') + e('values.powerStatus')) / 400 + (pop >= bedCap * 0.8 ? .42 : 0) + (S.stones > 2500 ? .2 : -.25), run: () => SECT.upgradeBuilding(W, m) });
    // วิจัยตำรับ
    if (!cd('research')) opts.push({ k: 'research', u: (e('values.knowledgeCraft') + e('interests.scholarship') + e('personality.curiosity')) / 300 + pol.focus.scholar * .3 - .15, run: () => SECT.startResearch(W, m) });
    // เปิดรับศิษย์
    const qLen = Array.isArray(S.queue) ? S.queue.length : 0;
    if (!cd('drive') && pop < bedCap && qLen < SECT.MAX_QUEUE) opts.push({ k: 'drive', u: (pol.openness - 40) / 120 + (pop < 28 ? .32 : pop < bedCap * 0.82 ? .18 : -.5) + (pol.expansion - 50) / 200, run: () => SECT.recruitDrive(W, m) });
    // รับศิษย์ส่วนตัว
    if (!cd('discipleOf')) opts.push({ k: 'discipleOf', u: (e('social.teaching') + e('personality.empathy') + e('values.honorLegacy')) / 300 - (m.h.life.family.disciples.length > 1 ? .4 : 0), run: () => SECT.takePersonalDisciple(W, m) });
    // ตรวจทุจริต
    if (!cd('audit')) opts.push({ k: 'audit', u: (e('personality.caution') + e('personality.integrity') + (100 - e('personality.trustfulness'))) / 300 - .2 + (S.suspicion || 0) / 100, run: () => SECT.audit(W, m) });
    if (!opts.length) return;
    opts.forEach(o => { if (g.COG) o.u += g.COG.officeBias(W, m, o.k); o.u += W.rng.float(-.08, .08); });
    opts.sort((a, b) => b.u - a.u);
    const thought = clamp((HC.eff(m, 'personality.rationality') + HC.eff(m, 'intellect.judgement')) / 200, 0, 1);
    const pick = thought > .8 ? opts[0] : W.rng.weighted(opts.slice(0, 3), o => Math.exp((o.u - opts[0].u) / (.08 + (1 - thought) * .22)));
    if (pick.u > 0.36 && W.rng.chance(0.35)) {
      S.cd[pick.k] = W.day + ({ banquet: 60, tournament: 90, seclusion: 30, upgrade: 45, research: 40, drive: 50, discipleOf: 120, audit: 50 }[pick.k] || 30);
      if (g.COG) g.COG.officeDecision(W, m, pick.k, ['พิจารณาจากนโยบาย สถานการณ์ และนิสัยของเจ้าสำนัก']);
      pick.run();
    }
  };

  SECT.banquet = (W, m) => {
    const cost = Math.round(W.npcs.filter(n => !n.dead).length * 6);
    if (!ECO.pay(W, cost, 'งานเลี้ยงสำนัก')) return;
    W.sect.festival = { until: W.t + 6 * 60, kind: 'banquet', at: 'plaza' };
    W.log('decision', m.h.name.given + ' ประกาศจัดงานเลี้ยงที่ลานกลาง (ใช้ ' + cost + ' ศิลา) เพื่อสร้างขวัญกำลังใจ', [m.id]);
    W.npcs.forEach(n => { if (!n.dead) { n.sat = Math.min(100, (n.sat || 60) + 3); } });
  };
  SECT.tournament = (W, m) => {
    W.sect.tournament = { start: W.t + 24 * 60, state: 'announce', rounds: 0, entrants: [], winnerId: null, prize: Math.round(80 + W.sect.policy.generosity) };
    W.log('decision', m.h.name.given + ' ประกาศจัดประลองยุทธ์สำนักในอีก 1 วัน รางวัล ' + W.sect.tournament.prize + ' ศิลา', [m.id]);
  };
  SECT.seclusion = (W, m) => {
    const d = 12 + W.rng.int(0, 12);
    W.sect.sealedUntil = W.t + d * 1440; m.sealed = true; m.sealEnd = W.sect.sealedUntil;
    W.log('decision', m.h.name.given + ' ปิดด่านเพื่อทะลวงขั้น ' + d + ' วัน รองเจ้าสำนักและผู้อาวุโสดูแลกิจการ', [m.id]);
  };
  const ACT_TO_BLD = {
    sleep: 'dorm_outer',
    cultivate: 'meditation_hall',
    meditate: 'meditation_hall',
    brew: 'alchemy',
    brewBasic: 'alchemy',
    personalBrew: 'alchemy',
    forge: 'forge',
    farm: 'farm',
    mine: 'mine',
    eat: 'canteen',
    cook: 'canteen',
    read: 'scripture',
    study: 'scripture',
    guidedStudy: 'scripture',
    heal: 'infirmary',
    treat: 'infirmary',
    practice: 'training_ground',
    spar: 'training_ground',
    train: 'training_ground',
    shop: 'market',
    browse: 'market'
  };

  SECT.ensureFacilityDemand = W => {
    const S = W.sect;
    if (!S) return null;
    if (!S.facilityDemand) S.facilityDemand = {};
    if (W.map && W.map.buildings) {
      W.map.buildings.forEach(b => {
        if (!S.facilityDemand[b.id]) {
          S.facilityDemand[b.id] = {
            failedAttempts: 0,
            unmetDemands: 0,
            congestedHours: 0,
            consecutiveCongestionDays: 0,
            lastCongestionHour: 0,
            occupancyHistory: [],
            lastEvaluatedDay: 0,
            lastUpgradedDay: 0
          };
        }
      });
    }
    return S.facilityDemand;
  };

  SECT.decayFacilityDemand = W => {
    const S = W.sect;
    if (!S || !S.facilityDemand) return;
    for (const bid in S.facilityDemand) {
      const fd = S.facilityDemand[bid];
      const lastH = fd.lastCongestionHour || 0;
      const daysSince = lastH > 0 ? (W.t - lastH) / 1440 : 999;
      if (daysSince >= 2) {
        fd.failedAttempts = 0;
        fd.unmetDemands = 0;
        fd.congestedHours = 0;
      } else if (daysSince >= 1) {
        fd.failedAttempts = Math.max(0, Math.floor((fd.failedAttempts || 0) * 0.5));
        fd.unmetDemands = Math.max(0, Math.floor((fd.unmetDemands || 0) * 0.5));
        fd.congestedHours = Math.max(0, Math.floor((fd.congestedHours || 0) * 0.5));
      }
    }
  };

  SECT.recordFacilityDemand = (W, bldOrAct, reason, npc) => {
    SECT.ensureFacilityDemand(W);
    let bid = ACT_TO_BLD[bldOrAct] || bldOrAct;
    if (npc && bldOrAct === 'sleep') {
      bid = npc.rank >= 3 ? 'dorm_core' : npc.rank >= 2 ? 'dorm_inner' : 'dorm_outer';
    }
    const b = W.map && W.map.byId && W.map.byId[bid];
    if (!b) return;
    const fd = W.sect.facilityDemand[bid];
    if (!fd) return;
    fd.failedAttempts = (fd.failedAttempts || 0) + 1;
    fd.unmetDemands = (fd.unmetDemands || 0) + 1;
    fd.lastCongestionHour = W.t;
  };

  SECT.upgradeBuilding = (W, m) => {
    SECT.ensureFacilityDemand(W);
    const S = W.sect, pol = S.policy, pop = SECT.memberOccupancy(W);
    const totalBedCap = SECT.housingCapacity(W);
    const cashReserve = Math.max(500, pop * 25) + 800;
    const wants = ['dorm_outer', 'dorm_inner', 'dorm_core', 'meditation_hall', 'alchemy', 'forge', 'herb_garden', 'farm', 'mine', 'canteen', 'infirmary', 'training_ground', 'scripture', 'tea_garden', 'shrine', 'market'];

    const underConstruction = wants.some(id => W.map.byId[id] && W.map.byId[id].building);
    if (underConstruction) return;

    const outerCount = W.npcs.filter(n => !n.dead && !n.exiled && n.rank <= 1).length;
    const innerCount = W.npcs.filter(n => !n.dead && !n.exiled && n.rank === 2).length;
    const coreCount = W.npcs.filter(n => !n.dead && !n.exiled && n.rank >= 3).length;

    let best = null, bs = -1, bestBlockedByTreasury = null;

    wants.forEach(id => {
      const b = W.map.byId[id];
      const maxL = SECT.maxBuildingLevel(b);
      if (!b || b.level >= maxL || b.building) return;

      const fd = S.facilityDemand[id] || {};
      if (W.day - (fd.lastUpgradedDay || 0) < 20) return;

      const cost = SECT.upgradeCost(b);
      let s = W.rng.next() * 0.15;
      const reasons = [];

      const lastH = fd.lastCongestionHour || 0;
      const daysSince = lastH > 0 ? (W.t - lastH) / 1440 : 999;
      const effFailed = daysSince >= 2 ? 0 : daysSince >= 1 ? Math.floor((fd.failedAttempts || 0) * 0.5) : (fd.failedAttempts || 0);
      const effUnmet = daysSince >= 2 ? 0 : daysSince >= 1 ? Math.floor((fd.unmetDemands || 0) * 0.5) : (fd.unmetDemands || 0);
      const effCongested = daysSince >= 2 ? 0 : daysSince >= 1 ? Math.floor((fd.congestedHours || 0) * 0.5) : (fd.congestedHours || 0);

      if (effFailed >= 2) {
        s += Math.min(1.6, effFailed * 0.3);
        reasons.push('หาสถานีไม่ได้ ' + effFailed + ' ครั้ง');
      }
      if (effUnmet >= 2) {
        s += Math.min(1.2, effUnmet * 0.25);
        reasons.push('ความต้องการไม่ได้รับการตอบสนอง ' + effUnmet + ' ครั้ง');
      }
      if (effCongested >= 3) {
        s += Math.min(1.4, effCongested * 0.15);
        reasons.push('แออัดต่อเนื่อง ' + effCongested + ' ชม.');
      }

      let housingDemand = false;
      if (id === 'dorm_outer') {
        const dormBeds = b.stations.length;
        if (outerCount >= dormBeds * 0.85 || pop >= totalBedCap * 0.85) {
          housingDemand = true;
          s += 1.35 + Math.max(0, pop - totalBedCap * 0.8) * 0.08;
          reasons.push('เรือนศิษย์นอกรองรับสมาชิกใกล้เต็ม (' + pop + '/' + totalBedCap + ')');
        }
      } else if (id === 'dorm_inner') {
        const dormBeds = b.stations.length;
        if (innerCount >= dormBeds * 0.82 || (pop >= totalBedCap * 0.88 && W.map.byId.dorm_outer.level >= 2)) {
          housingDemand = true;
          s += 1.2 + Math.max(0, innerCount - dormBeds * 0.75) * 0.1;
          reasons.push('เรือนศิษย์ในต้องการเตียงเพิ่ม');
        }
      } else if (id === 'dorm_core') {
        const dormBeds = b.stations.length;
        if (coreCount >= dormBeds * 0.80 || (pop >= totalBedCap * 0.90 && W.map.byId.dorm_inner.level >= 2)) {
          housingDemand = true;
          s += 1.15 + Math.max(0, coreCount - dormBeds * 0.7) * 0.1;
          reasons.push('เรือนศิษย์แกนกลางต้องการเตียงเพิ่ม');
        }
      } else if (id === 'farm') {
        const food = ECO.count(W, 'grain') + ECO.count(W, 'meal') / 3;
        if (food < pop * 3) {
          s += 1.1 + (pop * 3 - food) * 0.05;
          reasons.push('เสบียงอาหารมีไม่พอ');
        }
      } else if (id === 'canteen') {
        if (pop > b.stations.length * 2.4) {
          s += 0.95;
          reasons.push('โรงครัวคับคั่งตามจำนวนศิษย์');
        }
      } else if (id === 'meditation_hall') {
        s += (pol.focus.martial || 0) * 0.5;
      } else if (id === 'alchemy') {
        s += (pol.focus.craft || 0) * 0.4 + HC.eff(m, 'interests.alchemy') / 180;
      } else if (id === 'forge') {
        s += (pol.focus.craft || 0) * 0.4 + HC.eff(m, 'interests.forging') / 180;
      } else if (id === 'mine') {
        s += (pol.focus.commerce || 0) * 0.5;
      } else if (id === 'training_ground') {
        s += (pol.focus.martial || 0) * 0.45;
      }

      s *= (0.7 + (pol.expansion || 50) / 100 * 0.6);

      const hasRealDemand = effFailed >= 2 || effCongested >= 3 || housingDemand || (id === 'farm' && (ECO.count(W, 'grain') + ECO.count(W, 'meal') / 3) < pop * 3) || (id === 'canteen' && pop > b.stations.length * 2.6);
      if (!hasRealDemand) return;

      if (s > bs) {
        const rText = reasons.length ? reasons.join('、') : 'ความต้องการใช้งานเพิ่มขึ้น';
        if (W.sect.stones < cost + cashReserve) {
          bestBlockedByTreasury = { id, b, cost, reason: rText, needed: cost + cashReserve };
        } else {
          bs = s;
          best = { id, b, cost, reason: rText };
        }
      }
    });

    if (!best) {
      if (bestBlockedByTreasury && W.rng.chance(0.4)) {
        W.log('decision', m.h.name.given + ' ชะลอการขยาย' + bestBlockedByTreasury.b.nameTh + ' แม้พบความต้องการสูง (' + bestBlockedByTreasury.reason + ') เนื่องจากต้องสำรองศิลาคงคลังขั้นต่ำ ' + cashReserve + ' ศิลา (ปัจจุบันมี ' + Math.round(W.sect.stones) + ' ศิลา ต้องการ ' + bestBlockedByTreasury.needed + ' ศิลา)', [m.id, bestBlockedByTreasury.id]);
      }
      return;
    }

    if (!ECO.pay(W, best.cost, 'ขยาย' + best.b.nameTh)) return;
    const builder = SECT.holder(W, 'steward') || m, buildSkill = g.MARTIAL ? g.MARTIAL.skillRead(builder, 'construction') : 0, management = g.MARTIAL ? g.MARTIAL.skillRead(builder, 'administration') : 0;
    best.b.building = { until: W.t + Math.round(8 * 1440 / (1 + buildSkill * .004 + management * .0015)), to: best.b.level + 1 };
    if (g.MARTIAL) g.MARTIAL.skillPractice(builder, 'construction', 1.5, 1.1);
    const fd = S.facilityDemand[best.id];
    if (fd) {
      fd.lastUpgradedDay = W.day;
      fd.failedAttempts = 0;
      fd.unmetDemands = 0;
      fd.congestedHours = 0;
      fd.lastCongestionHour = 0;
    }
    W.log('decision', m.h.name.given + ' อนุมัติขยาย' + best.b.nameTh + ' เป็นระดับ ' + (best.b.level + 1) + '/' + SECT.maxBuildingLevel(best.b) + ' (ใช้ ' + best.cost + ' ศิลา) หลังพบความแออัดต่อเนื่อง (' + best.reason + ')', [m.id, best.id]);
  };

  SECT.startResearch = (W, m) => {
    const S = W.sect; if (S.research) return;
    if (S.recipeTier >= 6) return;
    const head = SECT.holder(W, 'scripture');
    const cost = 400 * S.recipeTier;
    if (!ECO.pay(W, cost, 'วิจัยตำรับระดับ ' + (S.recipeTier + 1))) return;
    S.research = { tier: S.recipeTier + 1, progress: 0, need: 900 * S.recipeTier, lead: head ? head.id : m.id };
    W.log('decision', m.h.name.given + ' สั่งวิจัยตำรับระดับ ' + (S.recipeTier + 1) + ' (หอคัมภีร์รับผิดชอบ)', [m.id]);
  };

  SECT.recruitDrive = (W, m) => {
    const S = W.sect;
    if (W.threat && W.threat.roadBlocked > 0) return false;
    const pop = SECT.memberOccupancy(W), cap = SECT.housingCapacity(W);
    const qLen = Array.isArray(S.queue) ? S.queue.length : 0;
    if (pop >= cap && qLen >= SECT.MAX_QUEUE) return false;
    const foodDays = (ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3) / Math.max(3, pop * 3);
    if (foodDays < 2.5) return false;
    S.driveUntil = W.day + 20;
    W.log('decision', m.h.name.given + ' ประกาศเปิดรับศิษย์ใหม่ 20 วัน (ที่พัก ' + pop + '/' + cap + ')', [m.id]);
    if (g.EXPED && g.EXPED.recruitApplicants && S.lastRecruitGenDay !== W.day) {
      S.lastRecruitGenDay = W.day;
      g.EXPED.recruitApplicants(W, 'drive');
    }
    return true;
  };

  SECT.takePersonalDisciple = (W, m) => {
    const c = W.npcs.filter(n => !n.dead && n.rank >= 1 && n.rank <= 3 && !n.mentor && n.id !== m.id);
    if (!c.length) return;
    c.sort((a, b) => (HC.derived(b).cultivationTalent + SECT.relationScore(m, b)) - (HC.derived(a).cultivationTalent + SECT.relationScore(m, a)));
    const d = c[0]; d.mentor = m.id; m.h.life.family.disciples.push(d.id); d.h.life.family.master = m.id;
    const r = SECT.rel(d, m.id); r.r = Math.min(100, r.r + 25); r.a += 15; const r2 = SECT.rel(m, d.id); r2.a += 15; r2.r += 10;
    d.sat = Math.min(100, (d.sat || 60) + 12);
    W.log('decision', m.h.name.given + ' รับ ' + d.h.name.given + ' เป็นศิษย์ส่วนตัว', [m.id, d.id]);
  };
  SECT.audit = (W, m) => {
    const disc = SECT.holder(W, 'discipline'); const tre = SECT.holder(W, 'treasury');
    W.log('decision', m.h.name.given + ' สั่งตรวจบัญชีคลังโดยละเอียด', [m.id]);
    if (tre && tre.embezzled > 0) {
      const eye = disc ? HC.eff(disc, 'intellect.perceptiveness') : 40;
      if (W.rng.next() < clamp(0.35 + eye / 150 + W.sect.policy.strictness / 300, 0.2, 0.9)) SECT.exposeEmbezzle(W, tre, m);
    }
  };
  SECT.exposeEmbezzle = (W, tre, by) => {
    const amt = tre.embezzled; tre.embezzled = 0;
    W.log('scandal', 'ตรวจพบ ' + tre.h.name.given + ' ยักยอกคลังรวม ' + Math.round(amt) + ' ศิลา!', [tre.id]);
    SECT.punish(W, tre, 3, 'ยักยอกทรัพย์สำนัก', by);
    ECO.earn(W, Math.round(amt * 0.6), 'ยึดคืนจากผู้ยักยอก');
    W.sect.suspicion = Math.max(0, (W.sect.suspicion || 0) - 30);
  };

  /* ---------- ลงโทษ ---------- */
  SECT.punish = (W, n, sev, why, by) => {
    const pol = W.sect.policy, k = 0.6 + pol.strictness / 100 * 0.8;
    sev = Math.max(1, Math.min(4, Math.round(sev * k)));
    const mer = W.sect.policy.meritocracy;
    const fair = !!why;
    let txt = '';
    if (sev === 1) { txt = 'ว่ากล่าวตักเตือน'; HC.feel(n, { mood: -6 }); n.merit = Math.max(0, n.merit - 8); }
    else if (sev === 2) { txt = 'กักบริเวณ/ทำงานชดใช้ 3 วัน'; n.punished = W.t + 3 * 1440; n.merit = Math.max(0, n.merit - 25); HC.feel(n, { mood: -14 }); }
    else if (sev === 3) {
      txt = 'ถอดตำแหน่ง/ลดขั้นและจำคุก 7 วัน'; n.punished = W.t + 7 * 1440; n.merit = Math.max(0, n.merit - 60);
      if (n.post) SECT.dismiss(W, n.post, why); if (n.rank >= 3) SECT.setRank(W, n, Math.max(1, n.rank - 1), why);
    } else { txt = 'ขับออกจากสำนัก'; SECT.expel(W, n, why); }
    n.jail = sev >= 3 && sev < 4 ? W.t + 7 * 1440 : n.jail;
    W.log('punish', n.h.name.given + ' ถูกลงโทษ: ' + txt + ' (' + why + ')', [n.id].concat(by ? [by.id] : []));
    HC.experience(n, sev >= 3 && !fair ? 'punished_unfair' : 'punished_fair', sev * 0.5);
    n.sat = Math.max(0, (n.sat || 60) - sev * 7 + HC.eff(n, 'personality.integrity') * 0.03);
    if (by && by.id !== n.id) { const r = SECT.rel(n, by.id); r.a -= sev * 4; r.v += sev * 3; }
    W.npcs.forEach(o => { if (!o.dead && o.id !== n.id) { const near = SECT.relationScore(o, n); if (near > 30) o.sat = Math.max(0, (o.sat || 60) - sev * 0.8); if (HC.eff(o, 'personality.integrity') > 65 && fair) o.sat = Math.min(100, (o.sat || 60) + 0.6); } });
  };
  SECT.expel = (W, n, why) => {
    if (n.post) { W.sect.posts[n.post] = null; n.post = null; }
    n.exiled = true; n.rank = 0; n.leave = { t: W.t, why: 'ถูกขับ' };
    W.log('expel', n.h.name.given + ' ถูกขับออกจากสำนัก (' + why + ')', [n.id]);
  };

  /* ---------- คำสั่งสำรองคลังและจัดการของขาดแคลน (v1.10.6 + Phase 3) ---------- */
  SECT.ensureDirectives = W => {
    const S = W.sect;
    if (!S) return;
    if (!S.reserveDirectives) {
      S.reserveDirectives = {
        minGrainDays: 14,
        minMealReserve: 20,
        expeditionMealCap: 18,
        expeditionMinSafetyMeal: 15,
        medicine: {
          'P:BASIC_HP': 4,
          'P:BASIC_WOUND': 3,
          'P:BASIC_DETOX': 2,
          'P:BASIC_CALM': 2
        },
        gearReserve: { WEAPON: 2, ARMOR: 2, ACCESSORY: 1 }
      };
    }
    if (!Array.isArray(S.shortageDirectives)) S.shortageDirectives = [];
    if (!Array.isArray(S.welfareHistory)) S.welfareHistory = [];
  };

  SECT.updateReserveDirectives = W => {
    SECT.ensureDirectives(W);
    const S = W.sect, pop = Math.max(1, SECT.memberOccupancy(W));
    const tr = SECT.holder(W, 'treasury') || W.byId[S.masterId];
    const m = W.byId[S.masterId];
    const caution = tr ? (HC.eff(tr, 'personality.caution') * 0.6 + (m ? HC.eff(m, 'personality.caution') * 0.4 : 50)) : 50;
    const gen = S.policy ? S.policy.generosity : 50;

    const grainDays = Math.round(clamp(12 + (caution - 50) / 10 + (50 - gen) / 15, 8, 24));
    const mealReserve = Math.round(clamp(pop * (0.8 + (caution - 50) / 100), 10, 60));
    const safetyMeal = Math.max(6, Math.round(mealReserve * 0.65));

    S.reserveDirectives.minGrainDays = grainDays;
    S.reserveDirectives.minMealReserve = mealReserve;
    S.reserveDirectives.expeditionMinSafetyMeal = safetyMeal;
    S.reserveDirectives.expeditionMealCap = Math.max(6, Math.min(24, Math.round(6 + (gen - 50) / 10)));
    S.reserveDirectives.medicine = {
      'P:BASIC_HP': Math.max(3, Math.round(pop * (0.15 + (caution - 50) / 300))),
      'P:BASIC_WOUND': Math.max(2, Math.round(pop * (0.12 + (caution - 50) / 350))),
      'P:BASIC_DETOX': Math.max(2, Math.round(pop * 0.08)),
      'P:BASIC_CALM': Math.max(2, Math.round(pop * 0.08))
    };
    S.reserveDirectives.gearReserve = {
      WEAPON: Math.max(1, Math.round(pop * 0.08)),
      ARMOR: Math.max(1, Math.round(pop * 0.08)),
      ACCESSORY: 1
    };
  };

  SECT.updateShortageDirectives = (W, hallWants) => {
    SECT.ensureDirectives(W);
    const S = W.sect, rd = S.reserveDirectives, pop = Math.max(1, SECT.memberOccupancy(W));
    const directives = [];

    // 1. Provisions / Kitchen
    const curGrain = ECO.count(W, 'grain');
    const targetGrain = pop * (rd.minGrainDays || 14);
    const grainDays = (curGrain * 3 + ECO.count(W, 'meal')) / (pop * 3);
    if (curGrain < targetGrain) {
      directives.push({
        id: 'grain',
        nameTh: 'ข้าวสาร',
        kind: 'provision',
        needed: targetGrain,
        current: curGrain,
        deficit: targetGrain - curGrain,
        priority: grainDays < 7 ? 'critical' : 'high',
        source: 'canteen',
        reason: 'สำรองอาหารความมั่นคง (ปัจจุบันพอใช้ ' + grainDays.toFixed(1) + ' วัน)',
        day: W.day
      });
    }

    const curMeal = ECO.count(W, 'meal');
    const targetMeal = rd.minMealReserve || 20;
    if (curMeal < targetMeal) {
      directives.push({
        id: 'meal',
        nameTh: 'อาหารปรุงเสร็จ',
        kind: 'provision',
        needed: targetMeal,
        current: curMeal,
        deficit: targetMeal - curMeal,
        priority: curMeal < (rd.expeditionMinSafetyMeal || 15) ? 'critical' : 'high',
        source: 'canteen',
        reason: 'สำรองอาหารสำหรับชีวิตประจำวันและการออกเดินทาง',
        day: W.day
      });
    }

    // 2. Essential Medicine Safety Reserves
    const medReserves = rd.medicine || {};
    Object.keys(medReserves).forEach(k => {
      const target = medReserves[k];
      const cur = ECO.count(W, k);
      if (cur < target) {
        directives.push({
          id: k,
          nameTh: ECO.name(k),
          kind: 'medicine',
          needed: target,
          current: cur,
          deficit: target - cur,
          priority: cur === 0 ? 'critical' : 'high',
          source: 'alchemy',
          reason: 'โอสถพื้นฐานต่ำกว่าเกณฑ์สำรองฉุกเฉิน',
          day: W.day
        });
      }
    });

    // 3. Hall Production Inputs
    Object.keys(hallWants || {}).forEach(matId => {
      const needed = hallWants[matId];
      const cur = ECO.count(W, matId);
      if (cur < needed) {
        directives.push({
          id: matId,
          nameTh: ECO.name(matId),
          kind: 'material',
          needed,
          current: cur,
          deficit: needed - cur,
          priority: cur === 0 ? 'high' : 'medium',
          source: 'hall',
          reason: 'ขาดแคลนสำหรับตำรับการผลิตประจำหอ',
          day: W.day
        });
      }
    });

    // 4. Bottlenecks / Breakthrough Needs
    const needSummary = ECO.needSummary(W);
    const btNeed = needSummary.btNeed || {};
    Object.keys(btNeed).forEach(k => {
      const count = btNeed[k];
      if (count > 0) {
        const pillRecipe = (JD.ITEMS.recipes || []).find(r => r.outType === 'PILL' && r.effect && r.effect.btFor && (r.effect.btFor.path + ':' + r.effect.btFor.stage === k));
        if (pillRecipe) {
          const pillKey = pillRecipe.outItemId || ('P:' + pillRecipe.id);
          const have = ECO.count(W, pillKey);
          if (have < count) {
            directives.push({
              id: pillKey,
              nameTh: pillRecipe.outNameTh || ECO.name(pillKey),
              kind: 'medicine',
              needed: count,
              current: have,
              deficit: count - have,
              priority: 'high',
              source: 'alchemy',
              reason: 'ผู้บำเพ็ญติดคอขวดวิถี ' + k + ' (' + count + ' คน)',
              day: W.day
            });
          }
        }
      }
    });

    const priWeight = { critical: 3, high: 2, medium: 1 };
    directives.sort((a, b) => (priWeight[b.priority] || 0) - (priWeight[a.priority] || 0) || b.deficit - a.deficit);
    S.shortageDirectives = directives;
  };

  /* ---------- Phase 3: Dynamic Stock Awareness & Autonomous Stock Allocation ---------- */
  SECT.notifyStockChanged = (W, itemId) => {
    if (!W || !W.sect) return;
    W._stockIntelCache = null;
    if (!Array.isArray(W.npcs) || !W.npcs.length) return;
    SECT.ensureDirectives(W);
    SECT.updateReserveDirectives(W);
    const hallWants = {};
    if (W.sect.orders) {
      ['alchemy', 'forge'].forEach(h => {
        const ord = W.sect.orders[h];
        const r = ord && ord.rid && ECO.recipeById ? ECO.recipeById[ord.rid] : null;
        if (r && Array.isArray(r.inputs)) {
          r.inputs.forEach(inp => {
            hallWants[inp.matId] = Math.max(hallWants[inp.matId] || 0, inp.count * 2);
          });
        }
      });
    }
    SECT.updateShortageDirectives(W, hallWants);
    W.sect.buyList = [];
    (W.sect.shortageDirectives || []).slice(0, 8).forEach(d => {
      if (d.deficit > 0 && d.id) {
        W.sect.buyList.push({ id: d.id, n: Math.min(12, Math.ceil(d.deficit)) });
      }
    });
    if (ECO.inventoryIntelligence) ECO.inventoryIntelligence(W, true);
  };

  const BASIC_PILL_SET = new Set((JD.CP && JD.CP.BASIC ? JD.CP.BASIC : []).map(r => 'P:' + r.id));

  SECT.canAccessItem = (W, n, itemSpec) => {
    if (!W || !n || n.dead || n.exiled || n.away) return false;
    if (!itemSpec) return false;
    const tier = itemSpec.tier || 1;
    const maxAllowedTier = Math.max(tier <= 2 ? 2 : 1, SECT.canLearnTier(W, n) + 1);
    if (tier > maxAllowedTier && n.rank < 4 && !n.post && !n.mentor) return false;
    const minStage = itemSpec.minStage || 0;
    const stage = n.cult ? (n.cult.stage || 0) : 0;
    if (minStage > stage) return false;
    const paths = Array.isArray(itemSpec.compatiblePath) ? itemSpec.compatiblePath : (itemSpec.compatiblePath ? [itemSpec.compatiblePath] : ['ANY']);
    if (!paths.includes('ANY')) {
      if (!n.cult || !paths.includes(n.cult.path)) return false;
    }
    return true;
  };

  SECT.evaluateStockDistribution = W => {
    if (!W || !W.sect) return { reserve: [], sale: [], gift: [] };
    SECT.ensureDirectives(W);
    SECT.updateReserveDirectives(W);
    const S = W.sect;
    const rd = S.reserveDirectives;
    const reserve = [], sale = [], gift = [];

    // 1. Evaluate Stock (provisions, materials, pills)
    Object.keys(S.stock || {}).forEach(id => {
      const count = ECO.count(W, id);
      if (count <= 0) return;
      const resFloor = (g.EXT && g.EXT.reserveForSect) ? g.EXT.reserveForSect(W, id) : (ECO.reserveFloor ? ECO.reserveFloor(W, id) : 2);
      const reservedQty = Math.min(count, resFloor);
      if (reservedQty > 0) {
        reserve.push({ kind: ECO.isPill(id) ? 'PILL' : (id === 'grain' || id === 'meal') ? 'PROVISION' : 'MATERIAL', id, nameTh: ECO.name(id), qty: reservedQty, reserveFloor: resFloor, reason: 'สำรองตามเกณฑ์ความมั่นคงสำนัก' });
      }
      const excess = count - reservedQty;
      if (excess <= 0) return;

      if (ECO.isPill(id)) {
        if (BASIC_PILL_SET.has(id)) {
          reserve.push({ kind: 'PILL', id, nameTh: ECO.name(id), qty: excess, reserveFloor: resFloor, reason: 'โอสถสวัสดิการพื้นฐาน (ไม่แจกเป็นของขวัญรายวัน)' });
          return;
        }
        const info = ECO.pillInfo(id) || {};
        // Check if any member has a real non-basic need (bottleneck, severe injury/toxin/heartDemon, or cultivation progress)
        const needy = W.npcs.filter(n => {
          if (!SECT.canAccessItem(W, n, { tier: info.tier || 2, compatiblePath: info.compatiblePath || 'ANY', minStage: info.minStage || 0 })) return false;
          const eff = info.effect || {};
          if (eff.btFor && n.cult && n.cult.path === eff.btFor.path && n.cult.stage === eff.btFor.stage && CULT.ready(n)) return true;
          if (eff.clearToxic && n.cult && (n.cult.toxic || 0) >= 30) return true;
          if (eff.clearHeartDemon && (n.h.state.heartDemon || 0) >= 35) return true;
          if (eff.healInjury && Array.isArray(n.inj) && n.inj.length > 0) return true;
          if (eff.cultivationBoost && n.cult && n.rank >= 1) return true;
          return false;
        });
        if (needy.length > 0) {
          const giftQty = Math.min(excess, needy.length);
          gift.push({ kind: 'PILL', id, nameTh: ECO.name(id), qty: giftQty, tier: info.tier || 2, reason: 'มีศิษย์ที่เหมาะสมต้องใช้ทะลวงขั้น/บำรุงตบะ' });
          if (excess > giftQty) {
            sale.push({ kind: 'PILL', id, nameTh: ECO.name(id), qty: excess - giftQty, tier: info.tier || 2, reason: 'ส่วนเกินเหนือเกณฑ์สำรองและความต้องการภายใน' });
          }
        } else {
          sale.push({ kind: 'PILL', id, nameTh: ECO.name(id), qty: excess, tier: info.tier || 2, reason: 'ส่วนเกินเหนือเกณฑ์สำรองพร้อมจำหน่าย' });
        }
      } else if (id !== 'grain' && id !== 'meal') {
        const m = ECO.matById[id];
        sale.push({ kind: 'MATERIAL', id, nameTh: ECO.name(id), qty: excess, tier: m ? m.tier : 1, reason: 'วัตถุดิบเกินเกณฑ์สำรองหอผลิต' });
      }
    });

    // 2. Evaluate Equipment in W.sect.gear
    const gearBySlot = { WEAPON: [], ARMOR: [], ACCESSORY: [] };
    (S.gear || []).forEach(eq => {
      if (eq && gearBySlot[eq.slot]) gearBySlot[eq.slot].push(eq);
    });
    Object.keys(gearBySlot).forEach(slot => {
      const list = gearBySlot[slot].slice().sort((a, b) => (b.combatMult || b.defMult || 0) - (a.combatMult || a.defMult || 0));
      const slotRes = (rd.gearReserve && rd.gearReserve[slot]) || 1;
      list.forEach((eq, idx) => {
        // High-priority unequipped members can receive gear even when total gear is near reserve, or excess above reserve
        const hasUpgradeCandidate = W.npcs.some(n => {
          if (!SECT.canAccessItem(W, n, eq)) return false;
          const cur = n.equip && n.equip[slot];
          const curVal = cur ? (cur.combatMult || cur.defMult || cur.tier || 0) : -1;
          const newVal = eq.combatMult || eq.defMult || eq.tier || 0;
          return newVal > curVal + 0.01;
        });
        if (hasUpgradeCandidate && (idx < list.length - Math.max(0, slotRes - 1) || list.length >= 1)) {
          gift.push({ kind: 'EQUIPMENT', id: eq.id, uid: eq.uid, slot, nameTh: eq.nameTh, qty: 1, tier: eq.tier || 1, item: eq, reason: 'มอบอุปกรณ์เสริมกำลังรบให้ศิษย์ที่เหมาะสม' });
        } else {
          reserve.push({ kind: 'EQUIPMENT', id: eq.id, uid: eq.uid, slot, nameTh: eq.nameTh, qty: 1, tier: eq.tier || 1, reason: 'สำรองยุทโธปกรณ์ประจำคลังแสง' });
        }
      });
    });

    // 3. Evaluate Specialization Crystals in W.sect.crystals
    Object.keys(S.crystals || {}).forEach(subKey => {
      const qty = S.crystals[subKey] || 0;
      if (qty <= 0) return;
      const subId = subKey.startsWith("S:") ? subKey.slice(2) : subKey;
      const subObj = CULT.subList.find(x => x.sub.id === subId);
      if (!subObj) return;
      const candidates = W.npcs.filter(n => !n.dead && !n.exiled && !n.away && n.rank >= 1 && n.cult && n.cult.path === subObj.path && n.cult.sub === 'NONE');
      if (candidates.length > 0) {
        gift.push({ kind: 'CRYSTAL', id: subId, nameTh: 'ผลึกสายย่อย「' + subObj.sub.nameTh + '」', qty: Math.min(qty, candidates.length), path: subObj.path, reason: 'มอบผลึกสืบทอดสายย่อยให้ศิษย์ที่ยังไร้สายเฉพาะทาง' });
      } else {
        reserve.push({ kind: 'CRYSTAL', id: subId, nameTh: 'ผลึกสายย่อย「' + subObj.sub.nameTh + '」', qty, reason: 'สำรองรอศิษย์วิถี ' + subObj.path });
      }
    });

    return { reserve, sale, gift };
  };

  function recipientScoreForItem(W, evaluator, n, itemSpec, roleBoosts) {
    const pol = W.sect.policy || { meritocracy: 50, generosity: 50 };
    const evalIntegrity = evaluator ? HC.eff(evaluator, 'personality.integrity') : 50;
    const merK = clamp(((pol.meritocracy || 50) * 0.65 + evalIntegrity * 0.35) / 100, 0.10, 0.92);
    const rel = evaluator ? SECT.relationScore(evaluator, n) : 0;
    const flat = (evaluator && g.COG && g.COG.flatteryBonus) ? g.COG.flatteryBonus(evaluator, n) : 0;
    const eye = evaluator ? (HC.eff(evaluator, 'intellect.judgement') * 0.55 + HC.eff(evaluator, 'intellect.readPeople') * 0.45) : 55;
    const noise = (W.rng && W.rng.gauss) ? W.rng.gauss(0, Math.max(1.2, (100 - eye) / 14)) : 0;
    const stage = n.cult ? (n.cult.stage || 0) : 0;
    const roleBonus = (n.post && roleBoosts[n.post]) ? roleBoosts[n.post] : 0;
    const rankBonus = n.rank * 4;
    const meritScore = Math.min(30, (n.merit || 0) * 0.12);
    return (stage * 7 + rankBonus + meritScore + roleBonus) * merK + ((rel + flat * 1.4) * 0.55) * (1 - merK) + noise;
  }

  SECT.distributeSectStock = (W, opts) => {
    opts = opts || {};
    if (!W || !W.sect) return { gifted: 0, items: [] };
    SECT.ensureDirectives(W);
    const S = W.sect;
    const tre = SECT.holder(W, 'treasury');
    const master = W.byId[S.masterId];
    const dep = W.byId[S.deputyId];
    const evaluator = SECT.isOfficerAvailable(W, tre) ? tre : SECT.isOfficerAvailable(W, master) ? master : SECT.isOfficerAvailable(W, dep) ? dep : null;
    if (!evaluator) return { gifted: 0, items: [] };

    const giftedItems = [];
    const maxGifts = opts.maxGifts != null ? opts.maxGifts : 4;

    // 1. Equipment distribution from W.sect.gear
    if (Array.isArray(S.gear) && S.gear.length > 0) {
      const alive = W.npcs.filter(n => !n.dead && !n.exiled && !n.away && n.cult);
      const roleBoosts = { guard: 16, commander: 18, martial: 14, mission: 12, wildwarden: 14, discipline: 10 };
      S.gear.sort((a, b) => (b.combatMult || b.defMult || 0) - (a.combatMult || a.defMult || 0));

      for (let i = S.gear.length - 1; i >= 0 && giftedItems.length < maxGifts; i--) {
        const eq = S.gear[i];
        if (!eq || !eq.slot) continue;
        const cands = alive.filter(n => {
          if (!SECT.canAccessItem(W, n, eq)) return false;
          const cur = n.equip && n.equip[eq.slot];
          const curVal = cur ? (cur.combatMult || cur.defMult || (cur.tier || 0) * 0.03) : -1;
          const newVal = eq.combatMult || eq.defMult || (eq.tier || 1) * 0.03;
          return newVal > curVal + 0.005;
        });
        if (!cands.length) continue;
        cands.sort((a, b) => {
          const aEmpty = !(a.equip && a.equip[eq.slot]) ? 12 : 0;
          const bEmpty = !(b.equip && b.equip[eq.slot]) ? 12 : 0;
          return (recipientScoreForItem(W, evaluator, b, eq, roleBoosts) + bEmpty) - (recipientScoreForItem(W, evaluator, a, eq, roleBoosts) + aEmpty);
        });
        const win = cands[0];
        S.gear.splice(i, 1);
        win.equip = win.equip || { WEAPON: null, ARMOR: null, ACCESSORY: null };
        const prev = win.equip[eq.slot];
        if (prev) S.gear.push(prev);
        win.equip[eq.slot] = eq;
        HC.bump(win);
        if (g.STATS && g.STATS.dirty) g.STATS.dirty(win);
        const reason = prev ? 'อัปเกรดแทน「' + prev.nameTh + '」ตามผลงานและหน้าที่' : 'จัดสรรยุทโธปกรณ์ให้ศิษย์ที่ยังขาดแคลน';
        const giftRow = { day: W.day, kind: 'EQUIPMENT', itemId: eq.id, itemUid: eq.uid, nameTh: eq.nameTh, qty: 1, actorId: evaluator.id, recipientId: win.id, reason };
        S.giftHistory = S.giftHistory || [];
        S.giftHistory.push(giftRow);
        if (S.giftHistory.length > 60) S.giftHistory.splice(0, S.giftHistory.length - 60);
        giftedItems.push(giftRow);
        W.log('finance', '[มอบของรางวัล] ' + evaluator.h.name.given + ' มอบอุปกรณ์「' + eq.nameTh + '」ให้ ' + win.h.name.given + ' (' + reason + ')', [evaluator.id, win.id], { txKind: 'gift', itemId: eq.id, itemUid: eq.uid, qty: 1, actorId: evaluator.id, recipientId: win.id, reason });
      }
    }

    if (opts.onlyGear) {
      if (giftedItems.length) SECT.notifyStockChanged(W);
      return { gifted: giftedItems.length, items: giftedItems };
    }

    // 2. Non-basic Pill distribution from W.sect.stock (never distributes BASIC_PILLS)
    Object.keys(S.stock || {}).forEach(pillKey => {
      if (giftedItems.length >= maxGifts) return;
      if (!ECO.isPill(pillKey) || BASIC_PILL_SET.has(pillKey)) return;
      const count = ECO.count(W, pillKey);
      const resFloor = (g.EXT && g.EXT.reserveForSect) ? g.EXT.reserveForSect(W, pillKey) : 1;
      const info = ECO.pillInfo(pillKey);
      if (!info || count <= 0) return;
      const eff = info.effect || {};

      // Find eligible recipients with a clear non-daily reason
      const cands = W.npcs.filter(n => {
        if (!SECT.canAccessItem(W, n, { tier: info.tier || 2, compatiblePath: info.compatiblePath || 'ANY', minStage: info.minStage || 0 })) return false;
        if (n.inv && n.inv.pills && (n.inv.pills[pillKey] || 0) >= 2) return false;
        if (eff.btFor && n.cult && n.cult.path === eff.btFor.path && n.cult.stage === eff.btFor.stage && CULT.ready(n)) return true;
        if (count <= resFloor) return false; // Only dip into reserve for exact bottleneck matches
        if (eff.clearToxic && n.cult && (n.cult.toxic || 0) >= 35) return true;
        if (eff.clearHeartDemon && (n.h.state.heartDemon || 0) >= 40) return true;
        if (eff.healInjury && Array.isArray(n.inj) && n.inj.length > 0) return true;
        if ((eff.cultivationBoost || eff.foundationBonus) && n.cult && n.rank >= 1) return true;
        return false;
      });
      if (!cands.length) return;
      cands.sort((a, b) => recipientScoreForItem(W, evaluator, b, info, {}) - recipientScoreForItem(W, evaluator, a, info, {}));
      const win = cands[0];
      if (!ECO.take(W, pillKey, 1)) return;
      ECO.addPersonalPill(win, pillKey, 1, 1);
      const reason = (eff.btFor && win.cult && CULT.ready(win))
        ? 'หนุนทะลวงคอขวดวิถี ' + win.cult.path + ' ขั้น ' + win.cult.stage
        : 'จัดสรรโอสถชั้นสูงตามความเหมาะสมและผลงาน';
      const giftRow = { day: W.day, kind: 'PILL', itemId: pillKey, nameTh: ECO.name(pillKey), qty: 1, actorId: evaluator.id, recipientId: win.id, reason };
      S.giftHistory = S.giftHistory || [];
      S.giftHistory = S.giftHistory || [];
      S.giftHistory.push(giftRow);
      if (S.giftHistory.length > 60) S.giftHistory.splice(0, S.giftHistory.length - 60);
      giftedItems.push(giftRow);
      W.log('finance', '[มอบของรางวัล] ' + evaluator.h.name.given + ' จัดสรรโอสถ「' + ECO.name(pillKey) + '」ให้ ' + win.h.name.given + ' (' + reason + ')', [evaluator.id, win.id], { txKind: 'gift', itemId: pillKey, qty: 1, actorId: evaluator.id, recipientId: win.id, reason });
    });

    // 3. Specialization Crystal distribution from W.sect.crystals
    Object.keys(S.crystals || {}).forEach(subKey => {
      if (giftedItems.length >= maxGifts) return;
      const qty = S.crystals[subKey] || 0;
      if (qty <= 0) return;
      const subId = subKey.startsWith("S:") ? subKey.slice(2) : subKey;
      const normKey = "S:" + subId;
      const subObj = CULT.subList.find(x => x.sub.id === subId);
      if (!subObj) return;
      const cands = W.npcs.filter(n => !n.dead && !n.exiled && !n.away && n.rank >= 1 && n.cult && n.cult.path === subObj.path && n.cult.sub === 'NONE' && !(n.inv && n.inv.crystals && (n.inv.crystals[normKey] > 0 || n.inv.crystals[subId] > 0)));
      if (!cands.length) return;
      cands.sort((a, b) => recipientScoreForItem(W, evaluator, b, { tier: 3 }, {}) - recipientScoreForItem(W, evaluator, a, { tier: 3 }, {}));
      const win = cands[0];
      S.crystals[subKey]--;
      if (S.crystals[subKey] <= 0) delete S.crystals[subKey];
      win.inv.crystals = win.inv.crystals || {};
      win.inv.crystals[normKey] = (win.inv.crystals[normKey] || 0) + 1;
      const reason = 'มอบผลึกสืบทอดสายย่อย「' + subObj.sub.nameTh + '」ให้ศิษย์วิถี ' + subObj.path;
      const giftRow = { day: W.day, kind: 'CRYSTAL', itemId: subId, nameTh: 'ผลึกสายย่อย「' + subObj.sub.nameTh + '」', qty: 1, actorId: evaluator.id, recipientId: win.id, reason };
      S.giftHistory.push(giftRow);
      if (S.giftHistory.length > 60) S.giftHistory.splice(0, S.giftHistory.length - 60);
      giftedItems.push(giftRow);
      W.log('finance', '[มอบของรางวัล] ' + evaluator.h.name.given + ' มอบผลึกสายย่อย「' + subObj.sub.nameTh + '」ให้ ' + win.h.name.given + ' (' + reason + ')', [evaluator.id, win.id], { txKind: 'gift', itemId: 'CRYSTAL:' + subId, qty: 1, actorId: evaluator.id, recipientId: win.id, reason });
    });

    if (giftedItems.length) SECT.notifyStockChanged(W);
    return { gifted: giftedItems.length, items: giftedItems };
  };

  /* ---------- หัวหน้าหอ: สั่งงานในหอของตน ---------- */
  SECT.hallHeads = W => {
    SECT.ensureDirectives(W);
    SECT.updateReserveDirectives(W);
    const S = W.sect; S.orders = S.orders || {};
    const hallWants = {};
    ['alchemy', 'forge'].forEach(h => {
      const appointed = SECT.holder(W, h);
      const head = g.COG && !g.COG.available(appointed, W) ? null : appointed;
      const o = ECO.pickOrder(W, h, head);
      S.orders[h] = o.recipe ? { rid: o.recipe.id, why: o.why, by: head?.id || null } : null;
      if (head && !head.dead && !head.away && !head.sealed && g.COG) g.COG.officeDecision(W, head, 'วางแผนผลิต ' + (o.recipe ? o.recipe.nameTh : 'รอวัตถุดิบ'), [o.why || 'ยังไม่มีตำรับที่พร้อมผลิต']);
      Object.keys(o.want || {}).forEach(k => {
        hallWants[k] = Math.max(hallWants[k] || 0, o.want[k]);
      });
    });
    SECT.updateShortageDirectives(W, hallWants);
    if (g.COG) g.COG.reviewOffices(W);
    // หอคลัง: สั่งซื้อวัตถุดิบ/เสบียงตามที่ขาด (ผ่านคาราวาน)
    const tre = SECT.holder(W, 'treasury');
    S.buyList = [];
    (S.shortageDirectives || []).slice(0, 8).forEach(d => {
      if (d.deficit > 0 && d.id) {
        S.buyList.push({ id: d.id, n: Math.min(12, Math.ceil(d.deficit)) });
      }
    });
    // ทุจริต
    if (tre && W.day % 10 === 0) {
      const gr = (HC.eff(tre, 'values.wealthResource') + (100 - HC.eff(tre, 'personality.integrity')) + HC.derived(tre).materialism) / 3 - 40;
      if (gr > 12 && W.rng.chance(clamp(gr / 90, 0.05, 0.6)) && W.sect.stones > 400) {
        const amt = Math.round(W.sect.stones * W.rng.float(0.004, 0.015) + 10);
        W.sect.stones -= amt; tre.inv.stones += amt; tre.embezzled = (tre.embezzled || 0) + amt;
        W.sect.ledger.push({ t: W.t, amt: -amt, why: 'บัญชีไม่ตรง(ยักยอก)' });
        W.sect.suspicion = (W.sect.suspicion || 0) + 4;
      }
      const disc = SECT.holder(W, 'discipline');
      if (disc && tre.embezzled > 0 && W.rng.chance(0.1 * (HC.eff(disc, 'intellect.perceptiveness') / 60) * (0.5 + W.sect.policy.strictness / 100))) SECT.exposeEmbezzle(W, tre, disc);
    }
  };

  /* ---------- สืบทอดตำแหน่งเจ้าสำนัก ---------- */
  SECT.succession = (W, why) => {
    const S = W.sect, old = W.byId[S.masterId];
    const cands = W.npcs.filter(n => !n.dead && !n.away && !n.exiled && n.rank >= 3 && n.id !== S.masterId);
    if (!cands.length) { W.log('crisis', 'สำนักไร้ผู้นำและไม่มีผู้สืบทอด!', []); return; }
    const voters = W.npcs.filter(n => !n.dead && n.rank >= 4 && n.id !== S.masterId);
    const score = c => {
      const stage = c.cult ? c.cult.stage : 0;
      let tot = 0;
      voters.forEach(v => { if (v.id === c.id) { tot += 22; return; } const rel = SECT.relationScore(v, c); const vm = HC.eff(v, 'personality.rationality') / 100; tot += rel * .5 + (stage * 6 + CULT.power(c) / 400 + SECT.relevance('mission', c) * .1) * (.4 + vm * .6) + (c.id === S.deputyId ? 10 : 0) * (HC.eff(v, 'personality.loyalty') / 100) + HC.eff(c, 'social.leadership') * .15; });
      return tot / Math.max(1, voters.length);
    };
    cands.sort((a, b) => score(b) - score(a));
    const nm = cands[0];
    if (nm.post) { S.posts[nm.post] = null; nm.post = null; }
    if (S.deputyId === nm.id) S.deputyId = null;
    nm.rank = 6; S.masterId = nm.id; nm.sat = 90;
    if (old && !old.dead && old.rank === 6) { old.rank = 4; }
    W.log('succession', nm.h.name.given + ' ขึ้นเป็นเจ้าสำนักคนใหม่' + (why ? ' (' + why + ')' : ''), [nm.id]);
    W.fame(5);
    cands.slice(1, 4).forEach(c => { const amb = HC.eff(c, 'personality.ambition'); if (amb > 60) { c.sat = Math.max(0, (c.sat || 60) - (amb - 50) * .4); const r = SECT.rel(c, nm.id); r.v += 12; r.a -= 6; } });
    S.policyShift = W.day;
  };

  /* ---------- รายเดือน ---------- */
  SECT.monthly = W => {
    const S = W.sect;
    const tp = SECT.targetPolicy(W);
    ['openness', 'strictness', 'meritocracy', 'expansion', 'generosity', 'secrecy', 'risk'].forEach(k => { S.policy[k] += (tp[k] - S.policy[k]) * 0.2; });
    Object.keys(tp.focus).forEach(k => { S.policy.focus[k] += (tp.focus[k] - S.policy.focus[k]) * 0.2; });
    if (S.recentRaid) { S.policy.strictness = Math.min(100, S.policy.strictness + 2); S.recentRaid = 0; }
    SECT.paySalaries(W);
    const tribute = Math.round(150 + 26 * Math.sqrt(Math.max(0, S.fame)));
    S.fame *= 0.97;
    ECO.earn(W, tribute, 'ค่าคุ้มครองและของกำนัลจากชุมชนรอบเขา');
    ECO.monthlyMarket(W);
    {
      const popN = W.npcs.filter(n => !n.dead).length, upkeep = Math.round((1 - (g.MARTIAL ? g.MARTIAL.skillRead(SECT.holder(W, 'treasury') || W.byId[S.masterId], 'administration') * .001 : 0)) * (popN * 7 + W.map.buildings.reduce((s2, b) => s2 + b.level * 15, 0) * clamp((popN + 8) / 45, 0.3, 1)));
      ECO.pay(W, Math.min(upkeep, Math.max(0, S.stones)), 'ค่าบำรุงรักษาสำนัก');
      const gr = ECO.count(W, 'grain'), lim = popN * 25; if (gr > lim) { const rot = Math.floor((gr - lim) * 0.15); if (rot > 0) ECO.take(W, 'grain', rot); }
      const ml = ECO.count(W, 'meal'), ml2 = popN * 8; if (ml > ml2) { const rot = Math.floor((ml - ml2) * 0.25); if (rot > 0) ECO.take(W, 'meal', rot); }
    }
    W.npcs.forEach(n => { if (n.dead) return; const tgt = SECT.satTarget(W, n); n.sat = (n.sat == null ? tgt : n.sat + (tgt - n.sat) * 0.35); n.grief = Math.max(0, (n.grief || 0) - 2); });
    W.avgSat = W.npcs.filter(n => !n.dead).reduce((s, n) => s + n.sat, 0) / Math.max(1, W.npcs.filter(n => !n.dead).length);
    const m = W.byId[S.masterId];
    if (m && !m.dead) SECT.checkChallenge(W, m);
    SECT.checkDesertion(W);
  };

  SECT.checkChallenge = (W, m) => {
    const mp = CULT.power(m);
    const c = W.npcs.filter(n => !n.dead && !n.away && n.id !== m.id && n.rank >= 4 && n.cult).filter(n => {
      const amb = (HC.eff(n, 'personality.ambition') + HC.eff(n, 'values.powerStatus')) / 2;
      const rel = SECT.relationScore(n, m);
      return amb > 66 && (n.sat || 60) < 48 && rel < 10 && CULT.power(n) > mp * 0.95 && HC.eff(n, 'personality.loyalty') < 62;
    });
    if (!c.length || !W.rng.chance(0.25)) return;
    const ch = W.rng.pick(c);
    W.log('challenge', ch.h.name.given + ' ท้าชิงตำแหน่งเจ้าสำนักจาก ' + m.h.name.given + ' !', [ch.id, m.id]);
    W.duelQueue = W.duelQueue || [];
    W.duelQueue.push({ a: ch.id, b: m.id, kind: 'leadership', serious: false });
  };
  SECT.checkDesertion = W => {
    W.npcs.forEach(n => {
      if (n.dead || n.away || n.exiled || n.rank >= 5 || n.left) return;
      const low = (n.sat || 60) < 22, stay = (W.day - (n.joinDay || 0)) > 60;
      if (low && stay && W.rng.chance(0.22 + (HC.eff(n, 'values.freedom') - 50) / 300 - (HC.eff(n, 'personality.loyalty') - 50) / 250)) {
        n.leave = { t: W.t, why: 'หนีออกจากสำนัก' }; n.exiled = true; n.deserting = true;
        W.log('desert', n.h.name.given + ' ผิดหวังกับสำนักและหนีออกไป', [n.id]);
      }
    });
  };

  SECT.canLearnTier = (W, n) => {
    const sec = W.sect.policy.secrecy / 100;
    const base = { 0: 1, 1: 2, 2: 3, 3: 5, 4: 6, 5: 7, 6: 7 }[n.rank];
    return Math.max(1, Math.round(base - sec * (n.rank < 4 ? 1.6 : 0.5) + (n.mentor ? 1 : 0)));
  };

  /* ----- บริจาควัตถุดิบส่วนตัวเข้าคลังสำนัก (รับแต้มคุณูปการอย่างถูกต้องครั้งเดียว และป้องกันไอเทมเสกปั๊มแต้ม) ----- */
  SECT.donateMat = (W, npc, matId, qty) => {
    if (!W || !npc || npc.dead || !matId) return { ok: false, reward: 0, reason: 'invalid' };
    if (qty === undefined) qty = 1;
    if (!Number.isSafeInteger(qty) || qty <= 0 || !ECO.matById[matId]) return { ok: false, reward: 0, reason: 'invalid_qty' };
    npc.inv = npc.inv || {};
    npc.inv.mats = npc.inv.mats || {};
    const owned = npc.inv.mats[matId] || 0;
    if (owned < qty) return { ok: false, reward: 0, reason: 'insufficient_mats', owned };

    npc.inv.mats[matId] -= qty;
    if (npc.inv.mats[matId] <= 0) delete npc.inv.mats[matId];

    const spawned = Math.min(qty, (npc.inv.spawnedMats && npc.inv.spawnedMats[matId]) || 0);
    if (spawned > 0) {
      npc.inv.spawnedMats[matId] -= spawned;
      if (npc.inv.spawnedMats[matId] <= 0) delete npc.inv.spawnedMats[matId];
      if (!Object.keys(npc.inv.spawnedMats).length) delete npc.inv.spawnedMats;
    }

    ECO.add(W, matId, qty);
    if (W.sect && Array.isArray(W.sect.shortageDirectives)) {
      const cur = ECO.count(W, matId);
      for (let i = W.sect.shortageDirectives.length - 1; i >= 0; i--) {
        const sd = W.sect.shortageDirectives[i];
        if (sd && sd.id === matId) {
          sd.current = cur;
          sd.deficit = Math.max(0, sd.needed - cur);
          if (sd.deficit <= 0) W.sect.shortageDirectives.splice(i, 1);
        }
      }
    }

    const eligibleQty = Math.max(0, qty - spawned);
    const reward = eligibleQty > 0 ? ((g.CPE && g.CPE.reward) ? g.CPE.reward(W, matId, eligibleQty) : (ECO.base(matId) * 0.22 * eligibleQty)) : 0;
    const minted = (reward > 0 && g.CPE && g.CPE.mint) ? g.CPE.mint(W, npc, reward, 'บริจาควัตถุดิบ「' + ECO.name(matId) + '」', true) : 0;
    if (minted > 0 && g.CPE && g.CPE.S) {
      g.CPE.S(W).donated = (g.CPE.S(W).donated || 0) + minted;
    }
    if (eligibleQty > 0) npc.merit = (npc.merit || 0) + Math.max(1, Math.round(eligibleQty * 0.5));
    if ((minted >= 15 || spawned > 0) && W.log) {
      W.log('finance', npc.h.name.given + ' บริจาค ' + ECO.name(matId) + ' ×' + qty + ' เข้าคลัง ได้ ' + Math.round(minted) + ' คป.' + (spawned > 0 ? ' (ไอเทมเสกได้ 0 คป.)' : ''), [npc.id]);
    }
    return { ok: true, reward: minted, qty, matId, playerSpawned: spawned > 0 };
  };

  /* ============================================================================
   * PHASE 2: CHARACTER EDITOR, ITEM SPAWNER & INVENTORY / BAG MANAGEMENT
   * ============================================================================ */
  const EDITOR = {};

  EDITOR.EDITABLE_GROUPS = {
    personality: { min: 0, max: 100, keys: ['ambition', 'courage', 'discipline', 'empathy', 'aggression', 'loyalty', 'curiosity', 'caution', 'pride', 'integrity', 'composure', 'rationality', 'creativity', 'trustfulness'] },
    values: { min: 0, max: 100, keys: ['martialPeak', 'wealthResource', 'honorLegacy', 'familyClan', 'freedom', 'knowledgeCraft', 'sectDuty', 'powerStatus'] },
    interests: { min: 0, max: 100, keys: ['combat', 'alchemy', 'forging', 'scholarship', 'meditation', 'socializing', 'herbs', 'trade', 'arts', 'beasts', 'building', 'cooking', 'mining', 'farming', 'worship'] },
    aptitudes: { min: 0, max: 100, keys: ['cultivation', 'comprehension', 'combat', 'crafting', 'command', 'socialCommerce'] },
    physiology: { min: 1, max: 100, keys: ['strength', 'speed', 'agility', 'dexterity', 'balance', 'endurance', 'toughness', 'vitality', 'flexibility', 'reflex', 'recoveryRate', 'immunity', 'spiritualFoundation', 'meridianCapacity', 'meridianIntegrity', 'senseAcuity'] },
    intellect: { min: 1, max: 100, keys: ['memory', 'reasoning', 'comprehension', 'focus', 'willpower', 'perceptiveness', 'intuition', 'creativity', 'planning', 'judgement', 'numeracy', 'spatial', 'learningSpeed', 'readPeople', 'inventiveness', 'wisdom'] },
    social: { min: 0, max: 100, keys: ['charisma', 'leadership', 'persuasion', 'deception', 'intimidation', 'empathySense', 'teaching', 'etiquette', 'hospitality'] },
    skills: { min: 0, max: 100, keys: ['SWORD', 'BLADE', 'SPEAR', 'FIST_PALM', 'INTERNAL_QI', 'LIGHTFOOT', 'BODY_REFINING', 'ALCHEMY', 'FORGING', 'ARRAY', 'TALISMAN', 'HERB_LORE', 'BEAST_TAMING', 'SCRIPTURE', 'MUSIC_MIND', 'STEALTH', 'MEDICINE', 'POISON', 'DIVINATION', 'SOUL_DIVINE', 'farming', 'cooking', 'mining', 'herbalism', 'administration', 'trading', 'diplomacy', 'survival', 'construction', 'teaching'] }
  };

  EDITOR.memberEditState = (W, nOrId) => {
    const n = typeof nOrId === 'string' ? (W && W.byId && W.byId[nOrId]) : nOrId;
    if (!W || !n || !W.byId || !W.byId[n.id]) {
      return { ok: false, canEditStats: false, canEditCult: false, canEditEquip: false, canEditBag: false, reason: 'ไม่พบตัวละครในสำนัก', warnings: [] };
    }
    if (n.dead) {
      return { ok: false, canEditStats: false, canEditCult: false, canEditEquip: false, canEditBag: false, reason: 'ตัวละครเสียชีวิตแล้ว ไม่สามารถแก้ไขได้', warnings: [] };
    }
    if (n.exiled) {
      return { ok: false, canEditStats: false, canEditCult: false, canEditEquip: false, canEditBag: false, reason: 'ตัวละครออกจากสำนักแล้ว ไม่สามารถแก้ไขได้', warnings: [] };
    }
    const warnings = [];
    if (n.away) warnings.push('ตัวละครกำลังปฏิบัติภารกิจนอกสำนัก');
    if (n.travel) warnings.push('ตัวละครกำลังเดินทางในสำนัก');
    const inFight = !!(n.act && (n.act === 'fight' || n.act.id === 'fight'));
    if (inFight) warnings.push('ตัวละครกำลังต่อสู้');
    if (n.sealed || n.sealedBt) warnings.push('ตัวละครกำลังปิดด่าน');
    if (n.id === W.sect.masterId) warnings.push('ตัวละครนี้เป็นเจ้าสำนัก (การเปลี่ยนนิสัยจะมีผลต่อนโยบายสำนัก)');
    else if (n.post) warnings.push('ตัวละครดำรงตำแหน่ง' + (SECT.POSTS[n.post] ? SECT.POSTS[n.post].nameTh : n.post));
    return {
      ok: true,
      canEditStats: true,
      canEditCult: !inFight,
      canEditEquip: !inFight,
      canEditBag: true,
      reason: '',
      warnings
    };
  };

  function validateCharacterPatch(W, n, patch) {
    const errors = [];
    if (!patch || typeof patch !== 'object') {
      return { ok: false, errors: ['ข้อมูลแก้ไขไม่ถูกต้อง'] };
    }
    // Reject direct arbitrary overrides of derived combat/HP/Qi ceilings
    const forbidden = ['hpMax', 'qiMax', 'combatPower', 'atk', 'def', 'derived', 'power'];
    for (const k of forbidden) {
      if (patch[k] !== undefined || (patch.state && patch.state[k] !== undefined) || (patch.cult && patch.cult[k] !== undefined)) {
        errors.push('ไม่อนุญาตให้แก้ไขค่าคำนวณปลายทาง (' + k + ') โดยตรง กรุณาแก้ค่าพื้นฐานหรือขั้นตบะแทน');
      }
    }
    Object.keys(EDITOR.EDITABLE_GROUPS).forEach(grp => {
      if (!patch[grp]) return;
      if (typeof patch[grp] !== 'object') { errors.push('หมวด ' + grp + ' ไม่ถูกต้อง'); return; }
      const spec = EDITOR.EDITABLE_GROUPS[grp];
      Object.keys(patch[grp]).forEach(k => {
        const val = patch[grp][k];
        if (typeof val !== 'number' || !Number.isFinite(val)) {
          errors.push('ค่า ' + grp + '.' + k + ' ต้องเป็นตัวเลขที่ถูกต้อง');
        } else if (val < spec.min || val > spec.max) {
          errors.push('ค่า ' + grp + '.' + k + ' ต้องอยู่ในช่วง ' + spec.min + ' ถึง ' + spec.max);
        }
      });
    });
    const inFight = !!(n && n.act && (n.act === 'fight' || n.act.id === 'fight'));
    if (patch.cult && typeof patch.cult === 'object') {
      if (inFight) errors.push('ตัวละครกำลังต่อสู้ ไม่สามารถเปลี่ยนวิถีหรือขั้นตบะระหว่างการต่อสู้ได้');
      const c = patch.cult;
      if (c.path !== undefined && c.path !== null && c.path !== 'MORTAL' && c.path !== 'NONE' && !CULT.PATHS[c.path]) {
        errors.push('ไม่พบวิถีหลัก: ' + c.path);
      }
      const targetPath = (c.path && c.path !== 'MORTAL' && c.path !== 'NONE') ? c.path : (c.path === 'MORTAL' || c.path === 'NONE' ? null : (n.cult ? n.cult.path : null));
      if (targetPath && c.stage !== undefined) {
        const maxStage = CULT.PATHS[targetPath].maxStage;
        if (typeof c.stage !== 'number' || !Number.isFinite(c.stage) || c.stage < 0 || c.stage > maxStage) {
          errors.push('ระดับตบะของวิถี ' + targetPath + ' ต้องอยู่ในช่วง 0 ถึง ' + maxStage);
        }
      }
      if (targetPath && c.sub !== undefined && c.sub !== 'NONE') {
        const validSubs = CULT.PATHS[targetPath].subPaths.map(s => s.id);
        if (!validSubs.includes(c.sub)) {
          errors.push('สายย่อย ' + c.sub + ' ไม่ตรงกับวิถีหลัก ' + targetPath);
        }
      }
      if (c.xp !== undefined && (typeof c.xp !== 'number' || !Number.isFinite(c.xp) || c.xp < 0)) {
        errors.push('ค่าประสบการณ์ตบะ (xp) ต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป');
      }
    }
    if (patch.economy && typeof patch.economy === 'object') {
      ['stones', 'cp', 'merit', 'sat', 'rank'].forEach(k => {
        if (patch.economy[k] !== undefined) {
          const v = patch.economy[k];
          if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) {
            errors.push('ค่า ' + k + ' ต้องเป็นตัวเลขที่ไม่ติดลบ');
          }
        }
      });
    }
    return { ok: errors.length === 0, errors };
  }

  function applyPatchToNpc(W, n, patch, isPreview) {
    const reconciled = { unequippedGear: [], removedTechs: [], notes: [] };
    if (patch.identity && typeof patch.identity === 'object') {
      if (typeof patch.identity.surname === 'string' && patch.identity.surname.trim()) n.h.name.surname = patch.identity.surname.trim();
      if (typeof patch.identity.given === 'string' && patch.identity.given.trim() && patch.identity.given.trim() !== n.h.name.given) { n.h.name.formerNames = Array.from(new Set((n.h.name.formerNames || []).concat([n.h.name.given]))); n.h.name.given = patch.identity.given.trim(); }
      if (typeof patch.identity.title === 'string') n.h.name.title = patch.identity.title.trim();
    }
    Object.keys(EDITOR.EDITABLE_GROUPS).forEach(grp => {
      if (!patch[grp] || !n.h[grp]) return;
      const spec = EDITOR.EDITABLE_GROUPS[grp];
      Object.keys(patch[grp]).forEach(k => {
        if (n.h[grp][k] !== undefined || grp === 'skills') {
          n.h[grp][k] = clamp(Number(patch[grp][k]), spec.min, spec.max);
        }
      });
    });

    if (patch.cult && typeof patch.cult === 'object') {
      const pc = patch.cult;
      const wantsMortal = pc.path === 'MORTAL' || pc.path === 'NONE' || pc.stage === 0;
      if (wantsMortal) {
        n.cult = null;
        n.h.state.qi = 0;
        reconciled.notes.push('ปรับสถานะเป็นปุถุชน (ไร้ตบะ)');
      } else {
        const targetPath = pc.path || (n.cult ? n.cult.path : 'XIAN');
        const pathDef = CULT.PATHS[targetPath];
        if (pathDef) {
          if (!n.cult) {
            const mant = CULT.bestMantra(targetPath, 1, n);
            n.cult = { path: targetPath, sub: 'NONE', stage: 1, prog: 0, mantra: mant ? mant.id : null, techs: [], learning: null, toxic: 0, lifeBonus: 0, since: W ? W.day : 1, attempts: 0, secl: null, rate: 0, pillT: 0 };
          }
          const prevPath = n.cult.path;
          n.cult.path = targetPath;
          const maxStage = pathDef.maxStage;
          let targetStage = pc.stage !== undefined ? Math.floor(pc.stage) : n.cult.stage;
          if (targetStage > maxStage) {
            targetStage = maxStage;
            reconciled.notes.push('ปรับลดขั้นตบะตามเพดานสูงสุดของวิถี ' + pathDef.shortTh + ' (ขั้น ' + maxStage + ')');
          }
          n.cult.stage = clamp(targetStage, 1, maxStage);

          const validSubs = pathDef.subPaths.map(s => s.id);
          if (pc.sub !== undefined) {
            n.cult.sub = validSubs.includes(pc.sub) ? pc.sub : 'NONE';
          } else if (prevPath !== targetPath && !validSubs.includes(n.cult.sub)) {
            n.cult.sub = 'NONE';
            reconciled.notes.push('รีเซ็ตสายย่อยเนื่องจากเปลี่ยนวิถีหลัก');
          }

          // Reconcile mantra
          const curMantra = n.cult.mantra ? CULT.tech(n.cult.mantra) : null;
          if (!curMantra || curMantra.path !== targetPath || curMantra.tier > n.cult.stage) {
            const bestM = CULT.bestMantra(targetPath, n.cult.stage, n);
            n.cult.mantra = bestM ? bestM.id : null;
          }

          // Reconcile techniques incompatible with new path/sub
          if (Array.isArray(n.cult.techs)) {
            const kept = [];
            n.cult.techs.forEach(tid => {
              const t = CULT.tech(tid);
              if (!t || (t.path !== 'ANY' && t.path !== targetPath) || (t.sub && t.sub !== n.cult.sub)) {
                reconciled.removedTechs.push(tid);
              } else {
                kept.push(tid);
              }
            });
            n.cult.techs = kept;
          }

          if (g.MARTIAL && g.MARTIAL.reconcileInnate) g.MARTIAL.reconcileInnate(n, W);
          if (g.MARTIAL && g.MARTIAL.reconcilePassives) g.MARTIAL.reconcilePassives(n);
          if (g.MARTIAL && g.MARTIAL.invalidateMartialCaches) g.MARTIAL.invalidateMartialCaches(n);

          // Reconcile specialization track
          if (n.cult.sub === 'NONE' || !CULT.trackDef || !CULT.trackDef(n.cult.sub)) {
            n.cult.track = null;
          } else {
            const ord = clamp(pc.trackOrdinal || (n.cult.track && n.cult.track.subPath === n.cult.sub ? n.cult.track.ordinal : n.cult.stage), 1, 9);
            n.cult.track = CULT.initTrack(n.cult.sub, ord, W ? W.day : 1);
          }

          if (pc.xp !== undefined) {
            const th = CULT.threshold(n);
            n.cult.prog = clamp(pc.xp, 0, Number.isFinite(th) ? th * 1.25 : 999999);
          }
          if (pc.clearBottleneck && n.bt) {
            n.bt = null;
            n.sealedBt = false;
          }
          if (pc.clearDeviation) {
            n.cult.toxic = 0;
            n.h.state.heartDemon = 0;
          }
        }
      }

      // Check equipped items for compatibility with updated cultivation state
      if (n.equip && typeof n.equip === 'object') {
        ['WEAPON', 'ARMOR', 'ACCESSORY'].forEach(slot => {
          const eq = n.equip[slot];
          if (!eq) return;
          const paths = Array.isArray(eq.compatiblePath) ? eq.compatiblePath : (eq.compatiblePath ? [eq.compatiblePath] : ['ANY']);
          const pathOk = paths.includes('ANY') || (n.cult && paths.includes(n.cult.path));
          const stageOk = (eq.minStage || 0) <= (n.cult ? n.cult.stage : 0);
          if (!pathOk || !stageOk) {
            n.equip[slot] = null;
            reconciled.unequippedGear.push(eq.nameTh || eq.id);
            if (!isPreview && W && W.sect && Array.isArray(W.sect.gear)) {
              W.sect.gear.push(eq);
            }
          }
        });
      }
    }

    if (patch.economy && typeof patch.economy === 'object') {
      const ec = patch.economy;
      if (ec.stones !== undefined) n.inv.stones = Math.max(0, Math.round(ec.stones));
      if (ec.cp !== undefined) n.cp = Math.max(0, Math.round(ec.cp));
      if (ec.merit !== undefined) n.merit = Math.max(0, Math.round(ec.merit));
      if (ec.sat !== undefined) n.sat = clamp(Math.round(ec.sat), 0, 100);
      if (ec.rank !== undefined) {
        const targetRank = (W && W.sect && n.id === W.sect.masterId) ? 6 : clamp(Math.floor(ec.rank), 0, 5);
        n.rank = targetRank;
      }
    }

    CULT.refreshLifespan(n);
    HC.bump(n);
    if (g.STATS && g.STATS.dirty) g.STATS.dirty(n);

    const newHpMax = CULT.hpMax(n);
    const newQiMax = CULT.qiMax(n);

    if (patch.state && typeof patch.state === 'object') {
      const st = patch.state;
      if (st.energy !== undefined) n.h.state.energy = clamp(st.energy, 0, 100);
      if (st.hunger !== undefined) n.h.state.hunger = clamp(st.hunger, 0, 100);
      if (st.fatigue !== undefined) n.h.state.fatigue = clamp(st.fatigue, 0, 100);
      if (st.stress !== undefined) n.h.state.stress = clamp(st.stress, 0, 100);
      if (st.mood !== undefined) n.h.state.mood = clamp(st.mood, -50, 50);
      if (st.heartDemon !== undefined) n.h.state.heartDemon = clamp(st.heartDemon, 0, 100);
      if (st.clearInjuries) n.inj = [];
      if (st.clearToxic && n.cult) n.cult.toxic = 0;
      if (st.hpPct !== undefined) n.h.state.hp = Math.max(1, Math.round(newHpMax * clamp(st.hpPct, 1, 100) / 100));
      if (st.qiPct !== undefined) n.h.state.qi = Math.round(newQiMax * clamp(st.qiPct, 0, 100) / 100);
    }

    n.h.state.hp = clamp(Math.round(n.h.state.hp || newHpMax), 1, newHpMax);
    n.h.state.qi = clamp(Math.round(n.h.state.qi || 0), 0, newQiMax);

    return {
      hpMax: newHpMax,
      qiMax: newQiMax,
      combatPower: Math.round(CULT.power(n)),
      lifespanMax: n.lifespanMax,
      stageName: CULT.stageName(n),
      worldRank: CULT.worldRank(n),
      reconciled
    };
  }

  EDITOR.previewCharacterEdit = (W, npcId, patch) => {
    const state = EDITOR.memberEditState(W, npcId);
    if (!state.ok) return { ok: false, reason: state.reason, errors: [state.reason] };
    const n = W.byId[npcId];
    const val = validateCharacterPatch(W, n, patch);
    if (!val.ok) return { ok: false, reason: val.errors[0], errors: val.errors };

    const clone = JSON.parse(JSON.stringify(n));
    const before = {
      hpMax: CULT.hpMax(n),
      qiMax: CULT.qiMax(n),
      combatPower: Math.round(CULT.power(n)),
      lifespanMax: n.lifespanMax,
      stageName: CULT.stageName(n),
      worldRank: CULT.worldRank(n)
    };
    const after = applyPatchToNpc(W, clone, patch, true);
    return { ok: true, before, after, warnings: state.warnings, reconciled: after.reconciled };
  };

  EDITOR.applyCharacterEdit = (W, npcId, patch) => {
    const state = EDITOR.memberEditState(W, npcId);
    if (!state.ok) return { ok: false, reason: state.reason, errors: [state.reason] };
    const n = W.byId[npcId];
    const val = validateCharacterPatch(W, n, patch);
    if (!val.ok) return { ok: false, reason: val.errors[0], errors: val.errors };

    // Save undo snapshot of character + sect gear
    W._editUndoStack = W._editUndoStack || [];
    W._editUndoStack.push({
      atDay: W.day,
      atTime: W.t,
      npcId: n.id,
      npcSnapshot: JSON.parse(JSON.stringify(n)),
      sectGearSnapshot: JSON.parse(JSON.stringify(W.sect.gear || []))
    });
    if (W._editUndoStack.length > 15) W._editUndoStack.shift();

    const before = {
      hpMax: CULT.hpMax(n),
      qiMax: CULT.qiMax(n),
      combatPower: Math.round(CULT.power(n)),
      lifespanMax: n.lifespanMax,
      stageName: CULT.stageName(n)
    };
    const after = applyPatchToNpc(W, n, patch, false);
    if (W.sect && n.id === W.sect.masterId) {
      W.sect.policy = SECT.targetPolicy(W);
    }
    SECT.notifyStockChanged(W);
    W.log('event', '[แก้ไขโดยผู้เล่น] ปรับค่าสถานะของ ' + n.h.name.given + ' (' + after.stageName + ' · พลังรบ ' + after.combatPower + ')', [n.id], { txKind: 'player-edit', actorId: n.id });
    return { ok: true, npcId: n.id, before, after, reconciled: after.reconciled, warnings: state.warnings };
  };

  EDITOR.undoLastEdit = W => {
    if (!W || !Array.isArray(W._editUndoStack) || !W._editUndoStack.length) {
      return { ok: false, reason: 'ไม่มีประวัติการแก้ไขตัวละครให้ย้อนคืน' };
    }
    const snap = W._editUndoStack.pop();
    const idx = W.npcs.findIndex(x => x && x.id === snap.npcId);
    if (idx < 0) return { ok: false, reason: 'ไม่พบตัวละครในสำนัก' };
    const target = W.npcs[idx];
    const restored = snap.npcSnapshot;
    Object.keys(target).forEach(k => { delete target[k]; });
    Object.assign(target, restored);
    HC.touch(target);
    W.byId[target.id] = target;
    if (Array.isArray(snap.sectGearSnapshot)) {
      W.sect.gear = snap.sectGearSnapshot;
    }
    if (g.STATS && g.STATS.dirty) g.STATS.dirty(restored);
    SECT.notifyStockChanged(W);
    W.log('event', '[แก้ไขโดยผู้เล่น] ย้อนคืนค่าสถานะของ ' + restored.h.name.given + ' กลับสู่ก่อนแก้ไข (เวลาโลกจำลองยังคงเดินหน้าตามปกติ)', [restored.id], { txKind: 'player-edit-undo', actorId: restored.id });
    return { ok: true, npcId: restored.id, nameTh: restored.h.name.given };
  };

  /* ---------- Item Catalog & Spawner ---------- */
  EDITOR.catalog = (W, filters) => {
    filters = filters || {};
    const out = [];
    // 1. Provisions & Stones
    out.push({ key: 'PROVISION:grain', kind: 'PROVISION', id: 'grain', nameTh: 'ข้าวสาร', tier: 1, stackable: true, canSect: true, canNpc: false, descTh: 'เสบียงหลักสำหรับหุงอาหารในโรงครัว' });
    out.push({ key: 'PROVISION:meal', kind: 'PROVISION', id: 'meal', nameTh: 'อาหารปรุงเสร็จ', tier: 1, stackable: true, canSect: true, canNpc: false, descTh: 'อาหารพร้อมรับประทานและเสบียงเดินทาง' });
    out.push({ key: 'PROVISION:stones', kind: 'PROVISION', id: 'stones', nameTh: 'ศิลาวิญญาณ', tier: 1, stackable: true, canSect: true, canNpc: true, descTh: 'เงินตราหลักของสำนักและยุทธภพ' });

    // 2. Materials
    (JD.ITEMS.materials || []).forEach(m => {
      out.push({ key: 'MATERIAL:' + m.id, kind: 'MATERIAL', id: m.id, nameTh: m.nameTh, tier: m.tier || 1, cat: m.cat, stackable: true, canSect: true, canNpc: true, descTh: 'วัตถุดิบระดับ ' + (m.tier || 1) + ' (' + (m.cat || 'ทั่วไป') + ')' });
    });

    // 3. Basic & Crafted Pills
    (JD.CP && JD.CP.BASIC ? JD.CP.BASIC : []).forEach(b => {
      out.push({ key: 'PILL:P:' + b.id, kind: 'PILL', id: 'P:' + b.id, nameTh: b.nameTh, tier: b.tier || 1, stackable: true, canSect: true, canNpc: true, descTh: 'โอสถสวัสดิการพื้นฐาน' });
    });
    (JD.ITEMS.recipes || []).filter(r => r.outType === 'PILL').forEach(r => {
      const pid = r.outItemId || ('P:' + r.id);
      out.push({ key: 'CRAFTED_PILL:' + pid, kind: 'CRAFTED_PILL', id: pid, recipeId: r.id, nameTh: r.outNameTh || r.nameTh, tier: r.tier || 1, compatiblePath: r.compatiblePath || 'ANY', minStage: r.minStage || 0, stackable: true, canSect: true, canNpc: true, descTh: 'โอสถหลอมจากตำรับระดับ ' + (r.tier || 1) });
    });

    // 4. Equipment Recipes
    (JD.ITEMS.recipes || []).filter(r => r.outType === 'EQUIPMENT').forEach(r => {
      out.push({ key: 'EQUIPMENT:' + r.id, kind: 'EQUIPMENT', id: r.id, nameTh: r.outNameTh || r.nameTh, tier: r.tier || 1, slot: (ECO.mintGear ? ECO.mintGear(r, 1).slot : (r.effect && r.effect.slot)), compatiblePath: r.compatiblePath || 'ANY', minStage: r.minStage || 0, stackable: false, hasQuality: true, canSect: true, canNpc: true, descTh: 'ยุทโธปกรณ์ช่อง ' + (r.effect && r.effect.slot) + ' ระดับ ' + (r.tier || 1) });
    });

    // 5. Technique Manuals (including legendary mantras and all discoverable manuals)
    const seenManualIds = new Set();
    [...(JD.TECH.techniques || []), ...(JD.TECH.mantras || [])].forEach(t => {
      if (!t || !t.id || t.innateOnly || seenManualIds.has(t.id)) return;
      seenManualIds.add(t.id);
      out.push({ key: 'TECH_MANUAL:' + t.id, kind: 'TECH_MANUAL', id: t.id, nameTh: t.nameTh, tier: t.tier || 1, grade: t.grade || 'Common', compatiblePath: t.path || 'ANY', sub: t.sub || null, stackable: false, canSect: true, canNpc: true, descTh: 'คัมภีร์วิชาวิถี ' + (t.path || 'ANY') + ' ระดับ ' + (t.tier || 1) + ' (' + (t.grade || 'Common') + ')' });
    });

    // 6. Specialization Crystals & Sub Manuals
    CULT.subList.forEach(({ path, sub }) => {
      out.push({ key: 'CRYSTAL:' + sub.id, kind: 'CRYSTAL', id: sub.id, nameTh: 'ผลึกสายย่อย「' + sub.nameTh + '」', tier: 3, compatiblePath: path, stackable: true, canSect: true, canNpc: true, descTh: 'ผลึกสืบทอดสายย่อย (' + path + ') ใช้แล้วหมดไป' });
      out.push({ key: 'SUB_MANUAL:' + sub.id, kind: 'SUB_MANUAL', id: sub.id, nameTh: 'คัมภีร์สายย่อย「' + sub.nameTh + '」', tier: 4, compatiblePath: path, stackable: false, canSect: true, canNpc: true, descTh: 'คัมภีร์สายย่อยถาวรประจำหอคัมภีร์ (' + path + ')' });
    });

    // 7. Recipe Scrolls
    (JD.ITEMS.recipes || []).filter(r => r.discoverable).forEach(r => {
      out.push({ key: 'RECIPE_SCROLL:' + r.id, kind: 'RECIPE_SCROLL', id: r.id, nameTh: 'ม้วนตำรับ「' + r.nameTh + '」', tier: r.tier || 1, compatiblePath: r.compatiblePath || 'ANY', stackable: false, canSect: true, canNpc: true, descTh: 'ม้วนตำรับหายากระดับ ' + (r.tier || 1) });
    });

    // 8. Rare Beast Organs
    if (g.CONTENT && Array.isArray(g.CONTENT.rareOrgans)) {
      g.CONTENT.rareOrgans.forEach(o => {
        out.push({ key: 'ORGAN:' + o.id, kind: 'ORGAN', id: o.id, nameTh: o.nameTh, tier: o.tier || 2, stackable: true, canSect: true, canNpc: true, descTh: o.descTh || ('อวัยวะอสูรหายากระดับ ' + (o.tier || 2)) });
      });
    }

    const q = (filters.search || '').trim().toLowerCase();
    const kindFilter = filters.kind && filters.kind !== 'ALL' ? filters.kind : null;
    const tierFilter = Number.isFinite(Number(filters.tier)) && Number(filters.tier) > 0 ? Number(filters.tier) : null;
    const destFilter = filters.dest || null;

    return out.filter(item => {
      if (kindFilter && item.kind !== kindFilter) return false;
      if (tierFilter && item.tier !== tierFilter) return false;
      if (destFilter === 'sect' && !item.canSect) return false;
      if (destFilter === 'npc' && !item.canNpc) return false;
      if (q && !item.nameTh.toLowerCase().includes(q) && !String(item.id).toLowerCase().includes(q) && !String(item.kind).toLowerCase().includes(q)) return false;
      return true;
    });
  };

  EDITOR.spawnItem = (W, opts) => {
    opts = opts || {};
    if (!W || !W.sect) return { ok: false, reason: 'ไม่พบข้อมูลสำนัก' };
    const kind = opts.kind;
    const id = opts.id;
    const dest = opts.dest || 'sect'; // 'sect' | 'npc'
    const qty = Math.floor(Number(opts.qty == null ? 1 : opts.qty));
    const quality = clamp(Number(opts.quality == null ? 1 : opts.quality), 0.7, 1.5);

    if (!Number.isSafeInteger(qty) || qty <= 0 || qty > 50000) {
      return { ok: false, reason: 'จำนวนไอเทมต้องเป็นจำนวนเต็มบวก (1 - 50,000)' };
    }

    let npc = null;
    if (dest === 'npc') {
      const st = EDITOR.memberEditState(W, opts.npcId);
      if (!st.ok) return { ok: false, reason: st.reason };
      npc = W.byId[opts.npcId];
    } else if (dest !== 'sect') {
      return { ok: false, reason: 'ปลายทางไม่ถูกต้อง' };
    }

    let itemNameTh = '';
    const mintedUids = [];

    if (kind === 'PROVISION') {
      if (id === 'stones') {
        itemNameTh = 'ศิลาวิญญาณ';
        if (dest === 'sect') {
          W.sect.stones = (W.sect.stones || 0) + qty;
        } else {
          npc.inv.stones = (npc.inv.stones || 0) + qty;
        }
      } else if (id === 'grain' || id === 'meal') {
        if (dest !== 'sect') return { ok: false, reason: 'เสบียงส่วนกลางเสกเข้าคลังสำนักเท่านั้น' };
        itemNameTh = ECO.name(id);
        ECO.add(W, id, qty);
      } else {
        return { ok: false, reason: 'ไม่พบประเภทเสบียง: ' + id };
      }
    } else if (kind === 'MATERIAL') {
      const m = ECO.matById[id];
      if (!m) return { ok: false, reason: 'ไม่พบวัตถุดิบ: ' + id };
      itemNameTh = m.nameTh;
      if (dest === 'sect') {
        ECO.add(W, id, qty);
      } else {
        npc.inv.mats = npc.inv.mats || {};
        npc.inv.mats[id] = (npc.inv.mats[id] || 0) + qty;
        npc.inv.spawnedMats = npc.inv.spawnedMats || {};
        npc.inv.spawnedMats[id] = (npc.inv.spawnedMats[id] || 0) + qty;
      }
    } else if (kind === 'PILL' || kind === 'CRAFTED_PILL') {
      const pillId = String(id).startsWith('P:') ? id : ('P:' + id);
      const info = ECO.pillInfo(pillId);
      if (!info) return { ok: false, reason: 'ไม่พบโอสถ: ' + id };
      itemNameTh = info.nameTh || ECO.name(pillId);
      if (dest === 'sect') {
        ECO.add(W, pillId, qty, quality);
      } else {
        ECO.addPersonalPill(npc, pillId, quality, qty);
        npc.inv.spawnedPills = npc.inv.spawnedPills || {};
        npc.inv.spawnedPills[pillId] = (npc.inv.spawnedPills[pillId] || 0) + qty;
      }
    } else if (kind === 'EQUIPMENT') {
      const r = ECO.recipeById[id];
      if (!r || r.outType !== 'EQUIPMENT') return { ok: false, reason: 'ไม่พบแม่แบบอุปกรณ์: ' + id };
      const cap = Math.min(qty, 25);
      itemNameTh = r.outNameTh || r.nameTh;
      for (let i = 0; i < cap; i++) {
        const gear = ECO.mintGear(r, quality); gear.playerSpawned = true; W.sect.spawnSeq = (W.sect.spawnSeq || 0) + 1; gear.uid = 'eq_sp_' + W.sect.spawnSeq;
        mintedUids.push(gear.uid);
        if (dest === 'sect') {
          W.sect.gear = W.sect.gear || [];
          W.sect.gear.push(gear);
        } else {
          if (opts.autoEquip && (!npc.equip || !npc.equip[gear.slot]) && SECT.canAccessItem(W, npc, gear)) {
            npc.equip = npc.equip || { WEAPON: null, ARMOR: null, ACCESSORY: null };
            npc.equip[gear.slot] = gear;
            HC.bump(npc);
          } else {
            npc.inv.gear = npc.inv.gear || [];
            npc.inv.gear.push(gear);
          }
        }
      }
    } else if (kind === 'TECH_MANUAL') {
      if (g.MARTIAL && g.MARTIAL.isInnateTech && g.MARTIAL.isInnateTech(id)) return { ok: false, reason: 'วิชาเฉพาะสายย่อยติดตัวไม่สามารถเสกเป็นคัมภีร์ได้ (จะตื่นรู้เองเมื่อเดินสายย่อยนั้น)' };
      const t = CULT.tech(id);
      if (!t || t.innateOnly) return { ok: false, reason: 'ไม่พบคัมภีร์วิชา: ' + id };
      itemNameTh = 'คัมภีร์「' + t.nameTh + '」';
      if (dest === 'sect') {
        W.sect.library = W.sect.library || [];
        if (!W.sect.library.includes(id)) W.sect.library.push(id);
      } else {
        npc.inv.techs = npc.inv.techs || [];
        if (!npc.inv.techs.includes(id)) npc.inv.techs.push(id);
        npc.inv.spawnedTechs = npc.inv.spawnedTechs || [];
        if (!npc.inv.spawnedTechs.includes(id)) npc.inv.spawnedTechs.push(id);
      }
    } else if (kind === 'CRYSTAL') {
      const strId = String(id);
      let cKey = strId;
      if (strId.startsWith('T:')) {
        const rawT = strId.slice(2);
        if (g.MARTIAL && g.MARTIAL.isInnateTech && g.MARTIAL.isInnateTech(rawT)) return { ok: false, reason: 'วิชาเฉพาะสายย่อยติดตัวไม่สามารถเสกเป็นผลึกได้' };
        const t = CULT.tech(rawT);
        if (!t || t.innateOnly) return { ok: false, reason: 'ไม่พบผลึกวิชา: ' + id };
        itemNameTh = 'ผลึกวิชา「' + t.nameTh + '」';
      } else {
        const rawSub = strId.startsWith('S:') ? strId.slice(2) : strId;
        const subObj = CULT.subList.find(x => x.sub.id === rawSub);
        if (subObj) {
          cKey = 'S:' + rawSub;
          itemNameTh = 'ผลึกสายย่อย「' + subObj.sub.nameTh + '」';
        } else if (CULT.tech(rawSub)) {
          const t = CULT.tech(rawSub);
          if (t.innateOnly || (g.MARTIAL && g.MARTIAL.isInnateTech && g.MARTIAL.isInnateTech(rawSub))) return { ok: false, reason: 'วิชาเฉพาะสายย่อยติดตัวไม่สามารถเสกเป็นผลึกได้' };
          cKey = 'T:' + rawSub;
          itemNameTh = 'ผลึกวิชา「' + t.nameTh + '」';
        } else {
          return { ok: false, reason: 'ไม่พบผลึกสายย่อยหรือวิชา: ' + id };
        }
      }
      if (dest === 'sect') {
        W.sect.crystals = W.sect.crystals || {};
        W.sect.crystals[cKey] = (W.sect.crystals[cKey] || 0) + qty;
      } else {
        npc.inv.crystals = npc.inv.crystals || {};
        npc.inv.crystals[cKey] = (npc.inv.crystals[cKey] || 0) + qty;
        npc.inv.spawnedCrystals = npc.inv.spawnedCrystals || {};
        npc.inv.spawnedCrystals[cKey] = (npc.inv.spawnedCrystals[cKey] || 0) + qty;
      }
    } else if (kind === 'SUB_MANUAL') {
      const subObj = CULT.subList.find(x => x.sub.id === id);
      if (!subObj) return { ok: false, reason: 'ไม่พบคัมภีร์สายย่อย: ' + id };
      itemNameTh = 'คัมภีร์สายย่อย「' + subObj.sub.nameTh + '」';
      if (dest === 'sect') {
        W.sect.subLibrary = W.sect.subLibrary || [];
        if (!W.sect.subLibrary.includes(id)) W.sect.subLibrary.push(id);
      } else {
        npc.inv.subManuals = npc.inv.subManuals || [];
        if (!npc.inv.subManuals.includes(id)) npc.inv.subManuals.push(id);
        npc.inv.spawnedSubManuals = npc.inv.spawnedSubManuals || [];
        if (!npc.inv.spawnedSubManuals.includes(id)) npc.inv.spawnedSubManuals.push(id);
      }
    } else if (kind === 'RECIPE_SCROLL') {
      const r = ECO.recipeById[id];
      if (!r) return { ok: false, reason: 'ไม่พบม้วนตำรับ: ' + id };
      itemNameTh = 'ม้วนตำรับ「' + r.nameTh + '」';
      if (dest === 'sect') {
        W.sect.knownRecipes = W.sect.knownRecipes || [];
        if (!W.sect.knownRecipes.includes(id)) W.sect.knownRecipes.push(id);
      } else {
        npc.inv.recipes = npc.inv.recipes || [];
        if (!npc.inv.recipes.includes(id)) npc.inv.recipes.push(id);
        npc.inv.spawnedRecipes = npc.inv.spawnedRecipes || [];
        if (!npc.inv.spawnedRecipes.includes(id)) npc.inv.spawnedRecipes.push(id);
      }
    } else if (kind === 'ORGAN') {
      if (!g.CONTENT || !g.CONTENT.organById || !g.CONTENT.organById[id]) {
        return { ok: false, reason: 'ไม่พบอวัยวะอสูร: ' + id };
      }
      const o = g.CONTENT.organById[id];
      itemNameTh = o.nameTh;
      if (dest === 'sect') {
        g.CONTENT.addOrgan(W, id, qty);
      } else {
        npc.inv.organs = npc.inv.organs || {};
        npc.inv.organs[id] = (npc.inv.organs[id] || 0) + qty;
        npc.inv.spawnedOrgans = npc.inv.spawnedOrgans || {};
        npc.inv.spawnedOrgans[id] = (npc.inv.spawnedOrgans[id] || 0) + qty;
      }
    } else {
      return { ok: false, reason: 'ไม่รองรับประเภทไอเทม: ' + kind };
    }

    SECT.notifyStockChanged(W, id);
    const targetLabel = dest === 'sect' ? 'คลังสำนัก' : ('ถุงส่วนตัวของ ' + npc.h.name.given);
    W.log('finance', '[เสกโดยผู้เล่น] เพิ่ม ' + itemNameTh + ' ×' + (mintedUids.length || qty) + ' เข้าสู่' + targetLabel, npc ? [npc.id] : [], { txKind: 'player-spawn', itemId: id, qty: mintedUids.length || qty, recipientId: npc ? npc.id : null });
    return { ok: true, kind, id, nameTh: itemNameTh, qty: mintedUids.length || qty, dest, npcId: npc ? npc.id : null, uids: mintedUids };
  };

  /* ---------- Personal Bag Actions (Equip / Unequip / Use / Donate) ---------- */
  EDITOR.equipPersonalGear = (W, npcId, gearUidOrId) => {
    const st = EDITOR.memberEditState(W, npcId);
    if (!st.ok) return { ok: false, reason: st.reason };
    if (!st.canEditEquip) return { ok: false, reason: 'ตัวละครกำลังต่อสู้ ไม่สามารถเปลี่ยนอุปกรณ์สวมใส่ได้' };
    const n = W.byId[npcId];
    const list = (n.inv && Array.isArray(n.inv.gear)) ? n.inv.gear : [];
    const idx = list.findIndex(g2 => g2 && (g2.uid === gearUidOrId || g2.id === gearUidOrId));
    if (idx < 0) return { ok: false, reason: 'ไม่พบอุปกรณ์ในถุงส่วนตัว' };
    const eq = list[idx];
    const paths = Array.isArray(eq.compatiblePath) ? eq.compatiblePath : (eq.compatiblePath ? [eq.compatiblePath] : ['ANY']);
    if (!paths.includes('ANY') && (!n.cult || !paths.includes(n.cult.path))) {
      return { ok: false, reason: 'วิถีไม่ตรงกับอุปกรณ์ (' + paths.join('/') + ')' };
    }
    if ((eq.minStage || 0) > (n.cult ? n.cult.stage : 0)) {
      return { ok: false, reason: 'ต้องมีตบะอย่างน้อยขั้น ' + eq.minStage };
    }
    list.splice(idx, 1);
    n.equip = n.equip || { WEAPON: null, ARMOR: null, ACCESSORY: null };
    if (n.equip[eq.slot]) list.push(n.equip[eq.slot]);
    if (!list.length) delete n.inv.gear;
    const oldHp = n.h && n.h.state ? n.h.state.hp : null;
    const oldQi = n.h && n.h.state ? n.h.state.qi : null;
    n.equip[eq.slot] = eq;
    HC.bump(n);
    if (g.STATS && g.STATS.dirty) g.STATS.dirty(n);
    if (g.MARTIAL && g.MARTIAL.reconcilePassives) g.MARTIAL.reconcilePassives(n);
    if (g.MARTIAL && g.MARTIAL.syncResourceCaps) g.MARTIAL.syncResourceCaps(n, oldHp, oldQi);
    return { ok: true, equipped: eq };
  };

  EDITOR.unequipGear = (W, npcId, slot, toSect) => {
    const st = EDITOR.memberEditState(W, npcId);
    if (!st.ok) return { ok: false, reason: st.reason };
    if (!st.canEditEquip) return { ok: false, reason: 'ตัวละครกำลังต่อสู้ ไม่สามารถถอดอุปกรณ์สวมใส่ได้' };
    const n = W.byId[npcId];
    if (!n.equip || !n.equip[slot]) return { ok: false, reason: 'ไม่มีอุปกรณ์สวมใส่ในช่องนี้' };
    const eq = n.equip[slot];
    const oldHp = n.h && n.h.state ? n.h.state.hp : null;
    const oldQi = n.h && n.h.state ? n.h.state.qi : null;
    n.equip[slot] = null;
    if (toSect) {
      W.sect.gear = W.sect.gear || [];
      W.sect.gear.push(eq);
      SECT.notifyStockChanged(W, eq.id);
    } else {
      n.inv.gear = n.inv.gear || [];
      n.inv.gear.push(eq);
    }
    HC.bump(n);
    if (g.STATS && g.STATS.dirty) g.STATS.dirty(n);
    if (g.MARTIAL && g.MARTIAL.reconcilePassives) g.MARTIAL.reconcilePassives(n);
    if (g.MARTIAL && g.MARTIAL.syncResourceCaps) g.MARTIAL.syncResourceCaps(n, oldHp, oldQi);
    return { ok: true, unequipped: eq };
  };

  EDITOR.donatePersonalGear = (W, npcId, gearUidOrId) => {
    const st = EDITOR.memberEditState(W, npcId);
    if (!st.ok) return { ok: false, reason: st.reason };
    const n = W.byId[npcId];
    const list = (n.inv && Array.isArray(n.inv.gear)) ? n.inv.gear : [];
    const idx = list.findIndex(g2 => g2 && (g2.uid === gearUidOrId || g2.id === gearUidOrId));
    if (idx < 0) return { ok: false, reason: 'ไม่พบอุปกรณ์ในถุงส่วนตัว' };
    const eq = list[idx];
    list.splice(idx, 1);
    if (!list.length) delete n.inv.gear;
    W.sect.gear = W.sect.gear || [];
    W.sect.gear.push(eq);
    SECT.notifyStockChanged(W, eq.id);
    const spawned = !!eq.playerSpawned;
    const reward = spawned ? 0 : Math.max(8, Math.round((eq.tier || 1) * 14));
    if (reward > 0 && g.CPE && g.CPE.mint) {
      g.CPE.mint(W, n, reward, 'บริจาคอุปกรณ์「' + eq.nameTh + '」', false);
      g.CPE.S(W).donated = (g.CPE.S(W).donated || 0) + reward;
    }
    W.log('finance', n.h.name.given + ' ส่งมอบอุปกรณ์「' + eq.nameTh + '」เข้าคลังแสงสำนัก ได้ ' + reward + ' คป.' + (spawned ? ' (ไอเทมเสก)' : ''), [n.id]);
    return { ok: true, item: eq, reward, playerSpawned: spawned };
  };

  EDITOR.usePersonalItem = (W, npcId, kind, itemId) => {
    const st = EDITOR.memberEditState(W, npcId);
    if (!st.ok) return { ok: false, reason: st.reason };
    const n = W.byId[npcId];
    if (kind === 'PILL' || kind === 'CRAFTED_PILL') {
      const pid = String(itemId).startsWith('P:') ? itemId : ('P:' + itemId);
      if (g.CPE && g.CPE.consumePersonalPill) {
        const used = g.CPE.consumePersonalPill(W, n, pid);
        return used ? { ok: true, kind, id: pid } : { ok: false, reason: 'ไม่มีโอสถนี้ในถุงหรือยังไม่สามารถใช้ได้' };
      }
      return { ok: false, reason: 'ไม่พบระบบใช้โอสถ' };
    }
    if (kind === 'CRYSTAL') {
      const cKey = String(itemId).startsWith('S:') || String(itemId).startsWith('T:') ? itemId : ('S:' + itemId);
      if (g.MARTIAL && g.MARTIAL.useCrystal) {
        return g.MARTIAL.useCrystal(W, n, cKey);
      }
    }
    if (kind === 'TECH_MANUAL') {
      if (g.MARTIAL && g.MARTIAL.isInnateTech && g.MARTIAL.isInnateTech(itemId)) return { ok: false, reason: 'วิชาเฉพาะสายย่อยติดตัวไม่สามารถเรียนผ่านคัมภีร์ได้' };
      if (!n.inv || !Array.isArray(n.inv.techs) || !n.inv.techs.includes(itemId)) return { ok: false, reason: 'ไม่มีคัมภีร์ในถุงส่วนตัว' };
      const t = CULT.tech(itemId);
      if (!t || t.innateOnly || !n.cult) return { ok: false, reason: 'ต้องเป็นผู้บำเพ็ญจึงจะเรียนคัมภีร์ได้' };
      if (t.path !== 'ANY' && t.path !== n.cult.path) return { ok: false, reason: 'วิถีไม่ตรงกับคัมภีร์ (' + t.path + ')' };
      if (t.sub && t.sub !== n.cult.sub) return { ok: false, reason: 'ต้องมีสายย่อย ' + t.sub };
      const effStage = CULT.effectiveTechStage ? CULT.effectiveTechStage(n) : n.cult.stage;
      if ((t.reqTier || t.tier || 1) > effStage) return { ok: false, reason: 'ขั้นบำเพ็ญไม่ถึงเกณฑ์ (ต้องการขั้น ' + (t.reqTier || t.tier) + ')' };
      const oldHp = n.h && n.h.state ? n.h.state.hp : null;
      const oldQi = n.h && n.h.state ? n.h.state.qi : null;
      if (/_MANTRA$/.test(t.cat || '')) {
        n.cult.unlockedMantras = Array.isArray(n.cult.unlockedMantras) ? n.cult.unlockedMantras : [];
        if (!n.cult.unlockedMantras.includes(itemId)) n.cult.unlockedMantras.push(itemId);
        n.cult.mantra = itemId;
        if (Array.isArray(t.moveDefs) && t.moveDefs.length && !n.cult.techs.includes(itemId)) n.cult.techs.push(itemId);
      } else {
        if (!n.cult.techs.includes(itemId)) n.cult.techs.push(itemId);
      }
      if (g.MARTIAL && g.MARTIAL.reconcilePassives) g.MARTIAL.reconcilePassives(n);
      if (g.MARTIAL && g.MARTIAL.syncResourceCaps) g.MARTIAL.syncResourceCaps(n, oldHp, oldQi);
      n.inv.techs = n.inv.techs.filter(x => x !== itemId);
      if (Array.isArray(n.inv.spawnedTechs)) {
        n.inv.spawnedTechs = n.inv.spawnedTechs.filter(x => x !== itemId);
        if (!n.inv.spawnedTechs.length) delete n.inv.spawnedTechs;
      }
      HC.bump(n);
      W.log('learn', n.h.name.given + ' ศึกษาคัมภีร์ส่วนตัว「' + t.nameTh + '」จนสำเร็จ!', [n.id]);
      return { ok: true, kind, id: itemId };
    }
    if (kind === 'RECIPE_SCROLL') {
      if (g.CONTENT && g.CONTENT.authorizeRecipe) {
        return g.CONTENT.authorizeRecipe(W, n, itemId);
      }
    }
    if (kind === 'ORGAN') {
      if (g.CONTENT && g.CONTENT.refineOrgan) {
        return g.CONTENT.refineOrgan(W, n, itemId, { free: true });
      }
    }
    return { ok: false, reason: 'ไม่สามารถใช้งานไอเทมประเภทนี้โดยตรง' };
  };

  SECT.EDITOR = EDITOR;

  g.SECT = SECT;
  if (typeof module === 'object' && module.exports) module.exports = SECT;
})(typeof globalThis !== 'undefined' ? globalThis : this);
