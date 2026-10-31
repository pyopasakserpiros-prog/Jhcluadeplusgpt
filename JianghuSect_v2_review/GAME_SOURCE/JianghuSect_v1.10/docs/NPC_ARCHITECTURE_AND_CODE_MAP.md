# NPC Architecture and Code Map (`v1.12.1` NPC Life & Sect Authority Overhaul)

## 1. Architectural Overview

The Jianghu Sect simulation models every sect member on top of the locked 155-dimension human core (`js/human_core.js`, SHA-256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`). Without modifying `js/human_core.js`, this overhaul upgrades NPCs from short-horizon utility pickers into persistent, socially embedded, goal-directed individuals who:

1. Hold **long-term life aspirations** (`c.aspiration`) derived from their 155-dimension traits, values, aptitudes, skills, and sect role, with hysteresis and milestone history.
2. Pursue **multi-horizon goals** (`c.goal`) that decompose into concrete **short-term steps** (`step: 'earn_cp' | 'seek_access' | 'gather_input' | 'obtain_remedy' | 'study_now' | 'buy_now' | 'train_now'`), survive short emergencies via **goal suspension/resumption** (`c.suspendedGoal`), and only refresh progress (`c.goal.lastProgress`) when an action genuinely advances the goal's state predicate.
3. Operate under **bounded knowledge scopes** (`COG.knowledgeScope`, `COG.perceive`) and **heuristic forecasts** (`COG.forecast`) with explicit Thai assumptions (`assumptionsTh`, `isEstimate: true`), never reading hidden applicant Potential Ability (`PA`) or unrevealed world secrets.
4. Make **deliberate martial and equipment choices** (`COG.techPreference`, `COG.evaluateTech`, `COG.reconcileLoadout`, `M.gearSuitability`, `M.classifyGearForNpc`) that account for weapon/armor conditions, `requiresWeapon`, skill proficiency, passive slot limits, durability, cost, swap hysteresis (`n._lastGearSwapAt`), and personal bag vs. sect shop provenance.
5. Maintain **multi-dimensional relationships, commitments, mentoring, and reciprocity** (`COG.relInfo`, `COG.startCommitment`, `COG.resolveCommitment`, `COG.completeMentorLesson`, `COG.giveMedicine`, `COG.giveGearGift`) while protecting high-value/transactional actions (`AI.PROTECTED_ACTS`, `AI.isProtectedAction`) from social or expedition interruption.
6. Exercise **bounded office authority, acting delegation, personality-dependent power/favoritism/self-dealing, and deference/flattery** (`COG.hasAuthority`, `COG.syncOfficeAuthority`, `COG.performDuty`, `COG.deferenceToward`, `COG.flatteryCandidate`, `COG.executeFlattery`, `COG.submitPetition`).

---

## 2. Module Responsibilities & Call Graph

| File | Responsibility | Key Entry Points |
|---|---|---|
| `js/human_core.js` | **LOCKED** 155-dimension human generator, effective trait reader (`HC.eff`), state drift, and fingerprint verification (`155:2f9c9dd7`). | `HC.generate`, `HC.eff`, `HC.practice`, `HC.feel`, `HC.experience` |
| `js/cognition.js` | Core NPC cognition engine: aspirations, multi-horizon goals, step decomposition, goal suspension/resumption, bounded knowledge & perception, heuristic forecasting, technique/loadout evaluation, multi-dimensional relationships, commitments, mentoring, medicine/gear sharing, office authority/delegation/orders/petitions, treasury skimming & discipline investigation, deference/flattery, and pure read-only UI explanation. | `COG.prepare`, `COG.modifiers`, `COG.finished`, `COG.blocked`, `COG.doesActionAdvanceGoal`, `COG.ensureAspiration`, `COG.knowledgeScope`, `COG.perceive`, `COG.forecast`, `COG.techPreference`, `COG.evaluateTech`, `COG.reconcileLoadout`, `COG.relInfo`, `COG.startCommitment`, `COG.resolveCommitment`, `COG.completeMentorLesson`, `COG.giveMedicine`, `COG.giveGearGift`, `COG.hasAuthority`, `COG.syncOfficeAuthority`, `COG.performDuty`, `COG.deferenceToward`, `COG.executeFlattery`, `COG.submitPetition`, `COG.explain` |
| `js/ai.js` | Per-minute NPC lifecycle (`AI.step`, `AI.needs`, `AI.interrupt`), action candidate evaluation (`AI.decide`), protected action gates (`AI.PROTECTED_ACTS`, `AI.isProtectedAction`), pair social lifecycle (`AI.socialStart`, `AI.proposePair`, `AI.acceptProb`, `AI.pairTick`, `AI.pairEnd`), and combat/skill practice (`AI.ACTS.practice`). | `AI.step`, `AI.decide`, `AI.isProtectedAction`, `AI.socialStart`, `AI.acceptProb`, `AI.proposePair`, `AI.pairTick`, `AI.pairEnd` |
| `js/martial.js` | Martial paths, subpaths, passive slot caps, weapon/armor condition checks, enhanced gear suitability scoring (`M.gearSuitability`), and 4-tier gear classification (`M.classifyGearForNpc`: `useful-now`, `valuable-to-own`, `gift-worthy`, `surplus`). | `M.gearSuitability`, `M.classifyGearForNpc`, `M.reconcilePassives`, `M.conditionMatches`, `M.isTechCompatible` |
| `js/cpeco.js` | Contribution Point (CP) economy, goal-aware shop purchasing (`CPE.pickPurchase`, `CPE.buy`) with gear swap hysteresis and manual-saving reservation, and daily welfare distribution (`CPE.welfareOfficer`, `CPE.welfareDaily`) with flattery bias and unfair-allocation complaint petitions. | `CPE.pickPurchase`, `CPE.buy`, `CPE.welfareOfficer`, `CPE.welfareDaily`, `CPE.daily` |
| `js/sect.js` | Sect offices (`SECT.POSTS`), observable applicant capability (`SECT.observableCapability`, `SECT.examineApplicant`), appointment scoring (`SECT.appointScore`) incorporating bounded flattery favor, and sect stock distribution (`SECT.distributeSectStock`). | `SECT.observableCapability`, `SECT.examineApplicant`, `SECT.appointScore`, `SECT.distributeSectStock`, `SECT.exposeEmbezzle` |
| `js/expedition.js` | Expedition team assembly (`EXPED.volunteer`) respecting `AI.isProtectedAction` and relationship/trust/rivalry modifiers, and expedition resolution (`EXPED.resolve`) recording `shared_danger` memories and comradeship bonds. | `EXPED.volunteer`, `EXPED.resolve` |
| `js/sim.js` | World clock, daily authority & passive loadout synchronization (`SIM.dailyUpdate`), and save/load serialization & dangling-reference sanitization (`SIM.serialize`, `SIM.deserialize`). | `SIM.tick`, `SIM.dailyUpdate`, `SIM.serialize`, `SIM.deserialize` |
| `js/ui.js` | Read-only Thai UI rendering (`UI.rNpc` overview and relationship tabs) displaying aspirations, current goal & step, blocked prerequisites, suspended goals, active commitments, heuristic forecasts (`[คาดการณ์]`), deference toward leadership, and multi-dimensional relationship metrics. | `UI.rNpc`, `UI.rSect` |

---

## 3. Bounded Serializable Data Structures

### 3.1 Per-NPC Cognition State (`n.cognition`)
```json
{
  "version": 1,
  "aspiration": {
    "id": "realm_ascender",
    "title": "มุ่งสู่ขอบเขตตบะที่สูงขึ้น",
    "descTh": "ทุ่มเทฝึกปรือเพื่อทะลวงคอขวดและก้าวขึ้นสู่ขั้นตบะที่สูงกว่าเดิม",
    "reasonTh": "ทะเยอทะยานและยึดมั่นวิถียุทธ์",
    "selectedAt": 518760,
    "nextReviewAt": 538920,
    "score": 84.5,
    "progress": 24,
    "milestones": [
      { "day": 365, "text": "สำเร็จเป้าหมาย「เตรียมตัวก้าวข้ามขอบเขต」" }
    ]
  },
  "goal": {
    "id": "scripture",
    "title": "ตั้งใจเรียน เพลงกระบี่เมฆาคราม",
    "targetId": "TECH_SWORD_AZURE_2",
    "createdAt": 520000,
    "expiresAt": 530080,
    "lastProgress": 520450,
    "blocked": 0,
    "status": "blocked_prereq",
    "step": "earn_cp",
    "stepTitle": "หาแต้มคุณูปการเพิ่มอีก 45 คป. เพื่อแลกเรียน「เพลงกระบี่เมฆาคราม」",
    "missingPrereq": "ยังขาดแต้มคุณูปการอีก 45 คป. (มี 35/80 คป.)",
    "progressSnap": { "stage": 2, "prog": 180, "cp": 35, "techCount": 3, "learningId": null, "learningGot": 0 }
  },
  "suspendedGoal": null,
  "lastGoal": {
    "id": "breakthrough",
    "title": "เตรียมตัวก้าวข้ามขอบเขต",
    "targetId": null,
    "endedAt": 519900,
    "status": "completed"
  },
  "commitment": null,
  "knowledge": {
    "updatedAt": 520400,
    "visibleTechIds": ["TECH_SWORD_1", "TECH_SWORD_AZURE_2"],
    "visibleGearIds": ["eq_101"],
    "knownShortageIds": ["MAT_HERB_DEW_GRASS_1"],
    "estimates": {}
  },
  "memory": [
    { "kind": "received_help", "zoneId": null, "subjectId": "n_master", "at": 519200, "severity": 0.5 }
  ],
  "trace": [
    { "at": 520450, "actionId": "forage", "reasons": [["เป้าหมาย: ตั้งใจเรียน เพลงกระบี่เมฆาคราม", 0.82]] }
  ],
  "flatterCd": { "n_master": 524000 },
  "flatteryHistory": {},
  "office": { "id": "member", "title": "สมาชิกสำนัก", "responsibility": "...", "acting": false, "delegated": false },
  "officeDecision": null,
  "nextReview": 520630
}
```
- **Bounds**:
  - `c.memory`: capped at `<= 24` entries (`shift()` on overflow, deduplicated by `(kind, zoneId, subjectId)`).
  - `c.trace`: capped at `<= 8` entries.
  - `c.aspiration.milestones`: capped at `<= 6` entries.

### 3.2 Sect Authority & Governance State (`W.sect`)
- `W.sect.delegations[post]`: `{ post, holderId, delegateId, since, until, reason }` — created by `COG.syncOfficeAuthority(W)` when an office holder is away, sealed, or jailed, and automatically revoked when the holder returns or is dismissed.
- `W.sect.officePlans[post]`: `{ by, title, targetId, actions, at, expiresAt, delegatedFrom? }` — bounded 24-hour office plans reviewed by `COG.reviewOffice(W, n)`.
- `W.sect.officeOrders[post]`: `{ id, post, by, title, targetId, actions, priority, at, expiresAt }` — actionable 24-hour directives weighted by subordinate duty and deference (`COG.deferenceToward`).
- `W.sect.petitions`: array of `{ id, npcId, kind, detail, accusedId, createdAt, expiresAt, status }`, capped at `<= 16` entries.
- `W.sect.auditTrail`: array of `{ day, t, actorId, kind, amt, evidence }`, capped at `<= 25` entries.

---

## 4. Key Invariants Enforced

1. **Zero Modification to `js/human_core.js`**: Verified by `node test/core_lock.js` (`155:2f9c9dd7`, SHA-256 `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`).
2. **Pure Read/Score/Explanation Functions**: `COG.explain`, `COG.modifiers`, `COG.role`, `COG.techPreference`, `COG.evaluateTech`, `COG.forecast`, `M.gearSuitability`, `M.classifyGearForNpc`, and `M.describe` never consume `W.rng` and never mutate `SIM.serialize(W)`. Transient per-tick caches (`_cogModCtx`, `_flatCache`, `_giftCache`, `_pickCache`, `_nextTechCache`) use leading underscores so `SIM.serialize` strips them automatically.
3. **Strict CA vs. PA Separation**: `SECT.observableCapability` and `SECT.examineApplicant` inspect only observable skills, physiology, age, cultivation stage, and demeanor, never hidden `aptitudes`, `root`, or latent `ext.applicant.quality`/`tier`. `COG.knowledgeScope(W, n).canSeeHiddenPA` is unconditionally `false`.
