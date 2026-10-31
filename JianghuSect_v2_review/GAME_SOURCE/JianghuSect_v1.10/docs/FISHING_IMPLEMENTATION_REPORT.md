# Southern Spirit River, Fishing, Mysterious Containers & Fish Utilization — Implementation Report (`v1.12.3`)

## 1. Executive Summary & Baseline Audit

This report documents the design, implementation, probability verification, and 3×180-day simulation telemetry for the **Southern Spirit River (`ธารน้ำปราณทักษิณ`), Functional Fishing Activity, 90/10 & 50/49.5/0.5 Mysterious Container Lottery, Fish Utilization (Cooking, Culinary Food Buffs, Alchemy), and NPC Integration** built directly on top of the `v1.12.2` source (retaining all 10 follow-up roadmap items and the Paginated Icon-Grid UI + Wuxia Sprite Atlas).

### Baseline Inspection Summary (Recorded Separately)
- **Existing Functionality Retained**:
  - `js/world_map.js`: `240×160` tile grid (`TILE = 16`), 35 buildings/open areas, `spirit_pond` inside the sect with 6 `fish` and 4 `relax` stations, 4 wall gates, `SAFE_BELT` (`x: 80..156, y: 132..156`), and A* pathfinding (`MAP.findPath`).
  - `js/ai.js`: `A.leisure` had a decorative `mode: 'fish'` branch at `spirit_pond` that conjured `ECO.add(W, 'meal', 2)` every 90 ticks with 40% chance without fish items, zone pools, or inventory handling; `A.cook` required `ECO.count(W, 'grain') >= 3` and could not use fish.
  - `js/economy.js`, `js/cpeco.js`, `js/sect.js`: Reservation-backed crafting (`ECO.reserveInputs` / `ECO.finishCraft`), personal crafting (`ECO.personalCraft`), material/pill donation (`SECT.donateMat`, `ECO.donatePersonalProduct`), and stock distribution.
  - `js/knowledge.js` & `js/visitors_clues.js`: Centralized technique/subpath knowledge system (`MARTIAL.knowledge`, `MARTIAL.isInnateTech`) and unique legendary artifact ownership accounting (`VC.LEGENDARY_WEAPONS`, `VC.isTargetAlreadyClaimed`, `VC.syncUniqueArtifacts`, `W.world.claimReceipts`).
  - `js/ui.js`: Dual-mode (`grid` / `list`) Personal Inventory, Sect Storage, and Sect Shop browser backed by `assets/wuxia_item_atlas.png`.
- **Verified Baseline Gaps Addressed**:
  1. No southern river geography existed below the southern open field (`y = 133..159`).
  2. Leisure fishing at `spirit_pond` bypassed the item catalog, conjuring `meal` units directly into sect stock without fish species, bounded pools, or personal bag decisions.
  3. Canteen cooking (`A.cook` / `ECO.cookMeals`) depended exclusively on `grain` and had no culinary dish buffs.
  4. No mysterious river container (`ITEM_MYSTERY_RIVER_CONTAINER`) or multi-stage container lottery existed.
- **Immutable Core Invariant**:
  - `js/human_core.js` remains 100% untouched (`SHA-256: a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`).

## 2. Map Expansion & Southern Spirit River (`240 × 192`)

