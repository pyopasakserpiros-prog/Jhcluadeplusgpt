# GEMINI IMPLEMENTATION ASSIGNMENT — VISITORS, LIVING CLUES, INHERITANCE STORIES AND LEGENDARY WEAPONS

Read this entire document and the accompanying baseline audit before editing. Implement the next playable patch, test it, and deliver complete artifacts. This is an implementation assignment, not a request for a plan or a discussion. The author delegates ordinary decisions to you. Codex will review the combined game later and adjust defects and unreasonable behavior; this future review does not excuse avoidable incomplete work now.

## 1. Use the latest source already in THIS Gemini conversation

Continue from the newest complete source tree you produced in this conversation, preserving the preceding NPC and graphics patches. The author deliberately wants consecutive patches without uploading to GitHub between them. Identify your actual baseline artifact/version/hash and retain an untouched copy or commit before editing. Reconcile any incomplete source from your own prior output rather than starting from an older snapshot.

Codex inspected the older GitHub main-1 commit `7a6694f91f0de0f22ed7aa02e39aae313e900d82`, whose reviewed runtime integration base was `c0f277d8f3a48effe6f3d9c0d26ee79bd886e4a1`. The reference manifest describes that snapshot, not the unseen latest NPC/graphics source. Revalidate APIs against your latest source. Never overwrite newer work with these reference data. If the newest source is unavailable, request that source explicitly rather than recreating it from memory and claiming continuity.

Historical HANDOFF/GEMINI_NEXT_TASK documents may still describe previous assignments. Treat completed tasks as context. This document assigns the next patch. Preserve previous reports as evidence and update current-task pointers truthfully at delivery.

## 2. Product intent and delegated creative judgment

Make the sect a place where real outsiders visit, meet members, trade, share uncertain information and sometimes bring leads to existing items/arts or newly introduced legendary weapons. Members decide what to believe, whom to help, whether to investigate, how to prepare and when to abandon a plan. Stories unfold through game state and actions, not text that pretends a reward or journey happened.

The author specifically wants:
- Visitors including independent cultivators, merchants, specialists and people from other sects, with genuine opportunities for members to meet outsiders.
- Clues to good items and high-tier techniques, including the existing legendary arts.
- Different investigation lengths: a direct lead can reveal a reward at once; another can lead from A to B to further locations. Number of steps is chosen for the story, not copied from tier.
- Site-specific challenges: guardian beasts, hostile obstacles, interpretation, bodily capability, personality/values, actual choices or an inheritance spirit with its own preferences.
- ADDITIONAL acquisition sources alongside existing sources, preserving rarity and exclusive innate techniques.
- Legendary weapons inspired primarily by Jin Yong and Gu Long, approximately 1–3 per supported weapon category where appropriate, with permission to invent originals if research is insufficient.
- A recognizable equipped visual: held weapon, sheathed/carried form or a restrained floating/orbiting presentation where fiction and mechanics support it.

Challenge this proposed design before implementing. You may choose better data structures, stories, UX, pacing, probabilities, technical boundaries or implementation order. Invent your own improvements. You do not need approval for ordinary choices. However, explain substantive departures in a final deviation register: proposal, actual choice, why better, tradeoffs, affected code/content and evidence. Do not use creative freedom to remove whole requested systems, hide incomplete features or replace mechanics with decorative logs.

## 3. Existing integration map: verify before extending

The inspected reference contains:
- 261 material definitions, 146 item definitions, 278 recipes and 468 unique technique/mantra IDs after native data loading; 22 legendary arts. These are definition counts, not quantities in a world.
- Seven weapon families: SWORD, BLADE, BOW, SPEAR, STAFF, FIST and FOCUS. In data-defined WEAPON items, counts were 8/9/5/6/6/5/6 respectively. Do not include armor/accessory categories in the 1–3-weapons request.
- `W.world.visitors` already stores real merchant records. `js/external_market.js` provides EXT.openVisit, activeVisitors, finite stock/wants/stones, visit expiry and recorded outside trades. Current outside currency is spirit stones, not contribution points.
- `js/expedition.js` contains departures, food/travel costs, parties, regional missions, approvals/volunteering and handover. It also has legacy daily merchant/wandering-master events. Some legacy text events grant wealth/knowledge directly; audit and reconcile them with physical visitors instead of accidentally stacking both routes.
- `js/explore.js` extends expedition behavior for the ten-floor cave and ranked areas of the many-worlds realm; encounters already include fights, hazards, trials and lore. Use this existing abstraction; do not build an unrelated second adventure simulator.
- `js/content.js` adds content regions, finite resource sites, formula ownership, rare organs, experiments, politics and settlement guards. Some expedition methods are wrapped by multiple modules.
- `js/knowledge.js` centralizes tier/grade acquisition, manuals, one-use knowledge, innate exclusions, caps and delivery wrappers. Some thematic filters can relax when empty: a precise named story reward needs a strict path, not an unrestricted fallback.
- `js/martial.js`, `js/skills.js`, `js/stats.js`, `js/combat.js` handle actual compatibility, equipment valuation, derived stats, passive/innate effects and combat.
- `js/sim.js` serializes world, sect, npcs, exploration, fights and RNG. Underscore-prefixed properties are generally removed by the JSON replacer. Do not store essential clue progress/claim receipts/unique-item ownership only in `_temporary` fields.
- `js/render.js`, `js/ui.js`, `js/main.js` are presentation/input integration points; preserve the newer graphics patch. Existing log links resolve NPC/building IDs; extend entity routing deliberately for visitors, clues and sites.

