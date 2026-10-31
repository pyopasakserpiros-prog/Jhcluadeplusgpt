'use strict';
const G = require('./load.js'); const { SIM, HC, CULT, STATS, SK, COMBAT: C } = G; const JD = G.JD;
const W = SIM.create('bal', { masterIdx: 0 }); STATS.now = 5;
const A = W.npcs[0]; const B = JSON.parse(JSON.stringify(A)); B.id = 'clone'; B.n = 99; W.npcs.push(B); W.byId[B.id] = B;
function setup(a, d, techIds) { [a, d].forEach(u => { u.x = 10; u.y = 10; u.sx = []; u.buffs = []; u.fled = u.yield = u.dead = false; u.cult.stage = a.cult.stage; u.h.state.hp = CULT.hpMax(u); u.h.state.qi = 1e6; u.h.state.energy = 100; u.h.state.heartDemon = 0; u.equip = {}; u.inj = []; STATS.dirty(u); u.act = { id: 'fight', ctx: { fid: 1, cd: 0, cds: {} } }; }); a.cult.techs = techIds || []; d.cult.techs = []; }
function mkF(a, d) { return { id: 1, serious: true, A: [a.id], B: [d.id], kind: 'duel' }; }
// 1) DPS parity ต่อรูปแบบท่า (เทียบตีธรรมดา) ต่อ 120 นาที ศัตรูอึด
const rows = {}; const stage = 3;
JD.TECH.techniques.filter(t => t.cat === 'COMBAT_TECHNIQUE').forEach(t => {
  const p = SK.profile(t); if (!p) return;
  const a = A, d = B; a.cult.stage = stage; d.cult.stage = stage; setup(a, d, [t.id]); const f = mkF(a, d); let dealt = 0, cd = 0; const hm = CULT.hpMax(d);
  for (let m = 0; m < 240; m++) { W.t = 1000 + m; STATS.now = W.t; const before = d.h.state.hp; C.statusTick(W, f, d); if (--cd <= 0) cd = C.attack(W, f, a, d); if (d.h.state.hp < before) dealt += before - d.h.state.hp; d.h.state.hp = hm; d.yield = false; d.fled = false; d.dead = false; a.cult.tm = {}; }
  (rows[p.arch] = rows[p.arch] || { n: 0, sum: 0, tiers: {} }); rows[p.arch].n++; rows[p.arch].sum += dealt / hm; (rows[p.arch].tiers[t.tier] = rows[p.arch].tiers[t.tier] || []).push(dealt / hm);
});
setup(A, B, []); { const f = mkF(A, B); let dealt = 0, cd = 0, hm = CULT.hpMax(B); for (let m = 0; m < 240; m++) { W.t = 1000 + m; if (--cd > 0) continue; const b = B.h.state.hp; cd = C.attack(W, f, A, B); dealt += b - B.h.state.hp; B.h.state.hp = hm; } rows.BASIC = { n: 1, sum: dealt / hm }; }
console.log('DPS ต่อ 240 นาที (หน่วย = พลังชีวิตสูงสุดของเป้า) ต่อรูปแบบ ท่า 1 ท่าล้วน ๆ');
Object.keys(rows).forEach(k => console.log(k.padEnd(8), 'avg', (rows[k].sum / rows[k].n).toFixed(2), rows[k].tiers ? 'byTier ' + Object.keys(rows[k].tiers).map(t => t + ':' + (rows[k].tiers[t].reduce((s, x) => s + x, 0) / rows[k].tiers[t].length).toFixed(2)).join(' ') : ''));
// 2) ดวลจำลอง: ชนะกี่ % เมื่อ stat เท่ากัน / ต่างขั้น
function duel(a, d, techA, techD, n) { let win = 0; for (let k = 0; k < n; k++) { setup(a, d, techA); d.cult.techs = techD || []; STATS.dirty(d); const f = mkF(a, d); let ca = 0, cb = 0; for (let m = 0; m < 400 && C.alive(a) && C.alive(d); m++) { W.t = 5000 + m; STATS.now = W.t; C.statusTick(W, f, a); C.statusTick(W, f, d); if (!C.alive(a) || !C.alive(d)) break; if (--ca <= 0 && !STATS.has(a, 'stun')) ca = C.attack(W, f, a, d); if (C.alive(d) && --cb <= 0 && !STATS.has(d, 'stun')) cb = C.attack(W, f, d, a); } if (!d.dead && !d.fled && !d.yield) { } const aw = (d.dead || d.fled || d.yield) && !(a.dead || a.fled || a.yield); if (aw) win++; else if (!(a.dead || a.fled || a.yield) && !(d.dead || d.fled || d.yield)) win += CULT.hpMax(a) && a.h.state.hp / CULT.hpMax(a) > d.h.state.hp / CULT.hpMax(d) ? 1 : 0; } return win / n; }
const a = A, d = B; a.cult.stage = 3; d.cult.stage = 3; a.h.state.qi = 1e6; d.h.state.qi = 1e6;
console.log('ท่าเท่ากัน ขั้นเท่ากัน ชนะ%:', (duel(a, d, [], [], 60) * 100).toFixed(0), '(คาด ~50 ขึ้นกับตัวตน)');
const strike = JD.TECH.techniques.filter(t => t.cat === 'COMBAT_TECHNIQUE' && SK.profile(t) && ['strike', 'flurry', 'burst', 'sweep'].includes(SK.profile(t).arch) && t.tier === 3).slice(0, 2).map(t => t.id);
console.log('มี 2 ท่า vs ไม่มี ชนะ%:', (duel(a, d, strike, [], 60) * 100).toFixed(0));
STATS.dirty(a);
if (process.argv[2] === 'dbg') {
  setup(A, B, []); const f = mkF(A, B); let ca = 0, cb = 0;
  for (let m = 0; m < 60 && C.alive(A) && C.alive(B); m++) { W.t = 9000 + m; STATS.now = W.t; if (--ca <= 0) ca = C.attack(W, f, A, B); if (--cb <= 0) cb = C.attack(W, f, B, A); if (m % 5 === 0) console.log(m, Math.round(A.h.state.hp), Math.round(B.h.state.hp), ca, cb, A.dead, B.dead, A.fled, B.fled, A.yield, B.yield); }
}
// ต่างขั้น: ขั้นสูงกว่า 1 ขั้นชนะกี่ %
{ const a = A, d = B; const r = []; [[3, 3], [4, 3], [5, 3], [3, 4]].forEach(([sa, sd]) => { let win = 0; for (let k = 0; k < 40; k++) { setup(a, d, []); a.cult.stage = sa; d.cult.stage = sd; STATS.dirty(a); STATS.dirty(d); a.h.state.hp = CULT.hpMax(a); d.h.state.hp = CULT.hpMax(d); const f = mkF(a, d); let ca = 0, cb = 0; for (let m = 0; m < 600 && C.alive(a) && C.alive(d); m++) { W.t = 7000 + m; STATS.now = W.t; if (--ca <= 0) ca = C.attack(W, f, a, d); if (C.alive(d) && --cb <= 0) cb = C.attack(W, f, d, a); } if (!C.alive(d) && C.alive(a)) win++; } r.push('ขั้น' + sa + ' vs ขั้น' + sd + ' ชนะ ' + Math.round(win / 40 * 100) + '%'); }); console.log(r.join(' | ')); }
