# CURRENT HANDOFF — NPC development

Read **[docs/NEXT_NPC_DEVELOPMENT_PROMPT.md](docs/NEXT_NPC_DEVELOPMENT_PROMPT.md)** for the complete current English implementation assignment. It supersedes historical task instructions elsewhere in this snapshot. The author delegates ordinary design choices to Gemini; Codex will review the returned work before integration into main-1.

Runtime baseline before this documentation-only update: `c0f277d8f3a48effe6f3d9c0d26ee79bd886e4a1` (both Phase 1–3 and technique v1.12). Active game source is `JianghuSect_v1.10/`; playable bundle is `JianghuSect_v1.10/JianghuSect_single.html`. The directory name is historical; do not infer runtime feature version from it.

The baseline passed 58 regression groups, three 90-day native runs and a short 100-NPC save/load check; these do not prove every technique, long-term economy or device performance is correct. See [integration review](JianghuSect_v1.10/docs/V112_INTEGRATION_REVIEW_TH.md). Source/tests/reference dependencies remain intact. Never modify `js/human_core.js`.

Historical handoff: [docs/history/HANDOFF_BEFORE_NPC_UPDATE.md](docs/history/HANDOFF_BEFORE_NPC_UPDATE.md). Its relative links were written for the old root location; use current root paths when resolving them. Historical briefs are background only, not active implementation orders.