- **Southward World Extension (`js/world_map.js`)**:
  - Expanded `MAP.H` from `160` (`H_BASE = 160`) to **`192`** (`12 × 16`, preserving exact 16×16 chunk alignment `CH = 16` in `js/render.js`).
  - Preserved 100% of existing building coordinates, IDs (`0..34`), station IDs (`0..186`), and RNG call sequences for `y < 160` by using `H_BASE = 160` in the original generation loops and running `buildSouthernRiverExtension(M, seed, sid)` with a dedicated deterministic RNG (`new U.RNG('south_river_' + (seed || 1))`).
  - Carves the meandering **Southern Spirit River (`ธารน้ำปราณทักษิณ`)** across `x = 2..237, y ≈ 166..174` with impassable water (`T.WATER, block = 2, SPEED[T.WATER] = 0`) bordered by walkable sandy/mossy banks (`T.SAND` / `T.MOSS, block = 0`) and riverside trails (`T.ROAD`).
  - Adds **3 walkable bridges** across the river:
    1. **Central Stone/Timber Bridge (`x = 116..120`)** carrying the main southern highway across the river to the updated world exit `MAP.EXIT = { x: 118, y: 188 }`.
    2. **West Bamboo Footbridge (`x = 62..64`)** connecting the western bank and southern trail.
    3. **East Stone Bridge (`x = 172..174`)** connecting the eastern deep pool and southern bank.
  - Adds **6 wooden fishing piers (`T.FLOOR, block = 0`)** and **3 Southern River open zones** alongside the sect's internal `spirit_pond` (total **26 reachable fishing stations**):
    - `spirit_pond` (`สระธารวิญญาณ`, inside sect walls): 6 `fish` stations, 4 `relax` stations.
    - `river_west` (`คุ้งน้ำไผ่หยก`, `x = 44..81, y = 162..177`): 6 `fish` stations, 2 `relax` stations.
    - `river_dock` / `river_central` (`ท่าน้ำธารปราณทักษิณ`, `x = 98..139, y = 162..177`): 8 `fish` stations, 4 `relax` stations.
    - `river_east` (`วังน้ำศิลาคราม`, `x = 154..193, y = 161..178`): 6 `fish` stations, 2 `relax` stations.
- **Idempotent Save Migration (`js/sim.js`, `js/fishing.js`)**:
  - Older saves (`v1.9`, `v1.10`, `v1.12.x`) deserialize onto the `240×192` map without shifting any existing building or teleporting any NPC, and initialize `W.fishing` deterministically once. Saving and reloading a world with active fishing preserves exact zone stocks, caught fish, containers, and settled container receipts (`W.fishing.containerReceipts`).

## 3. Fish Catalog & Bounded Zone Ecology (`js/fishing.js`)

### 3.1 10-Species Fish Catalog (Tiers 1–5)

| Species ID | Thai Name | Tier | Rarity | Value | Meal Yield | Base Weight | Min Skill | Eligible Zones | Primary Culinary / Alchemy Uses |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| `MAT_FISH_SILVER_CARP_1` | ปลาตะเพียนเงินลำธาร | 1 | Common | 6 | 3 | 36.0 | 0 | `spirit_pond`, `river_west`, `river_central`, `river_east` | Canteen meals, `FOOD_STEAMED_SPIRIT_FISH` |
| `MAT_FISH_BAMBOO_GUDGEON_1` | ปลาซิวไผ่หยก | 1 | Common | 7 | 3 | 32.0 | 0 | `spirit_pond`, `river_west`, `river_central` | Canteen meals, `FOOD_STEAMED_SPIRIT_FISH` |
| `MAT_FISH_GOLDEN_PERCH_2` | ปลากะพงเกล็ดทอง | 2 | Refined | 16 | 4 | 22.0 | 4 | `spirit_pond`, `river_west`, `river_central` | Canteen meals, `FOOD_STEAMED_SPIRIT_FISH` |
| `MAT_FISH_MIST_CATFISH_2` | ปลากดหมอกคราม | 2 | Refined | 18 | 4 | 20.0 | 5 | `river_west`, `river_central`, `river_east` | `FOOD_EEL_VITALITY_BROTH` |
| `MAT_FISH_JADE_KOI_3` | ปลาหลีฮื้อหยกขาว | 3 | Rare | 38 | 5 | 12.0 | 10 | `spirit_pond`, `river_central`, `river_east` | `FOOD_JADE_KOI_SOUP`, `REC_FISH_GALL_CLARITY_3` |
| `MAT_FISH_SPIRIT_EEL_3` | ปลาไหลปราณวารี | 3 | Rare | 42 | 5 | 11.0 | 12 | `river_west`, `river_east` | `FOOD_EEL_VITALITY_BROTH`, `REC_FISH_GALL_CLARITY_3` |
| `MAT_FISH_STARLIGHT_TROUT_4` | ปลาดาราเก้าจุด | 4 | Exceptional | 85 | 6 | 5.5 | 18 | `river_central`, `river_east` | `FOOD_JADE_KOI_SOUP`, `REC_FISH_GALL_CLARITY_3` |
| `MAT_FISH_CRIMSON_LOTUS_CARP_4` | ปลาชาดบัวสวรรค์ | 4 | Exceptional | 92 | 6 | 5.0 | 20 | `river_west`, `river_central` | `FOOD_JADE_KOI_SOUP`, `REC_DRAGON_CARP_MARROW_5` |
| `MAT_FISH_DRAGON_WHISKER_CARP_5` | ปลามังกรหนวดหยก | 5 | Exceptional | 195 | 8 | 2.0 | 28 | `river_east` | `FOOD_DRAGON_CARP_BANQUET`, `REC_DRAGON_CARP_MARROW_5` |
| `MAT_FISH_FROST_JADE_STURGEON_5` | ปลาสเตอร์เจียนหยกเหมันต์ | 5 | Exceptional | 210 | 8 | 1.8 | 30 | `river_central`, `river_east` | `FOOD_DRAGON_CARP_BANQUET`, `REC_DRAGON_CARP_MARROW_5` |

