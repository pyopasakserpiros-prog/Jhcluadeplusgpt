# v1.10.1 patch — direct external market

Date: 27 October 2026
Base: supplied `JianghuSect_v1-10-1.zip` / internal v1.10.0 codebase

## Purpose

Connect the already existing sect inventory, caravan requests and member personal inventories to an actual visiting-merchant loop. The patch preserves the target simulation, contribution-point economy, source-content boundaries and locked Human Core.

## Implemented

- Visiting merchants have a stable save-persistent ID, visit window, subtype, stock, wants and spirit-stone wallet.
- Visitors arrive probabilistically based on sect fame/openness and road availability; road closure suppresses new visits. Visitors depart when their stay expires.
- Treasury buys requested or critically scarce tradable goods from a visitor, only once per visit, and retains a population-scaled stone reserve.
- Visitors buy sect surplus only above a protected reserve. Sect purchases/sales transfer real stock and stones; every transaction updates the sect ledger and bounded market history/counters.
- Members may buy needed or reserve basic medicine from visitors and sell common personal materials or surplus basic medicine. Transactions use personal spirit stones, never contribution points.
- Existing internal sect store/services remain contribution-point transactions. Imported/source-pack rare materials are excluded from automated trader inventory and procurement.
- The sect shop panel shows active traders, current stock/wants, stone balances, aggregate external flows and recent transactions.
- Save/load retains active visitors, wallets, stock, wants, transaction history and counters. Repeated same-day treasury settlement is a no-op; stale/forged member quotes cannot charge or mint inventory.

## Validation

- `node test/external_market.js`: passed.
- `node test/ui_content.js`: passed with external-market UI assertions.
- `node test/run_all.js`: 17/17 groups passed after rebuild.
- Current-code 90-day native-tick smoke (`ext-market-smoke2`): 129,600 complete ticks; 9 visits, 98 sect units bought, 130 sect units sold, 6 member buys and no member sales; 486 sect stones at end. Daily assertions cover nonnegative wallets/inventory, finite market statistics and bounded history.
- Additional direct 360-day observation completed 518,400 ticks in 314,981 ms without a runtime exception; final treasury 1,700 stones, population 57, 55 visits. This run had no daily assertions. The instrumentation-heavy long-simulation harness exceeded its environment timeout at 360 days, so this is observational evidence only, not a formal 360-day PASS.
- Full browser/touch QA and physical Android/Snapdragon throughput testing remain unavailable in this environment.

## Next work

- Run 3–5 long seeds with 360–720 days while tracking treasury cash runway, food days, trader inflow/outflow, market stock, member wallet distribution and external trade participation.
- Tune visit frequency and demand if treasury reserve is breached too often or external imports consistently exceed exports.
- Later add a player-facing manual trade interface only if desired; this patch implements autonomous NPC and treasury trade without creating a second engine.
