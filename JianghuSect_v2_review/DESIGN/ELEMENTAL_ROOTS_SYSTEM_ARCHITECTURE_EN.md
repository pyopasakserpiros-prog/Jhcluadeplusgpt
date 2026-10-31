# JianghuSect — Elemental Roots, Elemental Mastery & Content Compatibility Architecture

**Design reference for implementation · User-confirmed decisions are binding; numeric tuning remains an engineering task.**

## 1. Design objective

Upgrade the elemental systems already present in JianghuSect rather than create parallel versions. The result must be a real gameplay system shared by cultivation, subpath selection, technique learning, technique execution, equipment evaluation, combat, NPC training, Edit Hub and character UI.

The implementation must preserve the distinction between innate roots, existing affinities, trained elemental mastery, per-technique mastery, equipment-type compatibility, content-specific effects and personality/goal-driven choices.

## 2. Canonical elemental taxonomy

### Ordinary birth-root elements — exactly eight

- `FIRE`
- `WATER_ICE`
- `LIGHTNING`
- `WIND`
- `EARTH_METAL`
- `WOOD_LIFE`
- `YIN_SHADOW`
- `LIGHT_YANG`

These are the only ordinary birth-root IDs. A normal NPC is not randomly born with `ASTRAL` or `BLOOD_DEMON` as a regular root.

### Special elements

- `ASTRAL`
- `BLOOD_DEMON`

These already exist in the combat element registry and may be used by special techniques, paths, effects or special progression. They are not ordinary birth roots. Special mastery, if implemented, must require legitimate access and progression through special content rather than a free passive bonus from ordinary roots.

### Explicit no-element

- `NEUTRAL` may be used only when content is explicitly non-elemental.
- Missing, malformed or unknown tags must not silently become `NEUTRAL`.

### Alias review

The source contains tags including `WATER`, `ICE`, `WOOD`, `METAL`, `EARTH`, `YIN`, `YANG`, `LIGHT`, `BLOOD`, `CHAOS`, `FIVE_ELEMENTS`, plus discipline/weapon tags such as `ARRAY`, `SWORD`, `BLADE`, `POISON` and others. Gemini must classify each tag according to its actual field context and semantics. Suggested mappings such as `WOOD → WOOD_LIFE`, `WATER/ICE → WATER_ICE`, `YIN → YIN_SHADOW`, and `YANG/LIGHT → LIGHT_YANG` are hypotheses, not permission to blindly rewrite ambiguous content. `BLOOD`, `CHAOS` and `FIVE_ELEMENTS` require explicit semantic decisions. `FIVE_ELEMENTS` may represent a weighted composite rather than a birth root.

## 3. Keep the existing affinity object

`h.affinities` remains the single source object and retains all 23 existing keys and values.

- Elemental affinities: 8 canonical element keys.
- Non-elemental aptitudes/disciplines: the other 15 keys (8 craft + 7 martial).

Do not create a second `elementAffinities`, `rootAffinities` or replacement object. UI grouping is a presentation concern only. Existing formulas that use affinities must be audited to avoid double-counting when roots and mastery are added.

## 4. Distinct character dimensions

| Dimension | Meaning | Existing/new |
|---|---|---|
| Root composition | Which ordinary elements the character is innately rooted in | New structure built on existing `h.root` area |
| Per-root grade | Quality of each individual root | New; `HEAVENLY`, `TRUE`, `SPIRIT`, `MORTAL`, `DEFECTIVE` |
| Root-count trait | Exact number of roots: 1/2/3/4 | New trait/extension registry |
| `h.affinities` | Innate aptitude for elements, weapons and disciplines | Existing 23-key object; reuse |
| Elemental mastery | Trainable experience with an element | New only after audit confirms no equivalent exists |
| `n.cult.tm` | Mastery of a specific technique | Existing; keep separate |
| Equipment type | Sword, blade, spear, bow, staff, focus, armor type, etc. | Existing; keep separate |
| Content element profile | Element(s) and weights/links of a technique, subpath, item or effect | Existing tags plus normalized metadata |
| Unique effects | Authored signature behavior of a specific item/technique | Existing; preserve and integrate |

## 5. Recommended data model

The exact implementation may improve on this proposal, but it must preserve the semantic separations above.

### Root identity

Because `js/human_core.js` is protected by the current handoff and contains a scalar `h.root.grade` read by existing code, a practical adapter is:

