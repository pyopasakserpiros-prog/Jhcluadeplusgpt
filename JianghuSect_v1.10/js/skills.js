/* skills.js — ระบบวิชาต่อสู้ (v1.4): วิชาแต่ละท่ามี "รูปแบบ" ต่างกันจริง ไม่ใช่แค่ชื่อ
 * โปรไฟล์ของแต่ละวิชาสร้างจากข้อมูลวิชา (สาย/ธาตุ/ระดับ/พลัง/รหัส) แบบกำหนดแน่นอน (deterministic):
 *   รูปแบบ (strike/flurry/sweep/pierce/burst/dot/control/drain/counter/guard/heal/evade/forbid)
 *   × ธาตุ (ผลแทรก: เผาไหม้ เยือกแข็ง ช็อก ผนึกวิชา ลดพลัง ฯลฯ) × ระดับ (แรง/คุ้มกว่า แต่ใช้ปราณมากขึ้น)
 * สมดุล: ยิ่งแรงต่อครั้งยิ่งคูลดาวน์/เวลาร่ายนาน ผลรวมต่อเวลาใกล้เคียงกัน เพิ่มตามระดับ +12%/ระดับ
 * ราคา: ปราณ = 4% × ตัวคูณรูปแบบ × (1 + 0.45×(ระดับ−1)) ของปราณสูงสุด ปราณฟื้นช้าระหว่างศึก */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, CULT = g.CULT, JD = g.JD;
  const clamp = U.clamp;
  const SK = {};

  /* e = ประสิทธิภาพเทียบการโจมตีธรรมดา (1.0 = เท่ากัน) · cd/wind หน่วย "นาทีเกม" · cost = ตัวคูณปราณ */
  SK.ARCH = {
    strike: { nameTh: 'ท่าสังหารเดี่ยว', icon: '🗡️', e: 1.2, cd: 10, wind: 5, hits: 1, cost: 1.0, off: true, desc: 'โจมตีเป้าหมายเดียวหนักมือ' },
    flurry: { nameTh: 'ท่ากระหน่ำ', icon: '⚡', e: 1.2, cd: 9, wind: 4, hits: 3, cost: 1.1, off: true, desc: 'ฟาด 3 ครั้งรัว (คริ/โดนได้ทีละครั้ง) ดีต่อเกราะบาง' },
    sweep: { nameTh: 'ท่ากวาดวงกว้าง', icon: '🌀', e: 0.9, cd: 12, wind: 5, hits: 1, cost: 1.25, off: true, aoe: true, desc: 'โจมตีศัตรูทุกตัวในระยะ (ต่อตัวเบากว่า)' },
    pierce: { nameTh: 'ท่าทะลวงเกราะ', icon: '🔱', e: 1.1, cd: 11, wind: 5, hits: 1, cost: 1.0, off: true, penAdd: 30, desc: 'เจาะเกราะ +30% และทำให้ป้องกันลด 15%' },
    burst: { nameTh: 'ท่าสุดยอด', icon: '💥', e: 1.3, cd: 26, wind: 9, hits: 1, cost: 2.3, off: true, desc: 'ท่าไม้ตาย ร่ายนาน คูลดาวน์ยาว ใช้ปราณมหาศาล' },
    dot: { nameTh: 'ท่าบั่นทอน', icon: '☠️', e: 1.25, cd: 14, wind: 5, hits: 1, cost: 1.1, off: true, dot: 0.8, desc: 'ฟาดเบา ๆ แล้วทิ้งแผลต่อเนื่อง (ไม่ผ่านเกราะ 50%)' },
    control: { nameTh: 'ท่าตรึงศัตรู', icon: '⛓️', e: 0.7, cd: 18, wind: 5, hits: 1, cost: 1.3, off: true, ctrl: true, desc: 'ตรึง/ชะลอ/ผนึกวิชาตามธาตุ (ศัตรูขั้นสูงกว่าต้านได้)' },
    drain: { nameTh: 'ท่าดูดพลัง', icon: '🩸', e: 1.05, cd: 14, wind: 5, hits: 1, cost: 1.1, off: true, steal: 0.45, desc: 'โจมตีพร้อมดูดพลังชีวิตกลับ 45% ของความเสียหาย' },
    counter: { nameTh: 'ท่าสวนกลับ', icon: '↩️', e: 1.0, cd: 16, wind: 3, hits: 1, cost: 0.9, self: true, desc: 'ตั้งท่า 10 นาที โดนตีแล้วปัดทิ้งและสวนกลับหนัก' },
    guard: { nameTh: 'ท่าตั้งรับ', icon: '🛡️', e: 0, cd: 20, wind: 3, hits: 0, cost: 1.0, self: true, desc: 'เกราะพลังดูดซับความเสียหาย + ป้องกันเพิ่ม 12 นาที' },
    heal: { nameTh: 'ท่าบำบัด', icon: '💚', e: 0, cd: 28, wind: 6, hits: 0, cost: 1.4, team: true, desc: 'ฟื้นพลังชีวิตและล้างสถานะร้าย (ช่วยพวกพ้องที่เจ็บหนักที่สุด)' },
    evade: { nameTh: 'ท่าเงาพลิ้ว', icon: '💨', e: 0, cd: 22, wind: 2, hits: 0, cost: 0.8, self: true, desc: 'หลบหลีก +50% เดินทางไว 14 นาที ใช้หนีได้ดี' },
    forbid: { nameTh: 'วิชาต้องห้าม', icon: '🔥', e: 1.8, cd: 40, wind: 10, hits: 1, cost: 1.8, off: true, recoil: 0.12, desc: 'พลังสังหารสูงสุด แต่เสียเลือดตนเองและเปิดเกราะ 12 นาที' },
    support: { nameTh: 'ท่าหนุนทัพ', icon: '✨', e: 0, cd: 22, wind: 4, hits: 0, cost: 1.2, team: true, desc: 'ปลุกขวัญและเสริมแกร่งฝ่ายตนเอง (เพิ่มโจมตี/ป้องกัน/เร่งสปีดแก่พวกพ้อง)' },
    summon: { nameTh: 'วิชาอัญเชิญ', icon: '👥', e: 0, cd: 34, wind: 5, hits: 0, cost: 1.7, team: true, desc: 'อัญเชิญร่างจำลองหรือเทพอสูรเข้าร่วมรบชั่วคราว มีพลังชีวิตและช่วยต่อสู้' },
    channel: { nameTh: 'วิชาร่ายต่อเนื่อง', icon: '🌀', e: 1.5, cd: 20, wind: 2, hits: 1, cost: 1.4, off: true, channel: true, desc: 'เพ่งจิตร่ายวิชาต่อเนื่องทีละรอบ ปลดปล่อยความเสียหายสะสม แต่ถูกขัดจังหวะได้' }
  };
  /* ธาตุ → ผลแทรก (rider) ถ้าท่านั้นเป็นท่าโจมตี โอกาส 38% และผลหลักของท่าควบคุม */
  SK.ELEM = {
    FIRE: { nameTh: 'เพลิง', st: 'burn', ctrl: 'burn' },
    WATER_ICE: { nameTh: 'น้ำแข็ง', st: 'slow', ctrl: 'slow' },
    LIGHTNING: { nameTh: 'อสนี', st: 'critUp', ctrl: 'stun' },
    EARTH_METAL: { nameTh: 'ดินโลหะ', st: 'armorbreak', ctrl: 'stun' },
    WOOD_LIFE: { nameTh: 'พฤกษา', st: 'leech', ctrl: 'slow' },
    WIND: { nameTh: 'วายุ', st: 'haste', ctrl: 'slow' },
    ASTRAL: { nameTh: 'ดารา', st: 'mdefbreak', ctrl: 'silence' },
    YIN_SHADOW: { nameTh: 'หยินเงา', st: 'weaken', ctrl: 'weaken' },
    LIGHT_YANG: { nameTh: 'หยางแสง', st: 'blind', ctrl: 'blind' },
    BLOOD_DEMON: { nameTh: 'โลหิตมาร', st: 'bleed', ctrl: 'bleed' },
    NEUTRAL: { nameTh: 'ไร้ธาตุ', st: null, ctrl: 'stun' }
  };
  SK.STATUS = {
    burn: { nameTh: 'เผาไหม้', icon: '🔥', dot: true }, bleed: { nameTh: 'เลือดไหล', icon: '🩸', dot: true }, poison: { nameTh: 'พิษ', icon: '☠️', dot: true },
    slow: { nameTh: 'ชะงัก', icon: '🐌', mods: { cast: -30, move: -30 }, pmods: { eva: -.1 } }, stun: { nameTh: 'มึนงง', icon: '💫' }, silence: { nameTh: 'ผนึกวิชา', icon: '🤐' },
    weaken: { nameTh: 'อ่อนแรง', icon: '⬇️', pmods: { atk: -.2, matk: -.2 } }, blind: { nameTh: 'ตาพร่า', icon: '🌫️', pmods: { acc: -.3 } },
    armorbreak: { nameTh: 'เกราะแตก', icon: '🧩', pmods: { def: -.15, mdef: -.05 } }, mdefbreak: { nameTh: 'ม่านวิชาแตก', icon: '🔮', pmods: { mdef: -.2 } },
    critUp: { nameTh: 'อสนีสะสม', icon: '⚡', mods: { crit: 10 } }, haste: { nameTh: 'ลมหนุน', icon: '🍃', mods: { cast: 15, move: 10 } }, leech: { nameTh: 'พฤกษาเกาะ', icon: '🌿' },
    guardUp: { nameTh: 'ตั้งรับ', icon: '🛡️', pmods: { def: .4, mdef: .25 } }, evadeUp: { nameTh: 'เงาพลิ้ว', icon: '💨', pmods: { eva: .5 }, mods: { move: 20 } },
    counter: { nameTh: 'ตั้งท่าสวนกลับ', icon: '↩️' }, shield: { nameTh: 'โล่พลัง', icon: '🔰' }, exposed: { nameTh: 'เปิดเกราะ', icon: '💢', pmods: { def: -.25, mdef: -.25 } }, morale: { nameTh: 'ขวัญกำลังใจ', icon: '🚩', pmods: { atk: .15, matk: .15 } }, holyAura: { nameTh: 'รัศมีคุ้มกาย', icon: '✨', pmods: { def: .2, mdef: .2 } }, channeling: { nameTh: 'กำลังร่ายต่อเนื่อง', icon: '🌀' }
  };
  const SUBW = {
    SWORD_IMMORTAL: { strike: 3, pierce: 3, flurry: 2, burst: 1.5, dot: .5 },
    FIVE_ELEMENTS: { sweep: 3, dot: 2, strike: 2, control: 1.2, burst: 1 },
    ELIXIR_DAO: { heal: 2.5, support: 2, drain: 2.5, dot: 2.5, guard: 1.2, strike: 1 },
    ASTRAL_ARRAY: { channel: 3, control: 2.5, sweep: 2, guard: 2, support: 1.5, pierce: 1 },
    BLOOD_DEMON: { dot: 3, drain: 3, burst: 2, flurry: 1.2, strike: 1 },
    PHANTOM_SOUL: { summon: 2.5, counter: 2.5, flurry: 2, control: 2, drain: 1.5, strike: 1 },
    TIME_VOID: { channel: 3, control: 2.5, evade: 2, burst: 1.5, strike: 1 },
    SOUND_ZITHER: { channel: 3, support: 2.5, control: 2, sweep: 2, strike: 1 },
    YIN_YANG_HARMONY: { counter: 2.5, guard: 2, heal: 2, strike: 1.5, control: 1 },
    TIGER_SOVEREIGN: { flurry: 3, strike: 2, burst: 2, sweep: 1 },
    BLOOD_DRAGON: { strike: 2, sweep: 2, dot: 2, burst: 1.5, drain: 1 },
    VAJRA_BODHI: { guard: 3, counter: 3, strike: 1.2, control: .8 },
    DEVOURING_FIEND: { drain: 3, strike: 2, burst: 2, dot: 1 },
    SOLAR_FORGE: { pierce: 3, strike: 2, burst: 2, sweep: 1 },
    THUNDER_BODY: { burst: 2.5, pierce: 2.5, flurry: 2, strike: 2 },
    JADE_IMMORTAL_BODY: { guard: 3, heal: 2, strike: 1.5, control: 1 },
    TITAN_MOUNTAIN_BODY: { guard: 3.5, strike: 2, sweep: 2, control: 1 },
    WAR_DEITY: { support: 3.5, sweep: 2.5, strike: 2, guard: 1.5, control: 1 },
    MERCY_DEITY: { heal: 3.5, support: 2.5, guard: 2, control: 1, strike: 1 },
    FATE_ORACLE: { counter: 3, control: 2, pierce: 2, channel: 2, strike: 1 },
    TOTEM_BEAST_GOD: { summon: 3.5, flurry: 2.5, sweep: 2, strike: 2, burst: 1 },
    UNDERWORLD_JUDGE: { pierce: 2.5, control: 2.5, strike: 2, channel: 2 },
    OCEAN_SOVEREIGN: { sweep: 3, channel: 2.5, guard: 2, strike: 1.5 },
    HARVEST_EARTH_GOD: { support: 3, heal: 2.5, guard: 2, strike: 1 },
    FROST_MOON_IMMORTAL: { counter: 3.5, control: 2.5, strike: 1.5, guard: 1.5, pierce: 1 },
    WOOD_SPRING_BODY: { guard: 3, heal: 2.5, dot: 1.5, strike: 1.5, drain: 1 },
    MEDICINE_BODHI_GOD: { heal: 3.5, support: 3, guard: 2, control: 1, strike: 0.8 },
    SHADOW_ASSASSIN: { strike: 3.5, pierce: 2.5, flurry: 2.5, evade: 2, burst: 1.5 },
    VENOM_GU_SOVEREIGN: { dot: 3.5, control: 2.5, drain: 2, sweep: 1.5, strike: 1 },
    NETHER_GHOST_KING: { summon: 3, control: 2.5, drain: 2.5, channel: 2, strike: 1 },
    HEAVEN_DEVOURING_DEMON: { drain: 3.5, burst: 2.5, sweep: 2, pierce: 1.5, strike: 1.5 },
    ZEN_VOID_MIND: { counter: 3.5, guard: 3, heal: 2, support: 2, control: 1.5 },
    CALLIGRAPHY_PAINTING_SAGE: { channel: 3, control: 2.5, support: 2.5, sweep: 2, strike: 1 },
    DREAM_ILLUSION_WEAVER: { control: 3.5, summon: 2.5, channel: 2.5, evade: 2, strike: 1 },
    MIND_SWORD_TELEKINESIS: { pierce: 3.5, flurry: 3, strike: 2.5, channel: 2, burst: 1.5 }
  };
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0); }
  function rnd(h, k) { let x = (h ^ Math.imul(k + 1, 0x9e3779b1)) >>> 0; x = Math.imul(x ^ (x >>> 15), 2246822519) >>> 0; x = Math.imul(x ^ (x >>> 13), 3266489917) >>> 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967296; }
  const cache = {};
  SK.profile = t => {
    if (!t || t.passive || t.cat === 'PASSIVE') return null; if (cache[t.id]) return cache[t.id];
    const h = hash(t.id); let arch;
    if (t.combatArch && SK.ARCH[t.combatArch]) arch = t.combatArch;
    else if (t.cat === 'FORBIDDEN_ART') arch = 'forbid';
    else if (t.cat === 'LIGHTNESS_ART' || (t.cat === 'AUXILIARY_ART' && t.role === 'MOVEMENT_STEALTH_RECON')) arch = 'evade';
    else if (t.cat === 'AUXILIARY_ART' && t.role === 'HEAL_SUPPORT_TRAINING') {
      const isBuff = /ปลุกขวัญ|อวยพร|หนุน|ประสาน|คุ้มกัน|กำลังใจ|ศรัทธา|เชื่อมใจ/.test(t.nameTh || '');
      arch = isBuff ? 'support' : 'heal';
    }
    else if (t.cat === 'COMBAT_TECHNIQUE') {
      const w = Object.assign({}, SUBW[t.sub] || { strike: 3, flurry: 1, sweep: 1 });
      if (t.tier < 3) { delete w.burst; delete w.summon; }
      if (t.tier < 2) { delete w.control; delete w.counter; delete w.channel; }
      const ks = Object.keys(w), tot = ks.reduce((s, k) => s + w[k], 0); let r = rnd(h, 1) * tot; arch = ks[ks.length - 1];
      for (const k of ks) { r -= w[k]; if (r <= 0) { arch = k; break; } }
    } else return (cache[t.id] = null); // วิชาอาชีพ/ไม่ใช่การรบ
    const A = SK.ARCH[arch], tier = t.tier, tierMult = 1 + 0.12 * (tier - 1) + 0.0006 * ((t.power || 40) - 40 * tier * 0.8 > 0 ? 0 : 0);
    const cd = Math.round(A.cd * (0.85 + 0.3 * rnd(h, 2)));
    const wind0 = Math.max(2, Math.round(A.wind * (0.9 + 0.2 * rnd(h, 4)))), hits = A.hits;
    // ตัวคูณรวมต่อรอบคูลดาวน์ = e × (cd/4) × ระดับ − ช่วงที่ตีธรรมดาแทรก; ท่ายิ่งหนักยิ่งคูลดาวน์/ร่ายนาน
    const fill = (cd - wind0) / 4, tot = A.e * (cd / 4) * tierMult - fill;
    let M = hits ? Math.max(0.9, tot / hits) : 0, dotTot = 0;
    if (arch === 'dot') { M = 0.9; dotTot = Math.max(0.5, tot - 0.9); }
    if (arch === 'counter') M = Math.max(1.5, A.e * (cd / 4) * tierMult * 0.8);
    const el = SK.ELEM[t.element] || SK.ELEM.NEUTRAL;
    // ชนิดความเสียหาย: กายภาพ (atk/def) หรือวิชา (matk/mdef)
    let type = 'm'; const P = t.path;
    if (P === 'BODY') type = 'p';
    else if (P === 'GOD') type = (t.sub === 'WAR_DEITY' || t.sub === 'TOTEM_BEAST_GOD') ? 'p' : 'm';
    else if (P === 'DEMON') type = (t.sub === 'SHADOW_ASSASSIN' ? (rnd(h, 3) < 0.85 ? 'p' : 'm') : t.sub === 'HEAVEN_DEVOURING_DEMON' ? (rnd(h, 3) < 0.5 ? 'p' : 'm') : 'm');
    else if (P === 'HEART_SOUL') type = (t.sub === 'MIND_SWORD_TELEKINESIS' && rnd(h, 3) < 0.35) ? 'p' : 'm';
    else type = (t.sub === 'SWORD_IMMORTAL' ? rnd(h, 3) < 0.7 : t.sub === 'BLOOD_DEMON' ? rnd(h, 3) < 0.4 : rnd(h, 3) < 0.12) ? 'p' : 'm';
    const prof = { id: t.id, tech: t.id, nameTh: t.nameTh, tier, arch, archTh: A.nameTh, icon: A.icon, type, element: t.element, elemTh: el.nameTh, cd,
      hits, wind: wind0, M: Math.round(M * 100) / 100, costPct: Math.round(4 * A.cost * (1 + 0.45 * (tier - 1)) * 10) / 10, pen: A.penAdd || 0, aoe: !!A.aoe, steal: A.steal || 0, dot: Math.round(dotTot * 100) / 100,
      recoil: A.recoil || 0, self: !!A.self, team: !!A.team, channel: !!A.channel, rider: !A.self && !A.team && A.off && !A.ctrl ? el.st : null, ctrl: A.ctrl ? el.ctrl : null, moves: t.moves || [] };
    if (arch === 'dot') prof.dotKind = ({ FIRE: 'burn', BLOOD_DEMON: 'bleed', WOOD_LIFE: 'poison' })[t.element] || (rnd(h, 5) < 0.5 ? 'poison' : 'bleed');
    if (arch === 'guard') prof.shield = Math.round((0.14 + 0.035 * (tier - 1)) * 100) / 100; // % ของพลังชีวิตสูงสุด
    if (arch === 'heal') prof.heal = Math.round((0.16 + 0.04 * (tier - 1)) * 100) / 100;
    if (arch === 'support') {
      prof.support = {
        kind: (t.sub === 'WAR_DEITY' || t.element === 'LIGHTNING') ? 'morale' : (t.element === 'WIND' ? 'haste' : 'holyAura'),
        dur: 12 + tier * 2
      };
    }
    if (arch === 'summon') {
      prof.summon = {
        dur: 14 + tier * 2,
        hpPct: Math.round((0.35 + 0.05 * (tier - 1)) * 100) / 100,
        statPct: Math.round((0.50 + 0.05 * (tier - 1)) * 100) / 100,
        nameSuffix: (t.sub === 'TOTEM_BEAST_GOD' ? 'เทพอสูร' : t.sub === 'PHANTOM_SOUL' ? 'ร่างเงามายา' : t.sub === 'NETHER_GHOST_KING' ? 'ภูตยมโลก' : t.sub === 'DREAM_ILLUSION_WEAVER' ? 'ร่างมายาฝัน' : 'ร่างอวตาร')
      };
    }
    if (arch === 'channel') {
      const ticks = 3;
      prof.channel = {
        ticks,
        tickM: Math.round(Math.max(0.4, tot / ticks * 0.45) * 100) / 100,
        finishM: Math.round(Math.max(0.7, tot / ticks * 0.85) * 100) / 100,
        interruptForce: 15
      };
      prof.ticks = ticks;
    }
    prof.weaponTypes = t.weaponTypes; prof.armorTypes = t.armorTypes; prof.requiresWeapon = t.requiresWeapon;
    prof.summary = SK.summary(prof) + ((t.weaponTypes || t.armorTypes) ? ' · ' + g.JD.MARTIAL.types[(t.weaponTypes || t.armorTypes)[0]] + ' ตรง ×1.15 / อื่น ×0.65' : ''); return (cache[t.id] = prof);
  };
  SK.summary = p => {
    const A = SK.ARCH[p.arch], bits = [];
    if (p.M && p.arch !== 'channel') bits.push('ดาเมจ ×' + p.M + (p.hits > 1 ? ' ×' + p.hits + ' ครั้ง' : p.aoe ? ' ต่อตัว' : ''));
    if (p.dot) bits.push('แผลต่อเนื่อง ×' + p.dot);
    if (p.shield) bits.push('โล่ ' + Math.round(p.shield * 100) + '% HP');
    if (p.heal) bits.push('ฟื้น ' + Math.round(p.heal * 100) + '% HP');
    if (p.support) bits.push('หนุนฝ่ายตน (' + (SK.STATUS[p.support.kind] ? SK.STATUS[p.support.kind].nameTh : p.support.kind) + ') ' + p.support.dur + ' นาที');
    if (p.summon) bits.push('อัญเชิญ' + p.summon.nameSuffix + ' (เลือด ' + Math.round(p.summon.hpPct * 100) + '%, ' + p.summon.dur + ' นาที)');
    if (p.channel) bits.push('ร่ายต่อเนื่อง ' + p.channel.ticks + ' รอบ (สะสม ×' + p.channel.tickM + ' / ทะลวงจบ ×' + p.channel.finishM + ')');
    if (p.pen) bits.push('เจาะเกราะ +' + p.pen + '%');
    if (p.steal) bits.push('ดูดชีวิต ' + Math.round(p.steal * 100) + '%');
    if (p.recoil) bits.push('เสียเลือดตน ' + Math.round(p.recoil * 100) + '%');
    const st = p.ctrl || p.rider; if (st && SK.STATUS[st]) bits.push((p.ctrl ? 'ผล: ' : 'โอกาสแทรก: ') + SK.STATUS[st].nameTh);
    bits.push('คูลดาวน์ ' + p.cd + ' · ร่าย ' + p.wind + ' · ปราณ ' + p.costPct + '%');
    return A.icon + ' ' + A.nameTh + ' · ' + (p.type === 'p' ? 'กายภาพ' : 'วิชา') + ' · ธาตุ' + p.elemTh + ' — ' + bits.join(' · ');
  };
  /* วิชาที่ตัวละครใช้ได้ในการรบ */
  SK.list = n => { if (n.foe) return n.skl || []; if (!n.cult) return []; return (g.MARTIAL ? g.MARTIAL.activeTechs(n) : n.cult.techs).map(id => SK.profile(g.CULT.tech(id))).filter(Boolean); };
  SK.qiCost = (n, p) => Math.round(g.CULT.qiMax(n) * p.costPct / 100);
  SK.mastery = (n, p) => { const c = n.cult, base = c && c.tm ? 1 + Math.min(0.15, (c.tm[p.id] || 0) * 0.002) : 1; return base * (g.MARTIAL ? g.MARTIAL.skillEfficiency(n, p) : 1); };

  /* ศัตรู: สร้างชุดวิชาแบบเรียบง่ายตามชนิด/ระดับ */
  SK.foeSkills = u => {
    const mk = (arch, nameTh, tier, type, extra) => { const A = SK.ARCH[arch], cd = A.cd, tm = 1 + 0.12 * (tier - 1); const p = Object.assign({ id: 'F_' + arch + '_' + nameTh, nameTh, tier, arch, archTh: A.nameTh, icon: A.icon, type, cd, wind: A.wind, hits: A.hits, M: Math.round((A.hits ? A.e * (cd / 4) / A.hits * tm : 0) * 100) / 100, costPct: 0, pen: A.penAdd || 0, aoe: !!A.aoe, steal: A.steal || 0, dot: A.dot ? A.dot * (cd / 4) * tm : 0, recoil: 0, self: !!A.self, moves: [] }, extra || {}); p.summary = SK.summary(p); return p; };
    const t = u.tier || 1, L = [];
    if (u.kind === 'beast') {
      L.push(mk(t >= 2 ? 'flurry' : 'strike', 'ตะปบกัดฉีก', t, 'p'));
      if (t >= 2) L.push(mk('dot', 'เขี้ยวพิษ', t, 'p', { dotKind: 'poison' }));
      if (t >= 3) L.push(mk('control', 'คำรามสะท้านใจ', t, 'm', { ctrl: 'stun' }));
      if (t >= 4) L.push(mk('burst', 'พลังอสูรปะทุ', t, 'm'));
    } else {
      L.push(mk('strike', 'ฟันหนัก', t, 'p'));
      if (t >= 2) L.push(mk('pierce', 'แทงเจาะเกราะ', t, 'p'));
      if (t >= 3) L.push(mk('sweep', 'กวาดวงกว้าง', t, 'p'));
    }
    return L;
  };
  g.SK = SK;
  if (typeof module === 'object' && module.exports) module.exports = SK;
})(typeof globalThis !== 'undefined' ? globalThis : this);
