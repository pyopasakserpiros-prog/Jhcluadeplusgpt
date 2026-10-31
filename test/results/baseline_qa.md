# Baseline QA and timing patch evidence

Tested 2026-10-27 using Node v24.22.1. Baseline `/workspace/scratch/4620f7523869/baseline/JianghuSect_v1` was not modified. Target edits are limited to `JianghuSect_v1.10/js/main.js` and new `test/runtime_timing.js`.

## Actual results

| Command | Type | Result |
|---|---|---|
| `node test/core_lock.js` | Assertions | PASS, 5 checks |
| `node test/cp_economy.js` | Assertions | PASS |
| `node test/speed_controls.js` | Mock DOM handler and source assertions | PASS; does not measure runtime throughput |
| `node test/time_controls.js` | Source regex assertions | PASS; does not execute main loop |
| `node test/cp_soak.js 30 baseline-speed 0` | Monthly invariant assertions and economic diagnostics | PASS, 1 check, 1.442 s, population 8 |
| `node test/cp_soak.js 180 baseline-speed 0` | Monthly invariant assertions and economic diagnostics | PASS, 6 checks, 33.847 s, population 36, minted/burned 1.81, price 1.58 |
| `node test/soak.js 0.08333333333333333 baseline-speed 0` | Diagnostic, crash exits nonzero; NaN issues logged | Completed, 1.476 s, no reported issues, population 8 |
| `node test/soak.js 1 seed1 0` | Diagnostic with crash exit | **FAIL**, t = 848181, TypeError null.rid in ai.js:313 |
| `node test/combat_balance.js` | Diagnostic metrics without assertions | Completed; equal fighters 50% wins, 2 techniques vs none 98% |
| Syntax check of all 48 JS files | Syntax | PASS |
| `node test/perf.js` | Browser diagnostic | **BLOCKED** before page load, Chromium executable absent |
| `node /workspace/scratch/4620f7523869/baseline_qa_harness.cjs` | Controlled-clock characterization assertions | PASS; observed behavior, not hardware performance |
| `node /workspace/scratch/4620f7523869/baseline_regressions.cjs season` | New correctness assertion | **FAIL**, summer 1 loads as spring 0 |
| `node /workspace/scratch/4620f7523869/baseline_regressions.cjs craft` | New correctness assertion | **FAIL**, queued craft crashes if hall order clears |

Playwright module exists. Chromium is not installed; a browser installation attempt returned an invalid/truncated ZIP and failed. No actual browser, mobile, FPS, canvas, or UI-render performance claim is justified. Other browser scripts share the same prerequisite. No further dependency installation is planned.

## Architecture and reproduced findings

The game uses classic browser globals and a single mutable simulation world W. There is no package.json/framework runner. `index.html` loads modular sources; `JianghuSect_single.html` is a generated monolith. Each simulation tick advances one game minute. At 1×, the target is 4 ticks/s. Controls offer pause, 1, 2, 4, 8, 16, 32, 48×. Main grants simulation 12 ms per animation callback, then defers remaining ticks. 16×/32×+ request 40/30 FPS drawing intervals; actual draw rates can be lower.

1. **Elapsed time is silently dropped.** Baseline clamps callback dt to 0.25 s. A 1-second foreground stall at 32× accounts 32 ticks instead of 128. A 0 ms callback also incorrectly receives an artificial 16 ms credit because of `||0.016`.
2. **Backlog persists and can continue fast after reducing speed.** With 20 ms mocked tick cost and 60 callbacks/s, 32× executes 60 ticks and queues 68 in 1 s. Switching to 1× executes 60 more ticks next second, leaving 12 pending. Pause freezes existing debt. This behavior is deliberate backlog recovery; UI should expose it so selected speed is not mistaken for effective speed.
3. **Pending time and actual speed are lost on load.** Baseline saves W.speed (usually 1), not G.speed or G.acc. bindWorld resets G.acc = 0 / G.speed = 1. Same-version key state, RNG, inventories, NPC count, and indexes otherwise restore in the sampled save.
4. **Crafting crash is reproducible independently of timing.** The 1-year seed1 soak crashed at year 2, month 8, day 20, 00:21 (t = 848181), in craftAct.dur at ai.js:313, called by AI.arrive:796 → AI.step:885 → SIM.tick:115. An NPC captures recipe in ctx.rid before walking. Hall management may replace orders[hall] with null (sect.js:440). Arrival reserves inputs from ctx.rid, then duration dereferences the current nullable order instead. Minimal regression in `baseline_regressions.cjs craft` reproduces immediately for brewing; forging uses the same factory.
5. **Season is not restored.** deserialize creates a spring world, then restores saved time without W.season. A summer save (t = 648360) reloads with season 0 instead of 1 until the next daily update. Rendering and seasonal harvesting read W.season.
6. **Version handling is permissive.** Current save v is 1.0.0 and human-core fingerprint 155:2f9c9dd7. Nonempty mismatched fingerprint rejects. A missing fingerprint or v999.0.0 accepts. This proves current behavior, not compatibility with arbitrary future data.

A 20-day warmup → save/load → 5-day continuation sample retained equal RNG, time 554760, population 11, and stones 625. After excluding drawing coordinates px/py, the first byte/state difference is NPC 9 bed 96 vs 88. The existing limitations document acknowledges bed/reservation drift; byte-identical continuation must not be claimed.

## Target timing fix

New runtime schema is `W.runtimeTiming={pendingTicks:G.acc,speed:G.speed}`. Each field is restored only when finite and nonnegative; missing/invalid fields default to 0 pending and 1×. A saved speed 0 preserves pause. No arbitrary upper speed cap is added.

`main.js` now retains full finite elapsed callback time, maintains the 12 ms processing budget and deferred debt, synchronizes W.speed/runtimeTiming each frame and before autosave, and resets the callback clock to performance.now() when binding a new/loaded world. Paused callbacks update the clock without adding or draining debt. Rendering frequency semantics remain unchanged. A single synchronous tick can exceed12ms;the budget yields only between whole ticks.

`test/runtime_timing.js` executes the real unmodified browser boot/frame closure in a Node VM with a controlled clock, renderer, DOM, and simulation boundary. It first failed against baseline (4.064 != 4 after 1 s), then passed after the fix. It covers all offered positive speeds, a 1 s stalled callback, budgeted overload, pause/UI pause, saved pending ticks and selected speed, legacy/invalid fields, saved pause, and fresh new/load clocks. Target verification all exited 0:

- `node test/runtime_timing.js`
- `node test/time_controls.js`
- `node test/speed_controls.js`
- `node test/core_lock.js`
- `node test/cp_economy.js`
- `node --check js/main.js`
- `node --check test/runtime_timing.js`

The parent owns persistence of runtimeTiming in SIM.serialize/deserialize and any UI backlog feedback. This agent did not modify SIM, UI, or AI production files.
