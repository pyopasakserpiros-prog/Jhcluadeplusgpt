'use strict';
const assert = require('assert');
const G = require('./load');
G.document = { getElementById() { return { querySelectorAll() { return []; }, style: {}, classList: { add() {}, remove() {}, toggle() {} } }; } };
require('../js/ui.js');
const { SIM, SECT, ECO, CULT, UI } = G;

console.log('Testing Phase 3: Dynamic Stock Awareness, Autonomous Stock Distribution & Log Linking/Filtering...');

// 1. Dynamic Stock Awareness & Autonomous Stock Distribution (Reserve / Sale / Gift)
{
  const W = SIM.create('phase3-stock-dist');
  const m = W.byId[W.sect.masterId];
  const disciple = W.npcs[1];

  // Create a grain shortage, then spawn grain into sect stock and verify shortage directive updates immediately
  W.sect.stock.grain = 0;
  SECT.notifyStockChanged(W, 'grain');
  assert(W.sect.shortageDirectives.some(d => d.id === 'grain'), 'Grain shortage directive must appear when grain is 0');

  SECT.EDITOR.spawnItem(W, { kind: 'PROVISION', id: 'grain', dest: 'sect', qty: 600 });
  assert(!W.sect.shortageDirectives.some(d => d.id === 'grain'), 'Spawning grain must immediately clear grain shortage directive via notifyStockChanged');

  // Spawn equipment, non-basic pill, and specialization crystal into sect stock
  const weaponRecipe = Object.values(ECO.recipeById).find(r => r.outType === 'EQUIPMENT' && ECO.mintGear(r, 1).slot === 'WEAPON');
  disciple.equip.WEAPON = null;
  SECT.EDITOR.spawnItem(W, { kind: 'EQUIPMENT', id: weaponRecipe.id, dest: 'sect', qty: 2, quality: 1.2 });

  const craftedPillRecipe = Object.values(ECO.recipeById).find(r => r.outType === 'PILL' && r.effect && (r.effect.cultivationProgress || r.effect.cultivationBoost || r.effect.foundationBonus || r.effect.healInjury || r.effect.healHealth));
  const craftedPillId = craftedPillRecipe.outItemId || ('P:' + craftedPillRecipe.id);
  disciple.inj = [{ part: 'แขนขวา', sev: 1, why: 'ฝึกซ้อม' }];
  SECT.EDITOR.spawnItem(W, { kind: 'CRAFTED_PILL', id: craftedPillId, dest: 'sect', qty: 5 });

  // Also ensure basic pills are in stock and verify they are NEVER gifted via distributeSectStock
  SECT.EDITOR.spawnItem(W, { kind: 'PILL', id: 'P:BASIC_HP', dest: 'sect', qty: 10 });

  const subObj = CULT.subList.find(x => x.path === disciple.cult.path);
  disciple.cult.sub = 'NONE';
  SECT.EDITOR.spawnItem(W, { kind: 'CRYSTAL', id: subObj.sub.id, dest: 'sect', qty: 1 });

  const evalRes = SECT.evaluateStockDistribution(W);
  assert(evalRes.reserve.some(r => r.id === 'P:BASIC_HP'), 'Basic welfare pills must be kept in reserve, never in gift list');
  assert(!evalRes.gift.some(g2 => g2.id === 'P:BASIC_HP'), 'Basic welfare pills must never be classified as gifts');
  assert(evalRes.gift.some(g2 => g2.kind === 'EQUIPMENT'), 'Spawned equipment should be evaluated as eligible for gifting');

  const distRes = SECT.distributeSectStock(W);
  assert(distRes.gifted >= 2, 'distributeSectStock should allocate equipment/pill/crystal to eligible members');
  assert(W.logs.some(l => l.txKind === 'gift'), 'Gift distribution must emit structured txKind="gift" log entries');
  assert(!W.logs.some(l => l.txKind === 'gift' && String(l.text).includes(ECO.name('P:BASIC_HP'))), 'Basic pills must never produce gift logs');
  console.log('  PASS: Dynamic stock awareness, reserve protection, and autonomous gift distribution');
}

