# JianghuSect v2.0.2 — Elemental Roots & Combat Review Package

**วันที่ตรวจ:** 31 ตุลาคม 2026  
**Runtime:** `SIM.VERSION 1.10.11` · `SIM.PATCH_VERSION 1.12.7`  
**Elemental authority:** `ELEM.VERSION 2.0.1`

แพ็กเกจนี้เป็น working copy สำหรับพัฒนาต่อจากระบบรากวิญญาณและธาตุ ไม่ใช่โปรเจกต์ใหม่ และไม่ใช่สำเนาของ GitHub `main-1` ที่เก่ากว่า

ตรวจไฟล์และ SHA-256 ทั้งแพ็กเกจได้จาก `PACKAGE_MANIFEST.json`.

## เปิดเกม

- เปิด `JianghuSect_single.html` สำหรับเล่นแบบไฟล์เดียว
- โฟลเดอร์ `GAME_SOURCE/JianghuSect_v1.10/` คือซอร์ซเต็มสำหรับแก้ไขและทดสอบ
- อ่าน `HANDOFF.md` ก่อนรับช่วงงาน
- อ่าน `REPORTS/PATCH_1_12_7_IMPLEMENTATION_REPORT_TH.md` สำหรับการแก้ไขและหลักฐาน QA
- อ่าน `REPORTS/NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md` สำหรับประเด็นที่ยังต้องออกแบบ/พัฒนา

## สถานะการตรวจล่าสุด

- Parallel regression: **70/70 กลุ่ม PASS**
- JavaScript syntax: **140/140 ไฟล์ PASS**
- Native long simulation: **90 วัน PASS บนโค้ดล่าสุด** (การรัน 180 วันก่อนปรับ DOT/AI รอบสุดท้ายผ่านแล้ว แต่การรันซ้ำบนโค้ดล่าสุดเกินเวลาที่เครื่องมืออนุญาต จึงยังไม่รับรอง 180 วันสำหรับ revision สุดท้าย)
- Living beast/craft ecology: **90 วัน PASS**
- Standalone: 40 inline scripts, offline runtime, new-schema init/save-load PASS
- `js/human_core.js` SHA-256 ยังคงเป็น `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`
- Fingerprint: `155:2f9c9dd7`

## สิ่งที่เพิ่มใน patch 1.12.7

- ปรับอัตรารากเดี่ยว/คู่/สาม/สี่และ conditional grade cohorts ให้ความหายากจริงสอดคล้องกับช่วงเวลาที่แสดง
- ใช้ 390 ตัวละครที่ถูกสร้างต่อปีโลก โดยมีผลวัด 14 รอบเฉลี่ยรวม 386.43/ปี
- แก้ forced root grade slot mapping และ root-capacity traits
- เชื่อมธาตุกับความเสียหาย ความแม่นยำ การควบคุม DOT การร่ายต่อเนื่อง และ weapon resonance
- ให้สัตว์อสูร/ศัตรูจาก raid ใช้ element profile ของ species จริง
- เพิ่มการ retry DevTools WebSocket ใน Chromium test harness เพื่อให้ browser regression เสถียรขึ้น

## งานถัดไป

1. กำหนด neutral/support/opposition relation matrix อย่างชัดเจน
2. ทบทวน aggregate scalar grade และ consumer ที่เกี่ยวข้อง
3. กำหนด context ของ `ELEMENT_LINK_ONLY`
4. ออกแบบผลธาตุแยกสำหรับ heal/shield/support
5. เพิ่ม behavioral tests ของ NPC
6. ตรวจและ redesign ชื่อ/คุณสมบัติของ item, weapon, armor, technique, mantra, passive และ recipe ให้สอดคล้องกันทั้งระบบ

## ส่งต่อให้ Gemini

- อ่าน `PROMPT/GEMINI_COMMAND_TO_SEND.md`
- อ่าน `PROMPT/GEMINI_CONTINUATION_PROMPT_V2_0_2_EN.md`
- อ่าน `PROMPT/GEMINI_IMPLEMENTATION_PROMPT_EN.md` ฉบับเต็ม

**นโยบาย compatibility:** ไม่จำเป็นต้องรองรับเกมเวอร์ชันเก่าหรือ save เก่า ไม่ต้องสร้าง migration layer เพื่อรักษา old saves หากขัดขวางสถาปัตยกรรมใหม่ แต่ new game และ new-schema save/load ต้องถูกต้อง

## GitHub

Remote `main-1` ที่ตรวจเมื่อ 31 ตุลาคม 2026 ยังอยู่ที่ commit `e5e4f8ff5d111625dacf6c630434cbe2eba7428e` และ source patch 1.12.0 จึงเก่ากว่าแพ็กเกจนี้ (1.12.7) แพ็กเกจนี้ยังไม่ได้ push และไม่มี `.git` metadata ใน working copy นี้ ห้ามนำ remote branch เก่ามาเขียนทับแพ็กเกจปัจจุบัน
