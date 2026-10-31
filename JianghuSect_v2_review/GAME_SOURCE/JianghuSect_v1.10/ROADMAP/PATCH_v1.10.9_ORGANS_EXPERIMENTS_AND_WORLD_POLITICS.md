# Patch v1.10.9 — Rare Organs, Property Experimentation & Factions/World Politics

**Milestone:** Priority P3 — Rare organs, experiments, factions/world politics (`v1.10.9`)  
**Engine Target:** `JianghuSect v1.10.9` (Single Native Engine `W`, Human Core `155:2f9c9dd7` Byte-Locked)  
**Status:** Completed & Verified (`25/25` Test Suites Passed + `360-Day` Full Assertion Simulation Passed)

---

## 1. Executive Summary

Patch `v1.10.9` completes the final roadmap milestone (`Priority P3: Rare organs, experiments, factions/world politics`) by migrating authentic anatomical rare organs, property-based experimentation designs, and external sect faction templates from `SOURCE_REFERENCE` into `data/data_expansion.js` (`tools/migrate_source.js`) and wiring them into the single native `W` simulation loop (`js/content.js`, `js/expedition.js`, `js/ui.js`):

1. **Anatomical Rare Beast Organs (`D.rareOrgans`, `W.sect.organs`, `CONTENT.harvestOrgan`, `CONTENT.donateOrgan`, `CONTENT.refineOrgan`)**:
   - Ported **10 authentic mutated beast organs** (`SRC110_MW_ORGAN_001`..`SRC110_MW_ORGAN_024`) from `myriadWorlds.rareOrgans` mapped to the 10 resident beast species (`D.beasts`) and 6 regional biomes (`D.regions`), while keeping the closed-loop `D.materials` (`40`) and `D.recipes` (`14`) invariants 100% intact.
   - **Real Generation**: During regional beast hunts (`CONTENT.gather(..., 'hunt', beast)`), the hunting party performs anatomical dissection (`CONTENT.harvestOrgan`), comparing party `survival`, `MEDICINE`, `dexterity`, and `perceptiveness` against `organ.dissectionDifficulty`. Intact extractions enter `out.organs` and settle into `W.sect.organs` on expedition handover (`EXPED.handover`), awarding contribution points (`10 × tier`) and revealing material property tags.
   - **Real Consumption**: Stored organs in `W.sect.organs` (or personal `n.inv.organs`) are physically consumed either as **high-potency reaction catalysts** in property experimentation (`+18%` breakthrough chance) or via **direct meridian/organ refinement (`CONTENT.refineOrgan`)**, which consumes 1 organ + spirit stones to heal injuries, purge pill toxicity and heart demons, boost breakthrough foundation (`c.found`), and grant deterministic cultivation progress.

2. **Property-Based Experimentation (`D.experiments`, `W.sect.experiments`, `CONTENT.runExperiment`, `CONTENT.recipeSynergy`)**:
   - Ported **8 authentic property experiment designs** (`SRC110_MW_EXP_001`..`SRC110_MW_EXP_017`) across `ALCHEMY`, `FORGING`, `TALISMAN`, and `ARRAY`, each linked to closed-loop `D.materials` trial inputs, a rare organ catalyst (`catalystOrganId`), and a target recipe (`linkedRecipeId`).
   - **Real Consumption & Progressive Revelation**: Running an experiment (`CONTENT.runExperiment`) atomically consumes the required `trialInputs` and `stoneCost` (plus 1 optional catalyst organ if available). Even on failure, the researcher records a bounded research note (`W.sect.experiments.notes`, capped at 30, granting `+14%` per note up to `+28%` on future trials) and reveals all `requiredPropertyTags` in `W.sect.experiments.propertyKnowledge`. Failed poisonous trials (`SRC110_MW_EXP_006`) inflict mild pill toxicity.
   - **Deterministic Breakthroughs & Permanent Crafting Synergies**: Successful experiments register in `W.sect.experiments.discovered`, unlock the linked recipe in `W.sect.knownRecipes`, grant personal recipe authorization to the researcher, synthesize a real prototype pill or high-quality equipment item into `W.sect.stock` / `W.sect.gear`, and permanently enhance all future `ECO.finishCraft` runs of that recipe (`+qualityBonus`, `+yieldBonus`, `+combatMultBonus`, `+defenseMultBonus`).

