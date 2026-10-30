# NEXT IMPLEMENTATION ASSIGNMENT — BELIEVABLE CLUE INVESTIGATIONS

Read this document, the current HANDOFF.md, `JianghuSect_v1.10/docs/CODEX_COMBINED_PATCH_REVIEW_TH.md`, `CODEX_COMBINED_VERIFICATION.json`, and `ROADMAP/COMBINED_REVIEW_FOLLOWUPS_TH.md`. This is an implementation assignment. Work from the supplied complete main-1 ZIP, not an older upload or historical prompt. The reviewed runtime baseline is 8890680725f5643f77acfa01e5b71c919ff93918; this documentation may have a newer commit. Identify the actual source and preserve all integrated NPC, graphics, visitor, clue and weapon work and tests.

## Objective and discretion

Improve the realism, continuity and balance of the existing visitor/clue/expedition system, using actual NPC knowledge, informed consent, meaningful challenges and real resource/ownership outcomes. Implement all ten items in `ROADMAP/COMBINED_REVIEW_FOLLOWUPS_TH.md` in this single patch. Treat each as required scope, while choosing coherent technical solutions based on the actual code. Inspect the actual code and design the best solution, implement it and test it. You may propose and implement a better design than the examples here or add creative improvements; report all substantive deviations, reasons, tradeoffs and evidence. Finish a coherent playable patch; do not stop at a plan or cosmetic prose.

## Non-negotiable constraints

