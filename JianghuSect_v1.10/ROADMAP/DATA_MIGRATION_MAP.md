# Data migration and compatibility map

Authoritative machine map: `../SOURCE_REFERENCE/migration/mapping.json`. Original selected records: `selected_raw.json` beside it. Deterministic transformation: `../tools/migrate_source.js`; generated output: `../data/data_expansion.js`. Do not edit generated output alone.

## Progression compatibility

| Source model | Adaptation in v1.10 | What is deferred |
|---|---|---|
| Global XIAN9/BODY5/GOD4 | Same target major paths; original stages, power tables, thresholds and lifespan unchanged | No ordinal/name substitution |
| FROST_MOON_IMMORTAL independent9-track | Specialization identity/stat tradeoffs/aptitudes + one manual in target XIAN | Independent nine-realm track |
| WOOD_SPRING_BODY independent9-track | Specialization identity/stat tradeoffs/aptitudes + one manual in target BODY | Independent nine-realm track; not mapped to5 |
| MEDICINE_BODHI_GOD independent9-track | Specialization identity/stat tradeoffs/aptitudes + one manual in target GOD | Independent nine-realm track; not mapped to4 |
| Other source side-tracks6–11 | Reference only | Native independent-track schema/power comparison |
| DEMON9/HEART_SOUL9 | Excluded from runtime | Whole path mechanics, resources, progression, UI, AI |

`progressionMapping` explicitly sets `mode:SPECIALIZATION_ONLY` and `sourceRealmOrdinalsImported:false`. Technique access uses the source's normalized major-tier requirement validated against unchanged major-path caps; it never treats an independent side-track ordinal as a target stage. Full track records and original formulas remain in `SOURCE_REFERENCE/catalogs/inspected_catalog.json`.

## Schemas and ownership

- New material/recipe/manual/beast/region IDs use `SRC110_` + original ID. Three source specializationIDs are retained only after collision checking. `sourceId`, exact ZIP-relative `sourcePath`, `sourcePack` retain provenance.
- `craftPath→craft`, `outputType→outType`, `outputNameTh→outNameTh`; every ingredient reference receives the same prefix.
- Source ingredient money scale is not target contribution valuation: native value=`round(6*1.7^(tier−1))`; original value preserved separately. Donations use native scarcity and taper with oversupply, independent of the CP price index.
- Source recipe days are retained as metadata; actual production uses target `ECO.craftHours`. Native skill tolerance (`skill+20≥minMastery`) and facilities apply. Formulas also require sect research tier and `knownRecipes`.
- `restoreQi` source percentage becomes native `qiRestore/100`; healing, injury, cultivation and equipment multipliers map to existing handlers. `clearPoison→clearToxic` is an explicit design adaptation to target pill toxicity, not a claim of identical poison mechanics. Foundation/study/craft bonuses with no native handler remain `unsupportedEffects`, not fake active bonuses.
- All nine selected manuals are native combat techniques, with explicit `combatArch` rather than ignored source effect bindings. Source effect IDs/category retained as metadata; source cooldown/turn scale/costs/cross-path effects are not copied. Native qi cost, casting time, damage, shield, status, AI and cooldown logic apply.
- Source creatureCP is rescaled against native early tiers; only mapped anatomical drops are active. Region budgets debit when a matching creature is defeated.

## Save evolution

`SIM.VERSION=1.10.1`; earlier target saves carried `v:1.0.0` despite v1.9 filename. HC fingerprint remains the compatibility gate. New state is additive:

- `sect.contentVersion`, `sect.knownRecipes`
- `sect.craftTransactions={seq,open}`, `npc.act.ctx.craftReceipt`
- `world.contentSites`, bounded `contentHistory` (60), `contentMetrics`
- `world.visitors`, bounded `world.tradeHistory` (60), `world.marketStats` for persistent external traders and spirit-stone transactions
- `expedition.settlement` / `out.settlement`
- `runtimeTiming={pendingTicks,speed}`

Migration is deterministic and does not consume RNG. Only old `brew/forge/brewBasic` actions in actual `do` phase with `started2` get adopted as already-paid reservations; moving/not-started actions must reserve normally. Repeated load cannot settle a used receipt. Unknown normal top-level extension fields roundtrip through `_saveExtras`; nested existing objects are retained. Existing cache-prefixed underscore fields are still deliberately omitted by native serialization. There is no migration from SOURCE saves and no downgrade compatibility promise.
