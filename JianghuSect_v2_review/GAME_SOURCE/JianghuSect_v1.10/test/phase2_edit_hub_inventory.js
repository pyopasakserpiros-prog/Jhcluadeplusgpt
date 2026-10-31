'use strict';
const assert = require('assert');
const G = require('./load');
G.document = { getElementById() { return { querySelectorAll() { return []; }, style: {}, classList: { add() {}, remove() {}, toggle() {} } }; } };
require('../js/ui.js');
const { SIM, SECT, ECO, CULT, CPE, KNOW, CONTENT, AI, UI } = G;

console.log('Testing Phase 2: Character Editor, Item Spawner, Anti-Minting & Bag/Stock UI...');

// 1. Character Editor Validation, Reconciliation, Derived Recalculation & Undo
{
  const W = SIM.create('phase2-char-edit');
  const n = W.npcs[1];
  const beforeHpMax = CULT.hpMax(n);

  // Reject direct arbitrary overrides of derived ceilings
  const bad1 = SECT.EDITOR.previewCharacterEdit(W, n.id, { hpMax: 99999 });
  assert.strictEqual(bad1.ok, false, 'Direct hpMax override must be rejected');
  const bad2 = SECT.EDITOR.applyCharacterEdit(W, n.id, { combatPower: 50000 });
  assert.strictEqual(bad2.ok, false, 'Direct combatPower override must be rejected');
  const bad3 = SECT.EDITOR.applyCharacterEdit(W, n.id, { personality: { ambition: 150 } });
  assert.strictEqual(bad3.ok, false, 'Out-of-range stat (>100) must be rejected');
  const bad4 = SECT.EDITOR.applyCharacterEdit(W, n.id, { cult: { path: 'GOD', stage: 7 } });
  assert.strictEqual(bad4.ok, false, 'Stage exceeding path maxStage must be rejected');
  const bad5 = SECT.EDITOR.applyCharacterEdit(W, n.id, { cult: { path: 'BODY', sub: 'SWORD_IMMORTAL' } });
  assert.strictEqual(bad5.ok, false, 'Incompatible subpath for path must be rejected');

  // Valid edit: upgrade physiology + cultivation to XIAN stage 4 (SWORD_IMMORTAL)
  const res = SECT.EDITOR.applyCharacterEdit(W, n.id, {
    physiology: { vitality: 92, toughness: 88, meridianCapacity: 90 },
    cult: { path: 'XIAN', sub: 'FROST_MOON_IMMORTAL', stage: 4, xp: 500 },
    economy: { stones: 777, cp: 120, merit: 85, sat: 90 }
  });
  assert(res.ok, 'Valid character edit must succeed');
  assert(CULT.hpMax(n) > beforeHpMax, 'Derived hpMax must increase after vitality and stage increase');
  assert.strictEqual(n.cult.path, 'XIAN');
  assert.strictEqual(n.cult.sub, 'FROST_MOON_IMMORTAL');
  assert.strictEqual(n.cult.stage, 4);
  assert(n.cult.track && n.cult.track.subPath === 'FROST_MOON_IMMORTAL', 'Specialization track must be reconciled with new subpath');
  assert.strictEqual(n.inv.stones, 777);
  assert.strictEqual(n.cp, 120);

  // Equip a XIAN-only high-stage item, then switch character to MORTAL and verify gear is safely unequipped to sect.gear
  const xianRecipe = Object.values(ECO.recipeById).find(r => r.outType === 'EQUIPMENT' && r.minStage >= 2) || Object.values(ECO.recipeById).find(r => r.outType === 'EQUIPMENT');
  const gear = ECO.mintGear(W, xianRecipe, 1.1, true);
  gear.minStage = 3;
  gear.compatiblePath = ['XIAN'];
  n.equip[gear.slot] = gear;
  const gearCountBefore = W.sect.gear.length;

  const toMortal = SECT.EDITOR.applyCharacterEdit(W, n.id, { cult: { path: 'MORTAL', stage: 0 } });
  assert(toMortal.ok, 'Switching to MORTAL must succeed');
  assert.strictEqual(n.cult, null, 'Mortal character must have cult === null');
  assert.strictEqual(n.equip[gear.slot], null, 'Incompatible gear must be unequipped on path/stage downgrade');
  assert.strictEqual(W.sect.gear.length, gearCountBefore + 1, 'Unequipped gear must be returned to W.sect.gear, never destroyed');

  // Undo restores previous state
  const undo1 = SECT.EDITOR.undoLastEdit(W);
  assert(undo1.ok);
  assert.strictEqual(n.cult.path, 'XIAN');
  assert.strictEqual(n.cult.stage, 4);

  // Dead / exiled NPC edit guard
  const deadNpc = W.npcs[2];
  deadNpc.dead = true;
  const deadEdit = SECT.EDITOR.applyCharacterEdit(W, deadNpc.id, { economy: { stones: 100 } });
  assert.strictEqual(deadEdit.ok, false, 'Dead NPC must not be editable');
  deadNpc.dead = false;
  console.log('  PASS: Character editor validation, cultivation/gear reconciliation, derived stats, and undo');
}

