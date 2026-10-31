# Skill effects — runtime v1.10.11

All29 skills have a real training route and a gameplay consumer.26 use native `npc.h.skills`; BOW/STAFF/FOCUS use bounded0–100 `npc.martialSkills` values. `human_core.js` is unchanged.

`MARTIAL.skillRead(n,id)` reads either store without mutation. `skillPractice(n,id,hours,quality)` rejects invalid input, routes native skills to HC practice and extras through the same learning curve, applies current path training efficiency and invalidates combat caches. Actual weapon attacks practice their equipped weapon type. Training-ground practice, mentoring and the `skillDrill` action also support extras; ordinary work continues training related native skills.

| Group | Skill | Actual effect | Training |
| --- | --- | --- | --- |
| อาวุธ | `SWORD` ฝีมือกระบี่ | เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้กระบี่ | ฝึกหอยุทธ์/ใช้อาวุธจริง/รับการสอน |
| อาวุธ | `BLADE` ฝีมือดาบ | เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้ดาบ | ฝึกหอยุทธ์/ใช้อาวุธจริง/รับการสอน |
| อาวุธ | `SPEAR` ฝีมือหอก | เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้หอก | ฝึกหอยุทธ์/ใช้อาวุธจริง/รับการสอน |
| อาวุธ | `FIST_PALM` ฝีมือหมัดฝ่ามือ | เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้สนับหรือมือเปล่า | ฝึกหอยุทธ์/ใช้อาวุธจริง/รับการสอน |
| อาวุธ | `BOW` ฝีมือธนู | เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้ธนู | ฝึกหอยุทธ์/ใช้อาวุธจริง/รับการสอน |
| อาวุธ | `STAFF` ฝีมือพลอง | เพิ่มพลัง/ความแม่นยำและเจาะเกราะเมื่อใช้พลอง | ฝึกหอยุทธ์/ใช้อาวุธจริง/รับการสอน |
| อาวุธ | `FOCUS` ฝีมือสื่อปราณ | เพิ่มพลังวิชา/ความแม่นยำและเจาะเกราะเมื่อใช้สื่อปราณ | ฝึกหอยุทธ์/ใช้อาวุธจริง/รับการสอน |
| บำเพ็ญและเคล็ดภายใน | `MOVEMENT` ฝีมือวิชาตัวเบา | เพิ่มความเร็วเคลื่อนที่และหลบหลีก | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| บำเพ็ญและเคล็ดภายใน | `BODY_REFINING` ฝีมือหลอมกาย | เพิ่มพลังชีวิตและป้องกัน | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| บำเพ็ญและเคล็ดภายใน | `SOUL_DIVINE` ฝีมือจิตวิญญาณ-เทวะ | เพิ่มโจมตีวิชาและป้องกันวิชา | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| บำเพ็ญและเคล็ดภายใน | `POISON` ฝีมือพิษ | เพิ่มความแรงแผลพิษ/โลหิตจากวิชา | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| บำเพ็ญและเคล็ดภายใน | `SCRIPTURE` ฝีมือคัมภีร์ | เพิ่มความเร็วศึกษาวิชาและโอกาสถอดจารึก | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| บำเพ็ญและเคล็ดภายใน | `ritual` ฝีมือพิธีกรรม-ศรัทธา | เพิ่มอัตราบำเพ็ญ โดยเฉพาะวิถีเทพ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `ALCHEMY` ฝีมือปรุงโอสถ | เพิ่มโอกาสสำเร็จ คุณภาพและความเร็วหลอมโอสถ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `FORGING` ฝีมือหลอมศาสตรา | เพิ่มโอกาสสำเร็จ คุณภาพและความเร็วหลอมอุปกรณ์ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `ARRAY` ฝีมือค่ายกล | เพิ่มโอกาสสร้างค่ายกลและป้องกันวิชาในการรบ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `TALISMAN` ฝีมือยันต์ | เพิ่มโอกาสสร้างยันต์และเกราะในการรบ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `MEDICINE` ฝีมือการแพทย์ | เพิ่มการฟื้นตัวของผู้ป่วยเมื่อเป็นหมอและโอกาสชำแหละอวัยวะ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `herbalism` ฝีมือสมุนไพร-เพาะปลูก | เพิ่มจำนวน/ระดับสมุนไพรและข้าวที่เก็บได้ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `mining` ฝีมือขุดแร่-งานช่าง | เพิ่มจำนวน/ระดับแร่ที่ขุดได้ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `cooking` ฝีมือปรุงอาหาร-ชา | เพิ่มอาหารจากข้าวหนึ่งหน่วย | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| การผลิตและการแพทย์ | `construction` ฝีมือก่อสร้าง | ลดเวลาขยายอาคารจริง | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| สำรวจและอสูร | `BEAST_TAMING` ฝีมือฝึกอสูร | ลดความเสียหายจากอสูรจริง | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| สำรวจและอสูร | `stealth` ฝีมือลอบเร้น | เพิ่มหลบหลีกและคริติคอล | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| สำรวจและอสูร | `survival` ฝีมือเอาตัวรอดป่าเขา | เพิ่มโอกาสผ่านอันตราย/หนีและลดอุบัติเหตุ | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| สังคมและการจัดการ | `trading` ฝีมือค้าขาย | เพิ่มรายได้จากการค้าเดินทาง | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| สังคมและการจัดการ | `administration` ฝีมือบริหารจัดการ | ลดค่าใช้จ่ายดูแลสำนักและช่วยความเร็วขยายอาคาร | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| สังคมและการจัดการ | `diplomacy` ฝีมือทูต-เจรจา | เพิ่มผลเจรจาความสัมพันธ์/สนธิสัญญา | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |
| สังคมและการจัดการ | `arts` ฝีมือดนตรี-ศิลป์ | เพิ่มการคลายเครียดและขวัญใจจากดนตรี | งานที่เกี่ยวข้อง/ฝึกทักษะเฉพาะ/รับการสอน |

