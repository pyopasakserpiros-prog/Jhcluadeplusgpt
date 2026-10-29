# Authorized Gemini 2.8 implementation task: World Ranks, Outdoor Resources, and Wildlife Batches

## 0. Execution contract

The user authorizes you to implement this task autonomously, make reasonable design decisions, extend it with useful ideas, test it, document it, and push the completed change to **main-1**. Do not stop after producing a proposal or ask the user to repeat this prompt. Preserve main. Never force-push, discard another agent's changes, or edit the byte-locked js/human_core.js.

Use the existing workspace. Inspect git status, branch and HEAD first. Fetch only to check actual remote divergence; do not clone, repeatedly sync, create sync scripts, or schedule timers for ordinary short commands. Never reset --hard or clean -fdx. The inspected baseline is fee0026 on main-1, v1.10.12 with the ecology fixes. The previous 80-beast/160-material/80-recipe expansion and healing/poison/aquatic/market fixes already exist: do not implement them again.

Deliver three connected subsystems:
A. An integer **world rank** derived only from attained cultivation stages, selecting outdoor fortune-site and Myriad Worlds encounter/reward pools.
B. Finite herb/ore/natural resource nodes physically spawning outside the sect walls. Basic recovery-pill ingredients are the most frequent. Members physically harvest into personal inventory, then choose donation or retention/crafting. Donations fund real basic-pill production, allocation, sales and use.
C. Ordinary wildlife can spawn several individuals per refill, with bounded population and unchanged legendary rarity.

The latest user clarification is binding: **basic herb collection is an easy, safe, low-contribution-point job**. Members decide whether to donate or keep ingredients to craft. Do not make this routine job require a battle, random injury roll, or a risky excursion. It is an accessible economic role for weak/new members, not a high-profit or forced-sacrifice activity.

## 1. Read only the relevant existing code

Paths below are relative to JianghuSect_v1.10/:

| Source | Existing responsibility / integration trap |
|---|---|
| js/cultivation.js | PATHS/maxStage, getFunctionalMetrics, major stages and independent specialization track. Existing band is not the new shared world rank. |
| js/expedition.js | REGIONS, depart/resolve/fortuneEvent; currently filters regions with maxStage and sometimes minPower. |
| js/explore.js | 12 WORLDS; one world opens per portal period; tryVolunteer/depart/resolve/runEnc/lootRoll. Existing d is encounter difficulty, not world rank. |
| js/content.js | chooseRegion/site/resources/fortune; imported expansion registries are captured during module initialization. |
| js/wildlife.js | zones, spawn(W,zoneId,poolId,opts), tick; global active cap12, ordinary soft target10, currently one refill then break; legendary roll0.002 per game hour. |
| js/world_map.js | Actual wall bounds, grid, blocked/nearestFree/findPath; inspect signatures. A free tile is not necessarily reachable. |
| js/ai.js / cognition.js / cpeco.js | Actions/pathing/interruptions, needs/personality, personal materials, donations, CPE.reward/target, brewBasic, welfare and pill consumption. |
| js/economy.js | Catalog lookup maps, stock/quality, transactional craft reservations/refunds and private crafting. |
| js/proficiency.js / martial.js / retraining.js | Shared skill reads/practice, derived identity bonuses, costly retraining; do not mutate HC to add skills. |
| js/external_market.js | Real stock, demand, wallets and reserves; do not sell required medicine ingredients away. |
| js/render.js / ui.js | Canvas rendering, picking, information panels, logs and performance. |
| data/data_cp.js | JD.CP.BASIC and RECOVERY: authoritative basic-pill ingredients. |
| data/data_ecology.js | Existing beasts/materials/recipes; reuse valid content before inventing IDs. |
| index.html / test/load.js | Browser and Node loader order must agree. |
| tools/build_single.js / package_release.py | Rebuild offline artifact, update dependencies/count/version/required deliverables. |

Read HANDOFF.md and current martial/ecology docs. Use rg and small Node catalog summaries; do not dump entire minified catalogs. No new engine, heavy dependency, external LLM calls during gameplay, or copied source runtime. Write a task ledger and update it so work can resume without rediscovery.

## 2. World-rank specification: separate advancement from actual strength

