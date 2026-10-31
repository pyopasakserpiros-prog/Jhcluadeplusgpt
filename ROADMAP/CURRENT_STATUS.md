# Current status — v1.10.9 — 27 October 2026

## v1.10.0 completed first-stage vertical slice (retained baseline)

- Continued the actual v1.9 target; no source engine imported. Human Core byte-identical, fingerprint `155:2f9c9dd7`.
- Preserved three major progression schedules (9/5/4) and all existing speed options through48×.
- Added3 specialization identities with explicit aptitude preferences/stat tradeoffs,9 learnable combat manuals with explicit native archetypes,25 ingredients,3 premium medicine recipes,5 equipment/accessory recipes,5 matched beast species,4 functional destination ecosystems.
- Shared finite per-resource regional stocks, daily capped renewal, power/mission/personality/scarcity destination scoring, physical quest cargo, correct animal-to-part linkage, formula/manual discovery and accepted donation rewards.
- Imported goods are absent from starting stock; imported manuals are absent from starting curriculum/prelearned NPCs. Rare regional materials excluded from generic gathering, cave loot, unrelated raids and automated overseas procurement lists.
- Native crafting now uses serializable actor/recipe receipts; all input rows aggregated before deduction; no duplicate settlement or duplicate failure refund. Queued hall-order change no longer crashes arrival.
- Shop verifies current quote and real stock before charging; paid learning remains exactly once. Imported premium medicines are purchased/consumed through personal inventory and do not enter free welfare lists.
- Save migration retains old NPC identities, progression, stock, points, library, RNG and paid in-progress crafts; restores season immediately and preserves unknown top-level metadata. Runtime speed and pending ticks survive load.
- Existing mobile sheets extended with destination/formula/manual/specialization information and backlog indicator.
- Untouched source scripts/docs + complete inspected catalogue + raw selected records + repeatable converter retained for continuation.

## v1.10.1 patch completed

- Added a direct external market layer without replacing the native engine or Human Core.
- Visiting traders have real per-visit stock, demand, spirit-stone wallets, expiry days and save-persistent IDs.
- Treasury purchases requested or critically scarce goods once per visit and keeps a population-scaled cash reserve; visitors buy only stock above a protected sect reserve.
- Members autonomously trade with visitors using personal spirit stones: buy needed/reserve basic medicines, sell common personal materials or surplus basic medicines. Internal sect store/services continue using contribution points.
- Added bounded transaction history/counters and a sect UI panel for active visitors, asks/wants, flows and recent trades.
- Focused regression tests cover actual stock/wallet transfer, reserves, one-purchase-per-visit, member trade, stale quote rejection, save/load and blocked-road visits.

## v1.10.2 patch completed

- **Personal recipe scroll lifecycle**:
  - Regional discovery (`CONTENT.discover`) creates one physical formula scroll (`out.recipes`) gated by world-wide existence (`CONTENT.formulaInWorld`).
  - Expedition handover supports both immediate donation to `W.sect.knownRecipes` and personal retention in `n.inv.recipes` (`0` CP minted when kept).
  - Full real-ownership lifecycle implemented: `CONTENT.donateRecipe` (first donation pays `12 × tier` CP; duplicate donation pays `0` CP), `CONTENT.tradeRecipe` (peer-to-peer and trader spirit-stone sales without minting CP), `CONTENT.copyRecipe` (transcription requiring literacy and cinnabar/stones), plus estate recovery on death/retirement.
  - Added rank/post/stage/path authorization (`CONTENT.canAuthorizeRecipe`) and one-time contribution learning fees (`CONTENT.recipeFee`, `CONTENT.authorizeRecipe` / `CONTENT.learnRecipe`) persisted in `n.recipes` and `W.sect.recipeAuth`. Personal scroll owners and donors authorize for `0` CP.
- **Multi-year economy & external market tuning**:
  - Enforced strict anti-arbitrage pricing (`CPE.priceOf > CPE.reward`) across all price/markup/scarcity states.
  - Scaled per-capita working CP target with cultivation stage and price level (`baseTgt × price^0.65`), tapered oversupply donation rewards, moderated wage/stipend minting when `price > 1.2`, and strengthened voluntary CP sinks (`paidTraining`, `guidedStudy`, `recipeFees`).
  - Improved `ECO.pickOrder` and craft skill training (`ARRAY`/`TALISMAN`) so all 8 imported recipes participate naturally.
  - Optimized `STATS.get` (`computeFast`) and `SIM.create` (`STATS.now` reset), completing two full-assertion 360-day simulations (`v1102-seed1`, `v1102-seed2`) with final CP price indices of `1.12` and `0.98` and positive net external trade exports.

## v1.10.3 patch completed

