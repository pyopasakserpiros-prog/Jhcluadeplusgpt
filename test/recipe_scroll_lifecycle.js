'use strict';
const assert = require('assert');
const G = require('./load.js');
const { SIM, ECO, CPE, CONTENT: C, EXPED: X, AI, EXT, JD } = G;

function world(seed) { return SIM.create(seed || 'recipe-lifecycle-test', { masterIdx: 0 }); }

// 1) Discovery creates one physical formula; held formulas are not re-discovered in the wild.
{
  const W = world('formula-single-discovery');
  const reg = JD.EXPANSION.regions[0];
  const rId = reg.recipes[0];
  const n = W.npcs[1];
  n.h.skills.SCRIPTURE = 100;
  // Place all other region recipes in knownRecipes so only rId is discoverable
  W.sect.knownRecipes = reg.recipes.filter(id => id !== rId);
  W.sect.library.push(...reg.techniques);
  const ex = { id: 501, kind: 'fortune', region: reg.id, journal: [], keepRecipes: true };
  const out = { mats: {}, pills: {}, gear: [], techs: [], recipes: [], stones: 0, notes: [] };
  const origChance = W.rng.chance;
  W.rng.chance = () => true;
  C.discover(W, ex, [n], out, reg);
  assert.deepStrictEqual(out.recipes, [rId], 'discovery must create exactly one physical formula in expedition output');
  // Second discovery attempt in the same expedition must not duplicate the formula
  C.discover(W, ex, [n], out, reg);
  assert.strictEqual(out.recipes.length, 1, 'discovery must not duplicate a formula already in out.recipes');
  W.rng.chance = origChance;

  // Handover with keepRecipes: true keeps the physical scroll in personal inventory and pays 0 CP
  const cpBefore = n.cp, mintedBefore = CPE.S(W).minted;
  const accepted = X.handover(W, ex, [n], out);
  assert(!W.sect.knownRecipes.includes(rId), 'kept formula must not enter sect knownRecipes on handover');
  assert(n.inv.recipes && n.inv.recipes.includes(rId), 'kept formula must be stored in finder personal inventory');
  assert.strictEqual(accepted.recipes.length, 0);
  assert.strictEqual(accepted.keptRecipes.length, 1);
  assert.strictEqual(n.cp, cpBefore, 'keeping a formula scroll must not mint contribution points');
  assert.strictEqual(CPE.S(W).minted, mintedBefore);

  // While n holds the physical scroll, another expedition to the same region cannot re-discover rId
  assert.strictEqual(C.formulaInWorld(W, rId), true, 'formula held in personal inventory is tracked in world');
  const out2 = { mats: {}, pills: {}, gear: [], techs: [], recipes: [], stones: 0, notes: [] };
  W.rng.chance = () => true;
  C.discover(W, { id: 502, kind: 'fortune', region: reg.id, journal: [] }, [n], out2, reg);
  W.rng.chance = origChance;
  assert.strictEqual(out2.recipes.length, 0, 'already-held physical formula cannot be discovered a second time');
}

