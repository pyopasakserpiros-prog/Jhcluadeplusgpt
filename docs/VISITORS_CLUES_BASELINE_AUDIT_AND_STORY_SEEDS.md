# Reference audit and creative seeds — visitors, clues and legendary weapons

Date: 2026-10-30 UTC. Inspected main-1 reference commit: `7a6694f91f0de0f22ed7aa02e39aae313e900d82`. This is the source available to Codex; the user's newer NPC/graphics patches in the Gemini conversation were not supplied. The new implementation must continue that newer source. This document is a design/reconnaissance artifact, not an implemented patch or approval of unseen code.

## 1. What was actually inspected

Read relevant parts of `expedition.js`, `explore.js`, `external_market.js`, `content.js`, `knowledge.js`, `martial.js`, `stats.js`, `sim.js`, `sect.js`, `skills.js`, UI link/quality code, the visitor roadmap and relevant test loaders. Loaded the native data/runtime through `test/load.js` and executed a read-only catalog/mint/stat probe.

Observed native definition counts: 261 materials, 146 items, 278 recipes, 468 unique technique/mantra IDs, including 22 legendary arts. WEAPON item family counts: SWORD 8, BLADE 9, SPEAR 6, STAFF 6, FOCUS 6, BOW 5, FIST 5. Armor/accessories are outside that seven-family weapon count.

The native merchant system is already functional infrastructure: `W.world.visitors`, EXT.openVisit, stock/wants/stones, visit expiry, per-member/sect trades, trade history and a market UI/marker. It is not accurate to claim visitors are only an empty array. The broader human/social/physical guest lifecycle is the proposed extension. `EXT.activeVisitors` currently specifically returns trader records, so changing guest representation must not break that contract.

The reference also contains legacy daily text-only visitor events in expedition.js: a merchant wealth payout and wandering-master knowledge event. These must be traced against newer code to prevent duplicate rewards when adding actual visitor encounters. This audit does not claim every legacy event is a reproduced bug.

Exploration already supports regional fortune sites, ranked realm areas, ten cave floors, guardians, hazards, trials and lore. `content.js` and `knowledge.js` wrap expedition settlement. Inspect the final runtime call chain before adding another wrapper. Named story targets must not use generic theme relaxation that substitutes unrelated loot.

The save snapshot includes world/sect/NPC state and RNG; underscore-prefixed properties are generally omitted. Essential clue/unique-item/settlement state needs durable serialized fields. The new guest model needs deliberate membership separation because many existing loops operate on W.npcs.

## 2. Item tier, quality and effect support

Tier and numerical quality already exist; a universal named rarity/grade taxonomy for all items should not be presumed from the technique grades. The native probe minted `ECO2_EQ_003_SWORD_6` at q=1.3. It retained tier 6, SWORD type, q=1.3 and fx `EFX_SWORD_STORM_STRIKE`. It did not have a `quality` property.

Its stat projection in the inspected runtime was atk 786.5, matk 143, move 5.2, acc 171.6 and crit 3. This is a narrow mint/stat probe, not a complete combat-effect test. `stats.js` wraps ECO.mintGear to copy definition effects into fx; `martial.js` also wraps minting for type classification. Some UI code reads quality where runtime gear uses q. Reproduce latest behavior and correct mismatches through an appropriate canonical accessor/migration if necessary; do not declare every quality path broken or every effect working from these observations.

Runtime stat keys are hp, atk, matk, def, mdef, crit, critDmg, eva, acc, pen, cast and move. Cultivation Qi has separate state. Effect descriptions in item data do not establish that a combat handler exists.

## 3. Existing reward candidates: deliberately varied sources

These IDs were verified in the inspected source. Suggested stories below are new design proposals, not existing mechanics or novel canon. Inspect newer definitions before using them.

