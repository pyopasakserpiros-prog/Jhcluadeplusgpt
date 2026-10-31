# Decisions and known limitations

- Target vanilla JS, native W and locked155-axis HC retained. No framework dependency, source simulation engine, source player save or source art loaded.
- Original source ZIP is not nested: it contains an unrelated recovered player save and no general code/content redistribution license. Relevant original scripts/docs and non-save catalogues are retained; see provenance notice. Private reference retention is not a public redistribution grant.
- New specialization passives are native stat tradeoffs. Original source philosophy is preserved separately (`sourceStrengthTh`/`sourceWeaknessTh`), while UI describes implemented behavior. Full independent tracks/support passives remain deferred.
- Region ecology is a curated adaptation: source pools sometimes place ingredients in incoherent biomes. Resource amounts and thresholds are native early-game values; source coordinates, world-sized physics and costs are excluded.
- Craft cancellations consume already-reserved ingredients, matching baseline behavior. Stale receipts are pruned daily; no refund is created. No-context reserve/finish API remains for older tests/tools and consumes one unassigned reservation; native AI always uses actor-bound receipts.
- All relevant expedition resolution wrappers now guard completed settlements, including cave/realm and bottleneck bonuses. Unrelated existing one-off events remain their original native design, not a global event-sourcing rewrite.
- Whole-world future saves are not formally schema-negotiated. Unknown ordinary metadata is preserved; only same HC saves are supported. Old source-engine saves are incompatible.
- Existing save/continue reconstruction is not promised byte-identical for every NPC navigation/cache/bed trajectory. A known baseline divergence was temporary generated bed ownership; this patch clears occupancy before restoring saved ownership. Identity/inventory/RNG/season and receipt compatibility have explicit tests.
- Hidden/background browser elapsed time is now retained when callbacks resume; a long suspension can create a large visible backlog. Pausing/sheet pause stops new time accumulation, and speed0 freezes debt. Backlog drains within a12ms frame budget; selected speed describes requested rate, not guaranteed throughput.
- Real browser/rendering/touch/device tests were unavailable because Chromium was absent and its download did not produce a valid archive. Node DOM stubs validate HTML-string renderers, not visual layout or real touch behavior.
- High-speed correctness is covered by executing the real main-loop closure in a VM with controlled clock/work cost. This is not a Snapdragon8Elite benchmark. No actual48× throughput claim is made.

- Final long-run evidence:CP price reached its existing4.0 cap after two years in v110-seed3. Production/purchases/consumption continue, but wage/sink balance and surplus stock remain priority tuning; this patch does not claim perpetual economic equilibrium.

- v1.10.1 direct market is an autonomous simulation loop, not a manual player barter UI. Traders are represented by a map-side market marker and a detailed sect-panel card; they are not separate full Human Core NPCs. Only common materials/basic pills are automated trade goods; source-pack rare materials are excluded from trader stock and automated purchasing. One 90-day seed is smoke evidence only; multi-seed 360–720 day cash-runway tuning remains open.


## Elemental root/combat follow-up — 31 October 2026

- Active review package is v2.0.2 / `SIM.PATCH_VERSION 1.12.7` / `ELEM.VERSION 2.0.1`; `js/human_core.js` remains locked and byte-identical.
- Root rarity uses 390 generated-character appearances per world-year, supported by a 14-run pooled mean of 386.43; this is an expectation, not a cap or literal birth rate.
- Dual/triple/fourfold root rates and conditional grade cohorts are now explicit and tested.
- Human and foe direct combat use the elemental resolver; weighted weapon resonance, accuracy, control/rider probability, channel and DOT are covered.
- Remaining design decisions: neutral baseline classification; scalar aggregate grade; link-only context policy; heal/shield/support multipliers; foe types outside beast raids; NPC behavioral coverage; complete content coherence/rename pass.
- Old-save compatibility is explicitly not a requirement for future redesign. New-schema save/load integrity remains required.
- The GitHub `main-1` branch inspected on 31 October is older than the attached review package. The extracted working package has no Git metadata and has not been pushed. Do not overwrite it with the older remote source.
