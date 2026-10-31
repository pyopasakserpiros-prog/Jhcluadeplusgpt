/* data_cb.js — โอสถเสริมการรบ (v1.4): กินก่อนศึกแล้วได้บัฟชั่วคราว มีข้อแลกเปลี่ยนและพิษสะสม */
(function (g) {
  'use strict';
  const JD = g.JD, CB = {};
  const MAT = JD.ITEMS.materials;
  const pick = (cat, tier, i) => { const l = MAT.filter(m => m.category === cat && m.tier === tier); return l.length ? l[(i || 0) % l.length].id : null; };
  const D = [
    // id, ชื่อ, tier, p(เปอร์เซ็นต์ของค่าฐาน), f(ค่าบวกตรง), ระยะ(นาทีเกม), พิษ, คำอธิบาย
    ['FURY', 'โอสถเดือดโลหิต', 2, { atk: .25, matk: .15 }, { crit: 6 }, 300, 5, 'ฮึกเหิม โจมตีแรงขึ้น คริง่ายขึ้น'],
    ['STONE', 'โอสถผิวศิลา', 2, { def: .3, mdef: .12, hp: .1 }, {}, 300, 4, 'ผิวหนังแข็งดั่งศิลา ทนทานขึ้นมาก'],
    ['WIND', 'โอสถย่างลม', 2, { eva: .25 }, { move: 20, cast: 12 }, 300, 4, 'ร่างเบา เคลื่อนไหวและร่ายวิชาไวขึ้น'],
    ['EYE', 'โอสถเนตรแจ่ม', 3, { acc: .3 }, { crit: 8, pen: 10 }, 300, 6, 'สายตาแจ่มชัด เล็งแม่นและเห็นจุดอ่อนเกราะ'],
    ['SPIRIT', 'โอสถห่มจิตสวรรค์', 3, { matk: .25, mdef: .25 }, { cast: 8 }, 300, 6, 'จิตวิญญาณหนุนวิชาและต้านวิชาแปลกปลอม'],
    ['BERSERK', 'โอสถคลั่งสวรรค์', 4, { atk: .45, matk: .25, def: -.2 }, { crit: 12, critDmg: 30 }, 240, 14, 'พลังพุ่งแต่เปิดเกราะ พิษหนัก ใช้เมื่อจำเป็นเท่านั้น']
  ];
  CB.RECIPES = D.map((d, i) => {
    const t = d[2], inputs = [{ matId: pick('HERB', t, i), count: 2 }, { matId: pick('BEAST_PART', t, i + 1), count: 1 }].filter(x => x.matId);
    const r = { id: 'CB_' + d[0], nameTh: 'ตำรับ' + d[1], craft: 'ALCHEMY', tier: t, minMastery: 20 + 10 * t, days: 8 + 3 * t, inputs, outType: 'PILL', outNameTh: d[1], yield: 1,
      effect: { cbBuff: { id: d[0], name: d[1], p: d[3], f: d[4], dur: d[5] }, toxicity: d[6] }, descTh: d[7] };
    JD.ITEMS.recipes.push(r); return r;
  });
  g.JD.CB = CB;
})(typeof globalThis !== 'undefined' ? globalThis : this);
