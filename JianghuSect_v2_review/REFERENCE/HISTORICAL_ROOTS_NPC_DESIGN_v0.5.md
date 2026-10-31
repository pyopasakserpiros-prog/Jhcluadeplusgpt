# JianghuSect — Elemental Roots & NPC Integration Design Reference v0.5

> **Status: DESIGN REFERENCE ONLY.** This is not an implementation prompt. Do not modify code based on this document alone. First inspect the latest branch, commit, source code, registries, runtime behavior, save/load and all relevant call sites.
>
> This document records user-confirmed design intent plus proposals. It is not rigid where decisions remain open. If a better architecture exists, propose or choose it, explain why, document trade-offs and preserve user-confirmed decisions unless approval is obtained.

## 1. Goals

Upgrade the existing elemental-related systems without duplicating:
- Existing `h.affinities`
- Existing `n.cult.tm` technique-specific mastery
- Existing equipment-type compatibility (e.g. `sword`)
- Existing root-grade/cultivation formulas
- Existing combat and unique equipment effects

The system must affect real gameplay and NPC decisions: cultivation path, subpath, techniques, weapons, equipment, training, combat actions and character development.

## 2. User-confirmed decisions

1. Use the existing eight core elemental affinity IDs:
   - `FIRE`
   - `WATER_ICE`
   - `LIGHTNING`
   - `WIND`
   - `EARTH_METAL`
   - `WOOD_LIFE`
   - `YIN_SHADOW`
   - `LIGHT_YANG`
2. `ASTRAL` and `BLOOD_DEMON` are special elements, not ordinary birth-root elements.
3. Do **not** split or duplicate `h.affinities` in code. Keep the same object and all existing keys/values. In the character UI only, render two visual groups:
   - Elemental affinities: the eight keys above.
   - Non-elemental aptitudes/disciplines: every other key in the same `h.affinities` object.
4. Root-count Trait semantics are **Option A (exact count)**:
   - No special root-count trait: exactly 1 root.
   - Dual Root trait: exactly 2 roots.
   - Triple Root trait: exactly 3 roots.
   - Fourfold Root trait: exactly 4 roots.
5. Every root has its own grade: `HEAVENLY`, `TRUE`, `SPIRIT`, `MORTAL`, `DEFECTIVE`.
6. NPCs must understand and use root/element/equipment compatibility in actual decision-making.
7. Every relevant content ID must be audited. Content may be elemental, multi-elemental, element-linked without being elemental, or explicitly non-elemental.
8. Existing equipment-type synergy (e.g. a sword technique receiving a benefit from an item with `sword` type) must remain and combine correctly with new root/element factors.
9. No implementation prompt has been written and no code changes are authorized yet.

## 3. Keep data responsibilities distinct

| System | Responsibility |
|---|---|
| Root Composition | Which roots the character actually has; each root has its own grade |
| Legacy `h.root.grade` | Existing scalar read by old code; audit every call site and preserve compatibility until migrated |
| Legacy `h.root.elements` | Migration/audit input; do not assume every old entry becomes an active root |
| `h.affinities` | Keep one object; elemental aptitude and non-elemental aptitudes remain in it |
| Elemental Mastery | New trainable experience by element, only if no existing equivalent is found |
| `n.cult.tm` | Existing technique-specific mastery; keep separate |
| Equipment-Type Synergy | Existing compatibility such as `sword`; keep independent from element |
| Content Element Profile | Explicit element(s), weights, links or explicit no-element classification |

An extension schema such as `npc.ext.elementalSystem` may be appropriate, but it is only an example. Inspect the current extension, serialization, cloning, save/load, cache and module-loading architecture before choosing.

## 4. Affinity UI

