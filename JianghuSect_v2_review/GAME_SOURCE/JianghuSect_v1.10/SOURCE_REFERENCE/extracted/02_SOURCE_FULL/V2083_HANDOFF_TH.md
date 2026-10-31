# Handoff v2.08.3

ฐาน: Jianghu v2.08.2 + targeted fix สำหรับ `LivingAcademy.finish()`

ไฟล์สำคัญ:
- `source/scripts/academy.js`: migration สูตรเก่าและการแชร์แบบ idempotent
- `source/scripts/stage.js`: release metadata ของเซฟ
- `source/scripts/ui.js`: release metadata ของ runtime report / export save
- `tests/academy_formula_schema_v2083.cjs`: regression test ที่ใช้รายงานจริงได้ผ่าน `JIANGHU_RUNTIME_REPORT`
- `tests/ep5_speed_v2082.cjs`: needs migration และความเร็ว ×1–×16

ห้ามถือว่าทดสอบครบจนกว่า `npm test` จะจบครบและ `tests/verify_build_v205.cjs` ผ่าน
