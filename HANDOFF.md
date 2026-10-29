# JIANGHU SECT — AUTONOMOUS ECONOMY & FACILITY EXPANSION HANDOFF

## Current handoff — v1.10.12 Living Beast & Craft Ecology Expansion / main-1 (2026-10-29)

Read [`JianghuSect_v1.10/docs/ECOLOGY_EXPANSION.md`](JianghuSect_v1.10/docs/ECOLOGY_EXPANSION.md) for complete catalog architecture, beast tiers, drop mechanics, crafting recipes, habitats, combat integration, and verification evidence. Preserve `main` and the byte-locked HC source (`155:2f9c9dd7`).

### Summary of Additions & Verifications:
- **80 Beast Species**: 12 families (Canine, Feline, Ursine, Boar, Serpent, Avian, Arthropod, Shell, Ungulate, Aquatic, Plant, Chimera) across 6 tiers (72 species) + 8 Mythic Tier 7 beasts. All beasts configured with distinct archetypes, visual styling, terrains, and drops.
- **160 Materials**: 2 distinct drops per species (`ECO2_MAT_...`), 100% connected to recipe inputs or market exchange (0 dead materials).
- **80 Recipes**:
  - 48 Pills (`ECO2_REC_P_...`): 16 Heal/Purge/Life, 16 Combat Buff (`cbBuff`), 16 Cultivation/Mind.
  - 32 Equipment (`ECO2_REC_E_...`): Weapons & armor spanning 14 martial identity types.
- **Multi-Pool Habitats**: Meadow, West Grove, East Crag, North Peak, Mountain Ridge, and Mythic Legend pools with global legendary cap <= 1 and isolated ordinary refill.
- **Full System Integration**:
  - Drops directly to member personal bag (`n.h.bag`) upon combat victory with idempotency guards.
  - Member CP donation via `SECT.donateMat` with anti-arbitrage minting.
  - Autonomous crafting at alchemy lab and forge via `ECO.finishCraft`.
  - Member shop purchase of combat buff pills and automatic consumption in `ST.preFight`.
  - Save/load serialization and deterministic seed execution verified.
- **Codex Bug Fixes (v1.10.12 Rev 2)**:
  - **NPC Healing Pill Usage**: Fixed `CPE.autoUse`, `CPE.fightUse`, and `A.personalPillUse` in `js/cpeco.js` to pick pills based on effect (`healHealth`), decrementing count by 1 only upon successful consumption, with strict threshold gating.
  - **Poison Status Cleansing**: Fixed `ECO.applyPill` in `js/economy.js` to clear combat status `poison` from `npc.sx` via `ST.clearStatus`, preserving other active conditions and strictly separating combat poison from cultivation body toxic (`cult.toxic`).
  - **Terrestrial vs Aquatic Spawning**: Purged all aquatic species from land map pools, added an aquatic guard in `WILD.spawn`, and routed water encounters to the expedition region `water` (`ลุ่มน้ำสาบมังกรคราม`) with `EXPED.beastPool`.
  - **External Market High-Tier Trade**: Updated `EXT.isTradable` and trader generation in `js/external_market.js` to support T4-T7 materials and non-basic pills with rare merchants (up to 3000 stones budget) and strict recipe input reserve protection floors (+4 reserve floor).
  - **Full 80-Species Encounter Coverage**: Corrected tier mismatches in `ridge_ecology_t3_t5` with `ECO2_BEAST_PLANT_SPIRIT_5`, added `ECO2_BEAST_AVIAN_3` to `east_ecology_t3_t4`, ensuring 100% of 80 species have accessible encounter routes.
  - **Observational Long-Term Simulation**: Executed 90-day (129,600 ticks) and 360-day (518,400 ticks) native simulations (`test/long_ecology_simulation.js`), logging real metrics (416 drops, 50 crafts, 33 pill consumptions, 11 CP shop purchases, 17 surplus sales, 5 member buys, 2 member sells, 156 final stock units) and confirming zero negative invariant violations.