// 2. Item Spawner Across All Categories & Strict Anti-Minting Guarantees
{
  const W = SIM.create('phase2-spawner');
  const n = W.npcs[1];
  const cpBefore = n.cp || 0;
  const mintedBefore = CPE.S(W).minted || 0;

  // Catalog filtering
  const allCat = SECT.EDITOR.catalog(W, {});
  assert(allCat.length > 50, 'Catalog should expose all provisions, materials, pills, gear, manuals, crystals, scrolls, and organs');

  // Reject invalid quantities
  assert.strictEqual(SECT.EDITOR.spawnItem(W, { kind: 'PROVISION', id: 'stones', dest: 'sect', qty: 0 }).ok, false);
  assert.strictEqual(SECT.EDITOR.spawnItem(W, { kind: 'PROVISION', id: 'stones', dest: 'sect', qty: -5 }).ok, false);

  // Spawn into sect stock
  const stonesBefore = W.sect.stones;
  assert(SECT.EDITOR.spawnItem(W, { kind: 'PROVISION', id: 'stones', dest: 'sect', qty: 500 }).ok);
  assert.strictEqual(W.sect.stones, stonesBefore + 500);

  // Spawn material into personal bag -> donate via SECT.donateMat -> 0 CP minted
  const matId = 'MAT_HERB_DEW_GRASS_1';
  const sectMatBefore = ECO.count(W, matId);
  assert(SECT.EDITOR.spawnItem(W, { kind: 'MATERIAL', id: matId, dest: 'npc', npcId: n.id, qty: 4 }).ok);
  const donMat = SECT.donateMat(W, n, matId, 2);
  assert(donMat.ok && donMat.reward === 0 && donMat.playerSpawned === true, 'Donating player-spawned material via SECT.donateMat must mint 0 CP');
  assert.strictEqual(ECO.count(W, matId), sectMatBefore + 2, 'Donated spawned material must still transfer to sect stock');

  // Remaining 2 spawned materials donated via AI.ACTS.donate.done -> 0 CP minted
  AI.ACTS.donate.done(n, W);
  assert.strictEqual(n.cp || 0, cpBefore, 'AI.ACTS.donate.done must mint 0 CP for player-spawned materials');

  // Spawn Pill into personal bag -> donate via ECO.donatePersonalProduct -> 0 CP minted
  assert(SECT.EDITOR.spawnItem(W, { kind: 'PILL', id: 'P:BASIC_HP', dest: 'npc', npcId: n.id, qty: 2 }).ok);
  const donPill = ECO.donatePersonalProduct(W, n, { kind: 'PILL', pillKey: 'P:BASIC_HP', qty: 2 });
  assert(donPill.ok && donPill.reward === 0, 'Donating player-spawned pill must mint 0 CP');

  // Spawn Equipment into personal bag -> equip -> unequip -> donate -> 0 CP minted
  const eqRecipe = Object.values(ECO.recipeById).find(r => r.outType === 'EQUIPMENT');
  const spEq = SECT.EDITOR.spawnItem(W, { kind: 'EQUIPMENT', id: eqRecipe.id, dest: 'npc', npcId: n.id, qty: 2, quality: 1.15 });
  assert(spEq.ok && spEq.uids.length === 2 && spEq.uids[0] !== spEq.uids[1], 'Spawned equipment instances must have unique UIDs');
  const eqRes = SECT.EDITOR.equipPersonalGear(W, n.id, spEq.uids[0]);
  assert(eqRes.ok);
  const unEqRes = SECT.EDITOR.unequipGear(W, n.id, eqRes.equipped.slot, false);
  assert(unEqRes.ok);
  const donEq = SECT.EDITOR.donatePersonalGear(W, n.id, spEq.uids[0]);
  assert(donEq.ok && donEq.reward === 0 && donEq.playerSpawned === true, 'Donating player-spawned gear must mint 0 CP');

  // Spawn Crystal, Tech Manual, Recipe Scroll, Organ into personal bag -> donate -> 0 CP minted
  const subId = CULT.subList[0].sub.id;
  assert(SECT.EDITOR.spawnItem(W, { kind: 'CRYSTAL', id: subId, dest: 'npc', npcId: n.id, qty: 1 }).ok);
  const donCr = G.MARTIAL.donateCrystal(W, n, G.MARTIAL.subKey(subId)); assert(donCr.ok && donCr.reward === 0);

  const techId = G.JD.EXPANSION.techniques[0].id;
  W.sect.library = W.sect.library.filter(x => x !== techId);
  assert(SECT.EDITOR.spawnItem(W, { kind: 'TECH_MANUAL', id: techId, dest: 'npc', npcId: n.id, qty: 1 }).ok);
  const donMan = G.MARTIAL.donateManual(W, n, techId); assert(donMan.ok && donMan.reward === 0);

  const recId = G.JD.EXPANSION.recipes[0].id;
  W.sect.knownRecipes = W.sect.knownRecipes.filter(x => x !== recId);
  assert(SECT.EDITOR.spawnItem(W, { kind: 'RECIPE_SCROLL', id: recId, dest: 'npc', npcId: n.id, qty: 1 }).ok);
  const donRec = CONTENT.donateRecipe(W, n, recId);
  assert(donRec.ok && donRec.reward === 0 && donRec.playerSpawned === true, 'Donating player-spawned recipe scroll must mint 0 CP');

  const orgId = G.CONTENT.rareOrgans[0].id;
  assert(SECT.EDITOR.spawnItem(W, { kind: 'ORGAN', id: orgId, dest: 'npc', npcId: n.id, qty: 1 }).ok);
  const donOrg = CONTENT.donateOrgan(W, n, orgId, 1);
  assert(donOrg.ok && donOrg.reward === 0 && donOrg.playerSpawned === true, 'Donating player-spawned organ must mint 0 CP');

  assert.strictEqual(n.cp || 0, cpBefore, 'Total CP after donating all player-spawned item types must remain unchanged');
  assert.strictEqual(CPE.S(W).minted || 0, mintedBefore, 'Global CPE.minted must not increase from player-spawned donations');

  // Render UI Edit Hub, Sect Stock, and NPC Personal Bag without errors or state mutation
  UI.G = { W, R: { selected: n.id }, opts: {}, acc: 0, speed: 1 };
  UI.editNpcId = n.id;
  for (const t of ['char', 'spawn', 'bag', 'backup']) {
    UI.tab = t;
    const h = UI.rEdit();
    assert(typeof h === 'string' && h.length > 50 && !h.includes('undefined') && !h.includes('NaN'));
  }
  console.log('  PASS: Item spawner across all categories, anti-minting guards, personal bag actions, and Edit Hub UI');
}

console.log('ALL PHASE 2 TESTS PASSED.');
