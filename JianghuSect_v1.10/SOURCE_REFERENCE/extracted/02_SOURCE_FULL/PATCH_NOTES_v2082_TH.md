# Patch Notes — Jianghu 2.08.2
วันที่: 27 ตุลาคม 2026

## 1. EP.5 runtime crash

รายงานจากเซฟจริงหยุดใน EP.5 (`EP5_SUPREME_MARTIAL`, `WAITING_CONDITIONS`) ด้วย `Cannot read properties of undefined (reading 'hunger')` ใน `renderHero()`. NPC 24 จาก 39 ตัวในรายงานไม่มี `stageLocal.needs`.

แก้ไขโดย:
- เพิ่ม `ensureStageNeeds()` ใน `stage.js` ให้เติมเฉพาะข้อมูลที่ขาด/ไม่ใช่ตัวเลข และรักษาค่าที่มีอยู่
- เรียก migration เมื่อโหลดเซฟ และเมื่อสร้าง NPC แบบสมาชิก ผู้ให้บริการ และโจร
- เพิ่ม optional chaining/fallback ในแถบสถานะของ `renderHero()`
- คง save schema/envelope รุ่น 11 และไม่รีเซ็ต tick, EP หรือความคืบหน้าที่บันทึกไว้

## 2. ความเร็วจำลอง

- ปุ่มวนลำดับ ×1 → ×2 → ×4 → ×8 → ×16 → ×1
- จำกัดความเร็วไว้ในค่าที่รองรับเมื่อโหลดเซฟที่มีค่า speed ไม่ถูกต้อง
- เพิ่ม max catch-up เป็น 48 simulation steps ต่อเฟรม (เพียงพอสำหรับ frame delta ที่ถูกจำกัดไว้ 0.25 วินาทีที่ ×16)
- ใช้ epsilon เล็กน้อยใน accumulator เพื่อไม่ให้ floating-point rounding ทำให้พลาดหนึ่ง step

## 3. ข้อจำกัด

ชุดทดสอบรันในสภาพแวดล้อม Node.js/DOM mock; ยังไม่ใช่การวัด FPS หรือความร้อนบน Android จริง การเร่ง ×16 มีให้เลือก แต่ความลื่นขึ้นกับจำนวน NPC, เหตุการณ์, เบราว์เซอร์ และการจัดการพลังงานของเครื่อง
