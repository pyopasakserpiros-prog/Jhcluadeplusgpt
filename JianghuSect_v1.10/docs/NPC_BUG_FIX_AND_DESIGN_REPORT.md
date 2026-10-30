> Original Gemini report from the uploaded ZIP. Its claims and numbers are historical; see CODEX_COMBINED_PATCH_REVIEW_TH.md and CODEX_COMBINED_VERIFICATION.json for independent review and post-fix results.

# NPC Bug-Fix Report and Behavior/Design Matrix (`v1.12.1`)

## Part 1: Confirmed Baseline Defects, Reproductions, Root Causes & Fixes

### Defect 1: False Goal Progress on Unrelated Action Completion (`js/cognition.js`)
- **Location**: `COG.finished(W, n, id)` in baseline `js/cognition.js`.
- **Symptom / Reproduction**:
  - In baseline `COG.finished`:
    ```js
    if (c.goal.id === 'scripture' && (id === 'study' || id === 'guidedStudy' || INCOME.includes(id))) c.goal.lastProgress = W.t;
    if (['breakthrough', 'rival', 'craft', 'service', 'crisis'].includes(c.goal.id) && (TRAIN.includes(id) || INCOME.includes(id) || id === 'duty' || id === 'personalBrew')) c.goal.lastProgress = W.t;
    ```
  - An NPC holding a `breakthrough` goal who completed a generic `farm` or `cook` action had `c.goal.lastProgress = W.t` refreshed even though cultivation stage and progress (`n.cult.prog`) did not increase at all. Consequently, stale goals never expired or replanned when an NPC was stuck doing unrelated chores.
- **Fix Implemented**:
  - Added `snapshotForGoal(W, n, goal)` and `COG.doesActionAdvanceGoal(W, n, goal, actionId)` in `js/cognition.js`.
  - `COG.finished(W, n, id)` now refreshes `c.goal.lastProgress = W.t` and `c.goal.progressSnap` **only** when `COG.doesActionAdvanceGoal(W, n, c.goal, id)` confirms both action relevance and actual state advancement toward the goal predicate (e.g., `n.cult.prog > snap.prog` or `n.cult.stage > snap.stage` for `breakthrough`; `n.cp > snap.cp` when earning CP for `scripture` or `gear_upgrade`; `learning.got > snap.learningGot` when studying).
- **Verification**: `test/npc_life_authority_overhaul.js` (Section 1: `unrelated action (farm) must NOT refresh breakthrough goal.lastProgress`, while `cultivate` advancing `n.cult.prog` updates `lastProgress`).

---

### Defect 2: Top-6 Candidate Slice Starving Valid Actions When Stations Are Busy (`js/ai.js`)
- **Location**: `AI.decide(W, n)` in baseline `js/ai.js`.
- **Symptom / Reproduction**:
  - Baseline `AI.decide` sorted `cands` by utility `S.u`, sliced `const top = cands.slice(0, 6)`, and only checked station availability (`a.where(W, n)`) for those 6 items.
  - In a busy 40–100 NPC sect where the top 6 stations (e.g., `meditate`, `dummy`, `lift`, `read`, `cauldron`, `forge`) were occupied, an NPC with valid runnable actions ranked #7 or #8 fell straight through to `idle` for 20 ticks (`n.act = { id: 'idle', left: 20 }`) instead of executing available fallback actions.
- **Fix Implemented**:
  - In `AI.decide(W, n)` (`js/ai.js`), after ordering the softmax-sampled `top = cands.slice(0, 6)`, up to 2 valid positive/non-penalized fallback candidates from `cands.slice(6).filter(c => c.S.u > -0.5)` are appended to `order` so they are evaluated ONLY when all top-6 candidates fail station reservation.
- **Verification**: `test/npc_life_authority_overhaul.js` (Section 2: `Station congestion / Top-6 starvation fix in AI.decide`).

---

