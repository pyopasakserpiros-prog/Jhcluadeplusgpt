# Patch v1.10.5 — More Coherent Regions & Recipes

## Overview & Scope
Patch **v1.10.5** completes the roadmap milestone **P2: More coherent regions/recipes** (`Complete source originals/catalogues + current validator/converter | Add small dependency-complete packs; map actual species drops/ecology; no unsupported FORM IDs; every item has acquisition and consumption`):
- **6 Cohesive Destination Biomes**: Expanded from 4 initial regions to 6 fully realized regional destinations (`forest`, `swamp`, `frozen`, `volcano`, `desert`, `ruins`), each with distinct environmental hazards, terrains, expedition durations, danger levels, minimum combat power requirements, resident beasts, and capped renewable resources.
- **10 Authentic Regional Beasts**: Curated 10 authentic species matching habitat ecology, each with native `BEAST_PART` drops directly tied to regional hunt resources (`C.gather(..., 'hunt', beast)`).
- **14 Dependency-Complete Recipes**: Expanded from 8 to 14 recipes across `ALCHEMY`, `FORGING`, `TALISMAN`, and `ARRAY` with functional pill and equipment outputs, native skill gates, and replay protection. Zero unsupported `FORM` or `ORGAN` IDs.
- **40 Materials in a 100% Closed-Loop Economy**:
  - **100% Acquisition**: Every single material is obtainable in at least one destination region via gathering (`kind: 'gather'`) or hunting (`kind: 'hunt'`).
  - **100% Consumption**: Every single material is required as an input in at least one crafting recipe.
  - Zero stranded ingredients and zero uncraftable recipes.
- **Ecological Realignment & Habitat Correctness**:
  - `forest` (*Ancient Canopy*): Aligned with tree canopy ecology (snake `MW_BEAST_001`, flying squirrel `MW_BEAST_002`, jewel beetle `MW_BEAST_003`).
  - `swamp` (*Miasma Mangrove*): Reclaimed swamp biome for poison frog (`MW_BEAST_010`), stone snail (`MW_BEAST_013`), and acid crocodile (`MW_BEAST_011`).
  - `frozen` (*Frozen Highlands*): Enriched with spiral snow goat horns (`MW_MAT_BP_146`) and blood (`MW_MAT_BP_153`) from `MW_BEAST_018`, while preserving the hunt-only destination guardrail (gatherers autonomously bypass hunt-only routes).
  - `volcano` (*Volcanic Caldera*): Added fire porcupine (`MW_BEAST_026`) dropping fire iron quills (`MW_MAT_BP_151`), alongside volcanic sulfur and thermal ores.
  - `desert` (*Mineral Desert*): Introduced copper ant (`MW_BEAST_034`) dropping acid sacks (`MW_MAT_BP_144`) and sand shark (`MW_BEAST_035`) dropping golden fins (`MW_MAT_BP_149`), powering folded azure steel weaponry and guard seals.
  - `ruins` (*Celestial Garden Ruins*): Ancient array sanctuary with celestial salts, array plates, and purple quartz crystals.
- **Engine Version Bump**: Engine bumped from `1.10.4` to `1.10.5` across `js/sim.js`, standalone build, packaging tools, and documentation.
- **Strict Byte-Lock & Compatibility**: Byte-identical `js/human_core.js` fingerprint `155:2f9c9dd7` (`a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`) verified.

---

## Detailed Changes & System Architecture

### 1. Expanded Destination Biomes & Regional Ecology
| Region Key | Source Env ID | Biome Name (TH) | Terrain | Danger | Days | Min Power | Resident Beasts | Harvestable & Huntable Resources |
|---|---|---|---|---|---|---|---|---|
| `forest` | `MW_ENV_01_ANCIENT_CANOPY` | พงไพรบรรพกาลเร้นเมฆา | `forest` | 1 | 3 | 30 | `MW_BEAST_001`, `MW_BEAST_002`, `MW_BEAST_003` | Ginseng, white dew herb, stone fungus, stone lotus, yellow pine gum, ironwood, black pine soot, jade bamboo, bamboo talisman paper; snake fang, squirrel tail, beetle wing |
| `swamp` | `MW_ENV_02_MIASMA_MANGROVE` | บึงหมอกพิษโกงกางทมิฬ | `forest` | 2 | 4 | 60 | `MW_BEAST_010`, `MW_BEAST_011`, `MW_BEAST_013` | Glowing cave moss, slumber spores, torrent spirulina, swamp emerald iron, spider silk cocoon; poison frog skin, stone snail shell, crocodile sinew |
| `frozen` | `MW_ENV_03_FROZEN_HIGHLANDS` | ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า | `mountain` | 2 | 5 | 90 | `MW_BEAST_018` | Snow goat warm blood (`MW_MAT_BP_153`), spiral snow goat horn (`MW_MAT_BP_146`) — *Hunt-only route* |
| `volcano` | `MW_ENV_04_VOLCANIC_CALDERA` | แอ่งอัคคีหินหนืดผลาญฟ้า | `desert` | 3 | 6 | 160 | `MW_BEAST_026` | Fire ginger, red fire grass, fiery sulfur, mica flakes, volcanic copper, deep lead, thermal jade mud, spirit wax; fire porcupine quill |
| `desert` | `MW_ENV_05_MINERAL_DESERT` | ทะเลทรายศิลาแร่และพายุทรายทอง | `desert` | 2 | 5 | 110 | `MW_BEAST_034`, `MW_BEAST_035` | Folded azure steel (`MW_MAT_ORE_063`); copper ant acid sack, sand shark fin |
| `ruins` | `MW_ENV_11_CELESTIAL_GARDEN_RUINS` | ซากอุทยานสวรรค์ร่วงหล่น | `mountain` | 3 | 7 | 200 | *(Sanctum barrier)* | Raw blood rust iron, grey slate, spirit purple quartz, bagua stone plate, azure lightning salt, azure silk talisman flag |

