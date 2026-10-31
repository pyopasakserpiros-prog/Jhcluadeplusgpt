# อ่านก่อนทำงาน — Jianghu 2.08.2

แพตช์นี้ต่อจาก v2.08.1 ไม่ได้สร้างเกมใหม่ จุดประสงค์คือแก้ runtime crash ตอน EP.5 และเพิ่ม speed ×8/×16

## ไฟล์สำคัญ
- `source/scripts/stage.js`: migration ข้อมูล NPC และ simulation speed loop
- `source/scripts/ui.js`: UI guard และปุ่มความเร็ว
- `tests/ep5_speed_v2082.cjs`: regression ของบั๊กนี้
- `PATCH_NOTES_v2082_TH.md`, `QA_REPORT_TH.md`, `V2082_HANDOFF_TH.md`: ผลแก้และข้อจำกัด

## กติกา
- คง Human Foundation (`human.js`) และ `legacy.bundle.js` ไว้เหมือนเดิม
- คงเซฟ schema รุ่น 11; เติมเฉพาะข้อมูล `stageLocal.needs` ที่ขาด ไม่รีเซ็ตเซฟ
- อย่ารื้อระบบตบะเทียบเคียง/เควสต์ EP.5 ซึ่งมีระบบเทียบระดับอยู่แล้ว
- ไม่อ้างว่า ×16 ลื่นบน Android จนกว่าจะทดสอบเครื่องจริง
