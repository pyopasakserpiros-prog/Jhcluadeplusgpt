# Patch v1.10.8 — Native `DEMON` and `HEART_SOUL` Paths (Priority P3)

## Overview
This patch completes the **Priority P3: Native `DEMON` and `HEART_SOUL` paths** milestone from `ROADMAP/ROADMAP.md`, elevating both `DEMON` (วิถีมารอสูร) and `HEART_SOUL` (วิถีจิต·เซน) from reference-only catalog entries into full native first-class cultivation paths alongside `XIAN`, `BODY`, and `GOD`, while preserving the `js/human_core.js` byte-lock invariant (`155:2f9c9dd7`) and 100% legacy save compatibility.

---

## 1. Native Major Paths, 9-Stage Progression & 8 Authentic Subpaths (`data/data_cult.js`)
- **`DEMON` (วิถีมารอสูร · `#e599f7`)**:
  - **9 Authentic Stages**:
    1. ก่อเมล็ดมาร (`lifespanMax: 85`, `combatPower: 42`, `breakthroughBaseChance: 0.72`)
    2. หลอมโลหิตอสูร (`lifespanMax: 120`, `combatPower: 95`, `breakthroughBaseChance: 0.62`)
    3. ควบแน่นแก่นมาร (`lifespanMax: 175`, `combatPower: 220`, `breakthroughBaseChance: 0.50`)
    4. ก่อกำเนิดทารกมาร (`lifespanMax: 260`, `combatPower: 520`, `breakthroughBaseChance: 0.40`)
    5. จิตอสูรแยกเงา (`lifespanMax: 380`, `combatPower: 1200`, `breakthroughBaseChance: 0.31`)
    6. หลอมรวมสุญตามาร (`lifespanMax: 540`, `combatPower: 2700`, `breakthroughBaseChance: 0.23`)
    7. จ้าวมารครองภพ (`lifespanMax: 740`, `combatPower: 6000`, `breakthroughBaseChance: 0.16`)
    8. มหามารข้ามทัณฑ์ (`lifespanMax: 980`, `combatPower: 13000`, `breakthroughBaseChance: 0.11`)
    9. จอมมารนิรันดร์ (`lifespanMax: 1350`, `combatPower: 28000`, `breakthroughBaseChance: 0.07`)
  - **4 Subpaths**:
    - `SHADOW_ASSASSIN` (สายนักฆ่าเงาไร้ลักษณ์)
    - `VENOM_GU_SOVEREIGN` (สายจ้าวพิษกู่หมื่นอสรพิษ)
    - `NETHER_GHOST_KING` (สายราชันย์ภูตยมโลก)
    - `HEAVEN_DEVOURING_DEMON` (สายจอมมารกลืนสวรรค์)
- **`HEART_SOUL` (วิถีจิต·เซน · `#a5d8ff`)**:
  - **9 Authentic Stages**:
    1. ส่องใจเห็นแจ้ง (`lifespanMax: 95`, `combatPower: 36`, `breakthroughBaseChance: 0.76`)
    2. สงบนิ่งไร้คลื่น (`lifespanMax: 140`, `combatPower: 82`, `breakthroughBaseChance: 0.66`)
    3. ก่อตั้งแท่นดอกบัวใจ (`lifespanMax: 210`, `combatPower: 195`, `breakthroughBaseChance: 0.54`)
    4. จิตวิญญาณจำแลง (`lifespanMax: 310`, `combatPower: 460`, `breakthroughBaseChance: 0.43`)
    5. ทะเลสาบจิตไร้ขอบเขต (`lifespanMax: 450`, `combatPower: 1080`, `breakthroughBaseChance: 0.34`)
    6. หลอมรวมใจฟ้าดิน (`lifespanMax: 640`, `combatPower: 2500`, `breakthroughBaseChance: 0.26`)
    7. สุญตาไร้ตัวตน (`lifespanMax: 860`, `combatPower: 5600`, `breakthroughBaseChance: 0.19`)
    8. ข้ามฝั่งวัฏสงสาร (`lifespanMax: 1120`, `combatPower: 12200`, `breakthroughBaseChance: 0.13`)
    9. พุทธะจิตนิรันดร์ (`lifespanMax: 1400`, `combatPower: 26500`, `breakthroughBaseChance: 0.09`)
  - **4 Subpaths**:
    - `ZEN_VOID_MIND` (สายปราชญ์เซนสุญตา)
    - `CALLIGRAPHY_PAINTING_SAGE` (สายเมธีพู่กันภาพมายา)
    - `DREAM_ILLUSION_WEAVER` (สายจ้าวมายาฝันนิรันดร์)
    - `MIND_SWORD_TELEKINESIS` (สายจอมกระบี่จิตไร้รูป)

