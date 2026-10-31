# Source game analysis — inspected 2026-10-27

แหล่งข้อมูลที่ตรวจคือ upload **`Jianghu_v2_08_3_ACADEMY_FORMULA_FIX_COMPLETE.zip`** ไม่ใช่ข้อมูลที่จำจากแชตเก่า Version file ระบุ `2.08.3 — Academy formula schema migration + EP.5 needs repair + ×8/×16 speed` Archive SHA256: `df56d5c280f78f1698709f13aa579b222e958e2816249544aa780cb067e79bc6`

Archive มี **167 file entries**, รวมขนาดแตกไฟล์ **66,970,490 bytes** Source entrypoint มี **32 script modules** เก็บต้นฉบับที่จำเป็น **52 ไฟล์** (scripts 21 ไฟล์) ใน `../SOURCE_REFERENCE/extracted/` พร้อม original paths, per-file hashes และ full inventory ที่ `../SOURCE_REFERENCE/SOURCE_MANIFEST.json` ไม่รวม player save, fixtures, original builds, รูป/font binaries หรือ original ZIP

## Method and evidence

ตรวจ `VERSION.txt`, `source/index.html`, `BUILD_MANIFEST.json`, `SOURCE_AUDIT.json`, `COMBAT_CONTENT_MANIFEST.json`, architecture/rules/identity/field docs และ selected scripts รวม `legacy.bundle.js` นับจาก registry/array จริงที่ประเมินแบบ read-only VM ของ source modules 10 ตัวแรกตาม entrypoint ได้แก่ legacy bundle, living content, Myriad data, Human, combat data, sect life, Jianghu data/runtime, progression และ academy โดยไม่สร้าง/นำเข้า player world ไม่โหลด recovered save และไม่เรียก source game loop

เก็บ non-save catalogue snapshot ที่ใช้ตรวจใน `../SOURCE_REFERENCE/catalogs/inspected_catalog.json` และ detailed audit ที่ `../SOURCE_REFERENCE/SOURCE_AUDIT_REPORT.md` ทั้งสองเป็นผลวิเคราะห์รอบนี้ แยกจาก original byte-for-byte archive entries

ค่าด้านล่างเป็นค่าหลัง registration ของ modules เหล่านั้น ไม่ใช่การอ้างจาก comment header เก่าหรือการรับรองว่าทุก source subsystem ทำงานครบ ค่าของ Myriad เป็น extension arrays และอาจถูกผนวกเข้าหลาย registry แล้ว จึงไม่บวกรวมทุกแถวเพื่อกล่าวเป็น unique total เดียว

| Inspected registry | Count | Meaning |
|---|---:|---|
| `World2026Engine.CULTIVATION_PATHS` | 5 major paths | XIAN, BODY, GOD, DEMON, HEART_SOUL |
| All registered subpaths/tracks | 47 | XIAN 14, BODY 12, GOD 11, DEMON 5, HEART_SOUL 5 |
| `getAllTechniquesCatalogV190()` | 681 | Effective arts catalogue after loaded content registration |
| `PATCH140_DATA.MATERIALS_REGISTRY_V140` | 591 | Effective material registry after loaded registrations |
| `PATCH140_DATA.STARTER_RECIPES_V140` | 225 | Source recipe registry; distinguish from other recipe registries |
| `LivingProgression.RECIPES` | 12 | Separate progression recipe registry |
| Myriad entrances / environments / encounter pools | 5 / 15 / 90 | Shared entrance law, environment profiles, six themed pools per environment |
| Myriad rare organs / new materials | 40 / 235 | `rareOrgans`, `newMaterials` |
| Myriad new beast species / original beast drop fixups | 125 / 18 | `newBeasts`, `nwBeastDropFixups` |
| Myriad new recipes / experiment designs / exploration events | 165 / 25 / 24 | Distinct extension arrays |
| World definition sects / kingdoms / regions | 24 / 3 / 18 | Source macro-world data |
| World settlement specs / vacant holding specs | 150 / 110 | Data definitions; not claimed as spawned target entities |
| Adapted `JianghuRealmData` beasts / fortune sites / expedition sites | 9 / 8 / 6 | Additional source registry with its own scope |
| Adapted external sect templates / grand formations / equipment | 6 / 3 / 10 | `JianghuRealmData` registry |
| Source Human foundation | 68 axes | Life values 8, personality 14, physical 14, cognition 12, interests 14, aptitudes 6 |

Source Human file SHA256 is `b230108298cae486c3dc6bf6698f0384ca67128b064ff3947f19fa6e5522328a` อ้างอิงได้จาก original lock และ hash ที่คำนวณจาก bytes เดียวกัน Source `legacy.bundle.js` SHA256 is `605e8e3d9a2cf282f3be29dee6e124aeb5448af9b2f5ae005b147761404905b2` การคง bundle นี้สำคัญเพราะ catalogues และ historical installers ฝังอยู่ภายใน มิใช่มีครบใน loose data files

## Compared with the target baseline

| Baseline target registry | Count inspected before v1.10 expansion |
|---|---:|
| Major paths / subpaths | 3 / 24 |
| Techniques / mantras | 240 / 47 |
| Materials / recipes | 61 / 126 |
| XIAN / BODY / GOD maximum stages | 9 / 5 / 4 |
| Target HC dimensions / fingerprint | 155 / `155:2f9c9dd7` |

เมื่อเทียบ exact IDs ของ effective source catalogues กับ target baseline พบ source-only art IDs **394**, material IDs **542** และ starter-recipe IDs **200** นี่เป็น inventory gap ไม่ใช่รายการที่ port สำเร็จหรือรายการที่สามารถนำมาใช้โดยตรงได้ Items ที่ ID ตรงกันยังอาจมี schema/semantics ต่างกัน