### Binding user requirements
- Rank is based on **attained cultivation stages only**. Ignore cultivation progress within a stage, equipment, combat power, body stats, HP, buffs, techniques and skills when calculating rank.
- A high-rank weak character still encounters high-rank content. Poor equipment does not silently grant lower-rank pools. Combat strength determines outcomes, not rank/pool eligibility.
- Rank output is an integer. Fractional comparison values are internal only.
- Round down unless the fractional part is **strictly greater than 0.75**. This follows the user's wording “greater than 2.75”: 2.74->2, 2.75->2, 2.750001->3, 2.8->3. Do not use >= or floor(raw+0.25).

### Concrete defaults selected by Codex under the user's delegated authority

These defaults are implementation decisions, not a claim that the user supplied this exact formula:
- Use a common rank range1..4. The current shortest major path has4 stages; align each path's first/last attained stage with ranks1/4. Mortals without cult have rank0.
- Read the real catalog counts: currently XIAN9, BODY5, GOD4, DEMON9, HEART_SOUL9. Do not hard-code a remembered statement that XIAN has8.
- The rank authority is cult.stage of the current major path. Independent track.ordinal can retain its existing effects but does not add rank or replace major-stage rank. First specialization acquisition without changing major stage must not demote a character.

```
S = current path's maximum attained major-stage count
s = attained integer major stage, 1..S
raw = S > 1 ? 1 + (s-1)*3/(S-1) : 1
rank = clamp(floor(raw) + (fraction(raw)>0.75 ? 1 : 0), 1, 4)
```

Prefer rational integer arithmetic: numerator=(S-1)+3*(s-1), denominator=S-1; quotient=floor(numerator/denominator); round upward iff 4*remainder>3*denominator. Handle S=1 separately. Avoid floating-point boundary accidents. Invalid path/stage data must produce an explicit invalid result handled by callers, not a powerful fallback.

Expected tables:
| Path | Attained stages | World ranks |
|---|---|---|
| XIAN/DEMON/HEART_SOUL | 1,2,3,4,5,6,7,8,9 | 1,1,1,2,2,3,3,3,4 |
| BODY | 1,2,3,4,5 | 1,1,2,3,4 |
| GOD | 1,2,3,4 | 1,2,3,4 |

Add one authoritative API, e.g. CULT.worldRank(npc). This name is proposed and must be implemented; do not pretend it already exists. Do not silently redefine getFunctionalMetrics().band: its current values are path-/track-relative and other UI/comparison callers may rely on them.

Retraining must immediately yield rank based on the reduced/reset attained stage. HP/gear/progress changes must not. Snapshot expedition ranks at departure and preserve them for that trip; changes after departure do not rewrite rolled rewards or turn an old expedition into a different rank.

## 3. Fortune sites, regions and party policy

Current ordinary fortune is mostly an event roll. Introduce a data-driven fortune-site registry: site ID/theme/biome/rank pools/encounters/reward references. Proposed metadata is not functional until consumers and validators exist.

Required policy:
1. Compute each member's rank and a departure snapshot. Party content rank = **maximum member world rank**, not maximum numeric stage, average rank or sum. Multiple members do not add ranks. A strong member cannot hide behind a weak leader to receive a safer pool.
2. Select sites/areas/pools by rank and biome. Multi-rank sites expose the matching rank pool. Commit site/pool/rank IDs to the expedition before resolving rewards.
3. Lower-rank companions remain lower-rank characters. They can refuse a dangerous invitation based on personality and actual readiness; do not label them as promoted to the party maximum.
4. Provide at least3 site themes per rank and at least2 distinct pool choices per rank, with different obstacles/rewards. A trip samples only some entries, not all entries.
5. If a rank has no valid content, reject/defer/retreat with a truthful reason. Never fall back to easier content because actual power is low.
6. Actual combat ability, injuries, supplies, relevant noncombat skills, memory, personality and policy decide willingness to travel, party composition, ways to tackle obstacles, retreat and outcomes. They must not alter the rank or substitute a lower-rank pool.

Remove maxStage/minPower filtering from the **rank-pool eligibility layer** of paths being migrated, including CONTENT.chooseRegion. A separate NPC readiness assessment may recommend not going; it may not silently reroll safer pools. Skills should offer appropriate alternative solutions: deciphering scripture, surviving traps, medicine against poison, mining through obstructions. No “all challenges are power comparisons.”