---

## 2. Independent 9-Realm Specialization Tracks (`tools/migrate_source.js`, `data/data_expansion.js`)
- Ported all 8 authentic 9-realm independent tracks from `SOURCE_REFERENCE/extracted/02_SOURCE_FULL/source/scripts/living-content-v111.js` into `D.progressionMapping` (expanding `tracksCount` from 3 to 11 while preserving `D.subPaths.length === 3` and `D.techniques.length === 9`):
  - Every `DEMON` and `HEART_SOUL` subpath awakens with `npc.cult.track` (`mode: 'INDEPENDENT_TRACK'`, `ordinal: 1..9`), complete with skill gates (`YIN_SHADOW`/`MOVEMENT`, `POISON`/`ALCHEMY`, `SOUL_DIVINE`/`YIN_SHADOW`, `FIST_PALM`/`YIN_SHADOW`, `SOUL_DIVINE`/`SCRIPTURE`, `SCRIPTURE`/`TALISMAN`, `SOUL_DIVINE`/`WIND`, `SWORD`/`SOUL_DIVINE`) and spirit stone costs.
  - `DEMON` track realms grant progressive `lifestealPct` (`1.2%` to `10.8%`), `combatOffensePct`, `armorPenetrationPct`, `evasionPct`, and `senseBonus`.
  - `HEART_SOUL` track realms grant progressive `reflectPct` (`1.4%` to `12.6%`), `combatOffensePct`, `combatDefensePct`, `evasionPct`, and `senseBonus`.

---

## 3. Distinct Strategic Costs, Risks & Training Mechanics (`js/cultivation.js`, `js/ai.js`, `js/cpeco.js`)
- **Autonomous Path Selection (`CULT.pathScores`)**:
  - `DEMON` is favored by NPCs with high `ambition`, `aggression`, `powerStatus`, `YIN_SHADOW`/`POISON` affinities, and lower `integrity`/`empathy`.
  - `HEART_SOUL` is favored by NPCs with high `comprehension`, `intuition`, `composure`, `SOUL_DIVINE`/`SCRIPTURE` affinities, and `meditation`/`arts` interests.
- **`DEMON` Strategic Mechanics**:
  - **Heart-Demon Channeling**: Moderate `heartDemon` (`<= 60`) fuels demonic cultivation rate up to `+22%` (`1 + (hd / 60) * 0.22`) and combat power up to `+12%` (`<= 65`), whereas excessive `heartDemon` (`> 60`) causes a sharp rate drop and breakthrough penalty.
  - **Toxicity Tolerance**: Tolerates pill/Gu toxicity far better than orthodox paths (`c.toxic / 240`, or `c.toxic / 360` for `VENOM_GU_SOVEREIGN`), allowing pill usage up to `toxic < 52`.
  - **Training & Backlash Risk**: Prefers secluded ruins (`ruin:explore`) or meditation halls; practices `POISON` / `stealth` / `SOUL_DIVINE`, trains `willpower` and `explosiveness`, and gradually accumulates `heartDemon` (`+0.35` per hour). If `heartDemon >= 78`, risks minor demonic qi deviation during cultivation; breakthrough failure triggers `DEMONIC_BACKLASH_FRENZY` (extra `heartDemon` spike and HP backlash).