Read the whole runtime method/wrapper chain before replacing a function. Register new modules in index.html, the native test loader and the standalone builder as needed. Preserve older saved worlds and older merchant records.

## 4. Required reconnaissance outputs and early verification

Before implementation, produce a compact working matrix, not a long speculative essay:
1. Latest actual baseline and existing test status.
2. Existing/reused/new visitor, social, knowledge, equipment, expedition and visual components, with real entry points.
3. Catalog selection: exact IDs, eligibility, old sources, proposed extra sources, tier/grade/quality and effect support.
4. Risk list: visitor/member separation, wrapped settlement, precise rewards versus lottery fallback, item identity, save migration and performance.
5. Your design alternatives and selected approach, with a short reason.

Confirm a playable startup and run relevant current tests. Separate existing failures from introduced regressions. Fix confirmed blockers and related correctness bugs; do not silently rewrite unrelated economy/cultivation systems. Do not assume Codex already certified your previous output.

## 5. Visitor identity, membership and lifecycle

Build a persistent outsider model by extending/adapting existing visitor infrastructure. A visitor is a person with stable identity, purpose, personality, available knowledge, finite assets and a visit lifecycle. A trader can additionally retain its existing stock, wants and budget.

Suggested states: approaching -> admission pending -> admitted/limited access -> active stay -> departing -> offsite; plus rejected, dead, detained or otherwise terminal states only if supported. Use a smaller equivalent model if better. Avoid teleporting actors between incompatible states or leaving departed guests occupying stations forever.

Requirements:
- Separate permanent membership from guest status. Admission is not recruitment. Do not blindly append guests to W.npcs if population, housing, payroll, welfare, succession and authority code assumes all W.npcs are members. Audit those loops if your design shares storage. The existing 100-member capacity remains intact; bounded guests use a separately declared concurrency/performance policy.
- Use the same stable identity across visits and social history. A known guest returning is not a newly generated stranger with the same name. A stranger sharing a name is not the same person.
- Use current HC generation/validation for person traits where appropriate, without modifying the locked core. Provide a consistent entity lookup for interactions, logs, portraits and spatial queries. Avoid duplicate actor copies in trader records and social registries with divergent money/HP/relationships.
- Visitors arrive at a valid entrance, move to allowed places, interact during feasible time and leave after a plausible stay. Integrate real route closure, danger, sect policy, accommodation and safety.
- Arrival frequency/type can depend on reputation, contacts, accessibility and resources. A low-reputation sect must still have a very small chance of a notable guest or valuable clue; high reputation must not become a conveyor belt of legendary rewards. Guest combat power is not the recruitment-talent distribution. Do not blindly apply the earlier gifted-applicant 33% rule to all guest rarity.
- Give ordinary visitors useful life: conversation, rest, modest trade, service, a friend to visit, a request or passing information. Most guests should not carry a major treasure quest.
- Returning visitors may remember reliability, hospitality and actual interactions. Retain a bounded offsite identity summary and references required by active clues/relationships; do not simulate every distant person every tick.

A reasonable initial engineering budget is roughly 4–8 physically active guests under normal conditions, with configurable burst behavior and a hard cap; this is a proposal, not a required population target. Do not spawn guests simply to fill the cap.

## 6. Admission, authority, access and outsider activities

Reuse the preceding NPC authority patch. Gate staff/relevant officials/master can admit, restrict or reject a guest according to appointment, availability, policy, perceived risk and personality. Provide a fallback decision path if no suitable officer is available. No office or rank is granted automatically to guests.

Allowed actions should have genuine consent, targets, duration and effects: converse, exchange news, practice/spar under safe rules, teach authorized knowledge, provide a service, buy/sell owned goods, request help, visit an acquaintance or depart. Reuse existing action/meeting/party contracts. Members retain meals, work, sleep, emergencies and commitments; guests must not interrupt everything every tick.

Restricted libraries, stockrooms, homes and internal deliberations need real access checks. A friendly guest does not gain unlimited inventory access. Sect funds require an authorized spender; personal funds and CP are distinct. Prices, inventory and services must settle on both sides. A greeting or boast never creates money/items/CP by itself.

Relationships can alter willingness to share clues, pricing within bounded rules, teaching, introductions or future visits. They must not guarantee cooperation or generate free repeat rewards. A deceptive or self-interested guest may withhold/exaggerate information where implemented, but do not make every visitor a fraud or trigger arbitrary punishments from hidden facts.

Legacy merchant/day events must either feed the new visitor lifecycle or remain explicitly separate rare events with accounted outcomes. In particular, do not preserve a daily text-only purchase payout and also execute the same sale through actual trader inventory.

## 7. Knowledge, testimony and rumors

Represent a clue as information held by particular people or an authorized sect record, not global omniscience. Different members may know different fragments. The player can inspect permitted information without the NPC planner reading hidden debug truth.

