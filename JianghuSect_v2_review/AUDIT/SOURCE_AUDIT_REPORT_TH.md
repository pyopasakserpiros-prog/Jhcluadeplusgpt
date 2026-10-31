# รายงานตรวจซอร์ซเกมจริง — Elemental Roots / NPC / Equipment / Edit Hub

**Baseline ที่ตรวจ:** `JianghuSect main-1 v1.12.4 Small Logic Hotfix`  
**Source:** `GAME_SOURCE/JianghuSect_v1.10/`  
**วันที่ตรวจ:** 31 ตุลาคม 2026  
**สถานะ:** ตรวจและจัดทำเอกสารแล้ว — ยังไม่ได้แก้ไขโค้ดเกม

## 1. ขอบเขตและหลักฐาน

ใช้ไฟล์ `JianghuSect_main-1_v1.12.4_Small_Logic_Hotfix.zip` ที่แนบอยู่ในบทสนทนา แตกไฟล์จริง และตรวจ source modules, data registries, UI, Edit Hub, AI decision pipelines, tests และเอกสาร handoff

| รายการ | จำนวน/สถานะ |
|---|---:|
| JavaScript modules ใน `js/` | 29 |
| Data registry files ใน `data/` | 11 |
| Test files ใน `test/` | 149 |
| ขนาด source tree ที่แตกแล้ว | ประมาณ 47 MB |
| `h.affinities` | 23 ค่า |
| Elemental affinity keys | 8 ค่า |
| Non-elemental affinity keys | 15 ค่า |
| Root grades เดิม | 5 ระดับ |
| Curated / extra / proc traits | 24 / 4 / 360 |
| Main techniques / mantras | 397 / 71 |
| Legendary techniques / mantras | 12 / 10 |
| Legendary weapons | 11 |
| Runtime Edit Hub catalog | 1,102 descriptors |
| Unique IDs ใน content audit manifest | 1,979 |
| Record occurrences ใน manifest | 3,661 (รวม registry ที่มี ID ซ้ำและ Edit Hub descriptors) |

Manifest ถูกสร้างจาก registry ที่โหลดใน runtime จริง ไม่ใช่การนับข้อความจากไฟล์อย่างเดียว: `AUDIT/CONTENT_AUDIT_MANIFEST.json`

## 2. ผลตรวจระบบรากธาตุปัจจุบัน

### 2.1 ระบบรากเดิมมีอะไรอยู่แล้ว

`js/human_core.js` สร้าง `h.root` ดังนี้:

- `h.root.grade` เป็น scalar เพียงค่าเดียว
- `h.root.elements` เป็น array ของชื่อธาตุภาษาไทย 5 ธาตุ: ไฟ น้ำ ไม้ ทอง ดิน
- จำนวนธาตุเดิมผูกกับ `rg.tier` ด้วย `[5, 4, 2, 1, 1]`
- สุ่มเกรดรากจาก `C.rootGrades` โดยใช้ weight เดิม 14 / 46 / 26 / 10 / 4

ผลคือระบบเก่าตีความเกรดเดียวเป็นทั้งคุณภาพและจำนวนธาตุ ซึ่งไม่ตรงกับกฎใหม่ที่ต้องมีรากเดี่ยว/คู่/สาม/สี่ตาม Trait และแต่ละรากมีเกรดแยกกัน

### 2.2 การใช้งานจริงใน gameplay

- พบการอ่าน `h.root.grade` แบบตรง ๆ ใน `human_core.js`, `cultivation.js`, `sect.js` และ UI
- `HC.derived()` ใช้ root grade เพื่อคำนวณ `cultivationTalent`
- `CULT.rate()` ใช้ `cultivationMult` และ `bodySynergy` ของ root scalar
- `CULT.breakthroughChance()` และ track breakthrough ใช้ `breakthroughBonus` ของ root scalar
- `SECT.hiddenPotential()` และ applicant/talent logic ใช้ root tier/grade
- UI แสดงเพียงค่า root grade เดียว
- ไม่พบ gameplay reader ของ `h.root.elements` ใน source ที่ตรวจ พบเฉพาะจุดสร้างข้อมูล ดังนั้นชนิดธาตุใน array เดิมยังไม่ถูกนำไปคำนวณความเข้ากันกับวิชา/อุปกรณ์อย่างแท้จริง

