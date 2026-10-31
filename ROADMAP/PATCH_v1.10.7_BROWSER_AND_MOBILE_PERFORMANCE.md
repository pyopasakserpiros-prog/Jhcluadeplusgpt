# Patch v1.10.7 — Browser & Mobile Performance (Priority P2)

## Overview
This patch completes **Priority P2: Browser and mobile performance** from `ROADMAP/ROADMAP.md`. It verifies and optimizes the real browser and mobile runtime across narrow phone (`360×800`), standard phone (`412×860`), and desktop (`1280×800`) viewports, touch/mouse gestures, full v1.10 UI tab sweeps, save/load roundtrips, all speed multipliers (`0×` through `48×`), and large cultivator populations (`80–100+` active NPCs) while keeping `js/human_core.js` strictly byte-locked (`155:2f9c9dd7`).

---

## Key Changes & Optimizations

### 1. Simulation & Pathfinding Hot-Path Optimizations (100% Bit-for-Bit Deterministic)
- **Min-Heap Sift Optimization (`js/util.js`)**:
  - Replaced array-destructuring swaps (`[k[p], k[i]] = [k[i], k[p]]`) inside `U.MinHeap.push` and `U.MinHeap.pop` with scalar hole-sifting assignments, eliminating temporary array allocations and GC pressure during A* pathfinding.
- **A* Path Cache & Shared Heap (`js/world_map.js`)**:
  - Replaced string-concatenated cache keys (`sx + ',' + sy + ',' + gx + ',' + gy`) with packed 32-bit unsigned integer keys (`((sx << 24) | (sy << 16) | (gx << 8) | gy) >>> 0`) and reused a single `U.MinHeap` instance across calls.
  - Replaced full-cache wipes at 3,000 entries (`M._pc.clear()`) with incremental FIFO eviction (evicting 2,000 oldest entries at 12,000 capacity) to prevent sudden pathfinding stalls on large populations.
- **Combat & Movement Stat Fast Paths (`js/stats.js`)**:
  - Cached pre-condition/pre-buff base stat vectors on `n._csBase` (`getBaseFast`), decoupling gradual martial skill increments (`martial`) from the 26 `HC.eff` / `HC.derived` / technique / equipment base calculations.
  - Added O(1) fast paths for `ST.hpMax(n)` and `ST.moveMult(n)` when no temporary combat buffs/statuses are active, avoiding full 12-stat recomputations during routine per-minute `AI.needs` and `AI.walkSpeed` ticks.
  - Eliminated temporary 12-key `p` and `f` object allocations in `computeFast(n)` when no temporary buffs/statuses are active.
- **AI Decision, Needs, & Compatibility Caching (`js/ai.js`, `js/economy.js`, `js/cpeco.js`)**:
  - Precomputed `VAL_IDS`, `INT_IDS`, and Thai interest labels at module initialization in `js/ai.js` instead of filtering the 155-stat `HC.STAT_DEFS` array inside `AI.compat` and `interestTerm`.
  - Cached per-day/per-version top-4 interests (`n._topInt`), pairwise social compatibility (`a._compat[b.id]`), and per-minute metabolic/mood decay coefficients (`n._nd` in `AI.needs`).
  - Made `AI.freeStation` allocation-free for single-building string lookups.
  - Added a zero-allocation fast path in `ECO.inputsOk` for 1- and 2-ingredient recipes and cached `CPE.pickPurchase` per tick (`n._pickCache`) so `A.shop.can` and `A.shop.score` do not scan sect stock twice on the same tick.
- **Canvas Text Measurement Cache (`js/render.js`)**:
  - Added `measureCached(ctx, font, text)` (`TW_CACHE`) in `js/render.js` so building labels, market badges, and NPC nameplates do not invoke `ctx.measureText` repeatedly on every rendered frame.

### 2. Mobile UI, Touch Gestures, & Responsive Viewport Fixes
- **Toast vs Minimap Overlay Fix (`css/style.css`)**:
  - Assigned `z-index: 6` to `#minimap` and constrained `#toasts` to `right: 106px` on mobile viewports (`@media(max-width:699px)`) so active toast notifications never visually cover or block pointer/touch events on `#minimap`.
- **Empty Plaza Deselection Fix (`js/render.js`)**:
  - Excluded the open central `plaza` surface from building hit-testing in `R.pickAt(sx, sy)` (matching `UI.rSect`'s building list), ensuring that tapping empty plaza ground cleanly deselects the active NPC.
- **Multi-Touch Pointer Capture Guard (`js/main.js`)**:
  - Guarded `setPointerCapture(e.pointerId)` in `try/catch` blocks on `#map` and `#minimap` so rapid multi-finger pinch gestures and synthetic pointer dispatches never abort gesture tracking.
- **Empty World History State (`js/ui.js`)**:
  - Added an explicit empty-state message (`<div class="muted">ยังไม่มีเหตุการณ์นอกสำนัก</div>`) to `UI.rWorld` (`hist` tab) so fresh worlds never render an empty sheet body.

### 3. Headless Chromium CDP Playwright Driver & Automated Browser Benchmark (`tools/cdp_playwright.js`, `test/browser_mobile_perf.js`)
- Added a zero-dependency Chrome DevTools Protocol (CDP) Playwright compatibility driver (`tools/cdp_playwright.js`) driving local headless Chromium (`Chromium 155`).
- Verified all existing browser suites (`test/browser.js`, `test/browser2.js`, `test/browser3.js`, `test/gesture.js`, `test/perf.js`) and added `test/browser_mobile_perf.js` (`test/results/browser_mobile_perf_v1107.json`):
  - **Responsive Viewports (`360×800`, `412×860`, `1280×800`)**: Zero horizontal overflow; all 8 speed buttons (`0×, 1×, 2×, 4×, 8×, 16×, 32×, 48×`), 5 bottom nav buttons, and `#minimap` fit within viewport bounds and remain clickable.
  - **Gestures & Controls**: Single-finger drag pan, two-finger pinch zoom, wheel zoom, tap NPC selection (`#selInfo`), tap empty ground deselection, and `#minimap` camera navigation all pass.
  - **Full v1.10 Tab Sweep & Save/Load**: All 24 panel tabs (including `world -> content`, `world -> disc`, `sect -> policy/stock/shop`), 35 buildings, and all 8 NPC tabs (`ov` through `cmp`) render with zero console or page errors; UI save/load slot 1 restores exact world state and `runtimeTiming`.
  - **Large Population (`80` Cultivators) & Multi-Speed (`0×–48×`) Benchmark**:
    - 80-cultivator tick cost reduced to **`~1.20 ms/tick`** (`~830 ticks/s`, sustainable up to **`207×`** realtime speed, well above the `48×` = `192 ticks/s` ceiling).
    - Live frame loop at `16×`, `32×`, and `48×` maintains target tick throughput (`64`, `128`, `192 ticks/s`) at `54–60 FPS` with `< 1` pending tick of accumulator debt.
