# Edit Hub Gap Analysis — main-1 / v1.12.4

## Verified runtime catalog state

Runtime-loaded source (with data registries and runtime modules loaded in index order) returns:

| Metric | Observed |
|---|---:|
| `SECT.EDITOR.catalog({}, {})` total | 1,102 descriptors |
| Legendary techniques | 12 |
| Legendary mantras | 10 |
| Legendary manuals/arts in catalog | 22 |
| First index of a `LEG_` manual descriptor | 857 |
| Legendary manuals in first 60 descriptors | 0 |
| `VC.LEGENDARY_WEAPONS` | 11 |
| Legendary weapon descriptors in Edit Hub catalog | 0 |
| Search `Legendary` | 0 results |
| Search `LEG_` | 22 results |

## Code locations

- `js/sect.js` — `EDITOR.catalog` builds the descriptor list.
- `js/sect.js` — `EDITOR.spawnItem` already checks `VC.LEGENDARY_WEAPON_BY_ID` for `EQUIPMENT` and can mint a legendary weapon by exact ID.
- `js/ui.js` — Edit Hub item section renders `catItems.slice(0, 60)`.
- `js/sect.js` — `EDITOR.EDITABLE_GROUPS`, `validateCharacterPatch`, `applyPatchToNpc`, preview/commit/undo flows define current character edit behavior.
- `js/ui.js` — character body tab shows only the top 10 values from `HC.AFF_ALL`.

## Why the current UI hides legendary content

The catalog already includes `JD.TECH.techniques` and `JD.TECH.mantras`, including all 22 legendary arts/mantras. However, their descriptors occur after hundreds of other entries; the UI displays only the first 60. Search does not include grade/rarity/effect metadata, so searching for the word `Legendary` returns nothing. Searching by `LEG_` works because the ID itself contains that string.

The 11 legendary weapons are registered in `VC.LEGENDARY_WEAPONS` and the item-spawner path can mint them, but the catalog never adds those descriptors. Therefore, this is a catalog/discoverability gap rather than a missing legendary weapon registry or minting hook.

## Required Edit Hub redesign

1. Build catalog entries from every relevant live registry, including `VC.LEGENDARY_WEAPONS`.
2. Include all 11 legendary weapons and all 22 legendary manuals/arts.
3. Search by ID, name, aliases, category, type, rarity/grade, tier, element, path/subpath, effect ID, effect description and source registry.
4. Replace the silent first-60 cutoff with pagination or virtualization and explicit result counts.
5. Add clear action distinctions: view, spawn item, grant manual, teach/unlock, equip, set mantra, edit metadata and adjust mastery must not be conflated.
6. Preserve unique UID, provenance and existing legendary-world uniqueness/anti-minting behavior.
7. Add root-count trait, root composition, per-root grade and mastery editing.
8. Validate exact root count, unique elements, allowed ordinary roots, special-element restrictions and mastery ranges.
9. Preview all downstream effects before commit.
10. Reconcile learned techniques/equipment using existing authorities and move invalid items safely rather than deleting them silently.
11. Invalidate every affected cache and make undo restore the complete state.
12. Add a coverage test that iterates every relevant registry and asserts each ID is discoverable or explicitly excluded with a reason.

## Affinity UI

Current character profile displays only 10 of 23 affinity values. Update it to show all 23 in two visual groups:

- 8 elemental affinities.
- 15 non-elemental aptitudes/disciplines.

Both groups must read from the same `h.affinities` object. Do not create a second affinity model.
