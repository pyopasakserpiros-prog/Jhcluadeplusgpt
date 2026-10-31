# Martial paths — runtime v1.10.11

This patch adds scarce knowledge, typed equipment and stage-dependent martial identities to the native simulation. It uses seeded `W.rng`; there is no runtime LLM or external dependency. Start a new game. `human_core.js` remains byte-identical. The original imported source catalog remains v1.10.9; the native runtime and martial extension are v1.10.11.

## What changes in play

A cultivator has one major path and one active specialization. Ordinary awakening and later arrivals start with `cult.sub = 'NONE'`: they can cultivate and use a free general technique for their major path while looking for a specialization. The three founding cultivators retain their valid starting specializations. A crystal or a library manual unlocks a specialization only for a compatible, uncommitted cultivator. Specializations never stack. An explicit retraining action can replace the active path/subpath after source, cost and cooldown checks; ordinary crystal use remains nondestructive. An invalid foreign subpath resolves to the neutral base, never to the first specialization in another path.

Permanent technique manuals stay in `sect.library`; permanent specialization manuals stay in `sect.subLibrary`. They can serve multiple eligible members. Study pays for a service and consumes no manual. Study of general techniques uses the existing timed study action. Specialization study uses the 240-minute `specialize` action for initial acquisition and revalidates eligibility, library access and funds on completion.

Crystals are finite integer quantities in `npc.inv.crystals` and `sect.crystals`. Buying transfers one real unit into the buyer's bag. It does not immediately learn the knowledge. Successful eligible use consumes exactly one unit and teaches the knowledge. Failure, duplicate learning, wrong path, wrong specialization, insufficient stage or stale purchase quote consumes nothing. There is no manual-to-crystal manufacturing.

Members decide to use, retain or donate crystals using path fit, preferred specialization, current stage, loyalty, wealth preference and CP needs. Donating transfers a real unit to sect stock and pays CP. Expedition knowledge goes to the party member with the best fit; normal daily choices handle use or donation afterward. Death and departure return remaining finite knowledge to the sect.

## Rarity and prices

All acquisition opportunities share `MARTIAL.rollDiscovery`, a global budget of **12 rolls per native day** and these mutually exclusive outcomes:

| Outcome | Probability per available opportunity |
| --- | ---: |
| Specialization manual | 0.05% |
| Technique manual | 0.30% |
| Specialization crystal | 0.90% |
| Technique crystal | 5.50% |
| No martial knowledge | 93.25% |

The budget is shared by regional discoveries, native expedition scrolls, caves/otherworld loot, stele fragments, diplomatic exchanges and visiting masters. Candidate pools still respect tier and, for adapted regional knowledge, source routes. Empty pools produce no item. Settlement never rerolls knowledge. Existing formula-scroll odds and nonknowledge loot are separate systems. The basic founding library and five general fundamentals are explicit bootstrap content, outside rare discovery.

When the library has the relevant manual, a crystal costs **floor(50% of the current study fee)**. A free basic curriculum therefore has a zero-CP crystal price and zero donation reward. For unknown technique knowledge, the tier base is `28 × tier^2.1`; for unknown specialization knowledge it is `100 + 50 × tier²`. This is multiplied by compatible demand (1–1.35) and the CP price index clamped to 0.6–1.6. Specialization study costs `(80 + 45 × tier²) × CP index`, rounded, minimum 1. Technique study uses native `CPE.techPrice` and library permissions.

Crystal donation pays at most floor(40% of the current sale price). Purchased units also retain a conservative minimum purchase-price cap while any bought units remain: their donation pays at most floor(40% of that cap). This closes buy/donate loops even after a price increase or library discovery. Duplicate manuals grant zero CP.

## Equipment and content

There are **14 explicit type codes** and Thai labels: weapons `SWORD`, `BLADE`, `BOW`, `SPEAR`, `STAFF`, `FIST`, `FOCUS`; armor `HEAVY`, `LIGHT`, `ROBE`; accessories `RING`, `NECKLACE`, `BRACELET`, `CHARM`. Historical text-only catalog entries and recipe outputs are classified deterministically at the catalog/mint boundary. The existing `WEAPON`, single `ARMOR` and single `ACCESSORY` slots remain.

New native content consists of:

- **42 equipment items and 42 paid FORGING recipes**, one of every type at tiers 1, 3 and 5. They consume existing black iron/star copper/meteor iron plus wolf pelt, with positive finite costs. Recipe tier/mastery gates and native paid crafting receipts remain authoritative.
- **2 specializations**: XIAN `STAR_ARCHER` (เซียนศรดารา), BODY `STAFF_GUARD` (องครักษ์พลองเหล็ก).
- **10 rare techniques**: 5 active moves and 5 gear-conditioned learned passives.
- **5 free general fundamentals**, one for each major path, available while a cultivator has no specialization.

Final catalog counts: **37 subpaths, 114 items, 198 recipes and 309 techniques**. The imported source adapter's own counts remain unchanged.

A technique with `weaponTypes` or `armorTypes` has **×1.15 efficiency with matching equipment and ×0.65 otherwise**. Generic moves have ×1.0. An empty weapon slot counts as `FIST` for fist practice. Spirit-arrow techniques can still project weaker qi arrows without a bow; the optional `requiresWeapon` flag is available for moves that physically require a weapon. Efficiency reaches real damage, shields, healing, counter damage and channel ticks once. Gear-conditioned passive stat bonuses require an exact match and disappear immediately when gear changes. Passives are excluded from active skill lists.

