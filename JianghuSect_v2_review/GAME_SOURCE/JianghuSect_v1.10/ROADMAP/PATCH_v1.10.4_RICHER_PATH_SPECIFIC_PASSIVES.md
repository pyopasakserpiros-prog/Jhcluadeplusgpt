# Patch v1.10.4 — Richer Path-Specific Passives & Explicit Combat Profiles

## Overview & Scope
Patch **v1.10.4** delivers **P2: Richer path-specific passives** in strict accordance with the development roadmap:
- Added explicit native combat archetypes in `SK.ARCH` and `SK.profile`: **`support`**, **`heal`**, **`summon`**, and **`channel`**.
- Integrated authentic working target handlers and lifecycle logic in `js/combat.js`:
  - **`support`**: Party-wide buffing targeting all alive allies (`C.alliesOf(W, f, id)`) with morale (`morale`: +15% physical/magic attack), protective radiance (`holyAura`: +20% physical/magic defense), or wind speed (`haste`).
  - **`heal`**: Targeted ally restoration and cleansing targeting the lowest-HP percentage ally (`lowestAlly(W, f, a)`), healing a percentage of max HP and purging negative debuffs (`dot`, `slow`, `weaken`, `blind`, `armorbreak`, `mdefbreak`, `silence`, `stun`).
  - **`summon`**: Manifests a sub-unit (e.g. `TOTEM_BEAST_GOD` totem beast avatar, `PHANTOM_SOUL` phantom shadow decoy) participating as a combat unit with real HP, combat stats, finite round duration, and active aggro absorption; despawns cleanly on 0 HP or duration expiry without awarding enemy merits/kills.
  - **`channel`**: Multi-tick channeled ability with tick-by-tick payoff (`channel.ticks`, `tickM`) leading to a high-potency final payoff burst (`finishM`); features explicit interrupt mechanics (`interruptForce` on hard CC like `stun`, `silence`, or damage exceeding 12% max HP) resetting state with cooldown penalty and visual recoil.
- Harmonized path-specific passives and descriptive text across `data/data_expansion.js`, `js/cultivation.js`, and `js/stats.js` so all source Thai descriptions (`strengthTh`, `weaknessTh`, `summary`) match actual native engine execution logic verbatim.
- Preserved strict byte-lock on `js/human_core.js` (`155:2f9c9dd7` / `a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542`) and guaranteed 100% backward compatibility with legacy saves.

---

## Technical Implementations

### 1. Explicit Combat Profiles in `js/skills.js`
- **Archetype Definitions (`SK.ARCH`)**:
  - `support`: `{ nameTh: 'ท่าหนุนทัพ', icon: '✨', e: 0, cd: 22, wind: 4, hits: 0, cost: 1.2, team: true, desc: 'ปลุกขวัญและเสริมแกร่งฝ่ายตนเอง (เพิ่มโจมตี/ป้องกัน/เร่งสปีดแก่พวกพ้อง)' }`
  - `heal`: `{ nameTh: 'ท่าบำบัด', icon: '💚', e: 0, cd: 28, wind: 6, hits: 0, cost: 1.4, team: true, desc: 'ฟื้นพลังชีวิตและล้างสถานะร้าย (ช่วยพวกพ้องที่เจ็บหนักที่สุด)' }`
  - `summon`: `{ nameTh: 'วิชาอัญเชิญ', icon: '👥', e: 0, cd: 34, wind: 5, hits: 0, cost: 1.7, team: true, desc: 'อัญเชิญร่างจำลองหรือเทพอสูรเข้าร่วมรบชั่วคราว มีพลังชีวิตและช่วยต่อสู้' }`
  - `channel`: `{ nameTh: 'วิชาร่ายต่อเนื่อง', icon: '🌀', e: 1.5, cd: 20, wind: 2, hits: 1, cost: 1.4, off: true, channel: true, desc: 'เพ่งจิตร่ายวิชาต่อเนื่องทีละรอบ ปลดปล่อยความเสียหายสะสม แต่ถูกขัดจังหวะได้' }`
