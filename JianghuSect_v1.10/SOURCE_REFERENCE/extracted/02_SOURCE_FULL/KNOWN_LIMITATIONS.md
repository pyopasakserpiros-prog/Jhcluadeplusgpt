# Current 2.08 limitations

- No real Android device or Chromium executable was available for this run. UI handlers and actual offscreen Canvas are tested; touch/browser-layout behavior still needs device playtesting.
- Outside merchants have native NPC identities and finite cargo/stone ledgers; their arrival is represented by proposals rather than a new walking merchant animation.
- Outside restocking represents cargo arriving from the external world; external production and competing market buyers are not fully simulated.
- The new buildings reuse existing atlas art with distinct labels. Unique building art remains future work.
- The mission hall expands simultaneous economic gathering/production work, while the story sidecontract system still accepts one contract at a time.
- Long-run balance with 20–34 disciples requires further play evidence. Automated scenarios verify mechanisms and accounting, not universal balance.

---

Historical limitations follow; consult the current README/guide for completed 2.07 scope.

# Known limitations — 2.05

- No installed Chromium or physical Android device. UI verification uses actual startup/control handlers with offscreen native Canvas; this does not establish device FPS or browser layout correctness.
- The provided frozen save uses linear story schema1, whereas the uploaded source is branching schema2. The exact original linear executable is unavailable. The original EP4 exception is not conclusively identified; new-source branch completions and runtime fault recovery are verified separately.
- New game recommended. Unsupported old story schemas are rejected clearly. Historical save migration is outside the requested scope; current-release continuation remains required.
- Off-map fights still use shared-stat encounter summaries. Some technique lore maps to shared combat primitives.
- Seeded, controlled simulations test invariants and the specified scenarios, not universal balance or absence of all bugs.