```js
h.root = {
  grade: "MORTAL", // conservative derived aggregate used only by protected legacy/core consumers
  roots: [
    { elementId: "FIRE", gradeId: "HEAVENLY" },
    { elementId: "WOOD_LIFE", gradeId: "SPIRIT" }
  ],
  capacityTraitId: "ROOT_CAPACITY_DUAL",
  rarityClassId: "GENIUS_DUAL_HEAVENLY_TRUE"
};
```

The example aggregate grade is illustrative only. Gemini must design and justify a conservative aggregate rule. The scalar must not be treated as the authoritative grade of every root. Every new element-specific system must read `h.root.roots` through the central resolver. Keep the adapter only where the protected core requires it; do not let old scalar reads spread into new systems.

Root identity stored in `h.root` can travel with visitor/character `h` snapshots. Trainable state and knowledge may be stored in a versioned `npc.ext.elementalSystem` object, provided cloning, serialization and caches are handled correctly.

### Elemental progression extension

A possible shape:

```js
npc.ext.elementalSystem = {
  schemaVersion: 1,
  mastery: {
    FIRE: 0, WATER_ICE: 0, LIGHTNING: 0, WIND: 0,
    EARTH_METAL: 0, WOOD_LIFE: 0, YIN_SHADOW: 0, LIGHT_YANG: 0
  },
  specialMastery: { ASTRAL: 0, BLOOD_DEMON: 0 },
  knowledge: {},
  lastProgressionEvents: {}
};
```

This is a design sketch, not a mandatory schema. Do not duplicate `h.affinities` in this extension. Mastery must remain separate from technique mastery.

## 6. One authoritative resolver

Create one shared, deterministic, side-effect-free evaluation authority (or a demonstrably better equivalent) that is used by all relevant consumers. It should expose concepts equivalent to:

- `normalizeElementTag(tag, context)` — canonicalize verified aliases and identify unknown tags.
- `contentElementProfile(content)` — return intrinsic elements, weights, element-link-only metadata, explicit no-element, or unresolved status.
- `rootForElement(npc, elementId)` — find the character's matching root and its individual grade.
- `evaluateRootCompatibility(npc, profile, context)` — calculate match/opposition/neutral behavior and explain the result.
- `evaluateLearningRelation(rootElement, targetElement)` — consult a separate directed learning relation model.
- `evaluateCombinedCompatibility(npc, content, context)` — combine root grade, affinity, elemental mastery, technique mastery, path/body/trait synergies and equipment type without double application.
- `explainCompatibility(...)` — return a UI- and AI-readable breakdown.

The resolver must not mutate NPCs, consume RNG or apply gameplay effects itself. Gameplay systems consume its result exactly once at their authoritative calculation point.

## 7. Element relationships: two separate models

Do not conflate combat efficacy and learning affinity.

1. **Efficacy relation:** root element versus content element: match, opposition or neutral. This controls the bounded performance relationship.
2. **Directed learning relation:** root element A may make learning element B easier. It is directed: A helping B does not imply B helps A. It does not automatically increase combat damage.

Gemini must design the full matrices/graphs from the game's lore and actual element taxonomy. Do not blindly impose a five-element cycle on eight elements. Include special-element access rules and unknown-tag validation.

## 8. Content element profile

Every relevant content ID must receive an explicit audit classification:

- `INTRINSIC_SINGLE`: one intrinsic element.
- `INTRINSIC_WEIGHTED`: multiple intrinsic elements with explicit weights summing to 1 (or 100%).
- `ELEMENT_LINK_ONLY`: linked to an element for a specific synergy, but not elemental damage/nature.
- `SPECIAL_ELEMENT`: `ASTRAL` or `BLOOD_DEMON` content with access/progression requirements.
- `EXPLICIT_NON_ELEMENTAL`: intentionally has no element and bypasses root-element bonuses/penalties.
- `UNRESOLVED`: must be investigated; it must not silently behave as neutral.

Do not force an element onto every item, technique, path or recipe. Examples:
- A non-elemental sword may still synergize with a sword technique through the existing `weaponTypes` system.
- A fire technique may have no weapon requirement.
- A sword technique may be non-elemental.
- An accessory may link to Wood for healing without dealing Wood damage.
- A technique may have neither an element nor an equipment requirement.

Multi-element profiles must use authored weights and a normalized result. Do not grant full root bonus for every component. Multi-root NPCs choose the best valid root relationship for each component; never sum every matching root as a full bonus.