3. **Factions, Treaties & World Politics (`D.factions`, `W.world.politics`, `CONTENT.signTreaty`, `CONTENT.spawnPoliticalEvent`, `CONTENT.resolvePoliticalEvent`, `CONTENT.tickPolitics`)**:
   - Ported **6 authentic external sect faction templates** (`SRC110_FACTION_CN`, `SG`, `IN`, `JP`, `VN`, `RU`) from `EXTERNAL_SECTS_TEMPLATES_V300`, enriching `W.world.sects` (`S0`..`S5`) with doctrine alignments (`RIGHTEOUS`, `NEUTRAL`, `UNORTHODOX`, `DEMONIC`), leader titles, specialty regional materials (`specialtyMatIds`), and treaty states (`NONE`, `TRADE_PACT`, `NON_AGGRESSION`, `ALLIANCE`, `EMBARGO`).
   - **Treaties & Real Resource Flows**:
     - `TRADE_PACT` (40 stones, `attitude >= 15`) and `ALLIANCE` (80 stones, `attitude >= 45`) lower market price multipliers on the partner's specialty materials (`×0.90`) and deliver **2 units of specialty materials every 10 days** in exchange for 12 spirit stones (`tradeShipments`).
     - `ALLIANCE` partners dispatch border reinforcements during incoming sect raids (`EXPED.spawnRaid`), reducing raid strength and logging `jointDefenses`.
     - `EMBARGO` (triggered at `attitude <= -60` or after defying tribute demands) raises specialty material prices (`×1.20`) and increases raid tension.
   - **Persistent Political Events**: Bounded political events (`SPECIALTY_CARAVAN`, `TRIBUTE_DEMAND`, `DOCTRINE_SUMMIT`, `BORDER_HERB_DISPUTE`) spawn and resolve deterministically (`CONTENT.resolvePoliticalEvent`) with real spirit-stone, material, fame, attitude, and cultivation consequences, stored in bounded history (`W.world.politics.events`, max 40 entries).

---

## 2. Curated Catalog Summary (`data/data_expansion.js`)

### 2.1 Rare Beast Organs (`D.rareOrgans` — 10 Records)

