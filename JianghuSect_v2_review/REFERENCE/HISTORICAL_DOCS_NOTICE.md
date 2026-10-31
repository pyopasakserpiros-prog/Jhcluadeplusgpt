# Historical design documents — read as context, not as current authority

This folder contains earlier design notes that were prepared before the latest user decisions and before the current source audit was completed.

The current authoritative documents are:

- `PROMPT/GEMINI_IMPLEMENTATION_PROMPT_EN.md`
- `DESIGN/ELEMENTAL_ROOTS_SYSTEM_ARCHITECTURE_EN.md`
- `DESIGN/ROOT_GENIUS_RARITY_RULES.md`
- `AUDIT/SOURCE_AUDIT_REPORT_TH.md`

Important superseding decisions:

1. Old-version and old-save compatibility is NOT required. Any older document that recommends preserving legacy save migration is superseded.
2. Option A is selected: no special root-count trait = exactly 1 root; Dual = exactly 2; Triple = exactly 3; Fourfold = exactly 4.
3. There are eight ordinary birth-root elements. ASTRAL and BLOOD_DEMON are special elements, not ordinary birth roots.
4. A triple-root character with two HEAVENLY roots and one TRUE/SPIRIT root belongs to the 100–1,000-year rarity band.
5. Fourfold Heavenly roots are extraordinarily rare but have no hard unique limit.
6. `h.affinities` remains one object with 23 values; only the UI groups it as 8 elemental + 15 non-elemental.
7. The existing source handoff protects `js/human_core.js` byte-for-byte. This remains in force unless a technical blocker is explicitly documented and approved.
