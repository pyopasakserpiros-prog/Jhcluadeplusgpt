# Martial patch research and validation notes

Native-source audit (base e066ee1): five major paths (XIAN9/BODY5/GOD4/DEMON9/HEART_SOUL9 stages),35 subpaths including imported content,294 technique entries. Current combat stat computation includes static sub bonuses and physical formulas; avoid putting derived-body gains into both HC mutations and a second direct stat multiplier. Generic gear scoring currently feeds both shop and free distribution; both need identical suitability logic.

Discovery entrypoints needing a common eligibility/rate controller: explore pillar fragments, explore tech rewards, expedition fortune scrolls, diplomatic technique exchange, return loot settlement, wandering-master daily donation, content-pack regional manuals. Bootstrap library is a separately documented exception. Loot settlement should never roll another chance on a reward already gated at acquisition.

External inspiration attempt: official-hosted Guild Wars2 wiki Weapon, Attribute and Specialization pages were requested on2026-10-28. All were denied by the session network proxy (HTTP403 tunnel), so no external text was obtained, copied, or used as evidence. Design uses the user's requirements and actual native catalogs. Internet research is optional and does not block implementation.

Final review priorities: finite transfer/consumption and no paid item duplication; explicit known-manual price discount; deterministic conditional stats on equip/unequip; normalized tier curves across4/5/9 stage paths; physical/life bonuses change real outcomes; no automatic subpath chosen by a hidden initializer after gated choice; eligibility and rank-of-subpath state consistent across saved fields; no unbounded history or per-frame simulation mutation.
