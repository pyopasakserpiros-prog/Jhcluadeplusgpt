# v1.10.2 patch — personal recipe scroll lifecycle & multi-year economy tuning

Date: 27 October 2026
Base: supplied `JianghuSect_v1-10-2_download.zip` (internal v1.10.1 codebase)

## Purpose

Complete the next two P1 continuation milestones from `ROADMAP/ROADMAP.md`:
1. **Personal recipe scroll lifecycle** (`C.VERSION = 2` in `js/content.js`, `js/cpeco.js`, `js/economy.js`, `js/sim.js`, `js/ai.js`, `js/ui.js`).
2. **Multi-year economy & external market tuning** (`js/cpeco.js`, `js/economy.js`, `js/stats.js`, `test/long_simulation.js`).

## Implemented

- **Single physical formula creation & provenance**:
  - Regional discovery (`CONTENT.discover`) creates one physical formula scroll (`out.recipes`) only when the formula is not already in `W.sect.knownRecipes`, in any member's personal `n.inv.recipes`, or in an active expedition's `out.recipes` (`CONTENT.formulaInWorld`).
- **Handover keep vs. donate**:
  - On expedition return (`EXPED.handover`), each newly discovered formula is either donated to `W.sect.knownRecipes` (paying `12 × tier` CP once and granting the discoverers free personal authorization) or retained as a physical scroll in the finder's `n.inv.recipes` with `0` CP minted on handover. Sect Master and Deputy always donate to the library.
- **Keep, Donate, Trade, and Copy with real ownership**:
  - `CONTENT.donateRecipe(W, n, id)` transfers a physical scroll from `n.inv.recipes` to `W.sect.knownRecipes`. The first donation pays `12 × tier` CP and grants the donor free authorization; any duplicate donation of a formula already in `W.sect.knownRecipes` removes the duplicate scroll and pays **0 CP**.
  - `CONTENT.tradeRecipe(W, seller, buyer, id, price)` transfers a physical formula scroll from `seller.inv.recipes` to another sect member (`buyer.inv.recipes`) or visiting trader for spirit stones without minting CP.
  - `CONTENT.copyRecipe(W, actor, id, targetNpc)` allows a literate scroll owner or authorized library scholar to transcribe a physical copy using `MAT_ORE_CINNABAR_1` or spirit stones. Donating any copied scroll once the formula is in `W.sect.knownRecipes` pays `0` CP.
  - Member death (`AI.kill`) and retirement (`SIM.retire`) recover any personally held formula scrolls into `W.sect.knownRecipes`.
- **One-time authorization & contribution learning fees**:
  - Discoverable formulas in `W.sect.knownRecipes` require rank/post/stage/path authorization (`CONTENT.canAuthorizeRecipe`) and a one-time contribution learning fee (`CONTENT.recipeFee`, `CONTENT.authorizeRecipe` / `CONTENT.learnRecipe`), persisted in `n.recipes` and `W.sect.recipeAuth[n.id]`.
  - Personal scroll holders and original donors authorize for `0` CP. Repeat authorization or subsequent crafting of an already-authorized formula charges `0` CP.
- **Multi-year economy tuning & anti-arbitrage**:
  - Enforced `CPE.priceOf(W, id) > CPE.reward(W, id, 1)` across all price indices (`0.6–4.0`), markups (`0.75–1.4`), and stock levels for both native and imported goods.
  - Scaled per-capita working CP target with cultivation stage and price level (`baseTgt × price^0.65`), tapered oversupply donation rewards when warehouse stock exceeds `2×` target, moderated routine wage/stipend CP minting when `price > 1.2`, and shortened cooldowns on voluntary CP sinks (`paidTraining` 14d, `guidedStudy` 16d).
  - Updated `ECO.pickOrder`, `A.duty` (`craftmgmt`), and `A.study` so `clearToxic`/`qiRestore` medicines (`SRC110_MW_REC_006`) and `ACCESSORY` (`TALISMAN`/`ARRAY`) recipes (`SRC110_MW_REC_045`, `SRC110_MW_REC_048`) are naturally ordered and crafted.
  - Optimized non-explain combat stat calculation (`computeFast` in `js/stats.js`) and deterministic `STATS.now` initialization in `js/sim.js`, enabling full-assertion 360-day `test/long_simulation.js` runs to complete within ~5.2–5.6 minutes.

## Validation

- `node test/recipe_scroll_lifecycle.js`: passed.
- `node test/run_all.js`: **18/18 groups PASS** after rebuild.
- Two full-assertion 360-day native-tick simulations (`v1102-seed1`, `v1102-seed2` — 518,400 ticks each) passed all daily inventory, CP, recipe scroll uniqueness, external market, and regional stock assertions:
  - `v1102-seed1` (360d): population 64, CP minted 74,365 / burned 51,694, final price index **1.12**, 61 merchant visits, sect sold 1,032 units (12,528 stones in) vs bought 533 units (8,182 stones out), 8/8 formulas discovered, 1 kept & traded before donation, 26 recipe authorizations (271 CP burned).
  - `v1102-seed2` (360d): population 54, CP minted 86,748 / burned 65,528, final price index **0.98**, 54 merchant visits, sect sold 821 units (13,367 stones in) vs bought 667 units (9,571 stones out), 8/8 formulas discovered, 28 recipe authorizations (269 CP burned), natural crafting of `SRC110_MW_REC_045` (`TALISMAN`), `SRC110_MW_REC_022`, and `SRC110_MW_REC_044`.