### 3.2 Bounded Zone Pools & Environmental Factors
- **Zone Capacities & Daily Recovery**:
  - `spirit_pond`: `maxStock = 18`, `dailyRegen = 6` (Tiers 1–3 only).
  - `river_west`: `maxStock = 32`, `dailyRegen = 10` (Tiers 1–4).
  - `river_central`: `maxStock = 38`, `dailyRegen = 12` (Tiers 1–5).
  - `river_east`: `maxStock = 28`, `dailyRegen = 9` (Tiers 1–5, richest T4–T5 pool).
- **Active Modifiers**:
  - **Season, Weather & Time-of-Day**: Each species defines `preferredSeasons` (`×1.25`), `preferredWeather` (`×1.28`), and `preferredTime` (`morning`, `day`, `dusk`, `night`, `×1.20`). Zone daily recovery scales with season (`Spring ×1.20`, `Summer ×1.10`, `Autumn ×1.00`, `Winter ×0.80`) and weather (`Rain ×1.18`, `Snow ×0.85`).
  - **Angler Skill & Perceptiveness**: `FISHING.skillOf(W, n)` (initialized from fisher origin + survival + cooking, and practiced during fishing without mutating legacy `n.h.skills`) increases bite rate, unlocks higher catch multipliers on Tier 3–5 species, and improves individual catch quality (`0.75..1.45`).

## 4. Exact Catch & Mysterious Container Probabilities

### 4.1 Stage 1 — Completed Successful Catch Outcome (`FISHING.CATCH_OUTCOME_PROBS`)
- **Fish (`FISH`)**: **90.0%** (`0.9000`)
- **Mysterious Container (`ITEM_MYSTERY_RIVER_CONTAINER` — `หีบไม้โบราณแช่น้ำ`)**: **10.0%** (`0.1000`)

### 4.2 Stage 2 — Mysterious Container Opening (`FISHING.CONTAINER_BRANCH_PROBS`)
- **Worthless Trash (`TRASH_RIVER_DEBRIS` — `เศษซากใต้น้ำไร้ค่า`)**: **50.0%** (`0.5000` per container; `5.00%` per successful catch). Value is `0` stones / `0` CP; blocked from donation and external trade.
- **Ordinary Eligible Item (`ORDINARY`)**: **49.5%** (`0.4950` per container; `4.95%` per successful catch).
- **Legendary Eligible Item (`LEGENDARY`)**: **0.5%** (`0.0050` per container; **`0.05%` = `0.0005` nominal per successful catch**).

