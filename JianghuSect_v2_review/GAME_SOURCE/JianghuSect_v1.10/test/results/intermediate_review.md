# Integration review

Read-only production review of `JianghuSect_v1.10`, 2026-10-27. No production files changed during this review.

The five requested tests passed: core_lock, cp_economy, craft_transactions (17 cases), content_expansion, and runtime_timing.

A full one-year seed1 simulation completed without crashes or recorded invalid numeric state. It ran 518,400 ticks, reached t = 1,037,160 / day 720, and ended with 62 living NPCs and 5 deaths. This passed the baseline's former crafting crash near day 229. Wall time was 129.228 seconds, recorded for reproducibility; it is not a device or speed-control benchmark.

The run gathered 191 regional materials, hunted 81 parts, completed 131 regional expeditions, and registered all 8 new formulas. All 9 imported manuals were in the library by the end. Two living NPCs had the Frost Moon subpath. At least 7 expansion recipe completions appear in the retained log window. CP minted/burned was approximately 102,535 / 78,240; the price index reached its cap of 4. See `integration_review_soak.log` for the original monthly output and full summary.

## Findings and verified corrections

1. Imported discovery manuals can be prelearned before exploration. `SIM.awaken` takes its repertoire candidates from all techniques at `js/sim.js:31`. Fresh seed `initial-manual-leak-7` starts a Frost Moon master with `SRC110_ART_V112_XIAN_MOON_MIRROR_T3`, while `contentSites` is empty and the library lacks that manual. Seeds ending in 11 and 18 likewise prelearn NW_ART_075 and NW_ART_047. The parent restricted the initial repertoire pool. The three reproducer seeds now contain no prelearned imported techniques; verified PASS.
2. Cave/realm resolution is not fully idempotent. The outer `X.resolve` in explore.js routes delve/realm directly to `EX.resolve`, bypassing the guarded native resolver. Calling the same settled delve twice grants merit twice and repeats encounters and logs. In the minimal reproduction, merit rises from 507 to 514, cave delves from 1 to 2, and log sequence from 3 to 4. CP and goods correctly remain unchanged because the new handover receipt catches the duplicate. The parent added a guard. Replaying the settled expedition now leaves merit, delves, CP, and log sequence unchanged; verified PASS.
3. Autonomous region selection can pick an empty relevant resource pool. Frozen has only hunt resources; volcano and ruins have only gather resources. `chooseRegion` still assigns positive weight to gather-in-frozen and hunt-in-volcano/ruins. These expeditions can discover formulas/manuals but waste their requested resource encounters. The parent filtered incompatible harvest destinations. A gather selection with only frozen available now returns null; verified PASS.

Reproduce these observations using `integration_review_repros.cjs` with `initial-manual`, `settled-exploration`, or `empty-pool`. The first two modes assert intended correctness and failed before fixes. All three now pass against the parent fixes; empty-pool confirms a null destination.

Generic native material and manual pools now exclude imported `sourcePack` records. Native farm/mine pools remain native hardcoded resources. Every imported recipe has a regional discovery route, and every input has a regional source. The year-long run confirms that these routes result in real acquisition and autonomous crafting.

After the parent fixes, the five requested tests were run again and all passed. The one-year run loaded code before these three review fixes and later UI/medicine completion; its trajectory belongs to that earlier integration snapshot. No browser or actual mobile performance claim is established by this review.
