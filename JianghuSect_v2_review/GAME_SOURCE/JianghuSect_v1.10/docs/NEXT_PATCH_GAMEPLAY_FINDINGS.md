# Next Patch Gameplay Findings — After Elemental Overhaul v2.0

สถานะ: บันทึกเพื่อออกแบบแพตช์แยก ยังไม่แก้ใน hotfix 1.12.5 เพราะมีผลต่อสมดุลหรือความหมายของระบบหลายส่วน

## 1. Multi-root defensive elemental profile
ปัจจุบัน `ELEM.combatElementalMatchup()` ใช้ธาตุจาก mantra/subpath ที่ active หรือ `root.primaryElement` เป็นธาตุป้องกันหนึ่งค่า แม้ตัวละครมีราก 2–4 ธาตุ จึงยังไม่ได้คำนวณความต้านทานจากรากรองของผู้ป้องกัน

แนวทางที่ควรศึกษา:
- สร้าง defensive profile จาก active mantra/subpath ก่อน หากมี profile ที่ชัดเจน
- หากไม่มี active profile ให้พิจารณารากทั้งหมดโดยถ่วงน้ำหนักตามเกรดรายราก
- รวมผลด้วย matrix และน้ำหนักที่ normalize แล้ว
- ทดสอบว่าตัวละครหลายรากไม่กลายเป็นต้านทุกธาตุเกินไป

## 2. Weighted weapon-to-technique resonance
`ELEM.resolveCombatInteraction()` ยังใช้ `wpn.element` และ `attackerCompat.primaryElement` ใน weapon resonance เป็นหลัก หากอาวุธหรือวิชามีหลายธาตุ จะไม่ใช้ weighted profile ทั้งคู่

ควรออกแบบ pairwise weighted resonance ระหว่าง weapon profile กับ technique profile และแยกจาก weapon-type requirement (`SWORD`, `SPEAR`, ฯลฯ) เดิม

## 3. Applicant talent tier vs per-root grade
`SECT.rollApplicantTier()` สุ่ม `rootGrade` ตาม talent tier และ `SIM.addNpc()` ส่งค่านั้นให้ `HC.generate()`. Original `human_core.js` ใช้ grade นี้คำนวณ innate meridian/aptitude ก่อนที่ wrapper ของระบบธาตุจะสร้าง per-root grades ใหม่ แต่ wrapper ตั้งใจไม่ใช้ `rootGrade` เป็น explicit per-root grade สำหรับ `_fromTierRoll`/`fromApplicant` เพื่อไม่ให้ applicant bypass natural rarity

ผลคือ applicant tier มีผลต่อ innate attributes แต่ไม่ได้รับประกันว่าเกรดรากรายธาตุจะตรงกับ tier ที่แสดง ควรตัดสินใจว่า:
- applicant tier เป็นเพียง latent potential/คุณภาพผู้สมัคร หรือ
- ควร map ไปยัง per-root grade แบบมี selection bias ที่แยกจาก natural birth rarity

อย่าแก้แบบตรงไปตรงมาโดยไม่จำลองผลต่ออัตราอัจฉริยะในโลก

## 4. World-year birth-rate telemetry
อัตรา 10,000 ปีใช้สมมติฐาน 40 generated NPC births ต่อปี แต่ระบบมีการสร้าง NPC จากหลาย flow เช่น world events, visitors, recruitment และ expeditions. ควรนับจำนวน `HC.generate` ต่อ world year ใน long simulation หลาย seed แล้วปรับคำอธิบาย expected years ให้สะท้อนอัตราจริง

## 5. Root-capacity Trait metadata
`rootCapacityTraits` ใน data registry มี `modifiers` แต่ `HC.traitMods` wrapper ตั้งใจคืน `[]` สำหรับ Trait เหล่านี้ เพื่อไม่ให้การมีหลายรากเพิ่มค่าสเตตัสฟรี นโยบายนี้สมเหตุสมผลกับหลัก “หลายรากให้ความยืดหยุ่น ไม่ใช่เก่งกว่าทุกด้าน” แต่ข้อมูล modifier ที่ไม่ถูกใช้ทำให้เข้าใจผิด ควรลบ metadata ที่ไม่ใช้งานหรือระบุเจตนาให้ชัดใน data schema

## 6. Aggregate grade breadth bonus
`ELEM.computeAggregateGrade()` มี breadth bonus ตามจำนวนราก (+0.12/+0.20/+0.28) แม้ per-element gameplay ใช้เกรดรายรากแล้ว ควร audit ทุก call site ที่ยังใช้ scalar `h.root.grade` ว่าค่า breadth bonus ส่งผลกับ legacy cultivationTalent หรือระบบอื่นมากน้อยเพียงใด ก่อนตัดสินใจคงไว้หรือลด

## 7. Multi-year balance certification
ก่อนปรับ multiplier ของเกรดราก, affinity, mastery, technique, path, equipment และ unique effects ควรจำลองอย่างน้อย 10–20 seeds ระยะยาว แยก forced build tests กับ natural NPC simulation และรายงาน power distribution, breakthrough rate, NPC path distribution และอัตราเลือกวิชา/อาวุธ
