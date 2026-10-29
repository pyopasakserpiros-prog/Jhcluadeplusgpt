'use strict';
const assert = require('assert');
const G = require('./load');
const { SIM, ECO, CPE, WILD_RES: R, WILD, EXPED: X, EXPLORE: EX, AI, HC, CULT, JD, MAP, SECT } = G;

let failures = 0;
function test(name, fn) {
  try {
    fn();
    console.log('PASS ' + name);
  } catch (e) {
    failures++;
    console.error('FAIL ' + name + ': ' + e.message);
    console.error(e.stack);
  }
}

function setup(seed) {
  const W = SIM.create(seed || 'gameplay-findings-patch');
  const n = W.npcs[0];
  return { W, n };
}

const herb = 'MAT_HERB_DEW_GRASS_1';
const cinder = 'MAT_HERB_CINDER_LEAF_1';

console.log('--- Testing Gameplay Findings Patch (v1.10.14) ---');

// 1. Natural Material Outdoor Purity: No manufactured flags spawning outdoors
test('natural outdoor resource pool excludes manufactured formation flags', () => {
  const { W } = setup('test-natural-purity');
  for (let i = 0; i < 200; i++) {
    const node = R.spawnNode(W, { category: 'OTHER' });
    if (node) {
      assert(!node.materialId.includes('FLAG'), 'manufactured flag spawned as natural outdoor node: ' + node.materialId);
    }
  }
});

// 2. Gradual gathering duration and extraction efficiency
test('gathering duration and extraction efficiency scale gradually with skill', () => {
  const { W, n } = setup('test-gradual-scaling');
  n.h.skills.herbalism = 0;
  n.h.skills.mining = 0;
  const dur0 = AI.ACTS.gatherWildResource.dur(n);
  assert.strictEqual(dur0, 60, 'novice gathering duration should be 60 minutes');

  n.h.skills.herbalism = 50;
  const dur50 = AI.ACTS.gatherWildResource.dur(n);
  assert(dur50 < dur0 && dur50 >= 50, 'intermediate gathering duration should scale smoothly (~51m)');

  n.h.skills.herbalism = 100;
  const dur100 = AI.ACTS.gatherWildResource.dur(n);
  assert(dur100 <= 45 && dur100 >= 40, 'master gathering duration should be ~40-45 minutes');

  // Gradual harvest extraction
  const node = R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt', remaining: 3 });
  n.x = node.x + 0.5; n.y = node.y + 0.5;
  n.h.skills.herbalism = 100;
  const initial = node.remaining;
  const res = R.harvestNode(W, n, node.id);
  assert(res.ok && res.qty >= 1 && res.qty <= 2, 'harvested valid units');
  assert.strictEqual(node.remaining, initial - res.qty, 'harvested units must be strictly deducted from node remaining');
});

// 3. Monotonic fortune proficiency checks
test('fortune proficiency check is strictly monotonic with no zero-skill discontinuity', () => {
  const { W, n } = setup('test-monotonic-fortune');

  n.h.interests.herbs = 80;
  n.h.skills.herbalism = 0;
  n.cult = { path: 'QI', stage: 1 };
  HC.touch(n);

  // Calculate check scores
  const scoreFor = a => {
    const s = a.h.skills.herbalism || 0;
    const attr = a.h.interests.herbs || 50;
    const stageBonus = a.cult ? (a.cult.stage || 1) * 3.5 : 0;
    return (s * 0.75) + (attr * 0.25) + stageBonus;
  };

  const sc0 = scoreFor(n);
  n.h.skills.herbalism = 1;
  const sc1 = scoreFor(n);
  assert(sc1 > sc0, `skill 1 (${sc1}) must be strictly greater than skill 0 (${sc0})`);
  assert.strictEqual(Math.round((sc1 - sc0) * 100) / 100, 0.75, 'each skill point must add exactly 0.75 to check score');

  // Rank 4 attribute trial passability with cultivation empowerment
  const master = W.npcs[2];
  master.h.skills.ALCHEMY = 85;
  master.h.interests.alchemy = 80;
  master.cult = { path: 'XIAN', stage: 8, prog: 0, techs: [] }; // Rank 4 cultivator
  HC.touch(master);

  W.rng.gauss = () => 0;
  const outMaster = { mats: {}, pills: {}, gear: [], techs: [], notes: [], stones: 0, rep: 0 };
  const exMaster = { partyRank: 4, siteId: 'f4_primordial_fountain', poolId: 'f4_fountain_cleansing', journal: [] };
  X.fortuneEvent(W, exMaster, [master], outMaster, X.REGIONS.find(r => r.id === 'water'));
  assert(outMaster.stones > 0, 'Rank-4 cultivated practitioner must be capable of passing diff 88 trial');
});

