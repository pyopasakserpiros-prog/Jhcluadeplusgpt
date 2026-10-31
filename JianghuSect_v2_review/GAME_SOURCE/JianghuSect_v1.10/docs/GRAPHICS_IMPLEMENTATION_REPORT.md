> Original Gemini report from the uploaded ZIP. Its claims and numbers are historical; see CODEX_COMBINED_PATCH_REVIEW_TH.md and CODEX_COMBINED_VERIFICATION.json for independent review and post-fix results.

# GRAPHICS_IMPLEMENTATION_REPORT — JianghuSect v1.12 Graphics, World Presentation & Mobile UI Overhaul

## 1. Executive Summary & Chosen Direction

This report documents the comprehensive **Graphics, World Presentation, Character Readability & Mobile UI Overhaul** implemented on top of the completed **NPC Life, Cognition, Relationships, Martial Progression & Sect Authority Overhaul** baseline (`JianghuSect_v1.10`).

### Chosen Visual Direction: **Direction A — Ink-Wash Jade Mountain Scroll**
- **Aesthetic Identity**: Inspired by classic Chinese青绿山水 (*qinglü shanshui* — mineral jade-and-ochre mountain-water scroll painting), featuring warm aged paper (`#f5eedc`), mineral celadon/jade roofs (`#3e7a6d`), dark pine lacquer UI panels (`#122824` / `#1c362f`), cinnabar wood pillars (`#a33b2e`), and restrained gold accents (`#e9cd85`).
- **Architectural Readability**: Replaced uniform rectangular brown roofs with distinct architectural families and functional silhouette props across all 25 `MAP.BTYPES`, plus bounded Lv.1 / Lv.2 / Lv.3+ upgrade stage markers.
- **Character & Portrait Identity**: Established a shared, deterministic, **renderer-owned visual profile (`this.apCache`)** used by both map sprites (`drawNpc`) and portraits (`R.portrait`) without mutating authoritative NPC objects (`n._ap` was eliminated) or calling mutating martial passive reconciliation (`drawLegendaryAura` now uses pure read-only `readOnlyActivePassives(n)`).
- **Performance & Quality Controls**: Introduced **Graphics Quality levels (`Auto`, `Low`, `Standard`, `High`)** and a **Reduced Motion (`ลดการเคลื่อนไหว`)** toggle, pre-rendered radial light sprites (`warmLightSprite`) with viewport culling for night scenes, and sensible DPR scaling (`1.5×` cap on large `>800k css-px` desktop viewports in `Standard` mode), cutting 100-NPC desktop `@2x` frame render times by **>12×** (`87.6 ms → 6.7 ms` day median; `114.9 ms → 7.2 ms` night+rain median).

---

## 2. Pre-Existing Issues, Newly Discovered Issues & Fixes

