# NPC personality patch ledger — main-1

Base: 0ae08a270af952dae5449c89b3bd47267124da34. User authorized independent implementation using useful Gemini notes; preserve main and core byte lock.

Ruling: use the existing checkout clone, not a worktree; main-1 is explicitly authorized. Inline implementation + one fresh final reviewer.
Ruling: combine useful goals, bounded outcome memory, personality/emotion/rhythm and role awareness now; defer gossip, automated combat rescue, succession vote/gratitude coupling, and weather stat bonuses. These need additional social/fight accounting and are not necessary to prove personality-driven goals and official duties. No runtime LLM.
Ruling: cognitive reads and scores consume no RNG. Goal and action selection may consume seeded simulation RNG; resulting trajectories legitimately differ from the old version. UI never advances simulation.
Ruling: role state derives from actual offices every decision, not rank alone. Assistants inherit responsibility, not permission to spend treasury or issue authority-only actions. Existing authorities remain enforcement points.
Ruling: no claim of full subjective/perception simulation this patch; hunters use existing discovered map state, with local safety and experience weighting. Explain actual observations accurately.

Tasks: (1) legendary spawn regression/fix, (2) cognition + behavioral tests and action hooks, (3) office choices and UI, (4) simulation/performance/review + handoff/build.

Implementation complete: bounded cognition and goal hooks, actual role authority and officer choices, new active five offices, planned locked five offices, role/goal UI and original legendary gate fixed. Final review found four P2 issues (action IDs, retreated commander, herb directive schema, unsupported gift pills), all reproduced and corrected; independent recheck found no unresolved issues. Explicit legendary-pool selection also gated so rare encounters retain their correct pool.

Validation: initial 42/42 suite and 360-day economy run passed; final exact-source suite/360-day results are recorded in test/results/assertions.json and test/results/long_npc_humanlike_360d.json. Browser verification uses a supervised local server; a historical exact runtime-version assertion was updated to 1.10.10. No human_core edits. README/HANDOFF updated. Main preserved.
