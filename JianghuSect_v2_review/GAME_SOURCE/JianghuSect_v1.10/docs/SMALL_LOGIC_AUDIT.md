# Small Logic Audit — main-1 / v1.12.4

## ขอบเขต

ตรวจซอร์ส main-1 ที่แนบมา (`JianghuSect_v1.10/`) โดยรักษา `js/human_core.js` แบบ byte-for-byte และไม่รวมโค้ดจากสายพัฒนาอื่น การแก้รอบนี้จำกัดเฉพาะข้อผิดพลาดเชิงตรรกะที่พิสูจน์ซ้ำได้และมีผลแก้แบบแคบ ไม่เปลี่ยนสมดุลเกมหรือเป้าหมายการออกแบบ

## แก้แล้วใน v1.12.4

| ID | จุดที่พบ | หลักฐาน/ผลกระทบ | การแก้ | การป้องกันการถดถอย |
|---|---|---|---|---|
| WLD-01 | `WILD.spawn` เมื่อส่ง `opts.speciesId` ข้ามการตรวจระดับ, pool และ ordinary/legendary | ทดสอบเดิมสามารถสร้าง `ECO2_BEAST_MYTHIC_1` (T7) ใน `meadow_ecology_t1` (T1) ได้ | ตรวจ species แบบระบุด้วย predicate เดียวกับ random spawn; ตรวจ habitat, pool membership, tier, drop และ rarity | `test/wildlife_spawn_integrity.js` |
| WLD-02 | `poolId` ที่ไม่มีจริงทำให้ระบบสุ่มเลือก pool อื่น | ผู้เรียกขอ pool ที่ระบุ แต่ระบบกลับใช้ pool คนละอันอย่างเงียบ ๆ | explicit `poolId` ที่หาไม่พบคืน `null` | `test/wildlife_spawn_integrity.js` |
| WLD-03 | named pool ว่างแล้ว fallback ไปสุ่ม species อื่นใน zone | pool ที่ระบุอาจสร้างสัตว์ผิดธีม/ผิด pool ทำให้ข้อมูลแหล่งเกิดหลอกผู้เล่น | เอา zone-wide fallback ที่ข้าม pool ออก; pool ว่างคืน `null` และรอ refill รอบถัดไป | `test/wildlife_spawn_integrity.js` |
| WLD-04 | `west_hound_pool` มี T4 species แต่กำหนด `max: 3` | `BEAST_BLOOD_FIEND_HOUND_4` ไม่มีโอกาสถูกเลือกแม้อยู่ใน `speciesIds` | ปรับ `max: 4` ให้ตรงกับ catalog และขอบเขตโซน | catalog invariant ใน `test/wildlife_spawn_integrity.js` |
| QA-01 | `test/run_all.js` เรียก `inventory_grid_ui_suite` แต่ ZIP ไม่มีไฟล์ทดสอบนั้น | full regression มี FAIL ที่เกิดจากไฟล์ทดสอบหาย ไม่ใช่ game runtime | สร้าง suite กลับมาและตรวจจริงทั้ง Node/Chromium | `test/inventory_grid_ui_suite.js` |

### สิ่งที่ยืนยันจากการทดสอบ

- Pool species 114 รายการใน 28 pools / 6 zones ถูกตรวจครบ: ไม่พบ ID หาย, aquatic species ใน land pool หรือ tier อยู่นอกช่วงหลังแก้
- การเรียก spawn แบบเจาะจงที่ถูกต้องยังทำงานได้; การเรียกที่ผิด pool/tier/rarity หรือ pool ID ผิดจะไม่สร้างสัตว์
- Empty named pool ไม่สร้างสัตว์ทดแทนจาก species ที่ไม่อยู่ใน pool
- Inventory Grid ตรวจ 72-cell atlas, unique keys, data-builder parity, no UI state mutation, grid/list rendering, preference persistence และ Chromium 360×800, 800×360, 1280×800; ไม่พบ horizontal overflow หรือ browser errors
- Fishing regression เดิมยังผ่าน; ไม่แก้ fishing gameplay ใน hotfix นี้