## 4. Myriad Worlds: keep12 themes, add rank-aware internal areas

Reuse the existing12 worlds rather than adding12 redundant names. Within each world add rank1..4 areas/pools: outskirts/interior/core/forbidden depths, with names/events/rewards appropriate to that world's theme. At least2 selectable pools per rank per world; templates may share structure but do not clone identical content across all worlds.

- Only the currently opened portal world is available. Preserve opening/expiry mechanics and reject closed portals.
- Pick the internal area/pool from the party rank snapshot. A rank4 poorly equipped party still faces rank4 content.
- Existing d and tides remain parameters for difficulty/outcomes after rank selection, never fractional rank labels.
- Calibrate fixed enemy/challenge reference values per rank. Existing foePower(d) produces only tens/hundreds and may not suit late cultivators in the tens of thousands. You may consult catalog values **while designing static enemy tables**, but never scale live encounters to the entering character's current power/gear.
- Party power can improve success; it cannot lower the reward/content rank. Keep travel duration/supplies/risks meaningful and prevent party-size-linear free reward multiplication.
- Keep failure, rest, retreat, hazards and noncombat events. Rank access is not guaranteed victory or guaranteed reward.
- Manuals/crystals must go through the existing shared knowledge discovery gate. High-rank entry must not bypass rare-drop limits.

## 5. Physical resource nodes outside the walls

This is the **shared on-screen map**, separate from off-map expeditions. Do not personalize local world spawns to a nearby character's rank. Basic herbs remain accessible to beginners and high-rank gatherers alike; one strong member must not upgrade every resource/monster around the sect.

### Initial tuning defaults (adjust only with recorded evidence)
- Active resource-node cap48 globally, distributed across available exterior directions, not all in one corner.
- Every120 game minutes attempt a batch of1..3 nodes if capacity remains. Use simulation time and W.rng, not wall-clock timers/setTimeout.
- Category weights:70% basic recovery-pill herbs,15% other herbs,12% ores,3% other naturally gatherable materials. Apply biome eligibility first.
- Within basic herbs: MAT_HERB_DEW_GRASS_1 weight50, MAT_HERB_CINDER_LEAF_1 weight40, MAT_HERB_JADE_LOTUS_2 weight7, MAT_HERB_MIST_ORCHID_2 weight3. Normalize eligible entries, never substitute unknown IDs.
- Starting quantity1..3 real units per node. Skill may improve collection speed or units per action, but every awarded unit must be deducted from remaining quantity. Never create bonus units beyond finite supply.
- Rare higher-tier materials remain distinctly uncommon. Do not spawn beast organs as herb bushes/ore deposits without a legitimate source. No routine-node manuals or crystals.

Verify actual basic recipes against JD.CP.BASIC:
| Recipe | Inputs |
|---|---|
| BASIC_HP | DEW_GRASS2 + CINDER_LEAF1 |
| BASIC_QI | CINDER_LEAF2 + DEW_GRASS1 |
| BASIC_VIGOR | DEW_GRASS1 + CINDER_LEAF2 |
| BASIC_WOUND | DEW_GRASS2 + CINDER_LEAF1 |
| BASIC_HP2 | JADE_LOTUS2 + DEW_GRASS1 |
| BASIC_QI2 | MIST_ORCHID2 + CINDER_LEAF1 |

Names in this table abbreviate the full MAT_HERB_* IDs, not new identifiers. Scarcity directives may increase an eligible ingredient's spawn weight by at most1.5x initially. This remains stochastic, capped and simulation-time-based. Do not refill stock when opening UI or detecting shortages. Do not weaken recipe costs just to make a report pass.

### Safe, easy, low-point basic gathering

