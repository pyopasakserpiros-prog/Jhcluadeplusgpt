/* cpeco.js — เศรษฐกิจแต้มคุณูปการ (v1.10.2)
 * แนวคิด: สำนัก "เสก" แต้มคุณูปการ (คป.) ขึ้นมาจ่ายค่าตอบแทน แต่แต้มจะมีค่าก็ต่อเมื่อมีของที่คนอยากได้ให้ใช้แลก
 *  ที่มาของแต้ม (เสก): เบี้ยหวัดรายเดือน · ค่าแรงงานประจำ · เก็บสมุนไพรหุบเขา · ปรุงโอสถพื้นฐานให้สำนัก · บริจาคของจากการเดินทาง/สำรวจ/วิชา/ตำรับที่พบ
 *  ที่ไปของแต้ม (เผา): ซื้อของร้านค้าสำนัก (โอสถ/อุปกรณ์) · เรียนวิชาขั้นสูงจากหอคัมภีร์ · ค่าธรรมเนียมขอสิทธิ์ศึกษาตำรับ · ขอคำชี้แนะ · ฝึกปราณเข้มข้น
 *  ของที่มีในร้านมาจากการบริจาค/ผลผลิตของสำนักเท่านั้น → ทุกคนมีเหตุผลทำงานเพื่อแต้ม
 *  กลไกเสถียรภาพ: ราคา/ค่ารับบริจาคปรับตามความขาดแคลนของแต่ละสิ่ง + ดัชนีราคาแต้มปรับตามปริมาณแต้มจริงต่อหัว */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, CULT = g.CULT, ECO = g.ECO, SECT = g.SECT, AI = g.AI, X = g.EXPED, JD = g.JD, SK = g.SK, ST = g.STATS;
  const clamp = U.clamp, E = (n, p) => HC.eff(n, p), A = AI.ACTS;
  const CPE = {};
  const BASIC_IDS = JD.CP.BASIC.map(r => 'P:' + r.id);

  CPE.S = W => {
    const S = W.sect;
    if (!S.cp) S.cp = { minted: 0, burned: 0, circulation: 0, retired: 0, arbitrageBlocked: 0, price: 1, markup: 1, welfare: 0.5, log: [], dayMint: 0, dayBurn: 0, welfareGiven: 0, donated: 0, sales: 0, techSales: 0, studyFees: 0, studyServices: 0, trainingFees: 0, trainingServices: 0, recipeFees: 0, recipeAuthorizations: 0, freeLib: S.library ? S.library.filter(id => { const t = CULT.tech(id); return t && t.tier <= 1; }) : [], hist: [] };
    if (S.cp.circulation == null) S.cp.circulation = 0;
    if (S.cp.retired == null) S.cp.retired = 0;
    if (S.cp.arbitrageBlocked == null) S.cp.arbitrageBlocked = 0;
    if (S.cp.studyFees == null) S.cp.studyFees = 0;
    if (S.cp.studyServices == null) S.cp.studyServices = 0;
    if (S.cp.trainingFees == null) S.cp.trainingFees = 0;
    if (S.cp.trainingServices == null) S.cp.trainingServices = 0;
    if (S.cp.recipeFees == null) S.cp.recipeFees = 0;
    if (S.cp.recipeAuthorizations == null) S.cp.recipeAuthorizations = 0;
    if (!Array.isArray(S.cp.hist)) S.cp.hist = [];
    if (!Array.isArray(S.cp.log)) S.cp.log = [];
    ['minted', 'burned', 'circulation', 'retired', 'arbitrageBlocked', 'dayMint', 'dayBurn', 'welfareGiven', 'donated', 'sales', 'techSales', 'recipeFees', 'recipeAuthorizations'].forEach(k => { if (!Number.isFinite(S.cp[k])) S.cp[k] = 0; });
    if (!Number.isFinite(S.cp.price)) S.cp.price = 1;
    if (!Number.isFinite(S.cp.markup)) S.cp.markup = 1;
    return S.cp;
  };
  // ไม่เสกโอสถเข้าคลังตอนเริ่มเกม: สินค้าต้องมาจากการหลอม/การเดินทางจริง
  CPE.init = W => { CPE.S(W); W.npcs.forEach(n => { if (n.cp == null) n.cp = 40; }); };
  const note = (W, text) => { const c = CPE.S(W); c.log.push({ t: W.t, text }); if (c.log.length > 40) c.log.shift(); };
  CPE.mint = (W, n, amt, why, quiet) => { amt = Math.round(amt * 10) / 10; if (!(amt > 0)) return 0; const c = CPE.S(W); n.cp = (n.cp || 0) + amt; c.minted += amt; c.dayMint += amt; n.cpEarned = (n.cpEarned || 0) + amt; if (!quiet && amt >= 30) note(W, n.h.name.given + ' ได้ ' + Math.round(amt) + ' คป. (' + why + ')'); return amt; };
  CPE.spend = (W, n, amt, why) => { if (!Number.isFinite(amt) || amt < 0 || !Number.isFinite(n.cp || 0) || (n.cp || 0) < amt) return false; const c = CPE.S(W); n.cp -= amt; c.burned += amt; c.dayBurn += amt; if (amt >= 40) note(W, n.h.name.given + ' ใช้ ' + Math.round(amt) + ' คป. ' + why); return true; };
  CPE.retireNpc = (W, n, reason) => {
    if (!n || !(n.cp > 0)) return 0;
    const c = CPE.S(W);
    const amt = Math.round(n.cp * 10) / 10;
    c.retired = (c.retired || 0) + amt;
    n.cp = 0;
    if (amt >= 20) {
      note(W, (n.h && n.h.name && n.h.name.given || 'สมาชิก') + ' สิ้นสภาพ ปลดเกษียณแต้มคุณูปการ ' + amt + ' คป. (' + (reason || 'ออกจากสำนัก') + ')');
    }
    return amt;
  };

  /* ----- ความขาดแคลน/ราคา ----- */
  CPE.target = (W, id) => {
    const S = W.sect, w = (S.want && S.want[id]) || 0; let b = 4; const m = ECO.matById[id];
    if (m) b = m.tier <= 1 ? 16 : m.tier === 2 ? 9 : m.tier === 3 ? 5 : 3;
    if (BASIC_IDS.includes(id)) b = 12;
    else if (id.startsWith('P:BT_')) b = 1;
    else if (ECO.isPill(id)) { const info = ECO.pillInfo(id); b = !info ? 3 : info.tier <= 1 ? 8 : info.tier === 2 ? 5 : info.tier === 3 ? 3 : info.tier === 4 ? 2 : 1; }
    return Math.max(b, w);
  };
  CPE.scarcity = (W, id) => clamp((CPE.target(W, id) + 2) / (ECO.count(W, id) + 2), 0.5, 2.5);
  CPE.reward = (W, id, n, stockBefore) => {
    const tgt = CPE.target(W, id), stock = stockBefore == null ? ECO.count(W, id) : stockBefore;
    // Keep a small positive reward, but let severe oversupply reduce payout further.
    const sc = clamp((tgt + 2) / (stock + 2), 0.05, 2.5);
    return ECO.base(id) * 0.22 * sc * (n == null ? 1 : n);
  };
  const recipeByOutput = (() => { const m = {}; Object.keys(ECO.recipeById).forEach(k => { const r = ECO.recipeById[k]; if (r.outItemId) m[r.outItemId] = r; }); return m; })();
  CPE.priceOf = (W, id) => {
    const c = CPE.S(W); let base = ECO.base(id);
    const r = id.startsWith('P:') ? ECO.recipeById[id.slice(2)] : recipeByOutput[id];
    if (r) base = Math.max(base, ECO.inputCost(W, r) * 0.45 / (r.yield || 1));
    // ของขาดต้องแพงขึ้น ส่วนของล้นคลังต้องถูกลง — และราคาขายในร้านต้องสูงกว่าค่ารับบริจาคเสมอเพื่อป้องกัน arbitrage
    const raw = Math.round(base * 0.9 * c.price * c.markup * clamp(Math.pow(CPE.scarcity(W, id), 0.5), 0.8, 1.6));
    const minNoArb = Math.ceil(CPE.reward(W, id, 1) * 1.3) + 2;
    return Math.max(2, minNoArb, raw);
  };
  CPE.gearPrice = (W, it) => { const c = CPE.S(W); return Math.max(5, Math.round((it.value || 20 * Math.pow(1.9, (it.tier || 1) - 1)) * 0.9 * (it.q || 1) * clamp((it.dur == null ? 100 : it.dur) / 100, 0.3, 1) * c.price * c.markup)); };
  CPE.techFree = (W, t) => !t || CPE.S(W).freeLib.includes(t.id);
  CPE.techPrice = (W, t) => CPE.techFree(W, t) ? 0 : Math.round(28 * Math.pow(t.tier, 2.1) * CPE.S(W).price);
  CPE.techReward = (W, id) => { const t = CULT.tech(id); return t ? 28 * Math.pow(t.tier, 2.1) * 0.55 : 0; };
  CPE.donorValue = (W, out) => {
    const a = { total: 0, parts: [] };
    Object.keys(out.mats || {}).forEach(k => { const before = out.stockBefore && out.stockBefore[k]; const v = CPE.reward(W, k, out.mats[k], before); a.total += v; });
    Object.keys(out.pills || {}).forEach(k => { const before = out.stockBefore && out.stockBefore[k]; a.total += CPE.reward(W, k, out.pills[k], before); });
    (out.gear || []).forEach(gr => { a.total += CPE.gearPrice(W, gr) * 0.5; });
    (out.techs || []).forEach(id => { if (out.techsAccepted || !W.sect.library.includes(id)) a.total += CPE.techReward(W, id); });
    if (out.stones > 0) a.total += out.stones * 0.2;
    return a.total;
  };
  /* บริจาคจากคณะเดินทาง/สำรวจ: แบ่งแต้มตามบทบาท (หัวหน้า 1.3 เท่า) */
  const oHandover = X.handover;
  X.handover = (W, ex, alive, out) => {
    const accepted = oHandover(W, ex, alive, out) || out.donation || out;
    let total = 0; try { total = CPE.donorValue(W, accepted); } catch (e) { total = 0; }
    if (total > 0 && alive.length) {
      const wts = alive.map((m, i) => (i === 0 ? 1.3 : 1) * (0.7 + E(m, 'personality.loyalty') / 160)), ws = wts.reduce((s, x) => s + x, 0), c = CPE.S(W);
      alive.forEach((m, i) => { CPE.mint(W, m, total * wts[i] / ws, 'บริจาคของจากการเดินทาง', true); });
      c.donated += total; if (total >= 40) { note(W, 'คณะ ' + alive.map(m => m.h.name.given).join('、') + ' บริจาคของ รวม ' + Math.round(total) + ' คป.'); W.log('finance', 'คณะเดินทางบริจาคของเข้าคลังสำนัก ได้แต้มคุณูปการรวม ' + Math.round(total), alive.map(m => m.id)); }
    }
    return accepted;
  };

  /* ----- ค่าแรง: แปลงจากคุณงาม (merit) ที่ได้จากงานประจำ ----- */
  const WAGE_ACTS = { farm: 1, mine: 1, cook: 1, duty: 1, guard: 1, heal: 1, brew: 1, forge: 1, pray: 0.5, errand: 0.5 };
  Object.keys(WAGE_ACTS).forEach(id => {
    const a = A[id]; if (!a || !a.done) return; const od = a.done;
    a.done = function (n, W, ctx) {
      const m0 = n.merit || 0; const r = od.apply(this, arguments); const dm = (n.merit || 0) - m0;
      const got = id === 'farm' || id === 'mine' ? (ctx && ctx.got || 0) * 0.9 : 0;
      const pMod = CPE.S(W).price > 1.2 ? 1 / Math.pow(CPE.S(W).price, 0.5) : 1;
      CPE.mint(W, n, (Math.max(0, dm) * 1.3 + got * 0.3) * WAGE_ACTS[id] * pMod, 'ค่าแรง', true);
      return r;
    };
  });
  /* ----- สั่งเก็บสมุนไพรหุบเขา ----- */
  A.forage = {
    nameTh: 'เก็บสมุนไพรหุบเขา', icon: '🌿', color: '#6fbf73',
    can: (n, W) => n.h.state.energy > 35 && n.h.state.satiety > 30 && !(n.inj && n.inj.length) && !!W.map.byId.grove,
    score(n, W, S) {
      const herbs = ['MAT_HERB_DEW_GRASS_1', 'MAT_HERB_CINDER_LEAF_1', 'MAT_HERB_JADE_LOTUS_2'], sc = herbs.reduce((s, k) => s + CPE.scarcity(W, k), 0) / herbs.length;
      const rate = 6 * sc * (0.8 + (n.h.skills.herbalism || 0) / 120);
      S.add('เก็บสมุนไพรแลกคุณูปการ ≈' + Math.round(rate) + '/ชม. (ของ' + (sc > 1.3 ? 'ขาด' : sc < 0.8 ? 'ล้น' : 'พอดี') + ')', clamp(rate / 14, 0, 0.9) * (0.55 + CPE.drive(n) * 0.9));
      interestTerm(n, 'herbs', S, 0.5); S.add('ชอบท่องธรรมชาติ', (E(n, 'interests.exploring') - 50) / 220);
      if (n.rank >= 3) S.add('ผู้ใหญ่ไม่ต้องเก็บเอง', -0.5 - (n.rank - 3) * 0.3); if (n.rank === 0) S.add('งานของศิษย์ใหม่', 0.2 * AI.dutyWeight(n));
      if (n.h.state.energy < 50) S.add('เหนื่อย', -0.3); if (W.weather && ['storm', 'rain', 'snow'].includes(W.weather.kind)) S.add('อากาศไม่เป็นใจ', -0.5);
    },
    where: (W, n) => { const s = AI.freeStation(W, n, 'explore', 'grove'); return s ? { st: s } : null; },
    dur: n => 150 + Math.round(E(n, 'personality.discipline') * 0.5),
    start(n, W, ctx) { ctx.items = {}; ctx.cpValue = 0; return true; },
    tick(n, W, ctx) {
      n.h.state.energy = Math.max(0, n.h.state.energy - 0.06); n.h.state.rest -= 0.03; HC.practice(n, 'herbalism', 1 / 55, 1);
      if (W.t % 60 === 0) {
        const sk = n.h.skills.herbalism || 0, cnt = Math.max(1, Math.round((1.4 + sk / 55) * (0.7 + W.rng.next() * 0.6) * (W.season === 3 ? 0.6 : W.season === 0 ? 1.2 : 1)));
        for (let i = 0; i < cnt; i++) { const r = W.rng.next(); const tier = r < 0.02 + sk / 1500 ? 3 : r < 0.18 + sk / 400 ? 2 : 1; const pool = ECO.herbPool ? ECO.herbPool(tier) : null; const id = pool ? W.rng.pick(pool) : null; if (id) { ctx.cpValue += CPE.reward(W, id, 1); ECO.add(W, id, 1); ctx.items[id] = (ctx.items[id] || 0) + 1; } }
        HC.trainBody(n, 'endurance', 0.6); if (W.rng.chance(0.004 * (1 - E(n, 'intellect.perceptiveness') / 180))) AI.injure(W, n, 1, 'ถูกสัตว์ป่าทำร้ายในหุบเขา');
      }
      AI.vf(n, { sectDuty: 0.03, freedom: 0.02 }); if (n.h.state.energy < 12) return 'done';
    },
    done(n, W, ctx) { const v = ctx.cpValue || 0, c = Object.values(ctx.items || {}).reduce((s, x) => s + x, 0); n.merit += 0.3 + c * 0.03; CPE.mint(W, n, v, 'เก็บสมุนไพร ' + c + ' ต้น', true); CPE.S(W).donated += v; }
  };
  const HERB_POOL = { 1: ['MAT_HERB_DEW_GRASS_1', 'MAT_HERB_CINDER_LEAF_1'], 2: ['MAT_HERB_JADE_LOTUS_2', 'MAT_HERB_MIST_ORCHID_2'], 3: ['MAT_HERB_BLOOD_GINSENG_3', 'MAT_HERB_VENOM_VINE_3', 'MAT_HERB_MERIDIAN_FLOWER_3'] };
  ECO.herbPool = t => HERB_POOL[t] || HERB_POOL[1];
  CPE.drive = n => clamp((E(n, 'values.wealthResource') * 0.45 + E(n, 'personality.ambition') * 0.3 + E(n, 'personality.discipline') * 0.25) / 100, 0.1, 1);
  function interestTerm(n, id, S, w) { const v = (E(n, 'interests.' + id) - 50) / 100 * w; S.add('สนใจ' + id, v); }

  /* ----- หลอมโอสถพื้นฐานให้สำนัก (ทุกคนทำได้ สำนักออกวัตถุดิบ) ----- */
  function pickBasic(W, n) {
    let best = null, bs = -1e9; const sk = n.h.skills.ALCHEMY || 0;
    JD.CP.BASIC.forEach(r => {
      if (!ECO.inputsOk(W, r)) return; const key = 'P:' + r.id, have = ECO.count(W, key), tgt = CPE.target(W, key);
      let s = (tgt - have) / tgt; if (have >= tgt * 1.6) return; if (r.tier > 1 && sk + 25 < r.minMastery) return; s += W.rng.next() * 0.1 - r.tier * 0.05;
      if (s > bs) { bs = s; best = { r, short: s }; }
    });
    return best;
  }
  A.brewBasic = {
    nameTh: 'หลอมโอสถพื้นฐานให้สำนัก', icon: '🧪', color: '#8fd3c8',
    can: (n, W) => n.h.state.energy > 30 && n.h.state.satiety > 25 && !!pickBasic(W, n) && !(n.inj && n.inj.some(i => i.sev >= 2)),
    score(n, W, S) {
      const p = pickBasic(W, n); if (!p) return; const key = 'P:' + p.r.id, sc = CPE.scarcity(W, key);
      S.add('สำนักขาด' + ECO.name(key) + ' (คุณูปการ×' + sc.toFixed(1) + ')', clamp((sc - 0.7) * 0.6, 0, 0.9) * (0.6 + CPE.drive(n) * 0.7));
      interestTerm(n, 'alchemy', S, 0.8); S.add('ฝีมือปรุงโอสถ', (n.h.skills.ALCHEMY || 0) / 250); S.add('หน้าที่ต่อสำนัก', 0.2 * AI.dutyWeight(n));
      if (n.rank >= 4) S.add('ผู้ใหญ่ไม่ลงมือเอง', -0.35);
    },
    where(W, n) { const p = pickBasic(W, n); if (!p) return null; const s = AI.freeStation(W, n, 'cauldron', 'alchemy'); return s ? { st: s, rid: p.r.id } : null; },
    dur: (n) => Math.round(65 * (1 - 0.3 * (n.h.skills.ALCHEMY || 0) / 100)),
    start(n, W, ctx) { const r = ECO.recipeById[ctx.rid]; return !!r && ECO.reserveInputs(W, r, ctx, n); },
    tick(n, W) { n.h.state.energy = Math.max(0, n.h.state.energy - 0.04); n.h.state.rest -= 0.02; if (W.t % 45 === 0) HC.trainBody(n, 'dexterity', 0.5); AI.vf(n, { knowledgeCraft: 0.04, sectDuty: 0.03 }); },
    done(n, W, ctx) {
      const r = ECO.recipeById[ctx.rid]; if (!r) return;
      const key = r.outItemId || 'P:' + r.id, before = ECO.count(W, key), res = ECO.finishCraft(W, n, r, ctx); if (res.rejected) return;
      if (res.ok && res.key) { const sc = clamp((CPE.target(W, res.key) + 2) / (before + 2), 0.7, 2); const v = ECO.base(res.key) * res.n * 0.25 * res.q * sc; CPE.mint(W, n, v, 'หลอม ' + res.text, true); CPE.S(W).donated += v; n.merit += 0.8; W.sect.produced = (W.sect.produced || 0) + 1; if (W.rng.chance(0.06)) W.log('craft', n.h.name.given + ' หลอมโอสถพื้นฐานให้สำนัก: ' + res.text, [n.id]); }
      else { HC.feel(n, { mood: -3 }); }
    }
  };

  /* ----- บริจาคของที่สมาชิกเก็บไว้เอง (วัตถุดิบ / คัมภีร์วิชา / ม้วนตำรับ) -----
   * ของที่ถูกเก็บไว้ระหว่างเดินทางไม่หายไปจากเกม: เจ้าของตัดสินใจเองว่าจะนำกลับเข้าคลังเมื่อใด
   */
  const personalMats = n => Object.keys((n.inv && n.inv.mats) || {}).filter(k => (n.inv.mats[k] || 0) > 0);
  const personalTechs = (n, W) => Array.from(new Set((n.inv && n.inv.techs) || [])).filter(id => !!CULT.tech(id) && (!W || !W.sect.library.includes(id)));
  const personalRecipes = n => Array.from(new Set((n.inv && n.inv.recipes) || [])).filter(id => !!ECO.recipeById[id]);
  const personalDonateFrac = n => clamp(0.38 + E(n, 'personality.integrity') / 260 + E(n, 'personality.loyalty') / 360 - E(n, 'values.wealthResource') / 520, 0.25, 0.92);
  const hasDonatableMats = n => personalMats(n).some(k => (n.inv.mats[k] || 0) > 1 || personalDonateFrac(n) >= 0.68);
  A.donate = {
    nameTh: 'นำของส่วนตัวบริจาค', icon: '🎁', color: '#c6a4f5',
    can: (n, W) => (hasDonatableMats(n) || personalTechs(n, W).length > 0 || personalRecipes(n).length > 0) && n.h.state.energy > 15 && n.h.state.satiety > 15,
    score(n, W, S) {
      const ids = personalMats(n), techs = personalTechs(n, W), recipes = personalRecipes(n); if (!ids.length && !techs.length && !recipes.length) return;
      let value = 0, shortage = 0;
      ids.forEach(k => { const q = n.inv.mats[k] || 0, sc = CPE.scarcity(W, k); value += CPE.reward(W, k, q); shortage += Math.max(0, sc - 0.7); });
      techs.forEach(id => { value += CPE.techReward(W, id); });
      recipes.forEach(id => { if (!W.sect.knownRecipes.includes(id)) value += g.CONTENT && g.CONTENT.recipeReward ? g.CONTENT.recipeReward(W, id) : 12 * (ECO.recipeById[id].tier || 1); });
      S.add('อยากได้แต้มไว้แลกของ', clamp((150 - (n.cp || 0)) / 150, -0.2, 0.8) * 0.65);
      S.add('ซื่อสัตย์และภักดี', (E(n, 'personality.integrity') - 45) / 180 + (E(n, 'personality.loyalty') - 45) / 220);
      S.add('สำนักกำลังขาดวัตถุดิบ', ids.length ? clamp(shortage / ids.length, 0, 1) * 0.55 : 0);
      S.add('มูลค่าของที่ถือ', clamp(value / 90, 0, 0.55));
      S.add('หวงทรัพย์ส่วนตัว', -(E(n, 'values.wealthResource') - 50) / 190);
      if (n.act && n.act.id === 'donate') S.add('กำลังจัดการของอยู่', -0.8);
    },
    where: (W, n) => {
      const hasScroll = personalTechs(n, W).length > 0 || personalRecipes(n).length > 0;
      const st = (hasScroll ? AI.freeStation(W, n, 'read', 'scripture') : null) || AI.freeStation(W, n, 'browse', 'market') || AI.freeStation(W, n, 'desk', 'treasury');
      return st ? { st } : null;
    },
    dur: n => 25 + Math.round((100 - E(n, 'personality.integrity')) * 0.15),
    done(n, W) {
      const ids = personalMats(n), techs = personalTechs(n, W), recipes = personalRecipes(n); if (!ids.length && !techs.length && !recipes.length) return;
      const loyalty = E(n, 'personality.loyalty'), frac = personalDonateFrac(n);
      let total = 0, units = 0, scrolls = 0, formulas = 0, formulaCp = 0; const accepted = {};
      ids.forEach(k => {
        const held = n.inv.mats[k] || 0;
        const give = held <= 1 ? (frac >= 0.68 ? held : 0) : Math.min(held - 1, Math.max(1, Math.floor(held * frac)));
        if (give <= 0) return;
        const before = ECO.count(W, k), v = CPE.reward(W, k, give, before);
        ECO.add(W, k, give); n.inv.mats[k] -= give; if (n.inv.mats[k] <= 0) delete n.inv.mats[k];
        accepted[k] = give; total += v; units += give;
      });
      // คัมภีร์ที่สมาชิกตัดสินใจนำมาบริจาคจะเข้าหอทันที และให้แต้มตามระดับวิชา
      techs.forEach(id => {
        const t = CULT.tech(id);
        if (!t) return;
        if (!W.sect.library.includes(id)) { W.sect.library.push(id); total += CPE.techReward(W, id); scrolls++; }
        n.inv.techs = (n.inv.techs || []).filter(x => x !== id);
      });
      // ม้วนตำรับที่สมาชิกบริจาค: ตำรับใหม่ได้แต้ม ส่วนตำรับซ้ำได้ 0 คป.
      recipes.forEach(id => {
        if (g.CONTENT && g.CONTENT.donateRecipe) {
          const res = g.CONTENT.donateRecipe(W, n, id, { quiet: true });
          if (res && res.ok) { formulas++; formulaCp += res.reward || 0; }
        }
      });
      if (!units && !scrolls && !formulas) { HC.feel(n, { mood: -0.2 }); return; }
      if (total > 0) { CPE.mint(W, n, total, 'บริจาควัตถุดิบส่วนตัว', true); CPE.S(W).donated += total; }
      const grandTotal = total + formulaCp;
      const detail = Object.keys(accepted).slice(0, 3).map(k => ECO.name(k) + ' ×' + accepted[k]).join('、');
      const parts = []; if (units) parts.push('วัตถุดิบ ' + detail + (Object.keys(accepted).length > 3 ? ' และอื่น ๆ' : '')); if (scrolls) parts.push('คัมภีร์ ' + scrolls + ' เล่ม'); if (formulas) parts.push('ม้วนตำรับ ' + formulas + ' ม้วน');
      note(W, n.h.name.given + ' บริจาค' + parts.join(' + ') + ' ได้ ' + Math.round(grandTotal) + ' คป.');
      W.log('finance', n.h.name.given + ' นำของส่วนตัวกลับเข้าคลัง/หอคัมภีร์ แลก ' + Math.round(grandTotal) + ' คป.', [n.id]);
      HC.feel(n, { mood: 1 + loyalty / 100 }); AI.mem(W, n, 'บริจาคของส่วนตัวเข้าคลังสำนัก', 0.25);
    }
  };

  /* ----- ร้านค้าสำนัก ----- */
  CPE.shopItems = W => { const S = W.sect, out = []; Object.keys(S.stock).forEach(k => { if (ECO.isPill(k) && S.stock[k] > 0) out.push({ kind: 'pill', key: k, n: S.stock[k], price: CPE.priceOf(W, k) }); }); S.gear.forEach(gr => out.push({ kind: 'gear', gear: gr, price: CPE.gearPrice(W, gr) })); return out; };
  const effOf = k => { const i = ECO.pillInfo(k); return i ? i.effect : {}; };
  CPE.pickPurchase = (W, n) => {
    const cp = n.cp || 0, c = n.cult; if (cp < 4) return null;
    if (W.t > 0 && n._pickCache && n._pickCache.t === W.t && n._pickCache.cp === cp && n._pickCache.hp === n.h.state.hp && n._pickCache.gearLen === W.sect.gear.length) return n._pickCache.val;
    let best = null, bs = 0;
    const have = k => (n.inv.pills && n.inv.pills[k]) || 0;
    const consider = (it, s, why) => { if (it.price > cp * 0.9) return; s -= it.price / Math.max(40, cp) * 0.4; if (s > bs) { bs = s; best = Object.assign({ why, s }, it); } };
    Object.keys(W.sect.stock).forEach(k => {
      if (!ECO.isPill(k) || W.sect.stock[k] <= 0) return; const e = effOf(k), price = CPE.priceOf(W, k), it = { kind: 'pill', key: k, price };
      const info = ECO.pillInfo(k);
      if (BASIC_IDS.includes(k)) { const need = (e.healHealth && have(k) < 2 ? 0.7 : 0) + (e.healInjury && n.inj && n.inj.length ? 1.2 : 0) + (e.qiRestore && c && have(k) < 1 && n.rank >= 1 ? 0.35 : 0) + (e.clearHeartDemon && n.h.state.heartDemon > 25 ? 0.7 : 0) + (e.clearToxic && c && c.toxic > 20 ? 0.7 : 0) + (e.energyRestore && n.h.state.energy < 40 ? 0.4 : 0); if (need > 0 && have(k) < 3) consider(it, need * (1 - (E(n, 'personality.caution') < 30 ? 0.3 : 0)), 'สำรองไว้ใช้'); return; }
      if (!info || (e.compatiblePath && (!c || e.compatiblePath !== c.path))) return;
      const hpRatio = n.h.state.hp / Math.max(1, CULT.hpMax(n));
      if (e.healHealth && hpRatio < 0.72 && have(k) < 1) consider(it, 0.65 + (1 - hpRatio) * 1.5, 'โอสถรักษาระดับสูง');
      if (e.healInjury && n.inj && n.inj.length && have(k) < 1) consider(it, 1.1 + Math.min(0.8, n.inj.length * 0.2), 'รักษาบาดแผลหนัก');
      if (e.clearToxic && c && (c.toxic || 0) > 25 && have(k) < 1) consider(it, 0.8 + c.toxic / 100, 'ถอนพิษสะสม');
      if (e.clearHeartDemon && n.h.state.heartDemon > 32 && have(k) < 1) consider(it, 0.7 + n.h.state.heartDemon / 120, 'ระงับจิตมาร');
      if (e.insight && c && have(k) < 1 && (c.learning || E(n, 'personality.curiosity') > 65)) consider(it, 0.65 + E(n, 'personality.curiosity') / 250, 'เพิ่มความเข้าใจคัมภีร์');
      if (!c) return;
      if (e.btFor) { if (e.btFor.path === c.path && e.btFor.stage === c.stage && c.bn) consider(it, 3.5, 'โอสถทะลวงขั้น'); return; }
      if (e.cbBuff) return;
      if (e.cultivationProgress && info.tier <= c.stage + 1 && c.prog < CULT.threshold(n) * 0.85 && (c.toxic || 0) < (c.path === 'DEMON' ? 50 : 35)) consider(it, 0.5 + e.cultivationProgress / 160 + (E(n, 'personality.ambition') - 50) / 250, 'เร่งตบะ');
    });
    if (c) { ['WEAPON', 'ARMOR', 'ACCESSORY'].forEach(slot => { const cur = n.equip && n.equip[slot], cs = cur ? ST.gearScore(cur) : 0; W.sect.gear.forEach(gr => { if (gr.slot !== slot || (gr.minStage || 1) > c.stage + 1) return; const gs = ST.gearScore(gr); if (gs > cs * 1.2 + 8) consider({ kind: 'gear', gear: gr, price: CPE.gearPrice(W, gr) }, 0.6 + Math.min(1.2, (gs - cs) / Math.max(40, cs)) * 0.5, 'อุปกรณ์ที่ดีกว่า'); }); }); }
    if (W.t > 0) n._pickCache = { t: W.t, cp, hp: n.h.state.hp, gearLen: W.sect.gear.length, val: best };
    return best;
  };
  CPE.buy = (W, n, p) => {
    if (!p || !Number.isFinite(p.price) || p.price <= 0 || !['pill','gear'].includes(p.kind)) return false;
    const quote=p.kind==='pill'?CPE.priceOf(W,p.key):CPE.gearPrice(W,p.gear || {});
    if(p.price!==quote || (p.kind==='pill' && (!ECO.isPill(p.key) || !ECO.pillInfo(p.key)))) return false;
    const c = CPE.S(W);
    if (p.kind === 'pill') { const quality = ECO.pillQuality(W, p.key); if (!ECO.take(W, p.key, 1)) return false; if (!CPE.spend(W, n, p.price, 'ซื้อ' + ECO.name(p.key))) { ECO.add(W, p.key, 1, quality); return false; } ECO.addPersonalPill(n, p.key, quality); }
    else { const i = W.sect.gear.indexOf(p.gear); if (i < 0) return false; if (!CPE.spend(W, n, p.price, 'ซื้อ' + p.gear.nameTh)) return false; W.sect.gear.splice(i, 1); const cur = n.equip[p.gear.slot]; if (cur) W.sect.gear.push(cur); n.equip[p.gear.slot] = p.gear; ST.dirty(n); W.log('gear', n.h.name.given + ' แลกคุณูปการซื้อ「' + p.gear.nameTh + '」จากร้านสำนัก', [n.id]); }
    c.sales++; HC.feel(n, { mood: 1.5 }); AI.mem(W, n, 'ซื้อ' + (p.kind === 'pill' ? ECO.name(p.key) : p.gear.nameTh) + 'ด้วยแต้มคุณูปการ', 0.25); return true;
  };
  A.shop = {
    nameTh: 'ร้านค้าสำนัก', icon: '🛒', color: '#e0b84a',
    can: (n, W) => (n.cp || 0) >= 4 && !!CPE.pickPurchase(W, n),
    score(n, W, S) { const p = CPE.pickPurchase(W, n); if (!p) return S.add('ไม่มีของที่อยากได้', -3); S.add('อยากได้ ' + (p.kind === 'pill' ? ECO.name(p.key) : p.gear.nameTh) + ' (' + p.price + ' คป. · ' + p.why + ')', 0.55 + p.s * 0.35 + (E(n, 'values.wealthResource') - 50) / 300); },
    where: (W, n) => { const s = AI.freeStation(W, n, 'browse', 'market'); return s ? { st: s } : null; },
    dur: () => 25,
    done(n, W) { CPE.buy(W, n, CPE.pickPurchase(W, n)); }
  };
  AI.wantedPill = (W, n) => { const p = CPE.pickPurchase(W, n); return p && p.kind === 'pill' ? { key: p.key, price: p.price, name: ECO.name(p.key) } : null; };

  /* ----- บริการชี้แนะจากหอคัมภีร์: ใช้แต้มเป็นค่าครูและเผาออกจากระบบ ----- */
  CPE.guidanceTeacher = (W, n) => {
    const eligible = t => !!(t && t !== n && !t.dead && !t.away && !t.exiled && !(t.guidanceUntil > W.t) && (t.rank > n.rank || (t.cult && n.cult && t.cult.stage > n.cult.stage)));
    const head = SECT.holder(W, 'scripture'); if (eligible(head)) return head;
    const master = W.byId[W.sect.masterId]; if (eligible(master)) return master;
    return W.npcs.find(eligible) || null;
  };
  CPE.guidanceFee = (W, n) => {
    const learning = n && n.cult && n.cult.learning, t = learning && CULT.tech(learning.id);
    if (!t) return 0;
    return Math.max(1, Math.round((20 + 8 * Math.pow(t.tier || 1, 2)) * CPE.S(W).price));
  };
  A.guidedStudy = {
    nameTh: 'ขอคำชี้แนะจากอาจารย์', icon: '🧑‍🏫', color: '#b9a1f5',
    can(n, W) {
      if (!n.cult || !n.cult.learning || (n.insightT || 0) > 0) return false;
      const last = n.guidanceDay == null ? -999 : n.guidanceDay;
      return W.day - last >= 16 && !!CPE.guidanceTeacher(W, n) && (n.cp || 0) >= CPE.guidanceFee(W, n);
    },
    score(n, W, S) {
      const fee = CPE.guidanceFee(W, n), teacher = CPE.guidanceTeacher(W, n);
      S.add('วิชาที่เรียนยังไม่สำเร็จ', 0.65);
      S.add('ใฝ่รู้', (E(n, 'personality.curiosity') - 45) / 180);
      S.add('มีอาจารย์ที่เหมาะสม', teacher ? 0.25 + Math.min(0.25, (teacher.h.skills.SCRIPTURE || 0) / 300) : -1);
      S.add('เหลือแต้มพอจ่าย', clamp(((n.cp || 0) - fee) / Math.max(1, fee), 0, 3) * 0.22);
      S.add('หวงทรัพย์ไว้ซื้อของ', -(E(n, 'values.wealthResource') - 50) / 280);
    },
    where: (W, n) => { const st = AI.freeStation(W, n, 'read', 'scripture'); return st ? { st } : null; },
    dur: () => 30,
    start(n, W, ctx) {
      const teacher = CPE.guidanceTeacher(W, n), fee = CPE.guidanceFee(W, n);
      if (!teacher || !n.cult || !n.cult.learning || (n.insightT || 0) > 0 || W.day - (n.guidanceDay == null ? -999 : n.guidanceDay) < 16) return false;
      if (!CPE.spend(W, n, fee, 'ค่าชี้แนะจากหอคัมภีร์')) return false;
      ctx.teacherId = teacher.id; ctx.fee = fee; teacher.guidanceUntil = W.t + 36;
      const tier = (CULT.tech(n.cult.learning.id) || {}).tier || 1;
      ctx.rate = clamp(0.0035 + tier * 0.00045 + (teacher.h.skills.SCRIPTURE || 0) / 30000 + E(teacher, 'intellect.comprehension') / 50000, 0.004, 0.009);
      n.guidanceDay = W.day; n.insightT = 360;
      const c = CPE.S(W); c.studyFees = (c.studyFees || 0) + fee; c.studyServices = (c.studyServices || 0) + 1;
      return true;
    },
    tick(n, W, ctx) {
      const learning = n.cult && n.cult.learning;
      if (!learning) return 'done';
      learning.got = Math.min(learning.need, learning.got + learning.need * (ctx.rate || 0.005));
      HC.practice(n, 'SCRIPTURE', 1 / 30, 1.1);
      const teacher = W.byId[ctx.teacherId]; if (teacher && !teacher.dead) { HC.practice(teacher, 'SCRIPTURE', 1 / 60, 0.8); teacher.merit = (teacher.merit || 0) + 0.005; }
      n.h.state.energy = Math.max(10, n.h.state.energy - 0.012); n.h.state.rest = Math.max(10, n.h.state.rest - 0.006);
    },
    done(n, W, ctx) {
      const teacher = W.byId[ctx.teacherId];
      W.log('finance', n.h.name.given + ' จ่าย ' + Math.round(ctx.fee || 0) + ' คป. ขอคำชี้แนะจาก ' + (teacher ? teacher.h.name.given : 'หอคัมภีร์') + ' วิชาที่กำลังเรียนคืบหน้าและได้รับความกระจ่าง', [n.id].concat(teacher ? [teacher.id] : []));
      HC.feel(n, { mood: 1.2 });
    },
    inside: true
  };

  /* ----- บริการฝึกปราณเร่งด่วน: ใช้ทรัพยากร/ผู้ดูแลของสำนัก แลกกับความก้าวหน้าและเผาแต้ม ----- */
  CPE.trainingFee = (W, n) => n && n.cult ? Math.max(1, Math.round((18 + 7 * Math.pow(n.cult.stage || 1, 2)) * CPE.S(W).price)) : 0;
  A.paidTraining = {
    nameTh: 'ซื้อสิทธิ์ฝึกปราณเข้มข้น', icon: '✨', color: '#70c6f2',
    can(n, W) {
      if (!n.cult || n.dead || n.away || (n.inj && n.inj.some(i => i.sev >= 2)) || n.h.state.energy < 30 || n.h.state.satiety < 25) return false;
      if (n.cult.stage >= CULT.maxStage(n) || n.cult.prog >= CULT.threshold(n) * 0.88) return false;
      const last = n.paidTrainingDay == null ? -999 : n.paidTrainingDay;
      return W.day - last >= 14 && (n.cp || 0) >= CPE.trainingFee(W, n);
    },
    score(n, W, S) {
      const fee = CPE.trainingFee(W, n);
      S.add('อยากเร่งตบะ', 0.72 + (E(n, 'personality.ambition') - 50) / 170);
      S.add('ให้ความสำคัญกับวิถียุทธ์', (E(n, 'values.martialPeak') - 45) / 190);
      S.add('มีแต้มเหลือจ่าย', clamp(((n.cp || 0) - fee) / Math.max(1, fee), 0, 3) * 0.28);
      S.add('หวงแต้มไว้ซื้อของ', -(E(n, 'values.wealthResource') - 50) / 260);
      S.add('ฝึกปกติก็พอ', -Math.max(0, (n.cult.prog / Math.max(1, CULT.threshold(n))) - 0.65) * 0.8);
    },
    where(W, n) {
      const c = n.cult;
      const kind = (c.path === 'XIAN' || c.path === 'HEART_SOUL') ? 'meditate' : c.path === 'BODY' ? 'lift' : c.path === 'DEMON' ? 'explore' : 'worship';
      const hall = (c.path === 'XIAN' || c.path === 'HEART_SOUL') ? 'meditation_hall' : c.path === 'BODY' ? 'training_ground' : c.path === 'DEMON' ? 'ruin' : 'shrine';
      let st = AI.freeStation(W, n, kind, hall);
      if (!st && (c.path === 'DEMON' || c.path === 'HEART_SOUL')) st = AI.freeStation(W, n, 'meditate', 'meditation_hall') || AI.freeStation(W, n, 'dummy', 'training_ground');
      return st ? { st } : null;
    },
    dur: () => 90,
    start(n, W, ctx) {
      if (!A.paidTraining.can(n, W)) return false;
      const fee = CPE.trainingFee(W, n), threshold = CULT.threshold(n);
      if (!CPE.spend(W, n, fee, 'ซื้อสิทธิ์ฝึกปราณเข้มข้น')) return false;
      ctx.fee = fee; ctx.gain = Math.max(2, threshold * 0.04); ctx.perTick = ctx.gain / 90; ctx.gained = 0;
      n.paidTrainingDay = W.day;
      const c = CPE.S(W); c.trainingFees = (c.trainingFees || 0) + fee; c.trainingServices = (c.trainingServices || 0) + 1;
      return true;
    },
    tick(n, W, ctx) {
      if (!n.cult) return 'done';
      const before = n.cult.prog; CULT.gain(n, ctx.perTick || 0.1); ctx.gained += Math.max(0, n.cult.prog - before);
      n.h.state.energy = Math.max(10, n.h.state.energy - 0.018); n.h.state.rest = Math.max(10, n.h.state.rest - 0.012);
      if (W.t % 15 === 0) {
        if (n.cult.path === 'BODY') HC.practice(n, 'BODY_REFINING', 0.05, 1.1);
        else if (n.cult.path === 'DEMON') {
          HC.practice(n, n.cult.sub === 'VENOM_GU_SOVEREIGN' ? 'POISON' : 'SOUL_DIVINE', 0.05, 1.15);
          if (n.h.state.heartDemon < 55) n.h.state.heartDemon = Math.min(55, (n.h.state.heartDemon || 0) + 0.15);
        } else if (n.cult.path === 'HEART_SOUL') {
          HC.practice(n, 'SOUL_DIVINE', 0.05, 1.15);
          n.h.state.heartDemon = Math.max(0, (n.h.state.heartDemon || 0) - 0.35);
        } else HC.practice(n, 'SCRIPTURE', 0.05, 1.1);
      }
    },
    done(n, W, ctx) {
      W.log('finance', n.h.name.given + ' จ่าย ' + Math.round(ctx.fee || 0) + ' คป. ซื้อสิทธิ์ฝึกปราณเข้มข้น ตบะเพิ่ม ' + Math.round(ctx.gained || 0), [n.id]);
      HC.feel(n, { mood: 1.0 });
    }
  };

  /* ----- เรียนวิชา: วิชาพื้นฐานเรียนฟรี วิชาอื่นใช้แต้ม (เผาออกจากระบบ) ----- */
  AI.nextTechToStudy = (W, n) => {
    const c = n.cult; if (!c) return null; const cap = Math.min(c.stage, SECT.canLearnTier(W, n));
    let ids = CULT.learnable(n, W.sect.library).map(id => CULT.tech(id)).filter(t => (t.reqTier || t.tier) <= cap);
    ids = ids.filter(t => CPE.techPrice(W, t) <= (n.cp || 0)); if (!ids.length) return null;
    const goal=n.cognition?.goal; if(goal?.id==='scripture'){const desired=ids.find(t=>t.id===goal.targetId);if(desired)return desired;}
    ids.sort((a,b)=>g.COG?g.COG.techPreference(n,b)-g.COG.techPreference(n,a):b.power-a.power); return ids[0];
  };
  const SA = A.study, oStart = SA.start;
  SA.start = function (n, W, ctx) {
    const c = n.cult;
    if (c && !c.learning) {
      const t = AI.nextTechToStudy(W, n);
      if (t) {
        const price = CPE.techPrice(W, t);
        if (price > 0 && !CPE.spend(W, n, price, 'เรียนวิชา「' + t.nameTh + '」')) return false;
        if (price > 0) CPE.S(W).techSales += price;
        c.learning = { id: t.id, need: CULT.studyCost(t), got: 0 };
        return true;
      }
    }
    return oStart.apply(this, arguments);
  };

  /* ----- โอสถฟื้นฟู: ผลเพิ่มเติม + การใช้ + สวัสดิการ ----- */
  const oApplyPill = ECO.applyPill;
  ECO.applyPill = (W, npc, key) => {
    const r = oApplyPill(W, npc, key); if (!r) return r; const e = r.info.effect, s = npc.h.state;
    if (e.qiRestore && npc.cult) { const q = CULT.qiMax(npc); s.qi = Math.min(q, (s.qi == null ? 0 : s.qi) + q * e.qiRestore); r.msgs.push('ฟื้นปราณ'); }
    if (e.energyRestore) { s.energy = Math.min(100, s.energy + e.energyRestore); r.msgs.push('คลายเหนื่อย'); } if (e.restRestore) s.rest = Math.min(100, s.rest + e.restRestore);
    return r;
  };
  const consume = (W, n, key) => {
    const q = (n.inv.pillQuality && n.inv.pillQuality[key]) || 1;
    n.inv.pills[key]--;
    if (n.inv.pills[key] <= 0) {
      delete n.inv.pills[key];
      if (n.inv.pillQuality) delete n.inv.pillQuality[key];
    }
    const res = ECO.applyQualityPill(W, n, key, q);
    if (res && (W.t + (n.n || 0)) % 2 === 0) {
      W.log('train', n.h.name.given + ' ใช้โอสถ「' + ECO.name(key) + '」เพื่อรักษาฟื้นฟูร่างกาย', [n.id]);
    }
    return res;
  };
  const firstOf = (n, list) => list.find(k => n.inv && n.inv.pills && n.inv.pills[k] > 0);
  CPE.consumeCrafted = (W, n, p) => {
    const list = n.inv && n.inv.craftedPills, i = list && list.indexOf(p);
    if (i == null || i < 0 || p.intent !== 'keep' || !(p.qty > 0)) return null;
    const result = ECO.applyQualityPill(W, n, p.key, p.q);
    if (!result) return null;
    if (--p.qty <= 0) list.splice(i, 1);
    W.log('train', n.h.name.given + ' ใช้โอสถที่ตนปรุง「' + ECO.name(p.key) + '」เพื่อหนุนการบำเพ็ญ', [n.id]);
    return result;
  };
  function pickCrafted(n, effect) { return (n.inv && n.inv.craftedPills || []).find(p => p.intent === 'keep' && p.qty > 0 && ECO.pillInfo(p.key)?.effect[effect]); }
  CPE.autoUse = (W, n) => {
    if (n.dead || !n.inv || (n.act && n.act.id === 'fight')) return;
    if (!(n.inv.craftedPills && n.inv.craftedPills.length) && !(n.inv.pills && Object.keys(n.inv.pills).length)) return;
    const s = n.h.state, R = JD.CP.RECOVERY, hm = CULT.hpMax(n);
    const owned = s.hp < hm * 0.5 && pickCrafted(n, 'healHealth') || n.cult && n.cult.toxic > 40 && pickCrafted(n, 'clearToxic') || s.heartDemon > 45 && pickCrafted(n, 'clearHeartDemon') || s.energy < 18 && pickCrafted(n, 'energyRestore');
    if (owned) return CPE.consumeCrafted(W, n, owned);
    if (!n.inv.pills || !Object.keys(n.inv.pills).length) return;
    let k;
    if (n.inj && n.inj.length && (k = firstOf(n, R.wound))) return consume(W, n, k);
    if (s.hp < hm * 0.5 && (k = firstOf(n, R.hp))) return consume(W, n, k);
    if (s.heartDemon > (n.cult && n.cult.path === 'DEMON' ? 62 : 45) && (k = firstOf(n, R.calm))) return consume(W, n, k);
    if (n.cult && n.cult.toxic > (n.cult.path === 'DEMON' ? 56 : 40) && (k = firstOf(n, R.detox))) return consume(W, n, k);
    if (s.energy < 18 && (k = firstOf(n, R.vigor))) return consume(W, n, k);
  };
  CPE.fightUse = (W, n, ctx) => {
    if (!n.inv || (ctx.pillAt || 0) > W.t) return false; const s = n.h.state, R = JD.CP.RECOVERY; let k;
    const owned = s.hp < CULT.hpMax(n) * 0.38 && pickCrafted(n, 'healHealth') || n.cult && s.qi != null && s.qi < CULT.qiMax(n) * 0.2 && pickCrafted(n, 'qiRestore');
    if (owned && CPE.consumeCrafted(W, n, owned)) { ctx.pillAt = W.t + 6; n.fx = {t:W.t,text:'💊'}; return true; }
    if (!n.inv.pills) return false;
    if (s.hp < CULT.hpMax(n) * 0.38 && (k = firstOf(n, R.hp))) { ctx.pillAt = W.t + 6; consume(W, n, k); n.fx = { t: W.t, text: '💊' }; return true; }
    if (n.cult && s.qi != null && s.qi < CULT.qiMax(n) * 0.2 && (k = firstOf(n, R.qi))) { ctx.pillAt = W.t + 6; consume(W, n, k); n.fx = { t: W.t, text: '💊' }; return true; }
    return false;
  };
  // Only the master, treasury elder, or an explicitly recorded acting officer
  // may make allocations. Temporary absences never permanently change posts.
  CPE.welfareOfficer = W => {
    const S = W.sect, available = n => !!n && !n.dead && !n.away && !n.exiled && !n.sealed && !n.sealedBt && !(n.jail > W.t);
    const elder = SECT.holder(W, 'treasury'), master = W.byId[S.masterId], deputy = W.byId[S.deputyId];
    const eligible = W.npcs.filter(n => available(n) && n.rank >= 1);
    const best = list => list.sort((a,b) => SECT.relevance('treasury', b) - SECT.relevance('treasury', a) || a.id.localeCompare(b.id))[0];
    let officer, role, acting = false;
    if (available(elder)) { officer = elder; role = 'treasury'; }
    else if (elder && (officer = best(eligible.filter(n => n.assist === 'treasury')))) { role = 'acting_treasury'; acting = true; }
    else if (available(master)) { officer = master; role = 'master'; }
    else if (available(deputy)) { officer = deputy; role = 'acting_master'; acting = true; }
    else if ((officer = best(eligible.filter(n => n.assist === 'treasury')) || best(eligible))) { role = 'acting_treasury'; acting = true; }
    else { role = 'unavailable'; acting = false; }
    const id = officer ? officer.id : null, previous = S.welfareAuthority;
    if (!previous || previous.id !== id || previous.role !== role) {
      S.welfareAuthority = { id, role, acting, since: W.day };
      if (officer) W.log('appoint', officer.h.name.given + (acting ? ' รับหน้าที่รักษาการดูแลการแจกจ่ายโอสถ' : ' รับผิดชอบการแจกจ่ายโอสถ'), [id]);
      else if (previous && previous.id) W.log('appoint', 'ไม่มีผู้มีสิทธิ์ดูแลการแจกจ่ายโอสถชั่วคราว', []);
    }
    return officer || null;
  };
  CPE.welfareDaily = W => {
    if (g.SECT && g.SECT.ensureDirectives) g.SECT.ensureDirectives(W);
    const S = W.sect, c = CPE.S(W), tr = CPE.welfareOfficer(W), R = JD.CP.RECOVERY;
    if (!tr) return;
    const mer = S.policy.meritocracy / 100;
    const trIntegrity = E(tr, 'personality.integrity');
    const trEmpathy = E(tr, 'personality.empathy');
    const gen = clamp((trEmpathy * 0.45 + E(tr, 'social.hospitality') * 0.2 + (100 - E(tr, 'values.wealthResource')) * 0.2 + S.policy.generosity * 0.15) / 100, 0.05, 0.95);
    c.welfare = Math.round(gen * 100) / 100;
    c.markup = Math.round(clamp(0.85 + (E(tr, 'values.wealthResource') - 50) / 150 + (50 - S.policy.generosity) / 300, 0.75, 1.4) * 100) / 100;

    const rd = S.reserveDirectives && S.reserveDirectives.medicine;
    const reserveFor = k => (rd && rd[k] != null ? rd[k] : (gen < 0.4 ? 3 : 1));

    let given = 0;
    const recipients = [];
    const passedOver = [];

    const give = (n, list, needScore, relScore) => {
      // PREMIUM PILL PROTECTION: Welfare strictly distributes basic recovery medicines only.
      const k = list.find(x => BASIC_IDS.includes(x) && ECO.count(W, x) > reserveFor(x));
      if (!k) return false;
      n.inv.pills = n.inv.pills || {};
      if (n.inv.pills[k] >= 2) return false;
      const quality = ECO.pillQuality(W, k); ECO.take(W, k, 1);
      ECO.addPersonalPill(n, k, quality);
      given++;
      recipients.push({ id: n.id, name: n.h.name.given, item: k, needScore: Math.round(needScore), biasScore: Math.round(relScore) });
      return true;
    };

    const candidates = W.npcs.filter(n => !n.dead && !n.away && !n.exiled);
    const evaluated = candidates.map(n => {
      const s = n.h.state, hm = CULT.hpMax(n), needs = [];
      let needScore = 0;
      if (n.inj && n.inj.length) {
        needs.push(R.wound);
        needScore += n.inj.reduce((acc, i) => acc + (i.sev || 1) * 22, 15);
      }
      if (s.hp < hm * 0.7) {
        needs.push(R.hp);
        needScore += Math.max(0, (1 - s.hp / hm)) * 50;
      }
      if (s.heartDemon > 35) {
        needs.push(R.calm);
        needScore += Math.max(0, s.heartDemon - 30) * 1.0;
      }
      if (n.cult && n.cult.toxic > 30) {
        needs.push(R.detox);
        needScore += Math.max(0, n.cult.toxic - 25) * 1.0;
      }
      if (s.energy < 25) {
        needs.push(R.vigor);
        needScore += Math.max(0, 30 - s.energy) * 0.4;
      }
      const meritBonus = n.rank * 4 + Math.min(20, (n.merit || 0) * 0.15);
      const relScore = SECT.relationScore(tr, n);
      const effectiveMerit = clamp(mer * (0.55 + trIntegrity / 220), 0.05, 0.95);
      const decisionScore = (needScore + meritBonus) * effectiveMerit + (relScore * 1.2) * (1 - effectiveMerit);
      return { n, needs, needScore, relScore, decisionScore, meritBonus };
    });

    const needy = evaluated.filter(e => e.needs.length > 0);
    needy.sort((a, b) => b.decisionScore - a.decisionScore);

    needy.forEach(item => {
      const { n, needs, needScore, relScore } = item;
      const p = clamp(0.15 + gen * 0.75 + (relScore / 250) * (1 - mer) - (n.rank === 0 ? 0.08 * (1 - gen) : 0), 0.05, 0.98);
      let received = false;
      if (W.rng.next() < p) {
        received = needs.some(l => give(n, l, needScore, relScore));
      }
      if (!received && needScore > 25) {
        passedOver.push(item);
      }
    });

    if (W.day % 30 === 15 && gen > 0.45) {
      W.npcs.forEach(n => {
        if (!n.dead && !n.away && n.cult && n.rank >= 1 && ECO.count(W, 'P:BASIC_HP') > W.npcs.length * 0.5 + reserveFor('P:BASIC_HP')) {
          give(n, R.hp, 10, SECT.relationScore(tr, n));
        }
      });
    }

    // Reaction and resentment check:
    const biasedRecipients = recipients.filter(r => r.biasScore > 20 && r.needScore < 30);
    if (biasedRecipients.length > 0 && passedOver.length > 0 && mer < 0.55) {
      passedOver.forEach(p => {
        if (p.needScore >= 35 || p.n.merit > 20) {
          p.n.sat = Math.max(0, (p.n.sat || 60) - 3);
          HC.feel(p.n, { mood: -2 });
          const rel = SECT.rel(p.n, tr.id);
          rel.a = Math.max(-100, rel.a - 4);
          HC.experience(p.n, 'unfair_treatment', 0.4);
          if (W.rng.chance(0.35)) {
            W.log('finance', p.n.h.name.given + ' มีอาการบาดเจ็บหนักแต่ไม่ได้รับโอสถสวัสดิการ ขณะที่คนสนิทของผู้ดูแลคลังได้รับแทน เกิดความไม่พอใจ', [p.n.id, tr.id]);
          }
        }
      });
    } else if (mer > 0.7 && passedOver.length === 0 && recipients.length > 0) {
      needy.forEach(item => {
        if (E(item.n, 'personality.integrity') > 60) {
          item.n.sat = Math.min(100, (item.n.sat || 60) + 0.5);
        }
      });
    }

    if (recipients.length || passedOver.length) {
      S.welfareHistory.unshift({
        day: W.day,
        treasurerId: tr.id,
        treasurerName: tr.h.name.given,
        acting: S.welfareAuthority.acting,
        authorityRole: S.welfareAuthority.role,
        meritocracy: Math.round(mer * 100),
        given,
        recipients,
        passedOverCount: passedOver.length
      });
      if (S.welfareHistory.length > 30) S.welfareHistory.pop();
      if (given > 0 && W.rng.chance(0.4)) {
        W.log('economy', 'หอคลังแจกจ่ายโอสถสวัสดิการพื้นฐานให้แก่สมาชิก ' + given + ' คน', recipients.slice(0, 3).map(r => r.id));
      }
    }

    if (given) {
      c.welfareGiven += given;
      if (given >= 3 || W.rng.chance(0.3)) {
        const biasDesc = mer < 0.4 ? ' (เอนเอียงตามความสนิท)' : mer > 0.75 ? ' (ยึดความจำเป็นและความชอบธรรม)' : '';
        W.log('finance', 'ผู้ดูแลคลัง ' + tr.h.name.given + ' แจกโอสถสวัสดิการ ' + given + ' เม็ด' + biasDesc + ' (นิสัย' + (gen > 0.65 ? 'ใจกว้าง' : gen < 0.35 ? 'หวงของ' : 'พอประมาณ') + ')', [tr.id]);
      }
    }
  };
  /* ----- รายวัน/รายเดือน ----- */
  CPE.daily = W => {
    const S = W.sect, c = CPE.S(W); if (S.library && !c.freeLib) c.freeLib = S.library.filter(id => { const t = CULT.tech(id); return t && t.tier <= 1; });
    W.npcs.forEach(n => {
      if (n.cp == null) n.cp = 20;
      if (n.inv && n.inv.techs) n.inv.techs = n.inv.techs.filter(id => CULT.tech(id) && !S.library.includes(id));
      if (n.inv && n.inv.recipes) n.inv.recipes = n.inv.recipes.filter(id => !!ECO.recipeById[id]);
    });
    CPE.welfareDaily(W);
    const al = W.npcs.filter(n => !n.dead && !n.exiled);
    const baseTgt = 175 + al.reduce((s, n) => s + n.rank * 16 + (n.cult ? n.cult.stage * 20 : 0), 0) / Math.max(1, al.length);
    const tgt = baseTgt * Math.pow(Math.max(0.6, c.price || 1), 0.65);
    // ดัชนีใช้ค่าเฉลี่ยต่อหัวแบบจำกัดเพดาน: สะท้อนกำลังซื้อจริงตามระดับตบะและราคาปัจจุบัน
    const cap = tgt * 4, balances = al.map(n => clamp(n.cp || 0, 0, cap));
    const avg = balances.length ? balances.reduce((s, v) => s + v, 0) / balances.length : 0;
    const median = balances.length ? balances.slice().sort((a, b) => a - b)[balances.length >> 1] : 0;
    if (avg > tgt * 1.25) c.price = Math.min(4, c.price * 1.004);
    else if (avg < tgt * 0.78) c.price = Math.max(0.6, c.price / 1.0045);
    c.circulation = Math.round(al.reduce((s, n) => s + (n.cp || 0), 0) * 10) / 10;
    c.hist.push({ d: W.day, avg: Math.round(avg), median: Math.round(median), price: Math.round(c.price * 100) / 100, mint: Math.round(c.dayMint), burn: Math.round(c.dayBurn), circulation: c.circulation, retired: Math.round(c.retired || 0) }); if (c.hist.length > 60) c.hist.shift();
    c.dayMint = 0; c.dayBurn = 0;
  };
  const oPay = SECT.paySalaries;
  SECT.paySalaries = W => {
    const paid = oPay(W), pay = [0, 6, 12, 24, 42, 65, 90];
    const pMod = CPE.S(W).price > 1.2 ? 1 / Math.pow(CPE.S(W).price, 0.5) : 1;
    W.npcs.forEach(n => { if (n.dead || n.exiled) return; CPE.mint(W, n, (pay[n.rank] || 10) * (n.post ? 1.25 : 1) * (0.9 + W.sect.policy.generosity / 500) * pMod, 'เบี้ยหวัดคุณูปการ', true); });
    return paid;
  };
  // Individual artisans use their own ingredients first and pay for any missing stock.
  function personalCraftChoice(W, n) {
    if (!n.inv || !n.cult || n.dead || n.away || n.h.state.energy < 20) return null;
    if ((n.inv.craftedPills || []).length >= 3 || (!(n.inv.recipes && n.inv.recipes.length) && !(n.recipes && n.recipes.length))) return null;
    const ids = Array.from(new Set([...(n.inv.recipes || []), ...(n.recipes || [])]));
    let best = null;
    for (const id of ids) {
      const r = ECO.recipeById[id]; if (!r || r.craft !== 'ALCHEMY' || r.outType !== 'PILL') continue;
      const quote = ECO.personalCraftQuote(W, n, r); if (!quote || !quote.owned.length) continue;
      const key = r.outItemId || 'P:' + r.id, info = ECO.pillInfo(key); if (!info) continue;
      const need = n.h.state.hp < CULT.hpMax(n) * 0.75 && info.effect.healHealth || n.cult.toxic > 25 && info.effect.clearToxic || n.h.state.heartDemon > 30 && info.effect.clearHeartDemon;
      const intent = need ? 'keep' : 'donate';
      const value = Math.min(CPE.reward(W, key, r.yield || 1), quote.cost + quote.ownValue * 1.2);
      if (!need && value <= quote.cost) continue;
      const score = need ? 1.8 : 0.8 + Math.min(0.9, (value - quote.cost) / 40);
      const preference=n.cognition?.goal?.id==='craft'&&n.cognition.goal.targetId===r.id?.toString()?0.6:0;
      if (!best || score+preference > best.score) best = { r, intent, score:score+preference };
    }
    return best;
  }
  A.personalBrew = {
    nameTh: 'ปรุงโอสถส่วนตัว', icon: '⚗️', color: '#8ad7ae',
    can: (n, W) => !!personalCraftChoice(W, n),
    score(n, W, S) { const c = personalCraftChoice(W,n); if (c) S.add('ผลิตโอสถจากวัตถุดิบส่วนตัว', c.score); },
    where(W,n) { const c = personalCraftChoice(W,n), st = c && AI.freeStation(W,n,'cauldron','alchemy'); return st ? { st, rid:c.r.id, intent:c.intent } : null; },
    start(n,W,ctx) { return !!ECO.personalCraftQuote(W,n,ECO.recipeById[ctx.rid]); },
    dur(n,W,ctx) { const r=ECO.recipeById[ctx.rid]; return r ? Math.round(ECO.craftHours(r,n.h.skills.ALCHEMY||0)*60) : 0; },
    tick(n) { n.h.state.energy=Math.max(0,n.h.state.energy-0.04); },
    done(n,W,ctx) { const out=ECO.personalCraft(W,n,ECO.recipeById[ctx.rid],ctx.intent); if(out.ok) {n.stats=n.stats||{};n.stats.crafted=(n.stats.crafted||0)+1;} if(out.ok) W.log('craft',n.h.name.given+' ปรุงโอสถส่วนตัวสำเร็จ (คุณภาพ '+Math.round(out.product.q*100)+'%)',[n.id]); }
  };
  A.personalPillDonation = {
    nameTh:'บริจาคโอสถส่วนตัว',icon:'🎁',color:'#c6a4f5',
    can:n => !!(n.inv && (n.inv.craftedPills||[]).some(p=>p.intent==='donate')),
    score(n,W,S) { S.add('นำโอสถที่ผลิตไปบริจาค',1.8); },
    where(W,n) { const st=AI.freeStation(W,n,'browse','market') || AI.freeStation(W,n,'desk','treasury'); return st ? {st} : null; },
    dur:()=>20,
    done(n,W) { for (const p of [...(n.inv.craftedPills||[])]) if(p.intent==='donate') { const result=ECO.donatePersonalProduct(W,n,p.id); if(result.ok) W.log('finance',n.h.name.given+' บริจาคโอสถส่วนตัว ได้ '+Math.round(result.reward)+' คป.',[n.id]); } }
  };
  A.personalPillUse = {
    nameTh:'ใช้โอสถส่วนตัว',icon:'💊',color:'#7fd1b9',
    can(n) { return !!(n.inv && (n.inv.craftedPills||[]).some(p=>p.intent==='keep' && ECO.pillInfo(p.key)?.effect.healHealth) && n.h.state.hp < CULT.hpMax(n)*0.8); },
    score(n,W,S) { S.add('บาดเจ็บและมีโอสถส่วนตัว',2.4); },
    where(W,n) { return {pos:{x:n.x,y:n.y}}; },dur:()=>1,
    done(n,W) { const list=n.inv.craftedPills||[], i=list.findIndex(p=>p.intent==='keep' && ECO.pillInfo(p.key)?.effect.healHealth); if(i<0)return; CPE.consumeCrafted(W,n,list[i]); }
  };
  g.CPE = CPE;
  if (typeof module === 'object' && module.exports) module.exports = CPE;
})(typeof globalThis !== 'undefined' ? globalThis : this);