**ข้อสรุป:** เกมมีโครงสร้าง root แบบเก่าอยู่แล้ว แต่ยังไม่มีระบบ per-element root compatibility ที่เชื่อมกับการคำนวณจริง

### 2.3 จุดเสี่ยงพิเศษจาก `human_core.js`

`HC.generate()` ใช้ `rg.tier` ไม่เพียงแค่สร้าง `h.root` แต่ยังใช้สร้างค่าเริ่มต้นของ `spiritualFoundation`, `meridianCapacity`, `meridianIntegrity` และมีผลต่อ `aptitudes.cultivation` ด้วย

เนื่องจาก `HANDOFF.md` ปัจจุบันล็อก `js/human_core.js` ให้คง byte-for-byte การเพิ่ม root generator แบบ wrapper หลัง `HC.generate()` ต้องตรวจผลที่ root grade เดิมฝังไว้ใน innate/aptitude ด้วย ห้ามเปลี่ยน `h.root.grade` หลังสร้างตัวละครแล้วปล่อยให้ค่าสถานะกำเนิดยังสะท้อนเกรดเก่าที่ถูกสุ่มทิ้งไป

แนวทางที่ควรให้ Gemini พิจารณา:

- ใช้ extension/wrapper หลัง `HC.generate()` และใช้ RNG เดิมแบบ deterministic
- เก็บค่า legacy grade ก่อน override เพื่อคำนวณการปรับผลที่ฝังไว้
- คำนวณ aggregate root grade แบบอนุรักษนิยมสำหรับ `HC.derived()` ที่ยังอ่าน scalar
- ให้ระบบใหม่ทั้งหมดอ่าน per-root data ผ่าน resolver กลาง
- เรียก `HC.touch()` / `HC.bump()` และ invalidation ของ cache ที่เกี่ยวข้อง
- ตรวจทุก flow ที่สร้าง NPC รวมถึง applicant, visitor และการแปลง visitor เป็นสมาชิก

หากการล็อก core ทำให้ทำได้ไม่ถูกต้อง ให้ Gemini รายงาน blocker ก่อนแก้ไฟล์ ห้ามแอบแก้

## 3. Affinity เดิม — ต้องคง object เดิม

`h.affinities` มี 23 keys แบ่งได้ดังนี้:

**ธาตุ 8:**

`FIRE`, `WATER_ICE`, `LIGHTNING`, `WIND`, `EARTH_METAL`, `WOOD_LIFE`, `YIN_SHADOW`, `LIGHT_YANG`

**ความถนัดอื่น 15:**

`ALCHEMY`, `FORGING`, `ARRAY`, `TALISMAN`, `BEAST_TAMING`, `POISON`, `MEDICINE`, `SCRIPTURE`, `SWORD`, `BLADE`, `SPEAR`, `FIST_PALM`, `MOVEMENT`, `BODY_REFINING`, `SOUL_DIVINE`

UI ปัจจุบันเรียงแล้วแสดงเพียง 10 ค่าสูงสุด (`ui.js` ประมาณบรรทัด 2814) ไม่ได้แสดงครบ 23 ค่าและไม่แบ่งกลุ่ม 8+15

**ข้อกำหนด:** ห้ามสร้าง affinity object ใหม่ ให้แยกกลุ่มเฉพาะ UI และใช้ `h.affinities` เดิมทุกจุด

## 4. Element registry เดิม

`SK.ELEM` มี 11 entries:

- ธาตุพื้นฐาน 8: FIRE, WATER_ICE, LIGHTNING, EARTH_METAL, WOOD_LIFE, WIND, YIN_SHADOW, LIGHT_YANG
- ธาตุพิเศษ 2: ASTRAL, BLOOD_DEMON
- NEUTRAL 1

ดังนั้นไม่ควรสร้าง combat element registry ใหม่

Raw tags จาก registry ที่พบมีทั้ง element และ non-element values เช่น `ASTRAL`, `BLOOD_DEMON`, `FIVE_ELEMENTS`, `CHAOS`, `WATER`, `ICE`, `WOOD`, `METAL`, `YIN`, `YANG`, `LIGHT`, รวมถึง `SWORD`, `BLADE`, `ARRAY`, `POISON`, `MEDICINE` ฯลฯ ซึ่งต้องตรวจบริบทก่อน mapping

ตัวอย่าง mapping ที่ควรตรวจ แต่ห้ามทำแบบ blind rewrite:

- WATER / ICE → WATER_ICE
- WOOD → WOOD_LIFE
- METAL / EARTH → EARTH_METAL เมื่อความหมายตรงจริง
- YIN → YIN_SHADOW
- YANG / LIGHT → LIGHT_YANG
- BLOOD, CHAOS, FIVE_ELEMENTS ต้องตัดสินจาก lore/กลไกเป็นรายกรณี
- ASTRAL / BLOOD_DEMON เป็น special elements ไม่ใช่ ordinary birth roots
- SWORD / ARRAY / POISON ฯลฯ อาจเป็นชนิดอาวุธหรือ discipline ไม่ใช่ธาตุ

## 5. Elemental Mastery

ไม่พบระบบ `elementMastery` หรือระบบความชำนาญธาตุที่เทียบเท่าใน source ที่ค้นตรวจ

`n.cult.tm` เป็น technique-specific mastery ซึ่งใช้กับวิชาแต่ละรายการ ไม่ใช่ mastery ธาตุ และต้องคงแยกกัน

หากเพิ่ม elemental mastery ให้เพิ่มผ่าน extension ที่ชัดเจน และให้เพิ่มจากการฝึก/ใช้งานจริง ไม่ใช่ต่อ hit หรือ target

## 6. Existing Equipment / Technique Synergy — ระบบที่ต้อง reuse

### `M.evaluateSynergies()` / `M.skillSynergy()`

มีระบบจับคู่ subpath กับ `weaponTypes`, `armorTypes` และประเภทกระบวนท่า (`archs`) อยู่แล้ว มีการรวม `dmgMult`, `shieldMult`, `healMult`, `dotMult`, `qiCostMult`, `penAdd`, `critAdd`, `critDmgAdd`, `windDelta`, `masteryMult` ฯลฯ พร้อม clamp

### `M.gearSuitability()`

มีการคำนวณความเหมาะสมของอุปกรณ์จาก:

- path/subpath และ weapon/armor types
- weapon skill ที่ฝึกจริง
- วิชาที่เรียนและ `weaponTypes` / `armorTypes`
- `requiresWeapon`
- subpath synergy
- role-based stat weights
- personality, post/role, HP state
- item effect และ durability
- price/thrift

นี่คือฐานสำคัญที่ต้องเพิ่ม root/element factor เข้าไป ไม่ควรสร้าง gear scoring engine ใหม่

### `COG.techPreference()` / `COG.evaluateTech()` / `COG.bestGearUpgrade()`

มีระบบประเมินวิชาและอุปกรณ์ของ NPC อยู่แล้ว โดยใช้เงื่อนไขการใช้งาน บทบาทการต่อสู้ passive family, profile และคะแนนอุปกรณ์ แต่ยังไม่พบการใช้ per-root grade, elemental mastery หรือ root compatibility

### Combat action selection

`combat.js` มี `chooseSkill()` ที่ประเมิน cooldown, qi cost, technique mastery, skill efficiency, subpath synergy, tactical role และสภาพเป้าหมาย จากนั้น `useSkill()` ใช้ effect pipeline จริง

