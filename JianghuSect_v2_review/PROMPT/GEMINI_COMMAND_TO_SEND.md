# คำสั่งส่งงานให้ Gemini — JianghuSect v2.0.2

แนบไฟล์ ZIP **JianghuSect_v2.0.2** ให้ Gemini แล้วส่งคำสั่งต่อไปนี้

---

Use the attached `JianghuSect_v2.0.2` ZIP as the authoritative working package. Continue from its current source; do not start a new project and do not replace it with an older GitHub branch.

Verify `PACKAGE_MANIFEST.json` and its hashes first. Read `README_TH.md`, `HANDOFF.md`, `REPORTS/PATCH_1_12_7_IMPLEMENTATION_REPORT_TH.md`, `REPORTS/BALANCE_AND_RARITY_REPORT.md`, `REPORTS/NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md`, `PROMPT/GEMINI_IMPLEMENTATION_PROMPT_EN.md` in full, and `PROMPT/GEMINI_CONTINUATION_PROMPT_V2_0_2_EN.md`. Then inspect the actual source and tests before editing.

The task is to continue the current game with a careful, complete redesign of item/weapon/armor/technique/mantra/recipe coherence. You are authorized to improve display names, descriptions, properties, weapon requirements, elemental profiles, moves, effects, costs, cooldowns and NPC preferences where the source supports the change. Audit every relevant stable ID; do not make a superficial sample patch. Keep stable IDs unless a full reference migration is necessary. Preserve legendary identity and real unique-effect execution.

Also close or explicitly document the known elemental gaps: neutral relation classification, aggregate scalar grade consumers, `ELEMENT_LINK_ONLY` contexts, effect-specific heal/shield/support modifiers, foe element policy, NPC behavioral decision tests and performance profiling.

The current package already contains `SIM.PATCH_VERSION 1.12.7` and `ELEM.VERSION 2.0.1`. Its recorded baseline is 70/70 regression groups PASS, 140/140 JavaScript syntax files PASS, 180-day native simulation PASS, 90-day ecology simulation PASS and standalone verification PASS. Re-run these checks on your workspace; do not assume prior reports are proof of your new changes.

**Backward compatibility with older game versions and old save files is NOT required.** Do not waste effort preserving old saves or building old-save migration layers. Design the new system cleanly and efficiently. New-game creation, deterministic behavior, new-schema save/load, data integrity and offline standalone play must still work.

Do not modify `js/human_core.js`; its protected SHA-256 is `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542` and fingerprint is `155:2f9c9dd7`. If you prove it must change, stop and report the exact blocker before editing.

The GitHub `main-1` branch was checked and is older than this package (remote head `e5e4f8ff5d111625dacf6c630434cbe2eba7428e`; fetched source patch `1.12.0`). Do not overwrite this package with that older branch. Do not push or merge to `main` or `main-1`; return the complete source package for independent Codex review.

Take the time required. Update all relevant design/audit/roadmap/handoff documents, build the standalone HTML, run the complete regression suite and long simulations, and report exact evidence, deviations and remaining limitations. Never claim an unverified result.

---

**ไฟล์สำคัญใน ZIP**
- `PROMPT/GEMINI_IMPLEMENTATION_PROMPT_EN.md` — Master prompt ฉบับเต็ม
- `PROMPT/GEMINI_CONTINUATION_PROMPT_V2_0_2_EN.md` — งานต่อจากแพตช์ปัจจุบันและสิ่งที่ยังค้าง
- `HANDOFF.md` — สถานะล่าสุดและคำสั่งรับช่วง
- `REPORTS/` — รายงานตรวจสอบและผลทดสอบ
- `GAME_SOURCE/JianghuSect_v1.10/` — ซอร์ซเกมจริง