### Defect 3: Social Pair Invitations and Expedition Volunteering Interrupting Active Crafts & Protected Services (`js/ai.js`, `js/expedition.js`)
- **Location**: `AI.socialStart(W, a)` in baseline `js/ai.js` and `EXPED.volunteer(W, need, max, filter)` in baseline `js/expedition.js`.
- **Symptom / Reproduction**:
  - In baseline `AI.socialStart`:
    ```js
    if (x.act.id === 'sleep' || x.act.id === 'breakthrough' || x.act.id === 'pair' || x.act.id === 'fight' || x.act.id === 'sentence') {
      if (x.act && (x.act.id === 'eat' || x.act.id === 'heal')) return;
      return;
    }
    ```
    Notice the inner `if (x.act.id === 'eat' || x.act.id === 'heal')` was unreachable dead code nested inside an incompatible outer `if`! Worse, `brew`, `forge`, `brewBasic`, `personalBrew`, `paidTraining`, `guidedStudy`, `retrain`, `specialize`, `wildHunt`, and `guard` were NOT protected at all — allowing a casual chat invitation or expedition call to cancel an in-progress craft or paid training session after CP/materials were committed!
- **Fix Implemented**:
  - Defined `AI.PROTECTED_ACTS` and `AI.isProtectedAction(W, n, inviteType)` in `js/ai.js`, covering `'sleep'`, `'breakthrough'`, `'fight'`, `'sentence'`, `'eat'`, `'heal'`, `'brew'`, `'forge'`, `'brewBasic'`, `'personalBrew'`, `'paidTraining'`, `'guidedStudy'`, `'retrain'`, `'specialize'`, `'wildHunt'`, and `'guard'`.
  - Enforced `AI.isProtectedAction` in `AI.socialStart`, `AI.proposePair`, `AI.acceptProb`, and `EXPED.volunteer`.
- **Verification**: `test/npc_life_authority_overhaul.js` (Section 5: `active brew must be protected from pair invitations` and `expedition volunteering`).

---

### Defect 4: Premature Goal Destruction on Station Block or Emergency (`js/cognition.js`)
- **Location**: `COG.prepare(W, n)` and `COG.blocked(W, n, id)` in baseline `js/cognition.js`.
- **Symptom / Reproduction**:
  - In baseline `COG.prepare`, whenever `!safe(n)` (e.g., temporary injury or low HP/energy), `c.goal` was overwritten with `recovery` and the prior medium-term goal was permanently lost.
  - In baseline `COG.blocked`, any 4 failed station checks (`if (c.goal.blocked >= 4) c.goal.expiresAt = W.t`) — even for actions unrelated to `c.goal` — immediately expired `c.goal`.
- **Fix Implemented**:
  - Added `c.suspendedGoal` in `COG.prepare(W, n)`: when `!safe(n)` interrupts an active non-recovery goal, the goal is saved in `c.suspendedGoal` with `suspendedAt: W.t`. Once `recovery` completes and `safe(n)` is restored, `c.suspendedGoal` is resumed with its expiration window extended by the pause duration.
  - Added `computeGoalStep(W, n, goal)` to decompose blocked goals into prerequisite sub-steps (`earn_cp`, `seek_access`, `gather_input`, `obtain_remedy`), and restricted `COG.blocked(W, n, id)` so `c.goal.blocked` only increments when the blocked action `id` is actually one of `c.goal`'s actions.
- **Verification**: `test/npc_life_authority_overhaul.js` (Section 1: emergency suspension into `suspendedGoal`, resumption after healing, and prerequisite step decomposition).

---

### Defect 5: Dead-End `received_help` Memory Without Consumers (`js/cognition.js`, `js/ai.js`)
- **Location**: `COG.giveMedicine(W, n, target)` in baseline `js/cognition.js`.
- **Symptom / Reproduction**:
  - Baseline `COG.giveMedicine` recorded `COG.remember(W, x, { kind: 'received_help', subjectId: n.id, severity: 0.5 })`, but `kind === 'received_help'` was never read anywhere in the codebase.
