# MASTER IMPLEMENTATION PROMPT — JIANGHUSECT ELEMENTAL ROOTS & NPC INTELLIGENCE OVERHAUL

**For Gemini · Full implementation assignment · Baseline: supplied JianghuSect v2.0.2 review package / SIM.PATCH_VERSION 1.12.7 / ELEM.VERSION 2.0.1 · 31 October 2026**

---

## MISSION

You are the principal systems architect, gameplay engineer, data designer, simulation balancer and QA owner for the JianghuSect cultivation simulation game.

Your task is to **continue the existing game from the source included in this package** and turn its currently fragmented elemental/root-related data into a coherent, deeply integrated gameplay system. This is an overhaul of existing systems, not a new project and not a request to create a parallel elemental engine.

The final result must connect all of the following into one consistent model:

- Innate elemental root composition and individual root grades
- Existing elemental and non-elemental affinities
- Elemental mastery gained through real training and use
- Existing per-technique mastery
- Cultivation methods, main paths and subpaths
- Techniques, mantras, moves, passives and martial skills
- Weapons, armor, accessories, artifacts and legendary equipment
- Existing weapon/armor type compatibility and subpath/equipment synergy
- Combat damage, control, status riders and unique effects
- NPC path/subpath/technique/equipment/training/combat decisions
- Character status UI and Edit Hub
- Complete content registry coverage and meaningful tests

This is a substantial systems task. **Do not rush.** The user explicitly prefers a carefully designed, fully audited result over a quick patch. You may spend the time and reasoning needed to inspect every relevant file, registry, ID and calculation path. Do not produce a superficial first pass and call it complete.

Read `PACKAGE_MANIFEST.json` first to verify the delivered file set and protected hashes. Then read these documents in this order before editing:

1. `README_TH.md`
2. `DESIGN/ELEMENTAL_ROOTS_SYSTEM_ARCHITECTURE_EN.md`
3. `DESIGN/ROOT_GENIUS_RARITY_RULES.md`
4. `AUDIT/SOURCE_AUDIT_REPORT_TH.md`
5. `AUDIT/CONTENT_AUDIT_SUMMARY.md`
6. `AUDIT/CONTENT_AUDIT_MANIFEST.json`
7. `AUDIT/NPC_AI_INTEGRATION_MATRIX.md`
8. `AUDIT/EDIT_HUB_GAP_ANALYSIS.md`
9. `AUDIT/ACCEPTANCE_TEST_MATRIX.md`
10. The source's own `HANDOFF.md`, `README.md`, architecture docs, test docs and relevant module comments.

The included source is under:

`GAME_SOURCE/JianghuSect_v1.10/`

The included manifest is a source-derived starting inventory, not an unquestionable truth. Rebuild and verify it from the actual source before relying on it.

---

## 0. CONTINUE THE EXISTING PROJECT — DO NOT RESTART

The attached `JianghuSect_v2.0.2` review package is the authoritative source for THIS assignment. It contains `SIM.VERSION 1.10.11`, `SIM.PATCH_VERSION 1.12.7`, `ELEM.VERSION 2.0.1`, the elemental/root overhaul, the Codex follow-up fixes and the current regression suite.

The GitHub repository `pyopasakserpiros-prog/Jhcluadeplusgpt` was inspected on 31 October 2026. Its remote `main-1` head was `e5e4f8ff5d111625dacf6c630434cbe2eba7428e`, and the source fetched from that branch reported `SIM.PATCH_VERSION 1.12.0`. That remote branch is older than the attached v2.0.2 package and is NOT a replacement for this package. Do not overwrite the attached source with the older remote branch or assume the archive is already pushed.

You must:

- Continue from the attached v2.0.2 package and preserve all valid completed work.
- Not recreate the root system, elemental resolver, NPC cognition, economy, fishing, graphics, inventory, visitor/clue, wildlife or other completed systems merely because they are adjacent to the requested redesign.
- Verify the package's actual code and tests before editing; do not rely only on this prompt or historical reports.
- Inspect any active workspace/branch and its dirty state before copying or replacing files. Never overwrite newer valid work with an older source.
- Maintain a clear handoff, changelog, audit manifest and test evidence throughout implementation.
- Do not push or merge to `main` or `main-1`; return the complete reviewed source package for independent Codex review unless the user separately authorizes a push.
- Treat the source archive and hashes as provenance. Do not claim the package is the current GitHub HEAD.

The assignment is to **upgrade and integrate** the existing system, not to discard the game and build a new one.

---

## 1. SAVE COMPATIBILITY POLICY — BREAKING CHANGES ARE AUTHORIZED

The user has explicitly changed the requirement:

> Backward compatibility with older game versions and old save files is NOT required. It would constrain the new architecture. Develop the new system at full quality and efficiency.

Therefore:

- Do NOT spend time preserving compatibility with older game versions.
- Do NOT build or maintain old-save migration layers merely to keep old saves playable.
- You may redesign the save schema, NPC data shape, root structure, mastery structure, caches and serialization as required.
- You may bump or replace the save schema and require a new game/new save.
- You may remove obsolete legacy compatibility code and tests that exist solely to enforce old-save support, provided you replace them with stronger tests for the new schema.
- Do not retain a bad data model merely because an old save used it.

However, this is not permission to ignore persistence quality. You MUST still test:

- New-game creation and deterministic initial root generation.
- New-schema serialization and deserialization round trips.
- Repeated load without rerolling root composition, grades, rarity or mastery.
- NPC cloning and visitor-to-member flows.
- Autosave and manual save behavior.
- Data validation, cache invalidation and recovery from malformed new-schema data.
- Standalone HTML operation using the new schema.

Do not conflate **old-save compatibility** with **internal code correctness**. A field may still be required by a protected current module even though old save compatibility is not required.

---

## 2. USER-CONFIRMED DESIGN DECISIONS — DO NOT CHANGE SILENTLY

### 2.1 Eight ordinary birth-root elements

Use these eight canonical IDs, which already exist in `JD.CORE.affinityKeys.ELEMENT` and `h.affinities`:

- `FIRE`
- `WATER_ICE`
- `LIGHTNING`
- `WIND`
- `EARTH_METAL`
- `WOOD_LIFE`
- `YIN_SHADOW`
- `LIGHT_YANG`

These are the only ordinary birth-root element IDs.

### 2.2 Special elements

`ASTRAL` and `BLOOD_DEMON` are special elements. They already appear in the combat element registry and in special techniques/content. They are NOT ordinary random birth roots. Do not turn them into ninth and tenth normal root options.

Special-element mastery or attunement may be designed if it materially improves gameplay, but access must be earned through appropriate special content, path/subpath, techniques, discoveries or events. Never grant an automatic free special-element boost to every NPC.

### 2.3 Keep the same `h.affinities` object

Do not split, replace or duplicate `h.affinities` in code. Keep all 23 existing keys and their current meaning:

- 8 elemental affinity values.
- 15 non-elemental aptitude/discipline affinity values.

In the character UI only, group them into:

1. Elemental Affinities — 8 keys.
2. Non-elemental Aptitudes / Disciplines — 15 keys.

Both groups must read from the same original `h.affinities` object. Do not create a second elemental-affinity data object.

### 2.4 Exact root-count rule — Option A

Root count is determined by a dedicated root-count trait/class, with exact semantics:

| Trait/class | Exact active root count |
|---|---:|
| No special root-count trait | 1 |
| Dual Root | 2 |
| Triple Root | 3 |
| Fourfold Root | 4 |

This is an exact count, not merely a soft maximum. No ordinary NPC has 2–4 roots without the corresponding root-count trait/class. No five-root characters.

The root-count trait grants count, not grade quality. A Fourfold Root character is not automatically four Heavenly roots.

Do not allow conflicting root-count traits. Do not accidentally put root-count traits into a generic random-trait pool unless their generation is explicitly controlled by the world rarity model.

### 2.5 Individual root grades

Every root has its own grade, ordered:

`HEAVENLY > TRUE > SPIRIT > MORTAL > DEFECTIVE`

Example: an NPC may have `FIRE / HEAVENLY` and `WOOD_LIFE / SPIRIT`. Do not use one shared grade as the authoritative grade of all roots.

### 2.6 Genius rarity

The user-confirmed world-scale rarity rules are defined in `DESIGN/ROOT_GENIUS_RARITY_RULES.md`. Preserve them exactly. The most important special rule is:

- A Triple Root with two `HEAVENLY` roots and one `TRUE` or `SPIRIT` root is expected between 100 and 1,000 world-years.
- Any Fourfold Root composition is expected around once per 10,000 world-years.
- Four `HEAVENLY` roots are extraordinarily rare but have no hard unique limit; multiple such characters may exist.

Rarity is not the same as combat power. Never use rarity title as an automatic global power multiplier.

---

## 3. SOURCE AUDIT — VERIFY THE ACTUAL ENGINE BEFORE CODING

The package includes a source audit and content manifest. Re-verify all relevant findings in the actual source and produce an updated call graph. At minimum, inspect:

### Core and data registries

- `data/data_core.js`
- `data/data_cult.js`
- `data/data_tech.js`
- `data/data_martial.js`
- `data/data_items.js`
- `data/data_expansion.js`
- `data/data_ecology.js`
- `data/data_beasts.js`
- `data/data_bt.js`
- `data/data_cb.js`
- `data/data_cp.js`

### Runtime modules

- `js/human_core.js`
- `js/cultivation.js`
- `js/skills.js`
- `js/combat.js`
- `js/stats.js`
- `js/martial.js`
- `js/proficiency.js`
- `js/retraining.js`
- `js/cognition.js`
- `js/ai.js`
- `js/sect.js`
- `js/cpeco.js`
- `js/visitors_clues.js`
- `js/sim.js`
- `js/ui.js`
- `js/main.js`

Search every read/write/reference of at least:

- `h.root.grade`
- `h.root.elements`
- `h.affinities`
- `n.cult.tm`
- `npc.ext`
- `SK.ELEM`
- `weaponTypes`
- `armorTypes`
- `requiresWeapon`
- `M.evaluateSynergies`
- `M.gearSuitability`
- `COG.techPreference`
- `COG.evaluateTech`
- `COG.bestGearUpgrade`
- `CULT.pathScores`
- `CULT.rate`
- `CULT.breakthroughChance`
- `EDITOR.catalog`
- `EDITOR.memberEditState`
- `EDITOR.previewCharacterEdit`
- `EDITOR.applyCharacterEdit`
- `EDITOR.undoLastEdit`

### Important baseline findings to verify

1. `h.affinities` contains 23 keys: 8 element keys and 15 other discipline/weapon/craft keys.
2. Current root generation in `human_core.js` creates one scalar `h.root.grade` and a Thai-labelled `h.root.elements` array. The element count is currently derived from the scalar grade using the old `[5, 4, 2, 1, 1]` pattern. This conflicts with the new exact 1/2/3/4 root-count trait design.
3. `h.root.elements` appears to be generated/stored but has no gameplay readers in the inspected source. Verify this exhaustively.
4. `h.root.grade` is a scalar used by protected core derivation, cultivation rate/breakthrough and sect talent evaluation. The new system must eliminate split-brain logic while respecting the protected-core constraint below.
5. There is already a combat element registry `SK.ELEM` with eight ordinary elements, `ASTRAL`, `BLOOD_DEMON` and `NEUTRAL`. Preserve/extend it; do not create a second combat element table.
6. There is no dedicated elemental mastery system in the inspected source. `n.cult.tm` is technique-specific mastery. If you add elemental mastery, keep it distinct.
7. Existing equipment and martial compatibility is substantial. It already understands equipment type, technique requirements, path/subpath, learned techniques, skills, passives, durability, price and legendary weapon requirements. Integrate with it.
8. Existing cognition/AI already has long-term aspirations, goal continuity, technique evaluation and equipment upgrade logic. Extend it; do not rebuild cognition from scratch.
9. The character UI currently shows only the top 10 affinity values rather than all 23 grouped values.
10. Edit Hub catalog has a first-60 rendering limit and incomplete legendary weapon coverage. The actual runtime catalog contains 1,102 descriptors in this baseline; 22 legendary manuals/arts are present but beyond the first 60, and 11 legendary weapons are not catalog entries.

### Protected `human_core.js`

The current `HANDOFF.md` explicitly requires `js/human_core.js` to remain byte-for-byte unchanged. Preserve its SHA-256 unless there is a proven, unavoidable technical blocker. Build the new system through data registries, extension modules, wrappers/adapters and downstream consumers. If you believe the protected file must change, stop and report the exact blocker and alternatives instead of silently editing it.

The protected core currently expects `h.root.grade`. You may need to retain a **derived aggregate adapter field** for this internal current-code contract, while storing true per-element roots separately. The adapter is not a substitute for individual root grades and must never be read as if it were every root's grade. Design and justify the aggregate carefully so multi-root NPCs do not receive free excessive bonuses.

---

## 4. ROOT DATA MODEL AND GENERATION

Design the cleanest data model that respects all locked decisions. The architecture document gives a recommended shape; you may improve it.

Requirements:

- Store a list of unique ordinary root element IDs.
- Store an individual grade for each root.
- Store the exact root-count trait/class.
- Store a derived world-rarity classification based on the actual count/grade composition.
- Do not treat `ASTRAL` or `BLOOD_DEMON` as ordinary roots.
- Keep root identity stable through NPC cloning and visitor-to-member conversion.
- Keep elemental mastery separate from identity and affinity.
- Ensure all required fields are deterministic and serializable.

### Generation algorithm

Do not roll root-count trait, root count, root grades and rarity title independently. Use a hierarchical process:

1. Determine root-count class using the world-scale rarity model.
2. Set exact count (1, 2, 3 or 4).
3. Select distinct elements from the eight ordinary root elements.
4. Select an allowed grade composition using probabilities calibrated to the confirmed genius rarity table.
5. Assign individual grades to elements.
6. Derive the rarity title from the composition.
7. Store the result; never reroll on load.

Use the existing deterministic world RNG and stable generation flow. Never use `Math.random()` for NPC creation or simulation.

### Root grade distribution

The old scalar grade weights and old root-count behavior cannot be copied blindly. Design a new joint distribution over root count and per-root grades. The distribution must reproduce the user-confirmed world-scale patterns after accounting for actual births per year. Test with many seeds and enough births to estimate frequencies. Document the expected interval and confidence range for each confirmed class.

### All other grade compositions

The user did not specify every possible composition. Design a complete and coherent classification for all remaining combinations. Preserve confirmed categories; explain all other tiers. A rarity class must be derived, not independently rolled.

### Aggregate scalar adapter