### 4.3 Stage 3A — Ordinary Category Preference (`FISHING.ORDINARY_CATEGORY_WEIGHTS`)
Preserves the strict inequality `Pills > Equipment > Technique Crystals > Subpath Crystals > Technique Manuals > Subpath Manuals` (with `Materials` placed between Equipment and Technique Crystals):

| Category Key | Tier Count ($K$) | Conditional on Ordinary Branch | Conditional on Container Open (`×0.495`) | Per Successful Catch (`×0.0495`) |
| :--- | :---: | :---: | :---: | :---: |
| `PILL` | 7 | **28.00%** (`0.2800`) | 13.8600% (`0.138600`) | 1.38600% (`0.0138600`) |
| `EQUIPMENT` | 5 | **22.00%** (`0.2200`) | 10.8900% (`0.108900`) | 1.08900% (`0.0108900`) |
| `MATERIAL` | 7 | **16.00%** (`0.1600`) | 7.9200% (`0.079200`) | 0.79200% (`0.0079200`) |
| `TECH_CRYSTAL` | 7 | **14.00%** (`0.1400`) | 6.9300% (`0.069300`) | 0.69300% (`0.0069300`) |
| `SUB_CRYSTAL` | 4 | **9.00%** (`0.0900`) | 4.4550% (`0.044550`) | 0.44550% (`0.0044550`) |
| `TECH_MANUAL` | 7 | **7.00%** (`0.0700`) | 3.4650% (`0.034650`) | 0.34650% (`0.0034650`) |
| `SUB_MANUAL` | 4 | **4.00%** (`0.0400`) | 1.9800% (`0.019800`) | 0.19800% (`0.0019800`) |
| **Total** | — | **100.00%** (`1.0000`) | **49.5000%** (`0.495000`) | **4.95000%** (`0.0495000`) |

### 4.4 Stage 3B — Calibrated Descending Tier Tables (`FISHING.ORDINARY_TIER_TABLES`)
Every supported tier count ($K \in \{4, 5, 6, 7\}$) satisfies $P(T_1) > P(T_2) > \dots > P(T_K) > 0$, sums to `1.0000`, calibrates the highest tier to `1.20%–3.50%` so top-tier items remain genuinely rare even in 4- and 5-tier categories, and strictly excludes Legendary items:

| Tier | 4-Tier Categories (`SUB_CRYSTAL`, `SUB_MANUAL`) | 5-Tier Categories (`EQUIPMENT` Ordinary T1–T5) | 6-Tier Table (Supported General 6-Tier Pool) | 7-Tier Categories (`PILL`, `MATERIAL`, `TECH_CRYSTAL`, `TECH_MANUAL`) |
| :---: | :---: | :---: | :---: | :---: |
| **Tier 1** | **56.00%** (`0.5600`) | **50.00%** (`0.5000`) | **46.00%** (`0.4600`) | **44.00%** (`0.4400`) |
| **Tier 2** | **28.00%** (`0.2800`) | **26.50%** (`0.2650`) | **25.50%** (`0.2550`) | **25.00%** (`0.2500`) |
| **Tier 3** | **12.50%** (`0.1250`) | **13.50%** (`0.1350`) | **14.00%** (`0.1400`) | **14.50%** (`0.1450`) |
| **Tier 4** | **3.50%** (`0.0350`) | **7.00%** (`0.0700`) | **8.00%** (`0.0800`) | **8.20%** (`0.0820`) |
| **Tier 5** | — | **3.00%** (`0.0300`) | **4.50%** (`0.0450`) | **4.60%** (`0.0460`) |
| **Tier 6** | — | — | **2.00%** (`0.0200`) | **2.50%** (`0.0250`) |
| **Tier 7** | — | — | — | **1.20%** (`0.0120`) |
| **Sum** | **100.00%** (`1.0000`) | **100.00%** (`1.0000`) | **100.00%** (`1.0000`) | **100.00%** (`1.0000`) |

