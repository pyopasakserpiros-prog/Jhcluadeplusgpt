# v1.10.3 patch — independent specialization tracks & functional power comparison

Date: 27 October 2026
Base: `JianghuSect_v1-10-2`

## Purpose

Complete the next P1 continuation milestone from `ROADMAP/ROADMAP.md`:
- **Independent specialization tracks** (`Full source tracks + major-power mapping in catalogue | Introduce explicit native track state, resource/skill gates and functional power comparison; preserve all source ranks selected for porting. Never map 9 ordinals into 5/4 by position. Old stage/HP/save behavior preserved and tested.`).

## Implemented

- **Authentic 9-realm source tracks preserved without position compression**:
  - Imported and preserved the full 9-realm sequence for all ported specializations (`FROST_MOON_IMMORTAL`, `WOOD_SPRING_BODY`, `MEDICINE_BODHI_GOD`) in `data/data_expansion.js`, `SOURCE_REFERENCE/migration/mapping.json`, and `js/cultivation.js`:
    - `FROST_MOON_IMMORTAL` (XIAN, 9 realms): ซึมซับแสงจันทร์ (1) ➔ เกล็ดน้ำค้างก่อตัว (2) ➔ รากฐานบัวหิมะ (3) ➔ ดวงจิตกระจกน้ำแข็ง (4) ➔ ครรภ์จันทราคราม (5) ➔ วิญญาณเหมันต์ไร้ใจ (6) ➔ เขตแดนเหมันต์เงียบงัน (7) ➔ วังน้ำแข็งเก้าสวรรค์ (8) ➔ เซียนจันทราเหมันต์อมตะ (9).
    - `WOOD_SPRING_BODY` (BODY, 9 realms): เพาะเมล็ดพันธุ์ชีวิต (1) ➔ เส้นเลือดเถาวัลย์หยก (2) ➔ รากฐานพฤกษาหยั่งราก (3) ➔ แก่นพฤกษามรกตพันปี (4) ➔ โลหิตน้ำอมฤตพฤกษา (5) ➔ วิญญาณต้นไม้โลก (6) ➔ เขตแดนร่มเงาหมื่นชีวิต (7) ➔ มหากายาต้นโพธิ์นิรันดร์ (8) ➔ ราชันย์พฤกษาอมตะสูงสุด (9).
    - `MEDICINE_BODHI_GOD` (GOD, 9 realms): จุดประทีปเมตตา (1) ➔ หัตถ์โอสถอุ่นปราณ (2) ➔ รากฐานบัวขาวโพธิญาณ (3) ➔ แก่นเทพโอสถทองคำ (4) ➔ แจกันหยกน้ำอมฤต (5) ➔ กายาโพธิสัตว์จำแลง (6) ➔ เขตแดนบุญไร้โรคภัย (7) ➔ ชุบชีวิตด้วยแสงทิพย์ (8) ➔ จอมเทพโอสถโพธิสัตว์สูงสุด (9).
  - Target major cultivation stages remain completely unchanged (`XIAN` 9, `BODY` 5, `GOD` 4) for 100% backward compatibility and core engine stability.
  - Never compressed 9 ordinals into 5 or 4 stages by position: each specialization track preserves all 9 ordinals (`1..9`), authentic Thai realm names, individual lifespans, capacity multipliers, and realm buffs.
- **Continuous major power mapping & functional combat comparison**:
  - Non-destructive `majorPowerMapping`:
    - `XIAN`: `[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0]`
    - `BODY`: `[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]`
    - `GOD`: `[1.0, 1.5, 2.0, 2.5, 3.0, 3.3, 3.7, 3.9, 4.0]`
  - Functional Combat Power (CP):
    - `WOOD_SPRING_BODY`: `[280, 520, 880, 1600, 2600, 5000, 8500, 18000, 31000]`
    - `FROST_MOON_IMMORTAL`: `[120, 250, 520, 1100, 2250, 4300, 8200, 15500, 30000]`
    - `MEDICINE_BODHI_GOD`: `[410, 950, 1750, 4000, 7600, 14000, 20000, 26000, 32500]`
  - Implemented `CULT.trackFunctionalPower(subPath, ord)` and `CULT.compareFunctionalPower(entityA, entityB)` evaluating comparative power ratio, major band delta, and Thai assessments (e.g. `สูสีทัดเทียม (พลังเทียบเคียงกัน)`, `ได้เปรียบเล็กน้อย`, `เหนือกว่าอย่างเห็นได้ชัด`).
- **Native track state, dual progression & gates**:
  - Added native track state on cultivator: `c.track = { subPath, ordinal: 1..9, realmId, realmNameTh, prog, attempts, history }`.
  - Added helpers: `CULT.trackDef(subPath)`, `CULT.initTrack(subPath, ord, day)`, `CULT.trackOf(n)`, `CULT.ensureTrack(n, day)`, `CULT.trackRealm(n, ord)`, `CULT.trackThreshold(n, ord)`, `CULT.trackReady(n)`.
  - Dual progression in `CULT.gain`: cultivating advances both major stage `c.prog` and specialization track `c.track.prog` concurrently.
  - Explicit skill & resource gates (`CULT.checkTrackGates`):
    - Primary & secondary skill thresholds (e.g. `WATER_ICE` + `ALCHEMY`, `BODY_REFINING` + `WOOD_LIFE`, `MEDICINE` + `SOUL_DIVINE`).
    - Progressive spirit stone costs with personal wallet priority and sect treasury subsidization support for disciples rank 2+.
  - Autonomous track breakthrough resolution (`CULT.trackBreakthrough`, `CULT.trackBreakthroughChance`, and `SIM.dailyUpdate`):
    - Success advances track ordinal (`1..9`), logs breakthrough history, updates realm title, deducts stones, and awards permanent stat/insight bumps.
    - Failure retreats progress to 50–70% of threshold and raises heart demon/stress while preserving ordinal.
- **Combat buffs & UI integration**:
  - Integrated track realm buffs (`combatOffensePct`, `combatDefensePct`, `armorPenetrationPct`, `evasionPct`, `senseBonus`) in `js/stats.js` (`compute` and `computeFast`).
  - Updated `UI.rContent` to render full 9-realm tracks with gate requirements, functional power comparison, and authentic realm lore.
  - Updated `UI.rNpc` Overview tab (`tab === 'ov'`) with track progress bar, current realm (1..9), major band equivalent, and gate readiness status.
  - Updated `UI.rNpc` Compare tab (`tab === 'cmp'`) with functional power comparison ratio, band delta, and assessment text.
- **Backwards compatibility & save integrity**:
  - Legacy save validation passes with zero modification to `human_core.js` (byte-lock `155:2f9c9dd7` verified).
  - Legacy saves without `track` retain clean deserialization without schema corruption.

## Validation

- `node test/specialization_tracks.js`: **8/8 checks PASS** (catalog integrity, track state, dual progression, skill/resource gates, breakthrough resolution, functional CP comparison, stat buffs, save roundtrip).
- `node test/run_all.js`: **19/19 groups PASS**.
- Full-assertion 360-day native-tick simulation (`test/results/long_v1103_seed1.json` — 518,400 ticks):
  - Passed all daily assertions for stock, CP economy, recipe scrolls, external market, and track validity.
  - Population stabilized at 54, sect stones at 1,154, CP price index at 0.805, 5 active characters awakened and advanced through native specialization tracks.