If protected `human_core.js` requires `h.root.grade`, define a conservative aggregate grade/quality for its scalar consumer. It must not allow a character with many low-grade roots to outrank a high-grade focused root by default. Simulate candidate aggregation formulas and report the chosen one. Keep all element-specific decisions on the per-root model.

---

## 5. ELEMENT TAXONOMY, ALIASES AND RELATIONSHIPS

Build one canonical element registry with:

- ID, display name, description, icon/color if used, category (ordinary/special/no-element), aliases, relation metadata and validation rules.
- Explicit aliases only where semantically correct.
- A strict unknown-tag state; unknown must not silently become neutral.

Audit every raw element-like field from every registry and nested object. The manifest identifies tags found in this baseline, including:

`ARRAY`, `ASTRAL`, `BEAST_TAMING`, `BLADE`, `BLOOD`, `BLOOD_DEMON`, `BODY_REFINING`, `CHAOS`, `EARTH`, `EARTH_METAL`, `FIRE`, `FIVE_ELEMENTS`, `FORGING`, `ICE`, `LIGHT`, `LIGHTNING`, `LIGHT_YANG`, `MEDICINE`, `METAL`, `NEUTRAL`, `POISON`, `SCRIPTURE`, `SOUL_DIVINE`, `SPEAR`, `SWORD`, `WATER`, `WATER_ICE`, `WIND`, `WOOD`, `WOOD_LIFE`, `YANG`, `YIN`, `YIN_SHADOW`.

Some are elements, some are skill/weapon/discipline tags, and some are ambiguous legacy tags. Do not assume every value found in a property called `element` is semantically a birth element. Classify in context.

Design two independent relationship models:

1. Efficacy: root element versus technique/content element (match/opposition/neutral).
2. Directed learning: root element A may help learning element B, without implying the reverse or increasing combat output.

Do not force a five-element cycle onto eight elements without a justified lore/mechanics model. Special elements require their own access rules.

---

## 6. CONTENT AUDIT — EVERY RELEVANT ID, NOT A HANDFUL OF EXAMPLES

Use `AUDIT/CONTENT_AUDIT_MANIFEST.json` as an initial checklist. Rebuild it and audit all current IDs from every relevant registry, including:

- Main techniques and mantras.
- Legendary techniques, legendary mantras and all 11 legendary weapons.
- Martial skills, passive techniques, innate techniques and technique curricula.
- Main paths and every subpath.
- Weapons, armor, accessories, artifacts and crafted equipment.
- Materials, consumables, pills, recipes and relevant crafting tools.
- Traits, root-related traits, constitutions, bloodlines and generated traits.
- Beasts/bosses/rare organs/world content if they have elemental behavior.
- Any future content registry that contributes element, affinity, equipment or combat behavior.

For each ID, create an explicit record with:

- Stable ID and current display name.
- Registry/source path and content category.
- Existing intrinsic element tag(s), if any.
- Final canonical classification: single, weighted multi-element, link-only, special, explicit non-elemental or unresolved.
- Explicit weights for multi-element content.
- Element links/synergies separated from intrinsic nature/damage.
- Existing weapon/armor type and hard requirements.
- Root interaction policy and actual gameplay effect.
- Affinity/mastery/technique-mastery interactions.
- Existing unique effect IDs, `fxKind`, passive family, UID/provenance requirements and hook locations.
- Whether it is spawnable, learnable, equipable, read-only or hidden behind access conditions.
- Rationale and evidence from source.

Do not force every content item to have an element. Explicitly classify non-elemental items as such. Do not silently leave unknown records unclassified.

### Creative content redesign is authorized

The user explicitly allows you to create and improve content beyond the initial proposal. You may:

- Rename techniques or equipment when the new name better matches the actual weapon type, element, path, subpath, mechanics and signature identity.
- Redesign moves, damage/control/support profiles, costs, cooldowns, requirements, progression, descriptions and effects.
- Give a technique the correct weapon type and element when justified by its lore and mechanics.
- Give a non-elemental weapon no element when that is more coherent.
- Create specific interactions between a weapon and a technique without making every item generic.

Example only: if a technique is a sword art with a Fire theme, it might be redesigned as a named Fire sword art, with `weaponTypes: ['SWORD']`, a coherent fire effect profile, move descriptions and NPC preference. Do not apply this example mechanically to every record.

For each meaningful rename or redesign, explain why the previous content was incoherent or underdeveloped, why the new design is better, and how it affects balance and existing IDs/references.

Do not use keyword replacement as a substitute for design. A name, element, weapon requirement, combat profile, effect hook and NPC decision logic should describe one coherent technique/item.

### Preserve legendary identity

Every legendary weapon and technique must retain its own signature identity and unique effect. Do not genericize all legendary equipment into the same elemental stat bonus. Preserve or deliberately improve its `effectId`, `fxKind`, proc behavior, UID, uniqueness/provenance and actual runtime execution. If a new effect requires engine support, implement and test the real handler.

---

## 7. COMBINED ROOT / AFFINITY / MASTERY / TECHNIQUE / EQUIPMENT CALCULATION

