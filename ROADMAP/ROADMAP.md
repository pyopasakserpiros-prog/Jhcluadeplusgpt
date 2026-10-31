# Next development milestones

## v1.10.1 completed patch — external economy

- Added `EXT` direct-market visitors with finite visit windows, real visitor inventory and spirit-stone wallets.
- Sect treasury buys requested/critically scarce goods once per visitor visit while protecting a cash reserve; merchants buy only sect surplus above per-item reserves.
- Members can autonomously buy needed/basic reserve medicine and sell common personal materials or surplus basic pills using their own spirit stones. Contribution points remain internal-only.
- Added save-persistent transaction history/counters, market UI, quote validation, replay protection, and focused tests. See `PATCH_v1.10.1_EXTERNAL_MARKET.md`.

## v1.10.2 completed patch — personal recipe scroll lifecycle & multi-year economy tuning

- Discovery creates one physical formula scroll (`out.recipes`) with world-wide uniqueness checks (`CONTENT.formulaInWorld`).
- Expeditions can either donate discovered formulas on handover or retain physical scrolls in `n.inv.recipes` (`0` CP on handover).
- Implemented full personal scroll ownership (`CONTENT.donateRecipe`, `CONTENT.tradeRecipe`, `CONTENT.copyRecipe`) with estate recovery on death/retirement; duplicate donation to `W.sect.knownRecipes` pays `0` CP.
- Added rank/post/stage/path authorization and one-time contribution learning fees (`CONTENT.recipeFee`, `CONTENT.authorizeRecipe`) persisted in `n.recipes` and `W.sect.recipeAuth`.
- Tuned multi-year CP mint/sink equilibrium, enforced strict anti-arbitrage floors (`priceOf > reward`), enabled natural crafting of `clearToxic`/`qiRestore` pills and `TALISMAN`/`ARRAY` accessories, and validated two full-assertion 360-day simulations (`v1102-seed1`, `v1102-seed2`) with price index stabilizing at `1.12` and `0.98`. See `PATCH_v1.10.2_RECIPE_LIFECYCLE_AND_ECONOMY.md`.

## v1.10.3 completed patch — independent specialization tracks & functional power comparison

- Preserved full 9-realm sequence for all 3 ported specializations without ordinal compression into 5 or 4 stages.
- Target major cultivation stages remain unchanged (XIAN 9, BODY 5, GOD 4) for backward compatibility and engine stability.
- Added explicit native track state (`c.track`), dual progression (`CULT.gain`), skill gates and stone costs (`CULT.checkTrackGates`), and breakthrough resolution (`CULT.trackBreakthrough`).
- Implemented continuous `majorPowerMapping` and functional combat power comparison (`CULT.compareFunctionalPower`) with ratio, band delta, and Thai assessments.
- Integrated track realm buffs in combat stats, updated UI character sheets and content catalog, and verified full 360-day simulation. See `PATCH_v1.10.3_INDEPENDENT_SPECIALIZATION_TRACKS.md`.

## v1.10.4 completed patch — richer path-specific passives & explicit combat profiles

- Added explicit native combat archetypes in `SK.ARCH` and `SK.profile`: `support`, `heal`, `summon`, and `channel`.
- Implemented working target handlers and execution logic in `js/combat.js`:
  - `support`: Party-wide buffing targeting all allies (`C.alliesOf`) with `morale` (+15% atk/matk), `holyAura` (+20% def/mdef), or `haste`.
  - `heal`: Targeted restoration and status cleansing targeting the lowest-HP percentage ally (`lowestAlly`).
  - `summon`: Manifests avatar/decoy sub-units with combat stats, finite duration, active aggro absorption, and clean despawn without awarding enemy merits.
  - `channel`: Multi-tick channeled ability with tick-by-tick payoff, final burst payoff, and hard CC / heavy damage interrupt mechanics (`C.interruptChannel`).