- **Independent specialization tracks**:
  - Full 9-realm sequence preserved for all 3 ported specializations (`FROST_MOON_IMMORTAL`, `WOOD_SPRING_BODY`, `MEDICINE_BODHI_GOD`) without compressing 9 ordinals into 5 or 4 stages by position.
  - Target major cultivation stages remain completely unchanged (`XIAN` 9, `BODY` 5, `GOD` 4) for backward compatibility and engine stability.
  - Added native track state on cultivators (`c.track`), dual progression in `CULT.gain`, skill gates and progressive spirit stone costs (`CULT.checkTrackGates`), and autonomous breakthrough evaluation (`CULT.trackBreakthrough` and `SIM.dailyUpdate`).
- **Functional combat power & continuous major power mapping**:
  - Continuous fractional `majorPowerMapping` (`XIAN` 1..9, `BODY` 1.0..5.0, `GOD` 1.0..4.0) and functional CP mapping (`[280, 520, 880, 1600, 2600, 5000, 8500, 18000, 31000]` for `WOOD_SPRING_BODY`).
  - Added `CULT.compareFunctionalPower(entityA, entityB)` providing power ratio, band delta, and Thai assessments across tracks and major stages.
- **Combat stat buffs & UI presentation**:
  - Integrated track realm buffs (`combatOffensePct`, `combatDefensePct`, `armorPenetrationPct`, `evasionPct`, `senseBonus`) in `js/stats.js` (`compute` and `computeFast`).
  - Updated UI sheets: 9-realm overview in `UI.rContent`, track progress and gate status in `UI.rNpc` overview, and functional power comparison in `UI.rNpc` compare tab.
  - Verified with 19/19 test groups passing and full 360-day simulation.

## v1.10.4 patch completed

- **Richer path-specific passives & explicit combat profiles**:
  - Added explicit native combat archetypes in `SK.ARCH` and `SK.profile`: `support`, `heal`, `summon`, and `channel`.
  - Implemented working target handlers and execution logic in `js/combat.js`:
    - `support`: Party-wide buffing targeting all allies (`C.alliesOf`) with `morale` (+15% atk/matk), `holyAura` (+20% def/mdef), or `haste`.
    - `heal`: Targeted restoration and status cleansing targeting lowest-HP percentage ally (`lowestAlly`).
    - `summon`: Manifests avatar/decoy sub-units with combat stats, finite duration, active aggro absorption, and clean despawn without awarding enemy merits.
    - `channel`: Multi-tick channeled ability with tick-by-tick payoff, final burst payoff, and hard CC / heavy damage interrupt mechanics (`C.interruptChannel`).
  - Harmonized path-specific passives across `data/data_expansion.js`, `js/cultivation.js`, and `js/stats.js` so source descriptive text matches native behavior verbatim.
  - Verified with 20/20 regression tests (`test/combat_passives.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1104_seed1.json`).

## v1.10.5 patch completed

- **More coherent regions & recipes**:
  - Expanded from 4 to 6 destination biomes (`forest`, `swamp`, `frozen`, `volcano`, `desert`, `ruins`) with distinct environmental hazards, terrains, expedition schedules, and capped renewable stocks.
  - Curated 10 authentic resident beast species with native `BEAST_PART` drops directly tied to regional hunt resources (`C.gather(..., "hunt", beast)`).
  - Expanded to 14 dependency-complete recipes across `ALCHEMY`, `FORGING`, `TALISMAN`, and `ARRAY` with zero unsupported `FORM` or `ORGAN` IDs.
  - Achieved a 100% closed-loop economy across 40 materials: every material is obtainable in at least one destination region (100% acquisition) and required in at least one recipe (100% consumption).
  - Strictly preserved the hunt-only destination guardrail for `frozen` route while enriching it with spiral snow goat horns and blood.
  - Re-aligned swamp species into `MW_ENV_02_MIASMA_MANGROVE` and populated desert with copper ants and sand sharks.
  - Verified with 21/21 regression tests (`test/coherent_regions_recipes.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1105_seed1.json`).

## v1.10.6 patch completed

- **Wider welfare & production policies**:
  - Introduced explicit sect reserve directives (`W.sect.reserveDirectives`) governing minimum grain days, cooked meal reserves, expedition safety floors, and emergency basic medicines.
  - Enforced meal safety reserves on expedition departures (`X.depart`), preventing expeditions from leaving the sect destitute.
  - Synthesized visible shortage directives (`W.sect.shortageDirectives`) aggregating canteen provisions, emergency medicine deficits, hall order ingredient needs, and tribulation breakthrough demands.
  - Derived caravan `buyList` and prioritized external visitor purchases (`EXT` in `js/external_market.js`) directly from active shortage directives.
  - Implemented relationship bias vs need-based leadership decisions in welfare (`CPE.welfareDaily`) and gear allocation (`SIM.distributeGear`), with social feedback (passed-over high-need/merit members feel resentment, lose satisfaction and mood, and log grievances) and audit history (`W.sect.welfareHistory`).
  - Strictly protected premium imported medicines from free basic welfare leaks while guaranteeing full purchase availability via contribution points in `CPE.shop`.
  - Rendered reserve directives, active shortages, welfare governance ratings, and premium shop banners in `UI.rSect` (`stock`, `policy`, `shop` tabs).
  - Verified with 22/22 regression tests (`test/welfare_production_policies.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1106_seed1.json`).

