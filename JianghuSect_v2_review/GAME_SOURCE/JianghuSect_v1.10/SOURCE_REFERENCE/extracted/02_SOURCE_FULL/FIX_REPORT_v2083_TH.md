# รายงานแก้บั๊ก Jianghu v2.08.3

## สาเหตุ
เซฟ v2.08.2 ที่ลูกพี่ส่งกลับมาระบุ `Cannot read properties of undefined (reading 'push')` ที่ `LivingAcademy.finish()` ในขั้นตอน `shareFormula` บรรทัดที่บันทึกใบอนุญาตของสูตร

สูตร `MW_EXP_002` ในเซฟมี `knownBy` แต่ไม่มี `licenses`. โค้ดเดิมทำงานตามลำดับนี้:
1. เพิ่มสูตรลง `recipient.stageLocal.growth.knownRecipes`
2. เพิ่มผู้รับใน `formula.knownBy` (ถ้ายังไม่มี)
3. เรียก `formula.licenses.push(...)` ซึ่งพังเพราะ `licenses` ไม่มี

ดังนั้นเซฟหลัง crash ไม่ได้อยู่ในสถานะก่อนเริ่มงานอีกต่อไป แต่มีการเพิ่มสูตรให้ผู้รับแล้วบางส่วน การเติม array อย่างเดียวจะทำให้ ticket ที่ค้างถูกประเมินว่าแชร์ซ้ำและอาจไม่สร้างสิทธิ์ให้ผู้รับ

## การแก้
- ซ่อม schema ของ formula record ตอนสร้าง `LivingAcademy` จากเซฟ: เติม `knownBy`, `licenses`, `history` และ `revision` เมื่อขาด
- เปลี่ยนการจบงานแชร์สูตรให้ทำซ้ำได้อย่างปลอดภัย: ตรวจ ticket ที่ยินยอมและ reservation/session, ไม่เพิ่มสูตรซ้ำ, ไม่เพิ่มใบอนุญาต `USE_ONLY` ซ้ำ และกู้คืนกรณีสูตรอยู่ใน `knownRecipes` แล้วแต่ยังไม่มี license
- คง save envelope v11 และระบบความเร็ว ×1–×16

## หลักฐานทดสอบ
- รายงานจริง `Jianghu_Runtime_Report_v2_08_2.json`: regression test ผ่าน
- เดินต่อ 1,000 เฟรมจาก save ที่จุดเกิดปัญหา: ไม่มี runtime exception; เวลาจำลอง 7692.4 → 7792.4; world tick 384 → 389; license `USE_ONLY` ของ `NPC_3911` ถูกบันทึก
- speed/needs regression tests: ผ่าน
- standalone build verifier: ผ่าน 32 โมดูลและ hash consistency
- `npm test`: ยังไม่เสร็จภายในขีดจำกัด 300 วินาที จึงบันทึกเป็น INCOMPLETE ไม่ใช่ PASS