- Harmonized path-specific passives across `data/data_expansion.js`, `js/cultivation.js`, and `js/stats.js` so source descriptive text matches native behavior verbatim.
- Verified with 20/20 regression tests (`test/combat_passives.js`, `test/run_all.js`) and 360-day full assertion simulation. See `PATCH_v1.10.4_RICHER_PATH_SPECIFIC_PASSIVES.md`.

## v1.10.5 completed patch — more coherent regions & recipes

- Expanded from 4 to 6 cohesive destination biomes (`forest`, `swamp`, `frozen`, `volcano`, `desert`, `ruins`) with distinct environmental hazards, terrains, expedition schedules, and capped renewable resources.
- Curated 10 authentic resident beast species with native `BEAST_PART` drops directly tied to regional hunt resources.
- Expanded to 14 dependency-complete recipes across `ALCHEMY`, `FORGING`, `TALISMAN`, and `ARRAY` with zero unsupported `FORM` or `ORGAN` IDs.
- Achieved a 100% closed-loop economy across 40 materials: every material is obtainable in at least one destination region (100% acquisition) and required in at least one recipe (100% consumption).
- Strictly preserved the hunt-only destination guardrail for `frozen` route while enriching it with spiral snow goat horns and blood.
- Re-aligned swamp species into `MW_ENV_02_MIASMA_MANGROVE` and populated desert with copper ants and sand sharks.
- Verified with 21/21 regression tests (`test/coherent_regions_recipes.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1105_seed1.json`). See `PATCH_v1.10.5_COHERENT_REGIONS_AND_RECIPES.md`.

## v1.10.6 completed patch — wider welfare & production policies

- Introduced explicit sect reserve directives (`W.sect.reserveDirectives`) governing minimum grain days, cooked meal reserves, expedition safety floors, and emergency basic medicines.
- Enforced meal safety reserves on expedition departures (`X.depart`), preventing expeditions from leaving the sect destitute.
- Synthesized visible shortage directives (`W.sect.shortageDirectives`) aggregating canteen provisions, emergency medicine deficits, hall order ingredient needs, and tribulation breakthrough demands.
- Derived caravan `buyList` and prioritized external visitor purchases (`EXT` in `js/external_market.js`) directly from active shortage directives.
- Implemented relationship bias vs need-based leadership decisions in welfare (`CPE.welfareDaily`) and gear allocation (`SIM.distributeGear`), with social feedback (passed-over high-need/merit members feel resentment, lose satisfaction and mood, and log grievances) and audit history (`W.sect.welfareHistory`).
- Strictly protected premium imported medicines from free basic welfare leaks while guaranteeing full purchase availability via contribution points in `CPE.shop`.
- Rendered reserve directives, active shortages, welfare governance ratings, and premium shop banners in `UI.rSect` (`stock`, `policy`, `shop` tabs).
- Verified with 22/22 regression tests (`test/welfare_production_policies.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1106_seed1.json`). See `PATCH_v1.10.6_WIDER_WELFARE_PRODUCTION_POLICIES.md`.

## v1.10.7 completed patch — browser and mobile performance

- Optimized simulation, pathfinding, and stat hot paths while preserving 100% bit-for-bit deterministic simulation results and strict `js/human_core.js` byte-lock (`155:2f9c9dd7`):
  - Replaced array-destructuring swaps in `U.MinHeap` with scalar sifting; upgraded `MAP.findPath` to packed 32-bit integer keys, a shared heap, and incremental FIFO eviction (at 12,000 entries) instead of full-cache clears.
  - Added `n._csBase` pre-condition stat caching and O(1) fast paths for `ST.hpMax` and `ST.moveMult` in `js/stats.js`, plus zero-allocation `computeFast` when no temporary combat buffs/statuses are active.
  - Cached per-day/per-version `AI.needs` decay rates (`n._nd`), top-4 interests (`n._topInt`), pairwise social compatibility (`a._compat`), per-tick `CPE.pickPurchase` (`n._pickCache`), zero-allocation `ECO.inputsOk` for 1–2 input recipes, and Canvas `measureText` widths (`measureCached` in `js/render.js`).