ระบบรากธาตุต้องเชื่อมตรงนี้อย่างระมัดระวัง ไม่เพิ่ม bonus ในทั้ง `chooseSkill()` และ `useSkill()` ซ้ำกัน และไม่เพิ่ม mastery ต่อ hit/target

## 7. NPC AI — จุดเชื่อมต่อจริง

| Decision | Current authority | สิ่งที่มีอยู่แล้ว | สิ่งที่ต้องเพิ่ม |
|---|---|---|---|
| Main path/subpath | `CULT.pathScores`, `CULT.choosePath` | body/qi/faith/demon/soul, affinities, personality, interests, sub preferences, skill fit | root compatibility, per-root grade, mastery, score explanation |
| Retraining | `retraining.js` | path score delta, intent, gear fit | root-aware path and gear evaluation |
| Technique learning | `COG.techPreference`, `COG.evaluateTech` | access, tier, weapon conditions, role, profile, passive family | root/element/affinity/mastery contribution |
| Long-term scripture goal | `cognition.js` | eligible library techniques, preference, affordability forecast | use same root-aware technique score |
| Mantra selection | `CULT.bestMantra` | path, tier, unlock, power sort | score suitability by roots/affinity/personality/goal; avoid highest-tier-only choice |
| Gear upgrade | `COG.bestGearUpgrade` → `M.gearSuitability` | bag, armory/shop, type, skill, path, technique links, durability, price | root/element link and exact explanation |
| Sect procurement | `cpeco.js` | gear fit and technique preference | root-aware fit without buying unusable gear |
| Skill practice | `M.pickSkillPractice`, `AI.ACTS.skillDrill` | interests, skill deficit, role, weapon | elemental practice goals and mastery growth |
| Teaching | `AI.pickTeachSkill`, `proficiency.js` | skill gap and affinities | elemental learning relation where relevant |
| Combat action | `combat.chooseSkill`, `M.skillEfficiency`, `M.skillSynergy` | tactical state, skill mastery, synergy | elemental compatibility and mastery once, no duplicate effect |
| Initial awakening | `CULT.awaken`, `SIM.awaken` | path selection, initial mantra/techniques | root-aware initial build choices |
| Recruitment | `SECT.rollApplicantTier`, `SECT.TALENT_TIERS` | applicant tier, scalar rootGrade, quality, traitCount | unified world rarity/root generator; applicant pipeline must not bypass rarity rules |

The current cognition architecture already has long-term goals, knowledge and score evaluation. Do not rebuild it. Add root/element awareness to its existing decision authorities.

## 8. Root-related legacy traits

`data/data_core.js` contains:

- `TR_IN_FIVE_SPIRIT_ROOT` — currently a curated innate trait with cultivation aptitude, meridian capacity, breakthrough and combat power modifiers; conflicts with crippled root.
- `TR_IN_CRIPPLED_ROOT` — currently a curse with cultivation penalty/cap, discipline/body refining affinity and endurance modifiers; conflicts with five-spirit root and another trait.
- 20 `TR_GEN_10_*` generated root-qi-themed traits from the proc-trait generator.

These are not currently the new root-count traits. In particular, the two curated traits do not directly set an exact root count. The 20 generated traits must be audited as innate trait modifiers; do not assume their name alone means they create a second/third/fourth root.

The new exact root-count trait/class must be distinguished from ordinary root-themed innate traits. Since `HC.addTrait()` samples `curatedTraits`, `extraTraits` and eligible proc traits, do not insert ultra-rare root-count traits into a generic random pool without explicit control.

## 9. Edit Hub — exact observed defect

Runtime call `SECT.EDITOR.catalog({}, {})` returns **1,102** descriptors.

