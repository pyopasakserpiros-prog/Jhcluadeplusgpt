# JianghuSect v2.0.3 — สำนักเมฆาหยก (Jade Cloud Sect)

เกมจำลองบริหารสำนักยุทธภพและผู้บำเพ็ญเพียร (Jianghu Sect Management Simulation) เล่นแบบออฟไลน์ 100% ไม่มี external dependencies ทำงานได้ทั้งบน PC และ Mobile Browser

---

## 🎮 วิธีการเปิดเล่น (How to Play)

1. **แบบไฟล์เดี่ยว (Standalone Single File - แนะนำ):**
   - เปิดไฟล์ `JianghuSect_single.html` ด้วยเบราว์เซอร์ (Chrome, Edge, Firefox, Safari) ได้ทันที
2. **แบบแยกโมดูล (Modular Project):**
   - เปิด `index.html` โดยมีโฟลเดอร์ `js/`, `data/`, `css/` อยู่ในไดเรกทอรีเดียวกัน หรือรัน Local Web Server:
     ```bash
     python3 -m http.server 8000
     ```
     แล้วเปิด `http://localhost:8000`

---

## 🌟 ฟีเจอร์หลักในเวอร์ชัน v2.0.3 (Features & Changelog)

1. **หอคัมภีร์และคลังความรู้สำนัก (Sect Knowledge Library):**
   - เพิ่มแท็บ `lib` ในหน้าต่างสำนัก แสดงรายการคัมภีร์วิชาต่อสู้ (`TECH_MANUAL`) และม้วนตำรับ (`RECIPE_SCROLL`) ทั้งหมดที่สำนักครอบครอง
   - ศิษย์สามารถนำม้วนตำรับและคู่มือวิชามาบริจาคเข้าหอคัมภีร์ได้ โดยได้รับแต้มคุณูปการ 65% ของมูลค่าของชิ้นนั้น และไม่สูญหายไปจากการรีเซ็ตประจำวัน
2. **แท็บข้อมูลศิษย์ฉบับปรับปรุง (Enhanced Character Tabs):**
   - เพิ่มแท็บกระเป๋า (`bag`): ตรวจสอบไอเทม ยา วัตถุดิบ และม้วนตำรับส่วนตัว
   - เพิ่มแท็บวิชา (`tech`): แสดงวิชาต่อสู้ที่ติดตั้งและกำลังฝึกฝน
   - เพิ่มแท็บสายย่อย (`sub`): ติดตามความก้าวหน้าการบำเพ็ญสายเฉพาะทาง 9 ขั้น (เซียนจันทราเหมันต์, กายาพฤกษาวสันต์, เทพโอสถโพธิสัตว์ ฯลฯ)
3. **ตลาดความรู้และทรัพยากรภายนอก (External Knowledge & Goods Market):**
   - ขยายระบบตลาดให้พ่อค้าเร่ภายนอกรับซื้อและขายม้วนตำรับ คัมภีร์วิชา และวัตถุดิบระดับ Tier 1–5 ด้วยหินวิญญาณ
4. **ความสมบูรณ์ของแกนมนุษย์และเอนจิน (Human Core Integrity):**
   - ยึดตามมาตรฐาน Human Core Byte-lock Fingerprint `155:2f9c9dd7` สมบูรณ์ 100% พร้อม Deterministic Simulation Engine

---

## 📁 โครงสร้างโปรเจกต์ (Clean Project Layout)

```text
├── index.html                 # ตัวเกมเวอร์ชันหลัก (Modular Entry)
├── JianghuSect_single.html    # ตัวเกมรวมก้อนไฟล์เดี่ยวพร้อมเล่น (Standalone Bundle)
├── css/                       # สไตล์ชีท UI และ Layout มือถือ/เดสก์ท็อป
│   └── style.css
├── data/                      # ฐานข้อมูลตัวละคร ทักษะ วิชา อสูร และไอเทม
│   ├── data_core.js
│   ├── data_cult.js
│   ├── data_items.js
│   ├── data_bt.js
│   ├── data_cb.js
│   ├── data_cp.js
│   ├── data_tech.js
│   ├── data_beasts.js
│   └── data_expansion.js
├── js/                        # ระบบจำลอง Logic, AI, ตลาด, ต่อสู้ และ UI
│   ├── util.js
│   ├── human_core.js          # [Byte-Locked] Fingerprint 155:2f9c9dd7
│   ├── world_map.js
│   ├── cultivation.js
│   ├── economy.js
│   ├── sect.js
│   ├── ai.js
│   ├── combat.js
│   ├── expedition.js
│   ├── explore.js
│   ├── bottleneck.js
│   ├── skills.js
│   ├── stats.js
│   ├── cpeco.js
│   ├── external_market.js
│   ├── content.js
│   ├── sim.js
│   ├── render.js
│   ├── ui.js
│   └── main.js
├── test/                      # ชุดทดสอบ Regression และความสมบูรณ์ของระบบ
├── tools/                     # สคริปต์ Build ตัวเกม Standalone
│   └── build_single.js
└── .gitignore                 # กำหนดข้อยกเว้นไฟล์ Log และ Temp
```

---

## 🛠️ เครื่องมือสำหรับนักพัฒนา (Developer Commands)

- **รวมไฟล์เดี่ยว (Rebuild Standalone):**
  ```bash
  node tools/build_single.js
  ```
- **รันชุดทดสอบระบบ (Run Regression Suite):**
  ```bash
  node test/run_all.js
  ```
