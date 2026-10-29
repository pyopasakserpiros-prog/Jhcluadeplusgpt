# Technical Audit Summary: Jianghu Sect Technique & Manual Catalog

**Audit Baseline Commit**: [`0218ae4ddb227422952ca933ea8b42a191836476`](https://github.com/pyopasakserpiros-prog/Jhcluadeplusgpt/commit/0218ae4ddb227422952ca933ea8b42a191836476)  
**Branch**: `main-1`  
**Repository**: `https://github.com/pyopasakserpiros-prog/Jhcluadeplusgpt.git`  
**Audit Date**: October 29, 2026  
**Auditor Mode**: Antigravity Technical Auditor (Strictly Analysis-Only)  
**Byte-Lock Status**: `js/human_core.js` verified intact (`a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`)  
**Game Source Code Changes**: **0 files modified** (Zero runtime code mutations)

---

## 1. Executive Summary

This independent technical audit provides the first complete, evidence-based, entry-by-entry classification of the entire technique and cultivation manual catalog in *Jianghu Sect* (v1.10.9).

Every single one of the **370 distinct entries** across `JD.TECH.techniques` and `JD.TECH.mantras` was extracted from a pristine, frozen Git snapshot of remote `main-1` (`0218ae4ddb227422952ca933ea8b42a191836476`), traced through engine execution paths, evaluated against live runtime mechanics (`SK.profile`, `CULT.tickMantra`, `MARTIAL.passiveStats`), and provisionally classified into **Tier 1–7** and **Grade (Common, Refined, Rare, Exceptional, Legendary)**.

> [!IMPORTANT]
> **Analysis-Only Mandate**: In strict accordance with prompt instructions, this audit makes **no mutations** to game source files, drop tables, costs, or catalog objects. All proposals and findings are packaged for Codex and author review prior to any game implementation.

---

## 2. Extraction & Runtime Loading Methodology

To guarantee 100% reproducibility and prevent any divergence from the live engine:

1. **Snapshot Acquisition**: A clean archive of `0218ae4ddb227422952ca933ea8b42a191836476` was extracted into an isolated sandbox (`audit_technique_catalog/snapshot/`).
2. **Deterministic Module Initialization**: Files were loaded via `snapshot/JianghuSect_v1.10/test/load.js`, mimicking browser script execution order:
   - Data tier: `data/data_cultivation.js` → `data/data_sect.js` → `data/data_items.js` → `data/data_tech.js` → `data/data_expansion.js` → `data/data_martial.js` → `data/data_ecology.js`.
   - Logic tier: `js/human_core.js` → `js/cultivation.js` → `js/skills.js` → `js/martial.js` → `js/knowledge.js` → `js/cpeco.js`.
3. **Execution Path Profiling**:
   - **Active Moves**: Analyzed via `SK.profile(t)` for damage multiplier ($M$), hit count, windup ticks ($wind$), cooldown ticks ($cd$), Qi cost percentage ($costPct$), weapon/armor affinity, and status debuffs/control riders.
   - **Passive Skills**: Evaluated via `MARTIAL.passiveStats(n)` for flat/percentage combat stat bonuses.
   - **Mantras**: Evaluated via `CULT.tickMantra` for Qi condensation speed enhancement and major path alignment.
4. **Full Acquisition Mapping**: Cross-referenced every ID across the 7 verified acquisition routes:
   - Sect starter library (`W.sect.library`)
   - Martial bootstrap curriculum (`JD.MARTIAL.curriculum`)
   - Rare martial curriculum (`JD.MARTIAL.techniques`)
   - Expansion curriculum (`JD.EXPANSION.techniques`)
   - Regional content loot (`CONTENT.regions[].techniques`)
   - Adventure expedition fortune pools (`EXPED.FORTUNE_REGISTRY`)
   - Myriad Worlds explore subpools (`EXPLORE.WORLDS[].areas[].subpools`)
   - Knowledge discovery pool (`M.rollDiscovery`)
   - Cultivation mantra pools (`CULT.mantraPool`)

---

## 3. Catalog Manifest & Provenance Breakdown

Across the entire codebase, exactly **370 unique IDs** are registered. There are **0 internal duplicate IDs** and **0 cross-registry duplicate IDs**.

| Source File | Source Registry / Purpose | Techniques Added | Mantras Added | Total Entries |
| :--- | :--- | :---: | :---: | :---: |
| `data/data_tech.js` | Base 5-path discipline catalog | 285 | 61 | 346 |
| `data/data_expansion.js` | `SRC110_...` expansion arts | 9 | 0 | 9 |
| `data/data_martial.js` | Bootstrap fundamentals (`MP_BASE_...`) | 5 | 0 | 5 |
| `data/data_martial.js` | Rare martial curriculum (`MP_...`) | 10 | 0 | 10 |
| **Total Snapshot Catalog** | **Combined Engine Registries** | **309** | **61** | **370** |

---

## 4. Provisional Classification Rubric

### 4.1 Tiers 1–7 (Realms of Cultivation)

The seven tiers map directly to cultivation realms, character stage progression, power ratings, and combat scale:

* **Tier 1 — Qi Condensation Novice (Stage 1–2, Power 15–80, Avg ~49)**: Basic single-target strikes, standard evasive footwork, minor healing (16%), basic breathing mantras. Minimal tactical riders.
* **Tier 2 — Foundation Practitioner (Stage 3–4, Power 28–124, Avg ~90)**: Multi-hit flurries, early control (stuns/silence), armor piercing, shields (17–18%), core discipline moves.
* **Tier 3 — Core Formation Expert (Stage 5–6, Power 58–162, Avg ~132)**: Broad area sweeps, burst strikes, channeling arts, summons, life drain, debilitating damage-over-time (DOT), shields (21%), heals (24%).
* **Tier 4 — Nascent Soul Master (Stage 7–8, Power 82–200, Avg ~165)**: Devastating damage multipliers, wide AOE, penetration +15–30%, forbidden arts with backlash, heavy Qi consumption, shields (24%).
* **Tier 5 — Soul Formation Grandmaster (Stage 9, Power 120–268, Avg ~198)**: Apex mortal realm arts, extreme burst/control, team-wide protective auras, supreme life drain.
* **Tier 6 — Ascension / Half-Step Immortal (Power 185–309, Avg ~256)**: Transcendent arts crossing mortal boundaries, profound spiritual transformations, extreme forbidden arts with permanent drawbacks.
* **Tier 7 — True Immortal / Primordial / Ancient Beast God (Power 284–380, Avg ~336)**: Divine-scale impact, cosmic reality-bending power, peerless execution multipliers.

### 4.2 Grades (Tactical Efficiency & Mechanical Distinction within Tier)

* **`Common`**: Baseline technique for the tier. Generic generated archetype scaling without specialized riders, standard cooldowns ($\ge 10\text{t}$), and baseline Qi costs ($\ge 4\%$).
* **`Refined`**: Noticeably superior cycle efficiency: lower Qi cost ($< 4\%$), fast cooldown ($\le 8\text{t}$), higher accuracy, or clean single-weapon synergy.
* **`Rare`**: Possesses distinct tactical rider effects (armor penetration, status debuffs such as `bleed`, `stun`, `poison`, `freeze`, `blind`, `break_armor`), multi-hit flurries, or permanent passive stat bonuses (`martialRare`).
* **`Exceptional`**: Outstanding mechanical efficiency or high tactical versatility; decisive combat advantage with manageable trade-offs (e.g. penetration $\ge 20\%$, multi-effect debuffs, advanced shields/heals $\ge 20\%$).
* **`Legendary`**: Peerless in tier; archetype-defining or game-altering impact (e.g. supreme endgame arts, apex summons, catastrophic forbidden arts).

---

## 5. Comprehensive Distribution Statistics

### 5.1 Distribution by Cultivation Path

| Major Path | Total Entries | % of Catalog | Techniques | Mantras |
| :--- | :---: | :---: | :---: | :---: |
| `XIAN` (Immortal Dao) | 109 | 29.5% | 89 | 20 |
| `BODY` (Body Refinement) | 99 | 26.8% | 84 | 15 |
| `GOD` (Divine / Faith Dao) | 93 | 25.1% | 79 | 14 |
| `DEMON` (Demonic Path) | 31 | 8.4% | 24 | 7 |
| `HEART_SOUL` (Soul Dao) | 32 | 8.6% | 27 | 7 |
| `ANY` / `GENERAL` | 6 | 1.6% | 6 | 0 |
| **Total** | **370** | **100.0%** | **309** | **61** |

### 5.2 Distribution by Defined Category

| Category Key | Registry | Total | Compiled Combat Arch |
| :--- | :--- | :---: | :--- |
| `COMBAT_TECHNIQUE` | Both | 157 | Strike, Flurry, Pierce, Sweep, Burst, Drain, Control |
| `AUXILIARY_ART` | Both | 72 | Heal, Guard, Evade, Support, Channel |
| `QI_MANTRA` | Both | 26 | Mantra / Evade / Heal |
| `LIGHTNESS_ART` | Both | 23 | Evade / Movement |
| `BODY_MANTRA` | Both | 21 | Mantra / Guard / Counter |
| `FAITH_MANTRA` | Both | 20 | Mantra / Support / Shield |
| `FORBIDDEN_ART` | Both | 32 | Forbid (Extreme multiplier + backlash) |
| `DEMON_MANTRA` | Mantras | 7 | Demon Cultivation Breathing |
| `SOUL_MANTRA` | Mantras | 7 | Soul Cultivation Breathing |
| `PASSIVE` | Techniques | 5 | Direct Combat Stat Modifiers |
| **Total** | | **370** | |

### 5.3 Current Tier vs. Proposed Tier Comparison

| Tier | Realm Name | Current Data Count | Proposed Audit Count | Delta / Rationale |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Qi Condensation | 42 | **45** | +3 (Aligned `reqTier: 1` bootstrap fundamentals) |
| **2** | Foundation | 73 | **70** | -3 (Realigned expansion entries with stage gates) |
| **3** | Core Formation | 81 | **81** | Net 0 (Balanced distribution) |
| **4** | Nascent Soul | 55 | **55** | Net 0 |
| **5** | Soul Formation | 54 | **54** | Net 0 |
| **6** | Ascension / Half-Step | 48 | **48** | Net 0 |
| **7** | True Immortal / Primordial | 17 | **17** | Net 0 |
| **Total** | | **370** | **370** | **100% Accounted For** |

### 5.4 Distribution by Proposed Grade

| Grade | Count | Percentage | Primary Characteristics |
| :--- | :---: | :---: | :--- |
| `Common` | 187 | 50.5% | Standard baseline strikes, novice mantras, basic evasion |
| `Refined` | 66 | 17.8% | High cycle efficiency, fast cooldown ($\le 8\text{t}$), low Qi cost |
| `Exceptional` | 53 | 14.3% | Powerful tactical riders, deep shields/heals, high-risk forbidden |
| `Rare` | 38 | 10.3% | Distinct status riders, armor pierce, permanent martial passives |
| `Legendary` | 26 | 7.0% | Apex Tier 6/7 arts, peerless burst, game-altering impact |
| **Total** | **370** | **100.0%** | |

### 5.5 Distribution by Verification Confidence & Acquisition

| Metric | Category | Count | Percentage |
| :--- | :--- | :---: | :---: |
| **Audit Confidence** | `HIGH` | 269 | 72.7% |
| | `MEDIUM` | 67 | 18.1% |
| | `LOW` | 34 | 9.2% |
| **Acquisition Status** | Reachable via Gameplay | 336 | 90.8% |
| | Unreachable (0 Routes) | 34 | 9.2% |

---

## 6. Strategic Recommendations for Codex & Author

1. **Address the 34 Completely Unreachable Forbidden Arts**:
   - 32 `ART190_..._073`–`080` arts and 2 `FORB_...` arts are completely inaccessible. `CULT.learnable` explicitly rejects `/FORBIDDEN/` and `M.rollDiscovery` filters them out.
   - *Recommendation*: Rather than leaving them as dead code, introduce a dedicated "Forbidden Pavilion" event, high-tier ruin expedition loot, or Demonic sect illicit trade route where disciples can discover them with clear alignment and loyalty risks.
2. **Clean Up Cross-Registry Category Contamination**:
   - 42 mantras are registered inside `JD.TECH.techniques`, while 18 combat/auxiliary arts are registered inside `JD.TECH.mantras`.
   - While `CULT.tech(id)` handles unified lookup safely, iteration loops that inspect `JD.TECH.techniques` or `JD.TECH.mantras` directly will experience skewed pool selections.
   - *Recommendation*: Standardize `registry` by entry type during a major version refactor, or preserve legacy arrays while providing clean typed views (`TECH.getAllMantras()`, `TECH.getAllCombatArts()`).
3. **Bridge Grandiose Flavor Names and Generic Compiled Archetypes**:
   - Several techniques have evocative descriptions ("Freezing Meridians Three Steps", "Decapitation Strike") but compile into generic `strike` or `pierce` archetypes with standard physical damage.
   - *Recommendation*: Add distinctive status rider tags in `SK.profile` (e.g. `slow`, `paralyze`, `bleed`) to match the artistic vision of the flavor text.
4. **Formalize Martial Curriculum Passives**:
   - The 5 `MP_BASE_...` fundamentals and 10 `MP_...` rare passives in `data/data_martial.js` provide an excellent framework for weapon mastery. Expanding this system to all 32 subpaths will create deep, meaningful character builds.

---

## 7. Deliverables Index

All analysis artifacts have been generated in `/data/data/com.termux/files/home/agy-dev/audit_technique_catalog/`:

- [`technique_audit.csv`](file:///data/data/com.termux/files/home/agy-dev/audit_technique_catalog/technique_audit.csv): Complete 370-row master audit dataset with all 24 required columns.
- [`technique_audit_coverage.json`](file:///data/data/com.termux/files/home/agy-dev/audit_technique_catalog/technique_audit_coverage.json): Machine-readable verification metadata, distribution counts, and validation checks.
- [`technique_audit_review_queue.md`](file:///data/data/com.termux/files/home/agy-dev/audit_technique_catalog/technique_audit_review_queue.md): Prioritized review queue detailing critical anomalies, unreachable arts, and save-risk mitigations for Codex.
- [`validate_audit.js`](file:///data/data/com.termux/files/home/agy-dev/audit_technique_catalog/validate_audit.js): Standalone validation test suite verifying dataset completeness and byte-lock integrity.
