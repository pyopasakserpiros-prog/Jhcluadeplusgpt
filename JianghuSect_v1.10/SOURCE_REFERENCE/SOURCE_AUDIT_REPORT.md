# SOURCE archive audit and first-stage migration

Audit date: 2026-10-27. SOURCE and baseline were inspected read-only. A restricted offline JS VM loaded the actual browser data modules, without filesystem/network bindings or recovered saves. This report distinguishes source content from the newly curated target adapter.

## What is actually present

| Catalog | SOURCE effective data | TARGET baseline |
|---|---:|---:|
| Major cultivation paths | 5 | 3 |
| Subpaths | 47 | 24 |
| Technique/manual records | 681 | 287 (240 techniques +47 mantras) |
| Material registry | 591 | 61 |
| Registered starter-recipe array | 225 | 126 total target recipes |
| Additional living recipe definitions | 12 | Separate native craft systems |

The recipe counts describe different registry scopes: SOURCE also retains item recipes in its legacy item catalog. Do not interpret225 as every recipe definition in the archive. Comparing the effective SOURCE art/material/starter-recipe arrays to target IDs gives394 source-only arts,542 source-only materials,200 source-only starter recipes. Existing IDs should not be blindly replaced.

High-value source files, relative to the supplied archive:

- `02_SOURCE_FULL/source/scripts/legacy.bundle.js`: the concatenated immutable world/data/engine bundle. Contains the original three paths, expanded world definition and216 `NW_ART_*` records,240 `NW_MAT_*` materials,100 `NW_BEAST_*` species. The public world definition has24 sect templates,3 kingdoms,6 land polygons,18 regions,150 settlement specifications,110 vacant holdings. This engine is unsuitable as a second runtime inside the target.
- `living-content-v111.js`: source material/recipe/ecology expansions; two new major paths; additional branch definitions; independent cultivation tracks;66 manuals; six themed manual pools; seven rarity grades; source runtime wrappers. `buildTracksV112` generates track/realm/transition records; `makeV112Manual` expands compact manual specifications. Extract the data, not the wrappers.
- `myriad-worlds-data.js`: declarative `DATA` registry with5 entrances,15 environments,90 encounter pools,125 new species,40 rare organ templates,235 materials,165 recipes,25 experimentation designs,24 exploration event chains. `registerMyriadWorldsCatalogs` installs these into the legacy engine. Its theme/material/recipe descriptions are useful independently of that engine.
- `combat-data.js`:47 route profiles,52 innate arts and additional combat techniques, including six hidden world branches. Hidden branch schedules clone source cultivation tracks; importing these wrappers would also import their rank assumptions.
- `progression.js`:12 compact `L14_*` living recipes and pill-effect normalization. Good semantic reference, but its action handlers depend on the source human/state/ledger model.
- `jianghu-data.js`: eight fortune-site templates, six expedition sites, six external sect templates,10 equipment templates, plus adapted source catalogs. It explicitly states adaptation from the user-provided Gemini game; the referenced reuse matrix is not present in this archive.

The full extracted non-save catalog is `source_audit_catalog.json`; concise machine inventory is `source_audit_summary.json`. The converter input is the much smaller exact selection `source_selected_raw.json` / target `SOURCE_REFERENCE/migration/selected_raw.json`.

## Rank compatibility

Both SOURCE top-level `CULTIVATION_PATHS` and TARGET `JD.CULT.paths` preserve XIAN9 / BODY5 / GOD4 stages. SOURCE also has DEMON9 and HEART_SOUL9; these are excluded.

SOURCE per-subpath v1200 track ordinals are a different system: examples include SWORD_IMMORTAL9 realms, FIVE_ELEMENTS10, ELIXIR_DAO11, TIGER_SOVEREIGN8 and WAR_DEITY8. The target uses its unchanged parent-path stage arrays and thresholds. No source track, realm ordinal, breakthrough transition or lifespan table was migrated. Selected techniques use source `requiredNormalizedTier` (1–2), validated against existing target parent stages.

The requested new branches are source IDs `FROST_MOON_IMMORTAL` under XIAN, `WOOD_SPRING_BODY` under BODY, `MEDICINE_BODHI_GOD` under GOD. Their source descriptive/bonus definitions fit the target subpath schema directly. Preserve IDs and add behavior preferences in the native target system.

## Coherent first-stage selection

| Raw recipe ID | Theme / intended purpose | Tier / craft |
|---|---|---|
| MW_REC_001 | Forest mist-ginseng healing pill |1 / ALCHEMY |
| MW_REC_005 | Forest fungi + frozen snow-goat blood; BODY bone recovery pill |2 / ALCHEMY |
| MW_REC_006 | Volcanic ginger/pepper/hot-spring remedy |2 / ALCHEMY |
| MW_REC_021 | Forest ironwood/snake fang + ruins iron sword |1 / FORGING |
| MW_REC_022 | Forest river-shell/hide + ruins slate armor |1 / FORGING |
| MW_REC_044 | Forest squirrel-tail/jade-bamboo talisman brush |1 / TALISMAN |
| MW_REC_045 | Volcanic sulfur/mica + forest wax/paper talisman |2 / TALISMAN |
| MW_REC_048 | Ruins formation disk, flags, salt and quartz ward |3 / ARRAY |

