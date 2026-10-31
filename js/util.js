/* util.js — เครื่องมือพื้นฐาน: สุ่มแบบกำหนดเมล็ด (seeded RNG), คณิตศาสตร์, heap
 * ทำงานได้ทั้งใน browser และ Node (สำหรับ test) */
(function (g) {
  'use strict';
  const U = {};

  U.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.round1 = v => Math.round(v * 10) / 10;
  U.dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  U.pad2 = n => (n < 10 ? '0' : '') + n;
  U.fmtNum = n => {
    n = Math.round(n);
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (Math.abs(n) >= 1e4) return (n / 1e3).toFixed(1) + 'k';
    return String(n);
  };

  /* sfc32 — เล็ก เร็ว เก็บ/คืนสถานะได้ */
  function hashStr(s) {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return h >>> 0;
  }
  class RNG {
    constructor(seed) {
      if (typeof seed === 'string') seed = hashStr(seed);
      seed = (seed >>> 0) || 1;
      this.a = 0x9E3779B9; this.b = 0x243F6A88 ^ seed; this.c = 0xB7E15162 + seed; this.d = seed | 1;
      for (let i = 0; i < 15; i++) this.next();
    }
    next() {
      this.a >>>= 0; this.b >>>= 0; this.c >>>= 0; this.d >>>= 0;
      let t = (this.a + this.b) | 0;
      this.a = this.b ^ (this.b >>> 9);
      this.b = (this.c + (this.c << 3)) | 0;
      this.c = (this.c << 21) | (this.c >>> 11);
      this.d = (this.d + 1) | 0;
      t = (t + this.d) | 0;
      this.c = (this.c + t) | 0;
      return (t >>> 0) / 4294967296;
    }
    float(a, b) { return a + (b - a) * this.next(); }
    int(a, b) { return a + Math.floor(this.next() * (b - a + 1)); }
    chance(p) { return this.next() < p; }
    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
    gauss(mean, sd) {
      let u = 0, v = 0;
      while (u === 0) u = this.next();
      while (v === 0) v = this.next();
      return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    /* สุ่มถ่วงน้ำหนัก: items เป็น array, wf(item)->weight */
    weighted(items, wf) {
      let tot = 0; const ws = items.map(i => { const w = Math.max(0, wf(i)); tot += w; return w; });
      if (tot <= 0) return items[Math.floor(this.next() * items.length)];
      let r = this.next() * tot;
      for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
      return items[items.length - 1];
    }
    shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(this.next() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
    getState() { return [this.a, this.b, this.c, this.d]; }
    setState(s) { this.a = s[0]; this.b = s[1]; this.c = s[2]; this.d = s[3]; }
  }
  U.RNG = RNG;
  U.hashStr = hashStr;

  /* binary min-heap สำหรับ A* */
  class MinHeap {
    constructor() { this.k = []; this.v = []; }
    get size() { return this.k.length; }
    clear() { this.k.length = 0; this.v.length = 0; }
    push(key, val) {
      const k = this.k, v = this.v; let i = k.length; k.push(key); v.push(val);
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (k[p] <= key) break;
        k[i] = k[p]; v[i] = v[p];
        i = p;
      }
      k[i] = key; v[i] = val;
    }
    pop() {
      const k = this.k, v = this.v; const top = v[0]; const lk = k.pop(), lv = v.pop();
      const n = k.length;
      if (n > 0) {
        let i = 0;
        for (;;) {
          const l = (i << 1) + 1, r = l + 1;
          if (l >= n) break;
          let m = l;
          if (r < n && k[r] < k[l]) m = r;
          if (lk <= k[m]) break;
          k[i] = k[m]; v[i] = v[m];
          i = m;
        }
        k[i] = lk; v[i] = lv;
      }
      return top;
    }
  }
  U.MinHeap = MinHeap;

  g.U = U;
  if (typeof module === 'object' && module.exports) module.exports = U;
})(typeof globalThis !== 'undefined' ? globalThis : this);
