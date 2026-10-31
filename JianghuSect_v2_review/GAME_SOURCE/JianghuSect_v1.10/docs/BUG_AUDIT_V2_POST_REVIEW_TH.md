# รายงานตรวจบั๊กหลัง Elemental Overhaul v2.0

วันที่ตรวจ: 31 ตุลาคม 2026  
ขอบเขต: Source ที่ส่งมาใน `JianghuSect_Elemental_Overhaul_v2.0_Complete_Package.zip` และ source ที่แตกไว้ใน `GAME_SOURCE/JianghuSect_v1.10/`  
สถานะ: แก้บั๊กย่อยที่พิสูจน์ซ้ำได้แล้ว; ประเด็นด้านสมดุล/สถาปัตยกรรมที่มีผลกว้างแยกไว้ใน `NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md`

## 1. บั๊กที่พบและแก้แล้ว

### MKT-01 — พ่อค้ากลับสำนักแล้ว wallet / stock / wants หาย

**ระดับ:** High — ทำให้ invariant ของตลาดเสีย และทำให้การจำลองระยะยาวหยุดด้วย assertion failure

**อาการที่ทำซ้ำได้**
- พ่อค้าถูกสร้างโดย `EXT.openVisit()` พร้อม `stones`, `stock`, `wants` และ transaction state
- เมื่อออกจากสำนัก `VC.departVisitor()` เขียนทับ `world.guestRegistry[id]` ด้วยข้อมูลแขกทั่วไป ซึ่งไม่ได้เก็บ wallet และรายการตลาด
- `VC.spawnGuest()` สามารถเลือก record ที่ `kind === 'trader'` กลับมาเป็นผู้มาเยือนได้ แต่ record นั้นไม่มี market ledger
- การจำลองระยะยาวตรวจพบ `visitor wallet trader_2` ไม่เป็นตัวเลขที่ถูกต้อง

**การแก้ไข**
- เก็บ market trader snapshot ให้ครบเมื่อออกจากสำนัก รวม wallet, stock, wants, subtype และ trade counters
- ตรวจว่า trader record ที่จะกลับมามี market state ครบจริง
- ถ้าพบ trader record เก่าหรือไม่สมบูรณ์ ให้สร้าง market visit ใหม่ผ่าน `EXT.openVisit()` แทนการคืนค่าเป็น generic guest
- การสร้างผู้มาเยือนด้วย `role: 'merchant'` ต้องผ่าน `EXT.openVisit()` เพื่อสร้างข้อมูลตลาดครบชุดตั้งแต่ต้น

**Regression test:** `test/merchant_guest_lifecycle.js`
- ทดสอบออกจากสำนัก → เก็บทะเบียน → กลับมา → ตรวจ wallet/stock/wants
- ทดสอบ malformed trader record
- ทดสอบการสร้าง merchant โดยระบุ role โดยตรง

### ELM-API-01 — SIM generation API ไม่ส่งต่อ forceElements

**ระดับ:** Low — กระทบเครื่องมือสร้าง/ทดสอบ NPC แบบกำหนดเงื่อนไข

`SIM.buildNpc()` และ `SIM.addNpc()` ส่ง `forceRootCount` และ `forceGrades` ต่อ แต่ตกหล่น `forceElements` ทำให้ผลการสร้าง NPC ไม่ตรงกับชุดธาตุที่ผู้เรียกกำหนด

**การแก้ไข:** ส่ง `forceElements` ผ่านทั้งสอง API โดยไม่เปลี่ยนผลของการสุ่มปกติ

**Regression test:** `test/elemental_generation_api.js`

### ELM-INPUT-01 — Element tag ไม่ normalize ตัวพิมพ์เล็ก/ช่องว่าง

**ระดับ:** Low — ทำให้ alias ที่เป็นธาตุเดียวกันถูกจัดเป็น UNKNOWN เมื่อมีตัวพิมพ์เล็กหรือช่องว่าง

**การแก้ไข:** `ELEM.normalizeTag()` ตัดช่องว่างและ canonicalize English tag เป็น uppercase ก่อนตรวจ alias/composite; tag ที่ไม่รู้จักยังคงถูกปฏิเสธ ไม่แปลงเป็น NEUTRAL เงียบ ๆ

