/* bottleneck.js — ระบบคอขวด/เตรียมทะลวง/โอสถเฉพาะขั้น/สมบัติประจำด่านใหญ่ (v1.3)
 * แนวคิด (ประกอบจากขนบนิยายบำเพ็ญเพียรและเกมแนวเดียวกัน):
 *  1) ตบะเต็มแล้วไม่ใช่ทะลวงได้ทันที — เป็น "คอขวด" ตบะอัดเพิ่มช้ามาก (เหลือ 15%) ต้องเตรียมตัว
 *  2) เตรียมได้ 3 ทาง: ตั้งจิตตกผลึก (ฐานมั่น), โอสถทะลวงเฉพาะขั้น/สาย (ผิดขั้นผลลดและพิษสะสม), สมบัติประจำด่านใหญ่
 *  3) NPC ตัดสินใจเองว่าจะ "ลุยเลย / รอเตรียม" จากบุคลิก (ระวัง กล้า ทะเยอทะยาน อดทน) และอายุขัยที่เหลือ
 *  4) ล้มเหลว → ตบะถอยเหลือ 50–70% ของด่าน ได้ประสบการณ์เล็กน้อย (โอกาสรอบหน้าเพิ่มนิด)
 *  5) เจ้าสำนัก/ผู้ใหญ่จัดสรรโอสถและสมบัติตามนโยบาย (ยึดความสามารถ/ลำเอียง/เห็นแก่ตัว) */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, CULT = g.CULT, ECO = g.ECO, SECT = g.SECT, AI = g.AI, X = g.EXPED, JD = g.JD;
  const clamp = U.clamp, E = (n, p) => HC.eff(n, p);
  const BN = {}; const TR = JD.BT.TREASURES;
  BN.treasureOf = c => TR[c.path + ':' + c.stage] || null;
  BN.pillKey = c => 'P:BT_' + c.path + '_' + c.stage;
  BN.heldPill = (n) => { const k = BN.pillKey(n.cult); return n.inv && n.inv.pills && n.inv.pills[k] > 0 ? k : null; };

  /* ผลของโอสถต่อผู้ใช้: ตรงขั้น/สาย = เต็ม; ขั้นต่ำกว่า 30%; ขั้นสูงกว่า 60% (พิษ ×1.8); ผิดสาย 20% ; ดื้อยาลง 30% ต่อเม็ดที่กินในขั้นนี้ */
  BN.pillMult = (c, f) => {
    let m;
    if (f.path !== c.path) m = 0.2; else if (f.stage === c.stage) m = 1; else if (f.stage < c.stage) m = 0.3; else m = 0.6;
    return m * Math.pow(0.7, c.btTaken || 0);
  };
  /* ตัวปรับโอกาสทะลวง (เรียกจาก CULT.breakthroughChance) */
  BN.chanceMod = npc => {
    const c = npc.cult; let m = (c.found || 0) + (c.failExp || 0);
    const tr = BN.treasureOf(c);
    if (tr) m += c.treasure === tr.id ? 0.16 : -0.30;
    return m;
  };
  BN.onResult = (W, npc, ok) => {
    const c = npc.cult;
    if (ok) { c.found = 0; c.failExp = 0; c.btTaken = 0; c.treasure = null; c.bn = null; c.failN = 0; }
    else { c.failN = (c.failN || 0) + 1; c.failExp = Math.min(0.1, (c.failExp || 0) + 0.02); c.found = (c.found || 0) * 0.4; if (c.treasure && W.rng.chance(0.4)) c.treasure = null; c.bn = null; }
  };

  /* ---- แผนตัดสินใจของ NPC ---- */
  function estimate(W, n) {
    const c = n.cult, S = W.sect;
    const p0 = CULT.breakthroughChance(n, { env: 0.05, pill: c.btBonus || 0 }) + (BN.heldPill(n) ? (ECO.pillInfo(BN.heldPill(n)).effect.breakthroughBonus || 0) : 0);
    const key = BN.pillKey(c), tr = BN.treasureOf(c);
    const pillObt = !BN.heldPill(n) && ECO.count(W, key) > 0 ? ECO.pillInfo(key).effect.breakthroughBonus : 0;
    const trObt = tr && c.treasure !== tr.id && ECO.count(W, tr.id) > 0 ? 0.46 : 0;
    return { p0, potential: p0 + pillObt + trObt, obtainable: pillObt + trObt > 0 };
  }
  BN.decide = (W, n) => {
    const c = n.cult, bn = c.bn;
    const left = (n.lifespanMax || CULT.lifespan(n)) - HC.ageYears(n);
    const urgent = left < Math.max(4, (n.lifespanMax || 100) * 0.12);
    const target = clamp(0.55 + (E(n, 'personality.caution') - 50) / 200 - (E(n, 'personality.courage') - 50) / 300 - (E(n, 'personality.ambition') - 50) / 400 - (urgent ? 0.25 : 0), 0.3, 0.8);
    const patience = (E(n, 'personality.discipline') + E(n, 'personality.composure') + E(n, 'intellect.willpower')) / 3 - E(n, 'personality.ambition') * 0.3;
    const limit = urgent ? 3 : clamp(8 + patience * 0.8, 6, 75);
    const est = estimate(W, n), waited = W.day - bn.since;
    const tr = BN.treasureOf(c);
    let plan, why;
    if (est.p0 >= target) { plan = 'go'; why = 'มั่นใจ ' + Math.round(est.p0 * 100) + '%'; }
    else if (waited >= limit) { plan = 'go'; why = urgent ? 'อายุขัยใกล้หมด จึงเสี่ยง' : 'รอนานพอแล้ว ตัดสินใจเสี่ยง'; }
    else { plan = 'wait'; why = est.obtainable ? 'รอโอสถ/สมบัติจากสำนัก' : tr && c.treasure !== tr.id ? 'ยังไม่มี' + tr.nameTh : 'ยังไม่มั่นใจ ขอตกผลึกก่อน'; }
    bn.target = target; bn.p0 = est.p0; bn.why = why; bn.limit = limit;
    if (plan !== bn.plan) { bn.plan = plan; if (plan === 'go') { W.log('breakthrough', n.h.name.given + ' ตัดสินใจทะลวงคอขวดของ' + CULT.stageName(n) + ' (' + why + ')', [n.id]); } else if (waited === 0) { W.log('breakthrough', n.h.name.given + ' ตบะเต็มแล้วแต่ติดคอขวด — ' + why, [n.id]); } }
  };

  /* ---- รายวัน: คัดคนติดคอขวด จัดสรรของ ---- */
  const scoreFor = (W, n) => {
    const S = W.sect, mer = S.policy.meritocracy / 100, m = W.byId[S.masterId];
    let s = (n.merit || 0) / 60 * (0.3 + mer) + n.rank * 0.25 + (n.id === S.masterId ? (E(n, 'values.powerStatus') - 40) / 60 : 0);
    s += HC.derived(n).cultivationTalent / 100 * mer;
    if (m && n.id !== m.id && n.rel && n.rel[m.id]) s += (n.rel[m.id].affinity || 0) / 200 * (1 - mer);
    return s;
  };
  BN.daily = W => {
    const S = W.sect; const demand = {}, needTr = {};
    const stuck = [];
    W.npcs.forEach(n => {
      if (n.dead || !n.cult) return; const c = n.cult;
      if (CULT.ready(n)) {
        if (!c.bn) c.bn = { since: W.day, plan: null };
        stuck.push(n);
        if (!n.away) BN.decide(W, n);
        if (c.bn.plan === 'wait' || !c.bn.plan) { if (!BN.heldPill(n)) demand[c.path + ':' + c.stage] = (demand[c.path + ':' + c.stage] || 0) + 1; }
        const tr = BN.treasureOf(c); if (tr && c.treasure !== tr.id) needTr[tr.id] = (needTr[tr.id] || 0) + 1;
      } else if (c.bn) c.bn = null;
    });
    S.btDemand = demand; S.trDemand = needTr;
    // จัดสรรสมบัติ/โอสถจากคลังให้ผู้ที่คู่ควรที่สุด
    stuck.forEach(() => { });
    Object.keys(needTr).forEach(id => {
      if (ECO.count(W, id) <= 0) return;
      const cands = stuck.filter(n => { const t = BN.treasureOf(n.cult); return t && t.id === id && n.cult.treasure !== id && !n.away; });
      if (!cands.length) return; cands.sort((a, b) => scoreFor(W, b) - scoreFor(W, a));
      const w = cands[0]; ECO.take(W, id, 1); w.cult.treasure = id; w.merit = (w.merit || 0) - 8;
      const m = W.byId[S.masterId];
      W.log('breakthrough', (m && m.id === w.id ? '' : (m ? m.h.name.given : 'เจ้าสำนัก') + ' มอบ') + (m && m.id === w.id ? w.h.name.given + ' เก็บ' : ' ') + TR[w.cult.path + ':' + w.cult.stage].nameTh + (m && m.id === w.id ? 'ไว้ใช้เอง' : 'ให้ ' + w.h.name.given + ' เพื่อทะลวง'), [w.id]);
    });
    Object.keys(demand).forEach(k => {
      const [path, st] = k.split(':'); const key = 'P:BT_' + path + '_' + st;
      if (ECO.count(W, key) <= 0) return;
      const cands = stuck.filter(n => n.cult.path === path && n.cult.stage === +st && !BN.heldPill(n) && !n.away).sort((a, b) => scoreFor(W, b) - scoreFor(W, a));
      const w = cands[0]; if (!w || scoreFor(W, w) < 0.35) return; // ที่เหลือไปซื้อเองที่ตลาด
      ECO.take(W, key, 1); w.inv.pills = w.inv.pills || {}; w.inv.pills[key] = (w.inv.pills[key] || 0) + 1; w.merit = (w.merit || 0) - 4;
      W.log('breakthrough', 'สำนักมอบ' + ECO.name(key) + 'ให้ ' + w.h.name.given + ' ก่อนทะลวง', [w.id]);
    });
    // พ่อค้าเร่เสนอขายสมบัติ ถ้ามีคนต้องการ
    if (W.day % 15 === 0 && Object.keys(needTr).length && W.rng.chance(0.4)) {
      const id = W.rng.pick(Object.keys(needTr)); const t = Object.values(TR).find(x => x.id === id), price = Math.round(t.value * 1.7);
      if (S.stones > price * 1.3) { ECO.pay(W, price, 'ซื้อสมบัติจากพ่อค้าเร่: ' + t.nameTh); ECO.add(W, id, 1); W.log('finance', 'พ่อค้าเร่นำ' + t.nameTh + 'มาเสนอ สำนักซื้อไว้ ' + price + ' ศิลา', []); }
    }
  };

  /* ---- การทะลวงจริง: เตรียมของ ---- */
  BN.prepare = (W, n) => {
    const c = n.cult, k = BN.heldPill(n);
    if (k) { n.inv.pills[k]--; if (n.inv.pills[k] <= 0) delete n.inv.pills[k]; const r = ECO.applyPill(W, n, k); if (r) AI.mem(W, n, 'กิน' + r.info.name + 'ก่อนทะลวงขั้น', 0.6); }
    else if ((c.btBonus || 0) < 0.1 && n.rank >= 2) { // โอสถทั่วไป (ไม่เฉพาะขั้น) จากคลัง
      for (const key of Object.keys(W.sect.stock)) { const info = ECO.isPill(key) ? ECO.pillInfo(key) : null; if (info && info.effect.breakthroughBonus && !info.effect.btFor && info.tier <= c.stage + 1 && W.sect.stock[key] > 0) { ECO.usePill(W, n, key); break; } }
    }
  };

  /* ---- กิจกรรม: ตั้งจิตตกผลึก ---- */
  AI.ACTS.consolidate = {
    nameTh: 'ตั้งจิตตกผลึกก่อนทะลวง', icon: '🧿', color: '#c9a7ff',
    can: (n, W) => !!(n.cult && n.cult.bn && n.cult.bn.plan === 'wait') && n.h.state.energy > 25 && n.h.state.satiety > 25 && !(n.inj && n.inj.length),
    score(n, W, S) { S.add('ติดคอขวด ต้องเตรียมตัว', 1.7); S.add('ความอดทน', (E(n, 'personality.discipline') - 50) / 120); S.add('ฐานยังไม่มั่น', ((0.1 - (n.cult.found || 0)) * 3)); },
    where(W, n) {
      const c = n.cult;
      const kind = (c.path === 'XIAN' || c.path === 'HEART_SOUL') ? 'meditate' : c.path === 'BODY' ? 'lift' : c.path === 'DEMON' ? 'explore' : 'worship';
      const bk = (c.path === 'XIAN' || c.path === 'HEART_SOUL') ? 'meditation_hall' : c.path === 'BODY' ? 'training_ground' : c.path === 'DEMON' ? 'ruin' : 'shrine';
      let s = AI.freeStation(W, n, kind, bk);
      if (!s && (c.path === 'DEMON' || c.path === 'HEART_SOUL')) s = AI.freeStation(W, n, 'meditate', 'meditation_hall') || AI.freeStation(W, n, 'relax', 'spirit_pond');
      if (s) return { st: s };
      return n.bed != null ? { st: W.map.stations[n.bed] } : null;
    },
    dur: () => 240,
    tick(n, W) { n.h.state.energy = Math.max(10, n.h.state.energy - 0.012); },
    done(n, W) { const c = n.cult; c.found = Math.min(0.1, (c.found || 0) + 0.012 * (0.7 + E(n, 'intellect.focus') / 150)); n.h.state.heartDemon = Math.max(0, n.h.state.heartDemon - (c.path === 'HEART_SOUL' ? 5 : 3)); HC.experience(n, 'insight', 0.1); },
    inside: true
  };
  // ทะลวงได้เฉพาะเมื่อแผนคือ "ลุย"; start ใหม่ใช้ BN.prepare
  const AB = AI.ACTS.breakthrough, origCan = AB.can, origDone = AB.done;
  AB.can = (n, W) => origCan(n, W) && !!n.cult.bn && n.cult.bn.plan === 'go';
  AB.start = (n, W, ctx) => { BN.prepare(W, n); n.cult.lastTry = W.day; n.sealedBt = true; return true; };

  /* ---- ของวิเศษ: ผจญภัยพบสมบัติ ---- */
  const origResolve = X.resolve;
  X.resolve = (W, ex, members) => {
    if (ex.done || ex.settlement || !members.length) return;
    const r = origResolve(W, ex, members);
    try {
      const k = ex.kind; if (k !== 'delve' && k !== 'realm' && k !== 'fortune') return r;
      if (!members.some(m => !m.dead)) return r;
      const depth = ex.target || 1;
      const ch = k === 'delve' ? 0.03 + 0.018 * depth : k === 'realm' ? 0.09 : 0.025;
      if (!W.rng.chance(ch)) return r;
      const maxT = k === 'delve' ? 2 + depth / 1.6 : k === 'realm' ? 7 : 4;
      const dem = W.sect.trDemand || {};
      const list = Object.values(TR).filter(t => t.tier <= maxT);
      if (!list.length) return r;
      const t = W.rng.weighted(list, t => (1 / Math.pow(t.tier, 2.2)) * (dem[t.id] ? 2.2 : 1));
      ECO.add(W, t.id, 1); W.log('explore', 'คณะสำรวจพบสมบัติ「' + t.nameTh + '」— ' + t.hint, members.map(m => m.id));
    } catch (e) { /* ไม่ให้ระบบเสริมล้มเกม */ }
    return r;
  };

  /* ---- ชื่อ/ราคาของสมบัติ ---- */
  const oName = ECO.name, oBase = ECO.base;
  const trById = {}; Object.values(TR).forEach(t => trById[t.id] = t);
  ECO.name = id => trById[id] ? '✦ ' + trById[id].nameTh : oName(id);
  ECO.base = id => trById[id] ? trById[id].value : oBase(id);
  BN.TR_BY_ID = trById;

  /* ---- โอสถทะลวงเฉพาะขั้น: ผลตอนกิน ---- */
  const oUse = ECO.usePill;
  ECO.usePill = (W, npc, key) => {
    const info = ECO.pillInfo(key);
    if (!info || !info.effect.btFor) return oUse(W, npc, key);
    if (!ECO.take(W, key, 1)) return null;
    const c = npc.cult, e = info.effect, m = BN.pillMult(c, e.btFor), msgs = [];
    c.btBonus = Math.max(c.btBonus || 0, e.breakthroughBonus * m);
    c.toxic = Math.min(100, (c.toxic || 0) + e.toxicity * (e.btFor.stage > c.stage || e.btFor.path !== c.path ? 1.8 : 1));
    c.btTaken = (c.btTaken || 0) + 1;
    msgs.push(m >= 0.99 ? 'โอสถเหมาะกับขั้นนี้' : m < 0.5 ? 'โอสถไม่เหมาะ ผลน้อย' : 'ผลลดลง');
    HC.bump(npc); return { info, msgs };
  };
  g.BN = BN;
  if (typeof module === 'object' && module.exports) module.exports = BN;
})(typeof globalThis !== 'undefined' ? globalThis : this);
