# Jianghu AI editing guidance
Read `AI_READ_FIRST_TH.md` first. Never load all files into the model context.
Target only the requested subsystem and its tests. `source/scripts/legacy.bundle.js` is a required immutable runtime dependency (~18 MB): use `rg` to locate symbols and inspect small ranges only. `source/scripts/human.js` is SHA-locked. Binary assets must not be read as text. Generated `dist/` and `evidence/` are not part of the AI source package.
For changes, add focused regression tests, run them, then `python3 tools/build.py` and verify the offline HTML. Preserve the current save schema and NPC identity model. Never claim device/browser testing without a device/browser run.