Useful data: stable clue ID, source speaker/event, recipient(s), learned time, claimed subject/location, specificity, perceived confidence, provenance/root rumor ID, sharing permission, next actionable lead and expiry/review metadata. Separate underlying world truth from what each person claims/believes.

A visitor can truthfully report what they saw, repeat hearsay, be mistaken or deliberately deceive within the implemented model. Identify real knowledge sources at generation; do not give every guest all site solutions or the entire catalog. Confidence is not perfect truth detection. Hearing the same original rumor from several people is not independent corroboration.

Information can spread through actual conversation, reporting, an office handover or an authorized record. A sect-funded lead can require reporting; privately bought information may stay private depending on policy and personality. Officials can delegate follow-up to members who are actually told the needed information. Do not broadcast everything to all NPCs immediately.

Expiry depends on what changed: a temporary merchant or bloom can expire; the location of an old ruin need not become false because a uniform timer elapsed. Mark stale, disproven, unresolved and claimed states accurately. A false rumor must have a coherent reason/result rather than rolling truth afresh every time someone looks.

## 8. Persistent clue graph and state transitions

Use data-authored templates plus persistent instances. A graph/node model or equivalent state machine is appropriate. Use explicit condition/effect handlers; never eval narrative text or execute strings from save files.

Suggested template fields (adapt names):
- stable templateId/version; Thai title/summary; theme; target definition IDs; source eligibility; clue rarity/tier/grade metadata; allowed world/site bindings; repeat policy;
- nodes with stable IDs, type, location/actor references, prerequisites, observable hints, success/failure/alternate edges, retry/cooldown rules and validated reward declarations;
- terminal outcomes, resource costs, claim policy and tuning parameters.

Suggested instance state: instanceId/templateVersion; root rumor ID; bound site/guardian/target; discovered nodes; who knows which fragments; progress, attempted actions and committed outcomes; pending travel/party; conditions observed; cooldowns/deadline; reward reservation/receipt; status and history summary.

Node types can include direct search, speak to contact, inspect inscription, acquire a lawful key, perform a service, skill trial, body/endurance trial, values/behavior assessment, combat guardian, preparation/rest, follow onward lead and terminal reward. Implement only types with real runtime handlers. Reject malformed templates in development instead of silently treating unknown handlers as success.

Length should vary: one meaningful step is valid, two/three steps are common possibilities, four/five or more only when the story earns them. A legendary art can be found through a short exceptionally rare lead; an ordinary item can require a longer practical journey. Do not define steps as `tier = number of errands`. Repeated travel to pad length is not content.

Require reachable success/alternate/failure/defer states. Prevent accidental cycles or bound deliberate revisits. A step cannot require the exact reward it unlocks as its sole prerequisite. Bind random targets/locations/outcomes at the appropriate committed discovery stage and persist them; UI opening, waiting at pause or reloading must not reroll the chain.

Progress changes only after actual completed actions. Logs describe committed transitions. Maintain deterministic RNG order and stable sequence IDs. Support cancellation, retargeting/delegation, party death/withdrawal, missing contacts, guest departure and changed access without corrupting progress or permanently blocking unrelated play.

## 9. Site challenges and inheritance spirits

Choose conditions that fit the owner, item and place. Do not homogenize every inheritance into kill guardian -> open chest.

Physical/skill examples: carrying/controlling a heavy weapon, surviving cold with suitable preparation, deciphering a formation, steady aim, observing sword marks, medicinal knowledge or a nonlethal spar. Use actual supported stat/skill paths and effective values. Validate path names; do not invent `body.might` or a hidden attribute that always resolves to a default.

An inheritance spirit can have a history, preferences, limits and incomplete judgment. It may seek a suitable practitioner, a promise kept, a repaired memorial, an act of restraint, courage, ambition or ruthless resolve. There is no single mandatory moral alignment. It may be mistaken; this must follow authored logic, not arbitrary failure text.

Condition implementation rules:
- Distinguish possession, interpretation, learning and use eligibility. A lower-stage finder can keep a manual they cannot yet learn; acquisition should not silently raise their cultivation stage.
- Conditions may apply to an individual, any party specialist, the leader or the whole party. Declare which. Do not accidentally allow a strong escort to satisfy a personal inheritance requirement for someone else.
- Do not test character sex/appearance or other unrelated traits just to add variety. Any unusual body/trait requirement needs a clear story/mechanical reason and documented accessibility/alternate-path implications.
- Prefer relevant evidence and actual choices over a universally omniscient virtue scan. If a supernatural test senses a specific internal attribute, declare that supernatural capability and its limits; the NPC still does not know hidden PA or every threshold.
- Give meaningful hints or a learnable failure reason. Hard barriers may exist where justified; give a way to defer, recruit a specialist, improve or abandon. Do not require every challenge to have an easy bypass.
- A guardian encounter must use the actual combat/encounter system, real costs, injuries/retreat and settlement. Do not mark a fight won from narrative text. If a high-level abstraction is used, show its risk and use the same authoritative resolution model already established by expeditions.
- Respect existing renewable resources, relic restrictions and persistent site depletion. An item labeled heritage-only cannot become an unlimited ordinary roadside drop.

## 10. NPC investigation and expedition integration

