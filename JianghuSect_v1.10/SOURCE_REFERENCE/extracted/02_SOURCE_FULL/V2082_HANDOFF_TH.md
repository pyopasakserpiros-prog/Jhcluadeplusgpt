# Handoff — Jianghu 2.08.2

## เป้าหมายแพตช์
1. แก้ runtime crash ใน EP.5 จาก `stageLocal.needs` ที่หายไป
2. เพิ่ม speed control ×8 และ ×16 โดยไม่เปลี่ยน simulation rules หรือ save schema

## จุดแก้ในโค้ด
- `source/scripts/stage.js`: `ensureStageNeeds()`, load migration, NPC creation paths, `frame()` accumulator/catch-up
- `source/scripts/ui.js`: guard ใน `renderHero()`, speed cycle และ accessibility label
- `tests/ep5_speed_v2082.cjs`: migration + speed regression
- `tests/ui_v117.cjs`: UI runtime guard + speed cycle

## ข้อห้าม
- ห้ามแก้ `source/scripts/human.js` และ `source/scripts/legacy.bundle.js`
- ห้ามเปลี่ยน save envelope/schema หรือเริ่มโลกใหม่อัตโนมัติ
- ห้ามอ้างว่าทดสอบ FPS บน Android แล้ว ถ้ายังไม่ได้ทดสอบบนเครื่องจริง

## วิธีตรวจ
- `JIANGHU_RUNTIME_REPORT=/path/to/Jianghu_Runtime_Report_v2_08.json node tests/ep5_speed_v2082.cjs` เพื่อทดสอบกับรายงานเซฟจริง
- `node tests/ui_v117.cjs` สำหรับ UI mock
- `npm test` สำหรับ regression suite เต็ม
- `python3 tools/build.py` แล้ว `node tests/verify_build_v205.cjs` สำหรับตรวจ parity
