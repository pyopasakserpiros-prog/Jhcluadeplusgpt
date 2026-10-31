# ผลตรวจหลังแพตช์ 1.12.7 — งานที่ปิดแล้วและประเด็นที่ต้องตัดสินใจต่อ

วันที่: 31 ตุลาคม 2026  
สถานะ: แพตช์ปัจจุบันผ่าน regression 70/70 กลุ่ม; เอกสารนี้เป็น handoff สำหรับการพัฒนาต่อ ไม่ใช่รายการบั๊กที่ยืนยันว่าทุกข้อผิดพลาด

## 1. ปิดแล้วในแพตช์ 1.12.7

### 1.1 ความถี่รากคู่/รากสามและความหายากเกรด
- ปรับโอกาสจำนวนรากเป็น 1 ราก 97.899974%, 2 ราก 2%, 3 ราก 0.1%, 4 รากประมาณ 1 ต่อ 3.9 ล้านตัวละครที่สร้าง
- ใช้ 390 generated-character appearances ต่อปีโลก โดยมีการตรวจ 14 รอบ ค่าเฉลี่ยรวม 386.43/ปี
- แยก conditional grade cohorts ตามจำนวนราก และคำนวณ rarity metadata จาก probability เดียวกับ generator
- รักษาช่วงเป้าหมาย 2H+T/S ในรากสามไว้ 500 ปี และ 3H ไว้ 1,000 ปี
- เพิ่ม regression tests สำหรับ natural distribution, conditional cohorts, metadata และ forced roots

### 1.2 การส่งต่อธาตุในการต่อสู้
- `ELEM.resolveCombatInteraction()` ถูกเรียกสำหรับผู้โจมตีทั้ง NPC และ foe
- ความเข้ากันของผู้โจมตี, counter matchup และ resonance อาวุธ/วิชาถูกแยกเป็นองค์ประกอบในผลลัพธ์เดียว
- weapon-to-technique resonance คำนวณแบบ weighted average ของทุกคู่ธาตุ ไม่ใช้เฉพาะ primary element
- elemental accuracy ถูกส่งถึง hit chance จริงของ `C.strike()` รวมถึง channel ticks
- control chance และ rider proc chance ใช้ elemental control multiplier จริง
- damage-over-time magnitude ใช้ elemental damage multiplier สำหรับ human และ foe
- AI counter preference ใช้ metadata `SK.ARCH[].off` แทนการเดาจาก `M` อย่างเดียว เพื่อไม่ให้ defensive/utility archetype ได้โบนัสโจมตีโดยไม่ตั้งใจ

### 1.3 ศัตรูและสัตว์อสูร
- สัตว์อสูรที่เกิดจาก raid เก็บ `speciesId`, `element` และ `elementProfile`
- เทคนิคที่สร้างให้ beast รับ element profile จาก species
- raid foes ผ่าน `COMBAT.enter()` เพื่อสร้าง skill loadout และ combat context อย่างเป็นทางการ
- เพิ่ม behavioral regressions สำหรับ bandit raid, beast raid, profile inheritance และ target counter

### 1.4 ความถูกต้องของ root capacity และ forced generation
- ลบ dormant aptitude/meridian modifiers ออกจาก root-capacity traits ทั้งสาม เพื่อให้ trait มีหน้าที่กำหนดจำนวนรากเท่านั้น
- แก้การจับคู่ `forceGrades` ให้ตรงกับ final root slots หลัง element list ถูกกรองหรือเติมให้ครบ

## 2. ประเด็นที่ยังต้องตัดสินใจ/พัฒนา

### 2.1 Neutral baseline ของความสัมพันธ์ธาตุ — ยังไม่ปิด
`EFFICACY_MATRIX` เดิมมีค่าต่างธาตุที่ต่ำกว่า 1.0 จำนวนมาก จึงทำให้รากที่ไม่ตรงและไม่ได้เป็นคู่ตรงข้ามโดยตรงถูกลดประสิทธิภาพด้วย

สิ่งที่ต้องทำ:
- สร้าง classification ที่ชัดเจน เช่น `MATCH`, `SUPPORT`, `OPPOSE`, `NEUTRAL`
- แยกความสัมพันธ์ด้าน combat/cultivation ออกจาก directed learning graph
- กำหนดคู่ neutral จาก lore และ data ที่ตรวจสอบได้ ไม่ใช้ threshold แบบเดาสุ่ม
- เพิ่ม tests ครบทุกคู่ธาตุ ordinary/special และตรวจว่า neutral baseline เท่ากับ 1.0 ตาม design intent

### 2.2 Aggregate scalar grade — ต้องทบทวนผลต่อ Human Core consumer
`ELEM.computeAggregateGrade()` ยังคงเป็น adapter สำหรับ consumer ที่อ่าน `h.root.grade` แบบ scalar โดยเฉพาะ protected core

