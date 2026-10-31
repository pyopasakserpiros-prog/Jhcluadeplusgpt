> **Current package update (31 Oct 2026):** The active review package is now `JianghuSect_v2.0.2`, `SIM.PATCH_VERSION 1.12.7`, `ELEM.VERSION 2.0.1`. The follow-up implementation and verification are documented in [PATCH_1_12_7_IMPLEMENTATION_REPORT_TH.md](PATCH_1_12_7_IMPLEMENTATION_REPORT_TH.md), with updated rarity evidence in [BALANCE_AND_RARITY_REPORT.md](BALANCE_AND_RARITY_REPORT.md). The historical 1.12.5 report below is retained as provenance and must not be treated as the latest test result.

---

# Implementation & Codex Review Report — JianghuSect Elemental Overhaul v2.0

## 1. Source identity
- Baseline: `main-1 / v1.12.4 Small Logic Hotfix`.
- Runtime engine: `SIM.VERSION = 1.10.11`.
- Review hotfix: `SIM.PATCH_VERSION = 1.12.5`.
- Save schema: `2.0.0-elemental`.
- Protected core: `js/human_core.js` remains byte-identical; SHA-256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`; `HC.FINGERPRINT === "155:2f9c9dd7"`.
- Standalone: rebuilt from the reviewed source; root-package and source-tree `JianghuSect_single.html` are byte-identical, 40 inline scripts, no external runtime script dependencies.

## 2. Codex fixes applied in review hotfix 1.12.5
1. Corrected the four-root birth probability from `0.05%` (about 1 in 2,000 generated characters / 50 world years at 40 births per year) to `0.00025%` (1 in 400,000 / 10,000 world years).
2. Recalibrated and corrected the confirmed genius classifications:
   - Dual Heavenly + True/Spirit: about 5 years.
   - Dual Heavenly + Heavenly: about 100 years.
   - Triple Heavenly + two True/Spirit: about 100 years.
   - Triple two Heavenly + one True/Spirit: about 500 years (inside the confirmed 100–1,000-year interval).
   - Triple three Heavenly: about 1,000 years.
   - Four roots of any non-all-Heavenly grade composition: about 10,000 years.
   - Four Heavenly roots: about 2,000,000 years under the current conditional grade roll; no unique-person cap is imposed.
3. Corrected the classification of Heavenly + Spirit dual roots and triple mixed-grade combinations so they no longer fall into unrelated rarity bands.
4. Normalized duplicate root-capacity Traits in `ELEM.ensureNpc`; a character now retains exactly one matching capacity Trait, or none for the one-root default.
5. Fixed `ELEM.explainCompatibility()` so its summary displays the multiplier for the requested context (cultivation/study/equipment/combat), not always the combat multiplier.
6. Fixed tactical counter calculation for multi-element attacks: the defender matchup now uses the attack profile's declared weights instead of only its primary element.
7. Corrected the Thai display label for `SPIRIT` grade from the duplicated wording `รากวิญญาณวิญญาณ` to `รากวิญญาณชั้นจิต`.
8. Rebuilt and synchronized the top-level standalone HTML. Before the fix, the package-root standalone differed from the source-tree standalone in `cultivation.js`, `knowledge.js`, and `retraining.js` embedded blocks; both copies now match exactly.

## 3. Important correction to the original Gemini report
- The uploaded build's `test/elemental_overhaul_suite.js` **does exist**. A prior interim Codex message incorrectly said that file was missing; that statement is withdrawn.
- The suite printed **57/57** assertions in the unmodified uploaded package. The original implementation report's claim of **1,691 assertions** was not supported by the test output.
- After Codex added rarity calibration, duplicate-Trait, context-summary, and weighted-counter regression checks, the suite now prints **72/72 focused assertions PASS**.

## 4. Verification after the hotfix
- `node test/core_lock.js`: PASS; protected fingerprint unchanged.
- `node test/elemental_overhaul_suite.js`: PASS, 72/72.
- `node test/standalone.js`: PASS; 40 inline scripts, new-schema initialization and save/load.
- `node test/browser_mobile_perf.js`: PASS; 360/412/1280 px viewports, gestures, 24 panel tabs, 0x–48x speeds, 80-NPC stress test at 0.718 ms/tick and 348x measured sustainable cap.
- `node test/phase2_edit_hub_inventory.js`: PASS.
- `node test/save_integrity.js`: PASS.
- `node test/legacy_save.js`: PASS for the included v2 synthetic/new-schema continuity cases; old-version save compatibility is not a release requirement.
- `node test/visitors_clues_weapons_suite.js`: PASS, 41/41.
- `node test/codex_combined_review.js`: PASS.
- `node test/inventory_grid_ui_suite.js`: PASS; 72-cell atlas and Chromium responsive checks.
- `node test/fishing_river_suite.js`: PASS; 100,000-trial loot probability verification and browser UI.
- Syntax check: 134 JavaScript files PASS.
- The 65-suite `test/run_all.js` runner printed PASS for its first 60 suites before the outer execution time limit stopped the combined process. The remaining five suites were run individually and all passed. Therefore every suite has PASS evidence, but no single uninterrupted 65/65 runner summary was produced in this review.

## 5. Rarity calibration evidence
- Assumption: 40 generated NPC births per simulated world year.
- Four-million-birth deterministic sample: 2,717,509 one-root; 1,002,235 dual-root; 280,246 triple-root; 10 four-root.
- Four-root sample count: 10 / 4,000,000, exactly matching the configured 1 / 400,000 rate in this sample.
- Conditional grade rolls (50,000 forced samples per root count) are covered by the regression suite and the detailed balance report.

## 6. Content and Edit Hub spot checks
- Runtime-derived spot audit: 1,229 records across techniques, mantras, materials, items, recipes, martial records and legendary weapons; 0 invalid elemental profiles in this inspected set.
- Edit Hub catalog: 1,115 entries.
- Legendary search: 33 entries (11 legendary weapons + 22 legendary techniques/mantras).
- All 23 existing affinity values remain in the single `h.affinities` object; UI groups them without duplicating the data structure.

## 7. Remaining limitations
- Browser checks are headless Chromium emulation, not a physical Android-device test.
- World-year rarity figures are expectations based on the current 40-generated-NPCs-per-world-year assumption; actual rates depend on how many NPCs are generated by all world and recruitment flows.
- Multi-root defensive counter aggregation and weighted weapon-to-technique resonance are recorded for a separate balance patch; see `docs/NEXT_PATCH_GAMEPLAY_FINDINGS.md`.
