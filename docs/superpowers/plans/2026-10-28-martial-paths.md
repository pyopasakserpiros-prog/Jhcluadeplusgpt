# Martial paths Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Distinct path identities and NPC equipment choices linked to scarce reusable manuals and finite consumable knowledge.
**Architecture:** Native JS data-driven modules; shared suitability and eligibility rules at all transactional boundaries. Extend existing combat and economy rather than minting parallel stats/resources.
**Tech Stack:** Browser vanilla JS, Node regression tests, Playwright, Python packaging.
**Spec:** docs/superpowers/specs/2026-10-28-martial-paths-design.md

## Global Constraints
- main-1 only; preserve main and human_core.js byte lock.
- One path and subpath, no stacked alternate paths; one ARMOR slot and existing accessory slot count.
- Seeded simulation randomness; UI/scoring never consumes RNG.
- Manuals reusable, crystals real single-use units, failure/duplicates consume nothing, no arbitrage.
- User explicitly opts out of further approval and gives design discretion; proceed through implementation/review/verification and authorized push.

## Review Focus
- All old discovery sources must respect rarity rather than bypass it.
- Cross-path/duplicate/insufficient-funds knowledge use leaves inventories and CP intact.
- Equipping/unequipping recalculates conditional bonuses without stale caches or accumulation.
- Physical bonuses flow into actual combat and life bonuses into real work.
- NPC choices and UI remain deterministic and economical at80 active cultivators.

### Task 1: Integrated martial systems patch
**Files:** data catalogs and new focused modules as needed; js/cultivation.js, stats.js, skills.js, combat.js, economy.js, cpeco.js, content.js, expedition.js, explore.js, sim.js, cognition.js, ui.js; loaders and relevant tests/tools.
**Interfaces:** Define shared gear suitability, knowledge eligibility/transactions and progression explanations; list exact public names in report for reviewer.
- [x] Write meaningful failing tests for finite crystal lifecycle/rare source gating, type-conditional combat, physical/life outcomes, subpath exclusivity and NPC fit.
- [x] Implement catalog, runtime transactions and combat/progression integrations; prove focused tests green.
- [x] Integrate NPC and UI with shared rules, verify source inventory/points conservation and no UI RNG.
- [x] Build standalone, update count/version assertions and release metadata coherently; document exact rates and content counts.
- [x] Self-review then report diff and tests; do not push/commit, controller reviews whole patch.

### Task 1b: Authorized skill/retraining extension
- [x] Categorize all skill UI and add weapon-specific BOW/STAFF/FOCUS outside HC; real effects/training for every skill.
- [x] Add gated path/subpath retraining transactions and NPC cost-aware intent; reset stages/track and remove incompatible effects.
- [x] Regression old1/2/3->1,4->2,5->2, all path resets, retained independent skills, invalid attempt conservation, no repeated flipflops, pure categorized UI.
- [x] Add explicit new rules and future Gemini handoff documentation.

### Task 2: Independent review and release
- [x] Reviewer evaluates spec and quality, tests boundary cases, returns concrete findings.
- [x] Resolve confirmed issues and rerun affected tests; build and full suite with supervised browser HTTP server.
- [x] Run360 native days, inspect economy and bounded state; package checked release and record evidence.
- [x] Update README/HANDOFF, commit and push main-1, verify remote SHA, report user-facing behavior and limits.
