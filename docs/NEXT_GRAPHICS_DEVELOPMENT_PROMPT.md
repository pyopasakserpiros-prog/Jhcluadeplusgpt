# ACTIVE FOLLOW-UP FOR GEMINI — JIANGHU VISUAL WORLD AND INTERFACE UPGRADE

Use this entire document as an implementation assignment. Read it before editing. Deliver a working visual upgrade, not just a proposal, mockup, recolor, or list of future tasks. The author delegates ordinary art, architecture and implementation decisions to you and explicitly permits better alternatives to the recommendations below. Codex will independently review the returned source later.

## 1. Continue the latest game in THIS conversation

You are continuing development in the same Gemini conversation that produced the preceding NPC patch. Your baseline is the newest complete, internally consistent source tree you have already produced here, including the NPC work, technique updates, fixes and tests. Do not replace it with an older GitHub download, the attached reference screenshots, or the code snapshot inspected by Codex. The author wants consecutive patches without an intermediate upload/review/download cycle.

Before editing:
- Identify the latest complete source artifact and its actual feature/version status. If previous work is incomplete, finish or reconcile it sufficiently to establish one coherent baseline; state what remains incomplete.
- Preserve the preceding NPC changes. Read earlier handoff documents as context; do not restart already completed assignments because HANDOFF.md or GEMINI_NEXT_TASK.md still points at them.
- Save a baseline copy or commit and run startup plus the relevant existing regression checks. Separate pre-existing failures from new regressions. Fix confirmed blockers; document unrelated defects rather than silently rewriting simulation systems.
- This graphics assignment is the next patch. It does not claim that the preceding NPC implementation has been reviewed or proven correct by Codex.
- If the latest source is genuinely unavailable in this conversation/tools, request that specific source. Never reconstruct missing work from imagination and claim it was preserved.

The supplied audit describes GitHub main-1 commit `7ebee20d07064837904b46b5221b960d9943f316`; runtime baseline there is `c0f277d8f3a48effe6f3d9c0d26ee79bd886e4a1`. These identifiers describe the inspected reference ONLY. Recheck interfaces against your newer code.

## 2. Creative authority and mandatory design challenge

You are both an implementation engineer and an art director. Assess whether these recommendations suit the actual current code, existing NPC patch, visual identity and mobile constraints. You may change composition, palette details, iconography, animation methods, renderer organization, implementation sequence and individual proposed features when you have a stronger coherent solution. You may invent additional improvements.

Do not treat examples as quotas or mechanically add every suggestion. Favor a finished, consistent result over many half-working effects. At the same time, do not use this freedom to reduce the assignment to CSS color changes or defer all substantial graphics work.

Create a concise internal design comparison before implementation: incremental Canvas evolution, a bounded asset-assisted Canvas approach, and a larger renderer migration. Choose and implement the most appropriate approach without waiting for author approval. The recommended default is to evolve Canvas 2D plus DOM, with cached procedural or small self-contained authored assets. A renderer migration needs a concrete benefit that outweighs integration/performance risk; do not migrate merely because WebGL or 3D sounds more advanced.

In the final report include a deviation register: recommendation, adopted/modified/replaced/deferred decision, what you actually changed, reason, tradeoff, affected files, and validation evidence. Add a section for your own creative contributions. Explain rejected ideas briefly where doing so helps the reviewer. Immutable safety and delivery constraints below still apply.

## 3. Verified reference: what ALREADY exists

Codex inspected the reference source and opened it in Chromium at 412x860 and 1280x800 CSS pixels, with DPR 2. The capture fixture used seed `graphics-audit-20261030`, master index 0, a paused three-NPC starting sect, manually set day/night time, and forced rain for one screenshot. These are controlled visual fixtures, not proof of natural rain, recruitment, combat, long-term behavior or physical-phone performance. Temporary welcome notifications were cleared for the final screenshots. Two welcome messages in preliminary captures came from restarting the fixture twice, not an established production defect.

