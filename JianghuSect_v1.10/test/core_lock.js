'use strict';
// ล็อกแกนมนุษย์: ถ้านิยามมิติถูกแก้ ค่า fingerprint จะเปลี่ยนและ test นี้ล้ม
const G = require('./load.js'); const { HC, SIM } = G;
const EXPECT = '155:2f9c9dd7'; let bad = 0;
const ck = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) bad++; };
ck(HC.FINGERPRINT === EXPECT, 'fingerprint ' + HC.FINGERPRINT + ' == ' + EXPECT);
const cnt = {}; HC.STAT_DEFS.forEach(s => cnt[s.layer] = (cnt[s.layer] || 0) + 1);
ck(cnt.personality === 14 && cnt.values === 8 && cnt.aptitudes === 6, 'personality 14 / values 8 / aptitudes 6');
const W = SIM.create('lock1', { masterIdx: 0 }); let errs = 0; W.npcs.forEach(n => errs += HC.validate(n).length); ck(errs === 0, 'validate ' + W.npcs.length + ' npcs');
const a = W.npcs[0], b = W.npcs[1], c = HC.compare(a, b), c2 = HC.compare(a, a); ck(c.similarity < 100 && c2.similarity === 100, 'compare A≠B (' + c.similarity + '%), A=A (100%)');
const s = SIM.serialize(W); ck(JSON.parse(s).hc === EXPECT, 'save carries fingerprint');
process.exit(bad ? 1 : 0);
