'use strict';
/**
 * Deterministic Before/After Screenshot & 100-NPC Renderer Performance Harness
 * Usage: node tools/capture_graphics_suite.js <before|after>
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('./cdp_playwright.js');

const mode = process.argv[2] === 'before' ? 'before' : 'after';
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'test', 'results', 'screenshots', mode);
fs.mkdirSync(outDir, { recursive: true });

function quantile(sorted, q) {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * q)));
  return Math.round(sorted[idx] * 1000) / 1000;
}

(async () => {
  const browser = await chromium.launch();
  const manifest = [];
  try {
    const context = await browser.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(e.message));

    await page.goto('file://' + path.join(root, 'index.html'));
    await page.waitForSelector('[data-pick="0"]');
    await page.click('[data-pick="0"]');

    // Initialize deterministic world seed 'graphics-audit-20261030', masterIdx 0, paused at tick 600 (10:00 Spring)
    await page.evaluate(() => {
      G.newGame('graphics-audit-20261030', 0);
      G.speed = 0;
      G.W.speed = 0;
      G.W.t = 360 * 1440 + 600;
      G.W.day = Math.floor(G.W.t / 1440);
      G.W.season = 0;
      G.W.weather = { kind: 'clear', t: G.W.t };
      const toasts = document.getElementById('toasts');
      if (toasts) toasts.innerHTML = '';
      UI.close();
      G.R.selected = G.W.sect.masterId;
      UI.updateHud(true);
    });

    async function capture(id, viewport, dpr, isMobile, setupFn, meta) {
      await page.setViewportSize(viewport, dpr, isMobile);
      await page.evaluate(setupFn);
      await page.waitForTimeout(80);
      const file = id + '.png';
      const fullPath = path.join(outDir, file);
      await page.screenshot({ path: fullPath });
      manifest.push({
        id,
        mode,
        file: `test/results/screenshots/${mode}/${file}`,
        viewport: `${viewport.width}x${viewport.height}`,
        dpr,
        isMobile,
        ...meta
      });
      console.log(`Captured [${mode}] ${file} (${viewport.width}x${viewport.height} @${dpr}x)`);
    }

    // 1. Narrow Mobile 360x800 Overview
    await capture('01_mobile_360x800_overview', { width: 360, height: 800 }, 2, true, () => {
      UI.close();
      G.W.t = 360 * 1440 + 600;
      G.W.weather = { kind: 'clear', t: G.W.t };
      G.R.selected = null;
      G.R.resize();
      G.R.focus(118, 70, 0.72);
      UI.updateHud(true);
      G.R.draw(1000);
    }, { seed: 'graphics-audit-20261030', tick: 600, camera: '118,70,z=0.72', weather: 'clear', fixture: 'natural_day_overview' });

    // 2. Standard Mobile 412x860 Overview
    await capture('02_mobile_412x860_overview', { width: 412, height: 860 }, 2, true, () => {
      UI.close();
      G.W.t = 360 * 1440 + 600;
      G.W.weather = { kind: 'clear', t: G.W.t };
      G.R.selected = null;
      G.R.resize();
      G.R.focus(118, 70, 0.72);
      UI.updateHud(true);
      G.R.draw(1000);
    }, { seed: 'graphics-audit-20261030', tick: 600, camera: '118,70,z=0.72', weather: 'clear', fixture: 'natural_day_overview' });

    // 3. Mobile 412x860 Close-up Architecture & NPC Activity
    await capture('03_mobile_412x860_detail_activity', { width: 412, height: 860 }, 2, true, () => {
      UI.close();
      G.W.t = 360 * 1440 + 600;
      G.W.weather = { kind: 'clear', t: G.W.t };
      const [m, d1, d2] = G.W.npcs;
      if (m && d1 && d2) {
        m.x = m.px = 117.5; m.y = m.py = 61.5; m.face = 1;
        m.act = { id: 'pair', stage: 'do', left: 30, total: 40, ctx: { pair: { type: 'teach', partner: d1.id, role: 'a', ready: true, left: 30 } }, why: [['ชี้แนะวิชาแก่ศิษย์', 1.2]] };
        d1.x = d1.px = 119.0; d1.y = d1.py = 61.5; d1.face = -1;
        d1.act = { id: 'pair', stage: 'do', left: 30, total: 40, ctx: { pair: { type: 'teach', partner: m.id, role: 'b', ready: true, left: 30 } }, why: [['รับคำชี้แนะจากอาจารย์', 1.1]] };
        d2.x = d2.px = 115.5; d2.y = d2.py = 63.0; d2.face = 1;
        d2.equip = d2.equip || {};
        d2.equip.WEAPON = { id: 'EQ_SWORD_1', nameTh: 'กระบี่ชิงเฟิง', slot: 'WEAPON', type: 'SWORD', tier: 2 };
        d2.act = { id: 'practice', stage: 'do', left: 45, total: 60, ctx: { skill: 'SWORD' }, why: [['ฝึกเพลงกระบี่', 0.9]] };
      }
      G.R.selected = m ? m.id : null;
      G.R.resize();
      G.R.focus(118, 56, 1.8);
      UI.updateHud(true);
      G.R.draw(1200);
    }, { seed: 'graphics-audit-20261030', tick: 600, camera: '118,56,z=1.8', weather: 'clear', fixture: 'forced_npc_activity_teach_and_sword_practice' });

    // 4. Mobile 412x860 Character Sheet (NPC Patch Inspection)
    await capture('04_mobile_412x860_character_sheet', { width: 412, height: 860 }, 2, true, () => {
      const m = G.W.byId[G.W.sect.masterId] || G.W.npcs[0];
      if (window.COG && COG.prepare) COG.prepare(G.W, m);
      UI.openNpc(m.id, 'ov');
      G.R.draw(1200);
    }, { seed: 'graphics-audit-20261030', tick: 600, sheet: 'npc:ov', fixture: 'character_sheet_with_cognition' });

    // 5. Mobile 412x860 Sect Storehouse / Inventory
    await capture('05_mobile_412x860_sect_stock', { width: 412, height: 860 }, 2, true, () => {
      UI.open('sect', 'stock');
      G.R.draw(1200);
    }, { seed: 'graphics-audit-20261030', tick: 600, sheet: 'sect:stock', fixture: 'sect_storehouse_panel' });

    // 6. Mobile 412x860 Event Log & Long Thai Combining Marks
    await capture('06_mobile_412x860_log_longname', { width: 412, height: 860 }, 2, true, () => {
      const [m, d1] = G.W.npcs;
      G.W.log('learn', m.h.name.given + ' ชี้แนะเคล็ดวิชา「มหาคัมภีร์เก้าสุริยันคุ้มชีพจรขั้นสูงสุด」แก่ ' + d1.h.name.given + ' ที่ ตำหนักใหญ่ จนเกิดความกระจ่างแจ้ง', [m.id, d1.id, 'main_hall']);
      UI.open('log');
      G.R.draw(1200);
    }, { seed: 'graphics-audit-20261030', tick: 600, sheet: 'log:all', fixture: 'thai_combining_marks_and_entity_links' });

    // 7. Desktop 1280x800 Day Overview
    await capture('07_desktop_1280x800_day_overview', { width: 1280, height: 800 }, 2, false, () => {
      UI.close();
      G.W.t = 360 * 1440 + 600;
      G.W.weather = { kind: 'clear', t: G.W.t };
      const [m, d1, d2] = G.W.npcs;
      if (m) { m.x = m.px = 115; m.y = m.py = 65; m.act = { id: 'idle', stage: 'do', left: 10, total: 10, ctx: {}, why: [['ตรวจตราความเรียบร้อยหน้าตำหนัก', 0.8]] }; }
      if (d1) { d1.x = d1.px = 117; d1.y = d1.py = 76; }
      if (d2) { d2.x = d2.px = 123; d2.y = d2.py = 79; }
      G.R.selected = m ? m.id : null;
      G.R.resize();
      G.R.focus(118, 70, 0.85);
      UI.updateHud(true);
      G.R.draw(1400);
    }, { seed: 'graphics-audit-20261030', tick: 600, camera: '118,70,z=0.85', weather: 'clear', fixture: 'desktop_day_overview' });

    // 8. Desktop 1280x800 Night + Rain
    await capture('08_desktop_1280x800_night_rain', { width: 1280, height: 800 }, 2, false, () => {
      UI.close();
      G.W.t = 360 * 1440 + 1320;
      G.W.weather = { kind: 'rain', t: G.W.t };
      G.R.resize();
      G.R.focus(118, 70, 0.85);
      UI.updateHud(true);
      G.R.draw(1600);
    }, { seed: 'graphics-audit-20261030', tick: 1320, camera: '118,70,z=0.85', weather: 'rain', fixture: 'forced_night_and_rain' });

    // 9. Landscape 860x412 Legendary Motifs & Combat Showcase
    await capture('09_landscape_860x412_legendary_fx', { width: 860, height: 412 }, 2, true, () => {
      UI.close();
      G.W.t = 360 * 1440 + 660;
      G.W.weather = { kind: 'clear', t: G.W.t };
      const [m, d1, d2] = G.W.npcs;
      G.speed = 1; G.W.speed = 1;
      G.R.resize();
      G.R.focus(118, 68, 1.55);
      if (m && d1 && d2) {
        m.x = m.px = 114; m.y = m.py = 68; m.act = { id: 'fight', stage: 'do', left: 30, total: 30, ctx: {}, why: [] };
        d1.x = d1.px = 118; d1.y = d1.py = 68; d1.act = { id: 'fight', stage: 'do', left: 30, total: 30, ctx: {}, why: [] };
        d2.x = d2.px = 122; d2.y = d2.py = 68; d2.act = { id: 'cultivate', stage: 'do', left: 30, total: 30, ctx: {}, why: [] };
        if (m.cult) {
          if (!m.cult.techs.includes('LEG_PASS_MINGYU_IMMORTAL_QI')) m.cult.techs.push('LEG_PASS_MINGYU_IMMORTAL_QI');
          m.passiveLoadout = ['LEG_PASS_MINGYU_IMMORTAL_QI'];
        }
        m.castFx = { t: G.W.t, seq: 501, kind: 'normal', motif: 'legend_dugu_sword', fxKind: 'legend_dugu_sword', legendary: true, x: 118, y: 68 };
        d1.castFx = { t: G.W.t, seq: 502, kind: 'normal', motif: 'legend_qiankun_taiji', fxKind: 'legend_qiankun_taiji', legendary: true, x: 114, y: 68 };
        d2.castFx = { t: G.W.t, seq: 503, kind: 'normal', motif: 'legend_dragon_palm', fxKind: 'legend_dragon_palm', legendary: true, x: 118, y: 66 };
      }
      G.R.updateCastEffects(2000);
      G.speed = 0; G.W.speed = 0;
      UI.updateHud(true);
      G.R.draw(2150);
    }, { seed: 'graphics-audit-20261030', tick: 660, camera: '118,68,z=1.55', weather: 'clear', fixture: 'forced_legendary_motifs_showcase' });

    // 10. Run 100-NPC Renderer & Simulation Performance Benchmark in Headless Chromium (1280x800 @2x DPR)
    await page.setViewportSize({ width: 1280, height: 800 }, 2, false);
    const perf100 = await page.evaluate(async () => {
      G.newGame('graphics-perf-100npc', 0);
      G.speed = 0; G.W.speed = 0;
      const toasts = document.getElementById('toasts'); if (toasts) toasts.innerHTML = '';
      for (const b of G.W.map.buildings) {
        if (SECT.HOUSING_IDS && SECT.HOUSING_IDS.includes(b.id)) {
          const maxL = SECT.maxBuildingLevel(b);
          while (b.level < maxL) {
            b.building = { to: b.level + 1, until: G.W.t };
            SIM.finishBuilding(G.W, b);
          }
        }
      }
      while (G.W.npcs.filter(n => !n.dead).length < 100) {
        const n = SIM.addNpc(G.W, {
          ageYears: 18 + (G.W.seqN % 28),
          quality: 0.65,
          rank: G.W.seqN % 4,
          stage: 1 + (G.W.seqN % 3)
        });
        const pl = G.W.map.byId.plaza;
        SIM.placeNear(G.W, n, pl.x + pl.w / 2, pl.y + pl.h / 2, 16);
        n.act.left = G.W.seqN % 40;
      }
      // Warm up 60 ticks and 10 draw frames so chunk & building caches are warm
      for (let i = 0; i < 60; i++) SIM.tick(G.W);
      G.R.resize();
      G.R.focus(118, 70, 0.85);
      for (let f = 0; f < 10; f++) G.R.draw(3000 + f * 16);

      const simSamples = [];
      const drawDaySamples = [];
      const drawNightRainSamples = [];

      for (let i = 0; i < 60; i++) {
        const t0 = performance.now();
        SIM.tick(G.W);
        simSamples.push(performance.now() - t0);
      }
      for (let i = 0; i < 30; i++) {
        await new Promise(r => requestAnimationFrame(r));
        const d0 = performance.now();
        G.R.draw(4000 + i * 16);
        drawDaySamples.push(performance.now() - d0);
      }

      G.W.t = 1320;
      G.W.weather = { kind: 'rain', t: G.W.t };
      for (let w = 0; w < 4; w++) G.R.draw(5500 + w * 16);
      for (let i = 0; i < 30; i++) {
        await new Promise(r => requestAnimationFrame(r));
        const d0 = performance.now();
        G.R.draw(6000 + i * 16);
        drawNightRainSamples.push(performance.now() - d0);
      }

      simSamples.sort((a, b) => a - b);
      drawDaySamples.sort((a, b) => a - b);
      drawNightRainSamples.sort((a, b) => a - b);

      return {
        population: G.W.npcs.filter(n => !n.dead).length,
        simSamples,
        drawDaySamples,
        drawNightRainSamples,
        chunkCacheSize: G.R.chunks.size,
        buildingSpriteCacheSize: G.R.buildingSprites.size
      };
    });

    const summary = {
      mode,
      capturedAt: new Date().toISOString(),
      pageErrors,
      screenshots: manifest,
      perf100Npc: {
        population: perf100.population,
        simMsMedian: quantile(perf100.simSamples, 0.5),
        simMsP95: quantile(perf100.simSamples, 0.95),
        drawDayMsMedian: quantile(perf100.drawDaySamples, 0.5),
        drawDayMsP95: quantile(perf100.drawDaySamples, 0.95),
        drawNightRainMsMedian: quantile(perf100.drawNightRainSamples, 0.5),
        drawNightRainMsP95: quantile(perf100.drawNightRainSamples, 0.95),
        chunkCacheSize: perf100.chunkCacheSize,
        buildingSpriteCacheSize: perf100.buildingSpriteCacheSize
      }
    };

    const manifestPath = path.join(root, 'test', 'results', `graphics_${mode}_manifest.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(summary, null, 2) + '\n');
    console.log(`Saved ${manifestPath}:`, JSON.stringify(summary.perf100Npc));
  } finally {
    await browser.close();
  }
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
