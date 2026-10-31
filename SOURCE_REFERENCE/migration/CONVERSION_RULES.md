# Repeatable conversion

Run `node tools/migrate_source.js` from the project root (Node18+). It reads only the bundled `selected_raw.json`, emits `data/data_expansion.js` and `mapping.json`, validates selected dependencies/paths and applies native override rules. Re-running unchanged inputs produces identical bytes.

New IDs use `SRC110_`; original specializationIDs are collision checked. Registration is idempotent for identical data and rejects conflicting definitions. All new recipes require discovery; all new materials and manuals have explicit routes. Source turn/day/power/money scales are not copied blindly. The converter retains original costs/effect IDs or exclusions as provenance; native runtime handlers are authoritative.

For future packs, keep source originals untouched, add new immutable selected records, choose a distinct namespace/version, update mappings/validator/route tables, add behavior tests, then rebuild. Do not load SOURCE_REFERENCE scripts into the playable target.
