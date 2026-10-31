# NPC Decision Intelligence Integration Report

## 1. Decision Pipelines Integrated with `ELEM`
1. **Major Path & Subpath Selection (`CULT.pathScores` in `js/cultivation.js`)**:
   - Evaluates `ELEM.resolveCompatibility(npc, sub, "SUBPATH_SELECT")` alongside innate affinities, aptitudes, and personality values.
2. **Subpath Retraining (`RET.evaluateCandidates` in `js/retraining.js`)**:
   - Compares elemental compatibility multiplier of candidate subpaths against the current subpath so NPCs with mismatched roots rationally consider retraining when unlocked manuals/crystals are available.
3. **Library Technique & Scripture Selection (`COG.techPreference` & `COG.evaluateTech` in `js/cognition.js`, `MARTIAL.knowledgeFit` in `js/knowledge.js`)**:
   - Combines combat compatibility (`(combatMultiplier - 1) * 3.8`) and study speed (`(studySpeedMult - 1) * 1.4`) with weapon-type match, passive slot availability, and personality traits.
4. **Equipment Evaluation & Sect Stock Distribution (`MARTIAL.gearSuitability` in `js/martial.js`, `SECT.distributeSectStock` in `js/sect.js`)**:
   - Preserves strict weapon-type compatibility while adding elemental resonance (`equipmentSynergyMultiplier`) and human-readable Thai reasons.
5. **Combat Skill Selection (`COMBAT.chooseSkill` in `js/combat.js`)**:
   - Factors `ELEM.resolveCombatInteraction(attacker, defender, skill)` into tactical skill scoring once without overriding emergency heal/guard priorities.
6. **Crafting & Alchemy (`ECO.craftSuccessChance` in `js/economy.js`)**:
   - Applies `craftingSuccessBonus` for elemental pill/equipment/talisman recipes and grants `craft_finish` elemental mastery upon completion.

## 2. Live Score Breakdown Example (Fire Heavenly Root Cultivator)
- **NPC Root Profile**: `1 Root — FIRE (HEAVENLY)`, `FIRE Mastery = 72`, `FIRE Affinity = 88`
- **Top Scored Subpaths (`CULT.pathScores`)**:
  1. `XIAN / ELIXIR_DAO`: score **122.10**
  2. `BODY / SOLAR_FORGE`: score **108.16**
  3. `XIAN / SWORD_IMMORTAL`: score **107.57**
  4. `XIAN / ASTRAL_ARRAY`: score **106.51**
  5. `XIAN / FIVE_ELEMENTS`: score **100.72**
  6. `BODY / BLOOD_DRAGON`: score **100.32**
  7. `BODY / JADE_IMMORTAL_BODY`: score **96.27**
  8. `XIAN / SOUND_ZITHER`: score **90.31**
- **Technique Evaluation Comparison (`COG.evaluateTech`)**:
  - Matching Fire Technique (`ART190_XIAN_006` — คัมภีร์ปราณบงกชเพลิงคราม): score **5.02** · `🔥 ไฟ · เกื้อหนุนดี (×1.12)`
  - Opposing Water/Ice Technique (`ART190_XIAN_001` — เพลงกระบี่พิรุณหยกเจ็ดดาว): score **-0.02** · `❄️ น้ำ/น้ำแข็ง · ธาตุขัดแย้งรุนแรง (×0.65)`