## 9. Combined calculation and stacking discipline

Keep these factors distinct and traceable:

- Base technique / cultivation / subpath formula
- Existing `n.cult.tm` technique mastery
- Matching per-element root grade
- Root match/opposition/neutral relation
- Existing `h.affinities[element]`
- New elemental mastery
- Existing weapon/armor type compatibility
- Existing path/subpath/body/trait/passive synergies
- Item quality, durability and price considerations
- Unique item/technique effects
- Contextual state and personality modifiers

Avoid blind multiplication of every layer. Prefer a bounded modifier budget, additive contributions with caps, or a tested diminishing-return aggregation. Every applied modifier must have one authoritative source and one application point. Add tests that detect duplicate application.

A hard equipment requirement remains a hard requirement. Root compatibility cannot make an incompatible weapon usable. A no-element technique bypasses only elemental compatibility; all existing weapon/path/passive synergies still function.

## 10. Cultivation and subpath integration

Current `CULT.pathScores`, `CULT.rate` and `CULT.breakthroughChance` use affinities and/or a scalar root grade. Rework them to consult the new resolver:

- Elemental cultivation methods/mantras use the relevant per-element root grade.
- Non-elemental methods use a conservative aggregate/fallback that does not reward extra roots for free.
- Subpath selection combines root relevance with existing affinity, personality, interests, aptitude, goals and path-skill fit.
- Root grade should not override the character's broader build or make all NPCs choose the same path.
- Cache keys and invalidation must include root composition/grade, relevant mastery and metadata version.

## 11. Combat and technique integration

The existing `SK.ELEM` registry already maps elements to status riders/control effects. Preserve those behaviors unless a deliberate, tested redesign is justified. The root system may modify performance only through the authoritative resolver. It must not duplicate status application or weapon procs.

Inspect every actual combat calculation point in `js/skills.js`, `js/combat.js`, `js/stats.js`, `js/martial.js` and `js/visitors_clues.js`. Ensure:
- Elemental effects are applied exactly once per actual action.
- Multi-hit/multi-target actions do not grant mastery repeatedly per hit/target.
- Special weapon procs, `fxKind`, `effectId`, UID and unique-instance behavior remain intact.
- Existing `weaponTypes`, `armorTypes`, `requiresWeapon`, `M.skillEfficiency`, `M.skillSynergy` and subpath synergy still work.

## 12. Elemental mastery progression

The source audit found no dedicated elemental mastery equivalent. `n.cult.tm` is technique-specific and must remain so. If a new mastery system is needed:

- Progress only from successful, meaningful elemental practice, cultivation or actual technique use.
- Do not grant a full increment per damage hit or target.
- Apply diminishing returns, caps, event deduplication and anti-farming rules.
- A character without a matching root may still learn an element through training/content access.
- Special mastery requires special content/unlock conditions.
- Affinity should influence learning aptitude/preferences; mastery should represent trained experience; root grade should represent innate compatibility. Do not count the same signal twice.

## 13. NPC decision intelligence

This is a core acceptance requirement, not optional polish. NPCs must use the system when making real decisions:

- Main cultivation path and subpath selection
- Technique/manual evaluation and learning
- Mantra choice
- Weapon, armor, accessory and artifact selection
- Passive loadout and combat technique selection
- Elemental training/mastery activities
- Crafting/forging/alchemy decisions where elemental links matter
- Recruitment/development where relevant

Separate hard eligibility from soft preferences. Hard constraints include stage, prerequisites, weapon requirements, access, ownership, cost availability and trait capacity. Soft scoring includes root compatibility, per-root grade, affinity, mastery, technique mastery, personality, interests, role, goals, risk and economy.

NPCs must not be omniscient. They may evaluate content they can access, have discovered, or have sufficient information to assess. Preserve the current cognition/goals/knowledge architecture; do not rebuild it.

Expose a deterministic score breakdown: eligibility, base score, root relation, grade, affinity, elemental mastery, technique mastery, equipment type, path/body/trait synergy, personality/goal, access/cost/risk and final score. The breakdown must correspond to the score actually used.

## 14. Character UI and Edit Hub

### Character UI

- Show every active root with its own grade.
- Show root-count trait and rarity classification.
- Show all 23 affinities in two visual groups while reading the same object.
- Add a clear Element view for ordinary mastery, special mastery, learning relations and compatibility breakdown.
- Show actual effects on current path, subpath, mantra, techniques and equipped gear.
- Mobile-first: no horizontal overflow and no silent truncation.