- **Subpath Weightings (`SUBW`)**:
  - Configured archetype weights for all specialization paths:
    - `WAR_DEITY`: heavy support weight (`support: 3.5`)
    - `MERCY_DEITY` & `MEDICINE_BODHI_GOD`: heavy heal & support weights (`heal: 3.5, support: 3`)
    - `TOTEM_BEAST_GOD`: avatar manifestation (`summon: 3.5`)
    - `PHANTOM_SOUL`: phantom shadow decoy (`summon: 2.5, counter: 2.5`)
    - `ASTRAL_ARRAY` & `SOUND_ZITHER`: channeled arrays and wave resonance (`channel: 3`)
    - `FROST_MOON_IMMORTAL`: ice reflection and chill control (`counter: 3.5, control: 2.5`)
    - `WOOD_SPRING_BODY`: bark defense and vitality recovery (`guard: 3, heal: 2.5, dot: 1.5`)
- **Status Additions (`SK.STATUS`)**:
  - `morale`: `{ nameTh: 'ขวัญกำลังใจ', icon: '🚩', pmods: { atk: .15, matk: .15 } }`
  - `holyAura`: `{ nameTh: 'รัศมีคุ้มกาย', icon: '✨', pmods: { def: .2, mdef: .2 } }`
  - `channeling`: `{ nameTh: 'กำลังร่ายต่อเนื่อง', icon: '🌀' }`

### 2. Native Combat Target Handlers & Mechanics in `js/combat.js`
- **Support Handler (`C.alliesOf`)**:
  - `C.alliesOf(W, f, id)` filters all alive friendly units on `C.sideOf(f, id)`.
  - In `useSkill`, applies party status buffs to all allies simultaneously.
- **Heal Handler (`lowestAlly`)**:
  - Selects ally with the lowest HP fraction on the same side.
  - Restores HP based on `p.heal * maxHp` and purges active debuffs.
- **Summon Lifecycle & Aggro**:
  - Instantiates `summonUnit` registered into `W.foes`, `W.foeById`, and `f[side]`.
  - Enemies target the summon unit via `C.enemies`.
  - Dissolves cleanly on 0 HP or duration expiry with `💨 สลายร่าง` without awarding merits.
  - Post-fight conclusion cleanses all summons from world state.
- **Channeling & Interrupt System**:
  - `C.resolveChannelTick(W, f, a, ctx)` handles multi-tick resolution and final payoff burst.
  - `C.interruptChannel(W, f, u, reason)` halts channeling on `stun`, `silence`, or damage $\ge 12\%$ max HP, enforcing a cooldown penalty and displaying `⚡ เสียสมาธิ!`.

---

## Verification & Acceptance Checklist

1. **Regression Suite (`test/combat_passives.js`)**:
   - `PASS 1`: Explicit combat profiles (support, heal, summon, channel) & summary text.
   - `PASS 2`: Support target handler (`C.alliesOf`) and party buff execution.
   - `PASS 3`: Heal target handler (`lowestAlly`) and debuff cleanse execution.
   - `PASS 4`: Summon creation, target aggregation, damage absorption, and clean despawn.
   - `PASS 5`: Channeled ability tick execution, interrupt handling, and completion.
   - `PASS 6`: Subpath passives alignment and descriptive text matching native effects.
2. **Master Test Suite (`test/run_all.js`)**:
   - All **20/20** test groups passed.
   - Byte-lock check on `js/human_core.js` passed (`155:2f9c9dd7`).
3. **Long Simulation (360-Day Full Assertion)**:
   - Run seed `v1104-seed1` completed 518,400 ticks with 64 NPCs.
   - Zero crashes, zero duplicate formulas, stable CP economy (price index 1.45), zero broken combat states.
