# MASTER AUTONOMOUS ENGINEERING PROMPT
## JianghuSect — v2.0.2 Continuation, Source Audit, Systems Repair & Gameplay Coherence

**ROLE:** Act as the autonomous principal gameplay engineer, simulation architect, systems designer, economy designer, UI/UX engineer, technical designer, QA lead, and release engineer for the existing JianghuSect project.

**INPUTS:** The user is supplying the game source/archive separately. Inspect the actual attached game files. This prompt is the engineering brief and historical product-context reference; it is not a substitute for inspecting the source.

**BASELINE INTENT:** Continue the existing project from its latest supplied **v2.0.2** game state. Do not downgrade, recreate, restart, or replace the project with an older version.

---

# 0. PRIMARY MISSION

Audit the supplied game files, understand the actual architecture and current implementation, identify defects and design inconsistencies, then improve the existing game.

The work must include:

1. Source/archive inspection and version identification.
2. A source-backed audit of requested systems and any additional illogical or incomplete systems discovered.
3. Independent design reasoning: challenge this prompt and the historical assumptions where appropriate.
4. Implementation of the highest-priority, high-confidence fixes.
5. Regression, integration, simulation, browser, mobile-layout, and save/load testing.
6. A complete, clean, verified release package containing the updated game and essential documentation.

**Do not stop after writing an audit or a plan.** Continue into implementation and testing unless there is a genuine blocker. If a blocker exists, complete every independent task that can safely proceed and explain the exact blocker.

The user has already invested substantial time developing this codebase. Preserve that work. The objective is to advance the existing game, not to make the user repeat previous work.

---

# 1. AUTONOMY, CRITICAL THINKING & DESIGN AUTHORITY

The user explicitly authorizes you to think independently, identify better approaches, and make sound engineering decisions without asking for routine approval.

Treat the user's statements as **product intent and desired outcomes**, not necessarily as technically perfect implementation instructions.

For every significant requirement:

1. Inspect the current source and trace the actual data flow.
2. Determine whether the feature is absent, partially implemented, present but inaccessible in the UI, blocked by validation, or broken by an integration defect.
3. Reproduce the behavior using the actual UI and authoritative APIs.
4. Identify edge cases, ownership problems, invalid state transitions, economic exploits, progression conflicts, balance problems, save corruption risks, performance costs, and UX inconsistencies.
5. Evaluate whether the proposed behavior is internally consistent with the simulation.
6. If a better architecture or gameplay rule achieves the user's intent more coherently, choose it and implement it.
7. Record important decisions, trade-offs, and rejected alternatives.

Use decision labels such as:

- `RETAIN` — existing implementation is sound.
- `REFINE` — retain the architecture but improve behavior or coverage.
- `REPLACE` — replace a flawed mechanism with a better one while preserving product intent.
- `DEFER` — defer only when a concrete dependency or technical limitation makes implementation unsafe.

**Do not blindly obey this prompt.** The prompt itself, old reports, existing code, and prior assumptions may contain mistakes. Detect them. Think creatively. Use sound engineering judgment. Prefer the most coherent, robust, maintainable, simulation-consistent solution.

Do not invent a feature merely to satisfy a checklist if it creates contradictory game rules. Conversely, do not omit a user-requested outcome just because the current architecture makes it inconvenient.

Do not ask the user to repeat information already contained here. Make reasonable decisions autonomously.

---

# 2. SOURCE OF TRUTH, VERSION CONTROL & SAFETY

## 2.1 Inspect the actual supplied game

- Inspect every supplied game archive/file and identify the authoritative latest source.
- Confirm the release/version from internal metadata, manifests, runtime constants, changelogs, and source contents.
- The intended baseline is **JianghuSect v2.0.2**.
- Do not infer the game version from an old folder name such as `JianghuSect_v1.10`.
- Do not use an older v1.12.x or v1.12.4 snapshot as the implementation baseline if the supplied v2.0.2 source is available.
- If multiple archives are supplied, compare manifests, source hashes, version markers, and patch history. Select the latest internally consistent source, not merely the file with the newest timestamp.
- Never silently mix files from different releases.
- If the supplied game files cannot be opened or the source is incomplete, state exactly what is inaccessible or missing. Do not pretend to have inspected or modified files.

## 2.2 No unrelated remote repository

The user has clarified that this work is based on the game files and project conversation, not on a GitHub repository. Do not assume a remote repository or branch is authoritative. Do not switch the task to GitHub or reconstruct the game from remote history.

Use the supplied game source as the implementation baseline.

## 2.3 Protect the existing core

The v2.0.2 audit history identifies a protected Human Core with:

- Fingerprint: `155:2f9c9dd7`
- Previously verified SHA-256: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`

Verify this against the actual supplied source. If it matches, keep the protected Human Core byte-for-byte unchanged unless an unavoidable blocker is demonstrated. Prefer wrappers, adapters, and extensions over modifying the protected core.

## 2.4 Source and release rules

- Edit modular source, not only the generated standalone HTML.
- Rebuild the standalone from the actual source using the project's existing build mechanism.
- Preserve offline operation; do not introduce undeclared CDN, network, or external runtime dependencies.
- Keep source readable, modular, and testable.
- Old-save backward compatibility is not mandatory if a clean schema redesign is justified. New-schema save/load, data validation, ownership integrity, and deterministic behavior are mandatory.
- Do not report success until the actual output archive has been extracted and verified.

---

# 3. PROJECT IDENTITY & GAMEPLAY PHILOSOPHY

JianghuSect is a persistent cultivation-world and sect-management simulation.

The sect/base is the player's primary operational hub, but the world must continue to function autonomously. NPCs are persistent agents, not decorative counters or scripted menu entries.

The player should shape the world through leadership, policy, incentives, facilities, bounties, resource allocation, diplomacy, and strategic decisions rather than micromanaging every NPC action.

NPCs may independently:

- Work, gather, craft, cultivate, train, study, teach, trade, socialize, and pursue goals.
- Donate, request, buy, sell, and allocate resources according to their circumstances.
- Explore, join expeditions, encounter danger, fight, become injured, recover, return, leave, or die.
- Develop relationships, rivalries, loyalties, memories, preferences, and long-term ambitions.
- Change roles, improve skills, acquire knowledge, and respond to sect policy and leadership.

Actions must produce persistent and economically coherent consequences.

## 3.1 Canonical Human Core

The project has a multidimensional identity/state architecture. Historical project context identifies a 155-field/axis Human Core with:

- 14 personality dimensions.
- 8 core values.
- 6 aptitudes in the verified core-lock test.
- Physiological, cognitive, social, temperament, interest, affinity, skill, history, and other identity/state dimensions.
- A canonical `h.affinities` object with 23 fields: 8 elemental affinities and 15 martial/craft affinities.

Preserve the actual source's canonical schema. Do not replace it with a simplified personality model, a parallel identity engine, or a disconnected 68-axis model.

NPC decision-making must be bounded by actual knowledge, access, resources, legal requirements, role, path compatibility, and available opportunities. Personality, interests, values, social context, risk tolerance, and preferences should influence choices, but must not override hard eligibility gates.

Use existing decision authorities and adapters wherever possible. Do not create a second AI scoring system that conflicts with the current one.

## 3.2 Cultivation and elemental foundation

The established elemental architecture includes:

- Eight ordinary birth-root elements: `FIRE`, `WATER_ICE`, `LIGHTNING`, `WIND`, `EARTH_METAL`, `WOOD_LIFE`, `YIN_SHADOW`, `LIGHT_YANG`.
- Special elements: `ASTRAL` and `BLOOD_DEMON`.
- Explicit `NEUTRAL` handling.
- One-to-four roots only; no five-root state.
- Independent per-root grades.
- A conservative aggregate adapter for legacy scalar consumers.
- Elemental mastery separate from technique-specific mastery.

Keep root count, rarity, affinity, per-root grade, elemental mastery, and technique mastery semantically distinct. Do not introduce hidden global power multipliers merely because a character has more roots or a rarer root.

Generation probabilities and rarity metadata must use the same probability model.

The historical calibrated model was approximately:

- One root: 97.899974%.
- Two roots: 2.0%.
- Three roots: 0.1%.
- Four roots: approximately 1 in 3.9 million generated characters.

Verify the current implementation before changing these numbers.

## 3.3 Systems to preserve

Do not destabilize or remove existing systems merely because the current work focuses on economy and UI:

- Sect warehouse, shop, Contribution Points, Spirit Stones, external traders, library, welfare, recruitment, offices, policies, leadership, and facilities.
- NPC cognition, autonomy, social behavior, relationships, teaching, memories, goals, and life simulation.
- Cultivation, specialization tracks, breakthroughs, tribulations, retraining, and progression.
- Combat, weapons, equipment, passives, skill effects, and elemental interactions.
- Alchemy, pills, crafting, forging, recipes, materials, rare organs, and research.
- Expeditions, exploration, caves, other worlds, wildlife, beast ecology, visitors, merchants, clues, fishing, and world events.
- Existing simulation speed controls, especially high-speed modes such as ×16 and ×32.
- Offline standalone HTML operation.

The user primarily plays on Android and has identified a Snapdragon 8 Elite-class device. Design mobile-first and optimize simulation performance, but do not claim physical-device certification without testing on a real device.

---

# 4. PRIORITY A — EDIT HUB: TECHNIQUE CRYSTALS & SPECIALIZATION CRYSTALS

## Historical source-audit finding — revalidate against the attached source

The previous audit of the supplied v2.0.2 package found:

- `EDITOR.catalog()` generated `CRYSTAL` entries by iterating `CULT.subList`, creating specialization-crystal keys `S:<subId>`.
- It did not emit technique-crystal keys `T:<techniqueId>`.
- The lower-level `EDITOR.spawnItem()` path already accepted both `T:` and `S:` keys.
- The UI labeled the crystal category as specialization crystals only.

This suggests a catalog/discoverability integration gap rather than a wholly absent spawn implementation. Revalidate against the actual source.

## Required outcome

The Edit Hub must expose both:

1. **Technique Crystals** — canonical keys `T:<techniqueId>`.
2. **Specialization/Subpath Crystals** — canonical keys `S:<subpathId>`.

Requirements:

- Include all valid, non-innate crystallizable techniques.
- Include all valid specialization/subpath crystals.
- Use canonical IDs and metadata.
- Make the two crystal families visually distinguishable through filters, subcategories, or an equivalent clear interaction.
- Exclude innate-only or non-crystallizable techniques with explicit validation.
- Search by name, stable ID, path/subpath, tier, grade, rarity, element, weapon/discipline, and effect terms where supported.
- Do not silently truncate high-tier or legendary catalog entries.
- Support legal destinations such as personal inventory and sect inventory.
- Preserve quantity, provenance, stable identity, and item metadata.
- Verify actual UI spawn, inventory appearance, use/donation/trade behavior, and save/load.
- Test both `T:` and `S:` through the real UI; API-only tests are insufficient.

---

# 5. PRIORITY B — SECT LIBRARY & MEMBER STUDY

## User intent

The sect interface must have a dedicated Library tab so the player can inspect what knowledge the sect owns and what members can study using Contribution Points.

A manual spawned or otherwise acquired by the sect must become genuinely available to eligible members. Do not let a manual silently remain unused in a data structure that the player cannot inspect or access.

## Separate these concepts

- Main technique knowledge owned by the sect.
- Secondary-path/subpath knowledge owned by the sect.
- Physical technique-manual copies.
- Physical subpath-manual copies.
- Technique crystals and specialization crystals.
- A member's learned knowledge.
- A member's current study/progression state.

Knowledge ownership is not the same as physical item inventory. A physical crystal is not a permanent library record. Do not conflate these entities.

## Required UI

Add a dedicated sect **Library** tab with at least:

1. Main Technique Library.
2. Secondary-Path / Subpath Library.

For each entry, show relevant player-facing information:

- Localized name and description.
- Main path and subpath.
- Tier, stage, grade, and rarity.
- Elemental profile and weapon/discipline compatibility.
- Access requirements.
- Contribution Point study cost.
- Whether the selected member can study it now.
- Whether the member already knows it or is currently studying it.
- Explicit reasons for blocked eligibility.

Provide a member selector or equivalent member-context mechanism.

## Study integration

Reuse existing authoritative study methods rather than rebuilding duplicate logic.

Historical source inspection found:

- Main technique study already used a `MARTIAL.startStudy()` path through the sect shop.
- `MARTIAL.studySubpath()` and `MARTIAL.pickSubStudy()` existed and were used by NPC AI.
- The player-facing sect-library action for subpath study was missing.
- The shop did not build study entries from `W.sect.subLibrary`.

Revalidate these facts before implementation.

Requirements:

- Main techniques must use the real study authority, CP deduction, eligibility, timing/progression, and completion logic.
- Subpath manuals must use or improve the existing subpath study authority.
- Do not bypass path compatibility, tier access, CP affordability, permanent-specialization rules, or retraining constraints.
- Evaluate whether player and NPC subpath study should use a consistent timed/progression contract. Resolve any exploit or confusing asymmetry.
- A display row must not grant knowledge merely by being clicked.
- A valid study must consume the correct CP and update the correct learning/progression state.
- Spawned manuals added to sect library state must appear immediately in the Library UI.
- Include end-to-end tests: spawn/acquire → sect ownership → library display → eligible member study → CP ledger update → learned state.

---

# 6. PRIORITY C — DONATION, APPRAISAL & WAREHOUSE

## User intent

The sect should accept every valid item category. Every valid item has some appraised value, even if the sect has no current use for it and its price is low.

The sect should not reject or destroy a valid donation merely because:

- It already knows the manual or recipe.
- It has a large stock of the same item.
- The item is not currently useful to any member.
- The warehouse's ordinary stack reached an arbitrary cap.

If the sect has no internal demand, it should be able to retain, reserve, recycle, salvage, or sell the physical item to a legitimate outsider.

## Audit all item categories

Derive the actual inventory schema from source. At minimum inspect:

- Raw materials, herbs, ores, rare materials.
- Pills, crafted pills, food, provisions, fish products.
- Equipment, weapons, armor, accessories, unique-UID gear.
- Technique crystals (`T:`) and specialization crystals (`S:`).
- Main technique manuals and subpath manuals.
- Recipe/formula scrolls and recipe knowledge.
- Rare organs, beast parts, research materials.
- Containers, recyclable items, and every other valid inventory type exposed by the game.

Do not assume this list is exhaustive.

## Required donation transaction contract

Every valid donation must:

1. Validate ownership, item identity, quantity, UID, provenance, and legality.
2. Resolve the correct item category and destination.
3. Transfer the item atomically from donor to sect.
4. Record a transaction/ledger entry.
5. Assign an appraisal and economic classification.
6. Grant CP only according to a transparent donation-reward policy.
7. Preserve the physical item unless an explicit documented use consumes it.
8. Notify UI, stock, demand, and NPC systems.

No silent deletion, partial loss, duplicate-ID corruption, or unexplained rejection is acceptable.

If ordinary storage is full, use a bounded overflow/lot-storage/warehouse-expansion/surplus route rather than losing a valid item or blocking the donation.

## Knowledge versus physical duplicates

The first copy of a manual may unlock a durable library entry. If the sect already owns the knowledge:

- Do not create a duplicate knowledge ID.
- Do not delete the donated physical copy.
- Keep it as surplus physical stock or route it through a justified buyer, salvage, recycling, or research mechanism.
- Preserve its appraisal and provenance.

Apply the same separation to main manuals, subpath manuals, and recipe scrolls.

Crystals are physical consumables. Their demand and value must not be inferred solely from whether the sect already owns the corresponding permanent manual.

## Valuation model

Do not use one simplistic price for every item. Use a coherent model informed by:

- Intrinsic tier/rarity and effect quality.
- Quality, durability, condition, and unique properties.
- Current sect stock and warehouse saturation.
- Actual member demand and eligibility.
- External demand and merchant specialization.
- Source/provenance and legal tradeability.
- Scarcity, production cost, risk, and replacement value.

Keep these values distinct:

- `appraisedValue` — intrinsic/market appraisal of the physical item.
- `donationRewardCP` — CP awarded to the donor.
- `internalCPPrice` — price charged to members.
- `externalTradePrice` — price in Spirit Stones.
- `salvageValue` / recycling yield — where applicable.

A duplicate item may have low internal demand but still have external or salvage value. Do not set its value to zero solely because the sect already knows its contents.

If an item is genuinely non-tradable or worthless, define and explain the policy. It must not silently vanish.

---

# 7. PRIORITY D — EXTERNAL MARKET & DUAL-CURRENCY ECONOMY

## Historical source-audit finding — revalidate

The previous audit found the external market's tradability whitelist was narrow, covering only selected provisions, pills, and recognized materials. It did not support most physical knowledge goods, crystals, equipment, recipe scrolls, rare organs, and other inventory categories.

The sect's purchase-demand logic was also limited to shortage directives, buy lists, and low-stock scans within that narrow whitelist.

Revalidate the current source and redesign where needed.

## Currency semantics

The game has two currencies with different economic roles:

### Contribution Points (CP / แต้มคุณูปการ)

Internal sect currency used for:

- Member study fees.
- Internal purchases and services.
- Work/donation rewards.
- Sect participation and internal progression.

### Spirit Stones (หินวิญญาณ)

External currency used for:

- Buying from outsiders.
- Selling goods to outsiders.
- External trade and market transactions.
- Sect treasury operations involving external merchants.

Do not conflate them or silently exchange one into the other.

## Desired economic loop

Create a coherent, inventory-backed economic cycle:

1. Members obtain, craft, gather, discover, or donate actual items.
2. The sect appraises and records those actual items.
3. First-copy manuals/scrolls may unlock durable knowledge in the correct library.
4. Physical copies remain physical inventory.
5. The sect supplies real member demand through actual warehouse/shop/library stock.
6. Genuine surplus may be sold to legitimate external buyers for Spirit Stones.
7. The sect uses its actual Spirit Stone treasury to buy goods that members actually need.
8. Purchased goods enter real sect stock and become available through the appropriate internal system.
9. Every transfer updates ownership, quantity, wallets, stock, and ledgers exactly once.

No phantom inventory. No phantom currency. No hidden item duplication.

## Demand-driven procurement

Derive demand from actual member state and available opportunities, not arbitrary wish lists.

Possible demand signals:

- Missing usable techniques, mantras, or subpath knowledge.
- Compatible crystals/manuals that advance a real cultivation plan.
- Gear upgrades supported by the existing equipment-suitability authority.
- Injuries, health, energy, or breakthrough requirements.
- Recipe inputs and crafting bottlenecks.
- Role-specific materials and equipment.
- Member goals, personality, interests, path, stage, weapon, and affordability.

Demand is valid only if the member can legally use or access the item and has a meaningful reason to want it. Do not purchase expensive content that no current or reasonably prospective member can use.

## External buyers and sellers

- Use a typed trade-goods registry/adapter or a better architecture.
- Traders must have actual stock, wants, specializations, wallet limits, transaction history, and persistent lifecycle state.
- Rare manuals, legendary items, and dangerous materials should require appropriate specialist buyers.
- Do not make every generic trader buy everything.
- Sell only above reserve floors and when strategic value justifies the sale.
- If no legitimate buyer exists, retain, reserve, recycle, or salvage the item.
- Purchases must deduct real Spirit Stones and add real inventory.
- Preserve merchant stock, wants, wallet, and counters across departure/return.
- Update both sides' inventories, wallets, trade history, and statistics exactly once.

## Anti-arbitrage and provenance

Track provenance across:

- Edit Hub spawn to NPC.
- Edit Hub spawn directly to sect.
- Natural drops and exploration rewards.
- Crafting/production.
- Member donations.
- Warehouse stock.
- Internal purchases.
- External sales.
- Returns, resale, and destruction.

A debug-spawned item may display an appraisal but must not automatically mint CP or Spirit Stones. Preserve anti-minting rules. If an explicit developer-only economic override exists, isolate it clearly.

Prevent:

- CP ↔ Spirit Stone circular arbitrage.
- Repeated buy/donate loops.
- Duplicate item cloning.
- Unique UID duplication.
- Market buy/sell loops.
- Unlimited merchant wallets.
- Currency creation through direct-to-sect spawning.
- Selling inventory that is reserved for a valid strategic purpose.

Separate appraisal from payout eligibility. A zero donation reward does not mean the item has zero intrinsic value.

---

# 8. PRIORITY E — CHARACTER SHEET INFORMATION ARCHITECTURE

The current character sheet mixes too much detail into the overview. Add dedicated tabs while retaining important summary information.

## Required tabs

1. **Overview**
2. **Bag**
3. **Techniques**
4. **Subpath**

Retain existing tabs that are still useful; integrate these without breaking other character information.

## Overview

The overview must remain useful and information-rich. Do not remove important information merely because dedicated tabs now exist.

Retain a concise at-a-glance summary such as:

- Sect rank/role and current activity/intent.
- Main cultivation path and realm/stage.
- Current secondary path and stage/progression.
- Important cultivation/combat stats.
- Root elements and per-root grades, with a concise rarity summary.
- Currently installed/active techniques and equipped gear.
- Current learning task or major bottleneck.
- Important retraining status/cost or other high-value character context.

Do not turn the overview into another endless scroll.

## Bag tab

Show the complete personal inventory, including:

- All item categories.
- Quantities and stack state.
- Equipment slots and equipped status.
- Unique UIDs.
- Quality, durability, and item condition.
- Appraisal/value where meaningful.
- Available legal actions.

Reuse authoritative inventory renderers and actions. Preserve grid/list views, search, filters, sorting, pagination, and item detail interactions where present.

Keep personal inventory separate from sect warehouse and Edit Hub inventory-management tools.

## Techniques tab

Show all learned techniques and current learning state, not only installed entries:

- Main mantra and learned techniques.
- Active/installed versus learned-but-inactive.
- Passive slot occupancy and reasons for inactivity.
- Technique mastery and unlocked move/stage progression.
- Weapon/armor requirements.
- Elemental compatibility explanation where relevant.
- Study progress, remaining work/time, and CP costs.
- Explicit reasons for incompatibility, locks, or unavailable effects.

The overview should show currently installed/active techniques and a concise summary.

## Subpath tab

Show:

- Main cultivation path and current secondary path.
- Specialization track, realm/ordinal, and progression.
- Unlock gates, required manuals/crystals, skills, and costs.
- Passive/innate techniques and subpath synergies.
- Compatibility and meaningful effects.
- Retraining/switching implications and costs.
- Legal study/progression actions.

Do not conflate a cultivation subpath, secondary-path manual, physical specialization crystal, technique-specific crystal, and technique mastery. They are distinct entities.

## Information visibility audit

Inspect persisted NPC/world state and build a visibility matrix identifying meaningful player-relevant information that exists in code but is hidden from the UI.

Surface relevant information in readable player-facing language using labels, grouping, tooltips, and progressive disclosure.

Do not expose raw source dumps, internal IDs, debug flags, or opaque object structures as normal UI.

## Mobile requirements

Design and test for:

- 360×800.
- 412×860.
- 800×360.
- Desktop smoke at 1280×800.

Avoid horizontal overflow, tiny touch targets, clipped tabs, inaccessible actions, and endless overview scrolling. Preserve the visual language unless a demonstrably better design is warranted.

---

# 9. PRIORITY F — ADDITIONAL SYSTEMIC AUDIT

The following historical findings are starting hypotheses. Verify them against the actual source. Do not assume they remain unfixed or that the old explanation is correct.

## 9.1 Known candidate findings

The previous source audit of the v2.0.2 archive identified:

1. Technique-crystal (`T:`) entries missing from the Edit Hub catalog while direct spawn support existed.
2. No dedicated sect Library tab.
3. Duplicate main and subpath manuals could be consumed for zero CP reward without preserving the physical surplus copy.
4. Duplicate recipe scrolls could be consumed for zero reward without retaining physical surplus.
5. Crystal donations could be rejected when a stack reached a hard cap of 999, despite an existing overflow concept.
6. The external market whitelist excluded most knowledge goods and other physical categories.
7. The character sheet lacked dedicated Bag, Techniques, and Subpath tabs.
8. Expanding external trade without consistent provenance could create an economic currency faucet.

## 9.2 Crystal-value symptom — do not assume cause

The user reported that a specialization crystal appeared to have no value or was not accepted when the sect already owned its manual.

A prior isolated API probe in a fresh world found a non-spawned `S:` crystal could still be accepted for a positive reward under one ordinary under-cap condition. That does not disprove the user's report.

Investigate the actual UI and all relevant state combinations:

- `S:` versus `T:` crystal.
- Spawned versus naturally acquired.
- Duplicate versus first-copy manual.
- Full, near-full, and overflow storage.
- Sect inventory versus personal inventory.
- UI display value versus API appraisal versus actual CP reward.
- External market eligibility versus internal donation eligibility.

Possible causes include provenance anti-minting, a full stack, a duplicate physical manual rather than a crystal, incorrect UI routing, or missing external market support. Reproduce before fixing.

## 9.3 Broader elemental architecture audit

Revalidate the historical backlog:

1. Define explicit elemental relation classes: `MATCH`, `SUPPORT`, `OPPOSE`, `NEUTRAL`.
2. Audit every consumer of scalar root grade; per-root grades remain authoritative.
3. Define allowed contexts for `ELEMENT_LINK_ONLY`.
4. Separate offensive damage modifiers from healing, shielding, support, and utility modifiers.
5. Explicitly classify beasts, bandits, guardians, summons, clones, bosses, and non-beast foes as elemental, rooted, or intentionally non-elemental.
6. Add behavioral NPC tests for path/subpath choice, learning, equipment, training, and combat.
7. Audit cross-system content coherence for materials, equipment, weapons, artifacts, techniques, mantras, passives, and recipes.
8. Preserve legendary item/technique identity and signature effects. Do not flatten them into generic elemental stat sticks.

## 9.4 Additional illogical systems

Do not restrict the audit to the checklist above. Inspect the whole game for:

- State that exists but is unreachable through UI.
- UI actions that do not call authoritative gameplay methods.
- Duplicate sources of truth.
- Dead or obsolete data.
- Items with no coherent use, buyer, value, or disposal route.
- NPCs making decisions without access, knowledge, affordability, or eligibility.
- Rewards that can be duplicated, minted, or lost.
- Progression gates that can be bypassed or become impossible.
- Content IDs whose names, descriptions, mechanics, effects, requirements, and UI labels disagree.
- Systems that work individually but fail when integrated.
- Simulation loops that scale poorly at ×16/×32.
- Save/load paths that silently discard newly added fields.
- Mobile UI that hides important information or actions.

Rank findings by severity, confidence, player impact, and implementation risk.

---

# 10. ENGINEERING AND DATA-INTEGRITY REQUIREMENTS

- Maintain one source of truth for every item, knowledge record, inventory lot, price, and ownership state.
- Reuse existing authorities; avoid parallel inventory, market, study, or AI engines.
- Use typed contracts and validate at system boundaries.
- Transactions must be atomic and idempotent.
- Preserve unique gear UIDs and exact stack quantities.
- Track provenance and ownership through every transfer.
- Use deterministic world RNG for simulation decisions; do not introduce non-deterministic random calls into deterministic world logic.
- Preserve save integrity, NPC cloning, visitor/member conversion, and merchant lifecycle.
- Update caches, stock observers, and UI state after mutations.
- Do not rely on UI-only state as authoritative gameplay data.
- Keep modules readable and testable.
- Avoid adding new frameworks or runtime dependencies without strong justification.
- Use meaningful logs and explicit failure reasons.
- Add migrations only where needed for the new schema; validate all loaded state.

---

# 11. REQUIRED EXECUTION WORKFLOW

## Phase 0 — Source discovery and baseline verification

1. Inventory every attached archive and file.
2. Identify the latest internally consistent v2.0.2 source.
3. Verify archive integrity and any source manifest.
4. Extract to a clean working directory.
5. Identify source entry points, runtime modules, data registries, UI modules, build scripts, tests, and standalone output.
6. Verify the protected Human Core fingerprint/hash if present.
7. Record version markers from actual code.
8. Run the existing test suite and record exact commands/results.
9. Build the standalone and compare it with the supplied artifact if applicable.

Do not begin edits until the active source is unambiguously identified.

## Phase 1 — Reproduction and independent audit

Create:

- `SOURCE_ARCHITECTURE_MAP.md`
- `AUDIT_FINDINGS.md`
- `ISSUE_TRACEABILITY_MATRIX.md`
- `DESIGN_DECISIONS.md`
- `BASELINE_TEST_REPORT.md`

Trace the actual code/data flow for:

- Edit Hub catalogs and spawn.
- Item identity, provenance, inventory, warehouse, and overflow.
- Donations, appraisals, CP rewards, and ledgers.
- Main and subpath knowledge ownership.
- Member study and progression.
- External traders, demand, supply, wallets, and Spirit Stone transactions.
- Character sheet tabs and information visibility.
- NPC demand/decision authorities.
- Save/load and standalone build.

Reproduce the user's issues through actual UI/API flows. Identify additional defects and illogical behavior.

## Phase 2 — Design

Before large changes:

- Compare the current design with the user's product intent.
- Identify conflicting rules and hidden exploits.
- Choose the simplest coherent architecture that satisfies the gameplay goals.
- Reuse existing authorities where sound.
- Record `RETAIN`, `REFINE`, `REPLACE`, and `DEFER` decisions with rationale.
- Define transaction invariants and economy equations.
- Define the UI information architecture and visibility matrix.

Do not ask the user to decide routine technical details.

## Phase 3 — Implementation

Implement the complete core scope:

1. Edit Hub technique-crystal and specialization-crystal catalog/spawn.
2. Dedicated sect Library tab for main and subpath knowledge.
3. Real member study actions with CP, eligibility, and progression.
4. Unified donation acceptance, appraisal, physical duplicate retention, overflow, and provenance.
5. Demand-driven external market with real buyers, stock, wallets, and Spirit Stone transactions.
6. Member-demand-driven procurement.
7. Character Bag, Techniques, and Subpath tabs, retaining a useful Overview.
8. Additional high-confidence defects found during audit.

Then address the elemental/content-coherence backlog in a sequence that does not destabilize completed systems.

Do not stop after the first feature. Complete the requested scope and maintain a working build after each major phase.

## Phase 4 — Testing

Create focused regression and integration tests for every changed invariant.

At minimum test:

### Edit Hub
- `T:` and `S:` catalog discovery.
- Search/filter/pagination.
- Spawn to personal and sect inventory.
- Correct item metadata and provenance.
- Use, donation, trade, and save/load.

### Library and study
- Spawn/acquire main manual → library visibility.
- Spawn/acquire subpath manual → library visibility.
- Eligible member study → CP deduction → study/progression → learned state.
- Ineligible member gets an explicit reason.
- Duplicate study and conflicting specialization handling.

### Donations and valuation
- Every valid item category.
- Duplicate main/subpath manuals and recipe scrolls.
- Crystal stock at normal, near-cap, and overflow conditions.
- Atomic ownership transfer.
- No lost items or duplicated UIDs.
- Provenance-aware rewards.
- Appraisal, CP reward, internal price, external price, and salvage values.
- Full storage and overflow behavior.

### Economy
- Actual merchant buyers and wants.
- Actual sect surplus.
- Member-demand-driven procurement.
- Treasury and wallet limits.
- Reserve floors and strategic stock.
- Exact stock/wallet/ledger reconciliation.
- No CP/Spirit Stone arbitrage or item duplication.
- Merchant departure/return persistence.

### Character UI
- Bag, Techniques, and Subpath tabs.
- Overview retains important summary information.
- Learned versus installed techniques.
- Current learning progress.
- Correct inventory actions.
- Mobile layouts without horizontal overflow.

### Existing systems
- NPC autonomy and cognition.
- Root/elemental generation and combat.
- Cultivation and specialization.
- Equipment selection and combat.
- Crafting, alchemy, recipes, ecology, wildlife, exploration, visitors, merchants, and welfare.
- Speed ×16 and ×32.
- Save/load, deterministic replay, and standalone offline execution.

Run all existing project tests and relevant focused suites. Run long-duration natural-world simulations and economy/ecology soaks on the final code where execution budget permits.

Browser automation can be environment-sensitive. Distinguish a game assertion failure from a DevTools/browser startup failure. Never report a flaky, skipped, timed-out, or unrun test as passed.

## Phase 5 — Final release packaging

Deliver one complete updated ZIP containing:

- Playable rebuilt standalone HTML.
- Full editable source tree.
- Local assets and data registries.
- Build scripts and necessary tools.
- All tests and required fixtures.
- Updated README, HANDOFF, CHANGELOG, and roadmap/status docs.
- Audit findings and design decisions.
- Issue traceability matrix.
- Economy formulas and worked examples.
- NPC decision-integration evidence.
- Content/ID mapping for changed content.
- Known limitations and QA report.
- SHA-256 manifest.

Remove irrelevant historical drafts, duplicate standalone files, obsolete prompts, stale screenshots, and superseded reports. Do not remove active source, required data, tests, fixtures, or tools needed to build and validate the project.

Validate the final archive by:

1. ZIP integrity/CRC check.
2. Extraction into a fresh directory.
3. Rebuilding the standalone from extracted source.
4. Comparing the rebuilt standalone hash to the shipped standalone.
5. Running required tests from the extracted package.
6. Verifying the protected core hash.
7. Recording exact file count, ZIP size, archive SHA-256, standalone hash, and test status.

Do not place the archive's own final hash inside its own manifest.

---

# 12. ACCEPTANCE CRITERIA

The task is not complete until:

- Both technique crystals and specialization crystals are discoverable and spawnable through the actual Edit Hub UI.
- Main and subpath manuals are visible in the dedicated sect Library.
- Eligible members can study both categories through valid gameplay actions using CP.
- Every valid donation is accepted and accounted for.
- Duplicate physical manuals and recipe scrolls do not disappear.
- Crystal donation is not arbitrarily blocked by a hard stack cap.
- Appraisal, CP reward, internal CP price, external Spirit Stone price, and salvage value are distinct and coherent.
- Genuine surplus can be sold to legitimate external buyers.
- The sect can purchase goods based on real member demand.
- Spirit Stones and CP remain separate and economically coherent.
- Spawned/debug items cannot create unlimited currency.
- Character sheet has Bag, Techniques, and Subpath tabs.
- Overview retains important summary information.
- Player-relevant state is presented in readable UI rather than raw data dumps.
- Existing NPC, cultivation, elemental, combat, ecology, crafting, exploration, market, visitor, and welfare systems remain intact.
- ×16/×32 simulation remains usable and performance regressions are measured.
- New-schema save/load, deterministic behavior, standalone build, and final ZIP integrity pass.
- Every unverified, flaky, skipped, or deferred item is reported honestly.

---

# 13. FINAL RESPONSE FORMAT

Provide the final updated ZIP and a concise technical report containing:

1. Exact baseline and final version identifiers.
2. What was broken and how each issue was reproduced.
3. Additional illogical or incomplete systems discovered.
4. Design decisions that differ from this prompt and why.
5. Modules/files changed.
6. Final economy rules, valuation model, and anti-arbitrage protections.
7. Library/study behavior.
8. Character UI changes.
9. Tests actually run, with exact pass/fail/timeout/flaky counts, seeds, and durations where relevant.
10. Browser/mobile test status, distinguishing viewport emulation from physical-device testing.
11. Known limitations and anything not verified.
12. Final ZIP size and SHA-256.

**Do not claim completion before validating the extracted final archive.**

**Do not return only a plan, audit, snippets, screenshots, or a standalone HTML without its editable source.**

**Use this prompt as the source of project intent and historical context, but use the supplied game source as the authority for actual implementation. Think independently, improve the design when justified, and deliver the best coherent version of the existing game.**