- **Fix Implemented**:
  - `COG.relInfo(W, a, b)` now consumes `received_help` (boosting `gratitude` and `trust`), `kept_commitment` and `shared_danger` (boosting `trust`), `broken_commitment` (reducing `trust`), and `unfair_allocation` (reducing `trust` and increasing `memResent`).
  - `AI.acceptProb`, `COG.helpCandidate` (reciprocal medicine sharing), `COG.giftCandidate` (surplus gear gifting), `EXPED.volunteer` (expedition cooperation), and `COG.deferenceToward` all read `COG.relInfo`.
- **Verification**: `test/npc_life_authority_overhaul.js` (Section 5: `received_help memory and gratitude must increase invitation acceptance probability`).

---

### Additional Subtle Bug Fixed During Implementation: Assistant Comparator Sign in `COG.syncOfficeAuthority`
- **Location**: `COG.syncOfficeAuthority(W)` in `js/cognition.js`.
- **Root Cause**: When sorting candidate delegates for an unavailable office holder, the comparator initially had `(a.assist === post ? 25 : 0) + SECT.relevance(post, b)` instead of `((b.assist === post ? 25 : 0) + SECT.relevance(post, b)) - ((a.assist === post ? 25 : 0) + SECT.relevance(post, a))`.
- **Fix & Verification**: Corrected comparator so the office's assigned assistant receives the +25 priority bonus; verified in `test/npc_life_authority_overhaul.js` (Section 6).

---

## Part 2: Complete Behavior & Design Matrix

