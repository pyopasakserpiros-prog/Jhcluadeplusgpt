# Acceptance Test Matrix — Elemental Roots / NPC Intelligence Overhaul

Gemini must add automated tests to the existing suite. These are acceptance requirements, not optional suggestions.

| Area | Required cases | Pass condition |
|---|---|---|
| Root count | Default, Dual, Triple, Fourfold | Exactly 1 / 2 / 3 / 4 roots respectively |
| Root validity | Duplicate element, unknown element, ASTRAL/BLOOD_DEMON as ordinary root | Rejected or explicitly handled; never silently accepted as ordinary roots |
| Root traits | Conflicting count traits, missing trait, trait change, edit undo | One valid count class; exact root count remains invariant |
| Per-root grades | All five grades; mixed grades across multiple roots | Every root has an independent grade and resolver reads the correct one |
| Root generation | Same seed, many seeds, forced test cases | Deterministic; confirmed rarity classes derive from actual composition |
| Rarity model | 2-root, 3-root, 4-root confirmed compositions | World-scale expected intervals preserved; no hard unique cap for 4×HEAVENLY |
| Rarity vs power | 4 low-grade roots vs 2 HEAVENLY roots | Four-root rarity does not grant automatic superiority |
| Aggregate adapter | Mixed roots, multiple low grades, one high grade | Protected scalar consumers receive a conservative, justified aggregate; no free multi-root power stacking |
| Core lock | `js/human_core.js` hash | Byte-for-byte unchanged unless a documented blocker is approved |
| Affinity structure | 23 existing keys | Same `h.affinities` object; no duplicated affinity store |
| Affinity UI | 8 elemental + 15 other | All 23 shown; grouped; mobile readable; no horizontal overflow |
| Element aliases | WATER/ICE/WOOD/METAL/EARTH/YIN/YANG/LIGHT/BLOOD/CHAOS/FIVE_ELEMENTS | Explicit context-aware mapping; unknown tags surfaced rather than silently neutralized |
| Special elements | ASTRAL and BLOOD_DEMON | Special access/mastery only; not ordinary birth roots |
| Content profiles | Single, weighted multi, link-only, special, explicit non-elemental, unresolved | Every relevant ID explicitly classified |
| Weighted elements | Two or more components | Weights normalized; no full bonus per component |
| Root relation | Match, opposition, neutral | Correct bounded relationship and explainable result |
| Multi-root relation | One matching and one opposing root | Best valid relationship used; no additive full bonus exploit |
| Learning relation | Directed A→B, test B→A | Directionality respected; learning synergy does not silently increase combat output |
| Elemental mastery | Actual use, practice, training, no-root NPC | Increases from legitimate actions; can train without matching root when access permits |
| Anti-farming | Multi-hit, AoE, repeated spam, same event duplicate, time skip | No per-hit/per-target multiplication; event deduplication and diminishing returns work |
| Technique mastery | `n.cult.tm` | Remains separate from elemental mastery |
| Equipment type | Sword technique + sword, sword technique + wrong weapon | Existing hard requirement/type synergy remains authoritative |
| Non-elemental equipment | Non-elemental sword + sword technique | Weapon-type synergy still works without root bonus |
| Cultivation | Elemental and non-elemental paths/mantras | Relevant per-root grade affects only supported elemental methods; neutral methods use conservative fallback |
| Breakthrough | Mixed root grades and path profiles | Bounded; no duplicate scalar + per-root bonus |
| Combat | Damage, heal, shield, DOT, control, status rider | Element/root modifier applied once; existing `SK.ELEM` effects preserved |
| Legendary effects | 11 legendary weapons, 22 legendary arts/mantras | All unique hooks/UID/provenance work and remain distinct |
| NPC path choice | Different roots/personality/goals | Scores respond to roots but not exclusively; divergent builds are possible |
| NPC technique choice | Matching, nonmatching and non-elemental options | NPC selects the best rational option based on access, build, personality and goals |
| NPC knowledge | Hidden/inaccessible content | NPC does not select content it cannot access or know |
| NPC gear choice | Root match vs type match vs price/unique effect | Existing gear score plus elemental fit is coherent and explainable |
| NPC combat choice | Multiple available techniques | Elemental suitability informs action score exactly once without overriding tactical state |
| NPC explanation | Every scored option | Breakdown matches the actual final score |
| Edit Hub catalog | All registries, 11 legendary weapons, 22 legendary arts/mantras | Every record discoverable or explicitly excluded with reason |
| Edit Hub search | ID, name, rarity, effect, element, type, path | Search returns expected records, including `Legendary` |
| Edit Hub pagination | More than 60 records | No silent truncation; page counts and next/previous behavior correct |
| Root editing | Add/remove root, change grade, change count trait | Preview, validation, commit, undo, cache invalidation all correct |
| Save schema | New game and new-schema round trip | New schema saves/loads deterministically; old-save compatibility is not required |
| Visitor conversion | Visitor becomes member | Root identity survives conversion and cloning |
| Standalone | Single HTML | New game, UI, simulation and new-schema save/load work offline |
| Mobile UI | 360×800, 800×360, 1280×800 | No horizontal overflow; controls and data remain readable |
| Performance | NPC decisions and high simulation speed | Resolver caching is correct; no repeated expensive recomputation or unacceptable slowdown |
| Regression | Existing systems | Fishing, inventory, ecology, economy, NPC life, graphics, combat and standalone regressions remain intact |

## Test reporting format

For each test run, report:

- Exact command.
- Environment/runtime version.
- Number of suites and assertions.
- Passed / failed / skipped / timed out.
- Failure details and whether they are baseline or introduced.
- Whether browser checks are headless emulation or physical-device tests.

Do not claim full regression success if the runner timed out or only focused suites ran.
