# JianghuSect v1.10.14 — Gameplay Findings, Personal Crafting, Subpools & CP Economy Patch

## 1. Executive Summary

This patch directly addresses all priority gameplay findings documented in `docs/NEXT_PATCH_GAMEPLAY_FINDINGS.md` and `JianghuSect_v1.10/docs/BUG_AUDIT_2026_10_29.md`, bringing deeper NPC autonomy, believable material decisions, distinct Myriad World identities, calibrated difficulty progression, and an economically sound Contribution Point (CP) circulation model.

### Key Implemented Systems:
1. **Believable Keep vs. Donate Decisions (`gatherWildResource.done`)**:
   - Members evaluate immediate personal medical needs (healing hurt HP, curing poison/wound/toxic/demon), missing recipe components, current CP wealth, sect stock shortages, and personality traits (`loyalty`, `greed`, `altruism`).
   - Disciples needing medicine who know basic recipes retain gathered herbs in their personal inventory (`n.inv.mats`) rather than 100% blindly donating.
   - Poor/broke disciples (< 50 CP) prioritize donating for CP to sustain basic living.
   - Generous/loyal disciples prioritize filling sect stockpiles when the sect is in deficit.

2. **Personal Basic Crafting Loop (`CPE.personalCraftChoice` & `AI.ACTS.personalBrew`)**:
   - Qualified disciples with aptitude in alchemy (`ALCHEMY >= 10`, `interests.herbs >= 35`, or hurt) can autonomously choose basic recovery recipes (`BASIC_HP`, `BASIC_QI`, `BASIC_VIGOR`, `BASIC_WOUND`) to brew for personal consumption (`intent: 'keep'`) using their retained ingredients.
   - Personal crafted pills (`n.inv.craftedPills`) possess genuine quality ratings (`q`) and are consumed during combat or daily rest when wounded via `CPE.autoUse` and `AI.ACTS.personalPillUse`.

3. **CP Economy Evaluation & Non-Crowding Safeguards**:
   - Added comprehensive circulation tracking: `meanHoldings`, `medianHoldings`, `priceIndex`, `circulation`, `totalMinted`, and `totalBurned`.
   - Tuned `gatherWildResource.score`: when sect stock has abundant reserves (> 80 basic herbs), disciples deprioritize gathering (-0.6 score), eliminating the crowding-out of cultivation and exploration. Disciples with high CP (> 300) focus on cultivation (-0.5).
   - In 90-day simulation (`findings-seed-1`): CP price index remained stable between 0.89 and 0.91, mean holdings stabilized at ~268 CP (median 252 CP), and 159 material units were kept personally while 916 units were donated.

4. **12 Thematic Myriad Worlds $\times$ 4 Rank Areas $\times$ 2 Subpools (96 Subpools)**:
   - Defined all 96 thematic subpools in `js/explore.js` (`EX.WORLD_SUBPOOLS`). Each realm features 2 distinct thematic subpools per rank with unique identifiers, Thai names, encounters, and regional loot.
   - Upon departure (`EX.depart`), the party selects and commits `ex.subpoolId` and `ex.subpoolNameTh`.
   - Calibrated non-combat DC (`EX.resolve`): Non-combat encounters scale by world rank (`baseD = rankBaseD[rank] + worldMod`), eliminating inversion while strictly preserving static reference foe powers for combat (95, 480, 2,800, 18,500).

5. **Monotonic Fortune Proficiency & Cultivation Empowerment**:
   - `X.fortuneEvent` calculates proficiency check scores monotonically: `(s * 0.75) + (attr * 0.25) + stageBonus`.
   - Eliminates the zero-skill discontinuity (where skill 0 with high interest could roll higher than skill 1).
   - High-rank cultivators receive cultivation-based empowerment (`stageBonus = (stage || 1) * 3.5`), allowing Rank 4 masters to pass Difficulty 85–90 attribute trials.

6. **Fair Expedition Site Distribution**:
   - `X.depart` filters all matching biome sites in the world registry and randomly picks fairly across them, resolving the legacy `sites.find()` bias that repeatedly favored the first entry.

7. **Natural Outdoor Loot Purity & Smooth Gathering Scaling**:
   - `pickMaterial(W, 'OTHER')` strictly excludes manufactured formation flags (`!m.id.includes('FLAG')`).
   - Gathering duration scales smoothly from 60 minutes for novices down to 42 minutes for masters (`dur = clamp(60 - (maxSkill / 100) * 18 - lifeBonus, 40, 60)`).
   - Extraction efficiency grants masters a bounded chance to extract 2 units from nodes with `remaining >= 2`, strictly deducted from the node with 0 fabricated items.

---

## 2. Invariants & Guardrails Preserved

- **Branch**: Strictly committed to `main-1`. Branch `main` remains untouched as the immutable reference.
- **Byte-Locked Human Core**: `js/human_core.js` is byte-for-byte identical (SHA256: `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`, Fingerprint `155:2f9c9dd7`).
- **Stage-Only World Rank**: World rank is strictly derived from attained cultivation stage; combat power, gear, buffs, or injury never reduce encounter rank.
- **No Artificial Item/Currency Creation**: All CP is minted through real labor/donations; all materials deducted from actual node stocks.

---

## 3. Verification & Metrics

- **Unit & System Tests (`test/gameplay_findings_patch.js`)**:
  - `PASS natural outdoor resource pool excludes manufactured formation flags`
  - `PASS gathering duration and extraction efficiency scale gradually with skill`
  - `PASS fortune proficiency check is strictly monotonic with no zero-skill discontinuity`
  - `PASS expedition depart fairly distributes site selection among all matching biome sites`
  - `PASS all 12 worlds have 2 distinct subpools per rank with calibrated non-combat DC`
  - `PASS injured member with craft aptitude retains gathered herb, brews personal pill, and consumes for healing`
  - `PASS broke disciple donates gathered herb for CP to survive`
  - **Result**: 7/7 PASSED (Exit Code: 0).

- **Full Node.js Regression Suite (`test/run_all.js`)**:
  - All 46 Node.js test groups + syntax check (113 files) PASSED.
  - (5 Playwright/browser-specific tests fail as expected due to Termux mobile environment constraints lacking desktop Chromium binaries).

- **Standalone Single File (`JianghuSect_single.html`)**:
  - Built successfully (1,718 KB).
  - Verified with `test/standalone.js`: 38 inline scripts, 0 external runtime dependencies, 24-hour simulation verified.

- **Long Native Simulation (90 Game Days, `findings-seed-1`)**:
  - Harvest actions: 1,037 actions, 1,075 units extracted.
  - Retained for personal use: 159 units (14.8%).
  - Donated to sect: 916 units (85.2%) yielding 2,917.4 CP.
  - Basic pills crafted: 142 pills.
  - Pills purchased: 37 pills.
  - Pills consumed: 53 pills.
  - Price index: 0.89 (day 30) $\to$ 0.90 (day 60) $\to$ 0.91 (day 90).
  - Mean CP holdings: 182.9 $\to$ 282.7 $\to$ 268.2 CP (median: 252.8 CP).