| Prompt Requirement | Implemented Mechanism | Key Functions & State | Verification Test |
|---|---|---|---|
| **1. Persistent Life Aspirations** | 9 distinct aspirations (`realm_ascender`, `martial_master`, `scripture_scholar`, `master_alchemist`, `master_smith`, `sect_pillar`, `wealth_collector`, `wild_hunter`, `peaceful_companion`) scored from 155D traits, skills, and sect role with 14-day review cadence, switching hysteresis (+14 margin), and milestone history. | `COG.ASPIRATIONS`, `COG.evaluateAspirations`, `COG.ensureAspiration`, `COG.recordAspirationMilestone`, `n.cognition.aspiration` | `test/npc_life_authority_overhaul.js` (§1) |
| **2. Multi-Horizon Goal Continuity & Step Decomposition** | Medium-term goals decompose into concrete short-term steps (`earn_cp`, `seek_access`, `gather_input`, `obtain_remedy`, `study_now`, `buy_now`, `train_now`). Emergencies suspend active goals into `c.suspendedGoal` and resume them upon recovery. | `COG.prepare`, `computeGoalStep`, `snapshotForGoal`, `COG.doesActionAdvanceGoal`, `COG.finished`, `COG.blocked` | `test/npc_life_authority_overhaul.js` (§1), `test/npc_cognition.js` |
| **3. Bounded Knowledge & Heuristic Forecasting** | Role-scoped knowledge (`COG.knowledgeScope`), periodic perception of library/shop/shortages (`COG.perceive`), and deterministic heuristic forecasts (`affordability`, `huntRisk`, `invitation`, `reserves`) labeled `[คาดการณ์]`. | `COG.knowledgeScope`, `COG.perceive`, `COG.forecast`, `n.cognition.knowledge` | `test/npc_life_authority_overhaul.js` (§3) |
| **4. Strict CA vs. PA Separation** | Recruitment evaluation (`SECT.observableCapability`, `SECT.examineApplicant`) depends exclusively on observable Current Ability (CA) and never reads hidden `aptitudes`, `root`, or applicant `quality`/`tier`. | `SECT.observableCapability`, `SECT.examineApplicant`, `COG.knowledgeScope` | `test/npc_life_authority_overhaul.js` (§3), `test/phase1_recruitment_facilities.js` |
| **5. Deliberate Technique, Loadout & Equipment Evaluation** | `COG.techPreference` and `COG.evaluateTech` score path/subpath fit, weapon/armor condition match, passive slot availability, passive family overlap, combat archetype fit, and multi-move depth. `COG.reconcileLoadout` slots best compatible passives. `M.classifyGearForNpc` classifies gear into `useful-now`, `valuable-to-own`, `gift-worthy`, and `surplus` with swap hysteresis (`n._lastGearSwapAt`). | `COG.techPreference`, `COG.evaluateTech`, `COG.reconcileLoadout`, `M.gearSuitability`, `M.classifyGearForNpc`, `CPE.pickPurchase` | `test/npc_life_authority_overhaul.js` (§4), `test/martial_paths.js` |
| **6. Multi-Dimensional Relationships, Commitments, Mentoring & Gifting** | Relationships track `affection`, `trust`, `respect`, `gratitude`, `fear`, and `rivalry`. Protected actions (`AI.isProtectedAction`) prevent interruption of active crafts/healing/paid training. Accepted pair activities create commitments (`COG.startCommitment`/`COG.resolveCommitment`) that excuse emergencies. Mentors transfer study/mastery progress (`COG.completeMentorLesson`), and friends share pills (`COG.giveMedicine`) and gift surplus gear (`COG.giveGearGift`). | `COG.relInfo`, `AI.isProtectedAction`, `COG.startCommitment`, `COG.resolveCommitment`, `COG.completeMentorLesson`, `COG.giveMedicine`, `COG.giveGearGift`, `EXPED.volunteer`, `EXPED.resolve` | `test/npc_life_authority_overhaul.js` (§5), `test/npc_social_help.js` |
| **7. Office Authority, Jurisdiction, Delegation & Power Abuse** | `COG.hasAuthority` enforces domain jurisdiction. `COG.syncOfficeAuthority` delegates acting authority to eligible assistants/deputies when holders are away/sealed/jailed and revokes on return/dismissal. Low-integrity greedy treasurers can skim stones (`W.sect.auditTrail`), biased officers favor friends/flatterers in welfare/stock/appointments, Passed-over needy members file `complaint` petitions (`COG.submitPetition`), and high-integrity `discipline` elders expose embezzlement. | `COG.hasAuthority`, `COG.syncOfficeAuthority`, `COG.performDuty`, `CPE.welfareDaily`, `SECT.appointScore`, `SECT.distributeSectStock`, `COG.submitPetition` | `test/npc_life_authority_overhaul.js` (§6), `test/npc_offices.js`, `test/welfare_authority.js` |
| **8. Deference & Flattery** | `COG.deferenceToward` computes subordinate `deference`, `respect`, `fear`, and `resentment`. Ambitious/status-seeking NPCs can flatter superiors (`AI.ACTS.flatter`, `COG.executeFlattery`), resulting in `welcomed`, `distrusted`, or `ignored` based on persuasion vs. target `readPeople`/`judgement`/`integrity`/`pride` and repetition, with per-target (3d) and per-actor (1d) cooldowns. | `COG.deferenceToward`, `COG.flatteryCandidate`, `COG.executeFlattery`, `COG.flatteryBonus`, `AI.ACTS.flatter` | `test/npc_life_authority_overhaul.js` (§7) |
| **9. Explainable Thai UI Inspection** | `UI.rNpc` (`tab === 'ov'` and `tab === 'rel'`) renders long-term aspiration, medium-term goal, short-term step, blocked prerequisites, suspended goal, active commitment, `[คาดการณ์]` forecasts, deference toward leadership, and `ไว้ใจ` / `กตัญญู` / `ยำเกรง` relationship dimensions without mutating state or RNG. | `COG.explain`, `UI.rNpc` | `test/ui_content.js`, `test/npc_life_authority_overhaul.js` (§8) |
