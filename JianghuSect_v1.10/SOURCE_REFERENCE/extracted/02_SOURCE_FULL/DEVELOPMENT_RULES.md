# Project development rules

Updated from the user instruction on 24 October 2026.

1. Preserve the NPC Human Foundation: 8 life values, 14 personality axes, and the established 68-axis identity model. Extend systems through activity descriptors, learned skills, knowledge, memories and world state. Do not reroll or replace the NPC foundation for each new subsystem.
2. NPCs act autonomously. Player support changes opportunities and incentives; living human participants use the same authoritative NPC registry, simulation clock and resource ledgers.
3. **New patches do not need to load older-patch saves.** Do not spend development time adding migration layers, historical save fixtures or cross-version compatibility tests. A new patch may require a fresh game. Save/load within the current patch should remain correct and unsupported data should fail clearly.
4. User grants creative freedom to improve Gemini mechanisms and adapt its useful systems. Implement coherent play rather than copying force-success or instant-progression helpers.

The existing 1.3 importer was already implemented before this policy change. Its presence does not establish a compatibility commitment for future patches.

5. Start future work from ROADMAP_TH.md. Update its done/pending scope and acceptance criteria in every source ZIP.
