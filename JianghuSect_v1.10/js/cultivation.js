/* cultivation.js — วิถีบำเพ็ญ (5 วิถีหลัก: XIAN/BODY/GOD/DEMON/HEART_SOUL) ใช้ค่ามนุษย์จาก HC เท่านั้น
 * npc.cult = null (ปุถุชน) หรือ {path, sub, stage, prog, mantra, techs[], learning, toxic, dev(จิตมาร)...}
 * วิถีใหม่ในอนาคตเพียงเพิ่มแถวใน JD.CULT.paths + ตารางความชอบด้านล่าง ไม่ต้องแตะแกน HC */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js'), HC = g.HC, JD = g.JD;
  const clamp = U.clamp;
  const CULT = {};
  CULT.PATHS = JD.CULT.paths;
  CULT.THRESH = {
    XIAN: [260, 700, 1800, 4500, 11000, 27000, 65000, 150000],
    BODY: [230, 800, 3200, 12000],
    GOD: [300, 1200, 5200],
    DEMON: [240, 650, 1680, 4200, 10400, 25500, 61500, 142000],
    HEART_SOUL: [250, 680, 1750, 4400, 10800, 26500, 63500, 146000]
  };
  // รูปแบบความชอบของแต่ละสายย่อย: aff=ความถนัด, p=บุคลิก/ค่า/สติปัญญา(เส้นทางเต็ม), หมายเหตุ: ใช้คำนวณ "NPC เลือกเอง"
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
  /** คะแนนความอยากเดินสายย่อย (ทำไมคนนี้เลือกวิถีนี้ — อธิบายได้) */
  CULT.pathScores = (npc, bias) => {
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
    CULT.subList.forEach(({ path, sub }) => {
      const pref = SUBPREF[sub.id] || (JD.EXPANSION.subPreferences || {})[sub.id] || (JD.MARTIAL.subPreferences || {})[sub.id] || { aff: {}, p: {} };
      let s = base[path] || 0;
      Object.keys(pref.aff).forEach(k => { s += (HC.eff(npc, 'affinities.' + k) - 30) * pref.aff[k] * 0.45; });
      Object.keys(pref.p).forEach(k => { const w = pref.p[k]; s += (w >= 0 ? pval(npc, k) - 50 : 50 - pval(npc, k)) * Math.abs(w) * 0.4; });
      if (bias && bias[sub.id]) s += bias[sub.id];
      if (g.MARTIAL && g.MARTIAL.pathSkillAffinity) s += g.MARTIAL.pathSkillAffinity(npc, path, sub.id);
      out.push({ path, sub: sub.id, score: s });
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
    return CULT.PATHS[c.path].stages[c.stage - 1];
  };
  CULT.stageName = npc => npc.cult ? CULT.PATHS[npc.cult.path].shortTh + ' · ' + CULT.PATHS[npc.cult.path].stages[npc.cult.stage - 1].nameTh.replace(/^ขั้นที่ \d+ • /, '') + ' (' + npc.cult.stage + ')' : 'ปุถุชน';
  CULT.maxStage = npc => npc.cult ? CULT.PATHS[npc.cult.path].maxStage : 0;
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
  CULT.hpMult = npc => npc.cult ? 1 + 0.42 * (npc.cult.stage - 1) + 0.25 : 1;
  CULT.hpMax = npc => Math.round((g.MARTIAL ? g.MARTIAL.derived(npc) : HC.derived(npc)).hpMax * CULT.hpMult(npc));
  CULT.qiMax = npc => npc.cult ? Math.round((40 + (g.MARTIAL ? g.MARTIAL.eff(npc, 'physiology.meridianCapacity') : HC.eff(npc, 'physiology.meridianCapacity')) * 0.9) * (1 + 0.5 * (npc.cult.stage - 1))) : 0;
  CULT.speedMult = npc => npc.cult ? 1 + 0.05 * (npc.cult.stage - 1) : 1;

  /* ----- ตั้งต้นการบำเพ็ญ: เปิดเส้นลมปราณ (awakening) ----- */
  CULT.awaken = (npc, rng, bias, day) => {
    const ch = CULT.choosePath(npc, rng, bias);
    const mant = CULT.bestMantra(ch.path, 1, npc);
    npc.cult = { path: ch.path, sub: 'NONE', stage: 1, prog: 0, mantra: mant ? mant.id : null, techs: [], learning: null, toxic: 0, lifeBonus: 0, since: day, attempts: 0, secl: null, rate: 0, pillT: 0 };
    // Specializations are acquired from finite crystals or reusable manuals. Founding bootstrap lives in SIM.awaken.
    CULT.refreshLifespan(npc);
    HC.bump(npc);
    return ch;
  };
  CULT.mantraPool = path => JD.TECH.mantras.filter(m => m.path === path).concat(JD.TECH.techniques.filter(t => /_MANTRA$/.test(t.cat) && t.path === path).map(t => ({ id: t.id, nameTh: t.nameTh, path: t.path, tier: t.tier, power: t.power })));
  CULT.bestMantra = (path, maxTier, npc) => {
    const pool = CULT.mantraPool(path).filter(m => m.tier <= maxTier);
    pool.sort((a, b) => b.tier - a.tier || b.power - a.power);
    return pool[0] || null;
  };
  const TECH_BY_ID = {}; JD.TECH.techniques.forEach(t => TECH_BY_ID[t.id] = t); JD.TECH.mantras.forEach(t => TECH_BY_ID[t.id] = t);
  CULT.tech = id => TECH_BY_ID[id];

  /* ----- อัตราบำเพ็ญ (แต้มต่อชั่วโมงเกม) ----- */
  CULT.rate = (npc, env) => {
    const c = npc.cult; if (!c) return 0;
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
      base = 0.85 * clamp((HC.eff(npc, 'social.charisma') + HC.eff(npc, 'intellect.willpower') + HC.eff(npc, 'aptitudes.cultivation')) / 3 / 55, 0.35, 2.2);
    }
    const m = c.mantra ? TECH_BY_ID[c.mantra] : null;
    const mantraK = m ? 1 + 0.11 * (m.tier - 1) : 0.9;
    const focus = 0.65 + 0.35 * HC.eff(npc, 'intellect.focus') / 100;
    const rest = npc.h.state.rest < 30 ? 0.6 : npc.h.state.rest < 55 ? 0.85 : 1;
    let toxic, dev;
    const hd = npc.h.state.heartDemon || 0;
    if (c.path === 'DEMON') {
      // วิถีมารอสูร: ทนพิษโอสถ/กู่สูง และเปลี่ยนปมจิตมารระดับต้น-กลาง (<=60) เป็นแรงขับเคลื่อนตบะมาร (+สูงสุด 22%) แต่หากเกิน 60 จะเสี่ยงปราณมารย้อนกลับ
      toxic = 1 - clamp(c.toxic / (c.sub === 'VENOM_GU_SOVEREIGN' ? 360 : 240), 0, 0.28);
      dev = hd <= 60 ? (1 + (hd / 60) * 0.22) : Math.max(0.55, 1.22 - ((hd - 60) / 40) * 0.65);
    } else if (c.path === 'HEART_SOUL') {
      // วิถีจิต·เซน: ยามจิตสงบไร้ฝุ่น (จิตมาร<=10 และความเครียด<=25) จะได้โบนัสกระจกใจ +15% แต่หากจิตมารหรือความเครียดสูงจะถูกรบกวนหนักกว่าปกติ
      toxic = 1 - clamp(c.toxic / 140, 0, 0.5);
      const stressPen = clamp(Math.max(0, (npc.h.state.stress || 0) - 45) / 150, 0, 0.25);
      dev = (hd <= 10 && (npc.h.state.stress || 0) <= 25) ? 1.15 : Math.max(0.35, 1 - clamp(hd / 140, 0, 0.55) - stressPen);
    } else {
      toxic = 1 - clamp(c.toxic / 140, 0, 0.5);
      dev = 1 - clamp(hd / 200, 0, 0.4);
    }
    const pill = c.pillT > 0 ? 1 + (c.pillBoost || 0) : 1;
    const sp = 1 + HC.special(npc, 'cultivation.rateBonus');
    return base * (g.MARTIAL ? g.MARTIAL.skillEffects(npc).cultivation : 1) * mantraK * focus * rest * toxic * dev * pill * (env || 1) * sp;
  };
  CULT.gain = (npc, pts) => {
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
    const martial = Math.max(...['SWORD', 'BLADE', 'SPEAR', 'FIST_PALM', 'BODY_REFINING', 'SOUL_DIVINE', 'POISON'].map(k => npc.h.skills[k] || 0));
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
    const c = npc.cult; const st = CULT.PATHS[c.path].stages[c.stage - 1];
    const si = CULT.subInfo(c.path, c.sub);
    let p = st.breakthroughBaseChance * si.breakthroughMod;
    const root = HC.ROOT_BY_ID[npc.h.root.grade] || HC.ROOT_BY_ID.MORTAL;
    p *= 0.72 + clamp(HC.derived(npc).cultivationTalent, 20, 120) / 200;
    p += root.breakthroughBonus;
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
      // รางวัลถาวรเล็ก ๆ ต่อกาย/จิต
      const h = npc.h;
      h.physiology.meridianCapacity = Math.min(99, h.physiology.meridianCapacity + 1.2);
      h.physiology.spiritualFoundation = Math.min(99, h.physiology.spiritualFoundation + 0.8);
      h.physiology.vitality = Math.min(99, h.physiology.vitality + 0.5);
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
      if (m && (!c.mantra || TECH_BY_ID[c.mantra].tier < m.tier) && c.stage >= m.tier - 1) c.mantra = m.id;
      c.pillT = 0; c.pillBoost = 0; if (g.BN) g.BN.onResult(W, npc, true);
    } else {
      c.prog = CULT.threshold(npc) * (0.5 + 0.2 * clamp(HC.eff(npc, 'intellect.willpower') / 100 * 0.6 + HC.eff(npc, 'personality.composure') / 100 * 0.4 + rng.gauss(0, 0.12), 0, 1)); /* ล้มเหลว: ถอยเหลือ 50–70% ของด่าน */
      const sev = rng.next() < 0.35 ? 2 : 1;
      res.injured = true; res.sev = sev;
      npc.h.state.hp = Math.max(1, npc.h.state.hp * (sev === 2 ? 0.35 : 0.6));
      HC.feel(npc, { mood: -18, stress: 18 });
      npc.h.state.heartDemon = clamp(npc.h.state.heartDemon + rng.int(5, 16), 0, 100);
      if (c.path === 'DEMON') {
        // ปราณมารย้อนกลับ (DEMONIC_BACKLASH_FRENZY)
        res.supremeRisk = 'DEMONIC_BACKLASH_FRENZY';
        npc.h.state.heartDemon = clamp(npc.h.state.heartDemon + 8, 0, 100);
        npc.h.state.hp = Math.max(1, Math.round(npc.h.state.hp * 0.85));
      } else if (c.path === 'HEART_SOUL') {
        // ทะเลจิตร้าวฉาน (SOUL_SHATTER_ILLUSION_LOST)
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

  /* ----- เรียนวิชา ----- */
  CULT.learnable = (npc, library) => {
    const c = npc.cult; if (!c) return [];
    return library.filter(id => {
      const t = TECH_BY_ID[id]; if (!t || c.techs.includes(id)) return false;
      if (/FORBIDDEN/.test(t.cat)) return false;
      if (t.path !== 'ANY' && t.path !== c.path) return false;
      if (t.sub && t.sub !== c.sub) return false; // One specialization; high stage never bypasses identity.
      if (/_MANTRA$|^QI_MANTRA$/.test(t.cat)) return false;
      return (t.reqTier || t.tier) <= c.stage + 0;
    });
  };
  CULT.studyCost = t => 90 * (t.tier + 0.5) * (1 + t.tier * 0.25); // นาทีเกมโดยประมาณ
  CULT.maxTechs = npc => 2 + (npc.cult ? npc.cult.stage : 0);


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
