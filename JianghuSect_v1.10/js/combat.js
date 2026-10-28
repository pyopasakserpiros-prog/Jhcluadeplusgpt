/* combat.js — การต่อสู้: ประลองเบา (spar) ดวลจริง ท้าชิงตำแหน่ง ประลองยุทธ์สำนัก และการบุกของศัตรู
 * หน่วยรบ (unit) = NPC หรือศัตรู (foe) ผลลัพธ์มาจากกำลังรบ (CULT.power) + สภาพร่างกาย + ความคล่องตัว + นิสัย (กล้า/ยอมแพ้/หนี) ไม่ใช่ลูกเต๋าล้วน ๆ */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js'), HC = g.HC, MAP = g.MAP, CULT = g.CULT, ECO = g.ECO, SECT = g.SECT, AI = g.AI, JD = g.JD;
  const clamp = U.clamp;
  const C = {};
  const E = (n, p) => HC.eff(n, p);

  /* ---------- หน่วยรบทั่วไป ---------- */
  C.unit = (W, id) => W.byId[id] || (W.foeById && W.foeById[id]) || null;
  C.alive = u => !!u && !u.dead && !u.fled && !u.yield;
  C.power = u => g.STATS.rating(u);
  C.hpMax = u => u.foe ? u.hpMax : CULT.hpMax(u);
  C.hp = u => u.foe ? u.hp : u.h.state.hp;
  C.setHp = (u, v) => { if (u.foe) u.hp = v; else u.h.state.hp = v; };
  C.name = u => u.foe ? u.name : u.h.name.given;
  C.agi = u => u.foe ? 50 + u.tier * 3 : (E(u, 'physiology.agility') + E(u, 'physiology.reflex')) / 2;

  /* ---------- ประลองเบา (คู่ฝึกยุทธ์) ---------- */
  C.sparRound = (W, a, b, d) => {
    d.sc = d.sc || { a: 0, b: 0 };
    const pa = CULT.power(a) * (0.7 + W.rng.next() * 0.6) * (0.9 + C.agi(a) / 500), pb = CULT.power(b) * (0.7 + W.rng.next() * 0.6) * (0.9 + C.agi(b) / 500);
    if (pa > pb) d.sc.a += pa / (pa + pb); else d.sc.b += pb / (pa + pb);
    d.rounds++;
    a.fx = { t: W.t, text: '⚔' }; b.fx = { t: W.t, text: '⚔' };
    [a, b].forEach(x => { x.h.state.energy = Math.max(0, x.h.state.energy - 0.9); HC.trainBody(x, 'reflex', 0.5); HC.trainBody(x, 'agility', 0.4); HC.practice(x, g.AI.pickTeachSkill(x, x), 1 / 30, 1.2); if (x.cult) CULT.gain(x, 0.15); });
    if (a.h.state.energy < 12 || b.h.state.energy < 12) return 'end';
    if (d.rounds >= 14) return 'end';
  };
  C.sparEnd = (W, a, b, d) => {
    const sc = d.sc || { a: 0, b: 0 }; if (d.rounds < 2) return;
    const aw = sc.a >= sc.b; const w = aw ? a : b, l = aw ? b : a;
    const close = Math.abs(sc.a - sc.b) / Math.max(0.01, sc.a + sc.b) < 0.18;
    const ra = SECT.rel(a, b.id), rb = SECT.rel(b, a.id);
    // ผู้แพ้ที่ทิฐิสูงเก็บความแค้น; ผู้ชนะที่ใจกว้างได้ความเคารพ
    const sore = (E(l, 'personality.pride') - 50) / 100 + (E(l, 'personality.aggression') - 50) / 200 - (close ? 0.3 : 0);
    SECT.rel(l, w.id).v += Math.max(0, sore) * 5; SECT.rel(l, w.id).r += close ? 2 : 4; SECT.rel(w, l.id).r += close ? 2 : 1;
    HC.feel(w, { mood: 4 }); HC.feel(l, { mood: close ? 1 : -3, stress: sore > 0.2 ? 3 : 0 });
    HC.experience(w, 'victory', 0.25); HC.experience(l, 'defeat', 0.2);
    [a, b].forEach(u => {
      if (u && !u.dead && u.cult && u.cult.path === 'HEART_SOUL') {
        u.h.state.heartDemon = Math.max(0, (u.h.state.heartDemon || 0) - 2.5);
        u.h.state.stress = Math.max(0, (u.h.state.stress || 0) - 3);
        HC.gainWisdom(u, 0.08);
        CULT.gain(u, 0.8);
      }
    });
    if (W.rng.chance(0.04 + (E(l, 'personality.aggression') - 50) / 800)) { AI.injure(W, l, 1, 'ได้รับบาดเจ็บขณะประลอง'); }
    AI.mem(W, w, 'ประลองกับ ' + l.h.name.given + (close ? ' เสมอกันหวุดหวิด' : ' และเป็นฝ่ายชนะ'), 0.3, l.id);
    AI.mem(W, l, 'ประลองกับ ' + w.h.name.given + (close ? ' เสมอกันหวุดหวิด' : ' และพ่ายแพ้'), 0.3, w.id);
    w.stats = w.stats || {}; l.stats = l.stats || {}; w.stats.sparWin = (w.stats.sparWin || 0) + 1; l.stats.sparLoss = (l.stats.sparLoss || 0) + 1;
    if (!close && (CULT.power(w) > CULT.power(l) * 1.5 || W.rng.chance(0.15))) W.log('spar', w.h.name.given + ' ประลองชนะ ' + l.h.name.given, [w.id, l.id]);
  };

  /* ---------- การต่อสู้จริง ---------- */
  C.startFight = (W, A, B, kind, opts) => {
    opts = opts || {};
    W.fights = W.fights || []; W.fightSeq = (W.fightSeq || 0) + 1;
    const f = { id: W.fightSeq, kind, serious: !!opts.serious, A: A.slice(), B: B.slice(), t0: W.t, state: opts.gather ? 'gather' : 'fight', arena: opts.arena || null, cb: opts.cb || null, ctx: opts.ctx || {}, over: false, log: [] };
    W.fights.push(f);
    [].concat(A, B).forEach(id => C.enter(W, f, id));
    return f;
  };
  C.enter = (W, f, id) => {
    const u = C.unit(W, id); if (!u) return;
    if (u.foe && !u.skl) u.skl = SKs().foeSkills(u);
    if (!u.foe && f.serious) STs().preFight(W, u, f.kind === 'raid');
    if (!u.foe) { AI.interruptFor(W, u); u.hidden = false; u.act = { id: 'fight', stage: 'do', left: 9999, total: 9999, ctx: { fid: f.id, target: null, cd: 0 }, why: [['เข้าต่อสู้', 9]] }; u.path = null; u.run = true; }
    else { u.act = { id: 'fight', ctx: { fid: f.id, target: null, cd: 0 } }; }
  };
  C.join = (W, f, id, side) => { if (f[side].includes(id)) return; f[side].push(id); C.enter(W, f, id); };
  C.fightOf = (W, u) => u.act && u.act.ctx && u.act.ctx.fid ? (W.fights || []).find(f => f.id === u.act.ctx.fid) : null;
  C.sideOf = (f, id) => f.A.includes(id) ? 'A' : 'B';
  C.enemies = (W, f, id) => (C.sideOf(f, id) === 'A' ? f.B : f.A).map(i => C.unit(W, i)).filter(C.alive);
  C.alliesOf = (W, f, id) => (C.sideOf(f, id) === 'A' ? f.A : f.B).map(i => C.unit(W, i)).filter(C.alive);

  function yieldThreshold(u) {
    if (u.foe) return u.fleeAt || 0.2;
    return clamp(0.34 - (E(u, 'personality.pride') - 50) / 400 - (E(u, 'personality.courage') - 50) / 500, 0.12, 0.45);
  }
  function fleeThreshold(u) { // เมื่อสู้จริงจัง
    if (u.foe) return u.fleeAt || 0.2;
    return clamp(0.22 - (E(u, 'personality.courage') - 50) / 260 - (E(u, 'personality.loyalty') - 50) / 400 + (E(u, 'personality.caution') - 50) / 400, 0.0, 0.3);
  }
  const FX_WORDS = ['ฟัน', 'แทง', 'ปะทะ', 'ฝ่ามือ', 'หลบ'];
  function techMove(W, u) {
    if (u.foe || !u.cult || !u.cult.techs.length) return null;
    const t = CULT.tech(W.rng.pick(u.cult.techs)); if (!t || !t.moves || !t.moves.length) return null; return W.rng.pick(t.moves);
  }
  function moveToward(W, u, tx, ty, run) {
    const dx = tx - u.x, dy = ty - u.y, d = Math.hypot(dx, dy); if (d < 0.01) return;
    if (u.foe) { const sp = u.speed * (run ? 1.0 : 0.8) * clamp(STs().get(u).move / 100, 0.4, 2); const s = Math.min(d, sp); const nx = u.x + dx / d * s, ny = u.y + dy / d * s; if (!MAP.blocked(W.map, nx, ny)) { u.x = nx; u.y = ny; } else { const ax = u.x + (dx > 0 ? s : -s) * (Math.abs(dx) > Math.abs(dy) ? 1 : 0.2), ay = u.y + (dy > 0 ? s : -s) * (Math.abs(dy) >= Math.abs(dx) ? 1 : 0.2); if (!MAP.blocked(W.map, ax, ay)) { u.x = ax; u.y = ay; } else { u.x += W.rng.gauss(0, 0.3); u.y += W.rng.gauss(0, 0.3); if (MAP.blocked(W.map, u.x, u.y)) { u.x = u.px; u.y = u.py; } } } u.face = dx >= 0 ? 1 : -1; return; }
    if (!u.path || (W.t + u.n) % 6 === 0) AI.goTo(W, u, Math.floor(tx), Math.floor(ty));
    AI.stepMove(W, u);
  }
  /* =====================================================================
   * ระบบสู้ใหม่ (v1.4): สเตตัสจริง (STATS) + วิชาแต่ละท่า (SK) + สถานะระหว่างศึก
   *  - โอกาสโดน = แม่นยำ ÷ (แม่นยำ + 0.55×หลบหลีก)
   *  - ความเสียหาย = 20% ของพลังชีวิตสูงสุดเป้า × [โจมตี ÷ (โจมตี + 0.8×ป้องกันหลังเจาะเกราะ)] × ตัวคูณท่า × คริ
   *  - ท่ากายภาพใช้ พลังโจมตี/ป้องกัน, ท่าวิชาใช้ โจมตีวิชา/ป้องกันวิชา
   *  - จังหวะลงมือ = 4 นาที ÷ (ความเร็วร่าย/100) ท่าหนักมีเวลาร่ายยาว + คูลดาวน์ + ใช้ปราณ
   * ===================================================================== */
  const STs = () => g.STATS, SKs = () => g.SK;
  const FX_PHYS = ['ฟัน', 'แทง', 'ปะทะ', 'ฝ่ามือ'], FX_MAG = ['ปราณพุ่ง', 'คลื่นวิชา', 'แสงปราณ'];
  C.stats = u => STs().get(u);
  function hpFrac(u) { return clamp(C.hp(u) / Math.max(1, C.hpMax(u)), 0, 1); }
  function shieldOf(u) { const x = STs().statusOf(u, 'shield'); return x && x.amt > 0 ? x : null; }
  /* รับความเสียหาย: โล่ → เลือด → ยอมแพ้/หนี/ตาย */
  C.applyDamage = (W, f, a, d, dmg, note) => {
    const sh = shieldOf(d); if (sh) { const ab = Math.min(sh.amt, dmg); sh.amt -= ab; dmg -= ab; if (sh.amt <= 0) STs().clearStatus(d, x => x.k === 'shield'); }
    const nonlethal = !f.serious, hm = C.hpMax(d); let hp = C.hp(d) - dmg;
    if (d.act && d.act.ctx && d.act.ctx.channeling) {
      if (dmg >= hm * 0.12) C.interruptChannel(W, f, d, 'ถูกโจมตีหนัก');
    }
    if (!d.foe) { d.lastHurtBy = a ? a.id : d.lastHurtBy; d.h.state.stress += 0.8; d.h.state.fear = clamp(d.h.state.fear + 1.5 * (1 - E(d, 'personality.courage') / 130), 0, 100); HC.trainBody(d, 'toughness', 0.15); if (W.rng.chance(0.02 * (dmg / hm * 10))) AI.injure(W, d, hp < hm * .3 ? 2 : 1, 'บาดแผลจากการต่อสู้'); }
    if (hp <= 0) {
      if (d.isSummon) {
        C.setHp(d, 0); d.dead = true; d.gone = true;
        d.fx = { t: W.t, text: '💨 สลายร่าง' };
        return true;
      }
      if (nonlethal || (!d.foe && !f.serious)) { hp = Math.max(1, hm * 0.04); d.yield = true; }
      else { C.setHp(d, 0); C.slay(W, f, a || d, d); return true; }
    }
    C.setHp(d, hp);
    const ratio = hp / hm;
    if (ratio < (nonlethal ? yieldThreshold(d) : fleeThreshold(d)) && !d.yield && !d.fled) {
      if (nonlethal) d.yield = true; else if (W.rng.chance(d.foe ? 0.7 : 0.5)) { d.fled = true; d.fx = { t: W.t, text: 'ถอย!' }; if (!d.foe) { d.run = true; AI.mem(W, d, 'ถอยหนีจากการต่อสู้', 0.5); HC.experience(d, 'flee', 0.4); } }
    }
    return false;
  };
  /* หนึ่งการโจมตี: o = {M, type:'p'|'m', pen, dotHalf, forced, noCounter, crit+} */
  C.strike = (W, f, a, d, o) => {
    const ST = STs(), sa = ST.get(a), sd = ST.get(d), nonlethal = !f.serious;
    const hitP = o.forced ? 1 : clamp(sa.acc / (sa.acc + 0.55 * sd.eva), 0.12, 0.97);
    if (W.rng.next() > hitP) { d.fx = { t: W.t, text: 'หลบ' }; if (!d.foe) HC.trainBody(d, 'reflex', 0.3); return { hit: false }; }
    // ท่าสวนกลับ: ปัดทิ้งแล้วสวน
    if (!o.noCounter) { const cs = ST.statusOf(d, 'counter'); if (cs && !d.dead) { ST.clearStatus(d, x => x.k === 'counter'); d.fx = { t: W.t, text: '↩ ปัดสวน!' }; C.strike(W, f, d, a, { M: cs.M, type: cs.type, pen: cs.pen, forced: true, noCounter: true }); return { hit: false, countered: true }; } }
    const type = o.type || (sa.atk >= sa.matk ? 'p' : 'm'), A0 = type === 'p' ? sa.atk : sa.matk;
    let D = (type === 'p' ? sd.def : sd.mdef) * (o.dotHalf ? 0.5 : 1) * (1 - clamp(((sa.pen || 0) + (o.pen || 0)) / 100, 0, 0.8));
    const crit = !o.noCrit && W.rng.chance(((sa.crit || 0) + (o.critAdd || 0)) / 100);
    let frac = 0.2 * (A0 / (A0 + 0.8 * Math.max(0, D))) * (o.M || 1) * (0.85 + W.rng.next() * 0.3);
    if (crit) frac *= sa.critDmg / 100;
    if (nonlethal) frac *= 0.55;
    const hm = C.hpMax(d), dmg = hm * frac;
    a.fx = a.fx || {}; if (!o.silent) { a.fx = { t: W.t, text: o.label || (crit ? 'จุดตาย!' : type === 'p' ? W.rng.pick(FX_PHYS) : W.rng.pick(FX_MAG)) }; }
    d.fx = { t: W.t, text: (crit ? '✦' : '') + '-' + Math.max(1, Math.round(dmg)) };
    if (!a.foe) { a.h.state.energy = Math.max(0, a.h.state.energy - 0.15); HC.practice(a, g.AI.pickTeachSkill(a, a), 1 / 90, 1.1); HC.trainBody(a, 'reflex', 0.1); a.lastHurt = null; }
    const killed = C.applyDamage(W, f, a, d, dmg);
    let lifesteal = 0, reflected = 0;
    if (!a.foe && !a.dead && a.cult && a.cult.path === 'DEMON' && dmg > 0) {
      const trA = CULT.trackRealm(a);
      const lsPct = (trA && trA.realmBuffs && trA.realmBuffs.lifestealPct) ? trA.realmBuffs.lifestealPct : (a.cult.stage * 1.2);
      lifesteal = Math.max(1, Math.round(dmg * (lsPct / 100)));
      C.setHp(a, Math.min(C.hpMax(a), C.hp(a) + lifesteal));
      a.lastLifesteal = lifesteal;
    }
    if (!o.noReflect && !d.foe && d.cult && d.cult.path === 'HEART_SOUL' && dmg > 0 && !a.dead) {
      const trD = CULT.trackRealm(d);
      const refPct = (trD && trD.realmBuffs && trD.realmBuffs.reflectPct) ? trD.realmBuffs.reflectPct : (d.cult.stage * 1.4);
      reflected = Math.max(1, Math.round(dmg * (refPct / 100)));
      d.lastReflect = reflected;
      C.applyDamage(W, f, d, a, reflected, 'สะท้อนจิต');
    }
    return { hit: true, dmg, crit, killed, lifesteal, reflected };
  };
  /* ---------- เลือกท่า ---------- */
  function chooseSkill(W, f, a, d, ctx) {
    const SK = SKs(), ST = STs(); if (ST.has(a, 'silence')) return null;
    const list = SK.list(a); if (!list.length) return null;
    const sa = ST.get(a), hpR = hpFrac(a), nonlethal = !f.serious, qi = a.foe ? 1e9 : (a.h.state.qi == null ? 1e9 : a.h.state.qi);
    const en = C.enemies(W, f, a.id), near = en.filter(x => Math.hypot(x.x - d.x, x.y - d.y) < 2.6).length;
    const aggr = a.foe ? 0.2 : (E(a, 'personality.aggression') - 50) / 200, caut = a.foe ? 0 : (E(a, 'personality.caution') - 50) / 200;
    const basicStat = Math.max(sa.atk, sa.matk), td = ST.get(d), tdp = C.power(d), self = C.power(a);
    let best = null, bs = 1.15; ctx.cds = ctx.cds || {};
    for (const p of list) {
      if ((ctx.cds[p.id] || 0) > W.t) continue;
      const cost = a.foe ? 0 : SK.qiCost(a, p); if (qi < cost) continue;
      if (p.arch === 'forbid' && (nonlethal || (hpR > 0.45 && !(tdp > self * 1.5)))) continue;
      let sc = 0; const stat = p.type === 'p' ? sa.atk : sa.matk, rel = stat / Math.max(1, basicStat), mas = a.foe ? 1 : SK.mastery(a, p);
      if (p.M) { const dmgEq = p.M * (p.hits || 1) * rel * mas * (p.aoe ? Math.max(1, near) : 1) + (p.dot || 0) * rel * 0.8; sc = dmgEq * (4 / Math.max(4, p.wind)) * 0.62; sc += aggr * 0.5; }
      if (p.arch === 'pierce') sc += clamp(td.def / Math.max(1, td.mdef), 0.5, 2) * 0.4;
      if (p.arch === 'control') sc = (ST.has(d, 'stun') || ST.has(d, 'silence') || ST.has(d, 'slow') ? 0.2 : 1.7) * (tdp > self * 0.5 ? 1 : 0.5);
      if (p.arch === 'dot') sc += (d.sx && d.sx.some(x => SK.STATUS[x.k] && SK.STATUS[x.k].dot && x.until > W.t) ? -1.5 : 0.7) + (hpFrac(d) > 0.5 ? 0.4 : -0.4);
      if (p.arch === 'drain') sc += (1 - hpR) * 1.6;
      if (p.arch === 'burst') sc += (hpFrac(d) > 0.35 ? 0.4 : -0.6) + aggr;
      if (p.arch === 'counter') sc = (ST.has(a, 'counter') ? 0 : 1.1 + caut) * (hpR < 0.9 ? 1.2 : 0.8) + (tdp > self * 0.8 ? 0.6 : 0);
      if (p.arch === 'guard') sc = (ST.has(a, 'guardUp') ? 0 : (1 - hpR) * 4.2 + caut * 1.4 - 0.5);
      if (p.arch === 'heal') {
        const ally = lowestAlly(W, f, a);
        const lowestRatio = ally ? Math.min(hpR, hpFrac(ally)) : hpR;
        sc = lowestRatio < 0.72 ? (0.72 - lowestRatio) * 11 : 0;
        if (lowestRatio < 0.38) sc += 3.5;
      }
      if (p.arch === 'support') {
        const allies = C.alliesOf(W, f, a.id);
        const buffKind = (p.support && p.support.kind) || 'morale';
        const needBuff = allies.some(u => !ST.has(u, buffKind));
        sc = needBuff ? (allies.length > 1 ? 2.8 : 1.2) + aggr * 0.4 : 0.2;
      }
      if (p.arch === 'summon') {
        const allies = C.alliesOf(W, f, a.id);
        const hasSummon = allies.some(u => u.summonerId === a.id);
        sc = hasSummon ? 0 : (2.4 + (en.length > 1 ? 1.0 : 0.3) + caut * 0.8);
      }
      if (p.arch === 'channel') {
        sc = (ctx.channeling ? 0 : 2.2) + (hpR > 0.4 ? 0.6 : -0.6) + aggr * 0.5;
      }
      if (p.arch === 'evade') sc = (ST.has(a, 'evadeUp') ? 0 : (hpR < 0.5 ? (0.5 - hpR) * 5 : 0) + (en.length > 2 ? 0.8 : 0) + caut);
      if (p.arch === 'forbid') sc += (hpR < 0.4 ? 2.2 : 0.4) + aggr + (tdp > self * 1.5 ? 1.2 : 0);
      sc *= 0.88 + W.rng.next() * 0.24;
      if (sc > bs) { bs = sc; best = p; }
    }
    return best;
  }
  function lowestAlly(W, f, a) { const side = C.sideOf(f, a.id) === 'A' ? f.A : f.B; let w = null, m = 2; side.forEach(id => { const u = C.unit(W, id); if (!C.alive(u) || u.id === a.id) return; const r = hpFrac(u); if (r < m) { m = r; w = u; } }); return w; }
  function useSkill(W, f, a, d, p, ctx) {
    const SK = SKs(), ST = STs(), sa = ST.get(a); ctx.cds = ctx.cds || {};
    ctx.cds[p.id] = W.t + Math.max(Math.round(p.cd * 0.5), Math.round(p.cd * 100 / sa.cast));
    if (!a.foe) { const cost = SK.qiCost(a, p); a.h.state.qi = Math.max(0, (a.h.state.qi == null ? cost : a.h.state.qi) - cost); a.cult.tm = a.cult.tm || {}; a.cult.tm[p.id] = (a.cult.tm[p.id] || 0) + 1; }
    const label = p.moves && p.moves.length ? W.rng.pick(p.moves) : p.nameTh;
    a.fx = { t: W.t, text: p.icon + ' ' + label };
    // One lightweight visual event per actual activation; text/damage feedback stays independent.
    const tech = p.tech && CULT.tech(p.tech), target = p.self || p.team || ['heal', 'support', 'summon'].includes(p.arch) ? a : d || a;
    a.castFx = { t: W.t, kind: p.arch === 'forbid' || (tech && tech.cat === 'FORBIDDEN_ART') ? 'forbidden' : 'normal', x: target.x, y: target.y, seq: ((a.castFx && a.castFx.seq) || 0) + 1 };
    const hm = C.hpMax(a);
    if (p.arch === 'guard') { ST.addStatus(a, 'guardUp', 12); ST.addStatus(a, 'shield', 12, { amt: hm * (p.shield || 0.15) }); return; }
    if (p.arch === 'evade') { ST.addStatus(a, 'evadeUp', 14); return; }
    if (p.arch === 'counter') { ST.addStatus(a, 'counter', 10, { M: p.M, type: p.type, pen: p.pen }); return; }
    if (p.arch === 'heal') {
      const ally = lowestAlly(W, f, a), tgt = (ally && hpFrac(ally) < hpFrac(a) - 0.05) ? ally : a;
      a.castFx.x = tgt.x; a.castFx.y = tgt.y;
      const healAmt = Math.max(1, Math.round(C.hpMax(tgt) * (p.heal || 0.22)));
      C.setHp(tgt, Math.min(C.hpMax(tgt), C.hp(tgt) + healAmt));
      ST.clearStatus(tgt, x => { const S = SK.STATUS[x.k]; return S && (S.dot || ['slow', 'weaken', 'blind', 'armorbreak', 'mdefbreak', 'silence', 'stun'].includes(x.k)); });
      tgt.fx = { t: W.t, text: '💚 +' + healAmt };
      return;
    }
    if (p.arch === 'support') {
      const allies = C.alliesOf(W, f, a.id);
      const buffKind = (p.support && p.support.kind) || 'morale';
      const dur = (p.support && p.support.dur) || 14;
      allies.forEach(ally => {
        if (!C.alive(ally)) return;
        ST.addStatus(ally, buffKind, dur);
        ally.fx = { t: W.t, text: '✨ ' + (SK.STATUS[buffKind] ? SK.STATUS[buffKind].nameTh : 'หนุนทัพ') };
      });
      return;
    }
    if (p.arch === 'summon') {
      const side = C.sideOf(f, a.id);
      const sConf = p.summon || { dur: 18, hpPct: 0.4, statPct: 0.55, nameSuffix: 'ร่างอวตาร' };
      const sId = 'SUM_' + a.id + '_' + W.t;
      const sHp = Math.max(10, Math.round(C.hpMax(a) * sConf.hpPct));
      const sName = sConf.nameSuffix + 'ของ' + C.name(a);
      const summonUnit = {
        id: sId,
        name: sName,
        isSummon: true,
        summonerId: a.id,
        side,
        foe: true,
        tier: a.cult ? a.cult.stage : (a.tier || 1),
        hp: sHp,
        hpMax: sHp,
        speed: 1.0,
        x: a.x + (W.rng.next() - 0.5) * 1.5,
        y: a.y + (W.rng.next() - 0.5) * 1.5,
        px: a.x,
        py: a.y,
        act: { id: 'fight', ctx: { fid: f.id, target: d ? d.id : null, cd: 0 } },
        dur: sConf.dur,
        skl: [
          { id: 'S_' + sId + '_atk', nameTh: 'ฟาดฟัน', tier: 1, arch: 'strike', archTh: 'ท่าสังหารเดี่ยว', icon: '🗡️', type: p.type || 'p', cd: 8, wind: 3, hits: 1, M: 0.85, costPct: 0, moves: ['ฟาดพลัง'] }
        ]
      };
      W.foeById = W.foeById || {};
      W.foeById[sId] = summonUnit;
      W.foes = W.foes || [];
      if (!W.foes.some(x => x.id === sId)) W.foes.push(summonUnit);
      if (!f[side].includes(sId)) f[side].push(sId);
      a.fx = { t: W.t, text: '👥 อัญเชิญ' + sConf.nameSuffix };
      summonUnit.fx = { t: W.t, text: '⚡ ปรากฏกาย' };
      return;
    }
    if (p.arch === 'channel') {
      const ch = p.channel || { ticks: 3, tickM: 0.5, finishM: 1.0, interruptForce: 15 };
      ctx.channeling = {
        skillId: p.id,
        skill: p,
        targetId: d.id,
        ticksLeft: ch.ticks,
        totalTicks: ch.ticks,
        tickM: ch.tickM,
        finishM: ch.finishM,
        interruptForce: ch.interruptForce
      };
      ST.addStatus(a, 'channeling', ch.ticks * 4 + 2);
      a.fx = { t: W.t, text: '🌀 เริ่มร่าย ' + p.nameTh };
      return;
    }
    // ท่าโจมตี
    const targets = p.aoe ? C.enemies(W, f, a.id).filter(x => Math.hypot(x.x - d.x, x.y - d.y) < 2.6) : [d]; if (!targets.includes(d)) targets.unshift(d);
    const mas = a.foe ? 1 : SK.mastery(a, p); let dealt = 0;
    targets.slice(0, 6).forEach(t => {
      if (!C.alive(t)) return;
      for (let i = 0; i < (p.hits || 1); i++) {
        if (!C.alive(t)) break;
        const r = C.strike(W, f, a, t, { M: p.M * mas * (p.aoe && t !== d ? 0.8 : 1), type: p.type, pen: p.pen, label: i === 0 ? label : null, silent: i > 0, critAdd: p.arch === 'flurry' ? 0 : 0 });
        if (r.hit) { dealt += r.dmg; applyRiders(W, f, a, t, p, r); }
      }
    });
    if (p.steal && dealt > 0 && !a.dead) C.setHp(a, Math.min(C.hpMax(a), C.hp(a) + dealt * p.steal));
    if (p.recoil && !a.dead) { ST.addStatus(a, 'exposed', 12); const rd = C.hpMax(a) * p.recoil; if (C.hp(a) - rd > 1) C.setHp(a, C.hp(a) - rd); else C.setHp(a, 1); }
  }
  function applyRiders(W, f, a, t, p, r) {
    const SK = SKs(), ST = STs(); if (!C.alive(t) && t.dead) return;
    const ratio = clamp(C.power(a) / Math.max(1, C.power(t)), 0.3, 1.8);
    if (p.arch === 'pierce') ST.addStatus(t, 'armorbreak', 12);
    if (p.arch === 'dot') { const k = p.dotKind || 'bleed'; ST.addStatus(t, k, 12, { per: Math.min(0.06, (p.dot || 1) * 0.12 * (ST.get(a)[p.type === 'p' ? 'atk' : 'matk'] / Math.max(1, Math.max(ST.get(a).atk, ST.get(a).matk))) / 12), src: a.id }); }
    if (p.ctrl) {
      const ok = W.rng.next() < clamp(0.78 * Math.pow(ratio, 0.7), 0.1, 0.95);
      if (!ok) { t.fx = { t: W.t, text: 'ต้านทาน' }; return; }
      if (p.ctrl === 'stun' || p.ctrl === 'silence') C.interruptChannel(W, f, t, 'ถูกสะกดขัดจังหวะ');
      const dur = { stun: 4 + Math.floor(p.tier / 2), slow: 14, silence: 10, weaken: 12, blind: 12 }[p.ctrl];
      if (p.ctrl === 'burn' || p.ctrl === 'bleed') ST.addStatus(t, p.ctrl, 12, { per: 0.012 + 0.003 * p.tier, src: a.id });
      else ST.addStatus(t, p.ctrl, dur || 8);
      return;
    }
    if (p.rider && W.rng.chance(0.38)) {
      const k = p.rider;
      if (k === 'burn' || k === 'bleed') ST.addStatus(t, k, 10, { per: 0.006 + 0.0015 * p.tier, src: a.id });
      else if (k === 'critUp' || k === 'haste') ST.addStatus(a, k, 8);
      else if (k === 'leech') C.setHp(a, Math.min(C.hpMax(a), C.hp(a) + r.dmg * 0.08));
      else ST.addStatus(t, k, 10);
    }
  }
  C.statusTick = (W, f, u) => {
    const ST = STs(); if (!u.sx || !u.sx.length) return;
    const SK = SKs(); const keep = [];
    u.sx.forEach(x => { if (x.until <= W.t) return; keep.push(x); const S = SK.STATUS[x.k]; if (S && S.dot && x.per && !u.dead) { const src = x.src ? C.unit(W, x.src) : null; C.applyDamage(W, f, src && !src.dead ? src : null, u, C.hpMax(u) * x.per * (f.serious ? 1 : 0.55)); u.fx = { t: W.t, text: S.icon }; } });
    if (keep.length !== u.sx.length) { u.sx = keep; ST.dirty(u); }
  };
  C.interruptChannel = (W, f, u, reason) => {
    if (!u.act || !u.act.ctx || !u.act.ctx.channeling) return false;
    const ch = u.act.ctx.channeling;
    STs().clearStatus(u, x => x.k === 'channeling');
    u.act.ctx.cds = u.act.ctx.cds || {};
    u.act.ctx.cds[ch.skillId] = W.t + Math.round((ch.skill.cd || 16) * 0.7);
    delete u.act.ctx.channeling;
    u.fx = { t: W.t, text: '⚡ เสียสมาธิ!' };
    return true;
  };
  C.resolveChannelTick = (W, f, a, ctx) => {
    if (!ctx.channeling) return;
    const ch = ctx.channeling;
    const t = C.unit(W, ch.targetId);
    if (!C.alive(t)) {
      STs().clearStatus(a, x => x.k === 'channeling');
      delete ctx.channeling;
      return;
    }
    const isFinal = ch.ticksLeft <= 1;
    const mult = isFinal ? ch.finishM : ch.tickM;
    const r = C.strike(W, f, a, t, {
      M: mult,
      type: ch.skill.type || 'm',
      pen: ch.skill.pen || 0,
      label: isFinal ? '💥 ' + ch.skill.nameTh + ' ปะทุ!' : '🌀 คลื่นพลัง (' + (ch.totalTicks - ch.ticksLeft + 1) + '/' + ch.totalTicks + ')'
    });
    if (r.hit) applyRiders(W, f, a, t, ch.skill, r);
    ch.ticksLeft--;
    if (ch.ticksLeft <= 0 || !C.alive(t)) {
      STs().clearStatus(a, x => x.k === 'channeling');
      delete ctx.channeling;
      a.fx = { t: W.t, text: '✨ ปลดปล่อยสมบูรณ์' };
    }
  };
  C.attack = (W, f, a, d) => {
    const ST = STs(); a.fx = a.fx || {};
    const ctx = a.act && a.act.ctx ? a.act.ctx : {};
    if (ST.has(a, 'stun')) {
      if (ctx.channeling) C.interruptChannel(W, f, a, 'ติดมึนงง');
      a.fx = { t: W.t, text: '💫' };
      return 3;
    }
    if (ctx.channeling) {
      if (ST.has(a, 'silence')) {
        C.interruptChannel(W, f, a, 'ถูกผนึกวิชา');
        return 3;
      }
      C.resolveChannelTick(W, f, a, ctx);
      const sa = ST.get(a);
      return clamp(Math.round(250 / sa.cast), 2, 6);
    }
    const sa = ST.get(a), p = chooseSkill(W, f, a, d, ctx);
    if (p) { useSkill(W, f, a, d, p, ctx); return clamp(Math.round(p.wind * 100 / sa.cast), 2, 18); }
    C.strike(W, f, a, d, { M: 1 });
    return clamp(Math.round(400 / sa.cast), 2, 9);
  };
  C.slay = (W, f, killer, victim) => {
    victim.dead = true;
    if (victim.isSummon) {
      if (victim.fx) victim.fx = { t: W.t, text: '💨 สลายร่าง' };
      return;
    }
    if (!killer.foe && !killer.dead && killer.cult && killer.cult.path === 'DEMON') {
      const vTier = victim.tier || (victim.cult && victim.cult.stage) || 1;
      const gainAmt = 3 + vTier * 2.5;
      CULT.gain(killer, gainAmt);
      const qm = CULT.qiMax(killer);
      killer.h.state.qi = Math.min(qm, (killer.h.state.qi || 0) + qm * 0.18);
      killer.h.state.heartDemon = clamp((killer.h.state.heartDemon || 0) + 1.5, 0, 100);
      killer.stats = killer.stats || {};
      killer.stats.demonHarvest = (killer.stats.demonHarvest || 0) + Math.round(gainAmt);
    }
    if (victim.foe) {
      W.log('combat', C.name(killer) + ' สังหาร' + victim.name, killer.foe ? [] : [killer.id]);
      if (!killer.foe) { killer.stats = killer.stats || {}; killer.stats.kills = (killer.stats.kills || 0) + 1; HC.experience(killer, 'victory', 0.6); killer.merit += 3 + victim.tier * 2; }
      return;
    }
    AI.kill(W, victim, killer.foe ? 'ถูก' + killer.name + 'สังหาร' : 'ถูก' + killer.h.name.given + 'สังหารในการดวล');
    if (!killer.foe) { HC.experience(killer, 'killed', 0.8); const r = SECT.rel(killer, victim.id); AI.mem(W, killer, 'ปลิดชีพ ' + victim.h.name.given, 1, victim.id); killer.stats = killer.stats || {}; killer.stats.kills = (killer.stats.kills || 0) + 1; }
  };

  /* พฤติกรรมต่อนาทีของผู้ต่อสู้ที่เป็น NPC */
  C.fightStep = (W, n) => {
    const f = C.fightOf(W, n);
    if (!f || f.over) { C.leave(W, n); return; }
    if (n.dead) return;
    if (n.yield || n.fled) { // ยอมแพ้/หนี: ถอยออกจากวงและพักรักษา
      if (n.fled && !n.fleeTo) { const b = W.map.byId.infirmary; n.fleeTo = { x: b.door.x, y: b.door.y }; AI.goTo(W, n, n.fleeTo.x, n.fleeTo.y); }
      if (n.path) AI.stepMove(W, n); return;
    }
    const ctx = n.act.ctx; C.statusTick(W, f, n); if (n.dead || n.yield || n.fled) return;
    if (n.h.state.qi != null && n.cult) { const qm = CULT.qiMax(n); n.h.state.qi = Math.min(qm, n.h.state.qi + qm * 0.006); }
    if (f.state === 'gather') {
      const ar = f.arena; if (Math.hypot(n.x - ar.x, n.y - ar.y) > 5 + (f.A.indexOf(n.id) + f.B.indexOf(n.id) + 1) % 3) { if (!n.path) AI.goTo(W, n, Math.floor(ar.x + (C.sideOf(f, n.id) === 'A' ? -3 : 3)), Math.floor(ar.y)); AI.stepMove(W, n); } else n.path = null;
      return;
    }
    let t = C.unit(W, ctx.target);
    if (!C.alive(t)) { const en = C.enemies(W, f, n.id); if (!en.length) return; en.sort((a, b) => Math.hypot(a.x - n.x, a.y - n.y) - Math.hypot(b.x - n.x, b.y - n.y)); t = en[0]; ctx.target = t.id; n.path = null; }
    const d = Math.hypot(t.x - n.x, t.y - n.y);
    if (d > 1.7) { moveToward(W, n, t.x, t.y, true); n.face = t.x >= n.x ? 1 : -1; return; }
    n.face = t.x >= n.x ? 1 : -1; n.path = null;
    if (--ctx.cd > 0) return;
    if (g.CPE && g.CPE.fightUse(W, n, ctx)) { ctx.cd = 2; return; }
    ctx.cd = C.attack(W, f, n, t);
  };
  C.leave = (W, n) => {
    if (n.act && n.act.ctx && n.act.ctx.channeling) delete n.act.ctx.channeling;
    if (n.sx && n.sx.length) { n.sx = []; STs().dirty(n); }
    n.run = false; n.fleeTo = null; n.yield = false; n.fled = false; n.path = null; n.lastHurtBy = null;
    n.act = { id: 'idle', stage: 'do', left: 15, total: 15, ctx: {}, why: [] };
  };

  /* พฤติกรรมศัตรู */
  C.foeStep = (W, u) => {
    if (u.dead || u.gone) return;
    u.px = u.x; u.py = u.y;
    if (u.isSummon) {
      if (u.dur != null && --u.dur <= 0) {
        u.dead = true; u.gone = true;
        u.fx = { t: W.t, text: '💨 หมดเวลา' };
        return;
      }
    }
    if (u.fled) { moveToward(W, u, MAP.EXIT.x, MAP.EXIT.y, true); if (Math.hypot(u.x - MAP.EXIT.x, u.y - MAP.EXIT.y) < 3) { u.gone = true; } return; }
    const f = u.act && u.act.ctx && u.act.ctx.fid ? (W.fights || []).find(q => q.id === u.act.ctx.fid) : null;
    if (!f) { u.gone = true; return; }
    const ctx = u.act.ctx; C.statusTick(W, f, u); if (u.dead) return; if (STs().has(u, 'stun')) return;
    let t = C.unit(W, ctx.target);
    if (!C.alive(t) || t.hidden && (W.t % 10 === 0)) { const en = C.enemies(W, f, u.id).filter(x => !x.hidden && !x.away); if (!en.length) { // ไม่มีผู้ป้องกันในสนาม: มุ่งสู่ใจกลางสำนัก
        const mh = W.map.byId.main_hall; moveToward(W, u, mh.x + mh.w / 2, mh.y + mh.h + 2, false); u.reachedCore = Math.hypot(u.x - (mh.x + mh.w / 2), u.y - (mh.y + mh.h + 2)) < 3; return; }
      en.sort((a, b) => Math.hypot(a.x - u.x, a.y - u.y) - Math.hypot(b.x - u.x, b.y - u.y)); t = en[0]; ctx.target = t.id; }
    const d = Math.hypot(t.x - u.x, t.y - u.y);
    if (d > 1.7) { moveToward(W, u, t.x, t.y, false); return; }
    u.face = t.x >= u.x ? 1 : -1;
    if (--ctx.cd > 0) return;
    ctx.cd = C.attack(W, f, u, t);
  };

  /* ---------- วนรอบการต่อสู้ทุกนาที: ตัดสินผล ---------- */
  C.tick = W => {
    const fl = W.fights; if (!fl || !fl.length) { C.processQueue(W); C.tournamentTick(W); return; }
    for (const f of fl) {
      if (f.over) continue;
      if (f.state === 'gather') {
        const all = [].concat(f.A, f.B).map(id => C.unit(W, id)).filter(Boolean);
        const near = all.every(u => Math.hypot(u.x - f.arena.x, u.y - f.arena.y) < 8);
        if (near || W.t - f.t0 > 400) { f.state = 'fight'; all.forEach(u => { u.path = null; }); }
        continue;
      }
      const a = f.A.map(i => C.unit(W, i)).filter(C.alive), b = f.B.map(i => C.unit(W, i)).filter(C.alive);
      const timeout = W.t - f.t0 > (f.kind === 'raid' ? 900 : 300);
      if (!a.length || !b.length || timeout) { f.over = true; f.winner = timeout ? (f.kind === 'raid' ? 'B' : null) : (a.length ? 'A' : 'B'); C.conclude(W, f); }
    }
    W.fights = fl.filter(f => !f.over || W.t - f.t0 < 5);
    C.processQueue(W); C.tournamentTick(W);
  };
  C.conclude = (W, f) => {
    const all = [].concat(f.A, f.B).map(id => C.unit(W, id)).filter(Boolean);
    const ws = f.winner; const winners = ws ? (ws === 'A' ? f.A : f.B).map(i => C.unit(W, i)).filter(u => u && !u.dead) : [];
    const losers = ws ? (ws === 'A' ? f.B : f.A).map(i => C.unit(W, i)).filter(Boolean) : [];
    all.forEach(u => {
      if (u.isSummon) {
        u.dead = true; u.gone = true;
      } else if (!u.foe && !u.dead) {
        C.leave(W, u); u.yield = false; u.fled = false;
        if (!u.act || u.act.id === 'fight') u.act = { id: 'idle', stage: 'do', left: 20, total: 20, ctx: {}, why: [] };
      }
    });
    if (W.foes && W.foes.length) {
      W.foes = W.foes.filter(x => !x.isSummon || !x.dead);
    }
    if (f.kind === 'wild' && g.WILD) g.WILD.finish(W, f, ws);
    if (f.cb) f.cb(W, f, ws, winners, losers);
  };

  /* ---------- คิวดวลตัวต่อตัว (แค้น/ท้าชิงตำแหน่ง) ---------- */
  C.processQueue = W => {
    const q = W.duelQueue; if (!q || !q.length) return;
    const keep = [];
    for (const d of q) {
      const a = W.byId[d.a], b = W.byId[d.b];
      if (!a || !b || a.dead || b.dead || a.away || b.away) continue;
      const busy = u => u.sealed || (u.act && (u.act.id === 'breakthrough' || u.act.id === 'fight')) || u.jail > W.t;
      if (busy(a) || busy(b)) { d.wait = (d.wait || 0) + 1; if (d.wait < 600) keep.push(d); continue; }
      const tg = W.map.byId.training_ground; const arena = { x: tg.x + tg.w / 2, y: tg.y + tg.h / 2 };
      if (d.kind === 'leadership') W.log('challenge', a.h.name.given + ' กับ ' + b.h.name.given + ' เข้าสู่ลานดวลตัดสินตำแหน่งเจ้าสำนัก', [a.id, b.id]);
      const serious = d.serious; C.startFight(W, [a.id], [b.id], d.kind, { serious, gather: true, arena, cb: C.duelEnd, ctx: d });
    }
    W.duelQueue = keep;
  };
  C.duelEnd = (W, f, ws, winners, losers) => {
    const a = W.byId[f.A[0]], b = W.byId[f.B[0]]; if (!a || !b) return;
    const w = ws === 'A' ? a : ws === 'B' ? b : null, l = ws === 'A' ? b : ws === 'B' ? a : null;
    if (!w) { W.log('duel', a.h.name.given + ' กับ ' + b.h.name.given + ' ดวลกันไม่มีผู้ชนะ', [a.id, b.id]); return; }
    if (l && !l.dead) { const sev = C.hp(l) < C.hpMax(l) * 0.2 ? 2 : 1; AI.injure(W, l, sev, 'พ่ายแพ้ในการดวล'); }
    const rl = l && !l.dead ? SECT.rel(l, w.id) : null; if (rl) { rl.v += 8; rl.a -= 4; }
    HC.experience(w, 'victory', 0.7); if (l && !l.dead) HC.experience(l, 'defeat', 0.7);
    [a, b].forEach(u => {
      if (u && !u.dead && u.cult && u.cult.path === 'HEART_SOUL') {
        u.h.state.heartDemon = Math.max(0, (u.h.state.heartDemon || 0) - 3.5);
        u.h.state.stress = Math.max(0, (u.h.state.stress || 0) - 4);
        HC.gainWisdom(u, 0.12);
        CULT.gain(u, 1.5);
      }
    });
    if (f.kind === 'leadership') {
      const S = W.sect, ch = a, m = b;
      if (w === ch) {
        // ผู้ท้าชนะ → ขึ้นเป็นเจ้าสำนัก
        if (ch.post) { S.posts[ch.post] = null; ch.post = null; } if (S.deputyId === ch.id) S.deputyId = null;
        ch.rank = 6; S.masterId = ch.id; ch.sat = 88; if (!m.dead) { m.rank = 4; m.sat = Math.max(0, (m.sat || 60) - 30); }
        S.policyShift = W.day; W.fame(3);
        W.log('succession', ch.h.name.given + ' ชนะการท้าชิง ขึ้นเป็นเจ้าสำนักคนใหม่แทน ' + m.h.name.given, [ch.id, m.id]);
        if (m.dead) W.log('succession', 'เจ้าสำนักเดิมเสียชีวิตจากการดวล', [m.id]);
      } else {
        // ผู้ท้าแพ้ → โดนลงโทษตามนิสัยเจ้าสำนัก (เข้มงวดสูง = ขังนานขึ้น)
        W.log('challenge', m.h.name.given + ' ชนะการท้าชิง รักษาตำแหน่งเจ้าสำนักไว้ได้', [m.id, ch.id]);
        if (!ch.dead) { const days = Math.round(2 + S.policy.strictness / 12); ch.jail = W.t + days * 1440; ch.sat = Math.max(0, (ch.sat || 50) - 12); W.log('punish', ch.h.name.given + ' ถูกคุมขัง ' + days + ' วันฐานท้าชิงตำแหน่ง', [ch.id]); if (S.policy.strictness > 70 && S.policy.generosity < 40 && W.rng.chance(0.4)) { SECT.setRank(W, ch, Math.max(0, ch.rank - 1), 'ท้าชิงล้มเหลว'); } }
        m.merit += 20;
      }
    } else if (f.kind === 'grudge') {
      W.log('duel', w.h.name.given + ' ชนะการดวลกับ ' + (l ? l.h.name.given : '?') + (l && l.dead ? ' (อีกฝ่ายเสียชีวิต)' : ''), [w.id, l && l.id]);
      if (l && l.dead) { /* ปัญหาวินัย */ W.sect.suspicion = (W.sect.suspicion || 0) + 3; if (W.sect.policy.strictness > 55) { w.jail = W.t + 3 * 1440; } }
      else if (l) { const r = SECT.rel(w, l.id); r.v = Math.max(0, r.v - 15); r.r += 6; }
    }
  };

  /* ---------- ประลองยุทธ์สำนัก ---------- */
  C.tournamentTick = W => {
    const T = W.sect.tournament; if (!T) return;
    const m = W.byId[W.sect.masterId];
    if (T.state === 'announce' && W.t >= T.start) {
      const pool = W.npcs.filter(n => !n.dead && !n.away && !n.exiled && n.rank >= 1 && n.rank < 6 && !n.sealed && !(n.jail > W.t) && !(n.inj && n.inj.some(i => i.sev >= 2)) && n.h.state.hp > CULT.hpMax(n) * 0.6);
      const ent = pool.filter(n => { const want = (E(n, 'interests.combat') + E(n, 'values.martialPeak') + E(n, 'personality.ambition') + E(n, 'personality.courage') + (E(n, 'values.wealthResource') * T.prize / 200)) / 5 - 38 + (n.rank >= 4 ? -10 : 0) + (n.post === 'martial' ? 10 : 0); return W.rng.next() < clamp(0.1 + want / 40, 0.03, 0.9); });
      if (ent.length < 2) { W.log('tournament', 'ประลองยุทธ์ยกเลิกเพราะมีผู้สมัครน้อยเกินไป', []); W.sect.tournament = null; return; }
      ent.sort((a, b) => W.rng.next() - 0.5);
      T.entrants = ent.map(n => n.id); T.alive = T.entrants.slice(); T.state = 'run'; T.round = 1; T.queue = []; T.cur = null; T.history = [];
      W.log('tournament', 'ประลองยุทธ์สำนักเริ่มขึ้น! มีผู้เข้าร่วม ' + ent.length + ' คน', []);
      W.sect.festival = { until: W.t + 8 * 60 + ent.length * 25, kind: 'tournament', at: 'plaza' };
      T.watchUntil = W.sect.festival.until;
    }
    if (T.state !== 'run') return;
    if (T.cur) { if (T.cur.over) T.cur = null; else return; }
    if (!T.queue.length) {
      T.alive = T.alive.filter(id => W.byId[id] && !W.byId[id].dead);
      if (T.alive.length <= 1) { C.tournamentEnd(W, T); return; }
      const a = T.alive.slice(); const q = []; while (a.length >= 2) q.push([a.shift(), a.shift()]); T.bye = a.length ? a[0] : null; T.queue = q; T.nextAlive = T.bye ? [T.bye] : []; T.round++;
    }
    if (T.cur == null && T.queue.length) {
      const [x, y] = T.queue.shift(); const a = W.byId[x], b = W.byId[y];
      if (!a || !b || a.dead || b.dead) { if (a && !a.dead) T.nextAlive.push(x); else if (b && !b.dead) T.nextAlive.push(y); return; }
      const tg = W.map.byId.training_ground; const arena = { x: tg.x + tg.w / 2, y: tg.y + tg.h / 2 };
      T.cur = C.startFight(W, [x], [y], 'tourney', { serious: false, gather: true, arena, cb: (W2, f, ws) => { const win = ws === 'A' ? x : ws === 'B' ? y : (CULT.power(a) >= CULT.power(b) ? x : y); T.nextAlive.push(win); const lose = win === x ? b : a; if (!W2.byId[win].dead) { W2.byId[win].merit += 4; } AI.injure(W2, lose, 1, 'บาดเจ็บในการประลอง'); T.history.push(win); if (!T.queue.length) { T.alive = T.nextAlive.slice(); T.queue = []; } }, ctx: { t: 1 } });
      if (!T.queue.length) { /* รอบสุดท้ายของรอบนี้: อัปเดต alive หลังจบ (ทำใน cb) */ }
    }
  };
  C.tournamentEnd = (W, T) => {
    const win = W.byId[T.alive[0]]; W.sect.tournament = null; if (!win) return;
    ECO.pay(W, Math.min(T.prize, W.sect.stones), 'รางวัลประลองยุทธ์'); win.inv.stones += T.prize; win.merit += 35; HC.experience(win, 'victory', 1); W.fame(3);
    AI.mem(W, win, 'ชนะเลิศประลองยุทธ์สำนัก', 1);
    W.log('tournament', win.h.name.given + ' ชนะเลิศประลองยุทธ์สำนัก ได้รางวัล ' + T.prize + ' ศิลา', [win.id]);
    const m = W.byId[W.sect.masterId];
    if (m && win.rank <= 3 && HC.eff(m, 'interests.teaching') > 45 && W.rng.chance(0.3) && !win.mentor) { win.mentor = m.id; (m.h.life.family.disciples = m.h.life.family.disciples || []).push(win.id); win.h.life.family.master = m.id; W.log('disciple', m.h.name.given + ' รับ ' + win.h.name.given + ' เป็นศิษย์เอก', [m.id, win.id]); }
  };

  g.COMBAT = C;
  if (typeof module === 'object' && module.exports) module.exports = C;
})(typeof globalThis !== 'undefined' ? globalThis : this);
