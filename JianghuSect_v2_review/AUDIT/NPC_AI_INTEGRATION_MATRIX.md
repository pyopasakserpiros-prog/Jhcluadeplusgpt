# NPC AI Integration Matrix — Existing Authorities to Extend

This matrix identifies the actual decision authorities in the inspected main-1 v1.12.4 source. Gemini must verify the current call graph before editing, especially if its active branch is newer.

| Decision / activity | Existing code authority | Current evidence | Required elemental integration |
|---|---|---|---|
| Initial root generation | `HC.generate` via `SIM.buildNpc` and visitor creation | `h.root.grade` scalar and old `h.root.elements` generated in `human_core.js` | Exact 1/2/3/4 root-count class, distinct ordinary roots, per-root grades, derived rarity; preserve deterministic RNG and protected-core contract |
| Applicant generation | `SECT.rollApplicantTier`, `SECT.TALENT_TIERS`, `SIM.buildNpc` | Applicant tier selects a scalar rootGrade and passes it into `HC.generate` | One unified world rarity/root generation model; applicant quality must not bypass the rarity rules |
| Cultivation main path | `CULT.pathScores`, `CULT.choosePath`, `CULT.awaken` | Uses body/qi/faith/demon/soul aptitude, affinities, subpath preference and weapon skill fit | Add root/profile relevance and explainable score terms; preserve personality, interests and non-elemental builds |
| Subpath choice | `CULT.pathScores` and `CULT.choosePath` | Each subpath gets a score from its affinity and personality preferences | Add root/element profile and mastery without letting roots dominate all other factors |
| Retraining | `retraining.js` | Uses `CULT.pathScores` delta, intent, and gear suitability | Ensure root-aware path scores and gear evaluation are consistent during retraining |
| Mantra selection | `CULT.bestMantra` | Filters by path/tier/unlock, then sorts tier and power | Evaluate fit using root, element, affinity, mastery, role, personality and access; do not blindly choose highest tier |
| Initial technique loadout | `SIM.awaken` | Chooses candidates using tier/power/subpath preference | Use same technique evaluator as later NPC learning; avoid a separate inconsistent score |
| Technique learning | `COG.techPreference`, `COG.evaluateTech` | Evaluates role, technique profile, passive family, weapon conditions and mastery capacity | Add root grade, element profile, affinity and elemental mastery; return actual score breakdown |
| Long-term scripture goal | `cognition.js` goal planning | Evaluates eligible library techniques and affordability forecast | Select using root-aware evaluator while respecting library access, cost and goal continuity |
| Gear upgrade | `COG.bestGearUpgrade` → `M.gearSuitability` | Looks at personal bag, sect stock/shops and upgrade delta | Add explicit element-link/root fit; preserve item type, path, skills, unique effects, durability and price |
| Gear acquisition / purchase | `cpeco.js` | Calls `M.gearSuitability` and `COG.techPreference` | Ensure procurement score equals NPC's actual suitability and affordability |
| Active/passive technique setup | `M.activeTechs`, `M.activePassives`, `M.reconcilePassives` | Existing path/subpath/tier/slot/family constraints | Elemental compatibility can influence selection, but not override hard requirements or passive slot/family constraints |
| Combat action choice | `combat.js` `chooseSkill()` | Uses `SK.list`, cooldown, qi, `M.skillEfficiency`, `M.skillSynergy`, tactical state, mastery and target state | Add elemental compatibility once to action scoring and execution; do not double apply in `chooseSkill` and `useSkill` |
| Combat execution | `combat.js` `useSkill()` and `skills.js` | Applies efficiency, synergy, damage/heal/shield/DOT/status and effects | Apply the final elemental modifier once; preserve `SK.ELEM`, status riders and unique procs |
| Skill practice | `M.pickSkillPractice`, `AI.ACTS.skillDrill`, `M.skillPractice` | Uses interests, skill deficit, role, equipped weapon and practice | Add elemental training choices where meaningful; mastery progression only from actual practice/use |
| Teaching | `AI.pickTeachSkill`, `proficiency.js` | Chooses a skill based on teacher/student skill gaps and affinities | Use directed learning relations only for relevant elemental learning; keep skill training distinct |
| Crafting / production | `cpeco.js`, `economy.js`, `proficiency.js` | Recipes, craft path, material access and production aptitude | Add element links only for materials/tools/recipes that explicitly support them; no forced element on all recipes |
| Knowledge / subpath lore | `knowledge.js` | Uses `CULT.pathScores` to estimate relevance | Surface root/element relevance only for discovered/known content |
| Visitor to member flow | `visitors_clues.js`, `HC.generate` and joining code | Visitor creation calls `HC.generate(...).h` | Ensure `h.root` identity data survives visitor snapshots and conversion to member |

## NPC knowledge boundaries

NPCs must only use information they can access, discover or reasonably infer. An item being present in a global registry does not mean every NPC knows it exists. Keep the existing library, inventory, knowledge and cognition constraints.

## Decision-score design

The same central resolver must be called by the authorities above. It should return a breakdown that the caller can add to its score without recomputing different rules. Required fields:

- eligibility / hard blockers
- base score
- content element profile
- root relation and relevant per-root grade
- affinity contribution
- elemental mastery contribution
- technique mastery contribution
- weapon/armor type contribution
- path/subpath/body/trait/passive synergy
- personality/interest/goal/role contribution
- access/cost/risk/availability contribution
- final score and reason text

Do not allow the UI explanation to be a post-hoc guess. It must reflect the exact score used by the decision.