### 4.5 Eligibility, Unique Legendary Guards & Documented Empty-Pool Fallback
- **Innate-Only Exclusion**: All `TECH_CRYSTAL` and `TECH_MANUAL` pools (both ordinary and legendary) filter out `t.innateOnly` and `MARTIAL.isInnateTech(t)`.
- **Duplicate Manual Compensation**: If a `TECH_MANUAL` or `SUB_MANUAL` roll selects a tier where all manuals are already in `W.sect.library` / `W.sect.subLibrary`, it converts cleanly to a one-use `TECH_CRYSTAL` / `SUB_CRYSTAL` of the same tier.
- **Unique Legendary Ownership Accounting**: The `0.5%` Legendary branch queries `FISHING.buildEligibleLegendaryPool(W)`, which checks all 11 Legendary Weapons and 22 non-innate Legendary Techniques via `VC.isTargetAlreadyClaimed(W, ...)`. Minted legendary weapons and techniques record settled receipts in `W.world.claimReceipts`, update `W.world.martial.foundLegends`, and sync `W.world.uniqueArtifacts` so no unique legendary artifact is ever duplicated.
- **Documented Empty-Pool Fallback**: When all 33 unique legendaries in the world have already been claimed, a `0.5%` Legendary roll safely falls back to a Tier 7 non-legendary Pill or Technique Crystal and records `fallbackUsed: 'all_legendaries_claimed'`.

## 5. Fish Utilization: Canteen Cooking, Culinary Dishes, Food Buffs & Alchemy

- **Canteen Meal Alternative (`ECO.cookMeals`)**: Canteen cooks (`A.cook`) can cook with common fish (`Tier 1–2`) whenever grain is low (`< 6`) or fish stock is abundant (`>= 3`), producing `3–4` canteen `meal`s per fish plus bonus `FOOD_STEAMED_SPIRIT_FISH` servings.
- **4 Culinary Fish Dishes & Bounded Food Buffs (`npc.foodBuff`)**:
  1. `FOOD_STEAMED_SPIRIT_FISH` (`ปลานึ่งขิงปราณหอม`, Tier 1): `+34` satiety, `+4` mood, grants `food_nourish` (`+12%` HP regen, `-12%` energy drain for 6 hours).
  2. `FOOD_EEL_VITALITY_BROTH` (`ซุปปลาไหลปราณบำรุงโลหิต`, Tier 2): `+38` satiety, `+10%` HP, `+12%` Qi, grants `food_qi_flow` (`+14%` Qi regen, `+8%` cultivation rate for 7 hours).
  3. `FOOD_JADE_KOI_SOUP` (`แกงจืดปลาหยกบัวสวรรค์`, Tier 3): `+36` satiety, `-5` stress, `-3` heartDemon, grants `food_focus` (`+12%` study/skill efficiency, `-20%` stress gain for 7 hours).
  4. `FOOD_DRAGON_CARP_BANQUET` (`หม้อไฟปลามังกรหยกทิพย์`, Tier 5): `+45` satiety, `+16%` HP, `+18%` Qi, grants `food_dragon_vitality` (`+18%` HP/Qi regen, `+12%` cultivation/study rate for 8 hours).
  - **Appetite & Non-Stacking Rules**: Disciples cannot eat a fish dish when `satiety >= 88` (`too_full`), and eating a new dish replaces any active `npc.foodBuff` rather than stacking.
- **2 Alchemy Fish Pill Recipes**:
  1. `REC_FISH_GALL_CLARITY_3` (`โอสถดีปลาหยกกระจ่างจิต`, Tier 3): `1x MAT_FISH_JADE_KOI_3 + 1x MAT_HERB_JADE_LOTUS_2` → `clearHeartDemon: 26, clearToxic: 18, insight: 1.32, cultivationProgress: 38`.
  2. `REC_DRAGON_CARP_MARROW_5` (`โอสถไขกระดูกปลามังกรทะลวงขั้น`, Tier 5): `1x MAT_FISH_DRAGON_WHISKER_CARP_5 + 1x MAT_HERB_BLOOD_GINSENG_3` → `cultivationProgress: 115, breakthroughBonus: 0.16, healHealth: 45, healInjury: 35`.

