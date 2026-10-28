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
        { id: 'meadow_wolves', nameTh: 'ฝูงหมาป่าหมอกวายุ', min: 1, max: 1, speciesIds: ['BEAST_MIST_WOLF'], weight: 50 },
        { id: 'meadow_boars', nameTh: 'หมูป่าเกราะเหล็กไหล', min: 2, max: 2, speciesIds: ['BEAST_IRON_BOAR'], weight: 35 },
        { id: 'meadow_stags', nameTh: 'กวางวิญญาณหมอกมรกต', min: 2, max: 3, speciesIds: ['BEAST_MIST_JADE_STAG', 'BEAST_IRON_BOAR'], weight: 15 }
      ]
    },
    ridge: {
      id: 'ridge',
      nameTh: 'แนวผาหินใต้สำนัก',
      dir: 'south',
      x0: 140, x1: 202, y0: 139, y1: 153,
      min: 3, max: 5,
      pools: [
        { id: 'ridge_serpents', nameTh: 'ดงเหลือมมรกตเจ็ดพิษ', min: 3, max: 3, speciesIds: ['BEAST_EMERALD_PYTHON', 'BEAST_YIN_SHADOW_BAT_3'], weight: 40 },
        { id: 'ridge_scorpions', nameTh: 'อาณาเขตแมงป่องเพลิง', min: 4, max: 4, speciesIds: ['BEAST_SAND_SCORPION', 'BEAST_LAVA_FLAME_TORTOISE_4'], weight: 35 },
        { id: 'ridge_thunder', nameTh: 'สันผาอสูรอัสนี', min: 4, max: 5, speciesIds: ['BEAST_THUNDER_DRAKE_LIZARD', 'BEAST_THUNDER_HORN_STAG_4', 'BEAST_THUNDER_ROC'], weight: 25 }
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
        { id: 'legend_beasts', nameTh: 'อสูรบรรพกาลใต้พิภพ', min: 6, max: 6, speciesIds: ['BEAST_BLOOD_TIGER', 'BEAST_MYTHIC_TAOTIE_SHADOW', 'KING_BLOOD_TIGER_CENTRAL'], weight: 60 },
        { id: 'legend_celestial', nameTh: 'มังกรสมุทรและราชันย์เทพอสูร', min: 7, max: 7, speciesIds: ['BEAST_ABYSSAL_DRAGON', 'BEAST_MYTHIC_CELESTIAL_QILIN_SOVEREIGN', 'KING_KUNLUN_DRAGON'], weight: 40 }
      ]
    },
    west_grove: {
      id: 'west_grove',
      nameTh: 'ป่าไผ่หมอกครามประจิม',
      dir: 'west',
      x0: 5, x1: 25, y0: 30, y1: 125,
      min: 2, max: 4,
      pools: [
        { id: 'west_hound_pool', nameTh: 'ฝูงอสูรหมาป่าโลหิตและหมูป่า', min: 2, max: 3, speciesIds: ['BEAST_IRON_BOAR', 'BEAST_BLOOD_FIEND_HOUND_4'], weight: 45 },
        { id: 'west_treant_pool', nameTh: 'ดงงูพฤกษาพันปีและกวางเมฆาคราม', min: 3, max: 4, speciesIds: ['BEAST_ANCIENT_TREANT_SERPENT_4', 'BEAST_THUNDER_HORN_STAG_4', 'BEAST_MIST_JADE_STAG'], weight: 35 },
        { id: 'west_shadow_pool', nameTh: 'ถ้ำค้างคาวเงาหยินรัตติกาล', min: 3, max: 3, speciesIds: ['BEAST_YIN_SHADOW_BAT_3', 'BEAST_EMERALD_PYTHON'], weight: 20 }
      ]
    },
    east_crag: {
      id: 'east_crag',
      nameTh: 'หน้าผาหินแกร่งบูรพา',
      dir: 'east',
      x0: 215, x1: 235, y0: 30, y1: 125,
      min: 3, max: 5,
      pools: [
        { id: 'east_tortoise_pool', nameTh: 'ดงเต่าศิลาเพลิงพิภพ', min: 4, max: 4, speciesIds: ['BEAST_LAVA_FLAME_TORTOISE_4', 'BEAST_SAND_SCORPION'], weight: 40 },
        { id: 'east_drake_pool', nameTh: 'ผากิ้งก่ามังกรและเหยี่ยวดารา', min: 4, max: 5, speciesIds: ['BEAST_THUNDER_DRAKE_LIZARD', 'BEAST_ASTRAL_VOID_HAWK_5'], weight: 35 },
        { id: 'east_leviathan_pool', nameTh: 'แอ่งน้ำเต่ามังกรสมุทรดึกดำบรรพ์', min: 5, max: 5, speciesIds: ['BEAST_ABYSSAL_LEVIATHAN_TURTLE', 'KING_EMERALD_SERPENT_SOUTH'], weight: 25 }
      ]
    },
    north_peak: {
      id: 'north_peak',
      nameTh: 'ยอดเขาเหมันต์อุดร',
      dir: 'north',
      x0: 35, x1: 205, y0: 3, y1: 15,
      min: 4, max: 6,
      pools: [
        { id: 'north_bear_pool', nameTh: 'หุบผาหมีขาวเหมันต์', min: 4, max: 4, speciesIds: ['BEAST_FROST_BEAR'], weight: 45 },
        { id: 'north_kirin_pool', nameTh: 'ยอดเขากิเลนเหมันต์ดาราเร้น', min: 5, max: 5, speciesIds: ['BEAST_FROST_MIST_KIRIN', 'BEAST_ASTRAL_VOID_HAWK_5'], weight: 35 },
        { id: 'north_sovereign_pool', nameTh: 'สันเขาพญาหมีเหมันต์ทลายสวรรค์', min: 5, max: 6, speciesIds: ['KING_FROST_SOVEREIGN_BEAR', 'BEAST_MYTHIC_TAOTIE_SHADOW'], weight: 20, legendary: true }
      ]
    }
  };
  WILD.zones = zones;

  WILD.init = W => {
    if (!W.wildlife) W.wildlife = { seq: 0, beasts: [], kills: 0 };
  };

  WILD.spawn = (W, zoneId, poolId) => {
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
      pool = W.rng.weighted ? W.rng.weighted(z.pools, p => p.weight || 10) : W.rng.pick(z.pools);
    }

    const minTier = pool ? pool.min : z.min;
    const maxTier = pool ? pool.max : z.max;
    const allCands = (JD.BEASTS.species || []).concat(JD.BEASTS.kings || []);
    let cands = allCands.filter(s => {
      if (pool && pool.speciesIds && pool.speciesIds.length) {
        if (!pool.speciesIds.includes(s.id)) return false;
      }
      return s.tier >= minTier && s.tier <= maxTier && Array.isArray(s.drops) && s.drops.some(id => ECO.matById[id]);
    });

    if (!cands.length) {
      cands = (JD.BEASTS.species || []).filter(s => s.tier >= z.min && s.tier <= z.max && Array.isArray(s.drops) && s.drops.some(id => ECO.matById[id]));
    }
    if (!cands.length) return null;

    const species = W.rng.pick(cands);
    let x = W.rng.int(z.x0, z.x1), y = W.rng.int(z.y0, z.y1);
    if (W.map && MAP.blocked(W.map, x, y)) {
      const free = MAP.nearestFree(W.map, x, y);
      if (free && isOutsideWall(W.map, free.x, free.y)) { x = free.x; y = free.y; }
    }

    const id = 'wild_' + (++W.wildlife.seq);
    const isLegend = !!(pool && pool.legendary) || !!z.legendary || species.tier >= 6 || String(species.id).startsWith('KING_');
    const isAggressive = (z.peaceful || species.tier <= 2) ? false : ((species.aggro || 60) >= 70);

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
      W.wildlife.kills = (W.wildlife.kills || 0) + 1;
      HC.experience(n, 'combat_win', 0.8);
      n.merit += Math.max(1, Math.round(b.tier * 1.5));
    } else if (n && !n.dead && (winner === 'B' || n.h.state.hp < CULT.hpMax(n) * 0.35 || f.fled)) {
      const z = zones[b.zone];
      const zName = z ? z.nameTh : 'นอกสำนัก';
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
      const active = state.beasts.filter(b => !b.gone && !b.dead);
      if (active.length < 10) {
        for (const zone of ['meadow', 'ridge', 'west_grove', 'east_crag', 'north_peak']) {
          if (state.beasts.filter(b => b.zone === zone && !b.gone && !b.dead).length < 2) {
            WILD.spawn(W, zone);
            break;
          }
        }
      }
      if (!state.beasts.some(b => b.legendary && !b.gone && !b.dead) && W.rng.chance(0.002)) {
        WILD.spawn(W, 'legend');
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
        const n = W.npcs.find(n => !n.dead && !n.away && !n.hidden && !n.travel && isOutsideWall(W.map, n.x, n.y) && n.act.id !== 'fight' && Math.hypot(n.x - b.x, n.y - b.y) < 2.5);
        if (n) WILD.startFight(W, n, b);
      }
      if (!b.fighting && W.t % 90 === 0) {
        const z = zones[b.zone];
        if (z) {
          b.px = b.x; b.py = b.y;
          const nx = U.clamp(b.x + W.rng.int(-2, 2), z.x0, z.x1);
          const ny = U.clamp(b.y + W.rng.int(-1, 1), z.y0, z.y1);
          if (isOutsideWall(W.map, nx, ny)) {
            b.x = nx; b.y = ny;
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
      candidates.sort((a, b) => Math.hypot(n.x - a.x, n.y - a.y) - Math.hypot(n.x - b.x, n.y - b.y));
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