The supplied screenshot shows elemental and non-elemental aptitudes mixed in one list. Improve readability by visually grouping the values, without creating another data object:
- “Elemental Affinities”: all eight elemental keys.
- “Non-elemental Aptitudes / Disciplines”: every remaining affinity key discovered in the current source.
- Read both groups from the same `h.affinities` object.
- Use registry/category metadata for grouping.
- Do not change keys, values, generation, serialization or existing formulas merely to change the UI.
- Show all values; do not silently truncate the list.
- Ensure mobile layout remains readable.

The screenshot is a visual reference only; derive actual keys and labels from the current source.

## 5. Element taxonomy and aliases

Canonical core IDs are the eight IDs above. `ASTRAL` and `BLOOD_DEMON` are special. Audit every legacy tag/alias, including (but not limited to) `WATER`, `ICE`, `WOOD`, `METAL`, `EARTH`, `YIN`, `YANG`, `LIGHT`, `BLOOD`, `FIVE_ELEMENTS`, `CHAOS` and all other tags found.

Do not guess mappings for ambiguous tags. Distinguish:
- Explicit canonical element
- Multi-element profile with explicit weights
- Element-linked synergy that does not mean elemental damage/nature
- Explicit no-element
- Unreviewed/unknown tag (must be investigated; never silently treated as neutral)

Special elements may appear on special content, but must not be randomly assigned as ordinary birth roots. Special mastery, if supported, must come from appropriate content/actions and access conditions.

## 6. Exhaustive content audit — every ID

Enumerate every actual ID in all relevant registries, not just examples:
- Techniques and martial skills
- Cultivation methods, mantras and manuals
- Cultivation paths and subpaths
- Weapons
- Armor, accessories, artifacts and equipment sets
- Consumables, pills, materials and items where relevant
- Traits, bodies and bloodlines
- Alchemy, forging and crafting recipes/processes
- NPC training activities
- Enemies, bosses and world content if elemental interactions exist

For each ID produce a manifest containing:
- ID and display name
- Content category
- Intrinsic element(s), or explicit no-element
- Element weights for multi-element content
- Elemental links/synergies (if any), separate from intrinsic element
- Equipment type/requirements (preserve existing tags such as `sword`)
- Root interaction policy and actual gameplay effect
- Existing unique-effect hooks that must remain
- Reason for classification and source evidence

Do not force every item/technique/path to have an element. A weapon may be non-elemental but still match a sword technique. A technique may have an element but no equipment requirement. Some techniques may have neither. Some items may have a thematic element link without dealing elemental damage.

Do not infer that every weapon is metal, every sword technique has one element, or every cultivation path must be elemental.

## 7. Compatibility and combined calculation

Create one shared compatibility/evaluation service, or a better architecture if justified. Avoid separate inconsistent formulas in cultivation, combat, skills, equipment and AI.

Keep these factors distinct:
- Base technique/path formula
- Technique-specific mastery (`n.cult.tm`)
- Per-element root grade
- Root match/opposition/neutral relationship
- Existing affinity contribution
- Elemental mastery contribution
- Existing equipment-type compatibility (`sword`, etc.)
- Unique equipment effects
- Existing path, trait, body and stat synergies

Rules:
- Matching root: use a match profile based on that root's grade.
- Opposing root: use an opposition profile.
- Neither match nor opposition: neutral baseline.
- Explicit no-element content: bypass root-element compatibility entirely; preserve all existing non-element systems.
- Multi-root character: choose the best relationship for each target element; do not add every root's bonuses together.
- Multi-element content: evaluate each element and combine using explicit weights; do not grant full bonus for every element.
- Learning relations are a separate directed graph/matrix. `A helps learning B` does not imply `B helps learning A`, nor does learning synergy automatically increase combat power.
- Unknown tags must not silently become neutral.
- Numeric bonuses, penalties, caps and diminishing returns are not locked yet. Audit existing formulas and simulate before selecting values.

### Equipment interaction