- Fixed mobile UI & touch interactions: elevated `#minimap` (`z-index: 6`) and constrained mobile `#toasts` (`right: 106px`) to prevent toast/minimap collision; excluded open `plaza` ground from building hit-testing in `R.pickAt` for clean tap-to-deselect; guarded `setPointerCapture` on multi-touch; added empty-state message to `world -> hist`.
- Added zero-dependency CDP Playwright driver (`tools/cdp_playwright.js`) and automated browser & mobile verification suite (`test/browser_mobile_perf.js`, `test/results/browser_mobile_perf_v1107.json`) testing `360×800`, `412×860`, and `1280×800` viewports, gestures, all 24 panel tabs, save/load, `0×–48×` speed multipliers, and an 80-cultivator stress test (`~1.20 ms/tick`, `~830 ticks/s`, `207×` sustainable speed cap).
- Verified with 23/23 regression test groups (`test/run_all.js`), all 5 original Playwright scripts (`browser.js`, `browser2.js`, `browser3.js`, `gesture.js`, `perf.js`), and 360-day full assertion simulation (`test/results/long_v1107_seed1.json`). See `PATCH_v1.10.7_BROWSER_AND_MOBILE_PERFORMANCE.md`.

## v1.10.8 completed patch — native DEMON and HEART_SOUL paths

- Elevated `DEMON` (วิถีมารอสูร) and `HEART_SOUL` (วิถีจิต·เซน) into native first-class cultivation paths in `data/data_cult.js` (9 stages and 4 authentic subpaths each: `SHADOW_ASSASSIN`, `VENOM_GU_SOVEREIGN`, `NETHER_GHOST_KING`, `HEAVEN_DEVOURING_DEMON`, `ZEN_VOID_MIND`, `CALLIGRAPHY_PAINTING_SAGE`, `DREAM_ILLUSION_WEAVER`, `MIND_SWORD_TELEKINESIS`).
- Ported all 8 authentic 9-realm independent specialization tracks into `tools/migrate_source.js` and `data/data_expansion.js` (11 total independent tracks across all 5 paths) with progressive `lifestealPct` (`DEMON`) and `reflectPct` (`HEART_SOUL`).
- Implemented distinct strategic training costs, risks, and rate mechanics in `js/cultivation.js`, `js/ai.js`, and `js/cpeco.js`:
  - `DEMON`: channels moderate `heartDemon <= 60` for up to `+22%` cultivation rate and `+12%` combat power, tolerates higher pill/Gu toxicity (`toxic < 52`), practices `POISON`/`stealth`/`SOUL_DIVINE`, builds `heartDemon` during cultivation, and risks `DEMONIC_BACKLASH_FRENZY`.
  - `HEART_SOUL`: scales with `comprehension`/`willpower`/`composure`, gains `+15%` Zen Clarity when `heartDemon <= 10 && stress <= 25`, purifies `heartDemon` during cultivation at higher mental `rest` cost, and risks `SOUL_SHATTER_ILLUSION_LOST` (`qi` shattered to `0`) on failed breakthrough.
- Registered 14 mantras (7 `DEMON_MANTRA`, 7 `SOUL_MANTRA`), 45 learnable techniques across all 8 subpaths in `data/data_tech.js`, and 16 bottleneck pills + 12 major stage treasures in `data/data_bt.js`.
- Implemented combat `lifestealPct` and Blood-Qi Harvest on slay for `DEMON`, and `reflectPct` damage reflection and spar/duel mental tempering for `HEART_SOUL` in `js/combat.js`.
- Verified with 24/24 regression test groups (`test/demon_heartsoul_paths.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1108_seed1.json`). See `PATCH_v1.10.8_NATIVE_DEMON_AND_HEART_SOUL_PATHS.md`.

## v1.10.9 completed patch — rare organs, property experimentation & factions/world politics