// 2) Copy, Trade, Donate lifecycle with real ownership; duplicate donation pays 0 CP.
{
  const W = world('formula-copy-trade-donate');
  const r = JD.EXPANSION.recipes[0];
  const holder = W.npcs[1], peer = W.npcs[2], master = W.npcs[0];
  holder.inv.recipes = [r.id];
  holder.h.skills.SCRIPTURE = 40;
  holder.inv.stones = 100;
  peer.inv.stones = 200;

  // Non-owner cannot donate, trade, or copy a scroll they do not hold
  assert.strictEqual(C.donateRecipe(W, peer, r.id).ok, false, 'non-owner cannot donate formula');
  assert.strictEqual(C.tradeRecipe(W, peer, master, r.id, 30).ok, false, 'non-owner cannot trade formula');
  assert.strictEqual(C.copyRecipe(W, peer, r.id, master).ok, false, 'non-owner without library access cannot copy formula');

  // Holder copies the scroll to peer (spends stones for ink/paper, retains original scroll, peer gets physical copy)
  const stonesBeforeCopy = holder.inv.stones;
  const copyRes = C.copyRecipe(W, holder, r.id, peer);
  assert(copyRes.ok, 'literate owner should be able to copy formula scroll');
  assert(holder.inv.stones < stonesBeforeCopy, 'copying without cinnabar must spend spirit stones');
  assert(holder.inv.recipes.includes(r.id), 'original owner retains their scroll after copying to peer');
  assert(peer.inv.recipes && peer.inv.recipes.includes(r.id), 'recipient receives copied scroll in personal inventory');
  assert(C.isRecipeAuthorized(W, holder, r.id), 'transcribing a scroll grants personal recipe authorization');

  // Peer trades their scroll to master for spirit stones (no CP minted)
  const peerStonesBefore = peer.inv.stones, masterStonesBefore = master.inv.stones, cpBeforeTrade = CPE.S(W).minted;
  const price = C.recipeTradePrice(W, r.id);
  master.inv.stones = price + 50;
  const tradeRes = C.tradeRecipe(W, peer, master, r.id, price);
  assert(tradeRes.ok, 'peer should trade physical scroll to buyer for spirit stones');
  assert(!peer.inv.recipes.includes(r.id), 'seller loses scroll ownership');
  assert(master.inv.recipes.includes(r.id), 'buyer receives scroll ownership');
  assert.strictEqual(peer.inv.stones, peerStonesBefore + price, 'seller receives spirit stones');
  assert.strictEqual(master.inv.stones, 50, 'buyer pays spirit stones');
  assert.strictEqual(CPE.S(W).minted, cpBeforeTrade, 'trading a formula scroll must not mint CP');

  // Master donates the scroll to the sect library -> receives first-time CP reward
  const masterCpBefore = master.cp;
  const don1 = C.donateRecipe(W, master, r.id);
  assert(don1.ok && !don1.duplicate, 'first donation of formula must succeed as non-duplicate');
  assert(don1.reward > 0, 'first donation must pay positive CP');
  assert.strictEqual(master.cp, masterCpBefore + don1.reward, 'donor receives CP reward');
  assert(W.sect.knownRecipes.includes(r.id), 'donated formula enters sect knownRecipes');
  assert(!master.inv.recipes.includes(r.id), 'donated scroll is removed from personal inventory');

  // Holder now donates their duplicate copy of the same formula -> pays 0 CP!
  const holderCpBefore = holder.cp, mintedBeforeDup = CPE.S(W).minted;
  const don2 = C.donateRecipe(W, holder, r.id);
  assert(don2.ok && don2.duplicate, 'second donation of already-known formula must be marked duplicate');
  assert.strictEqual(don2.reward, 0, 'duplicate formula donation must pay 0 CP');
  assert.strictEqual(holder.cp, holderCpBefore, 'duplicate donor CP balance must not increase');
  assert.strictEqual(CPE.S(W).minted, mintedBeforeDup, 'duplicate donation must not mint sect CP');
  assert(!holder.inv.recipes.includes(r.id), 'duplicate scroll is removed from personal inventory');
  assert.strictEqual(W.sect.knownRecipes.filter(x => x === r.id).length, 1, 'knownRecipes must not contain duplicates');
}

// 3) Authorization and contribution learning fees are enforced and charged exactly once.
{
  const W = world('formula-auth-fees');
  const r = JD.EXPANSION.recipes.find(x => x.tier === 2 && x.craft === 'ALCHEMY');
  assert(r, 'test needs a tier-2 alchemy expansion recipe');
  W.sect.knownRecipes = [r.id];
  W.sect.recipeTier = 3;
  W.map.byId.alchemy.level = 2;

  // Unranked apprentice without mentor/post cannot authorize a tier-2 sect formula
  const app = W.makeNpc({ ageYears: 16, quality: 0.2, rank: 0, stage: 2 });
  app.mentor = null; app.post = null; app.assist = null; app.cp = 500;
  W.sect.policy.secrecy = 80;
  assert.strictEqual(C.canAuthorizeRecipe(W, app, r), false, 'unranked apprentice under high secrecy cannot authorize tier-2 formula');
  assert.strictEqual(C.authorizeRecipe(W, app, r.id).ok, false);
  assert.strictEqual(app.cp, 500, 'rejected authorization must not charge CP');

  // Eligible inner disciple with insufficient CP cannot authorize or start crafting
  const crafter = W.npcs[1];
  crafter.rank = 2;
  crafter.cult.stage = 2;
  crafter.h.skills.ALCHEMY = 100;
  for (const i of r.inputs) ECO.add(W, i.matId, i.count * 2);
  const fee = C.recipeFee(W, r, crafter);
  assert(fee > 0, 'unlearned library formula must have a positive CP learning fee');
  crafter.cp = fee - 1;
  assert.strictEqual(C.authorizeRecipe(W, crafter, r.id).ok, false, 'insufficient CP must reject authorization');
  assert.strictEqual(AI.ACTS.brew.start(crafter, W, { rid: r.id }), false, 'craft start must fail when crafter cannot afford authorization fee');
  assert.strictEqual(ECO.count(W, r.inputs[0].matId), r.inputs[0].count * 2, 'failed authorization must not deduct crafting inputs');

  // With exact CP, craft start authorizes and charges the fee once, then reserves inputs
  crafter.cp = fee + 25;
  const burnBefore = CPE.S(W).burned;
  const ctx1 = { rid: r.id };
  assert(AI.ACTS.brew.start(crafter, W, ctx1), 'eligible crafter with sufficient CP should authorize and start crafting');
  assert.strictEqual(crafter.cp, 25, 'authorization fee must be charged once on first craft/learn');
  assert.strictEqual(CPE.S(W).burned - burnBefore, fee, 'burned CP ledger must record the recipe fee');
  assert(C.isRecipeAuthorized(W, crafter, r.id), 'crafter must be marked authorized after paying fee');
  assert.strictEqual(C.recipeFee(W, r, crafter), 0, 'fee for already-authorized recipe must be 0');
  ECO.finishCraft(W, crafter, r, ctx1);

  // Second craft or explicit re-authorization charges 0 CP
  const cpBeforeSecond = crafter.cp;
  const reAuth = C.authorizeRecipe(W, crafter, r.id);
  assert(reAuth.ok && reAuth.already && reAuth.fee === 0, 'repeat authorization must be a free no-op');
  const ctx2 = { rid: r.id };
  assert(AI.ACTS.brew.start(crafter, W, ctx2), 'second craft should succeed');
  assert.strictEqual(crafter.cp, cpBeforeSecond, 'second craft must not charge the recipe learning fee again');
}