Weapon proficiency0→100 changes the equipped-style attack and technique-attack contribution from−20% to+25%, adds up to15% accuracy and5 penetration. No unrelated weapon maximum is used. MOVEMENT adds up to18% move and10% evasion; BODY_REFINING adds15% HP and14% defense; SOUL_DIVINE adds15% technique attack and13% technique defense. ARRAY adds9% technique defense; TALISMAN adds7% physical and5% technique defense. Stealth adds13% evasion and2.5 critical points.

BEAST_TAMING multiplies real beast incoming strike damage by `1/(1+skill*.004)`; shared `isBeast` recognizes both expedition beasts and actual same-map wild+speciesId creatures. POISON multiplies poison/bleed tick damage by `1+skill*.004`. Ritual multiplies cultivation rate by `1+skill*.003` for GOD and`1+skill*.001` for other paths. SCRIPTURE adds a `1+skill*.003` study multiplier; MEDICINE adds `1+skill*.004` to a serving healer's recovery effect. Arts adds `1+skill*.005` to music stress/mood recovery. Construction and administration shorten an actual building upgrade's8-day base by `1+construction*.004+administration*.0015`; treasury administration also reduces native upkeep by up to10%.

ALCHEMY/FORGING/ARRAY/TALISMAN consume their registered craft skill in native success/mastery/duration/quality formulas. Herbalism/mining/cooking use native real yield formulas. Trading affects expedition trade returns; diplomacy affects real treaty/relationship negotiation; survival affects dangerous encounter checks, escape and dissection. Those existing native consumers remain authoritative.

`skillEffects(n)` exposes the common combat/cultivation/medicine/study/music/beast/poison layer; both fast and explained stat paths consume it. `activeTechs(n)` is the common compatibility filter after retraining; dormant old techniques grant no generic learned-tech stats, passives or active moves. Path/subpath skill-derived efficiencies are displayed separately from permanent practice values and disappear when their identity is replaced.

Verification: `node test/martial_retraining.js` covers all29 real training routes, equipped-type matching, actual representative combat/production/cultivation/study outcomes, wild-beast strikes, categorization and pure UI. `test/martial_paths.js` covers paid crafting of all42 new recipes, actual skill activation and physical/life outcome hooks.