| ID | Category | Issue Found | Root Cause | Resolution Implemented |
|---|---|---|---|---|
| **GFX-01** | Simulation Purity / Determinism | `R.drawLegendaryAura` mutated authoritative NPC state during rendering (`n.passiveLoadout` and `n._passRec`). | `drawLegendaryAura` called `M.activePassives(n)`, which internally invokes `M.reconcilePassives(n)` and writes to `n`. | Implemented pure read-only `R.readOnlyActivePassives(n)` in `js/render.js` that inspects `n.passiveLoadout` and `n.cult.techs` without mutating `n`. Verified by `test/graphics_overhaul_suite.js`. |
| **GFX-02** | Simulation Purity & Stale Appearance Cache | `R.appearance(n)` mutated `n._ap` directly on the authoritative NPC object and never invalidated when age, rank, cultivation path, or equipment changed in the Edit Hub. | `if (n._ap) return n._ap;` cached appearance permanently on `n` with no state signature. | Moved caching to renderer-owned `this.apCache` keyed by `n.id` and validated against a live signature (`skinHex\|hairHex\|eyeHex\|hairStyle\|heightCm\|sex\|rank\|cultPath\|weaponType\|armorId`). |
| **GFX-03** | Incomplete Building Sprite Cache Key | `getBuildingSprite(b)` keyed only by `b.type + '|' + this.S`, ignoring `b.id` and `b.level`. | Upgrading a building or having multiple buildings of different levels shared a single stale Lv.1 sprite. | Keyed `this.buildingSprites` by `b.id + '|' + b.type + '|' + (b.level \|\| 1) + '|' + this.S` and rendered distinct Lv.1 / Lv.2 / Lv.3+ visual upgrades. |
| **GFX-04** | Night & Rain Frame Bottleneck (`114.9 ms` median at `1280×800 @2x`) | Night rendering created dozens of `ctx.createRadialGradient` objects per frame across all map buildings and lanterns without viewport culling. | Uncached per-frame gradient allocation + full-map iteration at full `2.0` DPR (`2560×1600` backing store). | Added pre-rendered `128×128` offscreen radial glow sprite (`warmLightSprite`), strict viewport culling (`hw + rr`, `hh + rr`), a 28-lantern visible cap, and a `1.5×` DPR cap on large viewports in `Standard` mode (`114.9 ms → 7.2 ms`). |
| **GFX-05** | Uniform Building Silhouettes | All closed buildings used the same brown rectangular roof (`#7c5638`) and identical box facade, distinguishable only by text labels. | `buildBuildingSprite` lacked per-building architectural styles or functional props. | Implemented `buildingStyle(b.type)` and custom architectural silhouettes/props for all 25 building types (`main_hall`, `scripture`, `alchemy`, `forge`, `canteen`, `infirmary`, `market`, `treasury`, `discipline`, `shrine`, `tea_garden`, `beast_kennel`, `puppet_workshop`, `talisman_room`, `training_ground`, `herb_garden`, `farm`, `mine`, `gate`, `quarters`, `elder_court`, etc.). |
| **GFX-06** | Generic Sword Prop for All Combat/Training | `drawProp` drew a generic straight sword for every fighting or training cultivator, even unarmed/palm cultivators or staff/spear/blade wielders. | `drawProp` did not inspect `n.equip.WEAPON` or `MARTIAL.gearType`. | Updated `drawProp` to render distinct silhouettes for `SWORD`, `BLADE`/`SABER`, `SPEAR`, `STAFF`, `DAGGER`, and glowing palm-qi rings for unarmed cultivators, plus props for new NPC social/mentoring actions (`giftItem`, `shareMedicine`, `flatter`, `guidedStudy`, `paidTraining`, `personalBrew`). |
| **GFX-07** | Chunk Seam Tree Clipping & Noisy Grass Specks | Tree canopies near chunk edges clipped cleanly along `16×16` chunk boundaries; individual grass blades were scattered across every grass tile. | `buildChunk` filtered `M.decor` strictly within `[x0, x0 + CH)` and drew grass blades on almost every tile. | Padded chunk decoration scan by 1 tile (`[x0 - 1, x0 + CH + 1)`), clustered grass tufts by low-frequency `meadowNoise` to leave calm open meadow space, and added neighbor-aware shoreline/road verges and a central plaza Bagua/Taiji stone medallion. |
| **GFX-08** | Continuous World Animation While Paused | Water ripples, smoke, and ambient motion continued animating at full speed when `G.speed === 0` because `this.t = time / 1000` used raw wall-clock `requestAnimationFrame` timestamps. | No separation between simulation animation clock (`animClock`) and UI selection pulse clock (`uiT`). | Added `this.animClock` (advances only when `!paused && !reducedMotion`) and `this.uiT` (for gentle selection ring feedback while paused), and throttled paused redraws in `js/main.js`. |

---

## 3. Deviation Register & Creative Contributions

### Deviation Register
- **No negative deviations from the prompt**: Every hard invariant (`js/human_core.js` SHA-256 lock, deterministic RNG/state separation, 6 main navigation tabs, speed controls `0..48×`, save/load compatibility, 24-cast cap, and all 59 prior test suites) was preserved without exception.

### Creative Contributions Grounded in Existing Mechanics
1. **State-Bound Architectural Activity FX**:
   - **Alchemy Hall (`alchemy`)**: Emits rising violet/gold spiritual vapor from its gilded gourd roof cupola **only** when `b.inside.length > 0` (an alchemist is actively working inside).
   - **Forge (`forge`)**: Emits warm forge hearth glow and rising charcoal smoke from its brick smelter chimney **only** when `b.inside.length > 0`.
   - **Canteen (`canteen`)**: Emits warm cooking steam from its kitchen roof vent **only** when `b.inside.length > 0`.
