# JianghuSect v2.0.1 — Elemental Overhaul Codex Hotfix

**สถานะ:** ตรวจซอร์ซ v2.0 แล้วและแก้บั๊กย่อยที่พิสูจน์ซ้ำได้  
**Patch:** `SIM.PATCH_VERSION 1.12.6` / `VC.PATCH_VERSION 1.13.1`  
**Save schema:** `2.0.0-elemental`  
**วันที่ตรวจ:** 31 ตุลาคม 2026

## เริ่มใช้งาน

- เปิด `JianghuSect_single.html` เพื่อเล่นแบบไฟล์เดี่ยว
- ใช้ `index.html` หากต้องการทำงานกับ source modules ในโฟลเดอร์ `js/` และ `data/`
- อ่าน `HANDOFF.md` เพื่อดูสถานะ implementation และข้อจำกัดล่าสุด
- อ่าน `docs/BUG_AUDIT_V2_POST_REVIEW_TH.md` เพื่อดูบั๊กที่พบ วิธีแก้ และหลักฐานทดสอบ
- อ่าน `docs/NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md` สำหรับประเด็นสมดุล/ตรรกะที่ควรพัฒนาเป็นแพตช์แยก

## บั๊กที่แก้ใน hotfix นี้

1. แก้ market trader lifecycle: wallet, stock และ wants ไม่หายเมื่อพ่อค้าออกจากสำนักและกลับมา; การกลับมาผ่าน `EXT.openVisit()` เพื่อรักษา market counters และ transaction state
2. แก้ `SIM.buildNpc()` และ `SIM.addNpc()` ส่งต่อ `forceElements` ไม่ครบ
3. ปรับ `ELEM.normalizeTag()` ให้รองรับ alias ภาษาอังกฤษที่เป็นตัวพิมพ์เล็ก/ใหญ่และมีช่องว่าง โดยยังปฏิเสธ tag ที่ไม่รู้จัก

## ผลทดสอบล่าสุด

- Parallel regression: **68/68 groups PASS** (`test/results/codex_review_2026-10-31.json`)
- JavaScript syntax: **137/137 files PASS**
- Elemental focused suite: **72/72 assertions PASS**
- Visitor / Living Clues / Legendary Weapons: **41/41 PASS**
- Native long simulation: 30 วันและ 90 วัน PASS
- Ecology และ resource-rank simulation: 30 วัน PASS
- Standalone: 40 inline scripts, no external runtime files, save/load PASS
- `js/human_core.js` ไม่ถูกแก้ไข; SHA-256: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`

รัน regression แบบเร็วด้วย:

```bash
node tools/run_parallel_tests.js
```

การจำลอง 180 วันใน process เดียวไม่จบภายในเวลาทดสอบที่มี จึงยังระบุเป็น **NOT VERIFIED** ไม่ใช่ PASS และยังไม่ได้รับรองการทำงานบนโทรศัพท์ Android จริง

## โครงสร้างระบบหลัก

- `js/cultivation.js`: Elemental authority (`ELEM`), roots, grades, mastery, compatibility, rarity
- `js/cognition.js` / `js/ai.js`: การประเมินความเหมาะสมและการตัดสินใจของ NPC
- `js/martial.js` / `js/combat.js`: weapon-type synergy, equipment suitability, combat interaction
- `js/visitors_clues.js` / `js/external_market.js`: visitors, clues, market traders
- `js/ui.js` / `js/sect.js`: character UI, Edit Hub, catalogs
- `data/`: content registries และ metadata
- `test/`: regression, integration, browser/headless และ simulation tests

## กฎการพัฒนาที่ต้องรักษา

- `js/human_core.js` เป็น protected core; ห้ามแก้โดยไม่มีคำสั่งใหม่จากผู้ใช้
- คง `h.affinities` object เดิม ไม่สร้าง affinity object ซ้ำ; แยกกลุ่มเฉพาะใน UI
- รากธาตุพื้นฐาน 8 ธาตุ; `ASTRAL` และ `BLOOD_DEMON` เป็น special elements
- Trait แบบ Option A กำหนดจำนวนรากจริง: 1/2/3/4 ราก
- รากแต่ละธาตุมีเกรดของตัวเอง; Technique Mastery และ Elemental Mastery ต้องแยกหน้าที่
- Equipment type requirements เช่น `sword`, unique equipment effects และ technique-specific mastery ต้องทำงานร่วมกับ root compatibility
- NPC ต้องใช้ข้อมูลที่ตนรู้และเข้าถึงได้จริงในการเลือก path, subpath, technique, weapon, equipment, training และ combat actions
- ไม่จำเป็นต้องรักษาความเข้ากันได้กับ old-version saves; ให้ความสำคัญกับความถูกต้องของ new-schema save/load และ data integrity

## เอกสารสำคัญ

- `HANDOFF.md` — สถานะระบบและคำสั่งส่งต่องาน
- `docs/BUG_AUDIT_V2_POST_REVIEW_TH.md` — ผลตรวจและบั๊กที่แก้แล้ว
- `docs/NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md` — ประเด็นที่ต้องออกแบบ/ทดสอบต่อ
- `docs/CHANGELOG.md` — ประวัติแพตช์
- `test/results/codex_review_2026-10-31.json` — ผลทดสอบ machine-readable
- `tools/run_parallel_tests.js` — parallel regression runner
