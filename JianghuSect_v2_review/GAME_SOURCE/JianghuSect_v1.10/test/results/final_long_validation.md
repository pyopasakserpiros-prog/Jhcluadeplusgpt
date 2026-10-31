# Final long simulation validation

All three final simulations passed after the regional-beast raid filter fix. Runs executed sequentially using complete native ticks. No assertions or runtime errors occurred.

| Seed | Days | Ticks | Population | Deaths | CP minted / burned | Price | Save bytes |
|---|---:|---:|---:|---:|---:|---:|---:|
| v110-seed1 | 360 | 518,400 | 52 | 3 | 76,016 / 63,491 | 2.176 | 1,715,435 |
| v110-seed2 | 360 | 518,400 | 55 | 1 | 76,189 / 58,812 | 2.176 | 1,770,002 |
| v110-seed3 | 720 | 1,036,800 | 74 | 8 | 198,206 / 172,832 | 4.000 | 2,614,671 |

Total: 2,073,600 native ticks across 1,440 simulated days, with 48 monthly observations.

Daily checks covered numeric NPC state, CP, inventory, regional supply, history length, and active craft reservation bounds. Each run registered all 8 imported formulas. Library imported-manual counts at the last monthly checkpoint were 8, 9, and 9.

Actual output production covered 5 of 8 imported recipes: 001, 005, 021, 022, and 044. Recipes 006, 045, and 048 were not observed crafted in these runs. Production records count output units, rather than successful craft actions. Existing exploration can supply known-formula products, which explains sales or consumption exceeding recorded crafting.

The final review found and fixed one additional regional-resource leak: native sect raids could select the new source beasts and then grant their parts without regional stock depletion. The raid pool now excludes sourcePack records. New test/beast_ecology.js failed before the fix and passed afterwards. All production beast species scans were reviewed.

Post-run checks passed: beast_ecology, content_expansion, craft_transactions (17 cases), core_lock, cp_economy, and runtime_timing. The recipe transaction review found no further correctness issue.

Raw results:

- `JianghuSect_v1.10/test/results/long_v110_seed1.json`
- `JianghuSect_v1.10/test/results/long_v110_seed2.json`
- `JianghuSect_v1.10/test/results/long_v110_seed3.json`

Wall-clock durations are semantic completion observations only. These runs establish no browser, mobile-device, FPS, or speed-multiplier throughput claim.
