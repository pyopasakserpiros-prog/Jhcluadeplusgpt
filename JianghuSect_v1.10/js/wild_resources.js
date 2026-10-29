/* wild_resources.js — แหล่งทรัพยากรธรรมชาติจำกัดนอกกำแพงสำนัก (v1.10.13)
 * ระบบทรัพยากรทางกายภาพบนแผนที่เดียวกับสำนัก: สมุนไพร แร่ และวัสดุธรรมชาติ
 * กฎเหล็ก: งานเก็บสมุนไพรพื้นฐานคืองานง่าย ปลอดภัย แต้มบริจาคน้อย และสมาชิกเลือกได้ว่าจะบริจาคหรือเก็บไว้หลอมยาเอง
 * ไม่มี roll บาดเจ็บหรือบังคับต่อสู้ในงานเก็บสมุนไพรพื้นฐานประจำวัน */
(function (g) {
  'use strict';
  const { U, MAP, AI, CULT, ECO, SECT, JD, HC, CPE } = g;
  const clamp = U.clamp;
  const WILD_RES = {
    MAX_NODES: 48
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

  WILD_RES.isSafeBelt = (x, y) => {
    const sb = ZONES.safe_belt;
    return x >= sb.x0 && x <= sb.x1 && y >= sb.y0 && y <= sb.y1;
  };

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
    // OTHER natural gatherable materials
    const allOthers = (JD.ITEMS.materials || []).filter(m => !m.sourcePack && (m.category === 'WOOD' || m.category === 'STONE' || m.category === 'FORMATION_PART') && m.tier <= 2);
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
    const maxAttempts = 24;
    for (let i = 0; i < maxAttempts; i++) {
      const x = rng.int(zone.x0, zone.x1);
      const y = rng.int(zone.y0, zone.y1);
      if (x < 3 || x >= MAP.W - 3 || y < 3 || y >= MAP.H - 3) continue;
      if (MAP.isOutsideWall && !MAP.isOutsideWall(M, x, y)) continue;
      const k = y * MAP.W + x;
      if (M.block[k] !== 0) continue;
      const t = M.terrain[k];
      if (t === MAP.T.CLIFF || t === MAP.T.WALL || t === MAP.T.WATER) continue;
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

    // Units awarded: skill may improve units per action, but strictly deducted from node
    const isOre = node.category === 'ORE';
    const skillVal = isOre ? (npc.h.skills.mining || 0) : (npc.h.skills.herbalism || 0);
    let requestedUnits = 1;
    if (skillVal >= 45 && node.remaining >= 2 && W.rng.chance(0.35)) {
      requestedUnits = 2;
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
      return true;
    });
    if (!candidates.length) return null;

    const isWeak = n.rank <= 2 || CULT.power(n) < 100;
    // Rank 0..2 disciples prioritize safe belt
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
    return scored[0]?.node || null;
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
      const isLowRank = n.rank <= 2;
      S.add('ชอบงานเก็บของป่าและสมุนไพร', (herbInt - 80) / 60);
      S.add('ต้องการสะสมแต้มคุณูปการ', 0.6);
      if (isLowRank) S.add('งานปลอดภัยสำหรับศิษย์ใหม่', 1.4);
      // Extra weight if sect has shortages of basic medicine ingredients
      const dewGrassScarcity = g.CPE ? g.CPE.scarcity(W, 'MAT_HERB_DEW_GRASS_1') : 1;
      if (dewGrassScarcity > 1.2) S.add('สำนักขาดแคลนสมุนไพรพื้นฐาน', 0.8 * (dewGrassScarcity - 1));
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
    dur: () => 60, // 60 game minutes gathering action
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
      // Members who have alchemy recipes and need medicine keep ingredients in personal bag
      let shouldKeep = false;
      const knownPersonalRecipes = (n.inv && n.inv.recipes) || [];
      if (knownPersonalRecipes.length > 0 && n.h.skills.ALCHEMY >= 20) {
        // Check if any personal recipe uses this material
        for (const rid of knownPersonalRecipes) {
          const r = ECO.recipeById[rid];
          if (r && r.inputs.some(inp => inp.matId === res.materialId)) {
            // Keep if personality or personal plan favors self-sufficiency
            const wealthVal = HC.eff(n, 'values.wealthResource');
            const loyalty = HC.eff(n, 'personality.loyalty');
            if (wealthVal > loyalty && W.rng.chance(0.55)) {
              shouldKeep = true;
              break;
            }
          }
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
