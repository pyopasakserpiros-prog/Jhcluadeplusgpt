# Patch v1.10.6 — Wider Welfare & Production Policies

## 1. Overview & Context

In accordance with the Priority 2 roadmap milestone in `ROADMAP/ROADMAP.md`:
> **Task**: Wider welfare/production policies
> **Acceptance criteria**: "Make expedition reserves/shortage directives visible; test relationship bias and need-based leadership decisions. Keep premium stock available for purchase."

This patch expands governance, logistics transparency, and social dynamics across the sect:
- **Expedition Reserves & Safety Directives**: Explicit data structures and rules (`W.sect.reserveDirectives`) ensuring that expeditions do not strip the sect of essential sustenance or leave members destitute.
- **Visible Shortage Directives**: Real-time aggregation of production deficits, kitchen shortages, and bottleneck breakthrough demands into `W.sect.shortageDirectives`, driving caravan and visitor trade.
- **Relationship Bias vs Need-Based Welfare Decisions**: Realistic leadership allocation in `CPE.welfareDaily` and `SIM.distributeGear` where policy meritocracy and leader integrity balance against personal favoritism, generating social feedback, resentment, and transparent audit logs.
- **Premium Stock Protection & Purchase Availability**: Imported and high-tier medicines (`SRC110_...`) are strictly protected from free welfare handouts while remaining available for purchase via contribution points (`CP`) in `CPE.shop` and spirit stones in `EXT` market.

---

## 2. Core Architectural Changes

### 2.1 Explicit Reserve Directives (`W.sect.reserveDirectives`)
- **Initialization & Calibration**: Automatically initialized and maintained in `SECT.ensureDirectives(W)` and `SECT.updateReserveDirectives(W)`.
- **Dynamic Policy Scaling**:
  - `minGrainDays`: 8–24 days of grain based on treasury caution and sect policy generosity.
  - `minMealReserve`: Minimum cooked meals reserved for residents (10–60 meals based on population).
  - `expeditionMinSafetyMeal`: Safety threshold below which expeditions are restricted to emergency rationing.
  - `expeditionMealCap`: Maximum meals provisioned per expedition member.
  - `medicine`: Baseline safety reserves for `P:BASIC_HP`, `P:BASIC_WOUND`, `P:BASIC_DETOX`, and `P:BASIC_CALM`.
  - `gearReserve`: Baseline safety gear for sect defense.
- **Expedition Enforcement (`js/expedition.js`)**:
  - `X.depart` strictly checks `availableForExped = currentMeals - safetyReserve`.
  - Expeditions cannot draw below the safety floor unless taking emergency survival rations (1 meal/member).
  - Safety threshold touches emit informative mission log notices.

### 2.2 Transparent Shortage Directives (`W.sect.shortageDirectives`)
- **Multi-Source Aggregation (`SECT.updateShortageDirectives`)**:
  1. **Canteen / Provisions**: Grain deficits below safety days; meal deficits below reserve minimums.
  2. **Essential Medicines**: Basic recovery pills below emergency reserve levels.
  3. **Hall Production Inputs**: Unfulfilled ingredients required for active alchemy and forge orders (`o.want`).
  4. **Tribulation Bottlenecks**: Breakthrough pills needed by cultivators currently stuck at stage bottlenecks.
- **Directives Structure**:
  - Each directive contains `id`, `nameTh`, `kind`, `needed`, `current`, `deficit`, `priority` (`critical` | `high` | `medium`), `source`, `reason`, and `day`.
  - Drives `W.sect.buyList` for visiting caravans and prioritized purchasing from visiting external merchants (`EXT` in `js/external_market.js`).

### 2.3 Leadership Governance: Need-Based Allocation vs Relationship Bias
- **Welfare Allocation (`CPE.welfareDaily` in `js/cpeco.js`)**:
  - **Need Scoring**: Evaluates physical trauma (`n.inj`), HP percentage deficit, heart demon corruption (`heartDemon > 35`), toxic accumulation (`toxic > 30`), and low energy, combined with merit/rank.
  - **Relationship Scoring**: Assesses personal affinity with treasury official (`SECT.relationScore(tr, n)`).
  - **Policy & Integrity Arbitration**:
    $$\text{EffectiveMerit} = \text{clamp}(\text{meritocracy} \times (0.55 + \text{integrity}/220), 0.05, 0.95)$$
    $$\text{DecisionScore} = (\text{NeedScore} + \text{MeritBonus}) \times \text{EffectiveMerit} + (\text{RelScore} \times 1.2) \times (1 - \text{EffectiveMerit})$$
  - **Social Feedback & Resentment**:
    - When favoritism under low meritocracy passes over a critically needy or high-merit member in favor of a healthy favorite, the passed-over disciple suffers mood and satisfaction drops, relationship loss with the treasurer, and records `'unfair_treatment'` experience.
    - Under high meritocracy, members with high integrity gain satisfaction from fair governance.
  - **Audit History (`W.sect.welfareHistory`)**:
    - Persists the last 30 daily distribution batches recording date, treasurer, recipients (with item, need score, bias score), and passed-over count.