Connect clue pursuit to the preceding goals/planning system. A character needs actual knowledge, interest, feasibility and opportunity. A useful heuristic weighs expected benefit/suitability, confidence, travel/time/supply costs, risk, duties, current health, resources, relationship commitments and competing goals. It can be approximate; it cannot use unknown target stats, future RNG or hidden site solutions.

NPCs can verify a rumor, ask a knowledgeable friend, buy information within budget, report it, seek permission, recruit willing companions, prepare equipment/supplies, investigate, retreat, postpone or abandon. Keep plans bounded and sticky enough to avoid daily oscillation. Low confidence does not always mean ignore; ambition/curiosity/caution and desperation can produce different choices.

Reuse expedition approval, party invitations, member availability, spatial travel, food and return/handover. A clue-specific mission must not teleport the party or let one NPC join two expeditions. Maintain master/officer availability and emergency response. Do not send the entire sect chasing the same rumor.

Reserve a site/claim for a party only when justified and for a bounded duration. Share cooperative progress where appropriate; define competition/races explicitly. A winning party's claim updates the actual site. A later party should see the changed state rather than receive another unique artifact. Do not grant reward ownership to whichever NPC happens to be first in an array.

Record concrete reasons for pursue/defer/reject/abort. An unlearnable manual might still interest a loyal member for the sect or an acquisitive trader, but merely being rare should not override survival and duties in every case.

## 11. Two reward modes: general discoveries and named stories

Keep the existing hierarchical lottery for broad unknown opportunities: event/item kind -> tier -> grade where supported -> concrete eligible result. In ranked locations, higher source rank raises high-tier tails while common/low tiers remain dominant; low rank still has a tiny positive chance of high-tier opportunities. Unranked opportunities also favor low tiers. Do not turn source rank into a hard maximum technique tier.

A named authored story is different: if a persistent clue genuinely points to one specific sword/manual, completion should use a validated exact-target grant/transfer. It must not call the broad lottery and accidentally grant an unrelated item after all the effort. Its rarity is controlled by how rarely the opportunity becomes available, whether conditions are met and whether the reward is still present. Reward certainty after valid completion is compatible with a rare opportunity.

Do not use debug `forceTier`, `forceGrade`, `ignoreDailyCap` or similar bypasses as the normal production path. A strict story reward API may share validation/ownership/delivery with the old system, but it needs explicit production policy and accounting. Exclude innate-only/bootstrap arts and preserve forbidden-source rules. Possessing a reward does not waive path/subpath/stage/passive-slot or other learning/use restrictions.

Handle empty/ineligible/obsolete targets explicitly: reject catalog data, defer or finish with an honest no-reward/failure outcome as designed. Never silently substitute an unrelated legendary art. Named theme filtering must remain strict even if old generic discovery code relaxes theme filters.

## 12. Rarity and economic tuning

Keep the existing pools. Add clue sources without globally replacing or multiplying legacy drops. Audit every new/old source contribution and overlapping daily/event hooks.

Track the whole probability funnel with explicit denominators:
`visits/day -> information-bearing encounters -> usable clues by tier/grade -> investigations -> reached terminals -> successful grants -> learned/equipped results`.

For random branches report `P(tier | clue opportunity)` separately from `P(clue opportunity | visit)` and from eventual success. For fixed stories use opportunity prevalence and completion/claim rates instead of pretending the terminal reward has the generic lottery probability. Include abandonment, invalid targets, duplicates, blocked eligibility and daily-cap rejections.

The inspected technique lottery had positive T1..T7 weights at ranks 1..4/UNRANKED. Rank 1 was [.52,.28,.125,.052,.017,.0058,.0002]; rank 4 [.25,.22,.19,.145,.105,.072,.018]. These are conditional tier weights, not per-day or final-legendary rates. Reuse current authoritative tables where appropriate. Do not multiply independent rarity rolls blindly until all authored stories become practically unreachable.

Use named configurable caps/cooldowns and a documented shared budget where needed. Count production attempts at the correct point, not UI checks; aliases of one rumor must not create new opportunity budgets. Per-NPC polling must not multiply the world-level legendary supply by population. Avoid starving a legitimate long-lived chain because unrelated generic attempts consumed a poorly chosen daily cap: define reservation/grant policy explicitly.

Most visits and common clues should remain ordinary. A notable clue can originate from a weak/ordinary guest with tiny probability. High reputation improves contacts/information access, not guaranteed treasure or universal trust. Do not use the earlier 33% gifted-recruitment cap as an arbitrary universal legendary-clue rule.

Provide measured seeded outcomes and rarity formulas. A short natural simulation with no legendary terminal is not evidence that legendary routes are broken or balanced; use controlled reachability fixtures plus natural-frequency observations.

## 13. Content selection and source coverage

Select existing ordinary items/materials/recipes/techniques purposefully as well as legendary rewards. Use real IDs from the attached manifest, but inspect the newer actual catalog before retaining any ID.