Create one authoritative compatibility resolver or a demonstrably better design. Do not place separate, slightly different formulas in `cultivation.js`, `martial.js`, `skills.js`, `combat.js` and AI.

Keep these dimensions independent:

1. Base formula of the path/technique/item.
2. Root composition and per-root grade.
3. Root efficacy relation (match/opposition/neutral).
4. Existing elemental affinity value in `h.affinities`.
5. Elemental mastery (new, trained).
6. Technique-specific mastery `n.cult.tm` (existing).
7. Existing equipment-type compatibility (`SWORD`, `BLADE`, `SPEAR`, `BOW`, `STAFF`, `FOCUS`, armor type, etc.).
8. Existing path/subpath/body/passive/trait synergies.
9. Item quality, durability, price, availability and hard requirements.
10. Unique weapon/technique effects.

Rules:

- A matching root uses that specific root's grade.
- An opposing root uses a bounded opposition profile.
- A neutral relation uses the neutral baseline.
- Explicit non-elemental content bypasses root-element bonus/penalty but keeps all other systems.
- Multi-root NPCs choose the best valid relationship per target element; do not add all root bonuses.
- Multi-element content is weighted and normalized; do not grant full bonuses for every element.
- Learning relations are separate from combat efficacy.
- Unknown tags must fail visibly or be flagged; do not silently map to neutral.
- A hard equipment requirement cannot be overridden by a root match.
- A non-elemental sword technique may still benefit from sword equipment synergy.
- Do not apply the same modifier in multiple layers.

Prefer bounded additive contributions, a shared modifier budget or diminishing returns over uncontrolled multiplicative stacking. Provide a formula sheet and worked examples for at least:

- Exact root match with a `HEAVENLY` root.
- Exact root match with a `MORTAL` root.
- Opposing root.
- Neutral root relation.
- Multi-root NPC with both a match and an opposition candidate.
- Weighted two-element technique.
- Non-elemental sword technique with correct sword.
- Elemental technique with wrong weapon type.
- Legendary weapon with a signature effect and a root-compatible technique.
- Special `ASTRAL`/`BLOOD_DEMON` content with and without legitimate access.

Demonstrate that every factor is applied once and that no factor silently overwrites another.

---

## 8. ELEMENTAL MASTERY

The current source does not show a dedicated elemental mastery layer. `n.cult.tm` is technique-specific mastery and must remain separate.

If a new elemental mastery system is implemented:

- It must represent learned experience, not innate talent.
- It must progress from real successful technique use, relevant cultivation and dedicated training.
- It must not increase per hit or per target for multi-hit/area attacks.
- It must include caps, diminishing returns, event deduplication, anti-farming and time-skip safety.
- An NPC without a matching birth root may still learn mastery through accessible content/training.
- Special mastery requires special access.
- Affinity affects innate learning aptitude/preferences; root grade affects innate compatibility; mastery affects trained execution; technique mastery affects one specific technique. Do not double count.

Test mastery gains for real actions, practice, repeated spam, multi-target, multi-hit, time skip, no-root users, special-element access and save/load.

---

## 9. CULTIVATION AND PATH/SUBPATH SELECTION

Integrate the resolver into actual formulas:

- `CULT.pathScores` and `CULT.choosePath`.
- Subpath scoring and retraining evaluation.
- `CULT.rate` and cultivation progress.
- `CULT.breakthroughChance` and relevant bottleneck formulas.
- Mantra/technique selection where element profiles exist.

Rules:

- Elemental cultivation uses the relevant per-element root grade and content profile.
- Non-elemental cultivation uses a conservative aggregate fallback.
- Multi-root does not automatically make every path superior.
- Preserve the existing body, demon, god, heart-soul and xian identities.
- Keep affinity contributions, personality, interests, aptitudes, goals and subpath preferences.
- Explain score breakdowns.
- Ensure cache keys/invalidation include all relevant new fields.

---

## 10. EQUIPMENT AND TECHNIQUE INTEGRATION

The current source already contains meaningful systems. Extend the existing authorities instead of duplicating them.

Inspect and integrate:

- `M.evaluateSynergies`
- `M.skillSynergy`
- `M.skillEfficiency`
- `M.conditionMatches`
- `M.gearSuitability`
- `M.classifyGearForNpc`
- `COG.techPreference`
- `COG.evaluateTech`
- `COG.bestGearUpgrade`
- Existing `weaponTypes`, `armorTypes`, `requiresWeapon`, subpath synergy, passive loadout, path preference and legendary weapon checks.

The current game has techniques that explicitly require or prefer weapon types. Preserve this behavior. Add root/element factors as a separate, explicit contribution only when the technique or item has a justified element profile.

An item may have:

- An intrinsic element and a weapon type.
- An element link without being elemental damage.
- A weapon type but no element.
- No element and no weapon-type synergy.

Do not force a type or element onto every item.

Legendary weapons must keep their unique effects and actual combat proc execution. Root matching may improve their fit only if the metadata and design justify it. It must not erase their own identity.

---

