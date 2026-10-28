/* economy.js — คลังสำนัก วัตถุดิบ ตำรับ การผลิต โอสถ อุปกรณ์ ตลาด
 * ทุกของมีที่มา-ที่ไป: สวน/เหมือง/การเดินทางนอกสำนัก/การค้า → คลัง → การผลิต → ใช้/ขาย */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js'), HC = g.HC, JD = g.JD, CULT = g.CULT;
  const clamp = U.clamp;
  const ECO = {};
  const matById = {}, recipeById = {}, itemById = {};
  JD.ITEMS.materials.forEach(m => matById[m.id] = m);
  JD.ITEMS.recipes.forEach(r => recipeById[r.id] = r);
  JD.ITEMS.items.forEach(i => itemById[i.id] = i);
  ECO.matById = matById; ECO.recipeById = recipeById; ECO.itemById = itemById;

  ECO.GRAIN_PRICE = 3; ECO.MEAL_PER_GRAIN = 3;

  /* ---------- ชื่อ/มูลค่า ---------- */
  ECO.name = id => {
    if (id === 'grain') return 'ข้าวสาร'; if (id === 'meal') return 'อาหารพร้อมกิน'; if (id === 'stones') return 'ศิลาวิญญาณ';
    if (matById[id]) return matById[id].nameTh;
    if (id.startsWith('P:')) { const r = recipeById[id.slice(2)]; return r ? r.outNameTh : id; }
    if (id.startsWith('FORMULA:')) { const r = recipeById[id.slice(8)]; return r ? 'ม้วนตำรับ' + r.nameTh : id; }
    if (itemById[id]) return itemById[id].nameTh;
    return id;
  };
  ECO.base = id => {
    if (id === 'grain') return ECO.GRAIN_PRICE; if (id === 'meal') return 1.2;
    if (matById[id]) return matById[id].value;
    if (id.startsWith('P:')) { const r = recipeById[id.slice(2)]; return r ? 14 * Math.pow(2.05, r.tier - 1) : 10; }
    if (itemById[id]) return itemById[id].value;
    return 5;
  };
  ECO.price = (W, id) => ECO.base(id) * ((W.market && W.market.mult[id]) || 1);
  ECO.isPill = id => id.startsWith('P:') || (itemById[id] && itemById[id].out === 'PILL');
  ECO.category = id => matById[id] ? matById[id].category : (id.startsWith('P:') ? 'PILL' : 'OTHER');

  /* ---------- คลัง ---------- */
  ECO.count = (W, id) => { const n = W.sect.stock[id]; return Number.isFinite(n) && n > 0 ? n : 0; };
  ECO.add = (W, id, n) => {
    if (typeof id !== 'string' || !id || !Number.isFinite(n) || n <= 0) return false;
    const total = ECO.count(W, id) + n; if (!Number.isFinite(total)) return false;
    if (id === '__proto__' || id === 'constructor' || id === 'prototype') Object.defineProperty(W.sect.stock, id, { value: total, writable: true, enumerable: true, configurable: true });
    else W.sect.stock[id] = total;
    return true;
  };
  ECO.take = (W, id, n) => {
    if (typeof id !== 'string' || !id || !Number.isFinite(n) || n < 0) return false;
    const have = ECO.count(W, id); if (have < n) return false;
    if (have > n) W.sect.stock[id] = have - n; else delete W.sect.stock[id]; return true;
  };
  ECO.pay = (W, amt, why) => { if (W.sect.stones < amt) return false; W.sect.stones -= amt; W.sect.ledger.push({ t: W.t, amt: -amt, why }); trimLedger(W); return true; };
  ECO.earn = (W, amt, why) => { W.sect.stones += amt; W.sect.ledger.push({ t: W.t, amt: +amt, why }); trimLedger(W); };
  function trimLedger(W) { if (W.sect.ledger.length > 400) W.sect.ledger.splice(0, 200); }

  /* ---------- ตลาดภายนอก (ราคาแกว่งตามเดือน) ---------- */
  ECO.newMarket = rng => ({ mult: {}, month: -1 });
  ECO.monthlyMarket = (W) => {
    const m = W.market;
    Object.keys(matById).concat(['grain']).forEach(id => {
      const cur = m.mult[id] || 1;
      const nx = clamp(cur + W.rng.gauss(0, 0.07) + (1 - cur) * 0.2, 0.65, 1.7);
      m.mult[id] = Math.round(nx * 100) / 100;
    });
    if (W.threat && W.threat.roadBlocked > 0) { ['grain', 'MAT_ORE_BLACK_IRON_1'].forEach(id => m.mult[id] = Math.min(1.9, (m.mult[id] || 1) * 1.15)); }
  };

  /* ---------- ตำรับ ---------- */
  ECO.recipeKnown = (W, r) => !!r && r.tier <= W.sect.recipeTier && (!r.discoverable || (W.sect.knownRecipes || []).includes(r.id));
  ECO.recipeKnownFor = (W, npc, r) => !!r && r.tier <= W.sect.recipeTier && (!r.discoverable || (W.sect.knownRecipes || []).includes(r.id) || !!(npc && npc.inv && Array.isArray(npc.inv.recipes) && npc.inv.recipes.includes(r.id)) || !!(npc && Array.isArray(npc.recipes) && npc.recipes.includes(r.id)));
  ECO.craftEligible = (W, npc, r, hall) => {
    if (!ECO.recipeKnownFor(W, npc, r)) return false;
    const paths = Array.isArray(r.compatiblePath) ? r.compatiblePath : [r.compatiblePath || 'ANY'];
    if (!paths.includes('ANY') && (!npc.cult || !paths.includes(npc.cult.path))) return false;
    if (r.minStage && (!npc.cult || npc.cult.stage < r.minStage)) return false;
    const building = W.map.byId[hall || (r.craft === 'ALCHEMY' ? 'alchemy' : 'forge')];
    return !r.facilityLevel || !!building && building.level >= r.facilityLevel;
  };
  ECO.recipesFor = (W, crafts) => JD.ITEMS.recipes.filter(r => crafts.includes(r.craft) && ECO.recipeKnown(W, r) && !r.basic && r.outType !== 'BEAST_ITEM');
  function recipeInputs(r, mult) {
    if (!r || typeof r.id !== 'string' || !Array.isArray(r.inputs) || !r.inputs.length || !Number.isFinite(mult) || mult <= 0) return null;
    const totals = new Map();
    for (const i of r.inputs) {
      if (!i || typeof i.matId !== 'string' || !i.matId || !Number.isFinite(i.count) || i.count <= 0) return null;
      const count = (totals.get(i.matId) || 0) + i.count * mult; if (!Number.isFinite(count)) return null;
      totals.set(i.matId, count);
    }
    return Array.from(totals, ([matId, count]) => ({ matId, count }));
  }
  ECO.inputsOk = (W, r, mult) => {
    const m = mult == null ? 1 : mult;
    if (!r || typeof r.id !== "string" || !Array.isArray(r.inputs) || !r.inputs.length || !Number.isFinite(m) || m <= 0) return false;
    const inp = r.inputs, n = inp.length, stock = W.sect.stock;
    if (n === 1) {
      const i0 = inp[0];
      if (!i0 || typeof i0.matId !== "string" || !i0.matId || !Number.isFinite(i0.count) || i0.count <= 0) return false;
      const need = i0.count * m;
      return Number.isFinite(need) && (stock[i0.matId] || 0) >= need;
    }
    if (n === 2 && inp[0] && inp[1] && inp[0].matId !== inp[1].matId) {
      const i0 = inp[0], i1 = inp[1];
      if (typeof i0.matId !== "string" || !i0.matId || !Number.isFinite(i0.count) || i0.count <= 0) return false;
      if (typeof i1.matId !== "string" || !i1.matId || !Number.isFinite(i1.count) || i1.count <= 0) return false;
      const n0 = i0.count * m, n1 = i1.count * m;
      return Number.isFinite(n0) && Number.isFinite(n1) && (stock[i0.matId] || 0) >= n0 && (stock[i1.matId] || 0) >= n1;
    }
    const inputs = recipeInputs(r, m);
    return !!inputs && inputs.every(i => ECO.count(W, i.matId) >= i.count);
  };
  ECO.inputCost = (W, r) => r.inputs.reduce((s, i) => s + ECO.price(W, i.matId) * i.count, 0);
  ECO.outputValue = (W, r) => {
    if (r.outItemId) return itemById[r.outItemId].value * 0.8;
    if (r.outType === 'PILL') return ECO.base('P:' + r.id) * 0.9;
    return 20 * Math.pow(1.9, r.tier - 1);
  };
  ECO.craftHours = (r, skill) => (3.5 + 2.3 * r.tier) * (1 - clamp(skill, 0, 100) / 100 * 0.32);
  function craftTransactions(W) {
    if (!W.sect.craftTransactions) W.sect.craftTransactions = { seq: 0, open: {} };
    return W.sect.craftTransactions;
  }
  function matchingReceipt(W, npc, r, ctx) {
    const receipt = ctx && ctx.craftReceipt, ledger = W.sect.craftTransactions;
    if (!receipt || receipt.state !== 'reserved' || !ledger || !r || !npc) return null;
    const paid = ledger.open[receipt.id];
    return paid && paid.rid === r.id && paid.npcId === npc.id && receipt.rid === paid.rid && receipt.npcId === paid.npcId ? paid : null;
  }
  function registerCraft(W, npc, r, ctx, inputs) {
    const ledger = craftTransactions(W), npcId = npc ? npc.id : null;
    if (!Number.isSafeInteger(ledger.seq) || ledger.seq < 0 || ledger.seq >= Number.MAX_SAFE_INTEGER) return false;
    // สมาชิกทำกิจกรรมผลิตได้ครั้งละหนึ่งงาน: งานใหม่ยกเลิกใบรับของงานที่ถูกขัดจังหวะ โดยไม่คืนวัตถุดิบ
    if (npcId != null) Object.keys(ledger.open).forEach(id => { if (ledger.open[id].npcId === npcId) delete ledger.open[id]; });
    const id = String(++ledger.seq), paid = { id, rid: r.id, npcId, inputs };
    ledger.open[id] = paid;
    if (ctx) ctx.craftReceipt = { id, rid: r.id, npcId, state: 'reserved' };
    return true;
  }
  ECO.reserveInputs = (W, r, ctx, npc) => {
    if (ctx && (typeof ctx !== 'object' || Array.isArray(ctx) || !npc || npc.id == null)) return false;
    if (ctx && ctx.craftReceipt) return !!matchingReceipt(W, npc, r, ctx);
    const inputs = recipeInputs(r, 1);
    if (!inputs || !inputs.every(i => ECO.count(W, i.matId) >= i.count)) return false;
    const ledger = craftTransactions(W);
    if (!Number.isSafeInteger(ledger.seq) || ledger.seq < 0 || ledger.seq >= Number.MAX_SAFE_INTEGER) return false;
    inputs.forEach(i => ECO.take(W, i.matId, i.count));
    return registerCraft(W, npc, r, ctx, inputs);
  };
  // ใช้เฉพาะตอนย้ายเซฟเก่า: งานในช่วงลงมือจ่ายวัตถุดิบไปแล้ว แต่ยังไม่มีใบรับ
  ECO.adoptLegacyCraft = (W, npc, r, ctx) => {
    if (!npc || npc.id == null || !ctx || typeof ctx !== 'object' || ctx.rid !== (r && r.id)) return false;
    if (ctx.craftReceipt) return !!matchingReceipt(W, npc, r, ctx);
    const inputs = recipeInputs(r, 1); return !!inputs && registerCraft(W, npc, r, ctx, inputs);
  };
  ECO.pruneCraftTransactions = W => {
    const ledger = W.sect.craftTransactions; if (!ledger) return;
    Object.keys(ledger.open).forEach(id => {
      const paid = ledger.open[id]; if (paid.npcId == null) return;
      const n = W.byId[paid.npcId], ac = n && n.act, receipt = ac && ac.ctx && ac.ctx.craftReceipt;
      if (!n || n.dead || !ac || !['brew', 'forge', 'brewBasic'].includes(ac.id) || !receipt || receipt.id !== id || receipt.state !== 'reserved') delete ledger.open[id];
    });
  };
  function settleCraft(W, npc, r, ctx) {
    const ledger = W.sect.craftTransactions; if (!ledger || !r || !npc) return null;
    const paid = ctx ? matchingReceipt(W, npc, r, ctx) : Object.values(ledger.open).find(p => p.npcId == null && p.rid === r.id);
    if (!paid) return null;
    // หักสิทธิ์ก่อนสุ่ม/ฝึกฝน/คืนของ เพื่อให้สำเร็จหรือล้มเหลวได้เพียงครั้งเดียว แม้โหลดเซฟหรือคัดลอก ctx
    delete ledger.open[paid.id];
    if (ctx) ctx.craftReceipt.state = 'settled';
    return paid;
  }
  ECO.successChance = (npc, r) => {
    const skill = npc.h.skills[r.craft] != null ? npc.h.skills[r.craft] : 0;
    return clamp(0.55 + (skill - r.minMastery) / 110 + HC.eff(npc, 'physiology.dexterity') / 500 + HC.eff(npc, 'intellect.focus') / 600 + HC.special(npc, 'craft.successBonus'), 0.15, 0.98);
  };
  ECO.mintGear = (itemOrRecipe, q) => {
    q = q || 1;
    if (itemOrRecipe.outItemId || itemOrRecipe.slot) {
      const it = itemOrRecipe.slot ? itemOrRecipe : itemById[itemOrRecipe.outItemId];
      const wp = it.slot === 'WEAPON', ar = it.slot === 'ARMOR';
      const cm = (wp ? 0.05 : ar ? 0.015 : 0.014) * it.tier * q, dm = (ar ? 0.05 : wp ? 0.012 : 0.012) * it.tier * q;
      return { id: it.id, nameTh: it.nameTh, slot: it.slot, tier: it.tier, combatMult: cm, defMult: dm, dur: 100, minStage: it.minStage || 1, value: it.value };
    }
    const r = itemOrRecipe, e = r.effect || {};
    const slot = /กระบี่|ศาสตรา|ทวน|ดาบ|หอก|ค้อน|ง้าว/.test(r.outNameTh) || (e.combatMult || 0) > (e.defenseMult || 0) * 1.8 ? 'WEAPON' : (e.defenseMult || 0) > (e.combatMult || 0) * 1.8 ? 'ARMOR' : 'ACCESSORY';
    return { id: r.id, nameTh: r.outNameTh, slot, tier: r.tier, combatMult: (e.combatMult || 0) * q, defMult: (e.defenseMult || 0) * q, dur: 100, minStage: e.minStageReq || 1, value: 20 * Math.pow(1.9, r.tier - 1) };
  };
  /** ผลผลิตที่ได้จากการผลิตสำเร็จ: เข้าคลังสำนัก */
  ECO.finishCraft = (W, npc, r, ctx) => {
    const paid = settleCraft(W, npc, r, ctx);
    if (!paid) return { ok: false, rejected: true, text: 'ไม่มีวัตถุดิบที่จองไว้สำหรับงานนี้' };
    const ok = W.rng.next() < ECO.successChance(npc, r);
    const skill = npc.h.skills[r.craft] || 0;
    HC.practice(npc, r.craft, ECO.craftHours(r, skill), 1.1);
    if (!ok) {
      paid.inputs.forEach(i => { if (W.rng.chance(0.4)) ECO.add(W, i.matId, Math.min(i.count, Math.max(1, Math.floor(i.count / 2)))); });
      return { ok: false, text: 'ล้มเหลว สูญวัตถุดิบ' };
    }
    const q = clamp(0.85 + (skill - r.minMastery) / 160 + W.rng.gauss(0, 0.06), 0.7, 1.5);
    const out = { ok: true, q };
    if (r.outType === 'PILL') {
      const n = (r.yield || 1) + (W.rng.chance(clamp((skill - r.minMastery) / 120, 0, 0.5)) ? 1 : 0) + (r.starter ? 1 : 0);
      const key = r.outItemId ? r.outItemId : 'P:' + r.id;
      ECO.add(W, key, n); out.text = ECO.name(key) + ' ×' + n; out.key = key; out.n = n;
    } else if (r.outType === 'EQUIPMENT') {
      const gear = ECO.mintGear(r, q); gear.q = Math.round(q * 100) / 100;
      W.sect.gear.push(gear); out.text = gear.nameTh + ' (คุณภาพ ' + gear.q + ')'; out.gear = gear;
    } else { out.text = r.outNameTh; }
    npc.stats = npc.stats || {}; npc.stats.crafted = (npc.stats.crafted || 0) + 1;
    return out;
  };
  /** ผลของโอสถ (อ่านจากข้อมูลเกมเก่า) */
  ECO.pillInfo = key => {
    if (key.startsWith('P:')) { const r = recipeById[key.slice(2)]; return r ? { tier: r.tier, effect: r.effect || {}, name: r.outNameTh } : null; }
    const it = itemById[key]; if (!it) return null;
    const e = {}; (it.effects || []).forEach(x => {
      const p = x.params || {};
      if (x.effectId === 'EFX_CULTIVATION_ACCELERATOR') { e.cultivationProgress = 18 * it.tier; e.rateBoost = p.cultivationBoostRatio; }
      else if (x.effectId === 'EFX_MASS_VITAL_HEAL') { e.healHealth = (p.healAmount || 30); if (p.curesMeridianWound) e.healInjury = 40; }
      else if (x.effectId === 'EFX_CALM_MIND') e.clearHeartDemon = p.heartDemonReduction || 20;
      else if (x.effectId === 'EFX_LEARNING_INSIGHT') e.insight = p.masteryGainMultiplier || 1.3;
      else if (x.effectId === 'EFX_MERIDIAN_TOXIN_PURGE') e.clearToxic = p.purgePotency || 30;
      else if (x.effectId === 'EFX_PURIFY_HOSTILE_STATUS') e.clearHeartDemon = 12;
    });
    return { tier: it.tier, effect: e, name: it.nameTh };
  };
  // ใช้ผลโอสถโดยไม่แตะคลัง: สำหรับโอสถที่ตัวละครถืออยู่เอง
  // แยกจาก usePill เพื่อไม่ต้องนำโอสถที่กินแล้วกลับเข้าคลังชั่วคราว (ซึ่งทำให้ของไม่เคยหมดจริง)
  ECO.applyPill = (W, npc, key) => {
    const info = ECO.pillInfo(key); if (!info) return null;
    const e = info.effect, c = npc.cult, s = npc.h.state; const msgs = [];
    if (e.cultivationProgress && c) { CULT.gain(npc, e.cultivationProgress); msgs.push('ปราณ +' + e.cultivationProgress); }
    if (e.rateBoost && c) { c.pillT = 360; c.pillBoost = e.rateBoost; }
    if (e.healHealth) { s.hp = Math.min(CULT.hpMax(npc), s.hp + CULT.hpMax(npc) * e.healHealth / 100 * 1.2); msgs.push('ฟื้นพลัง'); }
    if (e.healInjury && npc.inj && npc.inj.length) { npc.inj.forEach(i => { i.until -= e.healInjury * 360; }); msgs.push('สมานบาดแผล'); }
    if (e.breakthroughBonus && c) { c.btBonus = Math.max(c.btBonus || 0, e.breakthroughBonus); msgs.push('เตรียมทะลวง'); }
    if (e.toxicity && c) c.toxic = Math.min(100, c.toxic + e.toxicity);
    if (e.clearHeartDemon) s.heartDemon = Math.max(0, s.heartDemon - e.clearHeartDemon);
    if (e.clearToxic && c) c.toxic = Math.max(0, c.toxic - e.clearToxic);
    if (e.lifeBonus && c) { c.lifeBonus += e.lifeBonus; CULT.refreshLifespan(npc); }
    if (e.lifespanBonus && c) { c.lifeBonus += e.lifespanBonus; CULT.refreshLifespan(npc); msgs.push('อายุขัย +' + e.lifespanBonus); }
    if (e.insight) npc.insightT = 360;
    HC.bump(npc);
    return { info, msgs };
  };
  // ใช้โอสถจากคลังสำนัก: หักสต็อกหนึ่งเม็ดแล้วใช้ผลของโอสถ
  ECO.usePill = (W, npc, key) => {
    if (!ECO.pillInfo(key) || !ECO.take(W, key, 1)) return null;
    return ECO.applyPill(W, npc, key);
  };

  /* ---------- แหล่งผลิตในสำนัก ---------- */
  const HERBS = { 1: ['MAT_HERB_DEW_GRASS_1', 'MAT_HERB_CINDER_LEAF_1'], 2: ['MAT_HERB_JADE_LOTUS_2', 'MAT_HERB_MIST_ORCHID_2'], 3: ['MAT_HERB_BLOOD_GINSENG_3', 'MAT_HERB_VENOM_VINE_3', 'MAT_HERB_ANCIENT_MIST_FERN_3', 'MAT_HERB_MERIDIAN_FLOWER_3'] };
  const ORES = { 1: ['MAT_ORE_BLACK_IRON_1', 'MAT_ORE_CINNABAR_1'], 2: ['MAT_ORE_COLD_STEEL_2', 'MAT_ORE_JADE_SLATE_2'], 3: ['MAT_ORE_STAR_COPPER_3', 'MAT_ORE_MAGNET_LODESTONE_3', 'MAT_ORE_THUNDER_SCORCH_COPPER_3'] };
  ECO.harvestHerb = (W, npc, hours) => {
    const b = W.map.byId.herb_garden, sk = npc.h.skills.herbalism || 0;
    const out = [];
    const n = Math.max(0, Math.round(hours * (0.9 + sk / 60) * (0.7 + b.level * 0.3) * (0.8 + W.rng.next() * 0.4) * (W.season === 3 ? 0.55 : W.season === 0 ? 1.2 : 1)));
    for (let i = 0; i < n; i++) {
      let tier = 1; const r = W.rng.next();
      if (b.level >= 2 && r < 0.28 + sk / 400) tier = 2;
      if (b.level >= 3 && r < 0.07 + sk / 800) tier = 3;
      const id = W.rng.pick(HERBS[tier]); ECO.add(W, id, 1); out.push(id);
    }
    return out;
  };
  ECO.harvestGrain = (W, npc, hours) => {
    const b = W.map.byId.farm;
    const n = Math.round(hours * (1.1 + (npc.h.skills.herbalism || 0) / 70 + HC.eff(npc, 'physiology.strength') / 250) * (0.8 + b.level * 0.25) * (W.season === 3 ? 0.4 : W.season === 1 ? 1.2 : 1) * (0.85 + W.rng.next() * 0.3));
    ECO.add(W, 'grain', n); return n;
  };
  ECO.mineYield = (W, npc, hours) => {
    const b = W.map.byId.mine, sk = npc.h.skills.mining || 0, out = [];
    const n = Math.max(0, Math.round(hours * (0.55 + sk / 120) * (0.7 + b.level * 0.3) * (0.7 + W.rng.next() * 0.6)));
    for (let i = 0; i < n; i++) {
      let tier = 1; const r = W.rng.next();
      if (r < 0.25 + sk / 500) tier = 2; if (b.level >= 2 && r < 0.06 + sk / 900) tier = 3;
      const id = W.rng.pick(ORES[tier]); ECO.add(W, id, 1); out.push(id);
    }
    const st = Math.round(hours * W.rng.float(0.2, 1.2) * (0.6 + b.level * 0.4));
    if (st > 0) ECO.earn(W, st, 'แร่หินวิญญาณจากเหมือง');
    return { out, stones: st };
  };
  ECO.cookMeals = (W, hours, skill) => {
    const grain = Math.min(ECO.count(W, 'grain'), Math.ceil(hours * (1.5 + skill / 60)));
    if (grain <= 0) return 0;
    ECO.take(W, 'grain', grain); const meals = Math.round(grain * ECO.MEAL_PER_GRAIN * (0.95 + skill / 400)); ECO.add(W, 'meal', meals); return meals;
  };

  /* ---------- คำสั่งผลิตของหัวหน้าหอ ---------- */
  ECO.needSummary = W => {
    let cultiv = 0, btSoon = 0, injured = 0, noWeapon = 0, noArmor = 0, noAccessory = 0, pop = 0;
    W.npcs.forEach(n => {
      if (n.dead || n.away) return; pop++;
      if (n.cult) { cultiv++; if (n.cult.prog >= CULT.threshold(n) * 0.8) btSoon++; }
      if (n.inj && n.inj.length) injured++;
      if (!n.equip || !n.equip.WEAPON) noWeapon++; if (!n.equip || !n.equip.ARMOR) noArmor++; if (!n.equip || !n.equip.ACCESSORY) noAccessory++;
    });
    const gear = W.sect.gear;
    return { btNeed: W.sect.btDemand || {}, pop, cultiv, btSoon, injured, noWeapon, noArmor, noAccessory, gearWeapon: gear.filter(x => x.slot === 'WEAPON').length, gearArmor: gear.filter(x => x.slot === 'ARMOR').length, gearAccessory: gear.filter(x => x.slot === 'ACCESSORY').length };
  };
  /** เลือกตำรับถัดไปให้หอ: คืน {recipe, why, import:[...]} */
  ECO.pickOrder = (W, hall, head) => {
    const crafts = hall === 'alchemy' ? ['ALCHEMY'] : ['FORGING', 'ARRAY', 'TALISMAN'];
    const need = ECO.needSummary(W);
    const pol = W.sect.policy;
    const best = [];
    ECO.recipesFor(W, crafts).forEach(r => {
      const skillOk = head ? ((head.h.skills[r.craft] || 0) + 25 >= r.minMastery || W.npcs.some(n => !n.dead && !n.away && (n.h.skills[r.craft] || 0) + 20 >= r.minMastery && ECO.craftEligible(W, n, r, hall))) : true;
      if (!skillOk) return;
      let s = 0, why = '';
      const have = ECO.count(W, r.outItemId || 'P:' + r.id);
      if (r.outType === 'PILL') {
        const e = ECO.pillInfo(r.outItemId || 'P:' + r.id).effect;
        if (e.cultivationProgress) { s += 0.5 + 0.1 * Math.min(need.cultiv, 8) - have * 0.05; why = 'ช่วยการบำเพ็ญ'; }
        if (e.btFor) { const d = (need.btNeed || {})[e.btFor.path + ':' + e.btFor.stage] || 0; s += d * 1.6 - have * 1.0 - (d ? 0 : 1.4); why = 'ผู้ติดคอขวดต้องการ'; }
        else if (e.breakthroughBonus) { s += need.btSoon * 0.5 - have * 0.4; why = 'ผู้ใกล้ทะลวงต้องการ'; }
        if (e.cbBuff) { s += 0.18 + Math.min(0.4, need.cultiv * 0.03) + (W.sect.recentRaid ? 0.5 : 0) - have * 0.12; why = 'สำรองไว้ก่อนศึก'; if (e.cbBuff.id === 'BERSERK') s -= 0.4; }
        if (e.healHealth || e.healInjury) { s += need.injured * 0.35 + 0.1 - have * 0.1; why = 'สำรองยารักษา'; }
        if (e.clearToxic) { s += 0.24 - have * 0.08; if (!why) why = 'สำรองยาถอนพิษ'; }
        if (e.qiRestore) { s += 0.18 - have * 0.06; if (!why) why = 'สำรองยาฟื้นปราณ'; }
        if (e.clearHeartDemon) { s += 0.12 - have * 0.1; }
        if (r.discoverable && have < 2 && ECO.inputsOk(W, r)) s += 0.55;
        if (have > 12) s -= 1;
      } else if (r.outType === 'EQUIPMENT') {
        const gcount = W.sect.gear.filter(x => x.id === (r.outItemId || r.id)).length;
        const gapW = Math.max(0, need.noWeapon - need.gearWeapon), gapA = Math.max(0, need.noArmor - need.gearArmor), gapAcc = Math.max(0, (need.noAccessory || 0) - (need.gearAccessory || 0));
        const slot = ECO.mintGear(r).slot;
        s += (slot === 'WEAPON' ? gapW * 0.25 : slot === 'ARMOR' ? gapA * 0.25 : Math.min(1.3, 0.2 + gapAcc * 0.16)) - gcount * 0.15;
        if (r.discoverable && gcount < 2 && ECO.inputsOk(W, r)) s += 0.6;
        why = 'อุปกรณ์ขาดแคลน';
      }
      s += Math.max(0, (ECO.outputValue(W, r) - ECO.inputCost(W, r))) / 220 * (0.4 + pol.focus.commerce) ;
      s -= r.tier > 3 ? (r.tier - 3) * 0.12 : 0; // ของสูงเกินกำลังสำนักเริ่มต้น
      if (!ECO.inputsOk(W, r)) { s -= 0.25; }
      if (head) { const iid = hall === 'alchemy' ? 'alchemy' : 'forging'; s += (HC.eff(head, 'interests.' + iid) - 50) / 400; }
      s += W.rng.next() * 0.12;
      best.push({ r, s, why });
    });
    best.sort((a, b) => b.s - a.s);
    const pickable = best.filter(x => ECO.inputsOk(W, x.r));
    const top = pickable[0] || null;
    // รายการวัตถุดิบที่ขาดสำหรับตำรับอันดับต้น ๆ (ให้คลังสั่งซื้อ)
    const want = {};
    best.slice(0, 3).forEach(x => { x.r.inputs.forEach(i => { const lack = i.count * 2 - ECO.count(W, i.matId); if (lack > 0) want[i.matId] = Math.max(want[i.matId] || 0, lack); }); });
    return { recipe: top ? top.r : null, why: top ? top.why : '', want };
  };

  g.ECO = ECO;
  if (typeof module === 'object' && module.exports) module.exports = ECO;
})(typeof globalThis !== 'undefined' ? globalThis : this);