Recommended initial working content:
- At least six distinct nonlegendary leads spanning practical low-tier rewards, a useful normal technique, a valuable material/equipment item and a rare heritage resource. Include a simple naturally feasible early-game lead.
- Give each of the 22 existing legendary arts a short authored origin/rumor identity and a functioning clue-based acquisition route, unless a current newer catalog rule genuinely forbids acquisition. Do not duplicate/recreate an existing technique to attach a story. If you exclude a target, document the exact rule and an intentional replacement; innate-only techniques remain excluded.
- Give each added legendary weapon a working authored source or integrate it into a shared inheritance story with explicit branch/claim rules. Shared sites need not always yield both a legendary weapon and a legendary technique.
- Vary steps, motives, challenges and reward forms. Some one-step legends, some investigation-heavy paths, some interpersonal/skill/guardian routes. Do not generate twenty-two mechanically identical key-fetch chains under different names.

These coverage targets are a concrete proposal to prevent placeholder-only delivery. You may improve the scope with a justified coherent alternative, but report exact implemented counts and IDs, replaced/deferred targets and why; never claim every art has a route because a lore string exists.

The accompanying audit includes real material/equipment candidates and a creative seed for each existing legend. They are noncanonical story ideas, not instructions to copy literary plots or to make game fiction match every claim in the old data's `literaryInspiration` text. Validate actual effects and constraints first.

## 14. Research legendary weapons: Jin Yong and Gu Long first

Research actual named weapons/weapon traditions in novels by Jin Yong and Gu Long. Use reliable accessible sources, preferably primary text/excerpts or authoritative references, with cross-checks where feasible. Chinese names, aliases and work/author identification matter. Distinguish novel canon, adaptation variations, uncertain attribution, your game adaptation and fully original creations.

Produce `LEGENDARY_WEAPON_RESEARCH.md` or a structured equivalent. For each candidate record: Chinese name, selected Thai display name, aliases/transliteration, author/work, canonical bearer/provenance when verified, source URL/title/section and access date, verified physical traits, uncertainty, proposed game family/subtype, gameplay adaptation, visual motif and why selected/rejected. Search snippets alone are not reliable support for detailed claims. If browsing is unavailable, say so; use clearly marked tentative inspirations or original designs instead of fabricating citations/research.

Starting candidates to VERIFY, not a pre-approved factual catalog: Yitian Sword (倚天剑), Dragon-Slaying Saber (屠龙刀), Black-Iron Heavy Sword (玄铁重剑), Dog-Beating Staff (打狗棒), Little Li's flying dagger (小李飞刀), Full Moon Scimitar (圆月弯刀), Peacock Plume (孔雀翎). Verify author/work and whether a term denotes a particular object, a technique, an ordinary weapon associated with a master or a unique artifact. The game can elevate an ordinary literary weapon as a deliberate adaptation, but label that decision. Do not turn a martial art's name into a supposedly canonical weapon without evidence.

For poorly represented families such as bow, spear, fist gear or focus, do not invent a canonical attribution to fill a quota. Research further; if insufficient, create your own fitting original legendary weapon and mark it ORIGINAL. Keep Jin Yong/Gu Long inspirations primary where suitable. No need to paste long passages into the report.

## 15. Legendary weapon catalog and category policy

Use the supported seven families as the initial coverage matrix. Aim for approximately 1–3 legendary weapons per family according to suitability; do not force all families to three. One strong distinctive original is better than three renamed stat sticks. Count actual new weapon definitions, not skins/quality variants or existing techniques. Report counts per family and why.

Preserve family semantics. Baseline name classification treats dagger/knife as BLADE and unmatched weapons as FOCUS. Explicit stable `gearType` plus a visual/equipment subtype is safer than relying on name regexes. A new family such as thrown weapons is allowed only with complete compatibility, AI, UI, serialization and visual integration; otherwise document the mapping of flying daggers/hidden weapons to an existing family. A literary flying dagger must not accidentally become a focus just because its Thai name lacks a classifier word.

Each weapon definition needs: stable item ID; Thai name/description; provenance type; family/subtype/slot; tier; legendary rarity marker; numerical quality interpretation; baseline stats and supported special effects; usage conditions; strengths/costs/limits; valuation/AI hints; visual key; source route IDs; unique/repeat policy; durability/repair/trade policy where relevant.

Tier, rarity and quality are separate concepts. Existing `tier` is power/progression, gear `q` is numerical workmanship quality and legendary status is exceptional identity. Do not assume every item already uses the technique grade taxonomy. Add a consistent item rarity/legendary field/accessor with legacy defaults if needed. Preserve old items and their values; do not rewrite the entire item catalog just to label new legends.

In the inspected runtime, minted gear used `q`; a 130% quality sword had `q:1.3` and no `quality` property. Some UI reads of `quality` deserve reconciliation. Audit actual latest code and migrate through a canonical accessor as needed, without applying the same multiplier twice. Preserve material stack/consumable quality semantics; pill quality currently uses stack aggregation and is not per-instance weapon workmanship.

## 16. Real weapon mechanics, balance and NPC valuation

Existing stats are hp/atk/matk/def/mdef/crit/critDmg/eva/acc/pen/cast/move. Qi belongs to the cultivation resource model; do not invent generic MP that the engine never reads. Use supported fields/effect handlers, or implement a small tested extension when a compelling signature cannot otherwise work.

A legendary weapon should have an identity beyond inflated numbers: precision with preparation, weight traded for penetration, a guarded counterattack, bounded pressure against shields, a support focus, reliable aim with a resource cost or a situational advantage. Creative choices are yours. Avoid unavoidable instant kills, unlimited healing/reflect loops, permanent invulnerability and multiplicative stacking without caps.

