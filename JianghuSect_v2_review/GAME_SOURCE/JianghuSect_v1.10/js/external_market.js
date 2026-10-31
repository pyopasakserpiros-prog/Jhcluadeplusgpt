/* external_market.js — direct trade between the sect, its members, and visiting merchants.
 * Contribution points remain an internal sect currency. Every outside transaction settles in spirit stones. */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, CULT = g.CULT, ECO = g.ECO, JD = g.JD, AI = g.AI, SECT = g.SECT;
  const clamp = U.clamp, E = (n, p) => HC.eff(n, p);
  const EXT = { VERSION: 1 };
  const BASIC_PILLS = new Set((JD.CP.BASIC || []).map(r => 'P:' + r.id));
  const TRADER_NAMES = {
    general: ['หลี่กวง', 'หานจื่อ', 'ซ่งเหอ', 'เฉินอวี้', 'หลัวชิง'],
    medicine: ['หมอพเนจรอู๋', 'เซียนโอสถหลิน', 'เถ้าแก่ยาเจียง', 'ผู้อาวุโสยาเร้นลับหวัง'],
    caravan: ['หัวหน้าคาราวานกัว', 'พ่อค้าหยาง', 'ผู้คุมเกวียนจ้าว', 'นายวาณิชเจ็ดสมบัติเฉียน'],
    rare: ['นายหน้าหอประมูลจิน', 'พ่อค้าสมบัติเร้นลับมู่', 'ยอดวาณิชแดนไกลไป๋']
  };
  const TRADER_TYPES = ['general', 'medicine', 'caravan', 'rare'];

  EXT.ensure = W => {
    if (!W.world) W.world = { sects: [], expeds: [], seq: 0, visitors: [] };
    if (!Array.isArray(W.world.visitors)) W.world.visitors = [];
    if (!Array.isArray(W.world.tradeHistory)) W.world.tradeHistory = [];
    if (!W.world.marketStats || typeof W.world.marketStats !== 'object') W.world.marketStats = {};
    const s = W.world.marketStats;
    ['visits', 'sectBought', 'sectSold', 'memberBought', 'memberSold', 'sectStonesIn', 'sectStonesOut', 'memberStonesIn', 'memberStonesOut', 'seq'].forEach(k => { if (!Number.isFinite(s[k]) || s[k] < 0) s[k] = 0; });
    return s;
  };

  EXT.isTradable = id => {
    if (id === 'grain' || id === 'meal') return true;
    if (ECO.isPill(id)) return !!ECO.pillInfo(id);
    const m = ECO.matById[id];
    return !!m;
  };
  EXT.activeVisitors = W => {
    const visitors = W && W.world && Array.isArray(W.world.visitors) ? W.world.visitors : [];
    return visitors.filter(v => v && v.kind === 'trader' && Number.isFinite(v.untilDay) && v.untilDay >= W.day && Number.isFinite(v.stones) && v.stones >= 0);
  };
  EXT.quotePrice = (W, id, side, skill) => {
    if (!EXT.isTradable(id)) return 0;
    const base = ECO.price(W, id);
    if (!Number.isFinite(base) || base <= 0) return 0;
    skill = clamp(Number.isFinite(skill) ? skill : 40, 0, 100);
    let mult = 1;
    if (side === 'sect-buy') mult = 1.15 - skill / 850;          // sect buys at a modest premium
    else if (side === 'sect-sell') mult = 0.78 + skill / 900;   // sect sells below retail
    else if (side === 'member-buy') mult = 1.18;
    else if (side === 'member-sell') mult = 0.76;
    return Math.max(1, Math.round(base * clamp(mult, 0.65, 1.2)));
  };

  function pickMaterial(W, excluded, maxTier) {
    const pool = Object.values(ECO.matById).filter(m => EXT.isTradable(m.id) && !excluded.has(m.id) && (maxTier == null || (m.tier || 1) <= maxTier));
    return pool.length ? W.rng.pick(pool).id : null;
  }
  function addStock(W, stock, id, min, max) {
    if (!id || !EXT.isTradable(id)) return;
    const q = W.rng.int(min, max);
    stock[id] = (stock[id] || 0) + q;
  }
  function buildStock(W, subtype) {
    const stock = {}, used = new Set();
    // First preference: items the treasury has explicitly requested.
    (W.sect.buyList || []).slice(0, 3).forEach(b => {
      if (!b || !EXT.isTradable(b.id) || used.has(b.id) || !W.rng.chance(0.78)) return;
      addStock(W, stock, b.id, 2, Math.max(3, Math.min(12, Math.ceil(b.n || 4)))); used.add(b.id);
    });
    if (!used.has('grain')) { addStock(W, stock, 'grain', 12, 34); used.add('grain'); }
    if (W.rng.chance(0.42) && !used.has('meal')) { addStock(W, stock, 'meal', 6, 18); used.add('meal'); }
    const maxT = subtype === 'rare' ? 6 : subtype === 'caravan' ? 4 : 3;
    while (used.size < 4) {
      const id = pickMaterial(W, used, maxT); if (!id) break;
      addStock(W, stock, id, 2, 7); used.add(id);
    }
    if (subtype === 'medicine' || subtype === 'rare' || W.rng.chance(0.35)) {
      const pills = Object.keys(ECO.recipeById || {})
        .map(rid => 'P:' + rid)
        .filter(k => EXT.isTradable(k) && (subtype !== 'general' || BASIC_PILLS.has(k)));
      if (pills.length) { const id = W.rng.pick(pills); addStock(W, stock, id, 1, subtype === 'medicine' ? 4 : 2); }
    }
    return stock;
  }
  function buildWants(W, stock, subtype) {
    const wants = {}, used = new Set(Object.keys(stock));
    // Traders seek materials and remedies that the sect has in surplus above reserve floor
    const surplus = Object.keys(W.sect.stock || {}).filter(id => {
      if (!EXT.isTradable(id) || BASIC_PILLS.has(id) || used.has(id)) return false;
      const count = ECO.count(W, id);
      const res = EXT.reserveForSect(W, id);
      if (count <= res + 1) return false;
      if (subtype === 'general') {
        const m = ECO.matById[id];
        if (m && (m.tier || 1) > 3) return false;
      }
      return true;
    });
    surplus.sort((a, b) => (ECO.count(W, b) - EXT.reserveForSect(W, b)) - (ECO.count(W, a) - EXT.reserveForSect(W, a)));
    surplus.slice(0, 3).forEach(id => {
      const m = ECO.matById[id];
      const tier = m ? m.tier || 1 : 2;
      const maxWant = tier >= 5 ? 2 : tier >= 3 ? 4 : 7;
      wants[id] = W.rng.int(1, maxWant);
      used.add(id);
    });
    const targetWantsCount = subtype === 'rare' ? 4 : 5;
    while (Object.keys(wants).length < targetWantsCount) {
      let id = null;
      if (subtype === 'medicine' || subtype === 'rare' || W.rng.chance(0.25)) {
        const pills = Object.keys(ECO.recipeById || {})
          .map(rid => 'P:' + rid)
          .filter(k => EXT.isTradable(k) && !used.has(k) && (subtype !== 'general' || BASIC_PILLS.has(k)));
        if (pills.length) id = W.rng.pick(pills);
      }
      if (!id) {
        const maxTier = subtype === 'rare' ? 7 : subtype === 'caravan' ? 5 : 3;
        id = pickMaterial(W, used, maxTier);
      }
      if (!id) break;
      const m = ECO.matById[id];
      const tier = m ? m.tier || 1 : 2;
      const maxWant = tier >= 5 ? 2 : tier >= 3 ? 4 : 6;
      wants[id] = W.rng.int(1, maxWant);
      used.add(id);
    }
    return wants;
  }

  EXT.openVisit = (W, options) => {
    options = options || {};
    const stats = EXT.ensure(W), subtype = TRADER_TYPES.includes(options.subtype) ? options.subtype : W.rng.pick(TRADER_TYPES);
    const seq = ++stats.seq;
    const nameList = TRADER_NAMES[subtype] || TRADER_NAMES.general;
    const stock = options.stock && typeof options.stock === 'object' ? Object.assign({}, options.stock) : buildStock(W, subtype);
    const wants = options.wants && typeof options.wants === 'object' ? Object.assign({}, options.wants) : buildWants(W, stock, subtype);
    Object.keys(stock).forEach(id => { if (!EXT.isTradable(id) || !Number.isSafeInteger(stock[id]) || stock[id] <= 0) delete stock[id]; });
    Object.keys(wants).forEach(id => { if (!EXT.isTradable(id) || !Number.isSafeInteger(wants[id]) || wants[id] <= 0 || stock[id] > 0) delete wants[id]; });
    const defaultStones = subtype === 'rare' ? W.rng.int(1200, 3000) : subtype === 'caravan' ? W.rng.int(550, 1400) : W.rng.int(280, 850);
    const visitor = {
      id: options.id || ('trader_' + seq), kind: 'trader', subtype,
      nameTh: options.nameTh || W.rng.pick(nameList),
      arriveDay: W.day,
      untilDay: Number.isFinite(options.untilDay) ? options.untilDay : W.day + clamp(Math.round(options.stayDays || 2), 1, 4),
      stones: Number.isFinite(options.stones) ? Math.max(0, Math.round(options.stones)) : defaultStones,
      stock, wants, sectTradeDay: null, sectBuyDone: false, tradeCount: 0
    };
    W.world.visitors.push(visitor);
    stats.visits++;
    W.log('event', visitor.nameTh + ' นำสินค้าเข้าแวะตลาดสำนัก (' + Object.values(stock).reduce((s, n) => s + n, 0) + ' หน่วย)', []);
    return visitor;
  };

  EXT.reserveForSect = (W, id) => {
    const floor = ECO.reserveFloor ? ECO.reserveFloor(W, id) : 2;
    const pop = Math.max(1, W.npcs ? W.npcs.filter(n => !n.dead && !n.exiled).length : 1);
    let base = floor;
    if (id === 'grain') base = Math.max(floor, pop * 14);
    else if (id === 'meal') base = Math.max(floor, pop * 2);
    else if (BASIC_PILLS.has(id)) base = Math.max(floor, Math.ceil(pop * 0.15));
    else if (ECO.isPill(id)) {
      base = Math.max(floor, 2);
    } else {
      const isRecipeInput = (W.sect.knownRecipes || []).some(rid => {
        const r = ECO.recipeById[rid];
        return r && r.inputs && r.inputs.some(inp => inp.matId === id);
      });
      const extraReserve = isRecipeInput ? 4 : 0;
      base = Math.max(floor + extraReserve, Math.floor((g.CPE ? g.CPE.target(W, id) : 8) * 0.6));
    }
    return base;
  };
  function treasurySkill(W) {
    const tr = SECT.holder(W, 'treasury') || W.byId[W.sect.masterId];
    return tr ? clamp((E(tr, 'intellect.numeracy') + E(tr, 'aptitudes.socialCommerce') + (tr.h.skills.trading || 0)) / 3, 0, 100) : 40;
  }
  function purchaseNeeds(W, v) {
    const out = [], seen = new Set();
    const add = (id, n, priority, reason) => {
      if (!id || seen.has(id) || !EXT.isTradable(id) || !(v.stock[id] > 0)) return;
      const q = Math.max(0, Math.floor(n)); if (!q) return;
      seen.add(id); out.push({ id, n: q, priority: priority || 0, reason: reason || 'ความต้องการตามแผนงานสำนัก' });
    };
    // 1. Direct shortages from shortageDirectives (provisions, emergency medicines, hall inputs, bottlenecks)
    (W.sect.shortageDirectives || []).slice(0, 8).forEach(sd => {
      if (!sd || !EXT.isTradable(sd.id)) return;
      const pri = sd.priority === 'critical' ? 20 : sd.priority === 'high' ? 14 : 8;
      add(sd.id, sd.deficit, pri, sd.reason);
    });
    // 2. Caravan buy list
    (W.sect.buyList || []).slice(0, 6).forEach(b => {
      if (!b || !EXT.isTradable(b.id)) return;
      add(b.id, b.n, 10 + (b.id === 'grain' ? 3 : 0), 'รายการสั่งซื้อของหอคลัง');
    });
    // 3. Fallback scan of trader inventory for critical shortages
    Object.keys(v.stock).forEach(id => {
      if (!EXT.isTradable(id)) return;
      const count = ECO.count(W, id);
      const res = EXT.reserveForSect(W, id);
      if (count < res * 0.4) {
        add(id, Math.min(4, Math.ceil(res - count)), 6 + (res - count) / Math.max(1, res), 'สต็อกต่ำกว่า 40% ของเกณฑ์สำรอง');
      }
    });
    return out.sort((a, b) => b.priority - a.priority).slice(0, 4);
  }
  function record(W, visitor, side, id, qty, unitPrice, total, npc, reason) {
    const stats = EXT.ensure(W), history = W.world.tradeHistory;
    const row = { day: W.day, side, itemId: id, qty, unitPrice, total, traderId: visitor.id, traderName: visitor.nameTh, reason: reason || '' };
    if (npc) { row.npcId = npc.id; row.npcName = npc.h.name.given; }
    history.push(row); if (history.length > 80) history.splice(0, history.length - 80);
    visitor.tradeCount = (visitor.tradeCount || 0) + 1;
    if (side === 'sect-buy') { stats.sectBought += qty; stats.sectStonesOut += total; }
    else if (side === 'sect-sell') { stats.sectSold += qty; stats.sectStonesIn += total; }
    else if (side === 'member-buy') { stats.memberBought += qty; stats.memberStonesOut += total; }
    else if (side === 'member-sell') { stats.memberSold += qty; stats.memberStonesIn += total; }
  }

  EXT.tradeSect = (W, v) => {
    EXT.ensure(W);
    const empty = { bought: 0, sold: 0, buyCost: 0, sellRevenue: 0 };
    if (!v || v.kind !== 'trader' || v.untilDay < W.day || v.sectTradeDay === W.day) return empty;
    v.sectTradeDay = W.day;
    const S = W.sect, skill = treasurySkill(W), result = Object.assign({}, empty), boughtKeys = new Set();
    const pop = Math.max(1, W.npcs.filter(n => !n.dead && !n.exiled).length);
    const generosity = S.policy ? S.policy.generosity : 50;
    const cashReserve = Math.max(300, pop * 20) + Math.round(pop * 10 * (1 - generosity / 200));
    let budget = Math.max(0, S.stones - cashReserve);

    // 1. Intelligent External Purchasing
    const needs = purchaseNeeds(W, v);
    const hasShortage = (S.shortageDirectives || []).length > 0 || needs.length > 0;
    if ((S.stones < cashReserve || budget <= 0) && hasShortage && !v.sectPostponedLogged) {
      v.sectPostponedLogged = true;
      W.log('finance', 'หอคลังชะลอการจัดซื้อสินค้าจาก' + v.nameTh + ' เนื่องจากศิลาสำรองคงเหลือ (' + Math.round(S.stones) + ') ต้องคงไว้เหนือเกณฑ์ปลอดภัย (' + cashReserve + ' ศิลา)', []);
    }

    if (!v.sectBuyDone) {
      for (const need of needs) {
        const unit = EXT.quotePrice(W, need.id, 'sect-buy', skill);
        if (!unit || budget < unit) continue;
        // Avoid purchasing overpriced items (> 1.4x base) unless critical
        const basePrice = ECO.base(need.id);
        if (need.priority < 18 && basePrice > 0 && unit > basePrice * 1.4) continue;

        const maxQty = Math.min(need.n, v.stock[need.id] || 0, Math.floor(budget / unit));
        const qty = Math.max(0, Math.min(maxQty, 8)); // bounded batch to prevent single-item budget drain
        if (!Number.isSafeInteger(qty) || qty <= 0) continue;
        const total = qty * unit;
        if (v.stones > Number.MAX_SAFE_INTEGER - total || !ECO.pay(W, total, 'ซื้อจาก' + v.nameTh + ': ' + ECO.name(need.id))) continue;
        
        v.stones += total;
        v.stock[need.id] -= qty;
        if (!v.stock[need.id]) delete v.stock[need.id];
        ECO.add(W, need.id, qty);
        budget -= total;
        result.bought += qty;
        result.buyCost += total;
        boughtKeys.add(need.id);

        const buyReason = 'สั่งซื้อตามคำสั่งขาดแคลน: ' + need.reason;
        record(W, v, 'sect-buy', need.id, qty, unit, total, null, buyReason);
        W.log('finance', 'หอคลังสั่งซื้อ ' + ECO.name(need.id) + ' ×' + qty + ' จาก' + v.nameTh + ' รวม ' + total + ' ศิลา (' + need.reason + ')', [], { txKind: 'purchase', itemId: need.id, qty, reason: need.reason });
      }
      if (result.bought > 0) v.sectBuyDone = true;
    }

    // 2. Autonomous Surplus Selling
    // Use inventory intelligence to identify genuine surplus above all reserve thresholds.
    const intel = ECO.inventoryIntelligence ? ECO.inventoryIntelligence(W) : null;
    const surplusList = intel && Array.isArray(intel.surplus) ? intel.surplus : [];
    const pol = S.policy || {};
    const secrecyVeto = pol.secrecy > 65;
    const commerceFocus = pol.focus && pol.focus.commerce != null ? pol.focus.commerce : 0.5;

    // Collect candidate surplus keys (welfare emergency medicines are strictly protected from external liquidation)
    const candidateKeys = new Set();
    surplusList.forEach(s => {
      if (EXT.isTradable(s.id) && !BASIC_PILLS.has(s.id) && !boughtKeys.has(s.id)) candidateKeys.add(s.id);
    });
    Object.keys(v.wants || {}).forEach(id => {
      if (EXT.isTradable(id) && !BASIC_PILLS.has(id) && !boughtKeys.has(id)) {
        const excess = ECO.count(W, id) - EXT.reserveForSect(W, id);
        if (excess > 0) candidateKeys.add(id);
      }
    });

    const sellKeys = Array.from(candidateKeys).sort((a, b) => {
      const excessA = ECO.count(W, a) - EXT.reserveForSect(W, a);
      const excessB = ECO.count(W, b) - EXT.reserveForSect(W, b);
      return excessB - excessA;
    });

    const maxItemsToSell = commerceFocus > 0.6 ? 4 : 3;
    for (const id of sellKeys.slice(0, maxItemsToSell)) {
      if (BASIC_PILLS.has(id)) continue; // welfare emergency medicine is strictly protected from external liquidation
      const mat = ECO.matById[id];
      if (secrecyVeto && mat && (mat.tier || 1) >= 3) continue; // strategic secrecy veto on rare materials

      const resFloor = EXT.reserveForSect(W, id);
      const curCount = ECO.count(W, id);
      const surplus = Math.max(0, curCount - resFloor);
      const unit = EXT.quotePrice(W, id, 'sect-sell', skill);
      if (!surplus || !unit || v.stones < unit || !(v.wants && v.wants[id] > 0)) continue;

      const wantQty = v.wants[id] || 0;
      const qty = Math.min(surplus, wantQty, Math.floor(v.stones / unit));
      if (!Number.isSafeInteger(qty) || qty <= 0 || !ECO.take(W, id, qty)) continue;

      const total = qty * unit;
      v.stones -= total;
      v.wants[id] -= qty;
      if (!v.wants[id]) delete v.wants[id];
      ECO.earn(W, total, 'ขายส่วนเกินให้' + v.nameTh + ': ' + ECO.name(id));
      result.sold += qty;
      result.sellRevenue += total;

      const sellReason = 'ขายส่วนเกินตามการประเมินคลังสำนัก (คงเหลือ ' + ECO.count(W, id) + '/' + resFloor + ')';
      record(W, v, 'sect-sell', id, qty, unit, total, null, sellReason);
      W.log('finance', 'สำนักขายส่วนเกิน ' + ECO.name(id) + ' ×' + qty + ' ให้' + v.nameTh + ' ได้รับ ' + total + ' ศิลา (คงคลังคงเหลือ ' + ECO.count(W, id) + ' เกณฑ์สำรอง ' + resFloor + ')', [], { txKind: 'sale', itemId: id, qty, reason: sellReason });
    }

    return result;
  };

  function pillNeed(n, id) {
    const info = ECO.pillInfo(id); if (!info) return 0;
    const e = info.effect || {}, s = n.h.state, hm = Math.max(1, CULT.hpMax(n));
    if (e.healInjury && n.inj && n.inj.length) return 1.5 + Math.min(0.6, n.inj.length * 0.15);
    if (e.healHealth && s.hp < hm * 0.72) return 0.8 + (1 - s.hp / hm) * 1.5;
    if (e.qiRestore && n.cult && s.qi < CULT.qiMax(n) * 0.25) return 0.8 + (1 - s.qi / Math.max(1, CULT.qiMax(n)));
    if (e.clearToxic && n.cult && (n.cult.toxic || 0) > 25) return 0.8 + n.cult.toxic / 150;
    if (e.clearHeartDemon && s.heartDemon > 35) return 0.8 + s.heartDemon / 150;
    if (e.energyRestore && s.energy < 25) return 0.6;
    return 0;
  }
  EXT.memberQuote = (W, n, onlyVisitorId) => {
    EXT.ensure(W);
    if (!n || n.dead || n.away || n.exiled || !n.inv) return null;
    let best = null, bestPriority = -Infinity;
    const choose = q => { if (q && q.priority > bestPriority) { best = q; bestPriority = q.priority; } };
    for (const v of EXT.activeVisitors(W)) {
      if (onlyVisitorId && v.id !== onlyVisitorId) continue;
      for (const id of Object.keys(v.stock || {})) {
        if (!EXT.isTradable(id) || !ECO.isPill(id) || !(v.stock[id] > 0) || ((n.inv.pills || {})[id] || 0) > 0) continue;
        const price = EXT.quotePrice(W, id, 'member-buy');
        let need = pillNeed(n, id), reason = 'ต้องการโอสถรักษา/ฟื้นฟู';
        if (!need && n.rank >= 1 && n.cult && (n.inv.stones || 0) >= price * 3) {
          const medicine = E(n, 'interests.medicine'), trade = E(n, 'interests.trade');
          if (medicine > 55 || trade > 75) { need = 0.25 + Math.max(0, medicine - 50) / 220 + Math.max(0, trade - 65) / 260; reason = 'สำรองโอสถจากพ่อค้าภายนอก'; }
        }
        if (need > 0 && price > 0 && (n.inv.stones || 0) >= price && v.stones <= Number.MAX_SAFE_INTEGER - price) {
          choose({ side: 'buy', itemId: id, qty: 1, price, total: price, visitorId: v.id, visitorName: v.nameTh, priority: 1.0 + need, reason });
        }
      }
      for (const id of Object.keys(n.inv.mats || {})) {
        const qtyHeld = n.inv.mats[id];
        if (!EXT.isTradable(id) || !Number.isSafeInteger(qtyHeld) || qtyHeld <= 0 || !(v.wants && v.wants[id] > 0)) continue;
        const price = EXT.quotePrice(W, id, 'member-sell');
        if (!price || v.stones < price) continue;
        const priority = 0.45 + E(n, 'interests.trade') / 240 + E(n, 'values.wealthResource') / 380 + (n.h.skills.trading || 0) / 280 - E(n, 'values.sectDuty') / 1000;
        choose({ side: 'sell', itemId: id, qty: 1, price, total: price, visitorId: v.id, visitorName: v.nameTh, priority, reason: 'พ่อค้าต้องการวัตถุดิบส่วนตัว' });
      }
      for (const id of Object.keys(n.inv.pills || {})) {
        const held = n.inv.pills[id];
        if (!EXT.isTradable(id) || !ECO.isPill(id) || !Number.isSafeInteger(held) || held < 2 || !(v.wants && v.wants[id] > 0) || pillNeed(n, id) > 0) continue;
        const price = EXT.quotePrice(W, id, 'member-sell');
        if (!price || v.stones < price) continue;
        const priority = 0.35 + E(n, 'interests.trade') / 260 + E(n, 'values.wealthResource') / 420 + (n.h.skills.trading || 0) / 320;
        choose({ side: 'sell-pill', itemId: id, qty: 1, price, total: price, visitorId: v.id, visitorName: v.nameTh, priority, reason: 'ขายโอสถส่วนเกิน' });
      }
    }
    return best;
  };

  EXT.tradeMember = (W, n, quote) => {
    if (!quote || !n || !n.inv) return false;
    const v = EXT.activeVisitors(W).find(x => x.id === quote.visitorId);
    if (!v) return false;
    const fresh = EXT.memberQuote(W, n, v.id);
    if (!fresh || fresh.side !== quote.side || fresh.itemId !== quote.itemId || fresh.price !== quote.price || fresh.qty !== quote.qty) return false;
    const id = fresh.itemId, total = fresh.total;
    if (fresh.side === 'buy') {
      if (!(v.stock[id] > 0) || (n.inv.stones || 0) < total || !EXT.isTradable(id)) return false;
      v.stock[id]--; if (!v.stock[id]) delete v.stock[id];
      n.inv.stones -= total; v.stones += total;
      n.inv.pills = n.inv.pills || {}; n.inv.pills[id] = (n.inv.pills[id] || 0) + 1;
      record(W, v, 'member-buy', id, 1, fresh.price, total, n);
    } else if (fresh.side === 'sell') {
      if (!EXT.isTradable(id) || !(n.inv.mats && n.inv.mats[id] > 0) || !(v.wants && v.wants[id] > 0) || v.stones < total) return false;
      n.inv.mats[id]--; if (!n.inv.mats[id]) delete n.inv.mats[id];
      v.wants[id]--; if (!v.wants[id]) delete v.wants[id];
      v.stones -= total; n.inv.stones = (n.inv.stones || 0) + total;
      record(W, v, 'member-sell', id, 1, fresh.price, total, n);
    } else if (fresh.side === 'sell-pill') {
      if (!EXT.isTradable(id) || !ECO.isPill(id) || !(n.inv.pills && n.inv.pills[id] >= 2) || pillNeed(n, id) > 0 || !(v.wants && v.wants[id] > 0) || v.stones < total) return false;
      n.inv.pills[id]--; if (!n.inv.pills[id]) delete n.inv.pills[id];
      v.wants[id]--; if (!v.wants[id]) delete v.wants[id];
      v.stones -= total; n.inv.stones = (n.inv.stones || 0) + total;
      record(W, v, 'member-sell', id, 1, fresh.price, total, n);
    } else return false;
    if (total >= 10) W.log('finance', n.h.name.given + (fresh.side === 'buy' ? ' ซื้อ' : ' ขาย') + ECO.name(id) + (fresh.side === 'buy' ? ' จาก' : ' ให้') + v.nameTh + ' ' + total + ' ศิลา', [n.id], { txKind: fresh.side === 'buy' ? 'purchase' : 'sale', itemId: id, qty: 1, actorId: n.id });
    return true;
  };

  // Visiting merchants participate in the NPC utility system at the existing market station.
  AI.ACTS.outsideTrade = {
    nameTh: 'ซื้อขายกับพ่อค้าภายนอก', icon: '🪙', color: '#c9a15b',
    can: (n, W) => !!EXT.memberQuote(W, n),
    score(n, W, S) {
      const q = EXT.memberQuote(W, n);
      if (!q) return S.add('ไม่มีข้อเสนอที่เหมาะสม', -3);
      S.add(q.side === 'buy' ? 'ต้องการ' + ECO.name(q.itemId) : 'ขาย' + ECO.name(q.itemId), 0.8 + q.priority * 0.65);
      S.add('ชอบค้าขาย', (E(n, 'interests.trade') - 45) / 220);
      S.add('ต่อรองเป็น', (n.h.skills.trading || 0) / 350);
    },
    where: (W, n) => { const st = AI.freeStation(W, n, 'browse', 'market'); return st ? { st } : null; },
    dur: () => 25,
    done(n, W) { const q = EXT.memberQuote(W, n); if (q) EXT.tradeMember(W, n, q); },
    cooldown: 240
  };

  EXT.daily = W => {
    const stats = EXT.ensure(W);
    W.world.visitors = W.world.visitors.filter(v => !v || v.kind !== 'trader' || v.untilDay >= W.day);
    let active = EXT.activeVisitors(W);
    if (W.threat && W.threat.roadBlocked <= 0 && active.length < 2) {
      const openness = W.sect.policy ? W.sect.policy.openness : 50;
      const chance = clamp(0.065 + (W.sect.fame || 0) / 1200 + openness / 1400, 0.04, 0.18);
      if (W.rng.chance(chance)) active.push(EXT.openVisit(W));
    }
    active = EXT.activeVisitors(W);
    active.forEach(v => EXT.tradeSect(W, v));
    return stats;
  };

  g.EXT = EXT;
  if (typeof module === 'object' && module.exports) module.exports = EXT;
})(typeof globalThis !== 'undefined' ? globalThis : this);