### 2. Dependency-Complete Recipe Matrix (14 Recipes)
| Recipe ID | Name (TH) | Craft | Out Type | Tier | Inputs Required | Provenance / Function |
|---|---|---|---|---|---|---|
| `MW_REC_001` | ตำรับโอสถหมอกม่วงสมานชีพจร | `ALCHEMY` | `PILL` | 1 | `MW_MAT_HERB_001` ×2, `MW_MAT_HERB_050` ×1, `MW_MAT_BP_141` ×1 | Meridian heal + poison cleanse |
| `MW_REC_002` | ตำรับโอสถมอสหยกเรืองแสงพอกแผล | `ALCHEMY` | `PILL` | 1 | `MW_MAT_HERB_002` ×2, `MW_MAT_HERB_005` ×1, `MW_MAT_BP_142` ×1 | Wound salving + poison relief |
| `MW_REC_003` | ตำรับโอสถสปอร์นิทราสลายความปวด | `ALCHEMY` | `PILL` | 1 | `MW_MAT_HERB_003` ×2, `MW_MAT_HERB_006` ×1, `MW_MAT_BP_145` ×1 | Pain relief + heart demon calming |
| `MW_REC_005` | ตำรับโอสถถั่งเช่าหนอนศิลาหล่อเลี้ยงกระดูก | `ALCHEMY` | `PILL` | 2 | `MW_MAT_HERB_008` ×2, `MW_MAT_HERB_051` ×1, `MW_MAT_BP_153` ×1 | Bone nourishment + Body path affinity |
| `MW_REC_006` | ตำรับโอสถขิงเพลิงขับพิษเหมันต์ | `ALCHEMY` | `PILL` | 2 | `MW_MAT_HERB_010` ×2, `MW_MAT_HERB_052` ×1, `MW_MAT_EXO_117` ×1 | Cold dispel + fire vitality |
| `MW_REC_021` | ตำรับตีดาบเหล็กสนิมเลือดเขี้ยวงู | `FORGING` | `EQUIPMENT` | 1 | `MW_MAT_ORE_056` ×2, `MW_MAT_EXO_101` ×1, `MW_MAT_BP_141` ×2 | Offense blade (`combatMult`: 0.08) |
| `MW_REC_022` | ตำรับสร้างเกราะสนับแขนปูศิลา | `FORGING` | `EQUIPMENT` | 1 | `MW_MAT_ORE_058` ×2, `MW_MAT_BP_142` ×2, `MW_MAT_BP_145` ×1 | Defense vambraces (`defMult`: 0.06) |
| `MW_REC_024` | ตำรับตีทวนเหล็กพับทบครีบฉลามทราย | `FORGING` | `EQUIPMENT` | 2 | `MW_MAT_ORE_063` ×2, `MW_MAT_EXO_101` ×1, `MW_MAT_BP_149` ×2, `MW_MAT_BP_148` ×1 | Heavy halberd (`combatMult`: 0.125, `defMult`: 0.03) |
| `MW_REC_025` | ตำรับทอเสื้อเกราะไหมแมงมุมปีกแมลงทับ | `FORGING` | `EQUIPMENT` | 2 | `MW_MAT_EXO_108` ×2, `MW_MAT_BP_147` ×2, `MW_MAT_BP_151` ×1 | Heavy mail (`combatMult`: 0.03, `defMult`: 0.12) |
| `MW_REC_044` | ตำรับสร้างพู่กันขนกระรอกเมฆาหมึกสนดำ | `TALISMAN` | `EQUIPMENT` | 1 | `MW_MAT_BP_143` ×2, `MW_MAT_EXO_126` ×1, `MW_MAT_EXO_102` ×1 | Talisman brush (`combatMult`: 0.04) |
| `MW_REC_045` | ตำรับจารึกยันต์ระเบิดเพลิงกำมะถัน | `TALISMAN` | `EQUIPMENT` | 2 | `MW_MAT_ORE_086` ×2, `MW_MAT_ORE_087` ×1, `MW_MAT_EXO_111` ×1, `NW_MAT_191` ×2 | Fire blast talisman (`combatMult`: 0.14) |
| `MW_REC_048` | ตำรับสร้างจานค่ายกลแปดทิศเกลือสายฟ้า | `ARRAY` | `EQUIPMENT` | 3 | `MW_MAT_EXO_131` ×1, `MW_MAT_EXO_125` ×2, `MW_MAT_EXO_130` ×2, `MW_MAT_ORE_067` ×1 | Lightning array disk (`combatMult`: 0.08, `defMult`: 0.15) |
| `MW_REC_056` | ตำรับตีตราพิทักษ์ถุงกรดมดเกราะทองแดง | `FORGING` | `EQUIPMENT` | 1 | `MW_MAT_BP_144` ×2, `MW_MAT_BP_146` ×1 | Protective seal (`combatMult`: 0.059, `defMult`: 0.064) |
| `MW_REC_066` | ตำรับตีศาสตราแร่ทองแดงเพลิงภูเขาไฟ | `FORGING` | `EQUIPMENT` | 2 | `MW_MAT_ORE_060` ×2, `MW_MAT_ORE_061` ×1, `MW_MAT_ORE_088` ×1 | Blazing polearm (`combatMult`: 0.144, `defMult`: 0.035) |