| Existing ID | Reference role | Proposed lead |
| --- | --- | --- |
| `MAT_HERB_JADE_LOTUS_2` | Tier-2 alchemy herb | A traveler describes a small known gathering site; one-stage local search with finite yield, no legendary ceremony. |
| `ART190_XIAN_001` | Tier-1 Common combat art, XIAN/SWORD_IMMORTAL | A retired guard offers a real manual after a small service or a restrained demonstration; learning eligibility remains separate. |
| `MP_SWORD_5` | Tier-5 ordinary SWORD equipment | A merchant knows a lawful seller/cache of an existing meteor sword. Determine a real item owner before sale/transfer; no free duplicate. |
| `MAT_HERB_SNOW_LOTUS_5` | Tier-5 mountain herb | Seasonal sighting -> safe route/preparation -> limited bloom, with protection or a guardian only if justified. |
| `MAT_ORE_METEOR_IRON_5` | Tier-5 ore, desert terrain in current data | Witness account of a meteor -> locate impact debris -> mining challenge; do not automatically place it in a mountain region contrary to data without documenting the adaptation. |
| `MAT_TR_WORLD_FORGE_SHARD` | Tier-7 heritage-only forging material | Damaged inscription -> heritage ruin -> repair/interpretation trial -> finite shard. Preserve heritage-only source restrictions. |
| `MAT_BP_DRAGON_PEARL_7` | Tier-7 beast-core material; urban terrain in current definition | A broker's lead to a documented specimen/old collection. Do not invent a guaranteed live dragon spawn or silently retcon its current source metadata. |
| `ECO2_EQ_003_SWORD_6` | Existing tier-6 SWORD item with data effect | Optional broker/guardian story to an existing equipment type; distinguish this existing high-tier item from newly authored legendary objects. |

These are examples, not a claim the terrain metadata is always ideal. Gemini can improve unreasonable source assignments with an explicit compatibility/migration/rarity explanation rather than ignoring them.

## 4. Creative story seed for every current legendary art

All following rows refer to verified existing IDs. Their narratives and step suggestions are ORIGINAL GAME-DESIGN PROPOSALS by Codex, not researched accounts of what occurs in Jin Yong/Gu Long novels. Gemini should refine, replace or connect them and report why. Number of steps is illustrative and does not determine tier. Preserve current path/subpath/learning/stage rules and actual effects. Physical discovery need not require already being able to learn the reward.