Relevant existing code, subject to newer-source verification:
- `JianghuSect_v1.10/js/render.js`: approximately 1181 lines; procedural Canvas 2D, tile size 16, 16x16-tile cached chunks, cached building shells, camera transforms, interpolated NPC positions, world-to-screen/screen-to-world conversion and picking.
- `Render.create`, `setWorld`, `invalidate`, `resize`, `draw`, `getChunk`, `getBuildingSprite`, `pickAt`, `appearance`, `drawNpc`, `drawProp`, `portrait` are current integration points. Do not assume these names survived your patch.
- Terrain already has seasonal palettes, broad meadow variation, small vegetation, paved paths, water and edge accents. Trees, rocks, bamboo, stations and buildings already exist.
- Roofs already have curved eaves, tiles, trim, window lattices, shadows and some upgrade ornaments. Many buildings still share a broadly similar hall silhouette, differentiated partly by colors/labels.
- NPCs already have procedural hair/skin/size, cultivation-path robe colors, rank sashes/headwear, walking motion, sitting/bowing/lying states, injury marks, selection markers, action bubbles and some activity props. The result remains small/simple relative to the architecture; portrait and world representation differ in detail.
- Water animation, seasonal falling petals/leaves, rain/snow/fog, day/night tint and lighting already exist. Extend or improve them; do not announce them as newly invented features.
- There are 22 legendary visual motifs in the inspected renderer, cast observation/expiry, up to 24 active cast effects, load baselining, and selected/combat/practice/cultivation auras. Legendary effects must retain differentiated identities and correct activation rules.
- `js/main.js`: requestAnimationFrame loop, 4 base simulation ticks/second, 12 ms simulation work budget/frame, preserved accumulator debt, interpolated movement and reduced render frequency at high speeds. These are existing functional protections.
- `index.html`, `css/style.css`, `js/ui.js`: full-screen map/minimap, top date/speed/resource HUD, floating camera controls, six navigation entries, DOM bottom/side sheets and Thai content. Palette already uses dark jade, warm ivory and restrained gold. Repeating existing theme colors is not sufficient improvement.
- Mobile character panels are information-heavy and vertically long. Preserve useful information while improving grouping and navigation. Preserve Edit Hub, inventory/stock filters, linked reports, save/load, technique details and the preceding NPC patch's explanations.
- `tools/build_single.js` currently inlines linked CSS/scripts only. Adding images/fonts/SVG dependencies without extending packaging can break the standalone game.

See included reference PNGs and GRAPHICS_BASELINE_AUDIT.md. They are evidence of the older inspected baseline, not design assets to place over the actual game.

## 4. Product goals and visual direction

Deliver a cohesive, living Chinese wuxia/cultivation sect viewed from the existing overhead/raised-front 2D perspective. The player mainly observes autonomous people, inspects characters/buildings, reads reports, adjusts management/edit tools and watches a persistent world unfold.

Art direction proposal: illustrated mountain-sect diorama; ink-inspired contours, mineral greens, aged timber, slate/jade roofs, warm plaster, ivory stone and small cinnabar/gold accents. Use this as a coherent direction, not a demand to add a full-screen ink filter. Maintain clear silhouettes, restrained texture and readable Thai text. Preserve the game's identity while improving craftsmanship.

Priorities:
1. Make ordinary screenshots visibly better through environment, architecture and character work.
2. Make actual NPC activity and important state changes easier to understand visually.
3. Improve visual hierarchy and touch usability without losing management information.
4. Maintain smooth interaction and bounded graphics cost with up to 100 sect NPCs.
5. Preserve all simulation behavior unless a separately demonstrated bug requires a small documented correction.

Avoid generic dashboard styling, neon overglow, identical circles on every actor, unreadable tiny decorative text, inconsistent pixel/vector/photo styles, fake activity, permanent spectacle and excessive blur. Do not claim premium artwork if the output is simple primitives. Use coherent procedural illustration well if that is what your tools support.

## 5. Environment, composition and depth

