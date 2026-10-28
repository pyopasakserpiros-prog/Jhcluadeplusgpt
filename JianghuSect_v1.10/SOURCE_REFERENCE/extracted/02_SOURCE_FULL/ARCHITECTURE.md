# Runtime architecture — Combat & Attributes 2.01

The uploaded unified2.00 source remains canonical. `human.js` and `legacy.bundle.js` are unchanged. `source/index.html` now loads 28 runtime modules.

- `combat-stats.js`: pure, bounded combat sheets and additive Thai provenance. No power/RNG/ensure recursion. Full HP uses permanent dimensions; current attacks/speed reflect Human condition. Only canonical eligible equipment/prepared arts contribute.
- `combat-overhaul.js`: common direct-hit resolver, cadence, channels, crits, secondary damage, control, Qi, creature skills and off-map expectations.
- `combat.js`/`combat-tactics.js`: existing AI, real costs, cooldowns, combo marks, support and learned moves; calls the common hit resolver. Temporary stat bonuses live in the stat sheet once.
- `stage.js`: authoritative health/injury/death/loot remains here, with effective HP conversion only at the combat boundary and explicit event metadata. Power is now a derived tactical estimate, not a damage input.
- `jianghu.js`: companions act under their own identities and use the shared resolver. Threat comparisons use the same derived estimate.
- `myriad-worlds.js`: abstract encounter settlement uses shared expected damage and sheets plus real resource payment; it does not create on-map substitute actors.
- `combat-view.js`, `ui.js`, `living-art.js`: read-only Thai panels and screen-space floating feedback.

NPC health remains the original condition ledger (usually 0–100; boss240). CombatHP = health / originalMax × derivedMaxHP; damage converts exactly once. Beast health/maxHP stay native. There is no second mutable HP ledger.

Save envelope11 and combat schema2 remain valid for this non-migrating derived extension. New saves additionally identify combatOverhaulVersion1 and release2.01-combat-attributes. Browser autosaves use combat201. Unsupported future overhaul versions are rejected. A fresh start is recommended; only current-release continuation is validated.

Build: `python3 tools/build.py`; complete checks: `npm test`. See `QA_REPORT_TH.md` for actual verification and limitations.

