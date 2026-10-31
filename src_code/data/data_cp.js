/* data_cp.js — โอสถฟื้นฟูพื้นฐาน (v1.7): สูตรที่สำนักสอนทุกคน: สูตรทั่วไปใช้สมุนไพรชั้น 1 ส่วนสูตรเข้มข้นใช้สมุนไพรชั้น 2 */
(function (g) {
  'use strict';
  const JD = g.JD, CP = {};
  const H1 = ['MAT_HERB_DEW_GRASS_1', 'MAT_HERB_CINDER_LEAF_1'], H2 = ['MAT_HERB_JADE_LOTUS_2', 'MAT_HERB_MIST_ORCHID_2'];
  const D = [
    ['HP', 'โอสถฟื้นเลือด', 1, [[H1[0], 2], [H1[1], 1]], { healHealth: 35, toxicity: 1 }, 'ฟื้นพลังชีวิตพื้นฐาน'],
    ['HP2', 'โอสถฟื้นเลือดเข้มข้น', 2, [[H2[0], 2], [H1[0], 1]], { healHealth: 70, toxicity: 2 }, 'ฟื้นพลังชีวิตมากขึ้น'],
    ['QI', 'โอสถฟื้นปราณ', 1, [[H1[1], 2], [H1[0], 1]], { qiRestore: 0.5, toxicity: 1 }, 'ฟื้นปราณกลางศึก'],
    ['QI2', 'โอสถฟื้นปราณเข้มข้น', 2, [[H2[1], 2], [H1[1], 1]], { qiRestore: 0.9, toxicity: 2 }, 'ฟื้นปราณเกือบเต็ม'],
    ['VIGOR', 'โอสถฟื้นกำลัง', 1, [[H1[0], 1], [H1[1], 2]], { energyRestore: 40, restRestore: 20, toxicity: 1 }, 'คลายเหนื่อย'],
    // ตำรับฟื้นฟูพื้นฐานทุกชนิดใช้สมุนไพรชั้น 1 ที่เก็บได้ทั่วไปในหุบเขา
    ['WOUND', 'โอสถสมานแผล', 1, [[H1[0], 2], [H1[1], 1]], { healInjury: 30, healHealth: 10, toxicity: 1 }, 'สมานบาดแผล'],
    ['DETOX', 'โอสถล้างพิษ', 1, [[H1[1], 2], [H1[0], 1]], { clearToxic: 25, toxicity: 0 }, 'ล้างพิษโอสถสะสม'],
    ['CALM', 'โอสถสงบจิต', 1, [[H1[0], 1], [H1[1], 1]], { clearHeartDemon: 25, toxicity: 0 }, 'ระงับจิตมาร']
  ];
  CP.BASIC = D.map(d => {
    const r = { id: 'BASIC_' + d[0], nameTh: 'ตำรับ' + d[1] + ' (สำนักสอนทุกคน)', craft: 'ALCHEMY', tier: d[2], minMastery: d[2] === 1 ? 0 : 12, days: 1, inputs: d[3].map(x => ({ matId: x[0], count: x[1] })), outType: 'PILL', outNameTh: d[1], yield: 2, basic: true, effect: d[4], descTh: d[5] };
    JD.ITEMS.recipes.push(r); return r;
  });
  CP.RECOVERY = { hp: ['P:BASIC_HP', 'P:BASIC_HP2'], qi: ['P:BASIC_QI', 'P:BASIC_QI2'], vigor: ['P:BASIC_VIGOR'], wound: ['P:BASIC_WOUND'], detox: ['P:BASIC_DETOX'], calm: ['P:BASIC_CALM'] };
  g.JD.CP = CP;
})(typeof globalThis !== 'undefined' ? globalThis : this);
