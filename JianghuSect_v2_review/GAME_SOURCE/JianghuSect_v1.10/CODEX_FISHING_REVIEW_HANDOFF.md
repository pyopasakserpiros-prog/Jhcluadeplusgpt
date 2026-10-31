# Codex Review Handoff — Southern Spirit River, Fishing, Mysterious Containers & Fish Utilization (`v1.12.3`)

## 1. Scope & Baseline Continuity
- **Base Version Extended**: `v1.12.2` (containing all 10 follow-up roadmap items from `ROADMAP/COMBINED_REVIEW_FOLLOWUPS_TH.md` + the optional Paginated Icon-Grid UI and Wuxia Item Sprite Atlas).
- **Pre-Fishing Baseline Snapshot**: Preserved at `baseline_pre_fishing/Jhcluadeplusgpt-main-1`, with portable relative-path patch generated at `patches/fishing_river_v1.12.3.patch`.
- **Immutable Core File**: `js/human_core.js` is untouched (`SHA-256: a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`).

## 2. Quick Verification Commands
Run from the project root (`JianghuSect_v1.10/`):
```bash
# 1. Run focused Southern River, Fishing, 100k Monte Carlo & Chromium UI suite
node test/fishing_river_suite.js

# 2. Run Wuxia Paginated Icon-Grid & Atlas UI suite across 3 viewports
node test/inventory_grid_ui_suite.js

# 3. Run Codex Combined 10-Item Review suite
node test/codex_combined_review.js

# 4. Run full 64-group regression suite
node test/run_all.js

# 5. Rebuild standalone single-file HTML
node tools/build_single.js
```

## 3. Checklist of Audited Invariants
1. **Map & River Geography (`js/world_map.js`)**:
   - `MAP.W = 240, MAP.H = 192` (`12 × 16` chunks). All 35 original buildings and 187 original stations keep identical IDs and coordinates in `y < 160`.
   - Water tiles (`T.WATER`) have `block = 2` and `cost = 0` (impassable). All 26 `fish` stations across `spirit_pond`, `river_west`, `river_dock` (`river_central`), and `river_east` are on walkable tiles (`block = 0`) immediately adjacent to `T.WATER` and reachable from the sect plaza (`118, 80`).
   - `MAP.EXIT = { x: 118, y: 188 }` is reachable over the central bridge (`x = 116..120`).
2. **Exact Lottery Probabilities (`js/fishing.js`, `docs/FISHING_LOOT_CATALOG_AND_PROBABILITIES.json`)**:
   - Completed successful catch: **90.0%** Fish / **10.0%** `ITEM_MYSTERY_RIVER_CONTAINER`.
   - Container opening: **50.0%** `TRASH_RIVER_DEBRIS` (0 stones, 0 CP, non-donatable, non-tradable) / **49.5%** Ordinary Eligible Item / **0.5%** Legendary Eligible Item (`0.05%` nominal per successful catch).
   - Ordinary Category Preference: `PILL (0.28) > EQUIPMENT (0.22) > MATERIAL (0.16) > TECH_CRYSTAL (0.14) > SUB_CRYSTAL (0.09) > TECH_MANUAL (0.07) > SUB_MANUAL (0.04)`.
   - Descending Tier Tables (`4`, `5`, `6`, `7` tiers): Strictly decreasing $P(T_1) > P(T_2) > \dots > P(T_K) > 0$, calibrated top tier (`1.2%–3.5%`), zero Legendaries in the ordinary branch, and zero innate-only techniques in any container pool.
3. **Unique Legendary Protection & Empty-Pool Fallback**:
   - Uses `VC.isTargetAlreadyClaimed`, `W.world.claimReceipts`, `W.world.martial.foundLegends`, and `VC.syncUniqueArtifacts` so none of the 11 Legendary Weapons or 22 Legendary Techniques can ever be duplicated. When all 33 are claimed, falls back deterministically to Tier 7 non-legendary items (`fallbackUsed: 'all_legendaries_claimed'`).
4. **Fish Utilization & UI Integration**:
   - Canteen cooking (`ECO.cookMeals`) uses common fish when grain is low or fish is abundant; 4 fish dishes grant bounded non-stacking `npc.foodBuff` gated by `satiety < 88`; 2 alchemy recipes brew fish pills at the Alchemy Hall.
   - All fish, dishes, mysterious containers, and river trash have dedicated Wuxia icons (`cells 64..71` in `assets/wuxia_item_atlas.png`) and interactive actions in both Paginated Icon-Grid and Classic List views.
