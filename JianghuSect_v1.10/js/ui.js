/* ui.js — หน้าจอ: HUD, แผ่นข้อมูล (people/sect/log/world/menu/npc/building), หน้าเลือกเจ้าสำนัก, บันทึก/โหลด */
(function (g) {
  'use strict';
  const U = g.U, HC = g.HC, CULT = g.CULT, SECT = g.SECT, ECO = g.ECO, AI = g.AI, MAP = g.MAP, SIM = g.SIM, EXPED = g.EXPED, JD = g.JD, Render = g.Render;
  const clamp = U.clamp;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const UI = { G: null, sheet: null, tab: null, lastHud: 0 };
  const SPEEDS = [[0, '⏸'], [1, '1×'], [2, '2×'], [4, '4×'], [8, '8×'], [16, '16×'], [32, '32×'], [48, '48×']];
  UI.SPEEDS = SPEEDS.map(s => s[0]);

  const LOG_GROUPS = {
    all: ['ทั้งหมด', null],
    sect: ['สำนัก', ['decision', 'appoint', 'promote', 'demote', 'succession', 'politics', 'punish', 'expel', 'challenge', 'disciple', 'finance', 'research', 'build', 'system', 'desert']],
    people: ['ผู้คน', ['relation', 'marriage', 'recruit', 'death', 'awaken']],
    train: ['ฝึกฝน', ['breakthrough', 'learn', 'insight', 'craft', 'gear']],
    world: ['นอกสำนัก', ['mission', 'raid', 'combat', 'duel', 'tournament', 'spar', 'event', 'explore']]
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
  function nameLink(n) { return '<a data-npc="' + n.id + '" style="color:var(--blue);text-decoration:none">' + esc(n.h.name.given) + '</a>'; }
  function linkify(W, text, ids) { let t = esc(text); (ids || []).forEach(id => { const n = W.byId[id]; if (n && n.h.name.given) t = t.split(esc(n.h.name.given)).join('<a data-npc="' + id + '" style="color:#9bd7fa;text-decoration:none">' + esc(n.h.name.given) + '</a>'); }); return t; }
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
    $('speedBar').onclick = e => { const b = e.target.closest('button'); if (!b) return; UI.G.speed = +b.dataset.sp; if(UI.G.W) {UI.G.W.speed=UI.G.speed;UI.G.W.runtimeTiming={pendingTicks:UI.G.acc||0,speed:UI.G.speed};} UI.updateHud(true); };
    document.querySelectorAll('#hudBottom button').forEach(b => b.onclick = () => UI.open(b.dataset.nav));
    $('shClose').onclick = () => UI.close();
    $('fZoomIn').onclick = () => UI.G.R.zoomAt(UI.G.R.vw / 2, UI.G.R.vh / 2, 1.35);
    $('fZoomOut').onclick = () => UI.G.R.zoomAt(UI.G.R.vw / 2, UI.G.R.vh / 2, 1 / 1.35);
    $('fHome').onclick = () => { UI.G.R.follow = false; UI.G.R.focus(118, 70, 0.9); };
    $('fFollow').onclick = () => { const R = UI.G.R; if (!R.selected) { UI.toast('เลือกตัวละครก่อน (แตะที่ตัวละครบนแผนที่)'); return; } R.follow = !R.follow; if (R.follow && R.cam.z < 1.6) R.cam.z = 2; $('fFollow').style.background = R.follow ? 'var(--gold)' : ''; };
    $('shBody').addEventListener('click', e => {
      const a = e.target.closest('[data-npc]'); if (a) { UI.openNpc(a.dataset.npc); return; }
      const b = e.target.closest('[data-bld]'); if (b) { UI.openBuilding(b.dataset.bld); return; }
      const f = e.target.closest('[data-do]'); if (f) UI.doAction(f.dataset.do, f.dataset.arg);
    });
    $('toasts').addEventListener('click', e => { const t = e.target.closest('.toast'); if (t && t.dataset.npc) UI.focusNpc(t.dataset.npc); });
  };
  UI.updateHud = (force) => {
    const G = UI.G, W = G.W; if (!W) return; const now = performance.now(); if (!force && now - UI.lastHud < 250) return; UI.lastHud = now;
    const c = SIM.calendar(W.t); const wk = { clear: '☀️', cloud: '⛅', rain: '🌧️', snow: '❄️', fog: '🌫️' }[W.weather.kind] || '';
    $('dateTxt').title = SIM.SEASON_TH[c.season]; $('dateTxt').textContent = wk + ' ปี ' + c.year + ' ด.' + c.month + ' ว.' + c.dom + '  ' + U.pad2(c.hour) + ':' + U.pad2(c.minute) + ' · ' + SIM.SEASON_TH[c.season];
    document.querySelectorAll('#speedBar button').forEach(b => b.classList.toggle('on', +b.dataset.sp === G.speed));
    const alive = W.npcs.filter(n => !n.dead), away = alive.filter(n => n.away).length; const S = W.sect;
    const raid = W.threat && W.threat.raid ? '<span class="pill" style="border-color:#ff8a3a;color:#ffb27a">⚠ ศัตรูบุก!</span>' : '';
    $('resRow').innerHTML = '<span class="pill">💎 <b>' + U.fmtNum(S.stones) + '</b></span><span class="pill">🍚 <b>' + U.fmtNum(ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3) + '</b></span><span class="pill">👥 <b>' + alive.length + '</b>' + (away ? ' (นอก ' + away + ')' : '') + '</span><span class="pill">🏅 <b>' + U.fmtNum(S.fame) + '</b></span>' + raid + (G.acc >= 1 ? '<span class="pill" title="งานจำลองที่รอประมวลผลยังถูกเก็บไว้">⏳ รอ ' + Math.floor(G.acc) + ' นาทีเกม</span>' : '');
    // ข้อมูลตัวที่เลือก
    const R = G.R, sel = R.selected && W.byId[R.selected]; const si = $('selInfo');
    if (sel && !UI.sheet) { si.classList.add('show'); const key = sel.id + ':' + sel.act.id + ':' + sel.rank + ':' + (sel.dead ? 1 : 0); if (si.dataset.key !== key || force) { si.dataset.key = key; si.innerHTML = portraitHtml(sel, 40) + '<div style="flex:1;min-width:0"><div style="font-weight:700">' + esc(HC.fullName(sel)) + ' <span class="muted">' + SECT.title(sel) + '</span></div><div class="muted" id="selAct"></div></div><button data-do="npc" data-arg="' + sel.id + '">ดูข้อมูล</button><button data-do="deselect">✕</button>'; drawPortraits(si); si.querySelectorAll('button').forEach(b => b.onclick = () => UI.doAction(b.dataset.do, b.dataset.arg)); }
      const sa = $('selAct'); if (sa) sa.textContent = actText(sel) + (sel.why && sel.why[0] && !sel.dead ? ' · เพราะ ' + sel.why[0][0] : ''); }
    else si.classList.remove('show');
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
    $('shTabs').onclick = e => { const b = e.target.closest('button'); if (b) { UI.tab = b.dataset.t; UI.render(); } };
    document.querySelectorAll('#hudBottom button').forEach(b => b.classList.toggle('on', b.dataset.nav === kind));
    $('selInfo').classList.remove('show');
  }
  UI.open = (kind, arg) => {
    if (!UI.G.W && kind !== 'menu') { UI.close(); return; }
    if (UI.sheet === kind && kind !== 'npc') { UI.close(); return; }
    if (kind === 'people') show('people', '👥 ผู้คนในสำนัก', [['rank', 'ตามระดับ'], ['act', 'กำลังทำอะไร'], ['cult', 'ตบะ'], ['mood', 'อารมณ์']], 'rank');
    else if (kind === 'sect') show('sect', '🏯 สำนัก', [['over', 'ภาพรวม'], ['policy', 'นโยบาย/นิสัยผู้นำ'], ['posts', 'ตำแหน่ง'], ['stock', 'คลัง'], ['shop', '🛒 ร้าน/คุณูปการ'], ['bld', 'อาคาร']], 'over');
    else if (kind === 'log') show('log', '📜 บันทึกเหตุการณ์', Object.keys(LOG_GROUPS).map(k => [k, LOG_GROUPS[k][0]]), 'all');
    else if (kind === 'world') show('world', '🧭 ยุทธภพนอกสำนัก', [['exp', 'คณะเดินทาง'], ['content', '🌿 พื้นที่/ตำรับ'], ['disc', '🔭 ค้นพบ'], ['sects', 'สำนักอื่น'], ['hist', 'ประวัติ']], 'exp');
    else if (kind === 'menu') show('menu', UI.G.W ? '⚙️ เมนู' : '📂 โหลดเกมที่บันทึก', UI.G.W ? [['main', 'เกม'], ['set', 'ตั้งค่า'], ['tools', 'ผู้สังเกตการณ์'], ['about', 'เกี่ยวกับ']] : [], 'main');
    UI.render();
  };
  UI.openNpc = (id, tab) => { const n = UI.G.W.byId[id]; if (!n) return; UI.G.R.selected = id; UI.npcId = id; show('npc', esc(HC.fullName(n)) + ' <span class="muted" style="font-weight:400">' + SECT.title(n) + '</span>', [['ov', 'ภาพรวม'], ['self', 'ตัวตน'], ['body', 'กาย'], ['mind', 'ปัญญา/สังคม'], ['skill', 'ทักษะ'], ['rel', 'ความสัมพันธ์'], ['life', 'ชีวิต'], ['cmp', 'เทียบกับ…']], tab || 'ov', true); UI.render(); };
  UI.openBuilding = id => { UI.bldId = id; const b = UI.G.W.map.byId[id]; show('building', esc(b.nameTh), [], null); UI.render(); };
  UI.focusNpc = id => { const n = UI.G.W.byId[id]; if (!n) return; UI.G.R.selected = id; if (!n.away && !n.dead) { UI.G.R.focus(n.x, n.y, Math.max(UI.G.R.cam.z, 2)); } UI.updateHud(true); };
  UI.doAction = (a, arg) => {
    const G = UI.G, W = G.W;
    if (a === 'npc') UI.openNpc(arg); else if (a === 'deselect') { G.R.selected = null; G.R.follow = false; UI.updateHud(true); }
    else if (a === 'locate') { UI.close(); UI.focusNpc(arg); }
    else if (a === 'follow') { UI.close(); UI.focusNpc(arg); G.R.follow = true; G.R.cam.z = Math.max(G.R.cam.z, 2.2); $('fFollow').style.background = 'var(--gold)'; }
    else if (a === 'locb') { const b = W.map.byId[arg]; UI.close(); G.R.follow = false; G.R.focus(b.x + b.w / 2, b.y + b.h / 2, 1.3); }
    else if (a === 'save') UI.saveSlot(arg); else if (a === 'load') UI.loadSlot(arg);
    else if (a === 'export') UI.exportFile(); else if (a === 'import') $('impFile').click();
    else if (a === 'new') { UI.close(); UI.showStart(); }
    else if (a === 'tool') UI.tool(arg);
    else if (a === 'cmp') { UI.cmpId = arg; UI.render(); }
  };
  UI.render = () => {
    const G = UI.G, W = G.W, body = $('shBody'); if (!UI.sheet) return; const keepScroll = body.scrollTop;
    let html = '';
    switch (UI.sheet) {
      case 'people': html = UI.rPeople(); break; case 'sect': html = UI.rSect(); break; case 'log': html = UI.rLog(); break; case 'world': html = UI.rWorld(); break;
      case 'menu': html = UI.rMenu(); break; case 'npc': html = UI.rNpc(); break; case 'building': html = UI.rBuilding(); break;
    }
    body.innerHTML = html; drawPortraits(body); body.scrollTop = keepScroll;
    body.querySelectorAll('[data-set]').forEach(el => el.onchange = () => { G.opts[el.dataset.set] = el.checked; UI.applyOpts(); });
    const sf = body.querySelector('#npcSel'); if (sf) sf.onchange = () => { UI.cmpId = sf.value; UI.render(); };
    const q = body.querySelector('#pq'); if (q) { q.oninput = () => { UI.pq = q.value; UI.render(); const q2 = $('shBody').querySelector('#pq'); q2.focus(); q2.setSelectionRange(q2.value.length, q2.value.length); }; }
  };
  UI.tick = () => { if (!UI.sheet || UI.sheet === 'menu' && UI.tab !== 'main') return; const now = performance.now(); if (now - (UI.lastRender || 0) < 1200) return; if (document.activeElement && document.activeElement.tagName === 'INPUT') return; UI.lastRender = now; UI.render(); };

  /* ----- ผู้คน ----- */
  UI.rPeople = () => {
    const W = UI.G.W; let list = W.npcs.filter(n => !n.dead); const q = (UI.pq || '').trim(); if (q) list = list.filter(n => HC.fullName(n).includes(q) || SECT.title(n).includes(q));
    const tab = UI.tab;
    if (tab === 'rank') list.sort((a, b) => b.rank - a.rank || (b.cult ? b.cult.stage : 0) - (a.cult ? a.cult.stage : 0));
    else if (tab === 'act') list.sort((a, b) => (a.away ? 'z' : a.act.id).localeCompare(b.away ? 'z' : b.act.id));
    else if (tab === 'cult') list.sort((a, b) => (b.cult ? CULT.power(b) : 0) - (a.cult ? CULT.power(a) : 0));
    else list.sort((a, b) => a.h.state.mood - b.h.state.mood);
    const head = '<input id="pq" type="search" placeholder="ค้นหาชื่อ/ตำแหน่ง…" value="' + esc(UI.pq || '') + '" style="margin-bottom:8px"><div class="muted" style="margin-bottom:6px">ทั้งหมด ' + list.length + ' คน · แตะเพื่อดูตัวตนเต็ม</div>';
    return head + list.map(n => { const hpf = n.h.state.hp / CULT.hpMax(n); const sub = tab === 'cult' ? (n.cult ? CULT.stageName(n) + ' · พลัง ' + Math.round(CULT.power(n)) : 'ปุถุชน') : tab === 'mood' ? 'อารมณ์ ' + Math.round(n.h.state.mood) + ' · เครียด ' + Math.round(n.h.state.stress) + ' · พอใจสำนัก ' + Math.round(n.sat == null ? 60 : n.sat) : actText(n);
      return '<div class="prow" data-npc="' + n.id + '">' + portraitHtml(n, 42) + '<div class="pi"><div class="nm">' + esc(HC.fullName(n)) + ' <span class="chip ' + (n.rank >= 4 ? 'g' : '') + '" style="font-size:10.5px">' + SECT.title(n) + '</span></div><div class="sub">' + esc(sub) + '</div><div class="mini"><i style="width:' + clamp(hpf * 100, 0, 100) + '%;background:' + (hpf > .6 ? '#5fd38a' : hpf > .3 ? '#e8c43a' : '#e0584a') + '"></i></div></div></div>'; }).join('');
  };

  /* ----- สำนัก ----- */
  UI.rSect = () => {
    const W = UI.G.W, S = W.sect, m = W.byId[S.masterId], tab = UI.tab; let h = '';
    if (tab === 'over') {
      const alive = W.npcs.filter(n => !n.dead); const byRank = SECT.RANKS.map(r => alive.filter(n => n.rank === r.id).length);
      h += '<div class="prow" data-npc="' + m.id + '">' + portraitHtml(m, 54) + '<div class="pi"><div class="nm" style="font-size:15px">' + esc(S.name) + '</div><div class="sub">เจ้าสำนัก: ' + esc(HC.fullName(m)) + ' · ' + HC.ageText(m) + ' · ' + esc(HC.identity(m).title) + '</div></div></div>';
      h += '<div class="card"><div class="grid2"><div>👥 สมาชิก <b>' + alive.length + '</b></div><div>🏅 ชื่อเสียง <b>' + U.fmtNum(S.fame) + '</b></div><div>💎 ศิลาวิญญาณ <b>' + U.fmtNum(S.stones) + '</b></div><div>😊 ความพึงพอใจ <b>' + Math.round(W.avgSat) + '</b></div><div>🍚 ข้าว/อาหาร <b>' + ECO.count(W, 'grain') + '/' + ECO.count(W, 'meal') + '</b></div><div>☠ ผู้เสียชีวิตสะสม <b>' + (W.deaths || 0) + '</b></div></div></div>';
      if (S.queue && S.queue.length) h += '<h3>🚪 ผู้สมัครรอหน้าประตู (' + S.queue.length + ')</h3><div class="card">' + S.queue.map(q => '<div class="sub">' + esc(q.h.name.given) + ' · ' + esc(q.h.origin.cls) + ' จาก' + esc(q.h.origin.region) + ' · รอมา ' + (W.day - q.joinDay) + ' วัน</div>').join('') + '<div class="sub">' + (SECT.holder(W, 'registry') ? 'ผู้อาวุโสหอทะเบียนเป็นผู้พิจารณา' : 'เจ้าสำนักเป็นผู้พิจารณาเอง') + '</div></div>';
      h += '<h3>จำนวนตามระดับ</h3><div class="card">' + SECT.RANKS.slice().reverse().map(r => '<span class="chip" style="border-color:' + r.color + '">' + r.nameTh + ' ' + byRank[r.id] + '</span>').join('') + '</div>';
      const cult = { XIAN: 0, BODY: 0, GOD: 0, DEMON: 0, HEART_SOUL: 0, none: 0 }; alive.forEach(n => { const k = n.cult && cult[n.cult.path] != null ? n.cult.path : 'none'; cult[k]++; });
      h += '<h3>วิถีที่เดิน</h3><div class="card"><span class="chip b">เซียน ' + cult.XIAN + '</span><span class="chip r">กายา ' + cult.BODY + '</span><span class="chip g">เทพศรัทธา ' + cult.GOD + '</span><span class="chip v">มารอสูร ' + cult.DEMON + '</span><span class="chip b">จิต·เซน ' + cult.HEART_SOUL + '</span><span class="chip">ปุถุชน ' + cult.none + '</span></div>';
      if (S.research) h += '<h3>งานวิจัย</h3><div class="card">ตำรับระดับ ' + S.research.tier + ' ' + bar('ความคืบหน้า', S.research.progress / S.research.need * 100, { wide: true, txt: Math.round(S.research.progress / S.research.need * 100) + '%' }) + '</div>';
      if (S.tournament) h += '<div class="card">🏆 ประลองยุทธ์: ' + (S.tournament.state === 'announce' ? 'ประกาศแล้ว จะเริ่มอีก ' + Math.max(0, Math.round((S.tournament.start - W.t) / 60)) + ' ชม.' : 'กำลังแข่ง เหลือ ' + (S.tournament.alive || []).length + ' คน') + '</div>';
      if (S.festival && S.festival.until > W.t) h += '<div class="card">🎎 งานเลี้ยงกำลังจัดอยู่</div>';
      const sf = (S.fallen || []).slice(-5).reverse(); if (sf.length) h += '<h3>ผู้ล่วงลับล่าสุด</h3><div class="card">' + sf.map(f => '<div class="muted">☠ ' + esc(f.name) + ' — ' + esc(f.why) + ' (' + dayStamp(f.day * 1440) + ')</div>').join('') + '</div>';
    } else if (tab === 'policy') {
      const st = SECT.styleOf(m);
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
      const rl = (S.cd || {}); const recent = W.logs.filter(l => l.type === 'decision').slice(-6).reverse(); if (recent.length) h += '<h3>การตัดสินใจล่าสุดของเจ้าสำนัก</h3><div class="card">' + recent.map(l => '<div class="logrow"><span class="tm">' + dayStamp(l.t) + '</span>' + esc(l.text) + '</div>').join('') + '</div>';
    } else if (tab === 'posts') {
      h += '<div class="card"><b>ตำแหน่งบริหาร</b><div class="muted">ผู้นำเลือกคนตามความสามารถหรือความสนิท ขึ้นกับนโยบาย "ยึดความสามารถ" ' + Math.round(S.policy.meritocracy) + '</div></div>';
      const slots = [['เจ้าสำนัก', W.byId[S.masterId]], ['รองเจ้าสำนัก', W.byId[S.deputyId]]].concat(SECT.POST_IDS.map(p => [SECT.POSTS[p].nameTh, SECT.holder(W, p), SECT.POSTS[p].desc]));
      h += slots.map(s => { const n = s[1]; return '<div class="prow" ' + (n ? 'data-npc="' + n.id + '"' : '') + '>' + (n ? portraitHtml(n, 40) : '<div style="width:40px;height:40px;border-radius:10px;background:#0e141b;display:flex;align-items:center;justify-content:center">—</div>') + '<div class="pi"><div class="nm">' + s[0] + '</div><div class="sub">' + (n ? esc(HC.fullName(n)) + ' · ' + (n.cult ? CULT.stageName(n) : 'ปุถุชน') : 'ว่าง') + '</div><div class="sub">' + esc(s[2] || '') + '</div></div></div>'; }).join('');
    } else if (tab === 'stock') {
      h += '<div class="card"><div class="grid2"><div>💎 ศิลา <b>' + U.fmtNum(S.stones) + '</b></div><div>🌾 ข้าว <b>' + ECO.count(W, 'grain') + '</b></div><div>🍚 อาหารปรุง <b>' + ECO.count(W, 'meal') + '</b></div><div>⚔ อุปกรณ์ในคลัง <b>' + S.gear.length + '</b></div><div>📚 คัมภีร์ในหอ <b>' + S.library.length + '</b></div><div>🔬 ตำรับระดับ <b>' + S.recipeTier + '</b></div></div></div>';
      if (SECT.ensureDirectives) SECT.ensureDirectives(W);
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

      ['alchemy', 'forge'].forEach(hh => { const o = S.orders && S.orders[hh]; const r = o ? ECO.recipeById[o.rid] : null; h += '<div class="card">' + (hh === 'alchemy' ? '⚗️ หอโอสถกำลังผลิต: ' : '🔨 โรงหลอมกำลังผลิต: ') + (r ? '<b>' + esc(r.outNameTh) + '</b> <span class="muted">(' + esc(o.why || '') + ')</span>' : '<span class="muted">ไม่มีคำสั่ง/วัตถุดิบไม่พอ</span>') + '</div>'; });
      const pills = Object.keys(S.stock).filter(k => ECO.isPill(k)).map(k => [k, S.stock[k]]); h += '<h3>โอสถ</h3><div class="card">' + (pills.length ? pills.map(p => '<span class="chip ok">' + esc(ECO.name(p[0])) + ' ×' + p[1] + '</span>').join('') : '<span class="muted">ไม่มี</span>') + '</div>';
      const mats = Object.keys(S.stock).filter(k => !ECO.isPill(k) && k !== 'grain' && k !== 'meal').map(k => [k, S.stock[k]]).sort((a, b) => b[1] - a[1]); h += '<h3>วัตถุดิบ</h3><div class="card">' + (mats.length ? mats.slice(0, 60).map(p => '<span class="chip">' + esc(ECO.name(p[0])) + ' ×' + p[1] + '</span>').join('') : '<span class="muted">ไม่มี</span>') + '</div>';
      const gears = S.gear.slice(0, 30); h += '<h3>อุปกรณ์ในคลัง</h3><div class="card">' + (gears.length ? gears.map(x => '<span class="chip b">' + esc(x.nameTh) + '</span>').join('') : '<span class="muted">ไม่มี</span>') + '</div>';
      const led = S.ledger.slice(-14).reverse(); h += '<h3>บัญชีล่าสุด</h3><div class="card">' + led.map(l => '<div class="logrow"><span class="tm">' + dayStamp(l.t) + '</span><b style="color:' + (l.amt >= 0 ? '#5fd38a' : '#e0584a') + '">' + (l.amt >= 0 ? '+' : '') + l.amt + '</b> ' + esc(l.why) + '</div>').join('') + '</div>';
    } else if (tab === 'shop') {
      const c = g.CPE.S(W), al = W.npcs.filter(n => !n.dead && !n.exiled), tot = al.reduce((a, n) => a + (n.cp || 0), 0), tr = SECT.holder(W, 'treasury');
      const recent = (c.hist || []).slice(-30), minted30 = recent.reduce((a, x) => a + (x.mint || 0), 0), burned30 = recent.reduce((a, x) => a + (x.burn || 0), 0);
      const flowLabel = minted30 > burned30 * 1.25 ? 'แต้มกำลังเพิ่มเร็ว' : burned30 > minted30 * 1.1 ? 'แต้มกำลังถูกใช้มาก' : 'แต้มหมุนเวียนใกล้สมดุล';
      h += '<div class="card"><b>🛒 ร้านค้าสำนัก & แต้มคุณูปการ (คป.)</b><div class="muted">สำนักเสกแต้มจ่ายเป็นค่าตอบแทน แต้มมีค่าเพราะแลกของ/วิชาที่ต้องหามาจากข้างนอกได้ การเรียนวิชา ซื้อสินค้า และขอคำชี้แนะจะเผาแต้มออกจากระบบ</div><div class="grid2"><div>แต้มรวมที่ถือ <b>' + U.fmtNum(Math.round(tot)) + '</b></div><div>เฉลี่ย/คน <b>' + Math.round(tot / Math.max(1, al.length)) + '</b></div><div>เสกสะสม <b>' + U.fmtNum(Math.round(c.minted)) + '</b></div><div>เผาสะสม <b>' + U.fmtNum(Math.round(c.burned)) + '</b></div><div>แต้มหมุนเวียน <b>' + U.fmtNum(Math.round(c.circulation || tot)) + '</b></div><div>แต้มปลดเกษียณ <b>' + U.fmtNum(Math.round(c.retired || 0)) + '</b></div><div>สกัดอาร์บิทราจ <b>' + (c.arbitrageBlocked || 0) + ' ครั้ง</b></div><div>ดัชนีราคา <b>×' + c.price.toFixed(2) + '</b></div><div>กำไรร้าน <b>×' + c.markup.toFixed(2) + '</b></div><div>แจกสวัสดิการแล้ว <b>' + c.welfareGiven + '</b></div><div>ขายแล้ว <b>' + c.sales + '</b> · ค่าวิชา <b>' + Math.round(c.techSales) + '</b></div><div>บริการชี้แนะ <b>' + (c.studyServices || 0) + ' ครั้ง</b></div><div>เผาค่าชี้แนะ <b>' + U.fmtNum(Math.round(c.studyFees || 0)) + ' คป.</b></div><div>ฝึกปราณแบบเสียแต้ม <b>' + (c.trainingServices || 0) + ' ครั้ง</b></div><div>เผาค่าฝึกปราณ <b>' + U.fmtNum(Math.round(c.trainingFees || 0)) + ' คป.</b></div><div>ขอสิทธิ์ตำรับ <b>' + (c.recipeAuthorizations || 0) + ' ครั้ง</b></div><div>เผาค่าสิทธิ์ตำรับ <b>' + U.fmtNum(Math.round(c.recipeFees || 0)) + ' คป.</b></div></div><div class="muted">30 วันล่าสุด: เสก ' + Math.round(minted30) + ' · เผา ' + Math.round(burned30) + ' · ' + flowLabel + '</div>' + (tr ? '<div class="muted">ผู้ดูแลคลัง: ' + esc(HC.fullName(tr)) + ' · ความใจกว้าง ' + Math.round(c.welfare * 100) + '%</div>' : '') + '</div>';
      const need = g.JD.CP.BASIC.map(r => 'P:' + r.id);
      h += '<h3>โอสถพื้นฐาน 8 สูตร (หลอมให้สำนัก แจกเป็นสวัสดิการ/ขาย)</h3><div class="card">' + need.map(k => { const sc = g.CPE.scarcity(W, k); return '<div class="logrow"><span>' + esc(ECO.name(k)) + ' ×' + ECO.count(W, k) + '</span><b style="color:' + (sc > 1.3 ? '#e0584a' : sc < 0.8 ? '#7aa' : '#5fd38a') + '">ขาย ' + g.CPE.priceOf(W, k) + ' · รับบริจาค ' + Math.round(g.CPE.reward(W, k, 1)) + ' คป.</b></div>'; }).join('') + '</div>';
      const herbs = ['MAT_HERB_DEW_GRASS_1', 'MAT_HERB_JADE_LOTUS_2', 'MAT_HERB_BLOOD_GINSENG_3']; h += '<h3>ป้ายรับซื้อ (ค่าบริจาคตามความขาด)</h3><div class="card">' + herbs.map(k => '<div class="logrow"><span>' + esc(ECO.name(k)) + ' ในคลัง ' + ECO.count(W, k) + '</span><b>' + Math.round(g.CPE.reward(W, k, 1)) + ' คป./หน่วย</b></div>').join('') + '</div>';
      const shop = g.CPE.shopItems(W).filter(i => !(i.kind === 'pill' && i.key.startsWith('P:BASIC'))).slice(0, 24);
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
      if (SECT.ensureFacilityDemand) SECT.ensureFacilityDemand(W);
      h += W.map.buildings.filter(b => b.type !== 'plaza').map(b => {
        const fd = S.facilityDemand && S.facilityDemand[b.id];
        const congText = fd && (fd.congestedHours >= 2 || fd.failedAttempts >= 2) ? ' · <span style="color:#f0a030">⚠️ แออัด (' + fd.congestedHours + ' ชม./พลาด ' + fd.failedAttempts + ')</span>' : '';
        return '<div class="prow" data-bld="' + b.id + '"><div style="font-size:24px;width:40px;text-align:center">' + MAP.BTYPES[b.type].icon + '</div><div class="pi"><div class="nm">' + esc(b.nameTh) + ' <span class="chip g">ระดับ ' + b.level + '</span></div><div class="sub">' + (b.building ? '🚧 กำลังขยายเป็นระดับ ' + b.building.to : 'ใช้งานอยู่ ' + (b.inside ? b.inside.length : 0) + '/' + b.stations.length + ' จุด · สภาพ ' + Math.round(b.hp) + '%' + congText) + '</div></div></div>';
      }).join('');
    }
    return h;
  };
  UI.rBuilding = () => {
    const W = UI.G.W, b = W.map.byId[UI.bldId]; if (!b) return ''; const bt = MAP.BTYPES[b.type];
    const inside = (b.inside || []).map(id => W.byId[id]).filter(Boolean); const around = W.npcs.filter(n => !n.dead && !n.away && !n.hidden && n.x >= b.x - 2 && n.x <= b.x + b.w + 2 && n.y >= b.y - 1 && n.y <= b.y + b.h + 5);
    const xs = W.explore && W.explore.spots[b.id]; let h = '<div class="card"><div style="font-size:30px">' + bt.icon + '</div><div>' + esc(bt.desc) + '</div><div class="muted">ระดับ ' + b.level + ' · สภาพ ' + Math.round(b.hp) + '% · จุดกิจกรรม ' + b.stations.length + '</div></div>';
    h += '<button class="btn pri" data-do="locb" data-arg="' + b.id + '">📍 ไปที่อาคารนี้</button>';
    if (inside.length) h += '<h3>อยู่ข้างใน (' + inside.length + ')</h3>' + inside.map(n => '<div class="prow" data-npc="' + n.id + '">' + portraitHtml(n, 36) + '<div class="pi"><div class="nm">' + esc(HC.fullName(n)) + '</div><div class="sub">' + esc(actText(n)) + '</div></div></div>').join('');
    if (around.length) h += '<h3>อยู่บริเวณนี้ (' + around.length + ')</h3>' + around.map(n => '<div class="prow" data-npc="' + n.id + '">' + portraitHtml(n, 36) + '<div class="pi"><div class="nm">' + esc(HC.fullName(n)) + '</div><div class="sub">' + esc(actText(n)) + '</div></div></div>').join('');
    if (b.type === 'alchemy' || b.type === 'forge') { const o = W.sect.orders && W.sect.orders[b.id]; const r = o ? ECO.recipeById[o.rid] : null; h += '<h3>คำสั่งผลิตปัจจุบัน</h3><div class="card">' + (r ? esc(r.outNameTh) + ' — ' + esc(o.why || '') : 'ไม่มี') + '</div>'; }
    return h;
  };

  /* ----- บันทึก ----- */
  UI.rLog = () => {
    const W = UI.G.W, grp = LOG_GROUPS[UI.tab][1]; let list = W.logs; if (grp) list = list.filter(l => grp.includes(l.type));
    list = list.slice(-120).reverse(); if (!list.length) return '<div class="muted">ยังไม่มีเหตุการณ์</div>';
    return list.map(l => '<div class="logrow"><span class="tm">' + dayStamp(l.t) + ' ' + U.pad2(Math.floor((l.t % 1440) / 60)) + ':' + U.pad2(l.t % 60) + '</span>' + linkify(W, l.text, l.ids) + '</div>').join('');
  };

  /* ----- ยุทธภพ ----- */
  UI.rWorld = () => {
    const W = UI.G.W, tab = UI.tab; let h = '';
    if (tab === 'exp') {
      const act = W.world.expeds.filter(e => !e.done);
      h += '<div class="muted" style="margin-bottom:6px">นอกสำนักไม่มีฉากให้เล่น ผลการเดินทางถูกคำนวณจากกำลัง โชค การรับรู้ และนิสัยของผู้เดินทางจริง</div>';
      h += '<h3>กำลังเดินทาง (' + act.length + ')</h3>' + (act.length ? act.map(e => { const ms = e.party.map(i => W.byId[i]).filter(Boolean); const reg = EXPED.REGIONS.find(r => r.id === e.region) || { nameTh: e.placeTh || '?' }; return '<div class="card"><b>' + EXPED.MISSIONS[e.kind].icon + ' ' + EXPED.MISSIONS[e.kind].nameTh + '</b> → ' + esc(reg.nameTh) + '<div>' + ms.map(nameLink).join('、') + '</div><div class="muted">กลับในอีก ~' + Math.max(0, Math.round((e.ret - W.t) / 1440 * 10) / 10) + ' วัน</div></div>'; }).join('') : '<div class="muted">ไม่มี</div>');
      const done = W.world.expeds.filter(e => e.done && e.out).slice(-5).reverse(); if (done.length) h += '<h3>เพิ่งกลับ</h3>' + done.map(e => { const ms = e.party.map(i => W.byId[i]).filter(Boolean); return '<div class="card"><b>' + EXPED.MISSIONS[e.kind].icon + ' ' + EXPED.MISSIONS[e.kind].nameTh + '</b> ' + ms.map(nameLink).join('、') + '<div class="muted">' + esc(e.journal.slice(-4).join(' → ')) + '</div><div>' + esc(EXPED.summarize(e.out)) + '</div></div>'; }).join('');
    } else if (tab === 'content') { h += UI.rContent();
    } else if (tab === 'disc') { h += UI.rDisc();
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
      const l = W.logs.filter(x => ['mission', 'raid', 'event', 'tournament'].includes(x.type)).slice(-60).reverse(); h += l.length ? l.map(x => '<div class="logrow"><span class="tm">' + dayStamp(x.t) + '</span>' + linkify(W, x.text, x.ids) + '</div>').join('') : '<div class="muted">ยังไม่มีเหตุการณ์นอกสำนัก</div>';
    }
    return h;
  };

  // Read-only catalog in the established mobile sheet; actual use stays autonomous.
  UI.rContent = () => {
    const W=UI.G.W,D=JD.EXPANSION,C=g.CONTENT;
    let h='<div class="card"><b>เนื้อหายุทธภพ v1.10</b><div class="muted">สมาชิกเลือกเดินทางจากกำลัง ความสนใจ ความระวัง และของที่สำนักขาด คัมภีร์กับตำรับต้องค้นพบก่อนใช้งาน</div></div>';
    h+='<h3>เส้นทางภายนอก</h3>'+D.regions.map(r=>{
      const s=C.site(W,r),known=r.recipes.filter(id=>W.sect.knownRecipes.includes(id)).length;
      return '<div class="card"><b>'+r.icon+' '+esc(r.nameTh)+'</b><div class="muted">'+esc(r.desc)+'</div><div>อันตราย '+r.danger+'/4 · เดินทางประมาณ '+r.days+' วัน · กำลังคณะขั้นต่ำ '+r.minPower+'</div><div class="muted">'+esc(r.hazardTh)+'</div><div>'+r.resources.map(e=>'<span class="chip '+(e.kind==='hunt'?'v':'ok')+'">'+(e.kind==='hunt'?'🐾 ':'🌿 ')+esc(ECO.name(e.id))+' '+Math.floor(s.stock[e.id])+'/'+e.cap+'</span>').join('')+'</div><div class="muted">ทรัพยากรฟื้นตัววันละ 1–3 หน่วยตามชนิด · 🐾 ต้องล่าสำเร็จ · กลับแล้ว '+s.visits+' ครั้ง · พบตำรับ '+known+'/'+r.recipes.length+'</div></div>';
    }).join('');
    h+='<h3>ตำรับที่ค้นพบ '+W.sect.knownRecipes.filter(id=>ECO.recipeById[id]).length+'/'+D.recipes.length+'</h3>'+D.recipes.map(r=>{
      const found=W.sect.knownRecipes.includes(r.id),known=ECO.recipeKnown(W,r),holders=C.formulaHolders?C.formulaHolders(W,r.id):[];
      const route=D.regions.find(z=>z.recipes.includes(r.id)),fee=C.recipeFee?C.recipeFee(W,r):0;
      const statusTxt=known?'รู้สูตรแล้ว':found?'ต้องวิจัยตำรับระดับ '+r.tier:holders.length?'ม้วนตำรับอยู่กับ '+holders.map(x=>esc(x.h.name.given)).join('、'):'ต้องค้นพบและนำกลับสำนัก';
      return '<div class="card"><b>'+((found||holders.length)?esc(r.nameTh):'🔒 ม้วนตำรับที่ยังไม่พบ')+'</b><div class="muted">'+esc(route.nameTh)+' · ระดับ '+r.tier+' · '+statusTxt+'</div>'+((found||holders.length)?'<div>'+r.inputs.map(i=>esc(ECO.name(i.matId))+' '+ECO.count(W,i.matId)+'/'+i.count).join(' · ')+'</div><div class="muted">ฝีมือ '+r.craft+' ≥ '+Math.max(0,r.minMastery-20)+' · อาคารระดับ '+r.facilityLevel+' · ค่าสิทธิ์ศึกษา '+fee+' คป. · ผลผลิต '+esc(r.outNameTh)+(r.sourceCompatiblePath!=='ANY'?' · เหมาะกับวิถี '+r.sourceCompatiblePath:'')+'</div>':'')+'</div>';
    }).join('');
    h+='<h3>สายย่อยและลำดับขั้นเฉพาะทางอิสระ (9 ขั้นแท้จริง)</h3>'+(D.progressionMapping||[]).map(pm=>{
      const sub=D.subPaths.find(s=>s.id===pm.subPath)||CULT.subInfo(pm.targetMajorPath,pm.subPath);
      return '<div class="card"><b>'+esc(sub?sub.nameTh:pm.subPath)+'</b> <span class="chip b">วิถี'+esc(CULT.PATHS[pm.targetMajorPath].nameTh)+' · ลำดับขั้นหลัก '+pm.targetMajorStages+' ขั้น · ขั้นเฉพาะทาง 9 ขั้น</span><div class="muted">'+esc(sub?sub.strengthTh:'')+'<br>ข้อจำกัด: '+esc(sub?sub.weaknessTh:'')+'</div><div style="margin-top:6px;font-size:12px"><b>ลำดับ 9 ขั้นแท้จริงและค่าเทียบเคียง:</b><br>'+(pm.realms||[]).map(r=>'<div style="padding:2px 0;border-bottom:1px dotted var(--line,#3a3f4a)">• <b>ลำดับ '+r.ordinal+': '+esc(r.nameTh)+'</b> <span class="chip ok">เทียบขั้นหลัก '+r.majorBandEquivalent.toFixed(1)+'</span> <span class="chip">พลังรบเทียบเคียง '+r.functionalCombatPower+' CP</span> · อายุขัย ~'+r.lifespanMax+' ปี · เกณฑ์ทักษะ: '+r.skillGate.primarySkill+' ≥ '+r.skillGate.minPrimarySkill+' · ศิลา '+r.resourceCost.stones+' ก้อน</div>').join('')+'</div></div>';
    }).join('');
    h+='<h3>อวัยวะอสูรกลายพันธุ์และกายวิภาค ('+Object.values(W.sect.organs||{}).reduce((s,v)=>s+v,0)+' ชิ้นในคลัง)</h3>'+(D.rareOrgans||[]).map(o=>{
      const cnt=C.organCount?C.organCount(W,o.id):0;
      const beast=(JD.BEASTS.species||[]).find(b=>b.id===o.beastId);
      const reg=D.regions.find(r=>r.id===o.regionId);
      return '<div class="card"><b>🧬 '+esc(o.nameTh)+'</b> <span class="chip '+(cnt>0?'ok':'')+'">คลัง '+cnt+'</span> <span class="chip v">ระดับ '+o.tier+' · ธาตุ '+esc(o.element)+'</span><div class="muted">อสูรต้นกำเนิด: '+esc(beast?beast.nameTh:o.beastId)+' ('+esc(reg?reg.nameTh:o.regionId)+') · ความยากชำแหละ '+o.dissectionDifficulty+'</div><div>'+(o.propertyTags||[]).map(t=>'<span class="chip b">'+esc(t)+'</span>').join('')+'</div><div class="muted">'+esc(o.usesTh||'')+'</div></div>';
    }).join('');
    const expState=(W.sect && W.sect.experiments)||{discovered:[],propertyKnowledge:{},notes:[]};
    const knownTagList=Object.entries(expState.propertyKnowledge||{}).filter(x=>x[1]>0);
    h+='<h3>การทดลองคุณสมบัติและสูตรประยุกต์ '+expState.discovered.length+'/'+(D.experiments||[]).length+'</h3>';
    if(knownTagList.length) h+='<div class="card"><b>คุณสมบัติวัตถุดิบที่วิเคราะห์แล้ว:</b><div>'+knownTagList.map(x=>'<span class="chip ok">'+esc(x[0])+' ×'+x[1]+'</span>').join('')+'</div></div>';
    h+=(D.experiments||[]).map(e=>{
      const disc=expState.discovered.includes(e.id);
      const catOrg=C.organById&&C.organById[e.catalystOrganId];
      const linkedRec=ECO.recipeById[e.linkedRecipeId];
      return '<div class="card"><b>'+(disc?'🧪 '+esc(e.nameTh):'🔬 สมมติฐาน: '+esc(e.nameTh))+'</b> <span class="chip '+(disc?'ok':'b')+'">'+(disc?'ค้นพบแล้ว':'รอการทดลอง')+'</span><div class="muted">ศาสตร์ '+e.discipline+' ≥ '+Math.max(0,e.minMastery-15)+' · ระดับ '+e.tier+' · ศิลาวิจัย '+e.stoneCost+' ก้อน</div><div>วัตถุดิบทดลอง: '+e.trialInputs.map(i=>esc(ECO.name(i.matId))+' '+ECO.count(W,i.matId)+'/'+i.count).join(' · ')+'</div><div class="muted">ตัวเร่งอวัยวะพิเศษ: '+esc(catOrg?catOrg.nameTh:e.catalystOrganId)+' (+'+Math.round((e.catalystBonusChance||0.18)*100)+'%) · ยกระดับตำรับ: '+esc(linkedRec?linkedRec.nameTh:e.linkedRecipeId)+'</div></div>';
    }).join('');
    h+='<h3>คัมภีร์ใหม่ในหอ '+D.techniques.filter(t=>W.sect.library.includes(t.id)).length+'/'+D.techniques.length+'</h3>'+D.techniques.map(t=>{
      const held=W.sect.library.includes(t.id),route=D.regions.find(r=>r.techniques.includes(t.id));
      return '<div class="card"><b>'+(held?esc(t.nameTh):'🔒 คัมภีร์ที่ยังไม่เข้าสำนัก')+'</b><div class="muted">'+esc(route.nameTh)+' · '+esc(CULT.subInfo(t.path,t.sub).nameTh)+' · ขั้นขั้นต่ำ '+t.reqTier+'</div>'+(held?'<div>'+esc(g.SK.profile(t).summary)+'</div><div class="muted">ค่าเรียน '+CPEPrice(W,t)+' คป. · ต้องได้รับสิทธิ์หอคัมภีร์และมีสายย่อยตรงกัน</div>':'')+'</div>';
    }).join('');
    return h;
  };
  function CPEPrice(W,t){return g.CPE.techPrice(W,t);}

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

  /* ----- ตัวละคร ----- */
  UI.rNpc = () => {
    const W = UI.G.W, n = W.byId[UI.npcId]; if (!n) return '<div class="muted">ไม่พบตัวละคร</div>'; const tab = UI.tab, s = n.h.state; let h = '';
    const idn = HC.identity(n);
    if (tab === 'ov') {
      h += '<div class="prow">' + portraitHtml(n, 64) + '<div class="pi"><div class="nm" style="font-size:15px">' + esc(HC.fullName(n)) + '</div><div class="sub">' + (n.h.sex === 'M' ? 'ชาย' : 'หญิง') + ' · ' + HC.ageText(n) + ' · ' + esc(n.h.origin.cls) + ' จาก' + esc(n.h.origin.region) + '</div><div class="sub">' + esc(idn.title) + '</div></div></div>';
      h += '<div>' + idn.tags.map(t => '<span class="chip v">' + esc(t) + '</span>').join('') + '<span class="chip">' + esc(idn.archetypeTh) + '</span><span class="chip b">ปัญญา: ' + esc(idn.smart) + '</span></div>';
      h += '<div style="margin:8px 0"><button class="btn pri" data-do="follow" data-arg="' + n.id + '">🎯 ติดตาม</button><button class="btn" data-do="locate" data-arg="' + n.id + '">📍 ดูบนแผนที่</button></div>';
      h += '<div class="muted">🏅 แต้มคุณูปการ <b>' + Math.round(n.cp || 0) + '</b> · สะสมตลอดชีพ ' + Math.round(n.cpEarned || 0) + '</div>';
      h += '<h3>กำลังทำอะไร</h3><div class="card"><div style="font-size:15px;font-weight:600">' + esc(actText(n)) + '</div>';
      if (n.why && n.why.length && !n.dead) h += '<div class="muted" style="margin-top:4px">เพราะ:</div><ul class="why" style="margin:2px 0 0 16px;padding:0">' + n.why.map(w => '<li>' + esc(w[0]) + ' <span class="muted">(' + (w[1] > 0 ? '+' : '') + w[1] + ')</span></li>').join('') + '</ul>';
      if (n.lastScores) h += '<div class="muted" style="margin-top:6px">ตัวเลือกที่ชั่งใจ: ' + n.lastScores.slice(0, 5).map(x => (AI.ACTS[x.id] ? AI.ACTS[x.id].nameTh : x.id === 'pair' ? 'พบปะ' : x.id) + ' ' + x.u).join(' · ') + '</div>';
      h += '</div>';
      h += '<h3>สถานะ</h3><div class="card">' + bar('พลังชีวิต', s.hp, { max: CULT.hpMax(n), txt: Math.round(s.hp) + '/' + CULT.hpMax(n), wide: true, color: '#e0584a' }) + (n.cult ? bar('ปราณ', s.qi, { max: CULT.qiMax(n), txt: Math.round(s.qi), wide: true, color: '#4fb2f2' }) : '') + bar('อิ่ม', s.satiety, { wide: true }) + bar('พักผ่อน', s.rest, { wide: true }) + bar('แรง', s.energy, { wide: true }) + bar('อารมณ์', clamp(s.mood + 50, 0, 100), { txt: Math.round(s.mood), wide: true }) + bar('เครียด', s.stress, { wide: true, color: s.stress > 60 ? '#e0584a' : '#9aa' }) + bar('สังคม', s.social, { wide: true }) + bar('ความเหงา', s.loneliness, { wide: true, color: '#b58cf0' }) + (s.heartDemon > 1 ? bar('จิตมาร', s.heartDemon, { wide: true, color: '#c33' }) : '') + '</div>';
      if (n.inj && n.inj.length) h += '<div class="card" style="border-color:var(--red)">🩹 ' + n.inj.map(i => esc(i.part) + ' (' + esc(i.why) + ')').join(' · ') + '</div>';
      { const ex = g.STATS.explain(n), INFO = g.STATS.INFO; const fmt = (k, v) => k === 'crit' || k === 'pen' ? v.toFixed(1) + '%' : k === 'critDmg' ? Math.round(v) + '%' : Math.round(v);
        h += '<h3>⚔ สเตตัสต่อสู้ <span class="muted" style="font-weight:400">(แตะแต่ละค่าดูที่มา)</span></h3><div class="card">' + g.STATS.KEYS.map(k => { const inf = INFO[k], parts = ex.parts[k] || [];
          return '<details style="border-bottom:1px solid var(--line,#3a3f4a);padding:3px 0"><summary style="cursor:pointer;display:flex;justify-content:space-between"><span>' + inf.icon + ' ' + inf.nameTh + '</span><b>' + fmt(k, ex.v[k]) + '</b></summary><div class="muted" style="font-size:12px;padding:2px 0 4px 6px">' + esc(inf.desc) + '<br>' + parts.map(q => '• ' + esc(q[0]) + ' : ' + (q[1] === 'b' ? 'ฐาน ' + Math.round(q[2]) : q[1] === 'p' ? (q[2] >= 0 ? '+' : '') + Math.round(q[2] * 1000) / 10 + '%' : (q[2] >= 0 ? '+' : '') + Math.round(q[2] * 10) / 10)).join('<br>') + '</div></details>'; }).join('');
        const bf = (n.buffs || []).filter(b => b.until > W.t), sx = (n.sx || []).filter(x => x.until > W.t);
        if (bf.length) h += '<div style="margin-top:6px">💊 ' + bf.map(b => '<span class="chip b">' + esc(b.name) + ' (' + Math.max(0, Math.round(b.until - W.t)) + ' นาที)</span>').join('') + '</div>';
        if (sx.length) h += '<div style="margin-top:6px">' + sx.map(x => { const S = g.SK.STATUS[x.k]; return S ? '<span class="chip">' + S.icon + ' ' + esc(S.nameTh) + '</span>' : ''; }).join('') + '</div>';
        h += '</div>';
        const sl = g.SK.list(n); if (sl.length) { h += '<h3>วิชาต่อสู้ที่ใช้ได้</h3><div class="card">' + sl.map(p => '<div style="padding:4px 0;border-bottom:1px solid var(--line,#3a3f4a)"><b>' + esc(p.nameTh) + '</b> <span class="muted">(ระดับ ' + p.tier + (n.cult && n.cult.tm && n.cult.tm[p.id] ? ' · ใช้แล้ว ' + n.cult.tm[p.id] + ' ครั้ง' : '') + ')</span><div class="muted" style="font-size:12px">' + esc(p.summary) + '</div></div>').join('') + '</div>'; } }
      h += '<h3>ตบะและพลังรบ</h3><div class="card">';
      if (n.cult) { const c = n.cult, pth = CULT.PATHS[c.path]; const sub = CULT.subInfo(c.path, c.sub); h += '<div><b>' + esc(CULT.stageName(n)) + '</b> · สาย' + esc(sub ? sub.nameTh : c.sub) + '</div>' + bar('ความก้าวหน้า', c.prog / CULT.threshold(n) * 100, { wide: true, txt: Math.round(c.prog) + '/' + CULT.threshold(n), color: pth.color }) + '<div class="muted">พลังรบ ' + Math.round(CULT.power(n)) + ' · อายุขัย ~' + (n.lifespanMax || CULT.lifespan(n)) + ' ปี · รากวิญญาณ ' + esc(n.h.root.grade) + '</div>';
        if (c.track) {
          const tr = c.track; const trR = CULT.trackRealm(n); const trTh = CULT.trackThreshold(n); const trGate = CULT.checkTrackGates(W, n);
          h += '<div class="card" style="margin-top:6px;background:rgba(255,255,255,0.03)"><b>🌿 ขั้นสายเฉพาะทาง: ' + esc(trR ? trR.nameTh : '') + ' (ลำดับ ' + tr.ordinal + '/9)</b>' + (trTh !== Infinity ? bar('ความก้าวหน้าสายเฉพาะ', tr.prog / trTh * 100, { wide: true, txt: Math.round(tr.prog) + '/' + trTh, color: '#7fd1b9' }) : '') + '<div class="muted">เทียบเคียงขั้นหลัก: <b>' + (trR ? trR.majorBandEquivalent.toFixed(1) : '') + '</b> · พลังรบเฉพาะทางเทียบเคียง: <b>' + (trR ? trR.functionalCombatPower : '') + ' CP</b></div><div style="font-size:12px;margin-top:2px">' + (tr.ordinal >= 9 ? '<span class="chip ok">บรรลุขั้น 9 สูงสุดแล้ว</span>' : trGate.ok ? '<span class="chip ok">✔ ผ่านเกณฑ์ทักษะและศิลา พร้อมทะลวงขั้นถัดไป</span>' : '<span class="chip r">🔒 ' + esc(trGate.reason) + '</span>') + '</div></div>';
        } if (c.bn || c.found || c.failN) { const tr = g.BN.treasureOf(c); h += '<div class="card" style="margin-top:6px"><b>🚧 คอขวด</b>' + (c.bn ? ' · แผน: <b>' + (c.bn.plan === 'go' ? 'ลุยทะลวง' : 'รอเตรียมตัว') + '</b> (' + esc(c.bn.why || '') + ')' : '') + '<div class="muted">ฐานตกผลึก +' + Math.round((c.found || 0) * 100) + '% · ประสบการณ์ล้มเหลว +' + Math.round((c.failExp || 0) * 100) + '% (ล้ม ' + (c.failN || 0) + ' ครั้ง)' + (c.toxic > 5 ? ' · พิษโอสถ ' + Math.round(c.toxic) : '') + '</div>' + (tr ? '<div class="muted">ด่านใหญ่ต้องใช้ ✦' + esc(tr.nameTh) + ' — ' + (c.treasure === tr.id ? 'มีแล้ว (+16%)' : 'ยังไม่มี (−30%)') + '</div>' : '') + '<div class="muted">โอสถเฉพาะขั้น: ' + esc(ECO.name(g.BN.pillKey(c))) + (g.BN.heldPill(n) ? ' (ถืออยู่)' : '') + '</div></div>'; } if (c.mantra) h += '<div class="muted">คัมภีร์หลัก: ' + esc((CULT.tech(c.mantra) || {}).nameTh || '') + '</div>'; if (c.techs.length) h += '<div style="margin-top:4px">' + c.techs.map(id => '<span class="chip b">' + esc((CULT.tech(id) || {}).nameTh || id) + '</span>').join('') + '</div>'; if (c.learning) h += '<div class="muted">กำลังศึกษา: ' + esc((CULT.tech(c.learning.id) || {}).nameTh) + ' ' + Math.round(c.learning.got / c.learning.need * 100) + '%</div>'; }
      else h += '<div class="muted">ยังเป็นปุถุชน ยังไม่ตื่นรู้ปราณ · พลังรบ ' + Math.round(CULT.power(n)) + '</div>';
      const eq = Object.keys(n.equip || {}).filter(k => n.equip[k]); if (eq.length) h += '<div style="margin-top:4px">' + eq.map(k => '<span class="chip g">' + esc(n.equip[k].nameTh) + '</span>').join('') + '</div>'; h += '</div>';
      h += '<h3>ในสำนัก</h3><div class="card"><div class="grid2"><div>ระดับ: <b>' + SECT.title(n) + '</b></div><div>เข้าสำนัก: ' + Math.max(0, Math.round(W.day - n.joinDay)) + ' วันก่อน</div><div>ผลงานสะสม: ' + Math.round(n.merit) + '</div><div>พอใจสำนัก: ' + Math.round(n.sat == null ? 60 : n.sat) + '</div><div>ศิลาส่วนตัว: ' + Math.round(n.inv.stones) + '</div><div>โชค: ' + Math.round(n.h.destiny.luck) + '</div></div>' + (n.mentor && W.byId[n.mentor] ? '<div>อาจารย์: ' + nameLink(W.byId[n.mentor]) + '</div>' : '') + (n.h.life.family.spouse && W.byId[n.h.life.family.spouse] ? '<div>คู่ครอง: ' + nameLink(W.byId[n.h.life.family.spouse]) + '</div>' : '') + ((n.h.life.family.disciples || []).length ? '<div>ศิษย์: ' + n.h.life.family.disciples.map(i => W.byId[i]).filter(Boolean).map(nameLink).join('、') + '</div>' : '') + (n.stats && (n.stats.kills || n.stats.sparWin) ? '<div class="muted">สถิติ: สังหาร ' + (n.stats.kills || 0) + ' · ประลองชนะ ' + (n.stats.sparWin || 0) + ' แพ้ ' + (n.stats.sparLoss || 0) + '</div>' : '') + '</div>';
      const personalMats = Object.entries((n.inv && n.inv.mats) || {}).filter(x => x[1] > 0);
      const personalOrgans = Object.entries((n.inv && n.inv.organs) || {}).filter(x => x[1] > 0 && g.CONTENT && g.CONTENT.organById && g.CONTENT.organById[x[0]]);
      const personalTechs = Array.from(new Set((n.inv && n.inv.techs) || [])).map(id => CULT.tech(id)).filter(Boolean);
      const personalRecipes = Array.from(new Set((n.inv && n.inv.recipes) || [])).map(id => ECO.recipeById[id]).filter(Boolean);
      const authRecipes = Array.from(new Set(n.recipes || [])).map(id => ECO.recipeById[id]).filter(Boolean);
      if (personalMats.length || personalOrgans.length || personalTechs.length || personalRecipes.length) h += '<h3>🎒 ของส่วนตัว (ยังไม่บริจาค)</h3><div class="card"><div class="muted">ของที่สมาชิกเก็บไว้จากการเดินทาง อาจนำมาบริจาค คัดลอก หรือแลกเปลี่ยนได้</div>' + personalMats.map(x => '<span class="chip">' + esc(ECO.name(x[0])) + ' ×' + x[1] + '</span>').join('') + personalOrgans.map(x => '<span class="chip v">🧬 ' + esc(g.CONTENT.organById[x[0]].nameTh) + ' ×' + x[1] + '</span>').join('') + personalTechs.map(t => '<span class="chip b">📜 ' + esc(t.nameTh) + ' · ระดับ ' + t.tier + '</span>').join('') + personalRecipes.map(r => '<span class="chip g">🧪 ม้วนตำรับ' + esc(r.nameTh) + ' · ระดับ ' + r.tier + '</span>').join('') + '</div>';
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
      const sk = HC.SKILL_IDS.map(id => [id, n.h.skills[id] || 0]).sort((a, b) => b[1] - a[1]); h += '<div class="card">' + sk.map(x => bar(HC.nameOf('skills.' + x[0]), x[1], { wide: true })).join('') + '</div>';
    } else if (tab === 'rel') {
      const rs = Object.keys(n.h.mind.relations).map(id => ({ id, r: n.h.mind.relations[id], o: W.byId[id] })).filter(x => x.o).sort((a, b) => Math.abs(b.r.a) + b.r.l * .3 - Math.abs(a.r.a) - a.r.l * .3);
      h += rs.length ? rs.slice(0, 40).map(x => '<div class="prow" data-npc="' + x.id + '">' + portraitHtml(x.o, 36) + '<div class="pi"><div class="nm">' + esc(HC.fullName(x.o)) + (x.r.bond ? ' <span class="chip ' + (x.r.bond === 'ศัตรู' ? 'r' : 'g') + '">' + esc(x.r.bond) + '</span>' : '') + (x.o.dead ? ' ☠' : '') + '</div><div class="sub">ถูกชะตา ' + Math.round(x.r.a) + ' · นับถือ ' + Math.round(x.r.r) + (x.r.l > 5 ? ' · รัก ' + Math.round(x.r.l) : '') + (x.r.v > 10 ? ' · ขัดแย้ง ' + Math.round(x.r.v) : '') + ' · พบกัน ' + x.r.n + ' ครั้ง</div></div></div>').join('') : '<div class="muted">ยังไม่คุ้นเคยกับใครเป็นพิเศษ</div>';
    } else if (tab === 'life') {
      h += '<h3>ความทรงจำสำคัญ</h3><div class="card">' + (n.h.mind.memories.slice().sort((a, b) => b.w - a.w).slice(0, 10).map(m => '<div class="logrow"><span class="tm">' + dayStamp(m.t) + '</span>' + esc(m.text) + '</div>').join('') || '<span class="muted">—</span>') + '</div>';
      h += '<h3>ประวัติ</h3><div class="card">' + (n.h.life.bio.slice().reverse().slice(0, 50).map(b => '<div class="logrow"><span class="tm">ปี' + (Math.floor(b.d / 360) + 1) + ' ด.' + (Math.floor(b.d % 360 / 30) + 1) + '</span>' + esc(b.text) + '</div>').join('') || '<span class="muted">ยังไม่มีเหตุการณ์สำคัญ</span>') + '</div>';
    } else if (tab === 'cmp') {
      const others = W.npcs.filter(o => !o.dead && o !== n).sort((a, b) => b.rank - a.rank); if (!UI.cmpId || !W.byId[UI.cmpId] || UI.cmpId === n.id) UI.cmpId = others[0] ? others[0].id : null; const o = UI.cmpId ? W.byId[UI.cmpId] : null;
      h += '<div class="muted" style="margin-bottom:6px">เปรียบเทียบ “ตัวตน” ครบทั้ง 155 มิติของมนุษย์ เพื่อดูว่า A ต่างจาก B ตรงไหน</div><select id="npcSel">' + others.map(x => '<option value="' + x.id + '"' + (x.id === UI.cmpId ? ' selected' : '') + '>' + esc(HC.fullName(x)) + ' (' + SECT.title(x) + ')</option>').join('') + '</select>';
      if (o) { const c = HC.compare(n, o); const pCmp = CULT.compareFunctionalPower(n, o); h += '<div class="card" style="margin-top:8px;text-align:center"><div style="font-size:26px;font-weight:700;color:var(--gold)">คล้ายกัน ' + c.similarity + '%</div><div class="muted">' + esc(HC.fullName(n)) + ' เทียบกับ ' + esc(HC.fullName(o)) + '</div><div style="margin-top:6px;font-size:13px"><b>การประเมินพลังรบเชิงการทำงาน (Functional Power):</b><br><span style="color:var(--gold)">' + esc(pCmp.assessmentTh) + '</span><br><span class="muted">' + esc(pCmp.a.label) + ' (' + pCmp.powerA + ' CP) เทียบกับ ' + esc(pCmp.b.label) + ' (' + pCmp.powerB + ' CP) · อัตราส่วน ' + pCmp.ratio + ' เท่า</span></div></div>';
        h += '<h3>ต่างกันมากที่สุด</h3><div class="card">' + c.topDiffs.slice(0, 8).map(d => { const def = HC.STAT_DEFS.find(s => s.path === d.path); const va = HC.eff(n, d.path), vb = HC.eff(o, d.path); return '<div style="margin:5px 0"><b>' + esc(def ? def.nameTh : d.path) + '</b> <span class="muted">' + esc(HC.LAYER_TH[def ? def.layer : ''] || '') + '</span>' + bar(esc(n.h.name.given), va, { wide: true, color: '#4fb2f2' }) + bar(esc(o.h.name.given), vb, { wide: true, color: '#f0714f' }) + '</div>'; }).join('') + '</div>';
        h += '<h3>คล้ายกันที่สุด</h3><div class="card">' + c.topAlike.slice(0, 5).map(d => { const def = HC.STAT_DEFS.find(s => s.path === d.path); return '<span class="chip ok">' + esc(def ? def.nameTh : d.path) + '</span>'; }).join('') + '</div>';
        h += '<h3>ต่างกันรายหมวด</h3><div class="card">' + c.layers.map(l => bar(l.layerTh, Math.min(100, l.diff / 2 * 100), { wide: true, txt: l.diff.toFixed(2), color: '#b58cf0' })).join('') + '</div>'; }
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
      const o = G.opts; h += [['names', 'แสดงชื่อตัวละคร (ขยายภาพ)'], ['bubbles', 'แสดงไอคอนกิจกรรมเหนือหัว'], ['weather', 'เอฟเฟกต์อากาศ/ใบไม้ร่วง'], ['night', 'กลางคืนมืดลง'], ['toast', 'แจ้งเตือนเหตุการณ์สำคัญ'], ['autosave', 'บันทึกอัตโนมัติ (ทุก 3 นาที)']].map(s => '<label class="sw"><span>' + s[1] + '</span><input type="checkbox" data-set="' + s[0] + '" ' + (o[s[0]] ? 'checked' : '') + '></label>').join('');
      h += '<div class="muted" style="margin-top:10px">การลากนิ้ว = เลื่อนแผนที่ · บีบนิ้ว = ซูม · แตะตัวละคร/อาคาร = ดูข้อมูล</div>';
    } else if (tab === 'tools') {
      h += '<div class="muted" style="margin-bottom:8px">เครื่องมือทดลองสำหรับผู้สังเกตการณ์ — ไม่ใช่ส่วนหนึ่งของระบบสำนักตามปกติ ใช้ดูว่า NPC ตัดสินใจอย่างไรเมื่อเกิดเหตุ</div>';
      h += [['stones', '💎 มอบศิลา 1,000'], ['food', '🍚 มอบเสบียง'], ['raid', '⚠ เรียกโจรบุก'], ['beast', '🐺 เรียกอสูรบุก'], ['recruit', '🧑‍🎓 เรียกผู้สมัครเข้าสำนัก'], ['banquet', '🎎 ให้เจ้าสำนักจัดงานเลี้ยง'], ['tourney', '🏆 ให้เจ้าสำนักจัดประลองยุทธ์'], ['challenge', '⚔ ให้ผู้อาวุโสท้าชิงตำแหน่ง'], ['heal', '✨ รักษาทุกคนจนหาย']].map(t => '<button class="btn" data-do="tool" data-arg="' + t[0] + '">' + t[1] + '</button>').join('');
    } else {
      h += '<div class="card"><b>สำนักเมฆาหยก v1.10 · ยุทธภพและสายวิชา</b><div class="muted">เกมจำลองสำนักยุทธภพแบบ sandbox — NPC ทุกคนมี “แกนมนุษย์” ชุดเดียวกัน 155 มิติ (บุคลิก 14 · คุณค่า 8 · กาย 22 · ปัญญา 18 · สังคม 7 · อารมณ์ 7 · ความสนใจ 24 · พรสวรรค์ 6 · ความถนัด · ทักษะ) ตัดสินใจเองจากตัวตน ไม่มีสคริปต์ตายตัว</div></div><div class="card"><b>ข้อมูลเกม</b><div class="muted">เมล็ดโลก: ' + esc(G.W.seed) + ' · เวอร์ชันแกน: ' + esc(HC.FINGERPRINT) + '<br>ข้อมูลวิถี/โอสถ/คัมภีร์/อสูรสกัดจาก Jianghu Universal Game Data Pack v1</div></div>';
    }
    return h;
  };
  UI.applyOpts = () => { const o = UI.G.opts, R = UI.G.R; R.opts.names = o.names; R.opts.bubbles = o.bubbles; R.opts.weather = o.weather; R.opts.night = o.night; try { localStorage.setItem('jhs_opts', JSON.stringify(o)); } catch (e) { } };
  UI.tool = a => {
    const G = UI.G, W = G.W, S = W.sect, m = W.byId[S.masterId];
    if (a === 'stones') { ECO.earn(W, 1000, 'ของขวัญจากผู้สังเกตการณ์'); UI.toast('มอบศิลา 1,000'); }
    else if (a === 'food') { ECO.add(W, 'grain', 300); ECO.add(W, 'meal', 100); UI.toast('มอบเสบียงแล้ว'); }
    else if (a === 'raid') { if (W.threat.raid) UI.toast('กำลังมีศัตรูบุกอยู่'); else { EXPED.spawnRaid(W, 'bandit'); UI.close(); } }
    else if (a === 'beast') { if (W.threat.raid) UI.toast('กำลังมีศัตรูบุกอยู่'); else { EXPED.spawnRaid(W, 'beast'); UI.close(); } }
    else if (a === 'recruit') { const n = EXPED.recruitApplicants(W); UI.toast(n ? 'มีผู้สมัครใหม่ ' + n + ' คน' : 'หอพักเต็มหรือขาดเสบียง ไม่มีผู้สมัคร'); }
    else if (a === 'banquet') { S.cd.banquet = 0; SECT.banquet(W, m); }
    else if (a === 'tourney') { if (!S.tournament) SECT.tournament(W, m); }
    else if (a === 'challenge') { const c = W.npcs.filter(n => !n.dead && !n.away && n.rank >= 3 && n.id !== m.id).sort((a, b) => CULT.power(b) - CULT.power(a))[0]; if (c) { W.duelQueue.push({ a: c.id, b: m.id, kind: 'leadership', serious: false }); W.log('challenge', c.h.name.given + ' ท้าชิงตำแหน่งเจ้าสำนักจาก ' + m.h.name.given + ' !', [c.id, m.id]); UI.close(); } }
    else if (a === 'heal') { W.npcs.forEach(n => { if (!n.dead) { n.h.state.hp = CULT.hpMax(n); n.inj = []; } }); UI.toast('รักษาทุกคนแล้ว'); }
  };

  /* ---------- บันทึก/โหลด ---------- */
  UI.slotInfo = () => { const out = {}; [1, 2, 3].forEach(i => { try { const m = localStorage.getItem('jhs_meta_' + i); if (m) out[i] = JSON.parse(m); } catch (e) { } }); return out; };
  UI.saveSlot = i => {
    try { UI.G.W.runtimeTiming={pendingTicks:UI.G.acc||0,speed:UI.G.speed}; UI.G.W.speed=UI.G.speed; const s = SIM.serialize(UI.G.W); localStorage.setItem('jhs_slot_' + i, s); const W = UI.G.W; localStorage.setItem('jhs_meta_' + i, JSON.stringify({ text: SIM.dateText(W.t) + ' · ' + W.npcs.filter(n => !n.dead).length + ' คน · ' + Math.round(s.length / 1024) + ' KB' })); UI.toast('บันทึกลงช่อง ' + i + ' แล้ว'); UI.render(); }
    catch (e) { UI.toast('บันทึกไม่สำเร็จ (พื้นที่เก็บเต็ม?) ลองส่งออกเป็นไฟล์แทน'); }
  };
  UI.loadSlot = i => { try { const s = localStorage.getItem('jhs_slot_' + i); if (!s) return; UI.G.load(s); UI.close(); UI.toast('โหลดช่อง ' + i + ' แล้ว'); } catch (e) { UI.toast('โหลดไม่สำเร็จ: ' + e.message); } };
  UI.exportFile = () => { UI.G.W.runtimeTiming={pendingTicks:UI.G.acc||0,speed:UI.G.speed}; UI.G.W.speed=UI.G.speed; const s = SIM.serialize(UI.G.W); const blob = new Blob([s], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'jianghu_sect_' + UI.G.W.seed + '_y' + SIM.calendar(UI.G.W.t).year + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); UI.toast('ส่งออกไฟล์แล้ว'); };

  /* ---------- หน้าเริ่มเกม ---------- */
  UI.showStart = (seed) => {
    const st = $('start'); st.classList.remove('hidden'); seed = seed || String(Math.floor(Math.random() * 90000 + 10000));
    const cands = SIM.candidates(seed);
    let h = '<h1>🏯 สำนักเมฆาหยก</h1><div class="sub">เกมจำลองสำนักยุทธภพ · NPC ทุกคนคิดและใช้ชีวิตเอง<br>เลือก “เจ้าสำนัก” ผู้กำหนดชะตาสำนัก — นิสัยของเขาจะเปลี่ยนนโยบาย การแต่งตั้ง และบรรยากาศทั้งสำนักจริง ๆ</div>';
    cands.forEach(c => { const n = c.npc, s = c.style; const top = Object.keys(s.focus).sort((a, b) => s.focus[b] - s.focus[a])[0];
      h += '<div class="cand"><div class="top">' + portraitHtml(n, 64) + '<div><div class="nm">' + esc(c.name) + '</div><div class="muted">' + esc(c.age) + ' · ' + esc(CULT.stageName(n)) + '</div><div class="muted">' + esc(c.identity.title) + '</div></div></div><div style="margin-top:6px">' + c.identity.tags.map(t => '<span class="chip v">' + esc(t) + '</span>').join('') + '</div>';
      h += '<div style="margin-top:6px">' + ['openness', 'strictness', 'meritocracy', 'expansion', 'generosity', 'secrecy'].map(k => bar(SECT.POLICY_TH[k], s[k], { wide: true, color: '#4fb2f2', txt: SECT.policyLabel(k, s[k]) })).join('') + '</div><div class="muted">จะผลักสำนักไปทาง: <b style="color:var(--gold)">' + esc(SECT.FOCUS_TH[top]) + '</b> · สนใจ' + c.identity.loves.map(esc).join(' / ') + '</div>';
      h += '<button class="btn pri" data-pick="' + c.idx + '">เลือกท่านนี้เป็นเจ้าสำนัก</button></div>'; });
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