2. **Central Plaza Inlaid Bagua/Taiji Medallion & Training Ground Ring**:
   - The sect's central `plaza` features a carved stone double-ring Eight-Trigram (*Bagua*) medallion around the spirit fountain, and `training_ground` features an inlaid stone sparring ring with weapon racks and training dummies.
3. **Bespoke Inline SVG Iconography**:
   - Replaced generic emoji in the bottom navigation bar (`#hudBottom`), floating camera controls (`#fabs`), and top HUD resource pills (`#resRow`) with custom crisp inline SVG line-and-fill icons while retaining all Thai labels and test hooks.

---

## 4. Matched Before/After Visual Review (9 Scenarios)

All 9 matched before/after screenshots were captured deterministically via `node tools/capture_graphics_suite.js <before|after>` using seed `graphics-audit-20261030`:

| # | Scenario ID | Viewport / DPR | Before Path | After Path | Key Visual Improvements Verified |
|---|---|---|---|---|---|
| 1 | `01_mobile_360x800_overview` | `360×800 @2x` | `test/results/screenshots/before/01_mobile_360x800_overview.png` | `test/results/screenshots/after/01_mobile_360x800_overview.png` | Crisp jade-and-gold HUD pills with SVG icons, distinct Main Hall palace roof + dragon ramp, inlaid Plaza Bagua medallion, zero clipped Thai text, all 8 speed buttons (`⏸..48×`) and 6 bottom nav buttons fit cleanly. |
| 2 | `02_mobile_412x860_overview` | `412×860 @2x` | `test/results/screenshots/before/02_mobile_412x860_overview.png` | `test/results/screenshots/after/02_mobile_412x860_overview.png` | Balanced mobile overview framing Main Hall, Plaza, Discipline Hall, Scripture Pavilion, Shrine, and Tea Garden with distinct roof colors and silhouettes. |
| 3 | `03_mobile_412x860_detail_activity` | `412×860 @2x` | `test/results/screenshots/before/03_mobile_412x860_detail_activity.png` | `test/results/screenshots/after/03_mobile_412x860_detail_activity.png` | Close-up (`z=1.8`) showing Main Hall colonized facade, carved stone balustrade, plaque, upgraded character robes/sashes/headwear, and bottom selection card with sculpted portrait. |
| 4 | `04_mobile_412x860_character_sheet` | `412×860 @2x` | `test/results/screenshots/before/04_mobile_412x860_character_sheet.png` | `test/results/screenshots/after/04_mobile_412x860_character_sheet.png` | Upgraded oval portrait with path aura ring, clear Thai typography (`line-height: 1.45`), prominent current activity (`กำลังทำอะไร`) and cognition/intent (`หน้าที่และความตั้งใจ`) cards. |
| 5 | `05_mobile_412x860_sect_stock` | `412×860 @2x` | `test/results/screenshots/before/05_mobile_412x860_sect_stock.png` | `test/results/screenshots/after/05_mobile_412x860_sect_stock.png` | Clean storehouse filtering grid, reserve floor badges, and tabular numerals on mobile sheet. |
| 6 | `06_mobile_412x860_log_longname` | `412×860 @2x` | `test/results/screenshots/before/06_mobile_412x860_log_longname.png` | `test/results/screenshots/after/06_mobile_412x860_log_longname.png` | Long Thai technique names (`「มหาคัมภีร์เก้าสุริยันคุ้มชีพจรขั้นสูงสุด」`) and positional NPC/building links (`ไห่`, `เฟยเฟย`, `ตำหนักใหญ่`) wrap cleanly at `line-height: 1.5` with zero vowel/tone clipping. |
| 7 | `07_desktop_1280x800_day_overview` | `1280×800 @2x` | `test/results/screenshots/before/07_desktop_1280x800_day_overview.png` | `test/results/screenshots/after/07_desktop_1280x800_day_overview.png` | Full compound readability: imperial jade Main Hall, slate-indigo Scripture Pavilion, dark-iron Discipline Hall, gilded amber Shrine, celadon Tea Pavilion, bronze-green Alchemy Hall, and terracotta Canteen/Forge. |
| 8 | `08_desktop_1280x800_night_rain` | `1280×800 @2x` | `test/results/screenshots/before/08_desktop_1280x800_night_rain.png` | `test/results/screenshots/after/08_desktop_1280x800_night_rain.png` | Cohesive moonlight indigo tint with warm golden window light and cached radial lantern glow, maintaining full terrain and building silhouette legibility under rain. |
| 9 | `09_landscape_860x412_legendary_fx` | `860×412 @2x` | `test/results/screenshots/before/09_landscape_860x412_legendary_fx.png` | `test/results/screenshots/after/09_landscape_860x412_legendary_fx.png` | Distinct simultaneous legendary motifs (`legend_dugu_sword` 9-sword wheel, `legend_qiankun_taiji` rotating Yin-Yang diagram, `legend_dragon_palm` golden dragon) + passive aura ring (`LEG_PASS_MINGYU_IMMORTAL_QI`) with readable HP bars and nameplates. |

