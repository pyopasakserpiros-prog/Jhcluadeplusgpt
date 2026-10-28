# Selected source inspection — 2026-10-27

ตรวจ text ของไฟล์ที่เลือกเก็บครบ **52 ไฟล์** (source scripts 21 ไฟล์ รวม `legacy.bundle.js`, เอกสาร/metadata และ Noto license) ก่อนเก็บสำเนา ใช้ pattern ตรวจ private-key headers, AWS access-key shapes, GitHub token shapes, OpenAI-like key shapes, literal assignments ของ API key/client secret/access token/refresh token/password, อีเมล และ URL ที่ฝัง username/password

**ผล:** ไม่พบ pattern hit ในไฟล์ที่เลือกเก็บ และไม่พบ credential ที่เห็นได้ชัดจากการอ่าน interfaces, comments, version และเอกสารประกอบ ไม่มีการแก้หรือลบข้อความต้นฉบับเพื่อให้ผลตรวจผ่าน Pattern expressions และผลตรวจแบบ machine-readable อยู่ใน `SOURCE_MANIFEST.json` (`inspection`)

ขอบเขตเป็นการตรวจ secret ที่เห็นได้ชัด ไม่ใช่ exhaustive security audit ไม่ได้ยืนยันว่า source ปลอดช่องโหว่ หรือไม่มีข้อมูลที่ต้องตรวจเพิ่มเติมก่อนเผยแพร่

Recovered player save และ original test/evidence/save fixtures ไม่ได้ถูกเปิดเป็น world หรือโหลดเข้าเกมเพื่อวิเคราะห์เนื้อหา ข้อมูลทุก entry รวมไฟล์ที่ตัดออกถูก stream จาก ZIP เพื่อคำนวณ SHA256 เท่านั้น ไม่เก็บ payload ของ entry ที่ตัดออก และไม่เก็บ original ZIP ในแพ็ก ตัว manifest เก็บเพียง path, size, digest และ archive metadata เพื่ออ้างอิงที่มา

ชื่อและตัวอย่างในเอกสารต้นฉบับยังเป็น historical source documentation อาจกล่าวถึงการกู้ save เดิม แต่ไม่มี payload ของ recovered save หรือ save fixtures ใน reference นี้ การตรวจสิทธิ์และการกลั่นกรองเนื้อหาก่อนเผยแพร่ต่อสาธารณะยังเป็นขั้นตอนแยกต่างหาก