### 3. Repeatable Converter & Tooling Updates
- `tools/migrate_source.js`:
  - Updated to consume all 10 authentic beasts, 40 materials, 14 recipes, and 6 curated routes from `selected_raw.json`.
  - Dynamically binds beasts to regions via authentic drops (`beasts.filter(b => b.drops.some(id => route.materials.map(ident).includes(id)))`).
  - Distributes all 9 specialization combat techniques evenly across all 6 regions matching elemental and functional affinity.
  - Generates byte-deterministic `data/data_expansion.js` and `SOURCE_REFERENCE/migration/mapping.json`.
  - Asserts zero unreachable ingredients, zero undiscoverable recipes, and zero undiscoverable techniques.

---

## Verification & Simulation Evidence

### 1. Test Suite Results (21/21 PASS)
- `test/coherent_regions_recipes.js` added and executed:
  1. `CONTENT.validate()`: zero errors across all definitions.
  2. Counts verified: 6 regions, 10 beasts, 14 recipes, 40 materials, 9 techniques, 3 subpaths.
  3. Closed-loop verified: exactly 40 materials acquired across 6 regions, exactly 40 materials consumed across 14 recipes (0 unacquired, 0 unconsumed).
  4. Species ecology verified: all 10 beasts drop regional hunt materials, and all regional hunt materials are dropped by resident beasts.
  5. Expedition cargo verified: `C.gather(..., 'hunt', beast)` produces authentic drops for every beast species.
  6. Hunt-only guardrail verified: `frozen` route has 0 gather resources and is autonomously avoided by gather expeditions.
  7. Crafting verified: all 14 recipes craft cleanly, deduct inputs, mint outputs, and reject duplicate receipt replay.
  8. Renewable supply verified: regional stock depletes, regenerates over time, and serializes losslessly.
- Master test suite `node test/run_all.js`: **21/21 PASS**.

### 2. Full 360-Day Assertion Simulation (`test/results/long_v1105_seed1.json`)
- Seed: `v1105-seed1`, 360 days (518,400 ticks), 42 cultivators.
- Zero runtime crashes, zero undefined reference exceptions.
- Content discovery: all 14 formula scrolls discovered, 14 donated to sect library, 19 authorizations granted.
- Expeditions: 97 expeditions completed (160 regional materials gathered, 109 beast parts hunted).
- Production & Consumption: Active crafting and personal purchases across both old and new items (`MW_REC_001`, `MW_REC_002`, `MW_REC_005`, `MW_REC_006`, `MW_REC_024`, `MW_REC_025`, `MW_REC_066`).
- CP economy: 64,356 minted / 42,679 burned, final price index `1.186` (stable equilibrium).
- External market: 63 visitor visits, 151 sect spirit stones reserve, positive member commerce.

---

## File Deliverables
- Standalone Playable Game: `JianghuSect_single.html` (1,002 KB)
- Full Release Package: `JianghuSect_v1-10-5.zip`