- Place ordinary recovery herbs in a safe exterior collection belt reachable from the gate. Keep aggressive/high-tier wildlife spawn coordinates away from this belt. Enforce the exclusion in placement and aggressive wildlife wandering/chase targeting, not just a tooltip or spawn-time check. Ordinary aggressive wildlife must not cross into this collection belt or attack gatherers across its boundary. Use a shared spatial rule, not a fake immunity buff; preserve legitimate external-emergency interruption behavior.
- No random injury roll or forced combat in routine herb collection. Nearby low-tier animals remain nonaggressive under existing rules. Ores/rare resources farther away may optionally be riskier and separately advertised; do not replace the beginner-safe supply chain with dangerous gathering.
- Start with a60-game-minute gathering action per basic node (tune against actual output), low entry requirements, and real travel time. The job should produce modest contribution income through donation, below riskier hunting/advanced production at comparable availability.
- Do not mint points on pickup. Use the ordinary donation valuation of common ingredients; tune basic material rewards/output/time with evidence if this becomes the best points farm. Avoid a separate arbitrary point-minting action and avoid fragile provenance tags solely to impose a discount.
- Shared-map herb access is not restricted by the expedition world-rank system. A high-rank member may deliberately gather common herbs as a safe job.

### Placement, rendering and state

Use actual map.wall x0/x1/y0/y1 and grid bounds. Nodes must be outside walls, appropriate to terrain, not on buildings/gates/blocked tiles/wrong water tiles, and actually reachable from the exit. nearestFree alone does not establish a route. Limit placement attempts (e.g.24); if the map is full, produce fewer nodes or none, never an infinite loop or inside-wall fallback.

Suggested NEW state/schema (not an existing API):
```
W.wildResources={version:1,seq:0,nextSpawnAt:W.t+120,nodes:[]}
node={id:'wr_1',materialId:'MAT_HERB_DEW_GRASS_1',zoneId:'south_safe',
 x:...,y:...,remaining:3,claimedBy:null,claimUntil:0,spawnedAt:W.t}
```
Prefer removing depleted nodes and spawning replacements later; if using expiry/regrowth, specify and test its exact semantics. Never accumulate unlimited dead-node history. Save only bounded JSON state; derived indexes/caches should not inflate saves.

Suggested new module js/wild_resources.js with init/tick/chooseNode/claim/harvest/releaseClaim. Inspect signatures before integration. Register AI actions after AI/CPE exist and before SIM starts creating worlds. Wire browser, Node and standalone loaders identically. New catalog entries must register before economy/content maps capture them.

Render herb clumps, flowers, ore clusters and natural materials by type/color using native Canvas. No asset per material required. Support selection of actual nodes with name/remaining units/claim status; remain readable when zoomed out, do not permanently cover NPCs or the minimap. UI must not create nodes, harvest, consume RNG or advance simulation.

## 6. NPC collection, ownership and economic decisions

Add an action such as gatherWildResource. Score energy, hunger, injury, current duties, distance, safety, preferences, skills, desired contribution purchases, owned recipes/ingredients and sect shortages. Do not force all members or elders to gather continuously.

Required lifecycle:
select -> lease claim -> physically walk -> reach valid harvesting distance -> work with time/skill -> revalidate life/distance/claim/remaining -> deduct units -> add exactly those units to n.inv.mats -> release claim -> later retain/craft/donate.

- Two NPCs cannot collect the same unit. Repeated completion/harvest after interruption or reload cannot award twice. Use a one-time action receipt/context settlement analogous to existing transactional work.
- Release/expire claims on combat interruption, sleep, death, expedition departure, path failure or target change. Recover pending leases on reload without duplicate rewards or permanently blocked nodes.
- Do not grant resources when choosing a target or starting travel. Revalidate on completion; a depleted target gives no phantom resources.
- Personal inventory first, never personal plus sect stock together. Donation removes personal units, adds sect units and issues contribution exactly once through existing rules.
- Members with recipes may retain useful ingredients for themselves. Members wanting points or helping shortages may donate. Personality, ownership, recipe plans and actual demand must matter. Do not make harvesting automatically donate everything.
- If a legitimate external emergency occurs, ordinary interrupt logic still works; this is not permission to add random danger to the safe gathering job.

Existing A.forage in cpeco.js uses a grove station and credits stock directly, with contribution at completion. Clearly distinguish it from finite-node collection. It must never grant the same node's units or donation points a second time. You may retain separate existing farm/herb-garden/mine production; do not delete the established production economy unnecessarily, or claim old stationary generation is finite-node harvesting.

