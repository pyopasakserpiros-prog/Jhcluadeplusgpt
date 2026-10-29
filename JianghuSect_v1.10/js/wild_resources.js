/* wild_resources.js — แหล่งทรัพยากรธรรมชาติจำกัดนอกกำแพงสำนัก (v1.10.13)
 * ระบบทรัพยากรทางกายภาพบนแผนที่เดียวกับสำนัก: สมุนไพร แร่ และวัสดุธรรมชาติ
 * กฎเหล็ก: งานเก็บสมุนไพรพื้นฐานคืองานง่าย ปลอดภัย แต้มบริจาคน้อย และสมาชิกเลือกได้ว่าจะบริจาคหรือเก็บไว้หลอมยาเอง
 * ไม่มี roll บาดเจ็บหรือบังคับต่อสู้ในงานเก็บสมุนไพรพื้นฐานประจำวัน */
(function (g) {
  'use strict';
  const { U, MAP, AI, CULT, ECO, SECT, JD, HC, CPE } = g;
  const clamp = U.clamp;
  const WILD_RES = {
    MAX_NODES: 48,
    SAFE_NODE_RESERVE: 8
  };

  const BASIC_HERB_WEIGHTS = [
    { id: 'MAT_HERB_DEW_GRASS_1', weight: 50 },
    { id: 'MAT_HERB_CINDER_LEAF_1', weight: 40 },
    { id: 'MAT_HERB_JADE_LOTUS_2', weight: 7 },
    { id: 'MAT_HERB_MIST_ORCHID_2', weight: 3 }
  ];

  const ZONES = {
    safe_belt: { id: 'safe_belt', nameTh: 'แนวเก็บสมุนไพรปลอดภัยหน้าประตูสำนัก', x0: 80, x1: 156, y0: 135, y1: 155, safe: true },
    exterior_south: { id: 'exterior_south', nameTh: 'ทุ่งธรรมชาติทิศใต้', x0: 25, x1: 215, y0: 136, y1: 156, safe: false },
    exterior_west: { id: 'exterior_west', nameTh: 'ชายป่าไผ่ทิศตะวันตก', x0: 6, x1: 24, y0: 25, y1: 125, safe: false },
    exterior_east: { id: 'exterior_east', nameTh: 'แนวผาศิลาทิศตะวันออก', x0: 216, x1: 234, y0: 25, y1: 125, safe: false },
    exterior_north: { id: 'exterior_north', nameTh: 'ชายเขาเหมันต์ทิศเหนือ', x0: 35, x1: 205, y0: 4, y1: 14, safe: false }
  };
  WILD_RES.ZONES = ZONES;

  WILD_RES.isSafeBelt = (x, y) => MAP.isInSafeBelt(x, y);

  WILD_RES.init = W => {
    if (!W.wildResources) {
      W.wildResources = {
        version: 1,
        seq: 0,
        nextSpawnAt: W.t + 120,
        nodes: []
      };
    }
  };

  function pickMaterial(W, category) {
    const rng = W.rng;
    if (category === 'BASIC_HERB') {
      // Scarcity directives may increase an eligible ingredient's spawn weight by at most 1.5x
      const weights = BASIC_HERB_WEIGHTS.map(item => {
        let sc = 1.0;
        if (g.CPE && g.CPE.scarcity) {
          sc = clamp(g.CPE.scarcity(W, item.id), 0.8, 1.5);
        }
        return { id: item.id, w: item.weight * sc };
      });
      return rng.weighted(weights, x => x.w).id;
    }
    if (category === 'OTHER_HERB') {
      const allHerbs = (JD.ITEMS.materials || []).filter(m => !m.sourcePack && m.category === 'HERB' && !BASIC_HERB_WEIGHTS.some(b => b.id === m.id) && m.tier <= 3);
      if (allHerbs.length) return rng.weighted(allHerbs, m => 1 / (m.tier * m.tier)).id;
      return 'MAT_HERB_DEW_GRASS_1';
    }
    if (category === 'ORE') {
      const allOres = (JD.ITEMS.materials || []).filter(m => !m.sourcePack && m.category === 'ORE' && m.tier <= 3);
      if (allOres.length) return rng.weighted(allOres, m => 1 / (m.tier * m.tier)).id;
      return 'MAT_ORE_COPPER_1';
    }
    // OTHER natural gatherable materials (excluding manufactured goods such as formation flags)
    const allOthers = (JD.ITEMS.materials || []).filter(m => !m.sourcePack && (m.category === 'WOOD' || m.category === 'STONE' || m.category === 'FORMATION_PART') && !m.id.includes('FLAG') && m.tier <= 2);
    if (allOthers.length) return rng.pick(allOthers).id;
    return 'MAT_HERB_DEW_GRASS_1';
  }

  WILD_RES.spawnNode = (W, opts) => {
    opts = opts || {};
    WILD_RES.init(W);
    const state = W.wildResources;
    if (state.nodes.length >= 48) return null;

    const rng = W.rng;
    // Category weights: 70% basic recovery-pill herbs, 15% other herbs, 12% ores, 3% other naturally gatherable materials
    let cat = opts.category;
    if (!cat) {
      const roll = rng.next();
      if (roll < 0.70) cat = 'BASIC_HERB';
      else if (roll < 0.85) cat = 'OTHER_HERB';
      else if (roll < 0.97) cat = 'ORE';
      else cat = 'OTHER';
    }

    const matId = opts.materialId || pickMaterial(W, cat);
    const isBasic = BASIC_HERB_WEIGHTS.some(b => b.id === matId);

    // Zone selection: basic recovery herbs strongly favor safe_belt (reachable from gate)
    let zoneId = opts.zoneId;
    if (!zoneId) {
      if (isBasic && rng.chance(0.65)) {
        zoneId = 'safe_belt';
      } else {
        const pool = isBasic ? ['safe_belt', 'exterior_south', 'exterior_west', 'exterior_east'] : ['exterior_south', 'exterior_west', 'exterior_east', 'exterior_north'];
        zoneId = rng.pick(pool);
      }
    }
    const zone = ZONES[zoneId] || ZONES.safe_belt;

    // Find legal placement: outside wall, passable, reachable, not inside building
    const M = W.map;
    let placedX = null, placedY = null;
    const unsafeFull = state.nodes.filter(n => n.remaining > 0 && !MAP.isInSafeBelt(n.x + .5, n.y + .5)).length >= WILD_RES.MAX_NODES - WILD_RES.SAFE_NODE_RESERVE;
    const maxAttempts = 24;
    for (let i = 0; i < maxAttempts; i++) {
      const x = rng.int(zone.x0, zone.x1);
      const y = rng.int(zone.y0, zone.y1);
      if (unsafeFull && !MAP.isInSafeBelt(x + .5, y + .5)) continue;
      if (x < 3 || x >= MAP.W - 3 || y < 3 || y >= MAP.H - 3) continue;
      if (MAP.isOutsideWall && !MAP.isOutsideWall(M, x, y)) continue;
      const k = y * MAP.W + x;
      if (M.block[k] !== 0) continue;
      const t = M.terrain[k];
      if (t === MAP.T.CLIFF || t === MAP.T.WALL || t === MAP.T.WATER) continue;
      // A passable tile can still be isolated behind cliffs/water.
      if (!MAP.findPath(M, MAP.GATE_IN.x, MAP.GATE_IN.y, x, y)) continue;
      // Do not overlap exactly with another active resource node
      if (state.nodes.some(n => n.x === x && n.y === y && n.remaining > 0)) continue;
      placedX = x;
      placedY = y;
      break;
    }

    if (placedX === null) return null;

    const initialQuantity = opts.remaining != null ? opts.remaining : rng.int(1, 3);
    const node = {
      id: 'wr_' + (++state.seq),
      materialId: matId,
      category: isBasic ? 'BASIC_HERB' : cat,
      zoneId,
      x: placedX,
      y: placedY,
      remaining: initialQuantity,
      initial: initialQuantity,
      maxUnits: initialQuantity,
      claimedBy: null,
      claimUntil: 0,
      spawnedAt: W.t
    };
    state.nodes.push(node);
    return node;
  };

  WILD_RES.batchSpawn = (W, count) => WILD_RES.spawnBatch(W, count);
  WILD_RES.createNode = (W, opts) => WILD_RES.spawnNode(W, typeof opts === 'number' ? {} : opts);
  WILD_RES.leaseClaim = (W, nodeId, npcId) => {
    const node = typeof nodeId === 'object' ? nodeId : (W.wildResources?.nodes || []).find(n => n.id === nodeId);
    const npc = typeof npcId === 'object' ? npcId : (W.byId && W.byId[npcId]) || { id: npcId };
    return WILD_RES.claimNode(W, npc, node);
  };

  WILD_RES.spawnBatch = (W, count) => {
    WILD_RES.init(W);
    const state = W.wildResources;
    const freeSlots = 48 - state.nodes.filter(n => n.remaining > 0).length;
    if (freeSlots <= 0) return [];
    const n = Math.min(count != null ? count : W.rng.int(1, 3), freeSlots);
    const spawned = [];
    for (let i = 0; i < n; i++) {
      const node = WILD_RES.spawnNode(W);
      if (node) spawned.push(node);
    }
    return spawned;
  };

  WILD_RES.claimNode = (W, npc, node, durationMinutes) => {
    if (!W || !npc || !node || node.remaining <= 0) return false;
    const now = W.t;
    // If claimed by someone else and lease has not expired, cannot claim
    if (node.claimedBy && node.claimedBy !== npc.id && now < node.claimUntil) {
      return false;
    }
    node.claimedBy = npc.id;
    node.claimUntil = now + (durationMinutes || 90);
    return true;
  };

  WILD_RES.releaseClaim = (W, a, b) => {
    if (!W || !W.wildResources) return;
    const idA = a ? (typeof a === 'string' ? a : a.id) : null;
    const idB = b ? (typeof b === 'string' ? b : b.id) : null;
    for (const node of W.wildResources.nodes) {
      if (node.claimedBy === idA || node.claimedBy === idB || (idA && node.id === idA && (!idB || node.claimedBy === idB))) {
        node.claimedBy = null;
        node.claimUntil = 0;
      }
    }
  };

  WILD_RES.harvestNode = (W, npc, nodeId) => {
    if (!W || !npc || npc.dead || npc.away) return { ok: false, reason: 'invalid_npc' };
    WILD_RES.init(W);
    const state = W.wildResources;
    const nodeIndex = state.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex < 0) return { ok: false, reason: 'node_depleted' };
    const node = state.nodes[nodeIndex];
    if (node.remaining <= 0) {
      state.nodes.splice(nodeIndex, 1);
      return { ok: false, reason: 'node_depleted' };
    }
    // Verify claim ownership
    if (node.claimedBy && node.claimedBy !== npc.id && W.t < node.claimUntil) {
      return { ok: false, reason: 'claimed_by_other' };
    }
    // Verify distance: valid harvesting distance within 2.5 tiles
    const dist = Math.hypot(npc.x - (node.x + 0.5), npc.y - (node.y + 0.5));
    if (dist > 3.0) {
      return { ok: false, reason: 'out_of_range', dist };
    }

    // Units awarded: smooth gradual extraction scaling with skill and life-path
    const isOre = node.category === 'ORE';
    const lifePath = isOre ? 'mining' : 'herbalism';
    const skillVal = isOre ? (npc.h.skills.mining || 0) : (npc.h.skills.herbalism || 0);
    const lifeMult = (g.MARTIAL && g.MARTIAL.lifeMult) ? g.MARTIAL.lifeMult(npc, lifePath) : 1.0;
    let requestedUnits = 1;
    if (node.remaining >= 2) {
      // Smooth gradual bonus chance from 5% at skill 0 to 45% at skill 100
      const extraChance = clamp(0.05 + (skillVal / 100) * 0.35 + (lifeMult > 1 ? 0.08 : 0), 0.05, 0.48);
      if (W.rng.chance(extraChance)) {
        requestedUnits = 2;
      }
    }
    const awarded = Math.min(requestedUnits, node.remaining);
    node.remaining -= awarded;

    // Put exactly awarded units into personal bag
    npc.inv = npc.inv || {};
    npc.inv.mats = npc.inv.mats || {};
    npc.inv.mats[node.materialId] = (npc.inv.mats[node.materialId] || 0) + awarded;

    // Release lease
    node.claimedBy = null;
    node.claimUntil = 0;

    // Remove depleted node from active list
    if (node.remaining <= 0) {
      state.nodes.splice(nodeIndex, 1);
    }

    // Practice skill
    const skillKey = isOre ? 'mining' : 'herbalism';
    if (g.MARTIAL && g.MARTIAL.skillPractice) g.MARTIAL.skillPractice(npc, skillKey, 0.6, 1.2);
    else HC.practice(npc, skillKey, 0.6, 1.2);

    return {
      ok: true,
      materialId: node.materialId,
      qty: awarded,
      remaining: node.remaining,
      nodeId: node.id,
      category: node.category,
      zoneId: node.zoneId
    };
  };

  WILD_RES.tick = W => {
    WILD_RES.init(W);
    const state = W.wildResources;

    // Auto-clean expired claims
    for (const node of state.nodes) {
      if (node.claimedBy && W.t >= node.claimUntil) {
        node.claimedBy = null;
        node.claimUntil = 0;
      }
    }

    // Attempt batch spawn every 120 game minutes using simulation time and W.rng
    if (W.t >= state.nextSpawnAt) {
      state.nextSpawnAt = W.t + 120;
      const activeCount = state.nodes.filter(n => n.remaining > 0).length;
      if (activeCount < 48) {
        const batch = W.rng.int(1, 3);
        WILD_RES.spawnBatch(W, batch);
      }
    }

    // Filter out depleted nodes
    state.nodes = state.nodes.filter(n => n.remaining > 0);
  };

  /* ---------- AI Action: gatherWildResource ---------- */
  function pickBestResourceNode(W, n) {
    if (!W.wildResources || !W.wildResources.nodes.length) return null;
    const now = W.t;
    const candidates = W.wildResources.nodes.filter(node => {
      if (node.remaining <= 0) return false;
      if (node.claimedBy && node.claimedBy !== n.id && now < node.claimUntil) return false;
      const basic = BASIC_HERB_WEIGHTS.some(b => b.id === node.materialId);
      const beginner = CULT.worldRank(n) <= 1 || CULT.power(n) < 100;
      if ((basic || beginner) && !MAP.isInSafeBelt(node.x + .5, node.y + .5)) return false;
      return true;
    });
    if (!candidates.length) return null;

    const isWeak = CULT.worldRank(n) <= 1 || CULT.power(n) < 100;
    // Cultivation beginners prioritize safe work, independently of sect title.
    const scored = candidates.map(node => {
      const dist = Math.hypot(n.x - node.x, n.y - node.y);
      const isBasic = BASIC_HERB_WEIGHTS.some(b => b.id === node.materialId);
      const inSafe = WILD_RES.isSafeBelt(node.x, node.y);
      let s = 100 - dist;
      if (inSafe) s += 40;
      if (isBasic) s += 30;
      if (isWeak && !inSafe) s -= 60;
      // Add scarcity bonus from sect shortage
      if (g.CPE && g.CPE.scarcity) {
        s += g.CPE.scarcity(W, node.materialId) * 15;
      }
      return { node, s };
    });
    scored.sort((a, b) => b.s - a.s);
    for (const { node } of scored) {
      const path = MAP.findPath(W.map, n.x, n.y, node.x, node.y);
      if (!path) continue;
      const basic = BASIC_HERB_WEIGHTS.some(b => b.id === node.materialId);
      if (basic && path.some(([x, y]) => MAP.isOutsideWall(W.map, x + .5, y + .5) && !MAP.isInSafeBelt(x + .5, y + .5))) continue;
      return node;
    }
    return null;
  }

  AI.ACTS.gatherWildResource = {
    nameTh: 'เก็บสมุนไพร/แร่นอกกำแพง',
    icon: '🌿',
    color: '#76b885',
    can: (n, W) => {
      if (n.dead || n.away || n.travel || (n.inj && n.inj.length > 0)) return false;
      if (n.h.state.energy < 20 || n.h.state.satiety < 15) return false;
      if (!W.wildResources || !W.wildResources.nodes.length) return false;
      return W.wildResources.nodes.some(node => node.remaining > 0 && (!node.claimedBy || node.claimedBy === n.id || W.t >= node.claimUntil));
    },
    score(n, W, S) {
      // Safe, easy economic role: highest priority for beginner/low-rank disciples
      const e = p => HC.eff(n, p);
      const herbInt = e('interests.herbs') + e('interests.labor');
      const isLowRank = CULT.worldRank(n) <= 1;
      S.add('ชอบงานเก็บของป่าและสมุนไพร', (herbInt - 80) / 60);

      // Supply and demand modulation: avoid crowding out cultivation when sect reserves are full
      const totalBasicStock = BASIC_HERB_WEIGHTS.reduce((sum, b) => sum + (W.sect.stock[b.id] || 0), 0);
      if (totalBasicStock > 80) {
        S.add('คลังสมุนไพรมีสำรองเหลือเฟือ', -0.6);
      } else if (totalBasicStock < 25) {
        S.add('คลังสมุนไพรขาดแคลน', 0.8);
      }

      // Member CP poverty vs wealth
      if (n.cp < 50) {
        S.add('ขาดแคลนแต้มผลงาน ต้องการงานพื้นฐาน', 0.7);
      } else if (n.cp > 300) {
        S.add('มีแต้มผลงานเพียงพอ มุ่งเน้นฝึกฝน', -0.5);
      } else {
        S.add('ต้องการสะสมแต้มคุณูปการ', 0.4);
      }

      if (isLowRank) S.add('งานปลอดภัยสำหรับศิษย์ใหม่', 1.0);
      const p = n.post;
      if (p === 'medicine' || p === 'apothecary' || p === 'herbs') S.add('หน้าที่เก็บสมุนไพร', 1.5);
    },
    where(W, n) {
      const node = pickBestResourceNode(W, n);
      if (!node) return null;
      // Lease claim during journey and harvesting
      if (!WILD_RES.claimNode(W, n, node, 90)) return null;
      return {
        pos: { x: node.x + 0.5, y: node.y + 0.5 },
        nodeId: node.id
      };
    },
    start(n, W, ctx) {
      if (!ctx || !ctx.nodeId) return false;
      const node = W.wildResources?.nodes.find(node => node.id === ctx.nodeId);
      if (!node || node.remaining <= 0) return false;
      return WILD_RES.claimNode(W, n, node, 90);
    },
    dur: n => {
      const maxSkill = Math.max(n.h.skills?.herbalism || 0, n.h.skills?.mining || 0);
      const lifeBonus = (g.MARTIAL && g.MARTIAL.lifeMult ? g.MARTIAL.lifeMult(n, 'herbalism') : 1) > 1 ? 5 : 0;
      return Math.round(clamp(60 - (maxSkill / 100) * 18 - lifeBonus, 40, 60));
    },
    tick(n) {
      n.h.state.energy = Math.max(5, n.h.state.energy - 0.04);
    },
    interrupt(n, W) {
      WILD_RES.releaseClaim(W, n);
    },
    done(n, W, ctx) {
      if (!ctx || !ctx.nodeId) return;
      const res = WILD_RES.harvestNode(W, n, ctx.nodeId);
      if (!res.ok) {
        WILD_RES.releaseClaim(W, n);
        return;
      }

      const matName = ECO.name(res.materialId);
      W.log('harvest', n.h.name.given + ' เดินทางไปเก็บ ' + matName + ' ×' + res.qty + ' นอกกำแพงสำนัก', [n.id]);

      // Post-harvest choice: Retain for personal crafting or Donate to sect
      // Members evaluate medical need, recipe completion, CP balance, sect shortage, and personality
      let shouldKeep = false;
      const knownPersonal = Array.from(new Set([...(n.inv?.recipes || []), ...(n.recipes || [])]));
      const canPersonalBrew = (n.h.skills.ALCHEMY || 0) >= 10 || HC.eff(n, 'interests.herbs') >= 30 || n.post === 'alchemy' || (n.inj && n.inj.length > 0) || (n.h.state.hp < CULT.hpMax(n) * 0.75);
      const candidateRecipeIds = Array.from(new Set([
        ...knownPersonal,
        ...(canPersonalBrew ? ['BASIC_HP', 'BASIC_QI', 'BASIC_VIGOR', 'BASIC_WOUND', ...((n.h.skills.ALCHEMY || 0) >= 30 ? ['BASIC_HP2', 'BASIC_QI2'] : [])] : [])
      ]));

      // Check if any candidate recipe uses this material
      const matchingRecipes = candidateRecipeIds.map(rid => ECO.recipeById[rid]).filter(r => r && r.inputs.some(inp => inp.matId === res.materialId));

      if (matchingRecipes.length > 0) {
        let keepScore = 0;
        let donateScore = 1.0; // Baseline inclination to donate to sect for community standing

        // 1. Immediate medical need: Injured or low HP without sufficient healing pills
        const hpFrac = n.h.state.hp / CULT.hpMax(n);
        const isHurt = (n.inj && n.inj.length > 0) || hpFrac < 0.75;
        const ownedHealPills = (n.inv?.pills?.['P:BASIC_HP'] || 0) + (n.inv?.craftedPills || []).filter(p => p.qty > 0 && p.key && ECO.pillInfo(p.key)?.effect?.healHealth).length;
        const healsNeed = matchingRecipes.some(r => {
          const key = r.outItemId || 'P:' + r.id;
          return ECO.pillInfo(key)?.effect?.healHealth;
        });

        if (isHurt && healsNeed) {
          if (ownedHealPills < 2) keepScore += 2.5;
          else if (ownedHealPills >= 3) donateScore += 1.5;
        }

        // 2. Recipe readiness: Already holding other inputs in personal inventory
        const hasOtherInputs = matchingRecipes.some(r => {
          const otherInputs = r.inputs.filter(inp => inp.matId !== res.materialId);
          return otherInputs.length > 0 && otherInputs.some(inp => (n.inv?.mats?.[inp.matId] || 0) > 0);
        });
        if (hasOtherInputs) keepScore += 1.8;

        // 3. Contribution point situation: Broke members donate for points, wealthy members retain
        if (n.cp < 40) donateScore += 2.2;
        else if (n.cp > 180) keepScore += 1.2;

        // 4. Sect shortage vs loyalty
        const scarcity = (g.CPE && g.CPE.scarcity) ? g.CPE.scarcity(W, res.materialId) : 1.0;
        const loyalty = HC.eff(n, 'personality.loyalty');
        const wealthVal = HC.eff(n, 'values.wealthResource');
        if (scarcity > 1.25) {
          if (loyalty >= 45) donateScore += 1.8;
          else if (wealthVal > 60) keepScore += 1.0;
        }

        // 5. Crafting enthusiasm, skill and prudence
        const craftSkill = n.h.skills.ALCHEMY || 0;
        keepScore += (craftSkill / 50);
        keepScore += (HC.eff(n, 'interests.herbs') - 50) / 80;
        keepScore += (wealthVal - 50) / 100;
        keepScore += (HC.eff(n, 'personality.prudence') - 50) / 100;

        if (keepScore > donateScore && W.rng.chance(0.85)) {
          shouldKeep = true;
        }
      }

      if (shouldKeep) {
        W.log('craft', n.h.name.given + ' เก็บ ' + matName + ' ×' + res.qty + ' ไว้ในกระเป๋าส่วนตัวเพื่อใช้หลอมโอสถ', [n.id]);
      } else {
        // Donate to sect stock for CP reward
        SECT.donateMat(W, n, res.materialId, res.qty);
      }
    }
  };

  g.WILD_RES = WILD_RES;
  if (typeof module === 'object' && module.exports) module.exports = WILD_RES;
})(typeof globalThis !== 'undefined' ? globalThis : this);
