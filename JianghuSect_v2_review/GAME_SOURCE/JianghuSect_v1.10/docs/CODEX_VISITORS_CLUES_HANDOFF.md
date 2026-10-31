# Codex Review Handoff — Visitors, Living Clues, Inheritance Stories & Legendary Weapons

## 1. Combined Baseline & Invariant Verification

- **Baseline Used**: Continuation from the in-conversation source tree containing both the **NPC Life, Cognition, Relationships, Goals & Authority Overhaul** and the **Graphics & Mobile UI Overhaul** (`v1.10.12` / `PATCH_VERSION: 1.12.1`).
- **`js/human_core.js` Byte Lock**:
  - SHA-256: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542` (verified identical in `test/core_lock.js`, `test/visitors_clues_weapons_suite.js`, and `tools/package_release.py`).
  - Fingerprint: `155:2f9c9dd7`.
- **Render & Inspection Purity**:
  - `R.draw`, `R.portrait`, `R.pickAt`, `UI.rVisitors`, `UI.rClues`, and `UI.rVisitor` never advance `W.rng.s` and never mutate serialized world state (`SIM.serialize(W)`).
- **Outsider Membership Isolation**:
  - Non-member visitors (`v.kind === 'guest'`) and external merchants (`v.kind === 'trader'`) live in `W.world.visitors` / `W.world.guestRegistry`, never enter `W.npcs` or `W.byId`, and never count toward the 100-bed dormitory capacity (`SECT.memberOccupancy(W)`).

## 2. Summary of Architectural Decisions & Substantive Improvements

1. **Preserving `EXT.activeVisitors(W)` Contract While Adding Physical Guests**:
   - Existing tests (`test/external_market.js`) assert that `EXT.activeVisitors(W)` returns active traders (`v.kind === 'trader'`). We kept `EXT.activeVisitors(W)` strictly filtered to traders while storing physical non-merchant outsiders in `W.world.visitors` with `v.kind === 'guest'` and querying them via `VC.activeGuests(W)`. Both traders and guests receive physical map coordinates (`x`, `y`, `destX`, `destY`) and human appearance profiles (`v.h`) so they walk and render on the sect map.
2. **Non-Enumerable Quality Aliasing (`it.q` / `it.quality`) & O(1) Gear Stat Fast-Path**:
   - The baseline codebase mixed `it.q` (in `economy.js` and `stats.js`) and `it.quality` (in `sect.js` and `ui.js`). `VC.normalizeGearItem(it)` normalizes `it.q` and defines a non-enumerable `quality` getter/setter aliasing `it.q`, plus a non-enumerable `_vcNorm` flag so `STATS.gearStats(it)` fast-returns `it.st` in O(1) without recomputing on every tick. This kept 80-NPC mobile browser performance at **2.431 ms/tick** (`102.8×` real-time speed capability).
3. **Provenance-Tracked Rumors (`rootRumorId`)**:
   - Every rumor instance carries a `rootRumorId`. When disciples share a rumor inside the sect (`VC.learnClueFragment`), repeating hearsay from the same `rootRumorId` never inflates `corroboratingRoots` or `confidence`. Only an independent second rumor with a new `rootRumorId` increases corroboration.
4. **Strict Separation of `personal` vs. `party_any` vs. `party_all` Trial Scopes**:
   - In `VC.evaluateClueNode`, `scope: 'personal'` evaluates only `party[0]` (the primary claimant), preventing high-stage escorts from passing personal inheritance/spirit trials on behalf of a weaker disciple. `scope: 'party_any'` allows a specialist companion (such as an `ARRAY`, `SCRIPTURE`, or `FORGING` specialist) to unlock site mechanisms for the team.

## 3. Literary Research & Provenance Classification (`docs/LEGENDARY_WEAPON_RESEARCH.md`)

All 11 legendary weapons are classified transparently in `docs/LEGENDARY_WEAPON_RESEARCH.md`:
- **8 `ADAPTATION_FROM_CANON` weapons** grounded in Jin Yong and Gu Long works:
  1. `LEG_WPN_YITIAN_SWORD` (倚天剑 — Jin Yong, *The Heaven Sword and Dragon Saber*)
  2. `LEG_WPN_XUANTIE_HEAVY_SWORD` (玄铁重剑 — Jin Yong, *The Return of the Condor Heroes*)
  3. `LEG_WPN_TULONG_SABER` (屠龙刀 — Jin Yong, *The Heaven Sword and Dragon Saber*)
  4. `LEG_WPN_FULL_MOON_SCIMITAR` (圆月弯刀 — Gu Long, *Full Moon Scimitar*)
  5. `LEG_WPN_XIAOLI_HEART_DAGGER` (小李飞刀 — Gu Long, *Sentimental Swordsman, Ruthless Sword*)
  6. `LEG_WPN_DAGOU_JADE_STAFF` (打狗棒 — Jin Yong, *The Legend of the Condor Heroes*)
  7. `LEG_WPN_OVERLORD_SPEAR` (霸王枪 — Gu Long, *The Overlord Spear, Seven Weapons #5*)
  8. `LEG_WPN_PEACOCK_PLUME_FOCUS` (孔雀翎 — Gu Long, *The Peacock Plume, Seven Weapons #2*)
- **3 `INSPIRED_BY_CANON` / `ORIGINAL_FOR_GAME_FIT` weapons** to ensure all 7 weapon families (`SWORD`, `BLADE`, `SPEAR`, `STAFF`, `FIST`, `BOW`, `FOCUS`) have legendary representation:
  9. `LEG_WPN_OATHBREAKER_DRAGON_LANCE` (青龙破誓戟 — `ORIGINAL_FOR_GAME_FIT` for the `SPEAR` / `DRAGON_LANCE_GUARDIAN` sub-path)
  10. `LEG_WPN_WRATHFUL_TIGER_GAUNTLETS` (怒虎金刚拳套 — `INSPIRED_BY_CANON`, inspired by Gu Long's *Fist / 拳头 (愤怒的小马)* and *Bawang Qiang* Ch. 3 "King of Fists")
  11. `LEG_WPN_CONDOR_METEOR_BOW` (射雕落星弓 — `INSPIRED_BY_CANON`, inspired by Guo Jing's steppe war-bow in Jin Yong's *The Legend of the Condor Heroes*)

## 4. Exact Verification Commands & Actual Results

1. `node test/visitors_clues_weapons_suite.js`
   - **Result**: `PASS visitors_clues_weapons_suite: 41/41 clue chains, 11/11 legendary weapons, outsider isolation, provenance & idempotency verified`
2. `node tools/run_visitors_clues_sim.js`
   - **Result**: Completed 3×180-day natural simulations (`vc-180d-seed1`, `vc-180d-seed2`, `vc-180d-seed3`) with `0` invariant violations, and generated `docs/CLUE_SOURCE_CATALOG.json` and `test/results/visitors_clues_180d.json`.
3. `node tools/build_single.js && node test/standalone.js`
   - **Result**: `PASS standalone:39 actual inline scripts, no external runtime files, initialized globals,external market,wild resources,24-hour native simulation and save/load`
4. `node test/browser_mobile_perf.js`
   - **Result**: `PASS browser_mobile_perf: 360px/412px/1280px viewports, gestures, 24 panel tabs, save/load, 0x-48x speeds, 80-NPC stress (2.431 ms/tick, 102.8x cap)`
5. `node test/run_all.js`
   - **Result**: `Assertions: 61/61 groups passed.`

## 5. Reproduction Steps for Reviewers

1. Extract `Jhcluadeplusgpt-main-1_complete_npc_graphics_visitors_update.zip`.
2. To play immediately offline in any browser: open `JianghuSect_single.html` (or `JianghuSect_v1.10/JianghuSect_single.html`).
3. To inspect visitors and clues in the UI:
   - Open **🧭 ยุทธภพนอกสำนัก** (`World`) -> switch to **🎐 ผู้มาเยือน** (`Visitors`) or **🗺️ เบาะแส/มรดก** (`Clues & Inheritance`).
   - Tap any physical visitor (`🎐` / `🪙`) walking on the sect map or click any `🎐` / `🗺️` link in the event log to open their detail view.
   - In **🗺️ เบาะแส/มรดก**, click **👁️ เปิดโหมดผู้สังเกตการณ์ (Debug)** to compare player-known testimony against underlying world truth (`truthState`, `rootRumorId`, `targetId`).
4. To run the full automated verification suite from `JianghuSect_v1.10/`:
   ```bash
   node test/run_all.js
   ```

## 6. Artifact & Deliverable Checksums (SHA-256)

| File | SHA-256 |
| --- | --- |
| `JianghuSect_v1.10/js/human_core.js` (Byte Lock) | `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542` |
| `JianghuSect_v1.10/js/visitors_clues.js` | `b0b0405bbf1aa0bb383f0375542eade57f9e611457cde4ea6d0b872ed400ea7b` |
| `JianghuSect_v1.10/JianghuSect_single.html` | `6305daab14cf69e0fde6fd1138a9f94a2350d5c2fe2b3d967e82550b704d6d65` |
| `JianghuSect_v1.10/docs/CLUE_SOURCE_CATALOG.json` | `3f9f8ce56ba31d914a41afa8a7d08c66b2aa879f2355de1ff45a9387f486da15` |
| `JianghuSect_v1.10/docs/LEGENDARY_WEAPON_RESEARCH.md` | `593c94b31c0f26df09f0d5e54c4f377448d61507592ff0d024ec8a8fdfa78550` |
| `JianghuSect_v1.10/docs/VISITORS_CLUES_IMPLEMENTATION_REPORT.md` | `dec9c6cfb947d4f48954b8a5de9752ae594f1c921f063e13e2c2d30acb9718ec` |
| `JianghuSect_v1.10/docs/VISITORS_CLUES_CODE_MAP.md` | `4f10a33e4d53cb1b625fdd01a550ed4a895e630d8f5827bfe52724d93715966e` |
| `JianghuSect_v1.10/docs/visitors_clues_weapons.patch` | `9cb2e7b576dad60cbf6afa6395f54ae9f41b9b9d15c5eb71bbe27486786cbc84` |