- **Gear Allocation (`SIM.distributeGear` in `js/sim.js`)**:
  - Weighted by merit, power, and sect master relation affinity under sect meritocracy.
  - Transparent logging indicates whether equipment was awarded for merit or master's personal favor.

### 2.4 Premium Stock Protection & Purchase Availability
- **Zero Welfare Leaks**:
  - `CPE.welfareDaily` strictly enforces `BASIC_IDS.includes(x)` check before dispensing.
  - Expansion/imported medicines (`P:SRC110_...`) are excluded from free handouts.
- **Guaranteed Purchase Access**:
  - All premium medicines and equipment in sect inventory are exposed via `CPE.shopItems`.
  - Cultivators autonomously purchase premium pills when bottlenecked or severely wounded (`CPE.pickPurchase`), spending personal contribution points (`CP`).

### 2.5 UI Presentation (`js/ui.js`)
- **Stock Tab (`UI.rSect` -> `stock`)**:
  - Displays Expedition & Sect Reserve Directives card (grain days, meal reserves, expedition safety floor, medicine reserves).
  - Displays Active Shortage Directives card with priority chips, deficit counters, and requesting hall reasons.
- **Policy Tab (`UI.rSect` -> `policy`)**:
  - Displays Welfare & Allocation Governance card with Meritocracy vs Relationship Bias ratio bar, treasurer integrity, and recent distribution audit records.
- **Shop Tab (`UI.rSect` -> `shop`)**:
  - Clear banner identifying premium goods purchasable with CP and protected from free welfare depletion.

---

## 3. Regression Testing & Verification

A dedicated regression suite `test/welfare_production_policies.js` tests all 8 core requirements:
1. **Human Core Byte-Lock Invariant**: Verified SHA256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542` and fingerprint `155:2f9c9dd7`.
2. **Reserve Directives Structure**: Verified baseline fields and proper calibration.
3. **Expedition Meal Safety Reserve**: Confirmed `X.depart` honors safety floor and logs reserve status.
4. **Shortage Directives Generation**: Confirmed dynamic creation of provision, medicine, and material shortage directives with critical/high priority and caravan buyList synchronization.
5. **Need-Based vs Favoritism Allocation**:
   - High meritocracy: critically wounded disciple prioritized over healthy favorite.
   - Low meritocracy: favorite favored, passed-over needy disciple suffers satisfaction loss and records resentment.
6. **Premium Pill Protection & Shop Availability**:
   - Zero premium pills distributed via daily welfare.
   - Premium pills available in `CPE.shopItems`.
   - Autonomous purchase via `CPE.buy` verified with stock deduction and personal inventory acquisition.
7. **Gear Distribution Bias**: Confirmed distribution respects meritocracy vs affinity.
8. **Legacy Save Compatibility & Serialization**: Clean roundtrip serialization and backwards compatibility with legacy saves (`fixtures/v1_9_synthetic.json`).

### Full Assertion Test Suite
```
PASS core_lock
PASS cp_economy
PASS speed_controls
PASS time_controls
PASS runtime_timing
PASS craft_transactions
PASS content_expansion
PASS content_economy
PASS content_discovery
PASS exploration_replay
PASS ui_content
PASS legacy_save
PASS beast_ecology
PASS external_market
PASS recipe_scroll_lifecycle
PASS specialization_tracks
PASS combat_passives
PASS coherent_regions_recipes
PASS welfare_production_policies
PASS standalone
PASS recipe_coverage
PASS syntax
Assertions: 22/22 groups passed.
```

### 360-Day Full Assertion Simulation (`test/results/long_v1106_seed1.json`)
- **Duration**: 360 days (518,400 native simulation ticks).
- **Result**: `PASS` (0 crashes, 0 state corruptions).
- **Population**: 59 active cultivators.
- **Expeditions**: 119 completed across all 6 destination biomes.
- **Formulas**: 14/14 formulas discovered and known.
- **Market & Economy**:
  - 60 external market visitor arrivals.
  - 710 goods bought by sect, 968 goods sold; treasury holds 1,432 spirit stones.
  - 80,963 CP minted, 61,225 CP burned; price index stable at `0.890`.
  - 724 shop purchases, including active personal purchases of premium medicines (`P:SRC110_MW_REC_001`, `P:SRC110_MW_REC_002`, `P:SRC110_MW_REC_003`, `P:SRC110_MW_REC_006`) and equipment (`SRC110_MW_REC_021`, `SRC110_MW_REC_024`, `SRC110_MW_REC_025`, `SRC110_MW_REC_066`).
