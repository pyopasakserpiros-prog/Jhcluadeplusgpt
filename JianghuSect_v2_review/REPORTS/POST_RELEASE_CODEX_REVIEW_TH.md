# รายงานตรวจเกมและแก้ไขหลัง Gemini ส่ง v2.0

วันที่ตรวจ: 31 ตุลาคม 2026  
ซอร์ซ: `JianghuSect_v2.0_Complete_Package.zip` ที่ผู้ใช้ส่งมา  
Patch หลังตรวจ: `SIM.PATCH_VERSION = 1.12.5`

## สรุป
ตรวจซอร์ซและรันชุดทดสอบจริง พบปัญหาที่แก้ได้โดยไม่ต้องรื้อระบบ 7 จุดหลัก รวมทั้งปัญหาแพ็กเกจ standalone ไม่ตรงกับซอร์ซ จากนั้นเพิ่ม regression checks และทดสอบซ้ำ

## จุดที่แก้แล้ว

| ID | ปัญหา | ผลกระทบ | วิธีแก้ |
|---|---|---|---|
| RAR-01 | โอกาสเกิดราก 4 ธาตุเป็น 0.05% หรือราว 1 คนใน 50 ปี | ขัดกับข้อสรุปว่า 4 รากทุกเกรดอยู่ระดับ 10,000 ปี | ลดเป็น 0.00025% หรือ 1 ใน 400,000 การเกิด เมื่อสมมติ 40 คน/ปี |
| RAR-02 | จัดหมวดรากคู่ Heavenly + Spirit ไม่เหมือน Heavenly + True และรากสามบางชุดถูกจัดเป็น 20 ปี | ระดับอัจฉริยะไม่ตรงกับองค์ประกอบเกรด | ปรับ classifier ให้ True/Spirit ใช้หมวดเดียวกันตามกฎที่ยืนยัน |
| RAR-03 | ราก 4 ธาตุทั่วไปแสดง 50 ปี ขณะที่บางชุดแสดง 625/2,500 ปี และรากสวรรค์ 4 ธาตุแสดงเพียง 10,000 ปี | กลุ่มย่อยกลับหายากน้อยกว่ากลุ่มใหญ่ และ all-Heavenly ไม่ได้หายากกว่า | ราก 4 ทุกชุดเป็น 10,000 ปี; 4 Heavenly เป็น subtype ที่คาดหมาย 2,000,000 ปี โดยไม่มี hard unique cap |
| TRAIT-01 | `ensureNpc` ไม่ลบ Trait ความจุรากที่ซ้ำกัน หากเป็น ID เดียวกับ Trait ที่ต้องการ | Trait ซ้ำค้างและทำให้ cache readiness ไม่ผ่าน | normalize ให้เหลือ Trait ที่ถูกต้องเพียงหนึ่งรายการ |
| UI-01 | `explainCompatibility` แสดง combat multiplier เสมอ แม้กำลังอธิบาย cultivation/study/equipment | ตัวเลขคำอธิบายไม่ตรงบริบท | ใช้ multiplier ที่ resolver เลือกตาม context |
| CMB-01 | การคำนวณ counter ของวิชาหลายธาตุใช้เฉพาะ primary element | ธาตุรองและน้ำหนักที่ประกาศไว้ไม่ส่งผลต่อ counter | รวม counter ตามน้ำหนักทุกธาตุของ attack profile |
| COPY-01 | ชื่อเกรด SPIRIT แสดงคำซ้ำ “รากวิญญาณวิญญาณ” | ข้อความ UI ไม่สมเหตุสมผล | เปลี่ยนเป็น “รากวิญญาณชั้นจิต” |
| PKG-01 | `JianghuSect_single.html` ที่ root ของ ZIP ต่างจาก standalone ใน GAME_SOURCE | ผู้เล่นที่เปิดไฟล์ root อาจไม่ได้โค้ดล่าสุดบางส่วน | rebuild จาก source และคัดลอกให้ทั้งสองไฟล์เหมือนกันแบบ byte-for-byte |

## การตรวจเนื้อหาและ Edit Hub
- ตรวจ runtime records ที่เกี่ยวข้อง 1,229 รายการจากวิชา มนตรา วัตถุดิบ ไอเทม ตำรับ อุปกรณ์ยุทธ์ และอาวุธตำนาน: ไม่พบ elemental profile ที่ invalid ในชุดนี้
- Edit Hub catalog มี 1,115 รายการ
- ค้น `Legendary` ได้ 33 รายการ: อาวุธตำนาน 11 ชิ้น และวิชา/มนตราตำนาน 22 รายการ
- Affinity ยังคงใช้ `h.affinities` object เดิม 23 ค่า

## ผลทดสอบหลังแก้
- Elemental suite: **72/72 assertions PASS**
- Core lock: PASS; fingerprint `155:2f9c9dd7` ไม่เปลี่ยน
- Standalone: PASS; 40 inline scripts, no external runtime dependencies
- Browser/mobile performance: PASS; 360/412/1280 px, 24 tabs, 0x–48x, 80 NPC; 0.718 ms/tick และ measured sustainable cap 348x ใน harness
- Edit Hub Phase 2: PASS
- Save integrity: PASS
- v2 synthetic save/load continuity: PASS
- Visitors/clues/weapons: 41/41 PASS
- Codex combined review: PASS
- Inventory Grid UI: PASS
- Fishing/River: PASS; Monte Carlo 100,000 trials และ Chromium UI
- Syntax: 134 JavaScript files PASS
- Full runner มี 65 suites: 60 แรก PASS ในการรันรวม ก่อนถึงขีดจำกัดเวลาของ execution; 5 ชุดท้ายรันแยกและ PASS ทั้งหมด จึงมีผล PASS ครบทุก suite แต่ไม่ได้ผลสรุป 65/65 จาก process เดียว

## ข้อแก้ไขความถูกต้องของรายงานเดิม
1. `test/elemental_overhaul_suite.js` มีอยู่จริงใน ZIP; ข้อความระหว่างตรวจรอบแรกที่ระบุว่าไฟล์นี้ไม่มี เป็นความผิดพลาดของการตรวจเบื้องต้น ขอถอนข้อความนั้น
2. รายงาน Gemini ระบุ 1,691 assertions แต่ output จริงของ build เดิมแสดง 57/57; หลังเพิ่ม regression tests โดย Codex ปัจจุบันแสดง 72/72

## จุดที่ไม่ใช่บัคชัดเจน แต่ควรทำแพตช์แยก
ดู `docs/NEXT_PATCH_GAMEPLAY_FINDINGS.md` โดยเฉพาะการคำนวณป้องกันหลายราก, weapon resonance แบบหลายธาตุ, applicant tier กับเกรดรากรายธาตุ และการวัดจำนวน NPC ที่เกิดจริงต่อปี

## ไฟล์ที่ล็อก
`js/human_core.js` ไม่ได้แก้ไข SHA-256 ยังคงเป็น:
`a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`
