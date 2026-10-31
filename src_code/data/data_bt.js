/* data_bt.js — ข้อมูลระบบคอขวด/ทะลวง (v1.10.8): โอสถทะลวงเฉพาะขั้นเฉพาะสาย + สมบัติประจำด่านใหญ่ (5 วิถีหลัก)
 * โอสถ: แต่ละ "ขั้น→ขั้นถัดไป" ของแต่ละสาย มีโอสถของตัวเอง (ชื่อ/วัตถุดิบ/ระดับต่างกัน) ใส่เข้าตำรับหอโอสถ
 * สมบัติ: ด่านใหญ่ของแต่ละสายต้องมีสมบัติเฉพาะ ขาดแล้วโอกาสตกฮวบ (หาได้จากถ้ำ/ประตูมิติ/ผจญโชค) */
(function (g) {
  'use strict';
  const JD = g.JD, BT = {};
  const MAT = JD.ITEMS.materials;
  const pick = (cat, tier, i) => { const l = MAT.filter(m => !m.sourcePack && m.category === cat && m.tier === tier); return l.length ? l[(i || 0) % l.length].id : null; };
  const PATH_LABEL = { XIAN: 'เซียน', BODY: 'กายา', GOD: 'เทพศรัทธา', DEMON: 'มารอสูร', HEART_SOUL: 'จิต·เซน' };
  const PILLS = {
    XIAN: ['โอสถชำระลมปราณ', 'โอสถเสริมรากฐาน', 'โอสถก่อแก่นทอง', 'โอสถอุ้มทารกวิญญาณ', 'โอสถแปรวิญญาณ', 'โอสถหลอมความว่าง', 'โอสถมหายานวารี', 'โอสถข้ามผ่านสวรรค์'],
    BODY: ['โอสถหลอมเลือดเหล็ก', 'โอสถสำริดหล่อกระดูก', 'โอสถทองอมตะแปรเนื้อ', 'โอสถวัชระทลายพันธนาการ'],
    GOD: ['โอสถน้อมจิตรับตรา', 'โอสถประทับเทวรูป', 'โอสถสถาปนาแดนเทพ'],
    DEMON: ['โอสถก่อจิตมาร', 'โอสถหลอมโลหิตหยิน', 'โอสถรากฐานมารอสูร', 'โอสถแก่นมารทมิฬ', 'โอสถทารกมารนิรันดร์', 'โอสถจอมมารสะท้านภพ', 'โอสถทลายเขตแดนมาร', 'โอสถมารบรรพกาลอมตะ'],
    HEART_SOUL: ['โอสถเปิดเนตรวิญญาณ', 'โอสถกระจกใจไร้ฝุ่น', 'โอสถก่อรูปทะเลจิต', 'โอสถดวงจิตโพธิญาณ', 'โอสถกายทิพย์จำแลง', 'โอสถปราชญ์วิญญาณรู้แจ้ง', 'โอสถเขตแดนจิตสุญตา', 'โอสถมหาเมธีเหนือกาล']
  };
  const TIERS = { XIAN: [1, 2, 3, 4, 5, 6, 7, 7], BODY: [2, 3, 5, 6], GOD: [2, 4, 6], DEMON: [1, 2, 3, 4, 5, 6, 7, 7], HEART_SOUL: [1, 2, 3, 4, 5, 6, 7, 7] };
  const BASE = { XIAN: .12, BODY: .12, GOD: .14, DEMON: .12, HEART_SOUL: .13 }, STEP = { XIAN: .025, BODY: .04, GOD: .05, DEMON: .025, HEART_SOUL: .025 };
  BT.PILL_RECIPES = [];
  Object.keys(PILLS).forEach(path => PILLS[path].forEach((name, i) => {
    const s = i + 1, t = TIERS[path][i], inputs = [];
    const herb = pick('HERB', t, s), beast = pick('BEAST_PART', t, s + 1), ore = pick('ORE', t, s), form = pick('FORMATION_PART', Math.min(5, Math.max(2, t)), s);
    if (path === 'DEMON') {
      if (herb) inputs.push({ matId: herb, count: 1 });
      if (beast) inputs.push({ matId: beast, count: 2 });
      if (s >= 3 && ore) inputs.push({ matId: ore, count: 1 });
    } else if (path === 'HEART_SOUL') {
      if (herb) inputs.push({ matId: herb, count: 2 });
      if (form) inputs.push({ matId: form, count: 1 });
      else if (beast) inputs.push({ matId: beast, count: 1 });
      if (s >= 4 && ore) inputs.push({ matId: ore, count: 1 });
    } else {
      if (herb) inputs.push({ matId: herb, count: 2 });
      if (path === 'BODY') { if (beast) inputs.push({ matId: beast, count: 2 }); if (ore && s >= 2) inputs.push({ matId: ore, count: 1 }); }
      else if (path === 'GOD') { if (beast) inputs.push({ matId: beast, count: 1 }); if (form) inputs.push({ matId: form, count: 2 }); }
      else { if (beast) inputs.push({ matId: beast, count: 1 }); if (s >= 3 && ore) inputs.push({ matId: ore, count: 1 }); }
    }
    if ((path === 'XIAN' || path === 'DEMON' || path === 'HEART_SOUL') && s >= 7) inputs.push({ matId: pick('HERITAGE_RELIC', 7, s), count: 1 });
    const r = { id: 'BT_' + path + '_' + s, nameTh: 'ตำรับ' + name, craft: 'ALCHEMY', tier: t, minMastery: Math.min(95, 18 + 10 * s + (path === 'XIAN' || path === 'DEMON' || path === 'HEART_SOUL' ? 0 : 6)), days: 10 + 4 * s, inputs, outType: 'PILL', outNameTh: name,
      effect: { breakthroughBonus: Math.round((BASE[path] + STEP[path] * s) * 1000) / 1000, toxicity: (path === 'DEMON' ? 4 : path === 'HEART_SOUL' ? 2 : 3) + 2 * s, btFor: { path, stage: s } }, descTh: 'โอสถเฉพาะสำหรับทะลวงจากขั้น ' + s + ' ของสาย' + (PATH_LABEL[path] || path) + ' ใช้ผิดขั้นผลจะลดลงและพิษสะสม', yield: 1 };
    BT.PILL_RECIPES.push(r); JD.ITEMS.recipes.push(r);
  }));
  /* สมบัติประจำด่านใหญ่: key = path + ':' + ขั้นปัจจุบัน */
  const T = (id, nameTh, tier, value, hint) => ({ id: 'T:' + id, nameTh, tier, value, hint });
  BT.TREASURES = {
    'XIAN:3': T('XIAN3', 'หยกก่อแก่นทอง', 3, 420, 'หยกที่ซับปราณฟ้าดินจนเป็นหนึ่ง ใช้ตั้งแก่นทองคำ'),
    'XIAN:4': T('XIAN4', 'บัวแสงรองรับทารกวิญญาณ', 4, 900, 'ดอกบัวที่รับวิญญาณแรกกำเนิดไม่ให้แตกสลาย'),
    'XIAN:5': T('XIAN5', 'กระจกแปรวิญญาณ', 5, 1900, 'กระจกโบราณสะท้อนตัวตนเดิมเพื่อแปรเปลี่ยน'),
    'XIAN:6': T('XIAN6', 'ผลึกความว่างเปล่า', 6, 4200, 'ผลึกจากรอยแยกมิติ ช่วยหลอมรวมกับความว่าง'),
    'XIAN:7': T('XIAN7', 'ประกายอสนีบรรพกาล', 6, 6500, 'สายฟ้าแรกของโลกที่ถูกกักไว้ ช่วยข้ามทัณฑ์สวรรค์'),
    'XIAN:8': T('XIAN8', 'บัตรเชิญสวรรค์เซียน', 7, 12000, 'บัตรจากแดนเบื้องบน เปิดทางสู่ขั้นสูงสุด'),
    'BODY:2': T('BODY2', 'ธาตุทองหลอมกาย', 3, 480, 'โลหะเหนือโลหะ หลอมเข้ากับกระดูก'),
    'BODY:3': T('BODY3', 'โลหิตมังกรหลอมวัชระ', 5, 2400, 'โลหิตมังกรที่ยังร้อนอยู่ ช่วยแปรเนื้อเป็นวัชระ'),
    'BODY:4': T('BODY4', 'กระดูกบรรพชนยักษ์', 6, 5200, 'กระดูกเทพยักษ์ยุคแรก ให้กายาเป็นหนึ่งกับภูผา'),
    'GOD:2': T('GOD2', 'ศิลาตราเทวบัญชา', 4, 1100, 'ศิลาที่ถูกตีตราโดยเทพองค์เก่าแก่'),
    'GOD:3': T('GOD3', 'เปลวศรัทธานิรันดร์', 6, 5000, 'เปลวที่ไม่เคยดับตลอดหมื่นปี ก่อตั้งอาณาจักรเทพ'),
    'DEMON:3': T('DEMON3', 'ผลึกโลหิตตั้งแก่นมาร', 3, 440, 'ผลึกโลหิตอสูรพันปี ใช้หล่อหลอมแก่นมารทมิฬ'),
    'DEMON:4': T('DEMON4', 'โถหยกดำอุ้มทารกมาร', 4, 920, 'โถหยกดำโบราณจากหุบเหวมาร ประคองทารกมารนิรันดร์'),
    'DEMON:5': T('DEMON5', 'กระจกเงาอเวจีสะท้อนภพ', 5, 1950, 'กระจกหยินโบราณสะท้อนจิตสังหารขึ้นสู่ขั้นจอมมาร'),
    'DEMON:6': T('DEMON6', 'ศิลาดาราทมิฬทลายฟ้า', 6, 4300, 'ศิลาดาวตกอาบปราณมาร ใช้กางเขตแดนมารทลายฟ้า'),
    'DEMON:7': T('DEMON7', 'หัวใจอสูรบรรพกาลอมตะ', 6, 6600, 'หัวใจอสูรยุคบรรพกาลที่ยังเต้นอยู่ ต้านทานทัณฑ์สวรรค์'),
    'DEMON:8': T('DEMON8', 'ตราโกลาหลสามภพ', 7, 12500, 'ตราประทับแห่งมหาจักรพรรดิมารนิรันดร์'),
    'HEART_SOUL:3': T('SOUL3', 'หยกสื่อวิญญาณโพธิญาณ', 3, 430, 'หยกใสบริสุทธิ์ช่วยควบแน่นทะเลจิตสู่ดวงจิตโพธิญาณ'),
    'HEART_SOUL:4': T('SOUL4', 'บุปผาวิญญาณกายทิพย์', 4, 910, 'ดอกไม้ทิพย์ที่เบ่งบานในห้วงสมาธิ ใช้ก่อรูปกายทิพย์จำแลง'),
    'HEART_SOUL:5': T('SOUL5', 'ม้วนหยกสัจธรรมรู้แจ้ง', 5, 1920, 'ม้วนหยกจารึกอักษรเซนโบราณ เปิดปัญญาปราชญ์วิญญาณ'),
    'HEART_SOUL:6': T('SOUL6', 'ผลึกดาราวิญญาณสุญตา', 6, 4250, 'ผลึกใสสะท้อนความว่างเปล่า ใช้กางเขตแดนจิตสุญตา'),
    'HEART_SOUL:7': T('SOUL7', 'น้ำอมฤตกระจกใจเหนือกาล', 6, 6550, 'น้ำทิพย์ชำระล้างทะเลจิตให้ข้ามพ้นกาลเวลา'),
    'HEART_SOUL:8': T('SOUL8', 'แก่นสัจธรรมสุญตาจักรวาล', 7, 12200, 'แก่นแท้แห่งจิตจักรวาล เปิดทางสู่จอมปราชญ์จิตสูงสุด')
  };
  g.JD.BT = BT;
})(typeof globalThis !== 'undefined' ? globalThis : this);
