# CODEX_GRAPHICS_REVIEW_HANDOFF — Verification, Checksums, Risky Areas & Repro Guide

## 1. Environment & Git Honesty Note
All implementation, headless Chromium visual captures, and automated verification suites were executed in the local sandbox VM workspace (`/working_dir/c_53fc66554b7b7201/work/dev`). **No Git commit or push to GitHub was performed** (the sandbox VM has no outbound network access or remote Git credentials).

---

## 2. Hard Invariant Verification (`js/human_core.js`)

- **File**: `JianghuSect_v1.10/js/human_core.js`
- **SHA-256**: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`
- **Fingerprint**: `155:2f9c9dd7`
- **Status**: **100% UNMODIFIED** (verified by `test/core_lock.js` and `test/graphics_overhaul_suite.js`).

---

## 3. Exact Verification & Reproduction Commands

From inside `JianghuSect_v1.10/`:

```bash
# 1. Verify human_core.js SHA-256 lock
sha256sum js/human_core.js
# Expected: a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542  js/human_core.js

# 2. Rebuild offline standalone HTML
node tools/build_single.js

# 3. Run dedicated Graphics Overhaul Verification Suite (determinism, purity, caches, 22 legendary motifs, pause freeze)
node test/graphics_overhaul_suite.js

# 4. Run dedicated NPC Overhaul Verification Suite (from preceding patch)
node test/npc_life_authority_overhaul.js

# 5. Run Headless Chromium Visual & Mobile Performance Suites
node test/skill_visual_browser.js
node test/outside_visual_browser.js
node test/browser_mobile_perf.js
node test/input_cancellation.js
node test/startup_ui.js

# 6. Capture all 9 deterministic screenshots + 100-NPC day/night/rain benchmark
node tools/capture_graphics_suite.js after

# 7. Run the complete 60-group automated test runner
node test/run_all.js
# Expected: Assertions: 60/60 groups passed.
```

---

## 4. Risky Areas Inspected & Hardened

1. **Read-Only Rendering Purity (`drawLegendaryAura` & `appearance`)**:
   - *Risk*: Calling `MARTIAL.activePassives(n)` during `R.draw()` triggers `MARTIAL.reconcilePassives(n)`, which mutates `n.passiveLoadout` and `n._passRec`. Similarly, caching `n._ap` on `n` pollutes authoritative NPC objects.
   - *Mitigation*: Added `R.readOnlyActivePassives(n)` in `js/render.js` and moved appearance caching into renderer-owned `this.apCache` keyed by a live state signature `sig`. Verified in `test/graphics_overhaul_suite.js` that 120 ticks with `R.draw()` + `R.portrait()` + `R.resize()` produces byte-for-byte identical `SIM.serialize(W)` and `W.rng.getState()` compared to headless simulation, and leaves `n._ap === undefined` and `n._passRec === undefined`.
2. **80-NPC Mobile Browser Performance Budget (`< 3.0 ms/tick` in `test/browser_mobile_perf.js`)**:
   - *Risk*: When `test/browser_mobile_perf.js` pauses `G.speed = 0` and runs 720 synchronous `SIM.tick` calls inside `page.evaluate()`, background `requestAnimationFrame` redraws at `G.speed === 0` could compete for CPU time.
   - *Mitigation*: In `js/main.js`, throttled canvas redraws when `G.speed === 0` to `120 ms` (`renderEvery = G.speed === 0 ? 120 : ...`) and froze `R.animClock` while paused. `test/browser_mobile_perf.js` passes cleanly (`2.81–2.98 ms/tick`, `83.8–88.8×` sustainable speed cap).
3. **Chunk & Building Cache Stability Under Adaptive Quality**:
   - *Risk*: Tying offscreen chunk/building sprite scale `this.S` to `effectiveQuality` caused `this.chunks.clear()` mid-benchmark if adaptive quality shifted, triggering a 35-chunk rebuild spike.
   - *Mitigation*: Kept `this.S = clamp(Math.round(c.z * dpr), 1, 2)` tied strictly to zoom and DPR, and guarded `c.width`/`c.height` reassignment in `R.resize()` so canvas backing stores are only reallocated when pixel dimensions actually change.

---

## 5. Gameplay Corrections & Known Unfinished Work

- **Gameplay Corrections**: None required in simulation modules; the fix in `R.readOnlyActivePassives(n)` and `this.apCache` was confined to `js/render.js` to eliminate renderer side effects on NPC objects.
- **Known Unfinished Work**: None within the scope of `NEXT_GRAPHICS_DEVELOPMENT_PROMPT.txt` or `docs/NEXT_NPC_DEVELOPMENT_PROMPT.md`. All required architectural families, Lv.1–3 upgrade visuals, shared character/portrait profiles, true weapon silhouettes, 22 legendary motifs, quality/reduced-motion settings, inline SVG HUD icons, matched before/after screenshots, and reports are complete and verified.
