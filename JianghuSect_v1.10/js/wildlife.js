/* wildlife.js — สัตว์อสูรบนแผนที่เดียวกับสำนัก แยกจากคณะเดินทางนอกสำนัก */
(function (g) {
  'use strict';
  const { U, MAP, AI, CULT, COMBAT, JD, HC, ECO } = g;
  const WILD = {};

  function isOutsideWall(map, x, y) {
    if (!map || !map.wall) return true;
    const w = map.wall;
    return x < w.x0 || x > w.x1 || y < w.y0 || y > w.y1;
  }

  const zones = {
    meadow: {
      id: 'meadow',
      nameTh: 'ทุ่งหญ้าหน้าสำนัก',
      dir: 'south',
      x0: 38, x1: 96, y0: 139, y1: 153,
      min: 1, max: 2,
      peaceful: true,
      pools: [
        { id: 'meadow_wolves', nameTh: 'ฝูงหมาป่าหมอกวายุ', min: 1, max: 1, speciesIds: ['BEAST_MIST_WOLF'], weight: 35 },
        { id: 'meadow_boars', nameTh: 'หมูป่าเกราะเหล็กไหล', min: 2, max: 2, speciesIds: ['BEAST_IRON_BOAR'], weight: 25 },
        { id: 'meadow_stags', nameTh: 'กวางวิญญาณหมอกมรกต', min: 2, max: 3, speciesIds: ['BEAST_MIST_JADE_STAG', 'BEAST_IRON_BOAR'], weight: 15 },
        { id: 'meadow_ecology_t1', nameTh: 'ดงสัตว์วิญญาณทุ่งหญ้าขั้นหนึ่ง', min: 1, max: 1, speciesIds: ['ECO2_BEAST_CANINE_1', 'ECO2_BEAST_FELINE_1', 'ECO2_BEAST_URSINE_1', 'ECO2_BEAST_BOAR_1', 'ECO2_BEAST_SERPENT_1', 'ECO2_BEAST_AVIAN_1', 'ECO2_BEAST_ARTHROPOD_1', 'ECO2_BEAST_UNGULATE_1', 'ECO2_BEAST_PLANT_SPIRIT_1', 'ECO2_BEAST_CHIMERA_1'], weight: 30 },
        { id: 'meadow_ecology_t2', nameTh: 'ดงสัตว์วิญญาณทุ่งหญ้าขั้นสอง', min: 2, max: 2, speciesIds: ['ECO2_BEAST_CANINE_2', 'ECO2_BEAST_FELINE_2', 'ECO2_BEAST_URSINE_2', 'ECO2_BEAST_BOAR_2', 'ECO2_BEAST_SERPENT_2', 'ECO2_BEAST_AVIAN_2', 'ECO2_BEAST_ARTHROPOD_2', 'ECO2_BEAST_SHELL_2', 'ECO2_BEAST_UNGULATE_2', 'ECO2_BEAST_PLANT_SPIRIT_2', 'ECO2_BEAST_CHIMERA_2'], weight: 25 }
      ]
    },
    ridge: {
      id: 'ridge',
      nameTh: 'แนวผาหินใต้สำนัก',
      dir: 'south',
      x0: 140, x1: 202, y0: 139, y1: 153,
      min: 3, max: 5,
      pools: [
        { id: 'ridge_serpents', nameTh: 'ดงเหลือมมรกตเจ็ดพิษ', min: 3, max: 3, speciesIds: ['BEAST_EMERALD_PYTHON', 'BEAST_YIN_SHADOW_BAT_3'], weight: 30 },
        { id: 'ridge_scorpions', nameTh: 'อาณาเขตแมงป่องเพลิง', min: 4, max: 4, speciesIds: ['BEAST_SAND_SCORPION', 'BEAST_LAVA_FLAME_TORTOISE_4'], weight: 25 },
        { id: 'ridge_thunder', nameTh: 'สันผาอสูรอัสนี', min: 4, max: 5, speciesIds: ['BEAST_THUNDER_DRAKE_LIZARD', 'BEAST_THUNDER_HORN_STAG_4', 'BEAST_THUNDER_ROC'], weight: 20 },
        { id: 'ridge_ecology_t3_t5', nameTh: 'หุบผาอสูรพิภพและเพลิง', min: 3, max: 5, speciesIds: ['ECO2_BEAST_FELINE_4', 'ECO2_BEAST_SERPENT_4', 'ECO2_BEAST_SERPENT_5', 'ECO2_BEAST_UNGULATE_3', 'ECO2_BEAST_UNGULATE_5', 'ECO2_BEAST_PLANT_SPIRIT_4', 'ECO2_BEAST_PLANT_SPIRIT_5', 'ECO2_BEAST_BOAR_5', 'ECO2_BEAST_BOAR_4', 'ECO2_BEAST_SERPENT_3'], weight: 30 }
      ]
    },
    legend: {
      id: 'legend',
      nameTh: 'แดนอสูรบรรพกาลเร้นลับ',
      dir: 'south',
      x0: 140, x1: 202, y0: 139, y1: 153,
      min: 6, max: 7,
      legendary: true,
      pools: [
        { id: 'legend_beasts', nameTh: 'อสูรบรรพกาลใต้พิภพ', min: 6, max: 6, speciesIds: ['BEAST_BLOOD_TIGER', 'BEAST_MYTHIC_TAOTIE_SHADOW', 'KING_BLOOD_TIGER_CENTRAL'], weight: 40 },
        { id: 'legend_celestial', nameTh: 'มังกรสมุทรและราชันย์เทพอสูร', min: 7, max: 7, speciesIds: ['BEAST_ABYSSAL_DRAGON', 'BEAST_MYTHIC_CELESTIAL_QILIN_SOVEREIGN', 'KING_KUNLUN_DRAGON'], weight: 30 },
        { id: 'legend_ecology_t6', nameTh: 'ราชันย์อสูรบรรพกาลแปดทิศ', min: 6, max: 6, legendary: true, speciesIds: ['ECO2_BEAST_BOAR_6', 'ECO2_BEAST_SERPENT_6', 'ECO2_BEAST_ARTHROPOD_6', 'ECO2_BEAST_SHELL_6', 'ECO2_BEAST_UNGULATE_6', 'ECO2_BEAST_PLANT_SPIRIT_6', 'ECO2_BEAST_CHIMERA_6'], weight: 40 },
        { id: 'legend_ecology_t7', nameTh: 'แปดมหาเทพอสูรบรรพกาลชั้นฟ้า', min: 7, max: 7, legendary: true, speciesIds: ['ECO2_BEAST_MYTHIC_1', 'ECO2_BEAST_MYTHIC_2', 'ECO2_BEAST_MYTHIC_4', 'ECO2_BEAST_MYTHIC_5', 'ECO2_BEAST_MYTHIC_7', 'ECO2_BEAST_MYTHIC_8'], weight: 35 }
      ]
    },
    west_grove: {
      id: 'west_grove',
      nameTh: 'ป่าไผ่หมอกครามประจิม',
      dir: 'west',
      x0: 5, x1: 25, y0: 30, y1: 125,
      min: 2, max: 4,
      pools: [
        { id: 'west_hound_pool', nameTh: 'ฝูงอสูรหมาป่าโลหิตและหมูป่า', min: 2, max: 3, speciesIds: ['BEAST_IRON_BOAR', 'BEAST_BLOOD_FIEND_HOUND_4'], weight: 30 },
        { id: 'west_treant_pool', nameTh: 'ดงงูพฤกษาพันปีและกวางเมฆาคราม', min: 3, max: 4, speciesIds: ['BEAST_ANCIENT_TREANT_SERPENT_4', 'BEAST_THUNDER_HORN_STAG_4', 'BEAST_MIST_JADE_STAG'], weight: 25 },
        { id: 'west_shadow_pool', nameTh: 'ถ้ำค้างคาวเงาหยินรัตติกาล', min: 3, max: 3, speciesIds: ['BEAST_YIN_SHADOW_BAT_3', 'BEAST_EMERALD_PYTHON'], weight: 15 },
        { id: 'west_ecology_t3', nameTh: 'ดงพฤกษาและอสรพิษประจิม', min: 3, max: 3, speciesIds: ['ECO2_BEAST_SERPENT_3', 'ECO2_BEAST_PLANT_SPIRIT_3', 'ECO2_BEAST_ARTHROPOD_3', 'ECO2_BEAST_CANINE_3', 'ECO2_BEAST_FELINE_3', 'ECO2_BEAST_BOAR_3'], weight: 30 },
        { id: 'west_ecology_t4', nameTh: 'อาณาเขตเงาพฤกษาหมื่นพิษ', min: 4, max: 4, speciesIds: ['ECO2_BEAST_SERPENT_4', 'ECO2_BEAST_PLANT_SPIRIT_4', 'ECO2_BEAST_ARTHROPOD_4', 'ECO2_BEAST_CANINE_4'], weight: 25 }
      ]
    },
    east_crag: {
      id: 'east_crag',
      nameTh: 'หน้าผาหินแกร่งบูรพา',
      dir: 'east',
      x0: 215, x1: 235, y0: 30, y1: 125,
      min: 3, max: 5,
      pools: [
        { id: 'east_tortoise_pool', nameTh: 'ดงเต่าศิลาเพลิงพิภพ', min: 4, max: 4, speciesIds: ['BEAST_LAVA_FLAME_TORTOISE_4', 'BEAST_SAND_SCORPION'], weight: 25 },
        { id: 'east_drake_pool', nameTh: 'ผากิ้งก่ามังกรและเหยี่ยวดารา', min: 4, max: 5, speciesIds: ['BEAST_THUNDER_DRAKE_LIZARD', 'BEAST_ASTRAL_VOID_HAWK_5'], weight: 25 },
        { id: 'east_leviathan_pool', nameTh: 'แอ่งน้ำเต่ามังกรสมุทรดึกดำบรรพ์', min: 5, max: 5, speciesIds: ['BEAST_ABYSSAL_LEVIATHAN_TURTLE', 'KING_EMERALD_SERPENT_SOUTH'], weight: 15 },
        { id: 'east_ecology_t3_t4', nameTh: 'ผาศิลาอสูรหมีและเต่าเกราะ', min: 3, max: 4, speciesIds: ['ECO2_BEAST_URSINE_3', 'ECO2_BEAST_BOAR_3', 'ECO2_BEAST_SHELL_3', 'ECO2_BEAST_CHIMERA_3', 'ECO2_BEAST_URSINE_4', 'ECO2_BEAST_BOAR_4', 'ECO2_BEAST_SHELL_4', 'ECO2_BEAST_AVIAN_3'], weight: 30 },
        { id: 'east_ecology_t4_t5', nameTh: 'วังน้ำวนและผาอสูรดึกดำบรรพ์', min: 4, max: 5, speciesIds: ['ECO2_BEAST_CHIMERA_4', 'ECO2_BEAST_CHIMERA_5', 'ECO2_BEAST_ARTHROPOD_5', 'ECO2_BEAST_FELINE_4', 'ECO2_BEAST_BOAR_5', 'ECO2_BEAST_ARTHROPOD_4'], weight: 25 }
      ]
    },
    north_peak: {
      id: 'north_peak',
      nameTh: 'ยอดเขาเหมันต์อุดร',
      dir: 'north',
      x0: 35, x1: 205, y0: 3, y1: 15,
      min: 4, max: 6,
      pools: [
        { id: 'north_bear_pool', nameTh: 'หุบผาหมีขาวเหมันต์', min: 4, max: 4, speciesIds: ['BEAST_FROST_BEAR'], weight: 30 },
        { id: 'north_kirin_pool', nameTh: 'ยอดเขากิเลนเหมันต์ดาราเร้น', min: 5, max: 5, speciesIds: ['BEAST_FROST_MIST_KIRIN', 'BEAST_ASTRAL_VOID_HAWK_5'], weight: 25 },
        { id: 'north_sovereign_pool', nameTh: 'สันเขาพญาหมีเหมันต์ทลายสวรรค์', min: 5, max: 6, speciesIds: ['KING_FROST_SOVEREIGN_BEAR', 'BEAST_MYTHIC_TAOTIE_SHADOW'], weight: 15, legendary: true },
        { id: 'north_ecology_t4_t5', nameTh: 'ยอดเขาหิมะวิหคและพยัคฆ์ขาว', min: 4, max: 5, speciesIds: ['ECO2_BEAST_CANINE_5', 'ECO2_BEAST_FELINE_5', 'ECO2_BEAST_URSINE_5', 'ECO2_BEAST_AVIAN_4', 'ECO2_BEAST_AVIAN_5', 'ECO2_BEAST_UNGULATE_4', 'ECO2_BEAST_UNGULATE_5'], weight: 30 },
        { id: 'north_ecology_t6', nameTh: 'ยอดเขาพญาราชันย์เหมันต์และอสนี', min: 6, max: 6, legendary: true, speciesIds: ['ECO2_BEAST_CANINE_6', 'ECO2_BEAST_FELINE_6', 'ECO2_BEAST_URSINE_6', 'ECO2_BEAST_AVIAN_6'], weight: 20 }
      ]
    }
  };
  WILD.zones = zones;

  WILD.init = W => {
    if (!W.wildlife) W.wildlife = { seq: 0, beasts: [], kills: 0 };
  };

  WILD.spawn = (W, zoneId, poolId, opts) => {
    opts = opts || {};
    const legendSpecies = s => s.tier >= 6 || String(s.id).startsWith('KING_');
    WILD.init(W);
    const active = W.wildlife.beasts.filter(b => !b.gone && !b.dead);
    if (active.length >= 12) return null;
    const z = zones[zoneId];
    if (!z) return null;

    let pool = null;
    if (poolId && z.pools) {
      pool = z.pools.find(p => p.id === poolId);
    }
    if (!pool && z.pools && z.pools.length) {
      const choices = z.pools.filter(p => (!opts.ordinary || (!p.legendary&&!z.legendary)) && (!opts.legendary || p.legendary || z.legendary));
      if (!choices.length) return null;
      pool = W.rng.weighted ? W.rng.weighted(choices, p => p.weight || 10) : W.rng.pick(choices);
    }

    if(opts.ordinary&&(z.legendary||pool?.legendary))return null;
    if(opts.legendary&&!z.legendary&&!pool?.legendary)return null;
    const minTier = pool ? pool.min : z.min;
    const maxTier = pool ? pool.max : z.max;
    const allCands = (JD.BEASTS.species || []).concat(JD.BEASTS.kings || []);
    let cands = allCands.filter(s => {
      if (s.terrain === 'water' || s.archetype === 'AQUATIC') return false;
      if (pool && pool.speciesIds && pool.speciesIds.length) {
        if (!pool.speciesIds.includes(s.id)) return false;
      }
      if (opts.ordinary && legendSpecies(s)) return false;
      if (opts.legendary && !legendSpecies(s) && !(pool && pool.legendary) && !z.legendary) return false;
      return s.tier >= minTier && s.tier <= maxTier && Array.isArray(s.drops) && s.drops.some(id => ECO.matById[id]);
    });

    let species = null;
    if (opts.speciesId) {
      const s = allCands.find(x => x.id === opts.speciesId);
      if (!s || s.terrain === 'water' || s.archetype === 'AQUATIC') return null;
      species = s;
    } else {
      if (!cands.length) {
        cands = (JD.BEASTS.species || []).filter(s => {
          if (s.terrain === 'water' || s.archetype === 'AQUATIC') return false;
          return s.tier >= z.min && s.tier <= z.max && (!opts.ordinary || !legendSpecies(s)) && (!opts.legendary || legendSpecies(s)) && Array.isArray(s.drops) && s.drops.some(id => ECO.matById[id]);
        });
      }
      if (!cands.length) return null;
      species = W.rng.pick(cands);
    }
    const isLegend = !!(pool && pool.legendary) || !!z.legendary || species.tier >= 6 || String(species.id).startsWith('KING_');
    if (isLegend && active.some(b => b.legendary)) return null;
    const isAggressive = (z.peaceful || species.tier <= 2) ? false : ((species.aggro || 60) >= 70);
    const legal = (x, y) => isOutsideWall(W.map, x, y) && !MAP.blocked(W.map, x, y) &&
      !((isAggressive || species.tier >= 3) && MAP.isInSafeBelt && MAP.isInSafeBelt(x + .5, y + .5));
    let x, y, placed = false;
    for (let attempt = 0; attempt < 24; attempt++) {
      x = W.rng.int(z.x0, z.x1); y = W.rng.int(z.y0, z.y1);
      if (legal(x, y)) { placed = true; break; }
    }
    // Deterministic bounded fallback remains within the same habitat.
    if (!placed) {
      for (let py = z.y0; py <= z.y1 && !placed; py++) for (let px = z.x0; px <= z.x1; px++) {
        if (legal(px, py)) { x = px; y = py; placed = true; break; }
      }
    }
    if (!placed) return null;
    const id = 'wild_' + (++W.wildlife.seq);

    const b = {
      id,
      foe: true,
      wild: true,
      speciesId: species.id,
      name: species.nameTh,
      tier: species.tier,
      power: species.cp,
      hpMax: Math.round(species.cp * 1.3 + 30),
      x: x + 0.5,
      y: y + 0.5,
      px: x + 0.5,
      py: y + 0.5,
      zone: zoneId,
      pool: pool ? pool.id : null,
      speed: 0.5,
      face: 1,
      aggressive: isAggressive,
      legendary: isLegend,
      expires: isLegend ? (W.t + W.rng.int(3, 10) * 1440) : null,
      dead: false,
      gone: false,
      skl: []
    };
    b.hp = b.hpMax;
    W.wildlife.beasts.push(b);

    if (b.legendary) {
      W.log('explore', '★ ' + b.name + ' ปรากฏตัวใน' + z.nameTh + ' และอาจจากไปเมื่อใดก็ได้', []);
    }
    return b;
  };

  WILD.startFight = (W, n, b) => {
    if (!n || n.dead || n.away || n.travel || !b || b.dead || b.gone || b.fighting || n.act.id === 'fight') return false;
    if (!isOutsideWall(W.map, n.x, n.y) || !isOutsideWall(W.map, b.x, b.y) || Math.hypot(n.x - b.x, n.y - b.y) > 3) return false;
    // สัตว์ดุร้ายห้ามเริ่มต่อสู้หรือโจมตีข้ามแนวเก็บสมุนไพรปลอดภัย
    if (b.aggressive && MAP.isInSafeBelt && (MAP.isInSafeBelt(n.x, n.y) || MAP.isInSafeBelt(b.x, b.y))) return false;

    W.foes.push(b);
    W.foeById[b.id] = b;
    const f = COMBAT.startFight(W, [n.id], [b.id], 'wild', { serious: true, ctx: { beastId: b.id, hunterId: n.id } });
    b.fighting = f.id;
    const z = zones[b.zone];
    const zName = z ? z.nameTh : 'นอกสำนัก';
    W.log('combat', n.h.name.given + ' เผชิญหน้า ' + b.name + ' ใน' + zName, [n.id]);
    return true;
  };

  WILD.finish = (W, f, winner) => {
    if (!f || f.wildSettled) return;
    f.wildSettled = true;

    const b = W.foeById[f.ctx.beastId], n = W.byId[f.ctx.hunterId];
    if (!b) return;

    if (b.dead && winner === 'A' && n && !n.dead) {
      const allSpecies = (JD.BEASTS.species || []).concat(JD.BEASTS.kings || []);
      const species = allSpecies.find(s => s.id === b.speciesId);
      n.inv.mats = n.inv.mats || {};
      const drops = species ? (species.drops || []).filter(id => ECO.matById[id]) : [];
      let dropName = '';
      if (drops.length) {
        const id = W.rng.pick(drops);
        n.inv.mats[id] = (n.inv.mats[id] || 0) + 1;
        dropName = ECO.name(id);
      }
      let organName = '';
      if (species && g.CONTENT && g.CONTENT.organByBeastId && g.CONTENT.organByBeastId[species.id]) {
        const out = {};
        const result = g.CONTENT.harvestOrgan(W, { kind: 'hunt', journal: [] }, [n], out, null, species);
        if (result.recovered && out.organs) {
          n.inv.organs = n.inv.organs || {};
          for (const [id, q] of Object.entries(out.organs)) {
            n.inv.organs[id] = (n.inv.organs[id] || 0) + q;
          }
          organName = result.nameTh;
          W.log('craft', n.h.name.given + ' ชำแหละ ' + b.name + ' ได้วัตถุดิบวิญญาณ ' + result.nameTh, [n.id]);
        }
      }
      const z = zones[b.zone];
      const zName = z ? z.nameTh : 'นอกสำนัก';
      const dropText = [dropName, organName].filter(Boolean).join(' และ ') || 'วัตถุดิบอสูร';
      W.log('combat', n.h.name.given + ' ล่าสังหาร ' + b.name + ' ใน' + zName + ' สำเร็จ ได้รับ ' + dropText, [n.id]);
      if(g.COG)g.COG.remember(W,n,{kind:'hunt_win',zoneId:b.zone,subjectId:b.speciesId,severity:.4});
      W.wildlife.kills = (W.wildlife.kills || 0) + 1;
      HC.experience(n, 'combat_win', 0.8);
      n.merit += Math.max(1, Math.round(b.tier * 1.5));
    } else if (n && !n.dead && (winner === 'B' || n.h.state.hp < CULT.hpMax(n) * 0.35 || f.fled)) {
      const z = zones[b.zone];
      const zName = z ? z.nameTh : 'นอกสำนัก';
      if(g.COG)g.COG.remember(W,n,{kind:'hunt_loss',zoneId:b.zone,subjectId:b.speciesId,severity:1});
      W.log('combat', n.h.name.given + ' พลาดท่าต่อ ' + b.name + ' ใน' + zName + ' ต้องล่าถอยกลับสำนัก', [n.id]);
    }

    W.foes = W.foes.filter(x => x.id !== b.id);
    delete W.foeById[b.id];
    b.fighting = null;
    if (b.dead) {
      b.gone = true;
    } else {
      b.fled = false;
      b.yield = false;
      b.act = null;
    }
  };

  WILD.clampCombat = W => {
    for (const b of (W.wildlife?.beasts || [])) {
      if (b.fighting) {
        const z = zones[b.zone];
        if (z) {
          b.x = U.clamp(b.x, z.x0, z.x1);
          b.y = U.clamp(b.y, z.y0, z.y1);
          if (z.dir === 'south' && W.map && W.map.wall) b.y = Math.max(W.map.wall.y1 + 1.2, b.y);
          if (z.dir === 'north' && W.map && W.map.wall) b.y = Math.min(W.map.wall.y0 - 1.2, b.y);
          if (z.dir === 'west' && W.map && W.map.wall) b.x = Math.min(W.map.wall.x0 - 1.2, b.x);
          if (z.dir === 'east' && W.map && W.map.wall) b.x = Math.max(W.map.wall.x1 + 1.2, b.x);
        }
      }
    }
  };

  WILD.tick = W => {
    WILD.init(W);
    const state = W.wildlife;

    if (W.t % 60 === 0) {
      let active = state.beasts.filter(b => !b.gone && !b.dead);
      // เติมอสูรธรรมดาเป็นชุด (1..3 ตัว) เมื่อต่ำกว่าเป้าหมาย 10 ตัว ภายใต้เพดานรวม 12 ตัว
      if (active.length < 10) {
        const batchWanted = Math.min(W.rng.int(1, 3), 10 - active.length);
        const zoneKeys = ['meadow', 'ridge', 'west_grove', 'east_crag', 'north_peak'];
        for (let i = 0; i < batchWanted; i++) {
          active = state.beasts.filter(b => !b.gone && !b.dead);
          if (active.length >= 10) break;
          // เรียงโซนตามจำนวนสัตว์ที่มีอยู่น้อยที่สุดเพื่อกระจายทั่วทุกทิศ
          const candidates = zoneKeys
            .map(z => ({ zone: z, count: active.filter(b => b.zone === z).length }))
            .filter(item => item.count < 3)
            .sort((a, b) => a.count - b.count);
          if (!candidates.length) break;
          const spawned = WILD.spawn(W, candidates[0].zone, null, { ordinary: true });
          if (!spawned) {
            // หากโซนแรกวางไม่ได้ ลองโซนถัดไป
            for (let j = 1; j < candidates.length; j++) {
              if (WILD.spawn(W, candidates[j].zone, null, { ordinary: true })) break;
            }
          }
        }
      }
      // โอกาสสุ่มอสูรตำนาน: 1 ครั้งต่อชั่วโมงเกม (โอกาส 0.002) และมีได้ไม่เกิน 1 ตัวพร้อมกันทั่วโลก
      if (!state.beasts.some(b => b.legendary && !b.gone && !b.dead) && W.rng.chance(0.002)) {
        const rareZones = Object.keys(zones).filter(id => zones[id].legendary || zones[id].pools.some(p => p.legendary));
        WILD.spawn(W, W.rng.pick(rareZones), null, { legendary: true });
      }
    }

    for (const b of state.beasts) {
      if (b.gone || b.dead) continue;
      if (b.fighting) {
        const f = W.fights.find(x => x.id === b.fighting && !x.over);
        if (f) {
          const z = zones[b.zone];
          if (z && z.dir === 'south' && W.map && W.map.wall) b.y = Math.max(W.map.wall.y1 + 1.2, b.y);
          continue;
        }
        b.fighting = null;
      }
      if (b.legendary && W.t >= b.expires) {
        b.gone = true;
        const z = zones[b.zone];
        const zName = z ? z.nameTh : 'นอกสำนัก';
        W.log('explore', b.name + ' จากพื้นที่' + zName + ' ไปแล้ว', []);
        continue;
      }
      if (b.aggressive && W.t % 15 === 0) {
        // อสูรก้าวร้าวไม่โจมตีผู้คนที่อยู่ในแนวเก็บสมุนไพรปลอดภัยหน้าประตูสำนัก
        const n = W.npcs.find(n => !n.dead && !n.away && !n.hidden && !n.travel && isOutsideWall(W.map, n.x, n.y) && !(MAP.isInSafeBelt && MAP.isInSafeBelt(n.x, n.y)) && n.act.id !== 'fight' && Math.hypot(n.x - b.x, n.y - b.y) < 2.5);
        if (n) WILD.startFight(W, n, b);
      }
      if (!b.fighting && W.t % 90 === 0) {
        const z = zones[b.zone];
        if (z) {
          b.px = b.x; b.py = b.y;
          const nx = U.clamp(b.x + W.rng.int(-2, 2), z.x0, z.x1);
          const ny = U.clamp(b.y + W.rng.int(-1, 1), z.y0, z.y1);
          if (isOutsideWall(W.map, nx, ny)) {
            // สัตว์ดุร้ายหรือระดับ 3 ขึ้นไป ห้ามเดินเพ่นพ่านเข้าไปในแนวปลอดภัย
            if (!((b.aggressive || b.tier >= 3) && MAP.isInSafeBelt && MAP.isInSafeBelt(nx, ny))) {
              b.x = nx; b.y = ny;
            }
          }
        }
      }
    }
    state.beasts = state.beasts.filter(b => !b.gone && !b.dead);
  };

  AI.ACTS.wildHunt = {
    nameTh: 'ล่าอสูรใกล้สำนัก',
    icon: '🐺',
    color: '#b67862',
    can: (n, W) => !!(W.wildlife && n.rank >= 1 && !n.dead && !n.away && !(n.inj && n.inj.length) && n.h.state.hp > CULT.hpMax(n) * 0.6 && W.wildlife.beasts.some(b => !b.dead && !b.gone && !b.fighting && CULT.power(n) >= b.power * 0.8)),
    score(n, W, S) {
      S.add('ชอบล่าและต่อสู้', (HC.eff(n, 'interests.combat') - 35) / 40 + (HC.eff(n, 'interests.exploring') - 40) / 60);
      S.add('ต้องการวัตถุดิบ', 0.35);
      if (n.rank <= 2) S.add('ฝึกฝนความกล้า', 0.2);
    },
    where(W, n) {
      const candidates = (W.wildlife.beasts || []).filter(b => !b.dead && !b.gone && !b.fighting && CULT.power(n) >= b.power * 0.8);
      candidates.sort((a,b)=>g.COG?g.COG.huntValue(W,n,b)-g.COG.huntValue(W,n,a):Math.hypot(n.x-a.x,n.y-a.y)-Math.hypot(n.x-b.x,n.y-b.y));
      const b = candidates[0];
      return b ? { pos: { x: b.x, y: b.y }, beastId: b.id } : null;
    },
    start(n, W, ctx) {
      const b = W.wildlife.beasts.find(b => b.id === ctx.beastId);
      return !!b && WILD.startFight(W, n, b);
    },
    dur: () => 1,
    tick() {},
    done() {}
  };

  g.WILD = WILD;
  if (typeof module === 'object' && module.exports) module.exports = WILD;
})(typeof globalThis !== 'undefined' ? globalThis : this);