Improve the existing environment meaningfully, keeping coordinates, walkability, destinations, building footprints, resource nodes and pathfinding correct.

- Give terrain a clear hierarchy: calm broad ground masses, legible routes/plazas, moderately detailed focal areas, quieter background. Avoid repetitive tile grids or equally dense noise everywhere.
- Improve edges where paths meet grass, water meets land, forest meets clearings and buildings meet ground. Use cached detail or neighbor-aware treatment where appropriate. Handle map edges and cross-chunk seams.
- Organize perceived vegetation into plausible clusters/groves with open negative space and useful landmarks; do not introduce collision obstacles as a cosmetic side effect. Purely decorative foliage must not impersonate harvestable resources.
- Add depth with consistent contact shadows, roof/wall value separation and restrained overlap. Keep the overhead navigation readable. Do not apply costly full-screen blur or per-entity shadows blindly.
- Improve water banks/reflections/ripples selectively. Decorations must not imply an actual collectible, hazard or functioning building that does not exist.
- Add subtle environmental life where helpful: banner/leaf movement, thin chimney smoke at active facilities, small water motion. Use bounded reusable effects and distance/quality gating.
- Reconcile foliage/building/NPC occlusion. Large decorations currently partly live in chunk caches: investigate whether they need split ground/canopy passes or selective foreground handling. Do not assert an occlusion bug without reproducing it. Prioritize selected NPC visibility without x-ray revealing hidden actors.

You may revise decorative placement if deterministic and compatible with old maps. Do not regenerate a saved world's functional map or alter routes/resources merely to improve composition.

## 6. Distinct building identities and upgrades

Inventory the actual building types and supported upgrade levels. Provide purposeful variation for the full existing set using a manageable family system plus identifying details.

Suggested vocabulary, adapt to actual facilities:
- Main hall: ceremonial entrance, layered roof silhouette, orderly forecourt, modest authority symbols.
- Library: scroll/book motifs, quieter facade rhythm, readable plaque icon.
- Forge/alchemy/kitchen: identifiable workspace forms and state-bound heat/smoke; no production effect while inactive or under construction.
- Infirmary: calm light material and medicine motif; avoid generic modern hospital imagery.
- Storehouse/market: crates, awnings, shutters, loading space; show real stock/transactions only when supported, otherwise keep props generic.
- Residences: smaller domestic details, varied but coherent roof segmentation.
- Training/meditation/prayer areas: ground pattern/equipment/altar silhouettes reflecting existing mechanics.

Buildings should be recognizable at normal camera zoom without relying solely on labels. Use shape, massing and functional props, not color alone. Ensure all existing types have valid output, including small structures and special sites.

Reflect upgrades with bounded visual stages. A high level need not add another roof on every level. Do not change facility max levels, capacity formulas or the 100-member cap. Construction visuals must match actual construction state. Cache keys/invalidation must account for every mutable input affecting the cached image, including scale, style stage and changed state. Avoid stale images after upgrades, load, theme/quality changes or resize.

## 7. Characters, equipment and animation

Improve NPC individuality and action readability while supporting a population of 100:
- Keep stable appearance derived from existing character identity/body data. Share a small visual descriptor between world sprites and portraits so recognizable hair/skin/robe details agree.
- Use restrained layering: robes, sleeves, sash, hair/headwear and held equipment. Improve silhouette and pose quality without forcing a huge sprite sheet for every NPC.
- Preserve Thai names and titles. Make selection/follow markers legible and unobtrusive at all zooms. Prioritize selected actors when labels collide; keep distant overview markers useful.
- Respect real equipped weapon types. Current drawProp often draws a generic blade-like prop for practice/fight/guard: map actual equipment categories to meaningful silhouettes, with a safe fallback for unknown items. Unarmed or non-blade builds must not automatically appear to carry swords. Do not change combat rules to fit the drawing.
- Define a compact animation vocabulary for locomotion, cultivation, practice, reading, work, eating/resting and social interaction. Reuse pose layers sensibly and preserve movement interpolation and facing.
- Prefer context-sensitive short motion over permanent bobbing everywhere. Use real act IDs, phases, targets, actual equipped items and observed events. Do not make every NPC perform the same arm motion at the same instant.
- Ensure UI edits to appearance/equipment/rank invalidate relevant visual caches; existing `_ap` caching deserves verification. Keep new visual caches renderer-owned when possible instead of polluting serialized NPC state.
- Unknown, dead, away, hidden, exiled and newly spawned/despawned actors must be handled safely using current visibility rules. Cosmetics must not reveal hidden stats, latent talent/PA, secret motives or unavailable knowledge.