## 11. NPC INTELLIGENCE — CRITICAL ACCEPTANCE REQUIREMENT

If the new system is not used by NPC decisions, the assignment is incomplete.

NPCs must actually consider the new information when:

1. Selecting a main cultivation path.
2. Selecting a subpath.
3. Choosing a mantra.
4. Evaluating/learning techniques and manuals.
5. Selecting active/passive techniques and loadouts.
6. Choosing a weapon.
7. Choosing armor/accessories/artifacts.
8. Choosing elemental training or practice.
9. Selecting combat actions.
10. Crafting/forging/alchemy when element-linked decisions matter.
11. Joining/developing a sect when relevant.

### Decision model

Separate:

- **Hard eligibility:** stage, prerequisites, path/subpath constraints, required weapon/armor type, access, ownership, manual discovery, resources, permissions and root-count validity.
- **Soft preference:** root compatibility, per-root grade, affinity, elemental mastery, technique mastery, personality, interests, role, aspiration, current build, risk, price and resource scarcity.

NPCs must not choose the element-matching option every time. A non-elemental or mismatched option may be better because of personality, interests, cost, availability, role, unique effects or goals.

NPCs must not be omniscient. They may evaluate content they can access, have discovered or can reasonably know. Reuse the existing knowledge/cognition/aspiration systems.

### Explainability

Expose a deterministic score breakdown containing at least:

- Eligibility result and blockers.
- Existing/base score.
- Root match/opposition/neutral result.
- Relevant per-root grade.
- Affinity contribution.
- Elemental mastery contribution.
- Technique mastery contribution.
- Weapon/armor type compatibility.
- Path/subpath/body/trait/passive synergy.
- Personality/interest/aspiration contribution.
- Access, price, risk and availability.
- Final score and human-readable reason.

The explanation must match the actual score used. Do not make up reasons after a choice.

### Behavioral tests

Create tests proving that two NPCs with different roots/personality/goals can choose different content, that an NPC may rationally choose a nonmatching or non-elemental technique, and that an NPC does not use inaccessible hidden content.

---

## 12. TRAIT SYSTEM — AUDIT ROOT-RELATED LEGACY TRAITS

The source contains root-related names that must not be interpreted by their names alone. At minimum inspect:

- `TR_IN_FIVE_SPIRIT_ROOT`
- `TR_IN_CRIPPLED_ROOT`
- The 20 generated `TR_GEN_10_*` root-qi traits from the proc-trait generator.
- All other traits/bloodlines/innate traits that affect elemental affinity, cultivation, meridian capacity, combat, weapon skills or elemental effects.

In the inspected source, `TR_IN_FIVE_SPIRIT_ROOT` and `TR_IN_CRIPPLED_ROOT` currently apply modifiers and conflict with each other; they do not directly implement the new exact 1/2/3/4 root-count rule. The `TR_GEN_10_*` family contains root-themed innate traits but must be audited as actual trait mechanics, not assumed to be root-count traits.

Design a clean distinction between:

- Root-count capacity trait/class.
- Per-element root grade.
- Ordinary innate traits that modify cultivation/affinity/stats.
- Bloodline/constitution/innate effects.

You may rename or reclassify obsolete root-themed traits if it improves coherence, but preserve or deliberately redesign their real gameplay effects and explain the rationale. Do not leave old “five-element root” terminology contradicting the new root-count system.

---

## 13. CHARACTER UI — SHOW THE WHOLE SYSTEM CLEARLY

Update the character profile with:

### Overview

- Root count trait/class.
- Each active root and its own grade.
- Rarity classification (clearly separated from combat power).
- Current cultivation path/subpath compatibility summary.

### Affinity display

- Show all 8 elemental affinities together.
- Show all 15 non-elemental aptitudes/disciplines separately.
- Read from the same `h.affinities` object.
- Do not show only the top 10.
- Preserve the screenshot's readability goal, but improve information hierarchy and mobile layout.

### Element tab

- Root composition and individual grades.
- Ordinary elemental mastery.
- Special mastery/access, if implemented.
- Directed learning relations.
- Current path/subpath/technique/equipment compatibility breakdown.
- Exact active bonuses and penalties, with a clear indication of source.
- Explain when content is explicitly non-elemental and therefore unaffected by roots.

No horizontal overflow on small mobile screens. No hidden/truncated data without pagination or an explicit “show more” mechanism.

---

## 14. EDIT HUB — FIX DISCOVERABILITY AND ADD ROOT EDITING

The baseline audit found:

- Runtime `EDITOR.catalog()` returns 1,102 descriptors.
- The UI renders only `catItems.slice(0, 60)` with no pagination.
- 22 legendary manuals/arts are in the catalog, but their first position is around index 857; zero appear in the first 60.
- Search by `Legendary` returns 0 because search does not include grade/rarity/effect fields.
- Search by `LEG_` returns 22.
- All 11 legendary weapons exist in `VC.LEGENDARY_WEAPONS` and can be minted through the equipment spawner path, but none is present as a catalog descriptor.
- Character Edit Hub has no dedicated root composition/per-root grade/mastery editor.

