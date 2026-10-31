# Edit Hub & Character UI Coverage Report

## 1. Registry-Driven Spawner Catalog (`SECT.EDITOR.catalog` & `catalogPaginated`)
- **Total Discoverable & Spawnable Catalog Entries**: **1115**
- **Breakdown by Category**:
  - `PROVISION`: **3** items
  - `MATERIAL`: **261** items
  - `PILL`: **8** items
  - `CRAFTED_PILL`: **120** items
  - `EQUIPMENT`: **169** items
  - `TECH_MANUAL`: **456** items
  - `CRYSTAL`: **37** items
  - `SUB_MANUAL`: **37** items
  - `RECIPE_SCROLL`: **14** items
  - `ORGAN`: **10** items
- **Legendary Coverage**:
  - Searching `"Legendary"` returns **33** items: all **11** Legendary Weapons (`VC.LEGENDARY_WEAPONS`) + all **22** Legendary Techniques & Mantras (`JD.TECH`).
- **Pagination & Filtering**:
  - `SECT.EDITOR.catalogPaginated(W, filters)` supports filtering by `search` (name, ID, `outItemId`, `recipeId`, `Legendary`, `ตำนาน`, element, path, subpath, effect IDs), `kind`, `tier`, `element`, `rarity`, and `dest`, with configurable page size (`40`, `80`, `150`) and zero silent 60-item truncation.
  - Direct actions supported from the catalog: **✨ เสก (Spawn)**, **⚔️ เสก+สวมใส่ (Spawn & Equip)** for equipment, and **📖 ถ่ายทอด (Direct Teach)** for manuals/mantras.

## 2. Character Root, Mastery & Affinity Editor
- **Root Count & Option A Capacity Trait Selector**: 1 to 4 roots (`ROOT_CAPACITY_SINGLE`, `TR_ROOT_CAPACITY_DUAL`, `TR_ROOT_CAPACITY_TRIPLE`, `TR_ROOT_CAPACITY_FOURFOLD`).
- **Per-Root Element & Grade Selectors**: Independent element (8 ordinary elements, duplicate-free) and grade (`DEFECTIVE`..`HEAVENLY`) per root slot.
- **Trainable Elemental Mastery & Special Elements**: Direct `0–100` inputs for all 8 ordinary elements + `ASTRAL` and `BLOOD_DEMON` mastery and unlock toggles.
- **All 23 Affinities**: Editable in `SECT.EDITOR.EDITABLE_GROUPS.affinities` and displayed in Character UI `body` tab grouped into **8 Elemental Affinities** + **15 Martial & Craft Affinities** reading from the single `h.affinities` object.
