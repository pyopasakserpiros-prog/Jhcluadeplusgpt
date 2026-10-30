# NPC Test, Simulation & Performance Results (`v1.12.1`)

## 1. Environment & Verification Commands

- **Runtime**: Node.js `v18.20.4`, Python `3.11`, Chromium Headless via built-in CDP harness (`tools/cdp_playwright.js`).
- **Locked Human Core (`js/human_core.js`)**:
  - Fingerprint: `155:2f9c9dd7`
  - SHA-256: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542` (verified unchanged before and after all tests and builds).
- **Exact Commands Executed**:
  ```bash
  node tools/build_single.js
  node test/core_lock.js
  node test/standalone.js
  node test/npc_life_authority_overhaul.js
  node test/run_all.js
  node tools/run_npc_overhaul_360d.js seed npc-overhaul-360d-seed1 /tmp/seed1.json
  node tools/run_npc_overhaul_360d.js seed npc-overhaul-360d-seed2 /tmp/seed2.json
  node tools/run_npc_overhaul_360d.js seed npc-overhaul-360d-seed3 /tmp/seed3.json
  node tools/run_npc_overhaul_360d.js bench100 /tmp/bench100.json
  python3 tools/package_release.py
  ```

---

## 2. Full Regression Suite Results (`node test/run_all.js`)

- **Total Test Groups**: `59 / 59 PASS` (including `syntax` check across all JS files in `data/`, `js/`, `tools/`, `test/`).
- **Machine-Readable Report**: `test/results/assertions.json`
- **Key NPC, Authority, Martial & Browser Suites**:
  - `test/core_lock.js`: **PASS** (`155:2f9c9dd7`, SHA-256 byte lock verified)
  - `test/npc_cognition.js`: **PASS** (read-only purity, authority, emergencies, goal continuity, outcome memory, bounded save-safe state)
  - `test/npc_offices.js`: **PASS** (appointments, suitability, work locations, bounded directives, authority & dismissal invalidation)
  - `test/npc_command.js`: **PASS** (raid rally leadership, formation selection, combat participation)
  - `test/npc_social_help.js`: **PASS** (personal medicine sharing, real inventory transfer, `received_help` memory)
  - `test/welfare_authority.js`: **PASS** (appointed/acting treasury welfare officer, restoration, physical stock, absence)
  - `test/martial_paths.js` & `test/martial_retraining.js`: **PASS** (gear suitability, weapon/armor conditions, retraining & passive slots)
  - `test/phase1_recruitment_facilities.js`, `test/phase2_edit_hub_inventory.js`, `test/phase3_stock_distribution_log.js`: **PASS**
  - `test/patch_v1_12_suites.js`: **PASS**
  - `test/npc_life_authority_overhaul.js` (**NEW**): **PASS** (aspirations, Defect #1 unrelated-action progress guard, Defect #2 top-6 station starvation fallback, Defect #3 protected actions, Defect #4 emergency goal suspension/resumption & prerequisite step decomposition, Defect #5 `received_help` reciprocity, bounded knowledge & `[คาดการณ์]` forecasts, strict CA vs. PA separation, `M.classifyGearForNpc` & passive loadout reconciliation, commitment lifecycle, mentoring transfer, surplus gear gifting, office delegation/handover, treasury skimming + `auditTrail` + `discipline` exposure, unfair welfare complaint petitions, deference/flattery outcomes & cooldowns, and save/load determinism)
  - Browser Suites (`startup_ui`, `input_cancellation`, `skill_visual_browser`, `outside_visual_browser`, `browser_mobile_perf`): **5 / 5 PASS**

---

## 3. Multi-Seed 360-Day Native Simulation Results (`518,400` Ticks / Seed)

Machine-readable output saved in `test/results/npc_overhaul_360d.json`.

| Metric | `npc-overhaul-360d-seed1` | `npc-overhaul-360d-seed2` | `npc-overhaul-360d-seed3` |
|---|---:|---:|---:|
| **Simulated Duration** | 360 days (`518,400` ticks) | 360 days (`518,400` ticks) | 360 days (`518,400` ticks) |
| **Wall-Clock Duration** | `607,108 ms` (parallel) | `549,360 ms` (parallel) | `400,064 ms` (single-core) |
| **Avg `ms/tick`** | `1.1711 ms/tick` | `1.0597 ms/tick` | `0.7717 ms/tick` |
| **Final Alive Population** | `52` | `37` | `56` |
| **Total Deaths (360d)** | `4` | `1` | `0` |
| **Sect Fame / Stones** | `615` fame / `1,350` stones | `485` fame / `3,730` stones | `696` fame / `4,864` stones |
| **Goals Completed** | `5,740` | `5,719` | `6,915` |
| **Goals Suspended (Emergency) & Resumed** | `1,874` | `1,806` | `2,098` |
| **Goals Expired** | `901` | `685` | `973` |
| **Aspiration Milestones Recorded** | `284` | `211` | `245` |
| **Mentor Lessons Completed** | `50` | `129` | `53` |
| **Flattery (`welcomed` / `distrusted` / `ignored`)** | `213` / `76` / `32` | `113` / `97` / `14` | `344` / `101` / `52` |
| **Acting Office Delegations Created** | `31` | `67` | `22` |
| **Techniques Learned (`learn` logs)** | `115` | `67` | `90` |
| **Stage Breakthroughs (`breakthrough` logs)** | `13` | `16` | `4` |
| **CP Minted / Burned / Circulation** | `62,513` / `34,643` / `21,714.8` | `68,180` / `34,813` / `25,651.4` | `74,769` / `42,522` / `17,258.2` |
| **CP Price Index (Day 360)** | `1.02` | `1.36` | `1.07` |
| **Save/Load Roundtrip at Day 360** | **PASS** | **PASS** | **PASS** |

### Aspiration Distribution at Day 360 Across Alive Population
- `npc-overhaul-360d-seed1` (`52` NPCs): `realm_ascendant: 21`, `peaceful_companion: 12`, `sect_pillar: 9`, `master_artificer: 4`, `master_alchemist: 3`, `martial_master: 2`, `respected_mentor: 1`.
- `npc-overhaul-360d-seed2` (`37` NPCs): `realm_ascendant: 15`, `peaceful_companion: 9`, `sect_pillar: 6`, `respected_mentor: 2`, `master_artificer: 2`, `martial_master: 2`, `wealthy_trader: 1`.
- `npc-overhaul-360d-seed3` (`56` NPCs): `realm_ascendant: 21`, `peaceful_companion: 15`, `sect_pillar: 12`, `martial_master: 4`, `wealthy_trader: 2`, `master_alchemist: 1`, `respected_mentor: 1`.

---

## 4. High-Population Performance Benchmarks (80 & 100 Active Cultivators)

1. **80-NPC Headless Chromium Stress Benchmark (`test/browser_mobile_perf.js`)**:
   - **Workload**: 80 active cultivators over 720 synchronous ticks + live `requestAnimationFrame` speed sweep (`0x` to `48x`) across `360x800`, `412x860`, and `1280x800` viewports.
   - **Measured `avgMsPerTick`**: `2.339 ms/tick` (budget `< 3.0 ms/tick`).
   - **Max Sustainable Speed Cap**: `106.9x` (`427 ticks/sec`).
2. **100-NPC Max-Capacity Native Workload (`tools/run_npc_overhaul_360d.js bench100`)**:
   - **Workload**: 100 active cultivators (all dormitories upgraded to max capacity `100/100`) over 720 ticks (`12` game hours) after 120-tick warmup.
   - **Wall-Clock Duration**: `3,038.44 ms`
   - **Measured `avgMsPerTick`**: `4.220 ms/tick` (`237 ticks/sec`).

---

## 5. Save Migration & Compatibility Notes

- **Legacy Saves (`v1.10.x` – `v1.12.0`)**:
  - `COG.ensure(n)` lazily initializes `n.cognition` when absent or migrates older structures while preserving valid fields.
  - `COG.ensureAspiration(W, n)` lazily assigns a personality-aligned aspiration on first cognitive preparation without mutating saves during `SIM.deserialize(str)`.
  - `SIM.deserialize(str)` sanitizes dangling NPC references in `W.sect.delegations` and `W.sect.petitions` if referenced NPCs were retired or died, while keeping `n.cognition` byte-identical on roundtrip (`SIM.deserialize(SIM.serialize(W))`).

---

## 6. Actual Observations & Known Limitations

1. **Autonomous Medicine Sharing (`shareMedicine`) & Surplus Gear Gifting (`giftItem`) Frequency in Unassisted 360-Day Runs**:
   - In the 3 unmanipulated 360-day runs, `medicineShared` and `gearGifted` were `0`, whereas `mentorLessons` (`50–129`), `flattery` (`224–497`), and `delegationsCreated` (`22–67`) occurred frequently.
   - **Why**:
     - For `shareMedicine`, `CPE.autoUse(W, n)` runs hourly and automatically consumes an injured NPC's own recovery pills, and injured NPCs immediately prioritize `heal` or `personalPillUse`, so the window where an injured friend (`hp < 55%`) lacks a recovery pill while standing within 12 tiles of an empathetic friend holding surplus `P:BASIC_HP` is rare in steady-state autonomous play.
     - For `giftItem`, NPCs normally donate spare materials/scrolls or equip purchased sect shop gear directly into `n.equip[slot]` (returning old gear to `W.sect.gear`), so unequipped spare gear in `n.inv.gear` primarily arises when gear is unequipped to bag via the Edit Hub or obtained as personal loot.
   - Both mechanics are verified deterministically in `test/npc_social_help.js` and `test/npc_life_authority_overhaul.js`.
2. **Heuristic Forecasting Bounds**:
   - By design, `COG.forecast` uses closed-form deterministic heuristics (`affordability`, `huntRisk`, `invitation`, `reserves`) rather than cloning and simulating `W` forward, keeping per-tick CPU cost near zero.
