# JianghuSect v1.10 — architecture contract

ฐานที่ใช้ต่อคือ `JianghuSect_v1` ใน upload `JianghuSect_v1-9_download.zip` ไม่ใช่ engine ของ source Jianghu v2.08.3 ชื่อ release ของแพ็กกับชื่อ directory ใน ZIP เดิมจึงต่างกันได้ การเพิ่มข้อมูลหรือกลไกต้องผ่าน module ของ target และ world `W` เดียว

## Runtime and ownership

เกมเป็น offline vanilla JavaScript: `index.html` โหลด IIFE modules ผ่าน globals ไม่มี bundler/framework ที่ต้องดาวน์โหลดจากเครือข่าย `JianghuSect_single.html` เป็นไฟล์ที่สร้างจาก target HTML/CSS/JS เดียวกันด้วย `tools/build_single.js` ส่วน `SOURCE_REFERENCE/` ไม่อยู่ในลำดับโหลดและไม่ถูกฝังใน standalone

| Module/global | Responsibility |
|---|---|
| `data/data_*.js` → `JD` | Declarative catalogues ของคน ตบะ วัสดุ ตำรับ bottleneck combat CP วิชาและอสูร |
| `js/util.js` → `U` | RNG, clamps และ utilities |
| `js/human_core.js` → `HC` | Locked Human Core, effective values, generation, experience และ validation |
| `js/world_map.js` → `MAP` | Sect tile map, buildings, walkability และ paths |
| `js/cultivation.js` → `CULT` | Stage, threshold, mantra, techniques, HP/Qi และ lifespan |
| `js/economy.js` → `ECO` | Materials, crafting, market และ stock transfers |
| `js/sect.js` → `SECT` | Leadership, roles, policies, duties, recruitment และ social institutions |
| `js/ai.js` → `AI` | Autonomous NPC action scoring, action state และ completion |
| `js/combat.js` → `COMBAT` | Fights, duels, injuries, death และ combat outcomes |
| `js/expedition.js` → `EXPED`; `js/explore.js` → `EXPLORE` | External journeys, exploration groups, events และ return settlement |
| `js/bottleneck.js` → `BN`; `js/skills.js` → `SK` | Breakthrough support, practice, learned skills และ methods |
| `js/stats.js` → `STATS`; `js/cpeco.js` → `CPE` | Combat projections and equipment/item usage; contribution accounts and internal sponsored economy |
| `js/external_market.js` → `EXT` | Persistent visiting traders, real merchant stock/wallets, sect surplus/shortage trades, member trades with spirit stones and bounded transaction history |
| `data/data_expansion.js` → `JD.EXPANSION`; `js/content.js` → `CONTENT` | Curated source adapter data; finite renewable resources, discovery routes, formula/manual access and native integration |
| `js/sim.js` → `SIM` | Authoritative world creation, minute ticks, calendar, registry, serialization/deserialization |
| `js/render.js` → `Render`; `js/ui.js` → `UI` | Canvas presentation, selection, panels และ user actions |
| `js/main.js` → `G` | Current world `G.W`, renderer `G.R`, frame/tick scheduling, touch gestures และ autosave |

`W` เป็น source of truth ของ simulation: `npcs`/`byId` คือคนชุดเดียว, `sect` คือ stock/gear/stones/ledger/library/policies, `map` คือ physical site, `rng` คือ deterministic random stream, `t`/`day`/`season` คือเวลา และ fights/foes/world/explore คือ runtime ของระบบต่อสู้/ภายนอก Helper functions เช่น `W.log`, `W.fame`, `W.makeNpc` ผูกกลับโดย `SIM` ส่วน UI ผูก world ที่สร้างหรือโหลดด้วย `G` ไม่สร้าง NPC หรือ inventory สำเนาคู่ขนาน

v1.10 ใช้ `W.sect.knownRecipes` สำหรับ formula discovery และ `W.world.contentSites`/`contentHistory`/`contentMetrics` สำหรับ site stock, renewal, visit/discovery history และ counters; `W.world.visitors`/`tradeHistory`/`marketStats` เก็บพ่อค้า สต็อก กระเป๋าเงิน และธุรกรรม ทั้งหมดอยู่ใน native world ที่ serialize ได้