## v1.10.7 patch completed

- **Browser and mobile performance (Priority P2)**:
  - Optimized simulation and rendering hot paths with 100% deterministic fidelity: scalar `U.MinHeap` sifting, packed integer keys and incremental cache eviction in `MAP.findPath`, `n._csBase` + O(1) `ST.hpMax` / `ST.moveMult` fast paths in `js/stats.js`, cached `AI.needs` rates / `AI.compat` / `CPE.pickPurchase`, zero-allocation `AI.freeStation` / `ECO.inputsOk`, and cached Canvas `measureText` widths in `js/render.js`.
  - Fixed mobile toast/minimap z-index and layout overlap (`css/style.css`), open `plaza` tap-to-deselect (`js/render.js`), multi-touch `setPointerCapture` guard (`js/main.js`), and empty `world -> hist` state (`js/ui.js`).
  - Verified in headless Chromium 155 via `tools/cdp_playwright.js` and `test/browser_mobile_perf.js` (`test/results/browser_mobile_perf_v1107.json`) across `360×800`, `412×860`, and `1280×800` viewports, all touch/mouse gestures, all 24 panel tabs, save/load roundtrip, `0×–48×` speed multipliers, and 80-cultivator stress testing (`~1.20 ms/tick`, `~830 ticks/s`).
  - Verified with 23/23 regression tests (`test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1107_seed1.json`).

## v1.10.8 patch completed

- **Native `DEMON` and `HEART_SOUL` cultivation paths (Priority P3)**:
  - Registered `DEMON` (9 stages, 4 subpaths) and `HEART_SOUL` (9 stages, 4 subpaths) in `data/data_cult.js`, 16 bottleneck pill recipes and 12 major stage treasures in `data/data_bt.js`, and 14 mantras + 45 learnable techniques in `data/data_tech.js`.
  - Ported all 8 authentic 9-realm independent specialization tracks in `tools/migrate_source.js` and `data/data_expansion.js` (11 total independent tracks across all 5 paths).
  - Implemented distinct strategic training costs, risks, and rate mechanics (`DEMON` heart-demon channeling, toxicity tolerance, blood-qi harvest on slay, `lifestealPct`, and `DEMONIC_BACKLASH_FRENZY`; `HEART_SOUL` comprehension/willpower/composure scaling, Zen Clarity bonus, heart-demon purification, spar tempering, `reflectPct`, and `SOUL_SHATTER_ILLUSION_LOST`).
  - Wired station selection, stats (`PATHW`, `SUBFX`, mantra bonuses, preFight pills), skill profiles (`SUBW`, damage types, summons), UI path counters/tracks, and minimap/canvas colors.
  - Verified with 24/24 regression tests (`test/demon_heartsoul_paths.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1108_seed1.json`).

## v1.10.9 patch completed

- **Rare beast organs, property experimentation & factions/world politics (Priority P3 — Final Milestone)**:
  - Migrated 10 authentic rare beast organs (`D.rareOrgans`), 8 property-based experiment designs (`D.experiments`), and 6 external sect faction templates (`D.factions`) in `tools/migrate_source.js` and `data/data_expansion.js`.
  - Implemented anatomical organ harvesting (`CONTENT.harvestOrgan`), handover/personal donation (`CONTENT.donateOrgan`), catalyst usage in property experimentation, and direct organ refinement (`CONTENT.refineOrgan`) with real organ/stone consumption and deterministic rewards.
  - Implemented property experimentation (`CONTENT.runExperiment`) with real material/stone consumption, progressive property tag revelation (`W.sect.experiments.propertyKnowledge`), bounded failure notes, recipe unlocking, prototype synthesis, and permanent crafting quality/yield synergies (`ECO.finishCraft`).
  - Enriched `W.world.sects` with faction doctrines, treaties (`TRADE_PACT`, `NON_AGGRESSION`, `ALLIANCE`, `EMBARGO`), 10-day specialty material shipments, allied raid defense, and bounded political events (`W.world.politics`).
  - Verified with 25/25 regression tests (`test/organs_experiments_politics.js`, `test/run_all.js`) and 360-day full assertion simulation (`test/results/long_v1109_seed1.json`).

## Partial / intentionally deferred

- Independent 9-realm specialization tracks and richer path-specific passives are now fully supported natively with explicit track state, gates, functional power comparison, and working support/heal/summon/channel combat mechanics.
- Native DEMON and HEART_SOUL paths and their 8 independent 9-realm tracks are now fully supported; rare-organ anatomy, property experimentation, and world-politics factions are now fully integrated into the native runtime (`v1.10.9`).
- Supply budgets cover new regions, not a retrofit of all original five destinations/caves/worlds.
- Headless Chromium layout, touch/pointer gesture QA, and 0×–48× / 80-NPC speed benchmarks are now automated in `test/browser_mobile_perf.js`; physical Snapdragon 8 Elite hardware profiling remains optional device validation.

Read `TESTING_AND_VALIDATION.md` for exact final checks and evidence; prior intermediate runs are labeled separately.
