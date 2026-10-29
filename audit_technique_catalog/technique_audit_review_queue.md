# Codex Review Queue: Jianghu Sect Technique Catalog Audit

**Audit Baseline Commit**: [`0218ae4ddb227422952ca933ea8b42a191836476`](https://github.com/pyopasakserpiros-prog/Jhcluadeplusgpt/commit/0218ae4ddb227422952ca933ea8b42a191836476)  
**Target Reviewers**: Codex & Lead Game Designer  
**Scope**: Prioritized technical debt, design discrepancies, unreachable assets, and save-risk mitigations identified during the 370-item catalog audit.

---

## Priority 1 (Critical): 34 Completely Unreachable Forbidden Arts

### 1.1 The Issue
Exactly **34 entries** (9.2% of the total catalog) possess complete data definitions, descriptive Thai flavor texts, distinct visual effects (`castFx: 'forbidden'`), and dedicated combat profile archetypes (`forbid`), but have **zero in-game acquisition routes**.

### 1.2 Identified Unreachable IDs
- **XIAN Forbidden Arts (8)**: `ART190_XIAN_073`, `ART190_XIAN_074`, `ART190_XIAN_075`, `ART190_XIAN_076`, `ART190_XIAN_077`, `ART190_XIAN_078`, `ART190_XIAN_079`, `ART190_XIAN_080`
- **BODY Forbidden Arts (8)**: `ART190_BODY_073`, `ART190_BODY_074`, `ART190_BODY_075`, `ART190_BODY_076`, `ART190_BODY_077`, `ART190_BODY_078`, `ART190_BODY_079`, `ART190_BODY_080`
- **GOD Forbidden Arts (8)**: `ART190_GOD_073`, `ART190_GOD_074`, `ART190_GOD_075`, `ART190_GOD_076`, `ART190_GOD_077`, `ART190_GOD_078`, `ART190_GOD_079`, `ART190_GOD_080`
- **DEMON Forbidden Arts (8)**: `ART190_DEMON_073`, `ART190_DEMON_074`, `ART190_DEMON_075`, `ART190_DEMON_076`, `ART190_DEMON_077`, `ART190_DEMON_078`, `ART190_DEMON_079`, `ART190_DEMON_080`
- **Mantra Registry Forbidden Arts (2)**: `FORB_CORPSE_PUPPET_ARMY`, `FORB_FAKE_FAITH_HARVEST`

### 1.3 Root Cause in Engine Code
1. **Sect Library Study Gate (`js/cultivation.js:CULT.learnable`)**:
   ```javascript
   // js/cultivation.js line 28
   if(/FORBIDDEN/.test(t.cat)) return false; // Explicitly forbidden from standard library study
   ```
2. **Knowledge Discovery Gate (`js/knowledge.js:M.rollDiscovery`)**:
   ```javascript
   // js/knowledge.js line 105
   const pool = JD.TECH.techniques.filter(t => (t.reqTier || t.tier) <= tier && !t.martialBootstrap && !/MANTRA|FORBIDDEN/.test(t.cat));
   ```
3. **Adventure & Content Exclusion**:
   None of these 34 IDs are listed in `EXPED.FORTUNE_REGISTRY`, `EXPLORE.WORLDS` subpools, or `CONTENT.regions`.

### 1.4 Recommendations for Codex
- **Option A (Dedicated Illicit Acquisition Path)**: Create a "Black Market / Demonic Cave" exploration event or Demonic sect caravan trade where high-risk disciples (loyalty < 40 or personality ambitious) can secretly acquire forbidden manuals.
- **Option B (Sect Pavilion Vault)**: Add an unlocked "Forbidden Scripture Chamber" facility upgrade (Tier 4 Sect) allowing disciples at Stage 7+ to study with negative sect reputation or demonic tribulation risk.
- **Option C (NPC-Only Demonic Boss Arts)**: Explicitly assign these techniques to high-rank wild rogue cultivators and demonic sect leaders (`W.world.sects`) to give enemy encounters unique high-threat moves.

---

## Priority 2 (High): Cross-Registry Classification Contamination

### 2.1 The Issue
The two primary catalog registries have cross-category contamination resulting from legacy merges:
- **42 Mantras inside `JD.TECH.techniques`**:
  - 14 `QI_MANTRA`, 14 `BODY_MANTRA`, 14 `FAITH_MANTRA`
- **18 Combat & Auxiliary Arts inside `JD.TECH.mantras`**:
  - 11 `COMBAT_TECHNIQUE`
  - 3 `LIGHTNESS_ART`
  - 4 `AUXILIARY_ART`
  - 4 `FORBIDDEN_ART`

### 2.2 Mechanical Impact
- Unified lookup `CULT.tech(id)` handles ID resolution smoothly across both arrays via `TECH_BY_ID[id]`.
- **However**, any subsystem iterating over `JD.TECH.mantras` expecting only breathing scriptures (e.g., `CULT.mantraPool`) or iterating over `JD.TECH.techniques` expecting only combat moves encounters unexpected object types.
- For instance, `SK.profile(t)` called on items in `JD.TECH.mantras` unexpectedly generates active combat profiles for the 18 combat/auxiliary items inside `mantras`.

### 2.3 Recommendations for Codex
- **Short-Term (Non-Breaking)**: Provide accessor helper methods:
  ```javascript
  JD.TECH.getAllActiveArts = () => [...JD.TECH.techniques, ...JD.TECH.mantras].filter(t => !/MANTRA/.test(t.cat));
  JD.TECH.getAllMantras = () => [...JD.TECH.techniques, ...JD.TECH.mantras].filter(t => /MANTRA/.test(t.cat));
  ```
- **Long-Term**: Cleanly partition the JSON data definitions in `data/data_tech.js` so that `techniques` contains exclusively active/passive combat and utility arts, while `mantras` contains exclusively cultivation breathing scriptures.

---

## Priority 3 (Medium): Prerequisite & Stage Gate Inconsistencies (`reqTier !== tier`)

### 3.1 The Issue
Several entries define a `reqTier` that does not match their `tier`. For example:
- `SRC110_NW_ART_146` (กระบวนท่าโซ่ตรวนยมทูตล่ามวิญญาณ): `tier: 3`, `reqTier: 2`, `power: 100`.
- Several auxiliary arts have `tier: 2`, `reqTier: 1`.

### 3.2 Mechanical Impact
- In `js/cultivation.js:CULT.learnable`, the stage gate uses:
  ```javascript
  (t.reqTier || t.tier) <= c.stage
  ```
  This allows a Stage 2 disciple to learn a Tier 3 technique if `reqTier: 2`.
- Meanwhile, in `js/knowledge.js:M.rollDiscovery`, the drop filter uses:
  ```javascript
  (t.reqTier || t.tier) <= tier
  ```
- This discrepancy creates inconsistent progression expectations: a player sees a "Tier 3" label in the UI, but their Foundation (Stage 2) disciple can already learn and cast it.

### 3.3 Recommendations for Codex
- Standardize all entries so that `reqTier === tier`.
- For `SRC110_NW_ART_146`, either:
  1. Elevate `reqTier` to 3 (matching its Core Formation Tier 3 status and 100 power), or
  2. Demote `tier` to 2 (matching Foundation Stage 2).

---

## Priority 4 (Medium): Grandiose Flavor Names vs. Generic Compiled Mechanics

### 4.1 The Issue
The data definitions in `data/data_tech.js` feature highly evocative, immersive Thai wuxia names:
- *เพลงกระบี่เงาจันทร์สะท้อนสระ* (Moon Shadow Sword)
- *ดัชนีสายฟ้าม่วงทะลวงจุด* (Purple Lightning Meridian Finger)
- *หมัดเหมันต์เยือกแข็งสามก้าว* (Three-Step Freezing Fist)

However, at runtime, `SK.profile(t)` in `js/skills.js` compiles almost all techniques using generic procedural formula archetypes (`strike`, `flurry`, `pierce`, `sweep`, `evade`, `heal`, `shield`).
As a result:
- A "Meridian Piercing" finger strike and an "Ice Freezing" fist strike may have identical underlying combat mechanics (e.g. `damage: 1.8x, status: break_armor`), differing only in their element string.
- The `power` stat stored on data objects is largely decorative; actual damage is determined strictly by the hardcoded archetype multipliers in `SK.profile` modulated by character stat ratios `atk / (atk + 0.8 * def)`.

### 4.2 Recommendations for Codex
- Expand `SK.profile` archetype modifiers to read explicit optional rider properties on technique definitions (e.g. `customSt: 'freeze'`, `customPierce: 25`, `customBonusHits: 2`).
- This will allow unique techniques from adventure discoveries or ancient sects to have genuinely distinct tactical personalities without breaking vanilla baseline formulas.

---

## Priority 5 (Low / Save Safety): Save Compatibility & Tier Migration Guardrails

### 5.1 Save File Serialization Mechanics
In *Jianghu Sect*, disciple technique knowledge is saved in character objects under:
```javascript
npc.cult.techniques = ['ART190_XIAN_001', 'MP_BASE_SWORD', ...];
npc.cult.mantra = 'ART190_XIAN_002';
```
Disciples store **only string ID references**, not serialized technique objects.
When loading a save game, `CULT.tech(id)` re-resolves the technique directly from the live data catalog in memory.

### 5.2 Critical Save Guardrails
> [!CAUTION]
> **Never Delete or Rename Existing Technique IDs**:
> Deleting or renaming any of the 370 IDs will cause `CULT.tech(id)` to return `undefined` on existing saves, causing runtime crashes in combat move compilation (`SK.profile(t)` throws `TypeError: Cannot read properties of undefined`).

> [!WARNING]
> **Tier Elevation Soft-Locks**:
> If a technique's tier is elevated (e.g., from Tier 1 to Tier 2), an existing Stage 1 disciple who already learned it will still retain it in `npc.cult.techniques`. However:
> 1. If unlearned or swapped, they will not be able to re-learn it until reaching Stage 2.
> 2. NPC AI evaluating library study or knowledge fit will experience unexpected scoring shifts.

### 5.3 Recommended Migration Strategy
When implementing any tier or grade normalization:
1. Keep all 370 IDs intact.
2. If introducing new balance formulas, add a save game version bump in `SIM.migrate(save)` to recalculate disciple combat profiles cleanly.
3. Use the proposed tiers and grades from `technique_audit.csv` as the standardized baseline.
