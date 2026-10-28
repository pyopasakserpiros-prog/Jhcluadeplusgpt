# Jianghu v2.08.3 source

`index.html` defines the 32-module order. The standalone player embeds scripts, styles, fonts, and atlases for offline play.

## Build and verify

- Build the self-contained player: `python3 tools/build.py`
- Run the complete regression runner: `npm test`
- Focused EP.5/runtime/speed test: `node tests/ep5_speed_v2082.cjs` (set `JIANGHU_RUNTIME_REPORT` to a runtime-report JSON to include the actual-save migration check)
- UI harness: `node tests/ui_v117.cjs`

Pure derived stats live in `combat-stats.js`; common hit/secondary resolution lives in `combat-overhaul.js`. Preserve `human.js` and `legacy.bundle.js` byte-for-byte. The v2.08.3 keeps save envelope v11, repairs missing `stageLocal.needs` values, and normalizes legacy formula records (`knownBy`, `licenses`, `history`, `revision`) before NPC formula-sharing can finish.
