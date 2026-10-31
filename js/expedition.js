/* expedition.js — โลกภายนอกที่ไม่มีฉาก: คณะเดินทางออกนอกสำนัก, คาราวาน, ผู้สมัครใหม่, สำนักเพื่อนบ้าน, ศัตรูบุกสำนัก, เหตุการณ์สุ่ม
 * คำนวณผลจาก "ตัวตนจริง" ของผู้เดินทาง (พลัง/โชค/การรับรู้/การเอาตัวรอด/นิสัยซื่อสัตย์-โลภ) ไม่สุ่มลอย ๆ */
(function (g) {
  'use strict';
  const U = g.U || require('./util.js'), HC = g.HC, MAP = g.MAP, CULT = g.CULT, ECO = g.ECO, SECT = g.SECT, AI = g.AI, COMBAT = g.COMBAT, JD = g.JD;
  const clamp = U.clamp;
  const X = {};
  const E = (n, p) => HC.eff(n, p);

  X.REGIONS = [
    { id: 'forest', nameTh: 'ป่าหมอกเขียว', danger: 1, terrain: 'forest', days: 3, beastMax: 3 },
    { id: 'plains', nameTh: 'ทุ่งราบเมฆา', danger: 1, terrain: 'plains', days: 3, beastMax: 2 },
    { id: 'mountain', nameTh: 'ทิวเขาศิลาคราม', danger: 2, terrain: 'mountain', days: 5, beastMax: 4 },
    { id: 'desert', nameTh: 'ทะเลทรายเพลิงอัสดง', danger: 3, terrain: 'desert', days: 8, beastMax: 5 },
    { id: 'ruins', nameTh: 'ซากนครโบราณ', danger: 4, terrain: 'mountain', days: 10, beastMax: 6 }
  ];
  X.MISSIONS = {
    fortune: { nameTh: 'ผจญโชควาสนา', icon: '🍀' },
    hunt: { nameTh: 'ล่าสัตว์อสูร', icon: '🐺' },
    gather: { nameTh: 'เก็บสมุนไพร/แร่ในแดนลึก', icon: '🌿' },
    trade: { nameTh: 'นำสินค้าไปค้าขาย', icon: '🐪' },
    diplomacy: { nameTh: 'เยือนสำนักพันธมิตร', icon: '🤝' },
    recruit: { nameTh: 'ตามหาผู้มีพรสวรรค์', icon: '🔎' },
    bounty: { nameTh: 'รับงานจ้างคุ้มกัน', icon: '🛡️' }
  };
  const SECT_NAMES = ['สำนักกระบี่เมฆขาว', 'สำนักบัวหยก', 'ตระกูลหลงเหมิน', 'สำนักเสือคำราม', 'หอสุริยาสีทอง', 'สำนักพิรุณหยิน', 'ศาลาฟ้าครามพิรุธ', 'สำนักมังกรหมอก'];
  X.initWorld = (W) => {
    const rng = W.rng; const names = rng.shuffle(SECT_NAMES.slice()).slice(0, 6);
    W.world = { sects: names.map((nm, i) => ({ id: 'S' + i, nameTh: nm, power: Math.round(rng.gauss(1, 0.35) * 100) / 100, attitude: Math.round(rng.gauss(0, 25)), style: rng.pick(['เป็นธรรม', 'โลภ', 'ทะนง', 'ใฝ่สงบ', 'ก้าวร้าว']), contact: 0 })), expeds: [], seq: 0, visitors: [] };
    W.threat = { alert: 0, roadBlocked: 0, raidCooldown: W.day + 40 };
  };

  /* ---------- อาสาไปภารกิจ (เรียกจากกิจกรรม errand) ---------- */
  X.volunteer = (W, n) => {
    if (n.away || n.dead) return;
    // ต้องการตัวเลือกชนิดภารกิจจากนิสัยและความถนัดจริง
    const opts = [];
    const e = p => E(n, p), pw = CULT.power(n);
    opts.push({ k: 'fortune', w: Math.max(0.1, (e('destiny.luck') - 35) / 40 + (e('temperament.sensationSeeking') - 40) / 40 + (e('interests.exploring') - 40) / 40 + (e('values.freedom') - 40) / 60) });
    if (pw > 60) opts.push({ k: 'hunt', w: Math.max(0.1, (e('interests.combat') - 35) / 30 + (e('personality.courage') - 40) / 50 + (e('values.wealthResource') - 40) / 80) });
    opts.push({ k: 'gather', w: Math.max(0.1, (e('interests.herbs') + e('interests.alchemy') + e('interests.labor') - 120) / 50 + ((n.h.skills.herbalism || 0) + (n.h.skills.mining || 0)) / 80) });
    if (n.rank >= 2) opts.push({ k: 'trade', w: Math.max(0.1, (e('interests.trade') - 35) / 30 + (e('aptitudes.socialCommerce') - 45) / 50) });
    if (n.rank >= 2) opts.push({ k: 'diplomacy', w: Math.max(0.1, (e('social.charisma') + e('interests.socializing') + e('social.diplomacy' in {} ? '' : 'personality.empathy') - 130) / 50) });
    if (n.rank >= 3) opts.push({ k: 'recruit', w: Math.max(0.1, (e('interests.teaching') - 35) / 30 + (e('values.sectDuty') - 45) / 50 + (e('intellect.judgement') - 45) / 60) });
    if (pw > 80) opts.push({ k: 'bounty', w: Math.max(0.1, (e('values.wealthResource') - 40) / 30 + (e('interests.combat') - 40) / 50) });
    const pick = W.rng.weighted(opts, o => o.w).k;
    // อนุมัติ: ผู้อาวุโสหอภารกิจ/เจ้าสำนักพิจารณาตามนโยบายและตัวตนของตน
    const approver = SECT.holder(W, 'mission') || W.byId[W.sect.masterId];
    let p = 0.6 + (W.sect.policy.expansion - 50) / 200 + (W.sect.policy.risk - 50) / 250 - (W.sect.policy.strictness - 50) / 300;
    if (pick === 'hunt' || pick === 'bounty') p += (E(approver, 'personality.courage') - 50) / 250;
    if (n.post && SECT.holder(W, n.post) === n && !n.assist) p -= 0.15;
    if (n.rank <= 1 && W.sect.policy.strictness > 65) p -= 0.15 + (E(approver, 'personality.caution') - 50) / 300;
    if (n.rank <= 1 && CULT.power(n) < 40) p -= 0.2;
    const aliveAway = W.npcs.filter(x => x.expId && !x.dead).length; if (aliveAway > W.npcs.length * 0.2) p -= 1.5;
    if (ECO.count(W, 'meal') < 4) p -= 0.5;
    if (W.threat.alert > 0) p -= 0.8;
    if (W.rng.next() > clamp(p, 0.05, 0.95)) { n.lastTrip = W.day - 6; HC.feel(n, { mood: -3 }); AI.mem(W, n, 'ถูกปฏิเสธไม่ให้ออกเดินทาง (' + X.MISSIONS[pick].nameTh + ')', 0.3); if (W.rng.chance(0.2)) W.log('mission', n.h.name.given + ' ขอไปภารกิจ「' + X.MISSIONS[pick].nameTh + '」แต่ไม่ได้รับอนุมัติ', [n.id]); return; }
    // เลือกร่วมคณะ
    const party = [n];
    const want = pick === 'hunt' || pick === 'bounty' ? 2 + (pw < 200 ? 1 : 0) : pick === 'trade' ? 1 : pick === 'fortune' ? (E(n, 'personality.caution') > 55 ? 1 : 0) : (E(n, 'temperament.sociability') > 55 ? 1 : 0);
    if (want > 0) {
      const cands = W.npcs.filter(x => x !== n && !x.dead && !x.away && !x.exiled && x.rank >= 1 && x.rank <= 4 && !(x.act && ['sleep', 'breakthrough', 'fight', 'sentence'].includes(x.act.id)) && !x.sealed && !(x.jail > W.t) && !(x.inj && x.inj.length) && !(x.post && x.rank >= 4));
      cands.forEach(c => { const r = n.h.mind.relations[c.id]; c._s = AI.compat(n, c) + (r ? r.a / 100 : 0) + (pick === 'hunt' ? CULT.power(c) / 400 : 0) + W.rng.next() * 0.3; });
      cands.sort((a, b) => b._s - a._s);
      for (const c of cands) { if (party.length > want) break; const acc = clamp(0.35 + c._s * 0.4 + (E(c, 'personality.courage') - 50) / 200 - (c.h.state.energy < 40 ? .3 : 0), 0.05, 0.9); if (c._s > 0.1 && W.rng.next() < acc) party.push(c); }
    }
    X.depart(W, party, pick);
  };

  X.depart = (W, party, kind, region) => {
    const rng = W.rng; const w = W.world;
    if (!party.length || party.some(n => n.dead || n.away || n.travel || n.expId)) return null;
    const lead = party[0];
    const maxStage = Math.max(...party.map(x => x.cult ? x.cult.stage : 0));
    const regs = X.REGIONS.filter(r => r.danger <= 1 + maxStage + (kind === 'fortune' ? 1 : 0) && (kind !== 'trade' && kind !== 'diplomacy' || r.danger <= 2));
    region = region || (g.CONTENT && g.CONTENT.chooseRegion(W, party, kind, regs)) || rng.weighted(regs, r => 1 + (kind === 'fortune' ? r.danger * 0.4 : 0) + (kind === 'gather' ? (E(lead, 'interests.herbs') > 55 ? (r.terrain === 'forest' || r.terrain === 'mountain' ? 1 : 0) : (r.terrain === 'mountain' ? 1 : 0)) : 0) + (kind === 'hunt' ? r.danger * 0.3 : 0));
    if (!region || !X.REGIONS.includes(region) || (region.minPower && party.reduce((v,n)=>v+CULT.power(n),0)<region.minPower)) return null;
    const days = Math.max(2, Math.round(region.days * (0.7 + rng.next() * 0.6) * (kind === 'trade' ? 1.1 : kind === 'recruit' ? 1.4 : 1)));
    // เสบียง: เอาอาหารจากคลังโดยคำนึงถึงเกณฑ์สำรองฉุกเฉิน (v1.10.6)
    if (g.SECT && g.SECT.ensureDirectives) g.SECT.ensureDirectives(W);
    const rd = W.sect && W.sect.reserveDirectives;
    const currentMeals = ECO.count(W, 'meal');
    const safetyReserve = (rd && rd.minMealReserve) || 15;
    const capPerDay = (rd && rd.expeditionMealCap) || 6;
    const plannedFood = party.length * Math.min(days, capPerDay);
    let takeMax = Math.max(0, currentMeals - safetyReserve);
    if (takeMax < party.length && currentMeals > 0) {
      takeMax = Math.min(currentMeals, party.length);
    }
    const taken = Math.min(plannedFood, takeMax);
    if (taken > 0) ECO.take(W, 'meal', taken);
    if (currentMeals - taken <= safetyReserve) {
      W.log('mission', 'คณะเดินทางเบิกเสบียง ' + taken + ' ชุด ทำให้เสบียงคลังเหลือ ' + (currentMeals - taken) + ' แตะเกณฑ์สำรองฉุกเฉิน (' + safetyReserve + ')', party.map(p => p.id));
    }
    const ex = { id: ++w.seq, kind, region: region.id, party: party.map(p => p.id), t0: W.t, ret: W.t + days * 1440 + rng.int(-300, 300), days, journal: [], carry: [], supplies: taken, done: false, state: 'leaving', lost: false };
    if (kind === 'trade') { // นำสินค้าไปขาย: ยาและอุปกรณ์ส่วนเกินในคลัง
      const sell = []; Object.keys(W.sect.stock).forEach(k => { if (ECO.isPill(k) && W.sect.stock[k] > 6 && ECO.pillInfo(k)) { const n = Math.floor((W.sect.stock[k] - 4) / 2); if (n > 0 && ECO.take(W, k, n)) sell.push({ id: k, n }); } });
      ex.carry = sell; if (!sell.length && (W.sect.stones < 1000)) { ex.kind = kind = 'gather'; }
    }
    w.expeds.push(ex);
    party.forEach(p => { AI.interruptFor(W, p); p.expId = ex.id; p.lastTrip = W.day; p.act = { id: 'idle', stage: 'do', left: 0, total: 0, ctx: {}, why: [] }; p.travel = { to: 'exit', ex: ex.id }; p.path = null; p.run = false; });
    W.log('mission', party.map(p => p.h.name.given).join('、') + ' ออกเดินทาง「' + X.MISSIONS[kind].nameTh + '」ไปยัง' + region.nameTh + ' (ราว ' + days + ' วัน)', party.map(p => p.id));
    return ex;
  };
  /* เดินไปที่ทางออกแล้วหายไปจากแผนที่ */
  X.travelStep = (W, n) => {
    const tv = n.travel; if (!tv) return false;
    if (tv.to === 'exit') {
      if (!n.path) { if (!AI.goTo(W, n, MAP.EXIT.x, MAP.EXIT.y)) { n.x = MAP.EXIT.x + .5; n.y = MAP.EXIT.y + .5; } }
      n.run = true;
      if (AI.stepMove(W, n) || Math.hypot(n.x - MAP.EXIT.x, n.y - MAP.EXIT.y) < 1.5) { n.away = true; n.travel = null; n.run = false; n.path = null; n.hidden = true; }
      return true;
    }
    if (tv.to === 'home') {
      if (!n.path) { if (!AI.goTo(W, n, MAP.GATE_IN.x, MAP.GATE_IN.y)) { n.x = MAP.GATE_IN.x + .5; n.y = MAP.GATE_IN.y + .5; } }
      if (AI.stepMove(W, n) || Math.hypot(n.x - MAP.GATE_IN.x, n.y - MAP.GATE_IN.y) < 1.5) { n.travel = null; n.path = null; n.run = false; n.act = { id: 'idle', stage: 'do', left: 0, total: 0, ctx: {}, why: [] }; }
      return true;
    }
    return false;
  };

  /* ---------- ตรวจครบกำหนดกลับ + คำนวณผล ---------- */
  X.hourly = W => {
    const w = W.world;
    w.expeds.forEach(ex => {
      if (ex.done) return;
      const members = ex.party.map(i => W.byId[i]).filter(m => m && !m.dead);
      if (!members.length) { ex.done = true; return; }
      if (ex.state === 'leaving' && members.every(m => m.away)) ex.state = 'away';
      if (ex.state === 'away' && W.t >= ex.ret) { X.resolve(W, ex, members); }
    });
    w.expeds = w.expeds.filter(e => !e.done || W.t - e.ret < 7 * 1440);
  };

  X.resolve = (W, ex, members) => {
    if (ex.done || ex.settlement || !members.length) return;
    const rng = W.rng; const reg = X.REGIONS.find(r => r.id === ex.region);
    const P = members.reduce((s, m) => s + CULT.power(m), 0);
    const perceive = Math.max(...members.map(m => E(m, 'intellect.perceptiveness'))), surv = Math.max(...members.map(m => m.h.skills.survival || 0)), luck = members.reduce((s, m) => s + E(m, 'destiny.luck'), 0) / members.length;
    const nEnc = Math.max(2, Math.round(ex.days * 0.7)); const out = { items: [], stones: 0, mats: {}, pills: {}, gear: [], techs: [], notes: [], rep: 0, newDisciples: 0 };
    const alive = members.slice(); let totalDmg = 0;
    const dangerMult = 0.6 + reg.danger * 0.35;
    for (let i = 0; i < nEnc && alive.length; i++) {
      const roll = rng.next();
      const wBeast = ex.kind === 'hunt' ? 0.7 : ex.kind === 'bounty' ? 0.5 : 0.3 * dangerMult, wFind = ex.kind === 'gather' ? 0.55 : ex.kind === 'fortune' ? 0.35 : 0.2, wFort = ex.kind === 'fortune' ? 0.3 : 0.05 + (luck - 40) / 800;
      const tot = wBeast + wFind + wFort + 0.2; const r = roll * tot;
      if (r < wBeast) {
        // เจอสัตว์อสูร: ใช้ตารางสัตว์ในข้อมูลเก่า เลือกระดับตามภูมิภาค
        const pwAll = alive.reduce((s, m) => s + CULT.power(m), 0) * (0.85 + rng.next() * 0.3);
        const bold = alive.reduce((s, m) => s + E(m, 'personality.courage'), 0) / alive.length;
        let pool = JD.BEASTS.species.filter(b => (reg.beasts && reg.beasts.length ? reg.beasts.includes(b.id) : !b.sourcePack) && b.tier <= reg.beastMax && b.tier >= Math.max(1, reg.beastMax - 3));
        if (ex.kind === 'hunt' || ex.kind === 'bounty') pool = pool.filter(b => b.cp <= pwAll * (0.6 + bold / 100 * 0.7));
        else pool = pool.filter(b => b.cp <= pwAll * 3);
        if (!pool.length) { ex.journal.push('เห็นร่องรอยสัตว์อสูรใหญ่เกินกำลัง จึงหลีกเลี่ยง'); continue; }
        const b = rng.pick(pool);
        const pw = pwAll;
        const bp = b.cp * (0.8 + rng.next() * 0.5);
        const p = pw / (pw + bp);
        const fled = ex.kind !== 'hunt' && p < 0.5 && rng.chance(0.5 + surv / 200);
        if (fled) { ex.journal.push('พบ' + b.nameTh + ' แต่หลบหนีได้'); continue; }
        const win = rng.next() < clamp((p - 0.25) * 1.6, 0.04, 0.97);
        if (win) {
          ex.journal.push('สังหาร' + b.nameTh + ' ได้');
          if (reg.sourcePack) { g.CONTENT.gather(W, ex, alive, out, reg, 'hunt', b); } else {
          const d = rng.pick(b.drops); out.mats[d] = (out.mats[d] || 0) + 1 + (rng.chance(0.4) ? 1 : 0);
          if (rng.chance(0.5)) { const d2 = rng.pick(b.drops); out.mats[d2] = (out.mats[d2] || 0) + 1; }
          }
          const dmgFrac = clamp((1 - p) * 0.55 + rng.next() * 0.1, 0.02, 0.6);
          const v = rng.pick(alive); const dm = CULT.hpMax(v) * dmgFrac; v.h.state.hp = Math.max(1, v.h.state.hp - dm); totalDmg += dmgFrac;
          if (dmgFrac > 0.25) AI.injure(W, v, dmgFrac > 0.45 ? 2 : 1, 'ถูก' + b.nameTh + 'ทำร้าย');
          alive.forEach(m => { HC.experience(m, 'victory', 0.2); m.stats = m.stats || {}; m.stats.kills = (m.stats.kills || 0) + (m === v ? 1 : 0); });
        } else {
          const v = rng.pick(alive); const dead = rng.chance(clamp((bp / (pw + bp) - 0.5) * 0.7, 0.01, 0.4) * (1 - E(v, 'destiny.luck') / 300) * (1 - surv / 250));
          ex.journal.push('พ่ายต่อ' + b.nameTh);
          if (dead) { out.notes.push(v.h.name.given + ' เสียชีวิตจากการต่อสู้กับ' + b.nameTh); AI.kill(W, v, 'ถูก' + b.nameTh + 'สังหารระหว่างภารกิจ'); alive.splice(alive.indexOf(v), 1); }
          else { AI.injure(W, v, 2, 'ถูก' + b.nameTh + 'ทำร้ายสาหัส'); v.h.state.hp = Math.max(1, CULT.hpMax(v) * 0.15); }
        }
      } else if (r < wBeast + wFind) {
        // New ecosystems consume finite shared site stocks, with actual hunt-only parts.
        if (reg.sourcePack) { g.CONTENT.gather(W, ex, alive, out, reg, 'gather'); continue; }
        // เก็บของป่า/แร่: ขึ้นกับการรับรู้, ทักษะ, ภูมิประเทศ
        const mats = JD.ITEMS.materials.filter(m => !m.sourcePack && (m.terrain === reg.terrain || (reg.terrain === 'plains' && m.terrain === 'forest')) && (m.category === 'HERB' || m.category === 'ORE') && m.tier <= Math.max(1, reg.danger + 1));
        if (!mats.length) continue;
        const m = rng.weighted(mats, x => 1 / (x.tier * x.tier));
        const q = 1 + Math.floor((perceive - 40) / 40 + Math.max(...alive.map(a => a.h.skills.herbalism || 0)) / 60 + rng.next());
        out.mats[m.id] = (out.mats[m.id] || 0) + Math.max(1, q); ex.journal.push('พบ' + m.nameTh);
        alive.forEach(a => HC.practice(a, m.category === 'HERB' ? 'herbalism' : 'mining', 0.4, 1));
      } else if (r < wBeast + wFind + wFort) {
        X.fortuneEvent(W, ex, alive, out, reg);
      } else {
        const ev = rng.pick(['storm', 'lost', 'traveler', 'bandits']);
        if (ev === 'storm') { ex.journal.push('เจอพายุ ต้องหลบอยู่หลายวัน'); alive.forEach(a => HC.feel(a, { stress: 4, energy: -10 })); }
        else if (ev === 'lost') { ex.journal.push('หลงทางในป่า'); ex.ret += Math.round(rng.int(60, 600)); }
        else if (ev === 'traveler') { ex.journal.push('พบนักเดินทางร่วมทาง แลกเปลี่ยนเรื่องราว'); alive.forEach(a => { HC.feel(a, { mood: 4, novelty: 8 }); HC.practice(a, 'diplomacy', 0.5, 1); }); out.rep += 0.2; }
        else { // โจรป่า
          const bp = (30 + reg.danger * 70) * (0.6 + rng.next()), pw = alive.reduce((s, m) => s + CULT.power(m), 0);
          if (pw > bp * 1.2 || rng.chance(clamp(pw / (pw + bp), 0.1, 0.9))) { ex.journal.push('ปราบโจรป่า'); const loot = Math.round(15 + rng.next() * 40 * reg.danger); out.stones += loot; HC.experience(rng.pick(alive), 'victory', 0.3); }
          else { const loss = Math.min(W.sect.stones * 0.02 + 20, 80); out.stones -= Math.round(loss); ex.journal.push('ถูกโจรปล้น'); const v = rng.pick(alive); AI.injure(W, v, 1, 'ถูกโจรทำร้าย'); }
        }
      }
    }
    // ผลเฉพาะภารกิจ
    if (ex.kind === 'trade') X.tradeResult(W, ex, alive, out);
    if (ex.kind === 'diplomacy') X.diplomacyResult(W, ex, alive, out);
    if (ex.kind === 'recruit') X.recruitResult(W, ex, alive, out);
    if (ex.kind === 'bounty') { const fee = Math.round((60 + P * 0.05) * (0.8 + rng.next() * 0.5) * (1 + (E(alive[0] || members[0], 'aptitudes.socialCommerce') - 50) / 200)); out.stones += fee; ex.journal.push('รับค่าจ้างคุ้มกัน ' + fee + ' ศิลา'); }
    g.CONTENT.complete(W, ex, alive, out, reg);
    ex.done = true; ex.out = out;
    // กลับสำนัก: แจกของ (ผู้ซื่อสัตย์ส่งเข้าคลัง ผู้โลภมีโอกาสเก็บเอง)
    if (alive.length) X.handover(W, ex, alive, out);
    alive.forEach(m => { m.away = false; m.hidden = false; m.x = MAP.EXIT.x + .5 + rng.gauss(0, 0.8); m.y = MAP.EXIT.y + .5; m.travel = { to: 'home' }; m.expId = null; m.path = null; m.run = false; m.h.state.satiety = Math.max(30, m.h.state.satiety); HC.experience(m, 'adventure', 0.6); m.merit += 8 + reg.danger * 3; AI.mem(W, m, 'กลับจากภารกิจ「' + X.MISSIONS[ex.kind].nameTh + '」 ณ ' + reg.nameTh + ' ' + (ex.journal.slice(-2).join(', ') || ''), 0.8); });
    const ppl = members.map(m => m.h.name.given).join('、');
    const brief = ex.kind === 'fortune' && out.notes.length ? out.notes.slice(0, 2).join(' / ') : Object.keys(out.mats).length || out.stones || out.gear.length ? ('ได้ ' + X.summarize(out)) : (ex.journal.slice(-1)[0] || 'ไม่ได้อะไรมากนัก');
    W.log('mission', ppl + ' กลับจากภารกิจ「' + X.MISSIONS[ex.kind].nameTh + '」 — ' + brief, members.map(m => m.id));
    W.fame(out.rep);
  };
  X.summarize = o => {
    const parts = []; const mk = Object.keys(o.mats); let tot = 0; mk.forEach(k => tot += o.mats[k]); if (tot) parts.push('วัตถุดิบ ' + tot + ' ชิ้น'); if (o.organs) { const ok = Object.keys(o.organs); let otot = 0; ok.forEach(k => otot += o.organs[k]); if (otot) parts.push('อวัยวะพิเศษ ' + otot + ' ชิ้น'); }
    if (o.stones) parts.push((o.stones > 0 ? '+' : '') + o.stones + ' ศิลา'); if (o.gear.length) parts.push(o.gear.map(g2 => g2.nameTh).join(',')); if (o.techs.length) parts.push('คัมภีร์วิชา'); const pk = Object.keys(o.pills); if (pk.length) parts.push('โอสถ ' + pk.reduce((s, k) => s + o.pills[k], 0) + ' เม็ด');
    return parts.join(', ');
  };
  X.fortuneEvent = (W, ex, alive, out, reg) => {
    if (g.CONTENT.fortune(W, ex, alive, out, reg)) return;
    const rng = W.rng; const v = rng.weighted(alive, a => 1 + E(a, 'destiny.luck') / 40 + E(a, 'intellect.perceptiveness') / 80);
    const luck = E(v, 'destiny.luck'); const kind = rng.weighted([
      { k: 'herb', w: 3 }, { k: 'pill', w: 1.5 + luck / 60 }, { k: 'gear', w: 1.0 + luck / 80 + reg.danger * 0.2 }, { k: 'scroll', w: 0.8 + E(v, 'intellect.comprehension') / 120 + reg.danger * 0.2 },
      { k: 'master', w: 0.4 + luck / 120 }, { k: 'spring', w: 0.8 + luck / 150 }, { k: 'curse', w: 0.6 + (50 - luck) / 100 }
    ], x => Math.max(0.05, x.w)).k;
    if (kind === 'herb') { const hs = JD.ITEMS.materials.filter(m => !m.sourcePack && m.category === 'HERB' && m.tier <= reg.danger + 2); const m = rng.pick(hs); const n = 1 + rng.int(0, 2); out.mats[m.id] = (out.mats[m.id] || 0) + n; ex.journal.push('พบสมุนไพรหายาก「' + m.nameTh + '」'); out.notes.push(v.h.name.given + ' พบ' + m.nameTh); }
    else if (kind === 'pill') { const ps = Object.keys(W.sect.stock).length ? ECO.recipesFor(W, ['ALCHEMY']).filter(r => r.outType === 'PILL' && r.tier <= reg.danger + 1) : []; if (ps.length) { const r = rng.pick(ps); const key = r.outItemId || 'P:' + r.id; out.pills[key] = (out.pills[key] || 0) + 1 + rng.int(0, 1); ex.journal.push('พบโอสถในซากโบราณ'); out.notes.push(v.h.name.given + ' พบ' + (r.outNameTh)); } }
    else if (kind === 'gear') { const rs = ECO.recipesFor(W, ['FORGING']).filter(r => r.outType === 'EQUIPMENT' && r.tier <= reg.danger + 2); if (rs.length) { const r = rng.pick(rs); const gear = ECO.mintGear(r, 1.1 + rng.next() * 0.3); gear.nameTh = (gear.nameTh || 'ศาสตรา') + ' (ของโบราณ)'; gear.q = 1.2; out.gear.push(gear); ex.journal.push('ขุดพบ' + gear.nameTh); out.notes.push(v.h.name.given + ' ขุดพบ' + gear.nameTh); } }
    else if (kind === 'scroll') { const lib = new Set(W.sect.library); const pool = JD.TECH.techniques.filter(t => !t.sourcePack && !lib.has(t.id) && t.tier <= Math.max(2, reg.danger + 2)); if (pool.length) { const t = rng.pick(pool); out.techs.push(t.id); ex.journal.push('ได้คัมภีร์「' + t.nameTh + '」'); out.notes.push(v.h.name.given + ' ได้คัมภีร์「' + t.nameTh + '」'); } }
    else if (kind === 'master') { const sk = AI.pickTeachSkill(v, v); HC.practice(v, sk, 6, 2.2); if (v.cult) CULT.gain(v, CULT.threshold(v) * 0.08); HC.experience(v, 'insight', 0.9); ex.journal.push('พบผู้เฒ่าลึกลับชี้แนะ'); out.notes.push(v.h.name.given + ' ได้รับการชี้แนะจากผู้เฒ่าลึกลับ'); }
    else if (kind === 'spring') { if (v.cult) { CULT.gain(v, CULT.threshold(v) * 0.15); } v.h.state.hp = CULT.hpMax(v); HC.trainBody(v, 'vitality' in {} ? '' : 'endurance', 4); HC.experience(v, 'insight', 0.5); ex.journal.push('พบสระปราณธรรมชาติ'); out.notes.push(v.h.name.given + ' พบสระปราณลับ ตบะก้าวหน้า'); }
    else { HC.feel(v, { stress: 10, mood: -6 }); v.h.state.heartDemon = clamp(v.h.state.heartDemon + 7, 0, 100); if (rng.chance(0.3)) AI.injure(W, v, 1, 'ถูกคำสาปโบราณ'); ex.journal.push('ต้องคำสาปโบราณ'); out.notes.push(v.h.name.given + ' ต้องคำสาปโบราณ'); }
    out.rep += 0.3;
  };
  X.tradeResult = (W, ex, alive, out) => {
    const best = Math.max(...alive.map(a => E(a, 'aptitudes.socialCommerce') + E(a, 'intellect.numeracy') + (a.h.skills.trading || 0)), 40) / 3;
    let sum = 0; (ex.carry || []).forEach(c => { const pr = ECO.price(W, c.id) * 0.85 * (0.85 + best / 200); sum += Math.round(pr * c.n); });
    if (sum) { out.stones += sum; ex.journal.push('ขายสินค้าได้ ' + sum + ' ศิลา'); }
    // ซื้อตามรายการคลังหากมีเงิน
    const buy = (W.sect.buyList || []).slice(0, 5); let spent = 0;
    buy.forEach(b => { const pr = Math.round(ECO.price(W, b.id) * 1.05 * (1.15 - best / 400)); const cost = pr * b.n; if (W.sect.stones + out.stones - spent >= cost + 100) { spent += cost; out.mats[b.id] = (out.mats[b.id] || 0) + b.n; } });
    if (spent) { out.stones -= spent; ex.journal.push('ซื้อเสบียง/วัตถุดิบใช้ ' + spent + ' ศิลา'); }
    alive.forEach(a => HC.practice(a, 'trading', 1.2, 1));
    out.rep += 0.1;
  };
  X.diplomacyResult = (W, ex, alive, out) => {
    const s = W.rng.weighted(W.world.sects, x => 1 + Math.max(0, 50 - x.attitude) / 50); const lead = alive[0]; if (!lead) return;
    const skill = alive.reduce((m, a) => Math.max(m, E(a, 'social.charisma') * .5 + E(a, 'personality.empathy') * .3 + (a.h.skills.diplomacy || 0) * .4), 0);
    const delta = Math.round((skill - 45) / 4 + W.rng.gauss(0, 4) - (s.style === 'ทะนง' ? 3 : 0) + (W.sect.policy.openness - 50) / 15);
    s.attitude = clamp(s.attitude + delta, -100, 100); s.contact = W.day;
    ex.journal.push('เยือน' + s.nameTh + ' ท่าทีเปลี่ยน ' + (delta >= 0 ? '+' : '') + delta);
    if (delta > 6 && W.rng.chance(0.4)) { const pool = JD.TECH.techniques.filter(t => !t.sourcePack && !W.sect.library.includes(t.id) && t.tier <= 3); if (pool.length) { const t = W.rng.pick(pool); out.techs.push(t.id); out.notes.push('แลกเปลี่ยนวิชา「' + t.nameTh + '」กับ' + s.nameTh); } }
    if (delta > 8) { const gift = Math.round(30 + W.rng.next() * 60); out.stones += gift; } out.rep += Math.max(0, delta) * 0.05 + 0.2;
    alive.forEach(a => HC.practice(a, 'diplomacy', 1.5, 1.2));
  };
  X.recruitResult = (W, ex, alive, out) => {
    const lead = alive[0]; if (!lead) return;
    const eye = alive.reduce((m, a) => Math.max(m, E(a, 'intellect.judgement') * .5 + E(a, 'intellect.perceptiveness') * .3 + E(a, 'social.teaching' in {} ? '' : 'interests.teaching') * .2), 0);
    const n = W.rng.chance(0.55 + (W.sect.policy.openness - 50) / 200 + W.sect.fame / 600) ? (W.rng.chance(0.25 + eye / 400) ? 2 : 1) : 0;
    for (let i = 0; i < n; i++) { const q = clamp((eye - 40) / 25 + W.rng.gauss(0.2, 0.7), -0.5, 2.5); const nn = W.makeNpc({ quality: q, ageYears: W.rng.int(14, 26), rank: 0, rootBias: eye > 60 ? 1 : 0, fromExped: true }); nn.x = MAP.EXIT.x + .5 + i; nn.y = MAP.EXIT.y + .5; nn.travel = { to: 'home' }; nn.mentor = lead.id; (lead.h.life.family.disciples = lead.h.life.family.disciples || []).push(nn.id); nn.h.life.family.master = lead.id; out.newDisciples++; const r = SECT.rel(nn, lead.id); r.a = 25; r.t = 55; r.r = 55; r.bond = 'อาจารย์'; const r2 = SECT.rel(lead, nn.id); r2.a = 12; r2.bond = 'ศิษย์'; ex.journal.push('พาผู้มีพรสวรรค์ชื่อ ' + nn.h.name.given + ' กลับสำนัก'); W.log('recruit', lead.h.name.given + ' พา ' + nn.h.name.given + ' เข้าสำนักเป็นศิษย์ (' + HC.identity(nn).title + ')', [lead.id, nn.id]); }
    if (!n) ex.journal.push('ตามหาศิษย์ใหม่ แต่ยังไม่พบผู้เหมาะสม');
    out.rep += n * 0.4;
  };
  /* แบ่งของที่ได้: ผู้ซื่อสัตย์ส่งเข้าคลัง ผู้โลภอาจเก็บเองไว้บริจาคภายหลัง */
  X.handover = (W, ex, alive, out) => {
    const rng = W.rng;
    if (!alive || !alive.length) return { mats: {}, pills: {}, gear: [], techs: [], stones: 0, stockBefore: {}, techsAccepted: true };
    const greed = alive.reduce((s, a) => s + clamp((E(a, 'values.wealthResource') + (100 - E(a, 'personality.integrity')) + (100 - E(a, 'personality.loyalty'))) / 3 - 35, 0, 60), 0) / alive.length;
    const keepFrac = clamp(greed / 160 + (W.sect.policy.generosity < 35 ? 0.04 : 0) - (W.sect.policy.generosity > 65 ? 0.03 : 0), 0, 0.4) * (W.sect.policy.strictness > 70 ? 0.5 : 1);
    // ใบรับบริจาคเก็บเฉพาะของที่เข้าคลังจริง ไม่รวมของที่สมาชิกเก็บไว้เอง
    const donation = out.donation = { mats: {}, pills: {}, gear: [], techs: [], stones: 0, stockBefore: {}, techsAccepted: true };
    const hoarder = () => rng.weighted(alive, a => 1 + clamp((E(a, 'values.wealthResource') + (100 - E(a, 'personality.integrity')) + (100 - E(a, 'personality.loyalty'))) / 3 - 25, 0, 75) / 30);
    Object.keys(out.mats || {}).forEach(k => {
      const n = out.mats[k] || 0, keep = rng.chance(keepFrac) ? Math.floor(n * 0.5) : 0, donated = n - keep;
      donation.stockBefore[k] = ECO.count(W, k);
      if (donated > 0) { ECO.add(W, k, donated); donation.mats[k] = donated; }
      if (keep > 0) {
        const owner = hoarder(); owner.inv.mats = owner.inv.mats || {}; owner.inv.mats[k] = (owner.inv.mats[k] || 0) + keep;
        owner.h.state.stress += keep > 3 ? 1 : 0.2;
        if (keep > 2) W.sect.suspicion = (W.sect.suspicion || 0) + 1;
      }
    });
    Object.keys(out.pills || {}).forEach(k => {
      donation.stockBefore[k] = ECO.count(W, k); ECO.add(W, k, out.pills[k]); donation.pills[k] = out.pills[k];
    });
    (out.gear || []).forEach(gr => { W.sect.gear.push(gr); donation.gear.push(gr); });
    (out.techs || []).forEach(id => {
      if (W.sect.library.includes(id)) return;
      const owner = hoarder(), honesty = E(owner, 'personality.integrity'), loyalty = E(owner, 'personality.loyalty');
      const techKeep = clamp(keepFrac + (100 - honesty) / 360 + (100 - loyalty) / 520, 0, 0.72) * (W.sect.policy.strictness > 70 ? 0.5 : 1);
      const t = CULT.tech(id), name = t ? t.nameTh : id;
      if (rng.chance(techKeep)) {
        owner.inv.techs = owner.inv.techs || [];
        if (!owner.inv.techs.includes(id)) owner.inv.techs.push(id);
        out.notes.push(owner.h.name.given + ' เก็บคัมภีร์「' + name + '」ไว้กับตัว');
      } else {
        W.sect.library.push(id); donation.techs.push(id);
        out.notes.push('คัมภีร์「' + name + '」เข้าสู่หอคัมภีร์');
      }
    });
    if (out.stones > 0) {
      const keep = Math.round(out.stones * keepFrac); donation.stones = out.stones - keep;
      ECO.earn(W, donation.stones, 'รายได้จากคณะเดินทาง');
      if (keep > 0) {
        const holder = hoarder(); holder.inv.stones += keep;
        if (keep > 20) { holder.h.state.stress += 1; W.sect.suspicion = (W.sect.suspicion || 0) + 1; }
      }
    } else if (out.stones < 0) ECO.pay(W, Math.min(-out.stones, W.sect.stones), 'สูญเสียระหว่างเดินทาง');
    return donation;
  };

  /* ---------- ผู้สมัครใหม่และการมาเยือน ---------- */
  X.recruitApplicants = (W, why) => {
    const S = W.sect; const pop = W.npcs.filter(n => !n.dead && !n.exiled).length + (S.queue ? S.queue.length : 0);
    const cap = 24 + Math.round(W.map.byId.dorm_outer.level * 10 + W.map.byId.dorm_inner.level * 5 + W.map.byId.dorm_core.level * 3);
    if (pop >= cap) return 0;
    const open = S.policy.openness / 100, drive = S.driveUntil && S.driveUntil > W.day ? 1.5 : 0;
    const exp = (0.45 + S.fame / 220 + open * 0.8 + drive) * clamp((cap - pop) / 14, 0.2, 1.4) * (ECO.count(W, 'meal') + ECO.count(W, 'grain') * 3 > pop * 6 ? 1 : 0.4);
    let n = Math.floor(exp); if (W.rng.next() < exp - n) n++;
    for (let i = 0; i < n; i++) {
      const q = clamp(W.rng.gauss(0, 0.8) + (S.policy.meritocracy - 50) / 120, -1.5, 2.2);
      if ((S.queue || (S.queue = [])).length >= 6) break;
      const nn = W.makeNpc({ quality: q, ageYears: W.rng.int(13, 28), rank: 0, fromApplicant: true, queue: true });
      S.queue.push(nn);
      W.log('recruit', nn.h.name.given + ' (' + nn.h.origin.cls + ' จาก' + nn.h.origin.region + ') มายืนรอที่หน้าประตู ขอสมัครเข้าสำนัก', []);
    }
    return n;
  };

  /* ---------- คาราวานรายเดือน ---------- */
  X.caravan = W => {
    const S = W.sect; const tre = SECT.holder(W, 'treasury');
    const pop = W.npcs.filter(n => !n.dead).length;
    let spent = 0, sold = 0;
    if (W.threat.roadBlocked > 0) { W.log('finance', 'ถนนถูกปิด คาราวานของสำนักเข้าไม่ถึง', []); return; }
    const skill = tre ? (E(tre, 'intellect.numeracy') + E(tre, 'aptitudes.socialCommerce')) / 2 : 40;
    (S.buyList || []).slice(0, 6).forEach(b => { const pr = Math.round(ECO.price(W, b.id) * (1.12 - skill / 600)); const n = b.n; const cost = pr * n; if (S.stones - spent >= cost + 150) { spent += cost; ECO.add(W, b.id, n); } });
    if (spent) { S.stones -= spent; S.ledger.push({ t: W.t, amt: -spent, why: 'คาราวานซื้อวัตถุดิบ/เสบียง' }); }
    Object.keys(S.stock).forEach(k => { if (ECO.isPill(k) && S.stock[k] > 10) { const n = S.stock[k] - 6; if (ECO.take(W, k, n)) { const v = Math.round(ECO.price(W, k) * 0.7 * n); ECO.earn(W, v, 'ขายโอสถส่วนเกิน'); sold += v; } } });
    W.log('finance', 'คาราวานประจำเดือน: ซื้อ ' + spent + ' ศิลา' + (sold ? ', ขายโอสถส่วนเกินได้ ' + sold : ''), []);
  };

  /* ---------- ศัตรูบุก ---------- */
  X.raidChance = W => {
    const s = W.sect; const tension = W.world.sects.reduce((m, x) => Math.max(m, -x.attitude), 0) / 100;
    return clamp(0.006 + s.fame / 12000 + Math.max(0, tension) * 0.012 + (s.stones > 4000 ? 0.004 : 0), 0, 0.05);
  };
  X.spawnRaid = (W, kind, strength) => {
    const rng = W.rng; const tops = W.npcs.filter(n => !n.dead && !n.away && n.cult).map(n => CULT.power(n)).sort((a, b) => b - a).slice(0, 8);
    const base = tops.reduce((s, v) => s + v, 0) || 80;
    const total = base * (strength || (0.3 + rng.next() * 0.55));
    let foes = []; let label;
    if (kind === 'beast') {
      const maxTier = Math.max(1, Math.min(5, Math.round(Math.log(Math.max(total, 40) / 70) / Math.log(2.2))));
      const pool = JD.BEASTS.species.filter(b => !b.sourcePack && b.tier <= maxTier && b.tier >= Math.max(1, maxTier - 2));
      const sp = rng.pick(pool); const n = clamp(Math.round(total / sp.cp), 1, 8);
      for (let i = 0; i < n; i++) foes.push({ name: sp.nameTh, tier: sp.tier, power: sp.cp * (0.8 + rng.next() * 0.4), fleeAt: sp.flee / 100, kind: 'beast', sp: sp.id, drops: sp.drops });
      label = 'ฝูง' + sp.nameTh + ' ' + n + ' ตัว';
    } else {
      const rival = kind === 'rival' ? W.world.sects.slice().sort((a, b) => a.attitude - b.attitude)[0] : null;
      const n = clamp(Math.round(3 + total / 120), 3, 9);
      for (let i = 0; i < n; i++) { const boss = i === 0; foes.push({ name: (boss ? (rival ? 'หัวหน้าชุด' : 'หัวหน้าโจร') : (rival ? 'ศิษย์' + rival.nameTh : 'โจรภูเขา')), tier: boss ? 3 : 1, power: (total / n) * (boss ? 1.9 : 0.8) * (0.8 + rng.next() * 0.4), fleeAt: boss ? 0.15 : 0.3, kind: 'human', boss }); }
      label = (rival ? 'ศิษย์จาก' + rival.nameTh : 'โจรภูเขา') + ' ' + n + ' คน';
      if (rival) foes.rivalId = rival.id;
    }
    W.foes = W.foes || []; W.foeById = W.foeById || {};
    const f = COMBAT.startFight(W, [], [], 'raid', { serious: true, cb: X.raidEnd, ctx: { label, kind, total } });
    f.foes = [];
    foes.forEach((s, i) => { const id = 'F' + (++W.foeSeq || (W.foeSeq = 1)); const u = Object.assign({ id, foe: true, x: MAP.EXIT.x + .5 + (i % 4) * 1.1 - 1.6, y: MAP.EXIT.y + 0.5 + Math.floor(i / 4) * 1.1, px: 0, py: 0, face: 1, speed: 0.55 + s.tier * 0.02, dead: false, speedBase: 1 }, s); u.hpMax = Math.round(u.power * 1.3 + 30); u.hp = u.hpMax; u.act = { id: 'fight', ctx: { fid: f.id, target: null, cd: 3 } }; W.foes.push(u); W.foeById[id] = u; f.B.push(id); f.foes.push(id); });
    W.threat.alert = 3; W.sect.recentRaid = 1; W.threat.raid = f.id;
    W.log('raid', '⚠ ' + label + ' กำลังบุกสำนัก!', []);
    // ระดมกำลังป้องกัน
    X.rally(W, f); return f;
  };
  X.rally = (W, f) => {
    const mast = W.byId[W.sect.masterId]; const guardHead = SECT.holder(W, 'guard');
    W.npcs.forEach(n => {
      if (n.dead || n.away || n.exiled || n.act && n.act.id === 'fight' || n.sealedBt || n.jail > W.t) return;
      const pw = CULT.power(n), hpR = n.h.state.hp / CULT.hpMax(n);
      let will = (E(n, 'personality.courage') - 40) / 60 + AI.dutyWeight(n) * 0.6 + (E(n, 'values.sectDuty') - 45) / 120 + (n.rank >= 3 ? 0.35 : 0) - (hpR < 0.6 ? 0.6 : 0) - (E(n, 'personality.caution') - 55) / 200 + (n.rank === 0 ? -0.6 : 0) + (pw < 25 ? -0.5 : 0) + (guardHead && !guardHead.dead ? 0.15 : 0) + (mast && mast.id === n.id ? 0.4 : 0);
      if (will > 0.55 + W.rng.gauss(0, 0.12) && f.A.length < 14) { COMBAT.join(W, f, n.id, 'A'); n.h.state.stress += 3; AI.mem(W, n, 'ออกรบปกป้องสำนัก', 0.7); }
      else { // หลบเข้าที่พัก
        if (!(n.act && ['sleep', 'sentence'].includes(n.act.id))) { AI.interruptFor(W, n); const s = n.bed != null ? W.map.stations[n.bed] : null; if (s) { AI.begin(W, n, 'hide', { st: s }, [['หลบภัย', 9]]); } }
        if (n.rank >= 1 && n.rank < 5 && will < 0.15) HC.experience(n, 'cowardice', 0.3);
      }
    });
  };
  X.raidEnd = (W, f, ws, win, lose) => {
    const ctx = f.ctx; W.threat.raid = null; W.threat.alert = 1;
    const foes = f.foes.map(i => W.foeById[i]).filter(Boolean); const slain = foes.filter(u => u.dead).length;
    const defenders = f.A.map(i => W.byId[i]).filter(Boolean);
    if (ws === 'A' || foes.every(u => u.dead || u.fled || u.gone)) {
      W.log('raid', '✔ สำนักต้านการบุกของ' + ctx.label + ' สำเร็จ (สังหาร ' + slain + ' ราย)', []); W.fame(3 + slain * 0.3);
      const loot = Math.round(Math.min(260, 25 + ctx.total * 0.08)); ECO.earn(W, loot, 'ยึดของจากผู้บุก');
      foes.forEach(u => { if (u.dead && u.drops) { const d = W.rng.pick(u.drops); ECO.add(W, d, 1 + W.rng.int(0, 1)); } });
      defenders.forEach(d => { if (!d.dead) { d.merit += 15 + (d.h.state.hp < CULT.hpMax(d) * 0.5 ? 10 : 0); HC.experience(d, 'victory', 0.6); d.sat = Math.min(100, (d.sat || 60) + 6); if (d.cult) CULT.gain(d, CULT.threshold(d) * 0.04); } });
      const best = defenders.filter(d => !d.dead).sort((a, b) => (b.stats && b.stats.kills || 0) - (a.stats && a.stats.kills || 0))[0]; if (best) W.log('raid', best.h.name.given + ' เป็นกำลังสำคัญในการป้องกันสำนัก', [best.id]);
      if (ctx.kind === 'rival') { const r = W.world.sects.slice().sort((a, b) => a.attitude - b.attitude)[0]; if (r) r.attitude = Math.min(100, r.attitude + 8); }
    } else {
      const loss = Math.round(W.sect.stones * clamp(0.1 + W.rng.next() * 0.15, 0.05, 0.3)); W.sect.stones -= loss; W.sect.ledger.push({ t: W.t, amt: -loss, why: 'ถูกปล้นโดย' + ctx.label });
      Object.keys(W.sect.stock).forEach(k => { if (W.rng.chance(0.3)) { const n = Math.floor(W.sect.stock[k] * 0.25); if (n > 0) ECO.take(W, k, n); } });
      W.map.buildings.forEach(b => { if (W.rng.chance(0.25)) b.hp = Math.max(30, b.hp - W.rng.int(10, 35)); });
      W.log('raid', '✘ สำนักถูกบุกและปล้น เสียศิลา ' + loss + ' เสียหายหนัก', []); W.fame(-4);
      W.npcs.forEach(n => { if (!n.dead) { HC.experience(n, 'defeat', 0.3); n.sat = Math.max(0, (n.sat || 60) - 6); } });
    }
    W.foes = (W.foes || []).filter(u => !f.foes.includes(u.id)); f.foes.forEach(i => delete W.foeById[i]);
    foes.forEach(u => { u.gone = true; });
    W.npcs.forEach(n => { if (n.act && n.act.id === 'hide') { AI.release(W, n); n.act = { id: 'idle', stage: 'do', left: 0, total: 0, ctx: {}, why: [] }; } });
  };
  X.raidTick = W => { // ทุกนาทีขณะมีศัตรู
    if (!W.foes || !W.foes.length) return;
    W.foes.forEach(u => COMBAT.foeStep(W, u));
    if (W.t % 20 === 0 && W.threat.raid) { const f = (W.fights || []).find(q => q.id === W.threat.raid); if (f && !f.over) X.rally(W, f); }
  };

  /* ---------- เหตุการณ์สุ่มรายวัน ---------- */
  X.daily = W => {
    const rng = W.rng; const T = W.threat;
    if (T.alert > 0) T.alert--; if (T.roadBlocked > 0) T.roadBlocked--;
    // การบุก
    if (W.day >= T.raidCooldown && !T.raid && rng.chance(X.raidChance(W))) {
      const tension = W.world.sects.some(s => s.attitude < -40);
      const kind = tension && rng.chance(0.5) ? 'rival' : rng.chance(0.45) ? 'beast' : 'bandit';
      X.spawnRaid(W, kind); T.raidCooldown = W.day + 25 + rng.int(0, 30);
    }
    // สำนักเพื่อนบ้าน: ทัศนคติลอยตามเวลา
    W.world.sects.forEach(s => { s.attitude = clamp(s.attitude + (s.attitude > 0 ? -0.15 : 0.15) + (s.style === 'ก้าวร้าว' ? -0.1 : 0) + rng.gauss(0, 0.8), -100, 100); });
    // เหตุการณ์ทั่วไป
    if (rng.chance(0.025)) { // พ่อค้าเร่
      const gain = Math.round(40 + rng.next() * 100); W.log('event', 'พ่อค้าเร่แวะสำนัก ซื้อโอสถและของเหลือใช้ ได้ ' + gain + ' ศิลา', []); ECO.earn(W, gain, 'พ่อค้าเร่');
    }
    if (rng.chance(0.012) && W.season !== 3) { // ยอดฝีมือเร่ร่อนมาเยือน
      const t = SECT.holder(W, 'scripture') || W.byId[W.sect.masterId]; const pool = JD.TECH.techniques.filter(x => !x.sourcePack && !W.sect.library.includes(x.id) && x.tier <= 4);
      if (pool.length && t) { const tt = rng.pick(pool); W.sect.library.push(tt.id); W.log('event', 'ยอดฝีมือเร่ร่อนแวะเยือน และมอบคัมภีร์「' + tt.nameTh + '」ให้หอคัมภีร์ (' + t.h.name.given + ' เป็นผู้ต้อนรับ)', [t.id]); W.fame(1); }
    }
    if (rng.chance(0.014)) { // โรคระบาดเบา
      const hit = W.npcs.filter(n => !n.dead && !n.away && rng.chance(0.18 * (1 - E(n, 'physiology.immunity') / 130)));
      if (hit.length) { hit.forEach(n => { n.h.state.hp = Math.max(1, n.h.state.hp * 0.7); HC.feel(n, { mood: -6, stress: 4 }); n.h.state.rest = Math.max(0, n.h.state.rest - 25); }); W.log('event', 'โรคไข้หวัดใหญ่แพร่ในสำนัก ผู้ป่วย ' + hit.length + ' คน' + (SECT.holder(W, 'healer') ? ' หมอหลวงดูแลรักษา' : ' แต่ไม่มีหมอหลวง'), []); }
    }
    if (rng.chance(0.012) && W.season === 3) { T.roadBlocked = 8 + rng.int(0, 8); W.log('event', 'หิมะหนา ถนนเข้าออกถูกปิดหลายวัน', []); }
    if (rng.chance(0.008) && W.season === 0) { const g2 = Math.round(W.npcs.length * 2 + 20); ECO.add(W, 'grain', g2); W.log('event', 'ฤดูใบไม้ผลิฝนดี ผลผลิตเพิ่มพิเศษ ข้าวเพิ่ม ' + g2, []); }
    if (rng.chance(0.007)) { const b = rng.pick(W.map.buildings.filter(x => x.type !== 'gate')); b.hp = Math.max(40, b.hp - rng.int(8, 25)); W.log('event', b.nameTh + ' ชำรุดจากภัยธรรมชาติ ต้องซ่อมแซม', []); }
    // ซ่อมแซมอาคาร: ผู้ที่ว่างงานฝีมือดีช่วยซ่อมอย่างเป็นนามธรรม
    W.map.buildings.forEach(b => { if (b.hp < 100) b.hp = Math.min(100, b.hp + 0.6); });
    // ผู้สมัครใหม่
    if (W.day % 6 === 0) X.recruitApplicants(W);
  };

  g.EXPED = X;
  if (typeof module === 'object' && module.exports) module.exports = X;
})(typeof globalThis !== 'undefined' ? globalThis : this);