- Ported 10 authentic anatomical rare beast organs (`D.rareOrgans`), 8 property-based experiment designs (`D.experiments`), and 6 external sect faction templates (`D.factions`) into `tools/migrate_source.js` and `data/data_expansion.js` while keeping the closed-loop `D.materials` (40) and `D.recipes` (14) invariants intact.
- Implemented anatomical organ harvesting (`CONTENT.harvestOrgan`), handover/donation (`EXPED.handover`, `CONTENT.donateOrgan`), catalyst consumption in experiments, and direct organ refinement (`CONTENT.refineOrgan`) consuming physical organs and spirit stones for deterministic cultivation/healing rewards.
- Implemented property-based experimentation (`CONTENT.runExperiment`) with real trial material + spirit stone consumption, progressive property tag revelation (`W.sect.experiments.propertyKnowledge`), bounded failure research notes (`+14%` per note), prototype synthesis, and permanent crafting synergies (`CONTENT.recipeSynergy` in `ECO.finishCraft`).
- Enriched `W.world.sects` with faction doctrines, specialty materials, treaties (`NONE`, `TRADE_PACT`, `NON_AGGRESSION`, `ALLIANCE`, `EMBARGO`), 10-day specialty material shipments, allied raid defense (`jointDefenses`), and bounded political events (`SPECIALTY_CARAVAN`, `TRIBUTE_DEMAND`, `DOCTRINE_SUMMIT`, `BORDER_HERB_DISPUTE`).
- Verified with 25/25 regression test groups (`test/organs_experiments_politics.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1109_seed1.json`). See `PATCH_v1.10.9_ORGANS_EXPERIMENTS_AND_WORLD_POLITICS.md`.

| Priority | Task | Dependency | Acceptance criteria |
|---|---|---|---|
| DONE (v1.10.2) | Multi-year economy tuning | Current long_simulation reports | Measure stock/CP creation and sinks across more seeds/populations; tune wages, surplus production/sales and demand without deleting goods or inventing stock. No source purchase/donate arbitrage; meaningful spending persists. |
| DONE (v1.10.2) | Personal recipe scroll lifecycle | Current `knownRecipes` / handover receipts | Discovery creates one physical formula; keep/donate/trade/copy with real ownership; duplicate donation pays0. Authorization and contribution learning fees charged once. |
| DONE (v1.10.3) | Independent specialization tracks | Full source tracks + major-power mapping in catalogue | Introduce explicit native track state, resource/skill gates and functional power comparison; preserve all source ranks selected for porting. Never map9 ordinals into5/4 by position. Old stage/HP/save behavior preserved and tested. |
| DONE (v1.10.4) | Richer path-specific passives | Native STATS/CULT + explicit combat profiles | Add support/heal/summon/channel mechanics only with working target handlers and tests. Source descriptive text must match actual native effects. |
| DONE (v1.10.5) | More coherent regions/recipes | Complete source originals/catalogues + current validator/converter | Add small dependency-complete packs; map actual species drops/ecology; no unsupported FORM IDs; every item has acquisition and consumption. |
| DONE (v1.10.6) | Wider welfare/production policies | Existing leadership policies/CP economy | Make expedition reserves/shortage directives visible; test relationship bias and need-based leadership decisions. Keep premium stock available for purchase. |
| DONE (v1.10.7) | Browser and mobile performance | Working Chromium/physical devices | Run all existing Playwright controls/tabs/save/gesture checks, test widths360/412/desktop, measure ticks/s/debt/fps at every multiplier and large populations on Snapdragon8Elite. |
| DONE (v1.10.8) | Native DEMON/HEART_SOUL paths | Independent-track schema + resource/faith mechanics | Distinct strategic costs/risks/training; verified stat/AI/combat/UI/save support before registering content. |
| DONE (v1.10.9) | Rare organs, experiments, factions/world politics | Region ecology, ownership, balance | Real resource generation/consumption and persistent events; deterministic rewards, bounded state and no second engine. |

Continuation procedure: inspect `CURRENT_STATUS.md` → choose one row → add behavioral regression → extend converter/runtime → run assertions and seeded long simulations → rebuild/inspect standalone/ZIP → update status/results/mapping. `SOURCE_REFERENCE/` already contains the original material and extracted data required for these steps.