Fix these comprehensively:

1. Registry-driven catalog coverage, not manually maintained one-off lists.
2. Include all 11 legendary weapons and all 22 legendary techniques/mantras.
3. Search across ID, display name, aliases, kind, rarity/grade, tier, effect ID, effect description, source and element metadata.
4. Pagination or virtualization; no silent 60-item cutoff.
5. Clearly distinguish discoverability from spawnability/learnability/equipability.
6. Preserve legendary UID/provenance/unique-world behavior.
7. Add root-count trait, root composition, per-root grade and mastery editor.
8. Validate exact count and unique elements; reject invalid combinations.
9. Preview downstream effects and AI/equipment reconciliation.
10. Commit/undo with cache invalidation and audit log.
11. Add an automated coverage test that enumerates every current registry and asserts every entry is discoverable or explicitly excluded with a reason.

Do not turn a “spawn manual” action into direct learning. Separate manual ownership, learning/unlocking, passive equip, mantra selection and mastery adjustment.

---

## 15. WORLD RARITY AND BALANCE SIMULATION

Implement the rarity table in `DESIGN/ROOT_GENIUS_RARITY_RULES.md` exactly for all confirmed categories.

Use the actual game's birth rate. If the simulation produces N NPC births per world-year, the per-birth probabilities must yield the intended world-scale intervals. Do not hardcode a per-NPC probability without measuring births/year.

Required simulation:

- Many independent world seeds.
- Long-run birth generation sufficient to estimate rare categories.
- Observed frequencies and confidence intervals.
- Counts by root count and grade composition.
- No hard unique cap for Fourfold All-Heavenly characters.
- No rarity-based automatic power multiplier.
- Tests for deterministic repeatability with the same seed.

If an extremely rare class is too improbable to observe in a practical simulation, use analytical probability checks plus a controlled test RNG to validate the classification path; do not falsify the natural frequency.

Balance the actual gameplay effects separately from rarity. Compare one-root Heavenly, two-root mixed, two-root double-Heavenly, three-root, and four-root low-grade builds.

---

## 16. EDITORIAL AND GAMEPLAY QUALITY BAR

The user explicitly authorizes independent design decisions beyond the examples discussed. You may:

- Create better root names, trait names, element lore, special interactions and mastery progressions.
- Rename individual techniques/equipment to better match their actual type, element, moves and effect.
- Rework stats and signature effects when the current content is incoherent or underdeveloped.
- Add new items/techniques if a real content gap exists.
- Improve UI information architecture.
- Improve the NPC's decision logic beyond the minimum list.

But:

- Do not create content merely to inflate counts.
- Do not add new duplicate systems.
- Do not assign elements mechanically by keywords.
- Do not give every item a unique effect if it does not need one.
- Do not make every legendary item a simple damage multiplier.
- Do not silently change user-confirmed root count, element taxonomy or rarity rules.
- Every material design change must be explained in the report.

---

## 17. TESTING AND ACCEPTANCE — DO NOT CLAIM SUCCESS WITHOUT EVIDENCE

Use `AUDIT/ACCEPTANCE_TEST_MATRIX.md` and extend the existing test suite.

At minimum test:

### Root structure

- Default one-root NPC.
- Dual exactly two roots.
- Triple exactly three roots.
- Fourfold exactly four roots.
- Duplicate elements rejected.
- Conflicting count traits rejected.
- Trait change/undo and exact-count validation.
- All five root grades on individual roots.
- Special elements cannot be ordinary birth roots.

### Compatibility

- Match, opposition and neutral.
- Single-element, weighted multi-element, link-only, special and explicit non-elemental.
- Multi-root best-match behavior with no additive stacking exploit.
- Unknown tags flagged, not silently neutralized.
- Affinity/mastery/root grade not double-counted.
- Equipment type and root compatibility combine independently.
- Hard equipment requirements remain hard.
- Unique effects execute once.

### Cultivation and combat

- Relevant root changes elemental cultivation rate/technique performance as designed.
- Non-elemental content is not accidentally changed.
- Multi-hit/multi-target mastery gain is deduplicated.
- Breakthrough formulas remain bounded.
- Status riders and control effects are applied once.
- Existing legendary weapon behavior remains intact.

### NPC intelligence

- Path/subpath selection uses root/affinity/personality/goals.
- Technique choice uses actual compatibility.
- Equipment choice uses root plus existing weapon type and build.
- NPC can choose nonmatching/no-element option for a rational reason.
- NPC cannot select inaccessible hidden content.
- Score explanation equals actual score.
- Training/mastery changes only from real actions.

### UI/Edit Hub

- All 23 affinities displayed in 8+15 groups.
- All active roots and grades visible.
- Mobile no horizontal overflow.
- All 11 legendary weapons and all 22 legendary manuals/arts discoverable.
- Catalog pagination/search covers all records.
- Root edits preview, commit, undo and invalidate caches correctly.