## บันทึกไว้สำหรับแพตช์ถัดไป — ยังไม่แก้

รายการเหล่านี้เป็นการปรับระบบ/สมดุลที่มีผลกว้าง ไม่ใช่ accidental bug ที่ควรแก้แบบ hotfix จึงเก็บไว้ตาม `docs/NEXT_PATCH_GAMEPLAY_FINDINGS.md`:

1. **Personal production retention** — ให้ NPC ประเมินความต้องการใช้ส่วนตัว ต้นทุนทดแทน และแผนสูตร ก่อนตัดสินใจเก็บวัตถุดิบหรือบริจาค โดยไม่บังคับโควตา
2. **CP purchasing power** — เพิ่ม telemetry หลาย seed สำหรับ price index, median holdings, affordability, welfare, reserves, trade และ craft margins ก่อนปรับการเสก/เผาแต้ม
3. **Gathering crowd-out** — วัด activity budgets, cultivation stages, blocked actions และ travel approvals ก่อนปรับคะแนนงานเก็บของ
4. **World/rank differentiation** — เพิ่ม biome subpools และตรวจสูตรความยากของ hazard/gather/lore/trial ให้สอดคล้องกับ rank โดยไม่ปรับตามพลังตัวละคร
5. **Fortune proficiency discontinuity** — แก้สูตรให้ monotonic เป็นงานปรับสูตร/สมดุล แยกจาก hotfix
6. **Expedition site choice** — เปลี่ยนจาก first-match เป็น region/biome tags และ weighted selection พร้อม commit site/pool เมื่อเริ่มเดินทาง
7. **Natural resource acquisition tags** — ใช้ tags เช่น natural / processed / huntOnly / salvage แทนการอนุมานจากหมวดไอเทม
8. **Gradual gathering proficiency** — ปรับ duration/yield แบบค่อยเป็นค่อยไป แทน threshold เดียวที่ skill 45
9. **Spatial supply long-run model** — พิจารณา per-zone budgets, seasonal renewal และ ore deposits จากข้อมูลหลายปี
10. **Wildlife pack encounters** — เพิ่ม pack behavior เป็น feature แยก โดยต้องมี grouping, shared engagement, readability และคง cap/legendary roll

## ข้อจำกัดการตรวจรอบนี้

- Chromium เป็น headless viewport/touch emulation ไม่ใช่การทดสอบบนโทรศัพท์ Android จริง
- ไม่ได้ทำ multi-year multi-seed balance certification รอบนี้; ไม่ปรับเศรษฐกิจหรือ CP payouts
- การแก้ empty pool เปลี่ยนจากการแทนสัตว์แบบเงียบ ๆ เป็นไม่เกิดสัตว์ในรอบนั้น ซึ่งตั้งใจให้รักษาถิ่นอาศัยและให้ refill รอบถัดไปลองใหม่

## ผล Regression สุดท้ายของ v1.12.4

- `node test/run_all.js`: **65/65 groups PASS** (64 test suites + syntax group)
- Syntax: **133 JavaScript files PASS**
- `node test/standalone.js`: **PASS**, 40 inline scripts, ไม่มีไฟล์ runtime ภายนอก และตรวจ native simulation + save/load
- `python tools/package_release.py`: **PASS**, ZIP 343 entries, CRC/content verification ผ่าน, preserved source originals 52 files
- `js/human_core.js` SHA-256 ก่อน/หลัง: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542` (ไม่เปลี่ยน)

ข้อจำกัด: browser tests เป็น Chromium headless emulation ไม่ใช่การทดสอบบนอุปกรณ์ Android จริง; ไม่มีการรับรองเศรษฐกิจหลายปี/หลาย seed ใน hotfix นี้
