# GRAPHICS_CODE_MAP — Rendering Architecture, Event-to-Visual Mapping & Maintenance Guide

## 1. Rendering & UI Entry Points

| File | Key Module / Functions | Responsibility |
|---|---|---|
| `js/render.js` | `Render.create(canvas)` | Instantiates the world renderer `R` with chunk caches (`this.chunks`), building sprite caches (`this.buildingSprites`), renderer-owned appearance cache (`this.apCache`), transient cast effect map (`this.castActive`), pre-rendered warm light sprite (`this.warmLightSprite`), and separate simulation vs. UI clocks (`this.animClock`, `this.uiT`). |
| `js/render.js` | `buildChunk(R_, cx, cy, S)` | Renders a `16×16`-tile terrain chunk at scale `S` (`1` or `2`), including clustered meadow grass (`meadowNoise`), crenellated stone walls, cliff strata, neighbor-aware water/road verges, the central Plaza Bagua/Taiji stone medallion, 1-tile-padded terrain decorations (`drawDecor`), and outdoor station props (`drawStationProp`). |
| `js/render.js` | `buildingStyle(type)`, `buildBuildingSprite(b, S)`, `drawBuilding(ctx, b, hour, night)` | Renders distinct architectural families across all 25 `MAP.BTYPES`, Lv.1 / Lv.2 / Lv.3+ visual upgrade stages, night window illumination (`buildingWindows`), and state-bound active facility FX (alchemy vapor, forge hearth glow & chimney smoke, canteen cooking steam when `b.inside.length > 0`). |
| `js/render.js` | `R.appearance(n)`, `R.drawNpc(ctx, n, p, hour)`, `R.drawProp(ctx, n, act, sc, wType)`, `Render.portrait(cv, n, size)` | Computes and caches the shared character visual profile in `this.apCache` (keyed by live signature `sig`), draws layered wuxia robes/lapels/rank sashes/headwear on map sprites and oval portraits, and draws true weapon silhouettes (`SWORD`, `BLADE`, `SPEAR`, `STAFF`, `DAGGER`, or unarmed palm-qi) and activity props. |
| `js/render.js` | `R.readOnlyActivePassives(n)`, `R.drawLegendaryAura(ctx, n, r)`, `R.updateCastEffects(time)`, `R.drawCastEffects(ctx)`, `R.drawLegendaryCastMotif(...)` | Pure read-only inspection of active legendary passives and transient rendering of ordinary, forbidden, and 22 bespoke `legend_*` active skill motifs (capped at 24 simultaneous effects). |
| `js/render.js` | `R.resolveQuality()`, `R.updateAdaptiveQuality(drawMs)`, `R.isReducedMotion()`, `R.resize()` | Manages `auto`, `low`, `standard`, and `high` graphics quality tiers, DPR scaling (`1.0×` / `1.5×` / `2.0×`), adaptive quality hysteresis, and pause/reduced-motion animation clock freezing. |
| `js/ui.js` | `UI.icon(name)`, `UI.updateHud(force)`, `UI.rNpc()`, `UI.rMenu()`, `UI.applyOpts()` | Renders inline SVG resource icons in HUD pills, wires the Graphics Quality selector (`#gfxQualitySel`) and Reduced Motion toggle (`data-set="reducedMotion"`), and calls `G.R.invalidate()` after character/equipment edits. |
| `index.html` & `css/style.css` | `#hudTop`, `#hudBottom`, `#fabs`, `#sheet`, `#selInfo` | Defines the Ink-Wash Jade Mountain Scroll CSS tokens (`--bg`, `--panel`, `--panel2`, `--gold`, `--cinnabar`), 44–46px touch targets, inline `.svg-ic` icons, and Thai typography line-height (`1.45–1.5`). |

---

## 2. Simulation Event-to-Visual Mapping Table

Every visual effect on the canvas is strictly derived from authoritative simulation state without mutating simulation state:

| Simulation State / Event | Source Property | Visual Representation in `js/render.js` |
|---|---|---|
| **Building Upgrade Level** | `b.level` (`1`, `2`, `3+`) | Cached per `b.id\|b.type\|b.level\|this.S`: Lv.2 adds carved stone terrace balustrades, side eaves lanterns, and double roof ridges; Lv.3+ adds gilded roof ridge finials (`치미`), ceremonial banners, and ornate gold plaque frames. |
| **Building Construction** | `b.building` (`{ to, until }`) | Bamboo scaffolding overlay + progress bar (`1 - (b.building.until - W.t) / dur`). |
| **Active Facility Occupancy** | `b.inside.length > 0` | State-bound ambient FX: `alchemy` emits rising violet/gold spiritual vapor from its gourd cupola; `forge` emits hearth glow and charcoal chimney smoke; `canteen` emits white cooking steam; night windows illuminate warmly. |
| **Equipped Weapon Category** | `n.equip.WEAPON` via `MARTIAL.gearType` | `drawProp` renders distinct weapon geometry during `fight`, `train`, `guard`, and `patrol`: straight double-edged `SWORD` with tassel, curved single-edged `BLADE`/`SABER`, long red-tasseled `SPEAR`, wooden/jade `STAFF`, compact twin `DAGGER`, or glowing cyan/gold palm-qi rings when unarmed. |
| **NPC Activity (`n.act.id`)** | `n.act.id`, `n.act.stage` | Pose (`stand`, `sit`, `lie`, `bow`) + activity prop (`drawProp`: scroll for `study`/`guidedStudy`, hammer+sparks for `forge`, gourd/cauldron for `brew`/`personalBrew`, wrapped gift box for `giftItem`, medicine vial for `shareMedicine`, tea/bow for `flatter`) + overhead bubble (`drawBubble`). |
| **Active Skill Cast (`a.castFx`)** | `a.castFx` (`{ seq, t, kind, motif, fxKind, legendary, x, y }`) | Ingested once per `seq\|t` stamp into `this.castActive` (max 24 entries): renders directional slash/burst (`normal`), crimson-violet sigil (`forbidden`), or one of 22 bespoke `LEGENDARY_MOTIFS` (`legend_dugu_sword`, `legend_qiankun_taiji`, `legend_dragon_palm`, etc.). |
| **Active Legendary Passive** | `R.readOnlyActivePassives(n)` + `n.cult.mantra` | Draws a subtle ground-plane elemental/astronomic halo (`drawLegendaryAura`) beneath the cultivator without mutating `n.passiveLoadout` or `n._passRec`. |
| **Wild Resource Node** | `W.wildResources.nodes` (`remaining / initial`) | Category-specific flora (`herb_common` vs. `herb_rare` with deterministic petal/leaf geometry) or mineral crystal/vein clusters scaled by `remaining / initial` ratio (`drawWildResourceNode`). |
| **On-Map Wildlife Beast** | `W.wildlife.packs` / `W.foes` (`isBeast`, `family`, `tier`) | Distinct anatomical silhouettes per beast family (`SERPENT`, `AVIAN`, `ARTHROPOD`, `SHELL`, `PLANT_SPIRIT`, `URSINE`, `CANINE`/`FELINE`) with tier-6+ golden aura rings (`drawFoe`). |