## 8. Show the preceding NPC patch through real visuals

Inspect what your NPC patch ACTUALLY implements, then connect representative behaviors to visual feedback.

Examples: two people stopping to talk; a teacher demonstrating to a student; a registered party walking together; a worker using the appropriate station; an official delegating or handing over an item; someone resting after injury. Use existing act/event/party/transaction data. A brief gesture, prop, stance or contextual icon is often enough.

Requirements:
- Create an activity-to-visual mapping table covering supported behaviors and fallback states.
- Friendship, orders, item handoffs, flattery and mentoring are not permission to invent events for decoration. Show them only when a corresponding committed interaction exists and the player is allowed to observe it.
- An item handoff effect never transfers the item itself. A forge spark never creates an item or consumes materials. A training animation never awards experience.
- Do not force NPC positions, cancel tasks, retarget AI or create fake crowds to make a screenshot lively.
- If a requested behavior is unsupported, give it a truthful fallback and list the missing semantic integration. You may add a small read-only presentation event hook where justified; keep behavior changes explicit and tested.
- Notifications should be concise and actionable. Suppress repetitive low-value spectacle while preserving the full inspectable event log and existing entity links.

## 9. Lighting, seasons, weather and atmosphere

Refine the existing implementation rather than stacking duplicate systems.

- Improve dawn/dusk and nighttime value structure while keeping people, paths and selected targets readable. Night should feel different without making inspection frustrating.
- Light sources should correspond to real lamps/buildings/conditions where known. Cache reusable light masks where beneficial; cull offscreen sources and cap overlapping glows.
- Seasonal changes should be coherent across vegetation, terrain and atmosphere. Keep scarce/special resources distinguishable from seasonal decoration.
- Improve rain/snow/fog tastefully, with world-space/screen-space behavior chosen deliberately. Limit visibility obstruction and avoid particle spawning proportional to uncapped DPR or simulation speed.
- Use the existing world's season, time and weather as inputs. Do not independently roll weather, alter yields or add gameplay hazards in a graphics patch.
- Motion policy: by default, freeze action/cast/world animation when the simulation is paused, while UI focus/feedback remains usable. A deliberately moving ambient layer is acceptable if clearly documented and consistent. Reduced-motion should give a readable static alternative, not merely hide useful state.
- Handle tab visibility, resume and long frame gaps without effect explosions, replay storms or excessive catch-up animation.

## 10. Combat and legendary art presentation

Preserve technique identity, current combat outcomes, passive eligibility, source pools, tier/grade definitions and multi-move progression. This patch is not a balance rewrite.

Audit all existing legendary motif routes against actual data; preserve working motifs and fix demonstrated routing/visibility errors. Strengthen their visual signatures where needed rather than replacing every legendary art with a colored ring.

Ideas, not mandatory literal depictions: directional sword intent; a short curved palm-pressure silhouette; a clean single dagger glint; a taiji counter-motion disc; restrained frost-jade shimmer; warm solar arcs; an orbiting sword-intent motif. Distinguish weapon trail, contact flash, defensive stance and persistent active aura. Generic/unknown motifs need a safe fallback.

Effects must originate from authoritative successful cast/state events, use stable actor/sequence identity and expire. No effect for an unlearned/dormant passive, rejected action, stale saved event or unseen offscreen secret. Entering the viewport must not replay a backlog. Preserve the existing 24-cast cap or justify and benchmark an alternative; also bound persistent auras, emitted particles, text and event-history caches. Essential hit/selection information must remain recognizable in low quality and reduced-motion modes.

