> Original Gemini report from the uploaded ZIP. Its claims and numbers are historical; see CODEX_COMBINED_PATCH_REVIEW_TH.md and CODEX_COMBINED_VERIFICATION.json for independent review and post-fix results.

# Visitors, Living Clues, Inheritance Stories & Legendary Weapons Implementation Report

## 1. Executive Summary & Actual Scope

This report documents the implementation and verification of the **Visitors, Living Clues, Inheritance Stories & Legendary Weapons Overhaul** (`v1.10.12` / `PATCH_VERSION: 1.12.1`), layered directly on top of the completed **NPC Life/Cognition/Authority Overhaul** and **Graphics & Mobile UI Overhaul**.

All core requirements from `NEXT_VISITORS_CLUES_LEGENDARY_WEAPONS_PROMPT.txt` have been implemented and verified:
- **Byte-for-Byte Core Lock**: `JianghuSect_v1.10/js/human_core.js` remains untouched (`SHA-256: a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`, fingerprint `155:2f9c9dd7`).
- **Persistent Outsider / Visitor Ecology (`js/visitors_clues.js`)**:
  - Non-member outsiders (`kind: 'guest'`) and external market traders (`kind: 'trader'`) live in `W.world.visitors` and persist across visits in `W.world.guestRegistry` (bounded at 48 offsite records) and `W.world.visitorHistory`.
  - Guests are strictly isolated from `W.npcs`, `W.byId`, housing capacity (`SECT.memberOccupancy`), payroll, welfare, and sect offices.
  - Gate admission (`VC.evaluateGateAdmission`) uses the existing NPC authority chain (`guard` -> `discipline` -> `mission` -> `master` -> active fallback) and sect `openness`/`strictness` policy to assign `admitted`, `restricted`, or `rejected` status, with building-level access enforcement (`VC.canVisitorAccessBuilding`).
  - Reconciled legacy daily text-only merchant and wandering-master random events in `js/expedition.js` (`EXPED.daily`) so they route through physical visitors (`EXT.openVisit` / `VC.spawnGuest`) rather than granting unbacked text-only wealth or knowledge.
- **41 Authored Clue & Inheritance Templates (`VC.CLUE_TEMPLATES`)**:
  - **8 Ordinary / Heritage Leads**: 5 material leads (`CLUE_ORD_JADE_LOTUS_2`, `CLUE_ORD_SNOW_LOTUS_5`, `CLUE_ORD_METEOR_IRON_5`, `CLUE_ORD_DRAGON_PEARL_7`, `CLUE_ORD_WORLD_FORGE_SHARD_7`), 1 equipment lead (`CLUE_ORD_METEOR_SWORD_5`), and 2 technique leads (`CLUE_ORD_XIAN_SWORD_T1`, `CLUE_ORD_YINYANG_SWORD_T2`) spanning 1 to 3 steps.
  - **22 Legendary Martial Art Leads**: Every non-innate legendary mantra, combat skill, and passive in `data/data_martial.js` has a dedicated multi-step inheritance story (100% coverage of all 22 non-innate legendary arts; the 10 innate-only body/soul arts remain strictly excluded from clue/visitor acquisition).
  - **11 Legendary Weapon Leads**: Each of the 11 new legendary weapons has an authored 2-to-3 step inheritance and trial story.
- **11 Legendary Weapons across All 7 Weapon Families (`VC.LEGENDARY_WEAPONS`)**:
  - Covers `SWORD` (2), `BLADE` (3: heavy saber, curved scimitar, throwing dagger), `STAFF` (1), `SPEAR` (2: war spear, halberd-lance), `FIST` (1), `BOW` (1), and `FOCUS` (1).
  - Canonical quality accessor `VC.gearQuality(it)` and `VC.normalizeGearItem(it)` unify `it.q` and `it.quality` via a non-enumerable property descriptor, preventing double-scaling in `STATS.gearStats(it)` and displaying accurate quality in UI stock/bag views.
  - Every legendary weapon has a real combat proc (`EFX_LEG_*`) hooked into `COMBAT.strike` with per-weapon internal cooldowns (`icdTicks: 7..10`) and anti-recursion guards (`f._inWpnProc` / `f._inWpnDefProc`).
- **World Map & UI Integration (`js/render.js`, `js/ui.js`, `js/main.js`)**:
  - Physical visitors render on the sect map (`R.drawVisitor`) with distinct Jianghu travel attire, bamboo hats (`斗笠`), and role badges (`🎐` / `🪙`), and can be tapped (`R.pickAt` -> `{ kind: 'visitor', id }`) to open their detail sheet.
  - All 11 legendary weapons render distinct silhouettes (`R.drawLegendaryWeaponVisual`) when equipped and usable, with restrained orbiting motifs on `held_and_orbit` weapons (`LEG_WPN_YITIAN_SWORD`, `LEG_WPN_XIAOLI_HEART_DAGGER`, `LEG_WPN_PEACOCK_PLUME_FOCUS`).
  - Added `🎐 ผู้มาเยือน` and `🗺️ เบาะแส/มรดก` tabs to `UI.open('world')`, plus `UI.openVisitor(id)`, `UI.openClue(id)`, clickable log entity links (`data-visitor`, `data-clue`), and an optional Observer Debug toggle (`UI.showClueDebug`) separating player-known testimony from underlying world truth.