- **`HEART_SOUL` Strategic Mechanics**:
  - **Zen Clarity & Mental Purity**: Scales primarily with `comprehension`, `willpower`, and `composure` (less dependent on physical spirit root grade). Gains `+15%` Zen Clarity rate bonus when `heartDemon <= 10 && stress <= 25`, but suffers steeper penalties when `heartDemon` or `stress` is high.
  - **Purification & Mental Drain**: Prefers `meditation_hall`, `spirit_pond`, `tea_garden`, or `ancestral` hall; consumes higher mental rest (`rest -0.032/tick`) while actively purifying `heartDemon` (`-0.035/tick`) and `stress`, practicing `SOUL_DIVINE` / `arts`, and training `focus`, `comprehension`, and `wisdom`.
  - **Soul Shatter Risk & Breakthrough Payoff**: Successful breakthrough purifies `-15` `heartDemon` and permanently increases `comprehension`; failed breakthrough triggers `SOUL_SHATTER_ILLUSION_LOST` (`qi` shattered to `0`, heavy `rest` drain, and `stress` spike).

---

## 4. Stats, Mantras, 45 Learnable Techniques, Bottlenecks & Combat Passives
- **Mantras & Techniques (`data/data_tech.js`, `js/skills.js`)**:
  - Added 7 `DEMON_MANTRA` (tiers 1–7) and 7 `SOUL_MANTRA` (tiers 1–7) plus 45 authentic techniques across all 8 `DEMON` and `HEART_SOUL` subpaths (tiers 1–7, covering `COMBAT_TECHNIQUE`, `LIGHTNESS_ART`, `AUXILIARY_ART`, and `FORBIDDEN_ART`), including signature summons (`ภูตยมโลก` for `NETHER_GHOST_KING` and `ร่างมายาฝัน` for `DREAM_ILLUSION_WEAVER`).
- **Bottleneck Pills & Treasures (`data/data_bt.js`, `js/bottleneck.js`)**:
  - Registered 16 path-specific bottleneck pill recipes (`BT_DEMON_1..8` and `BT_HEART_SOUL_1..8`) and 12 major bottleneck treasures (`DEMON:3..8` and `HEART_SOUL:3..8`).
- **Stats & Combat Passives (`js/stats.js`, `js/combat.js`)**:
  - Added `DEMON` and `HEART_SOUL` weights to `PATHW`, `SUBFX`, mantra bonuses (`compute` and `getBaseFast` with `cPath` cache key), and `ST.preFight` pill preferences.
  - Implemented `DEMON` on-hit `lifestealPct` healing in `COMBAT.strike` and Blood-Qi Harvest on `COMBAT.slay` (`CULT.gain`, `qi` restore, `+1.5` `heartDemon`).
  - Implemented `HEART_SOUL` on-hit `reflectPct` damage reflection in `COMBAT.strike` and mental tempering (`heartDemon` reduction, `stress` reduction, `wisdom` gain) after `COMBAT.sparEnd` and `COMBAT.duelEnd`.
- **UI & Visuals (`js/render.js`, `js/main.js`, `js/ui.js`)**:
  - Added `DEMON` (`#e599f7`) and `HEART_SOUL` (`#a5d8ff`) robe/aura colors in `js/render.js` and minimap indicators in `js/main.js`.
  - Updated `UI.rSect` (`over` tab) to display `มารอสูร` and `จิต·เซน` cultivator counts and `UI.rContent` to render all 11 independent 9-realm tracks.

---

## 5. Verification & Evidence
- **Regression Suite (`node test/run_all.js`)**: **24/24 test groups PASS**, including the new `test/demon_heartsoul_paths.js` suite.
- **360-Day Full Assertion Simulation (`test/results/long_v1108_seed1.json`)**: Completed 360 game days (`518,400` ticks) with `status: PASS`, `population: 62`, `sectStones: 7231`, `cp.price: 1.24`, `knownRecipes: 14/14`, and `manuals: 9/9`.
- **Human Core Byte Lock**: `js/human_core.js` remains untouched (`155:2f9c9dd7`, SHA-256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`).
