/* stats.js — สเตตัสต่อสู้ (v1.4): ค่าสู้จริง 12 ค่า คำนวณจาก
 *   ขั้น/วิถี/สายย่อย + ร่างกาย/สติปัญญา/นิสัย + ฝีมือยุทธ์ + วิชาที่เรียน + คัมภีร์หลัก + อุปกรณ์ (ค่าจริงต่อชิ้น) + โอสถบัฟ + สถานะระหว่างศึก + สภาพร่างกาย
 * สูตร: ค่าสุดท้าย = ฐาน × (1 + Σเปอร์เซ็นต์) + Σค่าบวกตรง  (เก็บที่มาทุกบรรทัดไว้อธิบายในหน้าตัวละคร) */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, CULT = g.CULT, ECO = g.ECO, SK = g.SK, JD = g.JD;
  const clamp = U.clamp, E = (n, p) => g.MARTIAL ? g.MARTIAL.eff(n, p) : HC.eff(n, p);
  const ST = { now: 0 };
  ST.KEYS = ['hp', 'atk', 'matk', 'def', 'mdef', 'crit', 'critDmg', 'eva', 'acc', 'pen', 'cast', 'move'];
  ST.INFO = {
    hp: { nameTh: 'พลังชีวิต', icon: '❤️', desc: 'ความทนทานรวม' },
    atk: { nameTh: 'พลังโจมตี', icon: '⚔️', desc: 'โจมตีกายภาพ (ฟัน/ต่อย/ทุบ) สู้กับค่าป้องกัน' },
    matk: { nameTh: 'โจมตีวิชา', icon: '🔮', desc: 'พลังปราณ/วิชา สู้กับค่าป้องกันวิชา' },
    def: { nameTh: 'ป้องกัน', icon: '🛡️', desc: 'ลดความเสียหายกายภาพ' },
    mdef: { nameTh: 'ป้องกันวิชา', icon: '🧿', desc: 'ลดความเสียหายจากวิชา/ปราณ' },
    crit: { nameTh: 'อัตราคริ', icon: '🎯', desc: 'โอกาสโจมตีติดคริติคอล (%)' },
    critDmg: { nameTh: 'ความแรงคริ', icon: '💢', desc: 'ตัวคูณความเสียหายเมื่อติดคริ (%)' },
    eva: { nameTh: 'หลบหลีก', icon: '💨', desc: 'ลดโอกาสโดนโจมตี (สู้กับค่าแม่นยำของศัตรู)' },
    acc: { nameTh: 'แม่นยำ', icon: '👁️', desc: 'เพิ่มโอกาสโจมตีโดนเป้า' },
    pen: { nameTh: 'เจาะเกราะ', icon: '🔱', desc: 'ละเลยค่าป้องกันของเป้าหมาย (%)' },
    cast: { nameTh: 'ความเร็วร่ายวิชา', icon: '⏱️', desc: 'ยิ่งสูงยิ่งลงมือถี่ ร่ายวิชาไว คูลดาวน์สั้น (100 = มาตรฐาน)' },
    move: { nameTh: 'ความเร็วเดินทาง', icon: '🏃', desc: 'ความเร็วเดิน/วิ่ง/รุกไล่/หนี (100 = มาตรฐาน)' }
  };
  const PATHW = {
    XIAN: { atk: .85, matk: 1.2, def: .8, mdef: 1.1 },
    BODY: { atk: 1.2, matk: .5, def: 1.35, mdef: .7 },
    GOD: { atk: .95, matk: 1.05, def: 1.05, mdef: 1.25 },
    DEMON: { atk: 1.15, matk: 1.15, def: .78, mdef: .92 },
    HEART_SOUL: { atk: .72, matk: 1.28, def: .88, mdef: 1.32 },
    NONE: { atk: 1, matk: .15, def: .9, mdef: .35 }
  };
  const SUBFX = {
    SWORD_IMMORTAL: { p: { def: -.08 }, f: { pen: 18, crit: 6, critDmg: 15 } }, FIVE_ELEMENTS: { p: { matk: .08, mdef: .08 }, f: { cast: 5 } },
    ELIXIR_DAO: { p: { mdef: .12, hp: .08 }, f: { cast: -5 } }, ASTRAL_ARRAY: { p: { mdef: .15, acc: .1, atk: -.08 }, f: { cast: 8 } },
    BLOOD_DEMON: { p: { atk: .1, hp: -.06, def: -.05 }, f: { critDmg: 25, crit: 4 } }, PHANTOM_SOUL: { p: { eva: .18, matk: .06, def: -.08 }, f: { move: 8 } },
    TIME_VOID: { p: { mdef: .05 }, f: { cast: 25, move: 12 } }, SOUND_ZITHER: { p: { mdef: .1, acc: .08 }, f: { cast: 12 } },
    YIN_YANG_HARMONY: { p: { def: .06, mdef: .1, eva: .06 }, f: {} },
    TIGER_SOVEREIGN: { p: { atk: .1 }, f: { move: 15, cast: 12, crit: 4 } }, BLOOD_DRAGON: { p: { atk: .08, hp: .12 }, f: { critDmg: 10 } },
    VAJRA_BODHI: { p: { def: .2, mdef: .1, hp: .1, eva: -.08 }, f: {} }, DEVOURING_FIEND: { p: { atk: .08, hp: .08 }, f: { pen: 10 } },
    SOLAR_FORGE: { p: { atk: .1, def: .05 }, f: { pen: 8 } }, THUNDER_BODY: { p: {}, f: { crit: 8, critDmg: 20, cast: 10 } },
    JADE_IMMORTAL_BODY: { p: { hp: .18, mdef: .08, def: .06 }, f: {} }, TITAN_MOUNTAIN_BODY: { p: { def: .22, hp: .12, eva: -.1 }, f: { move: -8 } },
    WAR_DEITY: { p: { atk: .06, matk: .04, acc: .1, def: .08 }, f: {} }, MERCY_DEITY: { p: { mdef: .15, hp: .1, def: .04 }, f: {} },
    FATE_ORACLE: { p: { acc: .14, eva: .1 }, f: { crit: 6 } }, TOTEM_BEAST_GOD: { p: { atk: .08, hp: .08 }, f: { move: 10 } },
    UNDERWORLD_JUDGE: { p: { matk: .06, mdef: .08 }, f: { pen: 14 } }, OCEAN_SOVEREIGN: { p: { mdef: .1, hp: .1, matk: .04 }, f: { cast: 6 } },
    HARVEST_EARTH_GOD: { p: { hp: .14, def: .08, mdef: .08 }, f: {} },
    SHADOW_ASSASSIN: { p: { eva: .18, atk: .1, def: -.08 }, f: { crit: 10, critDmg: 28, move: 14 } },
    VENOM_GU_SOVEREIGN: { p: { matk: .12, mdef: .06, hp: -.04 }, f: { pen: 16, acc: 10 } },
    NETHER_GHOST_KING: { p: { matk: .14, mdef: .1, def: -.06 }, f: { cast: 10, eva: 8 } },
    HEAVEN_DEVOURING_DEMON: { p: { atk: .14, matk: .12, hp: .08, mdef: -.08 }, f: { pen: 14, critDmg: 18 } },
    ZEN_VOID_MIND: { p: { mdef: .2, def: .1, hp: .08 }, f: { eva: 10, cast: 8 } },
    CALLIGRAPHY_PAINTING_SAGE: { p: { matk: .14, acc: .12, mdef: .08 }, f: { cast: 16 } },
    DREAM_ILLUSION_WEAVER: { p: { eva: .16, mdef: .12, matk: .08 }, f: { cast: 14, move: 8 } },
    MIND_SWORD_TELEKINESIS: { p: { matk: .16, acc: .1, def: -.06 }, f: { pen: 20, crit: 8, critDmg: 18 } }
  };

  ST.SUBFX = SUBFX;

  /* ---------- อุปกรณ์: ค่าสเตตัสต่อชิ้น (คำนวณเมื่อใช้ครั้งแรก เก็บไว้ในชิ้นนั้น) ---------- */
  const GT = [28, 62, 130, 270, 560, 1100, 2100];
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rn(h, k) { let x = (h ^ Math.imul(k + 1, 0x9e3779b1)) >>> 0; x = Math.imul(x ^ (x >>> 15), 2246822519) >>> 0; x = Math.imul(x ^ (x >>> 13), 3266489917) >>> 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967296; }
  ST.gearStats = it => {
    if (it.st) return it.st;
    const tier = clamp(it.tier || 1, 1, 7), q = it.q || 1, base = GT[tier - 1] * q, h = hash((it.id || '') + (it.nameTh || '')), f = 1 + 0.12 * tier, s = {};
    const pool = [['crit', () => (2.2 + 2 * rn(h, 5)) * f], ['critDmg', () => (8 + 8 * rn(h, 6)) * f], ['pen', () => (3 + 4 * rn(h, 7)) * f], ['acc', () => base * 0.12], ['cast', () => (3 + 4 * rn(h, 8)) * f], ['eva', () => base * 0.1], ['hp', () => base * 0.45], ['move', () => 3 + 3 * rn(h, 9)], ['mdef', () => base * 0.18], ['def', () => base * 0.18]];
    const pickAff = (n, ex) => { const used = {}; for (let i = 0; i < n; i++) { let k = Math.floor(rn(h, 20 + i) * pool.length), tries = 0; while ((used[pool[k][0]] || (ex && ex.includes(pool[k][0]))) && tries++ < 12) k = (k + 1) % pool.length; used[pool[k][0]] = 1; s[pool[k][0]] = (s[pool[k][0]] || 0) + pool[k][1](); } };
    if (it.slot === 'WEAPON') { const phys = (it.gearType || JD.MARTIAL.classify(it.slot, it.nameTh)) !== 'FOCUS'; s[phys ? 'atk' : 'matk'] = base * 0.55; s[phys ? 'matk' : 'atk'] = base * 0.1; pickAff(tier >= 4 ? 2 : 1, ['hp', 'mdef', 'def', 'eva']); }
    else if (it.slot === 'ARMOR') { s.def = base * 0.55; s.mdef = base * 0.28; s.hp = base * 0.5; pickAff(tier >= 4 ? 1 : 0, ['crit', 'critDmg', 'pen']); if (tier >= 4 && rn(h, 3) < 0.5) s.eva = (s.eva || 0) + base * 0.06; }
    else { pickAff(2); const r = rn(h, 4); if (r < 0.3) s.atk = (s.atk || 0) + base * 0.2; else if (r < 0.6) s.matk = (s.matk || 0) + base * 0.2; }
    (it.fx || []).forEach(x => { const p = x.params || {}; if (p.armorReductionRatio) s.pen = (s.pen || 0) + p.armorReductionRatio * 40; });
    const type = it.gearType || JD.MARTIAL.classify(it.slot, it.nameTh);
    const typed = { SWORD: { crit: 3 }, BLADE: { atk: base * .12 }, BOW: { acc: base * .18, crit: 2 }, SPEAR: { pen: 5 }, STAFF: { def: base * .16 }, FIST: { cast: 5 }, FOCUS: { matk: base * .12 }, HEAVY: { def: base * .18, move: -4 }, LIGHT: { eva: base * .15, move: 4 }, ROBE: { mdef: base * .2, cast: 4 }, RING: { crit: 2 }, NECKLACE: { hp: base * .3 }, BRACELET: { cast: 4 }, CHARM: { mdef: base * .12 } }[type] || {};
    for (const k in typed) s[k] = (s[k] || 0) + typed[k];
    for (const k in s) s[k] = Math.round(s[k] * 10) / 10;
    it.st = s; return s;
  };
  ST.gearScore = it => { const s = ST.gearStats(it); return (s.atk || 0) + (s.matk || 0) + (s.def || 0) + (s.mdef || 0) + (s.hp || 0) * 0.5 + (s.eva || 0) * 0.6 + (s.acc || 0) * 0.6 + (s.crit || 0) * 8 + (s.critDmg || 0) * 1.5 + (s.pen || 0) * 6 + (s.cast || 0) * 3 + (s.move || 0) * 2; };

  /* ---------- สถานะ/บัฟ ---------- */
  ST.dirty = u => { if (u) { u._cs = null; u._csBase = null; } };
  ST.addBuff = (n, b) => { n.buffs = (n.buffs || []).filter(x => x.id !== b.id && x.until > ST.now); n.buffs.push({ id: b.id, name: b.name, until: ST.now + b.dur, p: b.p || {}, f: b.f || {} }); ST.dirty(n); };
  ST.addStatus = (u, k, dur, extra) => { u.sx = (u.sx || []).filter(x => x.until > ST.now); const ex = u.sx.find(x => x.k === k); if (ex) { ex.until = Math.max(ex.until, ST.now + dur); if (extra) Object.assign(ex, extra); } else u.sx.push(Object.assign({ k, until: ST.now + dur }, extra || {})); ST.dirty(u); };
  ST.has = (u, k) => !!(u.sx && u.sx.some(x => x.k === k && x.until > ST.now));
  ST.statusOf = (u, k) => (u.sx || []).find(x => x.k === k && x.until > ST.now);
  ST.clearStatus = (u, filter) => { if (!u.sx) return; u.sx = u.sx.filter(x => !(filter(x))); ST.dirty(u); };

  /* ---------- คำนวณ ---------- */
  function compute(n, wp) {
    const A = {}; ST.KEYS.forEach(k => { A[k] = { b: 0, p: 0, f: 0, parts: wp ? [] : null }; });
    const add = (k, label, kind, v) => { if (!v) return; if (k === 'move' && kind === 'f') { kind = 'p'; v /= 100; } const a = A[k]; a[kind] += v; if (a.parts) a.parts.push([label, kind, v]); };
    const addAll = (label, o, kind) => { for (const k in o) if (A[k]) add(k, label, kind, o[k]); };
    if (n.foe) return computeFoe(n, A, add, wp);
    const c = n.cult, st = CULT.stageInfo(n), L = st.combatPower, sub = c ? CULT.subInfo(c.path, c.sub) : null;
    const Lo = L * (sub ? sub.combatBonus : 1), Ld = L * (sub ? sub.defenseBonus : 1), pw = PATHW[c && PATHW[c.path] ? c.path : 'NONE'], d = g.MARTIAL ? g.MARTIAL.derived(n) : HC.derived(n);
    const stLabel = c ? CULT.stageName(n) : 'ปุถุชน';
    A.atk.b = Lo * 0.6 * pw.atk; A.matk.b = Lo * 0.6 * pw.matk; A.def.b = Ld * 0.5 * pw.def; A.mdef.b = Ld * 0.45 * pw.mdef; A.acc.b = Lo * 0.55; A.eva.b = Lo * 0.55;
    A.hp.b = d.hpMax * CULT.hpMult(n); A.crit.b = 5; A.critDmg.b = 150; A.cast.b = 100; A.move.b = 100 * d.walkSpeed / 1.05;
    if (wp) { ['atk', 'matk', 'def', 'mdef', 'acc', 'eva', 'hp'].forEach(k => A[k].parts.push(['ฐานจาก' + stLabel + (c ? '/สาย' + (sub ? sub.nameTh : '') : ''), 'b', A[k].b])); A.move.parts.push(['ฐานจากสรีระ (ความเร็ว/ว่องไว)', 'b', A.move.b]); }
    // ร่างกาย/จิต
    const strF = 0.65 + 0.6 * (E(n, 'physiology.strength') * .4 + E(n, 'physiology.toughness') * .2 + E(n, 'physiology.explosiveness') * .2 + E(n, 'physiology.endurance') * .2) / 100;
    const sk = n.h.skills;
    const martial = g.MARTIAL ? g.MARTIAL.weaponSkill(n) : (sk.FIST_PALM || 0);
    add('atk', 'พละกำลัง/ความทนทาน', 'p', strF - 1); add('atk', 'ฝีมือยุทธ์ (ชำนาญ ' + Math.round(martial) + ')', 'p', 0.8 + 0.45 * martial / 100 - 1);
    const qiF = 0.65 + 0.6 * (E(n, 'physiology.spiritualFoundation') * .35 + E(n, 'physiology.meridianCapacity') * .25 + E(n, 'intellect.comprehension') * .2 + E(n, 'intellect.willpower') * .2) / 100;
    add('matk', 'รากฐานปราณ/เส้นลมปราณ/ความเข้าใจ', 'p', qiF - 1);
    add('def', 'ความทนทาน/พลังชีวิต', 'p', 0.65 + 0.6 * (E(n, 'physiology.toughness') * .5 + E(n, 'physiology.endurance') * .2 + E(n, 'physiology.vitality') * .3) / 100 - 1);
    add('mdef', 'จิตใจ/รากฐานปราณ', 'p', 0.65 + 0.6 * (E(n, 'intellect.willpower') * .4 + E(n, 'physiology.spiritualFoundation') * .3 + E(n, 'personality.composure') * .3) / 100 - 1);
    add('acc', 'สายตา/ปฏิกิริยา/พรสวรรค์การต่อสู้', 'p', 0.6 + 0.8 * (E(n, 'intellect.perceptiveness') * .3 + E(n, 'physiology.reflex') * .25 + E(n, 'aptitudes.combat') * .25 + E(n, 'intellect.focus') * .2) / 100 - 1);
    add('eva', 'ว่องไว/ปฏิกิริยา', 'p', 0.6 + 0.8 * (E(n, 'physiology.agility') * .4 + E(n, 'physiology.reflex') * .35 + E(n, 'physiology.speed') * .25) / 100 - 1);
    add('crit', 'สายตา/สัญชาตญาณ/พรสวรรค์รบ', 'f', (E(n, 'intellect.perceptiveness') + E(n, 'intellect.intuition') + E(n, 'aptitudes.combat')) / 3 * 0.08);
    add('critDmg', 'พรสวรรค์รบ/ความดุดัน', 'f', (E(n, 'aptitudes.combat') - 50) * 0.3 + (E(n, 'personality.aggression') - 50) * 0.2);
    add('pen', 'ฝีมือยุทธ์', 'f', martial * 0.05);
    add('cast', 'ปฏิกิริยา/สมาธิ/ความเข้าใจ', 'f', (E(n, 'physiology.reflex') - 50) * 0.4 + (E(n, 'intellect.focus') - 50) * 0.3 + (E(n, 'intellect.comprehension') - 50) * 0.2);
    if (c) {
      add('cast', 'ขั้นบำเพ็ญ', 'f', 2 * (c.stage - 1)); add('move', 'ขั้นบำเพ็ญ', 'f', 4 * (c.stage - 1));
      const rawFx = SUBFX[c.sub] || (JD.EXPANSION.subStats || {})[c.sub], fx = rawFx && g.MARTIAL ? g.MARTIAL.subStats(n, rawFx) : rawFx; if (fx) { addAll('สาย' + (sub ? sub.nameTh : c.sub), fx.p || {}, 'p'); addAll('สาย' + (sub ? sub.nameTh : c.sub), fx.f || {}, 'f'); }
      const m = c.mantra ? CULT.tech(c.mantra) : null;
      if (m) {
        const lab = 'คัมภีร์หลัก「' + m.nameTh + '」';
        if (c.path === 'XIAN') { add('matk', lab, 'p', 0.04 * m.tier); add('mdef', lab, 'p', 0.02 * m.tier); }
        else if (c.path === 'BODY') { add('def', lab, 'p', 0.04 * m.tier); add('hp', lab, 'p', 0.03 * m.tier); add('atk', lab, 'p', 0.02 * m.tier); }
        else if (c.path === 'DEMON') { add('atk', lab, 'p', 0.03 * m.tier); add('matk', lab, 'p', 0.03 * m.tier); add('crit', lab, 'f', 0.8 * m.tier); }
        else if (c.path === 'HEART_SOUL') { add('matk', lab, 'p', 0.04 * m.tier); add('mdef', lab, 'p', 0.03 * m.tier); add('cast', lab, 'f', 1.2 * m.tier); }
        else { add('mdef', lab, 'p', 0.04 * m.tier); add('hp', lab, 'p', 0.03 * m.tier); add('matk', lab, 'p', 0.02 * m.tier); }
      }
      let techT = 0;
      (g.MARTIAL ? g.MARTIAL.activeTechs(n) : c.techs).forEach(id => { const t = CULT.tech(id); if (!t) return; techT += t.cat === 'COMBAT_TECHNIQUE' ? t.tier : 0;
        if (t.cat === 'LIGHTNESS_ART') { add('move', 'วิชาเบาตัว「' + t.nameTh + '」', 'f', 3 + 2 * t.tier); add('eva', 'วิชาเบาตัว「' + t.nameTh + '」', 'p', 0.02 * t.tier); }
        else if (t.cat === 'AUXILIARY_ART' && t.role !== 'PROFESSION_LIFESTYLE') add('mdef', 'วิชาเสริม「' + t.nameTh + '」', 'p', 0.012 * t.tier); });
      const tf = Math.min(0.3, 0.03 * techT); add('atk', 'วิชาต่อสู้ที่เรียน (Σระดับ ' + techT + ')', 'p', tf); add('matk', 'วิชาต่อสู้ที่เรียน', 'p', tf);
      if (c.track) {
        const trRealm = CULT.trackRealm(n);
        if (trRealm) {
          const trLab = 'ขั้นสายเฉพาะ「' + trRealm.nameTh + '」';
          const rb = trRealm.realmBuffs || {};
          if (rb.combatOffensePct) {
            add('atk', trLab, 'p', rb.combatOffensePct / 100);
            add('matk', trLab, 'p', rb.combatOffensePct / 100);
          }
          if (rb.combatDefensePct) {
            add('def', trLab, 'p', rb.combatDefensePct / 100);
            add('mdef', trLab, 'p', rb.combatDefensePct / 100);
          }
          if (rb.armorPenetrationPct) {
            add('pen', trLab, 'f', rb.armorPenetrationPct);
          }
          if (rb.evasionPct) {
            add('eva', trLab, 'p', rb.evasionPct / 100);
          }
          const cap = trRealm.capacityMultipliers || {};
          if (cap.senseBonus) {
            add('acc', trLab, 'f', cap.senseBonus);
          }
        }
      }
    }
    if (g.MARTIAL) { const skills = g.MARTIAL.skillEffects(n); addAll('ทักษะที่ฝึก (อาวุธตรงประเภท)', skills.p, 'p'); addAll('ทักษะที่ฝึก', skills.f, 'f'); const growth = g.MARTIAL.progression(n), passive = g.MARTIAL.passiveStats(n); addAll('พัฒนาวิถีตามขั้น (สรีระอยู่ในสูตรฐานแล้ว)', growth.p, 'p'); addAll('วิชาติดตัวตามอุปกรณ์', passive.p, 'p'); addAll('วิชาติดตัวตามอุปกรณ์', passive.f, 'f'); }
    // ใจสู้/พิเศษ
    const mind = 0.9 + E(n, 'personality.courage') / 100 * 0.12 + E(n, 'aptitudes.combat') / 100 * 0.18 - 1; add('atk', 'ใจสู้/พรสวรรค์', 'p', mind); add('matk', 'ใจสู้/พรสวรรค์', 'p', mind);
    const sp = HC.special(n, 'combat.powerMult') - 1; if (sp) { add('atk', 'คุณสมบัติพิเศษ', 'p', sp); add('matk', 'คุณสมบัติพิเศษ', 'p', sp); }
    // อุปกรณ์
    const Eq = n.equip || {};
    for (const k in Eq) { const it = Eq[k]; if (!it || (g.MARTIAL && !g.MARTIAL.gearUsable(n,it))) continue; const gs = ST.gearStats(it), df = it.dur == null ? 1 : clamp(it.dur / 100, 0.3, 1); const lab = '「' + it.nameTh + '」' + (df < 1 ? ' (สึก ' + Math.round(df * 100) + '%)' : ''); for (const key in gs) if (A[key]) add(key, lab, 'f', gs[key] * df); }
    // บัฟโอสถ + สถานะ
    (n.buffs || []).forEach(b => { if (b.until <= ST.now && ST.now > 0) return; addAll('โอสถ' + b.name, b.p, 'p'); addAll('โอสถ' + b.name, b.f, 'f'); });
    statusMods(n, add);
    (n.inj || []).forEach(i => { add('move', 'บาดแผล', 'p', -0.1 * (i.sev || 1)); add('eva', 'บาดแผล', 'p', -0.05 * (i.sev || 1)); });
    conditionMods(n, add);
    return finish(A, wp);
  }
  function getBaseFast(n) {
    const c = n.cult, Eq = n.equip || {};
    const cPath = c ? c.path : '', cStage = c ? c.stage : 0, cSub = c ? c.sub : '', cMantra = c ? c.mantra : '', cTechLen = c && c.techs ? c.techs.length : 0;
    const cTechLast = cTechLen > 0 ? c.techs[cTechLen - 1] : '';
    const cTrack = c && c.track ? c.track.ordinal : 0;
    const eqW = Eq.WEAPON || null, eqWdur = eqW ? eqW.dur : 0;
    const eqA = Eq.ARMOR || null, eqAdur = eqA ? eqA.dur : 0;
    const eqX = Eq.ACCESSORY || null, eqXdur = eqX ? eqX.dur : 0;
    const cb = n._csBase;
    if (cb && cb.day === HC.nowDay && cb.ver === n._ver &&
        cb.cPath === cPath && cb.cStage === cStage && cb.cSub === cSub && cb.cMantra === cMantra &&
        cb.cTechLen === cTechLen && cb.cTechLast === cTechLast && cb.cTrack === cTrack &&
        cb.eqW === eqW && cb.eqWdur === eqWdur && cb.eqA === eqA && cb.eqAdur === eqAdur &&
        cb.eqX === eqX && cb.eqXdur === eqXdur) {
      return cb;
    }
    const b = { hp: 0, atk: 0, matk: 0, def: 0, mdef: 0, crit: 5, critDmg: 150, eva: 0, acc: 0, pen: 0, cast: 100, move: 0 };
    const p = { hp: 0, atk: 0, matk: 0, def: 0, mdef: 0, crit: 0, critDmg: 0, eva: 0, acc: 0, pen: 0, cast: 0, move: 0 };
    const f = { hp: 0, atk: 0, matk: 0, def: 0, mdef: 0, crit: 0, critDmg: 0, eva: 0, acc: 0, pen: 0, cast: 0, move: 0 };
    const addP = (k, v) => { if (v) p[k] += v; };
    const addF = (k, v) => { if (!v) return; if (k === 'move') p.move += v / 100; else f[k] += v; };
    const addAll = (o, isF) => { for (const k in o) if (k in b) { if (isF) addF(k, o[k]); else addP(k, o[k]); } };
    const st = CULT.stageInfo(n), L = st.combatPower, sub = c ? CULT.subInfo(c.path, c.sub) : null;
    const Lo = L * (sub ? sub.combatBonus : 1), Ld = L * (sub ? sub.defenseBonus : 1), pw = PATHW[c && PATHW[c.path] ? c.path : 'NONE'], d = g.MARTIAL ? g.MARTIAL.derived(n) : HC.derived(n);
    b.atk = Lo * 0.6 * pw.atk; b.matk = Lo * 0.6 * pw.matk; b.def = Ld * 0.5 * pw.def; b.mdef = Ld * 0.45 * pw.mdef; b.acc = Lo * 0.55; b.eva = Lo * 0.55;
    b.hp = d.hpMax * CULT.hpMult(n); b.move = 100 * d.walkSpeed / 1.05;
    const strF = 0.65 + 0.6 * (E(n, 'physiology.strength') * .4 + E(n, 'physiology.toughness') * .2 + E(n, 'physiology.explosiveness') * .2 + E(n, 'physiology.endurance') * .2) / 100;
    addP('atk', strF - 1);
    const qiF = 0.65 + 0.6 * (E(n, 'physiology.spiritualFoundation') * .35 + E(n, 'physiology.meridianCapacity') * .25 + E(n, 'intellect.comprehension') * .2 + E(n, 'intellect.willpower') * .2) / 100;
    addP('matk', qiF - 1);
    addP('def', 0.65 + 0.6 * (E(n, 'physiology.toughness') * .5 + E(n, 'physiology.endurance') * .2 + E(n, 'physiology.vitality') * .3) / 100 - 1);
    addP('mdef', 0.65 + 0.6 * (E(n, 'intellect.willpower') * .4 + E(n, 'physiology.spiritualFoundation') * .3 + E(n, 'personality.composure') * .3) / 100 - 1);
    addP('acc', 0.6 + 0.8 * (E(n, 'intellect.perceptiveness') * .3 + E(n, 'physiology.reflex') * .25 + E(n, 'aptitudes.combat') * .25 + E(n, 'intellect.focus') * .2) / 100 - 1);
    addP('eva', 0.6 + 0.8 * (E(n, 'physiology.agility') * .4 + E(n, 'physiology.reflex') * .35 + E(n, 'physiology.speed') * .25) / 100 - 1);
    addF('crit', (E(n, 'intellect.perceptiveness') + E(n, 'intellect.intuition') + E(n, 'aptitudes.combat')) / 3 * 0.08);
    addF('critDmg', (E(n, 'aptitudes.combat') - 50) * 0.3 + (E(n, 'personality.aggression') - 50) * 0.2);
    addF('cast', (E(n, 'physiology.reflex') - 50) * 0.4 + (E(n, 'intellect.focus') - 50) * 0.3 + (E(n, 'intellect.comprehension') - 50) * 0.2);
    if (c) {
      addF('cast', 2 * (c.stage - 1)); addF('move', 4 * (c.stage - 1));
      const rawFx = SUBFX[c.sub] || (JD.EXPANSION.subStats || {})[c.sub], fx = rawFx && g.MARTIAL ? g.MARTIAL.subStats(n, rawFx) : rawFx; if (fx) { if (fx.p) addAll(fx.p, false); if (fx.f) addAll(fx.f, true); }
      const m = c.mantra ? CULT.tech(c.mantra) : null;
      if (m) {
        if (c.path === 'XIAN') { addP('matk', 0.04 * m.tier); addP('mdef', 0.02 * m.tier); }
        else if (c.path === 'BODY') { addP('def', 0.04 * m.tier); addP('hp', 0.03 * m.tier); addP('atk', 0.02 * m.tier); }
        else if (c.path === 'DEMON') { addP('atk', 0.03 * m.tier); addP('matk', 0.03 * m.tier); addF('crit', 0.8 * m.tier); }
        else if (c.path === 'HEART_SOUL') { addP('matk', 0.04 * m.tier); addP('mdef', 0.03 * m.tier); addF('cast', 1.2 * m.tier); }
        else { addP('mdef', 0.04 * m.tier); addP('hp', 0.03 * m.tier); addP('matk', 0.02 * m.tier); }
      }
      let techT = 0;
      const techs = g.MARTIAL ? g.MARTIAL.activeTechs(n) : c.techs;
      for (let i = 0; i < techs.length; i++) {
        const t = CULT.tech(techs[i]); if (!t) continue;
        if (t.cat === 'COMBAT_TECHNIQUE') techT += t.tier;
        else if (t.cat === 'LIGHTNESS_ART') { addF('move', 3 + 2 * t.tier); addP('eva', 0.02 * t.tier); }
        else if (t.cat === 'AUXILIARY_ART' && t.role !== 'PROFESSION_LIFESTYLE') addP('mdef', 0.012 * t.tier);
      }
      const tf = Math.min(0.3, 0.03 * techT); addP('atk', tf); addP('matk', tf);
      if (c.track) {
        const trRealm = CULT.trackRealm(n);
        if (trRealm) {
          const rb = trRealm.realmBuffs || {};
          if (rb.combatOffensePct) {
            const v = rb.combatOffensePct / 100;
            addP('atk', v);
            addP('matk', v);
          }
          if (rb.combatDefensePct) {
            const v = rb.combatDefensePct / 100;
            addP('def', v);
            addP('mdef', v);
          }
          if (rb.armorPenetrationPct) {
            addF('pen', rb.armorPenetrationPct);
          }
          if (rb.evasionPct) {
            addP('eva', rb.evasionPct / 100);
          }
          const cap = trRealm.capacityMultipliers || {};
          if (cap.senseBonus) {
            addF('acc', cap.senseBonus);
          }
        }
      }
    }
    if (g.MARTIAL) { const skills = g.MARTIAL.skillEffects(n); addAll(skills.p, false); addAll(skills.f, true); const growth = g.MARTIAL.progression(n), passive = g.MARTIAL.passiveStats(n); addAll(growth.p, false); addAll(passive.p, false); addAll(passive.f, true); }
    const mind = 0.9 + E(n, 'personality.courage') / 100 * 0.12 + E(n, 'aptitudes.combat') / 100 * 0.18 - 1; addP('atk', mind); addP('matk', mind);
    const sp = HC.special(n, 'combat.powerMult') - 1; if (sp) { addP('atk', sp); addP('matk', sp); }
    for (const k in Eq) { const it = Eq[k]; if (!it || (g.MARTIAL && !g.MARTIAL.gearUsable(n,it))) continue; const gs = ST.gearStats(it), df = it.dur == null ? 1 : clamp(it.dur / 100, 0.3, 1); for (const key in gs) if (key in b) addF(key, gs[key] * df); }
    const hpVal = Math.round(Math.max(1, b.hp * (1 + p.hp) + f.hp));
    const vMove0 = Math.round(clamp(Math.max(30, b.move * (1 + p.move) + f.move), 30, 320));
    const moveMult0 = clamp(vMove0 / b.move, 0.6, 2.2);
    const next = {
      day: HC.nowDay, ver: n._ver, cPath, cStage, cSub, cMantra, cTechLen, cTechLast, cTrack,
      eqW, eqWdur, eqA, eqAdur, eqX, eqXdur, b, p, f, hpVal, moveMult0
    };
    n._csBase = next;
    return next;
  }
  function computeFast(n) {
    const base = getBaseFast(n), b = base.b, p0 = base.p, f0 = base.f;
    const sk = n.h.skills;
    const martial = g.MARTIAL ? g.MARTIAL.weaponSkill(n) : (sk.FIST_PALM || 0);
    const mAtkP = 0.8 + 0.45 * martial / 100 - 1, mPenF = martial * 0.05;
    const s = n.h.state;
    const cond = (0.8 + 0.2 * (n._hpf == null ? 1 : n._hpf)) * (0.8 + 0.2 * s.energy / 100) * (1 - 0.3 * s.heartDemon / 100);
    const cm1 = cond - 1;
    const hasBuffs = n.buffs && n.buffs.length > 0;
    const hasSx = n.sx && n.sx.length > 0;
    let injSev = 0;
    if (n.inj && n.inj.length) { for (let i = 0; i < n.inj.length; i++) injSev += (n.inj[i].sev || 1); }
    if (!hasBuffs && !hasSx) {
      const pEva = p0.eva + (injSev ? -0.05 * injSev : 0) + cm1;
      const pMove = p0.move + (injSev ? -0.1 * injSev : 0);
      const vCrit = clamp(b.crit * (1 + p0.crit) + f0.crit, 0, 80);
      const vCritDmg = clamp(b.critDmg * (1 + p0.critDmg) + f0.critDmg, 110, 450);
      const vPen = clamp(b.pen * (1 + p0.pen) + f0.pen + mPenF, 0, 70);
      const vCast = clamp(Math.max(30, b.cast * (1 + p0.cast) + f0.cast + cm1 * 40), 30, 320);
      const vMove = clamp(Math.max(30, b.move * (1 + pMove) + f0.move), 30, 320);
      return {
        hp: base.hpVal,
        atk: Math.round(Math.max(0, b.atk * (1 + p0.atk + mAtkP + cm1) + f0.atk)),
        matk: Math.round(Math.max(0, b.matk * (1 + p0.matk + cm1) + f0.matk)),
        def: Math.round(Math.max(0, b.def * (1 + p0.def) + f0.def)),
        mdef: Math.round(Math.max(0, b.mdef * (1 + p0.mdef) + f0.mdef)),
        crit: Math.round(vCrit * 10) / 10,
        critDmg: Math.round(vCritDmg * 10) / 10,
        eva: Math.round(Math.max(0, b.eva * (1 + pEva) + f0.eva)),
        acc: Math.round(Math.max(0, b.acc * (1 + p0.acc + cm1) + f0.acc)),
        pen: Math.round(vPen * 10) / 10,
        cast: Math.round(vCast),
        move: Math.round(vMove)
      };
    }
    const p = { hp: p0.hp, atk: p0.atk, matk: p0.matk, def: p0.def, mdef: p0.mdef, crit: p0.crit, critDmg: p0.critDmg, eva: p0.eva, acc: p0.acc, pen: p0.pen, cast: p0.cast, move: p0.move };
    const f = { hp: f0.hp, atk: f0.atk, matk: f0.matk, def: f0.def, mdef: f0.mdef, crit: f0.crit, critDmg: f0.critDmg, eva: f0.eva, acc: f0.acc, pen: f0.pen, cast: f0.cast, move: f0.move };
    const addP = (k, v) => { if (v) p[k] += v; };
    const addF = (k, v) => { if (!v) return; if (k === 'move') p.move += v / 100; else f[k] += v; };
    const addAll = (o, isF) => { for (const k in o) if (k in b) { if (isF) addF(k, o[k]); else addP(k, o[k]); } };
    if (hasBuffs) for (let i = 0; i < n.buffs.length; i++) { const bf = n.buffs[i]; if (bf.until <= ST.now && ST.now > 0) continue; if (bf.p) addAll(bf.p, false); if (bf.f) addAll(bf.f, true); }
    if (hasSx) for (let i = 0; i < n.sx.length; i++) { const x = n.sx[i]; if (x.until <= ST.now && ST.now > 0) continue; const S = SK.STATUS[x.k]; if (!S) continue; if (S.mods) addAll(S.mods, true); if (S.pmods) addAll(S.pmods, false); }
    addP('atk', mAtkP); addF('pen', mPenF);
    if (injSev) { addP('move', -0.1 * injSev); addP('eva', -0.05 * injSev); }
    addP('atk', cm1); addP('matk', cm1); addP('acc', cm1); addP('eva', cm1); addF('cast', cm1 * 40);
    const v = {};
    for (let i = 0; i < ST.KEYS.length; i++) {
      const k = ST.KEYS[i];
      let x = b[k] * (1 + p[k]) + f[k];
      if (k === 'hp') x = Math.max(1, x); else x = Math.max(k === 'cast' || k === 'move' ? 30 : 0, x);
      if (k === 'crit') x = clamp(x, 0, 80); else if (k === 'pen') x = clamp(x, 0, 70); else if (k === 'critDmg') x = clamp(x, 110, 450); else if (k === 'cast' || k === 'move') x = clamp(x, 30, 320);
      v[k] = (k === 'crit' || k === 'critDmg' || k === 'pen') ? Math.round(x * 10) / 10 : Math.round(x);
    }
    return v;
  }
  function statusMods(u, add) {
    (u.sx || []).forEach(x => { if (x.until <= ST.now && ST.now > 0) return; const S = SK.STATUS[x.k]; if (!S) return; const lab = 'สถานะ' + S.nameTh; if (S.mods) for (const k in S.mods) add(k, lab, 'f', S.mods[k]); if (S.pmods) for (const k in S.pmods) add(k, lab, 'p', S.pmods[k]); });
  }
  function conditionMods(u, add) {
    const s = u.foe ? { hp: u.hp, energy: 100, heartDemon: 0 } : u.h.state;
    const hpf = u.foe ? clamp(u.hp / u.hpMax, 0, 1) : clamp(s.hp / (u._hpMaxHint || 1), 0, 1);
    const cond = (0.8 + 0.2 * (u.foe ? hpf : u._hpf == null ? 1 : u._hpf)) * (0.8 + 0.2 * s.energy / 100) * (1 - 0.3 * s.heartDemon / 100);
    ['atk', 'matk', 'acc', 'eva'].forEach(k => add(k, 'สภาพร่างกาย (เลือด/แรง/จิตมาร)', 'p', cond - 1)); add('cast', 'สภาพร่างกาย', 'f', (cond - 1) * 40);
  }
  function computeFoe(u, A, add, wp) {
    const P = u.power || 20, beast = u.kind === 'beast', t = u.tier || 1;
    A.atk.b = P * (beast ? 0.62 : 0.55); A.matk.b = P * (beast ? 0.25 : 0.2); A.def.b = P * (beast ? 0.5 : 0.48) * (0.95 + 0.03 * t); A.mdef.b = P * (beast ? 0.32 : 0.3); A.acc.b = P * 0.55; A.eva.b = P * (beast ? 0.62 : 0.5);
    A.hp.b = u.hpMax; A.crit.b = 5 + t; A.critDmg.b = 150; A.cast.b = 100 + t * 3; A.move.b = 100; A.pen.b = t;
    if (wp) { ['atk', 'matk', 'def', 'mdef', 'acc', 'eva', 'hp', 'crit', 'critDmg', 'cast', 'move', 'pen'].forEach(k => A[k].parts.push(['ฐานของ' + (beast ? 'อสูร' : 'ศัตรู') + ' ระดับ ' + t, 'b', A[k].b])); }
    statusMods(u, add); conditionMods(u, add); return finish(A, wp);
  }
  function finish(A, wp) {
    const v = {}, parts = wp ? {} : null;
    ST.KEYS.forEach(k => { const a = A[k]; let x = a.b * (1 + a.p) + a.f; if (k === 'hp') x = Math.max(1, x); else x = Math.max(k === 'cast' || k === 'move' ? 30 : 0, x);
      if (k === 'crit') x = clamp(x, 0, 80); if (k === 'pen') x = clamp(x, 0, 70); if (k === 'critDmg') x = clamp(x, 110, 450); if (k === 'cast' || k === 'move') x = clamp(x, 30, 320);
      v[k] = (k === 'crit' || k === 'critDmg' || k === 'pen') ? Math.round(x * 10) / 10 : Math.round(x); if (wp) parts[k] = a.parts; });
    return { v, parts };
  }
  ST.get = n => {
    const c = n._cs, eq = n.equip || {}; if (c && ST.now > 0 && ST.now - c.t < 3 && c.eqW === eq.WEAPON && c.eqA === eq.ARMOR && c.eqX === eq.ACCESSORY && c.ver === n._ver && c.sub === (n.cult && n.cult.sub) && c.stage === (n.cult && n.cult.stage)) return c.v;
    if (n.foe) { const r = compute(n, false); n._cs = { t: ST.now, v: r.v }; return r.v; }
    n._hpf = clamp(n.h.state.hp / Math.max(1, hpMaxBase(n)), 0, 1);
    const v = computeFast(n); n._cs = { t: ST.now, v, eqW: eq.WEAPON, eqA: eq.ARMOR, eqX: eq.ACCESSORY, ver: n._ver, sub: n.cult && n.cult.sub, stage: n.cult && n.cult.stage }; return v;
  };
  function hpMaxBase(n) { const d = g.MARTIAL ? g.MARTIAL.derived(n) : HC.derived(n); return d.hpMax * CULT.hpMult(n); }
  ST.explain = n => { if (!n.foe) n._hpf = clamp(n.h.state.hp / Math.max(1, hpMaxBase(n)), 0, 1); return compute(n, true); };
  ST.hpMax = n => {
    if (n.foe) return n.hpMax;
    const c = n._cs; if (c && ST.now > 0 && ST.now - c.t < 3) return c.v.hp;
    if ((!n.buffs || !n.buffs.length) && (!n.sx || !n.sx.length)) return getBaseFast(n).hpVal;
    return ST.get(n).hp;
  };
  ST.moveMult = n => {
    if (!n.foe && (!n.buffs || !n.buffs.length) && (!n.sx || !n.sx.length)) {
      const base = getBaseFast(n);
      if (!n.inj || !n.inj.length) return base.moveMult0;
      let injSev = 0; for (let i = 0; i < n.inj.length; i++) injSev += (n.inj[i].sev || 1);
      const vMove = Math.round(clamp(Math.max(30, base.b.move * (1 + base.p.move - 0.1 * injSev) + base.f.move), 30, 320));
      return clamp(vMove / base.b.move, 0.6, 2.2);
    }
    const v = ST.get(n); const d = g.MARTIAL ? g.MARTIAL.derived(n) : HC.derived(n); const base = 100 * d.walkSpeed / 1.05; return clamp(v.move / base, 0.6, 2.2);
  };
  /* พลังรบรวม (ใช้ในภารกิจ/จัดอันดับ) — ปรับเทียบให้ใกล้ของเดิม (ST.RK) */
  ST.RK = 1.15;
  ST.rating = (n, v) => {
    v = v || ST.get(n); const L = n.foe ? n.power : CULT.stageInfo(n).combatPower, off = Math.max(v.atk, v.matk), aref = L * 0.6;
    const offE = off * (1 + v.crit / 100 * (v.critDmg / 100 - 1)) * (0.6 + 0.4 * v.cast / 100) * (1 + v.pen / 150) * (0.85 + 0.15 * clamp(v.acc / (L * 0.55), 0.5, 2));
    const hpE = v.hp * (1 + 0.8 * ((v.def + v.mdef) / 2) / Math.max(1, aref)) * (1 + 0.25 * v.eva / Math.max(1, L * 0.55));
    return Math.max(3, ST.RK * Math.pow(offE, 0.55) * Math.pow(hpE, 0.45));
  };
  ST.recover = n => { if (n.foe || !n.cult) return; const s = n.h.state, q = CULT.qiMax(n); s.qi = Math.min(q, (s.qi == null ? q : s.qi) + q * 0.35); };

  /* ---------- ชุบไอเท็ม: โอสถบัฟการรบ + การเตรียมตัวก่อนศึกหนัก ---------- */
  const oApplyPill = ECO.applyPill;
  ECO.applyPill = (W, npc, key) => {
    const info = ECO.pillInfo(key);
    if (!info || !info.effect.cbBuff) return oApplyPill(W, npc, key);
    const b = info.effect.cbBuff; ST.addBuff(npc, b); if (npc.cult) npc.cult.toxic = Math.min(100, (npc.cult.toxic || 0) + (info.effect.toxicity || 0));
    HC.bump(npc); return { info, msgs: ['บัฟ「' + b.name + '」'] };
  };
  ST.preFight = (W, n, hard) => {
    if (n.foe || !n.cult || (n.buffs && n.buffs.some(b => b.until > ST.now))) return;
    const keys = []; if (n.inv && n.inv.pills) Object.keys(n.inv.pills).forEach(k => { if (k.startsWith('P:CB_') && n.inv.pills[k] > 0) keys.push([k, 'own']); });
    if (!keys.length && n.rank >= 1) Object.keys(W.sect.stock).forEach(k => { if (k.startsWith('P:CB_') && W.sect.stock[k] > 0) keys.push([k, 'sect']); });
    if (!keys.length) return;
    const c = n.cult, pref = c.path === 'BODY' ? ['STONE', 'FURY'] : c.path === 'XIAN' ? ['SPIRIT', 'EYE', 'WIND'] : c.path === 'DEMON' ? ['FURY', 'WIND', 'STONE'] : c.path === 'HEART_SOUL' ? ['SPIRIT', 'EYE', 'WIND'] : ['STONE', 'SPIRIT', 'FURY'];
    let best = null, bs = -1;
    keys.forEach(([k, src]) => { const id = k.slice(5); const info = ECO.pillInfo(k); if (!info) return; if (id === 'BERSERK' && !(hard && (E(n, 'personality.aggression') > 55 || n.h.state.hp < CULT.hpMax(n) * 0.5))) return; if (info.tier > c.stage + 1) return;
      const s = (pref.includes(id) ? 2 : 1) + (src === 'own' ? 0.5 : 0) + W.rng.next(); if (s > bs) { bs = s; best = [k, src]; } });
    if (!best) return;
    let r;
    if (best[1] === 'own') { n.inv.pills[best[0]]--; if (n.inv.pills[best[0]] <= 0) delete n.inv.pills[best[0]]; r = ECO.applyPill(W, n, best[0]); }
    else r = ECO.usePill(W, n, best[0]);
    if (r) AI_mem(W, n, 'กิน' + r.info.name + 'ก่อนออกศึก');
  };
  function AI_mem(W, n, t) { if (g.AI && g.AI.mem) g.AI.mem(W, n, t, 0.4); }

  /* ---------- ผูกเข้าระบบเดิม ---------- */
  CULT.powerLegacy = CULT.power; CULT.hpMaxLegacy = CULT.hpMax;
  CULT.power = (npc, opts) => ST.rating(npc);
  CULT.hpMax = npc => ST.hpMax(npc);
  CULT.speedMult = npc => ST.moveMult(npc);
  const oBump = HC.bump, oTouch = HC.touch;
  HC.bump = function (n) { if (n) { n._cs = null; n._csBase = null; } return oBump.apply(this, arguments); };
  if (oTouch) HC.touch = function (n) { if (n) { n._cs = null; n._csBase = null; } return oTouch.apply(this, arguments); };
  // ค่าเริ่มของไอเท็ม: เก็บ effects ไว้ให้คำนวณเจาะเกราะ
  const oMint = ECO.mintGear;
  ECO.mintGear = (x, q) => { const gear = oMint(x, q); const it = x.outItemId ? ECO.itemById[x.outItemId] : (x.slot ? x : null); if (it && it.effects) gear.fx = it.effects; return gear; };
  g.STATS = ST;
  if (typeof module === 'object' && module.exports) module.exports = ST;
})(typeof globalThis !== 'undefined' ? globalThis : this);
