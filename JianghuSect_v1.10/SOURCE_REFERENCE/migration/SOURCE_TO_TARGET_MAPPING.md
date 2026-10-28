# Source to target mapping

Read `mapping.json` for every imported originalID/path, targetID, field/effect conversion, explicit progression deferrals and calculated content counts. The human explanation is `../../ROADMAP/DATA_MIGRATION_MAP.md`.

Raw selected records are preserved in `selected_raw.json`; complete inspected non-save records are in `../catalogs/inspected_catalog.json`; untouched original script paths are rooted under `../extracted/`. `sourcePath` values in generated data are exact ZIP-relative paths under `02_SOURCE_FULL/`.