สิ่งที่ต้องทำ:
- ตรวจทุก consumer ของ scalar grade
- แยก general cultivation aptitude ออกจาก per-element specialization ให้ชัด
- ทดสอบ mixed grades เช่น HEAVENLY+MORTAL, HEAVENLY+HEAVENLY+MORTAL และ 4-root low grades
- ห้ามให้ root count หรือ rarity กลายเป็น global power bonus โดยอัตโนมัติ

### 2.3 `ELEMENT_LINK_ONLY` และ context policy — ยังไม่ปิด
ต้องกำหนดว่า material, pill, recipe, weapon และ technique link ใช้ได้ใน context ใดบ้าง และยืนยันว่า element link ไม่กลายเป็น intrinsic damage source โดยไม่ได้ตั้งใจ

### 2.4 ผลธาตุต่อ heal / shield / support — ยังต้องออกแบบ
แพตช์นี้เชื่อม direct damage, accuracy, control chance, rider chance และ DOT magnitude แล้ว แต่ยังไม่ได้กำหนด multiplier แยกสำหรับ healing, shield, support และ utility effects

ห้ามนำ `totalDamageMult` ไปใช้กับ heal/support ตรง ๆ เพราะมันรวม target counter matchup ซึ่งอาจไม่ควรลดการรักษาเพื่อนร่วมทีม ต้องออกแบบ `effect/heal/shield` multiplier ที่ใช้ attacker compatibility อย่างเหมาะสมและทดสอบแยก

### 2.5 Foe policy นอกเหนือจาก beast raid — ต้องตรวจเพิ่ม
ปัจจุบัน beast species/raid ใช้ profile จริงแล้ว แต่ `resolveCompatibility()` ยังคืน neutral สำหรับ `npc.foe` ที่ไม่มี Human Core root structure

ต้องจำแนก bandit, guardian, summon, clone และ boss ว่ามี intrinsic profile, root structure หรือเป็น non-elemental โดยชัดเจน และเพิ่ม combat tests สองทิศทาง

### 2.6 NPC behavioral coverage — ยังต้องเพิ่ม
Resolver integration มีอยู่ใน path/subpath, mantra, cognition/tech preference, gear suitability และ combat skill scoring บางส่วน แต่ยังต้องทดสอบพฤติกรรมจริง:
- NPC ต่างราก/บุคลิกเลือก path/subpath ต่างกัน
- NPC เลือกวิชาที่เข้ากับอาวุธจริง โดยไม่ละเมิด hard requirements
- NPC ไม่เลือกเนื้อหาที่ไม่รู้หรือไม่มีสิทธิ์
- NPC อาจเลือกวิชาไร้ธาตุ/ธาตุไม่ตรงเมื่อราคา บทบาท บุคลิก หรือ tactical state เหมาะกว่า
- score breakdown ต้องตรงกับคะแนนที่ใช้จริง

### 2.7 Content coherence / rename pass — เป็นงานหลักถัดไป
ตรวจทุก item, weapon, armor, accessory, artifact, technique, mantra, passive และ recipe:
- ชื่อไทย/อังกฤษต้องสื่อถึงอาวุธ ธาตุ วิถี และผลจริง
- `weaponTypes`, `requiresWeapon`, `elementProfile`, `arch`, `moves`, cost, cooldown และ unique effect ต้องไปในทิศทางเดียวกัน
- อนุญาตให้เปลี่ยน display name และ redesign mechanics เมื่อมีเหตุผล แต่คง stable IDs ไว้ เว้นแต่แก้ references/tests ครบทุกจุด
- ห้ามแก้ชื่อแบบ keyword replacement หรือทำให้ legendary items สูญเสีย signature identity
- จัดทำ before/after mapping พร้อมเหตุผลและ balance evidence

### 2.8 Performance / device verification — ยังไม่รับรองบนอุปกรณ์จริง
- `browser_mobile_perf` ผ่านใน test runner environment
- long simulation 180 วันผ่าน
- ยังไม่มี physical Android/Snapdragon 8 Elite runtime benchmark รอบนี้
- หากปรับ AI/pathfinding ให้ทำ profiling ก่อน/หลังและรักษา deterministic RNG

## 3. เงื่อนไขรับงานถัดไป

1. มี design decision สำหรับ neutral relation, aggregate grade และ effect-type multipliers
2. มี content audit ครบทุก stable ID และมี mapping การ rename/redesign
3. มี behavioral NPC tests ที่เรียก decision pipeline จริง
4. มี combat tests สำหรับ human/foe, ordinary/special/neutral และ direct/DOT/control/heal/shield
5. regression runner ผ่านทั้งหมด; รายงานจำนวน suite/assertions และ syntax files ที่แน่นอน
6. rebuild standalone HTML และตรวจว่า source/package copies ตรงกัน
7. รักษา `js/human_core.js` byte-for-byte เว้นแต่พิสูจน์ได้ว่าจำเป็นจริงและหยุดรายงานก่อนแก้
8. ไม่ต้องรักษา compatibility กับ old saves หรือ old game versions; ทดสอบ new-schema save/load ให้ถูกต้อง