There are26 input references and25 distinct materials. Every input resolves to an original source definition; no placeholder ingredient was invented. Raw records and exact source path/line references are in `selected_raw.json`. Four source themes are reused: `MW_ENV_01_ANCIENT_CANOPY`, `MW_ENV_03_FROZEN_HIGHLANDS`, `MW_ENV_04_VOLCANIC_CALDERA`, `MW_ENV_11_CELESTIAL_GARDEN_RUINS`. New target resource assignments deliberately form a small accessible economy.

| Raw art ID | Parent / branch | Native target archetype |
|---|---|---|
| NW_ART_002 | XIAN / SWORD_IMMORTAL |flurry |
| NW_ART_047 | XIAN / PHANTOM_SOUL |control |
| NW_ART_075 | BODY / TIGER_SOVEREIGN |flurry |
| NW_ART_083 | BODY / BLOOD_DRAGON |pierce |
| NW_ART_126 | GOD / WAR_DEITY |sweep |
| NW_ART_146 | GOD / UNDERWORLD_JUDGE |control |
| ART_V112_XIAN_MOON_MIRROR_T3 | XIAN / FROST_MOON_IMMORTAL |counter |
| ART_V112_BODY_IRONWOOD_BARK_T3 | BODY / WOOD_SPRING_BODY |guard |
| ART_V112_GOD_LOTUS_SANCTUARY_T3 | GOD / MEDICINE_BODHI_GOD |guard |

All nine are source-only IDs. The last three are source tier3 auxiliary defensive combat abilities, represented as target combat techniques with explicit native archetypes. Source `effectBindings`, cooldown turns, faith costs, ledger ownership and cross-path engine behavior do not automatically execute in the target. Source effect IDs/category remain provenance metadata. Optional source tier1 mantras are included only in the preserved raw selection, not imported.

## Field mapping and verification

The implemented deterministic converter is `JianghuSect_v1.10/tools/migrate_source.js`; generated data is `data/data_expansion.js`; generated exact mapping is `SOURCE_REFERENCE/migration/mapping.json`.

- All25 material,8 recipe,9 technique and4 region IDs receive `SRC110_`; the three branch IDs stay canonical. Every import carries `sourcePack`, `sourceId`, `sourcePath`. Materials use native `craft`, `value`, `terrain` fields; source value is retained while target prices are6/10/17 for tiers1/2/3.
- Recipe `craftPath/durationDays/outputType/outputNameTh` become `craft/days/outType/outNameTh`. All input IDs are namespaced. Discovery is required. Crafter compatibility is ANY; source pill affinity remains `sourceCompatiblePath` and effect metadata.
- Source restoreQi percentages become native `qiRestore` fractions; healHealth/healInjury/cultivationProgress/toxicity/equipment multipliers keep native meanings. Source clearPoison is explicitly adapted to target pill-toxin relief `clearToxic`. Source foundationBonus6 and equipment study/craft bonuses are excluded from effect and recorded in `unsupportedEffects`.
- Source elements METAL/EARTH/WATER/ICE/WOOD/LIGHT/STAR map to target EARTH_METAL/WATER_ICE/WOOD_LIFE/LIGHT_YANG/ASTRAL. Art category, subpath, role and normalized requirement map to `cat/sub/role/reqTier`. Explicit `combatArch` preserves coherent behavior in the existing target combat system.
- VM verification passed: base stage counts unchanged; data script loads twice without duplicates; conflicting imported ID rejected; all ingredients have collection routes; all techniques/recipes have discovery routes; preserved raw input is byte-identical; converter reruns produce identical data and mapping hashes. No other target files were changed by this audit/converter task.

## Source quality, private material and rights

The archive is not uniformly curated. Eighteen distinct `MAT_FORM_*` ingredients referenced by SOURCE Myriad recipes are absent from the effective material registry. Examples: `MW_REC_062`,079,080. They are excluded. Original pool placement can also conflict with a material definition: forest snake fang `MW_MAT_BP_141` appears as a direct resource only in a VOID pool. Hence original90-pool allocation should not be copied blindly into the four target routes. Some generated art effect bindings disagree with the art description; native archetypes were selected from the intended theme instead of reproducing every legacy effect.

`03_RECOVERED_SAVE/Jianghu_Cloud_Sect_Save_v2_08_3_RECOVERED.json` is explicitly a recovered user save. It was never opened, loaded, copied or used as content. Recovery evidence files such as `evidence/runtime-report-recovery-smoke-v2083.json` and `ep5-real-save-migration-v2082.json` contain save-derived metadata; omit these, exported saves, screenshots, reports and external absolute paths from redistributed source references.

No general code/content license or redistribution grant was found. `package.json` is `private:true`, which is a packaging flag, not a copyright license. The only explicit license located is `assets/NOTO_SANS_THAI_LICENSE.txt` (Noto Project Authors2022, SIL OFL1.1), covering the supplied fonts only. It does not license game code, narratives or artwork. Source art provenance comments are not a reuse license. Preserve relevant original unmodified source scripts as a private project reference with provenance; do not claim an open-source license or general redistribution permission. No source assets or recovered saves are necessary for this data adapter.
