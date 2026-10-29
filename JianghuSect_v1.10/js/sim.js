/* sim.js — แกนกลางของโลก: สร้างโลก, นาฬิกา/ปฏิทิน, วงจรจำลอง (1 tick = 1 นาทีเกม), บันทึก/โหลด
 * ทุกระบบอ่าน-เขียนสถานะผ่านวัตถุ W เดียว (single source of truth) */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js'), HC = g.HC, MAP = g.MAP, CULT = g.CULT, ECO = g.ECO, SECT = g.SECT, AI = g.AI, COMBAT = g.COMBAT, EXPED = g.EXPED, JD = g.JD;
  const clamp = U.clamp;
  const SIM = { VERSION: '1.10.11', PATCH_VERSION: '1.12.0', MIN_PER_YEAR: 360 * 1440 };
  const E = (n, p) => HC.eff(n, p);

  const SEASON_TH = ['ฤดูใบไม้ผลิ', 'ฤดูร้อน', 'ฤดูใบไม้ร่วง', 'ฤดูหนาว'];
  SIM.SEASON_TH = SEASON_TH;
  SIM.calendar = t => { const day = Math.floor(t / 1440), yd = ((day % 360) + 360) % 360; return { day, year: Math.floor(day / 360) + 1, month: Math.floor(yd / 30) + 1, dom: (yd % 30) + 1, season: Math.floor(yd / 90), hour: Math.floor((t % 1440) / 60), minute: t % 60 }; };
  SIM.dateText = t => { const c = SIM.calendar(t); return 'ปี ' + c.year + ' เดือน ' + c.month + ' วัน ' + c.dom + ' · ' + U.pad2(c.hour) + ':' + U.pad2(c.minute) + ' · ' + SEASON_TH[c.season]; };

  /* ---------- สร้างตัวละคร ---------- */
  SIM.buildNpc = (W, rng, o) => {
    HC.nowDay = W.day;
    const npc = HC.generate(rng, { id: o.id, day: W.day, sex: o.sex, ageYears: o.ageYears, quality: o.quality || 0, archetype: o.archetype, rootGrade: o.rootGrade, skillExp: o.skillExp, trainedness: o.trainedness, traitCount: o.traitCount });
    Object.assign(npc, { x: 0, y: 0, px: 0, py: 0, face: 1, dir: 0, rank: o.rank || 0, post: null, assist: null, merit: o.merit || 0, sat: 60, mentor: null, bed: null, joinDay: W.day - (o.tenure || 0), inv: { stones: Math.round(20 + (o.rank || 0) * 40 * (0.5 + rng.next())), pills: {}, mats: {} }, equip: {}, inj: [], cool: {}, recent: [], act: { id: 'idle', stage: 'do', left: 0, total: 0, ctx: {}, why: [] }, path: null, pi: 0, hidden: false, away: false, dead: false, stats: {}, why: [], travel: null });
    if (typeof o.stage === 'function' || o.stage > 0) SIM.awaken(W, rng, npc, o.stage);
    else if (o.stage == null && o.awakenChance != null) { if (rng.chance(o.awakenChance)) SIM.awaken(W, rng, npc, 1); }
    npc.h.state.hp = CULT.hpMax(npc);
    npc.h.state.qi = CULT.qiMax(npc);
    return npc;
  };
  SIM.awaken = (W, rng, npc, stage) => {
    const chosen = CULT.awaken(npc, rng, null, W.day);
    if (W._founding !== false) { npc.cult.sub = chosen.sub; if (CULT.trackDef(chosen.sub)) npc.cult.track = CULT.initTrack(chosen.sub, 1, W.day); }
    const c = npc.cult; if (typeof stage === 'function') stage = stage(c.path); c.stage = Math.min(stage, CULT.maxStage(npc));
    c.prog = Math.round(CULT.threshold(npc) * (0.1 + rng.next() * 0.6));
    const m = CULT.bestMantra(c.path, c.stage, npc); if (m) c.mantra = m.id;
    const lib = JD.TECH.techniques.filter(t => !t.sourcePack && !t.martialRare && !t.overhaulPack && !t.innateOnly).map(t => t.id);
    const cand = CULT.learnable(npc, lib).map(CULT.tech).filter(t => t.tier <= c.stage);
    const want = Math.min(CULT.maxTechs(npc) - 1, c.stage);
    for (let i = 0; i < want && cand.length; i++) { const t = rng.weighted(cand, x => 1 + x.power / 60 + (x.sub === c.sub ? 2 : 0)); c.techs.push(t.id); cand.splice(cand.indexOf(t), 1); }
    if (g.MARTIAL && g.MARTIAL.reconcileInnate) g.MARTIAL.reconcileInnate(npc, W);
    if (g.MARTIAL && g.MARTIAL.reconcilePassives) g.MARTIAL.reconcilePassives(npc);
    CULT.refreshLifespan(npc);
  };
  SIM.placeNear = (W, n, cx, cy, r) => {
    for (let i = 0; i < 20; i++) { const f = MAP.nearestFree(W.map, cx + (W.rng.next() - 0.5) * 2 * r, cy + (W.rng.next() - 0.5) * 2 * r); if (f) { n.x = f.x + .5; n.y = f.y + .5; return; } }
    n.x = cx + .5; n.y = cy + .5;
  };
  SIM.CANDIDATE_COUNT = 3;
  SIM.masterOpts = (seed, i) => { const r = new U.RNG(String(seed) + ':master:' + i); return { r, o: { id: 'n_master', sex: r.chance(0.7) ? 'M' : 'F', ageYears: r.int(44, 62), quality: 1.1, skillExp: 0.95, trainedness: 0.9, traitCount: 2, rank: 6, stage: path => (path === 'XIAN' || path === 'DEMON' || path === 'HEART_SOUL') ? 3 : 2, tenure: 4000, merit: 500 } }; };
  /** ผู้สมัครตำแหน่งเจ้าสำนัก 3 คน — ให้ผู้เล่นเลือกก่อนเริ่ม (นิสัยต่างกัน → สำนักต่างกัน) */
  SIM.candidates = seed => {
    const W = { day: 360 }; const out = [];
    for (let i = 0; i < SIM.CANDIDATE_COUNT; i++) {
      const { r, o } = SIM.masterOpts(seed, i); const npc = SIM.buildNpc(W, r, o); HC.nowDay = W.day;
      const st = SECT.styleOf(npc);
      out.push({ idx: i, npc, name: HC.fullName(npc), identity: HC.identity(npc), style: st, path: npc.cult.path + '/' + npc.cult.sub, age: HC.ageText(npc) });
    }
    return out;
  };

  /* ---------- สร้างโลก ---------- */
  SIM.create = (seed, opts) => {
    opts = opts || {};
    if (g.STATS) g.STATS.now = 0;
    const rng = new U.RNG(String(seed) + ':world');
    const W = { _founding: true, v: SIM.VERSION, seed: String(seed), rng, t: 360 + 360 * 1440, speed: 1, npcs: [], byId: {}, logs: [], logSeq: 0, seqN: 0, fights: [], foes: [], foeById: {}, duelQueue: [], graveyard: [], gone: [], deaths: 0, avgSat: 60, avgMood: 10, weather: { kind: 'clear', t: 0 }, season: 0, day: 0, createdAt: 0 };
    const cal = SIM.calendar(W.t); W.day = cal.day; W.season = cal.season; HC.nowDay = W.day;
    W.map = MAP.create(W.seed);
    W.market = ECO.newMarket(rng);
    W.log = (type, text, ids, meta) => SIM.log(W, type, text, ids, meta);
    W.fame = v => { W.sect.fame = Math.max(0, (W.sect.fame || 0) + v); };
    W.makeNpc = o => SIM.addNpc(W, o);
    W.sect = { name: opts.sectName || 'สำนักเมฆาหยกสวรรค์', masterId: null, deputyId: null, posts: {}, policy: null, stock: {}, gear: [], stones: 1000, ledger: [], recipeTier: 2, library: [], fame: 12, cd: {}, lastDuty: {}, orders: {}, suspicion: 0, festival: null, tournament: null, guardRoster: [], buyList: [], efficiency: 0, produced: 0, fallen: [], research: null, stipendOk: true, policyShift: W.day, reserveDirectives: null, shortageDirectives: [], welfareHistory: [] };
    SECT.POST_IDS.forEach(p => W.sect.posts[p] = null);
    EXPED.initWorld(W); EXPLORE.init(W);
    // ---- เจ้าสำนัก ----
    const mi = opts.masterIdx != null ? opts.masterIdx : 0; const mo = SIM.masterOpts(seed, mi);
    const master = SIM.buildNpc(W, mo.r, mo.o); SIM.register(W, master); W.sect.masterId = master.id;
    // ---- ศิษย์ตามลำดับ ----
    for (let i = 0; i < 2; i++) { const n = SIM.buildNpc(W, rng, { sex: i === 0 ? (master.h.sex === 'M' ? 'F' : 'M') : rng.chance(0.5) ? 'M' : 'F', ageYears: rng.int(16, 23), quality: 0.5 + rng.gauss(0, 0.3), skillExp: 0.25, trainedness: 0.55, rank: 1, stage: 1, tenure: rng.int(200, 700), merit: 40 }); SIM.register(W, n); n.mentor = master.id; master.h.life.family.disciples.push(n.id); n.h.life.family.master = master.id; }
    // ---- ห้องสมุด/คลัง/ตำรับ ----
    W.sect.library = JD.TECH.techniques.filter(t => !t.sourcePack && !t.martialRare && !t.overhaulPack && !t.innateOnly && t.tier <= 2).map(t => t.id).concat(JD.TECH.techniques.filter(t => !t.sourcePack && !t.martialRare && !t.overhaulPack && !t.innateOnly && t.tier === 3).slice(0, 12).map(t => t.id)).concat(JD.TECH.techniques.filter(t => !t.sourcePack && !t.martialRare && !t.overhaulPack && !t.innateOnly && t.tier === 3 && (t.path === 'DEMON' || t.path === 'HEART_SOUL')).map(t => t.id)).concat(JD.TECH.techniques.filter(t => t.starterPassive && !t.innateOnly).map(t => t.id));
    W._founding = false;
    const S = W.sect; S.stock.grain = 150; S.stock.meal = 30;
    ECO.recipesFor(W, ['ALCHEMY', 'FORGING', 'ARRAY', 'TALISMAN']).forEach(r => r.inputs.forEach(i => { const m = ECO.matById[i.matId]; if (m && m.tier <= 2) S.stock[i.matId] = Math.max(S.stock[i.matId] || 0, 8 + (m.tier === 1 ? 6 : 0)); }));
    S.policy = SECT.initPolicy(W); if (SECT.ensureDirectives) { SECT.ensureDirectives(W); SECT.updateReserveDirectives(W); }
    if (g.ECO && g.ECO.ensureStockTracker) g.ECO.ensureStockTracker(W);
    if (g.SECT && g.SECT.ensureFacilityDemand) g.SECT.ensureFacilityDemand(W);
    g.CPE.init(W); if (g.SECT && g.SECT.ensureDirectives) g.SECT.ensureDirectives(W); g.CONTENT.ensure(W); g.MARTIAL.ensure(W);
    if (g.WILD_RES) g.WILD_RES.init(W);
    const pl = W.map.byId.plaza; W.npcs.forEach(n => SIM.placeNear(W, n, pl.x + pl.w / 2, pl.y + pl.h / 2, 12));
    W.logs.length = 0; W.logSeq = 0;
    W.log('system', 'ก่อตั้ง「' + S.name + '」 โดยเจ้าสำนัก ' + HC.fullName(master), [master.id]);
    SIM.dailyUpdate(W, true);
    return W;
  };
  SIM.register = (W, n) => { n.n = ++W.seqN; W.npcs.push(n); W.byId[n.id] = n; return n; };
  SIM.addNpc = (W, o) => {
    o = o || {};
    const id = 'n' + (W.seqN + 1) + '_' + W.rng.int(100, 999);
    let tierRoll = null;
    if ((o.fromApplicant || o.useTalentTier) && o.quality == null && SECT.rollApplicantTier) {
      tierRoll = SECT.rollApplicantTier(W.rng, W.sect ? W.sect.fame : 12);
    }
    const effQuality = o.quality != null ? o.quality : (tierRoll ? tierRoll.quality : 0);
    const effRoot = o.rootGrade || (tierRoll ? tierRoll.rootGrade : undefined);
    const effTraits = o.traitCount != null ? o.traitCount : (tierRoll ? tierRoll.traitCount : undefined);
    const awaken = o.fromExped || o.fromApplicant ? 0.65 + Math.max(0, effQuality) * 0.15 : 0.5;
    const n = SIM.buildNpc(W, W.rng, {
      id,
      sex: o.sex,
      ageYears: o.ageYears,
      quality: effQuality,
      skillExp: clamp(((o.ageYears || 18) - 12) / 40, 0.03, 0.35),
      trainedness: 0.5,
      rank: o.rank || 0,
      stage: o.stage != null ? o.stage : (W.rng.chance(awaken) ? 1 : 0),
      awakenChance: null,
      merit: 0,
      traitCount: effTraits,
      rootGrade: effRoot
    });
    if (tierRoll) {
      n.ext = n.ext || {};
      n.ext.applicant = {
        tier: tierRoll.tierId,
        tierId: tierRoll.tierId,
        nameTh: tierRoll.nameTh,
        isGifted: tierRoll.isGifted,
        isExceptional: tierRoll.isExceptional,
        rolledAtDay: W.day
      };
    }
    n.joinDay = W.day; n.sat = 70;
    if (o.queue) { n.n = ++W.seqN; return n; }
    SIM.register(W, n);
    return n;
  };

  SIM.log = (W, type, text, ids, meta) => {
    const cleanIds = (ids || []).filter(Boolean);
    const e = { id: ++W.logSeq, t: W.t, type, text, ids: cleanIds };
    if (meta && typeof meta === 'object') {
      if (meta.txKind) e.txKind = meta.txKind;
      e.meta = Object.assign({}, meta);
    }
    W.logs.push(e); if (W.logs.length > 1500) W.logs.splice(0, 400);
    if (W.onLog) W.onLog(e);
    if (e.ids.length && !['finance', 'event', 'system', 'raid'].includes(type)) {
      e.ids.forEach(id => {
        const n = W.byId[id];
        if (n) {
          const b = n.h.life.bio;
          b.push({ d: W.day, text });
          if (b.length > 70) b.splice(0, 20);
        }
      });
    }
    return e;
  };

  /* ---------- วงจรจำลอง ---------- */
  SIM.tick = W => {
    g.STATS.now = W.t;
    W.t++;
    const d = Math.floor(W.t / 1440);
    if (d !== W.day) { W.day = d; HC.nowDay = d; SIM.dailyUpdate(W); }
    const npcs = W.npcs;
    for (let i = 0; i < npcs.length; i++) {
      const n = npcs[i]; if (n.dead) continue;
      if (n.travel) { n.px = n.x; n.py = n.y; AI.needs(W, n); if (!n.dead) EXPED.travelStep(W, n); if (n.away && n.exiled) { SIM.retire(W, n); i--; } continue; }
      if (n.away) continue;
      AI.step(W, n);
    }
    if (g.WILD) g.WILD.tick(W);
    if (g.WILD_RES) g.WILD_RES.tick(W);
    if (W.foes.length) EXPED.raidTick(W);
    if (g.WILD) g.WILD.clampCombat(W);
    COMBAT.tick(W);
    if (W.t % 60 === 0) SIM.hourly(W);
  };
  SIM.retire = (W, n) => {
    AI.cancelAct(W, n); AI.freeBed(W, n); if (n.post) { W.sect.posts[n.post] = null; n.post = null; }
    if (g.WILD_RES) g.WILD_RES.releaseClaim(W, n);
    const i = W.npcs.indexOf(n); if (i >= 0) W.npcs.splice(i, 1); W.gone.push(n.id);
    if (n.id === W.sect.deputyId) W.sect.deputyId = null;
    if (g.CPE && g.CPE.retireNpc) g.CPE.retireNpc(W, n, 'ออกจากสำนัก');
    for (const k of Object.keys(n.equip || {})) { if (n.equip[k]) W.sect.gear.push(n.equip[k]); } n.equip = {};
    if (n.inv && Array.isArray(n.inv.gear)) { n.inv.gear.forEach(g2 => { if (g2) W.sect.gear.push(g2); }); delete n.inv.gear; }
    for (const k of Object.keys((n.inv && n.inv.pills) || {})) ECO.add(W, k, n.inv.pills[k]);
    g.MARTIAL.returnKnowledge(W, n);
    for (const k of Object.keys((n.inv && n.inv.mats) || {})) ECO.add(W, k, n.inv.mats[k]);
    for (const id of ((n.inv && n.inv.techs) || [])) if (CULT.tech(id) && !W.sect.library.includes(id)) W.sect.library.push(id);
    for (const id of ((n.inv && n.inv.recipes) || [])) if (ECO.recipeById[id] && !W.sect.knownRecipes.includes(id)) { W.sect.knownRecipes.push(id); if (W.world && W.world.contentMetrics) W.world.contentMetrics.formulas++; }
    if (n.inv) { n.inv.pills = {}; n.inv.mats = {}; n.inv.techs = []; n.inv.recipes = []; }
  };
  SIM.hourly = W => {
    W.npcs.forEach(n => { if (!n.dead) { AI.healTick(W, n); g.STATS.recover(n); g.CPE.autoUse(W, n); if (n.equip) { for (const k in n.equip) { const it = n.equip[k]; if (it && it.dur != null && n.act.id === 'fight') it.dur = Math.max(0, it.dur - 0.5); } } } });
    W.map.buildings.forEach(b => { if (b.building && W.t >= b.building.until) SIM.finishBuilding(W, b); });
    if (W.map && W.map.buildings && g.SECT && g.SECT.ensureFacilityDemand) {
      g.SECT.ensureFacilityDemand(W);
      W.map.buildings.forEach(b => {
        const fd = W.sect.facilityDemand && W.sect.facilityDemand[b.id];
        if (!fd) return;
        const stList = b.stations.map(id => W.map.stations[id]).filter(Boolean);
        if (!stList.length) return;
        const occ = stList.filter(s => s.occ != null).length;
        const ratio = occ / stList.length;
        if (ratio >= 0.95) {
          fd.congestedHours = (fd.congestedHours || 0) + 1;
          fd.lastCongestionHour = W.t;
          if (fd.congestedHours >= 3) {
            fd.unmetDemands = (fd.unmetDemands || 0) + 1;
          }
        } else if (ratio < 0.6) {
          fd.congestedHours = 0;
        }
      });
    }
    EXPED.hourly(W);
    if (W.sect.gear.length && W.t % 360 === 0) SIM.distributeGear(W);
    W.npcs.forEach(n => { if (!n.dead && !n.away && n.inj && n.inj.length && n.h.state.hp < CULT.hpMax(n) * 0.5) { for (const k of Object.keys(W.sect.stock)) { const info = ECO.isPill(k) ? ECO.pillInfo(k) : null; if (info && k.startsWith('P:BASIC_') && (info.effect.healHealth || info.effect.healInjury) && W.sect.stock[k] > 0 && n.rank >= 1) { ECO.usePill(W, n, k); break; } } } });
  };
  SIM.finishBuilding = (W, b) => {
    const maxL = SECT.maxBuildingLevel ? SECT.maxBuildingLevel(b) : 3;
    b.level = Math.min(maxL, b.building.to);
    b.building = null; b.hp = 100;
    SIM.expandStations(W, b);
    const fd = W.sect.facilityDemand && W.sect.facilityDemand[b.id];
    if (fd) {
      fd.congestedHours = 0;
      fd.failedAttempts = 0;
      fd.unmetDemands = 0;
      fd.lastUpgradedDay = W.day;
    }
    if (b.stations.some(id => W.map.stations[id] && W.map.stations[id].kind === 'bed')) {
      W.npcs.forEach(n => {
        if (!n.dead && !n.away && n.bed == null) {
          AI.assignBed(W, n);
        }
      });
    }
    W.log('build', b.nameTh + ' ขยายเป็นระดับ ' + b.level + '/' + maxL + ' เสร็จสมบูรณ์ (เพิ่มพื้นที่ใช้งานรองรับสมาชิก)', [b.id]); W.fame(1);
  };
  SIM.expandStations = (W, b) => {
    const M = W.map; M.extraSt = M.extraSt || [];
    const maxL = SECT.maxBuildingLevel ? SECT.maxBuildingLevel(b) : 3;
    if (b.level > maxL) b.level = maxL;

    // 1. Authoritative Dormitory Bed Progression (56 + 28 + 16 = 100 max)
    if (SECT.HOUSING_IDS && SECT.HOUSING_IDS.includes(b.id)) {
      const spec = SECT.FACILITY_SPECS && SECT.FACILITY_SPECS[b.id];
      const targetBeds = (spec && spec.bedsByLevel && spec.bedsByLevel[b.level]) || b.stations.length;
      const bedStations = b.stations.map(id => M.stations[id]).filter(s => s && s.kind === 'bed');
      const add = Math.max(0, targetBeds - bedStations.length);
      for (let i = 0; i < add; i++) {
        const s0 = bedStations[i % bedStations.length] || { bid: b.n, bkey: b.id, x: b.door ? b.door.x : b.x, y: b.door ? b.door.y : b.y, inside: true };
        const s = { id: M.stations.length, bid: s0.bid, bkey: s0.bkey, kind: 'bed', x: s0.x, y: s0.y, inside: true, occ: null, owner: null, n: b.stations.length };
        M.stations.push(s);
        b.stations.push(s.id);
        M.extraSt.push({ bid: s.bid, kind: 'bed', x: s.x, y: s.y, inside: true });
      }
      return;
    }

    // 2. Non-housing facilities NEVER add bed stations
    const base = b.stations.slice();
    const kinds = {};
    base.forEach(id => {
      const s = M.stations[id];
      if (!s || s.kind === 'bed') return;
      (kinds[s.kind] = kinds[s.kind] || []).push(s);
    });
    Object.keys(kinds).forEach(k => {
      if (['guard', 'cell', 'treat', 'board', 'browse', 'work'].includes(k) && b.level < 3) return;
      const list = kinds[k];
      const add = Math.max(1, Math.round(list.length * 0.35));
      for (let i = 0; i < add; i++) {
        const s0 = list[i % list.length];
        let x = s0.x, y = s0.y;
        if (!s0.inside) {
          const f = MAP.nearestFree(M, s0.x + 1 + (i % 3), s0.y + 1 + ((i >> 1) % 2));
          if (f && (!MAP.findPath || MAP.findPath(M, MAP.GATE_IN.x, MAP.GATE_IN.y, f.x, f.y))) {
            x = f.x;
            y = f.y;
          }
        }
        const s = { id: M.stations.length, bid: s0.bid, bkey: s0.bkey, kind: k, x, y, inside: s0.inside, occ: null, n: list.length + i };
        M.stations.push(s);
        b.stations.push(s.id);
        M.extraSt.push({ bid: s.bid, kind: k, x, y, inside: s0.inside });
      }
    });
  };
  SIM.distributeGear = W => {
    if (SECT.distributeSectStock) {
      return SECT.distributeSectStock(W, { onlyGear: true });
    }
  };

  /* ---------- รายวัน ---------- */
  SIM.dailyUpdate = (W, silent) => {
    const rng = W.rng; const cal = SIM.calendar(W.t); W.season = cal.season; HC.nowDay = W.day;
    const wr = rng.next(); const ss = cal.season;
    W.weather = { kind: ss === 3 ? (wr < 0.35 ? 'snow' : wr < 0.65 ? 'cloud' : 'clear') : ss === 0 ? (wr < 0.35 ? 'rain' : wr < 0.65 ? 'cloud' : 'clear') : ss === 1 ? (wr < 0.2 ? 'rain' : wr < 0.4 ? 'cloud' : 'clear') : (wr < 0.25 ? 'fog' : wr < 0.4 ? 'rain' : wr < 0.65 ? 'cloud' : 'clear'), t: W.t };
    W.avgMood = W.npcs.length ? W.npcs.reduce((s, n) => s + (n.dead ? 0 : n.h.state.mood), 0) / Math.max(1, W.npcs.filter(n => !n.dead).length) : 0;
    if (silent) return;
    W.npcs.forEach(n => { if (n.dead) return; const age = HC.ageYears(n), life = n.lifespanMax || CULT.lifespan(n); if (age > life * 0.92) { const p = clamp((age - life * 0.92) / (life * 0.08), 0, 1) * 0.06; if (rng.chance(p)) AI.kill(W, n, 'ชราภาพ'); } });
    for (let i = W.npcs.length - 1; i >= 0; i--) { const n = W.npcs[i]; if (n.dead && W.day - n.deathDay > 4) { W.npcs.splice(i, 1); W.graveyard.push(n.id); } }
    if (!W.byId[W.sect.masterId] || W.byId[W.sect.masterId].dead) SECT.succession(W, 'เจ้าสำนักว่าง');
    SIM.guardRoster(W);
    SIM.assistants(W);
    SECT.daily(W);
    EXPED.daily(W); EXPLORE.daily(W); BN.daily(W); CPE.daily(W); g.CONTENT.daily(W); if (g.EXT) g.EXT.daily(W);
    W.npcs.forEach(n => {
      if (n.dead || n.away || !n.cult || !n.cult.track) return;
      if (CULT.trackReady(n)) {
        const gate = CULT.checkTrackGates(W, n);
        if (gate.ok) CULT.trackBreakthrough(W, n);
      }
    });
    SIM.researchTick(W);
    if (cal.dom === 1) SIM.monthly(W);
    const pop = W.npcs.filter(n => !n.dead).length;
    if (ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3 < pop * 1.5 && W.sect.stones > 200 && !W.threat.roadBlocked) { const n = Math.round(pop * 4); const c = Math.round(ECO.price(W, 'grain') * 1.3 * n); if (W.sect.stones >= c) { ECO.pay(W, c, 'ซื้อข้าวฉุกเฉิน'); ECO.add(W, 'grain', n); W.log('finance', 'เสบียงใกล้หมด หอคลังซื้อข้าวฉุกเฉิน ' + n + ' หน่วย', [], { txKind: 'purchase', itemId: 'grain', qty: n }); } }
    if (W.day % 30 === 15) W.npcs.forEach(n => { if (!n.dead) n.h.state.novelty = Math.max(0, n.h.state.novelty - 3); });
  };
  SIM.monthly = W => {
    SECT.monthly(W); EXPED.caravan(W);
    W.npcs.forEach(n => { if (n.dead || n.cult || n.away) return; if (HC.ageYears(n) > 45) return; const tal = HC.derived(n).cultivationTalent; if (W.rng.chance(clamp((tal - 38) / 200, 0.02, 0.35))) { const ch = CULT.awaken(n, W.rng, null, W.day); if (g.MARTIAL && g.MARTIAL.reconcileInnate) g.MARTIAL.reconcileInnate(n, W); if (g.MARTIAL && g.MARTIAL.reconcilePassives) g.MARTIAL.reconcilePassives(n); n.h.state.qi = CULT.qiMax(n); W.log('awaken', n.h.name.given + ' ตื่นรู้ปราณและก้าวเข้าสู่วิถี' + (CULT.PATHS[ch.path].nameTh || ch.path), [n.id]); HC.experience(n, 'insight', 0.8); } });
  };
  SIM.guardRoster = W => {
    const pop = W.npcs.filter(n => !n.dead).length; const k = 2 + Math.floor(pop / 14);
    const pool = W.npcs.filter(n => !n.dead && !n.away && n.rank >= 1 && n.rank <= 3 && !(n.inj && n.inj.length) && !n.sealed);
    pool.sort((a, b) => (AI.dutyWeight(b) + W.rng.next() * 0.8) - (AI.dutyWeight(a) + W.rng.next() * 0.8));
    W.sect.guardRoster = pool.slice(0, k).map(n => n.id);
  };
  SIM.assistants = W => {
    ['alchemy', 'forge'].forEach(h => {
      const cur = W.npcs.filter(n => !n.dead && n.assist === h);
      cur.forEach(n => { if (n.post) n.assist = null; });
      const have = W.npcs.filter(n => !n.dead && n.assist === h).length;
      if (have < 2) { const c = W.npcs.filter(n => !n.dead && !n.away && n.rank >= 1 && n.rank <= 3 && !n.assist && !n.post).sort((a, b) => SECT.relevance(h, b) - SECT.relevance(h, a))[0]; if (c && SECT.relevance(h, c) > 18) c.assist = h; }
    });
  };
  SIM.researchTick = W => {
    const S = W.sect; if (!S.research) return; const head = W.byId[S.research.lead];
    const r = (head && !head.dead ? (E(head, 'intellect.comprehension') + (head.h.skills.SCRIPTURE || 0) + (head.h.skills.ALCHEMY || 0)) / 10 : 4) * (1 + 0.1 * (W.map.byId.scripture.level - 1)) * (1 + S.policy.focus.scholar);
    S.research.progress += r;
    if (S.research.progress >= S.research.need) { S.recipeTier = S.research.tier; W.log('research', 'หอคัมภีร์วิจัยตำรับระดับ ' + S.recipeTier + ' สำเร็จ! หอโอสถและโรงหลอมผลิตของใหม่ได้', head ? [head.id] : []); W.fame(2); if (head) { head.merit += 30; HC.experience(head, 'craft_success', 1); } S.research = null; }
  };

  /* ---------- บันทึก/โหลด ---------- */
  SIM.serialize = W => {
    const M = W.map;
    const snap = { ...(W._saveExtras || {}), wildlife: W.wildlife, wildResources: W.wildResources, v: SIM.VERSION, runtimeTiming: W.runtimeTiming, hc: HC.FINGERPRINT, seed: W.seed, t: W.t, speed: W.speed, rng: W.rng.getState(), seqN: W.seqN, logSeq: W.logSeq, deaths: W.deaths, avgSat: W.avgSat, avgMood: W.avgMood, weather: W.weather, market: W.market, sect: W.sect, world: W.world, threat: W.threat, explore: W.explore, npcs: W.npcs, graveyard: W.graveyard, gone: W.gone, logs: W.logs.slice(-600), duelQueue: W.duelQueue, fights: W.fights, foes: W.foes, foeSeq: W.foeSeq, fightSeq: W.fightSeq,
      map: { extra: M.extraSt || [], buildings: M.buildings.map(b => ({ id: b.id, level: b.level, hp: b.hp, building: b.building || null })) } };
    return JSON.stringify(snap, (k, v) => (k[0] === '_' && k !== '_ver') ? undefined : v);
  };
  SIM.deserialize = str => {
    const s = JSON.parse(str);
    const object = v => v != null && typeof v === 'object' && !Array.isArray(v);
    const invalid = field => { throw new Error('ข้อมูลเซฟไม่ถูกต้อง: ' + field); };
    if (!object(s)) invalid('save');
    if (s.hc && s.hc !== HC.FINGERPRINT) throw new Error('เซฟนี้สร้างจากแกนมนุษย์คนละเวอร์ชัน (' + s.hc + ' ≠ ' + HC.FINGERPRINT + ')');
    if (typeof s.seed !== 'string' && !Number.isFinite(s.seed)) invalid('seed');
    if (!Number.isSafeInteger(s.t) || s.t < 0) invalid('t');
    for (const key of ['seqN', 'logSeq']) if (!Number.isSafeInteger(s[key]) || s[key] < 0) invalid(key);
    if (!Array.isArray(s.rng) || s.rng.length !== 4 || !s.rng.every(Number.isInteger)) invalid('rng');
    if (s.speed != null && (!Number.isFinite(s.speed) || s.speed < 0)) invalid('speed');
    for (const key of ['sect', 'world', 'market', 'weather', 'threat', 'map']) if (!object(s[key])) invalid(key);
    for (const key of ['npcs', 'logs', 'graveyard', 'gone']) if (!Array.isArray(s[key])) invalid(key);
    for (const key of ['buildings', 'extra']) if (!Array.isArray(s.map[key])) invalid('map.' + key);
    for (const key of ['duelQueue', 'fights', 'foes']) if (s[key] != null && !Array.isArray(s[key])) invalid(key);
    const npcIds = new Set();
    s.npcs.forEach(n => {
      if (!object(n) || typeof n.id !== 'string' || !n.id || npcIds.has(n.id)) invalid('npcs.id');
      npcIds.add(n.id);
    });
    const hadDay = Object.prototype.hasOwnProperty.call(HC, 'nowDay'), dayBefore = HC.nowDay;
    const stats = g.STATS, hadStatsTime = stats && Object.prototype.hasOwnProperty.call(stats, 'now'), statsTimeBefore = stats && stats.now;
    try {
      const W = SIM.create(s.seed, { masterIdx: 0 });
      W.rng.setState(s.rng); W.t = s.t; if (g.STATS) g.STATS.now = W.t; W.day = Math.floor(W.t / 1440); W.season = SIM.calendar(W.t).season; HC.nowDay = W.day; W.speed = s.speed == null ? 1 : s.speed; W.seqN = s.seqN; W.logSeq = s.logSeq; W.deaths = s.deaths; W.avgSat = s.avgSat; W.avgMood = s.avgMood; W.weather = s.weather; W.market = s.market; W.sect = s.sect; W.world = s.world; W.threat = s.threat; if (s.explore) W.explore = s.explore; W.graveyard = s.graveyard; W.gone = s.gone; W.logs = s.logs; W.duelQueue = s.duelQueue || []; W.fights = s.fights || []; W.foes = s.foes || []; W.foeSeq = s.foeSeq; W.fightSeq = s.fightSeq;
      W.foeById = {}; W.foes.forEach(u => W.foeById[u.id] = u);
      W.wildlife = s.wildlife || { seq: 0, beasts: [], kills: 0 };
      W.wildlife.beasts = W.wildlife.beasts.map(b => W.foeById[b.id] || b);
      if (s.wildResources) W.wildResources = s.wildResources;
      W.npcs = s.npcs; W.byId = {}; W.npcs.forEach(n => { W.byId[n.id] = n; });
      const M = W.map; M.extraSt = [];
      s.map.buildings.forEach(sb => { const b = M.byId[sb.id]; if (b) { b.level = sb.level; b.hp = sb.hp; b.building = sb.building; } });
      s.map.extra.forEach(e => { const b = M.buildings.find(x => x.n === e.bid); const st = { id: M.stations.length, bid: e.bid, bkey: b.id, kind: e.kind, x: e.x, y: e.y, inside: e.inside, occ: null, n: b.stations.length }; M.stations.push(st); b.stations.push(st.id); M.extraSt.push(e); });
      M.stations.forEach(st => { st.occ = null; if (st.owner != null) st.owner = null; });
      M.buildings.forEach(b => { b.inside = []; });
      W.npcs.forEach(n => { n.px = n.x; n.py = n.y; if (n.bed != null && M.stations[n.bed]) M.stations[n.bed].owner = n.id; if (n.act && n.act.st != null && M.stations[n.act.st]) { M.stations[n.act.st].occ = n.id; if (M.stations[n.act.st].inside && n.hidden) { M.buildings[M.stations[n.act.st].bid].inside.push(n.id); } } });
      W.log = (type, text, ids, meta) => SIM.log(W, type, text, ids, meta); W.fame = v => { W.sect.fame = Math.max(0, (W.sect.fame || 0) + v); }; W.makeNpc = o => SIM.addNpc(W, o);
      const knownKeys = new Set(['v', 'hc', 'seed', 't', 'speed', 'rng', 'seqN', 'logSeq', 'deaths', 'avgSat', 'avgMood', 'weather', 'market', 'sect', 'world', 'threat', 'explore', 'npcs', 'graveyard', 'gone', 'logs', 'duelQueue', 'fights', 'foes', 'foeSeq', 'fightSeq', 'map', 'runtimeTiming', 'wildlife', 'wildResources']);
      W._saveExtras = Object.fromEntries(Object.entries(s).filter(([k]) => !knownKeys.has(k)));
      if (s.runtimeTiming) W.runtimeTiming = s.runtimeTiming;
      const legacyContent = !s.sect.contentVersion;
      if (g.SECT && g.SECT.ensureDirectives) g.SECT.ensureDirectives(W);
      if (g.SECT && g.SECT.ensureFacilityDemand) g.SECT.ensureFacilityDemand(W);
      if (g.ECO && g.ECO.ensureStockTracker) g.ECO.ensureStockTracker(W);
      if (g.CPE && g.CPE.S) g.CPE.S(W);
      g.CONTENT.ensure(W); W._founding = false; g.MARTIAL.restore(W);
      if (legacyContent) W.npcs.forEach(n => {
        const a = n.act, ctx = a && a.ctx;
        if (a && ['brew', 'forge', 'brewBasic'].includes(a.id) && a.stage === 'do' && a.started2 && ctx && !ctx.craftReceipt) {
          const r = ECO.recipeById[ctx.rid]; if (r) ECO.adoptLegacyCraft(W, n, r, ctx);
        }
      });
      ECO.pruneCraftTransactions(W);
      if (W.sect && Array.isArray(W.sect.queue) && g.SECT && g.SECT.sanitizeQueue) g.SECT.sanitizeQueue(W);
      if (W.sect && Array.isArray(W.sect.queue)) W.sect.queue.forEach(a => HC.touch && HC.touch(a));
      W.npcs.forEach(n => HC.touch && HC.touch(n));
      return W;
    } catch (error) {
      if (hadDay) HC.nowDay = dayBefore; else delete HC.nowDay;
      if (stats) { if (hadStatsTime) stats.now = statsTimeBefore; else delete stats.now; }
      throw error;
    }
  };

  g.SIM = SIM;
  if (typeof module === 'object' && module.exports) module.exports = SIM;
})(typeof globalThis !== 'undefined' ? globalThis : this);
