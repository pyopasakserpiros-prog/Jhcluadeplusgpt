/* world_map.js — แผนที่สำนัก 240×192 ช่อง: ภูมิประเทศ อาคาร จุดทำกิจกรรม (stations) ธารน้ำปราณทักษิณ กริดนำทาง และ A*
 * หน่วย: 1 ช่อง = 1 tile (วาด 16px). พิกัดเป็นทศนิยมของช่อง (ศูนย์กลางช่อง = i+0.5) */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js');
  const MAP = {};
  const W = 240, H = 192, H_BASE = 160, OX = 22, OY = 14;
  MAP.W = W; MAP.H = H; MAP.H_BASE = H_BASE; MAP.TILE = 16;
  MAP.EXIT = { x: 118, y: 188 };
  MAP.LEGACY_EXIT = { x: 118, y: 158 };
  MAP.GATE_IN = { x: 118, y: 124 };

  // ชนิดภูมิประเทศ
  const T = { GRASS: 0, ROAD: 1, WATER: 2, CLIFF: 3, FOREST: 4, WALL: 5, FLOOR: 6, FARM: 7, DIRT: 8, PLAZA: 9, ARCH: 10, SAND: 11, MOSS: 12 };
  MAP.T = T;
  // ตัวคูณความเร็วเดินตามพื้น (WATER = 0 เดินลุยน้ำไม่ได้ ต้องข้ามสะพานหรือเดินตามตลิ่ง)
  const SPEED = [1.0, 1.25, 0, 0, 0.8, 0, 1.1, 0.85, 1.0, 1.15, 1.1, 0.9, 0.95];

  /* -------- ทะเบียนชนิดอาคาร -------- */
  const BTYPES = {
    gate: { nameTh: 'ประตูสำนัก', icon: '⛩️', roof: '#2f4858', wall: '#8b2e2e', desc: 'ทางเข้าออกเดียวของสำนัก ผู้ออกเดินทางและผู้มาเยือนผ่านที่นี่' },
    main_hall: { nameTh: 'ตำหนักใหญ่', icon: '🏯', roof: '#7a1f1f', wall: '#c79a3b', desc: 'ที่ทำการเจ้าสำนักและห้องประชุมผู้อาวุโส' },
    ancestral: { nameTh: 'หออนุสรณ์บรรพชน', icon: '🕯️', roof: '#3d3d4f', wall: '#a8a29e', desc: 'ที่สักการะบรรพชนและผู้วายชนม์ของสำนัก' },
    meditation_hall: { nameTh: 'หอบำเพ็ญวิญญาณ', icon: '🧘', roof: '#1f5f6b', wall: '#d6c8a4', desc: 'สถานที่บ่มเพาะปราณ ตั้งอยู่เหนือเส้นชีพจรวิญญาณ' },
    scripture: { nameTh: 'หอคัมภีร์', icon: '📜', roof: '#3a3a6a', wall: '#7b4b2a', desc: 'คลังตำราและวิชา ใช้ศึกษา คัดลอก และวิจัยค่ายกล/ยันต์' },
    treasury: { nameTh: 'หอคลังทรัพย์', icon: '💰', roof: '#6b5a1f', wall: '#4a3a22', desc: 'เก็บศิลาวิญญาณและวัตถุดิบของสำนัก' },
    discipline: { nameTh: 'หอวินัย', icon: '⚖️', roof: '#222a35', wall: '#5b6470', desc: 'บังคับใช้กฎสำนัก คุมขังผู้กระทำผิด' },
    dorm_core: { nameTh: 'เรือนศิษย์แกน', icon: '🛏️', roof: '#5a2d7a', wall: '#d2b48c', desc: 'ที่พักศิษย์แกนกลาง' },
    dorm_inner: { nameTh: 'เรือนศิษย์ใน', icon: '🛏️', roof: '#2d5a7a', wall: '#d2b48c', desc: 'ที่พักศิษย์ใน' },
    dorm_outer: { nameTh: 'เรือนศิษย์นอก', icon: '🛏️', roof: '#5a6a4a', wall: '#c4a77d', desc: 'ที่พักศิษย์นอกและผู้ฝึกหัด' },
    elder_quarters: { nameTh: 'เรือนผู้อาวุโส', icon: '🏡', roof: '#8a3a2a', wall: '#d9c7a0', desc: 'ที่พักเจ้าสำนัก รองเจ้าสำนัก และผู้อาวุโส' },
    canteen: { nameTh: 'โรงครัวและโรงอาหาร', icon: '🍲', roof: '#7a4a2a', wall: '#e0c9a6', desc: 'ปรุงและแจกอาหาร ทุกคนต้องกินที่นี่หรือจากเสบียงตน' },
    training_ground: { nameTh: 'ลานฝึกยุทธ์', icon: '⚔️', roof: '#6b2a2a', wall: '#a88b5a', desc: 'ฝึกวิชา ประลอง และหลอมกาย', open: true },
    market: { nameTh: 'ตลาดสำนัก', icon: '🛒', roof: '#8a5a1a', wall: '#caa46a', desc: 'แลกเปลี่ยนของ ขายผลิตผลให้พ่อค้า' },
    infirmary: { nameTh: 'หอหมอยา', icon: '⚕️', roof: '#2a6a4a', wall: '#e8efe0', desc: 'รักษาผู้บาดเจ็บและผู้ป่วย' },
    alchemy: { nameTh: 'หอปรุงโอสถ', icon: '⚗️', roof: '#3a6a3a', wall: '#a08a5a', desc: 'ปรุงโอสถ เตาและสมุนไพร' },
    forge: { nameTh: 'โรงหลอมศาสตรา', icon: '🔨', roof: '#4a3a3a', wall: '#6a5a5a', desc: 'หลอมอาวุธ เกราะ ยันต์ และค่ายกล' },
    herb_garden: { nameTh: 'สวนสมุนไพร', icon: '🌿', roof: '#3a7a3a', wall: '#6a8a4a', desc: 'ปลูกสมุนไพรวิญญาณสำหรับปรุงยา', open: true },
    farm: { nameTh: 'ไร่นาข้าว', icon: '🌾', roof: '#8a8a3a', wall: '#a8a05a', desc: 'ผลิตเสบียงเลี้ยงคนทั้งสำนัก', open: true },
    mission_hall: { nameTh: 'หอภารกิจ', icon: '📯', roof: '#2a4a7a', wall: '#8a6a4a', desc: 'รับ-ส่งภารกิจนอกสำนัก จัดคณะเดินทาง' },
    tea_garden: { nameTh: 'ศาลาชาและสวนสังสรรค์', icon: '🍵', roof: '#6a3a5a', wall: '#d8c8a8', desc: 'พบปะ พูดคุย ดื่มชา เล่นดนตรี' },
    shrine: { nameTh: 'ศาลเทพศรัทธา', icon: '🛕', roof: '#b08a1a', wall: '#e8d8a0', desc: 'สถานที่รวมศรัทธา สำหรับผู้บำเพ็ญวิถีเทพ' },
    mine: { nameTh: 'เหมืองแร่วิญญาณ', icon: '⛏️', roof: '#4a4a4a', wall: '#6a6a6a', desc: 'ขุดแร่และหินวิญญาณจากภูเขาหลังสำนัก' },
    spirit_pond: { nameTh: 'สระธารวิญญาณ', icon: '🐟', roof: '#2a6a8a', wall: '#2a6a8a', desc: 'สระน้ำพุวิญญาณภายในสำนัก ตกปลา พักผ่อน', open: true },
    river_dock: { nameTh: 'ท่าน้ำธารปราณทักษิณ', icon: '🎣', roof: '#5a4632', wall: '#8c6d46', desc: 'ท่าน้ำไม้และสะพานข้ามธารน้ำปราณทักษิณ จุดตกปลาและพักผ่อนริมน้ำทางใต้ของสำนัก', open: true, terr: 6 },
    river_west: { nameTh: 'คุ้งน้ำไผ่หยก', icon: '🐟', roof: '#2a6a5a', wall: '#3a7a6a', desc: 'คุ้งน้ำตื้นร่มไผ่ทางตะวันตกของธารปราณ ชุกชุมด้วยปลาลำธารและปลาสมุนไพร', open: true, terr: 11 },
    river_east: { nameTh: 'วังน้ำศิลาคราม', icon: '🌊', roof: '#1f4f6b', wall: '#2a5a7a', desc: 'วังน้ำลึกและโขดหินปราณทางตะวันออก แหล่งอาศัยของปลาดาราและปลามังกรหนวดหยกหายาก', open: true, terr: 11 },
    tower: { nameTh: 'หอสังเกตการณ์', icon: '🗼', roof: '#3a4a5a', wall: '#7a6a5a', desc: 'จุดเฝ้าระวังมุมกำแพง' },
    cave: { nameTh: 'ถ้ำหมื่นสายหมอก', icon: '🕳️', roof: '#444', wall: '#555', desc: 'ถ้ำใหญ่ใต้ภูเขา ลึก 10 ชั้น มีผู้พิทักษ์ที่ชั้น 5 และ 10', open: true, terr: 12 },
    realm_gate: { nameTh: 'ลานประตูมิติ', icon: '🌀', roof: '#444', wall: '#555', desc: 'แท่นโบราณที่ประตูมิติสู่แดนหมื่นพิภพเปิดเป็นครั้งคราว', open: true, terr: 9 },
    stele: { nameTh: 'แท่นศิลาจารึกโบราณ', icon: '🗿', roof: '#444', wall: '#555', desc: 'ถอดจารึกสะสมเศษ ครบแล้วได้คัมภีร์วิชา', open: true, terr: 9 },
    spring: { nameTh: 'น้ำพุปราณลับ', icon: '⛲', roof: '#444', wall: '#555', desc: 'ตาน้ำปราณ ฟื้นพลังและเพิ่มตบะ ใช้ได้จำกัดต่อวัน', open: true, terr: 12 },
    ruin: { nameTh: 'ซากเจดีย์ร้าง', icon: '🏚️', roof: '#444', wall: '#555', desc: 'ซากโบราณ มีของเก่า เงื่อนงำ และผีสาง', open: true, terr: 11 },
    grove: { nameTh: 'ป่าสมุนไพรเร้นลับ', icon: '🌳', roof: '#444', wall: '#555', desc: 'ป่าลึกหลังกำแพง สมุนไพรหายาก', open: true, terr: 12 },
    plaza: { nameTh: 'ลานกลางสำนัก', icon: '⛲', roof: '#999', wall: '#999', desc: 'ลานรวมพลและพบปะ', open: true }
  };
  MAP.BTYPES = BTYPES;

  /* -------- แผนผัง (พิกัดท้องถิ่น + offset) -------- */
  // [type, id, x, y, w, h, yard, extra]
  const LAYOUT = [
    ['main_hall', 'main_hall', 82, 36, 28, 12, 4],
    ['ancestral', 'ancestral', 90, 16, 14, 9, 3],
    ['meditation_hall', 'meditation_hall', 52, 17, 22, 9, 5],
    ['elder_quarters', 'elder_quarters', 138, 17, 24, 9, 3],
    ['scripture', 'scripture', 124, 37, 18, 10, 4],
    ['treasury', 'treasury', 148, 37, 14, 9, 3],
    ['discipline', 'discipline', 60, 38, 14, 9, 3],
    ['dorm_core', 'dorm_core', 34, 36, 16, 10, 2],
    ['dorm_inner', 'dorm_inner', 30, 58, 18, 10, 2],
    ['dorm_outer', 'dorm_outer', 28, 86, 20, 12, 2],
    ['canteen', 'canteen', 58, 74, 16, 8, 4],
    ['market', 'market', 100, 80, 22, 8, 3],
    ['infirmary', 'infirmary', 150, 56, 14, 9, 2],
    ['alchemy', 'alchemy', 128, 56, 18, 10, 4],
    ['forge', 'forge', 128, 74, 20, 10, 4],
    ['mission_hall', 'mission_hall', 100, 98, 10, 6, 3],
    ['tea_garden', 'tea_garden', 114, 58, 12, 6, 4],
    ['shrine', 'shrine', 62, 58, 10, 6, 3],
    ['mine', 'mine', 26, 16, 16, 10, 3]
  ];
  const OPEN = [ // พื้นที่เปิด [type,id,x,y,w,h]
    ['training_ground', 'training_ground', 50, 90, 34, 18],
    ['herb_garden', 'herb_garden', 112, 92, 22, 14],
    ['farm', 'farm', 140, 92, 26, 16],
    ['spirit_pond', 'spirit_pond', 112, 16, 22, 14],
    ['plaza', 'plaza', 80, 58, 32, 18],
    ['cave', 'cave', 174, 30, 10, 8], ['stele', 'stele', 174, 44, 8, 6], ['spring', 'spring', 174, 55, 8, 7], ['ruin', 'ruin', 174, 68, 10, 8],
    ['grove', 'grove', 12, 30, 12, 10], ['realm_gate', 'gate_zone', 11, 50, 12, 12]
  ];
  const TOWERS = [[10, 6], [184, 6], [10, 113], [184, 113]];
  MAP.PLOTS = [ // ที่ดินว่างสำหรับขยายในอนาคต (ท้องถิ่น)
    { id: 'plot_w', nameTh: 'ที่ดินว่างฝั่งตะวันตก', x: 10, y: 28, w: 14, h: 84 },
    { id: 'plot_e', nameTh: 'ที่ดินว่างฝั่งตะวันออก', x: 172, y: 28, w: 14, h: 84 },
    { id: 'plot_n', nameTh: 'ที่ดินว่างฝั่งเหนือ', x: 44, y: 6, w: 140, h: 8 },
    { id: 'plot_se', nameTh: 'ที่ดินว่างมุมตะวันออกเฉียงใต้', x: 136, y: 110, w: 46, h: 6 }
  ].map(p => ({ id: p.id, nameTh: p.nameTh, x: p.x + OX, y: p.y + OY, w: p.w, h: p.h }));

  /* -------- สถานี (station) ต่อชนิดอาคาร -------- */
  // spec: [kind, count, where('yard'|'in'|'open'), spacing]
  const STN = {
    gate: [['guard', 2, 'yard']],
    main_hall: [['work', 4, 'in'], ['council', 12, 'in'], ['audience', 3, 'yard']],
    ancestral: [['pray', 4, 'yard']],
    meditation_hall: [['meditate', 10, 'yard']],
    scripture: [['read', 8, 'yard'], ['research', 3, 'in'], ['work', 2, 'in']],
    treasury: [['work', 3, 'in']],
    discipline: [['work', 2, 'in'], ['cell', 3, 'in'], ['guard', 2, 'yard']],
    dorm_core: [['bed', 8, 'in']], dorm_inner: [['bed', 14, 'in']], dorm_outer: [['bed', 24, 'in']],
    elder_quarters: [['bed', 10, 'in']],
    canteen: [['eat', 16, 'yard'], ['cook', 3, 'in']],
    training_ground: [['dummy', 10, 'open'], ['spar', 6, 'open'], ['lift', 4, 'open']],
    market: [['stall', 4, 'yard'], ['browse', 6, 'yard']],
    infirmary: [['patient', 6, 'in'], ['treat', 2, 'yard']],
    alchemy: [['cauldron', 4, 'yard'], ['herbtable', 2, 'yard']],
    forge: [['anvil', 4, 'yard'], ['array', 2, 'yard']],
    herb_garden: [['farm', 8, 'open']],
    farm: [['farm', 10, 'open']],
    mission_hall: [['work', 2, 'in'], ['board', 3, 'yard']],
    tea_garden: [['chat', 10, 'yard'], ['music', 2, 'yard']],
    shrine: [['worship', 6, 'yard']],
    mine: [['mine', 6, 'yard']],
    spirit_pond: [['fish', 6, 'shore'], ['relax', 4, 'shore']],
    plaza: [['stroll', 12, 'open']],
    cave: [['delve', 4, 'open']], realm_gate: [['watch', 3, 'open']], stele: [['explore', 3, 'open']], spring: [['explore', 3, 'open']], ruin: [['explore', 3, 'open']], grove: [['explore', 4, 'open']],
    tower: [['guard', 1, 'yard']]
  };

  // คำนวณแนวร่องน้ำของ「ธารน้ำปราณทักษิณ」(Southern Spirit River)
  function riverCenterY(x) {
    return Math.round(170 + 2.0 * Math.sin((x - 30) / 22) + 1.0 * Math.cos((x - 90) / 14));
  }
  function riverHalfWidth(x) {
    return (x >= 156 && x <= 192) ? 4 : 3;
  }
  MAP.riverCenterY = riverCenterY;
  MAP.riverHalfWidth = riverHalfWidth;

  /* -------- สร้างแผนที่ -------- */
  MAP.create = function (seed) {
    const rng = new U.RNG('map' + (seed || 1));
    const M = { W, H, seed, hasSouthernRiver: true };
    const n = W * H;
    M.terrain = new Uint8Array(n);       // ชนิดพื้น
    M.block = new Uint8Array(n);         // 0 โล่ง, 1 อาคาร/สิ่งก่อสร้าง, 2 ธรรมชาติกั้น, 3 ต้นไม้/หิน
    M.owner = new Int16Array(n).fill(-1); // อาคารที่ครอบครองช่อง
    M.buildings = []; M.stations = []; M.decor = []; M.roads = [];
    const idx = (x, y) => y * W + x;
    const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
    M.idx = idx; M.inb = inb;

    // 1) ภูเขาล้อมรอบ + พื้นหญ้าในกำแพง + ลานนอกประตู (คงลำดับเดิมสำหรับ y < H_BASE = 160 เพื่อความเข้ากันได้ของเซฟ)
    M.terrain.fill(T.CLIFF); M.block.fill(2);
    const WX0 = 8 + OX, WY0 = 4 + OY, WX1 = 188 + OX, WY1 = 118 + OY; // กรอบกำแพง (รวมความหนา)
    for (let y = WY0; y <= WY1; y++) for (let x = WX0; x <= WX1; x++) {
      const wall = (x <= WX0 + 1 || x >= WX1 - 1 || y <= WY0 + 1 || y >= WY1 - 1);
      M.terrain[idx(x, y)] = wall ? T.WALL : T.GRASS; M.block[idx(x, y)] = wall ? 2 : 0;
    }
    M.wall = { x0: WX0, y0: WY0, x1: WX1, y1: WY1 };
    // นอกประตู: ทุ่งหญ้า + ถนนสู่ขอบแผนที่เดิม (y <= 159)
    for (let y = WY1 + 1; y < H_BASE; y++) for (let x = 96; x <= 142; x++) {
      const d = Math.abs(x - 118) / 24, edge = y - WY1;
      if (d < 1 - edge * 0.004) { M.terrain[idx(x, y)] = T.GRASS; M.block[idx(x, y)] = 0; }
    }
    // พื้นที่ล่าและป่ารอบสำนัก เชื่อมต่อกันรอบกำแพงทั้ง 4 ด้าน (ใต้ ซ้าย ขวา บน)
    for (let y = WY1 + 1; y < H_BASE; y++) for (let x = 2; x < W - 2; x++) { M.terrain[idx(x, y)] = T.GRASS; M.block[idx(x, y)] = 0; }
    for (let y = 2; y <= WY1; y++) for (let x = 2; x < WX0; x++) { M.terrain[idx(x, y)] = T.GRASS; M.block[idx(x, y)] = 0; }
    for (let y = 2; y <= WY1; y++) for (let x = WX1 + 1; x < W - 2; x++) { M.terrain[idx(x, y)] = T.GRASS; M.block[idx(x, y)] = 0; }
    for (let y = 2; y < WY0; y++) for (let x = 2; x < W - 2; x++) { M.terrain[idx(x, y)] = T.GRASS; M.block[idx(x, y)] = 0; }

    // ช่องประตูกำแพงด้านต่าง ๆ (เปิดเชื่อมต่อออกสู่พื้นที่ล่ารอบสำนัก)
    // 1. ประตูทิศใต้ (ทางเข้าหลัก)
    const GX0 = 93 + OX, GX1 = 98 + OX;
    for (let y = WY1 - 1; y <= WY1; y++) for (let x = GX0; x <= GX1; x++) { M.terrain[idx(x, y)] = T.ARCH; M.block[idx(x, y)] = 0; }
    for (let y = WY1 + 1; y < H_BASE; y++) for (let x = 116; x <= 120; x++) { M.terrain[idx(x, y)] = T.ROAD; M.block[idx(x, y)] = 0; }

    // 2. ประตูทิศประจิม (ตะวันตก - สู่ป่าไผ่หมอกคราม)
    for (let y = 78; y <= 82; y++) for (let x = WX0; x <= WX0 + 1; x++) { M.terrain[idx(x, y)] = T.ARCH; M.block[idx(x, y)] = 0; }
    for (let y = 79; y <= 81; y++) for (let x = 14; x < WX0; x++) { M.terrain[idx(x, y)] = T.ROAD; M.block[idx(x, y)] = 0; }

    // 3. ประตูทิศบูรพา (ตะวันออก - สู่ผาหินแกร่ง)
    for (let y = 78; y <= 82; y++) for (let x = WX1 - 1; x <= WX1; x++) { M.terrain[idx(x, y)] = T.ARCH; M.block[idx(x, y)] = 0; }
    for (let y = 79; y <= 81; y++) for (let x = WX1 + 1; x <= 226; x++) { M.terrain[idx(x, y)] = T.ROAD; M.block[idx(x, y)] = 0; }

    // 4. ประตูทิศอุดร (ทางเหนือ - สู่ยอดเขาเหมันต์)
    for (let y = WY0; y <= WY0 + 1; y++) for (let x = 116; x <= 120; x++) { M.terrain[idx(x, y)] = T.ARCH; M.block[idx(x, y)] = 0; }
    for (let y = 4; y < WY0; y++) for (let x = 117; x <= 119; x++) { M.terrain[idx(x, y)] = T.ROAD; M.block[idx(x, y)] = 0; }
    for (let y = WY0 + 2; y <= 28 + OY; y++) for (let x = 117; x <= 119; x++) { if (M.block[idx(x, y)] === 0) M.terrain[idx(x, y)] = T.ROAD; }

    // 2) อาคารบนพื้นที่เดิม
    let bidn = 0;
    function addBuilding(type, id, lx, ly, w, h, yard, open, absCoord) {
      const x = absCoord ? lx : lx + OX, y = absCoord ? ly : ly + OY;
      const b = { n: bidn++, id, type, x, y, w, h, yard: yard || 0, open: !!open, level: 1, hp: 100, nameTh: BTYPES[type].nameTh, inside: [], stations: [] };
      if (!open) {
        for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { M.block[idx(xx, yy)] = 1; M.owner[idx(xx, yy)] = b.n; M.terrain[idx(xx, yy)] = T.FLOOR; }
        for (let yy = y + h; yy < y + h + b.yard; yy++) for (let xx = x - 1; xx < x + w + 1; xx++) { if (!inb(xx, yy) || M.block[idx(xx, yy)] !== 0) continue; M.terrain[idx(xx, yy)] = T.FLOOR; M.owner[idx(xx, yy)] = b.n; }
        b.door = { x: x + (w >> 1), y: y + h };
        b.area = { x: x - 1, y, w: w + 2, h: h + b.yard };
      } else {
        const tt = BTYPES[type].terr !== undefined ? BTYPES[type].terr : type === 'farm' || type === 'herb_garden' ? T.FARM : type === 'training_ground' ? T.DIRT : type === 'plaza' ? T.PLAZA : T.WATER;
        for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
          M.terrain[idx(xx, yy)] = tt; M.owner[idx(xx, yy)] = b.n;
          if (type === 'spirit_pond') { const edge = (xx === x || yy === y || xx === x + w - 1 || yy === y + h - 1); M.block[idx(xx, yy)] = edge ? 0 : 2; M.terrain[idx(xx, yy)] = edge ? T.SAND : T.WATER; }
        }
        b.door = { x: x + (w >> 1), y: y + h };
        b.area = { x, y, w, h };
      }
      M.buildings.push(b); return b;
    }
    LAYOUT.forEach(a => addBuilding(a[0], a[1], a[2], a[3], a[4], a[5], a[6], false));
    OPEN.forEach(a => addBuilding(a[0], a[1], a[2], a[3], a[4], a[5], 0, true));
    TOWERS.forEach((t, i) => addBuilding('tower', 'tower' + i, t[0], t[1], 4, 4, 2, false));
    // ประตู
    {
      const b = addBuilding('gate', 'gate', 88, 114, 16, 5, 0, false);
      b.area = { x: b.x, y: b.y, w: 16, h: 5 };
      for (let yy = WY1 - 1; yy <= WY1; yy++) for (let xx = GX0; xx <= GX1; xx++) { M.block[idx(xx, yy)] = 0; M.terrain[idx(xx, yy)] = T.ARCH; }
      for (let yy = b.y; yy < b.y + b.h; yy++) for (let xx = GX0; xx <= GX1; xx++) { M.block[idx(xx, yy)] = 0; M.terrain[idx(xx, yy)] = T.ARCH; M.owner[idx(xx, yy)] = -1; }
      b.door = { x: 96 + OX, y: b.y - 1 };
    }
    M.byId = {}; M.buildings.forEach(b => M.byId[b.id] = b);

    // 3) ถนนหลัก
    const paintRoad = (x, y, w, h) => { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) { if (!inb(xx, yy)) continue; const k = idx(xx, yy); if (M.block[k] === 0 && M.terrain[k] !== T.PLAZA && M.terrain[k] !== T.FLOOR && M.terrain[k] !== T.ARCH) M.terrain[k] = T.ROAD; } };
    paintRoad(93 + OX, 48 + OY, 6, 66);        // แกนเหนือ–ใต้
    paintRoad(12 + OX, 66 + OY, 172, 3);        // ตะวันออก–ตะวันตก
    paintRoad(93 + OX, 28 + OY, 6, 10);
    // 4) เชื่อมประตูอาคารเข้าถนนด้วย A*
    function isRoadish(x, y) { const t = M.terrain[idx(x, y)]; return t === T.ROAD || t === T.PLAZA || t === T.ARCH; }
    // สร้างกริดชั่วคราวเพื่อนำทางก่อนวางต้นไม้
    M.speed = SPEED;
    MAP._cur = M;
    M.buildings.forEach(b => {
      if (b.type === 'gate' || b.type === 'plaza') return;
      const sx = b.door.x, sy = b.door.y;
      if (!inb(sx, sy)) return;
      // BFS ถึงถนนที่ใกล้สุด
      const path = bfsToRoad(M, sx, sy, isRoadish);
      if (path) path.forEach(([x, y]) => { const k = idx(x, y); if (M.block[k] === 0 && !isRoadish(x, y) && M.terrain[k] !== T.FLOOR && M.terrain[k] !== T.FARM && M.terrain[k] !== T.DIRT) { M.terrain[k] = T.ROAD; } });
    });
    // 5) สถานีกิจกรรมเดิม
    let sid = 0;
    M.buildings.forEach(b => {
      const specs = STN[b.type] || [];
      specs.forEach(([kind, count, where]) => {
        const spots = stationSpots(M, b, kind, count, where, rng);
        spots.forEach((p, i) => {
          const s = { id: sid++, bid: b.n, bkey: b.id, kind, x: p.x, y: p.y, inside: where === 'in', occ: null, n: i };
          if (b.id === 'spirit_pond' && kind === 'fish') s.zoneId = 'spirit_pond';
          M.stations.push(s); b.stations.push(s.id);
        });
      });
    });
    M.stationById = M.stations; // index == id
    // 6) ของตกแต่งเดิม: ต้นไม้ หิน ดอกไม้ ไผ่ ตะเกียง (คงการทอย rng เดิมทุกประการสำหรับ y < H_BASE)
    placeDecor(M, rng);

    // 7) ขยายแผนที่ลงทางทิศใต้ (y = 160..191): ธารน้ำปราณทักษิณ สะพาน ท่าน้ำ และจุดตกปลา 3 เขต
    sid = buildSouthernRiverExtension(M, seed, sid);

    M.stations.forEach(st => { if (M.block[st.y * W + st.x] !== 0) { const f = MAP.nearestFree(M, st.x, st.y); if (f) { st.x = f.x; st.y = f.y; } } });
    // 8) กริดต้นทุนนำทาง
    M.cost = new Float32Array(n);
    for (let i = 0; i < n; i++) M.cost[i] = M.block[i] !== 0 ? 0 : 1 / Math.max(0.2, SPEED[M.terrain[i]] || 1);
    return M;
  };

  function buildSouthernRiverExtension(M, seed, sid) {
    const rrng = new U.RNG('south_river_' + (seed || 1));
    const idx = M.idx;
    const inb = M.inb;

    // 7.1 เปิดพื้นที่หุบเขาริมน้ำทางใต้ (y = 158..189, x = 2..W-3)
    for (let y = H_BASE - 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const k = idx(x, y);
        if (y >= H_BASE) {
          M.terrain[k] = T.GRASS;
          M.block[k] = 0;
        }
      }
    }

    // 7.2 ขุดร่องน้ำ「ธารน้ำปราณทักษิณ」(T.WATER, block = 2 เดินลุยน้ำไม่ได้) และตลิ่งทราย/มอส
    for (let x = 2; x < W - 2; x++) {
      const cy = riverCenterY(x);
      const hw = riverHalfWidth(x);
      const northShore = cy - hw - 1;
      const southShore = cy + hw + 1;
      if (inb(x, northShore)) {
        M.terrain[idx(x, northShore)] = (x >= 44 && x <= 82) || (x >= 156 && x <= 192) ? T.MOSS : T.SAND;
        M.block[idx(x, northShore)] = 0;
      }
      if (inb(x, southShore)) {
        M.terrain[idx(x, southShore)] = (x >= 44 && x <= 82) || (x >= 156 && x <= 192) ? T.MOSS : T.SAND;
        M.block[idx(x, southShore)] = 0;
      }
      for (let y = cy - hw; y <= cy + hw; y++) {
        if (!inb(x, y)) continue;
        M.terrain[idx(x, y)] = T.WATER;
        M.block[idx(x, y)] = 2;
      }
      // ทางเดินเลียบฝั่งเหนือและฝั่งใต้
      const nPathY = cy - hw - 2;
      if (x >= 42 && x <= 196 && inb(x, nPathY)) {
        M.terrain[idx(x, nPathY)] = T.ROAD;
        M.block[idx(x, nPathY)] = 0;
      }
      const sPathY = cy + hw + 2;
      if (x >= 58 && x <= 178 && inb(x, sPathY)) {
        M.terrain[idx(x, sPathY)] = T.ROAD;
        M.block[idx(x, sPathY)] = 0;
      }
    }

    // 7.3 ถนนใหญ่ทิศใต้และสะพานข้ามธารน้ำ 3 แห่ง (เดินข้ามได้จริง block = 0)
    // สะพานหลักกลาง (x = 116..120) เชื่อมประตูสำนักสู่ทางออกยุทธภพ MAP.EXIT (118, 188)
    for (let y = H_BASE - 2; y <= H - 3; y++) {
      for (let x = 116; x <= 120; x++) {
        const cy = riverCenterY(x), hw = riverHalfWidth(x);
        const onBridge = y >= cy - hw - 1 && y <= cy + hw + 1;
        const k = idx(x, y);
        M.terrain[k] = onBridge ? ((x === 116 || x === 120) ? T.FLOOR : T.ROAD) : T.ROAD;
        M.block[k] = 0;
      }
    }
    // สะพานไม้ไผ่ฝั่งตะวันตก (x = 62..64)
    for (let x = 62; x <= 64; x++) {
      const cy = riverCenterY(x), hw = riverHalfWidth(x);
      for (let y = cy - hw - 2; y <= cy + hw + 2; y++) {
        if (!inb(x, y)) continue;
        M.terrain[idx(x, y)] = T.FLOOR;
        M.block[idx(x, y)] = 0;
      }
    }
    // สะพานศิลาฝั่งตะวันออก (x = 172..174)
    for (let x = 172; x <= 174; x++) {
      const cy = riverCenterY(x), hw = riverHalfWidth(x);
      for (let y = cy - hw - 2; y <= cy + hw + 2; y++) {
        if (!inb(x, y)) continue;
        M.terrain[idx(x, y)] = T.FLOOR;
        M.block[idx(x, y)] = 0;
      }
    }

    // 7.4 ท่าน้ำไม้ยื่นลงริมน้ำ (Piers — T.FLOOR, block = 0 อยู่ติดผืนน้ำ T.WATER)
    const piers = [
      { x0: 103, x1: 108, side: 'north' },
      { x0: 128, x1: 133, side: 'north' },
      { x0: 52, x1: 56, side: 'north' },
      { x0: 162, x1: 166, side: 'north' },
      { x0: 108, x1: 112, side: 'south' },
      { x0: 124, x1: 128, side: 'south' }
    ];
    piers.forEach(p => {
      for (let x = p.x0; x <= p.x1; x++) {
        const cy = riverCenterY(x), hw = riverHalfWidth(x);
        const py = p.side === 'north' ? (cy - hw) : (cy + hw);
        const sy = p.side === 'north' ? (cy - hw - 1) : (cy + hw + 1);
        if (inb(x, py)) { M.terrain[idx(x, py)] = T.FLOOR; M.block[idx(x, py)] = 0; }
        if (inb(x, sy)) { M.terrain[idx(x, sy)] = T.FLOOR; M.block[idx(x, sy)] = 0; }
      }
    });

    // 7.5 สร้างเขตพื้นที่ตกปลา 3 เขตของธารน้ำปราณทักษิณ (ไม่ทับร่องน้ำที่เป็น T.WATER)
    function addRiverZone(type, id, x, y, w, h, zoneId, fishCoords, relaxCoords) {
      const b = {
        n: M.buildings.length,
        id,
        type,
        zoneId,
        x,
        y,
        w,
        h,
        yard: 0,
        open: true,
        level: 1,
        hp: 100,
        nameTh: BTYPES[type].nameTh,
        inside: [],
        stations: [],
        door: { x: x + (w >> 1), y: y + 1 },
        area: { x, y, w, h }
      };
      for (let yy = y; yy < y + h; yy++) {
        for (let xx = x; xx < x + w; xx++) {
          if (inb(xx, yy)) M.owner[idx(xx, yy)] = b.n;
        }
      }
      fishCoords.forEach((pt, i) => {
        const py = pt.y != null ? pt.y : (riverCenterY(pt.x) - riverHalfWidth(pt.x) - 1);
        const fx = pt.x, fy = py;
        M.block[idx(fx, fy)] = 0;
        if (M.terrain[idx(fx, fy)] === T.WATER) M.terrain[idx(fx, fy)] = T.FLOOR;
        const s = { id: sid++, bid: b.n, bkey: b.id, kind: 'fish', zoneId, x: fx, y: fy, inside: false, occ: null, n: i };
        M.stations.push(s);
        b.stations.push(s.id);
      });
      relaxCoords.forEach((pt, i) => {
        const py = pt.y != null ? pt.y : (riverCenterY(pt.x) - riverHalfWidth(pt.x) - 2);
        const rx = pt.x, ry = py;
        M.block[idx(rx, ry)] = 0;
        const s = { id: sid++, bid: b.n, bkey: b.id, kind: 'relax', zoneId, x: rx, y: ry, inside: false, occ: null, n: i };
        M.stations.push(s);
        b.stations.push(s.id);
      });
      M.buildings.push(b);
      M.byId[b.id] = b;
      return b;
    }

    // เขต 1: ท่าน้ำธารปราณทักษิณ (กลาง — river_central)
    addRiverZone(
      'river_dock', 'river_dock', 98, 162, 42, 16, 'river_central',
      [
        { x: 104, y: riverCenterY(104) - riverHalfWidth(104) },
        { x: 107, y: riverCenterY(107) - riverHalfWidth(107) },
        { x: 112, y: riverCenterY(112) - riverHalfWidth(112) - 1 },
        { x: 124, y: riverCenterY(124) - riverHalfWidth(124) - 1 },
        { x: 129, y: riverCenterY(129) - riverHalfWidth(129) },
        { x: 132, y: riverCenterY(132) - riverHalfWidth(132) },
        { x: 110, y: riverCenterY(110) + riverHalfWidth(110) },
        { x: 126, y: riverCenterY(126) + riverHalfWidth(126) }
      ],
      [
        { x: 101, y: riverCenterY(101) - riverHalfWidth(101) - 2 },
        { x: 114, y: riverCenterY(114) - riverHalfWidth(114) - 2 },
        { x: 122, y: riverCenterY(122) - riverHalfWidth(122) - 2 },
        { x: 135, y: riverCenterY(135) - riverHalfWidth(135) - 2 }
      ]
    );

    // เขต 2: คุ้งน้ำไผ่หยก (ตะวันตก — river_west)
    addRiverZone(
      'river_west', 'river_west', 44, 162, 38, 16, 'river_west',
      [
        { x: 48, y: riverCenterY(48) - riverHalfWidth(48) - 1 },
        { x: 53, y: riverCenterY(53) - riverHalfWidth(53) },
        { x: 55, y: riverCenterY(55) - riverHalfWidth(55) },
        { x: 68, y: riverCenterY(68) - riverHalfWidth(68) - 1 },
        { x: 75, y: riverCenterY(75) - riverHalfWidth(75) - 1 },
        { x: 60, y: riverCenterY(60) + riverHalfWidth(60) + 1 }
      ],
      [
        { x: 50, y: riverCenterY(50) - riverHalfWidth(50) - 2 },
        { x: 72, y: riverCenterY(72) - riverHalfWidth(72) - 2 }
      ]
    );

    // เขต 3: วังน้ำศิลาคราม (ตะวันออก — river_east)
    addRiverZone(
      'river_east', 'river_east', 154, 161, 40, 18, 'river_east',
      [
        { x: 158, y: riverCenterY(158) - riverHalfWidth(158) - 1 },
        { x: 163, y: riverCenterY(163) - riverHalfWidth(163) },
        { x: 165, y: riverCenterY(165) - riverHalfWidth(165) },
        { x: 178, y: riverCenterY(178) - riverHalfWidth(178) - 1 },
        { x: 186, y: riverCenterY(186) - riverHalfWidth(186) - 1 },
        { x: 170, y: riverCenterY(170) + riverHalfWidth(170) + 1 }
      ],
      [
        { x: 160, y: riverCenterY(160) - riverHalfWidth(160) - 2 },
        { x: 182, y: riverCenterY(182) - riverHalfWidth(182) - 2 }
      ]
    );

    // 7.6 ตกแต่งทิวทัศน์ริมธารน้ำปราณทักษิณ (ไม่ทับเส้นทางเดินหรือจุดตกปลา)
    const keep = new Set();
    M.stations.forEach(st => {
      if (st.y >= H_BASE - 4) {
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) keep.add((st.y + dy) * W + st.x + dx);
      }
    });
    // โคมไฟหัวสะพานทั้ง 3 แห่ง
    [[115, 165], [121, 165], [115, 175], [121, 175], [61, 166], [65, 166], [171, 165], [175, 165]].forEach(([lx, ly]) => {
      if (inb(lx, ly) && M.block[idx(lx, ly)] === 0) {
        M.decor.push({ x: lx, y: ly, kind: 'lantern', s: 1, r: 0, walk: true });
      }
    });
    // ป่าไผ่ โขดหินริมน้ำ และดอกไม้ริมตลิ่ง
    for (let i = 0; i < 220; i++) {
      const x = rrng.int(6, W - 7), y = rrng.int(H_BASE, H - 4), k = idx(x, y);
      if (M.block[k] !== 0 || M.terrain[k] !== T.GRASS || keep.has(k)) continue;
      if (x >= 113 && x <= 123) continue; // เว้นทางหลวงทิศใต้
      if (x >= 60 && x <= 66) continue;   // เว้นสะพานตะวันตก
      if (x >= 170 && x <= 176) continue; // เว้นสะพานตะวันออก
      const cy = riverCenterY(x), hw = riverHalfWidth(x);
      if (Math.abs(y - cy) <= hw + 2) continue; // เว้นตลิ่งและทางเดินเลียบน้ำ
      const kind = x < 95 ? (rrng.chance(0.65) ? 'bamboo' : 'pine') : x > 145 ? (rrng.chance(0.55) ? 'rock' : 'pine') : (rrng.chance(0.4) ? 'blossom' : 'bamboo');
      M.block[k] = 3;
      M.decor.push({ x, y, kind, s: 0.82 + rrng.next() * 0.45, r: rrng.next() });
    }
    for (let i = 0; i < 120; i++) {
      const x = rrng.int(10, W - 10), y = rrng.int(H_BASE, H - 4), k = idx(x, y);
      if (M.block[k] !== 0 || (M.terrain[k] !== T.GRASS && M.terrain[k] !== T.MOSS)) continue;
      M.decor.push({ x, y, kind: 'flower', s: 1, r: rrng.next(), walk: true });
    }

    return sid;
  }

  function stationSpots(M, b, kind, count, where, rng) {
    const out = [];
    const free = (x, y) => M.inb(x, y) && M.block[y * W + x] === 0;
    if (where === 'in') {
      // สถานีภายในอาคาร: ใช้ตำแหน่งประตู (ผู้ใช้จะถูกซ่อนในอาคาร) — กระจายตำแหน่งเสมือนบนผืนหลังคา
      for (let i = 0; i < count; i++) out.push({ x: b.door.x, y: b.door.y, v: i });
      return out;
    }
    if (where === 'yard') {
      const cols = Math.max(2, Math.floor((b.w + 2) / 3));
      const rows = Math.max(1, b.yard - 1);
      let i = 0;
      for (let r = 0; r < rows + 1 && out.length < count; r++) for (let c = 0; c < cols && out.length < count; c++) {
        const x = b.x + 1 + Math.round(c * (b.w - 2) / Math.max(1, cols - 1)), y = b.y + b.h + 1 + r * 2;
        if (free(x, y) && !out.some(o => o.x === x && o.y === y)) out.push({ x, y });
        i++;
      }
      // เติมถ้าไม่พอ
      for (let x = b.x; out.length < count && x < b.x + b.w; x++) { const y = b.y + b.h; if (free(x, y) && !out.some(o => o.x === x && o.y === y)) out.push({ x, y }); }
      return out;
    }
    if (where === 'shore') { // รอบสระ
      const r = [];
      for (let x = b.x; x < b.x + b.w; x++) { r.push({ x, y: b.y + b.h - 1 }); }
      for (let i = 0; i < count; i++) { const p = r[Math.floor((i + 0.5) * r.length / count)]; out.push({ x: p.x, y: p.y }); }
      return out;
    }
    // open: กระจายในพื้นที่
    const cols = Math.max(2, Math.ceil(Math.sqrt(count * b.w / b.h)));
    const rows = Math.ceil(count / cols);
    for (let i = 0; i < count; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      const x = b.x + 2 + Math.floor(c * (b.w - 4) / Math.max(1, cols - 1)), y = b.y + 2 + Math.floor(r * (b.h - 4) / Math.max(1, rows - 1));
      out.push({ x: Math.min(b.x + b.w - 2, x), y: Math.min(b.y + b.h - 2, y) });
    }
    return out;
  }

  function bfsToRoad(M, sx, sy, isRoadish) {
    const prev = new Int32Array(W * H).fill(-1);
    const q = [sy * W + sx]; prev[sy * W + sx] = sy * W + sx;
    let qi = 0;
    while (qi < q.length) {
      const k = q[qi++], x = k % W, y = (k / W) | 0;
      if (isRoadish(x, y) && !(x === sx && y === sy)) {
        const path = []; let c = k; while (c !== sy * W + sx) { path.push([c % W, (c / W) | 0]); c = prev[c]; } return path;
      }
      for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
        const nx = x + dx, ny = y + dy; if (!M.inb(nx, ny)) continue; const nk = ny * W + nx;
        if (prev[nk] !== -1 || M.block[nk] !== 0) continue;
        prev[nk] = k; q.push(nk);
      }
      if (qi > 12000) break;
    }
    return null;
  }

  function placeDecor(M, rng) {
    const idx = M.idx;
    const near = (x, y, r, f) => { for (let yy = y - r; yy <= y + r; yy++) for (let xx = x - r; xx <= x + r; xx++) { if (M.inb(xx, yy) && f(M.terrain[idx(xx, yy)], M.block[idx(xx, yy)], xx, yy)) return true; } return false; };
    const keep = new Set(); M.stations.forEach(st => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) keep.add((st.y + dy) * W + st.x + dx); });
    M.buildings.forEach(b => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) keep.add((b.door.y + dy) * W + b.door.x + dx); });
    // ต้นไม้ภายในกำแพง (ห่างถนน/อาคาร) + แนวไผ่
    for (let i = 0; i < 2600; i++) {
      const x = rng.int(M.wall.x0 + 2, M.wall.x1 - 2), y = rng.int(M.wall.y0 + 2, M.wall.y1 - 3), k = idx(x, y);
      if (M.block[k] !== 0 || M.terrain[k] !== T.GRASS || keep.has(k)) continue;
      if (near(x, y, 1, (t, b) => t === T.ROAD || t === T.FLOOR || t === T.PLAZA || t === T.ARCH || b === 1 || t === T.FARM || t === T.DIRT)) continue;
      // เว้นที่ดินว่างสำหรับขยายให้โล่งกว่า
      const inPlot = MAP.PLOTS.some(p => x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h);
      if (inPlot && rng.chance(0.82)) continue;
      const kind = rng.chance(0.18) ? 'bamboo' : rng.chance(0.2) ? 'blossom' : rng.chance(0.15) ? 'rock' : 'pine';
      M.block[k] = 3; M.decor.push({ x, y, kind, s: 0.8 + rng.next() * 0.5, r: rng.next() });
    }
    // ดอกไม้เล็ก ๆ (ไม่กีดขวาง)
    for (let i = 0; i < 700; i++) {
      const x = rng.int(M.wall.x0 + 2, M.wall.x1 - 2), y = rng.int(M.wall.y0 + 2, M.wall.y1 - 3), k = idx(x, y);
      if (M.block[k] !== 0 || M.terrain[k] !== T.GRASS) continue;
      M.decor.push({ x, y, kind: 'flower', s: 1, r: rng.next(), walk: true });
    }
    // ต้นไม้นอกประตู (คงขอบเขต H_BASE - 2 เพื่อรักษา state ของ rng เดิม)
    for (let i = 0; i < 260; i++) {
      const x = rng.int(98, 140), y = rng.int(M.wall.y1 + 2, H_BASE - 2), k = idx(x, y);
      if (M.block[k] !== 0 || M.terrain[k] !== T.GRASS) continue;
      if (x >= 114 && x <= 122) continue;
      M.block[k] = 3; M.decor.push({ x, y, kind: rng.chance(0.3) ? 'rock' : 'pine', s: 0.8 + rng.next() * 0.5, r: rng.next() });
    }
    // ตะเกียงข้างถนนหลัก
    for (let y = 52 + OY; y < 112 + OY; y += 8) { M.decor.push({ x: 92 + OX, y, kind: 'lantern', s: 1, r: 0, walk: true }); M.decor.push({ x: 99 + OX, y, kind: 'lantern', s: 1, r: 0, walk: true }); }
    // น้ำพุกลางลาน
    M.decor.push({ x: 96 + OX, y: 67 + OY, kind: 'fountain', s: 1, r: 0 });
    for (let yy = 66 + OY; yy <= 68 + OY; yy++) for (let xx = 95 + OX; xx <= 97 + OX; xx++) M.block[idx(xx, yy)] = 1;
    // ธงตามหน้าตำหนักใหญ่
    const mh = M.byId.main_hall;
    M.decor.push({ x: mh.x + 2, y: mh.y + mh.h + 2, kind: 'banner', s: 1, r: 0, walk: true });
    M.decor.push({ x: mh.x + mh.w - 3, y: mh.y + mh.h + 2, kind: 'banner', s: 1, r: 0, walk: true });
  }

  /* -------- A* -------- */
  const DX8 = new Int8Array([1, -1, 0, 0, 1, 1, -1, -1]);
  const DY8 = new Int8Array([0, 0, 1, -1, 1, -1, 1, -1]);
  const DC8 = new Float32Array([1, 1, 1, 1, 1.4142, 1.4142, 1.4142, 1.4142]);
  MAP.nearestFree = function (M, x, y) {
    x = Math.floor(x); y = Math.floor(y);
    if (M.inb(x, y) && M.block[y * W + x] === 0) return { x, y };
    for (let r = 1; r < 12; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const nx = x + dx, ny = y + dy; if (M.inb(nx, ny) && M.block[ny * W + nx] === 0) return { x: nx, y: ny };
    }
    return null;
  };
  let gScore = null, came = null, stamp = null, closed = null, curStamp = 0, sharedHeap = null;
  MAP.findPath = function (M, sx, sy, gx, gy) {
    sx = Math.floor(sx); sy = Math.floor(sy); gx = Math.floor(gx); gy = Math.floor(gy);
    const s = MAP.nearestFree(M, sx, sy), t = MAP.nearestFree(M, gx, gy);
    if (!s || !t) return null;
    sx = s.x; sy = s.y; gx = t.x; gy = t.y;
    if (sx === gx && sy === gy) return [[gx, gy]];
    const key = ((sx << 24) | (sy << 16) | (gx << 8) | gy) >>> 0;
    let pc = M._pc; if (!pc) pc = M._pc = new Map();
    if (pc.has(key)) return pc.get(key);
    const sInWall = sx > 22 && sx < 218 && sy > 18 && sy < 131;
    const gInWall = gx > 22 && gx < 218 && gy > 18 && gy < 131;
    if (sInWall !== gInWall) {
      const p1 = sInWall ? MAP.findPath(M, sx, sy, 118, 130) : MAP.findPath(M, sx, sy, 118, 132);
      const p2 = sInWall ? MAP.findPath(M, 118, 132, gx, gy) : MAP.findPath(M, 118, 130, gx, gy);
      const joined = (p1 && p2) ? p1.concat([[118, 131]], p2) : null;
      if (pc.size >= 12000) { let ev = 0; for (const k of pc.keys()) { pc.delete(k); if (++ev >= 2000) break; } }
      pc.set(key, joined);
      return joined;
    }
    const totalCells = M.W * M.H;
    if (!gScore || gScore.length !== totalCells) {
      gScore = new Float32Array(totalCells);
      came = new Int32Array(totalCells);
      stamp = new Uint32Array(totalCells);
      closed = new Uint32Array(totalCells);
      sharedHeap = new U.MinHeap();
      curStamp = 0;
    }
    curStamp++;
    const heap = sharedHeap; heap.clear();
    const cost = M.cost;
    const sk = sy * W + sx, gk = gy * W + gx;
    gScore[sk] = 0; stamp[sk] = curStamp; came[sk] = -1; heap.push(0, sk);
    let found = false, it = 0;
    while (heap.size) {
      const k = heap.pop(); if (k === gk) { found = true; break; }
      if (closed[k] === curStamp) continue; closed[k] = curStamp;
      if (++it > 65000) break;
      const x = k % W, y = (k / W) | 0, gk0 = gScore[k];
      for (let d = 0; d < 8; d++) {
        const dx = DX8[d], dy = DY8[d], nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const nk = ny * W + nx; if (cost[nk] === 0) continue;
        if (dx !== 0 && dy !== 0 && (cost[y * W + nx] === 0 || cost[ny * W + x] === 0)) continue; // กันตัดมุม
        const ng = gk0 + DC8[d] * cost[nk];
        if (stamp[nk] !== curStamp || ng < gScore[nk]) {
          stamp[nk] = curStamp; gScore[nk] = ng; came[nk] = k;
          let hDist;
          const nInWall = nx > 22 && nx < 218 && ny > 18 && ny < 131;
          if (nInWall !== gInWall) {
            const dx1 = Math.abs(nx - 118), dy1 = Math.abs(ny - 132);
            const dx2 = Math.abs(118 - gx), dy2 = Math.abs(132 - gy);
            hDist = ((dx1 + dy1) - 0.5858 * (dx1 < dy1 ? dx1 : dy1)) + ((dx2 + dy2) - 0.5858 * (dx2 < dy2 ? dx2 : dy2));
          } else {
            const hx = Math.abs(nx - gx), hy = Math.abs(ny - gy);
            hDist = (hx + hy) - 0.5858 * (hx < hy ? hx : hy);
          }
          heap.push(ng + 0.8 * hDist, nk);
        }
      }
    }
    MAP._lastIt = it; if (!found) { if (pc.size >= 12000) { let ev = 0; for (const k of pc.keys()) { pc.delete(k); if (++ev >= 2000) break; } } pc.set(key, null); return null; }
    const path = []; let c = gk; while (c !== -1) { path.push([c % W, (c / W) | 0]); c = came[c]; }
    path.reverse();
    if (pc.size >= 12000) {
      let ev = 0;
      for (const k of pc.keys()) { pc.delete(k); if (++ev >= 2000) break; }
    }
    pc.set(key, path);
    return path;
  };
  MAP.speedAt = (M, x, y) => { x = Math.floor(x); y = Math.floor(y); if (!M.inb(x, y)) return 1; return SPEED[M.terrain[y * W + x]] || 1; };
  MAP.blocked = (M, x, y) => { x = Math.floor(x); y = Math.floor(y); return !M.inb(x, y) || M.block[y * W + x] !== 0; };
  MAP.stationsOf = (M, b) => b.stations.map(i => M.stations[i]);
  MAP.isOutsideWall = (M, x, y) => {
    if (!M || !M.wall) return true;
    const w = M.wall;
    return x < w.x0 || x > w.x1 || y < w.y0 || y > w.y1;
  };
  // Include the gate threshold and approach so safe trips have no unprotected gap.
  MAP.SAFE_BELT = Object.freeze({ x0: 80, x1: 156, y0: 132, y1: 156 });
  MAP.RIVER_BELT = Object.freeze({ x0: 40, x1: 198, y0: 157, y1: 184 });
  MAP.isInSafeBelt = (x, y) => {
    const sb = MAP.SAFE_BELT;
    return x >= sb.x0 && x <= sb.x1 && y >= sb.y0 && y <= sb.y1;
  };
  MAP.isInRiverBelt = (x, y) => {
    const rb = MAP.RIVER_BELT;
    return x >= rb.x0 && x <= rb.x1 && y >= rb.y0 && y <= rb.y1;
  };
  MAP.hasAdjacentWater = (M, x, y) => {
    x = Math.floor(x); y = Math.floor(y);
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (M.inb(nx, ny) && M.terrain[ny * M.W + nx] === T.WATER) return true;
    }
    return false;
  };

  g.MAP = MAP;
  if (typeof module === 'object' && module.exports) module.exports = MAP;
})(typeof globalThis !== 'undefined' ? globalThis : this);