Avoid flashing whole-screen white, violent camera shake and covering combatants with large opaque shapes. Direction and target should stay understandable at normal zoom.

## 11. HUD, panels and Thai typography

Use DOM for text-heavy interfaces and canvas for the world unless a measured alternative is stronger. Build on the current theme and controls.

- Preserve all six main destinations, speed options 0/1/2/4/8/16/32/48, camera controls, minimap navigation, character follow, linked logs, Edit Hub, stock/inventory browsing, game tools and save/load/import/export.
- Make the hierarchy coherent through CSS tokens for material/color/type/spacing/borders/elevation. Reserve gold for selection/importance; avoid outlining everything equally.
- Protect the playfield. Collapse secondary information contextually; retain fast access to core controls. A management game can need denser UI than an action game, so measure readability and interaction rather than chasing an arbitrary empty-screen percentage.
- On mobile, improve crowded HUD, toast placement and sheet presentation without squeezing Thai text into tiny labels. Keep active speed unambiguous. Allow sensible wrapping/scrolling within the appropriate component, never accidental page-wide horizontal overflow.
- Character panels: improve portrait/header hierarchy and grouping of current activity, role, goals, needs and details from the latest NPC patch. Put secondary details behind tabs/expansion while keeping them accessible. Do not hide blocked goals or negative outcomes to make the page prettier.
- Inventory/storehouse/techniques: consistent item identity icons, quantity/quality/tier distinctions, selected/disabled states and readable details. Keep filters, sorting and transaction controls functional.
- Replace inconsistent emoji in key interface/world roles with a small coherent inline SVG/procedural icon family where practical. Text labels remain authoritative; uncommon content can retain a readable fallback. Decorative icons must not be the only accessibility label.
- Thai combining marks must not clip. Test realistic long names, item names, numbers and titles. Use available offline-safe fonts; bundle any new font legally and include it in standalone packaging. Never require a remote font service to read the game.
- Prefer approximately 44 CSS-pixel main touch targets when feasible. Keep keyboard focus visible, buttons named, status legible without color alone and contrast suitable for small text. Honor safe areas, reduced motion and portrait/landscape resizing.
- Ensure bottom navigation does not block the bottom of scrolling sheets or important action buttons. Stop canvas pan/zoom when interacting with overlaid controls; do not regress pointercancel or pinch handling.

## 12. Renderer architecture and immutable constraints

Never modify `JianghuSect_v1.10/js/human_core.js`. Reference SHA-256 is `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`; compare the latest supplied file and report discrepancies before proceeding. Preserve its fingerprint and dimensions. Do not replace the file from an older version to make the hash pass.

Separate authoritative simulation state from presentation. Rendering, portraits, resizing, inspecting, changing graphics settings and idling at pause must not consume gameplay RNG, advance ticks, grant stats/items, mutate relationships/goals or change decisions. Be particularly careful calling helpers that lazily reconcile skills/passives or populate NPC state during drawing. Cosmetic randomness must use stable hashes or a separate visual generator. Visual allocation order must not influence simulation order.

Use current camera transforms consistently. Anchor shadows/props to the same interpolated actor position. Keep picking aligned with visible entities, especially after zoom, DPR changes and larger art bounds. Do not enlarge interactive hit areas so much that neighboring actors/buildings become impossible to select.

Reuse chunk caching, building caches and culling where appropriate. Cache immutable art; keep genuinely animated state outside static caches. Investigate crop padding, decorative spill across chunks, upgrade changes, seasonal invalidation and old-cache eviction. Bound GPU/CPU memory and persistent maps. Avoid giant canvases for the entire world at maximum zoom/DPR.

Adding helpers/modules is allowed. Keep dependencies lightweight, offline-compatible and maintainable. No mandatory framework/engine rewrite, CDN, network API, backend, remote asset generation or cloud inference while playing. Avoid broad module renaming or source reformatting unrelated to the patch.

