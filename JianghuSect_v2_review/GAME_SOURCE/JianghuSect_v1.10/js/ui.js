/* ui.js — หน้าจอ: HUD, แผ่นข้อมูล (people/sect/log/world/edit/menu/npc/building), หน้าเลือกเจ้าสำนัก, บันทึก/โหลด */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, CULT = g.CULT, SECT = g.SECT, ECO = g.ECO, AI = g.AI, MAP = g.MAP, SIM = g.SIM, EXPED = g.EXPED, JD = g.JD, Render = g.Render;
  const clamp = U.clamp;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const UI = { G: null, sheet: null, tab: null, lastHud: 0, logSubFilter: 'all', editNpcId: null, editStatGroup: 'personality', editDraft: null, spawnDest: 'sect', spawnSearch: '', spawnKind: 'ALL', spawnTier: 'ALL', spawnElement: 'ALL', spawnRarity: 'ALL', spawnPage: 1, spawnPageSize: 40, spawnQty: 1, spawnQuality: 1, stockSearch: '', stockType: 'ALL', stockTier: 'ALL', stockSort: 'qty', bagSearch: '', bagType: 'ALL', bagSort: 'tier', bagCat: 'ALL', bagPage: 1, bagSelKey: null, bagMoreOpen: false, stockCat: 'ALL', stockPage: 1, stockSelKey: null, stockMoreOpen: false, shopCat: 'ALL', shopSearch: '', shopSort: 'tier', shopPage: 1, shopSelKey: null, shopMoreOpen: false, shopBuyerId: null };
  const SPEEDS = [[0, '⏸'], [1, '1×'], [2, '2×'], [4, '4×'], [8, '8×'], [16, '16×'], [32, '32×'], [48, '48×']];
  UI.SPEEDS = SPEEDS.map(s => s[0]);

  const LOG_GROUPS = {
    all: ['ทั้งหมด', null],
    people: ['👥 ผู้คน', ['relation', 'marriage', 'recruit', 'death', 'injury', 'heal', 'awaken', 'desert', 'disciple', 'punish', 'expel']],
    combat: ['⚔️ ต่อสู้/ล่า', ['combat', 'hunt', 'beast', 'explore', 'raid', 'duel', 'spar', 'tournament', 'conflict', 'challenge']],
    craft: ['⚗️ การผลิต/ตกปลา', ['craft', 'harvest', 'fish', 'legend', 'alchemy', 'forge', 'organ', 'learn', 'research', 'insight', 'breakthrough']],
    economy: ['🪙 เศรษฐกิจ', ['economy', 'trade', 'finance', 'shop', 'gear', 'welfare', 'donation', 'surplus', 'shortage', 'salary']],
    building: ['🏯 อาคาร', ['build', 'building', 'decision', 'appoint', 'dismiss', 'promote', 'demote', 'succession', 'politics', 'scandal', 'crisis', 'banquet', 'seclusion', 'system']],
    major: ['⭐ สำคัญ', ['death', 'breakthrough', 'legend', 'succession', 'crisis', 'raid', 'challenge', 'tournament', 'marriage', 'expel', 'build']]
  };
  const LOG_SUBFILTERS = {
    all: 'ทุกประเภทย่อย',
    no_pill: '🚫 ซ่อนการใช้โอสถรายวัน',
    gift: '🎁 มอบของรางวัล/จัดสรรคลัง',
    trade: '🪙 ซื้อ/ขายสินค้า',
    spawn: '✨ เสก/แก้ไขโดยผู้เล่น'
  };
  const TOAST_TYPES = ['explore', 'death', 'breakthrough', 'raid', 'succession', 'challenge', 'tournament', 'marriage', 'desert', 'expel', 'research', 'build'];

  /* ---------- ตัวช่วย ---------- */
  function bar(label, v, o) {
    o = o || {}; const pct = clamp(v / (o.max || 100) * 100, 0, 100); const col = o.color || (v >= 71 ? '#5fd38a' : v >= 45 ? '#4fb2f2' : v >= 30 ? '#e8c43a' : '#e0584a');
    return '<div class="bar' + (o.wide ? ' wide' : '') + '"><div class="lb" title="' + esc(o.tip || '') + '">' + esc(label) + '</div><div class="tr"><div class="fl" style="width:' + pct + '%;background:' + col + '"></div>' + (o.mark != null ? '<div class="mk" style="left:' + clamp(o.mark / (o.max || 100) * 100, 0, 100) + '%"></div>' : '') + '</div><div class="vl">' + (o.txt != null ? o.txt : Math.round(v)) + '</div></div>';
  }
  function statLayer(n, layer, o) {
    o = o || {}; return HC.layerIds(layer).map(id => { const path = layer + '.' + id; const v = HC.eff(n, path); const inn = n.h.innate ? n.h.innate[path] : null; const d = HC.STAT_DEFS.find(s => s.path === path); return bar(HC.nameOf(path), v, { mark: o.mark !== false && inn != null ? inn : null, wide: true, tip: d ? d.descTh : '' }); }).join('');
  }
  function timeAgo(W, t) { const m = W.t - t; if (m < 60) return m + ' นาทีก่อน'; if (m < 1440) return Math.floor(m / 60) + ' ชม.ก่อน'; return Math.floor(m / 1440) + ' วันก่อน'; }
  function dayStamp(t) { const c = SIM.calendar(t); return 'ปี' + c.year + ' ด.' + c.month + ' ว.' + c.dom; }
  function portraitHtml(n, size) { return '<canvas class="pt" data-pid="' + n.id + '" data-size="' + (size || 40) + '" style="border-radius:10px;flex:0 0 auto"></canvas>'; }
  function drawPortraits(root) { root.querySelectorAll('canvas.pt').forEach(cv => { const n = UI.G.W.byId[cv.dataset.pid]; if (n) Render.portrait(cv, n, +cv.dataset.size); }); }
  function nameLink(n) { return '<a class="link-ref" data-npc="' + n.id + '" style="color:var(--blue);text-decoration:none">' + esc(n.h.name.given) + '</a>'; }
  const SVG_ICONS = {
    stones: "<svg class=\"svg-ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><polygon points=\"12,2 21,9 17,21 7,21 3,9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"/><polyline points=\"3,9 12,13 21,9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><line x1=\"12\" y1=\"13\" x2=\"12\" y2=\"21\" stroke=\"currentColor\" stroke-width=\"1.6\"/></svg>",
    food: "<svg class=\"svg-ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 12h16a8 8 0 0 1-16 0z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M8 19h8M7 9c0-1.5 1-2.5 1-4M12 9c0-1.5 1-2.5 1-4M17 9c0-1.5 1-2.5 1-4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>",
    people: "<svg class=\"svg-ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"8\" r=\"3.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M3.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/><circle cx=\"17\" cy=\"9\" r=\"2.3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><path d=\"M15.5 14.2c2.3.3 4.3 2 4.3 4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>",
    fame: "<svg class=\"svg-ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"9\" r=\"5.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M9 14l-2 7 5-2.5L17 21l-2-7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></svg>"
  };
  UI.icon = name => SVG_ICONS[name] || "";


  /* ---------- Wuxia Item Sprite Atlas & Paginated Icon-Grid Engine ---------- */
  const ITEM_ATLAS_URI = "data:image/png;base64,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";
  const ITEM_ATLAS_CELLS = [{"cell":0,"col":0,"row":0,"key":"LEG_WPN_YITIAN_SWORD","group":"legendary_weapon","shape":"sword"},{"cell":1,"col":1,"row":0,"key":"LEG_WPN_XUANTIE_HEAVY_SWORD","group":"legendary_weapon","shape":"greatsword"},{"cell":2,"col":2,"row":0,"key":"LEG_WPN_TULONG_SABER","group":"legendary_weapon","shape":"saber"},{"cell":3,"col":3,"row":0,"key":"LEG_WPN_FULL_MOON_SCIMITAR","group":"legendary_weapon","shape":"scimitar"},{"cell":4,"col":4,"row":0,"key":"LEG_WPN_XIAOLI_HEART_DAGGER","group":"legendary_weapon","shape":"dagger"},{"cell":5,"col":5,"row":0,"key":"LEG_WPN_DAGOU_JADE_STAFF","group":"legendary_weapon","shape":"staff"},{"cell":6,"col":6,"row":0,"key":"LEG_WPN_OVERLORD_SPEAR","group":"legendary_weapon","shape":"spear"},{"cell":7,"col":7,"row":0,"key":"LEG_WPN_OATHBREAKER_DRAGON_LANCE","group":"legendary_weapon","shape":"lance"},{"cell":8,"col":0,"row":1,"key":"LEG_WPN_WRATHFUL_TIGER_GAUNTLETS","group":"legendary_weapon","shape":"gauntlet"},{"cell":9,"col":1,"row":1,"key":"LEG_WPN_CONDOR_METEOR_BOW","group":"legendary_weapon","shape":"bow"},{"cell":10,"col":2,"row":1,"key":"LEG_WPN_PEACOCK_PLUME_FOCUS","group":"legendary_weapon","shape":"fan_tube"},{"cell":11,"col":3,"row":1,"key":"LEG_MANTRA_TAIXUAN_SCRIPTURE","group":"legendary_tech","shape":"stele_scroll"},{"cell":12,"col":4,"row":1,"key":"LEG_MANTRA_SIX_MERIDIAN_QI","group":"legendary_tech","shape":"tome_scroll"},{"cell":13,"col":5,"row":1,"key":"LEG_MANTRA_DRAGON_ELEPHANT_PRAJNA","group":"legendary_tech","shape":"tome_scroll"},{"cell":14,"col":6,"row":1,"key":"LEG_MANTRA_DIAMOND_INDESTRUCTIBLE","group":"legendary_tech","shape":"tome_scroll"},{"cell":15,"col":7,"row":1,"key":"LEG_MANTRA_EIGHT_DESOLATIONS_GOD","group":"legendary_tech","shape":"tome_scroll"},{"cell":16,"col":0,"row":2,"key":"LEG_MANTRA_CELESTIAL_MANDATE_CANON","group":"legendary_tech","shape":"jade_tablet"},{"cell":17,"col":1,"row":2,"key":"LEG_MANTRA_ASHURA_BLOOD_SEA","group":"legendary_tech","shape":"tome_scroll"},{"cell":18,"col":2,"row":2,"key":"LEG_MANTRA_TEN_THOUSAND_GU_MONARCH","group":"legendary_tech","shape":"tome_scroll"},{"cell":19,"col":3,"row":2,"key":"LEG_MANTRA_NINE_YIN_SOUL_MIRROR","group":"legendary_tech","shape":"mirror_tome"},{"cell":20,"col":4,"row":2,"key":"LEG_MANTRA_LITTLE_LI_HEART_BLADE","group":"legendary_tech","shape":"jade_tablet"},{"cell":21,"col":5,"row":2,"key":"LEG_COMBAT_DUGU_NINE_SWORDS","group":"legendary_tech","shape":"combat_manual"},{"cell":22,"col":6,"row":2,"key":"LEG_COMBAT_DRAGON_SUBDUING_PALMS","group":"legendary_tech","shape":"combat_manual"},{"cell":23,"col":7,"row":2,"key":"LEG_COMBAT_FEIXIAN_ONE_SWORD","group":"legendary_tech","shape":"combat_manual"},{"cell":24,"col":0,"row":3,"key":"LEG_AUX_QIANKUN_SHIFT","group":"legendary_tech","shape":"diagram_scroll"},{"cell":25,"col":1,"row":3,"key":"LEG_AUX_LINGXI_ONE_FINGER","group":"legendary_tech","shape":"diagram_scroll"},{"cell":26,"col":2,"row":3,"key":"LEG_LIGHT_LINGBO_STEP","group":"legendary_tech","shape":"cloud_scroll"},{"cell":27,"col":3,"row":3,"key":"LEG_LIGHT_MOON_BAT_SHADOW","group":"legendary_tech","shape":"cloud_scroll"},{"cell":28,"col":4,"row":3,"key":"LEG_FORB_STAR_ABSORBING_VORTEX","group":"legendary_tech","shape":"forbidden_tome"},{"cell":29,"col":5,"row":3,"key":"LEG_FORB_BLOOD_LOTUS_SACRIFICE","group":"legendary_tech","shape":"forbidden_tome"},{"cell":30,"col":6,"row":3,"key":"LEG_PASS_MINGYU_IMMORTAL_QI","group":"legendary_tech","shape":"jade_disc"},{"cell":31,"col":7,"row":3,"key":"LEG_PASS_NINE_YANG_MERIDIAN","group":"legendary_tech","shape":"jade_disc"},{"cell":32,"col":0,"row":4,"key":"LEG_PASS_DUGU_SWORD_HEART","group":"legendary_tech","shape":"jade_disc"},{"cell":33,"col":1,"row":4,"key":"PILL_HEAL_RED","group":"pill","shape":"pill_gourd"},{"cell":34,"col":2,"row":4,"key":"PILL_QI_AZURE","group":"pill","shape":"pill_orb"},{"cell":35,"col":3,"row":4,"key":"PILL_BREAK_GOLD","group":"pill","shape":"pill_orb"},{"cell":36,"col":4,"row":4,"key":"PILL_DETOX_EMERALD","group":"pill","shape":"pill_gourd"},{"cell":37,"col":5,"row":4,"key":"PILL_CALM_VIOLET","group":"pill","shape":"pill_orb"},{"cell":38,"col":6,"row":4,"key":"PILL_BODY_AMBER","group":"pill","shape":"pill_gourd"},{"cell":39,"col":7,"row":4,"key":"WPN_SWORD_COMMON","group":"weapon","shape":"sword"},{"cell":40,"col":0,"row":5,"key":"WPN_SABER_COMMON","group":"weapon","shape":"saber"},{"cell":41,"col":1,"row":5,"key":"WPN_SPEAR_COMMON","group":"weapon","shape":"spear"},{"cell":42,"col":2,"row":5,"key":"WPN_STAFF_COMMON","group":"weapon","shape":"staff"},{"cell":43,"col":3,"row":5,"key":"WPN_DAGGER_COMMON","group":"weapon","shape":"dagger"},{"cell":44,"col":4,"row":5,"key":"WPN_GAUNTLET_COMMON","group":"weapon","shape":"gauntlet"},{"cell":45,"col":5,"row":5,"key":"WPN_BOW_COMMON","group":"weapon","shape":"bow"},{"cell":46,"col":6,"row":5,"key":"EQP_ARMOR_ROBE","group":"armor","shape":"robe"},{"cell":47,"col":7,"row":5,"key":"EQP_ARMOR_HEAVY","group":"armor","shape":"plate_armor"},{"cell":48,"col":0,"row":6,"key":"EQP_HELM_CROWN","group":"armor","shape":"crown"},{"cell":49,"col":1,"row":6,"key":"EQP_BOOTS_STEP","group":"armor","shape":"boots"},{"cell":50,"col":2,"row":6,"key":"EQP_RING_PENDANT","group":"armor","shape":"jade_ring"},{"cell":51,"col":3,"row":6,"key":"EQP_TALISMAN_RELIC","group":"armor","shape":"talisman"},{"cell":52,"col":4,"row":6,"key":"MAT_HERB_LEAF","group":"material","shape":"herb"},{"cell":53,"col":5,"row":6,"key":"MAT_FLOWER_ROOT","group":"material","shape":"lotus_root"},{"cell":54,"col":6,"row":6,"key":"MAT_ORE_INGOT","group":"material","shape":"ore"},{"cell":55,"col":7,"row":6,"key":"MAT_JADE_CRYSTAL","group":"material","shape":"crystal"},{"cell":56,"col":0,"row":7,"key":"MAT_BEAST_CORE","group":"material","shape":"beast_core"},{"cell":57,"col":1,"row":7,"key":"MAT_BEAST_PART","group":"material","shape":"beast_claw"},{"cell":58,"col":2,"row":7,"key":"BOOK_TECH_SCROLL","group":"manual","shape":"tome_scroll"},{"cell":59,"col":3,"row":7,"key":"BOOK_SUBPATH_CRYSTAL","group":"manual","shape":"jade_disc"},{"cell":60,"col":4,"row":7,"key":"BOOK_RECIPE_SCROLL","group":"manual","shape":"recipe_roll"},{"cell":61,"col":5,"row":7,"key":"ITEM_PROVISION_STONE","group":"other","shape":"pouch_bowl"},{"cell":62,"col":6,"row":7,"key":"FALLBACK_UNKNOWN_LEGENDARY","group":"fallback","shape":"mythic_seal"},{"cell":63,"col":7,"row":7,"key":"FALLBACK_GENERIC","group":"fallback","shape":"chest_box"},{"cell":64,"col":0,"row":8,"key":"FISH_COMMON_SILVER","group":"fish","shape":"fish"},{"cell":65,"col":1,"row":8,"key":"FISH_REFINED_GOLD","group":"fish","shape":"fish"},{"cell":66,"col":2,"row":8,"key":"FISH_RARE_KOI_EEL","group":"fish","shape":"fish_koi"},{"cell":67,"col":3,"row":8,"key":"FISH_EXCEPTIONAL_STAR","group":"fish","shape":"fish_star"},{"cell":68,"col":4,"row":8,"key":"FISH_APEX_DRAGON","group":"fish","shape":"fish_dragon"},{"cell":69,"col":5,"row":8,"key":"FOOD_SPIRIT_FISH_DISH","group":"food","shape":"fish_dish"},{"cell":70,"col":6,"row":8,"key":"ITEM_MYSTERY_RIVER_CONTAINER","group":"container","shape":"river_chest"},{"cell":71,"col":7,"row":8,"key":"TRASH_RIVER_DEBRIS","group":"trash","shape":"river_trash"}];
  const ITEM_ATLAS_BY_KEY = {};
  ITEM_ATLAS_CELLS.forEach(c => { ITEM_ATLAS_BY_KEY[c.key] = c; });
  UI.ITEM_ATLAS_URI = ITEM_ATLAS_URI;
  UI.ITEM_ATLAS_CELLS = ITEM_ATLAS_CELLS;

  UI.getInvViewMode = () => {
    const o = UI.G && UI.G.opts;
    if (o && (o.invViewMode === "list" || o.invViewMode === "grid")) return o.invViewMode;
    try {
      const saved = localStorage.getItem("jh_inv_view_mode");
      if (saved === "list" || saved === "grid") return saved;
    } catch (e) {}
    return "grid";
  };

  UI.setInvViewMode = mode => {
    const m = mode === "list" ? "list" : "grid";
    if (UI.G && UI.G.opts) UI.G.opts.invViewMode = m;
    try {
      localStorage.setItem("jh_inv_view_mode", m);
      if (UI.G && UI.G.opts) localStorage.setItem("jhs_opts", JSON.stringify(UI.G.opts));
    } catch (e) {}
  };

  UI.broadCategoryOf = item => {
    if (!item) return "OTHER";
    const k = item.rawKind || item.kind || "";
    if (k === "PILL" || k === "CRAFTED_PILL" || k === "pill") return "PILL";
    if (k === "EQUIPPED" || k === "EQUIPMENT" || k === "gear") return "EQUIPMENT";
    if (k === "MATERIAL" || k === "ORGAN" || k === "mat") return "MATERIAL";
    if (k === "TECH_MANUAL" || k === "SUB_MANUAL" || k === "CRYSTAL" || k === "RECIPE_SCROLL" || k === "crystal" || k === "tech" || k === "sub_manual") return "MANUAL";
    return "OTHER";
  };

  UI.resolveItemAtlasCell = item => {
    if (!item) return ITEM_ATLAS_BY_KEY.FALLBACK_GENERIC;
    const rawId = String(item.templateId || item.itemId || item.id || item.key || "").replace(/^(P:|T:|S:)/, "");
    if (ITEM_ATLAS_BY_KEY[rawId]) return ITEM_ATLAS_BY_KEY[rawId];
    const eq = item.gear || item.eq || item;
    if (eq && eq.id && ITEM_ATLAS_BY_KEY[eq.id]) return ITEM_ATLAS_BY_KEY[eq.id];
    const isLeg = !!(item.legendary || (eq && eq.legendary) || item.rarity === "Legendary" || item.grade === "Legendary" || /^LEG_/.test(rawId));
    if (isLeg) return ITEM_ATLAS_BY_KEY.FALLBACK_UNKNOWN_LEGENDARY;

    const k = item.rawKind || item.kind || "";
    if (k === "PILL" || k === "CRAFTED_PILL" || k === "pill") {
      const pid = String(item.id || item.key || "");
      const info = (ECO && ECO.pillInfo && ECO.pillInfo(pid)) || {};
      const eff = info.effect || {};
      if (eff.breakthroughBonus || eff.btFor) return ITEM_ATLAS_BY_KEY.PILL_BREAK_GOLD;
      if (eff.clearToxic || eff.clearPoison || /DETOX|ANTIDOTE/.test(pid)) return ITEM_ATLAS_BY_KEY.PILL_DETOX_EMERALD;
      if (eff.clearHeartDemon || eff.insight || /CALM|MIND|SOUL/.test(pid)) return ITEM_ATLAS_BY_KEY.PILL_CALM_VIOLET;
      if (eff.cultivationProgress || eff.qiRestore || /QI/.test(pid)) return ITEM_ATLAS_BY_KEY.PILL_QI_AZURE;
      if (eff.cbBuff || eff.energyRestore || /VIGOR|BODY/.test(pid)) return ITEM_ATLAS_BY_KEY.PILL_BODY_AMBER;
      return ITEM_ATLAS_BY_KEY.PILL_HEAL_RED;
    }
    if (k === "EQUIPPED" || k === "EQUIPMENT" || k === "gear") {
      const slot = (eq && eq.slot) || item.slot || "WEAPON";
      const gType = (g.MARTIAL && g.MARTIAL.gearType) ? g.MARTIAL.gearType(eq) : (eq.gearType || eq.type || "");
      const nm = String(item.nameTh || (eq && eq.nameTh) || "");
      if (slot === "ARMOR") {
        if (/เกราะ|โลหะ|หนัก/.test(nm)) return ITEM_ATLAS_BY_KEY.EQP_ARMOR_HEAVY;
        if (/รองเท้า|บู๊ต/.test(nm)) return ITEM_ATLAS_BY_KEY.EQP_BOOTS_STEP;
        if (/หมวก|รัดเกล้า|มงกุฎ/.test(nm)) return ITEM_ATLAS_BY_KEY.EQP_HELM_CROWN;
        return ITEM_ATLAS_BY_KEY.EQP_ARMOR_ROBE;
      }
      if (slot === "ACCESSORY") {
        if (/ยันต์|ป้าย|ตรา|กระดิ่ง|เข็ม/.test(nm)) return ITEM_ATLAS_BY_KEY.EQP_TALISMAN_RELIC;
        return ITEM_ATLAS_BY_KEY.EQP_RING_PENDANT;
      }
      if (gType === "BLADE" || /ดาบ/.test(nm)) return ITEM_ATLAS_BY_KEY.WPN_SABER_COMMON;
      if (gType === "SPEAR" || /ทวน|หอก/.test(nm)) return ITEM_ATLAS_BY_KEY.WPN_SPEAR_COMMON;
      if (gType === "STAFF" || /พลอง|ไม้เท้า/.test(nm)) return ITEM_ATLAS_BY_KEY.WPN_STAFF_COMMON;
      if (gType === "DAGGER" || /มีดสั้น/.test(nm)) return ITEM_ATLAS_BY_KEY.WPN_DAGGER_COMMON;
      if (gType === "GAUNTLET" || gType === "FIST_PALM" || /สนับมือ|ถุงมือ/.test(nm)) return ITEM_ATLAS_BY_KEY.WPN_GAUNTLET_COMMON;
      if (gType === "BOW" || /ธนู|หน้าไม้/.test(nm)) return ITEM_ATLAS_BY_KEY.WPN_BOW_COMMON;
      return ITEM_ATLAS_BY_KEY.WPN_SWORD_COMMON;
    }
    if (rawId === "ITEM_MYSTERY_RIVER_CONTAINER" || k === "CONTAINER") return ITEM_ATLAS_BY_KEY.ITEM_MYSTERY_RIVER_CONTAINER;
    if (rawId === "TRASH_RIVER_DEBRIS" || k === "TRASH") return ITEM_ATLAS_BY_KEY.TRASH_RIVER_DEBRIS;
    if (/^FOOD_/.test(rawId) || k === "FOOD") return ITEM_ATLAS_BY_KEY.FOOD_SPIRIT_FISH_DISH;
    if (/^MAT_FISH_/.test(rawId) || k === "FISH") {
      const fTier = item.tier || (ECO.matById[rawId] && ECO.matById[rawId].tier) || 1;
      if (fTier >= 5) return ITEM_ATLAS_BY_KEY.FISH_APEX_DRAGON;
      if (fTier === 4) return ITEM_ATLAS_BY_KEY.FISH_EXCEPTIONAL_STAR;
      if (fTier === 3) return ITEM_ATLAS_BY_KEY.FISH_RARE_KOI_EEL;
      if (fTier === 2) return ITEM_ATLAS_BY_KEY.FISH_REFINED_GOLD;
      return ITEM_ATLAS_BY_KEY.FISH_COMMON_SILVER;
    }
    if (k === "ORGAN") return ITEM_ATLAS_BY_KEY.MAT_BEAST_CORE;
    if (k === "MATERIAL" || k === "mat") {
      if (/CORE|BLOOD|SOUL/.test(rawId)) return ITEM_ATLAS_BY_KEY.MAT_BEAST_CORE;
      if (/BEAST|FANG|CLAW|HIDE|BONE|SCALE|HORN|SHELL|VENOM|SILK|PEARL|FIN/.test(rawId)) return ITEM_ATLAS_BY_KEY.MAT_BEAST_PART;
      if (/JADE|CRYSTAL|ICE|GEM/.test(rawId)) return ITEM_ATLAS_BY_KEY.MAT_JADE_CRYSTAL;
      if (/ORE|IRON|COPPER|SILVER|GOLD|METAL|STONE|COAL/.test(rawId)) return ITEM_ATLAS_BY_KEY.MAT_ORE_INGOT;
      if (/LOTUS|FLOWER|ORCHID|GINSENG|ROOT|MUSHROOM|FRUIT/.test(rawId)) return ITEM_ATLAS_BY_KEY.MAT_FLOWER_ROOT;
      return ITEM_ATLAS_BY_KEY.MAT_HERB_LEAF;
    }
    if (k === "CRYSTAL" || k === "crystal") return ITEM_ATLAS_BY_KEY.BOOK_SUBPATH_CRYSTAL;
    if (k === "RECIPE_SCROLL") return ITEM_ATLAS_BY_KEY.BOOK_RECIPE_SCROLL;
    if (k === "TECH_MANUAL" || k === "SUB_MANUAL" || k === "tech" || k === "sub_manual") return ITEM_ATLAS_BY_KEY.BOOK_TECH_SCROLL;
    if (k === "PROVISION" || rawId === "grain" || rawId === "meal" || rawId === "stones") return ITEM_ATLAS_BY_KEY.ITEM_PROVISION_STONE;
    return ITEM_ATLAS_BY_KEY.FALLBACK_GENERIC;
  };

  UI.renderAtlasIconHtml = (item, sizePx) => {
    const cell = UI.resolveItemAtlasCell(item) || ITEM_ATLAS_BY_KEY.FALLBACK_GENERIC;
    const sz = sizePx || 40;
    const bgW = sz * 8;
    const bgH = sz * 9;
    const bx = -cell.col * sz;
    const by = -cell.row * sz;
    return "<div class=\"inv-atlas-ic\" data-atlas-cell=\"" + cell.cell + "\" data-atlas-key=\"" + esc(cell.key) + "\" style=\"width:" + sz + "px;height:" + sz + "px;background-image:url('" + ITEM_ATLAS_URI + "');background-size:" + bgW + "px " + bgH + "px;background-position:" + bx + "px " + by + "px\"></div>";
  };

  UI.calcGridPageSize = () => {
    const vw = (typeof window !== "undefined" && window.innerWidth) ? window.innerWidth : 412;
    const vh = (typeof window !== "undefined" && window.innerHeight) ? window.innerHeight : 800;
    const cols = vw >= 960 ? 10 : vw >= 600 ? 8 : vw >= 400 ? 6 : 5;
    const rows = vh < 680 ? 2 : 3;
    return { cols, rows, perPage: cols * rows };
  };

  function gradeChip(t) {
    if (!t) return '';
    const gKey = t.grade || (t.legendary ? 'Legendary' : 'Common');
    const gDef = (JD.MARTIAL && JD.MARTIAL.GRADES && JD.MARTIAL.GRADES[gKey]) || { nameTh: gKey, color: '#9aa5b1' };
    return '<span class="chip" style="border-color:' + gDef.color + ';color:' + gDef.color + ';font-size:10.5px">' + (t.legendary ? '★ ' : '') + esc(gDef.nameTh) + ' · T' + (t.tier || t.reqTier || 1) + '</span>';
  }

  /* ---------- Single-Pass Positional Linkify for NPCs and Buildings ---------- */
  function buildLogRefs(W, text, ids, refs) {
    const out = [];
    const seen = new Set();
    if (Array.isArray(refs)) {
      refs.forEach(r => {
        if (!r || !r.id || seen.has(r.kind + ':' + r.id)) return;
        seen.add(r.kind + ':' + r.id);
        const liveNpc = r.kind === 'npc' ? (W.byId && W.byId[r.id]) : null;
        const liveBld = r.kind === 'bld' ? (W.map && W.map.byId && W.map.byId[r.id]) : null;
        out.push({
          kind: r.kind || (liveBld ? 'bld' : 'npc'),
          id: r.id,
          label: r.label || (liveNpc ? liveNpc.h.name.given : liveBld ? liveBld.nameTh : r.id),
          currentLabel: liveNpc ? liveNpc.h.name.given : liveBld ? liveBld.nameTh : null,
          fullName: liveNpc ? HC.fullName(liveNpc) : (r.fullName || r.label || r.id),
          surname: liveNpc ? liveNpc.h.name.surname : '',
          role: liveNpc && SECT.title ? SECT.title(liveNpc) : (r.role || ''),
          exists: r.kind === 'bld' ? !!liveBld : !!liveNpc
        });
      });
    }
    (ids || []).forEach(id => {
      if (!id) return;
      const liveNpc = W.byId && W.byId[id];
      const liveBld = !liveNpc && W.map && W.map.byId && W.map.byId[id];
      const kind = liveBld ? 'bld' : 'npc';
      if (seen.has(kind + ':' + id)) return;
      seen.add(kind + ':' + id);
      if (liveNpc) {
        out.push({
          kind: 'npc',
          id,
          label: liveNpc.h.name.given,
          currentLabel: liveNpc.h.name.given,
          formerNames: Array.isArray(liveNpc.h.name.formerNames) ? liveNpc.h.name.formerNames : [],
          fullName: HC.fullName(liveNpc),
          surname: liveNpc.h.name.surname || '',
          role: SECT.title ? SECT.title(liveNpc) : '',
          exists: true
        });
      } else if (liveBld) {
        out.push({
          kind: 'bld',
          id,
          label: liveBld.nameTh,
          currentLabel: liveBld.nameTh,
          fullName: liveBld.nameTh,
          surname: '',
          role: 'อาคารสำนัก',
          exists: true
        });
      } else {
        const vis = (g.VC && g.VC.findVisitor) ? g.VC.findVisitor(W, id) : null;
        const clue = (W.world && W.world.clues && W.world.clues.active && W.world.clues.active[id]) || null;
        if (vis) {
          out.push({
            kind: 'visitor',
            id,
            label: vis.nameTh || id,
            currentLabel: vis.nameTh || id,
            fullName: (vis.nameTh || id) + (vis.titleTh ? ' · ' + vis.titleTh : ''),
            surname: '',
            role: vis.state === 'offsite' ? 'ผู้มาเยือน (เดินทางกลับแล้ว)' : 'ผู้มาเยือนจากยุทธภพ',
            exists: vis.state === 'admitted' || vis.state === 'restricted'
          });
        } else if (clue) {
          out.push({
            kind: 'clue',
            id,
            label: clue.titleTh || id,
            currentLabel: clue.titleTh || id,
            fullName: clue.titleTh || id,
            surname: '',
            role: 'เบาะแสยุทธภพ',
            exists: true
          });
        } else {
          out.push({
            kind: 'npc',
            id,
            label: id,
            currentLabel: null,
            fullName: id,
            surname: '',
            role: 'ไม่อยู่ในสำนักแล้ว',
            exists: false
          });
        }
      }
    });
    if (W && W.map && Array.isArray(W.map.buildings) && typeof text === 'string') {
      W.map.buildings.forEach(b => {
        if (b && b.nameTh && !seen.has('bld:' + b.id) && text.includes(b.nameTh)) {
          seen.add('bld:' + b.id);
          out.push({
            kind: 'bld',
            id: b.id,
            label: b.nameTh,
            currentLabel: b.nameTh,
            fullName: b.nameTh,
            surname: '',
            role: 'อาคารสำนัก',
            exists: true
          });
        }
      });
    }
    return out;
  }

  function renderEntityAnchor(ref, displayTxt, dupCount) {
    const disambig = (dupCount > 1 && ref.surname) ? ' (' + ref.surname + ')' : '';
    const title = ref.fullName + (ref.role ? ' · ' + ref.role : '');
    if (ref.kind === 'bld') {
      return '<a class="link-ref bld" data-bld="' + esc(ref.id) + '" title="' + esc(title) + '" style="color:#f2c96d;text-decoration:none;font-weight:600">' + esc(displayTxt) + '</a>';
    }
    if (ref.kind === 'visitor') {
      return '<a class="link-ref visitor" data-visitor="' + esc(ref.id) + '" title="' + esc(title) + '" style="color:#ffcb77;text-decoration:none;font-weight:600">🎐 ' + esc(displayTxt) + '</a>';
    }
    if (ref.kind === 'clue') {
      return '<a class="link-ref clue" data-clue="' + esc(ref.id) + '" title="' + esc(title) + '" style="color:#a8dadc;text-decoration:none;font-weight:600">🗺️ ' + esc(displayTxt) + '</a>';
    }
    if (!ref.exists) {
      return '<span class="link-ref gone" data-npc="' + esc(ref.id) + '" title="' + esc(title) + '" style="color:var(--muted);text-decoration:underline dotted;cursor:pointer">' + esc(displayTxt) + '</span>';
    }
    return '<a class="link-ref npc" data-npc="' + esc(ref.id) + '" title="' + esc(title) + '" style="color:#9bd7fa;text-decoration:none;font-weight:600">' + esc(displayTxt + disambig) + '</a>';
  }

  function linkify(W, text, ids, refs) {
    const raw = String(text == null ? '' : text);
    if (!W) return esc(raw);
    const refList = buildLogRefs(W, raw, ids, refs);
    if (!refList.length) return esc(raw);

    // Count duplicate labels among NPC refs in this entry
    const labelCounts = {};
    refList.filter(r => r.kind === 'npc').forEach(r => {
      const k = r.currentLabel || r.label;
      if (k) labelCounts[k] = (labelCounts[k] || 0) + 1;
    });

    // Single-pass positional matching: find earliest non-overlapping match for each ref in order, then any remaining occurrences
    const matches = [];
    const usedRanges = [];
    const overlaps = (s, e) => usedRanges.some(([a, b]) => s < b && e > a);

    // Pass 1: assign each ref in order to its first unclaimed occurrence in `raw`
    const matchedRefKeys = new Set();
    refList.forEach(ref => {
      const candidates = [ref.fullName, ref.label, ref.currentLabel].concat(ref.formerNames || []).filter(x => typeof x === 'string' && x.length > 0);
      for (const token of candidates) {
        let from = 0;
        let found = -1;
        while (from <= raw.length - token.length) {
          const idx = raw.indexOf(token, from);
          if (idx < 0) break;
          if (!overlaps(idx, idx + token.length)) {
            found = idx;
            break;
          }
          from = idx + 1;
        }
        if (found >= 0) {
          usedRanges.push([found, found + token.length]);
          matches.push({ start: found, end: found + token.length, token, ref });
          matchedRefKeys.add(ref.kind + ':' + ref.id);
          break;
        }
      }
    });

    // Pass 2: link any additional occurrences of unambiguous refs
    refList.forEach(ref => {
      const k = ref.currentLabel || ref.label;
      if ((labelCounts[k] || 0) > 1) return; // already matched positionally in Pass 1
      const candidates = [ref.fullName, ref.label, ref.currentLabel].concat(ref.formerNames || []).filter(x => typeof x === 'string' && x.length > 0);
      candidates.forEach(token => {
        let from = 0;
        while (from <= raw.length - token.length) {
          const idx = raw.indexOf(token, from);
          if (idx < 0) break;
          if (!overlaps(idx, idx + token.length)) {
            usedRanges.push([idx, idx + token.length]);
            matches.push({ start: idx, end: idx + token.length, token, ref });
          }
          from = idx + token.length;
        }
      });
    });

    matches.sort((a, b) => a.start - b.start);
    let out = '', cursor = 0;
    for (const m of matches) {
      if (m.start > cursor) out += esc(raw.slice(cursor, m.start));
      const k = m.ref.currentLabel || m.ref.label;
      const disp = (m.ref.currentLabel && m.ref.currentLabel !== m.token && m.token === m.ref.label)
        ? (m.ref.currentLabel + ' (' + m.token + ')')
        : m.token;
      out += renderEntityAnchor(m.ref, disp, labelCounts[k] || 1);
      cursor = m.end;
    }
    if (cursor < raw.length) out += esc(raw.slice(cursor));

    // Append clickable chips for any referenced entities that did not appear verbatim in text (e.g. renamed or legacy log)
    const unmatched = refList.filter(r => !matchedRefKeys.has(r.kind + ':' + r.id));
    if (unmatched.length) {
      out += ' <span class="log-ref-chips">' + unmatched.map(r => {
        const k = r.currentLabel || r.label || r.id;
        return '[' + renderEntityAnchor(r, k, labelCounts[k] || 1) + ']';
      }).join(' ') + '</span>';
    }
    return out;
  }
  UI.linkify = linkify;

  function actText(n) {
    if (n.dead) return '☠ เสียชีวิต'; if (n.away) { const ex = UI.G.W.world.expeds.find(e => e.id === n.expId); return '🧭 ออกภารกิจ' + (ex ? '「' + EXPED.MISSIONS[ex.kind].nameTh + '」' : ''); }
    if (n.travel) return n.travel.to === 'exit' ? '🚶 กำลังออกจากสำนัก' : '🚶 กำลังกลับเข้าสำนัก';
    const a = AI.ACTS[n.act.id]; let t = a ? a.icon + ' ' + a.nameTh : n.act.id === 'pair' ? '💬 พบปะ' : n.act.id === 'fight' ? '⚔️ ต่อสู้' : '🚶 เดินเล่น';
    if (n.act.id === 'pair' && n.act.ctx.pair) { const tp = { chat: 'พูดคุย', spar: 'ประลองฝีมือ', teach: 'สอนวิชา', date: 'พบกันตามลำพัง', argue: 'ทะเลาะ' }[n.act.ctx.pair.type]; const o = UI.G.W.byId[n.act.ctx.pair.partner]; t = '💬 ' + (tp || 'พบปะ') + (o ? 'กับ ' + o.h.name.given : ''); }
    if (n.act.stage === 'move' && n.act.id !== 'idle') t += ' (กำลังเดินไป)'; return t;
  }
  UI.actText = actText;

  /* ---------- HUD ---------- */
  UI.buildHud = () => {
    $('speedBar').innerHTML = SPEEDS.map(s => '<button type="button" data-sp="' + s[0] + '" title="' + (s[0] === 0 ? 'หยุดเวลา' : 'เร่งเวลา ' + s[0] + ' เท่า') + '" aria-label="' + (s[0] === 0 ? 'หยุดเวลา' : 'เร่งเวลา ' + s[0] + ' เท่า') + '">' + s[1] + '</button>').join('');
    $('speedBar').onclick = e => { const b = e.target.closest('button'); if (!b) return; UI.G.speed = +b.dataset.sp; if (UI.G.W) { UI.G.W.speed = UI.G.speed; UI.G.W.runtimeTiming = { pendingTicks: UI.G.acc || 0, speed: UI.G.speed }; } UI.updateHud(true); };
    document.querySelectorAll('#hudBottom button').forEach(b => b.onclick = () => UI.open(b.dataset.nav));
    $('shClose').onclick = () => UI.close();
    $('fZoomIn').onclick = () => UI.G.R.zoomAt(UI.G.R.vw / 2, UI.G.R.vh / 2, 1.35);
    $('fZoomOut').onclick = () => UI.G.R.zoomAt(UI.G.R.vw / 2, UI.G.R.vh / 2, 1 / 1.35);
    $('fHome').onclick = () => { UI.G.R.follow = false; UI.G.R.focus(118, 70, 0.9); };
    $('fFollow').onclick = () => { const R = UI.G.R; if (!R.selected) { UI.toast('เลือกตัวละครก่อน (แตะที่ตัวละครบนแผนที่)'); return; } R.follow = !R.follow; if (R.follow && R.cam.z < 1.6) R.cam.z = 2; $('fFollow').style.background = R.follow ? 'var(--gold)' : ''; };
    $('shBody').addEventListener('click', e => {
      const f = e.target.closest('[data-do]'); if (f) { UI.doAction(f.dataset.do, f.dataset.arg); return; }
      const a = e.target.closest('[data-npc]'); if (a) { UI.openNpc(a.dataset.npc); return; }
      const b = e.target.closest('[data-bld]'); if (b) { UI.openBuilding(b.dataset.bld); return; }
      const v = e.target.closest('[data-visitor]'); if (v) { UI.openVisitor(v.dataset.visitor); return; }
      const cl = e.target.closest('[data-clue]'); if (cl) { UI.openClue(cl.dataset.clue); return; }
    });
    $('toasts').addEventListener('click', e => { const t = e.target.closest('.toast'); if (t && t.dataset.npc) UI.focusNpc(t.dataset.npc); });
  };
  UI.updateHud = (force) => {
    const G = UI.G, W = G.W; if (!W) return; const now = performance.now(); if (!force && now - UI.lastHud < 250) return; UI.lastHud = now;
    const c = SIM.calendar(W.t); const wk = { clear: '☀️', cloud: '⛅', rain: '🌧️', snow: '❄️', fog: '🌫️' }[W.weather.kind] || '';
    $('dateTxt').title = SIM.SEASON_TH[c.season]; $('dateTxt').textContent = wk + ' ปี ' + c.year + ' ด.' + c.month + ' ว.' + c.dom + '  ' + U.pad2(c.hour) + ':' + U.pad2(c.minute) + ' · ' + SIM.SEASON_TH[c.season];
    document.querySelectorAll('#speedBar button').forEach(b => b.classList.toggle('on', +b.dataset.sp === G.speed));
    const alive = W.npcs.filter(n => !n.dead && !n.exiled), away = alive.filter(n => n.away).length; const S = W.sect;
    const pop = SECT.memberOccupancy ? SECT.memberOccupancy(W) : alive.length;
    const cap = SECT.housingCapacity ? SECT.housingCapacity(W) : 46;
    const raid = W.threat && W.threat.raid ? '<span class="pill" style="border-color:#ff8a3a;color:#ffb27a">⚠ ศัตรูบุก!</span>' : '';
    $('resRow').innerHTML = '<span class="pill" title="ศิลาวิญญาณ">💎 ' + UI.icon('stones') + '<b>' + U.fmtNum(S.stones) + '</b></span><span class="pill" title="เสบียงรวม">🍚 ' + UI.icon('food') + '<b>' + U.fmtNum(ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3) + '</b></span><span class="pill" title="สมาชิกปัจจุบัน / ความจุเตียงพัก">👥 ' + UI.icon('people') + '<b>' + pop + '/' + cap + '</b>' + (away ? ' (นอก ' + away + ')' : '') + '</span><span class="pill" title="ชื่อเสียงสำนัก">🏅 ' + UI.icon('fame') + '<b>' + U.fmtNum(S.fame) + '</b></span>' + raid + (G.acc >= 1 ? '<span class="pill" title="งานจำลองที่รอประมวลผลยังถูกเก็บไว้">⏳ รอ ' + Math.floor(G.acc) + ' นาทีเกม</span>' : '');
    const R = G.R, sel = R.selected && W.byId[R.selected]; const si = $('selInfo');
    if (sel && !UI.sheet) {
      si.classList.add('show'); const key = sel.id + ':' + sel.act.id + ':' + sel.rank + ':' + (sel.dead ? 1 : 0);
      if (si.dataset.key !== key || force) {
        si.dataset.key = key;
        si.innerHTML = portraitHtml(sel, 40) + '<div style="flex:1;min-width:0"><div style="font-weight:700">' + esc(HC.fullName(sel)) + ' <span class="muted">' + SECT.title(sel) + '</span></div><div class="muted" id="selAct"></div></div><button data-do="npc" data-arg="' + sel.id + '">ดูข้อมูล</button><button data-do="editnpc" data-arg="' + sel.id + '">✏️</button><button data-do="deselect">✕</button>';
        drawPortraits(si);
        si.querySelectorAll('button').forEach(b => b.onclick = () => UI.doAction(b.dataset.do, b.dataset.arg));
      }
      const sa = $('selAct'); if (sa) sa.textContent = actText(sel) + (sel.why && sel.why[0] && !sel.dead ? ' · เพราะ ' + sel.why[0][0] : '');
    } else si.classList.remove('show');
  };
  UI.toast = (text, type, npcId) => {
    const el = document.createElement('div'); el.className = 'toast t-' + (type || ''); el.textContent = text; if (npcId) el.dataset.npc = npcId; $('toasts').appendChild(el);
    while ($('toasts').children.length > 4) $('toasts').removeChild($('toasts').firstChild);
    setTimeout(() => { el.style.transition = 'opacity .4s'; el.style.opacity = 0; setTimeout(() => el.remove(), 450); }, 5200);
  };
  UI.onLog = e => { if (TOAST_TYPES.includes(e.type) && !UI.G.muted) { if (e.type === 'build' || e.type === 'research' || e.type === 'tournament' || (UI.G.speed <= 16)) UI.toast(e.text, e.type, e.ids[0]); } };

  /* ---------- แผ่นข้อมูล ---------- */
  UI.close = () => { UI.sheet = null; UI.tab = null; $('sheet').classList.remove('show'); document.querySelectorAll('#hudBottom button').forEach(b => b.classList.remove('on')); if (!UI.G.W) $('start').classList.remove('hidden'); UI.updateHud(true); };
  function show(kind, title, tabs, active, tall) {
    UI.sheet = kind; UI.tab = active; $('sheet').classList.add('show'); $('sheet').classList.toggle('tall', !!tall); $('shTitle').innerHTML = title;
    $('shTabs').style.display = tabs && tabs.length ? 'flex' : 'none';
    $('shTabs').innerHTML = (tabs || []).map(t => '<button data-t="' + t[0] + '" class="' + (t[0] === active ? 'on' : '') + '">' + t[1] + '</button>').join('');
    $('shTabs').onclick = e => { const b = e.target.closest('button'); if (b) { UI.tab = b.dataset.t; if (UI.sheet === 'log') UI.logFilters = new Set([UI.tab]); UI.render(); } };
    document.querySelectorAll('#hudBottom button').forEach(b => b.classList.toggle('on', b.dataset.nav === kind));
    $('selInfo').classList.remove('show');
  }
  UI.open = (kind, arg) => {
    if (!UI.G.W && kind !== 'menu') { UI.close(); return; }
    if (UI.sheet === kind && kind !== 'npc' && kind !== 'edit' && (!arg || UI.tab === arg)) { UI.close(); return; }
    if (kind === 'people') show('people', '👥 ผู้คนในสำนัก', [['rank', 'ตามระดับ'], ['act', 'กำลังทำอะไร'], ['cult', 'ตบะ'], ['mood', 'อารมณ์']], 'rank');
    else if (kind === 'sect') show('sect', '🏯 สำนัก', [['over', 'ภาพรวม'], ['policy', 'นโยบาย/นิสัยผู้นำ'], ['posts', 'ตำแหน่ง'], ['stock', 'คลัง'], ['shop', '🛒 ร้าน/คุณูปการ'], ['bld', 'อาคาร']], arg || 'over');
    else if (kind === 'log') show('log', '📜 บันทึกเหตุการณ์', Object.keys(LOG_GROUPS).map(k => [k, LOG_GROUPS[k][0]]), 'all');
    else if (kind === 'world') show('world', '🧭 ยุทธภพนอกสำนัก', [['exp', 'คณะเดินทาง'], ['visitors', '🎐 ผู้มาเยือน'], ['clues', '🗺️ เบาะแส/มรดก'], ['content', '🌿 พื้นที่/ตำรับ'], ['ecology', '🐾 อสูรและนิเวศ'], ['disc', '🔭 ค้นพบ'], ['sects', 'สำนักอื่น'], ['hist', 'ประวัติ']], arg || 'exp', true);
    else if (kind === 'edit') {
      const W = UI.G.W;
      if (!UI.editNpcId || !W.byId[UI.editNpcId] || W.byId[UI.editNpcId].dead) {
        UI.editNpcId = (UI.G.R && UI.G.R.selected && W.byId[UI.G.R.selected] && !W.byId[UI.G.R.selected].dead) ? UI.G.R.selected : W.sect.masterId;
      }
      UI.editDraft = null;
      show('edit', '✏️ ศูนย์แก้ไขตัวละครและเสกไอเทม', [['char', '🧙 แก้ไขตัวละคร'], ['spawn', '✨ เสกไอเทม'], ['bag', '🎒 จัดการถุง/คลัง'], ['backup', '💾 สำรองก่อนแก้']], arg || 'char', true);
    }
    else if (kind === 'menu') show('menu', UI.G.W ? '⚙️ เมนู' : '📂 โหลดเกมที่บันทึก', UI.G.W ? [['main', 'เกม'], ['set', 'ตั้งค่า'], ['tools', 'ผู้สังเกตการณ์'], ['about', 'เกี่ยวกับ']] : [], arg || 'main');
    UI.render();
  };
  UI.openEditNpc = (id, subTab) => {
    const W = UI.G.W;
    if (!W || !W.byId[id]) { UI.toast('ไม่พบข้อมูลตัวละครนี้'); return; }
    UI.editNpcId = id;
    UI.editDraft = null;
    if (subTab === 'spawn') UI.spawnDest = 'npc';
    show('edit', '✏️ ศูนย์แก้ไขตัวละครและเสกไอเทม', [['char', '🧙 แก้ไขตัวละคร'], ['spawn', '✨ เสกไอเทม'], ['bag', '🎒 จัดการถุง/คลัง'], ['backup', '💾 สำรองก่อนแก้']], subTab || 'char', true);
    UI.render();
  };
  UI.openNpc = (id, tab) => {
    const W = UI.G && UI.G.W;
    const n = W && W.byId[id];
    if (!n) { UI.toast('ไม่พบข้อมูลตัวละครนี้ (ออกจากสำนักหรือถูกลบแล้ว)'); return; }
    UI.G.R.selected = id; UI.npcId = id;
    show('npc', esc(HC.fullName(n)) + ' <span class="muted" style="font-weight:400">' + SECT.title(n) + '</span>', [['ov', 'ภาพรวม'], ['elem', 'ธาตุ/รากปราณ'], ['self', 'ตัวตน'], ['body', 'กาย'], ['mind', 'ปัญญา/สังคม'], ['skill', 'ทักษะ'], ['rel', 'ความสัมพันธ์'], ['life', 'ชีวิต'], ['cmp', 'เทียบกับ…']], tab || 'ov', true);
    UI.render();
  };
  UI.openBuilding = id => {
    const W = UI.G && UI.G.W;
    const b = W && W.map && W.map.byId[id];
    if (!b) { UI.toast('ไม่พบข้อมูลอาคารนี้'); return; }
    UI.bldId = id;
    show('building', esc(b.nameTh), [], null);
    UI.render();
  };
  UI.openVisitor = id => {
    const W = UI.G && UI.G.W;
    const v = (W && g.VC && g.VC.findVisitor) ? g.VC.findVisitor(W, id) : null;
    if (!v) { UI.toast('ไม่พบข้อมูลผู้มาเยือนนี้'); return; }
    UI.visitorId = id;
    show('visitor', '🎐 ' + esc(v.nameTh) + ' <span class="muted" style="font-weight:400">' + esc(v.titleTh || 'ผู้มาเยือน') + '</span>', [], null, true);
    UI.render();
  };
  UI.openClue = id => {
    const W = UI.G && UI.G.W;
    const cs = W && W.world && W.world.clues;
    const inst = cs && (cs.active[id] || (cs.history || []).find(x => x.instanceId === id));
    if (!inst) { UI.toast('ไม่พบข้อมูลเบาะแสนี้'); return; }
    UI.clueId = id;
    show('clue', '🗺️ ' + esc(inst.titleTh), [], null, true);
    UI.render();
  };
  UI.focusNpc = id => { const n = UI.G.W.byId[id]; if (!n) return; UI.G.R.selected = id; if (!n.away && !n.dead) { UI.G.R.focus(n.x, n.y, Math.max(UI.G.R.cam.z, 2)); } UI.updateHud(true); };

  UI.doAction = (a, arg) => {
    const G = UI.G, W = G.W;
    if (a === 'npc') UI.openNpc(arg);
    else if (a === 'editnpc') UI.openEditNpc(arg, 'char');
    else if (a === 'spawnnpc') UI.openEditNpc(arg, 'spawn');
    else if (a === 'open-spawn-sect') { UI.spawnDest = 'sect'; UI.open('edit', 'spawn'); }
    else if (a === 'deselect') { G.R.selected = null; G.R.follow = false; UI.updateHud(true); }
    else if (a === 'locate') { UI.close(); UI.focusNpc(arg); }
    else if (a === 'follow') { UI.close(); UI.focusNpc(arg); G.R.follow = true; G.R.cam.z = Math.max(G.R.cam.z, 2.2); $('fFollow').style.background = 'var(--gold)'; }
    else if (a === 'locb') { const b = W.map.byId[arg]; if (b) { UI.close(); G.R.follow = false; G.R.focus(b.x + b.w / 2, b.y + b.h / 2, 1.3); } }
    else if (a === 'locv') { const v = g.VC && g.VC.findVisitor ? g.VC.findVisitor(W, arg) : null; if (v && Number.isFinite(v.x) && Number.isFinite(v.y)) { UI.close(); G.R.follow = false; G.R.focus(v.x, v.y, Math.max(G.R.cam.z, 1.8)); } else UI.toast('ผู้มาเยือนนี้ไม่ได้อยู่ในเขตสำนักแล้ว'); }
    else if (a === 'toggle-clue-debug') { UI.showClueDebug = !UI.showClueDebug; UI.render(); }
    else if (a === 'open-visitor') { UI.openVisitor(arg); }
    else if (a === 'open-clue') { UI.openClue(arg); }
    else if (a === 'save') UI.saveSlot(arg);
    else if (a === 'load') UI.loadSlot(arg);
    else if (a === 'export') UI.exportFile();
    else if (a === 'import') $('impFile').click();
    else if (a === 'new') { UI.close(); UI.showStart(); }
    else if (a === 'tool') UI.tool(arg);
    else if (a === 'cmp') { UI.cmpId = arg; UI.render(); }
    else if (a === 'logfilter') { UI.toggleLogFilter(arg); }
    else if (a === 'logsubfilter') { UI.logSubFilter = arg || 'all'; UI.render(); }
    else if (a === 'apply-char-edit') { UI.applyCharEditFromDom(); }
    else if (a === 'undo-char-edit') {
      const res = SECT.EDITOR.undoLastEdit(W);
      UI.toast(res.ok ? ('ย้อนคืนค่าสถานะของ ' + res.nameTh + ' แล้ว') : res.reason);
      UI.editDraft = null;
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'heal-char-edit') {
      const n = W.byId[UI.editNpcId];
      if (n) {
        const res = SECT.EDITOR.applyCharacterEdit(W, n.id, { state: { hpPct: 100, qiPct: 100, energy: 100, stress: 0, heartDemon: 0, clearInjuries: true, clearToxic: true } });
        UI.toast(res.ok ? 'ฟื้นฟูพลังชีวิต ปราณ และรักษาอาการบาดเจ็บแล้ว' : res.reason);
        UI.editDraft = null;
        UI.render();
        UI.updateHud(true);
      }
    }
    else if (a === "spawn-item" || a === "spawn-equip-item" || a === "spawn-teach-item") {
      const [kind, id] = String(arg || "").split("|");
      const qtyEl = $("shBody") && $("shBody").querySelector("#spawnQty");
      const qualEl = $("shBody") && $("shBody").querySelector("#spawnQuality");
      const qty = qtyEl ? +qtyEl.value : (UI.spawnQty || 1);
      const quality = qualEl ? +qualEl.value : (UI.spawnQuality || 1);
      let res;
      if (a === "spawn-equip-item" && SECT.EDITOR.directCatalogAction) {
        res = SECT.EDITOR.directCatalogAction(W, { action: "equip", kind, id, npcId: UI.editNpcId, quality });
        UI.toast(res.ok ? ("เสกและสวมใส่ " + (res.equipped ? res.equipped.nameTh : id) + " สำเร็จ") : ("ไม่สำเร็จ: " + res.reason));
      } else if (a === "spawn-teach-item" && SECT.EDITOR.directCatalogAction) {
        res = SECT.EDITOR.directCatalogAction(W, { action: "teach", kind, id, npcId: UI.editNpcId });
        UI.toast(res.ok ? ("ถ่ายทอดวิชา「" + res.nameTh + "」สำเร็จ") : ("ไม่สำเร็จ: " + res.reason));
      } else {
        res = SECT.EDITOR.spawnItem(W, {
          kind,
          id,
          dest: UI.spawnDest || "sect",
          npcId: UI.editNpcId,
          qty,
          quality
        });
        UI.toast(res.ok ? ("เสก " + res.nameTh + " ×" + res.qty + " สำเร็จ") : ("เสกไม่สำเร็จ: " + res.reason));
      }
      UI.render();
      UI.updateHud(true);
    }
    else if (a === "spawn-page") {
      UI.spawnPage = Math.max(1, (UI.spawnPage || 1) + (+arg || 0));
      UI.render();
    }
    else if (a === 'equip-personal') {
      const [npcId, uid] = String(arg || '').split('|');
      const res = SECT.EDITOR.equipPersonalGear(W, npcId, uid);
      if (G.R && G.R.invalidate) G.R.invalidate();
      UI.toast(res.ok ? ('สวมใส่ ' + res.equipped.nameTh + ' แล้ว') : res.reason);
      UI.render();
    }
    else if (a === 'unequip-bag') {
      const [npcId, slot] = String(arg || '').split('|');
      const res = SECT.EDITOR.unequipGear(W, npcId, slot, false);
      UI.toast(res.ok ? ('ถอด ' + res.unequipped.nameTh + ' เก็บในถุงส่วนตัวแล้ว') : res.reason);
      UI.render();
    }
    else if (a === 'unequip-sect') {
      const [npcId, slot] = String(arg || '').split('|');
      const res = SECT.EDITOR.unequipGear(W, npcId, slot, true);
      UI.toast(res.ok ? ('ส่งคืน ' + res.unequipped.nameTh + ' เข้าคลังสำนักแล้ว') : res.reason);
      UI.render();
    }
    else if (a === 'equip-passive') {
      const [npcId, techId, slotIdx] = String(arg || '').split('|');
      const n = W.byId[npcId];
      if (!n || !g.MARTIAL || !g.MARTIAL.equipPassive) return;
      const res = g.MARTIAL.equipPassive(W, n, techId, slotIdx !== undefined && slotIdx !== '' ? +slotIdx : undefined);
      const t = CULT.tech(techId);
      UI.toast(res.ok ? ('บรรจุวิชาติดตัว「' + (t ? t.nameTh : techId) + '」ลงช่องวิชาติดตัวแล้ว') : (res.reason || 'ไม่สามารถบรรจุวิชาติดตัวได้'));
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'unequip-passive') {
      const [npcId, techId] = String(arg || '').split('|');
      const n = W.byId[npcId];
      if (!n || !g.MARTIAL || !g.MARTIAL.unequipPassive) return;
      const res = g.MARTIAL.unequipPassive(W, n, techId);
      const t = CULT.tech(techId);
      UI.toast(res.ok ? ('ถอดวิชาติดตัว「' + (t ? t.nameTh : techId) + '」ออกจากช่องวิชาติดตัวแล้ว') : (res.reason || 'ไม่สามารถถอดวิชาติดตัวได้'));
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'donate-personal') {
      const [npcId, kind, itemId] = String(arg || '').split('|');
      const n = W.byId[npcId];
      if (!n) return;
      let res = { ok: false, reason: 'ไม่รองรับ' };
      if (kind === 'EQUIPMENT') res = SECT.EDITOR.donatePersonalGear(W, npcId, itemId);
      else if (kind === 'MATERIAL') res = SECT.donateMat(W, n, itemId, 1);
      else if (kind === 'PILL') res = ECO.donatePersonalProduct(W, n, { kind: 'PILL', pillKey: itemId, qty: 1 });
      else if (kind === 'CRYSTAL') res = g.MARTIAL.donateCrystal(W, n, String(itemId).startsWith('S:') || String(itemId).startsWith('T:') ? itemId : ('S:' + itemId));
      else if (kind === 'TECH_MANUAL' || kind === 'SUB_MANUAL') res = g.MARTIAL.donateManual(W, n, itemId, kind === 'SUB_MANUAL' ? 'sub' : 'tech');
      else if (kind === 'RECIPE_SCROLL') res = g.CONTENT.donateRecipe(W, n, itemId);
      else if (kind === 'ORGAN') res = g.CONTENT.donateOrgan(W, n, itemId, 1);
      UI.toast(res && res.ok ? 'บริจาคเข้าคลังสำนักเรียบร้อย' : (res && res.reason ? res.reason : 'ไม่สามารถบริจาคได้'));
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'use-personal') {
      const [npcId, kind, itemId] = String(arg || '').split('|');
      const res = SECT.EDITOR.usePersonalItem(W, npcId, kind, itemId);
      UI.toast(res && res.ok ? 'ใช้งานไอเทมสำเร็จ' : (res && res.reason ? res.reason : 'ไม่สามารถใช้งานได้'));
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'set-inv-mode') {
      UI.setInvViewMode(arg);
      UI.render();
    }
    else if (a === 'bag-cat') {
      UI.bagCat = arg || 'ALL';
      UI.bagPage = 1;
      UI.render();
    }
    else if (a === 'bag-page') {
      UI.bagPage = Math.max(1, (UI.bagPage || 1) + (+arg || 0));
      UI.render();
    }
    else if (a === 'bag-sel') {
      UI.bagSelKey = arg;
      UI.render();
    }
    else if (a === 'bag-close-detail') {
      UI.bagSelKey = null;
      UI.bagMoreOpen = false;
      UI.render();
    }
    else if (a === 'bag-toggle-more') {
      UI.bagMoreOpen = !UI.bagMoreOpen;
      UI.render();
    }
    else if (a === 'stock-cat') {
      UI.stockCat = arg || 'ALL';
      UI.stockPage = 1;
      UI.render();
    }
    else if (a === 'stock-page') {
      UI.stockPage = Math.max(1, (UI.stockPage || 1) + (+arg || 0));
      UI.render();
    }
    else if (a === 'stock-sel') {
      UI.stockSelKey = arg;
      UI.render();
    }
    else if (a === 'stock-close-detail') {
      UI.stockSelKey = null;
      UI.stockMoreOpen = false;
      UI.render();
    }
    else if (a === 'stock-toggle-more') {
      UI.stockMoreOpen = !UI.stockMoreOpen;
      UI.render();
    }
    else if (a === 'stock-distribute-now') {
      const res = SECT.distributeSectStock ? SECT.distributeSectStock(W, { maxGifts: 4 }) : { gifted: 0 };
      UI.toast(res && res.gifted > 0 ? ('หอคลังจัดสรรไอเทมให้ศิษย์แล้ว ' + res.gifted + ' รายการ') : 'ยังไม่มีรายการส่วนเกินที่ตรงกับความต้องการของศิษย์ในขณะนี้');
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'shop-cat') {
      UI.shopCat = arg || 'ALL';
      UI.shopPage = 1;
      UI.render();
    }
    else if (a === 'shop-page') {
      UI.shopPage = Math.max(1, (UI.shopPage || 1) + (+arg || 0));
      UI.render();
    }
    else if (a === 'shop-sel') {
      UI.shopSelKey = arg;
      UI.render();
    }
    else if (a === 'shop-close-detail') {
      UI.shopSelKey = null;
      UI.shopMoreOpen = false;
      UI.render();
    }
    else if (a === 'shop-toggle-more') {
      UI.shopMoreOpen = !UI.shopMoreOpen;
      UI.render();
    }
    else if (a === 'shop-buy') {
      const [selKey, quotedStr] = String(arg || '').split('|');
      const quotedPrice = +quotedStr;
      const buyer = W.byId[UI.shopBuyerId] || W.byId[W.sect.masterId];
      if (!buyer || buyer.dead) { UI.toast('ไม่พบผู้ซื้อ'); return; }
      const item = buildSectShopItems(W).find(x => x.selKey === selKey);
      if (!item) { UI.toast('สินค้านี้หมดหรือไม่มีอยู่ในร้านแล้ว'); UI.render(); return; }
      if (item.shopKind === 'pill') {
        const ok = g.CPE.buy(W, buyer, { kind: 'pill', key: item.key, price: quotedPrice });
        UI.toast(ok ? (buyer.h.name.given + ' แลกซื้อ「' + item.nameTh + '」สำเร็จ (' + quotedPrice + ' คป.)') : 'ไม่สามารถแลกซื้อได้ (แต้ม คลัง หรือราคาเปลี่ยนไป)');
      } else if (item.shopKind === 'gear') {
        const ok = g.CPE.buy(W, buyer, { kind: 'gear', gear: item.gear, price: quotedPrice });
        if (ok && G.R && G.R.invalidate) G.R.invalidate();
        UI.toast(ok ? (buyer.h.name.given + ' แลกซื้อและสวมใส่「' + item.nameTh + '」สำเร็จ') : 'ไม่สามารถแลกซื้ออุปกรณ์นี้ได้ (ตรวจสอบแต้มหรือขั้นตบะ)');
      } else if (item.shopKind === 'crystal') {
        const ok = g.CPE.buy(W, buyer, { kind: 'crystal', key: item.key, price: quotedPrice });
        UI.toast(ok ? (buyer.h.name.given + ' แลกซื้อ「' + item.nameTh + '」เข้าถุงส่วนตัวสำเร็จ') : 'ไม่สามารถแลกซื้อผลึกนี้ได้ (ตรวจสอบวิถี ขั้นตบะ หรือแต้ม)');
      } else if (item.shopKind === 'tech_study') {
        const res = (g.MARTIAL && g.MARTIAL.startStudy) ? g.MARTIAL.startStudy(W, buyer, item.id) : { ok: false, reason: 'ไม่พบบริการศึกษา' };
        UI.toast(res && res.ok ? (buyer.h.name.given + ' เริ่มศึกษา「' + item.nameTh + '」แล้ว') : (res && res.reason ? res.reason : 'ไม่สามารถเริ่มศึกษาวิชานี้ได้'));
      }
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'open-bag-container') {
      const n = W.byId[arg];
      if (!n || !g.FISHING) return;
      const res = g.FISHING.openContainer(W, n);
      if (res && res.ok) {
        if (res.branch === 'TRASH') UI.toast(n.h.name.given + ' เปิดหีบไม้โบราณแช่น้ำ: พบเพียงเศษซากใต้น้ำไร้ค่า');
        else if (res.branch === 'LEGENDARY' && !res.fallbackUsed) UI.toast('🌟 ปาฏิหาริย์! ' + n.h.name.given + ' เปิดหีบได้สมบัติระดับตำนาน「' + res.drop.nameTh + '」!');
        else UI.toast(n.h.name.given + ' เปิดหีบได้รับ「' + res.drop.nameTh + '」(T' + res.drop.tier + ')');
      } else {
        UI.toast('ไม่มีหีบไม้โบราณแช่น้ำในถุงส่วนตัว');
      }
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'open-sect-container') {
      if (!g.FISHING) return;
      const master = W.byId[W.sect.masterId] || W.npcs.find(x => !x.dead);
      const res = g.FISHING.openContainer(W, master, { fromSectStock: true });
      if (res && res.ok) {
        if (res.branch === 'TRASH') UI.toast('เปิดหีบในคลังสำนัก: พบเพียงเศษซากใต้น้ำไร้ค่า');
        else if (res.branch === 'LEGENDARY' && !res.fallbackUsed) UI.toast('🌟 เปิดหีบคลังสำนักได้สมบัติระดับตำนาน「' + res.drop.nameTh + '」!');
        else UI.toast('เปิดหีบในคลังสำนัก ได้รับ「' + res.drop.nameTh + '」(T' + res.drop.tier + ')');
      } else {
        UI.toast('ไม่มีหีบไม้โบราณแช่น้ำในคลังสำนัก');
      }
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'discard-bag-trash') {
      const n = W.byId[arg];
      if (!n || !g.FISHING) return;
      const res = g.FISHING.discardTrash(W, n, false);
      UI.toast(res.ok ? ('ทิ้งเศษซากใต้น้ำไร้ค่า ×' + res.removed + ' แล้ว') : 'ไม่มีขยะใต้น้ำในถุง');
      UI.render();
    }
    else if (a === 'discard-sect-trash') {
      if (!g.FISHING) return;
      const res = g.FISHING.discardTrash(W, null, true);
      UI.toast(res.ok ? ('ทิ้งเศษซากใต้น้ำจากคลังสำนัก ×' + res.removed + ' แล้ว') : 'ไม่มีขยะใต้น้ำในคลัง');
      UI.render();
    }
    else if (a === 'eat-bag-dish') {
      const [npcId, dishId] = String(arg || '').split('|');
      const n = W.byId[npcId];
      if (!n || !g.FISHING) return;
      const res = g.FISHING.eatFishDish(W, n, dishId, false);
      UI.toast(res.ok ? (n.h.name.given + ' กิน「' + res.dish.nameTh + '」ได้รับบัฟ ' + (res.buff ? res.buff.nameTh : '')) : (res.reasonTh || 'ไม่สามารถกินอาหารนี้ได้'));
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'cook-bag-fish') {
      const [npcId, fishId] = String(arg || '').split('|');
      const n = W.byId[npcId];
      if (!n || !g.FISHING) return;
      const sp = g.FISHING.SPECIES_BY_ID[fishId];
      const dishId = (sp && sp.recipes && sp.recipes.find(r => r.startsWith('FOOD_'))) || 'FOOD_STEAMED_SPIRIT_FISH';
      const res = g.FISHING.cookDish(W, dishId, n, true);
      UI.toast(res.ok ? (n.h.name.given + ' ปรุง「' + res.dish.nameTh + '」สำเร็จ!') : 'วัตถุดิบปลาในถุงไม่พอสำหรับปรุงอาหาร');
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'cook-sect-fish') {
      const fishId = String(arg || '');
      if (!g.FISHING) return;
      const sp = g.FISHING.SPECIES_BY_ID[fishId];
      const dishId = (sp && sp.recipes && sp.recipes.find(r => r.startsWith('FOOD_'))) || 'FOOD_STEAMED_SPIRIT_FISH';
      const res = g.FISHING.cookDish(W, dishId, null, false);
      UI.toast(res.ok ? ('โรงครัวปรุง「' + res.dish.nameTh + '」×2 และเสบียงอาหารเข้าคลังแล้ว') : 'วัตถุดิบปลาในคลังไม่พอ');
      UI.render();
      UI.updateHud(true);
    }
    else if (a === 'fish-at-zone') {
      const zid = String(arg || 'river_central');
      const zdef = g.FISHING && g.FISHING.ZONES[zid];
      const target = (G.R && G.R.selected && W.byId[G.R.selected] && !W.byId[G.R.selected].dead) ? W.byId[G.R.selected] : W.byId[W.sect.masterId];
      if (!target || !zdef) { UI.toast('ไม่พบตัวละครที่จะส่งไปตกปลา'); return; }
      const st = AI.freeStation(W, target, 'fish', zdef.bkey);
      if (!st) { UI.toast('จุดตกปลาที่' + zdef.nameTh + ' เต็มทุกจุดในขณะนี้'); return; }
      const ok = AI.begin(W, target, 'riverFish', { st, zoneId: zid, bkey: zdef.bkey, mode: 'fish' });
      if (ok) {
        UI.close();
        UI.focusNpc(target.id);
        UI.toast('ส่ง ' + target.h.name.given + ' ไปตกปลาที่' + zdef.nameTh + ' แล้ว');
      } else {
        UI.toast('ไม่สามารถเดินทางไปยังจุดตกปลานี้ได้');
      }
    }
    else if (a === 'set-clue-approach') {
      const [instId, appId] = String(arg || '').split('|');
      const cs = g.VC && g.VC.ensure ? g.VC.ensure(W) : null;
      const inst = cs && cs.active && cs.active[instId];
      if (inst) {
        inst.preferredApproach = appId || 'auto';
        UI.toast('ตั้งแนวทางสืบค้นเบาะแสเป็น: ' + (appId || 'อัตโนมัติ'));
        UI.render();
      }
    }
  };

  UI.toggleLogFilter = cat => {
    if (!UI.logFilters) UI.logFilters = new Set(['all']);
    if (cat === 'all') {
      UI.logFilters = new Set(['all']);
      UI.tab = 'all';
    } else {
      UI.logFilters.delete('all');
      if (UI.logFilters.has(cat)) {
        UI.logFilters.delete(cat);
        if (UI.logFilters.size === 0) {
          UI.logFilters.add('all');
          UI.tab = 'all';
        }
      } else {
        UI.logFilters.add(cat);
        UI.tab = cat;
      }
    }
    UI.render();
  };

  UI.render = () => {
    const G = UI.G, W = G.W, body = $('shBody'); if (!UI.sheet) return; const keepScroll = body.scrollTop;
    let html = '';
    switch (UI.sheet) {
      case 'people': html = UI.rPeople(); break;
      case 'sect': html = UI.rSect(); break;
      case 'log': html = UI.rLog(); break;
      case 'world': html = UI.rWorld(); break;
      case 'edit': html = UI.rEdit(); break;
      case 'menu': html = UI.rMenu(); break;
      case 'npc': html = UI.rNpc(); break;
      case 'building': html = UI.rBuilding(); break;
      case 'visitor': html = UI.rVisitor(); break;
      case 'clue': html = UI.rClueDetail(); break;
    }
    const isWideInv = UI.getInvViewMode() === "grid" && ((UI.sheet === "sect" && (UI.tab === "stock" || UI.tab === "shop")) || UI.sheet === "npc" || (UI.sheet === "edit" && UI.tab === "bag"));
    $("sheet").classList.toggle("wide-inv", !!isWideInv);
    body.innerHTML = html; drawPortraits(body); body.scrollTop = keepScroll;
    const ivSel = body.querySelector("#invViewModeSel");
    if (ivSel) ivSel.onchange = () => { UI.setInvViewMode(ivSel.value); UI.render(); };
    body.querySelectorAll('[data-set]').forEach(el => el.onchange = () => { G.opts[el.dataset.set] = el.checked; UI.applyOpts(); if (UI.sheet === 'menu' && UI.tab === 'set') UI.render(); });
    const qSel = body.querySelector('#gfxQualitySel');
    if (qSel) qSel.onchange = () => { G.opts.quality = qSel.value; if (G.R) G.R._autoDowngraded = false; UI.applyOpts(); UI.render(); };
    const sf = body.querySelector('#npcSel'); if (sf) sf.onchange = () => { UI.cmpId = sf.value; UI.render(); };
    const q = body.querySelector('#pq'); if (q) { q.oninput = () => { UI.pq = q.value; UI.render(); const q2 = $('shBody').querySelector('#pq'); if (q2) { q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); } }; }
    UI.bindDynamicFilters(body);
  };

  UI.bindDynamicFilters = body => {
    // Sect stock filters
    const stSearch = body.querySelector('#stockSearch');
    if (stSearch) stSearch.oninput = () => { UI.stockSearch = stSearch.value; UI.render(); const el = $('shBody').querySelector('#stockSearch'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
    const stType = body.querySelector('#stockType');
    if (stType) stType.onchange = () => { UI.stockType = stType.value; UI.render(); };
    const stTier = body.querySelector('#stockTier');
    if (stTier) stTier.onchange = () => { UI.stockTier = stTier.value; UI.render(); };
    const stSort = body.querySelector('#stockSort');
    if (stSort) stSort.onchange = () => { UI.stockSort = stSort.value; UI.render(); };

    // Sect shop filters
    const shSearch = body.querySelector("#shopSearch");
    if (shSearch) shSearch.oninput = () => { UI.shopSearch = shSearch.value; UI.shopPage = 1; UI.render(); const el = $("shBody").querySelector("#shopSearch"); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
    const shSort = body.querySelector("#shopSort");
    if (shSort) shSort.onchange = () => { UI.shopSort = shSort.value; UI.shopPage = 1; UI.render(); };
    const shBuyer = body.querySelector("#shopBuyerSel");
    if (shBuyer) shBuyer.onchange = () => { UI.shopBuyerId = shBuyer.value; UI.render(); };

    // Personal bag filters
    const bgSearch = body.querySelector("#bagSearch");
    if (bgSearch) bgSearch.oninput = () => { UI.bagSearch = bgSearch.value; UI.bagPage = 1; UI.render(); const el = $("shBody").querySelector("#bagSearch"); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
    const bgType = body.querySelector('#bagType');
    if (bgType) bgType.onchange = () => { UI.bagType = bgType.value; UI.render(); };
    const bgSort = body.querySelector('#bagSort');
    if (bgSort) bgSort.onchange = () => { UI.bagSort = bgSort.value; UI.render(); };

    // Edit Hub selectors
    const edNpc = body.querySelector('#editNpcSel');
    if (edNpc) edNpc.onchange = () => { UI.editNpcId = edNpc.value; UI.editDraft = null; UI.render(); };
    const edGrp = body.querySelector('#editStatGroupSel');
    if (edGrp) edGrp.onchange = () => { UI.collectEditDraftFromDom(); UI.editStatGroup = edGrp.value; UI.render(); };
    const edPath = body.querySelector('#editCultPath');
    if (edPath) edPath.onchange = () => { UI.collectEditDraftFromDom(); UI.render(); };
    body.querySelectorAll('.edit-live-input').forEach(inp => {
      inp.onchange = () => { UI.collectEditDraftFromDom(); UI.updateEditPreviewDom(); };
      inp.oninput = () => { UI.collectEditDraftFromDom(); UI.updateEditPreviewDom(); };
    });

    const edRootCount = body.querySelector("#editRootCount");
    if (edRootCount) edRootCount.onchange = () => { UI.collectEditDraftFromDom(); UI.render(); };

    // Spawn filters
    const spDest = body.querySelector("#spawnDest");
    if (spDest) spDest.onchange = () => { UI.spawnDest = spDest.value; UI.spawnPage = 1; UI.render(); };
    const spSearch = body.querySelector("#spawnSearch");
    if (spSearch) spSearch.oninput = () => { UI.spawnSearch = spSearch.value; UI.spawnPage = 1; UI.render(); const el = $("shBody").querySelector("#spawnSearch"); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
    const spKind = body.querySelector("#spawnKind");
    if (spKind) spKind.onchange = () => { UI.spawnKind = spKind.value; UI.spawnPage = 1; UI.render(); };
    const spTier = body.querySelector("#spawnTier");
    if (spTier) spTier.onchange = () => { UI.spawnTier = spTier.value; UI.spawnPage = 1; UI.render(); };
    const spElem = body.querySelector("#spawnElement");
    if (spElem) spElem.onchange = () => { UI.spawnElement = spElem.value; UI.spawnPage = 1; UI.render(); };
    const spRar = body.querySelector("#spawnRarity");
    if (spRar) spRar.onchange = () => { UI.spawnRarity = spRar.value; UI.spawnPage = 1; UI.render(); };
    const spPageSize = body.querySelector("#spawnPageSize");
    if (spPageSize) spPageSize.onchange = () => { UI.spawnPageSize = +spPageSize.value || 40; UI.spawnPage = 1; UI.render(); };
    const spQty = body.querySelector("#spawnQty");
    if (spQty) spQty.onchange = () => { UI.spawnQty = Math.max(1, Math.min(50000, Math.floor(+spQty.value || 1))); };
    const spQual = body.querySelector("#spawnQuality");
    if (spQual) spQual.onchange = () => { UI.spawnQuality = +spQual.value || 1; };
  };

  UI.tick = () => { if (!UI.sheet || UI.sheet === 'menu' && UI.tab !== 'main' || UI.sheet === 'edit') return; const now = performance.now(); if (now - (UI.lastRender || 0) < 1200) return; if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT')) return; UI.lastRender = now; UI.render(); };

  /* ----- ผู้คน ----- */
  UI.rPeople = () => {
    const W = UI.G.W; let list = W.npcs.filter(n => !n.dead && !n.exiled); const q = (UI.pq || '').trim(); if (q) list = list.filter(n => HC.fullName(n).includes(q) || SECT.title(n).includes(q));
    const tab = UI.tab;
    if (tab === 'rank') list.sort((a, b) => b.rank - a.rank || (b.cult ? b.cult.stage : 0) - (a.cult ? a.cult.stage : 0));
    else if (tab === 'act') list.sort((a, b) => (a.away ? 'z' : a.act.id).localeCompare(b.away ? 'z' : b.act.id));
    else if (tab === 'cult') list.sort((a, b) => (b.cult ? CULT.power(b) : 0) - (a.cult ? CULT.power(a) : 0));
    else list.sort((a, b) => a.h.state.mood - b.h.state.mood);
    const cap = SECT.housingCapacity ? SECT.housingCapacity(W) : 46;
    const head = '<input id="pq" type="search" placeholder="ค้นหาชื่อ/ตำแหน่ง…" value="' + esc(UI.pq || '') + '" style="margin-bottom:8px"><div class="muted" style="margin-bottom:6px">สมาชิก ' + list.length + '/' + cap + ' คน (เพดานที่พักสูงสุด 100 คน) · แตะเพื่อดูตัวตนเต็ม</div>';
    return head + list.map(n => { const hpf = n.h.state.hp / CULT.hpMax(n); const sub = tab === 'cult' ? (n.cult ? CULT.stageName(n) + ' · พลัง ' + Math.round(CULT.power(n)) : 'ปุถุชน') : tab === 'mood' ? 'อารมณ์ ' + Math.round(n.h.state.mood) + ' · เครียด ' + Math.round(n.h.state.stress) + ' · พอใจสำนัก ' + Math.round(n.sat == null ? 60 : n.sat) : actText(n);
      return '<div class="prow" data-npc="' + n.id + '">' + portraitHtml(n, 42) + '<div class="pi"><div class="nm">' + esc(HC.fullName(n)) + ' <span class="chip ' + (n.rank >= 4 ? 'g' : '') + '" style="font-size:10.5px">' + SECT.title(n) + '</span></div><div class="sub">' + esc(sub) + '</div><div class="mini"><i style="width:' + clamp(hpf * 100, 0, 100) + '%;background:' + (hpf > .6 ? '#5fd38a' : hpf > .3 ? '#e8c43a' : '#e0584a') + '"></i></div></div></div>'; }).join('');
  };

  /* ----- Helper: Build Filtered Sect Stock & Shop Rows (Read-Only, Authoritative) ----- */
  function buildSectStockItems(W) {
    const S = W.sect;
    const rows = [];
    const getRes = id => (g.EXT && g.EXT.reserveForSect) ? g.EXT.reserveForSect(W, id) : (ECO.reserveFloor ? ECO.reserveFloor(W, id) : 2);
    // 1. Provisions & Stones
    if ((S.stones || 0) > 0) {
      rows.push({
        selKey: "ST:stones",
        kind: "PROVISION",
        rawKind: "PROVISION",
        broadCat: "OTHER",
        kindTh: "ทุนสำนัก",
        id: "stones",
        templateId: "stones",
        nameTh: "ศิลาวิญญาณสำนัก",
        tier: 2,
        rarity: "Common",
        qty: Math.round(S.stones || 0),
        value: Math.round(S.stones || 0),
        resFloor: 150,
        statusTh: "เงินทุนหมุนเวียนและค่าบำรุงอาคาร",
        descTh: "ใช้ก่อสร้าง ขยายหอพัก วิจัยตำรับ และซื้อขายกับพ่อค้าเร่ภายนอก",
        moreTh: "ศิลาคงคลัง: " + Math.round(S.stones || 0) + " ก้อน"
      });
    }
    ["grain", "meal"].forEach(id => {
      const qty = ECO.count(W, id);
      if (qty > 0) {
        const res = getRes(id);
        rows.push({
          selKey: "ST:" + id,
          kind: "PROVISION",
          rawKind: "PROVISION",
          broadCat: "OTHER",
          kindTh: "เสบียง",
          id,
          templateId: id,
          nameTh: ECO.name(id),
          tier: 1,
          rarity: "Common",
          qty,
          value: id === "meal" ? 4 : 2,
          resFloor: res,
          isShortage: qty < res,
          isSurplus: qty > res * 2,
          statusTh: qty > res ? "เพียงพอ (สำรอง " + res + ")" : "สำรองจำเป็น (" + qty + "/" + res + ")",
          descTh: id === "meal" ? "อาหารพร้อมกินสำหรับศิษย์และเสบียงเดินทาง" : "ข้าวสารสำหรับหุงเป็นอาหารในโรงครัว",
          moreTh: "เกณฑ์สำรองขั้นต่ำ: " + res + " หน่วย · คงเหลือจริง: " + qty + " หน่วย"
        });
      }
    });
    // 2. Stock pills & materials
    Object.keys(S.stock || {}).forEach(id => {
      if (id === "grain" || id === "meal") return;
      const qty = ECO.count(W, id);
      if (qty <= 0) return;
      const res = getRes(id);
      if (ECO.isPill(id)) {
        const info = ECO.pillInfo(id) || {};
        const tier = info.tier || 1;
        const qVal = ECO.pillQuality ? ECO.pillQuality(W, id) : 1;
        const price = (g.CPE && g.CPE.priceOf) ? g.CPE.priceOf(W, id) : tier * 10;
        rows.push({
          selKey: "ST:" + id,
          kind: "PILL",
          rawKind: "PILL",
          broadCat: "PILL",
          kindTh: "โอสถคลัง",
          id,
          templateId: id,
          nameTh: ECO.name(id),
          tier,
          rarity: tier >= 6 ? "Legendary" : tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common",
          qualityPct: Math.round(qVal * 100),
          qty,
          value: price,
          resFloor: res,
          isShortage: qty < res,
          isSurplus: qty > res,
          statusTh: qty > res ? "เกินสำรอง " + (qty - res) + " (พร้อมจัดสรร/ขาย)" : "สำรองคลัง (" + qty + "/" + res + ")",
          descTh: pillEffectSummaryTh(id),
          moreTh: "ราคาแลกในร้านสำนัก: " + price + " คป. · เกณฑ์สำรองคลัง: " + res + " เม็ด"
        });
      } else {
        const m = ECO.matById[id] || {};
        const tier = m.tier || 1;
        const isContainer = id === "ITEM_MYSTERY_RIVER_CONTAINER";
        const isTrash = id === "TRASH_RIVER_DEBRIS";
        const isDish = !!(g.FISHING && g.FISHING.isFishDish && g.FISHING.isFishDish(id));
        const isFish = !!(g.FISHING && g.FISHING.isFish && g.FISHING.isFish(id));
        const reward = (isContainer || isTrash) ? 0 : ((g.CPE && g.CPE.reward) ? Math.round(g.CPE.reward(W, id, 1)) : tier * 5);
        rows.push({
          selKey: "ST:" + id,
          kind: isContainer ? "CONTAINER" : isTrash ? "TRASH" : isDish ? "FOOD" : "MATERIAL",
          rawKind: isContainer ? "CONTAINER" : isTrash ? "TRASH" : isDish ? "FOOD" : "MATERIAL",
          broadCat: (isContainer || isTrash || isDish) ? "OTHER" : "MATERIAL",
          kindTh: isContainer ? "หีบปริศนาใต้น้ำ" : isTrash ? "ขยะใต้น้ำไร้ค่า" : isDish ? "อาหารปราณ" : isFish ? "ปลาปราณ" : "วัตถุดิบ",
          id,
          templateId: id,
          nameTh: ECO.name(id),
          tier,
          rarity: m.rarity || (tier >= 6 ? "Legendary" : tier >= 4 ? "Exceptional" : tier >= 3 ? "Rare" : "Common"),
          qty,
          value: reward,
          resFloor: (isContainer || isTrash) ? 0 : res,
          isShortage: !(isContainer || isTrash) && qty < res,
          isSurplus: !(isContainer || isTrash) && qty > res + 4,
          canOpenContainer: isContainer,
          canDiscardTrash: isTrash,
          canCookFish: isFish,
          statusTh: isContainer ? "พร้อมเปิดดูสิ่งของภายใน" : isTrash ? "ไม่มีมูลค่า (ทิ้งทำลายได้)" : isDish ? "อาหารพร้อมรับประทานในโรงครัว" : (qty > res ? "ส่วนเกิน +" + (qty - res) : "สำรองหอผลิต/โรงครัว (" + qty + "/" + res + ")"),
          descTh: m.descTh || "วัตถุดิบสำหรับหอโอสถและโรงหลอมศาสตรา",
          moreTh: isContainer ? "โอกาสเปิดได้: เศษซากใต้น้ำ 50.0% · ของทั่วไปตามลำดับขั้น 49.5% · สมบัติระดับตำนาน 0.5%" : isTrash ? "มูลค่า 0 ศิลา / 0 คป. ไม่สามารถขายหรือบริจาคได้" : ("แต้มรับบริจาค: " + reward + " คป./หน่วย · เกณฑ์สำรอง: " + res + " หน่วย")
        });
      }
    });
    // 3. Equipment
    (S.gear || []).forEach((eq, idx) => {
      if (!eq) return;
      const qVal = (g.VC && g.VC.gearQuality) ? g.VC.gearQuality(eq) : (eq.q || eq.quality || 1);
      const isLeg = !!(eq.legendary || eq.tier >= 6 || /^LEG_/.test(eq.id || ""));
      const tier = eq.tier || 1;
      const price = (g.CPE && g.CPE.gearPrice) ? g.CPE.gearPrice(W, eq) : tier * 25;
      rows.push({
        selKey: "ST_EQ:" + (eq.uid || eq.id || idx),
        kind: "EQUIPMENT",
        rawKind: "EQUIPMENT",
        broadCat: "EQUIPMENT",
        kindTh: isLeg ? "ศาสตราตำนาน" : "อุปกรณ์",
        id: eq.uid || eq.id,
        templateId: eq.id,
        eq,
        nameTh: (isLeg ? "★ " : "") + eq.nameTh,
        tier,
        rarity: isLeg ? "Legendary" : (tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common"),
        legendary: isLeg,
        qualityPct: Math.round(qVal * 100),
        qty: 1,
        value: price,
        resFloor: 1,
        statusTh: "ช่อง " + (eq.slot || "-") + " · คุณภาพ " + Math.round(qVal * 100) + "%",
        descTh: gearEffectSummaryTh(eq),
        moreTh: "ช่อง: " + (eq.slot || "-") + " · ขั้นขั้นต่ำ: " + (eq.minStage || 1) + " · ราคาแลกในร้าน: " + price + " คป."
      });
    });
    // 4. Crystals
    Object.keys(S.crystals || {}).forEach(subId => {
      const qty = S.crystals[subId] || 0;
      if (qty <= 0) return;
      const rawSub = subId.startsWith("S:") ? subId.slice(2) : subId;
      const subObj = CULT.subList.find(x => x.sub.id === rawSub);
      const kInfo = (g.MARTIAL && g.MARTIAL.knowledge) ? g.MARTIAL.knowledge(subId) : null;
      const tier = (kInfo && kInfo.tier) || 3;
      const price = (g.MARTIAL && g.MARTIAL.crystalPrice) ? g.MARTIAL.crystalPrice(W, subId) : tier * 35;
      rows.push({
        selKey: "ST_CR:" + subId,
        kind: "CRYSTAL",
        rawKind: "CRYSTAL",
        broadCat: "MANUAL",
        kindTh: "ผลึกสายย่อย",
        id: subId,
        templateId: rawSub,
        nameTh: (g.MARTIAL && g.MARTIAL.crystalName) ? g.MARTIAL.crystalName(subId) : ("ผลึก「" + (subObj ? subObj.sub.nameTh : subId) + "」"),
        tier,
        rarity: tier >= 6 ? "Legendary" : tier >= 4 ? "Exceptional" : "Rare",
        qty,
        value: price,
        resFloor: 0,
        statusTh: "พร้อมมอบให้ศิษย์วิถี " + (subObj ? subObj.path : (kInfo ? kInfo.path : "")),
        descTh: "ผลึกสืบทอดสายย่อยหรือวิชาเฉพาะทางในคลังสำนัก",
        moreTh: "ราคาแลกในร้านสำนัก: " + price + " คป. · บริจาคได้ไม่เกิน " + ((g.MARTIAL && g.MARTIAL.crystalReward) ? g.MARTIAL.crystalReward(W, subId) : 20) + " คป."
      });
    });
    // 5. Organs
    Object.keys(S.organs || {}).forEach(oid => {
      const qty = S.organs[oid] || 0;
      if (qty <= 0) return;
      const o = g.CONTENT && g.CONTENT.organById && g.CONTENT.organById[oid];
      const tier = o ? o.tier : 2;
      rows.push({
        selKey: "ST_ORG:" + oid,
        kind: "ORGAN",
        rawKind: "ORGAN",
        broadCat: "MATERIAL",
        kindTh: "อวัยวะอสูร",
        id: oid,
        templateId: oid,
        nameTh: o ? o.nameTh : oid,
        tier,
        rarity: tier >= 6 ? "Legendary" : tier >= 4 ? "Exceptional" : "Rare",
        qty,
        value: tier * 28,
        resFloor: 0,
        statusTh: "วัตถุดิบวิจัย/หลอมสกัด",
        descTh: o ? ("ธาตุ " + o.element + " · " + (o.usesTh || "ชิ้นส่วนอสูรกลายพันธุ์")) : "ชิ้นส่วนอสูรกลายพันธุ์",
        moreTh: o && o.propertyTags ? ("คุณสมบัติ: " + o.propertyTags.join(", ")) : "เก็บรักษาในคลังวิจัยสำนัก"
      });
    });
    // 6. Library Techniques (Read-Only Reference in Manual Category)
    (S.library || []).forEach(tid => {
      const t = CULT.tech(tid);
      if (!t) return;
      const isLeg = !!(t.legendary || t.grade === "Legendary" || /^LEG_/.test(tid));
      const tier = t.tier || t.reqTier || 1;
      const fee = (g.CPE && g.CPE.techPrice) ? g.CPE.techPrice(W, t) : tier * 25;
      rows.push({
        selKey: "ST_LIB:" + tid,
        kind: "TECH_MANUAL",
        rawKind: "TECH_MANUAL",
        broadCat: "MANUAL",
        kindTh: isLeg ? "คัมภีร์หอตำนาน" : "คัมภีร์ในหอ",
        id: tid,
        templateId: tid,
        nameTh: (isLeg ? "★ " : "") + "คัมภีร์「" + t.nameTh + "」",
        tier,
        rarity: isLeg ? "Legendary" : (tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common"),
        legendary: isLeg,
        qty: 1,
        value: fee,
        resFloor: 1,
        statusTh: "บรรจุในหอคัมภีร์ · ค่าเรียน " + fee + " คป.",
        descTh: (t.descTh || "คัมภีร์ประจำหอคัมภีร์") + " · วิถี " + (t.path || "ANY"),
        moreTh: "ระดับคุณภาพ: " + (t.grade || "Common") + " · ขั้นขั้นต่ำ: " + (t.reqTier || tier) + " · ศิษย์เรียนซ้ำได้ไม่จำกัดครั้ง"
      });
    });
    return rows;
  }
  UI.buildSectStockItems = buildSectStockItems;

  function buildSectShopItems(W) {
    const S = W.sect;
    const out = [];
    // 1. All shopItems from CPE.shopItems(W) (pills, gear, crystals)
    const rawShop = (g.CPE && g.CPE.shopItems) ? g.CPE.shopItems(W) : [];
    rawShop.forEach((it, idx) => {
      if (it.kind === "pill") {
        const info = ECO.pillInfo(it.key) || {};
        const tier = info.tier || 1;
        const isBasic = String(it.key).startsWith("P:BASIC");
        const qVal = ECO.pillQuality ? ECO.pillQuality(W, it.key) : 1;
        out.push({
          selKey: "SH_PILL:" + it.key,
          shopKind: "pill",
          kind: "PILL",
          rawKind: "PILL",
          broadCat: "PILL",
          kindTh: isBasic ? "โอสถพื้นฐาน" : "โอสถพรีเมียม",
          id: it.key,
          key: it.key,
          templateId: it.key,
          nameTh: ECO.name(it.key),
          tier,
          rarity: tier >= 6 ? "Legendary" : tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common",
          qualityPct: Math.round(qVal * 100),
          qty: it.n || ECO.count(W, it.key),
          price: it.price,
          value: it.price,
          descTh: pillEffectSummaryTh(it.key),
          moreTh: (isBasic ? "โอสถพื้นฐาน (แจกสวัสดิการเมื่อจำเป็น หรือแลกซื้อด้วย คป.)" : "โอสถพิเศษ ต้องแลกซื้อด้วยแต้มคุณูปการเท่านั้น") + " · รับบริจาคคืน ~" + Math.round((g.CPE && g.CPE.reward) ? g.CPE.reward(W, it.key, 1) : 4) + " คป."
        });
      } else if (it.kind === "gear" && it.gear) {
        const eq = it.gear;
        const qVal = (g.VC && g.VC.gearQuality) ? g.VC.gearQuality(eq) : (eq.q || eq.quality || 1);
        const isLeg = !!(eq.legendary || eq.tier >= 6 || /^LEG_/.test(eq.id || ""));
        const tier = eq.tier || 1;
        out.push({
          selKey: "SH_EQ:" + (eq.uid || eq.id || idx),
          shopKind: "gear",
          kind: "EQUIPMENT",
          rawKind: "EQUIPMENT",
          broadCat: "EQUIPMENT",
          kindTh: isLeg ? "ศาสตราตำนาน" : "อุปกรณ์ยุทธ์",
          id: eq.uid || eq.id,
          templateId: eq.id,
          gear: eq,
          eq,
          nameTh: (isLeg ? "★ " : "") + eq.nameTh,
          tier,
          rarity: isLeg ? "Legendary" : (tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common"),
          legendary: isLeg,
          qualityPct: Math.round(qVal * 100),
          qty: 1,
          price: it.price,
          value: it.price,
          descTh: "ช่อง " + (eq.slot || "-") + " · " + gearEffectSummaryTh(eq),
          moreTh: "ขั้นขั้นต่ำที่สวมใส่ได้: ขั้น " + (eq.minStage || 1) + " · คุณภาพ " + Math.round(qVal * 100) + "%"
        });
      } else if (it.kind === "crystal") {
        const kInfo = (g.MARTIAL && g.MARTIAL.knowledge) ? g.MARTIAL.knowledge(it.key) : null;
        const rawSub = String(it.key).replace(/^(S:|T:)/, "");
        const tier = (kInfo && kInfo.tier) || 3;
        out.push({
          selKey: "SH_CR:" + it.key,
          shopKind: "crystal",
          kind: "CRYSTAL",
          rawKind: "CRYSTAL",
          broadCat: "MANUAL",
          kindTh: "ผลึกความรู้",
          id: it.key,
          key: it.key,
          templateId: rawSub,
          nameTh: (g.MARTIAL && g.MARTIAL.crystalName) ? g.MARTIAL.crystalName(it.key) : it.key,
          tier,
          rarity: tier >= 6 ? "Legendary" : tier >= 4 ? "Exceptional" : "Rare",
          qty: it.n || 1,
          price: it.price,
          value: it.price,
          descTh: "วิถี " + ((kInfo && kInfo.path) || "ANY") + " · ใช้ซึมซับเปิดสายย่อยหรือวิชาโดยตรง",
          moreTh: "บริจาคคืนได้ไม่เกิน " + ((g.MARTIAL && g.MARTIAL.crystalReward) ? g.MARTIAL.crystalReward(W, it.key) : 20) + " คป."
        });
      }
    });
    // 2. Library Techniques requiring CP fee
    (S.library || []).forEach(tid => {
      const t = CULT.tech(tid);
      if (!t) return;
      const isFree = (g.CPE && g.CPE.techFree) ? g.CPE.techFree(W, t) : false;
      const price = isFree ? 0 : ((g.CPE && g.CPE.techPrice) ? g.CPE.techPrice(W, t) : (t.tier || 1) * 30);
      const isLeg = !!(t.legendary || t.grade === "Legendary" || /^LEG_/.test(tid));
      const tier = t.tier || t.reqTier || 1;
      out.push({
        selKey: "SH_TECH:" + tid,
        shopKind: "tech_study",
        kind: "TECH_MANUAL",
        rawKind: "TECH_MANUAL",
        broadCat: "MANUAL",
        kindTh: isLeg ? "ศึกษาวิชาตำนาน" : "ศึกษาคัมภีร์หอ",
        id: tid,
        key: tid,
        templateId: tid,
        tech: t,
        nameTh: (isLeg ? "★ " : "") + "วิชา「" + t.nameTh + "」",
        tier,
        rarity: isLeg ? "Legendary" : (tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common"),
        legendary: isLeg,
        qty: 1,
        price,
        value: price,
        descTh: (t.descTh || "คัมภีร์ในหอคัมภีร์") + " · วิถี " + (t.path || "ANY") + " · ขั้นขั้นต่ำ " + (t.reqTier || tier),
        moreTh: isFree ? "วิชาพื้นฐานของสำนัก (เรียนฟรี 0 คป.)" : ("ค่าธรรมเนียมศึกษาจากหอคัมภีร์ " + price + " คป. (คัมภีร์คงอยู่ในหอถาวร)")
      });
    });
    // 3. Buyback / Donation Bounties (Materials in OTHER/MATERIAL)
    ["MAT_HERB_DEW_GRASS_1", "MAT_HERB_JADE_LOTUS_2", "MAT_HERB_BLOOD_GINSENG_3"].forEach(mid => {
      const m = ECO.matById[mid] || {};
      const tier = m.tier || 1;
      const reward = (g.CPE && g.CPE.reward) ? Math.round(g.CPE.reward(W, mid, 1)) : tier * 6;
      const have = ECO.count(W, mid);
      out.push({
        selKey: "SH_BOUNTY:" + mid,
        shopKind: "bounty_mat",
        kind: "MATERIAL",
        rawKind: "MATERIAL",
        broadCat: "MATERIAL",
        kindTh: "ป้ายรับซื้อสมุนไพร",
        id: mid,
        key: mid,
        templateId: mid,
        nameTh: "รับบริจาค: " + ECO.name(mid),
        tier,
        rarity: tier >= 3 ? "Rare" : "Common",
        qty: have,
        price: reward,
        value: reward,
        descTh: "สำนักรับบริจาคเข้าคลัง ให้รางวัล +" + reward + " คป./หน่วย (ในคลังมี " + have + " หน่วย)",
        moreTh: "ศิษย์ที่มีสมุนไพรนี้ในถุงส่วนตัวสามารถนำมาบริจาคเพื่อรับแต้มคุณูปการได้ทันที"
      });
    });
    return out;
  }
  UI.buildSectShopItems = buildSectShopItems;

  /* ----- สำนัก ----- */
  UI.rSect = () => {
    const W = UI.G.W, S = W.sect, m = W.byId[S.masterId], tab = UI.tab; let h = '';
    if (tab === 'over') {
      const alive = W.npcs.filter(n => !n.dead && !n.exiled);
      const pop = SECT.memberOccupancy ? SECT.memberOccupancy(W) : alive.length;
      const cap = SECT.housingCapacity ? SECT.housingCapacity(W) : 46;
      const maxCap = SECT.maxHousingCapacity ? SECT.maxHousingCapacity() : 100;
      const byRank = SECT.RANKS.map(r => alive.filter(n => n.rank === r.id).length);
      h += '<div class="prow" data-npc="' + m.id + '">' + portraitHtml(m, 54) + '<div class="pi"><div class="nm" style="font-size:15px">' + esc(S.name) + '</div><div class="sub">เจ้าสำนัก: ' + esc(HC.fullName(m)) + ' · ' + HC.ageText(m) + ' · ' + esc(HC.identity(m).title) + '</div></div></div>';
      h += '<div class="card"><div class="grid2"><div>👥 สมาชิก <b>' + pop + '/' + cap + '</b> <span class="muted">(สูงสุด ' + maxCap + ')</span></div><div>🏅 ชื่อเสียง <b>' + U.fmtNum(S.fame) + '</b></div><div>💎 ศิลาวิญญาณ <b>' + U.fmtNum(S.stones) + '</b></div><div>😊 ความพึงพอใจ <b>' + Math.round(W.avgSat) + '</b></div><div>🍚 ข้าว/อาหาร <b>' + ECO.count(W, 'grain') + '/' + ECO.count(W, 'meal') + '</b></div><div>☠ ผู้เสียชีวิตสะสม <b>' + (W.deaths || 0) + '</b></div></div></div>';
      if (S.queue && S.queue.length) {
        h += '<h3>🚪 ผู้สมัครรอหน้าประตู (' + S.queue.length + '/' + (SECT.MAX_QUEUE || 6) + ')</h3><div class="card">' + S.queue.map(q => {
          const ca = SECT.observableCapability ? SECT.observableCapability(W, q) : { summaryTh: 'พื้นฐานทั่วไป' };
          return '<div class="sub" style="padding:3px 0;border-bottom:1px dotted var(--line)"><b>' + esc(q.h.name.given) + '</b> · ' + esc(q.h.origin.cls) + ' จาก' + esc(q.h.origin.region) + ' · รอมา ' + (W.day - q.joinDay) + ' วัน<br><span class="muted">การประเมินเบื้องต้น (CA): ' + esc(ca.summaryTh) + '</span></div>';
        }).join('') + '<div class="sub" style="margin-top:4px">' + (SECT.holder(W, 'registry') ? 'ผู้อาวุโสหอทะเบียนเป็นผู้พิจารณา' : 'เจ้าสำนักเป็นผู้พิจารณาเอง') + ' (ประเมินจากรูปลักษณ์และทักษะที่สังเกตได้ ไม่ทราบพรสวรรค์ซ่อนเร้น)</div></div>';
      }
      h += '<h3>จำนวนตามระดับ</h3><div class="card">' + SECT.RANKS.slice().reverse().map(r => '<span class="chip" style="border-color:' + r.color + '">' + r.nameTh + ' ' + byRank[r.id] + '</span>').join('') + '</div>';
      const cult = { XIAN: 0, BODY: 0, GOD: 0, DEMON: 0, HEART_SOUL: 0, none: 0 }; alive.forEach(n => { const k = n.cult && cult[n.cult.path] != null ? n.cult.path : 'none'; cult[k]++; });
      h += '<h3>วิถีที่เดิน</h3><div class="card"><span class="chip b">เซียน ' + cult.XIAN + '</span><span class="chip r">กายา ' + cult.BODY + '</span><span class="chip g">เทพศรัทธา ' + cult.GOD + '</span><span class="chip v">มารอสูร ' + cult.DEMON + '</span><span class="chip b">จิต·เซน ' + cult.HEART_SOUL + '</span><span class="chip">ปุถุชน ' + cult.none + '</span></div>';
      if (S.research) h += '<h3>งานวิจัย</h3><div class="card">ตำรับระดับ ' + S.research.tier + ' ' + bar('ความคืบหน้า', S.research.progress / S.research.need * 100, { wide: true, txt: Math.round(S.research.progress / S.research.need * 100) + '%' }) + '</div>';
      if (S.tournament) h += '<div class="card">🏆 ประลองยุทธ์: ' + (S.tournament.state === 'announce' ? 'ประกาศแล้ว จะเริ่มอีก ' + Math.max(0, Math.round((S.tournament.start - W.t) / 60)) + ' ชม.' : 'กำลังแข่ง เหลือ ' + (S.tournament.alive || []).length + ' คน') + '</div>';
      if (S.festival && S.festival.until > W.t) h += '<div class="card">🎎 งานเลี้ยงกำลังจัดอยู่</div>';
      const sf = (S.fallen || []).slice(-5).reverse(); if (sf.length) h += '<h3>ผู้ล่วงลับล่าสุด</h3><div class="card">' + sf.map(f => '<div class="muted">☠ ' + esc(f.name) + ' — ' + esc(f.why) + ' (' + dayStamp(f.day * 1440) + ')</div>').join('') + '</div>';
    } else if (tab === 'policy') {
      h += '<div class="muted" style="margin-bottom:6px">นโยบายของสำนักคือผลรวมของ <b>ตัวตนเจ้าสำนัก 78% · รองเจ้าสำนัก 14% · ผู้อาวุโส 8%</b> และค่อย ๆ เปลี่ยนไปเดือนละ 20% เมื่อเปลี่ยนผู้นำ</div><h3>ท่าทีของสำนักตอนนี้</h3><div class="card">';
      Object.keys(SECT.POLICY_TH).forEach(k => { h += bar(SECT.POLICY_TH[k], S.policy[k], { wide: true, txt: SECT.policyLabel(k, S.policy[k]), color: '#4fb2f2' }); });
      h += '</div><h3>สิ่งที่สำนักให้ความสำคัญ</h3><div class="card">';
      Object.keys(SECT.FOCUS_TH).forEach(k => { h += bar(SECT.FOCUS_TH[k], S.policy.focus[k] * 100, { wide: true, txt: Math.round(S.policy.focus[k] * 100) + '%', color: '#b58cf0' }); });
      h += '</div><h3>นิสัยเจ้าสำนักที่ส่งผล</h3><div class="card">';
      ['ambition', 'discipline', 'empathy', 'integrity', 'caution', 'courage', 'pride', 'rationality'].forEach(k => { h += bar(HC.nameOf('personality.' + k), HC.eff(m, 'personality.' + k), { wide: true }); }); h += '</div>';
      const tr = SECT.holder(W, 'treasury') || m;
      const merVal = Math.round(S.policy.meritocracy);
      h += '<h3>การจัดสรรสวัสดิการและการบริหารทรัพยากร</h3><div class="card">';
      h += bar('ยึดความสามารถและความจำเป็น', merVal, { wide: true, color: '#5fd38a', txt: merVal + '%' });
      h += bar('ความเอนเอียงตามสายสัมพันธ์', 100 - merVal, { wide: true, color: '#f0a030', txt: (100 - merVal) + '%' });
      if (tr) {
        h += '<div class="muted" style="margin-top:6px">ผู้ดูแลคลัง: <b>' + esc(HC.fullName(tr)) + '</b> · ความซื่อตรง ' + Math.round(HC.eff(tr, 'personality.integrity')) + '% · ความใจกว้าง ' + Math.round((g.CPE.S(W).welfare || 0.5) * 100) + '%</div>';
      }
      const hist = (S.welfareHistory || []).slice(0, 5);
      if (hist.length) {
        h += '<div style="margin-top:8px;font-size:12px"><b>ประวัติการแจกจ่ายล่าสุด:</b><br>' + hist.map(wh => '<div style="padding:2px 0;border-bottom:1px dotted var(--line,#3a3f4a)">• วันที่ ' + wh.day + ' · ผู้ดูแล ' + esc(wh.treasurerName) + ' · แจก ' + wh.given + ' เม็ด (ความชอบธรรม ' + wh.meritocracy + '%)' + (wh.passedOverCount > 0 ? ' · มีผู้จำเป็นตกค้าง ' + wh.passedOverCount + ' คน' : '') + '</div>').join('') + '</div>';
      }
      h += '</div>';
      const recent = W.logs.filter(l => l.type === 'decision').slice(-6).reverse(); if (recent.length) h += '<h3>การตัดสินใจล่าสุดของเจ้าสำนัก</h3><div class="card">' + recent.map(l => '<div class="logrow"><span class="tm">' + dayStamp(l.t) + '</span>' + linkify(W, l.text, l.ids, l.refs) + '</div>').join('') + '</div>';
    } else if (tab === 'posts') {
      h += '<div class="card"><b>ตำแหน่งบริหาร</b><div class="muted">ผู้นำเลือกคนตามความสามารถหรือความสนิท ขึ้นกับนโยบาย "ยึดความสามารถ" ' + Math.round(S.policy.meritocracy) + '</div></div>';
      const slots = [['เจ้าสำนัก', W.byId[S.masterId]], ['รองเจ้าสำนัก', W.byId[S.deputyId]]].concat(SECT.POST_IDS.map(p => [SECT.POSTS[p].nameTh, SECT.holder(W, p), SECT.POSTS[p].desc, SECT.officeState(W, p)]));
      h += slots.map(s => { const n = s[1]; return '<div class="prow" ' + (n ? 'data-npc="' + n.id + '"' : '') + '>' + (n ? portraitHtml(n, 40) : '<div style="width:40px;height:40px;border-radius:10px;background:#0e141b;display:flex;align-items:center;justify-content:center">—</div>') + '<div class="pi"><div class="nm">' + s[0] + '</div><div class="sub">' + (n ? esc(HC.fullName(n)) + ' · ' + (n.cult ? CULT.stageName(n) : 'ปุถุชน') : s[3] && !s[3].enabled ? '🔒 ยังไม่ปลดล็อก · ' + esc(s[3].reason) : 'ว่าง · เจ้าสำนักกำลังพิจารณาคนที่เหมาะสม') + '</div><div class="sub">' + esc(s[2] || '') + '</div></div></div>'; }).join('');
      const locked = Object.entries(SECT.PLANNED_POSTS).filter(([id]) => !SECT.POSTS[id]);
      h += '<h3>ตำแหน่งที่เตรียมไว้สำหรับอนาคต</h3><div class="card muted">เมื่อระบบรองรับเปิดใช้งาน เจ้าสำนักจึงจะพิจารณาหาคนมาประจำ</div>';
      h += locked.map(([id, p]) => '<div class="card" data-locked-office="' + id + '"><b>🔒 ' + esc(p.nameTh) + ' · ยังไม่ปลดล็อก</b><div class="muted">รอ' + esc(p.requires) + '</div></div>').join('');
    } else if (tab === 'stock') {
      h += '<div class="card"><div class="grid2"><div>💎 ศิลา <b>' + U.fmtNum(S.stones) + '</b></div><div>🌾 ข้าว <b>' + ECO.count(W, 'grain') + '</b></div><div>🍚 อาหารปรุง <b>' + ECO.count(W, 'meal') + '</b></div><div>⚔ อุปกรณ์ในคลัง <b>' + S.gear.length + '</b></div><div>📚 คัมภีร์ในหอ <b>' + S.library.length + '</b></div><div>🔬 ตำรับระดับ <b>' + S.recipeTier + '</b></div></div><div style="margin-top:8px"><button class="btn pri" data-do="open-spawn-sect">✨ เสกไอเทมเข้าคลังสำนัก</button></div></div>';
      const rd = S.reserveDirectives || {};
      const popN = Math.max(1, W.npcs.filter(n => !n.dead).length);
      const curMeal = ECO.count(W, 'meal'), curGrain = ECO.count(W, 'grain');
      const medRes = rd.medicine || {};
      h += '<h3>คำสั่งสำรองคลังและความปลอดภัยการเดินทาง</h3><div class="card">';
      h += '<div class="grid2">';
      h += '<div>🍚 อาหารสำรองขั้นต่ำ <b>' + curMeal + '/' + (rd.minMealReserve || 20) + '</b></div>';
      h += '<div>🌾 ข้าวสารสำรอง <b>' + curGrain + '/' + (popN * (rd.minGrainDays || 14)) + ' (' + (rd.minGrainDays || 14) + ' วัน)</b></div>';
      h += '<div>🛡️ เกณฑ์ฉุกเฉินเดินทาง <b>' + (rd.expeditionMinSafetyMeal || 15) + ' ชุด</b></div>';
      h += '<div>🎒 เพดานเบิกเดินทาง <b>' + (rd.expeditionMealCap || 18) + ' มื้อ/คน</b></div>';
      h += '</div>';
      h += '<div style="margin-top:6px;font-size:12px"><b>สำรองโอสถฉุกเฉิน:</b> ' + Object.keys(medRes).map(k => esc(ECO.name(k)) + ' ' + ECO.count(W, k) + '/' + medRes[k]).join(' · ') + '</div>';
      h += '</div>';

      const shorts = S.shortageDirectives || [];
      h += '<h3>คำสั่งจัดการของขาดแคลน (' + shorts.length + ')</h3><div class="card">';
      if (shorts.length) {
        h += shorts.map(sd => {
          const priCol = sd.priority === 'critical' ? '#e0584a' : sd.priority === 'high' ? '#f0a030' : '#4fb2f2';
          const priTh = sd.priority === 'critical' ? 'วิกฤต' : sd.priority === 'high' ? 'ขาดแคลน' : 'ควรเติม';
          return '<div class="logrow"><span><span class="chip" style="border-color:' + priCol + ';color:' + priCol + '">' + priTh + '</span> <b>' + esc(sd.nameTh) + '</b> ขาด ' + Math.ceil(sd.deficit) + ' (มี ' + sd.current + '/' + sd.needed + ') <span class="muted">— ' + esc(sd.reason) + '</span></span></div>';
        }).join('');
      } else {
        h += '<span class="muted">ไม่มีรายการขาดแคลน คลังสำรองอยู่ในเกณฑ์ปลอดภัย</span>';
      }
      h += '</div>';

      if (ECO.inventoryIntelligence) {
        const intel = ECO.inventoryIntelligence(W);
        h += '<h3>📊 ปัญญาประดิษฐ์คลังและอัตราหมุนเวียน (Inventory Intelligence)</h3><div class="card">';
        h += '<div class="sub" style="margin-bottom:6px">ประเมินอัตราการใช้ย้อนหลัง 14/30 วัน เพื่อแบ่งประเภทสินค้า ป้องกันของขาดและหาของล้นขายตลาดภายนอก</div>';
        const surp = intel.surplus || [];
        const short = intel.shortage || [];
        const resReq = intel.reserveRequired || [];
        h += '<div><span class="chip" style="border-color:#5fd38a;color:#5fd38a">🟢 ส่วนเกินคลัง (' + surp.length + ')</span> ' + (surp.length ? surp.slice(0, 8).map(x => esc(ECO.name(x.id)) + ' (มี ' + x.stock + '/เกิน ' + x.surplusQty + ')').join(' · ') : '<span class="muted">ไม่มีของล้น</span>') + '</div>';
        h += '<div style="margin-top:4px"><span class="chip" style="border-color:#e0584a;color:#e0584a">🔴 ขาดแคลน (' + short.length + ')</span> ' + (short.length ? short.slice(0, 8).map(x => esc(ECO.name(x.id)) + ' (มี ' + x.stock + '/เป้า ' + x.floor + ')').join(' · ') : '<span class="muted">ไม่มีของขาด</span>') + '</div>';
        h += '<div style="margin-top:4px"><span class="chip" style="border-color:#f0a030;color:#f0a030">🟡 สำรองจำเป็น (' + resReq.length + ')</span> ' + (resReq.length ? resReq.slice(0, 6).map(x => esc(ECO.name(x.id)) + ' (' + x.stock + '/' + x.floor + ')').join(' · ') : '<span class="muted">ปกติ</span>') + '</div>';
        h += '</div>';
      }

      // Searchable & Filterable Sect Stock Browser (Paginated Icon-Grid + Classic List)
      const mode = UI.getInvViewMode();
      const allStockRows = buildSectStockItems(W);
      let stockRows = allStockRows.slice();
      const sq = (UI.stockSearch || "").trim().toLowerCase();
      if (sq) stockRows = stockRows.filter(r => r.nameTh.toLowerCase().includes(sq) || String(r.id).toLowerCase().includes(sq));
      if (mode === "grid") {
        const cat = UI.stockCat || "ALL";
        if (cat !== "ALL") stockRows = stockRows.filter(r => r.broadCat === cat);
      } else {
        if (UI.stockType && UI.stockType !== "ALL") stockRows = stockRows.filter(r => r.kind === UI.stockType);
      }
      if (UI.stockTier && UI.stockTier !== "ALL") stockRows = stockRows.filter(r => r.tier === +UI.stockTier);
      if (UI.stockSort === "tier") stockRows.sort((a, b) => b.tier - a.tier || b.qty - a.qty);
      else if (UI.stockSort === "value") stockRows.sort((a, b) => (b.value || 0) - (a.value || 0) || b.tier - a.tier);
      else if (UI.stockSort === "name") stockRows.sort((a, b) => a.nameTh.localeCompare(b.nameTh));
      else stockRows.sort((a, b) => b.qty - a.qty || b.tier - a.tier);

      h += renderModeToggleBar("<h3>🔎 ค้นหาและจัดการคลังสำนัก (" + stockRows.length + " รายการ)</h3>");
      h += "<div class=\"card\">";
      if (mode === "grid") {
        h += "<div class=\"inv-cat-bar\">";
        BROAD_CATS.forEach(([ck, cv]) => {
          const cnt = ck === "ALL" ? allStockRows.length : allStockRows.filter(x => x.broadCat === ck).length;
          h += "<button type=\"button\" class=\"" + ((UI.stockCat || "ALL") === ck ? "on" : "") + "\" data-do=\"stock-cat\" data-arg=\"" + ck + "\">" + cv + " (" + cnt + ")</button>";
        });
        h += "</div>";
        h += "<div class=\"inv-filter-row\">";
        h += "<input id=\"stockSearch\" type=\"search\" placeholder=\"ค้นหาชื่อหรือรหัสไอเทมในคลัง…\" value=\"" + esc(UI.stockSearch || "") + "\">";
        h += "<select id=\"stockTier\">" + [["ALL", "ทุกระดับ"], ["1", "T1"], ["2", "T2"], ["3", "T3"], ["4", "T4"], ["5", "T5"], ["6", "T6"], ["7", "T7"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.stockTier === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
        h += "<select id=\"stockSort\">" + [["qty", "เรียง: จำนวน"], ["tier", "เรียง: ระดับ"], ["value", "เรียง: มูลค่า"], ["name", "เรียง: ชื่อ"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.stockSort === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
        h += "</div>";

        const pgSpec = UI.calcGridPageSize();
        const totalPages = Math.max(1, Math.ceil(stockRows.length / pgSpec.perPage));
        UI.stockPage = clamp(UI.stockPage || 1, 1, totalPages);
        const startIdx = (UI.stockPage - 1) * pgSpec.perPage;
        const pageItems = stockRows.slice(startIdx, startIdx + pgSpec.perPage);

        if (UI.stockSelKey && !stockRows.some(x => x.selKey === UI.stockSelKey)) {
          UI.stockSelKey = null;
        }
        const selItem = UI.stockSelKey ? stockRows.find(x => x.selKey === UI.stockSelKey) : null;

        h += "<div class=\"inv-grid-wrap\">";
        if (!pageItems.length) {
          h += "<div class=\"muted\" style=\"padding:10px 4px;text-align:center\">ไม่พบไอเทมในคลังที่ตรงกับเงื่อนไขการค้นหา</div>";
        } else {
          h += "<div class=\"inv-grid\">" + pageItems.map(it => renderGridCellHtml(it, selItem && selItem.selKey === it.selKey, "stock-sel")).join("") + "</div>";
        }
        h += "<div class=\"inv-page-bar\">" +
          "<button type=\"button\" data-do=\"stock-page\" data-arg=\"-1\"" + (UI.stockPage <= 1 ? " disabled" : "") + ">◀ ก่อนหน้า</button>" +
          "<span>หน้า <b>" + UI.stockPage + "</b> / " + totalPages + " <span class=\"muted\">(" + stockRows.length + " รายการ)</span></span>" +
          "<button type=\"button\" data-do=\"stock-page\" data-arg=\"+1\"" + (UI.stockPage >= totalPages ? " disabled" : "") + ">ถัดไป ▶</button>" +
          "</div>";

        if (selItem) {
          const rLabel = selItem.legendary || selItem.rarity === "Legendary" ? "★ ตำนาน" : selItem.rarity === "Exceptional" ? "◆ ล้ำเลิศ" : selItem.rarity === "Rare" ? "▲ หายาก" : "ทั่วไป";
          h += "<div class=\"inv-detail-panel\" data-detail-for=\"" + esc(selItem.selKey) + "\">" +
            "<div class=\"inv-detail-top\">" +
            UI.renderAtlasIconHtml(selItem, 44) +
            "<div class=\"inv-detail-meta\">" +
            "<div class=\"inv-detail-title\">" + esc(selItem.nameTh) + "</div>" +
            "<div class=\"inv-detail-sub\"><span class=\"chip b\">" + esc(selItem.kindTh) + " · T" + selItem.tier + "</span>" +
            "<span class=\"chip\">" + rLabel + "</span>" +
            "<span>คงคลัง <b>×" + selItem.qty + "</b></span>" +
            (selItem.qualityPct ? "<span>· คุณภาพ <b>" + selItem.qualityPct + "%</b></span>" : "") +
            "</div></div>" +
            "<button type=\"button\" class=\"inv-detail-close\" data-do=\"stock-close-detail\">✕ ปิด</button>" +
            "</div>" +
            "<div class=\"inv-detail-eff\">📦 <b>สถานะคลัง:</b> " + esc(selItem.statusTh || "-") + "<br>✨ <b>สรรพคุณ/การใช้งาน:</b> " + esc(selItem.descTh || "-") + "</div>" +
            "<div class=\"inv-detail-actions\">" +
            (selItem.canOpenContainer ? "<button type=\"button\" class=\"btn pri\" data-do=\"open-sect-container\">🎁 เปิดหีบปริศนาในคลัง (1 ใบ)</button>" : "") +
            (selItem.canCookFish ? "<button type=\"button\" class=\"btn pri\" data-do=\"cook-sect-fish\" data-arg=\"" + esc(selItem.id) + "\">🍳 ปรุงอาหารปลาเข้าโรงครัว</button>" : "") +
            (selItem.canDiscardTrash ? "<button type=\"button\" class=\"btn dan\" data-do=\"discard-sect-trash\">🗑️ ทิ้งเศษซากใต้น้ำ</button>" : "") +
            "<button type=\"button\" class=\"btn pri\" data-do=\"stock-distribute-now\">🎁 ให้หอคลังจัดสรรสวัสดิการ/มอบของ</button>" +
            "<button type=\"button\" class=\"btn\" data-do=\"stock-toggle-more\">" + (UI.stockMoreOpen ? "▲ ซ่อนรายละเอียด" : "▼ รายละเอียดเพิ่มเติม") + "</button>" +
            "</div>" +
            (UI.stockMoreOpen ? "<div class=\"inv-detail-more\">" + esc(selItem.moreTh || "-") + " · มูลค่าประเมิน ~" + (selItem.value || 0) + " คป.</div>" : "") +
            "</div>";
        }
        h += "</div>";
      } else {
        h += "<div class=\"edit-grid\" style=\"margin-bottom:8px\">";
        h += "<input id=\"stockSearch\" type=\"search\" placeholder=\"ค้นหาชื่อไอเทมในคลัง…\" value=\"" + esc(UI.stockSearch || "") + "\">";
        h += "<select id=\"stockType\">" + [["ALL", "ทุกประเภท"], ["PROVISION", "เสบียง"], ["PILL", "โอสถ"], ["MATERIAL", "วัตถุดิบ"], ["EQUIPMENT", "อุปกรณ์"], ["CRYSTAL", "ผลึกสายย่อย"], ["TECH_MANUAL", "คัมภีร์ในหอ"], ["ORGAN", "อวัยวะอสูร"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.stockType === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
        h += "<select id=\"stockTier\">" + [["ALL", "ทุกระดับ"], ["1", "ระดับ 1"], ["2", "ระดับ 2"], ["3", "ระดับ 3"], ["4", "ระดับ 4"], ["5", "ระดับ 5"], ["6", "ระดับ 6"], ["7", "ระดับ 7"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.stockTier === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
        h += "<select id=\"stockSort\">" + [["qty", "เรียงตามจำนวน"], ["tier", "เรียงตามระดับ"], ["value", "เรียงตามมูลค่า"], ["name", "เรียงตามชื่อ"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.stockSort === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
        h += "</div>";
        h += stockRows.length ? stockRows.slice(0, 60).map(r => "<div class=\"logrow\"><span><span class=\"chip\">" + esc(r.kindTh) + " T" + r.tier + "</span> <b>" + esc(r.nameTh) + "</b> ×" + r.qty + "</span><span class=\"muted\">" + esc(r.statusTh) + "</span></div>").join("") : "<div class=\"muted\">ไม่พบไอเทมในคลังที่ตรงกับเงื่อนไขการค้นหา</div>";
      }
      h += "</div>";

      ["alchemy", "forge"].forEach(hh => { const o = S.orders && S.orders[hh]; const r = o ? ECO.recipeById[o.rid] : null; h += "<div class=\"card\">" + (hh === "alchemy" ? "⚗️ หอโอสถกำลังผลิต: " : "🔨 โรงหลอมกำลังผลิต: ") + (r ? "<b>" + esc(r.outNameTh) + "</b> <span class=\"muted\">(" + esc(o.why || "") + ")</span>" : "<span class=\"muted\">ไม่มีคำสั่ง/วัตถุดิบไม่พอ</span>") + "</div>"; });
      const pills = Object.keys(S.stock).filter(k => ECO.isPill(k)).map(k => [k, S.stock[k]]); h += "<h3>โอสถ</h3><div class=\"card\">" + (pills.length ? pills.map(p => "<span class=\"chip ok\">" + esc(ECO.name(p[0])) + " ×" + p[1] + "</span>").join("") : "<span class=\"muted\">ไม่มี</span>") + "</div>";
      const mats = Object.keys(S.stock).filter(k => !ECO.isPill(k) && k !== "grain" && k !== "meal").map(k => [k, S.stock[k]]).sort((a, b) => b[1] - a[1]); h += "<h3>วัตถุดิบ</h3><div class=\"card\">" + (mats.length ? mats.slice(0, 60).map(p => "<span class=\"chip\">" + esc(ECO.name(p[0])) + " ×" + p[1] + "</span>").join("") : "<span class=\"muted\">ไม่มี</span>") + "</div>";
      const gears = S.gear.slice(0, 30); h += "<h3>อุปกรณ์ในคลัง</h3><div class=\"card\">" + (gears.length ? gears.map(x => "<span class=\"chip b\">" + esc(x.nameTh) + " · " + esc(g.MARTIAL.TYPES[g.MARTIAL.gearType(x)]) + "</span>").join("") : "<span class=\"muted\">ไม่มี</span>") + "</div>";
      const led = S.ledger.slice(-14).reverse(); h += "<h3>บัญชีล่าสุด</h3><div class=\"card\">" + led.map(l => "<div class=\"logrow\"><span class=\"tm\">" + dayStamp(l.t) + "</span><b style=\"color:" + (l.amt >= 0 ? "#5fd38a" : "#e0584a") + "\">" + (l.amt >= 0 ? "+" : "") + l.amt + "</b> " + esc(l.why) + "</div>").join("") + "</div>";
    } else if (tab === "shop") {
      const c = g.CPE.S(W), al = W.npcs.filter(n => !n.dead && !n.exiled), tot = al.reduce((a, n) => a + (n.cp || 0), 0), tr = SECT.holder(W, "treasury");
      const recent = (c.hist || []).slice(-30), minted30 = recent.reduce((a, x) => a + (x.mint || 0), 0), burned30 = recent.reduce((a, x) => a + (x.burn || 0), 0);
      const flowLabel = minted30 > burned30 * 1.25 ? "แต้มกำลังเพิ่มเร็ว" : burned30 > minted30 * 1.1 ? "แต้มกำลังถูกใช้มาก" : "แต้มหมุนเวียนใกล้สมดุล";
      h += "<div class=\"card\"><b>🛒 ร้านค้าสำนัก & แต้มคุณูปการ (คป.)</b><div class=\"muted\">สำนักเสกแต้มจ่ายเป็นค่าตอบแทน แต้มมีค่าเพราะแลกของ/วิชาที่ต้องหามาจากข้างนอกได้ การเรียนวิชา ซื้อสินค้า และขอคำชี้แนะจะเผาแต้มออกจากระบบ</div><div class=\"grid2\"><div>แต้มรวมที่ถือ <b>" + U.fmtNum(Math.round(tot)) + "</b></div><div>เฉลี่ย/คน <b>" + Math.round(tot / Math.max(1, al.length)) + "</b></div><div>เสกสะสม <b>" + U.fmtNum(Math.round(c.minted)) + "</b></div><div>เผาสะสม <b>" + U.fmtNum(Math.round(c.burned)) + "</b></div><div>แต้มหมุนเวียน <b>" + U.fmtNum(Math.round(c.circulation || tot)) + "</b></div><div>แต้มปลดเกษียณ <b>" + U.fmtNum(Math.round(c.retired || 0)) + "</b></div><div>สกัดอาร์บิทราจ <b>" + (c.arbitrageBlocked || 0) + " ครั้ง</b></div><div>ดัชนีราคา <b>×" + c.price.toFixed(2) + "</b></div><div>กำไรร้าน <b>×" + c.markup.toFixed(2) + "</b></div><div>แจกสวัสดิการแล้ว <b>" + c.welfareGiven + "</b></div><div>ขายแล้ว <b>" + c.sales + "</b> · ค่าวิชา <b>" + Math.round(c.techSales) + "</b></div><div>บริการชี้แนะ <b>" + (c.studyServices || 0) + " ครั้ง</b></div><div>เผาค่าชี้แนะ <b>" + U.fmtNum(Math.round(c.studyFees || 0)) + " คป.</b></div><div>ฝึกปราณแบบเสียแต้ม <b>" + (c.trainingServices || 0) + " ครั้ง</b></div><div>เผาค่าฝึกปราณ <b>" + U.fmtNum(Math.round(c.trainingFees || 0)) + " คป.</b></div><div>ขอสิทธิ์ตำรับ <b>" + (c.recipeAuthorizations || 0) + " ครั้ง</b></div><div>เผาค่าสิทธิ์ตำรับ <b>" + U.fmtNum(Math.round(c.recipeFees || 0)) + " คป.</b></div></div><div class=\"muted\">30 วันล่าสุด: เสก " + Math.round(minted30) + " · เผา " + Math.round(burned30) + " · " + flowLabel + "</div>" + (tr ? "<div class=\"muted\">ผู้ดูแลคลัง: " + esc(HC.fullName(tr)) + " · ความใจกว้าง " + Math.round(c.welfare * 100) + "%</div>" : "") + "</div>";

      // Active Buyer Selector + Paginated Icon-Grid / Classic List Shop Browser
      const mode = UI.getInvViewMode();
      if (!UI.shopBuyerId || !W.byId[UI.shopBuyerId] || W.byId[UI.shopBuyerId].dead) {
        UI.shopBuyerId = (UI.G.R && UI.G.R.selected && W.byId[UI.G.R.selected] && !W.byId[UI.G.R.selected].dead) ? UI.G.R.selected : W.sect.masterId;
      }
      const buyer = W.byId[UI.shopBuyerId] || al[0];
      const allShopItems = buildSectShopItems(W).map(it => {
        let locked = false, lockReason = "";
        if (buyer) {
          if (it.price > Math.floor(buyer.cp || 0) && it.shopKind !== "bounty_mat") {
            locked = true; lockReason = "แต้มคุณูปการไม่พอ (มี " + Math.round(buyer.cp || 0) + "/" + it.price + " คป.)";
          } else if (it.shopKind === "gear" && it.gear) {
            if (!buyer.cult || (it.gear.minStage || 1) > buyer.cult.stage + 1) {
              locked = true; lockReason = "ขั้นตบะยังไม่ถึงเกณฑ์สวมใส่ (ต้องการขั้น " + Math.max(1, (it.gear.minStage || 1) - 1) + ")";
            }
          } else if (it.shopKind === "crystal") {
            const ok = (g.MARTIAL && g.MARTIAL.canAcquireKnowledge) ? g.MARTIAL.canAcquireKnowledge(W, buyer, it.key) : ((g.MARTIAL && g.MARTIAL.eligible) ? g.MARTIAL.eligible(buyer, it.key).ok : true);
            if (!ok) { locked = true; lockReason = "วิถีหรือขั้นตบะของ " + buyer.h.name.given + " ยังไม่ตรงเกณฑ์ผลึกนี้"; }
          } else if (it.shopKind === "tech_study" && it.tech) {
            const eGate = (g.MARTIAL && g.MARTIAL.eligible) ? g.MARTIAL.eligible(buyer, g.MARTIAL.techKey(it.id)) : { ok: true };
            if (!eGate.ok) { locked = true; lockReason = eGate.reason || "ยังไม่ผ่านเกณฑ์เรียนวิชานี้"; }
            else if ((it.tech.reqTier || it.tech.tier || 1) > SECT.canLearnTier(W, buyer)) { locked = true; lockReason = "ยศในสำนักยังไม่ได้รับสิทธิ์หอคัมภีร์ชั้นนี้"; }
          } else if (it.shopKind === "bounty_mat") {
            const haveMat = (buyer.inv && buyer.inv.mats && buyer.inv.mats[it.id]) || 0;
            if (haveMat <= 0) { locked = true; lockReason = buyer.h.name.given + " ไม่มีสมุนไพรนี้ในถุงส่วนตัว"; }
          }
        }
        return Object.assign({}, it, { locked, lockReason });
      });

      let shopRows = allShopItems.slice();
      const shq = (UI.shopSearch || "").trim().toLowerCase();
      if (shq) shopRows = shopRows.filter(r => r.nameTh.toLowerCase().includes(shq) || String(r.id).toLowerCase().includes(shq));
      if (mode === "grid") {
        const cat = UI.shopCat || "ALL";
        if (cat !== "ALL") shopRows = shopRows.filter(r => r.broadCat === cat);
      }
      if (UI.shopSort === "price") shopRows.sort((a, b) => b.price - a.price || b.tier - a.tier);
      else if (UI.shopSort === "qty") shopRows.sort((a, b) => b.qty - a.qty || b.tier - a.tier);
      else if (UI.shopSort === "name") shopRows.sort((a, b) => a.nameTh.localeCompare(b.nameTh));
      else shopRows.sort((a, b) => b.tier - a.tier || b.price - a.price);

      h += renderModeToggleBar("<h3>🏮 กระดานแลกเปลี่ยนคุณูปการสำนัก (" + shopRows.length + " รายการ)</h3>");
      h += "<div class=\"card\">";
      if (buyer) {
        h += "<div style=\"display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #395244\">" +
          "<div style=\"font-size:12.5px\">👤 ผู้ทำรายการ: <select id=\"shopBuyerSel\" style=\"width:auto;display:inline-block;padding:4px 8px\">" +
          al.slice().sort((a, b) => b.rank - a.rank).map(x => "<option value=\"" + x.id + "\"" + (x.id === buyer.id ? " selected" : "") + ">" + esc(HC.fullName(x)) + " (" + Math.round(x.cp || 0) + " คป.)</option>").join("") +
          "</select></div>" +
          "<span class=\"chip g\">🏅 แต้มคงเหลือ: <b>" + Math.round(buyer.cp || 0) + " คป.</b></span></div>";
      }

      if (mode === "grid") {
        h += "<div class=\"inv-cat-bar\">";
        BROAD_CATS.forEach(([ck, cv]) => {
          const cnt = ck === "ALL" ? allShopItems.length : allShopItems.filter(x => x.broadCat === ck).length;
          h += "<button type=\"button\" class=\"" + ((UI.shopCat || "ALL") === ck ? "on" : "") + "\" data-do=\"shop-cat\" data-arg=\"" + ck + "\">" + cv + " (" + cnt + ")</button>";
        });
        h += "</div>";
        h += "<div class=\"inv-filter-row\">";
        h += "<input id=\"shopSearch\" type=\"search\" placeholder=\"ค้นหาสินค้า/คัมภีร์ในร้านสำนัก…\" value=\"" + esc(UI.shopSearch || "") + "\">";
        h += "<select id=\"shopSort\">" + [["tier", "เรียง: ระดับ"], ["price", "เรียง: ราคา คป."], ["qty", "เรียง: คงเหลือ"], ["name", "เรียง: ชื่อ"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.shopSort === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
        h += "</div>";

        const pgSpec = UI.calcGridPageSize();
        const totalPages = Math.max(1, Math.ceil(shopRows.length / pgSpec.perPage));
        UI.shopPage = clamp(UI.shopPage || 1, 1, totalPages);
        const startIdx = (UI.shopPage - 1) * pgSpec.perPage;
        const pageItems = shopRows.slice(startIdx, startIdx + pgSpec.perPage);

        if (UI.shopSelKey && !shopRows.some(x => x.selKey === UI.shopSelKey)) {
          UI.shopSelKey = null;
        }
        const selItem = UI.shopSelKey ? shopRows.find(x => x.selKey === UI.shopSelKey) : null;

        h += "<div class=\"inv-grid-wrap\">";
        if (!pageItems.length) {
          h += "<div class=\"muted\" style=\"padding:10px 4px;text-align:center\">ไม่พบรายการแลกเปลี่ยนในหมวดนี้</div>";
        } else {
          h += "<div class=\"inv-grid\">" + pageItems.map(it => renderGridCellHtml(it, selItem && selItem.selKey === it.selKey, "shop-sel")).join("") + "</div>";
        }
        h += "<div class=\"inv-page-bar\">" +
          "<button type=\"button\" data-do=\"shop-page\" data-arg=\"-1\"" + (UI.shopPage <= 1 ? " disabled" : "") + ">◀ ก่อนหน้า</button>" +
          "<span>หน้า <b>" + UI.shopPage + "</b> / " + totalPages + " <span class=\"muted\">(" + shopRows.length + " รายการ)</span></span>" +
          "<button type=\"button\" data-do=\"shop-page\" data-arg=\"+1\"" + (UI.shopPage >= totalPages ? " disabled" : "") + ">ถัดไป ▶</button>" +
          "</div>";

        if (selItem && buyer) {
          const rLabel = selItem.legendary || selItem.rarity === "Legendary" ? "★ ตำนาน" : selItem.rarity === "Exceptional" ? "◆ ล้ำเลิศ" : selItem.rarity === "Rare" ? "▲ หายาก" : "ทั่วไป";
          let actBtn = "";
          if (selItem.shopKind === "bounty_mat") {
            const haveMat = (buyer.inv && buyer.inv.mats && buyer.inv.mats[selItem.id]) || 0;
            actBtn = "<button type=\"button\" class=\"btn pri\" data-do=\"donate-personal\" data-arg=\"" + buyer.id + "|MATERIAL|" + selItem.id + "\"" + (haveMat <= 0 ? " disabled" : "") + ">🎁 บริจาคสมุนไพร (+ " + selItem.price + " คป.)</button>";
          } else {
            const btnLabel = selItem.shopKind === "tech_study" ? ("📖 ชำระค่าศึกษา (" + selItem.price + " คป.)") : ("🛒 แลกซื้อ (" + selItem.price + " คป.)");
            actBtn = "<button type=\"button\" class=\"btn pri\" data-do=\"shop-buy\" data-arg=\"" + esc(selItem.selKey) + "|" + selItem.price + "\"" + (selItem.locked ? " disabled" : "") + ">" + btnLabel + "</button>";
          }
          h += "<div class=\"inv-detail-panel\" data-detail-for=\"" + esc(selItem.selKey) + "\">" +
            "<div class=\"inv-detail-top\">" +
            UI.renderAtlasIconHtml(selItem, 44) +
            "<div class=\"inv-detail-meta\">" +
            "<div class=\"inv-detail-title\">" + esc(selItem.nameTh) + "</div>" +
            "<div class=\"inv-detail-sub\"><span class=\"chip g\">" + (selItem.shopKind === "bounty_mat" ? "รับบริจาค +" : "ราคา ") + selItem.price + " คป.</span>" +
            "<span class=\"chip b\">" + esc(selItem.kindTh) + " · T" + selItem.tier + "</span>" +
            "<span class=\"chip\">" + rLabel + "</span>" +
            "<span>คงเหลือ <b>×" + selItem.qty + "</b></span>" +
            "</div></div>" +
            "<button type=\"button\" class=\"inv-detail-close\" data-do=\"shop-close-detail\">✕ ปิด</button>" +
            "</div>" +
            "<div class=\"inv-detail-eff\">✨ <b>ผลลัพธ์/สรรพคุณ:</b> " + esc(selItem.descTh || "-") +
            (selItem.locked ? "<div style=\"color:#ff9e94;margin-top:3px\">🔒 " + esc(selItem.lockReason) + "</div>" : "<div style=\"color:#7ff5ad;margin-top:3px\">✔ " + esc(buyer.h.name.given) + " สามารถทำรายการนี้ได้</div>") +
            "</div>" +
            "<div class=\"inv-detail-actions\">" +
            actBtn +
            "<button type=\"button\" class=\"btn\" data-do=\"shop-toggle-more\">" + (UI.shopMoreOpen ? "▲ ซ่อนรายละเอียด" : "▼ รายละเอียดเพิ่มเติม") + "</button>" +
            "</div>" +
            (UI.shopMoreOpen ? "<div class=\"inv-detail-more\">" + esc(selItem.moreTh || "-") + "</div>" : "") +
            "</div>";
        }
        h += "</div>";
      }
      h += "</div>";

      const need = g.JD.CP.BASIC.map(r => "P:" + r.id);
      h += "<h3>โอสถพื้นฐาน 8 สูตร (หลอมให้สำนัก แจกเป็นสวัสดิการ/ขาย)</h3><div class=\"card\">" + need.map(k => { const sc = g.CPE.scarcity(W, k); return "<div class=\"logrow\"><span>" + esc(ECO.name(k)) + " ×" + ECO.count(W, k) + "</span><b style=\"color:" + (sc > 1.3 ? "#e0584a" : sc < 0.8 ? "#7aa" : "#5fd38a") + "\">ขาย " + g.CPE.priceOf(W, k) + " · รับบริจาค " + Math.round(g.CPE.reward(W, k, 1)) + " คป.</b></div>"; }).join("") + "</div>";
      const herbs = ["MAT_HERB_DEW_GRASS_1", "MAT_HERB_JADE_LOTUS_2", "MAT_HERB_BLOOD_GINSENG_3"]; h += "<h3>ป้ายรับซื้อ (ค่าบริจาคตามความขาด)</h3><div class=\"card\">" + herbs.map(k => "<div class=\"logrow\"><span>" + esc(ECO.name(k)) + " ในคลัง " + ECO.count(W, k) + "</span><b>" + Math.round(g.CPE.reward(W, k, 1)) + " คป./หน่วย</b></div>").join("") + "</div>";
      h += UI.martialShop(W);
      const shop = g.CPE.shopItems(W).filter(i => i.kind !== "crystal").filter(i => !(i.kind === "pill" && i.key.startsWith("P:BASIC"))).slice(0, 24);
      h += "<h3>โอสถและอุปกรณ์พรีเมียม (แลกซื้อด้วย คป. · ไม่อยู่ในสวัสดิการแจกฟรี)</h3><div class=\"card\">";
      h += "<div class=\"muted\" style=\"margin-bottom:6px\">🛡️ โอสถนำเข้าและวิชาพิเศษต้องแลกซื้อด้วยแต้มคุณูปการ (คป.) เท่านั้น จะไม่มีการแจกฟรีเป็นสวัสดิการพื้นฐาน เพื่อรักษาสมดุลคลังสำนัก</div>";
      h += (shop.length ? shop.map(i => "<span class=\"chip " + (i.kind === "gear" ? "b" : "ok") + "\">" + esc(i.kind === "gear" ? i.gear.nameTh : ECO.name(i.key) + " ×" + i.n) + " · " + i.price + " คป.</span>").join("") : "<span class=\"muted\">ยังไม่มีสินค้าพรีเมียม — ผลิตจากหอโอสถ/โรงหลอม หรือนำกลับจากการเดินทาง</span>") + "</div>";
      const tl = W.sect.library.map(id => CULT.tech(id)).filter(t => t && !g.CPE.techFree(W, t)).sort((a, b) => a.tier - b.tier).slice(0, 14); h += "<h3>วิชาที่ต้องใช้แต้มเรียน (วิชาพื้นฐานเรียนฟรี)</h3><div class=\"card\">" + (tl.length ? tl.map(t => "<span class=\"chip b\">" + esc(t.nameTh) + " ระดับ" + t.tier + " · " + g.CPE.techPrice(W, t) + "</span>").join("") : "<span class=\"muted\">ไม่มี</span>") + "</div>";
      h += "<h3>บันทึกคุณูปการ</h3><div class=\"card\">" + (c.log.slice(-12).reverse().map(l => "<div class=\"logrow\"><span class=\"tm\">" + dayStamp(l.t) + "</span>" + esc(l.text) + "</div>").join("") || "<span class=\"muted\">ยังไม่มี</span>") + "</div>";
      if (g.EXT) {
        const ext = g.EXT, visitors = ext.activeVisitors(W), stats = (W.world && W.world.marketStats) || {}, history = (W.world.tradeHistory || []).slice(-8).reverse();
        h += "<h3>🪙 ตลาดภายนอก · ใช้หินวิญญาณ</h3><div class=\"card\"><div class=\"muted\">สมาชิกซื้อขายกับสำนักด้วยแต้มคุณูปการ ส่วนการค้ากับพ่อค้าภายนอกใช้หินวิญญาณและตัดสต็อกจริง</div>";
        h += "<div class=\"grid2\"><div>หินวิญญาณสำนัก <b>" + U.fmtNum(Math.round(S.stones)) + "</b></div><div>จำนวนผู้มาเยือนสะสม <b>" + (stats.visits || 0) + "</b></div><div>สำนักซื้อจากคนนอก <b>" + (stats.sectBought || 0) + " หน่วย</b></div><div>สำนักขายให้คนนอก <b>" + (stats.sectSold || 0) + " หน่วย</b></div><div>เงินจ่ายซื้อเข้า <b>" + U.fmtNum(stats.sectStonesOut || 0) + " ศิลา</b></div><div>เงินรับจากขายออก <b>" + U.fmtNum(stats.sectStonesIn || 0) + " ศิลา</b></div></div></div>";
        if (visitors.length) {
          h += "<h3>พ่อค้าที่กำลังแวะสำนัก</h3>" + visitors.map(v => {
            const stock = Object.keys(v.stock || {}).filter(k => v.stock[k] > 0).slice(0, 5).map(k => esc(ECO.name(k)) + " ×" + v.stock[k] + " · " + ext.quotePrice(W, k, "member-buy") + " ศิลา").join(" · ");
            const wants = Object.keys(v.wants || {}).filter(k => v.wants[k] > 0).slice(0, 5).map(k => esc(ECO.name(k)) + " ×" + v.wants[k]).join("、");
            return "<div class=\"card\"><b>" + esc(v.nameTh) + "</b> <span class=\"chip\">อยู่ได้อีก " + Math.max(0, v.untilDay - W.day + 1) + " วัน</span><div class=\"sub\">เงินทุน " + U.fmtNum(v.stones) + " ศิลา</div><div class=\"sub\">เสนอขาย: " + (stock || "สินค้าหมด") + "</div><div class=\"sub\">รับซื้อ: " + (wants || "ไม่มีความต้องการคงเหลือ") + "</div></div>";
          }).join("");
        } else h += "<div class=\"card muted\">ไม่มีพ่อค้าอยู่ในขณะนี้ · ผู้มาเยือนจะเข้ามาตามชื่อเสียงสำนัก นโยบายเปิดรับ และสภาพเส้นทาง</div>";
        h += "<h3>ธุรกรรมภายนอกล่าสุด</h3><div class=\"card\">" + (history.length ? history.map(t => "<div class=\"logrow\"><span class=\"tm\">วันที่ " + t.day + "</span><span>" + (t.side === "sect-buy" ? "สำนักซื้อ" : t.side === "sect-sell" ? "สำนักขาย" : t.side === "member-buy" ? esc(t.npcName || "สมาชิก") + " ซื้อ" : esc(t.npcName || "สมาชิก") + " ขาย") + esc(ECO.name(t.itemId)) + " ×" + t.qty + " กับ" + esc(t.traderName) + "</span><b>" + t.total + " ศิลา</b></div>").join("") : "<span class=\"muted\">ยังไม่มีการซื้อขายภายนอก</span>") + "</div>";
      }
    } else if (tab === 'bld') {
      const pop = SECT.memberOccupancy ? SECT.memberOccupancy(W) : W.npcs.filter(n => !n.dead).length;
      const cap = SECT.housingCapacity ? SECT.housingCapacity(W) : 46;
      h += '<div class="card"><b>🏠 ความจุที่พักสำนัก: ' + pop + '/' + cap + ' เตียง</b> <span class="muted">(ขยายเรือนพักทั้ง 3 แห่งได้สูงสุดรวม 100 เตียง)</span></div>';
      h += W.map.buildings.filter(b => b.type !== 'plaza').map(b => {
        const fd = S.facilityDemand && S.facilityDemand[b.id];
        const maxL = SECT.maxBuildingLevel ? SECT.maxBuildingLevel(b) : 3;
        const isDorm = SECT.HOUSING_IDS && SECT.HOUSING_IDS.includes(b.id);
        const maxBeds = isDorm && SECT.FACILITY_SPECS[b.id] ? SECT.FACILITY_SPECS[b.id].bedsByLevel[maxL] : 0;
        const congText = fd && (fd.congestedHours >= 2 || fd.failedAttempts >= 2) ? ' · <span style="color:#f0a030">⚠️ แออัด (' + fd.congestedHours + ' ชม./พลาด ' + fd.failedAttempts + ')</span>' : '';
        return '<div class="prow" data-bld="' + b.id + '"><div style="font-size:24px;width:40px;text-align:center">' + MAP.BTYPES[b.type].icon + '</div><div class="pi"><div class="nm">' + esc(b.nameTh) + ' <span class="chip g">ระดับ ' + b.level + '/' + maxL + '</span></div><div class="sub">' + (b.building ? '🚧 กำลังขยายเป็นระดับ ' + b.building.to + '/' + maxL : (isDorm ? 'เตียงพัก ' + b.stations.length + ' เตียง (สูงสุด ' + maxBeds + ') · ' : 'ใช้งานอยู่ ' + (b.inside ? b.inside.length : 0) + '/' + b.stations.length + ' จุด · ') + 'สภาพ ' + Math.round(b.hp) + '%' + congText) + '</div></div></div>';
      }).join('');
    }
    return h;
  };

  UI.rBuilding = () => {
    const W = UI.G.W, b = W.map.byId[UI.bldId]; if (!b) return ''; const bt = MAP.BTYPES[b.type];
    const maxL = SECT.maxBuildingLevel ? SECT.maxBuildingLevel(b) : 3;
    const isDorm = SECT.HOUSING_IDS && SECT.HOUSING_IDS.includes(b.id);
    const maxBeds = isDorm && SECT.FACILITY_SPECS[b.id] ? SECT.FACILITY_SPECS[b.id].bedsByLevel[maxL] : 0;
    const inside = (b.inside || []).map(id => W.byId[id]).filter(Boolean); const around = W.npcs.filter(n => !n.dead && !n.away && !n.hidden && n.x >= b.x - 2 && n.x <= b.x + b.w + 2 && n.y >= b.y - 1 && n.y <= b.y + b.h + 5);
    let h = '<div class="card"><div style="font-size:30px">' + bt.icon + '</div><div>' + esc(bt.desc) + '</div><div class="muted">ระดับ ' + b.level + '/' + maxL + ' · สภาพ ' + Math.round(b.hp) + '% · ' + (isDorm ? ('เตียงพัก ' + b.stations.length + '/' + maxBeds + ' เตียง') : ('จุดกิจกรรม ' + b.stations.length)) + '</div></div>';
    h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px"><button class="btn pri" data-do="locb" data-arg="' + b.id + '">📍 ไปที่สถานที่นี้</button>';
    if (g.FISHING && ['spirit_pond', 'river_dock', 'river_west', 'river_east'].includes(b.id)) {
      const zid = b.zoneId || (b.id === 'river_dock' ? 'river_central' : b.id);
      h += '<button class="btn" data-do="fish-at-zone" data-arg="' + zid + '">🎣 ส่งตัวละครมาตกปลาที่นี่</button></div>';
      const f = g.FISHING.ensure(W);
      const zdef = g.FISHING.ZONES[zid];
      const zst = f && f.zones && f.zones[zid];
      if (zdef && zst) {
        const spList = g.FISHING.SPECIES.filter(s => s.habitats.includes(zid));
        h += '<h3>🐟 นิเวศแหล่งน้ำและประชากรปลา</h3><div class="card">';
        h += bar('ความอุดมสมบูรณ์ของปลา', zst.stock, { max: zst.maxStock, txt: zst.stock + '/' + zst.maxStock + ' (ฟื้น +' + zst.dailyRegen + '/วัน)', wide: true, color: '#38a3a5' });
        h += '<div class="muted" style="margin-top:4px">โอกาสเมื่อตกสำเร็จ: <b>ปลา 90.0%</b> · <b>หีบไม้โบราณแช่น้ำ 10.0%</b> (เปิดหีบ: ขยะ 50% / ของทั่วไป 49.5% / ตำนาน 0.5%)</div>';
        h += '<div style="margin-top:6px"><b>สายพันธุ์ปลาประจำแหล่งน้ำนี้ (' + spList.length + ' ชนิด):</b></div>';
        h += '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">' + spList.map(sp => '<span class="chip ' + (sp.tier >= 4 ? 'v' : sp.tier === 3 ? 'ok' : 'b') + '">' + esc(sp.nameTh) + ' (T' + sp.tier + ')</span>').join('') + '</div>';
        h += '</div>';
      }
    } else {
      h += '</div>';
    }
    if (inside.length) h += '<h3>อยู่ข้างใน (' + inside.length + ')</h3>' + inside.map(n => '<div class="prow" data-npc="' + n.id + '">' + portraitHtml(n, 36) + '<div class="pi"><div class="nm">' + esc(HC.fullName(n)) + '</div><div class="sub">' + esc(actText(n)) + '</div></div></div>').join('');
    if (around.length) h += '<h3>อยู่บริเวณนี้ (' + around.length + ')</h3>' + around.map(n => '<div class="prow" data-npc="' + n.id + '">' + portraitHtml(n, 36) + '<div class="pi"><div class="nm">' + esc(HC.fullName(n)) + '</div><div class="sub">' + esc(actText(n)) + '</div></div></div>').join('');
    if (b.type === 'alchemy' || b.type === 'forge') { const o = W.sect.orders && W.sect.orders[b.id]; const r = o ? ECO.recipeById[o.rid] : null; h += '<h3>คำสั่งผลิตปัจจุบัน</h3><div class="card">' + (r ? esc(r.outNameTh) + ' — ' + esc(o.why || '') : 'ไม่มี') + '</div>'; }
    return h;
  };

  /* ----- บันทึก ----- */
  function isDailyPillLog(l) {
    if (!l || !l.text) return false;
    if (l.txKind === 'gift' || l.txKind === 'purchase' || l.txKind === 'sale' || l.txKind === 'player-spawn') return false;
    return /กินโอสถ|ใช้โอสถพื้นฐาน|สวัสดิการโอสถ/.test(l.text);
  }
  function matchesLogSubFilter(l, sub) {
    if (!sub || sub === 'all') return true;
    if (sub === 'no_pill') return !isDailyPillLog(l);
    if (sub === 'gift') return l.txKind === 'gift' || l.type === 'gear' || /\[มอบของรางวัล\]|จัดสรรโอสถ|มอบอุปกรณ์|มอบผลึก/.test(l.text || '');
    if (sub === 'trade') return l.txKind === 'purchase' || l.txKind === 'sale' || l.type === 'shop' || /\[ซื้อสินค้า\]|สั่งซื้อ|ขายส่วนเกิน/.test(l.text || '');
    if (sub === 'spawn') return l.txKind === 'player-spawn' || l.txKind === 'player-edit' || l.txKind === 'player-edit-undo' || /\[(เสก|แก้ไข)โดยผู้เล่น\]/.test(l.text || '');
    return true;
  }

  UI.rLog = () => {
    const W = UI.G.W;
    if (!UI.logFilters) UI.logFilters = new Set([UI.tab || 'all']);
    if (UI.tab && LOG_GROUPS[UI.tab] && (!UI.logFilters.has(UI.tab) && UI.logFilters.size === 1 && UI.logFilters.has('all') && UI.tab !== 'all')) {
      UI.logFilters = new Set([UI.tab]);
    }

    let h = '<div class="log-filter-bar" style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:6px">';
    for (const k in LOG_GROUPS) {
      const active = UI.logFilters.has(k);
      h += '<button type="button" class="chip ' + (active ? 'ok' : '') + '" data-do="logfilter" data-arg="' + k + '" style="cursor:pointer;padding:6px 11px;font-size:12px;' + (active ? 'border-color:var(--gold);font-weight:bold;background:rgba(233,205,133,.18)' : '') + '">' + LOG_GROUPS[k][0] + '</button>';
    }
    h += '</div>';

    h += '<div class="log-subfilter-bar" style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px">';
    Object.keys(LOG_SUBFILTERS).forEach(sk => {
      const on = (UI.logSubFilter || 'all') === sk;
      h += '<button type="button" class="chip ' + (on ? 'b' : '') + '" data-do="logsubfilter" data-arg="' + sk + '" style="cursor:pointer;padding:4px 9px;font-size:11.5px;' + (on ? 'border-color:#4fb2f2;font-weight:bold' : '') + '">' + LOG_SUBFILTERS[sk] + '</button>';
    });
    h += '</div>';

    let list = W.logs || [];
    if (!UI.logFilters.has('all')) {
      const allowed = new Set();
      for (const k of UI.logFilters) {
        const types = LOG_GROUPS[k] && LOG_GROUPS[k][1];
        if (types) types.forEach(t => allowed.add(t));
      }
      list = list.filter(l => allowed.has(l.type));
    }
    list = list.filter(l => matchesLogSubFilter(l, UI.logSubFilter));
    list = list.slice(-150).reverse();
    if (!list.length) return h + '<div class="muted">ยังไม่มีเหตุการณ์ในหมวดที่เลือก</div>';
    return h + list.map(l => '<div class="logrow"><span class="tm">' + dayStamp(l.t) + ' ' + U.pad2(Math.floor((l.t % 1440) / 60)) + ':' + U.pad2(l.t % 60) + '</span>' + linkify(W, l.text, l.ids, l.refs) + '</div>').join('');
  };

  /* ----- ยุทธภพ ----- */
  UI.rWorld = () => {
    const W = UI.G.W, tab = UI.tab; let h = '';
    if (tab === 'exp') {
      const act = W.world.expeds.filter(e => !e.done);
      h += '<div class="muted" style="margin-bottom:6px">นอกสำนักไม่มีฉากให้เล่น ผลการเดินทางถูกคำนวณจากกำลัง โชค การรับรู้ และนิสัยของผู้เดินทางจริง</div>';
      h += '<h3>กำลังเดินทาง (' + act.length + ')</h3>' + (act.length ? act.map(e => { const ms = e.party.map(i => W.byId[i]).filter(Boolean); const reg = EXPED.REGIONS.find(r => r.id === e.region) || { nameTh: e.placeTh || '?' }; return '<div class="card"><b>' + EXPED.MISSIONS[e.kind].icon + ' ' + EXPED.MISSIONS[e.kind].nameTh + '</b> → ' + esc(reg.nameTh) + '<div>' + ms.map(nameLink).join('、') + '</div><div class="muted">กลับในอีก ~' + Math.max(0, Math.round((e.ret - W.t) / 1440 * 10) / 10) + ' วัน</div></div>'; }).join('') : '<div class="muted">ไม่มี</div>');
      const done = W.world.expeds.filter(e => e.done && e.out).slice(-5).reverse(); if (done.length) h += '<h3>เพิ่งกลับ</h3>' + done.map(e => { const ms = e.party.map(i => W.byId[i]).filter(Boolean); return '<div class="card"><b>' + EXPED.MISSIONS[e.kind].icon + ' ' + EXPED.MISSIONS[e.kind].nameTh + '</b> ' + ms.map(nameLink).join('、') + '<div class="muted">' + esc(e.journal.slice(-4).join(' → ')) + '</div><div>' + esc(EXPED.summarize(e.out)) + '</div></div>'; }).join('');
    } else if (tab === 'visitors') {
      h += UI.rVisitors();
    } else if (tab === 'clues') {
      h += UI.rClues();
    } else if (tab === 'content') {
      h += UI.rContent();
    } else if (tab === 'ecology') {
      h += UI.rEcology();
    } else if (tab === 'disc') {
      h += UI.rDisc();
    } else if (tab === 'sects') {
      const C = g.CONTENT; if (C && C.ensure) C.ensure(W);
      const pol = W.world.politics || { treaties: {}, activeEvent: null, events: [], stats: {} };
      if (pol.activeEvent) {
        const ev = pol.activeEvent;
        h += '<h3>⚡ เหตุการณ์การเมืองยุทธภพปัจจุบัน</h3><div class="card" style="border-color:var(--gold)"><b>' + esc(ev.titleTh) + '</b><div class="muted">' + esc(ev.descTh) + '</div><div class="muted">ครบกำหนดวันที่ ' + ev.expiresDay + ' · ศิลาที่เกี่ยวข้อง ' + ev.demandStones + ' ก้อน</div></div>';
      }
      h += '<h3>🏯 ขั้วอำนาจและสำนักเพื่อนบ้าน (' + W.world.sects.length + ')</h3>';
      h += W.world.sects.map(s => {
        const trLabel = (C && C.TREATY_TH && C.TREATY_TH[s.treaty || 'NONE']) || (s.treaty || 'NONE');
        const trChip = s.treaty === 'ALLIANCE' ? 'ok' : s.treaty === 'TRADE_PACT' ? 'g' : s.treaty === 'NON_AGGRESSION' ? 'b' : s.treaty === 'EMBARGO' ? 'r' : '';
        const specs = Array.isArray(s.specialtyMatIds) ? s.specialtyMatIds.map(id => esc(ECO.name(id))).join(' · ') : '';
        return '<div class="card"><b>' + esc(s.icon || '🏯') + ' ' + esc(s.nameTh) + '</b> <span class="chip">' + esc(s.style) + '</span>' + (s.alignmentLabelTh ? ' <span class="chip v">' + esc(s.alignmentLabelTh) + '</span>' : '') + ' <span class="chip ' + trChip + '">📜 ' + esc(trLabel) + '</span>' + bar('ท่าทีต่อเรา', s.attitude + 100, { max: 200, txt: Math.round(s.attitude), wide: true, color: s.attitude > 20 ? '#5fd38a' : s.attitude < -20 ? '#e0584a' : '#e8c43a' }) + '<div class="muted">กำลัง ' + s.power + ' · อิทธิพล ' + (s.influence || 70) + (s.leaderNameTh ? ' · ประมุข: ' + esc(s.leaderNameTh) : '') + ' · ติดต่อล่าสุด ' + (s.contact ? 'วันที่ ' + s.contact : 'ยังไม่เคย') + '</div>' + (specs ? '<div class="muted">สินค้า/ทรัพยากรเฉพาะถิ่น: ' + specs + '</div>' : '') + '</div>';
      }).join('');
      if (pol.events && pol.events.length) {
        h += '<h3>📜 บันทึกสนธิสัญญาและการเมืองยุทธภพ</h3><div class="card">' + pol.events.slice(-8).reverse().map(e => '<div class="logrow"><span class="tm">วันที่ ' + e.day + '</span>' + esc(e.summaryTh) + '</div>').join('') + '</div>';
      }
      h += '<div class="muted">ท่าทีต่ำมาก → เสี่ยงถูกคว่ำบาตร/บุกโจมตี · ท่าทีสูง → ลงนามสัญญาการค้า/พันธมิตรยุทธภพ ส่งขบวนทรัพยากรและช่วยป้องกันสำนัก</div>';
    } else {
      const l = W.logs.filter(x => ['mission', 'raid', 'event', 'tournament'].includes(x.type)).slice(-60).reverse(); h += l.length ? l.map(x => '<div class="logrow"><span class="tm">' + dayStamp(x.t) + '</span>' + linkify(W, x.text, x.ids, x.refs) + '</div>').join('') : '<div class="muted">ยังไม่มีเหตุการณ์นอกสำนัก</div>';
    }
    return h;
  };


  UI.rVisitors = () => {
    const W = UI.G.W;
    if (!g.VC) return '<div class="muted">ไม่พบโมดูลผู้มาเยือน</div>';
    g.VC.ensure(W);
    const guests = g.VC.activeGuests(W);
    const traders = g.EXT ? g.EXT.activeVisitors(W) : [];
    const regList = Object.values(W.world.guestRegistry || {}).slice(-16).reverse();
    const hist = (W.world.visitorHistory || []).slice(-15).reverse();
    let h = '<div class="card"><b>🎐 ผู้มาเยือนและคนนอกสำนัก (Outsiders & Visitors)</b><div class="muted">ผู้มาเยือนเป็นคนนอกที่เดินทางมาค้าขาย สนทนา แลกเปลี่ยนคัมภีร์ หรือบอกเล่าเบาะแสในยุทธภพ โดยไม่นับรวมในโควตาเตียงพัก 100 คนของศิษย์ในสำนัก</div>';
    h += '<div class="grid2" style="margin-top:6px"><div>🎐 แขกในสำนักขณะนี้ <b>' + guests.length + ' คน</b></div><div>🪙 พ่อค้าเร่ในตลาด <b>' + traders.length + ' คน</b></div><div>📖 แขกขาจรที่คุ้นเคย <b>' + Object.keys(W.world.guestRegistry || {}).length + ' คน</b></div><div>門 นโยบายเปิดรับสำนัก <b>' + Math.round((W.sect.policy && W.sect.policy.openness) || 50) + '%</b></div></div></div>';

    h += '<h3>🎐 แขกยุทธภพที่กำลังพำนักในสำนัก (' + guests.length + ')</h3>';
    if (guests.length) {
      h += guests.map(v => {
        const stChip = v.state === 'admitted' ? '<span class="chip ok">รับรองเข้าสำนัก</span>' : '<span class="chip g">จำกัดพื้นที่หน้าด่าน/ลาน</span>';
        const bld = (W.map.byId && W.map.byId[v.targetBkey]) ? W.map.byId[v.targetBkey].nameTh : 'ลานสำนัก';
        return '<div class="card" style="cursor:pointer" data-visitor="' + esc(v.id) + '"><div style="display:flex;justify-content:space-between;align-items:center"><b>🎐 ' + esc(v.nameTh) + (v.chineseName ? ' (' + esc(v.chineseName) + ')' : '') + '</b>' + stChip + '</div><div class="sub">' + esc(v.titleTh || '') + ' · พักถึงวันที่ ' + v.untilDay + ' · บริเวณ: ' + esc(bld) + '</div><div class="muted" style="font-size:11.5px;margin-top:3px">จุดประสงค์: ' + esc(v.purposeTh || '-') + ' · อนุญาตโดย: ' + esc(v.admissionBy || 'เวรยามประตู') + ' (' + esc(v.admissionReasonTh || '') + ')</div></div>';
      }).join('');
    } else {
      h += '<div class="card muted">ขณะนี้ไม่มีแขกยุทธภพพำนักในสำนัก</div>';
    }

    if (traders.length) {
      h += '<h3>🪙 พ่อค้าเร่ที่ตลาดสำนัก (' + traders.length + ')</h3>';
      h += traders.map(v => '<div class="card" style="cursor:pointer" data-visitor="' + esc(v.id) + '"><b>🪙 ' + esc(v.nameTh) + '</b> <span class="chip">อยู่ถึงวันที่ ' + v.untilDay + '</span><div class="sub">เงินทุน ' + U.fmtNum(v.stones || 0) + ' ศิลา · แตะเพื่อดูรายละเอียด</div></div>').join('');
    }

    if (regList.length) {
      h += '<h3>🤝 บันทึกผู้มาเยือนขาประจำและคนรู้จักนอกสำนัก (' + regList.length + ')</h3><div class="card">';
      h += regList.map(v => '<div class="logrow" style="cursor:pointer" data-visitor="' + esc(v.id) + '"><span><b>' + esc(v.nameTh) + '</b> <span class="muted">(' + esc(v.titleTh || v.role) + ')</span></span><span class="muted">มาเยือน ' + (v.visits || 1) + ' ครั้ง · ไมตรี ' + Math.round(v.affinityToSect || 50) + '</span></div>').join('');
      h += '</div>';
    }

    if (hist.length) {
      h += '<h3>📜 ประวัติการมาเยือนล่าสุด</h3><div class="card">' + hist.map(x => '<div class="logrow"><span class="tm">วันที่ ' + x.day + '</span><span><a class="link-ref visitor" data-visitor="' + esc(x.visitorId) + '" style="color:#ffcb77;text-decoration:none;font-weight:600">🎐 ' + esc(x.nameTh) + '</a> — ' + esc(x.summaryTh || x.outcome || '') + '</span></div>').join('') + '</div>';
    }
    return h;
  };

  UI.rVisitor = () => {
    const W = UI.G.W;
    const v = (g.VC && g.VC.findVisitor) ? g.VC.findVisitor(W, UI.visitorId) : null;
    if (!v) return '<div class="muted">ไม่พบข้อมูลผู้มาเยือน</div>';
    const onMap = (v.state === 'admitted' || v.state === 'restricted') && v.untilDay >= W.day && Number.isFinite(v.x);
    let h = '<div class="card"><div style="font-size:16px;font-weight:700">🎐 ' + esc(v.nameTh) + (v.chineseName ? ' <span class="muted">(' + esc(v.chineseName) + ')</span>' : '') + '</div>';
    h += '<div class="sub">' + esc(v.titleTh || v.role || 'ผู้มาเยือน') + ' · สถานะ: <b>' + (onMap ? 'กำลังพำนักในสำนัก' : 'เดินทางออกจากสำนักแล้ว (Offsite Registry)') + '</b></div>';
    if (v.purposeTh) h += '<div style="margin-top:6px">🎯 <b>จุดประสงค์การมาเยือน:</b> ' + esc(v.purposeTh) + '</div>';
    if (v.admissionReasonTh) h += '<div class="muted" style="margin-top:4px">🚪 <b>การคัดกรองที่ประตูสำนัก:</b> ' + esc(v.admissionReasonTh) + (v.admissionBy ? ' (ผู้พิจารณา: ' + esc(v.admissionBy) + ')' : '') + '</div>';
    h += '<div class="grid2" style="margin-top:6px"><div>ไมตรีต่อสำนัก <b>' + Math.round(v.affinityToSect == null ? 50 : v.affinityToSect) + '/100</b></div><div>ความน่าเชื่อถือ <b>' + Math.round(v.credibility == null ? 65 : v.credibility) + '%</b></div><div>จำนวนครั้งที่มาเยือน <b>' + (v.visits || 1) + ' ครั้ง</b></div><div>ศิลาพกพา <b>' + U.fmtNum(Math.round(v.stones || 0)) + '</b></div></div>';
    if (onMap) {
      h += '<div style="margin-top:8px"><button class="btn pri" data-do="locv" data-arg="' + esc(v.id) + '">📍 ดูตำแหน่งบนแผนที่สำนัก</button></div>';
    }
    h += '</div>';
    if (Array.isArray(v.interactions) && v.interactions.length) {
      h += '<h3>💬 บันทึกการสนทนาและแลกเปลี่ยนกับคนในสำนัก</h3><div class="card">' + v.interactions.slice(-12).reverse().map(it => '<div class="logrow"><span class="tm">วันที่ ' + it.day + '</span><span>' + linkify(W, it.textTh, it.npcId ? [it.npcId] : []) + '</span></div>').join('') + '</div>';
    }
    return h;
  };

  UI.rClues = () => {
    const W = UI.G.W;
    if (!g.VC) return "<div class=\"muted\">ไม่พบโมดูลเบาะแส</div>";
    const cs = g.VC.ensure(W);
    const activeList = Object.values(cs.active || {}).sort((a, b) => (b.rarity === "Legendary" ? 1 : 0) - (a.rarity === "Legendary" ? 1 : 0) || b.createdDay - a.createdDay);
    const uniqueArts = Object.values(W.world.uniqueArtifacts || {});
    const vNews = (W.world && Array.isArray(W.world.visitorNews)) ? W.world.visitorNews.slice(-6).reverse() : [];

    let h = "<div class=\"card\"><div style=\"display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px\"><b>🗺️ เบาะแส ข่าวลือ และมรดกยุทธภพ (Living Clues & Inheritance)</b><button class=\"btn\" style=\"padding:3px 8px;font-size:11px\" data-do=\"toggle-clue-debug\">" + (UI.showClueDebug ? "🙈 ซ่อนโหมดผู้สังเกตการณ์ (Debug)" : "👁️ เปิดโหมดผู้สังเกตการณ์ (Debug)") + "</button></div>";
    h += "<div class=\"muted\" style=\"margin-top:4px\">ศิษย์ตัดสินใจสืบเบาะแสจากความเชื่อมั่น การยืนยันจากหลายแหล่ง และความพร้อมของตนเอง (แสดงเฉพาะขั้นตอนที่สำนัก/ศิษย์ค้นพบแล้วเท่านั้น)</div>";
    const fn = cs.funnel || {};
    h += "<div class=\"grid2\" style=\"margin-top:6px\"><div>ข่าวลือที่ได้รับ <b>" + (fn.rumorsSpawned || 0) + "</b></div><div>แบ่งปันในสำนัก <b>" + (fn.cluesShared || 0) + "</b></div><div>ข่าวสารยุทธภพทั่วไป <b>" + (fn.worldNewsShared || 0) + "</b></div><div>ออกสืบเบาะแส <b>" + (fn.investigationsStarted || 0) + "</b></div><div>ผ่านด่านทดสอบ <b>" + (fn.nodesPassed || 0) + "</b></div><div>คว้ามรดกสำเร็จ <b>" + (fn.rewardsClaimed || 0) + "</b></div></div></div>";

    if (vNews.length) {
      h += "<h3>📰 ข่าวสารและเหตุการณ์ยุทธภพจากผู้มาเยือน (" + vNews.length + ")</h3><div class=\"card\">";
      h += vNews.map(nw => "<div class=\"logrow\"><span class=\"tm\">วันที่ " + nw.day + "</span><span><b>" + esc(nw.speakerNameTh || "ผู้มาเยือน") + ":</b> " + esc(nw.textTh) + "</span></div>").join("");
      h += "</div>";
    }

    if (uniqueArts.length) {
      h += "<h3>🗡️ ศาสตราวุธระดับตำนานที่ปรากฏในโลกแล้ว (" + uniqueArts.length + "/11)</h3><div class=\"card\">";
      h += uniqueArts.map(ua => {
        const wDef = g.VC.LEGENDARY_WEAPON_BY_ID && g.VC.LEGENDARY_WEAPON_BY_ID[ua.itemId];
        return "<div class=\"logrow\"><span><span class=\"chip g\">★ ตำนาน T7</span> <b>" + esc(wDef ? wDef.nameTh : ua.itemId) + "</b>" + (wDef && wDef.chineseName ? " <span class=\"muted\">(" + esc(wDef.chineseName) + ")</span>" : "") + "</span><span class=\"muted\">ผู้ถือครอง: <b>" + esc(ua.ownerNameTh || ua.ownerKind) + "</b></span></div>";
      }).join("");
      h += "</div>";
    }

    h += "<h3>🧭 เบาะแสและสายสืบค้นทั้งหมด (" + activeList.length + ")</h3>";
    if (!activeList.length) {
      h += "<div class=\"card muted\">ยังไม่มีเบาะแสที่รับรู้ในสำนัก — ผู้มาเยือน การพูดคุยกับสำนักพันธมิตร และการออกสำรวจจะค่อย ๆ นำข่าวลือเข้ามา</div>";
    } else {
      h += activeList.map(inst => {
        const pView = (g.VC.getPlayerClueView && !UI.showClueDebug) ? g.VC.getPlayerClueView(W, inst.instanceId, { debugAllSteps: false }) : null;
        const tpl = g.VC.TEMPLATE_BY_ID[inst.templateId] || {};
        const step = pView ? pView.currentKnownStep : (tpl.steps || [])[inst.currentNodeIdx || 0];
        const knowers = Object.keys(inst.knownBy || {}).map(id => W.byId[id]).filter(Boolean);
        const avgConf = knowers.length ? Math.round(knowers.reduce((s, n) => s + ((inst.knownBy[n.id] && inst.knownBy[n.id].confidence) || 55), 0) / knowers.length) : 55;
        const stCol = inst.status === "claimed" ? "ok" : inst.status === "disproven" ? "r" : inst.status === "in_progress" ? "b" : "g";
        const stTh = { active: "กำลังเปิดสืบค้น", in_progress: "กำลังส่งคนไปสืบ", claimed: "ได้รับมรดกแล้ว", disproven: "พิสูจน์แล้วว่าเป็นข่าวลือเท็จ", expired: "พ้นกำหนดเวลา", abandoned: "ยุติการสืบค้นชั่วคราว" }[inst.status] || inst.status;
        let card = "<div class=\"card\" style=\"cursor:pointer\" data-clue=\"" + esc(inst.instanceId) + "\">";
        card += "<div style=\"display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap\"><b>" + (tpl.rarity === "Legendary" ? "★ " : "🗺️ ") + esc(inst.titleTh) + "</b><span class=\"chip " + stCol + "\">" + esc(stTh) + "</span></div>";
        card += "<div class=\"sub\" style=\"margin-top:3px\">" + esc(inst.rumorTextTh || "") + "</div>";
        card += "<div class=\"muted\" style=\"font-size:11.5px;margin-top:4px\">ผู้รับรู้ในสำนัก (" + knowers.length + "): " + (knowers.length ? knowers.slice(0, 5).map(n => esc(n.h.name.given)).join("、") : "คลังข่าวสารสำนัก") + " · ความเชื่อมั่นเฉลี่ย <b>" + avgConf + "%</b> · แหล่งข่าวอิสระ <b>" + ((inst.corroboratingRoots || []).length) + " แหล่ง</b></div>";
        if (step && inst.status !== "claimed" && inst.status !== "disproven") {
          const scopeTh = step.scope === "personal" ? "👤 ทดสอบเฉพาะตัวผู้สืบทอด" : step.scope === "party_all" ? "👥 ทดสอบร่วมกันทั้งคณะ" : "🤝 สมาชิกในคณะช่วยกันได้";
          const hiddenCnt = pView ? pView.hiddenFutureStepsCount : 0;
          card += "<div style=\"margin-top:4px;font-size:12px\">↳ <b>ขั้นปัจจุบันที่ทราบ:</b> " + esc(step.titleTh) + " <span class=\"chip\">" + scopeTh + "</span>" + (hiddenCnt > 0 ? " <span class=\"muted\">(มีเงื่อนงำถัดไปที่ยังไม่เปิดเผยอีก " + hiddenCnt + " ขั้น)</span>" : "") + "</div>";
        }
        if (inst.backoffUntilDay && inst.backoffUntilDay > W.day) {
          card += "<div class=\"muted\" style=\"font-size:11.5px;margin-top:3px;color:#ff9e94\">⏳ พักเตรียมความพร้อมหลังติดขัด ถึงวันที่ " + inst.backoffUntilDay + " (ล้มเหลวสะสม " + (inst.failCount || 1) + " ครั้ง)</div>";
        }
        if (inst.lastActionReasonTh) {
          card += "<div class=\"muted\" style=\"font-size:11.5px;margin-top:3px;color:var(--gold)\">📌 สถานะล่าสุด: " + esc(inst.lastActionReasonTh) + "</div>";
        }
        if (UI.showClueDebug) {
          card += "<div style=\"margin-top:5px;padding:4px 6px;background:rgba(255,215,100,0.08);border:1px dashed var(--gold);font-size:11px\">🔍 <b>[Debug World Truth]</b> template=<code>" + esc(inst.templateId) + "</code> · truth=<b>" + esc(inst.truthState) + "</b> · target=<code>" + esc(tpl.targetKind + ":" + tpl.targetId) + "</code> · rootRumorId=<code>" + esc(inst.rootRumorId) + "</code></div>";
        }
        card += "</div>";
        return card;
      }).join("");
    }
    return h;
  };

  UI.rClueDetail = () => {
    const W = UI.G.W;
    const cs = g.VC && g.VC.ensure ? g.VC.ensure(W) : null;
    const inst = cs && (cs.active[UI.clueId] || (cs.history || []).find(x => x.instanceId === UI.clueId));
    if (!inst) return "<div class=\"muted\">ไม่พบข้อมูลเบาะแส</div>";
    const tpl = (g.VC && g.VC.TEMPLATE_BY_ID && g.VC.TEMPLATE_BY_ID[inst.templateId]) || {};
    const pView = (g.VC && g.VC.getPlayerClueView) ? g.VC.getPlayerClueView(W, inst.instanceId, { debugAllSteps: !!UI.showClueDebug }) : null;
    const knowers = Object.entries(inst.knownBy || {});
    let h = "<div class=\"card\"><div style=\"font-size:16px;font-weight:700\">" + (tpl.rarity === "Legendary" ? "★ " : "🗺️ ") + esc(inst.titleTh) + "</div>";
    h += "<div class=\"sub\" style=\"margin-top:4px\">" + esc(inst.rumorTextTh || "") + "</div>";
    h += "<div class=\"muted\" style=\"margin-top:4px\">สถานะ: <b>" + esc(inst.status) + "</b> · บันทึกเข้าหอคัมภีร์สำนัก: <b>" + (inst.reportedToSect ? "บันทึกแล้ว" : "รู้เฉพาะตัว") + "</b> · แหล่งข่าวต้นตออิสระ: <b>" + ((inst.corroboratingRoots || []).length) + " แหล่ง</b></div>";
    if (inst.backoffUntilDay && inst.backoffUntilDay > W.day) {
      h += "<div style=\"margin-top:4px;color:#ff9e94;font-size:12px\">⏳ <b>ช่วงพักเตรียมตัว (Backoff):</b> รอถึงวันที่ " + inst.backoffUntilDay + " · ล้มเหลวสะสม " + (inst.failCount || 1) + " ครั้ง</div>";
    }
    if (inst.lastActionReasonTh) h += "<div style=\"margin-top:6px;color:var(--gold)\">📌 <b>ความคืบหน้าล่าสุด:</b> " + esc(inst.lastActionReasonTh) + "</div>";
    h += "</div>";

    // Readiness Forecast & Approach Selector for Current Step
    const curStep = (tpl.steps || [])[inst.currentNodeIdx || 0];
    if (curStep && inst.status !== "claimed" && inst.status !== "disproven") {
      const leadNpc = knowers.length ? W.byId[knowers[0][0]] : W.byId[W.sect.masterId];
      const forecast = (g.VC && g.VC.forecastNodeReadiness && leadNpc) ? g.VC.forecastNodeReadiness(W, leadNpc, inst, curStep) : null;
      const approaches = Array.isArray(curStep.approaches) && curStep.approaches.length ? curStep.approaches : ["interpret_evidence", "tactical_retreat"];
      const appNames = {
        auto: "🤖 ให้ผู้สืบเลือกตามความถนัด",
        interpret_evidence: "🔍 ตีความจารึก/แกะรอย",
        help_contact: "🤝 ช่วยเหลือผู้รู้/สานไมตรี",
        honor_commitment: "⚖️ รักษาคำสัตย์/พันธสัญญา",
        nonlethal_trial: "🥋 ประลองเชิงยุทธ์ไม่เอาชีวิต",
        deliver_item: "🎁 มอบสิ่งของ/เครื่องเซ่น",
        guardian_combat: "⚔️ ปะทะผู้พิทักษ์ด่าน",
        tactical_retreat: "🛡️ ถอยเชิงยุทธ์รักษาชีวิต"
      };
      const curApp = inst.preferredApproach || "auto";
      h += "<h3>🧭 แนวทางคลี่คลายด่านปัจจุบัน & การประเมินความพร้อม</h3><div class=\"card\">";
      if (forecast) {
        h += "<div>ผู้ประเมินหลัก: <b>" + esc(leadNpc ? HC.fullName(leadNpc) : "-") + "</b> · ความพร้อม: <b style=\"color:" + (forecast.ready ? "#5fd38a" : "#f0a030") + "\">" + (forecast.ready ? "✔ พร้อมดำเนินการ" : "⏳ ต้องเตรียมตัวเพิ่ม") + "</b> (" + esc(forecast.reasonTh || "") + ")</div>";
      }
      h += "<div style=\"margin-top:6px;font-size:12px\"><b>เลือกแนวทางรับมือเมื่อคณะเดินทางไปถึง:</b></div><div style=\"display:flex;gap:4px;flex-wrap:wrap;margin-top:4px\">";
      ["auto"].concat(approaches).forEach(ap => {
        const on = curApp === ap;
        h += "<button type=\"button\" class=\"chip " + (on ? "g" : "") + "\" data-do=\"set-clue-approach\" data-arg=\"" + esc(inst.instanceId + "|" + ap) + "\" style=\"cursor:pointer\">" + esc(appNames[ap] || ap) + "</button>";
      });
      h += "</div></div>";
    }

    if (tpl.steps && tpl.steps.length) {
      const maxKnownIdx = UI.showClueDebug ? (tpl.steps.length - 1) : (pView && Array.isArray(pView.visibleSteps) ? (pView.visibleSteps.length - 1) : (inst.currentNodeIdx || 0));
      const visibleSteps = tpl.steps.slice(0, maxKnownIdx + 1);
      const hiddenCount = Math.max(0, tpl.steps.length - visibleSteps.length);
      h += "<h3>🪜 ลำดับขั้นการสืบค้นที่เปิดเผยแล้ว (" + visibleSteps.length + (UI.showClueDebug ? "/" + tpl.steps.length : "") + " ขั้น)</h3><div class=\"card\">";
      h += visibleSteps.map((st, idx) => {
        const done = idx < (inst.currentNodeIdx || 0) || inst.status === "claimed";
        const cur = idx === (inst.currentNodeIdx || 0) && inst.status !== "claimed" && inst.status !== "disproven";
        const scopeTh = st.scope === "personal" ? "ทดสอบเฉพาะบุคคล (เพื่อนร่วมทีมแบกแทนไม่ได้)" : st.scope === "party_all" ? "ทดสอบทั้งคณะ" : "สมาชิกในทีมช่วยตรวจได้";
        return "<div style=\"padding:4px 0;border-bottom:1px solid var(--line,#3a3f4a)\"><b>" + (done ? "✅ " : cur ? "👉 " : "🔒 ") + "ขั้นที่ " + (idx + 1) + ": " + esc(st.titleTh) + "</b> <span class=\"chip\">" + esc(st.type) + "</span> <span class=\"chip b\">📍 " + esc(st.locationId || "sect") + "</span><div class=\"muted\" style=\"font-size:11.5px\">" + esc(st.hintTh || "") + " · ขอบเขต: " + scopeTh + "</div></div>";
      }).join("");
      if (hiddenCount > 0) {
        h += "<div class=\"muted\" style=\"padding-top:6px\">🔒 <i>ยังมีเงื่อนงำขั้นถัดไปที่ยังไม่ถูกค้นพบอีก " + hiddenCount + " ขั้น (ต้องคลี่คลายขั้นปัจจุบันให้สำเร็จก่อน)</i></div>";
      }
      h += "</div>";
    }

    if (inst.lastEncounterSummary && Array.isArray(inst.lastEncounterSummary.logTh) && inst.lastEncounterSummary.logTh.length) {
      const el = inst.lastEncounterSummary;
      h += "<h3>⚔️ บันทึกการปะทะในการสำรวจนอกสำนัก (" + esc(el.guardianNameTh || "ผู้พิทักษ์") + ")</h3><div class=\"card\">";
      h += "<div class=\"sub\" style=\"margin-bottom:4px\">ผลลัพธ์: <b>" + (el.win ? "ชนะผู้พิทักษ์" : el.retreated ? "ถอยเชิงยุทธ์" : "พ่ายแพ้") + "</b> · จำนวนกระบวนท่า: " + el.rounds + " รอบ</div>";
      h += el.logTh.map(line => "<div class=\"logrow\">" + esc(line) + "</div>").join("");
      h += "</div>";
    }

    if (Array.isArray(inst.partyRefusals) && inst.partyRefusals.length) {
      h += "<h3>🙅 บันทึกการพิจารณาคำชวนร่วมคณะสืบค้น</h3><div class=\"card\">";
      h += inst.partyRefusals.slice(-6).reverse().map(rf => "<div class=\"logrow\"><span class=\"tm\">วันที่ " + rf.day + "</span><span><b>" + esc(rf.npcNameTh || rf.npcId) + "</b> ปฏิเสธคำชวนของ " + esc(rf.leaderNameTh || "-") + " — <span class=\"muted\">" + esc(rf.reasonTh || "") + "</span></span></div>").join("");
      h += "</div>";
    }

    if (knowers.length) {
      h += "<h3>👥 ศิษย์ที่รับรู้เบาะแสนี้ (" + knowers.length + " คน)</h3><div class=\"card\">";
      h += knowers.map(([nid, info]) => {
        const npc = W.byId[nid];
        return "<div class=\"logrow\"><span>" + (npc ? nameLink(npc) : esc(nid)) + " <span class=\"muted\">(รับรู้วันที่ " + info.learnedDay + " · ทราบถึงขั้นที่ " + ((info.knownNodeIdx || 0) + 1) + ")</span></span><b>เชื่อมั่น " + Math.round(info.confidence || 55) + "%</b></div>";
      }).join("");
      h += "</div>";
    }

    if (Array.isArray(inst.history) && inst.history.length) {
      h += "<h3>📜 บันทึกการสืบค้นเบาะแส</h3><div class=\"card\">" + inst.history.slice().reverse().map(ev => "<div class=\"logrow\"><span class=\"tm\">วันที่ " + ev.day + "</span><span>" + esc(ev.text) + "</span></div>").join("") + "</div>";
    }
    return h;
  };

  UI.rEcology = () => {
    const W = UI.G.W, eco = JD.ECOLOGY;
    if (!eco) return '<div class="muted">ยังไม่มีข้อมูลนิเวศอสูร</div>';
    let h = '<div class="card"><b>🐾 สัตว์อสูรและนิเวศยุทธภพ v1.10.12</b><div class="muted">สัตว์อสูร 80 ชนิด 12 ตระกูล วัตถุดิบ 160 รายการ และสูตรผลิต 80 สูตร อสูรอาศัยอยู่ตามทิศและภูมิประเทศรอบสำนัก</div></div>';

    const active = W.wildlife ? W.wildlife.beasts.filter(b => !b.dead && !b.gone) : [];
    h += '<h3>สัตว์อสูรบนแผนที่ขณะนี้ (' + active.length + '/12)</h3>';
    if (active.length) {
      h += active.map(b => {
        const z = g.WILD?.zones[b.zone];
        const zName = z ? z.nameTh : b.zone;
        const hpPct = Math.round((b.hp / b.hpMax) * 100);
        return '<div class="card"><b>' + (b.legendary ? '★ ' : '') + esc(b.name) + '</b> <span class="chip ' + (b.legendary ? 'v' : b.tier >= 4 ? 'ok' : 'b') + '">ระดับ ' + b.tier + '</span> <span class="chip">' + esc(zName) + '</span><div>พลังรบ ' + b.power + ' CP · เลือด ' + Math.round(b.hp) + '/' + b.hpMax + ' (' + hpPct + '%)</div>' + (b.legendary ? '<div class="muted">อสูรบรรพกาลหายาก อาจจากไปเมื่อใดก็ได้</div>' : '') + '</div>';
      }).join('');
    } else {
      h += '<div class="muted">ยังไม่มีสัตว์อสูรปรากฏตัวรอบสำนักในขณะนี้</div>';
    }

    h += '<h3>สารานุกรม 12 ตระกูลอสูรและอสูรบรรพกาล (80 ชนิด)</h3>';
    const famNames = {
      CANINE: 'สุนัข/หมาป่า', FELINE: 'เสือ/แมวป่า', URSINE: 'หมี', BOAR: 'หมูป่า',
      SERPENT: 'อสรพิษ/งู', AVIAN: 'วิหค/อินทรี', ARTHROPOD: 'แมลง/แมงป่อง',
      SHELL: 'เต่า/หุ้มเกราะ', UNGULATE: 'กวาง/กระทิง', AQUATIC: 'มัจฉา/สัตว์น้ำ',
      PLANT_SPIRIT: 'พฤกษา/เห็ด', CHIMERA: 'สัตว์ผสม/วิญญาณ'
    };

    h += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">';
    Object.keys(famNames).forEach(f => {
      const cnt = eco.species.filter(s => s.family === f).length;
      h += '<span class="chip">' + esc(famNames[f]) + ' (' + cnt + ')</span>';
    });
    h += '<span class="chip v">ตำนานชั้นฟ้า (8)</span></div>';

    h += '<h3>ตัวอย่างสายพันธุ์และชิ้นส่วนสำคัญ</h3>';
    h += eco.species.slice(0, 36).map(s => {
      const drops = (s.drops || []).map(id => esc(ECO.name(id))).join(' · ');
      const habitat = s.terrain === 'water' ? 'ลุ่มน้ำสาบมังกรคราม (ภารกิจภายนอก)' : 'รอบสำนัก (' + s.terrain + ')';
      return '<div class="card"><b>' + (s.tier >= 6 ? '★ ' : '') + esc(s.nameTh) + '</b> <span class="chip ' + (s.tier >= 6 ? 'v' : s.tier >= 4 ? 'ok' : 'b') + '">ขั้น ' + s.tier + '</span> <span class="chip">' + esc(s.family || 'อสูร') + '</span><div class="muted">พลังรบ ' + s.cp + ' CP · ถิ่น: ' + esc(habitat) + ' · ธาตุ: ' + esc(s.element) + '</div><div>ชิ้นส่วนดรอป: ' + drops + '</div></div>';
    }).join('');
    h += '<div class="muted" style="text-align:center;padding:8px">และอีก 44 ชนิดในสารานุกรมธรรมชาติ</div>';

    h += '<h3>ตำรับคราฟจากวัตถุดิบอสูร (80 สูตร)</h3>';
    h += '<div class="card">โอสถรักษา/บัฟ/ตบะ 48 ตำรับ · ศาสตราวุธและชุดยุทธ์ 32 รายการ รองรับวิถีทั้ง 14 ประเภท<div class="muted">ผลิตได้ที่โรงหลอมและหอโอสถ สมาชิกจะนำวัตถุดิบจากการล่ามาบริจาคหรือซื้อใช้ตามความเหมาะสมของวิถี</div></div>';

    return h;
  };

  UI.rContent = () => {
    const W = UI.G.W, D = JD.EXPANSION, C = g.CONTENT;
    let h = '<div class="card"><b>เนื้อหายุทธภพ v1.10</b><div class="muted">สมาชิกเลือกเดินทางจากกำลัง ความสนใจ ความระวัง และของที่สำนักขาด คัมภีร์กับตำรับต้องค้นพบก่อนใช้งาน</div></div>';
    h += '<h3>เส้นทางภายนอก</h3>' + D.regions.map(r => {
      const s = C.site(W, r), known = r.recipes.filter(id => W.sect.knownRecipes.includes(id)).length;
      return '<div class="card"><b>' + r.icon + ' ' + esc(r.nameTh) + '</b><div class="muted">' + esc(r.desc) + '</div><div>อันตราย ' + r.danger + '/4 · เดินทางประมาณ ' + r.days + ' วัน · กำลังคณะขั้นต่ำ ' + r.minPower + '</div><div class="muted">' + esc(r.hazardTh) + '</div><div>' + r.resources.map(e => '<span class="chip ' + (e.kind === 'hunt' ? 'v' : 'ok') + '">' + (e.kind === 'hunt' ? '🐾 ' : '🌿 ') + esc(ECO.name(e.id)) + ' ' + Math.floor(s.stock[e.id]) + '/' + e.cap + '</span>').join('') + '</div><div class="muted">ทรัพยากรฟื้นตัววันละ 1–3 หน่วยตามชนิด · 🐾 ต้องล่าสำเร็จ · กลับแล้ว ' + s.visits + ' ครั้ง · พบตำรับ ' + known + '/' + r.recipes.length + '</div></div>';
    }).join('');
    h += '<h3>ตำรับที่ค้นพบ ' + W.sect.knownRecipes.filter(id => ECO.recipeById[id]).length + '/' + D.recipes.length + '</h3>' + D.recipes.map(r => {
      const found = W.sect.knownRecipes.includes(r.id), known = ECO.recipeKnown(W, r), holders = C.formulaHolders ? C.formulaHolders(W, r.id) : [];
      const route = D.regions.find(z => z.recipes.includes(r.id)), fee = C.recipeFee ? C.recipeFee(W, r) : 0;
      const statusTxt = known ? 'รู้สูตรแล้ว' : found ? 'ต้องวิจัยตำรับระดับ ' + r.tier : holders.length ? 'ม้วนตำรับอยู่กับ ' + holders.map(x => esc(x.h.name.given)).join('、') : 'ต้องค้นพบและนำกลับสำนัก';
      return '<div class="card"><b>' + ((found || holders.length) ? esc(r.nameTh) : '🔒 ม้วนตำรับที่ยังไม่พบ') + '</b><div class="muted">' + esc(route.nameTh) + ' · ระดับ ' + r.tier + ' · ' + statusTxt + '</div>' + ((found || holders.length) ? '<div>' + r.inputs.map(i => esc(ECO.name(i.matId)) + ' ' + ECO.count(W, i.matId) + '/' + i.count).join(' · ') + '</div><div class="muted">ฝีมือ ' + r.craft + ' ≥ ' + Math.max(0, r.minMastery - 20) + ' · อาคารระดับ ' + r.facilityLevel + ' · ค่าสิทธิ์ศึกษา ' + fee + ' คป. · ผลผลิต ' + esc(r.outNameTh) + (r.sourceCompatiblePath !== 'ANY' ? ' · เหมาะกับวิถี ' + r.sourceCompatiblePath : '') + '</div>' : '') + '</div>';
    }).join('');
    h += '<h3>สายย่อยและลำดับขั้นเฉพาะทางอิสระ (9 ขั้นแท้จริง)</h3>' + (D.progressionMapping || []).map(pm => {
      const sub = D.subPaths.find(s => s.id === pm.subPath) || CULT.subInfo(pm.targetMajorPath, pm.subPath);
      return '<div class="card"><b>' + esc(sub ? sub.nameTh : pm.subPath) + '</b> <span class="chip b">วิถี' + esc(CULT.PATHS[pm.targetMajorPath].nameTh) + ' · ลำดับขั้นหลัก ' + pm.targetMajorStages + ' ขั้น · ขั้นเฉพาะทาง 9 ขั้น</span><div class="muted">' + esc(sub ? sub.strengthTh : '') + '<br>ข้อจำกัด: ' + esc(sub ? sub.weaknessTh : '') + '</div><div style="margin-top:6px;font-size:12px"><b>ลำดับ 9 ขั้นแท้จริงและค่าเทียบเคียง:</b><br>' + (pm.realms || []).map(r => '<div style="padding:2px 0;border-bottom:1px dotted var(--line,#3a3f4a)">• <b>ลำดับ ' + r.ordinal + ': ' + esc(r.nameTh) + '</b> <span class="chip ok">เทียบขั้นหลัก ' + r.majorBandEquivalent.toFixed(1) + '</span> <span class="chip">พลังรบเทียบเคียง ' + r.functionalCombatPower + ' CP</span> · อายุขัย ~' + r.lifespanMax + ' ปี · เกณฑ์ทักษะ: ' + r.skillGate.primarySkill + ' ≥ ' + r.skillGate.minPrimarySkill + ' · ศิลา ' + r.resourceCost.stones + ' ก้อน</div>').join('') + '</div></div>';
    }).join('');
    h += '<h3>อวัยวะอสูรกลายพันธุ์และกายวิภาค (' + Object.values(W.sect.organs || {}).reduce((s, v) => s + v, 0) + ' ชิ้นในคลัง)</h3>' + (D.rareOrgans || []).map(o => {
      const cnt = C.organCount ? C.organCount(W, o.id) : 0;
      const beast = (JD.BEASTS.species || []).find(b => b.id === o.beastId);
      const reg = D.regions.find(r => r.id === o.regionId);
      return '<div class="card"><b>🧬 ' + esc(o.nameTh) + '</b> <span class="chip ' + (cnt > 0 ? 'ok' : '') + '">คลัง ' + cnt + '</span> <span class="chip v">ระดับ ' + o.tier + ' · ธาตุ ' + esc(o.element) + '</span><div class="muted">อสูรต้นกำเนิด: ' + esc(beast ? beast.nameTh : o.beastId) + ' (' + esc(reg ? reg.nameTh : o.regionId) + ') · ความยากชำแหละ ' + o.dissectionDifficulty + '</div><div>' + (o.propertyTags || []).map(t => '<span class="chip b">' + esc(t) + '</span>').join('') + '</div><div class="muted">' + esc(o.usesTh || '') + '</div></div>';
    }).join('');
    const expState = (W.sect && W.sect.experiments) || { discovered: [], propertyKnowledge: {}, notes: [] };
    const knownTagList = Object.entries(expState.propertyKnowledge || {}).filter(x => x[1] > 0);
    h += '<h3>การทดลองคุณสมบัติและสูตรประยุกต์ ' + expState.discovered.length + '/' + (D.experiments || []).length + '</h3>';
    if (knownTagList.length) h += '<div class="card"><b>คุณสมบัติวัตถุดิบที่วิเคราะห์แล้ว:</b><div>' + knownTagList.map(x => '<span class="chip ok">' + esc(x[0]) + ' ×' + x[1] + '</span>').join('') + '</div></div>';
    h += (D.experiments || []).map(e => {
      const disc = expState.discovered.includes(e.id);
      const catOrg = C.organById && C.organById[e.catalystOrganId];
      const linkedRec = ECO.recipeById[e.linkedRecipeId];
      return '<div class="card"><b>' + (disc ? '🧪 ' + esc(e.nameTh) : '🔬 สมมติฐาน: ' + esc(e.nameTh)) + '</b> <span class="chip ' + (disc ? 'ok' : 'b') + '">' + (disc ? 'ค้นพบแล้ว' : 'รอการทดลอง') + '</span><div class="muted">ศาสตร์ ' + e.discipline + ' ≥ ' + Math.max(0, e.minMastery - 15) + ' · ระดับ ' + e.tier + ' · ศิลาวิจัย ' + e.stoneCost + ' ก้อน</div><div>วัตถุดิบทดลอง: ' + e.trialInputs.map(i => esc(ECO.name(i.matId)) + ' ' + ECO.count(W, i.matId) + '/' + i.count).join(' · ') + '</div><div class="muted">ตัวเร่งอวัยวะพิเศษ: ' + esc(catOrg ? catOrg.nameTh : e.catalystOrganId) + ' (+' + Math.round((e.catalystBonusChance || 0.18) * 100) + '%) · ยกระดับตำรับ: ' + esc(linkedRec ? linkedRec.nameTh : e.linkedRecipeId) + '</div></div>';
    }).join('');
    h += '<h3>คัมภีร์ใหม่ในหอ ' + D.techniques.filter(t => W.sect.library.includes(t.id)).length + '/' + D.techniques.length + '</h3>' + D.techniques.map(t => {
      const held = W.sect.library.includes(t.id), route = D.regions.find(r => r.techniques.includes(t.id));
      return '<div class="card"><b>' + (held ? esc(t.nameTh) : '🔒 คัมภีร์ที่ยังไม่เข้าสำนัก') + '</b> ' + (held ? gradeChip(t) : '') + '<div class="muted">' + esc(route ? route.nameTh : 'แดนลับยุทธภพ') + ' · ' + esc((CULT.subInfo(t.path, t.sub) || { nameTh: t.path }).nameTh) + ' · ขั้นขั้นต่ำ ' + t.reqTier + '</div>' + (held ? '<div>' + esc(t.passive ? (t.descTh || 'วิชาติดตัว') : g.SK.profile(t).summary) + '</div><div class="muted">ค่าเรียน ' + CPEPrice(W, t) + ' คป. · ต้องได้รับสิทธิ์หอคัมภีร์และมีสายย่อยตรงกัน</div>' : '') + '</div>';
    }).join('');
    return h;
  };
  UI.martialNpc = (W, n) => {
    if (!n.cult || !g.MARTIAL) return '';
    const M = g.MARTIAL, d = M.describe(W, n), fmt = o => Object.entries(o).map(([k, v]) => esc(HC.nameOf('physiology.' + k) || k) + ' ' + (v >= 0 ? '+' : '') + Number(v).toFixed(1)).join(' · '), life = o => Object.entries(o).map(([k, v]) => esc(HC.nameOf('skills.' + k) || k) + ' +' + Math.round((v - 1) * 100) + '%').join(' · ');
    let h = '<h3>วิถีและการเติบโตตามขั้น</h3><div class="card"><b>' + esc(d.now.identity) + '</b><div class="muted">ใช้งานหนึ่งวิถีหลักและหนึ่งสายย่อย · เปลี่ยนได้เมื่อมีความรู้และยอมเสียขั้น · ' + (n.cult.sub === 'NONE' ? 'รอผลึกหรือคัมภีร์สายย่อย' : 'มีสายย่อยแล้ว') + '</div><div>อยากได้: ' + d.desires.map(esc).join(' / ') + '</div><div>สรีระเสริมตอนนี้: ' + fmt(d.now.body) + '</div><div class="muted">สรีระเสริมเข้าค่าสู้โดยตรง ไม่เขียนทับค่ามนุษย์และไม่นับซ้ำเป็นบัฟ</div><div>ขั้นถัดไป: ' + fmt(d.next.body) + '</div><div>งานตอนนี้: ' + life(d.now.life) + '</div><div>งานขั้นถัดไป: ' + life(d.next.life) + '</div>';
    const actInn = (M.activeInnateTechs ? M.activeInnateTechs(n) : []).map(id => typeof id === 'string' ? CULT.tech(id) : id).filter(Boolean);
    const dormInn = (M.dormantInnateTechs ? M.dormantInnateTechs(n) : []).map(id => typeof id === 'string' ? CULT.tech(id) : id).filter(Boolean);
    if (actInn.length || dormInn.length) {
      h += '<div style="margin-top:6px"><b>✦ วิชาเฉพาะสายย่อยติดตัว (ไม่กินช่องวิชาติดตัว):</b></div>';
      actInn.forEach(t => {
        const curStage = (g.SK.unlockedStage && t) ? g.SK.unlockedStage(n, t) : 1;
        const maxStage = (t && Array.isArray(t.stages) && t.stages.length) ? t.stages.length : 1;
        const mast = (g.SK.masteryPoints && t) ? g.SK.masteryPoints(n, t.id) : 0;
        h += '<div style="padding:2px 0"><span class="chip g">ติดตัวสายย่อย · ทำงาน</span> ' + gradeChip(t) + ' <b>' + esc(t.nameTh) + '</b> <span class="muted">(ความชำนาญ ' + mast + ' · ขั้นวิชา ' + curStage + '/' + maxStage + ')</span><div class="muted" style="font-size:11.5px">' + esc(t.descTh || '') + '</div></div>';
      });
      dormInn.forEach(t => {
        const mast = (g.SK.masteryPoints && t) ? g.SK.masteryPoints(n, t.id) : 0;
        h += '<div style="padding:2px 0;opacity:0.7"><span class="chip">หลับใหล · สายย่อยเดิม (' + esc(t.sub) + ')</span> ' + esc(t.nameTh) + ' <span class="muted">(ความชำนาญคงเดิม ' + mast + ')</span></div>';
      });
    }
    const synInfo = M.evaluateSynergies ? M.evaluateSynergies(n) : { active: [] };
    if (synInfo && Array.isArray(synInfo.active) && synInfo.active.length) {
      h += '<div style="margin-top:6px"><b>⚡ การประสานวิชา สายย่อย และศาสตรา (' + synInfo.active.length + '):</b></div>';
      synInfo.active.forEach(sy => {
        h += '<div style="padding:2px 0"><span class="chip ok">ประสานสำเร็จ</span> <b>' + esc(sy.nameTh) + '</b> <span class="muted">— ' + esc(sy.descTh || '') + '</span></div>';
      });
    }
    const slotInfo = M.passiveSlotInfo ? M.passiveSlotInfo(n) : { base: 3, bonus: 0, total: 3, reasons: [] };
    const maxSlots = slotInfo.total || slotInfo.max || 3;
    const bonusReasons = slotInfo.reasons || slotInfo.bonusReasons || [];
    const activePassIds = M.activePassives ? M.activePassives(n) : [];
    const inactivePassList = M.inactivePassives ? M.inactivePassives(n) : [];
    const pass = n.cult.techs.map(CULT.tech).filter(t => t && (t.passive || t.cat === 'PASSIVE'));
    h += '<div style="margin-top:6px"><b>ช่องวิชาติดตัวที่ทำงาน: ' + activePassIds.length + '/' + maxSlots + ' ช่อง</b> <span class="muted">(พื้นฐาน ' + slotInfo.base + (slotInfo.bonus > 0 ? ' + โบนัสสายย่อย +' + slotInfo.bonus + ' [' + esc(bonusReasons.join(', ')) + ']' : '') + ')</span></div>';
    if (pass.length) {
      h += '<div>' + pass.map(t => {
        const isComp = M.isTechCompatible ? M.isTechCompatible(n, t) : M.activeTechs(n).includes(t.id);
        const condOk = M.conditionMatches(n, t);
        const inSlot = activePassIds.includes(t.id);
        const inactObj = inactivePassList.find(x => x.id === t.id);
        let statusTxt = 'ทำงาน';
        if (!isComp) statusTxt = 'หยุดทำงาน (วิถี/สาย/ขั้นไม่ตรง)';
        else if (!condOk) statusTxt = 'หยุดทำงาน (อุปกรณ์ไม่ตรง)';
        else if (!inSlot) statusTxt = 'หยุดทำงาน (' + (inactObj ? inactObj.reason : 'ไม่ได้บรรจุในช่องวิชาติดตัว') + ')';
        const btn = inSlot
          ? ' <button class="btn" style="padding:1px 6px;font-size:10.5px" data-do="unequip-passive" data-arg="' + n.id + '|' + t.id + '">ถอด</button>'
          : (isComp && condOk ? ' <button class="btn pri" style="padding:1px 6px;font-size:10.5px" data-do="equip-passive" data-arg="' + n.id + '|' + t.id + '">สวมใส่</button>' : '');
        return '<div style="padding:2px 0">' + gradeChip(t) + ' ' + esc(t.nameTh) + ' · ' + esc(M.conditionText(t)) + ' · ' + esc(statusTxt) + btn + '</div>';
      }).join('') + '</div>';
    }
    const combat = (p, f) => Object.entries(p || {}).map(([k, v]) => esc(g.STATS.INFO[k]?.nameTh || k) + ' ' + (v >= 0 ? '+' : '') + Math.round(v * 100) + '%').concat(Object.entries(f || {}).map(([k, v]) => esc(g.STATS.INFO[k]?.nameTh || k) + ' ' + (v >= 0 ? '+' : '') + Number(v).toFixed(1))).join(' · ');
    h += '<div>วิถีตอนนี้: ' + combat(d.now.p) + '</div><div>วิถีขั้นถัดไป: ' + combat(d.next.p) + '</div><div>สายย่อยตอนนี้: ' + combat(d.subNow.p, d.subNow.f) + '</div><div>สายย่อยขั้นถัดไป: ' + combat(d.subNext.p, d.subNext.f) + '</div><div class="muted">แนวเติบโต: ' + ({ early: 'เด่นช่วงต้น', late: 'เด่นช่วงปลาย', steady: 'เพิ่มสม่ำเสมอ' })[d.now.curve] + '</div>';
    h += '</div><h3>ผลึกความรู้ในตัว</h3><div class="card">' + (d.crystals.length ? d.crystals.map(([key, qty]) => { const choice = M.crystalDecision(W, n, key), gate = M.eligible(n, key); return '<div>' + esc(M.crystalName(key)) + ' ×' + qty + ' · ' + esc(({ use: 'ตั้งใจใช้', retain: 'เก็บไว้', donate: 'ตั้งใจบริจาค' })[choice.action]) + '<div class="muted">' + esc(gate.ok ? choice.reason : gate.reason) + '</div></div>'; }).join('') : '<span class="muted">ยังไม่มีผลึก · ผลึกใช้ได้ครั้งเดียวเมื่อเรียนสำเร็จ</span>') + '</div>';
    return h;
  };
  UI.martialSkills = (W, n) => {
    const M = g.MARTIAL; return Object.entries(M.SKILL_GROUPS).map(([group, ids]) => '<h3>ทักษะ' + esc(M.SKILL_GROUP_NAMES[group]) + '</h3><div class="card">' + ids.slice().sort((a, b) => M.skillRead(n, b) - M.skillRead(n, a)).map(id => { const info = M.SKILL_INFO[id], boost = M.lifeMult(n, id); return bar(info.nameTh, M.skillRead(n, id), { wide: true }) + '<div class="muted" style="margin-bottom:8px">' + esc(info.effect) + '<br>ฝึกได้จาก: ' + esc(info.route) + (boost > 1 ? ' · ประสิทธิภาพ/การฝึกจากวิถี +' + Math.round((boost - 1) * 100) + '%' : '') + '</div>'; }).join('') + '</div>').join('');
  };
  UI.martialRetraining = (W, n) => {
    const M = g.MARTIAL, intent = n.martialIntent, pick = M.pickRetraining(W, n), target = intent && M.knowledge(intent.targetKey), rows = pick && pick.accessible ? pick.reasons : (intent && intent.reasons || []);
    let h = '<h3>การปรับวิถีและต้นทุนฝึกใหม่</h3><div class="card"><div class="muted">เปลี่ยนวิถีหลักเริ่มขั้น1 ตบะ0 · เปลี่ยนสายเดิมลดอย่างน้อย2ขั้นหรือครึ่งหนึ่ง · ต้องมีผลึก/คัมภีร์จริง</div>';
    if (target) h += '<div>เป้าหมาย: ' + esc(target.nameTh) + ' · ' + esc(({ prepare: 'กำลังเตรียมอาวุธ/วิชา', switch: 'พร้อมยอมลดขั้น', restabilize: 'พักปรับรากฐาน' })[intent.action] || 'เก็บไว้พิจารณา') + '</div>';
    h += rows.length ? rows.map(reason => '<div class="muted">' + esc(reason) + '</div>').join('') : '<div class="muted">ยังไม่มีแผนเปลี่ยนสายที่คุ้มต้นทุน</div>';
    if ((n.retrainUntil || 0) > W.day) h += '<div>พักปรับรากฐานอีก ' + (n.retrainUntil - W.day) + ' วัน</div>';
    const inactive = n.cult ? n.cult.techs.filter(id => !M.activeTechs(n).includes(id)) : []; if (inactive.length) h += '<div class="muted">วิชาที่จำได้แต่ยังไม่ทำงานกับวิถี/ขั้นนี้: ' + inactive.map(id => esc((CULT.tech(id) || {}).nameTh || id)).join(' · ') + '</div>';
    return h + '</div>';
  };
  UI.martialShop = W => {
    const M = g.MARTIAL; if (!M) return ''; const rows = Object.entries(W.sect.crystals || {}).filter(x => x[1] > 0);
    let h = '<h3>ผลึกและคัมภีร์หายาก</h3><div class="card"><div class="muted">ผลึกเป็นของจริง ซื้อเข้ากระเป๋าก่อนใช้ · ต้องตรงวิถี/สาย/ขั้น · คัมภีร์เก็บถาวร เรียนซ้ำได้โดยจ่ายค่าศึกษา</div>' + (rows.length ? rows.map(([key, qty]) => { const k = M.knowledge(key), fee = M.studyFee(W, key), held = k.kind === 'sub' ? (W.sect.subLibrary || []).includes(k.id) : W.sect.library.includes(k.id); return '<div class="logrow"><span>' + esc(M.crystalName(key)) + ' ×' + qty + '</span><b>ขาย ' + M.crystalPrice(W, key) + ' · บริจาคไม่เกิน ' + M.crystalReward(W, key) + ' คป.</b></div><div class="muted">' + esc(CULT.PATHS[k.path]?.shortTh || k.path) + ' · ขั้น ' + k.tier + ' · ' + (held ? 'มีคัมภีร์แล้ว · ค่าศึกษา ' + fee + ' คป.' : '🔒 ยังไม่มีคัมภีร์ในหอ') + '</div>'; }).join('') : '<div class="muted">ยังไม่มีผลึกในคลัง</div>') + '</div>';
    h += '<div class="card">คัมภีร์สายย่อยในหอ: ' + ((W.sect.subLibrary || []).length ? (W.sect.subLibrary || []).map(id => { const k = M.knowledge(M.subKey(id)); return esc(k.nameTh) + ' · ขั้น ' + k.tier + ' · ค่าศึกษา ' + M.studyFee(W, M.subKey(id)) + ' คป.'; }).join(' / ') : 'ยังไม่ค้นพบ') + '</div>'; return h;
  };
  function CPEPrice(W, t) { return g.CPE.techPrice(W, t); }

  UI.rDisc = () => {
    const W = UI.G.W, e = W.explore, EXP = g.EXPLORE; if (!e) return ''; let h = '';
    const gt = e.gate, wd = gt.world ? EXP.WORLD_BY_ID[gt.world] : null;
    h += '<h3>🌀 ประตูมิติสู่แดนหมื่นพิภพ</h3><div class="card">' + (gt.open ? '<b style="color:var(--gold)">เปิดอยู่!</b> แดน「' + esc(wd.nameTh) + '」' + wd.icon + '<div class="muted">' + esc(wd.desc) + '</div><div>อีก ' + Math.max(0, gt.until - W.day) + ' วันจะปิด · อันตราย ' + '★'.repeat(Math.round(wd.d)) + '</div>' : '<span class="muted">ปิดอยู่ — ประตูจะเปิดสุ่มทุก ๆ 3–7 สัปดาห์ แต่ละครั้งเป็นโลกที่ต่างกัน (เปิดมาแล้ว ' + gt.openings + ' ครั้ง)</span>') + '</div>';
    const cv = e.cave; h += '<h3>🕳️ ถ้ำหมื่นสายหมอก</h3><div class="card"><div class="grid2"><div>ลึกสุดที่เคยถึง <b>' + cv.maxDepth + '/10</b></div><div>สำรวจแล้ว <b>' + cv.delves + '</b> ครั้ง</div><div>ผู้พิทักษ์ชั้น 5: ' + (cv.guard[5] ? '✔ ล้มแล้ว' : '<span style="color:#ff9a8f">ยังอยู่</span>') + '</div><div>ผู้พิทักษ์ชั้น 10: ' + (cv.guard[10] ? '✔ ล้มแล้ว' : '<span style="color:#ff9a8f">ยังอยู่</span>') + '</div></div>' + bar('ความสดของถ้ำ', (cv.fresh == null ? 1 : cv.fresh) * 100, { wide: true, color: '#7fd1b9' }) + '<div class="muted">สำรวจถี่ ของที่ได้จะน้อยลง ถ้ำค่อย ๆ ฟื้นตัวเอง</div></div>';
    if (EXP.CAVE_FLOORS) h += '<h3>เส้นทางถ้ำทั้ง 10 ชั้น</h3><div class="card"><div class="muted">แต่ละชั้นมีพื้นที่และเหตุการณ์ต่างกัน การสำรวจหนึ่งครั้งสุ่มพบ 1–2 พื้นที่ และพบเพียงบางเหตุการณ์ในพื้นที่นั้น</div>' + EXP.CAVE_FLOORS.map(floor => '<div data-cave-floor="' + floor.floor + '" style="padding:6px 0;border-bottom:1px solid var(--line)"><b>ชั้น ' + floor.floor + '</b> · ' + (floor.floor <= cv.maxDepth ? esc(floor.nameTh) : '<span class="muted">ยังไม่สำรวจ</span>') + '</div>').join('') + '</div>';
    h += '<h3>🔍 จุดสำรวจในสำนัก</h3>' + ['stele', 'spring', 'ruin', 'grove'].map(k => { const s = e.spots[k], sp = EXP.SPOTS[k]; return '<div class="card" data-bld="' + k + '"><b>' + sp.icon + ' ' + sp.nameTh + '</b> <span class="chip g">ระดับ ' + (s.lvl + 1) + '</span><div class="muted">' + sp.desc + '</div><div class="muted">สำรวจแล้ว ' + s.visits + ' ครั้ง' + (k === 'stele' ? ' · เศษจารึก ' + s.frag + '/6' : k === 'spring' ? ' · ปราณในตา ' + Math.round(s.charge) + '/' + s.max : k === 'ruin' ? ' · เงื่อนงำที่พบ ' + s.secrets : '') + '</div></div>'; }).join('');
    h += '<h3>★ ของวิเศษประจำสำนัก (' + e.relics.length + '/' + Object.keys(EXP.RELICS).length + ')</h3><div class="card">' + (e.relics.length ? e.relics.map(id => { const r = EXP.RELICS[id]; return '<div style="margin:4px 0"><b>' + esc(r.nameTh) + '</b> <span class="muted">— ' + esc(r.desc) + '</span></div>'; }).join('') : '<span class="muted">ยังไม่เคยได้ — พบได้จากผู้พิทักษ์ถ้ำและต่างโลกที่หายากมาก</span>') + '</div>';
    h += '<h3>📖 สมุดบันทึกแดนหมื่นพิภพ</h3><div class="muted" style="margin-bottom:6px">แต่ละโลกมี “กองของ” ที่สุ่มเจอ ไม่จำเป็นต้องเจอครบ ช่อง ??? คือสิ่งที่ยังไม่เคยพบ</div>';
    h += EXP.WORLDS.map(w => { const c = e.codex.worlds[w.id], seen = !!c; const got = w.loot.filter(l => e.codex.found[l.id]).length; return '<div class="card"><b>' + (seen ? w.icon + ' ' + esc(w.nameTh) : '❓ โลกที่ยังไม่เคยเห็น') + '</b> ' + (seen ? '<span class="chip">เข้าแล้ว ' + (c.visits || 0) + ' ครั้ง</span><span class="chip b">ของที่พบ ' + got + '/' + w.loot.length + '</span>' : '') + (seen ? '<div class="muted">' + esc(w.desc) + '</div><div>' + w.loot.map(l => e.codex.found[l.id] ? '<span class="chip ' + (l[5] >= 4 ? 'g' : l[5] >= 3 ? 'v' : 'ok') + '">' + esc(l[2]) + ' ×' + e.codex.found[l.id].n + '</span>' : '<span class="chip" style="opacity:.5">???</span>').join('') + '</div>' : '') + '</div>'; }).join('');
    h += '<h3>🕳️ ของที่พบในถ้ำ</h3><div class="card">' + EXP.CAVE_BANDS.map(b => '<div class="muted">' + esc(b.nameTh) + ' (ชั้น ' + b.from + '–' + b.to + ')</div><div>' + b.loot.map(l => e.codex.found[l.id] ? '<span class="chip ok">' + esc(l[2]) + ' ×' + e.codex.found[l.id].n + '</span>' : '<span class="chip" style="opacity:.5">???</span>').join('') + '</div>').join('') + '</div>';
    if (e.codex.notes.length) h += '<h3>บันทึกการค้นพบ</h3><div class="card">' + e.codex.notes.slice().reverse().slice(0, 20).map(n => '<div class="logrow"><span class="tm">' + dayStamp(n.d * 1440) + '</span>' + esc(n.text) + '</div>').join('') + '</div>';
    return h;
  };

  /* ----- Helper: Build Personal Bag Rows (Read-Only, Authoritative) ----- */
  const BROAD_CATS = [
    ["ALL", "ทั้งหมด"],
    ["PILL", "💊 โอสถ"],
    ["EQUIPMENT", "🗡️ อุปกรณ์"],
    ["MATERIAL", "🌿 วัตถุดิบ"],
    ["MANUAL", "📜 คัมภีร์/ผลึก"],
    ["OTHER", "🍚 เสบียง/อื่นๆ"]
  ];

  function pillEffectSummaryTh(pid) {
    const info = (ECO && ECO.pillInfo && ECO.pillInfo(pid)) || {};
    const e = info.effect || {};
    const parts = [];
    if (e.healHealth) parts.push("ฟื้นพลังชีวิต +" + e.healHealth + "%");
    if (e.healInjury) parts.push("สมานบาดแผล -" + e.healInjury + " ชม.");
    if (e.qiRestore) parts.push("ฟื้นปราณ +" + e.qiRestore);
    if (e.energyRestore) parts.push("ฟื้นเรี่ยวแรง +" + e.energyRestore);
    if (e.cultivationProgress) parts.push("ตบะ +" + e.cultivationProgress);
    if (e.rateBoost) parts.push("เร่งฝึก +" + Math.round(e.rateBoost * 100) + "%");
    if (e.breakthroughBonus) parts.push("ทะลวงขั้น +" + Math.round(e.breakthroughBonus * 100) + "%");
    if (e.clearToxic) parts.push("ถอนพิษโอสถ -" + e.clearToxic);
    if (e.clearHeartDemon) parts.push("สลายจิตมาร -" + e.clearHeartDemon);
    if (e.insight) parts.push("รู้แจ้ง ×" + e.insight);
    return parts.length ? parts.join(" · ") : "โอสถบำรุงร่างกายและลมปราณ";
  }

  function gearEffectSummaryTh(eq) {
    if (!eq) return "";
    const parts = [];
    if (eq.combatMult) parts.push("กำลังรบ +" + Math.round(eq.combatMult * 100) + "%");
    if (eq.defMult) parts.push("ป้องกัน +" + Math.round(eq.defMult * 100) + "%");
    if (eq.stats && typeof eq.stats === "object") {
      Object.entries(eq.stats).forEach(([k, v]) => {
        const inf = g.STATS && g.STATS.INFO && g.STATS.INFO[k];
        parts.push((inf ? inf.nameTh : k) + " +" + (Math.abs(v) < 1 ? Math.round(v * 100) + "%" : Math.round(v)));
      });
    }
    if (Array.isArray(eq.effects) && eq.effects.length) {
      eq.effects.forEach(ef => { if (ef.nameTh || ef.effectId) parts.push(ef.nameTh || ef.effectId); });
    }
    return parts.length ? parts.join(" · ") : "อุปกรณ์เสริมกำลังยุทธ์";
  }

  function buildPersonalBagItems(W, n) {
    const items = [];
    const inv = n.inv || {};
    // 1. Equipped Gear
    ["WEAPON", "ARMOR", "ACCESSORY"].forEach(slot => {
      const eq = n.equip && n.equip[slot];
      if (!eq) return;
      const qVal = (g.VC && g.VC.gearQuality) ? g.VC.gearQuality(eq) : (eq.q || eq.quality || 1);
      const isLeg = !!(eq.legendary || eq.tier >= 6 || /^LEG_/.test(eq.id || ""));
      const rarity = isLeg ? "Legendary" : (eq.tier >= 5 ? "Exceptional" : eq.tier >= 3 ? "Rare" : "Common");
      items.push({
        selKey: "EQ:" + slot + ":" + (eq.uid || eq.id),
        kind: "EQUIPPED",
        rawKind: "EQUIPMENT",
        broadCat: "EQUIPMENT",
        kindTh: "สวมใส่อยู่ (" + slot + ")",
        id: eq.uid || eq.id,
        templateId: eq.id,
        slot,
        eq,
        nameTh: eq.nameTh,
        tier: eq.tier || 1,
        rarity,
        legendary: isLeg,
        qualityPct: Math.round(qVal * 100),
        qty: 1,
        value: g.CPE && g.CPE.gearPrice ? g.CPE.gearPrice(W, eq) : (eq.tier || 1) * 25,
        spawned: !!eq.playerSpawned,
        descTh: gearEffectSummaryTh(eq),
        moreTh: "ช่องสวมใส่: " + slot + " · คุณภาพ: " + Math.round(qVal * 100) + "% · ขั้นขั้นต่ำ: " + (eq.minStage || 1) + (eq.literarySource ? " · ที่มา: " + eq.literarySource : ""),
        canUnequip: true
      });
    });
    // 2. Unequipped Personal Gear
    (inv.gear || []).forEach(eq => {
      if (!eq) return;
      const qVal = (g.VC && g.VC.gearQuality) ? g.VC.gearQuality(eq) : (eq.q || eq.quality || 1);
      const isLeg = !!(eq.legendary || eq.tier >= 6 || /^LEG_/.test(eq.id || ""));
      const rarity = isLeg ? "Legendary" : (eq.tier >= 5 ? "Exceptional" : eq.tier >= 3 ? "Rare" : "Common");
      items.push({
        selKey: "BAG_EQ:" + (eq.uid || eq.id),
        kind: "EQUIPMENT",
        rawKind: "EQUIPMENT",
        broadCat: "EQUIPMENT",
        kindTh: isLeg ? "ศาสตราตำนานในถุง" : "อุปกรณ์ในถุง",
        id: eq.uid || eq.id,
        templateId: eq.id,
        slot: eq.slot,
        eq,
        nameTh: eq.nameTh,
        tier: eq.tier || 1,
        rarity,
        legendary: isLeg,
        qualityPct: Math.round(qVal * 100),
        qty: 1,
        value: g.CPE && g.CPE.gearPrice ? g.CPE.gearPrice(W, eq) : (eq.tier || 1) * 25,
        spawned: !!eq.playerSpawned,
        descTh: "ช่อง " + (eq.slot || "-") + " · " + gearEffectSummaryTh(eq),
        moreTh: "คุณภาพ: " + Math.round(qVal * 100) + "% · ขั้นขั้นต่ำ: " + (eq.minStage || 1) + (eq.compatiblePath ? " · วิถี: " + eq.compatiblePath : "") + (eq.literarySource ? " · ที่มา: " + eq.literarySource : ""),
        canEquip: true,
        canDonate: true
      });
    });
    // 3. Personal Pills
    Object.entries(inv.pills || {}).forEach(([pid, qty]) => {
      if (!qty || qty <= 0) return;
      const info = ECO.pillInfo(pid) || {};
      const tier = info.tier || 1;
      const sp = (inv.spawnedPills && inv.spawnedPills[pid]) || 0;
      const qVal = (inv.pillQuality && inv.pillQuality[pid]) || 1;
      items.push({
        selKey: "PILL:" + pid,
        kind: "PILL",
        rawKind: "PILL",
        broadCat: "PILL",
        kindTh: "โอสถ",
        id: pid,
        templateId: pid,
        nameTh: ECO.name(pid),
        tier,
        rarity: tier >= 6 ? "Legendary" : tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common",
        qualityPct: Math.round(qVal * 100),
        qty,
        value: (g.CPE && g.CPE.priceOf) ? g.CPE.priceOf(W, pid) : tier * 12,
        spawned: sp > 0,
        descTh: pillEffectSummaryTh(pid),
        moreTh: "รหัสโอสถ: " + pid + " · ความบริสุทธิ์: " + Math.round(qVal * 100) + "% · แต้มรับบริจาคประมาณ " + (sp > 0 ? 0 : Math.round((g.CPE && g.CPE.reward ? g.CPE.reward(W, pid, 1) : tier * 5))) + " คป.",
        canUse: true,
        canDonate: true
      });
    });
    // 3b. Personal Crafted Pills (if any kept/pending in inv.craftedPills)
    (inv.craftedPills || []).forEach((cp, idx) => {
      if (!cp || !cp.qty || cp.qty <= 0) return;
      const info = ECO.pillInfo(cp.key) || {};
      const tier = info.tier || 1;
      items.push({
        selKey: "CPILL:" + (cp.id || idx),
        kind: "PILL",
        rawKind: "PILL",
        broadCat: "PILL",
        kindTh: "โอสถปรุงเอง",
        id: cp.key,
        craftedId: cp.id,
        templateId: cp.key,
        nameTh: ECO.name(cp.key) + " (ปรุงเอง)",
        tier,
        rarity: tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common",
        qualityPct: Math.round((cp.q || 1) * 100),
        qty: cp.qty,
        value: Math.round((g.CPE && g.CPE.reward ? g.CPE.reward(W, cp.key, 1) : tier * 10)),
        spawned: false,
        descTh: pillEffectSummaryTh(cp.key),
        moreTh: "ความตั้งใจ: " + (cp.intent === "donate" ? "รอบริจาคเข้าคลัง" : "เก็บไว้ใช้ส่วนตัว") + " · คุณภาพ " + Math.round((cp.q || 1) * 100) + "%",
        canUse: true,
        canDonate: true
      });
    });
    // 4. Personal Materials, Caught Fish, Cooked Fish Dishes, Mystery Containers & River Trash
    Object.entries(inv.mats || {}).forEach(([mid, qty]) => {
      if (!qty || qty <= 0) return;
      const m = ECO.matById[mid] || {};
      const tier = m.tier || 1;
      const sp = (inv.spawnedMats && inv.spawnedMats[mid]) || 0;
      const isContainer = mid === "ITEM_MYSTERY_RIVER_CONTAINER";
      const isTrash = mid === "TRASH_RIVER_DEBRIS";
      const isDish = !!(g.FISHING && g.FISHING.isFishDish && g.FISHING.isFishDish(mid));
      const isFish = !!(g.FISHING && g.FISHING.isFish && g.FISHING.isFish(mid));
      const qVal = (inv.matQuality && inv.matQuality[mid]) || null;
      const val = (isContainer || isTrash) ? 0 : ((g.CPE && g.CPE.reward) ? Math.round(g.CPE.reward(W, mid, 1)) : tier * 6);
      items.push({
        selKey: "MAT:" + mid,
        kind: isContainer ? "CONTAINER" : isTrash ? "TRASH" : isDish ? "FOOD" : "MATERIAL",
        rawKind: isContainer ? "CONTAINER" : isTrash ? "TRASH" : isDish ? "FOOD" : "MATERIAL",
        broadCat: (isContainer || isTrash || isDish) ? "OTHER" : "MATERIAL",
        kindTh: isContainer ? "หีบปริศนาใต้น้ำ" : isTrash ? "ขยะใต้น้ำไร้ค่า" : isDish ? "อาหารปราณ" : isFish ? "ปลาปราณ" : "วัตถุดิบ",
        id: mid,
        templateId: mid,
        nameTh: ECO.name(mid),
        tier,
        rarity: m.rarity || (tier >= 6 ? "Legendary" : tier >= 4 ? "Exceptional" : tier >= 3 ? "Rare" : "Common"),
        qualityPct: qVal ? Math.round(qVal * 100) : undefined,
        qty,
        value: val,
        spawned: sp > 0,
        descTh: m.descTh || "วัตถุดิบสำหรับหลอมโอสถและตีศาสตรา",
        moreTh: isContainer
          ? "โอกาสเปิดหีบ: เศษซากใต้น้ำ 50.0% · ของทั่วไปตามหมวดและขั้น 49.5% · สมบัติระดับตำนาน 0.5%"
          : isTrash
          ? "เศษไม้ผุและซากใต้น้ำไร้ค่า (0 ศิลา / 0 คป.) กดปุ่มทิ้งเพื่อทำความสะอาดถุงสัมภาระ"
          : ("รหัส: " + mid + " · ระดับ T" + tier + (isFish && m.habitats ? " · ถิ่นอาศัย: " + m.habitats.join(", ") : "") + " · บริจาคเข้าคลังได้ประมาณ " + (sp > 0 ? 0 : val) + " คป./หน่วย"),
        canOpenContainer: isContainer,
        canDiscardTrash: isTrash,
        canEatDish: isDish,
        canCookFish: isFish,
        canDonate: !isTrash
      });
    });
    // 5. Personal Crystals
    Object.entries(inv.crystals || {}).forEach(([cid, qty]) => {
      if (!qty || qty <= 0) return;
      const kInfo = (g.MARTIAL && g.MARTIAL.knowledge) ? g.MARTIAL.knowledge(cid) : null;
      const rawSub = cid.startsWith("S:") ? cid.slice(2) : cid;
      const subObj = CULT.subList.find(x => x.sub.id === rawSub);
      const tier = (kInfo && kInfo.tier) || 3;
      const sp = (inv.spawnedCrystals && inv.spawnedCrystals[cid]) || 0;
      items.push({
        selKey: "CRYS:" + cid,
        kind: "CRYSTAL",
        rawKind: "CRYSTAL",
        broadCat: "MANUAL",
        kindTh: "ผลึกความรู้",
        id: cid,
        templateId: rawSub,
        nameTh: (g.MARTIAL && g.MARTIAL.crystalName) ? g.MARTIAL.crystalName(cid) : ("ผลึก「" + (subObj ? subObj.sub.nameTh : cid) + "」"),
        tier,
        rarity: tier >= 6 ? "Legendary" : tier >= 4 ? "Exceptional" : "Rare",
        qty,
        value: (g.MARTIAL && g.MARTIAL.crystalPrice) ? g.MARTIAL.crystalPrice(W, cid) : tier * 35,
        spawned: sp > 0,
        descTh: "วิถี " + ((kInfo && kInfo.path) || (subObj ? subObj.path : "-")) + " · ใช้ซึมซับเปิดสายย่อยหรือวิชาโดยตรง",
        moreTh: "ใช้ได้ครั้งเดียวเมื่อผ่านเกณฑ์วิถีและขั้นตบะ · มูลค่าบริจาค ~" + (sp > 0 ? 0 : ((g.MARTIAL && g.MARTIAL.crystalReward) ? g.MARTIAL.crystalReward(W, cid) : 20)) + " คป.",
        canUse: true,
        canDonate: true
      });
    });
    // 6. Personal Technique Manuals & Subpath Manuals
    Array.from(new Set(inv.techs || [])).forEach(tid => {
      const t = CULT.tech(tid);
      if (!t) return;
      const sp = Array.isArray(inv.spawnedTechs) && inv.spawnedTechs.includes(tid);
      const isLeg = !!(t.legendary || t.grade === "Legendary" || /^LEG_/.test(tid));
      const tier = t.tier || t.reqTier || 1;
      items.push({
        selKey: "TECH:" + tid,
        kind: "TECH_MANUAL",
        rawKind: "TECH_MANUAL",
        broadCat: "MANUAL",
        kindTh: isLeg ? "คัมภีร์ระดับตำนาน" : "คัมภีร์วิชา",
        id: tid,
        templateId: tid,
        nameTh: "คัมภีร์「" + t.nameTh + "」",
        tier,
        rarity: isLeg ? "Legendary" : (tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common"),
        legendary: isLeg,
        qty: 1,
        value: (g.CPE && g.CPE.techPrice) ? g.CPE.techPrice(W, t) : tier * 40,
        spawned: sp,
        descTh: (t.descTh || "คัมภีร์ยุทธ์") + " · วิถี " + (t.path || "ANY") + " · ขั้นขั้นต่ำ " + (t.reqTier || tier),
        moreTh: "ระดับคุณภาพ: " + (t.grade || "Common") + (t.sub ? " · สายย่อย: " + t.sub : "") + " · บริจาคเข้าหอคัมภีร์สำนักเพื่อบันทึกเป็นมรดกถาวร",
        canUse: true,
        canDonate: true
      });
    });
    Array.from(new Set(inv.subManuals || [])).forEach(sid => {
      const subObj = CULT.subList.find(x => x.sub.id === sid);
      const sp = Array.isArray(inv.spawnedSubManuals) && inv.spawnedSubManuals.includes(sid);
      items.push({
        selKey: "SUBM:" + sid,
        kind: "SUB_MANUAL",
        rawKind: "SUB_MANUAL",
        broadCat: "MANUAL",
        kindTh: "คัมภีร์สายย่อย",
        id: sid,
        templateId: sid,
        nameTh: "คัมภีร์สายย่อย「" + (subObj ? subObj.sub.nameTh : sid) + "」",
        tier: 3,
        rarity: "Rare",
        qty: 1,
        value: 160,
        spawned: sp,
        descTh: "เปิดสายย่อย " + (subObj ? subObj.sub.nameTh : sid) + " (วิถี " + (subObj ? subObj.path : "-") + ")",
        moreTh: subObj && subObj.sub ? (subObj.sub.strengthTh || "") : "คัมภีร์ต้นฉบับสำหรับศึกษาสายย่อย",
        canUse: true,
        canDonate: true
      });
    });
    // 7. Personal Recipe Scrolls
    Array.from(new Set(inv.recipes || [])).forEach(rid => {
      const r = ECO.recipeById[rid];
      if (!r) return;
      const sp = Array.isArray(inv.spawnedRecipes) && inv.spawnedRecipes.includes(rid);
      const tier = r.tier || 1;
      items.push({
        selKey: "REC:" + rid,
        kind: "RECIPE_SCROLL",
        rawKind: "RECIPE_SCROLL",
        broadCat: "MANUAL",
        kindTh: "ม้วนตำรับ",
        id: rid,
        templateId: rid,
        nameTh: "ม้วนตำรับ" + r.nameTh,
        tier,
        rarity: tier >= 5 ? "Exceptional" : tier >= 3 ? "Rare" : "Common",
        qty: 1,
        value: tier * 35,
        spawned: sp,
        descTh: "ผลผลิต: " + (r.outNameTh || r.nameTh) + " · ศาสตร์ " + (r.craft || "ALCHEMY"),
        moreTh: "ความชำนาญขั้นต่ำ: " + (r.minMastery || 20) + " · ระดับอาคาร: " + (r.facilityLevel || 1),
        canUse: true,
        canDonate: true
      });
    });
    // 8. Personal Rare Beast Organs
    Object.entries(inv.organs || {}).forEach(([oid, qty]) => {
      if (!qty || qty <= 0) return;
      const o = g.CONTENT && g.CONTENT.organById && g.CONTENT.organById[oid];
      if (!o) return;
      const sp = (inv.spawnedOrgans && inv.spawnedOrgans[oid]) || 0;
      const tier = o.tier || 2;
      items.push({
        selKey: "ORG:" + oid,
        kind: "ORGAN",
        rawKind: "ORGAN",
        broadCat: "MATERIAL",
        kindTh: "อวัยวะอสูร",
        id: oid,
        templateId: oid,
        nameTh: o.nameTh,
        tier,
        rarity: tier >= 6 ? "Legendary" : tier >= 4 ? "Exceptional" : "Rare",
        qty,
        value: tier * 28,
        spawned: sp > 0,
        descTh: "ธาตุ " + (o.element || "-") + " · " + (o.usesTh || "ชิ้นส่วนอสูรกลายพันธุ์สำหรับวิจัยและหลอม"),
        moreTh: "คุณสมบัติ: " + ((o.propertyTags || []).join(", ") || "-") + " · ความยากชำแหละ " + (o.dissectionDifficulty || "-"),
        canUse: true,
        canDonate: true
      });
    });
    return items;
  }
  UI.buildPersonalBagItems = buildPersonalBagItems;

  function renderModeToggleBar(titleHtml) {
    const mode = UI.getInvViewMode();
    return "<div class=\"inv-head-bar\">" + titleHtml +
      "<div class=\"inv-mode-toggle\" role=\"group\" aria-label=\"รูปแบบการแสดงผลไอเทม\">" +
      "<button type=\"button\" class=\"" + (mode === "grid" ? "on" : "") + "\" data-do=\"set-inv-mode\" data-arg=\"grid\">⊞ ตารางไอคอน</button>" +
      "<button type=\"button\" class=\"" + (mode === "list" ? "on" : "") + "\" data-do=\"set-inv-mode\" data-arg=\"list\">☰ รายการ</button>" +
      "</div></div>";
  }

  function renderGridCellHtml(it, isSelected, selectAction) {
    const rCls = it.legendary || it.rarity === "Legendary" ? "r-Legendary" : it.rarity === "Exceptional" ? "r-Exceptional" : it.rarity === "Rare" ? "r-Rare" : "";
    const tlCls = it.legendary || it.rarity === "Legendary" ? "leg" : it.rarity === "Exceptional" ? "exc" : it.rarity === "Rare" ? "rar" : "";
    const sym = it.legendary || it.rarity === "Legendary" ? "★" : it.rarity === "Exceptional" ? "◆" : it.rarity === "Rare" ? "▲" : "";
    let trBadge = "";
    if (it.kind === "EQUIPPED") trBadge = "<span class=\"inv-b-tr\">สวม</span>";
    else if (it.locked) trBadge = "<span class=\"inv-b-tr warn\">🔒</span>";
    else if (it.isShortage) trBadge = "<span class=\"inv-b-tr warn\">ขาด</span>";
    else if (it.qualityPct && it.qualityPct !== 100) trBadge = "<span class=\"inv-b-tr qual\">" + it.qualityPct + "%</span>";
    else if (it.isSurplus) trBadge = "<span class=\"inv-b-tr\">+ล้น</span>";

    const blBadge = it.price != null ? "<span class=\"inv-b-bl\">" + it.price + "คป</span>" : (it.spawned ? "<span class=\"inv-b-bl\">เสก</span>" : "");
    const brBadge = "<span class=\"inv-b-br\">×" + (it.qty != null ? it.qty : 1) + "</span>";
    return "<button type=\"button\" class=\"inv-cell " + rCls + (isSelected ? " sel" : "") + (it.locked ? " is-locked" : "") + "\" data-do=\"" + selectAction + "\" data-arg=\"" + esc(it.selKey) + "\" title=\"" + esc(it.nameTh + " (T" + (it.tier || 1) + " ×" + (it.qty || 1) + ")") + "\">" +
      "<span class=\"inv-b-tl " + tlCls + "\">" + sym + "T" + (it.tier || 1) + "</span>" +
      trBadge +
      UI.renderAtlasIconHtml(it, 40) +
      blBadge +
      brBadge +
      "</button>";
  }

  function renderPersonalBagActionsHtml(n, it) {
    let btns = "";
    if (it.canUnequip) {
      btns += "<button type=\"button\" class=\"btn\" data-do=\"unequip-bag\" data-arg=\"" + n.id + "|" + it.slot + "\">ถอดเก็บ</button>";
      btns += "<button type=\"button\" class=\"btn\" data-do=\"unequip-sect\" data-arg=\"" + n.id + "|" + it.slot + "\">คืนคลัง</button>";
    }
    if (it.canEquip) {
      btns += "<button type=\"button\" class=\"btn pri\" data-do=\"equip-personal\" data-arg=\"" + n.id + "|" + it.id + "\">สวมใส่</button>";
    }
    if (it.canOpenContainer) {
      btns += "<button type=\"button\" class=\"btn pri\" data-do=\"open-bag-container\" data-arg=\"" + n.id + "\">🎁 เปิดหีบปริศนา</button>";
    }
    if (it.canEatDish) {
      btns += "<button type=\"button\" class=\"btn pri\" data-do=\"eat-bag-dish\" data-arg=\"" + n.id + "|" + it.id + "\">🍲 กินอาหารปราณ</button>";
    }
    if (it.canCookFish) {
      btns += "<button type=\"button\" class=\"btn pri\" data-do=\"cook-bag-fish\" data-arg=\"" + n.id + "|" + it.id + "\">🍳 ปรุงอาหารปลา</button>";
    }
    if (it.canDiscardTrash) {
      btns += "<button type=\"button\" class=\"btn dan\" data-do=\"discard-bag-trash\" data-arg=\"" + n.id + "\">🗑️ ทิ้งขยะ</button>";
    }
    if (it.canUse) {
      btns += "<button type=\"button\" class=\"btn pri\" data-do=\"use-personal\" data-arg=\"" + n.id + "|" + it.rawKind + "|" + it.id + "\">ใช้งาน</button>";
    }
    if (it.canDonate) {
      btns += "<button type=\"button\" class=\"btn\" data-do=\"donate-personal\" data-arg=\"" + n.id + "|" + (it.rawKind === "CONTAINER" || it.rawKind === "FOOD" ? "MATERIAL" : it.rawKind) + "|" + (it.craftedId || it.id) + "\">บริจาค</button>";
    }
    return btns;
  }

  function renderPersonalBagSection(W, n) {
    const mode = UI.getInvViewMode();
    let allItems = buildPersonalBagItems(W, n);
    let items = allItems.slice();
    const bq = (UI.bagSearch || "").trim().toLowerCase();
    if (bq) items = items.filter(it => it.nameTh.toLowerCase().includes(bq) || String(it.id).toLowerCase().includes(bq));

    if (mode === "grid") {
      const cat = UI.bagCat || "ALL";
      if (cat !== "ALL") items = items.filter(it => it.broadCat === cat);
    } else {
      if (UI.bagType && UI.bagType !== "ALL") items = items.filter(it => it.kind === UI.bagType || it.rawKind === UI.bagType);
    }

    if (UI.bagSort === "qty") items.sort((a, b) => b.qty - a.qty || b.tier - a.tier);
    else if (UI.bagSort === "value") items.sort((a, b) => (b.value || 0) - (a.value || 0) || b.tier - a.tier);
    else if (UI.bagSort === "name") items.sort((a, b) => a.nameTh.localeCompare(b.nameTh));
    else items.sort((a, b) => (a.kind === "EQUIPPED" ? -1 : 0) - (b.kind === "EQUIPPED" ? -1 : 0) || b.tier - a.tier || b.qty - a.qty);

    let h = renderModeToggleBar("<h3>🎒 ถุงสัมภาระและอุปกรณ์ส่วนตัว (" + items.length + " รายการ)</h3>");
    h += "<div class=\"card\">";

    if (mode === "grid") {
      // Category pills
      h += "<div class=\"inv-cat-bar\">";
      BROAD_CATS.forEach(([ck, cv]) => {
        const cnt = ck === "ALL" ? allItems.length : allItems.filter(x => x.broadCat === ck).length;
        h += "<button type=\"button\" class=\"" + ((UI.bagCat || "ALL") === ck ? "on" : "") + "\" data-do=\"bag-cat\" data-arg=\"" + ck + "\">" + cv + " (" + cnt + ")</button>";
      });
      h += "</div>";
      // Search & Sort row
      h += "<div class=\"inv-filter-row\">";
      h += "<input id=\"bagSearch\" type=\"search\" placeholder=\"ค้นหาชื่อหรือรหัสไอเทมในถุง…\" value=\"" + esc(UI.bagSearch || "") + "\">";
      h += "<select id=\"bagSort\">" + [["tier", "เรียง: สวมใส่/ระดับ"], ["qty", "เรียง: จำนวน"], ["value", "เรียง: มูลค่า"], ["name", "เรียง: ชื่อ"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.bagSort === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
      h += "</div>";

      const pgSpec = UI.calcGridPageSize();
      const totalPages = Math.max(1, Math.ceil(items.length / pgSpec.perPage));
      UI.bagPage = clamp(UI.bagPage || 1, 1, totalPages);
      const startIdx = (UI.bagPage - 1) * pgSpec.perPage;
      const pageItems = items.slice(startIdx, startIdx + pgSpec.perPage);

      if (UI.bagSelKey && !items.some(x => x.selKey === UI.bagSelKey)) {
        UI.bagSelKey = null;
      }
      const selItem = UI.bagSelKey ? items.find(x => x.selKey === UI.bagSelKey) : null;

      h += "<div class=\"inv-grid-wrap\">";
      if (!pageItems.length) {
        h += "<div class=\"muted\" style=\"padding:10px 4px;text-align:center\">ไม่พบไอเทมในถุงที่ตรงกับหมวดหรือคำค้นหา</div>";
      } else {
        h += "<div class=\"inv-grid\">" + pageItems.map(it => renderGridCellHtml(it, selItem && selItem.selKey === it.selKey, "bag-sel")).join("") + "</div>";
      }
      h += "<div class=\"inv-page-bar\">" +
        "<button type=\"button\" data-do=\"bag-page\" data-arg=\"-1\"" + (UI.bagPage <= 1 ? " disabled" : "") + ">◀ ก่อนหน้า</button>" +
        "<span>หน้า <b>" + UI.bagPage + "</b> / " + totalPages + " <span class=\"muted\">(" + items.length + " ชิ้น)</span></span>" +
        "<button type=\"button\" data-do=\"bag-page\" data-arg=\"+1\"" + (UI.bagPage >= totalPages ? " disabled" : "") + ">ถัดไป ▶</button>" +
        "</div>";

      if (selItem) {
        const rLabel = selItem.legendary || selItem.rarity === "Legendary" ? "★ ตำนาน" : selItem.rarity === "Exceptional" ? "◆ ล้ำเลิศ" : selItem.rarity === "Rare" ? "▲ หายาก" : "ทั่วไป";
        h += "<div class=\"inv-detail-panel\" data-detail-for=\"" + esc(selItem.selKey) + "\">" +
          "<div class=\"inv-detail-top\">" +
          UI.renderAtlasIconHtml(selItem, 44) +
          "<div class=\"inv-detail-meta\">" +
          "<div class=\"inv-detail-title\">" + esc(selItem.nameTh) + "</div>" +
          "<div class=\"inv-detail-sub\"><span class=\"chip " + (selItem.kind === "EQUIPPED" ? "g" : "b") + "\">" + esc(selItem.kindTh) + " · T" + selItem.tier + "</span>" +
          "<span class=\"chip\">" + rLabel + "</span>" +
          "<span>จำนวน <b>×" + selItem.qty + "</b></span>" +
          (selItem.qualityPct ? "<span>· คุณภาพ <b>" + selItem.qualityPct + "%</b></span>" : "") +
          (selItem.spawned ? "<span class=\"chip v\">ไอเทมเสก (0 คป.)</span>" : "") +
          "</div></div>" +
          "<button type=\"button\" class=\"inv-detail-close\" data-do=\"bag-close-detail\" title=\"ปิดแผงรายละเอียด\">✕ ปิด</button>" +
          "</div>" +
          "<div class=\"inv-detail-eff\">✨ <b>ผลลัพธ์/สรรพคุณ:</b> " + esc(selItem.descTh || "-") + "</div>" +
          "<div class=\"inv-detail-actions\">" +
          renderPersonalBagActionsHtml(n, selItem) +
          "<button type=\"button\" class=\"btn\" data-do=\"bag-toggle-more\">" + (UI.bagMoreOpen ? "▲ ซ่อนรายละเอียด" : "▼ รายละเอียดเพิ่มเติม") + "</button>" +
          "</div>" +
          (UI.bagMoreOpen ? "<div class=\"inv-detail-more\">" + esc(selItem.moreTh || "ไม่มีข้อมูลเพิ่มเติม") + " · มูลค่าประเมิน ~" + (selItem.value || 0) + " คป.</div>" : "") +
          "</div>";
      }
      h += "</div>";
    } else {
      // Classic List View
      h += "<div class=\"edit-grid\" style=\"margin-bottom:8px\">";
      h += "<input id=\"bagSearch\" type=\"search\" placeholder=\"ค้นหาไอเทมในถุง…\" value=\"" + esc(UI.bagSearch || "") + "\">";
      h += "<select id=\"bagType\">" + [["ALL", "ทุกประเภท"], ["EQUIPPED", "สวมใส่อยู่"], ["EQUIPMENT", "อุปกรณ์ในถุง"], ["PILL", "โอสถ"], ["MATERIAL", "วัตถุดิบ"], ["CRYSTAL", "ผลึกสายย่อย"], ["TECH_MANUAL", "คัมภีร์วิชา"], ["SUB_MANUAL", "คัมภีร์สายย่อย"], ["RECIPE_SCROLL", "ม้วนตำรับ"], ["ORGAN", "อวัยวะอสูร"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.bagType === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
      h += "<select id=\"bagSort\">" + [["tier", "เรียงตามระดับ/สวมใส่"], ["qty", "เรียงตามจำนวน"], ["value", "เรียงตามมูลค่า"], ["name", "เรียงตามชื่อ"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.bagSort === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select>";
      h += "</div>";

      if (!items.length) {
        h += "<div class=\"muted\">ยังไม่มีไอเทมในถุงส่วนตัวที่ตรงกับเงื่อนไข (สามารถกดปุ่ม ✨ เสกของเข้าถุง เพื่อเพิ่มไอเทมได้)</div>";
      } else {
        h += items.map(it => {
          const btns = renderPersonalBagActionsHtml(n, it);
          return "<div class=\"logrow\" style=\"align-items:center\"><div><span class=\"chip " + (it.kind === "EQUIPPED" ? "g" : "b") + "\">" + esc(it.kindTh) + " T" + it.tier + "</span> <b>" + esc(it.nameTh) + "</b> ×" + it.qty + (it.spawned ? " <span class=\"chip v\">ไอเทมเสก (0 คป.)</span>" : "") + "<div class=\"muted\" style=\"font-size:11px\">" + esc(it.descTh || "") + "</div></div><div style=\"display:flex;gap:4px;flex-wrap:wrap\">" + btns + "</div></div>";
        }).join("");
      }
    }
    h += "</div>";
    return h;
  }

  /* ----- ตัวละคร ----- */
  UI.rNpc = () => {
    const W = UI.G.W, n = W.byId[UI.npcId]; if (!n) return '<div class="muted">ไม่พบตัวละคร</div>'; const tab = UI.tab, s = n.h.state; let h = '';
    const idn = HC.identity(n);
    if (tab === 'ov') {
      h += '<div class="prow">' + portraitHtml(n, 64) + '<div class="pi"><div class="nm" style="font-size:15px">' + esc(HC.fullName(n)) + '</div><div class="sub">' + (n.h.sex === 'M' ? 'ชาย' : 'หญิง') + ' · ' + HC.ageText(n) + ' · ' + esc(n.h.origin.cls) + ' จาก' + esc(n.h.origin.region) + '</div><div class="sub">' + esc(idn.title) + '</div></div></div>';
      h += '<div>' + idn.tags.map(t => '<span class="chip v">' + esc(t) + '</span>').join('') + '<span class="chip">' + esc(idn.archetypeTh) + '</span><span class="chip b">ปัญญา: ' + esc(idn.smart) + '</span></div>';
      h += '<div style="margin:8px 0;display:flex;gap:6px;flex-wrap:wrap"><button class="btn pri" data-do="follow" data-arg="' + n.id + '">🎯 ติดตาม</button><button class="btn" data-do="locate" data-arg="' + n.id + '">📍 ดูบนแผนที่</button><button class="btn" data-do="editnpc" data-arg="' + n.id + '">✏️ แก้ไขตัวละครนี้</button><button class="btn" data-do="spawnnpc" data-arg="' + n.id + '">✨ เสกของเข้าถุง</button></div>';
      h += '<div class="muted">🏅 แต้มคุณูปการ <b>' + Math.round(n.cp || 0) + '</b> · สะสมตลอดชีพ ' + Math.round(n.cpEarned || 0) + '</div>';
      h += '<h3>กำลังทำอะไร</h3><div class="card"><div style="font-size:15px;font-weight:600">' + esc(actText(n)) + '</div>';
      if (n.why && n.why.length && !n.dead) h += '<div class="muted" style="margin-top:4px">เพราะ:</div><ul class="why" style="margin:2px 0 0 16px;padding:0">' + n.why.map(w => '<li>' + esc(w[0]) + ' <span class="muted">(' + (w[1] > 0 ? '+' : '') + w[1] + ')</span></li>').join('') + '</ul>';
      if (n.lastScores) h += '<div class="muted" style="margin-top:6px">ตัวเลือกที่ชั่งใจ: ' + n.lastScores.slice(0, 5).map(x => (AI.ACTS[x.id] ? AI.ACTS[x.id].nameTh : x.id === 'pair' ? 'พบปะ' : x.id) + ' ' + x.u).join(' · ') + '</div>';
      h += '</div>';
      if (g.COG) {
        const mind = g.COG.explain(W, n);
        h += '<h3>หน้าที่และความตั้งใจ</h3><div class="card"><b>' + esc(mind.role) + '</b>' + (mind.delegated ? ' <span class="chip g">รักษาการแทน</span>' : mind.acting ? ' <span class="chip">ผู้ช่วยงาน</span>' : '') + '<div class="muted">' + esc(mind.responsibility) + '</div>';
        if (!n.dead && mind.aspiration) {
          h += '<div style="margin-top:6px">🌟 <b>ปณิธานระยะยาว:</b> ' + esc(mind.aspiration.title) + (mind.aspiration.progress > 0 ? ' <span class="chip ok">สำเร็จ ' + mind.aspiration.progress + ' ขั้น</span>' : '') + '<div class="muted" style="font-size:11.5px">' + esc(mind.aspiration.descTh || '') + (mind.aspiration.reasonTh ? ' (' + esc(mind.aspiration.reasonTh) + ')' : '') + '</div></div>';
        }
        h += '<div style="margin-top:6px">🎯 <b>เป้าหมายปัจจุบัน:</b> ' + esc(n.dead ? 'สิ้นสุดการตัดสินใจแล้ว' : mind.goal?.title || 'ยังไม่มีเป้าหมายระยะกลาง เลือกตามความต้องการและความชอบ') + '</div>';
        if (!n.dead && mind.goal?.stepTitle && mind.goal.stepTitle !== mind.goal.title) {
          h += '<div class="muted" style="font-size:11.5px">↳ ขั้นตอนย่อย: ' + esc(mind.goal.stepTitle) + '</div>';
        }
        if (!n.dead && mind.goal?.blocked) h += '<div class="muted" style="color:var(--gold)">⚠ เงื่อนไขที่ติดขัด: ' + esc(mind.goal.blocked) + '</div>';
        if (!n.dead && mind.suspendedGoal) h += '<div class="muted" style="font-size:11.5px">⏸ แผนที่พักไว้ชั่วคราว: ' + esc(mind.suspendedGoal.title) + ' (' + esc(mind.suspendedGoal.reason) + ')</div>';
        if (!n.dead && mind.commitment) {
          const partner = W.byId[mind.commitment.partnerId];
          h += '<div class="muted" style="font-size:11.5px">🤝 พันธะสัญญา: นัดหมายกับ ' + esc(partner ? partner.h.name.given : mind.commitment.partnerId) + '</div>';
        }
        if (!n.dead && mind.estimates && mind.estimates.length) {
          h += '<div class="muted" style="margin-top:4px;font-size:11.5px">📐 <b>การคาดการณ์ของเจ้าตัว:</b> ' + mind.estimates.map(esc).join(' · ') + '</div>';
        }
        if (!n.dead && mind.deferenceToMaster) {
          h += '<div class="muted" style="margin-top:4px;font-size:11.5px">🙇 <b>ท่าทีต่อผู้นำสำนัก:</b> ' + esc(mind.deferenceToMaster.summaryTh) + '</div>';
        }
        if (mind.officeDecision) h += '<div class="muted" style="margin-top:6px">พิจารณางานล่าสุด: ' + esc(mind.officeDecision.action) + ' · ' + dayStamp(mind.officeDecision.at) + '</div>';
        h += '</div>';
      }
      h += '<h3>สถานะ</h3><div class="card">' + bar('พลังชีวิต', s.hp, { max: CULT.hpMax(n), txt: Math.round(s.hp) + '/' + CULT.hpMax(n), wide: true, color: '#e0584a' }) + (n.cult ? bar('ปราณ', s.qi, { max: CULT.qiMax(n), txt: Math.round(s.qi), wide: true, color: '#4fb2f2' }) : '') + bar('อิ่ม', s.satiety, { wide: true }) + bar('พักผ่อน', s.rest, { wide: true }) + bar('แรง', s.energy, { wide: true }) + bar('อารมณ์', clamp(s.mood + 50, 0, 100), { txt: Math.round(s.mood), wide: true }) + bar('เครียด', s.stress, { wide: true, color: s.stress > 60 ? '#e0584a' : '#9aa' }) + bar('สังคม', s.social, { wide: true }) + bar('ความเหงา', s.loneliness, { wide: true, color: '#b58cf0' }) + (s.heartDemon > 1 ? bar('จิตมาร', s.heartDemon, { wide: true, color: '#c33' }) : '') + '</div>';
      if (n.inj && n.inj.length) h += '<div class="card" style="border-color:var(--red)">🩹 ' + n.inj.map(i => esc(i.part) + ' (' + esc(i.why) + ')').join(' · ') + '</div>';
      {
        const ex = g.STATS.explain(n), INFO = g.STATS.INFO; const fmt = (k, v) => k === 'crit' || k === 'pen' ? v.toFixed(1) + '%' : k === 'critDmg' ? Math.round(v) + '%' : Math.round(v);
        h += '<h3>⚔ สเตตัสต่อสู้ <span class="muted" style="font-weight:400">(แตะแต่ละค่าดูที่มา)</span></h3><div class="card">' + g.STATS.KEYS.map(k => {
          const inf = INFO[k], parts = ex.parts[k] || [];
          return '<details style="border-bottom:1px solid var(--line,#3a3f4a);padding:3px 0"><summary style="cursor:pointer;display:flex;justify-content:space-between"><span>' + inf.icon + ' ' + inf.nameTh + '</span><b>' + fmt(k, ex.v[k]) + '</b></summary><div class="muted" style="font-size:12px;padding:2px 0 4px 6px">' + esc(inf.desc) + '<br>' + parts.map(q => '• ' + esc(q[0]) + ' : ' + (q[1] === 'b' ? 'ฐาน ' + Math.round(q[2]) : q[1] === 'p' ? (q[2] >= 0 ? '+' : '') + Math.round(q[2] * 1000) / 10 + '%' : (q[2] >= 0 ? '+' : '') + Math.round(q[2] * 10) / 10)).join('<br>') + '</div></details>';
        }).join('');
        const bf = (n.buffs || []).filter(b => b.until > W.t), sx = (n.sx || []).filter(x => x.until > W.t);
        const fb = (g.FISHING && g.FISHING.activeFoodBuff) ? g.FISHING.activeFoodBuff(W, n) : null;
        if (bf.length) h += '<div style="margin-top:6px">💊 ' + bf.map(b => '<span class="chip b">' + esc(b.name) + ' (' + Math.max(0, Math.round(b.until - W.t)) + ' นาที)</span>').join('') + '</div>';
        if (fb) h += '<div style="margin-top:6px">🍲 <span class="chip ok">' + esc(fb.nameTh) + ' (' + Math.max(0, Math.round(fb.until - W.t)) + ' นาที)</span> <span class="muted" style="font-size:11.5px">' + esc(fb.descTh || '') + '</span></div>';
        if (sx.length) h += '<div style="margin-top:6px">' + sx.map(x => { const S = g.SK.STATUS[x.k]; return S ? '<span class="chip">' + S.icon + ' ' + esc(S.nameTh) + '</span>' : ''; }).join('') + '</div>';
        h += '</div>';
        const sl = g.SK.list(n);
        if (sl.length) {
          h += '<h3>วิชาต่อสู้และกระบวนท่าที่ใช้ได้ (' + sl.length + ')</h3><div class="card">' + sl.map(p => {
            const parent = CULT.tech(p.tech || p.id);
            const curStage = (g.SK.unlockedStage && parent) ? g.SK.unlockedStage(n, parent) : 1;
            const maxStage = (parent && Array.isArray(parent.stages) && parent.stages.length) ? parent.stages.length : 1;
            const mastery = (g.SK.masteryPoints && parent) ? g.SK.masteryPoints(n, parent.id) : 0;
            const allM = (g.SK.allMoves && parent && Array.isArray(parent.moveDefs) && parent.moveDefs.length > 1) ? g.SK.allMoves(parent) : [];
            const lockedM = allM.filter(mv => !g.SK.canSelectMove(n, parent, mv.id));
            return '<div style="padding:4px 0;border-bottom:1px solid var(--line,#3a3f4a)"><b>' + esc(p.nameTh) + '</b> ' + gradeChip(parent || p) + ' <span class="muted">(ความชำนาญ ' + mastery + ' · ขั้นวิชา ' + curStage + '/' + maxStage + ')</span><div class="muted" style="font-size:12px">' + esc(p.summary) + '</div>' + (lockedM.length ? '<div class="muted" style="font-size:11px;color:#e8c43a">🔒 กระบวนท่าที่ยังไม่ปลดล็อก: ' + lockedM.map(lm => esc(lm.nameTh) + ' (ขั้นวิชา ' + (lm.stageReq || 1) + '/ชำนาญ ' + (lm.reqMastery || 0) + ')').join(' · ') + '</div>' : '') + '</div>';
          }).join('') + '</div>';
        }
      }
      h += '<h3>ตบะและพลังรบ</h3><div class="card">';
      const wr = CULT.worldRank ? CULT.worldRank(n) : 0;
      h += '<div><span class="chip b">🌐 แรงค์ยุทธภพสากล: Rank ' + wr + (wr === 0 ? ' (ปุถุชน)' : '') + '</span></div>';
      if (g.ELEM) g.ELEM.ensureNpc(n);
      {
        const rt = n.h.root || {};
        const rootsArr = Array.isArray(rt.roots) ? rt.roots : [];
        const rootChips = rootsArr.map(r => {
          const em = (g.ELEM && g.ELEM.META && g.ELEM.META[r.element]) || { icon: "✦", shortTh: r.element };
          const gf = (g.ELEM && g.ELEM.GRADE_FACTORS && g.ELEM.GRADE_FACTORS[r.grade]) || { shortTh: r.grade };
          return "<span class=\"chip " + (r.grade === "HEAVENLY" ? "g" : r.grade === "TRUE" ? "b" : r.grade === "SPIRIT" ? "ok" : "") + "\">" + em.icon + " " + esc(em.shortTh) + " (" + esc(gf.shortTh) + ")</span>";
        }).join(" ");
        h += "<div style=\"margin-top:6px;padding:6px 8px;border-radius:6px;background:rgba(255,255,255,0.03)\"><div><b>รากวิญญาณกำเนิด (" + (rt.rootCount || 1) + " ราก):</b> " + rootChips + "</div><div class=\"muted\" style=\"font-size:11.5px;margin-top:2px\">ระดับความหายาก: <b style=\"color:var(--gold)\">" + esc(rt.rarityTitleTh || "รากวิญญาณสามัญ") + "</b> · เกรดรวม: <b>" + esc(rt.grade || "MORTAL") + "</b></div></div>";
      }
      if (n.cult) {
        const c = n.cult, pth = CULT.PATHS[c.path]; const sub = CULT.subInfo(c.path, c.sub); h += '<div style="margin-top:4px"><b>' + esc(CULT.stageName(n)) + '</b> · สาย' + esc(sub ? sub.nameTh : c.sub) + '</div>' + bar('ความก้าวหน้า', c.prog / CULT.threshold(n) * 100, { wide: true, txt: Math.round(c.prog) + '/' + CULT.threshold(n), color: pth.color }) + '<div class="muted">พลังรบ ' + Math.round(CULT.power(n)) + ' · อัตราบ่มเพาะ ' + (CULT.rate(n) || 0).toFixed(2) + '/ชม. · อายุขัย ~' + (n.lifespanMax || CULT.lifespan(n)) + ' ปี · รากวิญญาณรวม ' + esc(n.h.root.grade) + '</div>';
        if (c.track) {
          const tr = c.track; const trR = CULT.trackRealm(n); const trTh = CULT.trackThreshold(n); const trGate = CULT.checkTrackGates(W, n);
          h += '<div class="card" style="margin-top:6px;background:rgba(255,255,255,0.03)"><b>🌿 ขั้นสายเฉพาะทาง: ' + esc(trR ? trR.nameTh : '') + ' (ลำดับ ' + tr.ordinal + '/9)</b>' + (trTh !== Infinity ? bar('ความก้าวหน้าสายเฉพาะ', tr.prog / trTh * 100, { wide: true, txt: Math.round(tr.prog) + '/' + trTh, color: '#7fd1b9' }) : '') + '<div class="muted">เทียบเคียงขั้นหลัก: <b>' + (trR ? trR.majorBandEquivalent.toFixed(1) : '') + '</b> · พลังรบเฉพาะทางเทียบเคียง: <b>' + (trR ? trR.functionalCombatPower : '') + ' CP</b></div><div style="font-size:12px;margin-top:2px">' + (tr.ordinal >= 9 ? '<span class="chip ok">บรรลุขั้น 9 สูงสุดแล้ว</span>' : trGate.ok ? '<span class="chip ok">✔ ผ่านเกณฑ์ทักษะและศิลา พร้อมทะลวงขั้นถัดไป</span>' : '<span class="chip r">🔒 ' + esc(trGate.reason) + '</span>') + '</div></div>';
        }
        if (c.bn || c.found || c.failN) { const tr = g.BN.treasureOf(c); h += '<div class="card" style="margin-top:6px"><b>🚧 คอขวด</b>' + (c.bn ? ' · แผน: <b>' + (c.bn.plan === 'go' ? 'ลุยทะลวง' : 'รอเตรียมตัว') + '</b> (' + esc(c.bn.why || '') + ')' : '') + '<div class="muted">ฐานตกผลึก +' + Math.round((c.found || 0) * 100) + '% · ประสบการณ์ล้มเหลว +' + Math.round((c.failExp || 0) * 100) + '% (ล้ม ' + (c.failN || 0) + ' ครั้ง)' + (c.toxic > 5 ? ' · พิษโอสถ ' + Math.round(c.toxic) : '') + '</div>' + (tr ? '<div class="muted">ด่านใหญ่ต้องใช้ ✦' + esc(tr.nameTh) + ' — ' + (c.treasure === tr.id ? 'มีแล้ว (+16%)' : 'ยังไม่มี (−30%)') + '</div>' : '') + '<div class="muted">โอสถเฉพาะขั้น: ' + esc(ECO.name(g.BN.pillKey(c))) + (g.BN.heldPill(n) ? ' (ถืออยู่)' : '') + '</div></div>'; }
        if (c.mantra) { const mt = CULT.tech(c.mantra); h += '<div class="muted">คัมภีร์หลัก: ' + esc((mt || {}).nameTh || '') + ' ' + gradeChip(mt) + '</div>'; }
        if (c.techs.length) h += '<div style="margin-top:4px">' + c.techs.map(id => { const t2 = CULT.tech(id); return '<span class="chip b">' + esc((t2 || {}).nameTh || id) + (t2 && t2.grade ? ' (' + esc((JD.MARTIAL?.GRADES?.[t2.grade]?.nameTh) || t2.grade) + ')' : '') + '</span>'; }).join('') + '</div>';
        if (c.learning) h += '<div class="muted">กำลังศึกษา: ' + esc((CULT.tech(c.learning.id) || {}).nameTh) + ' ' + Math.round(c.learning.got / c.learning.need * 100) + '%</div>';
      } else h += '<div class="muted">ยังเป็นปุถุชน ยังไม่ตื่นรู้ปราณ · พลังรบ ' + Math.round(CULT.power(n)) + '</div>';
      const eq = Object.keys(n.equip || {}).filter(k => n.equip[k]); if (eq.length) h += '<div style="margin-top:4px">' + eq.map(k => '<span class="chip g">' + esc(n.equip[k].nameTh) + ' · ' + esc(g.MARTIAL.TYPES[g.MARTIAL.gearType(n.equip[k])]) + '</span>').join('') + '</div>';
      h += '</div>';
      h += UI.martialNpc(W, n) + UI.martialRetraining(W, n);
      h += '<h3>ในสำนัก</h3><div class="card"><div class="grid2"><div>ระดับ: <b>' + SECT.title(n) + '</b></div><div>เข้าสำนัก: ' + Math.max(0, Math.round(W.day - n.joinDay)) + ' วันก่อน</div><div>ผลงานสะสม: ' + Math.round(n.merit) + '</div><div>พอใจสำนัก: ' + Math.round(n.sat == null ? 60 : n.sat) + '</div><div>ศิลาส่วนตัว: ' + Math.round(n.inv.stones) + '</div><div>โชค: ' + Math.round(n.h.destiny.luck) + '</div></div>' + (n.mentor && W.byId[n.mentor] ? '<div>อาจารย์: ' + nameLink(W.byId[n.mentor]) + '</div>' : '') + (n.h.life.family.spouse && W.byId[n.h.life.family.spouse] ? '<div>คู่ครอง: ' + nameLink(W.byId[n.h.life.family.spouse]) + '</div>' : '') + ((n.h.life.family.disciples || []).length ? '<div>ศิษย์: ' + n.h.life.family.disciples.map(i => W.byId[i]).filter(Boolean).map(nameLink).join('、') + '</div>' : '') + (n.stats && (n.stats.kills || n.stats.sparWin) ? '<div class="muted">สถิติ: สังหาร ' + (n.stats.kills || 0) + ' · ประลองชนะ ' + (n.stats.sparWin || 0) + ' แพ้ ' + (n.stats.sparLoss || 0) + '</div>' : '') + '</div>';
      h += renderPersonalBagSection(W, n);
      const authRecipes = Array.from(new Set(n.recipes || [])).map(id => ECO.recipeById[id]).filter(Boolean);
      if (authRecipes.length) h += '<h3>📖 ตำรับที่ได้รับสิทธิ์ศึกษา</h3><div class="card">' + authRecipes.map(r => '<span class="chip ok">' + esc(r.nameTh) + ' (' + esc(r.outNameTh) + ')</span>').join('') + '</div>';
      h += '<h3>รูปลักษณ์</h3><div class="card muted">' + esc(HC.appearanceText(n)) + '</div>';
    } else if (tab === 'self') {
      h += '<div class="muted">แถบสีขาว = ค่ากำเนิด · แถบสี = ค่าปัจจุบัน (รวมผลฝึก/อายุ/นิสัยพิเศษ)</div><h3>คุณค่าชีวิต 8 (และความอิ่มเอมของแต่ละข้อ)</h3><div class="card">' + HC.layerIds('values').map(id => bar(AI.VALUE_TH[id] || HC.nameOf('values.' + id), HC.eff(n, 'values.' + id), { wide: true, mark: n.h.fulfil[id], tip: HC.nameOf('values.' + id) })).join('') + '<div class="muted">ขีดขาว = ความอิ่มเอมตอนนี้ (ต่ำ → อยากทำสิ่งนั้น)</div></div>';
      h += '<h3>บุคลิกภาพ 14</h3><div class="card">' + statLayer(n, 'personality') + '</div><h3>อารมณ์พื้นฐาน</h3><div class="card">' + statLayer(n, 'temperament') + '</div>';
      const ints = HC.layerIds('interests').map(id => [id, HC.eff(n, 'interests.' + id)]).sort((a, b) => b[1] - a[1]); h += '<h3>สิ่งที่ชอบ (เรียงจากมากสุด)</h3><div class="card">' + ints.slice(0, 12).map(i => bar(HC.nameOf('interests.' + i[0]), i[1], { wide: true })).join('') + '</div>';
      h += '<h3>พรสวรรค์ 6</h3><div class="card">' + statLayer(n, 'aptitudes') + '</div>';
      h += '<h3>จุดเด่น/ข้อจำกัด</h3><div class="card">' + ((n.h.traits || []).length ? n.h.traits.map(t => { const d = HC.traitDef(t.id); return d ? '<div><span class="chip ' + (d.isCurse ? 'r' : 'g') + '">' + esc(d.nameTh) + '</span><span class="muted">' + esc(d.descTh || '') + '</span></div>' : ''; }).join('') : '<span class="muted">ไม่มีลักษณะพิเศษ</span>') + '<div class="muted" style="margin-top:6px">รสนิยม: ชอบ' + esc(n.h.tastes.food) + ' · ' + esc(n.h.tastes.drink) + ' · สี' + esc(n.h.tastes.color) + ' · ' + esc(n.h.tastes.pastime) + ' · การผูกพัน: ' + esc(n.h.attachment) + '</div></div>';
    } else if (tab === "elem") {
      if (g.ELEM) g.ELEM.ensureNpc(n);
      const rt = n.h.root || {};
      const sys = (n.ext && n.ext.elementalSystem) || { mastery: {}, specialMastery: {}, specialAccess: {}, dailyGainLog: { byElement: {} } };
      const capTraitDef = (rt.rootCapacityTrait && HC.traitDef(rt.rootCapacityTrait)) || { nameTh: "เอกรากวิญญาณ (1 ราก)", descTh: "ผู้ถือครองรากวิญญาณสายเดียว" };
      h += "<h3>1. รากวิญญาณกำเนิดและระดับความหายาก</h3><div class=\"card\">";
      h += "<div style=\"display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px\"><div><b>" + esc(capTraitDef.nameTh) + "</b> <span class=\"chip g\">" + (rt.rootCount || 1) + " รากวิญญาณ</span></div><div><span class=\"chip b\">" + esc(rt.rarityBand || "COMMON") + " · " + esc(rt.rarityTitleTh || "") + "</span></div></div>";
      h += "<div class=\"muted\" style=\"margin-top:4px\">เกรดรากวิญญาณรวม (Conservative Aggregate): <b>" + esc(rt.grade || "MORTAL") + "</b> (คะแนนรวม " + (rt.aggregateScore || 2).toFixed(2) + ") · โอกาสพบตามธรรมชาติ ~1 ใน " + (rt.expectedCharacters || rt.expectedBirths || 3) + " ตัวละครที่ถูกสร้าง (" + (rt.expectedWorldYears || 0.1) + " ปีโลก)</div>";
      h += "<div style=\"margin-top:8px;display:grid;gap:6px\">";
      (rt.roots || []).forEach((r, idx) => {
        const em = (g.ELEM && g.ELEM.META[r.element]) || { icon: "✦", nameTh: r.element, color: "#6ddfb5", descTh: "" };
        const gf = (g.ELEM && g.ELEM.GRADE_FACTORS[r.grade]) || { nameTh: r.grade, combat: 1, cult: 1, study: 1 };
        const affVal = Math.round(HC.eff(n, "affinities." + r.element));
        h += "<div style=\"padding:6px 8px;border:1px solid var(--line,#3a3f4a);border-radius:6px\"><div style=\"display:flex;justify-content:space-between;align-items:center\"><span><b>รากที่ " + (idx + 1) + (idx === 0 ? " (รากหลัก)" : " (รากรอง)") + ":</b> " + em.icon + " <b>" + esc(em.nameTh) + "</b></span><span class=\"chip " + (r.grade === "HEAVENLY" ? "g" : r.grade === "TRUE" ? "b" : r.grade === "SPIRIT" ? "ok" : "") + "\">" + esc(gf.nameTh) + " (" + esc(r.grade) + ")</span></div><div class=\"muted\" style=\"font-size:11.5px;margin-top:2px\">ตัวคูณราก: ยุทธ์ ×" + gf.combat.toFixed(2) + " · บำเพ็ญ ×" + gf.cult.toFixed(2) + " · ศึกษา ×" + gf.study.toFixed(2) + " · ความถนัดธาตุกำเนิด " + affVal + "/100</div></div>";
      });
      h += "</div></div>";

      h += "<h3>2. ความเข้าใจธาตุจากการปฏิบัติจริง (Trainable Elemental Mastery)</h3><div class=\"card\"><div class=\"muted\" style=\"margin-bottom:6px\">เพิ่มขึ้นเฉพาะเมื่อลงมือฝึกวิชา โคจรปราณ ศึกษาคัมภีร์ ใช้กระบวนท่า หรือหลอมสร้างจริง (เพดานรายวัน " + (g.ELEM ? g.ELEM.MAX_DAILY_GAIN : 2.5) + " แต้ม/ธาตุ)</div>";
      (g.ELEM ? g.ELEM.ORDINARY_ELEMENTS : []).forEach(el => {
        const em = g.ELEM.META[el] || { icon: "•", nameTh: el, color: "#4fb2f2" };
        const direct = +(sys.mastery && sys.mastery[el] || 0).toFixed(1);
        const effM = +(g.ELEM.effectiveMastery(n, el) || 0).toFixed(1);
        const today = +((sys.dailyGainLog && sys.dailyGainLog.byElement && sys.dailyGainLog.byElement[el]) || 0).toFixed(2);
        const hasRoot = Array.isArray(rt.elements) && rt.elements.includes(el);
        h += bar(em.icon + " " + em.nameTh + (hasRoot ? " ★" : ""), direct, { wide: true, color: em.color, txt: direct + " (ใช้จริง " + effM + (today > 0 ? " · วันนี้ +" + today : "") + ")" });
      });
      h += "<div style=\"margin-top:8px;padding-top:6px;border-top:1px solid var(--line,#3a3f4a)\"><b>ธาตุพิเศษ (Special Elements — ไม่เกิดเป็นรากวิญญาณสามัญ):</b></div>";
      (g.ELEM ? g.ELEM.SPECIAL_ELEMENTS : []).forEach(el => {
        const em = g.ELEM.META[el] || { icon: "✦", nameTh: el, color: "#b197fc" };
        const direct = +(sys.specialMastery && sys.specialMastery[el] || 0).toFixed(1);
        const effM = +(g.ELEM.effectiveMastery(n, el) || 0).toFixed(1);
        const acc = (sys.specialAccess && sys.specialAccess[el]) || { unlocked: false, affinity: 25, sources: [] };
        h += "<div style=\"margin-top:4px\"><div style=\"display:flex;justify-content:space-between;font-size:12px\"><span>" + em.icon + " <b>" + esc(em.nameTh) + "</b></span><span class=\"chip " + (acc.unlocked ? "ok" : "") + "\">" + (acc.unlocked ? "ปลดล็อกแล้ว (ความเชื่อมโยง " + acc.affinity + ")" : "ยังไม่เปิดช่องทางธาตุพิเศษ") + "</span></div>" + bar("ความเข้าใจ " + em.shortTh, direct, { wide: true, color: em.color, txt: direct + " (ใช้จริง " + effM + ")" }) + (acc.sources && acc.sources.length ? "<div class=\"muted\" style=\"font-size:11px\">ที่มา: " + esc(acc.sources.join(", ")) + "</div>" : "") + "</div>";
      });
      h += "</div>";

      h += "<h3>3. ความเข้ากันได้ของวิถี วิชา และศาสตราปัจจุบัน</h3><div class=\"card\">";
      if (n.cult && g.ELEM) {
        const c = n.cult;
        const subObj = c.sub && c.sub !== "NONE" ? CULT.subInfo(c.path, c.sub) : CULT.PATHS[c.path];
        if (subObj) {
          const exSub = g.ELEM.explainCompatibility(n, subObj, "CULTIVATION_TICK");
          h += "<div style=\"padding:4px 0;border-bottom:1px solid var(--line,#3a3f4a)\"><b>วิถี/สายย่อย (" + esc(subObj.nameTh || c.path) + "):</b> " + esc(exSub.summaryTh) + " · อัตราบำเพ็ญ ×" + exSub.cultivationMultiplier.toFixed(2) + "</div>";
        }
        if (c.mantra) {
          const mt = CULT.tech(c.mantra);
          if (mt) {
            const exM = g.ELEM.explainCompatibility(n, mt, "MANTRA_PRACTICE");
            h += "<div style=\"padding:4px 0;border-bottom:1px solid var(--line,#3a3f4a)\"><b>คัมภีร์ปราณ (" + esc(mt.nameTh) + "):</b> " + esc(exM.summaryTh) + " · บำเพ็ญ ×" + exM.cultivationMultiplier.toFixed(2) + " · ทะลวงด่าน " + (exM.breakthroughBonus >= 0 ? "+" : "") + Math.round(exM.breakthroughBonus * 100) + "%</div>";
          }
        }
        (c.techs || []).forEach(tid => {
          const t = CULT.tech(tid);
          if (!t) return;
          const exT = g.ELEM.explainCompatibility(n, t, "COMBAT_SKILL");
          const exL = g.ELEM.resolveCompatibility(n, t, "TECH_STUDY");
          h += "<div style=\"padding:4px 0;border-bottom:1px solid var(--line,#3a3f4a)\"><b>วิชา「" + esc(t.nameTh) + "」:</b> " + esc(exT.summaryTh) + " · ปราณ ×" + exT.qiCostMultiplier.toFixed(2) + " · เรียนรู้ ×" + exL.studySpeedMultiplier.toFixed(2) + "</div>";
        });
      } else {
        h += "<div class=\"muted\">ยังเป็นปุถุชน ยังไม่มีวิถีหรือวิชาที่ฝึก</div>";
      }
      ["WEAPON", "ARMOR", "ACCESSORY"].forEach(slot => {
        const eq = n.equip && n.equip[slot];
        if (!eq || !g.ELEM) return;
        const exEq = g.ELEM.explainCompatibility(n, eq, "EQUIPMENT");
        h += "<div style=\"padding:4px 0;border-bottom:1px solid var(--line,#3a3f4a)\"><b>อุปกรณ์ " + slot + "「" + esc(eq.nameTh) + "」:</b> " + esc(exEq.elementIcon + " " + exEq.elementShortTh + " · " + exEq.tierTh) + " (ความสอดคล้อง ×" + exEq.equipmentSynergyMultiplier.toFixed(2) + ")</div>";
      });
      h += "</div>";
    } else if (tab === "body") {
      const elemAffKeys = (g.ELEM && g.ELEM.AFFINITY_GROUPS && g.ELEM.AFFINITY_GROUPS.ELEMENTAL) || ["FIRE", "WATER_ICE", "LIGHTNING", "WIND", "EARTH_METAL", "WOOD_LIFE", "YIN_SHADOW", "LIGHT_YANG"];
      const nonElemAffKeys = (g.ELEM && g.ELEM.AFFINITY_GROUPS && g.ELEM.AFFINITY_GROUPS.NON_ELEMENTAL) || HC.AFF_ALL.filter(k => !elemAffKeys.includes(k));
      h += "<div class=\"muted\">ขีดขาวคือค่ากำเนิด · แสดงความถนัดครบทั้ง 23 ด้านจากฐานข้อมูลเดียวกัน (h.affinities)</div><div class=\"card\">" + statLayer(n, "physiology") + "</div>";
      h += "<h3>ความถนัดธาตุทั้ง 8 (Elemental Affinities 8)</h3><div class=\"card\">" + elemAffKeys.map(k => {
        const em = (g.ELEM && g.ELEM.META && g.ELEM.META[k]) || { icon: "", color: "#4fb2f2" };
        return bar((em.icon ? em.icon + " " : "") + (HC.AFF_TH[k] || k), HC.eff(n, "affinities." + k), { wide: true, mark: n.h.affinities[k], color: em.color });
      }).join("") + "</div>";
      h += "<h3>ความถนัดศาสตราและศาสตร์ทั้ง 15 (Martial & Craft Affinities 15)</h3><div class=\"card\">" + nonElemAffKeys.map(k => {
        return bar(HC.AFF_TH[k] || k, HC.eff(n, "affinities." + k), { wide: true, mark: n.h.affinities[k] });
      }).join("") + "</div>";
      h += "<h3>รูปร่าง</h3><div class=\"card muted\">" + esc(HC.appearanceText(n)) + "</div>";
    } else if (tab === 'mind') {
      h += '<h3>สติปัญญา</h3><div class="card">' + statLayer(n, 'intellect') + '</div><h3>ทักษะสังคม</h3><div class="card">' + statLayer(n, 'social') + '</div>';
    } else if (tab === 'skill') {
      h += '<div class="muted">ค่าทักษะคือฝีมือที่ฝึกไว้ถาวร · ผลเสริมจากวิถีแสดงแยกและหายเมื่อเปลี่ยนสาย</div>' + UI.martialSkills(W, n);
    } else if (tab === 'rel') {
      const rs = Object.keys(n.h.mind.relations).map(id => ({ id, r: n.h.mind.relations[id], o: W.byId[id] })).filter(x => x.o).sort((a, b) => Math.abs(b.r.a) + b.r.l * .3 - Math.abs(a.r.a) - a.r.l * .3);
      h += rs.length ? rs.slice(0, 40).map(x => {
        const ri = (g.COG && g.COG.relInfo) ? g.COG.relInfo(n, x.id) : null;
        return '<div class="prow" data-npc="' + x.id + '">' + portraitHtml(x.o, 36) + '<div class="pi"><div class="nm">' + esc(HC.fullName(x.o)) + (x.r.bond ? ' <span class="chip ' + (x.r.bond === 'ศัตรู' ? 'r' : 'g') + '">' + esc(x.r.bond) + '</span>' : '') + (x.o.dead ? ' ☠' : '') + '</div><div class="sub">ถูกชะตา ' + Math.round(x.r.a) + ' · นับถือ ' + Math.round(x.r.r) + (ri && ri.trust !== 40 ? ' · ไว้ใจ ' + Math.round(ri.trust) : '') + (ri && ri.gratitude > 2 ? ' · กตัญญู ' + Math.round(ri.gratitude) : '') + (ri && ri.fear > 5 ? ' · ยำเกรง ' + Math.round(ri.fear) : '') + (x.r.l > 5 ? ' · รัก ' + Math.round(x.r.l) : '') + (x.r.v > 10 ? ' · ขัดแย้ง ' + Math.round(x.r.v) : '') + ' · พบกัน ' + x.r.n + ' ครั้ง</div></div></div>';
      }).join('') : '<div class="muted">ยังไม่คุ้นเคยกับใครเป็นพิเศษ</div>';
    } else if (tab === 'life') {
      h += '<h3>ความทรงจำสำคัญ</h3><div class="card">' + (n.h.mind.memories.slice().sort((a, b) => b.w - a.w).slice(0, 10).map(m => '<div class="logrow"><span class="tm">' + dayStamp(m.t) + '</span>' + esc(m.text) + '</div>').join('') || '<span class="muted">—</span>') + '</div>';
      h += '<h3>ประวัติ</h3><div class="card">' + (n.h.life.bio.slice().reverse().slice(0, 50).map(b => '<div class="logrow"><span class="tm">ปี' + (Math.floor(b.d / 360) + 1) + ' ด.' + (Math.floor(b.d % 360 / 30) + 1) + '</span>' + linkify(W, b.text, [n.id]) + '</div>').join('') || '<span class="muted">ยังไม่มีเหตุการณ์สำคัญ</span>') + '</div>';
    } else if (tab === 'cmp') {
      const others = W.npcs.filter(o => !o.dead && o !== n).sort((a, b) => b.rank - a.rank); if (!UI.cmpId || !W.byId[UI.cmpId] || UI.cmpId === n.id) UI.cmpId = others[0] ? others[0].id : null; const o = UI.cmpId ? W.byId[UI.cmpId] : null;
      h += '<div class="muted" style="margin-bottom:6px">เปรียบเทียบ “ตัวตน” ครบทั้ง 155 มิติของมนุษย์ เพื่อดูว่า A ต่างจาก B ตรงไหน</div><select id="npcSel">' + others.map(x => '<option value="' + x.id + '"' + (x.id === UI.cmpId ? ' selected' : '') + '>' + esc(HC.fullName(x)) + ' (' + SECT.title(x) + ')</option>').join('') + '</select>';
      if (o) {
        const c = HC.compare(n, o); const pCmp = CULT.compareFunctionalPower(n, o); h += '<div class="card" style="margin-top:8px;text-align:center"><div style="font-size:26px;font-weight:700;color:var(--gold)">คล้ายกัน ' + c.similarity + '%</div><div class="muted">' + esc(HC.fullName(n)) + ' เทียบกับ ' + esc(HC.fullName(o)) + '</div><div style="margin-top:6px;font-size:13px"><b>การประเมินพลังรบเชิงการทำงาน (Functional Power):</b><br><span style="color:var(--gold)">' + esc(pCmp.assessmentTh) + '</span><br><span class="muted">' + esc(pCmp.a.label) + ' (' + pCmp.powerA + ' CP) เทียบกับ ' + esc(pCmp.b.label) + ' (' + pCmp.powerB + ' CP) · อัตราส่วน ' + pCmp.ratio + ' เท่า</span></div></div>';
        h += '<h3>ต่างกันมากที่สุด</h3><div class="card">' + c.topDiffs.slice(0, 8).map(d => { const def = HC.STAT_DEFS.find(s => s.path === d.path); const va = HC.eff(n, d.path), vb = HC.eff(o, d.path); return '<div style="margin:5px 0"><b>' + esc(def ? def.nameTh : d.path) + '</b> <span class="muted">' + esc(HC.LAYER_TH[def ? def.layer : ''] || '') + '</span>' + bar(esc(n.h.name.given), va, { wide: true, color: '#4fb2f2' }) + bar(esc(o.h.name.given), vb, { wide: true, color: '#f0714f' }) + '</div>'; }).join('') + '</div>';
        h += '<h3>คล้ายกันที่สุด</h3><div class="card">' + c.topAlike.slice(0, 5).map(d => { const def = HC.STAT_DEFS.find(s => s.path === d.path); return '<span class="chip ok">' + esc(def ? def.nameTh : d.path) + '</span>'; }).join('') + '</div>';
        h += '<h3>ต่างกันรายหมวด</h3><div class="card">' + c.layers.map(l => bar(l.layerTh, Math.min(100, l.diff / 2 * 100), { wide: true, txt: l.diff.toFixed(2), color: '#b58cf0' })).join('') + '</div>';
      }
    }
    return h;
  };

  /* ---------- PHASE 2 & ELEMENTAL OVERHAUL: SHARED EDIT HUB (UI.rEdit) ---------- */
  UI.collectEditDraftFromDom = () => {
    const body = $("shBody");
    if (!body || !UI.G || !UI.G.W) return null;
    const W = UI.G.W;
    const n = W.byId[UI.editNpcId];
    if (!n) return null;
    if (g.ELEM) g.ELEM.ensureNpc(n);
    const d = UI.editDraft || { cult: {}, economy: {}, state: {} };
    const pathEl = body.querySelector("#editCultPath");
    const subEl = body.querySelector("#editCultSub");
    const stageEl = body.querySelector("#editCultStage");
    const xpEl = body.querySelector("#editCultXp");
    if (pathEl) d.cult.path = pathEl.value;
    if (subEl) d.cult.sub = subEl.value;
    if (stageEl) d.cult.stage = +stageEl.value;
    if (xpEl) d.cult.xp = +xpEl.value;

    const stEl = body.querySelector("#editStones");
    const cpEl = body.querySelector("#editCp");
    const merEl = body.querySelector("#editMerit");
    const satEl = body.querySelector("#editSat");
    if (stEl) d.economy.stones = +stEl.value;
    if (cpEl) d.economy.cp = +cpEl.value;
    if (merEl) d.economy.merit = +merEl.value;
    if (satEl) d.economy.sat = +satEl.value;

    // Collect spiritual root edits
    const rcEl = body.querySelector("#editRootCount");
    if (rcEl && g.ELEM) {
      const k = clamp(Math.floor(+rcEl.value || 1), 1, 4);
      const prevEls = (d.root && Array.isArray(d.root.elements)) ? d.root.elements : (n.h.root ? n.h.root.elements.slice() : ["FIRE"]);
      const prevGrs = (d.root && Array.isArray(d.root.grades)) ? d.root.grades : (n.h.root ? n.h.root.grades.slice() : ["MORTAL"]);
      const elements = [];
      const grades = [];
      for (let i = 0; i < k; i++) {
        const elSel = body.querySelector("#editRootEl_" + i);
        const grSel = body.querySelector("#editRootGrade_" + i);
        let pickedEl = elSel ? elSel.value : (prevEls[i] || g.ELEM.ORDINARY_ELEMENTS.find(e => !elements.includes(e)) || "FIRE");
        elements.push(pickedEl);
        grades.push(grSel ? grSel.value : (prevGrs[i] || "MORTAL"));
      }
      d.root = {
        rootCount: k,
        rootCapacityTrait: g.ELEM.ROOT_CAPACITY_TRAITS[k] || "ROOT_CAPACITY_SINGLE",
        elements,
        grades
      };
    }

    // Collect trainable elemental mastery & special element unlocks
    const mastInputs = body.querySelectorAll("[data-edit-mastery]");
    if (mastInputs.length) {
      d.elemental = d.elemental || { mastery: {}, specialMastery: {}, specialAccess: {} };
      mastInputs.forEach(inp => {
        const el = inp.dataset.editMastery;
        const val = clamp(+inp.value || 0, 0, 100);
        if (g.ELEM && g.ELEM.isValidSpecialElement(el)) {
          d.elemental.specialMastery[el] = val;
        } else {
          d.elemental.mastery[el] = val;
        }
      });
    }
    const specUnlockInputs = body.querySelectorAll("[data-edit-spec-unlock]");
    if (specUnlockInputs.length) {
      d.elemental = d.elemental || { mastery: {}, specialMastery: {}, specialAccess: {} };
      specUnlockInputs.forEach(chk => {
        const el = chk.dataset.editSpecUnlock;
        d.elemental.specialAccess[el] = !!chk.checked;
      });
    }

    body.querySelectorAll("[data-edit-stat]").forEach(inp => {
      const [grp, key] = inp.dataset.editStat.split(".");
      d[grp] = d[grp] || {};
      d[grp][key] = +inp.value;
    });
    UI.editDraft = d;
    return d;
  };

  UI.updateEditPreviewDom = () => {
    const body = $("shBody");
    if (!body || !UI.G || !UI.G.W) return;
    const W = UI.G.W;
    const prevEl = body.querySelector("#editLivePreview");
    if (!prevEl || !UI.editNpcId) return;
    const draft = UI.editDraft || {};
    const prev = SECT.EDITOR.previewCharacterEdit(W, UI.editNpcId, draft);
    if (!prev.ok) {
      prevEl.innerHTML = "<span style=\"color:var(--red)\">⚠️ " + esc(prev.reason) + "</span>";
    } else {
      const recNotes = (prev.reconciled.notes || []).concat(prev.reconciled.unequippedGear.length ? ["ถอดอุปกรณ์ที่ไม่รองรับเข้าคลัง: " + prev.reconciled.unequippedGear.join(", ")] : []);
      prevEl.innerHTML = "<b>ผลคำนวณหลังแก้ไข:</b> " + esc(prev.after.stageName) +
        " · รากปราณ <b>" + (prev.after.rootCount || 1) + " ราก (" + esc(prev.after.aggregateGrade || "MORTAL") + " · " + esc(prev.after.rarityTitleTh || "") + ")</b>" +
        " · พลังชีวิตสูงสุด <b>" + prev.after.hpMax + "</b> (เดิม " + prev.before.hpMax + ")" +
        " · ปราณสูงสุด <b>" + prev.after.qiMax + "</b> (เดิม " + prev.before.qiMax + ")" +
        " · พลังรบ <b>" + prev.after.combatPower + "</b> (เดิม " + prev.before.combatPower + ")" +
        " · อัตราบ่มเพาะ <b>" + (prev.after.cultRate || 0) + "/ชม.</b> (เดิม " + (prev.before.cultRate || 0) + "/ชม.)" +
        (recNotes.length ? "<div class=\"muted\" style=\"color:var(--gold)\">หมายเหตุ: " + esc(recNotes.join(" · ")) + "</div>" : "");
    }
  };

  UI.applyCharEditFromDom = () => {
    const W = UI.G.W;
    const draft = UI.collectEditDraftFromDom();
    if (!draft || !UI.editNpcId) return;
    const res = SECT.EDITOR.applyCharacterEdit(W, UI.editNpcId, draft);
    if (!res.ok) {
      UI.toast("แก้ไขไม่สำเร็จ: " + res.reason);
      return;
    }
    if (UI.G && UI.G.R && UI.G.R.invalidate) UI.G.R.invalidate();
    UI.toast("บันทึกการแก้ไขของ " + W.byId[UI.editNpcId].h.name.given + " สำเร็จ");
    UI.editDraft = null;
    UI.render();
    UI.updateHud(true);
  };

  UI.rEdit = () => {
    const W = UI.G.W, tab = UI.tab || "char";
    const members = W.npcs.filter(n => !n.dead && !n.exiled).sort((a, b) => b.rank - a.rank);
    if (!UI.editNpcId || !W.byId[UI.editNpcId] || W.byId[UI.editNpcId].dead) {
      UI.editNpcId = members[0] ? members[0].id : W.sect.masterId;
    }
    const n = W.byId[UI.editNpcId];
    if (n && g.ELEM) g.ELEM.ensureNpc(n);
    let h = "<div class=\"card\"><b>ตัวละครเป้าหมาย:</b><select id=\"editNpcSel\" style=\"margin-top:4px\">" + members.map(x => "<option value=\"" + x.id + "\"" + (x.id === UI.editNpcId ? " selected" : "") + ">" + esc(HC.fullName(x)) + " (" + SECT.title(x) + " · " + CULT.stageName(x) + ")</option>").join("") + "</select>";
    if (n) {
      const st = SECT.EDITOR.memberEditState(W, n);
      if (st.warnings && st.warnings.length) {
        h += "<div class=\"muted\" style=\"margin-top:4px;color:var(--gold)\">⚠️ " + esc(st.warnings.join(" · ")) + "</div>";
      }
      h += "<div style=\"margin-top:6px;display:flex;gap:6px;flex-wrap:wrap\"><button class=\"btn\" data-do=\"npc\" data-arg=\"" + n.id + "\">👤 เปิดหน้าข้อมูลตัวละคร</button><button class=\"btn\" data-do=\"heal-char-edit\">✨ ฟื้นฟู/รักษาเต็ม</button>" + (Array.isArray(W._editUndoStack) && W._editUndoStack.length ? "<button class=\"btn\" data-do=\"undo-char-edit\">↩️ ย้อนคืนการแก้ไขล่าสุด (" + W._editUndoStack.length + ")</button>" : "") + "</div>";
    }
    h += "</div>";

    if (tab === "char" && n) {
      const d = UI.editDraft || {};
      const curPath = (d.cult && d.cult.path) || (n.cult ? n.cult.path : "MORTAL");
      const pathDef = CULT.PATHS[curPath];
      const maxStage = pathDef ? pathDef.maxStage : 0;
      const curStage = (d.cult && d.cult.stage !== undefined) ? clamp(d.cult.stage, 0, maxStage) : (n.cult ? Math.min(n.cult.stage, maxStage || 1) : 0);
      const validSubs = pathDef ? pathDef.subPaths : [];
      const curSub = (d.cult && d.cult.sub !== undefined) ? d.cult.sub : (n.cult ? n.cult.sub : "NONE");
      const curXp = (d.cult && d.cult.xp !== undefined) ? d.cult.xp : (n.cult ? Math.round(n.cult.prog || 0) : 0);

      h += "<h3>1. วิถีบำเพ็ญ ขั้นตบะ และทรัพยากรส่วนตัว</h3><div class=\"card\"><div class=\"edit-grid\">";
      h += "<div class=\"edit-field\"><label>วิถีหลัก</label><select id=\"editCultPath\" class=\"edit-live-input\"><option value=\"MORTAL\"" + (curPath === "MORTAL" ? " selected" : "") + ">ปุถุชน (ไร้ตบะ)</option>" + Object.keys(CULT.PATHS).map(pid => "<option value=\"" + pid + "\"" + (curPath === pid ? " selected" : "") + ">" + esc(CULT.PATHS[pid].nameTh) + " (สูงสุดขั้น " + CULT.PATHS[pid].maxStage + ")</option>").join("") + "</select></div>";
      h += "<div class=\"edit-field\"><label>สายย่อย</label><select id=\"editCultSub\" class=\"edit-live-input\"><option value=\"NONE\">พื้นฐาน (ยังไม่เลือกสายย่อย)</option>" + validSubs.map(s => "<option value=\"" + s.id + "\"" + (curSub === s.id ? " selected" : "") + ">" + esc(s.nameTh) + "</option>").join("") + "</select></div>";
      h += "<div class=\"edit-field\"><label>ขั้นตบะ (0–" + maxStage + ")</label><input id=\"editCultStage\" class=\"edit-live-input\" type=\"number\" min=\"0\" max=\"" + maxStage + "\" value=\"" + curStage + "\"></div>";
      h += "<div class=\"edit-field\"><label>แต้มตบะสะสม (XP)</label><input id=\"editCultXp\" class=\"edit-live-input\" type=\"number\" min=\"0\" max=\"500000\" value=\"" + curXp + "\"></div>";
      h += "<div class=\"edit-field\"><label>ศิลาส่วนตัว</label><input id=\"editStones\" class=\"edit-live-input\" type=\"number\" min=\"0\" max=\"999999\" value=\"" + Math.round((d.economy && d.economy.stones !== undefined) ? d.economy.stones : (n.inv.stones || 0)) + "\"></div>";
      h += "<div class=\"edit-field\"><label>แต้มคุณูปการ (คป.)</label><input id=\"editCp\" class=\"edit-live-input\" type=\"number\" min=\"0\" max=\"999999\" value=\"" + Math.round((d.economy && d.economy.cp !== undefined) ? d.economy.cp : (n.cp || 0)) + "\"></div>";
      h += "<div class=\"edit-field\"><label>ผลงานสะสม (Merit)</label><input id=\"editMerit\" class=\"edit-live-input\" type=\"number\" min=\"0\" max=\"999999\" value=\"" + Math.round((d.economy && d.economy.merit !== undefined) ? d.economy.merit : (n.merit || 0)) + "\"></div>";
      h += "<div class=\"edit-field\"><label>ความพึงพอใจ (0–100)</label><input id=\"editSat\" class=\"edit-live-input\" type=\"number\" min=\"0\" max=\"100\" value=\"" + Math.round((d.economy && d.economy.sat !== undefined) ? d.economy.sat : (n.sat == null ? 60 : n.sat)) + "\"></div>";
      h += "</div></div>";

      // Spiritual Roots & Elemental Mastery Editor
      if (g.ELEM) {
        const curRoot = d.root || n.h.root || { rootCount: 1, elements: ["FIRE"], grades: ["MORTAL"] };
        const k = clamp(Number(curRoot.rootCount || (curRoot.elements && curRoot.elements.length) || 1), 1, 4);
        const curEls = (curRoot.elements || ["FIRE"]).slice();
        const curGrs = (curRoot.grades || ["MORTAL"]).slice();
        while (curEls.length < k) {
          const nextEl = g.ELEM.ORDINARY_ELEMENTS.find(e => !curEls.includes(e)) || "FIRE";
          curEls.push(nextEl);
        }
        while (curGrs.length < k) curGrs.push("MORTAL");

        h += "<h3>2. รากวิญญาณกำเนิด (1–4 ราก) และความเข้าใจธาตุ</h3><div class=\"card\">";
        h += "<div class=\"muted\" style=\"margin-bottom:6px\">กำหนดจำนวนรากวิญญาณ (1–4 ราก ตามลักษณะความจุรากวิญญาณ Option A · ไม่มีระบบ 5 ราก) พร้อมระบุธาตุสามัญไม่ซ้ำกันและเกรดของแต่ละรากโดยอิสระ</div>";
        h += "<div class=\"edit-grid\">";
        h += "<div class=\"edit-field\"><label>ความจุรากวิญญาณ (1–4 ราก)</label><select id=\"editRootCount\" class=\"edit-live-input\">" +
          [[1, "1 ราก · เอกรากวิญญาณ (ROOT_CAPACITY_SINGLE)"], [2, "2 ราก · กายาทวิรากวิญญาณ (TR_ROOT_CAPACITY_DUAL)"], [3, "3 ราก · กายาตรีรากวิญญาณ (TR_ROOT_CAPACITY_TRIPLE)"], [4, "4 ราก · กายาจตุรธาตุบรรพกาล (TR_ROOT_CAPACITY_FOURFOLD)"]].map(([cnt, lbl]) => "<option value=\"" + cnt + "\"" + (k === cnt ? " selected" : "") + ">" + lbl + "</option>").join("") +
          "</select></div>";
        for (let i = 0; i < k; i++) {
          h += "<div class=\"edit-field\"><label>ธาตุรากที่ " + (i + 1) + (i === 0 ? " (หลัก)" : "") + "</label><select id=\"editRootEl_" + i + "\" class=\"edit-live-input\">" +
            g.ELEM.ORDINARY_ELEMENTS.map(el => "<option value=\"" + el + "\"" + (curEls[i] === el ? " selected" : "") + ">" + g.ELEM.META[el].icon + " " + esc(g.ELEM.META[el].nameTh) + " (" + el + ")</option>").join("") +
            "</select></div>";
          h += "<div class=\"edit-field\"><label>เกรดรากที่ " + (i + 1) + "</label><select id=\"editRootGrade_" + i + "\" class=\"edit-live-input\">" +
            g.ELEM.GRADE_ORDER.map(gId => "<option value=\"" + gId + "\"" + (curGrs[i] === gId ? " selected" : "") + ">" + esc(g.ELEM.GRADE_FACTORS[gId].nameTh) + " (" + gId + ")</option>").join("") +
            "</select></div>";
        }
        h += "</div>";

        const sys = (n.ext && n.ext.elementalSystem) || { mastery: {}, specialMastery: {}, specialAccess: {} };
        h += "<div style=\"margin-top:8px;padding-top:6px;border-top:1px solid var(--line,#3a3f4a)\"><b>ความเข้าใจธาตุจากการฝึกฝน (Elemental Mastery 0–100):</b></div><div class=\"edit-grid\" style=\"margin-top:4px\">";
        g.ELEM.ORDINARY_ELEMENTS.forEach(el => {
          const mVal = (d.elemental && d.elemental.mastery && d.elemental.mastery[el] !== undefined)
            ? d.elemental.mastery[el]
            : Math.round(((sys.mastery && sys.mastery[el]) || 0) * 10) / 10;
          h += "<div class=\"edit-field\"><label>" + g.ELEM.META[el].icon + " " + esc(g.ELEM.META[el].shortTh) + " (0–100)</label><input type=\"number\" step=\"0.5\" min=\"0\" max=\"100\" class=\"edit-live-input\" data-edit-mastery=\"" + el + "\" value=\"" + mVal + "\"></div>";
        });
        g.ELEM.SPECIAL_ELEMENTS.forEach(el => {
          const smVal = (d.elemental && d.elemental.specialMastery && d.elemental.specialMastery[el] !== undefined)
            ? d.elemental.specialMastery[el]
            : Math.round(((sys.specialMastery && sys.specialMastery[el]) || 0) * 10) / 10;
          const isUnl = (d.elemental && d.elemental.specialAccess && d.elemental.specialAccess[el] !== undefined)
            ? !!d.elemental.specialAccess[el]
            : !!(sys.specialAccess && sys.specialAccess[el] && sys.specialAccess[el].unlocked);
          h += "<div class=\"edit-field\"><label>" + g.ELEM.META[el].icon + " " + esc(g.ELEM.META[el].shortTh) + " (ธาตุพิเศษ 0–100)</label><input type=\"number\" step=\"0.5\" min=\"0\" max=\"100\" class=\"edit-live-input\" data-edit-mastery=\"" + el + "\" value=\"" + smVal + "\"><label style=\"font-size:11px;margin-top:2px;display:flex;align-items:center;gap:4px\"><input type=\"checkbox\" class=\"edit-live-input\" data-edit-spec-unlock=\"" + el + "\"" + (isUnl ? " checked" : "") + "> ปลดล็อกวิถีธาตุพิเศษ</label></div>";
        });
        h += "</div></div>";
      }

      const grp = UI.editStatGroup || "personality";
      const grpSpec = SECT.EDITOR.EDITABLE_GROUPS[grp] || SECT.EDITOR.EDITABLE_GROUPS.personality;
      const grpLabels = {
        personality: "บุคลิกภาพ (Personality 14)",
        values: "คุณค่าชีวิต (Values 8)",
        interests: "ความสนใจ (Interests 15)",
        aptitudes: "พรสวรรค์ (Aptitudes 6)",
        affinities: "ความถนัดทั้ง 23 ด้าน (Affinities: 8 ธาตุ + 15 ศาสตร์)",
        physiology: "สรีระและรากฐานกาย (Physiology 16)",
        intellect: "สติปัญญา (Intellect 16)",
        social: "ทักษะสังคม (Social 9)",
        skills: "ทักษะยุทธ์และวิชาชีพ (Skills 30)"
      };
      h += "<h3>3. ค่าพื้นฐานและความถนัดตัวละคร (คำนวณ HP/Qi/พลังรบอัตโนมัติ)</h3><div class=\"card\">";
      h += "<select id=\"editStatGroupSel\" style=\"margin-bottom:8px\">" + Object.keys(grpLabels).map(gk => "<option value=\"" + gk + "\"" + (grp === gk ? " selected" : "") + ">" + grpLabels[gk] + "</option>").join("") + "</select>";
      h += "<div class=\"edit-grid\">";
      grpSpec.keys.forEach(k => {
        const curVal = (d[grp] && d[grp][k] !== undefined) ? d[grp][k] : Math.round((n.h[grp] && n.h[grp][k]) || 0);
        const label = grp === "affinities" ? (HC.AFF_TH[k] || k) : (HC.nameOf(grp + "." + k) || k);
        h += "<div class=\"edit-field\"><label>" + esc(label) + " (" + grpSpec.min + "–" + grpSpec.max + ")</label><input type=\"number\" class=\"edit-live-input\" data-edit-stat=\"" + grp + "." + k + "\" min=\"" + grpSpec.min + "\" max=\"" + grpSpec.max + "\" value=\"" + curVal + "\"></div>";
      });
      h += "</div></div>";

      const prev = SECT.EDITOR.previewCharacterEdit(W, n.id, d);
      h += "<div class=\"card\" id=\"editLivePreview\">" + (prev.ok ? ("<b>ผลคำนวณหลังแก้ไข:</b> " + esc(prev.after.stageName) + " · รากปราณ <b>" + (prev.after.rootCount || 1) + " ราก (" + esc(prev.after.aggregateGrade || "MORTAL") + " · " + esc(prev.after.rarityTitleTh || "") + ")</b> · พลังชีวิตสูงสุด <b>" + prev.after.hpMax + "</b> · ปราณสูงสุด <b>" + prev.after.qiMax + "</b> · พลังรบ <b>" + prev.after.combatPower + "</b> · อัตราบ่มเพาะ <b>" + (prev.after.cultRate || 0) + "/ชม.</b>") : ("<span style=\"color:var(--red)\">⚠️ " + esc(prev.reason) + "</span>")) + "</div>";
      h += "<div style=\"display:flex;gap:8px;margin-top:8px\"><button class=\"btn pri\" style=\"flex:1\" data-do=\"apply-char-edit\">💾 บันทึกการแก้ไขตัวละคร</button></div>";
    } else if (tab === "spawn") {
      const paged = SECT.EDITOR.catalogPaginated(W, {
        search: UI.spawnSearch,
        kind: UI.spawnKind,
        tier: UI.spawnTier === "ALL" ? null : +UI.spawnTier,
        element: UI.spawnElement,
        rarity: UI.spawnRarity,
        dest: UI.spawnDest,
        page: UI.spawnPage || 1,
        pageSize: UI.spawnPageSize || 40
      });
      UI.spawnPage = paged.page;
      h += "<h3>✨ เสกไอเทม ศาสตราในตำนาน และคัมภีร์เข้าคลังหรือถุงส่วนตัว</h3><div class=\"card\">";
      h += "<div class=\"muted\" style=\"margin-bottom:6px\">รองรับการค้นหาด้วยชื่อ รหัส ระดับความหายาก (เช่น <code>Legendary</code>, <code>LEG_WPN_</code>, <code>LEG_</code>) ธาตุ สายวิชา และรหัสเอฟเฟกต์ พร้อมระบบแบ่งหน้าแสดงผลครบทุกไอเทม</div>";
      h += "<div class=\"edit-grid\">";
      h += "<div class=\"edit-field\"><label>ปลายทาง</label><select id=\"spawnDest\"><option value=\"sect\"" + (UI.spawnDest === "sect" ? " selected" : "") + ">🏯 คลังสำนัก</option><option value=\"npc\"" + (UI.spawnDest === "npc" ? " selected" : "") + ">🎒 ถุงส่วนตัวของ " + esc(n ? n.h.name.given : "ตัวละคร") + "</option></select></div>";
      h += "<div class=\"edit-field\"><label>หมวดหมู่</label><select id=\"spawnKind\">" + [["ALL", "ทุกหมวดหมู่"], ["PROVISION", "เสบียง/ศิลา"], ["MATERIAL", "วัตถุดิบ"], ["PILL", "โอสถพื้นฐาน"], ["CRAFTED_PILL", "โอสถตำรับ"], ["EQUIPMENT", "อุปกรณ์ยุทธ์/ศาสตราตำนาน"], ["TECH_MANUAL", "คัมภีร์วิชา/ปราณตำนาน"], ["CRYSTAL", "ผลึกสายย่อย"], ["SUB_MANUAL", "คัมภีร์สายย่อย"], ["RECIPE_SCROLL", "ม้วนตำรับ"], ["ORGAN", "อวัยวะอสูร"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.spawnKind === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select></div>";
      h += "<div class=\"edit-field\"><label>ระดับ (Tier)</label><select id=\"spawnTier\">" + [["ALL", "ทุกระดับ"], ["1", "ระดับ 1"], ["2", "ระดับ 2"], ["3", "ระดับ 3"], ["4", "ระดับ 4"], ["5", "ระดับ 5"], ["6", "ระดับ 6"], ["7", "ระดับ 7"]].map(([k, v]) => "<option value=\"" + k + "\"" + (UI.spawnTier === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select></div>";
      h += "<div class=\"edit-field\"><label>ธาตุ (Element)</label><select id=\"spawnElement\">" + [["ALL", "ทุกธาตุ"], ["FIRE", "🔥 ธาตุไฟ"], ["WATER_ICE", "❄️ ธาตุน้ำ-น้ำแข็ง"], ["LIGHTNING", "⚡ ธาตุสายฟ้า"], ["WIND", "🌪️ ธาตุลม"], ["EARTH_METAL", "⛰️ ธาตุดิน-โลหะ"], ["WOOD_LIFE", "🌿 ธาตุไม้-ชีวิต"], ["YIN_SHADOW", "🌑 ธาตุหยิน-เงา"], ["LIGHT_YANG", "☀️ ธาตุแสง-หยาง"], ["ASTRAL", "✨ ดารา-มิติ (พิเศษ)"], ["BLOOD_DEMON", "🩸 โลหิต-มาร (พิเศษ)"], ["NEUTRAL", "⚪ ไร้ธาตุเฉพาะ"]].map(([k, v]) => "<option value=\"" + k + "\"" + ((UI.spawnElement || "ALL") === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select></div>";
      h += "<div class=\"edit-field\"><label>ความหายาก (Rarity)</label><select id=\"spawnRarity\">" + [["ALL", "ทุกระดับความหายาก"], ["Legendary", "★ Legendary (ตำนาน)"], ["Rare", "Rare (หายาก)"], ["Uncommon", "Uncommon (ปานกลาง)"], ["Common", "Common (ทั่วไป)"]].map(([k, v]) => "<option value=\"" + k + "\"" + ((UI.spawnRarity || "ALL") === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select></div>";
      h += "<div class=\"edit-field\"><label>จำนวนต่อหน้า</label><select id=\"spawnPageSize\">" + [["40", "40 รายการ/หน้า"], ["80", "80 รายการ/หน้า"], ["150", "150 รายการ/หน้า"]].map(([k, v]) => "<option value=\"" + k + "\"" + (String(UI.spawnPageSize || 40) === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select></div>";
      h += "<div class=\"edit-field\"><label>จำนวนที่จะเสก</label><input id=\"spawnQty\" type=\"number\" min=\"1\" max=\"50000\" value=\"" + (UI.spawnQty || 1) + "\"></div>";
      h += "<div class=\"edit-field\"><label>คุณภาพอุปกรณ์</label><select id=\"spawnQuality\">" + [["0.85", "ธรรมดา (85%)"], ["1", "มาตรฐาน (100%)"], ["1.15", "ประณีต (115%)"], ["1.3", "ชั้นเลิศ (130%)"]].map(([k, v]) => "<option value=\"" + k + "\"" + (String(UI.spawnQuality) === k ? " selected" : "") + ">" + v + "</option>").join("") + "</select></div>";
      h += "<div class=\"edit-field\"><label>ค้นหาชื่อ/รหัส/Legendary/เอฟเฟกต์</label><input id=\"spawnSearch\" type=\"search\" placeholder=\"พิมพ์ชื่อ รหัส Legendary หรือธาตุ…\" value=\"" + esc(UI.spawnSearch || "") + "\"></div>";
      h += "</div></div>";

      h += "<div style=\"display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin:8px 0 4px\"><h3 style=\"margin:0\">รายการไอเทม (พบทั้งหมด " + paged.total + " รายการ · หน้า " + paged.page + "/" + paged.totalPages + ")</h3>";
      if (paged.totalPages > 1) {
        h += "<div style=\"display:flex;gap:6px;align-items:center\"><button class=\"btn\" style=\"padding:3px 8px\" data-do=\"spawn-page\" data-arg=\"-1\"" + (paged.page <= 1 ? " disabled" : "") + ">◀ หน้าก่อน</button><span class=\"muted\">หน้า " + paged.page + "/" + paged.totalPages + "</span><button class=\"btn\" style=\"padding:3px 8px\" data-do=\"spawn-page\" data-arg=\"1\"" + (paged.page >= paged.totalPages ? " disabled" : "") + ">หน้าถัดไป ▶</button></div>";
      }
      h += "</div><div class=\"card\">";
      if (!paged.items.length) {
        h += "<div class=\"muted\">ไม่พบไอเทมที่ตรงกับตัวกรอง</div>";
      } else {
        h += paged.items.map(item => {
          const legChip = item.legendary ? " <span class=\"chip g\">★ Legendary</span>" : "";
          const elChip = item.element && item.element !== "NEUTRAL" ? (" <span class=\"chip\">" + (item.elementIcon || "") + " " + esc(item.elementShortTh || item.element) + "</span>") : "";
          const extraBtns = [];
          if (n && item.kind === "EQUIPMENT") {
            extraBtns.push("<button class=\"btn\" style=\"padding:4px 8px;font-size:11px\" data-do=\"spawn-equip-item\" data-arg=\"" + item.kind + "|" + item.id + "\">⚔️ เสก+สวมใส่</button>");
          }
          if (n && n.cult && item.kind === "TECH_MANUAL") {
            extraBtns.push("<button class=\"btn\" style=\"padding:4px 8px;font-size:11px\" data-do=\"spawn-teach-item\" data-arg=\"" + item.kind + "|" + item.id + "\">📖 ถ่ายทอด</button>");
          }
          return "<div class=\"logrow\" style=\"align-items:center;gap:6px\"><div style=\"flex:1;min-width:0\"><span class=\"chip b\">" + esc(item.kind) + " T" + item.tier + "</span>" + legChip + elChip + " <b>" + esc(item.nameTh) + "</b> <span class=\"muted\" style=\"font-size:11px\">(" + esc(item.id) + ")</span><div class=\"muted\" style=\"font-size:11px\">" + esc(item.descTh || "") + "</div></div><div style=\"display:flex;gap:4px;flex-wrap:wrap\">" + extraBtns.join("") + "<button class=\"btn pri\" style=\"padding:4px 10px;font-size:11.5px\" data-do=\"spawn-item\" data-arg=\"" + item.kind + "|" + item.id + "\">✨ เสก</button></div></div>";
        }).join("");
      }
      h += "</div>";
    } else if (tab === "bag" && n) {
      h += renderPersonalBagSection(W, n);
    } else if (tab === "backup") {
      const slots = UI.slotInfo();
      h += "<h3>💾 สำรองข้อมูลก่อนแก้ไขหรือเสกของ</h3><div class=\"card\"><div class=\"muted\">แนะนำให้บันทึกเกมลงช่องบันทึกหรือส่งออกเป็นไฟล์ JSON ก่อนปรับแก้ค่าสถานะขนาดใหญ่ การกดปุ่ม \"ย้อนคืนการแก้ไขล่าสุด\" จะย้อนคืนเฉพาะค่าสถานะตัวละครโดยไม่ย้อนเวลาของโลกที่เดินไปแล้ว</div>";
      [1, 2, 3].forEach(i => {
        const s = slots[i];
        h += "<div style=\"margin-top:6px\"><b>ช่องที่ " + i + ":</b> <span class=\"muted\">" + (s ? esc(s.text) : "ว่าง") + "</span> <button class=\"btn pri\" data-do=\"save\" data-arg=\"" + i + "\">💾 บันทึกทับช่อง " + i + "</button></div>";
      });
      h += "<div style=\"margin-top:8px\"><button class=\"btn\" data-do=\"export\">⬇ ส่งออกไฟล์สำรอง (.json)</button></div></div>";
    }
    return h;
  };

  /* ----- เมนู ----- */
  UI.rMenu = () => {
    const G = UI.G, tab = UI.tab; let h = '';
    if (tab === 'main') {
      const slots = UI.slotInfo(); h += '<h3>' + (G.W ? 'บันทึก / โหลด' : 'โหลดเกม') + '</h3>';
      [1, 2, 3].forEach(i => { const s = slots[i]; h += '<div class="card"><b>ช่องที่ ' + i + '</b> <span class="muted">' + (s ? esc(s.text) : 'ว่าง') + '</span><div>' + (G.W ? '<button class="btn pri" data-do="save" data-arg="' + i + '">💾 บันทึก</button>' : '') + (s ? '<button class="btn" data-do="load" data-arg="' + i + '">📂 โหลด</button>' : '') + '</div></div>'; });
      h += '<div class="card"><b>ไฟล์สำรอง</b><div class="muted">' + (G.W ? 'ส่งออกเป็นไฟล์ เก็บไว้ในเครื่อง หรือนำเข้ามาเล่นต่อ' : 'นำเข้าไฟล์สำรองเพื่อเล่นต่อ') + '</div>' + (G.W ? '<button class="btn" data-do="export">⬇ ส่งออกไฟล์</button>' : '') + '<button class="btn" data-do="import">⬆ นำเข้าไฟล์</button></div>';
      h += '<div class="card"><button class="btn dan" data-do="new">🔄 เริ่มเกมใหม่ (เลือกเจ้าสำนักใหม่)</button></div>';
    } else if (tab === 'set') {
      const o = G.opts, effQ = (G.R && G.R.resolveQuality) ? G.R.resolveQuality() : (o.quality || 'standard');
      const qNames = { low: 'ประหยัดพลังงาน', standard: 'มาตรฐาน', high: 'คมชัดสูง' };
      h += '<div class="card"><b>คุณภาพกราฟิกและการเคลื่อนไหว</b><div class="edit-field" style="margin-top:6px"><label>ระดับความละเอียดภาพ (ใช้งานจริง: ' + esc(qNames[effQ] || effQ) + ')</label><select id="gfxQualitySel">' + [['auto', 'อัตโนมัติ (ปรับตามขนาดจอและเฟรมเรต)'], ['low', 'ประหยัดพลังงาน (Low — ลดเงาและละออง)'], ['standard', 'มาตรฐาน (Standard — สมดุลคมชัด)'], ['high', 'คมชัดสูง (High — เต็มพิกัด DPR 2×)']].map(([k, v]) => '<option value="' + k + '"' + ((o.quality || 'auto') === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></div>';
      h += '<label class="sw" style="border-bottom:0;padding-bottom:2px"><span>ลดการเคลื่อนไหว (หยุดอนิเมชันน้ำ/ควัน/ประกาย)</span><input type="checkbox" data-set="reducedMotion" ' + (o.reducedMotion ? 'checked' : '') + '></label><div class="edit-field" style="margin-top:6px"><label>รูปแบบแสดงผลถุงสัมภาระ คลังสำนัก และร้านค้า</label><select id="invViewModeSel"><option value="grid"' + (UI.getInvViewMode() === 'grid' ? ' selected' : '') + '>⊞ ตารางไอคอนแบบแบ่งหน้า (Paginated Icon-Grid)</option><option value="list"' + (UI.getInvViewMode() === 'list' ? ' selected' : '') + '>☰ รายการแบบดั้งเดิม (Classic List View)</option></select></div></div>';
      h += [['names', 'แสดงชื่อตัวละคร (ขยายภาพ)'], ['bubbles', 'แสดงไอคอนกิจกรรมเหนือหัว'], ['weather', 'เอฟเฟกต์อากาศ/ใบไม้ร่วง'], ['night', 'กลางคืนมืดลง'], ['toast', 'แจ้งเตือนเหตุการณ์สำคัญ'], ['autosave', 'บันทึกอัตโนมัติ (ทุก 3 นาที)']].map(s => '<label class="sw"><span>' + s[1] + '</span><input type="checkbox" data-set="' + s[0] + '" ' + (o[s[0]] ? 'checked' : '') + '></label>').join('');
      h += '<div class="muted" style="margin-top:10px">การลากนิ้ว = เลื่อนแผนที่ · บีบนิ้ว = ซูม · แตะตัวละคร/อาคาร = ดูข้อมูล</div>';
    } else if (tab === 'tools') {
      h += '<div class="muted" style="margin-bottom:8px">เครื่องมือทดลองสำหรับผู้สังเกตการณ์ — ไม่ใช่ส่วนหนึ่งของระบบสำนักตามปกติ ใช้ดูว่า NPC ตัดสินใจอย่างไรเมื่อเกิดเหตุ</div>';
      h += [['stones', '💎 มอบศิลา 1,000'], ['food', '🍚 มอบเสบียง'], ['raid', '⚠ เรียกโจรบุก'], ['beast', '🐺 เรียกอสูรบุก'], ['recruit', '🧑‍🎓 เรียกผู้สมัครเข้าสำนัก'], ['banquet', '🎎 ให้เจ้าสำนักจัดงานเลี้ยง'], ['tourney', '🏆 ให้เจ้าสำนักจัดประลองยุทธ์'], ['challenge', '⚔ ให้ผู้อาวุโสท้าชิงตำแหน่ง'], ['heal', '✨ รักษาทุกคนจนหาย']].map(t => '<button class="btn" data-do="tool" data-arg="' + t[0] + '">' + t[1] + '</button>').join('');
    } else {
      h += '<div class="card"><b>สำนักเมฆาหยก v1.10 · ยุทธภพและสายวิชา</b><div class="muted">เกมจำลองสำนักยุทธภพแบบ sandbox — NPC ทุกคนมี “แกนมนุษย์” ชุดเดียวกัน 155 มิติ (บุคลิก 14 · คุณค่า 8 · กาย 22 · ปัญญา 18 · สังคม 7 · อารมณ์ 7 · ความสนใจ 24 · พรสวรรค์ 6 · ความถนัด · ทักษะ) ตัดสินใจเองจากตัวตน ไม่มีสคริปต์ตายตัว</div></div><div class="card"><b>ข้อมูลเกม</b><div class="muted">เมล็ดโลก: ' + esc(G.W.seed) + ' · เวอร์ชันแกน: ' + esc(HC.FINGERPRINT) + '<br>ข้อมูลวิถี/โอสถ/คัมภีร์/อสูรสกัดจาก Jianghu Universal Game Data Pack v1</div></div>';
    }
    return h;
  };
  UI.applyOpts = () => { const o = UI.G.opts, R = UI.G.R; R.opts.names = o.names; R.opts.bubbles = o.bubbles; R.opts.weather = o.weather; R.opts.night = o.night; R.opts.quality = o.quality || 'auto'; R.opts.reducedMotion = !!o.reducedMotion; if (R.resize) R.resize(); try { localStorage.setItem('jhs_opts', JSON.stringify(o)); } catch (e) { } };
  UI.tool = a => {
    const G = UI.G, W = G.W, S = W.sect, m = W.byId[S.masterId];
    if (a === 'stones') { ECO.earn(W, 1000, 'ของขวัญจากผู้สังเกตการณ์'); UI.toast('มอบศิลา 1,000'); }
    else if (a === 'food') { ECO.add(W, 'grain', 300); ECO.add(W, 'meal', 100); UI.toast('มอบเสบียงแล้ว'); }
    else if (a === 'raid') { if (W.threat.raid) UI.toast('กำลังมีศัตรูบุกอยู่'); else { EXPED.spawnRaid(W, 'bandit'); UI.close(); } }
    else if (a === 'beast') { if (W.threat.raid) UI.toast('กำลังมีศัตรูบุกอยู่'); else { EXPED.spawnRaid(W, 'beast'); UI.close(); } }
    else if (a === 'recruit') { const n = EXPED.recruitApplicants(W); UI.toast(n ? 'มีผู้สมัครใหม่ ' + n + ' คน' : 'หอพักเต็มหรือคิวเต็ม ไม่มีผู้สมัครใหม่'); }
    else if (a === 'banquet') { S.cd.banquet = 0; SECT.banquet(W, m); }
    else if (a === 'tourney') { if (!S.tournament) SECT.tournament(W, m); }
    else if (a === 'challenge') { const c = W.npcs.filter(n => !n.dead && !n.away && n.rank >= 3 && n.id !== m.id).sort((a, b) => CULT.power(b) - CULT.power(a))[0]; if (c) { W.duelQueue.push({ a: c.id, b: m.id, kind: 'leadership', serious: false }); W.log('challenge', c.h.name.given + ' ท้าชิงตำแหน่งเจ้าสำนักจาก ' + m.h.name.given + ' !', [c.id, m.id]); UI.close(); } }
    else if (a === 'heal') { W.npcs.forEach(n => { if (!n.dead) { n.h.state.hp = CULT.hpMax(n); n.inj = []; } }); UI.toast('รักษาทุกคนแล้ว'); }
  };

  /* ---------- บันทึก/โหลด ---------- */
  UI.slotInfo = () => { const out = {}; [1, 2, 3].forEach(i => { try { const m = localStorage.getItem('jhs_meta_' + i); if (m) out[i] = JSON.parse(m); } catch (e) { } }); return out; };
  UI.saveSlot = i => {
    try { UI.G.W.runtimeTiming = { pendingTicks: UI.G.acc || 0, speed: UI.G.speed }; UI.G.W.speed = UI.G.speed; const s = SIM.serialize(UI.G.W); localStorage.setItem('jhs_slot_' + i, s); const W = UI.G.W; localStorage.setItem('jhs_meta_' + i, JSON.stringify({ text: SIM.dateText(W.t) + ' · ' + W.npcs.filter(n => !n.dead).length + ' คน · ' + Math.round(s.length / 1024) + ' KB' })); UI.toast('บันทึกลงช่อง ' + i + ' แล้ว'); UI.render(); }
    catch (e) { UI.toast('บันทึกไม่สำเร็จ (พื้นที่เก็บเต็ม?) ลองส่งออกเป็นไฟล์แทน'); }
  };
  UI.loadSlot = i => { try { const s = localStorage.getItem('jhs_slot_' + i); if (!s) return; UI.G.load(s); UI.close(); UI.toast('โหลดช่อง ' + i + ' แล้ว'); } catch (e) { UI.toast('โหลดไม่สำเร็จ: ' + e.message); } };
  UI.exportFile = () => { UI.G.W.runtimeTiming = { pendingTicks: UI.G.acc || 0, speed: UI.G.speed }; UI.G.W.speed = UI.G.speed; const s = SIM.serialize(UI.G.W); const blob = new Blob([s], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'jianghu_sect_' + UI.G.W.seed + '_y' + SIM.calendar(UI.G.W.t).year + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); UI.toast('ส่งออกไฟล์แล้ว'); };

  /* ---------- หน้าเริ่มเกม ---------- */
  UI.showStart = (seed) => {
    const st = $('start'); st.classList.remove('hidden'); seed = seed || String(Math.floor(Math.random() * 90000 + 10000));
    const cands = SIM.candidates(seed);
    let h = '<h1>🏯 สำนักเมฆาหยก</h1><div class="sub">เกมจำลองสำนักยุทธภพ · NPC ทุกคนคิดและใช้ชีวิตเอง<br>เลือก “เจ้าสำนัก” ผู้กำหนดชะตาสำนัก — นิสัยของเขาจะเปลี่ยนนโยบาย การแต่งตั้ง และบรรยากาศทั้งสำนักจริง ๆ</div>';
    cands.forEach(c => {
      const n = c.npc, s = c.style; const top = Object.keys(s.focus).sort((a, b) => s.focus[b] - s.focus[a])[0];
      h += '<div class="cand"><div class="top">' + portraitHtml(n, 64) + '<div><div class="nm">' + esc(c.name) + '</div><div class="muted">' + esc(c.age) + ' · ' + esc(CULT.stageName(n)) + '</div><div class="muted">' + esc(c.identity.title) + '</div></div></div><div style="margin-top:6px">' + c.identity.tags.map(t => '<span class="chip v">' + esc(t) + '</span>').join('') + '</div>';
      h += '<div style="margin-top:6px">' + ['openness', 'strictness', 'meritocracy', 'expansion', 'generosity', 'secrecy'].map(k => bar(SECT.POLICY_TH[k], s[k], { wide: true, color: '#4fb2f2', txt: SECT.policyLabel(k, s[k]) })).join('') + '</div><div class="muted">จะผลักสำนักไปทาง: <b style="color:var(--gold)">' + esc(SECT.FOCUS_TH[top]) + '</b> · สนใจ' + c.identity.loves.map(esc).join(' / ') + '</div>';
      h += '<button class="btn pri" data-pick="' + c.idx + '">เลือกท่านนี้เป็นเจ้าสำนัก</button></div>';
    });
    h += '<div class="row" style="gap:8px;margin:10px 0"><button id="stReroll" style="flex:1">🎲 สุ่มผู้สมัครชุดใหม่</button><button id="stLoad" style="flex:1">📂 โหลดเกมที่บันทึก</button></div>' + (hasAuto() ? '<button id="stAuto" class="btn pri" style="width:100%;margin:0 0 8px">▶ เล่นต่อจากออโตเซฟ (' + esc(localStorage.getItem('jhs_auto_meta') || '') + ')</button>' : '') + '<div class="muted" style="text-align:center">เมล็ดโลก ' + esc(seed) + ' (เมล็ดเดียวกัน = โลกเดียวกัน)</div>';
    st.innerHTML = h; drawPortraitsCands(st, cands);
    st.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => { st.classList.add('hidden'); UI.G.newGame(seed, +b.dataset.pick); });
    if ($('stAuto')) $('stAuto').onclick = () => { try { UI.G.load(localStorage.getItem('jhs_auto')); st.classList.add('hidden'); } catch (e) { UI.toast('โหลดออโตเซฟไม่ได้: ' + e.message); } };
    $('stReroll').onclick = () => UI.showStart(); $('stLoad').onclick = () => { st.classList.add('hidden'); UI.open('menu'); };
    st.scrollTop = 0;
  };
  function hasAuto() { try { return !!localStorage.getItem('jhs_auto'); } catch (e) { return false; } }
  function drawPortraitsCands(root, cands) { root.querySelectorAll('canvas.pt').forEach((cv, i) => { Render.portrait(cv, cands[i].npc, +cv.dataset.size); }); }

  UI.init = G => {
    UI.G = G; UI.buildHud();
    const f = document.createElement('input'); f.type = 'file'; f.id = 'impFile'; f.accept = '.json,application/json'; f.style.display = 'none'; document.body.appendChild(f);
    f.onchange = () => { const file = f.files[0]; if (!file) return; const r = new FileReader(); r.onload = () => { try { G.load(r.result); $('start').classList.add('hidden'); UI.close(); UI.toast('นำเข้าไฟล์สำเร็จ'); } catch (e) { UI.toast('ไฟล์ไม่ถูกต้อง: ' + e.message); } }; r.readAsText(file); f.value = ''; };
  };
  g.UI = UI;
  if (typeof module === "object" && module.exports) module.exports = UI;
})(typeof globalThis !== 'undefined' ? globalThis : this);