Both shopping and free sect distribution call `MARTIAL.gearSuitability`: path/subpath preferences, learned moves, physical/magical power, armor, productive tool needs, caution/aggression, wounded emergencies and price affect choice. Normal rank, scarcity, price and authority constraints still apply. No universal best-item optimizer controls every NPC.

## Derived growth

Every major path and all 37 subpaths have explicit stage profiles. Early curves use `sqrt(progress)`, late curves use `progress²`, steady curves use linear progress; each starts at 18% and ends at 100% of its profile. Specialization rank progression also feeds its branch scale, without accumulating alternate branches.

BODY adds strength, toughness, endurance and vitality; XIAN emphasizes meridians and spiritual foundation; GOD favors vitality and resilience; DEMON favors strength, explosiveness and agility with defense tradeoffs; HEART_SOUL favors spiritual foundation/reflex with HP tradeoffs. Each branch adds its own physical and productive strengths. Existing direct branch stat modifiers now scale with progression instead of appearing at full strength at level 1.

`MARTIAL.eff` reads HC values plus derived physical deltas. These enter the existing combat formulas. `MARTIAL.derived` adds only the corresponding HP and walking-speed deltas, calculated from the same native HC coefficients. It never writes into `npc.h`, and body bonuses are not added a second time as percentage buffs. The fast combat path and explained combat path use the same layer.

Productive bonuses change real herb/grain/mine output, regional/native hunting/gathering yield, native craft success, timed scripture study and healer recovery. Some profiles also record practice preferences for martial skills; these are not permanent HC skill grants.

The NPC overview shows current/next physical, direct combat and productive bonuses, growth curve, desired gear, passive conditions and owned crystal intentions. The shop shows real stock, prices, donation ceilings, study fees and locked library knowledge. Rendering and suitability never draw random numbers.

## Skills and explicit retraining (authorized extension)

All **29 skills** appear in separate weapon, cultivation, production, exploration and social groups. The26 native HC skills use their existing storage; new `BOW`, `STAFF` and `FOCUS` values live in `npc.martialSkills` outside HC. `MARTIAL.skillRead` and `skillPractice` are the common API for both stores. Native actions, teaching and actual combat route practice through this API. `skillDrill` provides a real training action for every registered skill. See [SKILL_EFFECTS.md](SKILL_EFFECTS.md) for the complete skill-to-gameplay mapping and formulas.

The equipped weapon's proficiency affects attack, technique attack, accuracy and penetration. A high sword skill no longer improves bow attacks just by being the largest skill. Other skills change actual defense/movement, crafting, cultivation, scripture study, medicine, music recovery, beast damage, construction or native gathering/trade/diplomacy outcomes. Skill UI distinguishes permanent learned proficiency from current path-derived productive/training efficiency.

`MARTIAL.retrain` is the explicit destructive-change boundary. It accepts `S:<subpath-id>` plus source `crystal`, `personalManual` or `sectManual`. Target knowledge also identifies its major path. A crystal must be physically held; a personal manual must be owned; a sect manual requires library access. Current funds and any supplied price are revalidated. Manual study consumes no manual; crystal retraining consumes exactly one unit only on success. Duplicate targets, wrong item kinds, unavailable sources, insufficient original stage/funds, active fights and cooldown failures leave items/CP unchanged.

Changing major path restarts at **stage1/progress0** (the engine's valid equivalent of starting fromzero). Replacing a subpath within the same major path sets `newStage=max(1,oldStage-max(2,ceil(oldStage/2)))`, with zero progress. Old1/2/3 become1,4 becomes2,5 becomes2,6 becomes3. A new independent specialization track begins at rank1. All prior progress, learning, bottleneck preparations and temporary combat buffs/statuses are cleared. Mantra, lifespan and HP/QI caps are recalculated; current HP/QI are clamped downward. Independently trained HC body attributes and all29 learned skills remain. Learned techniques are remembered, but only compatible path/subpath/stage techniques contribute to stats or active moves. Cooldown is30 days for a subpath replacement and60 for a major path change.

NPC retraining considers trained preferred weapons, personal affinity, matching gear, actual replacement-technique access, current compatible techniques, lost stages and techniques, caution/rationality/ambition/curiosity, urgent physical needs and remaining lifespan. Having a high target weapon skill is insufficient by itself. Members may keep crystals and prepare gear/training before deciding to lose stages. A bounded `martialIntent` exposes preparation, reasons and cooldown in the NPC UI; committed changes are logged with before/after stage and paid source. No alternate path runs simultaneously.

## State and verification

New save state uses JSON-only bounded catalog-keyed maps, capped quantities (999 per crystal type), bounded native lists and one daily discovery counter. Per-member `inv.crystalBought` stores one price cap/count per held purchased type; it is not an event history. Both expedition and output settlement receipts protect knowledge replay, including reconstructed expedition objects after reload. Crystal destinations cap at999; any discovery/death/departure surplus is conserved in catalog-keyed `sect.knowledgeOverflow` escrow. Simulation initialization/daily/transaction boundaries refill stock from escrow whenever room opens, using no RNG. Derived progression caches live in a WeakMap outside saves.

Focused checks:

```sh
node test/martial_retraining.js
node test/martial_paths.js
node test/demon_heartsoul_paths.js
node test/ui_content.js
node test/craft_transactions.js
node test/core_lock.js
node tools/build_single.js
node test/standalone.js
```

`test/martial_paths.js` verifies conservation/rejection boundaries, reusable manuals, replay after reload, seeded shared rarity, future NPC acquisition, actual combat multiplier, passive removal, real body/life outcomes, all 42 paid recipes and pure suitability. `test/run_all.js` includes this group. Folder and single-file entrypoints now load 36 scripts. Full browser, performance and long-world validation are release-controller checks; see root patch ledger/report for their current status.