Preserve save compatibility, source layout, simulation timing, accumulator debt, source pools, facility capacity, ownership, economy and latest NPC logic. Store graphics preferences safely with defaults/migration; renderer caches and in-flight effects should not inflate saves. If a genuine simulation bug is fixed, isolate it, document the reproduction and add a relevant regression test.

## 13. Quality levels and measurable performance

Implement a small understandable graphics setting, e.g. Auto / Low / Standard / High, unless a simpler tested system is better. Persist user preference; show effective quality when Auto differs. Manual choices should be respected.

Quality can change DPR cap, decorative density, animation cadence, light complexity, secondary particles and detailed foliage. It must not change simulation speed, visibility permissions, NPC decisions, actual entities/resources or item outcomes. Low quality remains visually coherent and preserves essential feedback. Avoid continuous oscillation: use warmup, sustained measurements and hysteresis if adaptive quality is implemented.

Performance targets are engineering goals, not unmeasured promises: responsive camera/UI, approximately 60 FPS at ordinary speed on suitable desktop hardware and a stable usable 30 FPS or better on a representative midrange mobile device where available. Report actual environment. Desktop mobile emulation does not establish real-phone FPS. At high simulation speeds preserve honest time/debt behavior; never drop simulation ticks to inflate FPS.

Measure baseline and after in the SAME environment/scenario, after cache warmup and over a meaningful interval. Separate simulation ms/tick, renderer/frame time, frame interval, effective ticks/sec, accumulator debt and DOM refresh cost. Summarize median/p95 where meaningful, not just one fastest sample. Avoid claiming an arbitrary headless machine represents all devices.

Benchmark ordinary play and a controlled 100-member workload, dense visible activity, rain/night and representative legendary FX. Use legitimate fixtures, clearly labeled; also watch some ordinary autonomous play. Document effect/cache caps and asset/standalone file-size changes. Run repeated load/new-world/zoom/quality cycles to check sustained cache growth.

## 14. Verification and acceptance

First map existing tests against the latest source. In the inspected reference, relevant suites include `core_lock`, `standalone`, `browser_mobile_perf`, `gesture`, `input_cancellation`, `skill_visual_browser`, `skill_visual_events`, `outside_visual_browser`, `onmap_wildlife`, `ui_content`, `save_integrity`, `runtime_timing`, and `test/run_all.js`. Some tests run through the aggregate runner, others separately. Preserve equivalent coverage when intentionally changing layout or APIs; do not delete assertions to make the patch pass. Retain new tests from the preceding NPC patch.

Required verification, to the extent tools actually permit:
1. Source startup and rebuilt standalone startup with no uncaught runtime errors or missing assets. Test the standalone with networking blocked; if possible open directly via file:// as well as HTTP.
2. Capture matched before/after screenshots: 360x800 and 412x860 mobile, 1280x800 desktop, plus a landscape orientation. Include overview, close-up architecture/NPC activity, day/night/weather, character sheet, inventory/stock, a long-name/log case and representative legendary visuals. Same seed, state, camera, tick and UI state for comparisons; label forced fixtures. Keep a screenshot manifest.
3. Verify pan, pinch, wheel, minimap, follow, selection/deselection, UI overlay input isolation, pointer cancellation, safe areas, all navigation/speed controls and no horizontal overflow. Resizing must preserve sensible camera/picking and regenerate correct-resolution art.
4. Compare simulation outcomes with rendering enabled/disabled and different visual options for a fixed number of authoritative ticks, starting from identical serialized state. Use controlled SIM.tick calls rather than equal wall-clock duration. Compare gameplay RNG and canonical state fields, accounting explicitly for legitimate runtime timing metadata and callbacks. No divergence caused by drawing, portraits or settings.
5. Exercise graphics toggles, reduced motion, pause/resume, load baselining, despawn/death and offscreen reentry. Verify cast deduplication/expiry/caps, active-only passives and no historical replay. Compare a representative group of legendary motifs; validate routing for the complete existing motif catalog.
6. Check appearance/gear/rank/upgrade changes, changed world/season, cache invalidation, cross-chunk edges, negative camera bounds, minimum/maximum zoom and DPR variants 1/2/3. High DPR does not require full-resolution expensive effects.
7. Run the full existing regression runner and relevant added graphics tests. Provide actual commands, environment, exit status and concise failure details. Keep meaningful assertions; never fabricate test files/results or report unexecuted tests as PASS.
8. Run a finite before/after performance workload with 100 NPCs. If source changes accidentally affect NPC/economy decisions, investigate before release and run focused behavioral regression. A graphics-only patch does not need fake multiyear balance claims.