| Existing legendary ID | Suggested source identity and meaningful steps |
| --- | --- |
| `LEG_COMBAT_DUGU_NINE_SWORDS` | A wounded swordsman describes weathered marks at a deserted practice ledge. Compare several opposing attack patterns -> recognize an overlooked opening -> receive/read a preserved fragment. A specialist helps interpretation; an acquisition is not automatic mastery of all stages. About 2–3 meaningful nodes. |
| `LEG_COMBAT_DRAGON_SUBDUING_PALMS` | A returning escort remembers an old defender's sealed training record. Help protect or recover a specific stranded party -> a nonlethal force-control test -> the keeper entrusts the manual. Courage and restraint have context; unrelated kindness points do not substitute. About 3 nodes. |
| `LEG_COMBAT_FEIXIAN_ONE_SWORD` | A rare account of a sword-light at a ruined summit identifies a hidden inscription. A short route can reach it directly, but interpreting the intent is a hard personal trial; a strong escort cannot understand it on someone else's behalf. About 1–2 nodes. |
| `LEG_AUX_QIANKUN_SHIFT` | A displaced formation craftsman carries half a pressure diagram. Trace a collapsed hall -> restore equilibrium in a real bounded trial -> locate the intact method. Brute-force destruction is a distinct costly/failure branch, not equivalent automatic success. About 3 nodes. |
| `LEG_AUX_LINGXI_ONE_FINGER` | An unassuming guest tests whether a practitioner can read intent without escalating a dispute. A rare direct teaching opportunity can be only one meaningful encounter; reserve consent, teaching eligibility and finite opportunity. About 1–2 nodes. |
| `LEG_LIGHT_LINGBO_STEP` | A ferryman recalls impossible footprints at a submerged pavilion. Learn the location -> observe tide/route clues -> understand a movement diagram through the existing skill/trial model. No requirement to already know this art. About 2–3 nodes. |
| `LEG_LIGHT_MOON_BAT_SHADOW` | Night-watch testimony points to a ruined moon pavilion. Distinguish two conflicting accounts -> traverse the correct shadowed route -> interpret an evasive movement record. Stealth/mobility and preparation matter; avoid mandatory murder. About 3 nodes. |
| `LEG_FORB_STAR_ABSORBING_VORTEX` | A frightened survivor knows a failed practitioner's refuge. Recover testimony -> identify the dangerous sealed record -> decide whether to retrieve or leave it. Known warnings accompany the reward; actual costs/risks must match implemented mechanics. About 2–3 nodes. |
| `LEG_FORB_BLOOD_LOTUS_SACRIFICE` | A blood-stained fragment records the location of a forbidden altar. An unusually short lead can expose the manuscript, but danger and the decision to preserve/report/avoid it are meaningful. Do not silently sacrifice NPC lifespan merely for reading a rumor. About 1–2 nodes. |
| `LEG_PASS_MINGYU_IMMORTAL_QI` | A healer mentions a jade chamber whose owner sought disciplined circulation rather than victory. Gain lawful entry -> reconstruct a breath diagram -> pass an appropriate concentration/circulation test. Award passive knowledge, not forced passive activation. About 2–3 nodes. |
| `LEG_PASS_NINE_YANG_MERIDIAN` | A survivor's heat-scorched notes lead to an isolated refuge. Prepare for heat -> recover the protected scripture through an endurance/medical approach. Existing injury/resource costs apply; use does not grant literal invulnerability. About 2 nodes. |
| `LEG_PASS_DUGU_SWORD_HEART` | Conflicting sword epitaphs lead to a quiet memorial. Understanding why several recorded victories ended differently matters more than killing a giant boss. Use observation/practice evidence; preserve the passive's actual sword condition. About 2–4 nodes. |
| `LEG_MANTRA_TAIXUAN_SCRIPTURE` | A sailor gives a rare accurate lead to an inscription island/ruin reachable through the existing expedition abstraction. Follow competing interpretations -> inspect the carvings -> comprehension trial with multiple hints. Do not impose a fabricated requirement that only illiterate people can succeed. About 3–4 nodes. |
| `LEG_MANTRA_SIX_MERIDIAN_QI` | A displaced temple archivist seeks restoration of a damaged record. Earn access through a real service -> retrieve a missing folio -> demonstrate a compatible circulation foundation. A person can carry the folio before satisfying study requirements. About 3 nodes. |
| `LEG_MANTRA_DRAGON_ELEPHANT_PRAJNA` | A caravan carries a stone rubbing of an ascetic's trial. Trace its monastery -> interpret the bodily discipline -> an endurance/controlled-force test. Training/escort alternatives affect access, not personal mastery. About 2–3 nodes. |
| `LEG_MANTRA_DIAMOND_INDESTRUCTIBLE` | A guardian spirit protects a collapsed sanctuary's sealed scripture. Rescue/preserve a real object or contact -> earn a formal nonlethal trial -> receive the record. Its preference is steadfastness/protection, not checking a universal moral score. About 3 nodes. |
| `LEG_MANTRA_EIGHT_DESOLATIONS_GOD` | An aging pilgrim knows the location of a broken cycle-calendar. One site points to a second where the cycle can be interpreted. Use timing/faith/knowledge constraints that actually exist, without adding an unsupported age-reversal effect. About 2–3 nodes. |
| `LEG_MANTRA_CELESTIAL_MANDATE_CANON` | A former envoy brings a disputed seal and conflicting testimony about an oath sanctuary. Investigate provenance -> fulfill a concrete commitment -> face the keeper's judgment. Authority alone is insufficient; true choices and promises matter. About 3–5 nodes. |
| `LEG_MANTRA_ASHURA_BLOOD_SEA` | A war refugee's account leads to a battlefield cache. Recover context -> survive a real hostile encounter -> decide how to handle the dangerous record. A ruthless keeper can value resolve; do not make cruelty a universal requirement for every DEMON art. About 3 nodes. |
| `LEG_MANTRA_TEN_THOUSAND_GU_MONARCH` | An herbal specialist reports an abandoned poison conservatory. Prepare appropriate medicine -> identify safe specimens/formation -> reach the keeper's record. No endless consumable key duplication; use real antidote/skill support. About 2–4 nodes. |
| `LEG_MANTRA_NINE_YIN_SOUL_MIRROR` | A visitor describes contradictory reflections in a ruined observatory. Interview a witness -> inspect the mirror site -> distinguish an illusion using an authored perception/judgment trial. Confidence and relevant skills help; hidden omniscient personality reading does not solve every node. About 3 nodes. |
| `LEG_MANTRA_LITTLE_LI_HEART_BLADE` | A storyteller introduces a reserved weaponsmith/retired escort. Keep a concrete promise or exercise restraint during a real conflict -> receive a record of focused intent. The record is a technique/mantra, not automatically a unique physical flying dagger; any linked weapon has its own definition/claim rules. About 2–3 nodes. |

