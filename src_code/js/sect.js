/* sect.js — โครงสร้างสำนัก: ระดับศิษย์ ตำแหน่ง นโยบายที่มาจากนิสัยเจ้าสำนักจริง การประชุมสภา การสืบทอด
 * หลักการ: เจ้าสำนักตัดสินใจจาก "ตัวตน" (HC) ของเขา → นโยบาย → ผลต่อทั้งสำนัก (ดู policy ที่ถูกอ่านโดย ai/events/economy) */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js'), HC = g.HC, CULT = g.CULT, ECO = g.ECO, MAP = g.MAP;
  const clamp = U.clamp;
  const SECT = {};

  SECT.RANKS = [
    { id: 0, nameTh: 'ผู้ฝึกหัด', dorm: 'dorm_outer', stipend: 2, color: '#9aa3a8' },
    { id: 1, nameTh: 'ศิษย์นอก', dorm: 'dorm_outer', stipend: 5, color: '#8fae8b' },
    { id: 2, nameTh: 'ศิษย์ใน', dorm: 'dorm_inner', stipend: 12, color: '#5ea6d9' },
    { id: 3, nameTh: 'ศิษย์แกนกลาง', dorm: 'dorm_core', stipend: 25, color: '#b07ae0' },
    { id: 4, nameTh: 'ผู้อาวุโส', dorm: 'elder_quarters', stipend: 55, color: '#d9534f' },
    { id: 5, nameTh: 'รองเจ้าสำนัก', dorm: 'elder_quarters', stipend: 85, color: '#f0a030' },
    { id: 6, nameTh: 'เจ้าสำนัก', dorm: 'elder_quarters', stipend: 130, color: '#f6d44a' }
  ];
  SECT.POSTS = {
    martial: { nameTh: 'ผู้อาวุโสหอยุทธ์', hall: 'training_ground', desc: 'ฝึกศิษย์ จัดประลอง กำหนดหลักสูตรยุทธ์' },
    alchemy: { nameTh: 'ผู้อาวุโสหอโอสถ', hall: 'alchemy', desc: 'กำหนดการปรุงโอสถ ดูแลคุณภาพและสต็อกยา' },
    forge: { nameTh: 'ผู้อาวุโสโรงหลอม', hall: 'forge', desc: 'ดูแลหลอมอาวุธ เกราะ ยันต์ ค่ายกล' },
    scripture: { nameTh: 'ผู้อาวุโสหอคัมภีร์', hall: 'scripture', desc: 'คุมตำราวิชา วิจัยตำรับใหม่ ควบคุมการเข้าถึงวิชา' },
    discipline: { nameTh: 'ผู้อาวุโสหอวินัย', hall: 'discipline', desc: 'บังคับใช้กฎ ลงโทษ สืบสวนทุจริต' },
    treasury: { nameTh: 'ผู้อาวุโสหอคลัง', hall: 'treasury', desc: 'คุมศิลาวิญญาณ จัดสรรเบี้ยหวัด สั่งซื้อวัตถุดิบ' },
    mission: { nameTh: 'ผู้อาวุโสหอภารกิจ', hall: 'mission_hall', desc: 'จัดคณะเดินทางนอกสำนัก ค้าขาย ล่าอสูร หาศิษย์ใหม่' },
    guard: { nameTh: 'หัวหน้าองครักษ์', hall: 'gate', desc: 'เฝ้าประตู สำนัก ตรวจตรา ป้องกันศัตรู' },
    registry: { nameTh: 'ผู้อาวุโสหอทะเบียน', hall: 'main_hall', desc: 'พิจารณาผู้สมัครเข้าสำนัก จัดทำทะเบียนศิษย์ แทนเจ้าสำนัก' },
    healer: { nameTh: 'หมอหลวงสำนัก', hall: 'infirmary', desc: 'รักษาผู้บาดเจ็บ ดูแลสุขภาพทั้งสำนัก' }
  };
  SECT.POST_IDS = Object.keys(SECT.POSTS);
  SECT.rankOf = npc => SECT.RANKS[npc.rank];
  SECT.title = npc => npc.rank === 6 ? 'เจ้าสำนัก' : npc.rank === 5 ? 'รองเจ้าสำนัก' : npc.post ? SECT.POSTS[npc.post].nameTh : npc.assist ? 'ผู้ช่วย' + SECT.POSTS[npc.assist].nameTh.replace(/^ผู้อาวุโส|^หัวหน้า|^หมอหลวง/, '') : SECT.RANKS[npc.rank].nameTh;

  /* ---------- สไตล์การปกครอง = ฟังก์ชันของตัวตน ---------- */
  function mix(npc, list) { // list: ['path', w] (w<0 = กลับค่า)
    let s = 0, wsum = 0;
    list.forEach(([p, w]) => { const v = HC.eff(npc, p); s += (w >= 0 ? v : 100 - v) * Math.abs(w); wsum += Math.abs(w); });
    return clamp(s / wsum, 0, 100);
  }
  SECT.styleOf = npc => {
    const d = HC.derived(npc);
    const st = {
      openness: mix(npc, [['personality.trustfulness', .3], ['personality.empathy', .2], ['personality.curiosity', .25], ['personality.caution', -.2], ['personality.pride', -.15]]),
      strictness: mix(npc, [['personality.discipline', .3], ['personality.integrity', .15], ['personality.aggression', .2], ['personality.empathy', -.25], ['personality.pride', .1], ['personality.composure', .05]]),
      meritocracy: mix(npc, [['personality.rationality', .3], ['personality.integrity', .3], ['values.familyClan', -.2], ['personality.loyalty', -.05], ['intellect.judgement', .15]]),
      expansion: mix(npc, [['personality.ambition', .3], ['personality.courage', .2], ['values.powerStatus', .25], ['personality.aggression', .1], ['personality.caution', -.2]]),
      generosity: mix(npc, [['personality.empathy', .35], ['values.wealthResource', -.3], ['values.familyClan', .1], ['personality.integrity', .1], ['personality.trustfulness', .15]]),
      secrecy: mix(npc, [['personality.caution', .3], ['personality.trustfulness', -.25], ['personality.pride', .15], ['values.powerStatus', .15], ['personality.curiosity', -.1]]),
      risk: d.riskTolerance
    };
    const raw = {
      martial: HC.eff(npc, 'values.martialPeak') * .6 + HC.eff(npc, 'personality.aggression') * .2 + HC.eff(npc, 'interests.combat') * .2,
      craft: HC.eff(npc, 'values.knowledgeCraft') * .45 + HC.eff(npc, 'personality.creativity') * .2 + (HC.eff(npc, 'interests.alchemy') + HC.eff(npc, 'interests.forging')) * .175,
      scholar: HC.eff(npc, 'personality.curiosity') * .35 + HC.eff(npc, 'personality.rationality') * .25 + HC.eff(npc, 'interests.scholarship') * .4,
      commerce: HC.eff(npc, 'values.wealthResource') * .5 + HC.eff(npc, 'aptitudes.socialCommerce') * .25 + HC.eff(npc, 'interests.trade') * .25,
      faith: HC.eff(npc, 'values.honorLegacy') * .35 + HC.eff(npc, 'values.sectDuty') * .35 + HC.eff(npc, 'interests.worship') * .3
    };
    let tot = 0; const f = {};
    Object.keys(raw).forEach(k => { f[k] = Math.pow(Math.max(5, raw[k]) / 50, 3); tot += f[k]; });
    Object.keys(f).forEach(k => f[k] /= tot);
    st.focus = f;
    return st;
  };
  SECT.initPolicy = W => {
    const m = W.byId[W.sect.masterId]; const t = SECT.styleOf(m);
    return JSON.parse(JSON.stringify(t));
  };
  SECT.targetPolicy = W => {
    const m = W.byId[W.sect.masterId], dp = W.byId[W.sect.deputyId];
    const els = SECT.POST_IDS.map(p => W.byId[W.sect.posts[p]]).filter(Boolean);
    const sm = SECT.styleOf(m), sd = dp ? SECT.styleOf(dp) : sm;
    const se = els.map(SECT.styleOf);
    const out = { focus: {} };
    ['openness', 'strictness', 'meritocracy', 'expansion', 'generosity', 'secrecy', 'risk'].forEach(k => {
      const e = se.length ? se.reduce((s, x) => s + x[k], 0) / se.length : sm[k];
      out[k] = sm[k] * 0.78 + sd[k] * 0.14 + e * 0.08;
    });
    Object.keys(sm.focus).forEach(k => { const e = se.length ? se.reduce((s, x) => s + x.focus[k], 0) / se.length : sm.focus[k]; out.focus[k] = sm.focus[k] * 0.78 + (dp ? sd.focus[k] : sm.focus[k]) * 0.14 + e * 0.08; });
    return out;
  };
  SECT.policyLabel = (k, v) => {
    const t = v >= 72 ? 'สูงมาก' : v >= 58 ? 'สูง' : v >= 42 ? 'กลาง' : v >= 28 ? 'ต่ำ' : 'ต่ำมาก';
    return t;
  };
  SECT.POLICY_TH = { openness: 'เปิดรับคนนอก', strictness: 'เข้มงวดกฎ', meritocracy: 'ยึดความสามารถ', expansion: 'ขยายอิทธิพล', generosity: 'ใจกว้างแจกจ่าย', secrecy: 'หวงวิชา', risk: 'กล้าเสี่ยง' };
  SECT.FOCUS_TH = { martial: 'ยุทธ์', craft: 'หัตถศิลป์', scholar: 'ปราชญ์', commerce: 'ค้าขาย', faith: 'ศรัทธา-สืบทอด' };

  /* ---------- ตำแหน่ง ---------- */
  SECT.relevance = (post, n) => {
    const e = p => HC.eff(n, p), sk = n.h.skills;
    const martial = Math.max(sk.SWORD, sk.BLADE, sk.SPEAR, sk.FIST_PALM, sk.BODY_REFINING);
    const stage = n.cult ? n.cult.stage : 0;
    switch (post) {
      case 'martial': return martial * .35 + e('aptitudes.combat') * .2 + e('social.teaching') * .2 + stage * 6 + e('personality.discipline') * .1;
      case 'alchemy': return sk.ALCHEMY * .45 + e('aptitudes.crafting') * .2 + e('intellect.reasoning') * .1 + e('interests.alchemy') * .1 + stage * 3;
      case 'forge': return sk.FORGING * .4 + (sk.ARRAY + sk.TALISMAN) * .1 + e('aptitudes.crafting') * .2 + e('physiology.dexterity') * .1 + stage * 3;
      case 'scripture': return sk.SCRIPTURE * .35 + e('intellect.comprehension') * .25 + e('intellect.memory') * .15 + e('values.knowledgeCraft') * .1 + stage * 3;
      case 'discipline': return e('personality.integrity') * .25 + e('personality.discipline') * .2 + e('social.intimidation') * .15 + e('intellect.perceptiveness') * .15 + martial * .1 + stage * 4 + e('personality.empathy') * -.05 + 5;
      case 'treasury': return e('intellect.numeracy') * .25 + sk.trading * .2 + sk.administration * .25 + e('personality.integrity') * .2 + e('personality.caution') * .1;
      case 'mission': return e('intellect.planning') * .25 + e('social.leadership') * .2 + sk.survival * .15 + sk.diplomacy * .1 + e('intellect.judgement') * .2 + stage * 3;
      case 'guard': return martial * .25 + e('intellect.perceptiveness') * .2 + e('social.leadership') * .15 + e('personality.courage') * .2 + stage * 6;
      case 'registry': return e('intellect.judgement') * .25 + e('intellect.readPeople') * .25 + sk.administration * .2 + e('personality.integrity') * .15 + e('personality.empathy') * .1 + stage * 2;
      case 'healer': return sk.MEDICINE * .45 + e('personality.empathy') * .2 + sk.ALCHEMY * .1 + e('aptitudes.crafting') * .1 + e('affinities.MEDICINE') * .1;
    }
    return 0;
  };
  SECT.holder = (W, post) => { const id = W.sect.posts[post]; return id ? W.byId[id] : null; };
  SECT.alive = n => n && !n.dead;
  SECT.appointScore = (W, post, n, by) => {
    const pol = W.sect.policy, rel = by ? SECT.relationScore(by, n) : 0;
    const merit = SECT.relevance(post, n) + (n.rank >= 3 ? 8 : 0) + (n.merit || 0) * 0.03;
    const meritK = 0.35 + pol.meritocracy / 100 * 0.65;
    return merit * meritK + rel * (1 - meritK) * 0.55 + (n.cult ? n.cult.stage * 2 : 0) - (n.h.state.heartDemon > 40 ? 6 : 0);
  };
  SECT.relationScore = (a, b) => { const r = a.h.mind.relations[b.id]; return r ? r.a * 0.6 + r.t * 0.2 + r.r * 0.2 : 0; };
  SECT.eligible = (W, post, n) => { const small = W.npcs.length < 14; return !n.dead && !n.away && !n.sealed && n.rank >= (small ? 1 : 2) && n.id !== W.sect.masterId && n.id !== W.sect.deputyId && !n.post && (n.cult ? n.cult.stage >= (small ? 1 : 2) : n.rank >= 3) && !n.exiled; };
  SECT.appoint = (W, post, n, why) => {
    const old = SECT.holder(W, post); if (old && old.id === n.id) return;
    if (old) { old.post = null; if (old.rank === 4) old.rank = 3; }
    n.post = post; n.assist = null; if (n.rank < 4) n.rank = 4;
    W.sect.posts[post] = n.id; n.sat = Math.min(100, (n.sat || 60) + 12);
    HC.experience(n, 'promoted', 1);
    SECT.reassignBed(W, n);
    W.log('appoint', n.h.name.given + ' ได้รับตำแหน่ง' + SECT.POSTS[post].nameTh + (why ? ' — ' + why : ''), [n.id]);
    SECT.resentOthers(W, post, n);
  };
  SECT.dismiss = (W, post, why) => {
    const n = SECT.holder(W, post); if (!n) return;
    n.post = null; if (n.rank === 4) n.rank = 3; W.sect.posts[post] = null;
    n.sat = Math.max(0, (n.sat || 60) - 18); HC.experience(n, 'punished_fair', 0.6);
    W.log('dismiss', n.h.name.given + ' พ้นจากตำแหน่ง' + SECT.POSTS[post].nameTh + (why ? ' — ' + why : ''), [n.id]);
  };
  // คนที่อยากได้ตำแหน่งแต่ไม่ได้ จะน้อยใจ (ขึ้นกับความทะเยอทะยานและความสามารถ) → ปมความขัดแย้งทางการเมือง
  SECT.resentOthers = (W, post, winner) => {
    W.npcs.forEach(n => {
      if (n.dead || n.id === winner.id || n.rank < 3 || n.post) return;
      const want = (HC.eff(n, 'personality.ambition') + HC.eff(n, 'values.powerStatus')) / 2;
      const rel = SECT.relevance(post, n), wrel = SECT.relevance(post, winner);
      if (want > 55 && rel > wrel - 6) {
        n.sat = Math.max(0, (n.sat || 60) - (want - 50) * 0.18);
        const r = SECT.rel(n, winner.id); r.v = Math.min(100, r.v + 6); r.a -= 3;
        if (rel > wrel + 4) W.log('politics', n.h.name.given + ' ไม่พอใจที่ ' + winner.h.name.given + ' ได้ตำแหน่ง' + SECT.POSTS[post].nameTh + ' ทั้งที่ตนเก่งกว่า', [n.id, winner.id]);
      }
    });
  };
  SECT.rel = (a, bid) => a.h.mind.relations[bid] || (a.h.mind.relations[bid] = { a: 0, t: 40, r: 30, l: 0, v: 0, n: 0, last: 0, bond: '' });

  SECT.reassignBed = (W, n) => { n.bed = null; };

  SECT.setRank = (W, n, rank, why) => {
    const old = n.rank; if (old === rank) return;
    n.rank = rank; n.sat = Math.min(100, (n.sat || 60) + (rank > old ? 10 : -15));
    W.log(rank > old ? 'promote' : 'demote', n.h.name.given + (rank > old ? ' เลื่อนเป็น' : ' ถูกลดเป็น') + SECT.RANKS[rank].nameTh + (why ? ' — ' + why : ''), [n.id]);
    HC.experience(n, rank > old ? 'promoted' : 'punished_fair', 0.8);
    if (rank > old) W.fame(2 + rank);
    n.bed = null;
  };

  /* ---------- ความพึงพอใจต่อสำนัก ---------- */
  SECT.satTarget = (W, n) => {
    const pol = W.sect.policy, e = p => HC.eff(n, p);
    let s = 55;
    // นโยบายตรงกับตัวตน
    s += (pol.generosity - 50) * (e('values.wealthResource') / 100 - 0.2) * 0.35;
    s -= Math.max(0, pol.strictness - 50) * (e('values.freedom') / 100) * 0.55;
    s += Math.max(0, pol.strictness - 50) * (e('personality.discipline') - 50) / 100 * 0.25;
    s += (pol.meritocracy - 50) * (e('personality.ambition') - 50) / 100 * 0.3;
    s -= Math.max(0, pol.secrecy - 50) * (e('personality.curiosity') - 50) / 100 * 0.3;
    s += (e('values.sectDuty') - 50) * 0.15 + (e('personality.loyalty') - 50) * 0.18;
    s += (n.h.state.mood) * 0.12;
    s += (W.sect.stipendOk ? 3 : -10);
    if (n.rank >= 3) s += 3;
    s -= Math.max(0, (n.h.state.stress - 50)) * 0.2;
    // รับรู้ความไม่ยุติธรรม
    s -= (n.grief || 0);
    return clamp(s, 5, 95);
  };

  /* ---------- เบี้ยหวัดรายเดือน ---------- */
  SECT.paySalaries = W => {
    const gen = (0.45 + W.sect.policy.generosity / 100 * 1.1) * 0.4; /* เบี้ยหวัดเป็นศิลาลดลง เพราะส่วนใหญ่จ่ายเป็นแต้มคุณูปการ (cpeco.js) */
    let total = 0; const list = [];
    W.npcs.forEach(n => { if (n.dead || n.exiled) return; const amt = Math.round(SECT.RANKS[n.rank].stipend * gen * (n.post ? 1.2 : 1)); list.push([n, amt]); total += amt; });
    // กรรมการคลัง: ถ้าเงินไม่พอ จ่ายตามอัตราส่วนและบันทึกผิดนัด
    const ok = W.sect.stones >= total;
    const k = ok ? 1 : Math.max(0, W.sect.stones) / total;
    list.forEach(([n, amt]) => { const pay = Math.round(amt * k); n.inv.stones += pay; });
    const paid = Math.round(total * k);
    W.sect.stones -= paid; W.sect.ledger.push({ t: W.t, amt: -paid, why: 'เบี้ยหวัดรายเดือน' }); if (W._tally) W._tally('-เบี้ยหวัดรายเดือน', paid);
    W.sect.stipendOk = ok;
    if (!ok) W.log('finance', 'คลังไม่พอจ่ายเบี้ยหวัดเต็ม จ่ายได้ ' + Math.round(k * 100) + '%', []);
    W.sect.lastPayroll = paid;
    return paid;
  };

  /* ---------- สภาประจำวัน: เจ้าสำนักตัดสินใจตามตัวตน ---------- */
  SECT.daily = W => {
    const S = W.sect, m = W.byId[S.masterId];
    if (!m || m.dead) { SECT.succession(W, 'เจ้าสำนักว่าง'); return; }
    if (S.sealedUntil && W.t < S.sealedUntil) { SECT.runByDeputy(W); return; }
    // 1) ตำแหน่งว่าง
    const appointer = m;
    SECT.POST_IDS.forEach(post => {
      const h = SECT.holder(W, post);
      if (h && h.dead) { S.posts[post] = null; }
    });
    const vacant = SECT.POST_IDS.filter(p => !SECT.holder(W, p));
    if (vacant.length && W.rng.chance(0.5)) {
      const post = (vacant.includes('registry') && W.npcs.length >= 6 && W.rng.chance(0.6)) ? 'registry' : W.rng.pick(vacant);
      const cands = W.npcs.filter(n => SECT.eligible(W, post, n));
      if (cands.length) {
        cands.sort((a, b) => SECT.appointScore(W, post, b, m) - SECT.appointScore(W, post, a, m));
        const win = cands[0], sc = SECT.appointScore(W, post, win, m);
        if (sc > (W.npcs.length < 14 ? 13 : 28)) {
          const fav = SECT.relationScore(m, win);
          SECT.appoint(W, post, win, fav > 30 && S.policy.meritocracy < 45 ? 'เจ้าสำนักไว้ใจเป็นพิเศษ' : 'ความสามารถสูงสุดในสำนัก');
        }
      }
    }
    // 2) รองเจ้าสำนัก
    if (!S.deputyId || !W.byId[S.deputyId] || W.byId[S.deputyId].dead) {
      S.deputyId = null;
      const cands = W.npcs.filter(n => !n.dead && !n.away && n.rank >= 3 && n.id !== m.id && n.cult && n.cult.stage >= 3);
      if (cands.length && W.rng.chance(0.5)) {
        cands.sort((a, b) => (SECT.relationScore(m, b) * (1 - S.policy.meritocracy / 100) + (b.cult.stage * 8 + SECT.relevance('mission', b) * .3) * (S.policy.meritocracy / 100 + .3)) - (SECT.relationScore(m, a) * (1 - S.policy.meritocracy / 100) + (a.cult.stage * 8 + SECT.relevance('mission', a) * .3) * (S.policy.meritocracy / 100 + .3)));
        const d = cands[0]; if (d.post) { S.posts[d.post] = null; d.post = null; }
        d.rank = 5; S.deputyId = d.id; d.sat = Math.min(100, (d.sat || 60) + 15); HC.experience(d, 'promoted', 1.2);
        W.log('appoint', d.h.name.given + ' ได้เป็นรองเจ้าสำนัก', [d.id]);
      }
    }
    // 3) เลื่อนขั้นศิษย์ (เจ้าสำนักเลือกตามนโยบาย)
    if (W.day % 3 === 0) SECT.reviewPromotions(W);
    SECT.processApplicants(W, m);
    // 4) การตัดสินใจเชิงนโยบายของเจ้าสำนัก
    SECT.masterDecision(W, m);
    // 5) หัวหน้าหอสั่งงานของตน
    SECT.hallHeads(W);
  };

  /* ---------- พิจารณาผู้สมัคร: ผู้อาวุโสหอทะเบียน (ถ้ามี) ไม่เช่นนั้นเจ้าสำนักตัดสินเอง ---------- */
  SECT.appraise = (W, who, n) => {
    const e = p => HC.eff(who, p), z = p => HC.eff(n, p);
    const truth = (z('aptitudes.cultivation') * 1.2 + z('aptitudes.comprehension') + z('intellect.learningSpeed') * .6 + z('personality.integrity') * .6 + z('personality.discipline') * .5 + z('physiology.endurance') * .3) / 4.2 + ((HC.ROOT_BY_ID[n.h.root.grade] || { tier: 1 }).tier * 4 - 4);
    const noise = W.rng.gauss(0, (100 - e('intellect.readPeople')) / 9 + 2);
    let bias = 0; // อคติของผู้พิจารณา
    bias += (e('personality.empathy') - 50) / 12 * (n.h.origin.cls === 'ยาจก' || /ยาก|ทาส/.test(n.h.origin.cls) ? 1 : 0.3); bias -= (e('personality.pride') - 50) / 14 * (z('aptitudes.cultivation') < 45 ? 1 : 0);
    return truth + noise + bias;
  };
  SECT.processApplicants = (W, m) => {
    const S = W.sect; const q = S.queue || (S.queue = []); if (!q.length) return;
    const reg = SECT.holder(W, 'registry'); const who = reg && !reg.away && !reg.dead ? reg : m;
    const pop = W.npcs.filter(n => !n.dead && !n.exiled).length;
    const cap = ['dorm_outer', 'dorm_inner', 'dorm_core'].reduce((s, id) => s + W.map.byId[id].stations.length, 0);
    const food = (ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3) / Math.max(1, pop + 1);
    const pol = S.policy; let handled = 0;
    for (let i = 0; i < q.length && handled < 1;) {
      const a = q[i]; handled++;
      const thr = 56 + (pol.meritocracy - 50) * 0.25 - (pol.openness - 50) * 0.3 - (pop < 8 ? 5 : pop < 16 ? 2 : 0) + (pop >= cap ? 30 : 0) + (food < 4 ? 14 : 0) + (pol.strictness - 50) * 0.1;
      const score = SECT.appraise(W, who, a);
      const ok = W.rng.next() < 1 / (1 + Math.exp(-(score - thr) / 6)) && pop < cap;
      const waited = W.day - a.joinDay;
      if (!ok && waited < 6 && pop < cap && W.rng.chance(0.4)) { i++; continue; } // ขอดูตัวอีกสักพัก
      q.splice(i, 1);
      if (ok) {
        g.SIM.register(W, a); a.joinDay = W.day; a.sat = 72; a.rank = 0; a.merit = 0; a.x = MAP.EXIT.x + .5 + W.rng.next(); a.y = MAP.EXIT.y + .5; a.px = a.x; a.py = a.y; a.travel = { to: 'home' }; a.path = null;
        W.log('recruit', a.h.name.given + ' ผ่านการพิจารณาของ' + (who === m ? 'เจ้าสำนัก ' : SECT.POSTS.registry.nameTh + ' ') + who.h.name.given + ' เข้าเป็นผู้ฝึกหัด (' + a.h.origin.cls + ' จาก' + a.h.origin.region + ')', [a.id, who.id]);
        who.merit += 1.5;
      } else { W.log('recruit', who.h.name.given + ' ไม่รับ ' + a.h.name.given + ' เข้าสำนัก' + (pop >= cap ? ' (ที่พักเต็ม)' : ''), [who.id]); W.fame(-0.05); }
    }
    for (let i = q.length - 1; i >= 0; i--) if (W.day - q[i].joinDay > 14) { W.log('recruit', q[i].h.name.given + ' รอนานเกินไปและเดินจากไป', []); q.splice(i, 1); }
  };

  SECT.runByDeputy = W => { const d = W.byId[W.sect.deputyId]; if (d && !d.dead) SECT.hallHeads(W); };

  SECT.reviewPromotions = W => {
    const S = W.sect, m = W.byId[S.masterId], mer = S.policy.meritocracy / 100;
    const cnt = r => W.npcs.filter(n => !n.dead && n.rank === r).length;
    const cap = { inner: 18, core: 8 };
    const cands = W.npcs.filter(n => !n.dead && !n.away && n.rank <= 2).map(n => {
      const stage = n.cult ? n.cult.stage : 0;
      const need = n.rank === 0 ? 1 : n.rank === 1 ? 2 : 3;
      const days = W.day - (n.joinDay || 0);
      const can = n.rank === 0 ? days >= 20 && (stage >= 1 || days >= 60) : stage >= need && days >= 40 + n.rank * 60 && n.merit >= (n.rank === 1 ? 60 : 160);
      const favor = SECT.relationScore(m, n);
      const score = can ? (stage * 10 + n.merit * 0.1) * (0.4 + mer * 0.6) + favor * (1 - mer) * 0.5 : -999;
      return { n, can, score };
    }).filter(x => x.can).sort((a, b) => b.score - a.score);
    for (const x of cands.slice(0, 2)) {
      const n = x.n;
      if (n.rank === 1 && cnt(2) >= cap.inner) continue;
      if (n.rank === 2 && cnt(3) >= cap.core) continue;
      SECT.setRank(W, n, n.rank + 1, n.rank === 0 ? 'ผ่านการทดลอง' : 'ผลงานและตบะถึงเกณฑ์');
    }
  };

  /* ---------- การตัดสินใจเชิงนโยบายของเจ้าสำนัก ---------- */
  SECT.masterDecision = (W, m) => {
    const S = W.sect, e = p => HC.eff(m, p), pol = S.policy;
    S.cd = S.cd || {};
    const opts = [];
    const cd = k => (S.cd[k] || 0) > W.day;
    const pop = W.npcs.filter(n => !n.dead).length;
    const bedCap = ['dorm_outer', 'dorm_inner', 'dorm_core'].reduce((s, id) => s + W.map.byId[id].stations.length, 0);
    // งานเลี้ยง
    if (!cd('banquet')) opts.push({ k: 'banquet', u: (e('interests.socializing') + e('values.familyClan') + e('personality.empathy')) / 300 + (50 - W.avgMood) / 150 + (S.stones > 1500 ? .1 : -.3), run: () => SECT.banquet(W, m) });
    // ประลองยุทธ์
    if (!cd('tournament')) opts.push({ k: 'tournament', u: (e('values.martialPeak') + e('interests.combat') + e('values.powerStatus')) / 300 + pol.focus.martial * .3 - .1, run: () => SECT.tournament(W, m) });
    // ปิดด่าน
    if (!cd('seclusion') && m.cult && CULT.ready(m)) opts.push({ k: 'seclusion', u: .55 + (e('values.martialPeak') - 50) / 200, run: () => SECT.seclusion(W, m) });
    // ขยายอาคาร
    if (!cd('upgrade')) opts.push({ k: 'upgrade', u: (e('interests.building') + e('personality.ambition') + e('values.powerStatus')) / 400 + (pop > bedCap * 0.8 ? .35 : 0) + (S.stones > 3000 ? .2 : -.3), run: () => SECT.upgradeBuilding(W, m) });
    // วิจัยตำรับ
    if (!cd('research')) opts.push({ k: 'research', u: (e('values.knowledgeCraft') + e('interests.scholarship') + e('personality.curiosity')) / 300 + pol.focus.scholar * .3 - .15, run: () => SECT.startResearch(W, m) });
    // เปิดรับศิษย์
    if (!cd('drive')) opts.push({ k: 'drive', u: (pol.openness - 40) / 120 + (pop < 28 ? .3 : pop > bedCap * .85 ? -.5 : 0) + (pol.expansion - 50) / 200, run: () => SECT.recruitDrive(W, m) });
    // รับศิษย์ส่วนตัว
    if (!cd('discipleOf')) opts.push({ k: 'discipleOf', u: (e('social.teaching') + e('personality.empathy') + e('values.honorLegacy')) / 300 - (m.h.life.family.disciples.length > 1 ? .4 : 0), run: () => SECT.takePersonalDisciple(W, m) });
    // ตรวจทุจริต (เจ้าสำนักเข้มงวด/ระแวง)
    if (!cd('audit')) opts.push({ k: 'audit', u: (e('personality.caution') + e('personality.integrity') + (100 - e('personality.trustfulness'))) / 300 - .2 + (S.suspicion || 0) / 100, run: () => SECT.audit(W, m) });
    if (!opts.length) return;
    opts.forEach(o => o.u += W.rng.float(-.08, .08));
    opts.sort((a, b) => b.u - a.u);
    const pick = opts[0];
    if (pick.u > 0.36 && W.rng.chance(0.35)) {
      S.cd[pick.k] = W.day + ({ banquet: 60, tournament: 90, seclusion: 30, upgrade: 75, research: 40, drive: 60, discipleOf: 120, audit: 50 }[pick.k] || 30);
      pick.run();
    }
  };

  SECT.banquet = (W, m) => {
    const cost = Math.round(W.npcs.filter(n => !n.dead).length * 6);
    if (!ECO.pay(W, cost, 'งานเลี้ยงสำนัก')) return;
    W.sect.festival = { until: W.t + 6 * 60, kind: 'banquet', at: 'plaza' };
    W.log('decision', m.h.name.given + ' ประกาศจัดงานเลี้ยงที่ลานกลาง (ใช้ ' + cost + ' ศิลา) เพื่อสร้างขวัญกำลังใจ', [m.id]);
    W.npcs.forEach(n => { if (!n.dead) { n.sat = Math.min(100, (n.sat || 60) + 3); } });
  };
  SECT.tournament = (W, m) => {
    W.sect.tournament = { start: W.t + 24 * 60, state: 'announce', rounds: 0, entrants: [], winnerId: null, prize: Math.round(80 + W.sect.policy.generosity) };
    W.log('decision', m.h.name.given + ' ประกาศจัดประลองยุทธ์สำนักในอีก 1 วัน รางวัล ' + W.sect.tournament.prize + ' ศิลา', [m.id]);
  };
  SECT.seclusion = (W, m) => {
    const d = 12 + W.rng.int(0, 12);
    W.sect.sealedUntil = W.t + d * 1440; m.sealed = true; m.sealEnd = W.sect.sealedUntil;
    W.log('decision', m.h.name.given + ' ปิดด่านเพื่อทะลวงขั้น ' + d + ' วัน รองเจ้าสำนักและผู้อาวุโสดูแลกิจการ', [m.id]);
  };
  SECT.upgradeBuilding = (W, m) => {
    const pop = W.npcs.filter(n => !n.dead).length;
    const wants = ['dorm_outer', 'meditation_hall', 'alchemy', 'forge', 'herb_garden', 'farm', 'mine', 'canteen', 'infirmary', 'training_ground'];
    let best = null, bs = -1;
    wants.forEach(id => {
      const b = W.map.byId[id]; if (b.level >= 3) return;
      const cost = 600 * b.level * b.level;
      if (W.sect.stones < cost + 800) return;
      let s = W.rng.next() * .2;
      if (id === 'dorm_outer' && pop > b.stations.length * 0.9) s += 1;
      if (id === 'meditation_hall') s += W.sect.policy.focus.martial * .6 + .25;
      if (id === 'alchemy') s += HC.eff(m, 'interests.alchemy') / 150;
      if (id === 'forge') s += HC.eff(m, 'interests.forging') / 150;
      if (id === 'farm' && ECO.count(W, 'grain') + ECO.count(W, 'meal') / 3 < pop * 3) s += .9;
      if (id === 'mine') s += W.sect.policy.focus.commerce * .6;
      if (id === 'training_ground') s += W.sect.policy.focus.martial * .5;
      if (s > bs) { bs = s; best = { id, b, cost }; }
    });
    if (!best) return;
    if (!ECO.pay(W, best.cost, 'ขยาย' + best.b.nameTh)) return;
    best.b.building = { until: W.t + 8 * 1440, to: best.b.level + 1 };
    W.log('decision', m.h.name.given + ' สั่งขยาย' + best.b.nameTh + ' เป็นระดับ ' + (best.b.level + 1) + ' (ใช้ ' + best.cost + ' ศิลา ใช้เวลา 8 วัน)', [m.id]);
  };
  SECT.startResearch = (W, m) => {
    const S = W.sect; if (S.research) return;
    if (S.recipeTier >= 6) return;
    const head = SECT.holder(W, 'scripture');
    const cost = 400 * S.recipeTier;
    if (!ECO.pay(W, cost, 'วิจัยตำรับระดับ ' + (S.recipeTier + 1))) return;
    S.research = { tier: S.recipeTier + 1, progress: 0, need: 900 * S.recipeTier, lead: head ? head.id : m.id };
    W.log('decision', m.h.name.given + ' สั่งวิจัยตำรับระดับ ' + (S.recipeTier + 1) + ' (หอคัมภีร์รับผิดชอบ)', [m.id]);
  };
  SECT.recruitDrive = (W, m) => {
    W.sect.driveUntil = W.day + 20;
    W.log('decision', m.h.name.given + ' ประกาศเปิดรับศิษย์ใหม่ 20 วัน', [m.id]);
  };
  SECT.takePersonalDisciple = (W, m) => {
    const c = W.npcs.filter(n => !n.dead && n.rank >= 1 && n.rank <= 3 && !n.mentor && n.id !== m.id);
    if (!c.length) return;
    c.sort((a, b) => (HC.derived(b).cultivationTalent + SECT.relationScore(m, b)) - (HC.derived(a).cultivationTalent + SECT.relationScore(m, a)));
    const d = c[0]; d.mentor = m.id; m.h.life.family.disciples.push(d.id); d.h.life.family.master = m.id;
    const r = SECT.rel(d, m.id); r.r = Math.min(100, r.r + 25); r.a += 15; const r2 = SECT.rel(m, d.id); r2.a += 15; r2.r += 10;
    d.sat = Math.min(100, (d.sat || 60) + 12);
    W.log('decision', m.h.name.given + ' รับ ' + d.h.name.given + ' เป็นศิษย์ส่วนตัว', [m.id, d.id]);
  };
  SECT.audit = (W, m) => {
    const disc = SECT.holder(W, 'discipline'); const tre = SECT.holder(W, 'treasury');
    W.log('decision', m.h.name.given + ' สั่งตรวจบัญชีคลังโดยละเอียด', [m.id]);
    if (tre && tre.embezzled > 0) {
      const eye = disc ? HC.eff(disc, 'intellect.perceptiveness') : 40;
      if (W.rng.next() < clamp(0.35 + eye / 150 + W.sect.policy.strictness / 300, 0.2, 0.9)) SECT.exposeEmbezzle(W, tre, m);
    }
  };
  SECT.exposeEmbezzle = (W, tre, by) => {
    const amt = tre.embezzled; tre.embezzled = 0;
    W.log('scandal', 'ตรวจพบ ' + tre.h.name.given + ' ยักยอกคลังรวม ' + Math.round(amt) + ' ศิลา!', [tre.id]);
    SECT.punish(W, tre, 3, 'ยักยอกทรัพย์สำนัก', by);
    ECO.earn(W, Math.round(amt * 0.6), 'ยึดคืนจากผู้ยักยอก');
    W.sect.suspicion = Math.max(0, (W.sect.suspicion || 0) - 30);
  };

  /* ---------- ลงโทษ ---------- */
  SECT.punish = (W, n, sev, why, by) => {
    const pol = W.sect.policy, k = 0.6 + pol.strictness / 100 * 0.8;
    sev = Math.max(1, Math.min(4, Math.round(sev * k)));
    const mer = W.sect.policy.meritocracy;
    const fair = !!why;
    let txt = '';
    if (sev === 1) { txt = 'ว่ากล่าวตักเตือน'; HC.feel(n, { mood: -6 }); n.merit = Math.max(0, n.merit - 8); }
    else if (sev === 2) { txt = 'กักบริเวณ/ทำงานชดใช้ 3 วัน'; n.punished = W.t + 3 * 1440; n.merit = Math.max(0, n.merit - 25); HC.feel(n, { mood: -14 }); }
    else if (sev === 3) {
      txt = 'ถอดตำแหน่ง/ลดขั้นและจำคุก 7 วัน'; n.punished = W.t + 7 * 1440; n.merit = Math.max(0, n.merit - 60);
      if (n.post) SECT.dismiss(W, n.post, why); if (n.rank >= 3) SECT.setRank(W, n, Math.max(1, n.rank - 1), why);
    } else { txt = 'ขับออกจากสำนัก'; SECT.expel(W, n, why); }
    n.jail = sev >= 3 && sev < 4 ? W.t + 7 * 1440 : n.jail;
    W.log('punish', n.h.name.given + ' ถูกลงโทษ: ' + txt + ' (' + why + ')', [n.id].concat(by ? [by.id] : []));
    HC.experience(n, sev >= 3 && !fair ? 'punished_unfair' : 'punished_fair', sev * 0.5);
    n.sat = Math.max(0, (n.sat || 60) - sev * 7 + HC.eff(n, 'personality.integrity') * 0.03);
    if (by && by.id !== n.id) { const r = SECT.rel(n, by.id); r.a -= sev * 4; r.v += sev * 3; }
    // ผู้อื่นสังเกตความเข้มงวด
    W.npcs.forEach(o => { if (!o.dead && o.id !== n.id) { const near = SECT.relationScore(o, n); if (near > 30) o.sat = Math.max(0, (o.sat || 60) - sev * 0.8); if (HC.eff(o, 'personality.integrity') > 60 && sev >= 2) o.sat = Math.min(100, (o.sat || 60) + 0.5); } });
  };
  SECT.expel = (W, n, why) => {
    if (n.post) { W.sect.posts[n.post] = null; n.post = null; }
    n.exiled = true; n.rank = 0; n.leave = { t: W.t, why: 'ถูกขับ' };
    W.log('expel', n.h.name.given + ' ถูกขับออกจากสำนัก (' + why + ')', [n.id]);
  };

  /* ---------- คำสั่งสำรองคลังและจัดการของขาดแคลน (v1.10.6) ---------- */
  SECT.ensureDirectives = W => {
    const S = W.sect;
    if (!S) return;
    if (!S.reserveDirectives) {
      S.reserveDirectives = {
        minGrainDays: 14,
        minMealReserve: 20,
        expeditionMealCap: 18,
        expeditionMinSafetyMeal: 15,
        medicine: {
          "P:BASIC_HP": 4,
          "P:BASIC_WOUND": 3,
          "P:BASIC_DETOX": 2,
          "P:BASIC_CALM": 2
        },
        gearReserve: { WEAPON: 2, ARMOR: 2, ACCESSORY: 1 }
      };
    }
    if (!Array.isArray(S.shortageDirectives)) S.shortageDirectives = [];
    if (!Array.isArray(S.welfareHistory)) S.welfareHistory = [];
  };

  SECT.updateReserveDirectives = W => {
    SECT.ensureDirectives(W);
    const S = W.sect, pop = Math.max(1, W.npcs.filter(n => !n.dead).length);
    const tr = SECT.holder(W, "treasury") || W.byId[S.masterId];
    const m = W.byId[S.masterId];
    const caution = tr ? (HC.eff(tr, "personality.caution") * 0.6 + (m ? HC.eff(m, "personality.caution") * 0.4 : 50)) : 50;
    const gen = S.policy ? S.policy.generosity : 50;

    const grainDays = Math.round(clamp(12 + (caution - 50) / 10 + (50 - gen) / 15, 8, 24));
    const mealReserve = Math.round(clamp(pop * (0.8 + (caution - 50) / 100), 10, 60));
    const safetyMeal = Math.max(6, Math.round(mealReserve * 0.65));

    S.reserveDirectives.minGrainDays = grainDays;
    S.reserveDirectives.minMealReserve = mealReserve;
    S.reserveDirectives.expeditionMinSafetyMeal = safetyMeal;
    S.reserveDirectives.expeditionMealCap = Math.max(6, Math.min(24, Math.round(6 + (gen - 50) / 10)));
    S.reserveDirectives.medicine = {
      "P:BASIC_HP": Math.max(3, Math.round(pop * (0.15 + (caution - 50) / 300))),
      "P:BASIC_WOUND": Math.max(2, Math.round(pop * (0.12 + (caution - 50) / 350))),
      "P:BASIC_DETOX": Math.max(2, Math.round(pop * 0.08)),
      "P:BASIC_CALM": Math.max(2, Math.round(pop * 0.08))
    };
    S.reserveDirectives.gearReserve = {
      WEAPON: Math.max(1, Math.round(pop * 0.08)),
      ARMOR: Math.max(1, Math.round(pop * 0.08)),
      ACCESSORY: 1
    };
  };

  SECT.updateShortageDirectives = (W, hallWants) => {
    SECT.ensureDirectives(W);
    const S = W.sect, rd = S.reserveDirectives, pop = Math.max(1, W.npcs.filter(n => !n.dead).length);
    const directives = [];

    // 1. Provisions / Kitchen
    const curGrain = ECO.count(W, "grain");
    const targetGrain = pop * (rd.minGrainDays || 14);
    const grainDays = (curGrain * 3 + ECO.count(W, "meal")) / (pop * 3);
    if (curGrain < targetGrain) {
      directives.push({
        id: "grain",
        nameTh: "ข้าวสาร",
        kind: "provision",
        needed: targetGrain,
        current: curGrain,
        deficit: targetGrain - curGrain,
        priority: grainDays < 7 ? "critical" : "high",
        source: "canteen",
        reason: "สำรองอาหารความมั่นคง (ปัจจุบันพอใช้ " + grainDays.toFixed(1) + " วัน)",
        day: W.day
      });
    }

    const curMeal = ECO.count(W, "meal");
    const targetMeal = rd.minMealReserve || 20;
    if (curMeal < targetMeal) {
      directives.push({
        id: "meal",
        nameTh: "อาหารปรุงเสร็จ",
        kind: "provision",
        needed: targetMeal,
        current: curMeal,
        deficit: targetMeal - curMeal,
        priority: curMeal < (rd.expeditionMinSafetyMeal || 15) ? "critical" : "high",
        source: "canteen",
        reason: "สำรองอาหารสำหรับชีวิตประจำวันและการออกเดินทาง",
        day: W.day
      });
    }

    // 2. Essential Medicine Safety Reserves
    const medReserves = rd.medicine || {};
    Object.keys(medReserves).forEach(k => {
      const target = medReserves[k];
      const cur = ECO.count(W, k);
      if (cur < target) {
        directives.push({
          id: k,
          nameTh: ECO.name(k),
          kind: "medicine",
          needed: target,
          current: cur,
          deficit: target - cur,
          priority: cur === 0 ? "critical" : "high",
          source: "alchemy",
          reason: "โอสถพื้นฐานต่ำกว่าเกณฑ์สำรองฉุกเฉิน",
          day: W.day
        });
      }
    });

    // 3. Hall Production Inputs
    Object.keys(hallWants || {}).forEach(matId => {
      const needed = hallWants[matId];
      const cur = ECO.count(W, matId);
      if (cur < needed) {
        directives.push({
          id: matId,
          nameTh: ECO.name(matId),
          kind: "material",
          needed,
          current: cur,
          deficit: needed - cur,
          priority: cur === 0 ? "high" : "medium",
          source: "hall",
          reason: "ขาดแคลนสำหรับตำรับการผลิตประจำหอ",
          day: W.day
        });
      }
    });

    // 4. Bottlenecks / Breakthrough Needs
    const needSummary = ECO.needSummary(W);
    const btNeed = needSummary.btNeed || {};
    Object.keys(btNeed).forEach(k => {
      const count = btNeed[k];
      if (count > 0) {
        const pillRecipe = (JD.ITEMS.recipes || []).find(r => r.outType === "PILL" && r.effect && r.effect.btFor && (r.effect.btFor.path + ":" + r.effect.btFor.stage === k));
        if (pillRecipe) {
          const pillKey = pillRecipe.outItemId || ("P:" + pillRecipe.id);
          const have = ECO.count(W, pillKey);
          if (have < count) {
            directives.push({
              id: pillKey,
              nameTh: pillRecipe.outNameTh || ECO.name(pillKey),
              kind: "medicine",
              needed: count,
              current: have,
              deficit: count - have,
              priority: "high",
              source: "alchemy",
              reason: "ผู้บำเพ็ญติดคอขวดวิถี " + k + " (" + count + " คน)",
              day: W.day
            });
          }
        }
      }
    });

    const priWeight = { critical: 3, high: 2, medium: 1 };
    directives.sort((a, b) => (priWeight[b.priority] || 0) - (priWeight[a.priority] || 0) || b.deficit - a.deficit);
    S.shortageDirectives = directives;
  };

  /* ---------- หัวหน้าหอ: สั่งงานในหอของตน ---------- */
  SECT.hallHeads = W => {
    SECT.ensureDirectives(W);
    SECT.updateReserveDirectives(W);
    const S = W.sect; S.orders = S.orders || {};
    const hallWants = {};
    ['alchemy', 'forge'].forEach(h => {
      const head = SECT.holder(W, h);
      const o = ECO.pickOrder(W, h, head);
      S.orders[h] = o.recipe ? { rid: o.recipe.id, why: o.why } : null;
      Object.keys(o.want || {}).forEach(k => {
        hallWants[k] = Math.max(hallWants[k] || 0, o.want[k]);
      });
    });
    SECT.updateShortageDirectives(W, hallWants);
    // หอคลัง: สั่งซื้อวัตถุดิบ/เสบียงตามที่ขาด (ผ่านคาราวาน)
    const tre = SECT.holder(W, 'treasury');
    S.buyList = [];
    (S.shortageDirectives || []).slice(0, 8).forEach(d => {
      if (d.deficit > 0 && d.id) {
        S.buyList.push({ id: d.id, n: Math.min(12, Math.ceil(d.deficit)) });
      }
    });
    // ทุจริต
    if (tre && W.day % 10 === 0) {
      const gr = (HC.eff(tre, 'values.wealthResource') + (100 - HC.eff(tre, 'personality.integrity')) + HC.derived(tre).materialism) / 3 - 40;
      if (gr > 12 && W.rng.chance(clamp(gr / 90, 0.05, 0.6)) && W.sect.stones > 400) {
        const amt = Math.round(W.sect.stones * W.rng.float(0.004, 0.015) + 10);
        W.sect.stones -= amt; tre.inv.stones += amt; tre.embezzled = (tre.embezzled || 0) + amt;
        W.sect.ledger.push({ t: W.t, amt: -amt, why: 'บัญชีไม่ตรง(ยักยอก)' });
        W.sect.suspicion = (W.sect.suspicion || 0) + 4;
      }
      const disc = SECT.holder(W, 'discipline');
      if (disc && tre.embezzled > 0 && W.rng.chance(0.1 * (HC.eff(disc, 'intellect.perceptiveness') / 60) * (0.5 + W.sect.policy.strictness / 100))) SECT.exposeEmbezzle(W, tre, disc);
    }
  };

  /* ---------- สืบทอดตำแหน่งเจ้าสำนัก ---------- */
  SECT.succession = (W, why) => {
    const S = W.sect, old = W.byId[S.masterId];
    const cands = W.npcs.filter(n => !n.dead && !n.away && !n.exiled && n.rank >= 3 && n.id !== S.masterId);
    if (!cands.length) { W.log('crisis', 'สำนักไร้ผู้นำและไม่มีผู้สืบทอด!', []); return; }
    // ผู้ลงคะแนน: ผู้อาวุโสทุกคน + รอง
    const voters = W.npcs.filter(n => !n.dead && n.rank >= 4 && n.id !== S.masterId);
    const score = c => {
      const stage = c.cult ? c.cult.stage : 0;
      let tot = 0;
      voters.forEach(v => { if (v.id === c.id) { tot += 22; return; } const rel = SECT.relationScore(v, c); const vm = HC.eff(v, 'personality.rationality') / 100; tot += rel * .5 + (stage * 6 + CULT.power(c) / 400 + SECT.relevance('mission', c) * .1) * (.4 + vm * .6) + (c.id === S.deputyId ? 10 : 0) * (HC.eff(v, 'personality.loyalty') / 100) + HC.eff(c, 'social.leadership') * .15; });
      return tot / Math.max(1, voters.length);
    };
    cands.sort((a, b) => score(b) - score(a));
    const nm = cands[0];
    if (nm.post) { S.posts[nm.post] = null; nm.post = null; }
    if (S.deputyId === nm.id) S.deputyId = null;
    nm.rank = 6; S.masterId = nm.id; nm.sat = 90;
    if (old && !old.dead && old.rank === 6) { old.rank = 4; }
    W.log('succession', nm.h.name.given + ' ขึ้นเป็นเจ้าสำนักคนใหม่' + (why ? ' (' + why + ')' : ''), [nm.id]);
    W.fame(5);
    // คู่แข่งที่ไม่ชนะและทะเยอทะยานสูงจะไม่พอใจ
    cands.slice(1, 4).forEach(c => { const amb = HC.eff(c, 'personality.ambition'); if (amb > 60) { c.sat = Math.max(0, (c.sat || 60) - (amb - 50) * .4); const r = SECT.rel(c, nm.id); r.v += 12; r.a -= 6; } });
    S.policyShift = W.day;
  };

  /* ---------- รายเดือน ---------- */
  SECT.monthly = W => {
    const S = W.sect;
    // นโยบายค่อย ๆ เคลื่อนเข้าหาตัวตนผู้นำ (วัฒนธรรมสำนักเปลี่ยนจริง)
    const tp = SECT.targetPolicy(W);
    ['openness', 'strictness', 'meritocracy', 'expansion', 'generosity', 'secrecy', 'risk'].forEach(k => { S.policy[k] += (tp[k] - S.policy[k]) * 0.2; });
    Object.keys(tp.focus).forEach(k => { S.policy.focus[k] += (tp.focus[k] - S.policy.focus[k]) * 0.2; });
    // สถานการณ์ผลักนโยบาย
    if (S.recentRaid) { S.policy.strictness = Math.min(100, S.policy.strictness + 2); S.recentRaid = 0; }
    SECT.paySalaries(W);
    // รายได้ตามชื่อเสียง (ค่าคุ้มครองหมู่บ้านรอบเขา/ของกำนัล)
    const tribute = Math.round(150 + 26 * Math.sqrt(Math.max(0, S.fame)));
    S.fame *= 0.97;
    ECO.earn(W, tribute, 'ค่าคุ้มครองและของกำนัลจากชุมชนรอบเขา');
    ECO.monthlyMarket(W);
    // ค่าใช้จ่ายประจำ: ซ่อมบำรุง/เสบียงเครื่องใช้/ธูปเทียน ตามจำนวนคนและอาคาร + ข้าวเสื่อมคุณภาพ
    { const popN = W.npcs.filter(n => !n.dead).length, upkeep = Math.round(popN * 7 + W.map.buildings.reduce((s2, b) => s2 + b.level * 15, 0) * clamp((popN + 8) / 45, 0.3, 1));
      ECO.pay(W, Math.min(upkeep, Math.max(0, S.stones)), 'ค่าบำรุงรักษาสำนัก');
      const gr = ECO.count(W, 'grain'), lim = popN * 25; if (gr > lim) { const rot = Math.floor((gr - lim) * 0.15); if (rot > 0) ECO.take(W, 'grain', rot); }
      const ml = ECO.count(W, 'meal'), ml2 = popN * 8; if (ml > ml2) { const rot = Math.floor((ml - ml2) * 0.25); if (rot > 0) ECO.take(W, 'meal', rot); } }
    // ความพึงพอใจ
    W.npcs.forEach(n => { if (n.dead) return; const tgt = SECT.satTarget(W, n); n.sat = (n.sat == null ? tgt : n.sat + (tgt - n.sat) * 0.35); n.grief = Math.max(0, (n.grief || 0) - 2); });
    W.avgSat = W.npcs.filter(n => !n.dead).reduce((s, n) => s + n.sat, 0) / Math.max(1, W.npcs.filter(n => !n.dead).length);
    // เจ้าสำนักอายุมาก/ถูกท้าทาย
    const m = W.byId[S.masterId];
    if (m && !m.dead) SECT.checkChallenge(W, m);
    SECT.checkDesertion(W);
  };

  /* ท้าชิงตำแหน่ง: คนทะเยอทะยานมากและเก่งกว่า ไม่พอใจ → ท้าดวล (ผลลัพธ์จริงจากพลัง) */
  SECT.checkChallenge = (W, m) => {
    const mp = CULT.power(m);
    const c = W.npcs.filter(n => !n.dead && !n.away && n.id !== m.id && n.rank >= 4 && n.cult).filter(n => {
      const amb = (HC.eff(n, 'personality.ambition') + HC.eff(n, 'values.powerStatus')) / 2;
      const rel = SECT.relationScore(n, m);
      return amb > 66 && (n.sat || 60) < 48 && rel < 10 && CULT.power(n) > mp * 0.95 && HC.eff(n, 'personality.loyalty') < 62;
    });
    if (!c.length || !W.rng.chance(0.25)) return;
    const ch = W.rng.pick(c);
    W.log('challenge', ch.h.name.given + ' ท้าชิงตำแหน่งเจ้าสำนักจาก ' + m.h.name.given + ' !', [ch.id, m.id]);
    W.duelQueue = W.duelQueue || [];
    W.duelQueue.push({ a: ch.id, b: m.id, kind: 'leadership', serious: false });
  };
  SECT.checkDesertion = W => {
    W.npcs.forEach(n => {
      if (n.dead || n.away || n.exiled || n.rank >= 5 || n.left) return;
      const low = (n.sat || 60) < 22, stay = (W.day - (n.joinDay || 0)) > 60;
      if (low && stay && W.rng.chance(0.22 + (HC.eff(n, 'values.freedom') - 50) / 300 - (HC.eff(n, 'personality.loyalty') - 50) / 250)) {
        n.leave = { t: W.t, why: 'หนีออกจากสำนัก' }; n.exiled = true; n.deserting = true;
        W.log('desert', n.h.name.given + ' ผิดหวังกับสำนักและหนีออกไป', [n.id]);
      }
    });
  };

  SECT.canLearnTier = (W, n) => {
    const sec = W.sect.policy.secrecy / 100;
    const base = { 0: 1, 1: 2, 2: 3, 3: 5, 4: 6, 5: 7, 6: 7 }[n.rank];
    return Math.max(1, Math.round(base - sec * (n.rank < 4 ? 1.6 : 0.5) + (n.mentor ? 1 : 0)));
  };

  g.SECT = SECT;
  if (typeof module === 'object' && module.exports) module.exports = SECT;
})(typeof globalThis !== 'undefined' ? globalThis : this);