## 6. Verification, 100,000-Trial Monte Carlo & 3×180-Day Natural Simulation Telemetry

### 6.1 100,000-Trial Monte Carlo Verification (`test/fishing_river_suite.js`)
- **Successful Catch Lottery ($N = 100,000$)**:
  - Fish: **89.94%** (Target: `90.00%`)
  - Mysterious Container: **10.05%** (Target: `10.00%`)
- **Mysterious Container Opening Lottery ($N = 100,000$)**:
  - Worthless Trash: **49.89%** (Target: `50.00%`)
  - Ordinary Eligible Item: **49.66%** (Target: `49.50%`)
  - Legendary Eligible Item: **0.446%** (Target: `0.500%`)
  - Empirical category counts strictly satisfied `PILL > EQUIPMENT > MATERIAL > TECH_CRYSTAL > SUB_CRYSTAL > TECH_MANUAL > SUB_MANUAL`, and empirical tier counts strictly decreased across all tiers with zero legendaries in the ordinary branch.

### 6.2 3 × 180-Day Natural Simulation Summary (`test/results/fishing_river_180d_3seeds.json`)

| Seed | Wall Time | Final Pop | Successful Catches | Fish Caught (%) | Containers Caught (%) | Containers Opened (Trash / Ord / Leg) | Canteen Meals from Fish | Fish Dishes Cooked / Eaten | Fish Donated | Unique Weapon Audit |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `fishing-natural-seed-1` | 165.04s | 35 | 248 | 221 (89.1%) | 27 (10.9%) | 27 (10 / 17 / 0) | 439 | 216 / 224 | 140 | `PASS (0 dup)` |
| `fishing-natural-seed-2` | 189.07s | 46 | 133 | 119 (89.5%) | 14 (10.5%) | 14 (11 / 3 / 0) | 171 | 117 / 125 | 54 | `PASS (0 dup)` |
| `fishing-natural-seed-3` | 156.27s | 35 | 84 | 77 (91.7%) | 7 (8.3%) | 7 (6 / 1 / 0) | 134 | 77 / 80 | 41 | `PASS (0 dup)` |
| **Combined (540 Days)** | **510.38s** | — | **465** | **417 (89.68%)** | **48 (10.32%)** | **48 (27 / 21 / 0)** | **744** | **410 / 429** | **235** | **`PASS`** |

### 6.3 Full Regression & Browser Suite Results
- **`node test/run_all.js`**: **64 / 64 test groups passed** (including `fishing_river_suite`, `inventory_grid_ui_suite`, `codex_combined_review`, `browser_mobile_perf`, `standalone`, `legacy_save`, `npc_cognition`, and `npc_life_authority_overhaul`).
- **Substantive Design Refinements Reported**:
  1. **Subpath Loot Tier Classification ($K=4$)**: Because subpath specialization branches in `js/knowledge.js` previously had binary `tier: 1..2` for study-hall gating, we introduced a dedicated 4-tier loot rarity classification (`FISHING.SUBPATH_LOOT_TIER`, Tiers 1–4 across all 37 subpaths) for container rolls while keeping `k.tier = 1..2` intact so `studySubpath` gates are unaffected.
  2. **Non-Mutating Fishing Skill & Knowledge Storage (`W.fishing.npcData`)**: Stored NPC fishing skill and river/species knowledge in `W.fishing.npcData[npc.id]` (accessed via `FISHING.skillOf(W, n)` and `FISHING.knowledgeOf(W, n)`) so legacy save `n.h` objects and `n.cognition` snapshots remain 100% schema-compatible across save/load round-trips.
