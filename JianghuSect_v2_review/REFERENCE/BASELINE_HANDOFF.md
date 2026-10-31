# Current handoff — next Gemini implementation

**Active assignment:** Read [docs/NEXT_GEMINI_IMPLEMENTATION_PROMPT.md](docs/NEXT_GEMINI_IMPLEMENTATION_PROMPT.md) and implement it using this complete main-1 source.

Active source: `JianghuSect_v1.10/`. Playable standalone: `JianghuSect_v1.10/JianghuSect_single.html`.

The uploaded NPC, graphics and visitors/clues/legendary-weapons patches are integrated with six independently reproduced fixes. Read [the review](JianghuSect_v1.10/docs/CODEX_COMBINED_PATCH_REVIEW_TH.md), [verification](JianghuSect_v1.10/docs/CODEX_COMBINED_VERIFICATION.json), and [follow-ups](JianghuSect_v1.10/ROADMAP/COMBINED_REVIEW_FOLLOWUPS_TH.md) before further work.

The former NPC/graphics/visitor prompts describe work already delivered; do not restart them. Original Gemini reports are historical claims, not independent certification. Full regression passes do not establish every narrative/AI/combat behavior is correct. Main-1 is the development baseline. Preserve human_core.js byte-for-byte and continue from this complete source, retaining tests/reference files.


## Update (v1.12.2 Combined Review Follow-ups + Paginated Icon-Grid Inventory/Storage/Shop UI)
- Completed all 10 follow-up items in `JianghuSect_v1.10/ROADMAP/COMBINED_REVIEW_FOLLOWUPS_TH.md`.
- Added optional Paginated Icon-Grid UI (`grid` / `list`) and 64-cell Wuxia Item Sprite Atlas (`assets/wuxia_item_atlas.png`, `docs/ITEM_ICON_ATLAS_MAP.json`) for Personal Inventory, Sect Storage, and Sect Shop.
- Report: `JianghuSect_v1.10/docs/COMBINED_FOLLOWUP_AND_INVENTORY_UI_REPORT_TH.md`.
- Verification metrics: `JianghuSect_v1.10/docs/CODEX_COMBINED_VERIFICATION.json` (63/63 test groups passed, `js/human_core.js` SHA-256 unchanged).
