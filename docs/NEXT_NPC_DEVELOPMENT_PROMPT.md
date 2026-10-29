# ACTIVE GEMINI IMPLEMENTATION PROMPT — NPC LIFE, KNOWLEDGE AND AUTHORITY

Use this entire document as the next development assignment. The author authorizes implementation and delegates ordinary design choices to you. This document supersedes historical task instructions elsewhere in this repository. It does not claim that its requested features already exist.

## 1. Assignment and baseline

Develop the NPC simulation beyond the current short-term utility selection: meaningful dreams and goals, informed technique/equipment choices, social relationships that produce actions, competent office holders with real authority, personality-dependent use and abuse of power, social deference and flattery, and bounded inference/planning.

Inspect the code, identify defects and missing connections, choose a coherent architecture, implement it, test it, and return the complete updated game. Do not merely produce a design, add decorative fields, or stop after a single subsystem. You may invent better mechanics than the examples below. Explain significant choices and tradeoffs; do not ask the author to decide routine architecture or numerical parameters.

The supplied main-1 ZIP is the starting point. Reviewed runtime baseline before this documentation update: `c0f277d8f3a48effe6f3d9c0d26ee79bd886e4a1`, integrating BOTH Gemini Phase 1–3 and technique v1.12. The documentation commit containing this prompt is later. If a supplied checkout is newer, inspect the intervening commits and preserve them. Record the exact actual revision if available; for a source ZIP without verifiable revision, state that limitation. Never fetch older GitHub code and overwrite newer supplied work.

Use an isolated working copy, preserve the supplied baseline, and maintain a changed-file manifest. Do not reset or discard concurrent changes. If working in chat without GitHub access, return files; do not claim to have committed or pushed. If using Git, work only on a separate development branch. Do not push/merge main or main-1; Codex performs independent review and integration.

## 2. Hard invariants