Trace definition -> mint -> inventory -> equip -> derived stats -> combat effect -> expiry/cooldown -> explanation. Existing `effects` can become `fx` through mint wrappers, and not every data effect name necessarily has a full combat handler. Do not claim an effect works because it appears in data or a tooltip. Reject unsupported effect IDs at validation or provide real implementation and test evidence.

Set limits on procs, targets, resource use and recursion. Avoid double-counting flat/percentage stats or double-scaling q. A reflected hit should not endlessly reflect back. A healing/protection effect must check actual eligibility and state. Offhand/orbiting render copies are not extra equipped weapons, additional attacks or additional items.

Preserve existing technique/subpath balance while adding bounded synergies. A particular weapon can suit certain arts/paths better without making every other build useless. Reuse the NPC gear evaluation from the preceding patch, considering actual stats, skills, family compatibility, current equipment, costs, risk/commitments and special-effect utility. Rarity alone must not force equipping an unusable or worse item. Report representative same-tier comparisons and new stat/effect contributions.

Do not automatically create normal repeatable crafting recipes or shop stock for every new legend. Exclude legends from broad procedural merchant/crafting pools unless deliberately intended and balanced. Restoration recipes must consume the existing artifact rather than create extra copies. Sandbox spawning may exist with explicit tags and separate uniqueness accounting, never masquerading as naturally acquired history.

## 17. Ownership, uniqueness, transactions and replay safety

Every tangible weapon/manual/key/reward has explicit ownership or location. Distinguish a definition ID from a world-instance ID. If a weapon is unique, persist one artifact identity across unclaimed site, guardian/visitor inventory, carried expedition loot, personal bag, equipment, sect storage, sale or loss/recovery. A clue does not create another copy of an item already owned elsewhere.

Use one authoritative claim/grant/transfer path with validation and durable receipts. Suggested transaction sequence:
1. Validate instance/node state, claimant/party, target catalog, permissions and still-available site/item.
2. Reserve/verify unique identity and any finite source quantity.
3. Validate required costs and destination capacity; do not consume costs before a known failure without a declared loss rule.
4. Commit ownership/costs/progress and a stable claimId/receipt as one coherent mutation; rollback or return a defined safe failure if a step fails.
5. Emit logs/metrics from committed outcome only.

Repeated completion, duplicated events, multiple expedition wrappers, visitor departure callbacks, save/load and reentrant UI actions must return the same receipt/no-op, never pay twice. Grant success and physical delivery can be separate documented stages, but avoid marking a reward settled before any owner actually receives it. Test interruptions between supported stages.

Follow the actual expedition loot/handover system. Do not credit a legendary weapon to sect storage at discovery and again when returning. Preserve legitimate personal retention/donation policy, stock notification and non-routine gift logs. A defeated party cannot receive successful loot; a guardian defeat does not guarantee every other gate is passed.

If a unique artifact is already held when an old clue resurfaces, update the lead to the current holder or report it claimed, according to the story. Do not reset uniqueness when the item is sold, the owner dies, the world reloads or a new visitor repeats the rumor. Recovery/loss/decay rules must be explicit. Ordinary materials can have renewable sources, but their quantities and regeneration must remain finite/accounted.

## 18. Equipped visuals and integration with the graphics patch

Build on the newest renderer, not the older screenshot baseline. Each legendary weapon needs a recognizable shape/material/motif visible on its actual bearer at normal/close zoom, with sensible distant LOD.

Held, carried/sheathed or restrained orbiting presentation are valid. Use a floating/orbiting form only where its story/magic justifies it; not every sword needs to spin around the wielder. A heavy mundane-style blade can remain grounded and distinctive. Bow/fist/staff/focus silhouettes should actually match their type. Preserve the identity of existing legendary techniques, with complementary rather than competing effects.

Appearance must derive from the real equipped item and actual eligibility. Bag storage does not create a held-weapon effect. On unequip, breakage/dormancy, sale, death, departure, disguise/visibility changes and load, update appropriately. If an unusable item can still be carried visibly, show it as inactive and do not activate its combat aura. Unknown or old gear needs a safe fallback.

Render copies are presentation-only. Drawing, portraits, quality changes and inspection never alter gameplay RNG, stats, inventory, clue truth or AI. Use visual hashes/caches and bounded ambient motion. Preserve quality settings, reduced motion, pause policy, camera/picking and source/standalone asset embedding from the prior graphics patch. Support 100 members plus the declared guest/effect cap without unbounded per-frame world scans.

## 19. Player-facing interfaces, links and narrative

Thai is the player-facing language; English is acceptable for developer reports. Reuse the current menu structure and improve it where appropriate.

Provide inspectable views for active/recent visitors, an individual visitor's public identity/purpose/access state, known clues/investigations and relevant site/weapon/technique details. Show what is known, stale or uncertain; do not spoil all future nodes, true loot or hidden requirements on first contact. A debug inspector can reveal full truth separately and clearly.

A clue panel should answer: who told whom, what is believed, next known action, known costs/risk, who is investigating, why blocked/deferred and what actually happened. Never report a future step as completed. Support filtering/sorting and bounded history; avoid hundreds of modal popups.

