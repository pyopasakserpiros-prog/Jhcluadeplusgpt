# NPC foundation lock — 1.5

The stable foundation is inherited from v1.2 without rewriting `human.js` or any of the 71 legacy source files. This is a game model with a stable extension contract, not a claim that numerical axes exhaust real human nature.

| Identity group | Axes |
|---|---:|
| Life values | 8 |
| Personality | 14 |
| Physical capacities | 14 |
| Cognition | 12 |
| Interests | 14 |
| Aptitudes | 6 |
| Total | 68 |

Human schema: **1**. `human.js` SHA256: `b230108298cae486c3dc6bf6698f0384ca67128b064ff3947f19fa6e5522328a`.

`references/npc-core-lock.json` contains that hash and the exact axis IDs, labels and paths. `HUMAN_REGISTRY.json` preserves those groups and exports the current activity descriptors. A regression test compares both against the lock. Stable fingerprints cover base identity and form; they intentionally exclude learned experience and temporary condition.

New systems define weighted activities using these existing axes, then store learned skills, knowledge, memories, relationships, duties, belongings and injuries in their corresponding mutable state. They must not invent a second intelligence/personality table, reroll existing people, or create UI-only human substitutes. Identity access continues through `HumanCore`, not through new parallel fields.

Read `NPC_IDENTITY_SPEC.md` and `HUMAN_FIELD_REFERENCE.md` for the original definitions and formulas. The 1.3 integration introduces external activity/skill domains including expedition, beast care, diplomacy and formation work; those describe experience and action, not new innate human axes.