---

## 3. Cache Ownership & Invalidation Policy

1. **Terrain Chunk Cache (`this.chunks`)**:
   - **Key**: `cx + ',' + cy` validated against `{ cv, rev: this.rev, S }`.
   - **Invalidation**: Cleared on `setWorld(W)`, scale `S` change (`1 ↔ 2`), season change (`W.season !== this.lastSeason` increments `this.rev`), or explicit `R.invalidate()`. Bounded to 180 chunks.
2. **Building Sprite Cache (`this.buildingSprites`)**:
   - **Key**: `b.id + '|' + b.type + '|' + (b.level || 1) + '|' + this.S`.
   - **Invalidation**: Automatically misses and builds a new sprite whenever `b.level` increases or `this.S` changes; cleared on `setWorld(W)`. Bounded to 64 entries.
3. **Character Appearance Cache (`this.apCache`)**:
   - **Key**: `n.id` validated against live signature `sig = skinHex|hairHex|eyeHex|hairStyle|heightCm|sex|rank|cultPath|weaponType|armorId`.
   - **Invalidation**: Automatically recomputes on the very next frame whenever any component of `sig` changes (e.g., equipping a weapon, advancing rank, changing cultivation path in Edit Hub, or aging into gray hair), and explicitly cleared on `R.invalidate()`. Never writes `_ap` onto `n`.
4. **Warm Radial Light Sprite (`this.warmLightSprite`)**:
   - Pre-rendered once (`128×128` offscreen radial gradient) and reused via `ctx.drawImage` with `globalCompositeOperation = 'lighter'` for all night building and lantern glows.

---

## 4. Graphics Quality Policies & Pause / Reduced-Motion Behavior

| Quality Tier | Resolution / DPR Policy | Lighting & Weather FX | Label & Aura Policy |
|---|---|---|---|
| **`auto`** (Default) | Selects `standard` by default (`high` on compact viewports with `<14 ms` draw time; downgrades to `low` only if steady-state draw exceeds `36 ms` for 45+ frames). | Full `standard` lighting and weather. | Standard zoom thresholds. |
| **`low`** (ประหยัดพลังงาน) | Caps DPR at `1.0×`. | Skips additive `lighter` night glow pass and halves weather particle counts (`22` rain / `16` snow / `8` petals). | Hides minor disciple labels until closer zoom (`z > 0.95`). |
| **`standard`** (มาตรฐาน) | Full `2.0×` DPR on mobile/tablet (`≤800k css-px`); `1.5×` DPR cap on large desktop viewports (`>800k css-px`). | Pre-rendered `warmLightSprite` night glow + viewport-culled lanterns (max 28) + `48` rain / `36` snow / `16` petals. | Nameplates at `z > 0.72` (leaders at `z > 0.50`). |
| **`high`** (คมชัดสูง) | Full `2.0×` DPR on all viewports. | Full additive night glow + `68` rain / `48` snow / `22` petals + full active facility vapor/smoke particles. | Nameplates at `z > 0.72` (leaders at `z > 0.50`). |

### Pause (`G.speed === 0`) and Reduced Motion (`G.opts.reducedMotion === true`)
- `this.animClock` (which drives water ripples, tree/herb sway, facility smoke, and idle breathing) **freezes completely** when `G.speed === 0` or `reducedMotion` is enabled.
- `this.uiT` continues to advance so the selected character/building highlight ring remains responsive when inspecting entities while paused.
- When `G.speed === 0`, `js/main.js` throttles idle canvas redraws to `120 ms` (`~8.3 fps`), saving CPU/battery while keeping camera pan/zoom and UI selection immediate.

---

## 5. Standalone Packaging & Maintenance Instructions

1. **Rebuild `JianghuSect_single.html`**:
   ```bash
   cd JianghuSect_v1.10
   node tools/build_single.js
   ```
   `tools/build_single.js` inlines `css/style.css`, all `data/*.js`, and all `js/*.js` into `JianghuSect_single.html`. Because all new icons are inline SVG and all world graphics are procedural 2D Canvas, zero external assets are needed.
2. **Capture Matched Before/After Screenshots & 100-NPC Benchmark**:
   ```bash
   node tools/capture_graphics_suite.js after
   ```
3. **Run Full Verification Suite (60 Test Groups)**:
   ```bash
   node test/run_all.js
   ```