Entity mentions with an available detail window should be clickable through stable typed IDs: visitor, member, item instance/definition, technique, site, clue or expedition. Historical departed/dead persons need a summary/detail fallback rather than links selecting a new same-name NPC. Resolve unknown/missing IDs gracefully. Never use display names as ownership or routing keys.

Log admissions/departures, meaningful sharing, investigations, real challenges, grants, transfers and important failure/abandonment events. Keep routine social chatter aggregated. Preserve earlier non-routine stock allocation reports, inventory usability and Edit Hub. Escape externally sourced text in HTML, validate save schemas and avoid executable narrative strings.

## 20. Persistence, migration and bounded runtime work

Persist visitors, offsite referenced identities, relationships, personal knowledge, clue graph state, site depletion, transaction receipts, item UIDs, uniqueness, cooldowns, pending party links and version metadata. Store plain serializable data; reconstruct functions/maps/caches on load.

Migration is idempotent. Old merchant records need safe defaults, not random new personality/wealth on every load. Missing old fields should not automatically spawn legendary opportunities or reset expired stock. Preserve already pending expeditions and older mixed gear records. Validate unknown IDs/versions without discarding unrelated valid saves. Keep active/historical templates compatible with instances already in progress or provide explicit migration.

Bound active visitors, active clue instances, remembered rumor aliases, per-person known-clue lists, historical logs, visual FX and AI candidate reviews. Preserve references needed by ongoing chains and relationships when compacting archives. Use event-driven or staggered review; do not run all-person/all-clue/all-site scoring each simulation tick. Avoid an endlessly growing offsite world simulation.

## 21. Immutable constraints

Never modify `JianghuSect_v1.10/js/human_core.js`. Expected reference SHA-256 is `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`, fingerprint `155:2f9c9dd7`. Verify before/after; if your newer baseline differs, report rather than copying an old file to fake compliance.

Preserve deterministic seeded gameplay, save/load, finite ownership, accounting, access rights, original sources and innate-only exclusivity. Preserve Phase 1–3, the technique patch, preceding NPC update and graphics update. Keep the 100-member capacity rule and correct food/reserve economics. Rendering is read-only with respect to authoritative gameplay. No cloud AI/API/backend or required network during play; research happens during development and must not become a runtime dependency.

Do not push/merge main or main-1 or claim Codex approval. If you work only in chat, say no Git commit/push was performed. Do not overwrite GitHub branches or download an old branch over the newest conversation source.

## 22. Implementation sequence with checkpoints

Execute autonomously through all checkpoints; adapt order where the actual architecture requires it.

A. Establish baseline, map existing systems and validate the catalog. Read the attached manifest/audit as shortcuts, verify changed interfaces, and produce the compact design/selection matrix. Research weapon candidates early.
B. Implement visitor lifecycle/entity/access integration and ordinary meaningful member interactions. Exercise arrivals, rejection, trader continuity, return visits and departure cleanup before adding rare content.
C. Implement persistent clue templates/instances, per-person knowledge, node handlers, costs, migration and exactly-once reward transactions. Complete an ordinary one-node item clue end-to-end.
D. Connect NPC investigation, duties, approvals, willing parties, travel, guardian/trial outcomes and handover. Complete a multi-node route with a genuine blocked/alternate/retreat case.
E. Add authored sources for selected ordinary content and the legendary arts, plus researched/original legendary weapons with functioning stats/effects/valuation/visuals. Validate the entire content registry, not just one demonstration route.
F. Add/refine Thai visitor/clue/site/item views, typed links, uncertainty/progress explanations and graphics settings integration.
G. Run focused failure/replay tests, the complete regression suite, natural seeded observations, controlled rare reachability and performance checks. Fix introduced regressions and verified related defects.
H. Package complete combined source, rebuilt offline standalone, portable diff and honest review reports.

After each checkpoint, ensure startup/save/load and previously completed flow still work. Do not end the assignment at A or after only the one-node demonstration. Do not write reports claiming later checkpoints are done before implementing/testing them.

## 23. Test matrix: prove behavior, not strings

Create meaningful tests with real runtime calls/transactions. No test may pass merely because a data record or success log exists. Reuse current loaders/fixtures and preserve existing coverage. Include negative and replay tests.

Visitor tests:
- Old/new trader records load, assets remain finite, ordinary guests enter/interact/leave, rejected visitors gain no access, returning identity/relationships persist.
- Guests do not count as admitted members, receive member payroll/welfare/office/CP or bypass the 100-member cap. Actual recruitment is separate and capacity-checked.
- Funds/stock on both sides reconcile. Free daily merchant payouts do not duplicate real trade.
- Departure/death clears stations/meetings/party reservations but preserves referenced knowledge/history. Permissions hold during every action, not only initial arrival.