Shared locations or narrative links are welcome. A player/NPC should not collect a legendary weapon and multiple legendary arts every time a shared story ends. Define branches, claims and independent rarity precisely.

## 5. Legendary weapon research/coverage design

The author's requested primary literary sources are Jin Yong and Gu Long. No web/primary-text research was executed in this Codex reconnaissance; the accompanying implementation prompt explicitly assigns that research to Gemini. The following are research starting points, not verified final attributions or approved gameplay definitions:

- Sword candidates: 倚天剑 and 玄铁重剑; contrast precision/lightness and controlled heavy power rather than merely changing atk.
- Saber candidates: 屠龙刀 and 圆月弯刀; verify novel/bearer/traits and distinguish game adaptation from canon.
- Staff candidate: 打狗棒; a recognizable jade/green staff should have a coherent technique/role relationship without granting its associated art for free.
- 小李飞刀: verify object versus technique/tradition; a legendary game object can be an explicit adaptation. Baseline daggers classify as BLADE. Use a throwing subtype or fully integrate a new family rather than silently misclassifying it.
- 孔雀翎: verify the hidden-weapon mechanism and choose a defensible family/subtype or omit if the mapping would distort its identity.
- Bow, spear, fist gear and focus: research honestly; invent fitting originals where sources do not support enough candidates. An original meteor-thread bow, oath-bearing spear, restrained counterforce gauntlets or inscription focus can fill a genuine gameplay niche. These examples are original suggestions, not literary claims.

Default coverage can be one weapon for each of seven families, with a second/third only where it has a distinct identity and good integration. The user allows 1–3 by suitability. There is no requirement to manufacture 21 weapons. Existing high-tier equipment need not be retroactively labeled legendary without assessment. Ordinary-looking literary weapons can inspire high-grade objects if the adaptation is disclosed.

Each equipped object should have its own visible form; held/carried is enough. A floating form is an optional appropriate magical presentation, never a second functional weapon instance. Strongest visual priority: actual bearer/item identity, readable silhouette and correct activation/unequip behavior.

## 6. Coherent end-to-end examples to guide implementation

### Example A: useful ordinary lead

A legitimate traveler actually knows a nearby limited herb patch. A member hears it through a completed conversation, values it for medicine, checks travel/work availability and investigates. The site yields a bounded number of `MAT_HERB_JADE_LOTUS_2` if still available. The herb goes to expedition loot/personal or sect storage through the existing settlement path once. A second member hearing the same root rumor does not get a fresh patch. This is an ordinary lead, not a hidden mandatory boss chain.

### Example B: interpretation plus personal inheritance

A guest holds a weathered record connected to `LEG_COMBAT_DUGU_NINE_SWORDS`. Sharing reveals location A. A specialist can help interpret the record at A, revealing B. At B, a personal observation/control trial is evaluated for the intended successor; a high-stage companion cannot satisfy that personal predicate for another person. A failed attempt leaves an intelligible hint or a postponement route. Success grants validated manual knowledge through a strict named route, never auto-learning all stages. Save/load at A, B and reward return preserves outcomes/ownership.

### Example C: legendary weapon with a guardian and lawful alternatives

A truthful rare rumor points to a particular artifact definition/instance held at a ruin. A guardian may be defeated through real combat, persuaded only if a supported authored condition fits, or left alone. Different approaches need not all exist. The claim registry proves the same object is unclaimed before issuing it. It moves through site -> carried expedition loot -> actual owner/storage; it is not minted at both discovery and return. Equipping it changes real stats/effects and visual shape, while orbiting decorative copies never create extra attacks. If sold, a subsequent clue can concern its new owner rather than respawning it.

## 7. What this reconnaissance does not establish

No new game code or content was implemented. No full regression suite, natural visitor/quest simulation, guardian fight, live equipment proc or browser review of the new patch was performed. Catalog loading and a mint/stat probe do not prove all described effects work. The newer Gemini source has not been reviewed. Literary references above require research/verification. Source/target/condition/claim/AI/visual tests are specified in the implementation prompt.

This design deliberately permits Gemini to replace story proposals, improve the mechanism or rebalance source assignments with evidence and an explicit deviation report. The author and Codex will review the combined patch later.
