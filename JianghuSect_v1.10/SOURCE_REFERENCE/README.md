# Original source reference — PRIVATE

เก็บต้นฉบับที่จำเป็นต่อการพัฒนาต่อภายในแพ็กนี้ โดยไม่ต้องมีแชตหรือ ZIP เก่าอยู่ข้างเครื่อง ไฟล์ใน `extracted/` คัดลอกแบบ byte-for-byte และคง relative path เดิมจาก ZIP เช่น `extracted/02_SOURCE_FULL/source/scripts/legacy.bundle.js` ไม่ใช่ไฟล์ runtime ของ JianghuSect v1.10 และไม่ถูกโหลดจาก `index.html` หรือ standalone player

ต้นทางคือ **`Jianghu_v2_08_3_ACADEMY_FORMULA_FIX_COMPLETE.zip`** (Jianghu v2.08.3) ขนาด 15,492,923 bytes; SHA256:

```
df56d5c280f78f1698709f13aa579b222e958e2816249544aa780cb067e79bc6
```

- เก็บต้นฉบับ 52 ไฟล์ รวม 22,591,380 bytes: source scripts 21 ไฟล์, เอกสาร 22 ไฟล์, JSON metadata/manifests 6 ไฟล์, `VERSION.txt`, source HTML สำหรับอ้างอิงลำดับโหลด และ Noto license
- `legacy.bundle.js` เก็บทั้งก้อน เพราะมี engine/catalogues ที่เป็นแหล่งข้อมูลจริง ไม่ใช่เพียงโค้ดเก่าไม่ใช้งาน
- เก็บ architecture, development rules, Human identity/field references, combat manifests, version, roadmap และ handoff เดิม เพื่อรักษาความหมายและข้อจำกัดของระบบ
- ไม่เก็บ recovered player save, save fixtures, test/evidence payloads, รูปภาพ, font binaries, original builds หรือ original ZIP
- `SOURCE_MANIFEST.json` มี inventory ครบทั้ง 167 ไฟล์จาก ZIP พร้อม path, size, hash และเหตุผลที่เก็บ/ไม่เก็บ แม้ save ที่ถูกตัดออกก็มีเพียง metadata กับ SHA256 เท่านั้น

เริ่มอ่านเอกสารของแพ็กปัจจุบันที่ `../ROADMAP/ARCHITECTURE.md` และ `../ROADMAP/SOURCE_GAME_ANALYSIS.md` จากนั้นใช้ manifest หาไฟล์ต้นฉบับที่เกี่ยวข้อง แต่ละรายการระบุ reason/use, original path, SHA256 และ dependencies ดูคู่มือสั้นที่ `SOURCE_MANIFEST.md` และเส้นทางเข้า raw/derived/migration catalogues ที่ `SOURCE_DATA_CATALOG.md`

ไฟล์ต้นฉบับบางฉบับมีชื่อเวอร์ชันหรือจำนวนโมดูลเก่าค้างอยู่ เช่น `ARCHITECTURE.md` กล่าวถึง 28 โมดูล ขณะที่ `source/index.html` และ `BUILD_MANIFEST.json` ของ ZIP นี้มี 32 โมดูล บางเอกสารกล่าวถึง `HUMAN_REGISTRY.json` หรือ `references/npc-core-lock.json` ซึ่งไม่มีใน ZIP จริง การเก็บเอกสารเดิมไม่ถือว่าได้แก้ความคลาดเคลื่อนเหล่านี้ และคำสั่ง build/test เดิมรันไม่ได้จาก subset นี้

**สิทธิ์:** ใช้เป็น PRIVATE user-supplied development reference เท่านั้น ไม่พบ general license ของโค้ดหรือเนื้อหาเกม ไม่สมมติสิทธิ์แจกจ่ายใหม่ ก่อนเผยแพร่ต่อสาธารณะต้องตรวจสิทธิ์ ดู `SOURCE_LICENSES_AND_ATTRIBUTION.md` และผลตรวจ secret เบื้องต้นใน `SECURITY_REVIEW.md`