---

## 5. Actual Performance Comparison (Before vs. After)

Measured in Headless Chromium (`1280×800 @2x DPR`, 100 active living cultivators, seed `graphics-perf-100npc`) via `tools/capture_graphics_suite.js`:

| Metric (100 Living NPCs, `1280×800 @2x DPR`) | Pre-Graphics Baseline (`before`) | Post-Graphics Overhaul (`after`) | Delta / Improvement |
|---|---|---|---|
| **Simulation Tick Time (`simMsMedian`)** | `2.80 ms` | `3.00 ms` | Unchanged (~`2.8–3.0 ms` in Chromium) |
| **Day Frame Render Time (`drawDayMsMedian`)** | `87.60 ms` | **`6.70 ms`** | **13.1× faster (`-92.4%`)** |
| **Day Frame Render Time (`drawDayMsP95`)** | `120.30 ms` | **`14.80 ms`** | **8.1× faster (`-87.7%`)** |
| **Night + Rain Render Time (`drawNightRainMsMedian`)** | `114.90 ms` | **`7.20 ms`** | **16.0× faster (`-93.7%`)** |
| **Night + Rain Render Time (`drawNightRainMsP95`)** | `133.50 ms` | **`13.20 ms`** | **10.1× faster (`-90.1%`)** |
| **80-NPC Mobile Perf Suite (`test/browser_mobile_perf.js`)** | `2.85 ms/tick` (`87.7×` cap) | **`2.98 ms/tick` (`83.8×` cap)** | **PASS (`< 3.0 ms/tick` budget, 0 errors)** |

---

## 6. Verification & Test Suite Results

All **60/60 test groups** in `node test/run_all.js` pass (`test/results/assertions.json`):
- `node test/graphics_overhaul_suite.js` — **PASS** (verifies `js/human_core.js` SHA-256 lock, 120-tick `SIM.serialize(W)` and `W.rng` determinism with `R.draw` + `R.portrait` + `R.resize` + quality toggles enabled vs. headless, zero `_ap`/`_passRec` mutation on NPCs, weapon silhouette cache invalidation for `STAFF`/`SPEAR`/`BLADE`/`UNARMED`, building Lv.1/2/3 sprite cache keys, all 22 legendary motifs, 24-cast cap, and pause animation freeze).
- `node test/skill_visual_browser.js` — **PASS**
- `node test/outside_visual_browser.js` — **PASS**
- `node test/browser_mobile_perf.js` — **PASS**
- `node test/ui_content.js` — **PASS**
- `node test/input_cancellation.js` — **PASS**
- `node test/startup_ui.js` — **PASS**
- `node test/npc_life_authority_overhaul.js` — **PASS**

---

## 7. Remaining Limitations

1. **Software WebGL / Canvas2D Rasterization in Headless Containers**: In headless Linux containers without a hardware GPU, `1280×800 @2x` in forced `High` quality (`2560×1600` pixels) requires software pixel blitting; `Auto` and `Standard` quality cap large desktop viewports (`>800k css-px`) at `1.5×` DPR (`1920×1200`), achieving `6.7–7.2 ms` median frame times while keeping mobile `360×800` and `412×860` at full `2.0×` DPR.
2. **Procedural 2D Canvas Vector Art**: All buildings, trees, props, and characters are procedurally drawn on 2D Canvas rather than external bitmap sprite sheets so `JianghuSect_single.html` remains 100% self-contained (~`2.17 MB`) with zero external image fetches.