### Edit Hub

- Edit root count trait, root composition, individual root grades and mastery with strict validation.
- Preview exact downstream effects before commit; undo must restore all root/element state and invalidate caches.
- Reconcile any incompatible learned/equipped content using existing game services, not raw UI mutation.
- Modernize the catalog to be registry-driven, searchable by ID/name/kind/tier/rarity/effect/source/element, paginated or virtualized, and complete.
- Show all 11 legendary weapons and all 22 legendary arts/mantras. Keep “visible/read-only” distinct from “spawnable”, “grant manual”, “teach/unlock”, “equip”, “set mantra” and “adjust mastery”.
- Preserve unique legendary UIDs, provenance and ordinary-world uniqueness rules. Debug-spawned items must be clearly marked and excluded from normal economy/reward accounting where appropriate.

## 15. Creative content pass

Gemini is explicitly authorized to be creative. For each relevant ID, inspect the full context and decide whether to:
- Keep the existing name and metadata.
- Rename it to better express its weapon type, element, path, subpath, combat identity and signature effect.
- Rework moves, effect profile, costs, cooldowns, conditions, mastery progression or item stats when needed.
- Add explicit root/element links only when lore and mechanics support them.
- Leave it intentionally non-elemental when that is the better design.

Do not perform superficial keyword replacement. Example: if a technique is explicitly a Sword technique with a Fire theme, its name, `weaponTypes`, move descriptions, effect profile, combat role and NPC preferences should tell one coherent story. The example is illustrative, not a template to apply blindly.

Preserve each legendary weapon/technique's unique identity and effect hook. If an effect requires new engine support, implement a real tested effect handler; never leave decorative metadata that does nothing.

## 16. Save/version policy — breaking changes are allowed

Backward compatibility with older game versions and old save files is explicitly NOT required. Do not spend time preserving old serialized schemas or writing old-save migration layers. You may bump the save schema, redesign root/mastery storage, and require a new game.

Still required:
- New-game initialization is valid and deterministic.
- New-schema serialize/deserialize round trips correctly.
- Repeated load does not reroll roots or mastery.
- Cloning/visitor-to-member flows preserve the new identity fields.
- Corrupt/missing new-schema fields fail safely or are repaired deterministically.
- UI, simulation, autosave and standalone HTML all use the same schema.

## 17. Protected core and engine constraints

The current main-1 handoff explicitly protects `js/human_core.js` byte-for-byte. Keep it unchanged and build the root system through data registries, extension modules, wrappers/adapters and downstream consumers. If the new architecture truly cannot work without editing it, do not silently break the lock: document the exact technical blocker and alternatives first.

Preserve deterministic RNG, the existing offline/browser architecture, all completed NPC/economy/fishing/inventory/graphics systems, and the single-file standalone distribution. The user uses a mobile device; profile high-speed simulation and memory use.

## 18. Required deliverables

1. Updated source tree and standalone HTML.
2. New root/element/mastery/trait schema and registries.
3. Complete per-ID content classification manifest, with rationale and before/after metadata.
4. Central compatibility resolver and integration report.
5. NPC decision integration report with actual score breakdowns and behavior tests.
6. Updated character UI and Edit Hub.
7. New-schema save/load tests; no old-save compatibility work.
8. Root generation/rareness simulation across multiple seeds and long-run expected frequencies.
9. Combat/cultivation/equipment balance report with sample calculations.
10. Full regression results, focused tests, syntax checks, standalone verification and mobile viewport checks.
11. Final report listing all files changed, design deviations, rejected alternatives, known limitations and rationale.
12. Updated README, HANDOFF and roadmap for the next developer.

## 19. Execution protocol

Work slowly and thoroughly. Begin with a source/registry/call-graph audit; do not jump straight to editing. Use the included `CONTENT_AUDIT_MANIFEST.json` as a checklist, but re-derive it from the actual source so the manifest cannot become stale. Verify every ID and every relevant call site. Design the model and formulas, test them in isolation, then integrate in stages. Do not stop after adding fields or UI: prove the values affect actual game outcomes and NPC choices.

If a better architecture exists than this document proposes, implement it when it preserves all user-confirmed decisions and improves correctness, maintainability, performance or gameplay. Record the deviation, alternatives considered, trade-offs and reason in the final report. Never silently change a locked user decision.