## 7. Close the basic-medicine loop

Outdoor supply -> personal choice -> real donation/private ingredients -> alchemy shortage/order -> real reserved inputs and occupied station -> quality-dependent output -> sect stock -> authorized allocation or contribution purchase -> actual consumption while hunting/recovering.

Use existing CPE.reward/scarcity/target, private crafting, reservations, wages, welfare authority, shop and autoUse/fightUse. Do not introduce a parallel inventory/point/consumption system. Sect-funded production may pay labor, but must not also credit personal-ingredient donation that did not occur. Personal production follows existing ownership/cost accounting.

Basic recovery production must not depend on finding rare recipe manuals. Preserve daily welfare authority (master/treasury/legitimate acting officer), policy and relationship bias. Gathering does not confer treasury allocation authority. Keep necessary reserves before external sales and respect trader stock/wants/wallets. Observe whether the new supply actually yields basic-pill production, allocation/sales and use, rather than only increasing herb stock and points.

## 8. Wildlife batch refill

Keep WILD.spawn returning one individual or failure; add a bounded batch controller calling it repeatedly instead of changing its return contract.

Defaults: ordinary refill every60 game minutes, requested batch1..3 using W.rng; preserve global active cap12 including ordinary/legendary and soft target10. If at least2 slots exist and requested size>=2 with legal space, the implementation must actually be capable of spawning>=2 in that round (remove the old early break limitation).

- Select eligible zones/pools, possibly several zones per round. If retaining zone cap2, fill several zones; if changing it, document why. Never exceed global capacity.
- Recompute/increment live counts after each successful spawn. If one slot remains, batch3 can create at most1. Placement failure produces fewer; attempts are bounded.
- Sample a subset of species, not every species in a pool. A small same-species pack is acceptable with legal separate positions.
- Legendary probability remains **one0.002 roll per game hour** when no active legendary exists, not one roll per ordinary individual. Preserve shared legendary cap1, rarity eligibility, expiry and truthful appearance/departure logs.
- Every ordinary spawn uses ordinary eligibility. No tier6+/KING_ or legendary-pool fallback leak. Preserve aquatic/land restrictions and canRaidLand fixes.
- Safe herb belt remains excluded from aggressive/high-tier placements. Multiple spawn does not mean a new auto-raid or compulsory group combat feature.
- Keep current no-double-fight/no-double-loot invariants: one NPC cannot join two fights accidentally; one beast cannot be hunted in two fights simultaneously. Preserve fighting/expiry/settlement behavior.
- Shared local wildlife uses fixed biome/zone content, never the highest sect member's world rank. Rank-selected off-map opportunities are separate.

## 9. UI and truthful logs

Display world rank separately from attained major stage, specialization rank and actual combat power. Explain stage->rank without claiming gear increases rank. Expedition panels show departure snapshot/pool and an optional readiness warning, not lower-rank substitution. NPC preparation/retreat can vary by personality.

Node panels show material/remaining/lease as appropriate. Stock/production panels can identify basic ingredient sources. Log actual gathering/donation/crafting/allocation/purchase/use and batch appearances with truthful quantities; avoid per-tick spam and unbounded histories. No exact legendary departure countdown. Maintain dismissible panels, readable360px layout, minimap and0..48x controls. Rendering must not mutate gameplay or consume simulation RNG.

## 10. Implementation sequence for a small model

1. Audit relevant APIs and state; write a brief plan/ledger and identifier registry. Separate confirmed existing APIs from proposed ones.
2. Implement/test the central rank table and snapshots first, then migrate region/fortune/world eligibility. Keep actual combat outcome calculations separate.
3. Build one vertical resource slice: one common herb -> spawn -> claim/walk/interrupt -> inventory -> donation -> real BASIC_HP craft -> stock -> allocation/purchase -> consumption. Only expand node types/rendering after it works.
4. Implement/test wildlife batches and safety exclusion with caps and one legendary roll per round.
5. Complete data-driven rank pools, NPC decisions, UI, serialization and loaders.
6. Run regressions/browser and long simulation sequentially, fix failures, document exact settings/outcomes, commit and push main-1 without force; verify remote SHA.

