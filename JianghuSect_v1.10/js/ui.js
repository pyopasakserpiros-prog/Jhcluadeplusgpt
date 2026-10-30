/* ui.js — หน้าจอ: HUD, แผ่นข้อมูล (people/sect/log/world/edit/menu/npc/building), หน้าเลือกเจ้าสำนัก, บันทึก/โหลด */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, CULT = g.CULT, SECT = g.SECT, ECO = g.ECO, AI = g.AI, MAP = g.MAP, SIM = g.SIM, EXPED = g.EXPED, JD = g.JD, Render = g.Render;
  const clamp = U.clamp;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const UI = { G: null, sheet: null, tab: null, lastHud: 0, logSubFilter: 'all', editNpcId: null, editStatGroup: 'personality', editDraft: null, spawnDest: 'sect', spawnSearch: '', spawnKind: 'ALL', spawnTier: 'ALL', spawnQty: 1, spawnQuality: 1, stockSearch: '', stockType: 'ALL', stockTier: 'ALL', stockSort: 'qty', bagSearch: '', bagType: 'ALL', bagSort: 'tier' };
  const SPEEDS = [[0, '⏸'], [1, '1×'], [2, '2×'], [4, '4×'], [8, '8×'], [16, '16×'], [32, '32×'], [48, '48×']];
  UI.SPEEDS = SPEEDS.map(s => s[0]);

  const LOG_GROUPS = {
    all: ['ทั้งหมด', null],
    people: ['👥 ผู้คน', ['relation', 'marriage', 'recruit', 'death', 'injury', 'heal', 'awaken', 'desert', 'disciple', 'punish', 'expel']],
    combat: ['⚔️ ต่อสู้/ล่า', ['combat', 'hunt', 'beast', 'explore', 'raid', 'duel', 'spar', 'tournament', 'conflict', 'challenge']],
    craft: ['⚗️ การผลิต', ['craft', 'harvest', 'alchemy', 'forge', 'organ', 'learn', 'research', 'insight', 'breakthrough']],
    economy: ['🪙 เศรษฐกิจ', ['economy', 'trade', 'finance', 'shop', 'gear', 'welfare', 'donation', 'surplus', 'shortage', 'salary']],
    building: ['🏯 อาคาร', ['build', 'building', 'decision', 'appoint', 'dismiss', 'promote', 'demote', 'succession', 'politics', 'scandal', 'crisis', 'banquet', 'seclusion', 'system']],
    major: ['⭐ สำคัญ', ['death', 'breakthrough', 'succession', 'crisis', 'raid', 'challenge', 'tournament', 'marriage', 'expel', 'build']]
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
    if (UI.sheet === kind && kind !== 'npc' && kind !== 'edit') { UI.close(); return; }
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
    else if (kind === 'menu') show('menu', UI.G.W ? '⚙️ เมนู' : '📂 โหลดเกมที่บันทึก', UI.G.W ? [['main', 'เกม'], ['set', 'ตั้งค่า'], ['tools', 'ผู้สังเกตการณ์'], ['about', 'เกี่ยวกับ']] : [], 'main');
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
    show('npc', esc(HC.fullName(n)) + ' <span class="muted" style="font-weight:400">' + SECT.title(n) + '</span>', [['ov', 'ภาพรวม'], ['self', 'ตัวตน'], ['body', 'กาย'], ['mind', 'ปัญญา/สังคม'], ['skill', 'ทักษะ'], ['rel', 'ความสัมพันธ์'], ['life', 'ชีวิต'], ['cmp', 'เทียบกับ…']], tab || 'ov', true);
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
    else if (a === 'spawn-item') {
      const [kind, id] = String(arg || '').split('|');
      const qtyEl = $('shBody').querySelector('#spawnQty');
      const qualEl = $('shBody').querySelector('#spawnQuality');
      const qty = qtyEl ? +qtyEl.value : (UI.spawnQty || 1);
      const quality = qualEl ? +qualEl.value : (UI.spawnQuality || 1);
      const res = SECT.EDITOR.spawnItem(W, {
        kind,
        id,
        dest: UI.spawnDest || 'sect',
        npcId: UI.editNpcId,
        qty,
        quality
      });
      UI.toast(res.ok ? ('เสก ' + res.nameTh + ' ×' + res.qty + ' สำเร็จ') : ('เสกไม่สำเร็จ: ' + res.reason));
      UI.render();
      UI.updateHud(true);
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
    body.innerHTML = html; drawPortraits(body); body.scrollTop = keepScroll;
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

    // Personal bag filters
    const bgSearch = body.querySelector('#bagSearch');
    if (bgSearch) bgSearch.oninput = () => { UI.bagSearch = bgSearch.value; UI.render(); const el = $('shBody').querySelector('#bagSearch'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
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

    // Spawn filters
    const spDest = body.querySelector('#spawnDest');
    if (spDest) spDest.onchange = () => { UI.spawnDest = spDest.value; UI.render(); };
    const spSearch = body.querySelector('#spawnSearch');
    if (spSearch) spSearch.oninput = () => { UI.spawnSearch = spSearch.value; UI.render(); const el = $('shBody').querySelector('#spawnSearch'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
    const spKind = body.querySelector('#spawnKind');
    if (spKind) spKind.onchange = () => { UI.spawnKind = spKind.value; UI.render(); };
    const spTier = body.querySelector('#spawnTier');
    if (spTier) spTier.onchange = () => { UI.spawnTier = spTier.value; UI.render(); };
    const spQty = body.querySelector('#spawnQty');
    if (spQty) spQty.onchange = () => { UI.spawnQty = Math.max(1, Math.min(50000, Math.floor(+spQty.value || 1))); };
    const spQual = body.querySelector('#spawnQuality');
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

  /* ----- Helper: Build Filtered Sect Stock Rows (Read-Only) ----- */
  function buildSectStockItems(W) {
    const S = W.sect;
    const rows = [];
    const getRes = id => (g.EXT && g.EXT.reserveForSect) ? g.EXT.reserveForSect(W, id) : (ECO.reserveFloor ? ECO.reserveFloor(W, id) : 2);
    // Provisions
    ['grain', 'meal'].forEach(id => {
      const qty = ECO.count(W, id);
      if (qty > 0) {
        const res = getRes(id);
        rows.push({ kind: 'PROVISION', kindTh: 'เสบียง', id, nameTh: ECO.name(id), tier: 1, qty, resFloor: res, statusTh: qty > res ? 'เพียงพอ (สำรอง ' + res + ')' : 'สำรองจำเป็น (' + qty + '/' + res + ')' });
      }
    });
    // Stock pills & materials
    Object.keys(S.stock || {}).forEach(id => {
      if (id === 'grain' || id === 'meal') return;
      const qty = ECO.count(W, id);
      if (qty <= 0) return;
      const res = getRes(id);
      if (ECO.isPill(id)) {
        const info = ECO.pillInfo(id) || {};
        rows.push({ kind: 'PILL', kindTh: 'โอสถ', id, nameTh: ECO.name(id), tier: info.tier || 1, qty, resFloor: res, statusTh: qty > res ? 'เกินสำรอง ' + (qty - res) + ' (พร้อมจัดสรร/ขาย)' : 'สำรองคลัง (' + qty + '/' + res + ')' });
      } else {
        const m = ECO.matById[id] || {};
        rows.push({ kind: 'MATERIAL', kindTh: 'วัตถุดิบ', id, nameTh: ECO.name(id), tier: m.tier || 1, qty, resFloor: res, statusTh: qty > res ? 'ส่วนเกิน +' + (qty - res) : 'สำรองหอผลิต (' + qty + '/' + res + ')' });
      }
    });
    // Equipment
    (S.gear || []).forEach(eq => {
      if (!eq) return;
      const qVal = (g.VC && g.VC.gearQuality) ? g.VC.gearQuality(eq) : (eq.q || eq.quality || 1);
      rows.push({ kind: 'EQUIPMENT', kindTh: eq.legendary ? 'ศาสตราตำนาน' : 'อุปกรณ์', id: eq.uid || eq.id, nameTh: (eq.legendary ? '★ ' : '') + eq.nameTh, tier: eq.tier || 1, qty: 1, resFloor: 1, statusTh: 'ช่อง ' + (eq.slot || '-') + ' · คุณภาพ ' + Math.round(qVal * 100) + '%' });
    });
    // Crystals
    Object.keys(S.crystals || {}).forEach(subId => {
      const qty = S.crystals[subId] || 0;
      if (qty <= 0) return;
      const rawSub = subId.startsWith('S:') ? subId.slice(2) : subId; const subObj = CULT.subList.find(x => x.sub.id === rawSub);
      rows.push({ kind: 'CRYSTAL', kindTh: 'ผลึกสายย่อย', id: subId, nameTh: 'ผลึก「' + (subObj ? subObj.sub.nameTh : subId) + '」', tier: 3, qty, resFloor: 0, statusTh: 'พร้อมมอบให้ศิษย์วิถี ' + (subObj ? subObj.path : '') });
    });
    // Organs
    Object.keys(S.organs || {}).forEach(oid => {
      const qty = S.organs[oid] || 0;
      if (qty <= 0) return;
      const o = g.CONTENT && g.CONTENT.organById && g.CONTENT.organById[oid];
      rows.push({ kind: 'ORGAN', kindTh: 'อวัยวะอสูร', id: oid, nameTh: o ? o.nameTh : oid, tier: o ? o.tier : 2, qty, resFloor: 0, statusTh: 'วัตถุดิบวิจัย/หลอมสกัด' });
    });
    return rows;
  }

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

      // Searchable & Filterable Sect Stock Browser
      let stockRows = buildSectStockItems(W);
      const sq = (UI.stockSearch || '').trim().toLowerCase();
      if (sq) stockRows = stockRows.filter(r => r.nameTh.toLowerCase().includes(sq) || String(r.id).toLowerCase().includes(sq));
      if (UI.stockType && UI.stockType !== 'ALL') stockRows = stockRows.filter(r => r.kind === UI.stockType);
      if (UI.stockTier && UI.stockTier !== 'ALL') stockRows = stockRows.filter(r => r.tier === +UI.stockTier);
      if (UI.stockSort === 'tier') stockRows.sort((a, b) => b.tier - a.tier || b.qty - a.qty);
      else if (UI.stockSort === 'name') stockRows.sort((a, b) => a.nameTh.localeCompare(b.nameTh));
      else stockRows.sort((a, b) => b.qty - a.qty || b.tier - a.tier);

      h += '<h3>🔎 ค้นหาและคัดกรองคลังสำนัก (' + stockRows.length + ' รายการ)</h3><div class="card">';
      h += '<div class="edit-grid" style="margin-bottom:8px">';
      h += '<input id="stockSearch" type="search" placeholder="ค้นหาชื่อไอเทมในคลัง…" value="' + esc(UI.stockSearch || '') + '">';
      h += '<select id="stockType">' + [['ALL', 'ทุกประเภท'], ['PROVISION', 'เสบียง'], ['PILL', 'โอสถ'], ['MATERIAL', 'วัตถุดิบ'], ['EQUIPMENT', 'อุปกรณ์'], ['CRYSTAL', 'ผลึกสายย่อย'], ['ORGAN', 'อวัยวะอสูร']].map(([k, v]) => '<option value="' + k + '"' + (UI.stockType === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select>';
      h += '<select id="stockTier">' + [['ALL', 'ทุกระดับ'], ['1', 'ระดับ 1'], ['2', 'ระดับ 2'], ['3', 'ระดับ 3'], ['4', 'ระดับ 4'], ['5', 'ระดับ 5'], ['6', 'ระดับ 6'], ['7', 'ระดับ 7']].map(([k, v]) => '<option value="' + k + '"' + (UI.stockTier === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select>';
      h += '<select id="stockSort">' + [['qty', 'เรียงตามจำนวน'], ['tier', 'เรียงตามระดับ'], ['name', 'เรียงตามชื่อ']].map(([k, v]) => '<option value="' + k + '"' + (UI.stockSort === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select>';
      h += '</div>';
      h += stockRows.length ? stockRows.slice(0, 60).map(r => '<div class="logrow"><span><span class="chip">' + esc(r.kindTh) + ' T' + r.tier + '</span> <b>' + esc(r.nameTh) + '</b> ×' + r.qty + '</span><span class="muted">' + esc(r.statusTh) + '</span></div>').join('') : '<div class="muted">ไม่พบไอเทมในคลังที่ตรงกับเงื่อนไขการค้นหา</div>';
      h += '</div>';

      ['alchemy', 'forge'].forEach(hh => { const o = S.orders && S.orders[hh]; const r = o ? ECO.recipeById[o.rid] : null; h += '<div class="card">' + (hh === 'alchemy' ? '⚗️ หอโอสถกำลังผลิต: ' : '🔨 โรงหลอมกำลังผลิต: ') + (r ? '<b>' + esc(r.outNameTh) + '</b> <span class="muted">(' + esc(o.why || '') + ')</span>' : '<span class="muted">ไม่มีคำสั่ง/วัตถุดิบไม่พอ</span>') + '</div>'; });
      const pills = Object.keys(S.stock).filter(k => ECO.isPill(k)).map(k => [k, S.stock[k]]); h += '<h3>โอสถ</h3><div class="card">' + (pills.length ? pills.map(p => '<span class="chip ok">' + esc(ECO.name(p[0])) + ' ×' + p[1] + '</span>').join('') : '<span class="muted">ไม่มี</span>') + '</div>';
      const mats = Object.keys(S.stock).filter(k => !ECO.isPill(k) && k !== 'grain' && k !== 'meal').map(k => [k, S.stock[k]]).sort((a, b) => b[1] - a[1]); h += '<h3>วัตถุดิบ</h3><div class="card">' + (mats.length ? mats.slice(0, 60).map(p => '<span class="chip">' + esc(ECO.name(p[0])) + ' ×' + p[1] + '</span>').join('') : '<span class="muted">ไม่มี</span>') + '</div>';
      const gears = S.gear.slice(0, 30); h += '<h3>อุปกรณ์ในคลัง</h3><div class="card">' + (gears.length ? gears.map(x => '<span class="chip b">' + esc(x.nameTh) + ' · ' + esc(g.MARTIAL.TYPES[g.MARTIAL.gearType(x)]) + '</span>').join('') : '<span class="muted">ไม่มี</span>') + '</div>';
      const led = S.ledger.slice(-14).reverse(); h += '<h3>บัญชีล่าสุด</h3><div class="card">' + led.map(l => '<div class="logrow"><span class="tm">' + dayStamp(l.t) + '</span><b style="color:' + (l.amt >= 0 ? '#5fd38a' : '#e0584a') + '">' + (l.amt >= 0 ? '+' : '') + l.amt + '</b> ' + esc(l.why) + '</div>').join('') + '</div>';
    } else if (tab === 'shop') {
      const c = g.CPE.S(W), al = W.npcs.filter(n => !n.dead && !n.exiled), tot = al.reduce((a, n) => a + (n.cp || 0), 0), tr = SECT.holder(W, 'treasury');
      const recent = (c.hist || []).slice(-30), minted30 = recent.reduce((a, x) => a + (x.mint || 0), 0), burned30 = recent.reduce((a, x) => a + (x.burn || 0), 0);
      const flowLabel = minted30 > burned30 * 1.25 ? 'แต้มกำลังเพิ่มเร็ว' : burned30 > minted30 * 1.1 ? 'แต้มกำลังถูกใช้มาก' : 'แต้มหมุนเวียนใกล้สมดุล';
      h += '<div class="card"><b>🛒 ร้านค้าสำนัก & แต้มคุณูปการ (คป.)</b><div class="muted">สำนักเสกแต้มจ่ายเป็นค่าตอบแทน แต้มมีค่าเพราะแลกของ/วิชาที่ต้องหามาจากข้างนอกได้ การเรียนวิชา ซื้อสินค้า และขอคำชี้แนะจะเผาแต้มออกจากระบบ</div><div class="grid2"><div>แต้มรวมที่ถือ <b>' + U.fmtNum(Math.round(tot)) + '</b></div><div>เฉลี่ย/คน <b>' + Math.round(tot / Math.max(1, al.length)) + '</b></div><div>เสกสะสม <b>' + U.fmtNum(Math.round(c.minted)) + '</b></div><div>เผาสะสม <b>' + U.fmtNum(Math.round(c.burned)) + '</b></div><div>แต้มหมุนเวียน <b>' + U.fmtNum(Math.round(c.circulation || tot)) + '</b></div><div>แต้มปลดเกษียณ <b>' + U.fmtNum(Math.round(c.retired || 0)) + '</b></div><div>สกัดอาร์บิทราจ <b>' + (c.arbitrageBlocked || 0) + ' ครั้ง</b></div><div>ดัชนีราคา <b>×' + c.price.toFixed(2) + '</b></div><div>กำไรร้าน <b>×' + c.markup.toFixed(2) + '</b></div><div>แจกสวัสดิการแล้ว <b>' + c.welfareGiven + '</b></div><div>ขายแล้ว <b>' + c.sales + '</b> · ค่าวิชา <b>' + Math.round(c.techSales) + '</b></div><div>บริการชี้แนะ <b>' + (c.studyServices || 0) + ' ครั้ง</b></div><div>เผาค่าชี้แนะ <b>' + U.fmtNum(Math.round(c.studyFees || 0)) + ' คป.</b></div><div>ฝึกปราณแบบเสียแต้ม <b>' + (c.trainingServices || 0) + ' ครั้ง</b></div><div>เผาค่าฝึกปราณ <b>' + U.fmtNum(Math.round(c.trainingFees || 0)) + ' คป.</b></div><div>ขอสิทธิ์ตำรับ <b>' + (c.recipeAuthorizations || 0) + ' ครั้ง</b></div><div>เผาค่าสิทธิ์ตำรับ <b>' + U.fmtNum(Math.round(c.recipeFees || 0)) + ' คป.</b></div></div><div class="muted">30 วันล่าสุด: เสก ' + Math.round(minted30) + ' · เผา ' + Math.round(burned30) + ' · ' + flowLabel + '</div>' + (tr ? '<div class="muted">ผู้ดูแลคลัง: ' + esc(HC.fullName(tr)) + ' · ความใจกว้าง ' + Math.round(c.welfare * 100) + '%</div>' : '') + '</div>';
      const need = g.JD.CP.BASIC.map(r => 'P:' + r.id);
      h += '<h3>โอสถพื้นฐาน 8 สูตร (หลอมให้สำนัก แจกเป็นสวัสดิการ/ขาย)</h3><div class="card">' + need.map(k => { const sc = g.CPE.scarcity(W, k); return '<div class="logrow"><span>' + esc(ECO.name(k)) + ' ×' + ECO.count(W, k) + '</span><b style="color:' + (sc > 1.3 ? '#e0584a' : sc < 0.8 ? '#7aa' : '#5fd38a') + '">ขาย ' + g.CPE.priceOf(W, k) + ' · รับบริจาค ' + Math.round(g.CPE.reward(W, k, 1)) + ' คป.</b></div>'; }).join('') + '</div>';
      const herbs = ['MAT_HERB_DEW_GRASS_1', 'MAT_HERB_JADE_LOTUS_2', 'MAT_HERB_BLOOD_GINSENG_3']; h += '<h3>ป้ายรับซื้อ (ค่าบริจาคตามความขาด)</h3><div class="card">' + herbs.map(k => '<div class="logrow"><span>' + esc(ECO.name(k)) + ' ในคลัง ' + ECO.count(W, k) + '</span><b>' + Math.round(g.CPE.reward(W, k, 1)) + ' คป./หน่วย</b></div>').join('') + '</div>';
      h += UI.martialShop(W);
      const shop = g.CPE.shopItems(W).filter(i => i.kind !== 'crystal').filter(i => !(i.kind === 'pill' && i.key.startsWith('P:BASIC'))).slice(0, 24);
      h += '<h3>โอสถและอุปกรณ์พรีเมียม (แลกซื้อด้วย คป. · ไม่อยู่ในสวัสดิการแจกฟรี)</h3><div class="card">';
      h += '<div class="muted" style="margin-bottom:6px">🛡️ โอสถนำเข้าและวิชาพิเศษต้องแลกซื้อด้วยแต้มคุณูปการ (คป.) เท่านั้น จะไม่มีการแจกฟรีเป็นสวัสดิการพื้นฐาน เพื่อรักษาสมดุลคลังสำนัก</div>';
      h += (shop.length ? shop.map(i => '<span class="chip ' + (i.kind === 'gear' ? 'b' : 'ok') + '">' + esc(i.kind === 'gear' ? i.gear.nameTh : ECO.name(i.key) + ' ×' + i.n) + ' · ' + i.price + ' คป.</span>').join('') : '<span class="muted">ยังไม่มีสินค้าพรีเมียม — ผลิตจากหอโอสถ/โรงหลอม หรือนำกลับจากการเดินทาง</span>') + '</div>';
      const tl = W.sect.library.map(id => CULT.tech(id)).filter(t => t && !g.CPE.techFree(W, t)).sort((a, b) => a.tier - b.tier).slice(0, 14); h += '<h3>วิชาที่ต้องใช้แต้มเรียน (วิชาพื้นฐานเรียนฟรี)</h3><div class="card">' + (tl.length ? tl.map(t => '<span class="chip b">' + esc(t.nameTh) + ' ระดับ' + t.tier + ' · ' + g.CPE.techPrice(W, t) + '</span>').join('') : '<span class="muted">ไม่มี</span>') + '</div>';
      h += '<h3>บันทึกคุณูปการ</h3><div class="card">' + (c.log.slice(-12).reverse().map(l => '<div class="logrow"><span class="tm">' + dayStamp(l.t) + '</span>' + esc(l.text) + '</div>').join('') || '<span class="muted">ยังไม่มี</span>') + '</div>';
      if (g.EXT) {
        const ext = g.EXT, visitors = ext.activeVisitors(W), stats = (W.world && W.world.marketStats) || {}, history = (W.world.tradeHistory || []).slice(-8).reverse();
        h += '<h3>🪙 ตลาดภายนอก · ใช้หินวิญญาณ</h3><div class="card"><div class="muted">สมาชิกซื้อขายกับสำนักด้วยแต้มคุณูปการ ส่วนการค้ากับพ่อค้าภายนอกใช้หินวิญญาณและตัดสต็อกจริง</div>';
        h += '<div class="grid2"><div>หินวิญญาณสำนัก <b>' + U.fmtNum(Math.round(S.stones)) + '</b></div><div>จำนวนผู้มาเยือนสะสม <b>' + (stats.visits || 0) + '</b></div><div>สำนักซื้อจากคนนอก <b>' + (stats.sectBought || 0) + ' หน่วย</b></div><div>สำนักขายให้คนนอก <b>' + (stats.sectSold || 0) + ' หน่วย</b></div><div>เงินจ่ายซื้อเข้า <b>' + U.fmtNum(stats.sectStonesOut || 0) + ' ศิลา</b></div><div>เงินรับจากขายออก <b>' + U.fmtNum(stats.sectStonesIn || 0) + ' ศิลา</b></div></div></div>';
        if (visitors.length) {
          h += '<h3>พ่อค้าที่กำลังแวะสำนัก</h3>' + visitors.map(v => {
            const stock = Object.keys(v.stock || {}).filter(k => v.stock[k] > 0).slice(0, 5).map(k => esc(ECO.name(k)) + ' ×' + v.stock[k] + ' · ' + ext.quotePrice(W, k, 'member-buy') + ' ศิลา').join(' · ');
            const wants = Object.keys(v.wants || {}).filter(k => v.wants[k] > 0).slice(0, 5).map(k => esc(ECO.name(k)) + ' ×' + v.wants[k]).join('、');
            return '<div class="card"><b>' + esc(v.nameTh) + '</b> <span class="chip">อยู่ได้อีก ' + Math.max(0, v.untilDay - W.day + 1) + ' วัน</span><div class="sub">เงินทุน ' + U.fmtNum(v.stones) + ' ศิลา</div><div class="sub">เสนอขาย: ' + (stock || 'สินค้าหมด') + '</div><div class="sub">รับซื้อ: ' + (wants || 'ไม่มีความต้องการคงเหลือ') + '</div></div>';
          }).join('');
        } else h += '<div class="card muted">ไม่มีพ่อค้าอยู่ในขณะนี้ · ผู้มาเยือนจะเข้ามาตามชื่อเสียงสำนัก นโยบายเปิดรับ และสภาพเส้นทาง</div>';
        h += '<h3>ธุรกรรมภายนอกล่าสุด</h3><div class="card">' + (history.length ? history.map(t => '<div class="logrow"><span class="tm">วันที่ ' + t.day + '</span><span>' + (t.side === 'sect-buy' ? 'สำนักซื้อ' : t.side === 'sect-sell' ? 'สำนักขาย' : t.side === 'member-buy' ? esc(t.npcName || 'สมาชิก') + ' ซื้อ' : esc(t.npcName || 'สมาชิก') + ' ขาย') + esc(ECO.name(t.itemId)) + ' ×' + t.qty + ' กับ' + esc(t.traderName) + '</span><b>' + t.total + ' ศิลา</b></div>').join('') : '<span class="muted">ยังไม่มีการซื้อขายภายนอก</span>') + '</div>';
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
    h += '<button class="btn pri" data-do="locb" data-arg="' + b.id + '">📍 ไปที่อาคารนี้</button>';
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
    if (!g.VC) return '<div class="muted">ไม่พบโมดูลเบาะแส</div>';
    const cs = g.VC.ensure(W);
    const activeList = Object.values(cs.active || {}).sort((a, b) => (b.rarity === 'Legendary' ? 1 : 0) - (a.rarity === 'Legendary' ? 1 : 0) || b.createdDay - a.createdDay);
    const claimedReceipts = Object.values(W.world.claimReceipts || {});
    const uniqueArts = Object.values(W.world.uniqueArtifacts || {});

    let h = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px"><b>🗺️ เบาะแส ข่าวลือ และมรดกยุทธภพ (Living Clues & Inheritance)</b><button class="btn" style="padding:3px 8px;font-size:11px" data-do="toggle-clue-debug">' + (UI.showClueDebug ? '🙈 ซ่อนโหมดผู้สังเกตการณ์ (Debug)' : '👁️ เปิดโหมดผู้สังเกตการณ์ (Debug)') + '</button></div>';
    h += '<div class="muted" style="margin-top:4px">ศิษย์ตัดสินใจสืบเบาะแสจากความเชื่อมั่น การยืนยันจากหลายแหล่ง และความพร้อมของตนเอง (ไม่ล่วงรู้ความจริงของโลกจนกว่าจะพิสูจน์)</div>';
    const fn = cs.funnel || {};
    h += '<div class="grid2" style="margin-top:6px"><div>ข่าวลือที่ได้รับ <b>' + (fn.rumorsSpawned || 0) + '</b></div><div>แบ่งปันในสำนัก <b>' + (fn.cluesShared || 0) + '</b></div><div>ออกสืบเบาะแส <b>' + (fn.investigationsStarted || 0) + '</b></div><div>ผ่านด่านทดสอบ <b>' + (fn.nodesPassed || 0) + '</b></div><div>คว้ามรดกสำเร็จ <b>' + (fn.rewardsClaimed || 0) + '</b></div><div>ข่าวลือเท็จที่พิสูจน์แล้ว <b>' + (fn.falseRumorsDisproven || 0) + '</b></div></div></div>';

    if (uniqueArts.length) {
      h += '<h3>🗡️ ศาสตราวุธระดับตำนานที่ปรากฏในโลกแล้ว (' + uniqueArts.length + '/11)</h3><div class="card">';
      h += uniqueArts.map(ua => {
        const wDef = g.VC.LEGENDARY_WEAPON_BY_ID && g.VC.LEGENDARY_WEAPON_BY_ID[ua.itemId];
        return '<div class="logrow"><span><span class="chip g">★ ตำนาน T7</span> <b>' + esc(wDef ? wDef.nameTh : ua.itemId) + '</b>' + (wDef && wDef.chineseName ? ' <span class="muted">(' + esc(wDef.chineseName) + ')</span>' : '') + '</span><span class="muted">ผู้ถือครอง: <b>' + esc(ua.ownerNameTh || ua.ownerKind) + '</b></span></div>';
      }).join('');
      h += '</div>';
    }

    h += '<h3>🧭 เบาะแสและสายสืบค้นทั้งหมด (' + activeList.length + ')</h3>';
    if (!activeList.length) {
      h += '<div class="card muted">ยังไม่มีเบาะแสที่รับรู้ในสำนัก — ผู้มาเยือน การพูดคุยกับสำนักพันธมิตร และการออกสำรวจจะค่อย ๆ นำข่าวลือเข้ามา</div>';
    } else {
      h += activeList.map(inst => {
        const tpl = g.VC.TEMPLATE_BY_ID[inst.templateId] || {};
        const step = (tpl.steps || [])[inst.currentNodeIdx || 0];
        const knowers = Object.keys(inst.knownBy || {}).map(id => W.byId[id]).filter(Boolean);
        const avgConf = knowers.length ? Math.round(knowers.reduce((s, n) => s + ((inst.knownBy[n.id] && inst.knownBy[n.id].confidence) || 55), 0) / knowers.length) : 55;
        const stCol = inst.status === 'claimed' ? 'ok' : inst.status === 'disproven' ? 'r' : inst.status === 'in_progress' ? 'b' : 'g';
        const stTh = { active: 'กำลังเปิดสืบค้น', in_progress: 'กำลังส่งคนไปสืบ', claimed: 'ได้รับมรดกแล้ว', disproven: 'พิสูจน์แล้วว่าเป็นข่าวลือเท็จ', expired: 'พ้นกำหนดเวลา' }[inst.status] || inst.status;
        let card = '<div class="card" style="cursor:pointer" data-clue="' + esc(inst.instanceId) + '">';
        card += '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap"><b>' + (tpl.rarity === 'Legendary' ? '★ ' : '🗺️ ') + esc(inst.titleTh) + '</b><span class="chip ' + stCol + '">' + esc(stTh) + '</span></div>';
        card += '<div class="sub" style="margin-top:3px">' + esc(inst.rumorTextTh || '') + '</div>';
        card += '<div class="muted" style="font-size:11.5px;margin-top:4px">ผู้รับรู้ในสำนัก (' + knowers.length + '): ' + (knowers.length ? knowers.slice(0, 5).map(n => esc(n.h.name.given)).join('、') : 'คลังข่าวสารสำนัก') + ' · ความเชื่อมั่นเฉลี่ย <b>' + avgConf + '%</b> · แหล่งข่าวอิสระ <b>' + ((inst.corroboratingRoots || []).length) + ' แหล่ง</b></div>';
        if (step && inst.status !== 'claimed' && inst.status !== 'disproven') {
          const scopeTh = step.scope === 'personal' ? '👤 ทดสอบเฉพาะตัวผู้สืบทอด' : step.scope === 'party_all' ? '👥 ทดสอบร่วมกันทั้งคณะ' : '🤝 สมาชิกในคณะช่วยกันได้';
          card += '<div style="margin-top:4px;font-size:12px">↳ <b>ขั้นที่ ' + ((inst.currentNodeIdx || 0) + 1) + '/' + (tpl.steps ? tpl.steps.length : 1) + ':</b> ' + esc(step.titleTh) + ' <span class="chip">' + scopeTh + '</span></div>';
        }
        if (inst.lastActionReasonTh) {
          card += '<div class="muted" style="font-size:11.5px;margin-top:3px;color:var(--gold)">📌 สถานะล่าสุด: ' + esc(inst.lastActionReasonTh) + '</div>';
        }
        if (UI.showClueDebug) {
          card += '<div style="margin-top:5px;padding:4px 6px;background:rgba(255,215,100,0.08);border:1px dashed var(--gold);font-size:11px">🔍 <b>[Debug World Truth]</b> template=<code>' + esc(inst.templateId) + '</code> · truth=<b>' + esc(inst.truthState) + '</b> · target=<code>' + esc(tpl.targetKind + ':' + tpl.targetId) + '</code> · rootRumorId=<code>' + esc(inst.rootRumorId) + '</code></div>';
        }
        card += '</div>';
        return card;
      }).join('');
    }
    return h;
  };

  UI.rClueDetail = () => {
    const W = UI.G.W;
    const cs = g.VC && g.VC.ensure ? g.VC.ensure(W) : null;
    const inst = cs && (cs.active[UI.clueId] || (cs.history || []).find(x => x.instanceId === UI.clueId));
    if (!inst) return '<div class="muted">ไม่พบข้อมูลเบาะแส</div>';
    const tpl = (g.VC && g.VC.TEMPLATE_BY_ID && g.VC.TEMPLATE_BY_ID[inst.templateId]) || {};
    const knowers = Object.entries(inst.knownBy || {});
    let h = '<div class="card"><div style="font-size:16px;font-weight:700">' + (tpl.rarity === 'Legendary' ? '★ ' : '🗺️ ') + esc(inst.titleTh) + '</div>';
    h += '<div class="sub" style="margin-top:4px">' + esc(inst.rumorTextTh || '') + '</div>';
    h += '<div class="muted" style="margin-top:4px">สถานะ: <b>' + esc(inst.status) + '</b> · บันทึกเข้าหอคัมภีร์สำนัก: <b>' + (inst.reportedToSect ? 'บันทึกแล้ว' : 'รู้เฉพาะตัว') + '</b> · แหล่งข่าวต้นตออิสระ: <b>' + ((inst.corroboratingRoots || []).length) + ' แหล่ง</b></div>';
    if (inst.lastActionReasonTh) h += '<div style="margin-top:6px;color:var(--gold)">📌 <b>ความคืบหน้าล่าสุด:</b> ' + esc(inst.lastActionReasonTh) + '</div>';
    h += '</div>';

    if (tpl.steps && tpl.steps.length) {
      h += '<h3>🪜 ลำดับขั้นการสืบค้นและบททดสอบ (' + tpl.steps.length + ' ขั้น)</h3><div class="card">';
      h += tpl.steps.map((st, idx) => {
        const done = idx < (inst.currentNodeIdx || 0) || inst.status === 'claimed';
        const cur = idx === (inst.currentNodeIdx || 0) && inst.status !== 'claimed' && inst.status !== 'disproven';
        const scopeTh = st.scope === 'personal' ? 'ทดสอบเฉพาะบุคคล (เพื่อนร่วมทีมแบกแทนไม่ได้)' : st.scope === 'party_all' ? 'ทดสอบทั้งคณะ' : 'สมาชิกในทีมช่วยตรวจได้';
        return '<div style="padding:4px 0;border-bottom:1px solid var(--line,#3a3f4a)"><b>' + (done ? '✅ ' : cur ? '👉 ' : '🔒 ') + 'ขั้นที่ ' + (idx + 1) + ': ' + esc(st.titleTh) + '</b> <span class="chip">' + esc(st.type) + '</span><div class="muted" style="font-size:11.5px">' + esc(st.hintTh || '') + ' · ขอบเขต: ' + scopeTh + '</div></div>';
      }).join('');
      h += '</div>';
    }

    if (knowers.length) {
      h += '<h3>👥 ศิษย์ที่รับรู้เบาะแสนี้ (' + knowers.length + ' คน)</h3><div class="card">';
      h += knowers.map(([nid, info]) => {
        const npc = W.byId[nid];
        return '<div class="logrow"><span>' + (npc ? nameLink(npc) : esc(nid)) + ' <span class="muted">(รับรู้วันที่ ' + info.learnedDay + ' · แหล่งต้นตอ ' + esc(info.rootRumorId || '-') + ')</span></span><b>เชื่อมั่น ' + Math.round(info.confidence || 55) + '%</b></div>';
      }).join('');
      h += '</div>';
    }

    if (Array.isArray(inst.history) && inst.history.length) {
      h += '<h3>📜 บันทึกการสืบค้นเบาะแส</h3><div class="card">' + inst.history.slice().reverse().map(ev => '<div class="logrow"><span class="tm">วันที่ ' + ev.day + '</span><span>' + esc(ev.text) + '</span></div>').join('') + '</div>';
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

  /* ----- Helper: Build Personal Bag Rows (Read-Only) ----- */
  function buildPersonalBagItems(W, n) {
    const items = [];
    const inv = n.inv || {};
    // 1. Equipped Gear
    ['WEAPON', 'ARMOR', 'ACCESSORY'].forEach(slot => {
      const eq = n.equip && n.equip[slot];
      if (!eq) return;
      items.push({
        kind: 'EQUIPPED',
        rawKind: 'EQUIPMENT',
        kindTh: 'สวมใส่อยู่ (' + slot + ')',
        id: eq.uid || eq.id,
        slot,
        nameTh: eq.nameTh,
        tier: eq.tier || 1,
        qty: 1,
        spawned: !!eq.playerSpawned,
        descTh: 'กำลังรบ +' + Math.round((eq.combatMult || eq.defMult || 0) * 100) + '%',
        canUnequip: true
      });
    });
    // 2. Unequipped Personal Gear
    (inv.gear || []).forEach(eq => {
      if (!eq) return;
      items.push({
        kind: 'EQUIPMENT',
        rawKind: 'EQUIPMENT',
        kindTh: 'อุปกรณ์ในถุง',
        id: eq.uid || eq.id,
        slot: eq.slot,
        nameTh: eq.nameTh,
        tier: eq.tier || 1,
        qty: 1,
        spawned: !!eq.playerSpawned,
        descTh: 'ช่อง ' + (eq.slot || '-') + ' · กำลังรบ +' + Math.round((eq.combatMult || eq.defMult || 0) * 100) + '%',
        canEquip: true,
        canDonate: true
      });
    });
    // 3. Personal Pills
    Object.entries(inv.pills || {}).forEach(([pid, qty]) => {
      if (!qty || qty <= 0) return;
      const info = ECO.pillInfo(pid) || {};
      const sp = (inv.spawnedPills && inv.spawnedPills[pid]) || 0;
      items.push({
        kind: 'PILL',
        rawKind: 'PILL',
        kindTh: 'โอสถ',
        id: pid,
        nameTh: ECO.name(pid),
        tier: info.tier || 1,
        qty,
        spawned: sp > 0,
        descTh: 'โอสถฟื้นฟู/บำรุงตบะ',
        canUse: true,
        canDonate: true
      });
    });
    // 4. Personal Materials
    Object.entries(inv.mats || {}).forEach(([mid, qty]) => {
      if (!qty || qty <= 0) return;
      const m = ECO.matById[mid] || {};
      const sp = (inv.spawnedMats && inv.spawnedMats[mid]) || 0;
      items.push({
        kind: 'MATERIAL',
        rawKind: 'MATERIAL',
        kindTh: 'วัตถุดิบ',
        id: mid,
        nameTh: ECO.name(mid),
        tier: m.tier || 1,
        qty,
        spawned: sp > 0,
        descTh: 'วัตถุดิบหอผลิต',
        canDonate: true
      });
    });
    // 5. Personal Crystals
    Object.entries(inv.crystals || {}).forEach(([cid, qty]) => {
      if (!qty || qty <= 0) return;
      const rawSub = cid.startsWith('S:') ? cid.slice(2) : cid; const subObj = CULT.subList.find(x => x.sub.id === rawSub);
      const sp = (inv.spawnedCrystals && inv.spawnedCrystals[cid]) || 0;
      items.push({
        kind: 'CRYSTAL',
        rawKind: 'CRYSTAL',
        kindTh: 'ผลึกสายย่อย',
        id: cid,
        nameTh: 'ผลึก「' + (subObj ? subObj.sub.nameTh : cid) + '」',
        tier: 3,
        qty,
        spawned: sp > 0,
        descTh: 'วิถี ' + (subObj ? subObj.path : '-'),
        canUse: true,
        canDonate: true
      });
    });
    // 6. Personal Technique Manuals
    Array.from(new Set(inv.techs || [])).forEach(tid => {
      const t = CULT.tech(tid);
      if (!t) return;
      const sp = Array.isArray(inv.spawnedTechs) && inv.spawnedTechs.includes(tid);
      items.push({
        kind: 'TECH_MANUAL',
        rawKind: 'TECH_MANUAL',
        kindTh: 'คัมภีร์วิชา',
        id: tid,
        nameTh: 'คัมภีร์「' + t.nameTh + '」',
        tier: t.tier || 1,
        qty: 1,
        spawned: sp,
        descTh: 'วิถี ' + (t.path || 'ANY') + ' · ระดับคุณภาพ ' + (t.grade || 'Common'),
        canUse: true,
        canDonate: true
      });
    });
    // 7. Personal Recipe Scrolls
    Array.from(new Set(inv.recipes || [])).forEach(rid => {
      const r = ECO.recipeById[rid];
      if (!r) return;
      const sp = Array.isArray(inv.spawnedRecipes) && inv.spawnedRecipes.includes(rid);
      items.push({
        kind: 'RECIPE_SCROLL',
        rawKind: 'RECIPE_SCROLL',
        kindTh: 'ม้วนตำรับ',
        id: rid,
        nameTh: 'ม้วนตำรับ' + r.nameTh,
        tier: r.tier || 1,
        qty: 1,
        spawned: sp,
        descTh: 'ผลผลิต ' + (r.outNameTh || r.nameTh),
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
      items.push({
        kind: 'ORGAN',
        rawKind: 'ORGAN',
        kindTh: 'อวัยวะอสูร',
        id: oid,
        nameTh: o.nameTh,
        tier: o.tier || 2,
        qty,
        spawned: sp > 0,
        descTh: 'ธาตุ ' + (o.element || '-'),
        canUse: true,
        canDonate: true
      });
    });
    return items;
  }

  function renderPersonalBagSection(W, n) {
    let items = buildPersonalBagItems(W, n);
    const bq = (UI.bagSearch || '').trim().toLowerCase();
    if (bq) items = items.filter(it => it.nameTh.toLowerCase().includes(bq) || String(it.id).toLowerCase().includes(bq));
    if (UI.bagType && UI.bagType !== 'ALL') items = items.filter(it => it.kind === UI.bagType || it.rawKind === UI.bagType);
    if (UI.bagSort === 'qty') items.sort((a, b) => b.qty - a.qty || b.tier - a.tier);
    else if (UI.bagSort === 'name') items.sort((a, b) => a.nameTh.localeCompare(b.nameTh));
    else items.sort((a, b) => (a.kind === 'EQUIPPED' ? -1 : 0) - (b.kind === 'EQUIPPED' ? -1 : 0) || b.tier - a.tier);

    let h = '<h3>🎒 ถุงสัมภาระและอุปกรณ์ส่วนตัว (' + items.length + ' รายการ)</h3><div class="card">';
    h += '<div class="edit-grid" style="margin-bottom:8px">';
    h += '<input id="bagSearch" type="search" placeholder="ค้นหาไอเทมในถุง…" value="' + esc(UI.bagSearch || '') + '">';
    h += '<select id="bagType">' + [['ALL', 'ทุกประเภท'], ['EQUIPPED', 'สวมใส่อยู่'], ['EQUIPMENT', 'อุปกรณ์ในถุง'], ['PILL', 'โอสถ'], ['MATERIAL', 'วัตถุดิบ'], ['CRYSTAL', 'ผลึกสายย่อย'], ['TECH_MANUAL', 'คัมภีร์วิชา'], ['RECIPE_SCROLL', 'ม้วนตำรับ'], ['ORGAN', 'อวัยวะอสูร']].map(([k, v]) => '<option value="' + k + '"' + (UI.bagType === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select>';
    h += '<select id="bagSort">' + [['tier', 'เรียงตามระดับ/สวมใส่'], ['qty', 'เรียงตามจำนวน'], ['name', 'เรียงตามชื่อ']].map(([k, v]) => '<option value="' + k + '"' + (UI.bagSort === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select>';
    h += '</div>';

    if (!items.length) {
      h += '<div class="muted">ยังไม่มีไอเทมในถุงส่วนตัวที่ตรงกับเงื่อนไข (สามารถกดปุ่ม ✨ เสกของเข้าถุง เพื่อเพิ่มไอเทมได้)</div>';
    } else {
      h += items.map(it => {
        let btns = '';
        if (it.canUnequip) {
          btns += '<button class="btn" style="padding:3px 7px;font-size:11px" data-do="unequip-bag" data-arg="' + n.id + '|' + it.slot + '">ถอดเก็บ</button>';
          btns += '<button class="btn" style="padding:3px 7px;font-size:11px" data-do="unequip-sect" data-arg="' + n.id + '|' + it.slot + '">คืนคลัง</button>';
        }
        if (it.canEquip) {
          btns += '<button class="btn pri" style="padding:3px 7px;font-size:11px" data-do="equip-personal" data-arg="' + n.id + '|' + it.id + '">สวมใส่</button>';
        }
        if (it.canUse) {
          btns += '<button class="btn pri" style="padding:3px 7px;font-size:11px" data-do="use-personal" data-arg="' + n.id + '|' + it.rawKind + '|' + it.id + '">ใช้งาน</button>';
        }
        if (it.canDonate) {
          btns += '<button class="btn" style="padding:3px 7px;font-size:11px" data-do="donate-personal" data-arg="' + n.id + '|' + it.rawKind + '|' + it.id + '">บริจาค</button>';
        }
        return '<div class="logrow" style="align-items:center"><div><span class="chip ' + (it.kind === 'EQUIPPED' ? 'g' : 'b') + '">' + esc(it.kindTh) + ' T' + it.tier + '</span> <b>' + esc(it.nameTh) + '</b> ×' + it.qty + (it.spawned ? ' <span class="chip v">ไอเทมเสก (0 คป.)</span>' : '') + '<div class="muted" style="font-size:11px">' + esc(it.descTh || '') + '</div></div><div style="display:flex;gap:4px;flex-wrap:wrap">' + btns + '</div></div>';
      }).join('');
    }
    h += '</div>';
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
        if (bf.length) h += '<div style="margin-top:6px">💊 ' + bf.map(b => '<span class="chip b">' + esc(b.name) + ' (' + Math.max(0, Math.round(b.until - W.t)) + ' นาที)</span>').join('') + '</div>';
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
      if (n.cult) {
        const c = n.cult, pth = CULT.PATHS[c.path]; const sub = CULT.subInfo(c.path, c.sub); h += '<div style="margin-top:4px"><b>' + esc(CULT.stageName(n)) + '</b> · สาย' + esc(sub ? sub.nameTh : c.sub) + '</div>' + bar('ความก้าวหน้า', c.prog / CULT.threshold(n) * 100, { wide: true, txt: Math.round(c.prog) + '/' + CULT.threshold(n), color: pth.color }) + '<div class="muted">พลังรบ ' + Math.round(CULT.power(n)) + ' · อายุขัย ~' + (n.lifespanMax || CULT.lifespan(n)) + ' ปี · รากวิญญาณ ' + esc(n.h.root.grade) + '</div>';
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
    } else if (tab === 'body') {
      h += '<div class="muted">ขีดขาวคือค่ากำเนิด</div><div class="card">' + statLayer(n, 'physiology') + '</div><h3>ความถนัดด้านวิชา</h3><div class="card">' + HC.AFF_ALL.map(k => [k, HC.eff(n, 'affinities.' + k)]).sort((a, b) => b[1] - a[1]).slice(0, 10).map(a => bar(HC.AFF_TH[a[0]] || a[0], a[1], { wide: true })).join('') + '</div><h3>รูปร่าง</h3><div class="card muted">' + esc(HC.appearanceText(n)) + '</div>';
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

  /* ---------- PHASE 2: SHARED EDIT HUB (UI.rEdit) ---------- */
  UI.collectEditDraftFromDom = () => {
    const body = $('shBody');
    if (!body || !UI.G || !UI.G.W) return null;
    const W = UI.G.W;
    const n = W.byId[UI.editNpcId];
    if (!n) return null;
    const d = UI.editDraft || { cult: {}, economy: {}, state: {} };
    const pathEl = body.querySelector('#editCultPath');
    const subEl = body.querySelector('#editCultSub');
    const stageEl = body.querySelector('#editCultStage');
    const xpEl = body.querySelector('#editCultXp');
    if (pathEl) d.cult.path = pathEl.value;
    if (subEl) d.cult.sub = subEl.value;
    if (stageEl) d.cult.stage = +stageEl.value;
    if (xpEl) d.cult.xp = +xpEl.value;

    const stEl = body.querySelector('#editStones');
    const cpEl = body.querySelector('#editCp');
    const merEl = body.querySelector('#editMerit');
    const satEl = body.querySelector('#editSat');
    if (stEl) d.economy.stones = +stEl.value;
    if (cpEl) d.economy.cp = +cpEl.value;
    if (merEl) d.economy.merit = +merEl.value;
    if (satEl) d.economy.sat = +satEl.value;

    body.querySelectorAll('[data-edit-stat]').forEach(inp => {
      const [grp, key] = inp.dataset.editStat.split('.');
      d[grp] = d[grp] || {};
      d[grp][key] = +inp.value;
    });
    UI.editDraft = d;
    return d;
  };

  UI.updateEditPreviewDom = () => {
    const body = $('shBody');
    if (!body || !UI.G || !UI.G.W) return;
    const W = UI.G.W;
    const prevEl = body.querySelector('#editLivePreview');
    if (!prevEl || !UI.editNpcId) return;
    const draft = UI.editDraft || {};
    const prev = SECT.EDITOR.previewCharacterEdit(W, UI.editNpcId, draft);
    if (!prev.ok) {
      prevEl.innerHTML = '<span style="color:var(--red)">⚠️ ' + esc(prev.reason) + '</span>';
    } else {
      const recNotes = (prev.reconciled.notes || []).concat(prev.reconciled.unequippedGear.length ? ['ถอดอุปกรณ์ที่ไม่รองรับเข้าคลัง: ' + prev.reconciled.unequippedGear.join(', ')] : []);
      prevEl.innerHTML = '<b>ผลคำนวณหลังแก้ไข:</b> ' + esc(prev.after.stageName) + ' · พลังชีวิตสูงสุด <b>' + prev.after.hpMax + '</b> (เดิม ' + prev.before.hpMax + ') · ปราณสูงสุด <b>' + prev.after.qiMax + '</b> (เดิม ' + prev.before.qiMax + ') · พลังรบ <b>' + prev.after.combatPower + '</b> (เดิม ' + prev.before.combatPower + ')' + (recNotes.length ? '<div class="muted" style="color:var(--gold)">หมายเหตุ: ' + esc(recNotes.join(' · ')) + '</div>' : '');
    }
  };

  UI.applyCharEditFromDom = () => {
    const W = UI.G.W;
    const draft = UI.collectEditDraftFromDom();
    if (!draft || !UI.editNpcId) return;
    const res = SECT.EDITOR.applyCharacterEdit(W, UI.editNpcId, draft);
    if (!res.ok) {
      UI.toast('แก้ไขไม่สำเร็จ: ' + res.reason);
      return;
    }
    if (UI.G && UI.G.R && UI.G.R.invalidate) UI.G.R.invalidate();
    UI.toast('บันทึกการแก้ไขของ ' + W.byId[UI.editNpcId].h.name.given + ' สำเร็จ');
    UI.editDraft = null;
    UI.render();
    UI.updateHud(true);
  };

  UI.rEdit = () => {
    const W = UI.G.W, tab = UI.tab || 'char';
    const members = W.npcs.filter(n => !n.dead && !n.exiled).sort((a, b) => b.rank - a.rank);
    if (!UI.editNpcId || !W.byId[UI.editNpcId] || W.byId[UI.editNpcId].dead) {
      UI.editNpcId = members[0] ? members[0].id : W.sect.masterId;
    }
    const n = W.byId[UI.editNpcId];
    let h = '<div class="card"><b>ตัวละครเป้าหมาย:</b><select id="editNpcSel" style="margin-top:4px">' + members.map(x => '<option value="' + x.id + '"' + (x.id === UI.editNpcId ? ' selected' : '') + '>' + esc(HC.fullName(x)) + ' (' + SECT.title(x) + ' · ' + CULT.stageName(x) + ')</option>').join('') + '</select>';
    if (n) {
      const st = SECT.EDITOR.memberEditState(W, n);
      if (st.warnings && st.warnings.length) {
        h += '<div class="muted" style="margin-top:4px;color:var(--gold)">⚠️ ' + esc(st.warnings.join(' · ')) + '</div>';
      }
      h += '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap"><button class="btn" data-do="npc" data-arg="' + n.id + '">👤 เปิดหน้าข้อมูลตัวละคร</button><button class="btn" data-do="heal-char-edit">✨ ฟื้นฟู/รักษาเต็ม</button>' + (Array.isArray(W._editUndoStack) && W._editUndoStack.length ? '<button class="btn" data-do="undo-char-edit">↩️ ย้อนคืนการแก้ไขล่าสุด (' + W._editUndoStack.length + ')</button>' : '') + '</div>';
    }
    h += '</div>';

    if (tab === 'char' && n) {
      const d = UI.editDraft || {};
      const curPath = (d.cult && d.cult.path) || (n.cult ? n.cult.path : 'MORTAL');
      const pathDef = CULT.PATHS[curPath];
      const maxStage = pathDef ? pathDef.maxStage : 0;
      const curStage = (d.cult && d.cult.stage !== undefined) ? clamp(d.cult.stage, 0, maxStage) : (n.cult ? Math.min(n.cult.stage, maxStage || 1) : 0);
      const validSubs = pathDef ? pathDef.subPaths : [];
      const curSub = (d.cult && d.cult.sub !== undefined) ? d.cult.sub : (n.cult ? n.cult.sub : 'NONE');
      const curXp = (d.cult && d.cult.xp !== undefined) ? d.cult.xp : (n.cult ? Math.round(n.cult.prog || 0) : 0);

      h += '<h3>1. วิถีบำเพ็ญ ขั้นตบะ และทรัพยากรส่วนตัว</h3><div class="card"><div class="edit-grid">';
      h += '<div class="edit-field"><label>วิถีหลัก</label><select id="editCultPath" class="edit-live-input"><option value="MORTAL"' + (curPath === 'MORTAL' ? ' selected' : '') + '>ปุถุชน (ไร้ตบะ)</option>' + Object.keys(CULT.PATHS).map(pid => '<option value="' + pid + '"' + (curPath === pid ? ' selected' : '') + '>' + esc(CULT.PATHS[pid].nameTh) + ' (สูงสุดขั้น ' + CULT.PATHS[pid].maxStage + ')</option>').join('') + '</select></div>';
      h += '<div class="edit-field"><label>สายย่อย</label><select id="editCultSub" class="edit-live-input"><option value="NONE">พื้นฐาน (ยังไม่เลือกสายย่อย)</option>' + validSubs.map(s => '<option value="' + s.id + '"' + (curSub === s.id ? ' selected' : '') + '>' + esc(s.nameTh) + '</option>').join('') + '</select></div>';
      h += '<div class="edit-field"><label>ขั้นตบะ (0–' + maxStage + ')</label><input id="editCultStage" class="edit-live-input" type="number" min="0" max="' + maxStage + '" value="' + curStage + '"></div>';
      h += '<div class="edit-field"><label>แต้มตบะสะสม (XP)</label><input id="editCultXp" class="edit-live-input" type="number" min="0" max="500000" value="' + curXp + '"></div>';
      h += '<div class="edit-field"><label>ศิลาส่วนตัว</label><input id="editStones" class="edit-live-input" type="number" min="0" max="999999" value="' + Math.round((d.economy && d.economy.stones !== undefined) ? d.economy.stones : (n.inv.stones || 0)) + '"></div>';
      h += '<div class="edit-field"><label>แต้มคุณูปการ (คป.)</label><input id="editCp" class="edit-live-input" type="number" min="0" max="999999" value="' + Math.round((d.economy && d.economy.cp !== undefined) ? d.economy.cp : (n.cp || 0)) + '"></div>';
      h += '<div class="edit-field"><label>ผลงานสะสม (Merit)</label><input id="editMerit" class="edit-live-input" type="number" min="0" max="999999" value="' + Math.round((d.economy && d.economy.merit !== undefined) ? d.economy.merit : (n.merit || 0)) + '"></div>';
      h += '<div class="edit-field"><label>ความพึงพอใจ (0–100)</label><input id="editSat" class="edit-live-input" type="number" min="0" max="100" value="' + Math.round((d.economy && d.economy.sat !== undefined) ? d.economy.sat : (n.sat == null ? 60 : n.sat)) + '"></div>';
      h += '</div></div>';

      const grp = UI.editStatGroup || 'personality';
      const grpSpec = SECT.EDITOR.EDITABLE_GROUPS[grp] || SECT.EDITOR.EDITABLE_GROUPS.personality;
      const grpLabels = {
        personality: 'บุคลิกภาพ (Personality 14)',
        values: 'คุณค่าชีวิต (Values 8)',
        interests: 'ความสนใจ (Interests 15)',
        aptitudes: 'พรสวรรค์ (Aptitudes 6)',
        physiology: 'สรีระและรากฐานกาย (Physiology 16)',
        intellect: 'สติปัญญา (Intellect 16)',
        social: 'ทักษะสังคม (Social 9)',
        skills: 'ทักษะยุทธ์และวิชาชีพ (Skills 30)'
      };
      h += '<h3>2. ค่าพื้นฐานตัวละคร (คำนวณ HP/Qi/พลังรบอัตโนมัติ)</h3><div class="card">';
      h += '<select id="editStatGroupSel" style="margin-bottom:8px">' + Object.keys(grpLabels).map(gk => '<option value="' + gk + '"' + (grp === gk ? ' selected' : '') + '>' + grpLabels[gk] + '</option>').join('') + '</select>';
      h += '<div class="edit-grid">';
      grpSpec.keys.forEach(k => {
        const curVal = (d[grp] && d[grp][k] !== undefined) ? d[grp][k] : Math.round((n.h[grp] && n.h[grp][k]) || 0);
        const label = HC.nameOf(grp + '.' + k) || k;
        h += '<div class="edit-field"><label>' + esc(label) + ' (' + grpSpec.min + '–' + grpSpec.max + ')</label><input type="number" class="edit-live-input" data-edit-stat="' + grp + '.' + k + '" min="' + grpSpec.min + '" max="' + grpSpec.max + '" value="' + curVal + '"></div>';
      });
      h += '</div></div>';

      const prev = SECT.EDITOR.previewCharacterEdit(W, n.id, d);
      h += '<div class="card" id="editLivePreview">' + (prev.ok ? ('<b>ผลคำนวณหลังแก้ไข:</b> ' + esc(prev.after.stageName) + ' · พลังชีวิตสูงสุด <b>' + prev.after.hpMax + '</b> · ปราณสูงสุด <b>' + prev.after.qiMax + '</b> · พลังรบ <b>' + prev.after.combatPower + '</b>') : ('<span style="color:var(--red)">' + esc(prev.reason) + '</span>')) + '</div>';
      h += '<div style="display:flex;gap:8px;margin-top:8px"><button class="btn pri" style="flex:1" data-do="apply-char-edit">💾 บันทึกการแก้ไขตัวละคร</button></div>';
    } else if (tab === 'spawn') {
      const catItems = SECT.EDITOR.catalog(W, {
        search: UI.spawnSearch,
        kind: UI.spawnKind,
        tier: UI.spawnTier === 'ALL' ? null : +UI.spawnTier,
        dest: UI.spawnDest
      });
      h += '<h3>✨ เสกไอเทมเข้าคลังสำนักหรือถุงส่วนตัว</h3><div class="card">';
      h += '<div class="muted" style="margin-bottom:6px">ไอเทมที่เสกเข้าถุงส่วนตัวจะถูกติดป้ายกำกับ <b>ไอเทมเสก</b> เพื่อป้องกันการนำไปบริจาคปั๊มแต้มคุณูปการ (ได้ 0 คป.) แต่ใช้งานและโอนเข้าคลังได้จริง</div>';
      h += '<div class="edit-grid">';
      h += '<div class="edit-field"><label>ปลายทาง</label><select id="spawnDest"><option value="sect"' + (UI.spawnDest === 'sect' ? ' selected' : '') + '>🏯 คลังสำนัก</option><option value="npc"' + (UI.spawnDest === 'npc' ? ' selected' : '') + '>🎒 ถุงส่วนตัวของ ' + esc(n ? n.h.name.given : 'ตัวละคร') + '</option></select></div>';
      h += '<div class="edit-field"><label>หมวดหมู่</label><select id="spawnKind">' + [['ALL', 'ทุกหมวดหมู่'], ['PROVISION', 'เสบียง/ศิลา'], ['MATERIAL', 'วัตถุดิบ'], ['PILL', 'โอสถพื้นฐาน'], ['CRAFTED_PILL', 'โอสถตำรับ'], ['EQUIPMENT', 'อุปกรณ์ยุทธ์'], ['TECH_MANUAL', 'คัมภีร์วิชา'], ['CRYSTAL', 'ผลึกสายย่อย'], ['SUB_MANUAL', 'คัมภีร์สายย่อย'], ['RECIPE_SCROLL', 'ม้วนตำรับ'], ['ORGAN', 'อวัยวะอสูร']].map(([k, v]) => '<option value="' + k + '"' + (UI.spawnKind === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></div>';
      h += '<div class="edit-field"><label>ระดับ (Tier)</label><select id="spawnTier">' + [['ALL', 'ทุกระดับ'], ['1', 'ระดับ 1'], ['2', 'ระดับ 2'], ['3', 'ระดับ 3'], ['4', 'ระดับ 4'], ['5', 'ระดับ 5'], ['6', 'ระดับ 6'], ['7', 'ระดับ 7']].map(([k, v]) => '<option value="' + k + '"' + (UI.spawnTier === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></div>';
      h += '<div class="edit-field"><label>จำนวนที่จะเสก</label><input id="spawnQty" type="number" min="1" max="50000" value="' + (UI.spawnQty || 1) + '"></div>';
      h += '<div class="edit-field"><label>คุณภาพอุปกรณ์</label><select id="spawnQuality">' + [['0.85', 'ธรรมดา (85%)'], ['1', 'มาตรฐาน (100%)'], ['1.15', 'ประณีต (115%)'], ['1.3', 'ชั้นเลิศ (130%)']].map(([k, v]) => '<option value="' + k + '"' + (String(UI.spawnQuality) === k ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></div>';
      h += '<div class="edit-field"><label>ค้นหาชื่อ/รหัส</label><input id="spawnSearch" type="search" placeholder="พิมพ์ชื่อไอเทม…" value="' + esc(UI.spawnSearch || '') + '"></div>';
      h += '</div></div>';

      h += '<h3>รายการไอเทม (' + catItems.length + ' รายการ)</h3><div class="card">';
      if (!catItems.length) {
        h += '<div class="muted">ไม่พบไอเทมที่ตรงกับตัวกรอง</div>';
      } else {
        h += catItems.slice(0, 60).map(item => '<div class="logrow" style="align-items:center"><div><span class="chip b">' + esc(item.kind) + ' T' + item.tier + '</span> <b>' + esc(item.nameTh) + '</b><div class="muted" style="font-size:11px">' + esc(item.descTh || '') + '</div></div><button class="btn pri" style="padding:4px 10px;font-size:11.5px" data-do="spawn-item" data-arg="' + item.kind + '|' + item.id + '">✨ เสก</button></div>').join('');
      }
      h += '</div>';
    } else if (tab === 'bag' && n) {
      h += renderPersonalBagSection(W, n);
    } else if (tab === 'backup') {
      const slots = UI.slotInfo();
      h += '<h3>💾 สำรองข้อมูลก่อนแก้ไขหรือเสกของ</h3><div class="card"><div class="muted">แนะนำให้บันทึกเกมลงช่องบันทึกหรือส่งออกเป็นไฟล์ JSON ก่อนปรับแก้ค่าสถานะขนาดใหญ่ การกดปุ่ม "ย้อนคืนการแก้ไขล่าสุด" จะย้อนคืนเฉพาะค่าสถานะตัวละครโดยไม่ย้อนเวลาของโลกที่เดินไปแล้ว</div>';
      [1, 2, 3].forEach(i => {
        const s = slots[i];
        h += '<div style="margin-top:6px"><b>ช่องที่ ' + i + ':</b> <span class="muted">' + (s ? esc(s.text) : 'ว่าง') + '</span> <button class="btn pri" data-do="save" data-arg="' + i + '">💾 บันทึกทับช่อง ' + i + '</button></div>';
      });
      h += '<div style="margin-top:8px"><button class="btn" data-do="export">⬇ ส่งออกไฟล์สำรอง (.json)</button></div></div>';
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
      h += '<label class="sw" style="border-bottom:0;padding-bottom:2px"><span>ลดการเคลื่อนไหว (หยุดอนิเมชันน้ำ/ควัน/ประกาย)</span><input type="checkbox" data-set="reducedMotion" ' + (o.reducedMotion ? 'checked' : '') + '></label></div>';
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
})(typeof globalThis !== 'undefined' ? globalThis : this);