For a technique that requires equipment type `sword`:
- Keep the existing `sword` requirement and compatibility logic.
- Add root/element compatibility as an independent factor only when the technique/item metadata explicitly supports it.
- Preserve unique equipment effects and effect hooks.
- A root match must not override a hard equipment requirement.
- If a technique is non-elemental, its equipment-type synergy can still work; root-element bonus is bypassed.
- Avoid applying the same modifier twice in separate code paths.
- Use a final modifier aggregation with caps/diminishing returns, not blind multiplication of every bonus.

## 8. NPC intelligence and decision-making

This is a critical requirement. Do not build a system that only appears in the UI.

Audit and integrate every relevant AI decision pipeline:
- Cultivation path selection
- Subpath selection
- Technique learning and technique selection
- Weapon selection
- Armor/accessory selection
- Training and mastery activities
- Combat action selection
- Recruitment/member development where relevant

Separate:
- **Hard constraints:** realm/stage, prerequisites, weapon type, manual access, item availability, permissions, resource requirements and trait/root-count validity.
- **Soft preferences:** root compatibility, per-root grade, affinity, mastery, personality, interests, role, goals, risk tolerance, cost efficiency and current build.

NPCs must not choose a root-matched option automatically every time. Neutral/no-element content remains viable. They must consider personality, interests, access, cost, risk and goals.

NPC knowledge must be bounded. Do not let NPCs use hidden manuals/items/metadata they have not discovered or cannot reasonably know. Use a knowledge/observation model appropriate to the existing game.

Produce explainable decision breakdowns:
- Eligibility
- Existing base score
- Root compatibility
- Affinity contribution
- Mastery contribution
- Equipment compatibility
- Path/trait/body synergy
- Personality/interest/goal
- Access/cost/risk
- Final score and explanation

All decision pipelines should use consistent compatibility rules.

## 9. Root-count traits and rarity

Exact root count:
- No special trait: 1 root.
- Dual: exactly 2.
- Triple: exactly 3.
- Fourfold: exactly 4.

Prevent conflicting root-count traits. Trait changes/removal must not silently delete excess roots. Audit existing traits whose names imply root count (for example legacy Five-Spirit-root trait) and inspect their actual behavior; do not reinterpret by name alone.

Confirmed rarity patterns:
| Root count | Grade composition | Rarity |
|---|---|---|
| 1 | 1× HEAVENLY | Genius |
| 2 | 1× HEAVENLY + 1× TRUE/SPIRIT | Every few years |
| 2 | 2× HEAVENLY | About once per 100 years |
| 3 | 1× HEAVENLY + 2× TRUE/SPIRIT | About once per 100 years |
| 3 | 2× HEAVENLY + 1× TRUE/SPIRIT | Between 100 and 1,000 years |
| 3 | 3× HEAVENLY | About once per 1,000 years |
| 4 | Any grades | About once per 10,000 years |
| 4 | 4× HEAVENLY | Extremely rare; no hard unique limit; multiple may exist |

These are world-scale rarity expectations, not calendar guarantees. Account for actual NPC births per simulated year. Rarity must not automatically equal power: a four-root low-grade character is not automatically stronger than a two-root HEAVENLY character.

## 10. Elemental Mastery

First audit whether an equivalent system already exists. If a new mastery layer is needed:
- Increase it from actual successful technique use, cultivation and relevant training.
- Do not grant per hit/per target to prevent farming exploits.
- Keep it separate from affinity and technique mastery.
- Allow a character without a matching root to train mastery if they can access the content.
- Apply caps, diminishing returns, anti-farming, time-skip safety and deterministic save behavior.
- Special-element mastery requires appropriate special content/access.
- Do not add passive stat bonuses for all elements until the real stat/combat pipeline and balance have been tested.

## 11. Character UI and Edit Hub

Character status:
- Show each root and its individual grade.
- Show root-count Trait.
- Visually group affinities while reading the same object.
- Add an Element tab for elemental mastery, learning relations and compatibility breakdown.
- Explain effects on current path, subpath, techniques and equipment.
- Ensure mobile layout.