- **Verification**:
  - `test/ecology_expansion.js`: ALL 11 TEST GROUPS PASSED (Exit Code: 0).
  - `test/run_all.js`: 41/45 test groups passed (100% of Node.js suites passing; only 4 browser/Playwright suites fail due to Termux mobile environment constraints).
  - `test/standalone.js`: 37 entrypoint scripts verified, standalone HTML offline execution verified (1,557 KB).
  - `tools/package_release.py`: ZIP package `JianghuSect_v1-10-12.zip` verified and built (4,905,670 bytes, sha256 `f752365b...`).
  - Byte-lock check: `js/human_core.js` strictly untouched (`155:2f9c9dd7`, sha256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`).

## Previous handoff — v1.10.11 martial paths / main-1 (2026-10-29)

Read [`JianghuSect_v1.10/docs/MARTIAL_PATHS.md`](JianghuSect_v1.10/docs/MARTIAL_PATHS.md) for mechanics, rates, catalog counts, save state and checks. Root [`docs/MARTIAL_IMPLEMENTATION_REPORT.md`](docs/MARTIAL_IMPLEMENTATION_REPORT.md) lists public interfaces and evidence; [`docs/MARTIAL_PATCH_LEDGER.md`](docs/MARTIAL_PATCH_LEDGER.md) records implementation decisions and final validation ownership. Preserve `main` and the byte-locked HC source.

The patch adds `data/data_martial.js`, `js/martial.js`, `js/knowledge.js`, `js/proficiency.js`, `js/retraining.js`; connects every native/adapted martial discovery source to a shared seeded rarity budget; integrates finite crystals, reusable manuals, CP transactions, member decisions, typed gear, branch acquisition, derived physical/life growth, active/passive conditions, shop/distribution suitability and explanatory UI. New content: 42 typed items/forge recipes across14 types, 2 branches, 10 rare techniques/passives plus5 free fundamentals. Catalog totals:37 branches,114 items,198 recipes,309 techniques. Runtime/martial version1.10.11; preserved imported source catalog1.10.9. Single file:36 scripts. No runtime LLM. Ordinary new cultivators use `NONE` until knowledge unlocks their first branch; founding valid branches are explicit bootstrap.


All29 skills now use shared read/practice and grouped UI (7 weapon skills, including external BOW/STAFF/FOCUS). Read [SKILL_EFFECTS.md](JianghuSect_v1.10/docs/SKILL_EFFECTS.md). Explicit retraining requires accessible knowledge and current transaction validation. Changing major path resetsstage1/prog0; same-path sub change yields max(1,oldStage-max(2,ceil(oldStage/2))). Track/learning/bottleneck/old identity effects reset, independent practice stays, and the NPC weighs skills, lost levels and known techniques, replacement knowledge, gear, personality, health and remaining life. It may prepare rather than switch;30/60-day cooldown prevents flipflops.

Release controller verified44/44 testgroups, browser/mobile0–48x/80NPC,518400ticks/360days and ZIP validation. See test/results/assertions.json, long_martial_paths_360d.json and docs/MARTIAL_IMPLEMENTATION_REPORT.md. Natural seed found10techcrystals and0retraining events; controlledtests verify acquisition/use/switching behavior. Final publication is to main-1; preserve main.

## Previous handoff — v1.10.10 NPC cognition / main-1 (2026-10-28)

Start with [`JianghuSect_v1.10/docs/NPC_HUMANLIKE_AI.md`](JianghuSect_v1.10/docs/NPC_HUMANLIKE_AI.md). It documents shipped behavior, office authority, locked future offices, test commands, and deliberately deferred Gemini ideas. The blueprint below is historical design input, not an unfinished requirement checklist. Preserve `main`; develop `main-1`.

New `js/cognition.js` connects personality-weighted intentions, bounded event memory, real medicine gifts, office plans and role-aware choices to existing AI/economy. Adds active commander/provision/herbal/wildwarden/steward offices, visible discipline/external-affairs titles, and five locked future offices. `SECT.officeState` is the common UI/appointment gate. Future office unlock requires a real implementation in `POSTS`, not a timer. Raids select a physically participating commander and eligible fallback after retreat; no automatic legendary group hunt yet.

Five new regression groups plus expanded UI checks; the single-file bundle now has 31 scripts. Runtime version is 1.10.10; source-content catalog remains 1.10.9 intentionally. No human_core byte changes. Legendary ordinary-refill bypass fixed. Long simulation trade-history assertion corrected to actual existing cap80. Browser environment helper is machine-local, not a game dependency. Full verification details are in the linked patch document and test/results artifacts.


## 1. Executive Summary & Authoritative Baseline

- **Repository**: `https://github.com/pyopasakserpiros-prog/Jhcluadeplusgpt.git`
- **Workspace**: `/data/data/com.termux/files/home/agy-dev`
- **Branch**: `main-1` (tracking `origin/main-1`)
- **Initial Baseline Commit**: `f6f9839`
- **Current Verification Status**:
  - `test/autonomous_economy_facilities.js`: **ALL 17 SCENARIOS VERIFIED PASSING** in Termux on Node.js v26.3.1 (Exit Code: 0).
  - `test/run_all.js`: **33/37 TEST GROUPS PASSING** (100% pass rate for all pure Node.js runtime, simulation, economy, data, and syntax checks; only 4 desktop Playwright-dependent tests fail due to Termux mobile environment constraints).
  - `JianghuSect_single.html`: Built and verified via `tools/build_single.js` (1,293 KB standalone distribution).
- **Hard Invariants**:
  - `js/human_core.js` strictly unmodified and byte-locked (fingerprint `155:2f9c9dd7 == 155:2f9c9dd7`, verified by `core_lock` suite).
  - No changes, resets, or merges to `main` or Codex's branches.
  - Development strictly on branch `main-1`.
  - Zero unverified claims of test passes or git pushes.

---

## 2. Root Cause Analysis & Fixes (Verifications on Node.js v26.3.1)

### A. Root Cause of Failure in `test/autonomous_economy_facilities.js`
1. **Scenario 1 (Line 24)**: `AssertionError: surplus quantity must be positive` (`actual: false`, `expected: true`)
   - **Diagnosis**: In `js/economy.js` (`ECO.inventoryIntelligence`), the object pushed into the `surplus` array stored the surplus quantity under the property name `excess`, whereas both the regression assertion (`test/autonomous_economy_facilities.js` line 24) and the UI (`js/ui.js` line 218) expected `surplusQty`. As a result, `surplusEntry.surplusQty` evaluated to `undefined`, making `undefined > 0` evaluate to `false`.
   - **Resolution**: Added `surplusQty: excess`, `stock: cur`, and `floor: resFloor` across all classified item records (`surplus`, `shortages`, `reserves`, `balanced`). Provided `shortage: shortages` and `reserveRequired: reserves` aliases on the returned report object. Updated `trackedKeys` to explicitly include `W.sect.shortageDirectives`.
2. **Scenario 3 (Line 82)**: `AssertionError: stones must not change without active merchants (492 !== 1000)`
   - **Diagnosis**: In `test/autonomous_economy_facilities.js`, Scenario 3 cleared `W.world.visitors = []` but left `W.threat.roadBlocked = 0`. During `EXT.daily(W)`, if road is not blocked, the daily visit chance roll spawned a new visiting trader on the open road and executed shortage buying, spending 508 stones.
   - **Resolution**: Set `W.threat.roadBlocked = 10` in Scenario 3 fixture, accurately representing a state with zero merchant access where no visitors can spawn or trade.
3. **Scenario 4 (Line 100)**: `AssertionError: transparent log must record purchase postponement`
   - **Diagnosis**: In `js/external_market.js` (`EXT.tradeSect`), when treasury funds fell below the safety reserve floor, the event was logged with `'หอคลังชะลอการสั่งซื้อจาก'` ("ชะลอการสั่งซื้อ" / order postponement) instead of `'หอคลังชะลอการจัดซื้อสินค้าจาก'` ("ชะลอการจัดซื้อ" / procurement postponement). The regression assertion at `test/autonomous_economy_facilities.js:100` explicitly checks `l.text.includes('ชะลอการจัดซื้อ')`.
   - **Resolution**: Updated the log message in `EXT.tradeSect` to `'หอคลังชะลอการจัดซื้อสินค้าจาก' + v.nameTh + ' เนื่องจากศิลาสำรองคงเหลือ (' + Math.round(S.stones) + ') ต้องคงไว้เหนือเกณฑ์ปลอดภัย (' + cashReserve + ' ศิลา)'`. Evaluated `hasShortage` upfront to also trigger when shortage directives or high-priority purchase needs are present.
4. **Scenario 5 (Welfare Emergency Medicine Protection)**:
   - **Diagnosis**: `BASIC_PILLS` (`P:BASIC_HP`, etc.) could inadvertently be collected as surplus candidates if stock exceeded minimum floors. Scenario 5 requires that welfare emergency medicine must never be liquidated to external traders as surplus.
   - **Resolution**: Excluded `BASIC_PILLS` from candidate surplus keys in `EXT.tradeSect` (`js/external_market.js`).
5. **Scenario 7 (Line 167)**: `AssertionError: arbitrage safeguard counter should increment`
   - **Diagnosis**: In `js/economy.js` (`ECO.donatePersonalProduct`), `c.arbitrageBlocked` was only incremented if `baseReward > maxReward`. In Scenario 7, `storeBoughtCost` was 30, making `maxReward = 26.4`, while `baseReward` for `P:BASIC_HP` was 7.7. Because `7.7 <= 26.4`, `baseReward > maxReward` was false, and the arbitrage counter was not incremented even though store-bought inputs were processed under the anti-arbitrage regime.
   - **Resolution**: Updated condition in `ECO.donatePersonalProduct` to `if ((purchasedCost > 0 || baseReward > maxReward) && CPE.S)`, guaranteeing that any donation of items crafted from store-bought inputs engages and increments the arbitrage safeguard counter.
6. **Scenario 9 (Facility Congestion Tracking)**:
   - **Diagnosis**: In `SECT.recordFacilityDemand` (`js/sect.js`), if `bldOrAct` was explicitly passed as `'dorm_outer'` with a high-rank NPC (such as `W.npcs[0]` who is rank 4), `(bldOrAct === 'sleep' || bid === 'dorm_outer')` remapped `bid` to `'dorm_core'`, causing demand to be attributed to the wrong dorm.
   - **Resolution**: Adjusted the condition to `if (npc && bldOrAct === 'sleep')` so explicit building IDs are respected.
7. **Robustness Safeguards**:
   - In `ECO.donatePersonalProduct`, gracefully resolves `purchasedCost = p.purchasedCost ?? p.storeBoughtCost ?? 0` and `ownValue = p.ownValue ?? 0` while strictly preserving the 88% anti-arbitrage cap.
   - In `ECO.ensureStockTracker`, initialized `st.usage = {}` and added method re-binding logic so methods survive JSON serialization/deserialization cycles.
   - In `SIM.deserialize`, re-attaches `SECT.ensureFacilityDemand`, `ECO.ensureStockTracker`, and `CPE.S` on restored world instances.

---

### B. Investigation of Existing Regression Failures (`skill_visual_browser`, `browser_mobile_perf`, `input_cancellation`, `startup_ui`)
- **Observed Failures**:
  - `skill_visual_browser` -> `FAIL` (exitCode: 1, `Error: Cannot find module 'playwright'`)
  - `browser_mobile_perf` -> `FAIL` (exitCode: 1, `Error: Cannot find module 'playwright'`)
  - `input_cancellation` -> `FAIL` (exitCode: 1, `Error: Cannot find module 'playwright'`)
  - `startup_ui` -> `FAIL` (exitCode: 1, `Error: Cannot find module 'playwright'`)
- **Analysis**:
  - All four test files require the `playwright` npm package (`require('playwright')`) and desktop Chromium browser automation.
  - In the local Termux environment on Android ARM64, `playwright` is not installed in `node_modules` (and desktop headless Chromium is not supported directly in standard Termux without an external X11/proot environment).
  - This is an expected, pre-existing environment difference already documented by Codex in `README.md` (lines 20-22 and 33-35):
    > *"โดย browser tests ต้องมี Playwright และ Chromium ที่ใช้งานได้ และต้องอนุญาต process/socket ในสภาพแวดล้อมนั้น ... การทดสอบในคลาวด์รอบนี้ใช้ HTTP ภายในและ Chromium ของระบบ ... จึงไม่ใช่การรับรองบนมือถือจริง"*
  - These four browser tests are completely separate from the economy and facility simulation logic. All 33 pure Node.js test suites execute natively without browser dependencies.

---

## 3. Implemented Architecture & System Changes

### A. Inventory Demand & Supply Intelligence (`js/economy.js`)
- **Usage Tracking**: `ECO.take` calls `W.sect.stockTracker.recordUsage(id, n, W.day)` to record genuine consumption events.
- **Rolling Evaluation**: `ECO.ensureStockTracker(W)` maintains 14-day and 30-day usage averages.
- **Dynamic Reserve Floor**: `ECO.reserveFloor(W, id)` calculates protective safety floors tailored to population size, consumption rates, and emergency needs.
- **4-State Classification**: `ECO.inventoryIntelligence(W, forceRefresh)` classifies all goods into `shortage`, `reserve-required`, `balanced`, and `surplus` with hysteresis and daily caching.

### B. Autonomous External Trade & Cash Safety (`js/external_market.js`)
- **Cash Reserve Floor**: External purchases enforce a strict treasury cash floor `cashReserve = Math.max(300, pop * 20) + 120`.
- **Intelligent Shortage Purchasing**: Sect actively purchases materials identified in `shortageDirectives` or critical reserve deficits from visiting traders, rejecting quotes exceeding `1.4 * basePrice`.
- **Autonomous Surplus Selling**: Sect liquidates genuine `surplus` goods to visiting traders who have available spirit stones and matching demand. Respects leadership secrecy policy (vetoing sales of Tier 3+ strategic materials) and never dips into safety floors.
- **Traceable Ledger & History**: Every transaction logs item, quantity, unit price, total, counterparty, and traceable reason into `W.world.tradeHistory` and `W.sect.ledger`.

### C. Contribution-Point (CP) Circulation & Anti-Arbitrage (`js/cpeco.js`)
- **Separation of Currencies**: Strict barrier maintained between internal CP (members) and spirit stones (external trade).
- **Mathematical Anti-Arbitrage**: In `ECO.donatePersonalProduct`, crafts produced using store-purchased ingredients cap donation payout at `Math.min(reward, 0.88 * storeBoughtCost)`. This guarantees a negative expected return for circular buy-craft-donate arbitrage. Increments `c.arbitrageBlocked`.
- **Circulation & Retirement Metrics**: Tracks `c.circulation` (active CP held by living members), `c.retired` (CP retired upon member death or departure via `CPE.retireNpc`), `c.minted`, and `c.burned`.
- **Shop Price Floor**: `CPE.priceOf` enforces a minimum margin `Math.ceil(CPE.reward(W, id, 1) * 1.3) + 2` ensuring store sale prices always exceed donation values.

### D. Demand-Driven Facility Expansion (`js/sect.js`)
- **Persistent Demand Tracking**: `SECT.ensureFacilityDemand(W)` and `SECT.recordFacilityDemand(W, bldOrAct, reason, npc)` track `failedAttempts`, `unmetDemands`, `congestedHours`, and a 20-day upgrade cooldown.
- **Leadership Evaluation**: `SECT.upgradeBuilding(W, m)` requires proven demand, checks treasury cash buffer `cashReserve = Math.max(500, pop * 25) + 800`, prevents duplicate construction orders, and logs approval/postponement with clear reasons.

### E. AI & Simulation Integration (`js/ai.js`, `js/sim.js`)
- **Congestion Detection**: In `AI.decide`, when `a.where(W, n)` returns null (station congestion), calls `SECT.recordFacilityDemand`. In `AI.assignBed`, when all dorm beds are full, records dorm demand.
- **Hourly Occupancy**: `SIM.hourly` samples building station occupancy; if occupancy reaches >= 95%, increments `congestedHours`.
- **Physical Capacity Expansion**: In `SIM.finishBuilding`, level increments, usable physical stations are instantiated via `SIM.expandStations`, NPCs without beds immediately receive assignments, and congestion counters are reset.
- **CP Retirement**: `SIM.retire` and `AI.kill` call `CPE.retireNpc` to retire remaining CP.

### F. Player-Facing UI Transparency (`js/ui.js`)
- **Stock Tab**: Displays *Inventory Intelligence* card with 4-state badges (`🟢 ส่วนเกินคลัง`, `🔴 ขาดแคลน`, `🟡 สำรองจำเป็น`) and reserve thresholds.
- **Shop Tab**: Displays CP circulation ledger (`แต้มหมุนเวียน`, `แต้มปลดเกษียณ`, `สกัดอาร์บิทราจ`) and external trade activity.
- **Building Tab**: Displays facility demand and congestion warnings (`⚠️ แออัด X ชม./พลาด Y ครั้ง`).
- **Log Tab**: Interactive multi-select category filter chips (`ทั้งหมด`, `👥 ผู้คน`, `⚔️ ต่อสู้/ล่า`, `⚗️ การผลิต`, `🪙 เศรษฐกิจ`, `🏯 อาคาร`, `⭐ สำคัญ`) with touch-friendly targets and memory-bounded ring buffer.

### G. 4-Direction Outer Wildlife & Multi-Pool System (`js/wildlife.js`, `js/world_map.js`)
- **Perimeter Expansion**: Walkable terrain and road paths around all four outer wall perimeters: West (`west_grove`), East (`east_crag`), North (`north_peak`), and South (`meadow`, `ridge`, `legend`).
- **Wall Gates**: 4 unblocked traversable arch gates (`T.ARCH`, block = 0) with connected roads at West ($x=30, y=80$), East ($x=210, y=80$), North ($x=118, y=18$), and South ($x=118, y=132$).
- **Multi-Pool Architecture**: Every zone contains 2–3 distinct weighted pools with strictly matching tier bands. Low tiers are non-aggressive.
- **Rules & Boundaries**: Beasts never enter sect walls. Combat clamping bounds beasts to outer zones. Legendary beasts persist for hidden duration without vanishing during active combat.
- **Loot Integration**: Hunt drops (`mats`, `organs`) enter personal inventory (`n.inv.mats`, `n.inv.organs`) and can be donated via `ECO.donatePersonalProduct` to earn CP and feed sect stock. Population capped at $\le 12$ active beasts.

### H. Facility Demand Decay & Congestion Bug Fix (`js/sect.js`)
- **Decay Routine**: `SECT.decayFacilityDemand(W)` in `SECT.daily`: clears stale demand (`failedAttempts = 0`, `unmetDemands = 0`, `congestedHours = 0`) if inactive $\ge 2$ days; halves if inactive $\ge 1$ day.
- **Decision Freshness**: `SECT.upgradeBuilding(W, m)` computes effective demand from elapsed time (`effFailed`, `effCongested`), preventing isolated single spikes and stale past congestion from triggering upgrades.
- **Concurrency & Reset**: Checks `underConstruction` to prevent duplicate concurrent upgrades; resets demand counters upon upgrade start.

### I. Regression Test Suite (`test/autonomous_economy_facilities.js`)
Covers all 17 verified scenarios:
1. Inventory overflow and surplus sales.
2. Shortages and external purchasing.
3. No merchant availability handling.
4. Insufficient spirit stones (cash reserve floor protection).
5. Emergency and welfare reserve protection.
6. Duplicate transaction prevention.
7. Donation–crafting–purchase arbitrage protection.
8. CP issuance, spending, and circulation tracking.
9. Sustained facility congestion tracking.
10. Construction completion and usable capacity expansion.
11. Multiple simultaneous NPC demands.
12. Save/load continuity.
13. Multiple deterministic simulation seeds (`eco-det-seed-1`, `eco-det-seed-2`).
14. Facility demand decay resets stale congestion.
15. Active sustained congestion triggers upgrade lifecycle and prevents duplicate expansion.
16. Multi-zone outer beasts, multi-pools, perimeter gates, and loot flow.
17. Rich wuxia event logging and multi-category filtering.
Wired into `test/run_all.js`.

---

## 4. Autonomous Watcher & Execution Protocol

The watcher script [`~/agy-dev/test_watcher.sh`](file:///data/data/com.termux/files/home/agy-dev/test_watcher.sh) dynamically supports multiple autonomous workflows without requiring manual terminal interaction:

1. **Economy & Facility Expansion Suite** (Fast 17-scenario test):
   - Trigger: Create `~/agy-dev/.run_tests` (empty, `1`, or `economy`).
   - Executes: `node test/autonomous_economy_facilities.js`.
   - Verified result: **17/17 scenarios PASS**.
2. **Full Regression Suite** (37 test groups):
   - Trigger: Create `~/agy-dev/.run_all` or write `all` into `~/agy-dev/.run_tests`.
   - Executes: `node test/run_all.js`.
   - Verified result: **33/37 groups PASS** (100% of native Node.js tests + 88 syntax files pass; 4 desktop Playwright tests fail as expected).
3. **Single-File Distribution Build**:
   - Trigger: Create `~/agy-dev/.run_build` or write `build` into `~/agy-dev/.run_tests`.
   - Executes: `node tools/build_single.js`.
   - Verified result: Rebuilds `JianghuSect_single.html` (1,293 KB).

### Git Commit & Push Instructions (Awaiting User Approval):
```bash
cd ~/agy-dev
git status
git add .
git commit -m "Implement rich event logs with multi-filters, 4-direction wildlife multi-pools, and facility demand decay"
git push origin main-1
```

---

## 5. Modified Files List

1. `JianghuSect_v1.10/js/economy.js` (Inventory intelligence, dynamic reserve floor, anti-arbitrage safeguard, personal product and material donation)
2. `JianghuSect_v1.10/js/external_market.js` (Autonomous surplus selling, shortage buying, welfare medicine protection)
3. `JianghuSect_v1.10/js/cpeco.js` (CP circulation tracking, retirement, anti-arbitrage price floors, pill consumption logs)
4. `JianghuSect_v1.10/js/sect.js` (Facility demand tracking, demand-driven building upgrades, demand decay routine)
5. `JianghuSect_v1.10/js/sim.js` (Hourly congestion sampling, physical station expansion, CP retirement hooks)
6. `JianghuSect_v1.10/js/world_map.js` (Outer perimeter walkable terrain and 3 new perimeter gates: West, East, North)
7. `JianghuSect_v1.10/js/wildlife.js` (Multi-zone outer beasts across 4 sides, multi-pools, perimeter combat clamping, cap <= 12, wuxia combat logs)
8. `JianghuSect_v1.10/js/ai.js` (Station congestion detection, rich wuxia event logs for injury, recovery, death, crafting purity/failure, herb harvest)
9. `JianghuSect_v1.10/js/ui.js` (Multi-select event log filtering with touch chips, inventory intelligence card, CP circulation metrics, facility congestion warnings)
10. `JianghuSect_v1.10/test/autonomous_economy_facilities.js` (All 17 regression scenarios + test bridge)
11. `JianghuSect_v1.10/test/results/assertions.json` (Updated regression assertions)
12. `JianghuSect_v1.10/JianghuSect_single.html` (Rebuilt standalone distribution: 1,293 KB)
13. `README.md` (Updated feature documentation and verified test status)
14. `HANDOFF.md` (Complete architecture, root causes, test results, and continuation instructions)
15. `AI_DECISION_DESIGN_NOTE.md` (Full design blueprint & engineering guide for human-like NPC decision AI)
16. `JianghuSect_v1.10/docs/AI_HUMAN_DECISION_BLUEPRINT_TH.md` (Docs copy of the NPC AI blueprint)

---

## 6. Next Development Blueprint: Human-Like NPC Decision AI

For the AI agent continuing development on NPC decision-making (`js/ai.js`), read the complete architectural proposal and implementation specification in:
- [**`AI_DECISION_DESIGN_NOTE.md`**](AI_DECISION_DESIGN_NOTE.md) (Root design note)
- [**`JianghuSect_v1.10/docs/AI_HUMAN_DECISION_BLUEPRINT_TH.md`**](JianghuSect_v1.10/docs/AI_HUMAN_DECISION_BLUEPRINT_TH.md) (Docs summary)

Key areas covered in the blueprint:
1. **Multi-Step Personal Goals (`n.goal`)**: `GOAL_BREAKTHROUGH_PREP`, `GOAL_SAVE_FOR_SCRIPTURE`, `GOAL_NURTURE_DISCIPLE`, `GOAL_SURPASS_RIVAL`, and `GOAL_SECT_CRISIS_RELIEF`.
2. **Experiential Memory Feedback**: Combat trauma/avoidance vs. vengeance (`n.lastTrauma`), gratitude/grudge ledgers affecting gifting and succession voting.
3. **Circadian Rhythms & Routines (`AI.circadianMod`)**: Morning qi cultivation/practice, daytime hall duties/hunting, evening tea/socializing, and night-owl bonuses for Demon/Soul/Solitude cultivators.
4. **Social Intelligence & Altruism**: Dynamic combat rescue when allies fight nearby, tangible item gifting (`n.inv.pills` / `n.inv.craftedPills`), and triadic gossip/empathy in `chat`.
5. **Emotional State Overrides**: Grief mourning at the ancestral hall, anger-driven sparring/arguing, heart-demon temptation, and burnout vs. workaholism.
6. **Environmental & Weather Sensitivity**: Element-aligned cultivation bonuses during snow/storms (`FROST`/`THUNDER`) and risk-aware outer zone selection.
7. **Inner Monologue UI (`UI.rNpc`)**: Displaying active personal goals and thoughts while strictly preserving the `js/human_core.js` byte-lock (`155:2f9c9dd7`), `W.rng` determinism, save/load compatibility, and 32×/48× mobile speed budget.

## Next assigned patch — Gemini 3.8 ecology/content expansion

The user requests the next agent to begin without another prompt. Open [GEMINI_NEXT_TASK.md](GEMINI_NEXT_TASK.md), then execute [docs/GEMINI_ECOLOGY_CONTENT_PROMPT.md](docs/GEMINI_ECOLOGY_CONTENT_PROMPT.md). This is an authorized future task, not a claim that80 new beasts already ship in the current martial patch. Target80 species/160 materials/80 recipes with real spawn/drop/crafting/NPC/economy links, preserve current martial knowledge/retraining rules and main branch. Exact schema examples, phases, acceptance tests and creative discretion are in the prompt. Read actual final APIs before editing; extend long simulation observational reporting for ECO2_ IDs.