**Regression test:** `test/elemental_generation_api.js`

## 2. ผลตรวจและทดสอบหลังแก้

| การตรวจ | ผล |
|---|---:|
| Parallel regression suites | **68/68 PASS** |
| JavaScript syntax check | **137/137 PASS** |
| Elemental focused suite | **72/72 PASS** |
| Visitor / legendary weapon suite | **41/41 PASS** |
| Merchant lifecycle regression | PASS |
| Elemental generation API regression | PASS |
| Core lock | PASS |
| Inventory Grid/List + Chromium viewports | PASS |
| Fishing / river / container suite | PASS |
| Standalone HTML | PASS — 40 inline scripts, no external runtime dependency |
| Native long simulation 30 days | PASS |
| Native long simulation 90 days | PASS |
| Ecology simulation 30 days | PASS |
| Resource-rank simulation 30 days | PASS |

รายงานผล parallel regression: `test/results/codex_review_2026-10-31.json`  
รายงาน runner ที่ใช้ซ้ำได้: `tools/run_parallel_tests.js` (เขียนผลล่าสุดไป `test/results/parallel_audit_latest.json`)

### สิ่งที่ยังไม่รับรอง

- Native long simulation 180 วันใน process เดียวไม่จบภายใน execution budget ของสภาพแวดล้อมนี้ จึงระบุเป็น **NOT VERIFIED** ไม่ใช่ PASS และไม่ใช่หลักฐานว่าเกม crash
- Full `node test/run_all.js` เป็น sequential runner และใช้เวลารวมเกินขีดจำกัดของสภาพแวดล้อมนี้; ชุดเดียวกันเมื่อรันแบบ parallel 3 workers ผ่านครบ 68/68 ใน 21.03 วินาที
- ยังไม่ได้ทดสอบบน Android/Chromium จริง, Snapdragon 8 Elite หรืออุปกรณ์ผู้ใช้
- ยังไม่มีการรับรอง balance ระยะหลายปี/หลาย seed หลัง Elemental Overhaul

## 3. ความสมบูรณ์ของไฟล์สำคัญ

- `js/human_core.js` ไม่ถูกแก้ไข
- SHA-256 ยังคงเป็น `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`
- `HC.FINGERPRINT` ยังคงเป็น `155:2f9c9dd7`
- `SAVE_SCHEMA_VERSION` ไม่เปลี่ยนใน hotfix นี้
- `JianghuSect_single.html` สร้างใหม่จาก source หลังแก้ไขด้วย `node tools/build_single.js`

## 4. ทำไมการตรวจบางรอบจึงดูเหมือนหยุด

- `test/run_all.js` ทำงานทีละ suite ด้วย `spawnSync`; browser tests และ simulation tests สะสมเวลาได้มาก แม้ suite แต่ละตัวจะผ่านเมื่อแยกรัน
- parallel runner ใช้ 3 workers และ per-suite timeout แยก ทำให้จบเร็วและรายงาน suite ที่ล้มเหลวได้ชัดเจนกว่า
- การจำลอง 180/360 วันทำงานหนักขึ้นตาม NPC, pathfinding, AI evaluation และ world events; การหมดเวลาของเครื่องมือไม่ควรถูกสรุปว่าเป็น game exception โดยไม่มี assertion/stack trace
- V8 profile ของการจำลองยาวชี้ hotspot ที่ `MAP.findPath`, `AI.needs`, `AI.step` และ property access จำนวนมาก แต่ยังไม่พบหลักฐานจาก profile นี้ว่าเป็น infinite loop จุดเดียว

## 5. รายการส่งต่อ

ประเด็นที่ต้องตัดสินใจด้านสมดุล/พฤติกรรม/สถาปัตยกรรมถูกแยกไว้ใน `docs/NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md` ไม่แก้รวมใน hotfix นี้ เพื่อหลีกเลี่ยงการเปลี่ยน balance โดยไม่มีการทดสอบเฉพาะทาง