Edit Hub:
- Support safe viewing/editing of roots, per-root grades, root-count traits and mastery.
- Validate exact trait count and preview effects before commit.
- Recalculate/invalidate relevant caches.
- Audit catalog coverage against every current registry, including legendary equipment/techniques and content added later.
- Fix search/pagination/filter limits that hide entries.
- Prefer deriving catalog entries from registries over manually maintaining one-off lists.

## 12. Save migration

- Audit actual save/load and NPC cloning first.
- Migration must be idempotent; loading repeatedly must not reroll roots.
- Preserve legacy `h.root.grade` and `h.root.elements` until all call sites are safely migrated.
- Do not blindly convert legacy arrays of 4–5 elements into active roots.
- Compare old/new cultivation rate, breakthrough, technique performance and NPC decisions.
- Use stable IDs/seeds/tie-breakers; never use `Math.random` for migration.
- Provide migration alternatives and impact reports before destructive conversion.
- Handle missing extension data and partial/corrupt records safely.

## 13. Mandatory source audit before implementation

Verify latest branch, commit, dirty state and source files. Do not assume a previously inspected archive is current.

Search every read/write/reference of:
- `h.root.grade`
- `h.root.elements`
- `h.affinities`
- `n.cult.tm`
- `npc.ext`

Audit all formulas and call sites for cultivation, breakthrough, stats, combat, technique performance, equipment compatibility and AI decision scores.

Enumerate every ID in every relevant registry. Inspect load order, module boundaries, event hooks, caches, serialization, save/load, migration, Edit Hub catalog/search/pagination and legendary content.

**Locked file:** Do not modify `JianghuSect_v1.10/js/human_core.js`. If the existing extension/trait mechanism is insufficient, propose a safe external alternative and explain the limitation.

## 14. Tests and acceptance criteria

Test:
- 1/2/3/4 roots and exact Trait count
- All five per-root grades and mixed-grade combinations
- Match/opposition/neutral/no-element
- Multiple roots and weighted multi-element content
- All eight elemental affinity keys and all non-elemental affinity keys
- Mastery gain, no-root training, directed learning, caps and anti-farming
- Sword technique + sword equipment; mismatch; elemental weapon/technique; neutral equipment; unique effects
- Every content ID classified; all aliases reviewed; no duplicate hooks
- NPC path/subpath/technique/weapon/training/combat decisions and knowledge limits
- Legacy save, repeated migration, save/load, Edit Hub and cache invalidation
- Multi-seed long simulation and power stacking
- Mobile UI and complete visibility

Separate forced test scenarios from natural NPC simulation. Report multiple seeds and before/after behavior.

## 15. Required deliverables after implementation

1. Source Audit Report with branch/commit, files, call-site map and data flow.
2. Complete Content Manifest covering every ID.
3. Element taxonomy/alias report.
4. Root and Trait specification.
5. Compatibility formula report with stacking/caps and breakdown.
6. NPC decision report for every affected pipeline.
7. Migration plan and test results.
8. Unit/integration/regression/multi-seed test report.
9. Implementation summary with changed files, rationale, alternatives and deviations.

## 16. Freedom to improve the design

This reference records intent, not rigid implementation instructions. The developer may improve the architecture, especially where current code differs from assumptions. However:
- Do not silently change user-confirmed decisions.
- For any proposed deviation, explain evidence, benefits, risks and compatibility effects.
- Numeric formulas, relation matrices, mastery curves, alias decisions and migration policy remain open for source-based design.
- Do not stop at metadata/UI; prove the data affects gameplay and NPC decisions.

## 17. Current status

Confirmed: eight core elements, two special elements, single `h.affinities` object with UI grouping, exact root-count Traits, NPC integration, exhaustive content audit, and coexistence with equipment-type synergy.

Open: exact formulas, relation matrices, numeric bonuses/caps, mastery curve, legacy migration and final schema.

**No implementation prompt has been written. No code changes have been made.**