| ID | Name (TH) | Tier | Element | Anatomy | Difficulty | Resident Beast | Region | Refinement Effects |
|---|---|---:|---|---|---:|---|---|---|
| `SRC110_MW_ORGAN_010` | ถุงดีทองคำกลืนพิษ | 2 | `WOOD_LIFE` | `HEART_GALL` | 34 | งูไม้หนามพรางใบ | พงไพรบรรพกาลเร้นเมฆา | `clearToxic: 32`, `healHealth: 28`, `cultivationProgress: 14` |
| `SRC110_MW_ORGAN_001` | ต่อมกังวานคู่สะท้อนปราณ | 2 | `WIND` | `HEART_GALL` | 32 | กระรอกบินหางเมฆา | พงไพรบรรพกาลเร้นเมฆา | `qiRestore: 0.45`, `cultivationProgress: 16`, `clearHeartDemon: 10` |
| `SRC110_MW_ORGAN_008` | ต่อมไหมเหล็กไหลดารา | 3 | `METAL` | `SILK_SAC` | 44 | แมลงทับเกราะมรกตดูดยางไม้ | พงไพรบรรพกาลเร้นเมฆา | `foundationBonus: +5%`, `cultivationProgress: 18`, `healInjury: 25` |
| `SRC110_MW_ORGAN_006` | ถุงพิษผลึกเจ็ดสีกลายพันธุ์ | 3 | `WOOD_LIFE` | `VENOM_GLAND` | 46 | กบหมอกพิษลายจุดเจ็ดสี | บึงหมอกพิษโกงกางทมิฬ | `clearToxic: 42`, `cultivationProgress: 20`, `healHealth: 30` |
| `SRC110_MW_ORGAN_011` | เส้นเอ็นเงาไร้เสียงพับมิติ | 4 | `YIN_SHADOW` | `TENDON_TAIL` | 55 | จระเข้เกราะทมิฬบึงน้ำกรด | บึงหมอกพิษโกงกางทมิฬ | `foundationBonus: +6%`, `cultivationProgress: 24`, `clearHeartDemon: 14` |
| `SRC110_MW_ORGAN_012` | ต่อมแสงชีวภาพล่อวิญญาณ | 2 | `WATER_ICE` | `SENSORY_ORGAN` | 36 | หอยทากศิลาพิษกลืนแร่ | บึงหมอกพิษโกงกางทมิฬ | `clearHeartDemon: 22`, `cultivationProgress: 15`, `qiRestore: 0.35` |
| `SRC110_MW_ORGAN_023` | กรงเล็บผลึกน้ำแข็งนิรันดร์ | 4 | `WATER_ICE` | `FANG_CLAW` | 52 | แพะภูผาหิมะเขาเกลียว | ทุ่งทุนดราเหมันต์เก้าชั้นฟ้า | `clearHeartDemon: 24`, `cultivationProgress: 22`, `healInjury: 28` |
| `SRC110_MW_ORGAN_013` | กระดูกอกหลอมรวมหินหนืด | 3 | `FIRE` | `BONE_HORN` | 47 | เม่นเหล็กเพลิงขนหนามแดง | แอ่งอัคคีหินหนืดผลาญฟ้า | `healHealth: 45`, `healInjury: 30`, `foundationBonus: +5%`, `cultivationProgress: 20` |
| `SRC110_MW_ORGAN_019` | เปลือกกระดองจารึกดาวเหนือ | 5 | `ASTRAL` | `SCALE_CARAPACE` | 70 | มดเกราะทองแดงขุดแร่ | ทะเลทรายศิลาแร่และพายุทรายทอง | `foundationBonus: +8%`, `cultivationProgress: 28`, `clearHeartDemon: 26` |
| `SRC110_MW_ORGAN_024` | หัวใจศิลาหลอมปฐพี | 3 | `EARTH` | `HEART_GALL` | 44 | ฉลามทรายครีบใบมีดทอง | ทะเลทรายศิลาแร่และพายุทรายทอง | `healHealth: 40`, `foundationBonus: +5%`, `cultivationProgress: 19` |

### 2.2 Property Experiment Designs (`D.experiments` — 8 Records)

| ID | Name (TH) | Discipline | Tier | Linked Recipe | Catalyst Organ | Synergy Bonus |
|---|---|---|---:|---|---|---|
| `SRC110_MW_EXP_001` | โอสถมอสหยกเรืองแสง (สูตรค้นคว้าประยุกต์) | `ALCHEMY` | 1 | `SRC110_MW_REC_002` | `SRC110_MW_ORGAN_001` | `quality +0.14`, `yield +1` |
| `SRC110_MW_EXP_002` | โอสถถั่งเช่าหนอนศิลา (สูตรค้นคว้าประยุกต์) | `ALCHEMY` | 2 | `SRC110_MW_REC_005` | `SRC110_MW_ORGAN_010` | `quality +0.15`, `yield +1` |
| `SRC110_MW_EXP_006` | โอสถขิงเพลิงขับพิษเหมันต์ (สูตรค้นคว้าประยุกต์) | `ALCHEMY` | 2 | `SRC110_MW_REC_006` | `SRC110_MW_ORGAN_006` | `quality +0.16`, `yield +1` |
| `SRC110_MW_EXP_008` | ศาสตราเขี้ยวงูไม้แก่นเหล็ก (สูตรค้นคว้าประยุกต์) | `FORGING` | 1 | `SRC110_MW_REC_021` | `SRC110_MW_ORGAN_008` | `quality +0.15`, `combatMult +0.04` |
| `SRC110_MW_EXP_010` | เสื้อเกราะไหมแมงมุมปีกแมลงทับ (สูตรค้นคว้าประยุกต์) | `FORGING` | 2 | `SRC110_MW_REC_025` | `SRC110_MW_ORGAN_011` | `quality +0.16`, `defMult +0.05` |
| `SRC110_MW_EXP_013` | ศาสตราแร่ทองแดงเพลิงภูเขาไฟ (สูตรค้นคว้าประยุกต์) | `FORGING` | 2 | `SRC110_MW_REC_066` | `SRC110_MW_ORGAN_013` | `quality +0.16`, `combatMult +0.05` |
| `SRC110_MW_EXP_015` | พู่กันขนเมฆาไผ่หยก (สูตรค้นคว้าประยุกต์) | `TALISMAN` | 1 | `SRC110_MW_REC_044` | `SRC110_MW_ORGAN_012` | `quality +0.14`, `yield +1` |
| `SRC110_MW_EXP_017` | จานค่ายกลแปดทิศเกลือสายฟ้า (สูตรค้นคว้าประยุกต์) | `ARRAY` | 3 | `SRC110_MW_REC_048` | `SRC110_MW_ORGAN_019` | `quality +0.18`, `defMult +0.06` |

