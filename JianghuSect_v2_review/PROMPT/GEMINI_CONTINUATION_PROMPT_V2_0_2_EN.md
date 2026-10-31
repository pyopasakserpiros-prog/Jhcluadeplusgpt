# GEMINI CONTINUATION ASSIGNMENT — JIANGHUSECT v2.0.2

**Authoritative package:** `JianghuSect_v2.0.2`  
**Current runtime:** `SIM.VERSION 1.10.11` · `SIM.PATCH_VERSION 1.12.7`  
**Elemental authority:** `ELEM.VERSION 2.0.1`  
**Date:** 31 October 2026

## 1. Continue from the attached package — do not restart

The attached ZIP is the current working source for this assignment. Work from `GAME_SOURCE/JianghuSect_v1.10/`.

The GitHub repository `pyopasakserpiros-prog/Jhcluadeplusgpt` was checked on 31 October 2026. Its remote `main-1` head was `e5e4f8ff5d111625dacf6c630434cbe2eba7428e`; the fetched `JianghuSect_v1.10/js/sim.js` reported patch `1.12.0`. The attached package is newer (`1.12.7`). Do not replace it with the older remote branch or assume the attached package has already been pushed. The extracted package has no `.git` metadata.

Before editing, verify `PACKAGE_MANIFEST.json` and its SHA-256 hashes. Then read:
1. `README_TH.md`
2. `HANDOFF.md`
3. `REPORTS/PATCH_1_12_7_IMPLEMENTATION_REPORT_TH.md`
4. `REPORTS/BALANCE_AND_RARITY_REPORT.md`
5. `REPORTS/NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md`
6. `PROMPT/GEMINI_IMPLEMENTATION_PROMPT_EN.md` in full
7. Relevant documents under `DESIGN/` and `AUDIT/`
8. The actual source modules and tests named by those documents

Run the current tests first and independently verify the claimed baseline. Do not assume any report is correct merely because it exists.

## 2. Work already completed — preserve it

The current package already contains:
- Eight ordinary root elements, special elements, per-root grades, root-capacity traits and a central `ELEM` authority.
- Root-count probabilities calibrated to 390 generated-character appearances per 360-day world-year; 14-run pooled measurement mean is 386.43/year.
- Conditional grade cohorts and rarity metadata derived from the same probability model.
- Correct final-slot mapping for `forceElements` + `forceGrades`.
- Root-capacity traits that only control root count, without dormant aptitude/meridian stat modifiers.
- Elemental combat integration for human and foe attacks: weighted weapon-to-technique resonance, accuracy, damage, channel ticks, control/rider probability and DOT magnitude.
- Beast raid species profiles inherited by generated techniques; raid enemies initialized through `COMBAT.enter()`.
- Regression suites `elemental_balance_v202.js` and `elemental_balance_v203.js`.
- Existing UI/Edit Hub, economy, NPC cognition, fishing, ecology, inventory, visitor/clue, graphics and standalone systems.

Current verification recorded:
- Parallel regression: **70/70 groups PASS**, 0 fail, 0 timeout.
- JavaScript syntax: **140/140 PASS**.
- Native long simulation: **180 days PASS**.
- Living beast/craft ecology simulation: **90 days PASS**.
- Standalone build: 40 inline scripts, no external runtime dependency; standalone save/load test PASS.
- `js/human_core.js` SHA-256 remains `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`; fingerprint `155:2f9c9dd7`.

Re-run tests on your workspace; these are starting evidence, not permission to skip QA.

## 3. Main assignment — coherent content and mechanics redesign

The user explicitly authorizes thoughtful redesign of **display names, mechanics, properties, requirements, moves and effects** for items, weapons, armor, accessories, artifacts, techniques, mantras, passives and recipes.

Audit every relevant stable ID. Do not redesign only a few examples. For each record, ensure the following describe one coherent concept:

- Display name and description.
- Actual weapon/equipment type (`SWORD`, `BLADE`, `SPEAR`, `BOW`, `STAFF`, `FOCUS`, armor slot, etc.).
- Element profile and whether the element is intrinsic, weighted, link-only, special or explicitly non-elemental.
- Required weapon/armor type and hard eligibility requirements.
- Technique archetype, moves, target rules, damage/control/heal/support behavior.
- Qi/stamina/resource cost, cooldown, wind-up, duration, tier and progression.
- Passive family, unique effect ID, proc conditions, UID/provenance and actual runtime handler.
- Path/subpath/body/trait synergy.
- NPC preference and explainable decision contribution.
- UI description, Edit Hub metadata and searchability.

You may rename display names when the new name better reflects the item's actual design. Preserve stable IDs by default. If an ID must change, update every reference, save/new-schema representation, registry, manifest, tests and editor path. Do not use global keyword replacement as a substitute for design.

Example only: a fire-themed sword technique with a real sword requirement, fire damage and a coherent move set may receive a distinctive fire-sword name. Do not mechanically apply this example to every record. Some items should remain neutral or have no weapon-type synergy.

For every meaningful rename/redesign, create a before/after mapping with the reason, affected systems, balance impact and tests. Preserve the identity and unique effect of every legendary weapon and technique; never flatten them into generic elemental stat sticks.

## 4. Close the known elemental/system design gaps

Use `REPORTS/NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md` as the tracked backlog. At minimum:

1. **Neutral relation:** distinguish `MATCH`, `SUPPORT`, `OPPOSE`, and `NEUTRAL` explicitly. Unrelated non-opposing elements must use the intended neutral baseline. Do not invent the relation matrix from arbitrary thresholds; justify each pair from the game's element lore and test the complete matrix.
2. **Aggregate scalar grade:** audit all `h.root.grade` consumers. Keep per-element root grades authoritative; do not grant broad power from the best root or from root count. Preserve the protected core unless an actual blocker is demonstrated.
3. **Link-only context:** define allowed contexts for `ELEMENT_LINK_ONLY`; a material/recipe/pill link must not become intrinsic combat damage by accident.
4. **Effect-specific compatibility:** do not use `totalDamageMult` indiscriminately for healing, shield, support and utility. Design distinct bounded modifiers where appropriate; target-counter weakness should not accidentally reduce an ally heal.
5. **Foe policy:** classify beasts, bandits, guardians, summons, clones and bosses. Decide which have an intrinsic profile, a full root model or explicit non-elemental behavior.
6. **NPC behavior:** test actual path/subpath selection, technique learning, equipment choice, training and combat decisions. Hard requirements/access/knowledge remain eligibility gates; elemental fit is a soft preference. Personality, interests, role, cost, scarcity, risk and goals must be able to change choices.
7. **Performance:** profile actual hotspots before optimizing; preserve deterministic RNG and verify the native simulation after changes.

You may sequence these tasks sensibly, but do not silently mark a deferred issue as solved.

## 5. Save and compatibility policy

Backward compatibility with older game versions and old save files is **NOT required**. Do not spend effort preserving old saves or writing old-save migration layers if they constrain a better architecture. You may redesign the schema cleanly.

Still required:
- New-game creation.
- New-schema save/load round trip.
- Deterministic root generation and no reroll on load.
- Correct NPC cloning, visitor/member conversion and serialization.
- Data validation and cache invalidation.
- Standalone offline play.

Keep `js/human_core.js` byte-identical unless you can prove a hard blocker. If a blocker exists, stop and report the exact call site and alternatives before editing it.

## 6. Test and deliver

Required final deliverables:
- Complete updated source tree and rebuilt standalone HTML.
- Full per-ID content audit manifest and before/after redesign map.
- Formula sheet with worked examples for matching, neutral, opposition, weighted multi-element, non-elemental and special content.
- NPC decision integration report with real before/after behavioral examples.
- Updated rarity report if generation throughput or probabilities change.
- New-schema save/load evidence.
- Full test output: suite totals, assertions, failures, timeouts, syntax count, simulation seeds/durations.
- Updated README, HANDOFF, CHANGELOG and roadmap.
- Known limitations and unverified claims stated plainly.

Do not push or merge to `main` or `main-1`. Return the complete package for independent Codex review. Do not claim success before rebuilding and testing the final source and standalone files.