### Save/new-game

- New schema only; no old-save compatibility required.
- New-game generation deterministic.
- Save/load round trip.
- Repeated load does not reroll.
- NPC cloning and visitor join preserve root identity.
- New-schema corruption/validation handled safely.

### Regression/performance

- Run all relevant existing regression suites.
- Update tests that only enforce old-save compatibility; do not delete unrelated coverage.
- Syntax-check all JavaScript.
- Verify standalone HTML has all required inline/runtime code and can start a new game/save/load.
- Test mobile viewport sizes (at least 360×800, 800×360, 1280×800) and check overflow.
- Profile NPC decision overhead and high-speed simulation; avoid recomputing expensive resolver outputs unnecessarily.
- Preserve deterministic RNG and test replay determinism.

Never write “all tests pass” unless the full runner completed successfully and the report includes the exact command, totals, failures and environment. Distinguish full-suite verification from focused suites and headless browser checks.

---

## 18. REQUIRED IMPLEMENTATION PHASES

### Phase 0 — Verify active source and baseline

- Inspect branch/commit/dirty state.
- Compare active source with package baseline.
- Confirm source hashes and protected core.
- Rebuild content inventory from current registries.
- Produce exact call graph and findings.

### Phase 1 — Freeze architecture

- Design root schema, root-count trait system, per-root grades and aggregate adapter.
- Design canonical element/alias registry.
- Design efficacy and directed-learning matrices.
- Design mastery schema and progression.
- Design modifier aggregation and formula budget.
- Design complete rarity probabilities against actual births/year.
- Document examples and trade-offs before implementation.

### Phase 2 — Content classification and redesign

- Audit every relevant ID.
- Classify every record explicitly.
- Review legacy tags and root-related traits.
- Rename/rework content where it improves coherence.
- Preserve unique legendary identities/effects.
- Build complete registry and coverage report.

### Phase 3 — Root generation and shared resolver

- Implement deterministic exact-count root generation.
- Implement per-root grades and rarity classification.
- Implement root capacity traits.
- Implement the central element/profile/compatibility resolver.
- Add isolated unit/property tests before wiring gameplay.

### Phase 4 — Gameplay integration

- Integrate cultivation, breakthrough, path/subpath scoring.
- Integrate techniques/mantras/combat.
- Integrate equipment suitability and existing weapon-type synergy.
- Integrate mastery progression and anti-farming.
- Ensure unique effects and special elements work.

### Phase 5 — NPC intelligence

- Integrate all relevant COG/MARTIAL/CULT/AI decision pipelines.
- Add bounded knowledge and explainable scoring.
- Test divergent NPC behavior across personalities and roots.

### Phase 6 — UI and Edit Hub

- Group all 23 affinities 8+15.
- Add root/grade/rarity/mastery view.
- Add compatibility breakdown.
- Add validated root/mastery editor.
- Fix catalog pagination/search and legendary discoverability.

### Phase 7 — Balance, QA and packaging

- Run long-run/multi-seed rarity tests.
- Run formula balance simulations.
- Run regression, syntax, standalone and mobile tests.
- Update source HTML, docs, manifest, reports and handoff.
- Produce a clean output package and precise test report.

Do not stop after a phase merely because a response is long. Continue work and preserve the state in reports/commits so the project can proceed safely.

---

## 19. FINAL DELIVERABLE FORMAT

Deliver a complete implementation package containing:

- Updated game source tree.
- Updated standalone HTML.
- Updated tests and test outputs.
- Updated root/element/trait/mastery registries.
- Complete per-ID content audit manifest and change map.
- Formula and balance report with worked examples.
- Root genius rarity simulation report.
- NPC AI integration report with before/after decision examples.
- Edit Hub coverage report.
- Save schema description (new schema only; explicitly state old saves are unsupported).
- Updated README, HANDOFF and roadmap.
- A concise summary of files changed and any known limitations.

The final report must answer:

1. What systems already existed and were reused?
2. What new systems were actually added?
3. Which old structures were replaced or retired?
4. How are root count and per-root grade represented?
5. How do roots, affinities, elemental mastery, technique mastery and equipment type combine mathematically?
6. How does each NPC decision pipeline use the new information?
7. How many content IDs were audited, and how many are elemental / multi-element / link-only / special / explicitly non-elemental / unresolved?
8. Which techniques/equipment were renamed or redesigned, and why?
9. How are legendary weapons and unique effects preserved?
10. How is rarity calibrated to births/year?
11. What tests were run, exact totals and failures?
12. What changed in the save schema and what old compatibility was intentionally dropped?
13. What deviations from this design did you make, and why?
14. What remains for the next developer?

## FINAL DIRECTIVE

Be rigorous, creative and independent. Do not simply implement the example values or copy the proposal. Inspect the real game, reason about its full architecture, design each content record deliberately, test actual gameplay outcomes, and choose the best coherent implementation. You may go beyond this prompt when the improvement is justified. Preserve every user-confirmed design decision, explain every important deviation, and do not report unverified success.