Automated assertions cannot determine aesthetic quality alone. Inspect screenshots yourself, check motion, and compare recognizable improvements across environment, architecture, characters and interface. A recolor alone fails the intended scope. If browser/tools are unavailable, state exactly what could not be verified, still deliver runnable complete artifacts, and provide concrete manual reproduction steps; do not claim visual validation occurred.

## 15. Execution sequence and completion discipline

Work autonomously through the full patch in this conversation:
A. Establish newest-source baseline, inspect and record design choice plus risk points.
B. Implement coherent terrain/architecture improvements and character/portrait/equipment vocabulary.
C. Integrate truthful activity presentation, atmosphere and refined combat/legendary visuals.
D. Refine HUD/panels/icons/Thai readability and quality controls.
E. Verify behavior, controls, screenshots, offline packaging and performance; fix regressions.
F. Return the complete updated game and review evidence.

You may change the sequence if the actual architecture suggests a better order. Keep the change set reviewable. Do not stop after the plan, request permission for routine choices, or deliver only the first decorative subsystem. If output/tool limits force a real limitation, prioritize a coherent playable result, document unfinished scope honestly and never label it complete.

## 16. Required handoff artifacts

Return these as downloadable files/artifacts where supported:
- Complete updated source ZIP containing the latest NPC patch PLUS this graphics patch, all data/source/tests/tools and required source-reference inputs. Preserve files your current ZIP packaging might otherwise omit. Exclude node_modules, caches, secrets, obsolete game archives and duplicate version trees.
- Rebuilt offline `JianghuSect_single.html` with every required visual asset embedded or a genuinely self-contained equivalent. Extend the build pipeline to inline new asset/font references rather than hand-editing only the generated HTML. Keep modular source runnable too.
- Portable patch/diff relative to the latest pre-graphics baseline. No machine-absolute paths. Include new files and deletions, with a baseline identifier or archive hash.
- `GRAPHICS_IMPLEMENTATION_REPORT.md`: chosen direction/architecture, implemented scope, pre-existing/new/fixed issues, deviation register, creative contributions, actual test results, visual review, performance comparison, artifact sizes and remaining limitations.
- `GRAPHICS_CODE_MAP.md`: rendering/UI entry points, added modules, event-to-visual mapping, cache ownership/invalidation, quality policies, packaging and maintenance instructions.
- Screenshot evidence and manifest with viewport/DPR/seed/state/camera/settings. Include timing/performance measurements in a reusable small JSON/CSV or report table if available.
- `CODEX_GRAPHICS_REVIEW_HANDOFF.md`: newest baseline and returned artifact checksums, exact verification commands, risky areas, any gameplay corrections, known unfinished work and how to reproduce it.
- Updated HANDOFF.md and next-task pointers that describe actual completion state. Preserve the earlier NPC report as historical evidence; avoid leaving obsolete instructions marked ACTIVE. Distinguish planned roadmaps from implemented mechanics.

The author will later send this combined source to Codex for review. Do not push/merge main or main-1, overwrite GitHub branches, or claim Codex approved the patch. If working only in chat, explicitly say there was no Git commit/push.

Final response: identify the delivered game/source artifacts first, summarize visible improvements, list major deviations and real verification status, and link the reports. The value of this assignment is an improved playable game with trustworthy evidence, not an impressive description.