// 4) Save/load preserves personal scrolls and recipe authorizations; death/retirement recovers scrolls to sect library.
{
  const W = world('formula-save-estate');
  const r1 = JD.EXPANSION.recipes[0], r2 = JD.EXPANSION.recipes[1];
  const n1 = W.npcs[1], n2 = W.npcs[2];
  n1.inv.recipes = [r1.id];
  C.grantRecipeAuth(W, n1, r2.id);
  const loaded = SIM.deserialize(SIM.serialize(W));
  const ln1 = loaded.byId[n1.id];
  assert(ln1.inv.recipes && ln1.inv.recipes.includes(r1.id), 'personal formula scroll must survive save/load');
  assert(C.isRecipeAuthorized(loaded, ln1, r2.id), 'recipe authorization must survive save/load');

  // Death of n1 recovers r1 into sect knownRecipes
  AI.kill(loaded, ln1, 'ทดสอบมรดกตำรับ');
  assert(loaded.sect.knownRecipes.includes(r1.id), 'scroll held at death must be recovered into sect knownRecipes');

  // Retirement of n2 recovers held scroll into sect knownRecipes
  n2.inv.recipes = [r2.id];
  SIM.retire(W, n2);
  assert(W.sect.knownRecipes.includes(r2.id), 'scroll held at retirement must be recovered into sect knownRecipes');
}

// 5) No purchase/donate arbitrage across all native and sourcePack items and market quotes.
{
  const W = world('no-arbitrage-audit');
  const allPills = Object.keys(ECO.recipeById).filter(id => ECO.recipeById[id].outType === 'PILL').map(id => ECO.recipeById[id].outItemId || ('P:' + id));
  const allMats = Object.keys(ECO.matById);
  for (const price of [0.6, 1.0, 2.2, 4.0]) {
    for (const markup of [0.75, 1.0, 1.4]) {
      CPE.S(W).price = price;
      CPE.S(W).markup = markup;
      for (const stock of [0, 2, 12, 40]) {
        for (const id of allPills.concat(allMats)) {
          if (stock > 0) W.sect.stock[id] = stock; else delete W.sect.stock[id];
          const buyCp = CPE.priceOf(W, id);
          const donateCp = CPE.reward(W, id, 1, stock);
          assert(buyCp > donateCp, `arbitrage detected for ${id} at price=${price}, markup=${markup}, stock=${stock}: buy=${buyCp} <= donate=${donateCp}`);
        }
      }
    }
  }
  for (const id of allMats.concat(allPills)) {
    if (!EXT.isTradable(id)) continue;
    assert(EXT.quotePrice(W, id, 'member-buy') > EXT.quotePrice(W, id, 'member-sell'), `external member arbitrage on ${id}`);
    assert(EXT.quotePrice(W, id, 'sect-buy', 50) > EXT.quotePrice(W, id, 'sect-sell', 50), `external sect arbitrage on ${id}`);
  }
}

console.log('PASS recipe scroll lifecycle & anti-arbitrage: single discovery, keep/copy/trade/donate, 0-CP duplicate donation, one-time authorization fee, save/estate recovery, and zero purchase/donate arbitrage');