## 2. Rumor Provenance, Trial Scopes & Replay-Safe Reward Accounting

1. **Rumor Provenance (`rootRumorId`)**:
   - Each spawned rumor assigns a canonical `rootRumorId` (`rumor_<seq>`).
   - When member A shares a clue with member B, `VC.learnClueFragment` passes the existing `rootRumorId`. Hearing the same `rootRumorId` again via internal sect gossip never inflates `inst.corroboratingRoots` or `knownBy[npc.id].confidence`. Only an independent second source with a distinct `rootRumorId` increases corroboration count and confidence.
2. **False Rumors & Disproof**:
   - Deceptive or mistaken rumors (`truthState: 'false_rumor'`, `truthful: false`) look like normal leads in NPC testimony (`knownBy`), so NPCs never use hidden ground truth before investigating. When an investigation reaches the site node, the rumor is cleanly disproven (`status: 'disproven'`), incrementing `cs.funnel.falseRumorsDisproven` without granting rewards.
3. **Personal vs. Party Specialist vs. Guardian Combat Scopes**:
   - `scope: 'personal'`: Only the primary claimant (`party[0]`) is tested (`evalActorNodeMetric(leader, node)`). A high-stage escort cannot pass a personal inheritance/spirit trial on behalf of an unqualified claimant.
   - `scope: 'party_any'`: The best specialist in the expedition party (`ARRAY`, `SCRIPTURE`, `FORGING`, `MEDICINE`, `survival`) can solve the node for the team.
   - `scope: 'party_all'`: Tests the collective mean capability of the party.
   - `type: 'guardian_combat'`: Resolves combat against the site guardian (`guardianPower`), applying proportional HP loss and potential injury on retreat (`onFail: 'RETRY_LATER'`).
4. **Replay-Safe Named Story Grants (`VC.grantNamedStoryReward`)**:
   - Uses deterministic receipt IDs (`claim_<instanceId>_<targetId>`) stored in `W.world.claimReceipts` and unique artifact ownership entries in `W.world.uniqueArtifacts`.
   - Never falls back to `EXPLORE.grantSiteDiscovery` or random lottery tables; every clue grants its exact `targetId`.
   - Calling `VC.grantNamedStoryReward` multiple times, across expedition handover, or after save/load round-trips returns `{ ok: false, replay: true, reason: 'already-settled' }` and never duplicates items or CP.

## 3. Natural 180-Day Simulation Funnel Metrics (3 Seeds)

Generated via `node tools/run_visitors_clues_sim.js` (`test/results/visitors_clues_180d.json`):

| Metric | `vc-180d-seed1` | `vc-180d-seed2` | `vc-180d-seed3` |
| --- | ---: | ---: | ---: |
| Days Simulated | 180 | 180 | 180 |
| Final Sect Population / Housing Cap | 27 / 46 | 25 / 46 | 45 / 54 |
| Peak Active Guests on Map | 5 | 4 | 5 |
| Total Registered Non-Member Guests | 51 | 57 | 63 |
| External Trader Visits | 25 | 32 | 31 |
| Gate Decisions (Admitted / Rejected) | 51 / 5 | 44 / 9 | 63 / 5 |
| Rumors Spawned (`rumorsSpawned`) | 23 | 16 | 20 |
| Internal Sect Clue Shares (`cluesShared`) | 60 | 52 | 64 |
| Clue Investigations Started | 15 | 27 | 20 |
| Clue Nodes Passed / Failed | 11 / 213 | 9 / 71 | 21 / 92 |
| Terminal Story Rewards Claimed | 4 | 3 | 9 |
| Duplicate Grants Blocked | 0 | 0 | 0 |
| Guest-in-`W.npcs` or Cap Violations | 0 | 0 | 0 |

## 4. Verification Results & Residual Limitations

- **Full Automated Suite (`node test/run_all.js`)**: **61 / 61 groups PASS** (including `visitors_clues_weapons_suite`, `graphics_overhaul_suite`, `npc_life_authority_overhaul`, `external_market`, `browser_mobile_perf`, and `standalone`).
- **80-NPC Mobile Browser Performance (`node test/browser_mobile_perf.js`)**: **PASS** at **2.431 ms/tick** (`102.8×` real-time speed capability, well under the `< 3.0 ms/tick` 48× budget).
- **Standalone Bundle (`node test/standalone.js`)**: **PASS** (`JianghuSect_single.html`, 39 inline scripts, zero external runtime dependencies).
- **Known Limitations**:
  - In natural 180-day runs starting from a founding sect (Day 360, Master at Stage 2–3), disciples naturally complete ordinary/mid-tier clue chains first while deferring or failing high-tier (`T6–T7`) personal inheritance trials until their cultivation stage, skills, and core attributes mature; controlled reachability testing in `test/visitors_clues_weapons_suite.js` verifies that all 41/41 clue chains and all 11/11 legendary weapons complete cleanly once a candidate meets the trial gates.
  - No Git commit or push to GitHub was performed, as work was executed inside the offline sandbox VM and packaged directly as downloadable deliverables.
