# Root Genius Rarity Rules — User-Confirmed Design

**Status: LOCKED DESIGN INPUT · 31 October 2026**

## 1. Root quality order

Each individual root has its own grade. The order from highest to lowest is:

1. `HEAVENLY` — Heavenly Root
2. `TRUE` — True Root
3. `SPIRIT` — Spirit Root
4. `MORTAL` — Mortal Root
5. `DEFECTIVE` — Defective Root

A character can therefore have, for example, `FIRE / HEAVENLY` and `WOOD_LIFE / SPIRIT`. Never collapse all roots into one shared per-element grade.

## 2. Exact root-count rules — Option A

| Innate root-capacity trait | Exact active root count |
|---|---:|
| No special root-count trait | 1 |
| Dual Root trait | 2 |
| Triple Root trait | 3 |
| Fourfold Root trait | 4 |

The trait determines the exact root count, not merely a soft preference. Do not create five-root characters. Do not allow two conflicting root-count traits to coexist. A trait grants root count, not high root quality: a Fourfold Root character may have low-grade roots.

The default one-root state should not require an ordinary random personality trait. A dedicated root-capacity registry or a carefully integrated innate-trait extension is acceptable. Do not accidentally distribute Dual/Triple/Fourfold traits through the generic trait lottery without an explicit rarity model.

## 3. User-confirmed genius rarity patterns

| Root count | Grade composition | Expected world-scale rarity |
|---:|---|---|
| 1 | 1 × `HEAVENLY` | A genius; no exact calendar interval was locked |
| 2 | 1 × `HEAVENLY` + 1 × `TRUE` or `SPIRIT` | Every few years |
| 2 | 2 × `HEAVENLY` | About once per 100 years |
| 3 | 1 × `HEAVENLY` + 2 × (`TRUE` or `SPIRIT`) | About once per 100 years |
| 3 | 2 × `HEAVENLY` + 1 × (`TRUE` or `SPIRIT`) | Between 100 and 1,000 years |
| 3 | 3 × `HEAVENLY` | About once per 1,000 years |
| 4 | Any grade composition | About once per 10,000 years |
| 4 | 4 × `HEAVENLY` | Extremely rare; no hard unique limit and more than one may exist in the simulated world |

“Every N years” describes long-run expected world rarity, not a guarantee that one appears exactly at that date. Calibrate actual per-birth probabilities against the game's real number of births per world-year. A simulation that generates more NPCs must not silently make the same rarity pattern much more common.

The four-root category itself is exceptionally rare regardless of grade composition. The all-Heavenly four-root composition is rarer still, but must not be hard-coded as a one-of-one world singleton. Do not impose a global unique counter or a fixed cap of one.

## 4. Rarity is not power

Keep these dimensions separate:

- **Structural rarity:** how unusual the root count and grade composition are in the world.
- **Functional power potential:** how strongly a particular root supports the actual element used by a technique, cultivation method, subpath or item.

A four-root character with four `MORTAL`/`DEFECTIVE` roots is structurally rare but is not automatically stronger than a two-root character with two `HEAVENLY` roots. A rarity title is metadata for identity, history, reputation and events; it must not become a free global combat multiplier.

## 5. Generation requirements

Use a hierarchical, world-seed-deterministic generation process. Do not independently roll root-count trait, number of roots, each grade and a rarity title as unrelated random variables.

Recommended order:

1. Determine the character's root-count capacity trait / root-count class using world-scale probabilities.
2. Set the exact number of active roots from that class.
3. Select distinct root elements from the eight ordinary root elements.
4. Select a grade composition using probabilities calibrated to the confirmed rarity table.
5. Assign individual grades to individual root elements.
6. Derive a rarity classification from the resulting composition; never roll rarity independently.
7. Store the generated result so repeated save/load does not reroll it.

Use the game's deterministic world RNG. Do not use `Math.random()` for simulation or NPC generation. Tests must run many seeds and enough births to estimate the intended long-run frequency with confidence intervals.

## 6. Still open for Gemini's design judgment

The user has not prescribed exact probabilities for every unlisted composition (for example, Dual Root with no `HEAVENLY`, or a Triple Root with one `HEAVENLY` and lower grades). Gemini must design a complete, internally consistent probability model for all possible combinations, preserve the confirmed rows above, and explain the chosen distribution. Do not silently promote every high root count to high grades.
