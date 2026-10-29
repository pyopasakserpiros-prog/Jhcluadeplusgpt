/* main.js — ลูปเกม, ท่าทางสัมผัส, มินิแมป, บันทึกอัตโนมัติ */
(function (g) {
  'use strict';
  const U = g.U, SIM = g.SIM, HC = g.HC, MAP = g.MAP, Render = g.Render, UI = g.UI;
  const $ = id => document.getElementById(id);
  const TS = 16, TICKS_PER_SEC = 4, SIM_BUDGET_MS = 12;
  const G = { W: null, R: null, speed: 1, acc: 0, opts: { names: true, bubbles: true, weather: true, night: true, toast: true, autosave: true }, muted: false, lastAuto: 0, lastRender: 0, err: null };
  let last = null;
  g.G = G;
  try { const o = JSON.parse(localStorage.getItem('jhs_opts') || 'null'); if (o) Object.assign(G.opts, o); } catch (e) { }

  function syncRuntimeTiming() {
    if (!G.W) return;
    G.W.speed = G.speed;
    G.W.runtimeTiming = { pendingTicks: G.acc, speed: G.speed };
  }
  function bindWorld(W) {
    G.W = W; W.onLog = e => { if (G.opts.toast) UI.onLog(e); }; HC.nowDay = W.day;
    G.R.setWorld(W); G.R.selected = null; G.R.follow = false; G.R.resize(); G.R.focus(118, 70, 1.0); G.R.clampCam();
    const timing = W.runtimeTiming || {};
    G.acc = Number.isFinite(timing.pendingTicks) && timing.pendingTicks >= 0 ? timing.pendingTicks : 0;
    const savedSpeed = Number.isFinite(timing.speed) && timing.speed >= 0 ? timing.speed : W.speed;
    G.speed = Number.isFinite(savedSpeed) && savedSpeed >= 0 ? savedSpeed : 1;
    last = performance.now();
    syncRuntimeTiming();
    UI.applyOpts(); G.lastRender = 0; UI.updateHud(true);
    G.err = null; G.errShown = 0;
  }
  G.newGame = (seed, idx) => {
    const W = SIM.create(seed, { masterIdx: idx });
    bindWorld(W); const m = W.byId[W.sect.masterId]; G.R.focus(m.x, m.y, 1.1);
    UI.toast('ยินดีต้อนรับ เจ้าสำนัก ' + m.h.name.given + ' — แตะตัวละครเพื่อดูว่าเขากำลังคิดอะไรอยู่');
  };
  G.load = str => { const W = SIM.deserialize(str); bindWorld(W); };
  G.autosave = () => { try { if (!G.W) return; syncRuntimeTiming(); localStorage.setItem('jhs_auto', SIM.serialize(G.W)); localStorage.setItem('jhs_auto_meta', SIM.dateText(G.W.t)); } catch (e) { } };

  /* ---------- ลูปหลัก ---------- */
  function frame(ts) {
    requestAnimationFrame(frame);
    const R = G.R; if (!R) return;
    // เก็บเวลาที่ผ่านไปทั้งหมด แม้เฟรมก่อนหน้าช้า; จำกัดงานด้วยงบประมวลผลด้านล่าง
    const dt = Number.isFinite(ts) && Number.isFinite(last) ? Math.max(0, (ts - last) / 1000) : 0;
    if (Number.isFinite(ts)) last = ts;
    try {
      if (G.W && !UI.paused) {
        G.W.speed = G.speed;
        if (G.speed > 0) {
          // เก็บ tick ที่ยังประมวลผลไม่ทันไว้ใน accumulator แทนการทิ้งเวลาเงียบ ๆ
          G.acc += dt * G.speed * TICKS_PER_SEC;
          const t0 = performance.now();
          while (G.acc >= 1) {
            SIM.tick(G.W); G.acc -= 1;
            // จำกัดเวลาจำลองต่อเฟรมเพื่อให้ยังตอบสนองต่อการแตะ/ลากได้บนมือถือ
            if (performance.now() - t0 >= SIM_BUDGET_MS) break;
          }
          R.alpha = G.speed >= 16 ? 1 : Math.min(1, G.acc);
        } else R.alpha = 1;
        syncRuntimeTiming();
        if (G.opts.autosave && ts - G.lastAuto > 180000) { G.lastAuto = ts; G.autosave(); }
        // ที่ 16×/32× ลดอัตราวาดภาพเพื่อคืนเวลาประมวลผลให้ NPC; ไม่ลดจำนวน tick จำลอง
        const renderEvery = G.speed >= 32 ? 1000 / 30 : G.speed >= 16 ? 1000 / 40 : 0;
        if (!renderEvery || !G.lastRender || ts - G.lastRender >= renderEvery) {
          R.draw(ts); drawMini(); G.lastRender = ts;
        }
        UI.updateHud(); UI.tick();
      }
    } catch (e) { G.err = e; console.error(e); if (!G.errShown) { G.errShown = 1; UI.toast('เกิดข้อผิดพลาด: ' + e.message + ' (หยุดเกมไว้ชั่วคราว — ลองบันทึก/โหลดใหม่)'); G.speed = 0; } }
    syncRuntimeTiming();
  }

  /* ---------- มินิแมป ---------- */
  function drawMini() {
    const cv = $('minimap'), R = G.R, W = G.W; if (!W) return; const dpr = 1;
    if (cv.width !== 184) { cv.width = 184; cv.height = 123; }
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(R.getMini(), 0, 0, 184, 123);
    const sx = 184 / MAP.W, sy = 123 / MAP.H;
    W.npcs.forEach(n => { if (n.dead || n.away) return; c.fillStyle = n.id === R.selected ? '#fff' : n.rank >= 4 ? '#f0cf4a' : n.cult ? (n.cult.path === 'BODY' ? '#f0714f' : n.cult.path === 'GOD' ? '#e8c43a' : n.cult.path === 'DEMON' ? '#e599f7' : n.cult.path === 'HEART_SOUL' ? '#a5d8ff' : '#4fb2f2') : '#ccc'; c.fillRect(n.x * sx - 1, n.y * sy - 1, 2.4, 2.4); });
    (W.foes || []).forEach(f => { if (f.dead || f.gone) return; c.fillStyle = '#ff3b30'; c.fillRect(f.x * sx - 1.5, f.y * sy - 1.5, 3, 3); });
    const cam = R.cam, hw = R.vw / 2 / cam.z / TS, hh = R.vh / 2 / cam.z / TS; c.strokeStyle = '#fff'; c.lineWidth = 1; c.strokeRect((cam.x / TS - hw) * sx, (cam.y / TS - hh) * sy, hw * 2 * sx, hh * 2 * sy);
  }
  function miniNav(e) { const r = $('minimap').getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * MAP.W, y = (e.clientY - r.top) / r.height * MAP.H; G.R.follow = false; G.R.focus(x, y); e.preventDefault(); e.stopPropagation(); }

  /* ---------- ท่าทางสัมผัส ---------- */
  function bindTouch(cv) {
    const ptrs = new Map(); let moved = 0, startT = 0, startPt = null, pinch = null;
    cv.addEventListener('pointerdown', e => { try { cv.setPointerCapture(e.pointerId); } catch (x) {} ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 1) { moved = 0; startT = performance.now(); startPt = { x: e.clientX, y: e.clientY }; } if (ptrs.size === 2) { moved = 99; const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) }; } });
    cv.addEventListener('pointermove', e => {
      const p = ptrs.get(e.pointerId); if (!p || !G.R) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      if (ptrs.size === 1) { moved += Math.abs(dx) + Math.abs(dy); if (moved > 6) G.R.panBy(dx, dy); }
      else if (ptrs.size === 2 && pinch) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch.d > 0) { const r = cv.getBoundingClientRect(); G.R.zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, d / pinch.d); } pinch.d = d; moved = 99; }
    });
    const up = e => {
      if (!ptrs.has(e.pointerId)) return; ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null;
      if (e.type === 'pointerup' && ptrs.size === 0 && moved <= 6 && performance.now() - startT < 500 && G.R && G.W) {
        const r = cv.getBoundingClientRect(); const hit = G.R.pickAt(e.clientX - r.left, e.clientY - r.top);
        if (hit) {
          if (hit.kind === 'npc') { G.R.selected = hit.id; UI.updateHud(true); }
          else if (hit.kind === 'building') UI.openBuilding(hit.id);
          else if (hit.kind === 'foe') { const f = G.W.foeById[hit.id]; if (f) UI.toast('ศัตรู: ' + (f.nameTh || f.name || 'ผู้บุกรุก')); }
          else if (hit.kind === 'resource') {
            const rn = hit.res || (G.W.wildResources?.nodes || []).find(n => n.id === hit.id);
            if (rn) {
              const matName = (g.ECO && g.ECO.name ? g.ECO.name(rn.materialId) : rn.materialId);
              UI.toast('🌱 แหล่งทรัพยากร: ' + matName + ' (เหลือ ' + rn.remaining + '/' + rn.initial + ' หน่วย)');
            }
          }
        } else { G.R.selected = null; G.R.follow = false; UI.updateHud(true); }
      }
    };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', e => { e.preventDefault(); const r = cv.getBoundingClientRect(); G.R.zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });
  }

  function boot() {
    const cv = $('map'); G.R = Render.create(cv); UI.init(G); bindTouch(cv);
    const mm = $('minimap'); mm.addEventListener('pointerdown', e => { try { mm.setPointerCapture(e.pointerId); } catch (x) {} mm._d = 1; miniNav(e); }); mm.addEventListener('pointermove', e => { if (mm._d) miniNav(e); }); mm.addEventListener('pointerup', () => mm._d = 0); mm.addEventListener('pointercancel', () => mm._d = 0); mm.addEventListener('lostpointercapture', () => mm._d = 0);
    window.addEventListener('resize', () => { G.R.resize(); }); window.addEventListener('orientationchange', () => setTimeout(() => G.R.resize(), 250));
    document.addEventListener('visibilitychange', () => { if (document.hidden) G.autosave(); });
    G.R.resize(); UI.showStart(); requestAnimationFrame(frame);
  }
  g.addEventListener('error', e => { try { UI.toast('ข้อผิดพลาด: ' + e.message); } catch (x) { } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window);