// 2. Single-Pass Positional Log Linkify (Duplicate Names, Renamed Characters, Missing IDs, Buildings)
{
  const W = SIM.create('phase3-log-links');
  const a = W.npcs[1];
  const b = W.npcs[2];

  // Give two distinct NPCs the exact same given name
  a.h.name.given = 'ชิงหลง';
  a.h.name.surname = 'หลี่';
  b.h.name.given = 'ชิงหลง';
  b.h.name.surname = 'จ้าว';

  const logEntry = W.log('relation', 'ชิงหลง ประลองกระบี่กับ ชิงหลง ที่ ลานฝึกยุทธ์', [a.id, b.id, 'training_ground']);
  const html = UI.linkify(W, logEntry.text, logEntry.ids, logEntry.refs);

  const posA = html.indexOf('data-npc="' + a.id + '"');
  const posB = html.indexOf('data-npc="' + b.id + '"');
  const posBld = html.indexOf('data-bld="training_ground"');
  assert(posA >= 0 && posB > posA, 'Duplicate given names must link 1st occurrence to 1st NPC and 2nd occurrence to 2nd NPC');
  assert(posBld > posB, 'Building name in log text must link via data-bld');

  // Rename NPC `a` after the log was created -> old log still links to `a.id`
  a.h.name.given = 'เทียนหลง';
  const htmlAfterRename = UI.linkify(W, logEntry.text, logEntry.ids, logEntry.refs);
  assert(htmlAfterRename.includes('data-npc="' + a.id + '"'), 'Renamed NPC must still be linked accurately via stored log refs');

  // Deleted / missing NPC ID in legacy log -> renders safe non-crashing span
  const htmlDeleted = UI.linkify(W, 'ศิษย์นิรนามเดินทางออกจากสำนัก', ['n_deleted_999']);
  assert(htmlDeleted.includes('data-npc="n_deleted_999"'), 'Missing NPC ID should render a safe reference chip without throwing');

  // Precision log sub-filters
  UI.G = { W, R: {}, opts: {}, acc: 0, speed: 1 };
  UI.tab = 'all';
  UI.logFilters = new Set(['all']);
  W.log('finance', 'ศิษย์กินโอสถพื้นฐานฟื้นฟูร่างกาย', [a.id]);
  for (const sub of ['all', 'no_pill', 'gift', 'trade', 'spawn']) {
    UI.logSubFilter = sub;
    const logHtml = UI.rLog();
    assert(typeof logHtml === 'string' && !logHtml.includes('undefined'));
    if (sub === 'no_pill') {
      assert(!logHtml.includes('กินโอสถพื้นฐาน'), 'no_pill sub-filter must hide routine daily pill logs');
    }
  }
  console.log('  PASS: Single-pass positional log linking (duplicate names, renames, buildings, deleted IDs) & sub-filters');
}

// 3. Save / Load Round-Trip Integrity After Phase 1-3 Operations
{
  const W = SIM.create('phase3-save-roundtrip');
  SECT.upgradeBuildingTo(W, 'dorm_outer', 4);
  SECT.EDITOR.applyCharacterEdit(W, W.npcs[1].id, { physiology: { strength: 85 }, economy: { stones: 500 } });
  SECT.EDITOR.spawnItem(W, { kind: 'MATERIAL', id: 'MAT_HERB_DEW_GRASS_1', dest: 'npc', npcId: W.npcs[1].id, qty: 3 });
  const raw = SIM.serialize(W);
  const restored = SIM.deserialize(raw);
  assert.strictEqual(SECT.housingCapacity(restored), SECT.housingCapacity(W));
  assert.strictEqual(restored.byId[W.npcs[1].id].h.physiology.strength, 85);
  assert.strictEqual(restored.byId[W.npcs[1].id].inv.spawnedMats.MAT_HERB_DEW_GRASS_1, 3);
  console.log('  PASS: Save/load round-trip preserves Phase 1-3 state');
}

console.log('ALL PHASE 3 TESTS PASSED.');