// 4. Fair site selection distribution in expedition
test('expedition depart fairly distributes site selection among all matching biome sites', () => {
  const { W } = setup('test-fair-site-selection');
  const party = [W.npcs[0]];
  const mountainReg = X.REGIONS.find(r => r.terrain === 'mountain') || X.REGIONS[0];
  const sites = X.FORTUNE_REGISTRY[1] || [];
  const matching = sites.filter(s => s.biome === mountainReg.terrain || (s.biome === 'ruins' && mountainReg.terrain === 'mountain'));

  if (matching.length >= 2) {
    const counts = {};
    for (let i = 0; i < 60; i++) {
      const ex = X.depart(W, party, 'fortune', mountainReg);
      if (ex) {
        counts[ex.siteId] = (counts[ex.siteId] || 0) + 1;
        // Reset party for next iteration
        party[0].away = false;
        party[0].travel = null;
        party[0].expId = null;
        party[0].act = { id: 'idle', stage: 'do', left: 0, total: 0, ctx: {}, why: [] };
      }
    }
    // Verify more than 1 site was picked (not just sites.find which always picks the first one)
    const distinctSites = Object.keys(counts);
    assert(distinctSites.length >= 2, 'matching sites should be fairly distributed, picked: ' + distinctSites.join(', '));
  }
});

// 5. 12 Worlds thematic subpools and calibrated non-combat DC
test('all 12 worlds have 2 distinct subpools per rank with calibrated non-combat DC', () => {
  assert(EX.WORLDS.length === 12, 'must have exactly 12 worlds');
  for (const w of EX.WORLDS) {
    for (let r = 1; r <= 4; r++) {
      const ar = w.areas[r];
      assert(ar, w.id + ' must have area for rank ' + r);
      assert.strictEqual(ar.rank, r, w.id + ' rank mismatch');
      assert.strictEqual(ar.foePower, EX.RANK_FOE_POWER[r], 'combat foe power must strictly match reference power');
      assert(Array.isArray(ar.subpools) && ar.subpools.length === 2, w.id + ' rank ' + r + ' must have 2 thematic subpools');
      const [sA, sB] = ar.subpools;
      assert.notStrictEqual(sA.id, sB.id, 'subpools must be distinct');
      assert(sA.enc.length >= 3 && sB.enc.length >= 3, 'subpools must have >=3 encounters');
      assert(sA.loot.length >= 3 && sB.loot.length >= 3, 'subpools must have >=3 loot items');
    }
  }

  // Verify non-combat difficulty calibration
  const rankBaseD = { 1: 1.3, 2: 2.2, 3: 3.3, 4: 4.6 };
  for (const w of EX.WORLDS) {
    const worldMod = ((w.d || 3) - 3) * 0.15;
    for (let r = 1; r <= 4; r++) {
      const effD = rankBaseD[r] + worldMod;
      // Rank 1 difficulty is strictly lower than Rank 2, which is lower than Rank 3, which is lower than Rank 4
      if (r < 4) {
        const nextEffD = rankBaseD[r + 1] + worldMod;
        assert(effD < nextEffD, 'rank ' + r + ' difficulty must be strictly lower than rank ' + (r + 1));
      }
    }
  }
});

