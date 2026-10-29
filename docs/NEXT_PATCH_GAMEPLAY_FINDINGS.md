# Gameplay findings for the next patch — 2026-10-29

Status: planning backlog, not an instruction to start another patch. Based on main-1 at `9f62bb5` and the subsequent Codex bug audit. Keep personality-dependent, sometimes imperfect choices. Keep world rank based only on attained cultivation stage. Never compensate for weak equipment by downgrading encounter pools.

## Highest priority: personal production and economic incentives

1. **Keeping ingredients is technically possible but does not emerge reliably.** In the audited 360-day seed, all 10,368 gathered units were donated; zero gathering completions retained ingredients. The controlled learned-recipe retention test passes after the bug fix. `gatherWildResource.done` still requires a personal recipe, ALCHEMY >=20, wealth greater than loyalty, and a 55% roll. It does not consider an injured member's immediate need, an almost-complete recipe, ingredient replacement cost, planned sales, or whether sufficient medicine is already owned. Extend the existing personal crafting planner to value those situations. Allow loyal members to keep enough for a real plan and selfish members to donate when they want points. Do not force a retention quota or give every NPC recipes.

2. **Measure CP purchasing power, not just the number of transactions.** The same run minted 45,449.5 CP and burned 20,034 CP; living members held 13,744.7 CP at day 360. Mean holdings grew from about 135 CP at day 30 to 416 CP at day 360, with population growth and retirement also affecting the totals. This is a warning to investigate, not proof of price inflation: `CPE.daily` already adjusts its price index and the run did not record that index. Add price index, median holdings, affordability of basic medicine, welfare volumes, reserve shortages, external trade, and craft margins to the same multi-seed report before changing payouts. Prefer demand-based procurement/wages and useful voluntary spending to simply deleting accumulated CP.

3. **Basic gathering can crowd out progression and exploration.** Its score gives cultivation beginners a fixed +1.4 bonus, plus +0.6 for CP, before interests/shortages. AI selection only considers its top six actions. The 360-day seed produced 31 fortune trips and 19 realm trips, all with departure rank 1. That does not prove higher-rank pools are broken: controlled rank tests pass. Record activity time budgets, cultivation stages, reasons for blocked actions, shortages, and travel approval rates across several seeds. Reduce unnecessary work when reserves are full, while allowing poor or labor-loving NPCs to keep preferring it. Do not make everyone maximize cultivation or force expedition quotas.

## Exploration identity and difficulty

4. **The twelve worlds mostly differ in names rather than ranked gameplay.** `explore.js` constructs the same encounter/loot templates for each rank in all worlds, with different area labels and a world relic. Each rank has one shared table rather than multiple distinct subpools. Add at least two biome-specific subpools per rank/world, with different hazards, materials and relevant skills; select a subset per trip. Preserve the committed rank and replay-safe settlement. Ice, machinery, fungi and nightmare worlds should reward different preparations.

5. **Only fights fully use rank-calibrated difficulty.** Realm fights use `RANK_FOE_POWER`, but hazard, gathering, lore and trial checks still receive `world.d`. A rank-1 traveler in `godwar` faces `d=4.5` checks while rank 4 in `fungi` receives `d=1.6` checks. Decide how rank and local biome modifiers combine for every encounter type. Keep fixed rank-based base templates and modest world variation; do not scale them to live character power.

6. **Fortune proficiency checks have a discontinuity.** When herbalism is exactly zero, the current fallback can contribute `interests.herbs * .6`; at herbalism 1, that fallback disappears and the check becomes 1. A tiny improvement can therefore make a character worse. Rank-4 attribute trials also compare at most 70 from a 100-point attribute against difficulty 85–90, whereas actual proficiency trials can contribute up to 100. Use a monotonic proficiency + attribute formula and calibrate success/retreat probabilities by rank. Interest should influence choosing/preparing for an activity, not replace learned competence wholesale. This is intentionally deferred as a balance/formula change.

7. **Site choice overuses the first matching biome.** `EXPED.depart` chooses `sites.find(...)`, so equal-biome sites do not get equal consideration. Some sites use biome `ruins`, while the ruins region has terrain `mountain`. They remain reachable through the fallback, but theme matching is inconsistent. Use explicit region/biome tags and weighted site selection, then commit site/pool once. Give NPC preferences, memories, supplies and goals a role without changing the rank bracket.

## Outdoor ecology and gathering

8. **Manufactured flags can grow out of the ground.** The current OTHER resource pool includes both `MAT_FORM_SPIRIT_INK_SAND_2` and `MAT_FORM_BLANK_ARRAY_FLAG_2`. Spirit sand is plausible; a prepared blank formation flag should normally be crafted, traded or recovered from ruins. Introduce explicit acquisition tags such as `natural`, `processed`, `huntOnly`, `salvage`, rather than inferring acquisition solely from inventory category. Audit recipes and external trade when changing sources so no ingredient becomes unobtainable.

9. **Gathering proficiency has a sharp threshold.** Node gathering lasts 60 minutes for everyone. Only skill >=45 unlocks the same 35% chance to extract two remaining units, so levels 1 and 44 have identical harvest efficiency, as do 45 and 100. Apply bounded, gradual skill/life-path modifiers to action duration and extraction efficiency. Always deduct actual units; never create extra units from an exhausted node. Measure novice CP/hour against mining, crafting and dangerous hunting.

10. **Spatial supply needs a longer-term model.** The hotfix reserves eight of the existing 48 node slots for the safe belt, fixing a reproduced lockout caused by dangerous nodes filling every slot. This intentionally changes the *realized* successful-spawn mix once dangerous zones saturate: the 360-day run had about 88% basic herbs, although unconstrained category attempts still use the 70/15/12/3 weights. A later patch can use per-zone budgets, seasonal herb renewal and persistent ore deposits. Do not casually despawn owned/claimed resources, erase personal inventories or increase global caps to hide bottlenecks.

11. **Wildlife refill is not a meaningful pack encounter yet.** Batches of 1–3 work, but mostly replace a single vacancy: the audited run observed 429 single, seven double and two triple refills. This is reasonable population maintenance, not evidence that encounters have pack tactics. If adding packs, give them explicit grouping, readable danger and shared engagement rules, with the same caps and one hourly legendary roll. Keep creatures out of the sect and preserve the safe gathering approach.

12. **Empty species pools can lose their habitat identity.** `WILD.spawn` can fall back from an empty named species pool to other valid terrestrial species in the zone. This avoids a dead spawn but can make the named pool misleading. Validate catalog coverage and either skip the empty pool or use an explicit thematic fallback. Keep aquatic restrictions and legendary rarity intact.

## Validation expected before implementing these ideas

- Run several native seeds, including young/old sects and controlled rank-2/3/4 parties. Report zero-event metrics honestly; a zero is not proof of correct behavior.
- Capture physical material ownership, production, welfare, purchases, consumption, external sales/imports, prices and NPC activity budgets together.
- Preserve deterministic seeded RNG, finite units, stage-only rank, personality choices, expensive retraining, browser performance and the `human_core.js` byte lock.
- Treat these as proposals. Choose a coherent subset for the next patch and document the resulting behavior rather than mechanically implementing every bullet.

Evidence: [360-day metrics](../JianghuSect_v1.10/test/results/outside_audit_360d.json), [audit report](../JianghuSect_v1.10/docs/BUG_AUDIT_2026_10_29.md).