- It includes all `JD.TECH.techniques` and `JD.TECH.mantras`, so the 22 legendary manuals/arts exist in the catalog.
- The first legendary manual/technique ID is at index 857 in the runtime catalog.
- `ui.js` renders `catItems.slice(0, 60)` only; therefore zero legendary manuals appear in the first page.
- Search matches name, ID and kind only; it does not search grade/rarity/effect. Searching `Legendary` returns 0; searching `LEG_` returns 22.
- `VC.LEGENDARY_WEAPONS` has 11 records, but `EDITOR.catalog()` adds no descriptors for them.
- The equipment spawner already has a `LEGENDARY_WEAPON_BY_ID` path, so the missing weapon catalog entries are a discoverability/catalog coverage defect, not a missing minting implementation.
- Character editor `EDITABLE_GROUPS` does not include root composition/per-root grades or elemental mastery.

Required repair: registry-driven complete catalog, metadata search, pagination/virtualization, all 11 legendary weapons, all 22 legendary arts/mantras, and validated root/mastery editing.

## 10. Data/content inventory

Runtime-loaded data counts are recorded in `AUDIT/CONTENT_AUDIT_MANIFEST.json`. Important counts include:

- 397 techniques, 71 mantras.
- 261 materials, 157 items, 278 recipes in the merged `JD.ITEMS` runtime registry.
- 42 martial items, 42 martial recipes, 10 martial techniques, 64 overhaul passives, 12 legendary techniques, 10 legendary mantras, 14 synergies, 12 innate techniques.
- 80 ecology species, 160 ecology materials, 80 ecology recipes, 32 ecology items.
- 110 beast species and 6 kings.
- 3,661 registry record occurrences / 1,979 unique IDs in the audit manifest (duplicates are intentionally retained with source provenance).

Gemini must re-derive these numbers from the active source, as registries can merge/extend each other at runtime.

## 11. Tests and verification

### Archived baseline verification record

`BASELINE_VERIFICATION_RECORDED.json` records:

- `node test/run_all.js`: 65/65 groups PASS.
- Syntax: 133 JavaScript files PASS.
- Standalone verification PASS.
- Browser inventory grid tests passed at 360×800, 800×360 and 1280×800.
- Physical Android testing was not performed.

### Focused rerun performed during this audit

These seven relevant suites were independently rerun in the current environment and all passed:

- `test/core_lock.js`
- `test/npc_cognition.js`
- `test/martial_paths.js`
- `test/technique_overhaul_suites.js`
- `test/phase2_edit_hub_inventory.js`
- `test/visitors_clues_weapons_suite.js` (41/41 clue/weapon checks)
- `test/standalone.js`

An independent attempt to rerun the entire `test/run_all.js` exceeded the available 300-second execution window after many suites had passed; therefore this audit does **not** claim a fresh independent full-suite rerun. Use the archived 65/65 verification record as baseline evidence and rerun the full suite in Gemini's longer-running environment after implementation.

## 12. Source integrity

- Baseline archive SHA-256: recorded in `BASELINE_SHA256SUMS.txt`.
- Protected `js/human_core.js` SHA-256: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`.
- The source's `HANDOFF.md` explicitly says `human_core.js` is locked and must remain byte-for-byte unchanged.
- Baseline standalone HTML SHA-256 is also recorded in `BASELINE_SHA256SUMS.txt`.

## 13. Recommended implementation direction

1. Keep `h.affinities` as-is; group only in UI.
2. Use eight canonical ordinary roots and two special combat elements.
3. Store per-root grade and exact root-count trait separately from the legacy scalar adapter.
4. Use a single resolver for root compatibility, element profiles and learning relations.
5. Keep root grade, affinity, elemental mastery and technique mastery distinct.
6. Integrate existing path, technique, gear, combat and cognition authorities.
7. Make Edit Hub fully registry-driven and remove silent 60-item truncation.
8. Allow a new save schema; do not build old-save compatibility layers.
9. Keep `human_core.js` locked unless an unavoidable blocker is demonstrated.
10. Audit and classify every relevant content ID; redesign names/effects when coherence requires it.