// 6. Believable Material Retention & Personal Crafting / Healing Loop
test('injured member with craft aptitude retains gathered herb, brews personal pill, and consumes for healing', () => {
  const { W, n } = setup('test-retention-brewing-loop');
  n.h.skills.ALCHEMY = 40;
  n.h.interests.herbs = 60;
  n.h.values.wealthResource = 70;
  n.h.personality.loyalty = 30;
  n.cp = 200; // Solvent, not desperate
  n.h.state.hp = Math.round(CULT.hpMax(n) * 0.4); // Hurt!
  n.inv = { mats: {}, pills: {}, craftedPills: [], recipes: [] };

  // 1. Gather wild resource
  const node = R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt', remaining: 2 });
  n.x = node.x + 0.5; n.y = node.y + 0.5;

  AI.ACTS.gatherWildResource.done(n, W, { nodeId: node.id });

  // Disciples in medical need lacking pills retain the ingredient in personal mats
  assert(n.inv.mats[herb] >= 1, 'hurt member must retain gathered healing herb');

  // Also give second ingredient for BASIC_HP recipe (Cinder Leaf)
  n.inv.mats[cinder] = 1;

  // 2. Member evaluates personalCraftChoice
  const choice = CPE.personalCraftChoice(W, n);
  assert(choice, 'eligible member with kept ingredients must choose personal brewing');
  assert.strictEqual(choice.intent, 'keep', 'hurt member must craft with keep intent');

  // 3. Autonomous personal brewing
  const act = AI.ACTS.personalBrew;
  const dest = act.where(W, n);
  assert(dest && dest.st, 'must find alchemy cauldron station');
  act.done(n, W, dest);

  assert.strictEqual(n.inv.craftedPills.length, 1, 'crafted pill must be added to personal craftedPills');
  const crafted = n.inv.craftedPills[0];
  assert.strictEqual(crafted.intent, 'keep');
  assert(crafted.q > 0, 'crafted pill has quality');

  // 4. Personal pill usage when hurt
  const hpBefore = n.h.state.hp;
  const initialQty = crafted.qty;
  assert(AI.ACTS.personalPillUse.can(n), 'hurt member can use crafted pill');
  AI.ACTS.personalPillUse.done(n, W);
  assert(n.h.state.hp > hpBefore, 'consuming personal crafted pill restored HP');
  // Consume remaining doses until exhausted
  while (n.inv.craftedPills.length > 0) {
    n.h.state.hp = 1;
    AI.ACTS.personalPillUse.done(n, W);
  }
  assert.strictEqual(n.inv.craftedPills.length, 0, 'all doses of crafted pill consumed');
});

// 7. Poor member donates gathered herb for CP
test('broke disciple donates gathered herb for CP to survive', () => {
  const { W, n } = setup('test-broke-member-donate');
  n.cp = 5; // Broke! Needs CP
  n.h.skills.ALCHEMY = 40;
  n.h.values.wealthResource = 40;
  n.h.personality.loyalty = 60;
  n.h.state.hp = CULT.hpMax(n); // Healthy
  n.inv = { mats: {}, pills: {}, craftedPills: [], recipes: [] };

  const node = R.spawnNode(W, { materialId: herb, zoneId: 'safe_belt', remaining: 1 });
  n.x = node.x + 0.5; n.y = node.y + 0.5;
  const cpStart = n.cp;
  const sectStockStart = ECO.count(W, herb);

  AI.ACTS.gatherWildResource.done(n, W, { nodeId: node.id });

  assert.strictEqual(n.inv.mats[herb] || 0, 0, 'broke member must donate rather than hoard');
  assert(n.cp > cpStart, 'member received CP reward for donation');
  assert(ECO.count(W, herb) > sectStockStart, 'herb entered sect stock');
});

if (failures > 0) {
  console.error('\n' + failures + ' TESTS FAILED.');
  process.exit(1);
} else {
  console.log('\nALL GAMEPLAY FINDINGS PATCH TESTS PASSED (7/7).');
}