- NEVER modify `JianghuSect_v1.10/js/human_core.js`. Expected SHA-256: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`. Verify before/after and run the existing lock test. Never change the expected checksum to disguise modifications.
- Preserve seeded gameplay RNG; cosmetic rendering must not consume it. Do not use wall-clock timing or Math.random for NPC outcomes.
- Preserve finite inventory, item identity, currency accounting, permissions, stable IDs, stage-derived world rank and idempotent transactions. Real actions must produce real consequences.
- Preserve existing recruitment, facilities, 100-member capacity, Edit Hub, inventories, logs, technique grades, hierarchical acquisition, multi-move skills, learned passive slots, innate subpath exclusivity, legendary rarity and save compatibility.
- A stronger NPC decision system does not authorize silently changing stat balance, free equipment, free learning, extra starting knowledge, or bypassing progression to make decisions succeed.
- Do not describe a display string, database entry or API as a working behavior unless an actual runtime path uses it.
- Do not claim tests, simulations, files or commands were executed unless they actually were. Label unavailable execution and remaining defects precisely.

## 3. Inspect the real existing systems first

The active project is `JianghuSect_v1.10/`. Inspect its loader, index.html and current modules. `SOURCE_REFERENCE/` is archival material, not the runtime to modify.

Relevant starting points (verify current interfaces; do not assume these names are unchanged):
- `js/cognition.js`: COG.prepare/modifiers/finished/remember/explain, office decisions, mission bias, medicine sharing, hunting memories.
- `js/ai.js`: utility selection, top-candidate limits, action start/interruption/completion, pair invitations, teaching, sparring, arguments, leisure.
- `js/martial.js`, `skills.js`, `knowledge.js`, `proficiency.js`, `stats.js`, `cultivation.js`, `retraining.js`: technique eligibility, effects, affinities, gear suitability, passives, mastery, synergies, innate arts.
- `js/sect.js`, `cpeco.js`, `economy.js`, `external_market.js`: office authority, resources, allocation, learning fees, demand, reserves, trade and corruption/accounting behavior.
- `js/expedition.js`, `explore.js`, `wildlife.js`, `wild_resources.js`, `world_map.js`: party formation, approvals, spatial danger, encounters, real harvesting/hunting, facilities and pathing.
- `js/sim.js`, `ui.js`, `render.js`: lifecycle, persistence, explanations, stable-ID log links, runtime and visual state.

Existing short-term goals, social activities, office behavior and leisure must be extended where appropriate, not duplicated under new labels. Existing leisure already includes tea, music, strolling, viewing and fishing; pair activities include conversation, teaching, sparring and other interactions. Verify exact current behavior.

Audit suspicious existing logic before building on it. Examples previously noticed in earlier snapshots, NOT yet confirmed as defects in your current baseline:
- generic activity completion can refresh a goal's lastProgress without proving actual progress;
- top-six utility filtering may starve relevant goals or recovery actions;
- social invitation selection may allow interruption of tasks that should be protected;
- a known goal may expire instead of being decomposed or resumed;
- structured received-help memories may be stored without meaningful future consumers.

Create a short status matrix: existing/working, existing/unverified, confirmed defect, and new work. State evidence. Fix confirmed defects with behavioral regressions. Do not simply relabel design preferences as bugs.

## 4. Persistent aspirations and multi-horizon goals

Build a coherent relationship between:
1. Long-term dreams/aspirations: a desired feasible life direction, persisting over months/years when appropriate.
2. Medium-term goals/projects: meaningful steps toward an aspiration, spanning multiple days or longer.
3. Short-term intentions: immediate plans using current resources and opportunities.
4. Current action: what the character is doing now, with emergency interruption and realistic opportunity cost.

Dreams must concern things the game can actually support. Examples: becoming a skilled sword practitioner, useful healer, respected teacher, artisan, wealthy trader, dependable guardian, office holder, trusted mentor, or a higher-stage cultivator. Inspect actual roles and capabilities. Do not promise playable careers absent from the runtime. Not everyone should want power, wealth or leadership; some prefer stability, companionship, craft, freedom or helping family.

Personality, values, aptitude as privately experienced capability, interests, life stage, relationships, current circumstances and meaningful experiences may influence aspirations. A character may be uncertain, rest, compromise, change direction or abandon a goal. Do not make all NPCs flawless optimizers or force universal ambition. Preserve individuality without generating random goal churn.

Represent progress with actual predicates: money reserved/earned, material acquired, compatible teacher found, technique learned, work completed, relationship event, appointment, survival or another genuine milestone. Finishing unrelated work must not count as progress. Use stable target IDs and sensible completion/failure/suspension states. Distinguish success, expiry, abandonment, invalid target, blocked prerequisite and temporary interruption.

Examples of real plan chains, not mandatory fixed scripts:
- choose an attainable manual -> identify missing permission/CP -> earn/save -> seek access -> study -> practice -> reevaluate;
- need better gear -> determine compatible alternatives -> inspect accessible stock/market -> afford or produce -> acquire -> equip -> stop shopping when satisfied;
- want to help an injured friend -> verify need/consent -> obtain an actually accessible remedy -> deliver/use -> observe outcome;
- aspire to a profession -> practice relevant work -> learn available knowledge -> fulfill real needs -> build reputation and eligibility.

Keep planning bounded and revisable. Do not store a giant action tree or plan years of exact ticks. Define success/failure checks, fallback options, cooldowns, resource conflicts and priority arbitration. Immediate danger, hunger and injury can suspend a long plan without erasing the aspiration. Do not reserve resources forever or prevent voluntary spending through absolute optimizer locks.

## 5. Knowledge, uncertainty, inference and forecasting

NPC decisions should depend on information they plausibly possess or can access. Define knowledge scopes and observable evidence for decisions, rather than exposing all world truth to everyone.

Examples: own inventory/learned skills; permitted library and shop information; stock visible under actual access rights; observed equipment/performance; known relationships; witnessed events; announcements; office reports; remembered danger. Separate objective state, private belief and public information. Use confidence, recency and provenance only where they affect decisions; avoid decorative belief systems.

Allow bounded inference: estimate whether a planned purchase is affordable, whether ingredients are missing, whether a trip is risky from observed evidence, whether someone may accept an invitation, or whether foreseeable maintenance exceeds reserves. These estimates may be wrong and should update from outcomes. Do not infer hidden PA, secret traits, unseen crimes or future RNG results from omniscient state.

Forecast using inexpensive heuristics grounded in actual rules and observed history. Do not clone and simulate the whole world for every NPC every tick. Do not repeatedly roll many possible futures and choose a lucky one. Record key assumptions so the UI can explain an estimate as an estimate, not a fact.

Preserve existing CA/PA privacy for applicant assessment. Respect access rights when adding knowledge propagation. A stock update need not telepathically inform every member immediately; use existing supported visibility/review cadence.

## 6. Deliberate technique learning and use

NPCs should evaluate techniques they can actually discover, acquire or learn from their current knowledge/access. Separate knowing that a technique exists from owning it, having permission, affording study, learning it, unlocking moves and actively using it.

Evaluate more than tier/power:
- major path/subpath and innate synergies;
- current equipment and realistic acquisition options;
- combat role, survival needs, control/support and team needs;
- costs, cooldowns, speed, targeting, drawbacks, mastery and stage unlocks;
- existing techniques and redundancy;
- passive family exclusivity, active slots and conditional bonuses;
- interests, temperament, resource availability and personal goals.

Use current implemented effects rather than name/flavor alone. Preserve hard requirements versus soft preferences: mismatched equipment may reduce efficiency rather than forbid use. Respect fees, library rights, ordinary retraining costs, innate-only restrictions, legendary sources and real ownership.

Create meaningful plans for learning when a desired technique is attainable but not yet affordable. Avoid endless saving for unreachable entries or repeatedly purchasing the same knowledge. NPCs should choose and use suitable unlocked moves/passives, not merely learn them and leave them inactive. Compare behavior before/after in controlled scenarios and native simulation. Do not guarantee optimal choices for every personality.

## 7. Equipment judgment and real acquisition

Extend or reuse the existing gearSuitability and equip logic. Consider weapon/armor type, requirements, actual effective stats, current techniques, synergy, condition if supported, role, resource costs and alternatives. Do not define suitability solely as the highest tier or raw attack.

A low-tier compatible weapon may be preferable to an incompatible expensive one. An upgrade may be unaffordable or unnecessary. Define hysteresis/opportunity cost to prevent constant equipment switching and shopping loops. Distinguish valuable-to-own, useful-now, gift-worthy and legitimate surplus.

All acquisitions, gifts, trades, equipping and disposal must move real items exactly once. A member cannot take sect stock merely because it is desirable. Preserve allocations, reserves and transaction accounting. Make decisions inspectable and ensure AI valuation sees the same bonuses as actual combat/stat calculations.

## 8. Relationships must cause actions and consequences

Affection, trust, gratitude, respect, rivalry and fear should have distinct meanings if introduced. Reuse relevant existing fields rather than creating incompatible duplicates. No single friendship scalar should determine every response.

Friends may train together, share information, offer feasible help, give suitable items, invite one another on approved hunts/exploration, introduce a teacher, comfort someone or decline a request for a reason. Rivals may compete, avoid one another or cooperate under shared danger. Mentors should select useful teaching within what they know and students can learn; verify actual learning transfer, not just a friendship notification.

Shared hunting/travel must use the existing real party/approval/combat/loot systems. Invitations require meaningful consent, availability, strength/risk assessment and coherent movement. Do not duplicate actors, teleport companions, override expedition rank, or give the same loot twice. Preserve personal agency, injury/rest needs, essential work and safe-belt restrictions.

Consent/interruption is a shared system concern: protect critical actions and reservations; refuse or defer invitations when appropriate; release resources when a real interruption occurs; handle waiting, failure to arrive, target departure/death, cancellation and save/load mid-invitation.

Relationships may change after observable outcomes: kept/broken commitments, help received, unfair allocation, danger shared. Avoid unbounded gratitude farming, spam, trivial repetitive gifts and forced friendship quotas. Report natural frequencies and zero-event outcomes honestly.

## 9. Office holders: duties, jurisdiction and actual authority

Implement or strengthen a consistent authority model for actual appointments, acting officers and delegates. A high numerical rank alone is not proof of holding an office. Losing office, absence, death, imprisonment or incapacity must update authority and outstanding decisions.

Relevant examples depend on real existing systems:
- master/deputy: policy, delegation, priorities and legitimate appointments;
- registry: applicant processing and records within capacity/privacy rules;
- treasury: allocation, accounting, reserves and permitted surplus sale;
- alchemy/forge heads: useful production planning with real inputs;
- martial/guard/mission officers: training, security and expeditions;
- healer: feasible care priorities;
- discipline: investigation using evidence and actual jurisdiction.

Do not give everyone powers their office does not hold. Make orders actionable with target, reason, priority, resource authorization, validity and expiry where needed. Orders can be unavailable, refused, deferred or superseded; do not leave stale commands permanently controlling NPCs.

Workers should perform useful actual work related to duties and needs, with costs, stations, travel and completion. Do not reward infinite symbolic duty events that never change the relevant problem. Distinguish competent administration from physical labor. Preserve delegation and members' independent needs.

## 10. Personality-dependent use and abuse of power

The author explicitly wants authority that can serve the sect, friends or the holder's personal interest, depending on personality and circumstances.

Possible behavior: fair need-based gifts, favoritism, self-serving appointments or allocations, selective enforcement, withholding help or redirecting legitimate surplus. Choose a bounded coherent subset that the current economy and role model can actually support. Extend existing corruption/accounting mechanisms rather than creating invisible duplicated ones.

Every action must remain mechanically valid: actual authority, actual stock/funds, ownership, audit trail, opportunity and observable consequences. Do not manufacture items, fabricate evidence, make unsupported accusations or let officers see hidden intentions automatically.

Accountability should use available evidence and institutional rules. Different leaders may tolerate, investigate or respond differently. Do not automatically punish every suspicion or force every office holder to become corrupt. Good and self-interested choices need personality-sensitive opportunity and consequences, not arbitrary random crime events.

## 11. Respect, deference, fear and flattery

The master and senior office-holding elders should receive plausible deference/respect, influenced by office legitimacy, seniority, performance, reputation, personal relationships and behavior. Do not force all members to love or obey them. A person can fear authority without affection, respect competence while disliking someone, or privately resent a superior while complying.

Make these attitudes affect invitations, refusals, requests, speaking up, following legitimate orders, complaints, mentoring, appointments and allocation where appropriate. Do not turn respect into universal stat bonuses.

Some NPCs may flatter influential people when consistent with personality and goals. Recipients may welcome, distrust, dislike or ignore flattery depending on their own traits and evidence. Do not make the recipient omniscient about hidden motives. Flattery should cost time/opportunity, have bounded frequency, and never guarantee affection, promotion or rewards. Counter repetitive exploitation and feedback loops.

Give this behavior observable actions and consequences. Descriptive text alone is insufficient. Do not simulate prejudice or personal advantage through unexplained universal bonuses disconnected from authority.

## 12. Broader life and outside contact

You may improve other NPC behavior discovered during inspection: meaningful rest/leisure, helping newcomers, teaching, work-life conflicts, grief/recovery, social routines, existing visitor contact and reactions to shortages or weather. Keep these tied to real systems and actual personality differences.

Do not expand an entire diplomacy/visitor world merely to meet this patch. The future visitor roadmap is optional background: connect existing supported encounters if useful, or explicitly leave the larger visitor expansion for later. Graphics overhaul is not required; readable activity/status feedback is appropriate.

## 12A. Codex design seeds and explicit freedom to discover better work

The author wants you to think independently, not simply implement a checklist. After inspecting the real code, identify additional high-value opportunities to make NPC life coherent, believable and interesting. Explain what problem each opportunity solves and what evidence motivated it. You may implement ideas absent from this document, replace weak suggestions with better ones, and redesign existing mechanisms as needed within the hard invariants.

Codex proposes the following optional directions:

- **Commitments and reliability:** invitations and accepted duties can form bounded commitments. Arrival, cancellation and actual delivery affect trust. Distinguish understandable failure (injury/emergency) from neglect, using information the observer actually has. Do not punish every interruption.
- **Delegation and handover:** an unavailable officer can hand off a valid task to an authorized, willing person, with ownership and resource reservations transferred exactly once. A replacement officer should understand outstanding work without inheriting stale authority.
- **Apprenticeship with concrete lessons:** a student requests a feasible lesson; a mentor chooses something useful they genuinely know, considers time and willingness, and reviews observable progress. Preserve learning eligibility and finite costs; do not automatically transfer every secret technique.
- **Needs and complaints:** members may request equipment, treatment, training or fair allocation. Officials prioritize with actual resources and explain decisions. A refused request can be justified; repeated apparent favoritism may affect trust without broadcasting private information.
- **Personal boundaries and reciprocal help:** generosity, gratitude, dependence and exploitation can influence future help. Friends may refuse unsafe or unaffordable requests. Avoid turning every kindness into a rigid immediate debt.
- **Coping with setbacks:** failed learning, a dangerous hunt, losing a friend or missing an appointment can cause preparation, caution, seeking help, rest or goal revision. Avoid permanent despair loops and universal personality changes from one event.
- **Availability and appointments:** short plans for shared practice or work can reduce repeatedly interrupting people. Late or unavailable targets should cause bounded waiting and cancellation, not permanent paralysis.
- **Reputation by context:** a person can be trusted as a healer but not as a treasurer. Use a small set of meaningful, evidence-based judgments if needed, rather than unlimited reputation dimensions or omniscient ratings.
- **Different horizons and risk attitudes:** cautious members prepare, impulsive ones may act sooner, disciplined members persist and curious members explore alternatives. All still obey basic eligibility and ownership rules.
- **Selective communication:** announcements and plausible reports can spread actionable knowledge to relevant people. Distinguish observed facts, estimates and unverified claims. Do not introduce an elaborate rumor/crime subsystem unless it serves an implemented decision and can be tested.
- **Continuity of identity:** dreams, relationships and formative outcomes should be recognizable over time, while still allowing growth. Logs should show meaningful life changes, not mechanically generated biographies disconnected from play.

These are seeds, not mandatory feature quotas or fixed algorithms. Produce an opportunity matrix with benefit, dependencies, risk, cost and testability. Select and implement a coherent set of your additional ideas alongside the core requirements. Explicitly list other ideas deferred and why. Do not claim all suggestions implemented if you selected only some. Do not expand into an unrelated whole new game merely because you have creative freedom.

Your creative authority covers architecture, decision rules, new supported activities, role interactions, UI explanations and emergent social mechanisms. The author expects your own judgment and invention. Correctness, preserved player data, observable consequences and honest evidence remain mandatory.

## 13. Explainability, UI and logs

Show concise Thai player-facing explanations:
- dream/long-term direction;
- current goal and next useful step;
- actual progress and missing prerequisites;
- suspended/blocked reason;
- why a technique, weapon, invitation or official decision was chosen;
- uncertain estimates clearly labeled;
- meaningful relationship or authority outcomes.

Reuse character windows and stable-ID clickable logs. Distinguish private internal motivation from what other NPCs know. Do not expose hidden PA through an applicant appraisal or grant omniscient knowledge to NPCs because a player/debug panel can see it.

Keep logs bounded and filtered; log consequential events and meaningful transitions rather than every score evaluation. Escape names and handle missing/renamed targets, duplicate names and old log entries. Update standalone HTML and mobile UI. Do not block the playfield with large debug panels.

## 14. Persistence, architecture and performance

You choose the architecture after inspecting current interfaces: utility scoring, light hierarchical planning, event-driven state and bounded memory can be combined. Do not impose a heavyweight general planner for its own sake.

Use focused modules and shared APIs for authority, invitations, knowledge and valuation where useful. Avoid giant duplicate overrides, conflicting score paths, global mutable scratch fields, and rewriting the engine unnecessarily.

Bound per-NPC data, memory, reviews, relationship scans, candidate lists and retries. Stagger expensive reviews, invalidate caches correctly and use actual state changes. Shared plans/parties need stable IDs, explicit ownership, cancellation and atomic state transitions.

Preserve old saves with idempotent versioned migrations. Default missing fields safely; do not replace a saved aspiration on every load. Handle changed jobs, dead/absent targets, invalid techniques, ended relationships and interrupted actions. Never reward completion repeatedly after load.

Measure with 100 NPCs, including relationship-heavy and busy-office cases. Compare relevant timing against the same baseline on the same machine. State actual observations rather than promising universal FPS. Preserve deterministic behavior through saving/loading where supported; identify incidental data-order changes rather than hiding them.

## 15. Acceptance tests and evidence

Add behavioral regressions. For a confirmed bug, reproduce the original failure before fixing it when execution is available. Do not test only duplicated formulas, static strings, mocked success or direct completion calls while claiming natural autonomy.

Required controlled tests:
- aspirations persist through short emergencies, with realistic reassessment;
- unrelated actions do not advance a specific goal;
- genuine milestones complete goals; blocked plans suspend/replan without thrashing;
- limited knowledge changes decisions; NPCs do not use inaccessible/hidden information;
- same visible appraisal with different hidden PA does not leak potential;
- technique and gear choices account for different builds, affordability, conditions and alternatives;
- learned/equipped/passive/move eligibility remains enforced;
- invitations can be accepted, refused, deferred and cancelled without corrupting work/ownership;
- friends can undertake real supported shared activity; refusals remain possible;
- office holders act within jurisdiction, and revoked/absent authority cannot issue effective orders;
- lawful personal advantage/favoritism affects actual allocation with finite resources;
- respect/relationship/personality counterfactuals alter plausible choices without guaranteeing them;
- flattery recipients can respond differently and cannot be farmed without limits;
- save/load mid-goal, invitation, official order and shared activity preserves validity;
- legacy saves, invalid targets and dead members are handled safely;
- bounded memory/log size, no duplicate rewards or invitation/proc loops.

Run the entire regression suite, core lock, standalone verification and real browser checks after final code changes. Previous integration passed 58 groups; counts may change as meaningful tests are added. Those old results are not evidence your update passes.

The existing `technique_overhaul_suites.js` and `patch_v1_12_suites.js` were reconstructed by Codex because Gemini's original tests were absent from the upload. They cover only limited catalog/discovery checks. Do not represent them as exhaustive validation of the technique system.

Run at least three reproducible native seeds for 360 game days if tools/resources permit, plus controlled 100-member workloads. Measure natural, not forced, behavior:
- goals created/completed/abandoned/blocked and time-to-progress;
- aspiration continuity and revision;
- actual purchases, study, equipment changes, passive/move use and mastery;
- invitations proposed/accepted/refused/cancelled and completed shared activities;
- useful official work, allocations, resources spent, accountability outcomes;
- helping, teaching, respect/flattery interactions and observed consequences;
- time budgets (including travel), food/population/deaths, money/CP mint/burn/prices;
- runtime and memory/log growth, crashes/NaN/invalid states.

Zero observed events are zero, not proof that the route works. Separate controlled tests, statistical tests, natural simulation and unexecuted checks. Do not force participation quotas or grant resources to manufacture successful metrics. Compare with baseline to identify regressions and uncertainty, not to claim causation from a single seed.

If commands/browser execution are unavailable, deliver runnable tests and explicitly mark them unrun; do not invent successful results. Report every remaining failed or skipped check by name and diagnosis.

## 16. Delivery and execution

Complete this assignment through implementation and packaging. Internal milestones are recommended: baseline audit; goals/knowledge; technique/gear decisions; relationships and invitations; authority/social behavior; persistence/UI; full validation. Continue through them rather than returning only a plan or the first milestone.

Deliver:
1. Complete updated source ZIP, preserving required reference/packaging dependencies and all new tests.
2. Rebuilt playable standalone HTML matching the delivered source.
3. Portable source patch against the recorded starting snapshot, with relative paths (no private machine absolute paths).
4. NPC architecture/code map: systems, entry points, persisted schemas, permissions, resource ownership, decision flow and actual behavior hooks.
5. Bug-fix report with reproductions and evidence.
6. Behavior/design matrix: existing reused behavior, new runtime behavior, unsupported/deferred features, significant creative choices and tradeoffs.
7. Fresh test/simulation/performance results with exact commands, seeds, durations and actual outcomes.
8. Save migration instructions and limitations.
9. Updated HANDOFF.md for Codex with baseline identity, changed files, known risks and explicit next review steps.

Do not include credentials, .git, dependency caches or unrelated historical ZIPs. Do not drop tests from the package while leaving their names in run_all.js. Validate ZIP CRC, required files, standalone/source consistency and the byte lock.

If context is resumed, persist and read the baseline, completed-ID/task manifest, current changes, test outcomes and outstanding risks. Continue without losing prior work. Do not call a feature complete because it only appears in documentation.

Begin with an inspection of the supplied current main-1 source, then implement and validate a coherent NPC update. The examples are optional design seeds; meeting the functional goals and preserving correctness are mandatory.
