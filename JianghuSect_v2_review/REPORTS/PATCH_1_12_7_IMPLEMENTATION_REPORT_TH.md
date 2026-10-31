# Codex Follow-up Implementation Report — JianghuSect v2.0.2

วันที่ตรวจ: 31 ตุลาคม 2026

## 1. Source identity

- Package: `JianghuSect_v2.0.2`
- Runtime engine: `SIM.VERSION 1.10.11`
- Runtime patch: `SIM.PATCH_VERSION 1.12.7`
- Elemental authority: `ELEM.VERSION 2.0.1`
- Save schema marker: `2.0.0-elemental`
- Protected core: `js/human_core.js` SHA-256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`; `HC.FINGERPRINT === "155:2f9c9dd7"`
- Current package source has no `.git` metadata; it was restored from the supplied v2.0.1 review ZIP and advanced in a separate working directory.

## 2. Changes in this follow-up

1. Replaced the prior over-common dual/triple root distribution with 97.899974% one-root, 2% dual, 0.1% triple and 1-in-3.9-million four-root generation probability.
2. Added per-root-count conditional grade cohorts so the generator and rarity labels use the same probability model.
3. Added `expectedCharacters` as the correct semantic name for generated-character appearances; retained `expectedBirths` as an alias and updated UI wording.
4. Fixed `forceGrades` slot mapping after `forceElements` validation/filtering.
5. Removed unused aptitude/meridian stat modifiers from the three root-capacity-only traits.
6. Weighted weapon-to-technique resonance across all declared element weights.
7. Applied elemental interaction to human and foe skill resolution; propagated accuracy into direct strikes and channel ticks; propagated control/rider proc multipliers.
8. Applied elemental damage multiplier to DOT magnitude for human and foe casts.
9. Made combat AI's counter preference consult `SK.ARCH[].off`, avoiding false offensive treatment of defensive/utility archetypes.
10. Ensured raid beasts retain species element profiles and that raid foes initialize via `COMBAT.enter()`.
11. Stabilized the local Chromium/CDP test harness with bounded WebSocket handshake retries after reproducing intermittent `ECONNRESET` / `ECONNREFUSED` during DevTools startup.

## 3. Verification

| Check | Result |
|---|---|
| Parallel regression runner | **70/70 PASS**, 0 FAIL, 0 timeout (default 2 workers; 14.60 seconds) |
| JavaScript syntax sweep | **140/140 PASS** |
| `core_lock` | PASS; protected hash/fingerprint unchanged |
| `long_simulation.js` | PASS, 90 simulated days / 129,600 ticks on final code; an earlier 180-day run passed before the final DOT/AI refinement |
| `long_ecology_simulation.js` | PASS, 90 simulated days / 129,600 ticks |
| `standalone.js` | PASS; 40 inline scripts, offline runtime, new-schema init/save-load |
| Standalone rebuild | PASS; package-root and source-tree copies byte-identical, 3,582,953 bytes |
| Generation-rate audit | 3 additional deterministic runs: 366/year (180d), 348/year (90d), 436/year (90d); combined with prior 11-run mean 387.27 gives pooled mean 386.43 across 14 runs |

Final-code simulation artifacts:
- `test/results/long_simulation_90d_patch_1127.json` — seed `v2026-final-patch1127-90d`, 90 days / 129,600 ticks.
- `test/results/long_ecology_90d_patch_1127.json` — seed `v2026-final-patch1127-ecology-90d`, 90 days / 129,600 ticks.

The test environment is Node.js v22.16.0. Browser/mobile suite uses the repository's automated test environment; it is not a physical Android/Snapdragon device certification.

## 4. Scope boundaries and remaining work

This patch does not claim the whole elemental/content redesign is finished. The remaining decisions and implementation targets are documented in `NEXT_PATCH_GAMEPLAY_FINDINGS_V2.md`, especially:
- explicit neutral/support/opposition relation classification;
- conservative scalar aggregate grade and all downstream consumers;
- `ELEMENT_LINK_ONLY` allowed contexts;
- separate heal/shield/support effectiveness;
- foe policies outside beast raids;
- behavioral NPC tests across path, learning, gear and combat;
- full content coherence and display-name/mechanics redesign.

## 5. Delivery policy

Old game-version and old-save compatibility are not requirements. New-schema integrity remains required. `human_core.js` remains byte-identical. No changes were pushed to GitHub in this review.
