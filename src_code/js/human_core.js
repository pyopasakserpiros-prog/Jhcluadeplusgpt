/* ============================================================================
 * human_core.js — HUMAN CORE v1.0.0  (แกนความเป็นมนุษย์ของ NPC — ล็อกโครงสร้างถาวร)
 *
 * หลักการ: ระบบใหม่ใด ๆ ในอนาคต (วิถีใหม่, อาชีพใหม่, ฉากใหม่) ต้อง "อ่าน/ปรับ" ค่าในแกนนี้
 * ผ่าน modifier เท่านั้น ห้ามเพิ่ม/ลบ/เปลี่ยนความหมายของมิติเดิม (ตรวจด้วย HC.FINGERPRINT)
 * ส่วนที่ต้องการเก็บข้อมูลเพิ่มให้ใส่ที่ npc.ext[<ชื่อระบบ>] ไม่ใช่ใน npc.h
 *
 * ชั้นของตัวตน (Layers):
 *  L0 ตัวตนถาวร   : ชื่อ เพศ วันเกิด ภูมิหลัง กายา รากวิญญาณ trait
 *  L1 กายภาพ      : รูปร่าง (body) + สมรรถนะร่างกาย 22 (physiology) + พันธุกรรม (innate)
 *  L2 สติปัญญา    : 18 ความสามารถทางสมอง (intellect)  — "ทำได้แค่ไหน"
 *  L3 สังคม       : 7 ความสามารถทางสังคม (social)
 *  L4 อารมณ์พื้นฐาน: 7 อุปนิสัยทางอารมณ์ (temperament)
 *  L5 บุคลิก 14   : personality — "โน้มเอียงจะทำอะไร"
 *  L6 คุณค่าชีวิต 8: values — "อะไรสำคัญกับชีวิต"
 *  L7 พรสวรรค์ 6 + ความถนัด 23: aptitudes / affinities
 *  L8 สิ่งที่ชอบ 24: interests — "ทำแล้วมีความสุข"  (แยกจากความถนัด: ชอบแต่ไม่เก่งได้)
 *  L9 ทักษะที่ฝึกมา 26: skills — "ทำได้จริงตอนนี้"
 *  L10 โชคชะตา    : destiny (โชค, กรรม)
 *  L11 สภาวะพลวัต : state (HP ปราณ ความหิว ความเหนื่อย อารมณ์ ความเครียด …) + fulfil (ความอิ่มเอมของ 8 คุณค่า)
 *  L12 จิตใจ-ความทรงจำ-ความสัมพันธ์-เป้าหมายชีวิต-ชีวประวัติ-ครอบครัว
 * ============================================================================ */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js');
  const JD = g.JD;
  const C = JD.CORE;
  const clamp = U.clamp;

  const HC = { VERSION: '1.0.0', SCHEMA: 'HUMAN_CORE_V1' };

  /* -------------------------------------------------------------------------
   * 1) ทะเบียนมิติ (STAT_DEFS) — แหล่งความจริงเดียวของ "ตัวตนวัดอย่างไร"
   *    mean/sd = การกระจายประชากรมนุษย์ปกติ (ใช้คำนวณ z-score ความโดดเด่น)
   * ------------------------------------------------------------------------- */
  const D = []; // {path,layer,id,nameTh,descTh,mean,sd,kind}
  function def(layer, id, nameTh, descTh, mean, sd, kind) {
    D.push({ path: layer + '.' + id, layer, id, nameTh, descTh, mean: mean == null ? 50 : mean, sd: sd || 15, kind: kind || 'cap' });
  }

  // --- กายภาพ 22 (kind: P=พลังกาย, S=ประสาทสัมผัส, R=ฟื้นฟู, M=ปราณ-จิตวิญญาณ) ---
  [
    ['strength', 'กำลังกล้ามเนื้อ', 'แรงยก แรงจับ แรงฟัน — กำหนดความหนักของการโจมตีและการแบก', 'P'],
    ['explosiveness', 'พลังระเบิด', 'แรงสูงสุดในชั่วขณะ กระโดด พุ่งตัว ออกแรงฉับพลัน', 'P'],
    ['speed', 'ความเร็ว', 'ความเร็วในการเคลื่อนที่และเดินทาง', 'P'],
    ['agility', 'ความคล่องแคล่ว', 'การเปลี่ยนทิศ หลบหลีก ทรงตัวในท่าทางที่ซับซ้อน', 'P'],
    ['reflex', 'ปฏิกิริยาตอบสนอง', 'ความเร็วจากเห็นถึงขยับ — รับมือการโจมตีไม่ทันตั้งตัว', 'P'],
    ['dexterity', 'ความชำนาญมือ', 'ความละเอียดของมือและนิ้ว — งานประณีต ปรุงยา จารึกยันต์', 'P'],
    ['balance', 'การทรงตัว', 'ยืน เดิน กระโดดบนพื้นที่แคบ สูง ลื่น', 'P'],
    ['flexibility', 'ความอ่อนตัว', 'ช่วงการเคลื่อนไหวของข้อต่อ — ลดบาดเจ็บ ใช้ท่ายาก', 'P'],
    ['endurance', 'ความอึดทน', 'ทนทานต่อความเหนื่อยล้า ทำงาน/ฝึก/เดินทางได้ยาวนาน', 'R'],
    ['toughness', 'ความทนทานของร่าง', 'กระดูกและเนื้อทนแรงกระแทก/ของมีคม — ลดความเสียหายที่ได้รับ', 'P'],
    ['painTolerance', 'ทนความเจ็บปวด', 'ฝืนสู้ต่อทั้งที่บาดเจ็บ ไม่ช็อกง่าย', 'R'],
    ['recoveryRate', 'การฟื้นตัว', 'ความเร็วหายจากบาดเจ็บ เหนื่อย และป่วย', 'R'],
    ['vitality', 'พลังชีวิต', 'ความแข็งแรงโดยรวมของร่าง — กำหนด HP สูงสุดและอายุขัยมนุษย์', 'R'],
    ['immunity', 'ภูมิต้านทาน', 'ต้านโรค พิษ และสิ่งปนเปื้อน', 'R'],
    ['thermalTolerance', 'ทนร้อนหนาว', 'ทนอากาศสุดขั้ว ไฟ ไอเย็น', 'R'],
    ['vision', 'สายตา', 'การมองเห็นไกล ชัด และในที่มืด', 'S'],
    ['hearing', 'การได้ยิน', 'จับเสียงเบา ทิศทางเสียง', 'S'],
    ['smellTaste', 'ฆานะและรส', 'ดมกลิ่น แยกรสชาติ — โอสถ พิษ อาหาร', 'S'],
    ['senseAcuity', 'ญาณสัมผัส', 'สัมผัสที่หกต่อปราณ เจตนา และอันตรายล่วงหน้า', 'S'],
    ['spiritualFoundation', 'รากฐานจิตวิญญาณ', 'ความมั่นคงของดวงจิต — ต้านจิตมาร รองรับปราณที่สูงขึ้น', 'M'],
    ['meridianCapacity', 'ความจุเส้นลมปราณ', 'ปริมาณปราณที่เส้นลมปราณรองรับได้', 'M'],
    ['meridianIntegrity', 'ความสมบูรณ์เส้นลมปราณ', 'ความไม่เสียหาย/ไม่ตีบตันของเส้นลมปราณ', 'M']
  ].forEach(a => def('physiology', a[0], a[1], a[2], 50, 15, a[3]));

  // --- สติปัญญา 18 (อิง CHC / Gardner) kind: F=ไหลลื่น C=สะสม ---
  [
    ['reasoning', 'การใช้เหตุผล', 'ตรรกะ แก้ปัญหาใหม่ ๆ ที่ไม่เคยเจอ', 'F'],
    ['comprehension', 'ความเข้าใจ-ซึมซับ', 'เข้าใจเรื่องซับซ้อน (ทั้งตำรา คน เหตุการณ์) แล้วเชื่อมโยง', 'C'],
    ['memory', 'ความจำระยะยาว', 'จำได้นานและแม่นยำ — สูตร ใบหน้า คำสัญญา', 'F'],
    ['workingMemory', 'ความจำใช้งาน', 'ถือหลายเรื่องไว้ในหัวพร้อมกัน — ศึกที่ซับซ้อน การปรุงหลายขั้น', 'F'],
    ['learningSpeed', 'ความเร็วในการเรียนรู้', 'ซึมซับทักษะ/วิชาใหม่เร็วแค่ไหน', 'F'],
    ['thinkingSpeed', 'ความเร็วในการคิด', 'ตัดสินใจและประมวลผลเร็ว', 'F'],
    ['focus', 'สมาธิจดจ่อ', 'จดจ่อกับงานโดยไม่วอกแวก', 'F'],
    ['spatial', 'มิติสัมพันธ์', 'จินตนาการรูปทรง ทิศทาง แผนที่ ค่ายกล', 'F'],
    ['numeracy', 'ความคิดเชิงตัวเลข', 'คำนวณ ประเมินปริมาณ ราคา สัดส่วน', 'C'],
    ['verbal', 'ภาษาและวาทะ', 'คลังคำ การสื่อสาร การอ่านเขียน', 'C'],
    ['planning', 'การวางแผนล่วงหน้า', 'มองหลายก้าว จัดลำดับ คาดผลที่ตามมา', 'C'],
    ['judgement', 'วิจารณญาณ', 'ตัดสินใจถูกใต้แรงกดดันและข้อมูลไม่ครบ', 'C'],
    ['inventiveness', 'ความสามารถคิดค้น', 'ผสมผสานสร้างสิ่งใหม่ — ตำรับ ท่าวิชา วิธีแก้ปัญหา (ต่างจากบุคลิก "ใจชอบสร้างสรรค์")', 'F'],
    ['intuition', 'สัญชาตญาณ', 'จับรูปแบบโดยไม่รู้ตัว — สังหรณ์ใจ', 'F'],
    ['perceptiveness', 'ช่างสังเกต', 'เห็นรายละเอียดที่คนอื่นมองข้าม — เบาะแส ความผิดปกติ', 'F'],
    ['readPeople', 'อ่านใจคน', 'เข้าใจอารมณ์ เจตนา และการโกหกของผู้อื่น', 'C'],
    ['wisdom', 'ปัญญาจากชีวิต', 'ผลึกประสบการณ์ ใช้ความรู้อย่างเหมาะสม (เพิ่มตามวัยและเหตุการณ์)', 'C'],
    ['willpower', 'พลังจิตใจ', 'ฝืนความกลัว ความเจ็บ และความยั่วยวน ต้านจิตมาร', 'C']
  ].forEach(a => def('intellect', a[0], a[1], a[2], 50, 15, a[3]));

  // --- สังคม 7 ---
  [
    ['charisma', 'เสน่ห์-บารมี', 'ทำให้คนอยากเข้าใกล้ เชื่อฟัง และจดจำ'],
    ['persuasion', 'การโน้มน้าว-เจรจา', 'ทำให้คนเปลี่ยนใจ ต่อรอง ไกล่เกลี่ย'],
    ['deception', 'การหลอกลวง-ปิดบัง', 'โกหก ปลอมตัว ซ่อนเจตนา'],
    ['leadership', 'ภาวะผู้นำ', 'รวมคน จัดคน สร้างขวัญกำลังใจ'],
    ['teaching', 'การถ่ายทอด', 'สอนให้ผู้อื่นเข้าใจและทำได้'],
    ['intimidation', 'ข่มขวัญ', 'ทำให้คนเกรงกลัวด้วยท่าที สายตา หรืออำนาจ'],
    ['hospitality', 'อัธยาศัย-เอาใจใส่', 'ดูแล ต้อนรับ ประสานรอยร้าว']
  ].forEach(a => def('social', a[0], a[1], a[2], 50, 15, 'cap'));

  // --- อุปนิสัยทางอารมณ์ 7 (พื้นอารมณ์ติดตัว) ---
  [
    ['sociability', 'ความชอบสังคม', 'พลังจากการอยู่กับผู้คน (สูง=เอ็กซ์โทรเวิร์ต ต่ำ=สันโดษ)'],
    ['energyLevel', 'พลังกระตือรือร้น', 'ความคึกคัก อยู่ไม่สุข ลุกขึ้นทำสิ่งต่าง ๆ'],
    ['emotionalReactivity', 'ความไวทางอารมณ์', 'อารมณ์ขึ้นลงแรงและเร็วเพียงใด'],
    ['optimism', 'มองโลกในแง่ดี', 'โน้มเอียงที่จะเห็นด้านบวกและมีความหวัง'],
    ['humor', 'อารมณ์ขัน', 'ความขี้เล่น ผ่อนคลายบรรยากาศ'],
    ['sensationSeeking', 'ชอบความตื่นเต้น', 'โหยหาสิ่งใหม่ อันตราย และสิ่งเร้า'],
    ['affection', 'ความอ่อนโยนรักใคร่', 'แสดงความใกล้ชิด ผูกพัน และโรแมนติก']
  ].forEach(a => def('temperament', a[0], a[1], a[2], 50, 15, 'cap'));

  // --- บุคลิก 14 / คุณค่า 8 / พรสวรรค์ 6 (จากข้อมูลเกมเก่า) ---
  C.personality14.forEach(p => def('personality', p.id, p.nameTh, p.descTh, p.def, 16, 'trait'));
  C.values8.forEach(p => def('values', p.id, p.nameTh, p.descTh, p.def, 16, 'value'));
  C.aptitudes6.forEach(p => def('aptitudes', p.id, p.nameTh, p.descTh, p.def, 15, 'cap'));

  // --- ความถนัด 23 (affinities) ---
  const AFF_TH = {
    ALCHEMY: 'ปรุงโอสถ', FORGING: 'หลอมศาสตรา', ARRAY: 'ค่ายกล', TALISMAN: 'ยันต์', BEAST_TAMING: 'ฝึกอสูร', POISON: 'พิษ', MEDICINE: 'การแพทย์', SCRIPTURE: 'คัมภีร์',
    SWORD: 'กระบี่', BLADE: 'ดาบ', SPEAR: 'หอก', FIST_PALM: 'หมัดฝ่ามือ', MOVEMENT: 'วิชาตัวเบา', BODY_REFINING: 'หลอมกาย', SOUL_DIVINE: 'จิตวิญญาณ-เทวะ',
    FIRE: 'ธาตุไฟ', WATER_ICE: 'ธาตุน้ำ-น้ำแข็ง', LIGHTNING: 'ธาตุสายฟ้า', WIND: 'ธาตุลม', EARTH_METAL: 'ธาตุดิน-โลหะ', WOOD_LIFE: 'ธาตุไม้-ชีวิต', YIN_SHADOW: 'ธาตุหยิน-เงา', LIGHT_YANG: 'ธาตุแสง-หยาง'
  };
  const AFF_ALL = [].concat(C.affinityKeys.CRAFT, C.affinityKeys.MARTIAL, C.affinityKeys.ELEMENT);
  AFF_ALL.forEach(k => def('affinities', k, 'ถนัด' + AFF_TH[k], 'ความเข้ากันตามธรรมชาติกับ ' + AFF_TH[k] + ' (เรียนเร็ว ผลลัพธ์ดี)', 30, 18, 'aff'));

  // --- สิ่งที่ชอบ 24 ---
  const INTERESTS = [
    ['combat', 'การต่อสู้-ประลอง'], ['meditation', 'นั่งสมาธิบำเพ็ญ'], ['alchemy', 'ปรุงโอสถ'], ['forging', 'หลอมอาวุธ'],
    ['arrays', 'ค่ายกลและยันต์'], ['medicine', 'รักษาผู้คน'], ['scholarship', 'ศึกษาคัมภีร์'], ['herbs', 'ปลูกสมุนไพร-ทำสวน'],
    ['beasts', 'สัตว์อสูร'], ['labor', 'งานแรงและขุดแร่'], ['trade', 'ค้าขายต่อรอง'], ['leading', 'บริหารปกครอง'],
    ['teaching', 'สอนศิษย์'], ['socializing', 'สังสรรค์'], ['exploring', 'ผจญภัยท่องยุทธภพ'], ['arts', 'ดนตรี-กวี-ศิลป์'],
    ['cuisine', 'อาหาร ชา สุรา'], ['gambling', 'เสี่ยงโชค'], ['collecting', 'สะสมของล้ำค่า'], ['intrigue', 'เล่ห์เหลี่ยม-ข่าวลือ'],
    ['solitude', 'สันโดษ-พักผ่อน'], ['worship', 'ศรัทธา-พิธีกรรม'], ['building', 'ก่อสร้าง-ตกแต่ง'], ['romance', 'ความรัก']
  ];
  INTERESTS.forEach(a => def('interests', a[0], a[1], 'ความสุขที่ได้จาก' + a[1] + ' (ไม่เกี่ยวกับว่าเก่งหรือไม่)', 50, 18, 'int'));

  // --- ทักษะที่ฝึกมา 26 ---
  const LIFE_SKILLS = [
    ['herbalism', 'สมุนไพร-เพาะปลูก'], ['mining', 'ขุดแร่-งานช่าง'], ['cooking', 'ปรุงอาหาร-ชา'], ['trading', 'ค้าขาย'], ['administration', 'บริหารจัดการ'],
    ['diplomacy', 'ทูต-เจรจา'], ['stealth', 'ลอบเร้น'], ['survival', 'เอาตัวรอดป่าเขา'], ['arts', 'ดนตรี-ศิลป์'], ['construction', 'ก่อสร้าง'], ['ritual', 'พิธีกรรม-ศรัทธา']
  ];
  AFF_ALL.slice(0, 15).forEach(k => def('skills', k, 'ฝีมือ' + AFF_TH[k], 'ระดับที่ฝึกฝนจริง (0-100) ของ ' + AFF_TH[k], 15, 15, 'skill'));
  LIFE_SKILLS.forEach(a => def('skills', a[0], 'ฝีมือ' + a[1], 'ระดับที่ฝึกฝนจริงด้าน' + a[1], 15, 15, 'skill'));

  HC.STAT_DEFS = D;
  HC.DEF = {}; D.forEach(d => HC.DEF[d.path] = d);
  HC.LAYER_TH = { physiology: 'กายภาพ', intellect: 'สติปัญญา', social: 'ทักษะสังคม', temperament: 'อารมณ์พื้นฐาน', personality: 'บุคลิก 14', values: 'คุณค่าชีวิต 8', aptitudes: 'พรสวรรค์ 6', affinities: 'ความถนัด', interests: 'สิ่งที่ชอบ', skills: 'ทักษะที่ฝึก' };
  HC.LAYERS = Object.keys(HC.LAYER_TH);
  HC.layerIds = layer => D.filter(d => d.layer === layer).map(d => d.id);
  HC.AFF_TH = AFF_TH; HC.AFF_ALL = AFF_ALL; HC.INTERESTS = INTERESTS; HC.LIFE_SKILLS = LIFE_SKILLS;
  HC.SKILL_IDS = HC.layerIds('skills');
  HC.nameOf = path => (HC.DEF[path] || {}).nameTh || path;

  /* ลายนิ้วมือของสเปก — ถ้ามีใครเพิ่ม/ลบมิติ ค่านี้จะเปลี่ยน และ test จะล้ม */
  HC.FINGERPRINT = (function () {
    const s = D.map(d => d.path).sort().join('|');
    return D.length + ':' + U.hashStr(s).toString(16);
  })();

  /* ป้ายระดับ 0-100 (เหมือนกันทุกมิติ) */
  HC.LEVELS = [[96, 'เหนือมนุษย์'], [86, 'เลิศล้ำ'], [71, 'สูง'], [56, 'ดี'], [45, 'เฉลี่ย'], [30, 'ต่ำกว่าเฉลี่ย'], [15, 'ต่ำ'], [0, 'ต่ำมาก']];
  HC.levelLabel = v => { for (const [t, n] of HC.LEVELS) if (v >= t) return n; return 'ต่ำมาก'; };
  /* เปอร์เซ็นไทล์โดยประมาณ จาก z (ประชากรปกติ) */
  HC.percentile = z => { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989423 * Math.exp(-z * z / 2); let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return Math.round((z > 0 ? 1 - p : p) * 100); };

  /* -------------------------------------------------------------------------
   * 2) Modifier engine — ทุกระบบอื่นปรับตัวตนผ่านที่นี่เท่านั้น
   * ------------------------------------------------------------------------- */
  const TRAIT_BY_ID = {};
  Object.values(C.curatedTraits).forEach(t => TRAIT_BY_ID[t.id] = t);
  C.extraTraits.forEach(t => TRAIT_BY_ID[t.id] = t);
  const PROC_PREFIX_EFFECT = {
    BODY_BLOOD: [['physiology.endurance', 1.2], ['physiology.toughness', 0.8]],
    MERIDIAN_ROOT: [['physiology.meridianCapacity', 1.6], ['physiology.meridianIntegrity', 0.8]],
    MIND_SENSE: [['physiology.senseAcuity', 1.6], ['intellect.perceptiveness', 0.8]],
    CRAFT_HAND: [['aptitudes.crafting', 1.4], ['physiology.dexterity', 1.2]],
    MIND_CURSE: [['personality.composure', -2.0], ['intellect.willpower', -1.0]],
    GENERAL: []
  };
  const PROC_BY_ID = {}; C.procTraits.forEach(t => PROC_BY_ID[t.id] = t);
  function procModifiers(t) {
    const el = C.elementList20[t.elementIndex] || C.elementList20[0];
    const grp = C.prefixGroups18[t.prefixIndex] || 'GENERAL';
    const tier = t.tier, sgn = t.isCurse ? -1 : 1, mods = [];
    mods.push({ stat: 'affinities.' + el.affinity, op: 'ADD', value: 4 * tier * sgn });
    if (el.secondAffinity) mods.push({ stat: 'affinities.' + el.secondAffinity, op: 'ADD', value: 2 * tier * sgn });
    if (el.stat) mods.push({ stat: el.stat, op: 'ADD', value: 1.5 * tier * sgn });
    (PROC_PREFIX_EFFECT[grp] || []).forEach(([s, m]) => mods.push({ stat: s, op: 'ADD', value: m * tier * (m < 0 ? 1 : sgn) }));
    return mods;
  }
  HC.traitDef = id => TRAIT_BY_ID[id] || PROC_BY_ID[id] || null;
  HC.traitMods = (id, lv) => {
    const t = TRAIT_BY_ID[id];
    const raw = t ? t.modifiers : (PROC_BY_ID[id] ? procModifiers(PROC_BY_ID[id]) : []);
    const k = 1 + 0.35 * ((lv || 1) - 1);
    return raw.map(m => m.op === 'ADD' ? { stat: m.stat, op: 'ADD', value: m.value * k, group: m.stackGroup } : { stat: m.stat, op: 'MULT', value: 1 + (m.value - 1) * k, group: m.stackGroup });
  };
  const CONST_BY_ID = {}; C.constitutions.forEach(c => CONST_BY_ID[c.id] = c);
  const ROOT_BY_ID = {}; C.rootGrades.forEach(r => ROOT_BY_ID[r.id] = r);
  HC.CONST_BY_ID = CONST_BY_ID; HC.ROOT_BY_ID = ROOT_BY_ID;

  function normPath(p) { // old-core paths → layer paths ที่เรามี
    return p;
  }
  function collectMods(npc) {
    const h = npc.h, adds = {}, mults = {};
    const push = (m, src) => {
      const p = normPath(m.stat);
      if (m.op === 'ADD') adds[p] = (adds[p] || 0) + m.value;
      else (mults[p] = mults[p] || []).push({ v: m.value, grp: m.group || m.stackGroup || ('_' + (src || 'x')) });
    };
    const c = CONST_BY_ID[h.constitution];
    if (c) c.modifiers.forEach(m => push(m, 'const'));
    (h.traits || []).forEach(t => HC.traitMods(t.id, t.lv).forEach(m => push(m, t.id)));
    (npc.mods || []).forEach(m => { if (!m.until || m.until > (HC.nowDay || 0)) push(m, m.src); });
    return { adds, mults };
  }
  function combineMult(list) {
    if (!list || !list.length) return 1;
    const byG = {};
    list.forEach(x => (byG[x.grp] = byG[x.grp] || []).push(x.v - 1));
    let prod = 1;
    Object.keys(byG).forEach(gk => {
      const arr = byG[gk].sort((a, b) => Math.abs(b) - Math.abs(a));
      let tot = 0, w = 1;
      arr.forEach(b => { tot += b * w; w *= 0.5; });
      prod *= (1 + tot);
    });
    return prod;
  }

  /* --- ผลของอายุต่อสมรรถนะ (bioAge = อายุชีวภาพ; ผู้ฝึกตนแก่ช้าลงตามอายุขัย) --- */
  HC.mortalLifespan = npc => 62 + (npc.h.physiology.vitality) * 0.35 + (npc.h.physiology.immunity) * 0.1;
  HC.ageYears = (npc, day) => Math.max(0, ((day == null ? HC.nowDay : day) - npc.h.birthDay) / 360);
  HC.bioAge = npc => {
    const a = HC.ageYears(npc);
    const ls = Math.max(80, npc.lifespanMax || 80);
    return a * 80 / ls;
  };
  const AGE_CURVES = {
    P: b => b < 10 ? 0.35 : b < 18 ? 0.35 + 0.65 * (b - 10) / 8 : b <= 30 ? 1 : b <= 50 ? 1 - 0.0065 * (b - 30) : b <= 70 ? 0.87 - 0.013 * (b - 50) : Math.max(0.3, 0.61 - 0.02 * (b - 70)),
    R: b => b < 10 ? 0.5 : b < 18 ? 0.5 + 0.5 * (b - 10) / 8 : b <= 35 ? 1 : b <= 55 ? 1 - 0.006 * (b - 35) : Math.max(0.35, 0.88 - 0.012 * (b - 55)),
    S: b => b < 12 ? 0.8 : b <= 45 ? 1 : b <= 70 ? 1 - 0.008 * (b - 45) : Math.max(0.5, 0.8 - 0.01 * (b - 70)),
    M: b => 1,
    F: b => b < 8 ? 0.4 : b < 20 ? 0.4 + 0.6 * (b - 8) / 12 : b <= 32 ? 1 : b <= 60 ? 1 - 0.006 * (b - 32) : Math.max(0.5, 0.83 - 0.012 * (b - 60)),
    C: b => b < 8 ? 0.35 : b < 22 ? 0.35 + 0.65 * (b - 8) / 14 : b <= 65 ? 1 : Math.max(0.7, 1 - 0.01 * (b - 65))
  };
  HC.ageFactor = (kind, bio) => (AGE_CURVES[kind] ? AGE_CURVES[kind](bio) : 1);

  /* --- ค่าประสิทธิผล: raw + modifiers × อายุ → clamp --- */
  HC.touch = npc => { npc._c = null; npc._d = null; };
  HC.raw = (npc, path) => { const i = path.indexOf('.'); return npc.h[path.slice(0, i)][path.slice(i + 1)]; };
  HC.eff = (npc, path) => {
    let c = npc._c;
    if (!c || c.day !== HC.nowDay || c.ver !== npc._ver) { const m = collectMods(npc); c = npc._c = { day: HC.nowDay, ver: npc._ver, mods: m, v: {}, bio: HC.bioAge(npc) }; }
    let v = c.v[path];
    if (v !== undefined) return v;
    const i = path.indexOf('.'), layer = path.slice(0, i), id = path.slice(i + 1);
    let r = npc.h[layer] ? npc.h[layer][id] : undefined;
    if (r == null) { // อาจเป็นช่องพิเศษ
      r = 0;
    }
    r = (r + (c.mods.adds[path] || 0)) * combineMult(c.mods.mults[path]);
    const d = HC.DEF[path];
    if (d && (layer === 'physiology' || layer === 'intellect') && d.kind) {
      r *= HC.ageFactor(d.kind, c.bio);
      if (path === 'intellect.wisdom') r += clamp((c.bio - 20) * 0.45, 0, 22);
    }
    v = clamp(r, 0, 100);
    c.v[path] = v;
    return v;
  };
  /* ช่องพิเศษ: combat.powerMult, cultivation.breakthroughBonus, craft.successBonus, craft.inventionBonus */
  HC.special = (npc, path) => {
    if (!npc._c || npc._c.day !== HC.nowDay || npc._c.ver !== npc._ver) HC.eff(npc, 'personality.discipline');
    const m = npc._c.mods;
    if (/powerMult$/.test(path)) return combineMult(m.mults[path]) * (1 + (m.adds[path] || 0));
    return (m.adds[path] || 0);
  };
  /* ทางลัด: ค่าที่ 0..1 */
  HC.n = (npc, path) => HC.eff(npc, path) / 100;

  /* อนุพันธ์ที่ไม่เก็บซ้ำ (คำนวณจากแกนหลัก) */
  HC.derived = npc => {
    if (npc._d && npc._d.day === HC.nowDay && npc._d.ver === npc._ver) return npc._d;
    const e = p => HC.eff(npc, p);
    const P = {}, V = {};
    C.personality14.forEach(a => P[a.id] = e('personality.' + a.id));
    C.values8.forEach(a => V[a.id] = e('values.' + a.id));
    const d = {
      day: HC.nowDay, ver: npc._ver,
      riskTolerance: clamp(100 - P.caution * 0.75 + (P.courage - 50) * 0.35 + (P.ambition - 50) * 0.15 + (e('temperament.sensationSeeking') - 50) * 0.2, 0, 100),
      powerSeeking: clamp(P.ambition * 0.55 + V.powerStatus * 0.35 + (P.pride - 50) * 0.2, 0, 100),
      materialism: clamp(V.wealthResource * 0.65 + (100 - P.empathy) * 0.2 + (100 - P.integrity) * 0.15, 0, 100),
      independence: clamp(V.freedom * 0.6 + P.pride * 0.25 + (100 - P.discipline) * 0.15, 0, 100),
      adaptability: clamp(P.creativity * 0.4 + P.curiosity * 0.3 + P.composure * 0.3 - (P.pride - 50) * 0.15, 0, 100),
      patience: clamp(P.composure * 0.45 + P.discipline * 0.35 + P.caution * 0.2 - (P.aggression - 50) * 0.2, 0, 100),
      vengefulness: clamp(P.pride * 0.4 + P.aggression * 0.35 + (100 - P.empathy) * 0.25, 0, 100),
      hpMax: Math.round(70 + e('physiology.vitality') * 1.1 + e('physiology.toughness') * 0.5 + e('physiology.strength') * 0.2),
      walkSpeed: 0.75 + (e('physiology.speed') * 0.7 + e('physiology.agility') * 0.3) / 100 * 0.9, // ช่อง/นาทีเกม
      carry: 20 + e('physiology.strength') * 0.8,
      physicalIndex: (e('physiology.strength') + e('physiology.speed') + e('physiology.agility') + e('physiology.endurance') + e('physiology.toughness') + e('physiology.reflex')) / 6,
      intelligenceIndex: (e('intellect.reasoning') * 1.2 + e('intellect.comprehension') * 1.2 + e('intellect.memory') + e('intellect.learningSpeed') * 1.1 + e('intellect.planning') + e('intellect.judgement') + e('intellect.workingMemory') * 0.8 + e('intellect.thinkingSpeed') * 0.7) / 8,
      socialIndex: (e('social.charisma') + e('social.persuasion') + e('social.leadership') + e('intellect.readPeople') + e('social.hospitality') * 0.6) / 4.6,
      cultivationTalent: 0
    };
    const root = ROOT_BY_ID[npc.h.root.grade] || ROOT_BY_ID.MORTAL;
    d.cultivationTalent = clamp((e('aptitudes.cultivation') * 0.45 + e('intellect.comprehension') * 0.15 + e('physiology.meridianCapacity') * 0.15 + e('physiology.spiritualFoundation') * 0.15 + e('physiology.meridianIntegrity') * 0.1) * (0.78 + root.tier * 0.1), 0, 130);
    npc._d = d; return d;
  };

  /* -------------------------------------------------------------------------
   * 3) ชื่อและรูปลักษณ์
   * ------------------------------------------------------------------------- */
  const FAMILY = ['หลิน', 'เฉิน', 'จาง', 'หวัง', 'หลี่', 'เจี่ย', 'ซุน', 'เซียว', 'ฉู่', 'สือ', 'หยาง', 'หลัว', 'ถัง', 'เสิ่น', 'ฟู่', 'เว่ย', 'ไป๋', 'เมิ่ง', 'ตู้', 'ลู่', 'เหยียน', 'กวน', 'เกา', 'ซู', 'เฉียว', 'จู', 'ฉิน', 'อู๋', 'เซี่ย', 'โจว', 'เหลียง', 'ติง', 'ซือถู', 'โอวหยาง', 'ตงฟาง', 'ซ่างกวน', 'มู่หรง', 'อวี๋', 'หาน', 'ผิง'];
  const GIVEN_M = ['เฟิง', 'หยุน', 'เหวิน', 'จิ่น', 'หมิง', 'เจ๋อ', 'เหอ', 'ปิง', 'ตง', 'โม่', 'ไห่', 'หาน', 'เทียน', 'จวิน', 'อวี้', 'หลง', 'เฉิง', 'ซาน', 'ฮู่', 'เหลย', 'ชวน', 'หาว', 'เจี๋ย', 'ซวน', 'เยี่ยน', 'ชัว', 'ปั๋ว', 'คัง', 'เว่ย', 'อัน'];
  const GIVEN_F = ['หลาน', 'ซิน', 'เยว่', 'ชิง', 'ซวง', 'เหลียน', 'เหม่ย', 'เสวี่ย', 'ถิง', 'หรู', 'อวี้', 'ฉี', 'เหยา', 'หนิง', 'ลี่', 'ซู', 'จิง', 'หมิน', 'เวย', 'ฟาง', 'เซียง', 'หยิง', 'ซือ', 'อี๋', 'เจียว', 'เฟย', 'หวน', 'ฉาง', 'หลิง', 'เหมย'];
  const REGIONS = [
    ['ภูเขาสูง', 'ชาวเขา', 1.0], ['หมู่บ้านลุ่มน้ำ', 'ชาวนา', 1.4], ['เมืองการค้า', 'พ่อค้า', 1.2], ['เมืองหลวง', 'ขุนนาง', 0.6], ['ที่ราบกลาง', 'ชาวไร่', 1.2],
    ['ชายฝั่งทะเล', 'ชาวประมง', 0.8], ['ทะเลทรายตะวันตก', 'นักเดินทาง', 0.6], ['ป่าลึก', 'พรานป่า', 0.8], ['ตระกูลยุทธ์', 'ทายาทตระกูลยุทธ์', 0.5], ['อดีตสำนักอื่น', 'ศิษย์พเนจร', 0.7], ['กำพร้าเร่ร่อน', 'เด็กกำพร้า', 0.7], ['วงศ์แพทย์', 'ลูกหมอยา', 0.6]
  ];
  HC.REGIONS = REGIONS;
  const HAIR = [['ดำสนิท', '#1a1a22', 60], ['ดำน้ำตาล', '#3a2a22', 24], ['น้ำตาลเข้ม', '#5a3a26', 9], ['เทาเงิน', '#a9b0bd', 2], ['ขาวหิมะ', '#e9edf5', 1], ['แดงเพลิง', '#8e2f22', 1.2], ['น้ำเงินครามเข้ม', '#1f2f5f', 1.2], ['ม่วงอมดำ', '#3b2250', 1.4]];
  const EYES = [['ดำ', '#14141a', 62], ['น้ำตาลเข้ม', '#4a2f1d', 28], ['น้ำตาลทอง', '#8c5a26', 5], ['เขียวหยก', '#2f8f6a', 1.8], ['ฟ้าคราม', '#3a6ea5', 1.5], ['ทองอำพัน', '#c89a2a', 1.7]];
  const HAIRSTYLE = ['มัดจุกสูง', 'ปล่อยยาว', 'เปียยาว', 'มัดหางม้า', 'ทรงสั้น', 'ผมปิดหน้าผาก', 'มวยสองข้าง', 'ผมครึ่งมัด'];
  const SKIN = [['ขาวเนียน', '#f3d7bd'], ['ขาวอมชมพู', '#efc9a8'], ['ผิวสองสี', '#d9a97c'], ['แทนแดดเกรียม', '#bd8556'], ['ผิวเข้ม', '#8d5c3a']];
  HC.HAIR = HAIR; HC.EYES = EYES; HC.SKIN = SKIN;
  const TASTE = {
    food: ['เกี๊ยวนึ่ง', 'ก๋วยเตี๋ยวเนื้อ', 'โจ๊กหมู', 'ผักป่าต้ม', 'ปลานึ่งขิง', 'เป็ดย่าง', 'ขนมถั่ว', 'บะหมี่เย็น', 'ซุปโสม', 'หมั่นโถวไส้งา'],
    drink: ['ชาเขียวภูเขา', 'ชาดอกเก๊กฮวย', 'สุราข้าวหมัก', 'น้ำผึ้งอุ่น', 'ชาดำเข้ม', 'น้ำพุเย็น', 'สุราดอกท้อ'],
    color: ['ครามเข้ม', 'แดงชาด', 'เขียวหยก', 'ขาวนวล', 'ดำสนิท', 'ทองอ่อน', 'ม่วงลาเวนเดอร์', 'เทาเงิน'],
    weather: ['ฝนพรำ', 'หิมะแรก', 'ฟ้าโปร่ง', 'หมอกยามเช้า', 'ลมหนาว', 'พระจันทร์เต็มดวง'],
    pastime: ['ฟังเสียงน้ำตก', 'ชมดอกไม้', 'ดูดาว', 'ฝึกเขียนพู่กัน', 'เล่นหมากรุก', 'เดินเล่นยามเย็น', 'ฟังนิทานยุทธภพ', 'เก็บก้อนหิน']
  };
  HC.TASTE = TASTE;

  /* -------------------------------------------------------------------------
   * 4) การสร้างมนุษย์ (genome → phenotype)
   * ------------------------------------------------------------------------- */
  const ARCH_BY_ID = {}; C.archetypes.forEach(a => ARCH_BY_ID[a.id] = a);
  HC.ARCH_BY_ID = ARCH_BY_ID;
  // ปัจจัยแฝง g=ปัญญา p=ร่างกาย s=สังคม e=ความมั่นคงทางอารมณ์
  const LOAD = {
    'intellect.reasoning': ['g', .78], 'intellect.comprehension': ['g', .72], 'intellect.memory': ['g', .5], 'intellect.workingMemory': ['g', .62], 'intellect.learningSpeed': ['g', .68],
    'intellect.thinkingSpeed': ['g', .55], 'intellect.focus': ['g', .3], 'intellect.spatial': ['g', .5], 'intellect.numeracy': ['g', .62], 'intellect.verbal': ['g', .58], 'intellect.planning': ['g', .6],
    'intellect.judgement': ['g', .5], 'intellect.inventiveness': ['g', .4], 'intellect.intuition': ['g', .25], 'intellect.perceptiveness': ['g', .35], 'intellect.readPeople': ['s', .35], 'intellect.willpower': ['e', .4],
    'physiology.strength': ['p', .62], 'physiology.explosiveness': ['p', .6], 'physiology.speed': ['p', .58], 'physiology.agility': ['p', .55], 'physiology.reflex': ['p', .45], 'physiology.dexterity': ['p', .3],
    'physiology.balance': ['p', .5], 'physiology.flexibility': ['p', .35], 'physiology.endurance': ['p', .62], 'physiology.toughness': ['p', .55], 'physiology.painTolerance': ['e', .3], 'physiology.recoveryRate': ['p', .5],
    'physiology.vitality': ['p', .65], 'physiology.immunity': ['p', .4], 'physiology.thermalTolerance': ['p', .3], 'physiology.vision': ['p', .15], 'physiology.hearing': ['p', .15], 'physiology.smellTaste': ['p', .1],
    'social.charisma': ['s', .55], 'social.persuasion': ['s', .5], 'social.deception': ['s', .25], 'social.leadership': ['s', .4], 'social.teaching': ['s', .3], 'social.intimidation': ['p', .25], 'social.hospitality': ['s', .45],
    'temperament.sociability': ['s', .7], 'temperament.energyLevel': ['p', .4], 'temperament.emotionalReactivity': ['e', -.6], 'temperament.optimism': ['e', .45], 'temperament.humor': ['s', .35], 'temperament.sensationSeeking': ['p', .2], 'temperament.affection': ['s', .3]
  };
  const SEX_SHIFT = { M: { 'physiology.strength': 7, 'physiology.explosiveness': 6, 'physiology.toughness': 4, 'social.intimidation': 4, 'physiology.endurance': 2, 'physiology.immunity': -1 }, F: { 'physiology.flexibility': 8, 'physiology.immunity': 3, 'physiology.painTolerance': 5, 'physiology.dexterity': 3, 'physiology.hearing': 2, 'physiology.smellTaste': 3, 'physiology.recoveryRate': 2, 'intellect.verbal': 2, 'intellect.readPeople': 3, 'physiology.strength': -3 } };
  // ความชอบ = ผลรวมถ่วงน้ำหนักจากความถนัด/บุคลิก/คุณค่า/อารมณ์ + ความแปรปรวนส่วนตัว (คนเราชอบสิ่งที่ไม่ถนัดได้)
  const INTEREST_SRC = {
    combat: [['personality.aggression', .3], ['personality.courage', .25], ['values.martialPeak', .25], ['aptitudes.combat', .2]],
    meditation: [['personality.composure', .3], ['personality.discipline', .3], ['values.martialPeak', .2], ['temperament.sociability', -.2]],
    alchemy: [['affinities.ALCHEMY', .4], ['personality.curiosity', .2], ['values.knowledgeCraft', .2], ['physiology.dexterity', .2]],
    forging: [['affinities.FORGING', .4], ['physiology.strength', .2], ['values.knowledgeCraft', .2], ['personality.discipline', .2]],
    arrays: [['affinities.ARRAY', .25], ['affinities.TALISMAN', .2], ['intellect.spatial', .3], ['personality.rationality', .25]],
    medicine: [['affinities.MEDICINE', .4], ['personality.empathy', .35], ['values.knowledgeCraft', .25]],
    scholarship: [['affinities.SCRIPTURE', .3], ['personality.curiosity', .35], ['values.knowledgeCraft', .35]],
    herbs: [['affinities.WOOD_LIFE', .3], ['personality.composure', .25], ['personality.empathy', .15], ['temperament.sociability', -.15], ['values.freedom', .15]],
    beasts: [['affinities.BEAST_TAMING', .45], ['personality.empathy', .2], ['personality.courage', .2], ['temperament.sensationSeeking', .15]],
    labor: [['physiology.strength', .3], ['physiology.endurance', .3], ['personality.discipline', .25], ['values.wealthResource', .15]],
    trade: [['aptitudes.socialCommerce', .4], ['values.wealthResource', .3], ['intellect.numeracy', .2], ['personality.rationality', .1]],
    leading: [['values.powerStatus', .35], ['social.leadership', .25], ['personality.ambition', .25], ['aptitudes.command', .15]],
    teaching: [['social.teaching', .3], ['personality.empathy', .25], ['values.honorLegacy', .25], ['values.sectDuty', .2]],
    socializing: [['temperament.sociability', .5], ['temperament.humor', .2], ['personality.trustfulness', .15], ['values.familyClan', .15]],
    exploring: [['personality.curiosity', .3], ['temperament.sensationSeeking', .3], ['values.freedom', .3], ['personality.courage', .1]],
    arts: [['personality.creativity', .35], ['temperament.emotionalReactivity', .2], ['intellect.inventiveness', .2], ['temperament.affection', .15], ['physiology.dexterity', .1]],
    cuisine: [['physiology.smellTaste', .35], ['temperament.sociability', .2], ['temperament.affection', .2], ['values.familyClan', .1], ['personality.creativity', .15]],
    gambling: [['temperament.sensationSeeking', .4], ['personality.caution', -.3], ['destiny.luck', .15], ['values.wealthResource', .15]],
    collecting: [['values.wealthResource', .35], ['personality.curiosity', .2], ['personality.caution', .15], ['values.honorLegacy', .15], ['personality.pride', .15]],
    intrigue: [['social.deception', .3], ['personality.ambition', .2], ['intellect.readPeople', .25], ['personality.integrity', -.25]],
    solitude: [['temperament.sociability', -.55], ['values.freedom', .2], ['personality.composure', .15], ['personality.curiosity', .1]],
    worship: [['affinities.SOUL_DIVINE', .35], ['values.honorLegacy', .2], ['values.sectDuty', .2], ['personality.loyalty', .25]],
    building: [['physiology.dexterity', .2], ['intellect.spatial', .3], ['personality.creativity', .2], ['personality.discipline', .15], ['values.sectDuty', .15]],
    romance: [['temperament.affection', .5], ['personality.empathy', .15], ['temperament.emotionalReactivity', .15], ['values.familyClan', .2]]
  };
  HC.INTEREST_SRC = INTEREST_SRC;

  function srcVal(h, path) {
    if (path === 'destiny.luck') return h.destiny.luck;
    const i = path.indexOf('.'); return h[path.slice(0, i)][path.slice(i + 1)];
  }
  function pickWeightedTable(rng, tbl) { return rng.weighted(tbl, t => t[t.length - 1] === undefined ? 1 : (typeof t[2] === 'number' ? t[2] : 1)); }

  HC.NAME_FAMILY = FAMILY;
  function makeName(rng, sex) {
    return { family: rng.pick(FAMILY), given: sex === 'F' ? rng.pick(GIVEN_F) + (rng.chance(.55) ? rng.pick(GIVEN_F) : '') : rng.pick(GIVEN_M) + (rng.chance(.5) ? rng.pick(GIVEN_M) : '') };
  }
  HC.fullName = npc => npc.h.name.family + npc.h.name.given;

  /**
   * สร้างมนุษย์ 1 คน
   * opts: {sex, ageYears, archetype, quality(−1..+2 ยิ่งสูงยิ่งมีพรสวรรค์), day, rootGrade, traitCount, skillExp(0..1 ประสบการณ์ฝึก)}
   * return npc-skeleton { id, h, mods:[] }
   */
  HC.generate = (rng, opts) => {
    opts = opts || {};
    const day = opts.day != null ? opts.day : (HC.nowDay || 0);
    const sex = opts.sex || (rng.chance(.5) ? 'M' : 'F');
    const age = opts.ageYears != null ? opts.ageYears : clamp(rng.gauss(22, 6), 13, 60);
    const q = opts.quality || 0;
    const arch = opts.archetype ? ARCH_BY_ID[opts.archetype] : rng.pick(C.archetypes);
    const lat = { g: rng.gauss(q * 0.35, 1), p: rng.gauss(0, 1), s: rng.gauss(0, 1), e: rng.gauss(0, 1) };
    const h = { v: 1, name: makeName(rng, sex), sex, birthDay: Math.round(day - age * 360 - rng.int(0, 359)), archetype: arch.id, genome: rng.int(1, 2147483647) };
    const reg = rng.weighted(REGIONS, r => r[2]);
    h.origin = { region: reg[0], cls: reg[1] };
    if (arch.id === 'CLAN_NOBLE_SCION' && rng.chance(.7)) h.origin = { region: 'ตระกูลยุทธ์', cls: 'ทายาทตระกูลยุทธ์' };
    // ---- ปัจจัยแฝง → ค่ากำเนิด (innate) ----
    h.innate = {}; h.physiology = {}; h.intellect = {}; h.social = {}; h.temperament = {};
    const sexSh = SEX_SHIFT[sex] || {};
    const layers = ['physiology', 'intellect', 'social', 'temperament'];
    layers.forEach(L => HC.layerIds(L).forEach(id => {
      const path = L + '.' + id, ld = LOAD[path] || ['g', 0];
      const lf = ld[0], lw = ld[1];
      const z = lw * lat[lf] + Math.sqrt(1 - lw * lw) * rng.gauss(0, 1);
      let v = 50 + 14.5 * z + (sexSh[path] || 0);
      if (L === 'intellect' && id === 'wisdom') v = 30 + rng.gauss(0, 8) + lat.e * 3;
      h.innate[path] = clamp(Math.round(v * 10) / 10, 3, 99);
    }));
    // ---- รากวิญญาณ & กายา ----
    const rg = opts.rootGrade ? ROOT_BY_ID[opts.rootGrade] : rng.weighted(C.rootGrades, r => r.weight * (r.tier >= 4 ? (1 + q * 0.5) : 1) * (r.tier <= 2 ? Math.max(.3, 1 - q * 0.2) : 1));
    const ELS = ['ไฟ', 'น้ำ', 'ไม้', 'ทอง', 'ดิน'];
    const elCount = [5, 4, 2, 1, 1][rg.tier - 1] || 3;
    h.root = { grade: rg.id, elements: rng.shuffle(ELS.slice()).slice(0, elCount) };
    h.constitution = rng.weighted(C.constitutions, c => c.rarityWeight * (c.tier >= 5 ? (1 + q * .6) : 1)).id;
    // ปราณ-จิตวิญญาณขึ้นกับราก
    ['spiritualFoundation', 'meridianCapacity', 'meridianIntegrity'].forEach(id => {
      const path = 'physiology.' + id;
      h.innate[path] = clamp(34 + rg.tier * 6 + rng.gauss(0, 11), 5, 98);
    });
    // ---- พัฒนาการ: ค่าปัจจุบัน = ค่ากำเนิด หักตามที่ยังไม่ได้ฝึก ----
    const train = clamp(opts.trainedness != null ? opts.trainedness : 0.55 + (age >= 14 ? Math.min(0.3, (age - 14) * 0.02) : 0), 0.3, 1);
    HC.layerIds('physiology').forEach(id => {
      const path = 'physiology.' + id, inn = h.innate[path];
      const phys = ['strength', 'explosiveness', 'speed', 'agility', 'reflex', 'balance', 'endurance', 'toughness', 'flexibility', 'dexterity'].includes(id);
      h.physiology[id] = phys ? clamp(inn * (0.78 + 0.22 * train) + rng.gauss(0, 2), 3, 99) : inn;
    });
    HC.layerIds('intellect').forEach(id => { h.intellect[id] = h.innate['intellect.' + id]; });
    HC.layerIds('social').forEach(id => { h.social[id] = h.innate['social.' + id]; });
    HC.layerIds('temperament').forEach(id => { h.temperament[id] = h.innate['temperament.' + id]; });
    // ---- บุคลิก / คุณค่า / พรสวรรค์ (ตามต้นแบบ) ----
    h.personality = {}; h.values = {}; h.aptitudes = {};
    const biasVal = (range, def) => range ? rng.float(range[0], range[1]) : clamp(rng.gauss(def, 17), 4, 97);
    C.personality14.forEach(a => {
      let v = biasVal(arch.personalityBias[a.id], a.def);
      v += lat.e * (a.id === 'composure' ? 6 : 0) + (a.id === 'rationality' || a.id === 'curiosity' ? lat.g * 4 : 0);
      h.personality[a.id] = clamp(Math.round(v * 10) / 10, 2, 99);
    });
    C.values8.forEach(a => h.values[a.id] = clamp(Math.round(biasVal(arch.valueBias[a.id], a.def) * 10) / 10, 2, 99));
    C.aptitudes6.forEach(a => {
      let v = arch.aptitudeBias[a.id] ? rng.float(arch.aptitudeBias[a.id][0], arch.aptitudeBias[a.id][1]) : rng.gauss(a.def, 14);
      v += lat.g * 4 + q * 3 + (a.id === 'cultivation' ? (rg.tier - 2.5) * 5 : 0);
      h.aptitudes[a.id] = clamp(Math.round(v * 10) / 10, 3, 99);
    });
    // ---- ความถนัด 23 ----
    h.affinities = {};
    AFF_ALL.forEach(k => {
      let v = rng.gauss(26, 14);
      if (arch.preferredAffinities.includes(k)) v += rng.float(22, 40);
      if (rng.chance(.07)) v += rng.float(15, 30); // พรสวรรค์แปลก ๆ
      h.affinities[k] = clamp(Math.round(v * 10) / 10, 0, 98);
    });
    // ---- โชค กรรม ----
    h.destiny = { luck: clamp(rng.chance(.03) ? rng.float(82, 98) : rng.gauss(50, 17), 3, 99), karma: Math.round(rng.gauss(0, 8)) };
    // ---- ความชอบ (ผลรวมถ่วงน้ำหนัก + ความแปรปรวนส่วนตัว) ----
    h.interests = {};
    // ต้องมีค่าฐานก่อนคำนวณ: ใช้ innate ของ physiology ฯลฯ ผ่านโครงสร้างชั่วคราว
    INTERESTS.forEach(([id]) => {
      const src = INTEREST_SRC[id]; let sum = 0, wsum = 0;
      src.forEach(([p, w]) => {
        let v = srcVal(h, p); if (p.startsWith('affinities.')) v = 30 + (v - 30) * 0.9 + 15; // ให้ความถนัดสูงดันความชอบได้ชัด
        if (w < 0) { sum += (100 - v) * -w; wsum += -w; } else { sum += v * w; wsum += w; }
      });
      const base = sum / wsum;
      h.interests[id] = clamp(Math.round((base * 0.75 + 12.5 + rng.gauss(0, 14)) * 10) / 10, 0, 99);
    });
    // ---- ทักษะที่ฝึกมาตามวัย/ต้นแบบ ----
    h.skills = {};
    const exp = opts.skillExp != null ? opts.skillExp : clamp((age - 12) / 30, 0.05, 1);
    HC.SKILL_IDS.forEach(id => {
      const aff = h.affinities[id] != null ? h.affinities[id] : 30;
      const intr = (INTEREST_SRC && h.interests[({ ALCHEMY: 'alchemy', FORGING: 'forging', ARRAY: 'arrays', TALISMAN: 'arrays', BEAST_TAMING: 'beasts', MEDICINE: 'medicine', SCRIPTURE: 'scholarship', SWORD: 'combat', BLADE: 'combat', SPEAR: 'combat', FIST_PALM: 'combat', MOVEMENT: 'exploring', BODY_REFINING: 'combat', SOUL_DIVINE: 'worship', POISON: 'alchemy', herbalism: 'herbs', mining: 'labor', cooking: 'cuisine', trading: 'trade', administration: 'leading', diplomacy: 'socializing', stealth: 'intrigue', survival: 'exploring', arts: 'arts', construction: 'building', ritual: 'worship' })[id]]) || 40;
      let v = (aff * 0.5 + intr * 0.5 - 25) * 0.55 * exp + rng.gauss(2, 4);
      if (arch.preferredAffinities.includes(id)) v += 10 * exp;
      h.skills[id] = clamp(Math.round(v * 10) / 10, 0, 85);
    });
    // ---- ร่างกายภายนอก ----
    const baseH = sex === 'M' ? 171 : 159;
    const heightCm = Math.round(clamp(baseH + rng.gauss(0, 6) + (age < 17 ? -(17 - age) * 2.2 : 0) + (h.physiology.strength - 50) * 0.04, 130, 205));
    const bmi = clamp(rng.gauss(21.4, 2.3) + (h.physiology.strength - 50) * 0.02 - (h.physiology.speed - 50) * 0.015, 15.5, 34);
    const frame = bmi < 19 ? 'ผอมบาง' : bmi < 22.5 ? 'สมส่วน' : bmi < 25.5 ? 'ล่ำสัน' : 'ใหญ่โต';
    const hairT = rng.weighted(HAIR, x => x[2]), eyeT = rng.weighted(EYES, x => x[2]), skinT = rng.pick(SKIN);
    h.body = {
      heightCm, weightKg: Math.round(bmi * (heightCm / 100) * (heightCm / 100)), frame, hand: rng.chance(.11) ? 'ซ้าย' : rng.chance(.02) ? 'สองมือ' : 'ขวา',
      hair: hairT[0], hairHex: hairT[1], hairStyle: rng.pick(HAIRSTYLE), eye: eyeT[0], eyeHex: eyeT[1], skin: skinT[0], skinHex: skinT[1],
      beauty: clamp(Math.round(rng.gauss(50, 17) + (lat.s * 3)), 3, 99), marks: []
    };
    // ---- ตัวตนที่เหลือ ----
    h.tastes = { food: rng.pick(TASTE.food), drink: rng.pick(TASTE.drink), color: rng.pick(TASTE.color), weather: rng.pick(TASTE.weather), pastime: rng.pick(TASTE.pastime) };
    h.attachment = HC.pickAttachment(h, rng);
    // trait
    h.traits = [];
    const nT = opts.traitCount != null ? opts.traitCount : (rng.chance(.55 + q * .1) ? (rng.chance(.3) ? 2 : 1) : 0);
    for (let i = 0; i < nT; i++) HC.addTrait({ h }, rng, null);
    // dynamic
    h.state = { hp: 100, qi: 0, energy: 90, satiety: 80, rest: 85, comfort: 60, social: 60, novelty: 60, stress: 15, mood: 10, fear: 0, anger: 0, loneliness: 10, confidence: 50, heartDemon: 0, pain: 0 };
    h.fulfil = {}; C.values8.forEach(a => h.fulfil[a.id] = rng.int(35, 70));
    h.mind = { memories: [], relations: {}, goals: [], grudges: [] };
    h.life = { bio: [], fame: 0, infamy: 0, titles: [], family: { parents: [], spouse: null, children: [], master: null, disciples: [], clan: h.name.family } };
    const npc = { id: opts.id || ('n' + rng.int(100000, 999999)), h, mods: [], ext: {}, _ver: 0 };
    h.state.hp = HC.derived(npc).hpMax;
    return npc;
  };

  HC.pickAttachment = (h, rng) => {
    const t = h.personality.trustfulness, e = h.personality.empathy, c = h.personality.composure;
    const secure = clamp((t + e + c) / 3 - 30, 5, 70);
    const r = rng.next() * (secure + 25 + 25 + 10);
    return r < secure ? 'มั่นคง' : r < secure + 25 ? 'วิตกกังวล' : r < secure + 50 ? 'หลีกเลี่ยง' : 'สับสน';
  };

  HC.addTrait = (npc, rng, id) => {
    const h = npc.h; h.traits = h.traits || [];
    let pool;
    if (id) pool = [HC.traitDef(id)].filter(Boolean);
    else {
      const cur = Object.values(C.curatedTraits).concat(C.extraTraits);
      const proc = C.procTraits.filter(t => t.tier <= 6);
      pool = cur.concat(proc);
    }
    for (let tries = 0; tries < 12; tries++) {
      const t = rng.weighted(pool, x => Math.pow(0.55, (x.tier || 3) - 1) * (x.isCurse ? 0.5 : 1));
      if (h.traits.some(x => x.id === t.id)) continue;
      if ((t.conflictsWith || []).some(cid => h.traits.some(x => x.id === cid))) continue;
      if (h.traits.some(x => { const d = HC.traitDef(x.id); return d && (d.conflictsWith || []).includes(t.id); })) continue;
      h.traits.push({ id: t.id, lv: 1 });
      npc._ver = (npc._ver || 0) + 1; npc._c = null; npc._d = null;
      return t;
    }
    return null;
  };

  /* -------------------------------------------------------------------------
   * 5) พัฒนาการของมนุษย์ (ฝึก/เรียน/ประสบการณ์เปลี่ยนนิสัย/ความรู้สึก)
   *    ฟังก์ชันเหล่านี้คือ "ทางเดียว" ที่ระบบอื่นใช้เปลี่ยนตัวตน
   * ------------------------------------------------------------------------- */
  const bump = npc => { npc._ver = (npc._ver || 0) + 1; npc._c = null; npc._d = null; };
  HC.bump = bump;

  /** ฝึกกาย: เพิ่มค่าปัจจุบันเข้าหาศักยภาพ (innate+เพดานฝึก 12) ยิ่งใกล้เพดานยิ่งช้า */
  HC.trainBody = (npc, id, load) => {
    const h = npc.h, path = 'physiology.' + id, cap = Math.min(99, h.innate[path] + 12);
    const cur = h.physiology[id]; if (cur >= cap) return 0;
    const ageK = HC.ageFactor('R', HC.bioAge(npc));
    const gain = load * (cap - cur) / cap * 0.02 * (0.5 + HC.eff(npc, 'physiology.recoveryRate') / 100) * (0.6 + 0.4 * ageK);
    h.physiology[id] = Math.min(cap, cur + gain); bump(npc); return gain;
  };
  /** ศึกษา: เพิ่มความสามารถทางสมอง (ช้ากว่ากายมาก) */
  HC.trainMind = (npc, id, load) => {
    const h = npc.h, cap = Math.min(98, h.innate['intellect.' + id] + 8), cur = h.intellect[id];
    if (cur >= cap) return 0;
    const gain = load * (cap - cur) / cap * 0.008 * (0.5 + HC.eff(npc, 'intellect.learningSpeed') / 100);
    h.intellect[id] = Math.min(cap, cur + gain); bump(npc); return gain;
  };
  /** ฝึกทักษะ: hours = ชั่วโมงเกมที่ฝึก, quality 0.5..1.5 (ครู ตำรา สถานที่) */
  HC.practice = (npc, skillId, hours, quality) => {
    const h = npc.h; if (h.skills[skillId] == null) return 0;
    const lv = h.skills[skillId];
    const aff = HC.eff(npc, 'affinities.' + skillId) || 30;
    const learn = HC.eff(npc, 'intellect.learningSpeed');
    const intrId = { ALCHEMY: 'alchemy', FORGING: 'forging', ARRAY: 'arrays', TALISMAN: 'arrays', BEAST_TAMING: 'beasts', MEDICINE: 'medicine', SCRIPTURE: 'scholarship', SWORD: 'combat', BLADE: 'combat', SPEAR: 'combat', FIST_PALM: 'combat', MOVEMENT: 'exploring', BODY_REFINING: 'combat', SOUL_DIVINE: 'worship', POISON: 'alchemy', herbalism: 'herbs', mining: 'labor', cooking: 'cuisine', trading: 'trade', administration: 'leading', diplomacy: 'socializing', stealth: 'intrigue', survival: 'exploring', arts: 'arts', construction: 'building', ritual: 'worship' }[skillId];
    const joy = intrId ? h.interests[intrId] : 50;
    const rate = (0.35 + aff / 100 * 0.9) * (0.6 + learn / 100 * 0.8) * (0.8 + joy / 250) * (quality || 1);
    const gain = hours * 0.075 * rate * Math.pow(Math.max(0.08, 1 - lv / 105), 1.6);
    h.skills[skillId] = Math.min(100, lv + gain);
    return gain;
  };
  /** อารมณ์: delta ของ state */
  HC.feel = (npc, d) => {
    const s = npc.h.state, react = 0.6 + HC.eff(npc, 'temperament.emotionalReactivity') / 100 * 0.8;
    const calm = 1.2 - HC.eff(npc, 'personality.composure') / 160;
    for (const k in d) {
      let dv = d[k];
      if (k === 'mood' || k === 'stress' || k === 'fear' || k === 'anger' || k === 'loneliness') dv *= react * (k === 'mood' ? 1 : calm);
      s[k] = k === 'mood' ? clamp(s[k] + dv, -100, 100) : clamp(s[k] + dv, 0, k === 'hp' ? 9999 : 100);
    }
  };
  /** ประสบการณ์ชีวิตเปลี่ยนนิสัยอย่างช้า ๆ (ไม่เกิน ±15 จากค่ากำเนิด ยกเว้นบาดแผลใหญ่ ±28) */
  const EXPERIENCE = {
    duel_win: { personality: { courage: .8, pride: .5, caution: -.2 }, mood: 8, trauma: 0 },
    duel_lose: { personality: { pride: -.4, caution: .4, discipline: .3 }, mood: -8 },
    humiliated: { personality: { pride: .6, trustfulness: -.5 }, mood: -14 },
    near_death: { personality: { caution: 1.4, composure: -.3, courage: .3 }, mood: -10, trauma: 1 },
    killed_foe: { personality: { empathy: -.9, composure: .4, aggression: .4 }, mood: -3 },
    saw_death: { personality: { empathy: .3, composure: -.3 }, mood: -10, trauma: .6 },
    betrayed: { personality: { trustfulness: -2.2, loyalty: -.8, caution: .6 }, mood: -22, trauma: 1.5 },
    helped: { personality: { trustfulness: .9, loyalty: .6, empathy: .3 }, mood: 10 },
    gave_help: { personality: { empathy: .5, integrity: .3 }, mood: 6 },
    promoted: { personality: { ambition: .5, pride: .4, loyalty: .8 }, mood: 16 },
    punished_fair: { personality: { discipline: .6, pride: -.4 }, mood: -10 },
    punished_unfair: { personality: { loyalty: -2, trustfulness: -1, pride: .3 }, mood: -20, trauma: .8 },
    insight: { personality: { composure: 1.4, curiosity: .5, ambition: -.2 }, mood: 20 },
    heart_demon: { personality: { composure: -2.2, aggression: .5 }, mood: -25, trauma: 1.5 },
    craft_success: { personality: { discipline: .3, curiosity: .2, creativity: .2 }, mood: 8 },
    study: { personality: { curiosity: .15, rationality: .1 }, mood: 2 },
    friendship: { personality: { trustfulness: .45, empathy: .2 }, mood: 8 },
    lost_loved: { personality: { composure: -1.2, empathy: .5, aggression: .2 }, mood: -35, trauma: 2 },
    fell_in_love: { personality: { empathy: .5, caution: -.2 }, mood: 25 },
    heartbreak: { personality: { trustfulness: -1, composure: -.6 }, mood: -28, trauma: 1.2 },
    adventure: { personality: { courage: .5, curiosity: .4, caution: -.1 }, mood: 12 },
    fortune: { personality: { ambition: .3 }, mood: 14 },
    long_peace: { personality: { composure: .25, aggression: -.15 }, mood: 2 },
    feast: { personality: { trustfulness: .2 }, mood: 6 }
  };
  HC.EXPERIENCE = EXPERIENCE;
  HC.experience = (npc, type, intensity) => {
    const ex = EXPERIENCE[type]; if (!ex) return;
    intensity = intensity == null ? 1 : intensity;
    const h = npc.h;
    const plastic = 1.15 - HC.eff(npc, 'personality.composure') / 200; // คนมั่นคงเปลี่ยนยากขึ้นเล็กน้อย
    const lim = (ex.trauma || 0) > 0.7 ? 28 : 15;
    for (const k in ex.personality) {
      const inn = (h.innate.__p && h.innate.__p[k] != null) ? h.innate.__p[k] : (h.innate.__p = h.innate.__p || {}, h.innate.__p[k] = h.personality[k]);
      const nv = h.personality[k] + ex.personality[k] * intensity * plastic;
      h.personality[k] = clamp(nv, Math.max(1, inn - lim), Math.min(99, inn + lim));
      if (HC.DEF['values.sectDuty'] && k === 'loyalty') { const vi = (h.innate.__v = h.innate.__v || {}); if (vi.sectDuty == null) vi.sectDuty = h.values.sectDuty; h.values.sectDuty = clamp(h.values.sectDuty + ex.personality[k] * intensity * 0.3, vi.sectDuty - 15, vi.sectDuty + 15); }
    }
    if (ex.mood) HC.feel(npc, { mood: ex.mood * intensity });
    if (ex.trauma) { h.state.heartDemon = clamp(h.state.heartDemon + ex.trauma * intensity * 2.5, 0, 100); }
    bump(npc);
  };
  /** ปัญญาจากชีวิต: เพิ่มช้า ๆ ตามเหตุการณ์ */
  HC.gainWisdom = (npc, amt) => { npc.h.intellect.wisdom = clamp(npc.h.intellect.wisdom + amt, 0, 80); bump(npc); };

  /* -------------------------------------------------------------------------
   * 6) ตัวตนที่อ่านได้: signature / identity / compare / appearance
   * ------------------------------------------------------------------------- */
  const FEATURE_LAYERS = ['physiology', 'intellect', 'social', 'temperament', 'personality', 'values', 'aptitudes', 'affinities', 'interests'];
  const LAYER_W = { physiology: .8, intellect: 1, social: .7, temperament: .7, personality: 1.3, values: 1.2, aptitudes: 1, affinities: .8, interests: 1 };
  HC.featureList = () => D.filter(d => FEATURE_LAYERS.includes(d.layer));
  HC.z = (npc, path) => { const d = HC.DEF[path]; return (HC.eff(npc, path) - d.mean) / d.sd; };
  HC.vector = npc => HC.featureList().map(d => ({ path: d.path, layer: d.layer, z: HC.z(npc, d.path), v: HC.eff(npc, d.path) }));

  /** ลายเซ็นตัวตน: มิติที่เด่น/ด้อยที่สุด (ใช้อธิบาย "คนนี้ต่างจากคนทั่วไปตรงไหน") */
  HC.signature = (npc, k) => {
    k = k || 6;
    const v = HC.vector(npc).filter(x => x.layer !== 'skills');
    const hi = v.filter(x => x.z > 0.9).sort((a, b) => b.z - a.z).slice(0, k);
    const lo = v.filter(x => x.z < -0.9).sort((a, b) => a.z - b.z).slice(0, Math.max(3, k - 2));
    const tag = x => ({ path: x.path, nameTh: HC.nameOf(x.path), layerTh: HC.LAYER_TH[x.layer], value: Math.round(x.v), z: Math.round(x.z * 100) / 100, pct: HC.percentile(x.z) });
    return { strengths: hi.map(tag), weaknesses: lo.map(tag) };
  };

  /** เปรียบเทียบ A กับ B: ระยะห่างตัวตน เปอร์เซ็นต์ความคล้าย และมิติที่ต่างที่สุด */
  HC.compare = (a, b) => {
    const va = HC.vector(a), vb = HC.vector(b);
    const layerAgg = {}, diffs = [];
    let tot = 0, wsum = 0;
    for (let i = 0; i < va.length; i++) {
      const dz = va[i].z - vb[i].z, L = va[i].layer, w = LAYER_W[L];
      tot += w * dz * dz; wsum += w;
      const la = layerAgg[L] = layerAgg[L] || { s: 0, n: 0 }; la.s += Math.abs(dz); la.n++;
      diffs.push({ path: va[i].path, layer: L, dz, a: va[i].v, b: vb[i].v });
    }
    const dist = Math.sqrt(tot / wsum);
    const layers = Object.keys(layerAgg).map(L => ({ layer: L, layerTh: HC.LAYER_TH[L], diff: layerAgg[L].s / layerAgg[L].n })).sort((x, y) => y.diff - x.diff);
    diffs.sort((x, y) => Math.abs(y.dz) - Math.abs(x.dz));
    return {
      distance: Math.round(dist * 100) / 100,
      similarity: Math.round(100 * Math.exp(-dist / 1.15)),
      layers,
      topDiffs: diffs.slice(0, 10).map(d => ({ path: d.path, nameTh: HC.nameOf(d.path), layerTh: HC.LAYER_TH[d.layer], a: Math.round(d.a), b: Math.round(d.b), dz: Math.round(d.dz * 100) / 100 })),
      topAlike: diffs.slice(-4).map(d => ({ path: d.path, nameTh: HC.nameOf(d.path), a: Math.round(d.a), b: Math.round(d.b) }))
    };
  };

  const LEX_P = {
    ambition: ['ทะเยอทะยาน', 'ไม่ใฝ่สูง'], discipline: ['วินัยเหล็ก', 'เหลาะแหละ'], caution: ['รอบคอบ', 'บุ่มบ่าม'], curiosity: ['ใฝ่รู้', 'เฉยชาต่อสิ่งใหม่'],
    creativity: ['คิดนอกกรอบ', 'ยึดแบบแผน'], rationality: ['เป็นเหตุเป็นผล', 'ใช้อารมณ์นำ'], empathy: ['เมตตา', 'เลือดเย็น'], trustfulness: ['ไว้ใจคนง่าย', 'ระแวงคน'],
    loyalty: ['ภักดี', 'ไม่ผูกพันสังกัด'], integrity: ['ซื่อตรง', 'เจ้าเล่ห์'], aggression: ['ดุดัน', 'สงบเสงี่ยม'], courage: ['กล้าหาญ', 'ขี้ขลาด'],
    pride: ['ทะนงตน', 'ถ่อมตน'], composure: ['สุขุมนิ่ง', 'หวั่นไหวง่าย']
  };
  const LEX_V = { familyClan: 'รักพวกพ้อง', sectDuty: 'ยึดสำนักเป็นที่หนึ่ง', martialPeak: 'คลั่งวิถียุทธ์', knowledgeCraft: 'บูชาวิชา', freedom: 'รักอิสระ', wealthResource: 'ให้ค่าทรัพย์สิน', powerStatus: 'กระหายอำนาจ', honorLegacy: 'ถือเกียรติ' };
  HC.LEX_P = LEX_P; HC.LEX_V = LEX_V;

  HC.identity = npc => {
    const P = HC.layerIds('personality').map(id => ({ id, z: HC.z(npc, 'personality.' + id) }));
    const V = HC.layerIds('values').map(id => ({ id, z: HC.z(npc, 'values.' + id) }));
    const I = HC.layerIds('interests').map(id => ({ id, v: HC.eff(npc, 'interests.' + id) })).sort((a, b) => b.v - a.v);
    P.sort((a, b) => Math.abs(b.z) - Math.abs(a.z)); V.sort((a, b) => b.z - a.z);
    const tags = [];
    P.slice(0, 4).forEach(p => { if (Math.abs(p.z) > .55) tags.push(LEX_P[p.id][p.z > 0 ? 0 : 1]); });
    if (V[0].z > .6) tags.push(LEX_V[V[0].id]);
    const topI = I.slice(0, 3).map(i => HC.nameOf('interests.' + i.id));
    const intl = HC.derived(npc).intelligenceIndex;
    const archTh = (ARCH_BY_ID[npc.h.archetype] || {}).labelTh || '';
    const title = (tags[0] ? tags[0] : 'ธรรมดา') + (tags[1] ? ' ' + tags[1] : '') + ' · ชอบ' + topI[0];
    return { title, tags, loves: topI, archetypeTh: archTh, smart: HC.levelLabel(intl) };
  };
  HC.appearanceText = npc => {
    const b = npc.h.body, bt = b.beauty;
    const look = bt >= 90 ? 'งดงามเลิศล้ำ' : bt >= 75 ? 'หน้าตาดีมาก' : bt >= 58 ? 'หน้าตาดี' : bt >= 42 ? 'หน้าตาธรรมดา' : bt >= 25 ? 'หน้าตาไม่โดดเด่น' : 'หน้าตาคมดุ/ไม่ถูกใจใคร';
    return 'สูง ' + b.heightCm + ' ซม. หนัก ' + b.weightKg + ' กก. รูปร่าง' + b.frame + ' ผิว' + b.skin + ' ผม' + b.hair + ' ' + b.hairStyle + ' ตา' + b.eye + ' ถนัด' + b.hand + ' · ' + look + (b.marks.length ? ' · มีรอย: ' + b.marks.join(', ') : '');
  };
  HC.ageText = npc => Math.floor(HC.ageYears(npc)) + ' ปี';

  /* -------------------------------------------------------------------------
   * 7) ตรวจสอบความถูกต้องของ npc.h (ใช้ใน test และตอนโหลดเซฟ)
   * ------------------------------------------------------------------------- */
  HC.validate = npc => {
    const errs = [], h = npc.h;
    if (!h) return ['no h'];
    D.forEach(d => {
      const L = h[d.layer];
      if (!L || typeof L[d.id] !== 'number' || !isFinite(L[d.id])) errs.push('missing/NaN ' + d.path);
      else if (L[d.id] < -0.001 || L[d.id] > 100.001) errs.push('range ' + d.path + '=' + L[d.id]);
    });
    ['body', 'state', 'fulfil', 'mind', 'life', 'destiny', 'root', 'tastes'].forEach(k => { if (!h[k]) errs.push('missing ' + k); });
    Object.keys(h.state || {}).forEach(k => { if (typeof h.state[k] !== 'number' || !isFinite(h.state[k])) errs.push('state NaN ' + k); });
    return errs;
  };

  g.HC = HC;
  if (typeof module === 'object' && module.exports) module.exports = HC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