Useful original ideas are welcome: seasons, geology, remembered locations, cooperation, better safety checks. Use them if they improve these loops with real consumers/tests/costs. If a new feature would derail delivery, record it as a future proposal. Never override rank independence, finite ownership, common-herb priority, safe low-point work, rare knowledge or one-active-path rules.

## 11. Required behavioral tests (register new groups in run_all)

### Rank/pools
- All current path tables, integer bounds and monotonic stage mapping; raw2.74/2.75/2.750001/2.8/3.0 boundaries.
- Same attained stage with prog0/49/99%, different weapons/skills/HP/buffs/tracks gives identical rank.
- Retraining stage reset/reduction changes rank, not retained gear or skill values.
- Equal-rank different-power characters receive the same eligible pool set; outcomes/readiness can differ. Weak high rank never silently receives low pool.
- Mixed parties use max world rank, stable departure snapshot, one-time settlement before/after reload.

### Resources/economy
- Only legal reachable exterior tiles; capacity48, bounded full-map placement failure; safe herbs do not overlap aggressive spawn space.
- Seeded sampling demonstrates basic ingredients have the largest frequency, without falsely requiring each random batch to include them.
- Two competing gatherers award no more than node units; repeated completion/reload/interruption gives no duplicates; abandoned claims recover.
- Skill changes actual collection speed/units-per-action but not total finite supply. No rewards before arrival, no intrinsic injury/combat rolls for routine safe herbs.
- Gathering gives zero points; real donation removes/adds exactly once, modest reward; retaining useful ingredients can lead to private production.
- Complete real common-herb->BASIC_HP->allocation/purchase->consumption chain, respecting stations, reserves and authority.

### Wildlife
- Forced batch3 with free legal capacity yields multiple; one remaining slot yields<=1; full capacity yields0; zone/global counts stay bounded.
- Ordinary never yields legendary; legendary chance called once per hour, not per beast; active legendary<=1, expiry and aquatic eligibility preserved.
- No infinite placement, duplicate combat or duplicate loot; safe collection belt remains safe.

### Integration/performance
- Same seed and save/load preserve units/owners/leases/timers/pool snapshots and no NaN/negative quantities. UI reads do not consume RNG or change simulation.
- Browser screenshots360x800/412x860/desktop: boot, select node, close panels, pause/speed0..48x,80NPC performance without lowering existing thresholds.
- Long-run observers count node spawn/harvest/donation, ingredient stock, basic-pill production/distribution/purchase/consumption, batch sizes and fortune/world rank-pool histograms. Do not report only old SRC110_ counters.

Suggested commands from the game folder (new test filenames are proposed and must be created):
```
node test/world_rank.js
node test/wild_resources.js
node test/wildlife_batches.js
node tools/build_single.js
node test/run_all.js
```
Inspect the actual argv parser in test/long_ecology_simulation.js or test/long_simulation.js before invoking it; do not guess CLI flags. Run at least90 complete native days, preferably360, report seed/population/invariants and observed activity. Separate controlled rare-path tests from naturally observed outcomes; do not inflate drop rates or force events to manufacture a flattering report.

Playwright/Chromium may need environment setup. Use a supervised HTTP server that survives the entire suite, not a player runtime dependency. If browser tooling is unavailable, report the block instead of marking PASS. Do not run CPU-heavy long simulations concurrently with performance benchmarks. Viewport emulation is not physical-phone verification.

## 12. Release criteria

- Working A/B/C code/data with tests, loader dependencies and rebuilt single file; correct runtime version/script counts/required package files.
- JianghuSect_v1.10/docs/OUTSIDE_RANK_RESOURCES.md: actual rank table, threshold, party policy, pool schema, placement/safety/claim rules, spawn/gather rates, APIs, test evidence and limitations.
- README/HANDOFF updated with actual implemented interfaces, not imagined functions. Update the next-task entry so it does not restart completed work.
- Old-save compatibility is not required; new-version save/reload must conserve ownership/quantities. Do not build a large migration framework that blocks delivery.
- git diff --check and relevant semantic/regression checks pass before commit/push main-1; preserve main and HC bytes. Handle remote divergence without overwriting others.
- Final response: commit/branch, actual behavior, tests/long-run evidence, limits and documentation links. Never claim all bugs are absent.
