# Graphics baseline audit for the Gemini follow-up

Date: 2026-10-30 UTC. Inspected reference: main-1 `7ebee20d07064837904b46b5221b960d9943f316`. Runtime integration base: `c0f277d8f3a48effe6f3d9c0d26ee79bd886e4a1`.

This is a source and screenshot inspection, not a graphics implementation or full regression review. The newer NPC patch under development in the user's Gemini conversation was unavailable for this inspection. Gemini must preserve that newer patch and adapt the accompanying graphics assignment to its real interfaces.

## Directly inspected

- `JianghuSect_v1.10/js/render.js`: Canvas 2D world, cached terrain/buildings, camera/picking, procedural characters/portraits/activity props, weather/night/season effects, 22 legendary motifs and bounded cast observation.
- `js/main.js`: animation/tick scheduling, camera gesture plumbing, minimap, graphics option defaults and persisted world binding.
- `js/ui.js`, `css/style.css`, `index.html`: Thai DOM HUD/sheets, six navigation destinations, character panel, jade/ivory/gold theme and responsive rules.
- `tools/build_single.js`: inlines CSS and scripts; no general external-image/font embedding pipeline in the inspected implementation.
- Existing browser, cast visual, input cancellation, aggregate regression and mobile/performance test source. Reading a test is not executing it.

## Observations from actual browser captures

The existing aesthetic is already a coherent light-green garden/sect illustration, with tiled teal roofs, pale timber/plaster walls, readable paths, seasonal vegetation, tiny procedural people and dark-jade interface surfaces. Night/rain, window lighting, shadows and activity/selection affordances already exist. A future report should call refinements refinements.

Architecture has more detail than the characters. Multiple functional buildings retain similar long-hall geometry; typography and labels carry part of their identity. Some small objects and characters become visually subordinate to large buildings. The mobile character sheet contains useful but lengthy stacked content and tabs. Opportunities are stronger building silhouettes, more recognizable character/gear/pose vocabulary, spatial/material coherence and improved information hierarchy. These are design judgments, not reproduced runtime defects.

The audit did not establish that the renderer is at its technical limit. Canvas caching, bounded effects, semantic activity presentation and selective authored assets offer room for improvement without an engine migration. A migration remains a tradeoff to evaluate against the newer actual source.

Potential risks for Gemini to reproduce/check, not asserted defects: appearance caching after editor changes; foreground canopy occlusion; decoration spill at chunk borders; mutable building-style cache inputs; simulation helper side effects when queried by drawing; new assets omitted from standalone packaging.

## Executed capture procedure

Chromium through Playwright, system `/usr/bin/chromium`, headless, DPR 2. Modular `index.html` served through a temporary loopback HTTP adapter; this was not an offline standalone packaging test. Started a game, replaced it with seed `graphics-audit-20261030`, master index 0, paused simulation, set time to tick 600. Three initial NPCs. Renderer canvas at mobile resolution was 824x1720 backing pixels for 412x860 CSS pixels. Clean captures removed temporary welcome toasts so they would not obscure the composition. No uncaught page errors were collected during these captures.

The fixture initially invoked game creation twice, producing two welcome notifications. This is a capture artifact and is not evidence of duplicate-notification behavior in ordinary startup. Final included screenshots omit those notifications.

Screenshots included in the downloadable graphics brief ZIP:

| File | CSS viewport | Fixture |
| --- | --- | --- |
| `reference/mobile-overview.png` | 412x860 | Day, camera focus tile 118,70, zoom .72 |
| `reference/mobile-detail.png` | 412x860 | Main hall center, zoom 1.8 |
| `reference/mobile-character.png` | 412x860 | `UI.openNpc` on first current NPC; day |
| `reference/desktop-day.png` | 1280x800 | Day, camera focus tile 118,70, zoom .85 |
| `reference/desktop-night-rain.png` | 1280x800 | Same camera, time tick 1320 and forced rain |

Mobile screenshots use a touch-enabled mobile context. Desktop screenshots resize the same context, so they are viewport references, not a separate desktop-device compatibility certification. Seasons and other state were not advanced through a natural simulation lifecycle. Reference images describe the older inspected source, not the unseen newer NPC patch. They are not new game art or target mockups.

## Limits and verification of this delivery

No gameplay code, CSS, data or generated standalone was changed for this document delivery. No full regression suite, long-term simulation, combat animation review, 100-NPC renderer benchmark, 360px/landscape capture or physical-mobile test was executed in this audit. Required future validation is specified in NEXT_GRAPHICS_DEVELOPMENT_PROMPT.md.

The locked human core's inspected SHA-256 remains `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`.

The accompanying prompt explicitly authorizes Gemini to improve the proposed design, requires a deviation/creative-contribution report, and continues its latest in-chat work. The existing main-1 NPC handoff remains active for users downloading that older runtime; this graphics brief is a follow-up instruction for the ongoing Gemini conversation.
