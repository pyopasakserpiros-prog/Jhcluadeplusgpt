# Visitors, Living Clues & Legendary Weapons Code Map

## 1. Module & Script Load Order

- **`js/visitors_clues.js`** (loaded immediately after `js/sim.js` and before `js/render.js`, `js/ui.js`, `js/main.js` in both `index.html` and `test/load.js`).
- Exports `g.VC` (`VC.VERSION === 1`, `VC.PATCH_VERSION === '1.12.1'`).

## 2. Entity & Membership Model

- **Sect Members (`W.npcs`, `W.byId`)**:
  - Permanent disciples/elders generated via `SIM.buildNpc` and registered via `SIM.register`.
  - Count toward `SECT.memberOccupancy(W)` and the 100-bed housing cap (`SECT.housingCapacity(W)`), receive stipends/welfare, and hold offices (`W.sect.posts`).
- **Outsiders / Visitors (`W.world.visitors`, `W.world.guestRegistry`, `W.world.visitorHistory`)**:
  - **Traders (`v.kind === 'trader'`)**: Created via `EXT.openVisit(W)` (wrapped by `js/visitors_clues.js` to attach coordinates, human appearance `v.h`, and optional clue leads). Queried via `EXT.activeVisitors(W)`.
  - **Non-Merchant Guests (`v.kind === 'guest'`)**: Created via `VC.spawnGuest(W, opts)` with roles `wanderer`, `scholar`, `herbalist`, `artisan`, `envoy`. Queried via `VC.activeGuests(W)`.
  - **Strict Isolation Invariant**: Visitors are never pushed into `W.npcs` or `W.byId`, never occupy dormitory bed stations, and never receive sect welfare or offices.

## 3. World State & Save Migration (`VC.ensure(W)`)

`VC.ensure(W)` initializes and migrates the following structures on `W.world` and `W.sect` (with an O(1) per-day fast path via non-enumerable `W.world._vcEnsuredDay`):
- `W.world.visitors`: Active visitor records on the sect map (`state`: `'admitted' | 'restricted' | 'rejected' | 'offsite'`).
- `W.world.guestRegistry`: Persistent dictionary of up to 48 recurring outsider records (`visitCount`, `hospitalityScore`, `lastDepartDay`, `interactions`) used for return visits (`VC.findVisitor(W, id)`).
- `W.world.visitorHistory`: Chronological log of recent visitor interactions (capped at 80 entries).
- `W.world.clues`:
  - `active`: Dictionary of active/settled clue instances keyed by `instanceId` (`clue_1`, `clue_2`, ...).
  - `history`: Completed clue summaries (capped at 80 entries).
  - `cooldowns`: Per-template cooldown day (`templateId -> day`).
  - `dailyBudget`: `{ day, cluesGenerated, legendCluesGenerated }`.
  - `funnel`: Telemetry counters (`visits`, `admitted`, `rejected`, `infoEncounters`, `rumorsSpawned`, `cluesShared`, `investigationsStarted`, `nodesPassed`, `nodesFailed`, `terminalsReached`, `grantsSucceeded`, `rewardsClaimed`, `grantsBlockedDuplicate`, `falseRumorsDisproven`, `equippedOrLearned`).
- `W.world.claimReceipts`: Durable idempotency receipts (`claim_<instanceId>_<targetId>`) preventing duplicate story payouts.
- `W.world.uniqueArtifacts`: Authoritative ownership table for the 11 unique legendary weapons (`itemId -> { itemId, uid, ownerKind, ownerId, ownerNameTh, updatedDay }`).
- `W.sect.clueArchive`: Array of `instanceId`s reported to the sect library/leadership.

## 4. Hooks & Wrapper Order

1. **`STATS.gearStats` (`js/visitors_clues.js` lines 475–496)**:
   - Fast-returns `it.st` if `it.st && it._vcNorm` is already set.
   - Normalizes `it.q` and `it.quality` via `VC.normalizeGearItem(it)` (defining non-enumerable `quality` getter/setter aliasing `it.q`).
   - For legendary weapons in `VC.LEGENDARY_WEAPON_BY_ID`, computes stats from `def.fixedStats` scaled once by `q / def.q`.
2. **`ECO.mintGear` (`js/visitors_clues.js` lines 498–520)**:
   - Attaches `visualKey`, `visualSubtype`, `presentationMode`, `legendary: true`, `rarity: 'Legendary'`, `unique: true`, and `fx` to minted legendary weapons.
3. **`MARTIAL.gearUsable` & `MARTIAL.gearSuitability` (`js/visitors_clues.js` lines 529–568)**:
   - Enforces `def.reqStrength` (e.g., `LEG_WPN_XUANTIE_HEAVY_SWORD` requires `physiology.strength >= 58`) and scores `preferredSubs` and signature effects so NPCs decline weapons they cannot wield.
4. **`COMBAT.strike` (`js/visitors_clues.js` lines 725–741)**:
   - Sets `oMod.forced = true` when `LEG_WPN_XIAOLI_HEART_DAGGER`'s `EFX_LEG_XIAOLI_TRUE_STRIKE` proc is ready and paid with 4% Qi.
   - Invokes `VC.runWeaponProcs` (offensive procs) and `VC.runWeaponOnStruckProcs` (defensive procs such as `EFX_LEG_DAGOU_REDIRECTION`) after a hit lands.
5. **`EXPED.resolve` & `EXPED.handover` (`js/visitors_clues.js` lines 3531–3597)**:
   - Resolves exterior clue nodes during `clue_investigation` missions and delivers unique legendary weapons to their intended claimant upon return.
6. **`SIM.create`, `SIM.tick`, `SIM.deserialize`, & `CONTENT.daily` (`js/visitors_clues.js` lines 3688–3718)**:
   - Ensures `VC.ensure(W)` on world creation and deserialization, steps physical visitor movement every 4 ticks in `VC.tick(W)`, and runs daily visitor arrivals/departures and staggered clue expeditions in `VC.daily(W)`.

## 5. Rendering & UI Entry Points

- **`js/render.js`**:
  - `R.appearance(n)`: Tracks `weaponVisualKey`, `weaponSubtype`, `weaponPresentation`, and `weaponUsable` in `this.apCache`.
  - `R.drawLegendaryWeaponVisual(ctx, n, ap, armA, by, lunge, act)`: Draws recognizable silhouettes and `held_and_orbit` motifs for all 11 legendary weapons without consuming `W.rng` or mutating `W`.
  - `R.drawVisitor(ctx, v, hour)` & `R.pickAt(sx, sy)`: Draws physical guests on the sect map and returns `{ kind: 'visitor', id: v.id }` on tap.
- **`js/ui.js` & `js/main.js`**:
  - `UI.open('world', 'visitors')` -> `UI.rVisitors()`
  - `UI.open('world', 'clues')` -> `UI.rClues()`
  - `UI.openVisitor(id)` -> `UI.rVisitor()`
  - `UI.openClue(id)` -> `UI.rClueDetail()`

## 6. Verification Commands

```bash
# Run the dedicated Visitors, Clues & Legendary Weapons test suite
node test/visitors_clues_weapons_suite.js

# Run 3x180-day natural simulations and regenerate docs/CLUE_SOURCE_CATALOG.json
node tools/run_visitors_clues_sim.js

# Rebuild standalone HTML and verify all 61 test groups
node tools/build_single.js
node test/standalone.js
node test/run_all.js
```
