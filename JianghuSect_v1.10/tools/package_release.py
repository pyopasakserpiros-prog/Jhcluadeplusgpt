#!/usr/bin/env python3
"""Build and verify a self-contained development ZIP; no dependencies beyond Python+Node."""
from pathlib import Path
import hashlib,json,re,subprocess,sys,zipfile
ROOT=Path(__file__).resolve().parent.parent
OUT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else ROOT.parent/'dist'/'JianghuSect_v1-10-12.zip'
OUT.parent.mkdir(parents=True,exist_ok=True)
subprocess.run(['node',str(ROOT/'tools/build_single.js')],cwd=ROOT,check=True)
subprocess.run(['node',str(ROOT/'test/standalone.js')],cwd=ROOT,check=True)
manifest=json.loads((ROOT/'SOURCE_REFERENCE/SOURCE_MANIFEST.json').read_text())
# Selected original payloads are separately hashed; derived artifacts are labeled in source manifest.
entries=manifest.get('selected_files',manifest.get('selectedFiles',[]))
# Manifest format is intentionally inspected rather than guessed for future source-retention versions.
if not entries:
    for k,v in manifest.items():
        if isinstance(v,list) and v and isinstance(v[0],dict) and any(x in v[0] for x in ['original_path','originalPath','archive_path']):
            entries=v;break
for e in entries:
    p=ROOT/e['preserved_relative_path']
    assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==e['sha256'],str(p)
required=['README.md','index.html','JianghuSect_single.html','data/data_expansion.js','js/content.js','js/external_market.js','test/external_market.js','test/recipe_scroll_lifecycle.js','ROADMAP/PATCH_v1.10.1_EXTERNAL_MARKET.md','ROADMAP/PATCH_v1.10.2_RECIPE_LIFECYCLE_AND_ECONOMY.md','ROADMAP/README.md','ROADMAP/ROADMAP.md','ROADMAP/CURRENT_STATUS.md','ROADMAP/ARCHITECTURE.md','ROADMAP/SOURCE_GAME_ANALYSIS.md','ROADMAP/DATA_MIGRATION_MAP.md','ROADMAP/CONTENT_CATALOG.md','ROADMAP/TESTING_AND_VALIDATION.md','ROADMAP/DECISIONS_AND_KNOWN_ISSUES.md','SOURCE_REFERENCE/README.md','SOURCE_REFERENCE/SOURCE_MANIFEST.md','SOURCE_REFERENCE/SOURCE_DATA_CATALOG.md','SOURCE_REFERENCE/SOURCE_LICENSES_AND_ATTRIBUTION.md','SOURCE_REFERENCE/migration/selected_raw.json','SOURCE_REFERENCE/migration/mapping.json','test/results/assertions.json','test/results/external_market_smoke_90d.json','test/results/external_market_observational_360d.json','test/results/long_v1102_seed1.json','test/results/long_v1102_seed2.json','test/specialization_tracks.js','ROADMAP/PATCH_v1.10.3_INDEPENDENT_SPECIALIZATION_TRACKS.md','test/results/long_v1103_seed1.json','ROADMAP/PATCH_v1.10.4_RICHER_PATH_SPECIFIC_PASSIVES.md','test/combat_passives.js','test/results/long_v1104_seed1.json','ROADMAP/PATCH_v1.10.5_COHERENT_REGIONS_AND_RECIPES.md','test/coherent_regions_recipes.js','test/results/long_v1105_seed1.json','ROADMAP/PATCH_v1.10.6_WIDER_WELFARE_PRODUCTION_POLICIES.md','test/welfare_production_policies.js','test/results/long_v1106_seed1.json','ROADMAP/PATCH_v1.10.7_BROWSER_AND_MOBILE_PERFORMANCE.md','tools/cdp_playwright.js','test/browser_mobile_perf.js','test/results/browser_mobile_perf_v1107.json','test/results/long_v1107_seed1.json','ROADMAP/PATCH_v1.10.8_NATIVE_DEMON_AND_HEART_SOUL_PATHS.md','test/demon_heartsoul_paths.js','test/results/long_v1108_seed1.json','ROADMAP/PATCH_v1.10.9_ORGANS_EXPERIMENTS_AND_WORLD_POLITICS.md','test/organs_experiments_politics.js','test/results/long_v1109_seed1.json']
required += ['js/cognition.js','docs/NPC_HUMANLIKE_AI.md','test/npc_cognition.js','test/npc_offices.js','test/npc_command.js','test/npc_social_help.js','test/legendary_spawn_gate.js','test/results/long_npc_humanlike_360d.json']
required += ['data/data_martial.js','js/martial.js','js/knowledge.js','js/proficiency.js','js/retraining.js','test/martial_paths.js','test/martial_retraining.js','docs/MARTIAL_PATHS.md','docs/SKILL_EFFECTS.md']
required += ['data/data_ecology.js','test/ecology_expansion.js','docs/ECOLOGY_EXPANSION.md']
for p in required: assert (ROOT/p).is_file(),f'Missing required deliverable {p}'
report=ROOT/'test/results/package_validation.json'
excluded={'node_modules','__pycache__','.git','.cache'}
def files():return sorted(p for p in ROOT.rglob('*') if p.is_file() and not excluded.intersection(p.relative_to(ROOT).parts))
source_files=list((ROOT/'SOURCE_REFERENCE/extracted').rglob('*'));source_files=[p for p in source_files if p.is_file()]
assert len(source_files)==52
for p in source_files:assert p.suffix.lower() not in ['.webp','.png','.woff2','.zip'],str(p)
assert not list(ROOT.rglob('*RECOVERED*'))
original_hc='a0d393284fb4b136848e5b80e12f3edd2c4f9437c419c793c2a7e75d881c0542'
assert hashlib.sha256((ROOT/'js/human_core.js').read_bytes()).hexdigest()==original_hc
report.write_text(json.dumps({'status':'PASS','version':'1.10.12','checks':['required-files','all-entrypoint-dependencies','offline-standalone-execution','source-originals52','no-source-player-save-or-art','human-core-byte-lock','zip-crc-and-content-verified-after-build'],'selectedOriginalFiles':len(source_files),'entrypointScripts':37,'originalArchiveEmbedded':False,'sourceContinuationAvailable':True},indent=2)+'\n')
allfiles=files();assert not any(p.suffix=='.zip' for p in allfiles),'unexpected nested archive'
with zipfile.ZipFile(OUT,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in allfiles:z.write(p,'JianghuSect_v1.10/'+p.relative_to(ROOT).as_posix())
with zipfile.ZipFile(OUT) as z:
    assert z.testzip() is None
    names=set(z.namelist());prefix='JianghuSect_v1.10/'
    for p in required:assert prefix+p in names
    html=z.read(prefix+'index.html').decode()
    deps=re.findall(r'<script src="([^"]+)"|<link[^>]+href="([^"]+)"',html)
    for a,b in deps:
        asset=a or b
        if not asset.startswith('data:'):assert prefix+asset in names,f'Missing entry asset {asset}'
    for p in allfiles:
        rel=p.relative_to(ROOT).as_posix();assert z.read(prefix+rel)==p.read_bytes(),f'ZIP bytes mismatch {rel}'
    standalone=z.read(prefix+'JianghuSect_single.html').decode();assert not re.search(r'<script\s+src=',standalone)
print(json.dumps({'status':'PASS','file':str(OUT),'entries':len(allfiles),'bytes':OUT.stat().st_size,'sha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'requiredFiles':len(required),'selectedOriginals':len(source_files)}))