การทำงานของ AI/การผลิต/เดินทาง/การใช้ยา/การทะลวงขั้นต้องใช้เวลาและ ledger จริง แสดงผลจาก state ที่เกิดแล้ว ส่งข้อมูลการเปลี่ยนแปลงผ่านระบบที่เป็นเจ้าของ state นั้น การอ่าน tooltip หรือเปิด panel ต้องไม่สร้างของ สุ่มผล หรือเพิ่มตบะ

## Required script order

`index.html` เป็นแหล่งความจริงของลำดับโหลด ฐานเดิมใช้8 data +18 runtime modules; v1.10 เพิ่ม `data_expansion` กับ `content` และ v1.10.1 เพิ่ม `external_market` เป็น9 data +20 runtime modules รวม29 ตามลำดับ:

```
data_core → data_cult → data_items → data_bt → data_cb → data_cp → data_tech → data_beasts → data_expansion
util → human_core → world_map → cultivation → economy → sect → ai → combat
→ expedition → explore → bottleneck → skills → stats → cpeco → external_market → content → sim → render → ui → main
```

โหลด data ลง `JD` ก่อน modules ที่อ่านมัน โหลด modules ระบบก่อน `SIM` และโหลด `Render`/`UI` ก่อน `main` เนื่องจากมีการจับ global dependencies ตอนประเมินไฟล์ `external_market` ต้องอยู่หลัง `cpeco`/`ai` และก่อน `sim`; `content` ต้องอยู่หลัง `cpeco` และระบบที่มันเชื่อม แต่ก่อน `sim` หากเพิ่ม module ต้องปรับ target entrypoint และ test loader ที่เกี่ยวข้องร่วมกัน โดย standalone builder อ่าน script list จาก entrypoint

## Human Core and cultivation invariants

- รักษา `HC.SCHEMA = HUMAN_CORE_V1`, `HC.VERSION = 1.0.0` และ `HC.FINGERPRINT = 155:2f9c9dd7`
- Target มี 155 registered dimensions: physiology 22, intellect 18, social 7, temperament 7, personality 14, values 8, aptitudes 6, affinities 23, interests 24, skills 26 ข้อมูลใหม่ใช้ `npc.ext[system]` และ modifiers/learned state แทนการเพิ่มหรือตีความแกน `npc.h` ใหม่
- `js/human_core.js` เดิมมี SHA256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`; ใช้ `test/core_lock.js` ตรวจ fingerprint, axes, validation และ save fingerprint
- Source Jianghu มี `HumanCore` 68-axis schema คนละแบบ ห้ามแทน target `HC` ด้วย source `human.js` หรือคัดลอก source NPC objects มาทับ target people
- Target คง 3 major paths: `XIAN` สูงสุด 9 stages, `BODY` 5, `GOD` 4 ตำแหน่งในสำนัก `npc.rank` เป็นคนละความหมายกับ cultivation `npc.cult.stage`
- Source tier และ source realm ordinal ไม่เท่ากับ target stage ตรง ๆ การรับข้อมูลต้อง map ราย field/route พร้อม cap และ eligibility; ไม่เพิ่ม 5-path/47-subpath model จาก source โดยอัตโนมัติ

Save/load ใน patch ปัจจุบันต้องรักษา world, registry, RNG, clock, ledgers และ HC fingerprint ไม่มี commitment ให้ migration จากเกมต้นทางหรือ patch เก่าที่ไม่ได้รองรับ การทดสอบ target ใช้ fresh deterministic worlds, current-patch round trips และ synthetic save ที่สร้างด้วยฐานv1.9จริง โดยไม่รวม recovered player save

## Source boundary

อ่าน `SOURCE_GAME_ANALYSIS.md` เพื่อแยกสิ่งที่ inspect พบจริงจากคำกล่าวใน source เอกสารเดิมใช้ engine `World2026Engine`, `HumanCore`, Frontier state และ lifecycle คนละแบบ ใช้เพียงข้อมูล/แนวคิดที่ผ่าน target adapters และ validation ของ target การเก็บไฟล์เดิมใน reference ไม่ได้แปลว่าระบบนั้นถูก port หรือผ่าน QA แล้ว
