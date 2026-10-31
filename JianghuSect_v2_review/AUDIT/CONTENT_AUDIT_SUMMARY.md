# Content Audit Summary — Runtime-Derived Inventory

**Baseline:** main-1 / v1.12.4 Small Logic Hotfix  
**Manifest:** `CONTENT_AUDIT_MANIFEST.json`  
**Generated:** 31 October 2026

## 1. Manifest size and coverage

- 3,661 record occurrences collected from live data registries and the Edit Hub catalog.
- 1,979 unique IDs across those occurrences.
- Duplicate ID occurrences are intentionally preserved with their source registry/path; do not deduplicate away provenance.
- The manifest records current display name, registry, source file, category, path/subpath, tier/grade/rarity, equipment type, hard weapon/armor requirements, raw element-like fields, effect IDs and effect-key hints.

This is an exhaustive *starting inventory* for the included source. Gemini must rebuild it from the active source branch and expand it if new registries or nested IDs exist.

## 2. Registry counts

| Registry family | Runtime count |
|---|---:|
| Core personality / values / aptitudes | 14 / 8 / 6 |
| Root grades | 5 |
| Constitutions / archetypes | 12 / 10 |
| Curated / extra / proc traits | 24 / 4 / 360 |
| Element-trait seed profiles | 20 |
| Main cultivation paths | 5 |
| Main cultivation subpaths | 37 (11 XIAN, 10 BODY, 8 GOD, 4 DEMON, 4 HEART_SOUL) |
| Main techniques / mantras | 397 / 71 |
| Merged items materials / items / recipes | 261 / 157 / 278 |
| Martial items / recipes / techniques | 42 / 42 / 10 |
| Martial overhaul passives | 64 |
| Martial legendary techniques / mantras | 12 / 10 |
| Martial synergies / innate techniques | 14 / 12 |
| Expansion subpaths / materials / recipes / techniques | 3 / 40 / 14 / 9 |
| Expansion regions / beasts / rare organs / experiments / factions | 6 / 10 / 10 / 8 / 6 |
| Beast species / kings | 110 / 6 |
| Ecology species / materials / recipes / items | 80 / 160 / 80 / 32 |
| Breakthrough pill recipes / treasures | 31 / 23 |
| Combat pill recipes / basic pill recipes / recovery entries | 6 / 8 / 6 |
| Legendary weapons | 11 |
| Edit Hub catalog descriptors | 1,102 |

## 3. Existing affinity taxonomy

The original `h.affinities` object has 23 values.

**Eight elemental keys:**

`FIRE`, `WATER_ICE`, `LIGHTNING`, `WIND`, `EARTH_METAL`, `WOOD_LIFE`, `YIN_SHADOW`, `LIGHT_YANG`

**Fifteen non-elemental keys:**

`ALCHEMY`, `FORGING`, `ARRAY`, `TALISMAN`, `BEAST_TAMING`, `POISON`, `MEDICINE`, `SCRIPTURE`, `SWORD`, `BLADE`, `SPEAR`, `FIST_PALM`, `MOVEMENT`, `BODY_REFINING`, `SOUL_DIVINE`

Keep one data object; only group them in the UI.

## 4. Element tags extracted from registry fields

The manifest found these raw values and occurrence counts. Some are true elements, some are weapon/discipline tags and some require semantic review.

| Raw tag | Field occurrences | Initial interpretation |
|---|---:|---|
| `ARRAY` | 2 | Discipline/craft tag; inspect context |
| `ASTRAL` | 59 | Special element |
| `BEAST_TAMING` | 1 | Discipline tag |
| `BLADE` | 1 | Weapon/discipline tag |
| `BLOOD` | 1 | Ambiguous; inspect content |
| `BLOOD_DEMON` | 30 | Special element |
| `BODY_REFINING` | 1 | Discipline tag |
| `CHAOS` | 2 | Ambiguous special/composite concept |
| `EARTH` | 1 | Legacy element alias candidate |
| `EARTH_METAL` | 130 | Canonical ordinary root |
| `FIRE` | 91 | Canonical ordinary root |
| `FIVE_ELEMENTS` | 2 | Composite concept; inspect weights/meaning |
| `FORGING` | 1 | Discipline/craft tag |
| `ICE` | 2 | Legacy alias candidate |
| `LIGHT` | 3 | Legacy alias candidate; inspect context |
| `LIGHT_YANG` | 76 | Canonical ordinary root |
| `LIGHTNING` | 46 | Canonical ordinary root |
| `MEDICINE` | 1 | Discipline tag |
| `METAL` | 9 | Legacy alias candidate; inspect context |
| `NEUTRAL` | 136 | Explicit no-element only when intentional |
| `POISON` | 1 | Discipline/element theme; inspect context |
| `SCRIPTURE` | 1 | Discipline tag |
| `SOUL_DIVINE` | 1 | Discipline tag |
| `SPEAR` | 1 | Weapon/discipline tag |
| `SWORD` | 1 | Weapon/discipline tag |
| `WATER` | 2 | Legacy alias candidate |
| `WATER_ICE` | 81 | Canonical ordinary root |
| `WIND` | 57 | Canonical ordinary root |
| `WOOD` | 4 | Legacy alias candidate |
| `WOOD_LIFE` | 102 | Canonical ordinary root |
| `YANG` | 2 | Legacy alias candidate |
| `YIN` | 7 | Legacy alias candidate |
| `YIN_SHADOW` | 67 | Canonical ordinary root |

The raw tags were extracted from fields named `element`, `elements`, `elementTags`, `elementTag`, `affinity` and `affinities`. Field context is not enough to prove semantic meaning. Gemini must inspect each record and decide whether a tag is intrinsic, a link, a discipline, a weapon type, a special element, an explicit no-element marker or unresolved.

## 5. Required final classification counts

Gemini must fill in the final counts after the content pass:

- Intrinsic single-element records.
- Weighted multi-element records.
- Element-link-only records.
- Special-element records.
- Explicit non-elemental records.
- Unresolved records (target: zero before final delivery; if any remain, list each with reason).

Do not guess these counts from raw tag frequency. They must come from the final audited per-ID manifest.