Source parent paths XIAN/BODY/GOD มี top-level stage counts 9/5/4 เช่นกัน แต่ source มี independent per-subpath tracks อีกชั้น เช่น FIVE_ELEMENTS 10 realms และ ELIXIR_DAO 11 realms จึงไม่ย้าย track ordinals หรือ lifespan tables มาทับ target parent stages Source DEMON9 และ HEART_SOUL9 ไม่ได้ถูกรับเป็น major paths ของ target

Target มี 155 dimensions ของ `HC` ขณะที่ source มี 68 axes ของ `HumanCore` จึงรักษา target fingerprint และความหมายเดิมไว้ Source identity/condition/world ledgers เป็นข้อมูลให้เข้าใจการออกแบบ ไม่ใช่ replacement schema สำหรับ NPC ใน target

## Useful systems and adaptation boundary

- **Cultivation/arts:** source มี routes, hidden routes, realm ordinals, slots, innate arts และ prepared abilities; target ต้องเลือกข้อมูลและ map เข้ากับ path/stage caps เดิม พร้อมต้นทุน การเรียน และ eligibility จริง
- **Materials/recipes:** ใช้ input IDs, quantities, crafting path, tier, properties และ time เป็นวัตถุดิบในการ map เข้า `JD`/`ECO` ต้องตรวจทุก input/output link รวม duplicate IDs, missing materials และผลิตผลที่ใช้จริง
- **Combat:** `combat-stats.js` เป็น derived sheet; `combat-overhaul.js` รวม hit/secondary resolution; source HP condition ledger กับ target `npc.h.state.hp` ไม่ใช่หน่วยเดียวกัน Port เฉพาะ semantics ที่เข้ากับ target `STATS`/`COMBAT`; ไม่สร้าง HP ledger ที่สอง
- **Academy/library:** มี consent, knowledge, book custody, sharing licenses และ idempotent completion ใช้ปรับ target NPC actions/learning ได้ แต่สูตร source `knownBy/licenses/history/revision` ไม่ใช่ target save schema โดยอัตโนมัติ
- **Sect contributions/economy:** เน้น real custody, CP, sponsored crafting และ paid construction Map ผ่าน stock/inventory/CP ของ target และตรวจ conservation ทุก transaction
- **Myriad encounters:** แยก species definition กับ encounter individual, anatomy/corpse persistence, harvesting และ experiment properties เหมาะกับการขยายภายหลัง ต้องมี world/time/AI integration จริงก่อนกล่าวว่าระบบพร้อมเล่น
- **Macro-world:** จำนวนเมือง/สำนัก/ภพข้างต้นเป็น reference data; ไม่ได้เปลี่ยน tile map, expedition model หรือ spawn rules ของ target เอง

## Concrete source quality findings

Detailed audit พบ **18 distinct `MAT_FORM_*` ingredients** ที่ Myriad recipes อ้างถึงแต่ไม่มีใน effective source material registry เช่นสูตร `MW_REC_062`, `MW_REC_079`, `MW_REC_080` จึงไม่ใช้ชุดสูตรเหล่านั้นใน first-stage selection อีกกรณีคือ forest snake fang `MW_MAT_BP_141` อยู่ใน direct resource allocation ของ VOID pool เท่านั้น การคัดข้อมูลจึงต้องตรวจ definition และ allocation ควบคู่ ไม่คัด original 90-pool placement โดยตรง บาง generated art effect bindings ขัดกับคำบรรยาย จึงต้องระบุ target combat archetype อย่างชัดเจน

First-stage raw selection ที่ตรวจมี 3 canonical subpaths,9 source-only arts,25 materials,8 dependency-complete recipes และ4 environment themes ทุก recipe input รวม26 references resolve ไปที่25 material definitions จริง รายละเอียด selection และ mapping อยู่ใน `../SOURCE_REFERENCE/migration/selected_raw.json` กับ `../SOURCE_REFERENCE/migration/mapping.json`; completion/testing ของ target ให้ดู roadmap/QA ปัจจุบัน ไม่อ้างจากจำนวนที่คัดเลือกเพียงอย่างเดียว

## Historical limitations, privacy and rights

Original `ARCHITECTURE.md` ยังกล่าวถึง 28 modules และบาง header กล่าวถึง 41 subpaths ทั้งที่ source entrypoint มี 32 modules และ registry ที่ตรวจมี 47 subpaths `COMBAT_CONTENT_MANIFEST.json` ใช้ release label เก่ากว่า `VERSION.txt` ได้ เก็บต้นฉบับโดยไม่แก้เพื่อแยก historical evidence ออกจาก current target architecture เอกสารบางฉบับอ้าง `HUMAN_REGISTRY.json` และ `references/npc-core-lock.json` ซึ่งไม่มีใน archive นี้

Original fix/readme/QA documents กล่าวว่าชุด `npm test` เต็มยังไม่จบภายในเวลาที่กำหนด การอ้าง original smoke/build pass จึงไม่เท่ากับ full source suite pass และไม่ใช่ target QA การ port ต้องมี acceptance criteria และ target tests ของตนเอง

ตรวจ secret patterns ในไฟล์ที่คัดเก็บครบ52 ไฟล์ ไม่พบ pattern hit ดู `../SOURCE_REFERENCE/SECURITY_REVIEW.md` ไม่มี recovered save payload หรือ save fixtures ในแพ็ก; manifest ของไฟล์ที่ตัดออกมีเพียง metadata/hash

ไม่พบ general game code/content license มีเพียง Noto SIL OFL สำหรับ font software ที่แยกต่างหาก Reference นี้เป็น **PRIVATE user-supplied development reference only** ไม่สมมติสิทธิ์ redistribution และต้องตรวจสิทธิ์ก่อนเผยแพร่สู่สาธารณะ