### 2.3 External Sect Faction Templates (`D.factions` — 6 Records)

| ID | Code | Faction Name (TH) | Alignment | Path | Preferred Treaty | Specialty Materials |
|---|---|---|---|---|---|---|
| `SRC110_FACTION_CN` | `CN` | สำนักมังกรบรรพกาลหลงหยวน | `RIGHTEOUS` (ฝ่ายธรรมะเสาหลัก) | `XIAN` | `ALLIANCE` | รากโสมหมอกม่วงซ่อนปราณ, จานศิลาแปดทิศหยินหยาง |
| `SRC110_FACTION_SG` | `SG` | หอประมูลไข่มุกสวรรค์หนานไห่ | `NEUTRAL` (ฝ่ายเป็นกลางการค้า) | `XIAN` | `TRADE_PACT` | เห็ดถั่งเช่าหนอนศิลา, ผลึกควอตซ์ม่วงสะกดวิญญาณ |
| `SRC110_FACTION_IN` | `IN` | มหาอารามเทวะสุริยัน | `RIGHTEOUS` (ฝ่ายธรรมะศรัทธา) | `GOD` | `NON_AGGRESSION` | รากบัวศิลาต้านพิษ, น้ำพุร้อนกำมะถันล้างไขกระดูก |
| `SRC110_FACTION_JP` | `JP` | หมู่ตึกอัสนีบูรพา | `NEUTRAL` (ฝ่ายอิสระคลั่งยุทธ์) | `BODY` | `NON_AGGRESSION` | เหล็กกล้าพับทบปราณคราม, เกลือสายฟ้าสีคราม |
| `SRC110_FACTION_VN` | `VN` | หุบเขาหมื่นพิษมรกต | `UNORTHODOX` (ฝ่ายอธรรมเร้นลับ) | `DEMON` | `TRADE_PACT` | สปอร์เห็ดหลับใหลสีเทา, หนังกบหมอกพิษลายจุด |
| `SRC110_FACTION_RU` | `RU` | วังเหมันต์อุดรพิฆาต | `DEMONIC` (ฝ่ายมารโลหิตน้ำแข็ง) | `BODY` | `NONE` | เลือดอุ่นแพะภูผาหิมะ, แร่ตะกั่วน้ำลึกถ่วงสมุทร |

---

## 3. Verification & 360-Day Full Assertion Simulation

- **Unit & Integration Test Suite (`node test/run_all.js`)**: All **25/25** test groups pass (`test/organs_experiments_politics.js` + all 24 prior suites + syntax validation).
- **Human Core Byte-Lock**: `js/human_core.js` verified byte-identical (`SHA-256: a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`, fingerprint `155:2f9c9dd7`).
- **360-Day Observational & Invariant Simulation (`test/results/long_v1109_seed1.json`)**:
  - `518,400` ticks (`360` days), `64` living cultivators, `7,463` sect spirit stones, `1.017` CP price index.
  - `4` intact rare organs harvested and donated (`1` refined for meridian tempering, `3` stored in vault), `1` property experiment discovered (`SRC110_MW_EXP_010`), `20` political events generated and `19` resolved with bounded histories (`<= 40` entries).