Clue tests:
- One-stage and multi-stage successes, strict named targets, actual costs/travel/time, skill/physical/behavior gates, party specialist versus personal requirements, guardian combat/retreat and legitimate no-reward outcomes.
- Unknown steps remain unknown; repeated hearsay does not become omniscient corroboration. Merely opening a panel does not progress/reroll/consume budget.
- Wrong order, missing key, insufficient money, unauthorized library/stock access, guest already gone, stale/disproven lead, dead owner, failed party, cancelled/delegated plan and bounded retry paths.
- Save/load at every meaningful checkpoint; repeat completion/event/handover; two parties race for one site; no item/CP duplication, no lost unique ownership and no new reward after reload.
- Ordinary source pools still work, low-rank high-tier opportunity tails remain possible, generic low tiers dominate, no innate-only technique leaks through clue/trader/gift/grant paths. Acquisition never bypasses learning eligibility.
- Validate every authored graph: IDs/targets/handlers resolve, reachable states, no accidental cycles/unreachable rewards, no reward-as-sole-key deadlock, source restrictions and item instancing policy correct. Controlled valid fixtures should demonstrate reachability of every implemented reward route; rare natural completion is not required for this check.

Weapon tests:
- Every selected weapon can be created only through allowed production paths, carried, handed over, equipped/unequipped, sold/transferred/lost/recovered where supported and saved/loaded with intact identity.
- Stats and each declared effect change the actual combat/resource result; proc caps/costs/cooldowns work; mismatched builds and inactive/dormant conditions behave correctly. Check no effect recursion, q double-scaling or stale cached stats.
- Representative NPC choices reflect suitability and cost rather than rarity alone. Test a case where a legendary weapon is correctly declined.
- Visual equip/unequip/load/departure works; no hidden/offscreen disclosure, gameplay RNG changes, extra attacks from orbiting art or unbounded particles. Validate every visual key and safe fallback.

Regression/browser/performance:
- Run existing aggregate tests and the preceding NPC/graphics tests. Reference names include core_lock, external_market, recruitment_queue_review, autonomous_economy_facilities, recipe_scroll_lifecycle, martial_paths, combat_passives, cave_pools, patch_v1_12_suites, save_integrity, legacy_save, exploration_replay, input_cancellation, browser_mobile_perf, skill_visual_browser and standalone; verify current names.
- Source and rebuilt standalone boot; offline test with networking blocked. Check 360x800/412x860 mobile, desktop and landscape, Thai long text, tabs/filters, typed log links, map controls and actual guest/weapon rendering. Inspect screenshots and motion, not only DOM bounds.
- Benchmark a declared 100-member plus guest workload, active clues, dense effects and high speed. Report ms/tick, renderer/frame timing, effective ticks/sec/debt and bounded list/cache sizes. Desktop emulation is not proof of real-phone performance.
- Run at least three seeded natural simulations for a declared finite duration (suggest 180–360 in-game days if feasible). Count actual visitor/clue/investigation/grant/equip outcomes, ordinary work/economy continuity and distribution by source/tier/grade. Include a practical early-game route that can naturally progress. Separate forced/accelerated fixtures and natural observations.

If tools/time limits prevent a check, report it as NOT RUN with the exact missing capability/reproduction command. Do not manufacture PASS reports, silently remove failing tests or replace production calls with mocks that bypass the disputed logic.

## 24. Completion and delivery

Deliver downloadable artifacts, not instructions to assemble missing files:
1. Complete updated SOURCE ZIP: latest NPC + graphics + this visitor/clue/legendary-weapon patch, all source/data/tests/tools and required reference inputs. Exclude secrets, node_modules, caches and obsolete duplicate game archives; do not omit tests referenced by the runner.
2. Rebuilt self-contained offline `JianghuSect_single.html` or genuinely equivalent playable standalone. Update the build pipeline for any new modules/assets/fonts; do not hand-patch only the generated file.
3. Portable relative-path diff against the latest pre-this-patch baseline, including new/deleted files and the baseline artifact hash/commit where available.
4. `VISITORS_CLUES_IMPLEMENTATION_REPORT.md`: actual scope, bug/design changes, architecture, counts/IDs, probability funnel, unique/repeat policies, actual verification and limitations.
5. `LEGENDARY_WEAPON_RESEARCH.md`: sources, uncertainty, attribution versus adaptation/original design, selected/rejected candidate reasons.
6. `CLUE_SOURCE_CATALOG.json` or equivalent machine-readable table: template/target/source IDs, step count/branches, node types/gates, allowed knowledge, rewards, old/new acquisition routes, uniqueness/cooldowns and implementation status. Full production templates remain in the source too.
7. `VISITORS_CLUES_CODE_MAP.md`: entity/membership model, lifecycle/knowledge/progress state, hooks/wrapper order, transaction/ownership APIs, save migration, visuals and test commands.
8. `CODEX_VISITORS_CLUES_HANDOFF.md`: combined artifact checksums, baseline, important decisions/deviations, research limitations, actual commands/results, known concerns and precise reproduction steps. Include representative screenshots and small JSON/CSV metrics where available.
9. Updated current HANDOFF/next-task pointers reflecting actual completed/incomplete state. Preserve earlier NPC/graphics reports; do not falsely mark their review as passed.

In your final report explicitly distinguish: implemented and verified, implemented but unverified, deferred, and unsupported/replaced with reasons. List your creative contributions and better alternatives you adopted. No prose should imply a guardian fight, relationship change, journey or reward occurred unless the authoritative state changed accordingly.

Finish the coherent playable patch and its evidence. The author and Codex will later review and tune the combined work; deliver the best internally consistent version you can now.
