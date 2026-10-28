/* render.js — วาดโลก 2D ด้วย Canvas: ภูมิประเทศแบบแคชเป็นก้อน (chunk), อาคาร, ตัวละครแบบ procedural พร้อมท่าทางตามกิจกรรม,
 * กลางวัน/กลางคืน, ฤดู, สภาพอากาศ  ไม่มีไฟล์ภาพภายนอก ทุกอย่างวาดจากโค้ด (ทำงานแบบออฟไลน์ได้) */
(function (g) {
  'use strict';
  const U = g.U, MAP = g.MAP, HC = g.HC, CULT = g.CULT, SECT = g.SECT, AI = g.AI;
  const clamp = U.clamp, T = MAP.T, TS = 16;
  const R = {};
  const FONT = '"Noto Sans Thai","Sarabun","Leelawadee UI",system-ui,sans-serif';
  const TW_CACHE = new Map();
  function measureCached(ctx, font, text) {
    const k = font + "|" + text;
    let w = TW_CACHE.get(k);
    if (w === undefined) {
      if (TW_CACHE.size > 2000) TW_CACHE.clear();
      w = ctx.measureText(text).width;
      TW_CACHE.set(k, w);
    }
    return w;
  }

  const PATH_COL = { XIAN: '#62b9dc', BODY: '#e88463', GOD: '#eac561', DEMON: '#b795db', HEART_SOUL: '#9ecdd4' };
  const ROBE_MORTAL = '#d2b799';
  const hash2 = (x, y) => { let h = Math.imul(x, 73856093) ^ Math.imul(y, 19349663); h = Math.imul(h ^ (h >>> 13), 0x5bd1e995); return ((h ^ (h >>> 15)) >>> 0) / 4294967296; };
  function meadowNoise(x, y) {
    const ix = Math.floor(x / 12), iy = Math.floor(y / 12), fx = x / 12 - ix, fy = y / 12 - iy;
    const a = fx * fx * (3 - 2 * fx), b = fy * fy * (3 - 2 * fy);
    return (hash2(ix, iy) * (1 - a) + hash2(ix + 1, iy) * a) * (1 - b) + (hash2(ix, iy + 1) * (1 - a) + hash2(ix + 1, iy + 1) * a) * b;
  }
  function shade(hex, f) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g2 = (n >> 8) & 255, b = n & 255; if (f >= 0) { r += (255 - r) * f; g2 += (255 - g2) * f; b += (255 - b) * f; } else { r *= 1 + f; g2 *= 1 + f; b *= 1 + f; } return 'rgb(' + (r | 0) + ',' + (g2 | 0) + ',' + (b | 0) + ')'; }
  R.shade = shade;

  /* ---------- สีภูมิประเทศตามฤดู ---------- */
  const GRASS = [['#a6c983', '#9fc57c', '#accf89'], ['#91bb74', '#8ab46d', '#99c17b'], ['#c8bc7c', '#c1b575', '#d0bf84'], ['#e2ebe5', '#dce6e1', '#e9efea']];
  function tileColor(t, x, y, season) {
    // Broad patches keep the meadow calm at overview scale; fine detail is cached below.
    const v = hash2(Math.floor(x / 3), Math.floor(y / 3)), i = v < 0.34 ? 0 : v < 0.67 ? 1 : 2;
    switch (t) {
      case T.GRASS: return shade(GRASS[season][0], (meadowNoise(x, y) - 0.5) * 0.16);
      case T.ROAD: return ['#dfd2ae', '#dbceaa', '#e4d8b7'][i];
      case T.WATER: return ['#69b9bb', '#62b2b5', '#74c2c0'][i];
      case T.CLIFF: return ['#748b82', '#6d837d', '#7f948b'][i];
      case T.FOREST: return ['#638d6c', '#5c8666', '#6c9774'][i];
      case T.WALL: return ['#adaf99', '#a4a891', '#b9baa4'][i];
      case T.FLOOR: return ['#cba978', '#c4a272', '#d4b383'][i];
      case T.FARM: return ['#a37d53', '#9b764f', '#ad875c'][i];
      case T.DIRT: return ['#cfb584', '#c8ad7e', '#d8bf90'][i];
      case T.PLAZA: return ['#e5dbc2', '#ded4bb', '#ebe1c9'][i];
      case T.ARCH: return ['#c7b58e', '#c0ad86', '#cfbd97'][i];
      case T.SAND: return ['#e6d5a5', '#dfcfa0', '#ecddb3'][i];
      case T.MOSS: return ['#86ac87', '#7fa482', '#8eb48d'][i];
    }
    return '#f0f';
  }

  /* ---------- ก้อนภูมิประเทศ (chunk cache) ---------- */
  const CH = 16;
  function newCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function buildChunk(R_, cx, cy, S) {
    const M = R_.W.map, season = R_.W.season, px = TS * S;
    const cv = newCanvas(CH * px, CH * px), c = cv.getContext('2d');
    for (let ty = 0; ty < CH; ty++) for (let tx = 0; tx < CH; tx++) {
      const x = cx * CH + tx, y = cy * CH + ty; if (x >= MAP.W || y >= MAP.H) continue;
      const k = y * MAP.W + x, t = M.terrain[k];
      c.fillStyle = tileColor(t, x, y, season); c.fillRect(tx * px, ty * px, px + 0.5, px + 0.5);
      const v = hash2(x * 7 + 1, y * 13 + 5);
      if (t === T.GRASS || t === T.MOSS) { // Cached brush-like tufts, with clear path edges.
        if (v < 0.19) {
          const gx = tx * px + (3 + v * 37 % 9) * S, gy = ty * px + (5 + v * 71 % 8) * S;
          c.strokeStyle = season === 3 ? 'rgba(124,151,150,.25)' : 'rgba(66,111,64,.28)'; c.lineWidth = 0.8 * S;
          c.beginPath(); c.moveTo(gx - 2 * S, gy); c.quadraticCurveTo(gx - 3 * S, gy - 3 * S, gx - 4 * S, gy - 3 * S); c.moveTo(gx, gy); c.lineTo(gx, gy - 4 * S); c.moveTo(gx + S, gy); c.quadraticCurveTo(gx + 2 * S, gy - 3 * S, gx + 3 * S, gy - 2 * S); c.stroke();
        }
        if (season !== 3 && v > 0.97) { c.fillStyle = 'rgba(255,244,193,.8)'; c.beginPath(); c.arc(tx * px + 6 * S, ty * px + 8 * S, S, 0, 7); c.fill(); }
      } else if (t === T.ROAD) {
        c.strokeStyle = 'rgba(123,108,78,.16)'; c.lineWidth = 0.65 * S; c.beginPath(); c.moveTo(tx * px, ty * px + px - .5 * S); c.lineTo(tx * px + px, ty * px + px - .5 * S); if ((x + (y & 1)) % 2 === 0) { c.moveTo(tx * px, ty * px); c.lineTo(tx * px, ty * px + px); } c.stroke();
        c.fillStyle = 'rgba(255,252,224,.2)'; c.fillRect(tx * px + 2 * S, ty * px + S, px - 3 * S, S);
      } else if (t === T.PLAZA) {
        c.strokeStyle = 'rgba(137,128,102,.2)'; c.lineWidth = 0.6 * S; c.strokeRect(tx * px + 0.5 * S, ty * px + 0.5 * S, px - S, px - S);
        c.fillStyle = 'rgba(255,255,237,.24)'; c.fillRect(tx * px + S, ty * px + S, px - 2 * S, S);
      } else if (t === T.WATER) {
        c.fillStyle = 'rgba(255,255,255,.13)'; if (v < 0.4) c.fillRect(tx * px + 2 * S, ty * px + (v * 30 % 12) * S, 6 * S, 1.2 * S);
      } else if (t === T.FARM) {
        c.fillStyle = 'rgba(91,62,40,.18)'; for (let i = 0; i < 3; i++) c.fillRect(tx * px + (1 + i * 5) * S, ty * px, 2 * S, px);
        c.strokeStyle = season === 3 ? '#e3e8d6' : season === 2 ? '#e5c45c' : '#badc72'; c.lineWidth = 1.2 * S;
        if (season !== 3 || v < 0.5) for (let i = 0; i < 3; i++) { const fx = tx * px + (3 + i * 5) * S, fy = ty * px + 12 * S; c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx, fy - 8 * S); c.moveTo(fx, fy - 3 * S); c.lineTo(fx - 2 * S, fy - 6 * S); c.moveTo(fx, fy - 5 * S); c.lineTo(fx + 2 * S, fy - 8 * S); c.stroke(); }
      } else if (t === T.DIRT) {
        if (v < 0.3) { c.fillStyle = 'rgba(60,40,20,.18)'; c.fillRect(tx * px + v * 30 % 10 * S, ty * px + (v * 71 % 12) * S, 3 * S, 2 * S); }
      } else if (t === T.WALL) {
        c.strokeStyle = 'rgba(40,35,30,.4)'; c.lineWidth = 0.8 * S; c.strokeRect(tx * px + 0.5, ty * px + 0.5, px - 1, px - 1);
        c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(tx * px, ty * px, px, 3 * S);
        c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(tx * px, ty * px + px - 3 * S, px, 3 * S);
      } else if (t === T.CLIFF) {
        c.fillStyle = 'rgba(0,0,0,.18)'; if (v < 0.5) c.fillRect(tx * px, ty * px + 6 * S, px, 4 * S);
        if (season === 3) { c.fillStyle = 'rgba(235,240,248,.5)'; c.fillRect(tx * px, ty * px, px, 5 * S); }
      } else if (t === T.FLOOR) {
        c.strokeStyle = 'rgba(60,40,20,.2)'; c.lineWidth = 0.7 * S; c.beginPath(); c.moveTo(tx * px, ty * px + px / 2); c.lineTo(tx * px + px, ty * px + px / 2); c.stroke();
      } else if (t === T.SAND) { c.fillStyle = 'rgba(160,130,70,.2)'; if (v < 0.2) c.fillRect(tx * px + 4 * S, ty * px + 5 * S, 2 * S, 2 * S); }
      // A narrow verge anchors stone paths and ponds into the meadow without extra draw passes.
      if (t === T.ROAD || t === T.PLAZA || t === T.WATER) {
        c.fillStyle = t === T.WATER ? 'rgba(44,113,106,.21)' : 'rgba(113,121,77,.14)';
        const edge = (nx, ny) => nx >= 0 && ny >= 0 && nx < MAP.W && ny < MAP.H && M.terrain[ny * MAP.W + nx] !== t;
        if (edge(x - 1, y)) c.fillRect(tx * px, ty * px, S, px);
        if (edge(x + 1, y)) c.fillRect(tx * px + px - S, ty * px, S, px);
        if (edge(x, y - 1)) c.fillRect(tx * px, ty * px, px, S);
        if (edge(x, y + 1)) c.fillRect(tx * px, ty * px + px - S, px, S);
      }
    }
    // ของตกแต่ง
    const x0 = cx * CH, y0 = cy * CH;
    M.decor.forEach(d => { if (d.x < x0 || d.x >= x0 + CH || d.y < y0 || d.y >= y0 + CH) return; if (d.kind === 'lantern' || d.kind === 'banner' || d.kind === 'fountain') return; drawDecor(c, d, (d.x - x0) * px, (d.y - y0) * px, S, season); });
    // สถานีกลางแจ้ง (ของประกอบฉาก)
    M.stations.forEach(s => { if (s.inside || s.x < x0 || s.x >= x0 + CH || s.y < y0 || s.y >= y0 + CH) return; drawStationProp(c, s, (s.x - x0) * px, (s.y - y0) * px, S); });
    return cv;
  }
  function drawDecor(c, d, x, y, S, season) {
    const u = TS * S, cx = x + u / 2, base = y + u * .92, sc = d.s;
    const ellipse = (px, py, rx, ry, col) => { c.fillStyle = col; c.beginPath(); c.ellipse(px, py, rx, ry, 0, 0, 7); c.fill(); };
    if (d.kind === 'pine' || d.kind === 'blossom' || d.kind === 'bamboo' || d.kind === 'rock') ellipse(cx + 2 * S, base + S, u * .46 * sc, u * .15, 'rgba(47,83,62,.19)');
    if (d.kind === 'pine') {
      c.fillStyle = '#866343'; c.fillRect(cx - 1.1 * S, base - u * .43 * sc, 2.2 * S, u * .45 * sc);
      const cols = season === 2 ? ['#b08243', '#c69b52', '#d6b165'] : season === 3 ? ['#668c82', '#81a89a', '#b3c9b4'] : ['#427c65', '#559675', '#72af81'];
      for (let i = 0; i < 3; i++) {
        const w = u * (.55 - i * .12) * sc, yy = base - u * (.34 + i * .26) * sc, top = yy - u * .46 * sc;
        c.fillStyle = cols[i]; c.beginPath(); c.moveTo(cx, top); c.quadraticCurveTo(cx - w * .32, yy - u * .09, cx - w, yy + u * .06); c.quadraticCurveTo(cx - w * .5, yy + u * .27, cx, yy + u * .19); c.quadraticCurveTo(cx + w * .72, yy + u * .25, cx + w, yy + u * .05); c.quadraticCurveTo(cx + w * .32, yy - u * .09, cx, top); c.fill();
        c.fillStyle = season === 3 ? '#edf0e4' : 'rgba(181,219,143,.31)'; c.beginPath(); c.moveTo(cx, top + S); c.quadraticCurveTo(cx - w * .4, yy - u * .01, cx - w * .74, yy + u * .02); c.quadraticCurveTo(cx - w * .25, yy + u * .04, cx + w * .12, yy - u * .05); c.closePath(); c.fill();
      }
    } else if (d.kind === 'blossom') {
      c.strokeStyle = '#8c6a53'; c.lineWidth = 2.3 * S; c.beginPath(); c.moveTo(cx, base); c.quadraticCurveTo(cx + 2 * S, base - u * .4 * sc, cx - S, base - u * .85 * sc); c.moveTo(cx, base - u * .32); c.lineTo(cx - u * .24, base - u * .68 * sc); c.stroke();
      const cols = season === 0 ? ['#d98fa8', '#eaaac0', '#f5c8d4', '#ffe0df'] : season === 1 ? ['#57916d', '#77aa7a', '#9bc68b', '#bfd89c'] : season === 2 ? ['#be8751', '#daa263', '#ecc17a', '#f5d593'] : ['#b3c2bb', '#ccd7ce', '#e6eae0', '#f2f1e6'];
      ellipse(cx, base - u * .77 * sc, u * .48 * sc, u * .39 * sc, cols[0]);
      [[-.27,-.77,.29], [.23,-.82,.33], [0,-1.04,.3], [-.13,-.97,.27]].forEach((o,i) => ellipse(cx + o[0] * u * sc, base + o[1] * u * sc, o[2] * u * sc, o[2] * u * sc * .88, cols[1 + i % 3]));
      ellipse(cx - u * .19 * sc, base - u * 1.03 * sc, u * .14 * sc, u * .07 * sc, 'rgba(255,250,224,.43)');
      if (season === 0) { c.fillStyle = '#fff0df'; for (let i = 0; i < 4; i++) { const r = hash2(d.x + i, d.y); c.fillRect(cx + (r - .5) * u * .65, base - u * (.65 + r * .5) * sc, 1.1 * S, S); } }
    } else if (d.kind === 'bamboo') {
      for (let i = 0; i < 3; i++) {
        const bx = cx + (i - 1) * u * .2, top = base - u * (.88 + i * .1) * sc;
        c.strokeStyle = '#67976b'; c.lineWidth = 1.5 * S; c.beginPath(); c.moveTo(bx, base); c.lineTo(bx + S, top); c.stroke();
        for (let j = 1; j <= 3; j++) {
          const yy = base - j * (base - top) / 4; c.fillStyle = '#cee1a0'; c.fillRect(bx - S, yy, 2.3 * S, .7 * S);
          c.strokeStyle = j % 2 ? '#588c64' : '#85b278'; c.lineWidth = S; c.beginPath(); c.moveTo(bx, yy); c.quadraticCurveTo(bx + u * .2, yy - u * .22, bx + u * .3, yy - u * .13); c.moveTo(bx, yy - 2 * S); c.quadraticCurveTo(bx - u * .22, yy - u * .22, bx - u * .27, yy - u * .12); c.stroke();
        }
      }
    } else if (d.kind === 'rock') {
      c.fillStyle = '#82968d'; c.beginPath(); c.moveTo(cx - u * .36 * sc, base); c.lineTo(cx - u * .25 * sc, base - u * .29 * sc); c.quadraticCurveTo(cx, base - u * .53 * sc, cx + u * .21 * sc, base - u * .3 * sc); c.lineTo(cx + u * .36 * sc, base); c.closePath(); c.fill();
      c.fillStyle = season === 3 ? '#ebeee3' : '#b5c2a9'; c.beginPath(); c.moveTo(cx - u * .25 * sc, base - u * .29 * sc); c.quadraticCurveTo(cx, base - u * .53 * sc, cx + u * .21 * sc, base - u * .3 * sc); c.lineTo(cx - u * .05, base - u * .12); c.closePath(); c.fill();
      if (season !== 3) ellipse(cx - u * .19, base - S, u * .14, S, '#769a6a');
    } else if (d.kind === 'flower' && season !== 3) {
      const fx = x + d.r * u, fy = y + (d.r * 7 % 1) * u;
      c.strokeStyle = '#6d9b64'; c.lineWidth = .7 * S; c.beginPath(); c.moveTo(fx, fy + 2 * S); c.lineTo(fx, fy); c.stroke();
      ellipse(fx - S, fy, 1.4 * S, S, ['#f5bdcc', '#fff0bb', '#d3bdec', '#ffd6a4'][(d.r * 4) | 0]);
      ellipse(fx + S, fy - .7 * S, 1.3 * S, S, ['#f5bdcc', '#fff0bb', '#d3bdec', '#ffd6a4'][(d.r * 4) | 0]);
      ellipse(fx, fy, .65 * S, .65 * S, '#f3d18a');
    }
  }
  function drawStationProp(c, s, x, y, S) {
    const u = TS * S, cx = x + u / 2, cy = y + u / 2;
    if (s.kind === 'dummy') { c.fillStyle = '#6a4a2a'; c.fillRect(cx - u * .06, cy - u * .45, u * .12, u * .8); c.fillStyle = '#c9a56b'; c.fillRect(cx - u * .2, cy - u * .35, u * .4, u * .2); c.fillStyle = '#e0c590'; c.fillRect(cx - u * .13, cy - u * .55, u * .26, u * .16); }
    else if (s.kind === 'lift') { c.fillStyle = '#777'; c.fillRect(cx - u * .28, cy - u * .1, u * .56, u * .18); c.fillStyle = '#555'; c.fillRect(cx - u * .34, cy - u * .2, u * .12, u * .38); c.fillRect(cx + u * .22, cy - u * .2, u * .12, u * .38); }
    else if (s.kind === 'spar') { c.strokeStyle = 'rgba(80,50,20,.5)'; c.lineWidth = 1.2 * S; c.strokeRect(cx - u * .42, cy - u * .42, u * .84, u * .84); }
    else if (s.kind === 'mine') { c.fillStyle = '#6a6a72'; c.beginPath(); c.arc(cx, cy, u * .3, 0, 7); c.fill(); c.fillStyle = '#9ad3ff'; c.fillRect(cx - u * .05, cy - u * .1, u * .1, u * .1); }
    else if (s.kind === 'fish') { c.fillStyle = '#6a4a2a'; c.fillRect(cx - u * .4, cy - u * .06, u * .8, u * .12); }
    else if (s.kind === 'meditate' || s.kind === 'worship') { c.fillStyle = '#c4a45a'; c.beginPath(); c.ellipse(cx, cy + u * .1, u * .3, u * .15, 0, 0, 7); c.fill(); }
    else if (s.kind === 'music') { c.fillStyle = '#8a5a3a'; c.fillRect(cx - u * .25, cy - u * .1, u * .5, u * .22); }
    else if (s.kind === 'chat') { c.fillStyle = '#7a5a3a'; c.fillRect(cx - u * .3, cy - u * .06, u * .6, u * .12); c.fillStyle = '#e8e0c8'; c.beginPath(); c.arc(cx - u * .15, cy - u * .14, u * .06, 0, 7); c.arc(cx + u * .15, cy - u * .14, u * .06, 0, 7); c.fill(); }
    else if (s.kind === 'pray') { c.fillStyle = '#e8d8a0'; c.fillRect(cx - u * .05, cy - u * .3, u * .1, u * .4); c.fillStyle = '#e04030'; c.fillRect(cx - u * .05, cy - u * .36, u * .1, u * .06); }
  }

  // Static architecture is rasterized once per zoom scale, just like the ground.
  // New tile detail adds no per-frame tile loops on phones.
  function buildingStyle(type) {
    if (type === 'shrine') return { roof: '#739d82', wall: '#f0dfaf', wood: '#9a6244' };
    if (type === 'discipline' || type === 'ancestral' || type === 'forge' || type === 'mine') return { roof: '#50766f', wall: '#d9d1b8', wood: '#805b48' };
    if (type === 'dorm_core' || type === 'tea_garden') return { roof: '#579593', wall: '#edddc2', wood: '#a56e51' };
    if (type === 'main_hall') return { roof: '#438e86', wall: '#f0d8a6', wood: '#a26343' };
    return { roof: '#5c9990', wall: '#eddfbd', wood: '#99664b' };
  }
  function buildingMetrics(b) {
    const w = b.w * TS, h = b.h * TS, roofH = h * .62, wallH = h - roofH + 6;
    return { w, h, roofH, wallH, wallTop: h - wallH, cols: Math.max(2, Math.round(w / 52)) };
  }
  function buildingWindows(c, m, lit) {
    const bay = m.w / m.cols, wh = Math.max(8, m.wallH - 31), wy = m.wallTop + 18;
    for (let i = 0; i < m.cols; i++) {
      const wx = i * bay + bay * .2, ww = bay * .6;
      c.fillStyle = '#bb9666'; c.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);
      c.fillStyle = lit ? '#f3d298' : '#628783'; c.fillRect(wx, wy, ww, wh);
      c.fillStyle = lit ? '#fff0c7' : '#88aaa0'; c.fillRect(wx + 1, wy + 1, ww - 2, Math.max(3, wh * .28));
      c.strokeStyle = lit ? '#b98b55' : '#b9ae87'; c.lineWidth = .9;
      c.beginPath(); for (let j = 1; j < 4; j++) { c.moveTo(wx + ww * j / 4, wy); c.lineTo(wx + ww * j / 4, wy + wh); }
      c.moveTo(wx, wy + wh * .35); c.lineTo(wx + ww, wy + wh * .35); c.moveTo(wx, wy + wh * .7); c.lineTo(wx + ww, wy + wh * .7); c.stroke();
      c.fillStyle = '#9a7a55'; c.fillRect(wx - 3, wy + wh + 2, ww + 6, 2);
    }
  }
  function buildBuildingSprite(b, S) {
    const m = buildingMetrics(b), { w, h, roofH, wallH, wallTop, cols } = m, style = buildingStyle(b.type);
    const cv = newCanvas((w + 44) * S, (h + 62) * S), c = cv.getContext('2d'); c.scale(S, S); c.translate(20, 40);
    c.fillStyle = 'rgba(49,79,60,.14)'; c.beginPath(); c.ellipse(w / 2 + 8, h + 7, w * .57, 10, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(54,71,58,.15)'; c.beginPath(); c.moveTo(0, h); c.lineTo(w + 6, h); c.lineTo(w + 15, h + 12); c.lineTo(12, h + 12); c.closePath(); c.fill();
    c.fillStyle = '#b5aa89'; c.fillRect(-3, h - 4, w + 6, 9); c.fillStyle = '#ded4b5'; c.fillRect(-4, h - 5, w + 8, 3);
    const wg = c.createLinearGradient(0, wallTop, 0, h); wg.addColorStop(0, '#cbb88f'); wg.addColorStop(.3, style.wall); wg.addColorStop(1, shade(style.wall, -.06)); c.fillStyle = wg; c.fillRect(0, wallTop, w, wallH - 5);
    c.fillStyle = 'rgba(84,83,53,.13)'; c.fillRect(w - 9, wallTop, 9, wallH - 5);
    buildingWindows(c, m, false);
    for (let i = 0; i <= cols; i++) {
      const px = i * (w - 5) / cols; c.fillStyle = style.wood; c.fillRect(px, wallTop, 5, wallH - 5); c.fillStyle = 'rgba(255,223,167,.32)'; c.fillRect(px + .7, wallTop, 1, wallH - 6);
      c.fillStyle = '#c8ab73'; c.fillRect(px - 1, h - 12, 7, 7);
    }
    c.fillStyle = '#ab7950'; c.fillRect(0, h - 15, w, 2);
    const dx = (b.door.x - b.x) * TS;
    c.fillStyle = '#bea983'; c.fillRect(dx - 9, h + 2, 34, 4); c.fillStyle = '#e5d6b1'; c.fillRect(dx - 6, h - 1, 28, 4);
    c.fillStyle = '#ba9260'; c.fillRect(dx - 5, h - 30, 26, 29); c.fillStyle = '#754c36'; c.fillRect(dx - 2, h - 27, 20, 26);
    c.fillStyle = '#a87550'; c.fillRect(dx, h - 26, 8, 25); c.fillRect(dx + 10, h - 26, 6, 25);
    c.fillStyle = '#ead199'; c.fillRect(dx + 5, h - 16, 1.8, 2.2); c.fillRect(dx + 11, h - 16, 1.8, 2.2);
    if (w > 100) { c.fillStyle = '#41665c'; c.fillRect(dx - 7, h - 42, 30, 9); c.strokeStyle = '#d7ba75'; c.lineWidth = .8; c.strokeRect(dx - 7, h - 42, 30, 9); c.fillStyle = '#ead7a3'; c.fillRect(dx - 1, h - 38, 5, 1); c.fillRect(dx + 8, h - 38, 5, 1); }
    const rx = -10, rw = w + 20, ry = -9, rb = roofH + 2, ridge = Math.min(30, w * .17);
    // Deep curved eaves and a continuous pale edge give the roof its silhouette.
    c.fillStyle = '#315f58'; c.beginPath(); c.moveTo(rx - 3, rb - 3); c.quadraticCurveTo(rx + 9, rb + 5, w / 2, rb + 7); c.quadraticCurveTo(rx + rw - 9, rb + 5, rx + rw + 3, rb - 3); c.lineTo(rx + rw, rb + 7); c.quadraticCurveTo(w / 2, rb + 17, rx, rb + 7); c.closePath(); c.fill();
    c.save(); c.beginPath(); c.moveTo(rx - 3, rb - 5); c.quadraticCurveTo(rx + 16, rb - 2, rx + 24, rb - 15); c.quadraticCurveTo(rx + ridge + 4, ry + 25, rx + ridge, ry + 4); c.quadraticCurveTo(w / 2, ry - 1, rx + rw - ridge, ry + 4); c.quadraticCurveTo(rx + rw - ridge - 4, ry + 25, rx + rw - 24, rb - 15); c.quadraticCurveTo(rx + rw - 16, rb - 2, rx + rw + 3, rb - 5); c.quadraticCurveTo(w / 2, rb + 10, rx - 3, rb - 5); c.closePath();
    c.clip();
    const rg = c.createLinearGradient(0, ry, w * .25, rb); rg.addColorStop(0, shade(style.roof, .28)); rg.addColorStop(.52, style.roof); rg.addColorStop(1, shade(style.roof, -.14)); c.fillStyle = rg; c.fillRect(rx - 4, ry - 2, rw + 8, rb - ry + 15);
    const rows = Math.max(4, Math.ceil((rb - ry) / 10));
    for (let row = 0; row <= rows; row++) {
      const yy = ry + 6 + row * 10, offset = row % 2 * 5;
      c.strokeStyle = 'rgba(36,82,75,.3)'; c.lineWidth = .9; c.beginPath(); c.moveTo(rx, yy); c.quadraticCurveTo(w / 2, yy + 5, rx + rw, yy); c.stroke();
      c.strokeStyle = 'rgba(193,225,188,.3)'; c.beginPath(); c.moveTo(rx, yy + 1.2); c.quadraticCurveTo(w / 2, yy + 6.2, rx + rw, yy + 1.2); c.stroke();
      c.strokeStyle = 'rgba(36,82,75,.23)'; c.lineWidth = .7; c.beginPath();
      for (let xx = rx + offset; xx < rx + rw; xx += 10) { c.moveTo(xx, yy + 1); c.lineTo(xx - (xx - w / 2) * .007, yy + 10); } c.stroke();
    }
    c.restore();
    c.strokeStyle = '#b6c59a'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(rx - 3, rb - 5); c.quadraticCurveTo(w / 2, rb + 10, rx + rw + 3, rb - 5); c.stroke();
    c.strokeStyle = '#dfc48b'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(rx + ridge - 2, ry + 3); c.quadraticCurveTo(w / 2, ry - 2, rx + rw - ridge + 2, ry + 3); c.stroke();
    c.strokeStyle = '#edd8a2'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(rx + ridge - 5, ry + 3); c.quadraticCurveTo(rx + ridge - 10, ry, rx + ridge - 11, ry - 4); c.moveTo(rx + rw - ridge + 5, ry + 3); c.quadraticCurveTo(rx + rw - ridge + 10, ry, rx + rw - ridge + 11, ry - 4); c.stroke();
    if ((b.level || 1) >= 2) {
      const sw = rw * .44, sx = w / 2 - sw / 2, sy = ry - 13; c.fillStyle = '#396f65'; c.beginPath(); c.moveTo(sx - 7, sy + 14); c.quadraticCurveTo(sx + 6, sy + 11, sx + 10, sy + 3); c.lineTo(sx + sw - 10, sy + 3); c.quadraticCurveTo(sx + sw - 6, sy + 11, sx + sw + 7, sy + 14); c.quadraticCurveTo(w / 2, sy + 20, sx - 7, sy + 14); c.fill(); c.fillStyle = '#88b39c'; c.fillRect(sx + 12, sy + 4, sw - 24, 3); c.fillStyle = '#dfc48b'; c.fillRect(sx + 10, sy, sw - 20, 3);
    }
    if ((b.level || 1) >= 3) { c.fillStyle = '#f0d793'; c.beginPath(); c.arc(w / 2, ry - 17, 4, 0, 7); c.fill(); }
    return cv;
  }

  /* ---------- สร้าง/จัดการ renderer ---------- */
  R.create = (canvas) => {
    const r = { canvas, ctx: canvas.getContext('2d'), W: null, cam: { x: 118 * TS, y: 70 * TS, z: 1.2 }, chunks: new Map(), buildingSprites: new Map(), castSeen: new Map(), castActive: new Map(), castClock: 0, castLastTime: null, S: 1, rev: 0, selected: null, follow: false, alpha: 1, opts: { names: true, bubbles: true, weather: true, night: true }, dpr: Math.min(2, g.devicePixelRatio || 1), t: 0, mini: null, hover: null, buildQueue: 0, shake: 0 };
    r.motionQuery = g.matchMedia ? g.matchMedia('(prefers-reduced-motion: reduce)') : null;
    Object.assign(r, R.methods);
    return r;
  };
  R.methods = {
    setWorld(W) {
      this.W = W; this.chunks.clear(); this.buildingSprites.clear(); this.mini = null; this.rev++; this.lastSeason = W.season;
      this.castSeen.clear(); this.castActive.clear(); this.castClock = 0; this.castLastTime = null;
      // Saved casts describe history. Baseline them so loading never replays a spell.
      const baseline = (a, kind) => { if (a.castFx) this.castSeen.set(kind + ':' + a.id, a.castFx.seq + '|' + a.castFx.t); };
      W.npcs.forEach(a => baseline(a, 'npc')); (W.foes || []).forEach(a => baseline(a, 'foe'));
    },
    invalidate() { this.rev++; },
    resize() { const c = this.canvas, w = c.clientWidth, h = c.clientHeight; c.width = Math.max(2, Math.round(w * this.dpr)); c.height = Math.max(2, Math.round(h * this.dpr)); this.vw = w; this.vh = h; this.clampCam(); },
    minZoom() { return Math.max(0.1, Math.min(this.vw / (MAP.W * TS), this.vh / (MAP.H * TS)) * 0.98); },
    clampCam() { const c = this.cam; c.z = clamp(c.z, this.minZoom(), 4); const hw = this.vw / 2 / c.z, hh = this.vh / 2 / c.z; c.x = clamp(c.x, Math.min(hw, MAP.W * TS / 2), Math.max(MAP.W * TS - hw, MAP.W * TS / 2)); c.y = clamp(c.y, Math.min(hh, MAP.H * TS / 2), Math.max(MAP.H * TS - hh, MAP.H * TS / 2)); },
    s2w(sx, sy) { const c = this.cam; return { x: (sx - this.vw / 2) / c.z + c.x, y: (sy - this.vh / 2) / c.z + c.y }; },
    w2s(wx, wy) { const c = this.cam; return { x: (wx - c.x) * c.z + this.vw / 2, y: (wy - c.y) * c.z + this.vh / 2 }; },
    panBy(dx, dy) { this.cam.x -= dx / this.cam.z; this.cam.y -= dy / this.cam.z; this.follow = false; this.clampCam(); },
    zoomAt(sx, sy, f) { const before = this.s2w(sx, sy); this.cam.z *= f; this.clampCam(); const after = this.s2w(sx, sy); this.cam.x += before.x - after.x; this.cam.y += before.y - after.y; this.clampCam(); },
    focus(tx, ty, z) { this.cam.x = tx * TS; this.cam.y = ty * TS; if (z) this.cam.z = z; this.clampCam(); },
    npcPos(n) { const a = this.alpha; return { x: (n.px + (n.x - n.px) * a), y: (n.py + (n.y - n.py) * a) }; },
    pickAt(sx, sy) {
      const W = this.W; if (!W) return null; const w = this.s2w(sx, sy); const tx = w.x / TS, ty = w.y / TS;
      let best = null, bd = (22 / this.cam.z / TS) ** 2 + 0.6;
      for (const n of W.npcs) { if (n.dead || n.away || n.hidden && !n.travel) continue; const p = this.npcPos(n); const d = (p.x - tx) ** 2 + (p.y - 0.6 - ty) ** 2; if (d < bd) { bd = d; best = { kind: 'npc', id: n.id }; } }
      for (const f of W.foes || []) { if (f.dead || f.gone) continue; const d = (f.x - tx) ** 2 + (f.y - 0.5 - ty) ** 2; if (d < bd) { bd = d; best = { kind: 'foe', id: f.id }; } }
      if (best) return best;
      for (const b of W.map.buildings) { if (b.type === 'plaza') continue; if (tx >= b.x - 1 && tx <= b.x + b.w + 1 && ty >= b.y - 0.6 && ty <= b.y + b.h + 0.2 && !MAP.BTYPES[b.type].open) return { kind: 'building', id: b.id }; if (MAP.BTYPES[b.type].open && tx >= b.x && tx < b.x + b.w && ty >= b.y && ty < b.y + b.h) return { kind: 'building', id: b.id }; }
      return null;
    },
    getChunk(cx, cy) {
      const S = this.S, key = cx + ',' + cy; let e = this.chunks.get(key);
      if (e && e.rev === this.rev && e.S === S) return e.cv;
      if (this.buildQueue >= 4) return e ? e.cv : null; // จำกัดจำนวนที่สร้างต่อเฟรม
      this.buildQueue++; const cv = buildChunk(this, cx, cy, S); this.chunks.set(key, { cv, rev: this.rev, S }); return cv;
    },
    getBuildingSprite(b) {
      const key = b.id + '|' + (b.level || 1); let cv = this.buildingSprites.get(key);
      if (!cv) { if (this.buildingSprites.size >= 64) this.buildingSprites.delete(this.buildingSprites.keys().next().value); cv = buildBuildingSprite(b, this.S); this.buildingSprites.set(key, cv); }
      return cv;
    },
    getMini() {
      if (this.mini && this.mini.rev === this.rev) return this.mini.cv;
      const M = this.W.map, cv = newCanvas(MAP.W, MAP.H), c = cv.getContext('2d'), season = this.W.season;
      for (let y = 0; y < MAP.H; y++) for (let x = 0; x < MAP.W; x++) { c.fillStyle = tileColor(M.terrain[y * MAP.W + x], x, y, season); c.fillRect(x, y, 1, 1); }
      M.decor.forEach(d => { if (d.kind === 'pine' || d.kind === 'blossom') { c.fillStyle = season === 2 ? '#b8782a' : season === 3 ? '#e8eef2' : '#2f6a35'; c.fillRect(d.x, d.y, 1, 1); } });
      this.mini = { cv, rev: this.rev }; return cv;
    },
    /* ---------- วาดเฟรม ---------- */
    draw(time) {
      const W = this.W; if (!W) return; const ctx = this.ctx, c = this.cam, dpr = this.dpr; this.t = time / 1000; this.buildQueue = 0;
      this.updateCastEffects(time);
      if (W.season !== this.lastSeason) { this.lastSeason = W.season; this.rev++; this.mini = null; }
      const S = clamp(Math.round(c.z * dpr), 1, 3); if (S !== this.S) { this.S = S; this.chunks.clear(); this.buildingSprites.clear(); }
      if (this.follow && this.selected) { const n = W.byId[this.selected]; if (n && !n.dead && !n.away) { const p = this.npcPos(n); c.x += (p.x * TS - c.x) * 0.15; c.y += (p.y * TS - c.y) * 0.15; this.clampCam(); } }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = true;
      ctx.fillStyle = '#5f8175'; ctx.fillRect(0, 0, this.vw, this.vh);
      ctx.save(); ctx.translate(this.vw / 2, this.vh / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
      const hw = this.vw / 2 / c.z, hh = this.vh / 2 / c.z;
      const x0 = Math.max(0, Math.floor((c.x - hw) / (TS * CH))), x1 = Math.min(MAP.W / CH - 1, Math.floor((c.x + hw) / (TS * CH)));
      const y0 = Math.max(0, Math.floor((c.y - hh) / (TS * CH))), y1 = Math.min(MAP.H / CH - 1, Math.floor((c.y + hh) / (TS * CH)));
      const mini = this.getMini();
      for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) {
        const cv = this.getChunk(cx, cy); const dx = cx * CH * TS, dy = cy * CH * TS;
        if (cv) { ctx.drawImage(cv, dx, dy, CH * TS + 0.4, CH * TS + 0.4); }
        else { ctx.drawImage(mini, cx * CH, cy * CH, CH, CH, dx, dy, CH * TS, CH * TS); }
      }
      const hour = (W.t % 1440) / 60;
      this.drawWater(ctx);
      // รายการวาดเรียงตามแกน y
      const items = [];
      W.map.buildings.forEach(b => { if ((b.x + b.w) * TS < c.x - hw - 24 || b.x * TS > c.x + hw + 24 || (b.y + b.h) * TS < c.y - hh - 24 || b.y * TS > c.y + hh + 60) return; items.push({ y: MAP.BTYPES[b.type].open ? b.y - 100 : b.y + b.h, b, k: 'b' }); });
      W.npcs.forEach(n => { if (n.dead || n.away || (n.hidden && !n.travel)) return; const p = this.npcPos(n); if (p.x * TS < c.x - hw - 40 || p.x * TS > c.x + hw + 40 || p.y * TS < c.y - hh - 60 || p.y * TS > c.y + hh + 40) return; items.push({ y: p.y, n, p, k: 'n' }); });
      (W.foes || []).forEach(f => { if (!f.gone && !f.dead) items.push({ y: f.y, f, k: 'f' }); });
      (W.wildlife?.beasts || []).forEach(b => { if (!b.fighting && !b.dead && !b.gone && Math.abs(b.x * TS - c.x) < hw + 50 && Math.abs(b.y * TS - c.y) < hh + 50) items.push({y:b.y,w:b,k:'w'}); });
      W.map.decor.forEach(d => { if (d.kind === 'lantern' || d.kind === 'banner' || d.kind === 'fountain') { if (Math.abs(d.x * TS - c.x) < hw + 40 && Math.abs(d.y * TS - c.y) < hh + 40) items.push({ y: d.y + 0.5, d, k: 'd' }); } });
      items.sort((a, b) => a.y - b.y);
      const night = this.nightFactor(hour);
      for (const it of items) { if (it.k === 'b') this.drawBuilding(ctx, it.b, hour, night); else if (it.k === 'n') this.drawNpc(ctx, it.n, it.p, hour); else if (it.k === 'f') { if (it.f.wild) this.drawWild(ctx, it.f); else this.drawFoe(ctx, it.f); } else if (it.k === 'w') this.drawWild(ctx, it.w); else this.drawDeco(ctx, it.d, night); }
      this.drawCastEffects(ctx);
      this.drawMarkers(ctx);
      // กลางคืน
      if (this.opts.night && night > 0.02) {
        ctx.restore(); ctx.save(); ctx.fillStyle = 'rgba(8,16,48,' + (night * 0.55).toFixed(3) + ')'; ctx.fillRect(0, 0, this.vw, this.vh); ctx.restore(); ctx.save(); ctx.translate(this.vw / 2, this.vh / 2); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
        ctx.globalCompositeOperation = 'lighter';
        W.map.buildings.forEach(b => { if (MAP.BTYPES[b.type].open || b.type === 'gate') return; const occ = b.inside.length > 0 || b.type === 'main_hall' || b.type === 'canteen' || b.type === 'tea_garden'; if (!occ) return; const gx = (b.x + b.w / 2) * TS, gy = (b.y + b.h * 0.6) * TS, rr = Math.max(b.w, b.h) * TS * 0.9; const gr = ctx.createRadialGradient(gx, gy, 2, gx, gy, rr); gr.addColorStop(0, 'rgba(255,200,110,' + (0.28 * night).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,200,110,0)'); ctx.fillStyle = gr; ctx.fillRect(gx - rr, gy - rr, rr * 2, rr * 2); });
        W.map.decor.forEach(d => { if (d.kind !== 'lantern') return; const gx = d.x * TS + 8, gy = d.y * TS + 3, rr = 46; const gr = ctx.createRadialGradient(gx, gy, 1, gx, gy, rr); gr.addColorStop(0, 'rgba(255,190,100,' + (0.5 * night).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,190,100,0)'); ctx.fillStyle = gr; ctx.fillRect(gx - rr, gy - rr, rr * 2, rr * 2); });
        W.npcs.forEach(n => { if (n.dead || n.away || n.hidden) return; if (n.act.id === 'cultivate' && n.cult) { const p = this.npcPos(n); const gr = ctx.createRadialGradient(p.x * TS, p.y * TS - 6, 1, p.x * TS, p.y * TS - 6, 38); gr.addColorStop(0, PATH_COL[n.cult.path].replace('#', '#') + '55'); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.fillRect(p.x * TS - 40, p.y * TS - 46, 80, 80); } });
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.restore();
      if (this.opts.weather) this.drawWeather(ctx, W.weather.kind, hour);
      this.drawOverlayText(ctx);
    },
    // Cast events remain simulation data; their short real-time presentation lives here only.
    updateCastEffects(time) {
      const W = this.W; if (!W) return;
      const paused = (g.G && g.G.W === W ? g.G.speed === 0 : W.speed === 0) || (g.UI && g.UI.paused);
      const dt = this.castLastTime === null ? 0 : time - this.castLastTime; this.castLastTime = time;
      // A stopped render loop (modal/tab suspension) does not consume the animation on resume.
      if (!paused && dt >= 0 && dt < 250) this.castClock += dt;
      for (const [key, fx] of this.castActive) if (this.castClock - fx.start >= fx.life) this.castActive.delete(key);
      const hw = this.vw / 2 / this.cam.z, hh = this.vh / 2 / this.cam.z;
      const present = new Set();
      const read = (a, kind) => {
        const key = kind + ':' + a.id; present.add(key);
        const event = a.castFx; if (!event) return;
        const stamp = event.seq + '|' + event.t;
        if (this.castSeen.get(key) === stamp) return; this.castSeen.set(key, stamp);
        if (a.dead || a.away || a.gone || a.hidden || !Number.isFinite(event.t) || W.t - event.t < 0 || W.t - event.t > 8 || !Number.isFinite(event.x) || !Number.isFinite(event.y)) return;
        const p = kind === 'npc' ? this.npcPos(a) : a, x = p.x * TS, y = p.y * TS;
        if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x - this.cam.x) > hw + 48 || Math.abs(y - this.cam.y) > hh + 48) return;
        const forbidden = event.kind === 'forbidden';
        this.castActive.delete(key);
        if (this.castActive.size >= 24) this.castActive.delete(this.castActive.keys().next().value);
        this.castActive.set(key, { kind: forbidden ? 'forbidden' : 'normal', x, y, angle: Math.atan2(event.y * TS - y, event.x * TS - x), start: this.castClock, life: forbidden ? 650 : 450 });
      };
      W.npcs.forEach(a => read(a, 'npc')); (W.foes || []).forEach(a => read(a, 'foe'));
      // Summons receive fresh IDs; do not retain their history after despawning.
      for (const key of this.castSeen.keys()) if (!present.has(key)) this.castSeen.delete(key);
    },
    drawCastEffects(ctx) {
      const reduced = this.motionQuery && this.motionQuery.matches;
      for (const fx of this.castActive.values()) {
        const p = clamp((this.castClock - fx.start) / fx.life, 0, 1), fade = Math.min(1, (1 - p) * 2.8), r = reduced ? 23 : 18 + p * 13;
        ctx.save(); ctx.translate(fx.x, fx.y - 7); ctx.globalAlpha = fade; ctx.lineCap = 'round';
        if (fx.kind === 'normal') {
          ctx.fillStyle = 'rgba(109,223,181,.14)'; ctx.beginPath(); ctx.ellipse(0, 4, r * .9, r * .38, 0, 0, 7); ctx.fill();
          ctx.strokeStyle = 'rgba(236,213,133,.78)'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.ellipse(0, 4, r * .8, r * .34, 0, 0, 7); ctx.stroke();
          ctx.rotate(fx.angle + (reduced ? 0 : (p - .5) * .7));
          ctx.fillStyle = 'rgba(113,221,184,.58)'; ctx.beginPath(); ctx.arc(0, 0, r, -.95, .95); ctx.quadraticCurveTo(r * .36, 0, Math.cos(-.95) * r, Math.sin(-.95) * r); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = '#fff0b7'; ctx.lineWidth = 1.7; ctx.beginPath(); ctx.arc(0, 0, r, -.95, .95); ctx.stroke();
          ctx.strokeStyle = 'rgba(174,245,210,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(-2, 0, r + 4, -.68, .68); ctx.stroke();
          if (!reduced) { ctx.fillStyle = '#f8e5a1'; for (let i = 0; i < 3; i++) { const a = (i - 1) * .63, d = r + 3 + p * (5 + i * 2); ctx.fillRect(Math.cos(a) * d, Math.sin(a) * d, 1.8, 1.8); } }
        } else {
          ctx.fillStyle = 'rgba(88,40,104,.19)'; ctx.beginPath(); ctx.ellipse(0, 6, r * 1.1, r * .58, 0, 0, 7); ctx.fill();
          ctx.strokeStyle = '#be8de1'; ctx.lineWidth = 1.9; ctx.beginPath(); ctx.ellipse(0, 6, r, r * .52, 0, 0, 7); ctx.stroke();
          ctx.strokeStyle = 'rgba(224,102,131,.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 6, r * .78, r * .4, 0, 0, 7); ctx.stroke();
          ctx.save(); ctx.translate(0, 6); ctx.scale(1, .52); ctx.rotate(fx.angle + (reduced ? 0 : p * .6));
          ctx.strokeStyle = '#dd7c9b'; ctx.lineWidth = 1.6; ctx.beginPath(); for (let triangle = 0; triangle < 2; triangle++) for (let i = 0; i <= 3; i++) { const a = i * Math.PI * 2 / 3 + triangle * Math.PI / 3; const x = Math.cos(a) * r * .75, y = Math.sin(a) * r * .75; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
          ctx.strokeStyle = '#d8adea'; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.moveTo(Math.cos(a) * r * .9, Math.sin(a) * r * .9); ctx.lineTo(Math.cos(a) * r * 1.1, Math.sin(a) * r * 1.1); } ctx.stroke(); ctx.restore();
          ctx.rotate(fx.angle); ctx.strokeStyle = '#e989a0'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0, 0, r * 1.05, -.5, .5); ctx.stroke();
          if (!reduced) { ctx.fillStyle = '#c79be2'; for (let i = 0; i < 4; i++) { const a = i * 1.7, d = r * (.6 + i * .1); ctx.fillRect(Math.cos(a) * d, Math.sin(a) * d * .5 - p * (10 + i * 2), 1.7, 2.5); } }
        }
        ctx.restore();
      }
    },
    nightFactor(h) { if (h >= 7 && h < 17.5) return 0; if (h >= 19.5 || h < 4.5) return 1; if (h >= 17.5) return (h - 17.5) / 2; if (h >= 4.5 && h < 7) return 1 - (h - 4.5) / 2.5; return 0; },
    drawWater(ctx) {
      const W = this.W, t = this.t; const b = W.map.byId.spirit_pond; if (!b) return;
      ctx.save(); ctx.beginPath(); ctx.rect(b.x * TS, b.y * TS, b.w * TS, b.h * TS); ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 0.8;
      for (let i = 0; i < 14; i++) { const x = b.x * TS + ((i * 53 + t * 6) % (b.w * TS)), y = b.y * TS + ((i * 37) % (b.h * TS)); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 5, y - 2 + Math.sin(t * 2 + i) * 1.5, x + 10, y); ctx.stroke(); }
      ctx.fillStyle = 'rgba(90,170,90,.9)'; for (let i = 0; i < 7; i++) { const x = b.x * TS + (i * 61 % (b.w * TS - 20)) + 10, y = b.y * TS + (i * 43 % (b.h * TS - 20)) + 10; ctx.beginPath(); ctx.ellipse(x, y, 5, 3, 0, 0, 7); ctx.fill(); if (i % 2 === 0) { ctx.fillStyle = '#f7c5da'; ctx.beginPath(); ctx.arc(x + 1, y - 1, 1.8, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(90,170,90,.9)'; } }
      ctx.restore();
    },
    drawDeco(ctx, d, night) {
      const x = d.x * TS, y = d.y * TS; const t = this.t;
      if (d.kind === 'lantern') { ctx.fillStyle = '#5a3a28'; ctx.fillRect(x + 7, y - 6, 2, 16); ctx.fillStyle = night > 0.2 ? '#ffd48a' : '#c9392c'; const f = night > 0.2 ? 1 + Math.sin(t * 6 + d.x) * 0.06 : 1; ctx.beginPath(); ctx.ellipse(x + 8, y - 6, 4 * f, 5 * f, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#3b2a1a'; ctx.fillRect(x + 5, y - 11, 6, 2); }
      else if (d.kind === 'banner') { ctx.fillStyle = '#5a3a28'; ctx.fillRect(x + 7, y - 26, 2, 34); const w = Math.sin(t * 2 + d.x) * 2; ctx.fillStyle = '#b3302a'; ctx.beginPath(); ctx.moveTo(x + 9, y - 25); ctx.lineTo(x + 22 + w, y - 22); ctx.lineTo(x + 20 + w, y - 8); ctx.lineTo(x + 9, y - 10); ctx.fill(); ctx.fillStyle = '#f0cf4a'; ctx.fillRect(x + 12, y - 19, 6 + w / 2, 2); }
      else if (d.kind === 'fountain') {
        ctx.fillStyle = '#9b958a'; ctx.beginPath(); ctx.ellipse(x + 8, y + 6, 22, 11, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#4f9bc4'; ctx.beginPath(); ctx.ellipse(x + 8, y + 5, 18, 8, 0, 0, 7); ctx.fill();
        ctx.fillStyle = '#b7b1a6'; ctx.fillRect(x + 5, y - 8, 6, 12); ctx.strokeStyle = 'rgba(210,235,255,.9)'; ctx.lineWidth = 1.2;
        for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28 + t * 0.5; ctx.beginPath(); ctx.moveTo(x + 8, y - 8); ctx.quadraticCurveTo(x + 8 + Math.cos(a) * 9, y - 18, x + 8 + Math.cos(a) * 15, y + 3 + Math.sin(a) * 3); ctx.stroke(); }
      }
    },
    /* ---------- อาคาร ---------- */
    drawBuilding(ctx, b, hour, night) {
      const bt = MAP.BTYPES[b.type], c = this.cam, z = c.z;
      if (bt.open) { this.drawOpenArea(ctx, b, z); return; }
      const x = b.x * TS, y = b.y * TS, w = b.w * TS, h = b.h * TS;
      const roofH = h * 0.62, wallH = h - roofH + 6;
      const level = b.level || 1;
      const shell = this.getBuildingSprite(b);
      ctx.drawImage(shell, x - 20, y - 40, w + 44, h + 62);
      const wallTop = y + h - wallH, occupied = b.inside && b.inside.length > 0;
      const lit = night > .3 && (occupied || b.type === 'main_hall');
      if (lit) { ctx.save(); ctx.translate(x, y); buildingWindows(ctx, buildingMetrics(b), true); ctx.restore(); }
      const ry = y - 9;
      if (b.building) { // ก่อสร้าง
        ctx.fillStyle = 'rgba(90,60,30,.55)'; ctx.fillRect(x - 6, y - 6, w + 12, h + 8); ctx.strokeStyle = '#e0b050'; ctx.lineWidth = 2; for (let i = 0; i < w / 12; i++) { ctx.beginPath(); ctx.moveTo(x - 6 + i * 12, y + h + 2); ctx.lineTo(x - 6 + i * 12 + 6, y - 6); ctx.stroke(); }
        const pr = 1 - (b.building.until - this.W.t) / (8 * 1440); ctx.fillStyle = '#222'; ctx.fillRect(x, y + h + 4, w, 4); ctx.fillStyle = '#7bd36b'; ctx.fillRect(x, y + h + 4, w * clamp(pr, 0, 1), 4);
      }
      if (b.hp < 70) { ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 4; i++) ctx.fillRect(x + 6 + i * (w / 4), wallTop + 10, 3, 14); }
      if (z > 0.5) { // ชื่อ
        const label = bt.nameTh + (level > 1 ? ' ★' + level : ''); ctx.font = (b.w > 14 ? 11 : 10) + 'px ' + FONT; ctx.textAlign = 'center'; const tw = measureCached(ctx, ctx.font, label);
        const ly = ry - (level >= 2 ? 18 : 6); ctx.fillStyle = 'rgba(37,67,57,.86)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x + w / 2 - tw / 2 - 6, ly - 11, tw + 12, 15, 3) : ctx.rect(x + w / 2 - tw / 2 - 6, ly - 11, tw + 12, 15); ctx.fill(); ctx.strokeStyle = 'rgba(230,206,145,.55)'; ctx.lineWidth = .7; ctx.stroke(); ctx.fillStyle = '#fff1d1'; ctx.fillText(label, x + w / 2, ly);
      }
      // ผู้คนข้างใน: ไอคอนกิจกรรมบนผนัง
      if (occupied && z > 0.45) { const W = this.W; const acts = {}; b.inside.forEach(id => { const n = W.byId[id]; if (n && !n.dead) { const k = n.act.id; acts[k] = (acts[k] || 0) + 1; } }); let i = 0; ctx.textAlign = 'left'; ctx.font = '10px ' + FONT; Object.keys(acts).slice(0, 4).forEach(k => { const a = AI.ACTS[k]; if (!a) return; const bx = x + 4 + i * 24, by = wallTop - 1; ctx.fillStyle = 'rgba(15,20,28,.7)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, 23, 13, 6) : ctx.rect(bx, by, 23, 13); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(a.icon + (acts[k] > 1 ? acts[k] : ''), bx + 3, by + 10.5); i++; }); }
    },
    drawSpot(ctx, b, x, y, w, h) {
      const t = this.t, cx = x + w / 2, cy = y + h / 2, ex = this.W.explore;
      if (b.type === 'cave') {
        ctx.fillStyle = '#5b5560'; ctx.beginPath(); ctx.moveTo(x + 6, y + h - 6); ctx.quadraticCurveTo(x + 10, y + 10, cx, y + 6); ctx.quadraticCurveTo(x + w - 10, y + 10, x + w - 6, y + h - 6); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#6e6874'; ctx.beginPath(); ctx.moveTo(x + 14, y + h - 10); ctx.quadraticCurveTo(x + 20, y + 22, cx - 8, y + 18); ctx.lineTo(cx - 4, y + h - 10); ctx.fill();
        ctx.fillStyle = '#0b0b10'; ctx.beginPath(); ctx.moveTo(cx - 20, y + h - 6); ctx.quadraticCurveTo(cx - 20, y + 26, cx, y + 24); ctx.quadraticCurveTo(cx + 20, y + 26, cx + 20, y + h - 6); ctx.closePath(); ctx.fill();
        const gr = ctx.createRadialGradient(cx, y + h - 14, 2, cx, y + h - 14, 26); gr.addColorStop(0, 'rgba(120,200,255,' + (0.25 + 0.1 * Math.sin(t * 2)) + ')'); gr.addColorStop(1, 'rgba(120,200,255,0)'); ctx.fillStyle = gr; ctx.fillRect(cx - 26, y + h - 40, 52, 40);
        ctx.fillStyle = 'rgba(220,235,255,.35)'; for (let i = 0; i < 4; i++) { const px = cx - 14 + ((t * 8 + i * 17) % 28), py = y + h - 10 - ((t * 6 + i * 9) % 22); ctx.beginPath(); ctx.arc(px, py, 3 + i % 2, 0, 7); ctx.fill(); }
        ctx.fillStyle = '#a89c8a'; ctx.fillRect(cx - 26, y + h - 8, 6, 8); ctx.fillRect(cx + 20, y + h - 8, 6, 8); ctx.fillStyle = '#7a1f1f'; ctx.fillRect(cx - 28, y + h - 14, 56, 4);
      } else if (b.type === 'realm_gate') {
        ctx.strokeStyle = 'rgba(160,140,200,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * 0.42, 0, 7); ctx.stroke();
        for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; ctx.fillStyle = '#6b6580'; ctx.fillRect(cx + Math.cos(a) * w * 0.42 - 3, cy + Math.sin(a) * h * 0.42 - 3, 6, 6); }
        const open = ex && ex.gate.open, R = Math.min(w, h) * 0.34;
        if (open) { const rem = Math.max(0.2, Math.min(1, (ex.gate.until - this.W.day) / 4)); for (let i = 0; i < 5; i++) { const gr = ctx.createRadialGradient(cx, cy - 8, 2, cx, cy - 8, R * (1 - i * 0.12)); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(0.4, i % 2 ? 'rgba(140,90,255,.7)' : 'rgba(80,200,255,.7)'); gr.addColorStop(1, 'rgba(60,20,120,0)'); ctx.save(); ctx.translate(cx, cy - 8); ctx.rotate(t * (0.8 + i * 0.3) * (i % 2 ? 1 : -1)); ctx.scale(1, 1.35); ctx.translate(-cx, -(cy - 8)); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(cx, cy - 8, R * (1 - i * 0.12), 0, 7); ctx.fill(); ctx.restore(); } ctx.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 6; i++) { const a = t * 1.5 + i; ctx.fillRect(cx + Math.cos(a) * R * (0.5 + 0.4 * ((i * 37) % 10) / 10), cy - 8 + Math.sin(a * 1.3) * R * 0.9, 2, 2); } }
        else { ctx.fillStyle = 'rgba(90,80,120,.55)'; ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.55, R * 0.7, 0, 0, 7); ctx.fill(); }
      } else if (b.type === 'stele') {
        ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(cx + 3, y + h - 8, 16, 5, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#7e7a72'; ctx.fillRect(cx - 12, y + 14, 24, h - 22); ctx.beginPath(); ctx.arc(cx, y + 14, 12, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#5d5a54'; for (let i = 0; i < 5; i++) ctx.fillRect(cx - 7 + (i % 2) * 5, y + 16 + i * 6, 8 - (i % 3) * 2, 2);
        ctx.fillStyle = 'rgba(120,230,200,' + (0.45 + 0.3 * Math.sin(t * 2.4)) + ')'; for (let i = 0; i < 3; i++) ctx.fillRect(cx - 6 + i * 5, y + 22 + i * 7, 3, 2);
      } else if (b.type === 'spring') {
        ctx.fillStyle = '#8a8478'; ctx.beginPath(); ctx.ellipse(cx, cy + 4, w * 0.4, h * 0.3, 0, 0, 7); ctx.fill(); const sp = ex && ex.spots.spring, f = sp ? sp.charge / sp.max : 1; ctx.fillStyle = 'rgba(' + Math.round(60 + 80 * (1 - f)) + ',' + Math.round(150 + 60 * f) + ',230,.95)'; ctx.beginPath(); ctx.ellipse(cx, cy + 4, w * 0.34, h * 0.23, 0, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(200,255,240,' + (0.3 + 0.4 * f) + ')'; for (let i = 0; i < 5; i++) { const px = cx - 14 + ((i * 11 + t * 6) % 28), py = cy - ((t * 12 + i * 8) % 26); ctx.beginPath(); ctx.arc(px, py, 2, 0, 7); ctx.fill(); }
      } else if (b.type === 'ruin') {
        ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(cx, y + h - 6, w * 0.42, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#8f8878'; ctx.fillRect(x + 10, y + 22, 12, h - 28); ctx.fillRect(x + w - 24, y + 14, 12, h - 20); ctx.fillStyle = '#a39b8a'; ctx.fillRect(x + 8, y + 18, 16, 6); ctx.fillRect(x + w - 26, y + 10, 16, 6); ctx.fillStyle = '#6a6458'; ctx.fillRect(cx - 14, y + h - 20, 10, 12); ctx.fillRect(cx + 4, y + h - 16, 14, 8); ctx.fillStyle = '#4c7a3c'; ctx.fillRect(x + 12, y + 28, 3, 10); ctx.fillRect(cx + 6, y + h - 16, 6, 3);
        ctx.fillStyle = 'rgba(200,230,255,' + (0.1 + 0.08 * Math.sin(t * 1.3)) + ')'; ctx.beginPath(); ctx.ellipse(cx + 10, y + 28 - Math.sin(t) * 3, 7, 11, 0, 0, 7); ctx.fill();
      } else if (b.type === 'grove') {
        for (let i = 0; i < 7; i++) { const px = x + 12 + (i * 47) % (w - 24), py = y + 18 + ((i * 29) % (h - 30)); ctx.fillStyle = '#2d6a35'; ctx.beginPath(); ctx.arc(px, py, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#3f8a46'; ctx.beginPath(); ctx.arc(px - 2, py - 3, 6, 0, 7); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,240,150,' + (0.4 + 0.4 * Math.sin(t * 3)) + ')'; for (let i = 0; i < 4; i++) ctx.fillRect(x + 10 + ((i * 53 + t * 5) % (w - 20)), y + 14 + ((i * 31 + t * 3) % (h - 28)), 2, 2);
      }
    },
    drawOpenArea(ctx, b, z) {
      const x = b.x * TS, y = b.y * TS, w = b.w * TS, h = b.h * TS;
      if (b.type === 'training_ground') { ctx.strokeStyle = 'rgba(120,70,30,.55)'; ctx.lineWidth = 2; ctx.strokeRect(x + 4, y + 4, w - 8, h - 8); ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) * 0.28, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + w / 2, y + 4); ctx.lineTo(x + w / 2, y + h - 4); ctx.stroke(); }
      if (b.type === 'spirit_pond') { ctx.strokeStyle = 'rgba(100,90,80,.8)'; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h); }
      this.drawSpot(ctx, b, x, y, w, h);
      if (z > 0.5) { const label = MAP.BTYPES[b.type].nameTh + (b.level > 1 ? ' ★' + b.level : ''); ctx.font = '10px ' + FONT; ctx.textAlign = 'center'; const tw = measureCached(ctx, ctx.font, label); ctx.fillStyle = 'rgba(15,20,28,.6)'; ctx.fillRect(x + w / 2 - tw / 2 - 5, y + 2, tw + 10, 14); ctx.fillStyle = '#fff'; ctx.fillText(label, x + w / 2, y + 12); }
      if (b.building) { ctx.fillStyle = 'rgba(90,60,30,.35)'; ctx.fillRect(x, y, w, h); ctx.font = '12px ' + FONT; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🚧 กำลังขยาย', x + w / 2, y + h / 2); }
    },
    /* ---------- ตัวละคร ---------- */
    appearance(n) {
      if (n._ap) return n._ap;
      const b = n.h.body, hs = b.hairStyle || '';
      n._ap = { skin: b.skinHex || '#e8c49c', hair: b.hairHex || '#222', eye: b.eyeHex || '#222', long: /ยาว|ปล่อย|ถัก/.test(hs) || (n.h.sex === 'F' && !/สั้น|โกน/.test(hs)), bun: /มวย|รวบ/.test(hs), bald: /โกน|หัวล้าน/.test(hs), scale: clamp(0.9 + (b.heightCm - 165) / 160, 0.82, 1.12), slim: n.h.sex === 'F' ? 0.9 : 1 };
      return n._ap;
    },
    drawNpc(ctx, n, p, hour) {
      const c = this.cam, z = c.z, W = this.W;
      const x = p.x * TS, y = p.y * TS;
      const act = n.act ? n.act.id : 'idle'; const A = AI.ACTS[act];
      const moving = !!n.path || !!n.travel; const sel = this.selected === n.id;
      // ระยะไกลมาก: จุดสี
      if (z < 0.42) { const col = n.cult ? PATH_COL[n.cult.path] : '#bbb'; ctx.fillStyle = col; const r = Math.max(2.2 / z, 5); ctx.beginPath(); ctx.arc(x, y - 4, r, 0, 7); ctx.fill(); if (n.rank >= 4) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.4 / z; ctx.stroke(); } if (sel) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 / z; ctx.beginPath(); ctx.arc(x, y - 4, r + 4 / z, 0, 7); ctx.stroke(); } return; }
      const ap = this.appearance(n); const sc = ap.scale * 1.14 * (n.rank === 6 ? 1.08 : 1);
      const ph = this.t * (act === 'fight' || n.run ? 14 : 9) + n.n * 1.7; const step = moving ? Math.sin(ph) : 0; const bob = moving ? Math.abs(Math.sin(ph)) * 1.4 : Math.sin(this.t * 2 + n.n) * 0.35;
      const face = n.face >= 0 ? 1 : -1;
      const pose = act === 'cultivate' || (act === 'breakthrough') ? 'sit' : act === 'sleep' && !n.hidden ? 'lie' : act === 'pray' ? 'bow' : 'stand';
      ctx.save(); ctx.translate(x, y);
      // เงา
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 1, 5.5 * sc, 2.4, 0, 0, 7); ctx.fill();
      // ออร่า
      if (n.cult && (act === 'cultivate' || act === 'breakthrough')) { const pc = PATH_COL[n.cult.path]; const pr = 0.5 + 0.5 * Math.sin(this.t * 3 + n.n); const gr = ctx.createRadialGradient(0, -8, 2, 0, -8, 18 + pr * 4 + n.cult.stage * 1.5); gr.addColorStop(0, pc + '99'); gr.addColorStop(1, pc + '00'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, -8, 24 + n.cult.stage * 1.5, 0, 7); ctx.fill(); if (act === 'breakthrough') { ctx.strokeStyle = '#fff8c0'; ctx.lineWidth = 1.5; for (let i = 0; i < 6; i++) { const a = this.t * 2 + i; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 8, -8 + Math.sin(a) * 8); ctx.lineTo(Math.cos(a) * 20, -8 + Math.sin(a) * 20); ctx.stroke(); } } }
      ctx.scale(face * sc, sc);
      const robe = n.cult ? PATH_COL[n.cult.path] : ROBE_MORTAL; const sash = SECT.RANKS[n.rank].color;
      const lunge = act === 'fight' && n.act.ctx && n.fx && this.W.t - n.fx.t < 3 ? 3 : 0;
      if (pose === 'lie') { ctx.rotate(-1.5); ctx.translate(0, -4); }
      const legL = pose === 'sit' ? 0 : step * 2.6, legR = pose === 'sit' ? 0 : -step * 2.6;
      // ขา
      ctx.fillStyle = '#3a3a48'; if (pose === 'sit') { ctx.fillRect(-5, -3, 10, 3); } else { ctx.fillRect(-3.2 + legL * 0.3, -6 + Math.abs(legL) * 0.1, 2.6, 6 - Math.max(0, -legL) * .3); ctx.fillRect(0.6 + legR * 0.3, -6, 2.6, 6 - Math.max(0, -legR) * .3); }
      // ลำตัว (เสื้อคลุม)
      const by = -bob; ctx.fillStyle = robe; ctx.beginPath(); ctx.moveTo(-4.8 * ap.slim, -5 + by); ctx.lineTo(4.8 * ap.slim, -5 + by); ctx.lineTo(3.6, -13 + by); ctx.lineTo(-3.6, -13 + by); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#53645a'; ctx.lineWidth = .65; ctx.stroke();
      ctx.fillStyle = shade(robe, -0.25); ctx.fillRect(1.2, -13 + by, 2.4, 8); // ชายเสื้อ
      ctx.strokeStyle = '#fff0cc'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-2.5, -13 + by); ctx.lineTo(.2, -10 + by); ctx.lineTo(2.4, -13 + by); ctx.stroke();
      ctx.fillStyle = sash; ctx.fillRect(-4 * ap.slim, -9.4 + by, 8 * ap.slim, 1.8); // สายคาด = ระดับ
      // แขน
      let armA = -0.2 + (moving ? -step * 0.6 : 0), armB = 0.2 + (moving ? step * 0.6 : 0);
      if (act === 'practice' || (act === 'fight' && lunge)) { armA = -1.4 + Math.sin(this.t * 9 + n.n) * 0.9; }
      if (pose === 'sit') { armA = 0.9; armB = 0.9; }
      ctx.strokeStyle = shade(robe, -0.1); ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(3, -12 + by); ctx.lineTo(3 + Math.sin(armA) * 6 + lunge, -12 + by + Math.cos(armA) * 5.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-3, -12 + by); ctx.lineTo(-3 + Math.sin(armB) * 5, -12 + by + Math.cos(armB) * 5.5); ctx.stroke();
      ctx.fillStyle = ap.skin; ctx.beginPath(); ctx.arc(3 + Math.sin(armA) * 6 + lunge, -12 + by + Math.cos(armA) * 5.5, 1.5, 0, 7); ctx.fill();
      // อาวุธ/อุปกรณ์ตามกิจกรรม
      this.drawProp(ctx, n, act, armA, by, lunge);
      // ศีรษะ
      const hy = -17.5 + by + (pose === 'bow' ? 2.5 : 0);
      if (ap.long) { ctx.fillStyle = ap.hair; ctx.beginPath(); ctx.ellipse(-1.2, hy + 4, 5.4, 7.2, 0, 0, 7); ctx.fill(); }
      ctx.fillStyle = ap.skin; ctx.beginPath(); ctx.arc(0, hy, 4.9, 0, 7); ctx.fill(); ctx.strokeStyle = '#76604a'; ctx.lineWidth = .55; ctx.stroke();
      if (!ap.bald) { ctx.fillStyle = ap.hair; ctx.beginPath(); ctx.arc(0, hy - 0.7, 5.1, Math.PI * 1.02, Math.PI * 2.0); ctx.lineTo(4, hy - 0.8); ctx.quadraticCurveTo(1, hy - 2.8, -4.4, hy - 0.2); ctx.fill(); if (ap.bun) { ctx.beginPath(); ctx.arc(-1, hy - 6.4, 2.3, 0, 7); ctx.fill(); } }
      const sleepy = act === 'sleep'; ctx.fillStyle = '#1a1a22'; if (sleepy) { ctx.fillRect(0.6, hy + 0.3, 2.6, 0.7); } else { ctx.fillRect(1.4, hy - 0.4, 1.3, 1.9); }
      // เครื่องศีรษะตามฐานะ
      if (n.rank === 6) { ctx.fillStyle = '#f0cf4a'; ctx.fillRect(-3.5, hy - 6.2, 7, 2); ctx.fillRect(-1, hy - 8.4, 2, 2.4); }
      else if (n.rank === 5) { ctx.fillStyle = '#e8a43a'; ctx.fillRect(-3.4, hy - 5.8, 6.8, 1.6); }
      else if (n.rank === 4) { ctx.fillStyle = '#b53a2a'; ctx.fillRect(-3.2, hy - 5.4, 6.4, 1.4); }
      // บาดเจ็บ: ผ้าพัน
      if (n.inj && n.inj.length) { ctx.fillStyle = '#f2f2f2'; ctx.fillRect(-4, hy - 2.4, 8, 1.8); ctx.fillStyle = '#c33'; ctx.fillRect(1, hy - 2.4, 1.2, 1.8); }
      ctx.restore();
      // ส่วนที่ไม่ flip: ชื่อ/ฟองไอคอน/แถบเลือด
      const showName = this.opts.names && (z >= 1.1 || sel);
      ctx.textAlign = 'center';
      if (act === 'fight') { this.hpBar(ctx, x, y - 30 * sc, n.h.state.hp / CULT.hpMax(n), 14); }
      if (showName) { ctx.font = '9px ' + FONT; const nm = n.h.name.given; const tw = measureCached(ctx, ctx.font, nm); ctx.fillStyle = 'rgba(15,20,28,.65)'; ctx.fillRect(x - tw / 2 - 3, y + 2, tw + 6, 11); ctx.fillStyle = SECT.RANKS[n.rank].color; ctx.fillRect(x - tw / 2 - 3, y + 2, 2, 11); ctx.fillStyle = '#fff'; ctx.fillText(nm, x, y + 10.5); }
      if (this.opts.bubbles && z >= 0.8 && A && act !== 'idle') { const by2 = y - 31 * sc - (act === 'fight' ? 6 : 0); ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.beginPath(); ctx.arc(x, by2, 6.2, 0, 7); ctx.fill(); ctx.strokeStyle = A.color; ctx.lineWidth = 1.4; ctx.stroke(); ctx.font = '8.5px ' + FONT; ctx.fillStyle = '#000'; ctx.fillText(A.icon, x, by2 + 3); }
      if (n.act && n.act.id === 'pair' && n.act.stage === 'do' && n.act.ctx.pair) { const tp = n.act.ctx.pair.type; ctx.font = '9px ' + FONT; ctx.fillText(tp === 'date' ? '♥' : tp === 'spar' ? '⚔' : tp === 'argue' ? '💢' : tp === 'teach' ? '📖' : '…', x + 7, y - 34 * sc); }
      if (n.fx && this.W.t - n.fx.t < 4) { const age = (this.W.t - n.fx.t); ctx.font = 'bold 10px ' + FONT; ctx.fillStyle = /^-/.test(n.fx.text) ? '#ff6b5e' : '#ffe27a'; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 2.4; const fy = y - 38 * sc - age * 3; ctx.strokeText(n.fx.text, x, fy); ctx.fillText(n.fx.text, x, fy); }
      if (sel) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.ellipse(x, y, 10, 5, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x - 4, y - 50 * sc); ctx.lineTo(x + 4, y - 50 * sc); ctx.lineTo(x, y - 44 * sc); ctx.fill(); }
    },
    drawProp(ctx, n, act, armA, by, lunge) {
      const t = this.t;
      const hx = 3 + Math.sin(armA) * 6 + lunge, hy = -12 + by + Math.cos(armA) * 5.5;
      const weapon = n.equip && n.equip.WEAPON;
      if (act === 'practice' || act === 'fight' || (act === 'guard')) {
        ctx.strokeStyle = weapon ? '#e8eef6' : '#b7b0a0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 9, hy - 9 + (act === 'guard' ? 6 : 0)); ctx.stroke(); ctx.strokeStyle = '#8a5a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx - 1, hy + 1); ctx.lineTo(hx + 1, hy - 1); ctx.stroke();
        if (act === 'practice' && Math.sin(t * 9 + n.n) > 0.7) { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(hx + 4, hy - 4, 10, -1.2, 0.3); ctx.stroke(); }
      } else if (act === 'study') { ctx.fillStyle = '#e8d9a8'; ctx.fillRect(hx - 2, hy - 3, 6, 5); ctx.fillStyle = '#8a3a2a'; ctx.fillRect(hx - 2, hy - 3, 1.2, 5); }
      else if (act === 'farm') { ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 1.4; const sw = Math.sin(t * 6 + n.n) * 3; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 7 + sw, hy + 6); ctx.stroke(); ctx.fillStyle = '#888'; ctx.fillRect(hx + 6 + sw, hy + 5, 4, 2); }
      else if (act === 'mine') { ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 1.4; const sw = Math.sin(t * 7 + n.n); ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 7, hy - 6 + sw * 3); ctx.stroke(); ctx.fillStyle = '#9aa0a6'; ctx.fillRect(hx + 5, hy - 9 + sw * 3, 6, 2); }
      else if (act === 'eat') { ctx.fillStyle = '#e8e0d0'; ctx.beginPath(); ctx.arc(hx, hy - 1, 2.6, 0, Math.PI); ctx.fill(); }
      else if (act === 'leisure' && n.act.ctx && n.act.ctx.mode === 'fish') { ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 12, hy - 8); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.moveTo(hx + 12, hy - 8); ctx.lineTo(hx + 12, hy + 6 + Math.sin(t * 3) * 1.5); ctx.stroke(); }
      else if (act === 'leisure' && n.act.ctx && n.act.ctx.mode === 'music') { ctx.fillStyle = '#fff'; ctx.font = '8px ' + FONT; ctx.fillText('♪', hx + 4, hy - 4 - ((t * 8) % 8)); }
      else if (n.act && n.act.id === 'cook') { ctx.fillStyle = '#d9d9d9'; ctx.fillRect(hx - 1, hy - 1, 5, 3); }
      else if (act === 'cultivate' && n.cult) { ctx.fillStyle = PATH_COL[n.cult.path]; for (let i = 0; i < 3; i++) { const a = t * 1.5 + i * 2.1 + n.n; ctx.globalAlpha = 0.7; ctx.fillRect(Math.cos(a) * 7, -8 - ((t * 10 + i * 9) % 22), 1.4, 1.4); } ctx.globalAlpha = 1; }
      else if (act === 'brew' || act === 'forge') { ctx.fillStyle = act === 'forge' ? '#ff9a4a' : '#8de0a0'; ctx.beginPath(); ctx.arc(hx + 3, hy - 2 - (t * 6 % 4), 1.4, 0, 7); ctx.fill(); }
    },
    hpBar(ctx, x, y, f, w) { f = clamp(f, 0, 1); ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(x - w / 2 - 1, y - 1, w + 2, 4); ctx.fillStyle = f > 0.5 ? '#5fd35f' : f > 0.25 ? '#e8c43a' : '#e0463a'; ctx.fillRect(x - w / 2, y, w * f, 2); },
    drawWild(ctx, b) {
      const x=b.x*TS,y=b.y*TS, id=b.speciesId||'', large=b.tier>=6, body=large?'#78518b':b.tier>=3?'#b27b55':'#9d8b70';
      ctx.save();ctx.translate(x,y);ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(0,1,10,4,0,0,7);ctx.fill();
      if (/PYTHON|SNAKE|SERPENT/.test(id)) {ctx.strokeStyle=body;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-10,-2);ctx.bezierCurveTo(-4,-12,1,4,8,-6);ctx.stroke();ctx.fillStyle='#e9c586';ctx.beginPath();ctx.arc(8,-7,4,0,7);ctx.fill();}
      else if (/ROC|BIRD|PHOENIX/.test(id)) {ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-12,-10);ctx.quadraticCurveTo(0,-2,12,-10);ctx.lineTo(5,0);ctx.lineTo(-5,0);ctx.closePath();ctx.fill();ctx.fillStyle='#e2c78e';ctx.beginPath();ctx.arc(0,-7,4,0,7);ctx.fill();}
      else {ctx.fillStyle=body;ctx.beginPath();ctx.ellipse(0,-7,large?12:9,large?8:6,0,0,7);ctx.fill();ctx.fillRect(-7,-4,3,5);ctx.fillRect(5,-4,3,5);ctx.fillStyle=large?'#9870ad':'#ccb294';ctx.beginPath();ctx.arc(7,-10,large?6:5,0,7);ctx.fill();ctx.fillStyle='#3b302d';ctx.beginPath();ctx.moveTo(4,-13);ctx.lineTo(5,-18);ctx.lineTo(9,-13);ctx.fill();ctx.fillRect(9,-11,2,2);}
      if(b.legendary){ctx.strokeStyle='rgba(219,160,255,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,0,15,6,0,0,7);ctx.stroke();}
      if(this.cam.z>.8){ctx.fillStyle='rgba(20,35,29,.75)';ctx.font='9px '+FONT;ctx.textAlign='center';ctx.fillText(b.name+' · '+b.tier,0,-24);}
      ctx.restore();
    },
    drawFoe(ctx, f) {
      const x = f.x * TS, y = f.y * TS, z = this.cam.z; const t = this.t + f.x;
      if (z < 0.42) { ctx.fillStyle = '#e0463a'; ctx.beginPath(); ctx.arc(x, y - 4, Math.max(2.5 / z, 5), 0, 7); ctx.fill(); return; }
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(0, 1, 8, 3, 0, 0, 7); ctx.fill(); ctx.scale(f.face >= 0 ? 1 : -1, 1);
      const s = 0.9 + f.tier * 0.12; const bob = Math.abs(Math.sin(t * 8)) * 1.5;
      if (f.kind === 'beast') {
        ctx.scale(s, s); const hue = (f.sp || '').length * 37 % 360; const col = 'hsl(' + hue + ',32%,36%)';
        ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, -7 - bob, 9, 5.5, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(9, -10 - bob, 4.2, 0, 7); ctx.fill();
        ctx.fillRect(-7, -4, 2.4, 4 + Math.sin(t * 8) * 1.2); ctx.fillRect(-2, -4, 2.4, 4 - Math.sin(t * 8) * 1.2); ctx.fillRect(3, -4, 2.4, 4 + Math.sin(t * 8) * 1.2); ctx.fillRect(7, -4, 2.4, 4 - Math.sin(t * 8) * 1.2);
        ctx.fillStyle = '#ff4a3a'; ctx.fillRect(10, -11 - bob, 2, 1.6); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-9, -8); ctx.lineTo(-14, -12 - Math.sin(t * 5) * 2); ctx.lineTo(-8, -5); ctx.fill();
        ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.moveTo(12, -8 - bob); ctx.lineTo(13.5, -5 - bob); ctx.lineTo(11, -7 - bob); ctx.fill();
      } else {
        ctx.fillStyle = '#3a2a2a'; ctx.fillRect(-3, -6, 2.6, 6); ctx.fillRect(0.6, -6, 2.6, 6); ctx.fillStyle = f.boss ? '#7a1f1f' : '#4a3a4a'; ctx.beginPath(); ctx.moveTo(-4.5, -5 - bob); ctx.lineTo(4.5, -5 - bob); ctx.lineTo(3.6, -13 - bob); ctx.lineTo(-3.6, -13 - bob); ctx.fill(); ctx.fillStyle = '#c99a78'; ctx.beginPath(); ctx.arc(0, -17 - bob, 4.8, 0, 7); ctx.fill(); ctx.fillStyle = '#222'; ctx.fillRect(-4.4, -19.6 - bob, 8.8, 2.2); ctx.fillStyle = '#c33'; ctx.fillRect(-4.4, -18.4 - bob, 8.8, 1);
        ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(4, -11 - bob); ctx.lineTo(12, -17 - bob + Math.sin(t * 9) * 3); ctx.stroke();
      }
      ctx.restore(); this.hpBar(ctx, x, y - 24 * s, f.hp / f.hpMax, 16);
      ctx.font = '8.5px ' + FONT; ctx.textAlign = 'center'; if (z >= 1) { ctx.fillStyle = '#ffb0a8'; ctx.fillText(f.name, x, y + 9); }
      if (f.fx && this.W.t - f.fx.t < 4) { ctx.font = 'bold 10px ' + FONT; ctx.fillStyle = '#ffe27a'; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 2.4; ctx.strokeText(f.fx.text, x, y - 30 - (this.W.t - f.fx.t) * 3); ctx.fillText(f.fx.text, x, y - 30 - (this.W.t - f.fx.t) * 3); }
    },
    drawMarkers(ctx) {
      const W = this.W; const sel = this.selected && W.byId[this.selected];
      if (sel && sel.path && sel.path.length && !sel.hidden) { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); const p = this.npcPos(sel); ctx.moveTo(p.x * TS, p.y * TS); for (let i = sel.pi; i < sel.path.length; i++) ctx.lineTo(sel.path[i][0] * TS + 8, sel.path[i][1] * TS + 8); ctx.stroke(); ctx.setLineDash([]); }
      const T2 = W.sect.tournament; if (T2 && T2.state === 'run') { const tg = W.map.byId.training_ground; ctx.font = '12px ' + FONT; ctx.textAlign = 'center'; ctx.fillStyle = '#ffe27a'; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 3; ctx.strokeText('🏆 ประลองยุทธ์สำนัก', (tg.x + tg.w / 2) * TS, (tg.y - 0.3) * TS); ctx.fillText('🏆 ประลองยุทธ์สำนัก', (tg.x + tg.w / 2) * TS, (tg.y - 0.3) * TS); }
      if (W.sect.festival && W.sect.festival.until > W.t && W.sect.festival.kind === 'banquet') { const pl = W.map.byId.plaza; ctx.font = '12px ' + FONT; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd1e0'; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 3; ctx.strokeText('🎎 งานเลี้ยงสำนัก', (pl.x + pl.w / 2) * TS, (pl.y + 1) * TS); ctx.fillText('🎎 งานเลี้ยงสำนัก', (pl.x + pl.w / 2) * TS, (pl.y + 1) * TS); }
      // A small map-side marker makes merchant arrivals visible without creating fake NPC records.
      const visitors = W.world && Array.isArray(W.world.visitors) ? W.world.visitors.filter(v => v && v.kind === 'trader' && v.untilDay >= W.day) : [];
      const market = W.map.byId.market;
      if (visitors.length && market && this.cam.z > 0.5) {
        const mx = (market.x + market.w / 2) * TS, my = (market.y - 0.25) * TS, label = '🪙 พ่อค้า ' + visitors.length;
        ctx.font = '10px ' + FONT; ctx.textAlign = 'center'; const tw = measureCached(ctx, ctx.font, label);
        ctx.fillStyle = 'rgba(15,20,28,.88)'; ctx.fillRect(mx - tw / 2 - 5, my - 13, tw + 10, 16);
        ctx.strokeStyle = '#c9a15b'; ctx.lineWidth = 1; ctx.strokeRect(mx - tw / 2 - 5, my - 13, tw + 10, 16);
        ctx.fillStyle = '#f6d28a'; ctx.fillText(label, mx, my - 2);
      }
      // ประตูทางออก
      const ex = MAP.EXIT; if (this.cam.z > 0.5) { ctx.font = '10px ' + FONT; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillText('▼ ทางออกสู่ยุทธภพ', ex.x * TS + 8, ex.y * TS - 4); }
    },
    drawWeather(ctx, kind, hour) {
      const w = this.vw, h = this.vh, t = this.t;
      if (kind === 'rain') { ctx.strokeStyle = 'rgba(190,210,255,.45)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 110; i++) { const x = ((i * 97 + t * 160) % (w + 40)) - 20, y = ((i * 53 + t * 520) % (h + 40)) - 20; ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 11); } ctx.stroke(); ctx.fillStyle = 'rgba(40,55,80,.16)'; ctx.fillRect(0, 0, w, h); }
      else if (kind === 'snow') { ctx.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 90; i++) { const x = ((i * 89 + Math.sin(t + i) * 20 + t * 14) % (w + 20)), y = ((i * 61 + t * 55) % (h + 20)); ctx.beginPath(); ctx.arc(x, y, 1.6 + (i % 3) * 0.5, 0, 7); ctx.fill(); } ctx.fillStyle = 'rgba(220,230,245,.1)'; ctx.fillRect(0, 0, w, h); }
      else if (kind === 'fog') { const gr = ctx.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(220,225,235,.38)'); gr.addColorStop(1, 'rgba(220,225,235,.22)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h); }
      else if (kind === 'cloud') { ctx.fillStyle = 'rgba(70,80,95,.1)'; ctx.fillRect(0, 0, w, h); }
      if (this.W.season === 0 && kind !== 'rain') { ctx.fillStyle = 'rgba(250,190,210,.8)'; for (let i = 0; i < 18; i++) { const x = ((i * 131 + t * 24 + Math.sin(t * 0.7 + i) * 18) % (w + 20)), y = ((i * 77 + t * 30) % (h + 20)); ctx.beginPath(); ctx.ellipse(x, y, 2.4, 1.4, t + i, 0, 7); ctx.fill(); } }
      if (this.W.season === 2 && kind !== 'rain') { ctx.fillStyle = 'rgba(210,130,50,.8)'; for (let i = 0; i < 12; i++) { const x = ((i * 151 + t * 20 + Math.sin(t * 0.9 + i) * 22) % (w + 20)), y = ((i * 71 + t * 34) % (h + 20)); ctx.beginPath(); ctx.ellipse(x, y, 2.6, 1.6, t * 2 + i, 0, 7); ctx.fill(); } }
    },
    drawOverlayText(ctx) { /* ตำแหน่งที่ UI จัดการเอง */ }
  };

  /* ---------- รูปประจำตัว (ใช้ใน UI) ---------- */
  R.portrait = (canvas, n, size) => {
    const dpr = Math.min(2, g.devicePixelRatio || 1); size = size || 40; canvas.width = canvas.height = size * dpr; canvas.style.width = canvas.style.height = size + 'px';
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, size, size);
    const col = n.cult ? PATH_COL[n.cult.path] : ROBE_MORTAL; const rk = SECT.RANKS[n.rank];
    const bg = c.createLinearGradient(0, 0, 0, size); bg.addColorStop(0, shade(rk.color, 0.55)); bg.addColorStop(1, shade(rk.color, 0.05)); c.fillStyle = bg; c.fillRect(0, 0, size, size);
    const b = n.h.body, s = size / 40; const ap = { skin: b.skinHex || '#e8c49c', hair: b.hairHex || '#222', long: /ยาว|ปล่อย|ถัก/.test(b.hairStyle || '') || (n.h.sex === 'F' && !/สั้น|โกน/.test(b.hairStyle || '')), bun: /มวย|รวบ/.test(b.hairStyle || ''), bald: /โกน/.test(b.hairStyle || '') };
    c.save(); c.scale(s, s);
    if (ap.long) { c.fillStyle = ap.hair; c.beginPath(); c.ellipse(20, 20, 11.5, 14, 0, 0, 7); c.fill(); }
    c.fillStyle = col; c.beginPath(); c.moveTo(4, 40); c.lineTo(8, 29); c.quadraticCurveTo(20, 25, 32, 29); c.lineTo(36, 40); c.fill(); c.fillStyle = rk.color; c.fillRect(17, 28, 6, 12);
    c.fillStyle = ap.skin; c.fillRect(17, 24, 6, 6); c.beginPath(); c.ellipse(20, 17, 9, 10, 0, 0, 7); c.fill();
    if (!ap.bald) { c.fillStyle = ap.hair; c.beginPath(); c.ellipse(20, 12.5, 9.8, 7.5, 0, Math.PI, 0); c.fill(); c.fillRect(10.2, 11, 3, 6); c.fillRect(26.8, 11, 3, 6); if (ap.bun) { c.beginPath(); c.arc(20, 4.5, 4, 0, 7); c.fill(); } }
    c.fillStyle = '#1a1a22'; c.fillRect(14.5, 17, 3, 3.6); c.fillRect(22.5, 17, 3, 3.6); c.fillStyle = '#b5524a'; c.fillRect(18, 23, 4, 1.4);
    if (n.rank === 6) { c.fillStyle = '#f0cf4a'; c.fillRect(13, 5, 14, 3); c.fillRect(18.5, 1, 3, 5); } else if (n.rank === 5) { c.fillStyle = '#e8a43a'; c.fillRect(12, 7.5, 16, 2.5); } else if (n.rank === 4) { c.fillStyle = '#b53a2a'; c.fillRect(12, 8, 16, 2); }
    c.restore();
    if (n.dead) { c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(0, 0, size, size); }
  };

  R.PATH_COL = PATH_COL;
  g.Render = R;
})(typeof globalThis !== 'undefined' ? globalThis : this);