- Never change `JianghuSect_v1.10/js/human_core.js`; reference SHA-256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`, fingerprint `155:2f9c9dd7`. Check before and after; do not overwrite newer code with an older copy.
- Preserve determinism, saves/RNG, 100-member cap, member/visitor separation, office authority, finite resources, prices, item ownership, unique artifacts and idempotent settlement; respect all earlier six Codex fixes. Protect ongoing paid work, sleep, treatment and emergency actions.
- Preserve established technique tiers, rarity, stages, innate-only exclusivity, source pools and legendary weapon identity. Acquisition does not grant automatic eligibility or change cultivation. Keep non-ranked and rank-1 high-tier tails positive but very small; higher ranks improve tails while low-tier outcomes remain more common. Do not remove existing sources to hide increased drop rates.
- Keep modular game and rebuilt self-contained HTML offline capable, Thai player-facing text, mobile UI, interaction and graphics quality settings. Do not consume gameplay RNG from UI/rendering. No external service at runtime.
- No push/merge to main or main-1; return complete source for independent Codex review. User develops on main-1 and promotes to main after review.

## 1. Reconnaissance and baseline

Inspect `js/visitors_clues.js`, `js/expedition.js`, `js/explore.js`, `js/content.js`, `js/knowledge.js`, `js/cognition.js`, `js/ai.js`, `js/sect.js`, `js/sim.js`, `js/ui.js`, `js/render.js`, relevant templates and tests. Trace complete wrapper order for expedition resolution/handover. Establish baseline test results. Report existing/verified, existing/unverified, confirmed defect and new design separately. Reproduce confirmed bugs before fixing; use behavioral regression tests. Do not assume a report or mock test proves natural behavior.

## 2. Actual clues, choices and knowledge

Keep short, medium and long investigations; tier does not dictate step count. Add a coherent selection of materially distinct approaches such as interpreting evidence, helping a contact, honoring an actual commitment, nonlethal trial, gathering a required real item, dealing with a guardian or choosing retreat. Choices have costs and outcomes; do not invent successful transactions or events through log messages. Preserve and extend existing authored stories and all valid acquisition targets.

Implement at least one genuine cross-region A -> B chain using current expedition travel, separate region arrival and actual supplies, with observable intermediate progress and persistent state. Do not execute B during an expedition that reached A. Tests must drive the actual dispatch, arrival and settlement path, not only call a node function or use `forcePass`.

Track who knows each fragment, source and perceived confidence. Distinguish world truth and private/sect knowledge; NPC decisions must not read undiscovered node details, hidden requirements, hidden PA or future RNG. Reporting and teaching should propagate only information actually communicated. Explain blocked or deferred plans using what the character can plausibly know, and avoid exposing future mystery in player-facing UI.

## 3. Guardian challenges and party decisions

Investigate existing expedition encounter abstraction and combat engine. Choose either a genuinely integrated encounter or a consistent, explicit expedition-style abstraction with defensible consequences, real risk, costs, retreat and outcomes; document why. Never present an abstract roll as a battle shown on-screen. Ensure victory, retreat, casualties where supported, no survivors, retries and settlement are handled coherently and reward is granted at most once. Do not introduce guaranteed death or invent rewards.

Use actual invitations/acceptance, goals, relationship, risk, health, work/office duties and available supplies for participants. Check authorized approval and legitimate personal/sect funds. Preserve protected actions and let members decline without silently joining. Prevent duplicate memberships, stale reservations and orphaned expeditions. Report why characters pursue, defer, seek help, recover or abandon; introduce bounded retry/backoff and bounded history without erasing live references or claim receipts.

## 4. Rarity, ownership and outsider continuity

Measure the whole funnel: visitors, information encounters, clues by rarity/tier, investigations, successful terminals, actual rewards and learned/equipped results; distinguish conditional chance from per-day rates. The prior code had only 8 ordinary vs 33 legendary templates, so summing weights can make legendary news common even when each entry has a small weight. Measure before changing, then calibrate total group probabilities and add ordinary/no-treasure news if needed. High reputation may improve access but should not flood the world with legendary results. Document numerical assumptions and natural observations; forced fixtures prove reachability only.

Trace the same unique weapon instance across site, expedition, member, storage, gift/sale, death, loss/recovery and save/load. Handle departed visitors and active clue/relationship references when pruning the offsite registry. Legacy saves migrate safely and idempotently; past receipts and acquired items cannot be reissued. Do not patch simulation outcomes with extra currency or duplicate objects.

## 5. Complete the remaining roadmap items in this same patch

**Roadmap item 8 — literary accuracy and weapon balance:** Independently verify the existing Jin Yong/Gu Long weapon research where reliable sources are accessible, distinguish novel canon, adaptation and original inventions, correct demonstrated attribution errors and cite sources. If research access is unavailable, explicitly mark individual claims unverified instead of inventing citations. Test every legendary weapon's actual proc in combat, activation, resource costs, cooldown and save/load; compare same-tier equipment and representative builds. Tune demonstrated overpowered or ineffective effects, avoiding rarity-only dominance and preserving identity. Report numeric before/after evidence and any unverified literary claims.

**Roadmap item 9 — NPC authority, perception and life goals:** Inspect and improve long/medium/short goals, actual progress predicates, protected tasks and adaptive planning. Test real autonomous behavior across different personalities, dreams, offices, relationships and circumstances. Ensure appointments, delegated authority, decisions, personal gain/favoritism, complaints and investigation use actual permissions and finite resources. Keep information scoped to known facts and distinguish CA from hidden PA. Fix verified bugs and unreasonable behavior while preserving individuality; explain outcomes in Thai. Natural multi-seed observations must accompany controlled tests.

**Roadmap item 10 — graphics and performance:** Improve visible differentiation of buildings and NPC/weapon activity where inspection identifies weaknesses, preserving the current visual identity and recent graphics improvements. Test all legendary weapon visuals for correct equip, unequip, usability, load, visibility and reduced-motion behavior. Profile 100 members plus guests, weather, combat, active clues and save/load at mobile-sized and desktop viewports. Compare actual baseline and after using the same seed/workload and report frame/tick timing, effective simulation speed, memory/cache bounds and artifacts. Optimize measured bottlenecks without changing simulation results or dropping ticks; retain Thai readability and responsive controls. Browser emulation is not a physical phone: run a real-phone check if available, otherwise disclose that it was not available rather than claim one occurred.

Implement all ten roadmap items, including the seven covered earlier, as one integrated patch. Map each roadmap item to code, behavior, tests, observed evidence and remaining limitations in the final report. Do not silently skip items; if a genuinely unavailable external capability or blocker prevents completion, deliver the completed game and explicitly identify the unfinished requirement, evidence and reproduction steps. Creative improvements remain authorized with a documented rationale.

## 6. Verification and delivery

1. Preserve `test/codex_combined_review.js` and full test coverage; write meaningful negative, replay, authorization, hidden-knowledge, cross-region and save/load regressions.
2. Exercise natural actions through the actual decision/expedition/tick system. Test successful/failed guardian, party refusal, emergency/protected work, reservation expiration, missing visitor and repeated completion; verify real inventories, funds and actor state, not just text.
3. Run full `node test/run_all.js` including browser groups where available. Test source and rebuilt standalone offline, mobile 360/412 and desktop, navigation, links, save/load, quality and no uncaught errors. Preserve test runner inputs and `SOURCE_REFERENCE`.
4. Run at least three seeded 180-day natural simulations (or state limits precisely) and publish actual funnel, economics, population, failure/retry, ownership and performance measures. Include a separate 100-member workload and distinguish controlled/forced tests. Desktop mobile emulation is not real-phone testing.
5. Verify the six prior regression cases, core hash, exact artifact identity and no duplicate payout across reload. Do not claim every story is naturally balanced merely because `forcePass` fixtures succeed.
6. Return a complete updated source ZIP, offline standalone, portable relative patch, implementation/code map, before/after metrics, test commands/results and Codex review handoff. Include a deviation/creative ideas table and remaining risks. Update HANDOFF and roadmap to reflect actual outcomes; archive rather than mislabel earlier prompts. Never invent tests, research, commits or results. If blocked, disclose precisely what is unfinished.
