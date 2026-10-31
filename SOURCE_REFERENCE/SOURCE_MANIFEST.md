# Source manifest guide

Original uploaded filename: **`Jianghu_v2_08_3_ACADEMY_FORMULA_FIX_COMPLETE.zip`**. Origin: **Jianghu v2.08.3**. Archive size: **15,492,923 bytes**. Archive SHA256:

```
df56d5c280f78f1698709f13aa579b222e958e2816249544aa780cb067e79bc6
```

[Full machine manifest](SOURCE_MANIFEST.json) records each original archive entry and selected file. The archive has **167 file entries**, totaling **66,970,490 uncompressed bytes**. Exactly **52 original files** (22,591,380 bytes) are preserved byte-for-byte under `extracted/`; **115** payloads are excluded. Original paths include their original `02_SOURCE_FULL/` prefix.

| Preserved group | Files | Use |
|---|---:|---|
| Original source scripts | 21 | Data, simulation semantics and source adapters; includes complete `legacy.bundle.js` |
| Original Markdown documentation | 22 | Architecture, rules, Human field/identity definitions, roadmap, QA caveats, handoffs |
| Original JSON metadata/manifests | 6 | Build/content/source audits, historical baseline hashes, private package/version metadata |
| Original source HTML | 1 | Exact original 32-module loading order; not a playable subset |
| Original version text | 1 | Exact origin release string |
| Original Noto license | 1 | Sole archive license; font software only |

Each `selected_files` record contains `original_relative_path`, `preserved_relative_path`, `bytes`, `sha256`, `origin_release`, `role`, `reason_and_use`, `source_file_dependencies` and `runtime_or_document_dependencies`. Each `archive_inventory` record contains original ZIP path, uncompressed/compressed size, SHA256, CRC32, ZIP timestamp/compression/attributes and preservation/exclusion status. Historical baseline/build hashes in original metadata remain historical claims; the per-entry hashes in this manifest were recomputed from the supplied archive.

Excluded files include recovered player save `03_RECOVERED_SAVE/Jianghu_Cloud_Sect_Save_v2_08_3_RECOVERED.json`, all test/fixture/evidence payloads, images, font binaries, presentation CSS, original build/package tools, original standalone player and eleven rendering/UI/stage scripts. The recovered save has **only its filename, size, digest and archive metadata** in inventory; no save bytes are preserved. The original ZIP itself is not part of this package.

The omitted scripts are `art-assets.js`, `living-art.js`, `realm-sprites.js`, `combat-view.js`, `stage.js`, `edit-hub.js`, `human-ui.js`, `jianghu-ui.js`, `progression-ui.js`, `sect-life-ui.js` and `ui.js`. The retained modules may still reference their interfaces, notably `sect-infrastructure.js` requiring `FrontierData` from omitted `stage.js`. This reference is therefore intentionally not a runnable reconstruction of the source game.

`derived_reference_files` separately hashes the non-save [inspected catalogue](catalogs/inspected_catalog.json) and [current detailed audit](SOURCE_AUDIT_REPORT.md). They are generated inspection artifacts, not original archive entries. Migration inputs and mapping are separately documented in [SOURCE_DATA_CATALOG.md](SOURCE_DATA_CATALOG.md).

See [SOURCE_LICENSES_AND_ATTRIBUTION.md](SOURCE_LICENSES_AND_ATTRIBUTION.md) for the PRIVATE development-reference boundary and [SECURITY_REVIEW.md](SECURITY_REVIEW.md) for the selected-file secret inspection. No general game-code/content redistribution license is assumed.
